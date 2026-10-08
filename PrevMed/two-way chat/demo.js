/* Two-way care team chat — demo page: the story engine (Next / Back / Autoplay / hints / scene cards),
   phone scaling and the single-phone switch. Every step calls the same intent a tap would, so tapping
   the phones and pressing Next can be mixed freely. */
(function () {
  'use strict';
  var T = window.TWC, S = window.TWC_STORY, steps = S.steps;
  var LABEL_H = 36;        // .device-label (28px) + column gap (8px)
  var SCENE_MS = 1500;     // scene card on screen before autoplay acts
  var WATCHDOG_MS = 10000; // a step whose event never comes frees Next again
  var LEAD_MS = 700;       // autoplay: the ring shows this long before the tap happens
  var REVEAL_MS = 2000;    // a chat is seen where it opened before the ring's target scrolls into view

  var api = null, i = 0, armedAt = -1, playing = false, busy = false, done = false, pendingScene = false, dwelling = null, leadPending = false;
  var off = null, dwellTimer = null, sceneTimer = null, watchdog = null, hint = null, hintEl = null, hintFrame = 0, revealTimer = null;

  function $(sel) { return document.querySelector(sel); }
  function fill(tpl, map) { return String(tpl).replace(/\{(\w+)\}/g, function (m, k) { return map[k] != null ? map[k] : m; }); }

  /* ── Boot: one shared store, both phones mounted on it ─────────────── */
  function boot() {
    T.sched.clear(); clearTimers(); clearTimeout(watchdog);
    if (off) { off(); off = null; }
    clearHint();
    var store = T.createStore(S.initialState());
    api = { store: store, act: T.actions(store), sched: T.sched };
    api.patient = window.TWCPatient.mount($('#device-patient .screen'), api);
    api.care = window.TWCCare.mount($('#device-care .screen'), api);
    window.TWCJune.attach(api);
    wireSignals(store);
    setCareWho(store.getState().care.role, false);
    return api;
  }
  function clearTimers() { clearTimeout(dwellTimer); clearTimeout(sceneTimer); dwellTimer = sceneTimer = null; leadPending = false; }

  /* ── Steps ─────────────────────────────────────────────────────────── */
  function dwell(s) { return 1400 + 40 * s.caption.split(/\s+/).length; }
  function prepare(k) {
    var s = steps[k];
    if (s.time) api.act.jumpTime(s.time());
    if (s.role && api.store.getState().care.role !== s.role) api.act.setRole(s.role);
    if (s.before) s.before(api);
  }
  /* Instant replay to a step: Back, Restart and the chapter pills. */
  function goTo(target) {
    stop();
    T.sched.instant = true;
    boot();
    for (var k = 0; k < target; k++) { prepare(k); steps[k].auto(api); }
    T.sched.instant = false;
    busy = false; done = false; pendingScene = false;
    document.querySelectorAll('.screen__toast').forEach(function (t) { t.innerHTML = ''; });
    arm(target);
  }
  function arm(k) {
    if (off) { off(); off = null; }
    clearTimeout(watchdog);
    if (k >= steps.length) return finish();
    var s = steps[k];
    done = false; pendingScene = false; busy = false; dwelling = null; i = k; armedAt = k;
    prepare(k);
    if (s.scene) showScene(s.scene);
    showDevice(s.device);
    renderBar();
    setHint(s);
    off = api.store.on(s.waitFor, function () { complete(k); });
  }
  function complete(k) {
    if (off) { off(); off = null; }
    clearTimeout(watchdog);
    busy = false; armedAt = -1;
    clearHint();
    var n = k + 1;
    if (playing) {
      // Autoplay: this step's caption stays up while its result is on screen, then the story moves on.
      dwelling = n; renderBar();
      dwellTimer = setTimeout(advance, dwell(steps[k]));
      return;
    }
    if (n >= steps.length) return finish();
    if (steps[n].scene) { i = n; pendingScene = true; renderBar(); return; } // a time jump waits for Next
    arm(n);
  }
  /* Leave an autoplay pause now: jump to the next scene or run the next step. */
  function advance() {
    var n = dwelling;
    dwelling = null; clearTimers();
    if (n === null) return;
    if (n >= steps.length) return finish();
    if (steps[n].scene) enter(n); else perform(n, LEAD_MS);
  }
  /* Leave the pause before a time jump: move the clock, show the scene card, then (autoplay) act. */
  function enter(n) {
    clearTimers();
    arm(n);
    if (playing) sceneTimer = setTimeout(function () { perform(n); }, SCENE_MS);
  }
  /* Run a step's action. `lead` (autoplay) shows the ring for a moment first, so viewers see where the tap lands. */
  function perform(k, lead) {
    clearTimers();
    if (armedAt !== k) arm(k);
    if (done || armedAt !== k) return;
    busy = true; renderBar();
    watchdog = setTimeout(function () {
      busy = false; renderBar();
      if (playing && armedAt === k) perform(k);
    }, WATCHDOG_MS);
    if (lead) { leadPending = true; sceneTimer = setTimeout(function () { leadPending = false; if (armedAt === k) steps[k].auto(api); }, lead); }
    else steps[k].auto(api);
  }
  var lastNext = 0;
  function next() {
    var t = Date.now();
    if (done || t - lastNext < 350) return; // a double-click on Next is one Next
    lastNext = t;
    if (dwelling !== null) return advance();
    if (pendingScene) return enter(i);
    if (!busy) perform(i);
  }
  /* Back undoes the last finished step (replays up to it and arms it again). */
  function back() {
    var lastDone = done ? steps.length - 1 : dwelling !== null ? dwelling - 1 : i - 1;
    goTo(Math.max(0, lastDone));
  }
  function play() {
    playing = true; renderBar();
    if (done || dwelling !== null || busy) return;
    if (pendingScene) return enter(i);
    perform(i, LEAD_MS);
  }
  function pause() {
    var tapPending = leadPending;
    playing = false; clearTimers();
    if (tapPending) { busy = false; clearTimeout(watchdog); } // the tap hadn't happened yet
    if (dwelling !== null) { // settle into the manual state for the next step
      var n = dwelling; dwelling = null;
      if (n >= steps.length) return finish();
      if (steps[n].scene) { i = n; pendingScene = true; } else return arm(n);
    }
    renderBar();
  }
  function restart() { goTo(0); }
  function stop() { playing = false; clearTimers(); clearTimeout(watchdog); dwelling = null; busy = false; }
  function finish() {
    playing = false; clearTimers(); clearTimeout(watchdog);
    busy = false; done = true; pendingScene = false; dwelling = null; armedAt = -1; i = steps.length;
    clearHint();
    renderBar();
  }

  /* ── Hints: a pulsing ring on the next thing to tap ────────────────── */
  /* A step may list follow-on hints (`then`) for multi-tap paths; the deepest one on screen wins. */
  function deviceRoot(device) { return document.getElementById(device === 'care' ? 'device-care' : 'device-patient'); }
  function setHint(s) { clearHint(); hint = s && s.hint ? s : null; placeHint(); }
  function placeHint() {
    hintFrame = 0;
    if (!hint) return;
    var root = deviceRoot(hint.device), keys = [hint.hint].concat(hint.then || []), el = null;
    for (var n = keys.length - 1; n >= 0 && !el; n--) {
      var found = root.querySelector('[data-hint="' + keys[n] + '"]');
      if (found && found.getClientRects().length) el = found;
    }
    if (el === hintEl && (!el || el.classList.contains('is-hinted'))) return;
    if (hintEl) hintEl.classList.remove('is-hinted');
    hintEl = el;
    if (el) {
      el.classList.add('is-hinted');
      var scroller = el.closest('.chat-log, .care-scroll, .sheet__body, .modal__body, .home');
      clearTimeout(revealTimer);
      revealTimer = setTimeout(function () { if (hintEl === el) window.C.util.reveal(scroller, el, true); }, REVEAL_MS);
    }
  }
  function schedulePlaceHint() { if (hint && !hintFrame) hintFrame = requestAnimationFrame(placeHint); }
  function clearHint() {
    hint = null; hintEl = null; clearTimeout(revealTimer);
    if (hintFrame) { cancelAnimationFrame(hintFrame); hintFrame = 0; }
    document.querySelectorAll('.is-hinted').forEach(function (x) { x.classList.remove('is-hinted'); });
  }
  function wireHints() {
    ['device-patient', 'device-care'].forEach(function (id) {
      var root = document.getElementById(id);
      new MutationObserver(schedulePlaceHint).observe(root, { childList: true, subtree: true });
      /* Steps that type for the presenter (Carol's question, Dr. Desai's reply) also start from a tap on their hint. */
      root.addEventListener('click', function (e) {
        var s = steps[i];
        if (!s || !s.tapAuto || busy || done || pendingScene || armedAt !== i) return;
        var t = e.target.closest('[data-hint]');
        if (!t || t.getAttribute('data-hint') !== s.hint) return;
        var k = i;
        setTimeout(function () { if (i === k && armedAt === k && !busy) perform(k); }, 0);
      }, true);
    });
  }

  /* ── Signals between the phones ────────────────────────────────────── */
  function pulse(toward) {
    if (T.sched.instant) return;
    var dot = $('.transit__dot');
    if (!dot) return;
    dot.classList.remove('is-to-care', 'is-to-patient');
    void dot.offsetWidth; // restart the animation
    dot.classList.add(toward === 'care' ? 'is-to-care' : 'is-to-patient');
  }
  function wireSignals(store) {
    store.on('patient:message-sent', function () { pulse('care'); });
    store.on('doc:signed', function () { pulse('care'); });
    store.on('visit:sent', function () { pulse('patient'); });
    store.on('care:message-sent', function () { pulse('patient'); });
    store.on('system:event', function (m) { if (m.audience === 'all') pulse('patient'); });
    store.on('care:role-changed', function (p) { setCareWho(p.role, !T.sched.instant); });
  }
  function setCareWho(role, animate) {
    var who = $('[data-care-who]');
    if (!who || who.textContent === S.deviceWho[role]) return;
    who.textContent = S.deviceWho[role];
    if (animate) { who.classList.remove('is-changed'); void who.offsetWidth; who.classList.add('is-changed'); }
  }

  /* ── Scene cards, bar, chapter pills ───────────────────────────────── */
  var sceneHide = null;
  function showScene(text) {
    if (T.sched.instant) return;
    var el = $('.interstitial');
    el.hidden = true; void el.offsetWidth;
    el.textContent = text; el.hidden = false;
    clearTimeout(sceneHide);
    sceneHide = setTimeout(function () { el.hidden = true; }, 1400);
  }
  function bar(sel) { return $('.demo-bar ' + sel); }
  function renderBar() {
    var nextBtn = bar('[data-demo="next"]'), playBtn = bar('[data-demo="play"]'), backBtn = bar('[data-demo="back"]');
    playBtn.textContent = playing ? 'Pause' : 'Autoplay';
    playBtn.setAttribute('aria-pressed', playing ? 'true' : 'false');
    if (done) {
      markChapters(S.chapters.length + 1);
      bar('.bar-chapter').textContent = S.finale.title;
      bar('.bar-goal').textContent = '';
      bar('.bar-caption').textContent = S.finale.caption;
      bar('.bar-next').textContent = '';
      nextBtn.disabled = true; backBtn.disabled = false;
      return;
    }
    var s = steps[i], ch = S.chapters[s.chapter - 1];
    markChapters(s.chapter);
    bar('.bar-chapter').textContent = s.chapter + ' · ' + ch.name;
    bar('.bar-goal').textContent = 'Goal: ' + ch.goal;
    bar('.bar-caption').textContent = s.caption;
    var upcoming = dwelling !== null ? steps[dwelling] : null;
    bar('.bar-next').textContent = dwelling !== null ? (upcoming && upcoming.scene ? fill(S.sceneNext, { scene: upcoming.scene }) : '')
      : pendingScene ? fill(S.sceneNext, { scene: s.scene }) : s.hint ? 'Next: ' + S.hintLabels[s.hint] : '';
    nextBtn.disabled = busy;
    backBtn.disabled = i === 0;
  }
  /* ── Story panel (left): P1 / Vision switch, chapters and their steps, collapsible ── */
  var PANEL_KEY = 'twc.panel', NARROW = 900;
  function stepLabel(s) {
    if (s.label) return s.label;
    var h = S.hintLabels[s.hint] || s.id;
    return h.replace(/^Tap /, '').replace(/^./, function (c) { return c.toUpperCase(); });
  }
  function markChapters(current) {
    var at = done ? steps.length : i;
    document.querySelectorAll('.chapter-list__chapter').forEach(function (li) {
      var n = +li.dataset.chapter;
      li.classList.toggle('is-current', n === current);
      li.classList.toggle('is-done', n < current);
      var b = li.querySelector('.chapter-list__head');
      if (n === current) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    });
    document.querySelectorAll('.step-link').forEach(function (b) {
      var k = +b.dataset.step, isDone = k < at;
      b.classList.toggle('is-done', isDone);
      if (k === at) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
      b.querySelector('.step-link__state').textContent = isDone ? ', done' : '';
    });
  }
  function buildPanel() {
    var stories = window.TWC_STORIES || {};
    $('.story-switch').innerHTML = ['p1', 'vision'].filter(function (k) { return stories[k]; }).map(function (k) {
      var st = stories[k], here = st === S;
      return '<a class="story-switch__link" href="?story=' + k + '"' + (here ? ' aria-current="page"' : '') + '>' +
        '<span class="story-switch__short" aria-hidden="true">' + T.esc(st.short) + '</span><span class="story-switch__label">' + T.esc(st.label) + '</span></a>';
    }).join('');
    $('.chapter-list').innerHTML = S.chapters.map(function (c, n) {
      var first = steps.findIndex(function (x) { return x.chapter === n + 1; });
      var items = steps.map(function (x, k) {
        if (x.chapter !== n + 1) return '';
        return '<li><button type="button" class="step-link" data-step="' + k + '"><span class="step-link__mark" aria-hidden="true"><i class="ph-bold ph-check"></i></span>' +
          '<span class="step-link__text">' + T.esc(stepLabel(x)) + '</span><span class="u-vh step-link__state"></span></button></li>';
      }).join('');
      return '<li class="chapter-list__chapter" data-chapter="' + (n + 1) + '">' +
        '<button type="button" class="chapter-list__head" data-step="' + first + '" title="' + T.esc(c.name) + '">' +
          '<span class="chapter-num" aria-hidden="true">' + (n + 1) + '</span><span class="chapter-list__name"><span class="u-vh">Chapter ' + (n + 1) + ': </span>' + T.esc(c.name) + '</span></button>' +
        '<ol class="chapter-list__steps">' + items + '</ol></li>';
    }).join('');
    document.title = S.title + ' — Bold prototype';
    $('.demo-title__h').textContent = S.title;
    $('.demo-title__sub').textContent = S.sub;
    $('.story-panel').addEventListener('click', function (e) {
      var b = e.target.closest('[data-step]');
      if (!b) return;
      goTo(+b.dataset.step);
      if (isNarrow()) setPanel(false);
    });
    $('[data-panel-toggle]').addEventListener('click', function () { setPanel(!panelOpen(), true); });
    $('[data-panel-open]').addEventListener('click', function () { setPanel(true); });
    $('[data-panel-scrim]').addEventListener('click', function () { setPanel(false); });
    $('.story-panel').addEventListener('keydown', function (e) {
      if (!isNarrow() || !panelOpen()) return;
      if (e.key === 'Escape') { e.stopPropagation(); setPanel(false); $('[data-panel-open]').focus(); return; }
      if (e.key !== 'Tab') return; // keep focus inside the open drawer
      var f = Array.prototype.filter.call($('.story-panel').querySelectorAll('a, button'), function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    });
    setPanel(isNarrow() ? false : localStorage.getItem(PANEL_KEY) !== 'collapsed');
  }
  function isNarrow() { return innerWidth < NARROW; }
  function panelOpen() { return !document.body.classList.contains('is-panel-collapsed'); }
  function setPanel(open, remember) {
    var narrow = isNarrow();
    document.body.classList.toggle('is-panel-collapsed', !open);
    var t = $('[data-panel-toggle]');
    t.setAttribute('aria-expanded', String(open));
    $('[data-panel-toggle-label]').textContent = open ? 'Collapse panel' : 'Expand panel';
    $('[data-panel-scrim]').hidden = !(narrow && open);
    if (remember && !narrow) localStorage.setItem(PANEL_KEY, open ? 'open' : 'collapsed');
    if (narrow && open) { var cur = $('.story-switch__link[aria-current]'); if (cur) cur.focus(); }
    fit();
  }
  function wireControls() {
    $('.demo-bar').addEventListener('click', function (e) {
      var b = e.target.closest('[data-demo]');
      if (!b || b.disabled) return;
      b.blur(); // Space stays "Next" instead of pressing this button again
      ({ back: back, next: next, restart: restart, play: function () { if (playing) pause(); else play(); } })[b.dataset.demo]();
    });
    document.addEventListener('keydown', function (e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      var t = e.target;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable) return;
      if ((e.key === ' ' || e.key === 'Enter') && t.closest('button, a, [role="button"]')) return; // the focused button handles it
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); back(); }
      else if (e.key === 'r' || e.key === 'R') restart();
    });
  }

  /* ── Layout: scale the phones to the window; one phone under 900px ── */
  function fit() {
    var panel = $('.story-panel'), side = panel && !isNarrow() ? panel.offsetWidth : 0, room = innerWidth - side;
    var stage = $('.stage'), single = room < 900;
    var chrome = $('.demo-top').offsetHeight + $('.demo-bar').offsetHeight + 48 + LABEL_H + (single ? 56 : 0);
    stage.classList.toggle('stage--single', single);
    var s = Math.min(1, (innerHeight - chrome) / 876, (room - 120) / ((single ? 1 : 2) * 417));
    stage.style.setProperty('--device-scale', Math.max(single ? 0.42 : 0.5, s).toFixed(3));
  }
  function showDevice(device) {
    var buttons = document.querySelectorAll('.device-switch button');
    buttons.forEach(function (x) { x.setAttribute('aria-pressed', String(x.dataset.show === device)); });
    document.getElementById('col-patient').classList.toggle('is-shown', device !== 'care');
    document.getElementById('col-care').classList.toggle('is-shown', device === 'care');
  }
  function wireSwitch() {
    document.querySelectorAll('.device-switch button').forEach(function (b) {
      b.addEventListener('click', function () { b.blur(); showDevice(b.dataset.show); });
    });
  }

  window.TWCDemo = {
    next: next, back: back, goTo: goTo, play: play, pause: pause, restart: restart, fit: fit,
    get index() { return i; }, get api() { return api; },
    get state() { return { index: i, step: steps[i] ? steps[i].id : 'end', busy: busy, done: done, playing: playing, pendingScene: pendingScene }; }
  };
  var wasNarrow = null;
  addEventListener('resize', function () {
    var n = isNarrow();
    if (wasNarrow !== null && n !== wasNarrow) setPanel(n ? false : localStorage.getItem(PANEL_KEY) !== 'collapsed'); else fit();
    wasNarrow = n;
  });
  addEventListener('DOMContentLoaded', function () {
    buildPanel(); wireControls(); wireSwitch(); wireHints(); fit(); goTo(0);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit); // text metrics change once the web fonts arrive
  });
})();
