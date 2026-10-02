import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Leaf, Spray, Bud, SideRose, Eucalyptus } from './Flowers.jsx'
import { GroundShadow, WrapBack, DotsBack, DotsFront, WrapFront, Ribbon } from './BouquetWrapping.jsx'
import bearPhoto from '../assets/bear.webp'

/*
 * The bouquet is built as real depth layers in CSS 3D space (no WebGL needed):
 * shadow → white back sheets → pink paper → back blooms → plush → middle blooms →
 * front blooms → pink front folds → white front folds → ribbon.
 * Tilting the whole scene (cursor, touch, or a slow idle drift) makes the layers
 * slide past each other like a physical bouquet.
 */

const P = 1000 // perspective, px

import { BOUQUETS } from '../variants.js'
import { DESIGN } from '../design.js'

// rendered 3D flower sprites (see studio/ — npm run flowers)
const SPRITES = import.meta.glob('../assets/flowers/*.webp', { eager: true, import: 'default' })
const sprite = (type, tone, view) => {
  const pick = (t) => SPRITES[`../assets/flowers/${type}-${t}-${view}.webp`]
  return pick(tone) || pick('pink') || pick('blush') || pick('cream') || pick('ivory')
}
const TYPE = { rose: 'rose', ran: 'ranunculus', spray: 'spray', gerbera: 'gerbera', dahlia: 'dahlia', carnation: 'carnation', orchid: 'orchid' }

function Bloom({ t = 'rose', x, y, r = 30, s, tone = 'pink', rot = 0, lean = 0, tilt = 0.88 }) {
  const type = TYPE[t] || 'rose'
  const view = tilt < 0.85 ? 'side' : 'front'
  const size = t === 'orchid' ? 70 * (s || 1) : r * 2.35
  const turn = view === 'front' ? (rot % 360) * 0.5 + lean : lean
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="2" cy={size * 0.12} rx={size * 0.5} ry={size * 0.44} fill="#6E4A44" opacity="0.2" filter="url(#hua-blur)" />
      <image
        href={sprite(type, tone, view)}
        x={-size / 2}
        y={-size / 2}
        width={size}
        height={size}
        preserveAspectRatio="xMidYMid meet"
        transform={`rotate(${turn.toFixed(1)})`}
      />
    </g>
  )
}

function Layer({ z, unit, cls = '', children, svg = true }) {
  const zz = z * unit
  return (
    <div className="bq-layer" style={{ transform: `translateZ(${zz}px) scale(${(P - zz) / P})` }}>
      <div className={`bq-move ${cls}`}>
        {svg ? (
          <svg viewBox="0 0 400 560" className="absolute inset-0 w-full h-full overflow-visible" aria-hidden="true">
            {children}
          </svg>
        ) : (
          children
        )}
      </div>
    </div>
  )
}

