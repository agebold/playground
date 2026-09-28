# Two-way care team chat

Two phones side by side: Carol, a new Bold weight-management patient, and her care team (Ali, her Care Advocate, then Dr. Desai). One scripted story in 6 chapters shows how a single care-team chat moves a patient from the post-visit message to answers, with the right person replying. Each chapter is tagged with the goal it demonstrates.

## Run it

- Open `index.html` in a browser, or run `python3 -m http.server 8899` from the repo root and go to `http://localhost:8899/PrevMed/two-way%20chat/`.
- **Next** moves one step. **Autoplay** plays the whole story in about 1.5 minutes. **Back** undoes the last step. **Restart** starts over.
- Keys: → or Space for Next, ← for Back, R to restart.
- You can tap either phone at any point. The pulsing ring shows the next tap, and the bar at the bottom says what it is.
- Under 900 px wide, one phone shows at a time and switches to whichever phone the step is on.

## The story

| # | Chapter | Goal it shows | What to point out |
|---|---|---|---|
| 1 | Dr. Desai's message arrives | Patients open their provider's message in Bold | A text brings Carol into Bold. Messages is a tab and in the profile menu. |
| 2 | Carol reads her plan and takes a first step | A first in-app action within 7 days | The care plan sits under Dr. Desai's note, with one clear first step: a 15-minute class. |
| 3 | Carol asks a question | An answer without working out who to ask | One place to write. June answers the visit question, asks 2 taps, says who answers each part and by when (48 hours, weekends don't count). |
| 4 | Ali answers what she can | More questions resolved without the provider | Ali sees June's intake, confirms the medicine herself and hands the dose question to Dr. Desai. Carol sees the handoff. |
| 5 | Dr. Desai reviews a recap and replies | Providers review a summary, not an inbox | Dr. Desai works from Tasks, reads a recap built from the chat, replies and sends the consent form. |
| 6 | Carol signs her consent | Tasks get done in Bold, not Healthie | DocuSign-style signing in the chat. The care team sees it, and Carol's checklist completes. |

## Components and Figma

- `components.html` shows every component in every variant, named as in Figma. Use it for design QA and for rebuilding the design in Figma.
- `COMPONENTS.md` lists each component (existing Member Dashboard component or new), its variants, the tokens it uses, and the steps for putting the design back into Figma.

## Open questions

- **Reply promise and hours.** "Replies within 48 hours, weekends don't count" and "Mon–Fri, 7 AM–5 PM PT" are placeholders until Dr. Deeb signs off. The reply-by dates are calculated from one setting in `store.js` (`SLA_HOURS`, `SKIP_WEEKENDS`, `HOURS`). The wording that says "48 hours", "Weekends don't count" and the hours is in `story.js`, so a change needs both files.
- **Clinical copy.** Dr. Desai's reply ("please don't skip a dose on your own…") needs clinical review.
- **Consent form.** The text is MVP3's consent without the primary-care pieces. It needs clinical and legal review.
- **Text size.** Body text is 16 px, as in Figma. The brief's floor for adults 65+ is 18 px.
- **Four ways into one chat.** The Messages tab, the profile menu, the June button and the June card all open the same thread. Worth testing whether that helps or confuses.
- **Typing and presence.** "Ali is typing…" and "Ali is reading your message" are on by choice, which goes against brief principle 5.
- **Scripted, not AI.** June's replies, the intake card and the recap are scripted or built from what happened in the chat. Nothing calls a model.

## Files

| File | What it holds |
|---|---|
| `index.html`, `demo.js` | The demo page and the story engine (Next, Back, Autoplay, hints, scene cards) |
| `story.js` | Every line of copy, the cast, the chapters and the steps |
| `store.js` | The reply-by clock (48 hours, weekends skipped), care hours, safety rules and the shared state both phones read |
| `june.js` | June's scripted replies |
| `patient.js`, `care.js` | Carol's phone and the care team's phone |
| `components.js`, `chat.css`, `tokens.css` | One function per Figma component, their styles and the Figma variables |
| `verify-chat.mjs` | Checks for the clock, rules, story, copy, care logic and styles. Run `node verify-chat.mjs`. |
| `PLAN.md` | The build plan and the Figma notes |
