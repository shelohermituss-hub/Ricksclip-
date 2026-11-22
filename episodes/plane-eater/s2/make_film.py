"""make_film.py: writes s2/film.json for plane-eater S2 THE TABLE (rows 10-18, film 8.56-17.30 s = frames 257-519). S2 stretch builder 2026-11-22.
Edit this file, not film.json. Plan metres (X east, Y north, Z up) in sets/apron (anchors in sets/apron/out/apron_meta.json)."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
EP = os.path.join(HERE, '..')
keys = json.load(open(os.path.join(EP, 'cast', 'CAST_KEYS.json')))
meta = json.load(open(os.path.join(EP, 'sets', 'apron', 'out', 'apron_meta.json')))
F0, F1 = 257, 519                      # "Every" 8.56 s -> the frame before "x" 17.30 s
cast = {k: dict(keys['cast'][k], walk_speed=99) for k in ['michel', 'owner']}
Z = 0.03
MICHEL = [3.4, -1.0, Z]; MICHEL_ST = [3.4, -1.45, Z]; MICHEL_PULL = [3.4, -1.2, Z]   # fix 1: S1 ends with him standing at the chair                # the floor point under the chair seat (chair_seat x 3.19-3.61, y -0.79..-1.21, top 0.485 m)
OWNER = [1.15, -2.2, Z]                # fix 1: never behind Michel's head from the ENE lens; out on the sunny apron by the sliced nose, rag in hand                # far back beside the sliced fuselage, behind the wing (row 11 "owner far back, arms crossed")
TABLE_LOOK = [3.4, -0.2, 0.9]
M = lambda k: 'm:../../ep_s2/' + k
acts = [
    dict(who='michel', at=0, pos=MICHEL_ST, pose='m:../../ep_s2a/mi_stand', face='k:proud', look=TABLE_LOOK, look_full=True, note='row 10: standing at the pulled-out chair (S1 last state)'),
    dict(who='michel', at=262, pos=MICHEL_PULL, pose=M('mi_table'), look=TABLE_LOOK, look_full=True, note='row 10: drops onto the seat'),
    dict(who='michel', at=266, pos=MICHEL, look=TABLE_LOOK, look_full=True, note='row 10: tucks the chair in (15 f glide = the scoot), then one seated move for rows 10-18'),
    dict(who='owner', at=0, pos=OWNER, view='34', dir=-1, pose=M('ow_watch'), face='k:browUp', look='michel', note='rows 11 + 17: arms crossed far back; winces on the tire snap 489'),
    *[dict(who='michel', at=a, face='k:' + fc, look=TABLE_LOOK, look_full=True, note=n) for a, fc, n in [(283, 'proud', 'row 11 glass'), (300, 'concentrate', 'sniff'), (316, 'proud', 'nod'),
        (378, 'browUp', 'row 13: the scale judges him, one approving brow'), (398, 'proud', 'row 14'), (407, 'peChew', 'crack'), (420, 'proud', 'row 15'), (428, 'peChew', 'doughnut bite'),
        (444, 'proud', 'row 16'), (451, 'peChew', 'sandwich bite'), (470, 'aim', 'row 17 even'), (478, 'peChewHard', 'the tire fights back'), (490, 'peChew', 'chews hard'), (506, 'proud', 'swallowed, triumphant')]],
    dict(who='owner', at=285, face='k:browUp', look='michel', note='row 11: leans in to watch the oil'),
    dict(who='owner', at=489, face='k:peDisgust', look='michel', note='row 17 "owner wincing" on the rubber snap'),
    dict(who='owner', at=505, face='k:browUp', look='michel'),
]
H = lambda obj, b, f0, f1, hand='R', grip='point', **kw: dict(who='michel', obj=obj, module='sets/s2_apron.js', builder=b, opts={}, grip=grip, hand=hand, when='always', f0=f0, f1=f1, **kw)
held3d = [
    H('oil_glass', 'buildOil', 283, 316, grip='handle', note='row 11 "glass": swirl, sniff, nod'),
    H('water_jug', 'buildJug', 318, 343, grip='handle', angle=[[318, -90], [324, -90], [330, -45], [340, -45], [343, -90]], note='row 12 "jug": the glug'),
    H('tumbler', 'buildTumbler', 344, 362, hand='L', grip='handle', angle=[[344, -90], [350, -60], [358, -90]], note='row 12: he drinks'),
    H('sugar_tongs', 'buildTongs', 345, 384, angle=[[345, 20], [365, 30]], note='row 13: the bites drop on the scale on "pounds"'),
    H('wing_slice', 'buildWingSlice', 396, 414, angle=[[396, -10]], note='row 14 "Wings": snapped like a cracker'),
    H('wheel_hub', 'buildHub', 418, 438, angle=[[418, -10]], note='row 15 "wheels": bitten like a doughnut'),
    H('seat_cushion', 'buildCushion', 442, 462, angle=[[442, -10]], note='row 16 "seats": the spring boings out'),
    H('tire', 'buildTire', 468, 494, angle=[[468, -10]], note='row 17 "tires": stretches like gum and snaps back'),
]
def st(at, pos, aim, lens, subject, framing, purpose, hold=0.0, creep=0.0035, **kw):
    return dict(at=at, pos=pos, aim=aim, lens=lens, subject=subject, framing=framing, purpose=purpose, hold=hold, creep=creep, **kw)
stations = [
    st(F0, [6.13, 0.4, 1.55], [3.3, -1.1, 1.1], 26, 'michel', 'W', 'ROW 10 start (PLACE, M09 travel along a set line): from S1\'s plate the camera rides the wing\'s shadow edge on the cloth toward the table', hold=0.0),
    st(270, [5.7, 0.01, 1.45], [3.35, -0.85, 1.12], 26, 'michel', 'W', 'ROW 10 land (M09 end): the set table in the wing shade, Michel sat and tucked in, the sliced Cessna behind him, the owner far back', hold=0.0, shows=['table']),
    st(296, [4.76, -0.52, 1.32], [3.45, -0.85, 1.28], 30, 'michel', 'M', 'ROW 11 (ACT, M02 push in): the amber oil glass large at his nose, the owner far back', hold=0.4, shows=['oil']),
    st(366, [3.95, 0.25, 0.98], [3.55, -0.6, 1.1], 28, 'michel', 'C', 'ROW 13 (EXPLAIN, M02 push in on the dial): the needle swings past and settles on "2 lb / 900 g", his raised brow at the top', hold=0.6, shows=['scale']),
    st(448, [5.69, -0.64, 1.4], [3.4, -0.8, 1.1], 28, 'michel', 'M', 'ROWS 15-16 (M13 continues along the bites): hub, cushion and spring', hold=0.0),
    st(466, [4.89, -0.65, 1.3], [3.45, -0.8, 1.25], 28, 'michel', 'C', 'ROW 17 (ACT list 4, M02 push in on the stretch): the tire stretches like gum and snaps back on his cheeks, the owner winces far back', hold=0.5, shows=['tire']),
    st(512, [5.32, -0.45, 1.18], [3.4, -1.0, 0.98], 30, 'michel', 'M', 'ROW 18 (PLACE, settle on the belly for the M21 match dissolve into the X-ray film)', hold=0.2),
]
props = {
    'table': dict(pos=[3.4, -0.32, 0.8], kind='the white-cloth table under the wing'),
    'oil': dict(pos=[3.6, -0.56, 0.9], kind='the amber oil glass'),
    'jug': dict(pos=[3.66, -0.36, 0.9], kind='the big water jug'),
    'scale': dict(pos=[3.62, -0.42, 0.9], kind='the kitchen scale dial 2 lb / 900 g'),
    'tire': dict(pos=[3.6, -0.9, 1.2], kind='the stretched tire'),
}
light = dict(meta['light']['day'], top='#1a86f2', hor='#cfe6ff', sun='#fff6e6', si=4.6, amb='#e6edf7', ai=2.0, tint='#ffffff')   # fix 1: bright noon (the lead: the draft read as dusk)
place = dict(set='s2_apron', kind='day', light='day', light_over=light, air=0.3, wind=1)
film = {
    'title': 'The Man Who Ate An Airplane, S2 THE TABLE (lines 3-4, frames 257-519)',
    'fps': 30, 'size': [1080, 1920], 'words': 'voice/words.json', 'start': F0, 'end': F1 + 1,
    'camera': {'v2': True}, 'camsafe': True, 'kit3d': {'pbr': True, 'relief': True, 'sky': True, 'trees': False},
    'tween': {'frames': 0, 'face_frames': 0, 'ones': True}, 
    'puppet_pkg': ['moves', 'cast', '../../../templates/vector2d_characters/code'],
    'cast': cast, 'face_shadow': True,
    'costume_shade': dict(keys['costume_shade'], keep_drawn_light=True, smooth=40),
    'card_shade': dict(keys['card_shade'], amount=0, rim_amount=0),
    'post': {'dof': 0.0, 'dust': 0.3, 'bloom': 1, 'vignette': 0},
    'places': {'apron': place}, 'props': props, 'acts': acts, 'held3d': held3d,
    'moods': [dict(at=283, look='warm_up', note='row 11: the oil glass glows amber'), dict(at=407, look='warm_up', note='row 14: afternoon, warmer'), dict(at=489, look='flash_white', note='row 17: rubber snap')],
    'kicks': [{'at': 489, 'amp': 2}],
    'fx': [dict(at=407, kind='glint', pos=[3.55, -0.78, 1.12], note='row 14: crack of the wing slice'),
           dict(at=489, kind='glint', pos=[3.55, -0.9, 1.2], note='row 17: rubber snap')],
    'takes': [{'id': 's2', 'place': 'apron', 'stations': stations}],
}
json.dump(film, open(os.path.join(HERE, 'film.json'), 'w'), indent=1)
print('film.json written:', len(acts), 'acts,', len(stations), 'stations,', len(held3d), 'held3d')
