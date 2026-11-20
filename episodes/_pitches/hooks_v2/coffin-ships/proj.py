# proj.py: screen position (0..1 x right, 0..1 y down) of plan points for a camera; python proj.py
import numpy as np, sys, json
def proj(cam, aim, lens, P):
    cam, aim = np.array(cam, float), np.array(aim, float); f = aim - cam; f /= np.linalg.norm(f); r = np.cross(f, [0, 0, 1]); r /= np.linalg.norm(r); u = np.cross(r, f)
    th = np.tan(np.arctan(18 / lens)); tw = th * 9 / 16; out = []
    for p in P:
        d = np.array(p, float) - cam; z = d @ f; out.append((round(.5 + (d @ r) / z / tw / 2, 3), round(.5 - (d @ u) / z / th / 2, 3), round(z, 2)))
    return out
if __name__ == '__main__':
    cam, aim, lens = json.loads(sys.argv[1]), json.loads(sys.argv[2]), float(sys.argv[3]); pts = json.loads(sys.argv[4])
    for k, v in pts.items(): print(k, proj(cam, aim, lens, [v])[0])
