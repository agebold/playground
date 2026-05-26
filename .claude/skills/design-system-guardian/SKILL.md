---
name: design-system-guardian
description: Strictly enforces the Age Bold design system (hosted Storybook + private GitHub source), accessibility (WCAG 2.2 AA), and world-class design craft for any web or responsive UI work. Use this skill whenever the user asks to build, edit, style, refactor, or review ANY frontend component, page, layout, form, or markup — even casual requests like "make this look nicer", "add a button", "build a card", "fix this CSS", or "create a settings page". Trigger on any mention of HTML, CSS, JSX/TSX, Tailwind, components, styling, layouts, responsive design, accessibility, or visual polish. Do NOT skip this skill just because the request seems small — every UI change must pass through the design system rules.
---

# Design System Guardian

You are working as a world-class product designer-engineer on a web + mobile-responsive product for an audience that includes older adults. Design quality, accessibility, and design-system fidelity are non-negotiable. Treat every UI task — no matter how small — as production work that will ship to real users.

## Step 0 — Always consult the up-to-date design system first

The design system is the **Age Bold component library**, internal package `@bold/web` (v0.3.0). It has two live faces — never read a stale local snapshot, always fetch fresh:

1. **Hosted Storybook** (no auth, auto-deployed from `master`): https://staging-ui.agebold.com/
2. **Source code** (private GitHub, requires `gh` auth): https://github.com/agebold/agebold-web

The hosted Storybook auto-rebuilds whenever `agebold/agebold-web` updates — so the URL always reflects the current design system. Do **not** cache, snapshot, or recreate any of this locally.

### Repo layout (`agebold/agebold-web`, branch `master`)

```
packages/
├── web/                                  ← @bold/web — the component library
│   └── src/
│       ├── components/<Name>/            ← 129 components
│       │   ├── <Name>.tsx                ← component implementation
│       │   ├── <Name>.module.scss        ← scoped styles
│       │   ├── <Name>.test.tsx           ← tests
│       │   └── index.ts                  ← re-exports
│       └── styles/
│           ├── _variables.scss           ← design tokens (colors, spacing, type, breakpoints)
│           ├── _mixins.scss, _animations.scss, _functions.scss, ...
│           └── constants.ts              ← token constants in TypeScript
└── web-ui/                               ← Storybook host (separate Next.js app)
    └── src/stories/<Name>.stories.tsx    ← story files (one per component)
```

### Step 0a — Discover what exists (hosted Storybook catalog)

Always start by fetching the live catalog. WebFetch:

```
https://staging-ui.agebold.com/index.json
```

The response has an `entries` map. Each entry has `title` (e.g. `Forms/Formik/FieldFormik`), `id` (e.g. `forms-formik-fieldformik--default`), `name`, `importPath`, and for stories also a `componentPath`. Use this to:

- Confirm whether a component already exists for what you need
- Get the canonical component name and category — match these exactly
- Locate the story file path

To view a story rendered in a browser (share with the user for visual reference):

```
https://staging-ui.agebold.com/?path=/story/<story-id>
https://staging-ui.agebold.com/?path=/docs/<title-slug>--docs
```

Example: `https://staging-ui.agebold.com/?path=/story/forms-formik-fieldformik--default`

### Step 0b — Read the actual source code (`gh api`)

For real implementation (JSX, props, styles, tokens), read source from GitHub. Use **`gh api` via Bash, not `WebFetch`** — the repo is private and WebFetch can't pass auth.

```bash
# Read a component implementation (always master HEAD)
gh api -H "Accept: application/vnd.github.raw" \
  "/repos/agebold/agebold-web/contents/packages/web/src/components/Button/Button.tsx"

# Read its scoped styles
gh api -H "Accept: application/vnd.github.raw" \
  "/repos/agebold/agebold-web/contents/packages/web/src/components/Button/Button.module.scss"

# Read the tokens
gh api -H "Accept: application/vnd.github.raw" \
  "/repos/agebold/agebold-web/contents/packages/web/src/styles/_variables.scss"

# Read TS token constants
gh api -H "Accept: application/vnd.github.raw" \
  "/repos/agebold/agebold-web/contents/packages/web/src/styles/constants.ts"

# Read the story file (best source of usage examples)
gh api -H "Accept: application/vnd.github.raw" \
  "/repos/agebold/agebold-web/contents/packages/web-ui/src/stories/Button.stories.tsx"

# List a directory
gh api "/repos/agebold/agebold-web/contents/packages/web/src/components" \
  --jq '.[].name'
```

These hit `master` HEAD — no snapshot, always fresh.

**If `gh api` returns 404 on `agebold/agebold-web`**, the CLI auth identity doesn't have access. Run:

```bash
gh api user --jq '.login'
```

