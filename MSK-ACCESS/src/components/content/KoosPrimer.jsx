import { C, OnboardingHeader, OnboardingScreen, PurpleButton } from './shared.jsx'

export default function KoosPrimer({ onNext }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      <OnboardingHeader showBack={false} />
      <OnboardingScreen cta={<PurpleButton onClick={onNext}>Continue</PurpleButton>}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 10, lineHeight: 1.3 }}>
          Knee Injury and Osteoarthritis Outcome Score (KOOS JR)
        </h2>

        <p style={{ fontSize: 14, color: C.textSec, lineHeight: 1.6, marginBottom: 20 }}>
          This short questionnaire helps us understand how your knee affects your daily life. Your answers create a baseline score we'll track over time.
        </p>

        <div style={{ background: C.bg, borderRadius: 12, padding: '14px 16px', marginBottom: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: '📝', text: '7 quick questions' },
              { icon: '⏱', text: 'Takes about 3 minutes' },
              { icon: '📈', text: 'We\'ll resurvey you in 3 months to measure improvement' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                <span style={{ fontSize: 14, color: C.text, lineHeight: 1.4 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Amanda tip */}
        <div style={{
          background: '#f8f4ff', borderRadius: 12, padding: '12px 14px',
          display: 'flex', gap: 10,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: `linear-gradient(135deg, #a78bfa, #7c3aed)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: 12 }}>👩</span>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 3 }}>
              A tip from Amanda
            </div>
            <div style={{ fontSize: 13, color: C.textSec, lineHeight: 1.5 }}>
              Think about the <strong>past week</strong> when answering. Be honest — there are no right or wrong answers.
            </div>
          </div>
        </div>
      </OnboardingScreen>
    </div>
  )
}
