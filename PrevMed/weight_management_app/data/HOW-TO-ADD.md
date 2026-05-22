# How to add new research data

This folder is the source of truth for Weight Management App design decisions. To keep it scalable as research accumulates, follow the loop below.

## The standard loop

1. **Drop the raw file into [`raw/`](raw/).** Preserve the original filename for meeting exports (Gemini, Otter, Notion, etc.). For files you create yourself, name them `YYYY-MM-DD-short-title.ext` so they sort chronologically.
2. **Ask Claude to ingest it** — e.g. *"I added new research, please update the data folder"*. The `weight-management-research` skill will list `raw/`, spot the new file, read it, and distill it into the synthesis layer.
3. **Claude updates `synthesis/`** — appending to `findings.md`, `decisions.md`, `open-questions.md`, etc., and adding a row to [`INDEX.md`](INDEX.md). Conflicts with existing synthesis are surfaced rather than silently overwritten.
4. **Skim the synthesis diff.** Especially [`decisions.md`](synthesis/decisions.md) and [`findings.md`](synthesis/findings.md) — the agent's distillation is the one thing worth verifying, because misreads here propagate into every future design choice. Treat it like reviewing a PR.
5. **Resume design work.** Every future session inherits the new context for free.

## Edge cases

- **Verbal insight, no file.** Tell Claude in conversation. Prefer saving as a short markdown note in `raw/` (preserves provenance) over appending directly to synthesis (faster, but no source record). For anything load-bearing, save the note.
- **Batch drop (multiple files at once).** Drop them all in `raw/`, then ask for a batch distill. Claude will read them in order and consolidate so the synthesis doesn't grow duplicate findings.
- **A new decision supersedes an old one.** Don't delete the old entry in `decisions.md` — strike it through and link to the new one so the trail survives.
- **Synthesis file getting long (>200 lines).** Ask Claude to propose a split (e.g. `findings.md` → `findings-glp1.md` + `findings-diet.md`). Don't preemptively split — wait until a file is actually unfocused.

## Anti-patterns

- Don't edit files in `raw/` after they land — those are source records.
- Don't put synthesis content directly into [`INDEX.md`](INDEX.md). The index is a pointer file — one line per entry.
- Don't add new top-level folders under `data/`. Stick with `raw/` + `synthesis/`; new topics become new synthesis files, not new folders.
- Don't rename original meeting exports — keep the source filename so the trail back to the export tool is intact.
