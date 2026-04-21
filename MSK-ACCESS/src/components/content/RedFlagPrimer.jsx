import boldLogo from '../../assets/bold-logo@2x.png'
import { C, OnboardingHeader, OnboardingScreen, PurpleButton } from './shared.jsx'

export default function RedFlagPrimer({ onNext, onBack }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <OnboardingHeader showBack progress={0} totalSteps={1} logoSrc={boldLogo} onBack={onBack} />
      <OnboardingScreen cta={<PurpleButton onClick={onNext}>Continue</PurpleButton>}>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: C.text, lineHeight: 1.2, marginBottom: 8 }}>
          Let's first determine that Bold is a good fit for you
        </h2>
        <p style={{ fontSize: 16, fontWeight: 500, color: C.textSec, lineHeight: 1.4 }}>
          We'll ask a few questions to make sure it's safe for you to exercise.
        </p>
      </OnboardingScreen>
    </div>
  )
}
