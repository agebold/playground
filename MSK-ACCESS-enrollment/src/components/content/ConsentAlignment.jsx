import { useState } from 'react'
import boldLogo from '../../assets/bold-logo@2x.png'
import { C, OnboardingHeader, OnboardingScreen, PurpleButton, ConsentCheckbox } from './shared.jsx'

const ITEMS = [
  {
    lead: "You're choosing to join.",
    body: "Joining Bold and taking part in this Medicare program is your choice. It's completely voluntary.",
  },
  {
    lead: 'One musculoskeletal pain program at a time.',
    body: "You can have one provider for this type of care at a time. While you're with Bold for MSK, Bold is your provider for it.",
  },
  {
    lead: 'You can leave whenever you want after 90 days.',
    body: "You may end your Bold membership any time starting 90 days after you join. If you like, you can then join another program in Medicare's ACCESS program instead.",
  },
  {
    lead: 'There is no out-of-pocket cost to you for participating in the Bold.',
    body: null,
  },
  {
    lead: 'How your health information is used.',
    body: 'To support your care, your Medicare claims information may be shared with Bold. This is protected by privacy and security laws, including HIPAA.',
  },
]

export default function ConsentAlignment({ onNext, onBack }) {
  const [checked, setChecked] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      <OnboardingHeader showBack onBack={onBack} logoSrc={boldLogo} />
      <OnboardingScreen cta={<PurpleButton onClick={onNext} disabled={!checked}>Continue</PurpleButton>}>
        <p style={{ fontSize: 18, color: C.text, lineHeight: 1.4, margin: '0 0 16px' }}>
          Please confirm a few things before you join the Bold musculoskeletal pain program through Medicare ACCESS.
        </p>

        <ol style={{
          background: C.white, border: `1px solid ${C.border}`, borderRadius: 16,
          padding: 16, maxHeight: 300, overflowY: 'auto', marginBottom: 16,
          listStyle: 'none', margin: '0 0 16px',
        }}>
          {ITEMS.map((item, i) => (
            <li key={i} style={{ display: 'flex', gap: 8, marginBottom: i < ITEMS.length - 1 ? 12 : 0 }}>
              <span style={{ fontSize: 18, fontWeight: 600, color: C.text, lineHeight: 1.5, flexShrink: 0 }}>{i + 1}.</span>
              <span style={{ fontSize: 18, color: C.text, lineHeight: 1.5 }}>
                <strong style={{ fontWeight: 600 }}>{item.lead}</strong>
                {item.body && <> {item.body}</>}
              </span>
            </li>
          ))}
        </ol>

        <ConsentCheckbox checked={checked} onToggle={() => setChecked(c => !c)}>
          I acknowledge and consent to receive ACCESS services
        </ConsentCheckbox>
      </OnboardingScreen>
    </div>
  )
}
