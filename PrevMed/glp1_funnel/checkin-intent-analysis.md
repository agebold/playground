# Check-in Intent Analysis — GLP-1 Onboarding

**Source (only):** `data/checkin-responses-2026-06-28_to_2026-07-28.csv` — Mixpanel
"Uniques of User submitted checkin response," every distinct answer to the onboarding
"what do you want help with / discuss" field, with per-day submitter counts.
**Window:** 2026-06-28 → 2026-07-28. **Reproduce:** `python3 analyze_checkin_responses.py`.
**Live view:** https://mixpanel.com/project/2330259/view/2874245/app/insights#G5YzQVtkF4Gf

> Self-contained: no other datasets, skills, or research were used. Tags & rules live in
> `checkin-motivation-taxonomy.md` + `analyze_checkin_responses.py`.

## Headline numbers
- **1,137** total submissions · **598** distinct strings. *(Base = summed daily uniques, not
  distinct users — may double-count multi-day submitters; pull true window-uniques from Mixpanel.)*
- **447 "blank" = 39.3% of all submissions** — i.e. no text captured. Unconfirmed whether this is
  skip / optional field / tracking artifact, and there is no reached-the-step denominator, so
  treat it as "no text," not verified drop-off. (Blank trended 41.9%→36.9% across the window.)
- **690 text answers** = the base for every % below.
- Of text answers: **89.3% express a desire**, only **15.2% a question**, **14.3% a
  concern**, 6.8% reveal a lifecycle segment. **This step captures GOALS, not objections**
  (consistent with a goals-worded prompt — confirm the exact on-screen question before
  over-reading the split).
- **% is multi-label** (an answer can hit several themes), so columns sum to >100%.

## Theme hierarchy (% of the 690 text answers)

### A. Desires
| theme | % | note |
|---|--:|---|
| Lose weight (baseline) | **63.2** | near-universal — but the *sole* stated intent for only ~42% of these; the rest pair it with pain, energy, or maintenance |
| ↳ specific numeric target | 8.4 | "15 lbs off", "lose 8–10 lbs", "goal 125" |
| ↳ belly / midsection | 2.0 | "the belly apron" |
| Keep it off / maintenance | **12.3** | strongest qualifier on "lose weight" |
| Less pain / mobility / independence | **12.3** | ties maintenance for #2 |
| Plan / what-to-eat guidance | **10.6** | wants the *how*, not just a script |
| Energy / vitality | **9.4** | "feel like I'm 100" |
| Names / mentions a GLP-1 | 7.7 | on it, wants to start/resume, or asking about it — a mix of pre-sold + questions; outright rejections excluded (see taxonomy negation guard) |
| Manage a condition | 6.7 | diabetes, BP, apnea, liver, thyroid |
| Appetite / cravings / food noise | 4.8 | directly served by the med |
| Keep strength / muscle / bone | 3.3 | "preserving muscle", "keep from losing muscle", "get stronger" |
| Appearance / confidence / longevity | 2.9 | "keep up with my grandkids" |
| Generic "get healthy" | 1.9 | "living a healthier lifestyle", "health all over health" |

### B. Questions
| theme | % | note |
|---|--:|---|
| Cost & coverage | 4.2 | "The cost", "afford with my Medicare", "$50 a month" |
| Side effects | 4.2 | nausea, hair loss, "cause the skeleton face?" |
| Pill vs injection | 2.3 | pill-curious; "scared of the shot but would try the pill" |
| How it works / what is it | 1.9 | "what does the medicine do", "What is Bold?" |
| Duration / "forever?" | 1.4 | "will I be on it forever", "come back after I stop?" |
| Safety / approved | 1.4 | "is it safe", "is it FDA-approved" |
| Eligibility / do I qualify | 1.0 | "do I qualify", "can I get on the program?" |
| Interactions w/ my meds | 0.9 | "take with all my medications", "allowed with Parkinson's meds?" |

