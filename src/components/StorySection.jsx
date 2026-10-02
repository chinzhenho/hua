import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { story } from '../content.js'
import ScrollHint from './ScrollHint.jsx'
import { usePlayOnce, useTimeline, lockScroll, unlockScroll, settleOn } from '../hooks.js'

const ease = [0.25, 0.1, 0.25, 1]
const fade = (delay = 0, duration = 1.8) => ({
  initial: { opacity: 0, y: 10, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration, delay, ease },
})

// "爱你" with a soft pink handwritten accent and a hand-drawn underline.
function Love({ draw }) {
  return (
    <span className="relative inline-block font-brush text-[#C47F87]" style={{ fontSize: '1.14em', letterSpacing: '0.04em' }}>
      爱你
      <svg className="absolute left-[-6%] w-[112%] -bottom-[0.28em] h-[0.4em] overflow-visible" viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true">
        <motion.path
          d="M3 8 C 25 3, 55 2, 97 6"
          stroke="#E2AEB3"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={draw ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 1.6, delay: 0.9, ease: 'easeInOut' }}
        />
      </svg>
    </span>
  )
}

/**
 * The emotional centerpiece. Plays once, like a short film, then rests on the last stanza.
 */
export default function StorySection() {
  const [ref, started] = usePlayOnce(0.5)
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)

  useTimeline(started, [
    [0, () => { lockScroll(); settleOn(ref.current); document.documentElement.dataset.cinema = '1' }],
    [1100, () => setStep(1)], // 遇见你，  (+ 是故事的开始。)
    [7400, () => setStep(2)], // fade
    [8800, () => setStep(3)], // 喜欢你，  (+ 是故事的过程。)
    [15000, () => setStep(4)], // fade, and a longer pause
    [17800, () => setStep(5)], // 而爱你，……
    [26200, () => { setDone(true); unlockScroll(); delete document.documentElement.dataset.cinema }],
  ])

  const size = { fontSize: 'clamp(26px, 7.2vw, 46px)', lineHeight: 1.9, letterSpacing: '0.14em' }

  return (
    <section ref={ref} className="relative h-[100svh] flex items-center justify-center overflow-hidden">
      {/* clean, almost white stage that melts into the ivory around it */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, #FBF6EE 0%, #FEF9F6 20%, #FCF2EF 50%, #FEF9F6 80%, #FBF6EE 100%)' }}
      />

      <div className="relative w-full px-8 text-center text-ink" style={size}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="meet" exit={{ opacity: 0, y: -8, filter: 'blur(4px)', transition: { duration: 1.3, ease } }}>
              <motion.p {...fade(0, 2)}>{story.meet[0]}</motion.p>
              <motion.p className="text-[0.8em] text-[#7d6864]" {...fade(2.2, 2)}>{story.meet[1]}</motion.p>
            </motion.div>
          )}
          {step === 3 && (
            <motion.div key="like" exit={{ opacity: 0, y: -8, filter: 'blur(4px)', transition: { duration: 1.6, ease } }}>
              <motion.p {...fade(0, 2)}>{story.like[0]}</motion.p>
              <motion.p className="text-[0.8em] text-[#7d6864]" {...fade(2.2, 2)}>{story.like[1]}</motion.p>
            </motion.div>
          )}
          {step === 5 && (
            <motion.div key="love">
              <motion.p {...fade(0, 2.4)}>
                而<Love draw />，
              </motion.p>
              <motion.p className="text-[0.8em] text-[#7d6864] mt-2" {...fade(3.2, 2.2)}>{story.love[1]}</motion.p>
              <motion.p className="text-[0.8em] text-[#7d6864]" {...fade(5.6, 2.4)}>{story.love[2]}</motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {done && <ScrollHint className="absolute bottom-[6svh] left-0 right-0" />}
    </section>
  )
}
