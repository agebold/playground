/* ==========================================================================
   june-brain.js — the language layer
   --------------------------------------------------------------------------
   Division of labour, from the Bold AI Chat design doc:
     the APP owns state (profile, coverage status, flow position) and performs
     all writes; the MODEL owns language. June narrates and answers asides. She
     never computes eligibility, never decides an outcome, never quotes a
     personal cost.

   Order of operations for every typed message:
     1. safety net      — 911 / 988 / GLP-1 hold-dose. Runs FIRST, always.
     2. local intent    — cheap, deterministic, works with the model offline.
     3. model call      — proxy, else BYO key, else scripted fallback.
     4. guardrails      — validate the reply before it can reach the member.
     5. action parse    — chips + [[action: ...]] through validated setters.

   Transport order is deliberate: a local proxy keeps the key server-side, a
   BYO key makes the deployed GitHub Pages build usable, and the scripted
   fallback means the prototype never dead-ends in front of a participant.
   ========================================================================== */

(function (global) {
  'use strict';

  var MODEL = 'claude-opus-5';
  var MAX_TOKENS = 700;
  var TIMEOUT_MS = 20000;

  /* ======================================================================
     1. Safety net
     ====================================================================== */

  var SAFETY = [
    {
      tier: 'emergency',
      test: /\b(chest (pain|pressure|tightness)|can'?t breathe|cannot breathe|trouble breathing|short of breath|face (is )?droop|slurred speech|stroke|passed out|fainted|fainting|severe allergic|anaphyla)/i,
      reply:
        'This needs help right now — please **call 911** (or your local emergency number).\n\n'
        + "Don't wait on me for this. If someone is with you, ask them to call.",
    },
    {
      tier: 'self_harm',
      test: /\b(kill myself|killing myself|end my life|suicid|don'?t want to (be here|live)|hurt myself|harm myself)/i,
      reply:
        "I'm really glad you told me. I want to make sure you get real support right now.\n\n"
        + 'Please call or text **988**, the Suicide & Crisis Lifeline — someone is there 24 hours a day.\n\n'
        + 'I can also get a person from your care team on this with you. Would you like that?',
    },
    {
      tier: 'glp1_urgent',
      test: /\b(can'?t keep (anything|food|water) down|throwing up (all|for)|vomiting for|been vomiting|severely dehydrat|haven'?t kept (food|water) down)/i,
      reply:
        "That's not something to push through. Per Bold's protocol, **hold your next dose and contact your provider now.**\n\n"
        + 'I can get your care team on this right away — want me to?',
    },
  ];

  function safetyCheck(text) {
    for (var i = 0; i < SAFETY.length; i++) {
      if (SAFETY[i].test.test(text)) return SAFETY[i];
    }
    return null;
  }

  /* ======================================================================
     2. Local intent routing
     Bounded set, per the design doc. Anything unrecognised falls through to
     the model, and if the model is unavailable, to a gentle handoff.
     ====================================================================== */

  var INTENTS = [
    { id: 'request_human',  test: /\b(real person|speak to (someone|a person|a human)|talk to (someone|a person|a human)|human|call me|representative|agent|coordinator now)\b/i },
    { id: 'no_card',        test: /\b(don'?t have (my|the) card|card is(n'?t| not) (here|with me|on me)|not near my card|can'?t find (my|the) card|no card|at home)\b/i },
    { id: 'cost_question',  test: /\b(how much|what (will|does) (it|this) cost|copay|co-pay|out of pocket|price|expensive|charge me|bill me|deductible)\b/i },
    { id: 'why_ask',        test: /\b(why (do|are) you (need|ask|asking)|why do i (have to|need)|what (do you|will you) do with|is (this|it) safe|privacy|secure|scam|sell my)\b/i },
    { id: 'defer',          test: /\b(later|not now|skip|another time|maybe (later|another)|stop|quit|i'?m done|leave me)\b/i },
    { id: 'correction',     test: /\b(that'?s (not|wrong)|isn'?t right|spelled? (wrong|it wrong)|misspell|actually (it'?s|my)|wrong (name|date|birthday|spelling)|change my)\b/i },
    { id: 'glp1_question',  test: /\b(glp|ozempic|wegovy|zepbound|mounjaro|semaglutide|tirzepatide|weight ?loss (med|drug|shot)|injection)\b/i },
    { id: 'confused',       test: /\b(i don'?t (know|understand)|not sure|confused|what do you mean|huh|unclear)\b/i },
  ];

  function classify(text) {
    for (var i = 0; i < INTENTS.length; i++) {
      if (INTENTS[i].test.test(text)) return INTENTS[i].id;
    }
    return 'unknown';
  }

  /* Scripted answers — used when the model is unavailable, and as the
     guardrail fallback. Every one of these is copy-reviewed, so the prototype
     is never worse than a static FAQ. */
  var SCRIPTED = {
    request_human: "Of course — no problem at all.\n\n**A Bold care coordinator can pick this up on your call**, or call you sooner at (424) 577-5266.\n\nWant me to note that you'd rather talk it through with a person?",
    no_card: "Totally fine — most people don't have it handy.\n\nI can **text or email you a link** so you can finish whenever the card turns up. Or your coordinator can just take care of it on your call.",
    cost_question: "Happy to give you the real picture.\n\n**78% of Bold patients pay $0 out of pocket** for their appointment. For those who do pay something, it's usually **$5 to $55** per visit, depending on the plan.\n\nConfirming your coverage is how we turn that range into your actual number.",
    why_ask: "Fair question.\n\nYour member ID lets us check that **your provider is in-network before your call**, spot any secondary coverage, and see what's left on your deductible — which can lower what you pay.\n\nYour information is encrypted, shared only with your Bold care team, and never sold.",
    defer: "That's completely fine — **your appointment is all set either way.**\n\nYour coordinator will take care of the insurance side on your call.",
    correction: "Thanks for catching that — let's fix it.\n\nWhat should it say instead?",
    glp1_question: "Good question. Whether a medication is a fit is a decision you make **with your Bold provider** — I can't make that call.\n\nWhat I can say: for eligible members, GLP-1s run a flat **$50/month through the Medicare GLP-1 Bridge**, and Bold's provider handles the authorizations.",
    confused: "No problem, let me try that a different way.",
    unknown: "I want to get you the right answer rather than guess at it.\n\n**A Bold care coordinator can help with this** — on your call, or sooner at (424) 577-5266. Want me to pass it along?",
  };

  /* ======================================================================
     3. Prompt assembly
     ====================================================================== */

  function fillVars(tpl, vars) {
    return String(tpl || '').replace(/\{\{(\w+)\}\}/g, function (m, k) {
      return Object.prototype.hasOwnProperty.call(vars, k) ? String(vars[k]) : m;
    });
  }

  /**
   * Assemble the full system prompt.
   * Static prefix first (identity + safety + knowledge) so it can be marked
   * cacheable; the volatile per-turn state goes last.
   */
  function assemble(o) {
    var parts = [];
    parts.push(fillVars(o.systemPrompt, o.vars || {}));

    if (o.knowledge && o.knowledge.text) {
      parts.push(
        '# Facts you may rely on\n\n'
        + 'These are Bold\'s own documents. Prefer them over anything you think you\n'
        + 'know. If the answer is not in here and not in the conversation, say you\n'
        + 'don\'t know and offer the care team.\n\n'
        + o.knowledge.text
      );
    }

    var live = [];
    var v = o.vars || {};
    live.push('# Right now');
    live.push('Current step: **' + (o.step && o.step.label || 'unknown') + '**');
    if (o.step && o.step.say) {
      // fill vars first: the model must see the real question the member sees,
      // not the raw "{{FIRST_NAME}}" template.
      live.push('The question on screen is: "'
        + fillVars(String(o.step.say), v).replace(/\n+/g, ' ').trim() + '"');
    }
    if (o.step && o.step.notes) {
      // the Flow tab's "Notes for June" — this is how the panel steers narration
      live.push('\nDesign notes for this step (follow these):\n' + fillVars(o.step.notes, v));
    }
    if (o.known && Object.keys(o.known).length) {
      live.push('\nWhat we already know about this member (never invent beyond this):');
      Object.keys(o.known).forEach(function (k) {
        if (o.known[k] !== '' && o.known[k] != null) live.push('- ' + k + ': ' + o.known[k]);
      });
    }
    live.push(
      '\nAnswer the member, then bring them back to the question above. Do not'
      + '\nadvance the flow yourself and do not state a coverage decision.'
    );
    parts.push(live.join('\n'));

    return parts.join('\n\n---\n\n');
  }

  /* ======================================================================
     4. Output guardrails
     Modelled on assertSafePhrasing() in mvp4-side-effect-triage.html.
     The digit rule is the important one: it structurally prevents the model
     from inventing a dollar figure, a percentage, or a member ID.
     ====================================================================== */

  /* A blunt /\byou have\b/ rule looked right and was wrong: it fires on the
     flow's own central question ("Which card do you have?"). Match the shape of
     a diagnosis instead — an asserted condition — not the two words. */
  var CONDITIONS = 'diabet\\w*|type ?2|prediabet\\w*|hypertension|high blood pressure|'
    + 'sleep apnea|apnea|obesity|obese|heart (?:disease|failure|condition)|'
    + 'kidney disease|liver disease|mash|nash|cancer|depression|dementia|thyroid\\w*';

  var BANNED = [
    { re: new RegExp("\\byou(?:'ve| have| had)? (?:been )?diagnosed\\b", 'i'),
      why: 'reads as a diagnosis' },
    { re: new RegExp("\\byou (?:have|'ve got|got) (?:a |an |the )?(?:" + CONDITIONS + ")\\b", 'i'),
      why: 'names a condition the member "has"' },
    { re: new RegExp("\\byou (?:are|'re) (?:" + CONDITIONS + ")\\b", 'i'),
      why: 'names a condition the member "has"' },
    { re: /\bi'?m \d+% (sure|confident)/i,                    why: 'confidence score' },
    { re: /\bpart d (automatically |)covers\b/i,               why: 'Part D never automatically covers a GLP-1' },
    // "free" must not attach to a visit in EITHER order — the first version only
    // caught "free visit" and let "your first visit is free" through.
    { fn: function (t) {
        var scrubbed = String(t).replace(/\bfeel free\b/gi, '');   // ordinary filler
        return /\bfree\b[^.!?]{0,24}\b(visit|appointment|consult|session|call)\b/i.test(scrubbed)
          || /\b(visit|appointment|consult|session|call)\b[^.!?]{0,24}\bfree\b/i.test(scrubbed);
      },
      why: 'must say "$0 out of pocket" or "no cost", never "free"' },
    { re: /\byou (are|'re) (covered|not covered|eligible|ineligible)\b/i, why: 'states a coverage decision the app owns' },
    { re: /\bbold is covered\b/i,                              why: 'coverage attaches to the appointment, not the company' },
    { re: /\b(system prompt|these instructions|my instructions)\b/i, why: 'discusses its own instructions' },

    /* Promises are banned, but "coverage is never guaranteed" is exactly the
       honest phrasing we want — so only flag the affirmative form. */
    { re: /\b(guarantee[sd]?|promise[sd]?|will definitely)\b/i,
      why: 'promises an outcome',
      skipIfNegated: true },
  ];

  var NEGATION = /\b(not|never|no|cannot|can't|won't|isn't|aren't|don't|doesn't|without)\b[^.!?]{0,24}$/i;

  /* Numbers June may state without them appearing in context: crisis lines and
     the handful of long numbers that are safety-critical to get out intact. */
  var SAFE_NUMBERS = new Set(['911', '988', '741741']);

  /**
   * @returns {{ok:boolean, why?:string}}
   */
  function checkReply(reply, context) {
    var text = String(reply || '').trim();
    if (!text) return { ok: false, why: 'empty reply' };
    if (text.length > 1400) return { ok: false, why: 'too long (' + text.length + ' chars)' };
    if (/[<>]/.test(text)) return { ok: false, why: 'contains angle brackets' };

    for (var i = 0; i < BANNED.length; i++) {
      var rule = BANNED[i];
      if (rule.fn) {
        if (rule.fn(text)) return { ok: false, why: rule.why };
        continue;
      }
      var m = rule.re.exec(text);
      if (!m) continue;
      // "not guaranteed" / "we can't promise" are the phrasings we want, so a
      // negation immediately before the match clears it.
      if (rule.skipIfNegated && NEGATION.test(text.slice(0, m.index))) continue;
      return { ok: false, why: rule.why };
    }

    /* Numbers.
       The first version of this rule rejected ANY digit not already in context.
       That blocked correct output — "call 988", "about 2 minutes", "your 2026
       plan" — and a rejected reply falls back to scripted copy, which reads as
       June answering something unrelated. Measured: 3 of 8 realistic replies
       blocked.

       What actually needs protecting is the class of number a member would act
       on and we cannot know: money, percentages, and identifiers. Ordinary
       quantities, years and crisis lines are fine. */
    var risky = [];
    // money, with or without decimals or thousands separators
    (text.match(/\$\s?\d[\d,]*(?:\.\d+)?/g) || []).forEach(function (m) {
      risky.push({ kind: 'a dollar figure', raw: m, norm: m.replace(/[^\d.]/g, '') });
    });
    // percentages
    (text.match(/\d+(?:\.\d+)?\s?%/g) || []).forEach(function (m) {
      risky.push({ kind: 'a percentage', raw: m, norm: m.replace(/[^\d.]/g, '') });
    });
    // identifier-shaped runs: 5+ digits (member IDs, ZIPs, policy numbers)
    (text.match(/\b\d{5,}\b/g) || []).forEach(function (m) {
      if (SAFE_NUMBERS.has(m)) return;
      risky.push({ kind: 'an ID-like number', raw: m, norm: m });
    });
    // phone-shaped
    (text.match(/\b(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]\d{4}\b/g) || []).forEach(function (m) {
      risky.push({ kind: 'a phone number', raw: m, norm: m.replace(/\D/g, '') });
    });

    if (risky.length) {
      var haystack = String(context || '');
      var digitsOnly = haystack.replace(/[^\d.]/g, ' ');
      for (var j = 0; j < risky.length; j++) {
        var r = risky[j];
        if (haystack.indexOf(r.raw) !== -1) continue;
        // compare on digits so "$50" matches "$50/month" and "(424) 577-5266"
        // matches "4245775266"
        if (digitsOnly.replace(/\s+/g, '').indexOf(r.norm) !== -1) continue;
        if (new RegExp('(^|[^\\d.])' + r.norm.replace('.', '\\.') + '([^\\d]|$)').test(digitsOnly)) continue;
        return { ok: false, why: 'invented ' + r.kind + ' (' + r.raw.trim() + ')' };
      }
    }

    return { ok: true };
  }

  /* ======================================================================
     5. Action + chip parsing
     The model may PROPOSE; the app validates and performs the write.
     ====================================================================== */

  function parseDirectives(reply) {
    var text = String(reply || '');
    var chips = null;
    var multi = false;
    var actions = [];

    text = text.replace(/\[\[chips(\s+multi)?:([^\]]*)\]\]/gi, function (m, isMulti, body) {
      multi = Boolean(isMulti);
      chips = body.split('|').map(function (s) { return s.trim(); }).filter(Boolean);
      return '';
    });

    text = text.replace(/\[\[action:\s*([^\]]+)\]\]/gi, function (m, body) {
      body.split(',').forEach(function (a) {
        a = a.trim();
        if (!a) return;
        var set = /^set_field:\s*([a-zA-Z_][\w]*)\s*=\s*(.*)$/.exec(a);
        if (set) { actions.push({ type: 'set_field', field: set[1], value: set[2].trim() }); return; }
        if (/^(advance|back|handoff|verify|defer)$/i.test(a)) actions.push({ type: a.toLowerCase() });
      });
      return '';
    });

    return { text: text.replace(/\n{3,}/g, '\n\n').trim(), chips: chips, multi: multi, actions: actions };
  }

  /* ======================================================================
     6. Transport
     ====================================================================== */

  /** Header block for a proxy call. The Worker requires the shared secret;
      the local dev proxy ignores it. */
  function proxyHeaders(cfg) {
    var h = { 'Content-Type': 'application/json' };
    if (cfg && cfg.proxySecret) h['X-June-Key'] = cfg.proxySecret;
    return h;
  }

  function detect(cfg) {
    // /health is deliberately secret-free so the client can find out whether a
    // proxy exists at all before it has been configured
    var url = (cfg.proxyUrl || '').replace(/\/$/, '');
    if (!url) return Promise.resolve({ proxy: false });
    return fetch(url + '/health', { method: 'GET' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { return j ? { proxy: true, info: j } : { proxy: false }; })
      .catch(function () { return { proxy: false }; });
  }

  async function callModel(o) {
    var system = assemble(o);
    var messages = (o.history || []).slice(-12).map(function (m) {
      return { role: m.role, content: String(m.content) };
    });
    messages.push({ role: 'user', content: o.userText });

    var body = {
      model: o.model || MODEL,
      max_tokens: MAX_TOKENS,
      system: [
        // static prefix marked cacheable — identity + safety + knowledge
        { type: 'text', text: system, cache_control: { type: 'ephemeral' } },
      ],
      messages: messages,
    };

    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, o.timeoutMs || TIMEOUT_MS);
    var started = Date.now();

    try {
      var res;
      if (o.transport === 'proxy') {
        res = await fetch((o.proxyUrl || '').replace(/\/$/, '') + '/chat', {
          method: 'POST',
          headers: proxyHeaders(o),
          body: JSON.stringify(body),
          signal: ctrl.signal,
        });
      } else {
        // BYO key: the browser holds it. Documented as throwaway-only.
        res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': o.apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
          body: JSON.stringify(body),
          signal: ctrl.signal,
        });
      }
      clearTimeout(timer);

      if (!res.ok) {
        var detail = await res.text().catch(function () { return ''; });
        throw new Error(res.status + ' ' + detail.slice(0, 200));
      }
      var data = await res.json();

      if (data.stop_reason === 'refusal') throw new Error('model refused');

      var text = (data.content || [])
        .filter(function (b) { return b.type === 'text'; })
        .map(function (b) { return b.text; })
        .join('\n')
        .trim();

      return {
        text: text,
        systemChars: system.length,
        latencyMs: Date.now() - started,
        usage: data.usage || null,
      };
    } catch (err) {
      clearTimeout(timer);
      throw err;
    }
  }

  /* ======================================================================
     7. The one entry point the flow calls
     ====================================================================== */

  /**
   * Handle a free-text message from the member.
   *
   * @returns {{
   *   source:'safety'|'model'|'scripted',
   *   tier?:string, intent:string, text:string,
   *   chips:?string[], multi:boolean, actions:object[],
   *   guardrail:?string, latencyMs:?number, systemChars:?number,
   *   knowledge:object
   * }}
   */
  async function respond(o) {
    var userText = String(o.userText || '').trim();

    /* 1. Safety first, always, before anything else touches the message. */
    var hit = safetyCheck(userText);
    if (hit) {
      return {
        source: 'safety', tier: hit.tier, intent: 'safety',
        text: hit.reply, chips: ['Yes, connect me', 'No, I\'m okay'], multi: false,
        actions: hit.tier === 'emergency' ? [] : [{ type: 'handoff' }],
        guardrail: null, knowledge: { mode: 'skipped', used: [] },
      };
    }

    var intent = classify(userText);

    /* 2. Retrieve knowledge for this question. */
    var knowledge = { mode: 'empty', text: '', tokens: 0, used: [], corpusTokens: 0 };
    try {
      // Bounded: retrieval is an enhancement, never a reason a turn stalls.
      knowledge = await Promise.race([
        global.JuneRAG.build(userText + ' ' + (o.step && o.step.say || ''), {
          inlineBudget: o.inlineBudget,
        }),
        new Promise(function (resolve) {
          setTimeout(function () {
            resolve({ mode: 'timeout', text: '', tokens: 0, used: [], corpusTokens: 0 });
          }, o.ragTimeoutMs || 2000);
        }),
      ]);
    } catch (e) {
      knowledge = { mode: 'error', text: '', tokens: 0, used: [], corpusTokens: 0, error: String(e && e.message || e) };
    }

    /* 3. Model, if we have a way to reach it. */
    var canModel = (o.transport === 'proxy' && o.proxyUrl) || (o.transport === 'key' && o.apiKey);
    if (canModel) {
      try {
        var out = await callModel({
          transport: o.transport, proxyUrl: o.proxyUrl, proxySecret: o.proxySecret,
          apiKey: o.apiKey, model: o.model,
          systemPrompt: o.systemPrompt, vars: o.vars, knowledge: knowledge,
          step: o.step, known: o.known, history: o.history, userText: userText,
          timeoutMs: o.timeoutMs,
        });

        var parsed = parseDirectives(out.text);

        /* 4. Guardrails. Context = what the model was legitimately allowed to
              echo back: the member's words, our state, and the knowledge. */
        var context = [
          userText,
          JSON.stringify(o.known || {}),
          knowledge.text,
          o.step && o.step.say,
          o.step && o.step.notes,
          (o.history || []).map(function (m) { return m.content; }).join(' '),
        ].join(' ');

        var verdict = o.forceBadReply ? { ok: false, why: 'forced by Debug tab' } : checkReply(parsed.text, context);

        if (verdict.ok) {
          return {
            source: 'model', intent: intent, text: parsed.text,
            chips: parsed.chips, multi: parsed.multi, actions: parsed.actions,
            guardrail: null, latencyMs: out.latencyMs, systemChars: out.systemChars,
            usage: out.usage, knowledge: knowledge,
          };
        }

        return {
          source: 'scripted', intent: intent,
          text: SCRIPTED[intent] || SCRIPTED.unknown,
          chips: null, multi: false, actions: [],
          guardrail: verdict.why, latencyMs: out.latencyMs, systemChars: out.systemChars,
          rejected: parsed.text, knowledge: knowledge,
        };
      } catch (err) {
        return {
          source: 'scripted', intent: intent,
          text: SCRIPTED[intent] || SCRIPTED.unknown,
          chips: null, multi: false, actions: [],
          guardrail: 'model call failed: ' + String(err && err.message || err),
          knowledge: knowledge,
        };
      }
    }

    /* 5. No model available — the scripted path still answers properly. */
    return {
      source: 'scripted', intent: intent,
      text: SCRIPTED[intent] || SCRIPTED.unknown,
      chips: null, multi: false, actions: [],
      guardrail: null, knowledge: knowledge,
    };
  }

  global.JuneBrain = {
    MODEL: MODEL,
    SCRIPTED: SCRIPTED,
    BANNED: BANNED,
    safetyCheck: safetyCheck,
    classify: classify,
    assemble: assemble,
    fillVars: fillVars,
    checkReply: checkReply,
    parseDirectives: parseDirectives,
    proxyHeaders: proxyHeaders,
    detect: detect,
    respond: respond,
  };
})(window);
