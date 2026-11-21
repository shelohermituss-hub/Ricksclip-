# kit_films.py: film_<tile>.json for the three.js kit stills of the lamp room (PROOF ONLY; the film's own film.json takes the place block from here).
# Same cameras as Blender (out/lamproom_meta.json cams), same states (wave, iris). Prints the tile names.
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); KD = os.path.join(HERE, '..', 'proof', 'kit'); META = json.load(open(os.path.join(HERE, '..', 'out', 'lamproom_meta.json')))
W, H = (int(sys.argv[1]), int(sys.argv[2])) if len(sys.argv) > 2 else (540, 960)
TILES = dict(allon=('CAM_ROOM', 0, 0), redoff=('CAM_ROOM', 4, 0), irisopen=('CAM_ROOM', 4, 1), entry=('CAM_ENTRY', 0, 0), exit=('CAM_EXIT', 4, 1))   # FIX 2: exit = the window edge check
LIGHT_OVER = dict(top='#120c24', hor='#1c1438', sun='#b8a8ff', si=.12, amb='#2a1d52', ai=.35, tint='#ffffff')
names = []
for t, (cam, wave, iris) in TILES.items():
    c = META['cams'][cam]
    place = dict(set='lamproom', light='night', light_over=LIGHT_OVER, lamproom=dict(wave=wave, iris=iris, dim=1), kit3d=dict(envGround='#1c1438'))
    st = dict(at=0, subject='eye', framing='W', hold=0, pos=c['pos'], aim=c['aim'], lens=c['lens'])
    film = dict(title='lamproom proof %s' % t, fps=30, size=[W, H], words='words.json', end=2, tween=dict(frames=0, face_frames=0, ones=True), auto_view=False,
        cast=dict(fireman=dict(puppet='cast:firefighter', height=1.75, heads_tall=2.9, walk_speed=9999)),
        kit3d=dict(pbr=True, relief=False, sky=False, trees=False), post=dict(dof=0.0, dust=0, bloom=1, vignette=0),
        places=dict(eye=place), props=dict(eye=dict(pos=c['aim'], kind='the lamp room')),
        acts=[dict(who='fireman', at=0, pos=[200, 200, 0], view='34', dir=-1, pose='stand', face='cool')],
        takes=[dict(id='lr_%s' % t, place='eye', stations=[st])])
    json.dump(film, open(os.path.join(KD, 'film_%s.json' % t), 'w'), indent=1); names.append(t)
print(' '.join(names))
