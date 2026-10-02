// Soft, semi-realistic blooms drawn in SVG.
// Each bloom = cup side (depth) + guard petals + spiralling inner petals + light.

export const PAL = {
  pink: {
    side: '#D8979F',
    base: '#EFBCC1',
    layers: ['#F8D7D9', '#F3C7CB', '#EDB7BC', '#E5A6AD', '#DA949D'],
    edge: '#CC8A93',
    center: '#B9757F',
    hi: '#FFF1EF',
    grad: 'url(#hua-petal-pink)',
  },
  blush: {
    side: '#E2AEB2',
    base: '#F6D6D7',
    layers: ['#FDEDEC', '#FAE2E2', '#F6D5D6', '#F0C6C9', '#E8B5BA'],
    edge: '#DCA5AA',
    center: '#CB8E95',
    hi: '#FFF9F7',
    grad: 'url(#hua-petal-blush)',
  },
  cream: {
    side: '#D9C3A0',
    base: '#F2E4CD',
    layers: ['#FDF6EA', '#F9EEDC', '#F4E4CC', '#ECD8BA', '#E1C9A6'],
    edge: '#D2BB97',
    center: '#C0A67D',
    hi: '#FFFDF8',
    grad: 'url(#hua-petal-cream)',
  },
  ivory: {
    side: '#DED0BC',
    base: '#F7EFE4',
    layers: ['#FFFCF6', '#FCF6EC', '#F8EEE1', '#F2E5D4', '#EADAC5'],
    edge: '#DCCDB8',
    center: '#CDB99A',
    hi: '#FFFFFF',
    grad: 'url(#hua-petal-ivory)',
  },
}

const rad = (d) => (d * Math.PI) / 180
const pt = (r, a) => [r * Math.cos(rad(a)), r * Math.sin(rad(a))]
const f = (n) => n.toFixed(2)

// small deterministic jitter so no two blooms are identical
function jitter(seed) {
  let v = (seed * 7919 + 13) % 233280
  return (amp) => {
    v = (v * 9301 + 49297) % 233280
    return (v / 233280 - 0.5) * 2 * amp
  }
}

// a cupped petal pointing "up" from its base at the origin; w = full width, L = length
function lobe(L, w) {
  return `M0 0 C${f(-w * 0.55)} ${f(-L * 0.08)} ${f(-w * 0.64)} ${f(-L * 0.7)} ${f(-w * 0.36)} ${f(-L * 0.95)}
    Q${f(-w * 0.1)} ${f(-L * 1.08)} 0 ${f(-L * 1.0)} Q${f(w * 0.1)} ${f(-L * 1.08)} ${f(w * 0.36)} ${f(-L * 0.95)}
    C${f(w * 0.64)} ${f(-L * 0.7)} ${f(w * 0.55)} ${f(-L * 0.08)} 0 0Z`
}

function crescent(rho, a, span, depth) {
  const [x0, y0] = pt(rho, a - span / 2)
  const [x1, y1] = pt(rho, a + span / 2)
  const [c1x, c1y] = pt(rho * depth, a + span * 0.22)
  const [c2x, c2y] = pt(rho * depth, a - span * 0.22)
  return `M${f(x0)} ${f(y0)} A${f(rho)} ${f(rho)} 0 ${span > 180 ? 1 : 0} 1 ${f(x1)} ${f(y1)} C${f(c1x)} ${f(c1y)} ${f(c2x)} ${f(c2y)} ${f(x0)} ${f(y0)}Z`
}

function arc(rho, a, span) {
  const [x0, y0] = pt(rho, a - span / 2)
  const [x1, y1] = pt(rho, a + span / 2)
  return `M${f(x0)} ${f(y0)} A${f(rho)} ${f(rho)} 0 ${span > 180 ? 1 : 0} 1 ${f(x1)} ${f(y1)}`
}

