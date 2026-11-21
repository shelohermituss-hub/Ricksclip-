"""make_film.py: writes s6/film.json for S6 THE ANSWER (frames 1202-1576, plan rows 36-48, script lines 10-12). S6 stretch builder 2026-11-21, BOARD round.
Edit this file, not film.json. Four places, one take each, in story order: 'dal' (S5's Dallas yard: the push into the red truck's chrome headlamp),
'eye' (sets/lamproom.js: the lamp room behind the eye, the SIGNATURE), 'park' (town park at dusk, line 11), 'cross' (the crossing at dusk, line 12).
Positions are plan metres (Z up). They match S6 in sets/s6_world.js (keep in step).
Also writes film_<place>.json: the SAME film cut to one take (start/end = that take), so one render process loads one place only (shared memory).
`python make_film.py --proj` prints where the subjects land on screen at each station (fractions, 0,0 top-left)."""
import json, os, sys, math
HERE = os.path.dirname(os.path.abspath(__file__))
EP = os.path.join(HERE, '..')
keys = json.load(open(os.path.join(EP, 'cast', 'CAST_KEYS.json')))
town = json.load(open(os.path.join(EP, 'sets', 'town', 'out', 'town_meta.json')))
LR = json.load(open(os.path.join(EP, 'sets', 'lamproom', 'out', 'lamproom_meta.json')))
CAST = ['kid', 'sceptic', 'milkman', 'rookie']
cast = {k: dict(keys['cast'][k], walk_speed=99) for k in CAST}
M = lambda k: 'm:../../ep_s6/' + k

# ---- keep in step with sets/s6_world.js S6
TY = -4.0
P_TX0, P_V, P_F0 = 41.0, .085, 1318
TXP = lambda f: P_TX0 - P_V * (f - P_F0)
C_TX0, C_V, C_F0 = 60.0, .384, 1470
TXC = lambda f: C_TX0 - .52 * (f - C_F0) if f <= 1524 else 31.92 - .193 * (f - 1524)     # comes fast, eases past the crossing (two linear runs: the Rookie card follows each)
VX, VY = 24.3, -7.6
DRV = [VX - .8, VY + 1.45, .55]                 # the Milkman at the wheel in the open door of the van (S3's mark on the white bar)
CABX, CABY, CABZ = -2.25, -.5, .35              # the driver in the cab, relative to the truck centre (S3: driver side = south)
# Dallas red truck (sets/dallas meta truck_red [-3.2, 12.176, .12], yaw 90: nose south): headlamp glass centre (truck frame x -3.50, y +-0.52, z 1.31)
HL = [-3.2 + .52, 12.176 - 3.50, .12 + 1.31]
HL_R = .109                                      # glass radius; rim about .125 -> fills 89 % of the width at lens 24 from 0.32 m (frame width = d * 20.25 / lens)
D_ENTRY = 2 * .125 / .89 * 24 / 20.25

acts = [
    # line 11, the park
    dict(who='sceptic', at=1202, visible=False, pos=[TXP(1318) + CABX, TY + CABY, CABZ], view='34', dir=-1, pose=M('sc_park'), face='k:proud'),
    dict(who='sceptic', at=1318, visible=True, pose=M('sc_park'), face='k:proud', note='row 40: at the wheel, proud of the shine'),
    dict(who='sceptic', at=1318, pos=[TXP(1469) + CABX, TY + CABY, CABZ], move_s=(1469 - 1318) / 30, linear=True, note='rides with the pumper (TXP linear)'),
    dict(who='sceptic', at=1348, face='k:concentrate', note='row 41 "turns": a glance at his own door'),
    dict(who='sceptic', at=1470, visible=False),
    dict(who='kid', at=1202, visible=False, pos=[36.9, -12.8, 0.0], view='34', dir=-1, pose=M('kid_park'), face='k:concentrate'),
    dict(who='kid', at=1376, visible=True, pose=M('kid_park'), face='k:concentrate', note='row 42: one more throw before dark (two-fisted wind-up)'),
    dict(who='kid', at=1394, face='k:proud', note='row 42 "red": the throw'),
    dict(who='kid', at=1418, pos=[36.35, -10.35, 0.0], move_s=.4, note='row 43: the quick run in behind the ball'),
    dict(who='kid', at=1431, face='k:think', note='sure it is right there'),
    dict(who='kid', at=1445, pos=[35.15, -10.85, 0.0], move_s=.25, face='k:browUp', note='row 44 "grass": steps clean over the ball'),
    dict(who='kid', at=1452, dir=1, face='k:browUp', note='row 44: the shrug to the lens'),
    dict(who='kid', at=1470, visible=False),
    # line 12, the crossing
    dict(who='milkman', at=1202, visible=False, pos=DRV, view='34', dir=-1, pose=M('mk_cross'), face='k:concentrate'),
    dict(who='milkman', at=1470, visible=True, pose=M('mk_cross'), face='k:concentrate', note='row 45: the same white bar, the same look left'),
    dict(who='milkman', at=1483, face='k:browUp', note='row 45 "green": the head stops dead, he SEES it'),
    dict(who='milkman', at=1523, dir=1, face='k:concentrate', note='row 46-47: the head turns with the truck, eyes locked'),
    dict(who='milkman', at=1556, face='k:proud', note='row 48: the toast, a small smile'),
    dict(who='rookie', at=1202, visible=False, pos=[TXC(1470) + CABX, TY + CABY, CABZ], view='34', dir=-1, pose=M('rk_cab'), face='k:concentrate'),
    dict(who='rookie', at=1470, visible=True, pose=M('rk_cab'), face='k:concentrate', note='row 46: at the wheel of the lemon truck'),
    dict(who='rookie', at=1470, pos=[TXC(1524) + CABX, TY + CABY, CABZ], move_s=(1524 - 1470) / 30, linear=True, note='rides with the lemon truck (TXC run 1)'),
    dict(who='rookie', at=1524, pos=[TXC(1577) + CABX, TY + CABY, CABZ], move_s=(1577 - 1524) / 30, linear=True, note='rides with the lemon truck (TXC run 2)'),
    dict(who='rookie', at=1523, face='k:proud', note='row 46 "color": proud, chin up, sees everything'),
]
held3d = [dict(who='milkman', obj='milk_bottle', module='sets/assets.js', builder='buildMilkBottle', opts={}, grip='pole', face='out', hand='L', anchor='grip', when='always', scale=1.6)]

