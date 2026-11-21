# tex_xray.py: PIL textures for the X-ray room (set-builder 2026-11-21). python3 tex_xray.py <out tex dir>
#   film_hero.png  the SIGNATURE film: Michel's torso in cyan #7fe9ff on mid-blue #2f6fb3 (never black), a bean stomach, inside it a tiny
#                  Cessna built of square bites like a ship in a bottle, F-MIAM on its fin, corner label M. LOTITO, R marker, clip holes
#   film_before.png the earlier film on panel 2: same torso, only a few loose bites in the stomach (evidence of the first visit)
#   lino.png       1970s lino tiles cream / pale mint with flecks (2 x 2 tiles = 0.6 m)
#   eye_chart.png  Snellen chart, black letters, line numbers
#   xworld_bg.png  the X-ray world backdrop: mid-blue gradient with soft cyan scan bands (never black)
import sys, os, math, random
from PIL import Image, ImageDraw, ImageFilter, ImageFont
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True); R = random.Random(1978)
BLUE, CYAN, NAVY = (47, 111, 179), (127, 233, 255), (29, 52, 97)
def font(sz, bold=True):
    try: return ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if bold else ''), sz)
    except Exception: return ImageFont.load_default()

def film(name, cessna=True):
    W, H = 1024, 1280; im = Image.new('RGB', (W, H), BLUE); d = ImageDraw.Draw(im)
    for y in range(H):                                   # soft centre lift, never black edges
        for x in range(0, W, 8):
            k = 1 - .22 * (((x - W / 2) / (W / 2)) ** 2 + ((y - H / 2) / (H / 2)) ** 2) ** .5
            d.line([(x, y), (x + 8, y)], fill=tuple(int(c * (.82 + .18 * k)) for c in BLUE))
    L = Image.new('RGB', (W, H), (0, 0, 0)); g = ImageDraw.Draw(L)     # line layer (added with glow)
    cx = W // 2
    # body outline (soft tissue) faint
    g.ellipse([cx - 360, 40, cx + 360, 1400], outline=(14, 34, 44), width=8)
    # spine: rounded vertebrae
    for i in range(17):
        y = 70 + i * 66; w = 46 + i * 1.6
        g.rounded_rectangle([cx - w / 2, y, cx + w / 2, y + 50], radius=12, outline=CYAN, width=7)
        g.line([(cx - w / 2 - 14, y + 25), (cx - w / 2, y + 25)], fill=CYAN, width=6); g.line([(cx + w / 2, y + 25), (cx + w / 2 + 14, y + 25)], fill=CYAN, width=6)
    # clavicles
    g.arc([cx - 420, 40, cx - 30, 220], 200, 330, fill=CYAN, width=12); g.arc([cx + 30, 40, cx + 420, 220], 210, 340, fill=CYAN, width=12)
    # ribs: 10 pairs of arcs
    for i in range(10):
        y = 150 + i * 58; rw = 300 - abs(i - 4) * 14; rh = 120 + i * 6
        g.arc([cx - rw - 10, y, cx + 10 + 0, y + rh * 2], 185, 300, fill=CYAN, width=11)
        g.arc([cx - 10, y, cx + rw + 10, y + rh * 2], 240, 355, fill=CYAN, width=11)
    # pelvis butterfly
    g.chord([cx - 330, 1080, cx - 40, 1320], 180, 360, outline=CYAN, width=12); g.chord([cx + 40, 1080, cx + 330, 1320], 180, 360, outline=CYAN, width=12)
    g.ellipse([cx - 70, 1180, cx + 70, 1270], outline=CYAN, width=9)
    # arm bones at the edges
    for s in (-1, 1):
        g.line([(cx + s * 430, 120), (cx + s * 470, 700)], fill=CYAN, width=22); g.ellipse([cx + s * 430 - 40, 80, cx + s * 430 + 40, 160], outline=CYAN, width=10)
    glow = L.filter(ImageFilter.GaussianBlur(9))
    import numpy as np
    A = np.asarray(im).astype(float); Lg = np.asarray(L).astype(float); Gg = np.asarray(glow).astype(float)
    A = np.clip(A + Lg * .85 + Gg * .9, 0, 255).astype('uint8'); im = Image.fromarray(A); d = ImageDraw.Draw(im)
    # the bean stomach in front of the spine (patient's left = film right): lighter blue fill, cyan wall, quilted lining at the bottom
    bx, by = cx + 30, 700; bean = []
    for k in range(90):
        a = 2 * math.pi * k / 90; r = 1 - .25 * max(0, math.cos(a - 2.3)) ** 3
        bean.append((bx + 300 * r * math.cos(a), by + 185 * r * math.sin(a) - 34 * math.sin(2 * a)))
    gl = Image.new('RGB', (W, H), (0, 0, 0)); ImageDraw.Draw(gl).line(bean + [bean[0]], fill=CYAN, width=16)
    A = np.clip(np.asarray(im).astype(float) + np.asarray(gl.filter(ImageFilter.GaussianBlur(10))).astype(float), 0, 255).astype('uint8'); im = Image.fromarray(A); d = ImageDraw.Draw(im)
    d.polygon(bean, fill=(66, 136, 200)); d.line(bean + [bean[0]], fill=(200, 248, 255), width=8)
    for k in range(11):
        x = bx - 230 + k * 42; d.arc([x, by + 92, x + 42, by + 134], 180, 360, fill=(160, 235, 255), width=5)
    if cessna:   # the tiny Cessna of square bites, side view, nose left; cell 22 px; '=' = navy stripe
        c = 22; rows = ["                    ### ",
                        " ##############    ### ",
                        "    #  #     #     ### ",
                        "   #######    #   ###  ",
                        "  ################### #",
                        "##====================#",
                        "  ##################   ",
                        "    #    #             ",
                        "   ###  ###            "]
        ox, oy = bx - 260, by - 135
        for j, row in enumerate(rows):
            for i, ch in enumerate(row):
                if ch == ' ': continue
                x0, y0 = ox + i * c, oy + j * c
                d.rectangle([x0 + 1, y0 + 1, x0 + c - 2, y0 + c - 2], fill=NAVY if ch == '=' else (190, 246, 255), outline=(120, 210, 240))
        d.line([(ox - 8, oy + 3 * c), (ox - 8, oy + 8 * c)], fill=(220, 252, 255), width=7); d.ellipse([ox - 16, oy + 5 * c + 2, ox, oy + 5 * c + 18], fill=(220, 252, 255))
        d.text((ox + 12 * c, oy + 7 * c), 'F-MIAM', font=font(40), fill=(225, 252, 255))
    else:
        for k in range(7):
            x0 = bx - 160 + R.randint(0, 280); y0 = by + R.randint(-40, 70); d.rectangle([x0, y0, x0 + 20, y0 + 20], fill=(190, 246, 255), outline=(120, 210, 240))
    # film furniture: corner label, R marker, clip holes, edge notch, scratches
    d.rectangle([30, H - 120, 330, H - 30], fill=(205, 235, 245)); d.text((44, H - 112), 'M. LOTITO', font=font(34), fill=NAVY)
    d.text((44, H - 70), 'GRENOBLE  1978' if cessna else 'GRENOBLE  1977', font=font(26, False), fill=NAVY)
    d.text((W - 120, 40), 'R', font=font(70), fill=(225, 250, 255))
    for x in (W * .3, W * .7): d.ellipse([x - 14, 14, x + 14, 42], fill=(160, 200, 220))
    d.polygon([(W - 60, H), (W, H - 60), (W, H)], fill=(150, 190, 215))
    for k in range(18):
        x = R.randint(0, W); y = R.randint(0, H); d.line([(x, y), (x + R.randint(-60, 60), y + R.randint(-8, 8))], fill=(90, 150, 200), width=1)
    im.save(os.path.join(OUT, name)); print('TEX', name)

