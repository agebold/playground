# Onboarding Eligibility Copy Audit — Guideline vs. In‑App Language

**Product:** GLP‑1 Weight Management onboarding (`PrevMed/glp1_funnel/`)
**Audience:** 65+, Medicare‑eligible
**Source of truth (clinical):** Bold Care GLP‑1 Weight Management Guideline v1.0 (eff. 2026‑06‑30), distilled in [`clinical-protocol.md`](../weight_management_app/data/synthesis/clinical-protocol.md)
**Screens audited:** [05‑screening](05-screening.html) · [06‑conditions](06-conditions.html) · [09‑history](09-history.html)
**Date:** 2026‑07‑23

---

## 1. Why we're building this document

The onboarding eligibility questions are the **highest‑stakes copy in the entire funnel**. A patient answers them alone, with no clinician in the room — so the *wording itself* carries the whole burden of getting the right answer. Two things can go wrong, and they pull in opposite directions:

- **Too clinical (over‑describe).** If a checkbox reads like it was lifted from the guideline (jargon, acronyms, staging), a 65+ patient can't recognize their own condition in it. They tick "None of the above," and a real exclusion or a real qualifier gets missed.
- **Too loose (under‑describe).** If we simplify past the clinical meaning — dropping a qualifier like "uncontrolled," "moderate‑to‑severe," or "active" — the checkbox captures people the guideline never meant to capture. The wrong people get flagged, excluded, or routed to the wrong coverage path.

The governing rule comes straight from the clinical protocol:

> *"The app can be warmer, simpler, or more reassuring than the protocol, but it **cannot be looser than it**."* — [`clinical-protocol.md`](../weight_management_app/data/synthesis/clinical-protocol.md) §Preamble

So every eligibility line has to clear **two bars at once**: plain enough for a senior to self‑identify (recognition over recall, ~8th‑grade reading level, per CLAUDE.md senior‑UX rules), **and** clinically tight enough that it means exactly what the guideline means. This document puts the **official term and the in‑app term side by side** so we can check both bars in one pass, and see at a glance where we over‑describe, under‑describe, or match.

Eligibility answers also drive **coverage routing** — the $50/mo Bridge path vs. the variable‑cost Part D path vs. hard exclusion ([`clinical-protocol.md`](../weight_management_app/data/synthesis/clinical-protocol.md) §1). A loose answer doesn't just mislabel a symptom; it can put a patient on the wrong price. That raises the stakes on the wording beyond ordinary copy review.

---

## 2. How to read this doc

Each row compares one **official guideline term** to the **exact copy shipped in the app** (verbatim from the HTML, not paraphrased), and scores it on two axes:

| Column | What it means |
| --- | --- |
| **Patient‑facing?** | Can a 65+ patient recognize their own situation in this wording? `Yes` / `Partial` / `No` |
| **Verdict** | Relationship to the guideline meaning: `Match` · `Over‑describe` (more clinical detail than needed) · `Under‑describe` (looser/broader than the clinical criterion) · `Missing` (guideline item not asked) |

`Match+` = a model translation worth reusing elsewhere. **Under‑describe is the dangerous direction** — it's where we become "looser than the protocol."

---

## 3. The six onboarding questions at a glance

| # | Screen | Prompt | Purpose |
| --- | --- | --- | --- |
| Q1 | [05‑screening](05-screening.html) | "Do any of the following apply to you?" | Hard exclusions |
| Q2 | [06‑conditions](06-conditions.html) | "Have you been diagnosed with any of these conditions?" | Hard exclusions **+** Part D routers (mixed — see §7) |
| Q3 | [07‑measurements](07-measurements.html) | "What's your height and weight?" | Computes BMI (⚠️ no waist → no WHtR) |
| Q4 | [08‑medications](08-medications.html) | "Where are you with weight‑loss medicines…?" | Medication history |
| Q5 | [09‑history](09-history.html) | "Do any of the following apply to you?" | Qualifying comorbidities |
| Q6 | [10‑discuss](10-discuss.html) | "What's the one thing you most want to discuss…?" | Open‑ended intent |

