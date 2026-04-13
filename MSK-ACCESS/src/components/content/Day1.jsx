import { C, AppHeader, AppScreen, PurpleButton, TrainerHero, ClassCard, TaskRow, Divider } from './shared.jsx'

export default function Day1({ onNext }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.bg }}>
      <AppHeader showUseApp streak={0} onUseApp={onNext} />
      <AppScreen bottomNav="today">
        <div style={{ background: C.white, paddingBottom: 4 }}>
          <TrainerHero
            date="Wed, July 15th"
            greeting="Good morning, Carol"
            subtext="I'm Amanda, your Bold trainer. Welcome to Bold—I'm excited to support you on this journey."
          />
        </div>

        <div style={{ background: C.white, padding: '8px 16px 12px', margin: '8px 0' }}>
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 8 }}>
            <TaskRow status="done" label="Free access confirmed" info />
            <Divider />
            <TaskRow status="done" label="Personalized plan created" info />
            <Divider />
            <TaskRow status="next" label="Take your first class" />
          </div>
        </div>

        <div style={{ padding: '0 16px 16px' }}>
          <ClassCard
            title="19 min Strength: Upper Body Basics"
            instructor="Chris Litten"
            whyText="You mentioned knee comfort matters to you. This seated class is a great starting point."
            onStart={onNext}
          />
        </div>
      </AppScreen>
    </div>
  )
}
