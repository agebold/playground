# Prototype images

Drop the files listed below into **this folder** (`PrevMed/weight_management_app/images/`). The prototype's `<img>` tags point here directly — no code changes needed once a file is in place. Each slot has an `onerror` handler that swaps to a styled labeled placeholder if the image is missing, so the prototype always reads as complete.

## Required files

| Filename | Used in | Aspect / size | What to drop in |
| --- | --- | --- | --- |
| `hero-landing.jpg` | Landing screen hero | 16:11, ≥1600w | Real photo of a 65+ couple/individual outdoors, warm light, no clinical setting. Avoid stock-photo "smiling at camera." |
| `clinician-rivera.jpg` | Landing · Provider intake · My Care · Chat | square, ≥600px | Real headshot of "Dr. Rivera." MD/clinician energy, warm and human. |
| `user-margaret.jpg` | Profile · top-bar avatars on Home/Progress/Explore/My Care/Chat | square, ≥600px | Real headshot of "Margaret" (the user persona). 65+, warm. |
| `routine-seated-leg.jpg` | Home (Today's one thing card) · Explore (workout card) | 16:9, ≥1600w | An older adult doing a seated leg-strength routine. No equipment, indoor or natural setting. |
| `recipe-yogurt-bowl.jpg` | Explore (recipe card) | 16:9, ≥1600w | Top-down or 3/4 of a Greek yogurt bowl with walnuts and berries. Bright, appetizing. |
| `article-glp1-aging.jpg` | Explore (article card) | 16:9, ≥1600w | Editorial-style photo to pair with the GLP-1 + aging article. Calm, photographic, not stock-y. |
| `body-comp-illo.png` | Progress (body composition module) | 4:3, transparent OK | Stylized body-composition visualization — body silhouette + lean/fat overlay. Illustration, not photo. |
| `medicare-card.png` | Coverage check | 16:9, transparent OK | Stylized example Medicare card (red/white/blue Original Medicare style; not a real card with a real MBI). |
| `rx-pill.jpg` | My Care (Your prescription) | 16:9, ≥1600w | Hero shot of a single pill (or a few pills) on a clean surface. Brand-agnostic, warm light. **No vials, no needles, no compounded medication imagery.** |
| `recipe-fish-tacos.jpg` | Ask → dinner carousel | 16:10, ≥1200w | Top-down or 3/4 of fish/chicken tacos with bright veggies and whole-grain tortillas. Bright, appetizing. |
| `recipe-chicken-soup.jpg` | Ask → dinner carousel | 16:10, ≥1200w | Bowl of chicken and brown rice soup with broccoli. Warm, cozy. |
| `recipe-yogurt-chicken.jpg` | Ask → dinner carousel | 16:10, ≥1200w | Yogurt-marinated chicken bowl over rice with steamed broccoli. |
| `recipe-sheet-pan.jpg` | Ask → dinner carousel | 16:10, ≥1200w | Sheet-pan chicken and broccoli — overhead view of a single tray. |
| `snack-yogurt-walnuts.jpg` | Ask → snack carousel | 16:10, ≥1200w | Bowl of Greek yogurt topped with walnuts and a drizzle of honey. |
| `snack-cottage-toast.jpg` | Ask → snack carousel | 16:10, ≥1200w | Slice of whole-grain toast with cottage cheese and tomato. |
| `snack-hardboiled.jpg` | Ask → snack carousel | 16:10, ≥1200w | Two hard-boiled eggs plus apple slices on a plate. |

## Rules of thumb (from the senior-onboarding research)

- **No stock photos that read younger than 65.** The audience reads "is this for me?" off the imagery in 2 seconds.
- **No clinical/sterile imagery.** Warm indoor or outdoor light beats hospital.
- **No needles or vials.** Pill-first product (per `data/synthesis/principles.md` #4).
- **No "generic fitness."** Routines must look accessible to a 65+ body (seated, balance-safe, joint-friendly).
- **Consent / model release matters.** If you're using a real older adult, get the release on file.

## How the placeholders work

Each image slot looks like this in the HTML:

```html
<figure class="img-slot img-slot-hero">
  <img src="images/hero-landing.jpg"
       alt="An older couple walking outdoors"
       onerror="this.classList.add('failed');this.parentNode.classList.add('no-img')">
  <figcaption>Hero photo — older couple walking outdoors</figcaption>
</figure>
```

If `hero-landing.jpg` exists, the photo shows. If it doesn't, the `<figcaption>` shows with a labeled placeholder so the prototype still reads as complete during review.
