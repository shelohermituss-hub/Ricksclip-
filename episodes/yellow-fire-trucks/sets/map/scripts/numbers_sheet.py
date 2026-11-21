# numbers_sheet.py: detail-gate numbers of the map stills (tools/measure/density_check.py check(), style 3d) and MAP_SHEET.jpg (8 tiles max: Blender and kit
# for wide, station_open, dallas, pine_sink; under each tile: seconds per frame, edge density (target median >= 0.14), brightness, saturation).
# python3 numbers_sheet.py <sets/map dir> <sheet.jpg>   -> proof/numbers.json + the sheet
import sys, os, json, re
import numpy as np
from PIL import Image, ImageDraw, ImageFont
T = os.path.abspath(sys.argv[1]); SHEET = sys.argv[2]; R = os.path.abspath(os.path.join(T, '..', '..', '..', '..'))
sys.path.insert(0, os.path.join(R, 'tools', 'measure')); from density_check import check
CAMS = list(json.load(open(os.path.join(T, 'scripts', 'map_cams.json'))))
KT = {}
p = os.path.join(T, 'logs', 'kit.log')
for l in open(p) if os.path.exists(p) else []:
    m = re.match(r'KIT_TIME (\w+) one_frame_run ([\d.]+) s(?:, second_frame ([-\d.]+) s)?', l)
    if m: KT[m.group(1)] = float(m.group(3) or m.group(2))
bt = json.load(open(os.path.join(T, 'proof', 'bl', 'bl_times.json'))) if os.path.exists(os.path.join(T, 'proof', 'bl', 'bl_times.json')) else {}
nums = {}; tiles = []
for cam in CAMS:
    for rend in ('blender', 'kit'):
        f = os.path.join(T, 'proof', 'bl', 'bl_%s.png' % cam) if rend == 'blender' else os.path.join(T, 'proof', 'kit', 'stills', cam, 'f_00000.png')
        if not os.path.exists(f): tiles.append(None); continue
        g = check(f, night=False, style='3d'); a = np.asarray(Image.open(f).convert('RGB'), float) / 255
        mx, mn = a.max(2), a.min(2); sat = float(np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0).mean())
        n = dict(edge=round(g['G1_edge'][0], 4), brightness=round(float(a.mean()), 3), saturation=round(sat, 3), sec_per_frame=bt.get(cam) if rend == 'blender' else KT.get(cam))
        nums['%s_%s' % (rend, cam)] = n; tiles.append((f, n, rend, cam))
        print('%-8s %-13s edge %.3f bright %.3f sat %.3f s/frame %s' % (rend, cam, n['edge'], n['brightness'], n['saturation'], n['sec_per_frame']))
gate = {}
for rend in ('blender', 'kit'):
    e = [nums['%s_%s' % (rend, c)]['edge'] for c in CAMS if '%s_%s' % (rend, c) in nums]
    if e: med = float(np.median(e)); gate[rend] = dict(edges=e, median=round(med, 4), min=min(e), PASS=med >= .14 and min(e) >= .08); print('GATE', rend, e, 'median %.3f' % med, 'PASS' if gate[rend]['PASS'] else 'FAIL')
json.dump(dict(stills=nums, gate=gate), open(os.path.join(T, 'proof', 'numbers.json'), 'w'), indent=1)
TW, TH, LH = 398, 708, 46; W = TW * 4 + 4; H = (TH + LH) * 2 + 4; sh = Image.new('RGB', (W, H), '#1b1b20'); d = ImageDraw.Draw(sh)
f1 = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 13); f2 = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 12)
for i, it in enumerate(tiles[:8]):
    x, y = 2 + (i % 4) * TW, 2 + (i // 4) * (TH + LH)
    if not it: d.text((x + 8, y + 200), 'missing', font=f1, fill='#f55'); continue
    f, n, rend, cam = it; sh.paste(Image.open(f).convert('RGB').resize((TW - 4, TH)), (x, y))
    d.text((x + 4, y + TH + 3), '%s  %s' % (rend, cam), font=f1, fill='#ffffff'); s = n['sec_per_frame']
    d.text((x + 4, y + TH + 22), 'edge %.3f  %s s/f  br %.2f  sat %.2f' % (n['edge'], ('%.1f' % s) if s is not None else '?', n['brightness'], n['saturation']), font=f2,
           fill='#9f9' if n['edge'] >= .14 else ('#ff9' if n['edge'] >= .08 else '#f77'))
sh.save(SHEET, quality=88); print('SHEET', SHEET, sh.size)
