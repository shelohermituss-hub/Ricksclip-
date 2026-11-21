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
CL = [-0.15, 7.6, Z]                        # between the boards, a step right of the red board
BOARD = [-0.95, 8.42]
M = lambda k: 'm:../../ep_s5/' + k

acts = [
    dict(who='clerk', at=F0, pos=CL, view='side', dir=-1, pose=M('cl_count'), look=[BOARD[0], BOARD[1], 1.5], face='k:concentrate', note='rows 28-30: he waits at the boards, chalk ready'),
    dict(who='clerk', at=1076, look=[BOARD[0], BOARD[1], 1.2], note='row 32 "counted": he ticks without looking round'),
    dict(who='clerk', at=1126, pos=[-0.2, 7.38, Z + 0.42], move_s=0.2, note='row 33: up on the stool'),
    dict(who='clerk', at=1136, face='k:think', look=[BOARD[0], BOARD[1], 3.6], note='row 33: nothing left to write on: a first frown'),
    dict(who='clerk', at=1150, pos=[LX, ly(Z + 0.6) - 0.24, Z + 0.6], move_s=0.1, look=[BOARD[0], BOARD[1], 6.0], note='row 33-34: onto the ladder, rung by rung'),
    dict(who='clerk', at=1153, pos=[LX, ly(Z + 1.8) - 0.24, Z + 1.8], move_s=0.1),
    dict(who='clerk', at=1156, pos=[LX, ly(Z + 3.0) - 0.24, Z + 3.0], move_s=0.1),
    dict(who='clerk', at=1159, pos=[LX, ly(Z + 4.2) - 0.24, Z + 4.2], move_s=0.1),
    dict(who='clerk', at=1162, pos=[LX, ly(Z + 5.4) - 0.24, Z + 5.4], move_s=0.1, look=[BOARD[0], BOARD[1], 7.3]),
    dict(who='clerk', at=1164, face='k:concentrate', note='row 34 "three": chalks the 3x under UP TO'),
    dict(who='clerk', at=1179, face='k:think', note='row 35 "as": hat tipped back'),
    dict(who='clerk', at=1184, face='k:browUp', look=[0.95, 8.42, 1.5], note='row 35 "often": the long look down at the short lime board'),
]
held3d = [dict(who='clerk', obj='chalk', module='sets/s5_dallas.js', builder='buildChalk', opts={}, grip='raise', hand='R', anchor='grip', tip='tip', when='always', scale=1.6)]

def st(at, pos, aim, lens, subject, framing, purpose, hold=0.0, creep=0.0028, **kw):
    return dict(at=at, pos=pos, aim=aim, lens=lens, subject=subject, framing=framing, purpose=purpose, hold=hold, creep=creep, **kw)

S1P, S1A = [5.4, 9.2, 1.05], [0.6, 21.95, 4.4]
stations = [
    st(0, S1P, S1A, 20, 'sign', 'W', 'lead-in anchor (frames before 969 are not rendered): holds the opening framing so the S5 take starts at 969', hold=0),
    st(F0, S1P, S1A, 20, 'sign', 'W', 'ROW 28 (PLACE, M12 fly-land-rest): S4 lands here: low on the apron, the station front DALLAS FIRE DEPT. and both bays; ROW 29 "ran": both trucks roll out toward the lens', hold=0.9, shows=['sign']),
    st(1034, [1.1, 0.9, 1.7], [-0.05, 10.0, 1.95], 20, 'clerk', 'W', 'ROWS 30-31 (ACT/EXPLAIN, M04 pull back, symmetrical rest): the two trucks nose level, the Clerk between the boards RED and LIME, the calendar; leaves drop on "four", plasters pop', hold=1.0, shows=['board_red', 'board_lime', 'calendar']),
    st(1084, [1.15, 5.6, 1.05], [-0.75, 8.35, 1.55], 26, 'clerk', 'M', 'ROW 32 (ACT, M09 push in, low): the chalk mark being made on the red board, the plastered red fender behind his shoulder', hold=0.6, shows=['board_red']),
    st(1146, [2.6, 3.4, 2.6], [-0.5, 8.3, 3.4], 22, 'clerk', 'W', 'ROW 33 (EXPLAIN, M05 rise): the red count outgrows its board: stool, board 2, the ladder up on "hit"', hold=0.3, shows=['board_red']),
    st(1170, [-0.15, 4.6, 7.0], [-0.75, 8.42, 7.15], 26, 'clerk', 'C', 'ROW 34 (EXPLAIN + EXTREME, M05 rise with him): CLOSE on UP TO 3x at the top of the third board, chalk fist on it; UP TO 3x readable on "three"/"times"', hold=0.45, shows=['up_to_3x']),
    st(1188, [1.6, 5.4, 8.0], [-0.6, 10.5, 3.4], 22, 'clerk', 'W', 'ROW 35 (EXPLAIN): from the top of the ladder, his long look down: the short LIME board far below, the two trucks', hold=0.25, shows=['board_lime']),
    st(1202, [-2.2, 5.4, 1.35], [-2.6, 8.3, 1.15], 26, 'headlamp', 'C', 'S5 -> S6 join: down onto the RED truck chrome headlamp (S6 pushes in on "YOU" 1207, 27 f eased)', hold=0.2, shows=['headlamp']),
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
    'takes': [{'id': 's5', 'place': 'dallas', 'stations': stations}],
}
json.dump(film, open(os.path.join(HERE, 'film.json'), 'w'), indent=1)
print('film.json written:', len(acts), 'acts,', len(stations), 'stations')
