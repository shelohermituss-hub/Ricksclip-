# look_xray.py: LOOK CARD frame B = PICTURE_PLAN rows 19-20 start (the push-in over the Doctor's shoulder; look-finisher, 2026-11-21).
#   blender -b episodes/plane-eater/sets/xray/out/xray.blend --python episodes/plane-eater/look/look_xray.py -- <info|preview> [out.png]
#   env: W H SPP, CAM AIM LENS, HT (the Doctor's fist target on the film edge), THREADS
# Set (set-builder xray.blend: clinic corner, light box with the hero film = tiny bite-Cessna in the X-ray belly, its own clinic light).
# THE DOCTOR from behind, close on the left (over the shoulder), his fist pressing the film's left edge into the light-box clip.
import bpy, sys, os, json, math
from mathutils import Vector
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import pe_look as PL
args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else ['info']
MODE = args[0]; OUT = args[1] if len(args) > 1 else os.path.join(HERE, 'prev', 'B_raw.png')
ev = lambda k, d: [float(x) for x in os.environ.get(k, d).split(',')]
sc = bpy.context.scene
print('LIGHTS', [(o.name, o.data.type, round(o.data.energy, 1), [round(x, 2) for x in o.location]) for o in sc.objects if o.type == 'LIGHT'])
print('EXPO', sc.view_settings.view_transform, sc.view_settings.exposure, 'world', sc.world.name if sc.world else None)
CAM = Vector(ev('CAM', '-0.30,0.75,1.36')); AIM = ev('AIM', '0.16,2.2,1.42'); LENS = float(os.environ.get('LENS', '30'))
cam = PL.camera(sc, CAM, AIM, LENS)
sc.view_settings.exposure = float(os.environ.get('EXPO', '-0.35'))
win = Vector((-1.0, -0.15, 0.35)).normalized()                   # toward the window wall (x -2.2): the key the shadow card faces
HT = Vector(ev('HT', '0.30,2.02,1.40'))                        # the film's left edge (film centre x .11, w .4), at the Doctor's fist height
loc = PL.place_card_hand('doctor_clipM', 'R', HT, CAM); loc.z = 0
EX = sc.view_settings.exposure
doc = PL.add_card(sc, 'doctor_clipM', loc, CAM, (win.x, win.y), strength=float(os.environ.get('CARDS', 2 ** (-EX))))
PL.contact(sc, loc, .38, .75, name='doctor')
NOLINE = ('floor', 'lino', 'wall', 'ceil', 'glass', 'win_', 'CARD_', 'SHADOWCARD_', 'CONTACT_', 'contact', 'xw_', 'backdrop', 'film_', 'lightbox_panel', 'sky')
LINES = [o for o in sc.objects if o.type == 'MESH' and o.visible_get() and not o.hide_render and not o.name.startswith(NOLINE) and o.location.x < 20]
fo = PL.render_setup(sc, int(os.environ.get('W', 540)), int(os.environ.get('H', 960)), int(os.environ.get('SPP', 24)), bounces=6)
bpy.context.view_layer.update()
info = dict(cam=list(CAM), aim=AIM, lens=LENS, doctor_foot=[round(x, 2) for x in loc], exposure=EX,
            scr=dict(doctor_foot=PL.screen(sc, loc), doctor_head=PL.screen(sc, loc + Vector((0, 0, 1.64))), fist=PL.screen(sc, HT),
                     film_c=PL.screen(sc, (0.11, 2.085, 1.47)), film_tr=PL.screen(sc, (0.31, 2.085, 1.72)), film_bl=PL.screen(sc, (-0.09, 2.085, 1.22))),
            down_angle_deg=dict(doctor=PL.down_angle(sc, doc)), lines=len(LINES))
print('INFO', json.dumps(info), flush=True); json.dump(info, open(os.path.join(HERE, 'prev', 'B_info.json'), 'w'), indent=1)
if MODE == 'preview': PL.go(sc, OUT, fo, LINES)
