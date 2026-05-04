import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import boldLogomark from '../../assets/bold-logomark.png'
import imgClassThumbnail from '../../assets/class-thumbnail.jpg'

const ease = [0.16, 1, 0.3, 1]
const SF   = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif"
const iBlue   = '#007AFF'
const iBubble = '#E5E5EA'   // received bubble background
const iGlass  = 'rgba(242,242,247,0.92)'
const iHair   = '0.5px solid rgba(60,60,67,0.29)'

const OPTIONS = [
  "I'm feeling pain-free today",
  "I'm in some pain, but can do my scheduled class",
  "I'm in pain and would like a gentle class",
  "I'm in severe pain and cannot exercise today",
]

const RESPONSES = {
  "I'm feeling pain-free today": {
    text: "Love to hear it, Carol! 🎉 Your planned class is loaded and ready — let's make the most of your pain-free day.",
    card: { tag: "Move class", title: "19 min Strength: Upper Body Basics", instructor: "Chris Litten", cta: "Start class" },
  },
  "I'm in some pain, but can do my scheduled class": {
    text: "Sounds good, Carol. Listen to your body and go at your own pace — your class is ready when you are.",
    card: { tag: "Move class", title: "19 min Strength: Upper Body Basics", instructor: "Chris Litten", cta: "Start class" },
  },
  "I'm in pain and would like a gentle class": {
    text: "We've got you, Carol. We've swapped today's class for something gentler on your knee.",
    card: { tag: "Move class", title: "15 min Seated Gentle Stretch", instructor: "Chris Litten", cta: "Start class" },
  },
  "I'm in severe pain and cannot exercise today": {
    text: "Sorry to hear that, Carol. Rest up — here's something to keep you engaged while you recover.",
    card: { tag: "Learn class", title: "Understanding and Managing Knee Pain", instructor: "Bold Health", cta: "Read now" },
  },
}

const TAG_COLORS = {
  "Move class":  { bg: '#ebf0ff', color: '#2563eb' },
  "Learn class": { bg: '#fef9c3', color: '#854d0e' },
}

// ── Typing indicator ────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: 5, alignItems: 'center', height: 20 }}>
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          style={{ width: 8, height: 8, borderRadius: '50%', background: '#8E8E93' }}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.75, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

// ── Bold sender avatar ──────────────────────────────────────────────────────

function BoldAvatar({ size = 26, visible = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.7 }}
      transition={{ duration: 0.3, ease }}
      style={{
        width: size, height: size, borderRadius: '50%',
        background: '#5200d4', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <img
        src={boldLogomark}
        alt=""
        style={{ width: size * 0.52, height: 'auto', filter: 'brightness(0) invert(1)' }}
      />
    </motion.div>
  )
}

// ── Rich class card ─────────────────────────────────────────────────────────

function RichCard({ card }) {
  const tag = TAG_COLORS[card.tag] ?? { bg: '#f3f4f6', color: '#374151' }
  return (
    <div style={{
      background: 'white', borderRadius: 16, overflow: 'hidden',
      boxShadow: '0 2px 12px rgba(0,0,0,0.13)',
      border: '0.5px solid rgba(0,0,0,0.08)',
    }}>
      <div style={{ height: 118, overflow: 'hidden' }}>
        <img src={imgClassThumbnail} alt="Class" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ padding: '12px 14px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{
            display: 'inline-flex', alignSelf: 'flex-start',
            background: tag.bg, borderRadius: 4, padding: '2px 7px',
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: tag.color, letterSpacing: '0.03em', fontFamily: SF }}>
              {card.tag.toUpperCase()}
            </span>
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#000', lineHeight: '20px', fontFamily: SF }}>
            {card.title}
          </div>
          <div style={{ fontSize: 13, color: '#8E8E93', fontFamily: SF }}>{card.instructor}</div>
        </div>
        <button style={{
          width: '100%', padding: '10px 16px',
          background: iBlue, color: 'white', border: 'none', borderRadius: 10,
          fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: SF,
        }}>
          {card.cta}
        </button>
      </div>
    </div>
  )
}

// ── Main component ──────────────────────────────────────────────────────────

