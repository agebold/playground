import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { C, PhoneFrame, SafariBrowserChrome } from './content/shared.jsx'
import Exploration1 from './content/Exploration1.jsx'
import Exploration2 from './content/Exploration2.jsx'
import Exploration3 from './content/Exploration3.jsx'
import MonthlyV1 from './content/MonthlyV1.jsx'

const contentMap = {
  'session-based-v1': Exploration1,
  'session-based-v2': Exploration2,
  'session-based-v3': Exploration3,
  'monthly-v1': MonthlyV1,
}

function ReplayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M11.5 7A4.5 4.5 0 1 1 7 2.5a4.48 4.48 0 0 1 3.18 1.32L11.5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11.5 2V5H8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="3" y="1" width="8" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <circle cx="7" cy="10.5" r="0.75" fill="currentColor"/>
    </svg>
  )
}

function MonitorIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="2" width="12" height="8" rx="1.2" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M5 10v2M9 10v2M3.5 12h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}

const pillBtn = {
  display: 'flex', alignItems: 'center', gap: 6,
  padding: '7px 12px',
  background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)',
  border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8,
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  cursor: 'pointer', fontFamily: 'Inter, sans-serif',
  fontSize: 12, fontWeight: 500, color: '#525252',
  transition: 'opacity 0.15s',
}

const MOBILE_ONLY = new Set(['session-based-v3'])

export default function ContentArea({ step, onNext, onBack, onNavigate }) {
  const [replayKey, setReplayKey] = useState(0)
  const [viewMode, setViewMode] = useState('mobile')
  const Component = contentMap[step.id]

  const mobileOnly = MOBILE_ONLY.has(step.id)
  const effectiveViewMode = mobileOnly ? 'mobile' : viewMode

  const handleToggle = () => {
    if (mobileOnly) return
    setViewMode(v => v === 'mobile' ? 'desktop' : 'mobile')
    setReplayKey(k => k + 1)
  }

  return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '48px 32px', background: '#f0eff4', overflow: 'auto',
      minHeight: 0, position: 'relative',
    }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${step.id}-${effectiveViewMode}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}
        >
          {effectiveViewMode === 'desktop' ? (
            <SafariBrowserChrome>
              {Component
                ? <Component key={replayKey} viewMode="desktop" onNext={onNext} onBack={onBack} onNavigate={onNavigate} />
                : <div style={{ padding: 40, color: '#999' }}>No content</div>}
            </SafariBrowserChrome>
          ) : (
            <div style={{ transform: 'scale(0.82)', transformOrigin: 'center center' }}>
              <PhoneFrame showSafariBar={!mobileOnly}>
                {Component
                  ? <Component key={replayKey} viewMode="mobile" onNext={onNext} onBack={onBack} onNavigate={onNavigate} />
                  : <div style={{ padding: 40, color: '#999' }}>No content</div>}
              </PhoneFrame>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <button
        onClick={() => setReplayKey(k => k + 1)}
        style={{ position: 'absolute', bottom: 20, left: 20, ...pillBtn }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        <ReplayIcon /> Replay
      </button>

      {/* Segmented control */}
      <div style={{
        position: 'absolute', bottom: 20, right: 20,
        display: 'flex',
        background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)',
        border: '1px solid rgba(0,0,0,0.1)', borderRadius: 10,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        padding: 3, gap: 2,
        opacity: mobileOnly ? 0.4 : 1,
        pointerEvents: mobileOnly ? 'none' : 'auto',
        transition: 'opacity 0.2s',
      }}>
        {[
          { mode: 'mobile', icon: <PhoneIcon />, label: 'Mobile' },
          { mode: 'desktop', icon: <MonitorIcon />, label: 'Desktop' },
        ].map(({ mode, icon, label }) => {
          const active = effectiveViewMode === mode
          return (
            <button
              key={mode}
              onClick={() => { if (!active) handleToggle() }}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '5px 10px', borderRadius: 7, border: 'none',
                background: active ? C.white : 'transparent',
                boxShadow: active ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                cursor: active ? 'default' : 'pointer',
                fontFamily: 'Inter, sans-serif',
                fontSize: 12, fontWeight: active ? 600 : 400,
                color: active ? '#171717' : '#8a8693',
                transition: 'all 0.15s',
              }}
            >
              {icon} {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