film('film_hero.png', True); film('film_before.png', False)

# lino 1024 = 2x2 tiles
im = Image.new('RGB', (1024, 1024)); d = ImageDraw.Draw(im)
for i in range(2):
    for j in range(2):
        base = (236, 228, 205) if (i + j) % 2 == 0 else (196, 222, 206)
        d.rectangle([i * 512, j * 512, i * 512 + 511, j * 512 + 511], fill=base)
        for k in range(900):
            x = i * 512 + R.randint(4, 507); y = j * 512 + R.randint(4, 507); t = R.choice([(170, 160, 140), (250, 248, 240), (140, 170, 155)])
            d.ellipse([x, y, x + R.randint(2, 6), y + R.randint(2, 5)], fill=t)
        d.rectangle([i * 512, j * 512, i * 512 + 511, j * 512 + 511], outline=(150, 145, 130), width=3)
im = im.filter(ImageFilter.GaussianBlur(.6)); im.save(os.path.join(OUT, 'lino.png')); print('TEX lino')

# eye chart 600 x 1000
im = Image.new('RGB', (600, 1000), (250, 250, 244)); d = ImageDraw.Draw(im)
lines = ['E', 'F P', 'T O Z', 'L P E D', 'P E C F D', 'E D F C Z P', 'F E L O P Z D', 'D E F P O T E C']
y = 40
for i, s in enumerate(lines):
    sz = int(150 * (.72 ** i)) + 14; f = font(sz); w = d.textlength(s, font=f); d.text(((600 - w) / 2, y), s, font=f, fill=(25, 25, 30))
    d.text((24, y + sz * .3), str(i + 1), font=font(18, False), fill=(90, 90, 100)); y += sz + 22
