---
name: health-care-landing-page
description: Builds and reviews healthcare landing pages with best-in-class craft and a 65+ friendly lens. Use whenever the user asks to design, build, redesign, refactor, copy-edit, or review ANY healthcare landing page — including the Bold Clinic landing page (PrevMed/clinic_funnel), MSK landing pages, weight management marketing pages, or any standalone consumer-health landing page. Trigger on phrases like "landing page", "marketing page", "LP", "hero section", "above-the-fold", "value prop page", or any redesign of `00-lp.html` / similar. The skill pulls reference patterns from six benchmark healthcare landing PDFs (Midi, Hinge Health, Maven, Nourish, Omada, Talkspace) AND from Mobbin via MCP, then enforces older-adult usability rules so unfriendly design is caught before it ships.
---

# Healthcare Landing Page

You are designing or reviewing a healthcare landing page that will be seen by older adults (primary audience 65+, Medicare-eligible). The page must convert AND be effortless to read, understand, and act on for a senior user. Treat every landing-page task as production work.

This skill runs in three mandatory phases. Do not skip ahead.

---

## Phase 1 — Load reference material (ALWAYS, every invocation)

Before proposing layout, copy, or critique, you MUST gather references from BOTH sources in parallel.

### 1a. Read every benchmark PDF in this folder

Read all six PDFs using the Read tool, in parallel:

- `.claude/skills/health_care_landing_page/Midi.pdf` — menopause / women's health, 40+ audience, warm clinical tone
- `.claude/skills/health_care_landing_page/hinge health.pdf` — MSK / physical therapy, employer-benefit framing, outcome stats
- `.claude/skills/health_care_landing_page/maven health.pdf` — women's & family health, broad-program framing
- `.claude/skills/health_care_landing_page/nourish.pdf` — nutrition / RD telehealth, insurance-first conversion path
- `.claude/skills/health_care_landing_page/omada.pdf` — chronic-condition prevention, longest-running benchmark, strong proof-points pattern
- `.claude/skills/health_care_landing_page/talkspace.pdf` — mental health, consumer DTC + insurance hybrid

Extract for each: hero structure, primary CTA wording and placement, eligibility/insurance framing, social proof patterns, section ordering, density, and any obvious accessibility wins or misses for older readers.

If a Read fails on a PDF, retry with the `pages` parameter (e.g. `pages: "1-10"`). Never proceed with fewer than 4 of the 6 references loaded — tell the user if you can only load partial set.

### 1b. Pull live Mobbin references in parallel

In the SAME message as the PDF reads, call `mcp__mobbin__search_screens` to pull current real-world landing pages. Always run at least one web search; add an iOS search if the user's project includes a mobile landing or app intro.

Default queries to run in parallel (use `platform: "web"`, `mode: "deep"`, `limit: 8`):
1. A query matched to the product vertical the user is working on (e.g. "GLP-1 weight loss program landing page", "primary care clinic landing page", "telehealth Medicare landing page")
2. `"healthcare landing page hero section with insurance eligibility"`
3. `"healthcare onboarding landing page senior friendly"` — to surface large-type / high-contrast patterns

Pick the vertical query from the actual task. If unclear, ask the user one sentence: "What product is this landing page selling?" before searching.

Briefly summarize what you found from Mobbin (3–6 patterns observed) and cite app names + Mobbin URLs the tool returns.

---

## Phase 2 — Apply the 65+ landing-page rules

These are non-negotiable. A landing page that violates any of them must be flagged and fixed, even if it "looks nicer" without them.

### Typography & legibility
- Body copy ≥ 18px on desktop, ≥ 17px on mobile. Hero subhead ≥ 22px. Never use 14px or smaller for anything a user must read.
- Line-height ≥ 1.5 for body, ≥ 1.2 for headlines.
- Max line length 60–75 characters. Long, full-width body text is a fail.
- Avoid all-caps for anything longer than a 2-word label.
- Use the Bold design system fonts only (Inter via `design-system/tokens.css`). Never introduce a new typeface.

