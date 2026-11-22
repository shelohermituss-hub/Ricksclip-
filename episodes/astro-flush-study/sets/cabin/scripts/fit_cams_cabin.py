"""fit_cams_cabin.py: solves the proof cameras by least squares from points measured by hand on HIS frames (pixels, 540x960) and the same points in
our model (Blender metres). Pinhole 9:16, same camera convention as still_cabin.py (look = track -Z up Y, then roll about the view axis).
python3 fit_cams_cabin.py [--write]  -> prints residuals per point; --write stores loc/look/roll/vfov in params_cabin.json "cams".
A point with mask 'u' or 'v' counts only that pixel coordinate (a line seen edge-on: the rail, a wall corner)."""
import json, math, os, sys
import numpy as np
from scipy.optimize import least_squares
HERE = os.path.dirname(os.path.abspath(__file__)); PF = os.path.join(HERE, '..', 'params_cabin.json')
WY, BX, BY = 1.5, -12., 1.2
EX = BX + 2.15; RAIL_Z = 1.47; MZ0, MZ1 = 2.35, 4.85; MF_ = WY - .09; RZ = 2.42
DY, DZT = -1.15, 2.35                         # bay door centre y, door top z
SL = math.sqrt(.5); SKC = lambda x: (x, BY - 1.25 * SL, 3.3 + 1.25 * SL)
PX, PY0 = .45, BY - .13                     # porthole outer half width, porthole front face y
PTS = {
 'f300': [((-.7, MF_, MZ0), 88, 505), ((.7, MF_, MZ0), 450, 505), ((-.1, MF_ - .07, MZ0 - .03), 232, 512), ((-1.0, WY - .015, RAIL_Z + .135), 60, 685, 'v'), ((1.0, WY - .015, RAIL_Z + .135), 480, 685, 'v')],
 'f330': [((-.7, MF_, MZ1), 170, 32), ((.7, MF_, MZ1), 360, 32), ((-.7, MF_, MZ0), 172, 365), ((.7, MF_, MZ0), 358, 365), ((1.32, WY - .06, 3.69), 447, 180), ((1.84, WY - .06, 3.69), 522, 180),
          ((1.32, WY - .06, 3.01), 447, 275), ((1.84, WY - .06, 3.01), 522, 275), ((0, WY - .1, MZ1 + .05), 265, 15), ((-1.43, WY - .22, 4.32), 75, 95), ((.88, WY - .24, 4.32), 390, 85),
          ((1.95, WY - .11, 2.18), 528, 385), ((-1.75, WY - .015, RAIL_Z + .135), 30, 465, 'v')],
 'f390': [((-.7, MF_, MZ0), 140, 348), ((.7, MF_, MZ0), 355, 348), ((-.7, MF_, 3.6), 138, 170, 'u'), ((.7, MF_, 3.6), 355, 170, 'u'), ((1.32, WY - .06, 3.69), 452, 138), ((1.84, WY - .06, 3.69), 537, 138),
          ((1.32, WY - .06, 3.01), 452, 245), ((1.84, WY - .06, 3.01), 537, 245), ((.88, WY - .24, 4.32), 390, 30), ((-.1, MF_ - .07, MZ0 - .03), 265, 348)],
 'f430': [((BX - .85 - PX, PY0, 2.19), 68, 455), ((BX - .85 + PX, PY0, 2.19), 195, 455), ((BX - .85 - PX, PY0, .91), 68, 640), ((BX - .85 + PX, PY0, .91), 195, 640),
          ((BX + .85 - PX, PY0, 2.19), 330, 460), ((BX + .05, BY - .09, RZ), 260, 410), ((BX + 1.45, BY - .09, RZ), 458, 418), ((BX + .55, BY - .05, RZ - .1), 335, 425),
          (SKC(BX + .75), 375, 140), (SKC(BX - .85), 65, 110)],
 'f460': [((BX + .55, BY - .05, RZ - .1), 110, 395), ((BX + .85 - PX, PY0, 2.19), 60, 470), ((BX + 1.45, BY - .09, RZ), 280, 440), ((BX + 1.45, BY - .26, .74), 280, 780),
          ((EX - .06, BY - .06, 2.0), 392, 500, 'u'), ((EX - .06, BY - .06, 1.0), 392, 700, 'u')],
 'f490': [((BX + 1.45, BY - .09, RZ), 60, 330), ((EX - .1, DY + .54 + .17, 2.15), 340, 390), ((EX - .1, DY + .54 + .17, .25), 340, 720), ((EX - .1, DY + .6, DZT + .28), 375, 330),
          ((EX - .1, DY - .2, DZT + .28), 510, 300), ((EX - .02, DY - .05, DZT + .45), 495, 265), ((EX - .55, DY + .1, 0), 290, 860)],
}
FREE = {'f300': 'xyz', 'f460': 'xyzYPv'}     # few points: keep level (pitch, roll 0) and/or the lens prior; the rest are fully free
def basis(yaw, pitch, roll):
    d = np.array([math.sin(yaw) * math.cos(pitch), math.cos(yaw) * math.cos(pitch), math.sin(pitch)]); r = np.cross(d, [0, 0, 1.]); r /= np.linalg.norm(r); u = np.cross(r, d)
    c, s = math.cos(roll), math.sin(roll); return d, r * c + u * s, u * c - r * s
