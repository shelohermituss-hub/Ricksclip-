"""blend.py: composes frames/ 519-638 from the passes (passes.json: name -> frame range, in film order) with an eased DISSOLVE ON THE MOVE over each
overlap: A1 -> A2 (556-565), A2 -> B1 (568-577), B1 -> B2 (606-615), B2 -> C (628-637). Every pass keeps moving, so each reads as a fly-through, not a cut."""
import os, json, shutil
from PIL import Image
H = os.path.dirname(os.path.abspath(__file__)); R = json.load(open(os.path.join(H, 'passes.json')))
P = lambda k, f: os.path.join(H, 'passes', k, 'f_%05d.png' % f); O = lambda f: os.path.join(H, 'frames', 'f_%05d.png' % f)
ease = lambda u: u * u * (3 - 2 * u); rng = {k: tuple(map(int, v.split('-'))) for k, v in R.items()}; order = list(R)
for f in range(519, 639):
    cur = [k for k in order if rng[k][0] <= f <= rng[k][1]]
    if len(cur) == 1: shutil.copy(P(cur[0], f), O(f)); continue
    a, b = cur[0], cur[1]; s0, s1 = rng[b][0], rng[a][1]
    Image.blend(Image.open(P(a, f)).convert('RGB'), Image.open(P(b, f)).convert('RGB'), ease((f - s0 + 1) / (s1 - s0 + 2))).save(O(f))
print('blend: frames 519-638 composed from', order)
