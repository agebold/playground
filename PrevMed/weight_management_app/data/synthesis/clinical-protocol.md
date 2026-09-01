# Clinical Protocol — Product-Relevant Distillation

The Weight Management App is a companion to the **Bold Care GLP-1 Weight Management Guideline v1.0** (Effective 2026-06-30, CMO Dr. Sandeep Palakodeti). The protocol is *medically supervised, high-touch*, 65+ specific, and integrates pharmacotherapy with Bold Fitness, nutrition, and behavioral support. This file distills the parts that constrain or inform app design. Full text: [[raw/2026-06-30-bold-care-glp1-weight-management-guideline]].

> **Reconciled to the 2026-06-30 guideline (2026-07-17).** This distillation now matches the current v1.0 source, which superseded the earlier 2026-03-15 ingestion. Substantive changes now reflected below: the formulary adds **oral GLP-1s** (Wegovy HD, Foundayo tablets — both Bridge-covered); a **Bridge ($50 copay) vs. Part D (variable cost)** coverage split; per-drug **missed-dose rules**; a **suspected-pancreatitis** side-effect/escalation row; new baseline labs (**CBC, TSH**); a protein **minimum of 0.5 g/kg/day** (target 1.4–1.6); and a **muscle-loss taper** discontinuation criterion. See the changelog at the bottom of the raw file for the full diff.

> If a UI design contradicts something in this file, surface it. The clinical protocol is the floor — the app can be warmer, simpler, or more reassuring than the protocol, but it cannot be looser than it.

---

## 1. Audience eligibility — who the app must support

