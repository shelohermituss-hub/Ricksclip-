"""still_ship.py: blender -b out/ship.blend -P scripts/still_ship.py -- f40 f600 ...   (cams + states from params_ship.json "cams"/"proofs"; 540x960, 16 samples + OIDN)
A proof may give "earth_screen": [sx, sy, dist, ang_deg]: the Earth centre is put on the camera ray (sx, sy in half-frame units, linear in angle) at dist m,
with an angular radius ang_deg. Env: SPP (samples), PCT (resolution percent). Stills -> out/stills/ship_<key>.png"""
import bpy, sys, os, json, math
from mathutils import Vector, Matrix
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import ship_api as api
P = json.load(open(os.path.join(HERE, '..', 'params_ship.json'))); keys = sys.argv[sys.argv.index('--') + 1:] or list(P['proofs'])
sc = bpy.context.scene; cam = bpy.data.objects.get('cam_still')
if not cam: cam = bpy.data.objects.new('cam_still', bpy.data.cameras.new('cam_still')); sc.collection.objects.link(cam)
sc.camera = cam; cam.data.sensor_fit = 'VERTICAL'; cam.data.sensor_height = 36; cam.data.clip_start = .02; cam.data.clip_end = 60000
sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = 540, 960, int(os.environ.get('PCT', 100))
sc.cycles.samples = int(os.environ.get('SPP', 16)); sc.cycles.use_denoising = True; sc.cycles.denoiser = 'OPENIMAGEDENOISE'; sc.view_settings.view_transform = 'Standard'
os.makedirs(os.path.join(HERE, '..', 'out', 'stills'), exist_ok=True)
for k in keys:
    c = P['cams'][k]; st = dict(P['proofs'][k]); es = st.pop('earth_screen', None)
    d = Vector(c['look']) - Vector(c['loc']); q = d.to_track_quat('-Z', 'Y'); cam.rotation_mode = 'XYZ'; cam.location = c['loc']; cam.rotation_euler = q.to_euler()
    cam.rotation_euler.rotate_axis('Z', math.radians(c.get('roll', 0))); cam.data.lens = 18 / math.tan(math.radians(c['vfov']) / 2)
    if es:
        sx, sy, dist, ang = es; vh = math.radians(c['vfov']) / 2; hh = math.atan(math.tan(vh) * 540 / 960); bpy.context.view_layer.update()
        R3 = cam.matrix_world.to_3x3(); f, rt, up = R3 @ Vector((0, 0, -1)), R3 @ Vector((1, 0, 0)), R3 @ Vector((0, 1, 0))
        dv = (Matrix.Rotation(sy * vh, 3, rt) @ Matrix.Rotation(-sx * hh, 3, up) @ f).normalized()
        p = Vector(c['loc']) + dv * dist; st['earth'] = [p.x, p.y, p.z, dist * math.sin(math.radians(ang))]
    api.set_state(sc, **st)
    sc.render.filepath = os.path.join(HERE, '..', 'out', 'stills', 'ship_%s.png' % k); bpy.ops.render.render(write_still=True); print('STILL', k)
