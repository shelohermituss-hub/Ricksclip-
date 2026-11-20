# bl_props2.py: round-2 props (props-hero 2026-11-20). Downloaded assets first (credits in assets/ASSETS.md), adapted to this story; a few small
# parts built here where no fitting free asset exists (velvet cushion, dog-dish hubcap, cross plaster). One GLB (three.js staging) + one .blend
# (final) per prop, same names. Frame: metres, Z up, origin on the ground under the middle; vehicles: front -X, driver side -Y (as the truck).
# blender -b --factory-startup --python bl_props2.py -- <assets dir> <tex dir> <out dir>
import bpy, sys, os, math, json, bmesh
from mathutils import Vector, Matrix
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.append(HERE)
import props_api as PA
A, TEX, OUT = sys.argv[sys.argv.index('--') + 1:][:3]
META = {}

def fresh():
    bpy.ops.wm.read_factory_settings(use_empty=True); s = bpy.context.scene; s.render.engine = 'CYCLES'; s.view_settings.view_transform = 'Standard'; return s
def bsdf(m): return next(n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
def imp(path, keep=None):
    bpy.ops.import_scene.gltf(filepath=path); sc = bpy.context.scene
    ms = [o for o in sc.objects if o.type == 'MESH']
    for o in ms:
        mw = o.matrix_world.copy()
        if o.data.users > 1: o.data = o.data.copy()
        o.parent = None; o.data.transform(mw); o.matrix_world = Matrix.Identity(4)
    for o in [o for o in sc.objects if o.type != 'MESH']: bpy.data.objects.remove(o)
    if keep:
        for o in [o for o in ms if not keep(o)]: bpy.data.objects.remove(o)
    return [o for o in sc.objects if o.type == 'MESH']
def fit(ms, size, axis=None, rot=None, ground=True):
    """rotate (Matrix), scale so the extent along axis (0,1,2; None = longest) = size, centre in XY, origin on the ground."""
    if rot:
        for o in ms: o.data.transform(rot)
    mn, mx = PA.bbox(ms); ext = mx - mn; k = size / (max(ext) if axis is None else ext[axis])
    for o in ms: o.data.transform(Matrix.Scale(k, 4))
    mn, mx = PA.bbox(ms); sh = Vector((-(mn.x + mx.x) / 2, -(mn.y + mx.y) / 2, -mn.z if ground else -(mn.z + mx.z) / 2))
    for o in ms: o.data.transform(Matrix.Translation(sh))
    return PA.bbox(ms)
def rootify(name, ms):
    sc = bpy.context.scene; col = bpy.data.collections.new(name); sc.collection.children.link(col)
    r = bpy.data.objects.new(name, None); col.objects.link(r)
    for o in list(sc.collection.objects) + [o for o in ms if o.name in sc.objects]:
        if o.type in ('MESH', 'EMPTY') and o is not r and o.parent is None:
            for c in list(o.users_collection): c.objects.unlink(o)
            col.objects.link(o); o.parent = r
    return r, col
def anchor(col, root, name, loc):
    e = bpy.data.objects.new('anchor_' + name, None); e.location = loc; col.objects.link(e); e.parent = root; return e
def retint(m, hexs, kind='red', strength=1.0):
    """Replace the red parts of a textured material by hexs (factor = how red the texel is): keeps the asset's shading, dirt and scratches."""
    nt = m.node_tree; p = bsdf(m); L = p.inputs['Base Color'].links
    src = L[0].from_socket if L else None
    if src is None: p.inputs['Base Color'].default_value = PA.lin(hexs); return
    sp = nt.nodes.new('ShaderNodeSeparateColor'); nt.links.new(src, sp.inputs[0])
    d = nt.nodes.new('ShaderNodeMath'); d.operation = 'SUBTRACT'; nt.links.new(sp.outputs[0], d.inputs[0]); nt.links.new(sp.outputs[1], d.inputs[1])
    f = nt.nodes.new('ShaderNodeMath'); f.operation = 'MULTIPLY'; f.use_clamp = True; nt.links.new(d.outputs[0], f.inputs[0]); f.inputs[1].default_value = 4.0 * strength
    # keep the texel's brightness: target x (texel R / its mean red)
    br = nt.nodes.new('ShaderNodeMath'); br.operation = 'MULTIPLY'; nt.links.new(sp.outputs[0], br.inputs[0]); br.inputs[1].default_value = 2.2
    tg = nt.nodes.new('ShaderNodeMix'); tg.data_type = 'RGBA'; tg.blend_type = 'MULTIPLY'; tg.inputs['Factor'].default_value = 1.0
    tg.inputs[6].default_value = PA.lin(hexs); nt.links.new(br.outputs[0], tg.inputs[7])
    mx = nt.nodes.new('ShaderNodeMix'); mx.data_type = 'RGBA'; nt.links.new(f.outputs[0], mx.inputs['Factor']); nt.links.new(src, mx.inputs[6]); nt.links.new(tg.outputs[2], mx.inputs[7])
    nt.links.new(mx.outputs[2], p.inputs['Base Color'])
def new_mat(name, hexs, metal=0.0, rough=0.5, sheen=0.0):
    m = bpy.data.materials.new(name); m.use_nodes = True; p = bsdf(m); p.inputs['Base Color'].default_value = PA.lin(hexs)
    p.inputs['Metallic'].default_value = metal; p.inputs['Roughness'].default_value = rough; p.inputs['Sheen Weight'].default_value = sheen; return m
def img_mat(name, png, rough=0.5, alpha=False):
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; p = bsdf(m); t = nt.nodes.new('ShaderNodeTexImage')
    t.image = bpy.data.images.load(os.path.join(TEX, png)); nt.links.new(t.outputs['Color'], p.inputs['Base Color']); p.inputs['Roughness'].default_value = rough
    if alpha: nt.links.new(t.outputs['Alpha'], p.inputs['Alpha'])
    return m
def lathe(name, prof, mat, steps=48, smooth=True):
    bm = bmesh.new(); ring = []
    for k in range(steps):
        a = 2 * math.pi * k / steps; ring.append([bm.verts.new((r * math.cos(a), r * math.sin(a), z)) for r, z in prof])
    uvl = bm.loops.layers.uv.new()
    for k in range(steps):
        r0, r1 = ring[k], ring[(k + 1) % steps]
        for i in range(len(prof) - 1):
            f = bm.faces.new((r0[i], r1[i], r1[i + 1], r0[i + 1]))
            for lp, uv in zip(f.loops, ((k / steps, i / (len(prof) - 1)), ((k + 1) / steps, i / (len(prof) - 1)), ((k + 1) / steps, (i + 1) / (len(prof) - 1)), (k / steps, (i + 1) / (len(prof) - 1)))): lp[uvl].uv = uv
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    for p in me.polygons: p.use_smooth = smooth
    o = bpy.data.objects.new(name, me); me.materials.append(mat); bpy.context.scene.collection.objects.link(o); return o
def tris(col): n = 0
def save(name, root, col, extra=None):
    n = 0
    for o in col.objects:
        if o.type == 'MESH': o.data.calc_loop_triangles(); n += len(o.data.loop_triangles)
    mn, mx = PA.bbox([o for o in col.objects if o.type == 'MESH'])
    bpy.ops.object.select_all(action='DESELECT')
    for o in col.objects: o.select_set(True)
    glb = os.path.join(OUT, name.lower() + '.glb')
    bpy.ops.export_scene.gltf(filepath=glb, export_format='GLB', use_selection=True, export_extras=True, export_yup=True, export_apply=True, export_cameras=False, export_lights=False)
    for m in bpy.data.materials: m.use_fake_user = True
    bpy.ops.file.pack_all(); bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, name.lower() + '.blend'), compress=True)
    META[name] = dict(tris=n, size=[round(v, 3) for v in mx - mn], **(extra or {}))
    print('PROP2', name, 'tris', n, 'size', META[name]['size'])

