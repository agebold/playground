#!/usr/bin/env python3
"""Pixel-diff the built flow against the Figma reference renders.

Usage:
    python3 -m http.server 8080            # from the repo root
    python3 verify-fidelity.py             # all registered screens
    python3 verify-fidelity.py q-meds ad   # just these

Method
------
Load flow.html DIRECTLY (never through index.html — there the iframe is a fixed
852 box and the viewport resize is defeated). For each screen, set the emulated
viewport to that FRAME's own height. Because `.fg-bottom` is `position: sticky`,
a scrollport tall enough to contain it resolves sticky to its natural flow
position — which is exactly where Figma draws the bottom group. One layout, two
correct renderings, no separate "fidelity mode".

Budgets — calibrated, not guessed
---------------------------------
Figma serves its renders at 1x only (maxDimension does not upscale), so every
glyph-edge pixel is a WHOLE pixel of disagreement between its rasterizer and
Skia rather than being averaged over four. Measured on q-meds: a text-free band
diffs at 0.022% pct_bad while text bands run 2.8-6%, and 81% of all Δ>48 pixels
sit within 1px of reference glyph ink. A flat "pct_bad <= 0.5%" would therefore
fail every text-bearing screen for a reason that is not a defect.

So the gate is two-part, and `ink_share` is the one that actually discriminates:

    ink_share       >= 80%    of the Δ>48 pixels, the share landing on reference
                              EDGES (glyph strokes, 1px borders, rounded
                              corners, icon detail, photo detail). A missing
                              icon, a wrong fill, or a shifted block puts bad
                              pixels in FLAT areas and drives this DOWN — which
                              is exactly the failure a raw percentage cannot
                              distinguish from antialiasing.
    pct_bad_clean   <= 0.15%  pct_bad measured ONLY over FLAT reference area.
                              This is the real geometry gate.
    pct_bad         <= 7.0%   a loose backstop for gross breakage.
    mean            <= 14.0   catches a GLOBAL tint error (a #fafafa background
                              where Figma says #fff) that the others miss
                              because the delta is small but everywhere.

Photo regions carry ~2% pct_bad of their own: the hero and ad rasters are
committed at 3x and downscaled by the browser, where Figma renders from the
original at 1x. Kept at 3x deliberately — the artifact has to look right on a
real retina phone, and the residual lands in `pct_bad`, not in the geometry
gate.
"""
import json
import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cdp_driver import CDP                             # noqa: E402
import numpy as np                                     # noqa: E402
from PIL import Image                                  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = 'http://127.0.0.1:8080/PrevMed/wm_enrollment/flow.html'
REF = os.path.join(HERE, 'assets/ref/figma')
OUT = os.path.join(HERE, 'assets/ref/build')
DIFF = os.path.join(HERE, 'assets/ref/diff')
FRAMES = json.load(open(os.path.join(HERE, 'assets/ref/frames.json')))

# screen id -> reference filename stem, § campaign enrollment (2393:11580)
REFMAP = {
    'ad': '01-ad', 'landing': '02-landing', 'result': '03-result',
    'ec-name': '04-ec-name', 'ec-state': '05-ec-state', 'loader': '06-loader',
    'covered': '07-covered', 'q-situations': '08-q-situations',
    'q-diagnosed': '09-q-diagnosed', 'q-comorbid': '10-q-comorbid',
    'q-discuss': '11-q-discuss', 'bridge': '12-bridge', 'schedule': '13-schedule',
    'consent-hipaa': '14-consent-hipaa', 'consent-care': '15-consent-care',
    'phone': '16-phone', 'portal-home': '17-portal-home',
}

# Bands we measure but exclude from the geometry gate, with the reason. Nothing is
# excluded silently: every entry prints its own numbers in the per-screen table.
#
# `result` is the only one. The board draws its headline as the unfilled
# placeholder `You are likely to lose [23]lbs with Bold!` and the build renders the
# computed `lose 46 lbs`, so the string's WIDTH differs and every word after it
# shifts. That lands in flat area and would swamp clean(geo) for a substitution the
# board is asking for. The copy is asserted instead, in verify-behaviour.py.
EXCLUDE = {
    'result': [(190, 300, 'computed headline vs the board\'s [23]lbs placeholder')],
}

