import { useState } from 'react'
import boldLogo from '../../assets/bold-logo@2x.png'
import { OnboardingHeader, OnboardingScreen, PurpleButton, CheckboxOption, RadioOption, QuestionHeader } from './shared.jsx'

const REGIONS = [
  { id: 'neck',       label: 'Neck' },
  { id: 'shoulder',   label: 'Shoulder' },
  { id: 'upper-back', label: 'Upper back' },
  { id: 'lower-back', label: 'Lower back' },
  { id: 'hip',        label: 'Hip' },
  { id: 'knee',       label: 'Knee' },
  { id: 'none',       label: 'None of the above' },
]

// ─── Step 1: Region selection ─────────────────────────────────────────────────
function RegionSelection({ selected, setSelected, onNext, onBack }) {
  const toggle = (id) => {
    setSelected(prev => {
      if (id === 'none') {
        return prev.has('none') ? new Set() : new Set(['none'])
      }
      const next = new Set(prev)
      next.delete('none')
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const canContinue = selected.size > 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <OnboardingHeader showBack progress={1} totalSteps={15} logoSrc={boldLogo} onBack={onBack} />
      <OnboardingScreen cta={<PurpleButton onClick={onNext} disabled={!canContinue}>Continue</PurpleButton>}>
        <QuestionHeader questionNum="1" question="Where do you currently experience pain?" sublabel="Choose all that apply." />
        {REGIONS.map(r => (
          <CheckboxOption
            key={r.id}
            label={r.label}
            checked={selected.has(r.id)}
            onToggle={() => toggle(r.id)}
          />
        ))}
      </OnboardingScreen>
    </div>
  )
}

// ─── Step 2 (conditional): Region focus ───────────────────────────────────────
function RegionFocus({ selectedRegions, focusedRegion, setFocusedRegion, onNext, onBack }) {
  const options = [...selectedRegions].map(id => REGIONS.find(r => r.id === id))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <OnboardingHeader showBack progress={2} totalSteps={15} logoSrc={boldLogo} onBack={onBack} />
      <OnboardingScreen cta={<PurpleButton onClick={onNext} disabled={!focusedRegion}>Continue</PurpleButton>}>
        <QuestionHeader questionNum="2" question="Which area would you like to focus on first?" />
        {options.map(r => (
          <RadioOption
            key={r.id}
            label={r.label}
            selected={focusedRegion === r.id}
            onSelect={() => setFocusedRegion(r.id)}
          />
        ))}
      </OnboardingScreen>
    </div>
  )
}

// ─── Combined flow ────────────────────────────────────────────────────────────
export default function PainRegions({ onBack, onNavigate, setSelectedRegionLabel }) {
  const [step, setStep] = useState('regions')      // 'regions' | 'focus'
  const [selected, setSelected] = useState(new Set())
  const [focusedRegion, setFocusedRegion] = useState(null)

  // Resolve the label for the currently focused region
  const getFocusedLabel = (currentFocus = focusedRegion) => {
    const id = currentFocus || [...selected][0]
    return REGIONS.find(r => r.id === id)?.label ?? ''
  }

  // After region selection: no pain reported, or only one region selected,
  // skips straight to the eligibility result; otherwise show the focus step first
  const handleRegionsContinue = () => {
    if (selected.has('none')) {
      onNavigate('eligibility-verdict')
      return
    }
    if (selected.size > 1) {
      setFocusedRegion(null)
      setStep('focus')
    } else {
      setSelectedRegionLabel(getFocusedLabel())
      onNavigate('eligibility-verdict')
    }
  }

  if (step === 'regions') {
    return (
      <RegionSelection
        selected={selected}
        setSelected={setSelected}
        onNext={handleRegionsContinue}
        onBack={onBack}
      />
    )
  }

  const handleFocusContinue = () => {
    setSelectedRegionLabel(getFocusedLabel())
    onNavigate('eligibility-verdict')
  }

  return (
    <RegionFocus
      selectedRegions={selected}
      focusedRegion={focusedRegion}
      setFocusedRegion={setFocusedRegion}
      onNext={handleFocusContinue}
      onBack={() => setStep('regions')}
    />
  )
}
