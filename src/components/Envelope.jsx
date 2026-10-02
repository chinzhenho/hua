import { forwardRef, useImperativeHandle, useState } from 'react'
import { motion } from 'framer-motion'

// Small pink floral seal — the "tiny detail" on the flap.
function Seal() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
      <circle cx="15" cy="15" r="13" fill="#E2AEB3" />
      <circle cx="15" cy="15" r="11" fill="none" stroke="#F3D3D5" strokeWidth="0.8" strokeDasharray="1.6 2.2" />
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="15" cy="10.4" rx="2.6" ry="3.8" fill="#FCEFEB" transform={`rotate(${a} 15 15)`} />
      ))}
      <circle cx="15" cy="15" r="2" fill="#E9C59F" />
    </svg>
  )
}

/**
 * Envelope — warm white outside, pink polka-dot lining inside.
 * Click once: flap opens, paper slides out, then onOpened() fires.
 */
// four looks, all in the bouquet's palette
const LOOKS = {
  classic: { l: ['#F4ECE1', '#FBF6EE'], r: ['#FBF6EE', '#F1E8DC'], b: ['#FFFCF7', '#F7EFE4'], f: ['#F6EEE3', '#FFFCF6'], line: '#E8DCCD', text: '#B57C80' },
  blush: { l: ['#F1D2D4', '#F8E3E3'], r: ['#F8E3E3', '#EECCCF'], b: ['#FBEAEA', '#F3D7D8'], f: ['#F3D6D8', '#FAE8E8'], line: '#E3BCC0', text: '#A9656F' },
  dots: { l: ['#F4ECE1', '#FBF6EE'], r: ['#FBF6EE', '#F1E8DC'], b: ['#FFFCF7', '#F7EFE4'], f: ['#F6EEE3', '#FFFCF6'], line: '#E8DCCD', text: '#B57C80' },
  sprig: { l: ['#F5EEE4', '#FCF8F1'], r: ['#FCF8F1', '#F2EADF'], b: ['#FFFDF9', '#F8F1E7'], f: ['#F7F0E6', '#FFFDF8'], line: '#E4D3B6', text: '#B57C80' },
}

// tiny bouquet held on with a strip of polka-dot tape
function SprigTape() {
  return (
    <svg width="64" height="48" viewBox="0 0 64 48" aria-hidden="true">
      <path d="M32 44 Q30 30 32 18" stroke="#93A38D" strokeWidth="1.3" fill="none" />
      <path d="M32 40 Q22 30 14 30" stroke="#93A38D" strokeWidth="1" fill="none" />
      <path d="M32 38 Q42 28 50 28" stroke="#93A38D" strokeWidth="1" fill="none" />
      {[[14, 30, 4.2], [20, 26, 3.6], [50, 28, 4], [44, 24, 3.4]].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={i % 2 ? '#B3C1AE' : '#A4B4A0'} />
      ))}
      <circle cx="26" cy="16" r="5" fill="#FBF2E4" stroke="#DCC7A6" strokeWidth=".5" />
      <circle cx="40" cy="15" r="4.2" fill="#F4CFD1" stroke="#D79AA1" strokeWidth=".5" />
      <circle cx="33" cy="12" r="7.5" fill="#F0BEC2" stroke="#D6949B" strokeWidth=".6" />
      <path d="M28 12 a5 5 0 0 1 10 0" stroke="#FBE3E3" strokeWidth="1.1" fill="none" />
      <path d="M30 13 a3.2 3.2 0 1 1 3.2 3.2" stroke="#D6949B" strokeWidth=".9" fill="none" />
      <g transform="rotate(-8 32 34)">
        <rect x="14" y="29" width="36" height="10" rx="1" fill="#F2CBD0" opacity=".92" />
        {[18, 26, 34, 42].map((x) => <circle key={x} cx={x} cy={32} r="1.2" fill="#FFF6F3" />)}
        {[22, 30, 38, 46].map((x) => <circle key={x} cx={x} cy={36} r="1.2" fill="#FFF6F3" />)}
      </g>
    </svg>
  )
}

// ivory satin bow for the blush envelope
function RibbonBow() {
  return (
    <svg width="58" height="40" viewBox="0 0 58 40" aria-hidden="true">
      <path d="M27 18 C24 26 20 32 15 38 L20 37 L22 40 C26 34 29 27 30 19Z" fill="#EFE2CC" />
      <path d="M31 18 C34 26 38 32 43 38 L38 37 L36 40 C32 34 29 27 28 19Z" fill="#E9DABF" />
      <path d="M29 17 C20 6 4 4 5 14 C6 24 20 23 29 17Z" fill="#FBF3E6" stroke="#E2D0B2" strokeWidth=".8" />
      <path d="M29 17 C38 6 54 4 53 14 C52 24 38 23 29 17Z" fill="#F7ECDA" stroke="#E2D0B2" strokeWidth=".8" />
      <path d="M24 13 C18 9 10 9 9 13" stroke="#fff" strokeWidth="1.2" fill="none" />
      <ellipse cx="29" cy="17" rx="4.4" ry="4" fill="#F0E2CB" stroke="#E2D0B2" strokeWidth=".8" />
    </svg>
  )
}

