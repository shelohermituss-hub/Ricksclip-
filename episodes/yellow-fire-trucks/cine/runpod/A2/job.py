"""job.py (runs INSIDE Blender on the render machine): GPU device (OptiX, then CUDA; no GPU = exit 3, never a silent CPU render), the Cycles beauty
+ pass_mask (compositor), then the thin-outline id pass (lines_key.py, Workbench, colours and lists stored in the .blend text block RICK_LINES).
  blender -b scene.blend --python job.py -- <NAME>        env PCT, SPP (tests); ALLOW_CPU=1 only for the packing test on a machine without a GPU."""
import bpy, os, sys, time
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import lines_key as LK
NAME = sys.argv[sys.argv.index('--') + 1]; sc = bpy.context.scene; r = sc.render
p = bpy.context.preferences.addons['cycles'].preferences; dev = None
for t in ('OPTIX', 'CUDA'):
    try:
        p.compute_device_type = t; p.get_devices(); ok = [d for d in p.devices if d.type == t]
    except Exception as e:
        print('no', t, e); continue
    if ok:
        for d in p.devices: d.use = d.type == t
        sc.cycles.device = 'GPU'; dev = t; print('DEVICE', t, [d.name for d in ok], flush=True); break
if dev is None:
    if os.environ.get('ALLOW_CPU') == '1':
        sc.cycles.device = 'CPU'; print('DEVICE CPU (ALLOW_CPU=1: packing test only, not a film render)', flush=True)
    else:
        print('NO_GPU: neither OPTIX nor CUDA found. Stop: no CPU fallback (REGLES_METHODE 2).', flush=True); sys.exit(3)
if os.environ.get('PCT'): r.resolution_percentage = int(os.environ['PCT']); print('TEST PCT', os.environ['PCT'])
if os.environ.get('SPP'): sc.cycles.samples = int(os.environ['SPP']); print('TEST SPP', os.environ['SPP'])
out = os.path.join(HERE, 'out'); os.makedirs(out, exist_ok=True)
r.filepath = os.path.join(out, NAME + '_raw.png'); r.use_file_extension = False
t0 = time.time(); bpy.ops.render.render(write_still=True); print('RENDER_SECONDS %.1f' % (time.time() - t0), flush=True)
pct = r.resolution_percentage
LK.render(sc, os.path.join(out, NAME + '_lines_id.png'), int(LK.ID_W * pct / 100), int(LK.ID_H * pct / 100))
print('JOB_DONE', NAME, dev or 'CPU')
