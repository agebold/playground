---
name: weight-management-research
description: Loads research insights and meeting scripts that drive the Weight Management App design, AND actively pushes back when proposed or existing work does not match that research. Use this skill whenever the user asks to design, build, ideate on, refactor, review, or discuss ANY part of the Weight Management App — including screens, flows, components, copy, concepts, or research synthesis. Trigger on any mention of the weight management app, GLP-1 companion work scoped to this app, weight management product/design syncs, or anything inside `PrevMed/weight management app/`. Do NOT skip this skill for small requests — every design decision in this app must be grounded in the source research and meeting notes.
---

# Weight Management Research Context

You are working on the **Weight Management App** prototype inside `PrevMed/weight management app/`. The design concepts for this app are driven by research insights and product/design meeting notes that the user maintains in the project's `data/` folder. Treat that folder as the single source of truth for product direction, user needs, and design intent.

## Folder structure (progressive disclosure — read top-down)

The `data/` folder is organized in three tiers so you can pick up context cheaply and only dig into raw artifacts when a specific question demands it:

```
data/
  INDEX.md              # one line per file, plus dates — read first
  synthesis/            # distilled, dense, current — ALWAYS read all of these
    findings.md         # validated user insights with raw-source citations
    decisions.md        # dated log of what the team agreed to do / drop
    principles.md       # design principles for this app
    value-props.md      # the six winning value propositions
    open-questions.md   # unresolved things to revisit
  raw/                  # original meeting notes, transcripts, research artifacts
                        # open ONLY when a specific question requires the source
```

## Step 0 — Read order at the start of every session

The `data/` folder is **live** — the user adds new meeting notes and research artifacts to it continuously, and any new file may change the direction of the work. So at the start of every session that touches this app:

1. **List the folder.** Run a fresh directory listing of `PrevMed/weight management app/data/` and `PrevMed/weight management app/data/raw/`. Do not rely on what was there last time.
2. **Read `INDEX.md`** to see what exists, when it was added, and what each raw file contains.
3. **Read every file in `synthesis/`** — they are short, dense, and current. This is your working memory for the app.
4. **Do NOT open files in `raw/` by default.** Only open a raw file when:
   - The synthesis explicitly points to a quote or page you need.
   - The user asks a question that requires the original source (e.g. "what did the third participant actually say about needles?").
   - You suspect the synthesis has gone stale relative to a raw file (mismatched dates, contradictions).
   - A raw file is new and has not yet been distilled into the synthesis (see Step 3 below).

If `data/` is empty, missing, or has no synthesis files, STOP and tell the user before proceeding — do not invent product direction.

## Step 1 — Detect new raw files and update synthesis

Whenever you list `data/raw/` and find a file that isn't referenced in `INDEX.md`, OR the user mentions they added a new note:

1. Read the new raw file once, in full.
2. Extract findings, decisions, open questions, and direct user quotes.
3. **Update the synthesis files** — append to `findings.md`, `decisions.md`, `open-questions.md`, etc., and add a row to `INDEX.md`. Cite the new raw file by filename and date.
4. If the new file contradicts an earlier synthesis entry, flag the conflict to the user before silently overwriting — surface what changed and why.

This is how the synthesis stays your working memory and the raw layer stays archive.

## Step 2 — Ground every design decision in the source

When you propose, draft, build, or critique anything:

- Cite by source (e.g. *"per 2026-05-05 readout, value prop #2"* or *"see [[findings]] #6"*) when you reference a decision or finding.
- Quote user language directly when it informs copy — don't paraphrase user voice into generic product-speak.
- If a design choice is NOT supported by the research, flag it as your own inference and ask the user to confirm before committing.
- If two sources conflict, surface the conflict — don't silently pick one.

## Step 3 — Actively push back when the build diverges from the research

This skill is not just a reader — it is a **guardian** of research-design alignment. Whenever you notice a mismatch between what is being built (or proposed) and what the synthesis or raw research says, raise it, even if the user did not ask for a review.

Trigger a pushback when you see things like:

- A screen, flow, or component that contradicts a finding, decision, or principle in `synthesis/`.
- Copy that uses framing or terminology the research explicitly rejected (e.g. "% body weight loss" headline, "log your meals," needle/vial hero imagery).
- A new feature or concept that has no anchor in `findings.md` or `decisions.md`, with no acknowledgment that it is exploratory.
- Drift from prior decisions in `decisions.md` (e.g. a flow that quietly reintroduces something the team agreed to drop).
- Audience mismatches — choices that don't fit the older-adult / GLP-1 / Medicare context.

When you push back, do it concretely:

1. Name the mismatch in one sentence (e.g. *"This onboarding step asks the user to log meals, but `findings.md` #9 and `principles.md` #1 say users explicitly rejected manual logging."*).
2. Cite the source — synthesis file + section, or raw file + date/timestamp.
3. Recommend a specific adjustment, OR ask the user to confirm they want to deviate from the research on purpose.
4. If the user chooses to deviate intentionally, add a note to `decisions.md` capturing the rationale so the trail survives.

Be direct. The user wants this skill to catch drift, not to be polite about it.

## Step 4 — Keep the research loop tight

- When the user shares a new insight verbally, ask whether it should be added to `data/` so future sessions inherit it. Offer to file it as a new raw note OR append to the relevant synthesis file directly.
- When you derive a new synthesis (themes, principles, JTBD), offer to add it to `synthesis/` so it becomes a durable artifact.
- Do not modify or delete existing files in `data/raw/` without explicit user permission — those are source records. You CAN update files in `synthesis/` and `INDEX.md` as new information arrives, but show your edits when they touch dated decisions.

## Audience reminder

The Weight Management App serves an older-adult Medicare-eligible audience considering or using GLP-1s. Always interpret the research through that lens: accessibility, cognitive load, medication context, trust, and cost matter more than novelty. Pair this skill with `design-system-guardian` for any UI implementation work.
