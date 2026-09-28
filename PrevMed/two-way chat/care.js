/* Two-way care team chat — the care team's phone (Healthie messaging patterns, Bold components).
   Ali (Care Advocate) reads first; Dr. Desai works from Tasks. Same contract as patient.js: every tap calls a
   named intent, the story engine calls the same intents, each is idempotent and always emits its event.
   `model` holds the pure parts (June's intake card, inbox triage, the recap, task preview, templates);
   verify-chat.mjs tests them in Node. */
(function (root) {
  'use strict';
  var T = root.TWC, S = root.TWC_STORY, C = root.C, U = C.util, esc = T.esc;
  var CLINICAL = ['side-effects', 'medication'];

  /* ── Model (pure) ──────────────────────────────────────────────────── */
  function fill(tpl, map) { return String(tpl).replace(/\{(\w+)\}/g, function (m, k) { return map[k] != null ? map[k] : m; }); }
  var clip = U.clip;
  function byId(s, id) { return s.messages.filter(function (m) { return m.id === id; })[0] || null; }
  function lastId(s) { return s.messages.length ? s.messages[s.messages.length - 1].id : null; }
  function photoById(id) { return S.cameraRoll.filter(function (x) { return x.id === id; })[0] || null; }
  function isStaff(m) { return m.author === 'cc' || m.author === 'md'; }
  /* Carol's newest typed message. June card chips are left out: June answers those. */
  function lastPatientText(s, withPhoto) {
    for (var i = s.messages.length - 1; i >= 0; i--) {
      var m = s.messages[i];
      if (m.author === 'patient' && m.kind === 'text' && m.audience === 'all' && !(m.meta && m.meta.chip != null) &&
        (!withPhoto || (m.meta && m.meta.photo))) return m;
    }
    return null;
  }
  function repliedAfter(s, msg, who) {
    var idx = -1;
    s.messages.forEach(function (m, i) { if (m.id === msg.id) idx = i; });
    return s.messages.slice(idx + 1).some(function (m) { return m.audience === 'all' && (who ? m.author === who : isStaff(m)); });
  }
  function openTaskFor(s, role) {
    return s.tasks.filter(function (t) { return t.patientId === 'carol' && t.assignee === role && t.status === 'open'; }).pop() || null;
  }
  function record(s, key) {
    return s.messages.filter(function (m) { return m.author === 'system' && m.meta && (m.meta.type === key || m.meta.record === key); })[0] || null;
  }
  function questionOf(s) { var i = s.intake; return (i && i.messageId && byId(s, i.messageId)) || lastPatientText(s); }
  function nameOf(key) { return key === 'team' ? S.care.sheet.teamName : S.cast[key].name; }

  /* June's intake card: what Carol asked, what June answered, her 2 taps, and the promise. */
  function intakeRows(s) {
    var i = s.intake, c = S.care.intake;
    if (!i || !i.messageId) return [];
    var q = byId(s, i.messageId), photo = i.photo ? photoById(i.photo) : null;
    var map = {
      questions: q && q.body === S.carolQuestion ? c.scriptedQuestions : fill(c.quoted, { text: clip(q ? q.body : '', 80) }),
      attached: photo ? fill(c.photo, { label: photo.label }) : c.none,
      answered: (i.topics || []).indexOf('appointments') >= 0 ? c.answeredVisit : c.notYet,
      feel: c.feel[i.feel] || c.notYet,
      started: c.started[i.started] || c.notYet,
      flags: i.feel === 'very' ? c.flagsVery : i.flag ? c.flagsRed : c.flagsNone,
      by: T.formatReplyBy(T.replyBy(i.at), i.at)
    };
    var rows = c.rows.map(function (r) { return [r[0], fill(r[1], map)]; });
    return i.stage === 'done' ? rows : rows.slice(0, 3).concat([c.pending]);
  }

  /* Inbox tags for Carol's row: urgent / screened / needs provider or can wait / photo. */
  function carolTags(s) {
    var i = s.intake || {}, tags = [], lp = lastPatientText(s);
    if (i.flag) tags.push('urgent');
    if (i.messageId) tags.push('june');
    if (!i.flag && lp) {
      if (openTaskFor(s, 'md')) tags.push('needs-provider');
      else if (!repliedAfter(s, lp)) {
        var topics = T.classifyTopics(lp.body);
        tags.push(topics.some(function (t) { return CLINICAL.indexOf(t) >= 0; }) ? 'needs-provider' : 'can-wait');
      }
    }
    if (s.messages.some(function (m) { return m.author === 'patient' && m.meta && m.meta.photo; })) tags.push('photo');
    return tags;
  }

  /* The provider recap, built from what happened (records, June's intake, replies, tasks, documents). */
  function buildSummary(s) {
    var sm = S.care.summary, f = sm.facts, lines = [], needs = [], i = s.intake || {};
    var visit = s.messages.some(function (m) { return m.kind === 'visit'; });
    var opened = record(s, 'opened'), cls = record(s, 'class'), q = questionOf(s);
    if (opened) lines.push(fill(s.checklist.plan ? f.opened : f.openedMessage, { day: U.fmtStamp(opened.at).split(' ')[0], time: U.fmtTime(opened.at) }));
    else if (visit) lines.push(f.notOpened);
    if (cls) lines.push(f.classStarted);
    if (q && q.body === S.carolQuestion) {
      lines.push(repliedAfter(s, q, 'cc') ? f.rxConfirmed : f.rxAsked);
      lines.push(f.skipAsked);
    } else if (q) lines.push(fill(f.asked, { text: clip(q.body, 90) }));
    if (sm.feel[i.feel] && sm.started[i.started]) lines.push(fill(f.intake, { feel: sm.feel[i.feel], started: sm.started[i.started] }));
    var task = openTaskFor(s, 'md'), doc = s.documents.consent;
    if (task) needs.push(fill(sm.needs.answer, { title: task.title }));
    if (!doc || doc.status !== 'signed') needs.push(sm.needs.consent);
    return { title: sm.title, lines: lines, needsTitle: sm.needsTitle, needs: needs.length ? needs : [sm.nothingNeeded],
      footer: sm.footer, upTo: lastId(s), at: s.now };
  }
  function summaryIsStale(s) { return !s.summary || s.summary.upTo !== lastId(s); }

  function dueFor(key, msg, now) {
    if (key === 'today') return T.at(now.getFullYear(), now.getMonth(), now.getDate(), 17, 0);
    if (key === 'visit') return S.care.sheet.visitDue;
    return T.replyBy(msg.at);
  }
  /* The sentence under the task sheet: what Carol will see once the task exists. */
  function taskPreview(v, msg, now) {
    var sh = S.care.sheet;
    if (!v.tell) return sh.previewSilent;
    var f = sh.follow.filter(function (x) { return x.key === v.follow; })[0] || sh.follow[0];
    var who = v.assign === 'team' ? sh.teamSentenceName : S.cast[v.assign].name;
    return fill(sh.preview, { sentence: fill(f.carol, { name: who, due: T.formatReplyBy(dueFor(v.due, msg, now), now) }) });
  }
  function fillTemplate(id, s) {
    var tpl = S.templates[id];
    if (!tpl) return '';
    var task = openTaskFor(s, 'md'), due = task ? task.due : T.replyBy(s.now);
    return fill(tpl.body, { due: T.formatReplyBy(due, s.now), first: S.cast.patient.first, nextVisit: S.carePlan.nextVisit.when });
  }

  var model = { fill: fill, clip: clip, lastPatientText: lastPatientText, openTaskFor: openTaskFor, record: record,
    intakeRows: intakeRows, carolTags: carolTags, buildSummary: buildSummary, summaryIsStale: summaryIsStale,
    dueFor: dueFor, taskPreview: taskPreview, fillTemplate: fillTemplate };

  /* ── Phone ─────────────────────────────────────────────────────────── */
  function mount(el, api) {
    if (el._twcUnmount) el._twcUnmount();
    var store = api.store, act = api.act, sched = api.sched;
    var listeners = [], offs = [];
    function listen(type, fn) { el.addEventListener(type, fn); listeners.push([type, fn]); }
    var local = { appKey: '', overlayKey: '', statusHtml: '', logHtml: '', bodyHtml: '', tabsHtml: '', promptHtml: null, composerKey: null,
      seen: {}, toastTimer: null, clientN: 0, sheetValues: null, summarizing: false, search: '', prompt: false };

    el.innerHTML = '<div class="screen__status"></div><div class="screen__app"></div><div class="screen__overlay"></div><div class="screen__toast"></div>';
    var $status = el.querySelector('.screen__status'), $app = el.querySelector('.screen__app'),
      $overlay = el.querySelector('.screen__overlay'), $toast = el.querySelector('.screen__toast');

    function st() { return store.getState(); }
    function K() { return st().care; }
    function role() { return K().role; }
    function setK(patch) { store.set({ care: Object.assign({}, K(), patch) }); }
    function composer() { return K().composer || { text: '', attachment: null }; }
    function setComposer(patch) { setK({ composer: Object.assign({}, composer(), patch) }); }

    function resolveMsg(ref) {
      if (ref === 'latest-patient') return lastPatientText(st());
      if (ref === 'latest-patient-photo') return lastPatientText(st(), true);
      return byId(st(), ref);
    }
    function resolveTask(ref) {
      var ts = st().tasks, hit = ts.filter(function (t) { return t.id === ref; })[0];
      if (hit) return hit;
      var mine = ts.filter(function (t) { return t.patientId === ref; });
      return mine.filter(function (t) { return t.status === 'open'; }).pop() || mine.pop() || null;
    }
    function unreadForCare(s) {
      var r = s.readUpTo.care, idx = -1;
      if (r) s.messages.forEach(function (m, i) { if (m.id === r.upTo) idx = i; });
      for (var j = idx + 1; j < s.messages.length; j++) if (s.messages[j].author === 'patient' && s.messages[j].audience === 'all') return true;
      return false;
    }
    function whenLabel(d, now) { return d.toDateString() === now.toDateString() ? U.fmtTime(d) : U.fmtStamp(d).split(' ')[0]; }

    /* ── Inbox ─────────────────────────────────────────────────────────── */
    function carolRow(s) {
      var visible = s.messages.filter(function (m) { return m.audience === 'all' && m.author !== 'system'; });
      if (!visible.length) return null;
      var last = visible[visible.length - 1], a = last.author;
      var who = a === 'patient' ? S.cast.patient.first : a === 'june' ? S.cast.june.name : a === role() ? S.care.you : S.cast[a].name;
      var text = last.body || (last.meta && last.meta.photo ? S.care.photoPreview : '');
      var unread = unreadForCare(s);
      return { id: 'carol', name: S.cast.patient.name, initials: S.cast.patient.initials, program: S.cast.patient.program + ' · ' + S.cast.patient.visit,
        preview: who + ': ' + clip(text, 90), time: whenLabel(last.at, s.now), tags: carolTags(s), unread: unread, fresh: unread };
    }
    function inboxHtml(s) {
      var cr = carolRow(s), f = K().filter, q = local.search.trim().toLowerCase();
      var rows = (cr ? [cr] : []).concat(s.inbox.map(function (r) { return Object.assign({}, r, { time: whenLabel(r.at, s.now) }); }));
      var unreadN = rows.filter(function (r) { return r.unread; }).length;
      var shown = rows.filter(function (r) {
        if (q && r.name.toLowerCase().indexOf(q) < 0) return false;
        if (f === 'unread') return r.unread;
        if (f === 'provider') return r.tags.indexOf('needs-provider') >= 0 || r.tags.indexOf('urgent') >= 0;
        if (f === 'mine') return r.id === 'carol';
        return true;
      });
      return '<div class="care-scroll">' +
        C.SearchField({ placeholder: S.care.search, value: local.search }) +
        C.FilterPills({ filters: S.care.filters.map(function (x) { return { key: x.key, label: x.label, count: x.key === 'unread' ? unreadN : 0 }; }), active: f }) +
        (!T.isOpen(s.now) && role() === 'cc' ? C.OffHoursBanner({ text: S.care.offHours, sub: S.care.offHoursSub }) : '') +
        (shown.length ? '<ul class="inbox">' + shown.map(function (r) { return '<li>' + C.InboxRow({ row: r }) + '</li>'; }).join('') + '</ul>'
          : C.EmptyState({ text: S.care.noResults })) + '</div>';
    }

    /* ── Thread ────────────────────────────────────────────────────────── */
    function careLabel(m) {
      var t = U.fmtTime(m.at), a = m.author;
      if (a === 'patient') return C.MessageLabel({ sender: 'patient', name: S.cast.patient.name, initials: S.cast.patient.initials, time: t });
      if (a === 'june') return C.MessageLabel({ sender: 'june', name: S.cast.june.name, role: S.care.juneTo, time: t, align: 'right' });
      var who = S.cast[a];
      return C.MessageLabel({ sender: a, name: a === role() ? S.care.you : who.name, role: who.careRole, image: who.photo, time: t, align: 'right' });
    }
    function docCardHtml(s, id) {
      var d = s.documents[id] || {};
      return C.DocumentCard({ doc: S.consentDoc, status: d.status === 'signed' ? 'signed' : 'needs', side: 'care',
        signedText: d.signedAt ? fill(S.sign.signedCard, { when: U.fmtDay(d.signedAt) + ' at ' + U.fmtTime(d.signedAt) }) : '' });
    }
    function intakeCardHtml(s) {
      return C.InternalCard({ type: 'intake', careOnlyText: S.care.careOnly, lead: C.JuneOrb({ size: 24 }),
        title: fill(S.care.intake.title, { when: U.fmtStamp(s.intake.at) }), rows: intakeRows(s) });
    }
    function wrap(m, side, inner, att) {
      return '<div class="msg msg--' + side + (local.seen[m.id] ? '' : ' is-new') + '" data-mid="' + m.id + '">' + inner +
        (att ? '<div class="msg__attachments">' + att + '</div>' : '') + '</div>';
    }
    function careMsgHtml(m, s, lastPid) {
      if (m.author === 'system') return C.SystemEvent({ type: (m.meta && m.meta.type) || 'record', text: m.body, careOnly: m.audience === 'care' });
      if (m.author === 'patient') {
        var photo = m.meta && m.meta.photo ? photoById(m.meta.photo) : null;
        var html = wrap(m, 'left', careLabel(m) + C.ChatBubble({ sender: 'patient', side: 'left', content: m.kind === 'choice' ? 'choice' : (photo ? 'photo' : 'text'),
          photo: photo, html: m.body ? esc(m.body).replace(/\n/g, '<br>') : '', id: m.id, more: m.kind === 'text', moreHint: m.id === lastPid ? 'care.msg.more' : '' }));
        if (s.intake && s.intake.messageId === m.id && s.intake.at) html += '<div class="msg msg--left">' + intakeCardHtml(s) + '</div>';
        return html;
      }
      if (m.author === 'june') {
        var body = esc(m.body), att = '';
        if (m.kind === 'routing') att = C.RoutingCard({ rows: (m.meta.rows || S.routing).map(function (r) { return { q: r.q, label: S.routeLabels[r.who], image: S.cast[r.who].photo }; }),
          footHtml: U.weekends(fill(S.june.routeFooter, { by: T.formatReplyBy(new Date(m.meta.by), m.at) })), note: m.meta.hours });
        if (m.kind === 'resources') att = '<p class="type-caption-1 muted">' + esc(S.care.juneSuggested) + '</p>';
        return wrap(m, 'right', careLabel(m) + C.ChatBubble({ sender: 'june', side: 'right', html: body }), att);
      }
      var att2 = '';
      if (m.kind === 'visit' || (m.meta && m.meta.carePlan)) att2 = C.CarePlanCard({ plan: S.carePlan });
      if (m.meta && m.meta.doc) att2 += docCardHtml(s, m.meta.doc);
      return wrap(m, 'right', careLabel(m) + C.ChatBubble({ sender: 'staff', side: 'right', me: m.author === role(),
        html: m.body ? esc(m.body).replace(/\n/g, '<br>') : '' }), att2);
    }
    function careLogHtml(s) {
      var out = '', lastDay = '', lp = lastPatientText(s), lastPid = lp ? lp.id : null;
      s.messages.forEach(function (m) {
        var day = U.fmtDay(m.at);
        if (day !== lastDay) { out += C.SystemEvent({ type: 'date', text: day }); lastDay = day; }
        out += careMsgHtml(m, s, lastPid);
      });
      if (s.typing.june) out += '<div class="msg msg--right">' + C.TypingIndicator({ sender: 'june', name: S.cast.june.name, side: 'right' }) + '</div>';
      return out || C.SystemEvent({ type: 'date', text: U.fmtDay(s.now) });
    }
    function threadShellHtml() {
      return '<div class="chat chat--care">' +
        C.ChatHeader({ side: 'care', back: 'thread:back', title: S.cast.patient.name, sub: S.cast.patient.program + ' · ' + S.cast.patient.visit,
          lead: C.Avatar({ initials: S.cast.patient.initials, size: 40 }),
          actions: '<button type="button" class="icon-btn icon-btn--round" data-action="summarize" aria-label="' + esc(S.care.summarize) + '">' + U.ph('ph-sparkle') + '</button>' }) +
        C.ContextBar({ text: S.care.contextBar }) +
        '<div class="chat-log" role="log" aria-live="polite" aria-label="Messages with Carol"></div>' +
        '<div class="prompt-slot"></div><div class="composer-slot"></div></div>';
    }
    function careComposerHtml(text) {
      var c = composer(), who = S.cast[role()];
      return C.Composer({ side: 'care', id: 'care-composer', placeholder: S.care.composerPlaceholder,
        seesAs: fill(S.care.seesAs, { name: who.name + ' · ' + who.role }), text: text,
        doc: c.attachment === 'consent' ? S.consentDoc.title : null, plan: c.attachment === 'careplan' ? S.care.planChip : null,
        canSend: !!((text || '').trim() || c.attachment), templates: S.care.templatesLabel, templatesHint: 'care.templates',
        attachHint: 'care.attach', sendHint: 'care.send' });
    }
    function promptHtml(s) {
      var task = openTaskFor(s, role());
      return local.prompt && task ? C.TaskPrompt({ text: S.care.markDonePrompt, label: S.care.markDone, action: 'task:done:' + task.id, hint: 'care.task.done' }) : '';
    }
    function updateThread(s, body) {
      var log = body.querySelector('.chat-log'), html = careLogHtml(s);
      if (log && html !== local.logHtml) {
        log.innerHTML = html; local.logHtml = html;
        s.messages.forEach(function (m) { local.seen[m.id] = true; });
        U.stickToBottom(log);
      }
      var p = promptHtml(s), ps = body.querySelector('.prompt-slot');
      if (ps && p !== local.promptHtml) { ps.innerHTML = p; local.promptHtml = p; }
      var ck = composer().attachment || '', cs = body.querySelector('.composer-slot');
      if (cs && ck !== local.composerKey) {
        var ta = el.querySelector('#care-composer');
        cs.innerHTML = careComposerHtml(ta ? ta.value : composer().text || '');
        var ta2 = el.querySelector('#care-composer'); if (ta2) autoGrow(ta2);
        local.composerKey = ck;
      }
      updateSend();
    }

    /* ── Tasks ─────────────────────────────────────────────────────────── */
    function tasksHtml(s) {
      var r = role(), mine = s.tasks.filter(function (t) { return t.assignee === r; });
      var open = mine.filter(function (t) { return t.status === 'open'; }).sort(function (a, b) { return a.due - b.due; });
      var done = mine.filter(function (t) { return t.status === 'done'; });
      function row(t) {
        var meta = t.status === 'done' ? fill(S.care.taskDoneMeta, { time: U.fmtStamp(t.doneAt) })
          : fill(S.care.taskMeta, { due: T.formatReplyBy(t.due, s.now), from: S.cast[t.createdBy].name });
        return '<li>' + C.TaskRow({ task: t, meta: meta, hint: t.patientId === 'carol' && t.status === 'open' ? 'care.task.carol' : '' }) + '</li>';
      }
      return '<div class="care-scroll">' + C.SectionLabel({ text: S.care.openLabel }) +
        (open.length ? '<ul class="task-list">' + open.map(row).join('') + '</ul>' : C.EmptyState({ text: S.care.noTasks })) +
        (done.length ? C.SectionLabel({ text: S.care.doneLabel }) + '<ul class="task-list">' + done.map(row).join('') + '</ul>' : '') + '</div>';
    }
    function summaryCardHtml(s) {
      if (local.summarizing) return C.SummaryCard({ state: 'loading' });
      return s.summary ? C.SummaryCard({ state: 'ready', summary: s.summary, careOnlyText: S.care.careOnly,
        actions: C.Button({ variant: 'secondary', size: 'small', label: S.care.copyToChart, action: 'copy-chart' }) }) : '';
    }
    function taskDetailHtml(s) {
      var t = s.tasks.filter(function (x) { return x.id === K().taskOpen; })[0];
      if (!t) return tasksHtml(s);
      var src = byId(s, t.sourceMessageId), follow = S.care.sheet.follow.filter(function (f) { return f.key === t.followUp; })[0] || S.care.sheet.follow[0];
      var tags = C.Tag({ color: 'purple100', label: follow.label }) + C.Tag({ color: 'grey', label: fill(S.care.taskMeta, { due: T.formatReplyBy(t.due, s.now), from: S.cast[t.createdBy].name }) }) +
        (t.status === 'done' ? C.Tag({ color: 'mint', label: S.care.doneLabel, icon: 'ph-check' }) : '');
      var cards = (t.summaryLines ? C.InternalCard({ type: 'summary', careOnlyText: S.care.careOnly,
        title: fill(S.care.summaryForProvider.title, { to: nameOf(t.assignee), by: S.cast[t.createdBy].name }), lines: t.summaryLines }) : '') + summaryCardHtml(s);
      var actions = (!local.summarizing && summaryIsStale(s) ? C.Button({ variant: 'secondary', full: true, icon: 'ph-sparkle', label: S.care.summarize, action: 'summarize', hint: 'care.summarize' }) : '') +
        C.Button({ variant: 'primary', full: true, label: t.status === 'open' ? S.care.replyToCarol : S.care.openChat, action: 'reply', hint: t.status === 'open' ? 'care.reply' : '' }) +
        (t.status === 'open' ? C.Button({ variant: 'text', full: true, label: S.care.markDone, action: 'task:done:' + t.id }) : '');
      return '<div class="chat chat--care">' + C.ChatHeader({ side: 'care', back: 'task:back', title: S.care.taskTitle, sub: t.patient }) +
        '<div class="care-scroll">' + C.TaskDetail({ tags: tags, title: t.title, quoteMeta: src ? fill(S.care.wrote, { when: U.fmtStamp(src.at) }) : '',
          quote: src ? src.body : '', cards: cards, actions: actions }) + '</div></div>';
    }

    /* ── App frame ─────────────────────────────────────────────────────── */
    function appKey(s) { var k = s.care; return [k.role, k.view, k.taskOpen || ''].join('|'); }
    function headerHtml() {
      var v = K().view, who = S.cast[role()];
      return C.CareHeader({ title: v === 'tasks' ? S.care.titleTasks : S.care.titleMessages, name: who.name, role: who.careRole, image: who.photo });
    }
    function tabsHtml(s) {
      var v = K().view, r = role(), cr = carolRow(s);
      var openN = s.tasks.filter(function (t) { return t.assignee === r && t.status === 'open'; }).length;
      return C.TabBar({ label: 'Care team', tabs: S.care.tabs, active: v === 'tasks' || v === 'task' ? 'tasks' : 'inbox',
        badges: { inbox: cr && cr.unread ? 1 : 0, tasks: openN }, hintPrefix: 'care.tab', actionPrefix: 'care-tab' });
    }
    function renderApp(s) {
      var v = K().view, withHeader = v === 'inbox' || v === 'tasks';
      local.logHtml = ''; local.bodyHtml = ''; local.tabsHtml = ''; local.promptHtml = null; local.composerKey = null;
      $app.innerHTML = '<div class="care-app care-app--' + v + '">' + (withHeader ? '<div class="chrome-top">' + headerHtml() + '</div>' : '') +
        '<div class="care-body">' + (v === 'thread' ? threadShellHtml() : '') + '</div><div class="chrome-bottom"></div></div>';
      updateApp(s);
    }
    function updateApp(s) {
      var v = K().view, body = $app.querySelector('.care-body');
      if (!body) return;
      if (v === 'thread') updateThread(s, body);
      else {
        var html = v === 'tasks' ? tasksHtml(s) : v === 'task' ? taskDetailHtml(s) : inboxHtml(s);
        if (html !== local.bodyHtml) {
          var sc = body.querySelector('.care-scroll'), y = sc ? sc.scrollTop : 0;
          var searching = document.activeElement && document.activeElement.classList.contains('search-field__input') && el.contains(document.activeElement);
          body.innerHTML = html; local.bodyHtml = html;
          var sc2 = body.querySelector('.care-scroll'); if (sc2) sc2.scrollTop = y;
          if (searching) { var inp = body.querySelector('.search-field__input'); if (inp) { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); } }
        }
      }
      var tb = tabsHtml(s), bottom = $app.querySelector('.chrome-bottom');
      if (bottom && tb !== local.tabsHtml) { bottom.innerHTML = tb; local.tabsHtml = tb; }
    }

    /* ── Overlays ──────────────────────────────────────────────────────── */
    function sheetCopy() {
      var sh = S.care.sheet, r = role();
      return Object.assign({}, sh, { assign: sh.assign.map(function (o) { return { key: o.key, label: o.label + (o.key === r ? sh.me : '') }; }) });
    }
    function overlayHtml(s) {
      var sh = K().sheet;
      if (!sh) return '';
      switch (sh.name) {
        case 'actions':
          return C.SheetBottom({ kind: 'sheet:actions', title: S.care.actions.title, body: C.ActionList({ actions: [
            { icon: 'ph-check-square-offset', label: S.care.actions.task, action: 'action:task:' + sh.props.msgId, hint: 'care.action.task' },
            { icon: 'ph-copy', label: S.care.actions.copy, action: 'action:copy' },
            { icon: 'ph-envelope-simple', label: S.care.actions.unread, action: 'action:unread' }] }) });
        case 'task':
          var msg = resolveMsg(sh.props.msgId), v = local.sheetValues;
          if (!msg || !v) return '';
          return C.SheetBottom({ kind: 'sheet:task', title: S.care.sheet.title, tall: true,
            body: C.TaskSheetBody({ copy: sheetCopy(), values: v, promiseLabel: T.formatReplyBy(T.replyBy(msg.at), s.now), quote: msg.body, preview: taskPreview(v, msg, s.now) }),
            foot: C.Button({ variant: 'primary', full: true, label: S.care.sheet.create, action: 'task:create', hint: 'care.task.create' }) });
        case 'templates':
          return C.SheetBottom({ kind: 'sheet:templates', title: S.care.templatesLabel, body: C.TemplatePicker({ templates: Object.keys(S.templates).map(function (id) {
            return { id: id, name: S.templates[id].name, preview: fillTemplate(id, s) }; }) }) });
        case 'attach':
          return C.SheetBottom({ kind: 'sheet:attach', title: S.care.attachTitle, body: C.ActionList({ actions: [
            { icon: 'ph-file-text', label: S.care.attachDoc + ' · ' + S.consentDoc.title, action: 'attach:doc', hint: 'care.attach.doc' },
            { icon: 'ph-list-checks', label: S.care.attachPlan, action: 'attach:plan' },
            { icon: 'ph-image', label: S.care.attachPhoto, action: 'attach:photo' }] }) });
        case 'account':
          return C.SheetBottom({ kind: 'sheet:account', title: S.care.accountTitle, body: C.AccountSwitch({ accounts: ['cc', 'md'].map(function (r) {
            var who = S.cast[r]; return { key: r, name: who.full, role: who.careRole, image: who.photo, active: role() === r }; }) }) });
        case 'summary':
          return C.SheetBottom({ kind: 'sheet:summary', title: S.care.summaryLabel, tall: true, body: summaryCardHtml(s) });
        case 'photo':
          var ph = photoById(sh.props.id);
          if (!ph) return '';
          return C.ModalFullScreen({ kind: 'modal:photo', title: S.care.photoTitle, body: '<div class="photo-view"><img src="' + ph.src + '" alt="' + esc(ph.alt) + '"></div>',
            foot: C.Button({ variant: 'primary', full: true, label: S.care.photoSave, action: 'photo-save:' + ph.id }) });
      }
      return '';
    }
    function overlayKey(s) {
      var sh = K().sheet;
      return JSON.stringify([sh, local.sheetValues, sh && sh.name === 'summary' ? [local.summarizing, s.summary && s.summary.upTo] : 0, role()]);
    }
    function renderOverlay(s) {
      var key = overlayKey(s);
      if (key === local.overlayKey) return;
      local.overlayKey = key;
      var prevKinds = Array.prototype.map.call($overlay.querySelectorAll('.layer'), function (l) { return l.getAttribute('data-kind'); });
      $overlay.innerHTML = overlayHtml(s);
      Array.prototype.forEach.call($overlay.querySelectorAll('.layer'), function (l) { if (prevKinds.indexOf(l.getAttribute('data-kind')) >= 0) l.classList.add('is-static'); });
    }
    function showToast(text) {
      $toast.innerHTML = C.Toast({ text: text });
      clearTimeout(local.toastTimer);
      local.toastTimer = setTimeout(function () { $toast.innerHTML = ''; }, 2400);
    }
    function refresh() { local.bodyHtml = ''; local.overlayKey = ''; render(); }

    /* ── Composer helpers ──────────────────────────────────────────────── */
    function autoGrow(ta) { ta.style.height = 'auto'; ta.style.height = Math.min(96, Math.max(44, ta.scrollHeight)) + 'px'; }
    function updateSend() {
      var ta = el.querySelector('#care-composer'), btn = el.querySelector('.composer--care .round-btn--send');
      if (!ta || !btn) return;
      var hasText = !!ta.value.trim(), ok = hasText || !!composer().attachment;
      btn.disabled = !ok || !!local.scripting; // no sending half a scripted reply
      btn.setAttribute('aria-label', ok ? 'Send message' : 'Send, type something first');
      var r = role();
      if (!!st().typing[r] !== hasText) act.setTyping(r, hasText);
    }
    function saveDraft() { var ta = el.querySelector('#care-composer'); if (ta && ta.value !== composer().text) setComposer({ text: ta.value }); }
    function typeInto(text, done) {
      var ta = el.querySelector('#care-composer');
      if (!ta || sched.instant) {
        setComposer({ text: text });
        var t0 = el.querySelector('#care-composer'); if (t0) { t0.value = text; autoGrow(t0); }
        updateSend(); done(); return;
      }
      var i = 0, per = Math.max(1, Math.ceil(text.length / 45));
      local.scripting = true;
      (function tick() {
        i = Math.min(text.length, i + per);
        var t = el.querySelector('#care-composer');
        if (t) { t.value = text.slice(0, i); autoGrow(t); updateSend(); }
        if (i < text.length) sched.later(26, tick); else { local.scripting = false; setComposer({ text: text }); updateSend(); done(); }
      })();
    }

    /* ── Intents ───────────────────────────────────────────────────────── */
    function leaveThread() {
      var r = role();
      if (K().view === 'thread') saveDraft();
      if (st().presence[r]) act.setPresence(r, null);
      if (st().typing[r]) act.setTyping(r, false);
    }
    function openInbox() { leaveThread(); setK({ view: 'inbox', sheet: null, taskOpen: null }); }
    function openTasks() { leaveThread(); setK({ view: 'tasks', sheet: null, taskOpen: null }); store.emit('care:tasks-opened', {}); }
    function openThread(id) {
      if (id && id !== 'carol') { showToast(S.misc.onlyCarol); return; }
      if (K().view !== 'thread' || K().sheet) setK({ view: 'thread', thread: 'carol', sheet: null });
      var r = role();
      if (st().presence[r] !== 'reading') act.setPresence(r, 'reading');
      if (unreadForCare(st()) || !st().readUpTo.care) act.markRead('care');
      store.emit('care:thread-opened', { id: 'carol' });
    }
    function sendVisitMessage() {
      if (st().messages.some(function (m) { return m.kind === 'visit'; })) { store.emit('visit:sent', {}); return; }
      if (role() !== 'md') act.setRole('md');
      openThread('carol');
      setComposer({ text: S.visitMessage, attachment: 'careplan' });
      var ta = el.querySelector('#care-composer'); if (ta) ta.value = S.visitMessage;
      send();
    }
    function send() {
      if (local.scripting) return;
      var ta = el.querySelector('#care-composer'), c = composer();
      var text = ((ta ? ta.value : c.text) || '').trim(), att = c.attachment || null;
      if (!text && !att) return;
      var r = role(), isVisit = att === 'careplan' && !st().messages.some(function (m) { return m.kind === 'visit'; });
      if (ta) { ta.value = ''; autoGrow(ta); }
      setComposer({ text: '', attachment: null });
      if (st().typing[r]) act.setTyping(r, false);
      if (att === 'consent') act.sendDocument('consent');
      var m = act.sendMessage({ author: r, kind: isVisit ? 'visit' : 'text', body: text,
        meta: att === 'consent' ? { doc: 'consent' } : att === 'careplan' ? { carePlan: true } : {},
        clientId: 'k' + (++local.clientN) + '-' + st().messages.length });
      if (!m) return;
      if (isVisit) { act.sendMessage({ author: 'system', kind: 'event', audience: 'care', at: m.at, meta: { type: 'record' }, body: S.care.records.notified }); return; }
      var e = st().expectation;
      if (e && e.owner === r) act.setExpectation({ owner: null, by: null });
      if (openTaskFor(st(), r)) local.prompt = true;
      showToast(S.care.syncedToast);
      refresh();
    }
    function openTaskSheet(ref, preset) {
      var msg = resolveMsg(ref);
      if (!msg) return;
      if (K().view !== 'thread') openThread('carol');
      var d = S.care.sheet.defaults, r = role();
      local.sheetValues = Object.assign({}, d, { assign: r === 'cc' ? 'md' : 'cc', title: r === 'cc' ? d.title : '', summary: r === 'cc' }, preset || {});
      act.openSheet('care', 'task', { msgId: msg.id });
      store.emit('task:sheet-opened', { msgId: msg.id });
    }
    function startTaskFromMessage(ref) {
      var msg = resolveMsg(ref);
      if (!msg) return;
      var sh = K().sheet;
      if (sh && sh.name === 'task' && sh.props.msgId === msg.id) { store.emit('task:sheet-opened', { msgId: msg.id }); return; }
      if (K().view !== 'thread') openThread('carol');
      act.openSheet('care', 'actions', { msgId: msg.id });
      sched.later(500, function () { openTaskSheet(msg.id); });
    }
    function readSheetForm() {
      var v = Object.assign({}, local.sheetValues), form = $overlay.querySelector('.task-sheet');
      if (!form) return v;
      var title = form.querySelector('input[name="title"]'); if (title) v.title = title.value.trim();
      ['assign', 'due', 'follow'].forEach(function (n) { var r = form.querySelector('input[name="' + n + '"]:checked'); if (r) v[n] = r.value; });
      ['previsit', 'summary', 'tell'].forEach(function (n) { var c = form.querySelector('input[name="' + n + '"]'); if (c) v[n] = c.checked; });
      return v;
    }
    function createTask(overrides) {
      var sh = K().sheet;
      if (!sh || sh.name !== 'task') {
        var lp = lastPatientText(st());
        var dup = lp && st().tasks.filter(function (t) { return t.sourceMessageId === lp.id; }).pop();
        if (dup) { store.emit('task:created', dup); return dup; }
        openTaskSheet('latest-patient');
        sh = K().sheet;
        if (!sh || sh.name !== 'task') return null;
      }
      var msg = resolveMsg(sh.props.msgId);
      if (!msg) return null;
      var v = Object.assign(readSheetForm(), overrides || {}), s = st(), r = role();
      var due = v.dueDate || dueFor(v.due, msg, s.now), assignee = v.assign === 'team' ? 'cc' : v.assign;
      var fp = S.care.summaryForProvider;
      var lines = v.summary ? (msg.body === S.carolQuestion ? fp.scripted.slice() : [fill(fp.asked, { text: clip(msg.body, 90) })])
        .concat([fill(fp.promise, { due: T.formatReplyBy(due, msg.at) })]) : null;
      local.sheetValues = null;
      act.closeSheet('care');
      var task = act.createTask({ patientId: 'carol', patient: S.cast.patient.name, title: v.title || S.care.sheet.titleFallback, details: msg.body,
        sourceMessageId: msg.id, assignee: assignee, due: due, followUp: v.follow, previsit: !!v.previsit, summaryLines: lines, createdBy: r });
      var at = task.createdAt;
      act.sendMessage({ author: 'system', kind: 'event', audience: 'care', at: at, meta: { type: 'task' },
        body: fill(S.care.taskEvent, { to: nameOf(v.assign), due: T.formatReplyBy(due, at), by: S.cast[r].name }) });
      if (v.tell) {
        if (assignee === 'md' && r === 'cc') act.sendMessage({ author: 'system', kind: 'event', audience: 'all', at: at, meta: { type: 'handoff' }, body: fill(S.care.handoff, { time: U.fmtStamp(at) }) });
        act.setExpectation({ owner: assignee, by: due, since: msg.at });
      }
      return task;
    }
    function createTaskFromMessage(ref, preset) {
      var p = preset || {};
      openTaskSheet(ref, { title: p.title || '', assign: p.assignee || (role() === 'cc' ? 'md' : 'cc'), follow: p.followUp || 'chat', summary: false, tell: false });
      sched.later(700, function () { createTask(p.due ? { dueDate: p.due } : null); });
    }
    function applyTemplate(id) {
      var text = fillTemplate(id, st());
      if (!text) return;
      act.closeSheet('care');
      setComposer({ text: text });
      var ta = el.querySelector('#care-composer'); if (ta) { ta.value = text; autoGrow(ta); }
      updateSend();
      store.emit('template:used', { id: id });
    }
    function useTemplate(id) {
      if (!S.templates[id]) return;
      if (K().view !== 'thread') openThread('carol');
      var ta = el.querySelector('#care-composer');
      if (ta && ta.value === fillTemplate(id, st())) { store.emit('template:used', { id: id }); return; }
      act.openSheet('care', 'templates');
      sched.later(600, function () { applyTemplate(id); });
    }
    function openTask(ref) {
      var t = resolveTask(ref);
      if (!t) return;
      if (t.patientId !== 'carol') { showToast(S.misc.onlyCarol); return; }
      leaveThread();
      setK({ view: 'task', taskOpen: t.id, sheet: null });
      store.emit('task:opened', { id: t.id });
    }
    function summarize() {
      var s = st();
      if (K().view !== 'task' && (!K().sheet || K().sheet.name !== 'summary')) act.openSheet('care', 'summary');
      if (!summaryIsStale(s)) { store.emit('summary:ready', s.summary); return; }
      if (local.summarizing) return;
      local.summarizing = true; refresh();
      revealSummary();
      sched.later(900, function () { local.summarizing = false; act.setSummary(buildSummary(st())); refresh(); revealSummary(); });
    }
    function revealSummary() {
      var card = el.querySelector('.summary-card');
      if (card) U.reveal(card.closest('.care-scroll, .sheet__body'), card, !sched.instant);
    }
    function composeReply(text) {
      local.prompt = false;
      openThread('carol');
      var ta = el.querySelector('#care-composer');
      if (ta && ta.value === text) { store.emit('composer:filled', { text: text }); return; }
      typeInto(text, function () { store.emit('composer:filled', { text: text }); });
    }
    function attach(id) {
      saveDraft();
      act.closeSheet('care');
      setComposer({ attachment: id });
      if (id === 'consent') store.emit('doc:attached', { id: id });
    }
    function attachDocument(id) {
      if (K().view !== 'thread') openThread('carol');
      if (composer().attachment === id) { store.emit('doc:attached', { id: id }); return; }
      act.openSheet('care', 'attach');
      sched.later(600, function () { attach(id); });
    }
    function completeTask(ref) {
      var t = resolveTask(ref);
      if (!t) return;
      local.prompt = false;
      if (t.status === 'done') { store.emit('task:done', { id: t.id }); return; }
      act.completeTask(t.id);
      showToast(S.misc.taskDone);
      refresh();
    }
    function switchAccount(r) { act.closeSheet('care'); if (role() !== r) { leaveThread(); act.setRole(r); } }
    function savePhoto(id) {
      act.closeSheet('care');
      if (!st().messages.some(function (m) { return m.meta && m.meta.type === 'synced' && m.meta.photo === id; })) {
        act.sendMessage({ author: 'system', kind: 'event', audience: 'care', meta: { type: 'synced', photo: id }, body: S.care.photoSaved });
      }
      showToast(S.care.photoSaved);
      store.emit('photo:saved', { id: id });
    }

    /* ── Events (delegated) ────────────────────────────────────────────── */
    function onAction(a) {
      var parts = a.split(':'), head = parts[0];
      switch (head) {
        case 'care-tab': return parts[1] === 'tasks' ? openTasks() : openInbox();
        case 'thread': return parts[1] === 'back' ? (role() === 'md' ? openTasks() : openInbox()) : openThread(parts[1]);
        case 'filter': return setK({ filter: parts[1] });
        case 'msg-more': return act.openSheet('care', 'actions', { msgId: parts[1] });
        case 'action':
          if (parts[1] === 'task') return openTaskSheet(parts[2]);
          act.closeSheet('care');
          return showToast(parts[1] === 'copy' ? S.care.copied : S.misc.notInDemo);
        case 'task':
          if (parts[1] === 'create') return createTask();
          if (parts[1] === 'back') return openTasks();
          if (parts[1] === 'done') return completeTask(parts[2]);
          return openTask(parts[1]);
        case 'templates': return act.openSheet('care', 'templates');
        case 'template': return applyTemplate(parts[1]);
        case 'attach':
          if (!parts[1]) return act.openSheet('care', 'attach');
          if (parts[1] === 'doc') return attach('consent');
          if (parts[1] === 'plan') return attach('careplan');
          if (parts[1] === 'remove') return setComposer({ attachment: null });
          act.closeSheet('care');
          return showToast(S.misc.notInDemo);
        case 'summarize': return summarize();
        case 'reply': return openThread('carol');
        case 'copy-chart': return showToast(S.care.copiedToast);
        case 'account': return parts[1] === 'open' ? act.openSheet('care', 'account') : switchAccount(parts[1]);
        case 'sheet': case 'modal': local.sheetValues = null; return act.closeSheet('care');
        case 'photo-view': return act.openSheet('care', 'photo', { id: parts[1] });
        case 'photo-save': return savePhoto(parts[1]);
        case 'class': case 'careplan': return showToast(S.care.carolsButton);
        case 'doc': return showToast(S.care.signedInChart);
      }
    }
    function syncSheet() {
      if (!local.sheetValues) return;
      local.sheetValues = readSheetForm();
      var sh = K().sheet, msg = sh && resolveMsg(sh.props.msgId), pv = $overlay.querySelector('[data-task-preview]');
      if (pv && msg) pv.textContent = taskPreview(local.sheetValues, msg, st().now);
      local.overlayKey = overlayKey(st());
    }
    listen('click', function (e) {
      var t = e.target.closest('[data-action]');
      if (!t || !el.contains(t)) return;
      if (t.matches('input')) return;
      e.preventDefault();
      if (t.type === 'submit') return send();
      onAction(t.getAttribute('data-action'));
    });
    listen('change', function (e) { if (e.target.closest('.task-sheet')) syncSheet(); });
    listen('input', function (e) {
      var t = e.target;
      if (t.id === 'care-composer') { autoGrow(t); updateSend(); }
      if (t.classList.contains('search-field__input')) { local.search = t.value; updateApp(st()); }
      if (t.closest('.task-sheet')) syncSheet();
    });
    listen('submit', function (e) { e.preventDefault(); send(); });

    /* Care-only records of what Carol did: they show in the thread and feed the recap. */
    offs.push(store.on('patient:read', function () {
      var s = st();
      if (!s.messages.some(function (m) { return m.kind === 'visit'; }) || record(s, 'opened')) return;
      act.sendMessage({ author: 'system', kind: 'event', audience: 'care', meta: { type: 'opened' }, body: fill(S.care.records.opened, { time: U.fmtTime(s.now) }) });
    }));
    offs.push(store.on('class:started', function () {
      var s = st();
      if (record(s, 'class')) return;
      act.sendMessage({ author: 'system', kind: 'event', audience: 'care', meta: { type: 'record', record: 'class' }, body: fill(S.care.records.classStarted, { time: U.fmtTime(s.now) }) });
    }));
    offs.push(store.on('care:role-changed', function () {
      ['cc', 'md'].forEach(function (r) { if (st().typing[r]) act.setTyping(r, false); if (st().presence[r]) act.setPresence(r, null); });
      local.prompt = false; local.search = ''; local.summarizing = false;
    }));

    function render() {
      var s = st(), sb = C.StatusBar({ time: U.fmtClock(s.now), tone: 'default' });
      if (sb !== local.statusHtml) { $status.innerHTML = sb; local.statusHtml = sb; }
      var key = appKey(s);
      if (key !== local.appKey) { local.appKey = key; renderApp(s); } else updateApp(s);
      renderOverlay(s);
    }
    var unsubscribe = store.subscribe(render);
    el._twcUnmount = function () {
      listeners.forEach(function (l) { el.removeEventListener(l[0], l[1]); });
      offs.forEach(function (off) { off(); });
      unsubscribe(); clearTimeout(local.toastTimer); el._twcUnmount = null;
    };
    render();

    return {
      sendVisitMessage: sendVisitMessage, openInbox: openInbox, openThread: openThread, startTaskFromMessage: startTaskFromMessage,
      createTask: createTask, createTaskFromMessage: createTaskFromMessage, useTemplate: useTemplate, send: send, openTasks: openTasks,
      openTask: openTask, summarize: summarize, composeReply: composeReply, attachDocument: attachDocument, completeTask: completeTask,
      switchAccount: switchAccount
    };
  }

  root.TWCCare = { mount: mount, model: model };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.TWCCare;
})(typeof window !== 'undefined' ? window : globalThis);
