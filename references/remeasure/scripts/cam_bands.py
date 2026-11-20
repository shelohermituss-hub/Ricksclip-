"""Camera band statistics from data/cam_raw/*.npz under three definitions, to settle motion.md 2.1
vs camera_census.md (re-measure 2026-11-05).

  A  motion.md 2.1   : path integrated, Gaussian sigma 1.2 f, speed = hypot(translation, zoom x 734),
                       px at 720-wide, per 30 fps frame
  B  translation only: same path and units, zoom term dropped
  C  census-like     : translation only, px at 1080-wide, per 15 fps step (two frames of motion)
Bands: hold < 0.3, drift 0.3-2, move >= 2 (in each definition's own units, as each report used them).
Cuts: tile peak < 0.04 or shift > 120 px, +-1 frame, excluded.
Also: moves per 10 s and move peaks (local max >= 6 px/f, def A and B), share of hold frames that
are held only because the zoom term was dropped, and the speed medians over moving frames only.
Usage: python cam_bands.py            (writes data/cam_bands.json and prints a table)
       python cam_bands.py --validate (synthetic ground truth, writes data/cam_validate.json)
"""
import sys, os, glob, json, numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "..", "..", "tools", "measure"))
from cam_track import gauss_smooth, CORNER_720

RAW = os.path.join(HERE, "..", "data", "cam_raw")


