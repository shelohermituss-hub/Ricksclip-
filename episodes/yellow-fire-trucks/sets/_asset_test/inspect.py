# blender -b --factory-startup --python inspect.py -- file.glb ; prints size, tris, objects, materials, textures
import bpy, sys, mathutils
f = sys.argv[sys.argv.index('--')+1]
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=f)
mn = mathutils.Vector((1e9,)*3); mx = -mn
tris = 0; meshes = 0
dg = bpy.context.evaluated_depsgraph_get()
for o in bpy.context.scene.objects:
    if o.type != 'MESH': continue
    meshes += 1
    for c in o.bound_box:
        w = o.matrix_world @ mathutils.Vector(c); mn = mathutils.Vector(map(min, mn, w)); mx = mathutils.Vector(map(max, mx, w))
    me = o.data; me.calc_loop_triangles(); tris += len(me.loop_triangles)
d = mx - mn
print('FILE', f.split('/')[-1]); print('SIZE m', [round(x,2) for x in d], 'min', [round(x,2) for x in mn])
print('TRIS', tris, 'MESH OBJECTS', meshes)
mats = [m for m in bpy.data.materials if m.users]
print('MATERIALS', len(mats))
for m in mats[:80]:
    tex = [n.image.name+'%dx%d' % tuple(n.image.size) for n in (m.node_tree.nodes if m.node_tree else []) if n.type == 'TEX_IMAGE' and n.image]
    bsdf = next((n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'), None) if m.node_tree else None
    col = tuple(round(x,2) for x in bsdf.inputs['Base Color'].default_value[:3]) if bsdf else None
    print('  MAT', m.name[:40], 'users', m.users, 'col', col, 'tex', tex[:3])
print('IMAGES', len(bpy.data.images))
