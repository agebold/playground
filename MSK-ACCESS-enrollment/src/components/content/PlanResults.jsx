import { C, PurpleButton } from './shared.jsx'
import boldWordmark from '../../assets/bold-logo@2x.png'
import PottedPlantIcon    from '../../assets/PottedPlant.svg'
import MountainsIcon      from '../../assets/Mountains.svg'
import PersonWalkIcon     from '../../assets/PersonSimpleWalk.svg'

const phases = [
  {
    name: 'Calm',
    icon: PottedPlantIcon,
    description: 'Clear a path. Find movement that feels safe and manageable.',
    border:  '#93c5fd',
    bg:      '#eff6ff',
    iconBg:  '#dbeafe',
    nameColor: '#1e40af',
    descColor: '#1e40af',
  },
  {
    name: 'Build',
    icon: MountainsIcon,
    description: 'Gain strength and confidence as your body adapts.',
    bg:      '#f0fdf4',
    iconBg:  '#bbf7d0',
    nameColor: '#166534',
    descColor: '#166534',
  },
  {
    name: 'Maintain',
    icon: PersonWalkIcon,
    description: 'Keep going—on your own terms, at your own pace.',
    bg:      '#f0f9ff',
    iconBg:  '#bae6fd',
    nameColor: '#075985',
    descColor: '#075985',
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
          lineHeight: 1.2, letterSpacing: -0.4, marginBottom: 10,
        }}>
          Here's how your plan is built
        </h2>

        <p style={{ fontSize: 16, color: C.textSec, lineHeight: 1.4, marginBottom: 24 }}>
          Every journey is unique. You'll move through three phases at your pace, beginning with Calm.
        </p>

        {/* Phase cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {phases.map(phase => (
            <div
              key={phase.name}
              style={{
                background: phase.bg,
                border: `1.5px solid ${phase.border}`,
                borderRadius: 16,
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}
            >
              {/* Icon circle */}
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: phase.iconBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <img src={phase.icon} alt="" style={{ width: 26, height: 26 }} />
              </div>

              {/* Text */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 18, fontWeight: 600, color: phase.nameColor,
                  marginBottom: 0, letterSpacing: -0.2,
                }}>
                  {phase.name}
                </div>
                <p style={{
                  fontSize: 16, color: phase.descColor, lineHeight: 1.4,
                  margin: 0, opacity: 0.85,
                }}>
                  {phase.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* CTA button */}
      <div style={{ flexShrink: 0, padding: '12px 16px 8px' }}>
        <PurpleButton onClick={onNext}>See today's plan</PurpleButton>
      </div>

    </div>
  )
}
