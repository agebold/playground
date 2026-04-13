import { useState } from 'react'
import { C, BoldLogo, PurpleButton, ScreenWrapper, OnboardingProgress } from './shared.jsx'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function RemindersDays({ onNext }) {
  const [selected, setSelected] = useState(new Set(['Mon', 'Wed', 'Fri']))

  const toggle = (day) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(day)) {
        if (next.size > 1) next.delete(day)
      } else {
        next.add(day)
      }
      return next
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', borderBottom: `1px solid ${C.border}` }}>
        <BoldLogo size={28} />
      </div>

      <OnboardingProgress current={5} total={10} />

      <ScreenWrapper
        bottomSlot={<PurpleButton onClick={onNext}>Continue</PurpleButton>}
      >
        <div style={{ padding: '24px 20px' }}>
          <div style={{ fontSize: 40, marginBottom: 20 }}>🔔</div>

          <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 8, lineHeight: 1.3 }}>
            Which days would you like to exercise?
          </h2>
          <p style={{ fontSize: 14, color: C.textSec, marginBottom: 32, lineHeight: 1.5 }}>
            We'll send you a reminder on these days to keep you on track.
          </p>

          {/* Day grid */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 32, justifyContent: 'center' }}>
            {DAYS.map(day => {
              const active = selected.has(day)
              return (
                <div
                  key={day}
                  onClick={() => toggle(day)}
                  style={{
                    flex: 1,
                    paddingTop: '100%',
                    position: 'relative',
                    cursor: 'pointer',
                  }}>
                  <div style={{
                    position: 'absolute', inset: 0,
                    borderRadius: 12,
                    background: active ? C.purple : C.bg,
                    border: `2px solid ${active ? C.purple : C.border}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: active ? 'white' : C.textTert }}>{day}</span>
                    {active && <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.6)' }} />}
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{
            background: C.purpleLight, borderRadius: 12, padding: 16,
            display: 'flex', gap: 10, alignItems: 'center',
          }}>
            <span style={{ fontSize: 20 }}>💡</span>
            <p style={{ fontSize: 13, color: C.purple, lineHeight: 1.5 }}>
              <strong>{selected.size} day{selected.size !== 1 ? 's' : ''} selected.</strong>{' '}
              Most people see the best results with 3–4 sessions per week.
            </p>
          </div>
        </div>
      </ScreenWrapper>
    </div>
  )
}
