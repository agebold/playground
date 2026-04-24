import { AnimatePresence, motion } from 'framer-motion'
import { PhoneFrame, SafariBrowserChrome } from './content/shared.jsx'
import SessionBasedV1 from './content/SessionBasedV1.jsx'

const contentMap = {
  'session-based-v1': SessionBasedV1,
}

export default function ContentArea({ step, onNext, onBack, onNavigate }) {
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
                ? <Component onNext={onNext} onBack={onBack} onNavigate={onNavigate} />
                : <div style={{ padding: 40, color: '#999' }}>No content</div>}
            </SafariBrowserChrome>
          ) : (
            <div style={{ transform: 'scale(0.82)', transformOrigin: 'center center' }}>
              <PhoneFrame>
                {Component
                  ? <Component onNext={onNext} onBack={onBack} onNavigate={onNavigate} />
                  : <div style={{ padding: 40, color: '#999' }}>No content</div>}
              </PhoneFrame>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
