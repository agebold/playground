import { useState } from 'react'
import ContentArea from './components/ContentArea.jsx'
import UserbrainCallout from './components/UserbrainCallout.jsx'
import { C } from './components/content/shared.jsx'
import { getAllSteps, getNextStep, getPrevStep, getStepIndex } from './data/navigationStructure.js'

const allSteps = getAllSteps()
const PROTOTYPE_END = { id: 'prototype-end', viewType: 'mobile', canToggle: false }

export default function App({ startStepId, endStepId }) {
  const startStep = allSteps.find(s => s.id === startStepId) ?? allSteps[0]
  const [currentStep, setCurrentStep] = useState(startStep)
  const [resetKey, setResetKey] = useState(0)
  const [selectedRegionLabel, setSelectedRegionLabel] = useState('')
  const [calloutDismissed, setCalloutDismissed] = useState(false)

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
    setCalloutDismissed(false)
  }

  const handleContentInteraction = () => {
    if (currentStep.id === startStep.id) setCalloutDismissed(true)
  }

  const showCallout = currentStep.id === startStep.id && !calloutDismissed
  const currentStepIndex = getStepIndex(currentStep.id)
  const showSecondCallout = currentStepIndex >= getStepIndex('pain-scale') && currentStepIndex < getStepIndex('reminders')

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
      <UserbrainCallout
        show={showCallout}
        message="Please make sure to read through the user testing instructions before interacting with the prototype!"
        onDismiss={() => setCalloutDismissed(true)}
      />
      <UserbrainCallout
        show={showSecondCallout}
        side="left"
        message="Remember to think out loud — what's clear, what's confusing, anything you're noticing about each of these steps."
      />
      <div
        style={{ display: 'flex', flex: 1, minHeight: 0 }}
        onClick={handleContentInteraction}
      >
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
    </div>
  )
}