BUDGET = {'ink_share': 80.0, 'pct_bad_clean': 0.15, 'pct_bad': 7.0, 'mean': 14.0}


def diff(ref_path, got_path, sid):
    a = Image.open(ref_path).convert('RGB')
    b = Image.open(got_path).convert('RGB')
    if a.size != b.size:
        return {'size': 'REF %sx%s vs BUILD %sx%s' % (a.size + b.size)}
    A = np.asarray(a, np.int16)
    B = np.asarray(b, np.int16)
    D = np.abs(A - B).max(axis=2)
    bad = D > 48
    rows = D.mean(axis=1)

    # EDGE MASK. Any pixel where the reference has local contrast is a place two
    # rasterizers are allowed to disagree — glyph edges, 1px card borders,
    # rounded corners, icon strokes, photo detail. A luminance/"ink" test is not
    # enough: a #e5e5e5 border on #fff is bright, so its corner AA would land in
    # the geometry bucket and the gate would fail for a non-defect.
    #
    # Flat regions are the opposite: a shifted block, a wrong fill, or a missing
    # icon always puts bad pixels there, and antialiasing never does. So the
    # geometry gate is pct_bad measured over FLAT reference area only.
    lum = A.sum(axis=2).astype(np.int32)
    pad = np.pad(lum, 1, mode='edge')
    stack = np.stack([pad[dy:dy + lum.shape[0], dx:dx + lum.shape[1]]
                      for dy in range(3) for dx in range(3)])
    local_range = stack.max(axis=0) - stack.min(axis=0)
    edge = local_range > 12                   # 3x3 contrast, summed RGB

    n_bad = int(bad.sum())
    clean = bad & ~edge                       # bad pixels in FLAT reference area

    # Excluded bands are reported separately, never dropped on the floor.
    ex_note = ''
    for y0, y1, why in EXCLUDE.get(sid, []):
        band = clean[y0:y1]
        flat = max(1, int((~edge[y0:y1]).sum()))
        ex_note = 'y %d-%d %.3f%% (%s)' % (y0, y1, band.sum() / flat * 100, why)
        clean = clean.copy()
        clean[y0:y1] = False

    res = {
        'pct_bad': float(bad.mean() * 100),
        'pct_off': float((D > 8).mean() * 100),
        'pct_bad_clean': float(clean.sum() / max(1, (~edge).sum()) * 100),
        'ink_share': float(100.0 * (n_bad - clean.sum()) / n_bad) if n_bad else 100.0,
        'edge_pct': float(edge.mean() * 100),
        'mean': float(D.mean()),
        'worst_y': int(np.argmax(rows)),
        'worst_row': float(rows.max()),
        'excluded': ex_note,
    }
    res['pass'] = (res['ink_share'] >= BUDGET['ink_share']
                   and res['pct_bad_clean'] <= BUDGET['pct_bad_clean']
                   and res['pct_bad'] <= BUDGET['pct_bad']
                   and res['mean'] <= BUDGET['mean'])
    if not res['pass']:
        os.makedirs(DIFF, exist_ok=True)
        hm = Image.fromarray(np.clip(D * 3, 0, 255).astype('uint8')).convert('RGB')
        trip = Image.new('RGB', (a.width * 3 + 24, a.height), (255, 0, 255))
        trip.paste(a, (0, 0))
        trip.paste(b, (a.width + 12, 0))
        trip.paste(hm, (a.width * 2 + 24, 0))
        trip.save(os.path.join(DIFF, sid + '.png'))
    return res