// petal layers: [count, length, width, angle offset]
const ROSE_LAYERS = [
  [6, 1.04, 0.98, 0],
  [5, 0.86, 0.9, 34],
  [5, 0.68, 0.78, 10],
]
const RANUNCULUS_LAYERS = [[9, 0.98, 0.62, 0]]

/**
 * kind: 'rose' (open garden rose) | 'ranunculus' (many tight layers) | 'spray' (small rose)
 * tilt: how much the bloom faces the viewer (1 = straight on); lean: rotation of the head
 */
export function Flower({ x, y, r, tone = 'pink', kind = 'rose', rot = 0, tilt = 0.88, lean = 0, i = 0 }) {
  const p = PAL[tone]
  const j = jitter(i + Math.round(x * 3 + y))
  const ranunculus = kind === 'ranunculus'
  const layers = ranunculus ? RANUNCULUS_LAYERS : ROSE_LAYERS
  const innerStart = ranunculus ? 0.84 : 0.52
  const rings = ranunculus ? 15 : 8

  const outer = []
  layers.forEach(([count, len, wid, off], li) => {
    // soft shadow that the next layer casts on this one
    outer.push(<circle key={'sh' + li} r={r * len * 0.78} fill="#7A4A4A" opacity={0.07} filter="url(#hua-blur-sm)" />)
    for (let k = 0; k < count; k++) {
      const a = rot + off + (360 / count) * k + j(9)
      const L = r * len * (1 + j(0.07))
      const W = r * wid * (1 + j(0.08))
      outer.splice(li === 0 ? outer.length : outer.length, 0,
        <g key={`${li}-${k}`} transform={`rotate(${f(a)})`}>
          <path d={lobe(L, W)} fill={p.grad} stroke={p.edge} strokeWidth={0.6} strokeOpacity={0.45} />
          <path d={`M${f(-W * 0.33)} ${f(-L * 0.9)} Q0 ${f(-L * 1.03)} ${f(W * 0.33)} ${f(-L * 0.9)}`} stroke={p.hi} strokeWidth={1.3} strokeOpacity={0.85} fill="none" strokeLinecap="round" />
          <path d={`M0 ${f(-L * 0.18)} Q${f(W * 0.05)} ${f(-L * 0.5)} 0 ${f(-L * 0.78)}`} stroke={p.edge} strokeWidth={0.6} strokeOpacity={0.22} fill="none" />
        </g>,
      )
    }
  })

  const inner = []
  for (let k = 0; k < rings; k++) {
    const t = k / (rings - 1)
    const rho = r * (innerStart - t * (innerStart - 0.1))
    const a = rot + k * (ranunculus ? 101 : 137.5) + j(6)
    const span = ranunculus ? 150 + t * 40 : 190 + t * 60
    const depth = ranunculus ? 0.78 - t * 0.2 : 0.58 - t * 0.22
    const fill = p.layers[Math.min(p.layers.length - 1, Math.floor(t * p.layers.length))]
    inner.push(
      <g key={k}>
        <path d={crescent(rho, a, span, depth)} fill={fill} fillOpacity={0.95} />
        <path d={arc(rho, a, span * 0.86)} fill="none" stroke={p.edge} strokeWidth={0.7} strokeOpacity={0.5} strokeLinecap="round" />
        <path d={arc(rho * 0.95, a, span * 0.6)} fill="none" stroke={p.hi} strokeWidth={1.1} strokeOpacity={0.8} strokeLinecap="round" />
      </g>,
    )
  }

  return (
    <g transform={`translate(${x} ${y})`}>
      <g transform={`rotate(${lean}) scale(1 ${tilt})`}>
        {/* contact shadow on what's behind */}
        <ellipse cx={2} cy={r * 0.34} rx={r * 1.16} ry={r * 1.04} fill="#6E4A44" opacity={0.17} filter="url(#hua-blur)" />
        {/* the side of the cup — gives the bloom its depth */}
        <ellipse cx={0} cy={r * 0.22} rx={r * 0.98} ry={r * 0.94} fill={p.side} />
        {outer}
        <circle r={r * innerStart * 1.02} fill={p.base} />
        {inner}
        <circle r={r * 0.09} fill={p.center} opacity={0.5} />
        {/* soft key light from the upper left */}
        <circle r={r * 1.08} fill="url(#hua-flower-light)" />
      </g>
    </g>
  )
}

