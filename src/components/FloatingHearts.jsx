import { useMemo } from 'react'

const COLORS = ['#F2B8BE', '#EBA3AB', '#F7D3D6', '#E7A0A8', '#FBE3E4']

/** Soft little hearts rising and fading — a gentle shower, not fireworks. */
export default function FloatingHearts({ count = 14, seed = 5 }) {
  const hearts = useMemo(() => {
    let s = seed * 9301 + 49297
    const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
    return Array.from({ length: count }, (_, i) => ({
      left: `${8 + r() * 84}%`,
      size: 10 + r() * 14,
      color: COLORS[i % COLORS.length],
      style: {
        '--d': `${5 + r() * 3}s`,
        '--delay': `${i * 0.45 + r() * 0.5}s`,
        '--sway': `${(r() - 0.5) * 50}px`,
        '--o': 0.55 + r() * 0.4,
      },
    }))
  }, [count, seed])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {hearts.map((h, i) => (
        <span key={i} className="heart-rise" style={{ left: h.left, ...h.style }}>
          <svg width={h.size} height={h.size * 0.9} viewBox="0 0 20 18">
            <path d="M10 17 C4 12.5 1 9.5 1 5.8 C1 3.1 3.1 1 5.7 1 C7.6 1 9.1 2.1 10 3.7 C10.9 2.1 12.4 1 14.3 1 C16.9 1 19 3.1 19 5.8 C19 9.5 16 12.5 10 17Z" fill={h.color} />
            <ellipse cx="6" cy="5" rx="2" ry="1.2" fill="#fff" opacity="0.5" transform="rotate(-30 6 5)" />
          </svg>
        </span>
      ))}
    </div>
  )
}
