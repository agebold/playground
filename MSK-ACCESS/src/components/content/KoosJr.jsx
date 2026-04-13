import { useState } from 'react'
import { C, OnboardingHeader, OnboardingScreen, PurpleButton, RadioOption } from './shared.jsx'

const question = {
  number: 1,
  total: 7,
  text: 'How severe is your knee stiffness after first wakening in the morning?',
}

const options = ['None', 'Mild', 'Moderate', 'Severe', 'Extreme']

export default function KoosJr({ onNext }) {
  const [answer, setAnswer] = useState(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      <OnboardingHeader showBack progress={1} totalSteps={7} />
      <OnboardingScreen cta={<PurpleButton onClick={onNext} disabled={!answer}>Submit</PurpleButton>}>
        <p style={{ fontSize: 13, color: C.textSec, lineHeight: 1.5, marginBottom: 16 }}>
          Think about the past week. How would you describe:
        </p>

        <div style={{
          fontSize: 11, fontWeight: 700, color: C.purple,
          letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6,
        }}>
          Question {question.number} of {question.total}
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 20, lineHeight: 1.35 }}>
          {question.text}
        </h2>

        {options.map(opt => (
          <RadioOption
            key={opt}
            label={opt}
            selected={answer === opt}
            onSelect={() => setAnswer(opt)}
          />
        ))}
      </OnboardingScreen>
    </div>
  )
}
