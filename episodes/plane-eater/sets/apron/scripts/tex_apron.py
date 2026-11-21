# tex_apron.py: PIL textures of the AIRFIELD APRON (set-builder 2026-11-21). Our code, no downloads. Rick recipe: clean, moderate texture, NOTHING dirty.
# python3 tex_apron.py <out dir>   -> concrete.png, cloth.png, wood.png, canvas.png, sign.png, plaque.png, poster.png, pump.png, sock.png ; ends TEX_END
import sys, os, math, random
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True); R = random.Random(11); NP = np.random.default_rng(11)
FD = '/usr/share/fonts/truetype/dejavu/'
SERIF, SANS = FD + 'DejaVuSerif-Bold.ttf', FD + 'DejaVuSans-Bold.ttf'
def hx(h): h = h.lstrip('#'); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
def blur_noise(n, s, sig):
    a = NP.random((s, s)).astype(np.float32); im = Image.fromarray((a * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(sig)); return np.asarray(im).astype(np.float32) / 255

# concrete: pale warm grey, soft clouding, fine speckle, two hairline cracks per tile (2 m tile, 1024 px)
S = 1024; base = np.array(hx('#c9c6bd'), np.float32)
cl = blur_noise(0, S, 40); cl = (cl - cl.mean()) / (cl.std() + 1e-6); sp = NP.random((S, S)).astype(np.float32)
img = base[None, None, :] * (1 + .035 * cl[..., None]) + (sp[..., None] - .5) * 14
img = np.clip(img, 0, 255).astype(np.uint8); im = Image.fromarray(img); d = ImageDraw.Draw(im)
for _ in range(2):
    x, y = R.uniform(100, 900), R.uniform(100, 900); a = R.uniform(0, 6.28)
    for k in range(40):
        a += R.uniform(-.5, .5); nx, ny = x + math.cos(a) * 9, y + math.sin(a) * 9; d.line((x, y, nx, ny), fill=(150, 148, 142), width=2); x, y = nx, ny
for _ in range(30):   # small aggregate stones
    x, y = R.uniform(0, S), R.uniform(0, S); r = R.uniform(1.5, 3.5); c = R.randint(170, 215); d.ellipse((x - r, y - r, x + r, y + r), fill=(c, c - 3, c - 8))
im.save(os.path.join(OUT, 'concrete.png'))

# tablecloth: white cotton weave with a woven border band of two thin pale-sage lines (never red: red is Michel's only)
S = 512; a = np.full((S, S, 3), 246, np.float32); yy, xx = np.mgrid[0:S, 0:S]
a -= (((xx % 4) < 2) ^ ((yy % 4) < 2))[..., None] * 6; a -= blur_noise(0, S, 6)[..., None] * 8
im = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)); d = ImageDraw.Draw(im)
for o in (18, 30): d.rectangle((o, o, S - o, S - o), outline=hx('#b9cfb0'), width=3)
im.save(os.path.join(OUT, 'cloth.png'))

# wood: honey grain planks (table, chair frame, deck chair, fence rails)
S = 512; yy, xx = np.mgrid[0:S, 0:S].astype(np.float32); n = blur_noise(0, S, 3)
g = np.sin((yy + 18 * np.sin(xx / 70) + 25 * n) / 3.2) * .5 + .5
col = np.array(hx('#c79a62'), np.float32) * (1 - .16 * g[..., None]) * (1 - .06 * blur_noise(0, S, 30)[..., None])
Image.fromarray(np.clip(col, 0, 255).astype(np.uint8)).save(os.path.join(OUT, 'wood.png'))

