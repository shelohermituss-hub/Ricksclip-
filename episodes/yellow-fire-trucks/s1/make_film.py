"""make_film.py: writes s1/film.json for S1 THE HOOK (frames 0-288). S1 stretch builder 2026-11-20.
run_stretch.sh runs it before every bake, so film.json is always made from here (edit this file, not film.json).
Positions are plan metres (Z up) in the Pine Hollow town set; they match S1 in sets/s1_yard.js."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
EP = os.path.join(HERE, '..')
keys = json.load(open(os.path.join(EP, 'cast', 'CAST_KEYS.json')))
meta = json.load(open(os.path.join(EP, 'sets', 'town', 'out', 'town_meta.json')))
CAST = ['hero', 'chief', 'rookie', 'rookieDown', 'oldTimer', 'sceptic']
cast = {k: dict(keys['cast'][k], walk_speed=99) for k in CAST}

Z = 0.14   # the yard concrete top (town anchors carry z 0.14)
HERO, CHIEF = [-2.0, 15.7, Z], [1.2, 17.6, Z]
ROOK, OLD, SCEP = [-2.45, 19.3, Z], [-1.55, 19.6, Z], [-2.2, 20.8, Z]
M = lambda k: 'm:../../ep_s1/' + k

acts = [
    # HERO: one move for the whole stretch; faces change on the word (head pop from the kit)
    dict(who='hero', at=0, pos=HERO, view='side', dir=-1, pose=M('he_spray'), face='k:concentrate', note='row 1 frame 0: mid-sweep, firemen frozen'),
    dict(who='hero', at=127, face='k:aim', note='row 5 "lemon": one eye shut, judging at arm\'s length'),
    dict(who='hero', at=136, face='k:proud', note='row 5 "yellow": the small half-smile, then dead still'),
    dict(who='hero', at=176, face='k:browUp', note='rows 6-7: listens, polite, unmoved'),
    dict(who='hero', at=264, face='k:concentrate', note='row 8: already turning back to spray'),
    # CHIEF: hidden in the bay until he bursts out on "chief" (f163); the card runs 2.2 m in 10 f (his move draws the two stamping strides)
    dict(who='chief', at=0, visible=False, pos=[2.75, 19.05, Z], view='34', dir=-1, pose=M('ch_burst'), face='k:frozenWide'),
    dict(who='chief', at=160, visible=True, note='row 6: bursts out of bay 2 past his old red pumper'),
    dict(who='chief', at=161, pos=CHIEF, move_s=0.3, note='the burst: two strides to his spot'),
    dict(who='chief', at=172, face='k:furious', note='POWER 1 "exploded"'),
    dict(who='chief', at=200, face='k:chiefShout', say=[19, 28], note='rows 7-8: "Fire trucks are RED! We look like a giant lemon!" lip sync 6.66-9.42'),
    # ROOKIE: helmet over his eyes (rookieDown) to f163, then the startled hop swaps to the rookie card in the air
    dict(who='rookieDown', at=0, pos=ROOK, view='34', dir=-1, pose=M('rk_frozen'), face='k:frozenWide'),
    dict(who='rookieDown', at=164, visible=False),
    dict(who='rookie', at=0, visible=False, pos=ROOK, view='34', dir=-1, pose=M('rk_jump'), face='k:frozenWide'),
    dict(who='rookie', at=164, visible=True, pose=M('rk_jump')),
    dict(who='oldTimer', at=0, pos=OLD, view='34', dir=-1, pose=M('ot_frozen'), face='k:shocked'),
    dict(who='oldTimer', at=230, face='k:browUp', note='row 8: his lunch box hops, the lemon rolls'),
    dict(who='sceptic', at=0, pos=SCEP, view='34', dir=-1, pose=M('sc_crossed'), face='k:browUp'),
]

held3d = [dict(who='hero', obj='spray_gun', module='sets/assets.js', builder='buildSprayGun', opts={}, grip='handle', face='out', hand='R',
               anchor='grip', tip='tip', when='always', scale=1.7)]

def st(at, pos, aim, lens, subject, framing, purpose, hold=0.0, creep=0.0028, **kw):
    return dict(at=at, pos=pos, aim=aim, lens=lens, subject=subject, framing=framing, purpose=purpose, hold=hold, creep=creep, **kw)

stations = [
    st(0, [-1.35, 13.0, 1.14], [-2.75, 16.9, 1.84], 24, 'hero', 'W', 'ROWS 1-3 FRAME 0 (HOOK, M00 living rest): the hero mid-sweep big in frame, both fists on the gun and hose (row 2), the wet lemon edge eating the red toward the cab door, the three firemen frozen behind him, the lemon paint tin near the lens', hold=1.6, shows=['door']),
    st(120, [-1.6, 10.2, 1.34], [-3.0, 16.0, 1.74], 20, 'truck', 'W', 'ROWS 4-5 (SETUP + EXTREME, M04 pull back reveal): over "brand new firetruck" the pull back reveals the gift-wrapped truck (ribbon and bow on the nose, price card, scissors on the cushion on the stool); the camera flows THROUGH this wide (via point) on its way round to bay 2', hold=0),
    st(165, [1.45, 14.9, 0.74], [0.5, 17.6, 1.24], 22, 'chief', 'W', 'ROWS 6-7 (TALK + POWER 1, M11 push + truck arc): the camera swings right and in as the Chief bursts out of bay 2; the push runs through the impact; low on him, boots and lunch box for the stamp on "RED"', hold=2.2, shows=['lunch_box']),
    st(272, [2.2, 14.02, 0.30], [-0.15, 18.1, 1.3], 22, 'chief', 'M', 'ROW 8 (TALK + EXTREME, M02 sink and land at the lens): the camera follows the rolling lemon down to the ground; it stops at the lens, as big as the yellow half of the truck, under his pointing fist', hold=0.5, shows=['lemon']),
]
props = {
    'truck': dict(pos=[-3.3, 17.0, 1.3], kind='the half-sprayed truck'),
    'door': dict(pos=[-3.2, 15.2, 1.2], kind='the gold No. 1 on the cab door'),
    'lunch_box': dict(pos=[1.15, 16.9, 0.24], kind="the Old-Timer's lunch box"),
    'lemon': dict(pos=[2.02, 14.32, 0.18], kind='the lemon'),
}
place = dict(set='s1_yard', kind='am', light='morning', light_over=meta['light']['am'], kit3d=dict(envGround='#8f8a7e'), grass_keep=0.4,
             hero=dict(paint='half', edge=-1.55, masking=True, letters='under', ribbon=False, priceCard=True, sirens=4, wear=.25))
film = {
    'title': 'Why Fire Trucks Turned Yellow, S1 THE HOOK (lines 1-2, frames 0-288)',
    'fps': 30, 'size': [1080, 1920], 'words': 'voice/words.json', 'start': 0, 'end': 289,
    'camera': {'v2': True}, 'camsafe': True, 'kit3d': {'pbr': True, 'relief': True, 'sky': True, 'trees': False},
    'tween': {'frames': 0, 'face_frames': 0, 'ones': True}, 'auto_view': False,
    'puppet_pkg': ['moves', '.', 'cast', '../../../templates/vector2d_characters/code'],
    'cast': cast, 'faces_ep': keys['faces_ep'], 'face_shadow': True,
    'costume_shade': dict(keys['costume_shade'], keep_drawn_light=True, smooth=40),
    'card_shade': dict(keys['card_shade'], amount=0, rim_amount=0),
    'post': {'dof': 0.0, 'dust': 0.5, 'bloom': 1, 'vignette': 0},
    'places': {'yard': place}, 'props': props, 'acts': acts, 'held3d': held3d,
    'kicks': [{'at': 172, 'amp': 3}],
    'fx': [dict(at=19, kind='glint', pos=[-2.6, 15.65, 1.4], note='row 2: a glint runs down the chrome gun on "grabbed"'), dict(at=83, kind='glint', pos=[-4.2, 13.85, 0.9], note='row 4: the white ribbon bow flares on "brand"')],
    'moods': [dict(at=127, look='warm_up', note='row 5: the sun full on the lemon half'), dict(at=172, look='flash_white', note='row 6: POWER 1 impact flash (with the set impact frame)')],
    'takes': [{'id': 's1', 'place': 'yard', 'stations': stations}],
}
json.dump(film, open(os.path.join(HERE, 'film.json'), 'w'), indent=1)
print('film.json written:', len(acts), 'acts,', len(stations), 'stations')
