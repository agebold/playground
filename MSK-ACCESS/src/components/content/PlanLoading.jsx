import { useState, useEffect } from 'react'
import { C, BoldWordmark, SafariBottomBar } from './shared.jsx'

const checks = [
  '<primary focus e.g. manage pain>',
  '<functional goal (if available)>',
  'Preference for seated movements',
]

export default function PlanLoading({ onNext }) {
  const [visible, setVisible] = useState(0)

  useEffect(() => {
    if (visible < checks.length) {
      const t = setTimeout(() => setVisible(v => v + 1), 900)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(onNext, 800)
      return () => clearTimeout(t)
    }
  }, [visible, onNext])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', background: C.white }}>
        {/* Logo */}
        <div style={{ marginBottom: 40 }}>
          <BoldWordmark height={32} />
        </div>

        {/* Bouncing dots */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 40 }}>
          {[C.purple, '#3b82f6', C.yellow, '#14b8a6'].map((color, i) => (
            <div
              key={i}
              style={{
                width: 16, height: 16, borderRadius: '50%', background: color,
                animation: `bounce 1.4s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>

        <style>{`
          @keyframes bounce {
            0%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-12px); }
          }
        `}</style>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 24, textAlign: 'center' }}>
          Creating your personalized plan
        </h2>

        {/* Checklist */}
        <div style={{ width: '100%', maxWidth: 320 }}>
          {checks.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: '8px 0',
                opacity: i < visible ? 1 : 0,
                transition: 'opacity 0.4s ease',
              }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                background: '#e8e8e8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginTop: 1,
              }}>
                <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                  <path d="M1 4l3 3.5L10 1" stroke={C.text} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{ fontSize: 15, color: C.text, lineHeight: 1.4, fontWeight: i === 2 ? 600 : 400 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
      <SafariBottomBar />
    </div>
  )
}