# ---------------------------------------------------------------- MILK VAN: "Rustic Chevrolet P30 Step-Van Replica" (the.snajp, CC-BY 4.0)
fresh(); ms = imp(os.path.join(A, 'step_van', 'step_van.glb'))
grill = next(o for o in ms if 'Grill' in o.name); gy = sum((v.co.y for v in grill.data.vertices)) / len(grill.data.vertices)
rot = Matrix.Rotation(math.radians(-90 if gy < 0 else 90), 4, 'Z')      # its front (grille) to -X
mn, mx = fit(ms, 5.40, axis=0, rot=rot)
body = next(m for m in bpy.data.materials if m.name == 'material')
# cream body with one cornflower stripe at waist height (object z band), the van's own dirt texture kept as a multiply
nt = body.node_tree; p = bsdf(body); L = p.inputs['Base Color'].links; src = L[0].from_socket if L else None
tc = nt.nodes.new('ShaderNodeTexCoord'); sz = nt.nodes.new('ShaderNodeSeparateXYZ'); nt.links.new(tc.outputs['Object'], sz.inputs[0])
lo = nt.nodes.new('ShaderNodeMath'); lo.operation = 'GREATER_THAN'; nt.links.new(sz.outputs[2], lo.inputs[0]); lo.inputs[1].default_value = 0.98
hi = nt.nodes.new('ShaderNodeMath'); hi.operation = 'LESS_THAN'; nt.links.new(sz.outputs[2], hi.inputs[0]); hi.inputs[1].default_value = 1.16
band = nt.nodes.new('ShaderNodeMath'); band.operation = 'MULTIPLY'; nt.links.new(lo.outputs[0], band.inputs[0]); nt.links.new(hi.outputs[0], band.inputs[1])
col_ = nt.nodes.new('ShaderNodeMix'); col_.data_type = 'RGBA'; nt.links.new(band.outputs[0], col_.inputs['Factor']); col_.inputs[6].default_value = PA.lin('#F1E7CC'); col_.inputs[7].default_value = PA.lin('#6495ED')
if src:
    gray = nt.nodes.new('ShaderNodeRGBToBW'); nt.links.new(src, gray.inputs[0])
    dirt = nt.nodes.new('ShaderNodeMath'); dirt.operation = 'MULTIPLY_ADD'; nt.links.new(gray.outputs[0], dirt.inputs[0]); dirt.inputs[1].default_value = 0.9; dirt.inputs[2].default_value = 0.45
    mul = nt.nodes.new('ShaderNodeMix'); mul.data_type = 'RGBA'; mul.blend_type = 'MULTIPLY'; mul.inputs['Factor'].default_value = 1.0
    nt.links.new(col_.outputs[2], mul.inputs[6]); nt.links.new(dirt.outputs[0], mul.inputs[7]); nt.links.new(mul.outputs[2], p.inputs['Base Color'])
