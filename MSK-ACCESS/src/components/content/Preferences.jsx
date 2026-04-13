import { useState } from 'react'
import { C, OnboardingHeader, OnboardingScreen, PurpleButton, RadioOption, QuestionHeader } from './shared.jsx'

export default function Preferences({ onNext }) {
  const [answer, setAnswer] = useState(null)

  const select = (v) => { setAnswer(v); setTimeout(onNext, 280) }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <OnboardingHeader showBack progress={4} totalSteps={10} />
      <OnboardingScreen cta={<PurpleButton onClick={onNext} disabled={!answer}>Continue</PurpleButton>}>
        <QuestionHeader questionNum="#" question="What position do you prefer for exercising?" />
        <RadioOption label="Seated" selected={answer === 'seated'} onSelect={() => select('seated')} />
        <RadioOption label="Standing" selected={answer === 'standing'} onSelect={() => select('standing')} />
        <RadioOption label="A mix of seated and standing" selected={answer === 'mix'} onSelect={() => select('mix')} />
      </OnboardingScreen>
    </div>
  )
}
