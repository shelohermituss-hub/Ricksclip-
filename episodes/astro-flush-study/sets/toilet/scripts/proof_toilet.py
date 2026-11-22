"""proof_toilet.py: side-by-sides (ours | reference) + the numbers table. python3 proof_toilet.py [f5 ...]
The side-by-sides hold reference frames, so they go to references/look_match/astro_flush/work/proof/toilet/ (git-ignored), never elsewhere."""
import sys, os, json, numpy as np
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..', '..'))
REF = os.path.join(ROOT, 'references', 'look_match', 'astro_flush'); OUT = os.path.join(REF, 'work', 'proof', 'toilet'); os.makedirs(OUT, exist_ok=True)
P = json.load(open(os.path.join(HERE, '..', 'params_toilet.json'))); keys = sys.argv[1:] or list(P['proofs'])
def stats(im):
    a = np.asarray(im.convert('RGB')).astype(float) / 255; L = a @ [.2126, .7152, .0722]; mx, mn = a.max(2), a.min(2); s = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
    return L.mean(), np.percentile(L, 1), np.percentile(L, 99), s.mean()
rows = []
for k in keys:
    f = os.path.join(HERE, '..', 'out', 'stills', 'toilet_%s.png' % k)
    if not os.path.exists(f): continue
    a = Image.open(f).convert('RGB'); b = Image.open(os.path.join(REF, 'ref', 'all', 'f_%04d.jpg' % (int(k[1:]) + 1))).convert('RGB').resize(a.size)
    s = Image.new('RGB', (a.width * 2 + 8, a.height), (255, 0, 255)); s.paste(a, (0, 0)); s.paste(b, (a.width + 8, 0)); s.save(os.path.join(OUT, 'sbs_%s.jpg' % k), quality=90)
    sa, sb = stats(a), stats(b); rows.append('| %s | %.3f / %.3f | %.3f / %.3f | %.3f / %.3f | %.3f / %.3f |' % (k, sa[0], sb[0], sa[1], sb[1], sa[2], sb[2], sa[3], sb[3]))
print('| frame | mean L ours / his | p1 | p99 | mean sat |\n|---|---|---|---|---|'); print('\n'.join(rows))
