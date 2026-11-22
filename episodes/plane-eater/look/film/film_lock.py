# film_lock.py: the plane-eater BLENDER FILM PIPELINE (look-finisher, 2026-11-22). One stretch of the approved kit film, rebuilt in Blender
# from its LOCK, in the LOOK CARD's look (same set .blend, same light, outline pass, cast mask, grade = look/pe_look.py + look/look_*.py).
#   blender -b <set.blend> --python episodes/plane-eater/look/film/film_lock.py -- <stretch> <info|keys|package> [frames a,b,c] [out dir]
#   env: W H SPP (540 960 24), THREADS
# From the lock (node render.mjs film.json --export-lock + --held all frames, look/film/export_locks.sh):
#   camera per frame (camera_baked.json via from_lock.camera), cast cards per frame (lock cards/<who>, lock2.card: same drawings, place, turn and tip
#   as the kit), the set's moving nodes (lock2.motion), the stretch's own set pieces (top nodes of out/lock/sets/<place>.glb named in KEEP), and the
#   held 3D props on every frame (held_all.json grip -> tip, the props-hero GLB parts from props/out/props2.blend, ink fists as the kit draws them).
# Look added here (as the LOOK CARD): self-lit cards (emission 2^-exposure) with a sun-facing shadow card and a contact patch, Rick day light
# (apron_api.set_light) or the set's own interior light, bounce greyed, outline id pass, cast mask pass; finish = finish_key.py (grade + lines).
import bpy, sys, os, json, math, random, time, shutil
from mathutils import Vector, Matrix, Quaternion
HERE = os.path.dirname(os.path.abspath(__file__)); LOOK = os.path.dirname(HERE); EP = os.path.dirname(LOOK); ROOT = os.path.dirname(os.path.dirname(EP))
sys.path[:0] = [HERE, LOOK, os.path.join(ROOT, 'templates'), os.path.join(EP, 'sets', 'apron', 'scripts'), os.path.join(ROOT, 'library', 'grass')]
import pe_look as PL
from blender_look import from_lock as FL, lock2 as L2
A = sys.argv[sys.argv.index('--') + 1:]; ST = A[0]; MODE = A[1] if len(A) > 1 else 'info'
CFG = json.load(open(os.path.join(HERE, 'stretches.json')))[ST]
LOCK = os.path.join(EP, ST, 'out', 'lock'); PLAN = os.path.join(EP, ST, 'out', 'plan')
sc = bpy.context.scene; PLACE = CFG['place']
LJ = json.load(open(os.path.join(LOCK, 'lock.json'))); FR = [c for c in json.load(open(os.path.join(PLAN, 'camera_baked.json')))['frames'] if c.get('place', PLACE) == PLACE]
t0 = time.time()

# ---------------- light (the LOOK CARD's, per place)
if CFG['light'] == 'apron_day':
    import apron_api as AA
    AA.EXPO_DAY = CFG.get('expo', -0.1); AA.set_light(sc, 'day')
    sun = bpy.data.objects['apron_sun']; TO_SUN = (sun.matrix_world.to_3x3() @ Vector((0, 0, 1))).normalized()
    for o in sc.objects:
        if o.type == 'MESH' and o.name.startswith(('lawn', 'apron_slab', 'tufts', 'grass', 'runway_mow', 'taxi_', 'hangar_floor')):
            for m in o.data.materials: PL.bounce_grey(m)
else:
    sc.view_settings.exposure = CFG.get('expo', sc.view_settings.exposure); TO_SUN = Vector(CFG.get('key_dir', (-1, -.15, .35))).normalized()
EX = sc.view_settings.exposure
for o in list(sc.objects):
    if o.type == 'CAMERA': bpy.data.objects.remove(o)

