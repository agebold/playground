import { useState } from 'react'
import boldLogo from '../../assets/bold-logo@2x.png'
import { C, PurpleButton } from './shared.jsx'

// ─── Shared primitives ────────────────────────────────────────────────────────

const baseInput = {
  width: '100%', padding: '13px 14px',
  border: `1.5px solid ${C.border}`, borderRadius: 10,
  fontSize: 16, fontFamily: 'Inter, sans-serif', color: C.text,
  outline: 'none', boxSizing: 'border-box',
}

function WhyLink() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}>
      <span style={{
        width: 16, height: 16, borderRadius: '50%', background: C.purple,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 10, color: 'white', fontWeight: 700, flexShrink: 0,
      }}>?</span>
      <span style={{ fontSize: 13, color: C.purple, textDecoration: 'underline' }}>
        Why are we asking this?
      </span>
    </span>
  )
}

function PrivacyNote() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 14 }}>
      <svg width="13" height="15" viewBox="0 0 14 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
        <path d="M7 1L1 4v5c0 3.3 2.55 6.4 6 7.1C10.45 15.4 13 12.3 13 9V4L7 1z"
          fill={C.purple} fillOpacity="0.12" />
        <path d="M7 1L1 4v5c0 3.3 2.55 6.4 6 7.1C10.45 15.4 13 12.3 13 9V4L7 1z"
          stroke={C.purple} strokeWidth="1.2" />
      </svg>
      <p style={{ fontSize: 12, color: C.textSec, lineHeight: 1.45, margin: 0 }}>
        Your information is private and protected. We follow federal standards for data privacy.
      </p>
    </div>
  )
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

// ─── Step 1: Initial modal form ───────────────────────────────────────────────

function EligibilityForm({ onSubmit }) {
  const [form, setForm] = useState({ email: '', firstName: '', lastName: '', dob: '' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const fieldStyle = { ...baseInput, background: C.bg }

  const Field = ({ label, k, type = 'text', placeholder = '' }) => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 16, fontWeight: 500, color: C.text, marginBottom: 6 }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[k]}
        onChange={e => set(k, e.target.value)}
        style={fieldStyle}
      />
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, background: '#3c3c4380', display: 'flex', alignItems: 'flex-start', overflow: 'hidden' }}>
        <div style={{
          background: C.white, borderRadius: '16px 16px 0 0',
          padding: '20px 16px', width: '100%', marginTop: 20,
          flex: 1, overflowY: 'auto',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <h2 style={{ fontSize: 22, fontWeight: 600, color: C.text, margin: 0 }}>Check my eligibility</h2>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: 16, color: C.textSec,
            }}>×</div>
          </div>
          <p style={{ fontSize: 16, color: C.textSec, marginBottom: 20, lineHeight: 1.5 }}>
            Enter your information below to check if you're eligible for Bold through the CMS ACCESS program.
          </p>

          <Field label="Email" k="email" type="email" />
          <Field label="First name" k="firstName" />
          <Field label="Last name" k="lastName" />
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 6 }}>
              Date of birth
            </label>
            <input
              type="text"
              placeholder="MM/DD/YYYY"
              value={form.dob}
              onChange={e => set('dob', e.target.value)}
              style={{ ...fieldStyle, color: form.dob ? C.text : C.textTert }}
            />
          </div>

          <PurpleButton onClick={() => onSubmit(form)}>
            Check eligibility
          </PurpleButton>

          <p style={{ fontSize: 14, color: C.textSec, textAlign: 'center', marginTop: 12, lineHeight: 1.2 }}>
            By signing up, you agree to Bold's{' '}
            <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Terms of service</span>{' '}
            and{' '}
            <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Privacy policy</span>.
          </p>

          <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 16, paddingTop: 16, textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: C.textSec }}>
              Need help?{' '}
              <span style={{ color: C.purple, fontWeight: 600 }}>Call us (833) 701-1545</span>
            </p>
            <p style={{ fontSize: 14, color: C.textSec, marginTop: 4 }}>
              Already on Bold?{' '}
              <span style={{ color: C.purple, fontWeight: 600, cursor: 'pointer' }}>Sign in</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Step 2: Confirm your details ────────────────────────────────────────────

function ConfirmDetails({ formData, onSubmit }) {
  const [details, setDetails] = useState({
    firstName: formData.firstName || 'Carol',
    lastName:  formData.lastName  || 'Sturka',
    dob:       formData.dob       || '01/01/1965',
    gender:    'Female',
    phone:     '(310) 543-9174',
    mbi:       '1EG4-TE5-MK72',
    zip:       '',
  })
  const set = (k, v) => setDetails(d => ({ ...d, [k]: v }))

  const fieldStyle = { ...baseInput, background: C.white }

  const TextField = ({ label, value, onChange, type = 'text', placeholder = '', extra }) => (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <label style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{label}</label>
        {extra}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={fieldStyle}
      />
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      <LogoBar />

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px 8px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: C.text, marginBottom: 8, lineHeight: 1.2, letterSpacing: -0.3 }}>
          Confirm your details
        </h2>
        <p style={{ fontSize: 16, color: C.textSec, lineHeight: 1.4, marginBottom: 24 }}>
          Make sure this matches your health insurance card exactly, including full legal name and spelling.
        </p>

        <TextField label="Legal first name" value={details.firstName} onChange={v => set('firstName', v)} />
        <TextField label="Legal last name"  value={details.lastName}  onChange={v => set('lastName', v)} />
        <TextField label="Date of birth"    value={details.dob}       onChange={v => set('dob', v)} />

        {/* Gender dropdown */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: C.text, marginBottom: 6 }}>
            Gender
          </label>
          <div style={{ position: 'relative' }}>
            <select
              value={details.gender}
              onChange={e => set('gender', e.target.value)}
              style={{ ...fieldStyle, appearance: 'none', WebkitAppearance: 'none', paddingRight: 40, cursor: 'pointer' }}
            >
              {['Female', 'Male', 'Non-binary', 'Prefer not to say'].map(g => (
                <option key={g}>{g}</option>
              ))}
            </select>
            <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <svg width="11" height="7" viewBox="0 0 12 7" fill="none">
                <path d="M1 1l5 5 5-5" stroke={C.textSec} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        <TextField
          label="Phone"
          value={details.phone}
          onChange={v => set('phone', v)}
          type="tel"
          extra={<WhyLink />}
        />
        <TextField label="MBI"                  value={details.mbi} onChange={v => set('mbi', v)} />
        <TextField label="ZIP code (optional)"  value={details.zip} onChange={v => set('zip', v)} />
      </div>

      <div style={{ flexShrink: 0, padding: '12px 20px 16px', borderTop: `1px solid ${C.border}` }}>
        <PurpleButton onClick={onSubmit}>Submit</PurpleButton>
        <PrivacyNote />
      </div>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function CheckEligibility({ onNext, onSubStepChange }) {
  const [step, setStep]        = useState('form')
  const [formData, setFormData] = useState({})

  const goTo = (s) => { setStep(s); onSubStepChange?.(s) }

  if (step === 'form') {
    return (
      <EligibilityForm
        onSubmit={data => { setFormData(data); goTo('confirm') }}
      />
    )
  }
  return (
    <ConfirmDetails
      formData={formData}
      onSubmit={onNext}
    />
  )
}
