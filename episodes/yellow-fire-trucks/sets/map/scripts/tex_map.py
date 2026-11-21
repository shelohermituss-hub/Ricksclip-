# tex_map.py: paints every printed surface of PLACE C, THE MAP (PIL, outside Blender). Re-runnable; same input -> same bytes (seeded, no dates).
# python3 tex_map.py <assets/map dir> <build/tex out dir> [ppm]
#  map_print.jpg (32 x 20 m paper at ppm px/m, default 256 = 8192 x 5120), map_print_4k.jpg (kit), inset_pine.jpg + inset_dallas.jpg (3.2 x 3.2 m at 640 px/m,
#  the same drawing at close range: the sink to Pine Hollow and the glide to DALLAS), sand_dallas.png (S4->S5 blend), signs.png (station sign atlas),
#  door.png, wall.png, roof.png, tex_meta.json (inset windows, sign cells). Prints TEX_END.
import sys, os, json, math, random
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE); import map_geo as G
A, OUT = sys.argv[1], sys.argv[2]; PPM = int(sys.argv[3]) if len(sys.argv) > 3 else 256; os.makedirs(OUT, exist_ok=True)
HAND = os.path.join(A, 'fonts', 'patrick-hand-latin-400-normal.woff'); TITLE = os.path.join(A, 'fonts', 'righteous-latin-400-normal.woff')
SERIF = '/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf'; BOLD = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
STATES = G.load_states(os.path.join(A, 'us-atlas', 'states-10m.json'))
PAPER = Image.open(os.path.join(A, 'acg', 'Paper001', 'Paper001_2K-JPG_Color.jpg')).convert('L')
# palette: no red, no yellow, no teal on a set (LOOK_BIBLE). Water cornflower-pale, land pastel 1970s tints, highways navy.
CREAM = (241, 233, 212); WATER = (182, 205, 236); WATER_LINE = (140, 170, 222); GREYLAND = (226, 221, 207)
TINTS = [(241, 214, 196), (216, 228, 192), (233, 210, 226), (238, 228, 200), (212, 221, 236), (232, 218, 190)]
NAVY = (39, 54, 90); INK = (31, 35, 56); BROWN = (132, 86, 58); ROAD = (150, 138, 126); PLUM = (122, 104, 140); RIVER = (96, 136, 214); PENCIL = (88, 86, 92)
COFFEE = (150, 104, 66)
STATIONS = G.stations(); SNAMES = [s[0] for s in STATIONS]
def font(p, px): return ImageFont.truetype(p, max(6, int(px)))
class Canvas:
    def __init__(s, win, ppm):
        s.x0, s.y0, s.x1, s.y1 = win; s.ppm = ppm; s.W = int(round((s.x1 - s.x0) * ppm)); s.H = int(round((s.y1 - s.y0) * ppm))
        s.im = Image.new('RGB', (s.W, s.H), WATER); s.d = ImageDraw.Draw(s.im, 'RGBA')
    def P(s, x, y): return ((x - s.x0) * s.ppm, (s.y1 - y) * s.ppm)
    def w(s, m): return max(1, int(round(m * s.ppm)))
    def line(s, pts, col, wm, joint='curve'): s.d.line([s.P(*p) for p in pts], fill=col, width=s.w(wm), joint=joint)
    def poly(s, pts, col, outline=None): s.d.polygon([s.P(*p) for p in pts], fill=col, outline=outline)
    def dot(s, x, y, rm, col, outline=None, ow=0):
        px, py = s.P(x, y); r = rm * s.ppm; s.d.ellipse([px - r, py - r, px + r, py + r], fill=col, outline=outline, width=s.w(ow) if ow else 0)
    def text(s, x, y, t, hm, col=INK, f=HAND, anchor='mm', halo=CREAM, hw=.18, spacing=0):
        fo = font(f, hm * s.ppm)
        if spacing: t = (' ' * spacing).join(t)
        s.d.text(s.P(x, y), t, font=fo, fill=col, anchor=anchor, stroke_width=max(1, int(hm * s.ppm * hw)) if halo else 0, stroke_fill=halo)
    def dashed(s, pts, col, wm, dm, gm):
        acc = 0; on = True; seg = [pts[0]]
        for a, b in zip(pts, pts[1:]):
            L = math.hypot(b[0] - a[0], b[1] - a[1]); t = 0
            while t < L:
                lim = (dm if on else gm) - acc; step = min(lim, L - t); t += step; acc += step
                p = (a[0] + (b[0] - a[0]) * t / L, a[1] + (b[1] - a[1]) * t / L)
                if on: seg.append(p)
                if acc >= (dm if on else gm) - 1e-9:
                    if on and len(seg) > 1: s.line(seg, col, wm)
                    on = not on; acc = 0; seg = [p]
        if on and len(seg) > 1: s.line(seg, col, wm)
