import { useState } from 'react'
import { C, BoldLogo, PurpleButton, ScreenWrapper, OnboardingProgress } from './shared.jsx'

const regions = [
  { id: 'knee-left', label: 'Left knee', x: 38, y: 62, side: 'front' },
  { id: 'knee-right', label: 'Right knee', x: 62, y: 62, side: 'front' },
  { id: 'hip-left', label: 'Left hip', x: 36, y: 48, side: 'front' },
  { id: 'hip-right', label: 'Right hip', x: 64, y: 48, side: 'front' },
  { id: 'lower-back', label: 'Lower back', x: 50, y: 52, side: 'back' },
  { id: 'upper-back', label: 'Upper back', x: 50, y: 38, side: 'back' },
  { id: 'shoulder-left', label: 'Left shoulder', x: 36, y: 28, side: 'back' },
  { id: 'shoulder-right', label: 'Right shoulder', x: 64, y: 28, side: 'back' },
]

export default function PainRegions({ onNext }) {
  const [selected, setSelected] = useState(new Set())
  const [view, setView] = useState('front')

  const toggle = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const visible = regions.filter(r => r.side === view)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', borderBottom: `1px solid ${C.border}` }}>
        <BoldLogo size={28} />
      </div>

      <OnboardingProgress current={2} total={10} />

      <ScreenWrapper
        bottomSlot={
          <PurpleButton onClick={onNext} disabled={selected.size === 0}>
            Continue {selected.size > 0 ? `(${selected.size} selected)` : ''}
          </PurpleButton>
        }
      >
        <div style={{ padding: '24px 20px' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 8 }}>
            Where do you feel pain?
          </h2>
          <p style={{ fontSize: 14, color: C.textSec, marginBottom: 20, lineHeight: 1.5 }}>
            Tap the areas on your body where you experience pain or discomfort.
          </p>

          {/* Front/Back toggle */}
          <div style={{ display: 'flex', background: '#f0f0f0', borderRadius: 10, padding: 3, marginBottom: 24 }}>
            {['front', 'back'].map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{
                  flex: 1, padding: '8px 0', borderRadius: 8, border: 'none',
                  background: view === v ? C.white : 'transparent',
                  fontSize: 14, fontWeight: 600,
                  color: view === v ? C.text : C.textSec,
                  cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  boxShadow: view === v ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                }}>
                {v === 'front' ? 'Front' : 'Back'}
              </button>
            ))}
          </div>

          {/* Body diagram */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <div style={{ position: 'relative', width: 200, height: 320 }}>
              {/* Simple body silhouette */}
              <svg viewBox="0 0 200 320" width="200" height="320">
                {/* Head */}
                <ellipse cx="100" cy="36" rx="24" ry="28" fill="#e8d5c4" stroke="#d4b8a0" strokeWidth="1" />
                {/* Neck */}
                <rect x="91" y="60" width="18" height="16" rx="4" fill="#e8d5c4" stroke="#d4b8a0" strokeWidth="1" />
                {/* Torso */}
                <path d="M60 76 Q54 90 52 130 L148 130 Q146 90 140 76 Q120 68 100 68 Q80 68 60 76Z" fill="#e8d5c4" stroke="#d4b8a0" strokeWidth="1" />
                {/* Left arm */}
                <path d="M60 82 Q44 100 42 148 Q48 152 52 148 Q56 110 68 94Z" fill="#e8d5c4" stroke="#d4b8a0" strokeWidth="1" />
                {/* Right arm */}
                <path d="M140 82 Q156 100 158 148 Q152 152 148 148 Q144 110 132 94Z" fill="#e8d5c4" stroke="#d4b8a0" strokeWidth="1" />
                {/* Pelvis */}
                <path d="M52 130 Q48 155 56 170 L144 170 Q152 155 148 130Z" fill="#e8d5c4" stroke="#d4b8a0" strokeWidth="1" />
                {/* Left leg */}
                <path d="M56 168 Q50 210 52 270 Q60 274 68 270 Q70 220 72 168Z" fill="#e8d5c4" stroke="#d4b8a0" strokeWidth="1" />
                {/* Right leg */}
                <path d="M144 168 Q150 210 148 270 Q140 274 132 270 Q130 220 128 168Z" fill="#e8d5c4" stroke="#d4b8a0" strokeWidth="1" />
              </svg>

              {/* Tap targets */}
              {visible.map(region => {
                const isSelected = selected.has(region.id)
                const x = (region.x / 100) * 200
                const y = (region.y / 100) * 320
                return (
                  <div
                    key={region.id}
                    onClick={() => toggle(region.id)}
                    style={{
                      position: 'absolute',
                      left: x - 14,
                      top: y - 14,
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: isSelected ? C.purple : 'rgba(82,0,212,0.15)',
                      border: `2px solid ${isSelected ? C.purple : 'rgba(82,0,212,0.4)'}`,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}
                    title={region.label}
                  >
                    {isSelected && (
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Selected tags */}
          {selected.size > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[...selected].map(id => {
                const r = regions.find(r => r.id === id)
                return r ? (
                  <div key={id} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: C.purpleLight, color: C.purple,
                    borderRadius: 20, padding: '4px 12px', fontSize: 13, fontWeight: 500,
                  }}>
                    {r.label}
                    <span onClick={() => toggle(id)} style={{ cursor: 'pointer', fontSize: 14, lineHeight: 1 }}>×</span>
                  </div>
                ) : null
              })}
            </div>
          )}
        </div>
      </ScreenWrapper>
    </div>
  )
}
