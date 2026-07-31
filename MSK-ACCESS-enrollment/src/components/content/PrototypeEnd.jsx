import boldLogo from '../../assets/bold-logo@2x.png'
import { C, OnboardingHeader, OnboardingScreen } from './shared.jsx'

export default function PrototypeEnd() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      <OnboardingHeader showBack={false} logoSrc={boldLogo} />
      <OnboardingScreen>
        <div style={{ textAlign: 'center', padding: '64px 8px 40px' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', background: C.purpleLight,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
              <path d="M2 11l8 8L26 2" stroke={C.purple} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: '0 0 8px' }}>
            That's the end of this prototype
          </h2>
          <p style={{ fontSize: 15, color: C.textSec, lineHeight: 1.5, maxWidth: 280, margin: '0 auto' }}>
            Thanks for walking through it with us. Let your moderator know you're finished.
          </p>
        </div>
      </OnboardingScreen>
    </div>
  )
}
