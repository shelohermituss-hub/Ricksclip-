# tex_dallas.py: every picture of PLACE B (Dallas station yard) made with PIL OUTSIDE Blender (REGLES 3): tinted copies of the Poly Haven CC0 textures
# (the noon palette of THIS place: pale stucco, pale concrete, sand #D9B98C, dry grass), the story lettering (front band, station plate, the slate boards
# with chalk tallies, the 4-leaf calendar, the order sheet REPAINT: RED) and the ground decals (oil, tyre tracks, chalk dust).
# python3 tex_dallas.py <assets/ph_dallas/tex> <out dir>     Prints TEX_END. No date or time goes into any picture.
import os, sys, math, random
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np
SRC, OUT = sys.argv[1], sys.argv[2]; os.makedirs(OUT, exist_ok=True)
FB = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'; FSER = '/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf'; FN = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
def hexc(h): h = h.lstrip('#'); return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], float)
def tint(src, name, col, keep=.25, gain=1.0):
    im = np.asarray(Image.open(os.path.join(SRC, src + '_diff_1k.jpg')).convert('RGB'), float)
    lum = im.mean(2, keepdims=True); rel = lum / max(lum.mean(), 1)
    out = hexc(col)[None, None, :] * rel * gain; out = out * (1 - keep) + im * keep * (hexc(col).mean() / max(im.mean(), 1))
    Image.fromarray(np.clip(out, 0, 255).astype('uint8')).save(os.path.join(OUT, name + '_diff.jpg'), quality=90)
    for k in ('nor_gl', 'rough'): Image.open(os.path.join(SRC, '%s_%s_1k.jpg' % (src, k))).save(os.path.join(OUT, '%s_%s.jpg' % (name, k)), quality=92)
TINTS = [('white_stucco', 'stucco', '#ece3cf', .25), ('smooth_concrete_floor', 'yard', '#c8cbcc', .4), ('concrete_floor_worn_001', 'bay_floor', '#b5aea2', .55),
         ('dry_ground_01', 'sand', '#d9b98c', .45), ('withered_grass', 'drygrass', '#b8a46c', .5), ('painted_metal_shutter', 'shutter', '#ebe8de', .25),
         ('concrete_pavement', 'walk', '#d2cbbd', .5), ('asphalt_02', 'asphalt', '#8e8a85', .45), ('rusty_metal', 'rust', '#8a6a52', .5),
         ('wood_table_worn', 'wood', '#a5875f', .5), ('concrete_block_wall', 'block', '#d6cdb8', .4), ('sandy_gravel', 'gravel', '#cdb690', .5),
         ('box_profile_metal_sheet', 'sheet', '#c8ccd0', .35), ('corrugated_iron', 'corr', '#aeb0ac', .15), ('dry_ground_01', 'far', '#cfb48c', .3),
         ('white_stucco', 'stucco_tan', '#d8c3a0', .25), ('white_stucco', 'stucco_grey', '#c9c6bc', .25)]
