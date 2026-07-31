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
      { id: 'pcp-consent', label: 'PCP consent', viewType: 'mobile', canToggle: false },
    ]
  },
  {
    id: 'eligibility',
    category: 'Eligibility',
    items: [
      { id: 'eligibility-primer', label: 'Eligibility primer', viewType: 'mobile', canToggle: false },
      { id: 'region-focus', label: 'Provider discussion', viewType: 'mobile', canToggle: false },
      { id: 'red-flag-screening', label: 'Safety attestation', viewType: 'mobile', canToggle: false },
      { id: 'red-flag-questions', label: 'Red flag screening', viewType: 'mobile', canToggle: false },
      { id: 'pain-regions', label: 'Pain regions', viewType: 'mobile', canToggle: false },
      { id: 'eligibility-verdict', label: 'Eligible', viewType: 'mobile', canToggle: false },
      { id: 'ineligible', label: 'Ineligible', viewType: 'mobile', canToggle: false },
    ]
  },
  {
    id: 'onboarding',
    category: 'Onboarding',
    items: [
      { id: 'onboarding-outline', label: 'Program overview', viewType: 'mobile', canToggle: false },
      { id: 'pain-scale', label: 'Pain scale (NPRS)', viewType: 'mobile', canToggle: false },
      { id: 'psfs-activity', label: 'Functional activity (PSFS)', viewType: 'mobile', canToggle: false },
      { id: 'preferences', label: 'Exercise preferences', viewType: 'mobile', canToggle: false },
      { id: 'reminders', label: 'Reminders', viewType: 'mobile', canToggle: false },
      { id: 'consent-hipaa', label: 'Consent — HIPAA', viewType: 'mobile', canToggle: false },
      { id: 'consent-alignment', label: 'Consent — Alignment', viewType: 'mobile', canToggle: false },
      { id: 'consent-care', label: 'Consent — Consent for care', viewType: 'mobile', canToggle: false },
      { id: 'account-creation', label: 'Account creation', viewType: 'mobile', canToggle: false },
      { id: 'plan-loading', label: 'Plan building', viewType: 'mobile', canToggle: false },
      { id: 'plan-results', label: 'Plan results', viewType: 'mobile', canToggle: false },
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
export const getPrevStep = (id) => {
  const steps = getAllSteps()
  const i = getStepIndex(id)
  return i > 0 ? steps[i - 1] : null
}