else: nt.links.new(col_.outputs[2], p.inputs['Base Color'])
p.inputs['Roughness'].default_value = 0.42
for l in list(p.inputs['Roughness'].links): nt.links.remove(l)
# side lettering: one decal on each flank of the box body, found by rays from the side
dg = bpy.context.evaluated_depsgraph_get(); sc = bpy.context.scene; dec = img_mat('van_decal', 'van_decal.png', 0.4, alpha=True)
DW, DH, DX, DZ = 2.9, 1.09, 0.75, 1.62
for s in (-1, 1):
    hit, loc, nrm, *_ = sc.ray_cast(dg, Vector((DX, s * 5, DZ)), Vector((0, -s, 0)))
    yy = (loc.y if hit else s * 1.1) + s * 0.006
    bm = bmesh.new(); uvl = bm.loops.layers.uv.new()
    cs = [(DX - DW / 2, DZ - DH / 2), (DX + DW / 2, DZ - DH / 2), (DX + DW / 2, DZ + DH / 2), (DX - DW / 2, DZ + DH / 2)]
    vs = [bm.verts.new((x, yy, z)) for x, z in cs]; f = bm.faces.new(vs if s < 0 else vs[::-1])
    uvs = ((0, 0), (1, 0), (1, 1), (0, 1)) if s < 0 else ((0, 1), (1, 1), (1, 0), (0, 0))
    uvs = ((0, 0), (1, 0), (1, 1), (0, 1)) if s < 0 else ((1, 1), (0, 1), (0, 0), (1, 0))
    for lp, uv in zip(f.loops, uvs): lp[uvl].uv = uv
    me = bpy.data.meshes.new('van_lettering'); bm.to_mesh(me); bm.free(); o = bpy.data.objects.new('van_lettering', me); me.materials.append(dec); sc.collection.objects.link(o); ms.append(o)
