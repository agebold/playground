import { useState } from 'react'
import boldLogo from '../../assets/bold-logo@2x.png'
import { C, OnboardingHeader, OnboardingScreen, PurpleButton, RadioOption, QuestionHeader } from './shared.jsx'

export default function RegionFocus({ onNext, onBack }) {
  const [answer, setAnswer] = useState(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <OnboardingHeader showBack progress={3} totalSteps={10} logoSrc={boldLogo} onBack={onBack} />
      <OnboardingScreen cta={<PurpleButton onClick={onNext} disabled={!answer}>Continue</PurpleButton>}>
        <QuestionHeader questionNum="#" question="Have you discussed participating in Bold with a health care provider?" />
        <RadioOption label="Yes" selected={answer === 'yes'} onSelect={() => setAnswer('yes')} />
        <RadioOption label="No" selected={answer === 'no'} onSelect={() => setAnswer('no')} />
      </OnboardingScreen>
    </div>
  )
}
