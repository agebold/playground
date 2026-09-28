import { createRequire } from 'module';
import { readFileSync } from 'fs';
const require = createRequire(import.meta.url);
const T = require('./store.js');
let fails = 0;
const ok = (name, got, want) => { const p = JSON.stringify(got) === JSON.stringify(want);
  console.log((p ? 'PASS ' : 'FAIL ') + name + (p ? '' : `\n  got  ${JSON.stringify(got)}\n  want ${JSON.stringify(want)}`)); if (!p) fails++; };
const d = (m, day, h, min = 0) => new Date(2026, m, day, h, min);
const f = (sent, now = sent) => T.formatReplyBy(T.replyBy(sent), now);

ok('Tue 7:52 PM → Thu 8 PM', f(d(8,22,19,52)), 'Thu, Sep 24 at 8 PM');
ok('Fri 7:44 PM skips weekend → Tue', f(d(8,25,19,44)), 'Tue, Sep 29 at 8 PM');
ok('Sat 10 AM starts Monday → end of day Tue', f(d(8,26,10)), 'end of day Tue, Sep 29');
ok('Fri 11:59 PM rounds to midnight → end of day Tue', f(d(8,25,23,59)), 'end of day Tue, Sep 29');
ok('Thu 8 AM → Mon 8 AM', f(d(8,24,8)), 'Mon, Sep 28 at 8 AM');
ok('relative: seen Wed morning → tomorrow', f(d(8,22,19,52), d(8,23,8,2)), '8 PM tomorrow');
ok('relative: seen Thu → today', f(d(8,22,19,52), d(8,24,9)), '8 PM today');
ok('no weekend skip', T.replyBy(d(8,25,19,44), { skipWeekends: false }).getTime(), d(8,27,19,44).getTime());
ok('open Wed 10 AM', T.isOpen(d(8,23,10)), true);
ok('closed Wed 6:30 AM', T.isOpen(d(8,23,6,30)), false);
ok('closed Tue 7:52 PM', T.isOpen(d(8,22,19,52)), false);
ok('closed Sat noon', T.isOpen(d(8,26,12)), false);
ok('nextOpen Tue night → Wed 7 AM', T.nextOpen(d(8,22,19,52)).getTime(), d(8,23,7).getTime());
ok('readWhen Tue night', T.readWhen(d(8,22,19,52)), 'tomorrow morning');
ok('readWhen Fri night', T.readWhen(d(8,25,19,44)), 'Monday morning');
ok('readWhen Tue 3 AM', T.readWhen(d(8,22,3)), 'this morning');
ok('readWhen open', T.readWhen(d(8,23,10)), 'soon');

const lvl = (s) => (T.detectRedFlags(s) || {}).level || null;
ok('chest pain', lvl('I have CHEST PAIN'), 'emergency');
ok('belly to back', lvl('bad pain in my belly that goes to my back'), 'emergency');
ok('keep vomiting', lvl('I keep throwing up'), 'emergency');
ok('crisis wins', lvl('chest pain and I want to hurt myself'), 'crisis');
ok('back pain alone', lvl('My back hurts from gardening'), null);
ok('carol question', lvl('Is it okay to skip a day if I feel sick?'), null);

ok('topics carol', T.classifyTopics('The pharmacy gave me this. Is it okay to skip a day if I feel sick? And when is my next visit?'), ['appointments', 'side-effects', 'medication']);
ok('topics billing', T.classifyTopics('Why did my insurance charge me?'), ['billing']);
ok('topics none', T.classifyTopics('Thank you'), ['other']);
ok('esc', T.esc('<b onclick="x">&</b>'), '&lt;b onclick=&quot;x&quot;&gt;&amp;&lt;/b&gt;');

const st = T.createStore({ n: 1 }); let seen = 0; st.subscribe(() => seen++); st.set({ n: 2 });
ok('store set notifies', [st.getState().n, seen], [2, 1]);
let threw = false; try { st.emit('not:an:event'); } catch (e) { threw = true; }
ok('unknown event throws', threw, true);
T.sched.instant = true; let ran = 0; T.sched.later(5000, () => ran++); ok('sched instant runs now', ran, 1);