### Color & contrast (WCAG 2.2 AA minimum, AAA preferred for body)
- Text vs background contrast: ≥ 4.5:1 for body, ≥ 3:1 for large text. Prefer ≥ 7:1 for primary body copy.
- Never rely on color alone to signal state (error, success, selection).
- Don't place text directly on busy hero photography without a solid scrim or card.

### Targets & interaction
- Tap/click targets ≥ 44×44px (iOS HIG / WCAG 2.5.5). Buttons should feel oversized for a senior thumb — err generous.
- Primary CTA visible above the fold AND repeated after every major section. Older users scroll less than designers assume.
- Underline links inside body copy. Color-only links fail.
- Hover-only affordances are forbidden — every interactive element must be discoverable without hovering.

### Copy & cognitive load
- Plain language, 6th–8th grade reading level. No jargon ("MSK", "telehealth", "comorbidities") without a plain-English gloss the first time.
- Hero headline: one concrete benefit, not a brand slogan. The user must know what this is in 5 seconds.
- One primary CTA per section. No competing buttons of equal weight.
- Use specific numbers, not vague claims ("Members lose 8% body weight on average" beats "Real results").
- Insurance / eligibility / cost must be addressable within the first two scroll-depths. Hiding it is a senior trust killer.

### Structure
- Hero → social proof → "is this for me?" / eligibility → how it works (3 steps max) → outcomes/proof → safety/clinical credibility → FAQ → final CTA. Deviate only with a clear reason.
- No carousels for primary content. Seniors miss content in carousels.
- Sticky CTA on mobile after first scroll.
- Footer must include phone number, not just email/chat.

### Motion & media
- Respect `prefers-reduced-motion`. Auto-playing video must be mute, captioned, ≤ 10 s, and pausable with a visible control.
- Lottie / scroll-jacking effects are off by default for this audience.

---

## Phase 3 — Compose, critique, or redesign

### When BUILDING a new landing page

1. State which 2–3 PDF benchmarks most informed your structure and why (e.g. "Using Nourish's insurance-first eligibility band and Omada's proof-point row").
2. Reference the Bold design system: load `design-system/tokens.css`, `design-system/components.css`, and `design-system/index.html` before writing any markup. Use existing tokens and components; do not introduce new colors, fonts, or spacing values.
3. Write semantic HTML (`<header>`, `<main>`, `<section>`, `<h1>` once, proper heading hierarchy). Add `alt` text on every image. Add `aria-label` to icon-only buttons.
4. Self-audit against every rule in Phase 2 before reporting done. Output the audit as a checklist in your final message.

### When REVIEWING / REDESIGNING an existing landing page

1. Read the current page top-to-bottom in the browser preview if possible (`run` skill) — not just the source.
2. Produce a punch list grouped by severity:
   - **Blockers** — fails a Phase 2 rule. Must fix.
   - **High-impact** — measurably hurts senior conversion (e.g. CTA below fold, no insurance info, jargon hero).
   - **Polish** — craft / design-system fidelity.
3. For each blocker, cite the rule and propose a concrete fix with the design-system token or component to use.
4. Cross-reference at least two benchmark PDFs and one Mobbin pattern for any structural recommendation. Never recommend a structural change on taste alone.

---

## Tone

Be direct about what's unfriendly to a 65+ user. "This 14px gray-on-white footer text is unreadable for the target audience" beats "consider increasing the font size slightly." The whole point of this skill is to catch senior-unfriendly design easily — soft language defeats the purpose.

## When to also load other skills

- Always pair with `design-system-guardian` — it owns the token/component rules. This skill owns the landing-page-specific patterns and 65+ heuristics on top.
- If the landing page is for the Weight Management App, also load `weight-management-research` — research findings override generic patterns.
- If touching the Clinic funnel specifically, the work lives in `PrevMed/clinic_funnel/`.
