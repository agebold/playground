# June — manual insurance verification in chat

An AI chat that confirms a member's Medicare coverage **after their intake call is
already booked**, so the Care Coordinator call can be about care instead of reading
numbers off a card.

Open `index.html` over http (not `file://` — IndexedDB and `fetch` are blocked on
file origins):

```bash
python3 PrevMed/june_insurance_chat/tests/serve.py
# → http://localhost:8099/PrevMed/june_insurance_chat/index.html
```

Add `?present=1` to hide the control panel for user testing.

---

## What problem this is solving

From the brief (FigJam `Weight-management-MVP`, node `1887:4766`):

> Currently, collecting Member ID while pVerify fails is optional, and we still pass
> through patients without confirming their insurance. This allows ineligible patients
> to go into the CCC but still find themselves ineligible.
>
> **How might we confirm coverage for more patients without adding friction for making
> an appointment, and allow CCs to focus on what matters?**

Four constraints from the brief shape everything here:

1. **The user is a patient pVerify already failed on**, right after booking. Medicare or
   Medicare Advantage, on mobile, card not always in hand. This is a **repair** flow —
   the only new ask is the member ID.
2. **"Any new ask has to sit outside the path to an appointment."** June is *offered*,
   never required, and leaves the appointment untouched. Expected capture is 20–30%, so
   the 70–80% who decline have to exit feeling fine, not feeling behind.
3. **pVerify needs** insurance type (e.g. HMO), sub-insurance and Part D — looked up with
   *name, DoB, or SSN (from Verified)*, all of which we already hold.
4. **Verify before the call**, so Coordinator time shifts from data collection to
   conversion.

## The first screen

Built from Figma `Manual insurance verificaion` (`gjxPCXhNSoFwES3Nl7Eh7G`), node
`94:20374`. Seven modules; **the first two are interactive**, the rest are rendered.

| Module | State |
|---|---|
| **1 · To do (1/2 done)** | **Interactive.** *Verify insurance* card with a 1-min tag and a June line, plus a completed *Schedule appointment* row. **Start** opens the chat; **I don't have my card** opens it directly on save-and-resume. |
| **2 · Appointment booked!** | **Interactive.** The coordinator card. **Add to calendar** and **More** open their designed sheets, and the **ⓘ** beside the goal explains where it came from. |
| 3 · About your program | Rendered. Plan badge, GLP-1 program name, and the approved United coverage copy. |
| 4 · Video | Rendered. Real title/attribution text over a committed poster; not playable. |
| 5 · Learn more | Rendered. Three resource cards on a scroll-snap rail. |
| 6 · FAQ | Rendered. Seven rows, presentational. |
| 7 · Additional links | Rendered. Patient-portal row. |

Modules 3–7 are deliberately **presentational, not fake**: they add nothing to the tab
order and contain no `href="#"`. A focusable control that does nothing is announced to a
screen reader as actionable, which is worse than plainly inert markup. To make the FAQ
real, add body copy and swap the rows to `@bold/web`'s `Details` component — the styling
is already in place.

### Headers

Both are built from their Figma components rather than approximated:

- **App header** (`94:20376`) — a centred Bold wordmark between two 44px boxes. The left
  one is invisible: it exists only to keep the logo optically centred, so it is
  `aria-hidden` and out of the tab order. The right is the menu button.
- **Chat header** (Ai-Chat `163:1570`) — a 40px rounded-**square** back button (not a
  circle), the 40px June orb, "June" at 20/24, the AI pill, and a 46px circular
  read-aloud button. The back button keeps a 44px hit area via padding so the target
  floor holds without changing the 40px visual box.

### The June orb

The four exported variants live in `assets/img/june-orb-{lg,sm}{,-happy}.svg` and are
referenced with plain `<img>`. An earlier build fetched and inlined them with a gradient
fallback, which meant **the artwork silently disappeared on `file://` origins** — i.e.
any time the prototype was opened directly instead of served. There is no fallback now:
`tests/integration.html` asserts every orb's `naturalWidth > 0`, so a broken path fails
the suite instead of quietly degrading.

Two export quirks worth knowing if you swap these assets:

- Figma exports with `preserveAspectRatio="none"`, which stretches the sphere into an egg
  as soon as the box aspect differs from the viewBox. It is stripped from every committed
  SVG, and a test asserts the rendered orbs stay round.
- The SVG canvas includes the orb's glow as transparent padding, so the sphere is only
  ~68% of the artwork. The design compensates with negative insets; here the `<img>` is
  scaled to 147% and allowed to overflow its box, sized on one axis only so the aspect
  can't drift.