def st(at, pos, aim, lens, subject, framing, purpose, hold=0.0, creep=0.0028, **kw):
    return dict(at=at, pos=pos, aim=aim, lens=lens, subject=subject, framing=framing, purpose=purpose, hold=hold, creep=creep, **kw)
CE, CR, CX = LR['cams']['CAM_ENTRY'], LR['cams']['CAM_ROOM'], LR['cams']['CAM_EXIT']
takes = [
    dict(id='s6_dal', place='dal', stations=[
        st(1202, [-2.2, 5.4, 1.35], [-2.6, 8.3, 1.15], 26, 'headlamp', 'M', 'S5 -> S6 join: S5 last station (down onto the red truck chrome headlamp), held to "YOU"', hold=.17),
        st(1234, [HL[0], HL[1] - D_ENTRY, HL[2]], [HL[0], HL[1] + 3, HL[2]], 24, 'headlamp', 'C', 'ROW 36 "YOU see" (M09 push-in, piece 11, the plan\'s 27 eased frames): the chrome rim fills 89 % of the frame width = the lamp room CAM_ENTRY ring (the match)', travel=.9),
    ]),
    dict(id='s6_eye', place='eye', stations=[
        st(1235, CE['pos'], CE['aim'], CE['lens'], 'ring', 'C', 'ROW 36 (match): CAM_ENTRY, the chrome entry ring fills 89 % of the width, the small pupil far inside it; fly forward through the ring', hold=.2),
        st(1258, CR['pos'], CR['aim'], CR['lens'], 'pupil', 'W', 'ROWS 37-38 (M00 living rest, IMPOSSIBLE VIEW + SIGNATURE): the lamp dome, the pupil window 40 % from the top; "dim" widens it; on "red" the wave', hold=1.1, travel=.75),
        st(1317, [0, 6.6, .15], CX['aim'], CX['lens'], 'window', 'C', 'ROW 39 "FIRST." (piece 11 fly through the pupil, the plan\'s 28 frames): forward through the widened pupil past the exit point; the window fills the frame (blend on motion to the park: lead)', travel=.87),
    ]),
    dict(id='s6_park', place='park', stations=[
        st(1318, [30.5, -6.6, 1.2], [37.0, -3.2, 1.3], 18, 'truck', 'M', 'ROWS 40-41 (M00 living rest from the take start 1318, 3/4 front from the park kerb, west of the shaft): the pumper IN the last sun shaft, full red ("RED" 1331), rolls out of it toward the lens, the paint drains nose to tail, grey on "GRAY" 1368, the fender big', hold=1.8),
        st(1408, [35.3, -9.85, .35], [36.7, -12.5, .4], 20, 'ball', 'C', 'ROWS 42-43 (follow past the fence, M09 push-in low): the travel picks up the Kid\'s two-fisted throw ("ball" 1400); the lens lands in the grass, the ball stops by it, grey on "VANISHES"', hold=.5, travel=1.2),
        st(1452, [34.4, -9.0, 1.35], [36.2, -12.9, .15], 18, 'lawn', 'W', 'ROW 44 EXTREME "in the evening GRASS" (M05 rise): the lawn of lost grey things; the Kid steps over the ball (1445) and shrugs (1452)', hold=.5, travel=.9),
    ]),
    dict(id='s6_cross', place='cross', stations=[
        st(1470, [20.4, -4.6, 1.95], [30.0, -7.2, 1.6], 20, 'milkman', 'M', 'ROW 45 "But yellow GREEN?" (lands on the van, M00 rest): his look left, the head stops dead on "green"; one lemon dot far down Main', hold=1.4),
        st(1560, [20.6, -10.9, .5], [22.6, -4.6, 1.8], 18, 'truck', 'W', 'ROWS 46-48 (M02 sink to a low hero angle): on the way the lemon truck comes, the brightest thing, Rookie at the wheel ("COLOR" 1523); POWER 4 "the LONGEST": it sails past, the Milkman toasts it', hold=.4, travel=1.5),
    ]),
]
props = {
    'headlamp': dict(pos=HL, kind='the red truck chrome headlamp'), 'ring': dict(pos=LR['anchors']['entry_ring']['c'], kind='the chrome entry ring'),
    'pupil': dict(pos=LR['anchors']['pupil']['c'], kind='the pupil window'), 'window': dict(pos=LR['anchors']['window_view']['c'], kind='the window picture'),
    'truck': dict(pos=[38.0, TY, 1.4], kind='a fire truck at dusk'), 'fender': dict(pos=[34.6, TY + 1.1, 1.0], kind='the front fender'),
    'ball': dict(pos=[35.75, -10.6, .11], kind='the red ball'), 'lawn': dict(pos=[36.5, -14.0, .1], kind='the lawn of lost things'), 'door': dict(pos=[TXC(1576) - 2.2, TY + 1.25, 1.3], kind='the lemon door panel'),
}
DU = town['light']['du']
LR_LIGHT = dict(top='#120c24', hor='#1c1438', sun='#b8a8ff', si=.12, amb='#2a1d52', ai=.35, tint='#ffffff')      # the set-builder's kit proof light (sets/lamproom/scripts/kit_films.py)
s5 = json.load(open(os.path.join(EP, 's5', 'film.json')))['places']['dallas']
places = {
    'dal': dict(s5, set='s6_world', mode='dal', headlamp=HL),
    'eye': dict(set='lamproom', light='night', light_over=LR_LIGHT, kit3d=dict(envGround='#1c1438'), post=dict(dust=0),
                lamproom=dict(wave=0, iris=0, dim=1, keys=[dict(f=1202, wave=0, iris=0, dim=1), dict(f=1243, wave=0, iris=0, dim=1), dict(f=1255, wave=0, iris=.55, dim=.6),
                     dict(f=1280, wave=1, iris=.6, dim=.6), dict(f=1283, wave=2), dict(f=1286, wave=3), dict(f=1289, wave=4, iris=.62), dict(f=1300, wave=4, iris=1.0, dim=.6)])),
    'park': dict(set='s6_world', mode='park', lite=True, kind='du', light='golden', light_over=DU, kit3d=dict(envGround='#5a4a66'), grass_keep=0.0),
    'cross': dict(set='s6_world', mode='cross', lite=True, kind='du', light='golden', light_over=DU, kit3d=dict(envGround='#5a4a66'), grass_keep=0.4),
}
film = {
    'title': 'Why Fire Trucks Turned Yellow, S6 THE ANSWER (lines 10-12, frames 1202-1576)',
    'fps': 30, 'size': [1080, 1920], 'words': 'voice/words.json', 'start': 1202, 'end': 1577,
    'camera': {'v2': True}, 'camsafe': True, 'kit3d': {'pbr': True, 'relief': True, 'sky': True, 'trees': False},
    'tween': {'frames': 0, 'face_frames': 0, 'ones': True}, 'auto_view': False,
    'puppet_pkg': ['moves', '.', 'cast', '../../../templates/vector2d_characters/code'],
    'cast': cast, 'faces_ep': keys['faces_ep'], 'face_shadow': True,
    'costume_shade': dict(keys['costume_shade'], keep_drawn_light=True, smooth=40),
    'card_shade': dict(keys['card_shade'], amount=0, rim_amount=0),
    'post': {'dof': 0.0, 'dust': 0.5, 'bloom': 1, 'vignette': 0},
    'places': places, 'props': props, 'acts': acts, 'held3d': held3d,
    'kicks': [{'at': 1280, 'amp': 1}, {'at': 1565, 'amp': 2}],
    'fx': [dict(at=1331, kind='glint', pos=[TXP(1331) - 3.9, TY - 1.05, 1.0], note='row 40: the chrome flares in the sun shaft'),
           dict(at=1368, kind='glint', pos=[TXP(1368) - 3.3, TY - 1.1, 1.25], note='row 41: only the chrome still glints')],
    'moods': [dict(at=1243, look='dark_dip', note='row 37 "dim": the light outside falls'), dict(at=1280, look='flash_white', note='row 38 POWER 3 "red": the wave (the plan asks one inverted flash frame)'),
              dict(at=1331, look='warm_glow', note='row 40: the last sun shaft'), dict(at=1414, look='dark_dip', note='row 43: the ball leaves the sun patch'),
              dict(at=1556, look='spot', note='row 48 POWER 4: the truck is the light')],
    'takes': takes,
}
json.dump(film, open(os.path.join(HERE, 'film.json'), 'w'), indent=1)
for t in takes:                                   # one-place render copies of the same film
    nxt = [x['stations'][0]['at'] for x in takes if x['stations'][0]['at'] > t['stations'][0]['at']]
    t2 = dict(t, stations=[dict(t['stations'][0], at=0, hold=0, purpose='first-station anchor at f0 (S2 lesson): the copy bakes from frame 0')] + t['stations'])
    g = dict(film, takes=[t2], places={t['place']: places[t['place']]}, start=t['stations'][0]['at'], end=min(nxt) if nxt else film['end'])
    if t['place'] == 'eye': g['kit3d'] = dict(pbr=True, relief=False, sky=False, trees=False)
    json.dump(g, open(os.path.join(HERE, 'film_%s.json' % t['place']), 'w'), indent=1)
