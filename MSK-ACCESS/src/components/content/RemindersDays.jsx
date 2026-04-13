import { useState } from 'react'
import { C, OnboardingHeader, OnboardingScreen, PurpleButton, CheckboxOption, QuestionHeader } from './shared.jsx'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function RemindersDays({ onNext }) {
  const [selected, setSelected] = useState(new Set(['Mon', 'Wed', 'Fri']))

  const toggle = (day) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(day)) { if (next.size > 1) next.delete(day) }
      else next.add(day)
      return next
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <OnboardingHeader showBack progress={5} totalSteps={10} />
      <OnboardingScreen cta={<PurpleButton onClick={onNext}>Continue</PurpleButton>}>
        <QuestionHeader
          questionNum="#"
          question="What days do you prefer to exercise?"
          sublabel="We'll send reminders on these days to help you get moving! We've preselected our most popular days."
        />
        <div style={{ fontSize: 13, fontWeight: 600, color: C.textSec, marginBottom: 10 }}>Days of week</div>
        {DAYS.map(day => (
          <CheckboxOption
            key={day}
            label={day}
            checked={selected.has(day)}
            onToggle={() => toggle(day)}
          />
        ))}
      </OnboardingScreen>
    </div>
  )
}