def proj_ring(r): return [G.ll(lo, la) for lo, la in r]
RINGS = {f: (n, [proj_ring(r) for r in rs]) for f, (n, rs) in STATES.items()}
def area(r): return .5 * sum(a[0] * b[1] - b[0] * a[1] for a, b in zip(r, r[1:] + r[:1]))
rnd0 = random.Random(7)
SMALL = []          # small towns (unlabelled dots) inside the US, seeded
def inside_us_fn():
    m = Image.new('L', (1600, 1000), 0); dm = ImageDraw.Draw(m)          # 50 px per metre raster of the lower 48
    for _, rs in RINGS.values():
        for r in rs: dm.polygon([((x + 16) * 50, (10 - y) * 50) for x, y in r], fill=255)
    a = np.asarray(m)
    return lambda x, y: a[min(999, max(0, int((10 - y) * 50))), min(1599, max(0, int((x + 16) * 50)))] > 0
INUS = inside_us_fn()
while len(SMALL) < 420:
    x, y = rnd0.uniform(-12.8, 12.8), rnd0.uniform(-7.3, 8.9)
    if INUS(x, y): SMALL.append((x, y))
CITYXY = {c: G.ll(*v) for c, v in G.CITIES.items()}
def near_roads():
    pts = SMALL + list(CITYXY.values()); out = []
    for i, p in enumerate(SMALL):
        d = sorted(((math.hypot(p[0] - q[0], p[1] - q[1]), q) for q in pts if q is not p), key=lambda t: t[0])[:2]
        for L, q in d:
            if L < 1.6: out.append((p, q))
    return out
LOCAL = near_roads()
USROUTES = []
cl = list(CITYXY.items())
for c, p in cl:
    d = sorted(((math.hypot(p[0] - q[0], p[1] - q[1]), q) for k, q in cl if k != c), key=lambda t: t[0])[:2]
    USROUTES += [(p, q) for L, q in d if L < 4.0]
USROUTES += [(CITYXY['PINE HOLLOW'], CITYXY['SPRINGFIELD']), (CITYXY['PINE HOLLOW'], CITYXY['LITTLE ROCK'])]
RIVERS = [[(-111.6, 43.6), (-110.6, 45.6), (-108.5, 47.6), (-104.0, 48.0), (-100.8, 46.8), (-98.4, 43.1), (-96.4, 42.5), (-95.9, 41.3), (-94.6, 39.1), (-92.2, 38.6), (-90.2, 38.8)],
          [(-95.2, 47.2), (-93.3, 45.0), (-91.3, 43.4), (-90.6, 41.5), (-91.4, 40.4), (-90.2, 38.6), (-89.2, 37.0), (-90.1, 35.1), (-91.0, 33.4), (-91.4, 31.3), (-90.1, 29.95), (-89.4, 29.1)],
          [(-80.0, 40.4), (-81.6, 39.4), (-82.6, 38.6), (-84.5, 39.1), (-85.8, 38.25), (-87.6, 37.9), (-89.2, 37.0)],
          [(-106.0, 40.0), (-108.6, 39.1), (-110.1, 38.2), (-111.6, 36.9), (-112.4, 36.2), (-113.9, 36.1), (-114.6, 35.0), (-114.6, 32.7)],
          [(-117.0, 49.0), (-118.0, 46.6), (-119.3, 46.2), (-121.0, 45.6), (-122.7, 45.6), (-124.0, 46.25)],
          [(-106.6, 37.8), (-106.7, 35.1), (-106.5, 31.8), (-104.5, 29.7), (-103.0, 29.0), (-101.4, 29.8), (-99.5, 27.5), (-97.2, 25.95)],
          [(-101.8, 34.6), (-97.5, 33.8), (-95.0, 33.7), (-94.0, 33.5), (-93.5, 31.2), (-92.0, 31.0)]]
