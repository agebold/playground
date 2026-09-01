# MVP3 — Post-Visit Experience Design Brief

*Updated 2026-07-09, folding in the MVP3 project walkthrough (Tzuyi Lee × Chris Lloyd, 2026-07-07).*

**Purpose of this doc**

- Align on the problem and goals before designing.
- Communicate the areas of focus and what we plan to build.
- Invite input on the problem, the opportunity, and the trade-offs we haven't resolved.

![Screenshot 2026-07-06 at 6.30.09 PM.png](Screenshot%202026-07-06%20at%206.30.09%20PM.png)

> **The one call from the walkthrough:** go deep on **one** area — **side-effect management** — and keep the other two (**medication usage/education** and **prescription status**) lightweight but present, so the experience is still end-to-end. Anything heavier gets handled through other touchpoints (appointments, Care Coordinator calls, lifecycle messaging) for now.

---

## Business context

Members can now get GLP-1 medication through Bold. The moment a member starts, we are responsible for keeping them safe on it. This phase builds the member-facing and clinical machinery to do that — side-effect tracking, medication management/usage, and prescription status — after the prescribing visit.

- **Safety and trust**
    - The right guidance when starting a GLP-1 reduces concern and helps prevent side effects.
    - A member who reports a symptom must be routed to the right level of support and the right personalized content (Today's Plan).
- **Differentiation**
    - Provider-supervised, lifestyle-integrated care is what separates Bold from direct-to-consumer GLP-1 sellers that offer no monitoring or support. The post-visit experience is the biggest differentiator between Bold and other online GLP-1 sellers — and the reason MVP3 exists.

## Goals & Success Metrics

- **Primary success metric — Rx-to-first-dose activation rate:** the % of prescribed patients who confirm their first dose taken within 14 days of prescription.
- **Supporting metrics**
    - Early discontinuation rate (weeks 0–8) attributable to side effects — target: down.
    - % of logged symptoms resolved in-product (reassurance / at-home care) without provider escalation.
    - Adherence: confirmed-dose rate per cycle.
    - Continuation / refill rate at month 1 and month 3.
    - Appointment retention / return-visit rate — the in-between-visit care is meant to bring members back.
    - Patient-reported confidence / reassurance (post-fulfillment and post-first-dose survey).

## Target users

**Members**

- **Primary** — getting GLP-1s through Bold (start from Bold or transition to Bold).
- **Secondary** — on GLP-1s, uses Bold as a companion service (lifestyle appointment + app features).

**Operational**

- Provider, Care Coordinator, PCP (final data sharing?). The Care Coordinator sits between self-care and the provider in the escalation ladder.

## Assumptions

> **Member:** If we give members personalized medication guidance, a low-friction way to report symptoms, and the right care at the right time, patients are more likely to activate and stay on the medication.

> **Operational:** Using side-effect data and clear escalation rules, clinicians can monitor members more efficiently, make better care decisions, and — later — the product can adjust fitness and nutrition guidance based on symptom data.

> **Business:** With higher patient activation and retention and more efficient clinical escalation, we can increase safety and reduce patients' anxiety, improving both patient and business outcomes. (company goal)

## Problem Statement

**Members**

How might we help members feel safe and confident starting GLP-1 medication and stay on it by making symptom reporting low-effort and connecting them to the right guidance or care when it matters most?

**Operational/system**

How might we capture side-effect signals during high-risk windows with minimal member effort, so the product can efficiently triage/escalate to providers and adjust guidance in the right moment to prevent emergencies?

## Design Considerations

**Principles**

- **Meet members where they are.** A member new to GLP-1 and one switching to Bold need different first experiences.
- **Guidance, not tracking.** Members want help *before* a decision, not bookkeeping. Every input must earn its place.
    - Side-effect logging triggers the appropriate help in the moment.
    - Dose taken by default. Bold notifies patients (SMS/email) but doesn't require them to log.
    - Missed dose is a manual, guided path — the member can say "I missed a dose" and get guidance.
- **The platform deals with the complexity.** Avoid walls of text and one-size-fits-all flows; give one clear guidance based on the member's input, not an overwhelming set of choices.
    - Progressive personalization by member stage — companion vs. Bold.

**Existing Patterns/Features to Utilize**

- Healthie journaling / side-effect tracking: https://docs.gethealthie.com/guides/journal/ — connect via the **Healthie API** (preferred over a hand-off form) so symptom data lands on the member's chart.
- Healthie Rx — medication delivery info.
- Care Plan personalization — side effects become another input *(later)*.
- ML recommendation — symptom input → adapted fitness/nutrition *(later)*.

## Clinical Safety & Guardrails

- **Not an emergency service, not real-time monitoring.** Say so plainly in the UI, with an always-visible 911 path. Don't let the interface imply someone is watching a live feed.
- **Scope of advice.** The app offers guidance and triage, never diagnosis or dose changes. Dose decisions belong to a clinician.
- **Response-time commitments.** Define a service-level agreement per tier (self-care / CC / provider / on-call) and honest after-hours coverage.
- **Red-flag capture.** Severe symptoms route straight to a clinician and are documented as adverse events.

## Open questions

Questions we still need to answer to design the in-scope work:

- **Clinical triage rules** — which symptoms, what severity scale, and what routes to CC vs. provider vs. 911? Needs Dr. Deeb's sign-off on the product translation. (Shapes Log → Triage.)
- **Product architecture / IA** — how do the three areas fit into the app, and where? Lo-fi first, with Isabella.
- **Escalation tiers + response-time SLAs** — what do we honestly promise per tier (self-care / CC / provider / on-call), and what's the after-hours coverage, given no real-time monitoring and no two-way messaging?
- **Today's Plan acknowledgment surface** — what does "we heard you" look like without implying live monitoring or a program change?
- **Exposable prescription statuses** — which statuses can we actually pull (blueprint / Dosespot / Healthie), and can pharmacy price be shown before pickup?
- **Member-stage differentiation** — how different should the first experience be for new-to-GLP-1 vs. switching-to-Bold?

## Journey Maps

‣

![image.png](image.png)

**Directional:**

1. **Learn** — educate members to mitigate side effects.
2. **Log** a symptom in seconds with a severity rating.
3. **Triage by severity** — mild → reassurance + at-home guidance (shared with provider); concerning → escalate to the CC, provider/on-call, or 911. A Care Coordinator sits between self-care and the provider.
4. **Adjust** — symptom and adherence data inform dose decisions and can later recalibrate the fitness/nutrition plan. **For MVP3 this is acknowledgment + provider handoff only** — recalibrating Today's Plan from symptoms is deferred.

## Research & Supporting knowledge

- ‣ — Lecture
- https://bold-vxk5.dovetail.com/docs/4ZPHhdhtJ0y3lQdfR68B54
    - ‣ — User research highlight
- Clinical protocol / GLP-1 Weight Management Guideline (Dr. Deeb) — the source for side-effect severity, mitigation content, and escalation rules.

![image.png](image.png)

![image.png](image.png)

- [x]  Bullseye research
- [x]  Clinical lectures of how side effects work and how to manage them
- [x]  Market research on how competitors surface side-effect and dosage tracking
- [ ]  Pharmacy fill status can be tracked through Healthie, but not sure if price can be shown before picking up

## Scope

### In scope

- **Side-effect Learn → Log → Triage** with a severity rating, via the Healthie API — focus on the few most common symptoms.
- **Severity/mitigation education content** surfaced by the reported symptom and its severity, plus **escalation tiers** (self-care / CC / provider / 911).
- **High-risk-window escalation** — the start and dose-increase windows raise real-person support, then ease off.
- **Hard-coded structured symptom survey** (not an AI chatbot) — "are you experiencing X? rate it" — that generates a Healthie provider note and can create a Care Coordinator task (e.g., reach out / offer another visit); content co-developed with Chris + Dr. Deeb from the clinical protocol.
- **First-dose education** the moment medication arrives (branch by form factor — daily pill vs. weekly pen), **what-to-expect by week**, **dose-day reminders**, **missed-dose guide**.
- **Assume-taken dose model** + a manual "I missed a dose" affordance.
- **Prescription status visibility** — a patient-facing subset of the provider flow (prescribed → consent/sign → signed → sent to pharmacy).
- **Today's Plan symptom acknowledgment** (reflection only) — "we heard you," "this was sent to your provider," an always-visible emergency path, and a gentle "take it easy today" if symptoms are bad; it does not re-generate the program.
- **Empty state** for non-GLP-1 members — the medication module is always shown; no on/off GLP-1 toggle in stage 1.
- **Progressive personalization** by member stage (new-to-GLP-1 vs. switching-to-Bold).

### Out of scope

- AI chat / AI triage / any AI interactive escalation to providers.
- Two-way member↔provider messaging (short-term = a link into Healthie).
- Dynamic regeneration of the fitness/nutrition Today's Plan from symptom data (reflection only for now).
- Full native reminder system with per-drug reminder protocols.
- Prescription fulfillment logistics — pharmacy, edits, ship-to-patient, delivery (Care Coordinator + lifecycle).
- Real-time monitoring; CCM (chronic condition management) expansion.
- Top-of-funnel appointment-conversion work — the A/B-test / FAQ / drop-off discussion at the end of the walkthrough is a separate funnel-conversion workstream, not part of this post-visit brief.
- **Cross-functional prerequisites (required, but tracked separately):** account creation / passwords (members have none today, and this must ship for the experience) and 2FA enablement (designs exist; needs Chris G to turn it on for this product).

## Parking lot

- Ship-to-patient fulfillment.
- AI chat + triage — once HIPAA-compliant LLM infrastructure exists (triage, not coaching); tied to the company healthspan objective.
- Two-way member↔provider messaging.
- Symptom-driven fitness/nutrition adaptation in Today's Plan.
- PCP as an active node in the escalation ladder / bidirectional data sharing.
- CCM (chronic condition management) expansion — e.g., NA/nurse-assistant messaging.
- Per-tier response-time SLAs + honest after-hours coverage (needs definition).
