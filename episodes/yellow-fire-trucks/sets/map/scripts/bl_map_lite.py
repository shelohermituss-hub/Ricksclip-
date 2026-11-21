# bl_map_lite.py: the LITE staging copy of THE MAP for the three.js kit (the final render stays on out/map.blend, untouched).
# blender -b out/map.blend --python bl_map_lite.py -- <out dir> <assets_prod>   -> out/map_lite.glb, out/map_truck_tiny.glb. Prints LITE_DONE.
# Means: trucks left out of the set GLB (the kit instances one 4-material tiny truck in every bay: 4 draw calls for 94 trucks, LECONS 2026-11-21);
# props capped at 6 k triangles, the print at 4096 px. Every glTF instance is counted per instance (LITE_TRIS).
import bpy, sys, os, json
a = sys.argv[sys.argv.index('--') + 1:]; OUT, AP = os.path.abspath(a[0]), os.path.abspath(a[1])
for o in [o for o in bpy.data.objects if o.get('map_truck') is not None or o.type == 'LIGHT' or o.type == 'CAMERA']: bpy.data.objects.remove(o)
for n in ('LIME', 'RED'):
    c = bpy.data.collections.get(n)
    if c:
        for o in list(c.all_objects): bpy.data.objects.remove(o)
        bpy.data.collections.remove(c)
bpy.data.images['map_print.jpg'].filepath = os.path.join(os.path.dirname(bpy.data.images['map_print.jpg'].filepath), 'map_print_4k.jpg'); bpy.data.images['map_print.jpg'].reload()
sb = bpy.data.objects.get('sand_blend'); sb.hide_render = False
dg = bpy.context.evaluated_depsgraph_get()
def tris(me): me.calc_loop_triangles(); return len(me.loop_triangles)
for o in bpy.data.objects:
    if o.type != 'MESH' or o.users_collection[0].name != 'PROPS': continue
    t = tris(o.data)
    if t > 6000 and o.data.users == 1 or (t > 1500 and o.data.users > 1):
        m = o.modifiers.new('dec', 'DECIMATE'); m.ratio = (6000 if o.data.users == 1 else 1500) / t
bpy.context.view_layer.update(); dg = bpy.context.evaluated_depsgraph_get(); done = {}
for o in bpy.data.objects:
    if o.type == 'MESH' and o.modifiers:
        key = o.data.name
        if key not in done: done[key] = bpy.data.meshes.new_from_object(o.evaluated_get(dg))
        o.modifiers.clear(); o.data = done[key]
T = 0
for o in bpy.data.objects:
    if o.type == 'MESH' and o.visible_get(): T += tris(o.data)
bpy.ops.object.select_all(action='DESELECT')
for o in bpy.data.objects:
    if o.type in ('MESH', 'EMPTY'): o.select_set(True)
glb = os.path.join(OUT, 'map_lite.glb')
bpy.ops.export_scene.gltf(filepath=glb, export_format='GLB', use_selection=True, export_extras=True, export_yup=True, export_apply=True, export_cameras=False, export_lights=False)
print('LITE_TRIS', T, 'GLB %.1f MB' % (os.path.getsize(glb) / 1e6), flush=True)
# the tiny truck: truck_light joined, 4 materials, about 4 k triangles
bpy.ops.wm.read_factory_settings(use_empty=True)
with bpy.data.libraries.load(os.path.join(AP, 'out', 'truck_light.blend'), link=False) as (src, dst): dst.collections = ['TRUCK']
col = dst.collections[0]; bpy.context.scene.collection.children.link(col)
NEW = {k: bpy.data.materials.new('tiny_' + k) for k in ('paint', 'chrome', 'dark', 'white')}
for k, (c, r, m) in dict(paint=('#ffffff', .3, 0), chrome=('#d8d8dc', .2, 1), dark=('#26242a', .7, 0), white=('#efeee8', .4, 0)).items():
    NEW[k].use_nodes = True; b = NEW[k].node_tree.nodes['Principled BSDF']; h = c.lstrip('#'); b.inputs['Base Color'].default_value = [(int(h[i:i + 2], 16) / 255) ** 2.2 for i in (0, 2, 4)] + [1]
    b.inputs['Roughness'].default_value = r; b.inputs['Metallic'].default_value = m
def kind(n):
    n = (n or '').lower()
    if n.startswith(('body_paint', 'paint2', 'letters')): return 'paint'
    if any(w in n for w in ('metal', 'alum', 'aloom', 'chrome', 'brass', 'lorry', 'diamond', 'packard')): return 'chrome'
    if any(w in n for w in ('white', 'glass', 'canvas', 'bulb', 'beacon', 'light', 'dial', 'speedo')): return 'white'
    return 'dark'
ms = [o for o in col.all_objects if o.type == 'MESH' and not o.get('mask') and not (o.parent and o.parent.get('mask'))]
for o in ms:
    o.data = o.data.copy()
    for sl in o.material_slots: sl.material = NEW[kind(sl.material.name if sl.material else '')]
for o in [o for o in col.all_objects if o not in ms]: bpy.data.objects.remove(o)
bpy.ops.object.select_all(action='DESELECT')
for o in ms: o.select_set(True)
bpy.context.view_layer.objects.active = ms[0]
for o in ms: o.matrix_world = o.matrix_world.copy()
bpy.ops.object.parent_clear(type='CLEAR_KEEP_TRANSFORM'); bpy.ops.object.join(); j = bpy.context.object; j.name = 'tiny_truck'
m = j.modifiers.new('dec', 'DECIMATE'); m.ratio = 4000 / max(1, tris(j.data)); bpy.ops.object.modifier_apply(modifier='dec')
for o in list(bpy.data.objects):
    if o != j: bpy.data.objects.remove(o)
j.select_set(True)
bpy.ops.export_scene.gltf(filepath=os.path.join(OUT, 'map_truck_tiny.glb'), export_format='GLB', use_selection=True, export_yup=True, export_apply=True)
print('TINY_TRIS', tris(j.data)); print('LITE_DONE')
