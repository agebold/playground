import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { C } from './shared.jsx'
import boldLogomark from '../../assets/bold-logomark.png'
import amorphousBlob from '../../assets/amorphous-blob.png'
import imgTrainer from '../../assets/alicia_headshot.jpg'
import imgClassThumbnail from '../../assets/class-thumbnail.jpg'

const imgTrainerAvatar = imgTrainer

const ease = [0.16, 1, 0.3, 1]
const slideUp = (delay = 0) => ({
  initial: { opacity: 0, y: 36 },
  animate: { opacity: 1, y: 0, transition: { duration: 5.00, ease, delay } },
})
const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease, delay } },
})

const RESPONSE_COPY = {
  pain: "We're sorry to hear that, Carol — we've adjusted your move class to be gentler on your knee. Here's your plan for today.",
  okay: "Great! Here's what we have lined up for you today.",
}

function ThumbsDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 1H3.5a1 1 0 0 0-.93.63l-2 4.87A1 1 0 0 0 1.5 8H6l-.87 3.5a.75.75 0 0 0 1.3.65L11 8" stroke="#171717" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11 1h2a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-2V1Z" stroke="#171717" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function ThumbsUpIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 15h6.5a1 1 0 0 0 .93-.63l2-4.87A1 1 0 0 0 14.5 8H10l.87-3.5a.75.75 0 0 0-1.3-.65L5 8" stroke="#171717" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 15H3a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h2v7Z" stroke="#171717" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
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

function AvatarBlob({ size = 96, blobSize = 220 }) {
  return (
    <div style={{ position: 'relative', width: blobSize, height: blobSize * 0.73, flexShrink: 0, overflow: 'visible' }}>
      <img src={amorphousBlob} alt="" style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'contain', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: size, height: size, borderRadius: '50%', overflow: 'hidden', zIndex: 1,
      }}>
        <img src={imgTrainer} alt="Trainer"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
      </div>
      <div style={{
        position: 'absolute',
        top: `calc(50% + ${size * 0.354}px)`, left: `calc(50% + ${size * 0.354}px)`,
        transform: 'translate(-50%, -50%)', zIndex: 2,
        width: size * 0.29, height: size * 0.29, borderRadius: '50%',
        background: C.white, border: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <img src={boldLogomark} alt="Bold" style={{ width: size * 0.146, height: 'auto' }} />
      </div>
    </div>
  )
}

