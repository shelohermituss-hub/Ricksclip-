"""finish_key.py: the Rick-recipe finish of a Blender key frame (CB_RULES section 3 THE RICK RECIPE, points 4-5). System Python, numpy + PIL.
  1 grade: tools/grade_rick.py toward one kind of Rick target (DAY / INTERIOR ...), WORLD ONLY (cast mask kept: cards get half the white balance only);
  2 thin outline: rick_outline/composite.py key_lines on the lines_key.py Workbench pass, laid UNDER the cards (1 - cast mask);
  3 numbers: tools/measure/rick_grade_study.py stats of the final next to the target -> json.
NO haze, no veil, no sun bands, no saturation boost, no vignette, no grain.
usage: python finish_key.py raw.png cast_mask.png lines_id.png out.png --kind DAY [--strength 1] [--sat-floor raw] [--alpha .70] [--json numbers.json]
  --sat-floor raw: the saturation target is never below the raw frame's own (a lamp room must not go paler than its lamps)."""
import sys, os, json, argparse
import numpy as np
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.normpath(os.path.join(HERE, '..', '..', '..'))
for p in (HERE, os.path.join(ROOT, 'tools'), os.path.join(ROOT, 'tools', 'measure'), os.path.join(ROOT, 'templates', 'blender_look', 'rick_outline')):
    if os.path.isdir(p) and p not in sys.path: sys.path.append(p)
import grade_rick as GR, composite as CO, rick_grade_study as RS


def world_sat(a, w):
    L = GR.luma(a); mx = a.max(-1); mn = a.min(-1); S = np.where(mx > 1e-4, (mx - mn) / np.maximum(mx, 1e-4), 0); Lw = np.clip(L * 2, 0, 1)
    return float((S[w] * Lw[w]).mean() / max(Lw[w].mean(), 1e-4))


def stats(rgb8):
    return RS.stats(np.asarray(Image.fromarray(rgb8).resize((360, 640), Image.BILINEAR)))


if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('raw'); ap.add_argument('mask'); ap.add_argument('lines'); ap.add_argument('out')
    ap.add_argument('--kind', default='DAY'); ap.add_argument('--strength', type=float, default=1.0); ap.add_argument('--sat-floor', default='')
    ap.add_argument('--alpha', type=float, default=.70); ap.add_argument('--json'); ap.add_argument('--targets', default=os.path.join(HERE, 'rick_targets.json'))
    A = ap.parse_args(); T = dict(json.load(open(A.targets))[A.kind])
    a = GR.load(A.raw); H, W = a.shape[:2]; mf = CO._load_mask(A.mask, W, H); m = mf > .5
    if A.sat_floor == 'raw': T['sat'] = max(T['sat'], world_sat(a, ~m))
    g = GR.grade(a, T, m if m.any() else None, A.strength)
    img, al = CO.key_composite(g * 255., A.lines, mf, A.alpha)
    out8 = img.clip(0, 255).round().astype(np.uint8); Image.fromarray(out8).save(A.out)
    raw8 = (np.clip(a, 0, 1) * 255 + .5).astype(np.uint8)
    keys = ('p1', 'p10', 'p50', 'p90', 'p99', 'mean', 'contrast', 'sat', 'shadows', 'highs')
    def pick(s): return {k: (round(s[k], 3) if isinstance(s[k], float) else s[k]) for k in keys if k in s}
    res = dict(kind=A.kind, strength=A.strength, target={k: T[k] for k in keys if k in T}, raw=pick(stats(raw8)), final=pick(stats(out8)),
               line_px=round(float((al > .05).mean()), 4), line_alpha=A.alpha)
    print('FINISH', A.out, json.dumps(res))
    if A.json: json.dump(res, open(A.json, 'w'), indent=1)
