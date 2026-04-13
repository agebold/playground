import { C, PurpleButton } from './shared.jsx'

export default function FacebookAd({ onNext }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f0f2f5', overflowY: 'auto' }}>
      {/* Facebook top bar */}
      <div style={{ background: '#1877F2', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: 'white', fontSize: 22, fontWeight: 800, letterSpacing: -1 }}>f</span>
        <div style={{ display: 'flex', gap: 8 }}>
          {['🔍', '💬'].map((ic, i) => (
            <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{ic}</div>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div style={{ padding: '8px 0' }}>
        {/* Sponsored post */}
        <div style={{ background: C.white, marginBottom: 8 }}>
          {/* Post header */}
          <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: C.purple, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontSize: 16, fontWeight: 700 }}>B</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Bold Health</div>
              <div style={{ fontSize: 12, color: C.textSec }}>Sponsored · <span style={{ fontSize: 11 }}>🌐</span></div>
            </div>
            <span style={{ fontSize: 18, color: C.textTert }}>···</span>
          </div>

          {/* Post copy */}
          <div style={{ padding: '0 16px 12px' }}>
            <p style={{ fontSize: 14, color: C.text, lineHeight: 1.5 }}>
              <strong>Living with knee or hip pain?</strong> MSK ACCESS is a free, clinically-backed exercise program designed specifically for people with musculoskeletal conditions — covered by your MSK health plan. 💪
            </p>
            <p style={{ fontSize: 14, color: '#1877F2', marginTop: 6 }}>#MSKHealth #JointPain #PhysicalTherapy</p>
          </div>

          {/* Ad image */}
          <div style={{
            height: 220,
            background: `linear-gradient(135deg, ${C.purple} 0%, #7c3aed 100%)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            padding: 24,
          }}>
            <div style={{ fontSize: 40 }}>🦵</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'white', letterSpacing: -0.5 }}>MSK ACCESS</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 4 }}>A personalized exercise program for your joints</div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 8,
              padding: '6px 16px',
              marginTop: 4,
            }}>
              <span style={{ color: 'white', fontSize: 12, fontWeight: 600 }}>Free through your health plan</span>
            </div>
          </div>

          {/* CTA section */}
          <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>MSK ACCESS Program</div>
              <div style={{ fontSize: 12, color: C.textSec }}>getbold.com · Learn more</div>
            </div>
            <button
              onClick={onNext}
              style={{
                background: '#e4e6eb',
                border: 'none',
                borderRadius: 6,
                padding: '7px 16px',
                fontSize: 13,
                fontWeight: 600,
                color: C.text,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                whiteSpace: 'nowrap',
              }}>
              Learn more
            </button>
          </div>

          {/* Reactions row */}
          <div style={{ padding: '8px 16px', display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <span style={{ fontSize: 14 }}>👍</span>
              <span style={{ fontSize: 12, color: C.textSec }}>Sarah M. and 248 others</span>
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <span style={{ fontSize: 12, color: C.textSec }}>47 comments</span>
              <span style={{ fontSize: 12, color: C.textSec }}>12 shares</span>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ borderTop: `1px solid ${C.border}`, padding: '4px 8px', display: 'flex' }}>
            {['👍 Like', '💬 Comment', '↗ Share'].map((action, i) => (
              <button key={i} style={{
                flex: 1, border: 'none', background: 'none',
                padding: '8px 0', fontSize: 13, fontWeight: 500, color: C.textSec,
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              }}>{action}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
