/* ==========================================================================
   june-flow.js — the deterministic conversation engine
   --------------------------------------------------------------------------
   The consequential steps run here, not in the model: which question comes
   next, what gets written to state, and which outcome the member sees. Those
   have to be correct, auditable and tappable, so the app owns them.

   Each widget renders and returns a Promise that resolves when the member
   answers, which lets the whole flow read as straight-line `await` code in
   run() at the bottom.
   ========================================================================== */

(function (global) {
  'use strict';

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function el(html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  /* Escape first, then convert **bold**. Model output never reaches innerHTML
     un-escaped. */
  function mdBold(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  }

  function splitParas(s) {
    return String(s == null ? '' : s).split(/\n\s*\n/).map(function (p) { return p.trim(); }).filter(Boolean);
  }

  var ICONS = {
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
    mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',
    speaker: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M8 2v4M16 2v4M3 10h18"/></svg>',
    money: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.5 9.5h5M9.5 14.5h5"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 3h4l2 5-3 2a12 12 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z"/></svg>',
    camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L17 6h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z"/><circle cx="12" cy="12.5" r="3.2"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l7 3v6c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6l7-3z"/><path d="M9.5 12l2 2 3.5-3.5"/></svg>',
    warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l9 16H3l9-16z"/><path d="M12 9v5M12 17h.01"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
  };

  /* ======================================================================
     Engine
     ====================================================================== */

  function Engine(opts) {
    this.dom = opts.dom;              // { thread, chips, composer, input, progress, orbSmall }
    this.cfg = opts.cfg;              // live config accessor (panel-owned)
    this.on = opts.on || {};          // { log, measure, screen, sheet }
    this.state = {};
    this.history = [];
    this.pending = null;              // resolver for the widget in play
    this.step = null;
    this.ended = false;               // has an outcome been emitted this run?
    this.aborted = false;
    this._bindComposer();
  }

  /* ---- state, written only through here -------------------------------- */

  var SETTERS = {
    insuranceType: function (v) {
      return ['original', 'advantage', 'unsure'].indexOf(String(v)) !== -1 ? String(v) : null;
    },
    carrier: function (v) {
      var s = String(v || '').trim();
      return s.length >= 2 && s.length <= 60 ? s : null;
    },
    memberId: function (v) {
      var s = String(v || '').replace(/[\s-]/g, '').toUpperCase();
      // forgiving on purpose: plans format these every which way
      return /^[A-Z0-9]{5,20}$/.test(s) ? s : null;
    },
    memberIdPath: function (v) {
      return ['type', 'photo', 'nocard'].indexOf(String(v)) !== -1 ? String(v) : null;
    },
    resumeChannel: function (v) {
      return ['sms', 'email', 'coordinator'].indexOf(String(v)) !== -1 ? String(v) : null;
    },
    reminderTime: function (v) {
      return ['morning', 'afternoon', 'evening', 'any'].indexOf(String(v)) !== -1 ? String(v) : null;
    },
    cardPhotos: function (v) { return v && v.front && v.back ? v : null; },
    firstName: function (v) {
      var s = String(v || '').trim();
      return /^[\p{L}][\p{L}'\- .]{0,39}$/u.test(s) ? s : null;
    },
    lastName: function (v) {
      var s = String(v || '').trim();
      return /^[\p{L}][\p{L}'\- .]{0,39}$/u.test(s) ? s : null;
    },
    dob: function (v) {
      var s = String(v || '').trim();
      var m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(s);
      if (!m) return null;
      var mo = +m[1], d = +m[2], y = +m[3];
      var thisYear = new Date().getFullYear();
      if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
      if (y < 1900 || y > thisYear) return null;
      return String(mo).padStart(2, '0') + '/' + String(d).padStart(2, '0') + '/' + y;
    },
  };

  /** The only path into state. A misread value cannot corrupt it. */
  Engine.prototype.set = function (field, value) {
    var setter = SETTERS[field];
    if (!setter) { this.log('warn', 'Rejected write to unknown field "' + field + '"'); return false; }
    var clean = setter(value);
    if (clean === null) { this.log('warn', 'Rejected invalid value for ' + field + ': ' + JSON.stringify(value)); return false; }
    this.state[field] = clean;
    this.log('info', 'state.' + field + ' = ' + JSON.stringify(clean));
    return true;
  };

  Engine.prototype.log = function (level, msg, extra) {
    if (this.on.log) this.on.log(level, msg, extra);
  };
  Engine.prototype.measure = function (patch) {
    if (this.on.measure) this.on.measure(patch);
  };

  /* ---- template vars --------------------------------------------------- */

  Engine.prototype.vars = function () {
    var m = this.cfg().member;
    var s = this.state;
    return {
      FIRST_NAME: s.firstName || m.firstName,
      LAST_NAME: s.lastName || m.lastName,
      FULL_NAME: (s.firstName || m.firstName) + ' ' + (s.lastName || m.lastName),
      MEMBER_NAME: (s.firstName || m.firstName) + ' ' + (s.lastName || m.lastName),
      DOB: s.dob || m.dob,
      CARRIER: s.carrier || (s.insuranceType === 'original' ? 'Medicare' : 'your'),
      COORDINATOR_NAME: m.coordinatorName,
      COORDINATOR_PHONE: m.coordinatorPhone,
      APPT_WHEN: m.apptWhen,
      APPT_LENGTH: m.apptLength,
      REMINDER_LINE: reminderLine(s.resumeChannel, s.reminderTime),
    };
  };

  /**
   * One sentence describing the reminder the member just set up, so the
   * outcome card can name it instead of saying a vague "I've sent you a link".
   * Falls back to the old wording when no reminder step ran.
   */
  function reminderLine(channel, when) {
    var verb = channel === 'sms' ? "I'll text you a link"
      : channel === 'email' ? "I'll email you a link"
      : "I've sent you a link";
    var at = when === 'morning' ? ' tomorrow morning'
      : when === 'afternoon' ? ' tomorrow afternoon'
      : when === 'evening' ? ' tomorrow evening'
      : '';
    return verb + at;
  }

  Engine.prototype.fill = function (s) {
    return global.JuneBrain.fillVars(s, this.vars());
  };

  /* ---- rendering ------------------------------------------------------- */

  Engine.prototype.scroll = function () {
    var t = this.dom.thread;
    requestAnimationFrame(function () { t.scrollTop = t.scrollHeight; });
  };

  Engine.prototype.bubble = function (who, text) {
    var row = el('<div class="Jc-row Jc-row---' + who + '"><div class="Jc-bubble"></div></div>');
    row.firstElementChild.innerHTML = mdBold(this.fill(text));
    this.dom.thread.appendChild(row);
    this.scroll();
    return row;
  };

  /** June speaks. Blank lines become separate bubbles, with a typing beat. */
  Engine.prototype.bot = async function (text, opts) {
    opts = opts || {};
    var paras = splitParas(this.fill(text));
    for (var i = 0; i < paras.length; i++) {
      if (!opts.instant) await this.typing(paras[i]);
      if (this.aborted) return;
      this.bubble('bot', paras[i]);
    }
    this.history.push({ role: 'assistant', content: this.fill(text) });
  };

  Engine.prototype.me = function (text) {
    this.bubble('me', text);
    this.history.push({ role: 'user', content: String(text) });
  };

  Engine.prototype.typing = function (forText) {
    var self = this;
    var ms = Math.min(1400, 380 + String(forText || '').length * 7);
    if (this.cfg().fastMode) ms = 60;
    var row = el('<div class="Jc-row Jc-row---bot"><div class="Jc-typing" aria-hidden="true"><span></span><span></span><span></span></div></div>');
    this.dom.thread.appendChild(row);
    this.scroll();
    return new Promise(function (res) {
      setTimeout(function () { row.remove(); res(); }, ms);
    });
  };

  Engine.prototype.control = function (node) {
    var wrap = el('<div class="Jc-row Jc-row---bot"><div class="Jc-control"></div></div>');
    wrap.firstElementChild.appendChild(node);
    this.dom.thread.appendChild(wrap);
    this.scroll();
    return wrap;
  };

  Engine.prototype.setProgress = function (frac) {
    var bar = $('.Progress-bar', this.dom.progress);
    if (bar) bar.style.transform = 'translateX(-' + Math.round((1 - frac) * 100) + '%)';
    var host = this.dom.progress;
    if (host) {
      host.setAttribute('aria-valuenow', String(Math.round(frac * 100)));
    }
  };

  /* ---- chips ----------------------------------------------------------- */

  Engine.prototype.clearChips = function () { this.dom.chips.innerHTML = ''; };

  /**
   * Render chips into the footer strip (so they never scroll away) and wait.
   * @param {Array<{label:string,value:string,exit?:boolean,aside?:boolean,other?:boolean}>} options
   */
  Engine.prototype.askChips = function (options) {
    var self = this;
    this.clearChips();
    return new Promise(function (resolve) {
      self.pending = { kind: 'chips', resolve: resolve, options: options };
      options.forEach(function (opt) {
        var cls = 'Chip' + (opt.exit ? ' Chip---quiet Chip---exit' : opt.aside ? ' Chip---quiet' : '');
        var b = el('<button type="button" class="' + cls + '"></button>');
        b.textContent = self.fill(opt.label);
        b.addEventListener('click', function () {
          self.clearChips();
          self.pending = null;
          self.me(self.fill(opt.label));
          resolve(opt);
        });
        self.dom.chips.appendChild(b);
      });
    });
  };

  /** Multi-select chips plus a confirm button. */
  Engine.prototype.askChipsMulti = function (options, confirmLabel) {
    var self = this;
    this.clearChips();
    var picked = new Set();
    return new Promise(function (resolve) {
      self.pending = { kind: 'chips-multi', resolve: resolve, options: options };
      var done;
      options.forEach(function (opt) {
        var b = el('<button type="button" class="Chip" aria-pressed="false"></button>');
        b.textContent = self.fill(opt.label);
        b.addEventListener('click', function () {
          var on = b.getAttribute('aria-pressed') === 'true';
          b.setAttribute('aria-pressed', on ? 'false' : 'true');
          if (on) picked.delete(opt.value); else picked.add(opt.value);
          if (done) done.disabled = picked.size === 0;
        });
        self.dom.chips.appendChild(b);
      });
      done = el('<button type="button" class="Button Button---primary Button---purple Button---small"></button>');
      done.textContent = confirmLabel || 'Continue';
      done.disabled = true;
      done.addEventListener('click', function () {
        var chosen = options.filter(function (o) { return picked.has(o.value); });
        self.clearChips();
        self.pending = null;
        self.me(chosen.map(function (c) { return c.label; }).join(', '));
        resolve(chosen);
      });
      self.dom.chips.appendChild(done);
    });
  };

  /* ---- text field ------------------------------------------------------ */

  /**
   * In-thread labelled field. Validates on blur (never only at submit) and
   * shows text + icon on error, never colour alone.
   */
  Engine.prototype.askField = function (o) {
    var self = this;
    var id = 'f_' + Math.random().toString(36).slice(2, 8);
    var card = el(
      '<div class="Box Box---flat">'
      + '<div class="Field">'
      + '<label class="Label" for="' + id + '"></label>'
      + '<input class="Input" id="' + id + '" type="' + (o.type || 'text')
      + '" inputmode="' + (o.inputmode || 'text') + '" autocomplete="' + (o.autocomplete || 'off')
      + '" aria-describedby="' + id + '_e" />'
      + '<p class="Field-error" id="' + id + '_e" hidden>' + ICONS.warn + '<span></span></p>'
      + '</div>'
      + '<div class="Actions"></div>'
      + '</div>'
    );
    $('label', card).textContent = o.label || 'Answer';
    var input = $('input', card);
    input.placeholder = o.placeholder || '';
    var errBox = $('.Field-error', card);
    var errText = $('.Field-error span', card);

    var submit = el('<button type="button" class="Button Button---primary Button---purple Button---full"></button>');
    submit.textContent = o.submitLabel || 'Continue';
    $('.Actions', card).appendChild(submit);

    if (o.help) {
      var helpBtn = el('<button type="button" class="Button Button---text"></button>');
      helpBtn.textContent = o.help;
      helpBtn.addEventListener('click', function () { if (self.on.sheet) self.on.sheet(o.helpSheet); });
      $('.Actions', card).appendChild(helpBtn);
    }

    this.control(card);

    function showError(msg) {
      errText.textContent = msg;
      errBox.hidden = false;
      input.setAttribute('aria-invalid', 'true');
    }
    function clearError() {
      errBox.hidden = true;
      input.removeAttribute('aria-invalid');
    }

    return new Promise(function (resolve) {
      self.pending = { kind: 'text', resolve: resolve };

      function tryFinish() {
        var raw = input.value.trim();
        if (!raw) { showError(o.emptyMessage || 'Please enter it, or use one of the options below.'); input.focus(); return; }
        var clean = o.validate ? o.validate(raw) : raw;
        if (clean === null) { showError(o.invalidMessage || "That doesn't look complete yet — have another look at the card."); input.focus(); return; }
        clearError();
        submit.disabled = true;
        input.disabled = true;
        self.pending = null;
        self.me(raw);
        resolve({ value: clean, raw: raw });
      }

      // validate at field exit, not at submit
      input.addEventListener('blur', function () {
        var raw = input.value.trim();
        if (!raw) return;
        if (o.validate && o.validate(raw) === null) showError(o.invalidMessage || "That doesn't look complete yet — have another look at the card.");
        else clearError();
      });
      input.addEventListener('input', clearError);
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); tryFinish(); } });
      submit.addEventListener('click', tryFinish);

      setTimeout(function () { input.focus(); }, 80);
    });
  };

  /* ---- confirm (summary / review card) --------------------------------- */

  Engine.prototype.askConfirm = function (o) {
    var self = this;
    var card = el(
      '<div class="Box Review">'
      + '<h3 class="Review-title"></h3>'
      + '<p class="Review-sub"></p>'
      + '<div class="Review-rows"></div>'
      + '<div class="Actions"></div>'
      + '</div>'
    );
    $('.Review-title', card).textContent = o.title || 'Quick check — did I get this right?';
    $('.Review-sub', card).textContent = o.sub || 'You can change anything before we continue.';

    var rowsHost = $('.Review-rows', card);
    o.rows.forEach(function (r) {
      var row = el(
        '<div class="Review-row">'
        + '<div class="Review-grow"><span class="Review-key"></span><span class="Review-val"></span></div>'
        + '</div>'
      );
      $('.Review-key', row).textContent = r.key;
      $('.Review-val', row).textContent = self.fill(r.value);
      if (r.field) {
        var edit = el('<button type="button" class="Button Button---text">Edit</button>');
        edit.setAttribute('aria-label', 'Edit ' + r.key);
        edit.addEventListener('click', function () {
          self.clearChips();
          if (self.pending) { self.pending = null; }
          resolveOuter({ value: 'edit', field: r.field, key: r.key });
        });
        row.appendChild(edit);
      }
      rowsHost.appendChild(row);
    });

    var ok = el('<button type="button" class="Button Button---primary Button---purple Button---full"></button>');
    ok.textContent = o.confirmLabel || 'Looks right — continue';
    $('.Actions', card).appendChild(ok);

    this.control(card);

    var resolveOuter;
    return new Promise(function (resolve) {
      resolveOuter = resolve;
      self.pending = { kind: 'confirm', resolve: resolve };
      ok.addEventListener('click', function () {
        ok.disabled = true;
        self.pending = null;
        self.me(ok.textContent);
        resolve({ value: 'ok' });
      });
    });
  };

  /* ---- card photos ----------------------------------------------------- */

  Engine.prototype.askPhotos = function () {
    var self = this;
    var card = el(
      '<div class="Box Box---flat">'
      + '<div class="Shots">'
      + '<label class="Shot">' + ICONS.camera + '<span>Front of card</span>'
      + '<input type="file" accept="image/*" capture="environment" /></label>'
      + '<label class="Shot">' + ICONS.camera + '<span>Back of card</span>'
      + '<input type="file" accept="image/*" capture="environment" /></label>'
      + '</div>'
      + '<div class="Actions"></div>'
      + '</div>'
    );
    var shots = $$('.Shot', card);
    var got = { front: null, back: null };
    var keys = ['front', 'back'];
    var send = el('<button type="button" class="Button Button---primary Button---purple Button---full">Send both photos</button>');
    send.disabled = true;
    $('.Actions', card).appendChild(send);

    var skip = el('<button type="button" class="Button Button---text">Actually, handle it on my call</button>');
    $('.Actions', card).appendChild(skip);

    shots.forEach(function (shot, i) {
      var input = $('input', shot);
      var label = $('span', shot);
      input.addEventListener('change', function () {
        if (!input.files || !input.files[0]) return;
        got[keys[i]] = { name: input.files[0].name, size: input.files[0].size };
        shot.classList.add('Shot---filled');
        label.textContent = (i === 0 ? 'Front' : 'Back') + ' added';
        $('svg', shot).outerHTML = ICONS.check;
        send.disabled = !(got.front && got.back);
      });
    });

    this.control(card);

    return new Promise(function (resolve) {
      self.pending = { kind: 'photo', resolve: resolve };
      send.addEventListener('click', function () {
        send.disabled = true; skip.disabled = true;
        self.pending = null;
        self.me('Sent both photos');
        resolve({ value: 'sent', photos: got });
      });
      skip.addEventListener('click', function () {
        send.disabled = true; skip.disabled = true;
        self.pending = null;
        self.me(skip.textContent);
        resolve({ value: 'defer' });
      });
    });
  };

  /* ---- checking state -------------------------------------------------- */

  Engine.prototype.showChecking = function (label) {
    var node = el(
      '<div class="Jc-checking" role="status">'
      + '<div class="Jc-checking-orb"><img class="Orb" src="assets/img/june-orb-sm.svg"'
      + ' alt="" width="36" height="36" /></div>'
      + '<div><div class="Jc-checking-text"></div>'
      + '<div class="Jc-typing" aria-hidden="true"><span></span><span></span><span></span></div></div>'
      + '</div>'
    );
    $('.Jc-checking-text', node).textContent = label || 'Checking your coverage…';
    var wrap = el('<div class="Jc-row Jc-row---bot"></div>');
    wrap.appendChild(node);
    this.dom.thread.appendChild(wrap);
    this.scroll();
    return wrap;
  };

  /* ---- result card ----------------------------------------------------- */

  Engine.prototype.showResult = function (outcome) {
    var self = this;
    var toneCls = outcome.tone === 'warn' ? ' Result-head---warn' : outcome.tone === 'quiet' ? ' Result-head---quiet' : '';
    var card = el('<div class="Result"><div class="Result-head' + toneCls + '"></div><div class="Result-body"></div></div>');
    $('.Result-head', card).textContent = this.fill(outcome.head);
    var body = $('.Result-body', card);

    if (outcome.banner) {
      var icon = outcome.banner.color === 'yellow' ? ICONS.warn : outcome.banner.color === 'green' ? ICONS.check : ICONS.info;
      var b = el('<div class="Banner Banner---inCard Banner---' + outcome.banner.color + '">'
        + '<span class="Banner-icon">' + icon + '</span><div></div></div>');
      var bd = $('div', b);
      bd.innerHTML = '<span class="Banner-title"></span>';
      $('.Banner-title', bd).textContent = this.fill(outcome.banner.title);
      bd.appendChild(document.createTextNode(this.fill(outcome.banner.body)));
      body.appendChild(b);
    }

    (outcome.rows || []).forEach(function (r) {
      var row = el('<div class="CostRow"><div class="CostRow-grow">'
        + '<span class="CostRow-label"></span><span class="CostRow-note"></span></div>'
        + '<span class="CostRow-value"></span></div>');
      $('.CostRow-label', row).textContent = self.fill(r.label);
      $('.CostRow-note', row).textContent = self.fill(r.note);
      $('.CostRow-value', row).textContent = self.fill(r.value);
      body.appendChild(row);
    });

    if (outcome.next) {
      var n = el('<div class="Result-next"><span class="Result-next-title"></span><p class="Result-next-body"></p></div>');
      $('.Result-next-title', n).textContent = this.fill(outcome.next.title);
      $('.Result-next-body', n).textContent = this.fill(outcome.next.body);
      body.appendChild(n);
    }

    if (outcome.foot) {
      var f = el('<p class="Result-foot"></p>');
      f.textContent = this.fill(outcome.foot);
      card.appendChild(f);
    }

    this.control(card);
    return card;
  };

  /* ---- composer + free text ------------------------------------------- */

  Engine.prototype._bindComposer = function () {
    var self = this;
    var form = this.dom.composer;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var text = self.dom.input.value.trim();
      if (!text) return;
      self.dom.input.value = '';
      self.handleTyped(text);
    });
  };

  /**
   * A typed message is an aside: answer it, then re-anchor on the current step.
   * The flow never advances from free text unless the model asks for it AND
   * the app agrees.
   */
  Engine.prototype.handleTyped = async function (text) {
    var self = this;
    var cfg = this.cfg();
    this.me(text);
    this.measure({ typedAsides: 1 });

    var savedChips = Array.prototype.map.call(this.dom.chips.children, function (b) { return b; });
    this.clearChips();

    var typingRow = el('<div class="Jc-row Jc-row---bot"><div class="Jc-typing" aria-hidden="true"><span></span><span></span><span></span></div></div>');
    this.dom.thread.appendChild(typingRow);
    this.scroll();

    var out;
    try {
      out = await global.JuneBrain.respond({
        userText: text,
        transport: cfg.transport,
        proxyUrl: cfg.proxyUrl,
        proxySecret: cfg.proxySecret,
        apiKey: cfg.apiKey,
        model: cfg.model,
        systemPrompt: cfg.systemPrompt,
        vars: this.vars(),
        step: this.step,
        known: this.knownForModel(),
        history: this.history,
        inlineBudget: cfg.inlineBudget,
        forceBadReply: cfg.forceBadReply,
      });
    } catch (err) {
      out = { source: 'scripted', intent: 'unknown', text: global.JuneBrain.SCRIPTED.unknown, chips: null, actions: [], guardrail: String(err) };
    }
    typingRow.remove();

    this.log(out.guardrail ? 'warn' : 'info',
      'turn · ' + out.source + ' · intent=' + out.intent
      + (out.latencyMs ? ' · ' + out.latencyMs + 'ms' : '')
      + (out.guardrail ? ' · guardrail: ' + out.guardrail : ''),
      {
        knowledge: out.knowledge,
        systemChars: out.systemChars,
        rejected: out.rejected,
        usage: out.usage,
      });

    if (out.tier) this.measure({ safetyTier: out.tier });

    await this.bot(out.text, { instant: false });

    // model may PROPOSE actions; the app decides whether to honour them
    var wantsDefer = false, wantsHandoff = false;
    (out.actions || []).forEach(function (a) {
      if (a.type === 'set_field') self.set(a.field, a.value);
      else if (a.type === 'defer') wantsDefer = true;
      else if (a.type === 'handoff') wantsHandoff = true;
      // 'advance' and 'verify' are deliberately ignored: only the deterministic
      // flow moves the member forward or triggers an eligibility check.
    });
    if (wantsHandoff) this.measure({ handoffOffered: 1 });

    // The app's chips always win. If the step (or a terminal outcome) already
    // owns the footer, restore exactly those — replacing them with the model's
    // suggestions would strand the member away from the real question, or away
    // from "Back to dashboard". Model chips only render into an empty footer,
    // and even then they route back through handleTyped as an aside.
    if (out.chips && out.chips.length && !savedChips.length && !this.pending) {
      out.chips.forEach(function (label) {
        var b = el('<button type="button" class="Chip Chip---quiet"></button>');
        b.textContent = label;
        b.addEventListener('click', function () { self.clearChips(); self.handleTyped(label); });
        self.dom.chips.appendChild(b);
      });
    } else {
      savedChips.forEach(function (b) { self.dom.chips.appendChild(b); });
      if (savedChips.length && this.step && this.step.say) {
        await this.bot('So — ' + lowerFirst(stripBold(this.fill(this.step.say).split(/\n\s*\n/).pop())), { instant: true });
      }
    }
    if (wantsDefer) this.log('info', 'model proposed defer; waiting for the member to choose it');
  };

  function stripBold(s) { return String(s).replace(/\*\*/g, ''); }
  function lowerFirst(s) { return String(s).charAt(0).toLowerCase() + String(s).slice(1); }

  Engine.prototype.knownForModel = function () {
    var v = this.vars();
    var s = this.state;
    return {
      'member name': v.FULL_NAME,
      'date of birth': v.DOB,
      'appointment': v.APPT_WHEN + ' with ' + v.COORDINATOR_NAME,
      'coordinator phone': v.COORDINATOR_PHONE,
      'insurance type': s.insuranceType || '(not given yet)',
      'carrier': s.carrier || '(not given yet)',
      'member ID on file': s.memberId ? 'yes' : 'no',
      'reminder': s.resumeChannel ? (s.resumeChannel + (s.reminderTime ? ' · ' + s.reminderTime : '')) : '(none set)',
    };
  };

  /* ======================================================================
     Skip conditions — a tiny evaluator over state.
     Deliberately not eval(): only identifiers, string literals, !, &&, ||,
     === and !== are allowed, so a bad expression in the panel cannot run code.
     ====================================================================== */

  /**
   * A step ends the run when its `finish` map matches the answer given.
   * `finish: { coordinator: {...} }` ends only on that answer; `'*'` ends on
   * any answer. Keeping this declarative is what lets a terminal step stop
   * being terminal — move `finish` onto the new last step of the branch and
   * the old one simply continues.
   */
  function terminalFor(step, value, isExit) {
    if (!step.finish) return null;
    if (step.finish[value]) return step.finish[value];
    // an exit chip keeps the warm-decline default unless the step named an
    // outcome for that exact answer above
    if (isExit) return null;
    return step.finish['*'] || null;
  }

  Engine.prototype.shouldSkip = function (expr) {
    if (!expr) return false;
    var state = this.state;
    var tokens = String(expr).match(/'[^']*'|"[^"]*"|[A-Za-z_]\w*|===|!==|&&|\|\||[!()]/g) || [];
    var js = tokens.map(function (t) {
      if (/^['"]/.test(t)) return JSON.stringify(t.slice(1, -1));
      if (/^(===|!==|&&|\|\||[!()])$/.test(t)) return t;
      if (t === 'true' || t === 'false' || t === 'null') return t;
      return JSON.stringify(state[t] === undefined ? null : state[t]);
    }).join(' ');
    try {
      // eslint-disable-next-line no-new-func
      return Boolean(new Function('return (' + js + ')')());
    } catch (e) {
      this.log('warn', 'skipIf could not be evaluated: ' + expr);
      return false;
    }
  };

  /* ======================================================================
     run() — the flow, as straight-line code
     ====================================================================== */

  Engine.prototype.reset = function () {
    this.aborted = true;
    this.dom.thread.innerHTML = '';
    this.clearChips();
    this.state = {};
    this.history = [];
    this.step = null;
    this.ended = false;
    this.setProgress(0);
  };

  /**
   * @param {object} [opts]
   * @param {string} [opts.startAt] step id to begin at. An entry point that
   *   already knows something (e.g. "I don't have my card" on the first screen)
   *   should not make the member answer everything before it again.
   */
  Engine.prototype.run = async function (opts) {
    opts = opts || {};
    this.aborted = false;
    var cfg = this.cfg();
    var steps = cfg.steps.filter(function (s) { return s.enabled !== false; });
    var self = this;

    // seed state from the member fixture — these are the keys we already hold
    var m = cfg.member;
    this.state.firstName = m.firstName;
    this.state.lastName = m.lastName;
    this.state.dob = m.dob;

    var from = 0;
    if (opts.startAt) {
      for (var si = 0; si < steps.length; si++) {
        if (steps[si].id === opts.startAt) { from = si; break; }
      }
      if (from === 0 && steps[0].id !== opts.startAt) {
        this.log('warn', 'startAt "' + opts.startAt + '" is not a step; starting from the top');
      } else {
        this.log('info', 'started at "' + steps[from].label + '"');
      }
    }

    // Entering mid-flow means we never asked for the ID, so don't claim that
    // rung — the terminal step sets the real one.
    this.measure(opts.startAt
      ? { started: 1 }
      : { started: 1, ladderRung: 'asked_member_id' });

    for (var i = from; i < steps.length; i++) {
      if (this.aborted) return;
      var step = steps[i];
      this.step = step;

      if (this.shouldSkip(step.skipIf)) {
        this.log('info', 'skipped "' + step.label + '" (' + step.skipIf + ')');
        continue;
      }

      this.setProgress(step.progress != null ? step.progress : (i + 1) / steps.length);

      /* --- terminal steps handled separately --- */
      if (step.kind === 'checking') { await this.doChecking(step); return; }
      if (step.kind === 'result') {
        // Falling through to here means no step emitted an outcome — a broken
        // finish chain, or every branch skipped. Land somewhere honest rather
        // than rendering nothing.
        if (!this.ended) {
          this.log('warn', 'reached the result step with no outcome decided; '
            + 'showing the deferred outcome. Check the "Ends the run" fields on the '
            + 'last step of this branch.');
          await this.finish('deferred', 'declined');
        }
        return;
      }

      if (step.say) await this.bot(step.say);
      if (this.aborted) return;

      var answered = false;
      while (!answered) {
        if (this.aborted) return;

        if (step.kind === 'chips') {
          var pick = await this.askChips(step.options || []);
          if (this.aborted) return;

          if (pick.aside) {
            // an aside answers, then loops back to the same question
            await this.handleAside(step, pick.value);
            continue;
          }

          if (pick.other) {
            var typed = await this.askField({
              label: step.inputLabel || 'Your plan',
              placeholder: 'Plan name',
              submitLabel: 'Continue',
              validate: SETTERS[step.field] || null,
              invalidMessage: 'Just the plan name is fine.',
            });
            if (this.aborted) return;
            if (step.field) this.set(step.field, typed.value);
            answered = true;
            continue;
          }

          var fin = terminalFor(step, pick.value, pick.exit);
          if (fin) {
            // record the answer that ended the run before rendering the card
            if (step.field) this.set(step.field, pick.value);
            await this.finish(fin.outcome, fin.rung);
            return;
          }

          if (pick.exit) { await this.finish('deferred', 'declined'); return; }

          if (step.field) this.set(step.field, pick.value);

          answered = true;
          continue;
        }

        if (step.kind === 'chips-multi') {
          var picks = await this.askChipsMulti(step.options || [], step.submitLabel);
          if (this.aborted) return;
          if (step.field) this.set(step.field, picks.map(function (p) { return p.value; }).join(','));
          answered = true;
          continue;
        }

        if (step.kind === 'text') {
          // the alternatives sit in the footer, equal weight with typing
          this.clearChips();
          (step.options || []).forEach(function (opt) {
            var cls = 'Chip' + (opt.exit ? ' Chip---quiet Chip---exit' : '');
            var b = el('<button type="button" class="' + cls + '"></button>');
            b.textContent = self.fill(opt.label);
            b.addEventListener('click', function () {
              self.clearChips();
              self.me(self.fill(opt.label));
              if (self.pending && self.pending.kind === 'text') {
                var r = self.pending.resolve; self.pending = null;
                r({ value: null, alt: opt.value });
              }
            });
            self.dom.chips.appendChild(b);
          });

          var res = await this.askField({
            label: step.inputLabel || 'Answer',
            placeholder: step.placeholder || '',
            inputmode: 'text',
            autocomplete: 'off',
            submitLabel: 'Check my coverage',
            help: step.help,
            helpSheet: 'member_id_help',
            validate: SETTERS[step.field] || null,
            invalidMessage: "That doesn't look like a complete ID yet — it's usually 6 to 12 characters.",
            emptyMessage: 'Pop the number in, or pick one of the options below.',
          });
          if (this.aborted) return;
          this.clearChips();

          if (res.alt === 'defer') { await this.finish('deferred', 'declined'); return; }
          if (res.alt === 'photo') { this.set('memberIdPath', 'photo'); answered = true; continue; }
          if (res.alt === 'nocard') { this.set('memberIdPath', 'nocard'); answered = true; continue; }

          this.set('memberIdPath', 'type');
          if (step.field) this.set(step.field, res.value);
          this.measure({ memberIdSubmitted: 1 });
          answered = true;
          continue;
        }

        if (step.kind === 'photo') {
          var ph = await this.askPhotos();
          if (this.aborted) return;
          if (ph.value === 'defer') { await this.finish('deferred', 'declined_at_photo'); return; }
          this.set('cardPhotos', ph.photos);
          this.measure({ cardPhotosSubmitted: 1 });
          await this.finish('photos_received', 'card_photos');
          return;
        }

        if (step.kind === 'confirm') {
          var conf = await this.askConfirm({
            rows: [
              { key: 'Name', value: '{{FULL_NAME}}', field: 'firstName' },
              { key: 'Date of birth', value: '{{DOB}}', field: 'dob' },
              { key: 'Insurance', value: this.insuranceLabel(), field: null },
              { key: 'Member ID', value: this.maskedId(), field: this.state.memberId ? 'memberId' : null },
            ].filter(function (r) { return r.value; }),
            confirmLabel: 'That\'s right — check my coverage',
          });
          if (this.aborted) return;
          if (conf.value === 'edit') { await this.doEdit(conf.field, conf.key); continue; }
          answered = true;
          continue;
        }

        // unknown kind — narrate and move on rather than stalling
        this.log('warn', 'step "' + step.label + '" has unsupported kind "' + step.kind + '"');
        answered = true;
      }
    }
  };

  Engine.prototype.insuranceLabel = function () {
    var s = this.state;
    if (s.carrier) return s.carrier;
    if (s.insuranceType === 'original') return 'Original Medicare';
    if (s.insuranceType === 'advantage') return 'Medicare Advantage';
    return '';
  };

  Engine.prototype.maskedId = function () {
    var id = this.state.memberId;
    if (!id) return '';
    return id.length > 4 ? '•'.repeat(Math.max(3, id.length - 4)) + id.slice(-4) : id;
  };

  /* ---- asides raised by a chip (not typed) ----------------------------- */

  Engine.prototype.handleAside = async function (step, value) {
    if (value === 'why') {
      await this.bot(
        "Fair question.\n\n"
        + "Your member ID lets me check that **your provider is in-network** before your call, spot any secondary coverage, and see what's left on your deductible — which can lower what you pay.\n\n"
        + "Your information is encrypted, shared only with your Bold care team, and never sold."
      );
      if (this.on.sheetOffer) this.on.sheetOffer('why_we_ask');
      return;
    }
    if (value === 'unsure') {
      await this.bot(
        "Easy to sort out.\n\n"
        + "**Original Medicare** is the red, white and blue card from the government — it says *Medicare Number* on it.\n\n"
        + "**Medicare Advantage** comes from a private insurer, so it has a logo like UnitedHealthcare, Humana or Aetna. If you have both cards, the insurer one is what I need."
      );
      return;
    }
    await this.handleTyped(String(value));
  };

  /* ---- editing a confirmed value -------------------------------------- */

  Engine.prototype.doEdit = async function (field, key) {
    var labels = { firstName: 'First name', lastName: 'Last name', dob: 'Date of birth', memberId: 'Member ID' };
    if (field === 'firstName') {
      var r1 = await this.askField({
        label: 'First name', placeholder: 'First name',
        submitLabel: 'Save', validate: SETTERS.firstName,
        invalidMessage: 'Letters, spaces, hyphens and apostrophes only.',
      });
      if (this.set('firstName', r1.value)) await this.bot("Done — I've got you as **{{FULL_NAME}}** now.");
      return;
    }
    if (field === 'dob') {
      var r2 = await this.askField({
        label: 'Date of birth', placeholder: 'MM/DD/YYYY', inputmode: 'numeric',
        submitLabel: 'Save', validate: SETTERS.dob,
        invalidMessage: 'Use MM/DD/YYYY — for example 05/14/1958.',
      });
      if (this.set('dob', r2.value)) await this.bot('Updated — **{{DOB}}**.');
      return;
    }
    if (field === 'memberId') {
      var r3 = await this.askField({
        label: 'Member ID', placeholder: 'Member ID',
        submitLabel: 'Save', validate: SETTERS.memberId,
        invalidMessage: "That doesn't look like a complete ID yet.",
      });
      if (this.set('memberId', r3.value)) await this.bot('Got it, thank you.');
      return;
    }
    await this.bot('Your coordinator can change ' + (labels[field] || key || 'that') + ' for you on the call.');
  };

  /* ---- eligibility check ---------------------------------------------- */

  Engine.prototype.doChecking = async function (step) {
    var cfg = this.cfg();
    var m = cfg.member;
    var s = this.state;

    var checking = this.showChecking(this.fill(step.say || 'Checking your coverage…'));

    var t0 = Date.now();
    var out = await global.PVerify.verify({
      payerName: s.carrier || (s.insuranceType === 'original' ? 'Medicare' : ''),
      payerCode: '',
      providerNpi: cfg.providerNpi || '',
      firstName: s.firstName, lastName: s.lastName, dob: s.dob,
      memberId: s.memberId || '',
      ssn: s.memberId ? '' : (m.ssnLast4 ? 'XXXXX' + m.ssnLast4 : ''),
      wantsGlp1: !!m.wantsGlp1,
      live: cfg.pverifyLive, proxyUrl: cfg.proxyUrl, proxySecret: cfg.proxySecret,
      scenario: cfg.scenario,
      latencyMs: cfg.fastMode ? 200 : (cfg.latencyMs != null ? cfg.latencyMs : 1600),
    });
    checking.remove();

    this.log('info', 'pVerify · ' + out.source + ' · outcome=' + out.result.outcome
      + ' · lookup=' + out.request._lookupKey + ' · ' + (Date.now() - t0) + 'ms',
      { request: out.request, normalized: out.result, error: out.error });

    this.measure({
      verifyRan: 1,
      verifyOutcome: out.result.outcome,
      coverageConfirmed: /^confirmed/.test(out.result.outcome) ? 1 : 0,
      lookupKey: out.request._lookupKey,
    });

    await this.finish(out.result.outcome, 'verified', out.result);
  };

  /* ---- terminal --------------------------------------------------------- */

  Engine.prototype.finish = async function (outcomeId, rung, normalized) {
    this.ended = true;
    var cfg = this.cfg();
    var outcome = cfg.outcomes[outcomeId] || cfg.outcomes.deferred;
    var self = this;

    // let the real carrier name from the check win over what they told us
    if (normalized && normalized.carrier) this.state.carrier = normalized.carrier;

    this.setProgress(1);
    this.step = { id: 'outcome', label: 'Result — ' + outcomeId, say: outcome.head, notes: (cfg.outcomes[outcomeId] || {}).notes || '' };

    if (outcome.say) await this.bot(outcome.say);
    if (this.aborted) return;
    this.showResult(outcome);

    this.measure({ ended: 1, ladderRung: rung, outcome: outcomeId });
    this.log('info', 'ended · outcome=' + outcomeId + ' · rung=' + rung);

    this.clearChips();
    (outcome.actions || []).forEach(function (a) {
      var b = el('<button type="button" class="Chip' + (a.primary ? '' : ' Chip---quiet') + '"></button>');
      b.textContent = self.fill(a.label);
      b.addEventListener('click', function () { self.terminalAction(a.value); });
      self.dom.chips.appendChild(b);
    });
  };

  Engine.prototype.terminalAction = function (value) {
    var self = this;
    if (value === 'dashboard') { if (this.on.screen) this.on.screen('dash'); return; }
    if (value === 'appointment') { if (this.on.screen) this.on.screen('dash', { focusAppt: true }); return; }
    if (value === 'referral_help') { if (this.on.sheet) this.on.sheet('referral_help'); return; }
    if (value === 'retry') {
      this.clearChips();
      this.state.memberId = null;
      this.step = this.cfg().steps.filter(function (s) { return s.id === 'member_id'; })[0] || this.step;
      (async function () {
        await self.bot("Let's give it another go — the number on the front of the card.");
        var r = await self.askField({
          label: 'Member ID', placeholder: 'Member ID',
          submitLabel: 'Check my coverage', help: 'How can I find this?', helpSheet: 'member_id_help',
          validate: SETTERS.memberId,
          invalidMessage: "That doesn't look like a complete ID yet — it's usually 6 to 12 characters.",
        });
        self.set('memberId', r.value);
        self.measure({ memberIdSubmitted: 1, retried: 1 });
        await self.doChecking({ say: 'Checking your coverage…' });
      })();
      return;
    }
    if (value === 'photo') {
      this.clearChips();
      (async function () {
        await self.bot("No problem — a photo of the **front and back** works just as well.");
        var ph = await self.askPhotos();
        if (ph.value === 'defer') { await self.finish('deferred', 'declined_at_photo'); return; }
        self.set('cardPhotos', ph.photos);
        self.measure({ cardPhotosSubmitted: 1 });
        await self.finish('photos_received', 'card_photos');
      })();
      return;
    }
    if (value === 'handoff' || value === 'waitlist' || value === 'plan') {
      this.clearChips();
      var msg = value === 'handoff'
        ? "Done — I've noted that you'd like to talk it through. **{{COORDINATOR_NAME}} will bring it up on your call**, or you can reach the team on {{COORDINATOR_PHONE}}."
        : value === 'waitlist'
          ? "You're on the list. **We'll email you** the moment your plan is one we can bill."
          : "Your plan is updated — the lifestyle side starts right away, and **{{COORDINATOR_NAME}} will go through medication options** with you at no cost.";
      this.measure({ handoffTaken: value === 'handoff' ? 1 : 0, waitlist: value === 'waitlist' ? 1 : 0 });
      (async function () {
        await self.bot(msg);
        var b = el('<button type="button" class="Chip">Back to dashboard</button>');
        b.addEventListener('click', function () { if (self.on.screen) self.on.screen('dash'); });
        self.dom.chips.appendChild(b);
      })();
      return;
    }
    if (this.on.screen) this.on.screen('dash');
  };

  global.JuneFlow = {
    Engine: Engine,
    ICONS: ICONS,
    SETTERS: SETTERS,
    mdBold: mdBold,
    splitParas: splitParas,
    el: el,
  };
})(window);
