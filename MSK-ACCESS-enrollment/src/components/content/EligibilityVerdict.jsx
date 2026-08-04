import boldLogo from '../../assets/bold-logo@2x.png'
import checkIcon from '../../assets/Check.svg'
import { C, OnboardingHeader, OnboardingScreen, PurpleButton } from './shared.jsx'

export default function EligibilityVerdict({ onBack, onNavigate }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      <OnboardingHeader showBack={true} onBack={onBack} progress={3} totalSteps={15} logoSrc={boldLogo} />
      <OnboardingScreen cta={<PurpleButton onClick={() => onNavigate('onboarding-outline')}>Continue</PurpleButton>}>
        {/* Left-aligned hero */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', padding: '24px 0 28px' }}>
          <img src={checkIcon} alt="" width={64} height={64} style={{ marginBottom: 20 }} />

          <h2 style={{ fontSize: 22, fontWeight: 600, color: C.text, marginBottom: 8, lineHeight: 1.2 }}>
            You qualify, Carol!
          </h2>

          <p style={{ fontSize: 16, color: C.textSec, lineHeight: 1.4, maxWidth: 370 }}>
          You qualify for Bold through the ACCESS program available by the Centers for Medicare and Medicaid Services.
          </p>
        </div>

        {/* Coverage details */}
        <div style={{ background: C.bg, borderRadius: 14, padding: '16px', marginBottom: 8 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              'Covered by the Centers for Medicare and Medicaid Services',
              '$0 cost to you',
              'Personalized plan for your specific condition',
            ].map((text, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', background: '#d1fae5',
                  border: '1.5px solid #34c759', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0, marginTop: 1,
                }}>
                  <svg width="9" height="8" viewBox="0 0 9 8" fill="none">
                    <path d="M1 4l2.5 2.5L8 1" stroke="#34c759" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{ fontSize: 16, color: C.text, lineHeight: 1.5 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </OnboardingScreen>
    </div>
  )
}
