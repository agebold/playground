import { C, AppTopBar, ScreenWrapper, PurpleButton } from './shared.jsx'

export default function KoosPrimer({ onNext }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      <AppTopBar title="KOOS JR" />

      <ScreenWrapper
        bottomSlot={<PurpleButton onClick={onNext}>Start questionnaire →</PurpleButton>}
      >
        <div style={{ padding: '28px 20px' }}>
          {/* Icon */}
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: C.purpleLight,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 34, marginBottom: 24,
          }}>
            📊
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 12, lineHeight: 1.2, letterSpacing: -0.3 }}>
            Knee & joint health check
          </h2>

          <p style={{ fontSize: 15, color: C.textSec, lineHeight: 1.6, marginBottom: 24 }}>
            The <strong>KOOS JR</strong> (Knee Injury and Osteoarthritis Outcome Score) is a validated questionnaire used to measure how knee problems affect your daily life.
          </p>

          <div style={{
            background: C.bg, borderRadius: 14, padding: 16,
            border: `1px solid ${C.border}`, marginBottom: 24,
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: '📝', label: '7 questions', desc: 'About everyday activities' },
                { icon: '⏱️', label: '~3 minutes', desc: 'Quick to complete' },
                { icon: '📈', label: 'Tracks your progress', desc: 'We\'ll resurvey at 4 & 8 weeks' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: C.purpleLight, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, flexShrink: 0,
                  }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{item.label}</div>
                    <div style={{ fontSize: 13, color: C.textSec }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: C.purpleLight, borderRadius: 12, padding: 16,
            display: 'flex', gap: 10, alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
            <p style={{ fontSize: 13, color: C.purple, lineHeight: 1.5 }}>
              Think about the <strong>past week</strong> when answering these questions. Answer based on how your knee has been feeling recently.
            </p>
          </div>
        </div>
      </ScreenWrapper>
    </div>
  )
}
