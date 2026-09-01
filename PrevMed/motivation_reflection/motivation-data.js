/* ══════════════════════════════════════════════════════════════════════════
   motivation-data.js — THE OPTION TABLE.

   Every option shipped in the motivation question must have a row here, and
   every row must carry its tag, its measured share, and the verbatims behind
   it. If an option has no row, it does not ship. This file is the machine-
   readable twin of motivation-options.md.

   Source (only): the GLP-1 onboarding check-in free-text field.
     ../glp1_funnel/checkin-motivation-taxonomy.md
     ../glp1_funnel/checkin-intent-analysis.md
     ../glp1_funnel/data/checkin-responses-2026-06-28_to_2026-07-28.csv
   Window 2026-06-28 → 2026-07-28. n = 690 text answers (1,137 submissions,
   39.3% blank). Live view: Mixpanel project 2330259, report 91760050.

   READ THE PERCENTAGES CORRECTLY. They are multi-label prevalence — how
   often a topic was RAISED. They are not intensity, not "the main reason",
   and not persuasiveness. Order the options by prevalence; do not claim the
   top one is the most convincing.

   NEGATION GUARD on `glp1`: drug-name keywords match any MENTION of a GLP-1,
   including mentions that exist only to reject it ("without a GLP1",
   "can't take injectable"). The analysis script strips those, which moved
   the tag 8.3% → 7.7%. Mention ≠ endorsement.
══════════════════════════════════════════════════════════════════════════ */

/* Options 1–6 ship in every direction and cover ~85% of text answers.
   `depth: 2` options ship only in Direction B, where multi-select tolerates
   a longer list. */
var MOTIVATIONS = [
  {
    id: 'keep_it_off',
    depth: 1,
    emoji: '🎯',
    chip: 'Lose the weight — and keep it off',
    quote: 'Lose the weight — and keep it off.',
    // What Bold actually does about it. No new claims.
    response: 'Your provider plans for the keeping-it-off part from day one — not just the first 20 pounds.',
    agenda: 'How you keep the weight off, not just take it off',
    tag: 'desire.weight_loss + desire.maintenance',
    pct: '63.2 + 12.3',
    verbatims: '“lose weight and keep it off” · “Keeping it off” · “go on maintence?”'
  },
  {
    id: 'pain',
    depth: 1,
    emoji: '🚶',
    chip: 'Move without the pain',
    quote: 'Move without the pain.',
    response: 'Your provider looks at your joints and how you actually move, not only the scale.',
    agenda: 'Whether losing weight will take pressure off your joints',
    tag: 'desire.pain_mobility',
    pct: '12.3',
    verbatims: '“Weight loss.and pain control” · “walk long distances” · “Balance”'
  },
  {
    id: 'what_to_eat',
    depth: 1,
    emoji: '🍽️',
    chip: 'Know what to eat',
    quote: 'Know what to eat.',
    response: 'You get a real plan — meals, movement, sleep. No calorie counting.',
    agenda: 'A plan you can actually eat from — meals, not macros',
    tag: 'desire.plan_guidance',
    pct: '10.6',
    verbatims: '“Menus… hard time knowing what to eat” · “Best eating and exercising plan”'
  },
  {
    id: 'energy',
    depth: 1,
    emoji: '⚡',
    chip: 'Get my energy back',
    quote: 'Get my energy back.',
    response: 'Your provider checks the things that drain energy — sleep, thyroid, blood sugar — before anything else.',
    agenda: 'What is draining your energy — sleep, thyroid, blood sugar',
    tag: 'desire.energy',
    pct: '9.4',
    verbatims: '“get my energy back” · “no ambition daily”'
  },
  {
    id: 'glp1',
    depth: 1,
    emoji: '💊',
    chip: 'Talk about a GLP-1 — pill or shot',
    quote: 'Talk about a GLP-1 — pill or shot.',
    response: 'Both are on the table. Your provider walks you through which one fits you, and what your plan covers.',
    agenda: 'Whether a GLP-1 fits you, and pill versus shot',
    tag: 'desire.medication_interest + question.modality',
    pct: '7.7 + 2.3',
    verbatims: '“I’d like to try weight loss medication” · “Getting back on Zepbound” · “Is it pills or injections”',
    note: 'Negation guard applies — see header. Naming a GLP-1 is not the same as being sold on one.'
  },
  {
    id: 'numbers',
    depth: 1,
    emoji: '❤️',
    chip: 'Keep my numbers in check',
    quote: 'Keep my numbers in check.',
    response: 'Your provider reviews your A1C, blood pressure and current medicines together, not one at a time.',
    agenda: 'Your A1C and blood pressure alongside your weight',
    tag: 'desire.disease_control',
    pct: '6.7',
    verbatims: '“keep A1C down” · “Will help my heart” · “sleep apnea”'
  },
  {
    id: 'hunger',
    depth: 2,
    emoji: '🤫',
    chip: 'Quiet the constant hunger',
    quote: 'Quiet the constant hunger.',
    response: 'The hunger that will not switch off is a physical signal, not willpower. Your provider treats it that way.',
    agenda: 'Why the hunger will not switch off, and what changes it',
    tag: 'desire.appetite_control',
    pct: '4.8',
    verbatims: '“Stopping food noise” · “always hungry” · “Why do I want to eat all the time?”'
  },
  {
    id: 'strength',
    depth: 2,
    emoji: '💪',
    chip: 'Lose fat without losing my strength',
    quote: 'Lose fat without losing my strength.',
    response: 'Protecting muscle and bone while you lose is part of the plan, not an afterthought.',
    agenda: 'Protecting your muscle and bone while you lose',
    tag: 'desire.muscle_strength',
    pct: '3.3',
    verbatims: '“preserving muscle” · “without loss of strength” · “bone density”'
  }
];

