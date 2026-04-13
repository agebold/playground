import { useState } from 'react'
import { C, BoldLogo, PurpleButton, ScreenWrapper, OnboardingProgress } from './shared.jsx'

export default function AccountCreation({ onNext }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPass, setShowPass] = useState(false)

  const valid = form.name.trim() && form.email.includes('@') && form.password.length >= 8

  const field = (label, key, type = 'text', placeholder = '') => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          type={key === 'password' ? (showPass ? 'text' : 'password') : type}
          placeholder={placeholder}
          value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          style={{
            width: '100%', padding: '13px 16px',
            border: `1.5px solid ${C.border}`,
            borderRadius: 10, fontSize: 15,
            fontFamily: 'Inter, sans-serif',
            color: C.text, background: C.white,
            outline: 'none', boxSizing: 'border-box',
          }}
        />
        {key === 'password' && (
          <button
            type="button"
            onClick={() => setShowPass(s => !s)}
            style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              border: 'none', background: 'none', cursor: 'pointer',
              fontSize: 16, color: C.textSec,
            }}>
            {showPass ? '🙈' : '👁️'}
          </button>
        )}
      </div>
      {key === 'password' && form.password && (
        <div style={{ fontSize: 12, color: form.password.length >= 8 ? C.teal : C.red, marginTop: 4 }}>
          {form.password.length >= 8 ? '✓ Strong enough' : `${8 - form.password.length} more characters needed`}
        </div>
      )}
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', borderBottom: `1px solid ${C.border}` }}>
        <BoldLogo size={28} />
      </div>

      <OnboardingProgress current={9} total={10} />

      <ScreenWrapper
        bottomSlot={
          <>
            <PurpleButton onClick={onNext} disabled={!valid}>Create my account</PurpleButton>
            <p style={{ fontSize: 12, color: C.textTert, textAlign: 'center', marginTop: 10, lineHeight: 1.5 }}>
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </p>
          </>
        }
      >
        <div style={{ padding: '24px 20px' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 8, lineHeight: 1.3 }}>
            Create your account
          </h2>
          <p style={{ fontSize: 14, color: C.textSec, marginBottom: 28, lineHeight: 1.5 }}>
            You're almost done! Create an account to save your progress and access your plan.
          </p>

          {field('Full name', 'name', 'text', 'Jane Smith')}
          {field('Email address', 'email', 'email', 'jane@example.com')}
          {field('Password', 'password', 'password', 'At least 8 characters')}

          <div style={{
            background: C.purpleLight, borderRadius: 12, padding: 14,
            display: 'flex', gap: 10, alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 18 }}>🔒</span>
            <p style={{ fontSize: 13, color: C.purple, lineHeight: 1.5 }}>
              Your data is encrypted and never sold. We take your privacy seriously.
            </p>
          </div>
        </div>
      </ScreenWrapper>
    </div>
  )
}