### C. Concerns / barriers
| theme | % | note |
|---|--:|---|
| Comorbidity / polypharmacy safety | 3.3 | cirrhosis, Parkinson's, CKD, "take with all my meds" |
| Tried-everything / yo-yo | 3.2 | "no matter what I try", "always gain it back" |
| Harder at my age | 2.8 | "in my old age", "at my age", "My age 80" |
| Plateau / current medication not working | 2.5 | "scale won't move", "GLP shots… dosage only changed once", "advancement on the shots was too slow" (1 of 17 also cited trouble communicating with their provider) |
| Side-effect fear (skeleton face, loose skin) | 1.4 | "without hair loss or muscle loss" |
| Can't afford / lost coverage | 1.2 | "can't afford it. UHC won't pay", "insurance quit covering" |
| Injection aversion | 0.4 | "can't take injectable", "horrible allergic reaction" |
| Skepticism / trust | 0.4 | "not just something made up for $$$?", "what's in it for you?" |

### Segments (lifecycle vs GLP-1)
| segment | % | note |
|---|--:|---|
| Modest goal (≤~20 lb) | 3.5 | "only want to lose 20 lbs max", "to be able to loose 20 pounds" |
| Currently on a GLP-1 | 1.7 | "On 12.5 zepbound", "same dose I am currently on" |
| Maintenance-phase (already lost) | 1.4 | "lost 60 lbs in past year but need help to maintain" |
| Lapsed (stopped) | 0.9 | "had to discontinue due to lack of coverage… go back on" |
| Naïve / curious | 0.3 | "scared of the GLP… willing to try the pill" |

Low-signal: blank 39.3% (of all) · non-answers 1.6% · unmapped 1.9% (of text). *Cells below ~5%
represent roughly 7–30 mentions (segments: ~2–24); read them as directional, not precise.*

## Key findings

Each finding is stated as **observation → evidence → implication**. All percentages are
share of the 690 text answers unless noted; themes are multi-label, so they do not sum to 100%.

### How to read this field
1. **Members use this field to state goals, not to raise objections.**
   89.3% of text answers express a desire, while only 15.2% ask a question and 14.3% raise a
   concern (a split partly shaped by the prompt's goal-oriented wording, which is assumed not
   confirmed). *Implication:* lead acquisition messaging with the member's goal; do not build it
   primarily around rebutting price or safety objections.
2. **Nearly 2 in 5 submissions carry no text.**
   Blank responses are 39.3% of all submissions (unconfirmed as drop-off — see headline caveat).
   *Implication:* a guided multi-select picker (see P0) would capture intent from these members
   and clean the analytics regardless of the cause.

### What members want most (demand hierarchy)
3. **Weight loss is near-universal, and keeping it off is the leading qualifier.**
   63.2% mention losing weight; 12.3% specifically want to keep it off / maintain. Weight loss is
   the *only* stated intent for ~42% of those who mention it; the rest attach pain, energy, or
   maintenance goals. *Implication:* lead with durable results ("lose it and keep it off"), not
   weight loss alone.
4. **Pain relief and mobility are a top-tier motivation — tied with maintenance and ahead of energy.**
   12.3% cite pain, joints, mobility, or independence. *Implication:* a pain-and-mobility
   message ("move more easily, stay independent") is justified as a primary theme, not a footnote.
5. **Members want guidance on how to do it, not only a prescription.**
   10.6% ask for meal plans, what/when to eat, or exercise direction. *Implication:* position
   Bold as coaching plus medication.
6. **Energy and vitality is a strong standalone driver.**
   9.4% want their energy back. *Implication:* a credible alternative hero message to A/B test.
