import { C, AppTopBar, PurpleButton } from './shared.jsx'

export default function KoosOutro({ onNext }) {
  // Simulated score: 72/100 (higher = better)
  const score = 72
  const maxScore = 100

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      <AppTopBar title="KOOS JR complete" showBack={false} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 20px' }}>
        {/* Score display */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="58" fill="none" stroke={C.border} strokeWidth="8" />
              <circle cx="70" cy="70" r="58" fill="none" stroke={C.purple} strokeWidth="8"
                strokeDasharray={`${(score / maxScore) * 2 * Math.PI * 58} ${(1 - score / maxScore) * 2 * Math.PI * 58}`}
                strokeLinecap="round" transform="rotate(-90 70 70)" />
            </svg>
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: C.purple }}>{score}</div>
              <div style={{ fontSize: 12, color: C.textSec }}>out of 100</div>
            </div>
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 800, color: C.text, textAlign: 'center', marginBottom: 6, letterSpacing: -0.3 }}>
            Your baseline score
          </h2>
          <p style={{ fontSize: 14, color: C.textSec, textAlign: 'center', lineHeight: 1.5, maxWidth: 280 }}>
            This is your starting point. We'll track how your score changes as you complete the program.
          </p>
        </div>

        {/* Score breakdown */}
        <div style={{
          background: C.bg, borderRadius: 14, border: `1px solid ${C.border}`, padding: 16, marginBottom: 20,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.textTert, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
            Score interpretation
          </div>
          {[
            { range: '0–44', label: 'Severe limitation', color: '#EF4444' },
            { range: '45–64', label: 'Moderate limitation', color: '#F97316' },
            { range: '65–79', label: 'Mild limitation', color: '#EAB308', current: true },
            { range: '80–100', label: 'Minimal limitation', color: '#22C55E' },
          ].map((band, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
              borderBottom: i < 3 ? `1px solid ${C.border}` : 'none',
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: band.color, flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: band.current ? 700 : 400, color: C.text, flex: 1 }}>
                {band.range} — {band.label}
              </span>
              {band.current && (
                <span style={{
                  fontSize: 11, fontWeight: 700, background: band.color + '25',
                  color: band.color, padding: '2px 8px', borderRadius: 20,
                }}>Your score</span>
              )}
            </div>
          ))}
        </div>

        {/* What's next */}
        <div style={{
          background: C.purpleLight, borderRadius: 12, padding: 16, marginBottom: 24,
          display: 'flex', gap: 10, alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>📈</span>
          <p style={{ fontSize: 13, color: C.purple, lineHeight: 1.5 }}>
            We'll ask you these questions again at <strong>4 weeks</strong> and <strong>8 weeks</strong> to measure your improvement.
          </p>
        </div>
      </div>

      <div style={{ padding: '12px 20px 8px', borderTop: `1px solid ${C.border}` }}>
        <PurpleButton onClick={onNext}>Continue →</PurpleButton>
      </div>
    </div>
  )
}
