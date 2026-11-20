"""Clean + de-duplicate the head harvest (re-measure 2026-11-05).

Review of the numbered sheets (out/heads_sheet_*.jpg; sheets 00 and 11 checked by eye, 160 crops)
found ~92 % real heads. The false hits were featureless pale shapes (paper, shield face) and a
target ring. Rules derived from that review:
  - reject boxes touching the frame edge (partial heads)
  - reject if no eye pair AND fill luma < 0.75 ... (featureless shapes rarely yield an eye pair)
  - require W >= 70 px at 720-wide (enough pixels for features and outline)
  - reject the rejected ids listed in REJECT (seen on the sheets)
Consecutive frames repeat the same character, so detections are chained into TRACKS (same episode,
frame number within 3, box centre within 0.3 W, W within 25 %) and every statistic is taken over
track medians, so a 30-frame close-up counts once.
Writes data/heads_clean.json (detections kept) and data/head_tracks.json.
"""
import json, re, numpy as np
REJECT = {3, 76, 78, 81, 82, 83, 1153}
H = json.load(open("data/heads.json"))
keep = []
for h in H:
    if h["id"] in REJECT or h["W_px"] < 70: continue
    x0, y0, x1, y1 = h["box"]
    if x0 == 0 or y0 == 0 or x1 >= 720 or y1 >= 1280: continue
    if h["eye_spacing_over_W"] is None and (h["fill_luma"] or 0) < 0.75: continue
    keep.append(h)
json.dump(keep, open("data/heads_clean.json", "w"), indent=0)
num = lambda f: int(re.findall(r"\d+", f)[0])
keep.sort(key=lambda h: (h["ep"], num(h["f"])))
tracks = []
for h in keep:
    cx = (h["box"][0] + h["box"][2]) / 2; cy = (h["box"][1] + h["box"][3]) / 2
    for t in reversed(tracks[-12:]):
        l = t[-1]
        lx = (l["box"][0] + l["box"][2]) / 2; ly = (l["box"][1] + l["box"][3]) / 2
        if l["ep"] == h["ep"] and 0 < num(h["f"]) - num(l["f"]) <= 3 and np.hypot(cx - lx, cy - ly) < 0.3 * h["W_px"] \
                and abs(h["W_px"] - l["W_px"]) < 0.25 * l["W_px"]:
            t.append(h); break
    else:
        tracks.append([h])
K = ["H_over_W", "outline_w_over_W", "thick_thin_p90_p10", "thickest_angle_deg", "fill_luma", "grad_lr",
     "grad_tb", "eye_spacing_over_W", "eye_y_over_W", "eye_shift_over_W"]
T = []
for t in tracks:
    d = {"ep": t[0]["ep"], "frames": [x["f"] for x in t], "n": len(t), "W_px": int(np.median([x["W_px"] for x in t])),
         "bare_top": bool(np.mean([x["bare_top"] for x in t]) > 0.5)}
    for k in K:
        v = [x[k] for x in t if x.get(k) is not None]; d[k] = round(float(np.median(v)), 4) if v else None
    for k in ("ink_rgb", "fill_rgb"):
        v = [x[k] for x in t if x.get(k)]; d[k] = [int(c) for c in np.median(v, 0)] if v else None
    T.append(d)
json.dump(T, open("data/head_tracks.json", "w"), indent=0)
eps = len({t["ep"] for t in T})

def s(k, sel=lambda t: True):
    v = np.array([t[k] for t in T if t[k] is not None and sel(t)])
    return f"{np.median(v):.3f} (IQR {np.percentile(v,25):.3f}-{np.percentile(v,75):.3f}, n={len(v)})"

print(f"detections kept {len(keep)} of {len(H)}; tracks {len(T)} from {eps} episodes")
for k in K: print(k, s(k))
print("H/W bare-top only", s("H_over_W", lambda t: t["bare_top"]))
ink = np.array([t["ink_rgb"] for t in T if t["ink_rgb"]]); print("ink median", np.median(ink, 0), "IQR", np.percentile(ink, 25, 0), np.percentile(ink, 75, 0))
print("ink hex median #%02x%02x%02x" % tuple(int(c) for c in np.median(ink, 0)))
bright = np.array([t["ink_rgb"] for t in T if t["ink_rgb"] and t["fill_luma"] and t["fill_luma"] > 0.85])
print("ink on bright-lit heads (fill luma>0.85)", np.median(bright, 0), len(bright), "#%02x%02x%02x" % tuple(int(c) for c in np.median(bright, 0)))
big = np.array([t["ink_rgb"] for t in T if t["ink_rgb"] and t["W_px"] >= 150])
print("ink on big heads (W>=150)", np.median(big, 0), len(big), "#%02x%02x%02x" % tuple(int(c) for c in np.median(big, 0)))
fl = np.array([t["fill_rgb"] for t in T if t["fill_rgb"]]); print("fill median", np.median(fl, 0))
print("|lr| median", np.median([abs(t["grad_lr"]) for t in T if t["grad_lr"] is not None]))
