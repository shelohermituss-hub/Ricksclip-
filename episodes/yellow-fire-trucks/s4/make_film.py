"""make_film.py: writes s4/film.json for S4 THE IDEA SPREADS (frames 770-969, line 7, plan rows 22-27) on PLACE C, THE MAP. S4 stretch builder 2026-11-21, BOARD round.
Edit this file, not film.json. Positions are map metres (Z up, sets/map/out/map_meta.json). People stand ON the map at station scale (x0.088, the tiny trucks'
scale), on the paper height fold_z + 7 mm (the station bases sit 7 mm above fold_z: PINE HOLLOW base .058 vs fold_z .0506)."""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
EP = os.path.join(HERE, '..')
sys.path.insert(0, os.path.join(EP, 'sets', 'map', 'scripts')); from map_geo import fold_z
keys = json.load(open(os.path.join(EP, 'cast', 'CAST_KEYS.json')))
meta = json.load(open(os.path.join(EP, 'sets', 'map', 'out', 'map_meta.json')))
K = 0.088                                                   # station scale = META truck_scale
CAST = ['painterThin', 'painterFat', 'sceptic', 'rookie', 'oldTimer']
cast = {k: dict(keys['cast'][k], height=round(keys['cast'][k]['height'] * K, 4), walk_speed=99) for k in CAST}
G = lambda x, y: [x, y, round(fold_z(x, y) + .007, 4)]       # a point on the paper
PH = meta['anchors']['pine_hollow_station']                 # [2.478, 0.025, 0.058], doors at y -0.365
STL = [3.055, 1.514]                                        # ST. LOUIS station (index 13), doors at y 1.124, x 2.865 / 3.245
M = lambda k: 'm:../../ep_s4/' + k

acts = [
    # row 24: the two Painters at the ST. LOUIS bay mouth (left bay), the thin one sprays the red truck nose
    dict(who='painterThin', at=770, pos=G(2.985, 1.035), view='34', dir=-1, pose=M('pt_spray'), face='k:sleepy', look=[2.86, 1.2, .06], note='row 24: brisk and bored, gun at the hip'),
    dict(who='painterThin', at=848, face='k:sleepy', note='row 24 "PAINTING": one long sweep, a lime band wipes over the red nose (s4_map.js 862)'),
    dict(who='painterFat', at=770, pos=G(3.085, 0.985), view='34', dir=-1, pose=M('pt_watch'), face='k:concentrate', look=[2.86, 1.2, .06], note='row 24: careful, leans in, tongue out'),
    # rows 26-27: three firemen in front of the home bay door at PINE HOLLOW
    dict(who='sceptic', at=770, pos=G(2.30, -0.50), view='34', dir=1, pose=M('sc_hate'), note='row 26: arms crossed high, stone'),
    dict(who='sceptic', at=932, face='k:browUp', note='row 26 "FIREMEN": head away, one fist over his eyes'),
    dict(who='rookie', at=770, pos=G(2.425, -0.53), view='34', dir=-1, pose=M('rk_peek'), note='row 27: heels together, eager'),
    dict(who='rookie', at=944, face='k:lipBite', note='row 27 "HATED": both fists clap over his eyes'),
    dict(who='rookie', at=952, face='k:peekOne', note='row 27 "THEM": the top fist sinks, one eye over it at the lime truck, a second too long'),
    dict(who='oldTimer', at=770, pos=G(2.555, -0.50), view='34', dir=-1, pose=M('ot_late'), note='row 27: a second late, pulls his helmet down at 960'),
]
held3d = [dict(who='painterThin', obj='spray_gun', module='sets/assets.js', builder='buildSprayGun', opts={}, grip='handle', face='out', hand='R',
               anchor='grip', tip='tip', when='always', scale=0.15)]

def st(at, pos, aim, lens, subject, framing, purpose, hold=0.0, creep=0.0028, **kw):
    return dict(at=at, pos=pos, aim=aim, lens=lens, subject=subject, framing=framing, purpose=purpose, hold=hold, creep=creep, **kw)

A = ([2.52, -0.82, 0.62], [2.48, -0.18, 0.06])
stations = [
    st(0, A[0], A[1], 24, 'pine_hollow', 'W', 'lead-in anchor (frames before 770 are not rendered): holds the opening framing so the rise cannot start before the stretch (s2 LECONS)', hold=0),
    st(770, A[0], A[1], 24, 'pine_hollow', 'W', 'ROW 22 in (S3 -> S4 join): straight down-ish on the printed street plan of PINE HOLLOW with the home station model; the lead cross-fades S3\'s town into this plan on the motion', hold=0.25, shows=['pine_hollow']),
    st(832, [3.55, -1.35, 1.45], [2.7, 2.5, 0.05], 24, 'map', 'W', 'ROWS 22-23 (M fly-land-rest, 11f pull-out): the rise keeps going, the town becomes one dot among many; on "CITIES" the door wave rolls west to east across the Midwest stations', hold=0.15, shows=['map']),
    st(868, [3.40, 0.52, 0.30], [2.95, 1.12, 0.12], 26, 'painterThin', 'M', 'ROWS 24-25 (descend to the nearest station): the Painters at the ST. LOUIS bay, the lime band over the red nose; on "LIME" the sweep runs through every nose behind them', hold=0.9, shows=['painters']),
    st(930, [2.42, -0.90, 0.15], [2.42, -0.43, 0.125], 28, 'rookie', 'M', 'ROWS 26-27 (sink to the home station, M09 push in): the home door rolls up on the lime truck on "Plenty", three firemen hate it, the Rookie peeks over his fist', hold=1.2, creep=0.003, shows=['rookie']),
]
props = {
    'pine_hollow': dict(pos=[PH[0], PH[1] - .3, PH[2] + .05], kind='the home station model on its printed street plan'),
    'map': dict(pos=[2.7, 2.5, 0.05], kind='the country of station models'),
    'painters': dict(pos=[2.95, 1.05, 0.1], kind='the Painters at the ST. LOUIS bay'),
}
place = dict(set='s4_map', light='morning', light_over=meta['light']['map'], kit3d=dict(envGround='#7a5634'),
             doors=dict(at=27.55, wave=1.6, dur=.4), paint='red')
film = {
    'title': 'Why Fire Trucks Turned Yellow, S4 THE IDEA SPREADS (line 7, frames 770-969)',
    'fps': 30, 'size': [1080, 1920], 'words': 'voice/words.json', 'start': 770, 'end': 970,
    'camera': {'v2': True}, 'camsafe': True, 'kit3d': {'pbr': True, 'relief': True, 'sky': True, 'trees': False},
    'tween': {'frames': 0, 'face_frames': 0, 'ones': True}, 'auto_view': False,
    'puppet_pkg': ['moves', '.', 'cast', '../../../templates/vector2d_characters/code'],
    'cast': cast, 'faces_ep': keys['faces_ep'], 'face_shadow': True,
    'costume_shade': dict(keys['costume_shade'], keep_drawn_light=True, smooth=40),
    'card_shade': dict(keys['card_shade'], amount=0, rim_amount=0),
    'post': {'dof': 0.0, 'dust': 0.3, 'bloom': 1, 'vignette': 0},
    'places': {'map': place}, 'props': props, 'acts': acts, 'held3d': held3d,
    'takes': [{'id': 's4', 'place': 'map', 'stations': stations}],
}
json.dump(film, open(os.path.join(HERE, 'film.json'), 'w'), indent=1)
print('film.json written:', len(acts), 'acts,', len(stations), 'stations')
