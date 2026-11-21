# bl_dallas.py: builds PLACE B, the DALLAS FIRE DEPT. STATION 14 yard at hot noon, in Blender (set-builder 2026-11-21). One world: the station (two bays,
# office wing, shed) facing south on a pale concrete apron, the two tally boards between the trucks, sand and dry grass round the lot, the street and its 4th
# wall south, far: water tank, oil derrick + pump jacks, a low skyline. Ready-made CC0 Poly Haven models and textures first (assets/ASSETS.md DALLAS);
# code builds only what no asset gives (station, boards + easels, calendar, cooler, fence, poles, tank, derrick, skyline, lettering).
# blender -b --factory-startup --python bl_dallas.py -- <assets/ph_dallas> <build/tex> <assets_prod> <out dir>
#   -> out/dallas.blend (full, trucks linked, story switches), out/dallas.glb, out/dallas_lite.glb (kit staging copy), out/dallas_meta.json (anchors, light, groups)
# Frame: metres, X east, Y north, Z up. Story: sets/dallas_STORY.md. GENERATED from scripts/_head.py (helpers shared with bl_town.py) + _body.py + _tail.py by build_dallas.sh.
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
# ================================================================== MATERIALS of Dallas (noon palette: pale stucco, pale concrete, sand, dry grass; nothing teal, no red brick)
M = dict(
    stucco=mat('stucco', 'stucco'), stucco_tan=mat('stucco_tan', 'stucco_tan'), stucco_grey=mat('stucco_grey', 'stucco_grey'), yard=mat('yard', 'yard', rough=.8),
    bayfloor=mat('bay_floor', 'bay_floor', rough=.5), sand=mat('sand', 'sand', rough=.95), drygrass=mat('drygrass_ground', 'drygrass', rough=.95),
    shutter=mat('shutter', 'shutter', rough=.45, metal=.3), walk=mat('walk', 'walk'), asphalt=mat('asphalt', 'asphalt', rough=.85), rust=mat('rust', 'rust', rough=.7, metal=.4),
    wood=mat('wood', 'wood', rough=.75), block=mat('block', 'block'), gravel=mat('gravel', 'gravel', rough=.95), sheet=mat('sheet', 'sheet', rough=.4, metal=.6),
    corr=mat('corr', 'corr', rough=.55, metal=.5), far=mat('ground_far', 'far', rough=.95),
    navy=mat('navy_paint', col='#27365a', rough=.35, coat=.4), ink=mat('dark_metal', col='#2a2a2e', rough=.4, metal=.8), chrome=mat('chrome', col='#e8e8ea', rough=.08, metal=1.),
    galv=mat('galvanised', col='#b9bcbd', rough=.35, metal=.9), steel=mat('steel_silver', col='#c9cdd2', rough=.3, metal=.9), rubber=mat('rubber', col='#1e1e1f', rough=.8),
    wire=mat('wire', col='#2a2a2c', rough=.6), slate_back=mat('slate_back', col='#4a4440', rough=.85), pine=mat('pine_raw', col='#c7a477', rough=.8),
    cloth=mat('drop_cloth', col='#e6dfcf', rough=.95), cream=mat('cream_paint', col='#efe8d6', rough=.5), glassd=mat('glass_dark', col='#2b3442', rough=.04, coat=1.),
    fluor=mat('lamp_fluor', col='#f4f6f0', rough=.2, emit='#eef3ff'), tankpaint=mat('tank_paint', col='#d4d6d2', rough=.4, metal=.3),
    hazeA=mat('haze_near', col='#a9b2bc', rough=.9), hazeB=mat('haze_far', col='#9fadc2', rough=.9), hazeC=mat('haze_farthest', col='#b0bdd0', rough=.9),
    derrick=mat('derrick_far', col='#8d8378', rough=.8, metal=.3), oiltank=mat('oil_tank_far', col='#d9d7cf', rough=.5), paper=mat('paper', col='#f3efe4', rough=.9),
    chalk=mat('chalk', col='#f2f0e8', rough=.95), card=mat('card_brown', col='#7a5a3c', rough=.9), dryblade=mat('dry_blade', col='#bfa767', rough=.9),
)
SIGN = lambda n, r=.6: mat('sign_' + n, png=n, rough=r)
DECAL = lambda n: mat('decal_' + n, png=n, alpha=True, rough=.7)
def flat(name, w, h, cx, cy, z, m, yaw=0.):
    o = quad(name, w, h, cx, cy, z, yaw, m, flat=True); return o
# ================================================================== GROUND (the apron is the stage; sand and dry grass round it; the street south)
SY = 22.0   # station front wall
bm = bmesh.new()
for (x0, y0, x1, y1, z) in [(-23, -1.8, 31, SY, .0)]:
    vs = [bm.verts.new((x0, y0, z + .12)), bm.verts.new((x1, y0, z + .12)), bm.verts.new((x1, y1, z + .12)), bm.verts.new((x0, y1, z + .12))]; bm.faces.new(vs)
    for a_, b_ in ((0, 1), (1, 2), (3, 0)):
        p, q = vs[a_].co, vs[b_].co; bm.faces.new((bm.verts.new((p.x, p.y, 0)), bm.verts.new((q.x, q.y, 0)), bm.verts.new((q.x, q.y, p.z)), bm.verts.new((p.x, p.y, p.z))))
bm.normal_update(); obj_from_bm(bm, 'apron', M['yard'], 3.)
box('sand_lot', 900, 900, .02, 0, 200, -.02, M['sand'], 4.)
for (cx, cy, sx, sy) in [(-34, 14, 20, 34), (42, 12, 22, 30), (4, 44, 70, 20), (-60, 60, 40, 60), (70, 60, 50, 60)]:       # dry-grass verges and lots
    box('drygrass_%d' % cx, sx, sy, .02, cx, cy, -.005, M['drygrass'], 3.)
