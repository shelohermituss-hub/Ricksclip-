# bl_toy.py: the pressed-tin TOY truck (props-hero round 3, 2026-11-21; PROPS line "Red toy truck"), made from out/truck_light.blend (the ALF by
# robinmikart, CC-BY 4.0) at 18 cm: gag gear, ribbon and glass dropped, textures shrunk to 128 px (an 18 cm toy never needs more), decimated to
# ~14 k tris; toy marks: folded tin TABS along the body seams, the front-right HUBCAP missing (bare axle stub), the ladder BENT (rear end down 8 deg).
# Out: toy_truck.glb (kit, assets.js buildToyTruck, preloaded: small) + toy_truck.blend (final). Frame: metres at TOY size, front -X, Z up, origin on the ground.
# blender -b --factory-startup --python bl_toy.py -- <out dir>
import bpy, sys, os, math, json, bmesh
from mathutils import Vector, Matrix
OUT = sys.argv[sys.argv.index('--') + 1:][0]
bpy.ops.wm.open_mainfile(filepath=os.path.join(OUT, 'truck_light.blend'))
col = bpy.data.collections['TRUCK']; root = bpy.data.objects['TRUCK']
def walk(o):
    yield o
    for c in o.children: yield from walk(c)
kill = set()
for o in col.objects:
    nm = o.name.split('.')[0]
    if nm.startswith(('siren_', 'beacon_bar', 'anchor_')) or (o.type == 'MESH' and any(m and m.name in ('Glass',) for m in o.data.materials)):
        for c in walk(o): kill.add(c)
hub = None
for o in col.objects:   # the missing hubcap: the chrome cap of the front-right wheel
    if o.type == 'MESH' and o.parent and o.parent.name.startswith('wheel_FR') and any(m and m.name == 'truckwheel_chrome' for m in o.data.materials): kill.add(o); hub = o.name
for o in kill: bpy.data.objects.remove(o)
ms = [o for o in col.objects if o.type == 'MESH']
for o in ms:
    if len(o.data.polygons) > 200:
        m = o.modifiers.new('dec', 'DECIMATE'); m.ratio = 0.33; m.use_collapse_triangulate = True
bpy.context.view_layer.update(); dg = bpy.context.evaluated_depsgraph_get()
for o in ms:
    if o.modifiers: me = bpy.data.meshes.new_from_object(o.evaluated_get(dg)); o.modifiers.clear(); o.data = me
for im in bpy.data.images:
    if im.size[0] > 128: im.scale(128, 128)
# tin tabs: little folded strips at the body seams, both sides (pressed-tin toys are held together by them)
TIN = bpy.data.materials.new('toy_tin_tab'); TIN.use_nodes = True; b = next(n for n in TIN.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
b.inputs['Base Color'].default_value = (0.55, 0.55, 0.57, 1); b.inputs['Metallic'].default_value = 1.0; b.inputs['Roughness'].default_value = 0.35
dg = bpy.context.evaluated_depsgraph_get(); sc = bpy.context.scene; ntab = 0
for x in (-2.2, -0.9, 0.6, 2.0, 3.1):
    for s in (-1, 1):
        hit, loc, nrm, *_ = sc.ray_cast(dg, Vector((x, s * 4, 1.05)), Vector((0, -s, 0)))
        if not hit: continue
        bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0); bmesh.ops.scale(bm, vec=(0.22, 0.05, 0.32), verts=bm.verts)
        me = bpy.data.meshes.new('toy_tab'); bm.to_mesh(me); bm.free(); t = bpy.data.objects.new('toy_tab', me); me.materials.append(TIN)
        col.objects.link(t); t.parent = root; t.location = loc + Vector((0, s * 0.02, 0)); t.rotation_euler.y = 0.12 * s; ntab += 1
lad = [o for o in col.objects if o.type == 'MESH' and o.get('orig_parent', '').startswith(('Cube.311', 'Plane.004'))]   # the ladder / hose bed top (canvas)
for o in lad:   # bent: the rear end pushed down 8 degrees about its front edge
    xs = [v.co.x for v in o.data.vertices]; x0 = min(xs)
    for v in o.data.vertices: v.co.z -= math.tan(math.radians(8)) * (v.co.x - x0) * 0.35
K = 0.18 / 7.59
root.scale = (K, K, K); bpy.context.view_layer.update()
tris = 0
for o in col.objects:
    if o.type == 'MESH': o.data.calc_loop_triangles(); tris += len(o.data.loop_triangles)
bpy.ops.object.select_all(action='DESELECT')
for o in col.objects: o.select_set(True)
glb = os.path.join(OUT, 'toy_truck.glb'); tmp = glb[:-4] + '_tmp.glb'
bpy.ops.export_scene.gltf(filepath=tmp, export_format='GLB', use_selection=True, export_extras=True, export_yup=True, export_apply=True, export_cameras=False, export_lights=False)
os.replace(tmp, glb)
col.name = 'TOY_TRUCK'; bpy.ops.file.pack_all(); bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, 'toy_truck.blend'), compress=True, copy=True)
print('TOY tris %d tabs %d hubcap_removed %s ladder_parts %d GLB %.2f MB' % (tris, ntab, hub, len(lad), os.path.getsize(glb) / 1e6))
print('TOY_DONE')
