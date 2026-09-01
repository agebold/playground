# Decisions Log

Dated record of what the team agreed to do, drop, or defer. Newest first.

---

## 2026-08-04 — Added approach D: an agent conversation, with the LLM confined to phrasing

`mvp4-side-effect-triage.html` now carries a fourth approach alongside A/B/C. The member taps "Report a side effect", a bottom sheet opens, and an agent asks a couple of basic questions then only the follow-ups those answers make relevant, closing with an agent-written summary. Goal: make reporting effortless and never a wall of text. Guardrail: **the agent must not diagnose** — it reflects, states the care team's rule, and hands the decision to the member.

- **Hybrid engine, deliberately lopsided.** An LLM (`claude-opus-5`, `effort: low`) rewords *questions and reflections only*. It never sees a tier, never sees the disposition, and is never asked to decide anything. Every clinical decision comes from the same deterministic spine A/B/C use. A new `tools/phrase-proxy.mjs` holds the API key — a browser never should — and the page calls localhost. **With the layer off, or the proxy down, the flow is identical and the disposition is byte-identical**; only the wording changes. Verified by an offline-parity test.

- **The no-diagnosis guardrail is code, not copy discipline.** `assertSafePhrasing()` discards any reworded string that exceeds a length cap, contains markup, introduces a digit absent from the original, turns one question into two, or matches a banned pattern (`you have`, `this is`, `sounds like`, `probably`, `diagnos`, `pancreatit`, `gallstone`, `obstruction`, `infection`, `dehydrat`, `serious`, `emergency`). Nine adversarial strings are asserted rejected. This matters more for D than for A/B/C: a conversational agent carries more perceived authority than a form, and FDA's CDS guidance weighs "the level of automation and time-critical nature" of the decision and names automation bias.

- **The summary splits along the guardrail.** "What you told me" is agent-narrated. "What you need" — tier label, title, basis line, lead, dose instruction, safety net, teach-back — is rendered verbatim from the spine. The LLM may introduce a disposition but never author one.

