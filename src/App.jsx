import { useState } from 'react'
import { motion, AnimatePresence, MotionConfig } from 'framer-motion'
import { FlowerDefs } from './components/Flowers.jsx'
import { WrapDefs } from './components/BouquetWrapping.jsx'
import BouquetScene from './components/BouquetScene.jsx'
import LoveLetter from './components/LoveLetter.jsx'
import FinalBouquet from './components/FinalBouquet.jsx'
import MusicToggle from './components/MusicToggle.jsx'
import { motion as m } from 'framer-motion'
import { letterOpening, story, letterMiddle, chapter, finale, iLoveYou } from './content.js'

// the whole letter, in order, on one sheet of paper
const LETTER = [
  ...letterOpening,
  story.meet,
  story.like,
  story.love,
  ...letterMiddle,
  [chapter.first, ...chapter.rest],
  ...finale,
]
import { unlockScroll } from './hooks.js'

// 花 → 小熊 → 信封 → 情书 → 故事 → 未来 → 花 → 我爱你
export default function App() {
  const [scene, setScene] = useState('bouquet') // bouquet | letter
  const [round, setRound] = useState(0)

  const toLetter = () => {
    window.scrollTo(0, 0)
    setScene('letter')
  }

  const replay = () => {
    unlockScroll()
    delete document.documentElement.dataset.cinema
    window.scrollTo({ top: 0 })
    setRound((r) => r + 1)
    setScene('bouquet')
  }

  return (
    <MotionConfig reducedMotion="user">
      <FlowerDefs />
      <WrapDefs />
      <MusicToggle />

      <AnimatePresence>
        {scene === 'bouquet' && <BouquetScene key={'b' + round} onDone={toLetter} />}
      </AnimatePresence>

      {scene === 'letter' && (
        <motion.main
          key={'l' + round}
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.8, delay: 0.9, ease: 'easeInOut' }}
        >
          {/* 情书：整封信写在同一张信纸上 */}
          <div className="relative pt-[12svh] pb-[18svh]">
            <LoveLetter
              paragraphs={LETTER}
              footer
              ending={
                <m.div
                  className="mt-16 sm:mt-20 flex flex-col items-center"
                  initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ duration: 2.4, delay: 0.6 }}
                >
                  <p className="font-brush text-[#C47F87]" style={{ fontSize: 'clamp(34px, 9vw, 48px)', letterSpacing: '0.16em' }}>
                    {iLoveYou}
                  </p>
                  <p className="mt-4 font-script text-dusty/80" style={{ fontSize: '18px' }}>
                    — To be continued.
                  </p>
                </m.div>
              }
            />
          </div>

          {/* 花 → 我爱你 */}
          <FinalBouquet onReplay={replay} />
        </motion.main>
      )}
    </MotionConfig>
  )
}
