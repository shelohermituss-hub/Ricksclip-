"""finish_dir.py <keys dir> <sheet.jpg>: finish (grade, sat_fit, fx, kit overlay) every <s>_f####.png of a key folder as post_film.py does, and a
sheet: kit draft frame (draft/FILM_DRAFT_v2.mp4) above the Blender key, per frame, with mean/sat."""
import os, sys, json, glob, subprocess
from PIL import Image, ImageDraw, ImageFont
H = os.path.dirname(os.path.abspath(__file__)); EP = os.path.dirname(os.path.dirname(H)); ROOT = os.path.dirname(os.path.dirname(EP)); sys.path.insert(0, H)
import sat_fit as SF, fx_layer as FXL
CFG = json.load(open(os.path.join(H, 'stretches.json'))); FK = os.path.join(ROOT, 'episodes', 'yellow-fire-trucks', 'cine', 'finish_key.py'); TG = os.path.join(os.path.dirname(FK), 'rick_targets.json')
KD, OUT = sys.argv[1], sys.argv[2]; tiles = []
for raw in sorted(glob.glob(os.path.join(KD, 's?_f????.png'))):
    b = os.path.basename(raw)[:-4]; st, f = b.split('_f'); f = int(f); c = CFG[st]; mk = os.path.join(KD, b + '_', 'pass_mask.png'); fin = os.path.join(KD, b + '_final.png')
    kind, s = c.get('grade', ['DAY', .5])
    for r in c.get('grade_ranges', []):
        if r[0] <= f <= r[1]: kind, s = r[2], r[3]
    subprocess.run([sys.executable, FK, raw, mk, os.path.join(KD, b + '_lines_id.png'), fin, '--kind', kind, '--strength', str(s), '--targets', TG], check=True, capture_output=True)
    SF.fit(fin, mk, kind, TG, c.get('sat_kmax', 2.4)); FXL.apply(fin, mk, os.path.join(H, 'fx', st + '_fx.json'), f)
    ov = os.path.join(EP, st, 'out', 'overlay', 'o_%05d.png' % f)
    if os.path.exists(ov):
        im = Image.open(fin).convert('RGBA'); Image.alpha_composite(im, Image.open(ov).convert('RGBA').resize(im.size)).convert('RGB').save(fin)
    kit = os.path.join(KD, 'kit_%05d.png' % f)
    if not os.path.exists(kit): subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(EP, 'draft', 'FILM_DRAFT_v2.mp4'), '-vf', 'select=eq(n\\,%d)' % f, '-vsync', '0', '-frames:v', '1', kit])
    stt = SF.stats(__import__('numpy').asarray(Image.open(fin).convert('RGB'))); tiles.append((st, f, kit, fin, stt))
F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 12); n = len(tiles); w = min(198, 1584 // max(n, 1)); h = int(w * 16 / 9)
S = Image.new('RGB', (w * n, 2 * h + 34), (15, 15, 18)); d = ImageDraw.Draw(S)
for i, (st, f, kit, fin, stt) in enumerate(tiles):
    if os.path.exists(kit): S.paste(Image.open(kit).convert('RGB').resize((w - 2, h)), (i * w, 16))
    S.paste(Image.open(fin).convert('RGB').resize((w - 2, h)), (i * w, 16 + h)); d.text((i * w + 3, 2), '%s f%d kit/blender' % (st, f), fill=(255, 255, 255), font=F)
    d.text((i * w + 3, 18 + 2 * h), 'mean %.2f sat %.2f' % (stt['mean'], stt['sat']), fill=(160, 200, 255), font=F)
S.save(OUT, quality=88); print('SHEET', OUT, n)