The **Happy** variants are committed but not yet wired — an obvious use is the confirmed
coverage outcome.

### Why the To-do list is a better home for the ask

The brief's hard constraint is *"any new ask has to sit outside the path to an
appointment."* The invitation card this replaced had a **Not now** button, which made
declining a decision the member had to take. A to-do item you can simply scroll past
serves that constraint better, so the decline path is now "ignore it" and there is no
dismiss control — matching the design.

### Removed to match Figma exactly

| Removed | What it costs |
|---|---|
| Persistent "Need help? (424) 577-5266" row | Runs against the `senior-onboarding-design` rule about a visible support number on every step. The number still appears in the chat's scripted answers, so it isn't gone — but this is a real, knowing deviation. |
| "Already confirmed" state | The Scenarios **silent-retry lever** no longer changes this screen; it only shows in Measures. The "who sees June at all" demo is weaker. Restoring it is easy — Card B already has the done styling, so the list would read `2/2 done`. |
| HIPAA privacy line | Privacy reassurance now lives only in the chat's `why_we_ask` sheet. |
| **Not now** | By design — see above. The chat's own "Finish this later" exits are untouched, so the deferred outcome is still reachable and still measured. |

## The least-friction ladder

The flow spends our own data before it spends the patient's effort. Each rung is only
reached when the one above fails, and the Measures tab reports which rung ended a run.

1. **Silent retry** — re-run pVerify with the name, DoB and SSN already on file. If this
   works the patient never sees June at all. (Toggle it in Scenarios.)
2. **Ask for the member ID** — one field, with "How can I find this?"
3. **Card photo** — front and back, for anyone who can't type an ID.
4. **Save and resume** — text or email a link for when the card turns up.
5. **Exit clean** — "your coordinator will handle it on your call."

## Outcomes

Eight terminal states. Every one names what the coordinator will now do, and every one
offers both a next step and a route back to the dashboard.

| Outcome | pVerify signal |
|---|---|
| Confirmed, $0 | active · in-network · `IsHMOPlan:false` · no patient responsibility |
| Confirmed, has a cost | copay or coinsurance remaining |
| Still can't find it | `APIResponseCode` ≠ 0 / not found |
| HMO — referral needed | `IsHMOPlan:true` |
| Not covered | `InNetwork:"No"` |
| Pending | `IsPayerBackOffice:true` — pVerify is not real-time for every payer |
| No Part D route | GLP-1 member with an empty `MedicareInfoSummary.PharmacyPayerName` |
| Declined / deferred | the member opted out at any point |

## Control panel

| Tab | What it does |
|---|---|
| **Flow** | The step-by-step editor. Reorder, disable, duplicate or add steps; edit June's copy, the chip options, the state field written and the skip condition. Each step also has a **"Notes for June"** prose box that is injected into the system prompt *for that step* — so you can steer narration and asides without touching the script. Raw-JSON escape hatch included. |
| **Prompt** | The system prompt, plus a read-only preview of the fully assembled prompt exactly as the model receives it (identity → knowledge → live step and state). |
| **Knowledge** | Drop or paste `.md` / `.txt`. Per-doc token counts, a corpus budget gauge, and which chunks were used on the last turn. |
| **Scenarios** | The pVerify outcome switcher, the silent-retry lever, member fixture, latency, and a live-pVerify toggle that stays disabled unless the proxy reports credentials. |
| **Measures** | The brief's own metrics, live: member ID submitted, coverage confirmed, which rung ended the run, and the event stream that would fire in production. |
| **Debug** | Per-turn log (system-prompt size, chunks used, latency, which guardrail fired), a button to force a bad model reply, and an edge-case checklist. |

Panel state persists in `localStorage`; documents live in IndexedDB. Export / Import JSON
is in the Scenarios tab, so a configuration can be shared for review.

## How Claude is wired in

`assets/june-brain.js`. The division of labour is the design doc's rule: **the app owns
state, the model owns language.** June narrates and answers asides; she never computes
eligibility, decides an outcome, or quotes a personal cost.

Every typed message goes through, in this order:

1. **Safety net** — 911 / 988 / GLP-1 hold-dose, checked before anything else.
2. **Bounded intent routing** — answer-to-current-question · correction · FAQ ·
   request-for-human · safety · off-topic. Unrecognised → gentle fallback plus a handoff.
3. **Model call** — local proxy, else a browser key, else scripted copy.
4. **Output guardrails** — reject over-length replies, angle brackets, asserted
   diagnoses, promises, coverage decisions, "free visit", and **any digit not already in
   the conversation, the app state, or the retrieved knowledge**. That last rule is what
   structurally prevents an invented dollar figure or member ID. A rejected reply falls
   back to reviewed scripted copy and is logged.
