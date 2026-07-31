import { useState } from 'react'
import ContentArea from './components/ContentArea.jsx'
import { C } from './components/content/shared.jsx'
import { getAllSteps, getNextStep, getPrevStep } from './data/navigationStructure.js'

const allSteps = getAllSteps()
const PROTOTYPE_END = { id: 'prototype-end', viewType: 'mobile', canToggle: false }

export default function App({ startStepId, endStepId }) {
  const startStep = allSteps.find(s => s.id === startStepId) ?? allSteps[0]
  const [currentStep, setCurrentStep] = useState(startStep)
  const [resetKey, setResetKey] = useState(0)
  const [selectedRegionLabel, setSelectedRegionLabel] = useState('')

  const handleNext = () => {
    if (currentStep.id === endStepId) {
      setCurrentStep(PROTOTYPE_END)
      return
    }
    const next = getNextStep(currentStep.id)
    if (next) setCurrentStep(next)
  }

  const handleBack = () => {
    if (currentStep.id === startStep.id || currentStep.id === PROTOTYPE_END.id) return
    const prev = getPrevStep(currentStep.id)
    if (prev) setCurrentStep(prev)
  }

  const handleNavigate = (id) => {
    const step = allSteps.find(s => s.id === id)
    if (step) setCurrentStep(step)
  }

  const handleRestart = () => {
    setCurrentStep(startStep)
    setSelectedRegionLabel('')
    setResetKey(k => k + 1)
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      fontFamily: 'Inter, sans-serif',
      position: 'relative',
    }}>
      <button
        onClick={handleRestart}
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 10,
          minHeight: 44,
          padding: '10px 20px',
          background: C.yellow,
          color: '#000000',
          border: 'none',
          borderRadius: 999,
          fontSize: 15,
          fontWeight: 600,
          fontFamily: 'Inter, sans-serif',
          cursor: 'pointer',
        }}
      >
        Restart prototype
      </button>
      <ContentArea
        key={resetKey}
        step={currentStep}
        onNext={handleNext}
        onBack={handleBack}
        onNavigate={handleNavigate}
        selectedRegionLabel={selectedRegionLabel}
        setSelectedRegionLabel={setSelectedRegionLabel}
      />
    </div>
  )
}
