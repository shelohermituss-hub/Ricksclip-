"""make_film.py: writes s5/film.json for S5 THE COUNT (frames 969-1202, lines 8-9, plan rows 28-35). S5 stretch builder 2026-11-21, BOARD round.
Edit this file, not film.json. Positions are plan metres (Z up) in the DALLAS set (LITE staging copy); they match S5 in sets/s5_dallas.js.
Pattern: s2/make_film.py (lead-in anchor station at f0, symlinks, side + front move exports)."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
EP = os.path.join(HERE, '..')
keys = json.load(open(os.path.join(EP, 'cast', 'CAST_KEYS.json')))
meta = json.load(open(os.path.join(EP, 'sets', 'dallas', 'out', 'dallas_meta.json')))
A = meta['anchors']
CAST = ['clerk']
cast = {k: dict(keys['cast'][k], walk_speed=99) for k in CAST}
F0, F1 = 969, 1202
Z = 0.12                                    # the apron top
LX, LY0, LY1, LTOP = -0.1, 6.95, 8.33, 7.5
ly = lambda z: LY0 + (LY1 - LY0) * (z - Z) / (LTOP - Z)
CL = [-0.4, 8.0, Z]                         # at the right half of the red board, side on to it (faces west, so a south camera sees his side, never his back)
WEST = lambda z: [-2.2, 8.0, z]
BOARD = [-0.95, 8.42]
M = lambda k: 'm:../../ep_s5/' + k

acts = [
    dict(who='clerk', at=F0, pos=CL, view='side', dir=-1, pose=M('cl_count'), look=WEST(1.5), face='k:concentrate', note='rows 28-30: he waits at the boards, chalk ready'),
    dict(who='clerk', at=1076, look=WEST(1.2), note='row 32 "counted": he ticks without looking round'),
    dict(who='clerk', at=1126, pos=[-0.25, 7.6, Z + 0.42], move_s=0.2, note='row 33: up on the stool'),
    dict(who='clerk', at=1136, face='k:think', look=WEST(3.6), note='row 33: nothing left to write on: a first frown'),
    dict(who='clerk', at=1150, pos=[LX, ly(Z + 0.6) - 0.24, Z + 0.6], move_s=0.1, look=WEST(4.0), note='row 33-34: onto the ladder, rung by rung'),
    dict(who='clerk', at=1153, pos=[LX, ly(Z + 1.8) - 0.24, Z + 1.8], move_s=0.1),
    dict(who='clerk', at=1156, pos=[LX, ly(Z + 3.0) - 0.24, Z + 3.0], move_s=0.1),
    dict(who='clerk', at=1159, pos=[LX, ly(Z + 4.2) - 0.24, Z + 4.2], move_s=0.1),
    dict(who='clerk', at=1162, pos=[LX, ly(Z + 5.4) - 0.24, Z + 5.4], move_s=0.1, look=WEST(7.3)),
    dict(who='clerk', at=1164, face='k:concentrate', note='row 34 "three": chalks the 3x under UP TO'),
    dict(who='clerk', at=1179, face='k:think', note='row 35 "as": hat tipped back'),
    dict(who='clerk', at=1184, face='k:browUp', look=[-1.4, 6.6, 0.5], note='row 35 "often": the long look down at the short lime board'),
]
held3d = [dict(who='clerk', obj='chalk', module='sets/s5_dallas.js', builder='buildChalk', opts={}, grip='raise', hand='R', anchor='grip', tip='tip', when='always', scale=1.6)]

def st(at, pos, aim, lens, subject, framing, purpose, hold=0.0, creep=0.0028, **kw):
    return dict(at=at, pos=pos, aim=aim, lens=lens, subject=subject, framing=framing, purpose=purpose, hold=hold, creep=creep, **kw)

S1P, S1A = [1.35, 4.1, 1.3], [-0.7, 12.0, 2.1]
stations = [
    st(0, S1P, S1A, 19, 'clerk', 'W', 'lead-in anchor (frames before 969 are not rendered): holds the opening framing so the S5 take starts at 969', hold=0),
    st(F0, S1P, S1A, 19, 'clerk', 'W', 'ROWS 28-33 (PLACE + ACT, M12 land, then ONE long living rest with a slow creep in): S4 lands low in front of the boards: DALLAS FIRE DEPT. over both bays, the Clerk at the RED board, LIME beside him; "ran": the trucks roll out and stop nose level; "four": leaves drop, plasters pop; "counted": the ticks, the plastered red fender behind him; the stool; board 2', hold=4.9, creep=0.0018, shows=['sign', 'board_red', 'board_lime', 'calendar']),
    st(1166, [0.95, 3.7, 2.4], [-0.55, 8.42, 6.85], 26, 'clerk', 'M', 'ROW 34 (EXPLAIN + EXTREME, M05 rise with him): the camera rises and tilts up the climb to UP TO 3x at the top of the third board; readable on "three"/"times"', hold=0.3, creep=0.0008, shows=['up_to_3x']),
    st(1202, [0.15, 4.85, 1.6], [-2.6, 8.3, 1.2], 26, 'headlamp', 'M', 'ROW 35 + S5 -> S6 join: his long look down leads the camera down past the short LIME board onto the RED truck chrome headlamp (S6 pushes in on "YOU" 1207)', hold=0.1, creep=0.0008, whip=True, shows=['headlamp']),
]
props = {
    'sign': dict(pos=A['sign_front'], kind='DALLAS FIRE DEPT. front band'),
    'board_red': dict(pos=[-0.95, 8.42, 1.6], kind='the RED tally board'), 'board_lime': dict(pos=[0.95, 8.42, 1.6], kind='the LIME tally board'),
    'calendar': dict(pos=A['calendar'], kind='the YEAR calendar'), 'up_to_3x': dict(pos=A['up_to_3x'], kind='UP TO 3x'),
    'headlamp': dict(pos=[-2.62, 8.35, 1.15], kind='red truck chrome headlamp (east one)'),
}
place = dict(set='s5_dallas', lite=True, kind='no', light='day', light_over=meta['light']['no'], kit3d=dict(envGround='#cdb690'),
             boards=dict(n=1, ladder=False, stool=False, painters=False, leaves=0))
film = {
    'title': 'Why Fire Trucks Turned Yellow, S5 THE COUNT (lines 8-9, frames 969-1202), BOARD',
    'fps': 30, 'size': [1080, 1920], 'words': 'voice/words.json', 'start': F0, 'end': F1 + 1,
    'camera': {'v2': True}, 'camsafe': True, 'kit3d': {'pbr': True, 'relief': True, 'sky': True, 'trees': False},
    'tween': {'frames': 0, 'face_frames': 0, 'ones': True}, 'auto_view': False,
    'puppet_pkg': ['moves', '.', 'cast', '../../../templates/vector2d_characters/code'],
    'cast': cast, 'faces_ep': keys['faces_ep'], 'face_shadow': True,
    'costume_shade': dict(keys['costume_shade'], keep_drawn_light=True, smooth=40),
    'card_shade': dict(keys['card_shade'], amount=0, rim_amount=0),
    'post': {'dof': 0.0, 'dust': 0.5, 'bloom': 1, 'vignette': 0},
    'places': {'dallas': place}, 'props': props, 'acts': acts, 'held3d': held3d,
    'fx': [dict(at=1102, kind='dust', pos=[-0.45, 7.55, 1.6], note='row 32 "crash": the chalk dust he blows off his fist')],
    'moods': [dict(at=1049, look='sun_sweep', note='row 31 "four": the shadows sweep with the leaf'), dict(at=1057, look='sun_sweep', note='row 31: third leaf, third sweep')],
    'takes': [{'id': 's5', 'place': 'dallas', 'stations': stations}],
}
json.dump(film, open(os.path.join(HERE, 'film.json'), 'w'), indent=1)
print('film.json written:', len(acts), 'acts,', len(stations), 'stations')
