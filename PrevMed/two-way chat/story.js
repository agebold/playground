/* Two-way care team chat — the story: cast, content, every string of copy, chapters, steps.
   Single source of copy (review it here against the FigJam copy board 2130:980).
   Classic script; also loads in Node for verify-chat.mjs (reads TWC from the global object). */
(function (root) {
  'use strict';
  var TWC = root.TWC;
  var at = TWC.at;

  var cast = {
    patient: { id: 'carol', name: 'Carol Simmons', first: 'Carol', initials: 'CS', program: 'GLP-1 program', visit: 'Visit Sep 22' },
    md: { key: 'md', name: 'Dr. Desai', full: 'Dr. Mitul S. Desai, MD', role: 'Your provider', careRole: 'MD', roleShort: 'MD', photo: 'images/desai.jpg' },
    cc: { key: 'cc', name: 'Khadija', full: 'Khadija', role: 'Your Medical Assistant', careRole: 'Medical Assistant', roleShort: 'MA', photo: 'images/khadija.jpg' },
    june: { key: 'june', name: 'June', role: 'AI assistant', orb: 'images/figma/june-orb-ai-round.svg' }
  };

  var visitMessage = 'Hi Carol, it was good to meet you today. Here is your care plan from our visit. ' +
    'Khadija, your Medical Assistant, reads your messages first and brings me in when you need me.';
  /* No prescription yet at the first visit: Carol asks about the pill she already takes, her blood test and her next visit. */
  var carolQuestion = 'I take this pill for my blood pressure. Is it okay with the weight medicine? Where do I get my blood test? And when is my next visit?';
  var desaiReply = "Hi Carol, thank you for sending this. You can keep taking your blood pressure pill. We'll check your blood pressure at each visit, because it can drop as you lose weight. " +
    'Before I prescribe the weight medicine, please sign the consent form below.';

  var carePlan = {
    title: 'Your care plan',
    from: 'From your visit on Tue, Sep 22',
    fromLong: 'From Dr. Desai · Tue, Sep 22',
    items: [
      { key: 'food', icon: 'ph-fork-knife', title: 'Protein at every meal', detail: 'About 80 grams a day', more: '6 to 8 glasses of water a day.' },
      { key: 'move', icon: 'ph-barbell', title: 'Strength exercise', detail: '2 times a week', more: "Bold's seated classes count." }
    ],
    tests: { icon: 'ph-drop', title: 'Kidney blood test', detail: 'Before your next visit', more: 'Khadija will send you the lab order.' },
    nextVisit: { icon: 'ph-calendar-check', title: 'Next visit', detail: 'Tue, Oct 20 at 10:30 AM, video', when: 'Tue, Oct 20 at 10:30 AM' },
    firstStepLabel: 'Your first step',
    firstStep: { title: '15 min Seated Strength & Toning', trainer: 'Chris Litten', img: 'images/figma/class-thumbnail.jpg',
      tags: ['Gentle', 'Seated OK', '15 min'], cta: 'Start class' },
    footer: 'Questions about your plan? Write to your care team.',
    footerCta: 'Message your care team',
    toastClass: 'Class would start here in the full app.'
  };

  var home = {
    greeting: { morning: 'Good morning, Carol!', afternoon: 'Good afternoon, Carol!', evening: 'Good evening, Carol!' },
    subMessage: 'Dr. Desai sent you a message about your visit.',
    subMessageLink: 'Read message',
    subRead: 'Your next visit is Tue, Oct 20 at 10:30 AM.',
    subReadLink: 'See details',
    classTitle: 'Your first class',
    classChange: 'Not feeling this today? Change class',
    checklistTitle: 'Your next steps',
    checklistHelp: '{done} done, {left} to go. Dr. Desai sees your progress before your next visit.',
    checklistAllDone: 'All done. Dr. Desai sees your progress before your next visit.',
    steps: [
      { key: 'message', title: "Read Dr. Desai's message", iconName: 'chat', meta: 'New' },
      { key: 'plan', title: 'Review your care plan', iconName: 'ph-clipboard-text', meta: '2 min' },
      { key: 'consent', title: 'Review & sign GLP-1 informed consent', stepper: 'images/figma/stepper-signature.svg', meta: '5 min', readyMeta: 'Ready to sign', callout: true },
      { key: 'class', title: 'Try your first class', iconName: 'tai-chi', meta: '15 min' },
      { key: 'visit', title: 'Visit with Dr. Desai', doneOnly: true }
    ],
    juneCard: { title: 'Chat with June', body: 'Ask me anything about your plan, your visit, or how Bold works.' },
    fab: 'Chat with June',
    placeholder: { care: 'Care', myhealth: 'My health', library: 'Library', body: 'This tab is not part of this demo.' }
  };

  var accountMenu = [
    { key: 'messages', label: 'Messages', icon: 'images/ds/chat.svg' },
    { key: 'appointments', label: 'Appointments', icon: 'images/ds/calendar.svg' },
    { key: 'care', label: 'Get care', icon: 'images/ds/hand-heart.svg' },
    { key: 'settings', label: 'Settings', icon: 'images/ds/gear.svg' },
    { key: 'signout', label: 'Sign out', icon: 'images/ds/sign-out.svg' }
  ];

  var tabs = [
    { key: 'home', label: 'Home', iconName: 'home', size: 24 },
    { key: 'care', label: 'Care', iconName: 'hand-heart', size: 20 },
    { key: 'myhealth', label: 'My health', iconName: 'pulse', size: 20 },
    { key: 'library', label: 'Library', iconName: 'explore', size: 24 },
    { key: 'messages', label: 'Messages', iconName: 'chat', size: 20 }
  ];

  var intro = {
    title: 'Your care team chat',
    rows: [
      { who: 'md', name: 'Dr. Desai', text: 'Your provider. Answers medical questions.' },
      { who: 'cc', name: 'Khadija', text: 'Your Medical Assistant. Reads your messages first and brings in Dr. Desai when needed.' },
      { who: 'june', name: 'June', text: "AI assistant. Answers simple questions right away. June can't give medical advice." }
    ],
    promise: 'Replies within 48 hours.',
    weekends: "Weekends don't count.",
    hours: 'Care team hours: Mon–Fri, 7 AM–5 PM PT.',
    privacy: 'Only your care team can see this chat.'
  };

  var emergencyNote = 'If this is a medical emergency, call 911.';

  var misc = {
    notInDemo: 'This part isn’t in the demo.',
    voice: 'Voice input isn’t part of this demo.',
    consentLater: 'Dr. Desai’s team will send this form in Messages.',
    signedCopy: 'Your signed copy is saved in Documents.',
    onlyCarol: 'Only Carol’s chat is part of this demo.',
    taskDone: 'Task done',
    newMessages: 'New messages'
  };

  /* The line under "Your care team" in the chat header: who is on it, then who replies and by when. */
  var status = {
    title: 'Your care team',
    members: 'Dr. Desai, Khadija, and June',
    replies: '{name} replies by {by}',
    reading: '{name} is reading your message',
    typing: '{name} is typing…'
  };

  /* Every June line lives here (checked by the copy lint in verify-chat.mjs). */
  var june = {
    hello: "Thanks, Carol. I'm June, your care team's AI assistant.",
    thanks: 'Thanks, Carol.',
    photoOnly: 'Got it. What would you like to ask about this photo?',
    nextVisit: 'Your next visit is Tue, Oct 20 at 10:30 AM, by video with Dr. Desai.',
    askTwo: 'For your other questions, 2 quick taps help your team answer faster.',
    askTwoPlain: '2 quick taps help your team answer faster.',
    q1: 'How do you feel right now?',
    q2: 'Have you felt dizzy lately?',
    routeIntro: "Thank you. Here's who will answer:",
    routeFooter: "Replies within 48 hours, by {by}. Weekends don't count.",
    offHoursTomorrow: 'Your care team is off for the night. Khadija will read your message tomorrow morning.',
    offHoursWeekend: 'Your care team is off for the weekend. Khadija will read your message Monday morning.',
    openNow: 'Khadija will read your message soon.',
    resourcesIntro: "While you wait, here are 2 short reads from Bold's care team.",
    generalTips: 'These are general tips, not advice for you.',
    verySick: "I'm sorry you feel this way. If this is a medical emergency, call 911. I marked your message so Khadija sees it first.",
    redFlag: 'This could be an emergency. If it is, call 911 now. I marked your message so Khadija sees it first.',
    crisis: 'If you are thinking about hurting yourself, call or text 988 now. If you are in danger, call 911.',
    freeLogistics: "Khadija can help with that and will reply within 48 hours. Weekends don't count.",
    freeOther: 'Got it. I added this to your message for Khadija.',
    chipMedicalAssistant: 'Your Medical Assistant is a real person on your care team. Khadija helps with your plan, forms, labs, and appointments, and brings in Dr. Desai when you need her.',
    chipCarePlan: 'Your plan has 3 parts. Protein at every meal, strength exercise 2 times a week, and a kidney blood test before your next visit.'
  };

  var screening = {
    q1: [{ value: 'fine', label: 'I feel fine' }, { value: 'a-little', label: 'A little sick' }, { value: 'very', label: 'Very sick' }],
    q2: [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }]
  };

  var routeLabels = { cc: 'Khadija, your Medical Assistant', md: 'Dr. Desai' };
  var routing = [
    { q: 'Where do I get my blood test?', who: 'cc', label: routeLabels.cc },
    { q: 'Is my blood pressure pill okay with the weight medicine?', who: 'md', label: routeLabels.md }
  ];

  var juneChips = [
    { label: 'What does a Medical Assistant do?', answer: june.chipMedicalAssistant },
    { label: 'When is my next visit?', answer: june.nextVisit },
    { label: "What's in my care plan?", answer: june.chipCarePlan, link: 'careplan' },
    { label: 'Ask something else', focus: true }
  ];

  var articles = [
    { id: 'appetite', title: 'Eating well when your appetite changes', kind: 'Article', mins: 3,
      img: 'images/resource-weight-management.jpg', imgAlt: 'A woman at home, reading on her phone',
      intro: 'Weight medicines can make you feel full sooner. Here are simple ways to keep your strength up.',
      bullets: ['Start each meal with protein, like eggs, yogurt, fish, or beans.', 'Eat smaller meals more often.',
        'Sip water through the day.', 'Stop eating when you feel full.'],
      close: "If food doesn't sit well, tell your care team. They can help you adjust." },
    { id: 'first-month', title: 'Your first month on a weight medicine', kind: 'Article', mins: 4,
      img: 'images/article-glp1-aging.jpg', imgAlt: 'An older couple out for a walk',
      intro: 'The first weeks are about getting used to your medicine. Your care team checks in along the way.',
      bullets: ['Take it the way your care plan says.', 'Keep up protein and strength exercise to protect your muscle.',
        'Write down questions and send them here.'],
      close: 'If this is a medical emergency, call 911.' }
  ];

  var cameraRoll = [
    { id: 'rx', src: 'images/rx-bottle.svg', label: 'blood pressure pill bottle', alt: 'Photo of a pharmacy bottle labeled Lisinopril 10 mg, 1 tablet by mouth once a day' },
    { id: 'yogurt', src: 'images/recipe-yogurt-bowl.jpg', label: 'yogurt bowl', alt: 'A yogurt bowl with fruit' },
    { id: 'eggs', src: 'images/snack-hardboiled.jpg', label: 'hard-boiled eggs', alt: 'Hard-boiled eggs on a plate' },
    { id: 'kitchen', src: 'images/blog-kitchen-swaps.jpg', label: 'kitchen counter', alt: 'Fresh food on a kitchen counter' },
    { id: 'walk', src: 'images/resource-healthy-aging.jpg', label: 'friends walking', alt: 'Friends out for a walk' }
  ];

  /* GLP-1 informed consent — verbatim from weight_management_app/mvp3-side-effect-prescription.html:3215–3347,
     minus the two Primary Care Physician pieces (user: no PCP). The closing acknowledgement becomes agreement 4. */
  var consentDoc = {
    id: 'consent',
    title: 'GLP-1 treatment consent',
    cardMeta: '5 short sections · About 5 minutes',
    header: 'Bold Care GLP-1 Informed Consent Form',
    meta: ['Effective Date: June 10, 2026', 'Patient: Carol Simmons', 'Provider: Mitul S. Desai, MD'],
    lead: 'Please read this document carefully. This informed consent form outlines the critical medical risks and safety protocols associated with starting GLP-1 receptor agonist therapy. Adults over 65 face unique physiological considerations that require active commitment to your care plan before treatment can begin.',
    summary: ['Possible side effects and risks', 'What you agree to do to stay safe', 'When to stop and get help'],
    sections: [
      { title: '1. Side Effects & Medical Risks',
        intro: 'By signing below, you acknowledge and understand that GLP-1 receptor agonists can cause a variety of side effects which are amplified in patients aged 65+:',
        groups: [
          { title: 'Common Gastrointestinal & Metabolic Side Effects', items: [
            ['Nausea & Vomiting:', 'Affects 30% to 50% of patients, most commonly when starting therapy or during dose escalation. Warrants strict attention to hydration.'],
            ['Diarrhea & Constipation:', 'Experienced by 10% to 20% of patients. Because GLP-1s slow digestive transit, adequate fluid and fiber intake are essential to prevent severe constipation or dehydration.'],
            ['Gallbladder Symptoms & Gallstones:', 'GLP-1 therapy carries an increased risk of gallbladder disease, including gallstones and gallbladder inflammation (cholecystitis).'],
            ['Hypoglycemia (Low Blood Sugar):', 'While rare on its own, the risk increases significantly if you take concurrent medications for diabetes.']
          ] },
          { title: 'Physiological Risks for Adults aged 65 and above', items: [
            ['Muscle Loss and Frailty (Sarcopenia):', 'Rapid weight loss can cause you to lose skeletal muscle rather than fat. In older adults, this can impair balance, accelerate metabolic frailty, and increase the risk of falls or fractures.'],
            ['Gastrointestinal Side Effects:', 'Age-related declines in kidney and liver function cause the medication to clear from your body more slowly. This can intensify nausea, vomiting, diarrhea, chronic constipation, and delayed stomach emptying.'],
            ['Dehydration and Kidney Strain:', 'Because the biological sensation of thirst decreases with age, fluid loss from vomiting or diarrhea can rapidly lead to severe dehydration and acute kidney injury (AKI).'],
            ['Dizziness and Fall Risks:', 'Rapid changes in weight and fluids can trigger a sudden drop in blood pressure when standing up (orthostatic hypotension), leading to dizzy spells or fainting.'],
            ['Medication Interactions (Polypharmacy):', 'If you take existing medications for blood pressure or diabetes, combining them with a GLP-1 can cause dangerous drops in blood pressure or life-threatening low blood sugar.']
          ] }
        ] },
      { title: '2. Patient Safety and Clinical Care Commitments',
        intro: 'To safely counteract these risks, you must strictly commit to the physical and behavioral protocols prescribed as part of your comprehensive care plan:',
        table: [
          ['Nutritional Plan', 'Follow the daily protein targets and dietary guidance prescribed by your healthcare provider.', 'To preserve lean muscle mass and prevent metabolic frailty.'],
          ['Physical Activity', 'Actively participate in the specific resistance and strength training exercises laid out by your care team.', 'To maintain bone density, protect joint health, and improve functional balance.'],
          ['Hydration Regimen', 'Maintain the daily fluid intake levels directed by your provider, regardless of whether you feel thirsty.', 'To prevent dehydration and protect your kidney function.'],
          ['Medical Monitoring', 'Attend all scheduled provider reviews, blood tests, and baseline fall risk screenings.', 'To catch physical or laboratory changes early and adjust your treatment.']
        ] },
      { title: '3. Supervision and Refill Protocols',
        items: [
          ['Mandatory Clinical Reviews:', 'Prescriptions are not auto-renewed. Your provider will evaluate your symptoms, muscle metrics, and lifestyle compliance during a mandatory review prior to releasing each refill.'],
          ['Dosing Adjustments:', 'Medications will follow a cautious "start low, go slow" titration schedule. Your care team will immediately lower your dose or halt treatment if you show signs of muscle wasting, kidney decline, or severe drug intolerance.']
        ] },
      { title: '4. Immediate Escalation Triggers',
        body: 'You must immediately hold your medication and contact your provider or seek emergency care if you experience: severe abdominal pain, persistent vomiting/diarrhea, an inability to keep liquids down for 24 hours, severe dizzy spells, or signs of low blood sugar.' },
      { title: '5. Patient Acknowledgement and Signature',
        intro: 'By signing below, you verify, agree to, and authorize the following:' }
    ],
    agreements: [
      'I understand the common side effects of GLP-1 therapy (nausea, constipation, gallbladder risks) and the risks specific to older adults, including muscle wasting, dehydration, dizziness, and drug interactions.',
      'I agree to strictly adhere to the nutrition, hydration, and strength training plans laid out by my provider to protect my health.',
      'I understand that my refills depend on completing a mandatory clinical review before each new prescription cycle.',
      'I understand the GLP-1 risks and commit to the program requirements.'
    ],
    acknowledgement: 'Signature',
    dateLabel: 'Date signed'
  };

  var sign = {
    title: 'Review and sign',
    sentBy: "Dr. Desai's team sent you a form to sign.",
    time: 'It takes about 5 minutes.',
    coversTitle: 'What this form covers',
    esign: 'I agree to use electronic records and signatures.',
    esignError: 'Check the box to continue.',
    continue: 'Continue',
    askLink: 'Questions about this form? Ask your care team',
    askPrefill: 'I have a question about the consent form: ',
    progress: '{done} of {total} done',
    left: '{n} items left',
    start: 'Start',
    next: 'Next',
    signTag: 'Sign',
    finish: 'Finish',
    adoptTitle: 'Add your signature',
    nameLabel: 'Full name',
    typeTab: 'Type',
    drawTab: 'Draw',
    clear: 'Clear',
    legal: 'By tapping Sign, I agree this is my legal signature.',
    signCta: 'Sign',
    nameError: 'Type your name to sign.',
    drawError: 'Draw your signature to sign.',
    doneTitle: "You're all set, Carol.",
    doneBody: "Dr. Desai's team has your signed form. A copy is saved in your Documents.",
    back: 'Back to chat',
    seeChecklist: 'See my checklist',
    emailCopy: 'Email me a copy',
    emailToast: 'We emailed a copy to the address on file.',
    signedCard: 'Signed {when}',
    viewCopy: 'View signed copy'
  };

  var lock = {
    sms: { app: 'Messages', from: 'Bold', body: 'Bold: Dr. Desai sent you a message about your visit today. Read it in the Bold app: agebold.com/m' },
    push: { app: 'BOLD', title: 'Dr. Desai replied', body: 'Open Bold to read her message.' }
  };

  var attach = {
    title: 'Add to your message',
    camera: 'Take a photo',
    library: 'Choose from your photos',
    privacy: 'Only your care team can see what you share.',
    pickerTitle: 'Photos',
    cancel: 'Cancel',
    add: 'Add'
  };

  /* Care-team side */
  var templates = {
    'lab-order': { name: 'Lab order sent',
      body: "Hi {first}, this is Khadija, your Medical Assistant. I sent your lab order for the kidney blood test. You can go to any lab in your network before your visit on Oct 20. I asked Dr. Desai about your blood pressure pill. She'll reply here by {due}." },
    'refill': { name: 'Refill on the way', body: 'Hi {first}, your refill is on its way. It arrives in 2 to 3 days.' },
    'appt-reminder': { name: 'Appointment reminder', body: 'Hi {first}, a reminder that your next visit is {nextVisit}. Reply here if you need to change it.' }
  };

  var care = {
    titleMessages: 'Messages',
    titleTasks: 'Tasks',
    tabs: [{ key: 'inbox', label: 'Messages', iconName: 'chat', size: 20 }, { key: 'tasks', label: 'Tasks', iconName: 'ph-check-square-offset', badgeLabel: 'open' }],
    you: 'You',
    juneTo: 'to Carol',
    photoPreview: 'Photo',
    noResults: 'No conversations match.',
    carolsButton: 'Carol taps this on her phone.',
    signedInChart: "The signed form is in Carol's chart in Healthie.",
    copied: 'Copied',
    taskTitle: 'Task',
    taskMeta: 'Due {due} · From {from}',
    taskDoneMeta: 'Done {time}',
    search: 'Search patients',
    filters: [{ key: 'all', label: 'All' }, { key: 'unread', label: 'Unread' }, { key: 'provider', label: 'Needs provider' }, { key: 'mine', label: 'Assigned to me' }],
    offHours: 'Off hours. Notifications paused until 7 AM.',
    offHoursSub: "Patients see: replies within 48 hours, weekends don't count.",
    contextBar: 'Visit Sep 22 · Next Oct 20 · GLP-1 not started',
    seesAs: 'Carol sees this as: {name}',
    careOnly: 'Only your care team sees this',
    composerPlaceholder: 'Message Carol',
    templatesLabel: 'Templates',
    planChip: 'Care plan · Sep 22',
    attachTitle: 'Attach',
    attachPhoto: 'Photo',
    attachDoc: 'Document to sign',
    attachPlan: 'Care plan',
    juneSuggested: 'June suggested 2 short reads to Carol.',
    photoTitle: 'Photo from Carol',
    photoSave: "Save to Carol's chart",
    replyToCarol: 'Reply to Carol',
    openChat: 'Open chat',
    summarize: 'Summarize',
    summaryLabel: 'Summary',
    markDone: 'Mark done',
    markDonePrompt: 'Reply sent. Mark this task done?',
    copyToChart: 'Copy to chart note',
    copiedToast: "Copied to Carol's chart note in Healthie",
    syncedToast: 'Saved to Healthie',
    noTasks: 'No open tasks.',
    openLabel: 'Open',
    doneLabel: 'Done',
    wrote: 'Carol wrote · {when}',
    actions: { title: 'Message', task: 'Create task', copy: 'Copy', unread: 'Mark unread' },
    accountTitle: 'Switch account (demo)',
    sheet: {
      title: 'New task',
      taskLabel: 'Task',
      detailsLabel: 'Details',
      assignLabel: 'Assign to',
      assign: [{ key: 'md', label: 'Dr. Desai' }, { key: 'cc', label: 'Khadija' }, { key: 'team', label: 'Care team' }],
      me: ' (me)',
      teamName: 'Care team',
      teamSentenceName: 'Your care team',
      dueLabel: 'Due',
      due: [{ key: 'promise', label: "{promise} — Carol's 48-hour promise" }, { key: 'today', label: 'Today by 5 PM' }, { key: 'visit', label: 'Before next visit (Oct 20)' }],
      visitDue: at(2026, 9, 19, 17, 0),
      followLabel: 'Follow-up',
      follow: [
        { key: 'chat', label: 'Reply in chat', carol: '{name} will reply by {due}.' },
        { key: 'visit', label: 'Book a visit', carol: 'Khadija will help you book a visit.' },
        { key: 'next', label: 'Discuss at next visit', carol: 'Dr. Desai will go over this on Oct 20.' }
      ],
      checks: [
        { key: 'previsit', label: 'Add to pre-visit summary' },
        { key: 'summary', label: 'Attach a summary for Dr. Desai' },
        { key: 'tell', label: 'Tell Carol who will reply' }
      ],
      preview: 'Carol will see: {sentence}',
      previewSilent: 'Carol’s chat won’t show a change.',
      create: 'Create task',
      titleFallback: 'Follow up with Carol',
      defaults: { title: 'BP pill okay with GLP-1?', assign: 'md', due: 'promise', follow: 'chat', previsit: true, summary: true, tell: true }
    },
    intake: {
      title: 'June intake · {when}',
      rows: [
        ['Questions', '{questions}'],
        ['Attached', '{attached}'],
        ['June answered', '{answered}'],
        ['Feeling now', '{feel}'],
        ['Dizzy lately', '{dizzy}'],
        ['Red flags', '{flags}'],
        ['Protocol', 'Medicine questions go to the provider.'],
        ['Promise to Carol', 'Reply by {by}']
      ],
      scriptedQuestions: 'BP pill okay with GLP-1? · Where to get labs? · Next visit?',
      quoted: '“{text}”',
      photo: '1 photo — {label}',
      none: 'None',
      notYet: '—',
      answeredVisit: 'Next visit: Tue, Oct 20 at 10:30 AM',
      feel: { fine: 'Fine', 'a-little': 'A little sick', very: 'Very sick' },
      dizzy: { no: 'No', yes: 'Yes' },
      flagsNone: 'None reported',
      flagsVery: 'Feels very sick',
      flagsRed: 'Reported · Told to call 911',
      pending: ['Status', 'June is still asking Carol']
    },
    summaryForProvider: {
      title: 'Summary for {to} · from {by}',
      scripted: ['Carol asked if her blood pressure pill is okay with the weight medicine.',
        "She feels fine and hasn't felt dizzy.",
        'She sent a photo of the bottle: lisinopril 10 mg, once a day. Khadija sent her lab order.'],
      asked: 'Carol wrote: “{text}”',
      promise: 'Promise to Carol: reply by {due}.'
    },
    /* The recap is built from what happened in the chat (care.js model.buildSummary), one fact per line. */
    summary: {
      title: 'Summary since your visit · Tue, Sep 22',
      facts: {
        opened: 'Carol read your message and care plan on {day} at {time}.',
        openedMessage: 'Carol read your message on {day} at {time}.',
        notOpened: "Carol hasn't opened your message yet.",
        classStarted: 'She started her first class, Seated Strength (15 min).',
        labsAsked: 'She asked where to get her blood test.',
        labsDone: 'She asked where to get her blood test. Khadija sent the lab order.',
        bpAsked: 'She asked if her blood pressure pill is okay with the weight medicine.',
        asked: 'She wrote: “{text}”',
        intake: 'She told June she {feel} and {dizzy}.'
      },
      feel: { fine: 'feels fine', 'a-little': 'feels a little sick', very: 'feels very sick' },
      dizzy: { no: "hasn't felt dizzy", yes: 'has felt dizzy' },
      needsTitle: 'Needs you',
      needs: { answer: 'Answer: {title}', consent: 'Consent form not signed yet.' },
      nothingNeeded: 'Nothing needs you right now.',
      footer: 'Made by June from this chat. Check before you act.'
    },
    records: {
      notified: 'Carol gets a text so she doesn’t miss it.',
      opened: 'Carol opened your message · {time}',
      classStarted: 'Carol started her first class · {time}',
      signed: 'Carol signed GLP-1 treatment consent · {time} · Saved to her chart in Healthie'
    },
    handoff: 'Khadija asked Dr. Desai to answer · {time}',
    taskEvent: 'Task for {to} · Due {due} · by {by}',
    photoSaved: "Saved to Carol's chart in Healthie",
    urgentRow: 'Red flag reported · Told to call 911 · {time}',
    verySickRow: 'Carol says she feels very sick · Marked for Khadija · {time}'
  };

  var kidneyTask = { title: 'Order kidney blood test before Oct 20 visit', assignee: 'cc', due: at(2026, 8, 25, 17, 0), followUp: 'chat' };

  var inboxFiller = [
    { id: 'robert', name: 'Robert Kim', initials: 'RK', program: 'GLP-1 program', preview: 'Robert: My pharmacy says the refill needs approval.',
      at: at(2026, 8, 21, 16, 12), tags: ['can-wait'], unread: false },
    { id: 'diane', name: 'Diane Foster', initials: 'DF', program: 'GLP-1 program', preview: 'Diane: Can I move my visit to Friday?',
      at: at(2026, 8, 21, 14, 30), tags: ['scheduling'], unread: false },
    { id: 'helen', name: 'Helen Ortiz', initials: 'HO', program: 'GLP-1 program', preview: 'You: Your lab order is ready.',
      at: at(2026, 8, 18, 11, 5), tags: [], unread: false }
  ];

  var tasksFiller = [
    { id: 'f1', patientId: 'robert', patient: 'Robert Kim', title: 'Approve refill', assignee: 'md', createdBy: 'cc',
      due: at(2026, 8, 25, 17, 0), status: 'open', followUp: 'chat' },
    { id: 'f2', patientId: 'diane', patient: 'Diane Foster', title: 'Review before visit', assignee: 'md', createdBy: 'cc',
      due: at(2026, 9, 1, 17, 0), status: 'open', followUp: 'next' }
  ];

  var chapters = [
    { name: "Dr. Desai's message arrives", short: 'Message arrives', goal: "Patients open their provider's message in Bold" },
    { name: 'Carol reads her plan and takes a first step', short: 'First step', goal: 'A first in-app action within 7 days' },
    { name: 'Carol asks a question', short: 'A question', goal: 'An answer without working out who to ask' },
    { name: 'Khadija answers first', short: 'Khadija answers', goal: 'More questions resolved without the provider' },
    { name: 'Dr. Desai reviews a recap and replies', short: 'Dr. Desai replies', goal: 'Providers review a summary, not an inbox' },
    { name: 'Carol signs her consent', short: 'Signs consent', goal: 'Tasks get done in Bold, not Healthie' }
  ];

  var hintLabels = {
    'care.send': 'Tap Send on the care team’s phone',
    'patient.sms': 'Tap the text on Carol’s phone',
    'patient.tab.messages': 'Tap Messages in Carol’s tab bar',
    'patient.careplan': 'Tap “See full care plan”',
    'patient.firststep': 'Tap “Start class”',
    'patient.attach': 'Tap +, then pick the photo of the bottle',
    'patient.composer': 'Tap the message box',
    'patient.send': 'Tap Send on Carol’s phone',
    'patient.chip.fine': 'Tap “I feel fine”',
    'patient.chip.no': 'Tap “No”',
    'patient.resource.0': 'Tap the first article',
    'patient.article.close': 'Close the article',
    'care.row.carol': 'Tap Carol’s message in Khadija’s inbox',
    'care.msg.more': 'Tap ⋯ next to Carol’s message, then “Create task”',
    'care.task.create': 'Tap “Create task”',
    'care.templates': 'Tap Templates, then “Lab order sent”',
    'care.task.carol': 'Tap Carol’s task',
    'care.summarize': 'Tap Summarize',
    'care.reply': 'Tap “Reply to Carol”',
    'care.attach': 'Tap +, then “Document to sign”',
    'care.task.done': 'Tap “Mark done”',
    'patient.push': 'Tap the notification on Carol’s phone',
    'patient.doc.review': 'Tap “Review and sign”',
    'patient.sign.agree': 'Check the box, then tap Continue',
    'patient.sign.start': 'Tap the yellow Start tag, then check each box',
    'patient.sign.field': 'Tap the Sign field, then Sign',
    'patient.sign.finish': 'Tap Finish',
    'patient.tab.home': 'Tap Home in Carol’s tab bar',
    'patient.sign.home': 'Tap “See my checklist”'
  };

  /* Demo page chrome (not product copy). */
  var sceneNext = 'Next: {scene}';
  var finale = { title: 'That’s the loop', caption: 'Visit, plan, first class, question, answer, and a signed form, all in Bold.' };
  var deviceWho = { cc: 'Khadija, Medical Assistant', md: 'Dr. Desai, Provider' };

  function t(y, m, d, h, min) { return function () { return at(y, m, d, h, min); }; }

  var steps = [
    // 1 · Dr. Desai's message arrives
    { id: '1.1', chapter: 1, device: 'care', role: 'md', time: t(2026, 8, 22, 15, 8), hint: 'care.send', waitFor: 'visit:sent',
      caption: "Dr. Desai wraps up Carol's first visit and sends her note and care plan, like she does today.",
      auto: function (a) { a.care.sendVisitMessage(); } },
    { id: '1.2', chapter: 1, device: 'patient', time: t(2026, 8, 22, 19, 40), scene: 'That evening · 7:40 PM', hint: 'patient.sms', waitFor: 'patient:home-opened',
      caption: 'A text brings Carol into Bold. Home shows she has a message.',
      auto: function (a) { a.patient.tapSms(); } },
    { id: '1.3', chapter: 1, device: 'patient', hint: 'patient.tab.messages', waitFor: 'patient:thread-opened',
      caption: 'Messages is always one tap away: in the tab bar and the profile menu.',
      auto: function (a) { a.patient.openMessages('tab'); } },
    // 2 · Carol reads her plan and takes a first step
    { id: '2.1', chapter: 2, device: 'patient', hint: 'patient.careplan', waitFor: 'careplan:opened',
      caption: "Her care plan sits right under Dr. Desai's note.",
      auto: function (a) { a.patient.openCarePlan(); } },
    { id: '2.2', chapter: 2, device: 'patient', time: t(2026, 8, 22, 19, 44), hint: 'patient.firststep', waitFor: 'class:started',
      caption: 'One clear first step, a 15-minute seated class. Starting it is the 7-day goal.',
      auto: function (a) { a.patient.startFirstStep(); } },
    // 3 · Carol asks a question
    { id: '3.1', chapter: 3, device: 'patient', role: 'cc', time: t(2026, 8, 22, 19, 52), scene: 'Later that night · 7:52 PM', hint: 'patient.attach', then: ['patient.attach.library', 'patient.photo.rx'], waitFor: 'photo:attached',
      caption: 'Later that night, Carol has questions. She adds a photo of her blood pressure pill.',
      auto: function (a) { a.patient.attachPhoto('rx'); } },
    { id: '3.2', chapter: 3, device: 'patient', hint: 'patient.composer', tapAuto: true, waitFor: 'composer:filled',
      caption: 'She writes in her own words. No topic to pick, no one to choose.',
      auto: function (a) { a.patient.typeMessage(carolQuestion); } },
    { id: '3.3', chapter: 3, device: 'patient', hint: 'patient.send', waitFor: 'patient:message-sent',
      caption: 'It goes to one place: her care team.',
      auto: function (a) { a.patient.send(); } },
    { id: '3.4', chapter: 3, device: 'patient', hint: 'patient.chip.fine', waitFor: 'screen:answered',
      caption: 'June answers what it can right away, then asks 2 quick questions.',
      auto: function (a) { a.patient.answer('fine'); } },
    { id: '3.5', chapter: 3, device: 'patient', hint: 'patient.chip.no', waitFor: 'screen:done',
      caption: 'June tells Carol who will answer each part, and by when.',
      auto: function (a) { a.patient.answer('no'); } },
    { id: '3.6', chapter: 3, device: 'patient', hint: 'patient.resource.0', waitFor: 'article:opened',
      caption: "While she waits, June suggests short reads from Bold's care team.",
      auto: function (a) { a.patient.openResource(0); } },
    { id: '3.7', chapter: 3, device: 'patient', hint: 'patient.article.close', waitFor: 'article:closed',
      caption: "On the care team's phone it's after hours. Nobody gets paged.",
      auto: function (a) { a.patient.closeArticle(); } },
    // 4 · Khadija answers first
    { id: '4.1', chapter: 4, device: 'care', role: 'cc', time: t(2026, 8, 23, 8, 2), scene: 'Next morning · 8:02 AM', hint: 'care.row.carol', waitFor: 'care:thread-opened',
      caption: "Khadija starts the day. Carol's message arrives with June's answers attached.",
      auto: function (a) { a.care.openThread('carol'); } },
    { id: '4.2', chapter: 4, device: 'care', hint: 'care.msg.more', then: ['care.action.task'], waitFor: 'task:sheet-opened',
      caption: 'Khadija can send the lab order. The blood pressure question needs Dr. Desai.',
      auto: function (a) { a.care.startTaskFromMessage('latest-patient'); } },
    { id: '4.3', chapter: 4, device: 'care', time: t(2026, 8, 23, 8, 5), hint: 'care.task.create', waitFor: 'task:created',
      caption: 'One task hands it to Dr. Desai with a summary. Carol sees the handoff.',
      auto: function (a) { a.care.createTask(); } },
    { id: '4.4', chapter: 4, device: 'care', hint: 'care.templates', then: ['care.template.labs'], waitFor: 'template:used',
      caption: 'A saved reply, filled in for Carol.',
      auto: function (a) { a.care.useTemplate('lab-order'); } },
    { id: '4.5', chapter: 4, device: 'care', time: t(2026, 8, 23, 8, 7), hint: 'care.send', waitFor: 'care:message-sent',
      caption: 'Carol gets an answer from a named person the next morning.',
      auto: function (a) { a.care.send(); } },
    // 5 · Dr. Desai reviews a recap and replies
    { id: '5.1', chapter: 5, device: 'care', role: 'md', time: t(2026, 8, 23, 12, 40), scene: 'Between visits · 12:40 PM', hint: 'care.task.carol', waitFor: 'task:opened',
      caption: "Dr. Desai isn't on call. Between visits, she opens her task list.",
      auto: function (a) { a.care.openTask('carol'); } },
    { id: '5.2', chapter: 5, device: 'care', hint: 'care.summarize', waitFor: 'summary:ready',
      caption: 'A recap shows what Carol asked and what June and Khadija already answered.',
      auto: function (a) { a.care.summarize(); } },
    { id: '5.3', chapter: 5, device: 'care', hint: 'care.reply', tapAuto: true, waitFor: 'composer:filled',
      caption: 'She answers the clinical question herself.',
      auto: function (a) { a.care.composeReply(desaiReply); } },
    { id: '5.4', chapter: 5, device: 'care', hint: 'care.attach', then: ['care.attach.doc'], waitFor: 'doc:attached',
      caption: 'And sends the consent form Carol needs to sign.',
      auto: function (a) { a.care.attachDocument('consent'); } },
    { id: '5.5', chapter: 5, device: 'care', time: t(2026, 8, 23, 12, 46), hint: 'care.send', waitFor: 'care:message-sent',
      caption: 'Sent, and saved back to Healthie.',
      auto: function (a) { a.care.send(); } },
    { id: '5.6', chapter: 5, device: 'care', hint: 'care.task.done', waitFor: 'task:done',
      caption: "Task done. It's also in her pre-visit summary.",
      auto: function (a) { a.care.completeTask('carol'); } },
    // 6 · Carol signs her consent
    { id: '6.1', chapter: 6, device: 'patient', time: t(2026, 8, 23, 18, 10), scene: 'That evening · 6:10 PM', hint: 'patient.push', waitFor: 'patient:thread-opened',
      before: function (a) { a.patient.showLock('push'); },
      caption: 'Carol gets a notification: Dr. Desai replied.',
      auto: function (a) { a.patient.tapPush(); } },
    { id: '6.2', chapter: 6, device: 'patient', hint: 'patient.doc.review', waitFor: 'sign:opened',
      caption: 'The form opens right in the chat.',
      auto: function (a) { a.patient.openSign('consent'); } },
    { id: '6.3', chapter: 6, device: 'patient', hint: 'patient.sign.agree', then: ['patient.sign.continue'], waitFor: 'sign:disclosure-accepted',
      caption: 'Plain words first, then one checkbox, like DocuSign.',
      auto: function (a) { a.patient.acceptDisclosure(); } },
    { id: '6.4', chapter: 6, device: 'patient', hint: 'patient.sign.start', then: ['patient.sign.box'], waitFor: 'sign:agreements-done',
      caption: 'The yellow tag walks her to each box.',
      auto: function (a) { a.patient.completeAgreements(); } },
    { id: '6.5', chapter: 6, device: 'patient', hint: 'patient.sign.field', then: ['patient.adopt.sign'], waitFor: 'sign:signature-adopted',
      caption: 'She types her name as her signature, or draws it.',
      auto: function (a) { a.patient.adoptSignature('type'); } },
    { id: '6.6', chapter: 6, device: 'patient', time: t(2026, 8, 23, 18, 14), hint: 'patient.sign.finish', waitFor: 'doc:signed',
      caption: 'Signed. The care team sees it, saved to her chart.',
      auto: function (a) { a.patient.finishSigning(); } },
    { id: '6.7', chapter: 6, device: 'patient', hint: 'patient.sign.home', waitFor: 'patient:home-opened',
      caption: 'Back on Home, her checklist shows the progress.',
      auto: function (a) { a.patient.openHome(); } }
  ];

  function clone(o) { return Object.assign({}, o); }

  function initialState() {
    return {
      now: at(2026, 8, 22, 15, 8),
      messages: [],
      expectation: null,
      typing: {},
      presence: {},
      readUpTo: {},
      tasks: tasksFiller.map(clone),
      documents: {},
      intake: null,
      summary: null,
      inbox: inboxFiller.map(clone),
      checklist: { visit: true, message: false, plan: false, consent: false, class: false },
      patient: { view: 'lock', tab: 'home', sheet: null, modal: null, menu: false, notification: null, unread: 0,
        composer: { text: '', photo: null } },
      care: { role: 'md', view: 'thread', thread: 'carol', sheet: null, filter: 'all', taskOpen: null,
        composer: { text: visitMessage, attachment: 'careplan' } }
    };
  }

  var TWC_STORY = {
    cast: cast, visitMessage: visitMessage, carolQuestion: carolQuestion, desaiReply: desaiReply,
    carePlan: carePlan, home: home, accountMenu: accountMenu, tabs: tabs, intro: intro, emergencyNote: emergencyNote,
    status: status, misc: misc, june: june, screening: screening, routing: routing, routeLabels: routeLabels, juneChips: juneChips, articles: articles,
    cameraRoll: cameraRoll, consentDoc: consentDoc, sign: sign, lock: lock, attach: attach, templates: templates,
    care: care, kidneyTask: kidneyTask, inboxFiller: inboxFiller, tasksFiller: tasksFiller, chapters: chapters,
    hintLabels: hintLabels, sceneNext: sceneNext, finale: finale, deviceWho: deviceWho, steps: steps, initialState: initialState
  };
  root.TWC_STORY = TWC_STORY;
  if (typeof module !== 'undefined' && module.exports) module.exports = TWC_STORY;
})(typeof window !== 'undefined' ? window : globalThis);