// a rose seen from the side, peeking out at the edge of the bouquet
export function SideRose({ x, y, s = 1, rot = 0, tone = 'blush' }) {
  const p = PAL[tone]
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M0 40 Q2 26 0 14" stroke="#93A78A" strokeWidth="2" fill="none" />
      <ellipse cx="0" cy="-2" rx="25" ry="8" fill={p.layers[3]} />
      <path d="M-22 -4 C-26 14 -12 24 0 24 C12 24 26 14 22 -4 C14 2 -14 2 -22 -4Z" fill={p.grad} stroke={p.edge} strokeWidth="0.7" />
      <path d="M-24 -6 C-30 -16 -16 -24 -6 -16 C-12 -6 -16 4 -18 10 C-24 6 -24 0 -24 -6Z" fill={p.layers[0]} stroke={p.edge} strokeWidth="0.6" />
      <path d="M24 -6 C30 -16 16 -24 6 -16 C12 -6 16 4 18 10 C24 6 24 0 24 -6Z" fill={p.layers[1]} stroke={p.edge} strokeWidth="0.6" />
      <path d="M-10 -10 C-6 -22 6 -22 10 -10 C6 -4 -6 -4 -10 -10Z" fill={p.layers[2]} stroke={p.edge} strokeWidth="0.6" />
      <path d="M-6 -12 C-2 -18 4 -17 6 -12" stroke={p.hi} strokeWidth="1.1" fill="none" />
      <path d="M-14 20 C-10 28 -4 30 0 26 C4 30 10 28 14 20 C6 24 -6 24 -14 20Z" fill="#A6B79B" />
    </g>
  )
}

// a sprig of silver-dollar eucalyptus
export function Eucalyptus({ x, y, rot = 0, len = 70, s = 1 }) {
  const leaves = []
  for (let k = 0; k < 6; k++) {
    const t = 0.15 + k * 0.15
    const side = k % 2 ? 1 : -1
    const r = 12.5 - k * 1.1
    leaves.push(
      <g key={k} transform={`translate(${side * 8} ${-len * t})`}>
        <circle r={r} fill={k % 2 ? '#B3C1AE' : '#A4B4A0'} />
        <path d={`M${-side * 5} 0 L${side * r * 0.7} ${-r * 0.2}`} stroke="#8DA087" strokeWidth="0.6" opacity="0.6" />
      </g>,
    )
  }
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d={`M0 0 Q4 ${-len * 0.5} 0 ${-len}`} stroke="#93A38D" strokeWidth="1.4" fill="none" />
      {leaves}
    </g>
  )
}

export function Leaf({ x, y, len = 46, w = 15, rot = 0, tone = '#A9B99E' }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={`M0 0 Q${w} ${-len * 0.45} 0 ${-len} Q${-w} ${-len * 0.45} 0 0Z`} fill={tone} />
      <path d={`M0 0 Q${w} ${-len * 0.45} 0 ${-len}Z`} fill="#7E9274" opacity={0.18} />
      <path d={`M0 0 Q${w * 0.15} ${-len * 0.5} 0 ${-len * 0.92}`} stroke="#8EA184" strokeWidth={0.8} fill="none" opacity={0.7} />
    </g>
  )
}

