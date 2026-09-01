#!/bin/sh
# Token drift check — wm-tokens.css mirrors the :root block of the GLP-1 funnel.
# Run from this directory. Empty output = no drift.
#
# The mirrored region is fenced by the two sentinel comments in wm-tokens.css.
# funnel.css lines 12–60 are the body of its :root block.
cd "$(dirname "$0")" || exit 1

MIRROR=$(awk '/BEGIN[ ]MIRROR/{f=1;next} /END[ ]MIRROR/{f=0} f' wm-tokens.css)
SOURCE=$(sed -n '12,60p' ../glp1_funnel/funnel.css)

if [ "$MIRROR" = "$SOURCE" ]; then
  echo "wm-tokens.css: MIRROR block matches ../glp1_funnel/funnel.css :root — no drift."
else
  echo "wm-tokens.css: DRIFT detected against ../glp1_funnel/funnel.css :root"
  tmp=$(mktemp -d)
  printf '%s\n' "$SOURCE" > "$tmp/source"
  printf '%s\n' "$MIRROR" > "$tmp/mirror"
  diff "$tmp/source" "$tmp/mirror"
  rm -rf "$tmp"
  exit 1
fi