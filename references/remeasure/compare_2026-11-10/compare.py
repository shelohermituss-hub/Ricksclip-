
import os, sys, json, subprocess, time, traceback, glob
import numpy as np
from PIL import Image
from scipy import ndimage as ni
SK = r"<skill folder>"; sys.path.insert(0, os.path.join(SK, "tools", "measure")); sys.path.insert(0, os.path.join(SK, "tools"))
import grade_metrics as GM, look_3d as L3, quality_metrics as QM, film_motion as FM
D = os.path.join(SK, "references", "remeasure", "compare_2026-11-10"); V = os.path.join(SK, "references", "video"); PY = sys.executable
VID = {"ours": os.path.join(SK, "episodes", "baboon-signalman", "out", "final", "v1", "baboon_signalman_v1.mp4"),
       "railroads": os.path.join(V, "Why Perfect Railroads Don't Work - Ricks Clips (1080p, h264).mp4"),
       "coaster": os.path.join(V, "This Shape Saved Roller Coasters - Ricks Clips (1080p, h264).mp4"),
       "drivers": os.path.join(V, "Why Drivers Started Filming The Road - Ricks Clips (1080p, h264).mp4"),
       "pink": os.path.join(V, "The Pink Prison Cell Experiment - Ricks Clips (1080p, h264).mp4"),
       "stormoil": os.path.join(V, "Why Sailors Carried Storm Oil - Ricks Clips (1080p, h264).mp4")}
