/* Two-way chat — clock, rules, shared state. Classic script; loads in Node for tests. */
(function (root) {
  'use strict';
  var config = { SLA_HOURS: 48, SKIP_WEEKENDS: true,
    HOURS: { days: [1, 2, 3, 4, 5], open: 7, close: 17, label: 'Mon–Fri, 7 AM–5 PM PT' } };
  var DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var DAYS_LONG = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function at(y, m, d, h, min) { return new Date(y, m, d, h || 0, min || 0); }
  function nextDay(t) { return new Date(t.getFullYear(), t.getMonth(), t.getDate() + 1); }
  function weekend(t) { var g = t.getDay(); return g === 0 || g === 6; }
  function sameDay(a, b) { return a.toDateString() === b.toDateString(); }

  // Elapsed hours where Saturday and Sunday don't count.
  function replyBy(sentAt, opts) {
    var o = opts || {}, hours = o.slaHours != null ? o.slaHours : config.SLA_HOURS;
    var skip = o.skipWeekends != null ? o.skipWeekends : config.SKIP_WEEKENDS;
    var t = new Date(sentAt.getTime()), left = hours * 3600e3;
    if (!skip) return new Date(t.getTime() + left);
    while (left > 0) {
      var n = nextDay(t);
      if (weekend(t)) { t = n; continue; }
      var chunk = Math.min(left, n - t); t = new Date(t.getTime() + chunk); left -= chunk;
    }
    return t;
  }
  function dayLabel(d, now) {
    if (sameDay(d, now)) return 'today';
    if (sameDay(d, nextDay(now))) return 'tomorrow';
    return DAYS[d.getDay()] + ', ' + MONTHS[d.getMonth()] + ' ' + d.getDate();
  }
  function hourLabel(d) { var h = d.getHours(); return (h % 12 || 12) + (h < 12 ? ' AM' : ' PM'); }
  function formatReplyBy(deadline, now) {
    var d = new Date(deadline.getTime());
    if (d.getMinutes() || d.getSeconds() || d.getMilliseconds()) { d.setMinutes(0, 0, 0); d.setHours(d.getHours() + 1); }
    if (d.getHours() === 0) return 'end of day ' + dayLabel(new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1), now);
    var day = dayLabel(d, now);
    return day === 'today' || day === 'tomorrow' ? hourLabel(d) + ' ' + day : day + ' at ' + hourLabel(d);
  }
  function isOpen(now) { var H = config.HOURS, h = now.getHours();
    return H.days.indexOf(now.getDay()) >= 0 && h >= H.open && h < H.close; }
  function nextOpen(now) { var t = new Date(now.getTime());
    for (var i = 0; i < 24 * 8 && !isOpen(t); i++) t = new Date(t.getFullYear(), t.getMonth(), t.getDate(), t.getHours() + 1);
    return t; }
  function readWhen(now) {
    if (isOpen(now)) return 'soon';
    var o = nextOpen(now);
    if (sameDay(o, now)) return 'this morning';
    if (sameDay(o, nextDay(now))) return 'tomorrow morning';
    return DAYS_LONG[o.getDay()] + ' morning';
  }

  var FLAGS = [
    { level: 'crisis', re: /\b(kill(ing)? myself|suicid\w*|end(ing)? my life|hurt(ing)? myself|self[- ]?harm)\b/i },
    { level: 'emergency', re: /\b(chest pain|can'?t breathe|cannot breathe|trouble breathing|short(ness)? of breath|pass(ed)? out|faint(ed|ing)?|seizure|stroke)\b/i },
    { level: 'emergency', re: /\b(belly|stomach|abdomen|abdominal|tummy)\b[^.?!]{0,60}\bback\b/i },
    { level: 'emergency', re: /\b(severe|really bad|worst)\b[^.?!]{0,20}\b(belly|stomach|abdominal|tummy) pain\b/i },
    { level: 'emergency', re: /\b(keep|kept|can'?t stop|won'?t stop)\b[^.?!]{0,20}\b(throwing up|vomit\w*)\b/i }
  ];
  function detectRedFlags(text) {
    var s = String(text || ''), hit = null;
    for (var i = 0; i < FLAGS.length; i++) { var m = s.match(FLAGS[i].re);
      if (m && FLAGS[i].level === 'crisis') return { level: 'crisis', match: m[0] };
      if (m && !hit) hit = { level: 'emergency', match: m[0] }; }
    return hit;
  }
  var TOPICS = [
    ['appointments', /\b(appointment|next visit|reschedul\w*|move my visit|cancel my visit)\b/i],
    ['billing', /\b(bill\w*|insurance|cost|price|pay(ment)?|copay|charg\w*)\b/i],
    ['labs', /\b(labs?|blood tests?|results?)\b/i],
    ['side-effects', /\b(nause\w*|sick|vomit\w*|constipat\w*|diarrhea|heartburn)\b/i],
    ['medication', /\b(dose|doses|dosing|tablet|pill|medicine|medication|refill|foundayo|skip|pharmacy)\b/i]
  ];
  function classifyTopics(text) { var out = TOPICS.filter(function (t) { return t[1].test(text || ''); })
    .map(function (t) { return t[0]; }); return out.length ? out : ['other']; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }

  var timers = [];
  var sched = { instant: false,
    later: function (ms, fn) { if (sched.instant) { fn(); return 0; } var id = setTimeout(fn, ms); timers.push(id); return id; },
    clear: function () { timers.forEach(clearTimeout); timers = []; } };

  var EVENTS = Object.freeze(['visit:sent','sms:shown','patient:home-opened','patient:thread-opened','patient:read',
    'careplan:opened','careplan:closed','class:started','photo:attached','composer:filled','patient:message-sent',
    'june:message','screen:asked','screen:answered','screen:done','resources:shown','article:opened','article:closed',
    'care:role-changed','care:thread-opened','care:message-sent','care:read','task:sheet-opened','task:created',
    'care:tasks-opened','task:opened','summary:ready','template:used','doc:attached','task:done','push:shown',
    'sign:opened','sign:disclosure-accepted','sign:agreements-done','sign:signature-adopted','doc:signed',
    'sign:closed','time:jumped','photo:saved','menu:opened','system:event',
    'verify:started','verify:dob-ok','verify:code-ok','caretab:opened','careplan:why','june:opened','june:closed']);

  function createStore(initial) {
    var state = initial, subs = [], handlers = {};
    return {
      getState: function () { return state; },
      set: function (patch) { state = Object.assign({}, state, patch); subs.slice().forEach(function (f) { f(state); }); },
      subscribe: function (f) { subs.push(f); return function () { subs = subs.filter(function (g) { return g !== f; }); }; },
      on: function (ev, f) { (handlers[ev] = handlers[ev] || []).push(f);
        return function () { handlers[ev] = handlers[ev].filter(function (g) { return g !== f; }); }; },
      emit: function (ev, p) { if (EVENTS.indexOf(ev) < 0) throw new Error('Unknown event: ' + ev);
        (handlers[ev] || []).slice().forEach(function (f) { f(p); }); }
    };
  }
  function actions(store) {
    var n = 0;
    function S() { return store.getState(); }
    function patch(side, p) { var o = {}; o[side] = Object.assign({}, S()[side], p); store.set(o); }
    function docs(id, p) { var d = Object.assign({}, S().documents); d[id] = Object.assign({}, d[id], p); store.set({ documents: d }); }
    return {
      sendMessage: function (msg) {
        var s = S();
        if (msg.clientId && s.messages.some(function (m) { return m.clientId === msg.clientId; })) return null;
        var m = Object.assign({ id: 'm' + (++n), at: s.now, audience: 'all', kind: 'text' }, msg);
        store.set({ messages: s.messages.concat([m]) });
        store.emit(m.author === 'patient' ? 'patient:message-sent' : m.author === 'june' ? 'june:message'
          : m.author === 'system' ? 'system:event' : m.kind === 'visit' ? 'visit:sent' : 'care:message-sent', m);
        return m;
      },
      updateMessage: function (id, p) {
        store.set({ messages: S().messages.map(function (m) { return m.id === id ? Object.assign({}, m, p) : m; }) });
      },
      setTyping: function (who, on) { var t = Object.assign({}, S().typing); t[who] = !!on; store.set({ typing: t }); },
      setPresence: function (who, what) { var p = Object.assign({}, S().presence); p[who] = what || null; store.set({ presence: p }); },
      markRead: function (side) {
        var s = S(), last = s.messages.length ? s.messages[s.messages.length - 1].id : null;
        var r = Object.assign({}, s.readUpTo); r[side] = { upTo: last, at: s.now, by: side === 'care' ? s.care.role : 'patient' }; store.set({ readUpTo: r });
        store.emit(side === 'patient' ? 'patient:read' : 'care:read', r[side]);
      },
      setExpectation: function (e) { store.set({ expectation: e }); },
      setIntake: function (i) { store.set({ intake: Object.assign({}, S().intake, i) }); },
      createTask: function (t) {
        var s = S(), src = s.messages.filter(function (m) { return m.id === t.sourceMessageId; })[0];
        var task = Object.assign({ id: 't' + (s.tasks.length + 1), status: 'open', createdAt: s.now, createdBy: s.care.role,
          due: replyBy(src ? src.at : s.now) }, t);
        store.set({ tasks: s.tasks.concat([task]) }); store.emit('task:created', task); return task;
      },
      completeTask: function (id) {
        var now = S().now;
        store.set({ tasks: S().tasks.map(function (t) { return t.id === id ? Object.assign({}, t, { status: 'done', doneAt: now }) : t; }) });
        store.emit('task:done', { id: id });
      },
      sendDocument: function (id) { docs(id, { status: 'sent', sentAt: S().now }); },
      openDocument: function (id) { var cur = S().documents[id];
        docs(id, { status: cur && cur.status === 'signed' ? 'signed' : 'opened' }); store.emit('sign:opened', { id: id }); },
      signDocument: function (id, sig) { docs(id, { status: 'signed', signedAt: S().now, signature: sig }); store.emit('doc:signed', { id: id }); },
      setSummary: function (sum) { store.set({ summary: sum }); store.emit('summary:ready', sum); },
      setChecklist: function (key, done) { var c = Object.assign({}, S().checklist); c[key] = done; store.set({ checklist: c }); },
      setRole: function (role) { patch('care', { role: role, view: role === 'md' ? 'tasks' : 'inbox', sheet: null });
        store.emit('care:role-changed', { role: role }); },
      jumpTime: function (date) { store.set({ now: date }); store.emit('time:jumped', { now: date }); },
      setView: function (side, view, extra) { patch(side, Object.assign({ view: view }, extra)); },
      openSheet: function (side, name, props) { patch(side, { sheet: { name: name, props: props || {} } }); },
      closeSheet: function (side) { patch(side, { sheet: null }); }
    };
  }

  var TWC = { config: config, at: at, replyBy: replyBy, formatReplyBy: formatReplyBy, isOpen: isOpen,
    nextOpen: nextOpen, readWhen: readWhen, detectRedFlags: detectRedFlags, classifyTopics: classifyTopics,
    esc: esc, sched: sched, EVENTS: EVENTS, createStore: createStore, actions: actions };
  root.TWC = TWC;
  if (typeof module !== 'undefined' && module.exports) module.exports = TWC;
})(typeof window !== 'undefined' ? window : globalThis);
