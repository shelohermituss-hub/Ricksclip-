"""sheets.py: the 4 fps strip sheet and the feet-and-eyes zoom sheet of S1 from frames/ (captions burned in) and the baked plan."""
import json, sys, os
from PIL import Image, ImageDraw
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../../tools')); import film_plan as FP
H = os.path.dirname(os.path.abspath(__file__)); fr = lambda f: Image.open(os.path.join(H, 'frames/f_%05d.png' % f)).convert('RGB')
fs = list(range(0, 289, 8)); w, h = 160, 284; cols = 10; S = Image.new('RGB', (w * cols, (h + 14) * ((len(fs) + cols - 1) // cols)), 'white'); d = ImageDraw.Draw(S)
for i, f in enumerate(fs): x, y = (i % cols) * w, (i // cols) * (h + 14); S.paste(fr(f).resize((w, h)), (x, y + 14)); d.text((x + 3, y + 1), 'f%d %.2fs' % (f, f / 30), fill='black')
S.save(os.path.join(H, 'S1_strip_4fps.jpg'), quality=85)
F = json.load(open(os.path.join(H, 'film.json'))); cam = json.load(open(os.path.join(H, 'out/plan/camera_baked.json')))['frames']; perf = json.load(open(os.path.join(H, 'out/plan/performance_baked.json')))
tiles = []
for f in (0, 60, 130, 168, 200, 230, 272):
    im = fr(f); W, Hh = im.size
    for who, runs in perf.items():
        st = FP.perf_at(runs, f)
        if not st.get('visible'): continue
        P = st['pos']; ht = F['cast'][who]['height']
        for tag, z, half in (('eyes', ht * .86, 120), ('feet', 0.02, 110)):
            p = FP.project(cam[f], [P[0], P[1], P[2] + z])
            if not p or not (0 <= p[0] <= 1 and 0 <= p[1] <= 1): continue
            k = max(.4, min(2.5, 3.0 / p[2])); r = int(half * k); cx, cy = int(p[0] * W), int(p[1] * Hh)
            tiles.append(('f%d %s %s' % (f, who, tag), im.crop((cx - r, cy - r, cx + r, cy + r)).resize((200, 200))))
cols = 8; Z = Image.new('RGB', (200 * cols, 214 * ((len(tiles) + cols - 1) // cols)), 'white'); d = ImageDraw.Draw(Z)
for i, (t, im) in enumerate(tiles): x, y = (i % cols) * 200, (i // cols) * 214; Z.paste(im, (x, y + 14)); d.text((x + 3, y + 1), t, fill='black')
Z.save(os.path.join(H, 'S1_feet_eyes.jpg'), quality=85); print('sheets:', len(fs), 'strip frames,', len(tiles), 'zoom tiles')
