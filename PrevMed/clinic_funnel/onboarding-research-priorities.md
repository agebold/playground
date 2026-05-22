# PrevMed Onboarding Research — Prioritized for the Clinic Funnel

Team sharing doc. Source: *Designing the PrevMed Onboarding for Seniors 65+ — A Research-Backed Playbook.*
Prioritization weighted toward the **highlighted** insights in the PDF and applied to our current funnel:

> Landing → Coverage → Loading → Eligibility → Focus → Concern → Intake → Matching → Provider → Schedule → HIPAA → Consent → Phone → Confirmed

---

## Tier 1 — Highest priority (ship-blockers / biggest conversion levers)

### 1. Insurance verification is the single riskiest drop-off point
**Funnel steps affected:** Coverage → Loading → Eligibility
**Why it matters:** This is where seniors give up — and we have *three* consecutive insurance steps.
**Benchmarks (highlighted):**
- Form conversion: **23.1% at 3 fields → 17.0% at 5 → 11.4% at 7 → 6.9% at 10+** (Digital Applied 2026)
- Healthcare patient-registration form abandonment: **20–40%** (TAGLAB)
- Seniors are **~2× more likely** to give up on a task than younger users (NN/g)
- Seniors blame themselves **90%** of the time when they hit a problem (NN/g)
**What to do:** Make Coverage a **three-track** flow on one screen:
1. Photo capture of Medicare/MA card with OCR (Stedi / pVerify / Approved Admissions → CMS HETS 270/271)
2. Manual fallback: Member ID + DOB + name only
3. "I'll do this later" → phone concierge / scheduled call-back
**Tripwire for the team:** if Coverage drop-off > 30%, switch to phone-concierge as default.

---

### 2. Defer or make the phone number field optional
**Funnel step:** Phone (step 13)
**Benchmark (highlighted):** Making phone number optional reduced abandonment from **39% → 4%** (ConvertCart).
**What to do:** Either kill the dedicated Phone step or move it to post-confirmation. If we must collect, mark it optional and explain why we ask. This is the single cheapest 30+ point conversion lift available to us.

---

### 3. Plain-English HIPAA + 1 security badge above the fold
**Funnel steps:** Landing, Coverage, HIPAA, Consent
**Benchmarks (highlighted):**
- Adding security badges = **+12.3% conversions** (ConversionXL)
- Adding real-time social proof alongside trust badges = **+15% conversions** (Reform/ConversionXL)
- Older users explicitly look for physical address, support phone, and clinician credentials as **legitimacy cues** (NN/g)
**What to do:**
- On Landing: "Your information is private and protected" + SOC 2 / HITRUST badge (note: there is no official HIPAA logo — pair any badge with plain-English copy)
- Don't bury trust badges in the footer — repeat them next to sensitive submit buttons (Coverage, Consent)
- Show physical address + clinician credentials + visible phone number

---

### 4. Reading level: 6th–8th grade across the entire funnel
**Funnel steps:** ALL
**Benchmarks (highlighted):**
- 5th–7th grade reading level pages convert at a **10.8% median** in healthcare (Unbounce)
- 10th–12th grade copy *reduces* conversion by **55.6%** (Unbounce)
- "Trust" words ("proven," "recommended," "board-certified") **outperform** "fear" words ("harmful," "illness") (Unbounce)
**What to do:** Run every screen of the funnel through Hemingway Editor. Target 6th grade. Replace "Verify eligibility" with "Check your Medicare coverage," "Submit" with "Continue," etc. Audit HIPAA + Consent screens first — they're the densest.

---

### 5. Provider Matching screen must sell trust
**Funnel steps:** Matching → Provider
**Benchmarks (highlighted):**
- **81%** of older adults say telehealth is best with a known provider (AARP)
- If post-onboarding "did not attend first visit" > **15%**, the provider-matching screen is under-selling trust
**What to do:** On the Provider screen show **photo + full name + credentials (MD/DO/NP) + years of practice + 1-line "what I treat" + next available time** *before* asking for final confirmation. Add 2–3 age-matched testimonials ("Margaret, 72, AZ") — not influencer content.

---

### 6. Always show progress and one concept per screen
**Funnel steps:** ALL
**Benchmark (highlighted):** Always show progress ("Step 2 of 5") so users know the end is in sight (NN/g progressive-disclosure principle, 1995).
**What to do:**
- Add a visible step counter on every screen (we currently have 14 steps — consider compressing the user-visible count to ~5 logical groups: *Welcome → Coverage → About You → Pick provider → Confirm*)
- One question per screen on Coverage / Eligibility / Intake
- Save-and-resume email link on every step (the funnel is long; seniors will need to come back)

---

## Tier 2 — High impact, lower lift