export function Spray({ x, y, rot = 0, tone = 'cream', n = 5 }) {
  const c = tone === 'cream' ? '#FBF3E4' : '#F4CFD1'
  const e = tone === 'cream' ? '#DCC7A6' : '#D79AA1'
  const spots = [[0, 0], [10, -8], [-9, -9], [3, -17], [15, 4], [-13, 3], [-3, -26]].slice(0, n)
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      {spots.map(([sx, sy], k) => (
        <path key={'s' + k} d={`M0 14 Q${sx * 0.4} ${sy * 0.4 + 6} ${sx} ${sy}`} stroke="#9EB094" strokeWidth={0.9} fill="none" />
      ))}
      {spots.map(([sx, sy], k) => (
        <g key={k} transform={`translate(${sx} ${sy})`}>
          {[0, 72, 144, 216, 288].map((a) => {
            const [px, py] = pt(3.1, a + k * 20)
            return <circle key={a} cx={px} cy={py} r={2.7} fill={c} stroke={e} strokeWidth={0.4} />
          })}
          <circle r={1.2} fill="#E3C9A0" />
        </g>
      ))}
    </g>
  )
}

export function Bud({ x, y, rot = 0, tone = 'pink' }) {
  const p = PAL[tone]
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d="M0 22 Q1 10 0 4" stroke="#9EB094" strokeWidth={1.4} fill="none" />
      <path d="M0 -10 C9 -8 10 4 0 8 C-10 4 -9 -8 0 -10Z" fill={p.layers[2]} stroke={p.edge} strokeWidth={0.6} />
      <path d="M-1 -9 C5 -6 5 3 0 7" fill="none" stroke={p.edge} strokeWidth={0.6} opacity={0.7} />
      <path d="M0 8 C-6 6 -8 1 -7 -3 C-3 2 -1 4 0 8Z M0 8 C6 6 8 1 7 -3 C3 2 1 4 0 8Z" fill="#A9B99E" />
    </g>
  )
}

export function FlowerDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <radialGradient id="hua-petal-pink" cx="0.5" cy="1" r="1.05">
          <stop offset="0" stopColor="#DE9BA3" />
          <stop offset="0.55" stopColor="#F0BEC2" />
          <stop offset="1" stopColor="#FBE3E3" />
        </radialGradient>
        <radialGradient id="hua-petal-cream" cx="0.5" cy="1" r="1.05">
          <stop offset="0" stopColor="#E0CBA9" />
          <stop offset="0.55" stopColor="#F4E7D3" />
          <stop offset="1" stopColor="#FFFAF1" />
        </radialGradient>
        <radialGradient id="hua-petal-blush" cx="0.5" cy="1" r="1.05">
          <stop offset="0" stopColor="#E6B3B6" />
          <stop offset="0.55" stopColor="#F6D6D6" />
          <stop offset="1" stopColor="#FEF1EF" />
        </radialGradient>
        <radialGradient id="hua-petal-ivory" cx="0.5" cy="1" r="1.05">
          <stop offset="0" stopColor="#E6D8C3" />
          <stop offset="0.55" stopColor="#F8F0E5" />
          <stop offset="1" stopColor="#FFFEFA" />
        </radialGradient>
        <radialGradient id="hua-flower-light" cx="0.34" cy="0.28" r="0.85">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.38" />
          <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="1" stopColor="#6E4646" stopOpacity="0.14" />
        </radialGradient>
        <pattern id="hua-dots" width="15" height="15" patternUnits="userSpaceOnUse">
          <rect width="15" height="15" fill="#F2CBD0" />
          <circle cx="3.75" cy="3.75" r="2.2" fill="#FFF7F4" />
          <circle cx="11.25" cy="11.25" r="2.2" fill="#FFF7F4" />
        </pattern>
        <pattern id="hua-dots-sm" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="#EDBDC2" />
          <circle cx="2" cy="2" r="1.1" fill="#FFF6F3" />
          <circle cx="6" cy="6" r="1.1" fill="#FFF6F3" />
        </pattern>
        <filter id="hua-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <filter id="hua-blur-sm" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
        <filter id="hua-blur-lg" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>
    </svg>
  )
}

// ───────── more flower types, drawn to match the real bouquet's variety ─────────

