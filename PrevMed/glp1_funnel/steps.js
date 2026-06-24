/* ══════════════════════════════════════════════
   steps.js — shared declarative interactions for GLP-1 funnel steps
   - [data-checkgroup] : multi-select with exclusive "None of the above"
                         + gates a <button data-next="..."> (grey→purple)
   - [data-autoadvance="next.html"] : single-select that navigates on pick
   Page-specific behavior (unit toggle, loader) lives in each file.
══════════════════════════════════════════════ */
(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    /* ── Multi-select checkbox groups ── */
    document.querySelectorAll('[data-checkgroup]').forEach(function (group) {
      var sel = group.getAttribute('data-continue');
      var btn = sel ? document.querySelector(sel) : null;
      var next = btn ? btn.getAttribute('data-next') : null;
      var boxes = Array.prototype.slice.call(group.querySelectorAll('input[type="checkbox"]'));

      function refresh() {
        var any = boxes.some(function (b) { return b.checked; });
        if (btn) btn.disabled = !any;
      }

      boxes.forEach(function (box) {
        box.addEventListener('change', function () {
          if (box.checked) {
            if (box.hasAttribute('data-exclusive')) {
              // "None of the above" clears every other selection
              boxes.forEach(function (b) { if (b !== box) b.checked = false; });
            } else {
              // any real selection clears "None of the above"
              boxes.forEach(function (b) { if (b.hasAttribute('data-exclusive')) b.checked = false; });
            }
          }
          refresh();
        });
      });

      if (btn && next) {
        btn.addEventListener('click', function () {
          if (!btn.disabled) location.href = next;
        });
      }
      refresh();
    });

    /* ── Single-select radio groups that auto-advance ── */
    document.querySelectorAll('[data-autoadvance]').forEach(function (group) {
      var next = group.getAttribute('data-autoadvance');
      group.querySelectorAll('input[type="radio"]').forEach(function (radio) {
        radio.addEventListener('change', function () {
          // brief delay so the selection state is visible before navigating
          setTimeout(function () { location.href = next; }, 280);
        });
      });
    });

    /* ── FAQ accordion (.cf-faq-item / .cf-faq-btn) ── */
    document.querySelectorAll('.cf-faq-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.cf-faq-item');
        if (!item) return;
        var open = item.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });
  });
})();
