"""make_film.py: writes s3/film.json for S3 THE X-RAY (PICTURE_PLAN rows 19-22, film 17.30-21.28 s = frames 519-638). S3 stretch builder 2026-11-22.
Edit this file, not film.json. Positions are plan metres (Z up) in sets/xray (clinic at the origin, the X-ray world at X0 = (30, 0, 0)), see sets/xray/out/xray_meta.json."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
EP = os.path.join(HERE, '..')
keys = json.load(open(os.path.join(EP, 'cast', 'CAST_KEYS.json')))
meta = json.load(open(os.path.join(EP, 'sets', 'xray', 'out', 'xray_meta.json')))
A, C = meta['anchors'], meta['cams']
cast = {'doctor': dict(keys['cast']['doctor'], walk_speed=99)}
M = lambda k: 'm:../../ep_s3/' + k
FILM = A['film_hero']['c']                                   # (0.11, 2.085, 1.47): the signature film on panel 1
DOC = [-0.22, 1.30, 0.0]                                     # beside the light box, left of the film, close enough for his hand on the clip bar
P = meta['slide_path']
def along(u):
    n = len(P) - 1; f = min(max(u, 0), 1) * n; i = min(int(f), n - 1); k = f - i
    return [round(P[i][j] + (P[i + 1][j] - P[i][j]) * k, 3) for j in range(3)]

acts = [
    dict(who='doctor', at=519, pos=DOC, view='34', dir=-1, pose=M('dr_lean'), face='k:browUp', look=FILM, note='row 19 "x -RAYED": hand on the clip bar, the box flickers, he leans in'),
    dict(who='doctor', at=541, face='k:think', look=FILM, note='row 19 "and": pushes the half-moon glasses down his nose'),
    dict(who='doctor', at=550, face='k:surprised', look=FILM, note='row 19 "found": a jolt back, he sees the tiny plane'),
    dict(who='doctor', at=562, face='k:shocked', look=FILM, note='row 20 "stomach": eyes wide as the camera goes into the film'),
    dict(who='doctor', at=563, visible=False, note='the camera is inside the film from here (he is behind the lens); row 23 (next stretch) brings him back on the double take'),
]

def st(at, pos, aim, lens, subject, framing, purpose, hold=0.0, creep=0.0028, **kw):
    return dict(at=at, pos=pos, aim=aim, lens=lens, subject=subject, framing=framing, purpose=purpose, hold=hold, creep=creep, **kw)

sm = lambda f: (lambda u: u * u * (3 - 2 * u))(min(1, max(0, (f - 618) / 42)))
r26, r38 = along(sm(624)), along(sm(638))
clinic = [
    st(519, [1.05, -0.95, 1.38], [-0.22, 1.70, 1.18], 18, 'doctor', 'W', 'ROW 19 "x -RAYED" (ACT + SIGNATURE, M00 living rest then M02 push in): the doctor in 3/4 at the left leaning in to the glowing film, his hand on the clip bar; the film with the tiny bite-Cessna big at the right; the box flickers twice', hold=0.7, shows=['film']),
    st(558, [0.32, 0.45, 1.50], [-0.16, 2.05, 1.38], 22, 'doctor', 'M', 'ROW 19 "found a" (push in over the doctor\'s shoulder): the film fills most of the frame, the Cessna of square bites and F-MIAM readable, his glasses and clip hand at the left edge', hold=0.0, shows=['film']),
    st(573, [0.11, 1.80, 1.47], [0.11, 2.20, 1.47], 26, 'film', 'C', 'ROW 20 "STOMACH" (M07 fly into the object): the film fills the lens, the cut into the X-ray world sits on the film grain', hold=0.0, shows=['film']),
]
inside = [
    st(574, [28.55, -3.75, 1.05], [30.55, -0.25, -1.75], 20, 'lining', 'W', 'ROW 20 "STOMACH lining" (IMPOSSIBLE VIEW, M07 continued, eased): we come out of the film into the cartoon X-ray world: cyan ribs and spine as bands on mid-blue, the bean stomach, the tiny Cessna parked at the top of the lining', hold=0.0, shows=['lining', 'mini']),
    st(592, [30.20, -1.25, -2.15], [30.90, -0.10, -2.85], 22, 'lining', 'C', 'ROW 21 "so THICK" (POWER 2 + EXTREME 1, M02 push in to land): the lining PUFFS into a quilted mattress with runway dashes, cyan-white flash, then steady glow', hold=0.5, shows=['lining']),
    st(622, [29.25, -2.15, -1.45], [29.0, -0.2, -2.4], 24, 'mini', 'C', 'ROW 22 "SLID" (SIGNATURE peak, M14 ride with the moving thing): the bite-Cessna at the lens, navy stripe, propeller humming, it starts down the runway', hold=0.0, shows=['mini']),
    st(638, [29.7, -1.95, -1.5], [29.65, -0.2, -2.5], 24, 'mini', 'C', 'ROW 22 "through" (M14 ride, the camera rides with it): the plane slides along the oily lining, the sparkle trail behind it; the ride continues into the next stretch', hold=0.0, shows=['mini']),
]
props = {
    'film': dict(pos=FILM, kind='the signature X-ray film: a tiny Cessna built of square bites inside the belly'),
    'mini': dict(pos=P[0], kind='the mini bite-Cessna'),
    'lining': dict(pos=[30.6, -0.2, -2.6], kind='the stomach lining / mattress'),
}
xr = dict(keys=[dict(f=505, flicker=1, puff=0), dict(f=519, flicker=1), dict(f=521, flicker=0), dict(f=524, flicker=.85), dict(f=527, flicker=0),
                dict(f=584, puff=0), dict(f=593, puff=1), dict(f=618, puff=1, ride=0), dict(f=660, puff=1, ride=1)])
place = dict(set='xray', kind='am', light='day', xray=xr, kit3d=dict(envGround='#a9c4bd'))
film = {
    'title': 'The Man Who Ate An Airplane, S3 THE X-RAY (line 5, rows 19-22, frames 519-638), DRAFT',
    'fps': 30, 'size': [1080, 1920], 'words': 'voice/words.json', 'start': 519, 'end': 639,
    'camera': {'v2': True}, 'camsafe': True, 'kit3d': {'pbr': True, 'relief': True, 'sky': False, 'trees': False},
    'tween': {'frames': 0, 'face_frames': 0, 'ones': True}, 'auto_view': False,
    'puppet_pkg': ['moves', '.', 'cast', '../../../templates/vector2d_characters/code'],
    'cast': cast, 'face_shadow': True,
    'costume_shade': dict(keys['costume_shade'], keep_drawn_light=True, smooth=40),
    'card_shade': dict(keys['card_shade'], amount=0, rim_amount=0),
    'post': {'dof': 0.0, 'dust': 0.3, 'bloom': 0.5, 'vignette': 0},
    'places': {'xray': place}, 'props': props, 'acts': acts,
    'kicks': [{'at': 592, 'amp': 2}],
    'fx': [dict(at=528, kind='glint', pos=[FILM[0] + .05, FILM[1] - .02, FILM[2] + .05], note='row 19 "-rayed": a glint runs over the tiny Cessna on the film'),
           dict(at=592, kind='glow', pos=[30.6, -0.2, -2.55], note='row 21 THICK: the lining glows as it puffs'),
           dict(at=630, kind='shine', pos=along(sm(628) - .03), note='row 22: oil sparkle behind the sliding plane'),
           dict(at=636, kind='shine', pos=along(sm(634) - .03), note='row 22: oil sparkle trail')],
    'moods': [dict(at=573, look='cold_blue', note='row 20: the cut into the X-ray world rides a cyan-blue wash'),
              dict(at=592, look='flash_white', note='row 21 POWER 2 cyan-white flash on THICK')],
    'takes': [{'id': 'clinic', 'place': 'xray', 'stations': clinic}, {'id': 'inside', 'place': 'xray', 'stations': inside}],
}
json.dump(film, open(os.path.join(HERE, 'film.json'), 'w'), indent=1)
print('film.json written:', len(acts), 'acts,', len(clinic) + len(inside), 'stations')
