"""make_film.py: writes s2/film.json for S2 THE SECRET (frames 288-474, lines 3-4, plan rows 9-13). S2 stretch builder 2026-11-21, BOARD round.
Edit this file, not film.json. Positions are plan metres (Z up) in the Pine Hollow town set; they match S2 in sets/s2_shop.js."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
EP = os.path.join(HERE, '..')
keys = json.load(open(os.path.join(EP, 'cast', 'CAST_KEYS.json')))
meta = json.load(open(os.path.join(EP, 'sets', 'town', 'out', 'town_meta.json')))
CAST = ['hero', 'heroShop']
cast = {k: dict(keys['cast'][k], walk_speed=99) for k in CAST}

Z = 0.15                                  # the shop floor top
IN, HERO = [2.6, -9.7, Z], [1.2, -11.5, Z]
STAND, LAMP, CHART = [2.2, -12.3, 1.75], [0.45, -11.2, 1.30], [-1.6, -16.72, 1.9]
M = lambda k: 'm:../../ep_s2/' + k

acts = [
    # yard outfit (helmet on): walks in from the shop door during the pull back, helmet off backward onto the stand on "second" (f325)
    dict(who='hero', at=288, visible=False, pos=[1.3, 1.2, 0.02], view='front', dir=-1, pose=M('he_enter'), look=[-0.9, -8.0, 1.6], note='row 9 "But the fireman": he crosses Main St from the station toward his shop, the lemon truck behind him'),
    dict(who='hero', at=289, pos=[2.6, -3.2, 0.02], move_s=1.0, note='four strides toward the shop door (the camera pulls back ahead of him)'),
    dict(who='hero', at=322, visible=False, note='he reaches the shop door as the camera passes the glass: the next time we see him he is inside in his white coat'),
    # shop outfit (white coat open over the teal roll-neck, head mirror on its band)
    dict(who='heroShop', at=288, visible=False, pos=HERO, view='34', dir=-1, pose=M('he_shop'), look=[-1.0, -15.5, 1.6]),
    dict(who='heroShop', at=328, visible=True, pose=M('he_shop'), look_full=True, face='k:concentrate', note='row 10 "second job": coat tugged on'),
    dict(who='heroShop', at=366, look=[3.1, -9.7, 1.6], note='row 11: turns to the lens side as the fist rises to the mirror'),
    dict(who='heroShop', at=385, face='k:proud', note='row 11 "eye": the knuckle flicks the head mirror, small pride'),
    dict(who='heroShop', at=403, look=[0.45, -11.2, 1.3], face='k:think', note='row 12 "knew": toy up to the lamp, head tilt'),
    dict(who='heroShop', at=429, face='k:aim', note='row 12 "strange": one eye shut, toy out of the cone and back'),
    dict(who='heroShop', at=453, face='k:glanceCam', note='row 13 "red": eyes slide to the lens, half smile'),
]
held3d = [dict(who='heroShop', obj='toy_truck', module='sets/s2_shop.js', builder='buildToyTruck', opts={}, grip='raise', hand='L', anchor='grip', tip='tip',
               when='always', f0=405, scale=1.5)]

def st(at, pos, aim, lens, subject, framing, purpose, hold=0.0, creep=0.0028, **kw):
    return dict(at=at, pos=pos, aim=aim, lens=lens, subject=subject, framing=framing, purpose=purpose, hold=hold, creep=creep, **kw)

stations = [
    st(0, [1.2, -5.3, 2.1], [-3.0, 15.5, 1.75], 22, 'truck', 'W', 'lead-in anchor (frames before 288 are not rendered): holds the opening framing so the pull back cannot start before the stretch', hold=0),
    st(288, [1.2, -5.3, 2.1], [-3.0, 15.5, 1.75], 22, 'truck', 'W', 'ROW 9 (PLACE): S2 opens on the pavement outside the shop under its awning, looking across Main St at the station: the lemon truck finished in bay 1 (time has passed); the fireman crosses toward the shop door. The lead joins S1 to it with an 8-12 f blend on the motion (a place change)', hold=0.3, shows=['truck']),
    st(330, [0.0, -14.2, 1.85], [1.6, -7.5, 1.25], 22, 'hero', 'W', 'ROWS 9-10 (M04 pull back through the window glass, short living rest): back through the glass into the shop; he has walked in and stands by the exam chair with the station and its lemon truck through the window behind him; the helmet goes back onto the stand on "second"', hold=0.35, shows=['stand', 'truck']),
    st(362, [3.2, -12.9, 1.85], [1.2, -11.5, 1.35], 24, 'heroShop', 'W', 'ROW 10 (M11 truck arc, via): the arc round his east side while he tugs the white coat on', hold=0),
    st(395, [3.1, -9.7, 1.9], [0.53, -12.76, 1.2], 26, 'heroShop', 'W', 'ROW 11 (SETUP, M11 lands): his front, the letter chart R / ED / GOES / FIRST behind him and the coat stand with his helmet, for the mirror flip on "eye"', hold=0.45, shows=['chart', 'stand']),
    st(445, [2.3, -10.0, 1.8], [0.95, -11.45, 1.35], 28, 'heroShop', 'M', 'ROWS 12-13 (SETUP, M09 push in to the hand, then M02 slow creep): in to face and toy under the lamp cone for "strange", rests and creeps in for the glance on "red"; creeps on into the S3 push into the toy', hold=1.0, creep=0.004, shows=['toy']),
]
props = {
    'truck': dict(pos=[-4.2, 15.5, 1.3], kind='the finished lemon truck in bay 1'),
    'stand': dict(pos=STAND, kind='the coat stand with his helmet'),
    'chart': dict(pos=CHART, kind='the letter chart R / ED / GOES / FIRST'),
    'toy': dict(pos=[0.75, -11.35, 1.45], kind='the red toy truck at the lamp'),
}
place = dict(set='s2_shop', lite=True, kind='am', light='morning', light_over=meta['light']['am'], kit3d=dict(envGround='#8f8a7e'), grass_keep=0.4, lamp_yaw=340,
             hero=dict(paint='lemon', masking=False, letters='under', ribbon=False, priceCard=False, sirens=4, wear=.25))
film = {
    'title': 'Why Fire Trucks Turned Yellow, S2 THE SECRET (lines 3-4, frames 288-474)',
    'fps': 30, 'size': [1080, 1920], 'words': 'voice/words.json', 'start': 288, 'end': 475,
    'camera': {'v2': True}, 'camsafe': True, 'kit3d': {'pbr': True, 'relief': True, 'sky': True, 'trees': False},
    'tween': {'frames': 0, 'face_frames': 0, 'ones': True}, 'auto_view': False,
    'puppet_pkg': ['moves', '.', 'cast', '../../../templates/vector2d_characters/code'],
    'cast': cast, 'faces_ep': keys['faces_ep'], 'face_shadow': True,
    'costume_shade': dict(keys['costume_shade'], keep_drawn_light=True, smooth=40),
    'card_shade': dict(keys['card_shade'], amount=0, rim_amount=0),
    'post': {'dof': 0.0, 'dust': 0.5, 'bloom': 1, 'vignette': 0},
    'places': {'shop': place}, 'props': props, 'acts': acts, 'held3d': held3d,
    'fx': [dict(at=385, kind='glint', pos=[0.7, -11.25, 2.0], note='row 11: the head mirror glints on "eye"')],
    'moods': [dict(at=322, look='shop_daylight', note='row 9: from the yard sun into the shop: window daylight + the amber lamp'), dict(at=385, look='glint', note='row 11: the head mirror glint'), dict(at=436, look='toy_dull', note='row 12: the toy out of the cone, its red dulls (s2_shop.js, its own paint)'), dict(at=446, look='toy_red', note='row 12: back in the cone, red again')],
    'takes': [{'id': 's2', 'place': 'shop', 'stations': stations}],
}
json.dump(film, open(os.path.join(HERE, 'film.json'), 'w'), indent=1)
print('film.json written:', len(acts), 'acts,', len(stations), 'stations')
