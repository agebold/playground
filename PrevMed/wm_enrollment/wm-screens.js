/* ══════════════════════════════════════════════
   wm-screens.js — the 17-screen registry, in the Figma board's left-to-right
   x order, plus the shared chrome partials.

   Source: Figma `Weight-management Enrollment` § campaign enrollment, 2393:11580.
   Every screen block carries its node id. Every string is transcribed from the
   board, not paraphrased — including its curly apostrophes, its straight ones
   (2393:14621 really does differ from 2393:14623) and its ® marks.

   The three landing questions are ONE page now (2393:14545), and a result screen
   after them shows 21% of the weight entered on it, so the flow is 17 screens
   where the previous board's was 20.

   FIVE deliberate corrections (agreed, and listed in FIDELITY.md):
     `Question #` → real numbers · `{Pacific Standard Times (PST)}` →
     `Pacific Time (PT)` · `Covered by [Medicare]` → `Covered by Medicare` ·
     the duplicated `Fri Jan 15` day tab → five distinct weekdays ·
     `10:45am` before `10:30am` → ascending.
   Plus `[23]lbs` on the result screen, which is a placeholder by definition.
   Everything else is reproduced as drawn, bugs included.
══════════════════════════════════════════════ */
(function () {
  'use strict';

  var W = window.WMW;
  var A = 'assets/';

  /* ─────────────────────────────────────────────
     SHARED CHROME PARTIALS
     ───────────────────────────────────────────── */

  /* Figma "Status Bar - iPhone" · 2283:19093 · 393×56 */
  function statusbar() {
    return '<div class="fg-statusbar">' + statusbarInner() + '</div>';
  }

  /* The glyphs alone, so the transparent landing variant can reuse them. */
  function statusbarInner() {
    return '' +
      '<p class="fg-sb-time">9:41</p>' +
      '<span class="fg-sb-signal"><img src="' + A + 'chrome/sb-signal.svg" alt="" /></span>' +
      '<span class="fg-sb-wifi"><img src="' + A + 'chrome/sb-wifi.svg" alt="" /></span>' +
      '<span class="fg-sb-batt"><img src="' + A + 'chrome/sb-battery-body.svg" alt="" /></span>' +
      '<span class="fg-sb-batt-f"><img src="' + A + 'chrome/sb-battery-fill.svg" alt="" /></span>' +
      '<span class="fg-sb-batt-c"><img src="' + A + 'chrome/sb-battery-cap.svg" alt="" /></span>';
  }

  /* Icon — the committed file is the Figma Vector at its OWN size, so it has to
     be positioned inside the box Figma draws it in. `.fg-ic--<kind>` carries
     that box and the node's insets (see wm-frame.css). */
  function ic(kind) {
    return '<span class="fg-ic fg-ic--' + kind + '" aria-hidden="true">' +
      '<img src="' + A + 'icon/' + kind + '.svg" alt="" /></span>';
  }

  function logo(kind) {
    return '<span class="fg-logo fg-logo--' + kind + '" role="img" aria-label="Bold">' +
      '<span class="fg-logo-lines"><img src="' + A + 'logo/bold-lines.svg" alt="" /></span>' +
      '<span class="fg-logo-text"><img src="' + A + 'logo/bold-text.svg" alt="" /></span>' +
    '</span>';
  }

  /* Figma "Heading Navigation" · 2313:23353 · 393×76.
     The right-hand button is opacity:0 in the board — a spacer. It must stay in
     the DOM or the centred logo shifts ~22px right. */
  function nav(mod) {
    return '<div class="fg-nav' + (mod ? ' fg-nav--' + mod : '') + '">' +
      '<button type="button" class="fg-nav-btn" data-action="back" aria-label="Go back">' +
        ic('caret-left') +
      '</button>' +
      '<span class="fg-nav-center">' + logo('nav') + '</span>' +
      '<span class="fg-nav-btn fg-nav-btn--ghost" aria-hidden="true">' + ic('x') + '</span>' +
    '</div>';
  }

  /* Figma "Tab Bar" · 2283:20210 · 393×133. `url` is "facebook" on the ad and
     "agebold.com" on every other screen. */
  function tabbar(url) {
    return '<div class="fg-tabbar" aria-hidden="true">' +
      '<div class="fg-tab-row"><div class="fg-tab-pill">' +
        '<span class="fg-tab-fmt"><img src="' + A + 'chrome/safari-textformat.svg" alt="" /></span>' +
        '<span class="fg-tab-url">' +
          '<img class="fg-tab-lock" src="' + A + 'chrome/safari-lock.svg" alt="" />' +
          '<span>' + url + '</span>' +
        '</span>' +
        '<span class="fg-tab-reload"><img src="' + A + 'chrome/safari-reload.svg" alt="" /></span>' +
      '</div></div>' +
      '<div class="fg-tab-items">' +
        '<img src="' + A + 'chrome/safari-tab-1.svg" alt="" />' +
        '<img src="' + A + 'chrome/safari-tab-2.svg" alt="" />' +
        '<img src="' + A + 'chrome/safari-tab-3.svg" alt="" />' +
        '<img src="' + A + 'chrome/safari-tab-4.svg" alt="" />' +
        '<img src="' + A + 'chrome/safari-tab-5.svg" alt="" />' +
      '</div>' +
      '<div class="fg-home"></div>' +
    '</div>';
  }

  /* Figma "Actions" · 393×80 — flex-col gap-16, p-16, one 361×48 Button.
     The "By tapping “Agree”…" text inside every Actions group is hidden="true"
     on all 16 instances; rendering it would grow every bottom group 80→140. */
  function actions(label, opts) {
    opts = opts || {};
    /* The funnel screens' Actions is a #f5f5f5 gradient (2313:23402); the
       landing screens' is flat white (2283:20207). */
    return '<div class="fg-actions' + (opts.grad ? ' fg-actions--grad' : '') +
      (opts.two ? ' fg-actions--two' : '') + '">' +
      '<button type="button" class="fg-btn" data-cta data-action="next"' +
        (opts.disabled ? ' disabled' : '') + '><span>' + label + '</span></button>' +
      (opts.second
        ? '<button type="button" class="fg-btn fg-btn--text" data-action="' +
          (opts.secondAction || 'skip') + '"><span>' + opts.second + '</span></button>'
        : '') +
    '</div>';
  }

  /* Landing hero + logo + phone — 2283:19099 / 2283:19095 / 2283:19096.
     `img` names the hero file, because screens 3-5 use a different one
     ("istockphoto-…-1024x1024 2", which carries the white wave overlay). */
  function landingHero(img) {
    return '<div class="fg-hero">' +
      '<img src="' + A + 'img/' + img + '.png"' +
        ' srcset="' + A + 'img/' + img + '.png 1x, ' + A + 'img/' + img + '@3x.png 3x"' +
        ' alt="" />' +
    '</div>' +
    '<span class="fg-landing-logo">' + logo('landing') + '</span>' +
    '<a class="fg-landing-phone" href="tel:+14245775266">' +
      '<img src="' + A + 'icon/headset.svg" alt="" />' +
      '<span>(424) 577-5266</span>' +
    '</a>';
  }

  /* 3-segment landing progress — 2292:21925. Segments past `done` are the same
     purple at opacity .12, not a grey track. */
  function steps3(done) {
    var out = '<div class="fg-steps3" role="presentation">';
    for (var i = 1; i <= 3; i++) out += '<i data-done="' + (i <= done ? 1 : 0) + '"></i>';
    return out + '</div>';
  }

  /* Figma "Checkbox Button" · 2283:20373 — 16x16 indicator + label. */
  function check(name, value, label, mod) {
    return '<button type="button" class="fg-check' + (mod ? ' fg-check--' + mod : '') + '"' +
      ' role="checkbox" aria-checked="false"' +
      ' data-check="' + name + '" data-value="' + value + '">' +
      '<span class="fg-check-box" aria-hidden="true"></span>' +
      '<span>' + label + '</span></button>';
  }

  /* Figma "Field" · 2313:23465 — label + h-44 Input. `ph` is the drawn
     placeholder, which is NOT the label on the email row ("Email " / "Email
     address"). */
  function tfield(label, path, ph, opts) {
    opts = opts || {};
    return '<div class="fg-tfield">' +
      '<label class="fg-tfield-label" for="' + opts.id + '">' + label + '</label>' +
      '<div class="fg-tinput"><input id="' + opts.id + '"' +
        ' type="' + (opts.type || 'text') + '"' +
        (opts.mask ? ' data-mask="' + opts.mask + '"' : '') +
        (opts.mode ? ' inputmode="' + opts.mode + '"' : '') +
        ' placeholder="' + ph + '" data-field="' + path + '" /></div>' +
    '</div>';
  }

  /* Figma "Info" · 2313:23485 — the Question glyph plus an underlined purple
     link with no destination frame on the board. The group itself is the button;
     the sheet is the only way to honour a drawn affordance without adding an
     element or moving a pixel. */
  function infoLink(key, label, mod) {
    return '<button type="button" class="fg-info-link' +
      (mod ? ' fg-info-link--' + mod : '') + '" data-action="sheet" data-sheet="' + key + '">' +
      ic('question') + '<span>' + (label || 'Why are we asking this?') + '</span></button>';
  }

  /* The board draws the select CLOSED, showing only "Select your state"
     (2313:23512), so the option list is data rather than layout — the box is
     pixel-identical either way, and without it the control cannot be used. */
  var STATE_OPTIONS = ('Alabama,Alaska,Arizona,Arkansas,California,Colorado,Connecticut,Delaware,' +
    'District of Columbia,Florida,Georgia,Hawaii,Idaho,Illinois,Indiana,Iowa,Kansas,Kentucky,' +
    'Louisiana,Maine,Maryland,Massachusetts,Michigan,Minnesota,Mississippi,Missouri,Montana,' +
    'Nebraska,Nevada,New Hampshire,New Jersey,New Mexico,New York,North Carolina,North Dakota,' +
    'Ohio,Oklahoma,Oregon,Pennsylvania,Rhode Island,South Carolina,South Dakota,Tennessee,Texas,' +
    'Utah,Vermont,Virginia,Washington,West Virginia,Wisconsin,Wyoming').split(',')
    .map(function (s) { return '<option value="' + s + '">' + s + '</option>'; }).join('');

  /* Figma 2289:20912 — CheckCircle + a 329-wide 20/24 line. */
  function benefit(text) {
    return '<div class="fg-benefit">' + ic('check-circle') + '<span>' + text + '</span></div>';
  }

  /* Figma "Radio Button" · 2283:19579 — NO indicator glyph, just the label. */
  function radio(name, value, label, tall) {
    return '<button type="button" class="fg-radio' + (tall ? ' fg-radio--h56' : '') + '"' +
      ' role="radio" aria-checked="false" data-radio="' + name + '" data-value="' + value + '">' +
      '<span>' + label + '</span></button>';
  }


  /* ── REDESIGNED LANDING PARTIALS ──
     Figma replaced the four old landing frames with five new ones. Shared here
     because 2333:7750 / 2333:6504 / 2333:6733 / 2333:6967 are the same shell
     with a different card body. ── */

  /* The photo band that bleeds under the transparent Status Bar. Two crops on the
     board: 393.5 wide on 2333:6309 / 2333:7750, and 676.026 wide on the other
     three (sampled: the wide crop is visibly brighter in the 0-55 band). */
  function lpPhoto(kind, top) {
    var wide = kind === 'wide';
    return '<span class="fg-lp-photo" style="left:' + (wide ? '-125.514' : '-0.5') + 'px;' +
      'top:' + top + 'px;width:' + (wide ? '676.026' : '393.5') + 'px;height:246.765px">' +
      '<img src="' + A + 'img/landing-photo' + (wide ? '-wide' : '') + '.png"' +
      ' srcset="' + A + 'img/landing-photo' + (wide ? '-wide' : '') + '.png 1x, ' +
                   A + 'img/landing-photo' + (wide ? '-wide' : '') + '@3x.png 3x"' +
      ' alt="" /></span>';
  }

  /* Trust footer — 2333:7721 · pinned to the card's bottom by flex-1 + justify-end. */
  function lpFoot() {
    return '<div class="fg-lp-foot">' +
      '<span>' + icN('lock-simple', 2) +
        '<span class="fg-lp-foot-a">Your information is protected and never shared.</span></span>' +
      '<span>' + ic('headset20') +
        '<span class="fg-lp-foot-b">Any questions? Call ' +
        '<a href="tel:+14245775266">(424) 577-5266</a></span></span>' +
    '</div>';
  }

  /* The white card. `top`/`h` are the frame-relative numbers off the board. */
  function lpCard(top, h, body) {
    return '<div class="fg-lp-card" style="top:' + top + 'px;height:' + h + 'px">' + body + '</div>';
  }

  function lpBottom(label) {
    return '<div class="fg-lp-bottom">' + actions(label) + tabbar('agebold.com') + '</div>';
  }

  /* The four Radio Buttons shared by 2333:6309 and 2333:7750. The two long
     options hug to 72; the two short ones carry an explicit h-56 (they would be
     48 from padding alone). */
  function medsRadios() {
    return radio('meds', 'now', 'Yes, I am taking one now. (e.g. Foundayo&reg;, Wegovy&reg;, Zepbound&reg;)') +
      radio('meds', 'past', 'Yes, I\'ve taken one in the past but not currently') +
      radio('meds', 'interested', 'No, but I am interested', true) +
      radio('meds', 'no-glp1', 'No, I don&rsquo;t want GLP-1s to lose weight', true);
  }

  /* Progress — 2333:6410 · three equal bars, the incomplete ones the same purple
     at opacity .12. Same component as before, so `steps3` is reused. */
  /* ─────────────────────────────────────────────
     SCREENS
     ───────────────────────────────────────────── */
  var r = {};

  /* 1 — Figma "mWeb - Landing Page" · 2283:19378 · 393×886.
     Status Bar + ONE flattened raster (2283:19380) + Tab Bar. Every word of the
     ad is inside the image, so it is transcribed into alt text rather than
     re-typed as HTML. */
  r.ad = function () {
    /* The whole frame is an <a> on the board (2393:12937), so the whole screen is
       the target — not a hotspot over the drawn CTA. The two bands are rasters;
       the headline and subhead are live text over them. */
    return statusbar() +
      '<a class="fg-content fg-ad2" href="#" data-action="next"' +
        ' aria-label="Lose weight, reduce pain and get your energy back. FDA-approved GLP-1s for $50 a month copay if eligible. Check your eligibility.">' +
        '<span class="fg-ad2-band fg-ad2-band--top">' +
          '<img src="' + A + 'img/ad-top.png"' +
            ' srcset="' + A + 'img/ad-top.png 1x, ' + A + 'img/ad-top@3x.png 3x" alt="" /></span>' +
        /* 2393:12941 — the board really does draw a third, empty line box here
           (a U+200B paragraph), and it is what makes this node 105 tall. */
        '<span class="fg-ad2-h">Lose weight, reduce pain and get your energy back. </span>' +
        '<span class="fg-ad2-sub">FDA-approved GLP-1s for $50/<wbr />month copay if eligible.</span>' +
        '<span class="fg-ad2-band fg-ad2-band--bot">' +
          '<img src="' + A + 'img/ad-bottom.png"' +
            ' srcset="' + A + 'img/ad-bottom.png 1x, ' + A + 'img/ad-bottom@3x.png 3x"' +
            ' alt="A hand holding an oral GLP-1 pill, with an FDA approved seal. In pill form and more." /></span>' +
      '</a>' +
      '<div class="fg-bottom">' + tabbar('facebook') + '</div>';
  };

  /* 2 — Figma "mWeb - Landing Page" · 2393:14545 · 393×2947, frame fill #ebf0ff.
     ONE page carrying all three landing questions. It replaces FOUR screens from
     the previous board (a 1345 hero page plus q-meds / q-motivation / q-measure),
     which is why the flow is 17 screens instead of 20.

     Nothing is hidden and nothing is injected — every section the board draws is
     in the DOM from the start, and the behaviour is scroll choreography (see
     WMW.onePage). The only Continue the board draws inside the page is on
     question 2 (2393:14610): question 1 hands off on its own after a debounce and
     question 3's radios advance to the result screen. */
  r.landing = function () {
    return statusbar() +
      '<div class="fg-content fg-op">' +
        /* Floating Nav — 2393:14625. "Check coverage" is the same jump as the hero
           CTA. "Sign in" and the hamburger have no destination frame on the board,
           so neither navigates. */
        '<div class="fg-op-nav">' +
          logo('float') +
          '<button type="button" class="fg-op-navbtn fg-op-navbtn--signin"><span>Sign in</span></button>' +
          '<button type="button" class="fg-op-navbtn fg-op-navbtn--brand" data-jump="1">' +
            '<span>Check coverage</span></button>' +
          '<span class="fg-op-menu" aria-hidden="true">' +
            '<img src="' + A + 'icon/menu-2.svg" alt="" width="32" height="32" /></span>' +
        '</div>' +
        /* Hero band — the 2393:14552 photo with the 2393:14632 frosted pill card
           and the 2393:14634 FDA disc composited over it, as one raster. The photo
           node is ANIMATED, so Figma's own endpoints disagree about its pan phase
           and neither the node export nor a rebuilt crop reproduces the frame
           render; the pill card is also translucent over the photo. FIDELITY.md
           carries the measurements. */
        '<span class="fg-op-hero">' +
          '<img src="' + A + 'img/hero-band.png"' +
            ' srcset="' + A + 'img/hero-band.png 1x, ' + A + 'img/hero-band@3x.png 3x"' +
            ' alt="" /></span>' +
        /* 2393:14553 — two paragraphs, the second in #2563eb. The break is authored,
           not a wrap, so the accent run is a block. */
        '<p class="fg-op-h">Lose weight, reduce pain and get your energy back. ' +
          '<em>Covered by Medicare.</em></p>' +
        '<div class="fg-op-cta">' +
          '<button type="button" class="fg-btn" data-jump="1"><span>See if I qualify</span></button>' +
        '</div>' +
        /* 2393:14555 · three benefit rows. The lead-in of each is Inter BOLD #2563eb. */
        '<div class="fg-op-benefits">' +
          '<div class="fg-lp-benefit"><span class="fg-icwrap">' + icN('shield-check', 2) + '</span>' +
            '<p><b class="fg-blk">FDA-approved GLP-1s,</b>for less than $12 a week if eligible</p></div>' +
          '<div class="fg-lp-benefit"><span class="fg-icwrap">' + icN('money', 6) + '</span>' +
            '<p><b>78% of Bold patients pay $0</b> out of pocket for virtual appointments</p></div>' +
          '<div class="fg-lp-benefit"><span class="fg-icwrap">' + icN('shield-plus', 3) + '</span>' +
            '<p><b>Covered by Medicare,</b> UnitedHealthcare, Aetna, Cigna, Blue Cross Blue Shield, Humana and more</p></div>' +
        '</div>' +
        '<div class="fg-op-qs">' +

          /* Q1 — 2393:14569. Six Checkbox Buttons, no Continue drawn. */
          '<section class="fg-op-q" data-qsection="1"' +
            ' data-say="Question 1 of 3. What are your motivations to lose weight?"' +
            ' aria-labelledby="op-q1">' +
            steps3(1) +
            '<div class="fg-op-body">' +
              '<div class="fg-op-head">' +
                '<p class="fg-q" id="op-q1" data-focus tabindex="-1">' +
                  '<b>What are your motivations to</b><b>lose weight?</b></p>' +
                '<p class="fg-op-sub">Identify your weight loss goal and focus.</p>' +
              '</div>' +
              '<div class="fg-check-list" role="group" aria-labelledby="op-q1">' +
                check('motivation', 'pain', 'Reduce pain and improve mobility') +
                check('motivation', 'energy', 'Get more energy') +
                check('motivation', 'conditions', 'Control health conditions') +
                check('motivation', 'longer', 'Live longer and healthier') +
                check('motivation', 'mental', 'Improve my mental health') +
                check('motivation', 'all', 'All of the above') +
              '</div>' +
            '</div>' +
          '</section>' +

          /* Q2 — 2393:14584. The weight typed here is what the result screen's
             number is 21% of. The metric pair is authored: the board draws only
             the imperial state, and "Switch to cm / kg" (2393:14609) has to work
             or a member who thinks in kilograms gets a wrong figure. */
          '<section class="fg-op-q" data-qsection="2"' +
            ' data-say="Question 2 of 3. What is your height and weight?"' +
            ' aria-labelledby="op-q2">' +
            steps3(2) +
            '<div class="fg-op-body">' +
              '<div class="fg-op-head">' +
                '<p class="fg-q" id="op-q2" data-focus tabindex="-1">What&rsquo;s your height and weight?</p>' +
                '<p class="fg-op-sub">Estimate how much weight you could lose.</p>' +
              '</div>' +
              '<div class="fg-fieldset">' +
                '<div class="fg-field" data-units="imperial">' +
                  '<label class="fg-field-label" for="wm-ft">Height</label>' +
                  '<div class="fg-field-row">' +
                    '<div class="fg-input">' +
                      '<input id="wm-ft" type="text" inputmode="numeric" placeholder="Feet"' +
                        ' data-field="heightFt" data-mask="digits3" aria-label="Height in feet" />' +
                      '<span class="fg-input-unit">ft</span>' +
                    '</div>' +
                    '<div class="fg-input">' +
                      '<input type="text" inputmode="numeric" placeholder="Inches"' +
                        ' data-field="heightIn" data-mask="digits3" aria-label="Height in inches" />' +
                      '<span class="fg-input-unit">in</span>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
                '<div class="fg-field" data-units="metric" hidden>' +
                  '<label class="fg-field-label" for="wm-cm">Height</label>' +
                  '<div class="fg-input fg-input--full">' +
                    '<input id="wm-cm" type="text" inputmode="numeric" placeholder="Centimeters"' +
                      ' data-field="heightCm" data-mask="digits3" aria-label="Height in centimeters" />' +
                    '<span class="fg-input-unit">cm</span>' +
                  '</div>' +
                '</div>' +
                '<div class="fg-field" data-units="imperial">' +
                  '<label class="fg-field-label" for="wm-lb">Weight</label>' +
                  '<div class="fg-input fg-input--full">' +
                    '<input id="wm-lb" type="text" inputmode="numeric" placeholder="Pounds"' +
                      ' data-field="weightLb" data-mask="digits3" />' +
                    '<span class="fg-input-unit">lbs</span>' +
                  '</div>' +
                '</div>' +
                '<div class="fg-field" data-units="metric" hidden>' +
                  '<label class="fg-field-label" for="wm-kg">Weight</label>' +
                  '<div class="fg-input fg-input--full">' +
                    '<input id="wm-kg" type="text" inputmode="numeric" placeholder="Kilograms"' +
                      ' data-field="weightKg" data-mask="digits3" />' +
                    '<span class="fg-input-unit">kg</span>' +
                  '</div>' +
                '</div>' +
                '<button type="button" class="fg-btn-ghost" data-action="units" aria-pressed="false">' +
                  '<span>Switch to cm / kg</span></button>' +
              '</div>' +
            '</div>' +
            '<div class="fg-op-continue">' +
              '<button type="button" class="fg-btn" data-jump="3"><span>Continue</span></button>' +
            '</div>' +
          '</section>' +

          /* Q3 — 2393:14611. Four Radio Buttons, no Continue drawn: choosing one
             is the submit, and it advances to the result screen. */
          '<section class="fg-op-q" data-qsection="3"' +
            ' data-say="Question 3 of 3. Have you taken any weight loss medications?"' +
            ' aria-labelledby="op-q3">' +
            steps3(3) +
            '<div class="fg-op-body">' +
              '<div class="fg-op-head fg-op-head--g4">' +
                '<p class="fg-q" id="op-q3" data-focus tabindex="-1">Have you taken any weight loss medications?</p>' +
                '<p class="fg-op-sub">Identify your weight loss medication experience and preference.</p>' +
              '</div>' +
              '<div class="fg-radio-group" role="radiogroup" aria-labelledby="op-q3">' +
                medsRadios() +
              '</div>' +
            '</div>' +
          '</section>' +
        '</div>' +
      '</div>' +
      '<div class="fg-bottom">' + tabbar('agebold.com') + '</div>';
  };

  /* 3 — Figma "mWeb - EC" · 2393:15035 · 393×915. THE RESULT SCREEN, and a new
     step: it did not exist on the previous board, where this frame was the
     "off to a great start" landing card.

     The headline carries the computed number. The board draws it as the unfilled
     placeholder `You are likely to lose [23]lbs with Bold!`; `[23]` ships as 21%
     of the weight from question 2, and `[23]lbs` ships as `23 lbs` — the missing
     space is a slip, and the brackets are a placeholder by definition.

     Both of the board's headline variants are here and one shows. 2393:14693 is
     the SAME frame with a no-number headline, which is exactly what is wanted
     when question 2 was scrolled past without a weight. 2393:14914 ("You're
     qualify for Bold weight loss program!") is a third variant and is not built. */
  r.result = function () {
    return statusbar() + nav() +
      '<div class="fg-content fg-res">' +
        '<div class="fg-lp-intro">' +
          ic('check-circle-t48') +
          '<p class="fg-q" data-focus tabindex="-1" data-when="hasLoss">You are likely to ' +
            '<em data-bind="derived.lossPhrase"></em> with Bold! Let&rsquo;s check your coverage.</p>' +
          '<p class="fg-q" data-focus tabindex="-1" data-when="noLoss">You&rsquo;re off to a great ' +
            'start with losing weight! Let&rsquo;s check your coverage.</p>' +
        '</div>' +
        /* Steps card — 2393:15771. All three descriptions were rewritten on this
           board, and step 2's connector grew 108.585 → 128. */
        '<div class="fg-steps-card">' +
          '<p class="fg-steps-title">2 minutes &mdash; 3 simple steps</p>' +
          '<div class="fg-steps">' +
            '<div class="fg-step">' +
              /* The connector comes FIRST so the digit paints over it. Figma's own
                 order is digit-then-line, but its render puts the digit on top —
                 sampled at x=44, where the reference line breaks at y 346-347 and
                 416-419 for the "1" and "2" and the build's ran straight through. */
              '<span class="fg-step-num">' +
                '<span class="fg-step-line fg-step-line--123"><img src="' + A + 'icon/step-line-123.svg" alt="" /></span>' +
                '<span class="fg-step-n">1</span>' +
              '</span>' +
              '<span class="fg-step-body"><span class="fg-step-t">Check your coverage</span>' +
                '<span class="fg-step-d">Confirm your appointment coverage.</span></span>' +
            '</div>' +
            '<div class="fg-step">' +
              '<span class="fg-step-num fg-step-num--alt">' +
                '<span class="fg-step-line fg-step-line--128"><img src="' + A + 'icon/step-line-128.svg" alt="" /></span>' +
                '<span class="fg-step-n">2</span>' +
              '</span>' +
              '<span class="fg-step-body"><span class="fg-step-t">Answer a few quick questions</span>' +
                '<span class="fg-step-d">Find the best treatment options and check medication eligibility.</span></span>' +
            '</div>' +
            '<div class="fg-step">' +
              '<span class="fg-step-num fg-step-num--alt"><span class="fg-step-n">3</span></span>' +
              '<span class="fg-step-body"><span class="fg-step-t">Schedule a 15-min free intake call</span>' +
                '<span class="fg-step-d">Call to schedule your provider appointment and understand your plan.</span></span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        /* 2393:15074 · 347 wide, rows at y=23 and y=52 */
        '<div class="fg-res-foot">' +
          '<span>' + icN('lock-simple', 2) +
            '<span class="fg-lp-foot-a">Your information is protected and never shared.</span></span>' +
          '<span>' + ic('headset20') +
            '<span class="fg-lp-foot-b">Any questions? Call ' +
            '<a href="tel:+14245775266">(424) 577-5266</a></span></span>' +
        '</div>' +
      '</div>' +
      '<div class="fg-bottom">' + actions('Continue', { grad: true }) + tabbar('agebold.com') + '</div>';
  };

  /* 7 — Figma "mWeb - EC" · 2313:23350 · 393×852. The first FUNNEL frame:
     Status Bar + Heading Navigation + content (2313:23354) + a 257-tall bottom
     group (legal blurb 44 + Actions 80 + Tab Bar 133).
     The frame fill is #fafafa, not white — see .wm-layer[data-shell="funnel"].
     The `Date of birth` field 2313:23475 is hidden="true" and is not rendered. */
  r.ecName = function () {
    return statusbar() + nav() +
      '<div class="fg-content fg-fcontent">' +
        /* 2313:23493, inside the pass-through column 2313:23502 */
        '<p class="fg-q" data-focus tabindex="-1">Help us confirm your coverage</p>' +
        '<div class="fg-userinfo">' +
          tfield('First name', 'firstName', 'First name', { id: 'wm-first' }) +
          tfield('Last name', 'lastName', 'Last name', { id: 'wm-last' }) +
          /* 2313:23481 is literally `Email ` with a trailing space; it renders the
             same and HTML would collapse it. */
          tfield('Email', 'email', 'Email address', { id: 'wm-email', type: 'email' }) +
          infoLink('why-name') +
        '</div>' +
      '</div>' +
      '<div class="fg-bottom">' +
        /* The break inside "Terms of / Service" is HARD, not a wrap: measured in
           the browser, "…Bold’s Terms of Service" is 338.58px in a 361px box, so a
           width-driven layout keeps "Service" on line 1 — and the reference render
           puts it on line 2. Reproducing the render, per the same rule that
           settled the nav's 153px purple bar. */
        '<div class="fg-legal"><p>By continuing, you agree to Bold&rsquo;s ' +
          '<span class="fg-u">Terms of<br />Service</span> and ' +
          '<span class="fg-u">Privacy Policy</span>.</p></div>' +
        actions('Continue', { grad: true }) +
        tabbar('agebold.com') +
      '</div>';
  };

  /* 8 — Figma "mWeb - EC" · 2289:20950 · 393×852. Same heading as ec-name; a
     state select (2313:23510) and the Date of birth field (2313:23341) that
     ec-name hides. Bottom group is 349: the 110-tall Verified consent paragraph
     plus its 22-tall lockup (136), then Actions 80 + Tab Bar 133. */
  r.ecState = function () {
    return statusbar() + nav() +
      '<div class="fg-content fg-fcontent">' +
        '<p class="fg-q" data-focus tabindex="-1">Help us confirm your coverage</p>' +
        /* 2313:23507 · gap-8, unlike the gap-4 fields on ec-name */
        '<div class="fg-tfield fg-tfield--g8">' +
          '<label class="fg-tfield-label" for="wm-state">State of residence</label>' +
          '<div class="fg-input fg-input--full">' +
            '<select class="fg-select" id="wm-state" data-field="state" required>' +
              '<option value="">Select your state</option>' + STATE_OPTIONS +
            '</select>' +
            ic('caret-down') +
          '</div>' +
        '</div>' +
        /* 2313:23337 · gap-16 column holding the DOB field and the Info row */
        '<div class="fg-dobblock">' +
          '<div class="fg-tfield fg-tfield--g8">' +
            '<label class="fg-tfield-label" for="wm-dob">Date of birth</label>' +
            '<div class="fg-input fg-input--wide fg-input--dob">' +
              '<input id="wm-dob" type="text" inputmode="numeric" placeholder=" "' +
                ' data-field="dob" data-mask="dob" aria-describedby="wm-dob-fmt" />' +
              '<span class="fg-dob-ghost" aria-hidden="true">01/01/19|<i>YY</i></span>' +
              '<span class="fg-sr" id="wm-dob-fmt">Format: month, day, year</span>' +
            '</div>' +
          '</div>' +
          infoLink('why-state', null, 'sb') +
        '</div>' +
      '</div>' +
      '<div class="fg-bottom">' +
        /* 2289:20984 — five lines at 361 wide. "Verified" is a real external <a>
           on the board (verified.inc); it is kept, and flagged in FIDELITY.md as
           the unexplained-third-party pattern it is. */
        '<div class="fg-legal">' +
          '<p>By proceeding, you agree that <a href="https://verified.inc/" target="_blank" rel="noopener">Verified</a>' +
          ' (Bold&rsquo;s service provider) and its vendors may receive your personal info and provide Bold' +
          ' with more info about you, including your health insurance. Your data is private and protected.' +
          ' Learn more in our <span class="fg-u">Privacy policy.</span></p>' +
          '<span class="fg-verified">' +
            '<span class="fg-verified-by">Powered by</span>' +
            '<span class="fg-verified-mark">' +
              '<img src="' + A + 'img/verified-check.svg" alt="" />' +
              '<img src="' + A + 'img/verified-wordmark.svg" alt="Verified" />' +
            '</span>' +
          '</span>' +
        '</div>' +
        actions('Continue', { grad: true }) +
        tabbar('agebold.com') +
      '</div>';
  };

  /* 9 — Figma "mWeb - EC Loader" · 2289:20904 · 393×852, white frame.
     No Heading Navigation, no Actions — the Tab Bar is the whole bottom group.
     The purple fill is drawn at 88/360; the widget animates from there. */
  r.loader = function () {
    return statusbar() +
      '<div class="fg-content fg-loadbody">' +
        '<div class="fg-progress">' +
          '<p class="fg-progress-label" data-focus tabindex="-1" role="status">Checking coverage...</p>' +
          '<div class="fg-progress-track" role="presentation"><i></i>' +
            '<span class="fg-progress-fill" data-progress-fill></span>' +
          '</div>' +
        '</div>' +
        '<div class="fg-loadcontent">' +
          '<div class="fg-loadhero">' +
            '<img src="' + A + 'img/loader-hero.png"' +
              ' srcset="' + A + 'img/loader-hero.png 1x, ' + A + 'img/loader-hero@3x.png 3x"' +
              ' alt="" />' +
          '</div>' +
          '<div class="fg-loadlist">' +
            '<p class="fg-loadlist-h">The only program designed for adults 65+</p>' +
            '<div class="fg-benefits">' +
              /* <wbr> after the slash: Figma's line-breaker treats "$50/month" as
                 breakable and the reference render puts "$50/" at the end of line
                 1, giving a 48-tall (2-line) row. Chrome does not break after SY,
                 so without the hint this row is 72 tall and every sibling below it
                 shifts 24px. */
              benefit('FDA-approved GLP-1, now $50/<wbr />month with Medicare if eligible') +
              benefit('Lose fat, and keep it off') +
              benefit('Doctor-supervised care') +
            '</div>' +
          '</div>' +
          '<div class="fg-hipaa">' +
            '<img src="' + A + 'icon/hipaa-badge.svg" alt="" width="44" height="44" />' +
            '<span>Bold is HIPAA compliant.</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="fg-bottom">' + tabbar('agebold.com') + '</div>';
  };

  /* 10 — Figma 2289:20924 · 393×852. Board name is "mWeb - Phone number, 2FA
     verification" but it draws the coverage-confirmed screen. The `Health
     insurance` label 2289:20939 is hidden="true" and is not rendered. */
  r.covered = function () {
    return statusbar() + nav() +
      '<div class="fg-content fg-container">' +
        '<div class="fg-cov-head">' +
          '<p class="fg-q" data-focus tabindex="-1">Your appointment is fully covered!</p>' +
          /* 2289:20928 — "$0 copay" is the one SemiBold run; the board also puts
             two bold spaces in here (one of them purple), which render as plain
             spaces and are not reproduced as separate runs. */
          '<p class="fg-body">Your UnitedHealthcare plan offers <b>$0 copay </b>visits ' +
            'for virtual appointments with in-network providers, like Bold. ' +
            '<button type="button" class="fg-inline-link" data-action="sheet" data-sheet="coverage">' +
            'Learn more.</button></p>' +
        '</div>' +
        '<div class="fg-cardwrap"><div class="fg-inscard">' +
          '<p class="fg-ins-plan">UnitedHealthcare</p>' +
          '<div class="fg-ins-id">' +
            '<p class="fg-ins-name">Kathleen K.</p>' +
            '<p class="fg-ins-mid">Member ID: <span class="fg-br"><br /></span>' +
              '<b>*********789</b></p>' +
          '</div>' +
          '<span class="fg-seal">' + ic('seal-check') + '</span>' +
        '</div></div>' +
        '<div class="fg-editrow">' + ic('pencil') +
          '<p>Is your info correct? ' +
          '<button type="button" class="fg-inline-link fg-inline-link--brand"' +
          ' data-action="sheet" data-sheet="edit-info">Edit information. </button></p>' +
        '</div>' +
      '</div>' +
      '<div class="fg-bottom">' + actions('Continue', { grad: true }) + tabbar('agebold.com') + '</div>';
  };

  /* ── Screening-question head — 2289:21076 / 2289:21098 / 2292:22412.
        `n` is one of the five agreed corrections: the board draws the literal
        string "Question #" on all four screens (2289:21078, 2289:21160,
        2289:21100, 2289:21014) and this ships the real number. That is the only
        place these four screens diverge from their reference renders. ── */
  function qhead(n, heading, sub, mod) {
    return '<div class="fg-qhead' + (mod ? ' fg-qhead--' + mod : '') + '">' +
      '<div class="fg-qtitle">' +
        '<p class="fg-qnum">Question ' + n + '</p>' +
        '<p class="fg-q" data-focus tabindex="-1">' + heading + '</p>' +
      '</div>' +
      '<p class="fg-qsub">' + sub + '</p>' +
    '</div>';
  }

  /* 10 — Figma "Question - situations" · 2289:21069 · 852 frame, 876 of content.
     Figma clips; `.fg-content` grows past the frame and the sticky bottom group
     floats over it, which is the same picture. */
  r.qSituations = function () {
    return statusbar() + nav() +
      '<div class="fg-content fg-qframe">' +
        qhead(1, 'Do any of the following apply to you?',
              'Select all that apply.', 'g0') +
        '<div class="fg-check-list" role="group" aria-label="Situations that apply">' +
          check('situations', 'surgery', 'Weight-loss surgery in the last 2 years') +
          check('situations', 'kidney', 'Stage 4 or 5 kidney disease or currently on dialysis') +
          check('situations', 'cancer', 'Ongoing cancer treatment') +
          check('situations', 'substance', 'Challenges with alcohol or drug use') +
          check('situations', 'eating', 'An eating disorder (now or in the last 2 years)') +
          check('situations', 'mental', 'Untreated mental health condition (depression, anxiety, bipolar etc)') +
          check('situations', 'weightloss', 'Unintentional weight loss of more than 5% in the last 6 months') +
          check('situations', 'none', 'None of the above', 'sb') +
        '</div>' +
      '</div>' +
      '<div class="fg-bottom">' + actions('Continue', { grad: true }) + tabbar('agebold.com') + '</div>';
  };

  /* 11 — Figma "Question - diagnosed" · 2289:21151 · 852 frame, 1092 of content.
     Figma sets most labels to rgba(0,0,0,.8) and some to Ink/300 #140d26 inside
     the same list; both are reproduced via the `soft` modifier. */
  r.qDiagnosed = function () {
    return statusbar() + nav() +
      '<div class="fg-content fg-qframe">' +
        qhead(2, 'Have you been diagnosed with any of these conditions?',
              'Select all that apply.', 'g0') +
        '<div class="fg-check-list" role="group" aria-label="Diagnosed conditions">' +
          check('diagnosed', 't1d', 'Type 1 diabetes') +
          check('diagnosed', 't2d', 'Type 2 diabetes', 'soft') +
          check('diagnosed', 'apnea', 'Moderate-to-severe sleep apnea', 'soft') +
          check('diagnosed', 'liver', 'Fatty liver disease', 'soft') +
          check('diagnosed', 'pancreatitis', 'Pancreatitis') +
          check('diagnosed', 'mtc', 'Medullary thyroid cancer MTC or MEN 2 (yourself or family history)') +
          check('diagnosed', 'gastroparesis', 'Severe stomach problems that slow digestion (gastroparesis)') +
          check('diagnosed', 'constipation', 'Chronic constipation') +
          check('diagnosed', 'obstruction', 'History of bowel obstruction') +
          check('diagnosed', 'cardiac6mo', 'A heart attack or stroke in the last 6 months') +
          check('diagnosed', 'hf6mo', 'A hospital stay for heart failure in the last 6 months') +
          check('diagnosed', 'none', 'None of the above', 'sb') +
        '</div>' +
      '</div>' +
      '<div class="fg-bottom">' + actions('Continue', { grad: true }) + tabbar('agebold.com') + '</div>';
  };

  /* 12 — Figma "Comorbidities" · 2289:21095 · 852. The heading is word-for-word
     the same as q-situations; only the sub-line and the list differ. The head
     block is gap-4 here (2289:21098), not gap-8. */
  r.qComorbid = function () {
    return statusbar() + nav() +
      '<div class="fg-content fg-qframe">' +
        '<div class="fg-qblock">' +
          qhead(3, 'Do any of the following apply to you?', 'Select all that apply.', 'g4') +
        '</div>' +
        '<div class="fg-check-list" role="group" aria-label="Other conditions">' +
          check('comorbid', 'prediabetes', 'Prediabetes', 'soft') +
          check('comorbid', 'htn', 'Uncontrolled hypertension (over 140/90 despite medication)', 'soft') +
          check('comorbid', 'mi', 'Previous heart attack', 'soft') +
          check('comorbid', 'stroke', 'Previous stroke', 'soft') +
          check('comorbid', 'pad', 'Peripheral artery disease that causes leg pain or cramping when you walk', 'soft') +
          check('comorbid', 'ckd3', 'Chronic moderate to severe kidney disease (stage 3a or above)', 'soft') +
          check('comorbid', 'hfpef', 'Heart failure with normal pumping strength but stiffness.', 'soft') +
          check('comorbid', 'none', 'None of the above', 'sb') +
        '</div>' +
      '</div>' +
      '<div class="fg-bottom">' + actions('Continue', { grad: true }) + tabbar('agebold.com') + '</div>';
  };

  /* 13 — Figma "Intake (Question 3) - Mobile" · 2289:21005 · 852.
     The one free-text screen, and the one Actions with TWO buttons (128 tall,
     no bottom padding), so the bottom group is 261. */
  r.qDiscuss = function () {
    return statusbar() + nav() +
      '<div class="fg-content fg-qframe">' +
        '<div class="fg-qblock">' +
          qhead(4, 'What\'s the one thing you most want to discuss with your provider about your weight?',
                'This helps your provider focus the visit on what matters most to you.') +
          '<div class="fg-textarea">' +
            '<textarea data-field="notes" rows="5" aria-label="What you want to discuss"' +
              ' placeholder="What would you like to talk about during your Bold appointment?"></textarea>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="fg-bottom">' +
        actions('Continue', { grad: true, two: true, second: 'Skip', secondAction: 'skip' }) +
        tabbar('agebold.com') +
      '</div>';
  };

  /* Figma "Info" · 370:2215 — three separate Vectors, so three <img>s. */
  function infoIcon(ghost) {
    return '<span class="fg-ic fg-ic--info"' + (ghost ? ' data-ghost aria-hidden="true"' : ' aria-hidden="true"') + '>' +
      '<img src="' + A + 'icon/info-circle.svg" alt="" />' +
      '<img src="' + A + 'icon/info-stem.svg" alt="" />' +
      '<img src="' + A + 'icon/info-dot.svg" alt="" />' +
    '</span>';
  }

  /* Figma "program list" row · I2292:22146;2229:9394 — a SemiBold lead-in and a
     Regular tail inside one text node. */
  function progRow(bold, rest) {
    return '<div class="fg-prog">' + ic('check-circle-teal') +
      '<p>' + bold + '<span>' + rest + '</span></p></div>';
  }

  /* 14 — Figma "Bridge" · 2292:22130 · 393×1886, the tallest funnel frame.
     Four stacked sections in 2292:22133 (1529), a 12px gap, then the 213 bottom
     group at y=1673. The FAQ ships EXPANDED, as drawn. */
  r.bridge = function () {
    return statusbar() + nav() +
      '<div class="fg-content">' +
        /* ── 2292:22134 · 393×847 ── */
        '<div class="fg-bridge-a">' +
          '<p class="fg-q" data-focus tabindex="-1">Great news! You&rsquo;re a strong candidate for the $50 monthly copay Bridge program.</p>' +
          '<div class="fg-bcard">' +
            '<div class="fg-bcard-hero">' +
              '<img src="' + A + 'img/bridge-hero.png"' +
                ' srcset="' + A + 'img/bridge-hero.png 1x, ' + A + 'img/bridge-hero@3x.png 3x"' +
                ' alt="" />' +
            '</div>' +
            '<div class="fg-bcard-body">' +
              '<div class="fg-bcard-head">' +
                /* One of the five agreed corrections: the board draws
                   "Covered by [Medicare]" with the brackets (2292:22144). */
                '<span class="fg-pill">Covered by Medicare</span>' +
                '<p class="fg-q20">Bold doctor-supervised weight loss program for adult 65+</p>' +
              '</div>' +
              '<div class="fg-proglist">' +
                progRow('Designed to lose fat, and keep it off. ', 'Reduce pain and get energy.') +
                progRow('Access FDA-approved GLP-1s like Wegovy&reg; and Zepbound&reg; ', 'if prescribed.') +
                progRow('Your provider stays in the loop', ' to keep you safe and adjusts the plan as you go.') +
              '</div>' +
              '<button type="button" class="fg-seemore" data-action="sheet" data-sheet="bridge-more">' +
                '<span>See more</span>' + ic('caret-down-sm') +
              '</button>' +
            '</div>' +
          '</div>' +
          '<div class="fg-cost">' +
            '<div class="fg-cost-badge">' +
              '<span>Your coverage</span>' + infoIcon(true) +
            '</div>' +
            '<div class="fg-cost-cells">' +
              '<div class="fg-cost-cell fg-cost-cell--rule">' +
                '<p class="fg-cost-label">Initial visit</p>' +
                '<p class="fg-cost-val"><b>$0-25 </b><span>out of pocket</span></p>' +
              '</div>' +
              '<div class="fg-cost-cell">' +
                '<div class="fg-cost-label-row"><p class="fg-cost-label">GLP-1s</p>' +
                  '<button type="button" class="fg-iconbtn" data-action="sheet" data-sheet="glp1-cost"' +
                  ' aria-label="About GLP-1 cost">' + infoIcon() + '</button></div>' +
                '<p class="fg-cost-val"><b>$50</b><span>monthly copay</span></p>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        /* ── 2292:22150 · 393×128 ── */
        '<div class="fg-reviews">' +
          '<div class="fg-reviews-row">' +
            '<img class="fg-laurel fg-laurel--l" src="' + A + 'img/laurel-right.svg" alt="" />' +
            '<div class="fg-reviews-mid">' +
              '<p class="fg-reviews-n">10k+ </p>' +
              '<p class="fg-reviews-t">reviews from adults 65+</p>' +
              '<img class="fg-reviews-stars" src="' + A + 'img/stars-strip.svg" alt="" />' +
            '</div>' +
            '<img class="fg-laurel" src="' + A + 'img/laurel-right.svg" alt="" />' +
          '</div>' +
        '</div>' +
        /* ── 2292:22151 · 393×254 ── */
        '<div class="fg-quotewrap"><div class="fg-quote"><div class="fg-quote-row">' +
          '<span class="fg-quote-av"><img src="' + A + 'img/doctor-avatar.png"' +
            ' srcset="' + A + 'img/doctor-avatar.png 1x, ' + A + 'img/doctor-avatar@3x.png 3x"' +
            ' alt="Dr. Sandeep Palakodeti" width="40" height="40" /></span>' +
          '<div class="fg-quote-body">' +
            '<div class="fg-quote-who">' +
              '<p>Chief Medical Officer at Bold</p>' +
              '<p>Dr. Sandeep Palakodeti, M.D., M.P.H.</p>' +
            '</div>' +
            '<p class="fg-quote-txt">&ldquo;It was never about willpower. We designed this program to help ' +
              'adults 65+ lose weight safely and keep it off with personalized Care Plan and ' +
              'FDA-approved medication when appropriate.&rdquo;</p>' +
          '</div>' +
        '</div></div></div>' +
        /* ── 2292:22153 · 393×300 ── */
        '<div class="fg-faqwrap"><div class="fg-faq">' +
          '<p class="fg-faq-h">*FAQs</p>' +
          '<div class="fg-faq-card" data-acc data-open="true">' +
            '<button type="button" class="fg-faq-q" data-acc-btn aria-expanded="true" aria-controls="faq-glp1">' +
              '<span>Are GLP-1s required?</span>' + ic('caret-right') +
            '</button>' +
            '<div class="fg-faq-a" id="faq-glp1"><p>No! Your provider will discuss your treatment ' +
              'preferences, health conditions, and current medications to ensure a GLP-1 medication ' +
              'is right for you. We won\'t force you into any treatment you don\'t want or need.</p></div>' +
          '</div>' +
        '</div></div>' +
      '</div>' +
      /* "Schedule no-cost call", NOT "Continue" — 2292:22166. An earlier build had
         this wrong and the pixel gate missed it: the shorter string sits inside the
         longer one's text-dense band, which the edge mask excludes by design.
         verify-behaviour.py now asserts every CTA label against the board. */
      '<div class="fg-bottom">' + actions('Schedule no-cost call', { grad: true }) + tabbar('agebold.com') + '</div>';
  };

  /* Multi-Vector icon — one <img> per Figma Vector, positioned by wm-parts.css. */
  function icN(kind, n) {
    var out = '<span class="fg-ic fg-ic--' + kind + '" aria-hidden="true">';
    for (var i = 1; i <= n; i++) out += '<img src="' + A + 'icon/' + kind + '-' + i + '.svg" alt="" />';
    return out + '</span>';
  }

  /* Figma "Time Slot" · 2313:23641 — the DAY variant: 80×102, two stacked lines. */
  function dayTab(value, dow, date) {
    return '<button type="button" class="fg-daytab" role="radio" aria-checked="false"' +
      ' data-day="' + value + '" data-value="' + value + '">' +
      '<b>' + dow + '</b><i>' + date + '</i></button>';
  }

  /* Figma "Time Slot" · 2313:23655 — the TIME variant: hugs its text, 56 tall. */
  function timeSlot(value, label) {
    return '<button type="button" class="fg-slot" role="radio" aria-checked="false"' +
      ' data-slot="' + value + '" data-value="' + value + '">' +
      '<b>' + label + '</b><i>PT</i></button>';
  }

  /* 15 — Figma "Schedule Provider" · 2313:23615 · 393×1083.
     Three of the five agreed corrections live here: the {PST} placeholder, the
     duplicated `Fri Jan 15` tab, and `10:45am` listed before `10:30am`. */
  r.schedule = function () {
    return statusbar() + nav() +
      '<div class="fg-content fg-sched"><div class="fg-sched-col">' +
        '<div class="fg-sched-col">' +
          '<p class="fg-q32" data-focus tabindex="-1">Schedule a 15-min intake call</p>' +
          '<div class="fg-cccard">' +
            '<div class="fg-ccrow">' +
              '<span class="fg-ccav"><img src="' + A + 'img/cc-avatars.png"' +
                ' srcset="' + A + 'img/cc-avatars.png 1x, ' + A + 'img/cc-avatars@3x.png 3x"' +
                ' alt="" /></span>' +
              '<p class="fg-ccname">Bold Care Coordinator call</p>' +
            '</div>' +
            '<div class="fg-ccmeta">' +
              '<span>' + icN('clock', 2) + '<em>15 min</em></span>' +
              '<span>' + icN('money', 6) + '<em>No-cost</em></span>' +
            '</div>' +
            '<p class="fg-ccdesc">Confirm your coverage and schedule your first visit with a licensed care provider.</p>' +
          '</div>' +
        '</div>' +
        /* AGREED FIX: the board draws "{Pacific Standard Times (PST)}" — an
           unfilled placeholder with its braces showing (2313:23638). */
        '<p class="fg-tznote">All times shown are in Pacific Time (PT)</p>' +
        '<div class="fg-sched-pick">' +
          '<div class="fg-daywrap">' +
            '<div class="fg-days" role="radiogroup" aria-label="Choose a day">' +
              dayTab('tue-12', 'Tue', 'Jan 12') +
              dayTab('wed-13', 'Wed', 'Jan 13') +
              dayTab('thu-14', 'Thu', 'Jan 14') +
              dayTab('fri-15', 'Fri', 'Jan 15') +
              /* AGREED FIX: the board draws `Fri Jan 15` TWICE (2313:23647 and
                 2313:23649); the fifth tab becomes the next weekday. */
              dayTab('mon-18', 'Mon', 'Jan 18') +
            '</div>' +
            '<span class="fg-dayfade" aria-hidden="true"></span>' +
          '</div>' +
          '<div class="fg-slotgrp">' +
            '<p class="fg-slotgrp-h">Morning</p>' +
            '<div class="fg-slots" role="radiogroup" aria-label="Morning times">' +
              timeSlot('0700', '7:00am') +
              timeSlot('0900', '9:00am') +
              /* AGREED FIX: the board lists 10:45am (2313:23662) before 10:30am
                 (2313:23665). Both slots are 118 wide, so swapping the labels
                 leaves the geometry untouched. */
              timeSlot('1030', '10:30am') +
              timeSlot('1045', '10:45am') +
            '</div>' +
          '</div>' +
          '<div class="fg-slotgrp">' +
            '<p class="fg-slotgrp-h">Afternoon</p>' +
            '<div class="fg-slots" role="radiogroup" aria-label="Afternoon times">' +
              timeSlot('1200', '12:00pm') +
              timeSlot('1245', '12:45pm') +
              timeSlot('1330', '1:30pm') +
              timeSlot('1415', '2:15pm') +
              timeSlot('1500', '3:00pm') +
              timeSlot('1700', '5:00pm') +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div></div>' +
      /* The board draws this CTA DISABLED and labelled "Schedule call"
         (2313:23691) — sampled #e5e5e5 fill with #a3a3a3 text, no purple pixels.
         It gates on a time slot, and none is drawn selected, so `validate`
         reproduces the drawn state and unlocks on the first pick. */
      '<div class="fg-bottom">' + actions('Schedule call', { grad: true }) + tabbar('agebold.com') + '</div>';
  };

  /* Figma "Section" 2313:23747 / 2313:23790 — the 319-tall scrolling document
     with its drawn 6×93 thumb. `badge` is the 80×80 HIPAA seal, HIPAA only. */
  function doc(heading, paras, badge, hmod) {
    return '<div class="fg-docwrap">' +
      '<div class="fg-doc" tabindex="0" role="region" aria-label="' + heading + '">' +
        (badge ? '<img class="fg-doc-badge" src="' + A + 'icon/hipaa-badge.svg" alt="" width="80" height="80" />' : '') +
        '<p class="fg-doc-h' + (hmod ? ' fg-doc-h--' + hmod : '') + '">' + heading + '</p>' +
        paras.map(function (t) { return '<p class="fg-doc-b">' + t + '</p>'; }).join('') +
      '</div>' +
      '<span class="fg-docbar" data-docbar aria-hidden="true"></span>' +
    '</div>';
  }

  /* Figma "check box" 2313:23754 / 2313:23795 — purple-100 acknowledgement row. */
  function ack(path, label) {
    return '<button type="button" class="fg-ack" role="checkbox" aria-checked="false"' +
      ' data-flag="' + path + '">' +
      '<span><span class="fg-ackbox" aria-hidden="true"></span></span>' +
      '<span>' + label + '</span></button>';
  }

  /* 16 — Figma "mWeb - Consent Form, HIPAA" · 2313:23719 · 852.
     CTA drawn DISABLED (#e5e5e5 fill, #a3a3a3 label), so it gates on the
     acknowledgement checkbox that the board draws unchecked. */
  r.consentHipaa = function () {
    return statusbar() + nav() +
      '<div class="fg-content fg-consent">' +
        '<div class="fg-consent-head">' +
          '<p class="fg-q" data-focus tabindex="-1">Your privacy matters</p>' +
          '<p class="fg-sub16">Bold is HIPAA compliant. We&rsquo;re committed to protecting your personal information.</p>' +
        '</div>' +
        doc('Our Privacy Obligations', window.WMLEGAL.hipaa, true) +
        ack('consentHipaa', 'I acknowledge the HIPAA notice of privacy practices') +
      '</div>' +
      '<div class="fg-bottom">' + actions('Continue', { grad: true }) + tabbar('agebold.com') + '</div>';
  };

  /* 17 — Figma "mWeb - Consent Form, Consen for care" · 2313:23762 · 852.
     Same shell as 16 without the HIPAA seal; the document is the New Patient
     Agreement, and this one starts at the doc heading (no 80px badge). */
  r.consentCare = function () {
    return statusbar() + nav() +
      '<div class="fg-content fg-consent">' +
        '<div class="fg-consent-head">' +
          '<p class="fg-q" data-focus tabindex="-1">Telehealth informed consent</p>' +
          '<p class="fg-sub16">This document protects and explains your rights and your telehealth care with Bold.</p>' +
        '</div>' +
        doc('New patient agreement', window.WMLEGAL.care, false, '20') +
        ack('consentTele', 'I accept and agree to the New Patient Agreement and Informed Consent') +
      '</div>' +
      '<div class="fg-bottom">' + actions('Continue', { grad: true }) + tabbar('agebold.com') + '</div>';
  };

  /* 18 — Figma "mWeb - Phone number" · 2313:23693 · 852.
     The board draws the field FILLED with (310) 991-2492 and the CTA DISABLED, so
     the gate is the opt-in checkbox, not the number. That makes continuing
     conditional on consenting to marketing texts — reproduced as drawn and
     flagged in FIDELITY.md, because it is a real consent problem, not a style. */
  r.phone = function () {
    return statusbar() + nav() +
      '<div class="fg-content fg-phone">' +
        '<div class="fg-consent-head">' +
          '<p class="fg-h24" data-focus tabindex="-1">What&rsquo;s your mobile phone number?</p>' +
          '<p class="fg-sub16">We use your phone number to coordinate your care when needed.</p>' +
        '</div>' +
        '<div class="fg-phone-body">' +
          '<div class="fg-phone-top">' +
            '<div class="fg-pinput">' +
              '<input id="wm-phone" type="tel" inputmode="tel" data-field="phone" data-mask="phone"' +
                ' aria-label="Mobile phone number" />' +
            '</div>' +
            '<button type="button" class="fg-optin" role="checkbox" aria-checked="false" data-flag="smsOptIn">' +
              '<span><span class="fg-optinbox" aria-hidden="true"></span></span>' +
              '<span>I agree to receive automated text reminders and calls about marketing ' +
                'updates as outlined in Bold&rsquo;s <span class="fg-u">Terms of service</span> ' +
                'and <span class="fg-u">Privacy policy.</span></span>' +
            '</button>' +
          '</div>' +
          '<div class="fg-shieldnote">' +
            '<img src="' + A + 'icon/shield.svg" alt="" width="24" height="24" />' +
            '<p>You&rsquo;re in control. You can opt out by replying <b>STOP</b> to any texts ' +
              'from Bold. We don&rsquo;t sell your information.</p>' +
          '</div>' +
        '</div>' +
      '</div>' +
      /* "Schedule no-cost call", NOT "Continue" — 2292:22166. The earlier build
         had this wrong and the pixel gate missed it, because the shorter string
         sits inside the longer one's text-dense band, which the edge mask
         excludes by design. verify-behaviour.py now asserts every CTA label. */
      '<div class="fg-bottom">' + actions('Continue', { grad: true }) + tabbar('agebold.com') + '</div>';
  };

  /* Figma "summary" · 2292:22627 and siblings — the portal's seven FAQ rows,
     all drawn COLLAPSED (caret pointing right), unlike the Bridge's one row. */
  function faqRow(id, q) {
    return '<div class="fg-faq-card" data-acc data-open="false" style="border-radius:0">' +
      '<button type="button" class="fg-faq-q" data-acc-btn aria-expanded="false" aria-controls="' + id + '">' +
        '<span>' + q + '</span>' + ic('caret-right') +
      '</button>' +
      '<div class="fg-faq-a" id="' + id + '"><p>Your Care Coordinator will walk you ' +
        'through this on your call.</p></div>' +
    '</div>';
  }

  /* Figma "Learn More" card · I2292:22623;7588:42735 and siblings.
     `audio` is the SpeakerHigh badge, drawn on cards 1 and 3 only. */
  function learnCard(img, title, audio) {
    return '<a class="fg-learncard" href="#" data-noop>' +
      '<span class="fg-learncard-in">' +
        '<span class="fg-learncard-media">' +
          '<img src="' + A + 'img/' + img + '.png" alt="" />' +
          (audio ? ic('speaker-high') : '') +
        '</span>' +
        '<span class="fg-learncard-foot">' +
          '<span class="fg-learncard-kicker">' +
            '<img src="' + A + 'icon/lines16.svg" alt="" width="16" height="16" />' +
            '<span>Resources</span>' +
          '</span>' +
          '<span class="fg-learncard-t">' + title + '</span>' +
        '</span>' +
      '</span>' +
    '</a>';
  }

  /* 19 — Figma "mWeb - Health Portal, Home, …" · 2292:22536 · 393×3061.8.
     The ONLY frame with no Actions and no Tab Bar, so there is no `.fg-bottom`.
     132 + 922 + 2007.8 = 3061.8. Four of the board's hidden nodes live here and
     are not rendered: the intake Callout 2292:22592 (361×208), the "To Do" Badge
     2292:22550, and both `Estimated copay $0 - $25` pairs (2292:22584/22585 and
     2292:22613/22614). */
  r.portalHome = function () {
    return statusbar() + nav('plain') +
      '<div class="fg-content">' +
        /* ── 2292:22539 · 393×922 ── */
        '<div class="fg-portal-top">' +
          '<div class="fg-greet">' +
            '<span class="fg-greet-ring">' + ic('check-circle-48') + '</span>' +
            '<p class="fg-greet-h" data-focus tabindex="-1">You are all set!</p>' +
            '<p class="fg-greet-p">Your Care Coordinator will reach out to you at the time of your scheduled call</p>' +
          '</div>' +
          '<div class="fg-callcard">' +
            '<div class="fg-callcard-badge"><span>Upcoming call</span></div>' +
            '<div class="fg-callcard-body">' +
              '<div class="fg-callcard-top">' +
                '<span class="fg-avatar100"><img src="' + A + 'img/cc-avatar.png"' +
                  ' srcset="' + A + 'img/cc-avatar.png 1x, ' + A + 'img/cc-avatar@3x.png 3x"' +
                  ' alt="Ali N." /></span>' +
                '<p class="fg-callcard-h">15-min intake call with Ali N.</p>' +
                '<div class="fg-callmeta">' +
                  '<span>' + icN('calblank', 4) + '<em>Monday, November 3</em></span>' +
                  '<span>' + icN('clock', 2) + '<em>9:00am - 9:15am (PT)</em></span>' +
                  '<span>' + icN('money', 6) + '<em>No cost</em></span>' +
                '</div>' +
              '</div>' +
              '<div class="fg-callcard-foot">' +
                '<div class="fg-callfrom"><p>Ali N. will call you from ' +
                  '<a href="tel:+14245775266">(424) 577-5266</a></p></div>' +
                '<div class="fg-callacts">' +
                  '<button type="button" class="fg-callact">' +
                    '<span class="fg-callact-btn">' + ic('user') + '</span>' +
                    '<span class="fg-callact-t">Add to<br />contact</span></button>' +
                  '<button type="button" class="fg-callact">' +
                    '<span class="fg-callact-btn">' + ic('calendar-plus') + '</span>' +
                    '<span class="fg-callact-t">Add to<br />calendar</span></button>' +
                  '<button type="button" class="fg-callact">' +
                    '<span class="fg-callact-btn">' + ic('x-circle') + '</span>' +
                    '<span class="fg-callact-t">Cancel<br />appointment</span></button>' +
                '</div>' +
                '<div class="fg-expect">' +
                  '<p class="fg-expect-h">What to expect</p>' +
                  '<ul><li>Confirm your coverage and cost</li>' +
                    '<li>Schedule your provider appointment</li></ul>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        /* ── 2292:22591 · 393×2007.8 ── */
        '<div class="fg-portal-body">' +
          /* 2393:12121 — was "About your program" */
          '<p class="fg-portal-h1">Your program</p>' +
          '<div class="fg-team">' +
            '<div class="fg-team-badge"><span>Your weight loss program</span></div>' +
            '<div class="fg-team-card">' +
              /* 2393:12126 dropped the 5-vector HandHeart glyph and moved the
                 title to Source Serif Pro 20/24 — see .fg-team-row p. */
              '<div class="fg-team-row">' +
                '<p>Bold doctor-supervised weight loss program for adult 65+</p></div>' +
              '<div class="fg-team-sec">' +
                '<p>Covered by UnitedHealthcare</p>' +
                '<ul><li><b>Your UnitedHealthcare plan offers $0 copay visits </b>' +
                  'for virtual appointments with in-network providers, like Bold. ' +
                  '<button type="button" class="fg-inline-link" data-action="sheet" data-sheet="coverage">' +
                  'Learn more.</button></li></ul>' +
                '<ul><li><b>If prescribed a GLP-1 medication, you&rsquo;ll pay a $50 monthly copay</b>' +
                  '. Your provider will file the claim for you.</li></ul>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="fg-portal-video">' +
            '<img src="' + A + 'img/portal-video.png"' +
              ' srcset="' + A + 'img/portal-video.png 1x, ' + A + 'img/portal-video@3x.png 3x"' +
              ' alt="Bold: what happens after you schedule" /></div>' +
          '<div class="fg-qblock">' +
            '<p class="fg-portal-h2">Learn more</p>' +
            '<div class="fg-learn">' +
              learnCard('learn-1', 'Weight management for seniors: What you...', true) +
              learnCard('learn-2', 'How Bold Care helps you manage chronic...', false) +
              learnCard('learn-3', 'What to expect at your Bold Care healthy agi...', true) +
            '</div>' +
          '</div>' +
          '<div class="fg-qblock">' +
            '<p class="fg-portal-h2">FAQ</p>' +
            '<div class="fg-faq-card">' +
              /* Two rows were PREPENDED on this board, and they are why the frame
                 grew 3037.8 → 3150: 2 × 56 = 112. get_metadata still reports the
                 7-row list and a 504-tall block; the render shows nine rows and a
                 616-tall block, and the render is the arbiter. */
              faqRow('pf0a', 'How medication coverage works.') +
              faqRow('pf0b', 'Are GLP-1s required?') +
              faqRow('pf1', 'What to expect in your provider appointment') +
              faqRow('pf2', 'What is a Care Coordinator?') +
              faqRow('pf3', 'What conditions does Bold help with?') +
              faqRow('pf4', 'Will I have any co-pay or coinsurance for my appointments?') +
              faqRow('pf5', 'Does Bold offer primary care?') +
              faqRow('pf6', 'What&rsquo;s included in my personalized Care Plan?') +
              faqRow('pf7', 'Who are your Bold providers?') +
            '</div>' +
          '</div>' +
          '<div class="fg-links">' +
            '<a href="#" data-noop>Access your secure patient portal' + icN('arrow-ur', 2) + '</a>' +
          '</div>' +
        '</div>' +
      '</div>';
  };

  /* ─────────────────────────────────────────────
     REGISTRY — Figma left-to-right x order
     ───────────────────────────────────────────── */
  var SCREENS = [
    { id: 'ad', figmaNode: '2393:12937', figmaH: 886, shell: 'ad',
      title: 'Bold ad', announce: 'Bold advertisement', back: false,
      render: r.ad },

    /* ONE page, three questions. Replaces the previous board's landing-hero +
       q-meds + q-motivation + q-measure. */
    { id: 'landing', figmaNode: '2393:14545', figmaH: 2947, shell: 'onepage',
      title: 'Lose weight, reduce pain',
      announce: 'Lose weight, reduce pain and get your energy back. Covered by Medicare.',
      render: r.landing,
      mount: W.compose(W.checkGroup('motivation'), W.fields(), W.radioGroup('meds'),
                       W.unitSwitch(), W.onePage()) },

    { id: 'result', figmaNode: '2393:15035', figmaH: 915, shell: 'funnel',
      title: 'How much you could lose',
      announce: 'Your estimated weight loss with Bold',
      render: r.result },

    { id: 'ec-name', figmaNode: '2393:11684', figmaH: 852, shell: 'funnel',
      title: 'Your name and email',
      render: r.ecName, mount: W.fields() },

    { id: 'ec-state', figmaNode: '2393:11628', figmaH: 852, shell: 'funnel',
      title: 'State and date of birth',
      render: r.ecState, mount: W.fields() },

    { id: 'loader', figmaNode: '2393:11581', figmaH: 852, shell: 'loader',
      title: 'Checking coverage', announce: 'Checking your coverage', back: false,
      render: r.loader, mount: W.loader(3200) },

    { id: 'covered', figmaNode: '2393:11601', figmaH: 852, shell: 'funnel',
      title: 'Coverage confirmed', announce: 'Your appointment is fully covered',
      render: r.covered },

    { id: 'q-situations', figmaNode: '2393:11744', figmaH: 852, shell: 'funnel',
      title: 'Question 1', render: r.qSituations, mount: W.checkGroup('situations') },

    { id: 'q-diagnosed', figmaNode: '2393:11793', figmaH: 852, shell: 'funnel',
      title: 'Question 2', render: r.qDiagnosed, mount: W.checkGroup('diagnosed') },

    { id: 'q-comorbid', figmaNode: '2393:11769', figmaH: 852, shell: 'funnel',
      title: 'Question 3', render: r.qComorbid, mount: W.checkGroup('comorbid') },

    { id: 'q-discuss', figmaNode: '2393:11723', figmaH: 852, shell: 'funnel',
      title: 'Question 4', render: r.qDiscuss, mount: W.fields() },

    { id: 'bridge', figmaNode: '2393:11822', figmaH: 1886, shell: 'funnel',
      title: 'Your Bridge program', announce: 'You are a strong candidate for the Bridge program',
      render: r.bridge, mount: W.accordion() },

    /* All four CTAs that the PREVIOUS board drew disabled are drawn ENABLED here,
       so none of them carries `validate` any more. Three still have a control that
       has to mean something, so they carry a `guard` instead: the button stays
       enabled exactly as drawn, and pressing it early moves focus to the control
       and says why. The phone screen deliberately gets NO guard — gating
       enrollment on a marketing-text opt-in was the problem, and the board fixing
       it is a win, not something to reinstate. */
    { id: 'schedule', figmaNode: '2393:11871', figmaH: 1083, shell: 'funnel',
      title: 'Schedule your intake call',
      render: r.schedule, mount: W.schedule(),
      guard: function (s) {
        return s.answers.slotTime ? null
          : { focus: '[data-slot]', say: 'Choose a time for your call first.' };
      } },

    { id: 'consent-hipaa', figmaNode: '2393:11974', figmaH: 852, shell: 'funnel',
      title: 'HIPAA notice',
      render: r.consentHipaa, mount: W.compose(W.flags(), W.docScroll()),
      guard: function (s) {
        return s.answers.consentHipaa ? null
          : { focus: '[data-flag="consentHipaa"]', say: 'Please acknowledge the HIPAA notice to continue.' };
      } },

    { id: 'consent-care', figmaNode: '2393:12015', figmaH: 852, shell: 'funnel',
      title: 'Telehealth informed consent',
      render: r.consentCare, mount: W.compose(W.flags(), W.docScroll()),
      guard: function (s) {
        return s.answers.consentTele ? null
          : { focus: '[data-flag="consentTele"]', say: 'Please accept the New Patient Agreement to continue.' };
      } },

    { id: 'phone', figmaNode: '2393:11949', figmaH: 852, shell: 'funnel',
      title: 'Your mobile phone number',
      render: r.phone, mount: W.compose(W.fields(), W.flags()) },

    /* The render bounds are 3150 where the frame is 3037.8 — a child overflows and
       the frame does not clip, so the reference render is 3150 and that is the
       height the harness measures against. */
    { id: 'portal-home', figmaNode: '2393:12054', figmaH: 3150, shell: 'funnel',
      title: 'You are all set', announce: 'You are all set',
      render: r.portalHome, mount: W.accordion() }
  ];

  /* ─────────────────────────────────────────────
     SHEETS — the board draws these triggers but gives them no destination frame,
     so the BODY copy is authored, not transcribed. Flagged in FIDELITY.md.
     Cost language follows the approved pricing messaging: never "free", and
     "$0 out of pocket" is always paired with the 78% stat.
     ───────────────────────────────────────────── */
  WM.sheets = {
    /* 2313:23487 on 2313:23350 */
    'why-name': {
      title: 'Why are we asking this?',
      body: '<p>Your name and email let us check your coverage with your Medicare ' +
        'or Medicare Advantage plan before anything is scheduled.</p>' +
        '<p>Healthy aging appointments are covered by Medicare, and 78% of Bold ' +
        'patients pay $0 out of pocket. We will show you your estimated cost once ' +
        'your plan is confirmed.</p>' +
        '<p>Only your care team sees this information.</p>' +
        '<button type="button" class="fg-btn" data-action="sheet-close" data-autofocus>' +
        '<span>Got it</span></button>'
    },
    /* 2313:23348 on 2289:20950 */
    'why-state': {
      title: 'Why are we asking this?',
      body: '<p>Your state tells us which providers are licensed to see you — a ' +
        'clinician has to hold a licence in the state you are in on the day of ' +
        'your visit.</p>' +
        '<p>Your date of birth confirms your Medicare eligibility and lets us match ' +
        'you to the right plan record.</p>' +
        '<p>Only your care team sees this information.</p>' +
        '<button type="button" class="fg-btn" data-action="sheet-close" data-autofocus>' +
        '<span>Got it</span></button>'
    },
    /* 2289:20928 on 2289:20924 */
    'coverage': {
      title: 'About your coverage',
      body: '<p>Your UnitedHealthcare plan covers virtual healthy aging appointments ' +
        'with in-network providers at a $0 copay. Bold providers are in-network with ' +
        'UnitedHealthcare.</p>' +
        '<p>78% of Bold patients pay $0 out of pocket. If your plan leaves a balance, ' +
        'a Care Coordinator confirms the estimated amount with you before your visit — ' +
        'no surprises.</p>' +
        '<button type="button" class="fg-btn" data-action="sheet-close" data-autofocus>' +
        '<span>Got it</span></button>'
    },
    /* 2292:22147 on 2292:22130. Drawn collapsed with a CaretDown but the board
       has no expanded state to copy, so this opens the sheet like the other
       destination-less affordances rather than toggling nothing. */
    'bridge-more': {
      title: 'About the Bridge program',
      body: '<p>Bridge is a doctor-supervised weight programme for adults 65+. You ' +
        'meet a Bold provider, agree a care plan, and check in as you go.</p>' +
        '<p>GLP-1 medication is optional. If your provider prescribes one, the Bridge ' +
        'copay is $50 a month.</p>' +
        '<p>Your provider reviews your other conditions and medications first, and ' +
        'adjusts the plan over time.</p>' +
        '<button type="button" class="fg-btn" data-action="sheet-close" data-autofocus>' +
        '<span>Got it</span></button>'
    },
    /* 2326:4352 on 2292:22130 */
    'glp1-cost': {
      title: 'GLP-1 cost',
      body: '<p>If your provider prescribes a GLP-1, the Bridge program copay is $50 ' +
        'a month. That is the medication, not the appointment.</p>' +
        '<p>Your appointments are covered by Medicare, and 78% of Bold patients pay ' +
        '$0 out of pocket for them.</p>' +
        '<button type="button" class="fg-btn" data-action="sheet-close" data-autofocus>' +
        '<span>Got it</span></button>'
    },
    /* 2289:20942 on 2289:20924 */
    'edit-info': {
      title: 'Edit your information',
      body: '<p>Go back to change your name, email, state or date of birth, then ' +
        'continue to re-check your coverage.</p>' +
        '<button type="button" class="fg-btn" data-action="sheet-close" data-autofocus>' +
        '<span>Got it</span></button>'
    }
  };

  WM.recomputeHook = null;
  /* The result screen carries BOTH of the board's headline variants and shows one.
     2393:15035 has the computed number; 2393:14693 is the same frame with a
     no-number headline, which is exactly what is wanted when question 2 was
     scrolled past without a weight. */
  WM.predicates = {
    hasLoss: function (s) { return s.derived.lossAmount !== null && s.derived.lossAmount !== undefined; },
    noLoss: function (s) { return !(s.derived.lossAmount !== null && s.derived.lossAmount !== undefined); }
  };
  WM.registerScreens(SCREENS);
})();
