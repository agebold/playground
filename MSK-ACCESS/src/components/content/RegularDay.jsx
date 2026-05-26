import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { C } from './shared.jsx'
import boldLogomark from '../../assets/bold-logomark.png'
import amorphousBlob from '../../assets/amorphous-blob.png'
import imgTrainer from '../../assets/alicia_headshot.jpg'
import imgClassThumbnail from '../../assets/class-thumbnail.jpg'
import classAlt1 from '../../assets/Class Alternative 1.jpg'
import classAlt2 from '../../assets/Class Alternative 2.jpg'

// ─── Animation helpers ────────────────────────────────────────────────────────

const ease = [0.16, 1, 0.3, 1]
const slideUp = (delay = 0) => ({
  initial: { opacity: 0, y: 36 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease, delay } },
})

// ─── Data ─────────────────────────────────────────────────────────────────────

const PAIN_OPTIONS = [
  { type: 'flare',     color: '#ef4444', label: "I'm experiencing a flare up" },
  { type: 'tolerable', color: '#eab308', label: "In some pain, but tolerable" },
  { type: 'good',      color: '#22c55e', label: "I'm feeling good, no pain" },
]

const STEP2_COPY = {
  locked:    "Ready to get moving? Check in to unlock your move class.",
  flare:     "Here's a gentle move class to keep you going without straining your knee.",
  tolerable: "Here's a manageable move class matched to how you're feeling today.",
  good:      "Time to move! Here's your class for today — enjoy the good day.",
}