root, col = rootify('MILK_VAN', ms)
wh = next(o for o in ms if 'Wheels' in o.name)
fw = [v.co for v in wh.data.vertices if v.co.x < 0 and v.co.y > 0]
c = Vector((sum(v.x for v in fw) / len(fw), max(v.y for v in fw), sum(v.z for v in fw) / len(fw)))
anchor(col, root, 'hubcap_front_right', c); anchor(col, root, 'cab_door', (mn.x + 1.0, mn.y, 1.0)); anchor(col, root, 'front_corner', (mn.x, mn.y + 0.2, 0.7))
save('MILK_VAN', root, col, dict(hubcap_wheel=[round(v, 3) for v in c]))

# ---------------------------------------------------------------- HUBCAP (built: a 1960s dog-dish, 25 cm, stamped ring, a scuff), spins away on the road
fresh(); CH = new_mat('hub_chrome', '#eeeef0', 1.0, 0.08); SC = new_mat('hub_scuff', '#9a9a9c', 1.0, 0.45)
prof = [(0.0, 0.05), (0.03, 0.05), (0.05, 0.047), (0.075, 0.04), (0.078, 0.036), (0.082, 0.04), (0.086, 0.036), (0.1, 0.028), (0.115, 0.016), (0.124, 0.006), (0.125, 0.0), (0.119, 0.0), (0.118, 0.012)]
h = lathe('hubcap', prof, CH, 64); bpy.context.view_layer.update()
for p_ in h.data.polygons:   # the scuff from the road: a patch of the rim gone dull
    c = p_.center
    if c.x > 0.09 and abs(c.y) < 0.03: p_.material_index = 1
h.data.materials.append(SC)
root, col = rootify('HUBCAP', [h]); save('HUBCAP', root, col)

# ---------------------------------------------------------------- MILK BOTTLE ("Milk", Multipainkiller_Studio, CC-BY) + CRATE ("Antique Wooden Milk Crates", CurlyFryWhy, CC-BY)
# the downloaded "Milk" (Multipainkiller_Studio) is a modern plastic jug: NOT 1970s, so the quart bottle is built: glass, milk with the cream line, foil cap
fresh(); GL = bpy.data.materials.new('bottle_glass'); GL.use_nodes = True; gp = bsdf(GL); gp.inputs['Base Color'].default_value = (0.95, 0.97, 0.96, 1)
gp.inputs['Transmission Weight'].default_value = 1.0; gp.inputs['Roughness'].default_value = 0.04; gp.inputs['IOR'].default_value = 1.5
MILK = new_mat('milk', '#f7f5ee', 0.0, 0.35); bsdf(MILK).inputs['Subsurface Weight'].default_value = 0.6; CREAM = new_mat('cream_line', '#f3e6bf', 0.0, 0.35)
FOIL = new_mat('foil_cap', '#c9cdd3', 1.0, 0.3)
gprof = [(0.0, 0.0), (0.036, 0.0), (0.04, 0.006), (0.041, 0.12), (0.037, 0.15), (0.024, 0.19), (0.019, 0.215), (0.021, 0.222), (0.021, 0.232), (0.017, 0.235), (0.0, 0.235)]
gb = lathe('bottle_glass', gprof, GL, 48)
mk = lathe('bottle_milk', [(0.0, 0.004), (0.037, 0.004), (0.0375, 0.12), (0.034, 0.15), (0.0, 0.15)], MILK, 40)
cl = lathe('bottle_cream', [(0.0, 0.15), (0.034, 0.15), (0.022, 0.187), (0.0, 0.187)], CREAM, 40)
fc = lathe('bottle_foil_cap', [(0.0, 0.238), (0.0215, 0.238), (0.023, 0.228), (0.0225, 0.219)], FOIL, 32)
root, col = rootify('MILK_BOTTLE', [gb, mk, cl, fc]); anchor(col, root, 'grip', (0, 0, 0.09)); save('MILK_BOTTLE', root, col)
fresh(); ms = imp(os.path.join(A, 'milk_crate', 'milk_crate.glb')); fit(ms, 0.92, axis=None)
root, col = rootify('MILK_CRATE', ms); save('MILK_CRATE', root, col)

