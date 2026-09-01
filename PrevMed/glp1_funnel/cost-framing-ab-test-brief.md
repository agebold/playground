# A/B Test Brief — GLP-1 Cost Framing (Monthly vs Daily vs Weekly)

**Owner:** Growth / PrevMed funnel
**Surface:** `glp1_funnel/00-lp.html` (landing page hero)
**Status:** Draft for review
**Date:** 2026-07-23

---

## 1. Goal

Test whether **reframing the same GLP-1 medication cost into a smaller time unit**
(per-day / per-week instead of per-month) reduces perceived cost at first
impression and moves more visitors deeper into the funnel.

The price does not change — it is a flat $50/month copay in all arms. We are only
testing the **unit the price is expressed in** (a framing / anchoring effect).

**Hypothesis:** A smaller, more concrete cost anchor ("less than $2 a day") lowers
the cost objection at the top of the funnel and lifts CTA click-through and
sign-up rate versus the current "$50 monthly copay" framing.

**Arms (3):**
| Arm | Hero framing |
|---|---|
| Control | `FDA-approved GLP-1 pills at $50 monthly copay*` |
| A — Daily | `FDA-approved GLP-1 pills for less than $2 a day*` |
| B — Weekly | `FDA-approved GLP-1 pills for less than $12 a week*` |

Full per-surface copy is in the approved plan (`.claude/plans/…zany-ember.md`).
All three anchors reconcile to the same flat $50/month copay; the daily/weekly
figures sit *under* the anchor, so the claims are honest and favorable.

---

## 2. Business goal alignment

Ladders directly to the **weight-management pivot key result**: lift the
**sign-up → appointment-attended CVR** (baseline ~0.6%, current ~4.6%, target 10%).

Cost is a known top objection for this 65+ audience. If cost perception is a
friction point at entry, a cheaper-feeling anchor should widen the top of the
funnel (more clicks, more sign-ups), which feeds more qualified members into
appointment scheduling — the metric the pivot is measured on. This test isolates
whether *cost framing* is a lever on that funnel, cheaply, before we invest in
larger cost-page or eligibility work.

---

## 3. Metrics

### Primary
1. **Hero CTA click-through rate** *(leading indicator)*
   = unique users who click the primary hero CTA ÷ unique LP viewers.
   Sits directly downstream of the changed copy, high base rate → **reads fastest**.
   This is the cleanest signal that the framing itself works.
2. **Sign-up rate** *(business indicator)*
   = users who complete sign-up ÷ unique LP viewers.
   Lower base rate → slower to reach significance, but closer to the KR.

