# pe_proof.py: light previews of a plane-eater set (540x960, Cycles 16 spp + OIDN, Standard). No date or time in any image.
# blender -b <set.blend> --python pe_proof.py -- <out dir> "name:CAM:opts;name2:CAM2:opts"   opts = key=val|key=val
#   key puff=0..1 (every shape key named 'puff'), hide=obj+obj, show=obj+obj, ride=0..1 (mini Cessna along meta slide_path)
import bpy, sys, os, time, json
from mathutils import Vector
a = sys.argv[sys.argv.index('--') + 1:]; OUT = a[0]; os.makedirs(OUT, exist_ok=True); sc = bpy.context.scene
sc.cycles.samples = int(os.environ.get('SPP', 16)); sc.cycles.time_limit = float(os.environ.get('TL', 90))
tf = os.path.join(OUT, 'bl_times.json'); times = json.load(open(tf)) if os.path.exists(tf) else {}
base_vis = {o.name: o.hide_render for o in sc.objects}
for t in a[1].split(';'):
    name, cam, opts = (t.split(':') + [''])[:3]
    for o in sc.objects: o.hide_render = base_vis[o.name]
    for kv in filter(None, opts.split('|')):
        k, v = kv.split('=')
        if k == 'puff':
            for o in sc.objects:
                if o.type == 'MESH' and o.data.shape_keys and 'puff' in o.data.shape_keys.key_blocks: o.data.shape_keys.key_blocks['puff'].value = float(v)
        elif k in ('hide', 'show'):
            for n in v.split('+'):
                if n in bpy.data.objects: bpy.data.objects[n].hide_render = (k == 'hide')
        elif k == 'ride':
            meta = json.load(open(os.path.join(os.path.dirname(bpy.data.filepath), 'xray_meta.json'))); P = [Vector(p) for p in meta['slide_path']]
            f = float(v) * (len(P) - 2); i = min(int(f), len(P) - 3); u = f - i; mc = bpy.data.objects['xw_mini_cessna']
            mc.location = P[i].lerp(P[i + 1], u)
    sc.camera = bpy.data.objects[cam]
    sc.render.filepath = os.path.join(OUT, 'bl_%s.png' % name); t0 = time.time(); bpy.ops.render.render(write_still=True)
    times[name] = round(time.time() - t0, 1); print('PROOF', name, 'RENDER_SECONDS', times[name], flush=True)
    json.dump(times, open(tf, 'w'), indent=1)
print('BL_PROOF_END')
