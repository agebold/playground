import { C, BoldNavBar, PurpleButton } from './shared.jsx'

export default function PostClassBadge({ onNext }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 20px' }}>
        {/* Confetti-like decorative elements */}
        <div style={{ position: 'relative', marginBottom: 28 }}>
          {['🎉', '⭐', '✨', '🎊'].map((emoji, i) => {
            const angles = [330, 30, 150, 210]
            const r = 70
            const rad = (angles[i] * Math.PI) / 180
            return (
              <div key={i} style={{
                position: 'absolute',
                left: 60 + r * Math.cos(rad) - 10,
                top: 60 + r * Math.sin(rad) - 10,
                fontSize: 20,
              }}>{emoji}</div>
            )
          })}

          {/* Badge circle */}
          <div style={{
            width: 120, height: 120, borderRadius: '50%',
            background: `linear-gradient(135deg, ${C.yellow} 0%, #f97316 100%)`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 12px 40px rgba(245,165,0,0.4)`,
            position: 'relative',
            border: '6px solid white',
          }}>
            <span style={{ fontSize: 44 }}>🏅</span>
          </div>
        </div>

        <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, textAlign: 'center', marginBottom: 8, letterSpacing: -0.5 }}>
          Class complete!
        </h2>
        <p style={{ fontSize: 16, color: C.textSec, textAlign: 'center', marginBottom: 6 }}>
          You earned the
        </p>
        <div style={{
          fontSize: 20, fontWeight: 800, color: C.purple, textAlign: 'center', marginBottom: 24,
          background: C.purpleLight, padding: '8px 20px', borderRadius: 20,
        }}>
          "First Step" Badge 🥇
        </div>

        {/* Stats */}
        <div style={{
          width: '100%', background: C.bg, borderRadius: 16, border: `1px solid ${C.border}`,
          padding: '16px 20px', marginBottom: 24,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            {[
              { label: 'Duration', value: '20 min' },
              { label: 'Exercises', value: '5' },
              { label: 'Streak', value: '1 day 🔥' },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: C.text }}>{stat.value}</div>
                <div style={{ fontSize: 12, color: C.textSec, marginTop: 2 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          background: '#f0fff4', border: '1px solid #a7f3d0',
          borderRadius: 12, padding: '14px 16px', marginBottom: 24, width: '100%',
        }}>
          <p style={{ fontSize: 14, color: '#065f46', textAlign: 'center', lineHeight: 1.5 }}>
            <strong>Great start, Jane!</strong> You're 1 of 3 classes done this week. Keep it up!
          </p>
        </div>

        <PurpleButton onClick={onNext}>
          Set my weekly goal →
        </PurpleButton>
      </div>

      <BoldNavBar activeTab="home" />
    </div>
  )
}
