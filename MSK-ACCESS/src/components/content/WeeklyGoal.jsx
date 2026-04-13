import { useState } from 'react'
import { C, AppHeader, SafariBottomBar, PurpleButton, OutlineButton, TrainerTip, RadioOption } from './shared.jsx'

const options = ['1 day', '2 days', '3 days', '4 days', '5+ days']

export default function WeeklyGoal({ onNext }) {
  const [goal, setGoal] = useState(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      <AppHeader streak={1} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 20, lineHeight: 1.3 }}>
          Pick your weekly goal
        </h2>

        {options.map(opt => (
          <RadioOption
            key={opt}
            label={opt}
            selected={goal === opt}
            onSelect={() => setGoal(opt)}
          />
        ))}

        <div style={{ marginTop: 16 }}>
          <TrainerTip>
            Members who set a goal are 4x more likely to stick with their routine.
          </TrainerTip>
        </div>
      </div>

      <div style={{ flexShrink: 0, padding: '12px 16px 8px', borderTop: `1px solid ${C.border}` }}>
        <PurpleButton onClick={onNext} disabled={!goal}>I commit</PurpleButton>
        <OutlineButton onClick={onNext}>I can't commit yet</OutlineButton>
      </div>
      <SafariBottomBar />
    </div>
  )
}
