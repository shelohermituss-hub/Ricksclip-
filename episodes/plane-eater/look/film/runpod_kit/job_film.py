"""job_film.py (runs INSIDE Blender on the render machine) for one plane-eater stretch package (look/film/film_lock.py package):
GPU device (OptiX, then CUDA; no GPU = exit 3, never a silent CPU render), then every frame of the range: Cycles beauty, cast mask (compositor
File Output), thin-outline id pass (lines_key.py, lists in the .blend text RICK_LINES). Frames already on disk are skipped (a pod can restart).
  blender -b scene.blend --python job_film.py -- <first> <last> [step]     env PCT, SPP (tests); ALLOW_CPU=1 only for the packing test without a GPU."""
import bpy, os, sys, time, json
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import lines_key as LK
A = sys.argv[sys.argv.index('--') + 1:]; F0, F1 = int(A[0]), int(A[1]); STEP = int(A[2]) if len(A) > 2 else 1
sc = bpy.context.scene; r = sc.render; p = bpy.context.preferences.addons['cycles'].preferences; dev = None
for t in ('OPTIX', 'CUDA'):
    try:
        p.compute_device_type = t; p.get_devices(); ok = [d for d in p.devices if d.type == t]
    except Exception as e:
        print('no', t, e); continue
    if ok:
        for d in p.devices: d.use = d.type == t
        sc.cycles.device = 'GPU'; dev = t; print('DEVICE', t, [d.name for d in ok], flush=True); break
if dev is None:
    if os.environ.get('ALLOW_CPU') == '1': sc.cycles.device = 'CPU'; print('DEVICE CPU (ALLOW_CPU=1: packing test only)', flush=True)
    else: print('NO_GPU: neither OPTIX nor CUDA found. Stop: no CPU fallback (REGLES_METHODE 2).', flush=True); sys.exit(3)
# speed (lead 2026-11-22, target <= 10 s a frame on a 4090): 720x1280 (render.sh upscales to 1080x1920), adaptive noise .1 / max 48 spp + OIDN,
# 4 bounces, no caustics, textures capped at 2K, camera culling of trees / grass / far set, persistent data across frames
RES = [int(x) for x in os.environ.get('RES', '720x1280').split('x')]
OLD = os.environ.get('SPEED') == '0'   # measuring only: the first package settings (1080x1920, noise .02, 64 spp, scene bounces, no simplify)
r.resolution_x, r.resolution_y = RES; r.resolution_percentage = int(os.environ.get('PCT', 100)); sc.cycles.samples = int(os.environ.get('SPP', 64 if os.environ.get('SPEED') == '0' else 48))
sc.cycles.use_adaptive_sampling = True; sc.cycles.adaptive_threshold = float(os.environ.get('NOISE', .02 if OLD else .1)); sc.cycles.adaptive_min_samples = 8; sc.cycles.use_denoising = True
if OLD: print('SPEED OLD settings', RES, flush=True)
else:
  sc.cycles.max_bounces = 4; sc.cycles.diffuse_bounces = 2; sc.cycles.glossy_bounces = 2; sc.cycles.transmission_bounces = 4; sc.cycles.volume_bounces = 0
  sc.cycles.transparent_max_bounces = 16; sc.cycles.caustics_reflective = False; sc.cycles.caustics_refractive = False; sc.cycles.blur_glossy = 1.0
  r.use_simplify = True; sc.cycles.texture_limit_render = '2048'; sc.cycles.use_camera_cull = True; sc.cycles.camera_cull_margin = .1; r.use_persistent_data = True
CULL = () if OLD else ('tree', 'treeline', 'poplar', 'tufts', 'grass', 'lawn', 'flower', 'daisy', 'fence', 'hill', 'fields', 'runway', 'cloud', 'season_flake')
nc = 0
for o in sc.objects:
    if o.type == 'MESH' and o.name.startswith(CULL):
        try: o.cycles.use_camera_cull = True; nc += 1
        except Exception: pass
print('SPEED', RES, 'noise', sc.cycles.adaptive_threshold, 'culled objects', nc, flush=True)
fo = next(n for n in sc.compositing_node_group.nodes if n.bl_idname == 'CompositorNodeOutputFile')
out = os.path.join(HERE, 'out'); os.makedirs(out, exist_ok=True); T = {}
for f in range(F0, F1 + 1, STEP):
    base = os.path.join(out, 'f_%04d' % f)
    if os.path.exists(base + '_lines_id.png'): continue
    sc.frame_set(f); fo.directory = base + '_'; r.filepath = base + '_raw.png'; r.use_file_extension = False
    t0 = time.time(); bpy.ops.render.render(write_still=True); T[f] = round(time.time() - t0, 2)
    pct = r.resolution_percentage; LK.render(sc, base + '_lines_id.png', int(LK.ID_W * pct / 100), int(LK.ID_H * pct / 100))
    print('FRAME', f, 'RENDER_SECONDS', T[f], flush=True)
json.dump(T, open(os.path.join(out, 'times_%d_%d.json' % (F0, F1)), 'w')); print('JOB_DONE', F0, F1, dev or 'CPU', len(T))
