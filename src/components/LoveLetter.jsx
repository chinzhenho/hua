import { motion } from 'framer-motion'

// Slightly imperfect, hand-torn paper edge (a fixed pattern, so it never jumps).
function deckle(seed = 7) {
  let v = seed
  const r = () => ((v = (v * 9301 + 49297) % 233280) / 233280)
  const j = (m) => (r() * m).toFixed(2)
  const pts = []
  for (let x = 0; x <= 100; x += 2.5) pts.push(`calc(${x}% ${x === 0 ? '+ 0px' : '- ' + j(1.2) + 'px'}) ${j(2.4)}px`)
  for (let y = 1.5; y <= 100; y += 1.5) pts.push(`calc(100% - ${j(2.4)}px) calc(${y}% - ${j(1)}px)`)
  for (let x = 100; x >= 0; x -= 2.5) pts.push(`calc(${x}% - ${j(1.2)}px) calc(100% - ${j(2.4)}px)`)
  for (let y = 98.5; y > 0; y -= 1.5) pts.push(`${j(2.4)}px calc(${y}% + ${j(1)}px)`)
  return `polygon(${pts.join(', ')})`
}
const EDGE_A = deckle(7)
const EDGE_B = deckle(19)

const ease = [0.25, 0.1, 0.25, 1]

// A small blush rose with two leaves — used as the letter's header ornament.
export function Sprig({ className = '', flip = false }) {
  return (
    <svg className={className} width="88" height="34" viewBox="0 0 88 34" aria-hidden="true" style={flip ? { transform: 'scaleY(-1)' } : undefined}>
      <path d="M44 24 Q30 16 10 18" stroke="#A9B99E" strokeWidth="1" fill="none" />
      <path d="M44 24 Q58 16 78 18" stroke="#A9B99E" strokeWidth="1" fill="none" />
      <ellipse cx="18" cy="16" rx="7" ry="2.6" fill="#B5C3AA" transform="rotate(-14 18 16)" />
      <ellipse cx="70" cy="16" rx="7" ry="2.6" fill="#B5C3AA" transform="rotate(14 70 16)" />
      <ellipse cx="29" cy="19.5" rx="5" ry="2" fill="#A6B79B" transform="rotate(10 29 19.5)" />
      <ellipse cx="59" cy="19.5" rx="5" ry="2" fill="#A6B79B" transform="rotate(-10 59 19.5)" />
      <circle cx="8" cy="18" r="2.2" fill="#FBF2E4" stroke="#DCC7A6" strokeWidth=".5" />
      <circle cx="80" cy="18" r="2.2" fill="#FBF2E4" stroke="#DCC7A6" strokeWidth=".5" />
      <circle cx="44" cy="16" r="9" fill="#F2C3C6" />
      <path d="M38 16 a6 6 0 0 1 12 0" stroke="#F9DCDD" strokeWidth="1.3" fill="none" />
      <path d="M40 17 a4.5 4.5 0 1 1 4.5 4.5" stroke="#DE9AA2" strokeWidth="1" fill="none" />
      <path d="M42.5 16.5 a2 2 0 1 1 2 2" stroke="#D3929A" strokeWidth="1" fill="none" />
    </svg>
  )
}

// Soft polka-dot corner, low contrast, like a scrap of the wrapping paper.
function DotCorner({ pos }) {
  const clip = {
    tl: 'polygon(0 0, 100% 0, 0 100%)',
    br: 'polygon(100% 0, 100% 100%, 0 100%)',
  }[pos]
  const place = pos === 'tl' ? 'top-0 left-0' : 'bottom-0 right-0'
  return <div className={`absolute ${place} w-20 h-20 sm:w-24 sm:h-24 dots-faint opacity-80`} style={{ clipPath: clip }} aria-hidden="true" />
}

export function Paragraph({ lines }) {
  return (
    <motion.p
      className="letter-line text-ink"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.7 }}
    >
      {lines.map((line, i) => (
        <motion.span
          key={i}
          className="block"
          variants={{
            hidden: { opacity: 0, y: 14, filter: 'blur(3px)' },
            show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.6, delay: i * 0.45, ease } },
          }}
        >
          {line === '而爱你，' ? (
            <>
              而<span className="font-brush text-[#C47F87]" style={{ fontSize: '1.12em' }}>爱你</span>，
            </>
          ) : (
            line
          )}
        </motion.span>
      ))}
    </motion.p>
  )
}

/** The physical letter paper. `paragraphs` is an array of line arrays. */
export default function LoveLetter({ paragraphs, header = true, footer = false, variant = 'a', ending = null }) {
  return (
    <motion.article
      className="relative mx-auto w-[calc(100%-32px)] max-w-[34rem]"
      style={{ filter: 'drop-shadow(0 1px 1px rgba(120,90,80,.12)) drop-shadow(0 22px 26px rgba(120,90,80,.16))' }}
      initial={{ opacity: 0, y: 30, rotate: variant === 'a' ? -0.6 : 0.5 }}
      whileInView={{ opacity: 1, y: 0, rotate: variant === 'a' ? -0.25 : 0.2 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 1.8, ease }}
    >
      <div className="relative paper-grain" style={{ clipPath: variant === 'a' ? EDGE_A : EDGE_B }}>
        <DotCorner pos="tl" />
        <DotCorner pos="br" />
        {/* hairline of soft gold */}
        <div className="absolute inset-[12px] rounded-[3px] pointer-events-none" style={{ boxShadow: 'inset 0 0 0 1px rgba(205,180,138,.3)' }} />

        <div className="relative px-8 sm:px-16 py-16 sm:py-20">
          {header && (
            <div className="flex justify-center mb-12">
              <Sprig />
            </div>
          )}
          <div className="space-y-12 sm:space-y-14">
            {paragraphs.map((lines, i) => (
              <Paragraph key={i} lines={lines} />
            ))}
          </div>
          {ending}
          {footer && (
            <div className="flex justify-center mt-14 opacity-80">
              <Sprig flip />
            </div>
          )}
        </div>
      </div>
    </motion.article>
  )
}
