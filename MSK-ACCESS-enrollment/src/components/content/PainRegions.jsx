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
      <OnboardingHeader showBack progress={2} totalSteps={10} logoSrc={boldLogo} onBack={onBack} />
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
      <OnboardingHeader showBack progress={2} totalSteps={10} logoSrc={boldLogo} onBack={onBack} />
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

// ─── Step 3: Pain chronicity ──────────────────────────────────────────────────
function PainChronicity({ regionLabel, questionNum, chronicity, setChronicity, onNext, onBack }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <OnboardingHeader showBack progress={2} totalSteps={10} logoSrc={boldLogo} onBack={onBack} />
      <OnboardingScreen cta={<PurpleButton onClick={onNext} disabled={!chronicity}>Continue</PurpleButton>}>
        <QuestionHeader
          questionNum={questionNum}
          question={<>When did your <strong>{regionLabel.toLowerCase()}</strong> pain symptoms first start?</>}
        />
        <RadioOption
          label="Within the past 3 months"
          selected={chronicity === 'acute'}
          onSelect={() => setChronicity('acute')}
        />
        <RadioOption
          label="More than 3 months ago"
          selected={chronicity === 'chronic'}
          onSelect={() => setChronicity('chronic')}
        />
      </OnboardingScreen>
    </div>
  )
}

// ─── Combined flow ────────────────────────────────────────────────────────────
export default function PainRegions({ onBack, onNavigate, setSelectedRegionLabel }) {
  const [step, setStep] = useState('regions')      // 'regions' | 'focus' | 'chronicity'
  const [selected, setSelected] = useState(new Set())
  const [focusedRegion, setFocusedRegion] = useState(null)
  const [chronicity, setChronicity] = useState(null)

  // Resolve the label for the currently focused region
  const getFocusedLabel = (currentFocus = focusedRegion) => {
    const id = currentFocus || [...selected][0]
    return REGIONS.find(r => r.id === id)?.label ?? ''
  }

  // After region selection: no pain reported skips straight to the eligibility result;
  // otherwise skip the focus step if only one region was selected
  const handleRegionsContinue = () => {
    if (selected.has('none')) {
      onNavigate('eligibility-verdict')
      return
    }
    setFocusedRegion(null)
    setChronicity(null)
    if (selected.size > 1) {
      setStep('focus')
    } else {
      setSelectedRegionLabel(getFocusedLabel())
      setStep('chronicity')
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
    setStep('chronicity')
  }

  if (step === 'focus') {
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

  const handleChroniCity = () => {
    if (chronicity === 'acute') {
      onNavigate('ineligible')
    } else {
      onNavigate('eligibility-verdict')
    }
  }

  return (
    <PainChronicity
      regionLabel={getFocusedLabel()}
      questionNum={selected.size > 1 ? '3' : '2'}
      chronicity={chronicity}
      setChronicity={setChronicity}
      onNext={handleChroniCity}
      onBack={() => setStep(selected.size > 1 ? 'focus' : 'regions')}
    />
  )
}
