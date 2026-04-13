import { useState } from 'react'
import { C, BoldLogo, PurpleButton, RadioCard } from './shared.jsx'

export default function CheckEligibility({ onNext }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})

  const questions = [
    {
      q: 'Which health plan are you enrolled in?',
      key: 'plan',
      options: [
        { id: 'aetna', label: 'Aetna' },
        { id: 'bcbs', label: 'Blue Cross Blue Shield' },
        { id: 'cigna', label: 'Cigna' },
        { id: 'united', label: 'UnitedHealthcare' },
        { id: 'humana', label: 'Humana' },
        { id: 'other', label: 'Other / Not sure' },
      ]
    },
    {
      q: 'Do you have a diagnosis of a musculoskeletal (MSK) condition?',
      key: 'msk',
      sublabel: 'This includes arthritis, joint pain, or a related condition affecting your knees, hips, or back.',
      options: [
        { id: 'yes', label: 'Yes, I have a diagnosis' },
        { id: 'symptoms', label: "I have symptoms but no formal diagnosis" },
        { id: 'no', label: "I'm not sure" },
      ]
    },
    {
      q: 'Which area of your body causes you the most pain?',
      key: 'area',
      options: [
        { id: 'knee', label: 'Knee', icon: '🦵' },
        { id: 'hip', label: 'Hip', icon: '🦴' },
        { id: 'back', label: 'Lower back', icon: '🔙' },
        { id: 'shoulder', label: 'Shoulder', icon: '💪' },
        { id: 'multiple', label: 'Multiple areas', icon: '⚡' },
      ]
    },
  ]

  const current = questions[step]

  const handleSelect = (key, id) => {
    setAnswers(prev => ({ ...prev, [key]: id }))
    setTimeout(() => {
      if (step < questions.length - 1) {
        setStep(s => s + 1)
      } else {
        onNext()
      }
    }, 280)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1px solid ${C.border}` }}>
        <BoldLogo size={28} />
        <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>MSK ACCESS</span>
      </div>

      {/* Progress */}
      <div style={{ padding: '12px 20px 0' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {questions.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= step ? C.purple : C.border }} />
          ))}
        </div>
        <div style={{ fontSize: 12, color: C.textTert, marginTop: 6 }}>{step + 1} of {questions.length}</div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '24px 20px', overflowY: 'auto' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 6, lineHeight: 1.3 }}>{current.q}</h2>
        {current.sublabel && (
          <p style={{ fontSize: 14, color: C.textSec, marginBottom: 20, lineHeight: 1.5 }}>{current.sublabel}</p>
        )}
        {!current.sublabel && <div style={{ marginBottom: 20 }} />}
        {current.options.map(opt => (
          <RadioCard
            key={opt.id}
            label={opt.label}
            icon={opt.icon}
            selected={answers[current.key] === opt.id}
            onSelect={() => handleSelect(current.key, opt.id)}
          />
        ))}
      </div>
    </div>
  )
}
