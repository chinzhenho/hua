import { useEffect, useRef, useState } from 'react'

// Holds the page still while a cinematic moment plays (wheel, touch and keys).
const block = (e) => e.preventDefault()
const keys = new Set(['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ', 'Spacebar'])
const blockKeys = (e) => keys.has(e.key) && e.preventDefault()

export function lockScroll() {
  window.addEventListener('wheel', block, { passive: false })
  window.addEventListener('touchmove', block, { passive: false })
  window.addEventListener('keydown', blockKeys)
}
export function unlockScroll() {
  window.removeEventListener('wheel', block)
  window.removeEventListener('touchmove', block)
  window.removeEventListener('keydown', blockKeys)
}

// Smoothly brings an element to the top of the screen, then resolves.
export function settleOn(el, ms = 900) {
  return new Promise((resolve) => {
    const top = el.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top, behavior: 'smooth' })
    setTimeout(() => {
      window.scrollTo({ top })
      resolve()
    }, ms)
  })
}

/**
 * Fires `start` once, when the section is mostly on screen.
 * Returns [ref, started].
 */
export function usePlayOnce(threshold = 0.55) {
  const ref = useRef(null)
  const [started, setStarted] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || started) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [started, threshold])
  return [ref, started]
}

// Runs a list of [delayMs, fn] steps once `active` becomes true.
export function useTimeline(active, steps) {
  useEffect(() => {
    if (!active) return
    const timers = steps.map(([ms, fn]) => setTimeout(fn, ms))
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])
}
