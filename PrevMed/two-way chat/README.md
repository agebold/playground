# Two-way care team chat — prototype

Pulled from Cloudflare on **2026-09-29**. Two iPhone 16 screens side by side — Carol (patient, Bold app) and her care team (Khadija, MA → Dr. Desai) — playing one scripted story in six chapters. Tapping either phone updates the other.

## Run it

```bash
# from the repo root
python3 -m http.server 8899
```
Then open **http://localhost:8899/PrevMed/two-way%20chat/**

Keys: `→` / `Space` next · `←` back · `R` restart. Opening `index.html` directly also works.

Component sheet: **[components.html](components.html)** — every component × variant, named as in Figma.

## Two stories: P1 and Vision

The left panel switches between them and lists every chapter and step. Clicking a step jumps there. The ⊟ button collapses the panel to a rail of chapter numbers, and the choice is remembered. Under 900px wide the panel becomes a drawer, opened with **Chapters**.

| Story | Link | What it shows |
|---|---|---|
| **P1 · Access care plan** | `?story=p1` | The PRD's P1. Dr. Desai sends a note and care plan → Carol gets a text with no clinical content → she signs in without a password → she reads the message, but **can't reply yet** ("Replying here is coming soon.") → "See my Care Plan" → Care tab → the plan, which she reads. |
| **Vision · Two-way chat** | `?story=vision` (default) | The full six-chapter loop below. |

### P1 chapters

| # | Chapter | Goal |
|---|---|---|
| 1 | Dr. Desai sends the care plan | Provider's message and care plan arrive in Bold |
| 2 | Carol gets a text | A text brings patients back to Bold |
| 3 | Carol confirms it's her | Secure access, no password |
| 4 | Carol reads her message | Patients open their provider's message in Bold |
| 5 | Carol reviews her care plan | Patients view their care plan |

**How P1 differs from the Vision.** Every P1 setting is in `story-p1.js`.
- No June anywhere.
- No composer: the "coming soon" note sits where the composer would be.
- No typing or presence signals.
- The SMS names Dr. Desai and nothing else.
- The Care tab is built from Figma Member Dashboard `2183:67647`, in its after-the-visit state.