print('film.json written:', len(acts), 'acts,', sum(len(t['stations']) for t in takes), 'stations in', len(takes), 'takes (+ film_<place>.json)')

if '--proj' in sys.argv:                          # pinhole check, lens mm on a 36 mm tall frame, 1080 x 1920
    def proj(c, a, lens, P):
        f = [a[i] - c[i] for i in range(3)]; n = math.sqrt(sum(x * x for x in f)); f = [x / n for x in f]
        r = [f[1], -f[0], 0]; n = math.hypot(r[0], r[1]); r = [x / n for x in r]; u = [r[1] * f[2] - r[2] * f[1], r[2] * f[0] - r[0] * f[2], r[0] * f[1] - r[1] * f[0]]
        d = [P[i] - c[i] for i in range(3)]; z = sum(d[i] * f[i] for i in range(3))
        if z <= 0: return None
        k = lens / 36.0; x = sum(d[i] * r[i] for i in range(3)) / z * k; y = sum(d[i] * u[i] for i in range(3)) / z * k
        return round(.5 + x / (1080 / 1920), 2), round(.5 - y, 2)
    pos_at = lambda who, f: [a for a in acts if a['who'] == who and 'pos' in a and a['at'] <= f][-1]['pos']
    S = {1360: [('truck nose', [TXP(1331) - 4, TY, 1.4]), ('truck tail', [TXP(1331) + 4, TY, 1.4]), ('sceptic head', [TXP(1331) + CABX, TY + CABY, CABZ + 1.5])],
         1368: [('fender', [TXP(1368) - 3.2, TY + 1.1, 1.0])], 1400: [('kid', [36.9, -12.8, .6]), ('ball', [36.6, -12.2, .6])],
         1420: [('ball', [35.6, -10.4, .11]), ('kid', [36.1, -11.1, .6])], 1452: [('ball', [35.6, -10.4, .11]), ('kid', [35.5, -10.2, .6]), ('wagon', [34.6, -15.0, .2]), ('kite', [38.8, -14.2, .1]), ('boot', [35.9, -16.6, .1]), ('can', [38.2, -11.0, .2]), ('tricycle', [37.6, -18.4, .3])],
         1470: [('milkman head', [DRV[0], DRV[1], DRV[2] + 1.45]), ('lemon dot', [TXC(1483) - 4, TY, 1.4])], 1523: [('truck nose', [TXC(1523) - 4, TY, 1.4]), ('rookie head', [TXC(1523) + CABX, TY + CABY, CABZ + 1.45]), ('crate', [27.35, -7.55, .2])],
         1560: [('milkman head', [DRV[0], DRV[1], DRV[2] + 1.45]), ('bottle up', [DRV[0] + .2, DRV[1], DRV[2] + 1.75]), ('truck nose', [TXC(1565) - 4, TY, 1.4]), ('truck tail', [TXC(1565) + 4, TY, 1.4]), ('rookie head', [TXC(1565) + CABX, TY + CABY, CABZ + 1.45])]}
    for t in takes:
        for s in t['stations']:
            print(s['at'], t['place'], [(n, proj(s['pos'], s['aim'], s['lens'], p)) for n, p in S.get(s['at'], [])])
