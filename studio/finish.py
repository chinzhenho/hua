# Combines colour + mask renders into trimmed, transparent WebP sprites for the site.
import glob, os
import numpy as np
from PIL import Image
BG = np.array([251, 246, 238], dtype=np.float32)
OUT = 'src/assets/flowers'
RAMPS = {
    'pink': [[150, 92, 102], [205, 128, 140], [236, 176, 184], [248, 214, 217], [255, 238, 238]],
    'blush': [[165, 112, 118], [218, 160, 166], [243, 205, 208], [252, 230, 230], [255, 246, 244]],
    'cream': [[160, 130, 98], [212, 186, 146], [238, 220, 190], [250, 240, 222], [255, 251, 243]],
    'ivory': [[165, 145, 125], [218, 204, 186], [240, 232, 220], [251, 247, 240], [255, 255, 252]],
}
os.makedirs(OUT, exist_ok=True)
for cf in sorted(glob.glob('studio/out/*.color.png')):
    name = os.path.basename(cf).replace('.color.png', '')
    c = np.asarray(Image.open(cf).convert('RGB'), dtype=np.float32)
    a = np.asarray(Image.open(cf.replace('.color', '.mask')).convert('L'), dtype=np.float32) / 255.0
    a3 = a[..., None]
    # un-blend the cream background from the antialiased edges
    f = np.where(a3 > 0.02, (c - (1 - a3) * BG) / np.maximum(a3, 0.02), c)
    # gradient-map the shading into the flower's own palette, so shadows stay warm
    tone = name.split('-')[1]
    ramp = np.array(RAMPS.get(tone, RAMPS['pink']), dtype=np.float32)
    lum = (0.299 * f[..., 0] + 0.587 * f[..., 1] + 0.114 * f[..., 2]) / 255.0
    lo, hi = np.percentile(lum[a > 0.5], 2), np.percentile(lum[a > 0.5], 99.5)
    tt = np.clip((lum - lo) / max(hi - lo, 1e-3), 0, 1)
    pos = tt * (len(ramp) - 1)
    i0 = np.floor(pos).astype(int).clip(0, len(ramp) - 2)
    fr = (pos - i0)[..., None]
    mapped = ramp[i0] * (1 - fr) + ramp[i0 + 1] * fr
    keep = 0.35 if name.startswith('gerbera') else 0.25
    f = f * keep + mapped * (1 - keep)
    rgba = np.dstack([np.clip(f, 0, 255), a * 255]).astype(np.uint8)
    im = Image.fromarray(rgba, 'RGBA')
    im = im.crop(im.getbbox())
    s = 300 / max(im.size)
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    im.save(f'{OUT}/{name}.webp', 'WEBP', quality=82, method=6)
print(len(glob.glob(OUT + '/*.webp')), 'sprites')
