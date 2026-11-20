"""Cinematographer census, raw pass (2026-11-09). Numbers only: nothing from the videos is copied or saved as images.

Per frame pair at 360x640 (caption band excluded):
  * global camera: the motion.md 9-tile similarity fit (tools/measure/cam_track.py), tx ty zoom roll peak res
  * subject grid: 48 blocks (6 cols x 8 rows, 60x64 px) phase-correlated, dx dy peak per block
  * luma mean, 32-bin luma histogram, gradient energy |gx| |gy| (motion-blur direction)
Writes <out>/<title>.npz.  Usage: python cine_raw.py <outdir> <video> [...]
       python cine_raw.py --validate   (synthetic pan + locked subject, prints what the grid sees)
"""
import sys, os, numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
SKILL = os.path.abspath(os.path.join(HERE, "..", "..", "..", ".."))
sys.path.insert(0, os.path.join(SKILL, "tools", "measure"))
from vidio import frames
from cam_track import tiles, phasecorr, fit_similarity, W, H

BY = [8, 72, 136, 200, 264, 328, 490, 554]   # block tops; 406-483 caption band skipped
BX = [0, 60, 120, 180, 240, 300]
BH, BW = 64, 60
KEEP = np.ones(H, bool); KEEP[406:484] = False

def per_pair(prev, img):
    ta, ca = tiles(prev); tb, _ = tiles(img)
    d, pks = [], []
    for A, B in zip(ta, tb):
        dx, dy, pk = phasecorr(A, B); d.append((dx, dy)); pks.append(pk)
    tx, ty, a, b, res = fit_similarity(np.array(d), ca)
    g = (tx, ty, a, b, float(np.median(pks)), res)
    blk = []
    for y in BY:
        for x in BX:
            dx, dy, pk = phasecorr(prev[y:y+BH, x:x+BW], img[y:y+BH, x:x+BW]); blk.append((dx, dy, pk))
    return g, blk

def stats(img):
    m = img[KEEP]
    h = np.histogram(m, 32, (0, 1))[0].astype(np.float32); h /= h.sum()
    gx = np.abs(np.diff(m, axis=1)).mean(); gy = np.abs(np.diff(m, axis=0)).mean()
    return float(m.mean()), h, float(gx), float(gy)

def raw(seq):
    G, B, L, HI, GX, GY = [], [], [], [], [], []
    prev = None
    for img in seq:
        l, h, gx, gy = stats(img); L.append(l); HI.append(h); GX.append(gx); GY.append(gy)
        if prev is not None:
            g, blk = per_pair(prev, img); G.append(g); B.append(blk)
        prev = img
    return dict(g=np.array(G, np.float32), blk=np.array(B, np.float32), luma=np.array(L, np.float32),
                hist=np.array(HI, np.float32), gx=np.array(GX, np.float32), gy=np.array(GY, np.float32))

def validate():
    rng = np.random.default_rng(1)
    bg = rng.random((900, 1400)).astype(np.float32)
    k = np.ones(5) / 5
    for ax in (0, 1): bg = np.apply_along_axis(lambda r: np.convolve(r, k, "same"), ax, bg)
    subj = rng.random((130, 110)).astype(np.float32)
    seq = []
    for i in range(12):
        x0 = 100 + 4 * i                       # camera pans 4 px/f at 360 = 8 px/f at 720
        f = bg[100:740, x0:x0 + 360].copy()
        f[200:330, 125:235] = subj             # subject locked in frame centre (tracked)
        seq.append(f)
    r = raw(seq)
    blk = r["blk"]; mag = np.hypot(blk[..., 0], blk[..., 1]).mean(0).reshape(8, 6)
    print("global tx median %.2f (expect 4.0 at 360 px)" % np.median(r["g"][:, 0]))
    print("block |d| grid (expect ~4 everywhere except ~0 where the subject sits, rows 3-4 cols 2-3):")
    print(np.round(mag, 1))

if __name__ == "__main__":
    if sys.argv[1] == "--validate": validate(); sys.exit()
    out = sys.argv[1]; os.makedirs(out, exist_ok=True)
    for v in sys.argv[2:]:
        name = os.path.splitext(os.path.basename(v))[0]
        dst = os.path.join(out, name + ".npz")
        if os.path.exists(dst): print("skip", name, flush=True); continue
        r = raw(frames(v, W, H, gray=True))
        np.savez_compressed(dst, **r)
        print("done", name, len(r["luma"]), flush=True)
