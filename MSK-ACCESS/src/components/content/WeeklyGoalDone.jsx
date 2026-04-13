import { C, AppHeader, SafariBottomBar, PurpleButton, OutlineButton } from './shared.jsx'

export default function WeeklyGoalDone({ onNext }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      <AppHeader streak={1} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '40px 16px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        {/* Teal checkmark circle */}
        <div style={{
          width: 100, height: 100, borderRadius: '50%',
          background: '#d1fae5',
          border: '4px solid #34c759',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 24,
        }}>
          <svg width="44" height="36" viewBox="0 0 44 36" fill="none">
            <path d="M2 18L15 31L42 2" stroke="#34c759" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h2 style={{ fontSize: 26, fontWeight: 800, color: C.text, marginBottom: 12, lineHeight: 1.2 }}>
          You're all set!
        </h2>

        <p style={{ fontSize: 15, color: C.textSec, lineHeight: 1.6, maxWidth: 300, marginBottom: 10 }}>
          Amazing! You're just 2 days away from reaching your weekly goal.
        </p>

        <p style={{ fontSize: 14, color: C.textTert, marginBottom: 0 }}>
          You can always update your goal later.
        </p>
      </div>

      <div style={{ flexShrink: 0, padding: '12px 16px 8px', borderTop: `1px solid ${C.border}` }}>
        <PurpleButton onClick={onNext}>Return to Today's Plan</PurpleButton>
        <OutlineButton onClick={onNext}>Share class feedback</OutlineButton>
      </div>
      <SafariBottomBar />
    </div>
  )
}
