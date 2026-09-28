# Two-way Care Team Chat Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A live demo page with two iPhone 16 screens, patient (Carol) and care team (Ali → Dr. Desai), side by side.
- It shows how the two-way care-team chat helps patients reach the PRD and design-brief goals.
- It uses the exact look of the Figma Member Dashboard.
- It's built from named, reusable components that can be placed back into Figma.

**Architecture:** One static page and two device screens that render from one shared state, so actions on one phone update the other.
- A scripted story engine plays 6 chapters. Each chapter is tagged with the goal it demonstrates.
- Every UI piece is one render function named after its Figma component, with Figma-style variant properties. A separate component sheet page shows every component and variant, ready for the Figma rebuild.

**Tech stack:** Plain HTML/CSS/JS with classic `<script src>` (no build; works from `file://` and GitHub Pages), Google Fonts (Inter, Source Serif 4, Caveat for signatures), Phosphor icons + `@bold/web` SVGs, Node 18 for `verify-chat.mjs`, Playwright MCP for browser checks.

**Spec:** this file. Everything up to "Tasks" is the design; "Tasks" is the build.
**This file:** `~/.claude/plans/now-i-want-you-synthetic-mitten.md`. Task 0 copies it to `PrevMed/two-way chat/PLAN.md`.

## Global Constraints