If the login is not the Age Bold work account (which has access to the `agebold` org), stop and tell the user: *"My `gh` CLI is logged in as `<login>`, which doesn't have access to `agebold/agebold-web`. Run `gh auth logout`, then `gh auth login` with the GitHub account that has access (the one your browser is logged into when you open the repo), then re-run."* Do not fall back to inventing tokens or component shapes.

### Step 0c — How prototypes in `/playground` consume the design system

The `/playground` prototypes (`check-ins/`, `pain-scale/`, `MSK-ACCESS/`, `weight-clinic-sprint/`, etc.) are **independent Vite + React apps**. They do **not** install `@bold/web` today — it's a private monorepo workspace, not a published package. The pattern is:

1. **Browse** the hosted Storybook (Step 0a) to find the right component.
2. **Read** its source from GitHub (Step 0b): the `.tsx`, its `.module.scss`, the story file, and the relevant tokens from `_variables.scss` / `constants.ts`.
3. **Hand-implement** in the prototype to match — same component name, same prop API, same visual output, same a11y behavior.

Hand-implementation rules:

- **Use the same component name** as in the Storybook (e.g. `FieldFormik`, not your own `EmailInput`).
- **Preserve prop names and types exactly** so a future `npm install @bold/web` migration is a near-mechanical import swap.
- **Translate SCSS tokens to CSS variables or Tailwind values** in the prototype, but the *values* must match what `_variables.scss` defines. Don't introduce ad-hoc colors, spacing, or type sizes.
- **Match component anatomy** (DOM structure, ARIA attributes, focus order) — don't simplify away accessibility behavior the original has.

This is a temporary pattern. When either (a) `@bold/web` becomes installable from a registry/workspace, or (b) `/playground` joins the monorepo, the workflow flips to direct import and most of this hand-implementation guidance disappears.

### What NOT to do

- **Do not** read `design-system/` in this repo as a source of truth. Anything there is legacy CSS preserved for historical reference only — it is **not** authoritative. Treat it as you would a screenshot.
- **Do not** treat any `logo/` directory (e.g. `vision/logo/`) as a design system source.
- **Do not** invent props or rename props. Names come from `@bold/web` source.
- **Do not** introduce components that don't exist in the Storybook without flagging it first. If something is missing, surface it.

After consulting, state in one or two sentences which Storybook component(s) and tokens you'll be using, with the story URL. This proves you actually looked.

## Hard rules — never violate

These are absolute. If a user request would force you to break one, stop and flag it instead of complying silently.

1. **No font size below 14px.** Ever. Not for captions, not for footnotes, not for legal text, not for badges. 14px is the floor. Default body is 16px or larger. Senior users especially need this.
2. **Use design tokens only.** No hardcoded hex colors, no magic pixel values for spacing, no one-off font sizes. Token values come from `packages/web/src/styles/_variables.scss` and `constants.ts`. If a token doesn't exist for what you need, stop and ask — don't invent one inline.
3. **No inline styles** unless dynamically computed at runtime (e.g., a progress bar width). Styling belongs in CSS/utility classes tied to the system.
4. **Semantic HTML first.** `<button>` for buttons, `<a>` for navigation, `<label>` for inputs, `<nav>`/`<main>`/`<header>`/`<footer>` for landmarks. Never `<div onClick>` for an interactive control.
5. **Every interactive element has a visible focus state.** Never `outline: none` without an equally visible replacement.
6. **Color is never the only signal.** Errors, required fields, status — always pair color with text, icon, or shape.
7. **Touch targets ≥ 44×44px** on any device. This is a hard minimum, not an aspiration.

If a hard rule conflicts with `@bold/web` source, the source wins — surface the conflict to the user.

## Accessibility — WCAG 2.2 AA, enforced

Every component you produce must satisfy these before you call it done:

- **Contrast:** body text ≥ 4.5:1, large text (≥18px or ≥14px bold) ≥ 3:1, UI components and graphics ≥ 3:1. Verify against the actual token values, don't eyeball.
- **Keyboard:** every interactive element reachable by Tab, operable by Enter/Space, escapable from modals/menus by Esc. Logical tab order. No keyboard traps.
- **Focus visible:** clear, high-contrast focus ring on every focusable element.
- **Labels:** every input has a programmatically associated `<label>`. Placeholder is not a label.
- **Errors:** announced via `aria-describedby` or `aria-live`, with text + icon, never color alone. Tell users *what* is wrong and *how* to fix it.
- **Images:** meaningful images get `alt`; decorative images get `alt=""`.
- **Headings:** one `<h1>` per page, no skipped levels.
- **Motion:** respect `prefers-reduced-motion`. No essential information conveyed only via animation.
- **Zoom:** layout must survive 200% browser zoom and 400% reflow without loss of content.
- **ARIA:** prefer native HTML. Only add ARIA when no native equivalent exists. No ARIA is better than wrong ARIA.