const Bouquet3D = forwardRef(function Bouquet3D({ full = false, glow = false, interactive = true, width, className = '', design = DESIGN.bouquet }, ref) {
  const v = BOUQUETS[design] || BOUQUETS.A
  const { back: BACK, mid: MID, front: FRONT } = v
  const reduce = useReducedMotion()
  const root = useRef(null)
  const scene = useRef(null)
  const [unit, setUnit] = useState(1)
  const [rustle, setRustle] = useState(0)

  // expose a gentle "touched" reaction
  useImperativeHandle(ref, () => ({
    rustle: () => setRustle((n) => n + 1),
  }))

  useEffect(() => {
    if (!rustle) return
    const el = root.current
    el.classList.remove('rustle')
    void el.offsetWidth
    el.classList.add('rustle')
    const t = setTimeout(() => el.classList.remove('rustle'), 3200)
    return () => clearTimeout(t)
  }, [rustle])

  // depth scales with the bouquet's size
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setUnit(e.contentRect.width / 400))
    ro.observe(root.current)
    return () => ro.disconnect()
  }, [])

  // cursor / touch parallax + slow idle drift
  useEffect(() => {
    if (reduce) return
    let tx = 0, ty = 0, cx = 0, cy = 0, raf
    const start = performance.now()
    const onMove = (e) => {
      if (!interactive) return
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1
      const k = e.pointerType === 'touch' ? 0.7 : 1
      tx = nx * 8 * k
      ty = -ny * 5 * k
    }
    const onLeave = () => { tx = 0; ty = 0 }
    const loop = (now) => {
      const t = (now - start) / 1000
      const ix = Math.sin(t * 0.35) * 2.2
      const iy = Math.sin(t * 0.27 + 1) * 1.4
      cx += (tx + ix - cx) * 0.045
      cy += (ty + iy - cy) * 0.045
      if (scene.current) scene.current.style.transform = `rotateY(${cx.toFixed(3)}deg) rotateX(${cy.toFixed(3)}deg)`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)
    document.addEventListener('pointerup', (e) => e.pointerType === 'touch' && onLeave())
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
    }
  }, [reduce, interactive])

  let n = 0
  const bloom = (fl, k) => <Bloom key={k} {...fl} i={n++} />

  return (
    <div
      ref={root}
      className={`bq-root relative ${className}`}
      style={{ width, aspectRatio: '400 / 560', perspective: `${P}px` }}
    >
      {glow && <div className="absolute -inset-[18%] bq-glow pointer-events-none" aria-hidden="true" />}

      <div ref={scene} className="bq-scene absolute inset-0">
        <Layer z={-80} unit={unit}><GroundShadow /></Layer>
        <Layer z={-60} unit={unit} cls="paper paper-a"><WrapBack shape={v.wrap} /></Layer>
        <Layer z={-44} unit={unit} cls="paper paper-b"><DotsBack shape={v.wrap} /></Layer>

        <Layer z={-28} unit={unit} cls="sway-a depth-far">
          {/* greenery behind everything, so gaps read as leaves rather than paper */}
          {[
            [200, 240, -6], [150, 210, -40], [262, 206, 36], [100, 250, -66], [300, 250, 66],
            [40, 300, -86], [362, 300, 84], [176, 290, 200], [228, 290, 160],
          ].map(([x, y, r], k) => (
            <Leaf key={k} x={x} y={y} rot={r} len={50} w={17} tone={k % 2 ? '#A6B79B' : '#B5C3AA'} />
          ))}
          <Eucalyptus x={100} y={232} rot={-40} len={104} />
          <Eucalyptus x={150} y={190} rot={-12} len={96} />
          <Eucalyptus x={60} y={300} rot={-72} len={84} s={0.95} />
          <Eucalyptus x={344} y={300} rot={72} len={86} s={0.95} />
          <Spray x={226} y={150} rot={10} n={6} />
          <Spray x={90} y={122} rot={-30} n={5} />
          <Bud x={140} y={112} rot={-16} />
          <Bud x={372} y={208} rot={36} tone="cream" />
          {full && (
            <>
              <SideRose x={26} y={258} rot={-62} s={0.8} tone="ivory" />
              <SideRose x={376} y={262} rot={60} s={0.8} tone="pink" />
              <Spray x={60} y={170} rot={-44} n={5} />
              <Bud x={30} y={208} rot={-50} tone="cream" />
            </>
          )}
          {BACK.map(bloom)}
        </Layer>

        {/* the little plush, sitting in the upper middle */}
        <Layer z={-14} unit={unit} svg={false}>
          <div className="absolute" style={v.bear}>
            <div className="bear-move">
              <img src={bearPhoto} alt="花束里的小熊" draggable="false" className="block w-full h-auto select-none bear-photo" />
            </div>
          </div>
        </Layer>

        <Layer z={0} unit={unit} cls="sway-b">
          <Spray x={200} y={176} rot={4} n={7} />
          <Spray x={136} y={270} rot={-30} n={6} />
          <Spray x={290} y={300} rot={30} n={6} />
          {MID.map(bloom)}
        </Layer>

        <Layer z={18} unit={unit} cls="sway-c">{FRONT.map(bloom)}</Layer>
        <Layer z={30} unit={unit} cls="paper paper-c"><DotsFront /></Layer>
        <Layer z={42} unit={unit} cls="paper paper-d"><WrapFront /></Layer>
        <Layer z={50} unit={unit} cls="paper paper-d"><Ribbon /></Layer>

        {/* soft key light over the whole bouquet */}
        <div className="bq-layer bq-light pointer-events-none" style={{ transform: `translateZ(${56 * unit}px) scale(${(P - 56 * unit) / P})` }} />
      </div>
    </div>
  )
})

export default Bouquet3D