- **Figma is the main visual reference, especially Home.** The Member Dashboard section is `jvPrZfMCn9Xwi9Fol4SWEm` node `2045:43268`. Where Figma has no matching piece, use `@bold/web` (Storybook https://staging-ui.agebold.com/, source via `gh api agebold/agebold-web`).
- Values come from Figma variables. Values Figma hard-codes are kept as named tokens and listed in `COMPONENTS.md`.
- Text never below 14px (Figma's smallest style is Caption 1, 14/22). Tap targets are at least 44px.
- Motion is welcome: messages animate in, typing dots, status changes, sheets slide, the June floating button shimmers (per its Figma annotation), and the other phone pulses gently when something arrives.
- **Emergency:** only a light-grey line above the typing bar: "If this is a medical emergency, call 911." No 911 buttons anywhere.
- **No PCP** anywhere.
- **Reply promise: 48 hours, weekends don't count.**
  - One config: `SLA_HOURS = 48`, `SKIP_WEEKENDS = true`.
  - "Weekends don't count" is visibly highlighted wherever the promise appears.
  - The reply-by date is computed from it. Placeholder until Dr. Deeb signs off.
- Care team hours: Mon–Fri, 7 AM–5 PM PT (the Sep 2026 market board). Phone 424-577-5266.
- **Voice** (the repo's voice rules plus the Figma copy board):
  - Plain words, 6th–8th grade, sentences under 20 words, no emojis.
  - No exclamation points inside the chat. Home greetings keep Figma's "!".
- **June's limits:** never diagnoses, advises or changes a dose. Never says "normal", "common", "will pass", "don't worry" or "should". June does answer non-medical questions right away.
- **Every message says who is speaking** (brief principle 3): name + role, and an "AI" chip for June.
- Typing and presence are allowed ("Ali is typing…", "Ali is reading your message"). The user chose this over brief principle 5.
- Cast:
  - **Carol Simmons** — patient, `CS`.
  - **Dr. Mitul S. Desai, MD** — provider, she/her, `clinician-desai.jpg`.
  - **Ali Neuwirth, Care Advocate** — `clinic_funnel/assets/confirmed/cc-2.png`.
  - **June** — AI assistant, the Figma "June Orb".
  - Medication: Foundayo 0.8 mg, 1 tablet daily (as in MVP3).
- Demo dates are built with local date parts (`new Date(2026, 8, 22, 19, 44)`), so the story reads the same in any time zone.
- Scripted only: no LLM calls, no network calls except the font and icon CDNs.
- **PM audience:** the demo page uses short, plain captions and no technical terms.

## Review Focus

1. **Typing off-script in either composer:** empty, 1,000 characters, `<b>`/`<script>`, emoji, line breaks.
   - Send stays off when empty. Text shows escaped and wraps.
   - June gives its standard intake reply, and the other phone shows the same text.
   - Tests: Task 4 and Task 7.
2. **Presenter clicks out of order:** Next while a sheet is open, a double-tap on Send, a tap on a later step's control early, Back during autoplay.
   - No duplicate messages; the state stays consistent; the hint moves to the right element.
   - Tests: Task 8.
3. **Reply-by edge cases:** sent Friday evening, on a weekend, or at 11:59 PM.
   - Weekends are skipped, and the text reads naturally ("end of day Tue, Sep 29").
   - Tests: Task 2.
4. **All four ways into the chat** (Messages tab, Messages in the avatar menu, June floating button, June card chips), used at any point.
   - Every one opens the same thread.
   - A chip also sends its question, and June answers it.
   - Unread counts clear everywhere.
   - Tests: Task 5.
5. **Laptop sizes** (1280×720, 1440×900, 1920×1080) and a window under 900px.
   - Both phones stay fully visible and scaled; below 900px, one phone shows with a switch.
   - Tests: Task 10.

---

## Context

**Why.** From the PRD:
- The provider's post-visit message and care plan live in Healthie, so many patients never come into Bold.
- Bringing them into Bold, and using the "unread message from Dr. Desai" moment to bring patients in, should raise the share of patients who take an in-app action within 7 days of their first visit.
- Patients can then ask follow-up questions. The Care Advocate answers what she can; only clinical questions reach the provider, who reviews a summary instead of watching an inbox.

**What the Figma boards add** (read directly from Figma during planning):
- **User flow, "Direction 2" (`2147:777`): one care-team chat, with the agent in the thread.**
  - User goal: "Get an answer without working out who to ask."
  - Patient steps: SMS link → Home shows unread → one thread "Your care team" → reads message + care plan → types (no topic to pick) → June answers or asks follow-ups → recommended reading while waiting → status "with your care team" → Care Advocate or clinician replies → every message is labeled → resolved, one history.
  - The Care Advocate sees one queue, each message arriving with June's answers attached. She resolves logistics, cost and tech questions and escalates clinical ones.
  - The provider isn't on call and opens a recap built from June's structured questions and answers.
  - Lifecycle: unread at 48h → one more SMS; day 5 → one Care Advocate call.
- **Design brief (`2062:107`).**
  - Goals: 7-day conversion to an in-app action; app retention after the first appointment; trust and connection; task completion; fewer frustrating outreach calls for Care Advocates.
  - Hypothesis: "Dr. Desai has a message for you…" drives retention.
  - Principles: the member brings the problem and the system finds the person · make a small promise, then keep it · every message says who is speaking · the fastest way out is always visible · care-team time is a design material.
- **Market study / best practice (`2130:980`):**
  - Name the responder. State the wait, bounded by the roster, with an explicit weekend statement.
  - Keep emergency outside the thread.
  - Handle non-clinical questions before the clinical queue.
  - The thread is the record: handoffs are posted inline.
  - Show who will answer before the member writes.
  - Design the failure ("Didn't send · Tap to try again").
  - Screening chips include an explicit "none" option, and the pick posts back as the member's own bubble.
- **Member Dashboard (`2045:43268`):**
  - "Checklist and class as two modules… After the visit the class leads, because we're creating habit. Same two modules, same components, swapped."
  - Home = header + serif greeting + checklist module + class module + "Chat with June" card + June floating button + FAQ, with a 4-tab nav (Home · Care · My health · Library).

**Decisions locked with the user**
1. One care-team thread, with June inside it.
2. The care phone is Care Advocate first, then provider.
3. Guided demo plus free tapping.
4. Scripted AI.
5. 48 hours, weekends don't count.
6. The role is called **Care Advocate**.
7. **Four ways into the chat:**
   - a new **5th tab "Messages"**, using the design-system chat icon (`@bold/web` `UserNav/images/chat.svg`, Phosphor "ChatDots");
   - **"Messages" in the avatar dropdown**;
   - the Figma **June floating button**;
   - the **June card**, whose chips open the chat and ask their question.
8. Provider: **Dr. Desai**.
9. Typing dots and presence: **on**.
10. Emergency: grey text line only.
11. No PCP.
12. Motion is welcome.
13. The demo page is concise and written for PMs.
14. **Everything is built as reusable components that map to Figma.**

---

## Component system (Figma-ready)

**Rules, so the design can be placed back into Figma later:**
1. **One render function per component, named like the Figma component.** For example, `ChatBubble()` is the Figma component "Chat/Bubble".
   - Its root element carries `data-figma="Chat/Bubble"` and `data-variant="Sender=June, Position=First, State=Default"` (Figma's own variant syntax).
   - Props are the Figma properties.
2. **Layout is flex only** (it maps 1:1 to Figma auto layout). Gaps and padding come from spacing tokens. Absolute positioning is only for overlays (sheets, the floating button, toasts, the phone frame).
3. **Text uses Figma text-style classes, and colors use Figma variable names** (below). No other type sizes or colors.
4. Screens are compositions of components only; there is no one-off markup inside screens.
5. **`components.html`** renders every component in every variant on a labeled grid, named exactly as in Figma. It's the source for the Figma rebuild (`figma:figma-generate-library` / `figma:figma-use`) and for design QA. It's linked from the README, not from the PM demo.
6. **`COMPONENTS.md`** is the inventory: name · Figma status (existing node, or NEW) · variant properties · props · tokens used · where used.

**Tokens (CSS custom properties named after the Figma variables read from `2045:43390`)**

| Group | Tokens |
|---|---|
| Color variables | `--primary-purple-300 #5200D4`, `--primary-ink-300 #140D26`, `--secondary-blue-300 #3366FF`, `--secondary-cyan-300 #80E8FF`, `--text-default-primary #171717`, `--text-default-secondary #525252`, `--surface-default-primary #FAFAFA`, `--surface-default-tertiary #E5E5E5`, `--surface-inverted-primary #262626`, `--surface-brand-primary #5200D4`, `--surface-brand-secondary #EDE9FE`, `--surface-brand-accent-yellow-primary #FBBF24`, `--border-default-primary #E5E5E5`, `--border-default-tertiary #525252`, `--white #FFFFFF` |
| Hard-coded in Figma (kept as tokens, and listed as "propose as variables" in COMPONENTS.md) | `--dash-card-border #E5E3EA`, `--dash-track #E2E0E6`, `--dash-progress #4A10BD`, `--dash-muted #6B6474`, `--dash-done-bg #FEFDFF`, `--dash-done-icon-bg #E9E7ED`, `--dash-done-check #216B42`, `--june-card-border #E7E0FB`, `--june-card-from #FAF8FF`, `--june-chip-border #D9D2F2`, `--june-title #16121F`, `--june-body #5A5566`, `--june-gradient: linear-gradient(90deg,#4A10BD,#3366FF)`, `--emergency-text #8A8693` (`@bold/web` `$ink---200`, the light grey the user asked for) |
| Text styles | `.type-body` Inter 16/24 · `.type-body-bold` Inter SemiBold 16/24 · `.type-caption-1` Inter 14/22 · `.type-caption-1-bold` Inter SemiBold 14/22 · `.type-serif-headline` Source Serif 4 SemiBold 20/24 · `.type-greeting` Source Serif 4 SemiBold 32/40 · `.type-june-title` Source Serif SemiBold 18, −0.18 tracking |
| Spacing / radius / effects | Spacing 4 · 8 · 12 · 16 · 24. Radius 4 · 8 · 14 · 16 · 20 · full. Shadows: `Shadows/XS` (0 1 2 #1018280D); `Drop Shadow/200` (0 1 2 #1018280F, 0 1 3 #1018281A); floating button 0 10 13 rgba(28,20,54,.24) |

**Component inventory** (sources: **MD** = Member Dashboard `2045:43268`; **SE** = side-effect board, the June chat already rebuilt in `weight_management_app/side-effect-june-chat.html`; **DS** = `@bold/web`; **NEW** = to create)

| Figma component | Source | Variant properties | Used in |
|---|---|---|---|
| Status Bar - iPhone | MD | — | both phones |
| Post-Auth Website Navigation Header (Logo, Profile Picture, carrot-default) | MD | Menu=Closed/Open | patient |
| Nav/AccountMenu (UserNav + DropdownMenu) | DS | — (items: Messages + count Tag · Appointments · Get care · Settings · Sign out; icons from `UserNav/images/*.svg`) | patient |
| Navigation - Mobile Web App / Tab | MD, extended | Tabs=5; Tab: Active=Yes/No, Badge=None/Count | patient |
| Home/Greeting (Heading) | MD | — | patient Home |
| Checklist/Module ("Get ready for Monday" pattern) | MD | Phase=Before visit/After visit | patient Home |
| Checklist/Step (Step — …, Callout, Done — …) | MD | State=To do/Callout/Done | patient Home |
| Class (Web, Tablet Breakpoints) + Position Tag | MD | — | Home, care plan sheet |
| Chat with June — Entry Card (+ chip) | MD | — (chip: State=Default/Pressed) | Home |
| FAB — Chat with June | MD | State=Expanded/Collapsed | Home |
| June Orb | MD | Size=24/40/46 | everywhere June appears |
| Button | DS/MD | Variant=Primary/Secondary/Text; Size=Medium/Small | everywhere |
| Tag | DS | Color=Purple100/Grey/Yellow/Mint/Red | everywhere |
| Avatar / AvatarStack | DS | Size=24/32/40/44/48; Image=Yes/No | everywhere |
| Chat/Header | NEW (from SE) | Side=Patient/Care | both |
| Chat/StatusStrip | NEW | State=Idle/WithTeam/Reading/Typing/WithProvider/Resolved | patient |
| Chat/MessageLabel | NEW | Sender=June/CareAdvocate/Provider/Patient | both |
| Chat/Bubble | SE, extended | Sender=June/Staff/Patient; Side=Left/Right; State=Default/Sending/Failed; Content=Text/Photo | both |
| Chat/TypingIndicator | SE, extended | Sender=June/Human | both |
| Chat/SystemEvent | NEW | Type=Date/Handoff/Opened/Signed/Synced | both |
| Chat/SuggestionChip | MD chip style | State=Default/Selected/Disabled | patient (June screening) |
| Chat/CarePlanCard, Chat/DocumentCard, Chat/ResourceCard, Chat/RoutingCard | NEW | DocumentCard: Status=Needs signature/Signed | both |
| Chat/Composer | SE, extended | State=Empty/Filled/WithAttachment; Side=Patient/Care | both |
| Chat/EmergencyNote | NEW | — | patient |
| Care/InboxRow | NEW | State=Unread/Read; Triage=CanWait/NeedsProvider/Urgent | care |
| Care/InternalCard | NEW | Type=Intake/Summary/TaskEvent/Record | care |
| Care/TaskRow, Care/TaskSheet, Care/SummaryCard, Care/ContextBar, Care/TemplatePicker | NEW | SummaryCard: State=Loading/Ready | care |
| Sheet/Bottom, Modal/FullScreen, Toast, Lockscreen/Notification | NEW | Notification: App=Messages/Bold | both |
| Sign/Disclosure, Sign/DocumentPage, Sign/Tag, Sign/SignatureField, Sign/AdoptSignature, Sign/Done | NEW | Tag: Type=Start/Next/Sign; Field: State=Empty/Signed; Adopt: Mode=Type/Draw | patient |

The Phosphor icons used in MD (HandHeart `40:1317`, Pulse `24:1050`, PersonSimpleTaiChi `23:1193`, IdentificationCard `1600:1634`, carrot-default `18:774`, Signature, ClipboardText, Ruler, CaretRight, ArrowUpRight) are rendered with the Phosphor 2.1.1 web font under the same names. The chat icon is the DS `chat.svg`, with its stroke set to `currentColor`.

---

## Screens

**Patient (left phone)**
- **Lock screen.** A text notification: "Bold: Dr. Desai sent you a message about your visit today. Read it in the Bold app: agebold.com/m". Tapping it opens Home (flow: SMS → Home shows unread).
- **Home**, after the visit, built from MD components. In the post-visit order, the class leads:
  - Header with the avatar menu.
  - Greeting "Good evening, Carol!" and the line "Dr. Desai sent you a message about your visit. **Read message**".
  - The class module: "Your first class" + the Class card "15 min Seated Strength & Toning · Chris Litten", tags "Seated OK" and "Beginner", "Start class", and "Not feeling this today? Change class".
  - The checklist module "Your next steps", with progress and live-updating steps:
    - "Read Dr. Desai's message" (new)
    - "Review your care plan"
    - "Try your first class"
    - "Sign your treatment consent · 5 min" (callout; appears once it's sent)
    - done: "Visit with Dr. Desai"
  - The June card, with post-visit chips: "What is a Care Advocate?", "When is my next visit?", "What's in my care plan?", "Ask something else".
  - The June floating button.
  - The 5-tab nav: Home · Care · My health · Library · **Messages**, with an unread count. Tabs shrink to about 75px; side padding drops to 4px so "My health" fits.
  - Care, My health and Library are simple placeholder screens.
- **Messages (the chat)** — the tab's root screen, so there's no back button:
  - `Chat/Header`: avatar stack (Dr. Desai, Ali, June) and "Your care team", plus an info button that opens the About sheet.
  - `Chat/StatusStrip`, then a thread that starts with the intro card, so it never opens empty.
  - Every message has a `Chat/MessageLabel`.
  - The composer (no topic picker; the flow says "no category to pick") with the grey emergency line above it.
  - Photo attach (Attach sheet → photo picker → preview chip → photo bubble → viewer).
  - Sheets: About, Care plan, Article reader, Signing.
- **Signing** (DocuSign pattern): plain-words summary + "I agree to use electronic records and signatures" → document with yellow Start/Next tags → adopt signature (Type or Draw) → Finish → done, with "Email me a copy". The consent text is copied verbatim from `mvp3-side-effect-prescription.html:3215–3347`.

**Care team (right phone):** Healthie messaging patterns, dressed in Bold components.
- **Header:** logomark + serif title + account chip ("Ali · Care Advocate" / "Dr. Desai · MD"); tapping it opens the demo account switch.
- **Tabs:** Messages · Tasks. The Care Advocate lands on Messages; **the provider lands on Tasks**.
- **Inbox:**
  - Search, and filter pills: All · Unread · Needs provider · Assigned to me.
  - Off-hours banner: "Off hours. Notifications paused until 7 AM. Patients see: replies within 48 hours, weekends don't count."
  - `Care/InboxRow`: bold + dot + "1 new" when unread; tags "Screened by June", "Can wait" / "Needs provider", "1 photo".
- **Thread:**
  - Carol's messages on the left. Everything from the clinic on the right: the signed-in user in purple, other staff in white with their name, June in violet with the AI chip.
  - Care-only cards with a lock and "Only your care team sees this": June's intake, summaries, task events.
  - Records: "Carol opened your message · 7:41 PM", "Carol started her first class", "Saved to Carol's chart in Healthie".
  - A visible `⋯` on each patient message, with Create task · Copy · Mark unread.
  - The composer, with Templates, attach (Photo · Document to sign · Care plan), and the line "Carol sees this as: Ali · Care Advocate".
- **Task sheet:**
  - Task title; details (the quoted message).
  - Assign to: Dr. Desai · Ali (me) · Care team.
  - Due, defaulting to Carol's 48-hour promise: "Today by 5 PM" · "Before next visit (Oct 20)".
  - Follow-up (the PRD's three options), each setting Carol's sentence:
    - Reply in chat → "Dr. Desai will reply by {due}."
    - Book a visit → "Ali will help you book a visit."
    - Discuss at next visit → "Dr. Desai will go over this on Oct 20."
  - Checkboxes: add to pre-visit summary · attach a summary for Dr. Desai · tell Carol who will reply.
- **Tasks tab:** list, detail, and **Summarize** (skeleton, then text). Both the Care Advocate and the provider can create tasks.

---

## Story — six chapters, each tied to a goal

**Timeline (2026):** visit Tue Sep 22 3:08 PM · Carol reads it at 7:40 PM · asks at 7:52 PM, and is promised a reply by **Thu, Sep 24 at 8 PM** · Ali, Wed 8:02 AM · Dr. Desai, Wed 12:40 PM · Carol signs, Wed 6:10 PM · next visit Tue, Oct 20 at 10:30 AM (video).

| # | Chapter | Goal tag on the demo page |
|---|---|---|
| 1 | Dr. Desai's message arrives | Patients open their provider's message in Bold |
| 2 | Carol reads her plan and takes a first step | A first in-app action within 7 days |
| 3 | Carol asks a question | An answer without working out who to ask |
| 4 | Ali answers what she can | More questions resolved without the provider |
| 5 | Dr. Desai reviews a recap and replies | Providers review a summary, not an inbox |
| 6 | Carol signs her consent | Tasks get done in Bold, not Healthie |

**Copy (put it verbatim in `story.js`)**
- **Intro card.** Title "Your care team chat". Rows:
  - Dr. Desai — "Your provider. Answers medical questions."
  - Ali Neuwirth — "Your Care Advocate. Reads your messages first and brings in Dr. Desai when needed."
  - June + AI chip — "AI assistant. Answers simple questions right away. June can't give medical advice."
  - Then: "Replies within 48 hours. **Weekends don't count.**" and "Care team hours: Mon–Fri, 7 AM–5 PM PT."
  - Shield line: "Only your care team can see this chat."
- **Emergency line:** "If this is a medical emergency, call 911."
- **Dr. Desai's visit message:** "Hi Carol, it was good to meet you today. Here is your care plan from our visit. Ali, your Care Advocate, reads your messages first. She'll bring me in when you need me."
- **CarePlanCard:** "Your care plan · From your visit on Tue, Sep 22".
  - Rows: Foundayo 0.8 mg, 1 tablet each day · Protein at every meal, about 80 grams a day · Strength exercise, 2 times a week · Next visit Tue, Oct 20 at 10:30 AM, video.
  - The single tinted block, "Your first step": the Class card + "Start class".
  - "See full care plan".
- **Carol's question** (with photo `rx-bottle.svg`): "The pharmacy gave me this. Is it the right one? Is it okay to skip a day if I feel sick? And when is my next visit?"
- **June's replies:**
  - J1 "Thanks, Carol. I'm June, your care team's AI assistant."
  - J2 (answers at once) "Your next visit is Tue, Oct 20 at 10:30 AM, by video with Dr. Desai."
  - J3 "For your other questions, 2 quick taps help your team answer faster."
  - Q1 "How do you feel right now?" [I feel fine] [A little sick] [Very sick]
  - Q2 "Have you taken your first tablet yet?" [Not yet] [Yes]
  - Carol's picks post back as her own bubbles.
  - J4 "Thank you. Here's who will answer:" + **RoutingCard**:
    - "Is this the right medicine? → Ali, your Care Advocate"
    - "Is it okay to skip a day if you feel sick? → Dr. Desai"
    - Footer: "Replies within 48 hours, by Thu, Sep 24 at 8 PM. **Weekends don't count.**"
  - J5 "Your care team is off for the night. Ali will read your message tomorrow morning."
  - J6 "While you wait, here are 2 short reads from Bold's care team." + ResourceCards:
    - "Eating well when your appetite changes" · Article · 3 min
    - "Your first month on a weight medicine" · Article · 4 min
  - J7 "These are general tips, not advice for you."
  - If Carol picks [Very sick]: "I'm sorry you feel this way. If this is a medical emergency, call 911. I marked your message so Ali sees it first." Plain text, no buttons.
- **June card chip answers:**
  - "What is a Care Advocate?" → "Your Care Advocate is a real person on your care team. Ali helps with your plan, forms, medicine, and appointments. She brings in Dr. Desai when you need her."
  - "When is my next visit?" → J2.
  - "What's in my care plan?" → a one-line summary + "See full care plan".
  - "Ask something else" → focuses the composer.
- **Status strip, by state:**
  - "With your care team · Reply by Thu, Sep 24 at 8 PM" + highlighted "Weekends don't count"
  - "Ali is reading your message"
  - "Ali is typing…"
  - "With Dr. Desai · Reply by 8 PM tomorrow · Ali asked her"
  - "Dr. Desai is typing…"
  - resolved: "Replies within 48 hours. Weekends don't count."
- **Handoff event** (both phones): "Ali asked Dr. Desai to answer · Wed 8:05 AM".
- **Ali's template "Medicine confirmed":** "Hi Carol, this is Ali, your Care Advocate. Yes, that's the right medicine. It matches Dr. Desai's prescription. I asked Dr. Desai about skipping a day. She'll reply here by {due}."
- **Summary for Dr. Desai:** "Summary since your visit · Tue, Sep 22".
  - "Carol read your message and care plan on Tue at 7:41 PM."
  - "She started her first class, Seated Strength (15 min)."
  - "She asked if her new medicine is the right one. Ali confirmed it matches your prescription."
  - "She asked if it's okay to skip a day if she feels sick."
  - "She told June she feels fine and hasn't taken her first tablet."
  - Needs you: "Answer: skip a day if sick?" · "Consent form not signed yet."
  - Footer "Made by June from this chat. Check before you act."
- **Dr. Desai's reply** (clinical copy, needs sign-off): "Hi Carol, please don't skip a dose on your own. If you feel sick, message us here and we'll adjust your plan together. Before your first tablet, please sign the consent form below."
- **Push notification:** "Dr. Desai replied. Open Bold to read her message."
- **Signing done:** "You're all set, Carol." / "Dr. Desai's team has your signed form. A copy is saved in your Documents."
- **Care-side event:** "Carol signed GLP-1 treatment consent · 6:14 PM · Saved to her chart in Healthie".
- **Articles** (reader text, general tips, no dose advice):
  - (1) Start meals with protein · eat smaller meals · sip water · stop when full · tell your care team if food doesn't sit well.
  - (2) Take it the way your care plan says · keep up protein and strength to protect muscle · write down questions and send them here.
- **Filler:**
  - Inbox: Robert Kim (refill question, Can wait) · Diane Foster (move my visit) · Helen Ortiz (replied).
  - Dr. Desai's tasks: Robert Kim, approve refill, due Fri, Sep 25 · Diane Foster, review before visit, due Oct 1.
  - Camera roll: `rx-bottle.svg`, `recipe-yogurt-bowl.jpg`, `snack-hardboiled.jpg`, `blog-kitchen-swaps.jpg`, `resource-healthy-aging.jpg`.

**Steps.** `hint` = a `data-hint` key; `auto` = what Next/Autoplay calls (the same thing a tap calls). A `role` value switches the care phone's account first.

| id | device · role | time / scene card | hint | auto | waits for | caption (PM language) |
|---|---|---|---|---|---|---|
| 1.1 | care · md | Tue 3:08 PM | care.send | care.sendVisitMessage() | visit:sent | Dr. Desai wraps up Carol's first visit and sends her note and care plan, like she does today. |
| 1.2 | patient | Tue 7:40 PM · "That evening" | patient.sms | patient.tapSms() | patient:home-opened | A text brings Carol into Bold. Home shows she has a message. |
| 1.3 | patient | — | patient.tab.messages | patient.openMessages('tab') | patient:thread-opened | Messages is always one tap away: in the tab bar and the profile menu. |
| 2.1 | patient | — | patient.careplan | patient.openCarePlan() | careplan:opened | Her care plan sits right under Dr. Desai's note. |
| 2.2 | patient | — | patient.firststep | patient.startFirstStep() | class:started | One clear first step, a 15-minute seated class. Starting it is the 7-day goal. |
| 3.1 | patient · cc | Tue 7:52 PM | patient.attach | patient.attachPhoto('rx') | photo:attached | Later that night, Carol has questions. She adds a photo of her new medicine. |
| 3.2 | patient | — | patient.composer | patient.typeMessage(S.carolQuestion) | composer:filled | She writes in her own words. No topic to pick, no one to choose. |
| 3.3 | patient | — | patient.send | patient.send() | patient:message-sent | It goes to one place: her care team. |
| 3.4 | patient | — | patient.chip.fine | patient.answer('fine') | screen:answered | June answers what it can right away, then asks 2 quick questions. |
| 3.5 | patient | — | patient.chip.not-yet | patient.answer('not-yet') | screen:done | June tells Carol who will answer each part, and by when. |
| 3.6 | patient | — | patient.resource.0 | patient.openResource(0) | article:opened | While she waits, June suggests short reads from Bold's care team. |
| 3.7 | patient | — | patient.article.close | patient.closeArticle() | article:closed | On the care team's phone it's after hours. Nobody gets paged. |
| 4.1 | care · cc | Wed 8:02 AM · "Next morning" | care.row.carol | care.openThread('carol') | care:thread-opened | Ali starts her day. Carol's message arrives with June's answers attached. |
| 4.2 | care | — | care.msg.more | care.startTaskFromMessage('latest-patient') | task:sheet-opened | Ali can confirm the medicine herself. The skip-a-day question needs Dr. Desai. |
| 4.3 | care | — | care.task.create | care.createTask() | task:created | One task hands it to Dr. Desai with a summary. Carol sees the handoff. |
| 4.4 | care | — | care.templates | care.useTemplate('rx-confirmed') | template:used | A saved reply, filled in for Carol. |
| 4.5 | care | — | care.send | care.send() | care:message-sent | Carol gets an answer from a named person the next morning. |
| 5.1 | care · md | Wed 12:40 PM · "Between visits" | care.task.carol | care.openTask('carol') | task:opened | Dr. Desai isn't on call. Between visits, she opens her task list. |
| 5.2 | care | — | care.summarize | care.summarize() | summary:ready | A recap shows what Carol asked and what June and Ali already answered. |
| 5.3 | care | — | care.reply | care.composeReply(S.desaiReply) | composer:filled | She answers the clinical question herself. |
| 5.4 | care | — | care.attach | care.attachDocument('consent') | doc:attached | And sends the consent form Carol needs to sign. |
| 5.5 | care | — | care.send | care.send() | care:message-sent | Sent, and saved back to Healthie. |
| 5.6 | care | — | care.task.done | care.completeTask('carol') | task:done | Task done. It's also in her pre-visit summary. |
| 6.1 | patient | Wed 6:10 PM · "That evening" | patient.push | patient.tapPush() | patient:thread-opened | Carol gets a notification: Dr. Desai replied. |
| 6.2 | patient | — | patient.doc.review | patient.openSign('consent') | sign:opened | The form opens right in the chat. |
| 6.3 | patient | — | patient.sign.agree | patient.acceptDisclosure() | sign:disclosure-accepted | Plain words first, then one checkbox, like DocuSign. |
| 6.4 | patient | — | patient.sign.start | patient.completeAgreements() | sign:agreements-done | The yellow tag walks her to each box. |
| 6.5 | patient | — | patient.sign.field | patient.adoptSignature('type') | sign:signature-adopted | She types her name as her signature, or draws it. |
| 6.6 | patient | — | patient.sign.finish | patient.finishSigning() | doc:signed | Signed. The care team sees it, saved to her chart. |
| 6.7 | patient | — | patient.tab.home | patient.openHome() | patient:home-opened | Back on Home, her checklist shows the progress. |

---

## Demo page (concise, for PMs)

- **Top:** "Two-way care team chat" and one line: "From a post-visit message to answers, with the right person replying." Below that, six chapter pills.
- **Middle:** the two phones, each with a short label: "Patient · Carol" and "Care team · Ali, then Dr. Desai".
- **Bottom:**
  - the chapter name, the goal tag (a purple-100 pill), and the one-sentence caption;
  - buttons Back · **Next** · Autoplay · Restart;
  - the pulsing hint ring on the next thing to tap.
- **Nothing else:** no toggles, no technical terms.
- **Keys:** → / Space = next, ← = back, R = restart.
- **Scene cards** ("Next morning · 8:02 AM") fade over both phones on time jumps.
- The phones scale to fit the window. Below 900px, one phone at a time, with a switch.

---

## Architecture

**Location:** `PrevMed/two-way chat/` (the user's folder; URL `PrevMed/two-way%20chat/`). It deploys automatically with the PrevMed copy step. Offer a rename to `two_way_chat` at commit time; don't do it unasked.

```
index.html        demo page + two phone roots
components.html   component sheet: every component × variant, Figma names (for the Figma rebuild)
COMPONENTS.md     inventory: Figma status, variant props, tokens, usage
tokens.css        Figma variables + text styles (shared by both pages)
components.js     one render function per Figma component (no screen logic)
chat.css          component styles (class = component name, modifier = variant)
store.js          config, reply-by clock, rules, scheduler, shared state, actions, events
story.js          cast, content, all copy, chapters, steps, initial state
june.js           June's scripted replies
patient.js        patient screens (compose components) + tap actions
care.js           care-team screens + tap actions
demo.js           chapter pills, Next/Back/Autoplay, hints, scene cards, scaling
verify-chat.mjs   Node checks: clock, rules, state, story, copy, CSS
README.md         how to run, demo script, open questions
PLAN.md           copy of this plan
images/           copied in (Desai, Ali, class, resources, camera roll, rx-bottle.svg, June orb, logo, DS icons)
figma-refs/       Task 0 screenshots + README
```

- **Shared state.** Both phones subscribe to one `state`: time, messages (`audience: 'all' | 'care'`), expectation (who replies and by when), typing, presence, tasks, documents, intake, summary, checklist, and each phone's view and sheet.
- **Tap actions ("intents").** Every tap calls a named method (e.g. `patient.tapSms()`). Story steps call the same methods. Each one is idempotent and always emits its event, which is what keeps Next and out-of-order clicks from breaking.
- **Timers.** Every delay (typing, entrance motion) goes through `TWC.sched.later()`. It runs instantly during Back/replay.

---

## Tasks

### Task 0: Figma captures, assets, folder setup

**Files:**
- Create: `figma-refs/*.png`, `figma-refs/README.md`, `PLAN.md`, `images/*`.

- [ ] **Step 1:** Invoke the `figma:figma-design-to-code` and `design-system-guardian` skills. Use the native Figma MCP (connected now). If it's missing, use the Figma desktop server at `http://127.0.0.1:3845/mcp`, which planning used; the file must be the active tab.
- [ ] **Step 2: Screenshots** (maxDimension 900) of MD `2045:43275` (mobile, before the visit) and `2045:43390` (mobile, before the visit with the CC), and of the SE chat frames `860:51108` and `860:51783` (the care-team thread, never captured yet).
- [ ] **Step 3: Assets.** Download from the Figma asset server: the June orb (`june-orb-ai-round`, asset `55db50ae…svg`), the Logo lines and text SVGs, the class thumbnail, and the Appointment progress-end SVG. Save them under `images/figma/` with readable names; no Figma URLs stay in the code.
  - Copy in the repo photos: `clinician-desai.jpg`, `cc-2.png` → `ali.png` (`sips -Z 256`), `class-strength-toning.jpg`, `resource-*.jpg`, `article-glp1-aging.jpg`, and the camera-roll JPGs (`sips -Z 480`).
  - Copy the DS icons via `gh api`: `UserNav/images/{chat,calendar,hand-heart,gear,sign-out}.svg`.
- [ ] **Step 4:** Build `images/rx-bottle.svg` (600×800): a pharmacy bottle with the label "Foundayo 0.8 mg · Take 1 tablet by mouth once a day · Qty 28 · Dr. M. Desai". No real brand marks. Label text at least 14px at display size.
- [ ] **Step 5:** Copy this plan to `PLAN.md`. Note any differences between the screenshots and this plan; the screenshots win.
- [ ] **Step 6 (only when the user asks to commit):** branch `prototype/two-way-chat` off `main`. Stage only `PrevMed/two-way chat/` and `projects.json`; the tree has unrelated edits in `clinic_funnel/` and `weight_management_app/`.

### Task 1: Tokens, text styles, phone frame, demo page shell

**Files:**
- Create: `index.html`, `tokens.css`, `chat.css`, `demo.js` (`fit()` only).

- [ ] **Step 1:** `tokens.css` holds the Component system tokens verbatim, the text-style classes, and the Google Fonts import (`Inter:wght@400;500;600;700`, `Source+Serif+4:opsz,wght@8..60,600`, `Caveat:wght@500`).
- [ ] **Step 2: iPhone 16 frame** (`Demo/PhoneFrame`): 393×852 screen, 12px bezel, radius 54/44, Dynamic Island 126×37 at top 11. The status bar follows the MD "Status Bar - iPhone": 56px tall, time Inter Medium 16/20 `#262626`, signal/wifi/battery on the right, and the clock shows the story's time.
- [ ] **Step 3:** `index.html` holds the demo page from "Demo page": top, two `.device-col` blocks (label + phone), and the bottom bar with `.bar-chapter`, `.bar-goal`, `.bar-caption` (`aria-live="polite"`), `.bar-next`, and buttons `[data-demo="back|next|play|restart"]`. Plus `.chapter-stepper` and one hidden `.interstitial`.
- [ ] **Step 4:** `fit()`:

```js
function fit() {
  var stage = document.querySelector('.stage'), single = innerWidth < 900;
  var chrome = document.querySelector('.demo-top').offsetHeight + document.querySelector('.demo-bar').offsetHeight + 32;
  stage.classList.toggle('stage--single', single);
  var s = Math.min(1, (innerHeight - chrome) / 876, (innerWidth - 120) / ((single ? 1 : 2) * 417));
  stage.style.setProperty('--device-scale', Math.max(0.5, s).toFixed(3));
}
```

```css
.device-col{width:calc(417px*var(--device-scale,1));height:calc(876px*var(--device-scale,1));}
.iphone{transform:scale(var(--device-scale,1));transform-origin:top left;}
.stage--single .device-col:not(.is-shown){display:none;}
```

- [ ] **Step 5: Verify.** Serve with `python3 -m http.server 8899` from the repo root. Screenshot at 1440×900, 1280×720 and 800×900: both phones are visible at the first two, and one phone plus the switch at 800. Console shows 0 errors.

### Task 2: `store.js`, tested first (clock, rules, state, actions)

**Files:**
- Create: `store.js`, `verify-chat.mjs`.

**Interfaces (produces `window.TWC`, and `module.exports` in Node):**
- Clock and rules:
  - `config`, `at(y,m,d,h,min)`.
  - `replyBy(sentAt, opts?) → Date`, `formatReplyBy(deadline, now) → string`.
  - `isOpen(now)`, `nextOpen(now)`, `readWhen(now)`.
  - `detectRedFlags(text) → {level, match} | null`, `classifyTopics(text) → string[]`, `esc(s)`.
- Plumbing: `sched{later, instant, clear}`, `EVENTS`, `createStore(initial) → {getState, set, subscribe, on, emit}`.
- `actions(store) → {sendMessage, setTyping, setPresence, markRead, setExpectation, setIntake, createTask, completeTask, sendDocument, openDocument, signDocument, setSummary, setChecklist, setRole, jumpTime, setView, openSheet, closeSheet}`.

- [ ] **Step 1: Write the failing tests** in `verify-chat.mjs` (same style as the repo's `verify-actions.mjs`: a table of cases, PASS/FAIL lines, exit 1 on any failure):

```js
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const T = require('./store.js');
let fails = 0;
const ok = (name, got, want) => { const p = JSON.stringify(got) === JSON.stringify(want);
  console.log((p ? 'PASS ' : 'FAIL ') + name + (p ? '' : `\n  got  ${JSON.stringify(got)}\n  want ${JSON.stringify(want)}`)); if (!p) fails++; };
const d = (m, day, h, min = 0) => new Date(2026, m, day, h, min);
const f = (sent, now = sent) => T.formatReplyBy(T.replyBy(sent), now);

ok('Tue 7:52 PM → Thu 8 PM', f(d(8,22,19,52)), 'Thu, Sep 24 at 8 PM');
ok('Fri 7:44 PM skips weekend → Tue', f(d(8,25,19,44)), 'Tue, Sep 29 at 8 PM');
ok('Sat 10 AM starts Monday → end of day Tue', f(d(8,26,10)), 'end of day Tue, Sep 29');
ok('Fri 11:59 PM rounds to midnight → end of day Tue', f(d(8,25,23,59)), 'end of day Tue, Sep 29');
ok('Thu 8 AM → Mon 8 AM', f(d(8,24,8)), 'Mon, Sep 28 at 8 AM');
ok('relative: seen Wed morning → tomorrow', f(d(8,22,19,52), d(8,23,8,2)), '8 PM tomorrow');
ok('relative: seen Thu → today', f(d(8,22,19,52), d(8,24,9)), '8 PM today');
ok('no weekend skip', T.replyBy(d(8,25,19,44), { skipWeekends: false }).getTime(), d(8,27,19,44).getTime());
ok('open Wed 10 AM', T.isOpen(d(8,23,10)), true);
ok('closed Wed 6:30 AM', T.isOpen(d(8,23,6,30)), false);
ok('closed Tue 7:52 PM', T.isOpen(d(8,22,19,52)), false);
ok('closed Sat noon', T.isOpen(d(8,26,12)), false);
ok('nextOpen Tue night → Wed 7 AM', T.nextOpen(d(8,22,19,52)).getTime(), d(8,23,7).getTime());
ok('readWhen Tue night', T.readWhen(d(8,22,19,52)), 'tomorrow morning');
ok('readWhen Fri night', T.readWhen(d(8,25,19,44)), 'Monday morning');
ok('readWhen Tue 3 AM', T.readWhen(d(8,22,3)), 'this morning');
ok('readWhen open', T.readWhen(d(8,23,10)), 'soon');

const lvl = (s) => (T.detectRedFlags(s) || {}).level || null;
ok('chest pain', lvl('I have CHEST PAIN'), 'emergency');
ok('belly to back', lvl('bad pain in my belly that goes to my back'), 'emergency');
ok('keep vomiting', lvl('I keep throwing up'), 'emergency');
ok('crisis wins', lvl('chest pain and I want to hurt myself'), 'crisis');
ok('back pain alone', lvl('My back hurts from gardening'), null);
ok('carol question', lvl('Is it okay to skip a day if I feel sick?'), null);

ok('topics carol', T.classifyTopics('The pharmacy gave me this. Is it okay to skip a day if I feel sick? And when is my next visit?'), ['appointments', 'side-effects', 'medication']);
ok('topics billing', T.classifyTopics('Why did my insurance charge me?'), ['billing']);
ok('topics none', T.classifyTopics('Thank you'), ['other']);
ok('esc', T.esc('<b onclick="x">&</b>'), '&lt;b onclick=&quot;x&quot;&gt;&amp;&lt;/b&gt;');

const st = T.createStore({ n: 1 }); let seen = 0; st.subscribe(() => seen++); st.set({ n: 2 });
ok('store set notifies', [st.getState().n, seen], [2, 1]);
let threw = false; try { st.emit('not:an:event'); } catch (e) { threw = true; }
ok('unknown event throws', threw, true);
T.sched.instant = true; let ran = 0; T.sched.later(5000, () => ran++); ok('sched instant runs now', ran, 1);

const st2 = T.createStore({ now: d(8,22,19,52), messages: [], tasks: [], documents: {}, readUpTo: {}, care: { role: 'cc' } });
const A = T.actions(st2);
const m1 = A.sendMessage({ author: 'patient', body: 'hi', clientId: 'c1' }); A.sendMessage({ author: 'patient', body: 'hi', clientId: 'c1' });
ok('double-tap guard', st2.getState().messages.length, 1);
ok('task due defaults to 48h promise', A.createTask({ sourceMessageId: m1.id, assignee: 'md' }).due.getTime(), d(8,24,19,52).getTime());
A.setRole('md'); ok('md lands on tasks', st2.getState().care.view, 'tasks');

process.exit(fails ? 1 : 0);
```

- [ ] **Step 2:** Run `node "PrevMed/two-way chat/verify-chat.mjs"`. Expected: FAIL (`Cannot find module './store.js'`).
- [ ] **Step 3: Implement `store.js`:**

```js
/* Two-way chat — clock, rules, shared state. Classic script; loads in Node for tests. */
(function (root) {
  'use strict';
  var config = { SLA_HOURS: 48, SKIP_WEEKENDS: true,
    HOURS: { days: [1, 2, 3, 4, 5], open: 7, close: 17, label: 'Mon–Fri, 7 AM–5 PM PT' } };
  var DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var DAYS_LONG = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function at(y, m, d, h, min) { return new Date(y, m, d, h || 0, min || 0); }
  function nextDay(t) { return new Date(t.getFullYear(), t.getMonth(), t.getDate() + 1); }
  function weekend(t) { var g = t.getDay(); return g === 0 || g === 6; }
  function sameDay(a, b) { return a.toDateString() === b.toDateString(); }

  // Elapsed hours where Saturday and Sunday don't count.
  function replyBy(sentAt, opts) {
    var o = opts || {}, hours = o.slaHours != null ? o.slaHours : config.SLA_HOURS;
    var skip = o.skipWeekends != null ? o.skipWeekends : config.SKIP_WEEKENDS;
    var t = new Date(sentAt.getTime()), left = hours * 3600e3;
    if (!skip) return new Date(t.getTime() + left);
    while (left > 0) {
      var n = nextDay(t);
      if (weekend(t)) { t = n; continue; }
      var chunk = Math.min(left, n - t); t = new Date(t.getTime() + chunk); left -= chunk;
    }
    return t;
  }
  function dayLabel(d, now) {
    if (sameDay(d, now)) return 'today';
    if (sameDay(d, nextDay(now))) return 'tomorrow';
    return DAYS[d.getDay()] + ', ' + MONTHS[d.getMonth()] + ' ' + d.getDate();
  }
  function hourLabel(d) { var h = d.getHours(); return (h % 12 || 12) + (h < 12 ? ' AM' : ' PM'); }
  function formatReplyBy(deadline, now) {
    var d = new Date(deadline.getTime());
    if (d.getMinutes() || d.getSeconds() || d.getMilliseconds()) { d.setMinutes(0, 0, 0); d.setHours(d.getHours() + 1); }
    if (d.getHours() === 0) return 'end of day ' + dayLabel(new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1), now);
    var day = dayLabel(d, now);
    return day === 'today' || day === 'tomorrow' ? hourLabel(d) + ' ' + day : day + ' at ' + hourLabel(d);
  }
  function isOpen(now) { var H = config.HOURS, h = now.getHours();
    return H.days.indexOf(now.getDay()) >= 0 && h >= H.open && h < H.close; }
  function nextOpen(now) { var t = new Date(now.getTime());
    for (var i = 0; i < 24 * 8 && !isOpen(t); i++) t = new Date(t.getFullYear(), t.getMonth(), t.getDate(), t.getHours() + 1);
    return t; }
  function readWhen(now) {
    if (isOpen(now)) return 'soon';
    var o = nextOpen(now);
    if (sameDay(o, now)) return 'this morning';
    if (sameDay(o, nextDay(now))) return 'tomorrow morning';
    return DAYS_LONG[o.getDay()] + ' morning';
  }

  var FLAGS = [
    { level: 'crisis', re: /\b(kill(ing)? myself|suicid\w*|end(ing)? my life|hurt(ing)? myself|self[- ]?harm)\b/i },
    { level: 'emergency', re: /\b(chest pain|can'?t breathe|cannot breathe|trouble breathing|short(ness)? of breath|pass(ed)? out|faint(ed|ing)?|seizure|stroke)\b/i },
    { level: 'emergency', re: /\b(belly|stomach|abdomen|abdominal|tummy)\b[^.?!]{0,60}\bback\b/i },
    { level: 'emergency', re: /\b(severe|really bad|worst)\b[^.?!]{0,20}\b(belly|stomach|abdominal|tummy) pain\b/i },
    { level: 'emergency', re: /\b(keep|kept|can'?t stop|won'?t stop)\b[^.?!]{0,20}\b(throwing up|vomit\w*)\b/i }
  ];
  function detectRedFlags(text) {
    var s = String(text || ''), hit = null;
    for (var i = 0; i < FLAGS.length; i++) { var m = s.match(FLAGS[i].re);
      if (m && FLAGS[i].level === 'crisis') return { level: 'crisis', match: m[0] };
      if (m && !hit) hit = { level: 'emergency', match: m[0] }; }
    return hit;
  }
  var TOPICS = [
    ['appointments', /\b(appointment|next visit|reschedul\w*|move my visit|cancel my visit)\b/i],
    ['billing', /\b(bill\w*|insurance|cost|price|pay(ment)?|copay|charg\w*)\b/i],
    ['labs', /\b(labs?|blood tests?|results?)\b/i],
    ['side-effects', /\b(nause\w*|sick|vomit\w*|constipat\w*|diarrhea|heartburn)\b/i],
    ['medication', /\b(dose|doses|dosing|tablet|pill|medicine|medication|refill|foundayo|skip|pharmacy)\b/i]
  ];
  function classifyTopics(text) { var out = TOPICS.filter(function (t) { return t[1].test(text || ''); })
    .map(function (t) { return t[0]; }); return out.length ? out : ['other']; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }

  var timers = [];
  var sched = { instant: false,
    later: function (ms, fn) { if (sched.instant) { fn(); return 0; } var id = setTimeout(fn, ms); timers.push(id); return id; },
    clear: function () { timers.forEach(clearTimeout); timers = []; } };

  var EVENTS = Object.freeze(['visit:sent','sms:shown','patient:home-opened','patient:thread-opened','patient:read',
    'careplan:opened','careplan:closed','class:started','photo:attached','composer:filled','patient:message-sent',
    'june:message','screen:asked','screen:answered','screen:done','resources:shown','article:opened','article:closed',
    'care:role-changed','care:thread-opened','care:message-sent','care:read','task:sheet-opened','task:created',
    'care:tasks-opened','task:opened','summary:ready','template:used','doc:attached','task:done','push:shown',
    'sign:opened','sign:disclosure-accepted','sign:agreements-done','sign:signature-adopted','doc:signed',
    'sign:closed','time:jumped','photo:saved','menu:opened']);

  function createStore(initial) {
    var state = initial, subs = [], handlers = {};
    return {
      getState: function () { return state; },
      set: function (patch) { state = Object.assign({}, state, patch); subs.slice().forEach(function (f) { f(state); }); },
      subscribe: function (f) { subs.push(f); return function () { subs = subs.filter(function (g) { return g !== f; }); }; },
      on: function (ev, f) { (handlers[ev] = handlers[ev] || []).push(f);
        return function () { handlers[ev] = handlers[ev].filter(function (g) { return g !== f; }); }; },
      emit: function (ev, p) { if (EVENTS.indexOf(ev) < 0) throw new Error('Unknown event: ' + ev);
        (handlers[ev] || []).slice().forEach(function (f) { f(p); }); }
    };
  }
  function actions(store) {
    var n = 0;
    function S() { return store.getState(); }
    function patch(side, p) { var o = {}; o[side] = Object.assign({}, S()[side], p); store.set(o); }
    function docs(id, p) { var d = Object.assign({}, S().documents); d[id] = Object.assign({}, d[id], p); store.set({ documents: d }); }
    return {
      sendMessage: function (msg) {
        var s = S();
        if (msg.clientId && s.messages.some(function (m) { return m.clientId === msg.clientId; })) return null;
        var m = Object.assign({ id: 'm' + (++n), at: s.now, audience: 'all', kind: 'text' }, msg);
        store.set({ messages: s.messages.concat([m]) });
        store.emit(m.author === 'patient' ? 'patient:message-sent' : m.author === 'june' ? 'june:message'
          : m.kind === 'visit' ? 'visit:sent' : 'care:message-sent', m);
        return m;
      },
      setTyping: function (who, on) { var t = Object.assign({}, S().typing); t[who] = !!on; store.set({ typing: t }); },
      setPresence: function (who, what) { var p = Object.assign({}, S().presence); p[who] = what || null; store.set({ presence: p }); },
      markRead: function (side) {
        var s = S(), last = s.messages.length ? s.messages[s.messages.length - 1].id : null;
        var r = Object.assign({}, s.readUpTo); r[side] = { upTo: last, at: s.now }; store.set({ readUpTo: r });
        store.emit(side === 'patient' ? 'patient:read' : 'care:read', r[side]);
      },
      setExpectation: function (e) { store.set({ expectation: e }); },
      setIntake: function (i) { store.set({ intake: Object.assign({}, S().intake, i) }); },
      createTask: function (t) {
        var s = S(), src = s.messages.filter(function (m) { return m.id === t.sourceMessageId; })[0];
        var task = Object.assign({ id: 't' + (s.tasks.length + 1), status: 'open', createdAt: s.now, createdBy: s.care.role,
          due: replyBy(src ? src.at : s.now) }, t);
        store.set({ tasks: s.tasks.concat([task]) }); store.emit('task:created', task); return task;
      },
      completeTask: function (id) {
        var now = S().now;
        store.set({ tasks: S().tasks.map(function (t) { return t.id === id ? Object.assign({}, t, { status: 'done', doneAt: now }) : t; }) });
        store.emit('task:done', { id: id });
      },
      sendDocument: function (id) { docs(id, { status: 'sent', sentAt: S().now }); },
      openDocument: function (id) { var cur = S().documents[id];
        docs(id, { status: cur && cur.status === 'signed' ? 'signed' : 'opened' }); store.emit('sign:opened', { id: id }); },
      signDocument: function (id, sig) { docs(id, { status: 'signed', signedAt: S().now, signature: sig }); store.emit('doc:signed', { id: id }); },
      setSummary: function (sum) { store.set({ summary: sum }); store.emit('summary:ready', sum); },
      setChecklist: function (key, done) { var c = Object.assign({}, S().checklist); c[key] = done; store.set({ checklist: c }); },
      setRole: function (role) { patch('care', { role: role, view: role === 'md' ? 'tasks' : 'inbox', sheet: null });
        store.emit('care:role-changed', { role: role }); },
      jumpTime: function (date) { store.set({ now: date }); store.emit('time:jumped', { now: date }); },
      setView: function (side, view, extra) { patch(side, Object.assign({ view: view }, extra)); },
      openSheet: function (side, name, props) { patch(side, { sheet: { name: name, props: props || {} } }); },
      closeSheet: function (side) { patch(side, { sheet: null }); }
    };
  }

  var TWC = { config: config, at: at, replyBy: replyBy, formatReplyBy: formatReplyBy, isOpen: isOpen,
    nextOpen: nextOpen, readWhen: readWhen, detectRedFlags: detectRedFlags, classifyTopics: classifyTopics,
    esc: esc, sched: sched, EVENTS: EVENTS, createStore: createStore, actions: actions };
  root.TWC = TWC;
  if (typeof module !== 'undefined' && module.exports) module.exports = TWC;
})(typeof window !== 'undefined' ? window : globalThis);
```

- [ ] **Step 4:** Run it again. Expected: all PASS.

### Task 3: `story.js` — content, copy, steps (plus story and copy checks)

**Files:**
- Create: `story.js`.
- Modify: `verify-chat.mjs`.

**Interfaces:** produces `window.TWC_STORY`:
- `cast`, `carePlan`, `consentDoc{title, sections[5], agreements[4], acknowledgement}`, `articles[2]`, `cameraRoll[]` (`{id, src, alt}`, `'rx'` first).
- `inboxFiller[]`, `tasksFiller[]`, `templates{}`, `june{}`, `juneChips[]`.
- `visitMessage`, `carolQuestion`, `desaiReply`, `hintLabels{}`, `chapters[6] = {name, goal}`, `steps[]`, `initialState()`.
- Step shape: `{id, chapter, device, role?, time?:()=>Date, scene?:string, caption, hint, auto:(api)=>void, waitFor}`.
- `story.js` reads `TWC` from the global object, so tests require `store.js` first.

- [ ] **Step 1:** Add these checks (they fail until `story.js` exists):

```js
const S = require('./story.js');
const ids = S.steps.map(s => s.id);
ok('unique step ids', new Set(ids).size, ids.length);
ok('every waitFor is a known event', S.steps.filter(s => !T.EVENTS.includes(s.waitFor)).map(s => s.id), []);
ok('chapters 1–6 in order', [...new Set(S.steps.map(s => s.chapter))], [1,2,3,4,5,6]);
ok('every chapter has a goal', S.chapters.filter(c => !c.goal).length, 0);
ok('captions ≤ 2 sentences', S.steps.filter(s => (s.caption.match(/(?<!\bDr)[.?!](\s|$)/g) || []).length > 2).map(s => s.id), []);
const juneLines = Object.values(S.june).flat().filter(x => typeof x === 'string');
ok('June avoids banned words', juneLines.filter(l => /\b(normal|common|will pass|don'?t worry|should)\b/i.test(l)), []);
ok('no emoji in copy', /\p{Extended_Pictographic}/u.test(JSON.stringify(S)), false);
ok('no ! in chat copy', [S.june, S.templates, S.carolQuestion, S.desaiReply, S.visitMessage].flatMap(x => JSON.stringify(x).match(/!/g) || []).length, 0);
ok('June sentences under 20 words', juneLines.filter(l => l.split(/[.?]\s/).some(sn => sn.trim().split(/\s+/).length > 20)), []);
ok('consent: 5 sections, 4 agreements', [S.consentDoc.sections.length, S.consentDoc.agreements.length], [5, 4]);
ok('promise copy says weekends', juneLines.some(l => /weekends don't count/i.test(l)), true);
ok('role is Care Advocate', /Care Advocate/.test(JSON.stringify(S)) && !/Care Coordinator/i.test(JSON.stringify(S)), true);
ok('no PCP in copy', /\bPCP\b|primary care doctor|Dr\. Hayes/i.test(JSON.stringify(S)), false);
```

- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Write `story.js`:
  - Transcribe the Story section's copy verbatim, and each step-table row as a step.
  - Copy the consent text verbatim from `mvp3-side-effect-prescription.html:3215–3347`.
  - `hintLabels` gives plain-language "Next:" text for each hint, e.g. `'patient.sms': 'Tap the text on Carol’s phone'` (curly apostrophe).
  - `initialState()` starts at Tue Sep 22, 3:08 PM:
    - patient view `lock`, care role `md` on Carol's thread;
    - the care composer prefilled with `visitMessage` and a care-plan attachment;
    - checklist `{visit:true, message:false, plan:false, class:false, consent:null}` (`null` = not shown yet);
    - filler tasks and inbox rows.
- [ ] **Step 4:** Run. Expected: all PASS.

### Task 4: `components.js` + `chat.css` + `components.html` (the component library)

**Files:**
- Create: `components.js`, `components.html`, `COMPONENTS.md`.
- Modify: `chat.css`.

**Interfaces:**
- Produces `window.C`, one function per inventory row, returning an HTML string whose root has `data-figma` and `data-variant`. For example:
  - `C.ChatBubble({sender, side, position, state, html, photo})`
  - `C.MessageLabel({sender, name, role})`
  - `C.StatusStrip({state, owner, by, now})`
  - `C.Tab({icon, label, active, badge})`
  - `C.ChecklistStep({state, icon, title, meta})`
- All user text passes through `TWC.esc`.

- [ ] **Step 1:** Build the MD components to the values captured in planning:
  - **Header:** white, 72px, bottom border `--border-default-primary`, `Shadows/XS`. Logo 120×36. Profile pill: 48px avatar in purple with white "CS" (Body Bold) + 24px carrot, radius full.
  - **Greeting:** `.type-greeting` in `--text-default-primary`; subheading `.type-body` in `--border-default-tertiary`, with the link in `.type-body-bold` purple.
  - **Checklist module:**
    - Card: white, 1.5px `--dash-card-border`, radius 20, padding 24/16, gap 18.
    - Title `.type-serif-headline` `--primary-ink-300` + chevron.
    - Progress: 10px track `--dash-track`, fill `--dash-progress`, 30px check marker, end dot. Description `.type-body` `--dash-muted`.
    - Steps (gap 10):
      - To do: white, 1px border, radius 14, padding 14/18/14/16; 42px `--secondary-blue-300` circle with a 22px white icon; title Body Bold in ink; meta `.type-caption-1` muted + chevron.
      - Callout: a 40px stepper icon.
      - Done: `--dash-done-bg`, 42px `--dash-done-icon-bg` circle with a `--dash-done-check` ✓, title Body Bold in muted.
  - **Class card:** radius 8, `Drop Shadow/200`, 182px thumbnail + 4px timeline (`--surface-brand-secondary` track, `--surface-brand-primary` fill). Meta padding 8/12; title Body Bold ink; trainer Caption 1; a round `⋯` button. Position Tags: `--surface-default-tertiary`, radius 4, padding 4/8, Caption 1 Bold.
  - **June card:**
    - Gradient `--june-card-from` → white, 1px `--june-card-border`, radius 16, padding 16/8, gap 13.
    - 46px June Orb; `.type-june-title` in `--june-title`; body Caption 1 in `--june-body`.
    - Chips: white, 1.5px `--june-chip-border`, radius 20, padding 10/15, Caption 1 Bold with `--june-gradient` text.
  - **Floating button:** 2px conic-gradient ring (the Figma stops), white pill radius 38, padding 6/18/6/6, 46px orb + "Chat with June" Body Bold in `--dash-progress`, the floating-button shadow. It expands with a shimmer on load and collapses after 4 s (the Figma annotation).
  - **Nav:** white, top and bottom borders, padding 8; 5 tabs with flex 1, padding 8/4, radius 8, 20–24px icon + Caption 1 Bold ink label. The active tab uses `--surface-brand-secondary` with purple text. Badge: a purple circle with a white count, at least 20px.
  - **Account menu:** the DS DropdownMenu values — white, radius 16, xlarge shadow, padding 24 on mobile, gap 16, text-button rows with DS icons, and a Tag "1 new" on Messages.
- [ ] **Step 2:** Build the chat components, starting from JC's chat pieces (`side-effect-june-chat.html` 780–880).
  - `Chat/Bubble`:
    - June: `--surface-brand-secondary` + a 1px border, radius 7/18/18/18.
    - Staff: white + a 1px border, same shape.
    - Patient: purple `--primary-purple-300` with white text, radius 18/7/18/18.
    - The Failed state shows "Didn't send · Tap to try again".
  - `Chat/MessageLabel` goes on every message: 24px avatar or orb + name (Caption 1 Bold) + role (Caption 1 secondary) + an "AI" chip for June.
  - `Chat/TypingIndicator`: 3 dots, 1.2 s loop.
  - `Chat/StatusStrip`: owner avatar + a Body line; the second line is Caption 1 with the "Weekends don't count" highlight (`--surface-brand-secondary` background, purple bold text).
  - `Chat/Composer`: from JC, without the Topics pill.
  - `Chat/EmergencyNote`: Caption 1 in `--emergency-text`, centered above the composer.
  - Then the remaining NEW components from the inventory.
- [ ] **Step 3:** Build the care components and the Sign components from the Screens section.
- [ ] **Step 4: Motion.**
  - Message entrance: fade + 6px rise, 180 ms (JC).
  - Sheets: 280 ms `cubic-bezier(.32,.72,0,1)`.
  - Status strip: cross-fade, 200 ms.
  - The receiving phone's new row, badge or bubble pulses once (a `pulse` keyframe on `--primary-purple-300` at 0.35 alpha).
  - Floating button shimmer: a sweep across the ring.
- [ ] **Step 5:** `components.html` renders every component × every variant from the inventory table, each labeled with its Figma name and variant string, grouped Foundations → MD → DS → Chat → Care → Sign. `COMPONENTS.md` lists the inventory, the tokens (marking the hard-coded Figma values "propose as variable"), and the future Figma steps:
  - Create the components in the Bold library with `figma:figma-generate-library`.
  - Place the screens with `figma:figma-generate-design`.
  - Reuse existing MD components (Status Bar, Header, Class, June card, floating button, Position Tag, Button, the icons) instead of recreating them.
- [ ] **Step 6: Verify (Playwright).** Open `components.html`.
  - Every component renders with no console errors.
  - Compare the MD components side by side with the Task 0 screenshots; fix any differences.
  - Run `node verify-chat.mjs` (includes the CSS checks from Task 10 Step 1 once added).

### Task 5: Patient screens

**Files:**
- Create: `patient.js`, `june.js`.

**Interfaces:**
- `window.TWCPatient.mount(el, api)` returns these intents:
  - `tapSms()`, `tapPush()`, `openHome()`, `openMessages(from)` — `from` is `'tab' | 'menu' | 'fab' | 'card' | 'greeting'`.
  - `openCarePlan()`, `startFirstStep()`, `closeSheet()`, `typeMessage(text)`, `send()`, `answer(value)`.
  - `askChip(i)`, `openResource(i)`, `closeArticle()`, `attachPhoto(id)`, `openSign(id)`.
  - `acceptDisclosure()`, `completeAgreements()`, `adoptSignature(mode)`, `finishSigning()`, `closeSign()`.
- `window.TWCJune.attach(api)` subscribes to `patient:message-sent` and `screen:answered`.

- [ ] **Step 1: Screens.**
  - Lock screen (Messages-app notification, push notification).
  - Home, composed per Screens: class first, then checklist, June card, floating button, 5-tab nav. The checklist updates live from `state.checklist`; the badge from unread.
  - The avatar menu. Placeholder tabs.
  - Messages: header, status strip, intro card, thread, emergency note, composer.
  - Sheets and modals: About, Care plan, Attach, Photo picker, Photo viewer, Article, Signing.
- [ ] **Step 2: Entry points.** All five `openMessages(from)` sources open the same thread and clear unread (tab badge, menu count, greeting link). `askChip(i)` opens the thread, sends the chip's question as Carol's bubble, and June answers from `S.juneChips[i].answer`.
- [ ] **Step 3: `june.js`** follows the June copy in order, with typing dots before each June line (`420 + min(900, length × 9)` ms, via `sched`):
  - Red flags first; the reply is plain text only.
  - Answer the appointment question right away.
  - The Q1/Q2 chips; Carol's picks post back as her bubbles.
  - Then `setIntake`, the RoutingCard, `setExpectation({owner:'cc', by: replyBy(message.at)})`, J5–J7 and the ResourceCards.
  - Later free text: appointments/billing → "Ali can help with that. She'll reply within 48 hours. Weekends don't count."; anything else → "Got it. I added this to your message for Ali."
- [ ] **Step 4: Live signals.** The status strip reflects `presence`/`typing` for `cc` and `md` ("Ali is reading your message", "Ali is typing…"). Carol's latest message shows "Sent · 7:52 PM", then "Read by Ali · 8:03 AM".
- [ ] **Step 5: Verify (Playwright).**
  - Run steps 1.1–3.7 by tapping the hints.
  - Check each of the 4 entry points on a fresh page: same thread, unread cleared everywhere, and a chip question gets June's answer.
  - Typing checks: `''` keeps Send off; 1,000 characters wrap; `<b>x</b><script>alert(1)</script>` shows as text; a double-tap on Send gives one message.

### Task 6: Signing (DocuSign-style)

**Files:**
- Modify: `patient.js`, `components.js`, `chat.css`.

- [ ] **Step 1:** Build the flow: disclosure → document → adopt signature → done (Screens and Story copy).
  - The yellow Start/Next tag scrolls to and focuses the next unfinished field; "N of 5 done" updates.
  - Tapping Finish early scrolls to the next field.
- [ ] **Step 2:** Draw mode: a canvas with pointer events and `touch-action:none`, plus Clear. Type mode: a Caveat 40px preview.
- [ ] **Step 3:** `finishSigning()`:
  - calls `act.signDocument`;
  - sets the checklist `consent` to true;
  - posts the care-side event;
  - turns both phones' cards to Signed.
- [ ] **Step 4: Verify.** Complete it with taps, and again by drawing a signature (`browser_drag` on the canvas). "Email me a copy" shows a toast.

### Task 7: Care-team screens

**Files:**
- Create: `care.js`.

**Interfaces:** `window.TWCCare.mount(el, api)` returns these intents:
- `sendVisitMessage()`, `openInbox()`, `openThread(id)`.
- `startTaskFromMessage(ref)`, `createTask(overrides?)`, `createTaskFromMessage(ref, preset)`.
- `useTemplate(id)`, `send()`, `openTasks()`, `openTask(ref)`, `summarize()`, `composeReply(text)`.
- `attachDocument(id)`, `completeTask(ref)`, `switchAccount(role)`.
- A message `ref` is an id, `'latest-patient'` or `'latest-patient-photo'`. A task `ref` is an id or a patient id (the newest open task for that patient).

- [ ] **Step 1: Inbox.** Header + account switch, search, filter pills, `Care/InboxRow` (live), the off-hours banner (when `!isOpen(now)` and the role is `cc`), filler rows.
- [ ] **Step 2: Thread.**
  - Context bar "Last visit Sep 22 · Next Oct 20 · Foundayo 0.8 mg daily".
  - Bubbles; care-only cards (intake with June's answers, records, handoffs).
  - The `⋯` actions, Templates, Attach (Document to sign), the "Carol sees this as" line.
  - Opening the thread sets `presence.cc = 'reading'`. A filled composer sets `typing.cc`.
- [ ] **Step 3: Tasks.**
  - The task sheet with its defaults, and the follow-up choice setting Carol's sentence.
  - Creating a task posts the handoff event to both phones and sets `expectation {owner:'md'}`.
  - The Tasks tab list and detail.
  - "Mark task done?" appears after a provider reply.
- [ ] **Step 4:** Summarize: a skeleton for 900 ms, then the summary lines; "Copy to chart note" shows a toast.
- [ ] **Step 5: Verify.**
  - Steps 4.1–5.6 by tapping the hints; both phones stay in sync.
  - Care-side text typed with `<i>` shows escaped on both phones.

### Task 8: Story engine (Next / Back / Autoplay / hints / scene cards)

**Files:**
- Modify: `demo.js`.

- [ ] **Step 1:** Implement the engine:

```js
(function () {
  'use strict';
  var T = window.TWC, S = window.TWC_STORY, steps = S.steps;
  var api = null, i = 0, playing = false, busy = false, done = false, off = null, dwellTimer = null, hintOff = null;
  function boot() {
    T.sched.clear(); clearTimeout(dwellTimer); if (off) { off(); off = null; } clearHint();
    var store = T.createStore(S.initialState());
    api = { store: store, act: T.actions(store), sched: T.sched };
    api.patient = window.TWCPatient.mount(document.querySelector('#device-patient .screen'), api);
    api.care = window.TWCCare.mount(document.querySelector('#device-care .screen'), api);
    window.TWCJune.attach(api);
  }
  function dwell(s) { return 1400 + 40 * s.caption.split(/\s+/).length; }
  function prepare(k) { var s = steps[k];
    if (s.time) api.act.jumpTime(s.time());
    if (s.role && api.store.getState().care.role !== s.role) api.act.setRole(s.role); }
  function goTo(target) {                                       // instant replay: Back, chapter pills
    pause(); T.sched.instant = true; boot();
    for (var k = 0; k < target; k++) { prepare(k); steps[k].auto(api); }
    T.sched.instant = false; busy = false; arm(target);
  }
  function arm(k) {
    if (k >= steps.length) return finish();
    done = false; i = k; var s = steps[k]; prepare(k);
    showScene(s.scene); renderBar(s, k); setHint(s);
    if (off) off();
    off = api.store.on(s.waitFor, function () {
      off(); off = null; busy = false; clearHint();
      if (playing) dwellTimer = setTimeout(function () { perform(k + 1); }, dwell(s)); else arm(k + 1);
    });
  }
  function perform(k) { arm(k); if (i < steps.length && !done) { busy = true; steps[i].auto(api); } }
  function next() { if (!busy && !done) perform(i); }
  function back() { goTo(Math.max(0, i - 1)); }
  function play() { playing = true; renderBar(steps[i], i); if (!busy && !done) perform(i); }
  function pause() { playing = false; clearTimeout(dwellTimer); }
  function restart() { goTo(0); }
  function setHint(s) {
    clearHint(); if (!s.hint) return;
    var root = document.getElementById(s.device === 'care' ? 'device-care' : 'device-patient');
    function tryMark() { var el = root.querySelector('[data-hint="' + s.hint + '"]');
      if (el) { el.classList.add('is-hinted'); if (hintOff) { hintOff(); hintOff = null; } } }
    tryMark(); if (!root.querySelector('.is-hinted')) hintOff = api.store.subscribe(function () { requestAnimationFrame(tryMark); });
  }
  function clearHint() { if (hintOff) { hintOff(); hintOff = null; }
    document.querySelectorAll('.is-hinted').forEach(function (el) { el.classList.remove('is-hinted'); }); }
  function showScene(text) {
    if (!text || T.sched.instant) return;
    var el = document.querySelector('.interstitial'); el.textContent = text; el.hidden = false;
    setTimeout(function () { el.hidden = true; }, 1400);
  }
  function bar(sel) { return document.querySelector('.demo-bar ' + sel); }
  function renderBar(s, k) {
    var ch = S.chapters[s.chapter - 1];
    document.querySelectorAll('.chapter-pill').forEach(function (b) {
      if (+b.dataset.chapter === s.chapter) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
    bar('.bar-chapter').textContent = s.chapter + ' · ' + ch.name;
    bar('.bar-goal').textContent = 'Goal: ' + ch.goal;
    bar('.bar-caption').textContent = s.caption;
    bar('.bar-next').textContent = s.hint ? 'Next: ' + S.hintLabels[s.hint] : '';
    bar('[data-demo="back"]').disabled = k === 0;
    bar('[data-demo="play"]').textContent = playing ? 'Pause' : 'Autoplay';
  }
  function finish() {
    pause(); busy = false; done = true; clearHint();
    bar('.bar-chapter').textContent = 'That’s the loop';
    bar('.bar-goal').textContent = '';
    bar('.bar-caption').textContent = 'Visit, plan, first class, question, answer, and a signed form — all in Bold.';
    bar('.bar-next').textContent = ''; bar('[data-demo="play"]').textContent = 'Autoplay';
  }
  function buildStepper() {
    var nav = document.querySelector('.chapter-stepper');
    nav.innerHTML = S.chapters.map(function (c, n) {
      return '<button type="button" class="chapter-pill" data-chapter="' + (n + 1) + '"><span class="chapter-num">' +
        (n + 1) + '</span> ' + T.esc(c.name) + '</button>'; }).join('');
    nav.addEventListener('click', function (e) { var b = e.target.closest('.chapter-pill'); if (!b) return;
      goTo(steps.findIndex(function (s) { return s.chapter === +b.dataset.chapter; })); });
  }
  function wireControls() {
    document.querySelector('.demo-bar').addEventListener('click', function (e) {
      var b = e.target.closest('[data-demo]'); if (!b) return;
      ({ back: back, next: next, restart: restart,
         play: function () { if (playing) pause(); else play(); renderBar(steps[i], i); } })[b.dataset.demo]();
    });
  }
  function fit() {
    var stage = document.querySelector('.stage'), single = innerWidth < 900;
    var chrome = document.querySelector('.demo-top').offsetHeight + document.querySelector('.demo-bar').offsetHeight + 32;
    stage.classList.toggle('stage--single', single);
    var s = Math.min(1, (innerHeight - chrome) / 876, (innerWidth - 120) / ((single ? 1 : 2) * 417));
    stage.style.setProperty('--device-scale', Math.max(0.5, s).toFixed(3));
  }
  document.addEventListener('keydown', function (e) {
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable) return;
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft') back(); else if (e.key === 'r' || e.key === 'R') restart();
  });
  window.TWCDemo = { next: next, back: back, goTo: goTo, play: play, pause: pause, restart: restart, fit: fit,
    get index() { return i; }, get api() { return api; } };
  addEventListener('DOMContentLoaded', function () { buildStepper(); wireControls(); fit(); addEventListener('resize', fit); goTo(0); });
})();
```

  Rule: tap actions that depend on UI that hasn't appeared yet (e.g. `patient.answer('fine')` before June's chips render) wait for their event once (`screen:asked`), then act. They never throw.

- [ ] **Step 2: Verify (Playwright).**
  - `TWCDemo.goTo(steps.length - 1)` leaves 0 console errors: the document is signed, the task done, the checklist complete, and there are no duplicate message ids.
  - `goTo(15)` then `back()` ×3 gives the same messages, tasks and expectation as a fresh `goTo(12)`.
  - Next while the care plan sheet is open still advances. A quick double Next adds no duplicates.
  - Autoplay runs from 1.1 to the end hands-free.

### Task 9: Home details and cross-phone coherence

**Files:**
- Modify: `patient.js`, `care.js`, `components.js`.

- [ ] **Step 1: Home checklist:**
  - After step 1.3: "Read Dr. Desai's message" ✓.
  - After 2.1: "Review your care plan" ✓.
  - After 2.2: "Try your first class" ✓.
  - At 5.5: "Sign your treatment consent" appears as a Callout.
  - After 6.6: it's ✓, the progress bar animates, and the text updates ("All done. Dr. Desai sees your progress before your next visit.").
- [ ] **Step 2: Care-side records** from patient actions:
  - "Carol opened your message · 7:41 PM" (on `patient:thread-opened` after `visit:sent`);
  - "Carol started her first class · 7:45 PM";
  - "Carol signed…".
  - These feed the summary.
- [ ] **Step 3: Verify.** After `goTo(steps.length - 1)`, the Home checklist shows 4 of 4 done and the care thread shows all three records.

### Task 10: CSS checks, README, register, final run

**Files:**
- Modify: `verify-chat.mjs`, `projects.json` (repo root).
- Create: `README.md`.

- [ ] **Step 1:** Add the CSS checks:

```js
import { readFileSync } from 'fs';
for (const file of ['./tokens.css', './chat.css']) {
  const css = readFileSync(new URL(file, import.meta.url), 'utf8');
  ok(file + ': no font-size below 14px', [...css.matchAll(/font-size:\s*(\d+(?:\.\d+)?)px/g)].map(m => +m[1]).filter(px => px < 14), []);
  if (file === './chat.css') ok(file + ': colors only via tokens', css.match(/#[0-9a-fA-F]{3,8}\b/g) || [], []);
}
const comp = readFileSync(new URL('./components.js', import.meta.url), 'utf8');
ok('every component root names its Figma component', (comp.match(/function [A-Z]\w+\(/g) || []).length <= (comp.match(/data-figma="/g) || []).length, true);
```

- [ ] **Step 2:** Run, and fix until all PASS.
- [ ] **Step 3: `README.md`:**
  - How to run: `python3 -m http.server 8899` from the repo root, or open `index.html`.
  - The 6-chapter talk track, in PM language.
  - A link to `components.html` and `COMPONENTS.md`.
  - Open questions:
    - The reply promise and hours need Dr. Deeb's sign-off.
    - Dr. Desai's reply is clinical copy.
    - Figma body text is 16px, and the brief's 65+ floor is 18px.
    - The June floating button and card add two more ways into the chat.
    - Principle 5 was overridden (typing on).
- [ ] **Step 4: Register in `projects.json`** (append to `projects`): `{"path":"PrevMed/two-way chat","href":"PrevMed/two-way%20chat/index.html","name":"Two-way Care Team Chat","desc":"Patient and care-team phones side by side: Dr. Desai's post-visit message and care plan, June answering and screening, Care Advocate and provider replies within 48 hours (weekends don't count), tasks, recap, and in-chat signing.","icon":"📨","author":"Tzu-Yi","category":"Prototypes"}`.
  - Don't run `npm run generate` unless asked.
- [ ] **Step 5: Final run** (Playwright, 1440×900).
  - Autoplay the whole story, with a screenshot at the end of each chapter (`/tmp/twc-*.png`).
  - Compare Home and the chat side by side with `figma-refs/`, and fix the differences.
  - Check 1280×720, 1920×1080 and 800×900.
  - `node verify-chat.mjs` all PASS. Console: 0 errors.

---

## Execution

**Next session:**
1. The Figma MCP is connected now; restart so its tools load natively.
2. Open a new session in `PrevMed/two-way chat/`.
3. Say: "Execute the plan at `~/.claude/plans/now-i-want-you-synthetic-mitten.md`, starting with Task 0."

**Recommended: native execution** (`superpowers:executing-plans`), then one fresh review of the whole branch.
- The tasks share tight interfaces (state ↔ story ↔ components ↔ both phones).
- Visual consistency needs one author.

**Later (when asked):** put the design back into Figma from `components.html` + `COMPONENTS.md` with `figma:figma-generate-library` and `figma:figma-generate-design`, reusing the existing MD components.

## Verification (end to end)
1. `node "PrevMed/two-way chat/verify-chat.mjs"` covers the clock, weekend rule, hours, rules, escaping, state, story, copy, CSS and component naming. All must PASS.
2. Serve and open `http://localhost:8899/PrevMed/two-way%20chat/`.
   - Autoplay chapters 1–6.
   - Try all 4 chat entry points by hand.
   - Open `components.html`.
3. The Playwright checks in Tasks 4–10 cover the Review Focus 1–5 cases.
4. Home and the chat match `figma-refs/` side by side.

---

## Figma reconciliation (Task 0, 2026-09-27)

Screenshots are in `figma-refs/`. Where they differ from the text above, the screenshots win:

1. **The consent step already exists.** The Member Dashboard's pre-visit checklist has "Review & sign GLP-1 informed consent · 5 min" (signature stepper icon). The post-visit checklist keeps it as an **open item from the start** (Callout style), rather than having it appear at step 5.5. Dr. Desai sending it in the chat completes an existing task.
2. **Page background** is a top-to-bottom gradient from `#F2F5FE` to white (token `--page-gradient-from`). The Home body has padding 24 top / 48 bottom and a 26px gap between modules.
3. **Section headings** ("Weight loss video content", "Learn more", "FAQ") are **Inter SemiBold 24/32, −0.5px tracking, `#140D26`** — new text style `.type-title`. Only the module header inside the checklist card uses the Serif Headline.
4. **Nav:** the Home and Library icons are 24px; the Care and My health icons are 20px. The MD frames show no active-tab style, so the active tab follows the SE chat frame: lavender background + purple.
5. **Icons that appear in MD frames use the downloaded Figma SVGs** (`images/figma/*`): nav icons, chevrons, stepper icons, status bar, logo, June orb, class thumbnail. Icons that aren't in MD use the Phosphor web font (the same family).
6. The SE care-team thread frame `860:51783` lives in a different Figma file than the one open in Figma desktop, so it wasn't captured. The chat styling follows JC (built from that board) and `figma-refs/860-51108-chat.png`.
