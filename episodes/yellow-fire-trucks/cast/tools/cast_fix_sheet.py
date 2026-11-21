# cast_fix_sheet.py (character-artist FIX 1, 2026-11-21): CAST_FIX.jpg = before/after of the helmet badge in the LEFT views, the mirror-down face,
# the kid plaster, and the three seated drivers in the real truck / van from three lenses (cast/cabtest stills). Inputs: out/before/*.png (CAST_BEFORE run),
# views/*.png (render_cast), cabtest/out/stills/f_000{07..87}.png. Output 1600 px wide.
import os
from PIL import Image, ImageDraw, ImageFont
C = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
F = ImageFont.load_default()
def head(p, box=(130, 120, 470, 520), h=170):
    im = Image.open(p).convert('RGBA').crop(box); w = round(im.width * h / im.height); bg = Image.new('RGBA', im.size, (214, 211, 204, 255)); bg.alpha_composite(im); return bg.convert('RGB').resize((w, h))
rows = []
# row 1-2: badge before / after, left views of every helmeted puppet
who = ['chief', 'chiefVisitor', 'oldTimer', 'rookie', 'sceptic', 'crew1', 'crew2', 'crew3']
for tag, d in [('BEFORE (film draws dir -1: head layers mirrored, badge read backwards)', 'out/before'), ('AFTER (badge counter-flipped: reads in every view)', 'views')]:
    tiles = []
    for w in who:
        for v in (['34L'] if w not in ('chief',) else ['34L', 'front']):
            p = os.path.join(C, d, f'{w}_{v}.png')
            if os.path.exists(p): tiles.append((f'{w} {v}', head(p, (150, 190, 450, 560), 150)))
    rows.append((tag, tiles))
# row 3: mirror down
tiles = [(f'heroShopEye {v}', head(os.path.join(C, 'views', f'heroShopEye_{v}.png'), (150, 230, 450, 560), 170)) for v in ['front', '34', '34L', 'side', 'sideL', '34_concentrate']]
tiles.append(('heroShop 34 (mirror up)', head(os.path.join(C, 'views', 'heroShop_34.png'), (150, 230, 450, 560), 170)))
rows.append(('FIX 2 heroShopEye: head mirror DOWN over the right eye, centre hole on the eye, left lens clear', tiles))
# row 4: kid plaster (left knee) before / after
tiles = []
for d, t in [('out/before', 'before'), ('views', 'after')]:
    for v in ['34L', 'sideL']: tiles.append((f'kid {v} {t}', head(os.path.join(C, d, f'kid_{v}.png'), (200, 820, 400, 1100), 170)))
rows.append(('FIX 4 kid plaster, LEFT knee: 3/4 L and side L, before (mirrored to the right knee) / after (dir -1 drawing: left knee)', tiles))
# rows 5-6: drivers in the kit
S = os.path.join(C, 'cabtest', 'out', 'stills'); names = ['Sceptic side (door)', 'Sceptic 3/4 windscreen', 'Sceptic high front', 'Rookie side', 'Rookie 3/4', 'Rookie high front', 'Milkman side (van door open)', 'Milkman 3/4', 'Milkman high front']
fr = [7, 17, 27, 37, 47, 57, 67, 77, 87]
tiles = [(n, Image.open(os.path.join(S, f'f_{f:05d}.png')).convert('RGB').crop((40, 300, 500, 760)).resize((170, 170))) for n, f in zip(names, fr) if os.path.exists(os.path.join(S, f'f_{f:05d}.png'))]
rows.append(('FIX 3 seated drivers in the kit (render_gpu, real truck_light.glb / milk_van.glb, cast/cabtest): card cut at the seat, pose drive, in_vehicle', tiles))
W = 1600; H = sum(28 + max(t[1].height for t in r[1]) + 18 for r in rows) + 10
sheet = Image.new('RGB', (W, H), (228, 226, 221)); g = ImageDraw.Draw(sheet); y = 6
for tag, tiles in rows:
    g.text((8, y + 6), tag, fill=(30, 28, 36), font=F); y += 26; x = 8; hh = max(t[1].height for t in tiles)
    for n, im in tiles:
        if x + im.width > W + 6: break
        sheet.paste(im, (x, y)); g.text((x + 2, y + hh + 2), n, fill=(60, 56, 66), font=F); x += im.width + 6
    y += hh + 18
out = os.path.join(C, 'sheets', 'CAST_FIX.jpg'); sheet.save(out, quality=90); print(out, sheet.size)