7. **Roughly 1 in 13 arrive already naming a GLP-1 — but "named" ≠ "sold."**
   7.7% name a specific GLP-1 or "the pill" (after excluding outright rejections such as "without
   a GLP-1" / "can't take injectable" / "allergic reaction"), and an additional 2.3% ask about
   pill vs. injection. This group blends the genuinely pre-sold with people still asking questions
   and current users stalled on a drug. *Implication:* fast-track the clearly pre-sold, but segment
   first — don't assume "sign me up"; keep the oral option visible.

### An observation to test, not act on yet
8. **Cost is rarely the *stated goal* in this field.**
   Cost/coverage questions are 4.2% and affordability concerns 1.2% — below the goal themes
   above. This is expected for a goals-worded prompt and does **not** mean cost is unimportant to
   conversion; this field is silent on the coverage/verdict steps, where cost likely matters more.
   *Implication:* lead with goals **here** and keep testing cost messaging elsewhere — do not
   remove cost from the verdict/coverage step on the strength of this field alone.

### Smaller but high-value groups
9. **GLP-1–experienced members form a coherent, high-intent segment (~5% distinct — the tags overlap, so they don't simply add).**
   Currently on a GLP-1 (1.7%), lapsed (0.9%), maintenance-phase (1.4%), and plateau /
   current medication not working (2.5%) share one need: **better results** — e.g. dose
   optimization and closer follow-up. *Implication:* a dedicated "already on a GLP-1?" path
   is warranted (see P1). *Note:* difficulty reaching/communicating with a current provider
   appears in only 1 response — a hypothesis to test, not an established theme.
10. **A vulnerable minority needs explicit reassurance.**
    Complex conditions / multiple medications (3.3%), difficulty losing weight with age (2.8%),
    and repeated past failure or yo-yo dieting (3.2%). *Implication:* provide "a provider
    reviews your conditions and medications first" reassurance and credible evidence for why
    this approach differs from what they have already tried.

## Opportunities

### A. Copy hypotheses to A/B test (ranked by how often the intent appears)
> Frequency = prevalence of a stated desire, not proven persuasion. Validate each in-market;
> a common theme can be table stakes and a rarer one decisive.
1. **Durable weight loss** — "Lose the weight — and keep it off." (63% + 12.3%)
2. **The life outcome** — move without pain, more energy, stay independent. (12.3% + 9.4%)
3. **"We tell you exactly what to eat and do."** — the guidance people ask for. (10.6%)
4. **"Covered GLP-1 options — as a pill or a shot."** — for the pre-sold + pill-curious.
   (7.7% + 2.3%)
5. **Manage the condition driving it** — diabetes / BP / sleep apnea. (6.7%)
6. **"Quiet the cravings / food noise."** (4.8%)
7. **Secondary reassurance, not the hero** — side effects + "keep your strength," and a
   clear cost/coverage answer where it surfaces. (4.2% / 4.2% / 3.3%)
8. **Switcher line** — "Already on a GLP-1 and stalled? Get results — a dose review and
   closer follow-up." (high-intent ~5%)

### B. Product / UX opportunities
- **P0 — Replace the open box with a guided multi-select** (options in the taxonomy) +
  optional free-text. Directly attacks the 39% blank rate; cleans analytics; captures intent
  for the visit and for personalization. **Highest leverage, low effort.**
- **P0b — Capture a target number** (specific-target 8.4% + modest-goal 3.5% volunteer one
  unprompted) — enables action-planning and a concrete "here's your plan to X lbs."
- **P1 — "Already on a GLP-1?" branch** for switchers/lapsed/plateaued; lead with **better
  results** (dose optimization, closer follow-up). Responsive-provider messaging is a
  hypothesis from a single verbatim — test it, don't assume it.
- **P2 — Name the "food noise" / craving benefit** as its own value prop.
- **P3 — Motivation-aware entry** — pain/mobility-led and energy-led variants (both large here).
- **P4 — Maintenance-forward promise** for the regain-fearful and maintenance-phase arrivals.
- **P5 — "A provider reviews your conditions & medications first"** reassurance for the
  medically complex minority.

## Limitations
> (1) Base = summed daily uniques, not distinct users. (2) Themes come from a keyword tagger
> hand-built from this data (not human-validated; ~1.9% unmapped) — mid-frequency mis-tags are
> unmeasured, and novel themes may hide inside "weight loss." (3) "Blank" is unconfirmed and
> lacks a reached-the-step denominator. (4) No conversion outcome is in this data, so copy
> priorities are hypotheses, not proven levers. (5) Prompt wording is assumed, not confirmed.
> (6) Cells below ~5% are small-n / directional.

## Reproduce
```
python3 PrevMed/glp1_funnel/analyze_checkin_responses.py
# writes: checkin-theme-share.csv, checkin-responses-tagged.csv, checkin-tag-examples.csv
```
Outputs regenerate deterministically from the CSV. Edit rules in the script (mirrored in
`checkin-motivation-taxonomy.md`) and re-run; watch the printed `unmapped` list stays small.
