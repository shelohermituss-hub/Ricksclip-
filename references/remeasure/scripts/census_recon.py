"""Reconstruction of camera_census.md's lost cam_census2.py from its own description (section 2):
whole-frame phase correlation on a 256-wide grey thumbnail, parabolic sub-pixel peak, 15 fps,
shift reported in px at 1080-wide per sampled step, cuts = mean abs frame difference > 0.085 (excluded).
Bands hold < 0.3, drift 0.3-2, move >= 2. No zoom term, no tiles, no smoothing.
Purpose: find out whether the census's 39 % hold comes from its estimator rather than the footage.
Usage: python census_recon.py <video>...   -> data/census_recon.json
"""
import sys, os, json, numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "..", "..", "tools", "measure"))
from vidio import frames
from cam_track import phasecorr

def run(path):
    prev = None; sp = []; cut = []
    for img in frames(path, 256, 455, fps=15, gray=True):
        if prev is not None:
            dx, dy, pk = phasecorr(prev, img)
            sp.append(np.hypot(dx, dy) * 1080 / 256)
            cut.append(np.abs(img - prev).mean() > 0.085)
        prev = img
    sp, cut = np.array(sp), np.array(cut)
    s = sp[~cut]
    return {"hold": round(100 * float((s < 0.3).mean()), 1), "drift": round(100 * float(((s >= 0.3) & (s < 2)).mean()), 1),
            "move": round(100 * float((s >= 2).mean()), 1), "median": round(float(np.median(s)), 2),
            "p90": round(float(np.percentile(s, 90)), 2), "cuts": int(cut.sum())}

if __name__ == "__main__":
    dst = os.path.join(HERE, "..", "data", "census_recon.json")
    out = json.load(open(dst)) if os.path.exists(dst) else {}
    for v in sys.argv[1:]:
        n = os.path.splitext(os.path.basename(v))[0]
        out[n] = run(v); print(n[:40], out[n], flush=True)
    json.dump(out, open(dst, "w"), indent=1)
