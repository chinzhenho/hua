import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Bouquet3D from './Bouquet3D.jsx'
import FallingPetals from './FallingPetals.jsx'
import MiniLetter from './MiniLetter.jsx'
import FloatingHearts from './FloatingHearts.jsx'
import { iLoveYou } from '../content.js'
import { usePlayOnce, useTimeline } from '../hooks.js'

const ease = [0.25, 0.1, 0.25, 1]

// a few tiny points of warm light around the bouquet
const TWINKLES = [
  ['8%', '22%', 0], ['88%', '18%', 1.4], ['16%', '58%', 2.6], ['84%', '52%', 0.8], ['50%', '-2%', 2], ['30%', '8%', 3.2], ['70%', '76%', 1.9],
]

// petals resting at the foot of the bouquet
const RESTING = [
  { l: '16%', b: '5%', r: -30, c: '#F4CDCF', e: '#E3A8AE', s: 13 },
  { l: '27%', b: '1%', r: 40, c: '#FBF2E4', e: '#E2CFAF', s: 11 },
  { l: '70%', b: '3%', r: 12, c: '#F0BFC3', e: '#D9979E', s: 14 },
  { l: '80%', b: '7%', r: -50, c: '#FFF7EC', e: '#E6D4B6', s: 10 },
  { l: '60%', b: '0%', r: 70, c: '#FBF2E4', e: '#E2CFAF', s: 9 },
]

/**
 * Scene 7: the same bouquet returns — warmer, fuller, a little glow.
 * After the letter: it folds up, goes back into its envelope and tucks into the bouquet.
 */
export default function FinalBouquet({ onReplay }) {
  const [ref, started] = usePlayOnce(0.5)
  const bouquet = useRef(null)
  const [step, setStep] = useState(-1)
  const [petals, setPetals] = useState(false)
  const [letter, setLetter] = useState(0)
  const [end, setEnd] = useState(false)
  const [love, setLove] = useState(false)

  // the letter folds itself up, goes back into its envelope, and tucks into the bouquet
  useTimeline(started, [
    [300, () => setStep(0)],
    [1200, () => setLetter(1)], // the letter
    [2600, () => setLetter(2)], // first fold
    [3800, () => setLetter(3)], // second fold
    [5000, () => setLetter(4)], // into the envelope
    [7300, () => setLetter(5)], // flap closes
    [8600, () => setLetter(6)], // tucked into the bouquet
    [10600, () => bouquet.current?.rustle()],
    [10900, () => setPetals(true)],
    [12000, () => setLove(true)], // 我爱你。and a few hearts
    [16000, () => setEnd(true)],
  ])

  return (
    <section ref={ref} className="relative h-[100svh] overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(75% 55% at 50% 36%, #FCE9E2 0%, #FBF1EA 45%, #FBF6EE 80%)' }} />

      <div className="relative h-full flex flex-col items-center justify-center pb-[3svh]">
        <motion.div
          className="relative"
          style={{ zIndex: 1 }}
          initial={{ opacity: 0, y: 18, scale: 0.97 }}
          animate={step >= 0 ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 2.6, ease }}
        >
          <div className="breathe">
            <Bouquet3D ref={bouquet} full glow width="min(74vw, calc(50svh * 0.714), 380px)" />
          </div>
          {TWINKLES.map(([l, t, d], i) => (
            <span key={i} className="twinkle" style={{ left: l, top: t, animationDelay: `${d}s` }} aria-hidden="true" />
          ))}
          <MiniLetter step={letter} />
          {RESTING.map((p, i) => (
            <svg key={i} className="absolute" style={{ left: p.l, bottom: p.b, transform: `rotate(${p.r}deg)` }} width={p.s} height={p.s * 1.15} viewBox="0 0 20 23" aria-hidden="true">
              <path d="M10 1 C17 4 19 12 15 18 C13 21 7 21 5 18 C1 12 3 4 10 1Z" fill={p.c} stroke={p.e} strokeWidth="0.6" />
            </svg>
          ))}
        </motion.div>

        {/* 我爱你。under the bouquet */}
        <div className="relative h-[7rem] w-full flex flex-col items-center justify-start pt-[2svh]" style={{ zIndex: 3 }}>
          <AnimatePresence>
            {love && (
              <motion.div key="love" className="flex flex-col items-center">
                <motion.p
                  className="font-brush text-[#C47F87]"
                  style={{ fontSize: 'clamp(40px, 12vw, 60px)', letterSpacing: '0.18em', lineHeight: 1.25 }}
                  initial={{ opacity: 0, scale: 0.94, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 2.6, ease }}
                >
                  {iLoveYou}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {love && (
        <div className="absolute inset-0" style={{ zIndex: 2 }}>
          <FloatingHearts />
        </div>
      )}

      {petals && (
        <div className="absolute inset-0" style={{ zIndex: 2 }}>
          <FallingPetals count={9} seed={27} fixed={false} area="center" />
        </div>
      )}

      <AnimatePresence>
        {end && (
          <motion.button
            type="button"
            onClick={onReplay}
            aria-label="从头再看一次"
            className="absolute left-1/2 -translate-x-1/2 bottom-[max(4svh,20px)] w-11 h-11 rounded-full text-dusty/70 hover:text-dusty transition-colors text-lg"
            style={{ zIndex: 4 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          >
            ↺
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  )
}
