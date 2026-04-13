import { useState } from 'react'
import { C, OnboardingHeader, OnboardingScreen, PurpleButton, RadioOption, QuestionHeader } from './shared.jsx'

export default function RegionFocus({ onNext }) {
  const [answer, setAnswer] = useState(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <OnboardingHeader showBack progress={3} totalSteps={10} />
      <OnboardingScreen cta={<PurpleButton onClick={onNext} disabled={!answer}>Continue</PurpleButton>}>
        <QuestionHeader questionNum="#" question="Have you discussed participating in Bold with a health care provider?" />
        <RadioOption label="Yes" selected={answer === 'yes'} onSelect={() => { setAnswer('yes'); setTimeout(onNext, 280) }} />
        <RadioOption label="No" selected={answer === 'no'} onSelect={() => { setAnswer('no'); setTimeout(onNext, 280) }} />
      </OnboardingScreen>
    </div>
  )
}
