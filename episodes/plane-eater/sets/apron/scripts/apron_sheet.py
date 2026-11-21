# apron_sheet.py: thin outline on each proof tile (rick_outline/composite.py), numbers (detail_density + luminance), APRON_SHEET.jpg (4 tiles, 1600 px wide).
# python3 apron_sheet.py <tiles dir> <sheet.jpg>     -> <tile>_final.png, numbers.json ; ends SHEET_DONE
import sys, os, json
import numpy as np
from PIL import Image, ImageDraw, ImageFont
T, OUTJ = sys.argv[1], sys.argv[2]; HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..', '..'))
sys.path[:0] = [os.path.join(ROOT, 'templates', 'blender_look', 'rick_outline'), os.path.join(ROOT, 'tools', 'measure')]
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import composite as CO, detail_density as DD, grade_rick as GR
TG = json.load(open(GR.DEF))['DAY']
CAMS = [k for k in json.load(open(os.path.join(HERE, 'apron_cams.json'))) if not k.startswith('_')]
nums = {}
for t in CAMS:
    a = GR.grade(GR.load(os.path.join(T, t + '.png')), TG) * 255   # FIX 2 (lead): grade_rick DAY on the proofs, then the outline
    im, al = CO.key_composite(a, os.path.join(T, t + '_lines_id.png')); fin = Image.fromarray(im.clip(0, 255).round().astype(np.uint8)); fin.save(os.path.join(T, t + '_final.png'))
    lum = (im / 255) @ np.array([.2126, .7152, .0722]); q = np.asarray(fin.convert('RGB').quantize(64)); hist = np.bincount(q.ravel(), minlength=64)
    d = DD.metrics(fin)
    nums[t] = dict(edge=round(d['edge_density'], 4), regions=d['regions'], colours_1pct=int((hist > q.size * .01).sum()), mean=round(float(lum.mean()), 3),
                   p1=round(float(np.percentile(lum, 1)), 3), p99=round(float(np.percentile(lum, 99)), 3))
F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 17)
w = 400; h = int(w * 960 / 540); S = Image.new('RGB', (w * len(CAMS), h + 28), (20, 20, 24)); dr = ImageDraw.Draw(S)
for i, t in enumerate(CAMS):
    S.paste(Image.open(os.path.join(T, t + '_final.png')).resize((w, h), Image.LANCZOS), (i * w, 28))
    dr.text((i * w + 6, 5), '%s  e%.3f' % (t, nums[t]['edge']), fill=(240, 240, 240), font=F)
S.save(OUTJ, quality=90); json.dump(nums, open(os.path.join(T, 'numbers.json'), 'w'), indent=1); print('SHEET_DONE', json.dumps(nums))
