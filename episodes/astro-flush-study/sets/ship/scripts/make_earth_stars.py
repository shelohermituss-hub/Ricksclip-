"""make_earth_stars.py (round 4): the Earth and the star pictures of the ship place, painted to match his look (numpy + PIL + scipy).
  python3 make_earth_stars.py            paint tex/earth.png (8192x4096), out/earth_kit.jpg (4096), tex/stars.png (8192x4096), out/stars_kit.jpg (4096)
  python3 make_earth_stars.py earth|stars   one of them
  python3 make_earth_stars.py measure [f40 f70 ...]   his frames measured by code, beside ours (map simulation + out/stills)
Earth: noise is sampled in 3D on the sphere (no pole pinching, no seam); clouds = domain-warped fbm thresholded into crisp fluffy masses with a soft
pale-blue shade; deep saturated sea, a few soft-edged yellow-green land masses. Unlit look: the material shows the map as emission (bl_ship.py).
Stars: navy-black ground with faint dark purple-red nebula, many small sharp points, density and peak distribution measured on his t_062..t_067."""
import os, sys, math, json
import numpy as np
from PIL import Image
from scipy import ndimage as nd
HERE = os.path.dirname(os.path.abspath(__file__)); SET = os.path.dirname(HERE); TEX = os.path.join(SET, 'tex'); OUTD = os.path.join(SET, 'out')
ROOT = os.path.abspath(os.path.join(SET, '..', '..', '..', '..')); REF = os.path.join(ROOT, 'references', 'look_match', 'astro_flush', 'ref')
os.makedirs(TEX, exist_ok=True); os.makedirs(OUTD, exist_ok=True)
def hx(h): h = h.lstrip('#'); return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], np.float32)
def sstep(a, b, x): t = np.clip((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)

# ------------------------------------------------------------------ 3D value noise on the unit sphere
class Noise3:
    def __init__(self, seed, n=64):
        r = np.random.default_rng(seed); g = r.random((n, n, n)).astype(np.float32)
        self.g = nd.gaussian_filter(g, 0.9, mode='wrap'); self.g = (self.g - self.g.mean()) / (self.g.std() * 6) + .5; self.n = n
        self.off = r.random(3) * n
    def __call__(self, P, f):   # P: (3, ...) unit-sphere points; f: cells per unit
        c = [(P[i] * f + self.off[i]) for i in range(3)]
        return nd.map_coordinates(self.g, c, order=1, mode='grid-wrap', prefilter=False)
def fbm3(nz, P, f, oct, rough=.5, lac=2.03):
    out = np.zeros(P.shape[1:], np.float32); a = 1.; t = 0.
    for o in range(oct): out += a * nz(P, f * lac ** o); t += a; a *= rough
    return out / t
def sphere(W, H):
    lon = (np.arange(W, dtype=np.float32) + .5) / W * 2 * np.pi; lat = np.pi / 2 - (np.arange(H, dtype=np.float32) + .5) / H * np.pi
    cl = np.cos(lat)[:, None]; return np.stack([cl * np.cos(lon)[None], cl * np.sin(lon)[None], np.broadcast_to(np.sin(lat)[:, None], (H, W))]).astype(np.float32)
def norm01(a, lo=1, hi=99): p0, p1 = np.percentile(a[::7, ::7], [lo, hi]); return np.clip((a - p0) / (p1 - p0), 0, 1)
def up(a, W, H): return np.asarray(Image.fromarray(a.astype(np.float32), 'F').resize((W, H), Image.BICUBIC), np.float32)

# ------------------------------------------------------------------ EARTH
SEA_D, SEA_L, SHALLOW = hx('#1450c4'), hx('#1f6fdc'), hx('#38a6ec')
LAND_A, LAND_B, LAND_C = hx('#7fbf3a'), hx('#b4d34a'), hx('#5fa83c')
CLOUD, CSHADE, CDEEP = hx('#fbfdff'), hx('#c4d6ee'), hx('#9fb8dc')
def earth(W=8192, H=4096):
    w2, h2 = W // 2, H // 2; P = sphere(w2, h2)
    # land: a few big masses (low frequency), soft coasts
    nl = Noise3(11); land = fbm3(nl, P, 1.6, 6, .52); land = norm01(land)
    lm = sstep(.60, .70, land)                                 # about a quarter of the globe
    shallow = sstep(.48, .64, land) * (1 - lm)
    lv = fbm3(Noise3(12), P, 6, 4, .55); lv = norm01(lv)
    # clouds: domain warp, then fbm -> thresholded masses; streaks along latitude bands
    nw1, nw2, nw3 = Noise3(21), Noise3(22), Noise3(23)
    wq = np.stack([fbm3(nw1, P, 2.2, 4), fbm3(nw2, P, 2.2, 4), fbm3(nw3, P, 2.2, 4)]) - .5
    Pw = P + wq * 1.25
    nc = Noise3(31); c = fbm3(nc, Pw, 3.2, 6, .55); c = norm01(c)
    wq2 = np.stack([fbm3(nw1, Pw, 9, 3), fbm3(nw2, Pw, 9, 3), fbm3(nw3, Pw, 9, 3)]) - .5
    cf = fbm3(Noise3(32), Pw + wq2 * .25, 14, 4, .6); cf = norm01(cf)   # billowy edges
    cmix = c * .78 + cf * .22
    del wq, wq2
    # up to full size; thresholds at full size keep the edges crisp
    U = lambda a: up(a, W, H)
    cmix, land, lm, shallow, lv = U(cmix), U(land), U(lm), U(shallow), U(lv)
    P2 = sphere(W, H); fine = fbm3(Noise3(33), P2, 40, 3, .6); fine = norm01(fine); del P2
    T = .53; cm = sstep(T, T + .035, cmix + (fine - .5) * .06)              # crisp fluffy masses
    depth = sstep(T, T + .20, nd.gaussian_filter(cmix, 3))                  # thick in the middle
    sh = np.clip(depth * .9 + (fine - .5) * .5 + (cmix - T) * 1.2, 0, 1)
    img = np.empty((H, W, 3), np.float32)
    sv = norm01(nd.gaussian_filter(land, 6))[..., None]
    img[:] = SEA_D * (1 - sv) + SEA_L * sv
    img = img * (1 - shallow[..., None] * .85) + SHALLOW * shallow[..., None] * .85
    g = (LAND_A * (1 - lv[..., None]) + LAND_B * lv[..., None]); g = g * (1 - sstep(.6, .9, land)[..., None] * .35) + LAND_C * sstep(.6, .9, land)[..., None] * .35
    lm3 = nd.gaussian_filter(lm, 2.5)[..., None]; img = img * (1 - lm3) + g * lm3
    cs = np.roll(np.roll(cm, 9, 0), 12, 1)[..., None]; img *= 1 - .22 * cs * (1 - cm[..., None])   # faint cloud shadow on the ground
    cc = CDEEP * (1 - sh[..., None]) + CSHADE * sh[..., None]; cc = cc * (1 - sstep(.45, .85, sh)[..., None]) + CLOUD * sstep(.45, .85, sh)[..., None]
    img = img * (1 - cm[..., None]) + cc * cm[..., None]
    im = Image.fromarray(np.clip(img + .5, 0, 255).astype(np.uint8)); im.save(os.path.join(TEX, 'earth.png'), compress_level=1)
    im.resize((4096, 2048), Image.LANCZOS).save(os.path.join(OUTD, 'earth_kit.jpg'), quality=90)
    print('earth: cloud cover %.2f, land %.2f (of the globe, area weighted)' % (aw(cm), aw(lm * (1 - cm))))
def aw(m):
    H = m.shape[0]; w = np.cos(np.pi / 2 - (np.arange(H) + .5) / H * np.pi)[:, None]; return float((m * w).sum() / (w.sum() * m.shape[1]))

# ------------------------------------------------------------------ STARS
BG, NEB1, NEB2 = hx('#00001a'), hx('#2a0b24'), hx('#140a30')
def star_list(seed=7):
    r = np.random.default_rng(seed)
    N = 56000; z = r.uniform(-1, 1, N); lat = np.arcsin(z); lon = r.uniform(0, 2 * np.pi, N); u = r.random(N)
    # peak classes measured on his frames (per MP: >.06 ~700, >.2 ~450, >.5 ~290, >.8 ~215)
    amp = np.where(u < .30, r.uniform(1.6, 3.5, N), np.where(u < .40, r.uniform(.7, 1.3, N), np.where(u < .62, r.uniform(.28, .6, N), r.uniform(.10, .26, N))))
    big = (u < .30) & (r.random(N) < .12)                                         # a few bright ones with a tiny glow
    col = np.ones((N, 3), np.float32); t = r.random(N); col[t < .07] = (.78, .85, 1.); col[(t >= .07) & (t < .11)] = (1., .9, .78)
    return lat, lon, amp, big, col
def stars_paint(W, H, sig=.62):
    r = np.random.default_rng(51); P = sphere(W // 8, H // 8)
    n1 = norm01(fbm3(Noise3(51), P + (np.stack([fbm3(Noise3(53), P, 2, 3)] * 3) - .5), 1.8, 5, .55)); n2 = norm01(fbm3(Noise3(52), P, 2.4, 5, .55))
    a1 = sstep(.55, .95, n1) ** 1.4; a2 = sstep(.6, .95, n2) ** 1.6
    neb = a1[..., None] * (NEB1 - BG) * .55 + a2[..., None] * (NEB2 - BG) * .45
    img = BG + np.stack([up(neb[..., k], W, H) for k in range(3)], -1)
    star = np.zeros((H, W), np.float32); colimg = np.ones((H, W, 3), np.float32)
    lat, lon, amp, big, col = star_list()
    s0 = sig * W / 8192
    for i in range(len(lat)):
        cx = lon[i] / (2 * np.pi) * W; cy = (.5 - lat[i] / np.pi) * H; cl = max(.05, math.cos(lat[i]))
        sg = s0 * (1.25 if big[i] else 1.) ; sx = sg / cl; rx = int(min(200, 3.5 * sx + 2)); ry = int(3.5 * sg + 2)
        if big[i]: rx, ry = int(min(200, 5 * sg * 3 / cl + 2)), int(5 * sg * 3 + 2)
        y0, x0 = int(cy), int(cx); ys = np.arange(max(0, y0 - ry), min(H, y0 + ry + 1)); xs = np.arange(x0 - rx, x0 + rx + 1)
        dy = (ys[:, None] - cy) ** 2; dx = (xs[None, :] - cx) ** 2 * cl * cl
        g = amp[i] * np.exp(-(dy + dx) / (2 * sg * sg))
        if big[i]: g = g + .10 * np.exp(-(dy + dx) / (2 * (sg * 3) ** 2))
        xi = xs % W; cur = star[ys[:, None], xi[None, :]]; m = g > cur
        star[ys[:, None], xi[None, :]] = np.where(m, g, cur)
        if (col[i] != 1).any(): colimg[ys[:, None], xi[None, :]] = np.where(m[..., None], col[i], colimg[ys[:, None], xi[None, :]])
    img = img + np.minimum(star, 1)[..., None] * colimg * 255
    return Image.fromarray(np.clip(img + .5, 0, 255).astype(np.uint8))
def stars():
    stars_paint(8192, 4096).save(os.path.join(TEX, 'stars.png'), compress_level=1)
    stars_paint(4096, 2048, sig=.62 * 1.35).save(os.path.join(OUTD, 'stars_kit.jpg'), quality=92)
    print('stars painted')

# ------------------------------------------------------------------ MEASURE (his frames by code, ours beside)
def star_stats(a):
    L = a @ np.float32([.2126, .7152, .0722]); b = nd.median_filter(L, 11); d = L - b; sky = nd.minimum_filter(b < .10, 25); mp = max(sky.sum() / 1e6, 1e-6)
    mx = (d == nd.maximum_filter(d, 5)) & sky; cnt = {t: int(((d > t) & mx).sum() / mp) for t in (.06, .2, .5, .8)}
    lab, n = nd.label((d > .15) & sky); area = np.median(nd.sum(np.ones_like(d), lab, range(1, n + 1))) if n else 0
    bg = np.median(a[sky & (d < .03)], 0) * 255 if (sky & (d < .03)).any() else np.zeros(3)
    return cnt, area, '#%02x%02x%02x' % tuple(bg.astype(int)), float(np.percentile(L[sky], 1)) if sky.any() else 0, mp
def earth_stats(a):
    mx, mn = a.max(2), a.min(2); s = (mx - mn) / np.maximum(mx, 1e-3); r, g, b = a[..., 0], a[..., 1], a[..., 2]
    cl = (mn > .70) & (s < .25); sea = (b > r + .25) & (b >= g) & (mx > .35) & ~cl; land = (g > b + .03) & (g > r) & (mx > .35) & ~cl
    tot = max((cl | sea | land).sum(), 1); h = lambda m: '#%02x%02x%02x' % tuple((np.median(a[m], 0) * 255).astype(int)) if m.any() else '-'
    return h(sea), h(land), h(cl), cl.sum() / tot, land.sum() / tot
def gnomonic(eq, vfov=45, W=1080, H=1920, yaw=0., pitch=10.):
    th = math.tan(math.radians(vfov) / 2); ys, xs = np.mgrid[0:H, 0:W].astype(np.float32)
    v = np.stack([(xs + .5 - W / 2) / (H / 2) * th, -(ys + .5 - H / 2) / (H / 2) * th, -np.ones_like(xs)]); v /= np.linalg.norm(v, axis=0)
    p, yw = math.radians(pitch), math.radians(yaw); y2 = v[1] * math.cos(p) + v[2] * math.sin(p); z2 = -v[1] * math.sin(p) + v[2] * math.cos(p)
    lon = (np.arctan2(v[0], -z2) + yw) % (2 * np.pi); lat = np.arcsin(np.clip(y2, -1, 1)); Hh, Ww = eq.shape[:2]
    c = [(.5 - lat / np.pi) * Hh - .5, lon / (2 * np.pi) * Ww - .5]
    return np.stack([nd.map_coordinates(eq[..., k], c, order=1, mode='grid-wrap') for k in range(3)], -1)
def ld(p, size=None):
    im = Image.open(p).convert('RGB')
    if size: im = im.resize(size, Image.BICUBIC)
    return np.asarray(im, np.float32) / 255
def measure(keys):
    print('HIS stars (1080x1920):')
    for i in (45, 62, 64, 66):
        c, ar, bg, p1, mp = star_stats(ld(os.path.join(REF, 'full2', 't_%03d.jpg' % i))); print('  t_%03d stars/MP >.06/.2/.5/.8 %s  blob area %.1f px  bg %s  sky p1 %.4f' % (i, list(c.values()), ar, bg, p1))
    sp = os.path.join(TEX, 'stars.png')
    if os.path.exists(sp):
        eq = np.asarray(Image.open(sp).convert('RGB'), np.float32) / 255
        for yaw in (0, 120, 240):
            c, ar, bg, p1, mp = star_stats(gnomonic(eq, 45, yaw=yaw)); print('  OURS map seen by a 45 deg lens, yaw %3d: stars/MP %s  blob area %.1f  bg %s  p1 %.4f' % (yaw, list(c.values()), ar, bg, p1))
        del eq
    print('HIS earth (t_005..t_008 lower part) sea / land / cloud hex, cloud share, land share:')
    for i in (5, 6, 7, 8):
        a = ld(os.path.join(REF, 'full2', 't_%03d.jpg' % i))[1150:]; print('  t_%03d' % i, earth_stats(a))
    ep = os.path.join(TEX, 'earth.png')
    if os.path.exists(ep):
        eq = np.asarray(Image.open(ep).convert('RGB').resize((4096, 2048)), np.float32) / 255
        for yaw in (0, 90, 200):
            print('  OURS map, 45 deg view below the equator yaw %d' % yaw, earth_stats(gnomonic(eq, 45, 540, 960, yaw=yaw, pitch=-5)))
    for k in keys:
        f = os.path.join(OUTD, 'stills', 'ship_%s.png' % k)
        if not os.path.exists(f): continue
        o = ld(f, (1080, 1920)); h = ld(os.path.join(REF, 'all', 'f_%04d.jpg' % (int(k[1:]) + 1)), (1080, 1920))
        so, sh = star_stats(o), star_stats(h); eo, eh = earth_stats(o), earth_stats(h)
        print('%s stars/MP ours %s his %s | blob %.1f/%.1f | bg %s/%s | earth ours %s his %s' % (k, list(so[0].values()), list(sh[0].values()), so[1], sh[1], so[2], sh[2], eo, eh))

if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == 'measure': measure(a[1:] or ['f40', 'f70', 'f110', 'f990'])
    elif a: [globals()[n]() for n in a]
    else: earth(); stars()
