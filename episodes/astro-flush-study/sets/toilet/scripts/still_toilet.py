"""still_toilet.py: blender -b out/toilet.blend -P scripts/still_toilet.py -- f5 f1030 ...   (cams + states from params_toilet.json "cams"/"proofs"; 540x960, 16 samples + OIDN)
Stills -> out/stills/toilet_<key>.png"""
import bpy, sys, os, json, math
from mathutils import Vector
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import toilet_api as api
P = json.load(open(os.path.join(HERE, '..', 'params_toilet.json'))); keys = sys.argv[sys.argv.index('--') + 1:] or list(P['proofs'])
sc = bpy.context.scene; cam = bpy.data.objects.get('cam_still')
if not cam: cam = bpy.data.objects.new('cam_still', bpy.data.cameras.new('cam_still')); sc.collection.objects.link(cam)
sc.camera = cam; cam.data.sensor_fit = 'VERTICAL'; cam.data.sensor_height = 36; cam.data.clip_start = .02; cam.data.clip_end = 200
sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = 540, 960, 100
sc.cycles.samples = int(os.environ.get('SPP', 16)); sc.cycles.use_denoising = True; sc.cycles.denoiser = 'OPENIMAGEDENOISE'; sc.view_settings.view_transform = 'Standard'
os.makedirs(os.path.join(HERE, '..', 'out', 'stills'), exist_ok=True)
for k in keys:
    c = P['cams'][k]; api.set_state(sc, **P['proofs'][k])
    d = Vector(c['look']) - Vector(c['loc']); q = d.to_track_quat('-Z', 'Y'); cam.rotation_mode = 'XYZ'; e = q.to_euler(); cam.location = c['loc']; cam.rotation_euler = e
    cam.rotation_euler.rotate_axis('Z', math.radians(c.get('roll', 0))); cam.data.lens = 18 / math.tan(math.radians(c['vfov']) / 2); cam.data.clip_start = c.get('clip', .02)
    sc.render.filepath = os.path.join(HERE, '..', 'out', 'stills', 'toilet_%s.png' % k); bpy.ops.render.render(write_still=True); print('STILL', k)
