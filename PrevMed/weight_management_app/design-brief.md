# Weight Management App — Design Brief

**Status:** Working brief, 2026-05-20.
**Owner:** TBD.
**Source of truth:** [data/synthesis/](data/synthesis/) and the raw research in [data/raw/](data/raw/). This brief is a router — it does not duplicate evidence, it points to it.

---

## 1. Why this brief exists

Bold is shipping a **GLP-1 companion / prescription product in Q3 2026** as the top-of-funnel demand driver for the broader weight management offering ([decisions.md, 2026-05-04](data/synthesis/decisions.md)). **Medicare begins subsidizing GLP-1s in July 2026** ([decisions.md, market context](data/synthesis/decisions.md)) — a meaningful demand spike is expected to land on the same launch window.

The bullseye research wave (4 interviews, 2026-05-05 readout) is complete. Six winning value props, twelve design principles, and a price anchor of $50/mo have been validated against the wedge audience. Three prototype directions are on the table (Companion / Body Composition / Daily Decision Helper).

What is missing — and what this brief provides — is a clear, shared **audience model** so the prototype work designs *for someone*, not for a generic "older adult on GLP-1." Without that, every screen drifts toward the average of the bullseye sample and loses its edge.

**This brief intentionally does NOT pick which prototype direction to build.** Direction selection is the next decision, informed by this brief.

---

## 2. Who we're designing for

Two working-hypothesis personas — see [personas.md](data/synthesis/personas.md) for the full evidence:

- **Tried-and-Burned** — has GLP-1 experience that went poorly (side effects, weak results, surprise cost). Dominant emotion: **skepticism**. Needs a credibly *different* path back.
- **Curious-but-Wary** — never tried a GLP-1; has heard both success and horror stories. Dominant emotion: **caution**. Needs trust scaffolding to start safely.

**These are working hypotheses, not validated personas.** The n=4 sample is too thin for demographic confidence ([personas.md → honesty section](data/synthesis/personas.md), [open-questions.md → Audience and segmentation](data/synthesis/open-questions.md)). They are good enough to target prototypes; they are not good enough to anchor brand strategy or marketing copy at scale.

### Universal constants — true for both personas

Both personas share these. Every prototype must respect them regardless of which persona it targets:

