# Weight Management App — User Goals (from the service blueprint)

**Audience:** 65+ · US Medicare-eligible · Bold GLP-1 Companion · Q3 2026
**Source:** [Roadmapping — Weight Management Program (Figma)](https://www.figma.com/board/zT8ApJwobw6L8C0XWBiV3z/Roadmapping---Weight-Management-Program?node-id=509-10436)
**Companion to:** [information-architecture.md](information-architecture.md) · [user-journey.md](user-journey.md)

## What this is

The service blueprint describes the journey **operationally** — touchpoints, staff actions, and system events. This doc re-expresses the **Patient lane** (the top swimlane) as **first-person user goals** (jobs-to-be-done), so the app structure can be derived from what the member is trying to accomplish rather than from the operational steps.

**Method:**
- Patient lane only. Provider/CC and Systems lanes are intentionally excluded.
- Marketing-channel nodes (Meta Ads, Campaigns) are folded into the "entry" goal — they aren't app surfaces.
- Each goal is grounded in `data/synthesis/` (findings, principles, personas, positioning, value-props) — anchors in the third column.
- Goals only — no clustering into tabs/features. See the [master list](#master-list--unique-user-goals) at the end for de-duplicated raw material.

---

## 1. Pre-appointment

| Patient touchpoint | User goal | Anchor |
| --- | --- | --- |
| Entry / Meta Ads / Landing page — *"Lose weight without losing strength… covered by Medicare"* | "I want to lose weight without ending up weaker — and I want to know if it's actually covered for me." | findings #17, #26; principle #13, #14 |
| Eligibility check | "Before I get my hopes up, I want to know whether I qualify and whether Medicare will cover it." | principle #14; sticky "shouldn't only focus on Bridge eligibility" |
| Sign up for Bold WM app | "I want to get started without a confusing sign-up." | senior-onboarding |
| Book appointment | "I want to talk to a real doctor about this soon, at a time that works for me." | findings #33 |
| Introduce Bold / brief intake | "I want to tell my story once, simply, before the visit." | principle #1 |
| Feature: Body scan | "I want to see what my body is actually made of — muscle and fat — not just a scale number." | findings #6; value-prop #3 |
| Feature: Functional assessment | "I want to know what my body can safely do right now." | value-prop #4 |
| Feature: pre-appt Today | "While I wait for my appointment, I want to know the one thing to do today." | IA "Today's one thing" |
| Email & SMS notifications (2d/1d/1h/10m/1m) | "I don't want to miss or forget my appointment." | NN/g memory; recognition-over-recall |

## 2. Initial appointment (45–60 min)

| Patient touchpoint | User goal | Anchor |
| --- | --- | --- |
| Comprehensive intake | "I want the doctor to actually understand my history before deciding anything." | findings #33 (long appt) |
| Learn about the program and GLP-1 options | "I want to understand my GLP-1 options — especially whether I can take a pill instead of a shot — and what to expect." | findings #2; personas |
| Discuss lifestyle recommendations & schedule 2nd appt | "I want a clear next step and a plan I can actually do." | findings #35 (doable) |

## 3. Post-first appointment

| Patient touchpoint | User goal | Anchor |
| --- | --- | --- |
| Submit baseline measurements (height, waist, sit-to-stand) in app | "I want to record my starting point easily, without special equipment." | principle #8, #12 |
| Feature: Body scan / Functional assessment (recurring) | "I want to see my body composition and what I can safely do — measured, not guessed." | findings #6, #28 |
| Confirm lab orders with provider | "I want to be sure the right labs were ordered for me." | — |
| Receive email confirmation with lab requisition details | "I want clear instructions on exactly what labs I need and where to go." | clarity (CLAUDE.md UX) |
| Schedule lab through email | "I want to book my lab visit without jumping through hoops." | senior-onboarding |
| Visit the lab site | "I want to get my labs done without paperwork surprises or extra cost." | sticky (insurance/reimbursement) |
| Patients receive care plan within 48 hours | "After my visit, I want my personalized plan quickly — not weeks later." | findings #34, #35 |
| Feature: personalized Today | "I want to open the app and see the one thing to focus on today, and why." | IA "Today's one thing / Why this today?" |
| Receive lab results (Healthie, within 30 days) | "I want to know when my lab results are ready and what they mean for me." | — |
| Email & SMS notifications (2nd-appt reminders) | "I don't want to miss my GLP-1 appointment." | memory |

## 4. Second appointment — GLP-1 (30 min)

| Patient touchpoint | User goal | Anchor |
| --- | --- | --- |
| Lab result review | "I want the doctor to walk me through my labs and whether this medication is safe for me." | persona ("safe for someone my age") |
| GLP-1 safety education (side effects, benefits, admin prep) | "I want to know what side effects to expect and how to handle them before I start." | findings #3; personas |
| GLP-1 consent form | "I want to understand what I'm agreeing to before I sign." | — |
| Select desired medication and pharmacy | "I want to choose the medication that fits me (ideally a pill) and a pharmacy that's convenient." | findings #2 |

## 5. Post-second appointment

| Patient touchpoint | User goal | Anchor |
| --- | --- | --- |
| Alert: your medication is ready for pickup | "I want to know the moment my medication is ready, and where to get it." | (blueprint example) |
| $50 out-of-pocket at pharmacy | "I want no surprises at the pharmacy — I want to know exactly what I'll pay." | findings #19; principle #11 |
| Reinforce safety: what to watch for / how to notify us | "I want to know what's normal, what's not, and how to reach someone fast if something feels wrong." | findings #5; IA safety-net |
| Feature: symptom tracking | "I want an easy way to tell Bold how I'm feeling — without it turning into a diary." | principle #1 |
| Feature: step-by-step injection guide & get help | "When it's time for my dose, I want simple step-by-step help so I don't do it wrong." | value-prop #1 |
| Feature: dose-day reminder & tracking | "I want a reminder on my dose day so I take it on schedule." | BCT: action planning |
| Logs symptom with severity | "When I don't feel well, I want to report it quickly and find out how serious it is." | findings #3, #5 |
| Reassure & offer at-home care (mild) | "For minor side effects, I want reassurance and simple things I can do at home." | findings #5 |
| Escalate: on-call / emergency / primary care (concerning) | "If it's serious, I want to reach the right help immediately." | IA safety-net #1 |
| Share symptom data with provider | "I want my provider to see how I've been doing, so I don't have to repeat myself and nothing falls through the cracks." | value-prop #6; findings #5 |
| Email & SMS notifications (follow-up reminders) | "I don't want to miss my follow-up." | memory |

## 6. Follow-ups

| Patient touchpoint | User goal | Anchor |
| --- | --- | --- |
| Review dosage, progress, symptoms | "I want to see how far I've come and know whether my dose should change." | findings #34; value-prop #6 |

## 7. Post follow-ups

| Patient touchpoint | User goal | Anchor |
| --- | --- | --- |
| Billing via Stripe | "I want my monthly payment to be simple and predictable ($50)." | findings #19; principle #11 |

---

## Master list — unique user goals

De-duplicated across all phases. Raw material for defining the app structure. Recurring goals (body scan, personalized Today, appointment reminders) are listed once.

**Getting in the door**
1. "I want to lose weight without ending up weaker — and I want to know if it's actually covered for me."
2. "Before I get my hopes up, I want to know whether I qualify and whether Medicare will cover it."
3. "I want to get started without a confusing sign-up."
4. "I want to talk to a real doctor about this soon, at a time that works for me."
5. "I want to tell my story once, simply, before the visit."

**Understanding my body & starting point**
6. "I want to see what my body is actually made of — muscle and fat — not just a scale number."
7. "I want to know what my body can safely do right now."
8. "I want to record my starting point easily, without special equipment."

**Knowing what to do next**
9. "I want to know the one thing to do today, and why."
10. "I want a clear next step and a plan I can actually do."
11. "After my visit, I want my personalized plan quickly — not weeks later."

**Labs**
12. "I want to be sure the right labs were ordered for me."
13. "I want clear instructions on exactly what labs I need and where to go."
14. "I want to book my lab visit without jumping through hoops."
15. "I want to get my labs done without paperwork surprises or extra cost."
16. "I want to know when my lab results are ready and what they mean for me."

**Deciding on the medication**
17. "I want the doctor to walk me through my labs and whether this medication is safe for me."
18. "I want to understand my GLP-1 options — especially whether I can take a pill instead of a shot — and what to expect."
19. "I want to know what side effects to expect and how to handle them before I start."
20. "I want to understand what I'm agreeing to before I sign."
21. "I want to choose the medication that fits me (ideally a pill) and a pharmacy that's convenient."

**Getting & taking the medication**
22. "I want to know the moment my medication is ready, and where to get it."
23. "I want no surprises at the pharmacy — I want to know exactly what I'll pay."
24. "When it's time for my dose, I want simple step-by-step help so I don't do it wrong."
25. "I want a reminder on my dose day so I take it on schedule."

**Feeling safe while on it**
26. "I want to know what's normal, what's not, and how to reach someone fast if something feels wrong."
27. "I want an easy way to tell Bold how I'm feeling — without it turning into a diary."
28. "When I don't feel well, I want to report it quickly and find out how serious it is."
29. "For minor side effects, I want reassurance and simple things I can do at home."
30. "If it's serious, I want to reach the right help immediately."
31. "I want my provider to see how I've been doing, so I don't have to repeat myself and nothing falls through the cracks."

**Staying on track**
32. "I want to see how far I've come and know whether my dose should change."
33. "I don't want to miss or forget my appointments (initial, GLP-1, follow-up)."
34. "I want my monthly payment to be simple and predictable ($50)."
