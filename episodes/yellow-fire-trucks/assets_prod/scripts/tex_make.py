# tex_make.py: every texture this film changes on the downloaded assets, drawn with PIL OUTSIDE Blender (REGLES_METHODE 3).
# python3 tex_make.py <tex_src dir> <out dir>
# In: the textures dumped by bl_extract.py. Out (PNG): truck_letters.png (replaces the ALF's "firetruck_writing" decal: PINE HOLLOW / FIRE DEPT. /
# ENGINE No. 1, gold leaf with dark outline and shade), newspaper.png (masking paper with tape), wear.png (R soot, G water stains, B chips; tiles),
# comp_label.png (the compressor's CE label replaced by a stencil P.H.F.D.). No date or time is written into any image (REGLES 4). Deterministic (seeded).
import sys, os, random, math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops

SRC, OUT = sys.argv[1], sys.argv[2]
os.makedirs(OUT, exist_ok=True)
FD = '/usr/share/fonts/truetype/'
SERIF_B = FD + 'dejavu/DejaVuSerif-Bold.ttf'
SANS_B = FD + 'dejavu/DejaVuSans-Bold.ttf'
SANS = FD + 'dejavu/DejaVuSans.ttf'
LSERIF_B = FD + 'liberation/LiberationSerif-Bold.ttf'

# ---------------------------------------------------------------- 1. gold-leaf lettering (truck decal)
# The ALF decal UVs (bl_extract / uv dump, Blender UV v up): band A v .034-.165 (door line 1, front line 1), band B v .165-.296 (line 2),
# band C v .397-.576 (door line 3 and the rear), band D v .751-1.0 (body side behind the cab). The shipped PNG is stored upside down
# (glyph tops toward v small), so we draw upright and flip vertically at the end, as the original.
S = 2048
GOLD_HI, GOLD_MID, GOLD_LO = (250, 226, 150), (214, 160, 52), (150, 98, 26)
INK = (28, 12, 6)


def gold_fill(w, h, seed):
    rnd = random.Random(seed)
    y = np.linspace(0, 1, h)[:, None]
    # leaf: bright top, a dark band below the middle, a bright lower lip (the classic gold-leaf "burnish" band)
    k = 0.5 + 0.5 * np.cos((y - 0.30) * 2 * math.pi * 0.95)
    hi, mid, lo = (np.array(c, float) for c in (GOLD_HI, GOLD_MID, GOLD_LO))
    col = np.where(k[..., None] > 0.5, mid + (hi - mid) * ((k[..., None] - 0.5) * 2), lo + (mid - lo) * (k[..., None] * 2))
    col = np.repeat(col, w, axis=1)
    # fine leaf grain + a few holidays (pin holes in the leaf showing the dark size underneath)
    g = np.random.default_rng(seed).normal(0, 6, (h, w, 1))
    col = np.clip(col + g, 0, 255)
    img = Image.fromarray(col.astype(np.uint8), 'RGB')
    d = ImageDraw.Draw(img)
    for _ in range(int(w * h / 9000)):
        x, yy = rnd.randrange(w), rnd.randrange(h); r = rnd.choice((1, 1, 2))
        d.ellipse((x - r, yy - r, x + r, yy + r), fill=(120, 70, 20))
    return img