**Sign-in** (date of birth → texted code → "Use Face ID next time?" → straight to the message):
- **Why this pattern:**
  - Members have no passwords today (`design-brief.md:146`).
  - Older adults struggle most with passwords and multi-step logins ([PMC12763363](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12763363/)).
  - Date of birth plus a texted code is the MyChart pattern ([UR Medicine](https://mychart.urmc.rochester.edu/mychart/twostepauthentication.html)).
- **How it's built:**
  - One code field with `autocomplete="one-time-code"`, so iOS can fill it in. It submits on its own after the 6th digit.
  - "Send a new code" unlocks after 30 seconds.
  - Errors are shown in words with an icon, and focus stays on the field.
- ⚠️ **Needs security sign-off.** NIST SP 800-63B-4 calls SMS codes a *restricted* authenticator ([NIST](https://pages.nist.gov/800-63-4/sp800-63b.html)). Also, the link and the code both arrive on the same phone. The Face ID (passkey) offer is the step toward a stronger second factor.

**Care plan.** Modeled on a real finalized Healthie plan (`STAGING_TEST_Bold_care_plan_DRAFT.pdf`) and adapted to Carol's first visit:
- a note from the provider at the top, covering what the plan is, the labs and the next visit;
- then Activity, Nutrition, Sleep, Social connection and Stress & mood, in that order;
- each step is a bold instruction, a short detail and article links;
- one "Why?" per area, which opens on tap.

The amounts match `care_plan_actions_report_2026-09-30.pdf`, where a typical plan has 5 areas and about 8 steps. There are three views of the same plan:
- **Chat recap:** one line per area, plus **See my Care Plan**.
- **Care tab module:** the areas, with how many steps each has.
- **Review page:** for reading only. No checkboxes, progress or class buttons.

Protein is "25–30 grams at each meal" instead of the example's "80 grams a day", because of the open kidney flag in `prioritized-issue-register.md:43`. The wording is adapted from the example and still needs clinical review.

**June (AI assistant) in P1.** June has its own chat. It never speaks in the care team thread, so it's always clear who is answering. Carol can reach it from two places:
- a "Questions about food?" card at the end of Dr. Desai's thread;
- the same card under Nutrition on the care plan page.

How it works:
- **Suggestions:** three chips match the Nutrition steps (protein breakfast, 64 oz of water, photo food journal), and Carol can also type a question.
- **Answers:** June gives general information only. Anything off-topic goes to "call your care team".
- **Safety:** red flags get the 911 or 988 reply, using the same detector as the Vision.
- **Disclaimer:** "June is an AI assistant and can't give medical advice." stays under the input.

The answers are placeholder copy and need clinical review.

**Download PDF.** Carol can save her plan from three places: the chat recap, the Care tab module, and the download icon on the plan page. The file is `carol-care-plan.pdf`, laid out like the finalized Healthie plan. It is printed from `care-plan-pdf.html`, which reads the same `story-p1.js` data, so the PDF always matches the app. To regenerate it, open that page in Chrome and choose Print → Save as PDF.

**Figma.** The P1 screens are in [Care-Team-message](https://www.figma.com/design/UEbZrcisCp1lBt8NU05R0Q/Care-Team-message):
- **P1 page:** the section "P1 · Access care plan · prototype screens (Oct 7)" has three screens: Messages (read-only), Care tab, and Care plan review.
- **Component page:** the section "Two-way chat · P1 care plan access" has the new components.

**Open questions:**
- The report found no crisis line (988) in any plan, and balance or falls work is rarely the main ask. Neither is added here.
- Mobbin research for the sign-in screens is still to do: the Mobbin connection timed out when this was built.

## The six chapters (Vision)

| # | Chapter | Goal it demonstrates |
|---|---|---|
| 1 | Dr. Desai's message arrives | Patients open their provider's message in Bold |
| 2 | Carol reads her plan and takes a first step | A first in-app action within 7 days |
| 3 | Carol asks a question | An answer without working out who to ask |
| 4 | Khadija answers first | More questions resolved without the provider |
| 5 | Dr. Desai reviews a recap and replies | **Providers review a summary, not an inbox** |
| 6 | Carol signs her consent | Tasks get done in Bold, not Healthie |

Chapters 1–2 are the PRD's **P1** (delivery + conversion); 3–5 are **P2** (reply + triage + provider recap); 6 is the consent task moving out of Healthie.

## Where it came from

| | |
|---|---|
| Source | Cloudflare **Worker** `bold-care-team-chat` |
| Account | `3aad573795e97151b2f2efee9ee06b18` (subdomain `tzuyi`) |
| Live URL | https://bold-care-team-chat.tzuyi.workers.dev |
| Version | `56aeb11b-8505-4735-94b1-c667de02cd04` (v1), deployed 2026-09-29 14:38 UTC by tzuyi@agebold.com via wrangler |
| Compatibility date | `2026-09-26` |
| Bindings / routes / cron | none — pure **Workers Static Assets**, `serve_directly: true` |
| Header rule | `/*  X-Robots-Tag: noindex` |

There is no Worker script logic — it is a static site served by the assets runtime, so the local copy is complete and behaves the same as the deployment.

## Files

`index.html` · `components.html` · `tokens.css` `chat.css` · `store.js` `story.js` `story-p1.js` `components.js` `june.js` `patient.js` `care.js` `demo.js` · `images/` (24 assets)

All copy lives in **`story.js`** — cast, every string, the care plan, and the chapter definitions. That is the file to edit for wording changes.

## Design sources (per the file header)

- Figma **Member Dashboard** `jvPrZfMCn9Xwi9Fol4SWEm · 2045:43268` — look and page structure
- **Weight management MVP** FigJam `Mc7PfQwn4QNIXM6HKOTT2v` — user flow `2147:777`, brief `2062:107`, market best practice `2130:980`
- `@bold/web` Storybook where Figma has no matching piece

## Documented deviations

Carried over from the file header:

- **D1** No text below 14px
- **D2** Bottom nav gains a 5th "Messages" tab; avatar menu gains "Messages"
- **D3** The Figma June chat's "Topics" pill is dropped — the user flow says "no category to pick"
- **D4** iPhone 16 Dynamic Island (126×37) rather than the older notch
- **D5** New chat / care-team / signing components have no Storybook equivalent
- **D6** Caveat is used only to render an adopted signature
- **D7** ⚠️ **Typing and presence signals are ON** (user decision), overriding brief principle 5

> **On D7** — this deliberately overrides *"never imply someone is watching"*, which is also design principle #2 on the [Design brief board](https://www.figma.com/board/Mc7PfQwn4QNIXM6HKOTT2v/Weight-management-MVP?node-id=2126-122) and a hard constraint in `messaging.md`. Recorded as a conscious choice, not a bug — but it is the one deviation that contradicts a written guardrail, so it is worth re-confirming before this goes in front of clinicians.

## Not included

`COMPONENTS.md` and `PLAN.md` are referenced in the file header but were **not deployed** (404 on the Worker) — they exist only in whatever working copy the prototype was built from. Worth recovering separately; `PLAN.md` holds the design rulings.

## Redeploying

Needs Node + wrangler, neither of which is installed on this machine. With them:

```bash
wrangler deploy --assets=. --name bold-care-team-chat --compatibility-date 2026-09-26
```

Add a `_headers` file containing `/*\n  X-Robots-Tag: noindex` to preserve the noindex rule.