box('street', 900, 10, .02, 0, -7.6, 0, M['asphalt'], 4.)
box('kerb_n', 900, .3, .15, 0, -2.45, 0, M['walk'], 1.); box('walk_n', 900, .5, .12, 0, -2.0, 0, M['walk'], 1.5)
box('kerb_s', 900, .3, .15, 0, -12.75, 0, M['walk'], 1.); box('walk_s', 900, 3, .12, 0, -14.4, 0, M['walk'], 1.5)
for i in range(14):                                                    # expansion joints every 4 m both ways (sawn lines, dark, with dust)
    flat('joint_x%d' % i, 54, .06, 4, -1.8 + 4 * (i % 6 + 1), .125, DECAL('decal_joint')) if i < 6 else None
for i in range(14): flat('joint_y%d' % i, .06, 24, -23 + 4 * i, 10, .125, DECAL('decal_joint'))
for bx in (-3.2, 3.2):
    flat('oil_bay%d' % bx, 3.2, 3.0, bx, SY - 1.6, .127, DECAL('decal_oil'), rnd.uniform(0, 30)); flat('oil_apron%d' % bx, 2.0, 2.0, bx + .3, 14.8, .127, DECAL('decal_oil'), 70)
    flat('tracks%d' % bx, 2.6, 21, bx, 9.5, .126, DECAL('decal_tracks'))
for (x, y, s) in [(-12, 6, 4), (14, 4, 3.5), (9, 17, 3), (-15, 15, 3), (22, 8, 4)]: flat('cracks_%d' % x, s, s, x, y, .126, DECAL('decal_cracks'), rnd.uniform(0, 90))
flat('chalk_dust', 2.6, 1.8, 0, 7.9, .128, DECAL('decal_dust'))
# ================================================================== THE STATION: one storey, flat roof with parapet, two bays, office wing east, shed west
X0, X1, H, PAR = -12.5, 12.5, 5.6, .7
BAYS = (-3.2, 3.2); BW, BH = 4.4, 4.4
def wall_with_holes(name, x0, x1, y, z0, z1, holes, m, t=.3):
    """a south wall (y = its face) from x0..x1, z0..z1, with rectangular holes (cx, w, zb, zt): built as boxes around the holes."""
    xs = sorted(set([x0, x1] + [h[0] - h[1] / 2 for h in holes] + [h[0] + h[1] / 2 for h in holes]))
    for a_, b_ in zip(xs[:-1], xs[1:]):
        mid = (a_ + b_) / 2; hs = [h for h in holes if h[0] - h[1] / 2 <= mid <= h[0] + h[1] / 2]
        if not hs: box(name, b_ - a_, t, z1 - z0, mid, y + t / 2, z0, m, 2.); continue
        h = hs[0]
        if h[2] > z0: box(name + '_lo', b_ - a_, t, h[2] - z0, mid, y + t / 2, z0, m, 2.)
        if h[3] < z1: box(name + '_hi', b_ - a_, t, z1 - h[3], mid, y + t / 2, h[3], m, 2.)
wall_with_holes('st_front', X0, X1, SY, 0, H, [(bx, BW, 0, BH) for bx in BAYS], M['stucco'])
box('st_back', X1 - X0, .3, H, 0, SY + 12, 0, M['stucco'], 2.); box('st_w', .3, 12, H, X0 + .15, SY + 6, 0, M['stucco'], 2.); box('st_e', .3, 12, H, X1 - .15, SY + 6, 0, M['stucco'], 2.)
box('st_roof', X1 - X0, 12, .25, 0, SY + 6, H - .25, M['block'], 3.)
for (sx, sy, x, y) in [(X1 - X0 + .3, .3, 0, SY + .0), (X1 - X0 + .3, .3, 0, SY + 12), (.3, 12, X0, SY + 6), (.3, 12, X1, SY + 6)]:
    box('parapet', sx, sy, PAR, x, y, H, M['stucco'], 2.); box('coping', sx + .12, sy + .12, .08, x, y, H + PAR, M['galv'], 1.)
box('plinth', X1 - X0 + .1, .08, .45, 0, SY - .02, 0, M['block'], 1.)                # a pale block plinth along the base, scuffed
SIGNM = SIGN('sign_front', .55)
quad('sign_front', 12.0, 1.5, 0, SY - .04, BH + .62 + .55, 0, SIGNM)                  # DALLAS FIRE DEPT. painted on the band over the bays
box('sign_band_trim_t', 12.4, .08, .07, 0, SY - .05, BH + 1.92, M['navy']); box('sign_band_trim_b', 12.4, .08, .07, 0, SY - .05, BH + .5, M['navy'])
for bx in BAYS:
    box('bay_floor', BW, 11.5, .02, bx, SY + 6, .1, M['bayfloor'], 3.)
    box('bay_head_trim', BW + .3, .1, .16, bx, SY - .05, BH, M['navy']); box('bay_jamb_l', .14, .12, BH, bx - BW / 2 - .07, SY - .06, 0, M['navy']); box('bay_jamb_r', .14, .12, BH, bx + BW / 2 + .07, SY - .06, 0, M['navy'])
    cyl('shutter_drum', .38, BW - .1, bx - (BW - .1) / 2, SY + .5, BH - .42, M['shutter'], seg=20, ry=90)      # the rolled steel shutter in its drum
    for k in range(4): box('shutter_slat', BW - .1, .05, .1, bx, SY + .2, BH - .2 - k * .11, M['shutter'], 1.)
    box('shutter_bar', BW - .1, .08, .06, bx, SY + .18, BH - .66, M['ink'])
    for sgn in (-1, 1): box('shutter_track', .07, .1, BH, bx + sgn * (BW / 2 - .06), SY + .2, 0, M['galv'])
    for k in range(3): box('bay_tube', .12, 1.4, .06, bx - 1.2 + k * 1.2, SY + 5, BH - .1, M['fluor'])
    for sgn in (-1, 1): cyl('bollard', .11, 1.05, bx + sgn * (BW / 2 + .45), SY - .35, 0, M['galv'], seg=12)      # galvanised bollards guard the jambs
    box('bay_back_rack', 3.0, .4, 2.0, bx, SY + 11.6, 0, M['ink'], 1.)
    for k in range(5): cyl('coat_hook_gear', .18, 1.0, bx - 1.2 + k * .6, SY + 11.4, .9, M['ink'] if k % 2 else M['galv'], seg=8)   # turnout coats on hooks (dark lumps)
