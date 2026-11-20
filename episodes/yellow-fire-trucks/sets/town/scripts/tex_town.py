# tex_town.py: every picture the PINE HOLLOW set needs, made with PIL OUTSIDE Blender (REGLES 3): tinted copies of the Poly Haven CC0
# textures (paint colour of THIS town, light and dark strokes kept), the story lettering (hand-painted), decals (oil, overspray, wear).
# python3 tex_town.py <assets/ph_town/tex> <out dir>     Prints TEX_END. No date or time goes into any picture.
import os, sys, math, random
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops
import numpy as np
SRC, OUT = sys.argv[1], sys.argv[2]; os.makedirs(OUT, exist_ok=True)
FB = '/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf'
FS = '/usr/share/fonts/opentype/inter/InterDisplay-Bold.otf'
if not os.path.exists(FS): FS = FB

def hexc(h): h = h.lstrip('#'); return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], float)

def tint(src, name, col, keep=.25, gain=1.0):
    """paint colour col with the texture's own light/dark strokes: out = col * lum/mean(lum), mixed with keep of the original."""
    im = np.asarray(Image.open(os.path.join(SRC, src + '_diff_1k.jpg')).convert('RGB'), float)
    lum = im.mean(2, keepdims=True); rel = lum / max(lum.mean(), 1)
    out = hexc(col)[None, None, :] * rel * gain; out = out * (1 - keep) + im * keep * (hexc(col).mean() / max(im.mean(), 1))
    Image.fromarray(np.clip(out, 0, 255).astype('uint8')).save(os.path.join(OUT, name + '_diff.jpg'), quality=90)
    for k in ('nor_gl', 'rough'):
        Image.open(os.path.join(SRC, '%s_%s_1k.jpg' % (src, k))).save(os.path.join(OUT, '%s_%s.jpg' % (name, k)), quality=92)

TINTS = [  # (source, name, paint, keep)
    ('weathered_plank_siding', 'clap_sage', '#a9b48c', .18), ('weathered_plank_siding', 'clap_cream', '#eadfc2', .15),
    ('weathered_plank_siding', 'clap_white', '#eeece4', .12), ('weathered_plank_siding', 'clap_blue', '#aab6c4', .15),
    ('weathered_plank_siding', 'clap_green', '#8f9f86', .15), ('weathered_plank_siding', 'clap_tan', '#cdb89a', .15),
    ('white_planks_clean', 'trim_white', '#f1ede2', .2), ('wooden_garage_door', 'baydoor', '#efe6cc', .2),
    ('concrete_block_wall', 'block_buff', '#cfc6b0', .35), ('concrete_floor_worn_001', 'yard', '#b4ada0', .55),
    ('concrete_pavement', 'walk', '#bdb6aa', .5), ('asphalt_02', 'asphalt', '#73747c', .45), ('leafy_grass', 'lawn', '#5f9a52', .45),
    ('grey_roof_01', 'roof_grey', '#5d5d63', .5), ('roof_slates_02', 'roof_green', '#56645a', .4), ('painted_plaster_wall', 'plaster_cream', '#e9dcbc', .3),
    ('bark_brown_02', 'pole_wood', '#6e5a48', .6), ('plank_flooring', 'floor_wood', '#9a7652', .55), ('forest_ground_04', 'ground_far', '#6c8a4e', .45),
    ('white_planks_clean', 'picket', '#f4f1e8', .15), ('concrete_floor_worn_001', 'bay_floor', '#9d978c', .55),
]

