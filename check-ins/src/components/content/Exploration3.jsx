import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import boldLogomark from '../../assets/bold-logomark.png'

const ease = [0.16, 1, 0.3, 1]

const imgClassThumbnail = "https://www.figma.com/api/mcp/asset/840daf89-98b2-4c8b-ad14-8d73ddc642ce"

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
  "Move class":   { bg: '#ebf0ff', color: '#2563eb' },
  "Gentle class": { bg: '#f0fdf4', color: '#16a34a' },
  "Learn class":        { bg: '#ebf0ff', color: '#2563eb' },
}

function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: 5, alignItems: 'center', padding: '3px 2px' }}>
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          style={{ width: 7, height: 7, borderRadius: '50%', background: '#9ca3af' }}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.65, repeat: Infinity, delay: i * 0.16, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

function BoldAvatar({ size = 28, visible = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.7 }}
      transition={{ duration: 0.4, ease }}
      style={{
        width: size, height: size, borderRadius: '50%', background: '#5200d4', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2,
      }}
    >
      <img src={boldLogomark} alt="" style={{ width: size * 0.5, height: 'auto', filter: 'brightness(0) invert(1)' }} />
    </motion.div>
  )
}

function RichCard({ card }) {
  const tagStyle = TAG_COLORS[card.tag] ?? { bg: '#f3f4f6', color: '#374151' }
  return (
    <div style={{
      background: 'white', borderRadius: 16, overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.10)', border: '1px solid rgba(0,0,0,0.06)',
    }}>
      {/* Thumbnail */}
      <div style={{ height: 130, overflow: 'hidden' }}>
        <img src={imgClassThumbnail} alt="Class" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      {/* Content */}
      <div style={{ padding: '12px 14px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Tag */}
          <div style={{
            display: 'inline-flex', alignSelf: 'flex-start',
            background: tagStyle.bg, borderRadius: 4,
            padding: '2px 8px',
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: tagStyle.color, letterSpacing: '0.02em' }}>
              {card.tag.toUpperCase()}
            </span>
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#202124', lineHeight: '21px' }}>{card.title}</div>
          <div style={{ fontSize: 13, color: '#80868b' }}>{card.instructor}</div>
        </div>
        {/* CTA */}
        <button style={{
          width: '100%', padding: '11px 16px',
          background: '#5200d4', color: 'white', border: 'none', borderRadius: 10,
          fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
        }}>
          {card.cta}
        </button>
      </div>
    </div>
  )
}

export default function Exploration3({ viewMode = 'mobile', onNext, onBack, onNavigate }) {
  const [showTyping, setShowTyping]         = useState(false)
  const [showMessage, setShowMessage]       = useState(false)
  const [showChips, setShowChips]           = useState(false)
  const [selected, setSelected]             = useState(null)
  const [showRespTyping, setShowRespTyping] = useState(false)
  const [showRespMessage, setShowRespMessage] = useState(false)
  const [showRespCard, setShowRespCard]     = useState(false)

  const chatRef = useRef(null)

  useEffect(() => {
    const t1 = setTimeout(() => setShowTyping(true),                        600)
    const t2 = setTimeout(() => { setShowTyping(false); setShowMessage(true) }, 2000)
    const t3 = setTimeout(() => setShowChips(true),                        3500)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  // Auto-scroll when Bold's card appears
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

    const r1 = setTimeout(() => setShowRespTyping(true),                          900)
    const r2 = setTimeout(() => { setShowRespTyping(false); setShowRespMessage(true) }, 2200)
    const r3 = setTimeout(() => setShowRespCard(true),                           3000)
    // no cleanup needed — selection is a one-time event
    return () => { clearTimeout(r1); clearTimeout(r2); clearTimeout(r3) }
  }

  const response = selected ? RESPONSES[selected] : null

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden',
      background: '#f0f4f9', fontFamily: 'Inter, sans-serif',
    }}>

      {/* Header */}
      <div style={{
        background: 'white', flexShrink: 0,
        height: 56, display: 'flex', alignItems: 'center',
        padding: '0 4px', gap: 4,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}>
        <button style={{
          width: 40, height: 40, borderRadius: '50%',
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12.5 15L7.5 10l5-5" stroke="#3c4043" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%', background: '#5200d4', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <img src={boldLogomark} alt="Bold" style={{ width: 18, height: 'auto', filter: 'brightness(0) invert(1)' }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#202124', lineHeight: '20px' }}>Bold</div>
            <div style={{ fontSize: 12, color: '#80868b', lineHeight: '16px' }}>Better balance and less pain</div>
          </div>
        </div>
        <button style={{
          width: 40, height: 40, borderRadius: '50%',
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width="4" height="18" viewBox="0 0 4 18" fill="none">
            <circle cx="2" cy="2" r="1.5" fill="#3c4043"/>
            <circle cx="2" cy="9" r="1.5" fill="#3c4043"/>
            <circle cx="2" cy="16" r="1.5" fill="#3c4043"/>
          </svg>
        </button>
      </div>

      {/* Chat area */}
      <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: '20px 12px 16px', display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* Timestamp */}
        <div style={{ textAlign: 'center', fontSize: 12, color: '#80868b', marginBottom: 16 }}>
          Today 8:30 AM
        </div>

        {/* ── Incoming question ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, maxWidth: '88%' }}>
          <BoldAvatar visible={showMessage} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>

            {/* Typing → question message */}
            <AnimatePresence mode="wait">
              {showTyping && !showMessage && (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.3, ease }}
                  style={{
                    background: 'white', alignSelf: 'flex-start',
                    borderRadius: '18px 18px 18px 4px',
                    padding: '10px 16px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.09)',
                  }}
                >
                  <TypingDots />
                </motion.div>
              )}
              {showMessage && (
                <motion.div
                  key="message"
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, ease }}
                  style={{
                    background: 'white',
                    borderRadius: '18px 18px 18px 4px',
                    padding: '12px 16px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.09)',
                  }}
                >
                  <p style={{ margin: 0, fontSize: 15, color: '#202124', lineHeight: '22px' }}>
                    Hello Carol, how would you describe your knee pain today?
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick reply chips */}
            <AnimatePresence>
              {showChips && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                >
                  {OPTIONS.map((option, i) => {
                    const isSelected = selected === option
                    const isDimmed   = selected && !isSelected
                    return (
                      <motion.button
                        key={option}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: isDimmed ? 0.38 : 1, y: 0 }}
                        transition={{ duration: 1.35, ease, delay: i * 0.58 }}
                        onClick={() => handleSelect(option)}
                        style={{
                          background: isSelected ? '#5200d4' : 'white',
                          border: `1.5px solid ${isSelected ? '#5200d4' : '#c8cdd6'}`,
                          borderRadius: 20,
                          padding: '10px 16px',
                          fontSize: 14, fontWeight: 500, lineHeight: '20px',
                          color: isSelected ? 'white' : '#5200d4',
                          cursor: selected ? 'default' : 'pointer',
                          textAlign: 'left',
                          fontFamily: 'Inter, sans-serif',
                          transition: 'background 0.18s, border-color 0.18s, color 0.18s',
                          boxShadow: isSelected ? '0 1px 4px rgba(82,0,212,0.2)' : '0 1px 2px rgba(0,0,0,0.06)',
                        }}
                      >
                        {option}
                      </motion.button>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── User's sent reply ── */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease, delay: 0.18 }}
              style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}
            >
              <div style={{
                background: '#5200d4',
                borderRadius: '18px 18px 4px 18px',
                padding: '12px 16px', maxWidth: '78%',
                boxShadow: '0 1px 3px rgba(82,0,212,0.25)',
              }}>
                <p style={{ margin: 0, fontSize: 15, color: 'white', lineHeight: '22px' }}>{selected}</p>
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
              style={{ display: 'flex', alignItems: 'flex-start', gap: 8, maxWidth: '88%', marginTop: 16 }}
            >
              <BoldAvatar visible={showRespMessage} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>

                {/* Typing → response message */}
                <AnimatePresence mode="wait">
                  {showRespTyping && !showRespMessage && (
                    <motion.div
                      key="resp-typing"
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.3, ease }}
                      style={{
                        background: 'white', alignSelf: 'flex-start',
                        borderRadius: '18px 18px 18px 4px',
                        padding: '10px 16px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.09)',
                      }}
                    >
                      <TypingDots />
                    </motion.div>
                  )}
                  {showRespMessage && response && (
                    <motion.div
                      key="resp-message"
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.4, ease }}
                      style={{
                        background: 'white',
                        borderRadius: '18px 18px 18px 4px',
                        padding: '12px 16px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.09)',
                      }}
                    >
                      <p style={{ margin: 0, fontSize: 15, color: '#202124', lineHeight: '22px' }}>
                        {response.text}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Rich card */}
                <AnimatePresence>
                  {showRespCard && response && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.45, ease }}
                    >
                      <RichCard card={response.card} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Spacer so card isn't clipped at the bottom */}
        <div style={{ height: 8, flexShrink: 0 }} />
      </div>

      {/* Reply bar */}
      <div style={{
        background: 'white', flexShrink: 0,
        borderTop: '1px solid rgba(0,0,0,0.08)',
        padding: '8px 12px',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div style={{
          flex: 1, background: '#f1f3f4', borderRadius: 24,
          padding: '10px 16px', fontSize: 15, color: '#9aa0a6',
        }}>
          Reply
        </div>
        <button style={{
          width: 40, height: 40, borderRadius: '50%',
          background: '#5200d4', border: 'none', cursor: 'pointer', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3 9h12M10 4l5 5-5 5" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