box('inner_wall', .3, 11.5, H, 0, SY + 6, 0, M['stucco'], 2.)                   # the pier wall between the bays runs to the back
for px in (X0 + .2, -8.0, -5.6 - .2, 5.6 + .2, 8.0, X1 - .2):                  # stucco pilasters with a block cap break the long front
    box('pilaster', .5, .22, H + PAR - .1, px, SY - .11, 0, M['stucco'], 2.); box('pilaster_cap', .62, .3, .14, px, SY - .12, H + PAR - .1, M['block'])
for wx in (-10.2, 10.2):                                                       # clerestory windows + louvre in the end bays of the front
    quad('clere', 2.4, .9, wx, SY - .02, 3.6, 0, mat('win_office_1', png='win_office_1', rough=.06, coat=1.)); box('clere_sill', 2.6, .16, .06, wx, SY - .08, 3.12, M['block'])
    box('louvre_frame', 1.2, .08, .8, wx, SY - .04, 1.2, M['galv'])
    for k in range(6): box('louvre_blade', 1.1, .1, .04, wx, SY - .08, 1.27 + k * .12, M['steel'], 1., 0)
    box('hose_cab', .9, .3, 1.1, wx + (1.6 if wx < 0 else -1.6), SY - .15, .5, M['navy'])
    box('hose_cab_window', .6, .02, .5, wx + (1.6 if wx < 0 else -1.6), SY - .31, .95, M['glassd'])
for bx in BAYS:                                                                # white guide lines from each bay out to the nose line (no yellow lines)
    for sgn in (-1, 1): box('guide_line', .12, 12.5, .004, bx + sgn * 1.55, SY - 6.3, .121, M['chalk'], 1.)
# office wing east: lower, flat, three windows with blinds, the person door, STATION 14 plate, a canopy; shed west in corrugated sheet
OX0, OX1, OH = X1, X1 + 11, 4.2
wall_with_holes('off_front', OX0, OX1, SY, 0, OH, [(OX0 + 2.0, 1.1, 0, 2.3), (OX0 + 4.6, 1.6, 1.0, 2.6), (OX0 + 7.0, 1.6, 1.0, 2.6), (OX0 + 9.4, 1.6, 1.0, 2.6)], M['stucco'])
box('off_back', OX1 - OX0, .3, OH, (OX0 + OX1) / 2, SY + 10, 0, M['stucco'], 2.); box('off_e', .3, 10, OH, OX1 - .15, SY + 5, 0, M['stucco'], 2.)
box('off_roof', OX1 - OX0, 10, .2, (OX0 + OX1) / 2, SY + 5, OH - .2, M['block'], 3.)
for (sx, sy, x, y) in [(OX1 - OX0, .3, (OX0 + OX1) / 2, SY), (.3, 10, OX1, SY + 5)]: box('off_parapet', sx, sy, .5, x, y, OH, M['stucco'], 2.); box('off_coping', sx + .1, sy + .1, .06, x, y, OH + .5, M['galv'])
for i, wx in enumerate((OX0 + 4.6, OX0 + 7.0, OX0 + 9.4)):
    quad('win_office', 1.6, 1.6, wx, SY + .12, 1.8, 0, mat('win_office_%d' % i, png='win_office_%d' % i, rough=.06, coat=1.))
    box('win_sill', 1.8, .2, .06, wx, SY - .06, .94, M['block']); box('win_head', 1.8, .1, .1, wx, SY - .03, 2.6, M['navy'])
    for k in (-1, 0, 1): box('win_mullion', .05, .06, 1.6, wx + k * .8, SY + .05, 1.0, M['navy'])
    box('ac_box', .7, .55, .45, wx + .35, SY - .2, 1.05, M['galv'], 1.) if i == 1 else None       # a window AC box with its drip stain
DX = OX0 + 2.0
box('door', 1.0, .06, 2.25, DX, SY + .15, 0, M['navy'], 1.); cyl('door_knob', .035, .06, DX + .38, SY + .08, 1.0, M['chrome'], seg=10, rx=90)
box('door_frame_l', .08, .1, 2.3, DX - .55, SY - .02, 0, M['cream']); box('door_frame_r', .08, .1, 2.3, DX + .55, SY - .02, 0, M['cream']); box('door_frame_t', 1.18, .1, .08, DX, SY - .02, 2.3, M['cream'])
box('door_step', 1.4, .5, .14, DX, SY - .25, .1, M['walk'])
box('canopy', 2.2, 1.1, .1, DX, SY - .55, 2.75, M['galv'], 1.)
for sgn in (-1, 1): beam('canopy_rod', (DX + sgn * 1.0, SY - 1.05, 2.8), (DX + sgn * 1.0, SY, 3.6), .015, M['ink'])
quad('sign_station', 1.6, .5, DX + 1.95, SY - .03, 3.15, 0, SIGN('sign_station', .4))      # STATION 14 enamel plate
for sgn in (-1, 1): cyl('plate_screw', .02, .02, DX + 1.95 + sgn * .72, SY - .04, 3.15 + .17, M['chrome'], seg=6, rx=90)
SX0 = X0 - 8
box('shed', 8, 9, 3.4, SX0 + 4, SY + 5, 0, M['corr'], 2.); box('shed_roof', 8.4, 9.6, .12, SX0 + 4, SY + 5, 3.4, M['sheet'], 2.)
box('shed_door', 2.6, .05, 2.6, SX0 + 4.5, SY + .48, 0, M['sheet'], 1.)
# roof: 3 AC units with fan grilles, vent stacks, a radio mast with guy wires, roof ladder on the east side, downspouts
for i, (ax, ay) in enumerate([(-8, SY + 5), (-5.5, SY + 8), (7.5, SY + 6)]):
    box('ac_unit', 1.6, 1.2, 1.0, ax, ay, H, M['galv'], 1.); cyl('ac_fan', .45, .05, ax, ay, H + 1.0, M['ink'], seg=16)
    for k in range(6): box('ac_fin', 1.5, .02, .8, ax, ay - .55 + k * .2, H + .1, M['steel'])