function ClassCard({ compact = false }) {
  return (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ position: 'relative', height: compact ? 140 : 160, overflow: 'hidden' }}>
        <img src={imgClassThumbnail} alt="Class" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{
          position: 'absolute', top: 10, right: 10,
          background: 'rgba(255,255,255,0.88)', borderRadius: 10,
          padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 4,
          fontSize: 13, fontWeight: 600, color: '#070101', border: `1px solid ${C.border}`,
        }}>
          <svg width="13" height="15" viewBox="0 0 13 15" fill="none">
            <path d="M2 2h9v11l-4.5-3L2 13V2Z" stroke="#070101" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Save
        </div>
      </div>
      <div style={{ padding: compact ? 12 : 14, display: 'flex', flexDirection: 'column', gap: compact ? 10 : 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{
            background: '#ebf0ff', borderRadius: 4,
            padding: '3px 8px', display: 'inline-flex', alignItems: 'center', gap: 4, alignSelf: 'flex-start',
          }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#2563eb' }}>Move class</span>
            <InfoIcon />
          </div>
          <div style={{ fontSize: compact ? 15 : 17, fontWeight: 600, color: '#140d26', lineHeight: '23px' }}>
            19 min Strength: Upper Body Basics
          </div>
          <div style={{ fontSize: 15, color: '#140d26', lineHeight: '22px' }}>Chris Litten</div>
        </div>
        <div style={{ background: '#ebf0ff', borderRadius: 12, padding: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src={imgTrainerAvatar} alt="" style={{ width: 22, height: 22, borderRadius: '50%' }} />
            <span style={{ fontSize: 15, fontWeight: 600, color: '#171717' }}>Why this class</span>
          </div>
          <p style={{ fontSize: 15, color: '#171717', lineHeight: '22px', margin: 0 }}>
            Because of your knee pain, we think this seated class is a great starting point.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
          <button style={{
            width: '100%', padding: '12px 16px',
            background: C.purple, color: C.white,
            border: 'none', borderRadius: 12,
            fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          }}>
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
}

export default function Exploration1({ viewMode = 'mobile' }) {
  const [showAvatar, setShowAvatar]     = useState(false)
  const [showGreeting, setShowGreeting] = useState(false)
  const [showCheckin, setShowCheckin]   = useState(false)
  const [response, setResponse]         = useState(null)
  const [showPlan, setShowPlan]         = useState(false)

  const cardRef = useRef(null)

  useEffect(() => {
    const t1 = setTimeout(() => setShowAvatar(true),   300)
    const t2 = setTimeout(() => setShowGreeting(true), 1600)
    const t3 = setTimeout(() => setShowCheckin(true),  2900)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  useEffect(() => {
    if (!showPlan || viewMode !== 'desktop') return
    const timer = setTimeout(() => {
      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }, 650)
    return () => clearTimeout(timer)
  }, [showPlan, viewMode])

  const handleResponse = (type) => {
    setResponse(type)
    setTimeout(() => setShowPlan(true), 600)
  }

  const checkinQuestion = (
    <AnimatePresence mode="wait">
      {!response ? (
        <motion.div key="question"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <p style={{ fontSize: 15, color: '#09112a', lineHeight: '24px', textAlign: 'center', margin: 0 }}>
            Before you get started, how would you rate your knee pain today? We'll refine your move class based on how you feel.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { icon: <ThumbsDownIcon />, label: "I'm in pain", type: 'pain' },
              { icon: <ThumbsUpIcon />, label: "I'm feeling okay", type: 'okay' },
            ].map(({ icon, label, type }) => (
              <button key={type} onClick={() => handleResponse(type)} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 4, padding: '6px 10px',
                background: C.white, border: `1px solid #d4d4d4`,
                borderRadius: 360, boxShadow: '0px 1px 2px rgba(16,24,40,0.05)',
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              }}>
                {icon}
                <span style={{ fontSize: 13, fontWeight: 600, color: '#171717', whiteSpace: 'nowrap' }}>{label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.p key="response"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease }}
          style={{ fontSize: 15, color: '#09112a', lineHeight: '24px', textAlign: 'center', margin: 0 }}
        >
          {RESPONSE_COPY[response]}
        </motion.p>
      )}
    </AnimatePresence>
  )

  if (viewMode === 'desktop') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', background: '#fafafa', minHeight: 560 }}>

        {/* Desktop nav */}
        <div style={{
          background: C.white, borderBottom: `1px solid ${C.border}`,
          height: 60, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 40px',
        }}>
          {/* Wordmark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src={boldLogomark} alt="Bold" style={{ height: 30, width: 'auto' }} />
          </div>
          {/* Nav links */}
          <div style={{ display: 'flex', gap: 4 }}>
            {[
              { label: 'Today', active: true, icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 7l6-5 6 5v7a.75.75 0 0 1-.75.75H10.5v-4h-5v4H2.75A.75.75 0 0 1 2 14V7Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg> },
              { label: 'Live classes', active: false, icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M7 6.5l4 1.5-4 1.5V6.5Z" fill="currentColor"/></svg> },
              { label: 'Explore', active: false, icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/></svg> },
            ].map(({ label, active, icon }) => (
              <div key={label} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', borderRadius: 8, cursor: 'pointer',
                background: active ? C.purpleLight : 'transparent',
                color: active ? C.purple : '#525252',
                fontSize: 14, fontWeight: active ? 600 : 400,
              }}>
                {icon} {label}
              </div>
            ))}
          </div>
          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%', background: C.purple,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: C.white, fontSize: 13, fontWeight: 600,
            }}>CS</div>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 5l4 4 4-4" stroke="#8a8693" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Scrollable centered column */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 32px 48px' }}>

            {/* Phase 1 — Avatar + blob */}
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 40 }}>
              {showAvatar && (
                <motion.div {...slideUp(0)}>
                  <AvatarBlob size={80} blobSize={200} />
                </motion.div>
              )}
            </div>

            {/* Phase 2 — Date + greeting */}
            {showGreeting && (
              <motion.div {...slideUp(0)} style={{ textAlign: 'center', marginTop: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#8a8693' }}>Mon, Sep 28th</div>
                <div style={{ fontSize: 30, fontWeight: 600, color: '#140d26', letterSpacing: '-0.8px', lineHeight: '38px' }}>
                  Morning, Carol!
                </div>
              </motion.div>
            )}

            {/* Phase 3 — Check-in / response */}
            {showCheckin && (
              <motion.div {...slideUp(0)} style={{ marginTop: 20 }}>
                {checkinQuestion}
              </motion.div>
            )}

            {/* Phase 4 — Plan */}
            <AnimatePresence>
              {showPlan && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.85, ease }}
                  style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 20, position: 'relative' }}
                >
                  {/* Dashed connector */}
                  <div style={{
                    position: 'absolute', left: 18, top: 38, bottom: 56,
                    width: 1, borderLeft: '1.5px dashed #e5e5e5', zIndex: 0,
                  }} />

                  {/* Step 1 header */}
                  <motion.div {...fadeIn(0.55)} style={{ display: 'flex', gap: 16, alignItems: 'center', position: 'relative', zIndex: 1 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                      background: C.white, border: `2px solid ${C.purple}`,
                      boxShadow: `0 0 0 4px rgba(82,0,212,0.1)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.purple }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, color: '#525252' }}>First up</div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: '#171717' }}>Take your move class</div>
                    </div>
                  </motion.div>

                  {/* Class card — horizontal desktop layout */}
                  <motion.div {...fadeIn(1.12)} ref={cardRef}
                    style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden', display: 'flex', position: 'relative', zIndex: 1 }}
                  >
                    {/* Text content */}
                    <div style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div style={{
                          background: '#ebf0ff', borderRadius: 4,
                          padding: '3px 8px', display: 'inline-flex', alignItems: 'center', gap: 4, alignSelf: 'flex-start',
                        }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: '#2563eb' }}>Move class</span>
                          <InfoIcon />
                        </div>
                        <div style={{ fontSize: 17, fontWeight: 600, color: '#140d26', lineHeight: '24px' }}>
                          19 min Strength: Upper Body Basics
                        </div>
                        <div style={{ fontSize: 15, color: '#140d26' }}>Chris Litten</div>
                      </div>
                      <div style={{ background: '#ebf0ff', borderRadius: 12, padding: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <img src={imgTrainerAvatar} alt="" style={{ width: 22, height: 22, borderRadius: '50%' }} />
                          <span style={{ fontSize: 15, fontWeight: 600, color: '#171717' }}>Why this class</span>
                        </div>
                        <p style={{ fontSize: 15, color: '#171717', lineHeight: '22px', margin: 0 }}>
                          Because of your knee pain, we think this seated class is a great starting point.
                        </p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
                        <button style={{
                          width: '100%', padding: '12px 16px',
                          background: C.purple, color: C.white,
                          border: 'none', borderRadius: 12,
                          fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                        }}>Start class</button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <RefreshIcon />
                          <span style={{ fontSize: 13, color: '#525252' }}>
                            Not feeling this today?{' '}
                            <span style={{ color: C.purple, fontWeight: 600 }}>Change class</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Thumbnail */}
                    <div style={{ width: 340, flexShrink: 0, position: 'relative' }}>
                      <img src={imgClassThumbnail} alt="Class"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{
                        position: 'absolute', top: 12, right: 12,
                        background: 'rgba(255,255,255,0.88)', borderRadius: 10,
                        padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 4,
                        fontSize: 13, fontWeight: 600, color: '#070101', border: `1px solid ${C.border}`,
                      }}>
                        <svg width="13" height="15" viewBox="0 0 13 15" fill="none">
                          <path d="M2 2h9v11l-4.5-3L2 13V2Z" stroke="#070101" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Save
                      </div>
                    </div>
                  </motion.div>

                  {/* Step 2 */}
                  <motion.div {...fadeIn(0.22)} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                      background: C.white, border: `2px solid ${C.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3 5l4 4 4-4" stroke="#8a8693" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div style={{ paddingTop: 4 }}>
                      <div style={{ fontSize: 13, color: '#525252' }}>Get learning</div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: '#171717' }}>
                        Understand the neuroscience behind your knee pain
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    )
  }

  /* ─── Mobile layout ───────────────────────────────────────────────────────── */
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', background: '#fafafa' }}>

      {/* Nav header */}
      <div style={{
        background: C.white, borderBottom: `1px solid ${C.border}`,
        height: 52, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', boxShadow: '0px 1px 2px rgba(16,24,40,0.05)',
      }}>
        <img src={boldLogomark} alt="Bold" style={{ height: 32, width: 'auto' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%', background: C.purple,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: C.white, fontSize: 13, fontWeight: 600,
          }}>CS</div>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 5l4 4 4-4" stroke="#8a8693" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 16px 0' }}>

          <AnimatePresence>
            {showAvatar && (
              <motion.div {...slideUp(0)}
                style={{ position: 'relative', width: 220, height: 160, flexShrink: 0, overflow: 'visible' }}
              >
                <img src={amorphousBlob} alt="" style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%',
                  objectFit: 'contain', pointerEvents: 'none',
                }} />
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 96, height: 96, borderRadius: '50%', overflow: 'hidden', zIndex: 1,
                }}>
                  <img src={imgTrainer} alt="Trainer"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                </div>
                <div style={{
                  position: 'absolute',
                  top: 'calc(50% + 34px)', left: 'calc(50% + 34px)',
                  transform: 'translate(-50%, -50%)', zIndex: 2,
                  width: 28, height: 28, borderRadius: '50%',
                  background: C.white, border: `1px solid ${C.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <img src={boldLogomark} alt="Bold" style={{ width: 14, height: 'auto' }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showGreeting && (
              <motion.div {...slideUp(0)} style={{ textAlign: 'center', marginTop: 4 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#8a8693', lineHeight: '22px' }}>Mon, Sep 28th</div>
                <div style={{ fontSize: 26, fontWeight: 600, color: '#140d26', lineHeight: '32px', letterSpacing: '-0.8px' }}>
                  Morning, Carol!
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showCheckin && (
              <motion.div {...slideUp(0)}
                style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12, padding: '12px 0' }}
              >
                {checkinQuestion}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Phase 4 — Plan */}
        <AnimatePresence>
          {showPlan && (
            <motion.div
              initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              style={{ padding: '8px 16px 24px', display: 'flex', flexDirection: 'column', gap: 20, position: 'relative' }}
            >
              <div style={{
                position: 'absolute', left: 35, top: 48, bottom: 68,
                width: 1, borderLeft: '1.5px dashed #e5e5e5', zIndex: 0,
              }} />

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease, delay: 0.05 }}
                style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'relative', zIndex: 1 }}
              >
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                    background: C.white, border: `2px solid ${C.purple}`,
                    boxShadow: `0 0 0 4px rgba(92,0,212,0.12)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.purple }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, color: '#171717', lineHeight: '20px' }}>First up</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#171717', lineHeight: '22px' }}>Take your move class</div>
                  </div>
                </div>
                <ClassCard compact />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease, delay: 0.18 }}
                style={{ display: 'flex', gap: 16, alignItems: 'flex-start', position: 'relative', zIndex: 1 }}
              >
                <div style={{
                  width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                  background: C.white, border: `2px solid ${C.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 5l4 4 4-4" stroke="#8a8693" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div style={{ flex: 1, paddingTop: 2 }}>
                  <div style={{ fontSize: 13, color: '#171717', lineHeight: '20px' }}>Get learning</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#171717', lineHeight: '22px' }}>
                    Understand the neuroscience behind your knee pain
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom app nav */}
      <div style={{
        flexShrink: 0, background: C.white, borderTop: `1px solid ${C.border}`,
        display: 'flex', padding: '4px 4px',
      }}>
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
            <span style={{ fontSize: 11, fontWeight: 600, color: active ? C.purple : '#140d26' }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