// Gerbera daisy: two rows of slim petals around a soft centre
export function Gerbera({ x, y, r, tone = 'blush', rot = 0, tilt = 0.86, lean = 0 }) {
  const p = PAL[tone]
  const row = (n, off, len, wid, fill, key) =>
    Array.from({ length: n }, (_, k) => (
      <g key={key + k} transform={`rotate(${rot + off + (360 / n) * k})`}>
        <ellipse cx="0" cy={-r * (0.3 + len / 2)} rx={r * wid} ry={r * len * 0.5} fill={fill} stroke={p.edge} strokeWidth="0.5" strokeOpacity="0.4" />
        <path d={`M0 ${-r * 0.36} L0 ${-r * (0.26 + len * 0.92)}`} stroke={p.hi} strokeWidth="0.8" opacity="0.7" />
      </g>
    ))
  return (
    <g transform={`translate(${x} ${y}) rotate(${lean}) scale(1 ${tilt})`}>
      <ellipse cx="2" cy={r * 0.25} rx={r * 1.02} ry={r * 0.96} fill="#6E4A44" opacity="0.15" filter="url(#hua-blur)" />
      {row(22, 8, 0.7, 0.12, p.layers[3], 'b')}
      {row(22, 0, 0.66, 0.115, p.grad, 'f')}
      <circle r={r * 0.33} fill={p.layers[1]} />
      {Array.from({ length: 16 }, (_, k) => {
        const [px, py] = pt(r * 0.28, (360 / 16) * k)
        return <ellipse key={k} cx={px} cy={py} rx={r * 0.05} ry={r * 0.09} transform={`rotate(${(360 / 16) * k + 90} ${px} ${py})`} fill={p.layers[0]} />
      })}
      <circle r={r * 0.21} fill="#EADBB0" />
      {Array.from({ length: 18 }, (_, k) => {
        const [px, py] = pt(r * 0.15, (360 / 18) * k)
        return <circle key={k} cx={px} cy={py} r={r * 0.025} fill="#C9A47C" opacity="0.75" />
      })}
      <circle r={r * 0.09} fill="#D8C28C" />
      <circle r={r * 1.0} fill="url(#hua-flower-light)" />
    </g>
  )
}

// Dahlia: rings of small pointed, grooved petals
const DAHLIA_RINGS = [[1, 22], [0.84, 19], [0.68, 16], [0.53, 13], [0.38, 10], [0.24, 7]]
export function Dahlia({ x, y, r, tone = 'blush', rot = 0, tilt = 0.88, lean = 0 }) {
  const p = PAL[tone]
  return (
    <g transform={`translate(${x} ${y}) rotate(${lean}) scale(1 ${tilt})`}>
      <ellipse cx="2" cy={r * 0.28} rx={r * 1.06} ry={r} fill="#6E4A44" opacity="0.16" filter="url(#hua-blur)" />
      <circle r={r * 0.9} fill={p.side} />
      {DAHLIA_RINGS.map(([ring, n], ri) => {
        const L = r * ring * 0.46
        const w = r * ring * 0.17
        const base = r * ring - L
        return Array.from({ length: n }, (_, k) => (
          <g key={`${ri}-${k}`} transform={`rotate(${rot + ri * 11 + (360 / n) * k}) translate(0 ${-base})`}>
            <path d={`M0 0 C${f(-w)} ${f(-L * 0.25)} ${f(-w * 0.85)} ${f(-L * 0.85)} 0 ${f(-L)} C${f(w * 0.85)} ${f(-L * 0.85)} ${f(w)} ${f(-L * 0.25)} 0 0Z`} fill={p.grad} stroke={p.edge} strokeWidth="0.5" strokeOpacity="0.5" />
            <path d={`M0 ${f(-L * 0.12)} L0 ${f(-L * 0.82)}`} stroke={p.hi} strokeWidth="0.9" opacity="0.75" strokeLinecap="round" />
          </g>
        ))
      })}
      <circle r={r * 0.1} fill={p.layers[3]} />
      <circle r={r * 1.0} fill="url(#hua-flower-light)" />
    </g>
  )
}

