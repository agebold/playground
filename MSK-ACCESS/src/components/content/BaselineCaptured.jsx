import { C, BoldNavBar } from './shared.jsx'

export default function BaselineCaptured({ onNext }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 20px', textAlign: 'center' }}>

        {/* Success icon */}
        <div style={{
          width: 96, height: 96, borderRadius: 28,
          background: `linear-gradient(135deg, ${C.teal} 0%, #0ea5e9 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 48, marginBottom: 24,
          boxShadow: '0 12px 40px rgba(32,201,151,0.3)',
        }}>
          ✅
        </div>

        <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 10, letterSpacing: -0.5 }}>
          Baseline captured!
        </h2>
        <p style={{ fontSize: 16, color: C.textSec, lineHeight: 1.6, maxWidth: 300, marginBottom: 8 }}>
          Your health baseline has been recorded. We'll use this to track your progress.
        </p>

        {/* Milestones */}
        <div style={{ width: '100%', margin: '24px 0', position: 'relative' }}>
          <div style={{ position: 'absolute', left: 28, top: 24, bottom: 24, width: 2, background: C.border }} />
          {[
            { icon: '✅', label: 'Onboarding complete', sub: 'Pain profile, preferences, account', done: true },
            { icon: '✅', label: 'Day 1 done', sub: 'First class completed, goal set', done: true },
            { icon: '✅', label: 'Baseline captured', sub: 'KOOS JR score: 72/100', done: true },
            { icon: '📅', label: '4-week check-in', sub: 'Coming up on Nov 11', done: false },
            { icon: '🏆', label: 'Program complete', sub: '8 weeks from now', done: false },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', textAlign: 'left', position: 'relative' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                background: item.done ? C.teal : C.bg,
                border: `2px solid ${item.done ? C.teal : C.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, position: 'relative', zIndex: 1,
              }}>
                {item.icon}
              </div>
              <div style={{ paddingTop: 4 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: item.done ? C.text : C.textTert }}>{item.label}</div>
                <div style={{ fontSize: 12, color: C.textTert, marginTop: 1 }}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          background: `linear-gradient(135deg, ${C.purple}10 0%, ${C.teal}10 100%)`,
          border: `1px solid ${C.border}`, borderRadius: 14, padding: 16,
          marginBottom: 28, width: '100%',
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>You're all set, Jane! 🎉</div>
          <div style={{ fontSize: 13, color: C.textSec, lineHeight: 1.5 }}>
            Your personalized 8-week program is fully active. Keep showing up — 85% of members like you report less pain by week 4.
          </div>
        </div>

        <button
          onClick={onNext}
          style={{
            width: '100%', padding: '15px 24px',
            background: C.purple, color: 'white', border: 'none',
            borderRadius: 12, fontSize: 16, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          }}>
          Go to my home screen 🏠
        </button>
      </div>

      <BoldNavBar activeTab="home" />
    </div>
  )
}