# ---------------- the stretch's own pieces from the kit set (trunk, side table, plate, bites, the plane in this stretch's state ...)
before = set(bpy.data.objects)
bpy.ops.import_scene.gltf(filepath=os.path.join(LOCK, 'sets', PLACE + '.glb'))
new = [o for o in bpy.data.objects if o not in before]; MV = json.load(open(os.path.join(LOCK, 'motion', PLACE + '.json')))
moving_ids = {int(k) for k in MV['nodes']}
def root_of(o):
    while o.parent is not None and o.parent in new_set: o = o.parent
    return o
new_set = set(new); keep = set(); BASE = CFG.get('base_root', 'villebrune_apron'); HELDPART = ('shaker_', 'fork_', 'hacksaw', 'tongs_', 'rag', 'held3d', 'pe_salt', 'pe_fork', 'pe_hacksaw', 'pe_sugar', 'pe_owner')
def chain(o):
    c = [o]
    while c[-1].parent is not None and c[-1].parent in new_set: c.append(c[-1].parent)
    return c
replaced = []
for o in new:
    ch = chain(o); names = [x.name.split('.')[0] for x in ch]
    if any(nm.startswith(HELDPART) for nm in names): continue                 # held props are rebuilt from held_all.json
    if names[-1] != BASE and o.type != 'LIGHT': keep.add(o); continue          # the stretch's own pieces (and the plane in this stretch's state)
    if int(o.get('lock_id', -1)) in moving_ids and o.type == 'MESH':           # a base-set part that moves in this stretch (chair pulled out ...): the kit copy
        keep.add(o); old = bpy.data.objects.get(names[0])
        if old is not None and old not in new_set: replaced.append(old.name); old.hide_render = True; old.hide_viewport = True
keepall = {o for o in new if o in keep}
for o in keepall:                                                              # free kept nodes from parents that go, without moving them
    if o.parent is not None and o.parent not in keepall: mw = o.matrix_world.copy(); o.parent = None; o.matrix_world = mw
drop = [o for o in new if o not in keepall]; kept = list(keepall)
bpy.data.batch_remove(drop)
print('REPLACED', replaced[:20])
print('LOCKIDS', sum(1 for o in kept if 'lock_id' in o.keys()), [ (o.name, o.get('lock_id')) for o in new if o.name.startswith(('s1_bite','s1_cut'))][:4] if False else '')
print('KEPT', len(kept), sorted({root_of(o).name for o in kept})[:40], flush=True)
# the lock glb carries colours only (no texture maps): kept pieces that come from a props-hero or set .blend take that file's own materials
# again by object name (the Cessna paint with the navy stripe and F-MIAM, the glass, the scale dial, the bites ...)
MATSRC = [os.path.join(EP, 'props', 'out', f) for f in ('cessna150.blend', 'cessna150_sliced.blend', 'cessna150_wingoff.blend', 'props2.blend')]
SRC = {}
for path in MATSRC:
    if not os.path.exists(path): continue
    with bpy.data.libraries.load(path, link=False) as (src, dst): dst.meshes = list(src.meshes); names = list(src.objects)
    with bpy.data.libraries.load(path, link=False) as (src, dst): dst.objects = list(src.objects)
    for ob in dst.objects:
        if ob is not None and ob.type == 'MESH' and ob.name.split('.')[0] not in SRC: SRC[ob.name.split('.')[0]] = [m for m in ob.data.materials]
    bpy.data.batch_remove([ob for ob in dst.objects if ob is not None])
nmat = 0
for o in kept:
    if o.type == 'MESH' and o.name in bpy.data.objects:
        ms = SRC.get(o.name.split('.')[0])
        if ms and len(ms) == len(o.data.materials) and all(ms):
            for i, m in enumerate(ms): o.data.materials[i] = m
            nmat += 1