for s, n, c, k in TINTS: tint(s, n, c, k)
rnd = random.Random(14); rng = np.random.default_rng(14)
def paint_letters(name, w, h, bg, lines, fg, font=FSER, sizes=None, edge=None, fade=.0, seed=1):
    """hand-painted sign letters, sun-faded: each glyph a little rotated and shifted, a drop shade, faded flakes."""
    r = random.Random(seed); im = Image.new('RGB', (w, h), bg); d = ImageDraw.Draw(im)
    if edge: d.rectangle([6, 6, w - 7, h - 7], outline=edge, width=max(4, h // 28))
    n = len(lines); ys = [h * (i + .5) / n for i in range(n)]
    for i, t in enumerate(lines):
        sz = sizes[i] if sizes else int(h / n * .6); f = ImageFont.truetype(font, sz)
        tw = sum(f.getbbox(c)[2] - f.getbbox(c)[0] + sz * .08 for c in t); x = (w - tw) / 2
        for c in t:
            g = Image.new('RGBA', (sz * 2, sz * 2), (0, 0, 0, 0)); gd = ImageDraw.Draw(g)
            gd.text((sz * .5 + 3, sz * .3 + 4), c, font=f, fill=(0, 0, 0, 70)); gd.text((sz * .5, sz * .3), c, font=f, fill=fg)
            g = g.rotate(r.uniform(-2, 2), resample=Image.BICUBIC); im.paste(g, (int(x - sz * .5 + r.uniform(-1, 1)), int(ys[i] - sz * .8 + r.uniform(-1.5, 1.5))), g)
            x += f.getbbox(c)[2] - f.getbbox(c)[0] + sz * .08
    a = np.asarray(im, float); yy, xx = np.mgrid[0:h, 0:w]; a += ((np.sin(xx * .7 + np.sin(yy * .04) * 5) * .5 + .5) * 9 - 4.5)[..., None]
    fl = np.kron(np.random.default_rng(seed).random((h // 4 + 1, w // 4 + 1)) > .975, np.ones((4, 4)))[:h, :w]; a[fl > 0] = a[fl > 0] * .55 + hexc(bg) * .45
    a = a * (1 - fade) + hexc(bg) * fade
    Image.fromarray(np.clip(a, 0, 255).astype('uint8')).save(os.path.join(OUT, name + '.png'))
# the front band (painted on the parapet stucco) and the office-wing plate (enamel, navy on cream). Navy = the town's trim #27365A (no teal)
paint_letters('sign_front', 3072, 384, '#e9e0cb', ['DALLAS FIRE DEPT.'], '#27365a', sizes=[250], fade=.08, seed=3)
paint_letters('sign_station', 1024, 320, '#efe8d6', ['STATION 14'], '#27365a', font=FB, sizes=[170], edge='#27365a', seed=5)
# ---- slate boards #33302E with white chalk: heads, tallies in fives (4 strokes + 1 slash; never legible as numbers), eraser smears, ledge dust
SLATE = (51, 48, 46)
def chalk_line(d, p0, p1, wdt, a=230):
    n = int(max(abs(p1[0] - p0[0]), abs(p1[1] - p0[1])) / 2) + 2
    for i in range(n):
        t = i / (n - 1); x = p0[0] + (p1[0] - p0[0]) * t + rnd.uniform(-1, 1); y = p0[1] + (p1[1] - p0[1]) * t + rnd.uniform(-1, 1)
        if rnd.random() < .12: continue                       # chalk skips on the grain
        r = wdt * rnd.uniform(.35, .6); d.ellipse([x - r, y - r, x + r, y + r], fill=(236, 234, 226, int(a * rnd.uniform(.6, 1))))
def chalk_text(im, txt, cx, cy, sz, a=235):
    f = ImageFont.truetype(FB, sz); g = Image.new('L', im.size, 0); gd = ImageDraw.Draw(g); tw = gd.textlength(txt, font=f)
    x = cx - tw / 2
    for c in txt:
        gl = Image.new('L', (sz * 2, sz * 2), 0); ImageDraw.Draw(gl).text((sz * .4, sz * .2), c, font=f, fill=255); gl = gl.rotate(rnd.uniform(-5, 5), resample=Image.BICUBIC)
        g.paste(gl, (int(x - sz * .4), int(cy - sz * .75 + rnd.uniform(-sz * .05, sz * .05))), gl); x += gd.textlength(c, font=f) * 1.04
    m = np.asarray(g, float) / 255 * (np.random.default_rng(int(cx + cy)).random(g.size[::-1]) > .22) * a   # grainy chalk fill
    base = np.asarray(im, float); base = base * (1 - m[..., None] / 255) + np.array([238, 236, 228]) * (m[..., None] / 255)
    im.paste(Image.fromarray(base.astype('uint8')))
def slate(name, head=None, ticks=0, top=None, smear=3, seed=1, w=600, h=1200):
    global rnd; rnd = random.Random(seed); r2 = np.random.default_rng(seed)
    a = np.ones((h, w, 3)) * SLATE + r2.normal(0, 4, (h, w, 1))
    for k in range(smear):                                    # old eraser smears: pale soft clouds of wiped chalk
        cx, cy = r2.uniform(.15, .85) * w, r2.uniform(.1, .9) * h; yy, xx = np.mgrid[0:h, 0:w]
        a += 26 * np.exp(-(((xx - cx) / (w * .22)) ** 2 + ((yy - cy) / (h * .05)) ** 2))[..., None] * (0.5 + .5 * np.sin(xx * .08))[..., None]
    im = Image.fromarray(np.clip(a, 0, 255).astype('uint8')); d = ImageDraw.Draw(im, 'RGBA')
    y0 = 40
    if head: chalk_text(im, head, w / 2, 110, 150); d.line([(60, 200), (w - 60, 196)], fill=(236, 234, 226, 200), width=7); y0 = 240
    if top:
        # FIX 2: UP TO 3x painted large (it must read in the S5 wide): UP TO 150 px, 3x 400 px, a chalk box round the number
        chalk_text(im, top[0], w / 2, 125, 150); chalk_text(im, top[1], w / 2, 440, 400); y0 = 720
        for (p0, p1) in [((40, 235), (w - 40, 228)), ((w - 40, 228), (w - 34, 680)), ((w - 34, 680), (44, 690)), ((44, 690), (40, 235))]: chalk_line(d, p0, p1, 13)
    gx, gy = 112, 96; cols = (w - 80) // gx; x, y = 52, y0; done = 0
    while done < ticks and y < h - 110:                       # one group of five per cell
        k = min(5, ticks - done)
        for i in range(min(k, 4)): chalk_line(d, (x + i * 20 + rnd.uniform(-3, 3), y), (x + i * 20 + rnd.uniform(-4, 4), y + 70), 9)
        if k == 5: chalk_line(d, (x - 10, y + 60), (x + 78, y + 8), 9)
        done += k; x += gx
        if x > w - gx + 20: x = 52 + rnd.uniform(-6, 6); y += gy
    for k in range(260):                                      # chalk dust settled on the lower edge
        px, py = r2.uniform(0, w), h - abs(r2.normal(0, 30)); d.point((px, py), fill=(230, 228, 220, int(r2.uniform(60, 160))))
    im.save(os.path.join(OUT, name + '.png'))
slate('board_red_1', head='RED', ticks=240, seed=11); slate('board_red_2', ticks=320, seed=12); slate('board_red_3', ticks=150, top=('UP TO', '3x'), seed=13)
slate('board_lime', head='LIME', ticks=105, seed=21); slate('board_blank', ticks=0, smear=5, seed=31)
# ---- the 4-leaf wall calendar: one leaf per year, a printed grid of months (no other words), a fire-dept crest drawn as a plain ring
for i in range(1, 5):
    w, h = 400, 560; im = Image.new('RGB', (w, h), '#f4efe2'); d = ImageDraw.Draw(im); f = ImageFont.truetype(FB, 104)
    d.rectangle([0, 0, w, 150], fill='#27365a'); tw = d.textlength('YEAR %d' % i, font=f); d.text(((w - tw) / 2, 16), 'YEAR %d' % i, font=f, fill='#f4efe2')
    for r_ in range(4):
        for c_ in range(3):
            x0, y0 = 22 + c_ * 122, 178 + r_ * 92; d.rectangle([x0, y0, x0 + 110, y0 + 82], outline='#9b9486', width=2)
            for k in range(20): d.rectangle([x0 + 8 + (k % 5) * 20, y0 + 10 + (k // 5) * 17, x0 + 16 + (k % 5) * 20, y0 + 16 + (k // 5) * 17], fill='#c4bdae')
    for k in range(3 + i): x0, y0 = rnd.uniform(30, 360), rnd.uniform(180, 520); d.line([(x0, y0), (x0 + 16, y0 + 14)], fill='#33302e', width=4); d.line([(x0 + 16, y0), (x0, y0 + 14)], fill='#33302e', width=4)
    a = np.asarray(im, float); a *= (1 - .12 * np.linspace(0, 1, h))[:, None, None]; Image.fromarray(a.astype('uint8')).save(os.path.join(OUT, 'cal_year%d.png' % i))
# ---- the order sheet REPAINT: RED (letter size; typed lines, crooked rubber stamp, signature, carbon smudge)
w, h = 850, 1100; im = Image.new('RGB', (w, h), '#f3efe4'); d = ImageDraw.Draw(im, 'RGBA'); f = ImageFont.truetype(FB, 52); fn = ImageFont.truetype(FN, 26)
d.text((60, 50), 'WORK ORDER', font=f, fill='#2a2a30'); d.line([(60, 120), (790, 120)], fill='#2a2a30', width=4)
for k in range(16): y = 170 + k * 46; d.line([(60, y + 34), (790, y + 34)], fill='#b8b2a4', width=2); d.rectangle([70, y + 12, 70 + rnd.randint(200, 640), y + 26], fill=(70, 70, 80, 150))
st = Image.new('RGBA', (1000, 230), (0, 0, 0, 0)); sd = ImageDraw.Draw(st); sd.rectangle([6, 6, 993, 223], outline=(205, 25, 32, 230), width=12)
sf = ImageFont.truetype(FB, 128); sd.text((36, 34), 'REPAINT: RED', font=sf, fill=(205, 25, 32, 230))
sm = np.asarray(st, float); sm[..., 3] *= (np.random.default_rng(5).random(sm.shape[:2]) > .18); st = Image.fromarray(sm.astype('uint8')).resize((740, 170)).rotate(-7, expand=True, resample=Image.BICUBIC)
im.paste(st, (40, 560), st); d.line([(470, 960), (520, 930), (560, 975), (610, 925), (660, 968), (760, 940)], fill=(30, 40, 90, 220), width=5)
d.ellipse([600, 120, 760, 200], fill=(80, 80, 90, 40)); d.ellipse([90, 980, 135, 1030], fill=(227, 234, 34, 120))
im.save(os.path.join(OUT, 'order_sheet.png'))
# ---- decals (RGBA): oil stains, tyre tracks, chalk dust, a hot-concrete crack set, a dark wet-ish drip line under the cooler
def decal(name, w, h, fn, seed=1):
    r = np.random.default_rng(seed); im = Image.new('RGBA', (w, h), (0, 0, 0, 0)); fn(ImageDraw.Draw(im), r, w, h, im); im.save(os.path.join(OUT, name + '.png'))
def oil(d, r, w, h, im):
    for k in range(30):
        cx, cy = r.normal(w / 2, w * .15), r.normal(h / 2, h * .2); rr = abs(r.normal(w * .07, w * .05)) + 6
        d.ellipse([cx - rr, cy - rr * .7, cx + rr, cy + rr * .7], fill=(34, 28, 24, int(r.uniform(40, 120))))
    im.paste(im.filter(ImageFilter.GaussianBlur(5)))
def tracks(d, r, w, h, im):
    for x0 in (w * .2, w * .8):
        for k in range(2600): x = r.normal(x0, w * .045); y = r.uniform(0, h); d.point((x, y), fill=(92, 84, 74, int(r.uniform(20, 70))))
    im.paste(im.filter(ImageFilter.GaussianBlur(2)))
def dust(d, r, w, h, im):
    for k in range(5000): x, y = r.normal(w / 2, w * .2), r.normal(h / 2, h * .2); d.point((x, y), fill=(240, 238, 230, int(r.uniform(30, 160))))
    im.paste(im.filter(ImageFilter.GaussianBlur(1.2)))
def cracks(d, r, w, h, im):
    for k in range(9):
        x, y = r.uniform(0, w), r.uniform(0, h); a = r.uniform(0, 6.28)
        for s in range(40): nx, ny = x + math.cos(a) * 9, y + math.sin(a) * 9; d.line([(x, y), (nx, ny)], fill=(70, 64, 58, 150), width=2); x, y = nx, ny; a += r.normal(0, .35)
def joint(d, r, w, h, im):
    d.rectangle([0, h / 2 - 3, w, h / 2 + 3], fill=(96, 90, 80, 200))
    for k in range(400): x = r.uniform(0, w); d.point((x, h / 2 + r.normal(0, 5)), fill=(80, 74, 66, 120))
decal('decal_oil', 512, 512, oil, 1); decal('decal_tracks', 256, 1024, tracks, 2); decal('decal_dust', 256, 256, dust, 3); decal('decal_cracks', 512, 512, cracks, 4)
decal('decal_joint', 1024, 32, joint, 5)
# windows of the office wing: dark glass with a venetian blind and a lamp; skyline tower windows (tiny lit rows)
for i in range(3):
    w, h = 128, 160; im = Image.new('RGB', (w, h), '#3a4048'); d = ImageDraw.Draw(im)
    for y in range(0, int(h * (.35 + .2 * i)), 7): d.line([(0, y), (w, y)], fill='#d9d2bf', width=4)
    d.polygon([(0, h), (w * .5, h * .55), (w, h)], fill='#4c5560'); im.save(os.path.join(OUT, 'win_office_%d.png' % i))
w, h = 256, 512; im = Image.new('RGB', (w, h), '#a7adb4'); d = ImageDraw.Draw(im)
for y in range(8, h, 18):
    for x in range(8, w, 20): d.rectangle([x, y, x + 12, y + 9], fill=rnd.choice(['#7d8794', '#8d96a2', '#c9d3dc', '#6e7682']))
im.save(os.path.join(OUT, 'tower_glass.png'))
# chain-link mesh (RGBA): galvanised diamond wire, about 6 cm diamonds at 1 px = 0.5 cm (tiled once per fence bay in Blender and the kit)
w, h = 512, 256; im = Image.new('RGBA', (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
for k in range(-h, w + h, 14): d.line([(k, 0), (k + h, h)], fill=(170, 174, 176, 235), width=2); d.line([(k, h), (k + h, 0)], fill=(150, 154, 156, 235), width=2)
im.save(os.path.join(OUT, 'fence_mesh.png'))
print('TEX_END')
