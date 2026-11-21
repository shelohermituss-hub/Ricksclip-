# sheet3.py: props/PROPS_R3.jpg (1600 px wide, 4 x 2 labelled tiles, Blender + kit) + proof/numbers_r3.json + props/PROPS_R3_phone.jpg (360 px phone check).
# python3 sheet3.py <assets_prod dir> <out jpg>. Under each tile: what it is, renderer + seconds, edge density / colours (tools/measure/detail_density.py).
import sys, os, json, re
from PIL import Image, ImageDraw, ImageFont
AP, OUTJ = sys.argv[1], sys.argv[2]
sys.path.insert(0, os.path.join(AP, '..', '..', '..', 'tools', 'measure'))
from detail_density import metrics
T = os.path.join(AP, 'proof', 'tiles_r3'); K = os.path.join(AP, 'proof', 'kit_r3', 'stills'); times = {}
for g in ('trucks', 'props'):
    p = os.path.join(T, 'times_r3_%s.json' % g)
    if os.path.exists(p): times.update(json.load(open(p)))
kt = {m.group(1): float(m.group(2)) for m in re.finditer(r'KIT_TIME (\w+) ([\d.]+)', open(os.path.join(AP, 'logs', 'r3_kit.log')).read())}
def bl(n, lab): return (Image.open(os.path.join(T, n + '.png')).convert('RGB'), lab, 'Blender Cycles 16spp+OIDN %.1f s' % times.get(n, -1))
def ki(n, lab): return (Image.open(os.path.join(K, n, 'f_00000.png')).convert('RGB'), lab, 'kit three.js run %.1f s (load incl.)' % kt.get(n, -1))
tiles = [bl('r3_hero_ribbon_plate', 'BL hero: ribbon hugs body, bow, plate F.D. 1'), ki('hero', 'KIT hero: same camera, ribbon + plate'),
         ki('rear', 'KIT rear, first mesh off screen, NO workaround: lemon ok'), bl('r3_light_sirens_drainwipe', 'BL light 43k: 4 sirens, beacon row, drain wipe .5'),
         ki('light', 'KIT light: sirens + row, drainWipe .5'), bl('r3_milk_van', 'BL milk van: cream, stripe, Meadowbrook DAIRY'),
         ki('lawn', 'KIT lawn: van, 5 lost things GREY, balls, box, toys'), bl('r3_close_box_lemon_toy', 'BL close: navy box, lemon-lime, toy (tabs)')]
TW, TH, LH = 400, 300, 40
sheet = Image.new('RGB', (TW * 4, (TH + LH) * 2), (24, 24, 26)); d = ImageDraw.Draw(sheet)
f1 = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 12); f2 = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 11)
nums = {}
for i, (img, lab, sec) in enumerate(tiles):
    x, y = (i % 4) * TW, (i // 4) * (TH + LH)
    t = img.resize((TW, TH), Image.LANCZOS); sheet.paste(t, (x, y)); m = metrics(t); nums[lab] = dict(render=sec, **m)
    d.text((x + 6, y + TH + 4), lab[:58], font=f1, fill=(235, 235, 235))
    d.text((x + 6, y + TH + 21), '%s  edge %.3f  regions %s' % (sec, m['edge_density'], m.get('regions', '?')), font=f2, fill=(200, 200, 170))
sheet.save(OUTJ, quality=88)
ph = Image.new('RGB', (360 * 2, 270 * 2), (0, 0, 0))   # phone check: the four story tiles at 360 px wide
for i, n in enumerate((0, 4, 6, 7)): ph.paste(tiles[n][0].resize((360, 270), Image.LANCZOS), ((i % 2) * 360, (i // 2) * 270))
ph.save(OUTJ.replace('.jpg', '_phone.jpg'), quality=88)
json.dump(nums, open(os.path.join(AP, 'proof', 'numbers_r3.json'), 'w'), indent=1)
for k, v in nums.items(): print(k, '|', v['render'], '| edge %.3f' % v['edge_density'], {kk: vv for kk, vv in v.items() if kk not in ('render', 'edge_density')})
