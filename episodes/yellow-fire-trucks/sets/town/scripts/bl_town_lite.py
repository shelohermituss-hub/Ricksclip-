# bl_town_lite.py: LITE staging export for the three.js kit ONLY (the final render keeps town.blend, untouched). Run by build_town.sh:
#   blender -b out/town.blend --python scripts/bl_town_lite.py -- out      -> out/town_lite.glb
# Same layout, anchors, colours, lettering. Grass patches only within GR m of the camera spots (others removed: the ground texture carries the lawn),
# the kept patches and all trees decimated hard, any other mesh over 40 k unique tris decimated to that.
import bpy, bmesh, os, sys, json, math, random
import numpy as np
OUT = sys.argv[sys.argv.index('--') + 1]
GR = float(os.environ.get('LITE_GRASS_R', 8)); TREE_R = float(os.environ.get('LITE_TREE_RATIO', .006)); GRASS_R = float(os.environ.get('LITE_GRASS_RATIO', .02))
meta = json.load(open(os.path.join(OUT, 'town_meta.json'))); A = meta['anchors']
spots = [A['yard_centre'], A['bay1_truck'], A['bay2_truck'], A['crossing_stop_bar'], A['park_swing'], A['park_bench'], A['park_tree'], A['shop_window'],
         [47.0, -31.0, 1.25], [31.0, -15.5, 1.7], [37.0, -17.0, 2.4], [44.5, -30.5, 1.25], [23.4, -14.5, 1.6]]   # + the park and crossing camera positions and aim (town_cams.json, old and FIX 1)
TOWN = bpy.data.collections['TOWN']
def tris(me): return sum(len(p.vertices) - 2 for p in me.polygons)
def dec(me, ratio):
    ob = bpy.data.objects.new('lo', me.copy()); bpy.context.scene.collection.objects.link(ob)
    ob.modifiers.new('d', 'DECIMATE').ratio = ratio; dg = bpy.context.evaluated_depsgraph_get(); dg.update()
    new = bpy.data.meshes.new_from_object(ob.evaluated_get(dg)); bpy.data.objects.remove(ob); return new
swap = {}; removed = 0
# FIX 1 (LITE park): no decimated blade patches (they read as a dark spiky mass). Every grass patch becomes a few TUFT CARDS (3 crossed quads with a painted
# blade texture, tex_town.py tuft.png), dense near the camera spots; the tree keeps whole leaf cards (a share of them, scaled up) instead of decimated shards.
TEX = os.path.normpath(os.path.join(OUT, '..', 'build', 'tex')); rt = random.Random(57)
KEEP = float(os.environ.get('LITE_LEAF_KEEP', .009)); LS = float(os.environ.get('LITE_LEAF_SCALE', 3.0))
tm = bpy.data.materials.new('lite_tuft'); tm.use_nodes = True; tb = tm.node_tree.nodes['Principled BSDF']; tt = tm.node_tree.nodes.new('ShaderNodeTexImage')
tt.image = bpy.data.images.load(os.path.join(TEX, 'tuft.png')); tm.node_tree.links.new(tt.outputs[0], tb.inputs['Base Color']); tm.node_tree.links.new(tt.outputs[1], tb.inputs['Alpha'])
tb.inputs['Roughness'].default_value = .85; tm.surface_render_method = 'DITHERED'
tufts = []                                                                     # (x, y, size)
cams = [[47.0, -31.0], [44.5, -30.5]]
for o in TOWN.objects:
    if o.type == 'MESH' and o.get('asset') == 'grass_patch':
        x, y, sc = o.location.x, o.location.y, o.scale.x; near = min(math.hypot(x - q[0], y - q[1]) for q in spots) < 12
        for k in range(16 if near else 5): tufts.append((x + rt.uniform(-1.3, 1.3) * sc, y + rt.uniform(-1.3, 1.3) * sc, rt.uniform(.8, 1.35)))
for c in cams:                                                                 # a few near tufts in front of the park camera
    for k in range(70):
        a = rt.uniform(math.radians(95), math.radians(150)); d = rt.uniform(.9, 7.); tufts.append((c[0] + math.cos(a) * d, c[1] + math.sin(a) * d, rt.uniform(1.1, 1.6)))
bm = bmesh.new(); uvl = bm.loops.layers.uv.new()
for (x, y, sz) in tufts:
    w, h, r0 = .55 * sz, .34 * sz * rt.uniform(.85, 1.15), rt.uniform(0, math.pi)
    for q in range(3):
        a = r0 + q * math.pi / 3; dx, dy = math.cos(a) * w / 2, math.sin(a) * w / 2
        vs = [bm.verts.new(v) for v in ((x - dx, y - dy, .07), (x + dx, y + dy, .07), (x + dx, y + dy, .07 + h), (x - dx, y - dy, .07 + h))]
        f = bm.faces.new(vs)
        for lp, uv in zip(f.loops, ((0, 0), (1, 0), (1, 1), (0, 1))): lp[uvl].uv = uv
