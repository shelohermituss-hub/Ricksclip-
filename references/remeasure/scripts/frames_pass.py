"""Per-frame stills pass over references/frames/ (all 21 episode folders), re-measure 2026-11-05.

For every frame_*.png, at 540x960 (the grade.md grid), caption band masked:
  - grade metrics: tools/measure/grade_metrics.frame_metrics (grade.md section 1 method)
  - edge-ink coverage: tools/measure/ink_scan.frame_mode (outlines.md section 2.3 method)
  - zone Lab means (shadow/mid/highlight), hue histogram per zone
  - sky: mask = smooth (|grad Y| < 0.01/px), bright (Y > 0.35) region connected to the top edge;
    upper = median colour of the top 15 % of visible sky rows, low = band just above the skyline;
    ratio = Y(low)/Y(upper)  (depth.md section 2.1 method)
  - automatic light label (replaces grade.md's lost hand labels, rules in label()):
      X flat/graphic; from sky colour when >= 4 % sky is visible: N dark sky, G warm sky, D blue sky; else O
Writes data/frames_pass.json (list of per-frame dicts).
"""
import sys, os, glob, json, numpy as np
from multiprocessing import Pool
HERE = os.path.dirname(os.path.abspath(__file__))
TOOLS = os.path.join(HERE, "..", "..", "..", "tools", "measure")
sys.path.insert(0, TOOLS)
from PIL import Image
from scipy import ndimage
from vidio import caption_mask, luma
from grade_metrics import frame_metrics, srgb_to_lab
from ink_scan import frame_mode

FR = os.path.join(HERE, "..", "..", "frames")


def load(p):
    im = Image.open(p).convert("RGB").resize((540, 960), Image.LANCZOS)
    return np.asarray(im, np.float32) / 255


def hue_hist(rgb, sel):
    mx = rgb.max(-1); mn = rgb.min(-1); s = np.where(mx > 0, (mx - mn) / (mx + 1e-9), 0)
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    d = mx - mn + 1e-9
    h = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
    bins = (((h + 15) % 360) // 30).astype(int)
    w = s * sel
    hist = np.bincount(bins[sel].ravel(), weights=w[sel].ravel(), minlength=12)
    return (hist / (hist.sum() + 1e-9)).round(3).tolist()


def sky(rgb):
    Y = luma(rgb)
    gy, gx = np.gradient(Y)
    smooth = (np.hypot(gx, gy) < 0.01) & (Y > 0.35)
    smooth = ndimage.binary_opening(smooth, iterations=1)
    lab, n = ndimage.label(smooth)
    top = set(np.unique(lab[0])) - {0}
    if not top: return None
    m = np.isin(lab, list(top))
    frac = float(m.mean())
    if frac < 0.04: return {"frac": round(frac, 3)}
    cols = np.where(m.any(0))[0]
    low_row = np.array([np.where(m[:, c])[0].max() for c in cols])
    skyline = int(np.median(low_row))
    rows = np.where(m.any(1))[0]
    r0 = rows.min(); r1 = r0 + max(2, int(0.15 * (skyline - r0 + 1)))
    up = rgb[r0:r1][m[r0:r1]]
    band = rgb[max(0, skyline - 25):skyline + 1][m[max(0, skyline - 25):skyline + 1]]
    if len(up) < 50 or len(band) < 50: return {"frac": round(frac, 3)}
    U = np.median(up, 0); L = np.median(band, 0)
    yU, yL = float(luma(U)), float(luma(L))
    return {"frac": round(frac, 3), "skyline_y": round(skyline / 960, 3),
            "upper": [round(float(v * 255)) for v in U], "low": [round(float(v * 255)) for v in L],
            "low_over_upper": round(yL / max(1e-6, yU), 3)}


def label(gm, mids_ab, sk):
    """Automatic labels. Hand-checked on a 10-frame sample: a mids-colour rule mislabelled 5 of 10
    (classroom -> golden, moonlit castle -> day), so labels now come from the SKY COLOUR only, which
    is unambiguous when sky is visible. Frames without enough sky are 'O' (other) and only enter the
    pooled 'all' statistics."""
    if gm["Yp"]["95"] - gm["Yp"]["5"] < 0.15: return "X"
    if sk and "upper" in sk:
        U, L = sk["upper"], sk["low"]
        if (0.2126*U[0]+0.7152*U[1]+0.0722*U[2]) < 90: return "N"
        if L[0] > L[2] + 40 or U[0] > U[2] + 20: return "G"
        if U[2] > U[0] + 25: return "D"
    return "O"


def one(p):
    try:
        rgb = load(p)
        gm = frame_metrics(rgb)
        ink = frame_mode(rgb, True)
        keep = rgb[caption_mask(960)]
        Y = luma(keep)
        L, a, b = srgb_to_lab(keep)
        zones = {}
        for z, sel in (("sh", Y < 0.3), ("mid", (Y >= 0.3) & (Y <= 0.7)), ("hi", Y > 0.7)):
            zones[z] = {"share": round(float(sel.mean()), 3),
                        "ab": [round(float(a[sel].mean()), 1), round(float(b[sel].mean()), 1)] if sel.any() else None,
                        "hue": hue_hist(keep, sel)}
        sk = sky(rgb)
        mids_ab = zones["mid"]["ab"] or [0, 0]
        ep = os.path.basename(os.path.dirname(p))
        return {"ep": ep, "f": os.path.basename(p), "grade": gm, "ink": ink, "zones": zones,
                "sky": sk, "label": label(gm, mids_ab, sk)}
    except Exception as e:
        return {"f": p, "error": repr(e)}


if __name__ == "__main__":
    files = sorted(glob.glob(os.path.join(FR, "*", "frame_*.png")))
    print(len(files), "frames", flush=True)
    with Pool(6) as pool:
        res = pool.map(one, files, chunksize=8)
    json.dump(res, open(os.path.join(HERE, "..", "data", "frames_pass.json"), "w"))
    print("errors", sum("error" in r for r in res))
