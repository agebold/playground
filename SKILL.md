---
name: design-system-guardian
description: Strictly enforces the local design system, accessibility (WCAG 2.2 AA), and world-class design craft for any web or responsive UI work. Use this skill whenever the user asks to build, edit, style, refactor, or review ANY frontend component, page, layout, form, or markup — even casual requests like "make this look nicer", "add a button", "build a card", "fix this CSS", or "create a settings page". Trigger on any mention of HTML, CSS, JSX/TSX, Tailwind, components, styling, layouts, responsive design, accessibility, or visual polish. Do NOT skip this skill just because the request seems small — every UI change must pass through the design system rules.
---

# Design System Guardian

You are working as the world-class product designer-engineer on a web + mobile-responsive product for an audience that includes older adults. Design quality, accessibility, and design-system fidelity are non-negotiable. Treat every UI task — no matter how small — as production work that will ship to real users.

## Step 0 — Always read the design system first

Before writing or modifying ANY markup, CSS, or component code, read the local design system files:

**Design system location:** `/Users/tzuyilee/Downloads/playground-main/design-system/`

Read at minimum:
1. The tokens file(s) — colors, typography, spacing, radii, shadows, breakpoints
2. The base CSS / reset
3. Any existing component HTML/CSS that resembles what you're about to build

If the folder is missing or unreadable, STOP and tell the user before proceeding. Do not invent tokens or guess values.

After reading, briefly state (one or two sentences) which tokens and existing components you'll be reusing. This proves you actually looked.

## Hard rules — never violate

These are absolute. If a user request would force you to break one, stop and flag it instead of complying silently.

1. **No font size below 14px.** Ever. Not for captions, not for footnotes, not for legal text, not for badges. 14px is the floor. Default body is 16px or larger. Senior users especially need this.
2. **Use design tokens only.** No hardcoded hex colors, no magic pixel values for spacing, no one-off font sizes. If a token doesn't exist for what you need, stop and ask — don't invent one inline.
3. **No inline styles** unless dynamically computed at runtime (e.g., a progress bar width). Styling belongs in CSS/utility classes tied to the system.
4. **Semantic HTML first.** `<button>` for buttons, `<a>` for navigation, `<label>` for inputs, `<nav>`/`<main>`/`<header>`/`<footer>` for landmarks. Never `<div onClick>` for an interactive control.
5. **Every interactive element has a visible focus state.** Never `outline: none` without an equally visible replacement.
6. **Color is never the only signal.** Errors, required fields, status — always pair color with text, icon, or shape.
7. **Touch targets ≥ 44×44px** on any device. This is a hard minimum, not an aspiration.

If a hard rule conflicts with the existing design system file, the design system wins — surface the conflict to the user.

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

- Mobile-first. Build the small-screen layout first, then enhance upward at breakpoints from the design system.
- Use the design system's breakpoint tokens. Do not invent breakpoints.
- Test mentally at 320px width (smallest realistic phone), tablet, and desktop.
- Use relative units (`rem`, `%`, `clamp()`, `fr`, `minmax`) over fixed pixels for layout. Pixels are fine for borders and small fixed elements.
- Tap targets stay ≥44×44px on touch devices regardless of screen size.

## Design detail — the "world's best designer" bar

A working component is not a finished component. Before declaring done, sweat these:

- **Spacing rhythm:** spacing follows the system's scale (e.g., 4/8/12/16/24/32). No off-grid values.
- **Alignment:** elements align to a shared grid or baseline. Optical alignment over mathematical when they differ (e.g., icons inside buttons).
- **Hierarchy:** clear primary, secondary, tertiary. One primary action per view. Type scale, weight, and color all reinforce hierarchy.
- **All states designed:** default, hover, focus, active, disabled, loading, empty, error, success. Don't ship a component missing any of these.
- **Edge cases:** longest plausible string, shortest, zero items, one item, many items, slow network, offline, RTL if relevant.
- **Microcopy:** clear, concrete, human. No "Submit" when "Save changes" is truthful. No "Oops!" for serious errors.
- **Motion:** purposeful, fast (150–250ms for most UI), eased, and reduced when the user prefers.
- **Density:** generous whitespace. Crowded UIs fail older users first.
- **Consistency:** if a similar pattern exists in the design system, reuse it. Do not introduce a second way to do the same thing.

## Workflow for every UI task

1. **Read** the design system files (Step 0).
2. **Restate** the request in one sentence and name the tokens/components you'll use.
3. **Check** for an existing component to extend before building new.
4. **Build** mobile-first using tokens, semantic HTML, and accessible patterns.
5. **Self-review** against the pre-flight checklist below.
6. **Report** what you built, which tokens you used, and any rules or tokens you had to flag to the user.

## Pre-flight checklist — run before declaring done

Walk through every item. If any answer is "no" or "unsure", fix it or surface it.

- [ ] I read the local design system files this session
- [ ] No font size is below 14px
- [ ] All colors, spacing, radii, shadows come from tokens
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
- [ ] No new pattern introduced where an existing one would do

## Anti-patterns — refuse these

If the user asks for one of these, push back briefly and offer the right alternative:

- `font-size: 12px` (or any value < 14px)
- Hardcoded hex colors like `#3B82F6` instead of a token
- `<div onClick={...}>` for interactive controls
- `outline: none` with no replacement focus style
- Placeholder text used as the only label
- Red-only error states with no icon or text
- Fixed-pixel layouts that break under zoom
- Adding a new button/card/input variant when one already exists in the system
- "I'll add ARIA to fix it" as a substitute for using the right HTML element

## When to stop and ask the user

- The design system folder is missing, empty, or unreadable
- A required token doesn't exist for what's being asked
- The request would force a hard-rule violation
- An existing component almost fits but not quite — confirm whether to extend it or build new
- Accessibility and the visual request are in genuine tension

Surface these as short, specific questions. Don't bury them at the end of a long response.
