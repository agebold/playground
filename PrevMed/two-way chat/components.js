/* Two-way care team chat — component library.
   One render function per Figma component (PascalCase = component). Each returns an HTML string whose
   root carries data-figma="<Figma component name>" and data-variant="<Figma variant string>".
   Helpers are lowerCamelCase. All user-visible text passes through esc(). No screen logic here. */
(function (root) {
  'use strict';
  var esc = root.TWC.esc;

  /* ── helpers ─────────────────────────────────────────────────────────── */
  var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function fmtTime(d) { var h = d.getHours(), m = d.getMinutes(); return (h % 12 || 12) + ':' + (m < 10 ? '0' : '') + m + ' ' + (h < 12 ? 'AM' : 'PM'); }
  function fmtClock(d) { var h = d.getHours(), m = d.getMinutes(); return (h % 12 || 12) + ':' + (m < 10 ? '0' : '') + m; }
  function fmtDay(d) { return DAYS[d.getDay()] + ', ' + MONTHS[d.getMonth()] + ' ' + d.getDate(); }
  function fmtStamp(d) { return DAYS[d.getDay()] + ' ' + fmtTime(d); }
  function cap(s) { s = String(s); return s.charAt(0).toUpperCase() + s.slice(1); }
  function clip(text, n) { var t = String(text || '').replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n - 1).trim() + '…' : t; }
  function fig(name, variant) { return ' data-figma="' + name + '"' + (variant ? ' data-variant="' + variant + '"' : ''); }
  function hintAttr(h) { return h ? ' data-hint="' + h + '"' : ''; }
  function actAttr(a) { return a ? ' data-action="' + a + '"' : ''; }
  function ph(name, weight) { return '<i class="ph' + (weight ? '-' + weight : '') + ' ' + name + '" aria-hidden="true"></i>'; }
  /* Figma / DS SVGs as masks, so they take currentColor (active tab, white on blue). */
  function mask(name, size) { return '<span class="mask-icon mask-icon--' + name + ' mask-icon--' + (size || 24) + '" aria-hidden="true"></span>'; }
  function icon(spec, size) {
    if (!spec) return '';
    if (spec.indexOf('ph-') === 0) return ph(spec);
    return mask(spec, size);
  }
  function join(list, fn) { return (list || []).map(fn).join(''); }
  /* DOM helpers (screens only). Pin a chat log to its newest message, also after images finish loading. */
  function stickToBottom(log) {
    log.scrollTop = log.scrollHeight;
    Array.prototype.forEach.call(log.querySelectorAll('img'), function (img) {
      if (!img.complete) img.addEventListener('load', function () { log.scrollTop = log.scrollHeight; }, { once: true });
    });
  }
  /* Scroll `target` into view inside `scroller` only (never the page), correcting for the phone's scale. */
  function reveal(scroller, target, smooth) {
    if (!scroller || !target) return;
    var r = scroller.getBoundingClientRect(), t = target.getBoundingClientRect(), k = (r.height / scroller.clientHeight) || 1;
    var top = scroller.scrollTop + (t.top - r.top) / k - 12, bottom = top + t.height / k + 24, view = scroller.clientHeight;
    var next = top < scroller.scrollTop ? top : bottom > scroller.scrollTop + view ? Math.min(top, bottom - view) : null;
    if (next !== null) scroller.scrollTo({ top: Math.max(0, next), behavior: smooth ? 'smooth' : 'auto' });
  }
  /* Escapes text and highlights "Weekends don't count" wherever the reply promise appears. */
  function weekends(text) {
    var s = String(text), i = s.indexOf("Weekends don't count");
    return i < 0 ? esc(s) : esc(s.slice(0, i)) + '<span class="weekends">' + esc(s.slice(i)) + '</span>';
  }

  /* ── Foundations / device ────────────────────────────────────────────── */
  function StatusBar(p) {
    var tone = p.tone || 'default';
    return '<div class="status-bar status-bar--' + tone + '"' + fig('Status Bar - iPhone', 'Tone=' + cap(tone)) + '>' +
      '<span class="status-bar__time type-status-time">' + esc(p.time) + '</span>' +
      '<span class="status-bar__icons" aria-hidden="true">' +
        '<img src="images/figma/status-signal.svg" alt="" width="19" height="12">' +
        '<img src="images/figma/status-wifi.svg" alt="" width="17" height="12">' +
        '<span class="status-bar__battery">' +
          '<img class="status-bar__battery-outline" src="images/figma/status-battery-outline.svg" alt="" width="25" height="13">' +
          '<img class="status-bar__battery-fill" src="images/figma/status-battery-fill.svg" alt="" width="20" height="8">' +
          '<img class="status-bar__battery-cap" src="images/figma/status-battery-cap.svg" alt="" width="1.5" height="4.5">' +
        '</span></span></div>';
  }

  /* ── Member Dashboard (MD) components ────────────────────────────────── */
  function Avatar(p) {
    var size = p.size || 44;
    if (p.image) {
      return '<img class="avatar avatar--' + size + (p.ring ? ' avatar--ring' : '') + '"' + fig('Avatar', 'Size=' + size + ', Image=Yes') +
        ' src="' + p.image + '" alt="' + esc(p.alt || '') + '" width="' + size + '" height="' + size + '">';
    }
    return '<span class="avatar avatar--' + size + ' avatar--' + (p.color || 'purple') + (p.ring ? ' avatar--ring' : '') + '"' +
      fig('Avatar', 'Size=' + size + ', Image=No') + ' aria-hidden="true">' + esc(p.initials || '') + '</span>';
  }

  function AvatarStack(p) {
    return '<span class="avatar-stack"' + fig('AvatarStack', 'Count=' + p.people.length) + ' aria-hidden="true">' +
      join(p.people, function (x) {
        return x.orb ? '<span class="avatar-stack__orb">' + JuneOrb({ size: p.size || 32 }) + '</span>'
          : Avatar({ image: x.image, initials: x.initials, size: p.size || 32, ring: true });
      }) + '</span>';
  }

  function NavHeader(p) {
    return '<header class="nav-header"' + fig('Post-Auth Website Navigation Header', 'Menu=' + (p.menuOpen ? 'Open' : 'Closed')) + '>' +
      '<span class="nav-header__logo" role="img" aria-label="Bold">' +
        '<img src="images/figma/logo-lines.svg" alt="" width="36" height="36">' +
        '<img src="images/figma/logo-text.svg" alt="" width="76" height="21">' +
      '</span>' +
      '<button type="button" class="nav-header__profile" data-action="menu:toggle" data-hint="patient.menu" aria-haspopup="menu" aria-expanded="' +
        (p.menuOpen ? 'true' : 'false') + '" aria-label="Account menu' + (p.badge ? ', ' + p.badge + ' new message' : '') + '">' +
        '<span class="nav-header__avatar">' + Avatar({ initials: p.initials, size: 48 }) +
          (p.badge ? '<span class="nav-header__dot" aria-hidden="true"></span>' : '') + '</span>' +
        '<span class="nav-header__carrot' + (p.menuOpen ? ' is-open' : '') + '">' + mask('carrot', 24) + '</span>' +
      '</button>' +
      (p.menuOpen ? AccountMenu({ items: p.menuItems, unread: p.badge }) : '') +
    '</header>';
  }

  function AccountMenu(p) {
    return '<div class="account-menu" role="menu"' + fig('Nav/AccountMenu') + '>' +
      join(p.items, function (it) {
        return '<button type="button" role="menuitem" class="account-menu__item" data-action="menu:' + it.key + '"' +
          (it.key === 'messages' ? ' data-hint="patient.menu.messages"' : '') + '>' +
          mask('ds-' + it.key, 20) + '<span class="type-body-bold">' + esc(it.label) + '</span>' +
          (it.key === 'messages' && p.unread ? Tag({ color: 'purple100', label: p.unread + ' new' }) : '') +
        '</button>';
      }) + '</div>';
  }

  function TabBar(p) {
    return '<nav class="tab-bar tab-bar--' + p.tabs.length + '" aria-label="' + esc(p.label || 'Main') + '"' +
      fig('Navigation - Mobile Web App', 'Tabs=' + p.tabs.length) + '>' +
      join(p.tabs, function (t) {
        return Tab({ key: t.key, iconName: t.iconName, size: t.size, label: t.label, active: p.active === t.key,
          badge: (p.badges || {})[t.key], badgeLabel: t.badgeLabel, hintPrefix: p.hintPrefix, actionPrefix: p.actionPrefix });
      }) + '</nav>';
  }

  function Tab(p) {
    return '<button type="button" class="tab' + (p.active ? ' is-active' : '') + '" data-action="' + (p.actionPrefix || 'tab') + ':' + p.key + '"' +
      hintAttr((p.hintPrefix || 'patient.tab') + '.' + p.key) + (p.active ? ' aria-current="page"' : '') +
      fig('Navigation - Mobile Web App/Tab', 'Active=' + (p.active ? 'Yes' : 'No') + ', Badge=' + (p.badge ? 'Count' : 'None')) + '>' +
      '<span class="tab__icon">' + icon(p.iconName, p.size || 24) +
        (p.badge ? '<span class="tab__badge"><span class="u-vh">, </span>' + p.badge + '<span class="u-vh"> ' + esc(p.badgeLabel || 'unread') + '</span></span>' : '') + '</span>' +
      '<span class="tab__label type-caption-1-bold">' + esc(p.label) + '</span></button>';
  }

  function Greeting(p) {
    return '<div class="greeting"' + fig('Home/Greeting') + '>' +
      '<h2 class="type-greeting greeting__title">' + esc(p.title) + '</h2>' +
      '<p class="type-body greeting__sub">' + esc(p.sub) + ' ' +
        (p.link ? '<button type="button" class="greeting__link type-body-bold"' + actAttr(p.linkAction) + hintAttr(p.linkHint) + '>' + esc(p.link) + '</button>' : '') +
      '</p></div>';
  }

  function SectionTitle(p) {
    return '<h3 class="section-title type-title"' + fig('Home/SectionTitle') + '>' + esc(p.text) + '</h3>';
  }

  /* `from` (a percent) renders the bar where the member last saw it; the screen then animates it to `data-p`. */
  function ChecklistProgress(p) {
    var pct = p.total ? Math.round((100 * p.done) / p.total) : 0, start = p.from != null ? p.from : pct;
    return '<div class="progress" role="progressbar" aria-label="Steps done" aria-valuemin="0" aria-valuemax="' + p.total +
      '" aria-valuenow="' + p.done + '"' + fig('Checklist/Progress', 'Done=' + p.done + ' of ' + p.total) + ' style="--p:' + start + '%"' +
      (p.from != null ? ' data-p="' + pct + '%"' : '') + '>' +
      '<span class="progress__track"></span><span class="progress__fill"></span>' +
      '<span class="progress__marker" aria-hidden="true">✓</span>' +
      '<img class="progress__end" src="images/figma/progress-end.svg" alt="" width="30" height="30"></div>';
  }

  function ChecklistStep(p) {
    var state = p.state || 'todo';
    if (state === 'done') {
      return '<div class="step step--done' + (p.fresh ? ' is-fresh' : '') + '"' + fig('Checklist/Step', 'State=Done') + '>' +
        '<span class="step__icon step__icon--done" aria-hidden="true">✓</span>' +
        '<span class="type-body-bold step__title">' + esc(p.title) + '<span class="u-vh">, done</span></span></div>';
    }
    var lead = state === 'callout'
      ? '<img class="step__stepper" src="' + p.stepper + '" alt="" width="40" height="40">'
      : '<span class="step__icon">' + icon(p.iconName, 22) + '</span>';
    return '<button type="button" class="step step--' + state + (p.fresh ? ' is-fresh' : '') + '"' + actAttr('step:' + p.key) + hintAttr(p.hint) +
      fig('Checklist/Step', 'State=' + (state === 'callout' ? 'Callout' : 'To do')) + '>' + lead +
      '<span class="type-body-bold step__title">' + esc(p.title) + '</span>' +
      (p.meta ? '<span class="type-caption-1 step__meta">' + esc(p.meta) + '</span>' : '') +
      mask('chevron-step', 16) + '</button>';
  }

  function ChecklistModule(p) {
    return '<section class="checklist" aria-label="' + esc(p.title) + '"' + fig('Checklist/Module', 'Phase=After visit') + '>' +
      '<div class="checklist__head"><h3 class="type-serif-headline checklist__title">' + esc(p.title) + '</h3>' +
        '<span class="checklist__chevron">' + mask('chevron-module', 16) + '</span></div>' +
      ChecklistProgress({ done: p.done, total: p.total, from: p.progressFrom }) +
      '<p class="type-body checklist__help">' + esc(p.help) + '</p>' +
      '<div class="checklist__steps">' + join(p.steps, ChecklistStep) + '</div></section>';
  }

  function PositionTag(p) {
    return '<span class="position-tag type-caption-1-bold"' + fig('Position Tag') + '>' + esc(p.label) + '</span>';
  }

  function ClassCard(p) {
    return '<article class="class-card' + (p.started ? ' is-started' : '') + '"' + fig('Class (Web, Tablet Breakpoints)', 'CTA=' + (p.cta ? 'Yes' : 'No')) + '>' +
      '<div class="class-card__media"><img src="' + p.img + '" alt="" width="324" height="182">' +
        '<span class="class-card__timeline" aria-hidden="true"><span class="class-card__timeline-fill"></span></span></div>' +
      '<div class="class-card__meta">' +
        '<div class="class-card__main"><div class="class-card__details">' +
          '<h4 class="type-body-bold class-card__title">' + esc(p.title) + '</h4>' +
          '<p class="type-caption-1 class-card__trainer">' + esc(p.trainer) + '</p></div>' +
          '<button type="button" class="class-card__more" aria-label="More options for this class">' + mask('dots-three', 16) + '</button></div>' +
        '<div class="class-card__tags">' + join(p.tags, function (t) { return PositionTag({ label: t }); }) + '</div>' +
        (p.cta ? Button({ variant: 'primary', full: true, label: p.cta, action: p.ctaAction, hint: p.ctaHint }) : '') +
        (p.change ? '<p class="class-card__change type-caption-1">' + esc(p.change) + ' ' + ph('ph-arrows-clockwise') + '</p>' : '') +
      '</div></article>';
  }

  function JuneOrb(p) {
    var size = p.size || 46;
    return '<span class="june-orb june-orb--' + size + '"' + fig('June Orb', 'Size=' + size) + ' aria-hidden="true">' +
      '<img src="images/figma/june-orb-ai-round.svg" alt=""></span>';
  }

  function JuneChip(p) {
    return '<button type="button" class="june-chip"' + actAttr(p.action) + hintAttr(p.hint) +
      fig('Chat with June — Entry Card/Chip', 'State=Default') + '><span class="june-chip__text type-caption-1-bold">' + esc(p.label) + '</span></button>';
  }

  function JuneEntryCard(p) {
    return '<section class="june-card" aria-label="' + esc(p.title) + '"' + fig('Chat with June — Entry Card') + '>' +
      '<div class="june-card__head">' + JuneOrb({ size: 46 }) +
        '<div class="june-card__text"><h3 class="type-june-title june-card__title">' + esc(p.title) + '</h3>' +
        '<p class="type-caption-1 june-card__body">' + esc(p.body) + '</p></div></div>' +
      '<div class="june-card__chips">' + join(p.chips, function (c, i) { return JuneChip({ label: c.label, action: 'june-chip:' + i }); }) + '</div>' +
    '</section>';
  }

  function JuneFab(p) {
    var collapsed = p.state === 'collapsed';
    return '<button type="button" class="june-fab' + (collapsed ? ' is-collapsed' : '') + '" data-action="june-fab" aria-label="' + esc(p.label) + '"' +
      fig('FAB — Chat with June', 'State=' + (collapsed ? 'Collapsed' : 'Expanded')) + '>' +
      '<span class="june-fab__inner">' + JuneOrb({ size: 46 }) + '<span class="june-fab__label type-body-bold">' + esc(p.label) + '</span></span></button>';
  }

  function Placeholder(p) {
    return '<div class="placeholder"' + fig('Home/Placeholder') + '><h2 class="type-title">' + esc(p.title) + '</h2>' +
      '<p class="type-body placeholder__body">' + esc(p.body) + '</p></div>';
  }

  /* ── @bold/web (DS) components ───────────────────────────────────────── */
  function Button(p) {
    var v = p.variant || 'primary', s = p.size || 'medium';
    return '<button type="' + (p.submit ? 'submit' : 'button') + '" class="btn btn--' + v + ' btn--' + s + (p.full ? ' btn--full' : '') + '"' +
      actAttr(p.action) + hintAttr(p.hint) + (p.disabled ? ' disabled' : '') + (p.ariaLabel ? ' aria-label="' + esc(p.ariaLabel) + '"' : '') +
      fig('Button', 'Variant=' + cap(v) + ', Size=' + cap(s)) + '>' + (p.icon ? icon(p.icon, 20) : '') +
      '<span>' + esc(p.label) + '</span></button>';
  }

  function Tag(p) {
    return '<span class="tag tag--' + (p.color || 'purple100') + ' type-caption-1-bold"' + fig('Tag', 'Color=' + cap(p.color || 'purple100')) + '>' +
      (p.icon ? ph(p.icon, 'bold') : '') + esc(p.label) + '</span>';
  }

  function AiChip() {
    return '<span class="ai-chip type-caption-1-bold"' + fig('Tag/AI') + '>AI<span class="u-vh">, automated assistant</span></span>';
  }

  function TextWithShield(p) {
    return '<p class="text-with-shield type-caption-1"' + fig('TextWithShield') + '>' + ph('ph-shield-check') + '<span>' + esc(p.text) + '</span></p>';
  }

  function Checkbox(p) {
    return '<label class="checkbox' + (p.required && !p.checked ? ' is-required' : '') + '"' + fig('Input/Checkbox', 'Checked=' + (p.checked ? 'Yes' : 'No')) + hintAttr(p.hint) + '>' +
      '<input type="checkbox" class="checkbox__input"' + (p.checked ? ' checked' : '') + (p.name ? ' name="' + p.name + '"' : '') +
        (p.describedBy ? ' aria-describedby="' + p.describedBy + '"' : '') + actAttr(p.action) + '>' +
      '<span class="checkbox__box" aria-hidden="true">' + ph('ph-check', 'bold') + '</span>' +
      '<span class="checkbox__label type-body">' + esc(p.label) + '</span></label>';
  }

  function Radio(p) {
    return '<label class="radio"' + fig('Input/Radio', 'Checked=' + (p.checked ? 'Yes' : 'No')) + '>' +
      '<input type="radio" class="radio__input" name="' + p.name + '" value="' + esc(p.value) + '"' + (p.checked ? ' checked' : '') + '>' +
      '<span class="radio__dot" aria-hidden="true"></span><span class="radio__label type-body">' + esc(p.label) + '</span></label>';
  }

  /* ── Chat components (patient + care) ────────────────────────────────── */
  function ChatHeader(p) {
    return '<div class="chat-header chat-header--' + p.side + '"' + fig('Chat/Header', 'Side=' + cap(p.side)) + '>' +
      (p.back ? '<button type="button" class="icon-btn" data-action="' + p.back + '" aria-label="Back">' + ph('ph-caret-left') + '</button>' : '') +
      (p.people ? AvatarStack({ people: p.people, size: 32 }) : '') + (p.lead || '') +
      '<div class="chat-header__text"><h2 class="type-body-bold chat-header__title">' + esc(p.title) + '</h2>' +
        (p.sub ? '<p class="type-caption-1 chat-header__sub">' + esc(p.sub) + '</p>' : '') + '</div>' +
      (p.actions || '') + '</div>';
  }

  var STRIP_STATES = { idle: 'Idle', 'with-team': 'WithTeam', reading: 'Reading', typing: 'Typing', 'with-provider': 'WithProvider', resolved: 'Resolved' };
  function StatusStrip(p) {
    return '<div class="status-strip status-strip--' + p.state + '"' + fig('Chat/StatusStrip', 'State=' + STRIP_STATES[p.state]) + '>' +
      '<span class="status-strip__lead">' + (p.avatar || ph('ph-clock')) + '</span>' +
      '<div class="status-strip__text"><p class="type-body-bold status-strip__title">' + esc(p.title) +
        (p.state === 'typing' ? '<span class="status-strip__dots" aria-hidden="true"><span></span><span></span><span></span></span>' : '') + '</p>' +
        (p.sub || p.weekends ? '<p class="type-caption-1 status-strip__sub">' + esc(p.sub || '') +
          (p.weekends ? ' <span class="weekends">' + esc(p.weekends) + '</span>' : '') + '</p>' : '') +
      '</div></div>';
  }

  var LABEL_SENDERS = { june: 'June', cc: 'CareAdvocate', md: 'Provider', patient: 'Patient' };
  function MessageLabel(p) {
    var av = p.sender === 'june' ? JuneOrb({ size: 24 }) : Avatar({ image: p.image, initials: p.initials, size: 24 });
    return '<div class="msg-label msg-label--' + p.sender + (p.align === 'right' ? ' msg-label--right' : '') + '"' +
      fig('Chat/MessageLabel', 'Sender=' + LABEL_SENDERS[p.sender]) + '>' + av +
      '<span class="type-caption-1-bold msg-label__name">' + esc(p.name) + '</span>' +
      (p.sender === 'june' ? AiChip() : '') +
      (p.role ? '<span class="type-caption-1 msg-label__role">' + esc(p.role) + '</span>' : '') +
      (p.time ? '<span class="type-caption-1 msg-label__time">' + esc(p.time) + '</span>' : '') + '</div>';
  }

  function ChatBubble(p) {
    var sender = p.sender, side = p.side || 'left', state = p.state || 'default', content = p.content || 'text';
    var variant = 'Sender=' + cap(sender) + ', Side=' + cap(side) + ', State=' + cap(state) + ', Content=' + cap(content);
    return '<div class="bubble-row bubble-row--' + side + '">' +
      '<div class="bubble bubble--' + sender + ' bubble--' + side + ' bubble--' + content + (state === 'failed' ? ' is-failed' : '') + (p.me ? ' is-me' : '') + '"' +
        fig('Chat/Bubble', variant) + '>' +
        (p.photo ? '<button type="button" class="bubble__photo" data-action="photo-view:' + p.photo.id + '"><img src="' + p.photo.src +
          '" alt="' + esc(p.photo.alt) + '"></button>' : '') +
        (p.html ? '<p class="bubble__text">' + p.html + '</p>' : '') +
        (p.extra || '') +
      '</div>' +
      (p.more ? '<button type="button" class="bubble-more" data-action="msg-more:' + p.id + '"' + hintAttr(p.moreHint) +
        ' aria-label="More actions for this message">' + ph('ph-dots-three', 'bold') + '</button>' : '') +
      '</div>' +
      (state === 'failed' ? '<button type="button" class="bubble-retry type-caption-1-bold" data-action="retry:' + p.id + '">' +
        ph('ph-warning-circle', 'fill') + 'Didn’t send · Tap to try again</button>' : '') +
      (p.status ? '<p class="bubble-status bubble-status--' + side + ' type-caption-1">' + p.status + '</p>' : '');
  }

  function TypingIndicator(p) {
    return '<div class="bubble-row bubble-row--' + (p.side || 'left') + '"><div class="typing typing--' + (p.sender === 'june' ? 'june' : 'human') + '"' +
      fig('Chat/TypingIndicator', 'Sender=' + (p.sender === 'june' ? 'June' : 'Human')) + ' role="status" aria-label="' + esc(p.name) + ' is typing">' +
      '<span></span><span></span><span></span></div></div>';
  }

  var EVENT_ICONS = { date: '', handoff: 'ph-arrow-bend-down-right', opened: 'ph-envelope-open', signed: 'ph-seal-check',
    synced: 'ph-cloud-check', record: 'ph-activity', task: 'ph-check-square-offset', urgent: 'ph-warning' };
  function SystemEvent(p) {
    return '<div class="sys-event sys-event--' + p.type + (p.careOnly ? ' is-care-only' : '') + '"' + fig('Chat/SystemEvent', 'Type=' + cap(p.type)) + '>' +
      (EVENT_ICONS[p.type] ? ph(EVENT_ICONS[p.type]) : '') + '<span class="type-caption-1">' + esc(p.text) + '</span></div>';
  }

  function SuggestionChip(p) {
    var state = p.state || 'default';
    return '<button type="button" class="june-chip june-chip--answer' + (state === 'selected' ? ' is-selected' : '') + '"' + actAttr(p.action) +
      hintAttr(p.hint) + (state === 'disabled' ? ' disabled' : '') + fig('Chat/SuggestionChip', 'State=' + cap(state)) + '>' +
      '<span class="june-chip__text type-caption-1-bold">' + esc(p.label) + '</span></button>';
  }

  function CarePlanCard(p) {
    var plan = p.plan;
    return '<article class="care-plan-card"' + fig('Chat/CarePlanCard') + '>' +
      '<div class="card-head"><span class="medallion medallion--blue">' + ph('ph-list-checks') + '</span>' +
        '<div><h3 class="type-body-bold">' + esc(plan.title) + '</h3><p class="type-caption-1 muted">' + esc(plan.from) + '</p></div></div>' +
      '<ul class="plan-list">' + join(plan.items.concat([plan.nextVisit]), function (it) {
        return '<li class="plan-list__item"><span class="plan-list__icon">' + ph(it.icon) + '</span><span><span class="type-body-bold">' +
          esc(it.title) + '</span><span class="type-caption-1 muted plan-list__detail">' + esc(it.detail) + '</span></span></li>';
      }) + '</ul>' +
      '<div class="first-step"><img src="' + plan.firstStep.img + '" alt="" width="56" height="56">' +
        '<div class="first-step__text"><p class="type-caption-1-bold first-step__label">' + esc(plan.firstStepLabel) + '</p>' +
        '<p class="type-caption-1">' + esc(plan.firstStep.title) + '</p></div>' +
        Button({ variant: 'primary', size: 'small', label: plan.firstStep.cta, action: 'class:start' }) + '</div>' +
      Button({ variant: 'secondary', full: true, label: 'See full care plan', action: 'careplan:open', hint: p.hint }) +
    '</article>';
  }

  function DocumentCard(p) {
    var signed = p.status === 'signed';
    return '<article class="doc-card' + (signed ? ' is-signed' : '') + '"' + fig('Chat/DocumentCard', 'Status=' + (signed ? 'Signed' : 'Needs signature')) + '>' +
      '<div class="card-head"><span class="medallion medallion--doc">' + ph('ph-file-text') + '</span>' +
        '<div><h3 class="type-body-bold">' + esc(p.doc.title) + '</h3><p class="type-caption-1 muted">' + esc(p.doc.cardMeta) + '</p></div></div>' +
      (signed
        ? '<p class="doc-card__state">' + Tag({ color: 'mint', label: 'Signed', icon: 'ph-check' }) + '<span class="type-caption-1 muted">' + esc(p.signedText) + '</span></p>' +
          Button({ variant: 'secondary', full: true, label: 'View signed copy', action: 'doc:view' })
        : '<p class="doc-card__state">' + Tag({ color: 'yellow', label: 'Signature needed' }) + '</p>' +
          (p.side === 'patient' ? Button({ variant: 'primary', full: true, label: 'Review and sign', action: 'sign:open', hint: 'patient.doc.review' })
            : '<p class="type-caption-1 muted">Waiting for Carol to sign</p>')) +
    '</article>';
  }

  function ResourceCard(p) {
    return '<button type="button" class="resource-card"' + actAttr('article:' + p.index) + hintAttr('patient.resource.' + p.index) + fig('Chat/ResourceCard') + '>' +
      '<img src="' + p.article.img + '" alt="" width="72" height="72">' +
      '<span class="resource-card__text"><span class="type-body-bold">' + esc(p.article.title) + '</span>' +
      '<span class="type-caption-1 muted">' + esc(p.article.kind + ' · ' + p.article.mins + ' min read') + '</span></span>' +
      mask('chevron-step', 16) + '</button>';
  }

  function RoutingCard(p) {
    return '<div class="routing-card"' + fig('Chat/RoutingCard') + '><ul class="routing-card__rows">' + join(p.rows, function (r) {
      return '<li class="routing-card__row"><span class="type-body routing-card__q">' + esc(r.q) + '</span>' +
        '<span class="routing-card__who">' + Avatar({ image: r.image, size: 24 }) + '<span class="type-caption-1-bold">' + esc(r.label) + '</span></span></li>';
    }) + '</ul><p class="type-caption-1 routing-card__foot">' + p.footHtml + '</p>' +
      (p.note ? '<p class="type-caption-1 routing-card__note">' + esc(p.note) + '</p>' : '') + '</div>';
  }

  function IntroCard(p) {
    var intro = p.intro;
    return '<section class="intro-card" aria-label="' + esc(intro.title) + '"' + fig('Chat/IntroCard') + '>' +
      '<h3 class="type-serif-headline">' + esc(intro.title) + '</h3>' +
      '<ul class="intro-card__rows">' + join(intro.rows, function (r) {
        var who = p.cast[r.who];
        var av = r.who === 'june' ? JuneOrb({ size: 40 }) : Avatar({ image: who.photo, size: 40 });
        return '<li class="intro-card__row">' + av + '<span><span class="type-body-bold">' + esc(r.name) + '</span>' +
          (r.who === 'june' ? ' ' + AiChip() : '') + '<span class="type-caption-1 muted intro-card__text">' + esc(r.text) + '</span></span></li>';
      }) + '</ul>' +
      '<p class="intro-card__promise type-caption-1">' + ph('ph-calendar-x') + '<span>' + esc(intro.promise) + ' <span class="weekends">' +
        esc(intro.weekends) + '</span> ' + esc(intro.hours) + '</span></p>' +
      TextWithShield({ text: intro.privacy }) + '</section>';
  }

  function EmergencyNote(p) {
    return '<p class="emergency-note type-caption-1"' + fig('Chat/EmergencyNote') + '>' + esc(p.text) + '</p>';
  }

  function AttachmentChip(p) {
    return '<span class="attach-chip"' + fig('Chat/Composer/AttachmentChip') + '><img src="' + p.photo.src + '" alt="' + esc(p.photo.alt) + '" width="56" height="56">' +
      '<button type="button" class="attach-chip__remove" data-action="attach:remove" aria-label="Remove photo">' + ph('ph-x', 'bold') + '</button></span>';
  }

  function DocChip(p) {
    return '<span class="doc-chip type-caption-1-bold"' + fig('Chat/Composer/DocumentChip') + '>' + ph('ph-file-text') + esc(p.title) +
      '<button type="button" class="doc-chip__remove" data-action="attach:remove" aria-label="Remove attachment">' + ph('ph-x', 'bold') + '</button></span>';
  }

  function Composer(p) {
    var hasAttach = !!(p.photo || p.doc || p.plan);
    var state = hasAttach ? 'WithAttachment' : (p.text ? 'Filled' : 'Empty');
    return '<form class="composer composer--' + p.side + '" novalidate' + fig('Chat/Composer', 'State=' + state + ', Side=' + cap(p.side)) + '>' +
      (p.emergency ? EmergencyNote({ text: p.emergency }) : '') +
      (p.seesAs ? '<p class="composer__sees type-caption-1">' + esc(p.seesAs) + '</p>' : '') +
      '<div class="composer__shell">' +
        (hasAttach ? '<div class="composer__attachments">' + (p.photo ? AttachmentChip({ photo: p.photo }) : '') +
          (p.doc ? DocChip({ title: p.doc }) : '') + (p.plan ? DocChip({ title: p.plan }) : '') + '</div>' : '') +
        '<label class="u-vh" for="' + p.id + '">' + esc(p.placeholder) + '</label>' +
        '<textarea id="' + p.id + '" class="composer__input type-body" rows="1" placeholder="' + esc(p.placeholder) + '"' + hintAttr(p.inputHint) + '>' +
          esc(p.text || '') + '</textarea>' +
        '<div class="composer__tools">' +
          '<button type="button" class="round-btn round-btn--ghost" data-action="attach"' + hintAttr(p.attachHint) + ' aria-label="Add a photo or file">' + ph('ph-plus', 'bold') + '</button>' +
          (p.templates ? '<button type="button" class="pill-btn type-caption-1-bold" data-action="templates"' + hintAttr(p.templatesHint) + '>' + ph('ph-lightning') + esc(p.templates) + '</button>' : '') +
          '<span class="composer__spacer"></span>' +
          (p.side === 'patient' ? '<button type="button" class="round-btn round-btn--ghost" data-action="mic" aria-label="Voice input">' + ph('ph-microphone') + '</button>' : '') +
          '<button type="submit" class="round-btn round-btn--send" data-action="send"' + hintAttr(p.sendHint) + (p.canSend ? '' : ' disabled') +
            ' aria-label="' + (p.canSend ? 'Send message' : 'Send, type something first') + '">' + ph('ph-arrow-up', 'bold') + '</button>' +
        '</div></div></form>';
  }

  /* ── Overlays ────────────────────────────────────────────────────────── */
  function SheetBottom(p) {
    return '<div class="layer layer--sheet" data-layer="sheet"' + (p.kind ? ' data-kind="' + p.kind + '"' : '') + '><div class="scrim" data-action="' + (p.closeAction || 'sheet:close') + '"></div>' +
      '<div class="sheet' + (p.tall ? ' sheet--tall' : '') + '" role="dialog" aria-modal="true" aria-label="' + esc(p.title) + '"' + fig('Sheet/Bottom', 'Height=' + (p.tall ? 'Tall' : 'Auto')) + '>' +
        '<div class="sheet__grab" aria-hidden="true"></div>' +
        '<div class="sheet__head"><h2 class="type-serif-headline sheet__title">' + esc(p.title) + '</h2>' +
          '<button type="button" class="icon-btn icon-btn--round" data-action="' + (p.closeAction || 'sheet:close') + '" aria-label="Close"' + hintAttr(p.closeHint) + '>' + ph('ph-x', 'bold') + '</button></div>' +
        '<div class="sheet__body">' + p.body + '</div>' + (p.foot ? '<div class="sheet__foot">' + p.foot + '</div>' : '') +
      '</div></div>';
  }

  function ModalFullScreen(p) {
    return '<div class="layer layer--modal" data-layer="modal"' + (p.kind ? ' data-kind="' + p.kind + '"' : '') + '><div class="modal' + (p.tone ? ' modal--' + p.tone : '') + '" role="dialog" aria-modal="true" aria-label="' + esc(p.title) + '"' +
      fig('Modal/FullScreen', 'Tone=' + cap(p.tone || 'default')) + '>' +
      (p.header === false ? '' : '<div class="modal__head">' +
        '<button type="button" class="icon-btn" data-action="' + (p.closeAction || 'modal:close') + '" aria-label="Close"' + hintAttr(p.closeHint) + '>' + ph('ph-x', 'bold') + '</button>' +
        '<h2 class="type-body-bold modal__title">' + esc(p.title) + '</h2>' + (p.headRight || '<span class="modal__spacer"></span>') + '</div>') +
      '<div class="modal__body">' + p.body + '</div>' + (p.foot ? '<div class="modal__foot">' + p.foot + '</div>' : '') +
    '</div></div>';
  }

  function Toast(p) {
    return '<div class="toast" role="status"' + fig('Toast') + '>' + ph('ph-check-circle', 'fill') + '<span class="type-caption-1-bold">' + esc(p.text) + '</span></div>';
  }

  function LockNotification(p) {
    return '<button type="button" class="lock-note lock-note--' + p.app + (p.fresh ? ' is-fresh' : '') + '"' + actAttr(p.action) + hintAttr(p.hint) +
      fig('Lockscreen/Notification', 'App=' + (p.app === 'messages' ? 'Messages' : 'Bold')) + '>' +
      '<span class="lock-note__icon lock-note__icon--' + p.app + '" aria-hidden="true">' +
        (p.app === 'messages' ? ph('ph-chat-circle', 'fill') : '<img src="images/figma/logo-lines.svg" alt="" width="22" height="22">') + '</span>' +
      '<span class="lock-note__body"><span class="lock-note__top"><span class="type-caption-1-bold">' + esc(p.appName) + '</span>' +
        '<span class="type-caption-1 lock-note__time">' + esc(p.time) + '</span></span>' +
        (p.title ? '<span class="type-caption-1-bold lock-note__title">' + esc(p.title) + '</span>' : '') +
        '<span class="type-caption-1 lock-note__text">' + esc(p.text) + '</span></span></button>';
  }

  function LockScreen(p) {
    return '<div class="lock"' + fig('Lockscreen') + '><div class="lock__clock"><p class="lock__date">' + esc(p.date) + '</p>' +
      '<p class="lock__time">' + esc(p.time) + '</p></div><div class="lock__notes">' + (p.notes || '') + '</div>' +
      '<div class="lock__bar" aria-hidden="true"></div></div>';
  }

  function PhotoGrid(p) {
    return '<div class="photo-grid"' + fig('Chat/PhotoGrid') + '>' + join(p.photos, function (ph_) {
      return '<button type="button" class="photo-grid__item"' + actAttr('photo-pick:' + ph_.id) + hintAttr(ph_.id === 'rx' ? 'patient.photo.rx' : '') +
        '><img src="' + ph_.src + '" alt="' + esc(ph_.alt) + '"></button>';
    }) + '</div>';
  }

  function ArticleBody(p) {
    var a = p.article;
    return '<article class="article"' + fig('Chat/Article') + '><img class="article__img" src="' + a.img + '" alt="' + esc(a.imgAlt) + '">' +
      '<p class="type-caption-1 muted">' + esc(a.kind + ' · ' + a.mins + ' min read · From Bold’s care team') + '</p>' +
      '<h3 class="type-title">' + esc(a.title) + '</h3><p class="type-body">' + esc(a.intro) + '</p>' +
      '<ul class="article__list">' + join(a.bullets, function (b) { return '<li class="type-body">' + esc(b) + '</li>'; }) + '</ul>' +
      '<p class="type-body">' + esc(a.close) + '</p></article>';
  }

  /* ── Care-team components ────────────────────────────────────────────── */
  function CareHeader(p) {
    return '<header class="care-header"' + fig('Care/Header') + '>' +
      '<img class="care-header__mark" src="images/figma/logo-lines.svg" alt="" width="32" height="32">' +
      '<h2 class="type-title care-header__title">' + esc(p.title) + '</h2>' +
      '<button type="button" class="account-chip" data-action="account:open" aria-label="Signed in as ' + esc(p.name + ', ' + p.role) + '. Switch account">' +
        Avatar({ image: p.image, size: 32 }) + '<span class="account-chip__text"><span class="type-caption-1-bold">' + esc(p.name) + '</span>' +
        '<span class="type-caption-1 muted">' + esc(p.role) + '</span></span>' + mask('carrot', 20) + '</button></header>';
  }

  function SearchField(p) {
    return '<label class="search-field"' + fig('Care/Search') + '>' + ph('ph-magnifying-glass') + '<span class="u-vh">' + esc(p.placeholder) + '</span>' +
      '<input type="search" class="search-field__input type-body" placeholder="' + esc(p.placeholder) + '" value="' + esc(p.value || '') + '" data-action="search"></label>';
  }

  function FilterPills(p) {
    return '<div class="filter-pills" role="group" aria-label="Filter conversations"' + fig('Care/FilterPills') + '>' + join(p.filters, function (f) {
      return '<button type="button" class="filter-pill type-caption-1-bold" aria-pressed="' + (p.active === f.key ? 'true' : 'false') + '"' +
        actAttr('filter:' + f.key) + '>' + esc(f.label) + (f.count ? ' <span class="filter-pill__count">' + f.count + '</span>' : '') + '</button>';
    }) + '</div>';
  }

  var TAG_LABELS = { 'can-wait': ['grey', 'Can wait'], 'needs-provider': ['purple100', 'Needs provider'], urgent: ['red', 'Urgent'],
    scheduling: ['grey', 'Scheduling'], photo: ['grey', '1 photo'], june: ['ai', 'Screened by June'] };
  function triageTag(key) {
    var t = TAG_LABELS[key];
    if (!t) return '';
    if (t[0] === 'ai') return '<span class="tag tag--june type-caption-1-bold">' + JuneOrb({ size: 24 }) + esc(t[1]) + '</span>';
    return Tag({ color: t[0], label: t[1], icon: key === 'urgent' ? 'ph-warning' : '' });
  }

  function InboxRow(p) {
    var r = p.row, unread = !!r.unread;
    var triage = r.tags.indexOf('urgent') >= 0 ? 'Urgent' : r.tags.indexOf('needs-provider') >= 0 ? 'NeedsProvider' : 'CanWait';
    return '<button type="button" class="inbox-row' + (unread ? ' is-unread' : '') + (r.fresh ? ' is-fresh' : '') + '"' + actAttr('thread:' + r.id) +
      hintAttr('care.row.' + r.id) + fig('Care/InboxRow', 'State=' + (unread ? 'Unread' : 'Read') + ', Triage=' + triage) + '>' +
      '<span class="inbox-row__avatar">' + Avatar({ initials: r.initials, size: 44, color: unread ? 'purple' : 'grey' }) +
        (unread ? '<span class="inbox-row__dot" aria-hidden="true"></span>' : '') + '</span>' +
      '<span class="inbox-row__main"><span class="inbox-row__top"><span class="type-body-bold inbox-row__name">' + esc(r.name) + '</span>' +
        '<span class="type-caption-1 muted inbox-row__time">' + esc(r.time) + '</span></span>' +
        '<span class="type-caption-1 muted">' + esc(r.program) + '</span>' +
        '<span class="type-caption-1 inbox-row__preview">' + esc(r.preview) + '</span>' +
        (r.tags.length ? '<span class="inbox-row__tags">' + join(r.tags, triageTag) + '</span>' : '') +
      '</span>' + (unread ? '<span class="u-vh">, 1 new</span>' : '') + '</button>';
  }

  function OffHoursBanner(p) {
    return '<div class="off-hours"' + fig('Care/OffHoursBanner') + '>' + ph('ph-moon') + '<span><span class="type-caption-1-bold">' + esc(p.text) +
      '</span> <span class="type-caption-1">' + esc(p.sub) + '</span></span></div>';
  }

  function ContextBar(p) {
    return '<p class="context-bar type-caption-1"' + fig('Care/ContextBar') + '>' + ph('ph-info') + esc(p.text) + '</p>';
  }

  function InternalCard(p) {
    return '<section class="internal-card internal-card--' + p.type + (p.fresh ? ' is-fresh' : '') + '"' + fig('Care/InternalCard', 'Type=' + cap(p.type)) + '>' +
      '<p class="internal-card__lock type-caption-1">' + ph('ph-lock-simple') + esc(p.careOnlyText) + '</p>' +
      '<div class="internal-card__head">' + (p.lead || '') + '<h3 class="type-body-bold">' + esc(p.title) + '</h3></div>' +
      (p.rows ? '<dl class="internal-card__rows">' + join(p.rows, function (r) {
        return '<div class="internal-card__row"><dt class="type-caption-1 muted">' + esc(r[0]) + '</dt><dd class="type-caption-1-bold">' + esc(r[1]) + '</dd></div>';
      }) + '</dl>' : '') +
      (p.lines ? '<ul class="internal-card__lines">' + join(p.lines, function (l) { return '<li class="type-caption-1">' + esc(l) + '</li>'; }) + '</ul>' : '') +
      (p.actions || '') + '</section>';
  }

  function SummaryCard(p) {
    if (p.state === 'loading') {
      return '<section class="summary-card is-loading"' + fig('Care/SummaryCard', 'State=Loading') + ' aria-busy="true" aria-label="Making a summary">' +
        '<p class="summary-card__title type-body-bold">' + ph('ph-sparkle', 'fill') + 'Summarizing…</p>' +
        '<span class="skeleton"></span><span class="skeleton"></span><span class="skeleton skeleton--short"></span></section>';
    }
    var s = p.summary;
    return '<section class="summary-card' + (p.fresh ? ' is-fresh' : '') + '"' + fig('Care/SummaryCard', 'State=Ready') + '>' +
      '<p class="internal-card__lock type-caption-1">' + ph('ph-lock-simple') + esc(p.careOnlyText) + '</p>' +
      '<p class="summary-card__title type-body-bold">' + ph('ph-sparkle', 'fill') + esc(s.title) + '</p>' +
      '<ul class="summary-card__lines">' + join(s.lines, function (l) { return '<li class="type-caption-1">' + esc(l) + '</li>'; }) + '</ul>' +
      '<p class="type-caption-1-bold summary-card__needs-title">' + esc(s.needsTitle) + '</p>' +
      '<ul class="summary-card__needs">' + join(s.needs, function (l) { return '<li class="type-caption-1">' + esc(l) + '</li>'; }) + '</ul>' +
      '<p class="type-caption-1 muted summary-card__foot">' + esc(s.footer) + '</p>' + (p.actions || '') + '</section>';
  }

  function TaskRow(p) {
    var t = p.task;
    return '<button type="button" class="task-row' + (t.status === 'done' ? ' is-done' : '') + (p.fresh ? ' is-fresh' : '') + '"' + actAttr('task:' + t.id) +
      hintAttr(p.hint) + fig('Care/TaskRow', 'Status=' + (t.status === 'done' ? 'Done' : 'Open')) + '>' +
      '<span class="task-row__check" aria-hidden="true">' + (t.status === 'done' ? ph('ph-check', 'bold') : '') + '</span>' +
      '<span class="task-row__main"><span class="type-caption-1 muted">' + esc(t.patient) + '</span>' +
        '<span class="type-body-bold">' + esc(t.title) + '</span>' +
        '<span class="type-caption-1 muted">' + esc(p.meta) + '</span></span>' + mask('chevron-step', 16) + '</button>';
  }

  function TaskSheetBody(p) {
    var s = p.copy, d = p.values;
    return '<div class="task-sheet"' + fig('Care/TaskSheet') + '>' +
      '<label class="field"><span class="type-caption-1-bold field__label">' + esc(s.taskLabel) + '</span>' +
        '<input class="field__input type-body" name="title" value="' + esc(d.title) + '"></label>' +
      '<div class="field"><span class="type-caption-1-bold field__label">' + esc(s.detailsLabel) + '</span>' +
        '<blockquote class="field__quote type-caption-1">' + esc(p.quote) + '</blockquote></div>' +
      '<fieldset class="field"><legend class="type-caption-1-bold field__label">' + esc(s.assignLabel) + '</legend>' +
        join(s.assign, function (o) { return Radio({ name: 'assign', value: o.key, label: o.label, checked: d.assign === o.key }); }) + '</fieldset>' +
      '<fieldset class="field"><legend class="type-caption-1-bold field__label">' + esc(s.dueLabel) + '</legend>' +
        join(s.due, function (o) { return Radio({ name: 'due', value: o.key, label: o.label.replace('{promise}', p.promiseLabel), checked: d.due === o.key }); }) + '</fieldset>' +
      '<fieldset class="field"><legend class="type-caption-1-bold field__label">' + esc(s.followLabel) + '</legend>' +
        join(s.follow, function (o) { return Radio({ name: 'follow', value: o.key, label: o.label, checked: d.follow === o.key }); }) + '</fieldset>' +
      '<div class="field">' + join(s.checks, function (c) { return Checkbox({ name: c.key, label: c.label, checked: !!d[c.key] }); }) + '</div>' +
      '<p class="task-sheet__preview type-caption-1" data-task-preview>' + esc(p.preview) + '</p>' +
    '</div>';
  }

  function TaskPrompt(p) {
    return '<div class="task-prompt"' + fig('Care/TaskPrompt') + '><p class="type-caption-1-bold">' + esc(p.text) + '</p>' +
      Button({ variant: 'primary', size: 'small', label: p.label, action: p.action, hint: p.hint }) + '</div>';
  }

  /* Task detail body: tags, title, the patient's words, then cards (summaries) and actions (buttons). */
  function TaskDetail(p) {
    return '<div class="task-detail"' + fig('Care/TaskDetail') + '>' +
      (p.tags ? '<div class="task-detail__meta">' + p.tags + '</div>' : '') +
      '<h3 class="type-title">' + esc(p.title) + '</h3>' +
      (p.quote ? (p.quoteMeta ? '<p class="type-caption-1 muted">' + esc(p.quoteMeta) + '</p>' : '') +
        '<blockquote class="task-detail__quote type-body">' + esc(p.quote) + '</blockquote>' : '') +
      (p.cards || '') + (p.actions ? '<div class="task-detail__actions">' + p.actions + '</div>' : '') + '</div>';
  }

  function SectionLabel(p) {
    return '<p class="section-label type-caption-1-bold"' + fig('Care/SectionLabel') + '>' + esc(p.text) + '</p>';
  }

  function EmptyState(p) {
    return '<p class="empty-state type-caption-1"' + fig('Care/EmptyState') + '>' + esc(p.text) + '</p>';
  }

  function TemplatePicker(p) {
    return '<ul class="template-list"' + fig('Care/TemplatePicker') + '>' + join(p.templates, function (t) {
      return '<li><button type="button" class="template-list__item"' + actAttr('template:' + t.id) + hintAttr(t.id === 'rx-confirmed' ? 'care.template.rx' : '') + '>' +
        '<span class="type-body-bold">' + esc(t.name) + '</span><span class="type-caption-1 muted template-list__body">' + esc(t.preview) + '</span></button></li>';
    }) + '</ul>';
  }

  function ActionList(p) {
    return '<ul class="action-list"' + fig('Sheet/Actions') + '>' + join(p.actions, function (a) {
      return '<li><button type="button" class="action-list__item"' + actAttr(a.action) + hintAttr(a.hint) + '>' + ph(a.icon) +
        '<span class="type-body-bold">' + esc(a.label) + '</span></button></li>';
    }) + '</ul>';
  }

  function AccountSwitch(p) {
    return '<ul class="action-list"' + fig('Care/AccountSwitch') + '>' + join(p.accounts, function (a) {
      return '<li><button type="button" class="action-list__item' + (a.active ? ' is-active' : '') + '"' + actAttr('account:' + a.key) + '>' +
        Avatar({ image: a.image, size: 40 }) + '<span class="action-list__text"><span class="type-body-bold">' + esc(a.name) + '</span>' +
        '<span class="type-caption-1 muted">' + esc(a.role) + '</span></span>' + (a.active ? ph('ph-check', 'bold') : '') + '</button></li>';
    }) + '</ul>';
  }

  /* ── Signing (DocuSign-style) ────────────────────────────────────────── */
  function SignTag(p) {
    return '<button type="button" class="sign-tag sign-tag--' + p.type + '"' + actAttr(p.action) + hintAttr(p.hint) +
      fig('Sign/Tag', 'Type=' + cap(p.type)) + '><span class="type-caption-1-bold">' + esc(p.label) + '</span>' + ph('ph-caret-right', 'bold') + '</button>';
  }

  function SignatureField(p) {
    var signed = !!p.signature;
    return '<div class="sig-field' + (signed ? ' is-signed' : '') + '"' + fig('Sign/SignatureField', 'State=' + (signed ? 'Signed' : 'Empty')) + '>' +
      (signed
        ? (p.signature.mode === 'draw' ? '<img class="sig-field__img" src="' + p.signature.dataUrl + '" alt="Signature of ' + esc(p.name) + '">'
          : '<span class="sig-field__typed type-sign">' + esc(p.signature.name) + '</span>')
        : '<button type="button" class="sig-field__empty" data-action="sign:adopt"' + hintAttr('patient.sign.field') + '>' +
          '<span class="sign-tag sign-tag--sign"><span class="type-caption-1-bold">' + esc(p.signLabel) + '</span>' + ph('ph-pen-nib', 'bold') + '</span></button>') +
      '<span class="sig-field__line" aria-hidden="true"></span><span class="type-caption-1 muted">' + esc(p.name) + '</span></div>';
  }

  function SignDocumentPage(p) {
    var d = p.doc;
    function items(list) {
      return '<ul class="doc-page__list">' + join(list, function (it) { return '<li class="type-body"><strong>' + esc(it[0]) + '</strong> ' + esc(it[1]) + '</li>'; }) + '</ul>';
    }
    return '<div class="doc-page"' + fig('Sign/DocumentPage') + '>' +
      '<header class="doc-page__head"><img src="images/figma/logo-lines.svg" alt="" width="28" height="28">' +
        '<div><p class="type-body-bold">' + esc(d.header) + '</p>' + join(d.meta, function (m) { return '<p class="type-caption-1 muted">' + esc(m) + '</p>'; }) + '</div></header>' +
      '<p class="type-body">' + esc(d.lead) + '</p>' +
      join(d.sections, function (s) {
        var html = '<section class="doc-page__section"><h3 class="type-body-bold">' + esc(s.title) + '</h3>';
        if (s.intro) html += '<p class="type-body">' + esc(s.intro) + '</p>';
        if (s.groups) html += join(s.groups, function (g) { return '<h4 class="type-caption-1-bold doc-page__group">' + esc(g.title) + '</h4>' + items(g.items); });
        if (s.table) html += '<dl class="doc-page__table">' + join(s.table, function (r) {
          return '<div class="doc-page__trow"><dt class="type-body-bold">' + esc(r[0]) + '</dt><dd class="type-body">' + esc(r[1]) +
            ' <span class="muted">' + esc(r[2]) + '</span></dd></div>'; }) + '</dl>';
        if (s.items) html += items(s.items);
        if (s.body) html += '<p class="type-body">' + esc(s.body) + '</p>';
        return html + '</section>';
      }) +
      '<div class="doc-page__agreements">' + join(d.agreements, function (a, i) {
        return '<div class="doc-page__agreement" data-field="agree-' + i + '">' +
          Checkbox({ name: 'agree-' + i, label: a, checked: !!p.checked[i], required: true, action: 'sign:agree:' + i,
            hint: p.boxHint && i === p.target ? p.boxHint : '' }) + '</div>';
      }) + '</div>' +
      '<div class="doc-page__sign" data-field="signature">' + SignatureField({ signature: p.signature, name: p.patientName, signLabel: p.signLabel }) +
        '<p class="type-caption-1 muted">' + esc(d.dateLabel) + ': ' + esc(p.dateText || '—') + '</p></div>' +
    '</div>';
  }

  function AdoptSignature(p) {
    return '<div class="adopt"' + fig('Sign/AdoptSignature', 'Mode=' + cap(p.mode)) + '>' +
      '<label class="field"><span class="type-caption-1-bold field__label">' + esc(p.copy.nameLabel) + '</span>' +
        '<input class="field__input type-body" name="signer" value="' + esc(p.name) + '" data-action="adopt:name"></label>' +
      '<div class="segmented" role="tablist" aria-label="Signature style">' +
        '<button type="button" role="tab" class="segmented__btn" aria-selected="' + (p.mode === 'type' ? 'true' : 'false') + '" data-action="adopt:mode:type">' + esc(p.copy.typeTab) + '</button>' +
        '<button type="button" role="tab" class="segmented__btn" aria-selected="' + (p.mode === 'draw' ? 'true' : 'false') + '" data-action="adopt:mode:draw">' + esc(p.copy.drawTab) + '</button></div>' +
      (p.mode === 'type'
        ? '<div class="adopt__preview"><span class="type-sign" data-adopt-preview>' + esc(p.name) + '</span></div>'
        : '<div class="adopt__pad"><canvas class="adopt__canvas" width="345" height="160" aria-label="Draw your signature here"></canvas>' +
          '<button type="button" class="adopt__clear type-caption-1-bold" data-action="adopt:clear">' + esc(p.copy.clear) + '</button></div>') +
      (p.error ? '<p class="field__error type-caption-1" id="adopt-error" role="alert">' + ph('ph-warning-circle', 'fill') + esc(p.error) + '</p>' : '') +
      '<p class="type-caption-1 muted">' + esc(p.copy.legal) + '</p></div>';
  }

  function SignDone(p) {
    return '<div class="sign-done"' + fig('Sign/Done') + '><span class="medallion medallion--mint medallion--lg">' + ph('ph-check', 'bold') + '</span>' +
      '<h2 class="type-greeting">' + esc(p.copy.doneTitle) + '</h2><p class="type-body">' + esc(p.copy.doneBody) + '</p></div>';
  }

  function SignDisclosure(p) {
    return '<div class="sign-disclosure"' + fig('Sign/Disclosure') + '>' +
      '<span class="medallion medallion--doc medallion--lg">' + ph('ph-file-text') + '</span>' +
      '<h2 class="type-serif-headline">' + esc(p.doc.title) + '</h2>' +
      '<p class="type-body">' + esc(p.copy.sentBy + ' ' + p.copy.time) + '</p>' +
      '<div class="sign-disclosure__covers"><p class="type-caption-1-bold">' + esc(p.copy.coversTitle) + '</p><ul>' +
        join(p.doc.summary, function (s) { return '<li class="type-body">' + esc(s) + '</li>'; }) + '</ul></div>' +
      Checkbox({ name: 'esign', label: p.copy.esign, checked: p.checked, action: 'sign:esign', hint: 'patient.sign.agree', describedBy: p.error ? 'esign-error' : '' }) +
      (p.error ? '<p class="field__error type-caption-1" id="esign-error" role="alert">' + ph('ph-warning-circle', 'fill') + esc(p.copy.esignError) + '</p>' : '') +
      '<button type="button" class="sign-disclosure__ask type-caption-1-bold" data-action="sign:ask">' + esc(p.copy.askLink) + '</button></div>';
  }

  root.C = {
    util: { fmtTime: fmtTime, fmtClock: fmtClock, fmtDay: fmtDay, fmtStamp: fmtStamp, esc: esc, ph: ph, mask: mask, weekends: weekends, clip: clip, stickToBottom: stickToBottom, reveal: reveal },
    StatusBar: StatusBar, Avatar: Avatar, AvatarStack: AvatarStack, NavHeader: NavHeader, AccountMenu: AccountMenu,
    TabBar: TabBar, Tab: Tab, Greeting: Greeting, SectionTitle: SectionTitle, ChecklistProgress: ChecklistProgress,
    ChecklistStep: ChecklistStep, ChecklistModule: ChecklistModule, PositionTag: PositionTag, ClassCard: ClassCard,
    JuneOrb: JuneOrb, JuneChip: JuneChip, JuneEntryCard: JuneEntryCard, JuneFab: JuneFab, Placeholder: Placeholder,
    Button: Button, Tag: Tag, AiChip: AiChip, TextWithShield: TextWithShield, Checkbox: Checkbox, Radio: Radio,
    ChatHeader: ChatHeader, StatusStrip: StatusStrip, MessageLabel: MessageLabel, ChatBubble: ChatBubble,
    TypingIndicator: TypingIndicator, SystemEvent: SystemEvent, SuggestionChip: SuggestionChip, CarePlanCard: CarePlanCard,
    DocumentCard: DocumentCard, ResourceCard: ResourceCard, RoutingCard: RoutingCard, IntroCard: IntroCard,
    EmergencyNote: EmergencyNote, AttachmentChip: AttachmentChip, DocChip: DocChip, Composer: Composer,
    SheetBottom: SheetBottom, ModalFullScreen: ModalFullScreen, Toast: Toast, LockNotification: LockNotification,
    LockScreen: LockScreen, PhotoGrid: PhotoGrid, ArticleBody: ArticleBody, CareHeader: CareHeader, SearchField: SearchField,
    FilterPills: FilterPills, InboxRow: InboxRow, OffHoursBanner: OffHoursBanner, ContextBar: ContextBar,
    InternalCard: InternalCard, SummaryCard: SummaryCard, TaskRow: TaskRow, TaskSheetBody: TaskSheetBody,
    TaskPrompt: TaskPrompt, TaskDetail: TaskDetail, SectionLabel: SectionLabel, EmptyState: EmptyState,
    TemplatePicker: TemplatePicker, ActionList: ActionList, AccountSwitch: AccountSwitch, SignTag: SignTag,
    SignatureField: SignatureField, SignDocumentPage: SignDocumentPage, AdoptSignature: AdoptSignature, SignDone: SignDone,
    SignDisclosure: SignDisclosure
  };
})(typeof window !== 'undefined' ? window : globalThis);
