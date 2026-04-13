import { C, AppTopBar, ScreenWrapper, BoldNavBar, PurpleButton, Tag } from './shared.jsx'

export default function ClassDetails({ onNext }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.bg }}>
      <AppTopBar title="Class details" />

      <ScreenWrapper
        bottomSlot={
          <PurpleButton onClick={onNext}>Start class →</PurpleButton>
        }
      >
        {/* Class hero */}
        <div style={{
          background: `linear-gradient(160deg, ${C.purple} 0%, #4c1d95 100%)`,
          padding: '28px 20px',
          color: 'white',
          position: 'relative',
        }}>
          <div style={{ fontSize: 48, marginBottom: 12, textAlign: 'center' }}>🦵</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, textAlign: 'center', marginBottom: 6, letterSpacing: -0.3 }}>
            Knee Strength Foundations
          </h2>
          <p style={{ fontSize: 13, opacity: 0.8, textAlign: 'center', marginBottom: 16 }}>
            with Dr. Maria Chen, PT
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { icon: '⏱️', label: '20 min' },
              { icon: '📊', label: 'Beginner' },
              { icon: '🦵', label: 'Knee focus' },
            ].map((stat, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.18)',
                borderRadius: 20, padding: '5px 14px',
                fontSize: 12, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                <span>{stat.icon}</span>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '20px' }}>
          {/* About */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.textTert, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
              About this class
            </div>
            <p style={{ fontSize: 14, color: C.textSec, lineHeight: 1.6 }}>
              This beginner-friendly class focuses on building the muscles that support your knee joints. Each exercise is low-impact and can be modified based on your comfort level. You'll finish feeling stronger and more stable.
            </p>
          </div>

          {/* What you'll need */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.textTert, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
              What you'll need
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['A chair for support', 'Comfortable clothes', 'Non-slip surface'].map((item, i) => (
                <div key={i} style={{
                  background: C.white, border: `1px solid ${C.border}`,
                  borderRadius: 20, padding: '6px 14px',
                  fontSize: 13, color: C.textSec,
                }}>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Exercises preview */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.textTert, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
              Exercises ({5} total)
            </div>
            {[
              { name: 'Seated leg extensions', sets: '2 × 12 reps', icon: '🦵' },
              { name: 'Standing calf raises', sets: '2 × 15 reps', icon: '🦶' },
              { name: 'Mini squats', sets: '2 × 10 reps', icon: '🏋️' },
              { name: 'Hamstring curls', sets: '2 × 12 reps', icon: '💪' },
              { name: 'Quad stretch', sets: '30 sec hold × 2', icon: '🤸' },
            ].map((ex, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 0', borderBottom: i < 4 ? `1px solid ${C.border}` : 'none',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: C.purpleLight,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, flexShrink: 0,
                }}>{ex.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{ex.name}</div>
                  <div style={{ fontSize: 12, color: C.textSec }}>{ex.sets}</div>
                </div>
                <span style={{ fontSize: 12, color: C.textTert }}>{i + 1}/{5}</span>
              </div>
            ))}
          </div>

          {/* Instructor */}
          <div style={{
            background: C.white, border: `1px solid ${C.border}`,
            borderRadius: 14, padding: 16,
            display: 'flex', gap: 12, alignItems: 'center',
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: `linear-gradient(135deg, ${C.purple}, #7c3aed)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: 18, fontWeight: 700, flexShrink: 0,
            }}>MC</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Dr. Maria Chen, PT</div>
              <div style={{ fontSize: 12, color: C.textSec }}>Physical Therapist · 12 years experience</div>
              <div style={{ fontSize: 12, color: C.textSec }}>Specializes in knee & hip rehabilitation</div>
            </div>
          </div>
        </div>
      </ScreenWrapper>
    </div>
  )
}