def main():
    want = sys.argv[1:]
    os.makedirs(OUT, exist_ok=True)
    # DPR 1: the references are 1x, and srcset must pick the 1x rasters.
    d = CDP(BASE, width=393, height=852, scale=1)

    # Clear persisted answers first — a guard, not a fix for anything observed.
    # verify-behaviour.py deliberately ticks the gates on schedule/consent/phone
    # and sessionStorage survives between runs, so a behaviour run could otherwise
    # leave a drawn-DISABLED CTA rendering enabled and diff the wrong state.
    d.js("try{sessionStorage.clear()}catch(e){}")
    d.js("location.replace(location.pathname)")
    time.sleep(1.2)

    # Seed a weight so the RESULT screen renders its computed headline rather than
    # the no-weight variant. 110 lb -> 21% -> 23, which is the number the board
    # itself draws as `[23]`, so the line count and everything below it match.
    d.js("WM.set('weightLb','110')")

    # Freeze BEFORE the first navigation, not after. Widgets are mounted during
    # buildLayer, so a widget that must not run while frozen (the loader, whose
    # timer would drive the progress bar past its drawn 88/360) has to be able to
    # see the class when it mounts.
    d.js("document.body.classList.add('wm-no-motion','wm-freeze')")

    ids = d.js('WM.order()')
    if want:
        ids = [i for i in ids if i in want]
    print('screens under test: %s\n' % ', '.join(ids))

    results, notes = {}, []
    for sid in ids:
        h = int(round(FRAMES[sid]))
        d.send('Emulation.setDeviceMetricsOverride',
               {'width': 393, 'height': h, 'deviceScaleFactor': 1, 'mobile': True})
        d.js("location.hash = '#%s'" % sid)
        time.sleep(0.7)
        d.js("document.body.classList.add('wm-no-motion','wm-freeze')")
        d.js('document.fonts.ready.then(function(){return 1})', awaitp=True)
        d.js("document.querySelectorAll('.wm-layer').forEach(function(l){l.scrollTop=0})")
        time.sleep(0.25)
        got = os.path.join(OUT, sid + '.png')
        d.shot(got)

        # rect assertions — a pixel diff cannot localise, these can
        rects = d.js("""(function(){
          var g=function(s){var e=document.querySelector('.wm-layer:not(.is-leaving) '+s);
            if(!e) return null; var r=e.getBoundingClientRect();
            return [r.x,r.y,r.width,r.height].map(function(n){return Math.round(n*100)/100});};
          return {sb:g('.fg-statusbar'), nav:g('.fg-nav'), logo:g('.fg-nav .fg-logo'),
                  act:g('.fg-actions'), btn:g('.fg-actions .fg-btn'),
                  tab:g('.fg-tabbar'), hero:g('.fg-hero'), card:g('.fg-card')};})()""")

        ref = os.path.join(REF, REFMAP[sid] + '-393.png')
        results[sid] = diff(ref, got, sid)
        results[sid]['rects'] = rects

        errs = [e for e in d.errors() if 'favicon' not in e]
        if errs:
            notes.append((sid, errs[:4]))

    d.close()

    print('%-15s %6s %8s %10s %9s %7s %8s' %
          ('screen', 'h', 'pct_bad', 'clean(geo)', 'ink_share', 'mean', 'worst_y'))
    print('-' * 76)
    failed = []
    for sid in ids:
        r = results[sid]
        if 'size' in r:
            print('%-15s %-13s  SIZE MISMATCH  %s' % (sid, FRAMES[sid], r['size']))
            failed.append(sid)
            continue
        flag = '' if r['pass'] else '  <-- FAIL'
        print('%-15s %6d %7.3f%% %9.3f%% %8.1f%% %7.2f %8d%s' %
              (sid, int(round(FRAMES[sid])), r['pct_bad'], r['pct_bad_clean'],
               r['ink_share'], r['mean'], r['worst_y'], flag))
        if r.get('excluded'):
            print('%-15s   excluded from clean(geo): %s' % ('', r['excluded']))
        if not r['pass']:
            failed.append(sid)

    print()
    for sid in ids:
        rc = results[sid].get('rects') or {}
        print('%-15s sb=%s nav=%s logo=%s' % (sid, rc.get('sb'), rc.get('nav'), rc.get('logo')))
        print('%-15s act=%s btn=%s tab=%s' % ('', rc.get('act'), rc.get('btn'), rc.get('tab')))
        if rc.get('hero') or rc.get('card'):
            print('%-15s hero=%s card=%s' % ('', rc.get('hero'), rc.get('card')))

    if notes:
        print('\nCONSOLE:')
        for sid, es in notes:
            for e in es:
                print('  %-15s %s' % (sid, e))

    print('\n%s' % ('ALL PASS' if not failed and not notes
                    else 'FAILED: ' + ', '.join(failed) + (' (+console)' if notes else '')))
    return 1 if (failed or notes) else 0


if __name__ == '__main__':
    sys.exit(main())
