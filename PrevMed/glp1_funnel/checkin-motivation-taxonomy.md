# Check-in Motivation Taxonomy

Canonical tags for the GLP-1 onboarding check-in free-text ("what do you want help
with / discuss"). Derived **only** from the attached export
`data/checkin-responses-2026-06-28_to_2026-07-28.csv`.

This taxonomy is the shared source for: (a) a guided **multi-select** intent picker (P0),
(b) provider **pre-visit note** tags, (c) analytics dimensions, and (d) the keyword rules
in `analyze_checkin_responses.py` (that script is the exact, runnable source of truth for
matching — keyword columns here are abbreviated).

**Multi-label:** a response can carry several tags (e.g. "lose weight and keep it off, more
energy" → `weight_loss` + `maintenance` + `energy`). So tag shares intentionally sum to
>100%.

**% base:** `pct_of_text_answers` = a tag's summed submissions ÷ **all non-blank
submissions** (690). Blank is reported separately as % of ALL submissions (1,137).

Window: 2026-06-28 → 2026-07-28. Blank = **39.3%** of all submissions.

---

## Tier 0 — low-signal
| tag | captures | example verbatims | match keywords (abbrev) |
|---|---|---|---|
| `tier0.blank` | no text entered | *(empty)* | empty string |
| `tier0.nonanswer` | text with no intent | "Not sure", "Nothing", "He", "My Eng" | exact set: not sure / no / nothing / none / idk / he … |

## A. Desires
| tag | captures | example verbatims | match keywords (abbrev) |
|---|---|---|---|
| `desire.weight_loss` | lose weight (baseline) | "Weight loss", "Losing weight", "Weight management" | weight, lose, loose, losing, lbs, pound, overweight, get the weight off, belly, tummy … |
| `desire.specific_target` | a numeric goal | "15 lbs off", "lose 8-10 lbs", "goal weight of 125" | regex `\d+ (lb/lbs/pound/#)`, "lose N", "goal weight" … |
| `desire.belly` | midsection focus | "Belly fat", "The belly apron", "shrink waist and stomach" | belly, tummy, waist, stomach, apron, midsection |
| `desire.maintenance` | keep it off / not regain | "Keeping it off", "lose weight and keep it off", "go on maintence?" | keep it off, keep weight off, not gain it back, maintain, maintenance, sustain, for life … |
| `desire.pain_mobility` | less pain / move / independence | "Weight loss.and pain control", "walk long distances", "Balance" | pain, arthrit, joint, knee, hip, back pain, mobility, walk, stand, posture, wheelchair, flexib … |
| `desire.plan_guidance` | what/how to eat & exercise | "Menus… hard time knowing what to eat", "Best eating and exercising plan" | meal plan, menu, what to eat, nutrition, best foods, exercis, gym, protein, diet, guidance … |
| `desire.energy` | energy / vitality / less fatigue | "get my energy back", "no ambition daily" | energy, fatigue, tired, stamina, sluggish, lethargic, ambition, vitality … |
| `desire.medication_interest` | names / mentions a GLP-1 (aversion-only mentions excluded — see negation guard) | "GLP-1", "Ozempic", "The drugs", "take wagovy" | glp, ozempic, wegovy, zepbound, mounjaro, semaglutide, tirzep, the drug(s), prescription, the pill … **minus** aversion-only: "without a GLP1", "can't take", "allergic reaction", "scared of the GLP" (unless a want marker like "willing to try" / "get back on" is also present) |
| `desire.disease_control` | manage a condition | "keep A1C down", "Will help my heart", "sleep apnea" | diabet, a1c, cholesterol, blood pressure, apnea, liver, kidney, heart, thyroid, hormonal, hrt … |
| `desire.appetite_control` | cravings / food noise / hunger | "Stopping food noise", "always hungry", "Why do I want to eat all the time?" | food noise, craving, hunger, appetite, snack, binge, sweet, sugar, eat all the time, feel full … |
| `desire.muscle_strength` | keep/gain strength, muscle, bone | "without loss of strength", "get stronger", "bone density" | muscle, strength, stronger, strong, lean, bone, resistance, sarcopenia … |
| `desire.appearance` | look/feel better, confidence, longevity | "feel good about myself", "keep up with my grandkids", "loose skin" | feel good about myself, confidence, grandkid, look, longevity, anti aging, loose skin, tone, firm … |
| `desire.general_health` | generic "get healthy" | "living a healthier lifestyle", "health all over health", "Prevention" | get healthy, healthier lifestyle, healthy living, wellness, prevention, prevent … |

## B. Questions
| tag | captures | example verbatims | match keywords (abbrev) |
|---|---|---|---|
| `question.cost_coverage` | price / insurance / Medicare | "The cost", "afford with my Medicare", "$50.00 a month" | cost, price, afford, copay, insurance, medicare, coverage, covered, out of pocket, tricare, part d, $ … |
| `question.side_effects` | side-effect questions | "Side effects", "Will it cause nausea", "cause hair lose?" | side effect, nausea, throwing up, hair loss, constipation, reaction, effects … |
| `question.modality` | pill vs injection | "A pill for weight loss", "Is it pills or injections" | pill, oral, injection, shot, inject, needle, vial |
| `question.how_it_works` | mechanism / what is it | "How the drug works", "What does the medicine actually do", "What is Bold?" | how does it work, how the drug works, what does the medicine, what is bold, what to expect … |
| `question.duration` | how long / forever | "on it forever", "long term use", "come back after I go off it" | forever, how long, long term, indefinite, for life, stop taking, go off, off it … |
| `question.safety` | is it safe / approved | "Is it safe", "approved & is it safe? Not just… for $$$?" | is it safe, how safe, safety, approved, fda, risk, dangerous, something safe … |
| `question.eligibility` | do I qualify | "If I qualify", "Qualification", "can i get on the GLP-1 program?" | qualify, eligible, eligibility, candidate, can i get on, approved for … |
| `question.interactions` | with my meds/conditions | "take with all my medications", "am I allowed to take GLP-1?", "when I have cirrhosis" | with my medications, allowed to take, interfere, interact, letrozole, parkinson, with my condition … |

## C. Concerns / barriers
| tag | captures | example verbatims | match keywords (abbrev) |
|---|---|---|---|
| `concern.comorbidity_safety` | serious condition / polypharmacy | "when I have cirrhosis", "take with all my medications", "CHF and Chronic COPD" | parkinson, cancer, cirrhosis, ckd, kidney, thyroid, copd, chf, lupus, letrozole, all my medications … |
| `concern.tried_everything` | yo-yo / low self-efficacy | "no matter what I try", "always gain it back", "self sabatoge" | no matter what i try, tried everything, gain it back, yo yo, can't lose, frustrat, weight watchers, keto … |
| `concern.age` | harder at my age | "at my age", "in my old age", "My age 80" | at my age, old age, at this age, yrs old, years old, grow older, `\baging\b` … |
| `concern.plateau_switcher` | stalled / med not working / provider comms | "my weight loss has stalled", "shots… too slow", "difficult to communicate with the provider" | stalled, plateau, not working, not losing, stuck, too slow, scale won't move, communicate with the provider … |
| `concern.side_effect_fear` | fear of specific effects | "the skeleton face?", "loose skin", "without hair loss or muscle loss" | skeleton face, loose skin, hair loss, muscle loss, afraid, scared, worried, make me feel … |
| `concern.affordability` | can't afford / lost coverage | "can't afford it. UHC won't pay", "insurance… quitcovering", "became too expensive" | can't afford, too expensive, won't pay, lost coverage, no longer cover, quit covering … |
| `concern.injection_aversion` | needle fear / prior reaction | "can't take injectable", "Horrible eczema allergic reaction" | afraid of shots, can't take injectable, no needles, allergic reaction, eczema … |
| `concern.skepticism_trust` | is this real / trust | "Not just something made up… for $$$?", "what's in it for you?" | made up, for $$$, what's in it for you, scam, gimmick, really work … |

## Segments (lifecycle relationship to GLP-1)
| tag | captures | example verbatims | match keywords (abbrev) |
|---|---|---|---|
| `segment.modest_goal` | small target (≤~20 lb) | "15 lbs off", "just a few pounds", "10-12 lbs" | regex small `\d (lb/lbs/pound)`, few pounds, 8-10, 10-12, only want to lose 20 … |
| `segment.current_glp1` | on a GLP-1 now | "On 12.5 zepbound", "still taking the GLP shots", "I take a glp-1" | currently on, still taking the glp, on zepbound/wegovy/ozempic, on tirzep, taking glp … |
| `segment.maintenance_phase` | already lost, wants to hold | "lost 60 lbs in past year", "close to my weight goal", "maintain after" | lost N lbs, already lost, i've lost, reached my goal, maintain after … |
| `segment.lapsed` | was on, stopped | "had to discontinue due to lack of coverage", "would like to go back", "getting back on" | was taking, had to discontinue, go back on, getting back on, was up to, took terzepitide … |
| `segment.naive_curious` | never tried, considering | "scared of the GLP… willing to try the pill", "I'd like to try" | scared of the glp, never tried, considering, willing to try the pill, want to try … |

---

### Notes for reuse
- The keyword columns are abbreviated; `analyze_checkin_responses.py` holds the full,
  authoritative rule set (edit rules there, re-run, and this doc stays the human-readable map).
- **Negation guard (`desire.medication_interest` only):** because the drug-name keywords match
  any *mention* of a GLP-1, the script strips this tag when a response names a drug solely to
  reject it (`MED_AVERSION`: "without a GLP1", "can't take", "allergic reaction", "scared of the
  GLP", "do not want") **and** carries no want marker (`MED_WANT`: "willing to try", "would like
  to", "get back on", "prescribed", …). This dropped the tag from 8.3% → **7.7%** of text answers.
  The same pattern (mention ≠ endorsement) can affect other tags — re-audit before trusting a
  bare-keyword desire count.
- For the **P0 multi-select**, the strongest picker options (by measured demand) are:
  lose weight · keep it off · more energy · less pain / move easier · what to eat / a plan ·
  which GLP-1 (pill or shot) · manage a condition · quiet cravings · already on a GLP-1 ·
  not sure. Keep an "other" free-text.
- ~1.9% of text answers stay `unmapped` (genuinely vague: "Help", "Stress", "My history").
  Re-check the printed unmapped list whenever new data is added.
