// Renders every flower sprite used by the bouquet. Needs the dev server running (npm run dev).
import { chromium } from 'playwright'
import fs from 'fs'
const only = process.argv[2]
const LIST = [
  ['rose', ['pink', 'blush', 'cream', 'ivory']],
  ['ranunculus', ['cream', 'ivory', 'blush']],
  ['spray', ['pink', 'blush']],
  ['gerbera', ['blush', 'pink', 'ivory']],
  ['dahlia', ['blush', 'pink']],
  ['carnation', ['blush', 'pink', 'ivory', 'cream']],
  ['orchid', ['ivory']],
]
const port = process.env.PORT || 5174
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
const p = await b.newPage()
p.on('pageerror', (e) => console.log('ERR', e.message))
p.on('console', (m) => m.type() === 'error' && console.log('console', m.text()))
await p.goto(`http://localhost:${port}/studio/index.html`)
await p.waitForFunction(() => window.ready)
fs.mkdirSync('studio/out', { recursive: true })
for (const [type, tones] of LIST) {
  if (only && only !== type) continue
  for (const tone of tones)
    for (const view of ['front', 'side']) {
      const seed = type.length * 7 + tone.length * 3 + (view === 'side' ? 11 : 0)
      const [color, mask] = await p.evaluate(([t, c, v, s]) => window.renderFlower(t, c, v, s), [type, tone, view, seed])
      fs.writeFileSync(`studio/out/${type}-${tone}-${view}.color.png`, Buffer.from(color.split(',')[1], 'base64'))
      fs.writeFileSync(`studio/out/${type}-${tone}-${view}.mask.png`, Buffer.from(mask.split(',')[1], 'base64'))
      console.log(type, tone, view)
    }
}
await b.close()
