import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import ContentArea from './components/ContentArea.jsx'
import { getAllSteps, getNextStep, getPrevStep } from './data/navigationStructure.js'

const allSteps = getAllSteps()

export default function App() {
  const [currentStep, setCurrentStep] = useState(allSteps.find(s => s.id === 'regular-day') ?? allSteps[0])

  const handleNext = () => {
    const next = getNextStep(currentStep.id)
    if (next) setCurrentStep(next)
  }

  const handleBack = () => {
    const prev = getPrevStep(currentStep.id)
    if (prev) setCurrentStep(prev)
  }

  const handleNavigate = (id) => {
    const step = allSteps.find(s => s.id === id)
    if (step) setCurrentStep(step)
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      fontFamily: 'Inter, sans-serif',
    }}>
      <Sidebar
        activeStep={currentStep.id}
        onSelect={setCurrentStep}
      />
      <ContentArea
        step={currentStep}
        onNext={handleNext}
        onBack={handleBack}
        onNavigate={handleNavigate}
      />
    </div>
  )
}
