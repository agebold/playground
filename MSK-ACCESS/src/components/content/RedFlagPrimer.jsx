import { C, BoldLogo, PurpleButton, ScreenWrapper, OnboardingProgress } from './shared.jsx'

export default function RedFlagPrimer({ onNext }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', borderBottom: `1px solid ${C.border}` }}>
        <BoldLogo size={28} />
      </div>

      <ScreenWrapper
        bottomSlot={<PurpleButton onClick={onNext}>Continue</PurpleButton>}
      >
        <div style={{ padding: '32px 20px' }}>
          {/* Icon */}
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: '#FFF5E5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 34, marginBottom: 28,
          }}>
            🛡️
          </div>

          <h1 style={{ fontSize: 26, fontWeight: 800, color: C.text, lineHeight: 1.2, marginBottom: 16, letterSpacing: -0.5 }}>
            A quick safety check
          </h1>

          <p style={{ fontSize: 16, color: C.textSec, lineHeight: 1.6, marginBottom: 24 }}>
            Before we build your exercise plan, we need to ask a few short questions about symptoms that may require medical attention first.
          </p>

          <div style={{
            background: '#FFF5E5',
            border: '1px solid #FDE68A',
            borderRadius: 12,
            padding: 16,
            marginBottom: 24,
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#92400E', marginBottom: 6 }}>Why are we asking?</div>
            <p style={{ fontSize: 14, color: '#78350F', lineHeight: 1.5 }}>
              Certain symptoms can be signs of serious conditions that need a doctor's care before starting an exercise program. This screening keeps you safe.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              'This will only take about 60 seconds',
              'Your answers are completely confidential',
              'There are no wrong answers — just be honest',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', background: C.purpleLight,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginTop: 1,
                }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2 2 4-4" stroke={C.purple} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span style={{ fontSize: 14, color: C.textSec, lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </ScreenWrapper>
    </div>
  )
}
