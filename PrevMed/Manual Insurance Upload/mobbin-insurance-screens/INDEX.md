# Insurance-information collection — Mobbin reference set

Pulled from Mobbin on 2026-08-20. 62 screens, full retina resolution
(iOS 1179×2556, web 1920×1200). Folders are named by app; flows are kept in
sequence order (`01-`, `02-`, …) so you can read them as a journey.

---

## Zocdoc — iOS (32 screens)
The most complete reference in the set. Zocdoc collects insurance three
different ways and lets the member pick.

**`flow-editing-an-insurance/` (7)** — [flow on Mobbin](https://mobbin.com/flows/f4e3481d-57de-4251-a5b5-9e94fd90763d)
Plan name + Member ID + optional card photo, with an inline *why we're asking*
line: "Some providers need to verify your coverage before a visit. Save time by
uploading it now." Includes the plan picker: a searchable list split into
**Popular plans** and **All plans**, which is the single most reusable pattern
here — it makes a 10,000-item payer list feel like a short list.

**`flow-uploading-insurance-images/` (8)** — [flow](https://mobbin.com/flows/969c9287-bd59-4ea0-8ba0-4a42fc082705)
Camera-first capture: illustrated intro → "Start with the front / Place your
card on a flat surface" with a card-shaped cutout → crop-and-rotate → green
check confirmation per side. Note the **Take photos / Upload** pair — never
forces the camera.

**`flow-onboarding/` (14)** — [flow](https://mobbin.com/flows/a39e9def-e888-4663-a597-f2abc49c5d29)
Full signup. Insurance is *not* in the signup path — it's deferred to a home
prompt ("Search with your insurance — book faster with providers who accept
your plan") and then surfaced again at Review-and-book.

**`screens/` (3)**
- `01` — card capture, front
- `02` — "Let's make sure you're covered": name + DOB only, then **"Find my
  plan"** — a verified-lookup path that avoids typing a member ID at all, with
  "I'll select my plan instead" as the fallback. [screen](https://mobbin.com/screens/ad671edd-17c2-4803-8bfd-a1dfd714a45d)
- `03` — post-booking confirmation: "This visit is in-network with
  UnitedHealthcare" + masked Member ID. Closes the loop on the data collected.

---

## Headspace — web (10 screens)
**`flow-verifying-insurance/`** — [flow](https://mobbin.com/flows/21fe61d2-00e0-4db3-8a31-be2d859151eb)

The cleanest end-to-end coverage flow in the set, and the best one for a
cost-anxious audience. Three-step progress header (Check In → Verify Insurance
→ Schedule appointment) that stays visible throughout.

1. "Who is your insurance provider?" — single search field, a savings nudge
   ("members save 70% on the cost of therapy"), and **"I'm paying out of pocket
   instead"** as a visible, non-punitive escape hatch.
2. Green in-network banner appears *before* asking for personal details —
   the reward lands before the effort.
3. Details form: first, last, DOB, **Member ID marked optional**, with
   "If you don't have your insurance card right now, you can enter it after
   choosing your therapist."
4. "Here's your estimated cost" — a concrete per-session number
   ($18.92/session), plus a candid upper bound ("Your cost may reach up to
   $149") and HSA/FSA mention.

---

## Warby Parker — iOS (4 screens)
**`flow-checking-benefits/`** — [flow](https://mobbin.com/flows/fc23098f-53eb-48cd-a813-2f5385eaca03)

Minimum-viable eligibility check. Three fields only — **name, DOB, ZIP** — no
member ID, no card. Entry point is a soft "Check and apply benefits" row inside
checkout rather than a gate. Result screen quantifies the win ("You can save an
average of $100") before asking for the carrier.

---

## CVS Health — iOS (2 screens)
- `01` — **Coverage type selection**: "I'll use private insurance / Medicare
  part B / Medicaid / I'll pay out-of-pocket / other coverage." The most
  directly relevant screen in the set for a Medicare-eligible population —
  it treats Medicare Part B as a first-class option rather than burying it in
  a payer list. [screen](https://mobbin.com/screens/b1f0c14a-8442-4835-a17a-8d27e85cc716)
- `02` — Add new insurance: separate front/back upload zones, a "Tips for card
  images" link, a combined-image checkbox, and **"Skip for now"** given equal
  visual weight to "Next."

---

## Alan — iOS (4 screens)
European health insurer. `screens/` covers the coverage hub (searchable by
need — "Glasses, labs, meditation"), an employer-coverage yes/no question for a
partner, an SSN capture for adding a child, and a cost simulator that shows the
employer/member split.

---

## Walmart — iOS (1 screen)
Pharmacy prescription-transfer interstitial: "Add insurance in seconds! Avoid
paying out of pocket for your prescriptions by adding insurance. You can also
add it later." — **Find my insurance** / **Skip insurance**. Good example of
justifying the ask with the member's own benefit at the moment of friction.

---

## Deel — web + iOS (9 screens) — *adjacent, B2B*
Employer-side healthcare-plan enrollment, not patient intake. Included for the
provider-then-plan two-step selection pattern (carrier radio list with a
"POPULAR" badge and a linked benefits PDF → plan dropdown → review). Skip this
folder if you only want member-facing intake.

---

## Cross-cutting patterns worth stealing

1. **Lookup beats typing.** Zocdoc's "name + DOB → Find my plan" and Warby
   Parker's "name + DOB + ZIP" both avoid the member ID entirely. For a 65+
   audience this removes the single hardest field in the flow.
2. **Show the in-network result before asking for details.** Headspace confirms
   coverage, *then* asks for the form. Effort follows reward.
3. **Member ID optional, card optional, always a skip.** Every consumer-health
   example here lets the member proceed without complete insurance data.
   CVS and Walmart give "Skip" equal weight to the primary action.
4. **Name the coverage type explicitly.** CVS lists Medicare Part B and
   Medicaid as top-level choices instead of hiding them inside a payer search.
5. **Justify the ask inline.** Zocdoc: "Some providers need to verify your
   coverage before a visit." Walmart: "Avoid paying out of pocket." Neither
   asks for data without saying why.
6. **End with a concrete number.** Headspace's "$18.92/session" and Warby
   Parker's "save an average of $100" both convert an admin step into a payoff.
