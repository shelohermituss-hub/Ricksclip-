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


LETTER_SETS = {   # round 2: one decal per truck of the story (same UV layout); name -> (line 1, line 2, line 3, body side)
    'truck_letters': ('PINE HOLLOW', 'FIRE DEPT.', 'ENGINE No. 1', 'PINE HOLLOW F.D.'),
    'truck_letters_e2': ('PINE HOLLOW', 'FIRE DEPT.', 'ENGINE No. 2', 'PINE HOLLOW F.D.'),     # the Chief's older pumper, bay 2
    'truck_letters_dal14': ('DALLAS', 'FIRE DEPT.', 'ENGINE No. 14', 'DALLAS FIRE DEPT.'),      # Dallas pair, red
    'truck_letters_dal22': ('DALLAS', 'FIRE DEPT.', 'ENGINE No. 22', 'DALLAS FIRE DEPT.')}      # Dallas pair, lime


def make_letters():
    for k, (l1, l2, l3, l4) in LETTER_SETS.items():
        cv = Image.new('RGBA', (S, S), (0, 0, 0, 0))
        U = lambda u: int(u * S)
        letter_line(cv, l1, (U(.17), U(.040), U(.83), U(.162)), SERIF_B, 1, fit_h=.80)
        letter_line(cv, l2, (U(.22), U(.172), U(.78), U(.292)), SERIF_B, 2, fit_h=.74)
        letter_line(cv, l3, (U(.20), U(.405), U(.74), U(.570)), SERIF_B, 3, fit_h=.66)
        letter_line(cv, l4, (U(.06), U(.775), U(.94), U(.985)), SERIF_B, 4, fit_h=.62, track=.08)
        cv.transpose(Image.FLIP_TOP_BOTTOM).save(os.path.join(OUT, k + '.png'))