### 7. Visible "Need help? Call (XXX)" on every step
**Benchmarks:**
- **66%** of older adults who don't have telehealth would prefer audio-only over video (AARP)
- **82%** of homebound older adults need caregiver help to complete a telehealth visit (Kalicki et al., J Am Geriatr Soc 2021)
- **11%** of Silent Generation consumers haven't tried virtual care because they found it "uncomfortable or too confusing" (Rock Health 2024)
**What to do:** Persistent ≥18pt phone number + "Request a call back" link. Critically, **do not hide it on the Coverage step** — that's the highest drop-off point.

---

### 8. Accessibility floor — design for the body, not the average
**Benchmarks:**
- **27.8%** of adults 71+ have measured vision impairment (JAMA Ophthalmology 2023)
- **67.9%** of adults 70+ have hearing loss; **97.6%** of those 90+ (NHATS 2023)
- **50.4%** of adults 65+ have arthritis (CDC MMWR 2023)
- **25.2%** mild cognitive impairment by ages 80–84 (NIH)
- Motor impairments cause error rates **up to 75% higher** on small targets (TestParty)
**What to do (specs):**
- Body text ≥ **18px** (NN/g notes people read 11% slower for every 20 years they age)
- Touch targets ≥ **44×44 px** (AAA, Apple HIG)
- Contrast ≥ 4.5:1 body, ≥ 3:1 UI components (WCAG 2.2)
- Built-in text-resize control on page (most seniors don't know browser zoom)
- Replace dropdowns with radio buttons when ≤5 options
- No disabled buttons — show plain-language inline errors instead

---

### 9. Add a "Helping a family member" entry path
**Funnel step:** Landing
**Benchmark:** **82%** of homebound patients (mean age 82.7; 46.6% with dementia) required caregiver assistance to complete a telehealth visit (Kalicki et al., 2021). Fewer than **3%** of caregivers have a designated proxy account industry-wide (Wolff et al., JMIR Aging 2022).
**What to do:** Add an "I'm helping a family member sign up" button on Landing, with a native proxy-account path and granular consent toggles (visit notes vs. billing). This is a **category-leading** move — almost no competitor has it.

---

### 10. Camera capture UX for Medicare card
**Funnel step:** Coverage
**Benchmark:** Inline validation; never block on a single low-quality image (Mitek, Kairos best practice — "face/card occupies 60–70% of frame").
**What to do:** Card-sized overlay, auto edge detection, manual capture fallback, gallery upload alternative, just-in-time permission prompt with reason ("We need your camera to read your Medicare card. We don't store the photo.").

---

## Tier 3 — Important but later

### 11. Legal floor — WCAG 2.2 AA by May 11, 2026
**Benchmark:** HHS Section 504 final rule (May 2024) — any Medicare/Medicaid-accepting entity must hit WCAG 2.1 AA by **May 11, 2026**. Website accessibility lawsuits hit **3,117 in 2025 (+27% YoY)**; healthcare is ~2–4% of filings but trending up. Settlements typically **$25K–$100K**.
**What to do:** Schedule axe + Lighthouse audit + one manual screen-reader pass before that deadline.

### 12. Distinguish Original Medicare / MA / Medigap in plain English
**Funnel step:** Coverage
**Why:** Many seniors don't know which plan they have. pVerify/Stedi can auto-detect MA from a "Medicare" card photo.

### 13. Audio-only consultation option at scheduling
**Funnel step:** Schedule
**Benchmark:** 66% of older non-users prefer audio-only (AARP).

### 14. Voice input for free-text intake fields
**Funnel step:** Concern / Intake

---

## Tripwire benchmarks to instrument from day one

| Metric | Threshold | Action if breached |
|---|---|---|
| Coverage step drop-off | > 30% | Switch to phone-concierge default |
| Overall onboarding completion | < 45% (Zuko baseline) | Audit field count + reading level |
| Post-onboarding "did not attend first visit" | > 15% | Provider matching screen is under-selling trust |
| Desktop vs. mobile completion | Watch gap | Desktop completes at 47% vs. 42% mobile (Zuko); 70+ prefers desktop for "important" tasks |

---

## What I'd recommend for the sharing session

**Lead with three numbers:**
1. **39% → 4%** (phone-number-optional impact)
2. **23.1% → 6.9%** (form conversion as fields go from 3 to 10+)
3. **55.6%** (conversion drop from 6th to 12th grade reading level)

These three frame the entire discussion: *fewer fields, simpler words, optional sensitive data.*

**Then walk the team through our current 14-step funnel and ask:** which steps can we merge, which fields can we defer to post-confirmation, and where are we writing above an 8th grade reading level?

---

## Appendix — Additional insights from secondary sources

Sources: Parv Sondhi, *Optimizing Onboarding Flows for Digital Healthcare Apps* (Product Coalition); Dogtown Media, *Designing Healthcare Apps for the Elderly* (2024).
*Note: the Product Coalition article was only available via search summary, not full text — its insights are higher-level than the primary playbook.*

### A. Don't re-ask for information you already have (or can calculate)
**Source:** Product Coalition.
**Why it matters for us:** Our funnel currently asks for some data in multiple places (DOB at account creation, then again at eligibility; possibly name + DOB collected both at Coverage and Intake). Re-asking signals a sloppy system and erodes trust — especially with seniors who already doubt their own ability and assume *they* made a mistake.
**What to do:** Audit the 14 steps for any field appearing twice. Pre-fill anything we already know. If we collected it from the Medicare card photo OCR, never ask for it again as a typed field.

### B. Use onboarding answers to *personalize* later screens
**Source:** Product Coalition.
**Why it matters for us:** We're already collecting Focus + Concern + Intake. We should be using those answers to tailor the Provider Matching screen ("Dr. X specializes in **the heart concerns you mentioned**") and the Confirmation screen ("We'll see you about your **{concern}** on {date}").
**What to do:** Echo the user's own words back to them at Matching + Confirmed. Cheap to build, big trust lift.

### C. Lean on familiar mental models — don't invent new patterns
**Source:** Dogtown Media.
**Why it matters for us:** Seniors leverage existing mental models. Custom UI controls (custom dropdowns, novel date pickers, unique navigation) cost them disproportionately more cognitive effort.
**What to do:**
- Use native OS form controls wherever possible
- Standard "Back" and "Continue" buttons in expected positions (Continue on right, Back on left)
- Icons that look like what they do (a *phone* icon for calling, an *envelope* for email) — no abstract glyphs

### D. Embedded help: searchable FAQ + live chat + phone, not just phone
**Source:** Dogtown Media.
**Why it matters for us:** We have a "Need help? Call" link in Tier 2, but Dogtown flags that the highest-effort users benefit from **searchable** help embedded in-flow, not only a callback option.
**What to do:** Add a small "?" help icon on each step that opens a step-specific FAQ ("Why do you need my Medicare card?" "What if I don't have it with me?"). Keep the phone number too.

### E. Interactive walkthroughs / tooltips during first session
**Source:** Dogtown Media.
**What to do:** First-time visitors to Landing get a 2–3 step coachmark tour highlighting *(1) the support phone number, (2) the "I'm helping a family member" path, (3) the progress indicator*. Skippable. Critically: **only once**, and never block forward motion.

### F. Demographic / market-sizing data for the deck
**Source:** Dogtown Media.
**Useful stats for framing the share-out:**
- **1.5 billion** people will be elderly globally by 2050 (UN projection, up from 727M in 2020) — *why this market matters*
- **95%** of older adults have at least one chronic condition; **80%** have two or more — *why a clinic funnel for this audience is high-stakes*

### G. Post-onboarding retention is part of onboarding
**Source:** Dogtown Media.
**Why it matters for us:** "Confirmed" is not the end of our job. The 24–48 hours between booking and the first visit is when seniors get cold feet (see Tier 1 #5 — the >15% no-show tripwire).
**What to do (post-Confirmed):**
- Confirmation email + SMS (sender = the named clinician, not "PrevMed Team")
- Day-before reminder with the provider's photo + a one-tap "Call us if you need help connecting" button
- Optional: a "Your appointment is tomorrow" voice call for users who picked the audio-only fallback
- Celebrate the *first* completed visit ("You did it — here's what's next") rather than gamifying onboarding itself, since infantilizing UX backfires with this audience

### H. Test with actual seniors — guidelines are not enough
**Source:** Dogtown Media (direct quote framing): *"Standardized guidelines alone miss personalized barriers."*
**Why it matters for us:** WCAG 2.2 AA + 18pt body + 44×44 targets get us to the floor. They do not catch real-world failures — a senior with arthritis trying to hold a phone steady to photograph a Medicare card; a user whose hearing aid doesn't pair with their browser.
**What to do:** Plan ≥5 moderated sessions with users 65+ *before* shipping Stage 1. Recruit a mix: independent, caregiver-assisted, and homebound. We already have [user-test-script.md](user-test-script.md) — make sure the script covers the Coverage step specifically.

---

## What I'd add to the share-out from this appendix

One slide: **"What we're going to do AFTER Confirmed."**
That's the gap between our current funnel (ends at step 14) and the >15% no-show tripwire. The Dogtown insight reframes onboarding as a 7-day arc, not a 14-screen arc — and that reframing is a useful provocation for the team.
