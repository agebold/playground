import { C, AppHeader, AppScreen, TrainerHero, ClassCard, TaskRow, Divider } from './shared.jsx'

export default function BaselineCaptured({ onNext }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.bg }}>
      <AppHeader showUseApp streak={1} onUseApp={onNext} />
      <AppScreen bottomNav="today">
        <div style={{ background: C.white, paddingBottom: 4 }}>
          <TrainerHero
            date="Thu, July 18th"
            greeting="Good morning, Carol"
            subtext="Fantastic work today. You've completed your baseline check-in — you're all set!"
          />
        </div>

        <div style={{ background: C.white, padding: '8px 16px 12px', margin: '8px 0' }}>
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 8 }}>
            <TaskRow status="done" label="First class taken" />
            <Divider />
            <TaskRow status="done" label="Weekly goal set" />
            <Divider />
            <TaskRow status="done" label="Baseline data captured" info />
          </div>
        </div>

        <div style={{ padding: '0 16px 16px' }}>
          <ClassCard
            title="18 min Mobility: Lower Body Flow"
            instructor="James Park"
            whyText="Keep building momentum. This class complements your upper body strength work nicely."
            onStart={onNext}
          />
        </div>
      </AppScreen>
    </div>
  )
}
