# Clinical Protocol — Product-Relevant Distillation

The Weight Management App is a companion to the **Bold Care GLP-1 Weight Management Guideline v1.0** (Effective 2026-03-15, CMO Dr. Sandeep Palakodeti). The protocol is *medically supervised, high-touch*, 65+ specific, and integrates pharmacotherapy with Bold Fitness, nutrition, and behavioral support. This file distills the parts that constrain or inform app design. Full text: [[raw/2026-03-15-bold-care-glp1-weight-management-guideline]].

> If a UI design contradicts something in this file, surface it. The clinical protocol is the floor — the app can be warmer, simpler, or more reassuring than the protocol, but it cannot be looser than it.

---

## 1. Audience eligibility — who the app must support

The product is scoped to adults **65+** who meet at least one of:
- **Obesity:** BMI ≥30
- **Overweight:** BMI 25–29.9 with at least one weight-related comorbidity (T2DM, CVD, HTN, dyslipidemia, OSA, MASLD, OA, or **WHtR >0.5** as central-adiposity proxy)
- **T2DM second-line:** A1c ≥7.0% after metformin + lifestyle

Hard-exclusion patterns the app must never funnel a user into (block onboarding or reroute to PCP/specialist):
- No active PCP; T1DM; personal/family hx of MTC or MEN 2; active/recurrent pancreatitis; pregnancy / nursing / planning pregnancy <2 mo; severe renal impairment (eGFR <15) or ESRD/dialysis; active cancer treatment; active eating disorder; recent CV event (<6 mo); severe gastroparesis; recent HF hospitalization (<6 mo); severe uncontrolled psychiatric illness; bariatric surgery <2 yr; active substance abuse (incl. heavy alcohol >7 drinks/wk).

**Product implication:** intake / pre-enrollment flow must screen for these. The "BMI <25" floor and "no active PCP" gate are the two most common knockouts and should be addressed early in the flow.

## 2. Anthropometric model — BMI **and** WHtR, not just weight

The clinical decision logic uses **two** measures together:
- WHtR >0.5 = qualifying comorbidity for BMI 25–29.9
- WHtR ≥0.6 or BMI >35 = aggressive monthly up-titration candidate
- WHtR <0.55 with BMI 25–30 = pause at intermediate maintenance tier (preserve lean mass)
- Rapid BMI/WHtR drop + sarcopenia signs (failed Chair Stand or protein <1.0 g/kg/day) = **mandatory down-titration**, overriding standard up-titration

**Product implication:** the app should never reduce success to a scale weight. **Waist measurement** and **functional tests** (Chair Stand) and **protein intake** are first-class measurements driving the clinical engine — they need first-class UI. Reinforces [[findings]] #6 (body composition over scale weight) and [[principles]] #3 (lose fat, not strength).

## 3. Mandatory non-medication interventions

Two protocol mandates the app must operationalize:
- **Protein ≥1.2 g/kg/day** (target 1.4–1.6 g/kg/day). Mandatory for sarcopenia mitigation.
- **Resistance training ≥2x/week via Bold Fitness.** Mandatory.

Refill release for Tirzepatide is **gated** on verification of daily protein logs and Bold Fitness tracking adherence. Refill release for Semaglutide is gated on clinician review of tolerability, BMI/WHtR velocity, and STEADI before the next escalation Rx.

**Product implication:** this conflicts with [[findings]] #9 and [[principles]] #1 ("guidance, not tracking"). The protocol *requires* daily protein logging and adherence tracking to release refills. The app must thread this needle:
- **Frame protein and strength as "what to do" (guidance), not "what you did" (tracking).** Daily targets + suggested foods/meals + simple "had it / didn't have it" interaction beats a calorie/macro logger.
- **Bold Fitness adherence can be derived passively** from class attendance, not a separate workout log.
- **The refill gate is a clinical safeguard, not a user-facing checklist.** Don't surface it as a punitive "complete X to refill" UX — surface it as the provider's review moment.

This is one of the largest design tensions in the app — call it out whenever a screen drifts toward "log everything."

