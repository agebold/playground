# June chat proxy — Cloudflare Worker

Same contract as `tools/june-proxy.mjs`, but deployed — so the **GitHub Pages link
works for reviewers** without anyone running a local server or pasting an Anthropic
key into their own browser.

| Route | Auth | Purpose |
|---|---|---|
| `GET /health` | none | booleans only, so the client can discover the proxy before it's configured |
| `POST /chat` | `X-June-Key` | passthrough to the Claude Messages API |
| `POST /verify` | `X-June-Key` | pVerify EligibilitySummary, or `501` when no credentials are set |

## Deploy

```bash
cd PrevMed/june_insurance_chat/worker
npx wrangler login
npx wrangler secret put ANTHROPIC_API_KEY      # required
npx wrangler secret put JUNE_SHARED_SECRET     # pick any long random string
npx wrangler secret put PVERIFY_CLIENT_ID      # optional — enables live checks
npx wrangler secret put PVERIFY_CLIENT_SECRET  # optional
npx wrangler deploy
```

Generate a secret with `openssl rand -hex 24`.

Then add your Pages origin to `ALLOWED_ORIGINS` in `wrangler.toml` if it isn't
already covered (`*.github.io` and `localhost:8099` are built in), and redeploy.

Check it:

```bash
curl https://june-chat-proxy.<your-subdomain>.workers.dev/health
# {"ok":true,"anthropic":true,"pverify":false,...,"requiresKey":true,"worker":true}
```

## Point the prototype at it

Either open the panel → **Prompt** → *Local proxy*, paste the Worker URL and the
shared secret — or share a link that carries both:

```
https://<pages-host>/PrevMed/june_insurance_chat/index.html?present=1&proxy=https://june-chat-proxy.<sub>.workers.dev&key=<secret>
```

The status line should read **"Claude via Cloudflare Worker · key server-side"**.
`?proxy=` is only honoured for `https` (or localhost), so the secret can't be sent
over plain http.

## What the hardening is and isn't worth

Being straight about this, because it's easy to oversell:

- **CORS allowlist** — a real control. A page on another origin can't call it.
- **Shared secret** — a speed bump, not authentication. The page holds it in the
  browser, so everyone with the reviewer link has it. It stops someone who merely
  finds the URL from using your Anthropic quota.
- **Rate limit** — 30 requests/minute/IP, and **best-effort only**. It's in-isolate
  memory, and Workers run many isolates, so the real ceiling is higher than 30. A
  true quota needs a Durable Object or KV; that's deliberately not faked here.
- **The actual cost ceiling is a spend cap on the Anthropic key.** Set one before
  you share the link. Nothing above substitutes for it.
- Bodies are capped at 200 KB, `max_tokens` is clamped to 2000, and only expected
  fields are forwarded upstream so a crafted body can't set arbitrary parameters.

No PHI should go through this. The prototype uses a fixture member, and the
reviewer link is semi-public.

## Tests

```bash
../tests/run.sh          # includes the worker suite
```

`../tests/worker.html` runs this file's `fetch()` handler directly with a stubbed
`env` and `fetch`, covering CORS rejection, the secret check, rate limiting, the
`501`-without-credentials path, upstream field forwarding, and the `max_tokens`
clamp. No `wrangler dev` needed.
