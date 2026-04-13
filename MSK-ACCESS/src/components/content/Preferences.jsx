import { useState } from 'react'
import { C, BoldLogo, PurpleButton, ScreenWrapper, OnboardingProgress, CheckboxCard } from './shared.jsx'

const options = [
  { id: 'low-impact', label: 'Low impact', sublabel: 'Gentle on joints — no jumping', icon: '🌊' },
  { id: 'chair', label: 'Chair-based', sublabel: 'Can be done while seated', icon: '🪑' },
  { id: 'standing', label: 'Standing exercises', sublabel: 'Balance and strength focus', icon: '🧍' },
  { id: 'stretching', label: 'Stretching & flexibility', sublabel: 'Improve range of motion', icon: '🤸' },
  { id: 'strength', label: 'Strength training', sublabel: 'Build muscle to support joints', icon: '💪' },
  { id: 'breathing', label: 'Breathing & relaxation', sublabel: 'Stress reduction techniques', icon: '🧘' },
]

export default function Preferences({ onNext }) {
  const [selected, setSelected] = useState(new Set())

  const toggle = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', borderBottom: `1px solid ${C.border}` }}>
        <BoldLogo size={28} />
      </div>

      <OnboardingProgress current={4} total={10} />

      <ScreenWrapper
        bottomSlot={
          <PurpleButton onClick={onNext} disabled={selected.size === 0}>
            Continue {selected.size > 0 ? `(${selected.size} selected)` : ''}
          </PurpleButton>
        }
      >
        <div style={{ padding: '24px 20px' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 8 }}>
            What types of exercise do you prefer?
          </h2>
          <p style={{ fontSize: 14, color: C.textSec, marginBottom: 24, lineHeight: 1.5 }}>
            Select all that interest you. We'll use this to shape your plan.
          </p>

          {options.map(opt => (
            <CheckboxCard
              key={opt.id}
              label={opt.label}
              sublabel={opt.sublabel}
              icon={opt.icon}
              checked={selected.has(opt.id)}
              onToggle={() => toggle(opt.id)}
            />
          ))}
        </div>
      </ScreenWrapper>
    </div>
  )
}