# ---------------------------------------------------------------- LUNCH BOX ("Woodsman Collection - Lunch Box", re1monsen, CC-BY): the stump and ground dropped
# the downloaded "Woodsman" box is a modern plastic food box (not 1970s): the Old-Timer's domed steel lunch pail is built here instead
fresh(); EN = new_mat('enamel_navy', '#24345e', 0.2, 0.32); STL = new_mat('steel_worn', '#a7a9ac', 1.0, 0.35); WIRE = new_mat('wire_handle', '#8d8f92', 1.0, 0.3)
EN.node_tree.nodes['Principled BSDF'].inputs['Coat Weight'].default_value = 0.5
nt = EN.node_tree; p = bsdf(EN); nz = nt.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 38; nz.inputs['Detail'].default_value = 8
ramp = nt.nodes.new('ShaderNodeValToRGB'); ramp.color_ramp.elements[0].position = 0.68; ramp.color_ramp.elements[1].position = 0.70
nt.links.new(nz.outputs['Fac'], ramp.inputs[0]); mx_ = nt.nodes.new('ShaderNodeMix'); mx_.data_type = 'RGBA'; mx_.inputs[6].default_value = PA.lin('#24345e'); mx_.inputs[7].default_value = PA.lin('#9b9ea3')
nt.links.new(ramp.outputs[0], mx_.inputs['Factor']); nt.links.new(mx_.outputs[2], p.inputs['Base Color'])    # chips through the navy enamel to the steel
L_, W_, H_ = 0.25, 0.17, 0.10
bpy.ops.mesh.primitive_cube_add(size=1); bx_ = bpy.context.object; bx_.name = 'lunch_box_body'; bx_.scale = (L_, W_, H_); bx_.location = (0, 0, H_ / 2)
b = bx_.modifiers.new('b', 'BEVEL'); b.width = 0.008; b.segments = 3; bx_.data.materials.append(EN)
bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=W_ / 2, depth=L_, rotation=(0, math.pi / 2, 0), location=(0, 0, H_)); lid = bpy.context.object; lid.name = 'lunch_box_lid'
lid.scale = (1, 1, 0.75); bm = bmesh.new(); bm.from_mesh(lid.data); bmesh.ops.delete(bm, geom=[v for v in bm.verts if v.co.x > 0.001], context='VERTS'); bm.to_mesh(lid.data); bm.free()
lid.data.materials.append(EN)
for o in (bx_, lid):
    bpy.context.view_layer.objects.active = o; o.select_set(True); bpy.ops.object.transform_apply(location=False, rotation=True, scale=True); o.select_set(False)
for v in lid.data.vertices:
    if v.co.z < 0: v.co.z = 0
lid.data.update(); lid.modifiers.new('s', 'SOLIDIFY').thickness = 0.002
for sx in (-1, 1):   # hinge pins at the back, two latches at the front (one sprung open)
    bpy.ops.mesh.primitive_cube_add(size=1, location=(sx * 0.07, -W_ / 2 - 0.004, H_ - 0.012)); la = bpy.context.object; la.name = 'lunch_box_latch'; la.scale = (0.025, 0.004, 0.03); la.data.materials.append(STL)
    if sx > 0: la.rotation_euler.x = -0.5; la.location.z -= 0.012
    bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=0.004, depth=0.05, rotation=(0, math.pi / 2, 0), location=(sx * 0.07, W_ / 2 + 0.003, H_)); bpy.context.object.name = 'lunch_box_hinge'; bpy.context.object.data.materials.append(STL)
