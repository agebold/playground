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
  yellow:      '#f5a623',
  teal:        '#34c759',
  red:         '#ff3b30',
  blue:        '#007aff',
}

// ─── Bold logomark (two diagonal stripes) ────────────────────────────────────
export function BoldLogo({ height = 28 }) {
  const w = height * 0.85
  return (
    <svg width={w} height={height} viewBox="0 0 34 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bold-g1" x1="0" y1="0" x2="34" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4fc3f7"/>
          <stop offset="100%" stopColor="#7c3aed"/>
        </linearGradient>
        <linearGradient id="bold-g2" x1="0" y1="0" x2="34" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#29b6f6"/>
          <stop offset="100%" stopColor="#6d28d9"/>
        </linearGradient>
      </defs>
      {/* Upper stripe */}
      <path d="M0 10 L26 0 L34 6 L8 16 Z" fill="url(#bold-g1)"/>
      {/* Lower stripe */}
      <path d="M0 24 L26 14 L34 20 L8 30 Z" fill="url(#bold-g2)"/>
    </svg>
  )
}

// ─── Bold wordmark (stripes + BOLD text) ─────────────────────────────────────
export function BoldWordmark({ height = 28 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
      <BoldLogo height={height} />
      <span style={{
        fontSize: height * 0.75,
        fontWeight: 800,
        color: C.text,
        letterSpacing: '-0.02em',
        fontFamily: 'Inter, sans-serif',
      }}>BOLD</span>
    </div>
  )
}

// ─── Safari bottom chrome (all mobile screens are mWeb) ──────────────────────
export function SafariBottomBar({ url = 'agebold.com' }) {
  return (
    <div style={{
      flexShrink: 0,
      background: '#f9f9f9',
      borderTop: '1px solid #d1d1d6',
      padding: '8px 12px 4px',
    }}>
      {/* URL bar row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: '#e5e5ea', borderRadius: 10,
        padding: '6px 10px', marginBottom: 10,
      }}>
        <span style={{ fontSize: 12, color: C.textSec, fontWeight: 500 }}>AA</span>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
            <path d="M5 1C3.34 1 2 2.34 2 4v1H1v6h8V5H9V4c0-1.66-1.34-3-4-3zm0 1c1.1 0 2 .9 2 2v1H3V4c0-1.1.9-2 2-2z" fill={C.textTert}/>
          </svg>
          <span style={{ fontSize: 12, color: C.textSec }}>{url}</span>
        </div>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 1v6M4 4l3-3 3 3M2 10h10" stroke={C.blue} strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      </div>
      {/* Nav buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 4px' }}>
        {['←', '→', '⬡', '⊡', '⧉'].map((icon, i) => (
          <span key={i} style={{ fontSize: i === 0 || i === 1 ? 18 : 16, color: i < 2 ? '#c7c7cc' : C.textSec, padding: '2px 8px' }}>
            {icon}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Phone frame ─────────────────────────────────────────────────────────────
export function PhoneFrame({ children }) {
  return (
    <div style={{
      width: 390,
      height: 844,
      background: C.white,
      borderRadius: 44,
      overflow: 'hidden',
      border: '8px solid #1c1c1e',
      boxShadow: '0 0 0 2px #3a3a3c, 0 24px 60px rgba(0,0,0,0.35)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      flexShrink: 0,
    }}>
      {/* Notch */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 120, height: 32, background: '#1c1c1e',
        borderRadius: '0 0 20px 20px', zIndex: 10,
      }}/>
      {/* Status bar */}
      <div style={{
        height: 44, flexShrink: 0, display: 'flex',
        alignItems: 'flex-end', justifyContent: 'space-between',
        padding: '0 24px 6px', background: C.white,
      }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>9:41</span>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          <svg width="17" height="12" viewBox="0 0 17 12" fill={C.text}><rect x="0" y="3" width="3" height="9" rx="1"/><rect x="4.5" y="2" width="3" height="10" rx="1"/><rect x="9" y="0" width="3" height="12" rx="1"/><rect x="13.5" y="0" width="3" height="12" rx="1" opacity="0.3"/></svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill={C.text}><path d="M8 2.4C5.6 2.4 3.5 3.4 2 5L0 3C2.1 1.1 4.9 0 8 0s5.9 1.1 8 3l-2 2C12.5 3.4 10.4 2.4 8 2.4z"/><path d="M8 6c-1.4 0-2.7.6-3.6 1.5L2.5 5.6C3.9 4.3 5.9 3.5 8 3.5s4.1.8 5.5 2.1L11.6 7.5C10.7 6.6 9.4 6 8 6z"/><circle cx="8" cy="11" r="1.5"/></svg>
          <svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke={C.text} strokeOpacity="0.35"/><rect x="1" y="1" width="17" height="10" rx="3" fill={C.text}/><path d="M23 4v4a2 2 0 0 0 0-4z" fill={C.text} fillOpacity="0.4"/></svg>
        </div>
      </div>
      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: C.white }}>
        {children}
      </div>
    </div>
  )
}