5. **Action parsing** — the model may emit `[[chips: …]]` and
   `[[action: set_field:carrier=Aetna | handoff | defer]]`, but the app validates every
   write through a setter and performs it. `advance` and `verify` are deliberately
   ignored: only the deterministic flow moves the member forward or runs a check.

**The app's chips always win.** If a step or an outcome already owns the footer, a typed
aside restores those chips rather than the model's suggestions — otherwise an aside could
strand the member away from the real question, or away from "Back to dashboard".

### Is Claude actually connected?

**Check before you evaluate the conversation.** If no transport resolves, every typed
message is answered by a regex classifier picking from nine canned strings — not Claude.
That is a legitimate fallback (the demo must never dead-end), but it is easy to mistake
for the real thing and draw the wrong conclusion.

Two signals, deliberately hard to miss:

- a **dark `DEV` strip inside the chat**, directly above the composer, saying replies are
  canned and giving the command to fix it. It shows even under `?present=1` — a polluted
  screenshot beats a false conclusion.
- the panel's status line, which reports the **resolved** transport, not the one selected.

Measured coverage of the offline fallback: of 20 things a member plausibly types, **13
match no intent** and all get the same deflection. So the scripted mode is a safety net
for a dropped connection, not a substitute for the model.

### Transport

- **Local proxy (recommended).** Keeps the key server-side.
  ```bash
  ANTHROPIC_API_KEY=sk-ant-... node PrevMed/june_insurance_chat/tools/june-proxy.mjs
  ```
  Then set Prompt → *Local proxy*. `GET /health` reports whether keys are present.
- **Cloudflare Worker (for reviewers).** `worker/june-worker.js` — same contract,
  deployed, so the GitHub Pages link works for anyone without a local server or their
  own API key. See [worker/README.md](worker/README.md). Then share:
  ```
  …/index.html?present=1&proxy=https://june-chat-proxy.<sub>.workers.dev&key=<secret>
  ```
  `?proxy=` is honoured only over https (or localhost), so the shared secret can't go out
  over plain http. Treat such a link as semi-public and keep a spend cap on the key.
- **Browser key.** Paste a key in Prompt → *Browser key*. Works on Pages with zero infra,
  but **the key is exposed in the browser** — throwaway keys only.
- **Off.** The deterministic flow still completes end to end on scripted copy. The
  prototype never dead-ends in front of a participant.

GitHub Pages serves static files only, so `tools/june-proxy.mjs` can't be deployed from
this repo — that's what the Worker is for. It follows the pattern
`dynamic-header/assets/js/ai-coach.js` already uses, but locks CORS to an allowlist,
requires a shared-secret header, rate-limits per IP, and forwards only expected fields
upstream. `worker/README.md` is explicit about which of those are real controls and which
are speed bumps.

## When your saved settings are older than the build

Panel settings are saved to `localStorage` and merged **over** the shipped defaults, so a
saved copy from an earlier build silently wins over code changes. This bit hard: a shipped
fix to a step's `skipIf` was inert, "I don't have my card" landed on the wrong step, and
the only warning went to the Debug tab — which is the same as no warning.

The panel now fingerprints the structure of the shipped spec (step ids, kinds, fields,
`skipIf`, option values, outcome and sheet keys) and compares it on load. On a mismatch it
shows a banner at the top of the panel offering both directions:

- **Use this build's flow** — replaces the step spec, outcome copy and member fixture;
  keeps your system prompt, keys and knowledge documents.
- **Keep mine** — leaves your version alone and logs that shipped fixes stay inactive.

If something behaves oddly after an update, that banner is the first place to look;
`localStorage.removeItem('june-insurance-chat.v1')` is the blunt reset.

## What the panel remembers

Everything you configure survives a reload and a browser restart. Two stores:

- **`localStorage`** (one namespaced key) — system prompt, the whole flow spec including
  every step's copy and *Notes for June*, outcome copy, help sheets, scenario, silent-retry
  lever, member fixture, latency, inline budget, transport, proxy URL and shared secret,
  model, and the Debug checklist.
- **IndexedDB** — knowledge documents, including which are toggled off. Seeding is
  idempotent, so a reload won't duplicate the shipped four.

Deliberately **not** persisted: the turn log, the Measures readout, and the last-retrieval
panel. Those describe one run, not a configuration, and carrying them over would make a
fresh run look like it had already happened.

Two behaviours worth knowing:

- Text fields save as you type (debounced), not only on blur — so a long prompt edit isn't
  lost if you reload without clicking away first.
