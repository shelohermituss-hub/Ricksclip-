# fix_sheet.py: FIX 1 proof sheet of the town (8 tiles max, 4 x 2, 1596 px wide): label, seconds per frame, edge density (density_check.check, style 3d), mean brightness.
# python3 fix_sheet.py <sets/town dir> <out.jpg>   tiles listed in TILES below; seconds from proof/fix/times.json ({tile_key: s}); prints one line per tile, writes proof/fix/numbers.json
import sys, os, json
import numpy as np
from PIL import Image, ImageDraw, ImageFont
T = os.path.abspath(sys.argv[1]); OUTJ = sys.argv[2]; R = os.path.abspath(os.path.join(T, '..', '..', '..', '..'))
sys.path.insert(0, os.path.join(R, 'tools', 'measure')); from density_check import check
K = lambda n: os.path.join(T, 'proof', 'kit', 'stills', n, 'f_00000.png')
TILES = [('BL DU crossing BEFORE', 'proof/fix/before/bl_du_crossing.png', 'bl_before_du_crossing', True),
         ('BL DU crossing AFTER', 'proof/fix/bl/bl_du_crossing.png', 'bl_du_crossing', True),
         ('KIT lite DU crossing AFTER', K('du_crossing_lite'), 'du_crossing_lite', True),
         ('BL DU park AFTER (swing, sun patch)', 'proof/fix/bl/bl_du_park.png', 'bl_du_park', True),
         ('KIT lite AM park BEFORE (old cam)', 'proof/fix/before/kit_am_park_lite.png', 'kit_before_am_park_lite', False),
         ('KIT lite AM park AFTER', K('am_park_lite'), 'am_park_lite', False),
         ('KIT lite DU yard_low AFTER (line)', K('du_yard_low_lite'), 'du_yard_low_lite', True),
         ('KIT lite AM shop AFTER (KEEP CLEAR)', K('am_shop_window_lite'), 'am_shop_window_lite', False)]
EXTRA = [('BL DU park BEFORE (new cam)', 'proof/fix/before/bl_du_park.png', 'bl_before_du_park', True), ('BL DU yard_low AFTER', 'proof/fix/bl/bl_du_yard_low.png', 'bl_du_yard_low', True),
         ('BL AM shop AFTER', 'proof/fix/bl/bl_am_shop_window.png', 'bl_am_shop_window', False), ('KIT lite DU park AFTER', K('du_park_lite'), 'du_park_lite', True)]
TM = json.load(open(os.path.join(T, 'proof', 'fix', 'times.json'))) if os.path.exists(os.path.join(T, 'proof', 'fix', 'times.json')) else {}
nums = {}
for lab, f, key, night in TILES + EXTRA:
    f = f if os.path.isabs(f) else os.path.join(T, f)
    if not os.path.exists(f): print('MISSING', lab, f); continue
    g = check(f, night=night, style='3d'); a = np.asarray(Image.open(f).convert('RGB'), float) / 255
    nums[key] = dict(label=lab, file=os.path.relpath(f, T), edge=round(g['G1_edge'][0], 4), brightness=round(float(a.mean()), 3), sec_per_frame=TM.get(key))
    print('%-38s edge %.3f bright %.3f s/f %s' % (lab, nums[key]['edge'], nums[key]['brightness'], TM.get(key)))
json.dump(nums, open(os.path.join(T, 'proof', 'fix', 'numbers.json'), 'w'), indent=1)
TW, TH, LH = 398, 708, 44; sh = Image.new('RGB', (TW * 4 + 4, (TH + LH) * 2 + 4), '#1b1b20'); d = ImageDraw.Draw(sh)
f1 = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 13); f2 = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 12)
for i, (lab, f, key, night) in enumerate(TILES):
    x, y = 2 + (i % 4) * TW, 2 + (i // 4) * (TH + LH); n = nums.get(key)
    if not n: d.text((x + 8, y + 200), 'missing', font=f1, fill='#f55'); continue
    sh.paste(Image.open(os.path.join(T, n['file'])).convert('RGB').resize((TW - 4, TH)), (x, y)); d.text((x + 4, y + TH + 3), lab, font=f1, fill='#fff')
    s = n['sec_per_frame']; d.text((x + 4, y + TH + 22), '%s s/f   edge %.3f   bright %.3f' % ('%.1f' % s if s is not None else '?', n['edge'], n['brightness']), font=f2, fill='#9f9' if n['edge'] >= .14 else '#ff9')
sh.save(OUTJ, quality=88); print('SHEET', OUTJ, sh.size)
