# Adding a step, and making the conversation branch

Worked example: **after someone says "I don't have my card", ask how they want the
reminder sent, then when to send it — and have the closing message reflect both answers.**

That example already ships (`save_resume` → `reminder_time`), so you can open the Flow tab
and take it apart while you read.

---

## The two layers, and where the boundary is

| You want to… | Panel only | Needs code |
|---|---|---|
| Add / reorder / disable a step | ✅ | |
| Change what June says, the chip labels, the "why" copy | ✅ | |
| Show a step only in certain cases (`Skip if`) | ✅ | |
| End the conversation on a particular answer (`Ends the run`) | ✅ | |
| Steer the model's wording for that step (`Notes for June`) | ✅ | |
| Store the answer in a **new** state field | | one setter |
| Use the answer inside copy as `{{SOMETHING}}` | | one line in `vars()` |

Everything in the left column is a live edit — hit **Restart chat** and it's running. The
two code cases are each a few lines, shown at the bottom.

---

## 1. Add the step

**Controls › Flow › Add step**, then open the new card and fill it in. For the reminder-time
question:

| Field | Value |
|---|---|
| **Label** | `Reminder time` |
| **June says** | `When would you like me to send it?`<br><br>`No rush — it'll be there whenever you're ready for it.` |
| **Notes for June** | *They have already agreed to a text or an email, so this is a preference, not another hurdle. One short line, and never imply a deadline.* |
| **Input type** | `chips — tap one` |
| **Writes to state field** | `reminderTime` |
| **Skip if** | `!resumeChannel` |
| **Progress** | `0.75` |

A blank line in **June says** becomes a second chat bubble. `**double asterisks**` render
bold. Use the ↑ ↓ buttons on the card header to put it directly after *Save and resume*.

**Options**, one per line as `Label | value | flags`:

```
Tomorrow morning        | morning
Tomorrow afternoon      | afternoon
Tomorrow evening        | evening
Whenever's easiest      | any
Just handle it on my call | coordinator | exit
```

Flags: `exit` (styles it as the always-available way out), `aside` (answers, then re-asks
the same question), `other` (opens a text field for the long tail).

---

## 2. Make it conditional — `Skip if`

`Skip if` is an expression over the answers collected so far. If it's true, the step is
skipped and a line goes to the Debug log saying so.

It is **not** `eval`. Only identifiers, `'string literals'`, `!`, `&&`, `||`, `===` and
`!==` are allowed, so a typo can't run code — it just logs a warning and doesn't skip.

```
!resumeChannel                             show only if a channel was chosen
resumeChannel !== 'sms'                    show only for the text-message path
insuranceType !== 'advantage'              how the Carrier step is hidden for Original Medicare
!memberId && !cardPhotos                   how identity confirmation is skipped when we have nothing to check
memberIdPath                               skip once the path is already decided
```

**The gotcha that bites:** a bare field name is a truthiness test, so an *unset* field is
falsy. `resumeChannel === 'coordinator'` looks like it would skip the time question for
people who chose the coordinator — and it does — but it *also* runs the step for people
who never reached `save_resume` at all, because `null === 'coordinator'` is false. Prefer
the positive form: `!resumeChannel`.

---

## 3. End the branch — `Ends the run`

Some answers should finish the conversation instead of continuing. That's the **Ends the
run** box, one line per answer:

```
coordinator | deferred | coordinator_will_handle
*           | saved    | saved_for_later
```

- column 1 — the answer's `value`, or `*` for any answer
- column 2 — which **outcome** card to show (the ids are listed under the box, and their
  copy is editable further down the Flow tab)
- column 3 — the **rung** reported in the Measures tab

Leave it empty and the conversation carries on to the next applicable step.

This is what lets you insert a step *after* something that used to be the end. `Save and
resume` only ends on `coordinator`; the `sms` and `email` answers fall through, which is
exactly why `Reminder time` gets a turn.

> **If you delete `Reminder time`**, the `sms`/`email` answers no longer end anywhere and
> fall through. That used to be genuinely broken: the run reached the eligibility check with
> no member ID and announced *"you're covered"* — a coverage result from details the member
> never gave. Writing this guide is what surfaced it.
>
> Two guards now catch it. `Checking coverage` carries
> `Skip if: !memberId && !cardPhotos`, so a check never runs on nothing; and if a run
> reaches the end with no outcome emitted it lands on the deferred outcome and logs a
> warning telling you to look at **Ends the run**. Verified: deleting the step now gives
> *"All good — nothing needed from you"* with no check performed.
>
> Still, if you remove the step permanently, give `Save and resume` a
> `* | saved | saved_for_later` line so the branch ends where you meant it to.

