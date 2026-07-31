import boldLogo from '../../assets/bold-logo@2x.png'
import { C, OnboardingHeader, OnboardingScreen, PurpleButton } from './shared.jsx'

const steps = [
  {
    number: '1',
    title: 'Your background',
    desc: 'Let’s make sure it’s clinically safe to exercise by checking your background.',
  },
  {
    number: '2',
    title: 'Your preferences',
    desc: 'Based on your responses, we\'ll create a custom exercise program tailored to your condition.',
  },
]

export default function OnboardingOutline({ onNext, onNavigate }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      <OnboardingHeader showBack progress={3} totalSteps={14} logoSrc={boldLogo} onBack={() => onNavigate('eligibility-verdict')} />
      <OnboardingScreen cta={<PurpleButton onClick={onNext}>Let's get started!</PurpleButton>}>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: C.text, marginBottom: 8, lineHeight: 1.2 }}>
          Here's how we'll build your personalized program
        </h2>

        <p style={{ fontSize: 16, color: C.textSec, lineHeight: 1.4, marginBottom: 24 }}>
          Answer a few questions so we can better tailor your experience. This should take about 5 minutes.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {steps.map((step, i) => (
            <div key={i} style={{
              display: 'flex', gap: 14, alignItems: 'flex-start',
              background: C.bg, borderRadius: 14, padding: '16px 14px',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: C.purple,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.white }}>{step.number}</span>
              </div>
              <div style={{ paddingTop: 2 }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: C.text, marginBottom: 4 }}>{step.title}</div>
                <div style={{ fontSize: 16, color: C.textSec, lineHeight: 1.5 }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </OnboardingScreen>
    </div>
  )
}
