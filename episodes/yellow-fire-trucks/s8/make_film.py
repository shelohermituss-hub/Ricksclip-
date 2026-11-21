"""make_film.py: writes s8/film.json for S8 THE PAYOFF (script line 14, frames 1754-1898, plan rows 54-58). S8 stretch builder 2026-11-21, BOARD round.
Edit this file, not film.json. Positions are plan metres (Z up) in the Pine Hollow town set (LITE staging copy); they match S8 in sets/s8_yard.js.
Pattern from s1/make_film.py (symlinks, the 14 cm yard height, the paint-frame workaround in the set module)."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
EP = os.path.join(HERE, '..')
keys = json.load(open(os.path.join(EP, 'cast', 'CAST_KEYS.json')))
meta = json.load(open(os.path.join(EP, 'sets', 'town', 'out', 'town_meta.json')))
CAST = ['hero', 'chief', 'chiefDown', 'oldTimer', 'rookie', 'sceptic']
cast = {k: dict(keys['cast'][k], walk_speed=99) for k in CAST}

Z = 0.14                                  # the yard concrete top
F0, F1 = 1754, 1898
CH_A, CH_B = [4.2, 14.2, Z], [4.2, 17.95, Z]     # the march runs ON the white yard line (x 4.2, y 7.9 -> 18.55 = the pumper's nose)
CH_HIT = [4.2, 18.12, Z]                  # flat against the nose (nose at y 18.55; the fat body is ~0.4 m deep)
HERO = [5.3, 16.4, Z]                   # front left of the wide (east camera looking west), mug at his chest
OLD, ROOK, SCEP = [-1.2, 15.4, Z], [-0.8, 16.1, Z], [-1.4, 16.8, Z]   # by the lemon truck (bay 1 truck, side at x -3.0)
M = lambda k: 'm:../../ep_s8/' + k
W = dict(that=1759, evening=1768, chief=1787, marched=1794, out=1803, his=1815, beautiful=1820, red=1830, truck=1840, and_=1849, walked=1857, straight=1864, into=1876, it=1886)

acts = [
    dict(who='chief', at=F0, visible=False, pos=[4.199, 14.2193, Z], view='side', dir=1, pose=M('ch_march')),
    dict(who='chief', at=F0, face='k:proudShut'),
    dict(who='chief', at=W['chief'], visible=True, note='row 55: he is there on "chief", chest out, chin up, eyes shut with pride'),
    dict(who="chief", at=1826, visible=False, note='rows 56-57 POV: the camera is his eyes'),
    dict(who='chief', at=1864, visible=True, note='row 58: crash pull-back out of his eyes: his last, biggest step'),
    dict(who='chief', at=W['into'], visible=False),
    dict(who='chiefDown', at=F0, visible=False, pos=CH_HIT, view='side', dir=1, pose=M('ch_splat'), face='k:surprised'),
    dict(who='chiefDown', at=W['into'], visible=True, note='row 58 POWER 5 "into": flat on the grey truck, helmet over the eyes, moustache bent'),
    dict(who='hero', at=F0, pos=HERO, view='34', dir=-1, pose=M('he_mug'), face='k:browUp', note='rows 55-58: calm, polite, unmoved; knows what is coming'),
    dict(who='hero', at=1887, face='k:proud', note='row 58: the sip, the small half-smile (no cheer)'),
    dict(who='oldTimer', at=F0, pos=OLD, view='34', dir=1, pose=M('ot_bite'), face='k:concentrate'),
    dict(who='oldTimer', at=W['and_'], face='k:browUp', note='row 57: sees it coming, takes a bite'),
    dict(who='rookie', at=F0, pos=ROOK, view='34', dir=1, pose=M('rk_up'), face='k:concentrate'),
    dict(who='rookie', at=W['it'], face='k:surprised', note='row 58 "it": pushes his own helmet UP and sees perfectly'),
    dict(who='sceptic', at=F0, pos=SCEP, view='34', dir=1, pose=M('sc_open'), face='k:browUp'),
    dict(who='sceptic', at=W['it'], face='k:shocked', note='row 58 "it": mouth open, arms open for the only time'),
]
acts += [a for a in json.load(open(os.path.join(EP, 'moves', 'shared_walks_acts.json')))['s8_ch_march']]   # SHARED_WALKS.md: locked-feet march (replaces the old glide act)
held3d = [dict(who='hero', obj='mug', module='sets/assets.js', builder='buildMug', opts={}, grip='handle', hand='R', when='always', scale=1.5)]

def st(at, pos, aim, lens, subject, framing, purpose, hold=0.0, creep=0.0025, **kw):
    return dict(at=at, pos=pos, aim=aim, lens=lens, subject=subject, framing=framing, purpose=purpose, hold=hold, creep=creep, **kw)

WIDE_POS, WIDE_AIM = [8.4, 15.6, 1.25], [-1.0, 19.9, 1.25]   # east of the line looking west: lemon truck straight behind the Chief, pumper nose at his right
stations = [
    st(F0, [7.0, 17.55, 1.32], [5.2, 19.85, 1.14], 28, 'pumper', 'C', 'ROW 54 (PLACE, M09 push, blend on motion from the S7 stillness): the push into the wet red door of the home pumper', hold=0.0, shows=['door']),
    st(1778, [6.2, 18.92, 1.3], [5.2, 19.88, 1.14], 32, 'pumper', 'C', 'ROW 54: lands on the door panel; the drain wipe crosses it on "evening" (1766-1784), gold letters keep their gold', hold=0.45, shows=['door']),
    st(1832, [4.2, 16.0, 1.53], [2.7, 20.2, 1.25], 18, 'pumper', 'M', 'ROWS 55-57 (ACT, M04 pull back THROUGH the wide (via, f~1806: the Chief marching side on, chin up, eyes shut), then POV, M21): pushed into his eyes; rides his march; brim, moustache, lids, fist out; the ruler line runs from his toes into the grey shape', hold=0.5, creep=0.0, follow='chief', via=[[8.2, 15.6, 1.45]]),
    st(W['into'], WIDE_POS, WIDE_AIM, 24, 'chiefDown', 'W', 'ROW 58 (END + POWER 5, M26 crash pull back, planned whip): the poster; rests 0.73 s to 63.25 (slow drift)', hold=0.7, whip=True, creep=0.0012, shows=['lemon_truck']),
]
props = {'door': dict(pos=[5.2, 19.75, 1.2], kind="the Chief's pumper door panel"), 'pumper': dict(pos=[4.2, 18.4, 1.3], kind='the grey pumper nose'),
         'lemon_truck': dict(pos=[-4.2, 16.0, 1.4], kind='the lemon truck'), 'mug': dict(pos=[8.05, 16.6, 1.25], kind="the hero's mug")}
place = dict(set='s8_yard', lite=True, truckFull=True, bays=0.15, kind='du', light='golden', light_over=meta['light']['du'], kit3d=dict(envGround='#5d5468'), grass_keep=0.4,
             hero=dict(paint='lemon', masking=False, letters='over', ribbon=False, priceCard=False, sirens=4, wear=.25), chief=dict(drain=0))
film = {
    'title': 'Why Fire Trucks Turned Yellow, S8 THE PAYOFF (line 14, frames 1754-1898), BOARD',
    'fps': 30, 'size': [1080, 1920], 'words': 'voice/words.json', 'start': F0, 'end': F1 + 1,
    'camera': {'v2': True}, 'camsafe': True, 'kit3d': {'pbr': True, 'relief': True, 'sky': True, 'trees': False},
    'tween': {'frames': 0, 'face_frames': 0, 'ones': True}, 'auto_view': False,
    'puppet_pkg': ['moves', '.', 'cast', '../../../templates/vector2d_characters/code'],
    'cast': cast, 'faces_ep': keys['faces_ep'], 'face_shadow': True,
    'costume_shade': dict(keys['costume_shade'], keep_drawn_light=True, smooth=40),
    'card_shade': dict(keys['card_shade'], amount=0, rim_amount=0),
    'post': {'dof': 0.0, 'dust': 0.5, 'bloom': 1, 'vignette': 0},
    'places': {'yard': place}, 'props': props, 'acts': acts, 'held3d': held3d,
    'kicks': [{'at': W['into'], 'amp': 2.5}],
    'fx': [dict(at=W['red'], kind='glint', pos=[3.3, 18.6, 1.05], note='row 56: the one faint chrome glint on the grey pumper blinks on "red"')],
    'takes': [{'id': 'pre', 'place': 'yard', 'stations': [dict(stations[0], at=0, purpose='frames 0-1753 belong to S1-S7: a parked stand-in so the S8 take starts AT 1754 (film_plan starts the first take at frame 0)')]},
              {'id': 's8', 'place': 'yard', 'stations': stations}],   # ONE take from 1754 (no cut inside the stretch)
}
json.dump(film, open(os.path.join(HERE, 'film.json'), 'w'), indent=1)
print('film.json written:', len(acts), 'acts,', len(stations), 'stations')
