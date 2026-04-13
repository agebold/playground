import { C, BoldLogo, PurpleButton, ScreenWrapper, BoldNavBar } from './shared.jsx'

const classes = [
  { id: 1, title: 'Knee Strength Foundations', duration: '20 min', level: 'Beginner', instructor: 'Dr. Maria Chen', emoji: '🦵', tag: 'Strength' },
  { id: 2, title: 'Low-Impact Mobility Flow', duration: '18 min', level: 'Beginner', instructor: 'James Park, PT', emoji: '🌊', tag: 'Mobility' },
  { id: 3, title: 'Chair Yoga for Joints', duration: '22 min', level: 'All levels', instructor: 'Sara Williams', emoji: '🧘', tag: 'Flexibility' },
]

export default function PlanResults({ onNext }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.bg }}>
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', borderBottom: `1px solid ${C.border}`, background: C.white }}>
        <BoldLogo size={28} />
        <span style={{ fontSize: 14, fontWeight: 600, color: C.text, marginLeft: 10 }}>Your plan is ready!</span>
      </div>

      <ScreenWrapper
        bottomSlot={
          <PurpleButton onClick={onNext}>Start Day 1 →</PurpleButton>
        }
      >
        {/* Hero */}
        <div style={{
          background: `linear-gradient(135deg, ${C.purple} 0%, #7c3aed 100%)`,
          padding: '28px 20px',
          color: 'white',
        }}>
          <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 6 }}>Personalized for you</div>
          <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8, letterSpacing: -0.5 }}>Your MSK ACCESS Plan</h2>
          <p style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.5, marginBottom: 20 }}>
            Based on your knee pain, preferences, and goals, here's your personalized 3x/week program.
          </p>

          <div style={{ display: 'flex', gap: 12 }}>
            {[
              { label: '3 classes/week', icon: '📅' },
              { label: '~20 min each', icon: '⏱️' },
              { label: 'Knee focus', icon: '🦵' },
            ].map((stat, i) => (
              <div key={i} style={{
                flex: 1, background: 'rgba(255,255,255,0.15)', borderRadius: 10,
                padding: '10px 8px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>{stat.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.9 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '20px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.textTert, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>
            Your weekly classes
          </div>

          {classes.map((cls, i) => (
            <div key={cls.id} style={{
              background: C.white, borderRadius: 14,
              border: `1px solid ${C.border}`,
              padding: '16px',
              marginBottom: 10,
              display: 'flex', gap: 14, alignItems: 'center',
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: `linear-gradient(135deg, ${C.purple}20, ${C.purple}40)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, flexShrink: 0,
              }}>
                {cls.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: C.text }}>{cls.title}</span>
                </div>
                <div style={{ fontSize: 13, color: C.textSec }}>{cls.instructor}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: '2px 8px',
                    background: C.purpleLight, color: C.purple, borderRadius: 20,
                  }}>{cls.tag}</span>
                  <span style={{ fontSize: 11, color: C.textTert }}>{cls.duration} · {cls.level}</span>
                </div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.textTert }}>#{i + 1}</div>
            </div>
          ))}

          <div style={{
            background: '#f0fff8', border: '1px solid #a7f3d0',
            borderRadius: 12, padding: 16, marginTop: 8,
            display: 'flex', gap: 10, alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 20 }}>🎯</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#065f46', marginBottom: 4 }}>Your goal</div>
              <div style={{ fontSize: 13, color: '#065f46', lineHeight: 1.5 }}>
                85% of members with knee pain report less discomfort after 4 weeks. Let's get you there.
              </div>
            </div>
          </div>
        </div>
      </ScreenWrapper>
    </div>
  )
}
