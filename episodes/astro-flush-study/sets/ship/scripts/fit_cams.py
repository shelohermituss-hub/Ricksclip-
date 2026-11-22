"""fit_cams.py: cameras by fit. For each proof frame, params_ship.json "fits" holds points [u, v, x, y, z]: (u, v) = pixel on HIS 540x960 frame,
(x, y, z) = the same point in our model (Blender metres, ship at rest). Solves position, yaw, pitch, roll and vertical fov by least squares (pinhole, 9:16),
with the same camera convention as still_ship.py (look + roll + vfov), and writes the result into params "cams". python3 fit_cams.py [f40 ...]
Prints the rms residual in px and the worst point: a high residual means a MODEL proportion is wrong there, not the camera."""
import json, os, sys, math
import numpy as np
from scipy.optimize import least_squares
HERE = os.path.dirname(os.path.abspath(__file__)); PF = os.path.join(HERE, '..', 'params_ship.json')
P = json.load(open(PF)); keys = sys.argv[1:] or list(P['fits'])
def basis(yaw, pitch, roll):
    f = np.array([math.cos(pitch) * math.cos(yaw), math.cos(pitch) * math.sin(yaw), math.sin(pitch)])
    r = np.cross(f, [0, 0, 1.]); r /= np.linalg.norm(r); u = np.cross(r, f)
    return f, math.cos(roll) * r + math.sin(roll) * u, -math.sin(roll) * r + math.cos(roll) * u
def project(q, X):
    c, (yaw, pitch, roll, vf) = q[:3], q[3:]; f, r, u = basis(yaw, pitch, roll); d = X - c; z = d @ f; k = 480 / math.tan(vf / 2)
    return np.stack([270 + (d @ r) / z * k, 480 - (d @ u) / z * k], 1)
for key in keys:
    pts = np.array(P['fits'][key]['pts'], float); uv, X = pts[:, :2], pts[:, 2:]; c0 = P['cams'][key]
    d = np.array(c0['look']) - np.array(c0['loc']); q0 = np.r_[c0['loc'], math.atan2(d[1], d[0]), math.atan2(d[2], math.hypot(d[0], d[1])), math.radians(c0.get('roll', 0)), math.radians(c0['vfov'])]
    fix_v = P['fits'][key].get('vfov')
    def res(q):
        qq = q.copy()
        if fix_v: qq[6] = math.radians(fix_v)
        return (project(qq, X) - uv).ravel()
    lo = np.r_[[-np.inf] * 6, math.radians(8)]; hi = np.r_[[np.inf] * 6, math.radians(90)]
    s = least_squares(res, q0, bounds=(lo, hi), x_scale='jac', max_nfev=4000)
    q = s.x.copy()
    if fix_v: q[6] = math.radians(fix_v)
    e = np.linalg.norm(project(q, X) - uv, axis=1); f, _, _ = basis(*q[3:6])
    P['cams'][key] = {'loc': [round(float(v), 3) for v in q[:3]], 'look': [round(float(v), 3) for v in q[:3] + f * 10], 'vfov': round(math.degrees(q[6]), 2),
                      'roll': round(math.degrees(q[5]), 2), 'fit_rms_px': round(float(np.sqrt((e ** 2).mean())), 1)}
    print('%s rms %.1f px  max %.1f px at point %d  vfov %.1f  loc %s' % (key, np.sqrt((e ** 2).mean()), e.max(), e.argmax(), math.degrees(q[6]), P['cams'][key]['loc']))
json.dump(P, open(PF, 'w'), indent=1)
