import boldLogo from '../../assets/bold-logo@2x.png'
import { useState } from 'react'
import { C, OnboardingHeader, OnboardingScreen, PurpleButton, QuestionHeader } from './shared.jsx'

export default function PainScale({ onNext, onBack, selectedRegionLabel }) {
  const [value, setValue] = useState(null)
  const painPhrase = selectedRegionLabel ? `${selectedRegionLabel.toLowerCase()} pain` : 'pain'

  const select = (n) => { setValue(n); }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <OnboardingHeader showBack progress={7} totalSteps={10} logoSrc={boldLogo} onBack={onBack} />
      <OnboardingScreen cta={<PurpleButton onClick={onNext} disabled={value === null}>Continue</PurpleButton>}>
        <QuestionHeader
          questionNum="3"
          question={<>How would you rate your <strong>{painPhrase}</strong> on average over the last 7 days?</>}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 13, color: C.textSec }}>0 = no pain</span>
          <span style={{ fontSize: 18 }}>😊</span>
        </div>

        {/* Number grid */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {[0, 1, 2, 3, 4, 5].map(n => (
            <div
              key={n}
              onClick={() => select(n)}
              style={{
                width: 52, height: 52, borderRadius: 12,
                background: value === n ? C.purple : C.white,
                border: `1.5px solid ${value === n ? C.purple : C.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 600,
                color: value === n ? C.white : C.text,
                cursor: 'pointer',
              }}>
              {n}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {[6, 7, 8, 9, 10].map(n => (
            <div
              key={n}
              onClick={() => select(n)}
              style={{
                width: 52, height: 52, borderRadius: 12,
                background: value === n ? C.purple : C.white,
                border: `1.5px solid ${value === n ? C.purple : C.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 600,
                color: value === n ? C.white : C.text,
                cursor: 'pointer',
              }}>
              {n}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, color: C.textSec }}>10 = worst pain</span>
          <span style={{ fontSize: 18 }}>😢</span>
        </div>
      </OnboardingScreen>
    </div>
  )
}
