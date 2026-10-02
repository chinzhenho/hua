# 花 · 一封藏在花束里的信（3D）

花 → 小熊 → 信封 → 情书 → 故事 → 未来 → 花 → 我爱你

## How the 3D bouquet works

`Bouquet3D` stacks real depth layers in CSS 3D (no WebGL, so it stays light on phones):
shadow → white back sheets → pink polka-dot paper → back blooms → your bear (photo) → middle blooms → front blooms → pink front folds → white front folds → ribbon.
The whole scene tilts slowly on its own, and follows the cursor (desktop) or a finger drag (phone), so the layers slide past each other.
When tapped, the flower layers, the plush and the paper each react on their own timing.
"Reduce motion" in the phone's settings turns off the tilt, sway and falling petals.

## Run it

```bash
npm install
npm run dev        # open the "Network" address on your phone (same Wi-Fi)
```

## Send it to her

- `share/index.html` is the whole site in **one file** (fonts and all). It works offline, and you can upload it to any static host.
- To get a link: run `npm run build`, then drag the `dist` folder onto https://app.netlify.com/drop (or use Vercel / GitHub Pages).

## Music

The ♪ button (top right) plays a soft piano piece generated in the browser. Music only starts when she taps it.
To use your own song instead, put it at `public/music.mp3` and rebuild (the single-file version always uses the built-in piano).

## Editing

- All letter text lives in `src/content.js` (copied exactly from your letter).
- Fonts are trimmed down to only the characters used on the page. If you change any Chinese text, run
  `pip install fonttools brotli`, then `npm run fonts`, so the new characters get added.
- Components: `BouquetScene`, `Bouquet3D`, `Flowers`, `BouquetWrapping`, `Envelope`, `LoveLetter`, `StorySection`, `ChapterSection`, `FinalBouquet`, `FallingPetals`, `MusicToggle`.

## Timing

- The story section (遇见你 / 喜欢你 / 爱你) plays as one short film, about 25 seconds, and holds the page still while it plays.
- The final scene plays for about 30 seconds and ends on 我爱你。 Tap ↺ to watch it again from the beginning.

## The bear

The bear in the bouquet is your own photo, cut out from its background: `src/assets/bear.webp`.
To use a different photo, replace that file with a transparent PNG or WebP of the same name, then rebuild.

## The flowers

Each flower is built from real 3D petals (three.js), lit softly with ambient occlusion, and rendered to a small transparent image in `src/assets/flowers/`. The website only loads those images, so it stays light on phones.
To change or re-render the flowers: edit `studio/flowers3d.js`, start `npm run dev`, then run `npm run flowers` in a second terminal (needs Python with numpy and Pillow).

## Choosing designs

`src/design.js` picks the bouquet (A–D) and the envelope (classic / blush / dots / sprig). Open `/preview.html` on the dev server to see all of them side by side.

## Background song

`src/assets/music.mp3` (方大同《My Only Girl》) starts on its own: right away where the browser allows it, otherwise on her first tap (the bouquet's 轻轻点一下). The ♪ button pauses and resumes it. To swap the song, replace that file and rebuild.
