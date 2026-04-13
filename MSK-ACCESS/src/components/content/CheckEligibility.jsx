import { useState } from 'react'
import { C, PurpleButton, SafariBottomBar } from './shared.jsx'

export default function CheckEligibility({ onNext }) {
  const [form, setForm] = useState({ email: '', firstName: '', lastName: '', dob: '' })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const valid = form.email.includes('@') && form.firstName && form.lastName && form.dob.length === 10

  const inputStyle = {
    width: '100%', padding: '13px 14px',
    border: `1.5px solid ${C.border}`, borderRadius: 10,
    fontSize: 16, fontFamily: 'Inter, sans-serif', color: C.text,
    background: C.bg, outline: 'none', boxSizing: 'border-box',
  }

  const Field = ({ label, k, type = 'text', placeholder = '' }) => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 6 }}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[k]}
        onChange={e => set(k, e.target.value)}
        style={inputStyle}
      />
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Gray backdrop */}
      <div style={{ flex: 1, background: '#3c3c4380', display: 'flex', alignItems: 'flex-start', overflow: 'hidden' }}>
        {/* Sheet */}
        <div style={{
          background: C.white, borderRadius: '16px 16px 0 0',
          padding: '20px 16px', width: '100%', marginTop: 20,
          flex: 1, overflowY: 'auto',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, margin: 0 }}>Check my eligibility</h2>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: 16, color: C.textSec,
            }}>×</div>
          </div>
          <p style={{ fontSize: 14, color: C.textSec, marginBottom: 20, lineHeight: 1.5 }}>
            Enter your information below to check if you're eligible for Bold through the CMS ACCESS program.
          </p>

          <Field label="Email" k="email" type="email" />
          <Field label="First name" k="firstName" />
          <Field label="Last name" k="lastName" />
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 6 }}>Date of birth</label>
            <input
              type="text"
              placeholder="MM/DD/YYYY"
              value={form.dob}
              onChange={e => set('dob', e.target.value)}
              style={{ ...inputStyle, color: form.dob ? C.text : C.textTert }}
            />
          </div>

          <PurpleButton onClick={onNext}>Check eligibility</PurpleButton>

          <p style={{ fontSize: 12, color: C.textSec, textAlign: 'center', marginTop: 12, lineHeight: 1.5 }}>
            By signing up, you agree to Bold's{' '}
            <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Terms of service</span>{' '}
            and{' '}
            <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Privacy policy</span>.
          </p>

          <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 16, paddingTop: 16, textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: C.textSec }}>
              Need help?{' '}
              <span style={{ color: C.purple, fontWeight: 600 }}>Call us (833) 701-1545</span>
            </p>
            <p style={{ fontSize: 13, color: C.textSec, marginTop: 4 }}>
              Already on Bold?{' '}
              <span style={{ color: C.purple, fontWeight: 600, cursor: 'pointer' }}>Sign in</span>
            </p>
          </div>
        </div>
      </div>
      <SafariBottomBar />
    </div>
  )
}
