"""Measure the colour grade and light of reference videos, per kind of scene, and compare our frames to them.
python tools/measure/rick_grade_study.py <videos...> --ours <png...> --out <dir>
Per frame (1 per second, 360x640, caption band 64-80 % of the height masked):
  luma p1 / p10 / p50 / p90 / p99, mean, contrast (std), saturation mean (HSV S weighted by value), colourfulness (Hasler-Suesstrunk),
  mean RGB in shadows (luma < .25), mids (.25-.7), highlights (> .7) = the split tone, sky hue (top 20 % if blue/cyan-ish), edge density.
Kinds by the frame itself: NIGHT (mean < .30 and blue-ish), DUSK (warm-violet sky or orange/pink cast), INTERIOR / DAY by sky presence.
Writes <out>/rick_grade.json (per kind medians), <out>/frames.csv, and prints a table.
"""
import sys, os, json, subprocess, argparse, colorsys
import numpy as np
from PIL import Image

def frames(video, w=360, h=640):
    out = subprocess.run(["ffmpeg", "-v", "error", "-i", video, "-vf", f"fps=1,scale={w}:{h}", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                         capture_output=True, check=True).stdout
    n = len(out) // (w * h * 3)
    return [np.frombuffer(out[i * w * h * 3:(i + 1) * w * h * 3], np.uint8).reshape(h, w, 3) for i in range(n)]

def stats(img):
    a = img.astype(np.float32) / 255.0; h, w, _ = a.shape
    keep = np.ones((h, w), bool); keep[int(h * .64):int(h * .80)] = False
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    L = .2126 * r + .7152 * g + .0722 * b
    mx = a.max(-1); mn = a.min(-1); S = np.where(mx > 1e-4, (mx - mn) / np.maximum(mx, 1e-4), 0)
    Lk, Sk = L[keep], S[keep]; px = a[keep]
    rg = r - g; yb = .5 * (r + g) - b
    colorful = float(np.sqrt(rg[keep].std() ** 2 + yb[keep].std() ** 2) + .3 * np.sqrt(rg[keep].mean() ** 2 + yb[keep].mean() ** 2))
    def band(lo, hi):
        m = (Lk >= lo) & (Lk < hi)
        return [round(float(x), 3) for x in px[m].mean(0)] if m.sum() > 50 else None
    top = a[: int(h * .2)].reshape(-1, 3); tm = top.mean(0)
    hue = colorsys.rgb_to_hsv(*tm)[0] * 360
    sky = bool(tm[2] > tm[0] + .04 and tm.mean() > .35)
    gy, gx = np.gradient(L); edge = float(((np.hypot(gx, gy) > .08) & keep).mean())
    p = np.percentile(Lk, [1, 10, 50, 90, 99])
    return dict(p1=float(p[0]), p10=float(p[1]), p50=float(p[2]), p90=float(p[3]), p99=float(p[4]), mean=float(Lk.mean()), contrast=float(Lk.std()),
                sat=float((Sk * np.clip(Lk * 2, 0, 1)).mean() / max(np.clip(Lk * 2, 0, 1).mean(), 1e-4)), colorful=colorful,
                shadows=band(0, .25), mids=band(.25, .7), highs=band(.7, 1.01), top_rgb=[round(float(x), 3) for x in tm], top_hue=round(hue, 1), sky=sky, edge=edge)

def kind(s):
    t = s["top_rgb"]
    if s["mean"] < .30 and t[2] >= t[0]: return "NIGHT"
    warm_violet_sky = (t[0] > t[2] and t[0] > t[1] + .03 and s["mean"] < .55) or (220 < s["top_hue"] < 330 and t[0] > .35)
    if warm_violet_sky: return "DUSK"
    return "DAY" if s["sky"] else "INTERIOR"

def med(rows, key):
    v = [r[key] for r in rows if r[key] is not None]
    if not v: return None
    if isinstance(v[0], list): return [round(float(x), 3) for x in np.median(np.array(v), 0)]
    return round(float(np.median(v)), 3)

if __name__ == "__main__":
    ap = argparse.ArgumentParser(); ap.add_argument("videos", nargs="+"); ap.add_argument("--ours", nargs="*", default=[]); ap.add_argument("--out", required=True)
    A = ap.parse_args(); os.makedirs(A.out, exist_ok=True); rows = []
    for v in A.videos:
        name = os.path.basename(os.path.dirname(v)) or os.path.basename(v)
        for i, f in enumerate(frames(v)):
            s = stats(f); s.update(video=name, t=i, kind=kind(s)); rows.append(s)
    keys = ["p1", "p10", "p50", "p90", "p99", "mean", "contrast", "sat", "colorful", "edge", "shadows", "mids", "highs", "top_rgb"]
    summary = {"ALL": {k: med(rows, k) for k in keys}, "count": {}}
    for k in ("DAY", "DUSK", "NIGHT", "INTERIOR"):
        sub = [r for r in rows if r["kind"] == k]; summary["count"][k] = len(sub)
        if sub: summary[k] = {kk: med(sub, kk) for kk in keys}
    ours = {}
    for p in A.ours:
        im = np.array(Image.open(p).convert("RGB").resize((360, 640))); s = stats(im); s["kind"] = kind(s); ours[os.path.basename(p)] = s
    summary["ours"] = ours
    json.dump(summary, open(os.path.join(A.out, "rick_grade.json"), "w"), indent=1, default=float)
    with open(os.path.join(A.out, "frames.csv"), "w") as fh:
        fh.write("video,t,kind,p1,p50,p99,mean,contrast,sat,colorful,edge\n")
        for r in rows: fh.write("%s,%d,%s,%.3f,%.3f,%.3f,%.3f,%.3f,%.3f,%.3f,%.3f\n" % (r["video"], r["t"], r["kind"], r["p1"], r["p50"], r["p99"], r["mean"], r["contrast"], r["sat"], r["colorful"], r["edge"]))
    cols = ["p1", "p50", "p99", "mean", "contrast", "sat", "colorful", "edge"]
    print("%-24s" % "", *["%8s" % c for c in cols])
    for k in ("ALL", "DAY", "DUSK", "NIGHT", "INTERIOR"):
        if k in summary: print("%-24s" % ("RICK " + k + (" n=%d" % summary["count"].get(k, len(rows)) if k != "ALL" else " n=%d" % len(rows))), *["%8.3f" % summary[k][c] for c in cols])
    for n, s in ours.items(): print("%-24s" % ("OURS " + n[:18]), *["%8.3f" % s[c] for c in cols], s["kind"])
    for k in ("DAY", "DUSK", "NIGHT", "INTERIOR"):
        if k in summary: print(k, "shadows", summary[k]["shadows"], "mids", summary[k]["mids"], "highs", summary[k]["highs"], "top", summary[k]["top_rgb"])
    for n, s in ours.items(): print("OURS", n, "shadows", s["shadows"], "mids", s["mids"], "highs", s["highs"], "top", s["top_rgb"])
