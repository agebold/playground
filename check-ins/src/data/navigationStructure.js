export const navigationStructure = [
  {
    id: 'msk',
    category: 'Session-based check-ins',
    subsections: [
      {
        id: 'round-3',
        label: 'Round 3 (Final)',
        items: [
          { id: 'round3-a', label: 'A - Locked',   viewType: 'mobile' },
          { id: 'round3-b', label: 'B - Unlocked', viewType: 'mobile' },
        ]
      },
      {
        id: 'round-2',
        label: 'Round 2',
        items: [
          { id: 'round2-v1', label: 'Version 1', viewType: 'mobile' },
          { id: 'round2-v2', label: 'Version 2', viewType: 'mobile' },
          { id: 'round2-v3', label: 'Version 3', viewType: 'mobile' },
          { id: 'round2-v4', label: 'Version 4', viewType: 'mobile' },
        ]
      },
      {
        id: 'round-1',
        label: 'Round 1',
        items: [
          { id: 'session-based-v1', label: 'Exploration 1', viewType: 'mobile' },
          { id: 'session-based-v2', label: 'Exploration 2', viewType: 'mobile' },
          { id: 'session-based-v3', label: 'Exploration 3', viewType: 'mobile' },
          { id: 'session-based-v4', label: 'Exploration 4', viewType: 'mobile' },
        ]
      },
    ]
  },
  {
    id: 'monthly',
    category: 'Monthly check-ins',
    items: [
      { id: 'monthly-v1', label: 'NPS + PSFS (Exploration 1)', viewType: 'mobile' },
    ]
  },
]

export const getAllSteps = () => navigationStructure.flatMap(s =>
  s.subsections
    ? s.subsections.flatMap(sub => sub.items)
    : s.items
)
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
