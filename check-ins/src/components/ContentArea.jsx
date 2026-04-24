import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PhoneFrame, SafariBrowserChrome } from './content/shared.jsx'
import SessionBasedV1 from './content/SessionBasedV1.jsx'

const contentMap = {
  'session-based-v1': SessionBasedV1,
}

function ReplayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M11.5 7A4.5 4.5 0 1 1 7 2.5a4.48 4.48 0 0 1 3.18 1.32L11.5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11.5 2V5H8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function ContentArea({ step, onNext, onBack, onNavigate }) {
  const [replayKey, setReplayKey] = useState(0)
  const Component = contentMap[step.id]
  const isDesktop = step.viewType === 'desktop'

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 32px',
      background: '#f0eff4',
      overflow: 'auto',
      minHeight: 0,
      position: 'relative',
    }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}
        >
          {isDesktop ? (
            <SafariBrowserChrome>
              {Component
                ? <Component key={replayKey} onNext={onNext} onBack={onBack} onNavigate={onNavigate} />
                : <div style={{ padding: 40, color: '#999' }}>No content</div>}
            </SafariBrowserChrome>
          ) : (
            <div style={{ transform: 'scale(0.82)', transformOrigin: 'center center' }}>
              <PhoneFrame>
                {Component
                  ? <Component key={replayKey} onNext={onNext} onBack={onBack} onNavigate={onNavigate} />
                  : <div style={{ padding: 40, color: '#999' }}>No content</div>}
              </PhoneFrame>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <button
        onClick={() => setReplayKey(k => k + 1)}
        style={{
          position: 'absolute', bottom: 20, left: 20,
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '7px 12px',
          background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          fontSize: 12, fontWeight: 500, color: '#525252',
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        <ReplayIcon />
        Replay
      </button>
    </div>
  )
}
