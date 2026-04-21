import { C, AppHeader, AppScreen, TrainerHero, ClassCard, TaskRow, Divider, PurpleButton } from './shared.jsx'

export default function Day2({ onNext }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.bg }}>
      <AppHeader showUseApp streak={1} onUseApp={onNext} />
      <AppScreen bottomNav="today">
        <div style={{ background: C.white, paddingBottom: 4 }}>
          <TrainerHero
            date="Thu, July 18th"
            greeting="Welcome back, Carol"
            subtext="You're doing great! Today, we'll capture a quick health snapshot, then get you moving."
          />
        </div>

        <div style={{ background: C.white, padding: '8px 16px 12px', margin: '8px 0' }}>
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 8 }}>
            <TaskRow status="done" label="First class taken" />
            <Divider />
            <TaskRow status="done" label="Weekly goal set" />
            <Divider />
            <TaskRow status="next" label="Log your baseline" />
          </div>
        </div>

        {/* Check-in card */}
        <div style={{ padding: '0 16px 8px' }}>
          <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px 14px' }}>
              <div style={{
                fontSize: 11, fontWeight: 700, color: C.textTert,
                letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6,
              }}>
                Baseline check-in · ~3 min
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 6 }}>
                KOOS JR Questionnaire
              </div>
              <div style={{ fontSize: 13, color: C.textSec, marginBottom: 14, lineHeight: 1.5 }}>
                A short survey to measure your knee health baseline. We'll resurvey at 3 months.
              </div>
              <PurpleButton onClick={onNext}>Begin check-in</PurpleButton>
            </div>

            {/* Why we're asking */}
            <div style={{
              borderTop: `1px solid ${C.border}`, padding: '12px 16px',
              background: '#f8f4ff', display: 'flex', gap: 10,
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: '50%',
                background: `linear-gradient(135deg, #a78bfa, #7c3aed)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, flexShrink: 0,
              }}>
                <span>👩</span>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 2 }}>
                  Why are we asking this
                </div>
                <div style={{ fontSize: 12, color: C.textSec, lineHeight: 1.5 }}>
                  Your responses help us measure your progress and tailor your program over time. — Amanda
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Up next */}
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{
            background: C.white, borderRadius: 14, border: `1px solid ${C.border}`,
            padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 11, fontWeight: 700, color: C.textTert,
                letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 2,
              }}>
                Up next
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>Ready to get moving?</div>
              <div style={{ fontSize: 13, color: C.textSec }}>Your next class is ready when you are.</div>
            </div>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 5l5 5-5 5" stroke={C.textTert} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </AppScreen>
    </div>
  )
}
