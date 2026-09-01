# Prioritized Issue Register — Bold Care / PrevMed Weight-Management Funnel

**Prepared for:** Product, UX Design, Operations, Clinical, Engineering
**Date:** July 28, 2026
**Sources:** (1) 10 themes from 72 Care Coordination call recordings (July 2026); (2) LogRocket funnel drop-off analysis of 130 `/prevmed` sessions (last 90 days)

---

## Why this exists

Two independent analyses of the weight-management funnel landed at once — one
qualitative (care-coordination calls), one quantitative (session replays). Each
prioritizes *within* itself, but neither ranks *across* both, and both lean on
frequency/volume. This register merges them into one severity-ranked list so every
team can triage from a single source.

## How it's ranked (severity beats volume)

Ordered by **consequence**, not call count:

1. Patient safety / clinical harm
2. Privacy / legal (HIPAA) exposure
3. Committed/paying users blocked from value
4. Revenue / churn magnitude
5. Conversion & visit-completion friction
6. Strategic opportunity

Issues confirmed by **both** datasets rank higher (two independent signals). This
deliberately promotes two items the call deck under-rated — the **contraindication
gap** (buried inside a "High" theme) and the **account cross-linking bug** (tagged
"Medium") — to the very top, because a clinical-harm recommendation and a PHI leak
are severity-defined, not frequency-defined.

**Type key:** `Fix` = product/design work we own · `Flag` = eng/ops bug or process
gap to route out and track · `Mixed` = both.

---

## The ranked register

| # | Issue | Severity | Sources | Owner(s) | Type |
|---|-------|----------|---------|----------|------|
| 1 | **Contraindicated care-plan content** — kidney-disease patient told to eat 80g protein; care plans generate with no contraindication check before delivery. Clinical harm + liability. | 🚨 Safety | CCC T6 | Clinical + Eng | Fix |
| 2 | **Account cross-linking / PHI leak** — one patient received another's personalized content; two accounts on one email. HIPAA/data-isolation breach + wrong-content (wrong-age exercise) safety risk. | 🚨 Privacy/Safety | CCC T8 | Eng | Flag |
| 3 | **Cost/coverage unconfirmed at the decision point** — patients get a range ($0–$55), not a confirmed copay; GLP-1 cost "not 100% sure." Biggest revenue leak. | 🔴 Critical | CCC T1+T4 (18+ calls) **+** LogRocket #2 (WM results ~15%) | Product + Ops | Mixed |
| 4 | **EOB misread as a bill → churn** — patient withdrew from care entirely after mistaking an Explanation of Benefits for a bill. Loss of an already-converted patient; cheap to prevent. | 🔴 Critical | CCC T4 | UX/Content + Ops | Fix |
| 5 | **Post-visit platform access broken** — SSO re-auth loop, two-platform split (Bold Fitness + Health-e/Healthie), invite-flow loop; committed users can't open their care plan and blame themselves. | 🔴 Critical | CCC T3 **+** LogRocket #1 (422 "account exists" blocker) | Eng + Product | Mixed |
| 6 | **Bridge Rx fulfillment / Part B billing gap** — GLP-1 dies at the pharmacy *after* enrollment; PA is manual/fax and fails silently. ⚠️ **Factual inconsistency:** pharmacist says "Bridge = Part B" while this repo's guideline frames Bridge as a $50 **Part D** copay — resolve before it drives more billing failures. | 🔴 Critical (low volume, high blast radius) | CCC T10 | Ops + Clinical | Flag |
| 7 | **Scheduling waits (3–5 wks) + no waitlist tooling** — active churn, explicit competitor defection, urgent patients dropping in the gap. | 🔴 Critical | CCC T2 **+** LogRocket #3 (~6%) | Ops (capacity) + Product (tooling) | Mixed |
| 8 | **Consent documents too long/dense** — ~4% drop at the highest-intent step; 40–60s of scrolling, then exit. | 🟠 High | LogRocket #4 + CCC consent screens | UX/Content + Legal | Fix |
| 9 | **Telehealth/Zoom readiness** — no first-class phone fallback; readiness checks manual/inconsistent; insurer IVR failures; one visit abandoned mid-session. | 🟠 High | CCC T5 | Product/UX + Ops | Mixed |
| 10 | **HMO out-of-network dead-ends + ineligibility drop-offs** — $200 hard stop with no pathway; some drop expected, but a **500 server error** on eligibility check is a real bug. | 🟠 High | LogRocket #5 + CCC T4 | Eng (500) + Product (HMO pathway) | Mixed |
| 11 | **"Last resort" patients (PCP let them down)** — high expectations + elevated dropout risk if Bold also disappoints; no capture of "why Bold." | 🟡 Medium | CCC T7 | Product/UX | Fix |
| 12 | **Bold Care vs Bold Fitness brand confusion** — coordinator time-sink, mild user confusion at first contact. | 🟡 Medium | CCC T8 | Marketing/UX | Fix |
| 13 | **Out-of-state demand untracked** — warm leads (e.g., NY) sit on informal coordinator lists; missed-demand signal. | 🟡 Medium / Opportunity | CCC T9 | Ops + Product | Fix |
| 14 | **Landing-page passive bounces (~38%)** — highest *volume*, lowest *actionable* severity (cold FB-ad traffic; a traffic-quality question, not a product defect). The one embedded bug (422) is elevated to #5. | 🟡 Low (volume ≠ severity) | LogRocket #1 | Marketing | — |

