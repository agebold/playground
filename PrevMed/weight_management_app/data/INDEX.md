# Weight Management App — Research Data Index

This folder holds the source material that drives every design decision for the Weight Management App. **Read top-down**: this index → all of `synthesis/` → only the `raw/` files you actually need.

## How to use this folder

1. **Start here.** Skim this file for what exists and when it was added.
2. **Read `synthesis/`.** Short, dense, current. This is the working memory.
3. **Open `raw/` only when needed.** A specific quote, a contested decision, a finding the synthesis under-explains.
4. **Adding new data?** See [HOW-TO-ADD.md](HOW-TO-ADD.md) for the ingestion loop.

## Synthesis (read every session)

- [synthesis/findings.md](synthesis/findings.md) — validated user insights with raw-source citations
- [synthesis/decisions.md](synthesis/decisions.md) — dated log of what the team agreed to do / drop
- [synthesis/principles.md](synthesis/principles.md) — design principles for this app
- [synthesis/value-props.md](synthesis/value-props.md) — the six winning value propositions to build around
- [synthesis/positioning.md](synthesis/positioning.md) — marketing positioning, hero messaging copy bank, "we're not" list, and six user-need → copy mappings (pre-GLP-1 phase, durable for app voice)
- [synthesis/personas.md](synthesis/personas.md) — two working-hypothesis personas (Tried-and-Burned, Curious-but-Wary) for prototype targeting
- [synthesis/clinical-protocol.md](synthesis/clinical-protocol.md) — product-relevant distillation of the Bold Care GLP-1 Weight Management Guideline (eligibility, anthropometrics, mandatory protein + resistance training, dosing cadence, side-effect realism, follow-up spine, PCP coordination)
- [synthesis/open-questions.md](synthesis/open-questions.md) — unresolved questions to revisit

## Raw sources (open on demand)

| Date | File | What's in it |
| --- | --- | --- |
| 2026-05-04 | [raw/Weekly Product_Design Sync - 2026_05_04 11_30 PDT - Notes by Gemini.pdf](raw/Weekly%20Product_Design%20Sync%20-%202026_05_04%2011_30%20PDT%20-%20Notes%20by%20Gemini.pdf) | Internal product/design sync. First readout of the bullseye prototype interviews (3 of 5 done at that point). Q2 goal status, nutrition session attendance, plan to ship GLP-1 companion product in Q3. |
| 2026-05-05 | [raw/Weight Management Research Readout - 2026_05_05 14_29 PDT - Notes by Gemini.pdf](raw/Weight%20Management%20Research%20Readout%20-%202026_05_05%2014_29%20PDT%20-%20Notes%20by%20Gemini.pdf) | Full cross-functional readout of the 4-interview bullseye sprint. Three prototypes tested (Stay Strong / Beyond the Scale / Lifestyle Reset). Names the six winning value props, the pricing anchor ($50/mo), and the prototype that won (P1). Includes full transcript. |
| 2026-05-20 | [raw/2026-05-20-weight-management-positioning-pre-glp1.md](raw/2026-05-20-weight-management-positioning-pre-glp1.md) | Clinic team's Weight Management Positioning doc for the **pre-GLP-1** phase. Onboarding chief-complaint distribution (50% weight mgmt, n=486/965), hero messaging copy bank, eight Clinic program value props, the "We're not" list, and six user-need → provider-voice copy mappings. Distilled into [synthesis/positioning.md](synthesis/positioning.md). |
| 2026-05-05 | [raw/Weight Management Program Bullseye Research – Dovetail.pdf](raw/Weight%20Management%20Program%20Bullseye%20Research%20%E2%80%93%20Dovetail.pdf) | Dovetail-generated **bullseye research report** for the same 4 interviews (Jennifer Jones, Ron Riemer, Linda Campbell, Robin English). Insights ordered by signal strength with verbatim quotes and timestamps; STRONG/MODERATE/WEAK signal buckets and per-insight "Next step" recommendations. Adds specific copy + CTA findings (Strength-not-Restriction headline, Check-My-Coverage). Distilled into [[findings]] #25–32, [[principles]] #6, [[value-props]]. |
| 2026-05-05 | [raw/Weight Management Program Bullseye Research 2 – Dovetail.pdf](raw/Weight%20Management%20Program%20Bullseye%20Research%202%20%E2%80%93%20Dovetail.pdf) | Dovetail **insight doc** — second Dovetail view of the same 4 interviews, structured as value-prop hierarchy (props 1–3 with "what resonated / what to avoid / user need / evidence") + prototype readout + the six winning value props. Sharpens P2 headline critique and the "composite ideal program" spec. Distilled into [[findings]] #25–32, [[decisions]] 2026-05-20 (Dovetail ingestion). |
| 2026-05-21 | [raw/2026-05-21-weight-focused-landing-page-review.md](raw/2026-05-21-weight-focused-landing-page-review.md) | Internal LP review of Eliza/Tzu-Yi's weight-focused landing page draft. Names concrete copy and module-level directions (appointment length, accountability framing, "personalized + practical + doable" care plan, doctor/NP language, NYT-only press treatment, member-count proof, AB-test design risk). Distilled into [[findings]] #33–41, [[decisions]] 2026-05-21, [[positioning]], [[value-props]] #6, [[principles]] #15, [[open-questions]]. |
| 2026-03-15 | [raw/2026-03-15-bold-care-glp1-weight-management-guideline.md](raw/2026-03-15-bold-care-glp1-weight-management-guideline.md) | Bold Care **GLP-1 Weight Management Guideline v1.0** (CMO Dr. Sandeep Palakodeti). Full clinical protocol: indications, BMI+WHtR triage, 65+ considerations (sarcopenic obesity, pharmacokinetics, polypharmacy), exclusion criteria, baseline labs + STEADI + PHQ-2 + Sit-to-Stand + calf circumference, full GLP-1 + AOM formulary, per-drug titration grids (up & down), mandatory protein ≥1.2 g/kg/day and Bold Fitness 2x/wk, side-effect frequencies (nausea 30–50%), follow-up schedule, escalation chain, PCP notification template. Distilled into [[clinical-protocol]]; cross-references [[findings]] and [[principles]] where it intersects user research. |

## Conventions

- **Filenames in `raw/`:** keep originals. Don't rename or edit source records.
- **Dates:** absolute (`YYYY-MM-DD`), never relative.
- **New synthesis files:** create one only when an existing file would become unfocused. Keep each synthesis file under ~200 lines so it stays scannable.
