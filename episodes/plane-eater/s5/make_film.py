"""make_film.py: writes s5/film.json for S5 THE ENDING (PICTURE_PLAN rows 35-38, film 31.44-34.04 s = frames 943-1021). S5 stretch builder 2026-11-22.
Edit this file, not film.json. Positions are plan metres (Z up, nose +X) in sets/cabin (see sets/cabin/out/cabin_meta.json)."""
import json, os, math
HERE = os.path.dirname(os.path.abspath(__file__))
EP = os.path.join(HERE, '..')
keys = json.load(open(os.path.join(EP, 'cast', 'CAST_KEYS.json')))
meta = json.load(open(os.path.join(EP, 'sets', 'cabin', 'out', 'cabin_meta.json')))
A = meta['anchors']
cast = {'michel': dict(keys['cast']['michel'], walk_speed=99), 'owner': dict(keys['cast']['ownerBeardXL'], walk_speed=99)}
M = lambda k: 'm:../../ep_s5/' + k
SEAT_M = .52
MI = [A['owner_seat'][0], A['owner_seat'][1], A['owner_seat'][2] - SEAT_M]      # fix round 2 (lead): Michel in seat B facing his tray, the OWNER at the window      # bottom ON the cushion (moves/ep_s5.mjs chair3d)
OW = [A['michel_seat'][0], A['michel_seat'][1], A['michel_seat'][2] - SEAT_M - 0.05]   # fix list: hips down onto the cushion (frame_checks seat 12.6 %)
TDY = A['owner_seat'][1] - A['michel_seat'][1]
TRAY, MEAL = [A['tray_table'][0], A['tray_table'][1] + TDY, A['tray_table'][2]], [A['meal_tray'][0], A['meal_tray'][1] + TDY, A['meal_tray'][2]]
MI_FACE = [MI[0] + .2, MI[1], 1.22]
FWD_M, FWD_O = [3.0, MI[1], 1.2], [3.0, OW[1], 1.2]   # seated: they face along the seat (+x) so the 3D legs agree with the seat; eyes act through the faces
WIN = [0.98, 1.774, 1.02]   # window_glass_L_8 centre (the window just ahead of Michel's: the end station sees it whole)

acts = [
    dict(who='michel', at=943, pos=MI, view='34', dir=1, pose=M('mi_meal'), face='k:skeptical', look=FWD_M, note='row 35 "HONESTLY": lifts the foil off the grey meal, suspicious sniff'),
    dict(who='michel', at=969, face='k:peDisgust', look=FWD_M, note='row 36 "STILL better": the face falls, polite disgust; slides the meal aside with one finger'),
    dict(who='michel', at=991, face='k:proud', look=FWD_M, note='row 37 "airline": knife and fork up over the tray table'),
    dict(who='michel', at=1001, face='k:peChewHard', look=FWD_M, note='row 37 "FOOD": he cuts a bite out of the tray table'),
    dict(who='michel', at=1007, face='k:peChew', look=FWD_M, note='row 37-38: chews, happy, big in front of the window'),
    dict(who='michel', at=1015, face='k:slyWink', look=FWD_M, note='row 38: slow wink (smug)'),
    dict(who='owner', at=943, pos=OW, view='34', dir=1, pose=M('ow_wary'), face='k:skeptical', look=FWD_O, note='row 35: wary side-eye at Michel'),
    dict(who='owner', at=977, face='k:worried', look=FWD_O, note='row 36: leans away from the sliding meal'),
    dict(who='owner', at=1003, face='k:frustrated', look=FWD_O, note='row 37: rubs his eyes with the yellow rag (running gag), defeated'),
]
held3d = [
    dict(who='michel', obj='fork', module='sets/pe_props.js', builder='buildFork', opts={}, grip='raise', hand='R', anchor='grip', tip='tip', when='always', scale=1),
    dict(who='michel', obj='knife', module='sets/pe_props.js', builder='buildKnife', opts={}, grip='raise', hand='L', anchor='grip', tip='tip', when='always', scale=1),
    dict(who='owner', obj='rag', module='sets/pe_props.js', builder='buildRag', opts={}, grip='hang', hand='R', anchor='grip', when='always', scale=1),
]

def st(at, pos, aim, lens, subject, framing, purpose, hold=0.0, creep=0.0028, **kw):
    return dict(at=at, pos=pos, aim=aim, lens=lens, subject=subject, framing=framing, purpose=purpose, hold=hold, creep=creep, **kw)

