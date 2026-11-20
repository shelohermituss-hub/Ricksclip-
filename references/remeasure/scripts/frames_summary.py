"""Aggregate data/frames_pass.json -> data/frames_summary.json (per-frame medians per label, as grade.md 2)."""
import json, numpy as np, collections
R = [r for r in json.load(open("data/frames_pass.json")) if "error" not in r]
lab = collections.Counter(r["label"] for r in R)
def med(rs, f):
    v = [f(r) for r in rs]; v = [x for x in v if x is not None]
    return round(float(np.median(v)), 3) if v else None
out = {"n_frames": len(R), "labels": dict(lab), "clusters": {}}
for L, sel in (("all", lambda r: r["label"] != "X"), ("D", lambda r: r["label"] == "D"), ("G", lambda r: r["label"] == "G"),
               ("N", lambda r: r["label"] == "N"), ("O", lambda r: r["label"] == "O")):
    rs = [r for r in R if sel(r)]
    c = {"frames": len(rs)}
    for p in ("1", "5", "25", "50", "75", "95", "99"): c["Yp" + p] = med(rs, lambda r: r["grade"]["Yp"][p])
    for k in ("Ymean", "noink_p5", "noink_p50", "sat_mean", "sat_p50", "litC_p50", "litC_p90", "corner_over_centre", "dark_bstar_mean", "ink_pct"):
        c[k] = med(rs, lambda r: r["grade"][k])
    c["black_point"] = [round(float(np.median([r["grade"]["black_point"][i] for r in rs])), 1) for i in range(3)]
    c["edge_ink_coverage_pct"] = med(rs, lambda r: r["ink"]["edge_ink_coverage_pct"])
    c["dark_stroke_pct"] = med(rs, lambda r: r["ink"]["dark_stroke_pct"])
    for z in ("sh", "mid", "hi"):
        c[z + "_share"] = med(rs, lambda r: r["zones"][z]["share"])
        ab = [r["zones"][z]["ab"] for r in rs if r["zones"][z]["ab"]]
        c[z + "_ab_mean"] = [round(float(np.mean([a[0] for a in ab])), 1), round(float(np.mean([a[1] for a in ab])), 1)] if ab else None
        hh = np.array([r["zones"][z]["hue"] for r in rs]); c[z + "_hue_pct"] = (100 * hh.mean(0)).round(0).astype(int).tolist() if len(hh) else None
    sk = [r["sky"] for r in rs if r["sky"] and "upper" in r["sky"]]
    if sk:
        c["sky_frames"] = len(sk)
        c["sky_low_over_upper"] = round(float(np.median([s["low_over_upper"] for s in sk])), 3)
        c["sky_low_over_upper_IQR"] = [round(float(np.percentile([s["low_over_upper"] for s in sk], q)), 3) for q in (25, 75)]
        c["sky_upper_rgb"] = [int(np.median([s["upper"][i] for s in sk])) for i in range(3)]
        c["sky_low_rgb"] = [int(np.median([s["low"][i] for s in sk])) for i in range(3)]
        c["skyline_y"] = round(float(np.median([s["skyline_y"] for s in sk])), 3)
    out["clusters"][L] = c
# per-video
pv = {}
for ep in sorted({r["ep"] for r in R}):
    rs = [r for r in R if r["ep"] == ep and r["label"] != "X"]
    pv[ep] = {"frames": len(rs), "Ymean": med(rs, lambda r: r["grade"]["Ymean"]), "sat_mean": med(rs, lambda r: r["grade"]["sat_mean"]),
              "Yp2_proxy_p1": med(rs, lambda r: r["grade"]["Yp"]["1"]), "Yp99": med(rs, lambda r: r["grade"]["Yp"]["99"]),
              "edge_ink": med(rs, lambda r: r["ink"]["edge_ink_coverage_pct"])}
out["per_video"] = pv
json.dump(out, open("data/frames_summary.json", "w"), indent=1)
print(json.dumps(out["labels"]))
for L, c in out["clusters"].items(): print(L, json.dumps(c))
ym = [v["Ymean"] for v in pv.values()]; sm = [v["sat_mean"] for v in pv.values()]
print("per-video Ymean range", min(ym), max(ym), "sat range", min(sm), max(sm))
