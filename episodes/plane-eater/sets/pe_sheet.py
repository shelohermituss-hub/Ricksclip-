# pe_sheet.py: <PLACE>_SHEET.jpg (at most 6 tiles, 1600 px wide) + proof/numbers.json for a plane-eater set. Under each tile: camera/state, seconds per frame,
# edge density + regions (tools/measure/detail_density.py), colours (distinct 5-bit colours with >= 20 px), mean brightness. No date or time in the image.
# python3 pe_sheet.py <set dir> <SHEET name> name:label name:label ...
import sys, os, json
import numpy as np
from PIL import Image, ImageDraw, ImageFont
T = os.path.abspath(sys.argv[1]); RT = os.path.abspath(os.path.join(T, '..', '..', '..', '..'))
sys.path.insert(0, os.path.join(RT, 'tools', 'measure')); from detail_density import metrics
bt = json.load(open(os.path.join(T, 'proof', 'bl_times.json'))) if os.path.exists(os.path.join(T, 'proof', 'bl_times.json')) else {}
TILES = [x.split(':', 1) for x in sys.argv[3:]]
def colours(im):
    a = np.asarray(im.resize((540, 960)))[:, :, :3] >> 3; k = (a[..., 0].astype(int) << 10) | (a[..., 1].astype(int) << 5) | a[..., 2]
    u, c = np.unique(k, return_counts=True); return int((c >= 20).sum())
nums, cells = {}, []
for t, label in TILES:
    f = os.path.join(T, 'proof', 'bl_%s.png' % t)
    if not os.path.exists(f): cells.append(None); continue
    im = Image.open(f).convert('RGB'); m = metrics(im); br = float(np.asarray(im.resize((270, 480)), float).mean() / 255)
    n = dict(file=os.path.relpath(f, T), edge=round(m['edge_density'], 4), regions=m.get('regions'), colours=colours(im), brightness=round(br, 3), sec_per_frame=bt.get(t))
    nums[t] = n; cells.append((im, label, n)); print('TILE', t, json.dumps(n))
json.dump(nums, open(os.path.join(T, 'proof', 'numbers.json'), 'w'), indent=1)
cols = min(len(TILES), 6); tw = 1600 // cols; th = int(tw * 16 / 9); cap = 46
S = Image.new('RGB', (tw * cols, th + cap), (20, 24, 34)); D = ImageDraw.Draw(S)
try: F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 13)
except Exception: F = ImageFont.load_default()
for i, c in enumerate(cells):
    x = i * tw
    if c is None: D.text((x + 8, 8), 'missing: ' + TILES[i][0], fill=(255, 140, 140), font=F); continue
    im, label, n = c; S.paste(im.resize((tw, th)), (x, 0))
    D.text((x + 5, th + 3), label, fill=(240, 236, 220), font=F)
    D.text((x + 5, th + 23), '%s s  edge %.3f  col %d  mean %.2f' % ('?' if n['sec_per_frame'] is None else '%.0f' % n['sec_per_frame'], n['edge'], n['colours'], n['brightness']), fill=(190, 200, 230), font=F)
S.save(os.path.join(T, sys.argv[2]), quality=88); print('SHEET_END')