me = bpy.data.meshes.new('lite_tufts'); bm.to_mesh(me); bm.free(); me.materials.append(tm); to = bpy.data.objects.new('lite_tufts', me); TOWN.objects.link(to)
print('LITE_TUFTS', len(tufts), 'cards', len(tufts) * 3)
def canopy(me0):
    """whole leaf cards: islands of the leaves material, KEEP of them, each scaled LS about its centre; wood decimated; one mesh again"""
    me = me0.copy(); nv = len(me.vertices); co = np.zeros(nv * 3); me.vertices.foreach_get('co', co); co = co.reshape(-1, 3)
    np_ = len(me.polygons); mi = np.zeros(np_, int); ls = np.zeros(np_, int); lt = np.zeros(np_, int)
    me.polygons.foreach_get('material_index', mi); me.polygons.foreach_get('loop_start', ls); me.polygons.foreach_get('loop_total', lt)
    lv = np.zeros(len(me.loops), int); me.loops.foreach_get('vertex_index', lv)
    leaf = mi == 1; lf = np.repeat(leaf, lt); fidx = np.repeat(np.arange(np_), lt)
    lab = np.arange(nv)
    for it in range(60):                                                       # min-label propagation over the leaf faces = connected islands
        fm = np.full(np_, nv); np.minimum.at(fm, fidx[lf], lab[lv[lf]]); new = lab.copy(); np.minimum.at(new, lv[lf], fm[fidx[lf]])
        if (new == lab).all(): break
        lab = new
    isl = lab[lv[ls]]; ui = np.unique(isl[leaf]); rng = np.random.default_rng(5); keep_isl = set(ui[rng.random(len(ui)) < KEEP].tolist())
    cnt = np.bincount(lab, minlength=nv).astype(float); cen = np.zeros((nv, 3))
    for k in range(3): cen[:, k] = np.bincount(lab, weights=co[:, k], minlength=nv)
    cen /= np.maximum(cnt, 1)[:, None]; lv_leaf = np.unique(lv[lf]); c_ = cen[lab[lv_leaf]]; co[lv_leaf] = c_ + (co[lv_leaf] - c_) * LS
    me.vertices.foreach_set('co', co.ravel()); me.update()
    bm = bmesh.new(); bm.from_mesh(me); bm.faces.ensure_lookup_table()
    kill = [bm.faces[i] for i in range(np_) if leaf[i] and isl[i] not in keep_isl]; bmesh.ops.delete(bm, geom=kill, context='FACES_ONLY')
    loose = [v for v in bm.verts if not v.link_faces]; bmesh.ops.delete(bm, geom=loose, context='VERTS')
    wood = bpy.data.meshes.new('w'); bw = bm.copy(); bmesh.ops.delete(bw, geom=[f for f in bw.faces if f.material_index == 1], context='FACES'); bw.to_mesh(wood); bw.free()
    bmesh.ops.delete(bm, geom=[f for f in bm.faces if f.material_index != 1], context='FACES'); nleaf = len(bm.faces)
    wd = dec(wood, min(1., 4000. / max(1, tris(wood)))); bm.from_mesh(wd); out = bpy.data.meshes.new(me0.name + '_lite'); bm.to_mesh(out); bm.free()
    for m in me0.materials: out.materials.append(m)
    print('LITE_CANOPY islands', len(ui), 'kept', len(keep_isl), 'leaf faces', nleaf, 'wood', tris(wd), 'tris', tris(out)); return out
for o in list(TOWN.objects):
    if o.type != 'MESH': continue
    a = o.get('asset')
    if a == 'grass_patch': bpy.data.objects.remove(o); removed += 1; continue      # FIX 1: all patches -> tufts (above)
    if a and a.startswith('island_tree'):
        if o.data.name not in swap: swap[o.data.name] = canopy(o.data)
        o.data = swap[o.data.name]; continue
    near = a == 'grass_patch' and min(math.hypot(o.location.x - q[0], o.location.y - q[1]) for q in spots) <= float(os.environ.get('LITE_NEAR_R', 0))
    key = o.data.name + ('_n' if near else '')
    if key in swap: o.data = swap[key]; continue
    n = tris(o.data)
    r = .1 if near else TREE_R if a and a.startswith('island_tree') else GRASS_R if a == 'grass_patch' else (800. / n if (n > 800 and a in ('bush', 'dandelion')) else 40000. / n if n > 40000 else 1.)
    if r < 1: swap[key] = dec(o.data, r); print('LITE_DEC', a or o.name, n, '->', tris(swap[key])); o.data = swap[key]
print('LITE_GRASS_REMOVED', removed)
for m in bpy.data.materials:
    b_ = m.node_tree.nodes.get('Principled BSDF') if m.node_tree else None
    if b_ and (m.name.startswith('win_lit') or m.name.startswith('lamp_') or m.name.startswith('sign_blade')): b_.inputs['Emission Strength'].default_value = 1.
for o in bpy.context.scene.objects: o.select_set(False)
for o in TOWN.objects: o.select_set(True)
bpy.ops.export_scene.gltf(filepath=os.path.join(OUT, 'town_lite_tmp.glb'), export_format='GLB', use_selection=True, export_apply=True, export_lights=False, export_cameras=False,
                          export_extras=True, export_image_format='JPEG', export_image_quality=82)
import collections; c = collections.Counter()
for o in TOWN.objects:
    if o.type == 'MESH': c[o.get('asset') or o.name[:24]] += tris(o.data)
print('LITE_TOP', c.most_common(8))
gt = sum(tris(o.data) for o in TOWN.objects if o.type == 'MESH')
os.replace(os.path.join(OUT, 'town_lite_tmp.glb'), os.path.join(OUT, 'town_lite.glb'))   # FIX 1: tmp + rename (stretch builders load it live)
print('LITE_TRIS', gt, 'LITE_MB %.1f' % (os.path.getsize(os.path.join(OUT, 'town_lite.glb')) / 1e6)); print('LITE_DONE')
