"""make_film.py: writes s7/film.json for S7 THE FALSE WIN (frames 1576-1754, line 13, plan rows 49-53). S7 stretch builder 2026-11-21, BOARD round.
Edit this file, not film.json. Plan metres (Z up) in the DALLAS set (LITE); they match S7 in sets/s7_dallas.js. Pattern: s2/ and s5/make_film.py."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
EP = os.path.join(HERE, '..')
keys = json.load(open(os.path.join(EP, 'cast', 'CAST_KEYS.json')))
meta = json.load(open(os.path.join(EP, 'sets', 'dallas', 'out', 'dallas_meta.json')))
A = meta['anchors']
CAST = ['painterThin', 'painterFat', 'chiefVisitor']
cast = {k: dict(keys['cast'][k], walk_speed=99) for k in CAST}
F0, F1 = 1576, 1754
Z = 0.12
DOOR = [4.45, 10.0, 1.35]                  # the lime truck's driver door panel (east side; truck centre x 3.2, nose south at y 8.4)
PT, PF = [5.35, 11.25, Z], [5.35, 16.3, Z]  # painters stand rear-ward of the part they spray, so the south-east lens sees their 3/4 front
CH0, CH1 = [7.05, 10.9, Z], [5.75, 9.35, Z]  # Chief watches by the order-sheet drum, then plants himself in front of the wet red door
CAM_SE = [8.4, 4.9, 1.45]
M = lambda k: 'm:../../ep_s7/' + k
acts = [
    dict(who='painterThin', at=F0, pos=PT, view='34', dir=-1, pose=M('pt_s7'), look=A['order_sheet'], face='k:sleepy', note='row 49 "Dallas?": bored, shrugs at the order sheet REPAINT: RED'),
    dict(who='painterThin', at=1612, look=[4.45, 9.9, 1.3], face='k:concentrate', note='raises the gun at the door'),
    dict(who='painterThin', at=1667, pos=[5.55, 12.0, Z], move_s=0.2, look=CAM_SE, note='row 51 "because": steps aside, gun down'),
    dict(who='painterFat', at=F0, pos=PF, view='34', dir=-1, pose=M('pf_s7'), look=[4.45, 15.0, 1.3], face='k:concentrate', note='careful, tongue out'),
    dict(who='painterFat', at=1649, face='k:lipBite', look=[4.45, 15.4, 1.2], note='row 50 "anyway": pats the last yellow patch goodbye'),
    dict(who='painterFat', at=1667, pos=[5.6, 16.9, Z], move_s=0.2, look=CAM_SE),
    dict(who='chiefVisitor', at=F0, pos=CH0, view='34', dir=-1, pose=M('cv_s7'), look=[4.45, 12.0, 1.3], face='k:proud', note='VISITOR tag; watches, pleased'),
    dict(who='chiefVisitor', at=1672, pos=CH1, move_s=0.25, look=CAM_SE, note='row 51 "firetruck": plants himself in front of the wet red truck'),
    dict(who='chiefVisitor', at=1702, face='k:proudShut', note='row 52 "has": eyes-shut salute, rocks back too far'),
    dict(who='chiefVisitor', at=1720, face='k:proud', note='row 52 "red": catches himself, chin up, the proud nod'),
]
held3d = [dict(who='painterThin', obj='spray_gun', module='sets/assets.js', builder='buildSprayGun', opts={}, grip='handle', hand='R', anchor='grip', tip='tip', when='always', scale=1),
          dict(who='painterFat', obj='spray_gun', module='sets/assets.js', builder='buildSprayGun', opts={}, grip='handle', hand='R', anchor='grip', tip='tip', when='always', scale=1)]

def st(at, pos, aim, lens, subject, framing, purpose, hold=0.0, creep=0.0018, **kw):
    return dict(at=at, pos=pos, aim=aim, lens=lens, subject=subject, framing=framing, purpose=purpose, hold=hold, creep=creep, **kw)
P1, A1 = [6.15, 9.2, 1.4], [4.45, 10.1, 1.38]
stations = [
    st(0, P1, A1, 28, 'door', 'M', 'lead-in anchor (frames before 1576 are not rendered)', hold=0, creep=0.0),
    st(F0, P1, A1, 28, 'door', 'M', 'ROW 49 in (S6 -> S7 "And", match on colour): the lemon door panel fills the frame; the pull back starts on "Dallas"', hold=0.4, shows=['door']),
    st(1618, CAM_SE, [4.6, 12.4, 1.55], 20, 'painterThin', 'W', 'ROWS 49-51 (PLACE + ACT, M04 pull back, long living rest): the lime truck side, the two Painters, the Chief by the drum, the boards and DALLAS behind; "back": red sweeps over lime; "anyway": the pat', hold=2.0, shows=['door', 'boards']),
    st(1727, [8.1, 7.2, 1.45], [5.6, 9.7, 1.5], 24, 'chiefVisitor', 'M', 'ROWS 51-53 (ACT, M09 push in, then the STILLNESS 1730-1745 dead still: creep 0): the Chief, chest up, the wet red door behind him', hold=0.9, creep=0.0, shows=['door']),   # S7 ends HERE (frozen tableau to 1754); the push into the wet door did not fit (STATE.md)
]
props = {'door': dict(pos=DOOR, kind='the Dallas lime truck door panel'), 'boards': dict(pos=[-0.95, 8.42, 4.0], kind='the three-board RED tally, UP TO 3x'),
         'order': dict(pos=A['order_sheet'], kind='order sheet REPAINT: RED')}
place = dict(set='s7_dallas', lite=True, kind='no', light='day', light_over=meta['light']['no'], kit3d=dict(envGround='#cdb690'),
             boards=dict(n=3, ladder=False, stool=False, painters=True, leaves=3))
film = {
    'title': 'Why Fire Trucks Turned Yellow, S7 THE FALSE WIN (line 13, frames 1576-1754), BOARD',
    'fps': 30, 'size': [1080, 1920], 'words': 'voice/words.json', 'start': F0, 'end': F1 + 1,
    'camera': {'v2': True}, 'camsafe': True, 'kit3d': {'pbr': True, 'relief': True, 'sky': True, 'trees': False},
    'tween': {'frames': 0, 'face_frames': 0, 'ones': True}, 'auto_view': False,
    'puppet_pkg': ['moves', '.', 'cast', '../../../templates/vector2d_characters/code'],
    'cast': cast, 'faces_ep': keys['faces_ep'], 'face_shadow': True,
    'costume_shade': dict(keys['costume_shade'], keep_drawn_light=True, smooth=40),
    'card_shade': dict(keys['card_shade'], amount=0, rim_amount=0),
    'post': {'dof': 0.0, 'dust': 0.5, 'bloom': 1, 'vignette': 0},
    'places': {'dallas': place}, 'props': props, 'acts': acts, 'held3d': held3d,
    'fx': [dict(at=1678, kind='dust', pos=[5.75, 9.35, 0.2], note='row 51: the plant kicks sand dust'), dict(at=1629, kind='dust', pos=[4.5, 9.6, 1.3], note='row 50: paint mist puff at the door (stand-in for red mist)')],
    'moods': [dict(at=1629, look='red_wet', note='row 50 "back": the wet red takes over the panel'), dict(at=1678, look='warm_pride', note='row 51 "firetruck"')],
    'takes': [{'id': 's7', 'place': 'dallas', 'stations': stations}],
}
json.dump(film, open(os.path.join(HERE, 'film.json'), 'w'), indent=1)
print('film.json written:', len(acts), 'acts,', len(stations), 'stations')
