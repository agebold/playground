import { C, OnboardingHeader, OnboardingScreen, PurpleButton } from './shared.jsx'

export default function SessionBasedV1({ onNext, onBack }) {
  return (
    <>
      <OnboardingHeader showBack={false} onBack={onBack} />
      <OnboardingScreen
        cta={<PurpleButton onClick={onNext}>Continue</PurpleButton>}
      >
        <div style={{ textAlign: 'center', paddingTop: 40 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20,
            background: C.purpleLight,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 4v10l6 3" stroke={C.purple} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="14" cy="14" r="10" stroke={C.purple} strokeWidth="2"/>
            </svg>
          </div>
          <h1 style={{
            fontSize: 24, fontWeight: 800, color: C.text,
            letterSpacing: -0.3, marginBottom: 12, lineHeight: 1.2,
          }}>
            Session-based V1
          </h1>
          <p style={{ fontSize: 16, color: C.textSec, lineHeight: 1.6, maxWidth: 300, margin: '0 auto' }}>
            This is a placeholder for the session-based adaptive check-in exploration.
          </p>
        </div>
      </OnboardingScreen>
    </>
  )
}
