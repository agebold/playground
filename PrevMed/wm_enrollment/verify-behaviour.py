#!/usr/bin/env python3
"""Assert the things a pixel diff structurally cannot.

    python3 -m http.server 8080     # from the repo root
    python3 verify-behaviour.py

Source of truth: Figma `Weight-management Enrollment` § campaign enrollment
(2393:11580) — 17 screens.

Covers: the screen order, every primary CTA label, the five agreed corrections,
the absence of every hidden Figma node, the one-page questionnaire's scroll
choreography and its debounce, the 21% weight-loss maths and its no-weight
fallback, the unit switch, the three CTA guards (and the phone screen's
deliberate lack of one), Back with state restoration, deep links, the sheet's
focus trap, font resolution, and a clean console on all 17 screens.

Reduced motion is EMULATED throughout, which makes the layer slide and the
one-page scrolls instant. Without it every scroll assertion becomes a race
against a 300ms smooth scroll.
"""
import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cdp_driver import CDP                             # noqa: E402

BASE = 'http://127.0.0.1:8080/PrevMed/wm_enrollment/flow.html'

ORDER = ['ad', 'landing', 'result', 'ec-name', 'ec-state', 'loader', 'covered',
         'q-situations', 'q-diagnosed', 'q-comorbid', 'q-discuss', 'bridge',
         'schedule', 'consent-hipaa', 'consent-care', 'phone', 'portal-home']

# Every primary CTA label, read off the board's own renders. This list exists
# because the pixel gate CANNOT catch a label change that stays inside the old
# string's text-dense band — the edge mask excludes exactly that area, which is
# how "Continue" once survived on the Bridge where the board says "Schedule
# no-cost call". Transcription errors need an assertion, not a diff.
CTA = {
    'result': 'Continue', 'ec-name': 'Continue', 'ec-state': 'Continue',
    'covered': 'Continue', 'q-situations': 'Continue', 'q-diagnosed': 'Continue',
    'q-comorbid': 'Continue', 'q-discuss': 'Continue',
    'bridge': 'Schedule no-cost call', 'schedule': 'Schedule call',
    'consent-hipaa': 'Continue', 'consent-care': 'Continue', 'phone': 'Continue',
    # ad / loader / portal-home draw no Actions at all, and `landing` draws its
    # buttons INSIDE the page rather than in a bottom group — see LANDING_BTNS.
    'ad': None, 'loader': None, 'portal-home': None, 'landing': None,
}

# The two buttons the board draws inside the one-page landing (2393:14554 and
# 2393:14610), plus the nav pair (2393:14628 / 2393:14629).
LANDING_BTNS = ['Sign in', 'Check coverage', 'See if I qualify', 'Continue']

# Every node the board marks hidden="true". Rendering any of them changes layout.
HIDDEN = [
    'By tapping',                       # 2393:12012 + 15 siblings, in every Actions
    'Health background intake',         # 2393:11998 / 12039
    'On Bold',                          # 2393:12001 / 12042
    'Estimated copay',                  # 2393:12102 / 12130
    '$0 - $25',                         # 2393:12103 / 12131
    'Health insurance',                 # 2393:11624
    'Virtual physician appointment',    # 2393:11984 / 12025
    'Intake form (~5min)',              # 2393:12115, in the hidden Callout 2393:12110
    'Complete intake form',             # 2393:12118
    'To Do',                            # 2393:12070, in the hidden Badge 2393:12068
]
# …except portal-home draws "Monday, November 3" for real (2393:12080), so that
# string is checked only on the two consent screens, where it is inside a hidden
# Container.
CONSENT_HIDDEN = ['Monday, November 3', '9:00am - 9:30am (30 min)', 'Zoom video call']

# Copy that CHANGED on this board. Each entry is (screen, must-contain,
# must-NOT-contain) — the second half is what makes these regression tests rather
# than tautologies.
COPY = [
    ('ad', 'Lose weight, reduce pain and get your energy back.', None),
    ('ad', 'FDA-approved GLP-1s for $50/month copay if eligible.', None),
    ('ec-name', 'Help us confirm your coverage', 'to get you covered'),
    ('ec-state', 'Help us confirm your coverage', 'to get you covered'),
    ('q-situations', 'Select all that apply.', 'Bold Care is the right option'),
    ('q-diagnosed', 'Select all that apply.', 'This helps Bold tailor your care'),
    ('phone', 'coordinate your care when needed.', None),
    ('portal-home', 'Your program', 'About your program'),
    ('portal-home', 'How medication coverage works.', None),
    ('portal-home', 'Are GLP-1s required?', None),
    ('result', '2 minutes — 3 simple steps', None),
    ('result', 'Confirm your appointment coverage.', 'Help us confirm your appointment coverage'),
    ('result', 'Find the best treatment options and check medication eligibility.', None),
    ('result', 'Call to schedule your provider appointment and understand your plan.', None),
]