bm = bmesh.new()   # wire handle over the dome, on two ears
pts = [Vector((0.06 * math.cos(t), 0, H_ + 0.064 + 0.03 * math.sin(t))) for t in [math.pi * k / 16 for k in range(17)]]
crv = bpy.data.curves.new('lunch_box_handle', 'CURVE'); crv.dimensions = '3D'; crv.bevel_depth = 0.0025; spl = crv.splines.new('POLY'); spl.points.add(len(pts) - 1)
for pt, q in zip(spl.points, pts): pt.co = (q.x, q.y, q.z, 1)
ho = bpy.data.objects.new('lunch_box_handle', crv); bpy.context.scene.collection.objects.link(ho); crv.materials.append(WIRE)
bpy.context.view_layer.update(); dgh = bpy.context.evaluated_depsgraph_get(); hm = bpy.data.meshes.new_from_object(ho.evaluated_get(dgh)); bpy.data.objects.remove(ho)
ho = bpy.data.objects.new('lunch_box_handle', hm); bpy.context.scene.collection.objects.link(ho)
ms = [o for o in bpy.context.scene.objects if o.type == 'MESH']
for o in ms:
    if o.modifiers:
        bpy.context.view_layer.update(); dgx = bpy.context.evaluated_depsgraph_get(); me = bpy.data.meshes.new_from_object(o.evaluated_get(dgx)); o.modifiers.clear(); o.data = me
for o in ms:
    for pg in o.data.polygons: pg.use_smooth = o.name.startswith(('lunch_box_lid', 'lunch_box_handle'))
root, col = rootify('LUNCH_BOX', ms); mx = PA.bbox(ms)[1]; anchor(col, root, 'lid_top', (0, 0, mx.z)); save('LUNCH_BOX', root, col)

# ---------------------------------------------------------------- LEMON ("Lemon", svnfbgr, CC-BY 4.0 scan): 8.5 cm, lying on its side
fresh(); ms = imp(os.path.join(A, 'lemon', 'lemon.glb'))
mn, mx = PA.bbox(ms); ext = mx - mn; ax = max(range(3), key=lambda i: ext[i])
rot = Matrix.Rotation(math.radians(90), 4, 'X') if ax == 2 else (Matrix.Rotation(math.radians(90), 4, 'Z') if ax == 1 else Matrix.Identity(4))
fit(ms, 0.085, axis=None, rot=rot); root, col = rootify('LEMON', ms); save('LEMON', root, col)

# ---------------------------------------------------------------- PAINT TIN ("Used Open Red Paint Can with Paint Brush", glowbox3d, CC-BY): the red paint
# becomes the film's lemon (retint keeps the drips and dirt), a SUNBEAM ENAMEL label band LEMON YELLOW / LIME / RED (three variants)
for key, hexs, png in (('PAINT_TIN_LEMON', '#E3EA22', 'can_lemon.png'), ('PAINT_TIN_LIME', '#E3EA22', 'can_lime.png'), ('PAINT_TIN_RED', '#D3141C', 'can_red.png')):
    fresh(); ms = imp(os.path.join(A, 'paint_can', 'paint_can.glb'))
    can = max(ms, key=lambda o: len(o.data.polygons)); cmn, cmx = PA.bbox([can]); k = 0.19 / (cmx.z - cmn.z)
    for o in ms: o.data.transform(Matrix.Scale(k, 4))
    cmn, cmx = PA.bbox([can]); sh = Vector((-(cmn.x + cmx.x) / 2, -(cmn.y + cmx.y) / 2, -cmn.z))
    for o in ms: o.data.transform(Matrix.Translation(sh))
    for m in bpy.data.materials:
        if m.node_tree and m.name != 'Material': retint(m, hexs)
    wall = [Vector((v.co.x, v.co.y, 0)).length for v in can.data.vertices if 0.06 < v.co.z < 0.13 and Vector((v.co.x, v.co.y, 0)).length < 0.12]
    R = sorted(wall)[int(len(wall) * 0.97)] + 0.0015     # the can wall (the brush handle and lid lip excluded)
    lab = lathe('can_label', [(R, 0.03), (R, 0.14)], img_mat('label_' + key.lower(), png, 0.45), 64)
    ms.append(lab); root, col = rootify(key, ms); save(key, root, col)