def letter_line(canvas, text, box, font_path, seed, track=0.04, fit_h=0.78):
    """Hand-laid line: each letter its own tilt and baseline, outline + drop shade, fitted into box (x0, y0, x1, y1) in canvas px."""
    rnd = random.Random(seed)
    x0, y0, x1, y1 = box; bw, bh = x1 - x0, y1 - y0
    size = int(bh * fit_h)
    while True:
        f = ImageFont.truetype(font_path, size)
        widths = [f.getbbox(c)[2] - f.getbbox(c)[0] if c != ' ' else size * 0.32 for c in text]
        tot = sum(widths) + track * size * (len(text) - 1)
        if tot <= bw * 0.96 or size < 10: break
        size = int(size * 0.95)
    ow = max(3, size // 16); sh = max(4, size // 11)
    pad = ow + sh + 6
    x = x0 + (bw - tot) / 2
    asc = f.getbbox('H')
    for c, w in zip(text, widths):
        if c == ' ': x += w + track * size; continue
        bb = f.getbbox(c); cw, ch = bb[2] - bb[0], asc[3] - asc[1] + size // 3
        L = Image.new('L', (int(cw + 2 * pad), int(ch + 2 * pad + size // 3)), 0)
        ImageDraw.Draw(L).text((pad - bb[0], pad - asc[1]), c, font=f, fill=255)
        outl = L.filter(ImageFilter.MaxFilter(2 * ow + 1))
        shade = ImageChops.offset(outl, sh, sh)
        ang = rnd.uniform(-1.6, 1.6); dy = rnd.uniform(-bh * 0.018, bh * 0.018)
        L, outl, shade = (im.rotate(ang, resample=Image.BICUBIC) for im in (L, outl, shade))
        px, py = int(x - pad), int(y0 + (bh - (asc[3] - asc[1])) / 2 - pad + dy)
        canvas.paste((*INK, 255), (px, py), shade.point(lambda v: int(v * 0.85)))
        canvas.paste((*INK, 255), (px, py), outl)
        gf = gold_fill(L.size[0], L.size[1], seed * 31 + ord(c)).convert('RGBA')
        canvas.paste(gf, (px, py), L)
        x += w + track * size


def make_letters():
    cv = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    U = lambda u: int(u * S)
    letter_line(cv, 'PINE HOLLOW', (U(.17), U(.040), U(.83), U(.162)), SERIF_B, 1, fit_h=.80)
    letter_line(cv, 'FIRE DEPT.', (U(.22), U(.172), U(.78), U(.292)), SERIF_B, 2, fit_h=.74)
    letter_line(cv, 'ENGINE No. 1', (U(.20), U(.405), U(.74), U(.570)), SERIF_B, 3, fit_h=.66)
    letter_line(cv, 'PINE HOLLOW F.D.', (U(.06), U(.775), U(.94), U(.985)), SERIF_B, 4, fit_h=.62, track=.08)
    cv = cv.transpose(Image.FLIP_TOP_BOTTOM)
    cv.save(os.path.join(OUT, 'truck_letters.png'))


# ---------------------------------------------------------------- 2. newspaper masking with tape (tile 0.8 m)
def make_newspaper():
    N = 1024; rnd = random.Random(7)
    im = Image.new('RGB', (N, N), (232, 226, 208)); d = ImageDraw.Draw(im)
    big = ImageFont.truetype(SERIF_B, 64); mid = ImageFont.truetype(SERIF_B, 40); small = ImageFont.truetype(SANS, 11)
    d.text((60, 40), 'PINE HOLLOW GAZETTE', font=big, fill=(30, 28, 26))
    d.line((60, 120, 964, 120), fill=(30, 28, 26), width=4); d.line((60, 128, 964, 128), fill=(30, 28, 26), width=1)
    d.text((60, 140), 'NEW ENGINE ARRIVES', font=mid, fill=(25, 24, 22))
    d.rectangle((60, 200, 420, 430), fill=(150, 146, 136))            # photo block, halftone
    for yy in range(200, 430, 6):
        for xx in range(60, 420, 6):
            r = rnd.uniform(0.6, 2.6); d.ellipse((xx - r + 3, yy - r + 3, xx + r + 3, yy + r + 3), fill=(70, 68, 64))
    words = 'town council engine pumper ladder chief station bell parade mayor ribbon brass hose water street crossing'.split()
    for col, (cx0, cx1) in enumerate(((440, 690), (710, 964), (60, 340), (360, 640), (660, 964))):
        ytop, ybot = (200, 430) if col < 2 else (450, 1000)
        for yy in range(ytop, ybot, 15):
            x = cx0
            while x < cx1 - 20:
                w = rnd.choice(words); tw = small.getlength(w)
                if x + tw > cx1: break
                d.text((x, yy), w, font=small, fill=(60, 58, 55)); x += tw + 5
    # a fold crease and yellowing
    d.line((0, 512, N, 520), fill=(205, 198, 178), width=3)
    im = im.filter(ImageFilter.GaussianBlur(0.5))
    # tape strips on two edges (the tile repeats: every sheet is taped to the next)
    tape = Image.new('RGBA', (N, N), (0, 0, 0, 0)); td = ImageDraw.Draw(tape)
    for k in range(0, N, 6):
        j = rnd.uniform(-2, 2)
        td.rectangle((k, int(0 + j), k + 6, int(46 + j)), fill=(214, 196, 148, 235))
        td.rectangle((int(0 + j), k, int(46 + j), k + 6), fill=(214, 196, 148, 235))
    im.paste(tape, (0, 0), tape)
    im.save(os.path.join(OUT, 'newspaper.png'))


# ---------------------------------------------------------------- 3. wear mask, tiles every 2 m: R soot, G water stains, B stone chips
def fbm(n, seed, octaves=5, base=4):
    rng = np.random.default_rng(seed); acc = np.zeros((n, n)); amp = 1.0
    for o in range(octaves):
        f = base * 2 ** o
        g = rng.random((f, f))
        im = Image.fromarray((g * 255).astype(np.uint8)).resize((n, n), Image.BICUBIC)  # not exactly tileable at the seam: blended below
        acc += amp * np.asarray(im, float) / 255; amp *= 0.5
    acc -= acc.min(); acc /= acc.max()
    # make it tile: cross-fade with the half-shifted copy at the borders
    sh = np.roll(np.roll(acc, n // 2, 0), n // 2, 1)
    x = np.abs(np.linspace(-1, 1, n)); w = np.clip((np.maximum(x[:, None], x[None, :]) - 0.6) / 0.4, 0, 1)
    return acc * (1 - w) + sh * w


def make_wear():
    N = 1024; rnd = random.Random(11)
    soot = np.clip((fbm(N, 1) - 0.45) * 2.2, 0, 1)
    # water stains: vertical streaks running down from random starts, with a tide line at the bottom
    st = Image.new('L', (N, N), 0); d = ImageDraw.Draw(st)
    for _ in range(70):
        x = rnd.randrange(N); y0 = rnd.randrange(N); L = rnd.randrange(60, 380); w = rnd.uniform(2, 9)
        for k in range(L):
            yy = (y0 + k) % N; xx = x + 3 * math.sin(k / 37.0)
            v = int(150 * (0.4 + 0.6 * k / L))
            d.line((xx - w / 2, yy, xx + w / 2, yy), fill=v)
        d.ellipse((x - w, (y0 + L) % N - w * 0.6, x + w, (y0 + L) % N + w * 0.6), fill=220)
    st = st.filter(ImageFilter.GaussianBlur(1.2))
    stain = np.asarray(st, float) / 255 * np.clip(fbm(N, 2, 3) * 1.4, 0, 1)
    # chips: small sharp irregular flakes
    ch = Image.new('L', (N, N), 0); d = ImageDraw.Draw(ch)
    for _ in range(260):
        x, y = rnd.randrange(N), rnd.randrange(N); r = rnd.uniform(1.2, 4.5)
        pts = [(x + r * rnd.uniform(.5, 1.3) * math.cos(a), y + r * rnd.uniform(.5, 1.3) * math.sin(a)) for a in np.linspace(0, 2 * math.pi, 7)[:-1]]
        d.polygon(pts, fill=255)
    chips = np.asarray(ch, float) / 255
    rgb = np.stack([soot, stain, chips], -1)
    Image.fromarray((rgb * 255).astype(np.uint8), 'RGB').save(os.path.join(OUT, 'wear.png'))


# ---------------------------------------------------------------- 4. compressor label -> stencil P.H.F.D. on the tank paint
def make_comp_label(orient):
    src = Image.open(os.path.join(SRC, 'comp__Image_3.png')).convert('RGBA'); W, H = src.size
    base = Image.open(os.path.join(SRC, 'comp__Image_0.png')).convert('RGB')
    paint = base.resize((64, 64)).resize((8, 8)).getpixel((1, 1))      # the tank's own navy
    # region of "label 2" (uv u .011-.347, v .013-.989), drawn landscape then turned to the UV layout
    x0, x1 = int(.011 * W), int(.509 * W); r0, r1 = int((1 - .989) * H), int((1 - .013) * H)
    lw, lh = r1 - r0, x1 - x0
    L = Image.new('RGBA', (lw, lh), (*paint, 255)); d = ImageDraw.Draw(L)
    f1 = ImageFont.truetype(SANS_B, int(lh * .42)); f2 = ImageFont.truetype(SANS_B, int(lh * .15))
    def stencil(text, f, cy):
        tw = f.getlength(text); x = (lw - tw) / 2
        m = Image.new('L', (lw, lh), 0); md = ImageDraw.Draw(m); md.text((x, cy), text, font=f, fill=255)
        # stencil bridges: two thin vertical cuts through every letter, sprayed edge = slight blur + speckle
        mm = np.asarray(m, float)
        bridge = np.ones(lw); step = max(6, int(f.size * .55))
        for k in range(int(x), int(x + tw), step): bridge[k + step // 2: k + step // 2 + max(2, f.size // 18)] = 0
        mm = mm * bridge[None, :]
        rng = np.random.default_rng(5); mm *= (rng.random(mm.shape) > 0.06)
        m = Image.fromarray(mm.astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.0))
        L.paste((236, 230, 210, 255), (0, 0), m)
    stencil('P.H.F.D.', f1, lh * .18)
    stencil('ENGINE No. 1  SHOP', f2, lh * .68)
    L = {'cw': L.rotate(-90, expand=True), 'ccw': L.rotate(90, expand=True), 'cwf': L.rotate(-90, expand=True).transpose(Image.FLIP_TOP_BOTTOM),
         'ccwf': L.rotate(90, expand=True).transpose(Image.FLIP_TOP_BOTTOM)}[orient]
    out = src.copy(); out.paste(L.resize((x1 - x0, r1 - r0)), (x0, r0))
    out.save(os.path.join(OUT, 'comp_label.png'))


if __name__ == '__main__':
    make_letters(); make_newspaper(); make_wear(); make_comp_label(os.environ.get('COMP_LABEL_ORIENT', 'cwf'))
    print('TEX_DONE', sorted(os.listdir(OUT)))
