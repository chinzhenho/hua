// The wrapping, in physical layers: white outer sheets behind, pink polka-dot paper,
// then the folded front panels. Each piece has curvature shading, a turned-over edge and creases.

export function WrapDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <linearGradient id="w-sheet-l" x1="0" y1="0" x2="1" y2="0.2">
          <stop offset="0" stopColor="#E9E0D6" />
          <stop offset="0.6" stopColor="#FBF8F3" />
          <stop offset="1" stopColor="#FFFFFF" />
        </linearGradient>
        <linearGradient id="w-sheet-r" x1="1" y1="0" x2="0" y2="0.2">
          <stop offset="0" stopColor="#E6DCD1" />
          <stop offset="0.6" stopColor="#FAF6F1" />
          <stop offset="1" stopColor="#FFFFFF" />
        </linearGradient>
        <linearGradient id="w-sheet-c" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#E8DED3" />
        </linearGradient>
        <linearGradient id="w-front-l" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ECE3D9" />
          <stop offset="0.45" stopColor="#FFFDF9" />
          <stop offset="1" stopColor="#F4EEE7" />
        </linearGradient>
        <linearGradient id="w-front-r" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#E8DED3" />
          <stop offset="0.5" stopColor="#FFFEFB" />
          <stop offset="1" stopColor="#F1EAE2" />
        </linearGradient>
        <linearGradient id="w-shade-down" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7A5050" stopOpacity="0" />
          <stop offset="1" stopColor="#7A5050" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="w-shade-top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7A5050" stopOpacity="0.18" />
          <stop offset="0.35" stopColor="#7A5050" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="w-pink-curve-l" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7A4A4E" stopOpacity="0.22" />
          <stop offset="0.5" stopColor="#7A4A4E" stopOpacity="0" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id="w-pink-curve-r" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#7A4A4E" stopOpacity="0.26" />
          <stop offset="0.55" stopColor="#7A4A4E" stopOpacity="0" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="w-ribbon" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F5D6D7" />
          <stop offset="0.45" stopColor="#E8B5B9" />
          <stop offset="1" stopColor="#D69CA2" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function GroundShadow() {
  return (
    <>
      <ellipse cx="200" cy="540" rx="120" ry="12" fill="#8E6F62" opacity="0.18" filter="url(#hua-blur-lg)" />
      <ellipse cx="200" cy="534" rx="46" ry="5" fill="#7A5A50" opacity="0.18" filter="url(#hua-blur)" />
    </>
  )
}

/*
 * Shape follows the real bouquet: tall pink polka-dot sheets fanning up behind the
 * flowers, warm-white outer sheets behind and at the sides, a white paper "bowl" in
 * front, gathered into a wrapped handle with a bow and long ribbon tails.
 */

// warm-white outer sheets, furthest back
export function WrapBack({ shape = 'tall' }) {
  if (shape === 'fan')
    return (
      <g>
        <path d="M200 420 L4 236 C14 136 92 44 200 32 C308 44 386 136 396 236 Z" fill="url(#w-sheet-c)" />
        <path d="M200 420 L4 236 C14 136 92 44 200 32" fill="url(#w-sheet-l)" opacity="0.6" />
        <path d="M4 236 C14 136 92 44 200 32 C308 44 386 136 396 236" stroke="#FFFFFF" strokeWidth="2.4" fill="none" />
        <path d="M200 420 L80 70 M200 420 L320 70 M200 420 L200 32" stroke="#E4D9CD" strokeWidth="0.8" opacity="0.7" fill="none" />
      </g>
    )
  return (
    <g>
      {/* tall centre sheet */}
      <path d="M118 330 L150 40 Q210 18 262 30 L318 330 Z" fill="url(#w-sheet-c)" />
      <path d="M150 40 Q210 18 262 30" stroke="#FFFFFF" strokeWidth="2.4" fill="none" />
      {/* side flaps that open outwards */}
      <path d="M80 384 L-10 304 Q-8 272 14 250 L150 330 Z" fill="url(#w-sheet-l)" />
      <path d="M-10 304 Q-8 272 14 250" stroke="#FFFFFF" strokeWidth="2" fill="none" />
      <path d="M320 384 L410 308 Q408 276 386 254 L250 330 Z" fill="url(#w-sheet-r)" />
      <path d="M410 308 Q408 276 386 254" stroke="#FFFFFF" strokeWidth="2" fill="none" />
      <path d="M200 400 L170 30 M200 400 L306 34" stroke="#E4D9CD" strokeWidth="0.8" opacity="0.7" fill="none" />
    </g>
  )
}

