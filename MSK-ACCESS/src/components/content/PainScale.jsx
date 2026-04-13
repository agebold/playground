import { useState } from 'react'
import { C, BoldLogo, PurpleButton, ScreenWrapper, OnboardingProgress } from './shared.jsx'

const descriptors = ['No pain', 'Minimal', 'Mild', 'Moderate', 'Moderate', 'Moderate', 'Severe', 'Severe', 'Very severe', 'Worst possible', 'Unbearable']
const faces = ['😊', '🙂', '😐', '😕', '😟', '😣', '😖', '😢', '😭', '🤯', '💀']
const colors = ['#22C55E', '#4ADE80', '#86EFAC', '#FDE047', '#FCD34D', '#FBBF24', '#FB923C', '#F87171', '#EF4444', '#DC2626', '#991B1B']

export default function PainScale({ onNext }) {
  const [value, setValue] = useState(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', borderBottom: `1px solid ${C.border}` }}>
        <BoldLogo size={28} />
      </div>

      <OnboardingProgress current={7} total={10} />

      <ScreenWrapper
        bottomSlot={
          <PurpleButton onClick={onNext} disabled={value === null}>
            Continue
          </PurpleButton>
        }
      >
        <div style={{ padding: '24px 20px' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 8, lineHeight: 1.3 }}>
            How would you rate your pain right now?
          </h2>
          <p style={{ fontSize: 14, color: C.textSec, marginBottom: 8, lineHeight: 1.5 }}>
            This is your baseline. We'll track your progress over time.
          </p>
          <div style={{ fontSize: 12, color: C.textTert, marginBottom: 32 }}>NPRS — Numeric Pain Rating Scale</div>

          {/* Selected display */}
          {value !== null && (
            <div style={{
              textAlign: 'center', marginBottom: 28,
              padding: 20, background: `${colors[value]}20`,
              borderRadius: 16, border: `2px solid ${colors[value]}40`,
            }}>
              <div style={{ fontSize: 48, marginBottom: 4 }}>{faces[value]}</div>
              <div style={{ fontSize: 40, fontWeight: 800, color: colors[value] }}>{value}</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.text }}>{descriptors[value]}</div>
            </div>
          )}

          {/* Number grid */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
            {Array.from({ length: 11 }, (_, i) => (
              <div
                key={i}
                onClick={() => setValue(i)}
                style={{
                  width: 'calc(16.66% - 5px)',
                  aspectRatio: '1',
                  minWidth: 44,
                  borderRadius: 12,
                  background: value === i ? colors[i] : `${colors[i]}25`,
                  border: `2px solid ${value === i ? colors[i] : `${colors[i]}50`}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: 18, fontWeight: 700,
                  color: value === i ? 'white' : colors[i],
                  transition: 'all 0.15s',
                }}>
                {i}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: C.textTert }}>0 = No pain</span>
            <span style={{ fontSize: 12, color: C.textTert }}>10 = Worst pain</span>
          </div>
        </div>
      </ScreenWrapper>
    </div>
  )
}