print('MATS_FROM_BLENDS', nmat, 'of', sum(1 for o in kept if o.type == 'MESH'))
# per-frame visibility + matrices of the stretch's script-driven pieces (look/film/dump_nodes.sh), where the lock has only one state
DUMPF = os.path.join(LOCK, 'nodes_dump.json')
if os.path.exists(DUMPF):
    DU = json.load(open(DUMPF)); ids = L2.by_id(kept); Cm = Matrix(((1, 0, 0, 0), (0, 0, -1, 0), (0, 1, 0, 0), (0, 0, 0, 1))); Ci = Cm.inverted(); nd = 0
    for lid, r in DU['nodes'].items():
        o = ids.get(int(lid))
        if o is None: continue
        mw = o.matrix_world.copy(); o.parent = None; o.matrix_world = mw; o.rotation_mode = 'QUATERNION'; prev = None; nd += 1
        for i, (v, m) in enumerate(zip(r['v'], r['m'])):
            f = DU['f0'] + i; M = Matrix([m[0:4], m[4:8], m[8:12], m[12:16]]).transposed(); W = Cm @ M @ Ci
            lo, q, sc_ = W.decompose()
            if prev is not None and q.dot(prev) < 0: q.negate()
            prev = q; o.location = lo; o.rotation_quaternion = q; o.scale = sc_; o.hide_render = not v
            for p_ in ('location', 'rotation_quaternion', 'scale', 'hide_render'): o.keyframe_insert(p_, frame=f)
        for fc in FL._fcurves(o.animation_data.action):
            for kp in fc.keyframe_points: kp.interpolation = 'CONSTANT' if fc.data_path == 'hide_render' else 'LINEAR'
    print('DUMP_APPLIED', nd, 'of', len(DU['nodes']))
mv = L2.motion(LOCK, PLACE, kept); print('MOTION', {k: v for k, v in mv.items() if k != 'missing'}, 'missing', mv.get('missing', [])[:10])

# ---------------- camera + cards from the lock
cam = FL.camera(sc, FR)
for ad in (cam.animation_data, cam.data.animation_data):
    if ad and ad.action:
        for fc in FL._fcurves(ad.action):
            for k in fc.keyframe_points: k.interpolation = 'LINEAR'
cam.data.dof.use_dof = False                                                         # characters never blur; DOF is a later per-shot pass
CARDS = {}
for who in LJ['cards']:
    k = L2.card(sc, LOCK, who, FR, self_lit=1.0, emit=2 ** (-EX)); o = k['object']; CARDS[who] = k
    o.pass_index = 1; o.visible_diffuse = False; o.visible_shadow = False; o.visible_glossy = False; PL.CAST.append(o)
    nt = k['material'].node_tree; nt.nodes['seq'].image.filepath = os.path.join(LOCK, 'cards', who, 's0001.png')
    sh = o.copy(); sh.name = 'SHADOWCARD_' + who; sc.collection.objects.link(sh)
    if o.animation_data and o.animation_data.action:
        act = o.animation_data.action.copy(); sh.animation_data_create(); sh.animation_data.action = act
        try: sh.animation_data.action_slot = o.animation_data.action_slot
        except Exception: pass
        for fc in FL._fcurves(act):
            if fc.data_path == 'rotation_euler':
                for kp in fc.keyframe_points: kp.co[1] = 0.0 if fc.array_index != 2 else math.atan2(TO_SUN.y, TO_SUN.x) + math.pi / 2
    sh.visible_camera = False; sh.visible_glossy = False; sh.visible_diffuse = False; sh.visible_transmission = False; sh.visible_shadow = True; PL.SHADOWS.append(sh)
    cp = PL.contact(sc, (0, 0, 0), .34 if who != 'michel' else .3, .75, name=who)
    c_ = cp.constraints.new('COPY_LOCATION'); c_.target = o; c_.use_offset = True
    cp.location = (0, 0, .004)
    if o.animation_data and o.animation_data.action:     # the contact patch hides with its card
        for fc in FL._fcurves(o.animation_data.action):
            if fc.data_path == 'hide_render':
                for f_, v_ in [(kp.co[0], kp.co[1]) for kp in fc.keyframe_points]: cp.hide_render = bool(v_); cp.keyframe_insert('hide_render', frame=int(f_))

