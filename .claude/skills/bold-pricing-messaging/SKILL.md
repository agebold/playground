---
name: bold-pricing-messaging
description: The authoritative source for how Bold writes about appointment cost and insurance coverage for Bold Clinic / Bold Care healthy aging appointments. Use this skill WHENEVER you draft, edit, or review ANY copy that mentions what a Bold visit costs, insurance, Medicare or Medicare Advantage, coverage, in-network status, $0 / out-of-pocket, copays, coinsurance, deductibles, or the Care Coordinator — on landing pages, onboarding/insurance-verification flows, ads, emails, push, help text, or scripts. Trigger even on small asks like "add a pricing line to the hero", "write the insurance step", "what's our cost language", or "is this copy compliant?" — because these stats are legally constrained and must match the approved language exactly. Do NOT use this for GLP-1 medication or weight-management program pricing ($50/mo) — that is a separate model.
---

# Bold Pricing & Insurance Messaging

You are writing or reviewing copy about **what a Bold appointment costs and how insurance covers it.** This is legally and brand-sensitive territory: the numbers and phrasings here are approved language, and deviating from them can create compliance and trust problems. Your job is to make every cost/insurance line match the approved messaging exactly — and to catch and fix any copy that doesn't.

The full approved memo is in [references/pricing-positioning-memo.md](references/pricing-positioning-memo.md). Read it when you need the complete per-plan copy, the detailed/onboarding messaging, or the Care Coordinator script. This SKILL.md is the operating layer — the rules and the copy bank you'll reach for most.

## The one number that matters: 78%

**78% of Bold patients pay $0 out of pocket.** This is the current authoritative figure.

> The original memo said **86%**. It was corrected to **78%** on 2026-06-26. Treat **86% as stale** — if you see it in any existing copy, screenshot, or draft, replace it with 78%. Never publish 86%.

## Scope — what this skill covers (and what it does NOT)

This skill governs the cost of a **Bold Clinic / Bold Care healthy aging appointment** (a 45-minute virtual visit with a board-certified healthy aging provider) and how insurance applies to it.

It does **not** govern **GLP-1 medication pricing or the weight-management program** ($50/mo, modeled on Bridge). That is a separate pricing model with its own logic — don't mix the two. If a member-facing surface combines a healthy-aging appointment and a GLP-1 program, price each in its own voice and flag the seam.

## Non-negotiable rules

These come straight from the memo's internal guidelines. They are the things most likely to go wrong, so check copy against them every time.

1. **Never say "free."** Legally not allowed. Use **"$0 out of pocket"** instead. No exceptions, including ads and headlines.
2. **Always pair "$0 out of pocket" with the stat.** On any site/marketing surface, "$0 out of pocket" must appear alongside **"78% of Bold patients."** A bare "$0" implies everyone pays nothing, which isn't true. Where the copy targets a specific plan, use a plan-specific framing if available rather than the blended 78%.
3. **Hyphenate "out-of-pocket" only when it modifies a noun.** *out-of-pocket **cost*** (hyphens) vs. *patients pay $0 **out of pocket*** (no hyphens).
4. **Attribute coverage to the appointment or the provider — never to the company.** Say **"appointments are covered by Medicare"** or **"providers are in-network with United."** Do **not** say "Bold is covered."
5. **Don't itemize what each plan pays on public/marketing surfaces.** Lead with "78% of members pay $0 out of pocket." Specific dollar estimates belong in onboarding (for $0-confirmed plans) or on a Care Coordinator call — not the website body.
6. **Coverage is conditional and confirmed, not guaranteed.** Frame cost as *estimated*, confirmed during signup or by a Care Coordinator, with no surprises. Don't promise a flat price sight-unseen.

## Approved copy bank (use these verbatim or lightly adapted)

**Headline / hero:**
- Take control over how you age. Provider visits covered by Medicare.
- 78% of Bold patients pay $0 out of pocket.

**Ads — approved cost language (these are pre-cleared):**
- Most Bold patients pay $0 out of pocket.
- $0 out of pocket, for most patients.
- 78% of Bold patients pay $0 out of pocket. *(or "…per visit.")*
- Healthy aging appointments, covered by Medicare.
- Take control over how you age, covered by Medicare.
- In-network with Medicare, UnitedHealthcare, Aetna, Anthem, Blue Cross Blue Shield plans and more.

**Coverage phrasing:**
- *Short (headlines, subject lines):* "appointments covered by Medicare"
- *Body / help text:* "in-network with Medicare plans and eligible Aetna, Anthem, Blue Cross Blue Shield, UnitedHealthcare, and more"

**For those who do pay:** "the average out-of-pocket cost per appointment ranges from $5 to $55" — driven by plan, appointment type, location, and supplemental (Medigap) or secondary (employer/spouse) coverage.

## Per-plan out-of-pocket estimates (onboarding cost step)

Always state the range **and** the 78% stat together. Full per-plan copy is in the reference memo.

| Plan | Estimated out-of-pocket (covered visit) |
| --- | --- |
| UnitedHealthcare | $0 copay visits for in-network virtual appointments |
| Blue Cross Blue Shield | $0–$25 |
| Medicare | $0–$35 |
| Aetna | $0–$55 |
| Wellpoint | $0–$25 |
| Other / general | $0–$55 |

For plans **not** in network: "Bold is actively working to participate with Medicare Advantage plans nationwide to provide covered healthy aging appointments."

## The Care Coordinator is the safety net, not a cost wall

Cost copy should resolve uncertainty toward a person, not a number. The Care Coordinator handles billing directly, confirms coverage, and makes sure there are "no surprises." When in doubt on a member-facing surface, route to the Care Coordinator rather than over-specifying dollars.

Two member buckets the Coordinator distinguishes (useful when copy must explain *why* cost varies):
- **Original Medicare (Part A+B):** red/white/blue card, no private insurer card; costs are typically **coinsurance** (% based).
- **Medicare Advantage (Part C):** private insurer card; still Medicare, run by a private insurer; costs are typically **copays** (fixed $).
Then supplemental/secondary coverage (Medigap, employer, spouse) often covers the rest.

## "Direct provider booking" is a future state

The memo carries separate "WHEN DIRECT PROVIDER BOOKING IS LIVE" variants. Today's flow is: sign up → Bold reviews/confirms insurance → cost estimate communicated (in-flow for $0-confirmed plans, or by Care Coordinator call) → visit confirmed. Don't write copy that assumes instant self-serve booking with an upfront price unless the user tells you direct booking is live.

## Before you ship — quick lint

Run any cost/insurance copy through this:
- [ ] No "free" anywhere.
- [ ] Every "$0 out of pocket" is paired with "78% of Bold patients" (and 86% appears nowhere).
- [ ] "out-of-pocket" hyphenated only when it modifies a noun.
- [ ] Coverage attributed to appointments/providers, not "Bold."
- [ ] No per-plan payment breakdowns on public surfaces; dollar specifics deferred to onboarding or Care Coordinator.
- [ ] Cost framed as estimated/confirmed with no surprises, not guaranteed.
- [ ] Plan names spelled per the approved list (UnitedHealthcare, Aetna, Anthem, Blue Cross Blue Shield, Wellpoint, Medicare).
- [ ] This is appointment pricing, not the GLP-1/weight-management $50/mo model.