The eligibility logic lives in **Q1, Q2, Q3, and Q5**. This audit focuses on the checkbox copy in Q1/Q2/Q5 and the measurements gap in Q3.

---

## 4. Side‑by‑side: Section 1 — Disqualifying symptoms & exclusion criteria

| Official guideline term | In‑app copy (verbatim) | Screen | Patient‑facing? | Verdict |
| --- | --- | --- | --- | --- |
| BMI under 25 | *(not a checkbox — computed from height/weight)* | Q3 | n/a | **Computed** |
| Unintentional weight loss >5% of body weight over last 6 months | "Unintentional weight loss of more than 5% in the last 6 months" | Q1 | Yes | **Match** — minor: drops "of body weight" (5% of *what?*) |
| Active eating disorder (anorexia, bulimia, binge eating) now or within 2 yrs | "An eating disorder (now or in the last 2 years)" | Q1 | Yes | **Match** — drops examples; consider re‑adding for recognition |
| Severe gastroparesis | "Severe stomach problems that slow digestion (gastroparesis)" | Q2 | Yes | **Match+** — model translation (plain gloss + term in parens) |
| Chronic constipation | "Chronic constipation" | Q2 | Yes | **Match** |
| History of bowel obstruction | "History of bowel obstruction" | Q2 | Partial | **Match** term, but "bowel obstruction" is clinical — add plain gloss ("a blockage in your intestines") |
| Type 1 diabetes mellitus | "Type 1 diabetes" | Q2 | Yes | **Match** — good (drops "mellitus") |
| **Active or recurrent** pancreatitis | "Pancreatitis" | Q2 | **No** | **Under‑describe + jargon** — drops "active or recurrent"; no plain gloss. Over‑captures a single resolved episode |
| Personal/family history of MTC | "Medullary thyroid cancer MTC or MEN 2 (yourself or family history)" | Q2 | Partial/No | **Match** coverage, heavy jargon + rough punctuation |
| Personal/family history of MEN 2 syndrome | *(combined in the line above)* | Q2 | Partial/No | **Match** coverage |
| Severe renal impairment (eGFR <15) / stage 4–5 CKD / ESRD / dialysis | "Stage 4 or 5 kidney disease or currently on dialysis" | Q1 | Partial | **Match** — good (drops eGFR); relies on patient knowing their CKD stage |
| Recent **cardiovascular event** within 6 months | "A heart attack or stroke in the last 6 months" | Q2 | Yes | **Match+** — concrete. Minor: "CV event" is slightly broader than heart attack/stroke |
| Recent hospital stay for heart failure within 6 months | "A hospital stay for heart failure in the last 6 months" | Q2 | Yes | **Match** |
| **Uncontrolled heart failure** (general state) | *(only the 6‑month HF‑hospitalization proxy exists)* | Q2 | — | **Partial gap** — chronically uncontrolled HF without a recent admit isn't captured |
| Severe/uncontrolled psychiatric illness **or** untreated mental health (depression, anxiety, bipolar) | "Untreated mental health condition (depression, anxiety, bipolar etc)" | Q1 | Yes | **Match** — narrows to "untreated"; a *treated‑but‑severe* case wouldn't self‑select |
| Current challenges with alcohol / active substance abuse | "Challenges with alcohol or drug use" | Q1 | Yes | **Match+** — de‑stigmatized ("challenges with" not "abuse"); model translation |
| Pregnancy / nursing / planning pregnancy <2 mo | *(not asked)* | — | — | **Missing** — likely intentional for 65+; confirm (protocol still lists peri‑menopause edge cases) |
| Bariatric surgery within 1–2 years | "Weight‑loss surgery in the last 2 years" | Q1 | Yes | **Match+** — plain ("weight‑loss surgery" not "bariatric"); picks the conservative 2‑yr bound |
| Ongoing active cancer treatment (unless oncologist‑cleared) | "Ongoing cancer treatment" | Q1 | Yes | **Match** — drops the provider‑side clearance nuance (fine for self‑screen) |
| No active PCP | *(not asked in these questions)* | — | — | **Missing** here — confirm captured elsewhere (protocol calls this a top‑2 knockout) |