for (vx, vy) in [(-1.5, SY + 3), (2.0, SY + 9), (10, SY + 3)]: cyl('vent', .1, 1.2, vx, vy, H, M['galv'], seg=10); cyl('vent_cap', .17, .1, vx, vy, H + 1.2, M['galv'], seg=10)
MX, MY = 4.5, SY + 4
beam('mast', (MX, MY, H), (MX, MY, H + 7.5), .045, M['steel'])
for k in range(3): beam('mast_rung', (MX - .3, MY, H + 2 + k * 2), (MX + .3, MY, H + 2 + k * 2), .012, M['steel'])
for (gx, gy) in [(-3, -2.5), (3, -2.5), (0, 3.5)]: beam('guy', (MX, MY, H + 6.5), (MX + gx, MY + gy, H + .05), .008, M['wire'])
cyl('mast_whip', .015, 2.0, MX, MY, H + 7.5, M['ink'], seg=6)
for k in range(12): beam('roof_ladder', (X1 + .25, SY + 9.6, .3 + k * .45), (X1 + .25, SY + 10.2, .3 + k * .45), .015, M['galv'])
for sgn in (9.6, 10.2): beam('roof_ladder_rail', (X1 + .25, SY + sgn, 0), (X1 + .25, SY + sgn, H + 1.2), .025, M['galv'])
for dx in (X0 + .3, X1 - .3, -1.0): beam('downspout', (dx, SY - .12, H + .4), (dx, SY - .12, .25), .055, M['galv']); box('splash', .3, .5, .04, dx, SY - .35, .12, M['block'])
# ================================================================== STORY PROPS AT THE NOSE LINE: the two tally boards, the calendar, ladder, stool, chalk table
NOSE = 8.4; BY = NOSE + .05; BRX, BLX = -.95, .95; BW_, BH_, BZ = 1.2, 2.4, .62
def slate_board(tag, x, z, png):
    GRP[0] = tag
    quad('slate_face', BW_, BH_, x, BY - .025, z + BH_ / 2, 0, mat('slate_' + png, png=png, rough=.82))
    box('slate_back', BW_, .04, BH_, x, BY, z, M['slate_back'])
    for (w_, h_, dx, dz) in [(BW_ + .12, .06, 0, -.06), (BW_ + .12, .06, 0, BH_), (.06, BH_ + .12, -BW_ / 2 - .03, -.06), (.06, BH_ + .12, BW_ / 2 + .03, -.06)]:
        box('slate_frame', w_, .07, h_, x + dx, BY - .03, z + dz, M['pine'], .5)
    for k in range(4): cyl('nail_head', .012, .012, x + (-.62 if k < 2 else .62), BY - .07, z + (.1 if k % 2 == 0 else BH_ - .1), M['ink'], seg=6, rx=90)
    GRP[0] = ''
def easel(tag, x, top, back=1.1):
    GRP[0] = tag
    for sgn in (-1, 1):
        px = x + sgn * (BW_ / 2 - .12)
        box('post', .09, .09, top, px, BY + .08, 0, M['wood'], .6)
        beam('rear_leg', (px, BY + .1, top * .78), (px, BY + .1 + back, 0), .035, M['wood'])
        box('post_foot', .3, .3, .05, px, BY + .08, 0, M['wood'])
    beam('cross_tie', (x - BW_ / 2 + .12, BY + .1 + back * .55, top * .78 * .45), (x + BW_ / 2 - .12, BY + .1 + back * .55, top * .78 * .45), .025, M['wood'])
    GRP[0] = ''
easel('', BRX, BZ + BH_ + .25); easel('', BLX, BZ + BH_ + .25)
slate_board('', BRX, BZ, 'board_red_1'); slate_board('', BLX, BZ, 'board_lime')
for x in (BRX, BLX): box('chalk_ledge', BW_ + .1, .12, .04, x, BY - .08, BZ - .05, M['pine'])
for k in range(5): cyl('chalk_stick', .006, .07, BLX - .3 + k * .12, BY - .1, BZ - .01, M['chalk'], seg=6, ry=90)
z2 = BZ + BH_ + .06; slate_board('stack2', BRX, z2, 'board_red_2'); easel('stack2', BRX, z2 + BH_ + .25, back=2.0)
z3 = z2 + BH_ + .06; slate_board('stack3', BRX, z3, 'board_red_3'); easel('stack3', BRX, z3 + BH_ + .2, back=2.8)
for tag, zz in (('stack2', z2), ('stack3', z3)):                               # the odd battens that nail one board on the next (crooked, different woods)
    GRP[0] = tag
    for k, sgn in enumerate((-1, 1)): box('batten', .1, .05, .9, BRX + sgn * .42 + rnd.uniform(-.05, .05), BY - .075, zz - .45, M['pine'] if k else M['wood'], .5, rot=rnd.uniform(-6, 6))
    GRP[0] = ''
GRP[0] = 'stack3'
for sgn in (-1, 1): beam('guy_rope', (BRX + sgn * .5, BY, z3 + BH_ - .2), (BRX + sgn * 3.2, BY + 2.6, 0), .008, M['pine'])    # the tall stack guyed against the wind
for sgn in (-1, 1): cyl('peg', .03, .35, BRX + sgn * 3.2, BY + 2.6, -.2, M['wood'], seg=6)
GRP[0] = ''
# the 4-leaf calendar on a batten between the easels: back board, nail, string; four leaves YEAR 1 (front) .. YEAR 4 (cal1..cal4 tear off)
box('cal_batten', 2.0, .06, .08, 0, BY + .02, 2.55, M['wood']); cyl('cal_nail', .01, .06, 0, BY - .03, 2.5, M['ink'], seg=6, rx=90)
for sgn in (-1, 1): beam('cal_string', (0, BY - .03, 2.5), (sgn * .2, BY - .03, 2.3), .004, M['wire'])
box('cal_back', .44, .02, .62, 0, BY - .01, 1.68, M['card'])
for i in range(4, 0, -1):
    GRP[0] = 'cal%d' % i; quad('cal_leaf', .4, .56, 0, BY - .025 - (4 - i) * .004, 2.0, 0, mat('cal_year%d' % i, png='cal_year%d' % i, rough=.9)); GRP[0] = ''
