# TEST ONLY: ../../props/ASSET_TEST.jpg (1600 wide, 4 x 4 labelled tiles, a numbers line under each) + numbers.json.
# python3 sheet.py   (reads _hero_test/stills, stills_kit/, out/*.png, out/*.log, numbers_in.json for times)
import json, os, re, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
H = os.path.dirname(os.path.abspath(__file__)); HT = os.path.join(H, '..', '_hero_test', 'stills'); O = os.path.join(H, 'out'); KS = os.path.join(H, 'stills_kit')
TOOL = os.path.join(H, '..', '..', '..', '..', 'tools', 'measure', 'detail_density.py')
def bl_time(name):
    for lg in ('batch.log', 'batch2.log'):
        t = open(os.path.join(O, lg)).read().split('== ')
        for blk in t:
            if blk.startswith(name + ' '):
                m = re.search(r'RENDER_SECONDS ([\d.]+)', blk); return float(m.group(1)) if m else None
def kit_time(t):
    m = re.search(r'KIT_TIME %s one_frame_run ([\d.]+) s, second_frame ([\d.-]+) s' % t, open(os.path.join(O, 'kit.log')).read()); return float(m.group(2)) if m else None
CODED = json.load(open(os.path.join(H, 'coded_time.json'))) if os.path.exists(os.path.join(H, 'coded_time.json')) else {}
AFE, ALF, GUN = '1.80 M tris, CC-BY', '137 k tris, CC-BY', '25 k tris, CC-BY'
# (label, file, crop box in source px or None, seconds-per-frame label, tris+licence, what is still wrong)
T = [
 ('CODED truck, three.js kit (ours)', os.path.join(HT, 'f_00000.png'), None, 's/f %s (tile 600x450)' % CODED.get('red', '~2.5 @600x450'), '103 k tris, own', ''),
 ('ASSET Pierce, three.js kit', os.path.join(KS, 'kit_afe_red', 'f_00000.png'), None, 's/f %s @1200x900' % kit_time('kit_afe_red'), AFE, ''),
 ('ASSET Pierce, Blender Cycles 32spp+OIDN', os.path.join(O, 't_bl_afe_red_34.png'), None, 's/f %s @1200x900' % bl_time('t_bl_afe_red_34'), AFE, ''),
 ('ASSET 1940s ALF, Blender Cycles (as shipped)', os.path.join(O, 't_bl_alf_orig_34.png'), None, 's/f %s @1200x900' % bl_time('t_bl_alf_orig_34'), ALF, ''),
 ('CODED half sprayed (ours)', os.path.join(HT, 'f_00012.png'), None, 's/f %s (tile 600x450)' % CODED.get('half', '~2.5 @600x450'), '103 k tris, own', ''),
 ('ASSET Pierce half, three.js kit', os.path.join(KS, 'kit_afe_half', 'f_00000.png'), None, 's/f %s @1200x900' % kit_time('kit_afe_half'), AFE, ''),
 ('ASSET Pierce half, Blender Cycles', os.path.join(O, 't_bl_afe_half_34.png'), None, 's/f %s @1200x900' % bl_time('t_bl_afe_half_34'), AFE, ''),
 ('ASSET Pierce half, Blender EEVEE (CPU GL)', os.path.join(O, 't_ee_afe_half_34.png'), None, 's/f %s @1200x900' % bl_time('t_ee_afe_half_34'), AFE, ''),
 ('ASSET Pierce half, Blender Cycles DUSK', os.path.join(O, 't_bl_afe_half_dusk_34.png'), None, 's/f %s @1200x900' % bl_time('t_bl_afe_half_dusk_34'), AFE, ''),
 ('ASSET 1940s ALF, three.js kit (as shipped)', os.path.join(KS, 'kit_alf_orig', 'f_00000.png'), None, 's/f %s @1200x900' % kit_time('kit_alf_orig'), ALF, ''),
 ('ASSET 1940s ALF half, Blender Cycles', os.path.join(O, 'bl_alf_half_sun_540.png'), (0, 300, 540, 705), 's/f %s @540x960' % bl_time('bl_alf_half_sun_540'), ALF, ''),
 ('ASSET Pierce 1080x1920 Cycles (crop)', os.path.join(O, 'bl_afe_red_sun_1080.png'), (0, 600, 1080, 1410), 's/f %s @1080x1920' % bl_time('bl_afe_red_sun_1080'), AFE, ''),
 ('CODED gun in fist (ours)', os.path.join(HT, 'f_00026.png'), None, 's/f %s (tile 600x450)' % CODED.get('gun', '~2.5 @600x450'), '5.8 k tris, own', ''),
 ('ASSET spray gun in fist, three.js kit', os.path.join(KS, 'kit_gun_fist', 'f_00000.png'), None, 's/f %s @1200x900' % kit_time('kit_gun_fist'), GUN, ''),
 ('ASSET spray gun, Blender Cycles', os.path.join(O, 'bl_gun_sun_540.png'), (0, 250, 540, 655), 's/f %s @540x960' % bl_time('bl_gun_sun_540'), GUN, ''),
 ('ASSET compressor, Blender Cycles', os.path.join(O, 'bl_comp_sun_540.png'), (0, 250, 540, 655), 's/f %s @540x960' % bl_time('bl_comp_sun_540'), '18 k tris, CC-BY', ''),
]
CW, CHI, BAR = 400, 300, 34
sheet = Image.new('RGB', (CW * 4, (CHI + BAR) * 4), '#111'); d = ImageDraw.Draw(sheet)
try: F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 13); F2 = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 12)
except Exception: F = F2 = ImageFont.load_default()
crops, nums = [], {}
os.makedirs(os.path.join(H, 'tiles'), exist_ok=True)
for k, (lab, f, box, sec, tri, _) in enumerate(T):
    x, y = (k % 4) * CW, (k // 4) * (CHI + BAR)
    if not os.path.exists(f): d.text((x + 8, y + 140), 'MISSING ' + os.path.basename(f), fill=(255, 80, 80), font=F); continue
    im = Image.open(f).convert('RGB'); im = im.crop(box) if box else im
    im = im.resize((CW, CHI), Image.LANCZOS); tp = os.path.join(H, 'tiles', 't%02d.png' % k); im.save(tp); crops.append((k, tp))
    sheet.paste(im, (x, y)); d.rectangle([x, y, x + CW, y + 18], fill=(0, 0, 0)); d.text((x + 5, y + 2), lab, fill=(255, 240, 200), font=F)
r = subprocess.run([sys.executable, TOOL] + [p for _, p in crops] + ['--json', os.path.join(H, 'detail.json')], capture_output=True, text=True)
for line in r.stdout.splitlines():
    m = re.match(r"t(\d+)\.png \{'edge_density': ([\d.]+), 'regions': (\d+)", line)
    if m: nums[int(m.group(1))] = (float(m.group(2)), int(m.group(3)))
for k, (lab, f, box, sec, tri, _) in enumerate(T):
    x, y = (k % 4) * CW, (k // 4) * (CHI + BAR) + CHI
    e = nums.get(k); d.text((x + 5, y + 2), '%s | %s' % (sec, tri), fill=(220, 220, 220), font=F2)
    d.text((x + 5, y + 17), 'edge %.3f  regions %d' % e if e else 'edge -', fill=(160, 220, 160), font=F2)
out = os.path.join(H, '..', '..', 'props', 'ASSET_TEST.jpg'); sheet.save(out, quality=88)
json.dump({T[k][0]: dict(sec=T[k][3], tris=T[k][4], edge=nums.get(k, (None,))[0], regions=nums.get(k, (0, None))[1]) for k in range(len(T))}, open(os.path.join(H, 'numbers.json'), 'w'), indent=1)
print(out); print(r.stdout[-1500:] or r.stderr[-800:])
