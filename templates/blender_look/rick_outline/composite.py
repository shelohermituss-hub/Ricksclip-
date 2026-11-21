"""rick_outline/composite.py: beauty + outline pass -> thin #2a1830 object lines laid UNDER the character cards.
TWO USES:
  1. KEY FRAME of a kit-built scene (build_*.py + lines_key.py), as a module or from the shell:
       python composite.py --key graded.png lines_id.png cast_mask.png out.png [--alpha .70]
     lines_id.png = the lines_key.py Workbench pass (RGBA, 900x1600: 1 px there = 1.2 px at 1080, 0.6 px at 540);
     cast_mask.png = pass_mask of the build (16-bit, cards and fist = 1): lines * (1 - mask), so no card ever gets a line.
     key_lines(id_png, W, H, alpha) returns the line alpha (H, W) for your own compositing.
  2. The look-match EXERCISE (old use, its job folder only): python composite.py --exercise [jobdir] [frames a-b]."""
import os, sys, json, math
import numpy as np
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); CS = os.path.dirname(HERE)
LINE_RGB = np.array([0x2a, 0x18, 0x30], np.float32)


def key_lines(id_png, W, H, alpha=.70):
    """one-sided 1 px edges on the Workbench id pass: a line object's pixel next to the background/a black occluder (any side), or next to
    another line object (right / down neighbour only, so a shared border is 1 px, not 2); resized to W x H by area -> fractional coverage."""
    I = np.asarray(Image.open(id_png).convert('RGBA'), np.int16); A = I[..., 3] > 127; C = I[..., :3]
    obj = A & (C.sum(-1) > 20); e = np.zeros(obj.shape, bool)
    for dy, dx in ((0, 1), (1, 0), (0, -1), (-1, 0)):
        J = np.roll(C, (dy, dx), (0, 1)); Jo = np.roll(obj, (dy, dx), (0, 1)); diff = np.abs(C - J).max(-1) > 6
        e |= obj & ~Jo                                   # silhouette against the sky, ground, walls, hidden cards
        if (dy, dx) in ((-1, 0), (0, -1)): e |= obj & Jo & diff   # border between two line objects, one side only
    e[0, :] = e[-1, :] = False; e[:, 0] = e[:, -1] = False
    a = Image.fromarray((e * 255).astype(np.uint8)).resize((W, H), Image.BILINEAR if W > e.shape[1] else Image.BOX)
    return np.asarray(a, np.float32) / 255 * alpha


def key_composite(img, id_png, mask=None, alpha=.70):
    """img float 0-255 (H, W, 3); mask float 0-1 (H, W) or None. Returns (img with lines, line alpha)."""
    H, W = img.shape[:2]; al = key_lines(id_png, W, H, alpha)
    if mask is not None: al = al * (1 - mask)
    return img * (1 - al[..., None]) + LINE_RGB * al[..., None], al


def _load_mask(p, W, H):
    m = np.asarray(Image.open(p)).astype(np.float32); m = m / (65535. if m.max() > 255 else 255.)
    if m.ndim == 3: m = m[..., 0]
    return np.asarray(Image.fromarray((m * 255).astype(np.uint8)).resize((W, H), Image.BILINEAR), np.float32) / 255


if __name__ == '__main__' and '--key' in sys.argv:
    a_ = sys.argv[sys.argv.index('--key') + 1:]; alpha = float(a_[a_.index('--alpha') + 1]) if '--alpha' in a_ else .70
    im = np.asarray(Image.open(a_[0]).convert('RGB'), np.float32); H, W = im.shape[:2]
    out, al = key_composite(im, a_[1], _load_mask(a_[2], W, H), alpha)
    Image.fromarray(out.clip(0, 255).round().astype(np.uint8)).save(a_[3]); print('KEY_LINES', a_[3], 'line px %.4f' % (al > .05).mean())
    sys.exit(0)