- If a later build adds an outcome or help sheet, it's merged into your saved config
  rather than dropped, and your edits win. Steps are a user-ordered array, so a newly
  shipped step is *reported* in Debug rather than silently inserted — **Flow → Reset flow**
  restores the shipped set.

Scenarios → **Export / Import JSON** moves a whole configuration between machines;
**Reset everything** clears it.

## pVerify

`assets/pverify.js` mirrors the real request and response field names, so swapping in
live credentials is a flag flip rather than a rewrite. Schema source of truth is
pVerify's own Java client (`github.com/pVerify/restapijava`), not the marketing pages.

Three vendor facts the UI respects:

- **`IsHMOPlan` is the only explicit plan-type flag any vendor exposes** — it drives the
  referral outcome.
- **`IsPayerBackOffice` means the payer is not real-time** (~24h). A same-session answer
  isn't guaranteed for every carrier, so "pending" is a genuine terminal state rather
  than a spinner that never resolves.
- **There is no Medigap field.** Supplemental coverage can only be inferred from
  `OtherPayerInfo.SecondaryPayer`, and the UI never claims to know it.

By default checks are simulated from fixtures in the real response shape. `normalize()`
is the single contract — mock and live both pass through it, so nothing downstream can
depend on a fixture-only shape.

## Design system

Hand-implemented against **`@bold/web` v0.3.0**, per the repo's `design-system-guardian`
rule. Components mirror `Button`, `Tag`, `Banner`, `Progress`, `Loader`,
`TextWithShield`, `Forms/Input`, `Forms/Label`, `Forms/Formik/FieldRadioButtons` and
`ModalBox`, with prop-equivalent modifier classes. The first screen adds `Box2`
(the coloured-wrapper + tab-title + white-body + `$grey---200`-footer pattern behind both
the appointment and program cards), `Avatar`, `Divider`, `Details` and `Carousel2`. Every token value in `assets/june.css`
is transcribed from `packages/web/src/styles/_variables.scss` and `constants.ts`, and the
breakpoints are the real ones (568 / 1024), not invented.

Chat anatomy comes from the Figma `Ai-Chat` kit (`BFAh85XW5XxjtdTbP9FbX8`): header with
the always-visible **AI** badge, progress bar, bot/member bubbles, typing indicator,
composer with mic and send, suggestion pills, cost rows, callouts, result cards, review
card, checking state. The two June Orb SVGs are committed rather than hot-linked, because
the Figma MCP asset URLs expire in about seven days.

### Five deliberate deviations, stated rather than buried

1. **Brand purple.** The Figma kit brands at `#5b16e0`; this uses `$purple---300`
   (`#5200d4`) because `CLAUDE.md` makes `@bold/web` authoritative.
2. **Type and target sizes.** The kit specs 16px body, 14px captions and 38px chips. The
   `senior-onboarding-design` floor is 18px body and ≥44px targets, so body is 18px,
   captions 16px, and chips have `min-height:44px`. Only the "AI" pill stays at 14px,
   which is the `@bold/web` hard floor. Pixel fidelity loses to legibility here — the
   same tradeoff `mvp3-side-effect-prescription.html` documented.
3. **Primary text colour.** The first screen's design uses `#171717`
   (`Text/text-default-primary`), which isn't in `_variables.scss`. Primary text stays
   `--ink-300` (`#140d26`) for the same reason as the purple above. Two more values from
   that newer Figma token set are recorded as named tokens with their provenance rather
   than left as bare hex: `--surface-secondary` (`#f5f5f5`, the "1 min" pill) and
   `--shadow-elev` (the card shadow, already shipping in `mvp3`).
4. **12px type raised to 14px.** The first screen's design uses 12px for the "1 min"
   pill; `@bold/web`'s floor is 14px with no carve-out for badges, so it renders at 14px
   with the design's padding — the same call already made for the chat's "AI" pill. Five
   control-panel labels were raised for the same reason rather than exempting the panel.
5. **`Box2` radius.** The shipped component uses `$Box-border-radius---small` (12px);
   this screen's design specifies 16px, so `.Box2` here is 16px. `.Box2---overhang` adds
   the design's 49px top-right radius that makes room for the overhanging avatar.

## Copy rules baked in

From the `bold-pricing-messaging` skill, which governs appointment cost:

- Never "free" for a visit → **"$0 out of pocket"**, always paired with **"78% of Bold
  patients"**. The 86% figure is retired and must never appear.
- The 15-minute coordinator call is **"no cost"**, matching the board's own wording.
- Coverage attaches to the **appointment or the provider**, never to the company.
- Coverage is *estimated* then *confirmed* — never guaranteed.
- Appointment cost and the **$50/month GLP-1 Bridge** are separate models and are never
  blended in one sentence. Part D never "automatically covers" a GLP-1.
