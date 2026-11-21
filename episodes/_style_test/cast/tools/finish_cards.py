"""character-artist, STYLE TEST (2026-11-21): finish the raw renders of make_cards.mjs into the delivered cards.
  python3 episodes/_style_test/cast/tools/finish_cards.py   (after: SCALE=2 node episodes/_style_test/cast/tools/make_cards.mjs)
-> cast/grandpa.png, cast/kid.png (shaded, alpha, about 1400 px high, bottom edge = the ground line), cast/<who>_flat.png (no costume shade),
   cast/kid_nozzle2d.png (preview only: a 2D nozzle stand-in), cast/cards.json, cast/CAST_SHEET.jpg (1600 wide), cast/out/numbers.json.
Costume shade = the port of film.js costumeShadedTexture used by yellow-fire-trucks render_cast (amount .45, start .35, cool .15, smooth 40):
a darker side AWAY from the key light, faces / whites / ink untouched, props (sponge) untouched. The sun (LAYOUT.json to_sun_xy [0.5,-0.87]) is
front-RIGHT of the camera, so the shade falls on the screen-LEFT side of each figure.
"""
import json, os
import numpy as np
from PIL import Image, ImageDraw, ImageFont

CAST = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(CAST, 'out')
META = json.load(open(os.path.join(OUT, 'raw_meta.json')))
SC, PAD = META['scale'], META['pad']
CS = dict(amount=.45, start=.35, cool=.15, smooth=40)
TARGET_H = 1400


def shade(rgba, mask_keep=None, side=-1):
    a = rgba.astype(np.float32); H, W = a.shape[:2]; r, g, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
    ink = (r + g + b) < 150
    mx, mn = np.maximum(np.maximum(r, g), b), np.minimum(np.minimum(r, g), b)
    skin = ((mx - mn) <= 40) & (mn >= 150)
    cloth = (al >= 128) & ~ink & ~skin
    if mask_keep is not None: cloth &= ~mask_keep
    XL = np.full(H, -1.0); XR = np.full(H, -1.0)
    for y in range(H):
        xs = np.nonzero(cloth[y])[0]
        if len(xs): XL[y], XR[y] = xs[0], xs[-1]
    n = max(1, round(CS['smooth'] * H / 1500 / 1.0)); A0, B0 = XL.copy(), XR.copy()
    for y in range(H):
        if A0[y] < 0: continue
        lo, hi = max(0, y - n), min(H, y + n + 1); seg = A0[lo:hi] >= 0
        XL[y] = A0[lo:hi][seg].mean(); XR[y] = B0[lo:hi][seg].mean()
    xx = np.arange(W, dtype=np.float32)[None, :]
    w = np.maximum(XR - XL, 1)[:, None]; u = np.clip((xx - XL[:, None]) / w, 0, 1)
    if side < 0: u = 1 - u
    t = np.clip((u - CS['start']) / (1 - CS['start']), 0, 1); t = t * t * (3 - 2 * t)
    t[(XL < 0) | ((XR - XL) < 6)] = 0
    k = 1 - CS['amount'] * t; cool = CS['cool']
    sel = (al >= 40) & ~ink & ~skin
    if mask_keep is not None: sel &= ~mask_keep
    out = a.copy()
    out[..., 0] = np.where(sel, r * k * (1 - cool * t * .5), r)
    out[..., 1] = np.where(sel, g * k * (1 - cool * t * .25), g)
    out[..., 2] = np.where(sel, np.minimum(255, b * np.minimum(1, k * (1 + cool * t * .2))), b)
    return np.clip(out, 0, 255).astype(np.uint8), float(t[sel].mean()) if sel.any() else 0.0


def raw(n): return np.array(Image.open(os.path.join(OUT, n + '.png')).convert('RGBA'))


