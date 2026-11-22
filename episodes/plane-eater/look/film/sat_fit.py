"""sat_fit.py (system python): after finish_key, bring the WORLD's saturation and mean to the Rick target of the frame's kind without touching
the sky's blue or the cards (lead 2026-11-22: day keys sat .36-.40, mean ~.48, sky not blown).  fit(final, mask, kind, targets) rewrites final.
Saturation: HSV S scaled on non-cast, non-sky pixels by k (1-1.8) until the frame's sat (rick_grade_study stats) reaches the target;
mean: a gamma on V (0.8-1.25) on the same pixels. Sky = blue hue, high V, upper part of the frame."""
import json, os, sys
import numpy as np
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path[:0] = [HERE, os.path.join(HERE, '..', '..', '..', '..', 'tools', 'measure')]
import rick_grade_study as RS

def stats(a8): return RS.stats(np.asarray(Image.fromarray(a8).resize((360, 640), Image.BILINEAR)))

def fit(final, mask, kind, targets, kmax=None):
    kmax = kmax or float(os.environ.get('SAT_KMAX', 2.4))
    T = json.load(open(targets))[kind]; im = Image.open(final).convert('RGB'); a = np.asarray(im).astype(np.float32) / 255; H, W = a.shape[:2]
    m = np.asarray(Image.open(mask).convert('L').resize((W, H), Image.BILINEAR), dtype=np.float32) / 255 if os.path.exists(mask) else np.zeros((H, W))
    hsv = np.asarray(im.convert('HSV')).astype(np.float32) / 255; h, s, v = hsv[..., 0], hsv[..., 1], hsv[..., 2]
    yy = np.linspace(0, 1, H)[:, None] * np.ones((1, W)); sky = (h > .53) & (h < .67) & (v > .55) & (yy < .6)
    neutral = np.clip((s - .08) / .14, 0, 1); neutral = neutral * neutral * (3 - 2 * neutral)   # whites and greys stay neutral (the white plane, concrete)
    wsel = (1 - m) * (~sky); wsat = wsel * neutral
    def make(k, g):
        s2 = np.clip(s * (1 + (k - 1) * wsat), 0, 1); v2 = v ** (1 + (g - 1) * wsel)
        out = Image.fromarray((np.stack([h, s2, np.clip(v2, 0, 1)], -1) * 255).astype(np.uint8), 'HSV').convert('RGB'); return np.asarray(out)
    best = (1, 1); st = stats((a * 255).astype(np.uint8)); res = {'before': {k: st[k] for k in ('mean', 'sat')}}
    for _ in range(2):
        lo, hi = 1.0, kmax
        for _ in range(7):
            k = (lo + hi) / 2; sv = stats(make(k, best[1]))['sat']
            if sv < T['sat']: lo = k
            else: hi = k
        best = ((lo + hi) / 2, best[1]); lo, hi = .7, 1.3
        for _ in range(7):
            g = (lo + hi) / 2; mv = stats(make(best[0], g))['mean']
            if mv > T['mean']: lo = g
            else: hi = g
        best = (best[0], (lo + hi) / 2)
    o = make(*best); Image.fromarray(o).save(final); st = stats(o); res.update(k=round(best[0], 3), gamma=round(best[1], 3), after={k: st[k] for k in ('mean', 'sat')}); return res

if __name__ == '__main__':
    print(json.dumps(fit(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], float(sys.argv[5]) if len(sys.argv) > 5 else None), default=float))