- Errors never imply patient fault. "Every plan formats their IDs differently" — because
  older adults blame themselves about 90% of the time when something goes wrong (NN/g).

`tests/logic.html` asserts these over every shipped string, so a copy edit that
reintroduces "free visit" or 86% fails the suite.

### The number guardrail, and why it was too strict at first

The rule started as *reject any digit not already in context*. It stopped invented dollar
figures, and it also blocked correct output — "call **988**", "about **2** minutes", "your
**2026** plan". Measured: **3 of 8 realistic replies rejected**, each one replaced with
scripted copy, which reads as June answering a different question. That was a real cause
of the conversation feeling incoherent.

It now polices only the classes of number a member would act on and we cannot know:

| Blocked unless present in context | Allowed |
|---|---|
| dollar figures (`$47`) | crisis lines (911, 988, 741741) |
| percentages (`93%`) | durations and counts (`2 minutes`) |
| identifier-shaped runs, 5+ digits | years (`2026`), ages (`65`) |
| phone-shaped numbers | anything already in state or the knowledge |

`tests/logic.html` asserts both directions, and `tests/proxy-path.html` proves a model
reply containing 988, a duration and a plan year survives a real turn while an invented
`$4321` still does not.

### Two holes that let 12px text ship

Worth recording, because both checks looked like they covered this and didn't:

- `tests/a11y.html` grepped the stylesheet for *literal* `font-size: Npx`, so a
  `font-size: var(--fs-12)` reference was invisible to it. It now resolves token
  indirection before comparing.
- the computed-size sweep in `tests/integration.html` skipped any element with element
  children — so a pill containing an `<svg>` was never measured. It now treats an element
  whose only element children are `<svg>` as a text node.

## Tests

```bash
./PrevMed/june_insurance_chat/tests/run.sh     # 582 assertions across 9 suites
```

See `tests/README.md`. There is no node on this machine, so the suites run in headless
Chrome and `tools/june-proxy.mjs` is exercised by running its request handler with
stubbed `createServer` / `process` / `fetch` rather than by listening on a socket.

## Files

```
index.html                    the prototype (control panel + phone)
assets/june.css               @bold/web tokens and components
assets/june-flow.js           deterministic engine, awaitable widgets, validated setters
assets/flow-default.js        the default step spec, outcome copy, help sheets, fixture
assets/june-brain.js          Claude transport, safety net, intents, guardrails
assets/june-rag.js            IndexedDB store, chunking, BM25-ish retrieval
assets/pverify.js             eligibility adapter, fixtures, normalize()
assets/panel.js               the six-tab control panel
assets/img/                   committed icons and photos for the first screen
config/system-prompt.default.md
knowledge/*.md                seed knowledge documents
tools/june-proxy.mjs          local dev proxy (Claude + pVerify)
worker/june-worker.js         deployable Cloudflare Worker proxy
worker/wrangler.toml          deploy config (secrets set via wrangler, never committed)
tests/                        headless test suite and runner
```

## Known limits

- **Neither proxy has actually been deployed or run.** No node here, so
  `tools/june-proxy.mjs` is parse-checked and its handler unit-tested with stubs, and
  `worker/june-worker.js` has its `fetch()` handler driven directly (51 assertions) — but
  neither has bound a socket or reached a real API, and `wrangler deploy` has not been run.
  Expect to iterate once on the deploy.
- **The pVerify host is a documented guess** in both proxies. I couldn't reach their docs,
  so confirm it for your account and override with `PVERIFY_BASE_URL` before a live run.
- **The shared secret is not authentication.** It lives in the browser, so anyone with the
  reviewer link has it. It deters casual use of the endpoint; the real cost ceiling is a
  spend cap on the Anthropic key. The rate limit is in-isolate and therefore best-effort.
- **The video card's poster is a rendered still from Figma**, because the source frame
  uses a video fill that can't be exported. The baked-in speaker and pause chrome are
  part of the image; the title, attribution and duration are real text over it. In a real
  build this would be `@bold/web`'s `Video2`.
- **The FAQ rows don't expand** — the Figma frame shows them collapsed, so there is no
  body copy to expand into.
- **No OCR** on card photos. The flow records receipt and routes to a human; it never
  claims to have read the card.
- **Knowledge documents must be `.md` or `.txt`.** Convert PDFs first.
- Retrieval is keyword-based, not embeddings. Good enough for a hand-written corpus,
  and the Debug tab always shows what was actually sent.
- Read-aloud and voice input are progressive enhancements and are absent in browsers
  without the Web Speech API.
