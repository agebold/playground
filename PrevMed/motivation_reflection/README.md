# Motivation Reflection

**Prototype for:** making the patient's own reason for being here explicit, then showing them
we heard it at the exact moment they decide whether to schedule.

Open `index.html`. The prototype runs in an **iPhone 16 frame** (393 × 852) with the
controls in a rail on the left — pick a direction, or jump straight to a screen.

The device screen is the scroll container, not the page, so the iOS status bar and the
sticky nav behave the way they do on hardware. Below 900px the rail moves above the phone;
below 460px the chassis is dropped and the screen goes full-bleed, since a device frame
inside a real phone is just a frame inside a frame.

The Care Coordinator view is deliberately **not** in the phone — it's an internal desktop
tool, so it renders as a desktop panel with its own "Bold internal" label.

### Deep links

Any state can be shared as a URL, so you can send someone a specific reflection rather than
a set of instructions.

| Param | | Example |
|---|---|---|
| `v` | direction | `?v=C` |
| `screen` | any of the 12 screen ids | `&screen=schedule` |
| `pick` | motivation id(s), comma-separated | `&pick=pain` · `&pick=pain,what_to_eat,energy` |
| `worry` | worry id (Direction C) | `&worry=with_my_meds` |
| `other` | free-text answer | `&other=I%20want%20my%20knees%20back` |
| `verdict` | `partd` (default) or `bridge` | `&verdict=bridge` |

The one worth opening first:
`?v=C&screen=schedule&pick=pain&worry=with_my_meds`

Unknown ids are dropped rather than rendered, so a stale link degrades to the generic
fallback instead of showing a broken callout.

---

## The problem

Step 3 (Eligible → CC Call Scheduled) is one of the two largest losses in the funnel, and we
don't know why. The standing assumption — cost — has not held up: Xavier isn't hearing cost
questions from Bridge-eligible patients now that GLP-1s are in market.

What we haven't tried is making the patient's motivation explicit and reflecting it back at the
decision point.

## The three directions

Each tests a **different hypothesis about why an eligible patient doesn't book** — not three
visual treatments of the same idea. Each also resolves the single-vs-multi-select open question
differently, so the test answers that as a by-product.

| | Bet | Capture | Reflection at scheduling |
|---|---|---|---|
| **A · Verbatim echo** | The goal was never stated | Single-select, 6 options + 2 escapes | Their exact phrase quoted back, plus one line on what Bold does about it |
| **B · Call agenda** | They don't know what the call is for | Multi-select, up to 3, first pick leads | The picks become a numbered preview of the 15 minutes |
| **C · Goal + worry** | An unanswered worry is the blocker | Goal, then one optional "anything you're unsure about?" | Goal on top; the worry answered by name underneath |

**Direction C carries the most risk** and it's stated in the readout rather than smoothed over:
it adds a second question to a funnel step we are already losing. It is the direction most
exposed to the Signup → Eligible guardrail, and the Verified experiment showed what added steps
can do. It's still worth running — it's the only direction that tests the brief's actual premise.

## The flow

