# kit_films.py: film_<kind>_<cam>.json for the three.js detail-gate stills of the town (proof/kit). Same cameras as Blender (town_cams.json),
# same light numbers (out/town_meta.json light = town_api.KIT_LIGHT). PROOF ONLY: the film's own film.json takes the place block from here.
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); KD = os.path.join(HERE, '..', 'proof', 'kit')
CAMS = json.load(open(os.path.join(HERE, 'town_cams.json'))); META = json.load(open(os.path.join(HERE, '..', 'out', 'town_meta.json')))
W, H = (int(sys.argv[1]), int(sys.argv[2])) if len(sys.argv) > 2 else (540, 960)
names = []
for kind in ('am', 'du'):
    for cam, c in CAMS.items():
        place = dict(set='town', kind=kind, light='morning' if kind == 'am' else 'golden', light_over=META['light'][kind], kit3d=dict(envGround='#8f8a7e' if kind == 'am' else '#5a4a66'))
        if c.get('card'): place['card'] = dict(c['card'], face=c['pos'][:2])
        st = dict(at=0, subject='town', framing='W', hold=0, pos=c['pos'], aim=c['aim'], lens=c['lens'])
        film = dict(title='town proof %s %s' % (kind, cam), fps=30, size=[W, H], words='words.json', end=2, tween=dict(frames=0, face_frames=0, ones=True), auto_view=False,
            cast=dict(fireman=dict(puppet='cast:firefighter', height=1.75, heads_tall=2.9, walk_speed=9999)),
            kit3d=dict(pbr=True, relief=True, sky=True, trees=False), post=dict(dof=0.0, dust=0, bloom=1, vignette=0),
            places=dict(town=place), props=dict(town=dict(pos=c['aim'], kind='the town')),
            acts=[dict(who='fireman', at=0, pos=[200, 200, 0], view='34', dir=-1, pose='stand', face='cool')],
            takes=[dict(id='%s_%s' % (kind, cam), place='town', stations=[st])])
        n = 'film_%s_%s.json' % (kind, cam); json.dump(film, open(os.path.join(KD, n), 'w'), indent=1); names.append(n[5:-5])
print(' '.join(names))