def _exercise():
    global JOB, OUT, CAMS, CARDS
    sys.argv.remove('--exercise')
    JOB = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'job'); OUT = os.path.join(HERE, 'frames'); os.makedirs(OUT, exist_ok=True)
    CAMS = {r['f']: r for r in json.load(open(os.path.join(CS, 'track', 'cameras.json')))['frames']}
    CARDS = {int(k): v for k, v in json.load(open(os.path.join(CS, 'stage2', 'dump', 'cards.json'))).items()}
    rng = sys.argv[2] if len(sys.argv) > 2 else '0-375'; a, b = (int(v) for v in rng.split('-'))


    def euler_m(e):
        x, y, z = e; cx, sx, cy, sy, cz, sz = math.cos(x), math.sin(x), math.cos(y), math.sin(y), math.cos(z), math.sin(z)
        Rx = np.array([[1, 0, 0], [0, cx, -sx], [0, sx, cx]]); Ry = np.array([[cy, 0, sy], [0, 1, 0], [-sy, 0, cy]]); Rz = np.array([[cz, -sz, 0], [sz, cz, 0], [0, 0, 1]])
        return Rz @ Ry @ Rx


    def project(f, pts, W, H):
        r = CAMS[f]; R = euler_m(r['rot_euler_xyz']); o = np.array(r['loc']); fpx = r['lens_mm'] / 36.0 * H; out = []
        for p in pts:
            c = R.T @ (np.array(p) - o)
            if c[2] > -0.01:
                return None
            out.append((W / 2 + fpx * c[0] / -c[2], H / 2 - fpx * c[1] / -c[2]))
        return out


    def hero_alpha(f, W, H):
        c = CARDS.get(f)
        if not c:
            return np.zeros((H, W), np.float32)
        B = lambda v: (v[0], -v[2], v[1])
        tl, tr, bl, br = (B(v) for v in c['corners'])
        q = project(f, [tl, tr, br, bl], W, H)
        if q is None:
            return np.zeros((H, W), np.float32)
        tex = Image.open(os.path.join(CS, 'stage2', 'dump', 'f_%05d.png' % f)).convert('RGBA'); tw, th = tex.size
        src = [(0, 0), (tw, 0), (tw, th), (0, th)]
        A = []
        for (x, y), (u, v) in zip(q, src):
            A.append([x, y, 1, 0, 0, 0, -u * x, -u * y]); A.append([0, 0, 0, x, y, 1, -v * x, -v * y])
        coef = np.linalg.solve(np.array(A, float), np.array([p for s in src for p in s], float))
        al = tex.split()[3].transform((W, H), Image.PERSPECTIVE, tuple(coef), Image.BILINEAR)
        return np.asarray(al, np.float32) / 255


    LINE_A = float(os.environ.get('LINE_A', '.62'))     # .75 opacity x ~0.8 px coverage at 720 wide (the set rule: 0.6 px at 540, alpha .75)


    def wb_lines(pid, psh, W, H):
        """thin object lines from the Workbench pair: a Line object's pixel next to another id (silhouette), or a shading jump inside one id (crease)"""
        I = np.asarray(Image.open(pid).convert('RGB'), np.int16)
        L = np.asarray(Image.open(psh).convert('L'), np.float32) / 255 if os.path.exists(psh) and os.environ.get('CREASE') == '1' else None
        obj = I.sum(-1) > 20; e = np.zeros(obj.shape, bool)
        for dy, dx in ((0, 1), (1, 0), (0, -1), (-1, 0)):
            J = np.roll(I, (dy, dx), (0, 1)); K = np.roll(L, (dy, dx), (0, 1)) if L is not None else None
            same = np.abs(I - J).max(-1) <= 6
            e |= obj & ~same
            if L is not None and (dy, dx) in ((0, 1), (1, 0)):
                e |= obj & same & (np.abs(L - K) > .16)
        e[0, :] = e[-1, :] = False; e[:, 0] = e[:, -1] = False
        a = e.astype(np.float32) * LINE_A
        if a.shape != (H, W):
            a = np.asarray(Image.fromarray((a * 255).astype(np.uint8)).resize((W, H), Image.BILINEAR), np.float32) / 255
        return a


    for f in range(a, b + 1):
        pb, pl = os.path.join(JOB, 'out', 'beauty', 'f_%05d.png' % f), os.path.join(JOB, 'out', 'lines', 'f_%05d.png' % f)
        if not os.path.exists(pb):
            continue
        im = np.asarray(Image.open(pb).convert('RGB'), np.float32); H, W = im.shape[:2]
        pid, psh = os.path.join(JOB, 'out', 'wb', 'f_%05d_id.png' % f), os.path.join(JOB, 'out', 'wb', 'f_%05d_sh.png' % f)
        if os.path.exists(pid):
            al = wb_lines(pid, psh, W, H) * (1 - hero_alpha(f, W, H))
            al = al[..., None]; im = im * (1 - al) + LINE_RGB * al
        elif os.path.exists(pl):
            ln = np.asarray(Image.open(pl).convert('RGBA').resize((W, H)), np.float32) / 255
            al = ln[..., 3:4] * (1 - hero_alpha(f, W, H)[..., None])
            im = im * (1 - al) + ln[..., :3] * 255 * al
        Image.fromarray(im.clip(0, 255).astype(np.uint8)).save(os.path.join(OUT, 'f_%05d.png' % f))
    print('composited', a, b)


if __name__ == '__main__' and '--exercise' in sys.argv:
    _exercise()
