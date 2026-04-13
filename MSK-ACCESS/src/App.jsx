import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import ContentArea from './components/ContentArea.jsx'
import { getAllSteps, getNextStep } from './data/navigationStructure.js'

const allSteps = getAllSteps()

export default function App() {
  const [currentStep, setCurrentStep] = useState(allSteps[0])

  const handleNext = () => {
    const next = getNextStep(currentStep.id)
    if (next) setCurrentStep(next)
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
      />
    </div>
  )
}
