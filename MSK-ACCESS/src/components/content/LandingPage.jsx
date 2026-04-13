import { C, PurpleButton } from './shared.jsx'

export default function LandingPage({ onNext }) {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', color: C.text }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 48px', borderBottom: `1px solid ${C.border}`, background: C.white,
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: C.purple, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontWeight: 800, fontSize: 14 }}>B</span>
          </div>
          <div>
            <span style={{ fontSize: 16, fontWeight: 700, color: C.text }}>Bold</span>
            <span style={{ fontSize: 12, color: C.textSec, marginLeft: 8 }}>ACCESS Program</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {['How it works', 'What to expect', 'FAQs'].map(link => (
            <a key={link} style={{ fontSize: 14, color: C.textSec, textDecoration: 'none', cursor: 'pointer' }}>{link}</a>
          ))}
          <button
            onClick={onNext}
            style={{
              background: C.purple, color: 'white', border: 'none',
              borderRadius: 8, padding: '9px 20px', fontSize: 14, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            }}>
            Check eligibility
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, #f5f0ff 0%, #ede9ff 100%)`,
        padding: '72px 48px',
        display: 'flex',
        gap: 48,
        alignItems: 'center',
      }}>
        <div style={{ flex: 1, maxWidth: 520 }}>
          <div style={{
            display: 'inline-block', background: C.purpleLight, color: C.purple,
            borderRadius: 20, padding: '4px 14px', fontSize: 12, fontWeight: 600,
            marginBottom: 20, letterSpacing: '0.05em', textTransform: 'uppercase',
          }}>
            Covered by your health plan
          </div>
          <h1 style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.1, letterSpacing: -1.5, marginBottom: 20, color: C.text }}>
            Move better.<br />
            <span style={{ color: C.purple }}>Live better.</span>
          </h1>
          <p style={{ fontSize: 18, color: C.textSec, lineHeight: 1.6, marginBottom: 32 }}>
            MSK ACCESS is a personalized exercise program for people living with knee and hip pain. Built by physical therapists, delivered through your phone — at no cost to you.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={onNext}
              style={{
                background: C.purple, color: 'white', border: 'none',
                borderRadius: 12, padding: '15px 32px', fontSize: 16, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              }}>
              Check my eligibility →
            </button>
            <button style={{
              background: 'transparent', color: C.purple,
              border: `2px solid ${C.purple}`,
              borderRadius: 12, padding: '15px 32px', fontSize: 16, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            }}>
              Learn how it works
            </button>
          </div>
          <p style={{ fontSize: 13, color: C.textTert, marginTop: 16 }}>No credit card required · Takes 2 minutes</p>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <div style={{
            width: 280, height: 380, background: `linear-gradient(160deg, ${C.purple}, #7c3aed)`,
            borderRadius: 24, display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 16, padding: 24, boxShadow: '0 20px 60px rgba(82,0,212,0.3)',
          }}>
            <div style={{ fontSize: 56 }}>🏃</div>
            <div style={{ color: 'white', textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 700 }}>Your personalized plan</div>
              <div style={{ fontSize: 13, opacity: 0.8, marginTop: 6 }}>3 classes · 20 min each</div>
            </div>
            <div style={{ width: '100%', background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 12 }}>
              {['Low-impact cardio', 'Strength & stability', 'Flexibility'].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', color: 'white', fontSize: 13 }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>✓</div>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trust bar */}
      <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: '20px 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          {[
            { num: '50,000+', label: 'Members enrolled' },
            { num: '4.8★', label: 'Average rating' },
            { num: '85%', label: 'Report less pain' },
            { num: '0$', label: 'Cost to you' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: C.purple }}>{stat.num}</div>
              <div style={{ fontSize: 13, color: C.textSec }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ padding: '64px 48px', background: C.bg }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: 'center', marginBottom: 8, letterSpacing: -0.5 }}>How ACCESS works</h2>
        <p style={{ fontSize: 16, color: C.textSec, textAlign: 'center', marginBottom: 48 }}>From enrollment to feeling better in 4 simple steps.</p>
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

      {/* CTA footer */}
      <div style={{ background: C.purple, padding: '56px 48px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, color: 'white', marginBottom: 16, letterSpacing: -0.5 }}>Ready to move with less pain?</h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', marginBottom: 32 }}>Check if you're covered and start your personalized program today.</p>
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