// dusty-rose wax seal with a small heart
function WaxSeal() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
      <path d="M17 1 C22 2 25 1 28 5 C32 8 33 12 32 17 C33 22 31 26 27 29 C24 32 21 33 17 32 C12 33 8 32 6 29 C2 26 1 22 2 17 C1 12 3 8 6 5 C9 2 12 1 17 1Z" fill="#D49BA2" />
      <circle cx="17" cy="17" r="11" fill="#CD9199" />
      <circle cx="17" cy="17" r="11" fill="none" stroke="#E6B9BE" strokeWidth=".8" />
      <path d="M17 22.5 C12.5 19.5 11 17.4 11 15.3 C11 13.6 12.3 12.4 13.9 12.4 C15.2 12.4 16.3 13.2 17 14.3 C17.7 13.2 18.8 12.4 20.1 12.4 C21.7 12.4 23 13.6 23 15.3 C23 17.4 21.5 19.5 17 22.5Z" fill="#E8B7BD" />
      <ellipse cx="12" cy="10" rx="4" ry="2" fill="#fff" opacity=".25" />
    </svg>
  )
}

const Envelope = forwardRef(function Envelope({ onOpen, onOpened, look = 'classic' }, ref) {
  const c = LOOKS[look] || LOOKS.classic
  const id = (n) => `env-${n}-${look}`
  const [stage, setStage] = useState('closed') // closed → open → out

  const open = () => {
    if (stage !== 'closed') return
    setStage('open')
    onOpen?.()
    setTimeout(() => setStage('out'), 1100)
    setTimeout(() => onOpened?.(), 3600)
  }

  // lets the scene open it from a tap anywhere on the screen
  useImperativeHandle(ref, () => ({ open }))

  const flapOpen = stage !== 'closed'

  return (
    <button
      type="button"
      onClick={open}
      aria-label="打开信封"
      className="relative block outline-none focus-visible:ring-2 focus-visible:ring-blush rounded-md"
      style={{ width: 'min(80vw, 400px)', aspectRatio: '3 / 2', perspective: '1200px', cursor: stage === 'closed' ? 'pointer' : 'default' }}
    >
      {/* soft shadow */}
      <div
        className="absolute -bottom-5 left-[8%] right-[8%] h-6 rounded-[50%]"
        style={{ background: 'radial-gradient(closest-side, rgba(140,105,90,.22), transparent)' }}
      />

      {/* inside lining */}
      <div className="absolute inset-0 rounded-[6px] dots-soft" style={{ boxShadow: 'inset 0 0 0 1px rgba(214,170,170,.35)' }} />

      {/* the letter paper */}
      <motion.div
        className="absolute paper-grain rounded-[6px] overflow-hidden"
        style={{ left: '6%', right: '6%', top: '7%', height: '86%', zIndex: 2, boxShadow: '0 2px 10px rgba(120,90,80,.12)' }}
        initial={false}
        animate={stage === 'out' ? { y: '-62%' } : { y: '0%' }}
        transition={{ duration: 1.8, ease: [0.33, 0, 0.2, 1] }}
      >
        <div className="flex flex-col items-center pt-[9%] gap-[7%] h-full">
          <svg width="44" height="22" viewBox="0 0 44 22" aria-hidden="true">
            <path d="M22 18 Q14 12 6 13" stroke="#A9B99E" strokeWidth="1" fill="none" />
            <path d="M22 18 Q30 12 38 13" stroke="#A9B99E" strokeWidth="1" fill="none" />
            <ellipse cx="9" cy="12" rx="4" ry="1.8" fill="#B5C3AA" transform="rotate(-15 9 12)" />
            <ellipse cx="35" cy="12" rx="4" ry="1.8" fill="#B5C3AA" transform="rotate(15 35 12)" />
            <circle cx="22" cy="11" r="6" fill="#F2C3C6" />
            <path d="M18.5 11 a3.5 3.5 0 1 1 3.5 3.5" stroke="#DE9AA2" strokeWidth="1" fill="none" />
          </svg>
          <div className="w-[64%] space-y-[9px] opacity-60">
            <div className="h-px bg-[#e7d9c9]" />
            <div className="h-px bg-[#e7d9c9] w-[82%] mx-auto" />
            <div className="h-px bg-[#e7d9c9] w-[90%] mx-auto" />
          </div>
        </div>
      </motion.div>

      {/* front pocket */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 200" preserveAspectRatio="none" style={{ zIndex: 3 }} aria-hidden="true">
        <defs>
          <linearGradient id={id('l')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={c.l[0]} />
            <stop offset="1" stopColor={c.l[1]} />
          </linearGradient>
          <linearGradient id={id('r')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={c.r[0]} />
            <stop offset="1" stopColor={c.r[1]} />
          </linearGradient>
          <linearGradient id={id('b')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={c.b[0]} />
            <stop offset="1" stopColor={c.b[1]} />
          </linearGradient>
          <linearGradient id={id('ribbon')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFFBF3" />
            <stop offset="0.5" stopColor="#F5EAD8" />
            <stop offset="1" stopColor="#E9D9BF" />
          </linearGradient>
        </defs>
        <path d="M0 6 Q0 0 6 0 L150 112 L0 200 Z" fill={`url(#${id('l')})`} />
        <path d="M300 6 Q300 0 294 0 L150 112 L300 200 Z" fill={`url(#${id('r')})`} />
        <path d="M0 194 L150 100 L300 194 Q300 200 294 200 L6 200 Q0 200 0 194Z" fill={`url(#${id('b')})`} />
        <path d="M2 196 L150 100 L298 196" stroke={c.line} strokeWidth="0.9" fill="none" />
        <path d="M2 2 L150 112 L298 2" stroke={c.line} strokeWidth="0.7" fill="none" opacity="0.8" />
        {look === 'sprig' && <rect x="7" y="7" width="286" height="186" rx="3" fill="none" stroke="#DCC7A0" strokeWidth="0.7" opacity="0.6" />}
        {look === 'blush' && (
          <g>
            <path d="M0 116 Q150 122 300 116 L300 129 Q150 135 0 129Z" fill={`url(#${id('ribbon')})`} />
            <path d="M0 119 Q150 125 300 119" stroke="#FFFFFF" strokeWidth="1" opacity="0.7" fill="none" />
          </g>
        )}
        {/* tiny polka-dot band near the bottom edge */}
        {Array.from({ length: 9 }, (_, i) => (
          <circle key={i} cx={118 + i * 8} cy={191} r={1.2} fill="#E9BDC1" opacity={0.7} />
        ))}
      </svg>
      <span
        className="absolute left-0 right-0 text-center font-script text-dusty pointer-events-none"
        style={{ zIndex: 4, top: look === 'blush' ? '76%' : '71%', fontSize: 'clamp(24px, 7.4vw, 32px)', lineHeight: 1, color: c.text }}
      >
        For You
        <svg className="inline-block align-baseline ml-1.5" width="0.42em" height="0.4em" viewBox="0 0 20 18" aria-label="♡">
          <path d="M10 16.5 C4 12 1 9 1 5.6 C1 3 3 1 5.6 1 C7.6 1 9 2.2 10 3.8 C11 2.2 12.4 1 14.4 1 C17 1 19 3 19 5.6 C19 9 16 12 10 16.5Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      </span>

      {/* flap */}
      <div
        className="absolute left-0 right-0 top-0"
        style={{
          height: '60%',
          transformOrigin: 'top center',
          transformStyle: 'preserve-3d',
          transform: flapOpen ? 'rotateX(180deg)' : 'rotateX(0deg)',
          transition: 'transform 1.1s cubic-bezier(.45,.05,.25,1), z-index 0s .55s',
          zIndex: flapOpen ? 1 : 5,
        }}
      >
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none" style={{ backfaceVisibility: 'hidden', filter: 'drop-shadow(0 2px 2px rgba(120,90,80,.12))' }} aria-hidden="true">
          <defs>
            <linearGradient id={id('flap')} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={c.f[0]} />
              <stop offset="1" stopColor={c.f[1]} />
            </linearGradient>
            <pattern id={id('dots')} width="10" height="10" patternUnits="userSpaceOnUse">
              <rect width="10" height="10" fill="#F2CCD0" />
              <circle cx="2.5" cy="2.5" r="1.5" fill="#FFF7F4" />
              <circle cx="7.5" cy="7.5" r="1.5" fill="#FFF7F4" />
            </pattern>
          </defs>
          <path d="M0 6 Q0 0 6 0 L294 0 Q300 0 300 6 L162 110 Q150 118 138 110 Z" fill={look === 'dots' ? `url(#${id('dots')})` : `url(#${id('flap')})`} stroke={c.line} strokeWidth="0.8" />
          {look === 'sprig' && <path d="M8 6 L150 104 L292 6" stroke="#DCC7A0" strokeWidth="0.7" fill="none" opacity="0.6" />}
        </svg>
        <div
          className="absolute inset-0 dots-soft"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateX(180deg)',
            clipPath: 'polygon(0 0, 100% 0, 54% 92%, 50% 98%, 46% 92%)',
          }}
        />
        <div className="absolute left-1/2 -translate-x-1/2" style={{ top: look === 'sprig' ? 'calc(92% - 30px)' : look === 'blush' ? 'calc(92% - 2px)' : 'calc(92% - 15px)', backfaceVisibility: 'hidden' }}>
          {look === 'classic' && <Seal />}
          {look === 'dots' && <WaxSeal />}
          {look === 'sprig' && <SprigTape />}
          {look === 'blush' && <RibbonBow />}
        </div>
      </div>
    </button>
  )
})

export default Envelope
