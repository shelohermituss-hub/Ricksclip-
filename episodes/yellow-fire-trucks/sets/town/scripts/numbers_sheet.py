# numbers_sheet.py: the detail-gate numbers of the town stills (tools/measure/density_check.py --style 3d, the same check() it runs) and the proof sheet
# TOWN_SHEET.jpg (1600 px wide; rows AM Blender, AM kit, DU Blender, DU kit; under each tile: seconds per frame, edge density, brightness, sky share).
# python3 numbers_sheet.py <sets/town dir> <sheet.jpg>     -> proof/numbers.json + the sheet. Gate (CB_RULES 11i, Ultra): the 3 gate cameras per
# kind and renderer: edge median >= 0.14, none under 0.08. Prints one line per still and the GATE lines.
import sys, os, json, re
import numpy as np
from PIL import Image, ImageDraw, ImageFont
T = os.path.abspath(sys.argv[1]); SHEET = sys.argv[2]; R = os.path.abspath(os.path.join(T, '..', '..', '..', '..'))
sys.path.insert(0, os.path.join(R, 'tools', 'measure')); from density_check import check
CAMS = list(json.load(open(os.path.join(T, 'scripts', 'town_cams.json')))); GATE = ['yard_wide', 'yard_medium', 'yard_low']
def kit_times():
    out = {}; p = os.path.join(T, 'logs', 'kit.log')
    for l in open(p) if os.path.exists(p) else []:
        m = re.match(r'KIT_TIME (\w+) one_frame_run ([\d.]+) s(?:, second_frame ([-\d.]+) s)?', l)
        if m: out[m.group(1)] = float(m.group(3) or m.group(2))
    return out
KT = kit_times(); rows = []; nums = {}
for kind in ('am', 'du'):
    bt = json.load(open(os.path.join(T, 'proof', 'bl', 'bl_times_%s.json' % kind))) if os.path.exists(os.path.join(T, 'proof', 'bl', 'bl_times_%s.json' % kind)) else {}
    for rend in ('blender', 'kit'):
        row = []
        for cam in CAMS:
            f = os.path.join(T, 'proof', 'bl', 'bl_%s_%s.png' % (kind, cam)) if rend == 'blender' else os.path.join(T, 'proof', 'kit', 'stills', '%s_%s' % (kind, cam), 'f_00000.png')
            if not os.path.exists(f): row.append(None); continue
            g = check(f, night=(kind == 'du'), style='3d'); a = np.asarray(Image.open(f).convert('RGB'), float) / 255
            hsv_b = a.mean(); sky = ((a[..., 2] > a[..., 0] + .08) & (a.mean(2) > .45)).mean() if kind == 'am' else 0.  # sky share by day: bright blue pixels
            sec = bt.get(cam) if rend == 'blender' else KT.get('%s_%s' % (kind, cam))
            n = dict(file=os.path.relpath(f, T), edge=round(g['G1_edge'][0], 4), shapes=g['G2_shapes'][0], brightness=round(hsv_b, 3), sky_share=round(float(sky), 3), sec_per_frame=sec,
                     passes=sum(1 for v in g.values() if v[-1]), of=len(g))
            nums['%s_%s_%s' % (rend, kind, cam)] = n; row.append((f, n, kind, rend, cam))
            print('%-8s %s %-12s edge %.3f shapes %5d bright %.3f sky %.2f s/frame %s  gates %d/%d' % (rend, kind, cam, n['edge'], n['shapes'], n['brightness'], n['sky_share'], sec, n['passes'], n['of']))
        rows.append(row)
gate = {}
for rend in ('blender', 'kit'):
    for kind in ('am', 'du'):
        e = [nums['%s_%s_%s' % (rend, kind, c)]['edge'] for c in GATE if '%s_%s_%s' % (rend, kind, c) in nums]
        if not e: continue
        med = float(np.median(e)); ok = med >= .14 and min(e) >= .08; gate['%s_%s' % (rend, kind)] = dict(edges=e, median=round(med, 4), min=min(e), PASS=ok)
        print('GATE %-7s %s edges %s median %.3f min %.3f -> %s' % (rend, kind, e, med, min(e), 'PASS' if ok else 'FAIL'))
json.dump(dict(stills=nums, gate=gate), open(os.path.join(T, 'proof', 'numbers.json'), 'w'), indent=1)
# sheet: at most 8 tiles (user 2026-11-20, light previews): the picked tiles below, 4 columns x 2 rows; every still's numbers stay in proof/numbers.json
PICK = [('am', 'blender', 'yard_medium'), ('am', 'kit', 'yard_medium'), ('du', 'blender', 'yard_wide'), ('du', 'kit', 'yard_wide'),
        ('am', 'blender', 'shop_window'), ('du', 'blender', 'crossing'), ('am', 'blender', 'park'), ('du', 'kit', 'yard_low')]
allt = {(it[2], it[3], it[4]): it for row in rows for it in row if it}
rows = [[allt.get(k) for k in PICK[:4]], [allt.get(k) for k in PICK[4:]]]; CAMS = [0, 0, 0, 0]
TW, TH, LH = 398, 708, 46
cols = len(CAMS); W = TW * cols + 4; H = (TH + LH) * len(rows) + 4
sh = Image.new('RGB', (W, H), '#1b1b20'); d = ImageDraw.Draw(sh)
f1 = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 13); f2 = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 12)
for ri, row in enumerate(rows):
    for ci, it in enumerate(row):
        x, y = 2 + ci * TW, 2 + ri * (TH + LH)
        if not it: d.text((x + 8, y + 200), 'missing', font=f1, fill='#f55'); continue
        f, n, kind, rend, cam = it; im = Image.open(f).convert('RGB').resize((TW - 4, TH)); sh.paste(im, (x, y))
        d.text((x + 4, y + TH + 3), '%s %s  %s%s' % (kind.upper(), rend, cam, ' (gate)' if cam in GATE else ''), font=f1, fill='#ffffff')
        sec = n['sec_per_frame']; d.text((x + 4, y + TH + 22), 'edge %.3f  %s s/f  br %.2f' % (n['edge'], ('%.1f' % sec) if sec is not None else '?', n['brightness']), font=f2,
                                         fill='#9f9' if n['edge'] >= .14 else ('#ff9' if n['edge'] >= .08 else '#f77'))
sh.save(SHEET, quality=88); print('SHEET', SHEET, sh.size)
