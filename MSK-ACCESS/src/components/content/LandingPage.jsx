import boldLogo from '../../assets/bold-logo@2x.png'
import heroBg from '../../assets/hero-bg.jpg'
import { C } from './shared.jsx'

export default function LandingPage({ onNext }) {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', color: C.text }}>

      {/* ── Hero (nav lives inside so image bleeds behind it) ── */}
      <div style={{
        position: 'relative',
        backgroundImage: `url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        minHeight: 580,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Dark overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.52)' }} />

        {/* Floating Nav */}
        <div style={{ position: 'relative', zIndex: 20, padding: '16px 16px 0' }}>
          <nav style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 24px',
            background: C.white,
            borderRadius: 16,
            boxShadow: '0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
          }}>
            <img src={boldLogo} alt="Bold" style={{ height: 28, width: 'auto' }} />
            <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
              {['FAQ', 'Resources', 'Partnerships', 'Contact'].map(link => (
                <a key={link} style={{ fontSize: 14, color: C.textSec, textDecoration: 'none', cursor: 'pointer' }}>
                  {link}
                </a>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <button style={{
                background: 'transparent', color: C.text,
                border: `1.5px solid ${C.border}`,
                borderRadius: 10, padding: '8px 18px',
                fontSize: 14, fontWeight: 500, cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
              }}>Log in</button>
              <button onClick={onNext} style={{
                background: C.purple, color: 'white', border: 'none',
                borderRadius: 10, padding: '8px 18px',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
              }}>Check eligibility</button>
            </div>
          </nav>
        </div>

        {/* Hero text */}
        <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', alignItems: 'center', padding: '48px 48px 64px' }}>
          <div style={{ maxWidth: 440 }}>
            <h1 style={{
              fontSize: 48, fontWeight: 800, lineHeight: 1.1,
              letterSpacing: -1, marginBottom: 16, color: 'white',
            }}>
              Empower your recovery
            </h1>
            <p style={{
              fontSize: 16, color: 'rgba(255,255,255,0.85)',
              lineHeight: 1.6, marginBottom: 32, maxWidth: 380,
            }}>
              Designed specifically for patients with Original Medicare, this program helps you manage and overcome chronic musculoskeletal (MSK) pain through innovative, technology-supported care.
            </p>
            <button onClick={onNext} style={{
              background: C.purple, color: 'white', border: 'none',
              borderRadius: 12, padding: '14px 28px',
              fontSize: 16, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}>
              Check eligibility
            </button>
          </div>
        </div>
      </div>

      {/* ── Trust bar ── */}
      <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: '20px 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          {[
            { num: '50,000+', label: 'Members enrolled' },
            { num: '4.8★', label: 'Average rating' },
            { num: '85%', label: 'Report less pain' },
            { num: '$0', label: 'Cost to you' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: C.purple }}>{stat.num}</div>
              <div style={{ fontSize: 13, color: C.textSec }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── How it works ── */}
      <div style={{ padding: '64px 48px', background: C.bg }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: 'center', marginBottom: 8, letterSpacing: -0.5 }}>
          How ACCESS works
        </h2>
        <p style={{ fontSize: 16, color: C.textSec, textAlign: 'center', marginBottom: 48 }}>
          From enrollment to feeling better in 4 simple steps.
        </p>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center' }}>
          {[
            { step: '01', icon: '✅', title: 'Check eligibility', desc: 'Confirm your health plan covers the ACCESS program. Takes under 2 minutes.' },
            { step: '02', icon: '📋', title: 'Complete intake', desc: 'Tell us about your pain, goals, and preferences so we can personalize your plan.' },
            { step: '03', icon: '🎯', title: 'Get your plan', desc: 'Receive a personalized exercise program built for your specific condition and goals.' },
            { step: '04', icon: '💪', title: 'Start moving', desc: 'Follow your plan with guided classes led by licensed physical therapists.' },
          ].map((item, i) => (
            <div key={i} style={{
              flex: 1, background: C.white, borderRadius: 16,
              padding: 24, border: `1px solid ${C.border}`,
              maxWidth: 200,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.purple, letterSpacing: '0.1em', marginBottom: 12 }}>STEP {item.step}</div>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{item.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{item.title}</div>
              <div style={{ fontSize: 13, color: C.textSec, lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA footer ── */}
      <div style={{ background: C.purple, padding: '56px 48px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, color: 'white', marginBottom: 16, letterSpacing: -0.5 }}>
          Ready to move with less pain?
        </h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', marginBottom: 32 }}>
          Check if you're covered and start your personalized program today.
        </p>
        <button
          onClick={onNext}
          style={{
            background: C.yellow, color: 'white', border: 'none',
            borderRadius: 12, padding: '16px 40px', fontSize: 16, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          }}>
          Check my eligibility — it's free
        </button>
      </div>

    </div>
  )
}
