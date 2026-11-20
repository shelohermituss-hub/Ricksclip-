# S1 board (pattern: episodes/monopoly-escape/s1/board/make_sheets.py): names the key frames r<row>_<a|b|c>_f<filmframe>.png from board/all, writes numbers.txt
# (sat, mean, red pixels), sheet_360.jpg, line_check.jpg, eyes_feet_zoom.jpg. Run from the stretch folder: python board/make_sheets.py   (--list prints the frames)
from PIL import Image, ImageDraw
import numpy as np, os, shutil, sys
B = 'board'
ROWS = [(1, 'A SURGEON cut', [0, 12]), (2, 'cut THREE TINY HOLES', [26, 38, 48]), (3, "a MAN'S KNEE", [68, 78]), (4, 'SPLASHED some WATER around', [92, 106]),
        (5, 'stuck on THREE PLASTERS (POWER)', [136, 152, 156, 166]), (6, 'He NEVER once went INSIDE (IMPOSSIBLE VIEW)', [196, 214]), (7, 'the KNEE', [232, 242]),
        (8, 'The NURSE LEANS in', [252, 268]), (9, 'and WHISPERS', [286, 298]), (10, '[NURSE] DOCTOR, you FORGOT the OPERATION', [310, 342, 362])]
if '--list' in sys.argv: print(','.join(str(f) for r in ROWS for f in r[2])); sys.exit()
src = lambda f: os.path.join(B, 'key', 'f_%05d.png' % f); os.makedirs(os.path.join(B, 'frames'), exist_ok=True)
P, num = [], []
for row, words, fs in ROWS:
    for i, f in enumerate(fs):
        name = 'r%d_%s_f%d.png' % (row, 'abcd'[i], f); dst = os.path.join(B, 'frames', name)
        if os.path.exists(src(f)): shutil.copyfile(src(f), dst)
        im = Image.open(dst).convert('RGB'); a = np.asarray(im).astype(np.float32) / 255; mx, mn = a.max(2), a.min(2)
        sat = np.where(mx > 1e-4, (mx - mn) / np.maximum(mx, 1e-4), 0).mean(); lum = (a * [0.2126, 0.7152, 0.0722]).sum(2)
        r8 = (a * 255).astype(int); red = int(((np.abs(r8[..., 0] - 228) < 31) & (r8[..., 1] < 60) & (r8[..., 2] < 70)).sum())
        num.append('%-20s sat %.3f  mean %.3f  p1 %.3f  p99.9 %.3f  red_px %d' % (name, sat, lum.mean(), np.percentile(lum, 1), np.percentile(lum, 99.9), red))
        P.append((row, words, name, im))
open(os.path.join(B, 'numbers.txt'), 'w').write('S1 panels, ungraded, with captions. sat = mean HSV S (target >= 0.36 evening, 0.30 day), mean = mean luminance (evening >= 0.31), red_px = signal-red #e4141e +-30 (target 0 in S1; mouth interiors exempt)' + chr(10) + chr(10).join(num) + chr(10)); print(chr(10).join(num))
def lab(im, t, h=30):
    o = Image.new('RGB', (im.width, im.height + h), (14, 14, 20)); o.paste(im, (0, 0)); ImageDraw.Draw(o).text((4, im.height + 2), t[:58], fill=(255, 224, 110)); ImageDraw.Draw(o).text((4, im.height + 15), t[58:116], fill=(235, 235, 235)); return o
cells = [lab(im.resize((360, 640)), 'r%d %s  %s' % (row, name[:-4].split('_', 1)[1], words)) for row, words, name, im in P]
cols = 6; S = Image.new('RGB', (360 * cols, 670 * ((len(cells) + cols - 1) // cols)), (14, 14, 20))
for i, c in enumerate(cells): S.paste(c, ((i % cols) * 360, (i // cols) * 670))
S.save(os.path.join(B, 'sheet_360.jpg'), quality=86)
S.resize((1560, int(S.height * 1560 / S.width))).save(os.path.join(B, '_peek.jpg'), quality=80)
L = Image.new('RGB', (1500, 400 * len(ROWS)), (16, 16, 20)); d = ImageDraw.Draw(L)
for r, (row, words, fs) in enumerate(ROWS):
    d.text((10, r * 400 + 170), 'ROW %d' % row, fill=(255, 224, 110)); d.text((10, r * 400 + 190), words[:60], fill=(240, 240, 240)); d.text((10, r * 400 + 206), words[60:], fill=(240, 240, 240))
    for j, (rw, w, name, im) in enumerate([p for p in P if p[0] == row]): L.paste(lab(im.resize((216, 384)), name[:-4], 14), (460 + j * 260, r * 400 + 2))
L.save(os.path.join(B, 'line_check.jpg'), quality=85)
print('sheets written')
