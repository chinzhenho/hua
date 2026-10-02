import { useEffect, useRef, useState } from 'react'
import { DESIGN } from '../design.js'
import songUrl from '../assets/music.mp3'

/*
 * Soft background music.
 * - If you put a file at public/music.mp3, that song is used (quietly, looped).
 * - Otherwise a gentle piano piece is played live in the browser (no files needed).
 * Music never starts on its own: only when the ♪ button is tapped.
 */

const midi = (n) => 440 * Math.pow(2, (n - 69) / 12)

// 66 bpm, F major: F – Am – Dm – B♭ – F – Am – B♭ – C
const BEAT = 60 / 66
const BARS = [
  { bass: 41, arp: [53, 60, 64, 65, 69], mel: [[0, 72], [2, 76]] },
  { bass: 45, arp: [52, 57, 60, 64, 67], mel: [[0, 76], [2.5, 79]] },
  { bass: 38, arp: [50, 57, 60, 62, 65], mel: [[0, 77], [2, 74]] },
  { bass: 46, arp: [53, 58, 62, 65, 69], mel: [[0, 74], [2, 72]] },
  { bass: 41, arp: [53, 60, 64, 65, 69], mel: [[0, 69], [1.5, 72], [2, 77]] },
  { bass: 45, arp: [52, 57, 60, 64, 67], mel: [[0, 76]] },
  { bass: 46, arp: [53, 58, 62, 65, 69], mel: [[0, 74], [2, 77]] },
  { bass: 36, arp: [48, 55, 60, 62, 64], mel: [[0, 76], [2, 74]] },
]
const ARP = [0, 1, 2, 3, 4, 3, 2, 1]

function createPiano() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)()
  const master = ctx.createGain()
  master.gain.value = 0
  const tone = ctx.createBiquadFilter()
  tone.type = 'lowpass'
  tone.frequency.value = 2600

  // small, soft room
  const verb = ctx.createConvolver()
  const len = ctx.sampleRate * 3.2
  const ir = ctx.createBuffer(2, len, ctx.sampleRate)
  for (let c = 0; c < 2; c++) {
    const d = ir.getChannelData(c)
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2)
  }
  verb.buffer = ir
  const wet = ctx.createGain()
  wet.gain.value = 0.42
  const dry = ctx.createGain()
  dry.gain.value = 0.72

  tone.connect(dry).connect(master)
  tone.connect(verb).connect(wet).connect(master)
  master.connect(ctx.destination)

  const note = (n, t, vel, dur = 3.6) => {
    const f = midi(n)
    ;[[1, 1], [2, 0.32], [3, 0.1], [4.02, 0.04]].forEach(([h, a], k) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'sine'
      o.frequency.value = f * h
      const peak = vel * a
      const end = t + dur * (k === 0 ? 1 : 0.55)
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(peak, t + 0.012)
      g.gain.exponentialRampToValueAtTime(peak * 0.35, t + 0.5)
      g.gain.exponentialRampToValueAtTime(0.0001, end)
      o.connect(g).connect(tone)
      o.start(t)
      o.stop(end + 0.05)
    })
  }

  let bar = 0
  let nextBar = 0
  let timer = null
  const schedule = () => {
    while (nextBar < ctx.currentTime + 1.6) {
      const b = BARS[bar % BARS.length]
      note(b.bass, nextBar, 0.26, 5)
      ARP.forEach((idx, i) => note(b.arp[idx], nextBar + i * BEAT * 0.5, i === 0 ? 0.13 : 0.09, 3))
      b.mel.forEach(([beat, n]) => note(n, nextBar + beat * BEAT, 0.2, 4))
      nextBar += BEAT * 4
      bar++
    }
  }

  return {
    async play() {
      await ctx.resume()
      if (!timer) {
        nextBar = ctx.currentTime + 0.15
        schedule()
        timer = setInterval(schedule, 250)
      }
      master.gain.cancelScheduledValues(ctx.currentTime)
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime)
      master.gain.linearRampToValueAtTime(0.24, ctx.currentTime + 2.5)
    },
    pause() {
      master.gain.cancelScheduledValues(ctx.currentTime)
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime)
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2)
      setTimeout(() => {
        clearInterval(timer)
        timer = null
        ctx.suspend()
      }, 1300)
    },
  }
}