cards, nums, imgs = {}, {}, {}
for who, src in (('grandpa', 'grandpa'), ('kid', 'kid')):
    m = META[who]; A = raw(src); N = raw(src + '_noprop')
    prop = (np.abs(A.astype(int) - N.astype(int)).sum(-1) > 24)        # sponge, suds, drips (grandpa); empty for the kid
    S, mean_t = shade(A, prop)
    ys, xs = np.nonzero(A[..., 3] > 8)
    gx, gy = m['ground_px']                                              # raw_meta points are already page px at SCALE
    pad = 24 * SC
    x0, x1, y0 = max(0, xs.min() - pad), min(A.shape[1], xs.max() + pad), max(0, ys.min() - pad)
    y1 = int(round(gy)) + 2                                              # bottom edge = the ground line (+2 px for the foot ink)
    k = TARGET_H / (y1 - y0)
    def P(q): return [round((q[0] - x0) * k, 1), round((q[1] - y0) * k, 1)]
    def crop(arr): return Image.fromarray(arr[y0:y1, x0:x1]).resize((round((x1 - x0) * k), TARGET_H), Image.LANCZOS)
    card, flat = crop(S), crop(A)
    card.save(os.path.join(CAST, who + '.png')); flat.save(os.path.join(CAST, who + '_flat.png')); imgs[who] = card
    if who == 'kid': crop(raw('kid_nozzle2d')).save(os.path.join(CAST, 'kid_nozzle2d.png'))
    feet_rows = np.nonzero(A[y0:y1, x0:x1, 3] > 128)[0]; low = (feet_rows.max() + y0)
    px_per_m = m['rig_px_tall'] * SC * k / m['height_m']
    hands = {h: P(v) for h, v in m['hands'].items()}
    al = np.array(card)[..., 3]
    def ink_at(q): x, y = int(q[0]), int(q[1]); return bool(np.array(card)[y, x, :3].sum() < 200 and al[y, x] > 200)
    c = dict(file=who + '.png', file_flat=who + '_flat.png', size_px=list(card.size), height_m=m['height_m'],
             height_note='ground to the top of the bare head (hat and cap stand above it)', px_per_m=round(px_per_m, 2), m_per_px=round(1 / px_per_m, 6),
             card_m=[round(card.size[0] / px_per_m, 3), round(card.size[1] / px_per_m, 3)],
             foot_point_px=P([m['ground_px'][0], m['ground_px'][1]]), foot_point_note='card bottom edge = the ground; put the card origin here',
             view='3/4', faces_screen='left' if m['dir'] < 0 else 'right', dir=m['dir'],
             hands_px={'R': hands['R'], 'L': hands['L']}, fist_radius_px=round(26 * SC * k, 1))
    if who == 'grandpa':
        c.update(pose='jump_surprise: both feet off the ground, near knee up, both fists flung up, straw hat flying off, mouth wide open (face k:shocked)',
                 lowest_foot_px=round((low - y0) * k, 1), jump_clearance_m=round((y1 - 2 - low) * k / px_per_m, 3),
                 sponge={'hand': 'R', 'centre_px': hands['R'], 'note': 'drawn on the card (yellow sponge + suds + flung drips); his RIGHT fist, the forward hand toward the kid'},
                 shade_side='screen left (sun front-right)')
    else:
        aim = META['aim_deg']
        c.update(pose='hose_aim: both fists on a pistol nozzle in front of the chest, nozzle aimed screen right and up, cheeky grin (face k:evil)',
                 nozzle={'grip_back_px': hands['R'], 'grip_back': 'his RIGHT fist on the pistol grip / trigger (screen left fist)',
                         'grip_front_px': hands['L'], 'grip_front': 'his LEFT fist round the barrel (screen right fist)',
                         'axis_deg_screen': aim, 'axis_note': 'barrel runs from grip_back toward grip_front and on: right and UP, this many degrees above the card horizontal; the spray leaves past grip_front',
                         'outlet_px': [round(hands['L'][0] + 70 * SC * k * np.cos(np.radians(aim)), 1), round(hands['L'][1] - 70 * SC * k * np.sin(np.radians(aim)), 1)],
                         'hose_leaves': 'down and back from under grip_back (screen left, toward the reel)',
                         'drawn_on_card': False, 'preview': 'kid_nozzle2d.png (2D stand-in only, NOT for the scene)'},
                 shade_side='screen left (sun front-right)')
    cards[who] = c
    nums[who] = dict(size_px=list(card.size), mean_shade_t=round(mean_t, 3), fists_on_ink={h: ink_at(v) for h, v in hands.items()},
                     alpha_bbox=[int(v) for v in Image.fromarray(al).getbbox()], prop_px=int(prop.sum()))
cards['_about'] = ('character-artist 2026-11-21, style test. Cards from the LOCKED vector cast (templates/vector2d_characters, kit puppets.mjs svgFor, poses.mjs) '
                   'via cast/tools/make_cards.mjs + finish_cards.py. px origin = card top-left. Fists are ink circles: a 3D prop held in a hand goes UNDER the fist '
                   '(fist in front). Costume shade baked (screen left); *_flat.png = no shade if the scene shades the cards itself. Card plane faces the camera.')
json.dump(cards, open(os.path.join(CAST, 'cards.json'), 'w'), indent=1)

# ---------------- CAST_SHEET.jpg (1600 wide) ----------------
W = 1600; F = lambda s: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', s) if os.path.exists('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf') else ImageFont.load_default()
def fit(im, h): return im.resize((round(im.width * h / im.height), h), Image.LANCZOS)
def sky_lawn(w, h, gy):
    bg = Image.new('RGB', (w, h), '#1c88f5'); d = ImageDraw.Draw(bg)
    for y in range(h):
        if y >= gy: d.line([(0, y), (w, y)], fill=(76, 116, 33) if y > gy + 30 else (85, 133, 42))
        else: t = y / max(1, gy); d.line([(0, y), (w, y)], fill=(int(15 + 13 * t), int(121 + 15 * t), int(232 + 13 * t)))
    d.rectangle([0, gy - 70, w, gy], fill=(250, 243, 235)) ; return bg   # sunlit concrete drive strip (Rick car film colours, LOOK.md)
