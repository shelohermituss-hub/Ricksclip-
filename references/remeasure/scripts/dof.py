"""Depth-of-field re-measure over references/frames/ (re-measure 2026-11-05; depth.md section 1).

Same edge-spread method as tools/measure/blur_fit.py (a + b*Phi((t-t0)/sigma) on 25-px profiles
across strong edges, kept when relative RMS <= 0.07, sigmas in 720p px, per 40 px tile the 30th
percentile), vectorised so every frame can be measured. Per frame:
  sharp baseline (p10 of all edge sigmas), tile30 median, share of tiles > 1.2,
  "above-head" median = tiles above the topmost detected head (data/heads.json) when one exists,
  "upper band" median = tiles in rows 3-35 % of height (background proxy for frames with no head).
DOF "on" for a frame = above-head (else upper-band) median > 1.2 (depth.md 1.2 threshold).
The hand shot-type labels (CU/MS/FS/WS) are lost and are NOT re-created here.
Writes data/dof.json. Usage: python dof.py [--every N] [--validate]
"""
import sys, os, glob, json, numpy as np
from math import erf
from multiprocessing import Pool
from PIL import Image
from scipy import ndimage

HERE = os.path.dirname(os.path.abspath(__file__))
FR = os.path.join(HERE, "..", "..", "frames")
CAP = (0.635, 0.755)
SIG = np.exp(np.linspace(np.log(0.25), np.log(16), 28))
HALF = 12
t = np.arange(-HALF, HALF + 1, 1.0)
TPL = np.array([[0.5 * (1 + erf(x / (s * np.sqrt(2)))) for x in t] for s in SIG])   # (28, 25)


def fit_many(P):
    """P (n, 25) -> sigma (n,) or nan, closed-form LS of a + b*T for every template."""
    rng = P.max(1) - P.min(1)
    Tm = TPL.mean(1); Tc = TPL - Tm[:, None]                       # (28,25)
    Pm = P.mean(1); Pc = P - Pm[:, None]                           # (n,25)
    b = (Pc @ Tc.T) / (Tc ** 2).sum(1)[None, :]                   # (n,28)
    # residual^2 = |Pc|^2 - b^2 |Tc|^2
    r2 = (Pc ** 2).sum(1)[:, None] - b ** 2 * (Tc ** 2).sum(1)[None, :]
    rel = np.sqrt(np.clip(r2, 0, None) / P.shape[1]) / (rng[:, None] + 1e-9)
    k = rel.argmin(1); best = rel[np.arange(len(P)), k]
    s = SIG[k].copy(); s[(best > 0.07) | (rng < 0.08) | (b[np.arange(len(P)), k] <= 0)] = np.nan
    return s


SCALES = (1,)   # multi-scale (1,2,4) was tried and FAILED validation: coarse scales read smooth shading
                # ramps as blurred edges (a sharp frame read sigma 4.67). Single scale is validated but
                # under-samples soft backgrounds (few edges pass the gradient threshold), so DOF share is a LOWER bound.