// Carnation: stacked frilly discs with serrated edges
function frill(R, teeth, seed) {
  const j = jitter(seed)
  let d = ''
  for (let k = 0; k <= teeth * 2; k++) {
    const a = (360 / (teeth * 2)) * k
    const rr = R * (k % 2 ? 0.9 + j(0.04) : 1 + j(0.05))
    const [px, py] = pt(rr, a)
    d += (k === 0 ? 'M' : 'L') + f(px) + ' ' + f(py) + ' '
  }
  return d + 'Z'
}
export function Carnation({ x, y, r, tone = 'blush', rot = 0, tilt = 0.88, lean = 0, i = 0 }) {
  const p = PAL[tone]
  const discs = [[1, 0], [0.86, 1], [0.7, 2], [0.54, 3], [0.38, 4]]
  return (
    <g transform={`translate(${x} ${y}) rotate(${lean}) scale(1 ${tilt})`}>
      <ellipse cx="2" cy={r * 0.28} rx={r * 1.06} ry={r} fill="#6E4A44" opacity="0.15" filter="url(#hua-blur)" />
      {discs.map(([s, k]) => (
        <g key={k} transform={`rotate(${rot + k * 17}) translate(${k % 2 ? r * 0.04 : -r * 0.04} 0)`}>
          <circle r={r * s * 0.95} fill="#7A4A4A" opacity="0.08" filter="url(#hua-blur-sm)" />
          <path d={frill(r * s, 26 - k * 3, i * 10 + k)} fill={p.layers[Math.min(4, k)]} stroke={p.edge} strokeWidth="0.5" strokeOpacity="0.55" strokeLinejoin="round" />
          {[0, 1, 2].map((q) => {
            const a = 40 + q * 120 + k * 25
            return <path key={q} d={arc(r * s * 0.78, a, 50)} stroke={p.hi} strokeWidth="1" fill="none" opacity="0.7" strokeLinecap="round" />
          })}
        </g>
      ))}
      <circle r={r * 1.0} fill="url(#hua-flower-light)" />
    </g>
  )
}

// Phalaenopsis orchid: ivory petals with a faint blush centre
export function Orchid({ x, y, s = 1, rot = 0, tone = 'ivory' }) {
  const p = PAL[tone]
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <ellipse cx="1" cy="5" rx="30" ry="24" fill="#6E4A44" opacity="0.12" filter="url(#hua-blur)" />
      {[-90, 150, 30].map((a) => (
        <ellipse key={a} cx="0" cy="-14" rx="7" ry="15" transform={`rotate(${a + 90})`} fill={p.layers[1]} stroke={p.edge} strokeWidth="0.5" />
      ))}
      <path d="M0 0 C-10 -24 -32 -22 -30 -4 C-28 10 -10 10 0 2Z" fill={p.grad} stroke={p.edge} strokeWidth="0.6" />
      <path d="M0 0 C10 -24 32 -22 30 -4 C28 10 10 10 0 2Z" fill={p.grad} stroke={p.edge} strokeWidth="0.6" />
      <path d="M-4 -2 C-12 -14 -22 -14 -24 -6 M4 -2 C12 -14 22 -14 24 -6" stroke="#EBC9C9" strokeWidth="0.7" fill="none" opacity="0.8" />
      <path d="M-6 2 C-8 10 -3 14 0 14 C3 14 8 10 6 2 C3 6 -3 6 -6 2Z" fill="#F1C6C9" stroke="#DFA9AF" strokeWidth="0.5" />
      <ellipse cx="0" cy="-1" rx="2.6" ry="3.2" fill="#FBF3E6" stroke="#E5D4B8" strokeWidth="0.4" />
    </g>
  )
}