d.rectangle([4, 4, 595, 995], outline=(60, 90, 140), width=6); d.text((190, 950), 'EYE TEST', font=font(28), fill=(60, 90, 140))
im.save(os.path.join(OUT, 'eye_chart.png')); print('TEX eye_chart')

# X-ray world backdrop 512 x 1024 (u around, v up)
im = Image.new('RGB', (1024, 512)); d = ImageDraw.Draw(im)
for y in range(512):
    k = y / 511; c = tuple(int(BLUE[i] * (1.15 - .35 * k) + 20 * (1 - k)) for i in range(3)); d.line([(0, y), (1024, y)], fill=c)
for k in range(14):
    y = R.randint(20, 490); d.line([(0, y), (1024, y)], fill=(90, 170, 225), width=R.randint(1, 3))
im = im.filter(ImageFilter.GaussianBlur(2)); im.save(os.path.join(OUT, 'xworld_bg.png')); print('TEX xworld_bg')

# FIX 1 (2026-11-21): quilted mattress tile (1 UV = 0.34 m): mid-blue cushion, cyan diamond seams, white tuft buttons at the seam crossings
im = Image.new('RGB', (256, 256), (63, 134, 200)); d = ImageDraw.Draw(im)
for k in range(256):
    for q in range(0, 256, 4):
        pass
for (a0, b0, a1, b1) in [(0, 0, 256, 256), (0, 256, 256, 0)]:
    d.line([(a0, b0), (a1, b1)], fill=(127, 233, 255), width=7); d.line([(a0, b0), (a1, b1)], fill=(36, 92, 160), width=2)
for (x, y) in [(0, 0), (256, 0), (0, 256), (256, 256), (128, 128)]:
    d.ellipse([x - 15, y - 15, x + 15, y + 15], fill=(30, 80, 150)); d.ellipse([x - 9, y - 9, x + 9, y + 9], fill=(235, 252, 255))
for k in range(60):   # stitch dashes along the seams
    t = R.random(); x = int(t * 256); d.point((x, x), fill=(230, 252, 255)); d.point((x, 255 - x), fill=(230, 252, 255))
im.filter(ImageFilter.GaussianBlur(.8)).save(os.path.join(OUT, 'quilt.png')); print('TEX quilt')
# FIX 1: poster "BALANCED DIET" (food pyramid) for the wall left of the light box: the gag for the man who eats planes
im = Image.new('RGB', (340, 480), (250, 247, 232)); d = ImageDraw.Draw(im)
d.rectangle([0, 0, 340, 70], fill=(60, 130, 110)); f = font(34); w = d.textlength('BALANCED', font=f); d.text(((340 - w) / 2, 2), 'BALANCED', font=f, fill=(255, 255, 255))
f2 = font(30); w = d.textlength('DIET', font=f2); d.text(((340 - w) / 2, 36), 'DIET', font=f2, fill=(255, 245, 200))
rows = [((120, 180, 70), 4), ((240, 190, 60), 3), ((230, 150, 90), 2), ((200, 170, 120), 1)]
for i, (c, n) in enumerate(rows):
    y0 = 400 - i * 75; hw = 150 - i * 34; d.polygon([(170 - hw, y0 + 70), (170 + hw, y0 + 70), (170 + hw - 34, y0), (170 - hw + 34, y0)], fill=c, outline=(80, 80, 80))
    for k in range(n): x = 170 - (n - 1) * 30 + k * 60; d.ellipse([x - 18, y0 + 18, x + 18, y0 + 54], fill=tuple(int(v * .7) for v in c), outline=(60, 60, 60), width=2)
d.text((14, 455), 'Grenoble hospital health board', font=font(15), fill=(90, 90, 90))
im.save(os.path.join(OUT, 'poster_diet.png')); print('TEX poster')
