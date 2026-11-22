"""tex_toilet.py: PIL pictures for the toilet place (lettering word for word from LOOK_INVENTORY A3/H3). python3 tex_toilet.py -> ../tex/*.png"""
import math, os, random
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps
T = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tex'); os.makedirs(T, exist_ok=True)
def font(sz, bold=True):
    for p in ('/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'):
        if os.path.exists(p): return ImageFont.truetype(p, sz)
    return ImageFont.load_default()
def stars(d, w, h, n, seed):
    r = random.Random(seed)
    for _ in range(n):
        x, y, s = r.random() * w, r.random() * h, r.choice((1, 1, 1, 2, 2, 3)); v = r.randint(150, 250)
        d.ellipse((x - s, y - s, x + s, y + s), fill=(v, v, min(255, v + 10)))
# ---- window view, day: navy space + stars, Earth limb in the lower half (ocean, haze rim, clouds)
W, H = 2048, 1536
im = Image.new('RGB', (W, H), '#010019'); d = ImageDraw.Draw(im); stars(d, W, H, 700, 1)
cx, cy, R = W * .4, H * .56 + 1900, 1900     # round 2: a curved limb (was a flat band, R 4200)
glow = Image.new('RGB', (W, H), (0, 0, 0)); g = ImageDraw.Draw(glow)
g.ellipse((cx - R - 26, cy - R - 26, cx + R + 26, cy + R + 26), fill='#a2f8fe'); glow = glow.filter(ImageFilter.GaussianBlur(34))
im = Image.composite(glow, im, glow.convert('L').point(lambda v: min(255, v * 2)))
d = ImageDraw.Draw(im); d.ellipse((cx - R, cy - R, cx + R, cy + R), fill='#7bc9f7'); d.ellipse((cx - R, cy - R + 46, cx + R, cy + R + 46), fill='#5593f3')
cl = Image.new('L', (W, H), 0); c = ImageDraw.Draw(cl); r = random.Random(4)
for _ in range(70):
    x = r.random() * W; y = cy - math.sqrt(max(0, R * R - (x - cx) ** 2)) + 90 + r.random() * H * .4; n = r.randint(4, 9)
    for k in range(n):
        s = r.randint(18, 60); yy = y + r.randint(-18, 18)
        c.ellipse((x + k * 38 - s, yy - s * .45, x + k * 38 + s, yy + s * .45), fill=255)
cl = cl.filter(ImageFilter.GaussianBlur(3)); im.paste(Image.new('RGB', (W, H), '#e0fcfb'), (0, 0), cl); im.save(os.path.join(T, 'earth_day.png'))
# ---- window view, night: stars only
im = Image.new('RGB', (W, H), '#01001b'); d = ImageDraw.Draw(im); stars(d, W, H, 1100, 7); im.save(os.path.join(T, 'space_stars.png'))
# ---- poster "FLUSH" (the whole poster is MIRRORED in the reference: saved mirrored, as he shows it)
P = Image.new('RGB', (800, 1000), '#f9faf8'); d = ImageDraw.Draw(P); d.rectangle((0, 0, 800, 190), fill='#151e47')
d.text((400, 78), 'FLUSH', font=font(110), fill='#ffffff', anchor='mm'); d.text((400, 158), 'CREW · ROTA', font=font(34), fill='#c9d2f2', anchor='mm')
rows = [('MON', '07:00', 1), ('MON', '21:00', 1), ('TUE', '07:00', 1), ('TUE', '21:00', 2), ('WED', '07:00', 0), ('WED', '21:00', 0)]
for i, (day, tm, st) in enumerate(rows):
    y = 250 + i * 122; d.rectangle((60, y, 140, y + 80), outline='#111111', width=8)
    if st == 1: d.line((72, y + 40, 96, y + 66, 132, y + 12), fill='#1c8a3a', width=12)
    d.text((190, y + 40), tm, font=font(64), fill='#111111', anchor='lm'); d.text((740, y + 40), day, font=font(64), fill='#111111', anchor='rm')
    if st == 2:
        d.line((40, y + 52, 250, y + 30, 520, y + 50, 770, y + 28), fill='#d92323', width=12); d.ellipse((520, y - 6, 620, y + 86), outline='#d92323', width=10)
ImageOps.mirror(P).save(os.path.join(T, 'poster_flush.png'))
# ---- yellow sign plates
def sign(name, lines, size, fs, arrow=False):
    S = Image.new('RGB', size, '#f1e126'); d = ImageDraw.Draw(S); w, h = size; d.rectangle((14, 14, w - 15, h - 15), outline='#000000', width=8)
    tw = w - (150 if arrow else 0)
    for i, ln in enumerate(lines): d.text((tw / 2 + 6, h * (i + 1) / (len(lines) + 1)), ln, font=font(fs), fill='#000000', anchor='mm')
    if arrow:
        ax = w - 95; d.rectangle((ax - 16, h * .2, ax + 16, h * .6), fill='#000000'); d.polygon((ax - 50, h * .58, ax + 50, h * .58, ax, h * .86), fill='#000000')
    S.save(os.path.join(T, name))
sign('sign_waste_line.png', ['WASTE LINE'], (1000, 280), 150)
sign('sign_waste_vent.png', ['WASTE', 'VENT'], (800, 600), 190, arrow=True)
# ---- framed kid drawing (wide, on the shelf): green field, sun, stick figure
K = Image.new('RGB', (400, 480), '#f4f1e6'); d = ImageDraw.Draw(K); d.rectangle((0, 300, 400, 480), fill='#58b947'); d.ellipse((270, 40, 350, 120), fill='#f6c62d')
d.ellipse((130, 130, 210, 210), outline='#222', width=8); d.line((170, 210, 170, 330), fill='#222', width=8); d.line((120, 250, 220, 250), fill='#222', width=8)
d.line((170, 330, 130, 400), fill='#222', width=8); d.line((170, 330, 210, 400), fill='#222', width=8); K.save(os.path.join(T, 'kid_drawing.png'))
print('tex ok')
