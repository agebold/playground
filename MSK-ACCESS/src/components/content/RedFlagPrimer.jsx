import { C, OnboardingHeader, OnboardingScreen, PurpleButton } from './shared.jsx'

export default function RedFlagPrimer({ onNext }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <OnboardingHeader showBack progress={0} totalSteps={1} />
      <OnboardingScreen cta={<PurpleButton onClick={onNext}>Continue</PurpleButton>}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, lineHeight: 1.3, marginBottom: 12 }}>
          Let's first determine that Bold is a good fit for you
        </h2>
        <p style={{ fontSize: 15, color: C.textSec, lineHeight: 1.6 }}>
          We'll ask a few questions to make sure it's safe for you to exercise.
        </p>
      </OnboardingScreen>
    </div>
  )
}