def series(tx, ty, zoom, peak):
    cut = (peak < 0.04) | (np.hypot(tx, ty) > 120)
    cutm = cut | np.roll(cut, 1) | np.roll(cut, -1)
    tx = np.where(cut, 0, tx); ty = np.where(cut, 0, ty); zoom = np.where(cut, 0, zoom)
    sx, sy, sz = (gauss_smooth(np.cumsum(v)) for v in (tx * 2, ty * 2, zoom))
    vx, vy, vz = (np.diff(s, prepend=s[0]) for s in (sx, sy, sz))
    A = np.hypot(np.hypot(vx, vy), vz * CORNER_720)
    B = np.hypot(vx, vy)
    C = (B[0::2][: len(B) // 2] + B[1::2][: len(B) // 2]) * 1.5   # 15 fps step, 1080 px
    okC = ~(cutm[0::2][: len(B) // 2] | cutm[1::2][: len(B) // 2])
    return A, B, C, ~cutm, okC, vz


def bands(sp):
    return {"hold": round(100 * float((sp < 0.3).mean()), 1),
            "drift": round(100 * float(((sp >= 0.3) & (sp < 2)).mean()), 1),
            "move": round(100 * float((sp >= 2).mean()), 1),
            "median": round(float(np.median(sp)), 2), "p90": round(float(np.percentile(sp, 90)), 2),
            "median_moving_only": round(float(np.median(sp[sp >= 0.3])), 2) if (sp >= 0.3).any() else None,
            "p90_moving_only": round(float(np.percentile(sp[sp >= 0.3], 90)), 2) if (sp >= 0.3).any() else None}


def peaks(speed, ok, fps=30):
    n = len(speed); pk = []
    for i in range(4, n - 4):
        if ok[i] and speed[i] >= 6 and speed[i] == speed[i - 4:i + 5].max():
            if pk and i - pk[-1][0] < 8:
                if speed[i] > pk[-1][1]: pk[-1] = (i, speed[i])
                continue
            pk.append((i, speed[i]))
    dur10 = ok.sum() / fps / 10
    return {"moves_per_10s": round(len(pk) / dur10, 2),
            "peak_median": round(float(np.median([p[1] for p in pk])), 1) if pk else None}


def run():
    out = {}
    for f in sorted(glob.glob(os.path.join(RAW, "*.npz"))):
        d = np.load(f)
        A, B, C, ok, okC, vz = series(d["tx"], d["ty"], d["zoom"], d["peak"])
        a, b = A[ok], B[ok]
        name = os.path.basename(f)[:-4]
        out[name] = {"frames": int(len(A)), "A": {**bands(a), **peaks(A, ok)}, "B": {**bands(b), **peaks(B, ok)},
                     "C": bands(C[okC]),
                     "held_only_without_zoom_pct": round(100 * float(((b < 0.3) & (a >= 0.3)).mean()), 1),
                     "zoom_active_pct": round(100 * float((np.abs(vz[ok]) * 100 >= 0.05).mean()), 1)}
    keys = ["hold", "drift", "move", "median", "p90", "median_moving_only", "p90_moving_only"]
    summ = {}
    for D in "ABC":
        summ[D] = {k: round(float(np.median([v[D][k] for v in out.values() if v[D][k] is not None])), 2) for k in keys}
        summ[D]["range_hold"] = [min(v[D]["hold"] for v in out.values()), max(v[D]["hold"] for v in out.values())]
        summ[D]["range_move"] = [min(v[D]["move"] for v in out.values()), max(v[D]["move"] for v in out.values())]
    for D in "AB":
        summ[D]["moves_per_10s"] = round(float(np.median([v[D]["moves_per_10s"] for v in out.values()])), 2)
        summ[D]["peak_median"] = round(float(np.median([v[D]["peak_median"] for v in out.values() if v[D]["peak_median"]])), 1)
    summ["held_only_without_zoom_pct"] = round(float(np.median([v["held_only_without_zoom_pct"] for v in out.values()])), 1)
    summ["zoom_active_pct"] = round(float(np.median([v["zoom_active_pct"] for v in out.values()])), 1)
    json.dump({"per_video": out, "median_over_videos": summ}, open(os.path.join(HERE, "..", "data", "cam_bands.json"), "w"), indent=1)
    print(json.dumps(summ, indent=1))


def validate():
    """Synthetic ground truth through the SAME fit + band code."""
    from PIL import Image
    from scipy import ndimage
    from cam_track import tiles, phasecorr, fit_similarity, W, H
    src = sorted(glob.glob(os.path.join(HERE, "..", "..", "frames", "Why the Second*", "frame_010.png")))[0]
    base = np.asarray(Image.open(src).convert("L").resize((W * 2, H * 2)), np.float32) / 255
    rng = np.random.default_rng(1)

    def render(k, dx=0.0, zoom=1.0, sprite=False):
        z = zoom ** k
        c = np.array([H, W], float)                      # centre of the 2x canvas
        M = np.eye(2) / z
        off = c - M @ c + np.array([0, -dx * k * 2])     # pan dx px/f at 360-wide
        img = ndimage.affine_transform(base, M, offset=off, order=3, mode="nearest")
        img = img.reshape(H, 2, W, 2).mean((1, 3))
        if sprite:                                     # a character moving inside one tile
            y, x = 60 + int(8 * np.sin(k / 3)), 40 + (k * 3) % 60
            img[y:y + 40, x:x + 25] = 0.1
        return np.clip(img + rng.normal(0, 0.004, img.shape), 0, 1)

    cases = {"static": {}, "static + moving character": {"sprite": True},
             "pan 0.5 px/f (= 1.0 @720)": {"dx": 0.5}, "pan 2 px/f (= 4 @720)": {"dx": 2.0},
             "push-in 0.14 %/f (motion.md quiet median)": {"zoom": 1.0014},
             "push-in 0.05 %/f (activity floor)": {"zoom": 1.0005}}
    res = {}
    for name, kw in cases.items():
        rows, prev = [], None
        for k in range(90):
            img = render(k, **kw)
            if prev is not None:
                ta, ca = tiles(prev); tb, _ = tiles(img)
                d, pks = [], []
                for A_, B_ in zip(ta, tb):
                    dx, dy, pk = phasecorr(A_, B_); d.append((dx, dy)); pks.append(pk)
                tx, ty, a, b, r = fit_similarity(np.array(d), ca)
                rows.append((tx, ty, a, float(np.median(pks))))
            prev = img
        r = np.array(rows)
        A, B, C, ok, okC, vz = series(r[:, 0], r[:, 1], r[:, 2], r[:, 3])
        sl = slice(6, -6)
        res[name] = {"A_median_px_f": round(float(np.median(A[sl])), 3), "B_median_px_f": round(float(np.median(B[sl])), 3),
                     "C_median": round(float(np.median(C[3:-3])), 3),
                     "zoom_measured_pct_f": round(float(np.median(r[:, 2])) * 100, 4),
                     "A_band": "hold" if np.median(A[sl]) < 0.3 else ("drift" if np.median(A[sl]) < 2 else "move"),
                     "B_band": "hold" if np.median(B[sl]) < 0.3 else ("drift" if np.median(B[sl]) < 2 else "move")}
        print(name, res[name], flush=True)
    json.dump(res, open(os.path.join(HERE, "..", "data", "cam_validate.json"), "w"), indent=1)


if __name__ == "__main__":
    validate() if "--validate" in sys.argv else run()