Page-by-page → chat → page-by-page, matching the current Figma
([`315:4641`](https://www.figma.com/design/BFAh85XW5XxjtdTbP9FbX8/Ai-Chat?node-id=315-4641) for
the map, [`334:3753`](https://www.figma.com/design/BFAh85XW5XxjtdTbP9FbX8/Ai-Chat?node-id=334-3753)
for the chat).

```
coverage → checking → covered → focus area   │  chat  │  matching → schedule ★ → privacy
  ── page-by-page ──                         │        │  → consent → phone → all set → CC view
                                             └ the motivation question lives here
```

★ is where the reflection lands, above the day tabs — so it is read *before* the commitment.

### Where the motivation question sits, and why

The Figma currently asks a version of this twice: `315:4916` page-by-page ("Which area do you
want to focus on?") and again as the chat's opening question, both with the same four chips —
Weight management / Energy and fatigue / Pain Management / General Healthy Aging.

Those four are a **programme-area router**, not a motivation question, and they're written in
Bold's language rather than patients'. So this prototype keeps the router where Figma has it
and puts the real motivation question as the chat's first question. The duplication resolves
instead of doubling.

## Two rules the interaction has to keep

**The escape hatches never lock.** In Direction B, hitting the 3-pick cap greys out and
disables the remaining goals — but "Something else" and "Not sure yet" stay live. Locking them
would quietly turn this into a hard gate, which is the one thing the ticket forbids: we are
adding a question to a funnel step we are already losing.

**"Not sure yet" and "None of the above" are exclusive.** Picking either clears every other
selection, and picking a real option clears them — the same `data-exclusive` convention as
`../glp1_funnel/steps.js`.

## Where the options come from

Every option traces to a tag, a measured share, and real verbatims. Full mapping in
[`motivation-options.md`](motivation-options.md); machine-readable twin in `motivation-data.js`;
reviewable inside the prototype under **Tracking & source data**.

Source: the GLP-1 onboarding check-in free-text field, n = 690 text answers,
2026-06-28 → 2026-07-28. The taxonomy already specified this work as **P0 — "replace the open
box with a guided multi-select"** and pre-ranked the options.

**Read the percentages as prevalence** — how often a topic was raised. Not intensity, not the
person's main reason, not persuasiveness.

## Tracking

New event property **and** user property: `weightLossMotivation`.

- Primary funnel: **Eligible → CC Call Scheduled**, broken down by `weightLossMotivation` and by `glp1VerdictBucket`
- Guardrail: **Signup → Eligible must not degrade**
- Secondary: **CC Call Scheduled → Physician Visit Scheduled** — does CC visibility move the pitch?

The panel shows the live payload, the events fired, and the option/source table. Nothing is
sent anywhere; there is no Mixpanel SDK in this prototype.

## Acceptance criteria

| Criterion | Where |
|---|---|
| Question renders in the flow | Chat, first question after the greeting |
| Options sourced from the free-text analysis, documented with source data | `motivation-options.md` + the in-prototype panel |
| Persisted and written to Mixpanel as event + user property | Instrumentation panel (mocked) |
| Displayed on the scheduling screen | `schedule` — above the day tabs |
| Visible to the Care Coordinator before the call | `cc` — with a suggested opener |
| Skippable without blocking progression | "Not sure yet" → `not_sure`, flow continues, generic fallback copy |
| Instrumented before/after comparison | Funnel + guardrail spec in the panel |

## Files

| File | |
|---|---|
| `index.html` | 12 screens |
| `motivation.css` | Local layer: device frame, chat, chips, reflection, CC view, prototype chrome |
| `motivation.js` | Router, chat engine, reflection renderer, fake instrumentation |
| `motivation-data.js` | The option table — every option's tag, share and verbatims |
| `motivation-options.md` | The same table for humans, plus what was cut and why |

Tokens and `cf-*` components come from `../glp1_funnel/funnel.css`, a documented
hand-implementation of `@bold/web`. The device geometry is real: 393 × 852 logical points,
55px display radius, 125 × 36 Dynamic Island, 139 × 5 home indicator, and a 54px status bar
— which is exactly the offset `funnel.css`'s `.cf-nav { top: 54px }` already assumes, so the
funnel's own sticky nav drops straight in. Note that `steps.css` clamps `body` to 393px for
the real funnel pages; this prototype hosts a frame, so that clamp is lifted here. Chat bubbles and chips are new: `@bold/web` has no Chat,
Bubble or Chip component (92 Storybook titles checked). The chips are therefore built on the
**anatomy** of `Forms/Formik/FieldRadioButtons` / `FieldCheckboxButtons` — real `<input>` +
`<label>`, never a div-as-button — and skinned with the `Tag---purple100` token pair.

## Two things to raise upstream

**1. `.cf-hipaa-strip` fails WCAG.** `funnel.css:648` paints it `--color-gray-350` (`#a3a3a3`)
at 16px. That is **2.3:1** on white — a clear WCAG 2.2 AA failure, on the one line whose entire
job is to be trusted, in a funnel serving 65+ users. This prototype overrides it to `$grey---500`
(`#4d4d4d`, 8.9:1) at 18px, but the live funnel pages still ship the failing version. HHS
Section 504 binds Medicare-accepting entities to WCAG 2.1 AA as of 11 May 2026.

**2. Two funnel.css tokens drift from `@bold/web`.** `--color-purple-ede: #ede9fe` should be
`$purple---100: #eee6fb`, and `--color-gray-475: #737373` should be `$grey---500: #4d4d4d`.
Both are marked with ⚠ in `funnel.css` as deliberate parity deviations, so this is a
housekeeping note, not a bug — but anything new should use the real values.

## Open question

The brief asks whether the reflection belongs on the verdict page, the scheduling page, or both.
All three directions reflect at **scheduling** so they stay comparable, and the verdict lands
in-thread in the chat where the new flow puts it. Testing placement as well would need a fourth
direction.
