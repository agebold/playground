/* ==========================================================================
   flow-default.js — the default conversation spec
   --------------------------------------------------------------------------
   This is the editable spine. Every field here is exposed in the panel's Flow
   tab, so the conversation can be re-shaped without touching code.

   Per step:
     id        stable key — outcomes and skipIf reference it
     label     shown in the panel and sent to the model as "current step"
     say       what June says. A BLANK LINE becomes a new chat bubble.
               **double asterisks** render bold.
     kind      none | chips | chips-multi | text | photo | confirm | result
     options   chips, in order. `exit:true` marks the always-available way out.
     field     app-state key this step writes (via a validated setter)
     skipIf    expression over state, evaluated in a tiny safe evaluator
     notes     "Notes for June" — free prose injected into the system prompt
               for this step. This is how you steer narration and asides
               without editing the script.
     progress  0..1 for the progress bar

   Copy sources: FigJam board node 1883:6144 for the flow and the outcome
   wording, bold-pricing-messaging for anything with a number in it.
   ========================================================================== */

(function (global) {
  'use strict';

  var STEPS = [
    {
      id: 'intro',
      label: 'Why this helps',
      progress: 0.08,
      kind: 'chips',
      say:
        "Hi {{FIRST_NAME}} — I'm June, Bold's AI assistant.\n\n"
        + "Your call with {{COORDINATOR_NAME}} is booked for **{{APPT_WHEN}}**, and that's all set.\n\n"
        + "If you've got a minute, I can check what your plan covers first — then {{COORDINATOR_NAME}} can spend the call on your care instead of your paperwork.",
      options: [
        { label: "Sure, let's do it", value: 'start' },
        { label: 'Why do you need this?', value: 'why', aside: true },
        { label: 'Not now', value: 'defer', exit: true },
      ],
      notes:
        "Opening turn. Keep it to three short bubbles. Make it obvious this is optional and that "
        + "the appointment is already safe. Do not use the word 'verify' without a plain-English gloss. "
        + "Never imply urgency or that they are behind.",
    },

    {
      id: 'insurance_type',
      label: 'Insurance type',
      progress: 0.25,
      kind: 'chips',
      field: 'insuranceType',
      say: 'What kind of Medicare coverage do you have?',
      options: [
        { label: 'Original Medicare', value: 'original' },
        { label: 'Medicare Advantage', value: 'advantage' },
        { label: "I'm not sure", value: 'unsure', aside: true },
        { label: 'Finish this later', value: 'defer', exit: true },
      ],
      notes:
        "If they pick 'I'm not sure', describe the two cards in plain language and ask again — "
        + "Original Medicare cards are red, white and blue and say 'Medicare Number'; Medicare "
        + "Advantage cards come from a private insurer like UnitedHealthcare, Humana or Aetna. "
        + "Never make them feel they should already know this.",
    },

    {
      id: 'carrier',
      label: 'Carrier',
      progress: 0.4,
      kind: 'chips',
      field: 'carrier',
      skipIf: "insuranceType !== 'advantage'",
      say: "Who's your Medicare Advantage plan through?",
      options: [
        { label: 'UnitedHealthcare', value: 'UnitedHealthcare' },
        { label: 'Aetna', value: 'Aetna' },
        { label: 'Humana', value: 'Humana' },
        { label: 'Anthem', value: 'Anthem' },
        { label: 'Blue Cross Blue Shield', value: 'Blue Cross Blue Shield' },
        { label: 'Wellpoint', value: 'Wellpoint' },
        { label: 'Something else', value: '__other', other: true },
        { label: 'Finish this later', value: 'defer', exit: true },
      ],
      notes:
        "The carrier name is on the front of the card. If they pick 'Something else', accept "
        + "whatever they type without judgement — plans have a lot of local names.",
    },

    {
      id: 'member_id',
      label: 'Member ID',
      progress: 0.6,
      kind: 'text',
      field: 'memberId',
      // a bare identifier is truthy-tested by the sandboxed evaluator, so this
      // skips the ask when the path was already chosen on the first screen
      skipIf: 'memberIdPath',
      say:
        "Last thing I need: the **member ID** on your insurance card.\n\n"
        + "Dashes and spaces don't matter.",
      placeholder: 'Member ID',
      inputLabel: 'Member ID',
      help: 'How can I find this?',
      options: [
        { label: 'Take a photo of my card', value: 'photo' },
        { label: "My card isn't with me", value: 'nocard' },
        { label: 'Finish this later', value: 'defer', exit: true },
      ],
      notes:
        "This is the one genuinely new ask and historically the drop-off point. Keep it to one "
        + "line plus the reassurance about formatting. The photo and 'card isn't with me' options "
        + "are equal alternatives, not lesser ones — never describe them as a fallback or a "
        + "second-best. If they seem hesitant, offer to let the coordinator handle it.",
    },

    {
      id: 'card_photos',
      label: 'Card photos',
      progress: 0.7,
      kind: 'photo',
      field: 'cardPhotos',
      skipIf: "memberIdPath !== 'photo'",
      say:
        "Easy — a photo of the **front and back** works just as well.\n\n"
        + 'Your coordinator reads it before your call.',
      notes:
        "No OCR happens here, so do not claim we've read the card. Confirm receipt and say a "
        + "person will look at it. Nothing here is instant.",
    },

    {
      id: 'save_resume',
      label: 'Save and resume',
      progress: 0.7,
      kind: 'chips',
      field: 'resumeChannel',
      skipIf: "memberIdPath !== 'nocard'",
      say:
        "No problem at all — most people don't have it handy.\n\n"
        + 'How should I get you back here when the card turns up?',
      options: [
        { label: 'Text me a link', value: 'sms' },
        { label: 'Email me a link', value: 'email' },
        { label: 'Just handle it on my call', value: 'coordinator', exit: true },
      ],
      // only the coordinator answer ends the run here; sms/email fall through
      // to `reminder_time` below
      finish: {
        coordinator: { outcome: 'deferred', rung: 'coordinator_will_handle' },
      },
      notes:
        "'Just handle it on my call' is a perfectly good answer — treat it as done, not as a "
        + "drop-off. Do not ask again after this.",
    },

    {
      id: 'reminder_time',
      label: 'Reminder time',
      progress: 0.75,
      kind: 'chips',
      field: 'reminderTime',
      // skipped whenever no channel was chosen — either save_resume never ran,
      // or they picked the coordinator and the run already ended there
      skipIf: '!resumeChannel',
      say:
        'When would you like me to send it?\n\n'
        + "No rush — it'll be there whenever you're ready for it.",
      options: [
        { label: 'Tomorrow morning', value: 'morning' },
        { label: 'Tomorrow afternoon', value: 'afternoon' },
        { label: 'Tomorrow evening', value: 'evening' },
        { label: "Whenever's easiest", value: 'any' },
        { label: 'Just handle it on my call', value: 'coordinator', exit: true },
      ],
      // every answer here ends the run — this step is now the terminal one on
      // the save-and-resume branch. The exit answer is named explicitly so it
      // lands on its own rung rather than the generic decline.
      finish: {
        coordinator: { outcome: 'deferred', rung: 'coordinator_will_handle' },
        '*': { outcome: 'saved', rung: 'saved_for_later' },
      },
      notes:
        "They have already agreed to a text or an email, so this is a preference, not another "
        + "hurdle. One short line, and never imply a deadline. \"Whenever's easiest\" is a "
        + "complete answer — do not push for a specific time.",
    },

    {
      id: 'confirm_identity',
      label: 'Confirm identity',
      progress: 0.82,
      kind: 'confirm',
      skipIf: "!memberId && !cardPhotos",
      say: "Quick check before I run this — Medicare matches on the exact name.",
      notes:
        "Read the details back and ask them to confirm the name matches the card exactly. "
        + "Medicare eligibility is name-match sensitive, so a nickname will fail. If they fix "
        + "something, confirm the new value back to them in one short line.",
    },

    {
      id: 'checking',
      label: 'Checking coverage',
      progress: 0.92,
      kind: 'checking',
      // Never run a check with nothing to check. Without this, any edit that
      // breaks the finish chain on the save-and-resume branch reaches here with
      // no member ID and reports a coverage result the member never gave us the
      // details for.
      skipIf: '!memberId && !cardPhotos',
      say: 'Checking your coverage…',
      notes:
        "Nothing to say here — the app is waiting on the eligibility check. Do not speculate "
        + "about the result.",
    },

    {
      id: 'outcome',
      label: 'Result',
      progress: 1,
      kind: 'result',
      say: '',
      notes:
        "The app has already decided the outcome and rendered the card. Narrate what it says, "
        + "name what the coordinator will now do on the call, and stop. Never restate a coverage "
        + "decision in your own words and never quote a personal cost.",
    },
  ];

  /* ======================================================================
     Outcomes — one per pVerify branch, plus the declined path.
     `head`/`tone` drive the result card; `actions` are the terminal choices.
     Every outcome offers a next step AND a route back to the dashboard.
     ====================================================================== */

  var OUTCOMES = {
    confirmed_zero: {
      tone: 'good',
      head: "Good news — you're covered and ready to go.",
      say:
        "All set — **your plan covers your Bold visits at $0**.\n\n"
        + "{{COORDINATOR_NAME}} will confirm the exact cost on your call, so there are no surprises.",
      rows: [
        { label: 'Your Bold visits', note: 'Covered by your {{CARRIER}} plan', value: '$0' },
        { label: 'Your personalized care plan', note: 'Meals, movement, sleep — no calorie counting', value: 'Included' },
      ],
      next: {
        title: 'What happens on your call',
        body: "{{COORDINATOR_NAME}} already has your coverage, so the call is about your goals and booking your first provider visit.",
      },
      actions: [
        { label: 'See my appointment', value: 'appointment', primary: true },
        { label: 'Back to dashboard', value: 'dashboard' },
      ],
      foot: 'Nothing here is a prescription or a guarantee.',
    },

    confirmed_cost: {
      tone: 'good',
      head: "You're covered — here's what to expect.",
      say:
        "Confirmed — **your {{CARRIER}} plan covers Bold visits**, with a share of the cost.\n\n"
        + "**78% of Bold patients pay $0 out of pocket.** {{COORDINATOR_NAME}} confirms your exact amount on the call, before anything is charged.",
      rows: [
        { label: 'Your Bold visits', note: 'Covered by your {{CARRIER}} plan — coordinator confirms your exact cost', value: 'Estimated' },
        { label: 'Your personalized care plan', note: 'Meals, movement, sleep — no calorie counting', value: 'Included' },
      ],
      next: {
        title: 'What happens on your call',
        body: '{{COORDINATOR_NAME}} bills your plan directly and confirms your exact cost before anything is charged.',
      },
      actions: [
        { label: 'Ask my coordinator about cost', value: 'handoff', primary: true },
        { label: 'Back to dashboard', value: 'dashboard' },
      ],
      foot: 'Nothing here is a prescription or a guarantee.',
    },

    not_found: {
      tone: 'warn',
      head: "I couldn't match that one.",
      say:
        "No luck with that number — and that's common. **Every plan formats their IDs differently.**\n\n"
        + "Want to try again, send a photo of the card instead, or let {{COORDINATOR_NAME}} sort it out on your call?",
      banner: {
        color: 'yellow',
        title: 'Nothing is lost',
        body: "Your appointment is still confirmed for {{APPT_WHEN}}.",
      },
      actions: [
        { label: 'Try the number again', value: 'retry', primary: true },
        { label: 'Send card photos instead', value: 'photo' },
        { label: 'Let my coordinator handle it', value: 'dashboard' },
      ],
    },

    hmo_referral: {
      tone: 'warn',
      head: 'Your plan needs a referral first.',
      say:
        "Found your plan — **your {{CARRIER}} Medicare HMO needs a referral** from your primary care doctor before a Bold provider can work with you.\n\n"
        + "That's a plan rule, not a no. {{COORDINATOR_NAME}} walks people through this all the time.",
      banner: {
        color: 'yellow',
        title: 'Your next step',
        body: 'Ask your primary care doctor for a referral to Bold. Your coordinator can tell you exactly what to ask for.',
      },
      actions: [
        { label: 'How referrals work', value: 'referral_help', primary: true },
        { label: 'Talk to my coordinator', value: 'handoff' },
        { label: 'Back to dashboard', value: 'dashboard' },
      ],
    },

    not_covered: {
      tone: 'quiet',
      head: "Your plan isn't one we can bill yet.",
      say:
        "I found your plan, and **Bold appointments aren't covered under it right now**.\n\n"
        + "We're actively working to participate with more plans. {{COORDINATOR_NAME}} can go through your options on your call — at no cost either way.",
      banner: {
        color: 'purple',
        title: 'Your next step',
        body: 'Your coordinator will look at every option with you before anything is charged.',
      },
      actions: [
        { label: 'Tell me when my plan is added', value: 'waitlist', primary: true },
        { label: 'Talk to my coordinator', value: 'handoff' },
        { label: 'Back to dashboard', value: 'dashboard' },
      ],
    },

    pending_back_office: {
      tone: 'warn',
      head: 'Your plan takes a little longer to check.',
      say:
        "Your plan doesn't answer these checks instantly — **it usually takes about a day**.\n\n"
        + "Nothing for you to do. We'll email you the moment it's confirmed, and {{COORDINATOR_NAME}} will have it by your call.",
      banner: {
        color: 'yellow',
        title: 'On hold until we confirm your coverage',
        body: "We'll email you the moment it's confirmed — usually within a day.",
      },
      actions: [
        { label: 'Back to dashboard', value: 'dashboard', primary: true },
      ],
    },

    no_part_d: {
      tone: 'quiet',
      head: "Your visits are covered — medication is a different story.",
      say:
        "Your **Bold visits are covered at $0**. On medication: **a GLP-1 isn't covered for you through Bold right now**, and we can still help.\n\n"
        + "Lifestyle change is the foundation of safe, lasting weight loss — and that part starts right away.",
      rows: [
        { label: 'Your Bold visits', note: 'Covered by your {{CARRIER}} plan', value: '$0' },
        { label: 'Your personalized care plan', note: 'Meals, movement, sleep — no calorie counting', value: 'Included' },
      ],
      next: {
        title: 'What happens on your call',
        body: '{{COORDINATOR_NAME}} looks at every medication option with you, at no cost, before anything is prescribed.',
      },
      actions: [
        { label: 'See my updated plan', value: 'plan', primary: true },
        { label: 'Talk to my coordinator', value: 'handoff' },
        { label: 'Back to dashboard', value: 'dashboard' },
      ],
      foot: 'Nothing here is a prescription or a guarantee.',
    },

    /* The majority path. It must read as completely fine. */
    deferred: {
      tone: 'quiet',
      head: "All good — nothing needed from you.",
      say:
        "No problem at all. **Your appointment is confirmed for {{APPT_WHEN}}.**\n\n"
        + "{{COORDINATOR_NAME}} will take care of the insurance side on your call.",
      banner: {
        color: 'purple',
        title: 'Your call is still set',
        body: '{{COORDINATOR_NAME}} will call you at {{APPT_WHEN}}. No cost, and nothing to prepare.',
      },
      actions: [
        { label: 'See my appointment', value: 'appointment', primary: true },
        { label: 'Back to dashboard', value: 'dashboard' },
      ],
    },

    saved: {
      tone: 'good',
      head: "Sent — finish whenever suits you.",
      say:
        "Done. **{{REMINDER_LINE}}** so you can pick this up when the card turns up.\n\n"
        + "And if you'd rather not, {{COORDINATOR_NAME}} handles it on your call. Either way you're set.",
      banner: {
        color: 'green',
        title: 'Nothing is waiting on you',
        body: 'Your appointment is confirmed for {{APPT_WHEN}}.',
      },
      actions: [
        { label: 'Back to dashboard', value: 'dashboard', primary: true },
      ],
    },

    photos_received: {
      tone: 'good',
      head: 'Got your card — thank you.',
      say:
        "**Both photos came through.** A person on your care team reads them before your call, so nothing is automated here.\n\n"
        + "{{COORDINATOR_NAME}} will have your coverage confirmed by {{APPT_WHEN}}.",
      banner: {
        color: 'green',
        title: 'Your next step',
        body: 'Nothing — your coordinator takes it from here.',
      },
      actions: [
        { label: 'See my appointment', value: 'appointment', primary: true },
        { label: 'Back to dashboard', value: 'dashboard' },
      ],
    },
  };

  /* Help sheets opened from in-chat links. */
  var SHEETS = {
    member_id_help: {
      title: 'Where to find your member ID',
      body:
        '<p><strong>Medicare Advantage or a private plan</strong> — the card comes from your insurer '
        + '(UnitedHealthcare, Aetna, Humana, Anthem, Blue Cross Blue Shield). Look for '
        + '<strong>Member ID</strong>, <strong>Member Number</strong>, or <strong>ID #</strong>, '
        + 'usually near the top of the front.</p>'
        + '<p><strong>Original Medicare</strong> — the red, white and blue card. The number is labelled '
        + '<strong>Medicare Number</strong>. It is 11 characters, letters and numbers, printed in groups '
        + 'of four.</p>'
        + '<p>Most plans also show it in their app or member portal, and on the letters they mail you.</p>'
        + '<p>Dashes and spaces don\'t matter, and lower case is fine.</p>',
    },
    why_we_ask: {
      title: 'Why we ask for this',
      body:
        '<p>Your member ID lets us check three things before your call:</p>'
        + '<ul>'
        + '<li>That your Bold provider is <strong>in-network</strong> with your plan</li>'
        + '<li>Whether you have <strong>secondary coverage</strong> that picks up part of the cost</li>'
        + '<li>What\'s left on your <strong>deductible</strong> — which can lower what you pay</li>'
        + '</ul>'
        + '<p>It also means your call is about your care instead of reading numbers off a card.</p>'
        + '<p>Your information is encrypted, shared only with your Bold care team, and never sold.</p>',
    },
    card_types: {
      title: 'Which card do you have?',
      body:
        '<p><strong>Original Medicare</strong> — a <strong>red, white and blue</strong> card from the '
        + 'government. It says <em>Medicare</em> across the top and lists a <em>Medicare Number</em>.</p>'
        + '<p><strong>Medicare Advantage</strong> — a card from a <strong>private insurer</strong> such as '
        + 'UnitedHealthcare, Humana, Aetna, Anthem or Blue Cross Blue Shield. Their logo is on it.</p>'
        + '<p>If you have both, the private insurer card is the one we need.</p>',
    },
    add_to_calendar: {
      title: 'Add to your calendar',
      body:
        '<p>Choose where to save your appointment.</p>'
        + '<div data-options="calendar"></div>'
        + '<p>We will also email you a reminder the day before.</p>',
    },
    appointment_more: {
      title: 'Your appointment',
      body: '<div data-options="more"></div>',
    },
    goal_info: {
      title: 'Where this goal came from',
      body:
        '<p>This is what you told us you wanted to work on when you signed up.</p>'
        + '<p>Your provider will go through it with you on your first visit, and you '
        + 'can change it at any time \u2014 nothing here is fixed.</p>',
    },
    referral_help: {
      title: 'How a referral works',
      body:
        '<p>Some Medicare Advantage HMO plans ask your primary care doctor to refer you before another '
        + 'provider can see you. It is routine paperwork, not a judgement about your care.</p>'
        + '<p>What to ask for: <strong>a referral to Bold for a healthy aging appointment</strong>. Your '
        + 'coordinator can give you the exact wording and the details your doctor\'s office needs.</p>'
        + '<p>Your appointment stays on the calendar while you sort it out.</p>',
    },
  };

  /* The member fixture. Name and DOB are the keys we already hold — the whole
     point of the brief is that only the member ID is new. */
  var MEMBER = {
    firstName: 'Kathleen',
    lastName: 'Kwan',
    dob: '05/14/1958',
    state: 'CA',
    email: 'kathleen.k@example.com',
    phone: '(415) 555-0142',
    ssnLast4: '4821',          // from Verified — enables the silent retry
    coordinatorName: 'Ali N.',
    coordinatorPhone: '(424) 577-5266',
    apptWhen: 'Mon, Nov 3, 9:00am-9:15am',
    apptLength: '15-minute',
    wantsGlp1: true,
  };

  global.JuneFlowDefault = {
    steps: STEPS,
    outcomes: OUTCOMES,
    sheets: SHEETS,
    member: MEMBER,
  };
})(window);
