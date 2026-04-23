import { useState } from 'react'
import boldLogo from '../../assets/bold-logo@2x.png'
import { C, PurpleButton, RadioOption } from './shared.jsx'

// ─── Shared primitives ────────────────────────────────────────────────────────

const baseInput = {
  width: '100%', padding: '13px 14px',
  border: `1.5px solid ${C.border}`, borderRadius: 10,
  fontSize: 16, fontFamily: 'Inter, sans-serif', color: C.text,
  outline: 'none', boxSizing: 'border-box', background: C.white,
}

function LogoBar() {
  return (
    <div style={{
      padding: '14px 20px', borderBottom: `1px solid ${C.border}`,
      display: 'flex', justifyContent: 'center', flexShrink: 0,
    }}>
      <img src={boldLogo} alt="Bold" style={{ height: 28, width: 'auto' }} />
    </div>
  )
}

function WhyLink() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}>
      <span style={{
        width: 16, height: 16, borderRadius: '50%', background: C.purple,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, color: 'white', fontWeight: 700, flexShrink: 0,
      }}>?</span>
      <span style={{ fontSize: 14, color: C.purple, textDecoration: 'underline' }}>
        Why are we asking this?
      </span>
    </span>
  )
}

// Bordered physician card — matches RadioOption style but with multi-line content
function PhysicianCard({ physician, selected, onSelect }) {
  return (
    <div
      onClick={onSelect}
      style={{
        display: 'flex', gap: 12, alignItems: 'flex-start',
        padding: '14px 14px',
        background: C.white,
        border: `1.5px solid ${selected ? C.purple : C.border}`,
        borderRadius: 12, cursor: 'pointer', marginBottom: 8,
      }}
    >
      <div style={{
        width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 2,
        border: `2px solid ${selected ? C.purple : '#c7c7cc'}`,
        background: selected ? C.purple : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {selected && <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.white }} />}
      </div>
      <div>
        <div style={{ fontSize: 15, fontWeight: selected ? 500 : 400, color: C.text, marginBottom: 3 }}>
          {physician.name}
        </div>
        <div style={{ fontSize: 13, color: C.textSec, lineHeight: 1.6 }}>{physician.address}</div>
        <div style={{ fontSize: 13, color: C.textSec, lineHeight: 1.6 }}>{physician.cityState}</div>
        <div style={{ fontSize: 13, color: C.textSec, lineHeight: 1.6 }}>NPI: {physician.npi}</div>
      </div>
    </div>
  )
}

// ─── Screen 1: Share updates yes/no ──────────────────────────────────────────

function PcpShareQuestion({ onYes, onNo }) {
  const [answer, setAnswer] = useState(null)

  const handleContinue = () => {
    if (answer === 'yes') onYes()
    else if (answer === 'no') onNo()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      <LogoBar />
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 20px 8px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: C.text, marginBottom: 4, lineHeight: 1.25, letterSpacing: -0.3 }}>
          Would you like to share your updates with your current primary care physician?
        </h2>
        <div style={{ marginBottom: 28 }}>
          <WhyLink />
        </div>
        <RadioOption label="Yes" selected={answer === 'yes'} onSelect={() => setAnswer('yes')} />
        <RadioOption label="No"  selected={answer === 'no'}  onSelect={() => setAnswer('no')} />
      </div>
      <div style={{ flexShrink: 0, padding: '12px 20px 16px', borderTop: `1px solid ${C.border}` }}>
        <PurpleButton onClick={handleContinue} disabled={!answer}>Continue</PurpleButton>
      </div>
    </div>
  )
}

// ─── Screen 2: Enter PCP name + location ─────────────────────────────────────

function PcpNameEntry({ onSubmit }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', cityState: '' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const Field = ({ label, k }) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: C.text, marginBottom: 6 }}>
        {label}
      </label>
      <input
        type="text"
        value={form[k]}
        onChange={e => set(k, e.target.value)}
        style={baseInput}
      />
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      <LogoBar />
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 20px 8px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: C.text, marginBottom: 28, lineHeight: 1.25, letterSpacing: -0.3 }}>
          Enter the name and location of your primary care physician.
        </h2>
        <Field label="First name" k="firstName" />
        <Field label="Last name"  k="lastName" />
        <Field label="City, State" k="cityState" />
      </div>
      <div style={{ flexShrink: 0, padding: '12px 20px 16px', borderTop: `1px solid ${C.border}` }}>
        <PurpleButton onClick={() => onSubmit(form)}>Submit</PurpleButton>
      </div>
    </div>
  )
}

// ─── Screen 3: Select from matched results ────────────────────────────────────

const PHYSICIANS = [
  { id: 1, name: 'Claire Hsing', address: '4433 S 70TH ST',          cityState: 'LINCOLN, NE 68516-4275', npi: '1144640889' },
  { id: 2, name: 'Claire Hsing', address: '44817 SOUTH AIRPORT ROAD', cityState: 'HAMMOND, LA 70403',      npi: '1144640889' },
]

function PcpSelect({ onSelect }) {
  const [selected, setSelected] = useState(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      <LogoBar />
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 20px 8px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: C.text, marginBottom: 24, lineHeight: 1.25, letterSpacing: -0.3 }}>
          Please select your primary care physician from this list.
        </h2>
        {PHYSICIANS.map(p => (
          <PhysicianCard
            key={p.id}
            physician={p}
            selected={selected?.id === p.id}
            onSelect={() => setSelected(p)}
          />
        ))}
      </div>
      <div style={{ flexShrink: 0, padding: '12px 20px 16px', borderTop: `1px solid ${C.border}` }}>
        <PurpleButton onClick={() => onSelect(selected)} disabled={!selected}>Continue</PurpleButton>
      </div>
    </div>
  )
}

// ─── Screen 4: Confirmation ───────────────────────────────────────────────────

function PcpConfirmation({ physician, onNext }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      <LogoBar />
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 20px 8px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: C.text, marginBottom: 20, lineHeight: 1.25, letterSpacing: -0.3 }}>
          Great! We'll send progress updates to your primary care physician on your behalf.
        </h2>
        <div style={{ border: `1.5px solid ${C.border}`, borderRadius: 12, padding: '14px 16px' }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 4 }}>{physician.name}</div>
          <div style={{ fontSize: 13, color: C.textSec, lineHeight: 1.6 }}>{physician.address}</div>
          <div style={{ fontSize: 13, color: C.textSec, lineHeight: 1.6 }}>{physician.cityState}</div>
          <div style={{ fontSize: 13, color: C.textSec, lineHeight: 1.6 }}>NPI: {physician.npi}</div>
        </div>
      </div>
      <div style={{ flexShrink: 0, padding: '12px 20px 16px', borderTop: `1px solid ${C.border}` }}>
        <PurpleButton onClick={onNext}>Continue</PurpleButton>
      </div>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function PCPConsent({ onNext }) {
  const [step, setStep]         = useState('question')
  const [physician, setPhysician] = useState(null)

  if (step === 'question') {
    return <PcpShareQuestion onYes={() => setStep('entry')} onNo={onNext} />
  }
  if (step === 'entry') {
    return <PcpNameEntry onSubmit={() => setStep('select')} />
  }
  if (step === 'select') {
    return <PcpSelect onSelect={p => { setPhysician(p); setStep('confirm') }} />
  }
  return <PcpConfirmation physician={physician} onNext={onNext} />
}
