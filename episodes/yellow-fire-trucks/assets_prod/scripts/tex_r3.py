# tex_r3.py: round-3 textures (props-hero 2026-11-21), drawn with PIL outside Blender (REGLES_METHODE 3). Deterministic, no date in any image.
# python3 tex_r3.py <tex_src dir (bl_extract dump)> <out dir>
# badges_pine.png / badges_dallas.png: the ALF's "packardplatesand_badges" texture with its stray modern plate "LIBAU / LAND OF LINCOLN" painted over
#   by a 1940s porcelain plate (PINE HOLLOW F.D. / DALLAS F.D.). The source is stored upside down (as the letters decal): drawn upright, then flipped.
# ball_red.png: the red playground ball of S6 (equirect 1024x512): red rubber, two cream seam rings, a cream star, a grass stain.
# chalk_3x.png: the Clerk's chalk "3x" stroke (alpha, white chalk with broken grain) for the slate board (S5).
import sys, os, random
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
SRC, OUT = sys.argv[1], sys.argv[2]; os.makedirs(OUT, exist_ok=True)
FD = '/usr/share/fonts/truetype/'; SANS_B = FD + 'dejavu/DejaVuSans-Bold.ttf'; SANS = FD + 'dejavu/DejaVuSans.ttf'
PLATE = (9, 733, 497, 1018)   # the plate's box in the source PNG (dark pixels, measured)


def plate(top, mid, bot, fname):
    src = Image.open(os.path.join(SRC, 'alf__Image_22.png')).convert('RGB'); x0, y0, x1, y1 = PLATE; W, H = x1 - x0, y1 - y0
    p = Image.new('RGB', (W, H), (0, 0, 0)); d = ImageDraw.Draw(p)
    d.rounded_rectangle((0, 0, W - 1, H - 1), 26, fill=(232, 226, 204))                       # cream porcelain, black letters (1940s)
    d.rounded_rectangle((10, 10, W - 11, H - 11), 20, outline=(22, 22, 26), width=7)
    for cx, cy in ((34, 30), (W - 34, 30), (34, H - 30), (W - 34, H - 30)): d.ellipse((cx - 9, cy - 9, cx + 9, cy + 9), fill=(150, 146, 132), outline=(60, 58, 52), width=2)
    def ct(t, f, y):
        w = d.textlength(t, font=f); d.text(((W - w) / 2, y), t, font=f, fill=(22, 22, 26))
    sz = 150
    while ImageFont.truetype(SANS_B, sz).getlength(mid) > W - 70: sz -= 4
    ct(top, ImageFont.truetype(SANS_B, 34), 22); ct(mid, ImageFont.truetype(SANS_B, sz), (H - sz) / 2 - 8); ct(bot, ImageFont.truetype(SANS_B, 32), H - 62)
    rng = np.random.default_rng(3); a = np.asarray(p, float); a += rng.normal(0, 4, a.shape)          # enamel grain, a few chips at the edge
    a = np.clip(a, 0, 255).astype(np.uint8); p = Image.fromarray(a).transpose(Image.FLIP_TOP_BOTTOM)
    src.paste(p, (x0, y0)); src.save(os.path.join(OUT, fname))


def ball():
    W, H = 1024, 512; im = Image.new('RGB', (W, H), (196, 22, 26)); d = ImageDraw.Draw(im)
    rng = np.random.default_rng(7); a = np.asarray(im, float)
    a *= (1 + rng.normal(0, .035, (H, W, 1)))                                                      # pebbled rubber
    im = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)); d = ImageDraw.Draw(im)
    for v in (H * .3, H * .7): d.rectangle((0, v - 5, W, v + 5), fill=(236, 226, 200))             # two cream seam rings
    import math
    def star(cx, cy, R, r):
        pts = [(cx + (R if k % 2 == 0 else r) * math.sin(k * math.pi / 5) * 1.0, cy - (R if k % 2 == 0 else r) * math.cos(k * math.pi / 5)) for k in range(10)]
        d.polygon(pts, fill=(240, 230, 204))
    star(W * .25, H * .5, 70, 30); star(W * .75, H * .5, 70, 30)
    g = Image.new('L', (W, H), 0); dg = ImageDraw.Draw(g)                                          # the grass stain (green-brown smear)
    for k in range(40): x = W * .55 + rng.normal(0, 40); y = H * .62 + rng.normal(0, 18); dg.ellipse((x - 30, y - 8, x + 30, y + 8), fill=90)
    g = g.filter(ImageFilter.GaussianBlur(10)); im = Image.composite(Image.new('RGB', (W, H), (70, 88, 30)), im, g)
    im.save(os.path.join(OUT, 'ball_red.png'))


def chalk():
    W, H = 512, 320; m = Image.new('L', (W, H), 0); d = ImageDraw.Draw(m)
    d.line([(60, 70), (150, 70), (100, 150), (150, 150), (175, 200), (150, 255), (60, 255)], fill=255, width=22, joint='curve')   # 3
    d.line([(250, 140), (360, 270)], fill=255, width=20); d.line([(360, 140), (250, 270)], fill=255, width=20)                    # x
    rng = np.random.default_rng(11); a = np.asarray(m, float) / 255
    a *= (rng.random(a.shape) > .28) * (.75 + .25 * rng.random(a.shape))                            # broken chalk grain
    a = np.asarray(Image.fromarray((a * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(.8)))
    out = np.zeros((H, W, 4), np.uint8); out[..., :3] = (238, 236, 228); out[..., 3] = a
    Image.fromarray(out, 'RGBA').save(os.path.join(OUT, 'chalk_3x.png'))


if __name__ == '__main__':
    plate('PINE HOLLOW', 'F.D. 1', 'FIRE DEPT.  1941', 'badges_pine.png')
    plate('TEXAS', 'DALLAS', 'FIRE DEPT.  1941', 'badges_dallas.png')
    ball(); chalk()
    print('TEX_R3_DONE', sorted(f for f in os.listdir(OUT) if f.startswith(('badges', 'ball', 'chalk'))))
