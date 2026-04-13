import { C, AppHeader, SafariBottomBar, PurpleButton } from './shared.jsx'

export default function ClassDetails({ onNext }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      <AppHeader showUseApp streak={0} onUseApp={onNext} />

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Breadcrumb */}
        <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 6, borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 13, color: C.purple }}>Home</span>
          <span style={{ fontSize: 13, color: C.textTert }}>›</span>
          <span style={{ fontSize: 13, color: C.textSec }}>19 min Strength: Upper Body Basics</span>
        </div>

        {/* Video thumbnail */}
        <div style={{
          height: 200, background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="22" height="24" viewBox="0 0 22 24" fill="none">
              <path d="M2 2l18 10L2 22V2Z" fill="white"/>
            </svg>
          </div>
          <div style={{ position: 'absolute', top: 12, right: 12 }}>
            <button style={{
              background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: 8,
              padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}>
              <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
                <path d="M2 2h8v10l-4-3-4 3V2z" stroke={C.text} strokeWidth="1.2"/>
              </svg>
              <span style={{ fontSize: 12, fontWeight: 500 }}>Start class</span>
            </button>
          </div>
        </div>

        <div style={{ padding: '16px 16px 8px' }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 8, lineHeight: 1.2 }}>
            19 min Strength: Upper Body Basics
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{
              width: 20, height: 20, borderRadius: '50%', background: '#a78bfa',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11,
            }}>👤</div>
            <span style={{ fontSize: 14, color: C.textSec }}>Chris Litten</span>
            <span style={{ color: C.border }}>·</span>
            <span style={{ fontSize: 14, color: C.purple, fontWeight: 500 }}>Save class</span>
          </div>

          {/* Why this class */}
          <div style={{
            background: '#eef0ff', borderRadius: 12, padding: '12px 14px', marginBottom: 16,
            display: 'flex', gap: 10,
          }}>
            <div style={{
              width: 26, height: 26, borderRadius: '50%', background: '#a78bfa',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0,
            }}>
              <span style={{ color: 'white' }}>👩</span>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 4 }}>
                From trainer Amanda
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 4 }}>Why this class</div>
              <ul style={{ margin: 0, paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <li style={{ fontSize: 13, color: C.textSec, lineHeight: 1.5 }}>Chris specializes in strength and conditioning for joint health.</li>
                <li style={{ fontSize: 13, color: C.textSec, lineHeight: 1.5 }}>Exercises performed while seated for a safe and effective workout.</li>
              </ul>
            </div>
          </div>

          {/* Change class */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7a5 5 0 1 0 10 0A5 5 0 0 0 2 7z" stroke={C.textSec} strokeWidth="1.2"/>
              <path d="M9 7H5M7 5l2 2-2 2" stroke={C.textSec} strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize: 13, color: C.textSec }}>
              Not feeling this today?{' '}
              <span style={{ color: C.purple, fontWeight: 500 }}>Change class</span>
            </span>
          </div>
        </div>
      </div>

      <div style={{ flexShrink: 0, padding: '12px 16px 8px', borderTop: `1px solid ${C.border}` }}>
        <PurpleButton onClick={onNext}>Start class</PurpleButton>
      </div>
      <SafariBottomBar />
    </div>
  )
}
