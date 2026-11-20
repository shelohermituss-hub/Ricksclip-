# S2 board (pattern: episodes/elevator-mirror/s1/board/make_sheets.py): names the key frames r<row>_<a|b|c>_f<filmframe>.png from board/all, writes numbers.txt
# (sat, mean, LOOK_BIBLE red-gate px), sheet_360.jpg, line_check.jpg, _peek.jpg. Run from the stretch folder: python board/make_sheets.py  (--list prints the frames)
from PIL import Image, ImageDraw
import numpy as np, os, shutil, sys
B = 'board'
ROWS = [(11, 'BACK in the 1990s', [386, 404]), (12, 'in HOUSTON', [428, 440]), (13, 'SURGEONS SCRAPE and RINSE', [458, 477]), (14, 'SORE KNEES', [489, 493]),
        (15, 'ALL DAY LONG (EXTREME)', [508, 515, 530]), (16, 'ANOTHER DOCTOR ASKS him', [545, 562, 572]), (17, 'a NASTY QUESTION', [590, 602]),
        (18, 'all in their HEADS (POWER)', [640, 651, 660]), (19, 'he TAKES 180 sore knees (EXTREME)', [684, 700]), (20, 'SPLITS them into THREE GROUPS', [738, 758, 768])]
if '--list' in sys.argv: print(','.join(str(f) for r in ROWS for f in r[2])); sys.exit()
src = lambda f: os.path.join(B, 'all', 'f_%05d.png' % f); os.makedirs(os.path.join(B, 'frames'), exist_ok=True)
P, num = [], []
for row, words, fs in ROWS:
    for i, f in enumerate(fs):
        name = 'r%d_%s_f%d.png' % (row, 'abc'[i], f); dst = os.path.join(B, 'frames', name)
        if os.path.exists(src(f)): shutil.copyfile(src(f), dst)
        if not os.path.exists(dst): num.append(name + ' MISSING'); continue
        im = Image.open(dst).convert('RGB'); a = np.asarray(im).astype(np.float32) / 255; mx, mn = a.max(2), a.min(2)
        S = np.where(mx > 1e-4, (mx - mn) / np.maximum(mx, 1e-4), 0); lum = (a * [0.2126, 0.7152, 0.0722]).sum(2)
        r, g, b = a[..., 0], a[..., 1], a[..., 2]; d = np.maximum(mx - mn, 1e-4); hue = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
        red = int(((np.abs(((hue - 356 + 180) % 360) - 180) <= 12) & (S > .5) & (mx > .55)).sum())
        num.append('%-20s sat %.3f  mean %.3f  p1 %.3f  red_gate_px %d' % (name, S.mean(), lum.mean(), np.percentile(lum, 1), red))
        P.append((row, words, name, im))
open(os.path.join(B, 'numbers.txt'), 'w').write('S2 panels, ungraded, with captions. sat = mean HSV S (CO day >= 0.30, NI >= 0.36), mean = mean luminance (NI >= 0.31), red_gate_px = LOOK_BIBLE RED GATE (hue within 12 deg of #e01e2a, S>.5, V>.55; target 0 in S2; open mouths exempt)' + chr(10) + chr(10).join(num) + chr(10)); print(chr(10).join(num))
def lab(im, t, h=30):
    o = Image.new('RGB', (im.width, im.height + h), (14, 14, 20)); o.paste(im, (0, 0)); ImageDraw.Draw(o).text((4, im.height + 2), t[:58], fill=(255, 224, 110)); ImageDraw.Draw(o).text((4, im.height + 15), t[58:116], fill=(235, 235, 235)); return o
cells = [lab(im.resize((360, 640)), 'r%d %s  %s' % (row, name[:-4].split('_', 1)[1], words)) for row, words, name, im in P]
cols = 8; Sh = Image.new('RGB', (360 * cols, 670 * ((len(cells) + cols - 1) // cols)), (14, 14, 20))
for i, c in enumerate(cells): Sh.paste(c, ((i % cols) * 360, (i // cols) * 670))
Sh.save(os.path.join(B, 'sheet_360.jpg'), quality=86)
Sh.resize((1600, int(Sh.height * 1600 / Sh.width))).save(os.path.join(B, '_peek.jpg'), quality=80)
L = Image.new('RGB', (1300, 400 * len(ROWS)), (16, 16, 20)); d = ImageDraw.Draw(L)
for r, (row, words, fs) in enumerate(ROWS):
    d.text((10, r * 400 + 170), 'ROW %d' % row, fill=(255, 224, 110)); d.text((10, r * 400 + 190), words[:60], fill=(240, 240, 240))
    for j, (rw, w, name, im) in enumerate([p for p in P if p[0] == row]): L.paste(lab(im.resize((216, 384)), name[:-4], 14), (330 + j * 260, r * 400 + 2))
L.save(os.path.join(B, 'line_check.jpg'), quality=85); print('sheets written')
