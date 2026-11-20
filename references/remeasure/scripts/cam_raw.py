"""Dump the raw per-frame camera fit for every reference video (re-measure 2026-11-05).

Same estimator as tools/measure/cam_track.py (motion.md section 1 method): 9-tile sub-pixel
phase-correlation similarity fit at 360x640, tile bands 3-29 / 29-56 / 80-97 % (caption excluded),
robust outlier rejection. Writes data/cam_raw/<title>.npz with per-frame tx, ty (px at 360-wide),
zoom (fractional scale per frame), roll (rad-ish, small-angle b), peak, residual.
Statistics are computed separately by cam_bands.py so the definitions can be compared.
Usage: python cam_raw.py <video> [<video> ...]
"""
import sys, os, numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "..", "..", "tools", "measure"))
from vidio import frames
from cam_track import tiles, phasecorr, fit_similarity, W, H

OUT = os.path.join(HERE, "..", "data", "cam_raw")
os.makedirs(OUT, exist_ok=True)

def raw(path):
    prev = None; rows = []
    for img in frames(path, W, H, gray=True):
        if prev is not None:
            ta, ca = tiles(prev); tb, _ = tiles(img)
            d, pks = [], []
            for A, B in zip(ta, tb):
                dx, dy, pk = phasecorr(A, B); d.append((dx, dy)); pks.append(pk)
            tx, ty, a, b, res = fit_similarity(np.array(d), ca)
            rows.append((tx, ty, a, b, float(np.median(pks)), res))
        prev = img
    return np.array(rows, np.float64)

if __name__ == "__main__":
    for v in sys.argv[1:]:
        name = os.path.splitext(os.path.basename(v))[0]
        dst = os.path.join(OUT, name + ".npz")
        if os.path.exists(dst): print("skip", name); continue
        r = raw(v)
        np.savez(dst, tx=r[:, 0], ty=r[:, 1], zoom=r[:, 2], roll=r[:, 3], peak=r[:, 4], res=r[:, 5])
        print("done", name, len(r), flush=True)