# 21% of body weight, and the range check that routes a typo to the board's own
# no-number variant instead of shipping "462 lbs" as a medical expectation.
LOSS = [('150', 32), ('180', 38), ('220', 46), ('300', 63), ('70', 15), ('700', 147)]
LOSS_BAD = ['', '0', '12', '69', '701', '2200', 'abc']

results = []


def check(name, ok, detail=''):
    results.append((name, bool(ok), detail))


def layer_text(d):
    return d.js("document.querySelector('.wm-layer:not(.is-leaving)').innerText")


def goto(d, sid, wait=0.45):
    d.js("location.hash = '#%s'" % sid)
    time.sleep(wait)


def main():
    d = CDP(BASE, width=393, height=852, scale=1)
    # Instant transitions AND instant scrollIntoView, so the scroll assertions
    # below are deterministic rather than racing a 300ms smooth scroll.
    d.send('Emulation.setEmulatedMedia',
           {'features': [{'name': 'prefers-reduced-motion', 'value': 'reduce'}]})
    d.js("document.body.classList.add('wm-no-motion')")

    # ── order ────────────────────────────────────────────────────────────────
    order = d.js('WM.order()')
    check('flow is 17 screens', len(order) == 17, 'got %d' % len(order))
    check('screen order matches the board left-to-right', order == ORDER,
          '' if order == ORDER else repr(order))

    # ── walk every screen: console, assets, hidden nodes, CTA label ───────────
    for sid in ORDER:
        goto(d, sid)
        body = layer_text(d)
        for needle in HIDDEN:
            check('%s: hidden node absent (%s)' % (sid, needle[:26]), needle not in body)
        if sid in ('consent-hipaa', 'consent-care'):
            for needle in CONSENT_HIDDEN:
                check('%s: hidden node absent (%s)' % (sid, needle[:26]), needle not in body)
        broken = d.js("""(function(){
          return [].slice.call(document.images).filter(function(i){
            return i.currentSrc && (!i.complete || i.naturalWidth === 0);
          }).map(function(i){return i.currentSrc.split('/').pop();});})()""")
        check('%s: every raster/svg resolved' % sid, not broken, str(broken))
        cta = d.js("""(function(){var b=document.querySelector(
          '.wm-layer:not(.is-leaving) [data-cta]'); return b ? b.innerText.trim() : null;})()""")
        check('%s: CTA label matches the board' % sid, cta == CTA[sid],
              'want %r, got %r' % (CTA[sid], cta))

    # ── copy that changed on this board ──────────────────────────────────────
    for sid, want, forbid in COPY:
        goto(d, sid)
        txt = layer_text(d)
        check('%s: "%s"' % (sid, want[:44]), want in txt)
        if forbid:
            check('%s: "%s" is gone' % (sid, forbid[:34]), forbid not in txt)

    # ── the five agreed corrections applied, and the Figma bugs gone ──────────
    goto(d, 'schedule', 0.6)
    sched = layer_text(d)
    check('schedule: "Pacific Time (PT)" shipped', 'Pacific Time (PT)' in sched)
    check('schedule: the {PST} placeholder is gone', '{' not in sched and 'PST' not in sched)
    days = d.js("""[].slice.call(document.querySelectorAll('.wm-layer:not(.is-leaving) .fg-daytab'))
                   .map(function(b){return b.innerText.replace(/\\s+/g,' ').trim();})""")
    check('schedule: five DISTINCT day tabs', len(days) == 5 and len(set(days)) == 5, str(days))
    labels = d.js("""[].slice.call(document.querySelectorAll('.wm-layer:not(.is-leaving) .fg-slotgrp')[0]
                     .querySelectorAll('.fg-slot b')).map(function(e){return e.textContent;})""")
    check('schedule: morning slots ascend', labels == ['7:00am', '9:00am', '10:30am', '10:45am'], str(labels))

    goto(d, 'bridge', 0.6)
    bridge = layer_text(d)
    check('bridge: "Covered by Medicare" without brackets',
          'Covered by Medicare' in bridge and '[Medicare]' not in bridge)

    for sid, want in (('q-situations', 'Question 1'), ('q-diagnosed', 'Question 2'),
                      ('q-comorbid', 'Question 3'), ('q-discuss', 'Question 4')):
        goto(d, sid)
        txt = layer_text(d)
        check('%s: eyebrow reads "%s"' % (sid, want), want in txt and 'Question #' not in txt)

    # ── the one-page landing: content ────────────────────────────────────────
    goto(d, 'landing', 0.7)
    lp = layer_text(d)
    for want in ('What are your motivations to', 'lose weight?',
                 'Identify your weight loss goal and focus.',
                 'What’s your height and weight?',
                 'Estimate how much weight you could lose.',
                 'Have you taken any weight loss medications?',
                 'Identify your weight loss medication experience and preference.'):
        check('landing: "%s"' % want[:40], want in lp)
    for want in ('Reduce pain and improve mobility', 'Get more energy',
                 'Control health conditions', 'Live longer and healthier',
                 'Improve my mental health', 'All of the above'):
        check('landing Q1 option: "%s"' % want, want in lp)
    for want in ('Yes, I am taking one now.', "Yes, I've taken one in the past but not currently",
                 'No, but I am interested', 'No, I don’t want GLP-1s to lose weight'):
        check('landing Q3 option: "%s"' % want[:36], want in lp)
    for want in ('FDA-approved GLP-1s,', 'for less than $12 a week if eligible',
                 '78% of Bold patients pay $0', 'out of pocket for virtual appointments',
                 'Covered by Medicare,',
                 'UnitedHealthcare, Aetna, Cigna, Blue Cross Blue Shield, Humana and more'):
        check('landing benefit: "%s"' % want[:38], want in lp)
    btns = d.js("""[].slice.call(document.querySelectorAll(
        '.wm-layer:not(.is-leaving) .fg-op-navbtn, .wm-layer:not(.is-leaving) .fg-op-cta button,'
      + '.wm-layer:not(.is-leaving) .fg-op-continue button')).map(function(b){return b.innerText.trim();})""")
    check('landing: the four drawn button labels', btns == LANDING_BTNS, str(btns))
    check('landing: three question sections',
          d.js("""document.querySelectorAll('.wm-layer:not(.is-leaving) [data-qsection]').length""") == 3)
    check('landing: progress is per-section and static (1/3, 2/3, 3/3)',
          d.js("""[].slice.call(document.querySelectorAll('.wm-layer:not(.is-leaving) .fg-steps3'))
                  .map(function(s){return [].slice.call(s.children)
                    .filter(function(i){return i.getAttribute('data-done')==='1';}).length;})""") == [1, 2, 3])

    # ── the one-page landing: scroll choreography ────────────────────────────
    def scroll_top(dd):
        return dd.js("document.querySelector('.wm-layer:not(.is-leaving)').scrollTop")

    def section_top(dd, n):
        # Document-relative, NOT offsetTop: .fg-op-qs is absolutely positioned, so
        # it is the offsetParent and offsetTop would be 0 / 672 / 1344.
        return dd.js("""(function(){
          var L=document.querySelector('.wm-layer:not(.is-leaving)');
          var s=L.querySelector('[data-qsection="%d"]');
          return Math.round(s.getBoundingClientRect().top - L.getBoundingClientRect().top + L.scrollTop);
        })()""" % n)

    goto(d, 'landing', 0.7)
    check('landing starts at the top', scroll_top(d) == 0)
    d.js("document.querySelector('.wm-layer:not(.is-leaving) .fg-op-cta button').click()")
    time.sleep(0.5)
    want = section_top(d, 1) - 56
    check('"See if I qualify" jumps to question 1', abs(scroll_top(d) - want) <= 4,
          'want ~%s, got %s' % (want, scroll_top(d)))
    check('question 1 heading takes focus',
          d.js("document.activeElement && document.activeElement.id") == 'op-q1')

    # Q1 -> Q2, debounced. Ticking twice must RESTART the timer, not race it.
    # Re-entering `landing` restores its remembered scrollTop (the router does this
    # on every hashchange), so each scroll case has to start from a known top.
    def fresh_landing(dd):
        goto(dd, 'landing', 0.7)
        dd.js("WM.set('motivation', []); WM.set('meds', null)")
        dd.js("document.querySelector('.wm-layer:not(.is-leaving)').scrollTop = 0")
        time.sleep(0.2)

    fresh_landing(d)
    check('landing: reset to the top for the scroll cases', scroll_top(d) == 0)
    d.js("""var b=document.querySelectorAll('.wm-layer:not(.is-leaving) [data-check="motivation"]');
            b[0].click();""")
    time.sleep(0.45)
    check('Q1: one tick does not jump yet (debounce still running)',
          abs(scroll_top(d) - 0) <= 4, 'scrollTop %s' % scroll_top(d))
    d.js("""var b=document.querySelectorAll('.wm-layer:not(.is-leaving) [data-check="motivation"]');
            b[3].click();""")
    time.sleep(0.45)
    check('Q1: a second tick RESTARTS the debounce instead of jumping',
          abs(scroll_top(d) - 0) <= 4, 'scrollTop %s' % scroll_top(d))
    check('Q1: both boxes are checked', d.js("WM.answer('motivation').length") == 2)
    time.sleep(0.8)
    want = section_top(d, 2) - 56
    check('Q1: jumps to question 2 once ticking stops', abs(scroll_top(d) - want) <= 4,
          'want ~%s, got %s' % (want, scroll_top(d)))
    check('Q1: the auto-jump does NOT leave the screen', d.js('WM.state.current') == 'landing')
    check('question 2 heading takes focus',
          d.js("document.activeElement && document.activeElement.id") == 'op-q2')

    # A manual scroll cancels the pending jump.
    fresh_landing(d)
    d.js("""var b=document.querySelectorAll('.wm-layer:not(.is-leaving) [data-check="motivation"]');
            b[1].click();""")
    time.sleep(0.2)
    d.js("""var L=document.querySelector('.wm-layer:not(.is-leaving)');
            L.scrollTop = 300;
            L.dispatchEvent(new WheelEvent('wheel',{deltaY:100,bubbles:true}));""")
    time.sleep(1.1)
    check('Q1: a manual scroll cancels the pending jump',
          abs(scroll_top(d) - 300) <= 4, 'scrollTop %s' % scroll_top(d))

    # Q2 Continue -> Q3, and Q3 advances to the result screen.
    fresh_landing(d)
    d.js("document.querySelector('.wm-layer:not(.is-leaving) .fg-op-continue button').click()")
    time.sleep(0.5)
    top3 = section_top(d, 3) - 56
    max_scroll = d.js("""(function(){var L=document.querySelector('.wm-layer:not(.is-leaving)');
                          return L.scrollHeight - L.clientHeight;})()""")
    check('Q2 Continue jumps to question 3', abs(scroll_top(d) - min(top3, max_scroll)) <= 4,
          'want ~%s, got %s' % (min(top3, max_scroll), scroll_top(d)))
    check('Q2 Continue does NOT leave the screen', d.js('WM.state.current') == 'landing')
    d.js("""document.querySelector('.wm-layer:not(.is-leaving) [data-radio="meds"]').click()""")
    time.sleep(0.9)
    check('Q3: choosing a medication answer advances to the result screen',
          d.js('WM.state.current') == 'result', 'on %s' % d.js('WM.state.current'))

    # ── the unit switch ──────────────────────────────────────────────────────
    fresh_landing(d)
    d.js("""var i=document.querySelector('.wm-layer:not(.is-leaving) #wm-lb');
            i.value='220'; i.dispatchEvent(new Event('input',{bubbles:true}));
            var f=document.querySelector('.wm-layer:not(.is-leaving) #wm-ft');
            f.value='5'; f.dispatchEvent(new Event('input',{bubbles:true}));
            var n=document.querySelector('.wm-layer:not(.is-leaving) [data-field="heightIn"]');
            n.value='7'; n.dispatchEvent(new Event('input',{bubbles:true}));""")
    time.sleep(0.3)
    check('units: imperial fields are the visible pair',
          d.js("""!document.querySelector('.wm-layer:not(.is-leaving) [data-units="imperial"]').hidden
                && document.querySelector('.wm-layer:not(.is-leaving) [data-units="metric"]').hidden"""))
    d.js("""document.querySelector('.wm-layer:not(.is-leaving) [data-action="units"]').click()""")
    time.sleep(0.3)
    check('units: switching to metric converts 220 lb -> 100 kg',
          d.js("WM.answer('weightKg')") == '100', d.js("WM.answer('weightKg')"))
    check("units: 5'7\" -> 170 cm", d.js("WM.answer('heightCm')") == '170', d.js("WM.answer('heightCm')"))
    check('units: the button relabels', d.js("""document.querySelector(
          '.wm-layer:not(.is-leaving) [data-action="units"]').innerText.trim()""") == 'Switch to ft / lbs')
    check('units: metric fields are now the visible pair',
          d.js("""document.querySelector('.wm-layer:not(.is-leaving) [data-units="imperial"]').hidden
                && !document.querySelector('.wm-layer:not(.is-leaving) [data-units="metric"]').hidden"""))
    d.js("""document.querySelector('.wm-layer:not(.is-leaving) [data-action="units"]').click()""")
    time.sleep(0.3)
    check('units: switching back restores 220 lb', d.js("WM.answer('weightLb')") == '220')

    # ── the 21% maths and the no-weight fallback ─────────────────────────────
    for lb, want in LOSS:
        d.js("WM.set('metric', false); WM.set('weightLb', '%s')" % lb)
        got = d.js("WM.get('derived.lossAmount')")
        check('21%% of %s lb = %d lb' % (lb, want), got == want, 'got %r' % got)
    for lb in LOSS_BAD:
        d.js("WM.set('metric', false); WM.set('weightLb', '%s')" % lb)
        check('%r is out of range -> no number' % lb, d.js("WM.get('derived.lossAmount')") is None)
    d.js("WM.set('metric', true); WM.set('weightKg', '100')")
    check('21% of 100 kg = 21 kg', d.js("WM.get('derived.lossAmount')") == 21)
    check('the unit follows the entry', d.js("WM.get('derived.lossUnit')") == 'kg')

    d.js("WM.set('metric', false); WM.set('weightKg',''); WM.set('weightLb', '220')")
    goto(d, 'result', 0.6)
    res = layer_text(d)
    check('result: the computed headline', 'You are likely to lose 46 lbs with Bold!' in res, res[:120])
    check('result: no bracketed placeholder survives', '[' not in res and ']' not in res)
    check('result: the number is inside the accent run',
          d.js("""document.querySelector('.wm-layer:not(.is-leaving) [data-bind]').textContent""") == 'lose 46 lbs')

    d.js("WM.set('weightLb', '')")
    goto(d, 'ec-name', 0.4)
    goto(d, 'result', 0.6)
    res = layer_text(d)
    check('result: falls back to the board\'s no-number variant',
          'You’re off to a great start with losing weight!' in res, res[:120])
    check('result: the computed headline is hidden, not both shown',
          d.js("""document.querySelectorAll('.wm-layer:not(.is-leaving) .fg-q:not([hidden])').length""") == 1)
    check('result: the visible headline still takes focus',
          d.js("""(function(){var a=document.activeElement;
                   return !!a && a.classList.contains('fg-q') && !a.hidden;})()"""))

    # ── the CTAs are drawn ENABLED, and three carry a guard instead ───────────
    for sid, path, sel in (('schedule', 'slotTime', '[data-slot]'),
                           ('consent-hipaa', 'consentHipaa', '[data-flag="consentHipaa"]'),
                           ('consent-care', 'consentTele', '[data-flag="consentTele"]')):
        d.js("WM.set('%s', %s)" % (path, 'null' if path == 'slotTime' else 'false'))
        goto(d, sid, 0.6)
        check('%s: CTA is ENABLED as this board draws it' % sid,
              d.js("document.querySelector('.wm-layer:not(.is-leaving) [data-cta]').disabled") is False)
        d.js("document.querySelector('.wm-layer:not(.is-leaving) [data-cta]').click()")
        time.sleep(0.5)
        check('%s: the guard stops the advance' % sid, d.js('WM.state.current') == sid,
              'went to %s' % d.js('WM.state.current'))
        check('%s: the guard moves focus to the control' % sid,
              d.js("!!document.activeElement.closest('%s')" % sel))
        d.js("document.querySelector('.wm-layer:not(.is-leaving) %s').click()" % sel)
        time.sleep(0.3)
        d.js("document.querySelector('.wm-layer:not(.is-leaving) [data-cta]').click()")
        time.sleep(0.6)
        check('%s: once answered, the CTA advances' % sid, d.js('WM.state.current') != sid)

    # The phone screen deliberately has NO guard: the previous board gated
    # completing enrollment on a marketing-text opt-in, and this board does not.
    d.js("WM.set('smsOptIn', false)")
    goto(d, 'phone', 0.6)
    check('phone: CTA is ENABLED as drawn',
          d.js("document.querySelector('.wm-layer:not(.is-leaving) [data-cta]').disabled") is False)
    d.js("document.querySelector('.wm-layer:not(.is-leaving) [data-cta]').click()")
    time.sleep(0.6)
    check('phone: continuing does NOT require the marketing opt-in',
          d.js('WM.state.current') == 'portal-home', 'on %s' % d.js('WM.state.current'))
    check('phone: and the opt-in really was left unchecked', d.js("WM.answer('smsOptIn')") is False)

    # ── the consent heading is the serif on this board ───────────────────────
    goto(d, 'consent-hipaa', 0.6)
    fam = d.js("""getComputedStyle(document.querySelector(
                  '.wm-layer:not(.is-leaving) .fg-q')).fontFamily""")
    check('consent-hipaa: heading is Source Serif Pro, not Inter', 'Source Serif Pro' in fam, fam)

    # ── Back restores both the screen and the answer ──────────────────────────
    goto(d, 'ec-name', 0.6)
    d.js("""var i=document.querySelector('.wm-layer:not(.is-leaving) #wm-first');
            i.value='Kathleen'; i.dispatchEvent(new Event('input',{bubbles:true}));""")
    time.sleep(0.3)
    check('ec-name: typed value reaches state', d.js("WM.answer('firstName')") == 'Kathleen')
    d.js("document.querySelector('.wm-layer:not(.is-leaving) [data-cta]').click()")
    time.sleep(0.6)
    check('ec-name: Continue advances to ec-state', d.js('WM.state.current') == 'ec-state')
    d.js('history.back()'); time.sleep(0.7)
    check('Back returns to ec-name', d.js('WM.state.current') == 'ec-name')
    check('Back restores the typed value',
          d.js("document.querySelector('.wm-layer:not(.is-leaving) #wm-first').value") == 'Kathleen')

    # ── the loader's timer must die on Back ──────────────────────────────────
    goto(d, 'loader', 0.5)
    goto(d, 'bridge', 3.4)
    check('loader: its advance timer is cancelled on teardown',
          d.js('WM.state.current') == 'bridge')

    # ── the one-page widget must not leave a timer behind either ─────────────
    goto(d, 'landing', 0.7)
    d.js("""var b=document.querySelectorAll('.wm-layer:not(.is-leaving) [data-radio="meds"]');
            b[0].click();""")
    time.sleep(0.1)
    goto(d, 'bridge', 1.2)
    check('landing: the Q3 advance timer is cancelled on teardown',
          d.js('WM.state.current') == 'bridge', 'on %s' % d.js('WM.state.current'))

    # ── sheet: opens from a drawn affordance, traps focus, Esc closes ─────────
    goto(d, 'ec-name', 0.6)
    d.js("document.querySelector('.wm-layer:not(.is-leaving) .fg-info-link').click()")
    time.sleep(0.35)
    check('sheet opens from "Why are we asking this?"',
          d.js("document.getElementById('wm-sheet').classList.contains('is-open')"))
    check('sheet takes focus', d.js("document.getElementById('wm-sheet').contains(document.activeElement)"))
    d.js("""document.getElementById('wm-sheet').dispatchEvent(
              new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));""")
    time.sleep(0.3)
    check('Esc closes the sheet',
          not d.js("document.getElementById('wm-sheet').classList.contains('is-open')"))

    # ── fonts actually resolved to the self-hosted faces ─────────────────────
    goto(d, 'landing', 0.6)
    d.js('document.fonts.ready.then(function(){return 1})', awaitp=True)
    check('Source Serif Pro 600 loaded', d.js("""document.fonts.check('600 24px "Source Serif Pro"')"""))
    for w in (400, 500, 600):
        check('Inter %d loaded' % w, d.js("document.fonts.check('%d 16px Inter')" % w))

    errs = [e for e in d.errors() if 'favicon' not in e]
    check('no console errors or failed loads across all 17 screens', not errs, '\n    '.join(errs[:6]))
    d.close()

    bad = [r for r in results if not r[1]]
    for name, ok, detail in results:
        if not ok:
            print('FAIL  %s%s' % (name, ('\n    ' + detail) if detail else ''))
    print('\n%d/%d assertions passed%s' % (len(results) - len(bad), len(results),
                                           '' if not bad else '  — %d FAILED' % len(bad)))
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