## 4. Baseline data and screens that the app must accommodate

Required before initiation:
- Weight, height, waist, BMI (repeat each visit)
- HbA1c (if T2DM) within 90 days
- eGFR / creatinine within 90 days
- CMP within 30 days (if metformin/SGLT-2i)
- Lipid panel within 12 months
- Pregnancy screen at initiation (women of childbearing potential — still applies to peri-/post-menopausal users)
- **PHQ-2** at enrollment
- **STEADI fall risk** at enrollment (mandatory for 65+)
- Annual physical / PCP confirmation within 12 months
- **Sit-to-Stand Test** (functional)
- **Calf circumference** (sarcopenia proxy)

**Product implication:** the intake / onboarding flow needs to either (a) collect these directly with care, or (b) coordinate with the PCP and labs. STEADI, PHQ-2, sit-to-stand, and calf circumference are not standard "fitness app" fields — they are clinical screens with senior-appropriate framing. Reinforces [[findings]] #28 (lean mass measurement triggers "how does that work?") and [[principles]] #12 (measurement must feel light).

## 5. Medications in scope — and out

**In scope (GLP-1 RAs):**
- Semaglutide (Wegovy for weight, Ozempic for T2DM)
- Tirzepatide (Zepbound for weight, Mounjaro for T2DM)
- Liraglutide (Victoza) — T2DM
- Dulaglutide (Trulicity) — T2DM
- (Foundayo) — listed but spec'd as blank in source

**In scope (other AOMs):** Metformin (off-label), Contrave.

**Explicitly NOT prescribed:** Phentermine (controlled), Qsymia (controlled component), **compounded GLP-1s**.

**Product implication:** the app can mention these specific brands. The "no compounded GLP-1" stance is product-meaningful — it reinforces [[findings]] #2 (compounded vial was the most-rejected form factor) and [[principles]] #4 (never lead with compounded). Use it as a trust differentiator in copy.

## 6. Form factors per protocol — all in-scope GLP-1s are SC injection

Per the protocol, **every approved GLP-1 RA is a subcutaneous injection** — pen (Wegovy/Zepbound/Ozempic/Mounjaro), auto-injector (Trulicity), or daily pen (Victoza). There is no oral GLP-1 in the formulary.

**Product implication:** this is a direct conflict with [[findings]] #2, where the form-factor preference hierarchy is pill > pen >> traditional injection >> compounded vial, and the winning user (Jennifer) explicitly said *"Pills easy."* Three implications:
1. **Don't promise a pill GLP-1 the protocol doesn't offer.** Avoid hero imagery / copy that implies a daily oral option for the GLP-1 itself.
2. **Lean into pen + auto-injector framing**, which is the second-preferred form factor and is what's actually available.
3. **Metformin and Contrave are oral** — they can carry the pill story for users who need it, especially in the "before GLP-1" or "alongside GLP-1" frame.
4. **Flag this gap to the user / team.** If pill GLP-1 is a strategic ask, it belongs in [[open-questions]] — currently the protocol can't deliver it.

## 7. Titration cadence — what the app must show

Every GLP-1 follows **"start low, go slow"** with monthly (or weekly for Victoza) escalation steps. Each step has a defined Week-3 telehealth check-in and refill gate.

Examples:
- Semaglutide (Wegovy): 0.25 → 0.5 → 1.0 → 1.7 → 2.4 mg weekly, each step × 4 weeks. Pause if WHtR <0.55 and weight loss optimal.
- Tirzepatide (Zepbound): 2.5 → 5.0 → 7.5 → 10.0 → 12.5 → 15.0 mg weekly, each step × 4 weeks.
- Victoza: daily, 0.6 → 1.2 → 1.8 mg, each step × 1 week.

**De-escalation is real and frequent.** Triggers: severe GI events, eGFR drop >20%, muscle wasting, inability to hit 1.2 g/kg/day protein, persistent grade 2/3 GI toxicity. Action: drop one tier (or 2.5 mg increments for tirzepatide) immediately. Hold therapy 1 week if dehydration / severe vomiting.

