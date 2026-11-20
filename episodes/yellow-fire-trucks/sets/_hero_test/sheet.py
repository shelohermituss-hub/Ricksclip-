# Contact sheet + numbers for the hero proof. Reads stills/f_#####.png (tile i = frame 2 i). Writes ../../props/HERO_SHEET.jpg (1600 wide), crops and numbers.txt.
import json, os, sys, subprocess
from PIL import Image, ImageDraw, ImageFont
T = json.load(open('tiles.json')); here = os.path.dirname(os.path.abspath(__file__)); out = os.path.join(here, '..', '..', 'props'); os.makedirs(out, exist_ok=True)
ORDER = ['red_front34', 'red_side', 'red_rear34', 'front_face', 'yellow_front34', 'yellow_side', 'yellow_rear34', 'hose_bed_rear', 'half_front34', 'half_side', 'half_rear34', 'scale_fireman', 'pump_panel', 'door_lettering', 'spray_kit', 'gun_in_fist']
LAB = dict(red_front34='RED  front 3/4 (driver side)', red_side='RED  side', red_rear34='RED  rear 3/4 (officer side, ladder)', front_face='front face: bell, siren, beacon', yellow_front34='LEMON YELLOW  front 3/4', yellow_side='LEMON YELLOW  side', yellow_rear34='LEMON YELLOW  rear 3/4',
  hose_bed_rear='hose bed + tailboard', half_front34='HALF SPRAYED + masking  front 3/4', half_side='HALF SPRAYED  side', half_rear34='HALF SPRAYED  rear 3/4', scale_fireman='scale: 1.75 m fireman, gun in fist', pump_panel='close-up: pump panel', door_lettering='close-up: door gold leaf', spray_kit='spray kit: compressor, tin, gun', gun_in_fist='close-up: gun in the fist')
CW, CH = 400, 300; sheet = Image.new('RGB', (CW * 4, CH * 4), '#111')
try: font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 14)
except Exception: font = ImageFont.load_default()
have = []
for k, n in enumerate(ORDER):
    f = os.path.join(here, 'stills', 'f_%05d.png' % (T.index(n) * 2))
    if not os.path.exists(f): continue
    im = Image.open(f).convert('RGB'); have.append((n, f)); t = im.resize((CW, CH), Image.LANCZOS); d = ImageDraw.Draw(t); d.rectangle([0, 0, CW, 20], fill=(0, 0, 0)); d.text((6, 2), LAB[n], fill=(255, 240, 200), font=font)
    sheet.paste(t, ((k % 4) * CW, (k // 4) * CH))
sheet.save(os.path.join(out, 'HERO_SHEET.jpg'), quality=90); print('sheet', os.path.join(out, 'HERO_SHEET.jpg'), len(have), 'tiles')
# numbers: detail density of the close-ups and the full views (no Rick crop exists in this repo: our numbers only)
tool = os.path.join(here, '..', '..', '..', '..', 'tools', 'measure', 'detail_density.py')
r = subprocess.run([sys.executable, tool] + [f for _, f in have] + ['--json', os.path.join(here, 'detail.json')], capture_output=True, text=True)
open(os.path.join(here, 'numbers.txt'), 'w').write(r.stdout + r.stderr); print(r.stdout[-1800:] if r.stdout else r.stderr[-600:])

# full-size close-ups (stills_full, 1200x900): numbers + the three-view grip sheet
full = os.path.join(here, 'stills_full')
if os.path.isdir(full):
    fs = sorted(os.path.join(full, f) for f in os.listdir(full) if f.endswith('.png'))
    r = subprocess.run([sys.executable, tool] + fs, capture_output=True, text=True); open(os.path.join(here, 'numbers.txt'), 'a').write('\nFULL SIZE CLOSE-UPS (1200x900)\n' + r.stdout); print('FULL', r.stdout)
g = [os.path.join(here, 'stills', 'f_%05d.png' % (T.index(n) * 2)) for n in ('gun_in_fist', 'gun_front', 'gun_side')]
if all(os.path.exists(f) for f in g):
    S = Image.new('RGB', (1200, 450), '#111')
    for i, (f, lab) in enumerate(zip(g, ('3/4 view', 'front view', 'side view'))):
        im = Image.open(f).convert('RGB'); w, h = im.size; c = im.crop((int(w * .1), 0, int(w * .9), h)).resize((400, 375), Image.LANCZOS) if i else im.resize((400, 300), Image.LANCZOS); S.paste(c, (i * 400, 40)); ImageDraw.Draw(S).text((i * 400 + 8, 10), 'spray gun in the fist: ' + lab, fill=(255, 240, 200), font=font)
    S.save(os.path.join(out, 'GUN_GRIP_3VIEWS.jpg'), quality=90); print('grip sheet written')
