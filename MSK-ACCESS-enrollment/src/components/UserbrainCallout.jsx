import { useEffect, useState } from 'react'
import { C } from './content/shared.jsx'

// Reminds the participant of testing instructions at key moments in the flow.
export default function UserbrainCallout({ show, message, side = 'right', onDismiss }) {
  const [mounted, setMounted] = useState(false)
  const [entered, setEntered] = useState(false)
  const isLeft = side === 'left'

  useEffect(() => {
    let popInTimer, unmountTimer
    if (show) {
      setMounted(true)
      popInTimer = setTimeout(() => setEntered(true), 1200)
    } else {
      setEntered(false)
      unmountTimer = setTimeout(() => setMounted(false), 350)
    }
    return () => {
      clearTimeout(popInTimer)
      clearTimeout(unmountTimer)
    }
  }, [show])

  if (!mounted) return null

  return (
    <div
      style={{
        position: 'fixed',
        ...(isLeft ? { top: '50%', transform: 'translateY(-50%)' } : { top: 78 }),
        ...(isLeft ? { right: 'calc(50% + 180px)' } : { right: 20 }),
        zIndex: 9,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}
    >
      <div style={{
        pointerEvents: 'none',
        opacity: entered ? 1 : 0,
        transform: entered ? 'scale(1) translateY(0)' : 'scale(0.82) translateY(14px)',
        transformOrigin: 'top right',
        transition: 'opacity 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        <div style={{
          maxWidth: 240,
          background: '#ffffff',
          borderRadius: 14,
          padding: '14px 16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
          border: '1px solid #e5e5ea',
          fontSize: 15,
          fontWeight: 600,
          color: '#1c1c1e',
          lineHeight: 1.4,
          textAlign: 'left',
          fontFamily: 'Inter, sans-serif',
          pointerEvents: 'auto',
        }}>
          {message}
          {onDismiss && (
            <button
              onClick={onDismiss}
              style={{
                display: 'block',
                marginTop: 12,
                marginLeft: 'auto',
                padding: '7px 18px',
                background: C.purple,
                color: '#ffffff',
                border: 'none',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer',
              }}
            >
              Okay
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
