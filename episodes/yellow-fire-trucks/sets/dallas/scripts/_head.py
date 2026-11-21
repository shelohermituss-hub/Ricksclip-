import bpy, bmesh, math, os, sys, json, random
from mathutils import Vector, Matrix
A = sys.argv[sys.argv.index('--') + 1:]; PH, TEX, AP, OUT = [os.path.abspath(p) for p in A[:4]]
sys.path.append(os.path.dirname(os.path.abspath(__file__))); import dallas_api as TA
os.makedirs(OUT, exist_ok=True); rnd = random.Random(14)
bpy.ops.wm.read_factory_settings(use_empty=True)
SC = bpy.context.scene
def coll(name, parent=None):
    c = bpy.data.collections.new(name); (parent or SC.collection).children.link(c); return c
TOWN, TPL = coll('DALLAS'), coll('TPL'); bpy.context.view_layer.layer_collection.children['TPL'].exclude = True
def lin(h):
    h = h.lstrip('#'); v = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return [(c / 12.92 if c <= .04045 else ((c + .055) / 1.055) ** 2.4) for c in v] + [1.]

# ------------------------------------------------------------------ materials (Principled only, so the GLB carries the same look)
MATS = {}
GRP = ['']   # merge group of the coded parts made next (story switches: stack2, stack3, ladder, painters, cal1..4 stay separate nodes)
def img(path, cs='sRGB'):
    i = bpy.data.images.load(path, check_existing=True); i.colorspace_settings.name = cs; return i
def mat(name, tex=None, col='#ffffff', rough=.75, metal=0., png=None, alpha=False, emit=None, emit_png=None, coat=0., normal=1.):
    if name in MATS: return MATS[name]
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; N, L = nt.nodes, nt.links; b = N['Principled BSDF']
    b.inputs['Base Color'].default_value = lin(col); b.inputs['Roughness'].default_value = rough; b.inputs['Metallic'].default_value = metal
    if coat: b.inputs['Coat Weight'].default_value = coat
    if tex:
        t = N.new('ShaderNodeTexImage'); t.image = img(os.path.join(TEX, tex + '_diff.jpg')); L.new(t.outputs[0], b.inputs['Base Color'])
        r = N.new('ShaderNodeTexImage'); r.image = img(os.path.join(TEX, tex + '_rough.jpg'), 'Non-Color'); L.new(r.outputs[0], b.inputs['Roughness'])
        n = N.new('ShaderNodeTexImage'); n.image = img(os.path.join(TEX, tex + '_nor_gl.jpg'), 'Non-Color')
        nm = N.new('ShaderNodeNormalMap'); nm.inputs['Strength'].default_value = normal; L.new(n.outputs[0], nm.inputs['Color']); L.new(nm.outputs[0], b.inputs['Normal'])
    if png:
        t = N.new('ShaderNodeTexImage'); t.image = img(os.path.join(TEX, png + '.png')); L.new(t.outputs[0], b.inputs['Base Color'])
        if alpha: L.new(t.outputs[1], b.inputs['Alpha']); m.surface_render_method = 'DITHERED'
    if emit_png:
        t = N.new('ShaderNodeTexImage'); t.image = img(os.path.join(TEX, emit_png + '.png')); L.new(t.outputs[0], b.inputs['Emission Color'])
    elif emit: b.inputs['Emission Color'].default_value = lin(emit)
    b.inputs['Emission Strength'].default_value = 0.
    MATS[name] = m; return m

# ------------------------------------------------------------------ mesh builders (world-space verts, world-planar UVs: a texture keeps its real size)
def obj_from_bm(bm, name, m, tile=None, uv01=False, coll_=None, smooth=False):
    me = bpy.data.meshes.new(name); uvl = bm.loops.layers.uv.verify()
    if tile and not uv01:
        for f in bm.faces:
            n = f.normal; ax = max(range(3), key=lambda i: abs(n[i]))
            for lp in f.loops:
                p = lp.vert.co; u, v = ((p.y, p.z) if ax == 0 else (p.x, p.z) if ax == 1 else (p.x, p.y))
                lp[uvl].uv = (u / tile, v / tile)
    if smooth:
        for f in bm.faces: f.smooth = abs(f.normal.z) < .7
    bm.to_mesh(me); bm.free(); o = bpy.data.objects.new(name, me); me.materials.append(m); (coll_ or TOWN).objects.link(o); o['merge'] = 1; o['grp'] = GRP[0]; return o
