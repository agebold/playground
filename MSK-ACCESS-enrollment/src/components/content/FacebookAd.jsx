import { C } from './shared.jsx'
import facebookAdImg from '../../assets/Facebook-Ad.png'

export default function FacebookAd({ onNext }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f2f2f7', overflowY: 'auto' }}>
      {/* Post header */}
      <div style={{ background: C.white, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: C.purple,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ color: 'white', fontSize: 12, fontWeight: 800 }}>BOLD</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Age Bold</div>
          <div style={{ fontSize: 12, color: C.textSec, display: 'flex', alignItems: 'center', gap: 4 }}>
            Sponsored · 🌐
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span style={{ fontSize: 20, color: C.textSec }}>×</span>
          <span style={{ fontSize: 20, color: C.textSec }}>⋮</span>
        </div>
      </div>

      {/* Ad image area */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <img src={facebookAdImg} alt="Age Bold ACCESS ad" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>

      {/* CTA row */}
      <div style={{
        background: C.white, padding: '12px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 12, color: C.textSec }}>agebold.com</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.text, maxWidth: 220, lineHeight: 1.3 }}>
            Online exercise classess tailored to your needs
          </div>
        </div>
        <button
          onClick={onNext}
          style={{
            background: '#e5e5ea', color: C.text, border: 'none',
            borderRadius: 8, padding: '8px 16px',
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'Inter, sans-serif', flexShrink: 0,
          }}>
          Learn more
        </button>
      </div>
    </div>
  )
}