LAKES = [(-87.5, 47.6, 3.0, .75, 8), (-82.3, 44.9, 1.15, 1.35, -15), (-81.3, 42.2, 2.2, .42, 25), (-77.9, 43.6, 1.7, .38, 10), (-87.0, 43.9, .62, 2.05, 0), (-112.5, 41.1, .4, .55, 0)]
def masks(cv, sub=4):
    W, H = cv.W // sub, cv.H // sub; xs = cv.x0 + (np.arange(W) + .5) / W * (cv.x1 - cv.x0); ys = cv.y1 - (np.arange(H) + .5) / H * (cv.y1 - cv.y0)
    X, Y = np.meshgrid(xs, ys); lon, lat = G.inv(X, Y)
    west = (lat > 48.95) & (lon > -123.6) & (lon < -94.5)
    east = (lat > 45.0) & (lon >= -94.5) & (lon < -66.8) & ~((lon > -70.0) & (lat < 44.8))
    ontario = (lat > 41.7) & (lon > -83.6) & (lon < -74.5) & (lat < 46)
    canada = west | east | ontario
    mexico = (lat < 32.7) & (lon > -114.8) & (lon < -97.2) & ~((lon > -97.9) & (lat < 26.2))
    lake = np.zeros_like(canada)
    for lo, la, rx, ry, rot in LAKES:
        c, s_ = math.cos(math.radians(rot)), math.sin(math.radians(rot)); dx, dy = lon - lo, lat - la
        lake |= ((dx * c + dy * s_) / rx) ** 2 + ((-dx * s_ + dy * c) / ry) ** 2 < 1
    def up(m): return Image.fromarray((m * 255).astype(np.uint8)).resize((cv.W, cv.H), Image.BILINEAR).filter(ImageFilter.GaussianBlur(1))
    return up(canada & ~lake), up(mexico), up(lake)
NATION = []
def nation_rings():
    d = json.load(open(os.path.join(A, 'us-atlas', 'states-10m.json'))); sx, sy = d['transform']['scale']; tx, ty = d['transform']['translate']; arcs = []
    for a in d['arcs']:
        x = y = 0; pts = []
        for dx, dy in a: x += dx; y += dy; pts.append((x * sx + tx, y * sy + ty))
        arcs.append(pts)
    for g in d['objects']['nation']['geometries']:
        for p in (g['arcs'] if g['type'] == 'MultiPolygon' else [g['arcs']]):
            for r in p:
                pts = []
                for i in r: q = arcs[i] if i >= 0 else arcs[~i][::-1]; pts += q
                if all(-126 < lo < -66 and 24 < la < 50 for lo, la in pts[::50]): NATION.append(proj_ring(pts))
