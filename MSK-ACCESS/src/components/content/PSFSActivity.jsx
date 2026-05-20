import { useState } from 'react'
import boldLogo from '../../assets/bold-logo@2x.png'
import { C, OnboardingHeader, OnboardingScreen, PurpleButton, QuestionHeader } from './shared.jsx'

import imgWalking    from '../../assets/PSFS-activity-walking.jpg'
import imgStairs     from '../../assets/PSFS-activity-climbing-stairs.jpg'
import imgFloor      from '../../assets/PSFS-activity-getting-up-and-down-from-the-floor.jpg'
import imgSeat       from '../../assets/PSFS-activity-getting-up-and-down-from-a-seat.jpg'
import imgHousework  from '../../assets/PSFS-activity-housework.jpg'
import imgExercise   from '../../assets/PSFS-activity-exercise.jpg'
import imgCare       from '../../assets/PSFS-activity-providing-care-for-family-members.jpg'

const activities = [
  { id: 'walking',   label: 'Walking',                                                    img: imgWalking },
  { id: 'stairs',    label: 'Climbing stairs',                                             img: imgStairs },
  { id: 'floor',     label: 'Getting up and down from the floor',                          img: imgFloor },
  { id: 'seat',      label: 'Getting up and down from a seat (e.g. car, chair, couch)',    img: imgSeat },
  { id: 'housework', label: 'Housework',                                                   img: imgHousework },
  { id: 'exercise',  label: 'Exercise',                                                    img: imgExercise },
  { id: 'care',      label: 'Providing care for family members',                           img: imgCare },
]

export default function PSFSActivity({ onNext, onBack }) {
  const [step, setStep] = useState('select') // 'select' | 'rate'
  const [selected, setSelected] = useState(null)
  const [rating, setRating] = useState(null)

  const selectedActivity = activities.find(a => a.id === selected)

  if (step === 'rate') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <OnboardingHeader showBack progress={8} totalSteps={10} logoSrc={boldLogo} onBack={() => setStep('select')} />
        <OnboardingScreen cta={<PurpleButton onClick={onNext} disabled={rating === null}>Continue</PurpleButton>}>
          <QuestionHeader questionNum="#" question="How would you rate your current ability to perform this activity?" />

          {/* Selected activity card */}
          <div style={{
            display: 'flex', alignItems: 'stretch',
            background: C.white, border: `1.5px solid ${C.border}`,
            borderRadius: 12, marginBottom: 20, overflow: 'hidden',
          }}>
            <div style={{ width: 80, flexShrink: 0 }}>
              <img src={selectedActivity?.img} alt={selectedActivity?.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', padding: '12px 14px' }}>
              <span style={{ fontSize: 15, fontWeight: 500, color: C.text, lineHeight: 1.4 }}>
                {selectedActivity?.label}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 13, color: C.textSec }}>0 = unable</span>
            <span style={{ fontSize: 18 }}>😔</span>
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
            <span style={{ fontSize: 13, color: C.textSec }}>10 = fully able</span>
            <span style={{ fontSize: 18 }}>😊</span>
          </div>
        </OnboardingScreen>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <OnboardingHeader showBack progress={8} totalSteps={10} logoSrc={boldLogo} onBack={onBack} />
      <OnboardingScreen cta={<PurpleButton onClick={() => selected && setStep('rate')} disabled={!selected}>Continue</PurpleButton>}>
        <QuestionHeader
          questionNum="#"
          question={<>Please select the activity you find the most difficult or cannot do because of your <strong>neck &amp; upper back pain</strong>.</>}
        />
        {activities.map(a => (
          <div
            key={a.id}
            onClick={() => setSelected(a.id)}
            style={{
              display: 'flex', alignItems: 'stretch',
              background: selected === a.id ? C.purpleLight : C.white,
              border: `1.5px solid ${selected === a.id ? C.purple : C.border}`,
              borderRadius: 12, cursor: 'pointer', marginBottom: 8,
              overflow: 'hidden',
            }}
          >
            <div style={{ width: 80, flexShrink: 0 }}>
              <img src={a.img} alt={a.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', padding: '12px 14px' }}>
              <span style={{ fontSize: 15, color: C.text, lineHeight: 1.4 }}>{a.label}</span>
            </div>
          </div>
        ))}
      </OnboardingScreen>
    </div>
  )
}
