import { useState } from 'react'
import { C, OnboardingHeader, OnboardingScreen, PurpleButton, QuestionHeader } from './shared.jsx'

const activities = [
  { id: 'walking', label: 'Walking' },
  { id: 'stairs', label: 'Climbing stairs' },
  { id: 'floor', label: 'Getting up and down from the floor' },
  { id: 'seat', label: 'Getting up and down from a seat (e.g. car, chair, couch)' },
  { id: 'housework', label: 'Housework' },
  { id: 'exercise', label: 'Exercise' },
  { id: 'care', label: 'Providing care for family members' },
]

export default function PSFSActivity({ onNext }) {
  const [step, setStep] = useState('select') // 'select' | 'rate'
  const [selected, setSelected] = useState(null)
  const [rating, setRating] = useState(null)

  if (step === 'rate') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <OnboardingHeader showBack={() => setStep('select')} progress={8} totalSteps={10} />
        <OnboardingScreen cta={<PurpleButton onClick={onNext} disabled={rating === null}>Continue</PurpleButton>}>
          <QuestionHeader questionNum="#" question="How would you rate your current ability to perform this activity?" />

          {/* Selected activity card */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 14px',
            background: C.white, border: `1.5px solid ${C.border}`,
            borderRadius: 12, marginBottom: 20,
          }}>
            <div style={{
              width: 56, height: 40, background: C.bg, borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, flexShrink: 0,
            }}>🚶</div>
            <span style={{ fontSize: 15, fontWeight: 500, color: C.text }}>
              {activities.find(a => a.id === selected)?.label}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 13, color: C.textSec }}>0 = no pain</span>
            <span style={{ fontSize: 18 }}>😊</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
            {[0,1,2,3,4,5].map(n => (
              <div key={n} onClick={() => setRating(n)} style={{
                width: 52, height: 52, borderRadius: 12, cursor: 'pointer',
                background: rating === n ? C.purple : C.white,
                border: `1.5px solid ${rating === n ? C.purple : C.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 600,
                color: rating === n ? C.white : C.text,
              }}>{n}</div>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
            {[6,7,8,9,10].map(n => (
              <div key={n} onClick={() => setRating(n)} style={{
                width: 52, height: 52, borderRadius: 12, cursor: 'pointer',
                background: rating === n ? C.purple : C.white,
                border: `1.5px solid ${rating === n ? C.purple : C.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 600,
                color: rating === n ? C.white : C.text,
              }}>{n}</div>
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <OnboardingHeader showBack progress={8} totalSteps={10} />
      <OnboardingScreen cta={<PurpleButton onClick={() => selected && setStep('rate')} disabled={!selected}>Continue</PurpleButton>}>
        <QuestionHeader
          questionNum="#"
          question={<>Please select the activity you find the most difficult or cannot do because of your <strong>neck & upper back pain</strong>.</>}
        />
        {activities.map(a => (
          <div
            key={a.id}
            onClick={() => setSelected(a.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 14px',
              background: selected === a.id ? C.purpleLight : C.white,
              border: `1.5px solid ${selected === a.id ? C.purple : C.border}`,
              borderRadius: 12, cursor: 'pointer', marginBottom: 8,
            }}>
            <div style={{
              width: 56, height: 44, background: C.bg, borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, overflow: 'hidden',
            }}>
              <span style={{ fontSize: 22 }}>
                {['🚶','🪜','🧎','🪑','🧹','🏃','👴'][activities.indexOf(a)]}
              </span>
            </div>
            <span style={{ fontSize: 15, color: C.text, lineHeight: 1.4 }}>{a.label}</span>
          </div>
        ))}
      </OnboardingScreen>
    </div>
  )
}
