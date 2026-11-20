#!/usr/bin/env python3
"""Turntable sheets: one picture per act, 7 camera angles across, high / eye / low down. Each tile says the angle, the camera
height, the drawing the pipeline picked, and (when tools/camsafe/report.json exists) the validator's verdict for that frame.
  python tools/camsafe/turntable_sheet.py <turntable_dir> [--stills out/stills] [--tag before]"""
import json, os, sys
from PIL import Image, ImageDraw, ImageFont
d = sys.argv[1]; A = sys.argv[2:]
stills = os.path.join(d, A[A.index('--stills') + 1] if '--stills' in A else 'out/stills'); tag = A[A.index('--tag') + 1] if '--tag' in A else ''
idx = json.load(open(os.path.join(d, 'turntable_index.json')))
perf = json.load(open(os.path.join(d, 'out', 'plan', 'performance_baked.json')))['hero']
rep = {}
rp = os.path.join(d, 'out', 'plan', 'camsafe_report.json')
if os.path.exists(rp): rep = {r['f']: r for r in json.load(open(rp))['frames'] if r['who'] == 'hero'}
def st(f):
    for r in perf:
        if r['f0'] <= f <= r['f1']: return r['state']
def font(s):
    for p in ('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', '/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf'):
        if os.path.exists(p): return ImageFont.truetype(p, s)
    return ImageFont.load_default()
F1, F2 = font(15), font(13)
TW, TH = 222, 330; CROP = (40, 120, 500, 803)                                  # middle of the 540x960 frame
VN = {'front': 'front', '34': '3/4', 'side': 'side', 'back': 'back'}
acts = []
for r in idx:
    if r['act'] not in acts: acts.append(r['act'])
for act in acts:
    rows = [r for r in idx if r['act'] == act]; hs = []
    for r in rows:
        if r['height'] not in hs: hs.append(r['height'])
    angs = sorted({r['angle'] for r in rows})
    W = 70 + len(angs) * (TW + 4); H = 46 + len(hs) * (TH + 40)
    im = Image.new('RGB', (W, H), '#eef1f6'); g = ImageDraw.Draw(im)
    g.text((10, 10), f'{act.upper()}  ·  camera goes round him, he never turns  ·  {tag}', fill='#1d2f6f', font=font(20))
    for j, a in enumerate(angs): g.text((70 + j * (TW + 4) + TW // 2 - 18, 30 if False else 34), '', fill='#000')
    for i, h in enumerate(hs):
        y0 = 46 + i * (TH + 40)
        g.text((6, y0 + TH // 2), h, fill='#1d2f6f', font=F1)
        for j, a in enumerate(angs):
            r = next(x for x in rows if x['height'] == h and x['angle'] == a); x0 = 70 + j * (TW + 4)
            p = os.path.join(stills, 'f_%05d.png' % r['f'])
            if os.path.exists(p): im.paste(Image.open(p).convert('RGB').crop(CROP).resize((TW, TH)), (x0, y0))
            s = st(r['f']); v = rep.get(r['f'], {}).get('view_drawn') or s.get('view'); mir = ' L' if (s.get('dir') == -1 and v in ('34', 'side')) else ''
            g.text((x0 + 4, y0 + TH + 2), f"{a}°  drawn {VN.get(v, v)}{mir}", fill='#1d2f6f', font=F1)
            R = rep.get(r['f'])
            if R:
                col = {'PASS': '#2e7d32', 'WARN': '#c77700', 'FAIL': '#c62828'}[R['verdict']]
                g.rectangle([x0, y0, x0 + TW - 1, y0 + TH - 1], outline=col, width=4 if R['verdict'] != 'PASS' else 2)
                g.text((x0 + 4, y0 + TH + 19), (R['verdict'] + ' ' + ', '.join(R['flags'])[:30]), fill=col, font=F2)
    o = os.path.join(d, f'turntable_{act}{("_" + tag) if tag else ""}.png'); im.save(o); print(o)
