/* Two-way care team chat — P1 story: "Access care plan".
   PRD P1 scope (notion-design-brief.md:333): the provider's message and care plan arrive in Bold, a text with no
   clinical content brings the patient back, she signs in without a password, and reads (not replies to) the
   message. Patient replies are P2. Reuses the Vision's cast, tabs and chat UI; overrides only what P1 changes.
   Loaded after story.js. `?story=p1` makes this the active story (window.TWC_STORY) before the phones load. */
(function (root) {
  'use strict';
  var V = root.TWC_STORY, at = root.TWC.at;
  function t(y, m, d, h, min) { return function () { return at(y, m, d, h, min); }; }

  var phone = '(424) 577-5266';

  /* Warm, greets Carol, introduces the plan, ends with a way to reach the team (replies are P2). */
  var visitMessage = 'Hi Carol, it was so good to see you today. I put together your care plan with a few simple steps to start with. ' +
    "Take a look whenever you're ready.\n\nIf you have more questions, we're here. Please call your care team at " + phone + '.';

  /* Modeled on a real finalized Healthie plan (STAGING_TEST_Bold_care_plan_DRAFT.pdf): a provider note, then areas in
     its order (Activity, Nutrition, Sleep, Social Connection, Stress), each step a bold instruction with detail and
     article links, and one "Why?" per area. Amounts match care_plan_actions_report_2026-09-30.pdf (typical plan:
     5 areas, ~8 steps). Protein is per meal, not "80 g a day" (open kidney flag, prioritized-issue-register.md:43).
     Adapted to Carol's first visit; clinical wording needs review. */
  var carePlan = Object.assign({}, V.carePlan, {
    title: 'Your care plan',
    from: 'From your visit on Tue, Sep 22',
    fromLong: 'From Dr. Desai · Visit on Tue, Sep 22',
    note: 'Hi Carol, it was so good to meet you. This plan starts with small steps in activity, nutrition, sleep, connection, and stress. ' +
      "Please get your kidney blood test about 1 week before your next visit. I'll see you on Tue, Oct 20 by video to check your weight and blood pressure and look at your food journal.",
    areas: [
      { key: 'activity', icon: 'ph-person-simple-run', name: 'Activity', recap: 'Move 10 minutes, 5 days a week',
        why: 'Regular movement helps your blood sugar and protects your bones. Strength keeps your muscles strong as you lose weight and supports your independence.',
        actions: [
          { text: 'Start with 10-minute sessions of low-impact activity 5 days this week.',
            detail: 'A short walk on flat ground, a recumbent bike, or water aerobics all work. Add a few minutes each week as you feel comfortable. Wear supportive shoes.',
            links: ['Physical activity for seniors: Benefits, guidelines, and how to start safely'] },
          { text: 'Do strength exercises 2 days this week, with a rest day between.',
            detail: "Try chair squats, wall push-ups, and calf raises holding the counter. Aim for 2 sets of 10 at a comfortable effort. Bold's seated classes count.",
            links: ['Strength classes with Bold'] }
        ] },
      { key: 'nutrition', icon: 'ph-fork-knife', name: 'Nutrition', recap: 'Protein at every meal',
        why: 'Enough protein helps protect your muscles as you lose weight. Water supports your energy and digestion. Your journal helps us fine-tune your plan together.',
        actions: [
          { text: 'Aim for 25–30 grams of protein at each meal.',
            detail: 'Good sources include eggs, Greek yogurt, chicken, fish, beans, and tofu. A protein shake can fill the gap if a meal falls short.',
            links: ['The protein guide for adults 60+'] },
          { text: 'Drink 64 ounces of water each day.',
            detail: "That's about 8 cups. Try a full glass before each meal, and limit caffeine after noon.",
            links: ['Nutrition for seniors: Your guide to healthy eating as you age'] },
          { text: 'Keep a photo food journal for the next 2 weeks.',
            detail: "Snap a quick picture of each meal and snack. We'll look at it together at your next visit." }
        ] },
      { key: 'sleep', icon: 'ph-moon', name: 'Sleep', recap: 'Same bedtime every night',
        why: 'Steady sleep supports your blood sugar, mood, and energy.',
        actions: [
          { text: 'Keep the same bedtime and wake time 7 days a week, even on weekends.',
            detail: 'Avoid caffeine after noon, and wind down with breathing or light stretching in the evening.',
            links: ['Better sleep for seniors: 8 simple habits to improve sleep quality'] }
        ] },
      { key: 'social', icon: 'ph-users-three', name: 'Social connection', recap: '1 group activity this month',
        why: 'Staying connected can ease worry, lift your mood, and keep you motivated to stay active.',
        actions: [
          { text: 'Try 1 group activity this month.',
            detail: 'Water aerobics at a senior center or a group class at your church are good options. Moving with others can make both feel easier.',
            links: ['How to cope with loneliness: Small steps to feel less alone as you age'] }
        ] },
      { key: 'stress', icon: 'ph-flower-lotus', name: 'Stress & mood', recap: 'Breathe before evening snacks',
        why: 'Calming down in the moment can curb evening snacking and help you sleep.',
        actions: [
          { text: 'Practice 5 minutes of belly breathing when you feel the urge to snack in the evening.',
            detail: 'Put one hand on your chest and one on your belly. Breathe in through your nose for 4 counts, then out for 6.',
            links: ['Mind-body classes with Bold', 'How to manage stress & anxiety'] }
        ] }
    ],
    see: 'See my Care Plan',
    review: 'Review care plan',
    whyLabel: 'Why?',
    pdf: 'Download PDF',
    pdfFile: 'carol-care-plan.pdf',
    pdfName: 'Carol Simmons care plan.pdf',
    pdfToast: 'Care plan saved as a PDF.',
    linkToast: 'Articles open here in the full app.',
    questions: 'Questions? Call your care team at ' + phone + '.'
  });

  var lock = Object.assign({}, V.lock, {
    sms: { app: 'Messages', from: 'Bold', body: 'Bold: Dr. Desai sent you a message. Read it in the Bold app: agebold.com/m' }
  });

  /* Sign-in from the text link: date of birth, a texted code, then an offer to use Face ID next time. */
  var verify = {
    dobTitle: "Let's make sure it's you",
    dobLabel: 'Date of birth',
    dobFormat: 'MM/DD/YYYY',
    dobValue: '03/14/1956',
    dobError: 'Enter your date of birth as MM/DD/YYYY.',
    continue: 'Continue',
    codeTitle: 'Enter the code we texted you',
    codeSentTo: 'Sent to (•••) •••-4821',
    codeLabel: '6-digit code',
    code: '482913',
    codeError: "That code doesn't match. Check the text and try again.",
    autofill: 'From Messages',
    verifyCta: 'Verify',
    resend: 'Send a new code',
    resendIn: 'Send a new code in {s}',
    resent: 'New code sent.',
    help: 'Need help? Call ' + phone,
    callToast: 'This would call ' + phone + '.',
    passkeyTitle: 'Use Face ID next time?',
    passkeyCta: 'Use Face ID',
    passkeyLater: 'Not now'
  };

  var intro = { title: 'Your care team chat', rows: V.intro.rows.filter(function (r) { return r.who !== 'june'; }), privacy: V.intro.privacy };
  var status = Object.assign({}, V.status, { members: 'Dr. Desai and Khadija' });
  var reply = { soon: 'Replying here is coming soon.' };

  /* June in P1: a door to its own chat, never a voice in the care team thread. General food questions only,
     tied to the Nutrition steps; no medical advice; red flags send Carol to 911 / 988 or her care team. */
  var junePortal = {
    title: 'Questions about food?',
    body: "Ask June, your AI assistant. June can't give medical advice.",
    chips: [{ label: "What's a high-protein breakfast?" }, { label: 'How much is 64 ounces of water?' }, { label: 'How do I keep a photo food journal?' }],
    chatTitle: 'June',
    intro: "Hi Carol, I'm June, an AI assistant. I can answer general questions about the food steps in your plan.",
    inputLabel: 'Ask June about food',
    note: "June is an AI assistant and can't give medical advice.",
    answers: [
      'Here are 3 breakfasts with about 25–30 grams of protein:\n• 1 cup of Greek yogurt with a handful of nuts\n• 2 eggs with a slice of cheese and whole-grain toast\n• A protein shake with a banana',
      "64 ounces is about 8 cups, or 4 regular water bottles. A full glass before each meal gets you almost halfway there.",
      "Take a photo of each meal and snack with your phone's camera. They save to your Photos app. Dr. Desai will look at them with you at your next visit."
    ],
    general: 'These are general ideas, not advice for you.',
    fallback: 'I can help with general questions about the food steps in your plan. For anything about your health or medicines, please call your care team at ' + phone + '.',
    emergency: 'This could be an emergency. If it is, call 911 now.',
    crisis: 'If you are thinking about hurting yourself, call or text 988 now. If you are in danger, call 911.',
    keywords: [/\b(protein|breakfast|eggs?|yogurt|shake|meal)\b/i, /\b(water|ounces?|oz|cups?|drink)\b/i, /\b(journal|photos?|pictures?|log)\b/i]
  };

  var home = Object.assign({}, V.home, { subMessage: 'Dr. Desai sent you a message.' });

  var careTab = {
    planTitle: 'Your care plan',
    team: { band: 'We are here to help', title: 'Your care team', body: 'Here for any questions about your plan.', call: 'Call ' + phone },
    faqTitle: 'Appointment FAQ',
    faq: ['What to expect in the appointment', 'What is included in my personalized Care Plan?',
      'Will I have any co-pay or co-insurance fees associated with my appointments?', 'Does Bold Care offer primary care?']
  };

  var chapters = [
    { name: 'Dr. Desai sends the care plan', short: 'Plan sent', goal: "Provider's message and care plan arrive in Bold" },
    { name: 'Carol gets a text', short: 'Text', goal: 'A text brings patients back to Bold' },
    { name: "Carol confirms it's her", short: 'Sign in', goal: 'Secure access, no password' },
    { name: 'Carol reads her message and asks June', short: 'Message', goal: "Patients open their provider's message in Bold" },
    { name: 'Carol reviews her care plan', short: 'Care plan', goal: 'Patients view their care plan' }
  ];

  var hintLabels = {
    'care.send': 'Tap Send on the care team’s phone',
    'patient.sms': 'Tap the text on Carol’s phone',
    'patient.verify.dob': 'Tap Continue',
    'patient.verify.autofill': 'Tap the code above the keyboard',
    'patient.verify.passkey': 'Tap “Use Face ID”',
    'patient.june.chip': 'Tap “What’s a high-protein breakfast?”',
    'patient.june.close': 'Close June',
    'patient.june.plan': 'Tap “How much is 64 ounces of water?” under Nutrition',
    'patient.careplan.see': 'Tap “See my Care Plan”',
    'patient.caretab.plan': 'Tap “Review care plan”',
    'patient.careplan.why': 'Tap “Why?”',
    'patient.careplan.close': 'Close the care plan'
  };

  var finale = { title: 'That’s P1', caption: 'A text, a quick sign-in, a warm note, and a care plan to come back to.' };

  var steps = [
    // 1 · Dr. Desai sends the care plan
    { id: '1.1', chapter: 1, device: 'care', role: 'md', time: t(2026, 8, 22, 15, 8), hint: 'care.send', waitFor: 'visit:sent', label: 'Send note + care plan',
      caption: "Dr. Desai wraps up Carol's visit and sends a note with her care plan.",
      auto: function (a) { a.care.sendVisitMessage(); } },
    // 2 · Carol gets a text
    { id: '2.1', chapter: 2, device: 'patient', time: t(2026, 8, 22, 19, 40), scene: 'That evening · 7:40 PM', hint: 'patient.sms', waitFor: 'verify:started', label: 'Tap the text',
      caption: "The text names Dr. Desai but says nothing about Carol's health.",
      auto: function (a) { a.patient.tapSms(); } },
    // 3 · Carol confirms it's her
    { id: '3.1', chapter: 3, device: 'patient', hint: 'patient.verify.dob', waitFor: 'verify:dob-ok', label: 'Date of birth',
      caption: 'The link opens Bold. First, her date of birth.',
      auto: function (a) { a.patient.enterDob(); } },
    { id: '3.2', chapter: 3, device: 'patient', time: t(2026, 8, 22, 19, 41), hint: 'patient.verify.autofill', waitFor: 'verify:code-ok', label: 'Texted code',
      caption: 'Then a 6-digit code by text. Her phone fills it in.',
      auto: function (a) { a.patient.enterCode(); } },
    { id: '3.3', chapter: 3, device: 'patient', hint: 'patient.verify.passkey', waitFor: 'patient:thread-opened', label: 'Face ID next time',
      caption: "Face ID makes next time one step. She lands on Dr. Desai's message.",
      auto: function (a) { a.patient.choosePasskey(true); } },
    // 4 · Carol reads her message and asks June
    { id: '4.1', chapter: 4, device: 'patient', hint: 'patient.june.chip', waitFor: 'june:message', label: 'Ask June about food',
      caption: 'Questions about food? June answers general ones right away, in its own chat.',
      auto: function (a) { a.patient.askJune('chat', 0); } },
    { id: '4.2', chapter: 4, device: 'patient', hint: 'patient.june.close', waitFor: 'june:closed', label: 'Back to the message',
      caption: "June can't give medical advice. For that, Carol calls her care team.",
      auto: function (a) { a.patient.closeJune(); } },
    { id: '4.3', chapter: 4, device: 'patient', hint: 'patient.careplan.see', waitFor: 'caretab:opened', label: 'See my Care Plan',
      caption: 'A warm note, a short recap, and a number to call. Replies come later.',
      auto: function (a) { a.patient.openCareTab(); } },
    // 5 · Carol reviews her care plan
    { id: '5.1', chapter: 5, device: 'patient', hint: 'patient.caretab.plan', waitFor: 'careplan:opened', label: 'Open the plan',
      caption: 'The Care tab keeps her plan, her next visit, and who to call.',
      auto: function (a) { a.patient.openCarePlan(); } },
    { id: '5.2', chapter: 5, device: 'patient', hint: 'patient.careplan.why', waitFor: 'careplan:why', label: 'Read a “Why?”',
      caption: 'A note from Dr. Desai, then each area: what to do, how much, and how often. “Why?” opens on tap.',
      auto: function (a) { a.patient.openWhy(); } },
    { id: '5.3', chapter: 5, device: 'patient', hint: 'patient.june.plan', waitFor: 'june:message', label: 'Ask June from the plan',
      caption: 'June sits under Nutrition too, next to the steps it can help with.',
      auto: function (a) { a.patient.askJune('plan', 1); } },
    { id: '5.4', chapter: 5, device: 'patient', hint: 'patient.june.close', waitFor: 'june:closed', label: 'Back to the plan',
      caption: 'Closing June returns Carol to her plan.',
      auto: function (a) { a.patient.closeJune(); } },
    { id: '5.5', chapter: 5, device: 'patient', hint: 'patient.careplan.close', waitFor: 'careplan:closed', label: 'Back to Care',
      caption: 'Nothing to check off. Her plan is here whenever she wants it.',
      auto: function (a) { a.patient.closeCarePlan(); } }
  ];

  function initialState() {
    var s = V.initialState();
    s.care = Object.assign({}, s.care, { composer: { text: visitMessage, attachment: 'careplan' } });
    s.patient = Object.assign({}, s.patient, { verify: null });
    return s;
  }

  var P1 = Object.assign({}, V, {
    key: 'p1', label: 'P1 · Access care plan', short: 'P1',
    title: 'P1 · Access care plan', sub: 'A text, a secure sign-in, and a care plan to read.',
    features: { reply: false, june: false, junePortal: true, verify: true, careTab: true, recap: true },
    visitMessage: visitMessage, carePlan: carePlan, lock: lock, verify: verify, intro: intro, status: status, reply: reply, junePortal: junePortal,
    home: home, careTab: careTab, chapters: chapters, hintLabels: hintLabels, finale: finale, steps: steps, initialState: initialState
  });

  Object.assign(V, { key: 'vision', label: 'Vision · Two-way chat', short: 'V',
    title: 'Two-way care team chat', sub: 'From a post-visit message to answers, with the right person replying.' });
  root.TWC_STORIES = { p1: P1, vision: V };
  var pick = typeof location !== 'undefined' ? new URLSearchParams(location.search).get('story') : null;
  if (pick === 'p1') root.TWC_STORY = P1;
})(typeof window !== 'undefined' ? window : globalThis);
