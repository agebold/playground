import { useState } from 'react'
import { C, OnboardingHeader, OnboardingScreen, PurpleButton, CheckboxOption, QuestionHeader } from './shared.jsx'

const regions = [
  { id: 'neck', label: 'Neck & upper back' },
  { id: 'shoulder', label: 'Shoulder' },
  { id: 'lower-back', label: 'Lower back' },
  { id: 'hip', label: 'Hip' },
  { id: 'knee', label: 'Knee' },
  { id: 'other', label: 'Other' },
]

export default function PainRegions({ onNext }) {
  const [selected, setSelected] = useState(new Set())
  const [otherText, setOtherText] = useState('')

  const toggle = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const canContinue = selected.size > 0 && (!selected.has('other') || otherText.trim())

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <OnboardingHeader showBack progress={2} totalSteps={10} />
      <OnboardingScreen cta={<PurpleButton onClick={onNext} disabled={!canContinue}>Continue</PurpleButton>}>
        <QuestionHeader questionNum="#" question="Where do you currently experience pain?" sublabel="Choose all that apply." />
        {regions.map(r => (
          <div key={r.id}>
            <CheckboxOption
              label={r.label}
              checked={selected.has(r.id)}
              onToggle={() => toggle(r.id)}
            />
            {r.id === 'other' && selected.has('other') && (
              <div style={{ marginTop: -4, marginBottom: 8, paddingLeft: 2 }}>
                <input
                  type="text"
                  placeholder="Please specify (e.g. wrist, ankle)"
                  value={otherText}
                  onChange={e => setOtherText(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 14px',
                    border: `1.5px solid ${C.border}`, borderRadius: 10,
                    fontSize: 15, fontFamily: 'Inter, sans-serif', color: C.text,
                    background: C.bg, outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </OnboardingScreen>
    </div>
  )
}
