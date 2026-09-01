#!/usr/bin/env node
/* ==========================================================================
   june-proxy.mjs — local dev proxy for the June insurance-verification chat
   --------------------------------------------------------------------------
   A browser must never hold an Anthropic API key or pVerify credentials, so
   they live here instead and the page calls localhost.

   This is a DEV AID. It is not deployable as-is: CORS is permissive and there
   is no auth. The repo deploys to GitHub Pages, which cannot run serverless
   functions at all — so for a shareable link either use the panel's
   browser-key mode with a throwaway key, or port this file to a Cloudflare
   Worker (the pattern dynamic-header/assets/js/ai-coach.js already uses).

   Run:
     node PrevMed/june_insurance_chat/tools/june-proxy.mjs

   Environment:
     ANTHROPIC_API_KEY     required for POST /chat
     PVERIFY_CLIENT_ID     optional — enables live POST /verify
     PVERIFY_CLIENT_SECRET optional
     PVERIFY_ENV           'sandbox' (default) | 'production' — label only
     PVERIFY_BASE_URL      override the API host (default https://api.pverify.com)
     PORT                  default 8788

   Routes:
     GET  /health   -> { ok, anthropic, pverify, model }
     POST /chat     -> passthrough to the Claude Messages API
     POST /verify   -> pVerify EligibilitySummary, or 501 without credentials
   ========================================================================== */

import { createServer } from 'node:http';

const PORT = Number(process.env.PORT || 8788);
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN || '';
const PV_ID = process.env.PVERIFY_CLIENT_ID || '';
const PV_SECRET = process.env.PVERIFY_CLIENT_SECRET || '';
const PV_ENV = (process.env.PVERIFY_ENV || 'sandbox').toLowerCase();
// NOT VERIFIED against pVerify's docs — confirm the correct host for your
// account before trusting a live run, and override with PVERIFY_BASE_URL.
// Sandbox and production may or may not share a host depending on the account.
const PV_BASE = (process.env.PVERIFY_BASE_URL || 'https://api.pverify.com').replace(/\/$/, '');

const MAX_BODY = 200_000; // the system prompt carries the knowledge corpus

/* ---- helpers ----------------------------------------------------------- */

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  // X-June-Key makes the request non-simple, so it must be allowed here or the
  // browser blocks the call before it is ever sent. The dev proxy ignores the
  // value; only the deployed Worker checks it.
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-June-Key');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
}

function json(res, code, obj) {
  cors(res);
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(obj));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (c) => {
      raw += c;
      if (raw.length > MAX_BODY) { req.destroy(); reject(new Error('body too large')); }
    });
    req.on('end', () => resolve(raw));
    req.on('error', reject);
  });
}

/* ---- pVerify auth ------------------------------------------------------ */
/* pVerify issues a bearer token from a client-credentials grant, then wants
   it plus Client-API-Id on every eligibility call. Tokens last ~1h, so cache. */

let pvToken = null;
let pvTokenExp = 0;

async function pverifyToken() {
  if (pvToken && Date.now() < pvTokenExp - 60_000) return pvToken;
  const body = new URLSearchParams({
    Client_Id: PV_ID,
    Client_Secret: PV_SECRET,
    grant_type: 'client_credentials',
  });
  const r = await fetch(PV_BASE + '/Token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!r.ok) throw new Error('pVerify token failed: ' + r.status + ' ' + (await r.text()).slice(0, 200));
  const j = await r.json();
  pvToken = j.access_token;
  pvTokenExp = Date.now() + (Number(j.expires_in || 3600) * 1000);
  return pvToken;
}

/* ---- server ------------------------------------------------------------ */

const server = createServer(async (req, res) => {
  if (req.method === 'OPTIONS') { cors(res); res.writeHead(204); res.end(); return; }

  const url = new URL(req.url, 'http://localhost');

  if (url.pathname === '/health') {
    return json(res, 200, {
      ok: true,
      anthropic: Boolean(ANTHROPIC_KEY),
      pverify: Boolean(PV_ID && PV_SECRET),
      pverifyEnv: PV_ENV,
      model: 'claude-opus-5',
    });
  }

  /* ---- POST /chat ---- */
  if (url.pathname === '/chat' && req.method === 'POST') {
    if (!ANTHROPIC_KEY) {
      return json(res, 503, { error: 'ANTHROPIC_API_KEY is not set on the proxy' });
    }
    let payload;
    try {
      payload = JSON.parse(await readBody(req));
    } catch (err) {
      return json(res, 400, { error: 'bad request body: ' + err.message });
    }

    try {
      const upstream = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: payload.model || 'claude-opus-5',
          max_tokens: Math.min(Number(payload.max_tokens) || 700, 2000),
          system: payload.system,
          messages: payload.messages || [],
        }),
      });
      const text = await upstream.text();
      cors(res);
      res.writeHead(upstream.status, { 'Content-Type': 'application/json' });
      res.end(text);
    } catch (err) {
      return json(res, 502, { error: 'upstream failed: ' + err.message });
    }
    return;
  }

  /* ---- POST /verify ---- */
  if (url.pathname === '/verify' && req.method === 'POST') {
    if (!PV_ID || !PV_SECRET) {
      // The client treats this as "stay simulated", which is the honest answer.
      return json(res, 501, { error: 'pVerify credentials are not set on the proxy' });
    }
    let payload;
    try {
      payload = JSON.parse(await readBody(req));
    } catch (err) {
      return json(res, 400, { error: 'bad request body: ' + err.message });
    }

    try {
      const token = await pverifyToken();
      // Field names match assets/pverify.js, which mirrors pVerify's own
      // Java client (github.com/pVerify/restapijava).
      const body = {
        payerCode: payload.payerCode || '',
        payerName: payload.payerName || '',
        provider: payload.provider || {},
        subscriber: payload.subscriber || {},
        isSubscriberPatient: payload.isSubscriberPatient || 'True',
        doS_StartDate: payload.doS_StartDate,
        doS_EndDate: payload.doS_EndDate,
        serviceCodes: payload.serviceCodes || '30',
        includeTextResponse: false,
      };
      const upstream = await fetch(PV_BASE + '/API/EligibilitySummary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
          'Client-API-Id': PV_ID,
        },
        body: JSON.stringify(body),
      });
      const text = await upstream.text();
      cors(res);
      res.writeHead(upstream.status, { 'Content-Type': 'application/json' });
      res.end(text);
    } catch (err) {
      return json(res, 502, { error: 'pVerify failed: ' + err.message });
    }
    return;
  }

  json(res, 404, { error: 'not found' });
});

server.listen(PORT, () => {
  console.log('June proxy listening on http://localhost:' + PORT);
  console.log('  Claude   : ' + (ANTHROPIC_KEY ? 'key present' : 'NO KEY — set ANTHROPIC_API_KEY'));
  console.log('  pVerify  : ' + (PV_ID && PV_SECRET ? 'credentials present (' + PV_ENV + ')' : 'not configured — checks stay simulated'));
  console.log('  Health   : http://localhost:' + PORT + '/health');
});
