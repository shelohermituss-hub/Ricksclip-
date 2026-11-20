"""Automatic cartoon-head harvest from references/frames/ (re-measure 2026-11-05).

Replaces the lost references/characters/ and references/lighting/ head work. A head is a pale
(Y > 0.62, S < 0.48) filled blob, roughly elliptical (solidity > 0.93, bbox extent 0.70-0.86,
H/W 0.70-1.40), 6-80 % of frame width, outside the caption band, with a DARK RING: at least 60 %
of the pixels in a 0.06 W band just outside it have Y < 0.40 (the ink outline).
Every detection is written with its crop so a person can reject false hits (out/heads_sheet_*.jpg).

Per head (all lengths / W = head width):
  H/W, outline width (dark-ring area / perimeter), ink colour = median RGB of the darkest third of the
  ring, fill colour + luma (eroded blob, features removed), side gradient |lr| = plane-fit slope of
  luma across the head x W / mean, top-bottom gradient tb, eye spacing (centre to centre, when exactly
  two similar dark blobs sit in the upper 65 % of the head), eye height (from head centre).
Writes data/heads.json.
"""
import sys, os, glob, json, numpy as np
from multiprocessing import Pool
from PIL import Image
from scipy import ndimage

HERE = os.path.dirname(os.path.abspath(__file__))
FR = os.path.join(HERE, "..", "..", "frames")
CAP = (0.635, 0.755)


def luma(a): return 0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2]


