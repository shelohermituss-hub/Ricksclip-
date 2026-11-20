# sheet.py: props/ASSET_PACK.jpg (1600 px wide, 4 x 4 labelled tiles) + proof/numbers.json. python3 sheet.py <assets_prod dir> <out jpg>
# Under each tile: the renderer, the measured seconds per frame of that render, edge density (tools/measure/detail_density.py metrics on the tile).
import sys, os, json, re
from PIL import Image, ImageDraw, ImageFont
AP, OUTJ = sys.argv[1], sys.argv[2]
sys.path.insert(0, os.path.join(AP, '..', '..', '..', 'tools', 'measure'))
from detail_density import metrics
T = os.path.join(AP, 'proof', 'tiles'); K = os.path.join(AP, 'proof', 'kit', 'stills')
times = {}
for f in ('times_truck.json', 'times_props.json'):
    p = os.path.join(T, f)
    if os.path.exists(p): times.update(json.load(open(p)))
kt = {}
for l in open(os.path.join(AP, 'logs', 'kit.log')):
    m = re.match(r'KIT_TIME (\S+) one_frame_run ([\d.]+) s, second_frame ([\d.]+) s', l)
    if m: kt[m.group(1)] = float(m.group(3))
def bl(n, label): return (Image.open(os.path.join(T, n + '.png')).convert('RGB'), 'BLENDER Cycles 32spp+OIDN: ' + label, '%.1f s/frame (800x600 CPU)' % times.get(n, -1))
def kit(n, label): return (Image.open(os.path.join(K, n, 'f_00000.png')).convert('RGB'), 'three.js KIT: ' + label, '%.1f s/frame (800x600, 2nd frame)' % kt.get(n, -1))
def crop(img, box, label, sec):   # a 1:1 crop of a tile already rendered (same seconds)
    return (img.crop(box).resize((800, 600), Image.NEAREST if False else Image.LANCZOS), label, sec)
tiles = [bl('bl_truck_red_f34', 'red, front 3/4'), bl('bl_truck_half_f34', 'half sprayed + masking + ribbon'), bl('bl_truck_lemon_f34', 'lemon'), bl('bl_truck_dusk_f34', 'dusk drain=1 (half)'),
         bl('bl_truck_red_side', 'red, side'), bl('bl_truck_half_side', 'half, side'), bl('bl_truck_lemon_side', 'lemon, side'), bl('bl_truck_dusk_side', 'dusk drain=1, side'),
         bl('bl_letters', 'door lettering close-up'), bl('bl_gun', 'spray gun alone'), bl('bl_comp_hose', 'compressor + air hose + gun'), kit('kit_truck_half_f34', 'SAME truck, same camera (half)')]
hs = tiles[5]; kf = kit('kit_gun_fist', "gun in the cast's round fist")
tiles += [kf, crop(tiles[8][0], (200, 150, 600, 450), 'BLENDER: lettering, 1:1 crop of the close-up', tiles[8][2]),
          crop(hs[0], (300, 200, 500, 350), 'BLENDER: sprayed edge, 4x crop of the side tile', hs[2]),
          crop(tiles[1][0], (150, 260, 350, 410), 'BLENDER: bell + bow, 4x crop of the half tile', tiles[1][2])]
TW, TH, LH = 400, 300, 40
sheet = Image.new('RGB', (TW * 4, (TH + LH) * 4), (24, 24, 26)); d = ImageDraw.Draw(sheet)
f1 = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 12); f2 = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 12)
nums = {}
for i, (img, lab, sec) in enumerate(tiles):
    x, y = (i % 4) * TW, (i // 4) * (TH + LH)
    t = img.resize((TW, TH), Image.LANCZOS); sheet.paste(t, (x, y))
    m = metrics(t); nums[lab] = dict(sec=sec, **m)
    d.text((x + 6, y + TH + 4), lab[:62], font=f1, fill=(235, 235, 235))
    d.text((x + 6, y + TH + 21), '%s   edge %.3f' % (sec, m['edge_density']), font=f2, fill=(200, 200, 170))
sheet.save(OUTJ, quality=88)
json.dump(nums, open(os.path.join(AP, 'proof', 'numbers.json'), 'w'), indent=1)
for k, v in nums.items(): print(k, v)
