"""Cinematographer census, statistics (2026-11-09). Reads cine_raw.py npz files, prints and writes JSON.

Units: px at 720x1280 per 30 fps frame (motion.md section 1), zoom in %/f.
  cut      : luma-histogram L1 jump >= 0.5 and >= 3x the local median, or >= 0.22 and 4x with the tile fit lost (masked caption band)
  speed    : motion.md def A (similarity path, gaussian sigma 1.2, hypot(translation, zoom x 734))
  bg flow  : median block |d| on the outer ring of the 6x8 grid
  TRACK    : bg flow >= 4 px/f AND >= 2 inner blocks moving < 35 % of the bg flow with a good peak
             (a subject held in frame while the world streams past: chase / follow / catch)
  CROSS    : camera speed < 1.5 AND >= 3 inner blocks moving >= 3 px/f (subject crosses a held frame)
  WHIP     : speed >= 40 px/f, or tile peak collapsing (< 0.04) inside a shot with gradient anisotropy (blur)
  flash    : luma jump >= +0.12 against the median of the previous 5 frames
Usage: python cine_stats.py <npz> [...] [--json out.json]
"""
import sys, json, numpy as np
CORNER = 734.0
def gs(x, s=1.2):
    r = int(4 * s); k = np.exp(-0.5 * (np.arange(-r, r + 1) / s) ** 2); k /= k.sum()
    return np.convolve(np.pad(x, r, mode="edge"), k, "valid")

