import { useState } from 'react'
import boldLogo from '../../assets/bold-logo@2x.png'
import imgTrainer from '../../assets/alicia_headshot.jpg'
import { C, PurpleButton, OutlineButton, RadioOption } from './shared.jsx'

// ─── Shared header with back button + logo + progress bar ─────────────────────

function KoosHeader({ onBack, step = 0, totalSteps = 7 }) {
  // step 0 = primer (show 1/7 filled), 1–7 = question number
  const filled = step === 0 ? 1 : step
  return (
    <div style={{ flexShrink: 0 }}>
      <div style={{
        display: 'flex', alignItems: 'center',
        padding: '12px 16px', background: C.white,
      }}>
        <button
          onClick={onBack}
          style={{
            width: 36, height: 36, borderRadius: 10,
            background: C.bg, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg width="9" height="15" viewBox="0 0 9 15" fill="none">
            <path d="M8 1L1 7.5L8 14" stroke={C.text} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <img src={boldLogo} alt="Bold" style={{ height: 28, width: 'auto' }} />
        </div>
        <div style={{ width: 36 }} />
      </div>
      {/* Progress bar */}
      <div style={{ height: 3, background: C.border }}>
        <div style={{ width: `${(filled / totalSteps) * 100}%`, height: '100%', background: C.purple, transition: 'width 0.3s ease' }} />
      </div>
    </div>
  )
}

// ─── Step 0: Instructions ─────────────────────────────────────────────────────

function KoosPrimer({ onNext, onBack }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      <KoosHeader onBack={onBack} step={0} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px 16px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 24, lineHeight: 1.3, letterSpacing: -0.3 }}>
          Knee injury and Osteoarthritis Outcome Score for Joint Replacement (KOOS, JR)
        </h2>

        <div style={{ marginBottom: 12 }}>
          <span style={{ fontSize: 15, color: C.textSec, fontWeight: 500 }}>Instructions</span>
        </div>
        <p style={{ fontSize: 17, color: C.text, lineHeight: 1.65, marginBottom: 28 }}>
          This survey asks for your view about your knee. This information will help us keep track of how you feel about your knee and how well you are able to do your usual activities. Answer every question by ticking the appropriate box, only one box for each question. If you are unsure about how to answer a question, please give the best answer you can.
        </p>

        {/* Tip card */}
        <div style={{
          background: '#ebf0ff', borderRadius: 12,
          padding: '14px 16px',
          display: 'flex', alignItems: 'flex-start', gap: 10,
        }}>
          <img src={imgTrainer} alt="Alicia" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center top', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 4 }}>
              A Tip from Alicia
            </div>
            <div style={{ fontSize: 15, color: C.text, lineHeight: 1.5 }}>
              Try not to overthink your responses—trust your gut!
            </div>
          </div>
        </div>
      </div>

      <div style={{ flexShrink: 0, padding: '12px 16px 8px' }}>
        <PurpleButton onClick={onNext}>Continue</PurpleButton>
      </div>
    </div>
  )
}

// ─── Question data ────────────────────────────────────────────────────────────

const QUESTIONS = [
  {
    preamble: <>The following question concerns the amount of joint stiffness you have experienced during the <strong>last week</strong> in your knee. Stiffness is a sensation of restriction or slowness in the ease of which you move your knee joint.</>,
    question: 'How severe is your knee stiffness after first wakening in the morning?',
  },
  {
    preamble: <>What amount of knee pain have you experienced in the <strong>last week</strong> during the following activities?</>,
    question: 'Twisting/pivoting on your knee',
  },
  {
    preamble: <>What amount of knee pain have you experienced in the <strong>last week</strong> during the following activities?</>,
    question: 'Straightening knee fully',
  },
  {
    preamble: <>What amount of knee pain have you experienced in the <strong>last week</strong> during the following activities?</>,
    question: 'Going up or down stairs',
  },
  {
    preamble: <>What amount of knee pain have you experienced in the <strong>last week</strong> during the following activities?</>,
    question: 'Standing upright',
  },
  {
    preamble: <>The following question concerns your physical function. By this we mean your ability to move around and to look after yourself. For each of the following activities please indicate the degree of difficulty you have experienced in the <strong>last week</strong> due to your knee.</>,
    question: 'Rising from sitting',
  },
  {
    preamble: <>The following question concerns your physical function. By this we mean your ability to move around and to look after yourself. For each of the following activities please indicate the degree of difficulty you have experienced in the <strong>last week</strong> due to your knee.</>,
    question: 'Bending to floor/pick up an object',
  },
]

