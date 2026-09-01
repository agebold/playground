#!/usr/bin/env bash
# Run the whole June test suite headless.
#
#   ./PrevMed/june_insurance_chat/tests/run.sh
#
# There is no node on this machine, so the suites run in headless Chrome.
# Three of them (rag, live, proxy-path) need real wall-clock time because
# Chrome's virtual-time clock starves IndexedDB — those hold the load event
# open via serve.py's /__delay endpoint instead of fast-forwarding.
set -uo pipefail
cd "$(dirname "$0")"

CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
PORT=8099
MOCK_PORT=8788

[ -x "$CHROME" ] || { echo "Chrome not found at: $CHROME (set CHROME=...)"; exit 1; }

python3 serve.py "$PORT" >/tmp/june-serve.log 2>&1 &
SERVE=$!
python3 mock-proxy.py >/tmp/june-mock.log 2>&1 &
MOCK=$!
trap 'kill $SERVE $MOCK 2>/dev/null' EXIT
sleep 1.2

read_out() {
  python3 - "$1" <<'PY'
import re, html, io, sys
s = io.open(sys.argv[1], encoding='utf-8', errors='replace').read()
m = re.search(r'id="out"[^>]*>(.*?)</div>', s, re.S)
print(html.unescape(m.group(1)) if m else '(no output - page did not run)')
PY
}

FAILED=0
run() {
  local name="$1" page="$2"; shift 2
  "$CHROME" --headless --disable-gpu --no-sandbox --window-size=1500,1100 "$@" \
    --dump-dom "http://localhost:$PORT/PrevMed/june_insurance_chat/tests/$page" \
    >/tmp/june-dom.html 2>/dev/null
  local out; out="$(read_out /tmp/june-dom.html)"
  printf '%-13s %s\n' "$name" "$(printf '%s' "$out" | head -1)"
  printf '%s' "$out" | tail -n +2 | sed 's/^/              /'
  printf '%s' "$out" | grep -q ' 0 failed' || FAILED=1
}

# virtual time: fine for anything that doesn't touch IndexedDB
run logic       logic.html       --virtual-time-budget=9000
run integration integration.html --virtual-time-budget=160000
run a11y        a11y.html        --virtual-time-budget=8000
run proxy-unit  proxy-unit.html  --virtual-time-budget=15000
run worker      worker.html      --virtual-time-budget=20000
# real time: these use IndexedDB, page reloads, and/or the mock proxy
run rag         rag.html
run live        live.html
run proxy-path  proxy-path.html
run persistence persistence.html

echo
[ "$FAILED" = 0 ] && echo "all suites passed" || { echo "SOME SUITES FAILED"; exit 1; }