# ---------------- held 3D props on every frame (grip -> tip from the kit), props-hero parts, ink fists
HELD = json.load(open(os.path.join(LOCK, 'held_all.json'))) if os.path.exists(os.path.join(LOCK, 'held_all.json')) else []
# obj -> props-hero part: collection in props2.blend, object-name filter, tip in the kit builder's units (scale = kit length / this), offset, colour
import re
PARTS = {'salt_shaker': dict(c='salt_shaker', tip=(0, 0, .072)), 'fork': dict(c='fork', tip=(.20, 0, 0)), 'hacksaw': dict(c='hacksaw', tip=(.26, 0, 0)),
         'sugar_tongs': dict(c='sugar_tongs', tip=(.115, 0, 0)), 'rag': dict(c='owner_rag_spanner', rx='^rag', tip=(0, 0, .15)), 'knife': dict(c='knife', tip=(.257, 0, 0)),
         'oil_glass': dict(c='oil_glass', tip=(.02, 0, 0)), 'water_jug': dict(c='water_jug', rx='^jug', tip=(.25, 0, 0), off=(.12, 0, -.17)),
         'tumbler': dict(c='water_jug', rx='^tumbler', tip=(.02, 0, 0), off=(-.22, 0, -.05)),
         'wing_slice': dict(c='metal_bites', rx='^bite_2', tip=(.1, 0, 0), col='#f3f4f1'), 'wheel_hub': dict(c='metal_bites', rx='^bite_3', tip=(.1, 0, 0), col='#c9ccd1'),
         'seat_cushion': dict(c='metal_bites', rx='^bite_4', tip=(.1, 0, 0), col='#2f5fb0'), 'tire': dict(c='metal_bites', rx='^bite_5', tip=(.1, 0, 0), col='#232428')}
PARTS.update(CFG.get('parts', {}))
INKM = bpy.data.materials.new('ink_fist'); INKM.use_nodes = True; nb = INKM.node_tree.nodes['Principled BSDF']; nb.inputs['Base Color'].default_value = PL.lin('#2a1e24'); nb.inputs['Roughness'].default_value = .6
nb.inputs['Emission Color'].default_value = PL.lin('#2a1e24'); nb.inputs['Emission Strength'].default_value = 1.0
groups = {}
for r in HELD: groups.setdefault((r['who'], r['obj']), []).append(r)
ALLF = [c['f'] for c in FR]; PROPS = {}
with bpy.data.libraries.load(PL.PROPS2, link=False) as (src, dst): avail = list(src.collections)
for (who, obj), rows in groups.items():
    pt = PARTS.get(obj, dict(c=obj, tip=(.1, 0, 0))); cname = pt['c']
    if cname not in avail: print('HELD_SKIP no part', obj); continue
    e, coll = PL.prop(sc, cname, (0, 0, 0))
    if pt.get('rx'):
        for o in list(coll.all_objects):
            if not re.match(pt['rx'], o.name): bpy.data.objects.remove(o)
    if pt.get('off'):
        for o in coll.all_objects:
            if o.parent == e: o.location = Vector(o.location) + Vector(pt['off'])
    if pt.get('col'):
        cm = bpy.data.materials.new('held_' + obj); cm.use_nodes = True; cm.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = PL.lin(pt['col'])
        for o in coll.all_objects:
            if o.type == 'MESH' and not o.name.endswith(('_stripe',)): o.data = o.data.copy(); o.data.materials.clear(); o.data.materials.append(cm)
    tip = Vector(pt['tip']); byf = {r['f']: r for r in rows}; e.rotation_mode = 'QUATERNION'
    fists = [bpy.data.objects.new('FIST_%s_%s_%d' % (who, obj, i), None) for i in range(1)]
    bpy.ops.mesh.primitive_uv_sphere_add(radius=1, segments=16, ring_count=8); fs_ = bpy.context.object; fs_.name = 'FIST_%s_%s' % (who, obj); fs_.data.materials.append(INKM)
    fs_.pass_index = 1; fs_.visible_shadow = False; PL.CAST.append(fs_)
    for f in ALLF:
        r = byf.get(f)
        if r is None:
            e.scale = (1e-4,) * 3; e.keyframe_insert('scale', frame=f); fs_.hide_render = True; fs_.keyframe_insert('hide_render', frame=f); continue
        g, t = Vector(r['grip']), Vector(r['tip']); d = t - g; s = max(d.length / max(tip.length, 1e-4), .2)
        q = tip.normalized().rotation_difference(d.normalized()); e.location = g; e.rotation_quaternion = q; e.scale = (s, s, s)
        for p_ in ('location', 'rotation_quaternion', 'scale'): e.keyframe_insert(p_, frame=f)
        fi = (r.get('fists') or [{}])[0]; camp = Vector(next(c['pos'] for c in FR if c['f'] == f))
        at = Vector(fi.get('at', r['grip'])); fs_.location = at + (camp - at).normalized() * .02; rr = fi.get('r', .028); fs_.scale = (rr, rr, rr)
        fs_.hide_render = bool(fi.get('far', False)); fs_.keyframe_insert('location', frame=f); fs_.keyframe_insert('scale', frame=f); fs_.keyframe_insert('hide_render', frame=f)
    for ob in (e, fs_):
        if ob.animation_data and ob.animation_data.action:
            for fc in FL._fcurves(ob.animation_data.action):
                for kp in fc.keyframe_points: kp.interpolation = 'CONSTANT' if fc.data_path == 'hide_render' else 'LINEAR'
    PROPS[(who, obj)] = (e, coll, fs_)