// ─── Onboarding header (back + Bold wordmark + optional progress) ─────────────
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
      {/* Progress bar */}
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

// ─── App header (Day 1, Day 2, post-class screens) ───────────────────────────
export function AppHeader({ showUseApp = false, streak, initials = 'CS', onUseApp }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      padding: '10px 16px',
      gap: 8,
      flexShrink: 0,
      borderBottom: `1px solid ${C.border}`,
      background: C.white,
    }}>
      <BoldLogo height={28} />
      <div style={{ flex: 1 }} />
      {showUseApp && (
        <button
          onClick={onUseApp}
          style={{
            background: C.yellow, color: C.white, border: 'none',
            borderRadius: 20, padding: '6px 14px',
            fontSize: 13, fontWeight: 700, cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
          }}>
          Use app
        </button>
      )}
      {streak !== undefined && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 3,
          background: C.bg, borderRadius: 20, padding: '5px 10px',
        }}>
          <span style={{ fontSize: 14 }}>🔥</span>
          {streak > 0 && <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{streak}</span>}
        </div>
      )}
      <div style={{
        width: 34, height: 34, borderRadius: '50%',
        background: C.purple,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: C.white, fontSize: 12, fontWeight: 700,
      }}>
        {initials}
      </div>
      <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
        <path d="M1 1l5 5 5-5" stroke={C.textSec} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </div>
  )
}

// ─── Onboarding screen wrapper (scrollable + fixed bottom) ───────────────────
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
      <SafariBottomBar />
    </div>
  )
}

// ─── App screen wrapper ───────────────────────────────────────────────────────
export function AppScreen({ children, bottomNav }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {children}
      </div>
      {bottomNav && <AppNavBar activeTab={bottomNav} />}
      <SafariBottomBar />
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

// ─── Outline button ───────────────────────────────────────────────────────────
export function OutlineButton({ children, onClick, style = {} }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', padding: '15px 24px',
        background: 'transparent',
        color: C.text, border: `1.5px solid ${C.border}`,
        borderRadius: 14, fontSize: 16, fontWeight: 500,
        cursor: 'pointer', fontFamily: 'Inter, sans-serif',
        marginTop: 8,
        ...style,
      }}>
      {children}
    </button>
  )
}

// ─── Yellow CTA button ────────────────────────────────────────────────────────
export function YellowButton({ children, onClick, style = {} }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', padding: '15px 24px',
        background: C.yellow, color: C.white,
        border: 'none', borderRadius: 14,
        fontSize: 16, fontWeight: 600, cursor: 'pointer',
        fontFamily: 'Inter, sans-serif',
        ...style,
      }}>
      {children}
    </button>
  )
}

// ─── Radio option (simple list item) ─────────────────────────────────────────
export function RadioOption({ label, selected, onSelect }) {
  return (
    <div
      onClick={onSelect}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 14px',
        background: C.white,
        border: `1.5px solid ${selected ? C.purple : C.border}`,
        borderRadius: 12, cursor: 'pointer', marginBottom: 8,
      }}>
      <div style={{
        width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
        border: `2px solid ${selected ? C.purple : '#c7c7cc'}`,
        background: selected ? C.purple : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {selected && <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.white }}/>}
      </div>
      <span style={{ fontSize: 15, color: C.text, fontWeight: selected ? 500 : 400 }}>{label}</span>
    </div>
  )
}

