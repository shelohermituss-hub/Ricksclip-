"""make_sheets.py: grade each tile toward Rick DAY (tools/grade_rick.py), lay the thin outline (rick_outline/composite.py),
then build props/HERO_SHEET.jpg (3 views + hero 3/4 + the wing-off state) and props/STATES_SHEET.jpg (sliced, half eaten,
nose only, stub macro), each 1600 px wide. Run: python3 -I make_sheets.py <tiles dir> <props dir>"""
import sys, os, json
import numpy as np
from PIL import Image, ImageDraw, ImageFont
T, P = sys.argv[1], sys.argv[2]
ROOT = os.path.abspath(os.path.join(P, '..', '..', '..'))
sys.path.insert(0, os.path.join(ROOT, 'tools')); sys.path.insert(0, os.path.join(ROOT, 'templates', 'blender_look', 'rick_outline'))
import grade_rick as GR, composite as CO
TG = json.load(open(GR.DEF))['DAY']
LAB2 = {'A_hero34': 'HERO 3/4', 'B_side': 'SIDE (left, F-MIAM)', 'C_front': 'FRONT', 'D_top_rear': 'TOP REAR 3/4', 'E_wingoff': 'EATEN: LEFT WING',
       'F_sliced': 'SLICED LIKE A LOAF', 'G_sliced_half': 'EATEN: TAIL + CABIN', 'H_nose_only': 'EATEN: NOSE LEFT', 'I_stub_macro': 'MACRO: BITTEN STUB', 'J_reg_macro': 'MACRO: F-MIAM'}
nums = {}
LAB = {'P1_table': 'TABLE PROPS', 'P2_dessert': 'DESSERT TROLLEY', 'P3_records_tray': 'BOOK, CERTIFICATE, CLOCHE, TRAY', 'P4_tools': 'HACKSAW, RAG, SPANNER', 'P5_scale_macro': 'SCALE: 2 lb / 900 g'}
for t in LAB:
    a = GR.load(os.path.join(T, t + '.png')); g = a   # NO grade (lead 2026-11-21: the grade turned whites lilac); the rick_light.json day light as rendered
    im, al = CO.key_composite(g * 255, os.path.join(T, t + '_lines_id.png'))
    Image.fromarray(im.clip(0, 255).round().astype(np.uint8)).save(os.path.join(T, t + '_final.png'))
    lum = (im / 255) @ np.array([.2126, .7152, .0722])
    nums[t] = dict(mean=round(float(lum.mean()), 3), p1=round(float(np.percentile(lum, 1)), 3), p99=round(float(np.percentile(lum, 99)), 3),
                   spec_px=round(float((lum > .95).mean()), 4), line_px=round(float((al > .05).mean()), 4))
try: F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 12)
except Exception: F = ImageFont.load_default()
def sheet(tiles, out):
    w = 1600 // len(tiles); h = int(w * 960 / 540); S = Image.new('RGB', (w * len(tiles), h + 30), (20, 20, 24)); d = ImageDraw.Draw(S)
    for i, t in enumerate(tiles):
        S.paste(Image.open(os.path.join(T, t + '_final.png')).resize((w, h), Image.LANCZOS), (i * w, 30)); d.text((i * w + 8, 6), LAB[t], fill=(240, 240, 240), font=F)
    S.save(out, quality=90)
sheet(list(LAB), os.path.join(P, 'PROPS_SHEET2.jpg'))
json.dump(nums, open(os.path.join(T, 'numbers2.json'), 'w'), indent=1); print('SHEETS2_DONE', json.dumps(nums))
