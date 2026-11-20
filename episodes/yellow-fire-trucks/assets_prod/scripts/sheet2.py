# sheet2.py: props/PROPS_R2.jpg (1600 px wide, 4 x 4 labelled tiles) + proof/numbers_r2.json. python3 sheet2.py <assets_prod dir> <out jpg>
# Under each tile: what it is, the measured seconds per frame of its Blender render (Cycles CPU 32 spp + OIDN, 800x600), edge density (detail_density.py).
import sys, os, json
from PIL import Image, ImageDraw, ImageFont
AP, OUTJ = sys.argv[1], sys.argv[2]
sys.path.insert(0, os.path.join(AP, '..', '..', '..', 'tools', 'measure'))
from detail_density import metrics
T = os.path.join(AP, 'proof', 'tiles_r2'); times = {}
for g in ('hero', 'fleet', 'props'):
    p = os.path.join(T, 'times_r2_%s.json' % g)
    if os.path.exists(p): times.update(json.load(open(p)))
def bl(n, label): return (Image.open(os.path.join(T, n + '.png')).convert('RGB'), label, '%.1f s/frame' % times.get(n, -1))
def crop(t, box, label): return (t[0].crop(box).resize((800, 600), Image.LANCZOS), label, t[2] + ' (crop)')
med = bl('r2_hero_half_medium', 'HERO half state, plan row 4 framing'); side = bl('r2_hero_runs_side', 'HERO side: lemon runs, kraft tyre')
tiles = [med, crop(med, (150, 180, 450, 405), '2.7x crop: card, Gazette, sirens, kraft'), bl('r2_hero_card_close', 'windscreen: price card + Gazette pane'), side,
         bl('r2_hero_roofline_dusk', 'dusk roof: 4 sirens + beacon row (wave)'), bl('r2_chief_engine2_old', "Chief's ENGINE No. 2, aged, bay 2"),
         bl('r2_chief_engine2_door', 'ENGINE No. 2 door: old chrome, soot'), bl('r2_light_vs_full', 'LIGHT 35k (back) beside FULL 182k (front)'),
         bl('r2_dallas_pair', 'DALLAS pair: No. 14 red 3 plasters, No. 22 lime'), bl('r2_toy_truck', 'TOY: light truck at 18 cm, worn'),
         bl('r2_milk_van', 'MILK VAN Meadowbrook Dairy + hubcap, crate'), bl('r2_hubcap_bottles', 'hubcap, milk bottles, crate'),
         bl('r2_ribbon_set', 'scissors on velvet cushion on stool'), bl('r2_lunchbox_lemon', 'lunch box + lemon'), bl('r2_tins_mug', 'paint tins LEMON YELLOW / LIME / RED + mug'),
         crop(side, (0, 100, 400, 400), '2x crop: lemon runs over the red')]
TW, TH, LH = 400, 300, 40
sheet = Image.new('RGB', (TW * 4, (TH + LH) * 4), (24, 24, 26)); d = ImageDraw.Draw(sheet)
f1 = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 12); f2 = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 12)
nums = {}
for i, (img, lab, sec) in enumerate(tiles):
    x, y = (i % 4) * TW, (i // 4) * (TH + LH)
    t = img.resize((TW, TH), Image.LANCZOS); sheet.paste(t, (x, y)); m = metrics(t); nums[lab] = dict(sec=sec, **m)
    d.text((x + 6, y + TH + 4), lab[:56], font=f1, fill=(235, 235, 235))
    d.text((x + 6, y + TH + 21), 'Cycles CPU 32spp+OIDN 800x600  %s  edge %.3f' % (sec, m['edge_density']), font=f2, fill=(200, 200, 170))
sheet.save(OUTJ, quality=88)
json.dump(nums, open(os.path.join(AP, 'proof', 'numbers_r2.json'), 'w'), indent=1)
for k, v in nums.items(): print(k, v['sec'], 'edge %.3f' % v['edge_density'])
