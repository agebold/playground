import { C, AppTopBar, ScreenWrapper, BoldNavBar, Tag } from './shared.jsx'

const todayItems = [
  { type: 'prom', title: 'KOOS JR questionnaire', desc: 'Help us measure your baseline knee health. Takes ~3 min.', icon: '📋', tag: 'Required', urgent: true },
  { type: 'class', title: 'Low-Impact Mobility Flow', duration: '18 min', instructor: 'James Park, PT', icon: '🌊', tag: 'Class' },
]

export default function Day2({ onNext }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.bg }}>
      <AppTopBar showBack={false} showUseApp onNext={onNext} />

      <ScreenWrapper>
        {/* Header */}
        <div style={{
          background: `linear-gradient(160deg, #1e1b4b 0%, ${C.purple} 100%)`,
          padding: '24px 20px 28px', color: 'white',
        }}>
          <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 4 }}>Tuesday, Oct 15</div>
          <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4, letterSpacing: -0.5 }}>Day 2</h2>
          <p style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.5 }}>
            You're back! Today includes a short health check and your second class.
          </p>

          {/* Streak */}
          <div style={{
            marginTop: 16, background: 'rgba(255,255,255,0.12)',
            borderRadius: 12, padding: '12px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 24 }}>🔥</span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>2-day streak!</div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>Keep it going</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, opacity: 0.8 }}>Week progress</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>1 / 3 classes</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '20px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.textTert, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>
            Today's tasks
          </div>

          {todayItems.map((item, i) => (
            <div
              key={i}
              onClick={onNext}
              style={{
                background: C.white, borderRadius: 16,
                border: `${item.urgent ? 2 : 1}px solid ${item.urgent ? '#F59E0B' : C.border}`,
                padding: 16, marginBottom: 12, cursor: 'pointer',
                boxShadow: item.urgent ? '0 2px 12px rgba(245,158,11,0.12)' : 'none',
              }}>
              {item.urgent && (
                <div style={{
                  fontSize: 11, fontWeight: 700, color: '#92400E',
                  letterSpacing: '0.06em', marginBottom: 8, textTransform: 'uppercase',
                }}>
                  ⏰ Complete first
                </div>
              )}
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 14,
                  background: item.urgent ? '#FEF3C7' : C.purpleLight,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 26, flexShrink: 0,
                }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 3 }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: C.textSec, marginBottom: 6 }}>
                    {item.desc || item.instructor}
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Tag
                      color={item.urgent ? '#FEF3C7' : C.purpleLight}
                      textColor={item.urgent ? '#92400E' : C.purple}
                    >
                      {item.tag}
                    </Tag>
                    {item.duration && <span style={{ fontSize: 12, color: C.textTert }}>{item.duration}</span>}
                  </div>
                </div>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M7.5 5l5 5-5 5" stroke={C.textTert} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </ScreenWrapper>

      <BoldNavBar activeTab="home" />
    </div>
  )
}
