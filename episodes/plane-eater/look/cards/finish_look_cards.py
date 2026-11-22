"""look-finisher (plane-eater LOOK CARD): crop + costume shade the raw posed cards of make_look_cards.mjs -> look/cards/<id>.png + cards.json.
  python3 episodes/plane-eater/look/cards/finish_look_cards.py
Costume shade = CAST_KEYS costume_shade (amount .45, start .35, cool .15, smooth 40), the port used by _style_test/cast/tools/finish_cards.py:
darker side away from the key, faces / whites / ink untouched. SIDE per card = screen side of the shade (-1 left, +1 right).
"""
import json, os
import numpy as np
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__))
META = json.load(open(os.path.join(HERE, 'raw_meta.json'))); SC = META['scale']
CS = dict(amount=.45, start=.35, cool=.15, smooth=40)
SIDE = {'michel_salt': 1, 'doctor_clip': -1, 'owner_polish': 1, 'michel_meal': 1}


def shade(rgba, side):
    a = rgba.astype(np.float32); H, W = a.shape[:2]; r, g, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
    ink = (r + g + b) < 150
    mx, mn = np.maximum(np.maximum(r, g), b), np.minimum(np.minimum(r, g), b)
    skin = ((mx - mn) <= 40) & (mn >= 150)
    cloth = (al >= 128) & ~ink & ~skin
    XL = np.full(H, -1.0); XR = np.full(H, -1.0)
    for y in range(H):
        xs = np.nonzero(cloth[y])[0]
        if len(xs): XL[y], XR[y] = xs[0], xs[-1]
    n = max(1, round(CS['smooth'] * H / 1500)); A0, B0 = XL.copy(), XR.copy()
    for y in range(H):
        if A0[y] < 0: continue
        lo, hi = max(0, y - n), min(H, y + n + 1); seg = A0[lo:hi] >= 0
        XL[y] = A0[lo:hi][seg].mean(); XR[y] = B0[lo:hi][seg].mean()
    xx = np.arange(W, dtype=np.float32)[None, :]
    w = np.maximum(XR - XL, 1)[:, None]; u = np.clip((xx - XL[:, None]) / w, 0, 1)
    if side < 0: u = 1 - u
    t = np.clip((u - CS['start']) / (1 - CS['start']), 0, 1); t = t * t * (3 - 2 * t)
    t = np.where((XL[:, None] >= 0) & ((XR - XL)[:, None] >= 6) & cloth, t, 0)
    k = 1 - CS['amount'] * t; c = CS['cool']
    out = a.copy(); out[..., 0] = r * k * (1 - c * t * .5); out[..., 1] = g * k * (1 - c * t * .25); out[..., 2] = np.minimum(b * np.minimum(1, k * (1 + c * t * .2)), 255)
    return np.clip(out, 0, 255).astype(np.uint8)


cards = {}
for cid, m in META.items():
    if not isinstance(m, dict) or 'who' not in m: continue
    im = np.array(Image.open(os.path.join(HERE, 'raw_%s.png' % cid)).convert('RGBA'))
    ys, xs = np.nonzero(im[..., 3] > 8); gy = m['ground_px'][1]
    x0, x1, y0 = int(max(0, xs.min() - 12)), int(min(im.shape[1], xs.max() + 13)), int(max(0, ys.min() - 12)); y1 = int(round(gy)) + 1
    crop = shade(im[y0:y1, x0:x1], SIDE.get(cid, 1)); Image.fromarray(crop).save(os.path.join(HERE, cid + '.png'))
    mpp = m['height_m'] / (m['rig_px_tall'] * SC)
    cards[cid] = dict(file=cid + '.png', who=m['who'], view=m['view'], dir=m['dir'], face=m['face'], size_px=[int(x1 - x0), int(y1 - y0)], m_per_px=mpp,
                      foot_point_px=[m['ground_px'][0] - x0, y1 - y0 - 1], hands_px={k: [v[0] - x0, v[1] - y0] for k, v in m['hands'].items()},
                      fist_radius_px=m['fist_r_px'], far=m['far'], height_m=m['height_m'])
    print('CARD', cid, cards[cid]['size_px'], 'mpp %.5f' % mpp, 'hands', cards[cid]['hands_px'])
json.dump(cards, open(os.path.join(HERE, 'cards.json'), 'w'), indent=1)
