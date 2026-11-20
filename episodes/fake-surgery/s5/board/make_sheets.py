# S5 board (pattern: elevator-mirror/s1/board/make_sheets.py): names key frames r<row>_<a|b|c>_f<filmframe>.png from board/all, writes numbers.txt
# (sat, mean, RED GATE px: hue within 12 deg of #e01e2a, S>.5, V>.55), sheet_360.jpg, line_check.jpg. Run from s5/: python board/make_sheets.py [--list]
from PIL import Image, ImageDraw
import numpy as np, os, shutil, sys, colorsys
B = 'board'
ROWS = [(40, 'Being SURE you\'re FIXED (POWER)', [1704, 1720, 1734]), (41, 'can make a KNEE HURT LESS', [1748, 1760]),
        (42, 'like a KID in the WAITING ROOM', [1786, 1806]), (43, 'a NURSE PLASTERS his scraped KNEE (SIGNATURE)', [1838, 1846, 1880]),
        (44, 'and it STOPS HURTING', [1898, 1914]), (45, 'In 2004, MEDICARE', [1945, 1972]), (46, 'STOPPED PAYING (EXTREME)', [1977, 1984, 1996]),
        (47, 'for ARTHRITIS KNEE PAIN', [2030, 2050]), (48, 'Turns out the NURSE was RIGHT', [2088, 2100]), (49, 'He FORGOT the OPERATION', [2128, 2140, 2153]),
        (50, 'and the PATIENTS never MISSED it (LAST FRAME)', [2175, 2194, 2208])]
if '--list' in sys.argv: print(','.join(str(f) for r in ROWS for f in r[2])); sys.exit()
src = lambda f: os.path.join(B, 'all', 'f_%05d.png' % f); os.makedirs(os.path.join(B, 'frames'), exist_ok=True)
P, num = [], []
for row, words, fs in ROWS:
    for i, f in enumerate(fs):
        name = 'r%d_%s_f%d.png' % (row, 'abc'[i], f); dst = os.path.join(B, 'frames', name)
        if os.path.exists(src(f)): shutil.copyfile(src(f), dst)
        if not os.path.exists(dst): num.append('%-20s MISSING' % name); continue
        im = Image.open(dst).convert('RGB'); a = np.asarray(im).astype(np.float32) / 255; mx, mn = a.max(2), a.min(2)
        S = np.where(mx > 1e-4, (mx - mn) / np.maximum(mx, 1e-4), 0); lum = (a * [0.2126, 0.7152, 0.0722]).sum(2)
        r, g, b = a[..., 0], a[..., 1], a[..., 2]; d = np.maximum(mx - mn, 1e-6)
        h = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
        hr = 356.4; dh = np.minimum(np.abs(h - hr), 360 - np.abs(h - hr)); red = int(((dh <= 12) & (S > .5) & (mx > .55)).sum())
        num.append('%-20s sat %.3f  mean %.3f  red_gate_px %d' % (name, S.mean(), lum.mean(), red)); P.append((row, words, name, im))
open(os.path.join(B, 'numbers.txt'), 'w').write('S5 panels, ungraded, with captions. sat = mean HSV S (>= .36; .30 by day), mean = luminance, red_gate_px (0 outside the dial/bars)\n' + '\n'.join(num) + '\n'); print('\n'.join(num))
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