/* Escape hatches. Both are real paths, never dead ends, never blocking. */
var ESCAPES = [
  {
    id: 'other',
    emoji: '✏️',
    chip: 'Something else',
    quote: null,
    response: null,
    tag: 'unmapped',
    pct: '1.9',
    verbatims: '“Help” · “Stress” · “My history”',
    note: 'The one surviving free-text field. Optional, with voice input.'
  },
  {
    id: 'not_sure',
    emoji: '',
    chip: 'Not sure yet — help me figure it out',
    quote: null,
    response: null,
    tag: 'tier0.nonanswer',
    pct: '1.6',
    verbatims: '“Not sure” · “Nothing” · “idk”',
    note: 'The skip. Advances the flow and is tracked as not_sure. No hard gate.'
  }
];

/* Direction C only — the optional "anything you're unsure about?" follow-up.
   Drawn from the questions/concerns half of the same taxonomy. */
var WORRIES = [
  {
    id: 'side_effects',
    chip: 'Side effects',
    label: 'You asked about side effects',
    /* second-person form, for embedding in the CC opener sentence */
    ccPhrase: 'side effects',
    answer: 'Your provider starts at the lowest dose and adjusts based on how you feel — not on a fixed schedule.',
    tag: 'question.side_effects',
    pct: '4.2',
    verbatims: '“Will it cause nausea” · “cause hair lose?” · “the skeleton face?”'
  },
  {
    id: 'with_my_meds',
    chip: 'Whether it’s safe with my other medicines',
    label: 'You asked about your other medicines',
    /* second-person form, for embedding in the CC opener sentence */
    ccPhrase: 'taking this alongside your other medicines',
    answer: 'Your provider reviews every medication you take before prescribing anything. Bring your list to the call.',
    tag: 'question.interactions + concern.comorbidity_safety',
    pct: '0.9 + 3.3',
    verbatims: '“take with all my medications” · “am I allowed to take GLP-1?” · “when I have cirrhosis”'
  },
  {
    id: 'pill_or_shot',
    chip: 'Pill or shot',
    label: 'You asked about pill versus shot',
    /* second-person form, for embedding in the CC opener sentence */
    ccPhrase: 'whether it would be a pill or a shot',
    answer: 'Both are on the table. You are not signing up for needles by taking this call.',
    tag: 'question.modality + concern.injection_aversion',
    pct: '2.3 + 0.4',
    verbatims: '“Is it pills or injections” · “can’t take injectable” · “A pill for weight loss”'
  },
  {
    id: 'tried_everything',
    chip: 'I’ve tried everything before',
    label: 'You said you’ve tried this before',
    /* second-person form, for embedding in the CC opener sentence */
    ccPhrase: 'having tried this before',
    answer: 'Your provider starts with what you have already tried, so you are not handed the same plan again.',
    tag: 'concern.tried_everything',
    pct: '3.2',
    verbatims: '“no matter what I try” · “always gain it back” · “self sabatoge”'
  },
  {
    id: 'my_age',
    chip: 'Whether this works at my age',
    label: 'You asked whether this works at your age',
    /* second-person form, for embedding in the CC opener sentence */
    ccPhrase: 'whether this works at your age',
    answer: 'Every Bold provider is board-certified in healthy aging. Adults over 65 are who they treat, not an exception.',
    tag: 'concern.age',
    pct: '2.8',
    verbatims: '“at my age” · “in my old age” · “My age 80”'
  },
  {
    id: 'cost',
    chip: 'What it will cost me',
    label: 'You asked what this will cost',
    /* second-person form, for embedding in the CC opener sentence */
    ccPhrase: 'what this will cost you',
    // Routes to the Care Coordinator, never to a number for the medication.
    // 78% stat + $0-out-of-pocket phrasing per bold-pricing-messaging.
    answer: 'Your Care Coordinator handles billing directly and confirms your costs on this call — no surprises. 78% of Bold patients pay $0 out of pocket for their appointment.',
    tag: 'question.cost_coverage + concern.affordability',
    pct: '4.2 + 1.2',
    verbatims: '“afford with my Medicare” · “can’t afford it. UHC won’t pay” · “insurance quit covering”'
  }
];

/* The three directions. Each tests a different hypothesis about why an
   eligible patient does not book — not three visual treatments. */
var DIRECTIONS = {
  A: {
    name: 'Verbatim echo',
    select: 'single',
    hypothesis: 'The goal was never stated.',
    caption: '<strong>A · Verbatim echo.</strong> Single-select in the patient’s own words, quoted back at scheduling. Cleanest reflection, cleanest analytics.',
    evidence: '89.3% of text answers state a desire, not an objection. Recognition over recall (NN/g).'
  },
  B: {
    name: 'Call agenda',
    select: 'multi',
    maxPicks: 3,
    hypothesis: 'They don’t know what the call is for.',
    caption: '<strong>B · Call agenda.</strong> Pick up to 3; the selections become a preview of what the 15 minutes will cover.',
    evidence: '10.6% ask for “the how, not just a script.” The funnel audit: optimise for commitment, not completion.'
  },
  C: {
    name: 'Goal + worry',
    select: 'single',
    worry: true,
    hypothesis: 'An unanswered worry is the blocker.',
    caption: '<strong>C · Goal + worry.</strong> Captures the goal and the one thing they’re unsure about, then answers it at scheduling. <em>Adds a second question — most exposed to the Signup→Eligible guardrail.</em>',
    evidence: 'Tests the brief’s own premise that cost is not the blocker. Concerns are 14.3% overall, but that subgroup is likeliest to stall.'
  }
};