The program is scoped to Medicare-age adults (**65+**; the guideline's clinical floor is 18+). Eligibility runs through **two coverage paths**, and which one a user lands in changes what they pay:

**Path A — GLP-1 Bridge (flat $50/mo copay).** Qualifies on one of:
- **Obesity:** BMI ≥35
- **Obesity:** BMI ≥30 AND a weight-related comorbidity — HFpEF, uncontrolled HTN (SBP >140 / DBP >90 despite two antihypertensives), or CKD stage 3a+
- **Overweight:** BMI ≥27 AND pre-diabetes (ADA), prior MI, prior stroke, or symptomatic PAD
- For borderline BMI 25–29.9, **WHtR >0.5** counts as an approved weight-related comorbidity for authorization

**Path B — Part D (variable cost to patient).** Medicare already covers GLP-1s for **T2DM, moderate–severe OSA, and MASH.** A patient with one of these can be prescribed via standard Part D (*not* the Bridge); **cost varies and the patient must be told the cost before prescribing.** Not eligible for either path → refer to PCP or offer lifestyle support / coaching.

Hard-exclusion patterns the app must never funnel a user into (block onboarding or reroute to PCP/specialist):
- No active PCP; **BMI <25**; T1DM; personal/family hx of MTC or MEN 2; active/recurrent pancreatitis; **chronic constipation; history of bowel obstruction**; severe gastroparesis; pregnancy / nursing / planning pregnancy <2 mo; severe renal impairment (eGFR <15) or ESRD/dialysis; recent CV event (<6 mo); recent HF hospitalization (<6 mo); active cancer treatment; active eating disorder; severe uncontrolled psychiatric illness; bariatric surgery <2 yr; active substance abuse.
- **80+ is a soft consideration, not a hard block** — clinicians weigh appropriateness carefully given limited research. The app should not auto-exclude by age, but should route 80+ users into a provider-judgment path.

**Product implication:** intake / pre-enrollment must screen for these. "BMI <25" and "no active PCP" are the two most common knockouts — address them early. The **coverage path is a product surface, not just a billing detail**: the $50 Bridge price is a headline proof point ([[principles]] #11, [[value-props]] #1), while Part D users need honest cost expectations set *before* prescribing, not after. Reinforces [[findings]] #19–20 (cost is the historical top blocker; $50 is highly compelling).

## 2. Anthropometric model — BMI **and** WHtR, not just weight

The clinical decision logic uses **two** measures together:
- WHtR >0.5 = qualifying comorbidity for BMI 25–29.9
- WHtR ≥0.6 or BMI >35 = aggressive monthly up-titration candidate
- WHtR <0.55 with BMI 25–30 = pause at intermediate maintenance tier (preserve lean mass)
- Rapid BMI/WHtR drop + sarcopenia signs (failed Chair Stand or protein <1.0 g/kg/day) = **mandatory down-titration**, overriding standard up-titration

**Product implication:** the app should never reduce success to a scale weight. **Waist measurement** and **functional tests** (Chair Stand) and **protein intake** are first-class measurements driving the clinical engine — they need first-class UI. Reinforces [[findings]] #6 (body composition over scale weight) and [[principles]] #3 (lose fat, not strength).

## 3. Mandatory non-medication interventions

Two protocol mandates the app must operationalize:
- **Protein: mandatory minimum 0.5 g/kg/day; target 1.4–1.6 g/kg/day** for sarcopenia mitigation. (The titration grid additionally treats **1.0–1.2 g/kg/day** as a de-escalation / sarcopenia threshold — tirzepatide de-escalates on inability to reach 1.2 g/kg/day; the §2.3 tie-in flags protein <1.0 g/kg/day. So the *floor* is 0.5, but the *working target* the engine pushes toward is ~1.2–1.6.)
- **Resistance training ≥2x/week via Bold Fitness.** Mandatory.

Refill release for Tirzepatide is **gated** on verification of daily protein logs and Bold Fitness tracking adherence. Refill release for Semaglutide is gated on clinician review of tolerability, BMI/WHtR velocity, and STEADI before the next escalation Rx.

**Product implication:** this conflicts with [[findings]] #9 and [[principles]] #1 ("guidance, not tracking"). The protocol *requires* daily protein logging and adherence tracking to release refills. The app must thread this needle:
- **Frame protein and strength as "what to do" (guidance), not "what you did" (tracking).** Daily targets + suggested foods/meals + simple "had it / didn't have it" interaction beats a calorie/macro logger.
- **Bold Fitness adherence can be derived passively** from class attendance, not a separate workout log.
- **The refill gate is a clinical safeguard, not a user-facing checklist.** Don't surface it as a punitive "complete X to refill" UX — surface it as the provider's review moment.

This is one of the largest design tensions in the app — call it out whenever a screen drifts toward "log everything."

## 4. Baseline data and screens that the app must accommodate

Required before initiation:
- **Lifestyle changes** in place ≥1 month before meds are prescribed
- Weight, height, waist, BMI (repeat each visit)
- HbA1c (if T2DM) within 90 days
- eGFR / creatinine (may be part of CMP) within 90 days — all GLP-1 candidates
- **Complete blood count (CBC)** within 30 days — all GLP-1 candidates
- **TSH** within 30 days — all GLP-1 candidates at least once per year, repeated if the patient loses >10% body weight
- CMP within 30 days (metformin / SGLT-2i candidates)
- Lipid panel with ratio within 12 months
- Pregnancy screen at initiation (women of childbearing potential — still applies to peri-/post-menopausal users)
- **PHQ-2** at enrollment
- **STEADI fall risk** at enrollment (mandatory for all 65+)
- Annual physical / PCP confirmation within 12 months

Labs are sourced from Zus, PCP-faxed records, or newly ordered labs — **only order what's required**, to avoid extra cost to the patient.

Functional / sarcopenia screens (**Chair Stand Test**, **calf circumference**, height:waist) are **not baseline fields** in this version — they're §8 monitoring, triggered once weight loss exceeds 5% (see §8).

**Product implication:** the intake / onboarding flow needs to either (a) collect these with care, or (b) coordinate with the PCP and labs. STEADI, PHQ-2, CBC, and TSH are not standard "fitness app" fields — they are clinical screens with senior-appropriate framing, and the app should avoid re-ordering labs the PCP already has. The Chair Stand / calf-circumference checks belong to an ongoing functional check-in, not onboarding. Reinforces [[findings]] #28 (lean mass measurement triggers "how does that work?") and [[principles]] #12 (measurement must feel light).

## 5. Medications in scope — and out

Clinicians may prescribe **branded, non-compounded** GLP-1s only. Coverage path is noted per drug (Bridge = weight-management, $50 copay; Part D = via the T2DM/OSA/MASH indication, variable cost).

**In scope — weight management (Bridge, $50 copay):**
- **Semaglutide (Wegovy)** — SC injection
- **Wegovy HD** — *oral tablet* (1.5 → 25 mg PO daily) — **new in this version**
- **Tirzepatide (Zepbound)** — SC injection (Kwikpen)
- **Foundayo** — *oral tablet* (0.8 → 17.2 mg PO daily) — **new in this version, now fully spec'd**

**In scope — T2DM indication (Part D, variable cost):**
- Semaglutide (Ozempic), Tirzepatide (Mounjaro), Liraglutide (Victoza), Dulaglutide (Trulicity)

**In scope (other AOMs):** Metformin (off-label, eGFR ≥30).

**Explicitly NOT prescribed:** Phentermine (controlled), Qsymia (controlled component), **compounded GLP-1s**. **Contrave is no longer in the in-scope AOM formulary** — it now appears only as an example of an off-label combination that requires CMO escalation (§10.2).

**Product implication:** the app can name these specific brands, including the two **oral tablets (Wegovy HD, Foundayo)** — see §6, this is a real change to the form-factor story. The "no compounded GLP-1" stance stays product-meaningful — it reinforces [[findings]] #2 (compounded vial was the most-rejected form factor) and [[principles]] #4 (never lead with compounded). Use it as a trust differentiator in copy. Do **not** reference Contrave as an offered medication anymore.

## 6. Form factors per protocol — oral tablets now available (major change)

The current formulary offers GLP-1s in **both oral and injectable** form:
- **Oral tablets (daily):** Wegovy HD, Foundayo — both weight-management, both **Bridge**-covered
- **Weekly pens:** Wegovy, Zepbound (Ozempic / Mounjaro for T2DM)
- **Auto-injector (weekly):** Trulicity · **daily pen:** Victoza

**Product implication:** this **resolves** what was the single biggest research↔protocol conflict. [[findings]] #2 puts the form-factor preference at pill > pen >> traditional injection >> compounded vial, and the winning user (Jennifer) said *"Pills easy."* The prior formulary was injection-only and couldn't meet that; **this version can**, which finally aligns the protocol with [[principles]] #4 (pill-first) and [[value-props]] #1 (pill-first, pen as backup).
1. **The pill story is now real for the GLP-1 itself** — not just adjacent meds like Metformin. Onboarding and marketing may legitimately surface a **daily oral GLP-1 option** (Wegovy HD, Foundayo), which is the top-preferred form factor.
2. **Offer form factor as a genuine choice** framed around the user's life (daily pill vs. weekly pen), not as a clinical default. Keep pen framing warm and de-stigmatized for users who prefer weekly dosing.
3. **Don't over-promise availability** — which option a user gets is a clinical decision, and oral dosing carries its own titration and cautions (dehydration/AKI/GI monitoring; see §7). Frame as "options your provider may prescribe," not a guaranteed pick.

## 7. Titration cadence — what the app must show

Every GLP-1 follows **"start low, go slow"** with monthly (or weekly for Victoza) escalation steps. Each step has a defined Week-3 telehealth check-in and refill gate.

Examples:
- Semaglutide (Wegovy): 0.25 → 0.5 → 1.0 → 1.7 → 2.4 mg weekly, each step × 4 weeks. Pause if WHtR <0.55 and weight loss optimal.
- Tirzepatide (Zepbound): 2.5 → 5.0 → 7.5 → 10.0 → 12.5 → 15.0 mg weekly, each step × 4 weeks.
- Victoza: daily, 0.6 → 1.2 → 1.8 mg, each step × 1 week.
- **Foundayo (oral, daily):** 0.8 → 2.5 → 5.5 → 9 → 14.5 → 17.2 mg, stepping up roughly every 4 weeks.

**Missed-dose rules (new, per-drug):**
- **Injectables** (Wegovy/Ozempic, Zepbound/Mounjaro, Victoza, Trulicity): miss **1** dose → keep the same dose; miss **2** → down-titrate.
- **Foundayo (oral):** never double up to catch up; if **>7 consecutive days** are missed, step down and reinitiate the escalation schedule at a lower dose.

**De-escalation is real and frequent.** Triggers: severe GI events, eGFR drop >20%, muscle wasting, inability to hit the ~1.2 g/kg/day protein target, persistent grade 2/3 GI toxicity. Action: drop one tier (or 2.5 mg increments for tirzepatide) immediately. Hold therapy 1 week if dehydration / severe vomiting.

**Product implication:**
- Dose timeline / "where am I in the journey" view should treat **monthly steps** (or weekly for Victoza, daily-titrating for Foundayo) as the unit of progress, not days.
- **De-escalation must be shown as normal, not failure.** Users will hit Week 3 check-ins where the provider lowers the dose — the UI must not frame this as "you went backwards." It is part of the protocol. Reinforces [[principles]] #6 (provider as safety net AND motivational accountability).
- The **Week 3 check-in is a recurring product moment** — design it as a known monthly ritual, not an ad-hoc message.
- **Missed-dose guidance is a Day-0 support surface**, and the rule differs by form factor (injectable vs. oral). The "Missed a dose?" flow must give the right instruction for the user's medication — already reflected in the mvp3 post-visit prototype (`mvp3-side-effect-prescription.html`).

## 8. Senior-specific safety protocols — every one is a UI surface

| Protocol mandate | App surface(s) it implies |
| --- | --- |
| Protein: min 0.5 g/kg/day, target 1.4–1.6 | Daily protein target, food suggestions, eating-out and delivery guidance |
| Resistance training ≥2x/wk via Bold Fitness | Plan to integrate with Bold Fitness class recs; 65+ accessible options |
| Lean mass monitoring at >5% weight loss (Chair Stand, calf, height:waist) | Periodic functional check-in flow |
| 6–8 glasses water/day + **hydration reminders** because elderly thirst is blunted | Scheduled hydration nudges — *one of the few cases where a nudge is clinically justified* |
| Renal function checks at 4 wk, 3 mo, 6 mo | Provider-coordinated lab cadence in the timeline |
| Severe GI symptoms (vomit >2x/day) → HOLD dose + contact provider in 24h | Symptom check-in with explicit escalation path |
| STEADI fall risk at every follow-up | Periodic fall-risk check, framed warmly |
| Antihypertensive adjustment as weight drops | Provider-facing alert; possibly a "talk to your PCP" prompt for the user |
| GI management (small frequent meals, avoid high-fat, ondansetron PRN) | Side-effect coaching content |

**Product implication:** these are the legitimate "guidance, not tracking" moments — they all push *what to do next* into the user's day, which matches [[principles]] #2 (help before the decision). Use this list as the spine of the daily / weekly UX.

## 9. Concurrent medication coordination

Initiating a GLP-1 may require changes to:
- **Sulfonylureas:** ↓ dose 50% (hypoglycemia + falls)
- **Insulin (basal/bolus):** ↓ basal 10–20%
- **SGLT-2i:** continue, monitor volume
- **Metformin:** continue, no change
- **Antihypertensives:** monitor BP, ↓ if hypotension
- **Oral contraceptives:** non-oral or backup × 4 weeks after initiation **and after each dose escalation** (delayed gastric emptying reduces OC absorption). Counseling must be documented.

**Product implication:** med list is a real clinical signal, not a vanity field. If the user reports SU/insulin/HTN meds, the app should make sure they're routed to the right kind of provider check-in. The OC counseling rule is a documentation requirement — likely a provider-facing artifact, but a user-facing "FYI / what to do" surface for users of reproductive age is worth flagging despite the 65+ skew (peri-menopause edge cases).

## 10. Side-effect realism — frequency the app must normalize

| Side effect | Frequency |
| --- | --- |
| Nausea | Very common (30–50%) |
| Vomiting | Common (10–20%) |
| Diarrhea | Common (10–20%) |
| Constipation | Common (10–20%) |
| Gallbladder symptoms | Increased risk |
| Hypoglycemia | Rare unless on SU/insulin |
| **Suspected pancreatitis** | Rare — but a hard-stop red flag: hold med, do not restart, serum lipase/amylase + CT/US, emergent ER referral |

**Product implication:** [[findings]] #3 says cost and side effects are the two top user fears. The protocol confirms ~1-in-3 to 1-in-2 will have nausea. Don't undersell this in onboarding or marketing — but pair the frequency with the protocol's coaching menu (small frequent meals, ginger tea, ondansetron PRN, slower titration, dose reduction before discontinuation) so it reads as *managed* not *terrifying*. **Suspected pancreatitis is the one symptom the app must never soft-pedal** — it maps to a hold-medication, get-seen-now escalation (see the L1→L3 side-effect mapping in `mvp3-side-effect-messages.md`, which routes severe stomach pain to an urgent/emergency tier). Side-effect support content should be ready on Day 0, not Week 3.

## 11. Follow-up cadence — the spine of the engagement model

| Phase | Touchpoint | Duration |
| --- | --- | --- |
| Pre-enrollment (Phase 1) | Care Coordinator — intake forms, eligibility, **chart tagged GLP-1-eligible (Bridge or in general)** | — |
| Initial visit (Phase 2) | MD/NP comprehensive — intake review, goal setting, lifestyle care plan, order labs | 45–60 min |
| Check-in (Phase 3) | CC/MA call after visit & 1 week — care plan, labs, baseline measurements, goals | — |
| GLP-1 Visit (may combine with initial) | MD/NP — AOM education, GLP-1 screening, **prescribe via Dosespot**, **GLP-1 consent form**, PCP notification | — |
| Dietitian visit / Group session | RD consultation — nutrition plan, macros, supplements | 30–45 min |
| 2–4 weeks | MD/NP follow-up — tolerability, side effects, early trend, Bold Fitness engagement | 20–30 min |
| 8 weeks | MD/NP follow-up — weight progress, functional assessment, titration decision | 20–30 min |
| 3 months | MD/NP + RD | 20–30 min each |
| 6 months | Comprehensive — full reassessment, sarcopenia + falls screen, thyroid symptom monitoring | 30–45 min |
| Ongoing (stable) | Every 4–8 wk → q3 mo | — |

Plus the **per-dose-cycle Week 3 check-in** described in §7.

**Product implication:** the timeline view should make this cadence legible — the user always knows the next provider touchpoint and what it's for. Reinforces [[findings]] #5 / [[principles]] #6 — users want provider oversight, but only for medication safety and motivational accountability, not chatty messaging. The **GLP-1 Visit** is where the prescription actually happens (via **Dosespot**) and where the user signs a **GLP-1 consent form** — the app's prescription-status surface (prescribed → consent/sign → signed → sent to pharmacy) should mirror this, per the mvp3 post-visit brief.

## 12. Discontinuation reality

Six protocol reasons the user might come off the medication:
1. **Inadequate response** — <5% weight loss at 6 mo despite adherence; at **12 mo the target is ≥10% total body weight loss** — if not met, consider switch / combination / bariatric referral
2. Intolerable side effects despite dose reduction
3. Non-adherence (>50% missed doses over 3 mo)
4. New contraindication (acute pancreatitis, MTC, pregnancy)
5. Patient request — with taper discussion and **counsel on rapid weight regain risk**
6. **Losing too much muscle** — WHtR still >0.5 while losing >10% body weight → taper discussion + rapid-regain counsel (a sarcopenia guardrail, new in this version)

**Product implication:** the app must handle "I want to stop" as a first-class flow, not an edge case. Route to a provider conversation; surface rapid-regain risk honestly without judgment; offer non-medication continuation (Bold Fitness, nutrition, monitoring). Reason #6 reinforces the whole "lose fat, not strength" thesis — the app's body-composition and functional tracking (§2) is exactly what surfaces this signal. Connects to the long-term-use anxiety from [[findings]] #29 (microdosing/taper as entry philosophy).

## 13. Provider escalation chain

NP/PA → Collaborating MD → Medical Director → CMO → External Specialist.

Mid-level → MD within **24 hours** when:
- eGFR drops >20% or creatinine rises >30%
- Persistent grade 2+ GI events after 1-step down-titration
- Complex diabetes (intensive multi-dose insulin, hypoglycemia <70)
- Weight plateau / zero loss over 12 weeks despite adherence

**Product implication:** the app needs to know which role is currently "owning" a user's case, and the user should see consistent attribution ("your NP, Maria"; "your MD, Dr. X") with handoffs visible when they occur. Reinforces [[principles]] #6 — credentials matter less than the *outcome* ("someone who keeps you on track"), but disambiguating Dr. / NP carries trust per [[findings]] #39.

## 14. PCP coordination is a structural part of the program

Within **48 hours** of any initiation or substantial modification, Bold sends the PCP a secure-fax / EHR notification that includes: action type, medication and dosing, baseline BMI / WHtR / A1c / eGFR, STEADI score, and three coordination requests (BP monitoring, hypoglycemia mitigation, lab sharing).

**Product implication:** "your PCP gets a note" is a trust artifact — surface it to the user as proof of safety (we are *coordinating with your doctor*, not going around them). For PCPs who use the EHR routing, the integration is its own product surface (out of scope for the app, but worth noting in [[open-questions]]).

---

## Tensions with prior research worth tracking

1. **Tracking vs. refill gate.** Protocol requires daily protein logs and Bold Fitness adherence for tirzepatide refills, but users explicitly reject manual logging ([[findings]] #9, [[principles]] #1). Resolution: frame as *guidance + simple confirm*, not logging; let attendance data flow passively from Bold Fitness.
2. **Pill preference — now met.** *(Resolved by the 2026-06-30 guideline.)* The prior formulary was injection-only, which conflicted with users' first-preference for pills ([[findings]] #2). The current guideline adds **oral GLP-1 tablets (Wegovy HD, Foundayo), both Bridge-covered** — so the top-preferred form factor is genuinely available, and the protocol now agrees with [[principles]] #4 and [[value-props]] #1. Lead form-factor copy with the daily-oral option where clinically appropriate (see §6); no longer a standing gap.
3. **"% body weight loss" headline.** Protocol uses 5% at 6 months (and ≥10% at 12 months) as clinical response thresholds; research says don't lead with % body weight loss ([[findings]] #18, [[principles]] #3). Resolution: these are internal clinical gates, not user-facing headlines. Don't show them as a goal in the UI.
4. **Side-effect honesty vs. enthusiasm.** Nausea is 30–50%. The marketing impulse to downplay this collides with the user's already-existing fear ([[findings]] #3). Resolution: surface the frequency *with the management plan* attached, so it reads as managed rather than dismissed.

---

Related: [[findings]], [[principles]], [[decisions]], [[open-questions]], [[value-props]]
Source: [[raw/2026-06-30-bold-care-glp1-weight-management-guideline]]
