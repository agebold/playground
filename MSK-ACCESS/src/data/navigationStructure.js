export const navigationStructure = [
  {
    id: 'acquisition',
    category: 'Acquisition',
    items: [
      { id: 'facebook-ad', label: 'Facebook ad', viewType: 'mobile', canToggle: false },
    ]
  },
  {
    id: 'enrollment',
    category: 'Enrollment',
    items: [
      { id: 'landing-page', label: 'Landing page', viewType: 'desktop', canToggle: true },
      { id: 'check-eligibility', label: 'Check eligibility', viewType: 'mobile', canToggle: false },
    ]
  },
  {
    id: 'onboarding',
    category: 'Onboarding',
    items: [
      { id: 'red-flag-primer', label: 'Safety screening intro', viewType: 'mobile', canToggle: false },
      { id: 'red-flag-screening', label: 'Red flag screening', viewType: 'mobile', canToggle: false },
      { id: 'pain-regions', label: 'Pain regions', viewType: 'mobile', canToggle: false },
      { id: 'region-focus', label: 'Provider discussion', viewType: 'mobile', canToggle: false },
      { id: 'preferences', label: 'Exercise preferences', viewType: 'mobile', canToggle: false },
      { id: 'reminders-days', label: 'Reminder days', viewType: 'mobile', canToggle: false },
      { id: 'reminders-time', label: 'Reminder time', viewType: 'mobile', canToggle: false },
      { id: 'pain-scale', label: 'Pain scale (NPRS)', viewType: 'mobile', canToggle: false },
      { id: 'psfs-activity', label: 'Functional activity (PSFS)', viewType: 'mobile', canToggle: false },
      { id: 'account-creation', label: 'Account creation', viewType: 'mobile', canToggle: false },
      { id: 'plan-loading', label: 'Plan building', viewType: 'mobile', canToggle: false },
      { id: 'plan-results', label: 'Plan results', viewType: 'mobile', canToggle: false },
    ]
  },
  {
    id: 'activation',
    category: 'Activation',
    items: [
      { id: 'day-1', label: "Day 1 — Today's plan", viewType: 'mobile', canToggle: false },
      { id: 'class-details', label: 'Class details', viewType: 'mobile', canToggle: false },
      { id: 'class-taking', label: 'Class-taking experience', viewType: 'mobile', canToggle: false },
      { id: 'post-class-badge', label: 'Post-class badge', viewType: 'mobile', canToggle: false },
      { id: 'weekly-goal', label: 'Weekly goal setting', viewType: 'mobile', canToggle: false },
      { id: 'weekly-goal-done', label: 'Goal set confirmation', viewType: 'mobile', canToggle: false },
    ]
  },
  {
    id: 'baseline-proms',
    category: 'Baseline PROMs',
    items: [
      { id: 'day-2', label: "Day 2 — Today's plan", viewType: 'mobile', canToggle: false },
      { id: 'koos-primer', label: 'KOOS JR instructions', viewType: 'mobile', canToggle: false },
      { id: 'koos-jr', label: 'KOOS JR questions', viewType: 'mobile', canToggle: false },
      { id: 'koos-outro', label: 'KOOS JR complete', viewType: 'mobile', canToggle: false },
      { id: 'baseline-captured', label: 'Baseline captured', viewType: 'mobile', canToggle: false },
    ]
  },
]

export const getAllSteps = () => navigationStructure.flatMap(s => s.items)
export const getStepIndex = (id) => getAllSteps().findIndex(s => s.id === id)
export const getNextStep = (id) => {
  const steps = getAllSteps()
  const i = getStepIndex(id)
  return i < steps.length - 1 ? steps[i + 1] : null
}
