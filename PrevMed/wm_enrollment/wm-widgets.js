/* ══════════════════════════════════════════════
   wm-widgets.js — mount helpers.

   Every factory returns a mount function `(layer, state) => cleanup`. The
   cleanup contract is mandatory: it must clear every timer and every listener
   attached outside the layer. Without it, backing out of the coverage loader
   leaves a timer that fires seconds later and yanks the member forward from an
   unrelated screen.

   These deliberately add nothing to the layout. The controls are the Figma's
   own nodes; a widget only gives them state, and the selected state uses only
   values the board itself declares (Border/border-brand-primary #7c3aed,
   Surface/surface-brand-secondary #ede9fe).
══════════════════════════════════════════════ */
(function () {
  'use strict';

  function compose() {
    var fns = Array.prototype.slice.call(arguments).filter(Boolean);
    return function (layer, state) {
      var cleanups = fns.map(function (fn) { return fn(layer, state); })
                        .filter(function (c) { return typeof c === 'function'; });
      return function () { cleanups.forEach(function (c) { c(); }); };
    };
  }

  /* Timer bag — every widget uses this instead of a raw setTimeout. */
  function timers() {
    var ids = [];
    return {
      after: function (ms, fn) { var id = setTimeout(fn, ms); ids.push(id); return id; },
      every: function (ms, fn) { var id = setInterval(fn, ms); ids.push(id); return id; },
      clear: function () { ids.forEach(clearTimeout); ids.forEach(clearInterval); ids = []; }
    };
  }

  /* ─────────────────────────────────────────────
     RADIO GROUP — Figma "Radio Button" is a plain card with a label and no
     indicator glyph, so it is rendered as <button role="radio">. Single select,
     no auto-advance: the board draws a Continue button and that is the only way
     forward.
     ───────────────────────────────────────────── */
  function radioGroup(path) {
    return function (layer) {
      var btns = Array.prototype.slice.call(layer.querySelectorAll('[data-radio="' + path + '"]'));
      var saved = WM.answer(path);

      function paint() {
        var cur = WM.answer(path);
        btns.forEach(function (b) {
          b.setAttribute('aria-checked', String(b.getAttribute('data-value') === cur));
          /* Roving tabindex: a radiogroup is one tab stop. */
          b.tabIndex = (cur ? b.getAttribute('data-value') === cur : b === btns[0]) ? 0 : -1;
        });
      }

      btns.forEach(function (b, i) {
        b.addEventListener('click', function () {
          WM.set(path, b.getAttribute('data-value'));
          paint();
        });
        b.addEventListener('keydown', function (e) {
          var d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1
                : e.key === 'ArrowUp'   || e.key === 'ArrowLeft'  ? -1 : 0;
          if (!d) return;
          e.preventDefault();
          var n = btns[(i + d + btns.length) % btns.length];
          WM.set(path, n.getAttribute('data-value'));
          paint();
          n.focus();
        });
      });

      void saved;
      paint();
    };
  }

  /* ─────────────────────────────────────────────
     CHECKBOX GROUP — multi select. Figma's "Checkbox Button" does carry an
     indicator, so the markup supplies one; this only toggles state.
     ───────────────────────────────────────────── */
  function checkGroup(path) {
    return function (layer) {
      var btns = Array.prototype.slice.call(layer.querySelectorAll('[data-check="' + path + '"]'));

      function paint() {
        var cur = WM.answer(path) || [];
        btns.forEach(function (b) {
          b.setAttribute('aria-checked', String(cur.indexOf(b.getAttribute('data-value')) > -1));
        });
      }

      btns.forEach(function (b) {
        b.addEventListener('click', function () {
          var v = b.getAttribute('data-value');
          var cur = (WM.answer(path) || []).slice();
          var at = cur.indexOf(v);
          if (at > -1) cur.splice(at, 1); else cur.push(v);
          WM.set(path, cur);
          paint();
        });
      });

      paint();
    };
  }

  /* ─────────────────────────────────────────────
     BOOLEAN FLAG — a single drawn checkbox that gates its screen's CTA
     (the two consent acknowledgements and the SMS opt-in).
     ───────────────────────────────────────────── */
  function flags() {
    return function (layer) {
      layer.querySelectorAll('[data-flag]').forEach(function (btn) {
        var path = btn.getAttribute('data-flag');
        function paint() { btn.setAttribute('aria-checked', String(!!WM.answer(path))); }
        btn.addEventListener('click', function () { WM.set(path, !WM.answer(path)); paint(); });
        paint();
      });
    };
  }

  /* ─────────────────────────────────────────────
     DOCUMENT SCROLLBAR — Figma draws the consent Section's thumb as a real 6×93
     rounded rect at (351, 12.086) rather than relying on a native scrollbar,
     which would eat 6px of layout width and push the 329-wide text off grid. At
     scrollTop 0 the thumb sits exactly where the board puts it; the height stays
     the drawn 93 rather than being derived from the content, because 93 is what
     the board specifies.
     ───────────────────────────────────────────── */
  function docScroll() {
    return function (layer) {
      var box = layer.querySelector('.fg-doc');
      var bar = layer.querySelector('[data-docbar]');
      if (!box || !bar) return;
      var TOP = 12.086, H = 93;
      function place() {
        var travel = box.clientHeight - TOP * 2 - H;
        var max = box.scrollHeight - box.clientHeight;
        var f = max > 0 ? Math.min(1, box.scrollTop / max) : 0;
        bar.style.transform = 'translateY(' + (travel * f).toFixed(2) + 'px)';
      }
      box.addEventListener('scroll', place);
      place();
      return function () { box.removeEventListener('scroll', place); };
    };
  }

  /* ─────────────────────────────────────────────
     TEXT / SELECT FIELDS — [data-field="answerPath"], optional [data-mask].
     Figma draws the DOB field pre-filled as `01/01/19|YY`; that placeholder is
     reproduced in the markup and the mask takes over once the member types.
     ───────────────────────────────────────────── */
  var MASKS = {
    dob: function (raw) {
      var d = raw.replace(/\D/g, '').slice(0, 8);
      if (d.length > 4) return d.slice(0, 2) + '/' + d.slice(2, 4) + '/' + d.slice(4);
      if (d.length > 2) return d.slice(0, 2) + '/' + d.slice(2);
      return d;
    },
    phone: function (raw) {
      var d = raw.replace(/\D/g, '').slice(0, 10);
      if (d.length > 6) return '(' + d.slice(0, 3) + ') ' + d.slice(3, 6) + '-' + d.slice(6);
      if (d.length > 3) return '(' + d.slice(0, 3) + ') ' + d.slice(3);
      if (d.length > 0) return '(' + d;
      return '';
    },
    digits3: function (raw) { return raw.replace(/\D/g, '').slice(0, 3); }
  };

  function fields() {
    return function (layer) {
      layer.querySelectorAll('[data-field]').forEach(function (input) {
        var path = input.getAttribute('data-field');
        var mask = MASKS[input.getAttribute('data-mask')];
        var saved = WM.answer(path);

        if (input.type === 'checkbox') input.checked = !!saved;
        else if (saved !== undefined && saved !== null && saved !== '') input.value = String(saved);

        function sync() {
          if (mask) {
            var atEnd = input.selectionStart === input.value.length;
            input.value = mask(input.value);
            if (atEnd) input.selectionStart = input.selectionEnd = input.value.length;
          }
          WM.set(path, input.type === 'checkbox' ? input.checked : input.value);
        }
        /* Both events: <select> and checkbox are change-driven, text inputs are
           input-driven, and autofill or assistive tech can fire either. */
        input.addEventListener('input', sync);
        input.addEventListener('change', sync);
      });
    };
  }

  /* ─────────────────────────────────────────────
     LOADER — Figma "mWeb - EC Loader" 2289:20904 carries a `Linear progress
     bar` instance at (16,64) 361×44. Fill it, then advance.
     ───────────────────────────────────────────── */
  function loader(total) {
    var TOTAL = total || 3200;
    return function (layer) {
      /* The fidelity runner freezes the page to screenshot it. `wm-freeze` kills
         the CSS transition but NOT the inline `width = 100%`, so without this the
         bar would diff at full width where Figma draws it at 88/360. Bail out
         entirely: no timers, no auto-advance, the drawn state stays. */
      if (document.body.classList.contains('wm-freeze')) return function () {};
      var t = timers();
      var fill = layer.querySelector('[data-progress-fill]');
      if (fill) {
        fill.style.transition = 'width ' + (TOTAL - 200) + 'ms linear';
        t.after(60, function () { fill.style.width = '100%'; });
      }
      t.after(TOTAL, function () { WM.advance(); });
      return function () { t.clear(); };
    };
  }

  /* ─────────────────────────────────────────────
     ACCORDION — Figma "summary" rows with a CaretRight that rotates to point
     down when open. Each screen's DEFAULT state matches the board: the Bridge
     FAQ ships expanded, the portal's seven rows ship collapsed.
     ───────────────────────────────────────────── */
  function accordion() {
    return function (layer) {
      layer.querySelectorAll('[data-acc-btn]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var item = btn.closest('[data-acc]');
          if (!item) return;
          var open = item.getAttribute('data-open') !== 'true';
          item.setAttribute('data-open', String(open));
          btn.setAttribute('aria-expanded', String(open));
        });
      });
    };
  }

  /* ─────────────────────────────────────────────
     DISCLOSURE — the Bridge "See more" + CaretDown (2292:22147), drawn
     collapsed.
     ───────────────────────────────────────────── */
  function disclosure() {
    return function (layer) {
      layer.querySelectorAll('[data-more-btn]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var host = btn.closest('[data-more]');
          if (!host) return;
          var open = host.getAttribute('data-open') !== 'true';
          host.setAttribute('data-open', String(open));
          btn.setAttribute('aria-expanded', String(open));
        });
      });
    };
  }

  /* ─────────────────────────────────────────────
     SCHEDULE — a LITERAL slot list from the board. No generated times, no
     reordering, no risk weighting, nothing pre-selected: the Figma draws every
     slot unselected and the CTA is the only way forward.
     ───────────────────────────────────────────── */
  function schedule() {
    return function (layer) {
      function group(attr, path) {
        var btns = Array.prototype.slice.call(layer.querySelectorAll('[' + attr + ']'));
        function paint() {
          var cur = WM.answer(path);
          btns.forEach(function (b) {
            b.setAttribute('aria-checked', String(b.getAttribute('data-value') === cur));
          });
        }
        btns.forEach(function (b) {
          b.addEventListener('click', function () {
            WM.set(path, b.getAttribute('data-value'));
            paint();
          });
        });
        paint();
      }
      group('data-day', 'slotDay');
      group('data-slot', 'slotTime');
    };
  }

  /* ─────────────────────────────────────────────
     ONE-PAGE LANDING — Figma 2393:14545.

     The board puts all three questions on one 2947px page in 600-tall bands and
     draws a Continue on question 2 ONLY. So the handoffs are:

       "See if I qualify"  → jump to Q1
       Q1 (6 checkboxes)   → auto-jump to Q2, DEBOUNCED 900ms from the last tick
       Q2 "Continue"       → jump to Q3
       Q3 (4 radios)       → advance to the result screen after 450ms

     The debounce is the whole design of the Q1 handoff. Q1 is multi-select — it
     has an "All of the above" option — so a fixed delay from the FIRST tick would
     move the page while someone is still choosing. Restarting the timer on every
     change means the page only moves once they have stopped. It fires once per
     visit, never on a deselect back to zero, and any manual scroll or key cancels
     it outright: nothing should move under a 72-year-old who has taken over.
     ───────────────────────────────────────────── */
  function onePage() {
    var Q1_DELAY = 900, Q3_DELAY = 450;
    return function (layer, state) {
      /* The fidelity runner freezes the page to screenshot it. A scroll in
         flight would be caught mid-way, so bail out entirely — same contract as
         the loader. */
      if (document.body.classList.contains('wm-freeze')) return function () {};

      var t = timers();
      var sections = Array.prototype.slice.call(layer.querySelectorAll('[data-qsection]'));
      var jumped = {};          /* one auto-jump per section per visit */
      var pending = null;

      function still() { return WM.prefersStill ? WM.prefersStill() : false; }

      function cancel() {
        if (pending !== null) { clearTimeout(pending); pending = null; }
      }

      function jump(n) {
        var sec = sections[n - 1];
        if (!sec) return;
        sec.scrollIntoView({ block: 'start', behavior: still() ? 'auto' : 'smooth' });
        /* Focus the question itself so a keyboard or screen-reader user lands
           where the sighted user just did. `preventScroll` keeps the smooth
           scroll from being yanked to an instant one. */
        var h = sec.querySelector('[data-focus]');
        if (h) t.after(still() ? 0 : 320, function () { h.focus({ preventScroll: true }); });
        WM.announce(sec.getAttribute('data-say') || '');
      }

      /* Q1 — debounced auto-jump. */
      function armQ1() {
        cancel();
        if (jumped[1]) return;
        var picked = (WM.answer('motivation') || []).length > 0;
        if (!picked) return;
        pending = setTimeout(function () {
          pending = null;
          if (jumped[1]) return;
          jumped[1] = true;
          jump(2);
        }, Q1_DELAY);
      }

      /* Q3 — single-select, so a short settle is enough. */
      function armQ3() {
        cancel();
        if (jumped[3]) return;
        if (!WM.answer('meds')) return;
        pending = setTimeout(function () {
          pending = null;
          jumped[3] = true;
          WM.advance();
        }, Q3_DELAY);
      }

      layer.querySelectorAll('[data-check="motivation"]').forEach(function (b) {
        b.addEventListener('click', armQ1);
      });
      layer.querySelectorAll('[data-radio="meds"]').forEach(function (b) {
        b.addEventListener('click', armQ3);
        b.addEventListener('keydown', function (e) {
          if (/^Arrow/.test(e.key)) armQ3();
        });
      });
      layer.querySelectorAll('[data-jump]').forEach(function (b) {
        b.addEventListener('click', function () {
          cancel();
          jumped[Number(b.getAttribute('data-jump')) - 1] = true;
          jump(Number(b.getAttribute('data-jump')));
        });
      });

      /* Taking over cancels the pending jump. `wheel` and `touchmove` are the
         two that mean "I am scrolling"; `scroll` alone would cancel our OWN
         smooth scroll. */
      function takeOver() { cancel(); }
      layer.addEventListener('wheel', takeOver, { passive: true });
      layer.addEventListener('touchmove', takeOver, { passive: true });
      layer.addEventListener('keydown', function (e) {
        if (/^(Page|Arrow|Home|End| )/.test(e.key)) takeOver();
      });

      void state;
      return function () {
        cancel();
        t.clear();
        layer.removeEventListener('wheel', takeOver);
        layer.removeEventListener('touchmove', takeOver);
      };
    };
  }

  /* ─────────────────────────────────────────────
     UNIT SWITCH — Figma 2393:14609, "Switch to cm / kg", drawn at 50% opacity.
     The board draws only the imperial state, so the metric one is AUTHORED (and
     logged). It has to work: the result screen's number is 21% of this field, and
     a member who thinks in kilograms would otherwise get a wrong figure from a
     control the board puts right next to the input.
     ───────────────────────────────────────────── */
  function unitSwitch() {
    return function (layer) {
      var btn = layer.querySelector('[data-action="units"]');
      if (!btn) return;
      var label = btn.querySelector('span');

      function paint() {
        var metric = !!WM.answer('metric');
        layer.querySelectorAll('[data-units="imperial"]').forEach(function (el) { el.hidden = metric; });
        layer.querySelectorAll('[data-units="metric"]').forEach(function (el) { el.hidden = !metric; });
        if (label) label.textContent = metric ? 'Switch to ft / lbs' : 'Switch to cm / kg';
        btn.setAttribute('aria-pressed', String(metric));
      }

      btn.addEventListener('click', function () {
        var metric = !WM.answer('metric');
        /* Carry the value across rather than clearing it — retyping a weight
           because you tapped the wrong unit is exactly the kind of dead end this
           audience abandons on. */
        if (metric) {
          var lb = parseFloat(WM.answer('weightLb'));
          if (isFinite(lb)) WM.set('weightKg', String(Math.round(lb * 0.45359237)));
          var ft = parseFloat(WM.answer('heightFt')), inch = parseFloat(WM.answer('heightIn'));
          if (isFinite(ft)) WM.set('heightCm', String(Math.round(((ft * 12) + (isFinite(inch) ? inch : 0)) * 2.54)));
        } else {
          var kg = parseFloat(WM.answer('weightKg'));
          if (isFinite(kg)) WM.set('weightLb', String(Math.round(kg / 0.45359237)));
          var cm = parseFloat(WM.answer('heightCm'));
          if (isFinite(cm)) {
            var total = Math.round(cm / 2.54);
            WM.set('heightFt', String(Math.floor(total / 12)));
            WM.set('heightIn', String(total % 12));
          }
        }
        WM.set('metric', metric);
        layer.querySelectorAll('[data-field]').forEach(function (i) {
          var v = WM.answer(i.getAttribute('data-field'));
          if (v !== undefined && v !== null && i.type !== 'checkbox') i.value = String(v);
        });
        paint();
      });

      paint();
    };
  }

  window.WMW = {
    compose: compose,
    timers: timers,
    onePage: onePage,
    unitSwitch: unitSwitch,
    radioGroup: radioGroup,
    checkGroup: checkGroup,
    flags: flags,
    docScroll: docScroll,
    fields: fields,
    loader: loader,
    accordion: accordion,
    disclosure: disclosure,
    schedule: schedule,
    masks: MASKS
  };
})();
