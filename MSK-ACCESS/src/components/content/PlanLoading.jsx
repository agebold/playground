import { useState, useEffect } from 'react'
import { C, BoldLogo } from './shared.jsx'

const steps = [
  'Analyzing your pain profile...',
  'Reviewing your preferences...',
  'Selecting appropriate exercises...',
  'Scheduling your weekly plan...',
  'Personalizing your program...',
]

export default function PlanLoading({ onNext }) {
  const [current, setCurrent] = useState(0)
  const [done, setDone] = useState(new Set())

  useEffect(() => {
    if (current < steps.length) {
      const timer = setTimeout(() => {
        setDone(prev => new Set([...prev, current]))
        setCurrent(c => c + 1)
      }, 900)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(onNext, 600)
      return () => clearTimeout(timer)
    }
  }, [current, onNext])

  const progress = Math.round((done.size / steps.length) * 100)

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      background: `linear-gradient(160deg, #f5f0ff 0%, ${C.white} 60%)`,
      alignItems: 'center', justifyContent: 'center', padding: 32,
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: 22,
        background: C.purple,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 28,
        boxShadow: `0 8px 32px rgba(82,0,212,0.3)`,
      }}>
        <span style={{ fontSize: 36 }}>✨</span>
      </div>

      <h2 style={{ fontSize: 24, fontWeight: 800, color: C.text, textAlign: 'center', marginBottom: 8, letterSpacing: -0.5 }}>
        Building your plan
      </h2>
      <p style={{ fontSize: 14, color: C.textSec, textAlign: 'center', marginBottom: 36 }}>
        This usually takes about 10 seconds.
      </p>

      {/* Progress bar */}
      <div style={{ width: '100%', maxWidth: 280, marginBottom: 36 }}>
        <div style={{ height: 6, background: C.border, borderRadius: 3, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 3,
            background: C.purple,
            width: `${progress}%`,
            transition: 'width 0.8s ease',
          }} />
        </div>
        <div style={{ textAlign: 'right', fontSize: 12, color: C.textTert, marginTop: 4 }}>{progress}%</div>
      </div>

      {/* Steps */}
      <div style={{ width: '100%', maxWidth: 300 }}>
        {steps.map((step, i) => {
          const isDone = done.has(i)
          const isActive = current === i
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 0',
              opacity: i > current ? 0.3 : 1,
              transition: 'opacity 0.4s',
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                background: isDone ? C.purple : isActive ? C.purpleLight : C.border,
                border: `2px solid ${isDone ? C.purple : isActive ? C.purple : C.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.3s',
              }}>
                {isDone ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : isActive ? (
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.purple }} />
                ) : null}
              </div>
              <span style={{
                fontSize: 14, fontWeight: isDone ? 500 : isActive ? 600 : 400,
                color: isDone ? C.textSec : isActive ? C.purple : C.textTert,
              }}>
                {step}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