- Pill > pen >> injection >> compounded vial. ([findings #2](data/synthesis/findings.md))
- Guidance, not tracking. Help **before** the decision, not after. ([principles #1–2](data/synthesis/principles.md))
- Real person for accountability + side-effect management — **not** chat coaching. ([principles #6](data/synthesis/principles.md))
- FDA approval matters but triggers cost anxiety; **pair them**. ([principles #5](data/synthesis/principles.md))
- Body composition (lean mass, bone density) is the differentiator, not scale weight. ([principles #3](data/synthesis/principles.md))
- Older-adult-appropriate by default. Standing tolerance can be under 5 minutes. ([principles #7](data/synthesis/principles.md))
- No wearables, no extra devices. ([principles #8](data/synthesis/principles.md))
- $50/month, tied to Medicare coverage, surfaced early. ([principles #11](data/synthesis/principles.md))

---

## 3. The problem we're solving (jobs-to-be-done)

**For Tried-and-Burned:**
> *"Help me get back on a GLP-1 in a way that doesn't repeat what went wrong last time — better form factor, real side-effect support, and proof I'm protecting muscle and bone, not just dropping scale weight."*
> Anchor: *"Last year I did GLP1 uh semicluide for like six weeks. It was the worst experience of my life… Cost me $400 to lose seven pounds and I felt effects."* ([2026-05-05 transcript, 00:12:29](data/raw/Weight%20Management%20Research%20Readout%20-%202026_05_05%2014_29%20PDT%20-%20Notes%20by%20Gemini.pdf))

**For Curious-but-Wary:**
> *"Help me start a GLP-1 safely without the needles, the side-effect stories, or the surprise cost I'm afraid of — and reassure me this is appropriate for someone my age."*
> Anchor: *"I mean, much easier to do the pill for me because I'm definitely afraid of shots."* ([2026-05-05 transcript, 00:13:23](data/raw/Weight%20Management%20Research%20Readout%20-%202026_05_05%2014_29%20PDT%20-%20Notes%20by%20Gemini.pdf))

Both jobs are real. The prototypes will test which job, which job-stage, and which surface the program serves best.

---

## 4. What we know works — the six value propositions

In priority order from [value-props.md](data/synthesis/value-props.md). Each is one line here — the source has the detail.

1. **FDA-approved GLP-1 options that fit your life, covered by Medicare.** The first decision gate.
2. **Lose fat, not strength.** The marketing core — connects GLP-1s, aging, body composition, exercise.
3. **Body composition tracking made easy.** Lean mass + bone density, not metabolic-health labs.
4. **Older-adult-specific strength and balance plan.** Seated options, balance-safe, joint-friendly.
5. **Convenient diet guidance — not another logging app.** Help before the meal, not after.
6. **Provider in the loop — for safety, not for chat.** Side effects, dosage, accountability. Not coaching.

The prototype must visibly embody at least props **1, 2, and one of {3, 4, 5}** to be credible to either persona.

---

## 5. Design principles to enforce

Full list in [principles.md](data/synthesis/principles.md). The twelve in one-line form:

1. Guidance, not tracking.
2. Help before the decision, not after.
3. Lose fat, not strength — body composition over scale weight.
4. Pill-first; never make a needle the hero.
5. Trust signals must be paired (FDA + cost/coverage together).
6. Provider as safety net, not coach.
7. Older-adult-specific by default — no generic fitness aesthetics.
8. No wearables, no extra devices.
9. Non-restrictive eating frame — add, don't remove.
10. Convenience for how this audience actually eats (takeout, delivery, prepared).
11. Cost is a feature, not a footnote.
12. Body-composition tracking must feel light.

If a design choice violates one of these, flag it before shipping — these are non-negotiable for prototype credibility.

---

## 6. Anti-patterns to refuse

From [findings.md, "What to avoid"](data/synthesis/findings.md):

- Vial or needle as the hero image.
- Leading with compounded medication.
- "GLP-1 access" framing without immediately clarifying cost, coverage, safety, oversight.
- Treating "FDA-approved" as a pure trust signal — it also triggers cost/coverage anxiety.
- Generic habit tracking as a primary feature.
- Step counters, sleep trackers, or anything implying a wearable is required.
- Generic-looking exercise imagery that doesn't read as older-adult-appropriate.
- Overstating coaching/oversight to the point it feels like surveillance.
- Asking users to manually log food or exercise.

A prototype that contains any of these in its primary surfaces should be sent back, not shipped to a test session.

---

## 7. Goals for the prototype phase

What the prototype work is trying to accomplish:

1. **Test direction-persona fit.** Run each of the three candidate directions (Companion / Body Composition / Daily Decision Helper) against both personas. Surface which direction each persona responds to most strongly.
2. **Validate the $50/mo positioning against a richer audience** than the bullseye. Watch for stated-vs-real willingness to pay; only purchase signal is real ([findings #19](data/synthesis/findings.md)).
3. **Surface measurement-strategy preference** for body composition. Without burdening the prototype with a real device, learn whether users accept DEXA / smart scale / photo / labs as the "how we know" answer ([open-questions.md → Measurement strategy](data/synthesis/open-questions.md)).
4. **Pressure-test the "earn first trust" sequence** for Curious-but-Wary. Does FDA + coverage + provider-as-safety-net in the first two screens unlock willingness to consider?
5. **Pressure-test the "credibly different" claim** for Tried-and-Burned. What does the prototype need to show in the first 30 seconds for them not to bounce?

---

## 8. Non-goals

Things this brief, and the prototypes it spawns, are explicitly **not** trying to settle:

- Picking a final product architecture (standalone vs. attached to Bold fitness — [open-questions.md → Product architecture](data/synthesis/open-questions.md)).
- Resolving Bridge-program overlap (owner: Chris Lloyd, [decisions.md → next-step owners](data/synthesis/decisions.md)).
- Locking the body-composition measurement strategy.
- Designing the marketing site or paid-acquisition flow.
- Settling the marketing sequencing of provider-in-the-loop ([open-questions.md → Marketing sequencing](data/synthesis/open-questions.md)).

---

## 9. Success criteria

We will know the prototype work landed when, across the next research wave, we can answer:

- **Which persona showed up?** Which of the two archetypes did the participant resemble, and was the prototype designed for them?
- **Which value prop did they cite as the reason?** Did they name a prop from the list of six, or invent a new one? (New-prop signal = a finding we missed.)
- **What did they push back on?** Specifically — what felt like surveillance, what felt like generic fitness, what felt like an unrealistic measurement ask.
- **Did they say they would pay $50/mo?** And: would they walk through a sign-up flow if it were live? (Stated WTP is unreliable; behavioral intent is the better proxy.)
- **Did the form-factor choice land?** Did pill-first feel like the right default, or did some users want pen-first surfaced earlier?

If we cannot answer these from the prototype session, the prototype was too vague.

---

## 10. Prerequisites we are deferring (and acknowledging)

These are real prerequisites for graduating from prototype to product. They are explicitly out of scope for this brief — they are work the team owes itself before scaling.

- **Larger GLP-1 survey + secondary research** to map fears/concerns across the broader audience ([decisions.md, 2026-05-04](data/synthesis/decisions.md), [open-questions.md → Audience and segmentation](data/synthesis/open-questions.md)).
- **Screener redesign** to segment older adults by prior GLP-1 experience.
- **Measurement-strategy decision** — DEXA / smart scale / photo / lab — with a one-sentence explainability bar ([open-questions.md → Measurement strategy](data/synthesis/open-questions.md)).
- **Clinical exercise spec** that delivers "lose fat, not strength" for this population ([open-questions.md → Content sourcing](data/synthesis/open-questions.md)).

The personas in this brief should be re-evaluated as soon as the larger survey lands. If the survey contradicts the bullseye sample, this brief is the first thing to update.

---

## 11. Open questions for the team

Decisions this brief is asking the team to make next, in rough priority:

1. **Which prototype direction first?** Companion / Body Composition / Daily Decision Helper. Recommend choosing one as the spine and folding the highest-leverage elements of the other two in.
2. **Which persona does the first prototype lead with?** Tried-and-Burned (re-earn trust) is the harder design but the more defensible business case; Curious-but-Wary (earn first trust) is the broader population but a softer pitch.
3. **Standalone product or extension of Bold fitness?** Architectural decision that changes onboarding, billing, and engagement loops ([open-questions.md → Product architecture](data/synthesis/open-questions.md)).
4. **Provider-in-the-loop sequencing** — does it stay at #6 in the value-prop stack, or does it move forward for trust-load reasons? ([open-questions.md → Marketing sequencing](data/synthesis/open-questions.md)).

---

Related: [personas.md](data/synthesis/personas.md), [findings.md](data/synthesis/findings.md), [decisions.md](data/synthesis/decisions.md), [principles.md](data/synthesis/principles.md), [value-props.md](data/synthesis/value-props.md), [open-questions.md](data/synthesis/open-questions.md).