const CLASS_CONTENT = {
  flare: {
    thumbnail: classAlt1,
    title: '15 min Seated Gentle Stretch',
    why: "Since you're experiencing a flare-up, we've chosen a gentle seated class to keep you moving without straining your knee.",
  },
  tolerable: {
    thumbnail: classAlt2,
    title: '19 min Strength: Upper Body Basics',
    why: "With some pain today, this class strikes the right balance — challenging enough to be effective, but manageable on your knee.",
  },
  good: {
    thumbnail: imgClassThumbnail,
    title: '19 min Strength: Upper Body Basics',
    why: "You're feeling great today — this class will help you make the most of it with a full upper body workout.",
  },
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="#2563eb" strokeWidth="1.2"/>
      <path d="M8 7.5v3M8 5.5h.01" stroke="#2563eb" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="3" y="6" width="8" height="6" rx="1" stroke="#8a8693" strokeWidth="1.2"/>
      <path d="M5 6V4.5a2 2 0 0 1 4 0V6" stroke="#8a8693" strokeWidth="1.2" strokeLinecap="round"/>
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

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2.5 7l3 3 6-6" stroke={C.purple} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RegularDay() {
  const [showAvatar,   setShowAvatar]   = useState(false)
  const [showGreeting, setShowGreeting] = useState(false)
  const [showIntro,    setShowIntro]    = useState(false)
  const [showStep1,    setShowStep1]    = useState(false)
  const [showStep2,    setShowStep2]    = useState(false)
  const [response,     setResponse]     = useState(null)
  const [showPlan,     setShowPlan]     = useState(false)

  // A - Locked: Step 2 appears automatically but class card is hidden until check-in is submitted
  useEffect(() => {
    const t1 = setTimeout(() => setShowAvatar(true),   300)
    const t2 = setTimeout(() => setShowGreeting(true), 1600)
    const t3 = setTimeout(() => setShowIntro(true),    2900)
    const t4 = setTimeout(() => setShowStep1(true),    3800)
    const t5 = setTimeout(() => setShowStep2(true),    4500)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5) }
  }, [])

  const handleResponse = (type) => {
    setResponse(type)
    setTimeout(() => setShowPlan(true), 600)
  }

  const classInfo = CLASS_CONTENT[response] ?? {
    thumbnail: imgClassThumbnail,
    title: '19 min Strength: Upper Body Basics',
    why: "Because of your knee pain, we think this seated class is a great starting point.",
  }

  // ─── Check-in card ──────────────────────────────────────────────────────────

  const checkinCard = (
    <div style={{
      background: C.white, border: `1px solid ${C.border}`, borderRadius: 12,
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, alignSelf: 'flex-start',
          background: '#ebf0ff', borderRadius: 4, padding: '3px 8px' }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#2563eb' }}>Check in</span>
          <InfoIcon />
        </div>

        <AnimatePresence mode="wait">
          {!response ? (
            <motion.div key="question"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
            >
              <div style={{ fontSize: 18, fontWeight: 600, color: '#140d26', lineHeight: '25px' }}>
                How would you describe your knee pain today?
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {PAIN_OPTIONS.map(({ type, color, label }) => (
                  <button key={type} onClick={() => handleResponse(type)} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 10px', width: '100%',
                    background: C.white, border: `1px solid #e5e5e5`,
                    borderRadius: 360, boxShadow: '0px 1px 2px rgba(16,24,40,0.05)',
                    cursor: 'pointer', fontFamily: 'Inter, sans-serif', textAlign: 'left',
                  }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#140d26' }}>{label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="selected"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease }}
              style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
            >
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 10px',
                background: '#f5f3ff', border: `1px solid ${C.purple}`,
                borderRadius: 360,
              }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%',
                  background: PAIN_OPTIONS.find(o => o.type === response)?.color, flexShrink: 0 }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: '#140d26', flex: 1 }}>
                  {PAIN_OPTIONS.find(o => o.type === response)?.label}
                </span>
                <CheckIcon />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pause check-ins strip */}
      <AnimatePresence>
        {(response === 'tolerable' || response === 'good') && (
          <motion.div
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease }}
            style={{ background: '#ebf0ff', display: 'flex', alignItems: 'flex-start', gap: 6, padding: '14px 10px', cursor: 'pointer' }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
              <circle cx="11" cy="11" r="10" stroke={C.purple} strokeWidth="1.5"/>
              <rect x="7.5" y="7" width="2.5" height="8" rx="1" fill={C.purple}/>
              <rect x="12" y="7" width="2.5" height="8" rx="1" fill={C.purple}/>
            </svg>
            <p style={{ fontSize: 15, fontWeight: 600, lineHeight: '22px', margin: 0 }}>
              <span style={{ color: '#525252', fontWeight: 400 }}>Pain feeling relatively stable? </span>
              <span style={{ color: C.purple }}>Pause check-ins for this week</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  // ─── Class card (mobile / vertical) ────────────────────────────────────────

  const classCard = (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ position: 'relative', height: 140, overflow: 'hidden' }}>
        <img src={classInfo.thumbnail} alt="Class" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(255,255,255,0.88)', borderRadius: 10, padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, color: '#070101', border: `1px solid ${C.border}` }}>
          <svg width="13" height="15" viewBox="0 0 13 15" fill="none">
            <path d="M2 2h9v11l-4.5-3L2 13V2Z" stroke="#070101" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Save
        </div>
      </div>
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ background: '#ebf0ff', borderRadius: 4, padding: '3px 8px', display: 'inline-flex', alignItems: 'center', gap: 4, alignSelf: 'flex-start' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#2563eb' }}>Move class</span>
          </div>
          <div style={{ fontSize: 17, fontWeight: 600, color: '#140d26', lineHeight: '23px' }}>
            {classInfo.title}
          </div>
          <div style={{ fontSize: 15, color: '#140d26' }}>Chris Litten</div>
        </div>
        <div style={{ background: '#ebf0ff', borderRadius: 12, padding: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src={imgTrainer} alt="" style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center top' }} />
            <span style={{ fontSize: 15, fontWeight: 600, color: '#171717' }}>Why this class</span>
          </div>
          <p style={{ fontSize: 15, color: '#171717', lineHeight: '22px', margin: 0 }}>
            {classInfo.why}
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
          <button style={{ width: '100%', padding: '12px 16px', background: C.purple, color: C.white, border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
            Start class
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <RefreshIcon />
            <span style={{ fontSize: 13, color: '#525252' }}>
              Not feeling this today?{' '}
              <span style={{ color: C.purple, fontWeight: 600 }}>Switch class</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )

  // ─── Render ─────────────────────────────────────────────────────────────────

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: C.purple, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white, fontSize: 13, fontWeight: 600 }}>CS</div>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 5l4 4 4-4" stroke="#8a8693" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>

        {/* Header: avatar + greeting + intro */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 16px 0' }}>
          <AnimatePresence>
            {showAvatar && (
              <motion.div {...slideUp(0)}
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
              <motion.div {...slideUp(0)} style={{ textAlign: 'center', marginTop: 4 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#8a8693', lineHeight: '22px' }}>Mon, Jul 20th</div>
                <div style={{ fontSize: 28, fontWeight: 600, color: '#140d26', lineHeight: '34px', letterSpacing: '-0.8px' }}>
                  Morning, Carol!
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showIntro && (
              <motion.div {...slideUp(0)} style={{ textAlign: 'center', padding: '8px 12px 0' }}>
                <p style={{ fontSize: 16, color: '#171717', lineHeight: '24px', margin: 0 }}>
                  Ready for a Bold day? Rate your knee pain and we'll serve up an appropriate class.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Steps */}
        <AnimatePresence>
          {showStep1 && (
            <motion.div {...slideUp(0)}
              style={{ padding: '24px 16px 8px', display: 'flex', flexDirection: 'column', gap: 24, position: 'relative' }}
            >
              {/* Dashed connector line */}
              <div style={{ position: 'absolute', left: 35, top: 64, bottom: 68, width: 1, borderLeft: '1.5px dashed #e5e5e5', zIndex: 0 }} />

              {/* Step 1 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  {response ? (
                    <div style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8.5l3.5 3.5 6.5-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  ) : (
                    <div style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, background: C.white, border: `2px solid ${C.purple}`, boxShadow: `0 0 0 4px rgba(92,0,212,0.12)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.purple }} />
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: 14, color: '#171717', lineHeight: '22px' }}>Step 1</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#171717', lineHeight: '24px' }}>Let's check in on your knee</div>
                  </div>
                </div>
                {checkinCard}
              </div>

              {/* Step 2 */}
              <AnimatePresence>
                {showStep2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', zIndex: 1 }}
                  >
                    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                      {response ? (
                        <div style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, background: C.white, border: `2px solid ${C.purple}`, boxShadow: `0 0 0 4px rgba(82,0,212,0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.purple }} />
                        </div>
                      ) : (
                        <div style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, background: C.white, border: `2px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <LockIcon />
                        </div>
                      )}
                      <div style={{ flex: 1, paddingTop: 2 }}>
                        <div style={{ fontSize: 14, color: '#171717', lineHeight: '22px' }}>Step 2</div>
                        <div style={{ fontSize: 16, fontWeight: 600, color: response ? '#171717' : '#8a8693', lineHeight: '24px' }}>
                          {STEP2_COPY[response ?? 'locked']}
                        </div>
                      </div>
                    </div>
                    <AnimatePresence>
                      {showPlan && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
                          {classCard}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
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
