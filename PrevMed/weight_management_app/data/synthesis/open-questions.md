# Open Questions

Things the research surfaced but did not resolve. Revisit these as new data lands. When one is answered, move the resolution to [[decisions]] and delete the question here (or strike it and link to the decision).

---

## Measurement strategy

- **How does Bold credibly track muscle / fat / bone composition over time without making it feel burdensome or expensive?** Options floated: DEXA scan, smart scale, manual measurements, lab panel. Users immediately ask "do I need a device, do I need a lab?" when they see body comp tracking. The eventual answer must be light, low-cost, and explainable in one sentence. *(Source: 2026-05-05 readout, slide "Body composition tracking made easy"; 00:14:37.)*

## Pricing and packaging

- **Should Medicare coverage be its own value prop, separated from the GLP-1 form-factor prop?** Coverage wasn't tested in the bullseye sample (because the team already knew it would lead), but is expected to be load-bearing for adoption. *(Source: 2026-05-05 readout, 00:24:50.)*
- **If there are additional co-pays or physician visit fees on top of the $50/mo prescription, how do users react?** Anchoring suggests room ("well within reasonable"), but stated willingness-to-pay is unreliable — only purchase behavior is real. *(Source: 2026-05-05, 00:28:27.)*

## Audience and segmentation

- **What % of the target audience has actually tried a GLP-1 vs only heard stories about it?** The bullseye sample was 3-of-4 with some direct experience; the broader audience mix is unknown. A larger survey is planned. *(Source: 2026-05-05, 00:29:48; 2026-05-04 sync.)*
- **What is the "sweet spot" segment of older adults for this product, based on prior GLP-1 experience?** Screener needs revisiting. *(Source: 2026-05-04 sync.)*
- **What are the broader fears and concerns about GLP-1s across the audience?** Bullseye sample is too small. Large-scale survey + secondary research planned. *(Source: 2026-05-04 sync.)*

## Product architecture

- **Should the Weight Management App be a standalone product, or attached to the current Bold fitness product?** Architectural decision pending. *(Source: 2026-05-05 readout, 00:32:30.)*
- **Where does Bold's program overlap with the Bridge program, and how do we layer support features on top without duplication?** Owner: Chris Lloyd. *(Source: 2026-05-05 readout next steps.)*

## Content sourcing

- **How does Bold actually source the meal plans, recipes, and restaurant guidance that the convenience value prop depends on?** AI menu reading was floated (photo-of-menu → recommendations), but no plan yet. *(Source: 2026-05-05 readout, 00:33:46.)*
- **What clinical exercise spec preserves muscle and bone density for this population?** Need a clinical view on which exercises actually deliver the "lose fat, not strength" outcome. *(Source: 2026-05-05, 00:24:50.)*

## Marketing sequencing

- **Should "provider in the loop" be pulled higher than #6 in the value-prop hierarchy?** It wasn't tested standalone but reads as load-bearing for trust. *(Source: 2026-05-05, 00:26:06.)*
- **Should microdosing / tapering be elevated from a Concept 3 feature into a cross-concept GLP-1 entry philosophy?** Only 1/4 (Robin) showed unprompted enthusiasm, but the underlying anxiety it addresses — fear of long-term GLP-1 dependency and severe side effects — was nearly universal. Could reduce hesitancy earlier in the funnel. Worth A/B testing as messaging across all program tiers, not just one. *(Source: 2026-05-05 Dovetail bullseye report, insight #7; [[findings]] #29.)*
- **Should "Check My Coverage" be an interactive widget, not a CTA link?** 2/4 participants said it could drive plan-switching when surfaced clearly. Hypothesis: collecting plan info inline (vs. routing out to a form) converts better, but adds onboarding friction. Needs prototype test. *(Source: 2026-05-05 Dovetail bullseye report, insight #3; [[findings]] #26.)*

## Provider role design

- **Can a coach or nutritionist carry the motivational/accountability load as well as a physician?** Several participants framed the value of "someone who keeps me going" without requiring it to be an MD. Cheaper to staff, potentially more relatable. Needs validation before we commit to physician-only oversight in the program economics. *(Source: 2026-05-05 Dovetail bullseye report, insights #4, #10; [[findings]] #27.)*
- **How do we measurably explain lean-mass / body-comp tracking in one screen so the "how does it work?" question doesn't kill conversion?** All 3 participants who liked the feature immediately asked how it works. Removing the black-box is likely a conversion lever — but needs an actual measurement method first (see "Measurement strategy" above). *(Source: 2026-05-05 Dovetail bullseye report, insight #5; [[findings]] #28.)*

## Landing-page trust proof (from 2026-05-21 LP review)

- **What's the right member-count claim for the weight LP's proof module?** "Thousands" is below threshold and reads as suspiciously low; "hundreds of thousands" / "over 100,000" needs Zack/Chris validation against actual member numbers; the fitness-side "12M eligible" figure is *eligibility*, not members, and is a category error if surfaced as social proof. Owners: Zack Newick, Chris Lloyd. *(Source: 2026-05-21 LP review, 00:14:37; [[findings]] #38.)*
- **Should the "weight-loss pillars" module (Nutrition / Exercise / Habits / Older-adult strength) replace the current carousel permanently, or only ship as the AB-test variant?** Eliza/Tzu-Yi/Zack aligned on the layout being a better fit for the message; Chris's concern was that copy-only tests of the current carousel won't read a signal. Permanent vs variant is unresolved. *(Source: 2026-05-21 LP review, 00:18:07–00:21:30; [[findings]] #40.)*
- **Trustpilot pilot for the weight LP?** Chris floated funneling fitness-product users into Trustpilot so weight LP can show real consumer ratings. Owner: Zack. Not blocking the first AB test, but blocking a permanent proof-module redesign. *(Source: 2026-05-21 LP review, 00:14:37–00:15:47.)*
- **What's the minute count for the "long appointment" claim?** "Lean into appointment length" requires a real number. Needs confirmation from Clinic ops before it can ship. *(Source: 2026-05-21 LP review, 00:04:07; [[findings]] #33.)*

## Positioning transition (pre- → post-GLP-1)

- **When the Clinic launches GLP-1 prescribing in Q3 2026, how does the positioning rewrite?** The current "Bold doesn't default to prescribing another medication" / "We're not a place to get GLP-1s" lines must retire. Hypothesis: shift to *"Bold combines the medication that works with the 75% of your health that happens outside of it,"* but no validated language yet. Needs explicit rewrite before launch. *(Source: 2026-05-20 positioning doc; see [[positioning]] § Phasing.)*
- **Does the three-audience interim framing (on GLP-1s / curious / want to lose weight without) survive into the GLP-1 era, or collapse?** Working hypothesis: audience 1 + 2 collapse into "Bold-prescribed GLP-1 patients"; audience 3 stays as a parallel non-pharma track. Confirm with marketing/clinic teams. *(Source: 2026-05-20 positioning doc.)*

---

Related: [[findings]], [[decisions]], [[principles]], [[value-props]], [[positioning]]
