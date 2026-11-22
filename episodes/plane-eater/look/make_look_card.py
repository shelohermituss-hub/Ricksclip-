"""make_look_card.py (look-finisher): LOOK_CARD.jpg = the 3 key frames + palette swatches with hex + one light line per place + numbers vs targets,
and the 360 px phone strip. python3 -I episodes/plane-eater/look/make_look_card.py"""
import json, os
from PIL import Image, ImageDraw, ImageFont
H_ = os.path.dirname(os.path.abspath(__file__)); EP = os.path.dirname(H_)
FB = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 17); FS = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 14)
FR = [('A_apron_row1.png', 'A  APRON, frame 0 (row 1 "In 1978,")', 'prev/A_p3_num_s0.5.json', 'DAY',
       'DAY noon: rick_light day, sun #ffe2c0 str 7 el 50 from SSE, sky fill #b4c3f0 .85, Light Path sky #0f79e8; tree shade on the near concrete; grade DAY .5'),
      ('B_xray_row20.png', 'B  X-RAY ROOM, over the shoulder (rows 19-20)', 'prev/B_p4_num_s1.json', 'INTERIOR',
       'CLINIC: set window sun 2.2 + troffer 35 W + light-box glow 10 W + desk-lamp pool; exposure -0.6; grade INTERIOR 1.0'),
      ('C_cabin_row36.png', 'C  CABIN, the grey meal (row 36 "STILL better")', 'prev/C_p2_num.json', 'INTERIOR',
       'CABIN: set sun 4 through the window + 2 cove fills 28 W + window fill 8 W; window view card (sky + cumulus) seen by the lens; grade INTERIOR .6')]
PAL = [('#d62828', 'THE ONE RED'), ('#f3f4f1', 'Cessna white'), ('#1d3461', 'navy stripe'), ('#0f79e8', 'sky zenith'), ('#1a86f2', 'sky low'), ('#b5cbf3', 'cloud shade'),
       ('#9ccc3c', 'airfield green'), ('#f0a81c', 'oil amber'), ('#f2c230', 'owner rag'), ('#7fe9ff', 'X-ray cyan'), ('#2f6fb3', 'X-ray blue'), ('#1f4fa0', 'cabin seats'),
       ('#b9b3a3', 'grey meal'), ('#c9dcc0', 'hangar sage'), ('#2a1830', 'outline')]
W, FW, FH = 1590, 520, 924; HDR = 30; PALH = 96; TXT = 3 * 62 + 10
S = Image.new('RGB', (W, HDR + FH + PALH + TXT), (18, 18, 22)); d = ImageDraw.Draw(S)
d.text((8, 6), 'PLANE-EATER  LOOK CARD  (Blender Cycles CPU, 540x960 24 spp + OIDN, view Standard, rick_outline + grade_rick; light previews, not final)', fill=(235, 235, 235), font=FB)
for i, (f, t, _, _, _) in enumerate(FR):
    im = Image.open(os.path.join(H_, f)).convert('RGB').resize((FW, FH), Image.LANCZOS); S.paste(im, (i * (FW + 15), HDR))
    d.rectangle((i * (FW + 15), HDR + FH - 26, i * (FW + 15) + FW, HDR + FH), fill=(0, 0, 0)); d.text((i * (FW + 15) + 6, HDR + FH - 23), t, fill=(255, 255, 255), font=FS)
y = HDR + FH + 8; sw = W // len(PAL)
for i, (hx, nm) in enumerate(PAL):
    c = tuple(int(hx[k:k + 2], 16) for k in (1, 3, 5)); d.rectangle((i * sw + 3, y, i * sw + sw - 3, y + 48), fill=c, outline=(90, 90, 90))
    d.text((i * sw + 4, y + 52), hx, fill=(230, 230, 230), font=FS); d.text((i * sw + 4, y + 70), nm[:13], fill=(170, 170, 170), font=FS)
y = HDR + FH + PALH + 6
for f, t, nj, kind, light in FR:
    n = json.load(open(os.path.join(H_, nj))); fi, tg = n['final'], n['target']
    d.text((8, y), t.split(',')[0] + ': ' + light, fill=(225, 225, 225), font=FS)
    line = '   measured vs %s target: mean %.3f/%.3f  p1 %.3f/%.3f  p50 %.3f/%.3f  p99 %.3f/%.3f  sat %.3f/%.3f  contrast %.3f/%.3f  shadows %s/%s  lines %.1f %%' % (
        kind, fi['mean'], tg['mean'], fi['p1'], tg['p1'], fi['p50'], tg['p50'], fi['p99'], tg['p99'], fi['sat'], tg['sat'], fi.get('contrast', 0), tg.get('contrast', 0),
        '/'.join('%.2f' % v for v in fi['shadows']), '/'.join('%.2f' % v for v in tg['shadows']), 100 * n['line_px'])
    d.text((8, y + 20), line, fill=(160, 200, 255), font=FS); y += 62
S.save(os.path.join(EP, 'LOOK_CARD.jpg'), quality=90); print('LOOK_CARD', S.size)
P = Image.new('RGB', (360 * 3 + 20, 640), (0, 0, 0))
for i, (f, *_r) in enumerate(FR): P.paste(Image.open(os.path.join(H_, f)).convert('RGB').resize((360, 640), Image.LANCZOS), (i * 370, 0))
P.save(os.path.join(H_, 'prev', 'phone360.jpg'), quality=88); print('PHONE', P.size)
