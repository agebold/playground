// Design tokens
export const C = {
  purple: '#5200d4',
  purpleLight: '#ede9ff',
  bg: '#fafafa',
  white: '#ffffff',
  border: '#e5e5e5',
  text: '#171717',
  textSec: '#525252',
  textTert: '#a3a3a3',
  yellow: '#F5A500',
  teal: '#20C997',
  red: '#EF4444',
  green: '#22C55E',
}

// Bold logo mark SVG
export function BoldLogo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="28" height="28" rx="6" fill={C.purple} />
      <path d="M8 8h7.5a4.5 4.5 0 0 1 0 9H8V8Z" fill="white" />
      <path d="M8 17h8a4 4 0 0 1 0 8H8v-8Z" fill="white" opacity="0.7" />
    </svg>
  )
}

// Top nav bar for the Bold app
export function BoldNavBar({ activeTab = 'home' }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'classes', label: 'Classes', icon: ClassIcon },
    { id: 'progress', label: 'Progress', icon: ProgressIcon },
    { id: 'profile', label: 'Profile', icon: ProfileIcon },
  ]
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '8px 0 20px',
      background: C.white,
      borderTop: `1px solid ${C.border}`,
    }}>
      {tabs.map(tab => (
        <div key={tab.id} style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          cursor: 'pointer',
          minWidth: 60,
        }}>
          <tab.icon active={tab.id === activeTab} />
          <span style={{
            fontSize: 10,
            fontWeight: tab.id === activeTab ? 600 : 400,
            color: tab.id === activeTab ? C.purple : C.textTert,
          }}>{tab.label}</span>
          {tab.id === activeTab && (
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: C.purple, marginTop: -2 }} />
          )}
        </div>
      ))}
    </div>
  )
}

function HomeIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M3 9.5L11 3l8 6.5V19a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5Z"
        stroke={active ? C.purple : C.textTert} strokeWidth="1.5" fill={active ? C.purpleLight : 'none'} />
      <path d="M8 20v-7h6v7" stroke={active ? C.purple : C.textTert} strokeWidth="1.5" />
    </svg>
  )
}
function ClassIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="3" y="3" width="16" height="16" rx="3"
        stroke={active ? C.purple : C.textTert} strokeWidth="1.5" fill={active ? C.purpleLight : 'none'} />
      <path d="M8 11l2.5 2.5L14 8" stroke={active ? C.purple : C.textTert} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
function ProgressIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M4 16l4-5 4 3 4-7" stroke={active ? C.purple : C.textTert} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="18" cy="7" r="2" fill={active ? C.purple : C.textTert} />
    </svg>
  )
}
function ProfileIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="8" r="3.5" stroke={active ? C.purple : C.textTert} strokeWidth="1.5" fill={active ? C.purpleLight : 'none'} />
      <path d="M4 19c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke={active ? C.purple : C.textTert} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// Top status bar area for app screens
export function AppTopBar({ title = '', showBack = true, showUseApp = false, onNext }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 20px',
      background: C.white,
      borderBottom: `1px solid ${C.border}`,
      minHeight: 52,
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {showBack && (
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 5L7.5 10l5 5" stroke={C.text} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
        {!showBack && <BoldLogo size={28} />}
      </div>
      {title && (
        <span style={{ fontSize: 15, fontWeight: 600, color: C.text, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          {title}
        </span>
      )}
      {showUseApp && (
        <button
          onClick={onNext}
          style={{
            background: C.yellow,
            color: C.white,
            border: 'none',
            borderRadius: 20,
            padding: '6px 14px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
          }}>
          Use app
        </button>
      )}
    </div>
  )
}

// Wrapper for scrollable screen content with optional fixed bottom
export function ScreenWrapper({ children, bottomSlot, style = {} }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', ...style }}>
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {children}
      </div>
      {bottomSlot && (
        <div style={{ flexShrink: 0, padding: '12px 20px 8px', background: C.white, borderTop: `1px solid ${C.border}` }}>
          {bottomSlot}
        </div>
      )}
    </div>
  )
}

// Primary purple button
export function PurpleButton({ children, onClick, disabled = false, style = {} }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        padding: '15px 24px',
        background: disabled ? C.border : C.purple,
        color: disabled ? C.textTert : C.white,
        border: 'none',
        borderRadius: 12,
        fontSize: 16,
        fontWeight: 600,
        cursor: disabled ? 'default' : 'pointer',
        fontFamily: 'Inter, sans-serif',
        transition: 'background 0.2s',
        ...style,
      }}>
      {children}
    </button>
  )
}

