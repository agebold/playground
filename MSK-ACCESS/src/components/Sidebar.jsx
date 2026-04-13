import { navigationStructure } from '../data/navigationStructure.js'
import { C } from './content/shared.jsx'

export default function Sidebar({ activeStep, onSelect }) {
  return (
    <div style={{
      width: 260,
      flexShrink: 0,
      background: C.white,
      borderRight: `1px solid ${C.border}`,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{
        padding: '18px 20px',
        borderBottom: `1px solid ${C.border}`,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: C.purple,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: 800, fontSize: 14,
        }}>B</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>MSK ACCESS</div>
          <div style={{ fontSize: 11, color: C.textTert }}>Patient journey</div>
        </div>
      </div>

      {/* Nav items */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
        {navigationStructure.map(section => (
          <div key={section.id} style={{ marginBottom: 4 }}>
            <div style={{
              fontSize: 10,
              fontWeight: 700,
              color: C.textTert,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '8px 20px 4px',
            }}>
              {section.category}
            </div>
            {section.items.map(item => {
              const active = item.id === activeStep
              return (
                <div
                  key={item.id}
                  onClick={() => onSelect(item)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 20px',
                    cursor: 'pointer',
                    background: active ? C.purpleLight : 'transparent',
                    borderLeft: `3px solid ${active ? C.purple : 'transparent'}`,
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => {
                    if (!active) e.currentTarget.style.background = '#f9f9f9'
                  }}
                  onMouseLeave={e => {
                    if (!active) e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                    background: active ? C.purple : C.border,
                  }} />
                  <span style={{
                    fontSize: 13,
                    fontWeight: active ? 600 : 400,
                    color: active ? C.purple : C.textSec,
                    lineHeight: 1.3,
                  }}>
                    {item.label}
                  </span>
                  {item.viewType === 'desktop' && (
                    <span style={{
                      marginLeft: 'auto', fontSize: 10, color: C.textTert,
                      background: C.bg, border: `1px solid ${C.border}`,
                      borderRadius: 4, padding: '1px 5px',
                    }}>
                      web
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        padding: '12px 20px',
        borderTop: `1px solid ${C.border}`,
        fontSize: 11,
        color: C.textTert,
        textAlign: 'center',
      }}>
        Bold Health · ACCESS Prototype
      </div>
    </div>
  )
}
