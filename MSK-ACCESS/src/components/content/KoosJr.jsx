import { useState } from 'react'
import { C, AppTopBar, ScreenWrapper, PurpleButton } from './shared.jsx'

const questions = [
  {
    id: 'stiffness',
    q: 'How much joint stiffness have you experienced in the past week?',
    options: ['None', 'Mild', 'Moderate', 'Severe', 'Extreme'],
  },
  {
    id: 'pain-stairs',
    q: 'How much pain have you experienced when going up or down stairs?',
    options: ['None', 'Mild', 'Moderate', 'Severe', 'Extreme'],
  },
  {
    id: 'pain-night',
    q: 'How much pain have you experienced in bed at night?',
    options: ['None', 'Mild', 'Moderate', 'Severe', 'Extreme'],
  },
  {
    id: 'pain-sitting',
    q: 'How much pain have you experienced when sitting or lying?',
    options: ['None', 'Mild', 'Moderate', 'Severe', 'Extreme'],
  },
  {
    id: 'difficulty-standing',
    q: 'What difficulty do you have with standing upright?',
    options: ['None', 'Mild', 'Moderate', 'Severe', 'Extreme'],
  },
  {
    id: 'difficulty-walking',
    q: 'What difficulty do you have with walking on flat surface?',
    options: ['None', 'Mild', 'Moderate', 'Severe', 'Extreme'],
  },
  {
    id: 'difficulty-shopping',
    q: 'What difficulty do you have with going shopping?',
    options: ['None', 'Mild', 'Moderate', 'Severe', 'Extreme'],
  },
]

export default function KoosJr({ onNext }) {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})

  const q = questions[current]
  const progress = (current / questions.length) * 100

  const handleSelect = (value) => {
    const newAnswers = { ...answers, [q.id]: value }
    setAnswers(newAnswers)
    setTimeout(() => {
      if (current < questions.length - 1) {
        setCurrent(c => c + 1)
      } else {
        onNext()
      }
    }, 280)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      <AppTopBar title={`Question ${current + 1} of ${questions.length}`} />

      {/* Progress */}
      <div style={{ height: 4, background: C.border }}>
        <div style={{ height: '100%', background: C.purple, width: `${progress}%`, transition: 'width 0.3s' }} />
      </div>

      <ScreenWrapper>
        <div style={{ padding: '28px 20px' }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: C.textTert,
            letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12,
          }}>
            KOOS JR · {current + 1}/{questions.length}
          </div>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 32, lineHeight: 1.4 }}>
            {q.q}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {q.options.map((opt, i) => {
              const selected = answers[q.id] === opt
              const colors = ['#22C55E', '#84CC16', '#EAB308', '#F97316', '#EF4444']
              const bgColors = ['#f0fff4', '#f7fee7', '#fefce8', '#fff7ed', '#fef2f2']
              return (
                <div
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 16px',
                    background: selected ? bgColors[i] : C.white,
                    border: `2px solid ${selected ? colors[i] : C.border}`,
                    borderRadius: 12, cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 10,
                    background: selected ? colors[i] : `${colors[i]}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700, color: selected ? 'white' : colors[i],
                    flexShrink: 0,
                  }}>
                    {i}
                  </div>
                  <span style={{ fontSize: 15, fontWeight: selected ? 600 : 400, color: C.text }}>{opt}</span>
                </div>
              )
            })}
          </div>
        </div>
      </ScreenWrapper>
    </div>
  )
}
