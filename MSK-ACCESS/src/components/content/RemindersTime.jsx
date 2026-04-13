import { useState } from 'react'
import { C, BoldLogo, PurpleButton, ScreenWrapper, OnboardingProgress } from './shared.jsx'

const presets = [
  { id: 'morning', label: 'Morning', time: '8:00 AM', icon: '🌅', desc: 'Start your day strong' },
  { id: 'midday', label: 'Midday', time: '12:00 PM', icon: '☀️', desc: 'A midday energy boost' },
  { id: 'afternoon', label: 'Afternoon', time: '3:00 PM', icon: '🌤️', desc: 'Beat the afternoon slump' },
  { id: 'evening', label: 'Evening', time: '6:00 PM', icon: '🌆', desc: 'Unwind after your day' },
]

export default function RemindersTime({ onNext }) {
  const [selected, setSelected] = useState('morning')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', borderBottom: `1px solid ${C.border}` }}>
        <BoldLogo size={28} />
      </div>

      <OnboardingProgress current={6} total={10} />

      <ScreenWrapper
        bottomSlot={<PurpleButton onClick={onNext}>Set reminder</PurpleButton>}
      >
        <div style={{ padding: '24px 20px' }}>
          <div style={{ fontSize: 40, marginBottom: 20 }}>⏰</div>

          <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 8, lineHeight: 1.3 }}>
            What time works best for you?
          </h2>
          <p style={{ fontSize: 14, color: C.textSec, marginBottom: 28, lineHeight: 1.5 }}>
            Pick the time you're most likely to exercise. You can change this anytime.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {presets.map(preset => {
              const active = selected === preset.id
              return (
                <div
                  key={preset.id}
                  onClick={() => setSelected(preset.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '16px 16px',
                    background: active ? C.purpleLight : C.white,
                    border: `2px solid ${active ? C.purple : C.border}`,
                    borderRadius: 14, cursor: 'pointer',
                  }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: active ? C.purple : C.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22, flexShrink: 0,
                  }}>
                    {preset.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>{preset.label}</div>
                    <div style={{ fontSize: 13, color: C.textSec }}>{preset.desc}</div>
                  </div>
                  <div style={{
                    fontSize: 15, fontWeight: 700,
                    color: active ? C.purple : C.textSec,
                    flexShrink: 0,
                  }}>
                    {preset.time}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </ScreenWrapper>
    </div>
  )
}
