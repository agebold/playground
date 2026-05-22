# Weight Management App — End-to-End User Journey

**Companion to** [personas-doc.md](personas-doc.md) and [design-brief.md](design-brief.md).
Bold GLP-1 Companion Product · Q3 2026 launch
Last updated: 2026-05-20

---

> **Read this first.** Both personas (Tried-and-Burned, Curious-but-Wary) are confirmed adults age **65+, living in the United States, Medicare-eligible**. Every stage below is designed to meet needs from *both* personas; that's how we know a feature earns its place on the journey.

## How to read this journey

Each stage answers three questions, side-by-side for both personas:

1. **Trigger** — the problem or need the persona walks into this stage with, in their voice.
2. **Feature** — the in-product capability that resolves the trigger. Each feature cites the value prop and principle it embodies (see [data/synthesis/value-props.md](data/synthesis/value-props.md), [principles.md](data/synthesis/principles.md)).
3. **Action** — what the user actually does on the primary surface.

Every stage also carries an **anti-pattern guard** — the one thing we will *not* do here, drawn from [findings.md → What to avoid](data/synthesis/findings.md) and [positioning.md → "We're not"](data/synthesis/positioning.md).

The journey is linear, left-to-right. Stage 5 (Care Plan) fans out into three parallel modules (5a Nutrition · 5b Strength & Balance · 5c Body Composition) that converge into stage 6.

---

## Stage 0 — Discover & earn first trust

