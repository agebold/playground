import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { C } from './shared.jsx'
import boldLogomark from '../../assets/bold-logomark.png'
import amorphousBlob from '../../assets/amorphous-blob.png'
import imgTrainer from '../../assets/alicia_headshot.jpg'
import imgClassThumbnail from '../../assets/class-thumbnail.jpg'

const ease = [0.16, 1, 0.3, 1]
const slideUp = () => ({
  initial: { opacity: 0, y: 36 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
})

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="6.5" stroke="#2563eb" strokeWidth="1.2"/>
      <path d="M8 7.5v3M8 5.5h.01" stroke="#2563eb" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}

function RefreshIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M13.5 8A5.5 5.5 0 1 1 8 2.5a5.48 5.48 0 0 1 3.9 1.6L13.5 6" stroke="#525252" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13.5 2.5V6H10" stroke="#525252" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function Day1({ onNext }) {
  const [showAvatar,   setShowAvatar]   = useState(false)
  const [showGreeting, setShowGreeting] = useState(false)
  const [showIntro,    setShowIntro]    = useState(false)
  const [showSteps,    setShowSteps]    = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setShowAvatar(true),   300)
    const t2 = setTimeout(() => setShowGreeting(true), 1000)
    const t3 = setTimeout(() => setShowIntro(true),    1800)
    const t4 = setTimeout(() => setShowSteps(true),    2600)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [])

  const classCard = (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ position: 'relative', height: 148, overflow: 'hidden' }}>
        <img src={imgClassThumbnail} alt="Class" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(255,255,255,0.88)', borderRadius: 10, padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, color: '#070101', border: `1px solid ${C.border}` }}>
          <svg width="13" height="15" viewBox="0 0 13 15" fill="none">
            <path d="M2 2h9v11l-4.5-3L2 13V2Z" stroke="#070101" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Save
        </div>
      </div>
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {/* Move class badge + info icon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ background: '#ebf0ff', borderRadius: 4, padding: '3px 8px', display: 'inline-flex', alignItems: 'center' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#2563eb' }}>Move class</span>
            </div>
            <InfoIcon />
          </div>
          <div style={{ fontSize: 17, fontWeight: 600, color: '#140d26', lineHeight: '23px' }}>
            19 min Strength: Upper Body Basics
          </div>
          <div style={{ fontSize: 15, color: '#140d26' }}>Chris Litten</div>
        </div>
        {/* Why this class */}
        <div style={{ background: '#ebf0ff', borderRadius: 12, padding: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src={imgTrainer} alt="" style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center top' }} />
            <span style={{ fontSize: 15, fontWeight: 600, color: '#171717' }}>Why this class</span>
          </div>
          <p style={{ fontSize: 15, color: '#171717', lineHeight: '22px', margin: 0 }}>
            You mentioned knee comfort matters to you. This seated class is a great starting point.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
          <button
            onClick={onNext}
            style={{ width: '100%', padding: '12px 16px', background: C.purple, color: C.white, border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
          >
            Start class
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <RefreshIcon />
            <span style={{ fontSize: 13, color: '#525252' }}>
              Not feeling this today?{' '}
              <span style={{ color: C.purple, fontWeight: 600 }}>Change class</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', background: '#fafafa' }}>

      {/* App bar */}
      <div style={{
        background: C.white, borderBottom: `1px solid ${C.border}`,
        height: 52, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', boxShadow: '0px 1px 2px rgba(16,24,40,0.05)',
      }}>
        <img src={boldLogomark} alt="Bold" style={{ height: 32, width: 'auto' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button style={{
            background: C.yellow, border: 'none', borderRadius: 20,
            padding: '7px 14px', fontSize: 14, fontWeight: 600,
            color: '#000', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          }}>
            Use app
          </button>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: '#fff3e0', border: `1px solid ${C.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17,
          }}>
            🔥
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: C.purple, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white, fontSize: 13, fontWeight: 600 }}>CS</div>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 5l4 4 4-4" stroke="#8a8693" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>

        {/* Animated header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 16px 0' }}>
          <AnimatePresence>
            {showAvatar && (
              <motion.div {...slideUp()}
                style={{ position: 'relative', width: 220, height: 160, flexShrink: 0, overflow: 'visible' }}
              >
                <img src={amorphousBlob} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 96, height: 96, borderRadius: '50%', overflow: 'hidden', zIndex: 1 }}>
                  <img src={imgTrainer} alt="Trainer" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                </div>
                <div style={{ position: 'absolute', top: 'calc(50% + 34px)', left: 'calc(50% + 34px)', transform: 'translate(-50%, -50%)', zIndex: 2, width: 28, height: 28, borderRadius: '50%', background: C.white, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={boldLogomark} alt="Bold" style={{ width: 14, height: 'auto' }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showGreeting && (
              <motion.div {...slideUp()} style={{ textAlign: 'center', marginTop: 4 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#8a8693', lineHeight: '22px' }}>Wed, Jul 15th</div>
                <div style={{ fontSize: 28, fontWeight: 600, color: '#140d26', lineHeight: '34px', letterSpacing: '-0.8px' }}>
                  Welcome to Bold, Carol!
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showIntro && (
              <motion.div {...slideUp()} style={{ textAlign: 'center', padding: '8px 12px 0' }}>
                <p style={{ fontSize: 16, color: '#171717', lineHeight: '24px', margin: 0 }}>
                  I'm Alicia, your Bold trainer. Welcome to Bold — I'm excited to support you on this journey.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Steps */}
        <AnimatePresence>
          {showSteps && (
            <motion.div {...slideUp()}
              style={{ padding: '24px 16px 8px', display: 'flex', flexDirection: 'column', gap: 24, position: 'relative' }}
            >
              {/* Dashed connector */}
              <div style={{ position: 'absolute', left: 35, top: 80, bottom: 68, width: 1, borderLeft: '1.5px dashed #e5e5e5', zIndex: 0 }} />

              {/* Step 1 — completed (two items) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8.5l3.5 3.5 6.5-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div style={{ paddingTop: 2 }}>
                    <div style={{ fontSize: 14, color: '#171717', lineHeight: '22px' }}>Step 1</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <span style={{ fontSize: 16, fontWeight: 600, color: '#171717', lineHeight: '24px' }}>Free access confirmed</span>
                      <InfoIcon />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 16, fontWeight: 600, color: '#171717', lineHeight: '24px' }}>Personalized plan created</span>
                      <InfoIcon />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 — active, class card */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, background: C.white, border: `2px solid ${C.purple}`, boxShadow: `0 0 0 4px rgba(92,0,212,0.12)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.purple }} />
                  </div>
                  <div style={{ flex: 1, paddingTop: 2 }}>
                    <div style={{ fontSize: 14, color: '#171717', lineHeight: '22px' }}>Step 2</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#171717', lineHeight: '24px' }}>
                      Take your first class
                    </div>
                  </div>
                </div>
                {classCard}
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ height: 24 }} />
      </div>

      {/* Bottom nav */}
      <div style={{ flexShrink: 0, background: C.white, borderTop: `1px solid ${C.border}`, display: 'flex', padding: '4px 4px' }}>
        {[
          { label: 'Today', active: true, icon: (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M2.5 9.5L11 3l8.5 6.5V19a1 1 0 0 1-1 1H3.5a1 1 0 0 1-1-1V9.5Z" fill="#ede9fe" stroke={C.purple} strokeWidth="1.5"/>
              <path d="M8 20v-6h6v6" stroke={C.purple} strokeWidth="1.5"/>
            </svg>
          )},
          { label: 'Live', active: false, icon: (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="2" y="4" width="18" height="14" rx="2" stroke="#8a8693" strokeWidth="1.5"/>
              <path d="M9 8.5l5 3-5 3v-6Z" fill="#8a8693"/>
            </svg>
          )},
          { label: 'Explore', active: false, icon: (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="2" y="2" width="8" height="8" rx="1.5" stroke="#8a8693" strokeWidth="1.5"/>
              <rect x="12" y="2" width="8" height="8" rx="1.5" stroke="#8a8693" strokeWidth="1.5"/>
              <rect x="2" y="12" width="8" height="8" rx="1.5" stroke="#8a8693" strokeWidth="1.5"/>
              <rect x="12" y="12" width="8" height="8" rx="1.5" stroke="#8a8693" strokeWidth="1.5"/>
            </svg>
          )},
          { label: 'Menu', active: false, icon: (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M3 6h16M3 11h16M3 16h16" stroke="#8a8693" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          )},
        ].map(({ label, active, icon }) => (
          <div key={label} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 2,
            background: active ? '#ede9fe' : 'transparent',
            borderRadius: 8, padding: '6px 0', cursor: 'pointer',
          }}>
            {icon}
            <span style={{ fontSize: 11, fontWeight: 600, color: active ? C.purple : '#140d26' }}>{label}</span>
          </div>
        ))}
      </div>

    </div>
  )
}