# ---------------------------------------------------------------- 2. newspaper masking with tape (tile 1.2 m; round 2: must READ as a newspaper at a
# medium shot: black masthead bar, two big headlines, column rules, dense grey text columns, halftone photos), kraft paper for the tyres
def make_newspaper():
    N = 2048; rnd = random.Random(7)
    im = Image.new('RGB', (N, N), (226, 219, 199)); d = ImageDraw.Draw(im)
    INKC = (22, 21, 20)
    mast = ImageFont.truetype(LSERIF_B, 150); h1 = ImageFont.truetype(SANS_B, 132); h2 = ImageFont.truetype(SERIF_B, 84); small = ImageFont.truetype(SANS, 17)
    dateline = ImageFont.truetype(SANS_B, 26)
    def page(ox, oy, head, sub, seed):
        r = random.Random(seed)
        d.text((ox + 30, oy + 10), 'PINE HOLLOW GAZETTE', font=mast, fill=INKC)
        d.rectangle((ox + 30, oy + 178, ox + 2000, oy + 214), fill=INKC)
        d.text((ox + 44, oy + 181), 'VOL. LXXXI  No. 214        FIVE CENTS        PINE HOLLOW\'S OWN DAILY', font=dateline, fill=(226, 219, 199))
        d.text((ox + 30, oy + 228), head, font=h1, fill=INKC)
        d.text((ox + 30, oy + 380), sub, font=h2, fill=(35, 33, 31))
        # photo with halftone + caption
        px0, py0, px1, py1 = ox + 30, oy + 500, ox + 760, oy + 980
        for yy in range(py0, py1, 9):
            for xx in range(px0, px1, 9):
                v = 0.5 + 0.35 * math.sin(xx / 70.0) * math.cos(yy / 55.0) + r.uniform(-.15, .15)
                rr = 1 + 3.6 * max(0, min(1, v)); d.ellipse((xx + 4 - rr, yy + 4 - rr, xx + 4 + rr, yy + 4 + rr), fill=(48, 46, 44))
        d.rectangle((px0, py0, px1, py1), outline=INKC, width=3)
        # text columns with rules
        cols = [(790, 1180), (1210, 1600), (1630, 2010)]
        words = 'the town council voted the new pumper engine arrived from the works on tuesday chief says ladder bell brass hose mayor ribbon parade'.split()
        for i, (c0, c1) in enumerate(cols):
            d.line((ox + c0 - 15, oy + 500, ox + c0 - 15, oy + 1990), fill=(60, 58, 55), width=2)
            yy = oy + 500
            if i == 0: d.text((ox + c0, yy), 'ENGINE No. 1', font=ImageFont.truetype(SANS_B, 40), fill=INKC); yy += 60
            while yy < oy + 1980:
                x = ox + c0
                while x < ox + c1 - 30:
                    w = r.choice(words); tw = small.getlength(w)
                    if x + tw > ox + c1: break
                    d.text((x, yy), w, font=small, fill=(52, 50, 47)); x += tw + 7
                yy += 23
                if r.random() < .03: yy += 23
        for yy in range(oy + 1010, oy + 1990, 23):     # the photo column's text
            x = ox + 30
            while x < ox + 740:
                w = r.choice(words); tw = small.getlength(w)
                if x + tw > ox + 760: break
                d.text((x, yy), w, font=small, fill=(52, 50, 47)); x += tw + 7
    page(60, 80, 'NEW ENGINE ARRIVES', 'Mayor to cut the ribbon at noon', 7)
    d.line((0, 1010, N, 1022), fill=(200, 192, 170), width=4)     # the fold
    im = im.filter(ImageFilter.GaussianBlur(0.6))
    arr = np.asarray(im, float); yel = fbm(N // 2, 21, 4)
    yel = np.asarray(Image.fromarray((yel * 255).astype(np.uint8)).resize((N, N), Image.BICUBIC), float)[..., None] / 255
    arr = arr * (1 - 0.10 * yel) + np.array((210, 190, 140)) * 0.10 * yel
    im = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    tape = Image.new('RGBA', (N, N), (0, 0, 0, 0)); td = ImageDraw.Draw(tape)
    for k in range(0, N, 8):
        j = rnd.uniform(-2, 2)
        td.rectangle((k, int(0 + j), k + 8, int(70 + j)), fill=(214, 196, 148, 235))
        td.rectangle((int(0 + j), k, int(70 + j), k + 8), fill=(214, 196, 148, 235))
    im.paste(tape, (0, 0), tape)
    im.save(os.path.join(OUT, 'newspaper.png'))


def make_kraft():   # brown kraft masking paper for the tyres (round 2: white newspaper on tyres read as white-walls)
    N = 1024; rnd = random.Random(9)
    base = np.array((150, 112, 70), float)
    f = fbm(N, 31, 5)[..., None]
    fib = np.random.default_rng(3).normal(0, 7, (N, N, 1))
    arr = base * (0.86 + 0.22 * f) + fib
    im = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)); d = ImageDraw.Draw(im)
    for _ in range(26):   # creases
        x0, y0 = rnd.randrange(N), rnd.randrange(N); a = rnd.uniform(0, math.pi); L = rnd.randrange(120, 420)
        x1, y1 = x0 + L * math.cos(a), y0 + L * math.sin(a)
        d.line((x0, y0, x1, y1), fill=(118, 86, 52), width=2); d.line((x0 + 2, y0 + 2, x1 + 2, y1 + 2), fill=(176, 138, 92), width=1)
    for k in range(0, N, 6):   # tape bands across (masking tape, cream)
        for band in (0, 512):
            j = rnd.uniform(-2, 2); d.rectangle((k, band + int(j), k + 6, band + 64 + int(j)), fill=(222, 206, 160))
    im.filter(ImageFilter.GaussianBlur(0.5)).save(os.path.join(OUT, 'kraft.png'))