function createFilePlayer(src) {
  const audio = new Audio(src)
  audio.loop = true
  audio.volume = 0
  let fade = null
  const rampTo = (v, done) => {
    clearInterval(fade)
    fade = setInterval(() => {
      const next = audio.volume + (v > audio.volume ? 0.02 : -0.03)
      if ((v > audio.volume && next >= v) || (v <= audio.volume && next <= v)) {
        audio.volume = Math.max(0, Math.min(1, v))
        clearInterval(fade)
        done?.()
      } else audio.volume = Math.max(0, Math.min(1, next))
    }, 80)
  }
  return {
    async play() {
      await audio.play()
      rampTo(0.35)
    },
    pause() {
      rampTo(0, () => audio.pause())
    },
  }
}

const ringStyle = (on) => ({
  top: 'max(14px, env(safe-area-inset-top))',
  right: 'max(14px, env(safe-area-inset-right))',
  background: 'rgba(255,252,247,.72)',
  boxShadow: on ? '0 0 0 1px rgba(201,139,143,.55), 0 4px 14px -6px rgba(150,100,95,.35)' : '0 0 0 1px rgba(201,139,143,.28)',
  color: on ? '#B57C80' : '#C9A7A6',
})

/*
 * Embedded version: the ♪ button opens a small official YouTube / Spotify player.
 * She taps ▶ inside it to play (browsers don't let a page start music by itself).
 * The player stays loaded when closed, so the song keeps playing.
 */