---

## 4. A new field needs a setter — the one code touch

`Writes to state field` only accepts fields the app knows how to validate. Anything else
is **rejected**, with a warning in Debug:

```
Rejected write to unknown field "reminderTime"
```

The step still runs and the chips still work — the answer just isn't stored, so no later
`Skip if` or copy can use it. This is deliberate: every write goes through a validator so
a bad value can't corrupt state.

Add one to `assets/june-flow.js`, in `SETTERS`:

```js
reminderTime: function (v) {
  return ['morning', 'afternoon', 'evening', 'any'].indexOf(String(v)) !== -1
    ? String(v) : null;
},
```

Return the cleaned value, or `null` to reject. That's the whole contract. Existing setters
show the range: enums, a forgiving member-ID normaliser (strips spaces and dashes,
uppercases), a date parser that rejects implausible years.

---

## 5. Make the copy react — `{{VARS}}`

Outcome and step copy can interpolate. `{{FIRST_NAME}}`, `{{COORDINATOR_NAME}}`,
`{{APPT_WHEN}}`, `{{CARRIER}}` and friends work anywhere, including in **Notes for June**.

For something derived from two answers, add it to `Engine.prototype.vars()` in
`assets/june-flow.js`:

```js
REMINDER_LINE: reminderLine(s.resumeChannel, s.reminderTime),
```

```js
function reminderLine(channel, when) {
  var verb = channel === 'sms'   ? "I'll text you a link"
           : channel === 'email' ? "I'll email you a link"
           :                       "I've sent you a link";
  var at = when === 'morning'   ? ' tomorrow morning'
         : when === 'afternoon' ? ' tomorrow afternoon'
         : when === 'evening'   ? ' tomorrow evening'
         :                        '';                 // "whenever's easiest" adds nothing
  return verb + at;
}
```

The `saved` outcome then reads:

> Done. **{{REMINDER_LINE}}** so you can pick this up when the card turns up.

which renders as:

| Answers | Rendered |
|---|---|
| text + tomorrow morning | *Done. **I'll text you a link tomorrow morning** so you can…* |
| email + whenever's easiest | *Done. **I'll email you a link** so you can…* |

Note the second case deliberately says nothing about timing — promising a time they didn't
choose would be a small lie.

---

## 6. Steering the model — `Notes for June`

The structured fields drive the tappable widgets. **Notes for June** is prose injected into
the system prompt *for that step only*, so it shapes how she words the question and handles
anything typed while the step is open. It has no effect on the chips themselves.

Check **Controls › Prompt › Assembled prompt** to see exactly what the model receives —
your notes appear under *Design notes for this step*.

⚠️ Notes only matter when a model is connected. With no proxy and no key the chat falls
back to canned replies and the notes are inert — the **DEV** strip above the composer tells
you when that's the case.

---

## 7. Try it

1. **Controls › Flow › Restart chat**
2. On the first screen, tap **I don't have my card** — this jumps straight to
   *Save and resume*, skipping the member-ID ask
3. **Text me a link** → your new step appears
4. **Tomorrow morning** → the outcome card, with the closing line naming both answers
5. **Controls › Measures** — `Ended at: saved_for_later`
6. **Controls › Debug** — every state write and every skipped step, in order

Then change one thing and restart: reword a chip, flip `Skip if` to `resumeChannel !==
'sms'` so the question is text-only, or point `*` at a different outcome.

---

## Gotchas worth knowing

- **Your edits are saved and they win.** Panel settings persist in `localStorage` and
  override the shipped defaults. If a build changes the flow, a banner appears at the top of
  the panel offering *Use this build's flow* or *Keep mine*. If something behaves oddly
  after an update, look there first.
- **Debug is where rejections go.** Unknown field, invalid value, unparseable `Skip if`,
  a model reply blocked by a guardrail — all logged, none silent.
- **Restart chat re-reads the spec.** Editing mid-conversation won't change the turn you're
  in.
- **Watch the ask count.** This branch is reached by people who have already signalled
  friction. Every question added here is one more thing between them and a confirmed
  appointment — which is why *Whenever's easiest* exists as a one-tap non-answer, and why
  the exit stays on every turn.