# ---------------------------------------------------------------- MUG ("Classic Red Coffee Mug", hungry_beagle, CC-BY): cream glaze, navy rim line (no red, no teal)
fresh(); ms = imp(os.path.join(A, 'mug', 'mug.glb')); fit(ms, 0.095, axis=2)
for m in bpy.data.materials:
    if m.node_tree:
        p = bsdf(m); p.inputs['Base Color'].default_value = PA.lin('#EFE6CF' if m.name == 'material' else '#F6F1E4'); p.inputs['Roughness'].default_value = 0.18; p.inputs['Coat Weight'].default_value = 0.6
root, col = rootify('MUG', ms); anchor(col, root, 'handle', (0.06, 0, 0.05)); save('MUG', root, col)

# ---------------------------------------------------------------- RIBBON-CUTTING SET: stool ("wooden stool", diana_ver, CC-BY), velvet cushion (built),
# scissors ("Tailor's Scissors", shuvalov.di, Sketchfab Free Standard) lying on the cushion
fresh(); st = imp(os.path.join(A, 'stool', 'stool.glb')); smn, smx = fit(st, 0.46, axis=2)
VEL = new_mat('velvet_navy', '#141c40', 0.0, 0.8, sheen=0.5); bsdf(VEL).inputs['Sheen Tint'].default_value = (0.3, 0.35, 0.6, 1)
GILT = new_mat('gilt_cord', '#d6a23a', 1.0, 0.3)
bpy.ops.mesh.primitive_cube_add(size=1); cu = bpy.context.object; cu.name = 'velvet_cushion'; cu.scale = (0.38, 0.38, 0.075); cu.location = (0, 0, smx.z + 0.04)
bv = cu.modifiers.new('bv', 'BEVEL'); bv.width = 0.03; bv.segments = 6; sub = cu.modifiers.new('sub', 'SUBSURF'); sub.levels = 2
cu.data.materials.append(VEL); bpy.ops.object.shade_smooth()
bpy.context.view_layer.update(); dgc = bpy.context.evaluated_depsgraph_get(); me = bpy.data.meshes.new_from_object(cu.evaluated_get(dgc)); cu.modifiers.clear(); cu.data = me
me.transform(Matrix.Diagonal((0.38, 0.38, 0.075, 1))); cu.scale = (1, 1, 1)
for v in me.vertices:   # plump middle, pinched corners
    r = math.hypot(v.co.x, v.co.y) / 0.27; v.co.z *= 1.0 + 0.35 * max(0, 1 - r * r)
top = smx.z + 0.04; parts = st + [cu]
for sx in (-1, 1):
    for sy in (-1, 1):   # gold tassels at the four corners
        bx, by = sx * 0.175, sy * 0.175
        t1 = lathe('tassel_head', [(0.0, 0.0), (0.012, -0.004), (0.014, -0.016), (0.008, -0.024), (0.0, -0.025)], GILT, 16); t1.location = (bx, by, top)
        t2 = lathe('tassel_skirt', [(0.006, -0.024), (0.016, -0.05), (0.02, -0.075), (0.0, -0.076)], GILT, 20); t2.location = (bx, by, top)
        parts += [t1, t2]
