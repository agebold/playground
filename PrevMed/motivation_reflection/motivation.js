/* ══════════════════════════════════════════════════════════════════════════
   motivation.js — screen router, chat engine, reflection renderer, and the
   prototype's fake instrumentation.

   Chat engine modelled on PrevMed/june_insurance_chat/assets/june-flow.js
   (bubble / bot / me / typing / askChips) and reimplemented self-contained.
   Option data lives in motivation-data.js.

   Nothing here talks to the network. mixpanel.* calls are logged, not sent.
══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var SCREENS = [
    { id: 'coverage', label: 'Coverage' },
    { id: 'checking', label: 'Checking' },
    { id: 'covered',  label: 'Covered' },
    { id: 'focus',    label: 'Focus area' },
    { id: 'chat',     label: 'Chat' },
    { id: 'matching', label: 'Matching' },
    { id: 'schedule', label: 'Schedule ★' },
    { id: 'privacy',  label: 'Privacy' },
    { id: 'consent',  label: 'Consent' },
    { id: 'phone',    label: 'Phone' },
    { id: 'allset',   label: 'All set' },
    { id: 'cc',       label: 'CC view' }
  ];

  var CHAT_QUESTIONS = 6;   /* for the header progress bar */

  var STATE = {
    variant: 'A',
    picks: [],          /* motivation ids, in pick order */
    otherText: '',
    worry: null,        /* worry id, direction C only */
    glp1: null,
    verdict: 'partd',
    slot: null,
    screen: 'coverage'
  };

  var LOG = [];         /* fake analytics tape */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── small helpers ─────────────────────────────────────────────────────── */

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function el(html) {
    var d = document.createElement('div');
    d.innerHTML = html.trim();
    return d.firstElementChild;
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function byId(list, id) {
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function motivation(id) { return byId(MOTIVATIONS, id) || byId(ESCAPES, id); }

  function direction() { return DIRECTIONS[STATE.variant]; }

  /* Options offered in the current direction. Direction B gets the longer
     list because multi-select tolerates it (see motivation-data.js). */
  function offeredOptions() {
    var maxDepth = direction().select === 'multi' ? 2 : 1;
    var out = MOTIVATIONS.filter(function (m) { return m.depth <= maxDepth; });
    return out.concat(ESCAPES);
  }

  /* The picks that are real motivations (drops the escapes). */
  function realPicks() {
    return STATE.picks.filter(function (id) { return !!byId(MOTIVATIONS, id); });
  }

  function isSkipped() { return realPicks().length === 0; }

  /* ── fake instrumentation ──────────────────────────────────────────────── */

  function trackedValue() {
    if (STATE.picks.indexOf('not_sure') > -1) return 'not_sure';
    if (isSkipped()) return STATE.picks.indexOf('other') > -1 ? 'other' : null;
    return direction().select === 'multi' ? realPicks().join(',') : realPicks()[0];
  }

  function track(event, props) {
    LOG.push({ kind: 'track', event: event, props: props || {} });
    renderDebug();
  }

  function peopleSet(props) {
    LOG.push({ kind: 'people.set', event: 'people.set', props: props });
    renderDebug();
  }

  /* Fires when the motivation question is answered — the event property AND
     the user property, which is what the ticket asks for. */
  function trackMotivation() {
    var value = trackedValue();
    var props = {
      weightLossMotivation: value,
      motivationVariant: STATE.variant,
      motivationSelectCount: realPicks().length
    };
    if (direction().select === 'multi') props.weightLossMotivationPrimary = realPicks()[0] || null;
    if (direction().worry) props.motivationWorry = STATE.worry;
    if (STATE.otherText) props.weightLossMotivationOther = STATE.otherText;
    track('Motivation Selected', props);
    peopleSet({ weightLossMotivation: value, motivationVariant: STATE.variant });
  }

  /* ── screen router ─────────────────────────────────────────────────────── */

  function go(id) {
    STATE.screen = id;
    $$('.mv-screen').forEach(function (s) { s.hidden = s.getAttribute('data-screen') !== id; });
    document.body.setAttribute('data-surface', id === 'cc' ? 'internal' : 'patient');
    $$('.mv-jump button').forEach(function (b) {
      b.setAttribute('aria-current', b.getAttribute('data-goto') === id ? 'true' : 'false');
    });
    /* The phone screen is the scroll container, so reset it — not the page.
       Below 460px the chassis is dropped and the document scrolls instead. */
    var vp = $('#mv-viewport');
    if (vp) vp.scrollTop = 0;
    window.scrollTo(0, 0);

    if (id === 'chat') startChat();
    if (id === 'checking') setTimeout(function () { if (STATE.screen === 'checking') go('covered'); }, 2200);
    if (id === 'matching') setTimeout(function () { if (STATE.screen === 'matching') go('schedule'); }, 2200);
    if (id === 'schedule') renderSchedule();
    if (id === 'allset')   renderAllSet();
    if (id === 'cc')       renderCC();

    var ev = {
      covered:  'Eligible',
      schedule: 'Scheduling Viewed',
      allset:   'CC Call Scheduled',
      cc:       'CC Pre-Call Opened'
    }[id];
    if (ev) {
      var p = { weightLossMotivation: trackedValue(), glp1VerdictBucket: STATE.verdict, motivationVariant: STATE.variant };
      if (id === 'allset') p.slot = STATE.slot;
      track(ev, p);
    }
    renderDebug();
  }

  /* ── direction switcher ────────────────────────────────────────────────── */

  function setVariant(v) {
    if (!DIRECTIONS[v]) v = 'A';
    STATE.variant = v;
    STATE.picks = []; STATE.worry = null; STATE.otherText = '';
    document.body.setAttribute('data-variant', v);
    ['A', 'B', 'C'].forEach(function (k) {
      var b = $('#mv-seg-' + k);
      if (b) b.setAttribute('aria-pressed', String(k === v));
    });
    $('#mv-caption').innerHTML = DIRECTIONS[v].caption;
    try { sessionStorage.setItem('mv-variant', v); } catch (e) {}
    LOG = [];
    resetChat();
    go(STATE.screen === 'cc' ? 'cc' : STATE.screen);
  }

  /* ══════════════════════════════════════════════════════════════════════
     CHAT
  ══════════════════════════════════════════════════════════════════════ */

  var chat = { thread: null, started: false, step: 0 };

  function resetChat() {
    chat.started = false;
    chat.step = 0;
    if (chat.thread) chat.thread.innerHTML = '';
    setChatProgress(0);
  }

  /* Keep --mv-chat-chrome honest against the rendered sticky block, so the
     newest-bubble scroll margin can never drift out of sync with the CSS. */
  function syncChatChrome() {
    var top = $('.mv-chat-top');
    if (!top) return;
    var h = Math.round(top.getBoundingClientRect().height);
    document.documentElement.style.setProperty('--mv-chat-chrome', (54 + h) + 'px');
  }

  function setChatProgress(n) {
    var fill = $('#mv-chat-progress-fill');
    if (fill) fill.style.width = Math.min(100, Math.round((n / CHAT_QUESTIONS) * 100)) + '%';
  }

  /* scroll-margin-top on .mv-row / .mv-control keeps the target clear of the
     sticky chat header. 'nearest' is right for a bubble — don't yank the thread
     further than needed. But a block of options must land at the TOP, or its
     lower choices sit below the fold and read as "there is nothing else here",
     which is exactly the discoverability failure this audience is worst served by. */
  function scrollThread(align) {
    if (!chat.thread) return;
    var last = chat.thread.lastElementChild;
    if (last && last.scrollIntoView) {
      last.scrollIntoView({
        block: align || 'nearest',
        behavior: reduceMotion ? 'auto' : 'smooth'
      });
    }
  }

  function bubble(who, html) {
    var row = el('<div class="mv-row mv-row--' + who + '"><div class="mv-bubble"></div></div>');
    row.firstElementChild.innerHTML = html;
    chat.thread.appendChild(row);
    scrollThread();
    return row;
  }

  function typing(forText) {
    if (reduceMotion) return Promise.resolve();
    var ms = Math.min(1100, 320 + String(forText || '').length * 6);
    var row = el('<div class="mv-row mv-row--bot"><div class="mv-typing" aria-hidden="true"><span></span><span></span><span></span></div></div>');
    chat.thread.appendChild(row);
    scrollThread();
    return new Promise(function (res) { setTimeout(function () { row.remove(); res(); }, ms); });
  }

  /* June speaks. Each string is its own bubble, with a typing beat first. */
  function bot(texts) {
    var list = [].concat(texts);
    return list.reduce(function (chain, t) {
      return chain.then(function () {
        return typing(t).then(function () { bubble('bot', t); });
      });
    }, Promise.resolve());
  }

  function me(text) { bubble('me', esc(text)); }

  /* Appends an in-thread control block and resolves when the user is done.
     `mode` is 'single' (resolve on pick) or 'multi' (resolve on Continue). */
  function askChips(opts) {
    return new Promise(function (resolve) {
      var mode = opts.mode || 'single';
      var max = opts.max || Infinity;
      var name = 'q' + (++askChips.seq);
      var picked = [];

      var wrap = el('<div class="mv-control"></div>');
      if (opts.note) wrap.appendChild(el('<p class="mv-control-note">' + opts.note + '</p>'));

      var fs = el('<fieldset class="mv-chips' + (opts.stack ? ' mv-chips--stack' : '') +
                  (mode === 'multi' ? ' mv-chips--ranked' : '') + '"></fieldset>');
      fs.appendChild(el('<legend>' + esc(opts.legend || 'Choose an option') + '</legend>'));

      opts.options.forEach(function (o) {
        var input = mode === 'multi' ? 'checkbox' : 'radio';
        var chip = el(
          '<label class="mv-chip' + (o.escape ? ' mv-chip--escape' : '') + '">' +
            '<input type="' + input + '" name="' + name + '" value="' + esc(o.id) + '"' +
              (o.escape    ? ' data-escape'    : '') +
              (o.exclusive ? ' data-exclusive' : '') + ' />' +
            (o.emoji ? '<span class="mv-chip-emoji" aria-hidden="true">' + o.emoji + '</span>' : '') +
            '<span class="mv-chip-rank" aria-hidden="true"></span>' +
            '<svg class="mv-chip-tick" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">' +
              '<path d="M3.5 9.5L7 13L14.5 5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>' +
            '</svg>' +
            '<span class="mv-chip-label">' + esc(o.label) + '</span>' +
          '</label>'
        );
        fs.appendChild(chip);
      });
      wrap.appendChild(fs);

      /* The optional free-text escape — the only one that survives, with voice. */
      var other = el(
        '<div class="mv-other" hidden>' +
          '<label class="cf-field-label" for="' + name + '-other">In your own words (optional)</label>' +
          '<div class="mv-other-row">' +
            '<textarea id="' + name + '-other" placeholder="Type it however you’d say it."></textarea>' +
            '<button type="button" class="mv-mic" aria-label="Use your voice instead of typing">' +
              '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
                '<path d="M12 15a3.5 3.5 0 003.5-3.5V6a3.5 3.5 0 00-7 0v5.5A3.5 3.5 0 0012 15zM19 11.5a7 7 0 01-14 0M12 18.5V22" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
              '</svg>' +
            '</button>' +
          '</div>' +
        '</div>'
      );
      if (opts.allowOther) wrap.appendChild(other);

      var cta = null;
      if (mode === 'multi' || opts.alwaysCta) {
        cta = el('<button type="button" class="Button Button---primary Button---purple Button---full" disabled>' +
                 esc(opts.ctaLabel || 'Continue') + '</button>');
        wrap.appendChild(cta);
      }

      function labelFor(id) { var o = byId(opts.options, id); return o ? o.label : id; }

      /* The cap counts real picks only. "Something else" and "Not sure yet" are
         escape hatches — locking them would make the question a hard gate,
         which is exactly what this ticket is not allowed to add. */
      function countable() {
        return picked.filter(function (v) {
          var i = $('input[value="' + v + '"]', fs);
          return !(i && i.hasAttribute('data-escape'));
        }).length;
      }

      function refreshRanks() {
        var full = countable() >= max;
        $$('.mv-chip', fs).forEach(function (chip) {
          var input = $('input', chip);
          var rank = $('.mv-chip-rank', chip);
          var i = picked.indexOf(input.value);
          rank.textContent = i > -1 ? String(i + 1) : '';
          var lock = full && i === -1 && !input.hasAttribute('data-escape');
          chip.classList.toggle('is-locked', lock);
          input.disabled = lock;
        });
      }

      function finish() {
        var text = opts.allowOther ? $('textarea', other).value.trim() : '';
        wrap.remove();
        var echo = picked.map(labelFor).join(' · ');
        if (text) echo = echo ? echo + ' — “' + text + '”' : '“' + text + '”';
        if (echo) me(echo);
        resolve({ picks: picked.slice(), text: text });
      }

      fs.addEventListener('change', function (e) {
        var input = e.target;
        if (!input || !input.name) return;

        if (mode === 'single') {
          picked = [input.value];
        } else if (input.checked) {
          if (input.hasAttribute('data-exclusive')) {
            /* "None of the above" / "Not sure yet" clears every other pick —
               the same convention as steps.js data-exclusive. */
            $$('input', fs).forEach(function (b) { if (b !== input) b.checked = false; });
            picked = [input.value];
          } else {
            $$('input[data-exclusive]', fs).forEach(function (b) {
              if (b.checked) { b.checked = false; picked = picked.filter(function (v) { return v !== b.value; }); }
            });
            if (picked.indexOf(input.value) === -1) picked.push(input.value);
          }
        } else {
          picked = picked.filter(function (v) { return v !== input.value; });
        }

        var wantsOther = picked.indexOf('other') > -1;
        if (opts.allowOther) {
          other.hidden = !wantsOther;
          if (wantsOther) setTimeout(function () { $('textarea', other).focus(); }, 60);
        }
        refreshRanks();

        if (cta) {
          cta.disabled = picked.length === 0;
        } else if (!wantsOther) {
          /* single-select with no CTA: brief pause so the selection reads */
          setTimeout(finish, reduceMotion ? 0 : 260);
        }
        /* "Something else" always needs a CTA to submit the text. */
        if (!cta && wantsOther) {
          cta = el('<button type="button" class="Button Button---primary Button---purple Button---full">' +
                   esc(opts.ctaLabel || 'Continue') + '</button>');
          cta.addEventListener('click', finish);
          wrap.appendChild(cta);
        }
      });

      if (cta) cta.addEventListener('click', function () { if (!cta.disabled) finish(); });
      $('.mv-mic', other).addEventListener('click', function () {
        $('textarea', other).setAttribute('placeholder', 'Listening… (prototype — voice input is not wired up)');
        $('textarea', other).focus();
      });

      chat.thread.appendChild(wrap);
      scrollThread('start');
    });
  }
  askChips.seq = 0;

  /* Height / weight / member-ID style in-thread fields. */
  function askFields(opts) {
    return new Promise(function (resolve) {
      var wrap = el('<div class="mv-control"></div>');
      opts.fields.forEach(function (f) {
        wrap.appendChild(el(
          '<div class="cf-field">' +
            '<label class="cf-field-label" for="' + f.id + '">' + esc(f.label) + '</label>' +
            '<div class="cf-input-wrap">' +
              '<input class="cf-input" id="' + f.id + '" type="text" inputmode="numeric" ' +
                     'autocomplete="off" placeholder="' + esc(f.placeholder || '') + '" />' +
              (f.unit ? '<span class="cf-input-unit" aria-hidden="true">' + esc(f.unit) + '</span>' : '') +
            '</div>' +
          '</div>'
        ));
      });
      var row = el('<div class="mv-chips"></div>');
      (opts.chips || []).forEach(function (c) {
        var b = el('<button type="button" class="mv-chip mv-chip--escape"><span class="mv-chip-label">' + esc(c.label) + '</span></button>');
        b.addEventListener('click', function () { wrap.remove(); me(c.label); resolve({ skipped: c.id }); });
        row.appendChild(b);
      });
      if ((opts.chips || []).length) wrap.appendChild(row);

      var cta = el('<button type="button" class="Button Button---primary Button---purple Button---full">Continue</button>');
      cta.addEventListener('click', function () {
        var vals = opts.fields.map(function (f) {
          var v = $('#' + f.id, wrap).value.trim();
          return v ? v + (f.unit ? ' ' + f.unit : '') : f.fallback || '';
        }).filter(Boolean);
        wrap.remove();
        me(vals.length ? vals.join(', ') : (opts.emptyEcho || 'Skipped'));
        resolve({ values: vals });
      });
      wrap.appendChild(cta);
      chat.thread.appendChild(wrap);
      scrollThread('start');
    });
  }

  /* ── the conversation ──────────────────────────────────────────────────── */

  function startChat() {
    if (chat.started) return;
    chat.started = true;
    chat.thread = $('#mv-thread');
    chat.thread.innerHTML = '';
    syncChatChrome();
    runChat();
  }

  function bump() { setChatProgress(++chat.step); }

  function runChat() {
    var d = direction();

    bot(['Hi Carol — I’m Bold AI, and I’m really glad you’re here.'])

      /* ── Q1 · THE MOTIVATION QUESTION — the test variable ──────────────── */
      .then(function () {
        var ask = d.select === 'multi'
          ? 'What do you want out of this? <strong>Pick up to 3.</strong>'
          : 'What’s the main thing you want out of this?';
        return bot([ask]);
      })
      .then(function () {
        return askChips({
          legend: 'What do you want out of this?',
          /* "Why we ask" inline, not behind a click. */
          note: d.select === 'multi'
            ? 'Your first pick is the one we lead with. Your provider reads these before your call.'
            : 'Pick the one that sounds most like you. There’s no wrong answer — your provider reads this before your call.',
          mode: d.select,
          max: d.maxPicks || Infinity,
          stack: true,
          allowOther: true,
          options: offeredOptions().map(function (o) {
            return { id: o.id, label: o.chip, emoji: o.emoji,
                     escape: o.id === 'other' || o.id === 'not_sure',
                     exclusive: o.id === 'not_sure' };
          })
        });
      })
      .then(function (res) {
        STATE.picks = res.picks;
        STATE.otherText = res.text;
        bump();

        /* ── Direction C only: the optional worry follow-up ───────────────── */
        if (!d.worry) { trackMotivation(); return; }
        return bot(['Anything you’re unsure about? This is optional — skip it if nothing comes to mind.'])
          .then(function () {
            return askChips({
              legend: 'Anything you’re unsure about?',
              note: 'Whatever you pick, your Care Coordinator sees it before the call.',
              mode: 'single',
              stack: true,
              options: WORRIES.map(function (w) { return { id: w.id, label: w.chip }; })
                .concat([{ id: 'nothing', label: 'Nothing right now', escape: true }])
            });
          })
          .then(function (r2) {
            STATE.worry = r2.picks[0] === 'nothing' ? null : r2.picks[0];
            trackMotivation();
          });
      })

      /* ── Q2 · safety screening ─────────────────────────────────────────── */
      .then(function () {
        return bot([reflectBack(), 'A few quick safety questions now, so your provider can plan your visit.<br><br>Do any of the following apply to you?']);
      })
      .then(function () {
        return askChips({
          legend: 'Do any of the following apply to you?',
          mode: 'multi', stack: true, ctaLabel: 'Continue',
          options: [
            { id: 'none', label: 'None of the above', escape: true, exclusive: true },
            { id: 'surgery', label: 'Weight-loss surgery in the last 2 years' },
            { id: 'kidney', label: 'Stage 4 or 5 kidney disease, or on dialysis' },
            { id: 'cancer', label: 'Ongoing cancer treatment' },
            { id: 'alcohol', label: 'Challenges with alcohol or drug use' },
            { id: 'eating', label: 'An eating disorder, now or in the last 2 years' },
            { id: 'mental', label: 'Untreated depression, anxiety or bipolar' },
            { id: 'unintentional', label: 'Unintentional weight loss of more than 5% in the last 6 months' }
          ]
        });
      })
      .then(function () { bump(); })

      /* ── Q3 · diagnosed conditions (drives the verdict bucket) ──────────── */
      .then(function () { return bot(['Have you been diagnosed with any of these?']); })
      .then(function () {
        return askChips({
          legend: 'Have you been diagnosed with any of these?',
          mode: 'multi', stack: true,
          options: [
            { id: 'none', label: 'None of the above', escape: true, exclusive: true },
            { id: 't2d', label: 'Type 2 diabetes' },
            { id: 'apnea', label: 'Sleep apnea' },
            { id: 'liver', label: 'Fatty liver disease' },
            { id: 'heart', label: 'A heart attack or stroke in the last 6 months' },
            { id: 'thyroid', label: 'Medullary thyroid cancer, or MEN 2' }
          ]
        });
      })
      .then(function (res) {
        var qualifying = ['t2d', 'apnea', 'liver'];
        STATE.verdict = res.picks.some(function (p) { return qualifying.indexOf(p) > -1; }) ? 'partd' : 'bridge';
        bump();
      })

      /* ── Q4 · height & weight ──────────────────────────────────────────── */
      .then(function () { return bot(['How tall are you, and roughly how much do you weigh?']); })
      .then(function () {
        return askFields({
          fields: [
            { id: 'mv-ft',  label: 'Your height — feet',   unit: 'ft',  placeholder: 'Feet',   fallback: '5 ft' },
            { id: 'mv-in',  label: 'Your height — inches', unit: 'in',  placeholder: 'Inches', fallback: '6 in' },
            { id: 'mv-lbs', label: 'Your weight',          unit: 'lbs', placeholder: 'Pounds', fallback: '196 lbs' }
          ]
        });
      })
      .then(function () { bump(); })

      /* ── Q5 · GLP-1 history ────────────────────────────────────────────── */
      .then(function () { return bot(['Have you taken a GLP-1 before, like Ozempic, Wegovy or Zepbound?']); })
      .then(function () {
        return askChips({
          legend: 'Have you taken a GLP-1 before?',
          mode: 'single',
          options: [
            { id: 'never', label: 'No, never' },
            { id: 'past',  label: 'Yes, in the past' },
            { id: 'now',   label: 'Yes, currently' }
          ]
        });
      })
      .then(function (res) { STATE.glp1 = res.picks[0]; bump(); })

      /* ── Q6 · insurance member ID ──────────────────────────────────────── */
      .then(function () {
        return bot(['Last question. What’s your health insurance member ID?',
                    'It’s on the front of your insurance card. If you can’t find it, skip it — your Care Coordinator can sort it out on the call.']);
      })
      .then(function () {
        return askFields({
          fields: [{ id: 'mv-memberid', label: 'Insurance member ID', placeholder: 'Number', fallback: '' }],
          chips: [{ id: 'skip', label: 'Skip for now' }],
          emptyEcho: 'Skip for now'
        });
      })
      .then(function () { bump(); })

      /* ── the verdict, in thread ────────────────────────────────────────── */
      .then(function () { return bot(verdictLines()); })
      .then(function () {
        var wrap = el('<div class="mv-control"></div>');
        var cta = el('<button type="button" class="Button Button---primary Button---purple Button---full">See your provider and pick a time</button>');
        cta.addEventListener('click', function () { go('matching'); });
        wrap.appendChild(cta);
        chat.thread.appendChild(wrap);
        scrollThread('start');
      });
  }

  /* First acknowledgement, inside the chat, right after the pick. Keeps the
     promise of "we heard you" from going cold before the scheduling step. */
  function reflectBack() {
    if (isSkipped()) {
      return 'That’s completely fine — plenty of people aren’t sure yet. Your provider will help you narrow it down on the call.';
    }
    var m = motivation(realPicks()[0]);
    return 'Got it — <strong>' + esc(m.quote.replace(/\.$/, '')) + '</strong>. I’ll make sure that’s the first thing your provider sees.';
  }

  function verdictLines() {
    /* Two prices, two voices, deliberately in separate bubbles.
       The appointment and the medication are separate pricing models and
       blending them in one breath is how people end up expecting the wrong
       number. Coverage is attributed to the appointment, never to Bold. */
    var appointment = 'Your <strong>appointments</strong> are covered by your Medicare plan. Your estimated cost is <strong>$0 out of pocket</strong> — that’s what 78% of Bold patients pay. Kathleen confirms it on your call.';
    var medication = STATE.verdict === 'partd'
      ? 'Your <strong>medication</strong> is separate. Because of your diagnosis, a GLP-1 would go through your standard Medicare Part D plan.'
      : 'Your <strong>medication</strong> is separate. Without a qualifying diagnosis, Medicare Part D won’t cover a GLP-1, so it would go through Bold Bridge at <strong>$50 a month</strong>.';
    return [
      'Good news — you look like a strong candidate.',
      medication,
      appointment,
      'Your program includes a personalised care plan — meals, movement, sleep. No calorie counting.'
    ];
  }

  /* ══════════════════════════════════════════════════════════════════════
     THE REFLECTION — schedule, all-set, and the CC view
  ══════════════════════════════════════════════════════════════════════ */

  function reflectionHTML() {
    var d = direction();

    /* Skipped: fall back to generic copy. Never render an empty callout. */
    if (isSkipped() && !STATE.otherText) {
      return '<div class="mv-reflect">' +
        '<p class="mv-reflect-label">Your call</p>' +
        '<p class="mv-reflect-quote">15 minutes, no cost, no commitment to treatment.</p>' +
        '<p class="mv-reflect-body">Your Care Coordinator will help you work out what you want from this — that’s what the call is for.</p>' +
      '</div>';
    }

    var picks = realPicks().map(motivation);
    var quote = STATE.otherText
      ? '“' + esc(STATE.otherText) + '”'
      : esc(picks[0].quote);

    /* B · the call agenda */
    if (d.select === 'multi' && picks.length) {
      var items = picks.map(function (m, i) {
        return '<li><span class="mv-agenda-num" aria-hidden="true">' + (i + 1) + '</span>' +
               '<span class="mv-agenda-text">' + esc(m.agenda) + '</span></li>';
      }).join('');
      return '<div class="mv-reflect">' +
        '<p class="mv-reflect-label">' + tickSvg() + 'Your 15 minutes will cover</p>' +
        '<ol class="mv-agenda">' + items + '</ol>' +
        '<hr class="mv-reflect-divider" />' +
        '<p class="mv-reflect-body">You told us this, so your Care Coordinator won’t ask you again.</p>' +
      '</div>';
    }

    /* C · goal, then the worry answered by name */
    if (d.worry) {
      var w = STATE.worry ? byId(WORRIES, STATE.worry) : null;
      return '<div class="mv-reflect">' +
        '<p class="mv-reflect-label">' + tickSvg() + 'Your goal</p>' +
        '<p class="mv-reflect-quote">' + quote + '</p>' +
        (picks.length ? '<p class="mv-reflect-body">' + esc(picks[0].response) + '</p>' : '') +
        (w ? '<hr class="mv-reflect-divider" />' +
             '<p class="mv-worry-label">' + esc(w.label) + '</p>' +
             '<p class="mv-reflect-body">' + w.answer + '</p>'
           : '') +
      '</div>';
    }

    /* A · verbatim echo */
    return '<div class="mv-reflect">' +
      '<p class="mv-reflect-label">' + tickSvg() + 'You told us</p>' +
      '<blockquote class="mv-reflect-quote">' + quote + '</blockquote>' +
      (picks.length ? '<p class="mv-reflect-body">' + esc(picks[0].response) + '</p>' : '') +
    '</div>';
  }

  function tickSvg() {
    return '<svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">' +
      '<path d="M3.5 9.5L7 13L14.5 5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  /* ── scheduling screen ─────────────────────────────────────────────────── */

  function renderSchedule() {
    $('#mv-schedule-reflect').innerHTML = reflectionHTML();
    if (!$('#mv-days').children.length) buildDaysAndSlots();
  }

  /* Morning slots first and listed first: our own no-show data shows
     afternoons run ~2x the morning no-show rate (10am safest, 3pm worst). */
  function buildDaysAndSlots() {
    var days = $('#mv-days');
    var DAYS = [
      { dow: 'Tue', date: 'Jan 12' }, { dow: 'Wed', date: 'Jan 13' },
      { dow: 'Thu', date: 'Jan 14' }, { dow: 'Fri', date: 'Jan 15' },
      { dow: 'Mon', date: 'Jan 18' }
    ];
    DAYS.forEach(function (d, i) {
      var b = el('<button type="button" class="cf-avail-chip" aria-pressed="' + (i === 0) + '">' +
                 '<span class="cf-avail-chip-date">' + d.dow + '</span>' +
                 '<span class="cf-avail-chip-time">' + d.date + '</span></button>');
      b.addEventListener('click', function () {
        $$('button', days).forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
      });
      days.appendChild(b);
    });

    var cta = $('#mv-schedule-cta');
    $$('#screen-schedule .cf-time-slot').forEach(function (slot) {
      slot.addEventListener('click', function () {
        $$('#screen-schedule .cf-time-slot').forEach(function (s) { s.setAttribute('aria-pressed', 'false'); });
        slot.setAttribute('aria-pressed', 'true');
        STATE.slot = slot.getAttribute('data-slot');
        cta.disabled = false;
        cta.textContent = 'Confirm ' + STATE.slot;
      });
    });
    cta.addEventListener('click', function () { if (!cta.disabled) go('privacy'); });
  }

  /* ── all-set + CC view ─────────────────────────────────────────────────── */

  function renderAllSet() {
    $('#mv-allset-slot').textContent = STATE.slot || 'Tuesday, Jan 12 · 10:00am PT';
    $('#mv-allset-reflect').innerHTML = reflectionHTML();
  }

  function renderCC() {
    var picks = realPicks().map(motivation);
    var w = STATE.worry ? byId(WORRIES, STATE.worry) : null;

    $('#mv-cc-slot').textContent = STATE.slot || 'Tuesday, Jan 12 · 10:00am PT';
    $('#mv-cc-bucket').textContent = STATE.verdict === 'partd'
      ? 'Medicare Part D (qualifying diagnosis)'
      : 'Bold Bridge — $50/mo';
    $('#mv-cc-glp1').textContent = ({ never: 'Never taken one', past: 'Taken one in the past', now: 'Currently taking one' })[STATE.glp1] || 'Not answered';
    $('#mv-cc-variant').textContent = STATE.variant + ' · ' + direction().name;

    var stated;
    if (STATE.otherText) {
      stated = '<p class="mv-reflect-quote">“' + esc(STATE.otherText) + '”</p>' +
               '<p><span class="mv-tag-code">unmapped</span></p>';
    } else if (!picks.length) {
      stated = '<p class="mv-reflect-body">Not stated — patient chose “Not sure yet.”</p>' +
               '<p><span class="mv-tag-code">tier0.nonanswer</span></p>';
    } else {
      stated = picks.map(function (m, i) {
        return '<p class="mv-reflect-quote">' + (picks.length > 1 ? (i + 1) + '. ' : '') + esc(m.quote) + '</p>' +
               '<p><span class="mv-tag-code">' + esc(m.tag) + '</span></p>';
      }).join('');
    }
    $('#mv-cc-motivation').innerHTML = stated;

    var worryEl = $('#mv-cc-worry-block');
    worryEl.hidden = !w;
    if (w) {
      $('#mv-cc-worry').innerHTML = esc(w.chip) + ' <span class="mv-tag-code">' + esc(w.tag) + '</span>';
      $('#mv-cc-worry-answer').textContent = w.answer.replace(/<[^>]+>/g, '');
    }

    /* The opener. This is the highest-leverage downstream use of the data:
       step 4 (CC call → physician visit) is our worst step. */
    var opener;
    if (STATE.otherText) {
      opener = 'Carol — you wrote “' + STATE.otherText + '”. Let’s start there.';
    } else if (!picks.length) {
      opener = 'Carol hasn’t told us what she’s after yet. Open by asking, don’t pitch.';
    } else if (w) {
      /* w.ccPhrase, not w.chip — the chip is written in the patient's first
         person ("my other medicines") and reads wrong inside this sentence. */
      opener = 'Carol — you said you want to ' + lower(picks[0].quote) +
               ' And you asked about ' + w.ccPhrase + '. Let’s take that one first.';
    } else {
      opener = 'Carol — you said you want to ' + lower(picks[0].quote) + ' Let’s start there.';
    }
    $('#mv-cc-opener').textContent = opener;
  }

  function lower(s) {
    s = String(s).replace(/\.$/, '') + '.';
    return s.charAt(0).toLowerCase() + s.slice(1);
  }

  /* ══════════════════════════════════════════════════════════════════════
     INSTRUMENTATION PANEL
  ══════════════════════════════════════════════════════════════════════ */

  function renderDebug() {
    var panel = $('#mv-debug');
    if (!panel || panel.hidden) return;

    var value = trackedValue();
    var payload = {
      event: 'Motivation Selected',
      properties: {
        weightLossMotivation: value,
        motivationVariant: STATE.variant,
        motivationSelectCount: realPicks().length,
        glp1VerdictBucket: STATE.verdict
      },
      user_properties: { weightLossMotivation: value, motivationVariant: STATE.variant }
    };
    if (direction().select === 'multi') payload.properties.weightLossMotivationPrimary = realPicks()[0] || null;
    if (direction().worry) payload.properties.motivationWorry = STATE.worry;
    if (STATE.otherText) payload.properties.weightLossMotivationOther = STATE.otherText;

    $('#mv-debug-payload').textContent = JSON.stringify(payload, null, 2);

    $('#mv-debug-log').innerHTML = LOG.length
      ? LOG.map(function (l) {
          return '<li><code>' + esc(l.kind === 'track' ? l.event : 'people.set') + '</code>' +
                 '<span>' + esc(JSON.stringify(l.props)) + '</span></li>';
        }).join('')
      : '<li><span>Nothing fired yet — answer the motivation question in the chat.</span></li>';
  }

  function buildDebugTable() {
    var rows = MOTIVATIONS.concat(ESCAPES).map(function (m) {
      return '<tr>' +
        '<td>' + esc(m.chip) + '</td>' +
        '<td><span class="mv-tag-code">' + esc(m.tag) + '</span></td>' +
        '<td>' + esc(m.pct) + '%</td>' +
        '<td>' + m.verbatims + '</td>' +
      '</tr>';
    }).join('');
    $('#mv-debug-table tbody').innerHTML = rows;
  }

  /* ══════════════════════════════════════════════════════════════════════
     BOOT
  ══════════════════════════════════════════════════════════════════════ */

  function boot() {
    /* demo bar */
    ['A', 'B', 'C'].forEach(function (k) {
      $('#mv-seg-' + k).addEventListener('click', function () { setVariant(k); });
    });
    SCREENS.forEach(function (s) {
      var b = el('<button type="button" data-goto="' + s.id + '">' + esc(s.label) + '</button>');
      b.addEventListener('click', function () { go(s.id); });
      $('#mv-jump').appendChild(b);
    });
    $('#mv-restart').addEventListener('click', function () { setVariant(STATE.variant); go('coverage'); });
    $('#mv-debug-toggle').addEventListener('click', function () {
      var p = $('#mv-debug');
      p.hidden = !p.hidden;
      $('#mv-debug-toggle').setAttribute('aria-expanded', String(!p.hidden));
      if (!p.hidden) renderDebug();
    });
    $('#mv-debug-close').addEventListener('click', function () {
      $('#mv-debug').hidden = true;
      $('#mv-debug-toggle').setAttribute('aria-expanded', 'false');
    });

    /* in-flow next/back wiring */
    $$('[data-go]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.preventDefault();
        go(b.getAttribute('data-go'));
      });
    });

    buildDebugTable();

    var params = new URLSearchParams(location.search);
    var v = params.get('v');
    if (!v) { try { v = sessionStorage.getItem('mv-variant'); } catch (e) {} }
    setVariant(DIRECTIONS[String(v || '').toUpperCase()] ? String(v).toUpperCase() : 'A');

    /* Deep-link a specific answer so a reflection can be shared as a URL:
       ?v=C&screen=schedule&pick=pain&worry=with_my_meds
       Unknown ids are dropped rather than rendered, so a stale link degrades
       to the skip fallback instead of showing a broken callout. */
    var pick = params.get('pick');
    if (pick) {
      STATE.picks = pick.split(',')
        .map(function (s) { return s.trim(); })
        .filter(function (id) { return !!motivation(id); });
    }
    if (params.get('other')) { STATE.otherText = params.get('other'); }
    var worry = params.get('worry');
    if (worry && byId(WORRIES, worry)) STATE.worry = worry;
    if (params.get('verdict') === 'bridge') STATE.verdict = 'bridge';
    if (params.get('slot')) STATE.slot = params.get('slot');
    if (pick || params.get('other')) trackMotivation();

    go(params.get('screen') || 'coverage');
  }

  if (document.readyState !== 'loading') boot();
  else document.addEventListener('DOMContentLoaded', boot);
})();
