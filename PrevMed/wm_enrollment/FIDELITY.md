# Fidelity log

Every deviation from Figma `Weight-management Enrollment` § [`campaign enrollment` `2393:11580`](https://www.figma.com/design/1MtBa5iasLZN5qzstgMJaU/Weight-management-Enrollment?node-id=2393-11580), and every Figma quirk reproduced on purpose. Node ids throughout so anything here can be checked against the board.

## Status — 17 of 17 screens verified

The board moved. `campaign enrollment` is a **new section** with 19 frames and
all-new node ids — not an edit of `2324:5102`, which the previous build tracked.
Two structural changes drive everything else:

- The three landing questions are now **one 2947px scrolling page** (`2393:14545`),
  replacing four screens (`landing-hero` + `q-meds` + `q-motivation` + `q-measure`).
- A **new result screen** (`2393:15035`) after them tells the member how much weight
  they could lose, computed as **21% of the weight they entered**.

Three of the 19 frames are copy variants of the result screen, so the flow is
**17 screens**, down from 20.

`clean(geo)` is the flat-area pixel error against the board's own render; `ink` is
the share of disagreeing pixels landing on reference edges. Budgets:
`clean(geo) ≤ 0.15%`, `ink ≥ 80%`.

| # | screen | node | h | clean(geo) | ink |
| --- | --- | --- | --- | --- | --- |
| 1 | `ad` | `2393:12937` | 886 | 0.032% | 93.5% |
| 2 | `landing` | `2393:14545` | 2947 | 0.038% | 97.3% |
| 3 | `result` | `2393:15035` | 915 | 0.029% | 97.8% |
| 4 | `ec-name` | `2393:11684` | 852 | 0.035% | 96.8% |
| 5 | `ec-state` | `2393:11628` | 852 | 0.040% | 97.4% |
| 6 | `loader` | `2393:11581` | 852 | 0.038% | 96.1% |
| 7 | `covered` | `2393:11601` | 852 | 0.031% | 98.2% |
| 8 | `q-situations` | `2393:11744` | 852 | 0.032% | 94.8% |
| 9 | `q-diagnosed` | `2393:11793` | 852 | 0.032% | 94.5% |
| 10 | `q-comorbid` | `2393:11769` | 852 | 0.032% | 94.4% |
| 11 | `q-discuss` | `2393:11723` | 852 | 0.030% | 94.4% |
| 12 | `bridge` | `2393:11822` | 1886 | 0.029% | 97.8% |
| 13 | `schedule` | `2393:11871` | 1083 | 0.045% | 98.3% |
| 14 | `consent-hipaa` | `2393:11974` | 852 | 0.050% | 96.6% |
| 15 | `consent-care` | `2393:12015` | 852 | 0.034% | 94.1% |
| 16 | `phone` | `2393:11949` | 852 | 0.031% | 98.2% |
| 17 | `portal-home` | `2393:12054` | 3150 | 0.033% | 98.5% |

Plus 338/338 behavioural assertions — `python3 verify-behaviour.py`.

The previous build's one failure, `landing-hero` at 0.416%, is gone: that screen no
longer exists, and the hero it failed on is now one composited raster (below).

## How the changed screens were found

Not by reading the board and trusting it. The 17 new reference renders were pulled
first and diffed against the **old** committed renders with the same `diff()` the
gate uses. That table is what drove the work, and it corrected two wrong
assumptions of mine — `loader` and `covered` had looked redesigned in the new
renders and are in fact **pixel-identical** to the old board (0.000%).

| screen | old vs new `pct_bad` | what actually changed |
| --- | --- | --- |
| `ad` | 24.883% | rebuilt from two image bands + live text |
| `consent-care` | 12.289% | serif heading, +3px shift, CTA now enabled |
| `consent-hipaa` | 10.540% | same |
| `phone` | 5.623% | subhead gained "when needed.", `Terms of service` un-bolded, CTA now enabled |
| `q-situations` | 4.936% | subhead → "Select all that apply.", head gap 8 → 0 |
| `schedule` | 4.043% | CTA now enabled |
| `q-diagnosed` | 3.454% | same as `q-situations` |
| `ec-state` | 2.441% | heading lost "to get you covered." |
| `ec-name` | 2.232% | same |
| `bridge` | 0.087% | a different hero photograph |
| `loader` | **0.000%** | nothing |
| `covered` | **0.000%** | nothing |
| `q-comorbid` | **0.000%** | nothing |
| `q-discuss` | **0.000%** | nothing |
| `portal-home` | size 3062 → 3150 | 2 FAQ rows prepended, program card rebuilt |
| `landing`, `result` | new geometry | new screens |

## The one-page questionnaire

`2393:14545`, 2947 tall, frame fill `#ebf0ff`. Everything is absolutely positioned
from the frame origin; `.fg-op` starts at frame y=56, under the sticky Status Bar —
the only node on the frame Figma marks "fix position when scrolling" — so every
child's `top` is its Figma y minus 56.

| What | Where |
| --- | --- |
| A `Floating Nav` replaces the `Heading Navigation` | `2393:14625` · 393×68 at y=56, `#fcfcfc`, `Sign in` / `Check coverage` / a hamburger |
| Three question bands, each `h-600` with `justify-center`, 72px apart | `2393:14569` / `2393:14584` / `2393:14611` — one question fills the 663px viewport at a time, which is what makes a jump land cleanly |
| Progress is drawn **per section** (1/3, 2/3, 3/3), so no JS drives it | `2393:14570` / `14585` / `14612` |
| A Continue is drawn on **question 2 only** | `2393:14610` |
| Motivations are 6 options; medications 4; height/weight 3 fields | `2393:14577` / `2393:14617` / `2393:14592` |

### The interaction, and why it is shaped this way

The board draws no Continue on Q1 or Q3, so the handoffs are:

- `See if I qualify` → jump to Q1.
- **Q1 → Q2 auto-scrolls, debounced 900ms from the *last* checkbox change.** The
  debounce is the whole design: Q1 is multi-select (it has an "All of the above"),
  so a fixed delay from the *first* tick would move the page while someone is still
  choosing. It fires once per visit, never on a deselect back to zero, and any
  `wheel` / `touchmove` / navigation key **cancels it outright** — nothing moves
  under a member who has taken over.
- Q2 `Continue` → jump to Q3.
- Q3 radio → 450ms → the result screen.

Each jump also moves focus to that section's heading and writes the question to the
live region, or a keyboard or screen-reader user is stranded mid-page.

The 600px bands ship as `min-height`, not Figma's `height` + `overflow-clip`:
identical at 1×, and it does not amputate a question at 200% zoom.

## The result screen and the 21% number

`2393:15035` draws the headline as an unfilled placeholder:

> You are likely to **lose [23]lbs** with Bold! Let's check your coverage.

`[23]` ships as `Math.round(weight × 0.21)` from question 2, and `[23]lbs` ships as
`23 lbs` — the brackets are a placeholder by definition and the missing space is a
slip. 21% is defensible: it is close to the mean total body-weight reduction on
tirzepatide 15 mg at 72 weeks in SURMOUNT-1.

**The word "likely" is the board's, and it is the one item on this page worth
raising before release.** It asserts a specific outcome for one individual before
any provider has seen them, on a screen that carries no eligibility qualifier —
where both GLP-1 pricing lines one screen earlier say "if eligible". Shipped as
drawn, per the agreed decision, and flagged here rather than quietly softened.

The range check is not defensive tidiness. 21% of a fat-fingered `2200` is
`462 lbs`, and this string reaches a member as a medical expectation, so anything
outside 70–700 lb (32–320 kg) counts as **missing** and routes to the board's own
no-number variant, `2393:14693`:

> You're off to a great start with losing weight! Let's check your coverage.

Both headlines are in the DOM and one shows, driven by `[data-when]`. That is also
why `focusHeading` selects `[data-focus]:not([hidden])` — focusing the hidden one is
a silent no-op that leaves focus on the previous screen.

`2393:14914` is a **third** headline variant and is **not built**:
`You're qualify for Bold weight loss program!` — a third copy option and a grammar
slip. Its render is kept at `assets/ref/figma/03c-result-qualify-393.png`.

## Rasters, and where Figma's own endpoints disagree

**The one-page hero band ships as a single composited raster** — `img/hero-band.png`,
393×285 at (0, 123) — carrying the photo (`2393:14552`), the frosted pill card
(`2393:14632`) and the FDA disc (`2393:14634`). Three separate reasons, all measured:

1. **The photo node is animated.** `get_screenshot` on the *frame* renders it 23px
   out of pan phase from `get_screenshot` on the *node*, from `download_assets` on
   the node, and from `download_assets` on the frame — those three agree with each
   other exactly (mean 0.15, 0.00% bad at left 0) and only the frame screenshot
   differs. Outside rows 123–408 the two endpoints are **byte-identical** (max delta
   0), which is how the cause was isolated.
   → the landing's reference render is therefore `download_assets(2393:14545)`, the
   self-consistent one, not `get_screenshot`.
2. **The pill card is translucent over the photo.** Its fill is a
   `linear-gradient(139.9925deg, rgba(255,255,255,.76) 26.604%, rgba(255,255,255,.2) 91.922%)`
   with a 0.4px white ring, so an isolated export composites it against white — the
   node render is pale where the frame render is blue.
3. **The FDA disc is ~45 individually rotated single-glyph text nodes** plus two
   ellipses, and `get_screenshot` returns it fully opaque, so there is no alpha to
   composite with.

The band was built by taking the node photo render and copying the two overlay boxes
in from the frame export. It then differs from Figma's frame render **only** where
the live headline sits (rows 372–399), which is what the headline is drawn over.

**The ad ships as two bands cropped from the board's own frame render**, with the
live-text area repainted `#001d4b` — Figma's own `Rectangle 406` colour, the same as
the frame fill. Its per-node exports do not reproduce what the frame renders, but
here `download_assets(2393:12937)` and `get_screenshot` are byte-identical, so the
crops are exact. The headline (`2393:12941`) and subhead (`2393:12942`) are live text
over them; everything else in the creative — the logo, the yellow
`Check Your Eligibility` button, `In pill form and more.`, the pill photo and the
FDA seal — is baked in, and the whole frame is an `<a>` on the board, so the whole
screen is the target.

Also still rasterised, for the same "image-dominated with baked type" reason: the
after-scheduling video card `2393:12137` (361×577.6) and the two composited avatar
groups `2393:11876` and `2393:12058`.

## The five agreed corrections, plus one

These are the only places where the build deliberately differs from what the board
draws. Each is asserted in `verify-behaviour.py`, both that the fix is present and
that the original bug is gone.

| Node | Figma draws | Ships as |
| --- | --- | --- |
| `2393:11752`, `2393:11801`, `2393:11774`, `2393:11732` | `Question #` — the literal placeholder, on all four screening screens | `Question 1` … `Question 4` |
| `2393:11894` | `All times shown are in {Pacific Standard Times (PST)}` | `All times shown are in Pacific Time (PT)` |
| `2393:11834` | `Covered by [Medicare]` | `Covered by Medicare` |
| `2393:11904` / `2393:11906` | `Fri Jan 15` twice | five distinct weekdays, `Tue Jan 12` … `Mon Jan 18` |
| `2393:11918` / `2393:11921` | `10:45am` before `10:30am` | ascending. Both slots are 118 wide, so the swap moves no geometry |
| `2393:15042` | `lose [23]lbs` | `lose 46 lbs` — computed, with the space |

All five carried over unchanged from the previous board: the designer did not fix
any of them.

## Figma quirks reproduced on purpose

| What | Node | Why it looks wrong |
| --- | --- | --- |
| The one-page nav draws the Bold **lines glyph with no wordmark** | `2393:14626` | Figma emits both sub-layers, but sampled across the reference render x 56–74 / y 74–106 is flat `#fcfcfc` where the "B" would be. The 107-wide box with `mr:-53` hides the rest behind the `Sign in` button. Reproducing the render, per the same rule that settled the nav's 153px purple bar. |
| The nav's purple bar is a **static 153×3px** segment at the left, identical on all funnel screens | `2393:11748` and siblings | It reads as a progress bar frozen at 39%. The component declares a full-width `border-b-3`; every instance renders 153px. |
| `portal-home` alone has **no** purple segment | `2393:12056` | Consistent with the portal being the destination rather than a step. |
| The ad's headline node draws a **third, empty line box** | `2393:12941` | A U+200B paragraph. It is what makes the node 105 tall rather than 70. |
| Figma breaks `$50/month` **after the slash**, twice | `2393:12942`, `2393:11591` | Chrome does not treat `SY` as a break opportunity, so without a `<wbr>` the ad subhead is one line short and the loader row is 72 tall instead of 48. |
| The screening head has **three different spacings for one shape** across four adjacent frames | `2393:11751` / `2393:11800` (gap 0) · `2393:11772` (gap 4) · `2393:11731` (gap 8) | Reproduced, not unified. |
| `q-situations` (876) and `q-diagnosed` (1092) overflow their 852 frames | `2393:11749`, `2393:11798` | Figma clips. `.fg-content` grows past the frame and the sticky bottom group floats over the scroll, which is the same picture. |
| `q-discuss`'s Actions is 128 tall with **no bottom padding** | `2393:11738` | `16 + 48 + 16 + 48 = 128`, so the secondary button sits flush against the Tab Bar. |
| The first day tab is drawn **selected**; no *time* slot is | `2393:11897` | So `slotDay` defaults to `tue-12`. |
| `Jan 13` overflows its tab by a pixel | `2393:11900` | 57px of text in a 56px content box. `white-space: nowrap` keeps Figma's overflow instead of breaking to a third line. |
| The consent document heading is **18px** on one frame and **20px** on the next | `2393:12004` vs `2393:12043` | Same-looking heading, same component slot. Both reproduced. |
| A **hard line break** inside the words "Terms of / Service" | `2393:11662` | Measured: the string is 338.58px in a 361px box, so a width-driven layout keeps `Service` on line 1. The render puts it on line 2, so the break is authored. |
| `01/01/19\|YY` as a two-tone drawn DOB value | `2393:11652` | `01/01/19` in `#171717`, `YY` in `#a3a3a3`, and the `\|` is a drawn text caret. A `placeholder` cannot be two colours, so the drawn text is a span over the live input; it clears on focus or first keystroke. |
| Checkbox labels alternate between `rgba(0,0,0,0.8)` and Ink/300 `#140d26` **inside the same list** | the `q-comorbid` list | Seemingly at random. Both reproduced via `.fg-check--soft`. |
| One `Info` glyph sits at **opacity 0** and still sets the badge's height | the Bridge cost badge | Invisible, but 24 tall — it is what makes the badge 32 rather than 30. Kept in the DOM. |
| The same `CheckCircle` art is filled `#2563eb` on the loader and `#14b8a6` on the Bridge | | The fill is baked into the exported path, so it ships as two committed files. |
| `get_metadata` reports the portal FAQ as **7 rows / 504 tall**; the render draws **9 rows / 616 tall** | `2393:12143` | Two rows were prepended (`How medication coverage works.`, `Are GLP-1s required?`) and the metadata is stale. `2 × 56 = 112` is exactly the frame's growth, 3037.8 → 3150. The render is the arbiter. |
| `portal-home`'s render bounds (3150) exceed its frame (3037.8) | `2393:12054` | The frame does not clip, so a child overflows 112px and the reference render — and therefore `figmaH` — is 3150. |
| `2393:11601` is **named** `mWeb - Phone number, 2FA verification` but draws the coverage screen | | There is no 2FA frame anywhere in the section, so if 2FA was intended it is missing from the board. |
| `Foundayo®` is offered as an example GLP-1 | `2393:14620` | Not a marketed drug — probably a slip for Ozempic® or Mounjaro®. Reproduced verbatim rather than guessed at. |

## Hidden nodes deliberately not rendered

Figma marks these `hidden="true"`; rendering any of them changes layout. All are
asserted absent on every screen.

- **`By tapping "Agree", you accept the terms in the documents above.`** — 361×44, present inside **every** `Actions` group (`2393:12012`, `2393:11946`, `2393:11766`, …). Rendering it grows every bottom group 80→140 and breaks every screen.
- The `ec-name` `Date of birth` field `2393:11702` (`ec-state` draws its own); the `Health insurance` label `2393:11624`.
- The consent `Container` / `Section` / `Button` sets — `2393:11983`/`12016`, `2393:11997`/`12038` — and the `On Bold` labels `2393:12001`/`12042`.
- The portal `Callout` `2393:12110` (361×208, the intake-form prompt), the `To Do` badge `2393:12068`, and both `Estimated copay $0 - $25` pairs `2393:12102`/`12103` and `2393:12130`/`12131`.

## Authored, not transcribed

The board draws these affordances but gives them no destination frame, so their
**body copy is written, not copied**. Everything else on every screen is transcribed.

| Trigger | Sheet |
| --- | --- |
| "Why are we asking this?" ×2 | why we need a name and email · why we need a state and date of birth |
| "Learn more." | coverage detail |
| "Edit information." | how to change your details |
| "See more" | Bridge programme detail |
| `Info` on the GLP-1 cost cell | GLP-1 copay detail |

All follow the approved pricing messaging: never "free", and `$0 out of pocket` is
always paired with the 78% stat.

Three further authored items:

- **The metric state of `Switch to cm / kg`** (`2393:14609`). The board draws only
  the imperial state, and the control has to work — the result screen's number is
  21% of that field, so a member who thinks in kilograms would otherwise get a wrong
  figure from a control the board puts next to the input. Switching converts any
  value already entered rather than clearing it.
- **The consent documents are abridged.** `2393:12005` (HIPAA notice, ~15,000
  characters) and `2393:12044` (New Patient Agreement, ~20,000) each live in a 322px
  scrolling box that shows about six lines. [wm-legal.js](wm-legal.js) carries the
  verbatim opening of each and names the node holding the rest.
- **The portal's nine FAQ answers.** All are drawn collapsed, so the board contains
  no answer text.

## Accessibility

Fidelity was chosen over the senior-onboarding floor, so most of the previous
build's list stands. **Two items came off it on this board**, both improvements the
designer made:

- **The marketing-opt-in gate is gone.** The previous board drew the `phone` CTA
  disabled with the opt-in unchecked, which made completing enrollment conditional
  on consenting to marketing texts. `2393:11968` is now drawn **enabled**, and the
  build does not reinstate a gate. This was the one item last time flagged as worth
  raising with the designer; it is resolved.
- `Terms of service` is no longer bold, which was the only weight distinction
  between it and the surrounding legal copy.

Still on the list:

- **`ec-state` names an unexplained third party.** `2393:11662` — "you agree that Verified (Bold's service provider) and its vendors may receive your personal info" — with a live link to `verified.inc`, at the point where trust is most fragile.
- Body copy is **16px**; the senior-onboarding reference sets an 18px floor.
- `Radio Button` has **no indicator glyph** — only a label. Selected state is a purple fill and border, using the board's own `Border/border-brand-primary` and `Surface/surface-brand-secondary`.
- `Checkbox` is never drawn **selected** anywhere on the board, so there is no checked mark to copy.
- The support phone appears on the one-page landing footer-equivalent and on `result`, but is **absent from screens 4–16**, where a member is most likely to get stuck.
- The `Switch to cm / kg` control is drawn at **50% opacity** — below the 4.5:1 floor — and is now functional, so it is a contrast failure on a working control.
- No text-resize control, and the drawn placeholder colour `#acacac` on white is ~2.3:1.
- **Below 393px the layer scrolls horizontally.** Measured: at 320px two elements
  overflow their clip on `landing`, `result` and the screening screens. The board is
  a fixed 393px comp with hard-coded 361/393 widths, so a pixel-faithful replica
  inherits that; a responsive version would have to stop being a replica. Vertical
  behaviour is unaffected — the one-page bands keep 63 / 102 / 71px of slack below
  their last child at every size tested, which is what `min-height` instead of
  Figma's `height` + `overflow-clip` buys.

### Three CTAs are drawn enabled but still need an answer

`schedule`, `consent-hipaa` and `consent-care` are drawn **enabled** with nothing
chosen, so a member could schedule a call without a time or continue past a HIPAA
notice without acknowledging it. Disabling them would change the pixels. Instead
each carries a `guard`: the button stays enabled exactly as drawn, and pressing it
early moves focus to the control and says why through the live region. No element
added, no pixel moved at rest. The `phone` screen deliberately gets **no** guard.

## A gap in the pixel gate, and what closed it

The Bridge CTA was once transcribed as "Continue" where the board says **"Schedule
no-cost call"**, and the pixel diff passed it at 0.037%. The reason is structural,
not a tuning problem: the shorter string sits *inside* the longer one's glyph band,
and the edge mask excludes exactly that area by design — it has to, or every screen
would fail on antialiasing. A copy change confined to already-text-dense pixels is
therefore invisible to `clean(geo)`.

`verify-behaviour.py` asserts **every** primary CTA label plus every string that
changed on this board, each paired with the string it replaced so the assertion is a
regression test rather than a tautology.

Transcription needs assertions, not diffs.

## One band excluded from the gate, and why

`result` rows 190–300 are measured and **reported** but not counted in `clean(geo)`:
the board draws `[23]lbs` where the build renders a computed `46 lbs`, so the
string's width differs and every word after it shifts. That lands in flat area and
would swamp the gate for a substitution the board is asking for. The band's own
number prints on every run (currently 0.438%), and the copy is asserted instead.

Nothing else is excluded.

## Deliberate implementation choices

- **Figma's strokes on this board are *inside* strokes, everywhere.** Reproduced with `box-shadow: inset 0 0 0 Npx`, never `border`. A real border makes each auto-height radio 74px instead of 72 and the error cascades 4px down a list of four.
- **`<button>` needs an explicit `border` or `border: 0`.** Chrome's UA sheet applies `border: 2px outset ButtonBorder`.
- **Heading line-height is `29px`, not the literal `1.2` (= 28.8).** Figma reports these heading nodes at 361×29 for one line and 361×58 for two, so its layout rounds the line box to 29 and positions the next sibling from that.
- **`white-space: pre-wrap` on the landing headline is load-bearing.** Figma emits it, and it matters: the paragraph ends with a real space and Figma *includes* that space when centring the wrapped second line. CSS normally drops a trailing space at a line end, which centred the visible glyphs 3px right of where the board puts them (0.082% → 0.038%). `&nbsp;` is the wrong fix — it stops the line fitting and pushes the accent run onto a fourth line, over the CTA.
- **Scope every `> span` selector.** `.fg-step-num span` also matched `.fg-step-line`, and one class plus one element (0,1,1) outspecifies `.fg-step-line` (0,1,0) — so each step connector inherited `top: calc(50% - 11px)` = 2px, started 23px too high, and ended 23px short. Same family of bug as the unscoped `.fg-faq-q > span` that once let an icon steal half a label's width. The digits now carry `.fg-step-n`.
- **The step connectors paint *under* the digits.** Figma's own child order is digit-then-line, but its render puts the digit on top — sampled at x=44, where the reference line breaks at y 346–347 and 416–419 for the "1" and "2" while the build's ran straight through. The markup puts the connector first.
- **The one-page nav buttons are absolutely placed at their measured lefts** (74 / 171 / 341, widths 85 / 158 / 32), confirmed against the reference render. Letting the labels size the boxes lands 0.8px short and drifts the hamburger.
- **Icons ship as the Figma *Vector* at its own size**, positioned by the node's own insets. Where Figma nests a negative inner inset for stroke bleed, the painted box is larger than the nominal glyph box; every number was cross-checked against the downloaded SVG's own `width`/`height`.
- **Instance SVG exports are unusable for icons.** `download_assets(<instance>, format=svg)` returns the glyph *plus a full-size `#A6A6A6` backdrop rect*.
- **Static Inter, not the variable font** Google now serves; **`Source Serif Pro`, not Source Serif 4** — the latter is a redraw with a larger x-height. Both self-hosted.
- **Rasters are committed at both 1× and 3×** and chosen with `srcset`: the diff runs at DPR 1 and must not resample; a real phone runs at DPR 3.
- **Two elements exist that no Figma node backs**, both invisible and both required for interaction: the day-row scroll wrapper on `schedule` and the consent document's scroll wrapper (so the drawn 6×93 thumb is not a native scrollbar eating 6px of layout width).