const OPTIONS = ['None', 'Mild', 'Moderate', 'Severe', 'Extreme']

// ─── Step 1: Questions ────────────────────────────────────────────────────────

function KoosQuestions({ onNext, onBack }) {
  const [qIndex, setQIndex] = useState(0)
  const [answer, setAnswer] = useState(null)

  const current = QUESTIONS[qIndex]
  const isLast = qIndex === QUESTIONS.length - 1

  const handleSubmit = () => {
    if (isLast) {
      onNext()
    } else {
      setQIndex(i => i + 1)
      setAnswer(null)
    }
  }

  const handleBack = () => {
    if (qIndex === 0) {
      onBack()
    } else {
      setQIndex(i => i - 1)
      setAnswer(null)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      <KoosHeader onBack={handleBack} step={qIndex + 1} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px 16px' }}>
        <div style={{ marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.textSec, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Question {qIndex + 1} of {QUESTIONS.length}
          </span>
        </div>

        <p style={{ fontSize: 16, color: C.textSec, lineHeight: 1.6, marginBottom: 20 }}>
          {current.preamble}
        </p>

        <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 20, lineHeight: 1.35, letterSpacing: -0.2 }}>
          {current.question}
        </h2>

        {OPTIONS.map(opt => (
          <RadioOption
            key={opt}
            label={opt}
            selected={answer === opt}
            onSelect={() => setAnswer(opt)}
          />
        ))}
      </div>

      <div style={{ flexShrink: 0, padding: '12px 16px 8px' }}>
        <PurpleButton onClick={handleSubmit} disabled={!answer}>
          {isLast ? 'Submit' : 'Continue'}
        </PurpleButton>
      </div>
    </div>
  )
}

// ─── Step 2: Complete ─────────────────────────────────────────────────────────

function KoosOutro({ onNext }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      {/* Reuse header style — full progress, no back */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', background: C.white }}>
          <div style={{ width: 36 }} />
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <img src={boldLogo} alt="Bold" style={{ height: 28, width: 'auto' }} />
          </div>
          <div style={{ width: 36 }} />
        </div>
        <div style={{ height: 3, background: C.purple }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '40px 20px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: '#d1fae5', border: '3px solid #22c55e',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 24,
        }}>
          <svg width="32" height="26" viewBox="0 0 32 26" fill="none">
            <path d="M2 13l8.5 9.5L30 2" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h2 style={{ fontSize: 24, fontWeight: 700, color: C.text, marginBottom: 12, lineHeight: 1.2, letterSpacing: -0.3 }}>
          Thank you, Carol!
        </h2>

        <p style={{ fontSize: 16, color: C.textSec, lineHeight: 1.6, maxWidth: 300, marginBottom: 28 }}>
          Your baseline has been recorded. We'll check in again in 3 months to see how much you've improved.
        </p>

        <div style={{ width: '100%', background: '#ebf0ff', borderRadius: 12, padding: '14px 16px', textAlign: 'left', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <img src={imgTrainer} alt="Alicia" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center top', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 4 }}>What happens next?</div>
            <div style={{ fontSize: 15, color: C.text, lineHeight: 1.5 }}>
              Keep taking your classes and Bold will track your progress. Your first follow-up check-in is in 3 months.
            </div>
          </div>
        </div>
      </div>

      <div style={{ flexShrink: 0, padding: '12px 16px 8px' }}>
        <PurpleButton onClick={onNext}>Continue</PurpleButton>
      </div>
    </div>
  )
}

// ─── Combined flow ────────────────────────────────────────────────────────────

export default function KoosJr({ onNext, onBack }) {
  const [step, setStep] = useState(0)
  const advance = () => setStep(s => s + 1)
  const retreat = () => setStep(s => s - 1)

  if (step === 0) return <KoosPrimer onNext={advance} onBack={onBack} />
  if (step === 1) return <KoosQuestions onNext={advance} onBack={retreat} />
  return <KoosOutro onNext={onNext} />
}
