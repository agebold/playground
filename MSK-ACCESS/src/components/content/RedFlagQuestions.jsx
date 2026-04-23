import { useState } from 'react'
import boldLogo from '../../assets/bold-logo@2x.png'
import { C, OnboardingHeader, OnboardingScreen, PurpleButton, CheckboxOption, QuestionHeader } from './shared.jsx'

const NONE = 'none'

// Mutual-exclusion helper: selecting "none" clears others; selecting any other clears "none"
function toggle(set, id) {
  const next = new Set(set)
  if (id === NONE) {
    return new Set([NONE])
  }
  next.delete(NONE)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  return next
}

// ─── Screen 1: Recent Physical History ───────────────────────────────────────
const S1_OPTIONS = [
  { id: 's1a', label: "A new, sudden injury (like a fall or car accident) that hasn't yet been evaluated by a doctor" },
  { id: 's1b', label: 'A surgical procedure' },
  { id: 's1c', label: 'Specific medical advice telling you not to exercise independently or without supervision' },
  { id: 's1d', label: 'Sudden changes in your bowel, bladder, or sexual function' },
  { id: NONE, label: 'None of the above' },
]

function Screen1({ selected, setSelected, onNext, onBack }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white, }}>
      <OnboardingHeader showBack progress={1} totalSteps={3} logoSrc={boldLogo} onBack={onBack} />
      <OnboardingScreen cta={<PurpleButton onClick={onNext} disabled={selected.size === 0}>Continue</PurpleButton>}>
        <QuestionHeader
          questionNum="#"
          question="Let's start with your recent physical history. Have any of the following occurred in the last 3 months?"
        />
        {S1_OPTIONS.map(o => (
          <CheckboxOption
            key={o.id}
            label={o.label}
            checked={selected.has(o.id)}
            onToggle={() => setSelected(prev => toggle(prev, o.id))}
          />
        ))}
      </OnboardingScreen>
    </div>
  )
}

// ─── Screen 2: Physical Symptoms ─────────────────────────────────────────────
const S2_OPTIONS = [
  { id: 's2a', label: 'Severe pain that prevents you from putting weight on your leg or arm' },
  { id: 's2b', label: 'Persistent pain that keeps you awake at night or hurts even while resting' },
  { id: 's2c', label: 'Unexplained weight loss (10+ lbs in the last 3 months)' },
  { id: 's2d', label: 'History of cancer' },
  { id: NONE, label: 'None of the above' },
]

function Screen2({ selected, setSelected, onNext, onBack }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      <OnboardingHeader showBack progress={2} totalSteps={3} logoSrc={boldLogo} onBack={onBack} />
      <OnboardingScreen cta={<PurpleButton onClick={onNext} disabled={selected.size === 0}>Continue</PurpleButton>}>
        <QuestionHeader
          questionNum="#"
          question="Are you experiencing any of these physical symptoms?"
          sublabel="This helps us determine if this program is the right fit for your current mobility."
        />
        {S2_OPTIONS.map(o => (
          <CheckboxOption
            key={o.id}
            label={o.label}
            checked={selected.has(o.id)}
            onToggle={() => setSelected(prev => toggle(prev, o.id))}
          />
        ))}
      </OnboardingScreen>
    </div>
  )
}

// ─── Screen 3: Care Environment ───────────────────────────────────────────────
const S3_OPTIONS = [
  { id: 's3a', label: 'Have a memory or cognitive condition that makes following exercise instructions difficult' },
  { id: 's3b', label: 'Experiencing thoughts of harming myself or others' },
  { id: NONE, label: 'None of the above' },
]

function Screen3({ selected, setSelected, onNext, onBack }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      <OnboardingHeader showBack progress={3} totalSteps={3} logoSrc={boldLogo} onBack={onBack} />
      <OnboardingScreen cta={<PurpleButton onClick={onNext} disabled={selected.size === 0}>Continue</PurpleButton>}>
        <QuestionHeader
          questionNum="#"
          question="Please tell us if your current care situation includes any of the following."
        />
        {S3_OPTIONS.map(o => (
          <CheckboxOption
            key={o.id}
            label={o.label}
            checked={selected.has(o.id)}
            onToggle={() => setSelected(prev => toggle(prev, o.id))}
          />
        ))}
      </OnboardingScreen>
    </div>
  )
}

// ─── Combined flow ────────────────────────────────────────────────────────────
function isDisqualified(s) {
  return s.size > 0 && !s.has(NONE)
}

export default function RedFlagQuestions({ onBack, onNavigate }) {
  const [screen, setScreen] = useState(1)
  const [s1, setS1] = useState(new Set())
  const [s2, setS2] = useState(new Set())
  const [s3, setS3] = useState(new Set())

  const handleS3Continue = () => {
    if (isDisqualified(s1) || isDisqualified(s2) || isDisqualified(s3)) {
      onNavigate('ineligible')
    } else {
      onNavigate('pain-regions')
    }
  }

  if (screen === 1) {
    return <Screen1 selected={s1} setSelected={setS1} onNext={() => setScreen(2)} onBack={onBack} />
  }
  if (screen === 2) {
    return <Screen2 selected={s2} setSelected={setS2} onNext={() => setScreen(3)} onBack={() => setScreen(1)} />
  }
  return <Screen3 selected={s3} setSelected={setS3} onNext={handleS3Continue} onBack={() => setScreen(2)} />
}
