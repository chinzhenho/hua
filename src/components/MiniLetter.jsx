import { motion } from 'framer-motion'

/*
 * The ending: the letter folds itself in three, slips back into its envelope,
 * the flap closes, and the envelope tucks itself into the bouquet beside the bear.
 *
 * step: 0 hidden · 1 paper · 2 first fold · 3 second fold · 4 into the envelope
 *       5 flap closes · 6 tucked into the bouquet
 */

const ease = [0.45, 0.05, 0.25, 1]
const PAPER = { background: 'linear-gradient(180deg, #FFFDF9, #FBF4EA)', boxShadow: 'inset 0 0 0 0.5px rgba(205,180,138,.45)' }

function Lines({ n = 3, sprig = false }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-[9%] px-[14%]" style={{ backfaceVisibility: 'hidden' }}>
      {sprig && (
        <svg width="34%" viewBox="0 0 44 22" aria-hidden="true">
          <path d="M22 18 Q14 12 6 13 M22 18 Q30 12 38 13" stroke="#A9B99E" strokeWidth="1" fill="none" />
          <ellipse cx="9" cy="12" rx="4" ry="1.8" fill="#B5C3AA" transform="rotate(-15 9 12)" />
          <ellipse cx="35" cy="12" rx="4" ry="1.8" fill="#B5C3AA" transform="rotate(15 35 12)" />
          <circle cx="22" cy="11" r="6" fill="#F2C3C6" />
          <path d="M18.5 11 a3.5 3.5 0 1 1 3.5 3.5" stroke="#DE9AA2" strokeWidth="1" fill="none" />
        </svg>
      )}
      {Array.from({ length: n }, (_, i) => (
        <div key={i} className="h-px w-full bg-[#E5D6C5]" style={{ width: `${[92, 78, 86, 70][i % 4]}%` }} />
      ))}
    </div>
  )
}

export default function MiniLetter({ step }) {
  const folded1 = step >= 2
  const folded2 = step >= 3
  const inside = step >= 4
  const closed = step >= 5
  const tucked = step >= 6

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ width: '46%', aspectRatio: '3 / 2', perspective: 700, zIndex: 3 }}
      initial={false}
      animate={
        tucked
          ? { left: '1%', top: '17%', scale: 0.52, rotate: -16, opacity: 1 }
          : { left: '27%', top: '40%', scale: 1, rotate: 0, opacity: step >= 1 ? 1 : 0 }
      }
      transition={{ duration: tucked ? 2.2 : 1.4, ease }}
    >
      {/* soft shadow it casts */}
      <motion.div
        className="absolute left-[6%] right-[6%] -bottom-[10%] h-[18%] rounded-[50%]"
        style={{ background: 'radial-gradient(closest-side, rgba(110,70,64,.22), transparent)' }}
        animate={{ opacity: inside ? 1 : 0 }}
        transition={{ duration: 1 }}
      />

      {/* envelope back with its polka-dot lining */}
      <motion.div
        className="absolute inset-0 rounded-[4px] dots-soft"
        style={{ zIndex: 1, boxShadow: 'inset 0 0 0 1px rgba(214,170,170,.35)' }}
        animate={{ opacity: inside ? 1 : 0 }}
        transition={{ duration: 0.9 }}
      />

      {/* the letter, folding in three */}
      <motion.div
        className="absolute left-[10%] w-[80%]"
        style={{ height: '62%', zIndex: 2, transformStyle: 'preserve-3d' }}
        initial={false}
        animate={{ top: inside ? '20%' : '-62%' }}
        transition={{ duration: 1.5, ease, delay: inside ? 0.5 : 0 }}
      >
        <div className="absolute inset-0 rounded-[2px]" style={PAPER}>
          <Lines n={4} />
        </div>
        {/* top third folds down */}
        <div
          className="absolute left-0 right-0 bottom-full h-full rounded-[2px]"
          style={{
            ...PAPER,
            transformOrigin: 'bottom center',
            transform: folded2 ? 'translateZ(2px) rotateX(-180deg)' : 'rotateX(0deg)',
            transition: 'transform 1.1s cubic-bezier(.45,.05,.25,1)',
            boxShadow: folded2 ? '0 1px 3px rgba(120,90,80,.18)' : PAPER.boxShadow,
          }}
        >
          <Lines n={2} sprig />
        </div>
        {/* bottom third folds up */}
        <div
          className="absolute left-0 right-0 top-full h-full rounded-[2px]"
          style={{
            ...PAPER,
            transformOrigin: 'top center',
            transform: folded1 ? 'translateZ(1px) rotateX(180deg)' : 'rotateX(0deg)',
            transition: 'transform 1.1s cubic-bezier(.45,.05,.25,1)',
          }}
        >
          <Lines n={3} />
        </div>
      </motion.div>

      {/* front pocket */}
      <motion.svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 300 200"
        preserveAspectRatio="none"
        style={{ zIndex: 3 }}
        animate={{ opacity: inside ? 1 : 0 }}
        transition={{ duration: 0.9 }}
        aria-hidden="true"
      >
        <path d="M0 6 Q0 0 6 0 L150 112 L0 200 Z" fill="#F6EFE5" />
        <path d="M300 6 Q300 0 294 0 L150 112 L300 200 Z" fill="#F3EADF" />
        <path d="M0 194 L150 100 L300 194 Q300 200 294 200 L6 200 Q0 200 0 194Z" fill="#FDF9F3" />
        <path d="M2 196 L150 100 L298 196" stroke="#E8DCCD" strokeWidth="1.2" fill="none" />
      </motion.svg>

      {/* flap */}
      <motion.div
        className="absolute inset-0"
        style={{ zIndex: closed ? 4 : 1, transition: 'z-index 0s .5s', perspective: 700 }}
        animate={{ opacity: inside ? 1 : 0 }}
        transition={{ duration: 0.9 }}
      >
        <div
          className="absolute left-0 right-0 top-0"
          style={{
            height: '60%',
            transformOrigin: 'top center',
            transformStyle: 'preserve-3d',
            transform: closed ? 'rotateX(0deg)' : 'rotateX(180deg)',
            transition: 'transform 1s cubic-bezier(.45,.05,.25,1)',
          }}
        >
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none" style={{ backfaceVisibility: 'hidden', filter: 'drop-shadow(0 2px 2px rgba(120,90,80,.14))' }} aria-hidden="true">
            <path d="M0 6 Q0 0 6 0 L294 0 Q300 0 300 6 L162 110 Q150 118 138 110 Z" fill="#F8F1E7" stroke="#E8DCCD" strokeWidth="1" />
          </svg>
          <div className="absolute inset-0 dots-soft" style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)', clipPath: 'polygon(0 0, 100% 0, 54% 92%, 50% 98%, 46% 92%)' }} />
          <div className="absolute left-1/2 -translate-x-1/2" style={{ top: 'calc(92% - 9px)', backfaceVisibility: 'hidden' }}>
            <svg width="18" height="18" viewBox="0 0 30 30" aria-hidden="true">
              <circle cx="15" cy="15" r="13" fill="#E2AEB3" />
              {[0, 72, 144, 216, 288].map((a) => (
                <ellipse key={a} cx="15" cy="10.4" rx="2.6" ry="3.8" fill="#FCEFEB" transform={`rotate(${a} 15 15)`} />
              ))}
              <circle cx="15" cy="15" r="2" fill="#E9C59F" />
            </svg>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
