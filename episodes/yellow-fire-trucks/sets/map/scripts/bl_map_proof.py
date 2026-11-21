# bl_map_proof.py: detail-gate stills of THE MAP in Blender (Cycles CPU 16 spp + OIDN, Standard view, 540x960; single frames only).
# blender -b out/map.blend --python bl_map_proof.py -- <out dir> [w h] [cams comma list]
import bpy, sys, os, json, time
from mathutils import Vector
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE); import map_api as MA, cams as CA
a = sys.argv[sys.argv.index('--') + 1:]; OUTD = a[0]; W, H = (int(a[1]), int(a[2])) if len(a) > 2 else (540, 960); os.makedirs(OUTD, exist_ok=True)
META = json.load(open(os.path.join(HERE, '..', 'out', 'map_meta.json'))); CAMS = CA.cams(META); want = a[3].split(',') if len(a) > 3 else list(CAMS)
sc = bpy.context.scene; r = sc.render; r.resolution_x, r.resolution_y, r.resolution_percentage = W, H, 100; r.image_settings.file_format = 'PNG'
sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'None'; r.engine = 'CYCLES'; sc.cycles.device = 'CPU'
sc.cycles.samples = 16; sc.cycles.use_denoising = True; sc.cycles.denoiser = 'OPENIMAGEDENOISE'; sc.cycles.max_bounces = 4
times = {}
for name in want:
    c = CAMS[name]; co = bpy.data.objects.get('cam') or bpy.data.objects.new('cam', bpy.data.cameras.new('cam'))
    if co.name not in sc.collection.objects: sc.collection.objects.link(co)
    co.data.sensor_fit = 'VERTICAL'; co.data.sensor_height = 36; co.data.lens = c['lens']; co.data.clip_start = .02; co.data.clip_end = 500
    co.location = c['pos']; co.rotation_euler = (Vector(c['aim']) - Vector(c['pos'])).to_track_quat('-Z', 'Y').to_euler(); sc.camera = co
    if c.get('doors_t') is not None: MA.set_doors(sc, c['doors_t']); MA.set_paint(sc, t=c['doors_t'] - .3)
    else: MA.set_doors(sc, 99.); MA.set_paint(sc, lime=True)
    r.filepath = os.path.join(OUTD, 'bl_%s.png' % name); t0 = time.time(); bpy.ops.render.render(write_still=True)
    times[name] = round(time.time() - t0, 1); print('PROOF bl_%s RENDER_SECONDS %.1f' % (name, times[name]), flush=True)
json.dump(times, open(os.path.join(OUTD, 'bl_times.json'), 'w')); print('BL_PROOF_END')