const st2 = T.createStore({ now: d(8,22,19,52), messages: [], tasks: [], documents: {}, readUpTo: {}, care: { role: 'cc' } });
const A = T.actions(st2);
const m1 = A.sendMessage({ author: 'patient', body: 'hi', clientId: 'c1' }); A.sendMessage({ author: 'patient', body: 'hi', clientId: 'c1' });
ok('double-tap guard', st2.getState().messages.length, 1);
ok('task due defaults to 48h promise', A.createTask({ sourceMessageId: m1.id, assignee: 'md' }).due.getTime(), d(8,24,19,52).getTime());
A.setRole('md'); ok('md lands on tasks', st2.getState().care.view, 'tasks');


// ── Task 5: store additions ──
const st3 = T.createStore({ now: d(8,22,19,52), messages: [], tasks: [], documents: {}, readUpTo: {}, care: { role: "cc" } });
const A3 = T.actions(st3); let careSent = 0, sysSent = 0;
st3.on("care:message-sent", () => careSent++); st3.on("system:event", () => sysSent++);
A3.sendMessage({ author: "system", kind: "record", audience: "care", body: "Carol opened your message" });
ok("system messages emit system:event, not care:message-sent", [careSent, sysSent], [0, 1]);
const q = A3.sendMessage({ author: "june", kind: "chips", body: "How do you feel?", meta: { question: "q1", answered: null } });
A3.updateMessage(q.id, { meta: { question: "q1", answered: "fine" } });
ok("updateMessage patches one message", st3.getState().messages.filter(m => m.id === q.id)[0].meta.answered, "fine");
ok("updateMessage keeps the others", st3.getState().messages.length, 2);


// ── Task 7: who read it ──
const st4 = T.createStore({ now: d(8,23,8,3), messages: [{ id: "m1", author: "patient", audience: "all", at: d(8,22,19,52) }], tasks: [], documents: {}, readUpTo: {}, care: { role: "cc" } });
T.actions(st4).markRead("care");
ok("markRead(care) records the reader role", [st4.getState().readUpTo.care.by, st4.getState().readUpTo.care.upTo], ["cc", "m1"]);

