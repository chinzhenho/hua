"""
Builds tiny local font files that contain only the characters used on the site.

Run after changing any Chinese text:
    pip install fonttools brotli
    python scripts/subset_fonts.py
(needs `npm install` first, it reads the full fonts from node_modules/@fontsource)
"""
import glob, os, re, shutil, io
from fontTools.ttLib import TTFont
from fontTools import subset
from fontTools.merge import Merger

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'src', 'fonts')
FS = os.path.join(ROOT, 'node_modules', '@fontsource')
os.makedirs(OUT, exist_ok=True)

text = ''
for f in glob.glob(os.path.join(ROOT, 'src', '**', '*.js*'), recursive=True):
    text += open(f, encoding='utf-8').read()
cjk = sorted({c for c in text if ord(c) > 0x2000})
cjk += list('，。、！？：；“”‘’…—·')
ascii_ = [chr(i) for i in range(0x20, 0x7f)]
chars = sorted(set(cjk + ascii_))
print(len(chars), 'characters')


def build(family_dir, prefix, weight, out_name, wanted):
    files = sorted(glob.glob(os.path.join(FS, family_dir, 'files', f'{prefix}-*-{weight}-normal.woff2')))
    parts = []
    remaining = {ord(c) for c in wanted}
    for f in files:
        font = TTFont(f)
        cmap = set(font.getBestCmap().keys())
        hit = remaining & cmap
        if not hit:
            continue
        remaining -= hit
        opts = subset.Options()
        opts.flavor = None
        opts.layout_features = ['*']
        opts.name_IDs = ['*']
        opts.notdef_outline = True
        s = subset.Subsetter(opts)
        s.populate(unicodes=hit)
        s.subset(font)
        tmp = os.path.join('/tmp' if os.name != 'nt' else os.environ.get('TEMP', '.'), f'_part_{len(parts)}.ttf')
        font.flavor = None
        font.save(tmp)
        parts.append(tmp)
    if not parts:
        return
    if len(parts) == 1:
        merged = TTFont(parts[0])
    else:
        merged = Merger().merge(parts)
    merged.flavor = 'woff2'
    merged.save(os.path.join(OUT, out_name))
    for p in parts:
        os.remove(p)
    print(out_name, os.path.getsize(os.path.join(OUT, out_name)) // 1024, 'KB', '(missing:', len(remaining), ')')


build('noto-serif-sc', 'noto-serif-sc', 400, 'hua-serif-400.woff2', chars)
build('noto-serif-sc', 'noto-serif-sc', 600, 'hua-serif-600.woff2', chars)
build('ma-shan-zheng', 'ma-shan-zheng', 400, 'hua-brush.woff2', list('我爱你。'))

for src, dst in [
    ('great-vibes/files/great-vibes-latin-400-normal.woff2', 'great-vibes.woff2'),
    ('cormorant-garamond/files/cormorant-garamond-latin-400-italic.woff2', 'cormorant-400-italic.woff2'),
    ('cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff2', 'cormorant-500.woff2'),
]:
    shutil.copy(os.path.join(FS, src), os.path.join(OUT, dst))
print('done')
