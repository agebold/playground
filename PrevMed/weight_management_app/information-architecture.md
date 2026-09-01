# Weight Management App — Information Architecture

**Companion to** [personas-doc.md](personas-doc.md) and [user-journey.md](user-journey.md).
Audience: 65+ US Medicare-eligible · Bold GLP-1 Companion · Q3 2026

---

## The structure

Four flat tabs in the bottom nav. Profile lives in the top-nav (avatar). Every screen is ≤ 2 taps from any tab.

| # | Tab | What it holds |
| --- | --- | --- |
| 1 | 🏠 **Home** | "Ask anything" chat (text + photo). One *Today's one thing* card with a "Why this today?" reason. Snapshot peeks for appointment, Rx, GLP-1 week. Persistent **"Something doesn't feel right"** safety-net button. |
| 2 | 📈 **Progress** | Body composition is the hero — weight, muscle, fat, bone density, fat distribution combined in one module with an inline "Take a new scan" CTA. Then: GLP-1 dosage (week X of 16 · current dose · refill · report a problem · pause), weekly steps, protein-goal-reached, food/sleep placeholder (fills if a device is linked). |
| 3 | 🧭 **Explore** | Personalized feed of workouts, recipes, restaurant guidance, and short articles. Filters: seated · balance-safe · joint-friendly. |
| 4 | 👩‍⚕️ **My Care** | Appointments (upcoming, past, schedule, reschedule), About my clinician, contact / 911 callout. |

**Top-nav 👤 Profile** — Personal info · Medicare & coverage · Billing ($50/mo · 78% pay $0) · GLP-1 prescription (admin) · Notification settings · Share with my PCP · Trusted contacts · What Bold knows about me · Linked external devices.

---

## Three safety nets

Older-adult digital weight-loss programs succeed when the app pairs with human support, transparent data, and easy escalation (validated by [Frontiers in Digital Health 2022](https://www.frontiersin.org/journals/digital-health/articles/10.3389/fdgth.2022.886783/full), [PMC11150599](https://pmc.ncbi.nlm.nih.gov/articles/PMC11150599/)).

1. **"Something doesn't feel right"** — pinned to Home (always visible) and surfaced as "Report a problem" inside the GLP-1 dosage section. One tap → pre-filled clinician escalation with topic picker, bypasses normal SLA. Not 911 (911 is its own surface).
2. **Trusted contacts (opt-in)** — Profile. User names 1–2 people. Notified only on a transparent allow-list (missed scan + missed check-in for 30 days · clinician-flagged safety event · user-triggered "tell my contact I need help"). Nothing else fires.
3. **"What Bold knows about me" (quarterly)** — Profile. Plain-language summary of what data was collected, what the clinician saw, what was shared with the PCP, and what changed. Any share is revocable here.

All three are introduced once during onboarding so the user knows they exist before they're needed.

---

## Deliberate research deviation

"Linked external devices" in Profile conflicts with [principles.md #8](data/synthesis/principles.md) (*"no wearables, no extra devices"*). Included on purpose as an opt-in, Profile-only surface — never shown in onboarding, marketing, or Home. To be logged in [data/synthesis/decisions.md](data/synthesis/decisions.md) at ship.

---

## Journey ↔ IA mapping

| Journey stage | IA home |
| --- | --- |
| 0–3 Discover · Coverage · Schedule · Intake | Pre-auth funnel (Landing → Coverage check → Schedule → Account → Intake) |
| 4 Prescription & delivery | Profile → GLP-1 prescription (admin) · Progress → GLP-1 dosage section |
| 5 Care plan reveal | Home → Today's one thing + chat |
| 5a AI meal-prep | Home chat bar (entry) · Explore → Recipes (browse) |
| 5b Strength & balance | Explore → Workouts |
| 5c DEXA-grade body comp | Progress → body composition module |
| 6 Chat with provider | Home chat bar (clinician routing) |
| 7 Ongoing care & milestones | My Care → Appointments · Progress → scan history + GLP-1 progression |
