"""kit_vs_final.py: per stretch, kit draft (draft/FILM_DRAFT_v2.mp4) over Blender final (look/film/final) every 15 frames (2 fps) -> look/film/KIT_VS_FINAL_s#.jpg
  python3 -I episodes/plane-eater/look/film/kit_vs_final.py <draft frames dir (d_####.png = frame 15*i)>"""
import json, os, sys
from PIL import Image, ImageDraw, ImageFont
H = os.path.dirname(os.path.abspath(__file__)); CFG = json.load(open(os.path.join(H, 'stretches.json'))); DD = sys.argv[1]
F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 12)
for s, c in CFG.items():
    fr = [f for f in range(c['window'][0], c['window'][1] + 1) if f % 15 == 0]; per = 9; w, h = 176, 313; rows = (len(fr) + per - 1) // per
    S = Image.new('RGB', (per * w, rows * (2 * h + 16)), (15, 15, 18)); d = ImageDraw.Draw(S)
    for i, f in enumerate(fr):
        x, y = (i % per) * w, (i // per) * (2 * h + 16); dp = os.path.join(DD, 'd_%04d.png' % (f // 15)); fp = os.path.join(H, 'final', 'f_%05d.png' % f)
        if os.path.exists(dp): S.paste(Image.open(dp).convert('RGB').resize((w - 2, h)), (x, y + 14))
        if os.path.exists(fp): S.paste(Image.open(fp).convert('RGB').resize((w - 2, h)), (x, y + 14 + h))
        d.text((x + 3, y), 'f%d kit/blender' % f, fill=(255, 255, 255), font=F)
    S.save(os.path.join(H, 'KIT_VS_FINAL_%s.jpg' % s), quality=85); print(s, S.size)
