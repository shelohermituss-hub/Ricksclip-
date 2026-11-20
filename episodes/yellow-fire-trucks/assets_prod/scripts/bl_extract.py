# blender -b --factory-startup --python bl_extract.py -- <glb> <outdir> <tag>
# Dumps every texture of a GLB as PNG and a JSON list of the mesh objects (name, materials, world bbox, tris). No render.
import bpy, sys, json, os, mathutils
a = sys.argv[sys.argv.index('--') + 1:]; f, out, tag = a
os.makedirs(out, exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=f)
objs = []
for o in bpy.context.scene.objects:
    if o.type != 'MESH': continue
    mn = mathutils.Vector((1e9,) * 3); mx = -mn
    for c in o.bound_box:
        w = o.matrix_world @ mathutils.Vector(c); mn = mathutils.Vector(map(min, mn, w)); mx = mathutils.Vector(map(max, mx, w))
    o.data.calc_loop_triangles()
    objs.append(dict(name=o.name, parent=o.parent.name if o.parent else None, mats=[m.name for m in o.data.materials if m],
                     mn=[round(v, 3) for v in mn], mx=[round(v, 3) for v in mx], tris=len(o.data.loop_triangles)))
mats = {}
for m in bpy.data.materials:
    if not m.users or not m.node_tree: continue
    d = {}
    for n in m.node_tree.nodes:
        if n.type == 'TEX_IMAGE' and n.image:
            sock = [l.to_socket.name + '@' + l.to_node.name for l in n.outputs[0].links]
            d[n.image.name] = sock
    mats[m.name] = d
for im in bpy.data.images:
    if im.size[0] == 0: continue
    p = os.path.join(out, '%s__%s.png' % (tag, im.name))
    im2 = im.copy(); im2.filepath_raw = p; im2.file_format = 'PNG'
    try: im2.save()
    except Exception as e: print('SAVE FAIL', im.name, e)
json.dump(dict(objects=objs, materials=mats), open(os.path.join(out, tag + '_objects.json'), 'w'), indent=0)
print('EXTRACT_DONE', tag, len(objs), 'objects')
