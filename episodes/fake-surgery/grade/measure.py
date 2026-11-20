#!/usr/bin/env python
"""python measure.py before|after [--set-haze]  -> grade/measure_<mode>.json
Samples every 15th film frame inside each light span (6 frames away from the span edge, impact frames skipped),
measures saturation (HSV mean), mean luma, darkest 1 % luma, white-clip share. 'after' applies grade.py.
--set-haze (with before): writes haze magnitude into params.json so the darkest 1 % lands at ~0.10."""
import os, sys, json, importlib.util, multiprocessing as mp
import numpy as np
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); EP = os.path.dirname(HERE)
LUMA = np.array([0.2126, 0.7152, 0.0722], np.float32)
R = [(1, 0, 386), (2, 363, 789), (3, 765, 1301), (4, 1278, 1695), (5, 1672, 2229)]
SKIP = set(range(155, 159)) | set(range(649, 653)) | set(range(1225, 1229)) | set(range(1481, 1498)) | set(range(1558, 1564)) | set(range(1587, 1592)) | set(range(1625, 1629)) | set(range(1674, 1700)) | set(range(1708, 1711)) | set(range(1976, 1980)) | set(range(2193, 2197)) | set(range(2205, 2230))
OWN = [(1, 0, 375), (2, 375, 777), (3, 777, 1290), (4, 1290, 1684), (5, 1684, 2230)]
def src(f):
    for s, a, b in OWN:
        if a <= f < b:
            p = os.path.join(EP, "s%d" % s, "final", "frames", "f_%05d.png" % f)
            if os.path.exists(p): return p
def load_grade():
    sp = importlib.util.spec_from_file_location("g", os.path.join(HERE, "grade.py"))
    m = importlib.util.module_from_spec(sp); sp.loader.exec_module(m); return m
def stats(a):
    f = a.astype(np.float32) / 255
    mx, mn = f.max(-1), f.min(-1); S = (mx - mn) / np.maximum(mx, 1e-4); Y = f @ LUMA
    return [float(S.mean()), float(Y.mean()), float(np.percentile(Y, 1)), float((mx > 0.985).mean())]
def work(args):
    f, mode = args
    p = src(f)
    if not p: return f, None
    a = np.asarray(Image.open(p).convert("RGB"))
    if mode == "after": a = load_grade().grade_u8(a, f)
    return f, stats(a[::2, ::2])
if __name__ == "__main__":
    mode = sys.argv[1]
    L = json.load(open(os.path.join(HERE, "lights.json")))
    jobs, kind = [], {}
    for sp in L["spans"]:
        for f in range(sp["first"] + 6, sp["last"] - 5, 15):
            if f not in SKIP: jobs.append((f, mode)); kind[f] = sp["kind"]
    with mp.Pool(max(1, (os.cpu_count() or 4) - 4)) as pool: res = pool.map(work, jobs)
    agg = {}
    for f, s in res:
        if s: agg.setdefault(kind[f], []).append(s)
    out = {k: {"n": len(v), "sat": float(np.mean([x[0] for x in v])), "mean": float(np.mean([x[1] for x in v])),
               "dark1": float(np.mean([x[2] for x in v])), "clip": float(np.mean([x[3] for x in v]))} for k, v in agg.items()}
    json.dump(out, open(os.path.join(HERE, "measure_%s.json" % mode), "w"), indent=1)
    for k, v in out.items(): print(k, {a: round(b, 3) for a, b in v.items()})
    if "--set-haze" in sys.argv:
        P = json.load(open(os.path.join(HERE, "params.json")))
        for k, v in out.items():
            mag = float(np.clip(0.10 - v["dark1"], 0.0, 0.07)) * 1.15
            t = np.array(P[k].get("tint", P[k]["haze"]), np.float32); t = t / max(float(t @ LUMA), 1e-4)
            P[k]["tint"] = [round(float(x), 3) for x in t]
            P[k]["haze"] = [round(float(x * mag), 4) for x in t]
        json.dump(P, open(os.path.join(HERE, "params.json"), "w"), indent=1); print("haze set")