**Product implication:**
- Dose timeline / "where am I in the journey" view should treat **monthly steps** (or weekly for Victoza) as the unit of progress, not days.
- **De-escalation must be shown as normal, not failure.** Users will hit Week 3 check-ins where the provider lowers the dose — the UI must not frame this as "you went backwards." It is part of the protocol. Reinforces [[principles]] #6 (provider as safety net AND motivational accountability).
- The **Week 3 check-in is a recurring product moment** — design it as a known monthly ritual, not an ad-hoc message.

## 8. Senior-specific safety protocols — every one is a UI surface

| Protocol mandate | App surface(s) it implies |
| --- | --- |
| Protein ≥1.2 g/kg/day | Daily protein target, food suggestions, eating-out and delivery guidance |
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

**Product implication:** [[findings]] #3 says cost and side effects are the two top user fears. The protocol confirms ~1-in-3 to 1-in-2 will have nausea. Don't undersell this in onboarding or marketing — but pair the frequency with the protocol's coaching menu (small frequent meals, ginger tea, ondansetron PRN, slower titration, dose reduction before discontinuation) so it reads as *managed* not *terrifying*. Side-effect support content should be ready on Day 0, not Week 3.

## 11. Follow-up cadence — the spine of the engagement model

| Phase | Touchpoint | Duration |
| --- | --- | --- |
| Pre-enrollment | Intake forms | — |
| Initial visit (Phase 2) | MD/NP comprehensive | 45–60 min |
| RD visit (Phase 3) | Dietitian consultation | 30–45 min |
| Week 2–4 | MD/NP follow-up | 20–30 min |
| Week 8 | MD/NP follow-up | 20–30 min |
| 3 months | MD/NP + RD | 20–30 min each |
| 6 months | Comprehensive | 30–45 min |
| Ongoing (stable) | Every 4–8 wk → q3 mo | — |

Plus the **per-dose-cycle Week 3 check-in** described in §7.

**Product implication:** the timeline view should make this cadence legible — the user always knows the next provider touchpoint and what it's for. Reinforces [[findings]] #5 / [[principles]] #6 — users want provider oversight, but only for medication safety and motivational accountability, not chatty messaging.

## 12. Discontinuation reality

Five protocol reasons the user might come off the medication:
1. Inadequate response (<5% weight loss at 6 mo)
2. Intolerable side effects despite dose reduction
3. Non-adherence (>50% missed doses over 3 mo)
4. New contraindication (acute pancreatitis, MTC, pregnancy)
5. Patient request — with taper discussion and **counsel on rapid weight regain risk**

**Product implication:** the app must handle "I want to stop" as a first-class flow, not an edge case. Route to a provider conversation; surface rapid-regain risk honestly without judgment; offer non-medication continuation (Bold Fitness, nutrition, monitoring). This connects to the long-term-use anxiety from [[findings]] #29 (microdosing/taper as entry philosophy).

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
2. **Pill preference vs. injectable-only formulary.** Protocol has no oral GLP-1. Users' first preference is pills ([[findings]] #2). Resolution: lead with pen/auto-injector framing for GLP-1, let Metformin/Contrave carry the pill story for adjacent users, and surface this gap in [[open-questions]].
3. **"% body weight loss" headline.** Protocol uses 5% at 6 months as a discontinuation threshold; research says don't lead with % body weight loss ([[findings]] #18, [[principles]] #3). Resolution: the 5% is an internal clinical gate, not a user-facing headline. Don't show it as a goal in the UI.
4. **Side-effect honesty vs. enthusiasm.** Nausea is 30–50%. The marketing impulse to downplay this collides with the user's already-existing fear ([[findings]] #3). Resolution: surface the frequency *with the management plan* attached, so it reads as managed rather than dismissed.

---

Related: [[findings]], [[principles]], [[decisions]], [[open-questions]], [[value-props]]
Source: [[raw/2026-03-15-bold-care-glp1-weight-management-guideline]]