## Responsive — web + mobile

- Mobile-first. Build the small-screen layout first, then enhance upward at breakpoints from the design system (`_variables.scss`).
- Use the design system's breakpoint tokens. Do not invent breakpoints.
- Test mentally at 320px width (smallest realistic phone), tablet, and desktop.
- Use relative units (`rem`, `%`, `clamp()`, `fr`, `minmax`) over fixed pixels for layout. Pixels are fine for borders and small fixed elements.
- Tap targets stay ≥44×44px on touch devices regardless of screen size.

## Design detail — the "world's best designer" bar

A working component is not a finished component. Before declaring done, sweat these:

- **Spacing rhythm:** spacing follows the system's scale. No off-grid values.
- **Alignment:** elements align to a shared grid or baseline. Optical alignment over mathematical when they differ (e.g., icons inside buttons).
- **Hierarchy:** clear primary, secondary, tertiary. One primary action per view. Type scale, weight, and color all reinforce hierarchy.
- **All states designed:** default, hover, focus, active, disabled, loading, empty, error, success. Don't ship a component missing any of these.
- **Edge cases:** longest plausible string, shortest, zero items, one item, many items, slow network, offline, RTL if relevant.
- **Microcopy:** clear, concrete, human. No "Submit" when "Save changes" is truthful. No "Oops!" for serious errors.
- **Motion:** purposeful, fast (150–250ms for most UI), eased, and reduced when the user prefers.
- **Density:** generous whitespace. Crowded UIs fail older users first.
- **Consistency:** if a similar pattern exists in `@bold/web`, reuse it. Do not introduce a second way to do the same thing.

## Workflow for every UI task

1. **Discover** via the hosted Storybook catalog (`GET https://staging-ui.agebold.com/index.json`). Identify which existing component(s) cover the request.
2. **Read source** via `gh api` for the picked component(s) (`.tsx`, `.module.scss`, story file) and any tokens referenced.
3. **Restate** the request in one sentence and name the components and tokens you'll use. Include the story URL.
4. **Implement** in the prototype, hand-translating from the source to match exactly. Mobile-first, semantic HTML, accessible patterns, same prop names as `@bold/web`.
5. **Self-review** against the pre-flight checklist below.
6. **Report** what you built, which Storybook components/tokens informed it, the story URL(s) for human reference, and anything you had to flag.

## Pre-flight checklist — run before declaring done

Walk through every item. If any answer is "no" or "unsure", fix it or surface it.

- [ ] I fetched the live hosted Storybook catalog (`/index.json`) and read source via `gh api` this session
- [ ] No font size is below 14px
- [ ] All colors, spacing, radii, shadows come from tokens that exist in `_variables.scss` / `constants.ts`
- [ ] No inline styles (except runtime-computed values)
- [ ] Semantic HTML throughout; no `<div>` masquerading as a button or link
- [ ] Every interactive element has a visible focus state
- [ ] Every input has a real `<label>`
- [ ] Color is never the sole signal for state or meaning
- [ ] Contrast meets WCAG 2.2 AA for text and UI components
- [ ] Touch targets ≥ 44×44px
- [ ] Keyboard fully operable; tab order is logical
- [ ] Layout works at 320px, tablet, and desktop
- [ ] `prefers-reduced-motion` respected
- [ ] All component states present (default/hover/focus/active/disabled/loading/empty/error)
- [ ] Microcopy is clear, specific, and human
- [ ] Component name and prop names match `@bold/web` source exactly
- [ ] No new pattern introduced where an existing Storybook component would do

## Anti-patterns — refuse these

If the user asks for one of these, push back briefly and offer the right alternative:

- `font-size: 12px` (or any value < 14px)
- Hardcoded hex colors like `#3B82F6` instead of a token
- `<div onClick={...}>` for interactive controls
- `outline: none` with no replacement focus style
- Placeholder text used as the only label
- Red-only error states with no icon or text
- Fixed-pixel layouts that break under zoom
- Adding a new button/card/input variant when one already exists in `@bold/web`
- Renaming `@bold/web` props (e.g. calling `label` "title") in a hand-implementation
- "I'll add ARIA to fix it" as a substitute for using the right HTML element

## When to stop and ask the user

- The hosted Storybook is unreachable or `index.json` doesn't load
- `gh api` on `agebold/agebold-web` returns 404 (auth identity needs `gh auth login` with the agebold-org account)
- No matching component exists in the Storybook for what's being asked — confirm whether to propose adding one upstream (in `agebold/agebold-web`) or to hand-roll a one-off in the prototype
- A required token doesn't exist
- The request would force a hard-rule violation
- An existing component almost fits but not quite — confirm whether to extend it (upstream) or to compose existing ones differently
- Accessibility and the visual request are in genuine tension

Surface these as short, specific questions. Don't bury them at the end of a long response.
