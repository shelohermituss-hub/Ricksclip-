"""make_tex.py: every picture of the ship place (PIL + numpy), written to sets/ship/tex/. Run by build_ship.sh before Blender."""
import os, sys, math, json
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
HERE = os.path.dirname(os.path.abspath(__file__)); TEX = os.path.join(os.path.dirname(HERE), 'tex'); os.makedirs(TEX, exist_ok=True)
FB = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
FI = '/usr/share/fonts/opentype/inter/Inter-BoldItalic.otf'
FM = '/usr/share/fonts/truetype/jetbrains-mono/JetBrainsMono-Bold.ttf'
if not os.path.exists(FB): FB = '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'
def font(p, s): return ImageFont.truetype(p, s)
def hx(h): h = h.lstrip('#'); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
rng = np.random.default_rng(7)

def fbm(w, h, base, octaves, seed, wrap=True):
    r = np.random.default_rng(seed); out = np.zeros((h, w), np.float32); amp = 1.0; tot = 0.0
    for o in range(octaves):
        n = base * 2 ** o; a = r.random((max(2, n // 2), n)).astype(np.float32)
        if wrap: a = np.concatenate([a, a[:, :1]], 1)
        im = Image.fromarray((a * 255).astype(np.uint8)).resize((w + (w // n if wrap else 0), h), Image.BICUBIC)
        out += amp * np.asarray(im, np.float32)[:, :w] / 255; tot += amp; amp *= 0.5
    return out / tot

def earth():
    """round 2: 4096x2048 so a cap filling the frame holds; vivid green land, cyan shallows, big warped white cloud swirls with soft blue shade.
    Also writes ../out/earth_kit.jpg for the kit (the GLB carries only a tiny stand-in picture)."""
    W, H = 4096, 2048
    land = fbm(W, H, 5, 7, 11); land = (land - land.min()) / (land.max() - land.min())
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    wx = (fbm(W, H, 8, 4, 21) - 0.5) * 700; wy = (fbm(W, H, 8, 4, 22) - 0.5) * 420
    sw = np.sin(xx / W * 2 * math.pi * 7 + fbm(W, H, 3, 3, 23) * 9) * 120
    cl = fbm(W, H, 14, 7, 31); cl = cl[np.clip((yy + wy + sw * .5).astype(int), 0, H - 1), ((xx + wx + sw).astype(int)) % W]
    cl = (cl - cl.min()) / (cl.max() - cl.min()); fine = fbm(W, H, 64, 4, 33); cl = cl * .72 + fine * .28
    sea1, sea2, cloud, shade = [np.array(hx(c), np.float32) for c in ('#1d5cbc', '#2c78c8', '#f4f8fc', '#a9bfd8')]
    img = np.zeros((H, W, 3), np.float32)
    t = np.clip((land - 0.30) / 0.25, 0, 1)[..., None]; img[:] = sea1 * (1 - t) + sea2 * t
    coast = np.clip((land - 0.50) / 0.035, 0, 1)[..., None]; cyan = np.array((60, 175, 215), np.float32)
    img = img * (1 - coast * .7) + cyan * coast * .7
    lm = np.clip((land - 0.535) / 0.01, 0, 1)[..., None]; gv = fbm(W, H, 20, 4, 41)[..., None]
    g2 = np.array(hx('#55b043'), np.float32) * (1 - gv) + np.array(hx('#a6d870'), np.float32) * gv; img = img * (1 - lm) + g2 * lm
    cm = np.clip((cl - 0.50) / 0.09, 0, 1) ** 1.3; cs = np.roll(np.roll(cm, 10, 0), 14, 1)
    img = img * (1 - 0.30 * cs[..., None])
    inner = np.clip((cl - 0.56) / 0.16, 0, 1)[..., None]; cc = shade * (1 - inner) + cloud * inner
    img = img * (1 - cm[..., None]) + cc * cm[..., None]
    im = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7)); im.save(os.path.join(TEX, 'earth.png'))
    OUTD = os.path.join(os.path.dirname(HERE), 'out'); os.makedirs(OUTD, exist_ok=True); im.save(os.path.join(OUTD, 'earth_kit.jpg'), quality=88)

def stars():
    W, H = 8192, 4096
    bg = np.array(hx('#010019'), np.float32); img = np.zeros((H, W, 3), np.float32) + bg
    n1 = fbm(W // 8, H // 8, 4, 5, 51); n2 = fbm(W // 8, H // 8, 3, 4, 52)
    a1 = np.clip((n1 - 0.52) / 0.2, 0, 1) ** 1.5; a2 = np.clip((n2 - 0.55) / 0.2, 0, 1) ** 1.5
    neb = a1[..., None] * (np.array(hx('#3a2038'), np.float32) - bg) * 0.9 + a2[..., None] * (np.array(hx('#141a34'), np.float32) - bg) * 0.9
    neb = np.asarray(Image.fromarray(np.clip(neb, 0, 255).astype(np.uint8)).resize((W, H), Image.BICUBIC), np.float32)
    img += neb
    N = 17000; z = rng.uniform(-1, 1, N); lat = np.arcsin(z); lon = rng.uniform(0, 2 * math.pi, N)
    for i in range(N):
        cx = lon[i] / (2 * math.pi) * W; cy = (0.5 - lat[i] / math.pi) * H
        big = rng.random() < 0.10; sg = (2.6 if big else 1.15) * rng.uniform(0.8, 1.2); pk = rng.uniform(0.84, 1.0) if (big or rng.random() < 0.5) else rng.uniform(0.35, 0.8)
        col = np.array((255, 255, 255), np.float32)
        u = rng.random()
        if u < 0.06: col = np.array((190, 205, 255), np.float32)
        elif u < 0.10: col = np.array((255, 225, 190), np.float32)
        sx = sg / max(0.15, math.cos(lat[i])); rx = int(min(60, 3 * sx + 2)); ry = int(3 * sg + 2)
        x0 = int(cx); y0 = int(cy)
        ys = np.arange(max(0, y0 - ry), min(H, y0 + ry + 1)); xs = np.arange(x0 - rx, x0 + rx + 1)
        g = np.exp(-((ys[:, None] - cy) ** 2) / (2 * sg * sg) - ((xs[None, :] - cx) ** 2) / (2 * sx * sx)) * pk * (1.6 if big else 1.25)
        xi = xs % W
        img[ys[:, None], xi[None, :]] = np.maximum(img[ys[:, None], xi[None, :]], np.minimum(g, 1)[..., None] * col)
    Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(os.path.join(TEX, 'stars.png'))

def text_img(name, size, items, bg=(0, 0, 0, 0)):
    im = Image.new('RGBA', size, bg); d = ImageDraw.Draw(im)
    for it in items: d.text(it[0], it[1], font=font(it[2], it[3]), fill=it[4], anchor=it[5] if len(it) > 5 else 'mm')
    im.save(os.path.join(TEX, name)); return im

def lodestar():
    im = Image.new('RGBA', (2000, 220), (0, 0, 0, 0)); d = ImageDraw.Draw(im); f = font(FI, 170)
    for i, ch in enumerate('LODESTAR'): d.text((125 + i * 250, 110), ch, font=f, fill=(252, 252, 252, 255), anchor='mm', stroke_width=9, stroke_fill=(252, 252, 252, 255))
    im.save(os.path.join(TEX, 'lodestar.png'))

def mfd(on):
    im = Image.new('RGBA', (640, 480), (6, 10, 14, 255)); d = ImageDraw.Draw(im); f = font(FB, 26)
    for i, t in enumerate(('PWR', 'O2', 'H2O', 'PROP')):
        d.text((70 + i * 110, 34), t, font=f, fill=(120, 240, 200, 255), anchor='mm'); d.rectangle((45 + i * 110, 60, 95 + i * 110, 96), outline=(120, 240, 200, 255), width=3)
    if on:
        d.rectangle((60, 120, 580, 350), fill=(240, 58, 58, 255)); fb = font(FB, 92)
        d.text((320, 180), 'COMM', font=fb, fill=(255, 255, 255, 255), anchor='mm'); d.text((320, 285), 'INCOMING', font=fb, fill=(255, 255, 255, 255), anchor='mm')
    else:
        for i in range(8): hgt = (60, 140, 100, 180, 120, 80, 160, 110)[i]; d.rectangle((80 + i * 62, 340 - hgt, 122 + i * 62, 340), fill=(70, 220, 110, 255))
    for i in range(4): d.rectangle((150 + i * 95, 385, 215 + i * 95, 440), fill=(200, 255, 253, 255) if i < 3 else (250, 215, 60, 255))
    im.save(os.path.join(TEX, 'mfd_on.png' if on else 'mfd_off.png'))

def sband():
    im = Image.new('RGBA', (480, 400), (10, 6, 2, 255)); d = ImageDraw.Draw(im); a = (250, 190, 50, 255)
    d.text((20, 40), 'COMM   S-BAND', font=font(FB, 30), fill=a, anchor='lm'); d.text((240, 140), '2287.5', font=font(FM, 92), fill=a, anchor='mm')
    r = np.random.default_rng(3); pts = [(20 + i * 8, 300 + (r.random() - 0.5) * 150 * math.exp(-((i - 28) / 14) ** 2)) for i in range(56)]
    d.line(pts, fill=a, width=4); im.save(os.path.join(TEX, 'sband.png'))

def radio():
    W, Hh = 940, 780
    im = Image.new('RGBA', (W, Hh), (0, 0, 0, 0)); d = ImageDraw.Draw(im); w = (255, 255, 255, 255); f = font(FB, 54)
    d.text((W * 0.45, 62), 'COMM 1', font=f, fill=w, anchor='mm'); d.text((W * 0.84, 250), 'INCOMING', font=font(FB, 32), fill=w, anchor='mm')
    d.text((W * 0.20, 740), 'VOL', font=font(FB, 40), fill=w, anchor='mm'); d.text((W * 0.80, 740), 'FREQ', font=font(FB, 40), fill=w, anchor='mm')
    im.save(os.path.join(TEX, 'radio_face.png'))
    for i, t in enumerate(('121.50', '12 .50', '1-1.  ', ' -21. ')):
        im = Image.new('RGBA', (520, 200), hx('#5a2903') + (255,)); d = ImageDraw.Draw(im)
        d.text((260, 100), t, font=font(FM, 132), fill=(250, 200, 60, 255), anchor='mm'); im.save(os.path.join(TEX, 'radio_digits_%d.png' % i))

def star4(d, c, r, fill, k=0.28):
    pts = []
    for i in range(8): a = i * math.pi / 4 - math.pi / 2; rr = r if i % 2 == 0 else r * k; pts.append((c[0] + rr * math.cos(a), c[1] + rr * math.sin(a)))
    d.polygon(pts, fill=fill)

def badge():
    S = 512; im = Image.new('RGBA', (S, S), (0, 0, 0, 0)); d = ImageDraw.Draw(im); gold = (232, 185, 58, 255)
    d.ellipse((6, 6, S - 6, S - 6), fill=(20, 26, 70, 255), outline=gold, width=14)
    d.arc((70, 60, 440, 430), 110, 340, fill=gold, width=22)
    for i in range(18): a = i * 2 * math.pi / 18; d.ellipse((256 + 120 * math.cos(a) - 5, 235 + 60 * math.sin(a) - 5, 256 + 120 * math.cos(a) + 5, 235 + 60 * math.sin(a) + 5), fill=(240, 150, 60, 255))
    star4(d, (256, 235), 95, gold); d.text((256, 410), 'LODESTAR', font=font(FB, 50), fill=gold, anchor='mm'); im.save(os.path.join(TEX, 'badge.png'))
    im = Image.new('RGBA', (256, 256), (0, 0, 0, 0)); d = ImageDraw.Draw(im); red = (230, 40, 50, 255)
    d.ellipse((30, 30, 226, 226), outline=red, width=14); star4(d, (128, 128), 120, red, 0.2); d.arc((60, 150, 250, 250), 180, 300, fill=red, width=10)
    im.save(os.path.join(TEX, 'emblem.png'))

def starmap():
    W, Hh = 960, 1200; im = Image.new('RGBA', (W, Hh), (0, 0, 0, 0)); d = ImageDraw.Draw(im); w = (249, 247, 248, 255)
    poly = [(20, 20), (W - 20, 20), (W - 20, Hh - 20), (150, Hh - 20), (20, Hh - 130)]
    d.polygon(poly, fill=(26, 27, 38, 70)); d.line(poly + [poly[0]], fill=w, width=14)
    inn = [(50, 60), (W - 50, 60), (W - 50, Hh - 60), (165, Hh - 60), (50, Hh - 150)]; d.line(inn + [inn[0]], fill=w, width=6)
    for i in range(49):
        x = 60 + i * (W - 120) / 48; L = 28 if i % 4 == 0 else 14; d.line((x, 60, x, 60 + L), fill=w, width=4)
        if x > 170: d.line((x, Hh - 60, x, Hh - 60 - L), fill=w, width=4)
    for i in range(1, 8): x = 50 + i * (W - 100) / 8; d.line((x, 90, x, Hh - 90), fill=(200, 205, 225, 60), width=2)
    for j in range(1, 9): y = 60 + j * (Hh - 120) / 9; d.line((60, y, W - 60, y), fill=(200, 205, 225, 60), width=2)
    nodes = [(700, 250), (380, 370), (530, 400), (250, 560), (730, 640), (420, 730), (600, 820), (200, 940)]
    for a, b in ((1, 2), (2, 0), (1, 3), (3, 5), (5, 6), (6, 4), (4, 0), (3, 7)): d.line(nodes[a] + nodes[b], fill=w, width=5)
    for n in nodes: d.ellipse((n[0] - 24, n[1] - 24, n[0] + 24, n[1] + 24), fill=(20, 22, 32, 255), outline=w, width=6)
    c = (470, 560); d.ellipse((c[0] - 80, c[1] - 80, c[0] + 80, c[1] + 80), outline=(255, 110, 90, 255), width=12); d.line((c[0] - 18, c[1] - 10, c[0] + 18, c[1] + 10), fill=(255, 230, 200, 255), width=10)
    im.save(os.path.join(TEX, 'starmap.png'))

def kit_sky():
    OUTD = os.path.join(os.path.dirname(HERE), 'out'); os.makedirs(OUTD, exist_ok=True)
    Image.open(os.path.join(TEX, 'stars.png')).resize((4096, 2048), Image.LANCZOS).save(os.path.join(OUTD, 'stars_kit.jpg'), quality=90)

if __name__ == '__main__' and len(sys.argv) > 1:
    for n in sys.argv[1:]: globals()[n]()
    print('tex ok', sys.argv[1:])
elif __name__ == '__main__':
    earth(); stars(); kit_sky(); lodestar(); mfd(True); mfd(False); sband(); radio(); badge(); starmap(); print('tex ok', sorted(os.listdir(TEX)))
