import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { navigationStructure } from '../data/navigationStructure.js'
import { C } from './content/shared.jsx'

export default function Sidebar({ activeStep, onSelect }) {
  const [collapsed, setCollapsed] = useState({})
  const toggle = (id) => setCollapsed(p => ({ ...p, [id]: !p[id] }))

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
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>MSK</div>
          <div style={{ fontSize: 11, color: C.textTert }}>Patient journey</div>
        </div>
      </div>

      {/* Nav items */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
        {navigationStructure.map(section => {
          const isCollapsed = !!collapsed[section.id]
          return (
            <div key={section.id} style={{ marginBottom: 4 }}>
              <div
                onClick={() => toggle(section.id)}
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: C.textTert,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '8px 20px 4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  userSelect: 'none',
                }}
              >
                {section.category}
                <motion.svg
                  animate={{ rotate: isCollapsed ? -90 : 0 }}
                  transition={{ duration: 0.18 }}
                  width="10" height="6" viewBox="0 0 10 6" fill="none"
                  style={{ opacity: 0.45, flexShrink: 0 }}
                >
                  <path d="M1 1l4 4 4-4" stroke={C.textTert} strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </motion.svg>
              </div>
              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div style={{
        padding: '12px 20px',
        borderTop: `1px solid ${C.border}`,
        fontSize: 11,
        color: C.textTert,
        textAlign: 'center',
      }}>
        Age Bold · ACCESS Prototype
      </div>
    </div>
  )
}