---

## Alternate view — ranked by frequency of mention

The same 14 issues, reordered by **how often each surfaces across the two datasets**
(care-coordination call counts + LogRocket session counts). Units differ — a call is a
spoken problem, a session is a behavioral drop-off — so totals are directional, not
exact. Where a register issue is a specific incident inside a broader call theme, both
figures are shown.

| Freq rank | Issue (severity #) | CCC calls | LogRocket sessions | ~Total | Note |
|-----------|--------------------|-----------|--------------------|--------|------|
| 1 | Cost/coverage unconfirmed (#3) | 18+ (T1 + cost of T4) | ~16 (WM results) | **~34** | **Only issue strong in both sources** — tops frequency *and* severity |
| 2 | Landing-page passive bounces (#14) | — | ~35 | ~35 | Largest single raw bucket, but one source + passive cold traffic |
| 3 | Scheduling waits + no waitlist (#7) | 8+ (T2) | ~6 | ~14 | Both sources |
| 4 | HMO / ineligibility / 500 error (#10) | ~2–3 (T4) | ~11 (ineligible 6 + insurance select 5) | ~13 | Some ineligibility overlaps out-of-state (#13) |
| 5 | Platform access / SSO (#5) | 6+ (T3) | ~4 (422 blocker) | ~10 | Both sources |
| 6 | Telehealth / Zoom readiness (#9) | 7+ (T5) | — | 7+ | |
| 7 | PCP dissatisfaction / last-resort (#11) | 5+ (T7) | — | 5+ | |
| 8 | Bold Care vs Bold Fitness confusion (#12) | 5+ (T8) | — | 5+ | |
| 9 | Consent docs too long (#8) | — | ~4 | ~4 | |
| 10 | Bridge Rx / Part B gap (#6) | 3+ (T10) | — | 3+ | |
| 11 | Out-of-state demand (#13) | 3+ (T9) | — | 3+ | |
| 12 | Contraindicated care-plan content (#1) | 1 documented | — | 1 | Broader comorbidity theme (T6) = 7+ calls; the harm itself surfaced once |
| 13 | Account cross-linking / PHI leak (#2) | 1–2 (within T8) | — | 1–2 | Rare, but the severity #2 item |
| 14 | EOB misread → churn (#4) | 1 (within T4) | — | 1 | Rare, but a total-loss churn event |

**Frequency vs. severity diverge sharply — read them together:**
- **Cost/coverage (#3) tops both** → unambiguous #1 priority either way.
- **Landing bounces leap #14 → #2** on volume, but it's mostly passive cold traffic (low harm per session). By strict raw count it's the single largest bucket; cost stays #1 because it's the only issue frequent *across both* datasets.
- **The three highest-severity items become the three least-frequent:** contraindication (sev #1 → freq #12), PHI leak (sev #2 → freq #13), EOB churn (sev #4 → freq #14). Each appeared in ~1 call.
- **Frequency tells you what to fix for the most people; severity tells you what you can't afford to get wrong even once.** Neither ordering alone is the priority list — cost/coverage is simply the one item that leads both.

---

## Repo cross-reference — what already exists vs. true gaps

**Already in flight (don't duplicate):**
- `PrevMed/glp1_funnel/cost-framing-ab-test-brief.md` — cost-framing A/B test (→ #3)
- `PrevMed/glp1_funnel/onboarding-eligibility-copy-audit.md` — eligibility/coverage copy audit (→ #3, #10)
- `PrevMed/glp1_funnel/11-result-variants.html` — Part D cost-clarity result variants (→ #3)
- `PrevMed/weight_management_app/welcome-kit-bridge.html` / `welcome-kit-partd.html` — cost/coverage + "how to join" (→ #3, #6, #9)
- `PrevMed/weight_management_app/mvp3-post-visit-design-brief.md` — post-visit design (→ #5, partial)
- `PrevMed/clinic_funnel/onboarding-research-priorities.md` — existing Tier 1/2/3 priorities list
- `PrevMed/glp1_funnel/enrollment-funnel-cvr-audit.pdf` — enrollment CVR audit (most aligned to the LogRocket data)
- Skills: `bold-pricing-messaging` (→ #3, #4), `health_care_landing_page` (→ #14), `senior-onboarding-design` (→ #8, #11)

**No existing artifact (true gaps to open work on):**
- #1 contraindication check · #2 account isolation · #4 EOB-vs-bill explainer · #5 SSO/two-platform/invite fix · #7 waitlist / "while you wait" · #11 "why Bold" capture · #12 brand disambiguation · #13 state gate/registry

**No synthesis of the care-coordination call recordings existed in the repo before this register.**

---

## Recommended immediate actions (top of list)

- **#1 & #2 are not backlog items.** Route the contraindication gap to Clinical + Eng
  and the account cross-linking bug to Eng today; both carry harm/legal exposure that
  is independent of how often they appear in the data.
- **#6 has a blocking ambiguity.** Resolve "Bridge = Part B" (pharmacist) vs "Bridge =
  $50 Part D copay" (repo guideline) with Clinical/Ops *before* any Rx-fulfillment fix
  — do not silently reconcile it in copy.
- **#3–#5, #7** are the revenue/trust core, each confirmed by both the calls and the
  funnel. Start from the existing artifacts listed above rather than net-new work.

*Ranking rationale and source detail: `~/.claude/plans/based-on-these-insights-ticklish-micali.md`.*
