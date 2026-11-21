"""Grade a frame toward Rick's measured look for one kind of scene (DAY, DUSK, NIGHT, INTERIOR).
Targets: references/reports/rick_grade_2026-11-21/rick_grade.json (tools/measure/rick_grade_study.py, 5 of his films, 320 frames).
What it does, in this order (CB 2026-11-21: "le color grading n'est pas du tout dans le sens que je veux"):
  1 white balance: the brightest 10 % of the world goes to Rick's highlight colour for that kind (day/interior = near neutral white);
  2 tone: the world's luma percentiles p1 / p10 / p50 / p90 / p99 are moved onto Rick's (deeper blacks, more contrast, no haze lift);
  3 split tone: the shadows' tint moves to Rick's shadow tint (day = cool blue-teal), highlights to his highlight tint;
  4 saturation scaled to Rick's mean for the kind;
  the cast (mask white = cast) gets only step 1 at half strength: the cards stay clean, faces white. No vignette, no grain, no haze.
python tools/grade_rick.py in.png out.png --kind DAY [--mask cast_mask.png] [--strength 1.0] [--targets json]
"""
import argparse, json, os
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEF = os.path.join(ROOT, "references", "reports", "rick_grade_2026-11-21", "rick_grade.json")
LW = np.array([.2126, .7152, .0722], np.float32)

def load(p):
    im = Image.open(p)
    a = np.asarray(im).astype(np.float32)
    a = a / (65535.0 if a.max() > 255 else 255.0)
    return a[..., :3]

def luma(a): return a @ LW

def grade(a, T, mask=None, strength=1.0):
    w = np.ones(a.shape[:2], bool) if mask is None else ~mask
    out = a.copy()
    # 1 white balance on the world's brightest 10 %
    L = luma(a); hi = w & (L >= np.percentile(L[w], 90))
    cur = a[hi].mean(0); tgt = np.array(T["highs"], np.float32)
    gain = (tgt / tgt.mean()) / (cur / cur.mean())
    gain = 1 + (gain - 1) * strength
    out = out * gain
    # 2 tone: piecewise-linear luma map from our percentiles to Rick's
    L = luma(out); src = np.percentile(L[w], [1, 10, 50, 90, 99]); dst = np.array([T["p1"], T["p10"], T["p50"], T["p90"], T["p99"]])
    src = np.concatenate([[0], src, [max(1.0, src[-1] + 1e-3)]]); dst = np.concatenate([[0], dst, [1.0]])
    src = np.maximum.accumulate(src + np.arange(len(src)) * 1e-5)
    Ln = np.interp(L, src, dst); Ln = L + (Ln - L) * strength
    out = out * (Ln / np.maximum(L, 1e-4))[..., None]
    # 3 split tone: shadows and highlights chroma toward Rick's
    L = luma(out)
    def chroma(c): c = np.array(c, np.float32); return c - c.mean()
    sh = np.clip(1 - L / .3, 0, 1)[..., None]; hl = np.clip((L - .65) / .3, 0, 1)[..., None]
    for band, wgt in ((T["shadows"], sh), (T["highs"], hl)):
        m = w & (wgt[..., 0] > .5)
        if m.sum() < 50: continue
        cur = out[m].mean(0); shift = (chroma(band) - (cur - cur.mean())) * .5 * strength
        out = out + wgt * shift
    # 4 saturation toward Rick's mean
    L = luma(out)[..., None]; mx = out.max(-1); mn = out.min(-1)
    S = np.where(mx > 1e-4, (mx - mn) / np.maximum(mx, 1e-4), 0); Lw = np.clip(L[..., 0] * 2, 0, 1)
    cur_s = float((S[w] * Lw[w]).mean() / max(Lw[w].mean(), 1e-4)); k = 1 + (T["sat"] / max(cur_s, 1e-3) - 1) * strength
    out = L + (out - L) * k
    out = np.clip(out, 0, 1)
    if mask is not None:   # the cast: original card with only a gentle white balance
        cast = np.clip(a * (1 + (gain - 1) * .5), 0, 1)
        out = np.where(mask[..., None], cast, out)
    return out

if __name__ == "__main__":
    ap = argparse.ArgumentParser(); ap.add_argument("inp"); ap.add_argument("out"); ap.add_argument("--kind", default="DAY")
    ap.add_argument("--mask"); ap.add_argument("--strength", type=float, default=1.0); ap.add_argument("--targets", default=DEF)
    A = ap.parse_args(); T = json.load(open(A.targets))[A.kind]
    a = load(A.inp); m = None
    if A.mask:
        m = np.asarray(Image.open(A.mask).convert("L").resize((a.shape[1], a.shape[0]))) > 127
    o = grade(a, T, m, A.strength)
    Image.fromarray((o * 255 + .5).astype(np.uint8)).save(A.out); print("wrote", A.out, A.kind)