def measure(Y, keep_rows):
    """Multi-scale (1, 2, 4) like depth.md 1.1, so soft backgrounds still yield edges; sigmas x scale."""
    out = [[], [], []]
    for sc in SCALES:
        Ys = Y if sc == 1 else Y[: Y.shape[0] // sc * sc, : Y.shape[1] // sc * sc].reshape(Y.shape[0] // sc, sc, Y.shape[1] // sc, sc).mean((1, 3))
        kr = keep_rows[: Ys.shape[0] * sc : sc]
        ys, xs, s = measure1(Ys, kr)
        keepb = (s >= 0) if sc == 1 else (s >= 1.5)   # coarse scales only add edges genuinely soft at that scale (above the downsample floor)
        out[0].append(ys[keepb] * sc); out[1].append(xs[keepb] * sc); out[2].append(s[keepb] * sc)
    return tuple(np.concatenate(o) for o in out)


def measure1(Y, keep_rows):
    H, W = Y.shape
    gx = ndimage.sobel(Y, 1); gy = ndimage.sobel(Y, 0); g = np.hypot(gx, gy)
    thr = max(0.25, np.percentile(g, 98))
    m = (g > thr) & keep_rows[:, None]
    m[:HALF] = m[-HALF:] = False; m[:, :HALF] = m[:, -HALF:] = False
    ys, xs = np.where(m)
    if len(ys) > 6000:
        idx = np.random.default_rng(0).choice(len(ys), 6000, replace=False); ys, xs = ys[idx], xs[idx]
    ang = np.arctan2(gy[ys, xs], gx[ys, xs])
    xi = np.clip((xs[:, None] + np.cos(ang)[:, None] * t[None]).astype(int), 0, W - 1)
    yi = np.clip((ys[:, None] + np.sin(ang)[:, None] * t[None]).astype(int), 0, H - 1)
    P = Y[yi, xi]
    flip = P[:, -1] < P[:, 0]; P[flip] = P[flip, ::-1]
    s = fit_many(P)
    ok = ~np.isnan(s)
    return ys[ok], xs[ok], s[ok]


def tiles30(ys, xs, s, sel=None):
    d = {}
    for y, x, v in zip(ys, xs, s):
        if sel is not None and not sel(y, x): continue
        d.setdefault((y // 40, x // 40), []).append(v)
    return np.array([np.percentile(v, 30) for v in d.values() if len(v) >= 3])


HEADS = {}


def one(p):
    im = Image.open(p).convert("L")
    if im.width != 720: im = im.resize((720, 1280), Image.LANCZOS)
    Y = np.asarray(im, np.float32) / 255
    keep = np.ones(1280, bool); keep[int(CAP[0] * 1280):int(CAP[1] * 1280)] = False
    ys, xs, s = measure(Y, keep)
    if len(s) < 30: return {"f": p, "edges": int(len(s))}
    key = os.path.basename(os.path.dirname(p)) + "/" + os.path.basename(p)
    t_all = tiles30(ys, xs, s)
    up = tiles30(ys, xs, s, lambda y, x: 0.03 * 1280 <= y <= 0.35 * 1280)
    head_top = HEADS.get(key)
    ah = tiles30(ys, xs, s, lambda y, x: y < head_top) if head_top else np.array([])
    bg = ah if len(ah) >= 3 else up
    return {"ep": os.path.basename(os.path.dirname(p)), "f": os.path.basename(p), "edges": int(len(s)),
            "sharp_p10": round(float(np.percentile(s, 10)), 3),
            "tile30_median": round(float(np.median(t_all)), 3) if len(t_all) else None,
            "tiles_blurred_pct": round(100 * float((t_all > 1.2).mean()), 1) if len(t_all) else None,
            "above_head_median": round(float(np.median(ah)), 3) if len(ah) >= 3 else None,
            "upper_band_median": round(float(np.median(up)), 3) if len(up) >= 3 else None,
            "bg_used": "above_head" if len(ah) >= 3 else "upper_band",
            "dof_on": bool(len(bg) >= 3 and np.median(bg) > 1.2)}


def init(h):
    HEADS.update(h)


def validate():
    p = sorted(glob.glob(os.path.join(FR, "Why the Second*", "frame_010.png")))[0]
    im = Image.open(p).convert("L").resize((720, 1280), Image.LANCZOS)
    Y0 = np.asarray(im, np.float32) / 255
    keep = np.ones(1280, bool)
    out = {}
    base = np.median(measure(Y0, keep)[2])
    for sg in (0, 1.5, 3.0, 6.0):
        Y = ndimage.gaussian_filter(Y0, sg) if sg else Y0
        ys, xs, s = measure(Y, keep)
        out[str(sg)] = {"median_edge_sigma": round(float(np.median(s)), 2),
                        "expected_sqrt(base^2+true^2)": round(float(np.hypot(base, sg)), 2)}
        print(sg, out[str(sg)])
    for sg in (2.0, 4.0):
        Y = Y0.copy(); Y[:450] = ndimage.gaussian_filter(Y0, sg)[:450]
        ys, xs, s = measure(Y, keep)
        up = tiles30(ys, xs, s, lambda y, x: 0.03 * 1280 <= y <= 0.35 * 1280)
        lo = tiles30(ys, xs, s, lambda y, x: y > 500)
        out["top blurred " + str(sg)] = {"upper_band_median": round(float(np.median(up)), 2), "sharp_part_median": round(float(np.median(lo)), 2)}
        print("top blurred", sg, out["top blurred " + str(sg)])
    json.dump(out, open(os.path.join(HERE, "..", "data", "dof_validate.json"), "w"), indent=1)


if __name__ == "__main__":
    if "--validate" in sys.argv: validate(); sys.exit()
    every = int(sys.argv[sys.argv.index("--every") + 1]) if "--every" in sys.argv else 1
    hp = os.path.join(HERE, "..", "data", "heads_clean.json")
    h = {}
    if os.path.exists(hp):
        for d in json.load(open(hp)):
            k = d["ep"] + "/" + d["f"]; h[k] = min(h.get(k, 9999), d["box"][1])
    files = sorted(glob.glob(os.path.join(FR, "*", "frame_*.png")))[::every]
    with Pool(5, initializer=init, initargs=(h,)) as pool:
        res = pool.map(one, files, chunksize=6)
    json.dump(res, open(os.path.join(HERE, "..", "data", "dof.json"), "w"))
    print(len(res), "frames")
