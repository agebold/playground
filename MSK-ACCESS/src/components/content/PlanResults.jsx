import { C, PurpleButton } from './shared.jsx'
import boldWordmark from '../../assets/bold-logo@2x.png'
import WindIcon    from '../../assets/Wind.svg'
import LightbulbIcon from '../../assets/Lightbulb.svg'
import GaugeIcon   from '../../assets/Gauge.svg'
import TrendUpIcon from '../../assets/TrendUp.svg'
import PlantIcon   from '../../assets/Plant.svg'
import HeartbeatIcon from '../../assets/Heartbeat.svg'

const BLUE = '#1A3380'
const BLUE_BG = '#ebf0ff'

const phases = [
  {
    name: 'Calm',
    active: true,
    description: 'Manage daily symptoms with non-strenuous techniques. Learn to identify your "safe zone" for movement and integrate recovery moments.',
    items: [
      { icon: WindIcon,     label: 'Gentle mobility and breathing' },
      { icon: LightbulbIcon, label: 'Pain education' },
    ],
  },
  {
    name: 'Build',
    active: false,
    description: "Gradually increase intensity and duration as you rebuild strength and endurance. Learn to identify and respect your body's new limits.",
    items: [
      { icon: GaugeIcon,   label: 'Gradual loading' },
      { icon: TrendUpIcon, label: 'Build strength and endurance' },
    ],
  },
  {
    name: 'Maintain',
    active: false,
    description: 'Expand your fitness and prevent future flare ups.',
    items: [
      { icon: PlantIcon,     label: 'Lifestyle integration' },
      { icon: HeartbeatIcon, label: 'Locking in healthy habits' },
    ],
  },
]

export default function PlanResults({ onNext }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>

      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', borderBottom: `1px solid ${C.border}`, flexShrink: 0,
      }}>
        <img src={boldWordmark} alt="Bold" style={{ height: 28, width: 'auto' }} />
        <span style={{ fontSize: 14, fontWeight: 600, color: '#16a34a' }}>Your plan</span>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 16px 16px' }}>

        <h2 style={{
          fontSize: 22, fontWeight: 600, color: C.text,
          lineHeight: 1.25, letterSpacing: -0.3, marginBottom: 8,
        }}>
          Here's how your Bold plan is formatted
        </h2>

        <p style={{ fontSize: 16, color: C.textSec, lineHeight: 1.4, marginBottom: 24 }}>
          You'll move through three phases <em>at your pace</em>, beginning with Calm.
        </p>

        {/* Phase cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {phases.map(phase => (
            <div
              key={phase.name}
              style={{
                background: C.white,
                border: `${phase.active ? '1.5px' : '1px'} solid ${phase.active ? BLUE : C.border}`,
                borderRadius: 14,
                padding: 16,
              }}
            >
              {/* Phase name */}
              <div style={{
                fontSize: 20, fontWeight: 600, color: BLUE,
                marginBottom: 4, letterSpacing: -0.2,
              }}>
                {phase.name}
              </div>

              {/* Description */}
              <p style={{
                fontSize: 16, color: C.textSec, lineHeight: 1.4,
                margin: '0 0 12px',
              }}>
                {phase.description}
              </p>

              {/* Sub-items */}
              <div style={{
                background: BLUE_BG, borderRadius: 10, padding: '10px 14px',
                display: 'flex', flexDirection: 'column', gap: 10,
              }}>
                {phase.items.map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src={item.icon} alt="" style={{ width: 20, height: 20, flexShrink: 0 }} />
                    <span style={{ fontSize: 16, fontWeight: 500, color: BLUE, lineHeight: 1.3 }}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Continue button */}
      <div style={{ flexShrink: 0, padding: '12px 16px 8px' }}>
        <PurpleButton onClick={onNext}>Continue</PurpleButton>
      </div>

    </div>
  )
}
