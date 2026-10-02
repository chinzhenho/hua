import { useMemo } from 'react'

const COLORS = [
  ['#F4CDCF', '#E3A8AE'],
  ['#FBF2E4', '#E2CFAF'],
  ['#F0BFC3', '#D9979E'],
  ['#FFF7EC', '#E6D4B6'],
]

function Petal({ fill, edge, size }) {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 20 23" aria-hidden="true">
      <path d="M10 1 C17 4 19 12 15 18 C13 21 7 21 5 18 C1 12 3 4 10 1Z" fill={fill} stroke={edge} strokeWidth="0.6" />
      <path d="M10 4 C9 9 9 14 10 19" stroke={edge} strokeWidth="0.5" opacity="0.5" fill="none" />
    </svg>
  )
}

/**
 * A handful of petals drifting down. Re-mount (change `seed`) to play again.
 * count: 5–10 keeps it gentle.
 */
export default function FallingPetals({ count = 8, seed = 0, delay = 0, area = 'full', fixed = true }) {
  const petals = useMemo(() => {
    let s = seed * 9301 + 49297
    const rnd = () => {
      s = (s * 9301 + 49297) % 233280
      return s / 233280
    }
    return Array.from({ length: count }, (_, i) => {
      const [fill, edge] = COLORS[i % COLORS.length]
      const left = area === 'center' ? 25 + rnd() * 50 : 6 + rnd() * 88
      return {
        fill,
        edge,
        size: 11 + rnd() * 9,
        style: {
          left: `${left}%`,
          '--d': `${7 + rnd() * 4}s`,
          '--delay': `${delay + i * 0.45 + rnd() * 0.6}s`,
          '--dx': `${(rnd() - 0.5) * 26}vw`,
          '--sway': `${18 + rnd() * 26}px`,
          '--r0': `${rnd() * 60 - 30}deg`,
          '--r1': `${rnd() * 120 - 20}deg`,
          '--o': 0.7 + rnd() * 0.25,
        },
      }
    })
  }, [count, seed, delay, area])

  return (
    <div
      className={`${fixed ? 'fixed' : 'absolute'} inset-0 pointer-events-none overflow-hidden z-30`}
      aria-hidden="true"
    >
      {petals.map((p, i) => (
        <div key={`${seed}-${i}`} className="petal" style={p.style}>
          <Petal fill={p.fill} edge={p.edge} size={p.size} />
        </div>
      ))}
    </div>
  )
}