nation_rings()
def paper_base(cv):
    t = int(2.0 * cv.ppm); tile = PAPER.resize((t, t)); arr = np.asarray(tile, np.float32) / 244.
    big = np.tile(arr, (cv.H // t + 1, cv.W // t + 1))[:cv.H, :cv.W]
    # large soft stains / ageing (seeded low-frequency noise)
    rs = np.random.RandomState(3); lo = rs.rand(12, 20).astype(np.float32); lo = np.asarray(Image.fromarray((lo * 255).astype(np.uint8)).resize((cv.W, cv.H), Image.BICUBIC), np.float32) / 255
    return big * (.965 + .05 * lo)
def draw(cv, extra=True):
    d = cv.d
    # coast lining: concentric water lines around the US coast (the 1970s engraved look)
    for k, wm in enumerate((.42, .30, .20, .12)):
        for r in NATION: cv.line(r + r[:1], WATER_LINE if k % 2 == 0 else WATER, wm * 2)
    ca, mx, lk = masks(cv)
    cv.im.paste(Image.new('RGB', (cv.W, cv.H), GREYLAND), (0, 0), ca); cv.im.paste(Image.new('RGB', (cv.W, cv.H), GREYLAND), (0, 0), mx)
    for i, (f, (n, rs)) in enumerate(sorted(RINGS.items())):
        for r in rs: cv.poly(r, TINTS[int(f) % len(TINTS)])
    cv.im.paste(Image.new('RGB', (cv.W, cv.H), WATER), (0, 0), lk)
    # relief hachures (Rockies, Sierra-Cascades, Appalachians, Ozarks)
    rr = random.Random(11)
    for (lo0, lo1, la0, la1, n) in [(-115, -104.5, 35, 48.5, 900), (-123, -118.5, 36, 48.5, 380), (-84.5, -76, 34.5, 42.5, 420), (-94.5, -91.5, 35.3, 37.2, 120)]:
        for _ in range(n):
            lo, la = rr.uniform(lo0, lo1), rr.uniform(la0, la1); x, y = G.ll(lo, la); s = rr.uniform(.06, .13)
            if not INUS(x, y): continue
            cv.line([(x - s, y - s * .55), (x, y + s * .3), (x + s, y - s * .55)], (150, 128, 112, 150), .012)
    for rv in RIVERS: cv.line(G.wiggle([G.ll(*p) for p in rv], 8, .12, len(rv)), RIVER, .03)
    for r in NATION: cv.line(r + r[:1], (110, 98, 120), .028)
    for f, (n, rs) in RINGS.items():
        for r in rs:
            if abs(area(r)) > .01: cv.dashed(r + r[:1], PLUM, .016, .09, .05)
    for p, q in LOCAL: cv.line(G.wiggle([p, q], 6, .06, int(p[0] * 99)), ROAD, .011)
    for x, y in SMALL: cv.dot(x, y, .022, (250, 246, 236), INK, .008)
    for p, q in USROUTES: cv.line(G.wiggle([p, q], 8, .1, int(p[1] * 77)), BROWN, .024)
    # interstates: navy casing, cream core (dual carriageway), shields every ~3 m
    hw = {}
    for num, chain in G.HIGHWAYS.items(): hw[num] = G.wiggle([CITYXY[c] for c in chain], 10, .07, int(num))
    for pts in hw.values(): cv.line(pts, NAVY, .085)
    for pts in hw.values(): cv.line(pts, (246, 240, 226), .034)
    for num, pts in hw.items():
        acc = 1.2
        for a, b in zip(pts, pts[1:]):
            acc += math.hypot(b[0] - a[0], b[1] - a[1])
            if acc > 3.1:
                acc = 0; x, y = (a[0] + b[0]) / 2, (a[1] + b[1]) / 2; s = .13
                cv.poly([(x - s, y + s * .9), (x + s, y + s * .9), (x + s * .95, y - s * .1), (x, y - s), (x - s * .95, y - s * .1)], NAVY, (246, 240, 226))
                cv.text(x, y + .02, num, .13, (246, 240, 226), BOLD, halo=None)
    # mileage numbers on the US routes
    for i, (p, q) in enumerate(USROUTES[::2]):
        L = math.hypot(q[0] - p[0], q[1] - p[1]) * 167; cv.text((p[0] + q[0]) / 2 + .1, (p[1] + q[1]) / 2 + .08, str(int(L / 10) * 10 + 6), .1, BROWN, SERIF, halo=CREAM, hw=.12)
    # state names, spaced capitals (at the ring's mean point, big rings only)
    for f, (n, rs) in RINGS.items():
        r = max(rs, key=lambda r: abs(area(r)))
        if abs(area(r)) < 1.0 or n in ('District of Columbia',): continue
        x = sum(p[0] for p in r) / len(r); y = sum(p[1] for p in r) / len(r); h = .26 if abs(area(r)) > 4 else .17
        cv.text(x, y - .45, n.upper(), h, PLUM, TITLE, halo=None, spacing=1 if len(n) < 9 else 0)
    # cities: dot + label (stations' dots sit under their apron); Pine Hollow and Dallas bigger
    for c, (x, y) in CITYXY.items():
        big = c in ('DALLAS', 'PINE HOLLOW'); cv.dot(x, y, .075 if big else .055, (250, 246, 236), INK, .022)
        cv.dot(x, y, .025, INK); h = .30 if c == 'DALLAS' else (.2 if big else .15)
        cv.text(x, y - .2 - h * .45, c, h, INK, HAND, hw=.22)
    for t, lo, la, h in [('PACIFIC OCEAN', -126.0, 35.0, .36), ('ATLANTIC OCEAN', -71.0, 33.5, .36), ('GULF OF MEXICO', -90.5, 26.6, .36), ('CANADA', -101, 50.6, .5), ('MEXICO', -106.5, 29.0, .5)]:
        x, y = G.ll(lo, la); cv.text(x, y, t, h, (78, 96, 150) if 'O' in t[:1] or 'G' in t[:1] else PLUM, SERIF if 'OCEAN' in t or 'GULF' in t else TITLE, halo=None, spacing=1)
    # Pine Hollow town plan (prints under the home station model: the paper lines become its yard, S3 -> S4)
    px, py = CITYXY["PINE HOLLOW"]; my = py + .0
    for k in range(-3, 4): cv.line([(px - .8, my + k * .2), (px + .8, my + k * .2)], (236, 230, 216) if k else (250, 246, 236), .035 if k else .07)
    for k in range(-4, 3): cv.line([(px + .5 + k * .22, py - .55), (px + .5 + k * .22, py + .85)], (236, 230, 216), .03 if k else .06)
    for k in range(-3, 4): cv.line([(px - .8, my + k * .2), (px + .8, my + k * .2)], ROAD, .005)
    cv.poly([(px + .56, my - .05), (px + .8, my - .05), (px + .8, my - .5), (px + .56, my - .5)], (190, 214, 170))
    for i in range(9): cv.dot(px + .6 + (i * .37) % .18, my - .12 - (i * .23) % .34, .025, (120, 160, 110))
    cv.text(px - .55, my + .045, 'MAIN ST', .05, INK, BOLD, halo=None); cv.text(px + .56, py + .75, 'ELM ST', .05, INK, BOLD, halo=None)
    cv.text(px + .68, my - .56, 'PARK', .05, INK, BOLD, halo=None); cv.dot(px + .2, my + .95, .04, (160, 160, 150), INK, .006); cv.text(px + .2, my + 1.03, 'WATER TOWER', .035, INK, BOLD, halo=None)
    # compass rose (Atlantic), engraved style
    cx, cy = 13.4, -1.6
    for k in range(32):
        a = k * math.pi / 16; L = 1.15 if k % 8 == 0 else (.8 if k % 4 == 0 else (.55 if k % 2 == 0 else .38))
        w = .12 if k % 8 == 0 else .07; a1, a2 = a + math.pi / 2, a - math.pi / 2
        pts = [(cx + math.cos(a) * L, cy + math.sin(a) * L), (cx + math.cos(a1) * w, cy + math.sin(a1) * w), (cx + math.cos(a2) * w, cy + math.sin(a2) * w)]
        cv.poly(pts, NAVY if k % 2 == 0 else (246, 240, 226), NAVY)
    for rr_ in (.95, 1.0, 1.25): cv.dot(cx, cy, rr_, None, NAVY, .012)
    cv.text(cx, cy + 1.45, 'N', .3, NAVY, TITLE, halo=None)
    # title block (lower left) and legend (lower right): words in the world (PICTURE_PLAN row 22: U.S.A. ROAD MAP, 1970s)
    def boxed(x0, y0, x1, y1):
        cv.poly([(x0, y0), (x1, y0), (x1, y1), (x0, y1)], (246, 240, 226)); cv.line([(x0, y0), (x1, y0), (x1, y1), (x0, y1), (x0, y0)], NAVY, .05)
        cv.line([(x0 + .1, y0 + .1), (x1 - .1, y0 + .1), (x1 - .1, y1 - .1), (x0 + .1, y1 - .1), (x0 + .1, y0 + .1)], NAVY, .015)
    boxed(-15.3, -9.45, -8.7, -6.1); cv.text(-12.0, -7.05, 'U.S.A. ROAD MAP', .78, NAVY, TITLE, halo=None)
    cv.text(-12.0, -8.05, '1970s', .62, (66, 92, 160), TITLE, halo=None); cv.line([(-14.7, -7.55), (-9.3, -7.55)], NAVY, .02)
    cv.text(-12.0, -8.85, 'INTERSTATE EDITION', .26, INK, BOLD, halo=None, spacing=0)
    boxed(10.9, -9.45, 15.3, -6.4); cv.text(13.1, -6.75, 'LEGEND', .3, NAVY, TITLE, halo=None)
    cv.line([(11.3, -7.3), (12.2, -7.3)], NAVY, .085); cv.line([(11.3, -7.3), (12.2, -7.3)], (246, 240, 226), .034); cv.text(12.4, -7.3, 'INTERSTATE', .2, INK, BOLD, 'lm', halo=None)
    cv.line([(11.3, -7.8), (12.2, -7.8)], BROWN, .024); cv.text(12.4, -7.8, 'U.S. ROUTE', .2, INK, BOLD, 'lm', halo=None)
    cv.dashed([(11.3, -8.3), (12.2, -8.3)], PLUM, .016, .09, .05); cv.text(12.4, -8.3, 'STATE LINE', .2, INK, BOLD, 'lm', halo=None)
    cv.poly([(11.5, -8.95), (11.95, -8.95), (11.95, -8.65), (11.72, -8.5), (11.5, -8.65)], (234, 216, 172), NAVY); cv.text(12.4, -8.8, 'FIRE STATION', .2, INK, BOLD, 'lm', halo=None)
    for i in range(4):   # scale bar
        x0 = -8.2 + i * .9; cv.poly([(x0, -9.2), (x0 + .9, -9.2), (x0 + .9, -9.05), (x0, -9.05)], NAVY if i % 2 == 0 else (246, 240, 226), NAVY)
        cv.text(x0, -8.85, str(i * 150), .14, INK, BOLD, halo=None)
    cv.text(-4.4, -9.12, 'MILES', .16, INK, BOLD, 'lm', halo=None)
    # border: double frame with grid letters and numbers
    m = .35; cv.line([(-16 + m, -10 + m), (16 - m, -10 + m), (16 - m, 10 - m), (-16 + m, 10 - m), (-16 + m, -10 + m)], NAVY, .05)
    m2 = .6; cv.line([(-16 + m2, -10 + m2), (16 - m2, -10 + m2), (16 - m2, 10 - m2), (-16 + m2, 10 - m2), (-16 + m2, -10 + m2)], NAVY, .02)
    for i in range(16):
        x = -15.4 + (i + .5) * 30.8 / 16; cv.text(x, 9.53, str(i + 1), .17, NAVY, BOLD, halo=None); cv.text(x, -9.53, str(i + 1), .17, NAVY, BOLD, halo=None)
        if i: cv.line([(-15.4 + i * 30.8 / 16, 9.4), (-15.4 + i * 30.8 / 16, 9.65)], NAVY, .015); cv.line([(-15.4 + i * 30.8 / 16, -9.4), (-15.4 + i * 30.8 / 16, -9.65)], NAVY, .015)
    for j in range(10):
        y = -9.4 + (j + .5) * 18.8 / 10; ch = 'ABCDEFGHJK'[9 - j]; cv.text(-15.53, y, ch, .17, NAVY, BOLD, halo=None); cv.text(15.53, y, ch, .17, NAVY, BOLD, halo=None)
    if not extra: return
    # evidence on the paper: coffee ring, pencil circle round DALLAS, pencil route from home, a note, tick marks at the painted cities, crease wear, tape
    for k in range(3):
        cv.dot(-3.2, 3.4, 1.05 - k * .03, None, COFFEE + (70 - k * 20,), .03 + k * .02)
    dx, dy = CITYXY['DALLAS']; pts = [(dx + 1.1 * math.cos(a) * (1 + .05 * math.sin(a * 3)), dy - .3 + .62 * math.sin(a)) for a in np.linspace(.3, 2 * math.pi + .7, 60)]
    cv.line(pts, PENCIL + (210,), .022)
    route = G.wiggle([CITYXY[c] for c in G.HOME_ROUTE], 10, .03, 5); cv.dashed([(x + .13, y + .1) for x, y in route], PENCIL + (200,), .016, .12, .08)
    hx, hy = CITYXY['PINE HOLLOW']; cv.text(hx + 1.9, hy + 1.75, 'OUR TOWN', .36, PENCIL, HAND, halo=None)
    cv.line([(hx + 1.6, hy + 1.4), (hx + .9, hy + 1.0)], PENCIL + (220,), .02); cv.line([(hx + .9, hy + 1.0), (hx + 1.1, hy + 1.0)], PENCIL, .02); cv.line([(hx + .9, hy + 1.0), (hx + .98, hy + 1.18)], PENCIL, .02)
    for c, x, y in STATIONS[2:]:
        cv.line([(x + .32, y - .36), (x + .38, y - .44), (x + .52, y - .22)], PENCIL + (190,), .018)
    pw, ph = G.MAP_W / G.PANELS[0], G.MAP_H / G.PANELS[1]
    for i in range(1, G.PANELS[0]):
        x = -16 + i * pw; cv.line([(x, -10), (x, 10)], (255, 255, 250, 110), .02); cv.line([(x + .03, -10), (x + .03, 10)], (90, 80, 70, 40), .03)
    for j in range(1, G.PANELS[1]):
        y = -10 + j * ph; cv.line([(-16, y), (16, y)], (255, 255, 250, 110), .02); cv.line([(-16, y - .03), (16, y - .03)], (90, 80, 70, 40), .03)
    for i in range(1, G.PANELS[0]):
        for j in range(1, G.PANELS[1]): cv.dot(-16 + i * pw, -10 + j * ph, .07, (252, 250, 244, 200))
    for (x, y, a) in [(-8.0, 5.0, 35), (8.0, -5.0, -20)]:
        c, s_ = math.cos(math.radians(a)), math.sin(math.radians(a)); L, Wt = .75, .22
        cv.poly([(x + c * L - s_ * Wt, y + s_ * L + c * Wt), (x - c * L - s_ * Wt, y - s_ * L + c * Wt), (x - c * L + s_ * Wt, y - s_ * L - c * Wt), (x + c * L + s_ * Wt, y + s_ * L - c * Wt)], (222, 206, 160, 170))
def render(win, ppm, name, q=90):
    cv = Canvas(win, ppm); base = paper_base(cv)
    # the paper ground under everything, then the print
    draw(cv); arr = np.asarray(cv.im, np.float32) * base[..., None]; im = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    im.save(os.path.join(OUT, name), quality=q); return im
full = render((-16, -10, 16, 10), PPM, 'map_print.jpg', 88); full.resize((4096, 2560), Image.LANCZOS).save(os.path.join(OUT, 'map_print_4k.jpg'), quality=86)
print('MAP_PRINT', full.size, flush=True)
INS = {}
for key, city, oy in (('pine', 'PINE HOLLOW', .25), ('dallas', 'DALLAS', -.15)):
    x, y = CITYXY[city]; win = (round(x - 1.6, 3), round(y + oy - 1.6, 3), round(x + 1.6, 3), round(y + oy + 1.6, 3)); render(win, 640, 'inset_%s.jpg' % key, 90); INS[key] = win
    print('INSET', key, win, flush=True)
# sand for the S4 -> S5 join (the paper ground blends to Dallas sand on the motion): radial alpha, sand #D9B98C with grit
rs = np.random.RandomState(5); S = 1024; yy, xx = np.mgrid[0:S, 0:S] / (S - 1) * 2 - 1; rad = np.sqrt(xx ** 2 + yy ** 2)
al = np.clip((1 - rad) / .35, 0, 1); grit = rs.rand(S, S) * .16 - .08
col = np.stack([217 + 60 * grit, 185 + 60 * grit, 140 + 50 * grit], -1); Image.fromarray(np.dstack([np.clip(col, 0, 255), al * 255]).astype(np.uint8), 'RGBA').save(os.path.join(OUT, 'sand_dallas.png'))
# station sign atlas: 4 columns x 13 rows of 512 x 96 navy boards, cream hand lettering (CB_RULES: story lettering, spelled right)
cols, cw, ch = 4, 512, 96; rows = (len(STATIONS) + cols - 1) // cols; at = Image.new('RGB', (cols * cw, rows * ch), NAVY); da = ImageDraw.Draw(at); CELLS = {}
for i, (c, x, y) in enumerate(STATIONS):
    t = {'DALLAS': 'DALLAS FIRE DEPT.', 'PINE HOLLOW': 'PINE HOLLOW FIRE DEPT.'}.get(c, c + ' F.D.'); X, Y = (i % cols) * cw, (i // cols) * ch
    da.rectangle([X + 4, Y + 4, X + cw - 5, Y + ch - 5], outline=(230, 222, 200), width=3); f = font(TITLE, 60)
    while da.textlength(t, font=f) > cw - 40: f = font(TITLE, f.size - 2)
    da.text((X + cw / 2, Y + ch / 2 + 2), t, font=f, fill=(246, 238, 214), anchor='mm'); CELLS[c] = [X / at.width, 1 - (Y + ch) / at.height, (X + cw) / at.width, 1 - Y / at.height]
at.save(os.path.join(OUT, 'signs.png'))
# roll-up door (white, navy trim, grooves, a row of windows), cream card brick wall, buff gravel roof
dr = Image.new('RGB', (256, 256), (240, 238, 230)); dd = ImageDraw.Draw(dr)
for k in range(1, 12): dd.line([(0, k * 21), (256, k * 21)], fill=(196, 194, 188), width=2); dd.line([(0, k * 21 + 2), (256, k * 21 + 2)], fill=(252, 252, 248), width=1)
for k in range(5): dd.rectangle([18 + k * 46, 66, 50 + k * 46, 82], fill=(70, 86, 120), outline=(39, 54, 90), width=2)
dd.rectangle([0, 0, 255, 255], outline=NAVY, width=7); dd.rectangle([0, 244, 255, 255], fill=(60, 58, 60)); dd.rectangle([110, 226, 146, 234], fill=(150, 150, 150))
dr.save(os.path.join(OUT, 'door.png'))
wl = Image.new('RGB', (512, 512), (234, 216, 172)); dw = ImageDraw.Draw(wl); r2 = random.Random(2)
for j in range(32):
    for i in range(9):
        x0 = i * 60 - (30 if j % 2 else 0); v = r2.randint(-10, 8); dw.rectangle([x0 + 2, j * 16 + 2, x0 + 58, j * 16 + 14], fill=(234 + v, 216 + v, 172 + v))
wl.filter(ImageFilter.GaussianBlur(.6)).save(os.path.join(OUT, 'wall.png'))
rf = Image.fromarray((np.random.RandomState(9).rand(256, 256, 1) * 34 + np.array([150, 144, 132])).clip(0, 255).astype(np.uint8)); rf.save(os.path.join(OUT, 'roof.png'))
json.dump(dict(insets=INS, cells=CELLS, stations=[[c, round(x, 3), round(y, 3)] for c, x, y in STATIONS], cities={c: [round(v[0], 3), round(v[1], 3)] for c, v in CITYXY.items()}),
          open(os.path.join(OUT, 'tex_meta.json'), 'w'), indent=1)
print('TEX_END')