H1 = 760; row1 = sky_lawn(W, H1, H1 - 40)
g = fit(imgs['grandpa'], 700)
# kid at true scene scale next to grandpa: both cards scaled to the same px per metre
ppm = 700 / cards['grandpa']['size_px'][1] * cards['grandpa']['px_per_m']; kd = fit(imgs['kid'], round(cards['kid']['size_px'][1] / cards['kid']['px_per_m'] * ppm))
row1.paste(kd, (120, H1 - 40 - kd.height), kd); row1.paste(g, (W - g.width - 380, H1 - 40 - g.height), g)
kn = fit(Image.open(os.path.join(CAST, 'kid_nozzle2d.png')), 330); row1.paste(kn, (W - kn.width - 20, H1 - 40 - kn.height), kn)
sil = lambda im: Image.merge('RGBA', (*[Image.new('L', im.size, 0)] * 3, im.split()[3]))
H2 = 330; row2 = Image.new('RGB', (W, H2), '#e4e2dd')
x = 10
for im in (sil(imgs['grandpa']), sil(imgs['kid'])):
    s = fit(im, 300); row2.paste(s, (x, 20), s); x += s.width + 20
views = [Image.open(os.path.join(OUT, f'view_{w}_{v}.png')) for w in ('grandpaHat', 'kid') for v in ('front', '34', 'side', 'back')]
for im in views:
    bb = im.getbbox(); s = fit(im.crop(bb), 290 if 'kid' not in im.filename else 230); row2.paste(s, (x, H2 - 10 - s.height), s); x += s.width + 8
# phone check: the two cards at true scene size inside a 360 px wide frame (grandpa 31 % of 640 px frame height, kid ~12 %, LAYOUT _screen_numbers)
H3 = 300; row3 = Image.new('RGB', (W, H3), '#cfccc5'); ph = sky_lawn(170, 300, 210)
ppm_g = .31 * 300 / 1.75; ppm_k = ppm_g * 4.06 / 7.47   # LAYOUT _screen_numbers: grandpa 31 % of frame height at depth 4.06 m, kid at depth 7.47 m
gs = fit(imgs['grandpa'], round(cards['grandpa']['card_m'][1] * ppm_g)); ks = fit(imgs['kid'], round(cards['kid']['card_m'][1] * ppm_k))
ph.paste(ks, (6, 190 - ks.height), ks); ph.paste(gs, (170 - gs.width + 10, 206 - gs.height), gs)
row3.paste(ph, (10, 0))
sheet = Image.new('RGB', (W, H1 + H2 + H3 + 3 * 30), '#22202a'); d = ImageDraw.Draw(sheet); f = F(17)
d.text((10, 6), 'STYLE TEST: GRANDPA 1.75 m (3/4 LEFT, jump, sponge) + KID 1.25 m (3/4 RIGHT, hose grip) same px per metre; right: 2D nozzle preview', fill='white', font=f)
sheet.paste(row1, (0, 30))
d.text((10, H1 + 36), 'black-fill test (both read: flying hat + arms up / backwards cap + aim)   |   preset views at rest: grandpa front, 3/4, side, back   |   kid front, 3/4, side, back', fill='white', font=f)
sheet.paste(row2, (0, H1 + 60))
d.text((10, H1 + H2 + 66), 'PHONE CHECK (360 px wide frame, the cards at their LAYOUT screen sizes: grandpa 31 % of frame height, kid ~12 %)', fill='white', font=f)
sheet.paste(row3, (0, H1 + H2 + 90))
tx = 200; f2 = F(15)
row3d = ImageDraw.Draw(sheet)
for i, line in enumerate([
    'GRANDPA: Panama straw hat, turquoise band = his car paint, cream car pin (signature) | cream aloha shirt, turquoise + coral hibiscus on palm leaves',
    '  chest pocket: folded sunglasses + red pencil | khaki trousers on leather braces, brass clips, darned thigh patch | chamois cloth in the waistband',
    '  wet hose splashes on the shirt | bald dome + white side tufts, round glasses, chevron moustache | yellow sponge, suds, flung drips',
    'KID: cherry cap worn backwards (peak behind, strap arch, fringe through the hole) | white raglan tee, cherry sleeves + collar, grinning shark print',
    '  turquoise star iron-on patch, grass stain | denim shorts, orange contrast stitching, back pockets, frayed hem | knee plaster (signature), freckles',
    'NOT ON THE CARDS (locked rule "no shoes"): rubber boots, sandals, sneakers. Short sleeves = bare ink arms (the locked template has no sleeves).']):
    row3d.text((tx, H1 + H2 + 110 + i * 28), line, fill='#22202a', font=f2)
sheet.save(os.path.join(CAST, 'CAST_SHEET.jpg'), quality=90)
ph.save(os.path.join(OUT, 'phone_check.png'))
json.dump(nums, open(os.path.join(OUT, 'numbers.json'), 'w'), indent=1)
print(json.dumps(nums)); print({k: (v['size_px'], v['px_per_m']) for k, v in cards.items() if k != '_about'})