// two big pink polka-dot sheets standing up behind the flowers
export function DotsBack({ shape = 'tall' }) {
  if (shape === 'fan') {
    const d = 'M200 412 L26 244 C42 150 112 82 200 74 C288 82 358 150 374 244 Z'
    return (
      <g>
        <path d={d} fill="url(#hua-dots)" />
        <path d={d} fill="url(#w-shade-down)" />
        <path d={d} fill="url(#w-shade-top)" />
        <path d="M26 244 C42 150 112 82 200 74 C288 82 358 150 374 244" stroke="#FCE9EA" strokeWidth="2.4" fill="none" />
        <path d="M200 412 L110 96 M200 412 L290 96" stroke="#D9A8AE" strokeWidth="0.8" opacity="0.5" fill="none" />
      </g>
    )
  }
  const left = 'M66 350 L20 92 Q20 80 32 78 L214 100 Q226 102 226 114 L246 318 Z'
  const right = 'M232 312 L262 46 Q264 36 274 34 L336 22 Q348 21 350 32 L378 340 Z'
  return (
    <g>
      <path d={left} fill="url(#hua-dots)" />
      <path d={left} fill="url(#w-pink-curve-l)" />
      <path d={left} fill="url(#w-shade-down)" />
      <path d="M20 92 Q20 80 32 78 L214 100 Q226 102 226 114" stroke="#FCE9EA" strokeWidth="2.4" fill="none" />
      <path d="M66 350 L20 92" stroke="#E2B0B5" strokeWidth="0.9" fill="none" opacity="0.7" />

      <path d={right} fill="#3C2A28" opacity="0.1" transform="translate(-5 4)" filter="url(#hua-blur)" />
      <path d={right} fill="url(#hua-dots)" />
      <path d={right} fill="url(#w-pink-curve-r)" />
      <path d={right} fill="url(#w-shade-down)" />
      <path d="M262 46 Q264 36 274 34 L336 22 Q348 21 350 32" stroke="#FCE9EA" strokeWidth="2.4" fill="none" />
      <path d="M262 46 L232 312" stroke="#E2B0B5" strokeWidth="0.9" fill="none" opacity="0.6" />
    </g>
  )
}

// a thin rim of polka-dot paper peeking above the white front
export function DotsFront() {
  const rim = 'M12 290 C58 346 130 374 200 376 C270 374 342 344 388 284 L394 298 C350 354 270 386 200 388 C130 386 50 356 6 302Z'
  return (
    <g>
      <path d={rim} fill="url(#hua-dots)" />
      <path d={rim} fill="url(#w-pink-curve-l)" />
      <path d="M12 290 C58 346 130 374 200 376 C270 374 342 344 388 284" stroke="#FBE6E7" strokeWidth="1.8" fill="none" />
    </g>
  )
}

// warm-white front "bowl" gathered into a handle
export function WrapFront() {
  const bowl = 'M6 300 C30 364 108 420 170 446 L230 446 C292 420 370 362 396 296 C350 354 270 388 200 390 C130 388 50 356 6 300Z'
  return (
    <g>
      <path d={bowl} fill="#3C2A28" opacity="0.1" transform="translate(0 -4)" filter="url(#hua-blur)" />
      <path d={bowl} fill="url(#w-front-l)" />
      <path d={bowl} fill="url(#w-shade-down)" opacity="0.7" />
      {/* turned-over top edge */}
      <path d="M6 300 C50 356 130 388 200 390 C270 388 350 354 396 296 L392 308 C346 364 268 398 200 400 C132 398 54 366 10 312Z" fill="#FFFFFF" />
      <path d="M10 312 C54 366 132 398 200 400 C268 398 346 364 392 308" stroke="#E6DCD1" strokeWidth="0.8" fill="none" />
      {/* soft folds running down into the handle */}
      <path d="M70 360 Q130 410 182 444 M330 356 Q270 410 218 444 M200 400 L200 446" stroke="#E7DDD2" strokeWidth="1" fill="none" opacity="0.8" />
      <path d="M120 386 Q160 420 190 446" stroke="#FFFFFF" strokeWidth="1.4" fill="none" opacity="0.8" />

      {/* wrapped handle */}
      <path d="M172 444 L228 444 L222 522 Q200 530 178 522 Z" fill="url(#w-front-r)" />
      <path d="M186 446 L184 524 M206 446 L208 526" stroke="#E6DCD1" strokeWidth="0.8" fill="none" />
      <path d="M172 444 L228 444 L226 456 L174 456Z" fill="#7A5050" opacity="0.06" />
    </g>
  )
}

export function Ribbon() {
  return (
    <g>
      {/* long tails */}
      <path d="M196 458 C186 490 168 520 140 556 L148 558 C176 524 194 494 201 460Z" fill="#EBBABE" />
      <path d="M204 458 C214 490 236 518 266 552 L258 556 C230 522 210 494 199 460Z" fill="#F4E6CF" stroke="#E2CFAF" strokeWidth="0.5" />
      <path d="M200 460 C202 494 214 526 226 560 L220 560 C208 528 198 496 197 462Z" fill="#E4AEB3" />
      {/* band and bow */}
      <path d="M168 448 Q200 458 232 448 L231 462 Q200 470 169 462 Z" fill="url(#w-ribbon)" />
      <path d="M198 456 C176 434 150 432 152 450 C154 466 180 464 198 456Z" fill="#EEC5C8" stroke="#D69FA5" strokeWidth="0.8" />
      <path d="M190 452 C176 443 162 442 160 449" stroke="#FBE6E6" strokeWidth="1.2" fill="none" />
      <path d="M202 456 C224 434 250 432 248 450 C246 466 220 464 202 456Z" fill="#F3E3CB" stroke="#DCC7A6" strokeWidth="0.8" />
      <ellipse cx="200" cy="457" rx="7" ry="6" fill="#E3AAAF" stroke="#D69FA5" strokeWidth="0.8" />
      <ellipse cx="198" cy="455" rx="2.8" ry="1.8" fill="#F6D9DA" opacity="0.8" />
    </g>
  )
}