export default function Exploration3({ viewMode = 'mobile', onNext, onBack, onNavigate }) {
  const [showTyping,      setShowTyping]      = useState(false)
  const [showMessage,     setShowMessage]     = useState(false)
  const [showChips,       setShowChips]       = useState(false)
  const [selected,        setSelected]        = useState(null)
  const [showRespTyping,  setShowRespTyping]  = useState(false)
  const [showRespMessage, setShowRespMessage] = useState(false)
  const [showRespCard,    setShowRespCard]    = useState(false)

  const chatRef = useRef(null)

  useEffect(() => {
    const t1 = setTimeout(() => setShowTyping(true),                              600)
    const t2 = setTimeout(() => { setShowTyping(false); setShowMessage(true) }, 2000)
    const t3 = setTimeout(() => setShowChips(true),                             3500)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  useEffect(() => {
    if (!showRespCard) return
    const timer = setTimeout(() => {
      chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' })
    }, 300)
    return () => clearTimeout(timer)
  }, [showRespCard])

  const handleSelect = (option) => {
    if (selected) return
    setSelected(option)
    const r1 = setTimeout(() => setShowRespTyping(true),                              900)
    const r2 = setTimeout(() => { setShowRespTyping(false); setShowRespMessage(true) }, 2200)
    const r3 = setTimeout(() => setShowRespCard(true),                              3000)
    return () => { clearTimeout(r1); clearTimeout(r2); clearTimeout(r3) }
  }

  const response = selected ? RESPONSES[selected] : null

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden',
      background: 'white', fontFamily: SF,
    }}>

      {/* ── iMessage nav bar — Liquid Glass ── */}
      <div style={{
        height: 52, flexShrink: 0,
        background: iGlass,
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        borderBottom: iHair,
        display: 'flex', alignItems: 'center',
        padding: '0 6px 0 0',
        position: 'relative',
      }}>

        {/* Back: < Messages */}
        <button style={{
          display: 'flex', alignItems: 'center', gap: 1,
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '0 4px 0 6px', flexShrink: 0,
          position: 'relative', zIndex: 1,
        }}>
          <svg width="11" height="18" viewBox="0 0 11 18" fill="none">
            <path d="M9.5 1.5L1.5 9l8 7.5" stroke={iBlue} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontSize: 17, color: iBlue, marginLeft: 3 }}>Messages</span>
        </button>

        {/* Center: avatar + name — absolutely centered */}
        <div style={{
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
          pointerEvents: 'none',
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%', background: '#5200d4',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <img src={boldLogomark} alt="Bold" style={{ width: 15, height: 'auto', filter: 'brightness(0) invert(1)' }} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#000', lineHeight: '14px' }}>Bold</span>
        </div>

        {/* Spacer to push right icons to edge */}
        <div style={{ flex: 1 }} />

        {/* Right: video + info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, paddingRight: 6, position: 'relative', zIndex: 1 }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}>
            <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
              <rect x="1" y="2" width="13" height="12" rx="2.5" fill={iBlue}/>
              <path d="M14 5.5L21 2.5v11l-7-3V5.5Z" fill={iBlue}/>
            </svg>
          </button>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="10" fill={iBlue}/>
              <path d="M11 10v6" stroke="white" strokeWidth="1.9" strokeLinecap="round"/>
              <circle cx="11" cy="6.5" r="1.1" fill="white"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Chat scroll area ── */}
      <div ref={chatRef} style={{
        flex: 1, overflowY: 'auto',
        padding: '10px 12px 12px',
        display: 'flex', flexDirection: 'column',
        background: 'white',
      }}>

        {/* Timestamp */}
        <div style={{
          textAlign: 'center', fontSize: 12, fontWeight: 500,
          color: '#8E8E93', marginBottom: 14,
          letterSpacing: '0.01em',
        }}>
          Today 8:30 AM
        </div>

        {/* ── Incoming: typing → question ── */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, marginBottom: 4, maxWidth: '82%' }}>
          <BoldAvatar visible={showMessage} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
            <AnimatePresence mode="wait">
              {showTyping && !showMessage && (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0, scale: 0.8, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.88, transition: { duration: 0.15 } }}
                  transition={{ duration: 0.25, ease }}
                  style={{
                    background: iBubble,
                    borderRadius: '18px 18px 18px 4px',
                    padding: '10px 14px',
                    alignSelf: 'flex-start',
                  }}
                >
                  <TypingDots />
                </motion.div>
              )}
              {showMessage && (
                <motion.div
                  key="message"
                  initial={{ opacity: 0, scale: 0.88, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.3, ease }}
                  style={{
                    background: iBubble,
                    borderRadius: '18px 18px 18px 4px',
                    padding: '10px 14px',
                  }}
                >
                  <p style={{ margin: 0, fontSize: 16, color: '#000', lineHeight: '22px' }}>
                    Hello Carol, how would you describe your knee pain today?
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Quick reply chips ── */}
        <AnimatePresence>
          {showChips && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                display: 'flex', flexDirection: 'column', gap: 7,
                marginLeft: 32, marginBottom: 10,
              }}
            >
              {OPTIONS.map((option, i) => {
                const isSelected = selected === option
                const isDimmed   = selected && !isSelected
                return (
                  <motion.button
                    key={option}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: isDimmed ? 0.28 : 1, x: 0 }}
                    transition={{ duration: 0.38, ease, delay: i * 0.5 }}
                    onClick={() => handleSelect(option)}
                    style={{
                      alignSelf: 'flex-start',
                      background: isSelected ? iBlue : 'transparent',
                      border: `1.5px solid ${iBlue}`,
                      borderRadius: 18,
                      padding: '8px 15px',
                      fontSize: 15, fontWeight: 400, lineHeight: '20px',
                      color: isSelected ? 'white' : iBlue,
                      cursor: selected ? 'default' : 'pointer',
                      textAlign: 'left', fontFamily: SF,
                      transition: 'background 0.15s, color 0.15s',
                    }}
                  >
                    {option}
                  </motion.button>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── User's sent reply (blue iMessage bubble) ── */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease, delay: 0.1 }}
              style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}
            >
              <div style={{
                background: iBlue,
                borderRadius: '18px 18px 4px 18px',
                padding: '10px 14px',
                maxWidth: '75%',
              }}>
                <p style={{ margin: 0, fontSize: 16, color: 'white', lineHeight: '22px' }}>
                  {selected}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Bold's contextual response ── */}
        <AnimatePresence>
          {(showRespTyping || showRespMessage) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ display: 'flex', alignItems: 'flex-end', gap: 6, maxWidth: '82%', marginTop: 6 }}
            >
              <BoldAvatar visible={showRespMessage} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>

                <AnimatePresence mode="wait">
                  {showRespTyping && !showRespMessage && (
                    <motion.div
                      key="resp-typing"
                      initial={{ opacity: 0, scale: 0.8, y: 6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.88, transition: { duration: 0.15 } }}
                      transition={{ duration: 0.25, ease }}
                      style={{
                        background: iBubble,
                        borderRadius: '18px 18px 18px 4px',
                        padding: '10px 14px',
                        alignSelf: 'flex-start',
                      }}
                    >
                      <TypingDots />
                    </motion.div>
                  )}
                  {showRespMessage && response && (
                    <motion.div
                      key="resp-message"
                      initial={{ opacity: 0, scale: 0.88, y: 6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.3, ease }}
                      style={{
                        background: iBubble,
                        borderRadius: '18px 18px 18px 4px',
                        padding: '10px 14px',
                      }}
                    >
                      <p style={{ margin: 0, fontSize: 16, color: '#000', lineHeight: '22px' }}>
                        {response.text}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Rich card */}
                <AnimatePresence>
                  {showRespCard && response && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.4, ease }}
                    >
                      <RichCard card={response.card} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ height: 8, flexShrink: 0 }} />
      </div>

      {/* ── iMessage input bar — Liquid Glass ── */}
      <div style={{
        flexShrink: 0,
        background: iGlass,
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        borderTop: iHair,
        padding: '8px 12px 10px',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        {/* + / camera button */}
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, padding: 0, display: 'flex' }}>
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <circle cx="15" cy="15" r="15" fill={iBlue}/>
            <path d="M10 15h10M15 10v10" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Text field */}
        <div style={{
          flex: 1, height: 36,
          background: 'white',
          border: `1px solid #C7C7CC`,
          borderRadius: 18,
          padding: '0 14px',
          fontSize: 16, color: '#C7C7CC',
          display: 'flex', alignItems: 'center',
        }}>
          iMessage
        </div>

        {/* Mic / send */}
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, padding: 0, display: 'flex' }}>
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <circle cx="15" cy="15" r="15" fill={iBlue}/>
            <path d="M15 21V9M10 14l5-5 5 5" stroke="white" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

    </div>
  )
}
