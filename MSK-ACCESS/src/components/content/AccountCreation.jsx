import { useState } from 'react'
import { C, OnboardingHeader, OnboardingScreen, PurpleButton } from './shared.jsx'

export default function AccountCreation({ onNext }) {
  const [form, setForm] = useState({ firstName: 'Carol', lastName: 'Sturka', password: '' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const inputStyle = {
    width: '100%', padding: '13px 14px',
    border: `1.5px solid ${C.border}`, borderRadius: 10,
    fontSize: 16, fontFamily: 'Inter, sans-serif',
    color: C.text, background: C.white, outline: 'none', boxSizing: 'border-box',
  }

  const passValid = form.password.length >= 8

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <OnboardingHeader showBack progress={9} totalSteps={10} />
      <OnboardingScreen cta={
        <>
          <PurpleButton onClick={onNext}>I agree</PurpleButton>
          <p style={{ fontSize: 12, color: C.textSec, textAlign: 'center', marginTop: 10, lineHeight: 1.5 }}>
            We will not sell or provide your personally identifiable information (e.g. name, date of birth) to anyone.
          </p>
        </>
      }>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.textSec, marginBottom: 6 }}>Finish profile</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 20, lineHeight: 1.3 }}>
          Last step to create your Bold account
        </h2>

        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 6 }}>First name</label>
          <input value={form.firstName} onChange={e => set('firstName', e.target.value)} style={inputStyle} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 6 }}>Last name</label>
          <input value={form.lastName} onChange={e => set('lastName', e.target.value)} style={inputStyle} />
        </div>
        <div style={{ marginBottom: 6 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 6 }}>Create a password</label>
          <input
            type="password"
            value={form.password}
            onChange={e => set('password', e.target.value)}
            style={inputStyle}
          />
        </div>
        {!passValid && (
          <div style={{ fontSize: 13, color: C.purple, marginBottom: 16 }}>
            Password must be at least 8 characters long
          </div>
        )}
      </OnboardingScreen>
    </div>
  )
}
