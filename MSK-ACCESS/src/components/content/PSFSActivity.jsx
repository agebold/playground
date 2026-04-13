import { useState } from 'react'
import { C, BoldLogo, PurpleButton, ScreenWrapper, OnboardingProgress } from './shared.jsx'

const activities = [
  { id: 'stairs', label: 'Climbing stairs', icon: '🪜' },
  { id: 'walking', label: 'Walking', icon: '🚶' },
  { id: 'standing', label: 'Standing for long periods', icon: '🧍' },
  { id: 'shopping', label: 'Shopping or errands', icon: '🛒' },
  { id: 'bending', label: 'Bending or squatting', icon: '🏋️' },
  { id: 'sleeping', label: 'Getting in/out of bed', icon: '🛏️' },
  { id: 'car', label: 'Getting in/out of a car', icon: '🚗' },
  { id: 'dressing', label: 'Putting on shoes or socks', icon: '👟' },
]

export default function PSFSActivity({ onNext }) {
  const [selected, setSelected] = useState(new Set())
  const [scores, setScores] = useState({})

  const toggle = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        setScores(s => { const n = { ...s }; delete n[id]; return n })
      } else {
        if (next.size < 3) next.add(id)
      }
      return next
    })
  }

  const setScore = (id, score) => {
    setScores(prev => ({ ...prev, [id]: score }))
  }

  const allScored = selected.size >= 1 && [...selected].every(id => scores[id] !== undefined)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', borderBottom: `1px solid ${C.border}` }}>
        <BoldLogo size={28} />
      </div>

      <OnboardingProgress current={8} total={10} />

      <ScreenWrapper
        bottomSlot={
          <PurpleButton onClick={onNext} disabled={!allScored}>
            Continue
          </PurpleButton>
        }
      >
        <div style={{ padding: '24px 20px' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 8, lineHeight: 1.3 }}>
            Which activities are most important to you?
          </h2>
          <p style={{ fontSize: 14, color: C.textSec, marginBottom: 6, lineHeight: 1.5 }}>
            Pick up to 3 activities that your pain affects most. Then rate your current difficulty.
          </p>
          <div style={{ fontSize: 12, color: C.textTert, marginBottom: 20 }}>PSFS — Patient-Specific Functional Scale</div>

          {activities.map(activity => {
            const isSelected = selected.has(activity.id)
            return (
              <div key={activity.id} style={{ marginBottom: 10 }}>
                <div
                  onClick={() => toggle(activity.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 16px',
                    background: isSelected ? C.purpleLight : C.white,
                    border: `2px solid ${isSelected ? C.purple : C.border}`,
                    borderRadius: isSelected && scores[activity.id] !== undefined ? '12px 12px 0 0' : 12,
                    cursor: selected.size >= 3 && !isSelected ? 'default' : 'pointer',
                    opacity: selected.size >= 3 && !isSelected ? 0.4 : 1,
                  }}>
                  <span style={{ fontSize: 20 }}>{activity.icon}</span>
                  <span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: C.text }}>{activity.label}</span>
                  <div style={{
                    width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                    border: `2px solid ${isSelected ? C.purple : C.border}`,
                    background: isSelected ? C.purple : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {isSelected && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </div>

                {isSelected && (
                  <div style={{
                    padding: '12px 16px',
                    background: '#f5f0ff',
                    border: `2px solid ${C.purple}`,
                    borderTop: 'none',
                    borderRadius: '0 0 12px 12px',
                  }}>
                    <div style={{ fontSize: 12, color: C.purple, fontWeight: 600, marginBottom: 8 }}>
                      How difficult is this activity? (0 = no difficulty, 10 = unable to perform)
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {Array.from({ length: 11 }, (_, i) => (
                        <div
                          key={i}
                          onClick={(e) => { e.stopPropagation(); setScore(activity.id, i) }}
                          style={{
                            flex: 1, padding: '6px 0', textAlign: 'center',
                            background: scores[activity.id] === i ? C.purple : C.white,
                            color: scores[activity.id] === i ? 'white' : C.text,
                            borderRadius: 6, cursor: 'pointer',
                            fontSize: 12, fontWeight: 600,
                            border: `1px solid ${scores[activity.id] === i ? C.purple : C.border}`,
                          }}>
                          {i}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </ScreenWrapper>
    </div>
  )
}
