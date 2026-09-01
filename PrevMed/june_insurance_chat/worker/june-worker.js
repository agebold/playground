/* ==========================================================================
   june-worker.js — Cloudflare Worker proxy for the June chat
   --------------------------------------------------------------------------
   Same contract as tools/june-proxy.mjs (GET /health, POST /chat, POST /verify)
   but deployable, so the GitHub Pages link works for reviewers without anyone
   running a local server or pasting an API key into their browser.

   This one is public, so it is hardened where the dev proxy is not:

     * CORS is locked to an explicit origin allowlist, not '*'.
     * A shared-secret header is required on /chat and /verify.
     * Per-IP rate limiting, best-effort.
     * Request bodies are capped, and max_tokens is clamped.
     * Only the fields we expect are forwarded upstream.

   Be honest about what the shared secret is worth: the page holds it in the
   browser, so anyone with the reviewer link has it. It stops drive-by use of
   the endpoint by anyone who merely finds the URL. The real cost ceiling is a
   spend cap on the Anthropic key — set one.

   Deploy:  see worker/README.md
   ========================================================================== */

const MAX_BODY = 200_000;      // the system prompt carries the knowledge corpus
const MAX_TOKENS_CAP = 2000;
const RATE_LIMIT = { windowMs: 60_000, maxRequests: 30 };

/* Best-effort per-IP limiting. Deliberately in-isolate: Workers run many
   isolates, so this is a speed bump, not a quota. A real quota needs a Durable
   Object or KV — noted in the README rather than pretended at here. */
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const bucket = hits.get(ip);
  if (!bucket || now - bucket.start > RATE_LIMIT.windowMs) {
    hits.set(ip, { start: now, count: 1 });
    if (hits.size > 5000) hits.clear();   // crude guard against unbounded growth
    return false;
  }
  bucket.count += 1;
  return bucket.count > RATE_LIMIT.maxRequests;
}

/* ---- CORS -------------------------------------------------------------- */

function allowedOrigins(env) {
  const extra = (env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return [
    'https://agebold.github.io',
    'https://izabela-del.github.io',
    'http://localhost:8099',
    'http://127.0.0.1:8099',
    ...extra,
  ];
}

function corsHeaders(request, env) {
  const origin = request.headers.get('Origin') || '';
  const ok = allowedOrigins(env).includes(origin);
  const h = {
    Vary: 'Origin',
    'Access-Control-Allow-Headers': 'Content-Type, X-June-Key',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Max-Age': '86400',
  };
  // Only echo an origin we actually allow — never '*' on a credentialed path.
  if (ok) h['Access-Control-Allow-Origin'] = origin;
  return { headers: h, allowed: ok, origin };
}

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json', ...cors.headers },
  });
}

/* ---- auth -------------------------------------------------------------- */

/** Constant-time-ish compare so the secret can't be probed byte by byte. */
function secretMatches(given, expected) {
  if (!expected) return true;                 // no secret configured = open
  if (typeof given !== 'string') return false;
  if (given.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < given.length; i++) diff |= given.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

async function readJson(request) {
  const raw = await request.text();
  if (raw.length > MAX_BODY) throw new Error('body too large');
  return JSON.parse(raw);
}

/* ---- pVerify auth ----------------------------------------------------- */
/* pVerify issues a bearer token from a client-credentials grant, then wants it
   plus Client-API-Id on each call. Cached per isolate; tokens last ~1h. */

let pvToken = null;
let pvTokenExp = 0;

async function pverifyToken(env, base) {
  if (pvToken && Date.now() < pvTokenExp - 60_000) return pvToken;
  const res = await fetch(base + '/Token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      Client_Id: env.PVERIFY_CLIENT_ID,
      Client_Secret: env.PVERIFY_CLIENT_SECRET,
      grant_type: 'client_credentials',
    }),
  });
  if (!res.ok) {
    throw new Error('pVerify token failed: ' + res.status + ' ' + (await res.text()).slice(0, 200));
  }
  const j = await res.json();
  pvToken = j.access_token;
  pvTokenExp = Date.now() + Number(j.expires_in || 3600) * 1000;
  return pvToken;
}