# deck chair canvas: owner yellow #f2c230 and white stripes, cloth weave (stripes along v)
S = 512; a = np.zeros((S, S, 3), np.float32); st = ((np.arange(S) // 64) % 2 == 0)
a[:, st] = hx('#f2c230'); a[:, ~st] = hx('#f6f1e4'); a -= ((((xx % 3) < 1.5) ^ ((yy % 3) < 1.5)))[..., None] * 7
Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).save(os.path.join(OUT, 'canvas.png'))

def painted(draw_im, text, font_path, size, box, fill, jitter=2.5, outline=None, ow=0):
    """hand-painted letters: each letter its own tiny lift and turn, a soft brush edge (never a clean typed line)."""
    W, H = draw_im.size; f = ImageFont.truetype(font_path, size); x0, y0, x1, y1 = box
    widths = [f.getbbox(ch)[2] - f.getbbox(ch)[0] if ch != ' ' else size * .32 for ch in text]; sp = size * .06
    tot = sum(widths) + sp * (len(text) - 1); x = x0 + (x1 - x0 - tot) / 2; cy = (y0 + y1) / 2
    for ch, w in zip(text, widths):
        if ch != ' ':
            L = Image.new('RGBA', (int(size * 1.6), int(size * 1.6)), (0, 0, 0, 0)); dl = ImageDraw.Draw(L)
            bb = f.getbbox(ch); ox, oy = (L.size[0] - (bb[2] - bb[0])) / 2 - bb[0], (L.size[1] - (bb[3] - bb[1])) / 2 - bb[1]
            if outline: dl.text((ox, oy), ch, font=f, fill=outline, stroke_width=ow, stroke_fill=outline)
            dl.text((ox, oy), ch, font=f, fill=fill)
            L = L.rotate(R.uniform(-jitter, jitter), resample=Image.BICUBIC).filter(ImageFilter.GaussianBlur(.7))
            draw_im.alpha_composite(L, (int(x + w / 2 - L.size[0] / 2), int(cy - L.size[1] / 2 + R.uniform(-jitter, jitter))))
        x += w + sp

# hangar sign (invented airfield): AERODROME DE VILLEBRUNE, deep sage letters on a white board with a sage rule; 2048 x 340 (board 9.6 x 1.6 m)
im = Image.new('RGBA', (2048, 340), hx('#f7f6f0') + (255,)); d = ImageDraw.Draw(im)
d.rectangle((14, 14, 2034, 326), outline=hx('#5f7f62'), width=10); d.line((120, 262, 1928, 262), fill=hx('#9cb79a'), width=6)
painted(im, 'AÉRODROME DE VILLEBRUNE', SERIF, 172, (40, 30, 2008, 250), hx('#2f4a37') + (255,), jitter=1.4)
f = ImageFont.truetype(SANS, 40); t = 'AÉRO-CLUB  ·  ALT. 212 m'; d.text(((2048 - d.textlength(t, font=f)) / 2, 272), t, font=f, fill=hx('#5f7f62'))
im.convert('RGB').save(os.path.join(OUT, 'sign.png'))

# hazard plaque: DON'T TRY THIS AT HOME, black on safety yellow, black-yellow chevron border, 4 screw heads; 1024 x 720 (1.0 x .7 m)
W_, H_ = 1024, 720; im = Image.new('RGBA', (W_, H_), hx('#f5c518') + (255,)); d = ImageDraw.Draw(im)
for k in range(-H_, W_ + H_, 70):   # chevron band
    d.polygon([(k, 0), (k + 35, 0), (k + 35 - H_, H_), (k - H_, H_)], fill=(30, 28, 32))
d.rectangle((60, 60, W_ - 60, H_ - 60), fill=hx('#f5c518')); d.rectangle((60, 60, W_ - 60, H_ - 60), outline=(30, 28, 32), width=8)
d.polygon([(512, 92), (590, 232), (434, 232)], outline=(30, 28, 32), width=12); d.rectangle((503, 128, 521, 192), fill=(30, 28, 32)); d.ellipse((502, 202, 522, 222), fill=(30, 28, 32))
painted(im, "DON'T TRY", SANS, 132, (80, 250, W_ - 80, 410), (30, 28, 32, 255), jitter=1.0)
painted(im, 'THIS AT HOME', SANS, 116, (80, 430, W_ - 80, 600), (30, 28, 32, 255), jitter=1.0)
for x, y in ((30, 30), (W_ - 30, 30), (30, H_ - 30), (W_ - 30, H_ - 30)): d.ellipse((x - 12, y - 12, x + 12, y + 12), fill=(190, 192, 196), outline=(90, 90, 95), width=3)
im.convert('RGB').save(os.path.join(OUT, 'plaque.png'))

# poster: MEETING AERIEN 1978 (row 1, the year in the world): sky-blue poster, a white Cessna-like silhouette, cumulus, navy-free (sage + sky + cream); 600 x 860
W_, H_ = 600, 860; im = Image.new('RGBA', (W_, H_), hx('#f4efe1') + (255,)); d = ImageDraw.Draw(im)
d.rectangle((24, 24, W_ - 24, 600), fill=hx('#3d93ea'))
for cx, cy, r in ((150, 470, 70), (230, 450, 90), (330, 480, 70), (420, 300, 50), (480, 290, 60)): d.ellipse((cx - r, cy - r * .7, cx + r, cy + r * .7), fill=(255, 255, 255))
d.polygon([(120, 300), (480, 260), (490, 280), (130, 320)], fill=(255, 255, 255)); d.polygon([(250, 285), (330, 280), (345, 330), (255, 338)], fill=(255, 255, 255))
d.polygon([(455, 270), (500, 215), (512, 220), (490, 280)], fill=(255, 255, 255)); d.ellipse((108, 296, 128, 330), fill=hx('#2f4a37'))
painted(im, 'MEETING', SERIF, 92, (30, 600, W_ - 30, 700), hx('#2f4a37') + (255,), jitter=1.5)
painted(im, 'AÉRIEN 1978', SERIF, 74, (30, 700, W_ - 30, 790), hx('#3a7d3c') + (255,), jitter=1.5)
f = ImageFont.truetype(SANS, 26); t = 'VILLEBRUNE · 14 JUILLET'; d.text(((W_ - d.textlength(t, font=f)) / 2, 800), t, font=f, fill=hx('#5f7f62'))
im.convert('RGB').save(os.path.join(OUT, 'poster.png'))

# fuel pump face: AVGAS 100LL dial (real aviation term), cream face, sage letters; 512 x 512
im = Image.new('RGBA', (512, 512), hx('#f6f3ea') + (255,)); d = ImageDraw.Draw(im)
d.rounded_rectangle((40, 40, 472, 300), 30, outline=hx('#5f7f62'), width=8)
for k in range(3): d.rectangle((90 + k * 115, 110, 180 + k * 115, 200), fill=(40, 44, 48)); d.text((112 + k * 115, 118), '0', font=ImageFont.truetype(SANS, 70), fill=(240, 240, 230))
painted(im, 'AVGAS', SANS, 96, (40, 320, 472, 420), hx('#2f4a37') + (255,), jitter=1)
painted(im, '100LL', SANS, 60, (40, 420, 472, 490), hx('#3a7d3c') + (255,), jitter=1)
im.convert('RGB').save(os.path.join(OUT, 'pump.png'))

# windsock: 5 bands safety-orange / white (orange, never red), fabric weave; 512 x 256 (u along the sock)
im = Image.new('RGB', (512, 256)); d = ImageDraw.Draw(im)
for k in range(5): d.rectangle((k * 103, 0, (k + 1) * 103, 256), fill=hx('#f07a1a') if k % 2 == 0 else hx('#f7f4ee'))
a = np.asarray(im).astype(np.float32); yy, xx = np.mgrid[0:256, 0:512]; a -= (((xx % 4) < 2) ^ ((yy % 4) < 2))[..., None] * 8
Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).save(os.path.join(OUT, 'sock.png'))

# far field patchwork: wheat / pasture / ploughed / rape strips with soft row lines (one 1024 tile = 200 m)
im = Image.new('RGB', (1024, 1024)); d = ImageDraw.Draw(im); cols = ['#d9bf5a', '#8fbf3c', '#a3c84a', '#b78f5e', '#e3d36a', '#7fb236', '#c6ad57']
y = 0
while y < 1024:
    h = R.randint(70, 190); x = 0
    while x < 1024:
        w = R.randint(150, 420); c = hx(R.choice(cols)); d.rectangle((x, y, x + w, y + h), fill=c)
        for k in range(y, y + h, 6): d.line((x, k, x + w, k), fill=tuple(max(0, v - 10) for v in c), width=1)
        d.line((x, y, x, y + h), fill=(70, 110, 40), width=5); x += w
    d.line((0, y, 1024, y), fill=(70, 110, 40), width=5); y += h
im.filter(ImageFilter.GaussianBlur(.8)).save(os.path.join(OUT, 'fields.png'))
print('TEX_END')