for k in range(3):                                                             # torn leaves of the years gone by, lying on the concrete (E8, light)
    o = flat('leaf_torn', .4, .56, rnd.uniform(-.6, .6), BY - rnd.uniform(.4, 1.0), .135 + k * .002, mat('cal_year%d' % (k + 1), png='cal_year%d' % (k + 1), rough=.9), rnd.uniform(-40, 40))
asset('small_wooden_table_01'); put('small_wooden_table_01', 2.1, NOSE - .6, .12, 8)            # the trestle with the chalk box and the clerk's clipboard
box('chalk_box', .22, .12, .07, 2.0, NOSE - .6, .65, M['card'])
for k in range(7): cyl('chalk_in_box', .006, .08, 1.92 + k * .025, NOSE - .6, .7, M['chalk'], seg=6, rx=90)
cyl('chalk_rolled', .006, .07, 2.4, NOSE - .9, .13, M['chalk'], seg=6, ry=90, rz=30)
asset('clipboard'); put('clipboard', 2.3, NOSE - .55, .65, -12)
GRP[0] = 'stool'; asset('folding_wooden_stool'); put('folding_wooden_stool', BRX - .1, NOSE - .55, .12, 10); GRP[0] = ''
GRP[0] = 'ladder'; asset('ladder_sectioned_01')
LZ = z3 + BH_ - .4; LF = (BRX + .05, NOSE - 1.25)                             # the sectioned ladder: two copies, section on section, leaning on the stack
ang = math.degrees(math.atan2(BY - .1 - LF[1], LZ))
for k in range(2):
    o = put('ladder_sectioned_01', LF[0], LF[1] + (BY - .1 - LF[1]) * k * .48, .12 + LZ * k * .48, 0, (1.3, 1.3, LZ * .52 / 2.13)); o.rotation_euler = (math.radians(-ang), 0, 0)
GRP[0] = ''
# the water cooler on the pier between the bays (row 28): galvanised can on a stand, brass tap, tin cup on a chain, a dark wet patch under the tap
GX, GY = 0, SY - .45
for sx in (-1, 1):
    for sy in (-1, 1): beam('cooler_leg', (GX + sx * .2, GY + sy * .2, 0.12), (GX + sx * .2, GY + sy * .2, .9), .018, M['galv'])
box('cooler_shelf', .5, .5, .03, GX, GY, .9, M['galv']); cyl('cooler_can', .2, .62, GX, GY, .93, M['galv'], seg=20); cyl('cooler_lid', .22, .05, GX, GY, 1.55, M['galv'], seg=20)
cyl('cooler_knob', .03, .05, GX, GY, 1.6, M['ink'], seg=8); cyl('cooler_tap', .02, .1, GX, GY - .22, 1.02, M['chrome'], seg=8, rx=90)
for k in range(3): box('cooler_band', .43, .43, .02, GX, GY, 1.05 + k * .2, M['steel'])
cyl('tin_cup', .045, .09, GX + .16, GY - .2, .93, M['galv'], seg=12); beam('cup_chain', (GX + .16, GY - .2, 1.02), (GX + .1, GY - .18, 1.3), .004, M['steel'])
flat('wet_patch', .5, .4, GX, GY - .3, .126, DECAL('decal_oil'), 10)
# ================================================================== THE PAINTERS' CORNER (line 13): east of the lime truck, its open driver side
GRP[0] = 'painters'
PX = 3.2 + 1.25 + 1.3
asset('wooden_ladder'); put('wooden_ladder', PX + .2, 10.0, .12, 95); put('wooden_ladder', PX + .1, 14.6, .12, 80)
flat('drop_cloth', 2.0, 6.5, PX - .2, 12.2, .13, M['cloth'], 2)
for k in range(40): flat('drip', rnd.uniform(.03, .12), rnd.uniform(.03, .1), PX - .2 + rnd.uniform(-.9, .9), 12.2 + rnd.uniform(-3, 3), .132, M['chalk'] if k % 3 else M['card'], rnd.uniform(0, 90))
for nm, x, y in (('paint_tin_red', PX - .4, 11.0), ('paint_tin_lime', PX + .1, 11.3), ('paint_tin_lemon', PX - .1, 13.4), ('paint_tin_red', PX + .45, 13.0)):
    asset(os.path.join(AP, 'out', nm + '.glb'), name=nm); put(nm, x, y, .13, rnd.uniform(0, 360))
