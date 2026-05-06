export const navigationStructure = [
  {
    id: 'versions',
    category: 'Pain Scale',
    items: [
      { id: 'version-1', label: 'Version 1', viewType: 'mobile' },
      { id: 'version-2', label: 'Version 2', viewType: 'mobile' },
      { id: 'version-3', label: 'Version 3', viewType: 'mobile' },
      { id: 'version-4', label: 'Version 4', viewType: 'mobile' },
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
