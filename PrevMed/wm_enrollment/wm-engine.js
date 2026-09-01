/* ══════════════════════════════════════════════
   wm-engine.js — the SPA engine.

   Owns: central state + subscribe, the screen runner, the hash router,
   layer transitions, focus/aria-live management, [data-bind] interpolation,
   the bottom sheet, and the harness bridge.

   One linear flow — the screen order is the Figma board's left-to-right x
   order and there is no branching, no variant axis, and no `next` override.

   Screens are declared in wm-screens.js and registered with
   WM.registerScreens(). Widgets live in wm-widgets.js.

   Public surface (window.WM):
     state, derived, data
     get(path) / set(path, value) / subscribe(fn)
     registerScreens(list) / start()
     goTo(id, opts) / goBack() / advance()
     order() / nextId(id) / prevId(id)
     sheet.open({title, body}) / sheet.close()
     el(html) — build a DOM node from an HTML string
     touch(id) — mark a screen as interacted with (reveals gate hints)
══════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     MOTION
     ───────────────────────────────────────────── */
  var reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  function syncMotion() {
    document.body.classList.toggle('wm-no-motion', reduceQuery.matches);
  }
  if (reduceQuery.addEventListener) reduceQuery.addEventListener('change', syncMotion);

  var DUR = function () { return reduceQuery.matches ? 0 : 260; };
  var EASE = 'cubic-bezier(0.32, 0.72, 0, 1)';

  /* True when nothing should animate — either the OS preference or the fidelity
     runner's freeze. Shared with the one-page widget so a scroll never lands
     mid-flight in a screenshot. */
  function prefersStill() {
    return reduceQuery.matches || document.body.classList.contains('wm-freeze');
  }

  /* ─────────────────────────────────────────────
     STATE
     ───────────────────────────────────────────── */
  var STATE = {
    current: null,
    trail: [],
    busy: false,
    scrollMemo: {},
    /* Screens whose auto-advance is disarmed. Populated on popstate so that
       backing into an already-answered single-select screen does not yank
       the member forward again — without this the member can never get back. */
    noAutoAdvance: {},
    answers: {
      meds: null,
      /* `motivation` is what the one-page Q1 checkboxes write to. It has to be
         DECLARED here, not created on first write: restore() only re-hydrates
         keys that already exist on this literal, so an undeclared answer is
         persisted and then silently dropped on reload. */
      motivation: [],
      goals: [],
      notes: '',
      heightFt: '', heightIn: '', heightCm: '',
      weightLb: '', weightKg: '', waistIn: '',
      metric: false,
      firstName: '', lastName: '', email: '',
      state: '', dob: '',
      /* Declared, not just written on demand: restore() only re-hydrates keys
         that already exist here, so an undeclared answer silently loses its
         value on reload. */
      situations: [], diagnosed: [], comorbid: [],
      /* Figma draws the FIRST day tab selected (2313:23641 carries the brand
         fill and border while the other four are white), so the default is the
         drawn state, not null. No TIME slot is drawn selected. */
      slotDay: 'tue-12', slotTime: null,
      consentHipaa: false, consentTele: false,
      /* Figma draws the phone field FILLED with this value (2313:23707) while the
         CTA is still disabled — so the gate is the opt-in below it, not the
         number. Seeding it reproduces the drawn state. */
      phone: '(310) 991-2492', smsOptIn: false
    },
    derived: {}
  };


  var SCREENS = [], BY_ID = {}, ORDER = [], subs = [];

  function read(obj, path) {
    if (!path) return undefined;
    return path.split('.').reduce(function (o, k) {
      return (o === null || o === undefined) ? o : o[k];
    }, obj);
  }

  function writeIn(obj, path, value) {
    var keys = path.split('.');
    var last = keys.pop();
    var target = keys.reduce(function (o, k) {
      if (o[k] === null || typeof o[k] !== 'object') o[k] = {};
      return o[k];
    }, obj);
    target[last] = value;
  }

  function set(path, value) {
    writeIn(STATE.answers, path, value);
    /* Re-arm auto-advance for this screen: the member has just answered it
       deliberately, so advancing is what they expect. */
    delete STATE.noAutoAdvance[STATE.current];
    recompute();
    notify();
    persist();
  }

  function notify() {
    for (var i = 0; i < subs.length; i++) subs[i](STATE);
  }

  function subscribe(fn) {
    subs.push(fn);
    return function () {
      var i = subs.indexOf(fn);
      if (i > -1) subs.splice(i, 1);
    };
  }

  function persist() {
    try {
      sessionStorage.setItem('wmState', JSON.stringify(STATE.answers));
    } catch (e) { /* private mode / quota — the prototype works without it */ }
  }

  function restore() {
    try {
      var raw = sessionStorage.getItem('wmState');
      if (!raw) return;
      var saved = JSON.parse(raw);
      Object.keys(saved).forEach(function (k) {
        if (k in STATE.answers) STATE.answers[k] = saved[k];
      });
    } catch (e) { /* ignore malformed */ }
  }

  /* ─────────────────────────────────────────────
     DERIVED — the result screen's number.

     Figma 2393:15035 draws `You are likely to lose [23]lbs with Bold!`, with
     `[23]` an unfilled placeholder. It is 21% of the weight entered in question 2
     on the one-page landing (2393:14606). 21% is close to the mean total
     body-weight reduction on tirzepatide 15 mg at 72 weeks in SURMOUNT-1, so the
     figure is defensible; the word "likely" is the board's, and it is flagged in
     FIDELITY.md as a predictive claim made before any provider has seen the
     member.

     The range check is not defensive tidiness. 21% of a fat-fingered "2200" is
     "462 lbs", and this string ships to a member as a medical expectation — so
     anything outside a plausible adult body weight counts as MISSING and routes
     to the board's own no-number variant (2393:14693) instead.
     ───────────────────────────────────────────── */
  var LOSS_FRACTION = 0.21;
  var WEIGHT_RANGE = { lb: [70, 700], kg: [32, 320] };

  function recompute() {
    var a = STATE.answers;
    var unit = a.metric ? 'kg' : 'lb';
    var raw = parseFloat(a.metric ? a.weightKg : a.weightLb);
    var lo = WEIGHT_RANGE[unit][0], hi = WEIGHT_RANGE[unit][1];
    var ok = isFinite(raw) && raw >= lo && raw <= hi;
    STATE.derived.lossAmount = ok ? Math.round(raw * LOSS_FRACTION) : null;
    STATE.derived.lossUnit = a.metric ? 'kg' : 'lbs';
    /* One pre-joined string so the markup needs a single [data-bind] inside the
       #2563eb run rather than three, which would put avoidable text nodes
       between glyphs the reference render has as one run. */
    STATE.derived.lossPhrase = ok
      ? 'lose ' + STATE.derived.lossAmount + ' ' + STATE.derived.lossUnit
      : '';
    if (typeof WM.recomputeHook === 'function') WM.recomputeHook(STATE);
  }

  /* ─────────────────────────────────────────────
     REGISTRY
     ───────────────────────────────────────────── */
  function registerScreens(list) {
    SCREENS = list;
    BY_ID = {}; ORDER = [];
    list.forEach(function (s) { BY_ID[s.id] = s; ORDER.push(s.id); });
  }

  /* One linear flow, in Figma left-to-right x order. No `next` override and no
     function form — a per-screen override is exactly how the order drifts away
     from the board. To skip a screen, remove it from the registry. */
  function nextId(id) { var i = ORDER.indexOf(id); return ORDER[i + 1] || null; }
  function prevId(id) { var i = ORDER.indexOf(id); return i > 0 ? ORDER[i - 1] : null; }

  function isValid(screen) {
    return typeof screen.validate === 'function' ? !!screen.validate(STATE) : true;
  }

  /* ─────────────────────────────────────────────
     BINDING — declarative, no expressions in markup
     ───────────────────────────────────────────── */
  function bind(root) {
    root.querySelectorAll('[data-bind]').forEach(function (el) {
      var v = read(STATE, el.getAttribute('data-bind'));
      /* textContent only: an apostrophe in a name can't break the page and
         there is no XSS surface. */
      el.textContent = (v === null || v === undefined) ? '' : String(v);
    });
    root.querySelectorAll('[data-bind-attr]').forEach(function (el) {
      el.getAttribute('data-bind-attr').split(';').forEach(function (pair) {
        var bits = pair.split(':');
        if (bits.length < 2) return;
        var attr = bits[0].trim();
        var v = read(STATE, bits.slice(1).join(':').trim());
        el.setAttribute(attr, (v === null || v === undefined) ? '' : String(v));
      });
    });
    root.querySelectorAll('[data-when]').forEach(function (el) {
      var pred = WM.predicates[el.getAttribute('data-when')];
      el.hidden = typeof pred === 'function' ? !pred(STATE) : false;
    });
  }

  function bindAll() {
    var live = liveLayer();
    if (live) bind(live);
  }

  /* ─────────────────────────────────────────────
     DOM helpers
     ───────────────────────────────────────────── */
  function el(html) {
    var t = document.createElement('template');
    t.innerHTML = String(html).trim();
    return t.content.firstElementChild;
  }

  var stage, shell, liveRegion;

  function liveLayer() {
    return stage ? stage.querySelector('.wm-layer:not(.is-leaving)') : null;
  }

  /* ─────────────────────────────────────────────
     GATE — CTA enable/disable + hint
     ───────────────────────────────────────────── */
  function refreshGate() {
    var layer = liveLayer();
    if (!layer) return;
    var screen = BY_ID[STATE.current];
    if (!screen) return;
    var btn = layer.querySelector('[data-cta]');
    if (btn) btn.disabled = !isValid(screen);
  }

  /* ─────────────────────────────────────────────
     CHROME
     ───────────────────────────────────────────── */
  /* The Figma has no funnel progress row and no per-screen chrome state to
     recompute — the nav is identical on all 13 funnel screens — so the only
     chrome job left is publishing the frame geometry for the fidelity runner. */
  function updateChrome() {
    var screen = BY_ID[STATE.current];
    if (!screen || !shell) return;
    shell.style.setProperty('--frame-h', String(screen.figmaH));
    shell.setAttribute('data-figma', screen.figmaNode || '');
    shell.setAttribute('data-screen', screen.id);
  }

  /* ─────────────────────────────────────────────
     A11Y — focus + announce
     ───────────────────────────────────────────── */
  function focusHeading(layer) {
    /* `:not([hidden])` matters on the result screen, which carries BOTH of the
       board's headline variants and shows one — focusing the hidden one is a
       silent no-op that leaves the member's focus on the old screen. */
    var h = layer.querySelector('[data-focus]:not([hidden])') || layer.querySelector('h1');
    if (!h) return;
    if (!h.hasAttribute('tabindex')) h.setAttribute('tabindex', '-1');
    /* preventScroll matters: without it Safari scrolls the freshly-animated
       layer and you see a visible jerk. */
    h.focus({ preventScroll: true });
  }

  var announceTimer;
  function announce(screen) {
    clearTimeout(announceTimer);
    announceTimer = setTimeout(function () {
      if (!liveRegion) return;
      liveRegion.textContent = screen.announce || screen.title;
    }, 180);
  }

  /* ─────────────────────────────────────────────
     LAYER lifecycle
     ───────────────────────────────────────────── */
  function buildLayer(screen) {
    var layer = document.createElement('div');
    layer.className = 'wm-layer';
    layer.setAttribute('data-shell', screen.shell);
    layer.setAttribute('data-screen', screen.id);
    layer.innerHTML = screen.render(STATE);
    bind(layer);
    if (typeof screen.mount === 'function') {
      layer._wmCleanup = screen.mount(layer, STATE) || null;
    }
    return layer;
  }

  function teardown(layer) {
    if (layer && typeof layer._wmCleanup === 'function') {
      try { layer._wmCleanup(); } catch (e) { /* keep navigating */ }
      layer._wmCleanup = null;
    }
  }

  function slide(out, into, dir) {
    var dx = dir === 0 ? 0 : 32 * dir;
    var duration = DUR();
    var anims = [];
    if (out) {
      anims.push(out.animate(
        [{ transform: 'translateX(0)', opacity: 1 },
         { transform: 'translateX(' + (-dx) + 'px)', opacity: 0 }],
        { duration: duration, easing: EASE, fill: 'forwards' }
      ));
    }
    anims.push(into.animate(
      [{ transform: 'translateX(' + dx + 'px)', opacity: 0 },
       { transform: 'translateX(0)', opacity: 1 }],
      { duration: duration, easing: EASE, fill: 'forwards' }
    ));
    return Promise.all(anims.map(function (a) {
      return a && a.finished ? a.finished.catch(function () {}) : Promise.resolve();
    })).then(function () {
      /* Restore the invariant containing block (see wm-frame.css). */
      into.getAnimations().forEach(function (a) { a.cancel(); });
      into.style.transform = 'translateZ(0)';
      into.style.opacity = '';
    });
  }

  /* ─────────────────────────────────────────────
     ROUTER
     ───────────────────────────────────────────── */
  function goTo(id, opts) {
    opts = opts || {};
    if (STATE.busy) return Promise.resolve();
    var screen = BY_ID[id];
    if (!screen) {
      var first = ORDER[0];
      if (!first || first === id) return Promise.resolve();
      return goTo(first, { replace: true, dir: 0 });
    }
    STATE.busy = true;

    var dir = ('dir' in opts) ? opts.dir : 1;
    var out = liveLayer();
    if (out) {
      STATE.scrollMemo[STATE.current] = out.scrollTop;
      out.classList.add('is-leaving');
      out.setAttribute('aria-hidden', 'true');
      /* For ~260ms both layers are in the DOM; without inert a Tab or a
         screen-reader swipe reaches the dead screen. */
      out.inert = true;
    }

    var layer = buildLayer(screen);
    stage.appendChild(layer);

    var prev = STATE.current;
    STATE.current = id;

    if (!opts.fromPop) {
      if (opts.replace && STATE.trail.length) {
        STATE.trail[STATE.trail.length - 1] = id;
      } else {
        STATE.trail = STATE.trail.concat([id]);
      }
      pushHistory(id, !!opts.replace);
    }

    layer.scrollTop = opts.fromPop ? (STATE.scrollMemo[id] || 0) : 0;

    updateChrome();       /* deliberately overlaps the slide */
    refreshGate();
    document.title = screen.title + ' — Bold Weight Management';

    return slide(out, layer, dir).then(function () {
      if (out) { teardown(out); out.remove(); }
      focusHeading(layer);
      announce(screen);
      STATE.busy = false;
      postToHarness();
      if (typeof screen.entered === 'function') screen.entered(layer, STATE);
      void prev;
    });
  }

  function pushHistory(id, replace) {
    var payload = { wm: id, trail: STATE.trail.slice() };
    try {
      history[replace ? 'replaceState' : 'pushState'](payload, '', '#' + id);
    } catch (e) {
      /* Some browsers refuse pushState on file:// — fall back to the hash,
         which our own hashchange guard will ignore as a no-op. */
      suppressHash = true;
      location.hash = id;
      setTimeout(function () { suppressHash = false; }, 0);
    }
  }

  /* On the previous board four CTAs were drawn DISABLED, so each carried a
     `validate` that reproduced the drawn state. This board draws all four
     ENABLED — including the phone screen's, which used to gate completing
     enrollment on a marketing-text opt-in.
     Three of those screens still have a control that has to mean something (a
     time slot, two consent acknowledgements), so they carry a `guard` instead:
     the button stays enabled exactly as drawn, and pressing it with the control
     untouched moves focus there and says why rather than silently advancing.
     No element added, no pixel moved at rest. */
  function runGuard(screen) {
    if (typeof screen.guard !== 'function') return false;
    var g = screen.guard(STATE);
    if (!g) return false;
    var layer = liveLayer();
    var target = layer && layer.querySelector(g.focus);
    if (target) {
      if (!target.hasAttribute('tabindex') && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(target.tagName)) {
        target.setAttribute('tabindex', '-1');
      }
      if (typeof target.scrollIntoView === 'function') {
        target.scrollIntoView({ block: 'center', behavior: prefersStill() ? 'auto' : 'smooth' });
      }
      target.focus({ preventScroll: true });
    }
    if (liveRegion) liveRegion.textContent = g.say;
    return true;
  }

  function advance() {
    var screen = BY_ID[STATE.current];
    if (!screen) return;
    if (!isValid(screen)) { refreshGate(); return; }
    if (runGuard(screen)) return;
    var nid = nextId(STATE.current);
    if (nid) goTo(nid, { dir: 1 });
  }

  function goBack() {
    if (STATE.trail.length > 1) history.back();
  }

  var suppressHash = false;

  window.addEventListener('popstate', function (e) {
    var id = (e.state && e.state.wm) || location.hash.slice(1) || ORDER[0];
    if (e.state && e.state.trail) STATE.trail = e.state.trail.slice();
    else STATE.trail = [id];
    /* Landing here via Back must not re-fire auto-advance. */
    STATE.noAutoAdvance[id] = true;
    var from = ORDER.indexOf(STATE.current);
    var to = ORDER.indexOf(id);
    var dir = (from > -1 && to > -1) ? (to > from ? 1 : -1) : -1;
    goTo(id, { dir: dir, fromPop: true });
  });

  /* Harness navigates the iframe by fragment (cross-origin safe). */
  window.addEventListener('hashchange', function () {
    if (suppressHash) return;
    var id = location.hash.slice(1);
    if (!id || id === STATE.current || !BY_ID[id]) return;
    STATE.noAutoAdvance[id] = true;
    STATE.trail = [id];
    goTo(id, { dir: 0, fromPop: true });
    try { history.replaceState({ wm: id, trail: [id] }, '', '#' + id); } catch (e) {}
  });

  /* ─────────────────────────────────────────────
     BOTTOM SHEET — focus trap, Esc, focus restore
     ───────────────────────────────────────────── */
  var sheetHost, sheetEl, sheetTitle, sheetBody, sheetReturnFocus = null;

  function sheetOpen(opts) {
    if (!sheetHost) return;
    sheetReturnFocus = document.activeElement;
    sheetTitle.innerHTML = opts.title || '';
    sheetBody.innerHTML = opts.body || '';
    sheetHost.classList.add('is-open');
    sheetHost.removeAttribute('aria-hidden');
    var target = sheetEl.querySelector('[data-autofocus]') || sheetEl;
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }

  function sheetClose() {
    if (!sheetHost || !sheetHost.classList.contains('is-open')) return;
    sheetHost.classList.remove('is-open');
    sheetHost.setAttribute('aria-hidden', 'true');
    if (sheetReturnFocus && sheetReturnFocus.focus) {
      sheetReturnFocus.focus({ preventScroll: true });
    }
    sheetReturnFocus = null;
  }

  var FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

  function sheetKeydown(e) {
    if (!sheetHost.classList.contains('is-open')) return;
    if (e.key === 'Escape') { e.preventDefault(); sheetClose(); return; }
    if (e.key !== 'Tab') return;
    var items = Array.prototype.filter.call(
      sheetEl.querySelectorAll(FOCUSABLE),
      function (n) { return n.offsetParent !== null; }
    );
    if (!items.length) { e.preventDefault(); return; }
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === sheetEl)) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  /* ─────────────────────────────────────────────
     HARNESS BRIDGE — best effort, degrades silently
     ───────────────────────────────────────────── */
  function postToHarness() {
    if (window.parent === window) return;
    try {
      window.parent.postMessage({
        wmScreen: STATE.current
      }, '*');
    } catch (e) { /* opaque origin under file:// — sidebar just won't follow */ }
  }

  function postManifest() {
    if (window.parent === window) return;
    try {
      window.parent.postMessage({
        wmManifest: SCREENS.map(function (s) {
          return { id: s.id, title: s.title, figmaNode: s.figmaNode, figmaH: s.figmaH };
        })
      }, '*');
    } catch (e) {}
  }

  window.addEventListener('message', function (e) {
    var d = e.data;
    if (!d || typeof d !== 'object') return;
    if (d.wmGoTo && BY_ID[d.wmGoTo]) {
      STATE.noAutoAdvance[d.wmGoTo] = true;
      STATE.trail = [d.wmGoTo];
      goTo(d.wmGoTo, { dir: 0, replace: true });
    }
    if (d.wmReset) resetFlow();
  });

  function resetFlow() {
    try { sessionStorage.removeItem('wmState'); } catch (e) {}
    location.replace(location.pathname + location.search + '#' + ORDER[0]);
    location.reload();
  }

  /* ─────────────────────────────────────────────
     GLOBAL DELEGATION — declarative actions
     ───────────────────────────────────────────── */
  function wireGlobalActions() {
    document.addEventListener('click', function (e) {
      var act = e.target.closest('[data-action]');
      if (!act) return;
      var name = act.getAttribute('data-action');
      if (name === 'next')      { e.preventDefault(); advance(); }
      else if (name === 'back') { e.preventDefault(); goBack(); }
      else if (name === 'goto') { e.preventDefault(); goTo(act.getAttribute('data-target'), { dir: 1 }); }
      else if (name === 'skip') {
        e.preventDefault();
            var nid = nextId(STATE.current);
        if (nid) goTo(nid, { dir: 1 });
      }
      else if (name === 'sheet') {
        e.preventDefault();
        var key = act.getAttribute('data-sheet');
        var content = WM.sheets[key];
        if (content) sheetOpen(content);
      }
      else if (name === 'sheet-close') { e.preventDefault(); sheetClose(); }
      else if (name === 'restart')     { e.preventDefault(); resetFlow(); }
    });
  }


  /* ─────────────────────────────────────────────
     BOOT
     ───────────────────────────────────────────── */
  function start() {
    stage = document.getElementById('wm-stage');
    shell = document.getElementById('wm-shell');
    liveRegion = document.getElementById('wm-live');

    syncMotion();

    restore();
    recompute();

    subscribe(bindAll);
    subscribe(refreshGate);
    subscribe(function () { updateChrome(); });

    wireGlobalActions();

    sheetHost = document.getElementById('wm-sheet');
    if (sheetHost) {
      sheetEl = sheetHost.querySelector('.wm-sheet');
      sheetTitle = sheetHost.querySelector('.wm-sheet-title');
      sheetBody = sheetHost.querySelector('.wm-sheet-body');
      sheetHost.addEventListener('keydown', sheetKeydown);
    }

    var startId = location.hash.slice(1);
    if (!startId || !BY_ID[startId]) startId = ORDER[0];
    STATE.trail = [startId];
    goTo(startId, { dir: 0, replace: true });
    postManifest();
  }

  /* ─────────────────────────────────────────────
     EXPORT
     ───────────────────────────────────────────── */
  var WM = {
    state: STATE,
    data: {},
    predicates: {},
    sheets: {},
    recomputeHook: null,

    get: function (path) { return read(STATE, path); },
    answer: function (path) { return read(STATE.answers, path); },
    set: set,
    subscribe: subscribe,
    notify: notify,

    registerScreens: registerScreens,
    order: function () { return ORDER.slice(); },
    nextId: nextId,
    prevId: prevId,
    start: start,
    goTo: goTo,
    goBack: goBack,
    advance: advance,

    sheet: { open: sheetOpen, close: sheetClose },
    el: el,
    bind: bind,
    refreshGate: refreshGate,
    autoAdvanceAllowed: function (id) { return !STATE.noAutoAdvance[id || STATE.current]; },
    reducedMotion: function () { return reduceQuery.matches; },
    prefersStill: prefersStill,
    /* The one-page widget announces each question as it jumps to it; without a
       live-region write, a screen-reader user hears nothing when the page moves. */
    announce: function (text) { if (liveRegion && text) liveRegion.textContent = text; }
  };

  window.WM = WM;
})();