def box(name, sx, sy, sz, x, y, z, m, tile=1., rot=0., c=None):
    """box sx (east) x sy (north) x sz (up); (x, y) centre, z = bottom; rot = degrees about Z."""
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.)
    R = Matrix.Rotation(math.radians(rot), 3, 'Z')
    for v in bm.verts: v.co = R @ Vector((v.co.x * sx, v.co.y * sy, (v.co.z + .5) * sz)) + Vector((x, y, z))
    bm.normal_update(); return obj_from_bm(bm, name, m, tile, coll_=c)
def cyl(name, r, h, x, y, z, m, seg=16, r2=None, tile=.5, rx=0., ry=0., rz=0.):
    bm = bmesh.new(); bmesh.ops.create_cone(bm, cap_ends=True, segments=seg, radius1=r, radius2=r if r2 is None else r2, depth=h)
    R = Matrix.Rotation(math.radians(rz), 3, 'Z') @ Matrix.Rotation(math.radians(ry), 3, 'Y') @ Matrix.Rotation(math.radians(rx), 3, 'X')
    for v in bm.verts: v.co = R @ (v.co + Vector((0, 0, h / 2))) + Vector((x, y, z))
    bm.normal_update(); return obj_from_bm(bm, name, m, tile, smooth=True)
def tube(name, pts, r, m, seg=6):
    bm = bmesh.new(); rings = []
    for i, p in enumerate(pts):
        d = (pts[min(i + 1, len(pts) - 1)] - pts[max(i - 1, 0)]).normalized(); a = d.orthogonal().normalized(); b = d.cross(a)
        rings.append([bm.verts.new(p + (a * math.cos(k * 2 * math.pi / seg) + b * math.sin(k * 2 * math.pi / seg)) * r) for k in range(seg)])
    for i in range(len(rings) - 1):
        for k in range(seg): bm.faces.new((rings[i][k], rings[i][(k + 1) % seg], rings[i + 1][(k + 1) % seg], rings[i + 1][k]))
    bm.normal_update(); return obj_from_bm(bm, name, m, .5, smooth=True)
def beam(name, p0, p1, r, m, seg=6): return tube(name, [Vector(p0), Vector(p1)], r, m, seg)
def quad(name, w, h, cx, cy, cz, yaw, m, c=None, flat=False):
    """picture plane w x h, UV 0..1. yaw = the way its face looks (deg, 0 = -Y south, 90 = +X east, 180 = north). flat = lies on the ground."""
    bm = bmesh.new(); a = math.radians(yaw)
    if flat:
        R = Matrix.Rotation(a, 3, 'Z'); cs = [R @ Vector(v) for v in ((-w / 2, -h / 2, 0), (w / 2, -h / 2, 0), (w / 2, h / 2, 0), (-w / 2, h / 2, 0))]
    else:
        ex = Vector((math.cos(a), math.sin(a), 0)); cs = [ex * (-w / 2) + Vector((0, 0, -h / 2)), ex * (w / 2) + Vector((0, 0, -h / 2)), ex * (w / 2) + Vector((0, 0, h / 2)), ex * (-w / 2) + Vector((0, 0, h / 2))]
    vs = [bm.verts.new(Vector((cx, cy, cz)) + c_) for c_ in cs]; f = bm.faces.new(vs); uvl = bm.loops.layers.uv.verify()
    for lp, uv in zip(f.loops, ((0, 0), (1, 0), (1, 1), (0, 1))): lp[uvl].uv = uv
    bm.normal_update(); o = obj_from_bm(bm, name, m, uv01=True, coll_=c); return o
def gable(name, sx, sy, h, x, y, z, m, ridge='x', over=.45, tile=2.):
    """a gable roof: two slabs + its gable triangles are the walls' job. ridge along x or y; overhang over."""
    bm = bmesh.new(); t = .12
    if ridge == 'x':
        hw = sy / 2 + over; L = sx / 2 + over
        P = [(-L, -hw, 0), (L, -hw, 0), (L, 0, h), (-L, 0, h), (-L, hw, 0), (L, hw, 0)]
    else:
        hw = sx / 2 + over; L = sy / 2 + over
        P = [(-hw, -L, 0), (-hw, L, 0), (0, L, h), (0, -L, h), (hw, -L, 0), (hw, L, 0)]
    up = [bm.verts.new(Vector(p) + Vector((x, y, z + t))) for p in P]; dn = [bm.verts.new(Vector(p) + Vector((x, y, z))) for p in P]
    for a_, b_, c_, d_ in ((0, 1, 2, 3), (3, 2, 5, 4)):
        bm.faces.new((up[a_], up[b_], up[c_], up[d_])); bm.faces.new((dn[d_], dn[c_], dn[b_], dn[a_]))
    for e in ((0, 1), (4, 5)): bm.faces.new((dn[e[0]], dn[e[1]], up[e[1]], up[e[0]]) if e == (0, 1) else (up[e[0]], up[e[1]], dn[e[1]], dn[e[0]]))
    if ridge == 'y': bmesh.ops.reverse_faces(bm, faces=bm.faces[:])
    bm.normal_update(); return obj_from_bm(bm, name, m, tile)
