import { useState } from 'react'
import boldLogo from '../../assets/bold-logo@2x.png'
import { C, OnboardingHeader, OnboardingScreen, PurpleButton, RadioOption, QuestionHeader } from './shared.jsx'

export default function Preferences({ onNext, onBack }) {
  const [answer, setAnswer] = useState(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <OnboardingHeader showBack progress={4} totalSteps={10} logoSrc={boldLogo} onBack={onBack} />
      <OnboardingScreen cta={<PurpleButton onClick={onNext} disabled={!answer}>Continue</PurpleButton>}>
        <QuestionHeader questionNum="#" question="What position do you prefer for exercising?" />
        <RadioOption label="Seated" selected={answer === 'seated'} onSelect={() => setAnswer('seated')} />
        <RadioOption label="Standing" selected={answer === 'standing'} onSelect={() => setAnswer('standing')} />
        <RadioOption label="A mix of seated and standing" selected={answer === 'mix'} onSelect={() => setAnswer('mix')} />
      </OnboardingScreen>
    </div>
  )
}
