import { useState } from 'react'
import { C, PurpleButton } from './shared.jsx'

const exercises = [
  { name: 'Seated leg extensions', sets: 2, reps: 12, icon: '🦵', instruction: 'Sit tall in your chair. Slowly extend your right leg until it\'s straight, hold for 2 seconds, then lower. Keep your core engaged.' },
  { name: 'Standing calf raises', sets: 2, reps: 15, icon: '🦶', instruction: 'Stand behind your chair holding the back for support. Rise onto your toes slowly, hold for 1 second, then lower.' },
  { name: 'Mini squats', sets: 2, reps: 10, icon: '🏋️', instruction: 'Stand with feet hip-width apart. Bend your knees slightly (30–45°), as if sitting back. Keep your weight in your heels.' },
  { name: 'Hamstring curls', sets: 2, reps: 12, icon: '💪', instruction: 'Hold the chair for balance. Stand on one leg and slowly bend the other knee, bringing your heel toward your glutes.' },
  { name: 'Quad stretch', sets: 2, reps: null, icon: '🤸', instruction: 'Hold the chair for balance. Bend one knee and hold your ankle behind you. Hold for 30 seconds, feeling a gentle stretch in your thigh.' },
]

export default function ClassTaking({ onNext }) {
  const [exerciseIdx, setExerciseIdx] = useState(0)
  const [setIdx, setSetIdx] = useState(0)
  const [isResting, setIsResting] = useState(false)

  const ex = exercises[exerciseIdx]
  const progress = ((exerciseIdx) / exercises.length) * 100

  const handleNext = () => {
    if (exerciseIdx < exercises.length - 1) {
      setIsResting(true)
      setTimeout(() => {
        setIsResting(false)
        setExerciseIdx(i => i + 1)
        setSetIdx(0)
      }, 1500)
    } else {
      onNext()
    }
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      background: isResting ? '#f0fff4' : C.white,
      transition: 'background 0.4s',
    }}>
      {/* Top bar */}
      <div style={{
        padding: '12px 20px',
        display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ height: 4, background: C.border, borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: C.purple, width: `${progress}%`, borderRadius: 2, transition: 'width 0.4s' }} />
          </div>
        </div>
        <span style={{ fontSize: 12, color: C.textSec, flexShrink: 0 }}>
          {exerciseIdx + 1}/{exercises.length}
        </span>
      </div>

      {isResting ? (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', padding: 32,
        }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>😌</div>
          <h3 style={{ fontSize: 22, fontWeight: 700, color: C.teal, marginBottom: 8 }}>Rest up</h3>
          <p style={{ fontSize: 14, color: C.textSec, textAlign: 'center' }}>Take a breath. Next exercise coming up...</p>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Exercise display */}
          <div style={{
            background: `linear-gradient(160deg, ${C.purple}10 0%, ${C.purple}05 100%)`,
            padding: '28px 20px',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            borderBottom: `1px solid ${C.border}`,
          }}>
            <div style={{
              width: 100, height: 100, borderRadius: 28,
              background: C.purpleLight,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 48, marginBottom: 16,
              border: `3px solid ${C.purple}30`,
            }}>
              {ex.icon}
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: C.text, textAlign: 'center', marginBottom: 6 }}>{ex.name}</h3>
            <div style={{ display: 'flex', gap: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.purple }}>
                Set {setIdx + 1} of {ex.sets}
              </span>
              {ex.reps && <span style={{ fontSize: 13, color: C.textSec }}>· {ex.reps} reps</span>}
              {!ex.reps && <span style={{ fontSize: 13, color: C.textSec }}>· 30 sec hold</span>}
            </div>
          </div>

          {/* Instruction */}
          <div style={{ flex: 1, padding: '24px 20px', overflowY: 'auto' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.textTert, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
              Instructions
            </div>
            <p style={{ fontSize: 15, color: C.text, lineHeight: 1.7 }}>{ex.instruction}</p>

            {/* Set counter dots */}
            <div style={{ display: 'flex', gap: 8, marginTop: 24, justifyContent: 'center' }}>
              {Array.from({ length: ex.sets }).map((_, i) => (
                <div key={i} style={{
                  width: 12, height: 12, borderRadius: '50%',
                  background: i < setIdx ? C.purple : i === setIdx ? C.purple : C.border,
                  opacity: i < setIdx ? 1 : i === setIdx ? 1 : 0.4,
                  border: i === setIdx ? `2px solid ${C.purple}` : 'none',
                }} />
              ))}
            </div>
          </div>

          {/* Action button */}
          <div style={{ padding: '12px 20px 8px', borderTop: `1px solid ${C.border}` }}>
            <PurpleButton onClick={handleNext}>
              {exerciseIdx < exercises.length - 1
                ? setIdx < ex.sets - 1 ? 'Done — next set' : 'Done — next exercise'
                : 'Finish class! 🎉'}
            </PurpleButton>
          </div>
        </div>
      )}
    </div>
  )
}
