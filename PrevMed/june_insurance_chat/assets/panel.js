/* ==========================================================================
   panel.js — the control panel
   --------------------------------------------------------------------------
   Six tabs:
     Flow       step-by-step editor. Structured fields drive the deterministic
                widgets; the per-step "Notes for June" prose is injected into
                the system prompt so narration follows your intent.
     Prompt     the system prompt, plus a read-only preview of the assembled
                prompt exactly as the model will receive it.
     Knowledge  RAG documents, budget gauge, and which chunks were used.
     Scenarios  pVerify outcome, the silent-retry lever, member fixture.
     Measures   the brief's own metrics, live.
     Debug      per-turn log, guardrail forcing, edge-case checklist.

   Everything persists under one localStorage namespace (documents live in
   IndexedDB via JuneRAG) with Export / Import so a config can be shared.
   ========================================================================== */

(function (global) {
  'use strict';

  var LS = 'june-insurance-chat.v1';
  var el = global.JuneFlow.el;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function deepCopy(o) { return JSON.parse(JSON.stringify(o)); }

  /* A saved config is merged OVER the shipped defaults, which means a saved copy
     from an earlier build silently wins over code changes — a shipped fix to a
     step's skipIf, a new outcome, corrected fixture copy. That is invisible and
     was the cause of "why does it break when I change it".

     So fingerprint the STRUCTURE of the shipped spec (not the wording, which you
     are meant to edit) and compare on load. A mismatch is surfaced in the panel
     rather than buried in the Debug log. */
  function specFingerprint(defaults) {
    var parts = defaults.steps.map(function (st) {
      return [st.id, st.kind, st.field || '', st.skipIf || '',
        (st.options || []).map(function (o) { return o.value; }).join(','),
        Object.keys(st.finish || {}).sort().join(',')].join('|');
    });
    parts.push('outcomes:' + Object.keys(defaults.outcomes).sort().join(','));
    parts.push('sheets:' + Object.keys(defaults.sheets).sort().join(','));
    var str = parts.join(';');
    // small deterministic hash — collision risk here is immaterial
    var h = 5381;
    for (var i = 0; i < str.length; i++) { h = ((h * 33) ^ str.charCodeAt(i)) >>> 0; }
    return String(h);
  }

  /* ====================================================================== */

  function Panel(opts) {
    this.root = opts.root;
    this.defaults = opts.defaults;      // JuneFlowDefault
    this.defaultPrompt = opts.defaultPrompt;
    this.onRestart = opts.onRestart;
    this.onScreen = opts.onScreen;

    this.cfg = this.load();
    this.logs = [];
    this.metrics = this.blankMetrics();
    this.lastKnowledge = null;
    this.proxyInfo = { proxy: false };

    this.build();
    (this.cfg.pendingNotices || []).forEach(function (m) { this.log('warn', m); }, this);
    delete this.cfg.pendingNotices;
    this.probeProxy();
  }

  /* ---- persistence ----------------------------------------------------- */

  Panel.prototype.blankCfg = function () {
    return {
      transport: 'proxy',
      proxyUrl: 'http://localhost:8788',
      proxySecret: '',
      apiKey: '',
      model: global.JuneBrain.MODEL,
      systemPrompt: this.defaultPrompt,
      steps: deepCopy(this.defaults.steps),
      outcomes: deepCopy(this.defaults.outcomes),
      sheets: deepCopy(this.defaults.sheets),
      member: deepCopy(this.defaults.member),
      scenario: 'confirmed_zero',
      silentRetryFails: true,
      pverifyLive: false,
      latencyMs: 1600,
      fastMode: false,
      inlineBudget: global.JuneRAG.INLINE_BUDGET,
      forceBadReply: false,
      checklist: {},
    };
  };

  Panel.prototype.load = function () {
    var base = this.blankCfg();
    var defaults = this.defaults;
    try {
      var raw = localStorage.getItem(LS);
      if (!raw) return base;
      var saved = JSON.parse(raw);
      Object.keys(saved).forEach(function (k) { base[k] = saved[k]; });

      // A saved config is a snapshot of an older build. Your edits win, but
      // anything the build has since ADDED should still appear rather than
      // being silently dropped.
      base.pendingNotices = [];

      if (!Array.isArray(base.steps) || !base.steps.length) {
        base.steps = deepCopy(defaults.steps);
      } else {
        // steps are a user-ordered array, so never reorder them — just say
        // which shipped steps this saved flow is missing.
        var have = {};
        base.steps.forEach(function (st) { have[st.id] = true; });
        var missing = defaults.steps.filter(function (st) { return !have[st.id]; })
          .map(function (st) { return st.id; });
        if (missing.length) {
          base.pendingNotices.push('Your saved flow is missing step(s) added since: '
            + missing.join(', ') + '. Flow > Reset flow restores them.');
        }
      }

      // Structural drift between the saved spec and this build. Surfaced in the
      // panel, because a Debug-only warning is the same as no warning.
      base.specStale = saved.specFingerprint !== specFingerprint(defaults);

      // outcomes and sheets are keyed objects, so adding a missing key is safe
      ['outcomes', 'sheets'].forEach(function (key) {
        if (!base[key] || typeof base[key] !== 'object') { base[key] = deepCopy(defaults[key]); return; }
        var added = [];
        Object.keys(defaults[key]).forEach(function (k) {
          if (!(k in base[key])) { base[key][k] = deepCopy(defaults[key][k]); added.push(k); }
        });
        if (added.length) base.pendingNotices.push('Added new ' + key + ': ' + added.join(', '));
      });

      return base;
    } catch (e) { return base; }
  };

  Panel.prototype.save = function () {
    try {
      var out = {};
      // specFingerprint is always recomputed, never carried over: load() copies
      // the saved value into cfg, so echoing it back would preserve a stale
      // fingerprint forever and the banner would never clear.
      var TRANSIENT = { pendingNotices: 1, specStale: 1, specFingerprint: 1 };
      Object.keys(this.cfg).forEach(function (k) {
        if (!TRANSIENT[k]) out[k] = this.cfg[k];
      }, this);
      out.specFingerprint = specFingerprint(this.defaults);
      localStorage.setItem(LS, JSON.stringify(out));
    }
    catch (e) { this.log('err', 'Could not save panel config: ' + e.message); }
  };

  /** The live config object the engine and brain read from. */
  Panel.prototype.get = function () {
    var c = this.cfg;
    return {
      transport: c.transport === 'key' && c.apiKey ? 'key'
        : (c.transport === 'proxy' && this.proxyInfo.proxy) ? 'proxy'
          : (c.apiKey ? 'key' : 'none'),
      proxyUrl: c.proxyUrl,
      proxySecret: c.proxySecret,
      apiKey: c.apiKey,
      model: c.model,
      systemPrompt: c.systemPrompt,
      steps: c.steps,
      outcomes: c.outcomes,
      sheets: c.sheets,
      member: c.member,
      scenario: c.scenario,
      pverifyLive: c.pverifyLive && this.proxyInfo.proxy && this.proxyInfo.info && this.proxyInfo.info.pverify,
      latencyMs: c.latencyMs,
      fastMode: c.fastMode,
      inlineBudget: c.inlineBudget,
      forceBadReply: c.forceBadReply,
    };
  };

  /* ---- shell ----------------------------------------------------------- */

  var TABS = [
    { id: 'flow', label: 'Flow' },
    { id: 'prompt', label: 'Prompt' },
    { id: 'knowledge', label: 'Knowledge' },
    { id: 'scenarios', label: 'Scenarios' },
    { id: 'measures', label: 'Measures' },
    { id: 'debug', label: 'Debug' },
  ];

  Panel.prototype.build = function () {
    var self = this;
    this.root.innerHTML = '';

    var head = el(
      '<div class="Panel-head">'
      + '<p class="Panel-title">June — insurance verification</p>'
      + '<p class="Panel-sub">Control panel. Edits apply on restart.</p>'
      + '</div>'
    );
    this.root.appendChild(head);

    if (this.cfg.specStale) this.root.appendChild(this.staleBanner());

    var tabs = el('<div class="Panel-tabs" role="tablist"></div>');
    TABS.forEach(function (t, i) {
      var b = el('<button type="button" class="Panel-tab" role="tab" id="tab_' + t.id + '" aria-controls="pane_' + t.id + '"></button>');
      b.textContent = t.label;
      b.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      b.addEventListener('click', function () { self.select(t.id); });
      tabs.appendChild(b);
    });
    this.root.appendChild(tabs);

    var body = el('<div class="Panel-body"></div>');
    TABS.forEach(function (t, i) {
      var pane = el('<section class="Panel-pane' + (i === 0 ? ' is-active' : '') + '" id="pane_' + t.id + '" role="tabpanel" aria-labelledby="tab_' + t.id + '"></section>');
      body.appendChild(pane);
    });
    this.root.appendChild(body);
    this.body = body;

    var status = el(
      '<div class="Panel-status">'
      + '<span class="Dot Dot---off" id="pStatusDot"></span>'
      + '<span id="pStatusText">Checking proxy…</span>'
      + '</div>'
    );
    this.root.appendChild(status);

    this.renderFlow();
    this.renderPrompt();
    this.renderKnowledge();
    this.renderScenarios();
    this.renderMeasures();
    this.renderDebug();
  };

  /** Shown when the saved flow predates this build. Offers both directions
   *  rather than silently picking one. */
  Panel.prototype.staleBanner = function () {
    var self = this;
    var box = el(
      '<div class="Panel-stale" role="status">'
      + '<p class="Panel-stale-title">Your saved flow is from an earlier build</p>'
      + '<p class="Panel-stale-body">Saved panel settings override the shipped ones, so '
      + 'fixes in this build are not active. Adopting keeps your system prompt, keys and '
      + 'knowledge documents \u2014 it replaces the step spec, outcome copy and the member '
      + 'fixture.</p>'
      + '<div class="Pf-row"></div></div>'
    );
    var row = $('.Pf-row', box);
    var adopt = el('<button type="button" class="Button Button---primary Button---purple Button---small">Use this build\u2019s flow</button>');
    adopt.addEventListener('click', function () {
      self.cfg.steps = deepCopy(self.defaults.steps);
      self.cfg.outcomes = deepCopy(self.defaults.outcomes);
      self.cfg.sheets = deepCopy(self.defaults.sheets);
      self.cfg.member = deepCopy(self.defaults.member);
      delete self.cfg.specStale;
      self.save();
      self.build();
      self.onScreen('dash');
      self.onRestart();
      self.log('info', 'adopted this build\u2019s flow spec');
    });
    var keep = el('<button type="button" class="Button Button---secondary Button---small">Keep mine</button>');
    keep.addEventListener('click', function () {
      delete self.cfg.specStale;
      self.save();
      self.build();
      self.log('warn', 'keeping the older saved flow; shipped fixes stay inactive');
    });
    row.appendChild(adopt);
    row.appendChild(keep);
    return box;
  };

  Panel.prototype.select = function (id) {
    $$('.Panel-tab', this.root).forEach(function (b) {
      b.setAttribute('aria-selected', b.id === 'tab_' + id ? 'true' : 'false');
    });
    $$('.Panel-pane', this.root).forEach(function (p) {
      p.classList.toggle('is-active', p.id === 'pane_' + id);
    });

    // Read-only views must reflect the current state, not whatever was true at
    // build time. The editors (flow, scenarios, prompt textarea) are NOT
    // re-rendered — that would discard in-progress edits and scroll position.
    if (id === 'debug') this.renderDebug();
    else if (id === 'measures') this.renderMeasures();
    else if (id === 'knowledge') { this.renderDocs(); this.renderLastRetrieval(); }
    else if (id === 'prompt') this.renderPromptPreview();
  };

  Panel.prototype.pane = function (id) { return $('#pane_' + id, this.root); };

  /* ---- small field helpers -------------------------------------------- */

  function field(label, node, hint) {
    var w = el('<div class="Pf"><span class="Pf-label"></span></div>');
    $('.Pf-label', w).textContent = label;
    w.appendChild(node);
    if (hint) {
      var h = el('<p class="Pf-hint"></p>');
      h.textContent = hint;
      w.appendChild(h);
    }
    return w;
  }
  /* `change` only fires on blur, so typing into the prompt or a "Notes for June"
     box and then reloading used to lose the edit. Persist on `input` too,
     debounced so we are not writing localStorage on every keystroke. */
  function debounce(fn, ms) {
    var t = null;
    return function () {
      var args = arguments, self = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(self, args); }, ms || 400);
    };
  }

  function input(value, onChange, attrs) {
    var i = el('<input class="Pf-input" type="' + ((attrs && attrs.type) || 'text') + '" />');
    i.value = value == null ? '' : value;
    if (attrs && attrs.placeholder) i.placeholder = attrs.placeholder;
    var live = debounce(function () { onChange(i.value); });
    i.addEventListener('input', live);
    i.addEventListener('change', function () { onChange(i.value); });
    return i;
  }
  function area(value, onChange, rows) {
    var t = el('<textarea class="Pf-area" rows="' + (rows || 4) + '"></textarea>');
    t.value = value == null ? '' : value;
    var live = debounce(function () { onChange(t.value); });
    t.addEventListener('input', live);
    t.addEventListener('change', function () { onChange(t.value); });
    return t;
  }
  function select(value, options, onChange) {
    var s = el('<select class="Pf-select"></select>');
    options.forEach(function (o) {
      var op = el('<option></option>');
      op.value = o.value; op.textContent = o.label;
      if (o.value === value) op.selected = true;
      s.appendChild(op);
    });
    s.addEventListener('change', function () { onChange(s.value); });
    return s;
  }
  function check(label, value, onChange) {
    var w = el('<label class="Pf-check"><input type="checkbox" /><span></span></label>');
    var i = $('input', w);
    i.checked = !!value;
    $('span', w).textContent = label;
    i.addEventListener('change', function () { onChange(i.checked); });
    return w;
  }
  function button(label, onClick, variant) {
    var b = el('<button type="button" class="Button Button---' + (variant || 'secondary') + (variant === 'primary' ? ' Button---purple' : '') + ' Button---small"></button>');
    b.textContent = label;
    b.addEventListener('click', onClick);
    return b;
  }
  function sectionTitle(text) {
    var h = el('<p class="Panel-sectionTitle"></p>');
    h.textContent = text;
    return h;
  }

  /* ======================================================================
     Tab 1 — Flow
     ====================================================================== */

  var KINDS = [
    { value: 'chips', label: 'chips — tap one' },
    { value: 'chips-multi', label: 'chips-multi — tap several' },
    { value: 'text', label: 'text — typed answer' },
    { value: 'photo', label: 'photo — card front/back' },
    { value: 'confirm', label: 'confirm — read details back' },
    { value: 'checking', label: 'checking — run eligibility' },
    { value: 'result', label: 'result — terminal card' },
    { value: 'none', label: 'none — June just talks' },
  ];

  Panel.prototype.renderFlow = function () {
    var self = this;
    var p = this.pane('flow');
    p.innerHTML = '';

    p.appendChild(el(
      '<p class="Pf-hint u-mb2">'
      + 'The structured fields drive the tappable widgets. <strong>Notes for June</strong> is prose '
      + 'injected into the system prompt for that step, so it steers what she says and how she '
      + 'handles asides — without changing the script.</p>'
    ));

    var row = el('<div class="Pf-row" class="u-mb3"></div>');
    row.appendChild(button('Restart chat', function () { self.save(); self.onRestart(); }, 'primary'));
    row.appendChild(button('Add step', function () {
      self.cfg.steps.push({
        id: 'step_' + Date.now(), label: 'New step', kind: 'chips',
        say: 'Something to ask.', options: [{ label: 'Continue', value: 'ok' }],
        notes: '', progress: null, enabled: true,
      });
      self.save(); self.renderFlow();
    }));
    row.appendChild(button('Reset flow', function () {
      if (!confirm('Discard your flow edits and restore the default steps?')) return;
      self.cfg.steps = deepCopy(self.defaults.steps);
      self.save(); self.renderFlow(); self.onRestart();
    }));
    p.appendChild(row);

    var list = el('<div></div>');
    this.cfg.steps.forEach(function (step, idx) {
      list.appendChild(self.stepCard(step, idx));
    });
    p.appendChild(list);

    p.appendChild(sectionTitle('Raw JSON'));
    p.appendChild(el('<p class="Pf-hint">Escape hatch — edit the whole spec at once. Saving replaces the steps above.</p>'));
    var raw = area(JSON.stringify(this.cfg.steps, null, 2), function () {}, 12);
    p.appendChild(raw);
    var rawRow = el('<div class="Pf-row u-mt1"></div>');
    rawRow.appendChild(button('Apply JSON', function () {
      try {
        var parsed = JSON.parse(raw.value);
        if (!Array.isArray(parsed)) throw new Error('expected an array of steps');
        self.cfg.steps = parsed;
        self.save(); self.renderFlow(); self.onRestart();
      } catch (e) { alert('That JSON did not parse:\n\n' + e.message); }
    }, 'primary'));
    p.appendChild(rawRow);

    p.appendChild(sectionTitle('Outcome copy'));
    p.appendChild(el('<p class="Pf-hint">One block per branch. {{CARRIER}}, {{COORDINATOR_NAME}} and {{APPT_WHEN}} are filled at runtime.</p>'));
    Object.keys(this.cfg.outcomes).forEach(function (key) {
      p.appendChild(self.outcomeCard(key));
    });
  };

  Panel.prototype.stepCard = function (step, idx) {
    var self = this;
    var card = el(
      '<div class="Step' + (step.enabled === false ? ' Step---off' : '') + '">'
      + '<div class="Step-bar">'
      + '<span class="Step-idx"></span>'
      + '<span class="Step-name"></span>'
      + '</div>'
      + '<div class="Step-body"></div>'
      + '</div>'
    );
    $('.Step-idx', card).textContent = String(idx + 1);
    $('.Step-name', card).textContent = step.label || step.id;

    var bar = $('.Step-bar', card);
    var toggleOpen = function () { card.classList.toggle('is-open'); };
    $('.Step-name', card).addEventListener('click', toggleOpen);

    function mini(sym, title, fn) {
      var b = el('<button type="button" class="Step-mini"></button>');
      b.textContent = sym;
      b.title = title;
      b.setAttribute('aria-label', title);
      b.addEventListener('click', fn);
      return b;
    }
    bar.appendChild(mini('↑', 'Move up', function () {
      if (idx === 0) return;
      var s = self.cfg.steps.splice(idx, 1)[0];
      self.cfg.steps.splice(idx - 1, 0, s);
      self.save(); self.renderFlow();
    }));
    bar.appendChild(mini('↓', 'Move down', function () {
      if (idx === self.cfg.steps.length - 1) return;
      var s = self.cfg.steps.splice(idx, 1)[0];
      self.cfg.steps.splice(idx + 1, 0, s);
      self.save(); self.renderFlow();
    }));
    bar.appendChild(mini(step.enabled === false ? '○' : '●',
      step.enabled === false ? 'Enable step' : 'Disable step', function () {
        step.enabled = step.enabled === false;
        self.save(); self.renderFlow();
      }));
    bar.appendChild(mini('×', 'Delete step', function () {
      if (!confirm('Delete "' + (step.label || step.id) + '"?')) return;
      self.cfg.steps.splice(idx, 1);
      self.save(); self.renderFlow();
    }));
    bar.appendChild(mini('⋯', 'Expand', toggleOpen));

    var b = $('.Step-body', card);
    b.appendChild(field('Label', input(step.label, function (v) { step.label = v; self.save(); self.renderFlow(); })));
    b.appendChild(field('June says', area(step.say, function (v) { step.say = v; self.save(); }, 4),
      'Blank line = new bubble. **double asterisks** = bold.'));
    b.appendChild(field('Notes for June', area(step.notes, function (v) { step.notes = v; self.save(); }, 4),
      'Prose. Goes into the system prompt for this step only.'));
    b.appendChild(field('Input type', select(step.kind, KINDS, function (v) { step.kind = v; self.save(); self.renderFlow(); })));
    b.appendChild(field('Writes to state field', input(step.field, function (v) { step.field = v || undefined; self.save(); }),
      'Must be a known field, or the write is rejected: '
      + Object.keys(global.JuneFlow.SETTERS).join(', ')));
    b.appendChild(field('Skip if', input(step.skipIf, function (v) { step.skipIf = v || undefined; self.save(); }),
      "e.g. insuranceType !== 'advantage'"));
    b.appendChild(field('Progress (0–1)', input(step.progress, function (v) {
      var n = parseFloat(v); step.progress = isNaN(n) ? null : n; self.save();
    }, { type: 'number' })));

    if (step.kind === 'chips' || step.kind === 'chips-multi') {
      b.appendChild(sectionTitle('Options'));
      b.appendChild(el('<p class="Pf-hint">One per line: <code>Label | value | flags</code>. '
        + 'Flags: <code>exit</code> (ends warmly), <code>aside</code> (answers then re-asks), '
        + '<code>other</code> (opens a text field).</p>'));
      var text = (step.options || []).map(function (o) {
        var flags = [];
        if (o.exit) flags.push('exit');
        if (o.aside) flags.push('aside');
        if (o.other) flags.push('other');
        return o.label + ' | ' + o.value + (flags.length ? ' | ' + flags.join(' ') : '');
      }).join('\n');
      b.appendChild(area(text, function (v) {
        step.options = v.split(/\r?\n/).map(function (line) {
          var parts = line.split('|').map(function (s) { return s.trim(); });
          if (!parts[0]) return null;
          var o = { label: parts[0], value: parts[1] || parts[0].toLowerCase().replace(/\W+/g, '_') };
          var flags = (parts[2] || '').split(/\s+/);
          if (flags.indexOf('exit') !== -1) o.exit = true;
          if (flags.indexOf('aside') !== -1) o.aside = true;
          if (flags.indexOf('other') !== -1) o.other = true;
          return o;
        }).filter(Boolean);
        self.save();
      }, Math.max(3, (step.options || []).length + 1)));
    }

    if (step.kind === 'chips' || step.kind === 'chips-multi') {
      b.appendChild(sectionTitle('Ends the run'));
      b.appendChild(el('<p class="Pf-hint">One per line: <code>answer | outcome | rung</code>. '
        + 'Use <code>*</code> for any answer. Leave empty and the conversation carries on to '
        + 'the next step instead. Outcomes available: <code>'
        + Object.keys(self.cfg.outcomes).join('</code> <code>') + '</code>.</p>'));
      var finTxt = Object.keys(step.finish || {}).map(function (k) {
        var f = step.finish[k] || {};
        return [k, f.outcome || '', f.rung || ''].join(' | ');
      }).join('\n');
      b.appendChild(area(finTxt, function (v) {
        var map = {};
        v.split(/\r?\n/).forEach(function (line) {
          var parts = line.split('|').map(function (x) { return x.trim(); });
          if (!parts[0] || !parts[1]) return;
          map[parts[0]] = { outcome: parts[1], rung: parts[2] || parts[1] };
        });
        step.finish = Object.keys(map).length ? map : undefined;
        self.save();
      }, Math.max(2, Object.keys(step.finish || {}).length + 1)));
    }

    if (step.kind === 'text') {
      b.appendChild(field('Field label', input(step.inputLabel, function (v) { step.inputLabel = v; self.save(); })));
      b.appendChild(field('Placeholder', input(step.placeholder, function (v) { step.placeholder = v; self.save(); })));
      b.appendChild(field('Help link text', input(step.help, function (v) { step.help = v; self.save(); })));
      b.appendChild(sectionTitle('Alternatives (footer chips)'));
      var t2 = (step.options || []).map(function (o) {
        return o.label + ' | ' + o.value + (o.exit ? ' | exit' : '');
      }).join('\n');
      b.appendChild(area(t2, function (v) {
        step.options = v.split(/\r?\n/).map(function (line) {
          var parts = line.split('|').map(function (s) { return s.trim(); });
          if (!parts[0]) return null;
          var o = { label: parts[0], value: parts[1] || 'defer' };
          if ((parts[2] || '').indexOf('exit') !== -1) o.exit = true;
          return o;
        }).filter(Boolean);
        self.save();
      }, 4));
    }

    return card;
  };

  Panel.prototype.outcomeCard = function (key) {
    var self = this;
    var o = this.cfg.outcomes[key];
    var card = el('<div class="Step"><div class="Step-bar"><span class="Step-idx">◆</span>'
      + '<span class="Step-name"></span></div><div class="Step-body"></div></div>');
    $('.Step-name', card).textContent = key;
    $('.Step-name', card).addEventListener('click', function () { card.classList.toggle('is-open'); });

    var b = $('.Step-body', card);
    b.appendChild(field('Card headline', input(o.head, function (v) { o.head = v; self.save(); })));
    b.appendChild(field('June says', area(o.say, function (v) { o.say = v; self.save(); }, 4)));
    b.appendChild(field('Notes for June', area(o.notes, function (v) { o.notes = v; self.save(); }, 3)));
    if (o.banner) {
      b.appendChild(field('Banner title', input(o.banner.title, function (v) { o.banner.title = v; self.save(); })));
      b.appendChild(field('Banner body', area(o.banner.body, function (v) { o.banner.body = v; self.save(); }, 2)));
    }
    if (o.next) {
      b.appendChild(field('"What happens next" title', input(o.next.title, function (v) { o.next.title = v; self.save(); })));
      b.appendChild(field('"What happens next" body', area(o.next.body, function (v) { o.next.body = v; self.save(); }, 2)));
    }
    b.appendChild(sectionTitle('Actions'));
    b.appendChild(el('<p class="Pf-hint">One per line: <code>Label | value | primary</code>. '
      + 'Values: dashboard, appointment, handoff, retry, photo, waitlist, plan, referral_help.</p>'));
    var t = (o.actions || []).map(function (a) {
      return a.label + ' | ' + a.value + (a.primary ? ' | primary' : '');
    }).join('\n');
    b.appendChild(area(t, function (v) {
      o.actions = v.split(/\r?\n/).map(function (line) {
        var parts = line.split('|').map(function (s) { return s.trim(); });
        if (!parts[0]) return null;
        return { label: parts[0], value: parts[1] || 'dashboard', primary: (parts[2] || '').indexOf('primary') !== -1 };
      }).filter(Boolean);
      self.save();
    }, Math.max(3, (o.actions || []).length + 1)));
    return card;
  };

  /* ======================================================================
     Tab 2 — Prompt
     ====================================================================== */

  Panel.prototype.renderPrompt = function () {
    var self = this;
    var p = this.pane('prompt');
    p.innerHTML = '';

    p.appendChild(sectionTitle('Connection'));
    p.appendChild(field('How to reach Claude', select(this.cfg.transport, [
      { value: 'proxy', label: 'Local proxy (key stays server-side)' },
      { value: 'key', label: 'Browser key (works on GitHub Pages)' },
      { value: 'none', label: 'Off — scripted replies only' },
    ], function (v) { self.cfg.transport = v; self.save(); self.renderPrompt(); self.probeProxy(); })));

    if (this.cfg.transport === 'proxy') {
      p.appendChild(field('Proxy URL', input(this.cfg.proxyUrl, function (v) {
        self.cfg.proxyUrl = v.trim(); self.save(); self.probeProxy();
      }), 'Local: node tools/june-proxy.mjs. Deployed: your Cloudflare Worker URL.'));
      p.appendChild(field('Shared secret', input(this.cfg.proxySecret, function (v) {
        self.cfg.proxySecret = v.trim(); self.save(); self.refreshStatus();
      }, { type: 'password', placeholder: 'only for the deployed Worker' }),
        'Sent as X-June-Key. The Worker requires it; the local proxy ignores it. '
        + 'It is visible in the browser, so it deters casual use of the endpoint — '
        + 'it is not authentication. The real ceiling is a spend cap on the key.'));
    }
    if (this.cfg.transport === 'key') {
      p.appendChild(field('Anthropic API key', input(this.cfg.apiKey, function (v) {
        self.cfg.apiKey = v.trim(); self.save(); self.refreshStatus();
      }, { type: 'password', placeholder: 'sk-ant-…' }),
        'Stored in this browser only. Use a throwaway key with a spend cap — anything in the browser is exposed.'));
    }
    p.appendChild(field('Model', input(this.cfg.model, function (v) { self.cfg.model = v.trim(); self.save(); })));

    p.appendChild(sectionTitle('System prompt'));
    var counter = el('<p class="Pf-hint"></p>');
    var ta = area(this.cfg.systemPrompt, function (v) {
      self.cfg.systemPrompt = v; self.save(); updateCount(); self.renderPromptPreview();
    }, 24);
    function updateCount() {
      var t = global.JuneRAG.estimateTokens(self.cfg.systemPrompt);
      counter.textContent = self.cfg.systemPrompt.length + ' characters · roughly ' + t + ' tokens';
    }
    updateCount();
    p.appendChild(ta);
    p.appendChild(counter);

    var row = el('<div class="Pf-row u-my1"></div>');
    row.appendChild(button('Reset to default', function () {
      if (!confirm('Replace your prompt with the shipped default?')) return;
      self.cfg.systemPrompt = self.defaultPrompt;
      self.save(); self.renderPrompt();
    }));
    row.appendChild(button('Copy', function () {
      navigator.clipboard.writeText(self.cfg.systemPrompt);
    }));
    p.appendChild(row);

    p.appendChild(el('<p class="Pf-hint">Variables filled at runtime: '
      + '<code>{{FIRST_NAME}}</code> <code>{{MEMBER_NAME}}</code> <code>{{DOB}}</code> '
      + '<code>{{CARRIER}}</code> <code>{{COORDINATOR_NAME}}</code> '
      + '<code>{{COORDINATOR_PHONE}}</code> <code>{{APPT_WHEN}}</code> '
      + '<code>{{APPT_LENGTH}}</code></p>'));

    p.appendChild(sectionTitle('Assembled prompt (read-only)'));
    p.appendChild(el('<p class="Pf-hint">Exactly what the model receives on the next turn: your prompt, then the knowledge block, then the live step and state.</p>'));
    this.previewBox = area('', function () {}, 16);
    this.previewBox.readOnly = true;
    p.appendChild(this.previewBox);
    p.appendChild(button('Refresh preview', function () { self.renderPromptPreview(); }));
    this.renderPromptPreview();
  };

  Panel.prototype.renderPromptPreview = async function () {
    if (!this.previewBox) return;
    var c = this.get();
    var step = (this.cfg.steps || [])[0] || {};
    var k = { text: '', mode: 'empty' };
    try { k = await global.JuneRAG.build(step.say || '', { inlineBudget: c.inlineBudget }); } catch (e) {}
    var m = this.cfg.member;
    var text = global.JuneBrain.assemble({
      systemPrompt: c.systemPrompt,
      vars: {
        FIRST_NAME: m.firstName, MEMBER_NAME: m.firstName + ' ' + m.lastName, DOB: m.dob,
        CARRIER: 'your', COORDINATOR_NAME: m.coordinatorName, COORDINATOR_PHONE: m.coordinatorPhone,
        APPT_WHEN: m.apptWhen, APPT_LENGTH: m.apptLength,
      },
      knowledge: k,
      step: step,
      known: { 'member name': m.firstName + ' ' + m.lastName, 'date of birth': m.dob },
    });
    this.previewBox.value = text;
    this.previewBox.rows = 16;
  };

  /* ======================================================================
     Tab 3 — Knowledge
     ====================================================================== */

  Panel.prototype.renderKnowledge = function () {
    var self = this;
    var p = this.pane('knowledge');
    p.innerHTML = '';

    p.appendChild(el(
      '<p class="Pf-hint u-mb2">Under the budget, every document is sent whole '
      + 'and cached. Over it, documents are split on headings and only the best-matching chunks are '
      + 'sent. Either way the Debug tab shows what was used.</p>'
    ));

    var drop = el('<div class="Drop" tabindex="0" role="button">Drop .md or .txt files here, or click to choose</div>');
    var file = el('<input type="file" accept=".md,.txt,.markdown,text/plain" multiple hidden />');
    drop.addEventListener('click', function () { file.click(); });
    drop.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); file.click(); } });
    drop.addEventListener('dragover', function (e) { e.preventDefault(); drop.classList.add('is-over'); });
    drop.addEventListener('dragleave', function () { drop.classList.remove('is-over'); });
    drop.addEventListener('drop', function (e) {
      e.preventDefault(); drop.classList.remove('is-over');
      self.ingest(e.dataTransfer.files);
    });
    file.addEventListener('change', function () { self.ingest(file.files); });
    p.appendChild(drop);
    p.appendChild(file);

    p.appendChild(field('Paste a document', area('', function () {}, 4), 'Name it below, then Add.'));
    var pasteArea = $('.Pf-area', p);
    var nameRow = el('<div class="Pf-row"></div>');
    var nameIn = input('', function () {}, { placeholder: 'document-name.md' });
    nameRow.appendChild(nameIn);
    nameRow.appendChild(button('Add', function () {
      var text = pasteArea.value.trim();
      if (!text) { alert('Nothing pasted yet.'); return; }
      global.JuneRAG.addDoc(nameIn.value.trim() || 'pasted.md', text, 'paste').then(function () {
        pasteArea.value = ''; nameIn.value = '';
        self.renderDocs();
      });
    }, 'primary'));
    p.appendChild(nameRow);

    p.appendChild(field('Inline budget (tokens)', input(this.cfg.inlineBudget, function (v) {
      var n = parseInt(v, 10);
      self.cfg.inlineBudget = isNaN(n) ? global.JuneRAG.INLINE_BUDGET : n;
      self.save(); self.renderDocs();
    }, { type: 'number' }), 'Corpus above this switches from inline to keyword retrieval.'));

    p.appendChild(sectionTitle('Documents'));
    this.docsHost = el('<div></div>');
    p.appendChild(this.docsHost);

    var row = el('<div class="Pf-row u-mt2"></div>');
    row.appendChild(button('Re-seed shipped docs', function () {
      global.JuneRAG.seed([
        'knowledge/bold-pricing-coverage.md',
        'knowledge/medicare-telehealth-2026.md',
        'knowledge/glp1-bridge.md',
        'knowledge/insurance-card-help.md',
      ]).then(function (added) {
        self.log('info', 'Seeded ' + added.length + ' knowledge document(s)');
        self.renderDocs();
      });
    }));
    row.appendChild(button('Remove all', function () {
      if (!confirm('Delete every knowledge document?')) return;
      global.JuneRAG.clearDocs().then(function () { self.renderDocs(); });
    }));
    p.appendChild(row);

    p.appendChild(sectionTitle('Last retrieval'));
    this.lastRetrievalHost = el('<div></div>');
    p.appendChild(this.lastRetrievalHost);
    this.renderLastRetrieval();

    this.renderDocs();
  };

  Panel.prototype.ingest = function (files) {
    var self = this;
    var list = Array.prototype.slice.call(files || []);
    if (!list.length) return;
    var pending = list.length;
    list.forEach(function (f) {
      if (!/\.(md|markdown|txt)$/i.test(f.name)) {
        self.log('warn', 'Skipped ' + f.name + ' — only .md and .txt are supported. Convert PDFs to markdown first.');
        if (--pending === 0) self.renderDocs();
        return;
      }
      var r = new FileReader();
      r.onload = function () {
        global.JuneRAG.addDoc(f.name, r.result, 'upload').then(function () {
          self.log('info', 'Added knowledge document ' + f.name);
          if (--pending === 0) self.renderDocs();
        });
      };
      r.onerror = function () { self.log('err', 'Could not read ' + f.name); if (--pending === 0) self.renderDocs(); };
      r.readAsText(f);
    });
  };

  Panel.prototype.renderDocs = function () {
    var self = this;
    if (!this.docsHost) return;
    global.JuneRAG.listDocs().then(function (docs) {
      self.docsHost.innerHTML = '';
      var total = 0;
      docs.forEach(function (d) {
        var t = global.JuneRAG.estimateTokens(d.text);
        if (d.enabled !== false) total += t;
        var row = el('<div class="Doc"><input type="checkbox" class="u-cbTop" />'
          + '<div class="Doc-grow"><span class="Doc-name"></span><span class="Doc-meta"></span></div></div>');
        var cb = $('input', row);
        cb.checked = d.enabled !== false;
        cb.setAttribute('aria-label', 'Include ' + d.name);
        cb.addEventListener('change', function () {
          d.enabled = cb.checked;
          global.JuneRAG.putDoc(d).then(function () { self.renderDocs(); });
        });
        $('.Doc-name', row).textContent = d.name;
        $('.Doc-meta', row).textContent = t + ' tokens · ' + global.JuneRAG.chunk(d).length + ' chunks · ' + d.origin;
        var del = button('Remove', function () {
          global.JuneRAG.deleteDoc(d.id).then(function () { self.renderDocs(); });
        });
        del.classList.add('Button---small');
        row.appendChild(del);
        self.docsHost.appendChild(row);
      });

      if (!docs.length) {
        self.docsHost.appendChild(el('<p class="Pf-hint">No documents yet. Use “Re-seed shipped docs”, or drop your own above.</p>'));
      }

      var budget = self.cfg.inlineBudget || global.JuneRAG.INLINE_BUDGET;
      var pct = Math.min(100, Math.round((total / budget) * 100));
      var over = total > budget;
      var gauge = el('<div class="u-mt2">'
        + '<p class="Pf-hint u-tight"></p>'
        + '<div class="Meter"><div class="Meter-fill"></div></div></div>');
      $('.Pf-hint', gauge).textContent = total + ' of ' + budget + ' tokens — '
        + (over ? 'over budget, so retrieval mode is active' : 'within budget, so everything is sent whole');
      var fill = $('.Meter-fill', gauge);
      fill.style.width = pct + '%';
      if (over) fill.classList.add('Meter-fill---over');
      else if (pct > 75) fill.classList.add('Meter-fill---warn');
      self.docsHost.appendChild(gauge);
    });
  };

  Panel.prototype.renderLastRetrieval = function () {
    if (!this.lastRetrievalHost) return;
    this.lastRetrievalHost.innerHTML = '';
    var k = this.lastKnowledge;
    if (!k) {
      this.lastRetrievalHost.appendChild(el('<p class="Pf-hint">Nothing yet — type a question in the chat.</p>'));
      return;
    }
    var head = el('<p class="Pf-hint"></p>');
    head.textContent = 'Mode: ' + k.mode + ' · ' + (k.tokens || 0) + ' tokens sent · corpus ' + (k.corpusTokens || 0) + ' tokens';
    this.lastRetrievalHost.appendChild(head);
    (k.used || []).forEach(function (u) {
      var i = el('<div class="Log-item"></div>');
      i.textContent = u.docName + ' — ' + u.heading + (u.score != null ? '  (score ' + u.score + ')' : '');
      this.lastRetrievalHost.appendChild(i);
    }, this);
  };

  /* ======================================================================
     Tab 4 — Scenarios
     ====================================================================== */

  Panel.prototype.renderScenarios = function () {
    var self = this;
    var p = this.pane('scenarios');
    p.innerHTML = '';

    p.appendChild(sectionTitle('Who sees June at all'));
    p.appendChild(el('<p class="Pf-hint">The brief targets patients pVerify could not confirm. Before we ask '
      + 'for anything, the app retries with the name, date of birth and SSN we already hold. If that '
      + 'succeeds, the patient is never asked.</p>'));
    p.appendChild(field('Silent retry with data on file',
      select(this.cfg.silentRetryFails ? 'fail' : 'pass', [
        { value: 'fail', label: 'Fails — the invitation appears' },
        { value: 'pass', label: 'Succeeds — June is never offered' },
      ], function (v) { self.cfg.silentRetryFails = v === 'fail'; self.save(); self.onScreen('dash'); })));

    p.appendChild(sectionTitle('Eligibility outcome'));
    p.appendChild(field('pVerify returns', select(this.cfg.scenario,
      global.PVerify.SCENARIOS.map(function (s) { return { value: s.id, label: s.label }; }),
      function (v) { self.cfg.scenario = v; self.save(); })));

    p.appendChild(field('Check latency (ms)', input(this.cfg.latencyMs, function (v) {
      var n = parseInt(v, 10); self.cfg.latencyMs = isNaN(n) ? 1600 : n; self.save();
    }, { type: 'number' }), 'Real checks take 1–5 seconds.'));

    var liveWrap = el('<div></div>');
    liveWrap.appendChild(check('Call pVerify for real (needs credentials on the proxy)',
      this.cfg.pverifyLive, function (v) { self.cfg.pverifyLive = v; self.save(); self.refreshStatus(); }));
    this.liveHint = el('<p class="Pf-hint"></p>');
    liveWrap.appendChild(this.liveHint);
    p.appendChild(liveWrap);

    p.appendChild(check('Fast mode (skip typing beats and latency)', this.cfg.fastMode, function (v) {
      self.cfg.fastMode = v; self.save();
    }));

    p.appendChild(sectionTitle('Member on file'));
    var m = this.cfg.member;
    [
      ['firstName', 'First name'], ['lastName', 'Last name'], ['dob', 'Date of birth'],
      ['state', 'State'], ['email', 'Email'], ['phone', 'Phone'],
      ['ssnLast4', 'SSN last 4 (from Verified)'],
      ['coordinatorName', 'Coordinator name'], ['coordinatorPhone', 'Coordinator phone'],
      ['apptWhen', 'Appointment'], ['apptLength', 'Appointment length'],
    ].forEach(function (pair) {
      p.appendChild(field(pair[1], input(m[pair[0]], function (v) { m[pair[0]] = v; self.save(); })));
    });
    p.appendChild(check('On the weight-management program (enables the GLP-1 branch)',
      m.wantsGlp1, function (v) { m.wantsGlp1 = v; self.save(); }));

    p.appendChild(sectionTitle('Config'));
    var row = el('<div class="Pf-row"></div>');
    row.appendChild(button('Export JSON', function () {
      var blob = new Blob([JSON.stringify(self.cfg, null, 2)], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'june-config.json';
      a.click();
      URL.revokeObjectURL(a.href);
    }));
    var imp = el('<input type="file" accept="application/json,.json" hidden />');
    imp.addEventListener('change', function () {
      var f = imp.files && imp.files[0];
      if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        try {
          var parsed = JSON.parse(r.result);
          self.cfg = parsed;
          self.save(); self.build(); self.probeProxy(); self.onRestart();
        } catch (e) { alert('That file did not parse:\n\n' + e.message); }
      };
      r.readAsText(f);
    });
    row.appendChild(button('Import JSON', function () { imp.click(); }));
    row.appendChild(button('Reset everything', function () {
      if (!confirm('Reset the prompt, flow, scenarios and member fixture to defaults?')) return;
      localStorage.removeItem(LS);
      self.cfg = self.blankCfg();
      self.build(); self.probeProxy(); self.onRestart();
    }));
    p.appendChild(row);
    p.appendChild(imp);
    this.refreshStatus();
  };

  /* ======================================================================
     Tab 5 — Measures
     ====================================================================== */

  Panel.prototype.blankMetrics = function () {
    return {
      started: 0, ended: 0,
      memberIdSubmitted: 0, cardPhotosSubmitted: 0, retried: 0,
      verifyRan: 0, coverageConfirmed: 0,
      verifyOutcome: null, outcome: null, ladderRung: null, lookupKey: null,
      typedAsides: 0, handoffOffered: 0, handoffTaken: 0, waitlist: 0,
      safetyTier: null,
      events: [],
    };
  };

  Panel.prototype.measure = function (patch) {
    var self = this;
    Object.keys(patch).forEach(function (k) {
      var v = patch[k];
      if (typeof v === 'number' && typeof self.metrics[k] === 'number') self.metrics[k] += v;
      else self.metrics[k] = v;
      self.metrics.events.push({ at: new Date().toISOString(), key: k, value: v });
    });
    this.renderMeasures();
  };

  Panel.prototype.renderMeasures = function () {
    var self = this;
    var p = this.pane('measures');
    if (!p) return;
    p.innerHTML = '';
    var m = this.metrics;

    p.appendChild(el('<p class="Pf-hint u-mb2">The brief\'s own metrics, live for '
      + 'this run. Primary: how many patients submit a member ID, and how many of those we can confirm. '
      + 'Guardrails: show rate and cancellation rate — both depend on the appointment surviving, which '
      + 'is why every step has a way out.</p>'));

    var grid = el('<div class="Kpi"></div>');
    function cell(key, val, tone) {
      var c = el('<div class="Kpi-cell"><span class="Kpi-key"></span><span class="Kpi-val"></span></div>');
      $('.Kpi-key', c).textContent = key;
      var v = $('.Kpi-val', c);
      v.textContent = val;
      if (tone) v.classList.add('Kpi-val---' + tone);
      return c;
    }
    grid.appendChild(cell('Member ID submitted', m.memberIdSubmitted ? 'Yes' : 'No', m.memberIdSubmitted ? 'ok' : null));
    grid.appendChild(cell('Coverage confirmed', m.coverageConfirmed ? 'Yes' : (m.verifyRan ? 'No' : '—'),
      m.coverageConfirmed ? 'ok' : (m.verifyRan ? 'warn' : null)));
    grid.appendChild(cell('Appointment intact', 'Yes', 'ok'));
    grid.appendChild(cell('Outcome', m.outcome || '—'));
    grid.appendChild(cell('Ended at', m.ladderRung || '—'));
    grid.appendChild(cell('Lookup key used', m.lookupKey || '—'));
    grid.appendChild(cell('Card photos', m.cardPhotosSubmitted ? 'Yes' : 'No'));
    grid.appendChild(cell('Typed asides', String(m.typedAsides)));
    p.appendChild(grid);

    if (m.safetyTier) {
      p.appendChild(el('<div class="Banner Banner---yellow" class="u-mb2">'
        + '<div><span class="Banner-title">Safety tier fired</span>' + m.safetyTier + '</div></div>'));
    }

    p.appendChild(sectionTitle('The ladder'));
    p.appendChild(el('<p class="Pf-hint">Each rung is only reached when the one above fails. '
      + 'Lower is more patient effort, so ending high is the win.</p>'));
    var rungs = [
      ['silent_retry', '1 · Silent retry — zero patient effort'],
      ['asked_member_id', '2 · Asked for the member ID'],
      ['card_photos', '3 · Card photo fallback'],
      ['saved_for_later', '4 · Saved to finish later'],
      ['coordinator_will_handle', '5 · Coordinator handles it'],
      ['declined', '5 · Declined — coordinator handles it'],
      ['verified', 'Reached the eligibility check'],
    ];
    rungs.forEach(function (r) {
      var hit = m.ladderRung === r[0];
      var i = el('<div class="Log-item' + (hit ? '' : '') + '"></div>');
      i.textContent = (hit ? '▶ ' : '   ') + r[1];
      if (hit) i.classList.add('Log-item---hit');
      p.appendChild(i);
    });

    p.appendChild(sectionTitle('Event stream'));
    p.appendChild(el('<p class="Pf-hint">What would fire in production.</p>'));
    var log = el('<div class="Log"></div>');
    m.events.slice(-40).reverse().forEach(function (e) {
      var i = el('<div class="Log-item"></div>');
      i.textContent = e.key + ' = ' + JSON.stringify(e.value);
      var w = el('<div class="Log-when"></div>');
      w.textContent = e.at.slice(11, 19);
      i.appendChild(w);
      log.appendChild(i);
    });
    if (!m.events.length) log.appendChild(el('<p class="Pf-hint">Nothing yet.</p>'));
    p.appendChild(log);

    p.appendChild(button('Reset metrics', function () {
      self.metrics = self.blankMetrics();
      self.renderMeasures();
    }));
  };

  /* ======================================================================
     Tab 6 — Debug
     ====================================================================== */

  var CHECKLIST = [
    'Not now from the appointment screen — appointment survives',
    'Finish this later mid-flow — appointment survives',
    'Silent retry succeeds — June is never offered',
    'Confirmed, $0',
    'Confirmed, has a copay',
    "Still can't find the member",
    'HMO — referral needed',
    'Plan not in network',
    'Pending — back-office payer',
    'No Part D route for a GLP-1',
    'Card photo path',
    'Save-and-resume path',
    'Original Medicare (carrier step skipped)',
    "\"I'm not sure\" which card I have",
    'Edited the name at the confirm step',
    'Invalid member ID — error at field exit, no blame',
    'Cost question typed mid-flow',
    'Asked for a person',
    'Chest pain — 911 tier fires',
    'Proxy off and no key — scripted flow still completes',
    'Guardrail rejection falls back to scripted copy',
    'Keyboard-only pass',
    '200% zoom',
    'Reduced motion',
  ];

  Panel.prototype.renderDebug = function () {
    var self = this;
    var p = this.pane('debug');
    p.innerHTML = '';

    var row = el('<div class="Pf-row u-mb2"></div>');
    row.appendChild(button('Copy transcript', function () {
      navigator.clipboard.writeText(self.logs.map(function (l) {
        return '[' + l.at + '] ' + l.level.toUpperCase() + ' ' + l.msg
          + (l.extra ? '\n' + JSON.stringify(l.extra, null, 2) : '');
      }).join('\n\n'));
    }, 'primary'));
    row.appendChild(button('Clear log', function () { self.logs = []; self.renderDebug(); }));
    p.appendChild(row);

    p.appendChild(check('Force the next model reply to fail the guardrail',
      this.cfg.forceBadReply, function (v) { self.cfg.forceBadReply = v; self.save(); }));
    p.appendChild(el('<p class="Pf-hint u-mb3">Exercises the fallback path: the '
      + 'reply is rejected and the scripted copy renders instead.</p>'));

    p.appendChild(sectionTitle('Turn log'));
    var log = el('<div class="Log"></div>');
    this.logs.slice(-80).reverse().forEach(function (l) {
      var cls = l.level === 'warn' ? ' Log-item---warn' : l.level === 'err' ? ' Log-item---err' : '';
      var i = el('<div class="Log-item' + cls + '"></div>');
      var t = el('<div></div>');
      t.textContent = l.msg;
      i.appendChild(t);
      var w = el('<div class="Log-when"></div>');
      w.textContent = l.at;
      i.appendChild(w);
      if (l.extra) {
        var pre = el('<pre></pre>');
        pre.textContent = JSON.stringify(l.extra, null, 2);
        i.appendChild(pre);
      }
      log.appendChild(i);
    });
    if (!this.logs.length) log.appendChild(el('<p class="Pf-hint">Nothing logged yet.</p>'));
    p.appendChild(log);

    p.appendChild(sectionTitle('Edge-case checklist'));
    p.appendChild(el('<p class="Pf-hint">The brief asks for edge cases, not-found / not-eligible '
      + 'scenarios, and copy confusion. Tick as you walk them.</p>'));
    CHECKLIST.forEach(function (label, i) {
      var key = 'c' + i;
      p.appendChild(check(label, self.cfg.checklist[key], function (v) {
        self.cfg.checklist[key] = v; self.save();
      }));
    });
  };

  Panel.prototype.log = function (level, msg, extra) {
    this.logs.push({ at: new Date().toISOString().slice(11, 19), level: level, msg: msg, extra: extra || null });
    if (extra && extra.knowledge) { this.lastKnowledge = extra.knowledge; this.renderLastRetrieval(); }
    var pane = this.pane('debug');
    if (pane && pane.classList.contains('is-active')) this.renderDebug();
  };

  /* ---- proxy status ---------------------------------------------------- */

  Panel.prototype.probeProxy = function () {
    var self = this;
    global.JuneBrain.detect({ proxyUrl: this.cfg.proxyUrl }).then(function (r) {
      self.proxyInfo = r;
      self.refreshStatus();
      if (r.proxy) self.log('info', 'Proxy reachable at ' + self.cfg.proxyUrl, r.info);
    });
  };

  Panel.prototype.refreshStatus = function () {
    // keep the in-phone "no model" strip in step with the resolved transport
    if (global.__june && global.__june.paintDevstrip) global.__june.paintDevstrip();
    var dot = $('#pStatusDot', this.root);
    var text = $('#pStatusText', this.root);
    if (!dot || !text) return;
    var t = this.get().transport;
    dot.className = 'Dot';
    if (t === 'proxy') {
      dot.classList.add('Dot---ok');
      var info = this.proxyInfo.info || {};
      var where = info.worker ? 'Cloudflare Worker' : 'local proxy';
      var needs = info.requiresKey && !this.cfg.proxySecret ? ' · needs a shared secret' : '';
      text.textContent = 'Claude via ' + where + ' · key server-side' + needs;
    }
    else if (t === 'key') { dot.classList.add('Dot---warn'); text.textContent = 'Claude via browser key · use a throwaway key'; }
    else { dot.classList.add('Dot---off'); text.textContent = 'No model — scripted replies only'; }

    if (this.liveHint) {
      var ok = this.proxyInfo.proxy && this.proxyInfo.info && this.proxyInfo.info.pverify;
      this.liveHint.textContent = ok
        ? 'Proxy reports pVerify credentials — live checks available.'
        : 'No pVerify credentials on the proxy, so checks stay simulated.';
    }
  };

  global.JunePanel = Panel;
})(window);
