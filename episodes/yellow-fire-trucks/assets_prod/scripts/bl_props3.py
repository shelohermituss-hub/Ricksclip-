# bl_props3.py: round-3 props (props-hero 2026-11-21): the red playground ball (built) and the five LOST THINGS of S6 (downloads, credits in
# assets/ASSETS.md): wagon, kite, boot, watering can, tricycle. Each: one GLB (kit, plain glTF materials) + one .blend (final) with a "grey" dusk state
# (props_api.set_grey(root, k); the kit twin is assets.js setGrey). Sizes a touch above life so they read at phone size on the S6 lawn.
# Frame: metres, Z up, origin on the ground under the middle. blender -b --factory-startup --python bl_props3.py -- <assets dir> <tex dir> <out dir>
import bpy, sys, os, math, json, bmesh
from mathutils import Vector, Matrix
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.append(HERE)
import props_api as PA
A, TEX, OUT = sys.argv[sys.argv.index('--') + 1:][:3]
META = {}
DUSK = PA.lin('#6a6470')   # the grey the lost things drain to (a lighter cousin of the truck's #4B4753, so they still read on the dusk lawn)


def fresh():
    bpy.ops.wm.read_factory_settings(use_empty=True); s = bpy.context.scene; s.render.engine = 'CYCLES'; s.view_settings.view_transform = 'Standard'; return s
def bsdf(m): return next((n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'), None)
def imp(path):
    if path.endswith('.gltf') or path.endswith('.glb'): bpy.ops.import_scene.gltf(filepath=path)
    sc = bpy.context.scene; ms = [o for o in sc.objects if o.type == 'MESH']
    for o in ms:
        mw = o.matrix_world.copy()
        if o.data.users > 1: o.data = o.data.copy()
        o.parent = None; o.data.transform(mw); o.matrix_world = Matrix.Identity(4)
    for o in [o for o in sc.objects if o.type != 'MESH']: bpy.data.objects.remove(o)
    return [o for o in sc.objects if o.type == 'MESH']
def fit(ms, size, rot=None):
    if rot:
        for o in ms: o.data.transform(rot)
    mn, mx = PA.bbox(ms); k = size / max(mx - mn)
    for o in ms: o.data.transform(Matrix.Scale(k, 4))
    mn, mx = PA.bbox(ms); sh = Vector((-(mn.x + mx.x) / 2, -(mn.y + mx.y) / 2, -mn.z))
    for o in ms: o.data.transform(Matrix.Translation(sh))
    return PA.bbox(ms)
def grey_nodes(m):
    """Base Color -> mix(own, luminance x dusk tint, factor = Value node 'phfd_grey'). Added AFTER the GLB export (the kit does it in GLSL)."""
    p = bsdf(m)
    if p is None or 'phfd_grey' in m.node_tree.nodes: return
    nt = m.node_tree; L = p.inputs['Base Color'].links
    if L: src = L[0].from_socket
    else:
        rgb = nt.nodes.new('ShaderNodeRGB'); rgb.outputs[0].default_value = p.inputs['Base Color'].default_value; src = rgb.outputs[0]
    bw = nt.nodes.new('ShaderNodeRGBToBW'); nt.links.new(src, bw.inputs[0])
    tint = nt.nodes.new('ShaderNodeMix'); tint.data_type = 'RGBA'; tint.blend_type = 'MULTIPLY'; tint.inputs['Factor'].default_value = 1.0
    nt.links.new(bw.outputs[0], tint.inputs[6]); tint.inputs[7].default_value = [min(1.0, c * 2.4) for c in DUSK[:3]] + [1]
    v = nt.nodes.new('ShaderNodeValue'); v.name = 'phfd_grey'; v.outputs[0].default_value = 0.0
    mx = nt.nodes.new('ShaderNodeMix'); mx.data_type = 'RGBA'; nt.links.new(v.outputs[0], mx.inputs['Factor']); nt.links.new(src, mx.inputs[6]); nt.links.new(tint.outputs[2], mx.inputs[7])
    nt.links.new(mx.outputs[2], p.inputs['Base Color'])
def save(name, ms, anchors=None, note=''):
    sc = bpy.context.scene; col = bpy.data.collections.new(name.upper()); sc.collection.children.link(col)
    r = bpy.data.objects.new(name.upper(), None); col.objects.link(r)
    for o in ms:
        for c in list(o.users_collection): c.objects.unlink(o)
        col.objects.link(o); o.parent = r
    for k, v in (anchors or {}).items():
        e = bpy.data.objects.new('anchor_' + k, None); e.location = v; col.objects.link(e); e.parent = r
    n = 0
    for o in ms: o.data.calc_loop_triangles(); n += len(o.data.loop_triangles)
    mn, mx = PA.bbox(ms)
    bpy.ops.object.select_all(action='DESELECT')
    for o in col.objects: o.select_set(True)
    glb = os.path.join(OUT, name + '.glb'); tmp = glb[:-4] + '_tmp.glb'
    bpy.ops.export_scene.gltf(filepath=tmp, export_format='GLB', use_selection=True, export_extras=True, export_yup=True, export_apply=True, export_cameras=False, export_lights=False)
    os.replace(tmp, glb)
    for m in {m for o in ms for m in o.data.materials if m}: grey_nodes(m); m.use_fake_user = True
    bpy.ops.file.pack_all(); bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, name + '.blend'), compress=True, copy=True)
    META[name] = dict(tris=n, size=[round(v, 3) for v in mx - mn], note=note); print('PROP3', name, 'tris', n, 'size', META[name]['size'])
