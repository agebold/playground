# Weight Management Enrollment — Figma replica

A faithful, interactive replica of Figma `Weight-management Enrollment` §
[`campaign enrollment` `2393:11580`](https://www.figma.com/design/1MtBa5iasLZN5qzstgMJaU/Weight-management-Enrollment?node-id=2393-11580):
the same 17 screens in the board's left-to-right order, same layout, same copy,
same placement, the board's own image assets, and the iOS + Safari chrome it
draws. One linear flow, no A/B variants.

**All 17 screens are within budget** — 0.029–0.050% flat-area pixel error against
the board's own renders, plus 338 behavioural assertions.
See [FIDELITY.md](FIDELITY.md) for the per-screen table and every deviation.

Two things make this board different from the one the previous build tracked
(§ `2324:5102`, now superseded):

- **The three landing questions are one 2947px scrolling page** (`2393:14545`).
  Tapping `See if I qualify` jumps to question 1; question 1 hands off to question 2
  by itself once you stop ticking; question 2's Continue jumps to question 3; and
  choosing a medication answer leaves the page.
- **A result screen** (`2393:15035`) then tells you how much weight you could lose —
  **21% of the weight you entered**, with the board's own no-number variant as the
  fallback when question 2 was skipped.

## Run it

```sh
python3 -m http.server 8080        # from the repo root
open http://localhost:8080/PrevMed/wm_enrollment/
```

Open over **http**, not `file://` — the harness↔flow bridge and `sessionStorage`
both need a real origin.

- `index.html` — desktop harness: iPhone frame plus a step list built from the
  flow's own manifest, each row labelled with its Figma node id and frame height.
- `flow.html` — the flow itself, standalone-viable: open it directly on a phone
  and you get real Back, real `100dvh`, real safe-area insets.

Every screen is deep-linkable: `flow.html#landing`.

## Verify it

```sh
python3 verify-fidelity.py            # all 17 screens, pixel diff
python3 verify-fidelity.py landing    # one screen
python3 verify-behaviour.py           # 338 functional assertions
```

Both need `websocket-client`, `Pillow`, `numpy`, and Chrome. The pixel harness
drives headless Chrome at DPR 1, sets the emulated viewport to each **frame's own
height**, and diffs against `assets/ref/figma/`.

### Why not just `pct_bad`

Figma serves its renders at 1× (`maxDimension` does not upscale), so every glyph
edge is a whole pixel of disagreement between its rasterizer and Skia. A flat
`pct_bad` budget would fail every text-bearing screen for a non-defect — measured
on the screening screens: ~0.03% on flat area against 2.8–6% on text bands.

So the gate is two numbers instead:

- **`clean(geo)` ≤ 0.15%** — Δ>48 measured **only over flat reference area**
  (3×3 local contrast ≤ 12). A shifted block, a wrong fill or a missing icon
  always lands here; antialiasing never does. This is the real geometry gate.
- **`ink_share` ≥ 80%** — the share of bad pixels landing on reference *edges*. A
  missing icon or a shifted block drives this **down**, which is the failure a raw
  percentage cannot distinguish from antialiasing.

`pct_bad ≤ 7%` and `mean ≤ 14` remain as backstops for gross breakage and for a
global tint error that the others would miss because the delta is small but
everywhere.

One band is excluded from `clean(geo)` and reported separately: the `result`
headline, where the board draws the placeholder `[23]lbs` and the build renders a
computed `46 lbs`. Nothing else. See FIDELITY.md.

### What the harnesses actually caught

Not a formality. On this pass alone: an unscoped `.fg-step-num span` selector that
outspecified `.fg-step-line` and started every step connector 23px too high · step
connectors painting over their digits where the board paints them under · a
`whitespace-pre-wrap` on the landing headline whose trailing space Figma counts when
centring and CSS does not · `Terms of service` shipped bold where the board
un-bolded it · a `<wbr>` missing after `$50/` in the ad subhead · the Bold wordmark
rendering in the one-page nav where the board hides it · nav buttons 0.8px narrow
from letting the labels size them · two FAQ rows that `get_metadata` does not report
but the render draws · and the old board's hero photograph still shipping on the
Bridge.

Earlier passes found: a visible button label painting over the ad artwork · a
`<span>` silently ignoring width/height · Figma's inside-strokes modelled as borders
· Chrome's UA `2px outset` button border · Figma breaking `$50/month` after the
slash · a grey placeholder shipped instead of a doctor's photo · and a
**stale-cache bug in the driver itself** that meant the harness was verifying
JavaScript no longer on disk.

The pixel gate has one structural blind spot, and the behaviour harness covers it:
a copy change confined to pixels that are *already* text-dense is invisible to
`clean(geo)`, because the edge mask has to exclude that area or every screen would
fail on antialiasing. That is how the Bridge once shipped "Continue" where the board
says "Schedule no-cost call". Every primary CTA label and every string that changed
on this board is now asserted, each paired with the string it replaced.

## Layout model

The frames are not "flow column + pinned footer". They are a top-anchored group
then a bottom group, and Figma uses three mechanisms:

- **Funnel screens** — Status Bar, Heading Navigation, content, bottom group.
  `.fg-bottom { position: sticky; bottom: 0 }` reproduces all three Figma cases at
  once: content shorter than the frame → the group sits at the frame bottom;
  content taller (`q-situations` 876, `q-diagnosed` 1092 inside 852 frames) → it
  floats over the scroll, which is what Figma's clip shows; tall frames
  (`bridge` 1886, `portal-home` 3150) → it sits at the document end. It also makes
  the fidelity screenshot free, because sticky resolves to its natural flow
  position once the scrollport is tall enough to contain it.
- **The one-page landing** — everything absolutely positioned from the frame origin
  inside `.fg-op`, which starts at frame y=56, under the sticky Status Bar (the only
  node Figma marks "fix position when scrolling"). Height 2758 = 2814 − 56, where
  2814 is where the Tab Bar starts.
- **The ad** — the same absolute model over two image bands, with the headline and
  subhead as live text on top and the whole frame an `<a>`.

`portal-home` is the only frame with no bottom group at all — no Actions, no Tab
Bar — and the only one whose nav has no purple segment.

Sub-pixel values are real (`181.292`, `691.336`, `577.5999755859375`, `3037.7998`)
and are emitted as-is — rounding accumulates into visible drift over a 3150px frame.

## Files

| File | Role |
| --- | --- |
| `flow.html` | Shell: stage, sheet host, live region. The chrome lives *inside* each screen, because that is where Figma draws it. |
| `wm-tokens.css` | `:root`. The fenced block mirrors `../glp1_funnel/funnel.css`; `sh ./check-tokens.sh` proves no drift. |
| `wm-frame.css` | Self-hosted fonts, shell/stage/layer, Status Bar, Heading Navigation, the icon-box system, Actions, Tab Bar, transitions, sheet. |
| `wm-parts.css` | Per-screen components, `.fg-*`, each with the node id it was measured from. |
| `wm-engine.js` | State + subscribe, linear router, layer transitions, focus/aria-live, `data-bind`/`data-when`, the 21% derivation, CTA guards, sheet, harness bridge. |
| `wm-widgets.js` | Mount helpers; each returns a cleanup that clears its timers and listeners. `onePage()` owns the scroll choreography. |
| `wm-screens.js` | Chrome partials, the 17-screen registry, and all copy. |
| `wm-legal.js` | The two consent documents (abridged — see FIDELITY.md). |
| `verify-fidelity.py` | Pixel diff against the board's renders. |
| `verify-behaviour.py` | The assertions a pixel diff structurally cannot make. |
| `cdp_driver.py` | Vendored so the harnesses run without anything in `/tmp`. Cache is disabled at connect — without that it verifies stale code. |
| `assets/` | committed Figma exports plus self-hosted fonts, with `MANIFEST.tsv` (path, bytes, sha256). `assets/ref/figma/` holds the 17 reference renders plus the two unbuilt result-headline variants. |

## Traps, if you touch this

Every one of these cost real debugging time:

1. **Give every `<button>` an explicit `border` or `border: 0`.** Chrome's UA sheet
   applies `border: 2px outset ButtonBorder`.
2. **Model Figma's 1px/2px strokes as inset shadows, not borders.** On this board
   they are inside strokes without exception, so a real border moves content.
3. **`line-height: 29px` on 24px headings**, 24px on 20px ones — Figma rounds the
   line box to a whole pixel and positions the next sibling from that.
4. **Give any sized `<span>` `display: block`** unless it is a flex item.
5. **Scope `> span` selectors.** `.fg-step-num span` matched `.fg-step-line` and
   outspecified it (0,1,1 vs 0,1,0); `ic()` emits a `<span>` too. An unscoped rule
   turns an icon into a flex-grow sibling or moves a connector 23px.
6. **Keep Figma's `whitespace-pre-wrap` where it emits it.** A trailing space that
   CSS drops at a line end changes where a centred line lands.
7. **Resolve asset URLs by the `data-node-id` on each `<img>`'s parent**, never by
   the constant name: `imgVector`…`imgVector5` in one response can be a battery
   rectangle and a phone glyph.
8. **Verify every download, and cross-check it against the frame render.** Figma's
   endpoints do not always agree: `get_screenshot` on a frame containing an animated
   node renders it out of phase with `download_assets` and with a node screenshot,
   and `get_metadata` can report a stale child count (the portal FAQ). A Figma error
   page also arrives as HTML with a 200 and looks like an asset — assert SVGs start
   `<svg` and contain a `viewBox`.

Asset URLs expire in ~7 days, so download everything for a screen in the same
session you author it.