RING = [i for i in range(48) if i // 6 in (0, 7) or i % 6 in (0, 5)]
INNER = [i for i in range(48) if i // 6 in range(1, 7) and i % 6 in range(1, 5)]

def analyse(path):
    z = np.load(path); g, blk, luma, hist = z["g"], z["blk"], z["luma"], z["hist"]
    gx, gy = z["gx"], z["gy"]
    n = len(g); fps = 30
    hd = np.abs(np.diff(hist, axis=0)).sum(1)          # len n (pair i -> frames i, i+1)
    med = np.array([np.median(hd[max(0, i - 6):i + 7]) for i in range(n)])
    tx, ty, zm, rl, pk = g[:, 0], g[:, 1], g[:, 2], g[:, 3], g[:, 4]
    cut = ((hd >= 0.5) & (hd >= 3 * med + 0.05)) | ((hd >= 0.22) & (hd >= 4 * med + 0.05) & (pk < 0.06))
    bad = cut | (pk < 0.04)
    cutm = cut | np.roll(cut, 1) | np.roll(cut, -1)
    T = lambda v: np.where(bad, 0, v)
    sx, sy, sz, sr = (gs(np.cumsum(T(v))) for v in (tx * 2, ty * 2, zm, rl))
    vx, vy, vz, vr = (np.diff(s, prepend=s[0]) for s in (sx, sy, sz, sr))
    speed = np.hypot(np.hypot(vx, vy), vz * CORNER)
    d = np.hypot(blk[..., 0], blk[..., 1]) * 2; bp = blk[..., 2]
    bg = np.median(d[:, RING], 1)
    inner_d, inner_p = d[:, INNER], bp[:, INNER]
    locked = ((inner_d < 0.35 * bg[:, None]) & (inner_p > 0.08)).sum(1)
    movers = ((inner_d >= 3) & (inner_p > 0.06)).sum(1)
    track = (~cutm) & (bg >= 4) & (locked >= 2)
    cross = (~cutm) & (speed < 1.5) & (movers >= 3)
    aniso = np.maximum(gx, gy)[1:] / (np.minimum(gx, gy)[1:] + 1e-6)
    w0 = (~cutm) & ((speed >= 40) | ((pk < 0.04) & (aniso > 2.2)))
    whip = np.zeros_like(w0)
    for a_, l_ in runs(w0, 1, 3): whip[int(a_):int(a_) + int(l_)] = True     # a whip lasts >= 3 frames
    lj = luma[1:] - np.array([np.median(luma[max(0, i - 4):i + 1]) for i in range(n)])
    flash = (lj >= 0.12) & ~cut
    # shots
    edges = [0] + [i + 1 for i in np.where(cut)[0]] + [n]
    shots = []
    for a, b in zip(edges[:-1], edges[1:]):
        if b - a < 3: continue
        sp = speed[a:b]; ok = ~cutm[a:b]
        dx, dy, dz, dr = np.abs(vx[a:b]).sum(), np.abs(vy[a:b]).sum(), np.abs(vz[a:b]).sum() * CORNER, np.abs(vr[a:b]).sum() * CORNER
        comp = {"pan": dx, "tilt": dy, "push" if vz[a:b].sum() > 0 else "pull": dz, "roll": dr}
        tot = sum(comp.values()) + 1e-6
        mix = {k: round(v / tot, 2) for k, v in comp.items() if v / tot >= 0.2}
        shots.append({"t0": round(a / fps, 2), "dur": round((b - a) / fps, 2),
                      "move_pct": round(100 * float((sp[ok] >= 2).mean()), 0) if ok.any() else None,
                      "hold_pct": round(100 * float((sp[ok] < 0.3).mean()), 0) if ok.any() else None,
                      "speed_med": round(float(np.median(sp[ok])), 1) if ok.any() else None,
                      "speed_peak": round(float(sp[ok].max()), 1) if ok.any() else None,
                      "zoom_total_pct": round(100 * float(vz[a:b].sum()), 1),
                      "roll_total_deg": round(float(np.degrees(vr[a:b].sum())), 1),
                      "mix": mix, "track_pct": round(100 * float(track[a:b].mean()), 0),
                      "cross_pct": round(100 * float(cross[a:b].mean()), 0),
                      "whip_f": int(whip[a:b].sum()), "flash_f": int(flash[a:b].sum()),
                      "start_speed": round(float(np.median(sp[:4])), 1), "end_speed": round(float(np.median(sp[-4:])), 1)})
    ok = ~cutm; spo = speed[ok]
    dur = n / fps
    sl = np.array([s["dur"] for s in shots])
    cut_speeds = [(float(speed[max(0, i - 3)]), float(speed[min(n - 1, i + 3)])) for i in np.where(cut)[0]]
    summ = {"dur_s": round(dur, 1), "shots": len(shots), "cuts_per_10s": round(10 * int(cut.sum()) / dur, 2),
            "shot_len_med_s": round(float(np.median(sl)), 2), "shot_len_p90_s": round(float(np.percentile(sl, 90)), 2),
            "hold_pct": round(100 * float((spo < 0.3).mean()), 1), "move_pct": round(100 * float((spo >= 2).mean()), 1),
            "speed_med": round(float(np.median(spo)), 2), "speed_p90": round(float(np.percentile(spo, 90)), 1),
            "track_pct": round(100 * float(track.mean()), 1), "cross_pct": round(100 * float(cross.mean()), 1),
            "whip_frames": int(whip.sum()), "flash_frames": int(flash.sum()),
            "cuts_on_motion_pct": round(100 * float(np.mean([max(a, b) >= 2 for a, b in cut_speeds])), 0) if cut_speeds else None,
            "shots_with_roll_ge3deg_pct": round(100 * float(np.mean([abs(s["roll_total_deg"]) >= 3 for s in shots])), 0),
            "shots_zoom_ge10pct": round(100 * float(np.mean([abs(s["zoom_total_pct"]) >= 10 for s in shots])), 0)}
    return {"summary": summ, "shots": shots,
            "track_runs": runs(track, fps), "whip_runs": runs(whip, fps), "flash_t": [round(i / fps, 2) for i in np.where(flash)[0]]}

def runs(m, fps, minlen=4):
    out, i = [], 0
    while i < len(m):
        if m[i]:
            j = i
            while j < len(m) and m[j]: j += 1
            if j - i >= minlen: out.append([round(i / fps, 2), round((j - i) / fps, 2)])
            i = j
        else: i += 1
    return out

if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    js = sys.argv[sys.argv.index("--json") + 1] if "--json" in sys.argv else None
    if js in args: args.remove(js)
    res = {a.replace("\\", "/").rsplit("/", 1)[-1][:-4]: analyse(a) for a in args}
    for k, v in res.items(): print(k, json.dumps(v["summary"]))
    if js: json.dump(res, open(js, "w"), indent=1)