def make_price_card():   # the dealer's price card in the windscreen (plan row 4), 40 x 28 cm, drawn 1000 x 700
    W_, H_ = 1000, 700; im = Image.new('RGB', (W_, H_), (246, 242, 228)); d = ImageDraw.Draw(im)
    RED_ = (200, 22, 30); NAVY = (24, 34, 70)
    d.rectangle((14, 14, W_ - 14, H_ - 14), outline=RED_, width=22); d.rectangle((44, 44, W_ - 44, H_ - 44), outline=NAVY, width=4)
    def ctext(t, f, y, col):
        w = f.getlength(t); d.text(((W_ - w) / 2, y), t, font=f, fill=col)
    ctext('BAXTER FIRE APPARATUS CO.', ImageFont.truetype(SANS_B, 40), 70, NAVY)
    ctext('DELIVERED PRICE', ImageFont.truetype(SANS_B, 46), 140, NAVY)
    ctext('$41,750', ImageFont.truetype(LSERIF_B, 250), 185, RED_)
    ctext('SOLD TO THE TOWN OF', ImageFont.truetype(SANS_B, 50), 465, NAVY)
    ctext('PINE HOLLOW', ImageFont.truetype(LSERIF_B, 96), 525, NAVY)
    im.save(os.path.join(OUT, 'price_card.png'))


def make_van_decal():   # the milk van's side lettering (alpha), 2048 x 768 for a 3.0 x 1.1 m panel
    W_, H_ = 2048, 768; cv = Image.new('RGBA', (W_, H_), (0, 0, 0, 0)); d = ImageDraw.Draw(cv)
    NAVY = (30, 52, 120, 255); CORN = (100, 149, 237, 255)
    f1 = ImageFont.truetype(LSERIF_B, 250); f2 = ImageFont.truetype(SANS_B, 92); f3 = ImageFont.truetype(SANS_B, 64)
    def ctext(t, f, y, col):
        w = f.getlength(t); d.text(((W_ - w) / 2, y), t, font=f, fill=col)
    ctext('Meadowbrook', f1, 20, NAVY)
    ctext('DAIRY', f2, 300, NAVY)
    ctext('GRADE A MILK  \u00b7  PINE HOLLOW  \u00b7  ELM ST.', f3, 430, NAVY)
    # a milk-bottle emblem each side
    for cx in (170, W_ - 170):
        d.rounded_rectangle((cx - 55, 120, cx + 55, 330), 30, fill=(250, 248, 240, 255), outline=NAVY, width=8)
        d.rectangle((cx - 30, 70, cx + 30, 125), fill=(250, 248, 240, 255), outline=NAVY, width=8)
    cv.save(os.path.join(OUT, 'van_decal.png'))


def make_can_label(text, col_hex, fname):   # 1-gallon paint tin label (wraps 0.52 m x 0.12 m), drawn 2080 x 480
    W_, H_ = 2080, 480; c = tuple(int(col_hex[i:i + 2], 16) for i in (1, 3, 5))
    im = Image.new('RGB', (W_, H_), (238, 232, 214)); d = ImageDraw.Draw(im)
    NAVY = (24, 34, 70)
    for x0 in (0, W_ // 2):
        d.rectangle((x0, 0, x0 + W_ // 2, 90), fill=NAVY)
        f = ImageFont.truetype(SANS_B, 60); d.text((x0 + 40, 14), 'SUNBEAM ENAMEL', font=f, fill=(240, 230, 200))
        d.rectangle((x0 + 40, 120, x0 + 300, 380), fill=c, outline=NAVY, width=6)
        sz = 150
        while ImageFont.truetype(LSERIF_B, sz).getlength(text) > 680: sz -= 4
        d.text((x0 + 330, 140 + (150 - sz) // 2), text, font=ImageFont.truetype(LSERIF_B, sz), fill=NAVY)
        d.text((x0 + 330, 330), 'No. 12  ONE U.S. GALLON  FIRE APPARATUS', font=ImageFont.truetype(SANS_B, 30), fill=NAVY)
    im.save(os.path.join(OUT, fname))


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
    make_letters(); make_newspaper(); make_kraft(); make_price_card(); make_van_decal()
    make_can_label('LEMON YELLOW', '#E3EA22', 'can_lemon.png'); make_can_label('LIME', '#E3EA22', 'can_lime.png'); make_can_label('RED', '#D3141C', 'can_red.png')
    make_wear(); make_comp_label(os.environ.get('COMP_LABEL_ORIENT', 'cwf'))
    print('TEX_DONE', sorted(os.listdir(OUT)))
