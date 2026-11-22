"""make_film.py: writes s5/film.json for S5 THE ENDING (PICTURE_PLAN rows 35-38, film 31.44-34.04 s = frames 943-1021). S5 stretch builder 2026-11-22.
Edit this file, not film.json. Positions are plan metres (Z up, nose +X) in sets/cabin (see sets/cabin/out/cabin_meta.json)."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
EP = os.path.join(HERE, '..')
keys = json.load(open(os.path.join(EP, 'cast', 'CAST_KEYS.json')))
meta = json.load(open(os.path.join(EP, 'sets', 'cabin', 'out', 'cabin_meta.json')))
A = meta['anchors']
cast = {'michel': dict(keys['cast']['michel'], walk_speed=99), 'owner': dict(keys['cast']['ownerBeardXL'], walk_speed=99)}
M = lambda k: 'm:../../ep_s5/' + k
SEAT_M = .30
MI = [A['michel_seat'][0], A['michel_seat'][1], A['michel_seat'][2] - SEAT_M]      # bottom ON the cushion (moves/ep_s5.mjs chair3d)
OW = [A['owner_seat'][0], A['owner_seat'][1], A['owner_seat'][2] - SEAT_M]
TRAY, MEAL = A['tray_table'], A['meal_tray']
MI_FACE = [MI[0] + .2, MI[1], 1.22]

acts = [
    dict(who='michel', at=943, pos=MI, view='34', dir=1, pose=M('mi_meal'), face='k:skeptical', look=MEAL, note='row 35 "HONESTLY": lifts the foil off the grey meal, suspicious sniff'),
    dict(who='michel', at=969, face='k:peDisgust', look=MEAL, note='row 36 "STILL better": the face falls, polite disgust; slides the meal aside with one finger'),
    dict(who='michel', at=991, face='k:excited', look=TRAY, note='row 37 "airline": knife and fork up over the tray table'),
    dict(who='michel', at=1001, face='k:peChewHard', look=TRAY, note='row 37 "FOOD": he cuts a bite out of the tray table'),
    dict(who='michel', at=1007, face='k:peChew', look='cam', note='row 37-38: chews, happy, big in front of the window'),
    dict(who='michel', at=1015, face='k:slyWink', look='cam', note='row 38: slow wink (smug)'),
    dict(who='owner', at=943, pos=OW, view='34', dir=1, pose=M('ow_wary'), face='k:skeptical', look=MI_FACE, note='row 35: wary side-eye at Michel'),
    dict(who='owner', at=977, face='k:worried', look=MI_FACE, note='row 36: leans away from the sliding meal'),
    dict(who='owner', at=1003, face='k:frustrated', look=MI_FACE, note='row 37: rubs his eyes with the yellow rag (running gag), defeated'),
]
held3d = [
    dict(who='michel', obj='fork', module='sets/pe_props.js', builder='buildFork', opts={}, grip='raise', hand='R', anchor='grip', tip='tip', when='always', f0=989, scale=1),
    dict(who='michel', obj='knife', module='sets/pe_props.js', builder='buildKnife', opts={}, grip='raise', hand='L', anchor='grip', tip='tip', when='always', f0=989, scale=1),
    dict(who='owner', obj='rag', module='sets/pe_props.js', builder='buildRag', opts={}, grip='hang', hand='R', anchor='grip', when='always', scale=1),
]

def st(at, pos, aim, lens, subject, framing, purpose, hold=0.0, creep=0.0028, **kw):
    return dict(at=at, pos=pos, aim=aim, lens=lens, subject=subject, framing=framing, purpose=purpose, hold=hold, creep=creep, **kw)

stations = [
    st(943, [0.95, 0.40, 1.38], [0.0, 0.95, 1.05], 17, 'michel', 'W', 'ROW 35 "HONESTLY" (END setup, M21 match in, then the STILLNESS 955-968: camera and men dead still): the owner in the aisle seat, Michel at the window lifts the foil off the grey meal, the window bright with clouds', hold=0.9, creep=0.0, shows=['meal']),
    st(984, [0.70, 0.95, 1.30], [0.10, 1.05, 0.95], 20, 'michel', 'M', 'ROW 36 "STILL better" (M02 push in on the tray): the grey meal slides aside under one finger, a pea rolls off, his face falls', hold=0.3, shows=['meal', 'tray']),
    st(1003, [0.62, 0.95, 1.22], [0.12, 1.10, 0.92], 20, 'michel', 'M', 'ROW 37 "airline FOOD" (POWER 4, M02 land): knife and fork up, then the strike: a neat bite out of the tray table, the owner rubs his eyes', hold=0.1, shows=['tray']),
    st(1021, [0.55, 0.55, 1.25], [0.10, 1.80, 1.05], 16, 'michel', 'M', 'ROW 38 last frame (M26 end pull back): Michel calm and big, chewing, wink; the window beside him with the sky; loops to frame 0', hold=0.0, shows=['wing']),
]
props = {
    'meal': dict(pos=MEAL, kind='the grey airline meal'),
    'tray': dict(pos=TRAY, kind='the tray table (bitten on FOOD)'),
    'wing': dict(pos=A['wing_bite'], kind='the airliner wing with one bite missing'),
}
K = lambda f, foil, meal, pea, bitten: dict(f=f, foil=foil, meal=meal, pea=pea, bitten=bitten)
cab = dict(keys=[K(930, 0, 0, 0, 0), K(948, 1, 0, 0, 0), K(976, 1, 0, 0, 0), K(988, 1, 1, .3, 0), K(996, 1, 1, 1, 0), K(1001, 1, 1, 1, 1), K(1030, 1, 1, 1, 1)])
cab['wild'] = ['8A', '8B']
place = dict(set='cabin', kind='am', light='day', cabin=cab, kit3d=dict(envGround='#6a7896'))
film = {
    'title': 'The Man Who Ate An Airplane, S5 THE ENDING (line 8b, rows 35-38, frames 943-1021), DRAFT',
    'fps': 30, 'size': [1080, 1920], 'words': 'voice/words.json', 'start': 943, 'end': 1022,
    'camera': {'v2': True}, 'camsafe': True, 'kit3d': {'pbr': True, 'relief': True, 'sky': False, 'trees': False},
    'tween': {'frames': 0, 'face_frames': 0, 'ones': True}, 'auto_view': False,
    'puppet_pkg': ['moves', '.', 'cast', '../../../templates/vector2d_characters/code'],
    'cast': cast, 'face_shadow': True,
    'costume_shade': dict(keys['costume_shade'], keep_drawn_light=True, smooth=40),
    'card_shade': dict(keys['card_shade'], amount=0, rim_amount=0),
    'post': {'dof': 0.0, 'dust': 0.2, 'bloom': 0.6, 'vignette': 0},
    'places': {'cabin': place}, 'props': props, 'acts': acts, 'held3d': held3d,
    'kicks': [{'at': 1001, 'amp': 3}],
    'fx': [dict(at=993, kind='glint', pos=[TRAY[0] - .1, TRAY[1], 1.3], note='row 37 "airline": a glint on the raised knife'),
           dict(at=1001, kind='clank', pos=[TRAY[0] + .08, TRAY[1] + .1, TRAY[2]], note='row 37 POWER 4: the bite out of the tray table, impact flash and sparks')],
    'moods': [dict(at=1001, look='flash_white', note='row 37 POWER 4 impact flash')],
    'takes': [{'id': 's5', 'place': 'cabin', 'stations': stations}],
}
json.dump(film, open(os.path.join(HERE, 'film.json'), 'w'), indent=1)
print('film.json written:', len(acts), 'acts,', len(stations), 'stations')
