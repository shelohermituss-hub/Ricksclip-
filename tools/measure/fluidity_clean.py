"""Fluidity and colour-cleanliness numbers of a video, to compare with Rick (CB 2026-11-22: "Rick's render looks like a video game, very fluid";
"their colours were clean and neat"). python tools/measure/fluidity_clean.py <video> [ffmpeg crop filter, e.g. crop=iw/2:ih:0:0]
held  = share of frames where almost nothing moves (frame change < 15 % of the median change): Rick 0.000
pops  = share of frames whose change is > 3x the median (jumps, pose pops, cuts): Rick 0.047
jerk  = mean change of the frame-to-frame change / mean change (uneven speed): Rick 0.20
chroma-roughness = colour noise inside flat areas (blotches, grain after a strong grade): Rick 0.0029
Measured 2026-11-22 (caption band masked): Rick car scene 0.000 / 0.047 / 0.20 / 0.0029; our car scene 0.011 / 0.067 / 0.23 / 0.0029;
plane-eater kit draft 0.028 / 0.086 / 0.26 / 0.0023; plane-eater Blender v1 0.071 / 0.192 / 0.37 / 0.0035 (FAIL).
GATE for a film: held <= 0.02, pops <= 0.08, jerk <= 0.25, chroma-roughness <= 0.0030; and the Blender film never worse than its own draft."""
import subprocess, sys, numpy as np
def frames(path, vf, w=180, h=320):
    p = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-vf', vf + ',scale=%d:%d' % (w, h), '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
    return np.frombuffer(p, np.uint8).reshape(-1, h, w, 3).astype(np.float32) / 255
def stats(F):
    h = F.shape[1]; M = np.ones(h, bool); M[int(.58 * h):int(.80 * h)] = False; G = F[:, M]
    d = np.abs(G[1:] - G[:-1]).mean((1, 2, 3)); med = np.median(d)
    L = G @ np.array([.2126, .7152, .0722]); flat = (np.abs(np.diff(L, axis=2))[:, :-1, :] + np.abs(np.diff(L, axis=1))[:, :, :-1]) < 0.01
    rough = (np.abs(np.diff(G[..., 0] - L, axis=2))[:, :-1, :] + np.abs(np.diff(G[..., 2] - L, axis=2))[:, :-1, :])[flat].mean()
    return dict(frames=len(F), held=float((d < .15 * med).mean()), pops=float((d > 3 * med).mean()), jerk=float(np.abs(np.diff(d)).mean() / max(d.mean(), 1e-6)), chroma_roughness=float(rough))
if __name__ == '__main__':
    s = stats(frames(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else 'null'))
    ok = s['held'] <= .02 and s['pops'] <= .08 and s['jerk'] <= .25 and s['chroma_roughness'] <= .0030
    print({k: round(v, 4) for k, v in s.items()}, 'PASS' if ok else 'FAIL'); sys.exit(0 if ok else 1)
