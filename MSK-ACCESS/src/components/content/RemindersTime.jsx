import { useState } from 'react'
import { C, OnboardingHeader, OnboardingScreen, PurpleButton, QuestionHeader } from './shared.jsx'

export default function RemindersTime({ onNext }) {
  const [time, setTime] = useState('9:00 AM')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <OnboardingHeader showBack progress={6} totalSteps={10} />
      <OnboardingScreen cta={<PurpleButton onClick={onNext}>Continue</PurpleButton>}>
        <QuestionHeader
          questionNum="#"
          question="What time of day do you like to exercise?"
          sublabel="We'll send you reminders at this time! We've preselected our most popular time."
        />
        <div style={{ fontSize: 13, fontWeight: 600, color: C.textSec, marginBottom: 10 }}>Time of day</div>
        {/* Time picker dropdown */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 14px',
          background: C.white, border: `1.5px solid ${C.border}`, borderRadius: 12,
          cursor: 'pointer',
        }}>
          <span style={{ fontSize: 16, color: C.text }}>{time}</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke={C.textSec} strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M4 10l4-4 4 4" stroke={C.textSec} strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </OnboardingScreen>
    </div>
  )
}