cord = lathe('cushion_piping', [(0.0, 0.0)], GILT, 4)   # placeholder (removed below)
bpy.data.objects.remove(cord)
sc_ = imp(os.path.join(A, 'scissors', 'scissors.glb')); sc_ = [o for o in sc_ if o not in parts]
for m in {m for o in sc_ for m in o.data.materials if m}:
    nt = m.node_tree; p = bsdf(m); L = p.inputs['Base Color'].links
    if L:   # green handle texels (G > R) become gilt; the steel blades keep their texture
        src = L[0].from_socket; sp = nt.nodes.new('ShaderNodeSeparateColor'); nt.links.new(src, sp.inputs[0])
        d = nt.nodes.new('ShaderNodeMath'); d.operation = 'SUBTRACT'; nt.links.new(sp.outputs[1], d.inputs[0]); nt.links.new(sp.outputs[0], d.inputs[1])
        f = nt.nodes.new('ShaderNodeMath'); f.operation = 'MULTIPLY'; f.use_clamp = True; nt.links.new(d.outputs[0], f.inputs[0]); f.inputs[1].default_value = 6.0
        mx_ = nt.nodes.new('ShaderNodeMix'); mx_.data_type = 'RGBA'; nt.links.new(f.outputs[0], mx_.inputs['Factor']); nt.links.new(src, mx_.inputs[6]); mx_.inputs[7].default_value = PA.lin('#d6a23a')
        nt.links.new(mx_.outputs[2], p.inputs['Base Color'])
        ml = p.inputs['Metallic'].links
        if not ml: p.inputs['Metallic'].default_value = 1.0
smn2, smx2 = PA.bbox(sc_); k = 0.26 / max(smx2 - smn2)
for o in sc_: o.data.transform(Matrix.Scale(k, 4))
smn2, smx2 = PA.bbox(sc_); flat = (smx2 - smn2); 
if flat.y > flat.z: pass
else:
    for o in sc_: o.data.transform(Matrix.Rotation(math.radians(90), 4, 'X'))
smn2, smx2 = PA.bbox(sc_); cz = top + 0.075 * 1.3 / 2 + 0.006
for o in sc_: o.data.transform(Matrix.Translation(Vector((-(smn2.x + smx2.x) / 2, -(smn2.y + smx2.y) / 2, cz - smn2.z))) @ Matrix.Rotation(math.radians(20), 4, 'Z'))
root, col = rootify('RIBBON_SET', parts + sc_); anchor(col, root, 'scissors_grip', (0.08, 0, cz + 0.01)); save('RIBBON_SET', root, col)

# ---------------------------------------------------------------- CROSS PLASTER (built; plan rows 31-34): two crossed fabric strips with a pad, 30 cm (a cartoon-big
# sticking plaster on a truck fender); origin = centre, lies on its local XY plane, +Z out of the surface
fresh(); TAN = new_mat('plaster_fabric', '#d9b48f', 0.0, 0.85); PAD = new_mat('plaster_pad', '#f3ece0', 0.0, 0.9)
def strip(name, ang):
    bm = bmesh.new(); bmesh.ops.create_grid(bm, x_segments=16, y_segments=2, size=0.5)
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free(); me.transform(Matrix.Diagonal((0.30, 0.075, 1, 1)))
    for v in me.vertices: v.co.z = 0.004 + 0.0015 * math.cos(v.co.x * 20)      # fabric ripple
    me.transform(Matrix.Rotation(math.radians(ang), 4, 'Z')); o = bpy.data.objects.new(name, me); me.materials.append(TAN)
    bpy.context.scene.collection.objects.link(o); o.modifiers.new('t', 'SOLIDIFY').thickness = 0.002; return o
a1, a2 = strip('plaster_strip_a', 45), strip('plaster_strip_b', -45); a2.location.z = 0.002
bpy.ops.mesh.primitive_cube_add(size=1); pd = bpy.context.object; pd.name = 'plaster_pad'; pd.scale = (0.07, 0.07, 0.004); pd.location = (0, 0, 0.0085); pd.data.materials.append(PAD)
bpy.ops.object.transform_apply(scale=True)
root, col = rootify('PLASTER', [a1, a2, pd]); save('PLASTER', root, col)

json.dump(META, open(os.path.join(OUT, 'props2_meta.json'), 'w'), indent=1)
print('PROPS2_DONE')
