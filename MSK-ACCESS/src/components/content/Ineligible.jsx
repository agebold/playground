import boldLogo from '../../assets/bold-logo@2x.png'
import { C, OnboardingHeader, OnboardingScreen } from './shared.jsx'

export default function Ineligible({ onBack }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fafafa' }}>
      <OnboardingHeader showBack={true} onBack={onBack} logoSrc={boldLogo} />
      <OnboardingScreen>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 8 }}>
          <h2 style={{
            fontSize: 24, fontWeight: 600, color: C.text,
            lineHeight: '32px', letterSpacing: '-0.5px', margin: 0,
          }}>
            Bold may not be the best fit for you at this time.
          </h2>
          <p style={{ fontSize: 18, color: C.text, lineHeight: '24px', margin: 0 }}>
            Because you mentioned{' '}
            <strong style={{ fontWeight: 600 }}>{'{having a new, sudden injury}'}</strong>
            , the best next step is to speak with your healthcare team.
          </p>
          <p style={{ fontSize: 18, color: C.text, lineHeight: '24px', margin: 0 }}>
            Bold's muscle and joint pain program includes therapeutic exercises that are generally safe, but it's best to consult with a doctor before joining if you have a condition that may restrict your ability to perform the exercises in our program.
          </p>
        </div>
      </OnboardingScreen>
    </div>
  )
}
