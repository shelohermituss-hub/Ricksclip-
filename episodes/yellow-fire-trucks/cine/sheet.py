"""sheet.py: cine/CINE_KEYS.jpg, per frame KIT reference | BLENDER CINEMATIC side by side, labelled, numbers under each.
usage: python sheet.py out.jpg  ROW...   where ROW = label|kit.png|blender.png|numbers.json   (numbers.json: {kit:{...}, blender:{...}, seconds, note})"""
import sys, json
from PIL import Image, ImageDraw, ImageFont
W = 1600; cw = 380; ch = int(cw * 16 / 9)
def font(sz):
    for f in ('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'):
        try: return ImageFont.truetype(f, sz)
        except Exception: pass
    return ImageFont.load_default()
F1, F2 = font(22), font(15)
rows = [r.split('|') for r in sys.argv[2:]]
per = 2 if len(rows) > 1 else 1
rh = ch + 150; sheet = Image.new('RGB', (W, rh * ((len(rows) + 1) // 2) + 10), (24, 22, 30)); d = ImageDraw.Draw(sheet)
for i, (label, kit, bl, nj) in enumerate(rows):
    N = json.load(open(nj)); x0 = (i % 2) * (W // 2) + 10; y0 = (i // 2) * rh + 10
    d.text((x0, y0), label, font=F1, fill=(255, 236, 200))
    for j, (f, tag, key) in enumerate(((kit, 'KIT (three.js reference)', 'kit'), (bl, 'BLENDER CINEMATIC', 'blender'))):
        im = Image.open(f).convert('RGB').resize((cw, ch), Image.LANCZOS); x = x0 + j * (cw + 10); sheet.paste(im, (x, y0 + 32))
        d.text((x, y0 + 36 + ch), tag, font=F2, fill=(230, 230, 230))
        n = N.get(key, {}); sec = N.get('seconds_' + key)
        t1 = 'sat %.2f  bright %.2f  dark1%% %.2f' % (n.get('sat', 0), n.get('mean', 0), n.get('dark1', 0))
        t2 = 'contrast %.2f  white %.2f  corner %.2f' % (n.get('contrast', 0), n.get('white', 0), n.get('corner', 0))
        t3 = ('render %s s' % sec) if sec else ''
        for k, t in enumerate((t1, t2, t3)): d.text((x, y0 + 56 + ch + 18 * k), t, font=F2, fill=(200, 200, 210))
    if N.get('note'): d.text((x0, y0 + 112 + ch), N['note'][:95], font=F2, fill=(255, 200, 160))
sheet.save(sys.argv[1], quality=90); print('SHEET', sys.argv[1], sheet.size)
