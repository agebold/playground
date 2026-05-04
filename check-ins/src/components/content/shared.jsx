import boldLogomark from '../../assets/bold-logomark.png'
import boldLogo from '../../assets/bold-logo@2x.png'

// ─── Design tokens ───────────────────────────────────────────────────────────
export const C = {
  purple:      '#5200d4',
  purpleLight: '#ede9ff',
  bg:          '#f2f2f7',
  white:       '#ffffff',
  border:      '#e5e5ea',
  text:        '#1c1c1e',
  textSec:     '#3c3c43',
  textTert:    '#8e8e93',
  yellow:      '#FFCC1A',
  teal:        '#34c759',
  red:         '#ff3b30',
  blue:        '#007aff',
}

// ─── Bold logomark ────────────────────────────────────────────────────────────
export function BoldLogo({ height = 28 }) {
  return <img src={boldLogomark} alt="Bold" style={{ height, width: 'auto' }} />
}

// ─── Bold wordmark ────────────────────────────────────────────────────────────
export function BoldWordmark({ height = 28 }) {
  return <img src={boldLogo} alt="Bold" style={{ height, width: 'auto' }} />
}

// ─── Safari bottom chrome ─────────────────────────────────────────────────────
export function SafariBottomBar({ url = 'agebold.com' }) {
  return (
    <div style={{
      flexShrink: 0,
      background: '#f9f9f9',
      borderTop: '1px solid #d1d1d6',
      padding: '8px 12px 4px',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: '#e5e5ea', borderRadius: 16,
        padding: '6px 12px', marginBottom: 10,
      }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <span style={{ fontSize: 14, color: C.textSec }}>{url}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Phone frame ─────────────────────────────────────────────────────────────
export function PhoneFrame({ children, statusBarBg, homeIndicatorBg, showSafariBar = true }) {
  return (
    <div style={{
      width: 390,
      height: 844,
      background: C.white,
      borderRadius: 44,
      overflow: 'hidden',
      border: '1.5px solid #d0d0d5',
      boxShadow: '0 8px 40px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      flexShrink: 0,
    }}>
      <div style={{
        height: 44, flexShrink: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 36px 0px 36px', background: statusBarBg ?? C.white,
      }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: C.white }}>
        {children}
      </div>
      {showSafariBar && <SafariBottomBar />}
      <div style={{ height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', background: homeIndicatorBg ?? '#f9f9f9', flexShrink: 0 }}>
        <div style={{ width: 134, height: 5, background: '#000', borderRadius: 3, opacity: 1 }} />
      </div>
    </div>
  )
}

// ─── Onboarding header ────────────────────────────────────────────────────────
export function OnboardingHeader({ showBack = true, progress, totalSteps, onBack }) {
  return (
    <div style={{ flexShrink: 0 }}>
      <div style={{
        display: 'flex', alignItems: 'center',
        padding: '12px 16px 10px',
        gap: 12,
        minHeight: 56,
      }}>
        {showBack ? (
          <button
            onClick={onBack}
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: C.bg, border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
            <svg width="9" height="15" viewBox="0 0 9 15" fill="none">
              <path d="M8 1L1 7.5L8 14" stroke={C.text} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ) : (
          <div style={{ width: 36, height: 36 }} />
        )}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <BoldWordmark height={26} />
        </div>
        <div style={{ width: 36 }} />
      </div>
      {progress !== undefined && (
        <div style={{ height: 3, background: C.bg }}>
          <div style={{
            height: '100%', background: C.purple,
            width: `${(progress / (totalSteps || 10)) * 100}%`,
            transition: 'width 0.3s ease',
          }}/>
        </div>
      )}
    </div>
  )
}

// ─── Onboarding screen wrapper ────────────────────────────────────────────────
export function OnboardingScreen({ children, cta, noPadding = false }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: noPadding ? 0 : '20px 16px' }}>
        {children}
      </div>
      {cta && (
        <div style={{ flexShrink: 0, padding: '12px 16px 8px', background: C.white }}>
          {cta}
        </div>
      )}
    </div>
  )
}

// ─── Purple CTA button ────────────────────────────────────────────────────────
export function PurpleButton({ children, onClick, disabled = false, style = {} }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%', padding: '15px 24px',
        background: disabled ? '#c7c7cc' : C.purple,
        color: C.white, border: 'none', borderRadius: 14,
        fontSize: 16, fontWeight: 600, cursor: disabled ? 'default' : 'pointer',
        fontFamily: 'Inter, sans-serif',
        ...style,
      }}>
      {children}
    </button>
  )
}

// ─── Safari browser chrome (for desktop) ─────────────────────────────────────
export function SafariBrowserChrome({ children, url = 'https://agebold.com' }) {
  return (
    <div style={{
      background: '#f0f0f0', borderRadius: 12, overflow: 'hidden',
      border: '1px solid #d0d0d0', boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
      width: '100%', maxWidth: 900,
    }}>
      <div style={{
        background: '#e8e8e8', padding: '10px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: '1px solid #d0d0d0',
      }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['#FF5F57','#FEBC2E','#28C840'].map((c, i) => (
            <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c }}/>
          ))}
        </div>
        <div style={{
          flex: 1, background: C.white, borderRadius: 6, padding: '5px 12px',
          fontSize: 12, color: C.textSec, textAlign: 'center', border: '1px solid #d8d8d8',
          maxWidth: 400, margin: '0 auto',
        }}>{url}</div>
      </div>
      <div style={{ background: C.white, maxHeight: 600, overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  )
}