def tri_wall(name, w, h, x, y, z, yaw, m, tile=1.):
    bm = bmesh.new(); a = math.radians(yaw); ex = Vector((math.cos(a), math.sin(a), 0))
    vs = [bm.verts.new(Vector((x, y, z)) + p) for p in (ex * (-w / 2), ex * (w / 2), Vector((0, 0, h)))]; bm.faces.new(vs)
    bm.normal_update(); return obj_from_bm(bm, name, m, tile)

# ------------------------------------------------------------------ ready-made assets: a template per asset (joined, origin at its foot), linked copies
TPLS = {}
def asset(aid, keep=None, drop=None, name=None, scale=1.):
    name = name or aid
    if name in TPLS: return TPLS[name]
    before = set(bpy.data.objects); bpy.ops.import_scene.gltf(filepath=aid if aid.endswith('.glb') else os.path.join(PH, 'models', aid, aid + '.gltf'))
    new = [o for o in bpy.data.objects if o not in before]
    for o in new:
        for c in list(o.users_collection): c.objects.unlink(o)
        TPL.objects.link(o)
    ms = [o for o in new if o.type == 'MESH' and (not keep or any(k in o.name for k in keep)) and not (drop and any(d in o.name for d in drop))]
    for o in new:
        if o not in ms: bpy.data.objects.remove(o, do_unlink=True)
    for o in ms: o.parent = None
    bpy.context.view_layer.update()
    for o in ms: o.data = o.data.copy(); o.data.transform(o.matrix_world); o.matrix_world = Matrix()
    ctx = bpy.context; base = ms[0]
    with ctx.temp_override(active_object=base, selected_editable_objects=ms, selected_objects=ms):
        bpy.ops.object.join()
    o = base; me = o.data; vs = [v.co for v in me.vertices]
    mn = Vector((min(v.x for v in vs), min(v.y for v in vs), min(v.z for v in vs))); mx = Vector((max(v.x for v in vs), max(v.y for v in vs), max(v.z for v in vs)))
    me.transform(Matrix.Translation(-Vector(((mn.x + mx.x) / 2, (mn.y + mx.y) / 2, mn.z)))); me.transform(Matrix.Scale(scale, 4))
    o.name = 'tpl_' + name; me.name = 'tpl_' + name; o['size'] = list((mx - mn) * scale); TPLS[name] = o; return o
def put(name, x, y, z=0., rz=0., s=1., tag=None):
    t = TPLS[name]; o = bpy.data.objects.new(name + '.%03d' % len([1 for k in TOWN.objects if k.name.startswith(name + '.')]), t.data)
    o.location = (x, y, z); o.rotation_euler = (0, 0, math.radians(rz)); o.scale = (s, s, s) if not isinstance(s, (tuple, list)) else s; TOWN.objects.link(o); o['asset'] = name; o['grp'] = GRP[0]
    if tag: o['tag'] = tag
    return o
def tint_asset(name, col, amount=.6):
    """repaint a ready-made asset for this story: mix its base colour toward col (a new material per asset)."""
    for i, s in enumerate(TPLS[name].material_slots):
        m = s.material.copy(); m.name = s.material.name + '_ph'; b = m.node_tree.nodes.get('Principled BSDF'); s.material = m
        if not b: continue
        lk = b.inputs['Base Color'].links
        if lk:
            src = lk[0].from_socket; mix = m.node_tree.nodes.new('ShaderNodeMix'); mix.data_type = 'RGBA'; mix.blend_type = 'MULTIPLY'; mix.inputs[0].default_value = amount
            m.node_tree.links.new(src, mix.inputs[6]); mix.inputs[7].default_value = lin(col); m.node_tree.links.new(mix.outputs[2], b.inputs['Base Color'])
        else: b.inputs['Base Color'].default_value = lin(col)

ANCH = {}
def anchor(name, x, y, z=0.):
    ANCH[name] = [round(x, 3), round(y, 3), round(z, 3)]; e = bpy.data.objects.new('anchor_' + name, None); e.location = (x, y, z); e.empty_display_size = .3; TOWN.objects.link(e)