def board(name, w, h, bg, text_lines, fg, font=FB, edge=None, seed=1, sizes=None):
    """hand-painted sign: wobbled letters (each glyph a little rotated and shifted), brush shade, worn edge."""
    rnd = random.Random(seed); im = Image.new('RGB', (w, h), bg); d = ImageDraw.Draw(im)
    if edge: d.rectangle([8, 8, w - 9, h - 9], outline=edge, width=max(4, h // 30))
    n = len(text_lines); ys = [h * (i + .5) / n for i in range(n)]
    for i, t in enumerate(text_lines):
        sz = (sizes[i] if sizes else int(h / n * .62)); f = ImageFont.truetype(font, sz)
        tw = sum(f.getbbox(c)[2] - f.getbbox(c)[0] + sz * .06 for c in t); x = (w - tw) / 2
        for c in t:
            g = Image.new('RGBA', (sz * 2, sz * 2), (0, 0, 0, 0)); gd = ImageDraw.Draw(g)
            gd.text((sz * .5 + 2, sz * .3 + 3), c, font=f, fill=(0, 0, 0, 90)); gd.text((sz * .5, sz * .3), c, font=f, fill=fg)
            g = g.rotate(rnd.uniform(-3.5, 3.5), resample=Image.BICUBIC)
            im.paste(g, (int(x - sz * .5 + rnd.uniform(-1.5, 1.5)), int(ys[i] - sz * .85 + rnd.uniform(-2, 2))), g)
            x += f.getbbox(c)[2] - f.getbbox(c)[0] + sz * .06
    a = np.asarray(im, float); yy, xx = np.mgrid[0:h, 0:w]
    grain = (np.sin(xx * .9 + np.sin(yy * .05) * 6) * .5 + .5) * 10 - 5           # brush strokes along the board
    a += grain[..., None]; rng = np.random.default_rng(seed)
    flake = rng.random((h // 4 + 1, w // 4 + 1)) > .985; flake = np.kron(flake, np.ones((4, 4)))[:h, :w]
    a[flake > 0] = a[flake > 0] * .72 + 40
    Image.fromarray(np.clip(a, 0, 255).astype('uint8')).save(os.path.join(OUT, name + '.png'))

def decal(name, w, h, fn, seed=1):
    rng = np.random.default_rng(seed); im = Image.new('RGBA', (w, h), (0, 0, 0, 0)); fn(ImageDraw.Draw(im), rng, w, h, im)
    im.save(os.path.join(OUT, name + '.png'))

def oil(d, rng, w, h, im):
    for k in range(26):
        cx, cy = rng.normal(w / 2, w * .16), rng.normal(h / 2, h * .2); r = abs(rng.normal(w * .08, w * .05)) + 6
        d.ellipse([cx - r, cy - r * .7, cx + r, cy + r * .7], fill=(28, 24, 22, int(rng.uniform(40, 110))))
    im2 = im.filter(ImageFilter.GaussianBlur(5)); im.paste(im2)

def spray(d, rng, w, h, im):          # lemon overspray fan on the concrete (#E3EA22, heaviest at the near edge)
    for k in range(9000):
        x = rng.uniform(0, w); y = h * (1 - rng.power(2.2)); r = rng.uniform(.6, 2.6)
        d.ellipse([x - r, y - r, x + r, y + r], fill=(227, 234, 34, int(rng.uniform(60, 220) * (1 - y / h * .7))))

def tracks(d, rng, w, h, im):          # pale worn tyre tracks out of bay 2
    for x0 in (w * .22, w * .78):
        for k in range(1400):
            x = rng.normal(x0, w * .05); y = rng.uniform(0, h); d.point((x, y), fill=(225, 220, 205, int(rng.uniform(20, 70))))
    im2 = im.filter(ImageFilter.GaussianBlur(2)); im.paste(im2)

def line(d, rng, w, h, im):            # the yard line: white paint, chipped edges, a ghost of an older wobbly line beside it
    for y in range(h):
        wob = math.sin(y * .05) * 4 + math.sin(y * .013) * 7
        d.line([(w * .70 + wob, y), (w * .70 + wob + w * .10, y)], fill=(236, 233, 222, 70))
        d.line([(w * .2, y), (w * .55, y)], fill=(244, 242, 234, 255))
    for k in range(700):
        x = rng.choice([rng.uniform(w * .19, w * .23), rng.uniform(w * .52, w * .56), rng.uniform(w * .2, w * .55)]); y = rng.uniform(0, h); r = rng.uniform(1, 4)
        d.ellipse([x - r, y - r, x + r, y + r], fill=(0, 0, 0, 0))

def boot(d, rng, w, h, im):            # one lemon boot print trail toward the door
    for i in range(6):
        x = w * (.3 if i % 2 else .62); y = h - (i + .5) * h / 6.3
        a = int(200 - i * 30); d.rounded_rectangle([x - 14, y - 38, x + 14, y + 10], 10, fill=(227, 234, 34, a)); d.ellipse([x - 13, y + 14, x + 13, y + 34], fill=(227, 234, 34, a))

def stopbar(d, rng, w, h, im):
    d.rectangle([0, 0, w, h], fill=(242, 240, 232, 255))
    for k in range(900):
        x, y = rng.uniform(0, w), rng.uniform(0, h); r = rng.uniform(1, 5); d.ellipse([x - r, y - r, x + r, y + r], fill=(0, 0, 0, 0))

def window_lit(name, base, seed):      # a lit 1970s window: warm lamp, curtain sides, a shade line, a sill plant shadow
    rnd = random.Random(seed); w, h = 128, 192; im = Image.new('RGB', (w, h), base); d = ImageDraw.Draw(im)
    for y in range(h): d.line([(0, y), (w, y)], fill=tuple(int(c * (1 - .25 * y / h)) for c in base))
    cur = (rnd.choice([(236, 214, 170), (214, 200, 222), (226, 226, 210)]))
    d.rectangle([0, 0, 26, h], fill=cur); d.rectangle([w - 26, 0, w, h], fill=cur); d.rectangle([0, 0, w, 30 + rnd.randint(0, 40)], fill=tuple(int(c * .85) for c in cur))
    if rnd.random() < .5: d.ellipse([w * .4, h * .7, w * .6, h * .95], fill=(60, 52, 48))
    im.save(os.path.join(OUT, name + '.png'))

def eye_chart():
    w, h = 400, 640; im = Image.new('RGB', (w, h), '#f3f0e6'); d = ImageDraw.Draw(im)
    d.rectangle([6, 6, w - 7, h - 7], outline='#2b2b30', width=5)
    rows = [('E', 150), ('R', 112), ('E D', 80), ('G O E S', 58), ('F I R S T', 44), ('L P E D', 32), ('P E C F D', 24), ('E D F C Z P', 18)]
    y = 26
    for i, (t, s) in enumerate(rows):
        f = ImageFont.truetype(FS, s); tw = d.textlength(t, font=f); col = '#1d1d22'
        d.text(((w - tw) / 2, y), t, font=f, fill=col); y += s * 1.22 + 6
        d.text((w - 40, y - s * .9), str(i + 1), font=ImageFont.truetype(FS, 14), fill='#555')
    im.save(os.path.join(OUT, 'eye_chart.png'))

def red_truck_photo():
    w, h = 300, 220; im = Image.new('RGB', (w, h), '#e8e0cc'); d = ImageDraw.Draw(im)
    d.rectangle([0, 0, w, h * .62], fill='#9fb4d0'); d.rectangle([0, h * .62, w, h], fill='#a49c8c')
    d.rectangle([40, 90, 250, 160], fill='#c3151c'); d.rectangle([40, 70, 110, 120], fill='#c3151c'); d.rectangle([52, 78, 100, 104], fill='#cfe0ea')
    for x in (80, 210): d.ellipse([x - 20, 145, x + 20, 185], fill='#1c1c1c')
    d.rectangle([120, 96, 240, 102], fill='#d8d8d8'); im = im.filter(ImageFilter.GaussianBlur(.8)); im.save(os.path.join(OUT, 'photo_truck.png'))

if __name__ == '__main__':
    for s, n, c, k in TINTS: tint(s, n, c, k)
    board('sign_station', 2048, 300, '#f1ead6', ['PINE HOLLOW FIRE DEPT.'], '#1f2e55', edge='#1f2e55', seed=8, sizes=[112])
    board('sign_engine', 1024, 200, '#f1ead6', ['ENGINE No. 1'], '#1f2e55', edge='#1f2e55', seed=9)
    board('sign_eye', 1024, 512, '#2a3a66', ['EYE', 'DOCTOR'], '#f3ecd6', edge='#d9b66a', seed=3, sizes=[200, 150])
    board('sign_shopfront', 2048, 256, '#2a3a66', ['EYE DOCTOR  -  EXAMS  -  GLASSES'], '#f3ecd6', edge='#d9b66a', seed=4, sizes=[96])
    board('sign_chief', 512, 160, '#c9a85a', ['CHIEF'], '#2a2216', edge='#7a6230', seed=5)
    board('blade_main', 1024, 160, '#22336a', ['MAIN ST'], '#f4f2ea', font=FS, edge='#f4f2ea', seed=6, sizes=[104])
    board('blade_elm', 1024, 160, '#22336a', ['ELM ST'], '#f4f2ea', font=FS, edge='#f4f2ea', seed=7, sizes=[104])
    board('tower_band', 4096, 512, '#dcdfe1', ['PINE HOLLOW'], '#22336a', seed=10, sizes=[300])
    board('sign_park', 1024, 256, '#3e5a3a', ['PINE HOLLOW PARK'], '#f1ead6', edge='#f1ead6', seed=11, sizes=[110])
    board('door_glass', 512, 256, '#2a2c33', ['OPEN'], '#e9d8a4', seed=12)
    decal('oil', 512, 512, oil, 2); decal('spray', 1024, 512, spray, 3); decal('tracks', 512, 1024, tracks, 4); decal('yardline', 128, 2048, line, 5)
    decal('boot', 256, 512, boot, 6)
    def puddle(d, rng, w, h, im):
        for k in range(14):
            cx, cy = rng.normal(w / 2, w * .12), rng.normal(h / 2, h * .1); r = rng.uniform(w * .08, w * .22); d.ellipse([cx - r, cy - r * .6, cx + r, cy + r * .6], fill=(70, 74, 80, 255))
        im.paste(im.filter(ImageFilter.GaussianBlur(4)))
    def cracks(d, rng, w, h, im):
        for k in range(7):
            x, y = rng.uniform(0, w), rng.uniform(0, h); a = rng.uniform(0, 6.28)
            for s in range(60):
                a += rng.normal(0, .35); nx, ny = x + math.cos(a) * 6, y + math.sin(a) * 6; d.line([(x, y), (nx, ny)], fill=(40, 38, 34, 200), width=2); x, y = nx, ny
    def keepclear(d, rng, w, h, im):
        f = ImageFont.truetype(FS, 230); d.text((w / 2, h / 2), 'KEEP CLEAR', font=f, fill=(244, 242, 234, 235), anchor='mm')
        for k in range(1500):
            x, y = rng.uniform(0, w), rng.uniform(0, h); r = rng.uniform(1, 4); d.ellipse([x - r, y - r, x + r, y + r], fill=(0, 0, 0, 0))
    decal('puddle', 512, 512, puddle, 8); decal('cracks', 1024, 1024, cracks, 9); decal('keepclear', 2048, 320, keepclear, 10); decal('stopbar', 1024, 64, stopbar, 7)
    for i, b in enumerate([(250, 196, 120), (255, 214, 150), (246, 180, 104), (255, 226, 170)]): window_lit('win_lit_%d' % i, b, i)
    for i in list(range(4)) + [9]:                                       # by day the same windows: dark glass with a sky sheen, curtains faint
        src = Image.open(os.path.join(OUT, 'win_lit_%d.png' % (i if i < 4 else 0))).convert('RGB'); a = np.asarray(src, float) * (.22 if i < 4 else .08)
        h, w = a.shape[:2]; yy = np.linspace(1, 0, h)[:, None, None]; sky = np.array([150, 175, 205])[None, None, :] * (.25 + .35 * yy)
        Image.fromarray(np.clip(a + sky, 0, 255).astype('uint8')).save(os.path.join(OUT, 'win_day_%d.png' % i))
    eye_chart(); red_truck_photo()
    print('TEX_END')
