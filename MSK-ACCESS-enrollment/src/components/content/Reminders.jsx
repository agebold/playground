import { useState } from 'react'
import boldLogo from '../../assets/bold-logo@2x.png'
import { C, OnboardingHeader, OnboardingScreen, PurpleButton, OutlineButton, CheckboxOption, QuestionHeader } from './shared.jsx'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// ─── Screen 1: Days ──────────────────────────────────────────────────────────
function DaysScreen({ selectedDays, toggle, onNext, onBack }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      <OnboardingHeader showBack progress={5} totalSteps={10} logoSrc={boldLogo} onBack={onBack} />
      <OnboardingScreen cta={<PurpleButton onClick={onNext}>Continue</PurpleButton>}>
        <QuestionHeader
          questionNum="7"
          question="What days do you prefer to exercise?"
          sublabel="We'll send reminders on these days to help you get moving! We've preselected our most popular days."
        />
        <div style={{ fontSize: 14, fontWeight: 600, color: C.textSec, marginBottom: 10 }}>Days of week</div>
        {DAYS.map(day => (
          <CheckboxOption
            key={day}
            label={day}
            checked={selectedDays.has(day)}
            onToggle={() => toggle(day)}
          />
        ))}
      </OnboardingScreen>
    </div>
  )
}

// ─── Screen 2: Time ───────────────────────────────────────────────────────────
function TimeScreen({ time, setTime, onNext, onBack }) {
  const times = [
    '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
    '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM',
  ]
  const [open, setOpen] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      <OnboardingHeader showBack progress={6} totalSteps={10} logoSrc={boldLogo} onBack={onBack} />
      <OnboardingScreen cta={<PurpleButton onClick={onNext}>Continue</PurpleButton>}>
        <QuestionHeader
          questionNum="8"
          question="What time of day do you like to exercise?"
          sublabel="We'll send you reminders at this time! We've preselected our most popular time."
        />
        <div style={{ fontSize: 14, fontWeight: 600, color: C.textSec, marginBottom: 10 }}>Time of day</div>
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 16px', background: C.white,
              border: `1px solid ${C.border}`, borderRadius: 8,
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 16, color: C.text }}>{time}</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M6 8l4-4 4 4" stroke={C.textSec} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 12l4 4 4-4" stroke={C.textSec} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {open && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10,
              background: C.white, border: `1px solid ${C.border}`, borderRadius: 8,
              boxShadow: '0 4px 16px rgba(0,0,0,0.10)', maxHeight: 200, overflowY: 'auto',
            }}>
              {times.map(t => (
                <div
                  key={t}
                  onClick={() => { setTime(t); setOpen(false) }}
                  style={{
                    padding: '12px 16px', fontSize: 16, cursor: 'pointer',
                    color: t === time ? C.purple : C.text,
                    fontWeight: t === time ? 600 : 400,
                    background: t === time ? C.purpleLight : 'transparent',
                  }}
                >
                  {t}
                </div>
              ))}
            </div>
          )}
        </div>
      </OnboardingScreen>
    </div>
  )
}

// ─── Screen 3: Consent ───────────────────────────────────────────────────────
function ConsentScreen({ onAgree, onSkip, onBack }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      <OnboardingHeader showBack progress={7} totalSteps={10} logoSrc={boldLogo} onBack={onBack} />
      <OnboardingScreen cta={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <PurpleButton onClick={onAgree}>I agree</PurpleButton>
          <OutlineButton onClick={onSkip} style={{ marginTop: 0 }}>Don't text me reminders</OutlineButton>
        </div>
      }>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Header */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <h2 style={{
              fontSize: 24, fontWeight: 600, color: C.text,
              lineHeight: '32px', letterSpacing: '-0.5px', margin: 0,
            }}>
              Turn on reminders
            </h2>
            <p style={{ fontSize: 18, color: C.text, lineHeight: '24px', margin: 0 }}>
              Members who opt in are <strong style={{ fontWeight: 600 }}>4 times</strong> more likely to stick to their new Bold exercise routine.
            </p>
          </div>

          {/* Legal text */}
          <p style={{ fontSize: 16, color: C.textSec, lineHeight: '24px', margin: 0 }}>
            I agree to receive automated text reminders and calls about marketing updates as outlined in Bold's{' '}
            <span style={{ fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>Terms of service</span>
            {' '}and{' '}
            <span style={{ fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>Privacy policy</span>.
          </p>

          {/* Info box */}
          <div style={{
            background: '#ebf0ff', borderRadius: 16,
            padding: 12, display: 'flex', gap: 12, alignItems: 'flex-start',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <path d="M12 2L4 6v6c0 5 3.6 9.3 8 10.4C16.4 21.3 20 17 20 12V6l-8-4z" stroke="#3366ff" strokeWidth="1.5" strokeLinejoin="round" fill="#ebf0ff"/>
              <path d="M9 12l2 2 4-4" stroke="#3366ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p style={{ fontSize: 16, color: C.text, lineHeight: '24px', margin: 0, flex: 1 }}>
              You're in control. You can change anytime in your{' '}
              <strong style={{ fontWeight: 600 }}>Account Settings</strong>. We don't sell your information.
            </p>
          </div>
        </div>
      </OnboardingScreen>
    </div>
  )
}

// ─── Combined flow ────────────────────────────────────────────────────────────
export default function Reminders({ onNext, onBack }) {
  const [step, setStep] = useState('days')
  const [selectedDays, setSelectedDays] = useState(new Set(['Mon', 'Wed', 'Fri']))
  const [time, setTime] = useState('9:00 AM')

  const toggle = (day) => {
    setSelectedDays(prev => {
      const next = new Set(prev)
      if (next.has(day)) { if (next.size > 1) next.delete(day) }
      else next.add(day)
      return next
    })
  }

  if (step === 'days') {
    return <DaysScreen selectedDays={selectedDays} toggle={toggle} onNext={() => setStep('time')} onBack={onBack} />
  }

  if (step === 'time') {
    return <TimeScreen time={time} setTime={setTime} onNext={() => setStep('consent')} onBack={() => setStep('days')} />
  }

  return <ConsentScreen onAgree={onNext} onSkip={onNext} onBack={() => setStep('time')} />
}
