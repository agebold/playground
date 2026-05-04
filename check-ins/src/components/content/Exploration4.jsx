import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { C } from './shared.jsx'
import boldLogomark from '../../assets/bold-logomark.png'
import amorphousBlob from '../../assets/amorphous-blob.png'
import imgTrainer from '../../assets/alicia_headshot.jpg'
import imgClassThumbnail from '../../assets/class-thumbnail.jpg'

const ease = [0.16, 1, 0.3, 1]
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease, delay } },
})

// ── Pain options ─────────────────────────────────────────────────────────────

const PAIN_OPTIONS = [
  { emoji: '😫', label: 'Bad',       value: 'bad'  },
  { emoji: '🙂', label: 'Okay',      value: 'okay' },
  { emoji: '☺️', label: 'Pain-free', value: 'free' },
]

// ── Content per pain level ───────────────────────────────────────────────────

const CONTENT = {
  default: {
    message: "Here's your plan for today. Use the optional check-in to let us know how your knee is feeling.",
    classTitle: '19 min Strength: Upper Body Basics',
    whyClass:   'Based on your goals and fitness level, this is your scheduled class for today.',
  },
  bad: {
    message: "We're sorry to hear that, Carol. We've adjusted your move class to be gentler on your knee.",
    classTitle: '15 min Seated Gentle Stretch',
    whyClass:   "Given your pain today, we've swapped to a gentler seated class that's easier on your knee.",
  },
  okay: {
    message: "Glad you're managing, Carol! Your move class is ready when you are — listen to your body.",
    classTitle: '19 min Strength: Upper Body Basics',
    whyClass:   "You're managing well today. Your original class should work fine — take it at your own pace.",
  },
  free: {
    message: "Love to hear it, Carol! Let's make the most of your pain-free day.",
    classTitle: '19 min Strength: Upper Body Basics',
    whyClass:   "You're feeling great today — let's keep the momentum going with your scheduled class!",
  },
}

// ── Small icons ──────────────────────────────────────────────────────────────

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
      <path d="M13.5 8A5.5 5.5 0 1 1 8 2.5a5.48 5.48 0 0 1 3.9 1.6L13.5 6"
        stroke="#525252" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13.5 2.5V6H10" stroke="#525252" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M5 3l4 4-4 4" stroke="#8a8693" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