def new_mat(name, hexs, metal=0.0, rough=0.5):
    m = bpy.data.materials.new(name); m.use_nodes = True; p = bsdf(m); p.inputs['Base Color'].default_value = PA.lin(hexs)
    p.inputs['Metallic'].default_value = metal; p.inputs['Roughness'].default_value = rough; return m
def flat_side_down(ms):   # rotation that puts the thinnest extent on Z
    mn, mx = PA.bbox(ms); e = mx - mn; ax = min(range(3), key=lambda i: e[i])
    return Matrix.Rotation(math.radians(90), 4, 'X') if ax == 1 else (Matrix.Rotation(math.radians(90), 4, 'Y') if ax == 0 else Matrix.Identity(4))

# ---------------------------------------------------------------- RED BALL (built): a 28 cm red rubber playground ball, two cream seam rings,
# two cream stars, a grass stain (tex_r3.py ball_red.png on the sphere's own UVs), raised seam ridges
fresh(); R = 0.14
bpy.ops.mesh.primitive_uv_sphere_add(radius=R, segments=64, ring_count=32, location=(0, 0, R)); b = bpy.context.object; b.name = 'ball_rubber'
bpy.ops.object.shade_smooth()
m = bpy.data.materials.new('ball_red_rubber'); m.use_nodes = True; p = bsdf(m); t = m.node_tree.nodes.new('ShaderNodeTexImage')
t.image = bpy.data.images.load(os.path.join(TEX, 'ball_red.png')); m.node_tree.links.new(t.outputs['Color'], p.inputs['Base Color']); p.inputs['Roughness'].default_value = 0.45
p.inputs['Coat Weight'].default_value = 0.25; b.data.materials.append(m)
ridges = []
for zz in (-0.4, 0.4):   # the seam rings stand 1.5 mm proud (the uv ring at v .3 / .7 sits at z = -cos(.3 pi) R ...)
    zr = R * math.cos(math.pi * (0.5 + zz * 0.5)); rr = math.sqrt(max(0, R * R - zr * zr))
    bpy.ops.mesh.primitive_torus_add(major_radius=rr + 0.0005, minor_radius=0.0025, major_segments=64, minor_segments=8, location=(0, 0, R - zr))
    o = bpy.context.object; o.name = 'ball_seam'; o.data.materials.append(new_mat('ball_seam_cream', '#ece2c8', 0.0, 0.5)); bpy.ops.object.shade_smooth(); ridges.append(o)
ms = [b] + ridges
for o in ms:
    bpy.context.view_layer.objects.active = o; o.select_set(True); bpy.ops.object.transform_apply(location=True, rotation=True, scale=True); o.select_set(False)
save('red_ball', ms, {'centre': (0, 0, R)}, 'built (no fitting free asset of a 1940s rubber ball)')

# ---------------------------------------------------------------- LOST THINGS (downloads)
LOST = [('lost_wagon', 'wagon/wagon.glb', 1.0, None), ('lost_kite', 'kite/kite.glb', 0.9, 'flat'), ('lost_boot', 'rubber_boots/rubber_boots_1k.gltf', 0.38, 'one'),
        ('lost_watering_can', 'watering_can_metal_01/watering_can_metal_01_1k.gltf', 0.5, None), ('lost_tricycle', 'tricycle/tricycle.glb', 0.75, None)]
for name, f, size, how in LOST:
    fresh(); ms = imp(os.path.join(A, f))
    for o in list(ms):   # ground planes / backdrops shipped with some models
        mn, mx = PA.bbox([o]); e = mx - mn
        if len(o.data.polygons) <= 2 and min(e) < 1e-4: bpy.data.objects.remove(o); ms.remove(o)
    rot = None
    if how == 'flat': rot = flat_side_down(ms) @ Matrix.Identity(4)
    if how == 'one':   # the pair of boots -> ONE boot (the half on the -X side of the longest horizontal axis)
        bpy.ops.object.select_all(action='DESELECT')
        for o in ms: o.select_set(True)
        bpy.context.view_layer.objects.active = ms[0]; bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT'); bpy.ops.mesh.separate(type='LOOSE'); bpy.ops.object.mode_set(mode='OBJECT')
        ms = [o for o in bpy.context.scene.objects if o.type == 'MESH']; mn, mx = PA.bbox(ms); ax = 0 if (mx.x - mn.x) > (mx.y - mn.y) else 1; mid = (mn[ax] + mx[ax]) / 2
        for o in list(ms):
            a_, b_ = PA.bbox([o])
            if (a_[ax] + b_[ax]) / 2 > mid: bpy.data.objects.remove(o); ms.remove(o)
    mn, mx = fit(ms, size, rot)
    if how == 'flat':   # the kite lies on the lawn tipped 12 degrees (one spar on a tuft), tail string kept
        for o in ms: o.data.transform(Matrix.Rotation(math.radians(12), 4, 'X'))
        mn, mx = fit(ms, size)
    if name == 'lost_boot':   # fallen over on its side
        for o in ms: o.data.transform(Matrix.Rotation(math.radians(80), 4, 'X'))
        mn, mx = fit(ms, size)
    save(name, ms, {'top': (0, 0, mx.z)}, f)

json.dump(META, open(os.path.join(OUT, 'props3_meta.json'), 'w'), indent=1)
print('PROPS3_DONE')
