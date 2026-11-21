# kit_films.py: film_<cam>.json for the three.js detail-gate stills of THE MAP (proof/kit). Same cameras as Blender (map_cams.json via cams.py),
# same light numbers (out/map_meta.json light.map = map_api.KIT_LIGHT). PROOF ONLY: the film's own film.json takes the place block from here.
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE); import cams as CA
KD = os.path.join(HERE, '..', 'proof', 'kit'); META = json.load(open(os.path.join(HERE, '..', 'out', 'map_meta.json')))
W, H = (int(sys.argv[1]), int(sys.argv[2])) if len(sys.argv) > 2 else (540, 960); names = []
for cam, c in CA.cams(META).items():
    place = dict(set='map', light='morning', light_over=META['light']['map'], kit3d=dict(envGround='#7a5634'), paint='wave' if c.get('doors_t') is not None else 'lime')
    if c.get('doors_t') is not None: place['doors'] = dict(at=-c['doors_t'], wave=2.4, dur=.5)   # at film time 0 the wave stands where Blender's still is
    st = dict(at=0, subject='map', framing='W', hold=0, pos=c['pos'], aim=c['aim'], lens=c['lens'])
    film = dict(title='map proof %s' % cam, fps=30, size=[W, H], words='words.json', end=2, tween=dict(frames=0, face_frames=0, ones=True), auto_view=False,
        cast=dict(fireman=dict(puppet='cast:firefighter', height=1.75, heads_tall=2.9, walk_speed=9999)),
        kit3d=dict(pbr=True, relief=True, sky=True, trees=False), post=dict(dof=0.0, dust=0, bloom=1, vignette=0),
        places=dict(map=place), props=dict(map=dict(pos=c['aim'], kind='the map')),
        acts=[dict(who='fireman', at=0, pos=[200, 200, 0], view='34', dir=-1, pose='stand', face='cool')],
        takes=[dict(id=cam, place='map', stations=[st])])
    json.dump(film, open(os.path.join(KD, 'film_%s.json' % cam), 'w'), indent=1); names.append(cam)
print(' '.join(names))
