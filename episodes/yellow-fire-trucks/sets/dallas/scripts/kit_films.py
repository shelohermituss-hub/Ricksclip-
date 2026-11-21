# kit_films.py: film_<cam>.json for the three.js detail-gate stills of the Dallas yard (proof/kit). Same cameras as Blender (dallas_cams.json), the same light
# numbers (out/dallas_meta.json light.no = dallas_api.KIT_LIGHT). PROOF ONLY: the film's own film.json takes the place block from here. LITE=1 -> the lite copy.
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); KD = os.path.join(HERE, '..', 'proof', 'kit')
CAMS = json.load(open(os.path.join(HERE, 'dallas_cams.json'))); META = json.load(open(os.path.join(HERE, '..', 'out', 'dallas_meta.json')))
W, H = (int(sys.argv[1]), int(sys.argv[2])) if len(sys.argv) > 2 else (540, 960); LITE = os.environ.get('LITE', '1') == '1'
names = []
for cam, c in CAMS.items():
    place = dict(set='dallas', kind='no', light='day', light_over=META['light']['no'], lite=LITE, kit3d=dict(envGround='#cdb690'))
    if c.get('boards'): place['boards'] = c['boards']
    if c.get('card'): place['card'] = dict(c['card'], face=c['pos'][:2])
    st = dict(at=0, subject='dallas', framing='W', hold=0, pos=c['pos'], aim=c['aim'], lens=c['lens'])
    film = dict(title='dallas proof %s' % cam, fps=30, size=[W, H], words='words.json', end=2, tween=dict(frames=0, face_frames=0, ones=True), auto_view=False,
        cast=dict(fireman=dict(puppet='cast:firefighter', height=1.75, heads_tall=2.9, walk_speed=9999)),
        kit3d=dict(pbr=True, relief=True, sky=True, trees=False), post=dict(dof=0.0, dust=0, bloom=1, vignette=0),
        places=dict(dallas=place), props=dict(dallas=dict(pos=c['aim'], kind='the Dallas yard')),
        acts=[dict(who='fireman', at=0, pos=[200, 200, 0], view='34', dir=-1, pose='stand', face='cool')],
        takes=[dict(id=cam, place='dallas', stations=[st])])
    n = 'film_%s.json' % cam; json.dump(film, open(os.path.join(KD, n), 'w'), indent=1); names.append(cam)
print(' '.join(names))