/* ---- handler ---------------------------------------------------------- */

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request, env);
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: cors.allowed ? 204 : 403, headers: cors.headers });
    }

    /* /health is intentionally open and secret-free: the client polls it to
       decide whether a proxy exists at all, and it leaks only booleans. */
    if (path === '/health' && request.method === 'GET') {
      return json({
        ok: true,
        anthropic: Boolean(env.ANTHROPIC_API_KEY),
        pverify: Boolean(env.PVERIFY_CLIENT_ID && env.PVERIFY_CLIENT_SECRET),
        pverifyEnv: env.PVERIFY_ENV || 'sandbox',
        model: env.MODEL || 'claude-opus-5',
        requiresKey: Boolean(env.JUNE_SHARED_SECRET),
        worker: true,
      }, 200, cors);
    }

    if (!cors.allowed) {
      return json({ error: 'origin not allowed: ' + (cors.origin || '(none)') }, 403, cors);
    }
    if (!secretMatches(request.headers.get('X-June-Key'), env.JUNE_SHARED_SECRET)) {
      return json({ error: 'missing or bad X-June-Key' }, 401, cors);
    }

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (rateLimited(ip)) {
      return json({ error: 'rate limited — try again in a minute' }, 429, cors);
    }

    /* ---- POST /chat ---- */
    if (path === '/chat' && request.method === 'POST') {
      if (!env.ANTHROPIC_API_KEY) {
        return json({ error: 'ANTHROPIC_API_KEY is not set on the worker' }, 503, cors);
      }
      let payload;
      try {
        payload = await readJson(request);
      } catch (err) {
        return json({ error: 'bad request body: ' + err.message }, 400, cors);
      }
      if (!Array.isArray(payload.messages) || !payload.messages.length) {
        return json({ error: 'messages[] is required' }, 400, cors);
      }

      try {
        const upstream = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
          },
          // forward only what we expect, so a crafted body can't set arbitrary
          // upstream parameters
          body: JSON.stringify({
            model: payload.model || env.MODEL || 'claude-opus-5',
            max_tokens: Math.min(Number(payload.max_tokens) || 700, MAX_TOKENS_CAP),
            system: payload.system,
            messages: payload.messages,
          }),
        });
        return new Response(await upstream.text(), {
          status: upstream.status,
          headers: { 'Content-Type': 'application/json', ...cors.headers },
        });
      } catch (err) {
        return json({ error: 'upstream failed: ' + err.message }, 502, cors);
      }
    }

    /* ---- POST /verify ---- */
    if (path === '/verify' && request.method === 'POST') {
      if (!env.PVERIFY_CLIENT_ID || !env.PVERIFY_CLIENT_SECRET) {
        // The client reads 501 as "stay simulated", which is the honest answer.
        return json({ error: 'pVerify credentials are not set on the worker' }, 501, cors);
      }
      let payload;
      try {
        payload = await readJson(request);
      } catch (err) {
        return json({ error: 'bad request body: ' + err.message }, 400, cors);
      }

      // NOT VERIFIED against pVerify's docs — confirm the host for your account.
      const base = (env.PVERIFY_BASE_URL || 'https://api.pverify.com').replace(/\/$/, '');
      try {
        const token = await pverifyToken(env, base);
        const upstream = await fetch(base + '/API/EligibilitySummary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
            'Client-API-Id': env.PVERIFY_CLIENT_ID,
          },
          // field names match assets/pverify.js, which mirrors pVerify's own
          // Java client (github.com/pVerify/restapijava)
          body: JSON.stringify({
            payerCode: payload.payerCode || '',
            payerName: payload.payerName || '',
            provider: payload.provider || {},
            subscriber: payload.subscriber || {},
            isSubscriberPatient: payload.isSubscriberPatient || 'True',
            doS_StartDate: payload.doS_StartDate,
            doS_EndDate: payload.doS_EndDate,
            serviceCodes: payload.serviceCodes || '30',
            includeTextResponse: false,
          }),
        });
        return new Response(await upstream.text(), {
          status: upstream.status,
          headers: { 'Content-Type': 'application/json', ...cors.headers },
        });
      } catch (err) {
        return json({ error: 'pVerify failed: ' + err.message }, 502, cors);
      }
    }

    return json({ error: 'not found' }, 404, cors);
  },
};