function EmbedMusic({ src, title, height, ratio }) {
  const [open, setOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const toggle = () => {
    setLoaded(true)
    setOpen((o) => !o)
  }
  return (
    <>
      <button
        type="button"
        onClick={toggle}
        aria-label={open ? '收起音乐' : '打开音乐'}
        aria-expanded={open}
        className="music-toggle fixed z-50 w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-700"
        style={ringStyle(open)}
      >
        <span className={`text-[17px] leading-none ${open ? 'soft-pulse' : ''}`}>♪</span>
      </button>
      {loaded && (
        <div
          className="fixed z-50 transition-all duration-700"
          style={{
            top: 'calc(max(14px, env(safe-area-inset-top)) + 54px)',
            right: 'max(14px, env(safe-area-inset-right))',
            width: DESIGN.youtube ? 'min(240px, calc(100vw - 28px))' : 'min(300px, calc(100vw - 28px))',
            opacity: open ? 1 : 0,
            transform: open ? 'translateY(0)' : 'translateY(-8px)',
            pointerEvents: open ? 'auto' : 'none',
            filter: 'drop-shadow(0 10px 24px rgba(120,80,75,.18))',
          }}
        >
          <iframe
            title={title}
            src={src}
            width="100%"
            height={height}
            style={{ border: 0, borderRadius: 12, display: 'block', width: '100%', height: ratio ? 'auto' : height, aspectRatio: ratio, background: '#F6EEE6' }}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </div>
      )}
    </>
  )
}

/*
 * Song file version: the music starts by itself as soon as the browser allows it —
 * immediately where autoplay is permitted, otherwise on her very first tap
 * (e.g. 轻轻点一下 on the bouquet). The ♪ button pauses / resumes.
 */
function SongMusic({ src }) {
  const [on, setOn] = useState(false)
  const audio = useRef(null)
  const btn = useRef(null)
  const fade = useRef(null)

  const rampTo = (target, done) => {
    const a = audio.current
    clearInterval(fade.current)
    fade.current = setInterval(() => {
      const step = target > a.volume ? 0.03 : -0.05
      const next = a.volume + step
      if ((step > 0 && next >= target) || (step < 0 && next <= target)) {
        a.volume = Math.max(0, Math.min(1, target))
        clearInterval(fade.current)
        done?.()
      } else a.volume = Math.max(0, Math.min(1, next))
    }, 90)
  }

  const start = () => {
    const a = audio.current
    if (!a.paused) return Promise.resolve()
    a.volume = 0
    return a.play().then(() => {
      setOn(true)
      rampTo(0.55)
    })
  }

  useEffect(() => {
    const a = new Audio(src)
    a.loop = true
    a.preload = 'auto'
    audio.current = a
    let armed = true
    const onFirst = (e) => {
      if (!armed || btn.current?.contains(e.target)) return
      armed = false
      start().catch(() => (armed = true))
    }
    // try straight away (works where the browser allows autoplay)…
    start()
      .then(() => (armed = false))
      .catch(() => {})
    // …otherwise begin on the first touch, click or key
    const evs = ['pointerdown', 'touchstart', 'touchend', 'click', 'keydown', 'wheel', 'scroll']
    evs.forEach((ev) => window.addEventListener(ev, onFirst, { capture: true, passive: true }))
    return () => {
      evs.forEach((ev) => window.removeEventListener(ev, onFirst, { capture: true }))
      clearInterval(fade.current)
      a.pause()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src])

  const toggle = () => {
    const a = audio.current
    if (on) {
      setOn(false)
      rampTo(0, () => a.pause())
    } else start().catch(() => {})
  }

  // little notes drifting out while the song plays
  const [notes, setNotes] = useState([])
  useEffect(() => {
    if (!on) return
    let id = 0
    const t = setInterval(() => {
      const n = { id: Date.now() + id++, g: ['♪', '♫', '♩', '♬'][Math.floor(Math.random() * 4)], dx: -(18 + Math.random() * 46), dy: 26 + Math.random() * 40, r: (Math.random() - 0.5) * 50, s: 1 + Math.random() * 0.5 }
      setNotes((list) => [...list.slice(-6), n])
      setTimeout(() => setNotes((list) => list.filter((x) => x.id !== n.id)), 3200)
    }, 900)
    return () => clearInterval(t)
  }, [on])

  return (
    <div
      className="music-toggle fixed z-50"
      style={{ top: 'max(14px, env(safe-area-inset-top))', right: 'max(14px, env(safe-area-inset-right))', width: 46, height: 46 }}
    >
      {notes.map((n) => (
        <span
          key={n.id}
          className="music-note"
          style={{ '--dx': `${n.dx}px`, '--dy': `${n.dy}px`, '--r': `${n.r}deg`, fontSize: `${15 * n.s}px` }}
          aria-hidden="true"
        >
          {n.g}
        </span>
      ))}
      <button
        ref={btn}
        type="button"
        onClick={toggle}
        aria-label={on ? '暂停音乐' : '播放音乐'}
        aria-pressed={on}
        className="relative block w-full h-full rounded-full"
        style={{ filter: on ? 'drop-shadow(0 4px 10px rgba(150,100,95,.28))' : 'none', transition: 'filter .7s' }}
      >
        {/* the same ♪ button — it turns slowly while the song plays */}
        <span
          className={`record absolute inset-0 rounded-full flex items-center justify-center backdrop-blur-sm ${on ? 'spinning' : ''}`}
          style={{
            background: 'rgba(255,252,247,.78)',
            boxShadow: on ? '0 0 0 1.2px rgba(201,139,143,.7)' : '0 0 0 1px rgba(201,139,143,.4)',
            color: on ? '#B57C80' : '#C9A7A6',
            transition: 'box-shadow .7s, color .7s',
          }}
        >
          <span className="text-[19px] leading-none">♪</span>
        </span>
      </button>
    </div>
  )
}

export default function MusicToggle() {
  if (DESIGN.useFile) return <SongMusic src={songUrl} />
  if (DESIGN.youtube)
    return (
      <EmbedMusic
        title="背景音乐"
        ratio="16 / 9"
        src={`https://www.youtube.com/embed/${DESIGN.youtube}?playsinline=1&rel=0&loop=1&playlist=${DESIGN.youtube}`}
      />
    )
  if (DESIGN.spotify)
    return <EmbedMusic title="背景音乐" height="80" src={`https://open.spotify.com/embed/track/${DESIGN.spotify}?utm_source=generator`} />
  return <PianoToggle />
}

function PianoToggle() {
  const [on, setOn] = useState(false)
  const player = useRef(null)
  const custom = useRef(null)

  useEffect(() => {
    // look for an optional music.mp3 next to index.html
    if (location.protocol === 'file:') return
    fetch('music.mp3', { method: 'HEAD' })
      .then((r) => {
        const type = r.headers.get('content-type') || ''
        custom.current = r.ok && type.startsWith('audio') ? 'music.mp3' : null
      })
      .catch(() => (custom.current = null))
  }, [])

  const toggle = async () => {
    try {
      if (!player.current) player.current = custom.current ? createFilePlayer(custom.current) : createPiano()
      if (on) {
        player.current.pause()
        setOn(false)
      } else {
        await player.current.play()
        setOn(true)
      }
    } catch {
      setOn(false)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={on ? '关闭音乐' : '打开音乐'}
      aria-pressed={on}
      className="music-toggle fixed z-50 w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-700"
      style={{
        top: 'max(14px, env(safe-area-inset-top))',
        right: 'max(14px, env(safe-area-inset-right))',
        background: 'rgba(255,252,247,.72)',
        boxShadow: on ? '0 0 0 1px rgba(201,139,143,.55), 0 4px 14px -6px rgba(150,100,95,.35)' : '0 0 0 1px rgba(201,139,143,.28)',
        color: on ? '#B57C80' : '#C9A7A6',
      }}
    >
      <span className={`text-[17px] leading-none ${on ? 'soft-pulse' : ''}`}>♪</span>
    </button>
  )
}