export default function Exploration4({ viewMode = 'mobile' }) {
  const [showContent, setShowContent] = useState(false)
  const [modalOpen,   setModalOpen]   = useState(false)
  const [selected,    setSelected]    = useState(null) // temp selection inside modal
  const [painLevel,   setPainLevel]   = useState(null) // committed after submit

  useEffect(() => {
    const t = setTimeout(() => setShowContent(true), 350)
    return () => clearTimeout(t)
  }, [])

  const handleOpen  = () => { setSelected(null); setModalOpen(true) }
  const handleClose = () => { setSelected(null); setModalOpen(false) }

  const handleSubmit = () => {
    if (!selected) return
    setPainLevel(selected)
    setModalOpen(false)
    setSelected(null)
  }

  const content        = CONTENT[painLevel ?? 'default']
  const selectedOption = PAIN_OPTIONS.find(o => o.value === painLevel)

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden',
      background: '#fafafa', position: 'relative', fontFamily: 'Inter, sans-serif',
    }}>

      {/* ── Top nav ── */}
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

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflowY: 'auto' }}>

        {/* Header: blob + greeting + message */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 16px 0' }}>

          {showContent && (
            <motion.div {...fadeUp(0)}
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

          {showContent && (
            <motion.div {...fadeUp(0.14)} style={{ textAlign: 'center', marginTop: 4, width: '100%' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#8a8693', lineHeight: '22px' }}>Mon, Sep 28th</div>
              <div style={{ fontSize: 26, fontWeight: 600, color: '#140d26', lineHeight: '32px', letterSpacing: '-0.8px' }}>
                Morning, Carol!
              </div>
            </motion.div>
          )}

          {showContent && (
            <motion.div {...fadeUp(0.26)} style={{ width: '100%', marginTop: 8, marginBottom: 2 }}>
              <AnimatePresence mode="wait">
                <motion.p
                  key={content.message}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease }}
                  style={{ fontSize: 15, color: '#525252', lineHeight: '22px', textAlign: 'center', margin: 0 }}
                >
                  {content.message}
                </motion.p>
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* ── Optional check-in row ── */}
        {showContent && (
          <motion.div {...fadeUp(0.38)} style={{ padding: '14px 16px 0' }}>
            <div style={{
              background: C.white, border: `1px solid ${C.border}`,
              borderRadius: 12, overflow: 'hidden',
            }}>
              {/* Row header */}
              <div style={{
                padding: '12px 16px',
                borderBottom: `1px solid ${C.border}`,
              }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#525252' }}>
                  Daily check-in{' '}
                </span>
                <span style={{ fontSize: 14, fontWeight: 400, color: '#8a8693' }}>
                  (optional)
                </span>
              </div>

              {/* CTA or submitted state */}
              <div style={{ padding: '12px 16px' }}>
                <AnimatePresence mode="wait">
                  {!painLevel ? (
                    <motion.button
                      key="log"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      onClick={handleOpen}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        background: C.bg, border: `1.5px solid ${C.border}`,
                        borderRadius: 10, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      <span style={{ fontSize: 15, color: '#525252' }}>Log your pain</span>
                      <ChevronRight />
                    </motion.button>
                  ) : (
                    <motion.div
                      key="submitted"
                      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease }}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 14px',
                        background: '#f5f3ff', border: `1.5px solid ${C.purple}`,
                        borderRadius: 10,
                      }}
                    >
                      <span style={{ fontSize: 15, color: '#525252' }}>Pain today:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 20, lineHeight: 1 }}>{selectedOption.emoji}</span>
                        <span style={{ fontSize: 15, fontWeight: 600, color: C.purple }}>
                          {selectedOption.label}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Plan section ── */}
        {showContent && (
          <motion.div
            {...fadeUp(0.52)}
            style={{ padding: '16px 16px 28px', display: 'flex', flexDirection: 'column', gap: 14, position: 'relative' }}
          >
            {/* Dashed connector */}
            <div style={{
              position: 'absolute', left: 35, top: 56, bottom: 68,
              width: 1, borderLeft: '1.5px dashed #e5e5e5', zIndex: 0,
            }} />

            {/* Step 1 header */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', position: 'relative', zIndex: 1 }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                background: C.white, border: `2px solid ${C.purple}`,
                boxShadow: `0 0 0 4px rgba(82,0,212,0.1)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.purple }} />
              </div>
              <div>
                <div style={{ fontSize: 13, color: '#171717', lineHeight: '20px' }}>First up</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#171717', lineHeight: '22px' }}>Take your move class</div>
              </div>
            </div>

            {/* Class card — animates when pain level changes */}
            <AnimatePresence mode="wait">
              <motion.div
                key={content.classTitle}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.4, ease }}
                style={{
                  background: C.white, border: `1px solid ${C.border}`, borderRadius: 12,
                  overflow: 'hidden', position: 'relative', zIndex: 1,
                }}
              >
                {/* Thumbnail */}
                <div style={{ position: 'relative', height: 140, overflow: 'hidden' }}>
                  <img src={imgClassThumbnail} alt="Class"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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

                {/* Meta */}
                <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{
                      background: '#ebf0ff', borderRadius: 4,
                      padding: '3px 8px', display: 'inline-flex', alignItems: 'center', gap: 4, alignSelf: 'flex-start',
                    }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#2563eb' }}>Move class</span>
                      <InfoIcon />
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#140d26', lineHeight: '23px' }}>
                      {content.classTitle}
                    </div>
                    <div style={{ fontSize: 15, color: '#140d26', lineHeight: '22px' }}>Chris Litten</div>
                  </div>

                  {/* Why this class */}
                  <div style={{ background: '#ebf0ff', borderRadius: 12, padding: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <img src={imgTrainer} alt="" style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover' }} />
                      <span style={{ fontSize: 15, fontWeight: 600, color: '#171717' }}>Why this class</span>
                    </div>
                    <p style={{ fontSize: 15, color: '#171717', lineHeight: '22px', margin: 0 }}>
                      {content.whyClass}
                    </p>
                  </div>

                  {/* Actions */}
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
              </motion.div>
            </AnimatePresence>

            {/* Step 2 */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
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
            </div>
          </motion.div>
        )}
      </div>

      {/* ── Modal overlay + bottom sheet ── */}
      <AnimatePresence>
        {modalOpen && (
          <>
            {/* Dim backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 0.45 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={handleClose}
              style={{ position: 'absolute', inset: 0, background: '#000', zIndex: 20 }}
            />

            {/* Bottom sheet */}
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ duration: 0.36, ease }}
              style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: C.white, borderRadius: '20px 20px 0 0',
                zIndex: 21, padding: '8px 20px 32px',
              }}
            >
              {/* Drag handle */}
              <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 14 }}>
                <div style={{ width: 36, height: 4, background: '#e5e5e5', borderRadius: 2 }} />
              </div>

              {/* Sheet header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ fontSize: 17, fontWeight: 600, color: '#140d26' }}>Daily check-in</span>
                <button
                  onClick={handleClose}
                  style={{
                    background: C.bg, border: 'none', borderRadius: 10,
                    width: 32, height: 32, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 1l10 10M11 1L1 11" stroke="#171717" strokeWidth="1.6" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              {/* Question */}
              <p style={{ fontSize: 15, color: '#525252', lineHeight: '22px', margin: '0 0 20px' }}>
                How would you describe your knee pain today?
              </p>

              {/* Emoji options */}
              <div style={{ display: 'flex', gap: 8 }}>
                {PAIN_OPTIONS.map(option => {
                  const isSel = selected === option.value
                  return (
                    <button
                      key={option.value}
                      onClick={() => setSelected(option.value)}
                      style={{
                        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                        padding: '16px 8px',
                        background: isSel ? '#f5f3ff' : C.bg,
                        border: `1.5px solid ${isSel ? C.purple : C.border}`,
                        borderRadius: 14, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span style={{ fontSize: 38, lineHeight: 1 }}>{option.emoji}</span>
                      <span style={{
                        fontSize: 14, fontWeight: isSel ? 600 : 400,
                        color: isSel ? C.purple : '#525252',
                        transition: 'color 0.15s',
                      }}>
                        {option.label}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Actions */}
              <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button
                  onClick={handleSubmit}
                  disabled={!selected}
                  style={{
                    width: '100%', padding: '14px 16px',
                    background: selected ? C.purple : '#e5e5e5',
                    color: selected ? C.white : '#a3a3a3',
                    border: 'none', borderRadius: 12,
                    fontSize: 15, fontWeight: 600,
                    cursor: selected ? 'pointer' : 'default',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'background 0.2s, color 0.2s',
                  }}
                >
                  Submit
                </button>
                <button
                  onClick={handleClose}
                  style={{
                    width: '100%', padding: '12px 16px',
                    background: 'transparent', border: 'none',
                    fontSize: 15, fontWeight: 500, color: '#8a8693',
                    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Skip for now
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Bottom app nav ── */}
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
