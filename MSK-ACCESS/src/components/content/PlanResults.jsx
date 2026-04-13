import { C, BoldLogo, PurpleButton, SafariBottomBar } from './shared.jsx'

const bullets = [
  { icon: '✓', bold: 'Goal:', text: 'Reduce lower back pain' },
  { icon: '✓', bold: 'First focus:', text: 'Build core stability and hip mobility through low-intensity seated exercises' },
  { icon: '✓', bold: 'Movements:', text: 'exercises strengthen surrounding muscles to support your lower back. All seated work, no floor movements required.' },
]

export default function PlanResults({ onNext }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', borderBottom: `1px solid ${C.border}`, flexShrink: 0,
      }}>
        <BoldLogo height={26} />
        <span style={{ fontSize: 14, fontWeight: 600, color: C.purple }}>Your results</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Photo collage */}
        <div style={{
          height: 180, background: '#2d2d2d',
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
          gap: 2, padding: 2,
        }}>
          {[
            '#4a5568', '#2d3748', '#1a202c',
            '#2d3748', '#374151', '#4b5563',
          ].map((bg, i) => (
            <div key={i} style={{
              background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20,
            }}>
              {['🧑‍💼','👩','👴','👵','🧍','👨'][i]}
            </div>
          ))}
        </div>

        <div style={{ padding: '20px 16px' }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 8, lineHeight: 1.2, letterSpacing: -0.3 }}>
            Your plan is ready, Carol
          </h2>
          <p style={{ fontSize: 14, color: C.textSec, marginBottom: 20, lineHeight: 1.5 }}>
            Simple clear daily actions that adapt to your feedback.
          </p>

          {bullets.map((b, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'flex-start' }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%', background: C.purple,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginTop: 1,
              }}>
                <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                  <path d="M1 4l3 3.5L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.5, margin: 0 }}>
                <strong>{b.bold}</strong> {b.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flexShrink: 0, padding: '12px 16px 8px', borderTop: `1px solid ${C.border}` }}>
        <PurpleButton onClick={onNext}>See today's plan</PurpleButton>
      </div>
      <SafariBottomBar />
    </div>
  )
}