// ─── Checkbox option (simple list item) ──────────────────────────────────────
export function CheckboxOption({ label, checked, onToggle, sublabel }) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 12,
        padding: '14px 14px',
        background: C.white,
        border: `1.5px solid ${checked ? C.purple : C.border}`,
        borderRadius: 12, cursor: 'pointer', marginBottom: 8,
      }}>
      <div style={{
        width: 20, height: 20, borderRadius: 5, flexShrink: 0, marginTop: 1,
        border: `2px solid ${checked ? C.purple : '#c7c7cc'}`,
        background: checked ? C.purple : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {checked && (
          <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
            <path d="M1 4l3 3.5L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: 15, color: C.text, fontWeight: checked ? 500 : 400, lineHeight: 1.4, display: 'block' }}>{label}</span>
        {sublabel && <span style={{ fontSize: 13, color: C.textTert, display: 'block', marginTop: 2 }}>{sublabel}</span>}
      </div>
    </div>
  )
}

// ─── Question header ──────────────────────────────────────────────────────────
export function QuestionHeader({ questionNum, question, sublabel }) {
  return (
    <div style={{ marginBottom: 20 }}>
      {questionNum !== undefined && (
        <div style={{ fontSize: 13, fontWeight: 600, color: C.textSec, marginBottom: 6 }}>
          Question {questionNum}
        </div>
      )}
      <h2 style={{
        fontSize: 20, fontWeight: 700, color: C.text,
        lineHeight: 1.3, margin: 0,
      }}>
        {question}
      </h2>
      {sublabel && (
        <p style={{ fontSize: 14, color: C.textSec, marginTop: 6, lineHeight: 1.5 }}>
          {sublabel}
        </p>
      )}
    </div>
  )
}

// ─── App bottom nav ───────────────────────────────────────────────────────────
export function AppNavBar({ activeTab = 'today' }) {
  const tabs = [
    { id: 'today', label: 'Today', icon: TodayIcon },
    { id: 'live', label: 'Live', icon: LiveIcon },
    { id: 'explore', label: 'Explore', icon: ExploreIcon },
    { id: 'menu', label: 'Menu', icon: MenuIcon },
  ]
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-around',
      padding: '10px 0 6px',
      background: C.white, borderTop: `1px solid ${C.border}`,
      flexShrink: 0,
    }}>
      {tabs.map(tab => (
        <div key={tab.id} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          minWidth: 60, cursor: 'pointer',
        }}>
          <tab.icon active={tab.id === activeTab} />
          <span style={{
            fontSize: 10, fontWeight: tab.id === activeTab ? 600 : 400,
            color: tab.id === activeTab ? C.purple : C.textTert,
          }}>{tab.label}</span>
        </div>
      ))}
    </div>
  )
}

function TodayIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M3 9.5L11 3l8 6.5V19a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5Z"
        fill={active ? C.purpleLight : 'none'} stroke={active ? C.purple : C.textTert} strokeWidth="1.5"/>
      <path d="M8 20v-6h6v6" stroke={active ? C.purple : C.textTert} strokeWidth="1.5"/>
    </svg>
  )
}
function LiveIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="8" stroke={active ? C.purple : C.textTert} strokeWidth="1.5" fill={active ? C.purpleLight : 'none'}/>
      <path d="M9 8l6 3-6 3V8Z" fill={active ? C.purple : C.textTert}/>
    </svg>
  )
}
function ExploreIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="8" stroke={active ? C.purple : C.textTert} strokeWidth="1.5" fill={active ? C.purpleLight : 'none'}/>
      <path d="M7 15l3-6 6-3-3 6-6 3Z" stroke={active ? C.purple : C.textTert} strokeWidth="1.3"/>
    </svg>
  )
}
function MenuIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M4 7h14M4 11h14M4 15h14" stroke={active ? C.purple : C.textTert} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