def proj(q, P):
    x, y, z, yaw, pitch, roll, vfov = q; d, r, u = basis(yaw, pitch, roll); f = 480 / math.tan(vfov / 2); rel = np.array(P) - [x, y, z]; zz = rel @ d
    return 270 + f * (rel @ r) / zz, 480 - f * (rel @ u) / zz
def fit(k, q0):
    pts = PTS[k]; fr = FREE.get(k, 'xyzYPRv'); idx = [i for i, c in enumerate('xyzYPRv') if c in fr]
    def full(p):
        q = list(q0)
        for i, v in zip(idx, p): q[i] = v
        return q
    def res(p):
        q = full(p); out = []
        for t in pts:
            uu, vv = proj(q, t[0]); m = t[3] if len(t) > 3 else 'uv'
            if 'u' in m: out.append(uu - t[1])
            if 'v' in m: out.append(vv - t[2])
        out.append((q[6] - q0[6]) * 600)    # prior on the lens, 10 px per degree (the board says normal lens all through)
        out.append(q[4] * 300 if k in ('f330', 'f390') else 0.)    # board: level for the settled cabin shot
        return out
    r = least_squares(res, [q0[i] for i in idx]); q = full(r.x); return q, res(r.x)[:-1]
P = json.load(open(PF)); write = '--write' in sys.argv
for k in PTS:
    c = P['cams'][k]; L, A = np.array(c['loc']), np.array(c['look']); d = (A - L) / np.linalg.norm(A - L)
    q0 = [*L, math.atan2(d[0], d[1]), math.asin(d[2]), math.radians(c.get('roll', 0)), math.radians(c['vfov'])]
    q, rs = fit(k, q0); rs = np.array(rs[:-1]); d, _, _ = basis(q[3], q[4], q[5])
    print('%s rms %.1f px max %.1f  loc %s yaw %.1f pitch %.1f roll %.1f vfov %.1f' % (k, math.sqrt((rs ** 2).mean()), abs(rs).max(), np.round(q[:3], 2), math.degrees(q[3]), math.degrees(q[4]), math.degrees(q[5]), math.degrees(q[6])))
    print('   residuals', np.round(rs, 0).astype(int).tolist())
    if write: c.update(loc=[round(v, 3) for v in q[:3]], look=[round(v, 3) for v in (np.array(q[:3]) + d * 5)], roll=round(math.degrees(q[5]), 2), vfov=round(math.degrees(q[6]), 2), fit='least squares on %d hand points' % len(PTS[k]))
if write: open(PF, 'w').write(json.dumps(P, indent=1))