---

## 5. Side‑by‑side: Section 2 — Approved comorbidities (qualify for Bridge)

These pair with a BMI band to qualify a patient. They live in **Q5**; BMI/WHtR come from **Q3**.

| Official guideline term | In‑app copy (verbatim) | Screen | Patient‑facing? | Verdict |
| --- | --- | --- | --- | --- |
| BMI ≥35 (no comorbidity needed) | *(computed from height/weight)* | Q3 | n/a | **Computed** |
| BMI ≥30 + Heart failure with **preserved ejection fraction (HFpEF)** | "Heart failure with normal pumping strength but stiffness" | Q5 | **No** | **Confusing** — a patient won't map their diagnosis onto this phrase. Add the clinical name they've heard |
| BMI ≥30 + **Uncontrolled** hypertension (>140/90 **despite two** BP meds) | "High blood pressure (hypertension)" | Q5 | Yes (as written) | **Under‑describe (MAJOR)** — drops "uncontrolled," ">140/90," and "despite two meds." Over‑captures anyone with any/controlled HTN |
| BMI ≥30 + CKD stage 3a or above | "Chronic moderate to severe kidney disease (stage 3a or above)" | Q5 | Partial | **Match** — decent plain gloss; still relies on knowing the CKD stage |
| BMI ≥27 + Pre‑diabetes | "Prediabetes" | Q5 | Yes | **Match** |
| BMI ≥27 + Previous myocardial infarction | "Previous heart attack" | Q5 | Yes | **Match+** — MI → heart attack |
| BMI ≥27 + Previous stroke | "Previous stroke" | Q5 | Yes | **Match** |
| BMI ≥27 + **Symptomatic** peripheral artery disease | "Peripheral artery disease that causes leg pain or cramping when you walk" | Q5 | Yes | **Match+** — "symptomatic" made concrete; model translation |
| BMI 25–29.9 + **WHtR >0.5** | *(waist circumference not collected)* | Q3 | — | **Missing** — see §6 |

---

## 6. Side‑by‑side: Section 3 — Bridge disqualifiers (route to Part D, not Bridge)

Per the guideline these are **not hard exclusions** — a patient with one of them is prescribed via **Part D (variable cost)** instead of the $50 Bridge, and *cost must be disclosed before prescribing* ([`clinical-protocol.md`](../weight_management_app/data/synthesis/clinical-protocol.md) §1, Path B).

| Official guideline term | In‑app copy (verbatim) | Screen | Patient‑facing? | Verdict |
| --- | --- | --- | --- | --- |
| Type 2 diabetes | "Type 2 diabetes" | Q2 | Yes | **Match** — but framed as an exclusion, not a router (see §7) |
| **Moderate‑to‑severe** sleep apnea | "Sleep apnea" | Q2 | Yes (as written) | **Under‑describe** — drops "moderate‑to‑severe"; over‑captures mild OSA |
| Fatty liver disease documented as **MASH** | "Fatty liver disease" | Q2 | Yes (as written) | **Under‑describe** — drops "MASH/documented"; over‑captures simple fatty liver |

---

## 7. Cross‑cutting findings (ranked)

### 🔴 Priority 1 — "Looser than the protocol" (fix first)
These violate the one hard rule. Each captures more people than the guideline intends:

1. **Hypertension (Q5).** "High blood pressure (hypertension)" → the guideline requires **uncontrolled** HTN, **>140/90 despite two BP meds**. As written, every controlled hypertensive self‑qualifies.
2. **Sleep apnea (Q2).** "Sleep apnea" → guideline says **moderate‑to‑severe**. Mild OSA shouldn't trigger the Part D route.
3. **Fatty liver (Q2).** "Fatty liver disease" → guideline says **MASH** specifically (the advanced, documented form), not common simple steatosis.
4. **Pancreatitis (Q2).** "Pancreatitis" → guideline says **active or recurrent**. A single resolved episode years ago shouldn't hard‑exclude.

