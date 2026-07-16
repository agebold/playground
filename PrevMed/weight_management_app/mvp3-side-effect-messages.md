# MVP3 — Side-Effect Messages (member-facing triage copy)

*Finished member-facing copy for the **Learn → Log → Triage** flow: the message a member reads after
they log a side effect and pick a severity. Drop-in content for the `SYMPTOMS` model + `renderConsolidatedTriage()`
in [mvp3-side-effect-prescription.html](mvp3-side-effect-prescription.html). Scoped by
[mvp3-post-visit-design-brief.md](mvp3-post-visit-design-brief.md).*

**Sources**

- **Clinical:** *GLP-1 Side Effect Escalation Mapping* (L1→L2→L3), derived from **Bold Care GLP-1
  Weight Management Guideline v1.0, §12** (effective 2026-06-30, CMO Dr. Sandeep Palakodeti) —
  distilled in [data/synthesis/clinical-protocol.md](data/synthesis/clinical-protocol.md) §10/§12.
- **Voice:** CLAUDE.md · Bold AI Chat Agent tone spec · [data/synthesis/principles.md](data/synthesis/principles.md)
  · [data/synthesis/positioning.md](data/synthesis/positioning.md) (user-need *"Tell me why the clinician
  matters"*).

> ⚠️ **Status: product translation of clinical triage — NOT yet cleared for ship.** The level→tier
> routing below needs **Dr. Deeb / clinical sign-off** (see the design brief's open questions and
> [Flags for clinical review](#flags-for-clinical-review)). Copy is drafted to Bold voice; clinical
> routing is provisional.

---

## How to read this deck

A member reports a symptom, then picks the severity that sounds most like their day. The severity **is**
the triage signal — no long survey. Each severity maps to one of four **action tiers**, and each tier has
one written message.

| Tier | UI (existing CSS) | What it means | Dose line |
|---|---|---|---|
| **Self-care** | `.triage.self` (green) | Common, manageable at home | Keep taking as prescribed |
| **Care-team check-in** | `.triage.concern` (amber) | Worth a look, not urgent | *Hold next dose until they weigh in* (when flagged) |
| **Urgent — today** | `.triage.urgent` (new, red-amber) | Reach care team same-day | Hold next dose |
| **Emergency — 911** | `.triage.emergency` (red) | Call 911 / ER now | Hold medication until a clinician clears restart |

**Source tags** on each message show what is protocol vs. design overlay:
`[§…]` = verbatim from the guideline · **no tag** = a level with **no** protocol basis (a design choice,
flagged for review).

---

## Voice & safety rules (applied to every message)

- **Warm, plain-spoken, agency-affirming.** No elderspeak, no "shoulds," no decline-as-inevitable
  framing. "Many people find…", "here's what helps," "you caught this early."
- **Never diagnose. Never change the dose.** We only ever tell a member to **pause**, never to stop for
  good. Two reversible pauses exist: **"hold your next dose until your care team says otherwise"** (the
  care-team and urgent tiers), and — only for the emergency tiers where the guideline itself says *hold
  medication, do not restart* (§12 suspected pancreatitis; acute RUQ + fever) —
  **"hold your medication until a clinician says it's okay to restart."** We never say "discontinue" or
  "stop for good"; that is the provider's conversation.
- **Always a next step; never a dead end.** Every message ends in an action.
- **Not an emergency service.** Always-visible 911 path; never imply live monitoring.
- **Format:** 6th–8th grade · sentences under 20 words · spoken portion ≤ ~600 characters (tips render as
  a bulleted list) · **no emojis** (Phosphor UI icons are fine) · bold labels only when 3+ items aid scanning.
- **From "we" / "your care team" / "Dr. name"** (placeholder provider, matching the prototype). Not an
  AI persona.
- **Honesty with reassurance:** pair the frequency with the fix so it reads *managed, not terrifying*
  (`clinical-protocol.md` §10). Tips trace to Guideline §12.

---

## Reusable blocks

Referenced by the messages below so the copy stays consistent.

- **Shared chip (self-care):** `Shared with Dr. name`
- **Sent chip (escalated):** `Sent to Dr. name as a note`
- **48h SLA line:** "Your care team will reach out within 48 hours. You don't need to do anything else
  right now." *(placeholder — see flag #5)*
- **Hold-dose line:** "Hold your next dose until your care team weighs in — that's a safe pause, not a
  setback."
- **Urgent-today line:** "Reach your care team today. If you feel faint, very weak, or dizzy, call 911 —
  that's the fastest help."
- **Emergency block:** "Call 911 or go to the nearest ER now. Hold your medication until a clinician tells
  you it's okay to restart." + footer "Bold isn't an emergency service and can't watch in real time — 911
  is the fastest help."
- **Always-on footer (every screen):** "Bold isn't an emergency service. If this is a medical emergency,
  **call 911**."

---

## 1. Nausea

**Member label:** "Nausea" · **Frequency:** very common (30–50%)

**L1 · "I can still eat and drink"** — `[§12]` · self-care · *~200 chars*
> **This is common — and it usually eases.**
> About 1 in 3 people feel some nausea when they start or increase dosage. It's your body adjusting, and it tends to settle
> over the next few weeks. Here's what helps many people:
> - Eat small meals through the day instead of big ones
> - Go easy on greasy or fried foods
> - Sip water often — ginger tea settles many stomachs
> - Anti-nausea medicine is an option — just ask your care team
>
> *Shared with Dr. name.* → **[See what to expect this week]** **[Done]**

**L2 · "It's affecting my meals — I'm eating much less"** — care-team (hold) · *~290 chars*
> **Let's get your care team's eyes on this.**
> Nausea this strong is worth a closer look. Hold your next dose until your care team weighs in — that's
> a safe pause, not a setback. Small sips of water and bland foods can help in the meantime.
> We've sent this to Dr. name. Your care team will reach out within 48 hours.
> → **[Call my care team]** **[Done]**

> *No guideline basis (no tag).* §12's **only** nausea escalation is "unable to eat/drink >24h → hold
> dose, hydrate, contact provider." "Eating much less" is a design middle tier, and it holds the dose
> *earlier* than §12 does. Confirm the earlier hold with Dr. Deeb. See flag #1.

**L3 · "I can't keep food or water down"** — `[§12 + §8.2]` · urgent-today (hold) · *~250 chars*
> **This one needs care today.**
> Not keeping food or water down can wear you out fast. Hold your next dose and reach your care team
> today. If you feel faint, very weak, or dizzy, call 911 — that's the fastest help.
> We've flagged this for Dr. name as urgent. → **[Call care team]** **[Call 911]**

---

## 2. Vomiting

**Member label:** "Vomiting" · **Frequency:** common (10–20%)

**L1 · "Once, and I can keep fluids down"** — `[§12]` · self-care · *~230 chars*
> **This can happen — and it usually settles.**
> Throwing up once is uncomfortable, but it often passes as your body adjusts. The main thing is staying
> hydrated. Here's what helps:
> - Take small sips of water or an electrolyte drink (broth, coconut water)
> - Rest your stomach, then try small, bland foods
> - Go easy on greasy or heavy meals
>
> *Shared with Dr. name.* → **[See what to expect this week]** **[Done]**

**L2 · "A couple of times today"** — `[§12 + §8.2]` · care-team (hold) · *~280 chars*
> **Let's loop in your care team.**
> Throwing up a couple of times is worth a look, mostly so you don't get dehydrated. Hold your next dose
> until your care team weighs in — that's a safe pause, not a setback. Keep sipping fluids for now.
> We've sent this to Dr. name. Your care team will reach out within 48 hours.
> → **[Call my care team]** **[Done]**

**L3 · "More than twice, or I can't keep fluids down"** — `[§10.3]` · urgent-today (hold) · *~240 chars*
> **This one needs care today.**
> Throwing up this much can dry you out quickly. Hold your next dose and reach your care team today. If
> you feel faint, dizzy, or very weak, call 911 — that's the fastest help.
> We've flagged this for Dr. name as urgent. → **[Call care team]** **[Call 911]**

---

## 3. Diarrhea

**Member label:** "Diarrhea" · **Frequency:** common (10–20%)

**L1 · "A couple of loose stools, feeling okay"** — `[§12]` · self-care · *~210 chars*
> **Common early on — and manageable.**
> A few loose stools happen as your body adjusts, and it usually settles. Staying hydrated is the main
> thing. Here's what helps:
> - Drink extra fluids with electrolytes (broth, coconut water)
> - Try bland foods — banana, rice, applesauce, toast
> - Over-the-counter loperamide can help — just ask your care team
>
> *Shared with Dr. name.* → **[See what to expect this week]** **[Done]**

**L2 · "Several times today, with some cramping"** — self-care → care-team · *~270 chars*
> **Keep an eye on this one.**
> Several loose stools with cramping is still usually manageable at home with fluids and bland foods. If
> it keeps up more than a day or two, tell your care team so they can help. Staying hydrated matters most
> right now.
> *Shared with Dr. name.* → **[Message my care team]** **[Done]**

> *No guideline basis (no tag).* The protocol has **no middle tier** for diarrhea. §12's only diarrhea
> escalation is "severe/bloody → rule out infectious cause" (= L3). This L2 adds no new clinical action.
> See flag #1.

**L3 · "More than 5 times, or I see blood"** — `[§12]` · urgent-today (hold) · *~250 chars*
> **Let's get this looked at today.**
> Diarrhea this often — or any blood — needs your care team's eyes today. Hold your next dose, reach out
> to them now, and keep drinking fluids. If you feel faint or very weak, call 911.
> We've flagged this for Dr. name as urgent. → **[Call care team]** **[Call 911]**

---

## 4. Constipation

**Member label:** "Constipation" · **Frequency:** common (10–20%)

**L1 · "A day or two, but I'm okay"** — `[§12]` · self-care · *~200 chars*
> **Common — and usually easy to ease.**
> Going less often can happen as things slow down in your system. Small daily habits usually get things
> moving. Here's what helps:
> - Drink more water through the day
> - Add fiber slowly — fruit, veggies, whole grains
> - A short walk or gentle movement helps
> - A stool softener like MiraLAX is usually fine — just ask your care team
>
> *Shared with Dr. name.* → **[See what to expect this week]** **[Done]**

**L2 · "A few days and uncomfortable"** — self-care · *~250 chars*
> **Worth staying on top of.**
> A few uncomfortable days is still usually manageable with fluids, fiber, and gentle movement. Give
> those a day or two. If nothing changes, tell your care team and they'll help you take the next step.
> *Shared with Dr. name.* → **[Message my care team]** **[Done]**

> *No guideline basis (no tag).* The protocol has **no middle tier** for constipation. This L2 adds no
> new clinical action; it's a "keep going with self-care, then reach out" step. See flag #1.

**L3 · "More than 3 days, with pain or bloating"** — `[§12]` · urgent-today (hold) · *~230 chars*
> **Let's get this checked today.**
> More than three days with pain or bloating is worth your care team's attention today. Hold your next
> dose and reach out to them now. If the pain becomes severe, call 911.
> We've flagged this for Dr. name as urgent. → **[Call care team]** **[Call 911]**

---

## 5. Upper-right belly pain (gallbladder)

**Member label:** "Belly pain under your right ribs, especially after meals"
*(symptom-based — never "gallbladder"; members don't self-diagnose)* · **Frequency:** increased risk on GLP-1s

> ⚠️ **No self-care tier.** The protocol's first action is a prompt ultrasound, so even the mildest level
> routes to the care team — do **not** write cozy reassurance here.

**L1 · "Pain under my right ribs, or after meals"** — `[§12]` · care-team, prompt (hold) · *~250 chars*
> **Let's have your care team take a look.**
> Pain under your right ribs — especially after meals — is something we want to check, not wait on. Reach
> your care team today so they can arrange a scan. Hold your next dose until they've weighed in.
> We've flagged this for Dr. name. → **[Call care team]** **[Message my care team]**

**L2 · "That pain is getting stronger or lasting longer"** — urgent-today (hold)
> **If it's getting worse, don't wait.**
> Pain that's stronger or lasting longer needs your care team today. Reach them now, and hold your next
> dose. If fever or chills start, call 911.
> We've flagged this for Dr. name as urgent. → **[Call care team]** **[Call 911]**

> *No guideline basis (no tag).* The protocol has **no middle tier** for gallbladder. This L2 adds no
> new clinical action; it routes urgently, same as L1, with clearer worsening triggers. See flag #1.

**L3 · "That pain plus fever, chills, or yellowing skin or eyes"** — `[§12 + §10.2]` · emergency-911 · *~230 chars*
> **This needs urgent care now.**
> Belly pain with fever, chills, or yellowing of your skin or eyes can be serious. Call 911 or go to the
> nearest ER now. Hold your medication until a clinician says it's okay to restart.
> → **[Call 911]** · *Bold isn't an emergency service and can't watch in real time — 911 is the fastest help.*

---

## 6. Low blood sugar (hypoglycemia)

**Member label:** "Low blood sugar" · **Frequency:** rare unless also on insulin
or a sulfonylurea (a diabetes pill like glipizide)

> ⚠️ **Conditional display.** Only surface this symptom to members whose med list includes insulin or a
> sulfonylurea (`condition` flag on the symptom). Keep the word "sulfonylurea" out of member-visible
> strings — gate on it engine-side. See flag #3.

**L1 · "Shaky or sweaty, but I can treat it"** — `[§12]` · self-care
> **You can treat this right now.**
> Feeling shaky, sweaty, or dizzy can mean your blood sugar is low. Here's the simple fix, called the
> Rule of 15:
> - Have 15 grams of fast sugar — 4 oz of juice, or 3–4 glucose tablets
> - Wait 15 minutes. Do you still feel shaky, sweaty, or dizzy?
> - If so, have 15 grams of fast sugar one more time, then eat a small snack
>
> Still feel low after treating it twice? Call your care team now. If you feel like you might pass out,
> call 911.
> *Shared with Dr. name.* → **[Call care team]** **[Done]**

> *Build note:* for members who own a glucose meter, swap the recheck line to "Wait 15 minutes, then
> check your number again."

**L2 · "It keeps happening — several lows this week"** — `[§10.1 + §10.3]` · care-team
> **Let's tell your care team.**
> Lows that keep happening are worth your care team's review. Any medicine changes are their call — not
> something to change on your own. Keep fast sugar nearby for now.
> We've sent this to Dr. name. Your care team will reach out within 48 hours.
> → **[Call my care team]** **[Done]**

**L3 · "Someone passed out or had a seizure"** — `[§12]` · emergency-911 (caregiver framing)
> **This is an emergency — call 911.**
> If someone with low blood sugar passes out or has a seizure, call 911 right away. Don't give food or
> drink to someone who isn't fully awake. If they have a glucagon kit and you know how to use it, use it now.
> → **[Call 911]** · *Bold isn't an emergency service and can't watch in real time — 911 is the fastest help.*

---

## 7. Severe stomach pain (suspected pancreatitis)

**Member label:** "Severe stomach pain that may spread to your back"
*(symptom-based — never "pancreatitis")* · **Frequency:** rare, but the one stomach pain we never want you to wait on

> ⚠️ **No benign tier.** The protocol's first action is to hold the medication and evaluate — there is no
> "watch and wait" level here. This entry is the same red-flag the prototype's "Severe stomach pain" tile
> triggers (they consolidate).

**L1 · "Bad stomach pain that won't ease"** — `[§12]` · urgent, hold med · *~240 chars*
> **Don't wait on this one.**
> Bad stomach pain that won't ease is something we take seriously. Hold your medication now and reach your
> care team today so they can check it. If the pain gets severe or spreads to your back, call 911.
> We've flagged this for Dr. name as urgent. → **[Call care team]** **[Call 911]**

**L2 · "That pain plus nausea or vomiting"** — `[§12]` · urgent (evaluation) · *~230 chars*
> **Reach your care team today.**
> Stomach pain along with nausea or vomiting needs a proper look. Hold your medication and contact your
> care team today. If the pain becomes severe or spreads to your back, call 911 right away.
> We've flagged this for Dr. name as urgent. → **[Call care team]** **[Call 911]**

**L3 · "Severe pain spreading to my back"** — `[§12 + §14.4]` · emergency-911 · *~230 chars*
> **This needs urgent care now.**
> Severe stomach pain, especially if it spreads to your back, can be serious. Call 911 or go to the
> nearest ER now. Hold your medication until a clinician tells you it's okay to restart.
> → **[Call 911]** · *Bold isn't an emergency service and can't watch in real time — 911 is the fastest help.*

---

## Extra states (round out the check-in flow)

**Something else (free-text note)** — `[design]` · care-team · *~230 chars*
> **Thanks for telling us.**
> We've shared your note with your care team so they can help. If it's bothering you a lot or feels urgent,
> reach out to them directly. If it's an emergency, call 911.
> We've sent this to Dr. name as a note. Your care team will reach out within 48 hours.
> → **[Call my care team]** **[Done]**

**Doing well (positive check-in)** — self-care
> **Good to hear, Carol.**
> Steady days like this are exactly what the plan is built for. Dr. name will see this in your check-ins.
> → **[Back to Today]**

**Today's Plan reflection (after a not-great check-in)** — `.ack-card` · *tier-aware + count-aware*
> **We heard you.**
> - *One symptom:* "You told us about [symptom] ([severity]) today."
> - *Several symptoms:* "You told us about [N] things today — [symptom], [symptom], and [symptom]."
> - *Self-care tier:* "Take it easy today — rest is part of getting started. This was shared with Dr. name."
> - *Escalated / urgent tier (one):* "This was sent to Dr. name, and your care team will reach out within 48 hours."
> - *Escalated / urgent tier (several):* "The most important one was sent to Dr. name, and your care team will reach out within 48 hours. There's nothing else you need to do right now."
> If this becomes an emergency, **call 911**.
> *Reflects the **governing** (highest) tier across everything reported — never overwritten by a later, milder entry.*

---

## Multiple side effects at once (consolidated triage)

Members on a new GLP-1 routinely feel **several things at the same time** (nausea + vomiting + diarrhea is a
common early cluster). The check-in now lets a member **select everything they're feeling in one pass**, rate
each, and then see **one prioritized result** instead of a separate full triage card per symptom. This follows
the brief's *"the platform deals with the complexity … give one clear guidance, not an overwhelming set of
choices"* and the self-triage pattern used by symptom-checker products (collect all → one assessment). `[design]`

**Intake copy (multi-select)**
> **What's bothering you?**
> Pick everything you're feeling — we'll figure out what matters most. There's no wrong answer.
> → **[Continue with N]**

**Consolidation rules (how the one result is built)**
- **Governing symptom = highest tier.** Ties break by clinical priority (red-flags first:
  pancreatitis → gallbladder → hypoglycemia → then the GI symptoms). Its message leads the result.
- **One de-duplicated medication instruction.** The strongest hold wins across everything reported
  (**hold-medication > hold-next-dose > none**) and is stated **once**, in a scannable banner — not
  repeated per symptom.
- **Everything else is progressively disclosed.** Secondary symptoms collapse into an **"Also noted"**
  list; tapping any one reveals its at-home tips. Nothing is lost; nothing shouts.
- **One provider note** lists every reported symptom + severity (+ the single episode duration).
- **Emergency overrides everything.** If any symptom is Emergency-911, the result leads *only* with the 911
  action and the hold-medication line; other symptoms shrink to a single "you also told us about …" line so
  the 911 instruction is never buried.

**Multi-symptom result copy (framing added around the governing message)**
> You told us about **[symptom, symptom, and symptom]** today. Here's what matters most — the rest is below.
> *(then the governing symptom's message, labeled "Most important — [symptom]")*
>
> **About your medication** *(banner, shown once when a hold applies)*
> - *hold next dose:* "Hold your next dose until your care team weighs in — a safe pause, not a setback."
> - *hold medication:* "Hold your medication until a clinician says it's okay to restart."
>
> **Also noted — tap any to see what helps** *(collapsed list of the remaining symptoms)*

---

## Prescription waiting states → first dose → check-in (Home, stage 2–3)

Per the Figma (`Side-effect / prescription management`, node 35:10206) and the 2026-07-16 walkthrough. The
post-visit waiting window is now **one calm status card** on Home that a member can tap for detail, followed
by a first-dose confirmation that flips the card into a lightweight medication check-in. `[design]`

**Waiting card (Home, tappable → opens the details modal).** Clean white card + a purple-glow + a gradient
progress bar that **shimmers while processing** (the shimmer is decorative — the title, the "3 to 6 days"
tag, and the copy carry the meaning, so nothing is lost without motion / under `prefers-reduced-motion`).
Only **two steps** — there is **no "Ready to pick up" state**, because the app can't detect when the
medication is actually ready/picked up, so it must not claim to.
- **Creating prescription** *(bar ~50%)* — "Your provider is creating your medication order — it'll be sent to the pharmacy soon."
- **Processing insurance** *(tag: 3 to 6 days, bar ~85%)* — "Your insurance is checking your coverage and final cost."

**Details modal (2 steps, tap the card to open).** Honest and non-real-time (no "we're watching live"):
1. **Creating prescription** — "Your provider is prescribing your medication and will send it to the pharmacy soon."
2. **Processing insurance** — "Your insurance is processing your prescription. We'll show your final cost
   before you pick it up — it usually won't change, and if it ever does, it's your choice whether to pick it
   up. No surprises." *(cost-certainty is a validated value prop — principles #11, findings #19–21.)*

**First-dose confirmation** *(surfaces on the Processing-insurance step only — member-initiated once they
have the medication; primary metric is Rx-to-first-dose activation).*
> **Start my 1st dose** — "Mark as done to unlock side-effect monitoring." → **[Done]**
Confirming switches the prescription module into the check-in below and marks "✓ The first dose taken".

**Medication check-in (Figma node 39:3822).** A **white card with a soft yellow radial glow** (bottom-right)
and the standard grey border — *not* a flat amber card. Button icons are neutral/dark.
> **How are you feeling on the medication?**
> A quick check-in to keep you safe.
> → **[🙂 I'm doing well]** **[+ Log side effects]**
- **I'm doing well** → the module **collapses to a pale-mint pill** (dark text + a filled teal check, no
  border) reading **"✓ Good to hear that you're doing well!"** — then **fades out after 3s**.
- **Log side effects** → opens the existing multi-symptom triage flow.

**Motion note:** shimmer + collapse/green/fade are the team's Figma direction. Research leans toward motion
restraint for 65+, so meaning is always carried by text + icon + color, and the global
`prefers-reduced-motion` rule makes every transition instant (the module still resolves and the "first dose
taken" to-do persists). Flag #9 below tracks the one open product decision.

---

## Flags for clinical review

Carries the Escalation Mapping's open questions forward, plus product/voice ones. **All require Dr. Deeb /
clinical sign-off before ship.**

1. **No protocol middle tier for nausea, diarrhea, constipation & gallbladder.** Their L2s carry no
   source tag (they add no new clinical action; §12 gives each symptom only a self-care state and one
   escalation trigger). Two of these L2s also **hold the dose earlier than §12 does** (nausea holds at "eating much
   less" vs §12's "unable to eat/drink >24h"; gallbladder holds at first RUQ pain). Confirm the middle
   tiers and the earlier holds are acceptable, or collapse those symptoms to two levels.
2. **Exposing all 7 symptoms as separate member entries** deviates from the prototype's single "severe
   stomach pain" red-flag collapse, and asks members to self-select near a clinical condition. Mitigated
   with symptom-based, non-diagnostic labels (§5, §7). Confirm this is acceptable, or revert
   gallbladder + pancreatitis into one red-flag path.
3. **Hypoglycemia gating & caregiver framing.** Confirm the symptom only shows for members on
   insulin/sulfonylurea, and that the L3 (passed out / seizure) caregiver-directed copy is right for a
   member-facing surface.
4. **Hold vs. discontinue.** Confirm member copy never states permanent discontinuation — the only dose
   instruction is a reversible "hold," and any stop decision is routed to the provider.
5. **Response-time SLA per tier.** The "within 48 hours" line is a placeholder; the brief lists per-tier
   SLA + after-hours coverage as unresolved. Confirm the real commitment before shipping this promise.
6. **Vomiting L3 top-tier action.** Source §12 says "evaluate dehydration/AKI"; §10.3 adds GI referral.
   The deck routes to "urgent today + 911 if faint." Confirm the intended top-tier action.
7. **Emergency vs. urgent split.** The source's L3 is not always 911 (some are provider-managed). Confirm
   the per-symptom split between **Urgent — today** and **Emergency — 911** above.
8. **Multi-symptom consolidation (new).** When several symptoms are reported together, the product routes
   on the **single highest tier / strongest hold** and asks **one** episode-level duration question (not one
   per symptom) to keep effort low for a 65+ member. Confirm: (a) governing-tier routing is clinically safe
   when symptoms co-occur (e.g. is there a combination that should escalate *higher* than any single
   symptom's tier — nausea + vomiting + diarrhea together as a dehydration signal?); (b) a single shared
   duration is acceptable, or duration must be captured per escalated symptom; (c) the consolidated provider
   note carries enough structure for the care team to act.
9. **Prescription waiting copy + cost claim (new).** The details modal promises "we'll show your final cost
   before pickup — usually won't change, your choice to pick up, no surprises," and the card shows "$50 at
   your pharmacy — Medicare covers the rest." Confirm: (a) final cost can actually be surfaced before pickup
   (open question in the brief — Healthie/Dosespot feasibility); (b) the "$50 / Medicare covers the rest"
   framing is accurate for the Bridge vs. Part D paths; (c) the shimmer + "processing" framing doesn't imply
   real-time monitoring. This is GLP-1/weight-management pricing (separate model), **not** governed by the
   `bold-pricing-messaging` skill (which covers Clinic/Care appointment cost).

---

## Prototype mapping (build guidance — no HTML changed in this deliverable)

Maps onto the existing engine in
[mvp3-side-effect-prescription.html](mvp3-side-effect-prescription.html):

- **`SYMPTOMS` model:** these 7 entries populate `levels[]` (`sev`, `desc`, `tier`, `hold`). Today only
  nausea/vomiting/diarrhea/constipation carry levels — add `gallbladder`, `hypoglycemia`, `pancreatitis`.
- **Tiers:** `renderConsolidatedTriage()` handles `self`/`concern`/`urgent`/`emergency`. The `.triage.urgent`
  CSS variant (mirrors `.triage.concern` with red accents) and the "urgent today" `[Call care team]` +
  `[Call 911]` pair are in place.
- **Multi-symptom:** intake is multi-select; `computeResult()` picks the governing tier + strongest hold; the
  result shows one dose banner + an **"Also noted"** `<details>` accordion for secondary symptoms.
- **Reuse existing UI:** `.triage.*`, `.shared-chip`, `.emergency-line`, `.bold-btn-danger`, `tel:911`,
  and the `.ack-card` reflection on Today.
- **Hypoglycemia** gated by a `condition:'su-insulin'` flag on the symptom (shown only if the member's med
  list qualifies).
- **Names already present:** provider `Dr. name`, Care Coordinator `Ali Neuwirth`.
- The prototype's standalone **"Severe stomach pain"** tile and **§7** here are the same red-flag —
  consolidate to one entry.

---

*Related: [mvp3-post-visit-design-brief.md](mvp3-post-visit-design-brief.md) ·
[data/synthesis/clinical-protocol.md](data/synthesis/clinical-protocol.md) ·
[data/synthesis/principles.md](data/synthesis/principles.md) ·
[data/synthesis/positioning.md](data/synthesis/positioning.md)*