asset('barrel_03'); put('barrel_03', PX + 1.1, 12.0, .12, 30)                 # the drum that holds the order sheet
put('clipboard', PX + 1.1, 12.0, 1.06, 75); quad('order_sheet', .21, .27, PX + 1.1, 12.0, 1.07, 165, mat('order_sheet', png='order_sheet', rough=.9), flat=True)
asset('spray_paint_bottles', drop=['dirty']); put('spray_paint_bottles', PX + .9, 11.4, .12, 20)
asset('wooden_bucket_02'); put('wooden_bucket_02', PX + .8, 13.6, .12, 0)
GRP[0] = ''
anchor('painters_spot', PX + .3, 12.2, .13); anchor('order_sheet', PX + 1.1, 12.0, 1.08)
# ================================================================== YARD DRESSING (wear, leftovers, small life of the place)
asset('industrial_wall_lamp', scale=1.4)
for bx in BAYS: put('industrial_wall_lamp', bx, SY - .08, BH + .02, 0)
asset('fire_hydrant', drop=['_aged', 'cap_02', 'cap_03']); tint_asset('fire_hydrant', '#c9c7c0', .8); put('fire_hydrant', X1 + 1.2, SY - 2.6, .12, 0)
asset('metal_trash_can', drop=['rust']); put('metal_trash_can', X0 + 1.4, SY - .6, .12, 0)
asset('metal_jerrycan'); put('metal_jerrycan', X0 + 2.3, SY - .5, .12, 20); asset('propane_tank'); put('propane_tank', X0 - .8, SY - .7, .12)
asset('tool_cart'); put('tool_cart', BAYS[0] - 1.4, SY + 3.5, .1, 90); asset('metal_tool_chest'); put('metal_tool_chest', BAYS[1] + 1.6, SY + 9, .1, 180)
asset('wooden_crate_02'); put('wooden_crate_02', SX0 + 1.2, SY - .9, .02, 90); put('wooden_crate_02', SX0 + 1.3, SY - .9, .48, 84)
asset('old_tyre'); put('old_tyre', SX0 + 2.6, SY - .5, .02, 0); asset('oil_tin'); put('oil_tin', SX0 + 2.2, SY - 1.3, .02, 40); put('oil_tin', SX0 + 2.0, SY - 1.1, .02, 10)
asset('painted_wooden_bench'); put('painted_wooden_bench', DX + 2.4, SY - .5, .12, 0); asset('metal_jug'); put('metal_jug', DX + 2.1, SY - .5, .56, 0)
asset('can_rusted'); put('can_rusted', DX + 2.7, SY - .45, .56, 0)
asset('garden_hose_wall_mounted_01', scale=1.6); put('garden_hose_wall_mounted_01', X0 + 3.3, SY - .02, 1.0, 0)
asset('water_manhole_cover'); put('water_manhole_cover', 0, 15.6, .12)
asset('cardboard_box_01'); put('cardboard_box_01', OX1 - 1.0, SY - .5, .12, 15)
asset('concrete_road_barrier'); put('concrete_road_barrier', -20.5, 0.4, .0, 90); put('concrete_road_barrier', 28.5, 0.4, .0, 90)
for (x, y) in [(-6.5, 3.5), (6.8, 2.8)]: box('wheel_chock', .25, .35, .16, x, y, .12, M['wood']) 
# the hose laid out to dry on the west verge: a flat cotton hose in long S-bends
pts = [Vector((-22.2 + math.sin(k * .5) * .5, -0.5 + k * .55, .04)) for k in range(40)]; tube('hose_drying', pts, .035, M['cloth'], 6)
# flag pole WITHOUT a flag (LOOK_BIBLE): galvanised pole, gilt ball, halyard rope and cleat, a small concrete base
FX, FY = 21.5, 15.5
cyl('flag_base', .5, .25, FX, FY, .0, M['walk'], seg=16); cyl('flag_pole', .07, 10.5, FX, FY, .25, M['galv'], seg=12, r2=.045)
cyl('flag_ball', .1, .2, FX, FY, 10.75, M['steel'], seg=12); beam('halyard', (FX + .06, FY, 10.6), (FX + .06, FY, 1.2), .006, M['cloth'])
beam('halyard2', (FX - .06, FY, 10.6), (FX - .05, FY + .02, 1.25), .006, M['cloth']); box('cleat', .04, .05, .18, FX + .07, FY, 1.1, M['ink'])
anchor('flag_pole', FX, FY, 10.7)
# chain-link fence round the lot (west, east, behind): posts, top rail, a mesh panel per bay (galvanised, see-through look by dark mesh lines)
def fence(x0, y0, x1, y1, step=3.0):
    L = math.hypot(x1 - x0, y1 - y0); n = max(1, int(L / step)); yaw = math.degrees(math.atan2(y1 - y0, x1 - x0))
    for i in range(n + 1):
        t = i / n; cyl('fence_post', .035, 1.9, x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, 0, M['galv'], seg=8)
    beam('fence_rail', (x0, y0, 1.85), (x1, y1, 1.85), .022, M['galv'])
    for i in range(n):
        t = (i + .5) / n; quad('fence_mesh', L / n, 1.8, x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, .95, yaw, mat('fence_mesh', png='fence_mesh', alpha=True, rough=.5, metal=.6))
fence(-26, -1.5, -26, 38); fence(33, -1.5, 33, 38); fence(-26, 38, 33, 38)
asset('dry_branches_medium_01'); put('dry_branches_medium_01', -25.6, 9.0, 0, 30, 1.3); put('dry_branches_medium_01', 32.6, 20.0, 0, 200, 1.1)   # tumbleweed caught in the wire
asset('wild_rooibos_bush')
for k in range(26):                                                            # dry scrub on the lots
    a = rnd.uniform(0, 6.283); r_ = rnd.uniform(36, 120); put('wild_rooibos_bush', r_ * math.cos(a), 30 + abs(r_ * math.sin(a)), 0, rnd.uniform(0, 360), rnd.uniform(1.0, 2.2))
for (x, y) in [(-24, 4), (-24.5, 19), (31, 6), (31.5, 26), (-19, 35), (20, 36)]: put('wild_rooibos_bush', x, y, 0, rnd.uniform(0, 360), rnd.uniform(.8, 1.3))
# dry grass: one 2 x 1 m patch of real Poly Haven clumps (joined once, straw-tinted), linked copies along the apron edges, the verges and the fence lines
asset('grass_medium_01'); tint_asset('grass_medium_01', '#cdb46e', .85)
GP = TPLS['grass_medium_01']; GP['heavy'] = .2
pp = []
for k in range(70): pp.append((rnd.uniform(-25.5, -23.3), rnd.uniform(-1, 37)))
for k in range(70): pp.append((rnd.uniform(31.3, 32.8), rnd.uniform(-1, 37)))
for k in range(40): pp.append((rnd.uniform(-25, 32), rnd.uniform(22.2, 23.0) if rnd.random() < .0 else rnd.uniform(34.5, 37.5)))
for k in range(30): pp.append((rnd.uniform(-22, 30), rnd.uniform(-1.75, -1.3)))
for (x, y) in pp: put('grass_medium_01', x, y, 0, rnd.uniform(0, 360), rnd.uniform(.35, .6))
for k in range(36): x = -23 + 4 * rnd.randint(1, 12); y = -1.8 + 4 * rnd.randint(1, 5); put('grass_medium_01', x + rnd.uniform(-.1, .1), y, .1, rnd.uniform(0, 360), .12)   # weeds in the joints
# the street's 4th wall (reverse shots): a low row across Main, tan and grey stucco, flat roofs, awnings, no words; poles and wires along the kerb
for i, (cx, w, h, m) in enumerate([(-30, 16, 4.2, 'stucco_tan'), (-12, 14, 5.0, 'stucco_grey'), (5, 16, 4.0, 'stucco'), (22, 14, 4.6, 'stucco_tan'), (40, 18, 3.8, 'stucco_grey')]):
    box('across_%d' % i, w, 12, h, cx, -22.5, 0, M[m], 2.); box('across_par_%d' % i, w + .2, .3, .5, cx, -16.5, h, M[m], 2.)
    box('across_awning_%d' % i, w * .7, 1.6, .08, cx, -15.7, 2.9, M['navy'] if i % 2 else M['galv'], 1.)
    for k in range(3): quad('across_win', 2.0, 1.6, cx - w * .3 + k * w * .3, -16.55, 1.6, 180, mat('win_office_%d' % (k % 3), png='win_office_%d' % (k % 3), rough=.06, coat=1.))