st = {"step": "start"}; R = {}
def save(): json.dump(st, open(os.path.join(D, "status.json"), "w"), indent=1); json.dump(R, open(os.path.join(D, "compare.json"), "w"), indent=1)
def run(cmd): return subprocess.run(cmd, capture_output=True, text=True, creationflags=0x08000000)
def extra(rgb):
    H, W = rgb.shape[:2]; Y = rgb @ np.array([.2126, .7152, .0722], np.float32); k = np.ones((H, W), bool); k[int(.62 * H):int(.78 * H)] = False; y = Y[k]
    r = dict(p5=float(np.percentile(y, 5)), p50=float(np.percentile(y, 50)), p95=float(np.percentile(y, 95)), dark=float((y < .2).mean()), bright=float((y > .8).mean()))
    r["range"] = r["p95"] - r["p5"]
    bs = 24; hb, wb = H // bs, W // bs; bl = lambda x: x[:hb * bs, :wb * bs].reshape(hb, bs, wb, bs).transpose(0, 2, 1, 3).reshape(hb, wb, -1)
    fine = bl(Y - ni.gaussian_filter(Y, 1.5)).std(-1); coarse = bl(ni.gaussian_filter(Y, 3) - ni.gaussian_filter(Y, 8)).std(-1); kb = bl(k.astype(np.float32)).min(-1) > 0
    s = (coarse > .012) & kb
    if s.sum() > 20:
        q = fine[s] / coarse[s]; r.update(sharp_p10=float(np.percentile(q, 10)), sharp_p50=float(np.percentile(q, 50)), sharp_p90=float(np.percentile(q, 90)), soft_share=float((q < .35).mean()), struct_share=float(s.sum() / kb.sum()))
    mx = rgb.max(-1); mn = rgb.min(-1); S = np.where(mx > 1e-6, (mx - mn) / (mx + 1e-9), 0); hsv = np.asarray(Image.fromarray((rgb * 255).astype(np.uint8)).convert("HSV")).astype(np.float32); Hh = hsv[..., 0] * 360 / 255
    sat = k & (S > .25) & (Y > .12); hh = Hh[sat]
    if len(hh) > 500:
        h = np.histogram(hh, 12, (0, 360))[0] / len(hh); o = np.sort(h)[::-1]; r.update(hue_top1=float(o[0]), hue_top2=float(o[0] + o[1]), hue_entropy=float(-(h[h > 0] * np.log2(h[h > 0])).sum()), warm=float(((hh < 70) | (hh >= 320)).mean()), cool=float(((hh >= 165) & (hh < 265)).mean()), green=float(((hh >= 70) & (hh < 165)).mean()), hist=[round(float(v), 3) for v in h])
    r["sat_share"] = float(sat.sum() / k.sum())
    L, a, b = GM.srgb_to_lab(rgb); r["lab"] = [float(L[k].mean()), float(a[k].mean()), float(b[k].mean())]
    # top third vs bottom third brightness (sky / ground balance), and left-right light balance
    r["top_bot"] = float(Y[:H // 3].mean() / (Y[int(.8 * H):].mean() + 1e-6))
    return r
def agg(rows):
    out = {}
    for key in rows[0]:
        v = [x[key] for x in rows if key in x and x[key] is not None]
        if not v: continue
        if isinstance(v[0], (list, tuple)): out[key] = [round(float(np.median([x[i] for x in v])), 3) for i in range(len(v[0]))]
        elif isinstance(v[0], dict): out[key] = {q: round(float(np.median([x[q] for x in v])), 3) for q in v[0]}
        else: out[key] = dict(p10=round(float(np.percentile(v, 10)), 3), p50=round(float(np.median(v)), 3), p90=round(float(np.percentile(v, 90)), 3))
    return out
try:
    for name, vid in VID.items():
        st["step"] = name; save(); t = time.time(); F = os.path.join(D, "frames", name); os.makedirs(F, exist_ok=True)
        if not os.path.exists(vid): R[name] = {"error": "missing"}; continue
        pr = json.loads(run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height,r_frame_rate,duration", "-of", "json", vid]).stdout)["streams"][0]
        if not glob.glob(os.path.join(F, "*.jpg")): run(["ffmpeg", "-y", "-v", "error", "-i", vid, "-vf", "fps=1,scale=540:960:flags=lanczos", "-q:v", "2", os.path.join(F, "f_%03d.jpg")])
        fs = sorted(glob.glob(os.path.join(F, "*.jpg"))); g, l3, q, ex = [], [], [], []
        for f in fs:
            im = Image.open(f).convert("RGB"); rgb = np.asarray(im, np.float32) / 255
            if rgb.mean() < .02: continue
            g.append(GM.frame_metrics(rgb)); q.append(QM.metrics(im)); ex.append(extra(rgb))
            try: l3.append(L3.m(f))
            except Exception: pass
        E = agg(ex); labs = np.array([x["lab"] for x in ex]); dE = np.linalg.norm(np.diff(labs, axis=0), axis=1)
        E["palette_shifts_per_min"] = round(60 * float((dE > 10).sum()) / max(1, len(ex)), 2); E["lab_std"] = [round(float(v), 2) for v in labs.std(0)]
        cam = FM.analyse(FM.series(FM.raw(vid, os.path.join(D, "motion_%s.npz" % name))))
        S = FM.series(dict(np.load(os.path.join(D, "motion_%s.npz" % name)))); ok = ~S["cutm"]; vz = S["vz"][ok] * 100
        cam.update(zoom_active_pct=100 * float((np.abs(vz) > .3).mean()), zoom_in_pct=100 * float((vz > .3).mean()), zoom_out_pct=100 * float((vz < -.3).mean()), zoom_abs_p90=float(np.percentile(np.abs(vz), 90)), roll_abs_p50=float(np.percentile(np.abs(np.degrees(S["vr"][ok])), 50)))
        R[name] = dict(probe=pr, n=len(ex), grade=GM.agg(g), look3d=agg(l3), quality=agg(q), extra=E, camera={k2: (round(v, 3) if isinstance(v, float) else v) for k2, v in cam.items()}, s=round(time.time() - t))
        n = 0
        for i in range(0, len(fs), 30):
            n += 1; run([PY, os.path.join(SK, "tools", "pc_sheet.py"), os.path.join(D, "sheet_%s_%d.jpg" % (name, n)), "6", "180"] + fs[i:i + 30])
        save()
    st["step"] = "done"; st["done"] = True
except Exception:
    st["error"] = traceback.format_exc()
save()
