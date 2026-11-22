"""still_mc.py: blender -b out/mc.blend -P scripts/still_mc.py -- f140 f180 ...   (cams + states from params_mc.json "cams"/"proofs"; 540x960, 16 samples + OIDN)
RES=270 for a quick camera check. Stills -> out/stills/mc_<key>.png"""
import bpy, sys, os, json, math
from mathutils import Vector
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import mc_api as api
P = json.load(open(os.path.join(HERE, '..', 'params_mc.json'))); keys = (sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []) or list(P['proofs'])
sc = bpy.context.scene; cam = bpy.data.objects.get('cam_still')
if not cam: cam = bpy.data.objects.new('cam_still', bpy.data.cameras.new('cam_still')); sc.collection.objects.link(cam)
sc.camera = cam; cam.data.sensor_fit = 'VERTICAL'; cam.data.sensor_height = 36; cam.data.clip_start = .05; cam.data.clip_end = 200
rx = int(os.environ.get('RES', 540)); sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = rx, rx * 16 // 9, 100
sc.cycles.samples = int(os.environ.get('SPP', 16)); sc.cycles.use_denoising = True; sc.cycles.denoiser = 'OPENIMAGEDENOISE'; sc.view_settings.view_transform = 'Standard'
sc.render.threads_mode = 'FIXED'; sc.render.threads = int(os.environ.get('THREADS', 2))
os.makedirs(os.path.join(HERE, '..', 'out', 'stills'), exist_ok=True)
for k in keys:
    c = P['cams'][k]; api.set_state(sc, **P['proofs'][k])
    d = Vector(c['look']) - Vector(c['loc']); q = d.to_track_quat('-Z', 'Y'); cam.rotation_mode = 'XYZ'; cam.location = c['loc']; cam.rotation_euler = q.to_euler()
    cam.rotation_euler.rotate_axis('Z', math.radians(c.get('roll', 0))); cam.data.lens = 18 / math.tan(math.radians(c['vfov']) / 2)
    sc.render.filepath = os.path.join(HERE, '..', 'out', 'stills', 'mc_%s.png' % k); bpy.ops.render.render(write_still=True); print('STILL', k)