- **Only ask what changes the outcome.** Duration is asked only when something has escalated to `concern`/`urgent` (asking a member with mild nausea how many days it's been changes nothing). The companion gate still fires at *any* severity whenever a GI symptom is on the table — the fix that closes the Figma's hole. An emergency-tier answer ends the conversation immediately, per STCC's stop-at-the-first-positive.

- **The severity question carries the red flag.** Rather than spending a turn on a separate red-flag question, the most severe option is present as a chip in the same turn. A `D_CHIPS`/`D_RECAP` lockstep test asserts every chip list matches its symptom's level count and that the last chip is the most severe tier — a drifted list would silently map a tap to the wrong tier.

- **Three copy-deck gaps closed in D only** (A/B/C stay as reviewed): free text for "Something else" now reaches the provider note in the member's own words; low blood sugar is offered only to members on insulin or a sulfonylurea (deck flag #3); and the caregiver line — *"Don't give food or drink to someone who isn't fully awake. If they have a glucagon kit and you know how to use it, use it now."* **⚠️ That safety line is still absent from A/B/C — worth backporting.**

**Verification:** 44 spine assertions (unchanged — D moved no tier), 81 D assertions, 3 pronoun-handling assertions. Reading level of D's strings: grade 1.8. Sub-14px fonts: none. Touch targets ≥44px. Sheet is `role="dialog" aria-modal="true"` with a focus trap, Escape always closes (an emergency locks the scrim but never the keyboard), and the transcript is `aria-live="polite"`.

**Design-system gaps re-flagged:** still no danger variant on `Banner`/`Notification`, still no bottom-sheet component (ported from mvp3 again), `$orange` still has no `---500`, and the chat bubble / answer chip / typing indicator are all net-new.

**Open:** the chip-count guideline (≤5 for judgement questions) is deliberately broken by the 8-item symptom picker — that list is recognition, not a choice among alternatives, so the rule doesn't apply. Flagging it rather than quietly exempting it.

## 2026-08-04 — Side-effect triage architecture: 4-tier ladder, same-day routing, companion-symptom gate

Built `mvp4-side-effect-triage.html` — three escalation architectures over one shared clinical spine, toggleable for comparison. Symptom rows transcribed from the clinician escalation table (7 symptoms × 3 tiers). The decisions below are **product inferences pending Dr. Deeb sign-off**, and are annotated as such in the file.

- **Adopted a 4-tier ladder** (`self` / `concern` / `urgent` / `emergency`) rather than the source table's 3, because Bold has exactly four actors who can act: 911, urgent care/ED, the Bold care team, and the member. Tier keys match `mvp3-side-effect-messages.md` so the copy deck still applies. *(Modelled on the Schmitt-Thompson disposition ladder, the de facto US nurse-triage standard.)*

- **The urgent tier routes to urgent care / ED — not to a Bold callback.** The Figma had urgent reading *"care team will call to check in with you in 72 hr. You must stop your medication or search for emergency care,"* which asks the member to choose between stopping a drug and going to the ER with no clinician involved, and calls it a three-day follow-up. Bold's care team is Mon–Fri 7am–5pm PT with no real-time monitoring, so it cannot be the safety net for anything same-day. Urgent now names a destination that is actually open, and the care-team notification runs in parallel rather than instead.

- **Replaced "72 hr" with the source table's own windows: 24–48h (urgent), 12–24h (emergent).** The 72-hour figure contradicted the clinician document. This also closes the SLA placeholder flagged in `mvp3-side-effect-messages.md` (flag #5) — though the *real* commitment still needs ops confirmation.

- **One consolidated disposition; highest acuity wins.** The Figma stacked a mint "Thanks for sharing" card and a red "Call 911" card on the same screen. Telephone-triage standard is a single disposition — *"Give the caller the higher acuity disposition of the two."* Secondary symptoms move into an "Also noted" accordion.

- **Added a companion-symptom gate** — dizzy / mixed up / unusually weak / no urine today — asked whenever any GI symptom is reported **at any severity**, not only after something already escalated. Any hit upgrades to urgent. This implements the GLP-1 expert-consensus trigger literally (*"persistent vomiting with dizziness, confusion, or fatigue"* — Gorgojo-Martínez et al., *J Clin Med* 2022;12(1):145) and closes the flow's biggest safety hole: a stoic member reporting "mild nausea" was never asked whether they could still pass urine. Grounded in the older-adult under-reporting evidence — attributing a symptom to age carries OR 4.3 of not mentioning it to a doctor (Sarkisian 2003).

- **Kept the symptom list to the source table's 7.** Atypical presentations are captured as the companion follow-up rather than as new top-level rows, so nothing is added to the clinician's list without sign-off.

- **Severity uses behavioural anchors only — no 0–10 scale anywhere.** Verbal/functional anchors outperform numeric rating scales in this population, and a self-rated number is the input stoicism distorts most.

- **Corrected the medical-signal palette.** `mvp3` used Tailwind hexes (`#b91c1c`, `#dc2626`, `#f59e0b`, `#fffbeb`) that are not Bold tokens. mvp4 uses the real `@bold/web` ramp (`$red---500/300/100`, `$orange`, `$yellow`, `$green`), all four tier palettes contrast-verified 5.25:1–8.60:1.

**Design-system gaps surfaced** (worth raising upstream on `agebold/agebold-web`): `Banner` has no red/danger colour (`yellow | blue | purple` only) and `Notification` is `gold` only — so a clinical emergency treatment has no `@bold/web` component; `$orange` has no `---500` shade, so orange cannot carry accessible text; `FieldRadioButtons.icon` offers only `check|cross|heart|thumbs-down|thumbs-up`, so severity indicators are net-new; there is no bottom-sheet component.

**Open, and not a design problem:** Bold has no 24/7 clinical coverage. The flow routes safely, but a member reporting a `concern`-tier symptom on a Friday evening waits until Monday for a human. That is an operational gap to put to the clinical team, not something copy can fix. Related: `mvp3-side-effect-prescription.html` was registered in `projects.json` but missing from `index.html`; both are now listed.

## 2026-06-30 — Refreshed the Bold Care GLP-1 guideline to the current v1.0 (supersedes 2026-03-15 ingestion)

The clinical source of truth was replaced with the current **v1.0, effective 2026-06-30** guideline (CMO Dr. Sandeep Palakodeti), ingested to [[raw/2026-06-30-bold-care-glp1-weight-management-guideline]] and reconciled into [[clinical-protocol]] on 2026-07-17. Same "v1.0" label as the prior copy, but the text materially changed. Product-relevant deltas:

- **Oral GLP-1s now in the formulary** — *Wegovy HD* and *Foundayo* tablets, both Bridge-covered. This **resolves** the long-standing pill-preference conflict ([[findings]] #2, [[principles]] #4, [[value-props]] #1): the top-preferred form factor is now genuinely offered, not just injectables. Form-factor copy may lead with a daily-oral option where clinically appropriate. *(Guideline §6, §7 titration.)*
- **Coverage model made explicit — Bridge ($50/mo copay) vs. Part D (variable cost).** OSA and MASH join T2DM as Part D coverage triggers; Part D users must be told cost *before* prescribing. Reinforces [[principles]] #11 (cost is a feature). *(Guideline §2.)*
- **Per-drug missed-dose rules** (injectables: miss 1 = hold dose, miss 2 = down-titrate; Foundayo oral: don't double up, >7 days = reinitiate lower) — now a Day-0 support surface, already built into `mvp3-side-effect-prescription.html`. *(Guideline §7.)*
- **Suspected pancreatitis** added as a side-effect / escalation row (hold med, don't restart, emergent ER). Feeds the L1→L3 side-effect escalation mapping in `mvp3-side-effect-messages.md`. *(Guideline §12.)*
- **Baseline labs changed** — added CBC and TSH; "lifestyle changes ≥1 month before meds" prerequisite; Chair Stand / calf circumference moved from baseline to §8 monitoring (triggered at >5% weight loss). *(Guideline §5, §8.)*
- **Protein minimum stated as 0.5 g/kg/day** (target 1.4–1.6); the ~1.0–1.2 g/kg/day figure now reads as a de-escalation / sarcopenia threshold, not the mandatory floor. *(Guideline §8.1, §2.3, §7.)*
- **GLP-1 Visit** step names **Dosespot** (prescribing) + a **GLP-1 consent form**; Phase-1 chart is tagged GLP-1-eligible. Mirrored by the app's prescription-status surface. *(Guideline §13.)*
- **Contrave dropped** from the in-scope AOM formulary (now only an off-label-combination escalation example, §10.2). Discontinuation adds a **12-month ≥10% weight-loss target** and a **muscle-mass-loss taper** criterion. *(Guideline §14.)*

Downstream artifacts already aligned to this version at ingestion time: the GLP-1 funnel LP (`PrevMed/glp1_funnel/00-lp.html` — Foundayo®/Wegovy® tablets, $50 Bridge, Part D for T2DM/OSA, "never compounded", Bridge eligibility criteria), `mvp3-side-effect-messages.md`, and `mvp3-side-effect-prescription.html`. No conflicts surfaced beyond the pill-preference tension, which this update *closes*.

## 2026-05-26 — Adopted a Health Score module (intentional deviation from [[findings]] #7)

The Health page in `prototype-merged.html` now leads with a Whoop-style weekly Health Score module (0–100 ring, plain-English status word, 2-sentence summary, and a "Chat about this week's insight" text button that routes into the Home chat with a scripted opener). Tapping the module opens a `health-score-detail` screen with a weekly trend chart, the three body-comp drilldown chips (Muscle / Body fat / Bone density), and a "how this is measured" explainer. The trend chart lives **only** in the detail view — not on the Health page itself.

- **Why this is a deviation:** [[findings]] #7 explicitly warns against leading with a "metabolic health score" — users said in research they already get that from their PCP and don't want it duplicated. CLAUDE.md also says "Progress is not a dashboard. Not track percentages or create evaluation moments."
- **Why the team chose to ship it anyway:** the team wants a Whoop-style overall-health primary module at the top of the Health page. Older-adult adaptations applied so the deviation does as little damage as possible:
  - Status word ("Strong week") paired with the number — color is never the sole signal (a11y).
  - 2-sentence summary explains the score in plain English (muscle steady, fat down, bone normal, protein on track) — anchored to [[value-props]] #2 + #3 framing.
  - Whole module is one large 44px+ touch target.
  - Trend chart hidden behind a tap to keep the Health page reassurance-forward, not numbers-forward.
  - "Chat about this week's insight" routes the user into Home with a scripted AI opener so the score's number leads to a conversation, not a verdict.
- **What to watch:** if user research surfaces an "I feel evaluated" reaction or a drop in confidence-leaning metrics (NPS/CSAT), revisit. The score is the highest-risk module for [[findings]] #7-style feedback.
- **Where it lives in code:** module markup + CSS in `PrevMed/weight_management_app/prototype-merged.html`; detail screen `data-screen="health-score-detail"`; chat opener in `startWeeklyInsightFlow()`.

## 2026-05-21 — Weight-focused LP review decisions

Internal review of Eliza/Tzu-Yi's weight-led landing page draft (Eliza, Chris, Tzu-Yi, Miranda, Zack). Distilled into [[findings]] #33–41, [[positioning]], [[value-props]] #6, [[principles]] #15, [[open-questions]].

- **Switch the "How Bold Works" module from doctor-appointment-definition copy to appointment-length + accountability.** Current copy ("meet one-on-one to discuss your health goals") reads as the dictionary definition of a doctor's appointment, not a value prop. Lead with a specific length number + "held accountable for real change." *(2026-05-21 LP review, 00:04:07, 00:05:16, 00:06:16.)*
- **Replace "provider-created Care Plan" with personalized + practical + doable framing.** "Provider-created" is table stakes; "personalized [+ practical / doable] plan" tested better in Tzu-Yi's prior research and in the room. *(2026-05-21 LP review, 00:07:33–00:08:48.)*
- **Cut "mindful" from value-prop copy.** Reads as fluffy for what we're offering. *(2026-05-21 LP review, 00:09:53.)*
- **Replace the press-logo wall with a single high-trust logo (NYT) + member-count + app-store-style proof.** Med City News and TechCrunch are B2B and out. Exact member-count number is an open question — owners: Zack / Chris. *(2026-05-21 LP review, 00:13:40–00:15:47; [[open-questions]] "Trust-proof number.")*
- **AB-test the weight LP with design changes, not copy-only.** A copy-only variant that mirrors the control's structure risks an undetectable effect. At minimum: push nutrition/care-plan imagery above the fold OR swap the carousel module for a "weight-loss pillars" layout (Nutrition / Exercise / Habits / Older-adult strength). Lightweight alt: a standout quote from Deep on Bold's approach. *(2026-05-21 LP review, 00:17:06–00:20:39.)*
- **Tooling: use GrowthBook for the 50/50 split**, not ad-traffic routing. Cleaner test, fewer confounds. *(2026-05-21 LP review, 00:02:59.)*
- **Use "doctor" wherever the regulatory frame allows; "Dr." / "NP" prefixes on provider cards** to disambiguate years-of-experience from age. *(2026-05-21 LP review, 00:11:24–00:12:24.)*
- **Don't show a meal-kit image in the diet module** — replace with menu-reading guidance or a quick-recipe vignette ("10-minute protein-packed lunch"). Logging-food is off the table per [[findings]] #9–10. *(2026-05-21 LP review, 00:08:48–00:09:53.)*
- **Apply the same copy/element changes to onboarding, SMS, and lifecycle email.** Many users sign up without scrolling the LP, so the LP changes alone won't capture full impact. *(2026-05-21 LP review, 00:24:54.)*
- **Add "Healthy body composition / lose fat, not strength" content above the fold** of the weight LP — this is the most under-conveyed of the six winning value props in the current draft. *(2026-05-21 LP review, 00:22:03–00:24:54; [[findings]] #41.)*

## 2026-05-20 — Dovetail bullseye synthesis ingested (sharpens 2026-05-05 readout)

Two Dovetail outputs from the same 4-participant bullseye sprint (the report + the insight doc) were added to `raw/` and distilled into synthesis. They reinforce the existing 2026-05-05 readout — **no conflicts surfaced** — and add the following sharper directions, now captured in `findings.md` #25–32, `principles.md` #6 (rewritten), #13, #14, `value-props.md` #2, #6, and new questions in `open-questions.md`:

- **"Strength, not restriction" elevated to lead headline phrase** alongside "Lose fat, not strength" — 4/4 reacted positively across all concepts. Anchors copy on every surface, not just Prototype 1. *(Source: Dovetail bullseye report, insight #1; [[findings]] #25; [[principles]] #13.)*
- **"Check My Coverage" elevated to a first-class CTA, not a footer link.** 4/4 reacted; 2 said it could drive plan-switching. Should appear early and prominently, ideally as an interactive moment. Time-sensitive given July 2026 Medicare GLP-1 subsidy. *(Source: Dovetail bullseye report, insight #3; [[findings]] #26; [[principles]] #14.)*
- **Provider-in-the-loop reframed as safety AND motivational accountability.** Lead with "someone who keeps you on track," not "doctor-supervised." A nutritionist/coach role may carry the motivational load — open question on whether to require MD oversight. *(Source: Dovetail bullseye report, insights #4, #10; [[findings]] #27; [[principles]] #6 rewritten; [[value-props]] #6.)*
- **Concept 2 headline "Lose weight by going beyond the scale" rejected as too generic** (Robin direct quote). Future lab-depth copy must communicate clinical depth concretely. *(Source: Dovetail bullseye report, insight #6; [[findings]] #30.)*
- **Composite ideal program** documented as north-star spec: Prototype 1 lean-mass + "Strength, not restriction" + Prototype 2 lab depth + FDA-only GLP-1 + microdose/taper philosophy + human coach for accountability. The union, not the intersection, of what tested well. *(Source: Dovetail bullseye report, Concept Preference Summary; [[findings]] #31.)*
- **Microdosing/taper considered for elevation** from a Prototype 3 feature to a cross-concept GLP-1 entry philosophy. Logged as open question rather than a decision — only 1/4 unprompted enthusiasm, but addresses near-universal long-term-use anxiety. *(Source: Dovetail bullseye report, insight #7; [[findings]] #29; [[open-questions]] "Marketing sequencing.")*

## 2026-05-20 — Pre-GLP-1 marketing positioning adopted

- **Adopt the Clinic team's "Pre-GLP-1s" positioning doc as the interim brand voice and copy bank.** Governs the marketing site + lifecycle communications between now and the Q3 GLP-1 launch. *(Source: 2026-05-20 positioning doc; see [[positioning]] for distilled rules.)*
- **Lead with weight, position energy and pain as contributing factors** — not as competing value props. Backed by Clinic onboarding free-response data: Weight Management = 50% (486/965), Energy & Fatigue = 12%, pain-related = 6%. *(Source: 2026-05-20 positioning doc; [[findings]] #22–23.)*
- **Address three sub-audiences at once during the interim:** people on GLP-1s, people curious about GLP-1s, and people who want to lose weight without a GLP-1. After Q3 launch this collapses. *(Source: 2026-05-20 positioning doc.)*
- **Surface "78% of Bold patients pay $0 out of pocket" as a standout proof point.** Pair with any "Covered by Medicare" claim. *(Source: 2026-05-20 positioning doc, which stated 86%; figure corrected to 78% on 2026-06-26 per user — [[findings]] #21; [[principles]] #11; authoritative source `.claude/skills/bold-pricing-messaging`.)*
- **"Bold doesn't default to prescribing you another medication" / "Not a place to get GLP-1s" are PRE-GLP-1 ONLY.** Both must be retired at Q3 launch — flagged in [[positioning]] and [[open-questions]] so the rewrite doesn't get missed.
- **Adopt the six user-need → copy mappings** ("Help me lose weight without getting weaker," "Don't make me figure it out from scratch," "Don't make me log every bite," "Make the exercise feel doable for my body," "Show me progress that means something," "Tell me why the clinician matters") as the canonical job-to-be-done framing for app copy. *(Source: 2026-05-20 positioning doc; see [[positioning]] § User-need → copy bank.)*

## 2026-05-05 — Research readout decisions

- **Adopt Prototype 1 ("Lose fat. Stay strong.") as the lead concept.** Most compelling to participants; combines protein/strength, pill-first GLP-1 form factor, and body composition framing. *(Source: readout 00:21:00; readout 00:23:41.)*
- **Drop Prototype 3 (lifestyle reset / habit tracking) as a lead concept.** Least liked. Some elements (dosage adjustment) may fold into the program, but habit tracking and frequent doctor conversations are out. *(Source: readout 00:22:23.)*
- **Pull body composition tracking forward from Prototype 2 into the lead concept** — lean muscle mass + bone density specifically. Drop metabolic-health labs as a hero feature. *(Source: readout 00:21:00.)*
- **Target price: $50/month**, mirroring the Bridge program. Cost will be a primary value prop, not an afterthought. *(Source: readout 00:26:06, 00:27:23.)*
- **Provider in the loop is for safety, side effects, and dosage adjustment.** Not for frequent chat coaching or telling users things they already know. *(Source: readout 00:18:50.)*
- **Pre-decision food guidance over post-meal logging.** Use AI / menu reading / shopping list strategies to help users *before* they eat, not log after. *(Source: readout 00:33:46.)*
- **Six winning value props named** to build the program around. See [[value-props]].

### Next-step owners (from readout)

- *Clinic team:* road-mapping session to work backwards from research findings.
- *Chris Lloyd:* coordinate with fitness/content teams; analyze overlap with the Bridge program.
- *The group:* review the quickly-built Lovable prototype and leave comments/stickies.

## 2026-05-04 — Weekly product/design sync

- **Ship a GLP-1 companion / prescription product in Q3.** Top-of-funnel demand driver. *(Source: 2026-05-04 sync.)*
- **Treat GLP-1 form factor as a first-class design variable**, not a clinical detail. It overrides every other product factor in user decisions. *(Source: 2026-05-04 sync.)*
- **Plan separate, large-scale GLP-1 research** (likely a survey) to map fears/concerns across the broader audience. The bullseye sample was too small for that. *(Source: 2026-05-04 sync.)*
- **Revisit the screener** to segment older adults by prior GLP-1 experience and find the product's "sweet spot." *(Source: 2026-05-04 sync.)*

### Market context (not a decision, but load-bearing)

- **Medicare starts subsidizing GLP-1s in July 2026** — expect a significant demand spike around the Q3 launch. *(Source: 2026-05-05 readout, 00:03:15.)*

---

## How to add to this log

- Newest decisions on top.

- Date format: `YYYY-MM-DD`.
- Each entry: what was decided, one-line rationale, source file + page/timestamp.
- If a later decision overrides an earlier one, **don't delete** — strike it through and link to the new one, so the trail survives.

Related: [[findings]], [[principles]], [[value-props]], [[open-questions]]