| | **Persona 1 — Tried-and-Burned** | **Persona 2 — Curious-but-Wary** |
| --- | --- | --- |
| **Trigger** | *"Why would this time be any different? Last GLP-1 cost me $400 to lose seven pounds and made me sick."* ([2026-05-05 transcript, 00:12:29](data/raw/Weight%20Management%20Research%20Readout%20-%202026_05_05%2014_29%20PDT%20-%20Notes%20by%20Gemini.pdf)) | *"I want this to work — but is it safe for me? Is this even safe for someone my age?"* ([findings.md #3](data/synthesis/findings.md)) |
| **Action** | Land on hero, see what's *different*, click "See if Bold is right for me." | Land on hero, see FDA + Medicare + pill scaffolding, click "See if Bold is right for me." |

**Feature — Trust-scaffolded hero.**
Hero headline: *"Lose fat. Stay strong. Covered by Medicare."* ([positioning.md → Hero copy bank](data/synthesis/positioning.md)). Pill is the default visual frame. Three trust signals visible above the fold: FDA-approved name brands · 86% of Bold patients pay $0 out of pocket · clinician in the loop. Acknowledgment line below the hero — *"If a GLP-1 didn't work for you before, here's what we do differently"* — directly addresses Persona 1.

- Embodies: VP #1 (FDA + Medicare + pill), VP #2 ("Lose fat, not strength"). [principles.md #4, #5, #11](data/synthesis/principles.md).

**Anti-pattern guard.** No vial, syringe, or compounded medication in hero. No "% body weight loss" headline. No "GLP-1 access" framing without immediately pairing it with cost/coverage. ([findings.md → What to avoid](data/synthesis/findings.md))

---

## Stage 1 — Check coverage & form factor

| | **Persona 1** | **Persona 2** |
| --- | --- | --- |
| **Trigger** | *"I don't want a surprise bill again."* ([findings.md #19–20](data/synthesis/findings.md)) | *"Will Medicare cover this? And do I have to take a shot?"* ([findings.md #2, #20](data/synthesis/findings.md)) |
| **Action** | Enter Medicare info, see pill option pre-selected as default. | Enter Medicare info, see pill option pre-selected as default with pen as a clearly-labeled secondary. |

**Feature — Coverage + form-factor preview.**
Eligibility check returns a real-dollar number (*"$50/month with Medicare · 86% of Bold patients pay $0 out of pocket"*) paired with a pill-first form-factor preview. Pen offered as secondary; needle/vial deliberately absent. Cost and form-factor surfaced together, never separately.

- Embodies: VP #1 (full). [principles.md #4, #5, #11](data/synthesis/principles.md).

**Anti-pattern guard.** Never show "FDA-approved" without a coverage signal in the same view — it triggers cost anxiety on its own. ([findings.md #4](data/synthesis/findings.md))

---

## Stage 2 — Schedule visit

| | **Persona 1** | **Persona 2** |
| --- | --- | --- |
| **Trigger** | *"I need to know a real provider's involved this time — not a chatbot."* ([findings.md #5](data/synthesis/findings.md)) | *"I want a real clinician, not chat coaching. Someone I can call when something feels off."* ([principles.md #6](data/synthesis/principles.md)) |
| **Action** | Pick an appointment slot with a Bold clinician. | Pick an appointment slot with a Bold clinician. |

**Feature — Schedule with a real clinician.**
Calendar surface framed as: *"Your clinician will check whether a GLP-1 is right for you and stay with you through side effects and dosage."* Provider-as-safety-net language is used verbatim, never coach/coaching.

- Embodies: VP #6. [principles.md #6](data/synthesis/principles.md), [positioning.md → User-need → copy bank: "Tell me why the clinician matters"](data/synthesis/positioning.md).

**Anti-pattern guard.** No "Chat with your coach today!" framing. No promise of daily check-ins. Provider availability is described as *purposeful and sparse*, not always-on.

---

## Stage 3 — Provider intake visit

| | **Persona 1** | **Persona 2** |
| --- | --- | --- |
| **Trigger** | *"I want them to know what went wrong last time so it doesn't happen again."* (Persona 1 snapshot, [personas-doc.md](personas-doc.md)) | *"As you get older you have to worry about bone density. Will they take that seriously?"* ([2026-05-05 transcript, 00:15:42](data/raw/Weight%20Management%20Research%20Readout%20-%202026_05_05%2014_29%20PDT%20-%20Notes%20by%20Gemini.pdf)) |
| **Action** | Complete intake with prior GLP-1 history captured; agree on a starting plan. | Complete intake with age-specific concerns (bone density, balance) captured; agree on a starting plan. |

**Feature — Clinician intake with two acknowledgments.**
Intake surface explicitly captures (a) prior GLP-1 experience and side-effect history (for P1) and (b) aging-related priorities — bone density, strength, balance (for P2). The clinician returns a starting plan that names the medication, the form factor (pill-first), the side-effect playbook, and the body-composition baseline they'll watch together.

- Embodies: VP #1 + VP #6. [principles.md #6](data/synthesis/principles.md), [findings.md #3, #5, #8](data/synthesis/findings.md).

**Anti-pattern guard.** Intake is **not** a generic health questionnaire. No labs duplication ("metabolic health score") — users say they already get that from their PCP. ([findings.md #7](data/synthesis/findings.md))

---

## Stage 4 — Prescription & delivery

| | **Persona 1** | **Persona 2** |
| --- | --- | --- |
| **Trigger** | *"I don't want the vial nightmare again. If I could do a pill, that'd be great."* ([2026-05-05 transcript, 00:12:29](data/raw/Weight%20Management%20Research%20Readout%20-%202026_05_05%2014_29%20PDT%20-%20Notes%20by%20Gemini.pdf)) | *"I'm definitely afraid of shots."* ([2026-05-05 transcript, 00:13:23](data/raw/Weight%20Management%20Research%20Readout%20-%202026_05_05%2014_29%20PDT%20-%20Notes%20by%20Gemini.pdf)) |
| **Action** | Confirm prescription; receive welcome kit and delivery date. | Confirm prescription; receive welcome kit and delivery date. |

**Feature — Pill-first prescription with no-surprise cost.**
Prescription confirmation states the FDA-approved brand name, the pill form factor, the monthly cost ($50/mo with Medicare · 86% of Bold patients pay $0), and the side-effect playbook the clinician has already shared. Welcome kit is on its way — no needle imagery anywhere in the confirmation or kit.

- Embodies: VP #1 (full). [principles.md #4, #5, #11](data/synthesis/principles.md), [findings.md #2, #19–20](data/synthesis/findings.md).

**Anti-pattern guard.** Never show a vial or syringe in the prescription confirmation, the welcome kit, or the delivery email. Never lead with compounded medication. ([findings.md → What to avoid](data/synthesis/findings.md))

---

## Stage 5 — Care plan reveal

| | **Persona 1** | **Persona 2** |
| --- | --- | --- |
| **Trigger** | *"Just tell me what to do — I don't want to figure it out from scratch again."* ([positioning.md user need](data/synthesis/positioning.md)) | *"Don't make me figure it out from scratch."* ([positioning.md user need](data/synthesis/positioning.md)) |
| **Action** | Review the personalized plan; see today's next step on the dashboard. | Review the personalized plan; see today's next step on the dashboard. |

**Feature — Personalized care plan as the spine.**
The medication is one of four pieces. The plan also names: today's nutrition guidance (5a), this week's strength & balance routine (5b), the body-composition baseline (5c), and the cadence of clinician check-ins (stage 6). The plan is presented as a *single dashboard*, not a feed.

- Embodies: VP #2 framing wrapped around VP #3, #4, #5. [positioning.md → "Don't make me figure it out from scratch"](data/synthesis/positioning.md), [decisions.md 2026-05-05](data/synthesis/decisions.md).

**Anti-pattern guard.** No daily-streak gamification. No habit checkboxes. The plan is *guidance you can act on*, not a tracker. ([principles.md #1](data/synthesis/principles.md))

The plan branches into three parallel modules ⬇

### 5a — Nutrition guidance · AI meal-prep assistant

| | **Persona 1** | **Persona 2** |
| --- | --- | --- |
| **Trigger** | *"I'm tired of restrictive diets. And I cook less than I used to."* ([findings.md #13–14](data/synthesis/findings.md)) | *"I want help eating well without logging every bite."* ([positioning.md user need](data/synthesis/positioning.md)) |
| **Action** | Open the assistant, snap a photo of the fridge or describe what's around, say how they're feeling. Pick a recipe (or a takeout suggestion). | Open the assistant, snap a photo of the fridge or describe what's around, say how they're feeling. Pick a recipe (or a takeout suggestion). |

**Feature — Conversational AI meal-prep assistant.**
Talks to the user *before* the meal, not after. Inputs: a photo of what's in the fridge (or a short text list), the user's mood/energy that day, and stored preferences. Outputs: 1–3 recipe options tuned to dietary preferences, portion size, daily nutrition goals (protein-forward — *adding*, not restricting), dietary restrictions, and time available to cook. When time is short or cooking is off the table, it suggests takeout/prepared-food choices and reads a restaurant menu on request.

- Embodies: VP #5. [principles.md #1, #2, #9, #10](data/synthesis/principles.md), [findings.md #10, #11, #13–14](data/synthesis/findings.md).

**Anti-pattern guard.** *"We don't log every bite.* The assistant talks to you before the meal, not after — and never asks you to count calories." No restrictive-diet framing (keto, low-sugar). Photo input is for personalization, not a food diary. ([findings.md #9–11, #13](data/synthesis/findings.md))

### 5b — Strength & balance plan

| | **Persona 1** | **Persona 2** |
| --- | --- | --- |
| **Trigger** | *"Show me I'm protecting muscle, not just dropping scale weight."* ([findings.md #6, #17](data/synthesis/findings.md)) | *"I can't stand for more than five or seven minutes."* ([2026-05-05 transcript, 00:21:00](data/raw/Weight%20Management%20Research%20Readout%20-%202026_05_05%2014_29%20PDT%20-%20Notes%20by%20Gemini.pdf)) |
| **Action** | Tap today's routine; complete a seated, joint-friendly session. | Tap today's routine; complete a seated, joint-friendly session. |

**Feature — Older-adult strength & balance plan.**
Routines are seated by default, balance-safe, joint-friendly, and progress on a strength + bone-support axis. Every illustration and demo reads as accessible to a 65+ user; standing tolerance is assumed at under 5 minutes. No equipment beyond what's already at home.

- Embodies: VP #4. [principles.md #7](data/synthesis/principles.md), [findings.md #15–16](data/synthesis/findings.md).

**Anti-pattern guard.** No generic-fitness imagery. No step counters. No wearable references. If a screen could be mistaken for a generic fitness app, redo it. ([principles.md #7, #8](data/synthesis/principles.md))

### 5c — Body composition · DEXA-grade phone camera scan

| | **Persona 1** | **Persona 2** |
| --- | --- | --- |
| **Trigger** | *"Last time I was just bouncing on the scale. I want to see I'm losing fat, not muscle."* ([findings.md #6](data/synthesis/findings.md)) | *"As you get older you have to worry about bone density. Body composition stands out more than the rest."* ([2026-05-05 transcript, 00:15:42](data/raw/Weight%20Management%20Research%20Readout%20-%202026_05_05%2014_29%20PDT%20-%20Notes%20by%20Gemini.pdf)) |
| **Action** | Complete the camera scan once a month. Read fat-down / muscle-preserved progress card. | Complete the camera scan once a month. Read fat-down / muscle-preserved progress card. |

**Feature — DEXA-grade body composition (phone camera).**
Headline label on the card: *"DEXA-grade body composition · No clinic visit needed."* A small **ⓘ** icon next to "DEXA-grade" opens an explainer:

> *"DEXA is the gold-standard scan clinicians use to measure how much of your weight is fat, how much is muscle, and how much is bone. Bold uses your phone's camera to deliver the same level of insight — no clinic visit, no machine, no needles. Your clinician sees the same numbers they'd see from a hospital DEXA scan."*

Privacy callout directly under the feature description, verbatim:

> *Scan fully clothed · Your data stays private.*

The progress view shows lean-mass preserved, fat-mass change, fat distribution, and bone-density indicators — never scale weight as the hero. The user-facing progress story lives here.

- Embodies: VP #3. [principles.md #3, #8, #12](data/synthesis/principles.md), [findings.md #6, #8](data/synthesis/findings.md), resolves part of [open-questions.md → Measurement strategy](data/synthesis/open-questions.md).
- *Clinical-claim review required* on the "DEXA-grade" wording before this ships externally. Decision needs to be appended to [decisions.md](data/synthesis/decisions.md).

**Anti-pattern guard.** No scale-weight headline. No wearable required. No before/after photos shown without explicit consent. No metabolic-health score borrowed from PCP labs. ([findings.md #7, #18](data/synthesis/findings.md))

---

## Stage 6 — Chat with provider & check-ins

| | **Persona 1** | **Persona 2** |
| --- | --- | --- |
| **Trigger** | *"Last time the nausea ended it for me — I quit at six weeks."* ([2026-05-05 transcript, 00:12:29](data/raw/Weight%20Management%20Research%20Readout%20-%202026_05_05%2014_29%20PDT%20-%20Notes%20by%20Gemini.pdf)) | *"What if something feels off? I want a person, not a bot."* ([findings.md #5](data/synthesis/findings.md)) |
| **Action** | Message the clinician about a symptom; log a clinical weight value; upload an outside lab result. | Message the clinician about a symptom; log a clinical weight value; upload an outside lab result. |

**Feature — Asynchronous patient-initiated chat with the clinician.**
A messaging surface tied to the patient's assigned clinician, with three capabilities:

1. **Send a message** about how they're feeling — side effects, energy, concerns. Stated SLA on response time. No chatbot, no daily prompts.
2. **Log a clinical weight value** that is shared with the clinician for medication safety. Framed as: *"Your clinician uses this to keep you safe on the medication."* This is **not** the user's progress hero — that lives in 5c.
3. **Upload a lab result** (PDF or photo) from an outside PCP or specialist, so the clinician has the full picture.

- Embodies: VP #6. [principles.md #6](data/synthesis/principles.md), [findings.md #5](data/synthesis/findings.md), [positioning.md → "Tell me why the clinician matters"](data/synthesis/positioning.md).

**Anti-pattern guard.** Provider as safety net, **not** coach. No daily check-in prompts pushed at the user. No chatbot. No "Your provider is online — say hi!" framing. Weight here is *clinical*, not your progress score. ([principles.md #6](data/synthesis/principles.md), [findings.md #5, #9](data/synthesis/findings.md))

---

## Stage 7 — Ongoing care & milestones

| | **Persona 1** | **Persona 2** |
| --- | --- | --- |
| **Trigger** | *"I want to know I'm protecting muscle and bone, not just shedding scale weight. And I want to know the cost stays stable."* ([findings.md #6, #19](data/synthesis/findings.md)) | *"Is this still safe for me long-term? Will my clinician adjust the dose if I need it?"* ([findings.md #5](data/synthesis/findings.md)) |
| **Action** | Review the quarterly body-composition milestone with the clinician; agree on dose / taper / continue; renew prescription. | Review the quarterly body-composition milestone with the clinician; agree on dose / taper / continue; renew prescription. |

**Feature — Quarterly provider review + body-composition milestone.**
Every quarter the journey loops back: clinician reviews the user's body-composition trajectory (5c data), side-effect history (stage 6 data), and lifestyle adherence (5a, 5b summaries). Together they make the dose-adjustment / continue / taper call and renew the prescription. Milestones are celebrated on the *kind* of weight protected, never on % body-weight loss.

- Embodies: VP #6 + VP #2 + VP #3. [principles.md #3, #6](data/synthesis/principles.md), [findings.md #17–18](data/synthesis/findings.md).

**Anti-pattern guard.** No "you've lost X% of your body weight!" milestone. No surprise renewal pricing — the $50/mo line must hold. No additional co-pay surfaces appearing without notice. ([open-questions.md → Pricing and packaging](data/synthesis/open-questions.md))

---

## Coverage check — both personas, every stage

The table below confirms each stage answers a real need from *both* personas (not just one). If a row is blank for either persona, the feature doesn't belong on the journey.

| Stage | Persona 1 — Tried-and-Burned | Persona 2 — Curious-but-Wary |
| --- | --- | --- |
| 0 Discover & trust | "Show me what's different" | "Earn first trust" |
| 1 Coverage & form factor | "No surprise bills" | "Will Medicare cover this? Can I avoid a shot?" |
| 2 Schedule visit | "Real provider this time" | "Real clinician, not a chatbot" |
| 3 Provider intake | "Acknowledge what went wrong before" | "Take my age and bone density seriously" |
| 4 Prescription & delivery | "Pill, not vial; no surprise cost" | "Pill, not shot; cost as promised" |
| 5 Care plan reveal | "Don't make me figure it out again" | "Don't make me figure it out from scratch" |
| 5a AI meal-prep | "No more restrictive diets, I cook less" | "Help me eat well without logging" |
| 5b Strength & balance | "Protect my muscle" | "Routines I can actually do at my age" |
| 5c DEXA-grade body comp | "Prove it's the right kind of weight loss" | "Protect bone density and strength" |
| 6 Chat with provider | "If side effects hit, I want a person" | "Someone to call when something feels off" |
| 7 Ongoing care | "Stable cost, real progress" | "Long-term safety, clinician-led adjustments" |

---

## Anti-pattern checklist (run before declaring done)

- [ ] No needle, syringe, or vial imagery anywhere. ([principles.md #4](data/synthesis/principles.md))
- [ ] Pill-first appears in stage 1 visual treatment, not just stage 4.
- [ ] FDA + Medicare/$50 mentioned together at least once in stage 0 or 1. ([principles.md #5](data/synthesis/principles.md))
- [ ] No "% body weight loss" language anywhere. ([findings.md #18](data/synthesis/findings.md))
- [ ] No meal logging, habit checkboxes, or wearable references in 5a/5b/5c. ([principles.md #1, #8](data/synthesis/principles.md))
- [ ] Provider stages (2, 3, 6, 7) use "safety net" language, never "coach" or "daily check-in." ([principles.md #6](data/synthesis/principles.md))
- [ ] Exercise references explicitly call out seated/balance/joint-friendly options. ([principles.md #7](data/synthesis/principles.md))
- [ ] AI meal-prep assistant framed as *before-the-meal guidance*, never as logging. Photo-of-fridge is input, not a food diary. ([findings.md #10, #11](data/synthesis/findings.md))
- [ ] Phone camera body-comp card carries the privacy callout *"Scan fully clothed · Your data stays private"* verbatim under the feature description.
- [ ] "DEXA-grade" claim has an ⓘ explainer next to it; wording reviewed with clinical team before external publishing.
- [ ] Weight in the provider chat framed as clinical safety data shared with the clinician, never as the user's progress hero. The user-facing progress story stays in 5c. ([principles.md #3](data/synthesis/principles.md))
- [ ] Provider chat is patient-initiated, async, SLA-stated. No daily prompts, no chatbot, no "Chat with your coach!" framing. ([principles.md #6](data/synthesis/principles.md))

---

## Related

- [personas-doc.md](personas-doc.md) — the two personas this journey is built for.
- [design-brief.md](design-brief.md) — the prototype-phase design brief.
- [data/synthesis/findings.md](data/synthesis/findings.md) · [decisions.md](data/synthesis/decisions.md) · [principles.md](data/synthesis/principles.md) · [value-props.md](data/synthesis/value-props.md) · [positioning.md](data/synthesis/positioning.md) · [open-questions.md](data/synthesis/open-questions.md)