for i in range(12):
    px = -165 + 30 * i; cyl('pole', .14, 10.5, px, -13.8, 0, M['wood'], seg=10, r2=.1)
    beam('crossarm', (px - 1.3, -13.8, 9.6), (px + 1.3, -13.8, 9.6), .06, M['wood'])
    if i < 11:
        for dx in (-1.1, 0, 1.1):
            a, b = Vector((px + dx, -13.8, 9.66)), Vector((px + 30 + dx, -13.8, 9.66)); tube('wire', [a.lerp(b, t) - Vector((0, 0, .7 * 4 * t * (1 - t))) for t in [k / 10 for k in range(11)]], .012, M['wire'], 4)
# ================================================================== FAR: the water tank, the oil derrick + pump jacks + tanks, the low skyline (light haze colours)
def truss_leg_tower(name, cx, cy, base, top, h, levels, m, r=.12):
    """4-leg tapered lattice: legs, horizontal girts at each level, X braces on every face (premium detail: real structure)."""
    def c(z):
        s = base + (top - base) * z / h; return [Vector((cx + sx * s / 2, cy + sy * s / 2, z)) for sx, sy in ((-1, -1), (1, -1), (1, 1), (-1, 1))]
    b0, t0 = c(0), c(h)
    for i in range(4): beam(name + '_leg', b0[i], t0[i], r, m, 6)
    zs = [h * k / levels for k in range(levels + 1)]
    for za, zb in zip(zs[:-1], zs[1:]):
        A, B = c(za), c(zb)
        for i in range(4):
            j = (i + 1) % 4; beam(name + '_girt', B[i], B[j], r * .6, m, 4); beam(name + '_x', A[i], B[j], r * .45, m, 4); beam(name + '_x', A[j], B[i], r * .45, m, 4)
TX, TY = 30, 165
truss_leg_tower('tank', TX, TY, 9, 6, 30, 4, M['tankpaint'], .3)
cyl('tank_body', 7.5, 7, TX, TY, 30, M['tankpaint'], seg=32); cyl('tank_roof', 7.6, 3.2, TX, TY, 37, M['tankpaint'], seg=32, r2=.4)
cyl('tank_balcony', 8.2, .2, TX, TY, 30, M['galv'], seg=32); cyl('tank_riser', .9, 30, TX, TY, 0, M['tankpaint'], seg=12)
for k in range(24): a = k / 24 * 6.283; beam('tank_rail', (TX + 8.1 * math.cos(a), TY + 8.1 * math.sin(a), 30.2), (TX + 8.1 * math.cos(a), TY + 8.1 * math.sin(a), 31.2), .05, M['galv'])
for k in range(30): beam('tank_ladder', (TX - 4.4, TY - 4.6, k * 1.0 + .5), (TX - 3.8, TY - 4.6, k * 1.0 + .5), .03, M['galv'])
anchor('water_tank', TX, TY, 38)
DXX, DYY = -42, 240
truss_leg_tower('derrick', DXX, DYY, 9, 1.8, 36, 9, M['derrick'], .18)
box('derrick_crown', 2.6, 2.6, 1.4, DXX, DYY, 36, M['derrick']); box('derrick_floor', 12, 12, 1.6, DXX, DYY, 0, M['derrick']); box('derrick_shed', 7, 5, 3.4, DXX + 9, DYY - 2, 0, M['corr'], 2.)
for (px, py, rz) in [(-20, 200, 20), (-70, 260, -30), (-5, 300, 60)]:          # pump jacks nodding on the far lots
    box('pj_base', 6, 1.4, .6, px, py, 0, M['derrick'], 1., rz); beam('pj_samson', (px, py, .6), (px, py, 4.4), .25, M['derrick']); beam('pj_beam', (px - 3.5, py, 4.8), (px + 3, py, 4.0), .3, M['derrick'])
    box('pj_head', 1.0, .9, 2.0, px - 3.8, py, 3.0, M['derrick'], 1., rz); box('pj_counter', 1.2, 1.2, 1.2, px + 2.6, py, 1.6, M['derrick'], 1., rz)
for (ox, oy, r) in [(-62, 215, 8), (-80, 222, 7), (-55, 232, 6)]: cyl('oil_tank', r, 9, ox, oy, 0, M['oiltank'], seg=28); cyl('oil_tank_roof', r + .1, 1.0, ox, oy, 9, M['oiltank'], seg=28, r2=r * .3)
anchor('derrick', DXX, DYY, 37)
TOW = [(-520, 1100, 60, 40, 140, 'hazeB'), (-420, 1250, 40, 50, 95, 'hazeC'), (-300, 1050, 50, 40, 70, 'hazeB'), (-180, 1300, 70, 45, 180, 'hazeC'), (-60, 1150, 45, 45, 120, 'hazeB'),
       (40, 1350, 60, 60, 210, 'hazeC'), (130, 1200, 40, 40, 150, 'hazeB'), (230, 1100, 50, 50, 90, 'hazeB'), (330, 1300, 70, 40, 160, 'hazeC'), (450, 1150, 40, 40, 110, 'hazeB'),
       (560, 1250, 60, 50, 80, 'hazeC'), (-250, 900, 120, 30, 25, 'hazeA'), (300, 950, 140, 30, 22, 'hazeA'), (0, 980, 200, 30, 18, 'hazeA')]
for i, (x, y, w, d, h, mm) in enumerate(TOW):
    box('tower_%d' % i, w, d, h, x, y, 0, M[mm], 8.)
    if h > 60: box('tower_top_%d' % i, w * .6, d * .6, h * .15, x, y, h, M[mm], 8.)
    if h > 150: cyl('tower_spire_%d' % i, 1.5, 35, x, y, h * 1.15, M[mm], seg=8, r2=.3)
