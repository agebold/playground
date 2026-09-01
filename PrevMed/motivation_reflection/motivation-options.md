# Motivation question — options and the data behind them

Every option shipped in the motivation question traces to a row in this table.
**If an option has no row, it does not ship.** This is the human-readable twin of
`motivation-data.js`, which the prototype reads at runtime.

## Source

Single source, no other datasets:

- [`../glp1_funnel/checkin-motivation-taxonomy.md`](../glp1_funnel/checkin-motivation-taxonomy.md) — the tag definitions
- [`../glp1_funnel/checkin-intent-analysis.md`](../glp1_funnel/checkin-intent-analysis.md) — the shares and findings
- [`../glp1_funnel/data/checkin-responses-2026-06-28_to_2026-07-28.csv`](../glp1_funnel/data/) — the raw export
- [`../glp1_funnel/analyze_checkin_responses.py`](../glp1_funnel/analyze_checkin_responses.py) — the runnable tagger; the authoritative matching rules
- Mixpanel project `2330259`, report `91760050` — the live view

**Window:** 2026-06-28 → 2026-07-28.
**Base:** 1,137 submissions · 690 text answers · **39.3% blank**.
All percentages below are share of the **690 text answers**.

This work is not new scope. The taxonomy already names it:

> **P0 — Replace the open box with a guided multi-select** (options in the taxonomy) + optional
> free-text. Directly attacks the 39% blank rate… **Highest leverage, low effort.**

and pre-ranks the picker options, which is what the table below ships.

## How to read the percentages

They are **multi-label prevalence** — how often a topic was *raised*. Shares sum to more
than 100% because one answer can carry several tags.

A higher number means **more commonly raised**. It does **not** mean:

- more strongly wanted,
- the person's main reason for being there, or
- more persuasive at driving sign-up.

Order the options by prevalence. Do not claim the top one converts best — that is what
the test is for.

## The options

Options 1–6 ship in **every** direction and cover ~85% of text answers. Options 7–8 ship
only in **Direction B**, where multi-select tolerates a longer list.

| # | Option copy (patient language) | Tag | Share | Verbatims behind it |
|---|---|---|--:|---|
| 1 | Lose the weight — and keep it off | `desire.weight_loss` + `desire.maintenance` | 63.2 + 12.3% | "lose weight and keep it off" · "Keeping it off" · "go on maintence?" |
| 2 | Move without the pain | `desire.pain_mobility` | 12.3% | "Weight loss.and pain control" · "walk long distances" · "Balance" |
| 3 | Know what to eat | `desire.plan_guidance` | 10.6% | "Menus… hard time knowing what to eat" · "Best eating and exercising plan" |
| 4 | Get my energy back | `desire.energy` | 9.4% | "get my energy back" · "no ambition daily" |
| 5 | Talk about a GLP-1 — pill or shot | `desire.medication_interest` + `question.modality` | 7.7 + 2.3% | "I'd like to try weight loss medication" · "Getting back on Zepbound" · "Is it pills or injections" |
| 6 | Keep my numbers in check | `desire.disease_control` | 6.7% | "keep A1C down" · "Will help my heart" · "sleep apnea" |
| 7 | Quiet the constant hunger | `desire.appetite_control` | 4.8% | "Stopping food noise" · "always hungry" · "Why do I want to eat all the time?" |
| 8 | Lose fat without losing my strength | `desire.muscle_strength` | 3.3% | "preserving muscle" · "without loss of strength" · "bone density" |

### Escape hatches

Both are real paths, not dead ends, and neither blocks progression.

| Option | Tag | Share | Notes |
|---|---|--:|---|
| Something else *(optional textarea + voice)* | `unmapped` | 1.9% | The one free-text field that survives. Open text on mobile is the #1 abandonment pattern for 65+, so it is optional and never the default. |
| Not sure yet — help me figure it out | `tier0.nonanswer` | 1.6% | The skip. Tracked as `not_sure`. The scheduling screen falls back to generic copy — it never renders an empty callout. |

### Two calls that were deliberate

**Option 1 merges two tags.** `desire.weight_loss` (63.2%) is near-universal but is the *sole*
stated intent for only ~42% of the people who mention it; the rest attach pain, energy, or
maintenance. `desire.maintenance` (12.3%) is the single strongest qualifier on it. A bare
"lose weight" option would be picked by almost everyone and tell us nothing, so it ships as
the durable-result framing the analysis recommends: *"lead with durable results ('lose it and
keep it off'), not weight loss alone."*

**Option 5 carries a negation guard.** The drug-name keywords match any *mention* of a GLP-1,
including mentions that exist only to reject one — "without a GLP1", "can't take injectable",
"Horrible eczema allergic reaction". The tagger strips those, which moved the tag from 8.3%
to **7.7%**. So: mention ≠ endorsement. Do not read this group as pre-sold. A separate 0.9%
explicitly do *not* want a GLP-1, which is why the option is worded as *"talk about"* rather
than *"start"*, and why pill stays visible next to shot.

## Direction C — the optional worry follow-up

Direction C adds one optional question drawn from the questions/concerns half of the same
taxonomy. It is the only direction that adds a second question, and therefore the one most
exposed to the Signup → Eligible guardrail.

| Worry | Tag | Share |
|---|---|--:|
| Side effects | `question.side_effects` | 4.2% |
| Whether it's safe with my other medicines | `question.interactions` + `concern.comorbidity_safety` | 0.9 + 3.3% |
| Pill or shot | `question.modality` + `concern.injection_aversion` | 2.3 + 0.4% |
| I've tried everything before | `concern.tried_everything` | 3.2% |
| Whether this works at my age | `concern.age` | 2.8% |
| What it will cost me | `question.cost_coverage` + `concern.affordability` | 4.2 + 1.2% |

Concerns are only 14.3% of text answers overall, versus 89.3% expressing a desire. That is
partly an artefact of a goals-worded prompt — this field is nearly silent on objections, so
its low cost number is **not** evidence that cost does not matter at the coverage or verdict
step. Direction C is a bet that the stalling subgroup is disproportionately inside that 14.3%.

## Options considered and cut

| Cut | Why |
|---|---|
| "Lose belly fat" | `desire.belly` is 2.0%. Vivid ("the belly apron") but too thin to earn a slot, and it sits inside option 1. |
| "Lose 15 lbs" / numeric target | `desire.specific_target` is 8.4% and would earn a slot — but it needs a number input, not a chip. The taxonomy files it separately as **P0b**. Own ticket. |
| "Feel good about myself" / appearance | `desire.appearance` 2.9%. Below the bar and overlaps energy. |
| "Get healthy" | `desire.general_health` 1.9%. Too vague to reflect back — an echo of "get healthy" says nothing. |
| "I'm already on a GLP-1" | `segment.current_glp1` 1.7%. This is lifecycle state, not motivation. The chat already asks it as its own question, where it belongs. |

## Out of scope

Free-text-only motivation capture. Moving this question above signup onto the landing page —
that is a top-of-funnel test and needs its own ticket. This one is scoped to the scheduling
decision point.
