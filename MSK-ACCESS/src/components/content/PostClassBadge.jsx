import { C, AppHeader, AppNavBar, SafariBottomBar, YellowButton } from './shared.jsx'

export default function PostClassBadge({ onNext }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.bg }}>
      <AppHeader streak={0} />

      <div style={{ flex: 1, overflowY: 'auto', background: C.bg }}>
        {/* Completed class row */}
        <div style={{
          background: C.white, padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: 12,
          borderBottom: `1px solid ${C.border}`,
        }}>
          <div style={{
            width: 60, height: 44, borderRadius: 8, overflow: 'hidden',
            background: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: 18, height: 18, borderRadius: '50%',
                background: C.purple,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>19 min Strength: Upper Body Basics</div>
            <div style={{ fontSize: 13, color: C.textSec }}>Chris Litten</div>
          </div>
        </div>

        {/* Badge + copy */}
        <div style={{ padding: '32px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          {/* Badge */}
          <div style={{
            width: 140, height: 140,
            borderRadius: '50%',
            background: '#e8edff',
            border: '4px solid #5b7be3',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16,
            boxShadow: '0 4px 20px rgba(91,123,227,0.3)',
          }}>
            {/* Laurels + text */}
            <div style={{ fontSize: 11, fontWeight: 700, color: '#3b5bbf', letterSpacing: '0.1em', marginBottom: 2 }}>🏆</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#1e3a8a', letterSpacing: 1 }}>1st</div>
            <div style={{ fontSize: 28 }}>🤜🤛</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#3b5bbf', letterSpacing: '0.1em' }}>CLASS</div>
          </div>

          <div style={{ fontSize: 13, color: C.textSec, marginBottom: 12 }}>July 17, 2025</div>

          <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 10, lineHeight: 1.3, maxWidth: 300 }}>
            You took your first Bold class and began a Streak!
          </h2>

          <p style={{ fontSize: 14, color: C.textSec, lineHeight: 1.6, maxWidth: 300, marginBottom: 32 }}>
            Take a class each week to build a Streak, miss a week and your Streak resets.
          </p>

          <YellowButton onClick={onNext}>Continue</YellowButton>
        </div>
      </div>

      <SafariBottomBar />
    </div>
  )
}