### 🟠 Priority 2 — Recognition failures (jargon a senior can't self‑ID)
5. **HFpEF (Q5).** "Heart failure with normal pumping strength but stiffness" — patients know this as *diastolic heart failure* or *HFpEF*; the current phrase won't be recognized.
6. **Bowel obstruction (Q2)** — add a plain gloss.
7. **MTC / MEN 2 (Q2)** — clean up punctuation ("cancer MTC" reads as a typo); keep the terms (no good lay synonym).

### 🟡 Priority 3 — Coverage gaps (guideline item not captured)
8. **WHtR / waist (Q3).** Only height and weight are collected — **no waist field**, so waist‑to‑height ratio can't be computed. The entire **BMI 25–29.9 + WHtR >0.5** qualification path is currently unreachable ([`clinical-protocol.md`](../weight_management_app/data/synthesis/clinical-protocol.md) §2 calls waist a first‑class measurement).
9. **No active PCP** — a top‑2 knockout in the protocol, not in these questions. Confirm it's asked elsewhere.
10. **Pregnancy exclusion** — not asked (probably intentional for 65+; confirm the decision).
11. **Chronically uncontrolled heart failure** — only the recent‑hospitalization proxy is captured.

---

## 8. ⚠️ The pasted list ≠ what's actually shipped

The "in‑app" list provided for this review is **looser in the shipped HTML** than the pasted version, in exactly the two most sensitive spots:

| Provided as "in‑app" | Actually shipped | File |
| --- | --- | --- |
| "Uncontrolled hypertension (over 140/90 despite medication)" | **"High blood pressure (hypertension)"** | [09-history.html:49](09-history.html#L49) |
| "Moderate‑to‑severe sleep apnea" | **"Sleep apnea"** | [06-conditions.html:54](06-conditions.html#L54) |

So the two Priority‑1 looseness bugs are also **regressions from the intended copy** — the correct, tighter wording seems to have existed and been dropped. Worth confirming which version is canonical before re‑writing.

---

## 9. Structural note — exclusions and Part D routers are mixed

Q2 ("Have you been diagnosed with any of these conditions?") mixes two clinically different buckets under one prompt:

- **Hard exclusions** — T1D, pancreatitis, MTC/MEN 2, gastroparesis, constipation, bowel obstruction, recent CV event, recent HF admit.
- **Part D routers** — T2D, sleep apnea, fatty liver (MASH). These *don't* exclude; they change the coverage path and require a cost conversation before prescribing.

From a single "checked / unchecked" answer, downstream logic can't tell "block this patient" from "route to Part D and disclose cost." This isn't a wording bug — it's a **routing‑clarity** issue — but it belongs on the same review because the same checkbox drives both outcomes.

---

## 10. Suggested copy fixes (starting point — not final)

| Item | Current | Suggested (tighter **and** plainer) |
| --- | --- | --- |
| Hypertension | "High blood pressure (hypertension)" | "High blood pressure that stays above 140/90 even while taking two or more blood‑pressure medicines" |
| Sleep apnea | "Sleep apnea" | "Moderate or severe sleep apnea" |
| Fatty liver | "Fatty liver disease" | "Fatty liver disease your doctor has called MASH (or NASH)" |
| Pancreatitis | "Pancreatitis" | "Ongoing or repeated pancreatitis (swelling of the pancreas)" |
| HFpEF | "Heart failure with normal pumping strength but stiffness" | "Heart failure where the heart pumps normally but is stiff — your doctor may call it HFpEF or diastolic heart failure" |
| Bowel obstruction | "History of bowel obstruction" | "A past bowel obstruction (a blockage in your intestines)" |

All fixes should be re‑checked against the design‑system component copy limits and the [`senior-onboarding-design`] plain‑language rules before shipping.

---

*Sources: onboarding screens in `PrevMed/glp1_funnel/`; clinical criteria per [`clinical-protocol.md`](../weight_management_app/data/synthesis/clinical-protocol.md) (Bold Care GLP‑1 Weight Management Guideline v1.0, eff. 2026‑06‑30).*
