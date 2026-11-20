# S4 board: names the key frames r<row>_<a|b|c>_f<filmframe>.png from board/frames/f_#####.png (FILM frames), the row 37 IMPACT FRAME post (two-tone gold / violet,
# the blind stripes as hard black bands; f1560-1561, POST ON THE STILL for the gate: the build-out moves it into the render), numbers.txt, sheet_360.jpg, line_check.jpg.
# Run from the stretch folder: python board/make_sheets.py  (--list prints the frames)
from PIL import Image, ImageDraw
import numpy as np, os, sys, colorsys
B = 'board'
ROWS = [(31, 'TWO YEARS LATER (hard cut)', [1292, 1305, 1318]), (32, 'the MAN from the TABLE', [1326, 1340]), (33, 'is CLIMBING STAIRS again', [1354, 1362, 1372]),
        (34, 'PAIN way DOWN', [1390, 1402, 1414]), (35, 'and the REAL SURGERY GROUPS? NO better at all.', [1434, 1458, 1470]), (36, 'THREE PAIN CHARTS', [1506, 1512, 1530]),
        (37, 'all the SAME HEIGHT', [1552, 1560, 1572]), (38, 'You SEE, the WORK inside the knee', [1586, 1598, 1612]), (39, "WASN'T what made them feel BETTER", [1636, 1640, 1648])]
IMPACT = set()   # round 3: the IMPACT FRAME is in the render (s4_office.js s4o.impact), no post
if '--list' in sys.argv: print(','.join(str(f) for r in ROWS for f in r[2])); sys.exit()
src = lambda f: os.path.join(B, 'frames', 'f_%05d.png' % f)
def impact(im):
    a = np.asarray(im).astype(np.float32) / 255; lum = (a * [.2126, .7152, .0722]).sum(2); H, Wd = lum.shape
    hi = lum > np.percentile(lum, 55); out = np.where(hi[..., None], np.array([1.0, .86, .52]), np.array([.2, .16, .38]))
    yy, xx = np.mgrid[0:H, 0:Wd]; band = ((yy * .9 + xx * .35) % 150) < 46; out[band] = [.03, .02, .05]   # the blind stripes as hard black bands
    return Image.fromarray((out * 255).astype(np.uint8))
def nums(im):
    a = np.asarray(im).astype(np.float32) / 255; mx, mn = a.max(2), a.min(2); sat = np.where(mx > 1e-4, (mx - mn) / np.maximum(mx, 1e-4), 0); lum = (a * [.2126, .7152, .0722]).sum(2)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]; hue = np.degrees(np.arctan2(np.sqrt(3) * (g - b), 2 * r - g - b)); h0 = np.degrees(np.arctan2(np.sqrt(3) * (30 - 42) / 255, (2 * 224 - 30 - 42) / 255))
    red = ((np.abs(hue - h0) < 12) & (sat > .5) & (mx > .55)).sum(); return sat.mean(), lum.mean(), np.percentile(lum, 1), int(red)
P, num = [], []
for row, words, fs in ROWS:
    for i, f in enumerate(fs):
        name = 'r%d_%s_f%d.png' % (row, 'abc'[i], f); dst = os.path.join(B, 'frames', name)
        if not os.path.exists(src(f)): print('missing', name); continue
        im = Image.open(src(f)).convert('RGB')
        if f in IMPACT: im = impact(im)
        im.save(dst); s, m, p1, red = nums(im); num.append('%-20s sat %.3f  mean %.3f  p1 %.3f  red_px %d%s' % (name, s, m, p1, red, '  (IMPACT FRAME two-tone post)' if f in IMPACT else '')); P.append((row, words, name, im))
open(os.path.join(B, 'numbers.txt'), 'w').write('S4 panels with captions, ungraded. sat = mean HSV S (target >= 0.36; day >= 0.30), mean = mean luminance, p1 = darkest 1 %, red_px = RED GATE (hue within 12 deg of #e01e2a, S > .5, V > .55); allowed only rows 34 and 36-38\n' + '\n'.join(num) + '\n')
print('\n'.join(num))
def lab(im, t, h=30):
    o = Image.new('RGB', (im.width, im.height + h), (14, 14, 20)); o.paste(im, (0, 0)); ImageDraw.Draw(o).text((4, im.height + 2), t[:58], fill=(255, 224, 110)); ImageDraw.Draw(o).text((4, im.height + 15), t[58:116], fill=(235, 235, 235)); return o
cells = [lab(im.resize((360, 640)), 'r%d %s  %s' % (row, name[:-4].split('_', 1)[1], words)) for row, words, name, im in P]
cols = 6; S = Image.new('RGB', (360 * cols, 670 * ((len(cells) + cols - 1) // cols)), (14, 14, 20))
for i, c in enumerate(cells): S.paste(c, ((i % cols) * 360, (i // cols) * 670))
S.save(os.path.join(B, 'sheet_360.jpg'), quality=86); S.resize((1560, int(S.height * 1560 / S.width))).save(os.path.join(B, '_peek.jpg'), quality=80)
L = Image.new('RGB', (1500, 400 * len(ROWS)), (16, 16, 20)); d = ImageDraw.Draw(L)
for r, (row, words, fs) in enumerate(ROWS):
    d.text((10, r * 400 + 170), 'ROW %d' % row, fill=(255, 224, 110)); d.text((10, r * 400 + 190), words[:60], fill=(240, 240, 240))
    for j, (rw, w, name, im) in enumerate([p for p in P if p[0] == row]): L.paste(lab(im.resize((216, 384)), name[:-4], 14), (460 + j * 260, r * 400 + 2))
L.save(os.path.join(B, 'line_check.jpg'), quality=85); print('sheets written')
