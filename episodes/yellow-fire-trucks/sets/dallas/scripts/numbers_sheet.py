# numbers_sheet.py: the detail-gate numbers of the Dallas stills (tools/measure/density_check.py --style 3d check(), the same as the town) and DALLAS_SHEET.jpg
# (8 tiles: row 1 Blender, row 2 kit; wide, medium at character height, low close, the boards; under each: seconds per frame, edge density, brightness).
# python3 numbers_sheet.py <sets/dallas dir> <sheet.jpg>   -> proof/numbers.json. Gate (CB_RULES 11i Ultra): wide/medium/low edge median >= 0.14, none < 0.08.
import sys, os, json, re
import numpy as np
from PIL import Image, ImageDraw, ImageFont
T = os.path.abspath(sys.argv[1]); SHEET = sys.argv[2]; R = os.path.abspath(os.path.join(T, '..', '..', '..', '..'))
sys.path.insert(0, os.path.join(R, 'tools', 'measure')); from density_check import check
CAMS = list(json.load(open(os.path.join(T, 'scripts', 'dallas_cams.json')))); GATE = ['wide', 'medium', 'low']
KT = {}
for l in open(os.path.join(T, 'logs', 'kit.log')) if os.path.exists(os.path.join(T, 'logs', 'kit.log')) else []:
    m = re.match(r'KIT_TIME (\w+) one_frame_run ([\d.]+) s(?:, second_frame ([-\d.]+) s)?', l)
    if m: KT[m.group(1)] = float(m.group(3) or m.group(2))
bp = os.path.join(T, 'proof', 'bl', 'bl_times_no.json'); BT = json.load(open(bp)) if os.path.exists(bp) else {}
nums, tiles = {}, []
for rend in ('blender', 'kit'):
    for cam in CAMS:
        f = os.path.join(T, 'proof', 'bl', 'bl_no_%s.png' % cam) if rend == 'blender' else os.path.join(T, 'proof', 'kit', 'stills', cam, 'f_00000.png')
        if not os.path.exists(f): tiles.append(None); continue
        g = check(f, night=False, style='3d'); a = np.asarray(Image.open(f).convert('RGB'), float) / 255
        sec = BT.get(cam) if rend == 'blender' else KT.get(cam)
        n = dict(file=os.path.relpath(f, T), edge=round(g['G1_edge'][0], 4), shapes=g['G2_shapes'][0], brightness=round(float(a.mean()), 3), sec_per_frame=sec, passes=sum(1 for v in g.values() if v[-1]), of=len(g))
        nums['%s_%s' % (rend, cam)] = n; tiles.append((f, n, rend, cam))
        print('%-8s %-7s edge %.3f shapes %5d bright %.3f s/frame %s gates %d/%d' % (rend, cam, n['edge'], n['shapes'], n['brightness'], sec, n['passes'], n['of']))
gate = {}
for rend in ('blender', 'kit'):
    e = [nums['%s_%s' % (rend, c)]['edge'] for c in GATE if '%s_%s' % (rend, c) in nums]
    if not e: continue
    med = float(np.median(e)); ok = med >= .14 and min(e) >= .08; gate[rend] = dict(edges=e, median=round(med, 4), min=min(e), PASS=ok)
    print('GATE %-7s edges %s median %.3f min %.3f -> %s' % (rend, e, med, min(e), 'PASS' if ok else 'FAIL'))
json.dump(dict(stills=nums, gate=gate), open(os.path.join(T, 'proof', 'numbers.json'), 'w'), indent=1)
TW, TH, LH = 398, 708, 46; W = TW * 4 + 4; H = (TH + LH) * 2 + 4
sh = Image.new('RGB', (W, H), '#1b1b20'); d = ImageDraw.Draw(sh)
f1 = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 13); f2 = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 12)
for i, it in enumerate(tiles[:8]):
    x, y = 2 + (i % 4) * TW, 2 + (i // 4) * (TH + LH)
    if not it: d.text((x + 8, y + 200), 'missing', font=f1, fill='#f55'); continue
    f, n, rend, cam = it; sh.paste(Image.open(f).convert('RGB').resize((TW - 4, TH)), (x, y))
    d.text((x + 4, y + TH + 3), 'NOON %s  %s%s' % (rend, cam, ' (gate)' if cam in GATE else ''), font=f1, fill='#ffffff')
    sec = n['sec_per_frame']; d.text((x + 4, y + TH + 22), 'edge %.3f  %s s/f  br %.2f' % (n['edge'], ('%.1f' % sec) if sec is not None else '?', n['brightness']), font=f2,
                                     fill='#9f9' if n['edge'] >= .14 else ('#ff9' if n['edge'] >= .08 else '#f77'))
sh.save(SHEET, quality=88); print('SHEET', SHEET, sh.size)
