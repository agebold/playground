import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { C } from './shared.jsx'
import boldLogomark from '../../assets/bold-logomark.png'
import boldWordmark from '../../assets/bold-logo@2x.png'
import amorphousBlob from '../../assets/amorphous-blob.png'
import psfsWalking from '../../assets/PSFS-activity-walking.jpg'
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

const STEP2_COPY = {
  locked:    'Ready to get moving? Check in to unlock your move class.',
  completed: "Here's your updated move class for today.",
}

// ── Icons ────────────────────────────────────────────────────────────────────

function InfoIcon({ color = '#2563eb', size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="7" cy="7" r="5.5" stroke={color} strokeWidth="1.2"/>
      <path d="M7 6.5v2.5M7 5h.01" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
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

// ── Number scale ─────────────────────────────────────────────────────────────

function NumberScale({ value, onChange }) {
  const rows = [[0, 1, 2, 3, 4, 5], [6, 7, 8, 9, 10]]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {rows.map((row, ri) => (
        <div key={ri} style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {row.map(n => {
            const sel = value === n
            return (
              <div key={n} onClick={() => onChange(n)} style={{
                width: 52, height: 52, borderRadius: 12,
                background: sel ? C.purple : C.white,
                border: `1.5px solid ${sel ? C.purple : C.border}`,
                color: sel ? C.white : C.text,
                fontSize: 18, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}>{n}</div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function MonthlyV1({ viewMode = 'mobile' }) {
  const [showAvatar,   setShowAvatar]   = useState(false)
  const [showGreeting, setShowGreeting] = useState(false)
  const [showIntro,    setShowIntro]    = useState(false)
  const [showStep1,    setShowStep1]    = useState(false)
  const [showStep2,    setShowStep2]    = useState(false)
  const [response,     setResponse]     = useState(null)   // null | 'completed'
  const [showPlan,     setShowPlan]     = useState(false)

  // Check-in flow
  const [page,          setPage]          = useState('home')  // 'home' | 'checkin' | 'complete'
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedValue, setSelectedValue] = useState(null)

  const step2Ref = useRef(null)

  useEffect(() => {
    const t1 = setTimeout(() => setShowAvatar(true),   300)
    const t2 = setTimeout(() => setShowGreeting(true), 1600)
    const t3 = setTimeout(() => setShowIntro(true),    2900)
    const t4 = setTimeout(() => setShowStep1(true),    3800)
    const t5 = setTimeout(() => setShowStep2(true),    4500)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5) }
  }, [])

  // After returning from check-in, scroll Step 2 into view
  useEffect(() => {
    if (response !== 'completed') return
    const timer = setTimeout(() => {
      step2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 450) // wait for overlay slide-out to finish
    return () => clearTimeout(timer)
  }, [response])

  const handleBeginCheckin = () => {
    setPage('checkin')
    setQuestionIndex(0)
    setSelectedValue(null)
  }

  const handleBack = () => {
    if (questionIndex === 1) {
      setSelectedValue(null)
      setQuestionIndex(0)
    } else {
      setPage('home')
    }
  }

  const handleContinue = () => {
    if (selectedValue === null) return
    if (questionIndex === 0) {
      setSelectedValue(null)
      setQuestionIndex(1)
    } else {
      setPage('complete')
    }
  }

  const handleReturnHome = () => {
    setPage('home')
    setResponse('completed')
    setTimeout(() => setShowPlan(true), 500)
  }

  // ── Entry card (Step 1) ────────────────────────────────────────────────────

  const entryCard = (desktop = false) => desktop ? (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden', display: 'flex' }}>
      <div style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, alignSelf: 'flex-start', background: '#ebf0ff', borderRadius: 4, padding: '3px 8px' }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#2563eb' }}>Check in</span>
          <InfoIcon />
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#140d26', lineHeight: '26px' }}>Measure your progress</div>
          <div style={{ fontSize: 14, color: '#8a8693', marginTop: 3 }}>2 questions</div>
        </div>
        <button onClick={handleBeginCheckin} style={{
          alignSelf: 'flex-start', padding: '11px 20px',
          background: C.purple, color: C.white, border: 'none', borderRadius: 10,
          fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
        }}>Begin check in</button>
      </div>
      <div style={{ width: 300, flexShrink: 0 }}>
        <img src={psfsWalking} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    </div>
  ) : (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, alignSelf: 'flex-start', background: '#ebf0ff', borderRadius: 4, padding: '3px 8px' }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#2563eb' }}>Check in</span>
          <InfoIcon />
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#140d26', lineHeight: '26px' }}>Measure your progress</div>
          <div style={{ fontSize: 14, color: '#8a8693', marginTop: 3 }}>2 questions</div>
        </div>
        <button onClick={handleBeginCheckin} style={{
          width: '100%', padding: '12px 16px',
          background: C.purple, color: C.white, border: 'none', borderRadius: 10,
          fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
        }}>Begin check in</button>
      </div>
    </div>
  )

  // ── Class card ─────────────────────────────────────────────────────────────

  const classCard = (desktop = false) => desktop ? (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden', display: 'flex' }}>
      <div style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ background: '#ebf0ff', borderRadius: 4, padding: '3px 8px', display: 'inline-flex', alignItems: 'center', gap: 4, alignSelf: 'flex-start' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#2563eb' }}>Move class</span>
            <InfoIcon />
          </div>
          <div style={{ fontSize: 17, fontWeight: 600, color: '#140d26', lineHeight: '24px' }}>19 min Strength: Upper Body Basics</div>
          <div style={{ fontSize: 15, color: '#140d26' }}>Chris Litten</div>
        </div>
        <div style={{ background: '#ebf0ff', borderRadius: 12, padding: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src={imgTrainerAvatar} alt="" style={{ width: 22, height: 22, borderRadius: '50%' }} />
            <span style={{ fontSize: 15, fontWeight: 600, color: '#171717' }}>Why this class</span>
          </div>
          <p style={{ fontSize: 15, color: '#171717', lineHeight: '22px', margin: 0 }}>
            Based on your check-in responses, we think this class is a great fit for today.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
          <button style={{ width: '100%', padding: '12px 16px', background: C.purple, color: C.white, border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Start class</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <RefreshIcon />
            <span style={{ fontSize: 13, color: '#525252' }}>Not feeling this today?{' '}<span style={{ color: C.purple, fontWeight: 600 }}>Switch class</span></span>
          </div>
        </div>
      </div>
      <div style={{ width: 300, flexShrink: 0, position: 'relative' }}>
        <img src={imgClassThumbnail} alt="Class" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.88)', borderRadius: 10, padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, color: '#070101', border: `1px solid ${C.border}` }}>
          <svg width="13" height="15" viewBox="0 0 13 15" fill="none"><path d="M2 2h9v11l-4.5-3L2 13V2Z" stroke="#070101" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Save
        </div>
      </div>
    </div>
  ) : (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ position: 'relative', height: 140, overflow: 'hidden' }}>
        <img src={imgClassThumbnail} alt="Class" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(255,255,255,0.88)', borderRadius: 10, padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, color: '#070101', border: `1px solid ${C.border}` }}>
          <svg width="13" height="15" viewBox="0 0 13 15" fill="none"><path d="M2 2h9v11l-4.5-3L2 13V2Z" stroke="#070101" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Save
        </div>
      </div>
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ background: '#ebf0ff', borderRadius: 4, padding: '3px 8px', display: 'inline-flex', alignItems: 'center', gap: 4, alignSelf: 'flex-start' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#2563eb' }}>Move class</span>
          </div>
          <div style={{ fontSize: 17, fontWeight: 600, color: '#140d26', lineHeight: '23px' }}>19 min Strength: Upper Body Basics</div>
          <div style={{ fontSize: 15, color: '#140d26' }}>Chris Litten</div>
        </div>
        <div style={{ background: '#ebf0ff', borderRadius: 12, padding: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src={imgTrainerAvatar} alt="" style={{ width: 22, height: 22, borderRadius: '50%' }} />
            <span style={{ fontSize: 15, fontWeight: 600, color: '#171717' }}>Why this class</span>
          </div>
          <p style={{ fontSize: 15, color: '#171717', lineHeight: '22px', margin: 0 }}>
            Based on your check-in responses, we think this class is a great fit for today.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
          <button style={{ width: '100%', padding: '12px 16px', background: C.purple, color: C.white, border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Start class</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <RefreshIcon />
            <span style={{ fontSize: 13, color: '#525252' }}>Not feeling this today?{' '}<span style={{ color: C.purple, fontWeight: 600 }}>Switch class</span></span>
          </div>
        </div>
      </div>
    </div>
  )

  // ── Shared overlay header ──────────────────────────────────────────────────

  const overlayHeader = (showBack = true) => (
    <div style={{
      height: 56, flexShrink: 0, background: C.white,
      borderBottom: `1px solid ${C.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 16px',
    }}>
      {showBack ? (
        <button onClick={handleBack} style={{
          width: 36, height: 36, borderRadius: 10, background: C.bg,
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="9" height="15" viewBox="0 0 9 15" fill="none">
            <path d="M8 1L1 7.5L8 14" stroke={C.text} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      ) : <div style={{ width: 36 }} />}
      <img src={boldWordmark} alt="Bold" style={{ height: 30, width: 'auto' }} />
      <div style={{ width: 36 }} />
    </div>
  )

  // ── Check-in overlay ───────────────────────────────────────────────────────

  const checkinOverlay = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      {overlayHeader(true)}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={questionIndex}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25, ease }}
          >
            {/* Label */}
            <div style={{ fontSize: 14, fontWeight: 600, color: C.textSec, marginBottom: 6 }}>
              Question {questionIndex + 1} of 2
            </div>

            {/* Question text */}
            <div style={{ fontSize: 18, fontWeight: 500, color: C.text, lineHeight: 1.3, marginBottom: 8 }}>
              {questionIndex === 0
                ? <>How would you rate your <strong>knee pain</strong> on average over the last 7 days?</>
                : 'How would you rate your current ability to perform this activity?'}
            </div>

            {/* Q1 previous rating */}
            {questionIndex === 0 && (
              <div style={{ fontSize: 16, color: '#525252', marginBottom: 16 }}>
                You previously rated your pain an 8.
              </div>
            )}

            {/* Q2 extras */}
            {questionIndex === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                <div style={{ fontSize: 16, color: '#525252'}}>
                  You previously rated this activity a 5.
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderRadius: 12, overflow: 'hidden', border: `1px solid ${C.border}` }}>
                  <img src={psfsWalking} alt="Walking" style={{ height: 72, objectFit: 'cover' }} />
                  <div style={{ padding: '10px 14px' }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: '#140d26' }}>Walking</span>
                  </div>
                </div>
              </div>
            )}

            {/* Scale */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: C.textSec }}>
                  {questionIndex === 0 ? '0 = no pain' : '0 = unable'}
                </span>
                {questionIndex === 0 && <span style={{ fontSize: 18 }}>😊</span>}
              </div>
              <NumberScale value={selectedValue} onChange={setSelectedValue} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, color: C.textSec }}>
                  {questionIndex === 0 ? '10 = worst pain' : '10 = fully able'}
                </span>
                {questionIndex === 0 && <span style={{ fontSize: 18 }}>😢</span>}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Continue button */}
      <div style={{ padding: '12px 20px 24px', background: C.white, flexShrink: 0 }}>
        <button onClick={handleContinue} style={{
          width: '100%', padding: '14px 16px',
          background: selectedValue !== null ? C.purple : '#e5e5ea',
          color: selectedValue !== null ? C.white : '#8a8693',
          border: 'none', borderRadius: 12,
          fontSize: 15, fontWeight: 600,
          cursor: selectedValue !== null ? 'pointer' : 'default',
          fontFamily: 'Inter, sans-serif', transition: 'background 0.2s, color 0.2s',
        }}>Continue</button>
      </div>
    </div>
  )

  // ── Complete overlay ───────────────────────────────────────────────────────

  const completeOverlay = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      {overlayHeader(false)}

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 20px 16px' }}>
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.45, ease }}
          style={{
            width: 48, height: 48, borderRadius: '50%', background: '#22c55e',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
          }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M5.5 14.5l6 6 11-12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease, delay: 0.2 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#140d26', lineHeight: '30px', marginBottom: 8 }}>
            Thanks for checking in, Carol.
          </div>
          <div style={{ fontSize: 16, color: '#525252', lineHeight: '24px' }}>
            Based on your responses, we've updated your move class for today.
          </div>
        </motion.div>
      </div>

      {/* Fixed bottom actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease, delay: 0.35 }}
        style={{
          flexShrink: 0, padding: '12px 20px 24px',
          display: 'flex', flexDirection: 'column', gap: 10,
        }}
      >
        <button onClick={handleReturnHome} style={{
          width: '100%', padding: '14px 16px', background: C.purple, color: C.white,
          border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'Inter, sans-serif',
        }}>Begin move class</button>
        <button onClick={handleReturnHome} style={{
          width: '100%', padding: '14px 16px', background: C.white,
          border: `1.5px solid ${C.border}`, borderRadius: 12,
          fontSize: 15, fontWeight: 500, color: C.text,
          cursor: 'pointer', fontFamily: 'Inter, sans-serif',
        }}>Return to today's plan</button>
      </motion.div>
    </div>
  )

  // ── Slide overlay wrapper ──────────────────────────────────────────────────

  const overlayContent = page === 'checkin' ? checkinOverlay : page === 'complete' ? completeOverlay : null

  // ── Stepper bubbles ────────────────────────────────────────────────────────

  const step1Bubble = (mobile = true) => {
    const size = mobile ? 40 : 40
    return response ? (
      <div style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0, background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8.5l3.5 3.5 6.5-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
    ) : (
      <div style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0, background: C.white, border: `2px solid ${C.purple}`, boxShadow: '0 0 0 4px rgba(82,0,212,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.purple }} />
      </div>
    )
  }

  const step2Bubble = () => response ? (
    <div style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, background: C.white, border: `2px solid ${C.purple}`, boxShadow: '0 0 0 4px rgba(82,0,212,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.purple }} />
    </div>
  ) : (
    <div style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, background: C.white, border: `2px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <LockIcon />
    </div>
  )

  // ── Desktop layout ─────────────────────────────────────────────────────────

  if (viewMode === 'desktop') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', background: '#fafafa', minHeight: 560, position: 'relative' }}>

        {/* Nav */}
        <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, height: 60, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px' }}>
          <img src={boldLogomark} alt="Bold" style={{ height: 30, width: 'auto' }} />
          <div style={{ display: 'flex', gap: 4 }}>
            {[
              { label: 'Today', active: true, icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 7l6-5 6 5v7a.75.75 0 0 1-.75.75H10.5v-4h-5v4H2.75A.75.75 0 0 1 2 14V7Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg> },
              { label: 'Live classes', active: false, icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M7 6.5l4 1.5-4 1.5V6.5Z" fill="currentColor"/></svg> },
              { label: 'Explore', active: false, icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/></svg> },
            ].map(({ label, active, icon }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, cursor: 'pointer', background: active ? C.purpleLight : 'transparent', color: active ? C.purple : '#525252', fontSize: 14, fontWeight: active ? 600 : 400 }}>
                {icon} {label}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: C.purple, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white, fontSize: 13, fontWeight: 600 }}>CS</div>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="#8a8693" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 32px 48px' }}>

            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 40 }}>
              {showAvatar && (
                <motion.div {...slideUp(0)}>
                  <div style={{ position: 'relative', width: 200, height: 146, flexShrink: 0, overflow: 'visible' }}>
                    <img src={amorphousBlob} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', zIndex: 1 }}>
                      <img src={imgTrainer} alt="Trainer" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                    </div>
                    <div style={{ position: 'absolute', top: `calc(50% + ${80 * 0.354}px)`, left: `calc(50% + ${80 * 0.354}px)`, transform: 'translate(-50%, -50%)', zIndex: 2, width: 80 * 0.29, height: 80 * 0.29, borderRadius: '50%', background: C.white, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={boldLogomark} alt="Bold" style={{ width: 80 * 0.146, height: 'auto' }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {showGreeting && (
              <motion.div {...slideUp(0)} style={{ textAlign: 'center', marginTop: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#8a8693' }}>Mon, Sep 28th</div>
                <div style={{ fontSize: 30, fontWeight: 600, color: '#140d26', letterSpacing: '-0.8px', lineHeight: '38px' }}>Morning, Carol!</div>
              </motion.div>
            )}

            {showIntro && (
              <motion.div {...slideUp(0)} style={{ marginTop: 12, textAlign: 'center' }}>
                <p style={{ fontSize: 16, color: '#171717', lineHeight: '24px', margin: 0 }}>
                  Ready for a Bold day? Rate your knee pain and we'll serve up an appropriate class.
                </p>
              </motion.div>
            )}

            {showStep1 && (
              <motion.div {...slideUp(0)} style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 20, position: 'relative' }}>
                <div style={{ position: 'absolute', left: 19, top: 42, bottom: 56, width: 1, borderLeft: '1.5px dashed #e5e5e5', zIndex: 0 }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    {step1Bubble(false)}
                    <div>
                      <div style={{ fontSize: 14, color: '#171717', lineHeight: '22px' }}>Step 1</div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: '#171717', lineHeight: '24px' }}>Let's check in on your knee</div>
                    </div>
                  </div>
                  {!response && entryCard(true)}
                </div>

                <AnimatePresence>
                  {showStep2 && (
                    <motion.div ref={step2Ref} {...fadeIn(0)} style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', zIndex: 1 }}>
                      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                        {step2Bubble()}
                        <div style={{ paddingTop: 2 }}>
                          <div style={{ fontSize: 14, color: '#171717', lineHeight: '22px' }}>Step 2</div>
                          <div style={{ fontSize: 16, fontWeight: 600, color: response ? '#171717' : '#8a8693', lineHeight: '24px' }}>
                            {STEP2_COPY[response ? 'completed' : 'locked']}
                          </div>
                        </div>
                      </div>
                      <AnimatePresence>
                        {showPlan && (
                          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }}>
                            {classCard(true)}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>

        {/* Overlay */}
        <AnimatePresence>
          {overlayContent && (
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
              style={{ position: 'absolute', inset: 0, zIndex: 10 }}
            >
              {overlayContent}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // ── Mobile layout ──────────────────────────────────────────────────────────

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', background: '#fafafa', position: 'relative' }}>

      {/* Nav */}
      <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, height: 52, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', boxShadow: '0px 1px 2px rgba(16,24,40,0.05)' }}>
        <img src={boldLogomark} alt="Bold" style={{ height: 32, width: 'auto' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: C.purple, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white, fontSize: 13, fontWeight: 600 }}>CS</div>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="#8a8693" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 16px 0' }}>
          <AnimatePresence>
            {showAvatar && (
              <motion.div {...slideUp(0)} style={{ position: 'relative', width: 220, height: 160, flexShrink: 0, overflow: 'visible' }}>
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
                <div style={{ fontSize: 14, fontWeight: 600, color: '#8a8693', lineHeight: '22px' }}>Mon, Sep 28th</div>
                <div style={{ fontSize: 28, fontWeight: 600, color: '#140d26', lineHeight: '34px', letterSpacing: '-0.8px' }}>Morning, Carol!</div>
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

        <AnimatePresence>
          {showStep1 && (
            <motion.div {...slideUp(0)} style={{ padding: '24px 16px 8px', display: 'flex', flexDirection: 'column', gap: 24, position: 'relative' }}>
              <div style={{ position: 'absolute', left: 35, top: 64, bottom: 68, width: 1, borderLeft: '1.5px dashed #e5e5e5', zIndex: 0 }} />

              {/* Step 1 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  {step1Bubble(true)}
                  <div>
                    <div style={{ fontSize: 14, color: '#171717', lineHeight: '22px' }}>Step 1</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#171717', lineHeight: '24px' }}>Let's check in on your knee</div>
                  </div>
                </div>
                {!response && entryCard(false)}
              </div>

              {/* Step 2 */}
              <AnimatePresence>
                {showStep2 && (
                  <motion.div ref={step2Ref} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }} style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                      {step2Bubble()}
                      <div style={{ flex: 1, paddingTop: 2 }}>
                        <div style={{ fontSize: 14, color: '#171717', lineHeight: '22px' }}>Step 2</div>
                        <div style={{ fontSize: 16, fontWeight: 600, color: response ? '#171717' : '#8a8693', lineHeight: '24px' }}>
                          {STEP2_COPY[response ? 'completed' : 'locked']}
                        </div>
                      </div>
                    </div>
                    <AnimatePresence>
                      {showPlan && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
                          {classCard(false)}
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
          { label: 'Today', active: true, icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M2.5 9.5L11 3l8.5 6.5V19a1 1 0 0 1-1 1H3.5a1 1 0 0 1-1-1V9.5Z" fill="#ede9fe" stroke={C.purple} strokeWidth="1.5"/><path d="M8 20v-6h6v6" stroke={C.purple} strokeWidth="1.5"/></svg> },
          { label: 'Live', active: false, icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="2" y="4" width="18" height="14" rx="2" stroke="#8a8693" strokeWidth="1.5"/><path d="M9 8.5l5 3-5 3v-6Z" fill="#8a8693"/></svg> },
          { label: 'Explore', active: false, icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="2" y="2" width="8" height="8" rx="1.5" stroke="#8a8693" strokeWidth="1.5"/><rect x="12" y="2" width="8" height="8" rx="1.5" stroke="#8a8693" strokeWidth="1.5"/><rect x="2" y="12" width="8" height="8" rx="1.5" stroke="#8a8693" strokeWidth="1.5"/><rect x="12" y="12" width="8" height="8" rx="1.5" stroke="#8a8693" strokeWidth="1.5"/></svg> },
          { label: 'Menu', active: false, icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 6h16M3 11h16M3 16h16" stroke="#8a8693" strokeWidth="1.5" strokeLinecap="round"/></svg> },
        ].map(({ label, active, icon }) => (
          <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, background: active ? '#ede9fe' : 'transparent', borderRadius: 8, padding: '6px 0', cursor: 'pointer' }}>
            {icon}
            <span style={{ fontSize: 11, fontWeight: 600, color: active ? C.purple : '#140d26' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Check-in / Complete overlay */}
      <AnimatePresence>
        {overlayContent && (
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
            style={{ position: 'absolute', inset: 0, zIndex: 10 }}
          >
            {overlayContent}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
