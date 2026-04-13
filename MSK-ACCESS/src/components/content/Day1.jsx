import { C, AppTopBar, ScreenWrapper, BoldNavBar, PurpleButton, Tag } from './shared.jsx'

const todayClasses = [
  { id: 1, title: 'Knee Strength Foundations', duration: '20 min', level: 'Beginner', emoji: '🦵', instructor: 'Dr. Maria Chen', tag: 'Strength', recommended: true },
  { id: 2, title: 'Low-Impact Mobility Flow', duration: '18 min', level: 'Beginner', emoji: '🌊', instructor: 'James Park, PT', tag: 'Mobility' },
]

export default function Day1({ onNext }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.bg }}>
      <AppTopBar showBack={false} showUseApp onNext={onNext} />

      <ScreenWrapper>
        {/* Header */}
        <div style={{
          background: `linear-gradient(160deg, ${C.purple} 0%, #6d28d9 100%)`,
          padding: '24px 20px 28px',
          color: 'white',
        }}>
          <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 4 }}>Monday, Oct 14</div>
          <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4, letterSpacing: -0.5 }}>
            Good morning, Jane! 👋
          </h2>
          <p style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.5 }}>
            Welcome to Day 1. You have 2 classes on your plan today.
          </p>

          <div style={{
            marginTop: 16,
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 12, padding: '12px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: 13, opacity: 0.85 }}>This week's goal</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>3 classes</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, opacity: 0.85 }}>Completed</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>0 / 3</div>
            </div>
            <div style={{ width: 48, height: 48, position: 'relative' }}>
              <svg viewBox="0 0 48 48" width="48" height="48">
                <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
                <circle cx="24" cy="24" r="20" fill="none" stroke="white" strokeWidth="4"
                  strokeDasharray={`${2 * Math.PI * 20}`} strokeDashoffset={`${2 * Math.PI * 20}`}
                  strokeLinecap="round" transform="rotate(-90 24 24)" />
              </svg>
            </div>
          </div>
        </div>

        <div style={{ padding: '20px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.textTert, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>
            Today's classes
          </div>

          {todayClasses.map(cls => (
            <div
              key={cls.id}
              onClick={onNext}
              style={{
                background: C.white, borderRadius: 16, border: `1px solid ${C.border}`,
                padding: '16px', marginBottom: 12, cursor: 'pointer',
                boxShadow: cls.recommended ? `0 2px 12px rgba(82,0,212,0.08)` : 'none',
                borderColor: cls.recommended ? C.purple : C.border,
                borderWidth: cls.recommended ? 2 : 1,
              }}>
              {cls.recommended && (
                <div style={{
                  fontSize: 11, fontWeight: 700, color: C.purple,
                  letterSpacing: '0.06em', marginBottom: 8, textTransform: 'uppercase',
                }}>
                  ⭐ Start here
                </div>
              )}
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 14,
                  background: `linear-gradient(135deg, ${C.purple}15, ${C.purple}35)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 26, flexShrink: 0,
                }}>
                  {cls.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 2 }}>{cls.title}</div>
                  <div style={{ fontSize: 13, color: C.textSec, marginBottom: 6 }}>{cls.instructor}</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Tag>{cls.tag}</Tag>
                    <span style={{ fontSize: 12, color: C.textTert }}>{cls.duration} · {cls.level}</span>
                  </div>
                </div>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M7.5 5l5 5-5 5" stroke={C.textTert} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          ))}

          {/* Tip card */}
          <div style={{
            background: '#fffbeb', border: '1px solid #fde68a',
            borderRadius: 12, padding: 16, marginTop: 4,
            display: 'flex', gap: 10, alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>💡</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#92400e', marginBottom: 3 }}>Today's tip</div>
              <div style={{ fontSize: 13, color: '#78350f', lineHeight: 1.5 }}>
                Start with Knee Strength Foundations — it's designed to ease you in and build a solid base for the rest of your program.
              </div>
            </div>
          </div>
        </div>
      </ScreenWrapper>

      <BoldNavBar activeTab="home" />
    </div>
  )
}