// ── Task 3: story, copy ──
const S = require('./story.js');
const ids = S.steps.map(s => s.id);
ok('unique step ids', new Set(ids).size, ids.length);
ok('every waitFor is a known event', S.steps.filter(s => !T.EVENTS.includes(s.waitFor)).map(s => s.id), []);
ok('chapters 1–6 in order', [...new Set(S.steps.map(s => s.chapter))], [1,2,3,4,5,6]);
ok('every chapter has a goal', S.chapters.filter(c => !c.goal).length, 0);
ok('captions ≤ 2 sentences', S.steps.filter(s => (s.caption.match(/(?<!\bDr)[.?!](\s|$)/g) || []).length > 2).map(s => s.id), []);
const juneLines = Object.values(S.june).flat().filter(x => typeof x === 'string');
ok('June avoids banned words', juneLines.filter(l => /\b(normal|common|will pass|don'?t worry|should)\b/i.test(l)), []);
ok('no emoji in copy', /\p{Extended_Pictographic}/u.test(JSON.stringify(S)), false);
ok('no ! in chat copy', [S.june, S.templates, S.carolQuestion, S.desaiReply, S.visitMessage].flatMap(x => JSON.stringify(x).match(/!/g) || []).length, 0);
ok('June sentences under 20 words', juneLines.filter(l => l.split(/[.?]\s/).some(sn => sn.trim().split(/\s+/).length > 20)), []);
ok('consent: 5 sections, 4 agreements', [S.consentDoc.sections.length, S.consentDoc.agreements.length], [5, 4]);
ok('promise copy says weekends', juneLines.some(l => /weekends don't count/i.test(l)), true);
ok('role is Care Advocate', /Care Advocate/.test(JSON.stringify(S)) && !/Care Coordinator/i.test(JSON.stringify(S)), true);
ok('no PCP in copy', /\bPCP\b|primary care (doctor|physician)|Dr\. Hayes/i.test(JSON.stringify(S)), false);

// ── Task 7: care-team model (intake card, triage, summary, task preview, templates) ──
require('./components.js');
const C = globalThis.C;
ok('Tab renders Phosphor icons for ph- names', /<i class="ph ph-check-square-offset"/.test(C.Tab({ key: 'tasks', iconName: 'ph-check-square-offset', label: 'Tasks' })), true);
ok('Tab badge says what it counts', [/3<span class="u-vh"> open<\/span>/.test(C.Tab({ key: 'tasks', iconName: 'chat', label: 'Tasks', badge: 3, badgeLabel: 'open' })),
  /1<span class="u-vh"> unread<\/span>/.test(C.Tab({ key: 'messages', iconName: 'chat', label: 'Messages', badge: 1 }))], [true, true]);
ok('care Tasks tab counts open tasks', S.care.tabs.filter(t => t.key === 'tasks')[0].badgeLabel, 'open');
const figOf = (html) => (html.match(/data-figma="([^"]+)"/) || [])[1];
ok('new care components name their Figma component', [
  figOf(C.TaskPrompt({ text: 'Reply sent. Mark this task done?', label: 'Mark done', action: 'task:done:t3', hint: 'care.task.done' })),
  figOf(C.TaskDetail({ tags: '', title: 'Skip a day if sick?', quoteMeta: 'Carol wrote · Tue 7:52 PM', quote: 'Is it okay?', cards: '', actions: '' })),
  figOf(C.SectionLabel({ text: 'Open' })), figOf(C.EmptyState({ text: 'No open tasks.' }))],
  ['Care/TaskPrompt', 'Care/TaskDetail', 'Care/SectionLabel', 'Care/EmptyState']);
ok('TaskDetail escapes the quoted message', /&lt;i&gt;hi&lt;\/i&gt;/.test(C.TaskDetail({ title: 't', quote: '<i>hi</i>' })), true);
const M = require('./care.js').model;
const st5 = T.createStore(S.initialState()); const A5 = T.actions(st5);
const careAs = (role) => st5.set({ care: Object.assign({}, st5.getState().care, { role }) });
A5.sendMessage({ author: 'md', kind: 'visit', body: S.visitMessage, meta: { carePlan: true } });
A5.jumpTime(d(8,22,19,40));
A5.sendMessage({ author: 'system', kind: 'event', audience: 'care', meta: { type: 'opened' }, body: 'Carol opened your message · 7:40 PM' });
A5.setChecklist('plan', true);
A5.jumpTime(d(8,22,19,44));
A5.sendMessage({ author: 'system', kind: 'event', audience: 'care', meta: { type: 'record', record: 'class' }, body: 'Carol started her first class · 7:44 PM' });
A5.jumpTime(d(8,22,19,52));
const q5 = A5.sendMessage({ author: 'patient', kind: 'text', body: S.carolQuestion, meta: { photo: 'rx' } });
A5.setIntake({ messageId: q5.id, at: q5.at, topics: T.classifyTopics(q5.body), stage: 'done', photo: 'rx', feel: 'fine', started: 'not-yet' });
ok('intake card rows (scripted question)', M.intakeRows(st5.getState()), [
  ['Questions', 'Right medicine? · Skip a day if sick? · Next visit?'], ['Attached', '1 photo — pharmacy bottle'],
  ['June answered', 'Next visit: Tue, Oct 20 at 10:30 AM'], ['Feeling now', 'Fine'], ['Started Foundayo', 'Not yet'],
  ['Red flags', 'None reported'], ['Protocol', 'Dose questions go to the provider.'], ['Promise to Carol', 'Reply by Thu, Sep 24 at 8 PM']]);
ok('triage: a dose question needs the provider', M.carolTags(st5.getState()), ['june', 'needs-provider', 'photo']);
A5.jumpTime(d(8,23,8,5)); careAs('cc');
ok('task preview names who replies and by when', M.taskPreview({ assign: 'md', due: 'promise', follow: 'chat', tell: true }, q5, st5.getState().now),
  'Carol will see: Dr. Desai will reply by 8 PM tomorrow.');
ok('task preview when Carol is not told', M.taskPreview({ assign: 'md', due: 'promise', follow: 'chat', tell: false }, q5, st5.getState().now),
  'Carol’s chat won’t show a change.');
const t5 = A5.createTask({ patientId: 'carol', patient: 'Carol Simmons', title: 'Skip a day if sick?', sourceMessageId: q5.id, assignee: 'md', createdBy: 'cc' });
ok('template fills the promise from the open task', M.fillTemplate('rx-confirmed', st5.getState()),
  'Hi Carol, this is Ali, your Care Advocate. Yes, that’s the right medicine. It matches Dr. Desai’s prescription. I asked Dr. Desai about skipping a day. She’ll reply here by 8 PM tomorrow.'.replace(/’/g, "'"));
A5.jumpTime(d(8,23,8,7));
A5.sendMessage({ author: 'cc', kind: 'text', body: 'Yes, that is the right medicine.' });
ok('triage: still needs the provider while her task is open', M.carolTags(st5.getState()), ['june', 'needs-provider', 'photo']);
A5.jumpTime(d(8,23,12,40)); careAs('md');
const sum5 = M.buildSummary(st5.getState());
ok('summary lines come from what happened', sum5.lines, [
  'Carol read your message and care plan on Tue at 7:40 PM.', 'She started her first class, Seated Strength (15 min).',
  'She asked if her new medicine is the right one. Ali confirmed it matches your prescription.',
  "She asked if it's okay to skip a day if she feels sick.", "She told June she feels fine and hasn't taken her first tablet."]);
ok('summary lists what needs the provider', sum5.needs, ['Answer: Skip a day if sick?', 'Consent form not signed yet.']);
ok('fresh summary is not stale', M.summaryIsStale(Object.assign({}, st5.getState(), { summary: sum5 })), false);
A5.jumpTime(d(8,23,12,46));
A5.sendMessage({ author: 'md', kind: 'text', body: 'Please don’t skip a dose on your own.' });
A5.completeTask(t5.id);
ok('summary goes stale after a new message', M.summaryIsStale(Object.assign({}, st5.getState(), { summary: sum5 })), true);
ok('triage: answered and done leaves no triage tag', M.carolTags(st5.getState()), ['june', 'photo']);
const st6 = T.createStore(S.initialState()); const A6 = T.actions(st6);
A6.jumpTime(d(8,22,19,52));
const q6 = A6.sendMessage({ author: 'patient', kind: 'text', body: 'Can I get a copy of my bill?' });
A6.setIntake({ messageId: q6.id, at: q6.at, topics: T.classifyTopics(q6.body), stage: 'q1', photo: null });
ok('intake card rows (off-script, June still asking)', M.intakeRows(st6.getState()), [
  ['Questions', '“Can I get a copy of my bill?”'], ['Attached', 'None'], ['June answered', '—'], ['Status', 'June is still asking Carol']]);
ok('triage: a billing question can wait', M.carolTags(st6.getState()), ['june', 'can-wait']);
ok('summary quotes an off-script question', M.buildSummary(st6.getState()).lines, ['She wrote: “Can I get a copy of my bill?”']);

// ── Task 8: story engine inputs ──
const uiSrc = ['components.js', 'patient.js', 'care.js'].map(f => readFileSync(new URL('./' + f, import.meta.url), 'utf8')).join('\n');
const dynamicHints = ['patient.tab.', 'care.tab.', 'care.row.', 'patient.chip.', 'patient.resource.', 'patient.step.'];
const allHints = S.steps.flatMap(s => [s.hint].concat(s.then || [])).filter(Boolean);
ok('every hint key exists in the UI code', allHints.filter(h => !dynamicHints.some(p => h.startsWith(p)) && !uiSrc.includes("'" + h + "'")), []);
ok('every step hint has a Next label', S.steps.filter(s => s.hint && !S.hintLabels[s.hint]).map(s => s.id), []);
ok('multi-tap steps guide every tap', ['3.1', '4.2', '4.4', '5.4', '6.3', '6.4', '6.5'].filter(id => !(S.steps.find(s => s.id === id).then || []).length), []);
ok('typing steps run from a tap', S.steps.filter(s => s.tapAuto).map(s => s.id), ['3.2', '5.3']);
ok('the story has a closing message', [typeof S.finale.title, typeof S.finale.caption, typeof S.sceneNext], ['string', 'string', 'string']);
ok('care device label names who is signed in', [S.deviceWho.cc, S.deviceWho.md].every(Boolean), true);
ok('consent tag guides one box at a time', (C.SignDocumentPage({ doc: S.consentDoc, checked: [true, false, false, false], signature: null, patientName: 'Carol Simmons',
  signLabel: 'Sign', target: 1, boxHint: 'patient.sign.box' }).match(/data-hint="patient\.sign\.box"/g) || []).length, 1);

// ── Task 9: Home progress + consent step ──
const prog = C.ChecklistProgress({ done: 5, total: 5, from: 80 });
ok('progress starts where Carol last saw it, then animates', [/--p:80%/.test(prog), /data-p="100%"/.test(prog)], [true, true]);
ok('progress without a start point renders its value', /--p:60%/.test(C.ChecklistProgress({ done: 3, total: 5 })), true);
ok('consent step says when the form is ready', typeof S.home.steps.filter(x => x.key === 'consent')[0].readyMeta, 'string');

ok('a step that just got done celebrates', [/is-fresh/.test(C.ChecklistStep({ state: 'done', title: 'Try your first class', fresh: true })),
  /is-fresh/.test(C.ChecklistStep({ state: 'done', title: 'Try your first class' }))], [true, false]);

// ── Task 10: CSS + component naming ──
const smallSizes = (css) => [...css.matchAll(/font(?:-size)?:\s*(?:(?:normal|italic|\d{3}|bold)\s+)*(\d+(?:\.\d+)?)px/g)].map(m => +m[1]).filter(px => px < 14);
ok('size checker catches small text', [smallSizes('a{font-size:12px}'), smallSizes('b{font:600 13px/20px Inter}'), smallSizes('c{font-size:16px}')], [[12], [13], []]);
const hexes = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '').match(/#[0-9a-fA-F]{3,8}\b/g) || [];
ok('hex checker catches raw colors', [hexes('a{color:#FFF}'), hexes('/* #fff */ a{color:var(--white)}')], [['#FFF'], []]);
for (const file of ['./tokens.css', './chat.css']) {
  const css = readFileSync(new URL(file, import.meta.url), 'utf8');
  ok(file + ': no text below 14px', smallSizes(css), []);
  if (file === './chat.css') ok(file + ': colors only via tokens', hexes(css), []);
}
const compSrc = readFileSync(new URL('./components.js', import.meta.url), 'utf8');
const compBodies = compSrc.split(/\n  function /).slice(1).filter(b => /^[A-Z]/.test(b));
ok('naming checker finds the components', compBodies.length >= 60, true);
ok('every component root names its Figma component', compBodies.filter(b => !/fig\(/.test(b)).map(b => b.split('(')[0]), []);
ok('every component is exported', compBodies.map(b => b.split('(')[0]).filter(n => typeof C[n] !== 'function'), []);

// ── Final review fixes ──
require('./june.js');
const juneWorld = () => {
  const st = T.createStore(S.initialState()), A = T.actions(st);
  T.sched.instant = true; globalThis.TWCJune.attach({ store: st, act: A, sched: T.sched });
  A.jumpTime(d(8,22,19,52)); return { st, A };
};
const said = (st, id) => { const ms = st.getState().messages, k = ms.findIndex(m => m.id === id); return ms.slice(k + 1).filter(m => m.author === 'june'); };
const tapChip = (st, A, value) => {
  const q = st.getState().messages.filter(m => m.kind === 'chips' && !m.meta.answered).pop();
  A.updateMessage(q.id, { meta: Object.assign({}, q.meta, { answered: value }) });
  A.sendMessage({ author: 'patient', kind: 'choice', body: value, meta: { question: q.meta.question, value } });
  st.emit('screen:answered', { q: q.meta.question, value });
};
{ const { st, A } = juneWorld();
  A.sendMessage({ author: 'patient', body: 'I have chest pain' });
  const q = A.sendMessage({ author: 'patient', body: S.carolQuestion, meta: { photo: 'rx' } });
  ok('a red flag first does not use up June’s screening', [said(st, q.id).filter(m => m.kind === 'chips').length, st.getState().intake.messageId === q.id, st.getState().intake.flag], [1, true, 'emergency']); }
{ const { st, A } = juneWorld();
  A.sendMessage({ author: 'patient', body: 'hello' }); tapChip(st, A, 'fine'); tapChip(st, A, 'not-yet');
  const q = A.sendMessage({ author: 'patient', body: S.carolQuestion });
  ok('a finished screening does not block the next question', [said(st, q.id).filter(m => m.kind === 'chips').length, st.getState().intake.messageId === q.id], [1, true]); }
{ const { st, A } = juneWorld();
  const q = A.sendMessage({ author: 'patient', body: S.carolQuestion }); tapChip(st, A, 'fine'); tapChip(st, A, 'not-yet');
  const r = A.sendMessage({ author: 'patient', body: 'Now I have chest pain' }); const i = st.getState().intake;
  ok('a red flag after the screening keeps June’s intake', [i.messageId === q.id, i.flag, i.flagMessageId === r.id], [true, 'emergency', true]); }
{ const { st, A } = juneWorld();
  const p = A.sendMessage({ author: 'patient', body: '', meta: { photo: 'rx' } });
  const photoReply = said(st, p.id).map(m => m.body), q = A.sendMessage({ author: 'patient', body: S.carolQuestion });
  ok('a photo alone waits for the question, then joins it', [photoReply, said(st, q.id).filter(m => m.kind === 'chips').length, st.getState().intake.photo], [[S.june.photoOnly], 1, 'rx']); }
{ const { st, A } = juneWorld();
  A.sendMessage({ author: 'patient', body: S.carolQuestion }); tapChip(st, A, 'very');
  const s = st.getState();
  ok('“Very sick” is marked for Ali, as June says', [s.intake.flag, M.carolTags(s).includes('urgent'), s.messages.some(m => m.audience === 'care' && m.meta && m.meta.type === 'urgent')], ['very-sick', true, true]); }
const routeRows = (body) => { const { st, A } = juneWorld(); A.sendMessage({ author: 'patient', body }); tapChip(st, A, 'fine'); tapChip(st, A, 'not-yet');
  return st.getState().messages.filter(m => m.kind === 'routing')[0].meta.rows; };
ok('routing names the parts Carol asked (scripted)', routeRows(S.carolQuestion).map(r => r.who), ['cc', 'md']);
ok('routing names the question Carol asked (off-script)', [routeRows('Can I get a copy of my bill?'), routeRows('Is nausea okay on this medicine?').map(r => r.who)],
  [[{ q: '“Can I get a copy of my bill?”', who: 'cc' }], ['md']]);
{ const { st, A } = juneWorld(); A.sendMessage({ author: 'patient', body: 'Can I get a copy of my bill?' });
  const chips = st.getState().messages.filter(m => m.kind === 'chips')[0];
  ok('June only says “other questions” after answering one', [chips.body.indexOf(S.june.askTwoPlain) === 0, chips.body.indexOf(S.june.askTwo) === -1], [true, true]); }
{ const html = C.RoutingCard({ rows: [{ q: 'Is this the right medicine?', label: 'Ali', image: 'images/ali.png' }], footHtml: 'Replies within 48 hours.', note: 'Ali reads it <tomorrow>.' });
  ok('routing card ends with the when-we-read line', [html.indexOf('Ali reads it') > html.indexOf('Is this the right medicine?'), /&lt;tomorrow&gt;/.test(html)], [true, true]); }
const chatCss = readFileSync(new URL('./chat.css', import.meta.url), 'utf8');
ok('mask icons are inlined, so they load when the file is opened from disk', [...chatCss.matchAll(/--m:\s*url\(([^)]*)\)/g)].map(m => m[1]).filter(u => !/^["']?data:/.test(u)), []);
const minH = (sel) => { const m = chatCss.match(new RegExp('\\n' + sel.replace('.', '\\.') + ' \\{[^}]*min-height: (\\d+)px')); return m ? +m[1] : null; };
ok('patient and care controls are at least 44px tall', ['.filter-pill', '.segmented__btn', '.adopt__clear'].map(minH), [44, 44, 44]);
ok('“Ask something else” only focuses the box', [S.juneChips[3].focus, 'answer' in S.juneChips[3]], [true, false]);

process.exit(fails ? 1 : 0);
