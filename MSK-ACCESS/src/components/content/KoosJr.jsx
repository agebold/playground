import { useState } from 'react'
import boldLogo from '../../assets/bold-logo@2x.png'
import { C, OnboardingHeader, OnboardingScreen, PurpleButton, OutlineButton, RadioOption, AppHeader } from './shared.jsx'

// ─── Step 0: Instructions ─────────────────────────────────────────────────────
function KoosPrimer({ onNext, onBack }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      <OnboardingHeader showBack logoSrc={boldLogo} onBack={onBack} />
      <OnboardingScreen cta={<PurpleButton onClick={onNext}>Continue</PurpleButton>}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 10, lineHeight: 1.3 }}>
          Knee Injury and Osteoarthritis Outcome Score (KOOS JR)
        </h2>

        <p style={{ fontSize: 14, color: C.textSec, lineHeight: 1.6, marginBottom: 20 }}>
          This short questionnaire helps us understand how your knee affects your daily life. Your answers create a baseline score we'll track over time.
        </p>

        <div style={{ background: C.bg, borderRadius: 12, padding: '14px 16px', marginBottom: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: '📝', text: '7 quick questions' },
              { icon: '⏱', text: 'Takes about 3 minutes' },
              { icon: '📈', text: 'We\'ll resurvey you in 3 months to measure improvement' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                <span style={{ fontSize: 14, color: C.text, lineHeight: 1.4 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          background: '#f8f4ff', borderRadius: 12, padding: '12px 14px',
          display: 'flex', gap: 10,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: `linear-gradient(135deg, #a78bfa, #7c3aed)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: 12 }}>👩</span>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 3 }}>
              A tip from Amanda
            </div>
            <div style={{ fontSize: 13, color: C.textSec, lineHeight: 1.5 }}>
              Think about the <strong>past week</strong> when answering. Be honest — there are no right or wrong answers.
            </div>
          </div>
        </div>
      </OnboardingScreen>
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
      <OnboardingHeader showBack progress={qIndex + 1} totalSteps={7} logoSrc={boldLogo} onBack={handleBack} />
      <OnboardingScreen cta={<PurpleButton onClick={handleSubmit} disabled={!answer}>Submit</PurpleButton>}>
        <p style={{ fontSize: 16, color: C.textSec, lineHeight: 1.4, marginBottom: 16 }}>
          {current.preamble}
        </p>

        <div style={{
          fontSize: 11, fontWeight: 700,
          letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6,
        }}>
          Question {qIndex + 1}
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 600, color: C.text, marginBottom: 20, lineHeight: 1.35 }}>
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
      </OnboardingScreen>
    </div>
  )
}

// ─── Step 2: Complete ─────────────────────────────────────────────────────────
function KoosOutro({ onNext }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      <AppHeader streak={1} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '40px 16px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{
          width: 88, height: 88, borderRadius: '50%',
          background: '#d1fae5',
          border: '4px solid #34c759',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 24,
        }}>
          <svg width="36" height="30" viewBox="0 0 36 30" fill="none">
            <path d="M2 15L12 25L34 2" stroke="#34c759" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h2 style={{ fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 12, lineHeight: 1.2 }}>
          Thank you, Carol!
        </h2>

        <p style={{ fontSize: 15, color: C.textSec, lineHeight: 1.6, maxWidth: 300, marginBottom: 28 }}>
          Your baseline has been recorded. We'll check in again in 3 months to see how much you've improved.
        </p>

        <div style={{ width: '100%', background: C.purpleLight, borderRadius: 12, padding: '14px 16px', textAlign: 'left' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 4 }}>What happens next?</div>
          <div style={{ fontSize: 13, color: C.textSec, lineHeight: 1.5 }}>
            Keep taking your classes and Bold will track your progress. Your first follow-up check-in is in 3 months.
          </div>
        </div>
      </div>

      <div style={{ flexShrink: 0, padding: '12px 16px 8px', borderTop: `1px solid ${C.border}` }}>
        <PurpleButton onClick={onNext}>Start class</PurpleButton>
        <OutlineButton onClick={onNext}>Return to Today's Plan</OutlineButton>
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
