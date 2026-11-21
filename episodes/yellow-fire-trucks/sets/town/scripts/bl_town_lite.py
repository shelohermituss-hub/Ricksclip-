# bl_town_lite.py: LITE staging export for the three.js kit ONLY (the final render keeps town.blend, untouched). Run by build_town.sh:
#   blender -b out/town.blend --python scripts/bl_town_lite.py -- out      -> out/town_lite.glb
# Same layout, anchors, colours, lettering. Grass patches only within GR m of the camera spots (others removed: the ground texture carries the lawn),
# the kept patches and all trees decimated hard, any other mesh over 40 k unique tris decimated to that.
import bpy, os, sys, json, math
OUT = sys.argv[sys.argv.index('--') + 1]
GR = float(os.environ.get('LITE_GRASS_R', 8)); TREE_R = float(os.environ.get('LITE_TREE_RATIO', .006)); GRASS_R = float(os.environ.get('LITE_GRASS_RATIO', .02))
meta = json.load(open(os.path.join(OUT, 'town_meta.json'))); A = meta['anchors']
spots = [A['yard_centre'], A['bay1_truck'], A['bay2_truck'], A['crossing_stop_bar'], A['park_swing'], A['park_bench'], A['park_tree'], A['shop_window'],
         [47.0, -31.0, 1.25], [31.0, -15.5, 1.7], [37.0, -17.0, 2.4]]       # + the park and crossing camera positions and aim (town_cams.json)
TOWN = bpy.data.collections['TOWN']
def tris(me): return sum(len(p.vertices) - 2 for p in me.polygons)
def dec(me, ratio):
    ob = bpy.data.objects.new('lo', me.copy()); bpy.context.scene.collection.objects.link(ob)
    ob.modifiers.new('d', 'DECIMATE').ratio = ratio; dg = bpy.context.evaluated_depsgraph_get(); dg.update()
    new = bpy.data.meshes.new_from_object(ob.evaluated_get(dg)); bpy.data.objects.remove(ob); return new
swap = {}; removed = 0
for o in list(TOWN.objects):
    if o.type != 'MESH': continue
    a = o.get('asset')
    if a == 'grass_patch':
        x, y = o.location.x, o.location.y
        if min(math.hypot(x - s[0], y - s[1]) for s in spots) > GR: bpy.data.objects.remove(o); removed += 1; continue
    near = a == 'grass_patch' and min(math.hypot(o.location.x - q[0], o.location.y - q[1]) for q in spots) <= float(os.environ.get('LITE_NEAR_R', 0))
    key = o.data.name + ('_n' if near else '')
    if key in swap: o.data = swap[key]; continue
    n = tris(o.data)
    r = .1 if near else TREE_R if a and a.startswith('island_tree') else GRASS_R if a == 'grass_patch' else (800. / n if (n > 800 and a in ('bush', 'dandelion')) else 40000. / n if n > 40000 else 1.)
    if r < 1: swap[key] = dec(o.data, r); print('LITE_DEC', a or o.name, n, '->', tris(swap[key])); o.data = swap[key]
print('LITE_GRASS_REMOVED', removed)
for m in bpy.data.materials:
    b_ = m.node_tree.nodes.get('Principled BSDF') if m.node_tree else None
    if b_ and (m.name.startswith('win_lit') or m.name.startswith('lamp_')): b_.inputs['Emission Strength'].default_value = 1.
for o in bpy.context.scene.objects: o.select_set(False)
for o in TOWN.objects: o.select_set(True)
bpy.ops.export_scene.gltf(filepath=os.path.join(OUT, 'town_lite.glb'), export_format='GLB', use_selection=True, export_apply=True, export_lights=False, export_cameras=False,
                          export_extras=True, export_image_format='JPEG', export_image_quality=82)
import collections; c = collections.Counter()
for o in TOWN.objects:
    if o.type == 'MESH': c[o.get('asset') or o.name[:24]] += tris(o.data)
print('LITE_TOP', c.most_common(8))
gt = sum(tris(o.data) for o in TOWN.objects if o.type == 'MESH')
print('LITE_TRIS', gt, 'LITE_MB %.1f' % (os.path.getsize(os.path.join(OUT, 'town_lite.glb')) / 1e6)); print('LITE_DONE')
