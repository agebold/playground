import { C, OnboardingHeader, OnboardingScreen, PurpleButton } from './shared.jsx'

export default function EligibilityVerdict({ onNext }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      <OnboardingHeader showBack={false} progress={2} totalSteps={14} />
      <OnboardingScreen cta={<PurpleButton onClick={onNext}>Continue</PurpleButton>}>
        {/* Centered hero */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '24px 0 28px' }}>
          {/* Teal checkmark circle */}
          <div style={{
            width: 100, height: 100, borderRadius: '50%',
            background: '#d1fae5',
            border: '4px solid #34c759',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 20,
          }}>
            <svg width="44" height="36" viewBox="0 0 44 36" fill="none">
              <path d="M2 18L15 31L42 2" stroke="#34c759" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h2 style={{ fontSize: 26, fontWeight: 800, color: C.text, marginBottom: 10, lineHeight: 1.2 }}>
            You qualify, Carol!
          </h2>

          <p style={{ fontSize: 15, color: C.textSec, lineHeight: 1.6, maxWidth: 300 }}>
            Your Medicare Advantage plan covers Bold through the CMS ACCESS program at no extra cost to you.
          </p>
        </div>

        {/* Coverage details */}
        <div style={{ background: C.bg, borderRadius: 14, padding: '16px', marginBottom: 8 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              'Covered by your Medicare Advantage plan',
              '$0 cost to you',
              'Unlimited live and on-demand classes',
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
                <span style={{ fontSize: 14, color: C.text, lineHeight: 1.5 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </OnboardingScreen>
    </div>
  )
}