for k in range(30): a = rnd.uniform(-1, 1); box('far_low_%d' % k, rnd.uniform(20, 60), 20, rnd.uniform(5, 14), a * 700, rnd.uniform(500, 800), 0, M['hazeA'], 8.)
anchor('far_skyline', 0, 1150, 90)
# ================================================================== ANCHORS (plan metres; the kit reads them from out/dallas_meta.json)
anchor('truck_red', -3.2, 12.0, .12); anchor('truck_lime', 3.2, 12.0, .12)
anchor('clerk_spot', 0.0, NOSE - .75, .12); anchor('board_red_foot', BRX, BY - .3, .12); anchor('board_lime_foot', BLX, BY - .3, .12)
anchor('board_red_top_1', BRX, BY - .03, BZ + BH_); anchor('board_red_top_2', BRX, BY - .03, z2 + BH_); anchor('board_red_top_3', BRX, BY - .03, z3 + BH_)
anchor('up_to_3x', BRX, BY - .03, z3 + BH_ - .55); anchor('board_lime_top', BLX, BY - .03, BZ + BH_); anchor('calendar', 0, BY - .03, 2.0)
anchor('ladder_foot', LF[0], LF[1], .12); anchor('ladder_top', BRX, BY - .12, LZ); anchor('stool', BRX - .1, NOSE - .55, .12); anchor('chalk_table', 2.1, NOSE - .6, .66)
anchor('station_door', DX, SY - .6, .12); anchor('bay_red', BAYS[0], SY, .12); anchor('bay_lime', BAYS[1], SY, .12); anchor('sign_front', 0, SY - .05, BH + 1.17)
anchor('station_plate', DX + 1.95, SY - .05, 3.15); anchor('cooler', GX, GY, .93); anchor('yard_centre', 0, 6.0, .12)
# ================================================================== merge the coded parts by (material, story group): fewer draw calls, switches kept as nodes
groups = {}
for o in list(TOWN.objects):
    if o.get('merge') and o.type == 'MESH': groups.setdefault((o.data.materials[0].name, o.get('grp', '')), []).append(o)
for (mname, g), objs in groups.items():
    if len(objs) >= 2:
        with bpy.context.temp_override(active_object=objs[0], selected_editable_objects=objs, selected_objects=objs): bpy.ops.object.join()
    objs[0].name = 'dal_%s%s' % (('%s__' % g) if g else '', mname); objs[0]['grp'] = g
print('MERGED', len(groups), 'groups; objects now', len(TOWN.objects))
# ================================================================== lights, world, trucks, save, export (full GLB and LITE GLB from the same objects)
TA.build_lights(SC, ANCH)
spots = TA.link_trucks(SC, os.path.join(AP, 'out', 'truck.blend'), ANCH, NOSE - .02)
for k, v in spots.items(): ANCH[k] = v
TA.set_light(SC); TA.set_boards(SC, n=3, ladder=True, stool=False, painters=True, leaves=0)
meta = dict(anchors=ANCH, frame='metres, X east, Y north, Z up (plan frame)', light=TA.KIT_LIGHT,
            groups=dict(stack2='red board 2', stack3='red board 3 + UP TO 3x', ladder='sectioned ladder', stool='step stool', painters="painters' gear (line 13)", cal1='YEAR 1 leaf', cal2='YEAR 2', cal3='YEAR 3', cal4='YEAR 4'))
tot = sum(sum(len(p.vertices) - 2 for p in o.data.polygons) for o in TOWN.objects if o.type == 'MESH')
print('DALLAS_TRIS_BLEND', tot, 'OBJECTS', len(TOWN.objects))
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, 'dallas.blend'), relative_remap=True)
for m in bpy.data.materials:
    b_ = m.node_tree.nodes.get('Principled BSDF') if m.node_tree else None
    if b_ and m.name.startswith('lamp_'): b_.inputs['Emission Strength'].default_value = 1.   # glTF drops emission 0 (LECONS 2026-11-20)
def export(fname, f):
    """heavy templates swapped for a decimated copy (ratio heavy * f); every other mesh as built. Instanced meshes count once per copy in the kit."""
    keep = {o.name: o.data for o in TOWN.objects if o.type == 'MESH'}; swap = {}
    for nm, t in TPLS.items():
        r = t.get('heavy') or (.3 if len(t.data.polygons) > 20000 else None)
        if not r: continue
        lo = bpy.data.objects.new('lo_' + nm, t.data.copy()); SC.collection.objects.link(lo); md = lo.modifiers.new('dec', 'DECIMATE'); md.ratio = max(.02, r * f)
        dg = bpy.context.evaluated_depsgraph_get(); dg.update(); me = bpy.data.meshes.new_from_object(lo.evaluated_get(dg)); swap[t.data.name] = me
        print('DECIMATE', fname, nm, len(t.data.polygons), '->', len(me.polygons)); bpy.data.objects.remove(lo)
    for o in TOWN.objects:
        if o.type == 'MESH' and o.data.name in swap: o.data = swap[o.data.name]
    for o in bpy.context.scene.objects: o.select_set(False)
    for o in TOWN.objects: o.select_set(o.type == 'MESH' or o.type == 'EMPTY')
    bpy.ops.export_scene.gltf(filepath=os.path.join(OUT, fname), export_format='GLB', use_selection=True, export_apply=True, export_lights=False, export_cameras=False,
                              export_extras=True, export_image_format='JPEG', export_image_quality=82)
    gt = sum(sum(len(p.vertices) - 2 for p in o.data.polygons) for o in TOWN.objects if o.type == 'MESH')
    for o in TOWN.objects:
        if o.name in keep: o.data = keep[o.name]
    print('GLB', fname, 'TRIS_PER_INSTANCE', gt, 'MB %.1f' % (os.path.getsize(os.path.join(OUT, fname)) / 1e6)); return gt
meta['glb_tris'] = export('dallas.glb', 1.0); meta['lite_tris'] = export('dallas_lite.glb', .3); meta['blend_tris'] = tot
json.dump(meta, open(os.path.join(OUT, 'dallas_meta.json'), 'w'), indent=1)
print('DALLAS_DONE')
