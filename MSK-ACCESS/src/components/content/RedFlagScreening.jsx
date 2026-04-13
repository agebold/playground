import { useState } from 'react'
import { C, BoldLogo, PurpleButton, ScreenWrapper, OnboardingProgress } from './shared.jsx'

const flags = [
  { id: 'fever', label: 'Unexplained fever, chills, or night sweats', icon: '🌡️' },
  { id: 'weight', label: 'Unexplained significant weight loss', icon: '⚖️' },
  { id: 'cancer', label: 'History of cancer', icon: '🔬' },
  { id: 'fracture', label: 'Recent fracture or trauma to the painful area', icon: '🦴' },
  { id: 'steroids', label: 'Long-term use of steroid medications', icon: '💊' },
  { id: 'bowel', label: 'Loss of bladder or bowel control', icon: '⚠️' },
  { id: 'none', label: 'None of the above apply to me', icon: '✅' },
]

export default function RedFlagScreening({ onNext }) {
  const [selected, setSelected] = useState(new Set())

  const toggle = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (id === 'none') {
        return new Set(['none'])
      }
      next.delete('none')
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

      <OnboardingProgress current={1} total={10} />

      <ScreenWrapper
        bottomSlot={
          <PurpleButton onClick={onNext} disabled={selected.size === 0}>
            Continue
          </PurpleButton>
        }
      >
        <div style={{ padding: '24px 20px' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 8, lineHeight: 1.3 }}>
            Do any of the following apply to you?
          </h2>
          <p style={{ fontSize: 14, color: C.textSec, marginBottom: 24, lineHeight: 1.5 }}>
            Select all that apply. Be honest — your safety depends on it.
          </p>

          {flags.map(flag => {
            const checked = selected.has(flag.id)
            const isNone = flag.id === 'none'
            return (
              <div
                key={flag.id}
                onClick={() => toggle(flag.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 16px',
                  background: checked ? (isNone ? '#f0fff4' : '#FFF5E5') : C.white,
                  border: `2px solid ${checked ? (isNone ? C.teal : C.yellow) : C.border}`,
                  borderRadius: 12, cursor: 'pointer', marginBottom: 10,
                }}>
                <span style={{ fontSize: 20 }}>{flag.icon}</span>
                <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: C.text, lineHeight: 1.4 }}>{flag.label}</span>
                <div style={{
                  width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                  border: `2px solid ${checked ? (isNone ? C.teal : C.yellow) : C.border}`,
                  background: checked ? (isNone ? C.teal : C.yellow) : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {checked && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </ScreenWrapper>
    </div>
  )
}
