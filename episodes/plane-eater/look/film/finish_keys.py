"""finish_keys.py (look-finisher): grade + outline + numbers on the Blender key frames of the film stretches (finish_key.py, as the LOOK CARD),
then the sheet look/KEYS_FILM.jpg (<= 1600 px wide) and keys_numbers.json.   python3 -I episodes/plane-eater/look/film/finish_keys.py"""
import json, os, glob, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
H = os.path.dirname(os.path.abspath(__file__)); LOOK = os.path.dirname(H); EP = os.path.dirname(LOOK); ROOT = os.path.dirname(os.path.dirname(EP))
FK = os.path.join(ROOT, 'episodes', 'yellow-fire-trucks', 'cine', 'finish_key.py'); CFG = json.load(open(os.path.join(H, 'stretches.json')))
KD = os.path.join(H, 'keys'); W = json.load(open(os.path.join(EP, 'voice', 'words.json')))
def word_at(f):
    t = f / 30; best = min(W, key=lambda x: 0 if x['s'] <= t <= x['e'] else min(abs(t - x['s']), abs(t - x['e']))); return best['w']
nums, tiles = {}, []
for st, c in CFG.items():
    for f in c['keys']:
        raw = os.path.join(KD, '%s_f%04d.png' % (st, f))
        if not os.path.exists(raw): continue
        fin = raw.replace('.png', '_final.png'); js = raw.replace('.png', '_num.json'); kind, s = c.get('grade_keys', {}).get(str(f), c.get('grade', ['DAY', .5])); extra = c.get('grade_extra', {}).get(str(f), [])
        r = subprocess.run([sys.executable, FK, raw, os.path.join(KD, '%s_f%04d_' % (st, f), 'pass_mask.png'), raw.replace('.png', '_lines_id.png'), fin, '--kind', kind, '--strength', str(s), '--json', js] + extra, capture_output=True, text=True)
        if r.returncode: print(r.stderr[-800:]); continue
        ov = os.path.join(EP, st, 'out', 'overlay', 'o_%05d.png' % f)          # the kit's drawn layer (focus lines, glints, captions) over the graded frame
        if os.path.exists(ov):
            base = Image.open(fin).convert('RGBA'); o_ = Image.open(ov).convert('RGBA').resize(base.size, Image.LANCZOS); Image.alpha_composite(base, o_).convert('RGB').save(fin)
        n = json.load(open(js)); nums['%s_f%04d' % (st, f)] = dict(word=word_at(f), kind=kind, final=n['final'], target=n['target'], line_px=n['line_px']); tiles.append((st, f, fin, n))
json.dump(nums, open(os.path.join(LOOK, 'keys_numbers.json'), 'w'), indent=1)
F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 13); FS = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 11)
n = len(tiles); per = min(n, 8); w = 1590 // per; h = int(w * 16 / 9); rows = (n + per - 1) // per
S = Image.new('RGB', (1590, rows * (h + 54) + 26), (18, 18, 22)); d = ImageDraw.Draw(S)
d.text((6, 5), 'PLANE-EATER  BLENDER FILM KEYS (from the kit locks; 540x960 24 spp + OIDN CPU, grade_rick + rick_outline as the LOOK CARD)', fill=(235, 235, 235), font=F)
for i, (st, f, fin, nn) in enumerate(tiles):
    x, y = (i % per) * w, 26 + (i // per) * (h + 54); S.paste(Image.open(fin).convert('RGB').resize((w - 4, h), Image.LANCZOS), (x + 2, y))
    fi, tg = nn['final'], nn['target']
    d.text((x + 4, y + h + 2), '%s f%d "%s"' % (st.upper(), f, word_at(f)), fill=(255, 255, 255), font=F)
    d.text((x + 4, y + h + 19), 'mean %.2f/%.2f sat %.2f/%.2f' % (fi['mean'], tg['mean'], fi['sat'], tg['sat']), fill=(160, 200, 255), font=FS)
    d.text((x + 4, y + h + 33), 'p1 %.2f/%.2f p99 %.2f/%.2f' % (fi['p1'], tg['p1'], fi['p99'], tg['p99']), fill=(160, 200, 255), font=FS)
S.save(os.path.join(LOOK, 'KEYS_FILM.jpg'), quality=90); print('KEYS_FILM', S.size, len(tiles))
