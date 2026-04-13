import { C, BoldLogo, PurpleButton, ScreenWrapper, OnboardingProgress } from './shared.jsx'

export default function RegionFocus({ onNext }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', borderBottom: `1px solid ${C.border}` }}>
        <BoldLogo size={28} />
      </div>

      <OnboardingProgress current={3} total={10} />

      <ScreenWrapper
        bottomSlot={<PurpleButton onClick={onNext}>Got it — continue</PurpleButton>}
      >
        <div style={{ padding: '24px 20px' }}>
          <div style={{
            background: `linear-gradient(135deg, #f5f0ff, #ede9ff)`,
            borderRadius: 20,
            padding: 24,
            marginBottom: 28,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}>
            <div style={{ fontSize: 52 }}>🦵</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.purple }}>Knee pain identified</div>
              <div style={{ fontSize: 13, color: C.textSec, marginTop: 4 }}>Right knee · Left knee</div>
            </div>
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 12, lineHeight: 1.3 }}>
            Talk to your provider about this program
          </h2>

          <p style={{ fontSize: 15, color: C.textSec, lineHeight: 1.6, marginBottom: 24 }}>
            We recommend letting your doctor or physical therapist know you're starting MSK ACCESS. They can help ensure the program aligns with your care plan.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            {[
              { icon: '💬', title: 'Share your plan', desc: 'Show your provider the exercises in your personalized plan.' },
              { icon: '📋', title: 'Mention your goals', desc: 'Tell them what you hope to achieve — reduced pain, better mobility, or both.' },
              { icon: '🔄', title: 'Check for modifications', desc: 'Ask if any exercises should be modified for your specific condition.' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', gap: 14, padding: 16,
                background: C.bg, borderRadius: 12, border: `1px solid ${C.border}`,
              }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 3 }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: C.textSec, lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            background: C.purpleLight,
            borderRadius: 12,
            padding: 16,
            display: 'flex',
            gap: 10,
            alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>ℹ️</span>
            <p style={{ fontSize: 13, color: C.purple, lineHeight: 1.5 }}>
              MSK ACCESS is designed to complement, not replace, your medical care. Always follow your provider's guidance.
            </p>
          </div>
        </div>
      </ScreenWrapper>
    </div>
  )
}
