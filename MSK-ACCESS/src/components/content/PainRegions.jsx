import { useState } from 'react'
import boldLogo from '../../assets/bold-logo@2x.png'
import { C, OnboardingHeader, OnboardingScreen, PurpleButton, CheckboxOption, RadioOption, QuestionHeader } from './shared.jsx'

const REGIONS = [
  { id: 'neck',       label: 'Neck & upper back' },
  { id: 'shoulder',   label: 'Shoulder' },
  { id: 'lower-back', label: 'Lower back' },
  { id: 'hip',        label: 'Hip' },
  { id: 'knee',       label: 'Knee' },
  { id: 'other',      label: 'Other' },
]

// ─── Step 1: Region selection ─────────────────────────────────────────────────
function RegionSelection({ selected, setSelected, otherText, setOtherText, onNext, onBack }) {
  const toggle = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const canContinue = selected.size > 0 && (!selected.has('other') || otherText.trim())

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <OnboardingHeader showBack progress={2} totalSteps={10} logoSrc={boldLogo} onBack={onBack} />
      <OnboardingScreen cta={<PurpleButton onClick={onNext} disabled={!canContinue}>Continue</PurpleButton>}>
        <QuestionHeader questionNum="#" question="Where do you currently experience pain?" sublabel="Choose all that apply." />
        {REGIONS.map(r => (
          <div key={r.id}>
            <CheckboxOption
              label={r.label}
              checked={selected.has(r.id)}
              onToggle={() => toggle(r.id)}
            />
            {r.id === 'other' && selected.has('other') && (
              <div style={{ marginTop: -4, marginBottom: 8, paddingLeft: 2 }}>
                <input
                  type="text"
                  placeholder="Please specify (e.g. wrist, ankle)"
                  value={otherText}
                  onChange={e => setOtherText(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 14px',
                    border: `1.5px solid ${C.border}`, borderRadius: 10,
                    fontSize: 15, fontFamily: 'Inter, sans-serif', color: C.text,
                    background: C.bg, outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </OnboardingScreen>
    </div>
  )
}

// ─── Step 2 (conditional): Region focus ───────────────────────────────────────
function RegionFocus({ selectedRegions, otherText, focusedRegion, setFocusedRegion, onNext, onBack }) {
  const options = [...selectedRegions].map(id => {
    if (id === 'other') return { id, label: otherText || 'Other' }
    return REGIONS.find(r => r.id === id)
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <OnboardingHeader showBack progress={2} totalSteps={10} logoSrc={boldLogo} onBack={onBack} />
      <OnboardingScreen cta={<PurpleButton onClick={onNext} disabled={!focusedRegion}>Continue</PurpleButton>}>
        <QuestionHeader questionNum="#" question="Which area would you like to focus on first?" />
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
function PainChronicity({ regionLabel, chronicity, setChronicity, onNext, onBack }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <OnboardingHeader showBack progress={2} totalSteps={10} logoSrc={boldLogo} onBack={onBack} />
      <OnboardingScreen cta={<PurpleButton onClick={onNext} disabled={!chronicity}>Continue</PurpleButton>}>
        <QuestionHeader
          questionNum="#"
          question={<>When did your <strong>{regionLabel}</strong> pain symptoms first start?</>}
        />
        <RadioOption
          label="Within the past 12 weeks"
          selected={chronicity === 'acute'}
          onSelect={() => setChronicity('acute')}
        />
        <RadioOption
          label="More than 12 weeks ago"
          selected={chronicity === 'chronic'}
          onSelect={() => setChronicity('chronic')}
        />
      </OnboardingScreen>
    </div>
  )
}

// ─── Combined flow ────────────────────────────────────────────────────────────
export default function PainRegions({ onBack, onNavigate }) {
  const [step, setStep] = useState('regions')      // 'regions' | 'focus' | 'chronicity'
  const [selected, setSelected] = useState(new Set())
  const [otherText, setOtherText] = useState('')
  const [focusedRegion, setFocusedRegion] = useState(null)
  const [chronicity, setChronicity] = useState(null)

  // Resolve the label for the currently focused region
  const getFocusedLabel = () => {
    const id = focusedRegion || [...selected][0]
    if (id === 'other') return otherText || 'Other'
    return REGIONS.find(r => r.id === id)?.label ?? ''
  }

  // After region selection: skip focus step if only one region selected
  const handleRegionsContinue = () => {
    setFocusedRegion(null)
    setChronicity(null)
    if (selected.size > 1) {
      setStep('focus')
    } else {
      setStep('chronicity')
    }
  }

  if (step === 'regions') {
    return (
      <RegionSelection
        selected={selected}
        setSelected={setSelected}
        otherText={otherText}
        setOtherText={setOtherText}
        onNext={handleRegionsContinue}
        onBack={onBack}
      />
    )
  }

  if (step === 'focus') {
    return (
      <RegionFocus
        selectedRegions={selected}
        otherText={otherText}
        focusedRegion={focusedRegion}
        setFocusedRegion={setFocusedRegion}
        onNext={() => setStep('chronicity')}
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
      chronicity={chronicity}
      setChronicity={setChronicity}
      onNext={handleChroniCity}
      onBack={() => setStep(selected.size > 1 ? 'focus' : 'regions')}
    />
  )
}
