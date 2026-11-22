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
    if CFG.get('sky_fill'): sc.world.node_tree.nodes['sky_fill'].inputs['Strength'].default_value = CFG['sky_fill']   # S1: less blue lift on the concrete shade
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
    if int(o.get('lock_id', -1)) in moving_ids and o.type == 'MESH' and not CFG.get('base_dump'):           # a base-set part that moves in this stretch (chair pulled out ...): the kit copy
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
# pieces the kit had hidden when the lock was exported (not in the glb) are rebuilt here and keyed by the node dump (stretches.json 'rebuild')
for lid, spec in CFG.get('rebuild', {}).items():
    if 'part' in spec:
        cn, rx = spec['part'].split('/'); e_, co_ = PL.prop(sc, cn, (0, 0, 0))
        for o in list(co_.all_objects):
            if not o.name.startswith(rx): bpy.data.objects.remove(o)
        ob = e_; ob['lock_id'] = int(lid); kept.append(ob); kept.extend(co_.all_objects)
    else:
        bx = spec['box']; me = bpy.data.meshes.new('rb_' + lid); hx, hy, hz = bx[0] / 2, bx[1] / 2, bx[2] / 2
        me.from_pydata([(x, y, z) for x in (-hx, hx) for y in (-hy, hy) for z in (-hz, hz)], [], [(0, 1, 3, 2), (4, 6, 7, 5), (0, 4, 5, 1), (2, 3, 7, 6), (0, 2, 6, 4), (1, 5, 7, 3)])
        m_ = bpy.data.materials.new('rb_' + lid); m_.use_nodes = True; bb = m_.node_tree.nodes['Principled BSDF']; bb.inputs['Base Color'].default_value = PL.lin(spec['col'])
        me.materials.append(m_); ob = bpy.data.objects.new(spec.get('name', 'rb_' + lid), me); sc.collection.objects.link(ob); ob['lock_id'] = int(lid); kept.append(ob)
    print('REBUILT', lid, ob.name)
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
# glassware reads as the kit's clear glass (at 24-64 spp a real-IOR transmission goes frosted and dark): transparent + fresnel gloss
THIN = {}
for o in kept:
    if o.type != 'MESH' or o.name not in bpy.data.objects: continue
    for i, m in enumerate(o.data.materials):
        if not m or not m.use_nodes: continue
        b = next((n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'), None)
        if b is None or (b.inputs['Transmission Weight'].default_value < .3 and 'glass' not in m.name.lower()): continue
        if m.name not in THIN:
            liquid = any(k in m.name.lower() for k in ('water', 'oil', 'amber', 'wine'))
            t = bpy.data.materials.new(m.name + '_clear'); t.use_nodes = True; N = t.node_tree.nodes; Lk = t.node_tree.links
            for n in list(N): N.remove(n)
            tr = N.new('ShaderNodeBsdfTransparent'); gl = N.new('ShaderNodeBsdfGlossy'); gl.inputs['Roughness'].default_value = .04
            cb = b.inputs['Base Color'].default_value; tr.inputs['Color'].default_value = (cb[0] * .5 + .5, cb[1] * .5 + .5, cb[2] * .5 + .5, 1) if liquid else (.97, .99, 1, 1)
            fr = N.new('ShaderNodeLayerWeight'); fr.inputs['Blend'].default_value = .25; mx = N.new('ShaderNodeMixShader')
            Lk.new(fr.outputs['Fresnel'], mx.inputs[0]); Lk.new(tr.outputs[0], mx.inputs[1]); Lk.new(gl.outputs[0], mx.inputs[2])
            o_ = N.new('ShaderNodeOutputMaterial'); Lk.new(mx.outputs[0], o_.inputs['Surface']); THIN[m.name] = t
        o.data.materials[i] = THIN[m.name]
print('THIN_GLASS', sorted(THIN)[:10])
print('MATS_FROM_BLENDS', nmat, 'of', sum(1 for o in kept if o.type == 'MESH'))
# per-frame visibility + matrices of the stretch's script-driven pieces (look/film/dump_nodes.sh), where the lock has only one state
DUMPF = os.path.join(LOCK, 'nodes_dump.json')
if os.path.exists(DUMPF):
    DU = json.load(open(DUMPF)); ids = L2.by_id(kept); Cm = Matrix(((1, 0, 0, 0), (0, 0, -1, 0), (0, 1, 0, 0), (0, 0, 0, 1))); Ci = Cm.inverted(); nd = 0
    for lid, r in DU['nodes'].items():
        o = ids.get(int(lid))
        if o is None and CFG.get('base_dump') and r['name']:                   # a base-set part the kit script moves or hides: the set's own object, by name
            o = bpy.data.objects.get(r['name'])
            if o is not None and o in new_set: o = None
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
cam.data.dof.use_dof = False
if CFG.get('cam_offset') or os.environ.get('CAM_OFF'):                           # a reframe the lead asked for (S5: both heads readable)
    co_ = [float(x) for x in os.environ['CAM_OFF'].split(',')] if os.environ.get('CAM_OFF') else CFG['cam_offset']
    for fc in FL._fcurves(cam.animation_data.action):
        if fc.data_path == 'location':
            for kp in fc.keyframe_points:
                if CFG['window'][0] <= kp.co[0] <= CFG['window'][1]: kp.co[1] += co_[fc.array_index]                                                         # characters never blur; DOF is a later per-shot pass
CARDS = {}
OFF = CFG.get('card_offset', {})
for who in LJ['cards']:
    k = L2.card(sc, LOCK, who, FR, self_lit=1.0, emit=2 ** (-EX)); o = k['object']; CARDS[who] = k
    o.pass_index = 1; o.visible_diffuse = False; o.visible_shadow = False; o.visible_glossy = False; PL.CAST.append(o)
    if who in OFF and o.animation_data and o.animation_data.action:              # a reframe the lead asked for (S5: the owner a little toward the aisle, clear of Michel's head)
        for fc in FL._fcurves(o.animation_data.action):
            if fc.data_path == 'location':
                for kp in fc.keyframe_points: kp.co[1] += OFF[who][fc.array_index]
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
        g, t = Vector(r['grip']) + Vector(OFF.get(who, (0, 0, 0))), Vector(r['tip']) + Vector(OFF.get(who, (0, 0, 0))); d = t - g; s = max(d.length / max(tip.length, 1e-4), .2)
        q = tip.normalized().rotation_difference(d.normalized()); e.location = g; e.rotation_quaternion = q; e.scale = (s, s, s)
        for p_ in ('location', 'rotation_quaternion', 'scale'): e.keyframe_insert(p_, frame=f)
        fi = (r.get('fists') or [{}])[0]; camp = Vector(next(c['pos'] for c in FR if c['f'] == f))
        at = Vector(fi.get('at', r['grip'])) + Vector(OFF.get(who, (0, 0, 0))); fs_.location = at + (camp - at).normalized() * .02; rr = fi.get('r', .028); fs_.scale = (rr, rr, rr)
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
    os.makedirs(os.path.join(HERE, 'fix_' + ST), exist_ok=True)
    if 'hook_cam' in CFG.get('fix', []): FX.hook_cam(sc, CFG, KX)
    FX.hats(sc, CFG, KX, os.path.join(HERE, 'fix_' + ST, 'hats.json')); sys.exit(0)
FX.apply(sc, CFG, KX)

for n in filter(None, os.environ.get('DBG_HIDE', '').split(',')):          # debug: hide named objects and their children
    o = bpy.data.objects.get(n)
    if o:
        for x in [o] + list(o.children_recursive): x.hide_render = True; x.animation_data_clear()
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
        sc.frame_set(f); print('JUG', f, [(o.name, o.hide_render, [round(x, 2) for x in o.matrix_world.translation], [round(x, 2) for x in o.matrix_world.to_scale()]) for o in sc.objects if o.name.split('.')[0] in ('Scene', 'jug_body', 'glass_body', 'scale_body')][:12])
        print('HIDE', f, [(o.name, o.hide_render, o.visible_get()) for o in sc.objects if o.name.startswith('Card_michel')], [(m.name, m.node_tree.nodes['seq'].image.name, m.node_tree.nodes['seq'].image_user.frame_current if hasattr(m.node_tree.nodes['seq'].image_user,'frame_current') else '', m.node_tree.nodes['seq'].image_user.frame_offset) for m in bpy.data.materials if m.name.startswith('Card_michel')])
        print('HOOKSCR', f, 'tip', PL.screen(sc, (5.09, -1.15, 2.0)), 'root', PL.screen(sc, (1.0, -1.1, 1.9)), 'michel_head', PL.screen(sc, CARDS['michel']['object'].matrix_world.translation + Vector((0, 0, 1.8))) if 'michel' in CARDS else '', 'shaker', PL.screen(sc, PROPS[('michel', 'salt_shaker')][0].matrix_world.translation) if ('michel', 'salt_shaker') in PROPS else '')
        g0 = bpy.data.objects.get('salt_fall_00'); print('SALT0', f, g0 and ([round(x, 3) for x in g0.matrix_world.translation], g0.hide_render, [round(x, 3) for x in g0.matrix_world.to_scale()]), 'shaker', [round(x, 3) for x in PROPS[('michel', 'salt_shaker')][0].matrix_world.translation] if ('michel', 'salt_shaker') in PROPS else '')
        print('PROPSCALE', f, {f'{w}:{o}': [round(v[0].matrix_world.to_scale().x, 2), v[0].hide_render] for (w, o), v in PROPS.items()})
        print('INFO_F', f, json.dumps({w: PL.screen(sc, k['object'].matrix_world.translation) for w, k in CARDS.items()}),
                               json.dumps({f'{w}:{o}': PL.screen(sc, v[0].matrix_world.translation) for (w, o), v in PROPS.items()}))
elif MODE == 'keys':
    od = A[3] if len(A) > 3 else os.path.join(LOOK, 'film', 'keys'); T = render_frames([int(x) for x in A[2].split(',')], od)
    json.dump(T, open(os.path.join(od, ST + '_times.json'), 'w'))
elif MODE == 'package':
    # RunPod package: one .blend (everything packed except the card drawings, which are image sequences: copied next to it), frames json, render.sh
    od = A[2] if len(A) > 2 else os.path.join(EP, 'runpod', ST); os.makedirs(od, exist_ok=True)
    for im in bpy.data.images:                       # image sequences (lock card drawings, the S1 re-posed drawings) cannot be packed: copied next to the .blend
        if im.source != 'SEQUENCE': continue
        src = os.path.dirname(bpy.path.abspath(im.filepath)); rel = 'seq/' + os.path.basename(os.path.dirname(src)) + '_' + os.path.basename(src); dst = os.path.join(od, rel)
        os.makedirs(dst, exist_ok=True)
        for fn in os.listdir(src):
            if fn.endswith('.png'): shutil.copy2(os.path.join(src, fn), dst)
        im.filepath = os.path.join(dst, os.path.basename(im.filepath)); print('SEQ', im.name, '->', rel)   # absolute here: save_as relative_remap makes it //seq/... next to scene.blend
    for im in bpy.data.images:
        if im.source == 'SEQUENCE': continue
        if im.source == 'FILE' and not im.packed_file:
            try: im.pack()
            except Exception as ex: print('PACK_FAIL', im.name, ex)
    for lib in list(bpy.data.libraries): bpy.data.libraries.remove(lib)
    sc.render.filepath = '//out/f_####'
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(od, 'scene.blend'), compress=True, relative_remap=True)
    json.dump(dict(stretch=ST, place=PLACE, frames=CFG['window'], n=CFG['window'][1] - CFG['window'][0] + 1, keys=CFG.get('keys', []), grade=CFG.get('grade', ['DAY', .5]), grade_ranges=CFG.get('grade_ranges', []), sat_kmax=CFG.get('sat_kmax', 2.4), res=[1080, 1920], fps=sc.render.fps), open(os.path.join(od, 'frames.json'), 'w'), indent=1)
    KIT = os.path.join(HERE, 'runpod_kit'); YC = os.path.join(ROOT, 'episodes', 'yellow-fire-trucks', 'cine')
    for src in (os.path.join(KIT, 'job_film.py'), os.path.join(KIT, 'render.sh'), os.path.join(YC, 'finish_key.py'), os.path.join(YC, 'rick_targets.json'),
                os.path.join(ROOT, 'tools', 'grade_rick.py'), os.path.join(ROOT, 'tools', 'measure', 'rick_grade_study.py'),
                os.path.join(ROOT, 'templates', 'blender_look', 'rick_outline', 'composite.py'), os.path.join(ROOT, 'templates', 'blender_look', 'rick_outline', 'lines_key.py'),
                os.path.join(HERE, 'sat_fit.py'), os.path.join(HERE, 'fx_layer.py')):
        shutil.copy2(src, od)
    fxj = os.path.join(HERE, 'fx', ST + '_fx.json'); json.dump(json.load(open(fxj)) if os.path.exists(fxj) else {}, open(os.path.join(od, 'fx.json'), 'w'))
    print('PACKAGE', od)
