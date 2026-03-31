/**
 * BLOB ANIMATION — Animated aura behind trainer profile photo
 * Colors: #2563EB (blue) + #5200D4 (deep purple)
 * 3 layered blobs, centered, with screen blend mode
 */

const canvas = document.getElementById('blobCanvas');
const ctx = canvas.getContext('2d');
let W, H, dpr, time = 0;

function resize() {
  dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  W = rect.width;
  H = rect.height;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';
  ctx.scale(dpr, dpr);
}

resize();
window.addEventListener('resize', resize);

class Blob {
  constructor(cfg) {
    this.cx = cfg.cx;
    this.cy = cfg.cy;
    this.baseR = cfg.r;
    this.points = cfg.points || 6;
    this.speed = cfg.speed || 0.008;
    this.wobble = cfg.wobble || 0.3;
    this.colors = cfg.colors;
    this.phase = cfg.phase || 0;
    this.breathe = cfg.breathe || 0.06;
    this.breatheSpeed = cfg.breatheSpeed || 0.003;
    this.opacity = cfg.opacity || 0.6;
  }

  getPath(t) {
    const pts = [];
    const n = this.points;
    const br = 1 + Math.sin(t * this.breatheSpeed + this.phase * 3) * this.breathe;

    for (let i = 0; i < n; i++) {
      const angle = (Math.PI * 2 * i) / n;
      const n1 = Math.sin(t * this.speed + i * 1.7 + this.phase) * this.wobble;
      const n2 = Math.cos(t * this.speed * 0.7 + i * 2.3 + this.phase * 1.5) * this.wobble * 0.5;
      const n3 = Math.sin(t * this.speed * 1.4 + i * 0.8 + this.phase * 0.7) * this.wobble * 0.25;
      const r = this.baseR * br * (1 + n1 + n2 + n3);
      pts.push({
        x: this.cx * W + Math.cos(angle) * r,
        y: this.cy * H + Math.sin(angle) * r,
      });
    }
    return pts;
  }

  draw(t) {
    const pts = this.getPath(t);
    const n = pts.length;

    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const curr = pts[i];
      const next = pts[(i + 1) % n];
      const prev = pts[(i - 1 + n) % n];
      if (i === 0) {
        ctx.moveTo((prev.x + curr.x) / 2, (prev.y + curr.y) / 2);
      }
      ctx.quadraticCurveTo(curr.x, curr.y, (curr.x + next.x) / 2, (curr.y + next.y) / 2);
    }
    ctx.closePath();

    const gx = this.cx * W;
    const gy = this.cy * H;
    const grad = ctx.createRadialGradient(
      gx - this.baseR * 0.2,
      gy - this.baseR * 0.2,
      0,
      gx,
      gy,
      this.baseR * 1.3
    );
    grad.addColorStop(0, this.colors[0]);
    grad.addColorStop(1, this.colors[1]);

    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

const blobs = [
  new Blob({
    cx: 0.5, cy: 0.5, r: 82, points: 8,
    speed: 0.004, wobble: 0.16,
    colors: ['rgba(82, 0, 212, 0.55)', 'rgba(82, 0, 212, 0.12)'],
    phase: 0, breathe: 0.04, breatheSpeed: 0.002, opacity: 0.7,
  }),
  new Blob({
    cx: 0.5, cy: 0.5, r: 75, points: 6,
    speed: 0.007, wobble: 0.2,
    colors: ['rgba(37, 99, 235, 0.5)', 'rgba(37, 99, 235, 0.1)'],
    phase: 2.2, breathe: 0.05, breatheSpeed: 0.003, opacity: 0.65,
  }),
  new Blob({
    cx: 0.5, cy: 0.5, r: 65, points: 7,
    speed: 0.005, wobble: 0.18,
    colors: ['rgba(82, 0, 212, 0.45)', 'rgba(37, 99, 235, 0.15)'],
    phase: 4.5, breathe: 0.04, breatheSpeed: 0.0025, opacity: 0.6,
  }),
];

function render() {
  time++;
  ctx.clearRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'screen';
  for (const b of blobs) b.draw(time);
  ctx.globalCompositeOperation = 'source-over';
  requestAnimationFrame(render);
}

render();
