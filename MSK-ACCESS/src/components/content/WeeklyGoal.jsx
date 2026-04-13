import { useState } from 'react'
import { C, AppTopBar, ScreenWrapper, BoldNavBar, PurpleButton } from './shared.jsx'

export default function WeeklyGoal({ onNext }) {
  const [goal, setGoal] = useState(3)

  const options = [
    { value: 1, label: '1 class', desc: 'Just getting started', emoji: '🌱' },
    { value: 2, label: '2 classes', desc: 'Building momentum', emoji: '🚶' },
    { value: 3, label: '3 classes', desc: 'Recommended for best results', emoji: '⭐', recommended: true },
    { value: 4, label: '4 classes', desc: 'Extra commitment', emoji: '💪' },
    { value: 5, label: '5 classes', desc: 'High intensity', emoji: '🔥' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.bg }}>
      <AppTopBar title="Weekly goal" />

      <ScreenWrapper
        bottomSlot={<PurpleButton onClick={onNext}>Set my goal</PurpleButton>}
      >
        <div style={{ padding: '24px 20px' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 8, lineHeight: 1.3 }}>
            How many classes per week?
          </h2>
          <p style={{ fontSize: 14, color: C.textSec, marginBottom: 28, lineHeight: 1.5 }}>
            Setting a goal helps you stay consistent. You can always adjust it later.
          </p>

          {options.map(opt => {
            const active = goal === opt.value
            return (
              <div
                key={opt.value}
                onClick={() => setGoal(opt.value)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 16px',
                  background: active ? C.purpleLight : C.white,
                  border: `2px solid ${active ? C.purple : C.border}`,
                  borderRadius: 14, cursor: 'pointer', marginBottom: 10,
                  position: 'relative',
                }}>
                {opt.recommended && (
                  <div style={{
                    position: 'absolute', top: -8, right: 12,
                    background: C.yellow, color: 'white',
                    fontSize: 10, fontWeight: 700, padding: '2px 8px',
                    borderRadius: 10, letterSpacing: '0.05em',
                  }}>RECOMMENDED</div>
                )}
                <span style={{ fontSize: 24, flexShrink: 0 }}>{opt.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: C.text }}>{opt.label}</div>
                  <div style={{ fontSize: 13, color: C.textSec }}>{opt.desc}</div>
                </div>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  border: `2px solid ${active ? C.purple : C.border}`,
                  background: active ? C.purple : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {active && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
                </div>
              </div>
            )
          })}
        </div>
      </ScreenWrapper>
    </div>
  )
}
