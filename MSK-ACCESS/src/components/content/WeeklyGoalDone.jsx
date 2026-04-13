import { C, BoldNavBar, PurpleButton } from './shared.jsx'

export default function WeeklyGoalDone({ onNext }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 20px', textAlign: 'center' }}>
        {/* Goal ring */}
        <div style={{ position: 'relative', marginBottom: 28 }}>
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r="58" fill="none" stroke={C.border} strokeWidth="8" />
            <circle cx="70" cy="70" r="58" fill="none" stroke={C.purple} strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 58 * 0.75} ${2 * Math.PI * 58 * 0.25}`}
              strokeLinecap="round" transform="rotate(-90 70 70)"
              style={{ transition: 'stroke-dasharray 1s ease' }}
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 36, fontWeight: 800, color: C.purple }}>3</span>
            <span style={{ fontSize: 12, color: C.textSec }}>per week</span>
          </div>
        </div>

        <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 10, letterSpacing: -0.5 }}>
          Goal set! 🎯
        </h2>
        <p style={{ fontSize: 16, color: C.textSec, marginBottom: 8, lineHeight: 1.5, maxWidth: 280 }}>
          You're aiming for <strong>3 classes per week</strong>. We'll remind you on Mon, Wed, and Fri.
        </p>
        <p style={{ fontSize: 14, color: C.textTert, marginBottom: 32 }}>
          You can change your goal anytime in settings.
        </p>

        {/* Week preview */}
        <div style={{
          width: '100%', background: C.bg, borderRadius: 16, border: `1px solid ${C.border}`,
          padding: '16px 20px', marginBottom: 28,
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.textSec, marginBottom: 14, textAlign: 'left' }}>
            This week
          </div>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'space-between' }}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
              const isGoalDay = [0, 2, 4].includes(i)
              const isToday = i === 0
              return (
                <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: isToday ? C.purple : C.textTert, fontWeight: isToday ? 700 : 400, marginBottom: 6 }}>{day}</div>
                  <div style={{
                    width: '100%', aspectRatio: '1', borderRadius: 10,
                    background: isGoalDay ? C.purpleLight : '#f5f5f5',
                    border: `2px solid ${isGoalDay ? C.purple : C.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14,
                  }}>
                    {isToday ? '✓' : isGoalDay ? '·' : ''}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <PurpleButton onClick={onNext}>Continue to Day 2 →</PurpleButton>
      </div>

      <BoldNavBar activeTab="home" />
    </div>
  )
}
