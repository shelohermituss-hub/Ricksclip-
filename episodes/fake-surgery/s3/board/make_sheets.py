# S3 board (copied from monopoly s1): names the key frames r<row>_<a|b|c>_f<filmframe>.png, writes numbers.txt, sheet_360.jpg, line_check.jpg, eyes_feet_zoom.jpg, _peek.jpg.
# Run from the stretch folder after the render: python board/make_sheets.py   (render stills are board/frames/f_#####.png, stretch frames)
from PIL import Image, ImageDraw
import numpy as np, os, shutil, sys
B, OFF = 'board', 0
ROWS = [(21, '60 get SCRAPED', [798, 822]), (22, '60 get RINSED', [848, 866]), (23, '60 get the TRICK', [884, 906, 920]), (24, 'EVERYONE SIGNS a FORM', [940, 966]),
        (25, 'a PRETEND surgery', [985, 1000, 1012]), (26, 'NOBODY is TOLD WHICH', [1040, 1056, 1080]), (27, 'a real operation PLAYS on the SCREEN', [1104, 1118, 1140]),
        (28, 'He WIGGLES the LEG', [1174, 1200]), (29, 'SPLASHES water LOUDLY', [1212, 1232, 1246]), (30, 'so it SOUNDS REAL', [1260, 1276])]
if '--list' in sys.argv: print(','.join(str(f) for r in ROWS for f in r[2])); sys.exit()
src = lambda f: os.path.join(B, 'all', 'f_%05d.png' % f); os.makedirs(os.path.join(B, 'frames'), exist_ok=True)
P, num = [], []
for row, words, fs in ROWS:
    for i, f in enumerate(fs):
        name = 'r%d_%s_f%d.png' % (row, 'abc'[i], f + OFF); dst = os.path.join(B, 'frames', name)
        if os.path.exists(src(f)): shutil.copyfile(src(f), dst)
        im = Image.open(dst).convert('RGB'); a = np.asarray(im).astype(np.float32) / 255; mx, mn = a.max(2), a.min(2)
        sat = np.where(mx > 1e-4, (mx - mn) / np.maximum(mx, 1e-4), 0).mean(); lum = (a * [0.2126, 0.7152, 0.0722]).sum(2)
        r_, g_, b_ = a[..., 0], a[..., 1], a[..., 2]; dd = np.maximum(mx - mn, 1e-4); hue = np.where(mx == r_, ((g_ - b_) / dd) % 6, np.where(mx == g_, (b_ - r_) / dd + 2, (r_ - g_) / dd + 4)) * 60; sv = np.where(mx > 1e-4, (mx - mn) / np.maximum(mx, 1e-4), 0)
        red = (((hue <= 8) | (hue >= 344)) & (sv > .5) & (mx > .55)).sum()
        num.append('%-22s sat %.3f  mean %.3f  p1 %.3f  p99.9 %.3f  clipped>0.98 %.2f%%  red_px %d (%.3f%%)' % (name, sat, lum.mean(), np.percentile(lum, 1), np.percentile(lum, 99.9), 100 * (mn > .98).mean(), red, 100 * red / lum.size))
        P.append((row, words, name, im))
open(os.path.join(B, 'numbers.txt'), 'w').write('fake-surgery S3 panels, ungraded, with captions. sat = mean HSV S, mean = mean luminance (targets: sat >= 0.36, 0.30 by day; evening mean >= 0.31); red_px = saturated red (hue +-12, S>.5, V>.55): only the bill TOTAL may be red' + chr(10) + chr(10).join(num) + chr(10)); print(chr(10).join(num))
def lab(im, t, h=30):
    o = Image.new('RGB', (im.width, im.height + h), (14, 14, 20)); o.paste(im, (0, 0)); ImageDraw.Draw(o).text((4, im.height + 2), t[:58], fill=(255, 224, 110)); ImageDraw.Draw(o).text((4, im.height + 15), t[58:116], fill=(235, 235, 235)); return o
cells = [lab(im.resize((360, 640)), 'r%d %s  %s' % (row, name[:-4].split('_', 1)[1], words)) for row, words, name, im in P]
cols = 6; S = Image.new('RGB', (360 * cols, 670 * ((len(cells) + cols - 1) // cols)), (14, 14, 20))
for i, c in enumerate(cells): S.paste(c, ((i % cols) * 360, (i // cols) * 670))
S.save(os.path.join(B, 'sheet_360.jpg'), quality=86)
pk = S.resize((1560, int(S.height * 1560 / S.width))); pk.save(os.path.join(B, '_peek.jpg'), quality=80)
L = Image.new('RGB', (1500, 400 * len(ROWS)), (16, 16, 20)); d = ImageDraw.Draw(L)
for r, (row, words, fs) in enumerate(ROWS):
    d.text((10, r * 400 + 170), 'ROW %d' % row, fill=(255, 224, 110)); d.text((10, r * 400 + 190), words[:60], fill=(240, 240, 240)); d.text((10, r * 400 + 206), words[60:], fill=(240, 240, 240))
    for j, (rw, w, name, im) in enumerate([p for p in P if p[0] == row]): L.paste(lab(im.resize((216, 384)), name[:-4], 14), (460 + j * 260, r * 400 + 2))
L.save(os.path.join(B, 'line_check.jpg'), quality=85)
Z = [('r23_b', (0, 300, 1080, 1300), 'note on tray 3 + wink'), ('r25_b', (0, 300, 1080, 1500), 'POV form'), ('r27_c', (0, 0, 1080, 1400), 'inside the CRT'), ('r29_b', (0, 600, 1080, 1700), 'flood')]
E = Image.new('RGB', (300 * 4, 660), (14, 14, 20))
for i, (key, box, t) in enumerate(Z):
    im = [p[3] for p in P if p[2].startswith(key)][0]; E.paste(lab(im.crop(box).resize((300, 300)), key + ' ' + t), ((i % 4) * 300, (i // 4) * 330))
E.save(os.path.join(B, 'eyes_feet_zoom.jpg'), quality=85); print('sheets written')
