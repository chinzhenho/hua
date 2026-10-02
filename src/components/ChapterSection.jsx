import { motion } from 'framer-motion'
import { chapter } from '../content.js'

const ease = [0.25, 0.1, 0.25, 1]
const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 14, filter: 'blur(3px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true, amount: 0.8 },
  transition: { duration: 1.8, delay, ease },
})

// An open book with blank pages — the story isn't finished yet.
function OpenBook() {
  return (
    <svg viewBox="0 0 360 230" className="w-full h-auto block" aria-hidden="true">
      <defs>
        <linearGradient id="book-l" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FBF5EC" />
          <stop offset="0.85" stopColor="#FFFCF7" />
          <stop offset="1" stopColor="#EADFD1" />
        </linearGradient>
        <linearGradient id="book-r" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#EADFD1" />
          <stop offset="0.15" stopColor="#FFFCF7" />
          <stop offset="1" stopColor="#FBF5EC" />
        </linearGradient>
        <pattern id="book-dots" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="#E9B9BD" />
          <circle cx="1.5" cy="1.5" r="0.9" fill="#FBEDEC" />
          <circle cx="4.5" cy="4.5" r="0.9" fill="#FBEDEC" />
        </pattern>
        <filter id="book-shadow" x="-20%" y="-20%" width="140%" height="160%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      <ellipse cx="180" cy="214" rx="150" ry="8" fill="#9C7F70" opacity=".18" filter="url(#book-shadow)" />
      {/* page edges */}
      <path d="M180 206 C138 192 66 192 18 202 L18 208 C66 198 138 198 180 212 C222 198 294 198 342 208 L342 202 C294 192 222 192 180 206Z" fill="#EFE5D8" />
      <path d="M180 202 C138 188 66 188 21 198 M180 202 C222 188 294 188 339 198" stroke="#E2D6C6" strokeWidth=".8" fill="none" />
      {/* pages */}
      <path d="M180 30 C140 12 70 12 22 24 L22 196 C70 184 140 184 180 202 Z" fill="url(#book-l)" stroke="#E6DACB" strokeWidth=".8" />
      <path d="M180 30 C220 12 290 12 338 24 L338 196 C290 184 220 184 180 202 Z" fill="url(#book-r)" stroke="#E6DACB" strokeWidth=".8" />
      {/* faint ruled lines on the left page, still empty */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <path key={i} d={`M44 ${58 + i * 19} C86 ${50 + i * 19} 130 ${50 + i * 19} 162 ${58 + i * 19 + 4}`} stroke="#EADCCB" strokeWidth=".7" fill="none" />
      ))}
      {/* tiny floral mark at the corner */}
      <g transform="translate(312 40)">
        <circle r="4" fill="#F2C3C6" />
        <path d="M-2 0 a2 2 0 1 1 2 2" stroke="#DE9AA2" strokeWidth=".8" fill="none" />
        <ellipse cx="-7" cy="3" rx="3.4" ry="1.3" fill="#B5C3AA" transform="rotate(-20 -7 3)" />
      </g>
      {/* polka-dot bookmark ribbon */}
      <path d="M176 26 L184 26 L186 224 L180 216 L174 224 Z" fill="url(#book-dots)" />
    </svg>
  )
}

export default function ChapterSection() {
  return (
    <section className="relative px-4 pt-[18svh] pb-[22svh] text-center text-ink">
      <motion.p className="letter-line" {...reveal(0)} style={{ fontSize: 'clamp(22px, 5.8vw, 30px)', letterSpacing: '0.14em' }}>
        {chapter.first}
      </motion.p>

      <div className="mt-10 sm:mt-12">
        {chapter.rest.map((line, i) => (
          <motion.p key={i} className="letter-line" {...reveal(0.9 + i * 0.7)}>
            {line}
          </motion.p>
        ))}
      </div>

      <motion.div
        className="relative mx-auto mt-16 sm:mt-20 w-[min(88vw,440px)]"
        initial={{ opacity: 0, y: 24, scaleX: 0.92 }}
        whileInView={{ opacity: 1, y: 0, scaleX: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 2.2, ease }}
      >
        <OpenBook />
        {/* right page text */}
        <div className="absolute top-[22%] left-[53%] right-[6%] flex flex-col items-center">
          <motion.span
            className="font-latin italic text-ink/80"
            style={{ fontSize: 'clamp(17px, 4.6vw, 24px)', letterSpacing: '0.06em' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 1 }}
            transition={{ duration: 1.8, delay: 1.2 }}
          >
            Chapter ∞
          </motion.span>
          <motion.span
            className="mt-[10%] h-px w-[38%] bg-gold/50"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 1 }}
            transition={{ duration: 1.4, delay: 2.0 }}
          />
          <motion.span
            className="mt-[12%] font-script text-dusty"
            style={{ fontSize: 'clamp(16px, 4.6vw, 26px)' }}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 1 }}
            transition={{ duration: 2, delay: 2.8 }}
          >
            To be continued...
          </motion.span>
        </div>
      </motion.div>
    </section>
  )
}
