"""final/job/lines_wb2.py: (keyframed version: ONE animation render per run of frames, so the scene is uploaded once, not per frame)
final/job/lines_wb.py: FAST outline source (Workbench, about 1-3 s a frame) in place of the Freestyle line pass, which measured 90 s a frame
on this CPU (376 frames = 3 h). Per frame two flat renders from Rick's camera, the hero hidden:
  out/wb/f_#####_id.png  each Line-collection object in its own flat colour, everything else black (occluders stay)
  out/wb/f_#####_sh.png  white studio-lit surfaces (crease source: shading jumps inside one object)
composite.py turns them into thin #2a1830 lines (silhouette + crease, objects only) at alpha .75.
  blender -b <place>.blend --python lines_wb.py -- <place> [frames a-b|list]      env RES="720 1280"."""
import bpy, sys, os, json, time, random
from mathutils import Matrix
argv = sys.argv[sys.argv.index('--') + 1:]; PLACE = argv[0]
JOB = bpy.path.abspath('//'); D = json.load(open(os.path.join(JOB, PLACE + '_frames.json'))); FRS = {int(k): v for k, v in D['frames'].items()}
sel = argv[1] if len(argv) > 1 and argv[1] != 'all' else None
if sel:
    FL = sorted(set(int(x) for x in sel.split(','))) if '-' not in sel else list(range(int(sel.split('-')[0]), int(sel.split('-')[1]) + 1))
    FL = [f for f in FL if f in FRS]
else:
    FL = sorted(FRS)
RX, RY = (int(v) for v in os.environ.get('RES', '720 1280').split()[:2])
sc = bpy.context.scene; r = sc.render; OUT = os.path.join(JOB, 'out', 'wb'); os.makedirs(OUT, exist_ok=True)
r.engine = 'BLENDER_WORKBENCH'; r.resolution_x, r.resolution_y, r.resolution_percentage = RX, RY, 100
sc.display.render_aa = 'OFF'; r.film_transparent = False; r.image_settings.file_format = 'PNG'; r.image_settings.color_mode = 'RGB'
sc.view_settings.view_transform = 'Standard'; sc.view_settings.exposure = 0; sc.view_settings.look = 'None'
sh = sc.display.shading; sh.show_shadows = False; sh.show_cavity = False; sh.show_object_outline = False; sh.show_specular_highlight = False
sh.background_type = 'WORLD'
if sc.world:
    sc.world.color = (0, 0, 0)
LINEC = bpy.data.collections['Line']; rnd = random.Random(5); line_names = set()
for o in bpy.data.objects:
    if o.type not in ('MESH', 'CURVE'):
        continue
    if LINEC in o.users_collection or (o.parent and LINEC in o.parent.users_collection):
        o.color = (rnd.uniform(.15, 1), rnd.uniform(.15, 1), rnd.uniform(.15, 1), 1); line_names.add(o.name)
    else:
        o.color = (0, 0, 0, 1)
# props parented to group empties (drums, cart, wipe barrel) were linked to Line by place(); keep their colours
OB = {n: bpy.data.objects.get(n) for n in D['dyn'] + ['RickCam']}; cam = OB['RickCam']; sc.camera = cam
HIDE = [o for o in bpy.data.objects if o.name.startswith('HERO_') or (o.type == 'MESH' and any(m.type == 'PARTICLE_SYSTEM' for m in o.modifiers))]


bpy.context.preferences.edit.keyframe_new_interpolation_type = 'CONSTANT'
for o in HIDE:
    o.hide_render = True
keyed = set()
for f in FL:
    st = FRS[f]; fb = f + 1
    for n, m in st['mats'].items():
        o = OB.get(n)
        if o is None:
            continue
        o.matrix_world = Matrix([m[0:4], m[4:8], m[8:12], m[12:16]]); bpy.context.view_layer.update()
        o.keyframe_insert('location', frame=fb); o.keyframe_insert('rotation_quaternion' if o.rotation_mode == 'QUATERNION' else 'rotation_euler', frame=fb)
        o.keyframe_insert('scale', frame=fb)
    cam.data.lens = st['lens']; cam.data.keyframe_insert('lens', frame=fb)
    for n, h in st['hide'].items():
        o = OB.get(n)
        if o is not None:
            for x in [o] + list(o.children_recursive):
                x.hide_render = h; x.keyframe_insert('hide_render', frame=fb)
runs, cur = [], [FL[0]]
for f in FL[1:]:
    if f == cur[-1] + 1:
        cur.append(f)
    else:
        runs.append(cur); cur = [f]
runs.append(cur)
sh.light = 'FLAT'; sh.color_type = 'OBJECT'
for run in runs:
    todo = [f for f in run if not os.path.exists(os.path.join(OUT, 'f_%05d_id.png' % f))]
    if not todo:
        continue
    t0 = time.time(); sc.frame_start, sc.frame_end = todo[0] + 1, todo[-1] + 1; r.filepath = os.path.join(OUT, 'a_#####')
    bpy.ops.render.render(animation=True)
    for f in range(todo[0], todo[-1] + 1):
        src = os.path.join(OUT, 'a_%05d.png' % (f + 1))
        if os.path.exists(src):
            os.replace(src, os.path.join(OUT, 'f_%05d_id.png' % f))
    print('RUN wb', todo[0], todo[-1], '%.1f s' % (time.time() - t0), '%.2f s/frame' % ((time.time() - t0) / len(range(todo[0], todo[-1] + 1))), flush=True)
print('WB_DONE', PLACE, len(FL), flush=True)