def heads_in(path):
    im = Image.open(path).convert("RGB")
    if im.width != 720: im = im.resize((720, 1280), Image.LANCZOS)   # one grid for every episode
    rgb = np.asarray(im, np.float32) / 255
    Hh, Ww = rgb.shape[:2]
    Y = luma(rgb); mx = rgb.max(-1); S = (mx - rgb.min(-1)) / (mx + 1e-6)
    pale = (Y > 0.62) & (S < 0.48)
    pale[int(CAP[0] * Hh):int(CAP[1] * Hh)] = False
    lab, n = ndimage.label(pale)
    out = []
    objs = ndimage.find_objects(lab)
    for i, sl in enumerate(objs):
        if sl is None: continue
        h = sl[0].stop - sl[0].start; w = sl[1].stop - sl[1].start
        if not (0.06 * Ww <= w <= 0.80 * Ww): continue
        if not (0.50 <= h / w <= 1.40): continue
        pad = int(0.15 * w) + 3
        y0, y1 = max(0, sl[0].start - pad), min(Hh, sl[0].stop + pad)
        x0, x1 = max(0, sl[1].start - pad), min(Ww, sl[1].stop + pad)
        comp = lab[y0:y1, x0:x1] == (i + 1)
        filled = ndimage.binary_fill_holes(comp)
        area = filled.sum()
        ext = area / (h * w)
        if not (0.66 <= ext <= 0.88): continue
        # solidity via convex hull of boundary points
        ys, xs = np.where(filled)
        try:
            from scipy.spatial import ConvexHull
            hull = ConvexHull(np.c_[xs, ys]); sol = area / max(1, hull.volume)
        except Exception:
            continue
        if sol < 0.93: continue
        ring_w = max(2, int(round(0.06 * w)))
        ring = ndimage.binary_dilation(filled, iterations=ring_w) & ~filled
        Yc = Y[y0:y1, x0:x1]; rgbc = rgb[y0:y1, x0:x1]
        dark_frac = float((Yc[ring] < 0.40).mean())
        if dark_frac < 0.60: continue
        # --- outline: 72 radial rays from the centroid; on each, the contiguous dark (Y < 0.40) run that
        # starts at the blob edge, capped at 0.20 W. Width = run length; ink = the darkest pixel on the run.
        ys, xs = np.where(filled); cy0, cx0 = ys.mean(), xs.mean()
        Yc = Y[y0:y1, x0:x1]; rgbc = rgb[y0:y1, x0:x1]
        widths, inks, angs = [], [], []
        for ang in np.radians(np.arange(0, 360, 5)):
            dx, dy = np.cos(ang), np.sin(ang)
            r = 0.0
            while True:
                yy, xx = int(round(cy0 + dy * r)), int(round(cx0 + dx * r))
                if not (0 <= yy < filled.shape[0] and 0 <= xx < filled.shape[1]): r = None; break
                if not filled[yy, xx]: break
                r += 0.5
            if r is None: continue
            run, best, bestY = 0.0, None, 9
            while run <= 0.20 * w:
                yy, xx = int(round(cy0 + dy * (r + run))), int(round(cx0 + dx * (r + run)))
                if not (0 <= yy < filled.shape[0] and 0 <= xx < filled.shape[1]): break
                if Yc[yy, xx] >= 0.40: break
                if Yc[yy, xx] < bestY: bestY, best = Yc[yy, xx], rgbc[yy, xx]
                run += 0.5
            if best is None or run > 0.20 * w: continue     # no line, or a dark mass (hair, hat, shadow)
            widths.append(run); inks.append(best); angs.append(np.degrees(ang))
        if len(widths) < 24: continue
        widths = np.array(widths)
        outline_w = float(np.median(widths))
        thick_thin = float(np.percentile(widths, 90) / max(0.5, np.percentile(widths, 10)))
        ta = np.radians(np.array(angs)[np.argsort(widths)[-5:]]); thick_ang = float(np.degrees(np.arctan2(np.sin(ta).mean(), np.cos(ta).mean())) % 360)  # circular mean
        ink = np.median(np.array(inks), 0) * 255
        dark_frac = float(len(widths)) / 72
        feat = filled & ~comp                       # holes = eyes, mouth, brows
        body = ndimage.binary_erosion(comp, iterations=max(1, int(0.05 * w)))
        fill = np.median(rgbc[body], 0) * 255 if body.any() else None
        # plane fit of luma over the clean fill
        by, bx = np.where(body)
        lr = tb = None
        if len(bx) > 50:
            A = np.c_[(bx - bx.mean()) / w, (by - by.mean()) / w, np.ones(len(bx))]
            cf, *_ = np.linalg.lstsq(A, Yc[by, bx], rcond=None)
            m = Yc[by, bx].mean(); lr = float(cf[0] / m); tb = float(cf[1] / m)
        cxc = int(round(xs.mean())); topy = ys[xs == cxc].min() if (xs == cxc).any() else ys.min()
        run = 0
        while topy - run - 1 >= 0 and Yc[topy - run - 1, cxc] < 0.40: run += 1
        bare = bool(run <= 0.10 * w and topy - run > 0)
        # eyes
        fl, fn = ndimage.label(feat & (Yc < 0.45))
        cands = []
        for j in range(1, fn + 1):
            yy, xx = np.where(fl == j)
            a = len(yy)
            if a < 4: continue
            if yy.mean() > cy0 + 0.15 * h: continue      # below mid-face = mouth
            cands.append((a, xx.mean(), yy.mean()))
        eye_sp = eye_y = None
        if len(cands) >= 2:
            cands.sort(reverse=True)
            (a1, x1e, y1e), (a2, x2e, y2e) = cands[:2]
            if a1 / a2 < 2.5 and abs(y1e - y2e) < 0.08 * w and abs(x1e - x2e) > 0.08 * w:
                eye_sp = abs(x1e - x2e) / w; eye_y = ((y1e + y2e) / 2 - cy0) / w
                eye_shift = ((x1e + x2e) / 2 - cx0) / w
        out.append({
            "ep": os.path.basename(os.path.dirname(path)), "f": os.path.basename(path),
            "box": [int(x0), int(y0), int(x1), int(y1)], "W_px": int(w), "H_over_W": round(h / w, 3),
            "ring_dark_frac": round(dark_frac, 2), "bare_top": bare, "top_dark_run_over_W": round(run / w, 3), "outline_w_over_W": round(outline_w / w, 4), "thick_thin_p90_p10": round(thick_thin, 2), "thickest_angle_deg": round(thick_ang, 1), "rays_with_line": round(dark_frac, 2),
            "ink_rgb": [int(v) for v in ink], "fill_rgb": [int(v) for v in fill] if fill is not None else None,
            "fill_luma": round(float(luma(np.array(fill) / 255)), 3) if fill is not None else None,
            "grad_lr": round(lr, 3) if lr is not None else None, "grad_tb": round(tb, 3) if tb is not None else None,
            "eye_spacing_over_W": round(float(eye_sp), 3) if eye_sp else None,
            "eye_y_over_W": round(float(eye_y), 3) if eye_y is not None else None,
            "eye_shift_over_W": round(float(eye_shift), 3) if eye_sp else None,
        })
    return out


if __name__ == "__main__":
    files = sorted(glob.glob(os.path.join(FR, "*", "frame_*.png")))
    with Pool(5) as p:
        res = p.map(heads_in, files, chunksize=8)
    flat = [h for r in res for h in r]
    json.dump(flat, open(os.path.join(HERE, "..", "data", "heads.json"), "w"), indent=0)
    print(len(flat), "heads from", len(files), "frames")
