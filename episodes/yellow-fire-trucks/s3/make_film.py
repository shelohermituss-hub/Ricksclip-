"""make_film.py: writes s3/film.json for S3 THE CROSSING AT DUSK (frames 474-770, plan rows 14-21, lines 5-6). S3 stretch builder 2026-11-21.
Edit this file, not film.json. Positions are plan metres (Z up) in the Pine Hollow town; the crossing asphalt is z 0. They match S3 in sets/s3_crossing.js."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
EP = os.path.join(HERE, '..')
keys = json.load(open(os.path.join(EP, 'cast', 'CAST_KEYS.json')))
meta = json.load(open(os.path.join(EP, 'sets', 'town', 'out', 'town_meta.json')))
CAST = ['milkman', 'milkmanDriver', 'sceptic']
cast = {k: dict(keys['cast'][k], walk_speed=99) for k in CAST}
cast['sceptic'] = dict(keys['cast']['scepticDriver'], walk_speed=99)     # fix round: the seated, cut-at-the-hips driver puppet (cast/DRIVER_NOTE.md)
M = lambda k: 'm:../../ep_s3/' + k

# keep in step with sets/s3_crossing.js S3
VX, VY0, VY1, VY2, TY, TXH = 24.3, -11.2, -8.9, -7.6, -4.0, 28.9
DRV = lambda vy: [VX - .11, vy + 1.45, .29]              # milkmanDriver in the van seat (DRIVER_NOTE: seat .95 - hip_up .662)
CAB = [TXH - 2.30, TY - .42, .42]                        # scepticDriver in the truck's driver seat (DRIVER_NOTE proof z .42)
OUT = [23.8, -3.3, 0.0]                                  # the Milkman (standing puppet), climbed out, in front of the truck's nose

acts = [
    dict(who='milkmanDriver', at=474, pos=DRV(VY0), view='34', dir=1, pose=M('mk_van'), face='k:concentrate', note='row 14: careful, creeping to the white bar'),
    dict(who='milkmanDriver', at=474, pos=DRV(VY1), move_s=1.0, linear=True, note='the van creeps to the bar (s3_crossing.js VY, f475-505)'),
    dict(who='milkmanDriver', at=511, dir=-1, note='row 14 "dusk": the long look LEFT'),
    dict(who='milkmanDriver', at=530, dir=1, note='row 15 "red": the long look RIGHT, at the dark truck'),
    dict(who='milkmanDriver', at=553, pos=DRV(VY2), move_s=0.5, linear=True, note='row 15 "kept": nod, the van rolls (f554-569)'),
    dict(who='milkmanDriver', at=567, face='k:frozenWide', note='row 16 "hit": frozen wide eyes (approved faces_ep)'),
    dict(who='milkmanDriver', at=588, face='k:holdBreath', note='row 16 after "crossings": holdBreath, then checks the bottle (591)'),
    dict(who='milkmanDriver', at=636, face='k:surprised', note='row 18 "flashing": looks up at the beacons, lost'),
    dict(who='milkmanDriver', at=662, visible=False, note='climbs out (22.3 s): swap to the standing puppet'),
    dict(who='milkman', at=474, visible=False, pos=OUT, view='34', dir=-1, pose=M('mk_out'), face='k:concentrate'),
    dict(who='milkman', at=662, visible=True, pose=M('mk_out'), note='row 19: small in front of the huge truck, cap askew'),
    dict(who='milkman', at=690, face='k:nervousSmile', note='row 19 "said": turns to the lens, draws breath'),
    dict(who='milkman', at=718, face='k:nervousSmile', say=[72, 75], note='rows 20-21: "I never saw it!" lip sync 24.02-25.50'),
    dict(who='milkman', at=755, face='k:frozenWide', note='row 21 "it": the double take up the truck'),
    dict(who='sceptic', at=474, visible=False, pos=CAB, view='34', dir=-1, pose=M('sc_cab'), face='k:concentrate'),
    dict(who='sceptic', at=566, visible=True, pose=M('sc_cab'), note='row 16: at the wheel of the stopped truck (hidden while it races: far, small, inside a dark cab)'),
    dict(who='sceptic', at=572, face='k:browUp', note='rows 16-21: one brow, unimpressed'),
]
held3d = [dict(who='milkmanDriver', obj='milk_bottle', module='sets/assets.js', builder='buildMilkBottle', opts={}, grip='pole', face='out', hand='L', anchor='grip', when='always', scale=1.6),
          dict(who='milkman', obj='milk_bottle', module='sets/assets.js', builder='buildMilkBottle', opts={}, grip='pole', face='out', hand='L', anchor='grip', when='always', scale=1.6)]

def st(at, pos, aim, lens, subject, framing, purpose, hold=0.0, creep=0.0028, **kw):
    return dict(at=at, pos=pos, aim=aim, lens=lens, subject=subject, framing=framing, purpose=purpose, hold=hold, creep=creep, **kw)

stations = [
    st(474, [20.5, -5.1, 1.3], [58.0, -4.0, 1.7], 50, 'truck', 'P', 'ROW 14 in (piece 11 match on the hero object): the real red pumper racing west down the long dark stretch of Main, seen from the corner on a long lens, dull and heavy; the lens widens onto the van', hold=0),
    st(508, [20.4, -5.0, 1.25], [30.0, -9.0, 1.15], 19, 'milkmanDriver', 'M', 'ROWS 14-15 (M00 living rest): the Milkman at the wheel of the van stopped on the white bar, looks left on "dusk", right on "red"; the truck far and dull down Main', hold=0.8),
    st(580, [22.7, -3.4, 0.85], [24.7, -5.6, 1.05], 22, 'bumpers', 'M', 'ROW 16 POWER 2 "hit" + "crossings" (lands low on the bump, then RESTS): the two bumpers, the hubcap past the lens, the Milkman frozen behind his windscreen, then the bottle check', hold=0.35),
    st(640, [20.9, -2.4, 1.5], [25.2, -5.1, 2.15], 18, 'milkmanDriver', 'M', 'ROWS 17-18 (the rise lands on a picture of both): the four sirens with sound rings and the beacon row at the top, the Milkman small behind his windscreen at the bottom, looking up', hold=0.4),
    st(694, [21.9, -1.8, 0.55], [24.6, -4.0, 1.2], 24, 'milkman', 'W', 'ROWS 19-20 (low angle, living rest): the Milkman small in front of the huge truck nose, the Sceptic at the wheel behind the windscreen; "I never saw it" arms wide, eyes to the lens', hold=0.7),
    st(752, [23.0, -1.9, 0.2], [25.3, -4.4, 3.3], 16, 'truck', 'W', 'ROW 21 EXTREME "it" (the tilt lands on the word): low and wide, the truck he never saw fills the frame and goes out of the top', hold=0.5),
]
props = {
    'truck': dict(pos=[TXH, TY, 1.4], kind='the red pumper at dusk'),
    'bumpers': dict(pos=[TXH - 3.8, TY - .9, .75], kind='the truck bumper on the van front corner'),
    'sirens': dict(pos=[TXH - 2.53, TY, 2.55], kind='the four chrome sirens'),
    'beacons': dict(pos=[TXH - 1.42, TY, 2.72], kind='the beacon row'),
}
place = dict(set='s3_crossing', lite=True, kind='du', light='golden', light_over=meta['light']['du'], kit3d=dict(envGround='#5a4a66'), grass_keep=0.4)
film = {
    'title': 'Why Fire Trucks Turned Yellow, S3 THE CROSSING AT DUSK (lines 5-6, frames 474-770)',
    'fps': 30, 'size': [1080, 1920], 'words': 'voice/words.json', 'start': 474, 'end': 771,
    'camera': {'v2': True}, 'camsafe': True, 'kit3d': {'pbr': True, 'relief': True, 'sky': True, 'trees': False},
    'tween': {'frames': 0, 'face_frames': 0, 'ones': True}, 'auto_view': False,
    'puppet_pkg': ['moves', '.', 'cast', '../../../templates/vector2d_characters/code'],
    'cast': cast, 'faces_ep': keys['faces_ep'], 'face_shadow': True,
    'costume_shade': dict(keys['costume_shade'], keep_drawn_light=True, smooth=40),
    'card_shade': dict(keys['card_shade'], amount=0, rim_amount=0),
    'post': {'dof': 0.0, 'dust': 0.5, 'bloom': 1, 'vignette': 0},
    'places': {'crossing': place}, 'props': props, 'acts': acts, 'held3d': held3d,
    'kicks': [{'at': 569, 'amp': 3}],
    'fx': [dict(at=569, kind='glint', pos=[TXH - 3.85, TY - .9, .75], note='row 16 "hit": a white spark at the bumper contact'),
           dict(at=613, kind='glint', pos=[TXH - 2.53, TY - .78, 2.6], note='row 17 "screaming": the chrome siren catches the apricot band')],
    'moods': [dict(at=511, look='dark_dip', note='row 14 "dusk": the light sinks a step'), dict(at=569, look='flash_white', note='row 16: POWER 2 impact (with the set impact frame)'),
              dict(at=613, look='warm_glow', note='row 17: the apricot band flares on the sirens'), dict(at=643, look='spot', note='row 18: the beacon pulse'),
              dict(at=721, look='warm', note='row 20 "I": the street lamp warms his face')],
    'takes': [{'id': 's3', 'place': 'crossing', 'stations': stations}],
}
json.dump(film, open(os.path.join(HERE, 'film.json'), 'w'), indent=1)
print('film.json written:', len(acts), 'acts,', len(stations), 'stations')
