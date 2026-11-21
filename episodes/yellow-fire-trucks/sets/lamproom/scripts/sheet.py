# sheet.py: LAMPROOM_SHEET.jpg (at most 8 tiles, 1600 px wide) + proof/numbers.json. Under each tile: renderer, state, seconds per frame, edge density
# (tools/measure/detail_density.py metrics, the caption band masked), colours (distinct 5-bit colours with >= 20 px), mean brightness.
# python3 sheet.py <sets/lamproom dir>
import sys, os, json, re
import numpy as np
from PIL import Image, ImageDraw, ImageFont
T = os.path.abspath(sys.argv[1]); RT = os.path.abspath(os.path.join(T, '..', '..', '..', '..'))
sys.path.insert(0, os.path.join(RT, 'tools', 'measure')); from detail_density import metrics
bt = json.load(open(os.path.join(T, 'proof', 'bl', 'bl_times.json'))) if os.path.exists(os.path.join(T, 'proof', 'bl', 'bl_times.json')) else {}
kt = {}
p = os.path.join(T, 'logs', 'kit.log')
for l in open(p) if os.path.exists(p) else []:
    m = re.match(r'KIT_TIME (\w+) one_frame_run ([\d.]+) s, second_frame ([-\d.]+) s', l)
    if m: kt[m.group(1)] = float(m.group(3))
TILES = [('blender', 'allon', 'all lamps on'), ('blender', 'wave2', 'wave step 2'), ('blender', 'redoff', 'red off, truck grey'), ('blender', 'irisopen', 'iris opened'),
         ('blender', 'entry', 'entry ring view'), ('kit', 'allon', 'all lamps on'), ('kit', 'redoff', 'red off, truck grey'), ('kit', 'entry', 'entry ring view')]
def colours(f):
    a = np.asarray(Image.open(f).convert('RGB').resize((540, 960)))[:, :, :3] >> 3; k = (a[..., 0].astype(int) << 10) | (a[..., 1].astype(int) << 5) | a[..., 2]
    u, c = np.unique(k, return_counts=True); return int((c >= 20).sum())
nums, cells = {}, []
for rend, t, label in TILES:
    f = os.path.join(T, 'proof', 'bl', 'bl_%s.png' % t) if rend == 'blender' else os.path.join(T, 'proof', 'kit', 'stills', t, 'f_00000.png')
    if not os.path.exists(f): cells.append(None); continue
    im = Image.open(f).convert('RGB'); m = metrics(im); br = float(np.asarray(im.resize((270, 480)), float).mean() / 255)
    sec = bt.get(t) if rend == 'blender' else kt.get(t)
    n = dict(file=os.path.relpath(f, T), edge=round(m['edge_density'], 4), regions=m.get('regions'), colours=colours(f), brightness=round(br, 3), sec_per_frame=sec)
    nums['%s_%s' % (rend, t)] = n; cells.append((im, rend, label, n)); print('TILE', rend, t, json.dumps(n))
json.dump(nums, open(os.path.join(T, 'proof', 'numbers.json'), 'w'), indent=1)
tw, th, cap = 400, 711, 46; S = Image.new('RGB', (tw * 4, (th + cap) * 2), (14, 10, 24)); D = ImageDraw.Draw(S)
try: F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 15)
except Exception: F = ImageFont.load_default()
for i, c in enumerate(cells):
    x, y = (i % 4) * tw, (i // 4) * (th + cap)
    if c is None: D.text((x + 10, y + 10), 'missing: ' + TILES[i][1], fill=(255, 120, 120), font=F); continue
    im, rend, label, n = c; S.paste(im.resize((tw, th)), (x, y))
    D.text((x + 6, y + th + 3), '%s: %s' % ('Blender' if rend == 'blender' else 'kit', label), fill=(240, 236, 220), font=F)
    D.text((x + 6, y + th + 23), '%s s/frame  edge %.3f  colours %d' % ('?' if n['sec_per_frame'] is None else '%.1f' % n['sec_per_frame'], n['edge'], n['colours']), fill=(200, 196, 230), font=F)
S.save(os.path.join(T, 'LAMPROOM_SHEET.jpg'), quality=88); print('SHEET_END')
