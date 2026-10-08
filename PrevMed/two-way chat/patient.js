/* Two-way care team chat — Carol's phone (Bold app).
   Screens are compositions of components.js only. Every tap calls a named intent; the story engine
   calls the same intents. Each intent is idempotent and always emits its event. */
(function (root) {
  'use strict';
  var T = root.TWC, S = root.TWC_STORY, C = root.C, U = C.util, esc = T.esc;
  var F = S.features || {}; // P1 turns off replies and June, and adds sign-in and the Care tab
  var WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six'];
  var LONG_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var LONG_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  /* The line under "Your care team" in the chat header: who is typing or reading, who replies by when,
     or, when nobody owes a reply, who is on the team. Pure; tested in verify-chat.mjs. */
  function headerStatus(s) {
    var e = s.expectation, copy = S.status;
    function name(k) { return S.cast[k].name; }
    if (s.typing.cc) return { state: 'typing', text: copy.typing.replace('{name}', name('cc')), who: 'cc' };
    if (s.typing.md) return { state: 'typing', text: copy.typing.replace('{name}', name('md')), who: 'md' };
    if (e && e.owner === 'cc' && s.presence.cc === 'reading') return { state: 'reading', text: copy.reading.replace('{name}', name('cc')), who: 'cc' };
    if (e && (e.owner === 'cc' || e.owner === 'md') && e.by) {
      return { state: 'waiting', text: copy.replies.replace('{name}', name(e.owner)).replace('{by}', T.formatReplyBy(e.by, s.now)), who: e.owner };
    }
    return { state: 'members', text: copy.members, who: null };
  }
  /* Where Carol's chat opens: the first thing after she last read it (from her care team, June or a shared
     event), or null when nothing is new. Pure; tested in verify-chat.mjs. */
  function firstNew(s) {
    var r = s.readUpTo.patient, idx = -1;
    if (r) s.messages.forEach(function (m, i) { if (m.id === r.upTo) idx = i; });
    for (var j = idx + 1; j < s.messages.length; j++) {
      var m = s.messages[j];
      if (m.audience === 'all' && m.author !== 'patient') return m.id;
    }
    return null;
  }

  function mount(el, api) {
    if (el._twcUnmount) el._twcUnmount();
    var store = api.store, act = api.act, sched = api.sched;
    var listeners = [];
    function listen(type, fn) { el.addEventListener(type, fn); listeners.push([type, fn]); }
    var local = { appKey: '', overlayKey: '', chatHeaderHtml: '', logHtml: '', chromeKey: '', composerPhoto: undefined,
      newFrom: null, positioned: false, pinBottom: false, logEl: null, savedScroll: null, looking: true, lastNow: store.getState().now,
      fab: 'expanded', fabTimer: null, toast: null, toastTimer: null, sign: null, clientN: 0, drawn: false, seen: {}, shownDone: null, freshUntil: {}, shownPct: null, progressFrom: null };

    el.innerHTML = '<div class="screen__status"></div><div class="screen__app"></div><div class="screen__overlay"></div><div class="screen__toast"></div>';
    var $status = el.querySelector('.screen__status'), $app = el.querySelector('.screen__app'),
      $overlay = el.querySelector('.screen__overlay'), $toast = el.querySelector('.screen__toast');

    function st() { return store.getState(); }
    /* Your own action (send, answer, task) shows its result: every update in this same moment sticks to the bottom. */
    function pinToBottom() { local.pinBottom = true; clearTimeout(local.pinTimer); local.pinTimer = setTimeout(function () { local.pinBottom = false; }, 0); }
    function P() { return st().patient; }
    function setP(patch) { store.set({ patient: Object.assign({}, P(), patch) }); }
    function hasVisit(s) { return s.messages.some(function (m) { return m.kind === 'visit'; }); }
    function photoById(id) { return S.cameraRoll.filter(function (x) { return x.id === id; })[0] || null; }

    function unread(s) {
      var r = s.readUpTo.patient, idx = -1, n = 0;
      if (r) s.messages.forEach(function (m, i) { if (m.id === r.upTo) idx = i; });
      for (var j = idx + 1; j < s.messages.length; j++) {
        var m = s.messages[j];
        if (m.audience === 'all' && m.author !== 'patient' && m.author !== 'system') n++;
      }
      return n;
    }
    function markReadIfNeeded() { if (unread(st()) > 0) act.markRead('patient'); }

    /* ── Chat header (one section: the team, then who replies and by when) ── */
    function chatHeaderHtml(s) {
      var h = headerStatus(s);
      return C.ChatHeader({ side: 'patient', title: S.status.title, status: h,
        people: [{ image: S.cast.md.photo, active: h.who === 'md' }, { image: S.cast.cc.photo, active: h.who === 'cc' }].concat(F.june === false ? [] : [{ orb: true }]),
        actions: '<button type="button" class="icon-btn icon-btn--round" data-action="about:open" aria-label="About this chat">' + U.ph('ph-info') + '</button>' });
    }

    /* ── Messages ──────────────────────────────────────────────────────── */
    function label(m) {
      var t = U.fmtTime(m.at), who = m.author;
      if (who === 'june') return C.MessageLabel({ sender: 'june', name: 'June', time: t });
      if (who === 'md') return C.MessageLabel({ sender: 'md', name: S.cast.md.name, role: S.cast.md.role, image: S.cast.md.photo, time: t });
      if (who === 'cc') return C.MessageLabel({ sender: 'cc', name: S.cast.cc.name, role: S.cast.cc.role, image: S.cast.cc.photo, time: t });
      return C.MessageLabel({ sender: 'patient', name: 'You', initials: 'CS', time: t, align: 'right' });
    }
    function lastPatientId(s) {
      for (var i = s.messages.length - 1; i >= 0; i--) {
        var m = s.messages[i];
        if (m.author === 'patient' && m.kind === 'text' && m.audience === 'all') return m.id;
      }
      return null;
    }
    function statusFor(m, s) {
      var r = s.readUpTo.care;
      if (r && r.at >= m.at) {
        var reader = r.by === 'md' ? S.cast.md.name : S.cast.cc.name;
        return 'Read by ' + esc(reader) + ' · ' + esc(U.fmtTime(r.at));
      }
      return 'Sent · ' + esc(U.fmtTime(m.at));
    }

    function msgHtml(m, s, lastPid) {
      var side = m.author === 'patient' ? 'right' : 'left';
      var cls = 'msg msg--' + side + (local.seen[m.id] ? '' : ' is-new');
      var inner = '', att = '';
      if (m.author === 'system') return C.SystemEvent({ type: (m.meta && m.meta.type) || 'record', text: m.body });
      if (m.author === 'patient') {
        var photo = m.meta && m.meta.photo ? photoById(m.meta.photo) : null;
        inner = label(m) + C.ChatBubble({ sender: 'patient', side: 'right', content: m.kind === 'choice' ? 'choice' : (photo ? 'photo' : 'text'),
          html: m.body ? esc(m.body).replace(/\n/g, '<br>') : '', photo: photo, id: m.id, status: m.id === lastPid ? statusFor(m, s) : '' });
        return '<div class="' + cls + '" data-mid="' + m.id + '">' + inner + '</div>';
      }
      if (m.author === 'june') {
        var body = esc(m.body);
        inner = label(m) + C.ChatBubble({ sender: 'june', side: 'left', html: body });
        if (m.kind === 'chips') {
          var q = m.meta, ans = q.answered;
          att = '<div class="chip-row">' + q.options.map(function (o) {
            return C.SuggestionChip({ label: o.label, action: 'chip:' + q.question + ':' + o.value, hint: ans ? '' : 'patient.chip.' + o.value,
              state: ans ? (ans === o.value ? 'selected' : 'disabled') : 'default' });
          }).join('') + '</div>';
        }
        if (m.kind === 'routing') {
          var by = new Date(m.meta.by);
          att = C.RoutingCard({ rows: (m.meta.rows || S.routing).map(function (r) { return { q: r.q, label: S.routeLabels[r.who], image: S.cast[r.who].photo }; }),
            footHtml: esc(S.june.routeFooter.replace('{by}', T.formatReplyBy(by, m.at))), note: m.meta.hours });
        }
        if (m.kind === 'resources') {
          att = m.meta.articles.map(function (i) { return C.ResourceCard({ article: S.articles[i], index: i }); }).join('') +
            '<p class="type-caption-1 muted">' + esc(m.meta.footnote) + '</p>';
        }
        if (m.meta && m.meta.link === 'careplan') att = C.Button({ variant: 'secondary', size: 'small', label: 'See full care plan', action: 'careplan:open' });
        return '<div class="' + cls + '" data-mid="' + m.id + '">' + inner + (att ? '<div class="msg__attachments">' + att + '</div>' : '') + '</div>';
      }
      /* md / cc */
      inner = label(m) + C.ChatBubble({ sender: 'staff', side: 'left', html: esc(m.body).replace(/\n/g, '<br>') });
      if (m.kind === 'visit' || (m.meta && m.meta.carePlan)) att = F.recap ? C.CarePlanSummaryCard({ plan: S.carePlan, action: 'careplan:care', hint: 'patient.careplan.see', pdf: 'careplan:pdf' })
        : C.CarePlanCard({ plan: S.carePlan, hint: m.kind === 'visit' ? 'patient.careplan' : '' });
      if (m.meta && m.meta.doc) {
        var d = s.documents[m.meta.doc] || {};
        att = C.DocumentCard({ doc: S.consentDoc, status: d.status === 'signed' ? 'signed' : 'needs', side: 'patient',
          signedText: d.signedAt ? S.sign.signedCard.replace('{when}', U.fmtDay(d.signedAt) + ' at ' + U.fmtTime(d.signedAt)) : '' });
      }
      return '<div class="' + cls + '" data-mid="' + m.id + '">' + inner + (att ? '<div class="msg__attachments">' + att + '</div>' : '') + '</div>';
    }

    function logHtml(s) {
      var out = C.IntroCard({ intro: S.intro, cast: S.cast }), lastDay = '', lastPid = lastPatientId(s);
      s.messages.forEach(function (m) {
        if (m.audience !== 'all') return;
        if (m.id === local.newFrom) out += C.SystemEvent({ type: 'new', text: S.misc.newMessages });
        var day = U.fmtDay(m.at);
        if (day !== lastDay) { out += C.SystemEvent({ type: 'date', text: day }); lastDay = day; }
        out += msgHtml(m, s, lastPid);
      });
      if (F.junePortal && hasVisit(s)) out += '<div class="june-portal">' + junePortalCard('chat', 'patient.june.chip') + '</div>';
      if (s.typing.june) out += '<div class="msg msg--left">' + C.MessageLabel({ sender: 'june', name: 'June' }) + C.TypingIndicator({ sender: 'june', name: 'June' }) + '</div>';
      else if (s.typing.cc) out += '<div class="msg msg--left">' + C.MessageLabel({ sender: 'cc', name: S.cast.cc.name, role: S.cast.cc.role, image: S.cast.cc.photo }) + C.TypingIndicator({ sender: 'cc', name: S.cast.cc.name }) + '</div>';
      else if (s.typing.md) out += '<div class="msg msg--left">' + C.MessageLabel({ sender: 'md', name: S.cast.md.name, role: S.cast.md.role, image: S.cast.md.photo }) + C.TypingIndicator({ sender: 'md', name: S.cast.md.name }) + '</div>';
      return out;
    }

    /* Opening the chat starts at the first new message; after that, the log follows new messages only while
       Carol is at the bottom, and always after her own action. */
    function fillLog(s) {
      var log = $app.querySelector('.chat-log');
      if (!log) return;
      var html = logHtml(s);
      if (html === local.logHtml) return;
      var fresh = log !== local.logEl;
      var near = fresh ? (local.savedScroll ? local.savedScroll.near : true) : log.scrollHeight - log.scrollTop - log.clientHeight < 80;
      log.innerHTML = html;
      local.logHtml = html; local.logEl = log;
      s.messages.forEach(function (m) { local.seen[m.id] = true; });
      if (!local.positioned) {
        local.positioned = true;
        var divider = log.querySelector('.sys-event--new');
        if (divider) U.pinToTop(log, divider, 12); else U.stickToBottom(log);
      } else if (local.pinBottom || near) U.stickToBottom(log);
      else if (fresh && local.savedScroll) log.scrollTop = local.savedScroll.top;
      local.savedScroll = null;
    }

    /* ── Home ──────────────────────────────────────────────────────────── */
    function greetingFor(d) { var h = d.getHours(); return h < 12 ? S.home.greeting.morning : h < 17 ? S.home.greeting.afternoon : S.home.greeting.evening; }
    function homeHtml(s) {
      if (F.careTab) return homeP1Html(s);
      var cl = s.checklist, visit = hasVisit(s), fs = S.carePlan.firstStep, steps = S.home.steps;
      var readMsg = cl.message;
      var greet = C.Greeting({ title: greetingFor(s.now),
        sub: visit && !readMsg ? S.home.subMessage : S.home.subRead,
        link: visit && !readMsg ? S.home.subMessageLink : S.home.subReadLink,
        linkAction: visit && !readMsg ? 'greeting:read' : 'careplan:open', linkHint: 'patient.greeting' });
      /* Steps finished while Carol was elsewhere celebrate the first time Home shows them, and the bar
         animates from where she last saw it. The windows keep repeat renders identical. */
      var t = Date.now(), consent = s.documents.consent, open = [], done = [];
      if (!local.shownDone) local.shownDone = Object.assign({}, cl);
      ['message', 'plan', 'consent', 'class'].forEach(function (k) {
        var def = steps.filter(function (x) { return x.key === k; })[0];
        if (k === 'message' && !visit) return;
        if (cl[k] && !local.shownDone[k]) { local.shownDone[k] = true; local.freshUntil[k] = t + 1300; }
        if (cl[k]) done.push({ state: 'done', title: def.title, fresh: local.freshUntil[k] > t });
        else open.push({ state: def.callout ? 'callout' : 'todo', key: k, iconName: def.iconName, stepper: def.stepper, title: def.title,
          meta: k === 'consent' && consent && consent.status !== 'signed' ? def.readyMeta : def.meta, hint: 'patient.step.' + k });
      });
      done.push({ state: 'done', title: steps[4].title });
      var total = open.length + done.length, pct = Math.round((100 * done.length) / total);
      if (local.shownPct != null && local.shownPct !== pct) local.progressFrom = { from: local.shownPct, until: t + 1100 };
      local.shownPct = pct;
      var from = local.progressFrom && local.progressFrom.until > t ? local.progressFrom.from : null;
      var help = open.length
        ? S.home.checklistHelp.replace('{done}', WORDS[done.length] || String(done.length)).replace('{left}', (WORDS[open.length] || String(open.length)).toLowerCase())
        : S.home.checklistAllDone;
      var checklist = C.ChecklistModule({ title: S.home.checklistTitle, done: done.length, total: total, help: help, steps: open.concat(done), progressFrom: from });
      var klass = '<section class="home__section" aria-label="' + esc(S.home.classTitle) + '">' + C.SectionTitle({ text: S.home.classTitle }) +
        C.ClassCard({ title: fs.title, trainer: fs.trainer, img: fs.img, tags: fs.tags, cta: fs.cta, ctaAction: 'class:start', ctaHint: 'patient.home.class',
          change: S.home.classChange, started: cl.class }) + '</section>';
      var june = '<section class="home__section">' + C.JuneEntryCard({ title: S.home.juneCard.title, body: S.home.juneCard.body, chips: S.juneChips }) + '</section>';
      return '<div class="home"><div class="home__body">' + greet + klass + checklist + june + '</div></div>';
    }

    function homeP1Html(s) {
      var visit = hasVisit(s), readMsg = s.checklist.message;
      var greet = C.Greeting({ title: greetingFor(s.now), sub: visit && !readMsg ? S.home.subMessage : S.home.subRead,
        link: visit && !readMsg ? S.home.subMessageLink : S.home.subReadLink, linkAction: visit && !readMsg ? 'greeting:read' : 'careplan:open', linkHint: 'patient.greeting' });
      var plan = visit ? '<section class="home__section">' + C.CarePlanModule({ plan: S.carePlan, action: 'careplan:open' }) + '</section>' : '';
      return '<div class="home"><div class="home__body">' + greet + plan + '</div></div>';
    }
    /* ── Care tab (P1) · Figma Member Dashboard 2183:67647, after the visit ── */
    function careTabHtml(s) {
      var ct = S.careTab, nv = S.carePlan.nextVisit;
      var plan = hasVisit(s) ? '<section class="home__section">' + C.CarePlanModule({ plan: S.carePlan, action: 'careplan:open', hint: 'patient.caretab.plan', pdf: 'careplan:pdf' }) + '</section>' : '';
      var next = '<section class="home__section"><article class="care-plan-card"><div class="card-head"><span class="medallion medallion--doc">' + U.ph(nv.icon) + '</span>' +
        '<div><h3 class="type-body-bold">' + esc(nv.title) + '</h3><p class="type-caption-1 muted">' + esc(nv.detail) + '</p></div></div></article></section>';
      var team = '<section class="home__section">' + C.TeamMemberCard({ team: ct.team, people: [{ image: S.cast.cc.photo }, { image: S.cast.md.photo }] }) + '</section>';
      var faq = '<section class="home__section" aria-label="' + esc(ct.faqTitle) + '">' + C.SectionTitle({ text: ct.faqTitle }) + C.FaqList({ items: ct.faq }) + '</section>';
      return '<div class="home home--care"><div class="home__body">' + plan + next + team + faq + '</div></div>';
    }
    /* ── Sign-in from the text link (P1) ───────────────────────────────── */
    function verifyHtml(s) {
      var v = s.patient.verify || { step: 'dob' };
      if (v.step === 'code') return C.VerifyCode({ copy: S.verify, value: v.value, error: v.error });
      if (v.step === 'passkey') return C.VerifyPasskeyOffer({ copy: S.verify });
      return C.VerifyDob({ copy: S.verify, value: v.value, error: v.error });
    }

    /* ── Chrome (header + tab bar) and screens ─────────────────────────── */
    function tabFor(view) { return view === 'messages' ? 'messages' : view; }
    function unreadShown(s) { return P().view === 'messages' ? 0 : unread(s); } // no badge for the chat that's open
    function headerHtml(s) { return C.NavHeader({ initials: 'CS', menuOpen: P().menu, badge: unreadShown(s), menuItems: S.accountMenu }); }
    function tabsHtml(s) { return C.TabBar({ tabs: S.tabs, active: tabFor(P().view), badges: { messages: unreadShown(s) } }); }
    function composerHtml(s) {
      var p = P(), photo = p.composer.photo ? photoById(p.composer.photo) : null, text = p.composer.text || '';
      return C.Composer({ side: 'patient', id: 'patient-composer', placeholder: 'Message your care team', emergency: S.emergencyNote,
        text: text, photo: photo, canSend: !!(text.trim() || photo), inputHint: 'patient.composer', attachHint: 'patient.attach', sendHint: 'patient.send' });
    }
    function messagesHtml(s) {
      return '<div class="chat chat--patient"><div class="header-slot"></div>' +
        '<div class="chat-log" role="log" aria-live="polite" aria-label="Messages with your care team"></div>' +
        '<div class="composer-slot">' + (F.reply === false ? C.ReplyComingSoon({ text: S.reply.soon, emergency: S.emergencyNote }) : composerHtml(s)) + '</div></div>';
    }
    function placeholderHtml(view) {
      var title = S.home.placeholder[view] || 'Bold';
      return '<div class="home">' + C.Placeholder({ title: title, body: S.home.placeholder.body }) + '</div>';
    }
    function longDate(d) { return LONG_DAYS[d.getDay()] + ', ' + LONG_MONTHS[d.getMonth()] + ' ' + d.getDate(); }
    function relTime(at, now) {
      var mins = Math.round((now - at) / 60000);
      if (mins < 1) return 'now';
      if (mins < 60) return mins + 'm ago';
      return Math.round(mins / 60) + 'h ago';
    }
    function lockHtml(s) {
      var p = P(), notes = '';
      if (p.notification === 'sms') {
        var v = s.messages.filter(function (m) { return m.kind === 'visit'; })[0];
        if (v) notes = C.LockNotification({ app: 'messages', appName: S.lock.sms.app, time: relTime(v.at, s.now), title: S.lock.sms.from,
          text: S.lock.sms.body, action: 'note:sms', hint: 'patient.sms', fresh: true });
      }
      if (p.notification === 'push') {
        var last = s.messages.filter(function (m) { return m.author === 'md' && m.audience === 'all'; }).pop();
        notes = C.LockNotification({ app: 'bold', appName: S.lock.push.app, time: last ? relTime(last.at, s.now) : 'now', title: S.lock.push.title,
          text: S.lock.push.body, action: 'note:push', hint: 'patient.push', fresh: true });
      }
      return C.LockScreen({ date: longDate(s.now), time: U.fmtClock(s.now), notes: notes });
    }

    function appKey(s) { var p = s.patient; return [p.view, p.menu ? 'menu' : '', p.view === 'lock' ? (p.notification || '') + '@' + U.fmtClock(s.now) : '',
      p.view === 'verify' ? JSON.stringify(p.verify) : ''].join('|'); }

    function renderApp(s) {
      var p = s.patient, oldLog = $app.querySelector('.chat-log');
      local.savedScroll = oldLog ? { top: oldLog.scrollTop, near: oldLog.scrollHeight - oldLog.scrollTop - oldLog.clientHeight < 80 } : null;
      local.logHtml = ''; local.chatHeaderHtml = ''; local.chromeKey = '';
      if (p.view === 'lock') { $app.innerHTML = lockHtml(s); return; }
      if (p.view === 'verify') {
        $app.innerHTML = verifyHtml(s); startResendTimer();
        var bad = $app.querySelector('[aria-invalid="true"]'); if (bad && !sched.instant) bad.focus(); // errors keep the field in hand
        return;
      }
      var body = p.view === 'home' ? homeHtml(s) : p.view === 'messages' ? messagesHtml(s) : p.view === 'care' && F.careTab ? careTabHtml(s) : placeholderHtml(p.view);
      local.homeHtml = p.view === 'home' ? body : '';
      $app.innerHTML = '<div class="patient-app patient-app--' + p.view + '"><div class="chrome-top">' + headerHtml(s) + '</div>' + body +
        '<div class="chrome-bottom">' + tabsHtml(s) + '</div>' + (p.view === 'home' && F.june !== false ? C.JuneFab({ label: S.home.fab, state: local.fab }) : '') + '</div>';
      local.chromeKey = chromeKey(s);
      local.composerPhoto = p.composer.photo;
      if (p.view === 'home' && F.june !== false) startFabTimer();
      updateApp(s);
    }
    function chromeKey(s) { return unreadShown(s) + '|' + P().view; }
    function updateApp(s) {
      var p = s.patient;
      if (p.view === 'lock' || p.view === 'verify') return;
      var ck = chromeKey(s);
      if (ck !== local.chromeKey) {
        var top = $app.querySelector('.chrome-top'), bottom = $app.querySelector('.chrome-bottom');
        if (top) top.innerHTML = headerHtml(s);
        if (bottom) bottom.innerHTML = tabsHtml(s);
        local.chromeKey = ck;
      }
      if (p.view === 'home') {
        var home = $app.querySelector('.home'), y = home ? home.scrollTop : 0;
        var html = homeHtml(s);
        if (home && html !== local.homeHtml) { home.outerHTML = html; local.homeHtml = html; var h2 = $app.querySelector('.home'); if (h2) h2.scrollTop = y; }
        else local.homeHtml = html;
        animateProgress();
      }
      if (p.view === 'messages') {
        var hh = chatHeaderHtml(s), slot = $app.querySelector('.header-slot');
        if (slot && hh !== local.chatHeaderHtml) { slot.innerHTML = hh; local.chatHeaderHtml = hh; }
        fillLog(s);
        if (F.reply !== false && p.composer.photo !== local.composerPhoto) {
          var ta = el.querySelector('#patient-composer'), keep = ta ? ta.value : '';
          var cs = $app.querySelector('.composer-slot');
          if (cs) { cs.innerHTML = composerHtml(s); var ta2 = el.querySelector('#patient-composer'); if (ta2) { ta2.value = keep || p.composer.text || ''; autoGrow(ta2); } }
          local.composerPhoto = p.composer.photo;
        }
        updateSend();
      }
    }

    /* ── Overlays (sheets, modals, signing) ────────────────────────────── */
    function carePlanSheetBody(s) {
      var cp = S.carePlan, fs = cp.firstStep;
      var rows = cp.items.concat([cp.tests, cp.nextVisit]).map(function (it) {
        return '<li class="plan-list__item"><span class="plan-list__icon">' + U.ph(it.icon) + '</span><span><span class="type-body-bold">' + esc(it.title) +
          '</span><span class="type-caption-1 muted plan-list__detail">' + esc(it.detail) + (it.more ? '. ' + esc(it.more) : '') + '</span></span></li>';
      }).join('');
      return '<p class="type-caption-1 muted">' + esc(cp.fromLong) + '</p><ul class="plan-list">' + rows + '</ul>' +
        '<p class="type-caption-1-bold first-step__label">' + esc(cp.firstStepLabel) + '</p>' +
        C.ClassCard({ title: fs.title, trainer: fs.trainer, img: fs.img, tags: fs.tags, cta: fs.cta, ctaAction: 'class:start', ctaHint: 'patient.firststep', started: s.checklist.class }) +
        '<p class="type-body">' + esc(cp.footer) + '</p>' + C.Button({ variant: 'secondary', full: true, label: cp.footerCta, action: 'careplan:message' });
    }
    function signHtml(s) {
      var sg = local.sign, doc = S.consentDoc;
      if (!sg) return '';
      if (sg.step === 'disclosure') {
        return C.ModalFullScreen({ kind: 'modal:sign', title: S.sign.title, tone: 'doc', closeAction: 'sign:close',
          body: C.SignDisclosure({ doc: doc, copy: S.sign, checked: sg.esign, error: sg.error }),
          foot: C.Button({ variant: 'primary', full: true, label: S.sign.continue, action: 'sign:continue', hint: sg.esign ? 'patient.sign.continue' : '' }) });
      }
      if (sg.step === 'done') {
        return C.ModalFullScreen({ kind: 'modal:sign', title: S.sign.title, closeAction: 'sign:close', body: C.SignDone({ copy: S.sign }),
          foot: C.Button({ variant: 'primary', full: true, label: S.sign.back, action: 'sign:close', hint: 'patient.sign.back' }) +
            C.Button({ variant: 'secondary', full: true, label: S.sign.seeChecklist, action: 'sign:home', hint: 'patient.sign.home' }) +
            C.Button({ variant: 'text', full: true, label: S.sign.emailCopy, action: 'sign:email' }) });
      }
      var doneN = sg.checked.filter(Boolean).length + (sg.signature ? 1 : 0);
      var right = '<span class="sign-progress type-caption-1">' + esc(S.sign.progress.replace('{done}', doneN).replace('{total}', 5)) + '</span>' +
        C.Button({ variant: 'primary', size: 'small', label: S.sign.finish, action: 'sign:finish', hint: 'patient.sign.finish' });
      var tagType = sg.target >= 4 ? 'sign' : (doneN === 0 ? 'start' : 'next');
      var tagLabel = tagType === 'sign' ? S.sign.signTag : tagType === 'start' ? S.sign.start : S.sign.next;
      var body = '<div class="doc-view"><div class="sign-float" data-sign-float>' +
        C.SignTag({ type: tagType === 'sign' ? 'next' : tagType, label: tagLabel, action: 'sign:next', hint: 'patient.sign.start' }) + '</div>' +
        C.SignDocumentPage({ doc: doc, checked: sg.checked, signature: sg.signature, patientName: 'Carol Simmons', signLabel: S.sign.signTag,
          target: sg.target, boxHint: sg.guided ? 'patient.sign.box' : '',
          dateText: sg.signature ? U.fmtDay(s.now) : '' }) +
        (sg.leftMsg ? '<p class="field__error type-caption-1" role="alert">' + U.ph('ph-warning-circle', 'fill') + esc(sg.leftMsg) + '</p>' : '') + '</div>';
      var adopt = sg.adopt ? C.SheetBottom({ kind: 'sheet:adopt', title: S.sign.adoptTitle, closeAction: 'adopt:close',
        body: C.AdoptSignature({ mode: sg.adopt.mode, name: sg.adopt.name, copy: S.sign, error: sg.adopt.error }),
        foot: C.Button({ variant: 'primary', full: true, label: S.sign.signCta, action: 'adopt:sign', hint: 'patient.adopt.sign' }) }) : '';
      return C.ModalFullScreen({ kind: 'modal:sign', title: S.sign.title, tone: 'doc', closeAction: 'sign:close', headRight: right, body: body }) + adopt;
    }
    function overlayHtml(s) {
      var p = s.patient, out = '';
      if (p.modal) {
        var md = p.modal;
        if (md.name === 'photos') out = C.ModalFullScreen({ kind: 'modal:photos', title: S.attach.pickerTitle, body: C.PhotoGrid({ photos: S.cameraRoll }) });
        if (md.name === 'photo') {
          var ph = photoById(md.props.id);
          out = C.ModalFullScreen({ kind: 'modal:photo', title: 'Photo', body: '<div class="photo-view"><img src="' + ph.src + '" alt="' + esc(ph.alt) + '"></div>' });
        }
        if (md.name === 'article') out = C.ModalFullScreen({ kind: 'modal:article', title: S.articles[md.props.i].kind, closeHint: 'patient.article.close', body: C.ArticleBody({ article: S.articles[md.props.i] }) });
        if (md.name === 'sign') out = signHtml(s);
        if (md.name === 'careplan') out = C.ModalFullScreen({ kind: 'modal:careplan', title: S.carePlan.title, closeAction: 'careplan:close', closeHint: 'patient.careplan.close',
          headRight: '<button type="button" class="icon-btn" data-action="careplan:pdf" aria-label="' + esc(S.carePlan.pdf) + '">' + U.ph('ph-download-simple') + '</button>',
          body: C.CarePlanReview({ plan: S.carePlan, extra: F.junePortal ? { nutrition: junePortalCard('plan', 'patient.june.plan', 1) } : null }) });
        if (md.name === 'june') out = juneChatHtml(md.props);
      }
      if (p.sheet) {
        var sh = p.sheet.name;
        if (sh === 'about') out += C.SheetBottom({ kind: 'sheet:about', title: 'About this chat', body: C.IntroCard({ intro: S.intro, cast: S.cast }) });
        if (sh === 'careplan') out += C.SheetBottom({ kind: 'sheet:careplan', title: S.carePlan.title, tall: true, closeHint: 'patient.careplan.close', body: carePlanSheetBody(s) });
        if (sh === 'attach') out += C.SheetBottom({ kind: 'sheet:attach', title: S.attach.title, body: C.ActionList({ actions: [
          { icon: 'ph-images', label: S.attach.library, action: 'attach:library', hint: 'patient.attach.library' },
          { icon: 'ph-camera', label: S.attach.camera, action: 'attach:camera' }] }) + '<p class="type-caption-1 muted">' + esc(S.attach.privacy) + '</p>' });
      }
      return out;
    }
    function renderOverlay(s) {
      var p = s.patient;
      var key = JSON.stringify([p.sheet, p.modal, local.sign ? local.sign.v : 0, p.modal && p.modal.name === 'sign' ? s.documents : 0,
        p.sheet && p.sheet.name === 'careplan' ? s.checklist.class : 0]);
      if (key === local.overlayKey) return;
      local.overlayKey = key;
      var prevBody = $overlay.querySelector('.modal__body'), y = prevBody ? prevBody.scrollTop : 0;
      var prevKinds = Array.prototype.map.call($overlay.querySelectorAll('.layer'), function (l) { return l.getAttribute('data-kind'); });
      $overlay.innerHTML = overlayHtml(s);
      Array.prototype.forEach.call($overlay.querySelectorAll('.layer'), function (l) { if (prevKinds.indexOf(l.getAttribute('data-kind')) >= 0) l.classList.add('is-static'); });
      var body = $overlay.querySelector('.modal__body');
      if (body && local.sign && local.sign.step === 'doc') { body.scrollTop = y; placeSignFloat(); wireCanvas(); }
    }
    function placeSignFloat() {
      var sg = local.sign; if (!sg) return;
      var fl = $overlay.querySelector('[data-sign-float]'); if (!fl) return;
      var field = $overlay.querySelector(sg.target >= 4 ? '[data-field="signature"]' : '[data-field="agree-' + sg.target + '"]');
      $overlay.querySelectorAll('.is-target').forEach(function (x) { x.classList.remove('is-target'); });
      if (!field) return;
      field.classList.add('is-target');
      fl.style.top = (field.offsetTop + 4) + 'px'; // runtime-computed position
    }
    function scrollToField() {
      var sg = local.sign, body = $overlay.querySelector('.modal__body'); if (!sg || !body) return;
      var field = $overlay.querySelector(sg.target >= 4 ? '[data-field="signature"]' : '[data-field="agree-' + sg.target + '"]');
      if (field) {
        body.scrollTo({ top: Math.max(0, field.offsetTop - 160), behavior: sched.instant ? 'auto' : 'smooth' });
        var focusable = field.querySelector('input, button');
        if (focusable && !sched.instant) focusable.focus({ preventScroll: true });
      }
    }
    function bumpSign() { if (local.sign) { local.sign.v = (local.sign.v || 0) + 1; renderOverlay(st()); } }

    /* New progress on Home: bring the checklist into view (it sits under the class module), then fill the bar. */
    function animateProgress() {
      var pr = $app.querySelector('.progress[data-p]');
      if (!pr || pr._animated) return;
      pr._animated = true;
      U.reveal($app.querySelector('.home'), pr.closest('.checklist'), !sched.instant);
      setTimeout(function () { pr.style.setProperty('--p', pr.getAttribute('data-p')); }, sched.instant ? 0 : 450);
    }

    /* ── Toast + floating button ───────────────────────────────────────── */
    function showToast(text) {
      $toast.innerHTML = C.Toast({ text: text });
      clearTimeout(local.toastTimer);
      local.toastTimer = setTimeout(function () { $toast.innerHTML = ''; }, 2600);
    }
    function startFabTimer() {
      clearTimeout(local.fabTimer);
      if (local.fab === 'collapsed') return;
      local.fabTimer = setTimeout(function () {
        local.fab = 'collapsed';
        var f = $app.querySelector('.june-fab');
        if (f) { f.classList.add('is-collapsed'); f.setAttribute('data-variant', 'State=Collapsed'); }
      }, 4000);
    }

    /* ── Composer helpers ──────────────────────────────────────────────── */
    function autoGrow(ta) { ta.style.height = 'auto'; ta.style.height = Math.min(96, Math.max(44, ta.scrollHeight)) + 'px'; }
    function updateSend() {
      var ta = el.querySelector('#patient-composer'), btn = el.querySelector('.composer--patient .round-btn--send');
      if (!ta || !btn) return;
      var ok = !!(ta.value.trim() || P().composer.photo);
      btn.disabled = !ok || !!local.scripting; // no sending half a scripted message
      btn.setAttribute('aria-label', ok ? 'Send message' : 'Send, type something first');
    }
    function focusComposer() { var ta = el.querySelector('#patient-composer'); if (ta) ta.focus(); }
    function setComposer(text) { setP({ composer: Object.assign({}, P().composer, { text: text }) }); }

    /* ── Intents ───────────────────────────────────────────────────────── */
    function tapSms() {
      if (F.verify) { // the link opens Bold signed out: confirm it's Carol before anything shows
        setP({ view: 'verify', notification: null, menu: false, sheet: null, modal: null, verify: { step: 'dob', value: '', error: '' } });
        return store.emit('verify:started', {});
      }
      setP({ view: 'home', tab: 'home', notification: null, menu: false, sheet: null, modal: null }); store.emit('patient:home-opened', { from: 'sms' });
    }
    /* ── Sign-in (P1): date of birth → texted code → Face ID offer → straight to the message ── */
    function V() { return P().verify || { step: 'dob' }; }
    function setV(patch) { setP({ verify: Object.assign({}, V(), patch) }); }
    function fieldValue(id) { var f = el.querySelector('#' + id); return f ? f.value.trim() : ''; }
    function submitDob(value) {
      if (V().step !== 'dob') { store.emit('verify:dob-ok', {}); return; }
      if (!/^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/(19|20)\d\d$/.test(value)) return setV({ value: value, error: S.verify.dobError });
      setV({ step: 'code', value: '', error: '', sentAt: Date.now() });
      store.emit('verify:dob-ok', {});
    }
    function enterDob() {
      if (P().view !== 'verify') tapSms();
      if (V().step !== 'dob') return store.emit('verify:dob-ok', {});
      var f = el.querySelector('#verify-dob'); if (f) f.value = S.verify.dobValue;
      sched.later(500, function () { submitDob(S.verify.dobValue); });
    }
    function submitCode(value) {
      if (V().step !== 'code') { store.emit('verify:code-ok', {}); return; }
      if (value !== S.verify.code) return setV({ value: value, error: S.verify.codeError });
      setV({ step: 'passkey', value: '', error: '' });
      store.emit('verify:code-ok', {});
    }
    function enterCode() {
      if (V().step !== 'code') return store.emit('verify:code-ok', {});
      var f = el.querySelector('#verify-code'); if (f) f.value = S.verify.code;
      sched.later(450, function () { submitCode(S.verify.code); });
    }
    function choosePasskey() {
      if (P().view === 'messages') return store.emit('patient:thread-opened', { from: 'sms' });
      setP({ verify: null });
      openMessages('sms'); // the deep link survives sign-in: Carol lands on the message
    }
    function startResendTimer() {
      clearInterval(local.resendTimer);
      var b = el.querySelector('[data-resend]'), v = V();
      if (!b || v.step !== 'code') return;
      function tick() {
        var left = Math.max(0, 30 - Math.floor((Date.now() - (v.sentAt || 0)) / 1000));
        b.disabled = left > 0;
        b.textContent = left > 0 ? S.verify.resendIn.replace('{s}', '0:' + (left < 10 ? '0' : '') + left) : S.verify.resend;
        if (!left) clearInterval(local.resendTimer);
      }
      tick(); local.resendTimer = setInterval(tick, 1000);
    }
    /* ── Care tab + care plan review (P1) ──────────────────────────────── */
    function openCareTab() {
      setP({ view: 'care', tab: 'care', menu: false, sheet: null, modal: null });
      store.emit('caretab:opened', {});
    }
    function openReview() {
      setP({ modal: { name: 'careplan' }, sheet: null, menu: false });
      if (!st().checklist.plan) act.setChecklist('plan', true);
      store.emit('careplan:opened', {});
    }
    function openWhy(target) {
      var d = target ? target.closest('details') : $overlay.querySelector('.plan-review details');
      if (!d) return;
      d.open = target ? !d.open : true;
      if (d.open) store.emit('careplan:why', {});
    }
    /* ── June portal (P1): its own chat, opened from the thread or the Nutrition section ── */
    function junePortalCard(from, hint, hintChip) {
      var jp = S.junePortal;
      return C.JuneEntryCard({ title: jp.title, body: jp.body, chips: jp.chips, prefix: 'june-ask-' + from, hint: hint, hintIndex: hintChip || 0 });
    }
    function juneChatHtml(pr) {
      var jp = S.junePortal, log = pr.log || [];
      var rows = '<div class="msg msg--left">' + C.MessageLabel({ sender: 'june', name: 'June' }) + C.ChatBubble({ sender: 'june', side: 'left', html: esc(jp.intro) }) + '</div>' +
        log.map(function (m) {
          if (m.who === 'patient') return '<div class="msg msg--right">' + C.ChatBubble({ sender: 'patient', side: 'right', html: esc(m.text) }) + '</div>';
          return '<div class="msg msg--left">' + C.MessageLabel({ sender: 'june', name: 'June' }) + C.ChatBubble({ sender: 'june', side: 'left', html: esc(m.text).replace(/\n/g, '<br>') }) + '</div>';
        }).join('') +
        (pr.typing ? '<div class="msg msg--left">' + C.TypingIndicator({ sender: 'june', name: 'June' }) + '</div>' : '');
      var asked = log.filter(function (m) { return m.who === 'patient'; }).map(function (m) { return m.text; });
      var chips = jp.chips.map(function (c, i) { return asked.indexOf(c.label) < 0 ? C.SuggestionChip({ label: c.label, action: 'june-ask-' + pr.from + ':' + i }) : ''; }).join('');
      var foot = '<form class="june-form" data-form="june" novalidate><label class="u-vh" for="june-input">' + esc(jp.inputLabel) + '</label>' +
        '<input id="june-input" class="field__input type-body june-form__input" placeholder="' + esc(jp.inputLabel) + '" autocomplete="off">' +
        '<button type="submit" class="round-btn round-btn--send" data-action="june:send" aria-label="Send to June">' + U.ph('ph-arrow-up', 'bold') + '</button></form>' +
        C.EmergencyNote({ text: jp.note });
      return C.ModalFullScreen({ kind: 'modal:june', title: jp.chatTitle, closeAction: 'june:close', closeHint: 'patient.june.close',
        body: '<div class="june-chat" role="log" aria-live="polite">' + rows + (chips ? '<div class="chip-row">' + chips + '</div>' : '') + '</div>', foot: foot });
    }
    function juneReply(text, chip) {
      var jp = S.junePortal, red = T.detectRedFlags(text);
      if (red) return red.level === 'crisis' ? jp.crisis : jp.emergency;
      var i = chip != null ? chip : jp.keywords.findIndex(function (re) { return re.test(text); });
      return i >= 0 ? jp.answers[i] + (i === 0 ? '\n' + jp.general : '') : jp.fallback;
    }
    function openJune(from) {
      var md = P().modal;
      if (md && md.name === 'june') return;
      setP({ modal: { name: 'june', props: { from: from, back: md && md.name === 'careplan' ? 'careplan' : null, log: [] } }, sheet: null, menu: false });
      store.emit('june:opened', { from: from });
    }
    function askJune(from, chip, typed) {
      openJune(from || 'chat');
      var jp = S.junePortal, q = typed != null ? typed : jp.chips[chip].label;
      if (!String(q).trim()) return;
      var pr = P().modal.props, log = pr.log.concat([{ who: 'patient', text: q }]);
      setP({ modal: { name: 'june', props: Object.assign({}, pr, { log: log, typing: true }) } });
      sched.later(900, function () {
        var cur = P().modal; if (!cur || cur.name !== 'june') return;
        var cp = cur.props, ans = juneReply(q, typed != null ? null : chip);
        setP({ modal: { name: 'june', props: Object.assign({}, cp, { log: cp.log.concat([{ who: 'june', text: ans }]), typing: false }) } });
        var b = $overlay.querySelector('.modal[aria-label="June"] .modal__body'); if (b) b.scrollTop = b.scrollHeight;
        store.emit('june:message', { text: ans });
      });
    }
    function closeJune() {
      var md = P().modal;
      if (md && md.name === 'june') setP({ modal: md.props.back ? { name: md.props.back } : null });
      store.emit('june:closed', {});
    }
    /* The same plan as a PDF (layout of a finalized Healthie plan; built from care-plan-pdf.html). */
    function downloadPdf() {
      var a = document.createElement('a');
      a.href = S.carePlan.pdfFile; a.download = S.carePlan.pdfName;
      document.body.appendChild(a); a.click(); a.remove();
      showToast(S.carePlan.pdfToast);
    }
    function closeCarePlan() {
      if (P().modal && P().modal.name === 'careplan') setP({ modal: null });
      store.emit('careplan:closed', {});
    }
    function tapPush() { openMessages('push'); }
    function showLock(kind) {
      local.sign = null;
      setP({ view: 'lock', notification: kind || null, menu: false, sheet: null, modal: null });
      if (kind === 'push') store.emit('push:shown', {});
    }
    function openHome() {
      local.sign = null;
      setP({ view: 'home', tab: 'home', menu: false, sheet: null, modal: null, notification: null });
      store.emit('patient:home-opened', {});
    }
    function openMessages(from) {
      local.newFrom = firstNew(st()); local.positioned = false; local.looking = true; // open at the first new message
      setP({ view: 'messages', tab: 'messages', menu: false, sheet: null, modal: null, notification: null });
      markReadIfNeeded();
      if (hasVisit(st()) && !st().checklist.message) act.setChecklist('message', true);
      store.emit('patient:thread-opened', { from: from || 'tab' });
    }
    function openCarePlan() {
      if (F.careTab) return openReview();
      act.openSheet('patient', 'careplan');
      if (!st().checklist.plan) act.setChecklist('plan', true);
      store.emit('careplan:opened', {});
    }
    function startFirstStep() {
      var wasSheet = P().sheet && P().sheet.name === 'careplan';
      if (P().sheet) act.closeSheet('patient');
      if (!st().checklist.class) act.setChecklist('class', true);
      showToast(S.carePlan.toastClass);
      store.emit('class:started', { at: st().now });
      if (wasSheet) store.emit('careplan:closed', {});
    }
    function closeSheet() {
      var name = P().sheet && P().sheet.name;
      act.closeSheet('patient');
      if (name === 'careplan') store.emit('careplan:closed', {});
    }
    function pickPhoto(id) {
      setP({ modal: null, sheet: null, composer: Object.assign({}, P().composer, { photo: id }) });
      store.emit('photo:attached', { id: id });
    }
    function attachPhoto(id) {
      if (P().view !== 'messages') openMessages('tab');
      if (P().composer.photo === id) { store.emit('photo:attached', { id: id }); return; }
      act.openSheet('patient', 'attach');
      sched.later(700, function () {
        setP({ sheet: null, modal: { name: 'photos' } });
        sched.later(800, function () { pickPhoto(id); });
      });
    }
    function typeMessage(text) {
      if (P().view !== 'messages') openMessages('tab');
      var ta = el.querySelector('#patient-composer');
      if (ta && ta.value === text) { store.emit('composer:filled', { text: text }); return; }
      if (sched.instant || !ta) { setComposer(text); var t0 = el.querySelector('#patient-composer'); if (t0) { t0.value = text; autoGrow(t0); } updateSend(); store.emit('composer:filled', { text: text }); return; }
      var i = 0, per = Math.max(1, Math.ceil(text.length / 45));
      local.scripting = true;
      (function tick() {
        i = Math.min(text.length, i + per);
        var t = el.querySelector('#patient-composer');
        if (t) { t.value = text.slice(0, i); autoGrow(t); updateSend(); }
        if (i < text.length) sched.later(28, tick);
        else { local.scripting = false; setComposer(text); updateSend(); store.emit('composer:filled', { text: text }); }
      })();
    }
    function send() {
      if (local.scripting) return;
      var ta = el.querySelector('#patient-composer');
      var text = ((ta ? ta.value : P().composer.text) || '').trim();
      var photoId = P().composer.photo;
      if (!text && !photoId) return;
      if (ta) { ta.value = ''; autoGrow(ta); }
      pinToBottom(); local.newFrom = null; // replying means Carol is caught up
      setP({ composer: { text: '', photo: null } });
      act.sendMessage({ author: 'patient', kind: 'text', body: text, meta: photoId ? { photo: photoId } : {},
        clientId: 'p' + (++local.clientN) + '-' + st().messages.length });
      updateSend();
    }
    function pendingQuestion() {
      var ms = st().messages;
      for (var i = ms.length - 1; i >= 0; i--) {
        if (ms[i].author === 'june' && ms[i].kind === 'chips') return ms[i].meta.answered ? null : ms[i];
      }
      return null;
    }
    function answer(value) {
      var q = pendingQuestion();
      if (!q) { var off = store.on('screen:asked', function () { off(); answer(value); }); return; }
      var opt = q.meta.options.filter(function (o) { return o.value === value; })[0];
      if (!opt) return;
      pinToBottom();
      act.updateMessage(q.id, { meta: Object.assign({}, q.meta, { answered: value }) });
      act.sendMessage({ author: 'patient', kind: 'choice', body: opt.label, meta: { question: q.meta.question, value: value } });
      store.emit('screen:answered', { q: q.meta.question, value: value });
    }
    function askChip(i) {
      var chip = S.juneChips[i];
      if (!chip) return;
      openMessages('card');
      if (chip.focus) { setTimeout(focusComposer, 60); return; } // "Ask something else" just opens the message box
      pinToBottom();
      act.sendMessage({ author: 'patient', kind: 'text', body: chip.label, meta: { chip: i }, clientId: 'chip' + i + '-' + st().messages.length });
    }
    function openResource(i) { setP({ modal: { name: 'article', props: { i: i } } }); store.emit('article:opened', { i: i }); }
    function closeArticle() { setP({ modal: null }); store.emit('article:closed', {}); }

    function openSign(id) {
      id = id || 'consent';
      var doc = st().documents[id];
      if (!doc) { showToast(S.misc.consentLater); return; }
      local.sign = { id: id, step: doc.status === 'signed' ? 'done' : 'disclosure', esign: false, error: false,
        checked: [false, false, false, false], signature: null, adopt: null, target: 0, v: 1, agreedEmitted: false };
      setP({ modal: { name: 'sign' }, sheet: null });
      act.openDocument(id);
    }
    function continueDisclosure() {
      var sg = local.sign; if (!sg) return;
      if (!sg.esign) { sg.error = true; bumpSign(); return; }
      sg.step = 'doc'; sg.target = 0; bumpSign();
      store.emit('sign:disclosure-accepted', {});
    }
    function acceptDisclosure() {
      var sg = local.sign; if (!sg) return;
      if (sg.step !== 'disclosure') { store.emit('sign:disclosure-accepted', {}); return; }
      if (!sg.esign) { sg.esign = true; sg.error = false; bumpSign(); }
      sched.later(450, continueDisclosure);
    }
    function nextTarget(sg) { var i = sg.checked.indexOf(false); return i < 0 ? 4 : i; }
    function agreementsDone(sg) {
      if (sg.checked.indexOf(false) < 0 && !sg.agreedEmitted) { sg.agreedEmitted = true; store.emit('sign:agreements-done', {}); }
    }
    function completeAgreements() {
      var sg = local.sign; if (!sg) return;
      if (sg.step === 'disclosure') { sg.esign = true; sg.step = 'doc'; bumpSign(); }
      (function nextOne() {
        var idx = sg.checked.indexOf(false);
        if (idx < 0) { sg.target = 4; sg.agreedEmitted = true; bumpSign(); scrollToField(); store.emit('sign:agreements-done', {}); return; }
        sg.target = idx; bumpSign(); scrollToField();
        sched.later(550, function () { sg.checked[idx] = true; sg.target = nextTarget(sg); bumpSign(); sched.later(250, nextOne); });
      })();
    }
    function openAdopt(mode) {
      var sg = local.sign; if (!sg) return;
      sg.adopt = { mode: mode || 'type', name: 'Carol Simmons', error: null }; local.drawn = false; bumpSign();
    }
    function doAdopt() {
      var sg = local.sign; if (!sg || !sg.adopt) return;
      var a = sg.adopt, input = $overlay.querySelector('input[name="signer"]');
      var name = ((input ? input.value : a.name) || '').trim();
      if (a.mode === 'type') {
        if (!name) { a.error = S.sign.nameError; bumpSign(); return; }
        sg.signature = { mode: 'type', name: name };
      } else {
        var cv = $overlay.querySelector('.adopt__canvas');
        if (!local.drawn || !cv) { a.error = S.sign.drawError; bumpSign(); return; }
        sg.signature = { mode: 'draw', dataUrl: cv.toDataURL('image/png'), name: name || 'Carol Simmons' };
      }
      sg.adopt = null; sg.target = nextTarget(sg); sg.leftMsg = ''; bumpSign();
      store.emit('sign:signature-adopted', {});
    }
    function adoptSignature(mode) {
      var sg = local.sign; if (!sg) return;
      if (sg.signature) { store.emit('sign:signature-adopted', {}); return; }
      openAdopt(mode || 'type');
      sched.later(900, doAdopt);
    }
    function finishSigning() {
      var sg = local.sign; if (!sg) return;
      if (sg.step === 'done') { store.emit('doc:signed', { id: sg.id }); return; }
      var left = sg.checked.filter(function (c) { return !c; }).length + (sg.signature ? 0 : 1);
      if (left) { sg.leftMsg = S.sign.left.replace('{n}', left); sg.target = nextTarget(sg); bumpSign(); scrollToField(); return; }
      sg.step = 'done'; sg.v++;
      if ((st().documents[sg.id] || {}).status !== 'signed') {
        act.signDocument(sg.id, sg.signature);
        act.setChecklist('consent', true);
        act.sendMessage({ author: 'system', kind: 'event', audience: 'care', meta: { type: 'signed', doc: sg.id },
          body: S.care.records.signed.replace('{time}', U.fmtTime(st().now)) });
      }
      renderOverlay(st());
    }
    function closeSign() { local.sign = null; setP({ modal: null }); store.emit('sign:closed', {}); }

    /* ── Signature canvas ──────────────────────────────────────────────── */
    function wireCanvas() {
      var cv = $overlay.querySelector('.adopt__canvas'); if (!cv || cv._wired) return;
      cv._wired = true;
      var ctx = cv.getContext('2d'), drawing = false, ink = getComputedStyle(el).getPropertyValue('--primary-ink-300') || 'black';
      ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.strokeStyle = ink.trim();
      function pos(e) { var r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * (cv.width / r.width), (e.clientY - r.top) * (cv.height / r.height)]; }
      cv.addEventListener('pointerdown', function (e) { drawing = true; cv.setPointerCapture(e.pointerId); var p = pos(e); ctx.beginPath(); ctx.moveTo(p[0], p[1]); });
      cv.addEventListener('pointermove', function (e) { if (!drawing) return; var p = pos(e); ctx.lineTo(p[0], p[1]); ctx.stroke(); local.drawn = true; });
      cv.addEventListener('pointerup', function () { drawing = false; });
    }

    /* ── Events (delegated) ────────────────────────────────────────────── */
    function onAction(a, target) {
      var parts = a.split(':'), head = parts[0];
      switch (head) {
        case 'note': return parts[1] === 'sms' ? tapSms() : tapPush();
        case 'verify':
          if (parts[1] === 'dob') return submitDob(fieldValue('verify-dob'));
          if (parts[1] === 'code') return submitCode(fieldValue('verify-code').replace(/\D/g, ''));
          if (parts[1] === 'autofill') { var cf = el.querySelector('#verify-code'); if (cf) cf.value = S.verify.code; return sched.later(300, function () { submitCode(S.verify.code); }); }
          if (parts[1] === 'resend') { setV({ sentAt: Date.now(), error: '' }); return showToast(S.verify.resent); }
          if (parts[1] === 'help') return showToast(S.verify.callToast);
          return choosePasskey();
        case 'why': return openWhy(target);
        case 'call': return showToast(S.verify.callToast);
        case 'faq': return showToast(S.misc.notInDemo);
        case 'plan-link': return showToast(S.carePlan.linkToast);
        case 'june-ask-chat': return askJune('chat', +parts[1]);
        case 'june-ask-plan': return askJune('plan', +parts[1]);
        case 'june':
          if (parts[1] === 'close') return closeJune();
          if (parts[1] === 'send') { var ji = el.querySelector('#june-input'); var q = ji ? ji.value.trim() : ''; if (ji) ji.value = ''; var from = (P().modal && P().modal.props.from) || 'chat'; return askJune(from, null, q); }
          return;
        case 'menu':
          if (parts[1] === 'toggle') { setP({ menu: !P().menu }); if (P().menu) store.emit('menu:opened', {}); return; }
          if (parts[1] === 'messages') return openMessages('menu');
          setP({ menu: false }); return showToast(S.misc.notInDemo);
        case 'tab':
          if (parts[1] === 'home') return openHome();
          if (parts[1] === 'messages') return openMessages('tab');
          if (parts[1] === 'care' && F.careTab) return openCareTab();
          return setP({ view: parts[1], tab: parts[1], menu: false, sheet: null, modal: null });
        case 'greeting': return openMessages('greeting');
        case 'june-fab': return openMessages('fab');
        case 'june-chip': return askChip(+parts[1]);
        case 'step':
          if (parts[1] === 'message') return openMessages('checklist');
          if (parts[1] === 'plan') return openCarePlan();
          if (parts[1] === 'class') return startFirstStep();
          if (parts[1] === 'consent') {
            if (!st().documents.consent) return showToast(S.misc.consentLater);
            openMessages('checklist'); return openSign('consent');
          }
          return;
        case 'careplan':
          if (parts[1] === 'open') return openCarePlan();
          if (parts[1] === 'care') return openCareTab();
          if (parts[1] === 'close') return closeCarePlan();
          if (parts[1] === 'pdf') return downloadPdf();
          if (parts[1] === 'message') { closeSheet(); openMessages('careplan'); return setTimeout(focusComposer, 60); }
          return;
        case 'class': return startFirstStep();
        case 'sheet': return closeSheet();
        case 'about': return act.openSheet('patient', 'about');
        case 'attach':
          if (!parts[1]) return act.openSheet('patient', 'attach');
          if (parts[1] === 'library' || parts[1] === 'camera') return setP({ sheet: null, modal: { name: 'photos' } });
          if (parts[1] === 'remove') return setP({ composer: Object.assign({}, P().composer, { photo: null }) });
          return;
        case 'photo-pick': return pickPhoto(parts[1]);
        case 'photo-view': return setP({ modal: { name: 'photo', props: { id: parts[1] } } });
        case 'mic': return showToast(S.misc.voice);
        case 'modal': return P().modal && P().modal.name === 'article' ? closeArticle() : setP({ modal: null });
        case 'chip': return answer(parts[2]);
        case 'article': return openResource(+parts[1]);
        case 'doc': return showToast(S.misc.signedCopy);
        case 'sign':
          if (parts[1] === 'open') return openSign('consent');
          if (parts[1] === 'close') return closeSign();
          if (parts[1] === 'continue') return continueDisclosure();
          if (parts[1] === 'ask') { closeSign(); openMessages('sign'); setComposer(S.sign.askPrefill); var ta = el.querySelector('#patient-composer'); if (ta) { ta.value = S.sign.askPrefill; ta.focus(); } return; }
          if (parts[1] === 'next') { if (local.sign) { local.sign.guided = true; local.sign.target = nextTarget(local.sign); bumpSign(); scrollToField(); } return; }
          if (parts[1] === 'adopt') return openAdopt('type');
          if (parts[1] === 'finish') return finishSigning();
          if (parts[1] === 'email') return showToast(S.sign.emailToast);
          if (parts[1] === 'home') return openHome();
          return;
        case 'adopt':
          if (!local.sign || !local.sign.adopt) return;
          if (parts[1] === 'mode') { local.sign.adopt.mode = parts[2]; local.sign.adopt.error = null; local.drawn = false; return bumpSign(); }
          if (parts[1] === 'clear') { var cv = $overlay.querySelector('.adopt__canvas'); if (cv) cv.getContext('2d').clearRect(0, 0, cv.width, cv.height); local.drawn = false; return; }
          if (parts[1] === 'sign') return doAdopt();
          if (parts[1] === 'close') { local.sign.adopt = null; return bumpSign(); }
          return;
      }
    }
    listen('click', function (e) {
      local.looking = true; // any tap means Carol has her phone in hand
      var t = e.target.closest('[data-action]');
      if (!t || !el.contains(t)) return;
      if (t.matches('input')) return; // checkboxes handled on change
      if (t.type === 'submit' && t.getAttribute('data-action') === 'send') { e.preventDefault(); return send(); }
      e.preventDefault();
      onAction(t.getAttribute('data-action'), t);
    });
    listen('change', function (e) {
      var t = e.target;
      if (!local.sign) return;
      if (t.matches('input[name="esign"]')) { local.sign.esign = t.checked; local.sign.error = false; return bumpSign(); }
      var m = /^agree-(\d)$/.exec(t.name || '');
      if (m) { var sg = local.sign; sg.checked[+m[1]] = t.checked; sg.target = nextTarget(sg); bumpSign(); agreementsDone(sg); }
    });
    listen('input', function (e) {
      var t = e.target;
      if (t.id === 'patient-composer') { autoGrow(t); updateSend(); }
      if (t.id === 'verify-dob') { // forgiving input: digits only, the slashes fill in
        var d = t.value.replace(/\D/g, '').slice(0, 8);
        t.value = d.length > 4 ? d.slice(0, 2) + '/' + d.slice(2, 4) + '/' + d.slice(4) : d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d;
      }
      if (t.id === 'verify-code') {
        t.value = t.value.replace(/\D/g, '').slice(0, 6);
        if (t.value.length === 6) submitCode(t.value); // submits on its own after the 6th digit
      }
      if (t.name === 'signer' && local.sign && local.sign.adopt) {
        local.sign.adopt.name = t.value;
        var pv = $overlay.querySelector('[data-adopt-preview]'); if (pv) pv.textContent = t.value;
      }
    });
    listen('submit', function (e) {
      e.preventDefault();
      var form = e.target.getAttribute('data-form');
      if (form === 'june') return onAction('june:send', e.target);
      if (form) return onAction('verify:' + form, e.target);
      send();
    });

    /* ── Store wiring ──────────────────────────────────────────────────── */
    store.on('visit:sent', function () { if (P().view === 'lock') { setP({ notification: 'sms' }); store.emit('sms:shown', {}); } });
    /* Messages count as read only while Carol is looking. After an overnight (1 hour+) jump she has put the
       phone down, so replies wait as new until she opens the chat again. */
    ['june:message', 'care:message-sent', 'visit:sent'].forEach(function (ev) {
      store.on(ev, function () { if (P().view === 'messages' && local.looking) sched.later(0, markReadIfNeeded); });
    });
    store.on('time:jumped', function (p) {
      if (p.now - local.lastNow >= 3600e3) local.looking = false;
      local.lastNow = p.now;
    });
    function render() {
      var s = st();
      $status.innerHTML = C.StatusBar({ time: U.fmtClock(s.now), tone: s.patient.view === 'lock' ? 'light' : 'default' });
      var key = appKey(s);
      if (key !== local.appKey) { local.appKey = key; renderApp(s); } else updateApp(s);
      renderOverlay(s);
    }
    var unsubscribe = store.subscribe(render);
    el._twcUnmount = function () {
      listeners.forEach(function (l) { el.removeEventListener(l[0], l[1]); });
      unsubscribe(); clearInterval(local.resendTimer); clearTimeout(local.fabTimer); clearTimeout(local.toastTimer); el._twcUnmount = null;
    };
    render();

    return {
      tapSms: tapSms, tapPush: tapPush, showLock: showLock, openHome: openHome, openMessages: openMessages, openCarePlan: openCarePlan,
      startFirstStep: startFirstStep, closeSheet: closeSheet, typeMessage: typeMessage, send: send, answer: answer, askChip: askChip,
      openResource: openResource, closeArticle: closeArticle, attachPhoto: attachPhoto, openSign: openSign, acceptDisclosure: acceptDisclosure,
      completeAgreements: completeAgreements, adoptSignature: adoptSignature, finishSigning: finishSigning, closeSign: closeSign,
      enterDob: enterDob, enterCode: enterCode, choosePasskey: choosePasskey, openCareTab: openCareTab, openWhy: function () { openWhy(); }, closeCarePlan: closeCarePlan, askJune: askJune, closeJune: closeJune
    };
  }

  root.TWCPatient = { mount: mount, model: { headerStatus: headerStatus, firstNew: firstNew } };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.TWCPatient;
})(typeof window !== 'undefined' ? window : globalThis);
