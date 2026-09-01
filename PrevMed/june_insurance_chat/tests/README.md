# June test suite

No node is installed on this machine, so everything runs in **headless Chrome**.

```bash
./PrevMed/june_insurance_chat/tests/run.sh
```

`run.sh` starts `serve.py` (repo root on :8099) and `mock-proxy.py` (:8788), runs
all nine suites, and exits non-zero if any assertion fails.

| Suite | What it covers | Clock |
|---|---|---|
| `logic.html` | validated setters, guardrails, safety tiers, intent routing, directive parsing, `pVerify.normalize` for every fixture, RAG chunking/scoring, flow-spec integrity, copy compliance, `skipIf` sandbox | virtual |
| `integration.html` | drives the real page: all eight outcomes, non-blocking exits, skip conditions, photo and save-and-resume paths, inline validation, safety on typed input, help sheet, a11y spot checks | virtual |
| `a11y.html` | WCAG contrast for every shipped colour pair, 14px floor, reduced-motion, `[hidden]` enforcement, design-system breakpoints | virtual |
| `proxy-unit.html` | runs `tools/june-proxy.mjs`'s request handler with stubbed `createServer`/`process`/`fetch`: routes, CORS, `/health`, 501 without pVerify creds, key stays server-side, `max_tokens` cap, 400/404 | virtual |
| `worker.html` | imports `worker/june-worker.js` and drives its `fetch()` with a stubbed `env`: CORS allowlist (and that `/health` stays open for discovery), shared-secret check incl. same-length mismatch, per-IP rate limiting, `501` without pVerify creds, token-then-eligibility ordering, and that only expected fields reach Anthropic — an injected `temperature`/`tools`/`metadata` is dropped | virtual |
| `rag.html` | real IndexedDB: seeding, persistence, idempotency, inline vs retrieval switching, disabling a doc, brain integration | **real** |
| `live.html` | real store behind the real page: panel doc list, assembled-prompt preview, a chat turn with live retrieval | **real** |
| `proxy-path.html` | the `proxy` transport end to end against `mock-proxy.py`: detection, a model turn, guardrail rejection of an invented figure, validated `set_field`, the `X-June-Key` header on both `/chat` and `/verify`, live pVerify + its failure fallback, graceful degradation when the proxy dies | **real** |
| `persistence.html` | reloads the page and checks what survives: prompt (including a keystroke-only edit that never blurred), step copy and Notes for June, outcome copy, scenarios, member fixture, checklist, knowledge documents; that logs and metrics correctly do *not*; that newly shipped outcomes merge into an old saved config without clobbering edits; and that a `?proxy=` link is honoured only over https | **real** |

## Why two clocks

`--virtual-time-budget` fast-forwards timers, which makes the deterministic
suites quick — but it **starves IndexedDB**, leaving `indexedDB.open()` pending
forever. The three real-time suites therefore hold the load event open with
`<img src="/__delay=N">`, which `serve.py` answers after a real sleep, so
`--dump-dom` fires only once the assertions have finished.

That starvation is also why `JuneRAG.open()` has a timeout and
`JuneBrain.respond()` races retrieval against one: a stalled knowledge store
must never stall a conversation turn.

## Notes

- `mock-proxy.py` speaks the same contract as `tools/june-proxy.mjs` and keys
  its replies off the user message (`CHIPS`, `BADNUM`, `SETFIELD`, member ID
  `FAIL0000`) so the client's guardrail and fallback paths can be driven.
- `tools/june-proxy.mjs` itself is exercised by `proxy-unit.html` rather than
  actually listening on a socket — running it needs node, which isn't installed
  here. `worker/june-worker.js` is a plain ES module with no node builtins, so
  `worker.html` imports it directly and calls its handler.
- `worker.html` hands the worker a small stand-in request object rather than a real
  `Request`: `Origin` is a forbidden header name, so a browser silently drops it,
  which would make every call look cross-origin and mask the CORS logic entirely.