print('HELD', {f'{w}:{o}': len(v) for (w, o), v in groups.items()})

# ---------------- stretch fixes the kit could not make (CFG['fix'])
import film_fixes as FX
KX = dict(KEPT={o.name for o in kept if o.name in bpy.data.objects}, PROPS=PROPS, CARDS=CARDS, FR=FR, EX=EX, TO_SUN=TO_SUN, LOCK=LOCK, EP=EP, LOOK=LOOK)
if MODE == 'hats':
    os.makedirs(os.path.join(HERE, 'fix_' + ST), exist_ok=True); FX.hats(sc, CFG, KX, os.path.join(HERE, 'fix_' + ST, 'hats.json')); sys.exit(0)
FX.apply(sc, CFG, KX)

# ---------------- render settings, outline objects
fo = PL.render_setup(sc, int(os.environ.get('W', 540)), int(os.environ.get('H', 960)), int(os.environ.get('SPP', 24)), bounces=5 if PLACE == 'apron' else 6)
sc.render.fps = LJ.get('fps', 30); sc.frame_start, sc.frame_end = CFG['window']
NOLINE = tuple(CFG.get('noline', [])) + ('lawn', 'apron_slab', 'hangar_floor', 'runway_mow', 'taxi_', 'fields_', 'hill_', 'tufts', 'clad_', 'hangar_wall', 'hangar_pier',
          'hangar_header', 'gable_infill', 'air_mote', 'glass', 'win_glass', 'door_glass', 'office_wall', 'office_clad', 'roof', 'cloth_top', 'oil_in', 'jug_water',
          'tree', 'poplar', 'Card_', 'SHADOWCARD_', 'CONTACT_', 'contact', 'salt_', 'DAPPLE', 'shaker_glass', 'shaker_salt', 'FIST_', 'floor', 'lino', 'wall', 'ceil', 'sky', 'cloud')
LINES = [o for o in sc.objects if o.type == 'MESH' and not o.hide_render and o.visible_camera and not o.name.startswith(NOLINE)]
PL.HIDE.extend([o for o in sc.objects if o.type == 'MESH' and (not o.visible_camera or o.name.startswith(('salt_', 'FIST_')))])
PL.LK.setup(sc, LINES, PL.CAST + PL.SHADOWS + PL.HIDE)
print('SETUP_SECONDS %.1f' % (time.time() - t0), 'frames', FR[0]['f'], FR[-1]['f'], 'lines', len(LINES), flush=True)