### Secondary / guardrail
- Insurance-verification / eligibility step completion rate.
- Appointment booked rate, and appointment-**attended** CVR (the pivot KR) — directional only; underpowered at this stage.
- LP bounce rate (guardrail: framing shouldn't increase confusion-driven exits).
- "What will this cost me?" FAQ expansion rate (proxy for cost confusion — a *rise* would flag the anchor is creating questions rather than confidence).

### Read order
Call the test on the **primary leading metric (CTA click-through)** first. Treat
sign-up as a confirming metric and appointment CVR as directional. Do not wait for
appointment-CVR significance to make the initial ship decision — it will be
underpowered at LP-test traffic volumes.

---

## 4. Funnel consistency — should the cost show the same way everywhere?

**The question:** the cost appears on more than the LP (loading step, and the
insurance **verdict / result** page). If the LP says "less than $2 a day" but the
verdict page says something else, is that a problem? Should we make the whole
funnel consistent, given users are cost-sensitive — even though that's more setup
and slower to stat-sig?

**Recommendation: keep the daily/weekly frame on the LP only for this test. Do
NOT push it to the verdict page.** This is not a shortcut — it is the more correct
design, for three reasons:

1. **The verdict page is eligibility-resolved; the LP is a general claim.**
   The result page (`11-result.html`) already shows **"Cost varies"**, not
   "$50/month", and explicitly branches: Bridge-eligible members see the $50
   copay, while Part-D members see "cost varies… we'll confirm before anything is
   prescribed" (`11-result.html:139-156`, `:180`). Stamping "less than $2 a day"
   there would **misstate cost for every member who isn't Bridge-eligible** — a
   real accuracy/compliance problem on a regulated drug-cost claim. The LP anchor
   is an aspirational, footnoted marketing claim; the verdict page must state the
   member's *actual, personalized* cost.

2. **There is no bait-and-switch, because $50/month is present in both places.**
   Even in the daily/weekly arms, the LP still carries the flat $50/month copay in
   the stat tile and footnote ("…flat $50/month copay — about $1.65 a day…"). So a
   member who sees "less than $2 a day" on the LP has *already* seen "$50/month" on
   the same page. The verdict page showing the real, eligibility-based number is
   **consistent with**, not contradictory to, the LP.

3. **It keeps the experiment clean and fast — which is the whole point of a test.**
   Changing one surface isolates the framing as the single variable, so a lift is
   attributable to the frame and not to four coordinated copy changes. It is also
   far less to build and QA per arm.

### On "more time to stat-sig"
The number of *pages* you change does **not** change the sample size needed for a
given metric — time-to-significance is driven by the metric's base rate, the
minimum effect you want to detect, traffic volume, and the number of arms. So
"make it consistent everywhere" does **not** inherently slow the test; it mainly
adds setup + QA time and changes *what* you're testing.

There is one real coupling worth naming: a **hero-only** change can lift clicks but
have its downstream sign-up effect *diluted*, because the framing isn't reinforced
later in the funnel. That's an argument for consistency **only if** sign-up is your
primary metric. Since our fast, primary read is **CTA click-through**, hero-only is
the right call now.

### Phased plan
- **Phase 1 (this test):** hero-only, 3 arms, primary metric = CTA click-through
  (secondary = sign-up). Cheap, fast, low-risk. Answers: *does the frame resonate?*
- **Phase 2 (only if a challenger wins Phase 1):** roll the winning frame through
  the funnel where it's *accurate to do so* — reinforce the daily/weekly anchor on
  pages that already assume Bridge eligibility, keep the verdict page's
  personalized "Cost varies / $50 Bridge" logic intact. Primary metric shifts to
  sign-up → appointment CVR. This is where consistency and cost sensitivity matter
  most, and it's worth the extra setup once we know the frame earns it.

---

## 5. Test design & duration

- **Split:** even (33/33/33) across the 3 arms; sticky per visitor.
- **3-arm tradeoff:** three arms split traffic into thirds, so each reaches
  significance slower than a 2-arm test would. If speed is critical, run **one**
  challenger against control (2 arms) — pick daily as the smaller/stronger anchor —
  then test the other later. Testing both at once is fine if traffic supports it;
  just expect a longer read.
- **Duration:** run full-week multiples (≥1–2 weeks) to cover weekday/weekend and
  Medicare-shopping behavior cycles; do not call early on the leading metric before
  reaching the pre-registered sample size.
- **Decision rule:** ship the arm with a statistically significant CTA
  click-through lift **and** non-negative sign-up + bounce guardrails. If a
  challenger wins clicks but sign-up is flat/negative, hold and investigate
  downstream dilution before rollout.

---

## 6. Instrumentation notes

- **Analytics:** Mixpanel project **2330259**; path identifiers `flow` and
  `is_assigned_provider`. Sessions also in LogRocket (project `age-bold`).
- **Known gotchas to account for when building the metrics** (verify before trusting the readout):
  - A **misnamed "Complete" event** — confirm which event actually marks sign-up completion.
  - An **event rename on May 8** — segment definitions may need to union old + new names.
  - **Missing path tags on "Calendar Added"** — appointment-step attribution may be incomplete; treat appointment CVR as directional.
- Confirm the hero CTA click and sign-up completion events fire per-arm with the
  experiment/variant property attached before launch.

---

## 7. Open questions

- Do we have enough LP traffic to power a 3-arm test on sign-up within a
  reasonable window, or should Phase 1 be scoped to the click-through read only?
- Should the daily anchor use "less than $2 a day" (clean) or the exact "$1.65 a
  day" (smaller number)? Current copy uses the clean version; could be a follow-up test.
