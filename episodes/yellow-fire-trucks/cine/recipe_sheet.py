"""recipe_sheet.py: RECIPE_KEYS.jpg = per key frame: kit frame | Blender Rick recipe (graded + thin lines), with measured numbers vs Rick targets."""
import json, os
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__)); W, H = 380, 676
F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 14); FB = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 17)
ROWS = [('A  S1 f0 town yard (DAY)', 'kit_A/f_00000.png', 'prev/A2_final.png', 'prev/A2_numbers.json'),
        ('B  S6 f1293 lamp room (INTERIOR, strength .45)', 'kit_B/f_01293.png', 'prev/B2_final.png', 'prev/B2_numbers.json')]
sh = Image.new('RGB', (4 * W + 40, H + 250), (24, 22, 30)); d = ImageDraw.Draw(sh)
for k, (title, kit, new, js) in enumerate(ROWS):
    x0 = k * (2 * W + 40); n = json.load(open(os.path.join(HERE, js)))
    d.text((x0 + 6, 6), title, font=FB, fill=(255, 236, 200))
    for j, (p, lab) in enumerate(((kit, 'KIT (three.js)'), (new, 'BLENDER RICK RECIPE + lines'))):
        sh.paste(Image.open(os.path.join(HERE, p)).convert('RGB').resize((W, H), Image.LANCZOS), (x0 + j * W, 32))
        d.text((x0 + j * W + 6, H + 36), lab, font=FB, fill=(255, 255, 255))
    t, f, r = n['target'], n['final'], n['raw']; y = H + 62
    d.text((x0 + 6, y), '%-9s %6s %6s %6s %6s %6s %6s' % ('', 'p1', 'p50', 'p99', 'mean', 'contr', 'sat'), font=F, fill=(200, 200, 210)); y += 18
    for lab, s in (('target', t), ('final', f), ('raw', r)):
        d.text((x0 + 6, y), '%-9s %6.3f %6.3f %6.3f %6.3f %6.3f %6.3f' % (lab, s['p1'], s['p50'], s['p99'], s['mean'], s['contrast'], s['sat']), font=F, fill=(230, 230, 230)); y += 18
    d.text((x0 + 6, y), 'shadows rgb  target %s  final %s' % (t['shadows'], f['shadows']), font=F, fill=(230, 230, 230)); y += 18
    d.text((x0 + 6, y), 'lines #2a1830 alpha %.2f, %.1f %% of pixels' % (n['line_alpha'], 100 * n['line_px']), font=F, fill=(230, 230, 230)); y += 22
d.text((6, H + 222), 'PREVIEW 540x960, Cycles CPU 16 spp + OIDN, view Standard. Finals 1080x1920 512 spp on RunPod (runpod/A2, runpod/B2). Numbers: rick_grade_study stats.',
       font=F, fill=(255, 200, 150))
sh.save(os.path.join(HERE, 'RECIPE_KEYS.jpg'), quality=90); print('SHEET', sh.size)
