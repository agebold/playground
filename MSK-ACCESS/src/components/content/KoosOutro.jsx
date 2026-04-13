import { C, AppHeader, SafariBottomBar, PurpleButton, OutlineButton } from './shared.jsx'

export default function KoosOutro({ onNext }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      <AppHeader streak={1} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '40px 16px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        {/* Teal checkmark circle */}
        <div style={{
          width: 88, height: 88, borderRadius: '50%',
          background: '#d1fae5',
          border: '4px solid #34c759',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 24,
        }}>
          <svg width="36" height="30" viewBox="0 0 36 30" fill="none">
            <path d="M2 15L12 25L34 2" stroke="#34c759" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h2 style={{ fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 12, lineHeight: 1.2 }}>
          Thank you, Carol!
        </h2>

        <p style={{ fontSize: 15, color: C.textSec, lineHeight: 1.6, maxWidth: 300, marginBottom: 28 }}>
          Your baseline has been recorded. We'll check in again in 3 months to see how much you've improved.
        </p>

        <div style={{ width: '100%', background: C.purpleLight, borderRadius: 12, padding: '14px 16px', textAlign: 'left' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 4 }}>What happens next?</div>
          <div style={{ fontSize: 13, color: C.textSec, lineHeight: 1.5 }}>
            Keep taking your classes and Bold will track your progress. Your first follow-up check-in is in 3 months.
          </div>
        </div>
      </div>

      <div style={{ flexShrink: 0, padding: '12px 16px 8px', borderTop: `1px solid ${C.border}` }}>
        <PurpleButton onClick={onNext}>Start class</PurpleButton>
        <OutlineButton onClick={onNext}>Return to Today's Plan</OutlineButton>
      </div>
      <SafariBottomBar />
    </div>
  )
}
