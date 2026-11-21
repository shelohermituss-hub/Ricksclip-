# fix2_sheet.py (set-builder FIX 2, 2026-11-21): one proof sheet of at most 8 tiles (4 x 2, 1596 px wide) with the numbers under each tile:
# seconds per frame + the load average at that time, edge density (tools/measure/density_check.py G1, style 3d), mean brightness, saturation (HSV mean).
# python3 fix2_sheet.py <spec.json> <sheet.jpg> <numbers.json>     spec = [ {"file": png, "label": text, "spf": seconds or null, "load": "x.xx"}, ... ]
import sys, os, json
import numpy as np
from PIL import Image, ImageDraw, ImageFont
R = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..'))
sys.path.insert(0, os.path.join(R, 'tools', 'measure')); from density_check import check
spec = json.load(open(sys.argv[1])); SHEET, NUMS = sys.argv[2], sys.argv[3]
TW, TH, LH = 398, 708, 46; sh = Image.new('RGB', (TW * 4 + 4, (TH + LH) * 2 + 4), '#1b1b20'); d = ImageDraw.Draw(sh)
f1 = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 12); f2 = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 11)
out = []
for i, t in enumerate(spec[:8]):
    x, y = 2 + (i % 4) * TW, 2 + (i // 4) * (TH + LH)
    if not os.path.exists(t['file']): d.text((x + 8, y + 200), 'missing ' + t['label'], font=f1, fill='#f55'); continue
    g = check(t['file'], night=False, style='3d'); a = np.asarray(Image.open(t['file']).convert('RGB'), float) / 255
    mx, mn = a.max(2), a.min(2); sat = float(np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0).mean())
    n = dict(label=t['label'], file=os.path.relpath(t['file'], R), edge=round(g['G1_edge'][0], 4), brightness=round(float(a.mean()), 3), saturation=round(sat, 3), spf=t.get('spf'), load=t.get('load'))
    out.append(n); sh.paste(Image.open(t['file']).convert('RGB').resize((TW - 4, TH)), (x, y))
    d.text((x + 4, y + TH + 3), t['label'][:58], font=f1, fill='#ffffff')
    s = n['spf']; d.text((x + 4, y + TH + 22), 'edge %.3f  br %.3f  sat %.3f  %s s/f (load %s)' % (n['edge'], n['brightness'], n['saturation'], ('%.1f' % s) if s is not None else '-', n['load'] or '-'), font=f2, fill='#cfe')
    print('%-46s edge %.4f bright %.3f sat %.3f spf %s load %s' % (t['label'][:46], n['edge'], n['brightness'], n['saturation'], s, n['load']))
sh.save(SHEET, quality=88); json.dump(out, open(NUMS, 'w'), indent=1); print('SHEET', SHEET, sh.size)