// ─── Trainer tip card ─────────────────────────────────────────────────────────
export function TrainerTip({ name = 'Amanda', children }) {
  return (
    <div style={{
      background: '#eef0ff', borderRadius: 12, padding: '12px 14px',
      display: 'flex', gap: 10, alignItems: 'flex-start',
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%',
        background: `linear-gradient(135deg, #a78bfa, #7c3aed)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, flexShrink: 0,
      }}>
        <span>👩</span>
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 3 }}>
          {name === 'Amanda' ? 'A Tip from Amanda' : `Trainer Tip from ${name}`}
        </div>
        <div style={{ fontSize: 13, color: C.textSec, lineHeight: 1.5 }}>{children}</div>
      </div>
    </div>
  )
}

// ─── Why this class card ──────────────────────────────────────────────────────
export function WhyThisClass({ children }) {
  return (
    <div style={{
      background: '#eef0ff', borderRadius: 12, padding: '12px 14px',
      display: 'flex', gap: 10, alignItems: 'flex-start',
      marginTop: 10,
    }}>
      <div style={{
        width: 26, height: 26, borderRadius: '50%',
        background: '#a78bfa',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, flexShrink: 0,
      }}>
        <span style={{ color: 'white' }}>👩</span>
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 4 }}>Why this class</div>
        <div style={{ fontSize: 13, color: C.textSec, lineHeight: 1.5 }}>{children}</div>
      </div>
    </div>
  )
}

// ─── Class card (for Day 1, Day 2) ───────────────────────────────────────────
export function ClassCard({ title, instructor, thumbnail, onStart, onChangeClass, whyText }) {
  return (
    <div style={{ marginBottom: 8 }}>
      {/* Thumbnail */}
      <div style={{
        height: 180, background: '#1c1c1e', borderRadius: '12px 12px 0 0',
        overflow: 'hidden', position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {thumbnail ? (
          <img src={thumbnail} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
        ) : (
          <div style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          }}/>
        )}
        {/* Save button */}
        <div style={{
          position: 'absolute', top: 10, right: 10,
          background: 'rgba(255,255,255,0.9)', borderRadius: 8,
          padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
            <path d="M2 2h8v10l-4-3-4 3V2z" stroke={C.text} strokeWidth="1.2"/>
          </svg>
          <span style={{ fontSize: 12, fontWeight: 500, color: C.text }}>Save</span>
        </div>
        {/* Move class label */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'rgba(0,0,0,0.5)', padding: '6px 12px',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="5" stroke="white" strokeWidth="1"/>
            <path d="M6 3v3l2 1" stroke="white" strokeWidth="1" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize: 11, color: 'white', fontWeight: 500 }}>Move class</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="5" stroke="white" strokeWidth="1"/>
            <path d="M5.5 4.5h1v1h-1zM5.5 6.5h1v2h-1z" fill="white"/>
          </svg>
        </div>
      </div>
      {/* Card body */}
      <div style={{
        background: C.white, borderRadius: '0 0 12px 12px',
        border: `1px solid ${C.border}`, borderTop: 'none', padding: '12px 14px',
      }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 4 }}>{title}</div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, color: C.textSec, fontSize: 13,
        }}>
          <div style={{
            width: 20, height: 20, borderRadius: '50%', background: '#a78bfa',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10,
          }}>
            <span>👤</span>
          </div>
          <span>{instructor}</span>
          {onChangeClass && (
            <>
              <span>·</span>
              <button
                onClick={onChangeClass}
                style={{ background: 'none', border: 'none', padding: 0, fontSize: 13, color: C.purple, cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                Save class
              </button>
            </>
          )}
        </div>
        {whyText && <WhyThisClass>{whyText}</WhyThisClass>}
        <PurpleButton onClick={onStart} style={{ marginTop: 12 }}>Start class</PurpleButton>
        <div style={{ textAlign: 'center', marginTop: 10 }}>
          <button style={{
            background: 'none', border: 'none', padding: 0, fontSize: 13, color: C.textSec,
            cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            display: 'flex', alignItems: 'center', gap: 4, margin: '0 auto',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7a5 5 0 1 0 10 0A5 5 0 0 0 2 7z" stroke={C.textSec} strokeWidth="1.2"/>
              <path d="M9 7H5M7 5l2 2-2 2" stroke={C.textSec} strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            Not feeling this today? <span style={{ color: C.purple, fontWeight: 500 }}>Change class</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Trainer hero (for Day 1, Day 2) ─────────────────────────────────────────
export function TrainerHero({ date, greeting, subtext, children }) {
  return (
    <div style={{ padding: '16px 16px 12px', textAlign: 'center' }}>
      {/* Trainer avatar */}
      <div style={{
        width: 72, height: 72, borderRadius: '50%', margin: '0 auto 10px',
        background: 'linear-gradient(135deg, #c4b5fd, #7c3aed)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 32, border: '3px solid white',
        boxShadow: '0 2px 12px rgba(124,58,237,0.3)',
      }}>
        👩‍💼
      </div>
      <div style={{ fontSize: 13, color: C.textSec, marginBottom: 4 }}>{date}</div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, margin: '0 0 6px', letterSpacing: -0.3 }}>
        {greeting}
      </h2>
      <p style={{ fontSize: 14, color: C.textSec, lineHeight: 1.5, marginBottom: 10 }}>{subtext}</p>
      {children}
      <button style={{
        background: 'none', border: '1px solid #c7c7cc', borderRadius: 20,
        padding: '6px 14px', fontSize: 13, color: C.textSec,
        cursor: 'pointer', fontFamily: 'Inter, sans-serif',
        display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 8,
      }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <rect x="1" y="2" width="10" height="9" rx="1" stroke={C.textSec} strokeWidth="1"/>
          <path d="M4 1v2M8 1v2M1 5h10" stroke={C.textSec} strokeWidth="1"/>
        </svg>
        Plan summary
      </button>
    </div>
  )
}

// ─── Completed / Up next items ────────────────────────────────────────────────
export function TaskRow({ status, label, info = false }) {
  const isDone = status === 'done'
  const isNext = status === 'next'
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0',
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
        background: isDone ? C.purple : 'transparent',
        border: `2px solid ${isDone ? C.purple : isNext ? C.purple : C.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {isDone ? (
          <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
            <path d="M1 5l3.5 3.5L12 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : isNext ? (
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.purple }}/>
        ) : null}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: C.textTert, fontWeight: 500, marginBottom: 1 }}>
          {isDone ? 'Completed' : 'Up next'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{label}</span>
          {info && (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" stroke={C.textTert} strokeWidth="1"/>
              <path d="M7 6.5v3M7 5h.01" stroke={C.textTert} strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Section divider ──────────────────────────────────────────────────────────
export function Divider() {
  return <div style={{ height: 1, background: C.border, margin: '4px 0' }} />
}

// ─── Legacy aliases (for backwards compat) ───────────────────────────────────
export const ScreenWrapper = ({ children, bottomSlot }) => (
  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
    <div style={{ flex: 1, overflowY: 'auto' }}>{children}</div>
    {bottomSlot && (
      <div style={{ flexShrink: 0, padding: '12px 16px 8px', borderTop: `1px solid ${C.border}`, background: C.white }}>
        {bottomSlot}
      </div>
    )}
  </div>
)
export const RadioCard = RadioOption
export const CheckboxCard = CheckboxOption
export const BoldNavBar = AppNavBar
export const AppTopBar = AppHeader
export const Tag = ({ children, color, textColor }) => (
  <span style={{
    display: 'inline-block', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600,
    background: color || C.purpleLight, color: textColor || C.purple,
  }}>{children}</span>
)
export const OnboardingProgress = ({ current, total }) => (
  <div style={{ height: 3, background: C.bg }}>
    <div style={{ height: '100%', background: C.purple, width: `${(current / total) * 100}%` }}/>
  </div>
)
export const SectionLabel = ({ children }) => (
  <div style={{ fontSize: 11, fontWeight: 700, color: C.textTert, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>{children}</div>
)

// ─── Safari browser chrome (for desktop) ─────────────────────────────────────
export function SafariBrowserChrome({ children, url = 'https://accessprogram.bold.com' }) {
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