END_CAM = [1.05, 0.25, 1.28]
WCAM = [0.20, 1.70, 1.05]; WDIR = [0.25, 1.0, -0.12]          # row 38 close window shot: the lens at the glass of window L_0, looking out and a little forward
stations = [
    st(943, [1.00, 0.30, 1.32], [0.0, 0.90, 0.90], 14, 'michel', 'W', 'ROW 35 "HONESTLY" (END setup, M21 match in, then the STILLNESS 955-968: camera and men dead still): Michel in front in seat B lifts the foil high off the grey meal, the owner at the window, wary', hold=0.9, creep=0.0, shows=['meal']),
    st(984, [0.80, 0.30, 1.28], [0.06, 0.62, 0.92], 16, 'michel', 'M', 'ROW 36 "STILL better" (M02 push in on the tray): the grey meal slides aside under one finger, a pea rolls off, his face falls', hold=0.3, shows=['meal', 'tray']),
    st(1003, [0.82, 0.32, 1.28], [0.08, 0.70, 0.94], 15, 'michel', 'M', 'ROW 37 "airline FOOD" (POWER 4): knife and fork up, the strike: a neat bite out of the tray table; the owner wipes the window with his rag', hold=0.2, shows=['tray']),
]
props = {
    'meal': dict(pos=MEAL, kind='the grey airline meal'),
    'tray': dict(pos=TRAY, kind='the tray table (bitten on FOOD)'),
    'wing': dict(pos=A['wing_bite'], kind='the airliner wing with one bite missing'),
}
K = lambda f, foil, meal, pea, bitten: dict(f=f, foil=foil, meal=meal, pea=pea, bitten=bitten)
cab = dict(keys=[K(930, 0, 0, 0, 0), K(948, 1, 0, 0, 0), K(976, 1, 0, 0, 0), K(988, 1, 1, .3, 0), K(996, 1, 1, 1, 0), K(1001, 1, 1, 1, 1), K(1030, 1, 1, 1, 1)])
cab['wild'] = ['8A', '8B']
# the wing bite onto the end station's ray through window L_0: keep y 6.8, move the wing along x and z (sets/cabin.js wing_offset)
BITE = A['wing_bite']; t = (BITE[1] - END_CAM[1]) / (WIN[1] - END_CAM[1])
t = (BITE[1] - WCAM[1]) / WDIR[1]
BT = [WCAM[0] + t * WDIR[0], BITE[1], WCAM[2] + t * WDIR[2]]
cab['wing_offset'] = [round(BT[0] - BITE[0], 3), 0, round(BT[2] - BITE[2], 3)]
cab['tray_dy'] = TDY
cab['foil_raise'] = 0.16
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
    'hand_at': [dict(who='owner', f0=1001, f1=1021, at=[0.20, 1.74, 1.14], note='row 38: the rag ON the window glass at eye height')],
    'kicks': [{'at': 1001, 'amp': 3}],
    'fx': [dict(at=993, kind='glint', pos=[TRAY[0] - .1, TRAY[1], 1.3], note='row 37 "airline": a glint on the raised knife'),
           dict(at=1001, kind='clank', pos=[TRAY[0] + .08, TRAY[1] + .1, TRAY[2]], note='row 37 POWER 4: the bite out of the tray table, impact flash and sparks')],
    'moods': [dict(at=969, look='cold_blue', note='row 36: the grey meal, the face falls'), dict(at=1012, look='warm_up', note='row 38: smug, happy, the bright window'), dict(at=1001, look='flash_white', note='row 37 POWER 4 impact flash')],
    'takes': [{'id': 's5', 'place': 'cabin', 'stations': stations}],
}
BANK = 35.0; ca, sa = math.cos(math.radians(BANK)), math.sin(math.radians(BANK)); B0 = [1.25, 6.65, 0.80]   # bite centre measured in cabin_lite.glb
BB = [B0[0], 1.9 + (B0[1] - 1.9) * ca + (B0[2] - .5) * sa, .5 - (B0[1] - 1.9) * sa + (B0[2] - .5) * ca]          # after the bank about the pivot
AIMB = BB                                                                                                         # banked about the wing root only: the bite stays on the wing, we look down on it
WCAB = dict(cab, wing_bank=BANK, wing_offset=[round(AIMB[i] - BB[i], 3) for i in range(3)])
WIN_ST = [st(1005, WCAM, AIMB, 32, 'wing', 'O', 'ROW 38 (M26 end, dissolve on the move from the cabin): the lens at the glass, the airliner wing in the sun with ONE neat bite missing, big; loops to frame 0', hold=0.0, shows=['wing']),
          st(1021, [WCAM[0] + .03, WCAM[1] + .04, WCAM[2]], AIMB, 36, 'wing', 'O', 'ROW 38 last frame: the bitten wing big and clear (slow push)', hold=0.0, shows=['wing'])]
film['takes'].append({'id': 'win', 'place': 'cabin', 'stations': [dict(WIN_ST[0], at=1012), WIN_ST[1]]})
props['wing']['pos'] = AIMB
json.dump(film, open(os.path.join(HERE, 'film.json'), 'w'), indent=1)
print('film.json written:', len(acts), 'acts,', len(stations), 'stations')
import copy
FA = copy.deepcopy(film); FA['takes'] = [{'id': 's5', 'place': 'cabin', 'stations': stations}]; json.dump(FA, open(os.path.join(HERE, 'film_A.json'), 'w'), indent=1)
FW = copy.deepcopy(film); FW['takes'] = [{'id': 'win', 'place': 'cabin', 'stations': WIN_ST}]; FW['places']['cabin']['cabin'] = WCAB; json.dump(FW, open(os.path.join(HERE, 'film_W.json'), 'w'), indent=1)
