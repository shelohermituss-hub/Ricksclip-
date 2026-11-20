# bl_light.py: the LIGHT truck (about 35 k triangles) for rows of trucks (map, Dallas pair, toy), made from out/truck.blend so names, pivots,
# paint group and controls stay the same (truck_api works on it). The gag gear (sirens, beacon row, price card) and the ribbon are removed.
# blender -b --factory-startup --python bl_light.py -- <out dir> [target tris]
import bpy, sys, os, json
a = sys.argv[sys.argv.index('--') + 1:]; OUT = a[0]; TARGET = int(a[1]) if len(a) > 1 else 35000
bpy.ops.wm.open_mainfile(filepath=os.path.join(OUT, 'truck.blend'))
col = bpy.data.collections['TRUCK']
def walk(o):
    yield o
    for c in o.children: yield from walk(c)
kill = set()
for o in col.objects:
    nm = o.name.split('.')[0]
    if o.get('r2') or nm.startswith(('siren_', 'beacon_bar', 'ribbon', 'price_card')) or o.get('phfd_part') == 'ribbon':
        for c in walk(o): kill.add(c)
for o in kill: bpy.data.objects.remove(o)
ms = [o for o in col.objects if o.type == 'MESH']
def tris(o): o.data.calc_loop_triangles(); return len(o.data.loop_triangles)
T0 = {o.name: tris(o) for o in ms}; small = sum(t for t in T0.values() if t <= 300); big = sum(t for t in T0.values() if t > 300)
r = max(0.05, min(1.0, (TARGET - small) / max(1, big)))
dg = bpy.context.evaluated_depsgraph_get()
for o in ms:
    if T0[o.name] <= 300: continue
    m = o.modifiers.new('dec', 'DECIMATE'); m.decimate_type = 'COLLAPSE'; m.ratio = r; m.use_collapse_triangulate = True
bpy.context.view_layer.update(); dg = bpy.context.evaluated_depsgraph_get()
for o in ms:
    if o.modifiers:
        me = bpy.data.meshes.new_from_object(o.evaluated_get(dg)); o.modifiers.clear(); o.data = me
TT = sum(tris(o) for o in ms)
col.name = 'TRUCK'; bpy.data.objects['TRUCK']['light'] = 1
bpy.ops.object.select_all(action='DESELECT')
for o in col.objects: o.select_set(True)
glb = os.path.join(OUT, 'truck_light.glb')
bpy.ops.export_scene.gltf(filepath=glb, export_format='GLB', use_selection=True, export_extras=True, export_yup=True, export_apply=True, export_cameras=False, export_lights=False)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, 'truck_light.blend'), compress=True)
print('LIGHT ratio %.3f tris %d (from %d) GLB %.1f MB' % (r, TT, sum(T0.values()), os.path.getsize(glb) / 1e6))
json.dump(dict(tris=TT, ratio=round(r, 3)), open(os.path.join(OUT, 'truck_light_meta.json'), 'w'))
print('LIGHT_DONE')