def render_frames(frames, od):
    os.makedirs(od, exist_ok=True); T = {}
    for f in frames:
        sc.frame_set(f); base = os.path.join(od, '%s_f%04d' % (ST, f)); fo.directory = base + '_'
        sc.render.filepath = base + '.png'; t1 = time.time(); bpy.ops.render.render(write_still=True); T[f] = round(time.time() - t1, 1)
        PL.LK.render(sc, base + '_lines_id.png'); print('FRAME', f, 'RENDER_SECONDS', T[f], flush=True)
    return T

if MODE == 'info':
    for f in [int(x) for x in (A[2].split(',') if len(A) > 2 else [str(FR[0]['f'])])]:
        sc.frame_set(f); print('HIDE', f, [(o.name, o.hide_render, o.visible_get()) for o in sc.objects if o.name.startswith('Card_michel')], [(m.name, m.node_tree.nodes['seq'].image.name, m.node_tree.nodes['seq'].image_user.frame_current if hasattr(m.node_tree.nodes['seq'].image_user,'frame_current') else '', m.node_tree.nodes['seq'].image_user.frame_offset) for m in bpy.data.materials if m.name.startswith('Card_michel')])
        print('INFO_F', f, json.dumps({w: PL.screen(sc, k['object'].matrix_world.translation) for w, k in CARDS.items()}),
                               json.dumps({f'{w}:{o}': PL.screen(sc, v[0].matrix_world.translation) for (w, o), v in PROPS.items()}))
elif MODE == 'keys':
    od = A[3] if len(A) > 3 else os.path.join(LOOK, 'film', 'keys'); T = render_frames([int(x) for x in A[2].split(',')], od)
    json.dump(T, open(os.path.join(od, ST + '_times.json'), 'w'))
elif MODE == 'package':
    # RunPod package: one .blend (everything packed except the card drawings, which are image sequences: copied next to it), frames json, render.sh
    od = A[2] if len(A) > 2 else os.path.join(EP, 'runpod', ST); os.makedirs(od, exist_ok=True)
    for who in CARDS:
        dst = os.path.join(od, 'cards', who); os.makedirs(dst, exist_ok=True)
        for fn in os.listdir(os.path.join(LOCK, 'cards', who)):
            if fn.endswith('.png'): shutil.copy2(os.path.join(LOCK, 'cards', who, fn), dst)
    for im in bpy.data.images:
        if im.source == 'SEQUENCE': continue
        if im.source == 'FILE' and not im.packed_file:
            try: im.pack()
            except Exception as ex: print('PACK_FAIL', im.name, ex)
    for who, k in CARDS.items(): k['material'].node_tree.nodes['seq'].image.filepath = '//cards/%s/s0001.png' % who
    for lib in list(bpy.data.libraries): bpy.data.libraries.remove(lib)
    sc.render.filepath = '//out/f_####'
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(od, 'scene.blend'), compress=True, relative_remap=True)
    json.dump(dict(stretch=ST, place=PLACE, frames=CFG['window'], n=CFG['window'][1] - CFG['window'][0] + 1, keys=CFG.get('keys', []), grade=CFG.get('grade', ['DAY', .5]), res=[1080, 1920], fps=sc.render.fps), open(os.path.join(od, 'frames.json'), 'w'), indent=1)
    KIT = os.path.join(HERE, 'runpod_kit'); YC = os.path.join(ROOT, 'episodes', 'yellow-fire-trucks', 'cine')
    for src in (os.path.join(KIT, 'job_film.py'), os.path.join(KIT, 'render.sh'), os.path.join(YC, 'finish_key.py'), os.path.join(YC, 'rick_targets.json'),
                os.path.join(ROOT, 'tools', 'grade_rick.py'), os.path.join(ROOT, 'tools', 'measure', 'rick_grade_study.py'),
                os.path.join(ROOT, 'templates', 'blender_look', 'rick_outline', 'composite.py'), os.path.join(ROOT, 'templates', 'blender_look', 'rick_outline', 'lines_key.py')):
        shutil.copy2(src, od)
    print('PACKAGE', od)
