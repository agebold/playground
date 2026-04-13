import { C, SafariBottomBar } from './shared.jsx'

export default function ClassTaking({ onNext }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#000' }}>
      {/* Top controls */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px', flexShrink: 0,
      }}>
        <button onClick={onNext} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', fontSize: 20 }}>×</button>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          {/* CC */}
          <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
            <rect x="0.5" y="0.5" width="21" height="15" rx="2.5" stroke="white" strokeOpacity="0.7"/>
            <text x="3" y="12" fill="white" fontSize="8" fontFamily="Inter" opacity="0.7">CC</text>
          </svg>
          {/* AirPlay */}
          <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
            <path d="M2 12V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8" stroke="white" strokeOpacity="0.7" strokeWidth="1.3"/>
            <path d="M6 17l4-5 4 5H6Z" fill="white" opacity="0.7"/>
          </svg>
          {/* Volume */}
          <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
            <path d="M2 6.5h4l5-5v15l-5-5H2v-5Z" fill="white" opacity="0.7"/>
            <path d="M14 3.5a7 7 0 0 1 0 11M16.5 1a11 11 0 0 1 0 16" stroke="white" strokeOpacity="0.7" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* Video area */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        {/* Trainer placeholder */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 8 }}>🧑‍💼</div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>19 min Strength: Upper Body Basics</div>
        </div>

        {/* Skip back */}
        <div style={{ position: 'absolute', left: '22%', top: '50%', transform: 'translateY(-50%)', textAlign: 'center' }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M14 5l-7 5 7 5V5Z" fill="white" opacity="0.8"/>
              <path d="M6 5v10" stroke="white" strokeWidth="1.5" strokeOpacity="0.8"/>
            </svg>
          </div>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 4, display: 'block' }}>10</span>
        </div>

        {/* Play button */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}>
            <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
              <path d="M2 2l16 9L2 20V2Z" fill="white"/>
            </svg>
          </div>
        </div>

        {/* Skip forward */}
        <div style={{ position: 'absolute', right: '22%', top: '50%', transform: 'translateY(-50%)', textAlign: 'center' }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M6 5l7 5-7 5V5Z" fill="white" opacity="0.8"/>
              <path d="M14 5v10" stroke="white" strokeWidth="1.5" strokeOpacity="0.8"/>
            </svg>
          </div>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 4, display: 'block' }}>10</span>
        </div>

        {/* Options */}
        <div style={{ position: 'absolute', bottom: 16, right: 16 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}>
            <span style={{ color: 'white', fontSize: 14 }}>⋯</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ padding: '0 16px 8px', background: '#000', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', flexShrink: 0 }}>7:05</span>
          <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.3)', borderRadius: 2, position: 'relative' }}>
            <div style={{ height: '100%', width: '50%', background: 'white', borderRadius: 2 }}/>
            <div style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              width: 12, height: 12, borderRadius: '50%', background: '#f97316',
            }}/>
          </div>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', flexShrink: 0 }}>−7:10</span>
        </div>
      </div>

      <div
        onClick={onNext}
        style={{
          flexShrink: 0, background: 'rgba(255,255,255,0.1)',
          padding: '12px 16px', textAlign: 'center', cursor: 'pointer',
        }}>
        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Tap to finish class →</span>
      </div>

      <SafariBottomBar />
    </div>
  )
}
