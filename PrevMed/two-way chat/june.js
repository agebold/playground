/* Two-way care team chat — June, the AI assistant, fully scripted (no LLM).
   Order (user flow D2): screen every inbound message for emergency language → answer what June can
   (non-medical) right away → ask 2 chip questions → route with a promise → suggest reading.
   Each new question gets its own screening. Red flags are kept apart from it, so neither blocks the other. */
(function (root) {
  'use strict';
  var T = root.TWC, S = root.TWC_STORY, U = root.C.util;
  var CLINICAL = ['side-effects', 'medication'];

  function attach(api) {
    var store = api.store, act = api.act, sched = api.sched;
    function st() { return store.getState(); }
    function delayFor(text) { return 420 + Math.min(900, String(text || '').length * 9); }

    /* Show typing dots, then post one June message. */
    function say(msg, then) {
      act.setTyping('june', true);
      sched.later(delayFor(msg.body), function () {
        act.setTyping('june', false);
        var m = act.sendMessage(Object.assign({ author: 'june', kind: 'text' }, msg));
        if (then) then(m);
      });
    }

    function isQuestion(m) { return /\?/.test(m.body || '') || T.classifyTopics(m.body || '')[0] !== 'other'; }
    function screening() { var i = st().intake; return !!(i && (i.stage === 'q1' || i.stage === 'q2')); }
    /* A photo Carol sent on its own just before this message belongs to it. */
    function photoFor(m) {
      if (m.meta && m.meta.photo) return m.meta.photo;
      var ms = st().messages, k = -1;
      ms.forEach(function (x, n) { if (x.id === m.id) k = n; });
      for (var j = k - 1; j >= 0; j--) {
        var p = ms[j];
        if (p.author !== 'patient') continue;
        return p.meta && p.meta.photo && !String(p.body || '').trim() ? p.meta.photo : null;
      }
      return null;
    }

    function flag(level, m) {
      act.setIntake({ flag: level, flaggedAt: m.at, flagMessageId: m.id });
      act.sendMessage({ author: 'system', kind: 'event', audience: 'care', at: m.at, meta: { type: 'urgent' },
        body: S.care.urgentRow.replace('{time}', U.fmtTime(m.at)) });
    }

    function startIntake(m) {
      var topics = T.classifyTopics(m.body || ''), visit = topics.indexOf('appointments') >= 0;
      var introduced = st().messages.some(function (x) { return x.author === 'june' && x.meta && x.meta.intro; });
      act.setIntake({ messageId: m.id, at: m.at, topics: topics, stage: 'q1', photo: photoFor(m), feel: null, dizzy: null });
      say({ body: (introduced ? S.june.thanks : S.june.hello) + (visit ? ' ' + S.june.nextVisit : ''), meta: { intro: !introduced, answeredNextVisit: visit } }, function () {
        say({ kind: 'chips', body: (visit ? S.june.askTwo : S.june.askTwoPlain) + ' ' + S.june.q1, meta: { question: 'q1', options: S.screening.q1, answered: null } },
          function (q) { store.emit('screen:asked', { q: 'q1', id: q.id }); });
      });
    }
    /* A question sent while June is still asking joins that screening. */
    function absorb(m) {
      if (!isQuestion(m)) return;
      var i = st().intake, topics = (i.topics || []).concat(T.classifyTopics(m.body || ''))
        .filter(function (t, n, all) { return t !== 'other' && all.indexOf(t) === n; });
      act.setIntake({ messageId: m.id, at: m.at, topics: topics.length ? topics : ['other'], photo: photoFor(m) || i.photo });
    }
    /* Who answers each part: the scripted question has two parts; anything else is one row, routed by topic. */
    function routeRows(i) {
      var q = st().messages.filter(function (m) { return m.id === i.messageId; })[0];
      if (!q || q.body === S.carolQuestion) return S.routing.map(function (r) { return { q: r.q, who: r.who }; });
      var clinical = (i.topics || []).some(function (t) { return CLINICAL.indexOf(t) >= 0; });
      return [{ q: '“' + U.clip(q.body, 70) + '”', who: clinical ? 'md' : 'cc' }];
    }

    store.on('patient:message-sent', function (m) {
      if (m.kind === 'choice') return; // chip answers are handled via screen:answered
      var red = T.detectRedFlags(m.body);
      if (red) {
        flag(red.level, m);
        say({ body: red.level === 'crisis' ? S.june.crisis : S.june.redFlag, meta: { flag: red.level } });
        return;
      }
      if (m.meta && m.meta.chip != null) {
        var chip = S.juneChips[m.meta.chip];
        if (chip && chip.answer) say({ body: chip.answer, meta: { chipAnswer: m.meta.chip, link: chip.link || null } });
        return;
      }
      if (!String(m.body || '').trim()) { say({ body: S.june.photoOnly }); return; } // a photo on its own: wait for the words
      if (screening()) { absorb(m); say({ body: S.june.freeOther }); return; }
      var intake = st().intake;
      if (!intake || !intake.messageId || isQuestion(m)) { startIntake(m); return; }
      var topics = T.classifyTopics(m.body || '');
      say({ body: topics.indexOf('appointments') >= 0 || topics.indexOf('billing') >= 0 ? S.june.freeLogistics : S.june.freeOther });
    });

    store.on('screen:answered', function (a) {
      var s = st(), intake = s.intake || {};
      if (a.q === 'q1') {
        var next = function () {
          say({ kind: 'chips', body: S.june.q2, meta: { question: 'q2', options: S.screening.q2, answered: null } },
            function (q) { store.emit('screen:asked', { q: 'q2', id: q.id }); });
        };
        if (a.value === 'very') {
          // June says it marked the message for Khadija, so it is marked: urgent on the care phone.
          act.setIntake({ feel: a.value, stage: 'q2', flag: 'very-sick', flaggedAt: s.now, flagMessageId: intake.messageId });
          act.sendMessage({ author: 'system', kind: 'event', audience: 'care', meta: { type: 'urgent' },
            body: S.care.verySickRow.replace('{time}', U.fmtTime(s.now)) });
          say({ body: S.june.verySick, meta: { flag: 'very-sick' } }, next);
        } else {
          act.setIntake({ feel: a.value, stage: 'q2' });
          next();
        }
        return;
      }
      if (a.q === 'q2') {
        act.setIntake({ dizzy: a.value, stage: 'done' });
        var sentAt = intake.at || s.now;
        var by = T.replyBy(sentAt);
        var open = T.isOpen(s.now), when = T.readWhen(s.now);
        var hours = open ? S.june.openNow : (when === 'Monday morning' ? S.june.offHoursWeekend : S.june.offHoursTomorrow);
        say({ kind: 'routing', body: S.june.routeIntro, meta: { by: by.getTime(), hours: hours, rows: routeRows(intake) } }, function () {
          act.setExpectation({ owner: 'cc', by: by, since: sentAt });
          store.emit('screen:done', { by: by });
          say({ kind: 'resources', body: S.june.resourcesIntro, meta: { articles: [0, 1], footnote: S.june.generalTips } },
            function () { store.emit('resources:shown', {}); });
        });
      }
    });
  }

  root.TWCJune = { attach: attach };
})(typeof window !== 'undefined' ? window : globalThis);