// Radio card selection
export function RadioCard({ label, sublabel, selected, onSelect, icon }) {
  return (
    <div
      onClick={onSelect}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 16px',
        background: C.white,
        border: `2px solid ${selected ? C.purple : C.border}`,
        borderRadius: 12,
        cursor: 'pointer',
        marginBottom: 10,
      }}>
      {icon && <span style={{ fontSize: 20 }}>{icon}</span>}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 500, color: C.text }}>{label}</div>
        {sublabel && <div style={{ fontSize: 13, color: C.textSec, marginTop: 2 }}>{sublabel}</div>}
      </div>
      <div style={{
        width: 20, height: 20, borderRadius: '50%',
        border: `2px solid ${selected ? C.purple : C.border}`,
        background: selected ? C.purple : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {selected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.white }} />}
      </div>
    </div>
  )
}

// Checkbox card selection
export function CheckboxCard({ label, sublabel, checked, onToggle, icon }) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 16px',
        background: C.white,
        border: `2px solid ${checked ? C.purple : C.border}`,
        borderRadius: 12,
        cursor: 'pointer',
        marginBottom: 10,
      }}>
      {icon && <span style={{ fontSize: 20 }}>{icon}</span>}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 500, color: C.text }}>{label}</div>
        {sublabel && <div style={{ fontSize: 13, color: C.textSec, marginTop: 2 }}>{sublabel}</div>}
      </div>
      <div style={{
        width: 20, height: 20, borderRadius: 5,
        border: `2px solid ${checked ? C.purple : C.border}`,
        background: checked ? C.purple : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {checked && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </div>
  )
}

// Safari-style browser chrome for desktop views
export function SafariBrowserChrome({ children, url = 'https://accessprogram.msk.org' }) {
  return (
    <div style={{
      background: '#f0f0f0',
      borderRadius: 12,
      overflow: 'hidden',
      border: '1px solid #d0d0d0',
      boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
      width: '100%',
      maxWidth: 900,
    }}>
      {/* Browser chrome */}
      <div style={{
        background: '#e8e8e8',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        borderBottom: '1px solid #d0d0d0',
      }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map((c, i) => (
            <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
          ))}
        </div>
        <div style={{
          flex: 1, background: C.white, borderRadius: 6, padding: '5px 12px',
          fontSize: 12, color: C.textSec, textAlign: 'center', border: '1px solid #d8d8d8',
          maxWidth: 400, margin: '0 auto',
        }}>
          {url}
        </div>
      </div>
      <div style={{ background: C.white, maxHeight: 600, overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  )
}

// iPhone frame wrapper for mobile views
export function PhoneFrame({ children }) {
  return (
    <div style={{
      width: 390,
      height: 844,
      background: C.white,
      borderRadius: 44,
      overflow: 'hidden',
      border: '8px solid #1a1a1a',
      boxShadow: '0 0 0 2px #3a3a3a, 0 24px 60px rgba(0,0,0,0.3)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      flexShrink: 0,
    }}>
      {/* Notch */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 120, height: 34, background: '#1a1a1a', borderRadius: '0 0 20px 20px',
        zIndex: 10,
      }} />
      {/* Status bar space */}
      <div style={{ height: 44, flexShrink: 0 }} />
      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {children}
      </div>
      {/* Home indicator */}
      <div style={{ padding: '8px 0 12px', display: 'flex', justifyContent: 'center', background: C.white, flexShrink: 0 }}>
        <div style={{ width: 120, height: 5, background: '#1a1a1a', borderRadius: 3 }} />
      </div>
    </div>
  )
}

// Progress bar for onboarding
export function OnboardingProgress({ current, total }) {
  return (
    <div style={{ display: 'flex', gap: 4, padding: '12px 20px 0' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          flex: 1, height: 3, borderRadius: 2,
          background: i < current ? C.purple : C.border,
        }} />
      ))}
    </div>
  )
}

// Section label
export function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 600, color: C.textTert, letterSpacing: '0.08em',
      textTransform: 'uppercase', marginBottom: 8,
    }}>
      {children}
    </div>
  )
}

// Tag/chip
export function Tag({ children, color = C.purpleLight, textColor = C.purple }) {
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: 20,
      background: color, color: textColor, fontSize: 12, fontWeight: 500,
    }}>
      {children}
    </span>
  )
}
