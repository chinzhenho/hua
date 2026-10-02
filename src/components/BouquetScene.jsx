import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Bouquet3D from './Bouquet3D.jsx'
import Envelope from './Envelope.jsx'
import FallingPetals from './FallingPetals.jsx'
import { opening } from '../content.js'
import { DESIGN } from '../design.js'

const slow = [0.4, 0, 0.2, 1]
const BOUQUET_W = 'min(84vw, calc(58svh * 0.714), 440px)'
const HALF_H = 'min(58.8vw, 29svh, 308px)'

/**
 * Scenes 1–3: the bouquet → touched → the hidden envelope.
 * phase: intro → touched (rustle, petals) → rise (bouquet lifts, envelope slides out) → opening
 */
export default function BouquetScene({ onDone }) {
  const [phase, setPhase] = useState('intro')
  const bouquet = useRef(null)
  const envelope = useRef(null)
  const envReady = useRef(false)
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800

  const touch = () => {
    if (phase !== 'intro') return
    bouquet.current?.rustle()
    setPhase('touched')
    setTimeout(() => setPhase('rise'), 1500)
    setTimeout(() => (envReady.current = true), 3200)
  }

  const openEnvelope = () => {
    bouquet.current?.rustle()
    setPhase('opening')
  }

  // 轻轻点一下: a tap anywhere on the screen moves the story on
  const tapAnywhere = (e) => {
    if (e.target.closest('button')) return // the bouquet / envelope handle their own taps
    if (phase === 'intro') touch()
    else if (phase === 'rise' && envReady.current) envelope.current?.open()
  }

  const lifted = phase === 'rise' || phase === 'opening'

  return (
    <motion.section
      className="fixed inset-0 overflow-hidden select-none"
      onClick={tapAnywhere}
      style={{ cursor: phase === 'intro' || phase === 'rise' ? 'pointer' : 'default', touchAction: 'manipulation' }}
      initial={{ backgroundColor: '#FBF6EE' }}
      animate={{ backgroundColor: phase === 'intro' ? '#FBF6EE' : '#F8EADD' }}
      transition={{ duration: 3.2, ease: 'easeInOut' }}
      exit={{ opacity: 0, transition: { duration: 1.4, ease: 'easeInOut' } }}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(62% 46% at 50% 40%, rgba(247,214,208,.5), transparent 72%)' }}
        animate={{ opacity: phase === 'intro' ? 0.55 : 1 }}
        transition={{ duration: 3 }}
      />

      {/* envelope — it slides out from behind the bouquet */}
      <AnimatePresence>
        {lifted && (
          <div className="absolute left-0 right-0 top-[64%] -translate-y-1/2 flex justify-center" style={{ zIndex: 1 }}>
            <motion.div
              className="flex flex-col items-center"
              initial={{ y: -vh * 0.3, scale: 0.55, opacity: 0 }}
              animate={
                phase === 'opening'
                  ? { y: vh * 0.08, scale: 1, opacity: 1 }
                  : { y: 0, scale: 1, opacity: [0, 1, 1] }
              }
              transition={phase === 'opening' ? { duration: 1.6, ease: slow } : { delay: 0.9, duration: 2.6, ease: slow, opacity: { delay: 0.9, duration: 2.6, times: [0, 0.35, 1] } }}
            >
              <Envelope ref={envelope} look={DESIGN.envelope} onOpen={openEnvelope} onOpened={onDone} />
              <motion.p
                className="mt-9 text-dusty tracking-[0.3em]"
                style={{ fontSize: '13px' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: phase === 'opening' ? 0 : 1 }}
                transition={{ delay: phase === 'opening' ? 0 : 3.8, duration: phase === 'opening' ? 0.6 : 1.4 }}
              >
                <span className="soft-pulse inline-block">{opening.tap}</span>
              </motion.p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* the bouquet */}
      <motion.div
        className="absolute left-1/2"
        style={{ x: '-50%', y: '-50%', zIndex: 2 }}
        initial={{ opacity: 0, scale: 0.96, top: '40%' }}
        animate={
          phase === 'opening'
            ? { opacity: 0.9, scale: 0.5, top: '19%' }
            : lifted
              ? { opacity: 1, scale: 0.56, top: '22%' }
              : { opacity: 1, scale: phase === 'touched' ? 1.03 : 1, top: '40%' }
        }
        transition={{ duration: phase === 'touched' ? 1.2 : lifted ? 3 : 2.4, ease: slow }}
      >
        <button
          type="button"
          onClick={touch}
          aria-label="点一下花束"
          className="block outline-none breathe"
          style={{ cursor: phase === 'intro' ? 'pointer' : 'default', touchAction: 'manipulation' }}
        >
          <Bouquet3D ref={bouquet} width={BOUQUET_W} />
        </button>
      </motion.div>

      {/* opening words */}
      <AnimatePresence>
        {phase === 'intro' && (
          <motion.div
            key="words"
            className="absolute left-0 right-0 px-6 text-center pointer-events-none"
            style={{ top: `calc(40% + ${HALF_H} + 2px)`, zIndex: 3 }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.9 } }}
          >
            <motion.p
              className="text-ink tracking-[0.18em]"
              style={{ fontSize: 'clamp(21px, 5.8vw, 30px)', fontWeight: 600 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 1.8, ease: slow }}
            >
              {opening.title}
            </motion.p>
            <motion.p
              className="mt-2.5 text-[#8a7470] tracking-[0.14em]"
              style={{ fontSize: 'clamp(15px, 4.1vw, 18px)' }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.4, duration: 1.8, ease: slow }}
            >
              {opening.subtitle}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 'intro' && (
          <motion.p
            key="tap"
            className="absolute left-0 right-0 text-center text-dusty tracking-[0.3em] pointer-events-none"
            style={{ bottom: 'max(4.5svh, calc(env(safe-area-inset-bottom) + 16px))', fontSize: '13px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
            transition={{ delay: 3.8, duration: 1.6 }}
          >
            <span className="soft-pulse inline-block">{opening.tap}</span>
          </motion.p>
        )}
      </AnimatePresence>

      {phase !== 'intro' && <FallingPetals count={8} seed={3} delay={0.5} />}
      {phase === 'opening' && <FallingPetals count={6} seed={11} delay={0.4} area="center" />}
    </motion.section>
  )
}
