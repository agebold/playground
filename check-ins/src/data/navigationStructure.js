export const navigationStructure = [
  {
    id: 'msk',
    category: 'Session-based check-ins',
    items: [
      { id: 'session-based-v1', label: 'Exploration 1', viewType: 'mobile' },
      { id: 'session-based-v2', label: 'Exploration 2', viewType: 'mobile' },
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
