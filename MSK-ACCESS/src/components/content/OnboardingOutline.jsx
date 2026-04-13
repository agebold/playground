import { C, OnboardingHeader, OnboardingScreen, PurpleButton } from './shared.jsx'

const steps = [
  {
    number: '1',
    title: 'Complete a short health & safety check',
    desc: 'A few quick questions to make sure Bold is right for you and to understand your needs.',
  },
  {
    number: '2',
    title: 'We build your personalized plan',
    desc: 'Based on your responses, we\'ll create a custom exercise program tailored to your condition.',
  },
]

export default function OnboardingOutline({ onNext }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      <OnboardingHeader showBack progress={3} totalSteps={14} />
      <OnboardingScreen cta={<PurpleButton onClick={onNext}>Let's get started!</PurpleButton>}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 8, lineHeight: 1.3 }}>
          Here's how we'll build your personalized program
        </h2>

        <p style={{ fontSize: 14, color: C.textSec, lineHeight: 1.6, marginBottom: 24 }}>
          It only takes a few minutes to set up your plan.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {steps.map((step, i) => (
            <div key={i} style={{
              display: 'flex', gap: 14, alignItems: 'flex-start',
              background: C.bg, borderRadius: 14, padding: '16px 14px',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                background: C.purple,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: C.white }}>{step.number}</span>
              </div>
              <div style={{ paddingTop: 2 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 4 }}>{step.title}</div>
                <div style={{ fontSize: 13, color: C.textSec, lineHeight: 1.5 }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </OnboardingScreen>
    </div>
  )
}
