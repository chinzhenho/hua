// Design picker: every bouquet and envelope option side by side.  Open /preview.html
import React from 'react'
import ReactDOM from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import './index.css'
import { FlowerDefs } from './components/Flowers.jsx'
import { WrapDefs } from './components/BouquetWrapping.jsx'
import Bouquet3D from './components/Bouquet3D.jsx'
import Envelope from './components/Envelope.jsx'
import { BOUQUETS } from './variants.js'

const ENVELOPES = [
  ['classic', '1 經典象牙白 · 小花封蠟'],
  ['blush', '2 粉色信封 · 緞帶蝴蝶結'],
  ['dots', '3 波點封口 · 玫瑰色蠟封'],
  ['sprig', '4 小花束 · 波點紙膠帶'],
]

function Preview() {
  return (
    <MotionConfig reducedMotion="always">
      <FlowerDefs />
      <WrapDefs />
      <main className="px-4 py-10 max-w-6xl mx-auto text-ink">
        <h2 className="text-center tracking-[0.2em] text-xl mb-8">花束</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8">
          {Object.entries(BOUQUETS).map(([k, v]) => (
            <figure key={k} className="flex flex-col items-center" data-bouquet={k}>
              <Bouquet3D design={k} interactive={false} width="100%" />
              <figcaption className="mt-2 text-sm tracking-[0.12em]">{v.name}</figcaption>
            </figure>
          ))}
        </div>
        <h2 className="text-center tracking-[0.2em] text-xl mt-16 mb-10">信封</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-14 justify-items-center">
          {ENVELOPES.map(([k, name]) => (
            <figure key={k} className="flex flex-col items-center" data-envelope={k}>
              <Envelope look={k} />
              <figcaption className="mt-8 text-sm tracking-[0.12em]">{name}</figcaption>
            </figure>
          ))}
        </div>
      </main>
    </MotionConfig>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<Preview />)
