# bl_town.py: builds PLACE A, the town of PINE HOLLOW, in Blender (set-builder 2026-11-20). ONE world: station + yard (north of Main St), eye shop
# (south, its window on bay 1), crossing Main x Elm (east), park (south-east), houses, water tower, hills. Ready-made CC0 Poly Haven models and
# textures first (logged in assets/ASSETS.md); code builds only what no asset gives (the buildings, fence, poles, wires, tower, kerbs, signs).
# blender -b --factory-startup --python bl_town.py -- <assets/ph_town> <build/tex> <assets_prod> <out dir>
#   -> out/town.blend (full detail, both lights, trucks linked), out/town.glb (same world, heavy trees decimated), out/town_meta.json (anchors, light)
# Frame: metres, X east, Y north, Z up (the plan frame; three.js gets it through B2T). Story and map: sets/town_STORY.md.
import bpy, bmesh, math, os, sys, json, random
from mathutils import Vector, Matrix
A = sys.argv[sys.argv.index('--') + 1:]; PH, TEX, AP, OUT = [os.path.abspath(p) for p in A[:4]]
sys.path.append(os.path.dirname(os.path.abspath(__file__))); import town_api as TA
os.makedirs(OUT, exist_ok=True); rnd = random.Random(7)
bpy.ops.wm.read_factory_settings(use_empty=True)
SC = bpy.context.scene
def coll(name, parent=None):
    c = bpy.data.collections.new(name); (parent or SC.collection).children.link(c); return c
TOWN, TPL = coll('TOWN'), coll('TPL'); bpy.context.view_layer.layer_collection.children['TPL'].exclude = True
def lin(h):
    h = h.lstrip('#'); v = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return [(c / 12.92 if c <= .04045 else ((c + .055) / 1.055) ** 2.4) for c in v] + [1.]

# ------------------------------------------------------------------ materials (Principled only, so the GLB carries the same look)
MATS = {}
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
    bm.to_mesh(me); bm.free(); o = bpy.data.objects.new(name, me); me.materials.append(m); (coll_ or TOWN).objects.link(o); o['merge'] = 1; return o
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
    before = set(bpy.data.objects); bpy.ops.import_scene.gltf(filepath=os.path.join(PH, 'models', aid, aid + '.gltf'))
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
    o.location = (x, y, z); o.rotation_euler = (0, 0, math.radians(rz)); o.scale = (s, s, s); TOWN.objects.link(o); o['asset'] = name
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

# ================================================================== MATERIALS of the town
M = dict(
    asphalt=mat('asphalt', 'asphalt', rough=.85), walk=mat('walk', 'walk'), yard=mat('yard', 'yard'), bayfloor=mat('bay_floor', 'bay_floor', rough=.5),
    lawn=mat('lawn', 'lawn', rough=.9), far=mat('ground_far', 'ground_far', rough=.95), kerb=mat('kerb', 'walk', col='#c9c3b6'),
    sage=mat('clap_sage', 'clap_sage'), cream=mat('clap_cream', 'clap_cream'), white=mat('clap_white', 'clap_white'), blue=mat('clap_blue', 'clap_blue'),
    green=mat('clap_green', 'clap_green'), tan=mat('clap_tan', 'clap_tan'), trim=mat('trim_white', 'trim_white', rough=.55), baydoor=mat('baydoor', 'baydoor', rough=.5),
    block=mat('block_buff', 'block_buff'), roof=mat('roof_grey', 'roof_grey', rough=.8), roof2=mat('roof_green', 'roof_green', rough=.8), plaster=mat('plaster_cream', 'plaster_cream'),
    pole=mat('pole_wood', 'pole_wood', rough=.9), floor=mat('floor_wood', 'floor_wood', rough=.45, coat=.3), picket=mat('picket', 'picket', rough=.6),
    navy=mat('navy_paint', col='#22336a', rough=.35, coat=.4), ink=mat('dark_metal', col='#2a2a2e', rough=.4, metal=.8), chrome=mat('chrome', col='#e8e8ea', rough=.08, metal=1.),
    brass=mat('brass', col='#c9a24a', rough=.25, metal=1.), glass=mat('glass_dark', col='#2b3442', rough=.04, coat=1.), steel=mat('steel_silver', col='#c9cdd2', rough=.3, metal=.9),
    rubber=mat('rubber', col='#1e1e1f', rough=.8), wire=mat('wire', col='#1b1b1d', rough=.6), insul=mat('insulator', col='#9ec0c0', rough=.15),
    cloth_w=mat('coat_white', col='#f2f0ea', rough=.9), navy_cloth=mat('turnout_navy', col='#26304a', rough=.85), stripe=mat('stripe_silver', col='#dfe3e6', rough=.3, metal=.6),
    awning=mat('awning_navy', col='#2a3a66', rough=.8), bark=mat('bark', 'pole_wood', rough=.95),
    blind=mat('blind_cream', col='#e8dfc6', rough=.6), lampglass=mat('lamp_sodium', col='#fff0d0', rough=.1, emit='#ffb050'),
    bulbw=mat('lamp_warm', col='#fff4dc', rough=.1, emit='#ffd9a0'), fluor=mat('lamp_fluor', col='#f4f6f0', rough=.2, emit='#eef3ff'),
    hill=mat('hill_green', 'ground_far', rough=.95), shadowpaint=mat('dark_wood', col='#3a2e26', rough=.7),
)
for i in range(4):
    M['win%d' % i] = mat('win_lit_%d' % i, png='win_day_%d' % i, emit_png='win_lit_%d' % i, rough=.08, coat=1.)
M['win_dark'] = mat('win_unlit', png='win_day_9', rough=.06, coat=1.)
SIGN = lambda n, r=.6: mat('sign_' + n, png=n, rough=r)
DECAL = lambda n: mat('decal_' + n, png=n, alpha=True, rough=.6)

# ================================================================== GROUND: streets, kerbs, walks, yard, lawn, far land
box('main_st', 300, 10, .02, 10, 0, -.02, M['asphalt'], 4.)
box('elm_st', 9, 240, .02, 22, 0, -.019, M['asphalt'], 4.)
for (x0, x1) in ((-140, 17.5), (26.5, 160)):
    for ys in (1, -1):
        box('walk', x1 - x0, 2.5, .15, (x0 + x1) / 2, ys * 6.25, 0, M['walk'], 1.5)
        box('kerb', x1 - x0, .18, .16, (x0 + x1) / 2, ys * 5.09, 0, M['kerb'], .5)
for (y0, y1) in ((-120, -5), (5, 120)):
    for xs in (16.25, 27.75):
        if xs == 16.25 and y0 > 0: continue
        box('walk', 2.5, y1 - y0, .15, xs, (y0 + y1) / 2, 0, M['walk'], 1.5)
box('walk_e', 2.5, 115, .15, 16.25, 64.5, 0, M['walk'], 1.5)
for x in range(-140, 160, 3):                                  # paver joints on the walks (real seams, not only in the texture)
    if 17 < x < 27: continue
    for ys in (1, -1): box('joint', .03, 2.5, .005, x, ys * 6.25, .15, M['ink'], 1.)
box('yard', 27, 13.5, .14, .5, 14.25, 0, M['yard'], 3.)            # the station's concrete apron, y 7.5..21
for x in (-6.5, 0., 7.):
    box('yard_joint', .04, 13.5, .006, x, 14.25, .14, M['ink'], 1.)
for y in (11.6, 16.):
    box('yard_joint', 27, .04, .006, .5, y, .14, M['ink'], 1.)
box('lawn_park', 48, 40, .1, 50, -27.5, -.02, M['lawn'], 3.)
for (x, y, sx, sy) in ((-60, 30, 160, 50), (-60, -32, 120, 50), (90, 40, 120, 70), (40, 75, 60, 40), (-20, 80, 80, 40), (60, -80, 120, 70), (-60, -85, 120, 60)):
    box('yards_far', sx, sy, .06, x, y, -.03, M['far'], 6.)
box('ground_big', 900, 900, .1, 0, 0, -.14, M['far'], 10.)

# ================================================================== THE FIRE STATION (x -12..12, y 21..33), bays south
SX0, SX1, SY0, SY1 = -12., 12., 21., 33.
for (x0, x1) in ((-12, -6.6), (-1.8, 1.8), (6.6, 12)):                 # piers between the bay openings: block base + clapboard
    box('st_base', x1 - x0, .35, 1.1, (x0 + x1) / 2, SY0, 0, M['block'], 1.)
    box('st_wall', x1 - x0, .3, 3.7, (x0 + x1) / 2, SY0, 1.1, M['sage'], 1.2)
box('st_header', 24, .3, 4.1, 0, SY0, 4.8, M['sage'], 1.2)            # first-floor face over the bays
for x in (-12, -6.6, -1.8, 1.8, 6.6, 12): box('st_pier_trim', .22, .42, 4.8, x, SY0 - .03, 0, M['trim'], .5)
box('st_belt', 24.4, .45, .22, 0, SY0 - .05, 4.8, M['trim'], .5)
for (sx, sy, cx, cy) in ((.3, 12, SX0, 27), (.3, 12, SX1, 27), (24, .3, 0, SY1)):
    box('st_base', sx, sy, 1.1, cx, cy, 0, M['block'], 1.); box('st_wall', sx, sy, 7.8, cx, cy, 1.1, M['sage'], 1.2)
box('st_floor2', 24, 12, .2, 0, 27, 4.7, M['floor'], 2.)
gable('st_roof', 24, 12.3, 3.4, 0, 27, 8.9, M['roof'], 'x', .55)
tri_wall('st_gable_w', 12.3, 3.4, SX0 - .02, 27, 8.9, 90, M['sage']); tri_wall('st_gable_e', 12.3, 3.4, SX1 + .02, 27, 8.9, 90, M['sage'])
box('st_fascia', 25.2, .08, .3, 0, SY0 - .65, 8.75, M['trim'], .5); box('st_fascia', 25.2, .08, .3, 0, SY1 + .65, 8.75, M['trim'], .5)
tube('st_gutter', [Vector((-12.6, SY0 - .72, 8.78)), Vector((12.6, SY0 - .72, 8.78))], .07, M['steel'], 8)
for x in (-12.45, 12.45): beam('st_downpipe', (x, SY0 - .7, 8.75), (x, SY0 - .7, .1), .05, M['steel'], 8)
box('st_chimney', .9, .9, 3.0, 7.5, 29, 10.2, M['block'], .8); box('st_chimney_cap', 1.1, 1.1, .15, 7.5, 29, 13.2, M['trim'], .5)
for x in (-3, 3): cyl('st_vent', .18, .6, x, 25, 10.6, M['steel'], 12); cyl('st_vent_cap', .3, .12, x, 25, 11.2, M['steel'], 12, r2=.05)
for i, x in enumerate((-10.2, -7.6, -3.2, 0, 3.2, 7.6, 10.2)):          # first-floor windows: frame, two sashes, mullions, sill
    if abs(x) < .1:
        box('st_win_trim', 1.4, .1, 1.75, x, SY0 - .2, 5.85, M['trim'], .5); quad('st_engine_board', 1.2, .5, x, SY0 - .28, 6.7, 0, SIGN('sign_engine')); continue
    box('st_win_trim', 1.25, .12, 1.65, x, SY0 - .19, 5.6, M['trim'], .5)
    quad('st_win_glass', 1.0, 1.4, x, SY0 - .26, 6.42, 0, M['win%d' % (i % 4)] if i % 3 else M['win_dark'])
    box('st_win_mull', 1.04, .05, .05, x, SY0 - .29, 6.42, M['trim'], .5); box('st_win_mull', .05, .05, 1.42, x, SY0 - .29, 5.72, M['trim'], .5)
    box('st_win_sill', 1.45, .26, .07, x, SY0 - .3, 5.55, M['trim'], .5)
quad('st_sign', 9.0, 1.3, 0, SY0 - .33, 8.0, 0, SIGN('sign_station', .5)); box('st_sign_frame', 9.3, .1, 1.5, 0, SY0 - .24, 7.25, M['navy'], .5)
# the two bays: openings 4.8 wide x 4.2 high, doors rolled up into the header (their bottom panels show), tracks, inside walls, floor
for bx in (-4.2, 4.2):
    box('bay_header_jamb', 5.0, .25, .25, bx, SY0 + .1, 4.25, M['trim'], .5)
    box('bay_door_up', 4.7, .1, .55, bx, SY0 + .45, 3.65, M['baydoor'], 1.)              # the rolled-up door's last panel, its windows
    for k in range(4): box('bay_door_win', .8, .04, .25, bx - 1.65 + k * 1.1, SY0 + .38, 3.8, M['glass'], .5)
    for sx in (-2.42, 2.42): box('bay_track', .08, 6., .12, bx + sx, SY0 + 3.2, 4.0, M['steel'], .5); box('bay_track_v', .08, .12, 4.0, bx + sx, SY0 + .2, 0, M['steel'], .5)
    box('bay_floor', 4.8, 12, .02, bx, 27, .0, M['bayfloor'], 3.)
    for yy in (24, 28, 31.5): box('bay_fluor', 1.25, .18, .07, bx, yy, 4.55, M['fluor'], .5)
box('bay_mid_wall', .25, 11.6, 4.6, 0, 27, 0, M['block'], 1.)
box('bay_back_wall', 24, .25, 4.6, 0, 32.75, 0, M['block'], 1.)
for bx in (-4.2, 4.2):                                                 # turnout gear on pegs on the back wall: coat, stripes, helmet, boots below
    for k in range(4):
        x = bx - 1.8 + k * 1.2
        box('peg', .05, .2, .05, x, 32.5, 1.95, M['brass'], .5)
        box('turnout_coat', .55, .22, .85, x, 32.45, 1.05, M['navy_cloth'], .5); box('turnout_stripe', .56, .23, .07, x, 32.45, 1.25, M['stripe'], .5); box('turnout_stripe', .56, .23, .07, x, 32.45, 1.5, M['stripe'], .5)
        cyl('helmet', .16, .14, x, 32.45, 2.0, M['ink'] if k else M['cloth_w'], 14, r2=.12); cyl('helmet_brim', .24, .02, x, 32.45, 2.0, M['ink'] if k else M['cloth_w'], 14)
    box('shelf', 3.6, .4, .04, bx, 32.4, 2.6, M['floor'], .5); box('shelf', 3.6, .4, .04, bx, 32.4, 3.2, M['floor'], .5)
# person door at the east end, CHIEF plate, wall lamp (line 14's source), bench, hose reel, bell, flag pole (no flag)
box('st_door_frame', 1.25, .2, 2.35, 9.3, SY0 - .1, 0, M['trim'], .5); box('st_door', 1.0, .08, 2.15, 9.3, SY0 - .2, 0, M['cream'], .8)
box('st_door_glass', .5, .03, .6, 9.3, SY0 - .25, 1.35, M['glass'], .5); box('st_kickplate', 1.0, .03, .25, 9.3, SY0 - .25, .02, M['brass'], .5)
cyl('st_knob', .035, .07, 9.68, SY0 - .3, 1.02, M['brass'], 12, rx=90); box('st_step', 1.6, .6, .15, 9.3, SY0 - .5, 0, M['kerb'], .5)
quad('st_chief_plate', .42, .13, 9.3, SY0 - .25, 1.85, 0, SIGN('sign_chief', .3))
asset('industrial_wall_lamp'); put('industrial_wall_lamp', 9.3, SY0 - .3, 2.75, 0, 1.4)
asset('painted_wooden_bench'); put('painted_wooden_bench', 11.1, SY0 - .9, 0, 180, 1.)
asset('garden_hose_wall_mounted_01'); put('garden_hose_wall_mounted_01', -8.9, SY0 - .28, 1.4, 180, 1.7)
box('bell_post', .14, .14, 2.6, -10.4, 19.6, .14, M['shadowpaint'], .5); box('bell_post', .14, .14, 2.6, -9.0, 19.6, .14, M['shadowpaint'], .5); box('bell_beam', 1.6, .16, .16, -9.7, 19.6, 2.74, M['shadowpaint'], .5)
cyl('bell', .34, .48, -9.7, 19.6, 2.12, M['brass'], 20, r2=.17); cyl('bell_lip', .37, .06, -9.7, 19.6, 2.1, M['brass'], 20)
cyl('flag_pole', .06, 11., 13.2, 8.3, .14, M['steel'], 10, r2=.035); cyl('flag_ball', .1, .2, 13.2, 8.3, 11.14, M['brass'], 10, r2=.02)
beam('halyard', (13.27, 8.3, 11.0), (13.27, 8.3, 1.2), .006, M['wire'], 4); box('flag_base', .6, .6, .3, 13.2, 8.3, .14, M['kerb'], .5)
# hose-drying tower (x -16.2..-12), painted concrete block, slit windows, louvres, cap, pulley beam, ladder rungs
box('tower', 4.2, 4.2, 15.5, -14.1, 27, 0, M['block'], 1.)
for z in (3.5, 7., 10.5): box('tower_slit', .5, .08, 1.4, -14.1, 24.86, z, M['glass'], .5); box('tower_slit_sill', .7, .2, .08, -14.1, 24.8, z - .05, M['trim'], .5)
for k in range(7): box('tower_louvre', 3.6, .12, .1, -14.1, 24.82, 12.6 + k * .32, M['trim'], .5)
box('tower_cap', 4.8, 4.8, .3, -14.1, 27, 15.5, M['trim'], .5); gable('tower_roof', 4.2, 4.2, 1.6, -14.1, 27, 15.8, M['roof'], 'y', .4)
box('tower_beam', .2, 1.6, .2, -14.1, 24.4, 14.9, M['shadowpaint'], .5); cyl('tower_pulley', .18, .08, -14.1, 23.8, 14.6, M['steel'], 14, rx=90)
for z in range(1, 14): box('tower_rung', .5, .04, .04, -16.25, 26.2, z * 1.0, M['steel'], .5)
for dx in (-.25, .25): box('tower_rail', .05, .05, 14.2, -16.25 + 0 * dx, 26.2 + dx, .2, M['steel'], .5)
# yard dressing: the white YARD LINE (bay 2's centre guide, row 57), oil under bay 2, tyre tracks, lemon overspray + boot prints, drain, bins, crates
quad('yard_line', .55, 11.2, 4.2, 13.4, .147, 0, DECAL('yardline'), flat=True); anchor('yard_line_start', 4.2, 7.9, .14); anchor('yard_line_end', 4.2, 18.55, .14)
quad('oil_bay2', 2.6, 2.6, 4.2, 20.0, .148, 0, DECAL('oil'), flat=True); quad('oil_bay2b', 1.8, 1.8, 3.6, 23.5, .03, 40, DECAL('oil'), flat=True)
quad('tracks_bay2', 3.0, 11., 4.2, 13.5, .146, 0, DECAL('tracks'), flat=True)
quad('lemon_spray', 9., 4.5, -4.2, 11.5, .149, 0, DECAL('spray'), flat=True); quad('lemon_boot', 1.2, 2.8, 6.8, 18.4, .15, 25, DECAL('boot'), flat=True)
asset('water_manhole_cover'); put('water_manhole_cover', -1.0, 10.2, .14, 0, 1.)
anchor('yard_drain', -1.0, 10.2, .14)
asset('metal_trash_can', keep=['metal_trash_can'], drop=['rust']); put('metal_trash_can', 11.9, 19.9, .14, 10, 1.)
asset('wooden_crate_01'); put('wooden_crate_01', -11.3, 19.8, .14, 8, 1.1); put('wooden_crate_01', -11.25, 19.85, .5, -6, 1.1)
asset('oil_tin'); put('oil_tin', -10.7, 19.3, .14, 30, 1.); put('oil_tin', 7.6, 20.2, .14, -20, 1.)
asset('wooden_bucket_01'); put('wooden_bucket_01', -7.4, 20.3, .14, 0, 1.)
asset('old_tyre'); put('old_tyre', -12.4, 20.4, .44, 90, 1.4)
asset('watering_can_metal_01'); put('watering_can_metal_01', 10.2, 20.2, .14, 60, 1.)
asset('metal_toolbox', keep=['metal_toolbox']); put('metal_toolbox', 1.1, 20.4, .14, 15, 1.1)
asset('wooden_ladder', keep=['wooden_ladder']); put('wooden_ladder', -6.2, 32.3, 0, 180, 1.4)
asset('barrel_03'); put('barrel_03', 12.5, 31.5, 0, 0, 1.); put('barrel_03', -11.2, 32.2, 0, 50, 1.)
asset('cardboard_box_01'); put('cardboard_box_01', -1.2, 32.2, 0, 10, 1.3); put('cardboard_box_01', -1.0, 32.2, .45, -20, 1.2)
asset('rubber_boots', keep=['rubber_boots_l', 'rubber_boots_r']); [put('rubber_boots', -6 + k * 1.2, 32.4, 0, 0, 1.) for k in range(3)]
asset('utility_box_01'); put('utility_box_01', 12.5, 23.0, 0, 90, 1.)
asset('weed_plant_02'); [put('weed_plant_02', x, y, .14, rnd.uniform(0, 360), rnd.uniform(.8, 1.4)) for (x, y) in ((-6.5, 9.0), (0, 8.6), (7, 9.2), (-6.48, 17.5), (7.02, 12.4), (-12.9, 8.2), (13.6, 19.8), (0.02, 19.5))]
for bx in (-13.1, 14.1):
    for yy in (8.0,): cyl('bollard', .14, 1.0, bx, yy, .14, M['steel'], 14); cyl('bollard_band', .145, .1, bx, yy, .95, M['navy'], 14)
anchor('yard_centre', 0.5, 14.2, .14); anchor('bay1_truck', -4.2, 17.8, .14); anchor('bay2_truck', 4.2, 22.35, .14); anchor('station_door', 9.3, SY0 - .7, .14)
anchor('wall_lamp', 9.3, SY0 - .55, 2.65); anchor('bench', 11.1, SY0 - .9, .14); anchor('hose_reel', -8.9, SY0 - .6, 1.4)

# ================================================================== THE EYE DOCTOR'S SHOP (x -7..7, y -7.5..-17), its window on bay 1
SHY = -7.6
box('shop_base', 14, .3, .6, 0, SHY - .15, 0, M['block'], 1.)
box('shop_wall_l', 2.2, .3, 3.6, -5.9, SHY - .15, .6, M['cream'], 1.2); box('shop_wall_r', 3.0, .3, 3.6, 5.5, SHY - .15, .6, M['cream'], 1.2)
box('shop_over', 14, .3, 2.6, 0, SHY - .15, 4.2, M['cream'], 1.2)
box('shop_win_frame', 7.6, .2, .16, -1.0, SHY - .1, .6, M['navy'], .5); box('shop_win_frame', 7.6, .2, .16, -1.0, SHY - .1, 4.04, M['navy'], .5)
for x in (-4.8, -2.4, 0.4, 2.8): box('shop_win_mull', .12, .2, 3.4, x, SHY - .1, .7, M['navy'], .5)
quad('shop_window_glass', 7.4, 3.3, -1.0, SHY - .05, 2.35, 180, mat('shop_glass', col='#cfdde6', rough=.02, coat=1.))
bpy.data.objects['shop_window_glass'].active_material.node_tree.nodes['Principled BSDF'].inputs['Transmission Weight'].default_value = 1.; bpy.data.objects['shop_window_glass']['glass'] = 1
for k in range(14): box('blind_slat', 7.2, .06, .02, -1.0, SHY - .3, 3.0 + k * .07, M['blind'], .5)
box('blind_rail', 7.3, .1, .08, -1.0, SHY - .3, 4.0, M['blind'], .5)
box('shop_door', 1.05, .06, 2.45, 3.4, SHY - .1, .6, M['navy'], .6); box('shop_door_glass', .6, .03, .9, 3.4, SHY - .05, 1.7, M['glass'], .5)
quad('shop_door_open', .5, .25, 3.4, SHY - .02, 2.75, 180, SIGN('door_glass', .3)); box('shop_transom', 1.1, .05, .9, 3.4, SHY - .1, 3.1, M['glass'], .5)
cyl('shop_knob', .03, .06, 3.8, SHY + .0, 1.55, M['brass'], 10, rx=90); box('shop_step', 1.6, .5, .15, 3.4, SHY + .25, .45, M['kerb'], .5)
quad('shop_fascia_sign', 13.0, 1.2, 0, SHY + .02, 5.25, 180, SIGN('sign_shopfront', .5))
box('shop_cornice', 14.6, .6, .25, 0, SHY - .2, 6.8, M['trim'], .5); box('shop_parapet', 14, .3, .4, 0, SHY - .15, 6.8, M['cream'], 1.2)
for (sx, sy, cx, cy) in ((.3, 9.4, -7, -12.3), (.3, 9.4, 7, -12.3), (14, .3, 0, -17)):
    box('shop_side', sx, sy, 7.0, cx, cy, 0, M['cream'], 1.2)
box('shop_roof', 14.2, 9.6, .2, 0, -12.3, 6.8, M['roof'], 2.); box('shop_floor', 13.6, 9, .05, 0, -12.3, .1, M['floor'], 1.2)
box('shop_ceiling', 13.6, 9, .05, 0, -12.3, 4.0, M['plaster'], 2.)
box('awning', 8.6, 1.6, .06, -1.0, SHY + .78, 4.15, M['awning'], .5)
for k in range(9): box('awning_stripe', .48, 1.62, .062, -5.0 + k * 1.0, SHY + .78, 4.15, M['trim'], .5)
box('awning_valance', 8.6, .04, .3, -1.0, SHY + 1.58, 3.88, M['awning'], .5)
for x in (-5.2, 3.2): beam('awning_arm', (x, SHY, 4.1), (x, SHY + 1.5, 4.18), .03, M['steel'], 6)
# the giant spectacles shingle on its bracket (two chains), the shop's story sign: it swings in rows 9 and 11
box('shingle_bracket', .08, 1.6, .08, 6.2, SHY + .8, 4.6, M['ink'], .5)
for dy in (-.4, .4): beam('shingle_chain', (6.2, SHY + .8 + dy, 4.6), (6.2, SHY + .8 + dy, 4.3), .012, M['steel'], 4)
quad('shingle_eye', 1.5, .75, 6.2, SHY + .8, 3.92, 90, SIGN('sign_eye', .5)); quad('shingle_eye_b', 1.5, .75, 6.19, SHY + .8, 3.92, 270, SIGN('sign_eye', .5))
for dy in (-.36, .36):
    tube('spectacle_rim', [Vector((6.2, SHY + .8 + dy + .3 * math.cos(a / 24 * 2 * math.pi), 3.38 + .3 * math.sin(a / 24 * 2 * math.pi))) for a in range(25)], .035, M['brass'], 6)
beam('spectacle_bridge', (6.2, SHY + .74, 3.5), (6.2, SHY + .86, 3.5), .03, M['brass'], 6)
anchor('shop_shingle', 6.2, SHY + .8, 3.9)
# inside: worn path, the exam chair facing the chart, chart lit, coat hook with two white coats, amber lamp, desk, photo, clock
asset('BarberShopChair_01'); put('BarberShopChair_01', -1.6, -11.4, .15, 180, 1.)
anchor('shop_chair', -1.6, -11.4, .15); anchor('shop_window', -1.0, SHY - .05, 1.7)
quad('eye_chart', .8, 1.28, -1.6, -16.72, 1.9, 180, SIGN('eye_chart', .4))
box('chart_frame', .9, .05, 1.38, -1.6, -16.77, 1.21, M['shadowpaint'], .5)
box('coat_rail', 1.4, .08, .08, 3.6, -16.75, 2.05, M['brass'], .5)
for k, x in enumerate((3.25, 3.95)):
    cyl('coat_hook', .025, .14, x, -16.7, 2.0, M['brass'], 8, rx=90)
    box('white_coat', .55, .16, 1.05, x, -16.66, .95, M['cloth_w'], .5); box('white_coat_collar', .4, .18, .12, x, -16.66, 1.9, M['cloth_w'], .5)
asset('desk_lamp_arm_01'); box('desk', 1.6, .7, .75, -4.6, -15.6, .15, M['floor'], .8); put('desk_lamp_arm_01', -4.1, -15.6, .9, 200, 1.)
anchor('shop_lamp', -4.1, -15.7, 1.55)
asset('hanging_picture_frame_01'); put('hanging_picture_frame_01', -4.4, -16.75, 2.2, 180, .8)
quad('photo_truck', .4, .3, -4.4, -16.73, 2.25, 180, SIGN('photo_truck', .5))
asset('wall_clock', keep=['wall_clock']); put('wall_clock', .6, -16.75, 3.0, 180, 1.)
box('trial_case', .6, .4, .1, -4.9, -15.6, .9, M['shadowpaint'], .5)
box('shop_back_wall_dado', 13.6, .06, 1.0, 0, -16.78, .1, M['trim'], .5)
asset('shrub_03', keep=['shrub_03_a']); [put('shrub_03', x, SHY + .4, .15, rnd.uniform(0, 360), 2.2) for x in (-6.6, 4.9, 6.6)]

# ================================================================== THE CROSSING (Main x Elm): stop bar, blades, sodium lamp, poles + wires
quad('stop_bar', 4.4, .6, 24.3, -6.6, .002, 0, DECAL('stopbar'), flat=True); anchor('crossing_stop_bar', 24.3, -6.6, 0)
asset('street_lamp_02'); asset('street_lamp_01')
cyl('lamp_post', .12, 7.0, 27.6, -8.4, .15, M['ink'], 14, r2=.08); cyl('lamp_post_foot', .22, .5, 27.6, -8.4, .15, M['ink'], 14, r2=.16)
beam('lamp_arm', (27.6, -8.4, 7.0), (25.4, -7.0, 7.4), .05, M['ink'], 8)
cyl('lamp_head', .38, .22, 25.3, -6.95, 7.2, M['ink'], 16, r2=.12); cyl('lamp_globe', .3, .14, 25.3, -6.95, 7.08, M['lampglass'], 16, r2=.32)
anchor('street_lamp', 25.3, -6.95, 7.05)
cyl('blade_post', .05, 3.2, 27.2, -7.6, .15, M['steel'], 10)
quad('blade_main', 1.1, .17, 27.2, -7.6, 3.2, 0, SIGN('blade_main', .4)); quad('blade_main_b', 1.1, .17, 27.2, -7.59, 3.2, 180, SIGN('blade_main', .4))
quad('blade_elm', 1.1, .17, 27.2, -7.6, 3.42, 90, SIGN('blade_elm', .4)); quad('blade_elm_b', 1.1, .17, 27.21, -7.6, 3.42, 270, SIGN('blade_elm', .4))
asset('fire_hydrant', keep=['fire_hydrant'], drop=['aged']); tint_asset('fire_hydrant', '#c9cdd2', .85); put('fire_hydrant', 15.6, 5.7, .15, 0, 1.)
box('mailbox', .45, .55, .7, 15.4, -5.9, .9, M['navy'], .5); box('mailbox_leg', .1, .1, .75, 15.4, -5.9, .15, M['ink'], .5)
# telephone poles: south side of Main, every 30 m, with two crossarms, insulators, sagging wires (catenaries) and a guy wire at the end
POLES = [(-120 + 30 * i, -7.2) for i in range(10)]
for (x, y) in POLES:
    cyl('tel_pole', .16, 10.5, x, y, 0, M['pole'], 10, r2=.12);
    for z in (9.6, 8.9):
        box('tel_crossarm', .12, 2.4, .12, x, y, z, M['pole'], .5); beam('tel_brace', (x, y - .8, z), (x, y, z - .6), .03, M['steel'], 4); beam('tel_brace', (x, y + .8, z), (x, y, z - .6), .03, M['steel'], 4)
        for dx in (-1.05, -.45, .45, 1.05): cyl('tel_insulator', .05, .14, x, y + dx, z + .12, M['insul'], 8, r2=.035)
for (a, b) in zip(POLES[:-1], POLES[1:]):
    for z, dx in ((9.86, -1.05), (9.86, 1.05), (9.16, -.45), (9.16, .45)):
        p0, p1 = Vector((a[0], a[1] + dx, z + .1)), Vector((b[0], b[1] + dx, z + .1)); pts = []
        for k in range(13):
            t = k / 12; p = p0.lerp(p1, t); p.z -= .55 * 4 * t * (1 - t); pts.append(p)
        tube('tel_wire', pts, .012, M['wire'], 4)
for (x, y) in ((POLES[5][0], -7.2),):                                   # a drop wire across Main to the station
    pts = [Vector((x, y, 9.0)).lerp(Vector((12.0, SY0 - .2, 7.6)), k / 12) - Vector((0, 0, .6 * 4 * (k / 12) * (1 - k / 12))) for k in range(13)]; tube('drop_wire', pts, .01, M['wire'], 4)

# ================================================================== THE PARK CORNER (x 27.5.., y ..-8): lawn, picket fence with ONE gap, big tree + swing, bench
FY = -8.1; GAP = 34.0
def picket_run(x0, x1, y, alongx=True):
    n = int(abs(x1 - x0) / .16)
    for k in range(n):
        u = x0 + (k + .5) * (x1 - x0) / n
        if abs(u - GAP) < .65 and alongx: continue
        px, py = (u, y) if alongx else (y, u)
        bm = bmesh.new(); w, t, h = .085, .022, 1.0
        P = [(-w / 2, -t / 2, 0), (w / 2, -t / 2, 0), (w / 2, -t / 2, h), (0, -t / 2, h + .08), (-w / 2, -t / 2, h)]
        R = Matrix.Rotation(0 if alongx else math.pi / 2, 3, 'Z')
        f1 = [bm.verts.new(R @ Vector(p) + Vector((px, py, .1))) for p in P]; f2 = [bm.verts.new(R @ Vector((p[0], -p[1], p[2])) + Vector((px, py, .1))) for p in P]
        bm.faces.new(f1); bm.faces.new(list(reversed(f2)))
        for i in range(5): bm.faces.new((f1[i], f1[(i + 1) % 5], f2[(i + 1) % 5], f2[i]))
        bm.normal_update(); obj_from_bm(bm, 'picket', M['picket'], .5)
    L = abs(x1 - x0)
    for zz in (.35, .8):
        if alongx:
            for (s0, s1) in ((x0, GAP - .65), (GAP + .65, x1)): box('fence_rail', s1 - s0, .04, .08, (s0 + s1) / 2, y + .04, .1 + zz, M['picket'], .5)
        else: box('fence_rail', .04, L, .08, y + .04, (x0 + x1) / 2, .1 + zz, M['picket'], .5)
    for k in range(int(L / 2.4) + 1):
        u = x0 + k * (x1 - x0) / max(1, int(L / 2.4)); px, py = (u, y) if alongx else (y, u)
        box('fence_post', .1, .1, 1.15, px, py + .02, .1, M['picket'], .5); box('fence_cap', .14, .14, .04, px, py + .02, 1.25, M['picket'], .5)
picket_run(28.6, 62., FY, True); picket_run(-8.6, -42., 28.6, False)
anchor('park_fence_gap', GAP, FY, .1)
asset('island_tree_02'); TPLS['island_tree_02']['heavy'] = 1
put('island_tree_02', 40.0, -20.0, .08, 30, 3.1, tag='big_tree')               # the park's one big tree (about 10.5 m)
beam('swing_rope', (38.2, -19.3, 4.4), (38.2, -19.3, .55), .015, M['pole'], 4); beam('swing_rope', (38.2, -18.7, 4.4), (38.2, -18.7, .55), .015, M['pole'], 4)
box('swing_seat', .25, .75, .05, 38.2, -19.0, .5, M['floor'], .3); box('swing_branch_hide', .01, .01, .01, 38.2, -19, 4.4, M['bark'], .5)
quad('swing_worn', 1.6, 1.0, 38.2, -19.0, .085, 90, DECAL('oil'), flat=True)
anchor('park_swing', 38.2, -19.0, .1); anchor('park_tree', 40.0, -20.0, .08)
put('painted_wooden_bench', 33.0, -13.0, .08, 200, 1.); anchor('park_bench', 33.0, -13.0, .08)
put('metal_trash_can', 31.2, -12.6, .08, 0, 1.)
quad('park_sign', 2.0, .5, 30.0, FY - .5, 1.6, 0, SIGN('sign_park', .5)); [box('park_sign_post', .08, .08, 1.35, x, FY - .5, .08, M['shadowpaint'], .5) for x in (29.1, 30.9)]
asset('shrub_02', keep=['shrub_02_b'], name='bush'); asset('dandelion_01', keep=['dandelion_01_c'], name='dandelion')
# grass: a 2 x 2 m patch of real Poly Haven bermuda clumps (joined once), placed as linked copies over the lawn and verges
asset('grass_bermuda_01', keep=['medium', 'seedling'], name='grass_clump')
gm = TPLS['grass_clump'].data; bmp = bmesh.new(); src = bmesh.new(); src.from_mesh(gm)
for k in range(260):
    s_ = rnd.uniform(1.6, 3.0); R = Matrix.Rotation(rnd.uniform(0, 6.28), 4, 'Z'); T_ = Matrix.Translation((rnd.uniform(-1, 1), rnd.uniform(-1, 1), 0)) @ R @ Matrix.Scale(s_, 4)
    tm = bpy.data.meshes.new('t'); src.to_mesh(tm); tm.transform(T_); bmp.from_mesh(tm); bpy.data.meshes.remove(tm)
pm = bpy.data.meshes.new('tpl_grass_patch'); bmp.to_mesh(pm); bmp.free(); src.free(); pm.materials.append(gm.materials[0])
po = bpy.data.objects.new('tpl_grass_patch', pm); TPL.objects.link(po); TPLS['grass_patch'] = po; po['heavy'] = .3
for i in range(170):                                                    # dense near the park cameras, thinner far
    x = rnd.uniform(28.5, 62); y = -8.8 - abs(rnd.gauss(0, 9)) - .5
    put('grass_patch', x, y, .08, rnd.uniform(0, 360), rnd.uniform(.9, 1.2))
for i in range(40): put('grass_patch', rnd.uniform(-60, -16), rnd.choice([rnd.uniform(9, 12), rnd.uniform(-12, -9)]) * (1 if rnd.random() < .5 else 1), .02, rnd.uniform(0, 360), 1.)
for i in range(60): put('dandelion', rnd.uniform(29, 58), -9 - abs(rnd.gauss(0, 8)), .08, rnd.uniform(0, 360), rnd.uniform(1.5, 2.5))
for (x, y, s) in ((29.5, -9.2, 1.6), (60.5, -9.3, 1.9), (45, -40, 2.4), (29.3, -26, 1.8), (55, -30, 2.0)): put('bush', x, y, .08, rnd.uniform(0, 360), s)

# ================================================================== STREET TREES IN CLUMPS, HOUSES, WATER TOWER, HILLS
def tree(x, y, s=None, z=0.): return put('island_tree_02', x, y, z, rnd.uniform(0, 360), s or rnd.uniform(2.0, 2.8))
for (cx, cy, n) in ((-24, 12, 3), (-40, -12, 2), (16, 40, 3), (30, 18, 2), (-22, -27, 3), (64, -12, 2), (52, -42, 4), (-10, 44, 4), (34, 46, 3), (70, 20, 3), (-60, 20, 3), (10, -26, 3)):
    for k in range(n): tree(cx + rnd.uniform(-3.5, 3.5), cy + rnd.uniform(-3, 3))
for (cx, cy) in ((-26, 9), (-20, 9.5), (-36, -9.6), (30, 9.2), (14.6, 30), (14.4, 44)): put('bush', cx, cy, 0, rnd.uniform(0, 360), rnd.uniform(1.2, 1.7))
HOUSE_COLS = ['cream', 'white', 'blue', 'green', 'tan', 'sage', 'white', 'cream']
def house(x, y, w, d, h, face, col, roofm, seed):
    """a 1970s clapboard house: walls, gable roof, porch with posts, door, windows (lit or dark, the dusk mix), chimney. face = the side the porch looks to (deg, 0 = south)."""
    r = random.Random(seed); rot = face
    Rz = Matrix.Rotation(math.radians(rot), 3, 'Z')
    def P(u, v): q = Rz @ Vector((u, -v, 0)); return x + q.x, y + q.y
    cx, cy = P(0, 0); box('house_wall', w, d, h, cx, cy, 0, M[col], 1.2, rot)
    ridge_along_front = r.random() < .6
    o = gable('house_roof', w if ridge_along_front else d, d if ridge_along_front else w, h * .55, cx, cy, h, roofm, 'x', .5); o.rotation_euler = (0, 0, 0)
    if rot % 180: o.data.transform(Matrix.Translation((cx, cy, 0)) @ Matrix.Rotation(math.radians(rot), 4, 'Z') @ Matrix.Translation((-cx, -cy, 0)))
    if not ridge_along_front: o.data.transform(Matrix.Translation((cx, cy, 0)) @ Matrix.Rotation(math.pi / 2, 4, 'Z') @ Matrix.Translation((-cx, -cy, 0)))
    if ridge_along_front:
        for s_ in (-1, 1):
            gx, gy = P(s_ * (w / 2 + .01), 0); tri_wall('house_gable', d, h * .55, gx, gy, h, rot + 90, M[col])
    else:
        for s_ in (-1, 1):
            gx, gy = P(0, s_ * (d / 2 + .01)); tri_wall('house_gable', w, h * .55, gx, gy, h, rot, M[col])
    for i in range(3 if w > 8 else 2):                                  # front windows with trim and shutters
        u = -w / 2 + (i + .5) * w / (3 if w > 8 else 2) + (.8 if i == 1 else 0) * 0
        if i == 1 and w > 8: continue
        for zz in ((1.0,) if h < 4.5 else (1.0, 3.9)):
            wx, wy = P(u, d / 2 + .02); lit = r.random() < .5
            quad('house_win', 1.0, 1.35, wx, wy, zz + .7, rot, M['win%d' % r.randint(0, 3)] if lit else M['win_dark'])
            tx, ty = P(u, d / 2 + .06); box('house_win_trim', 1.25, .08, .1, tx, ty, zz - .02, M['trim'], .5, rot); box('house_win_trim', 1.25, .08, .12, tx, ty, zz + 1.38, M['trim'], .5, rot)
            for sgn in (-1, 1): sx_, sy_ = P(u + sgn * .72, d / 2 + .06); box('house_shutter', .35, .05, 1.35, sx_, sy_, zz, M['navy'] if r.random() < .5 else M['green'], .5, rot)
    dx, dy = P(.0 if w <= 8 else 0, d / 2 + .03); box('house_door', .95, .08, 2.1, dx, dy, 0, M['navy'] if r.random() < .4 else M['trim'], .5, rot)
    px, py = P(0, d / 2 + 1.0); box('porch_floor', 3.2, 2.0, .3, px, py, 0, M['floor'], 1., rot); box('porch_roof', 3.6, 2.3, .12, px, py, 2.6, M['roof'], 1., rot)
    for sgn in (-1, 1): qx, qy = P(sgn * 1.45, d / 2 + 1.85); box('porch_post', .12, .12, 2.3, qx, qy, .3, M['trim'], .5, rot)
    if r.random() < .7: kx, ky = P(w * .3, -d * .1); box('house_chimney', .7, .7, h * .55 + 1.2, kx, ky, h, M['block'], .6, rot)
    if r.random() < .5:
        lx, ly = P(-w / 2 - .6, d / 2 - .5); put('bush', lx, ly, 0, r.uniform(0, 360), r.uniform(.9, 1.3))
k = 0
for (x, y, face) in ((-32, 16, 0), (-46, 15, 0), (-60, 16, 0), (-74, 15, 0), (36, 16, 0), (50, 15.5, 0), (64, 16, 0), (-24, -16, 180), (-38, -16.5, 180), (-52, -16, 180),
                     (12, -18, 180), (32, 30, 270), (31, 44, 270), (12, 52, 90), (-4, 46, 0), (-26, 42, 0), (72, -20, 270), (70, -36, 270), (-60, -16, 180), (46, 40, 0)):
    house(x, y, rnd.choice([7, 8.5, 9.5]), rnd.choice([6.5, 7.5]), rnd.choice([3.4, 5.6, 5.8]), face, HOUSE_COLS[k % 8], M['roof'] if k % 3 else M['roof2'], k); k += 1
# the water tower PINE HOLLOW (NE behind the station): four legs, X braces at three levels, a balcony with rail, tank, cone roof, ladder, the town's name
WX, WY, WZ = 46.0, 64.0, 22.0
legs = [(WX + dx, WY + dy) for dx, dy in ((-3.6, -3.6), (3.6, -3.6), (3.6, 3.6), (-3.6, 3.6))]
for (x, y) in legs:
    beam('wt_leg', (x, y, 0), (WX + (x - WX) * .72, WY + (y - WY) * .72, WZ), .2, M['steel'], 8); box('wt_footing', 1.0, 1.0, .5, x, y, 0, M['kerb'], .5)
for zi, (za, zb) in enumerate(((0.5, 7.5), (7.5, 14.5), (14.5, 21.5))):
    fa, fb = 1 - .28 * za / WZ, 1 - .28 * zb / WZ
    for i in range(4):
        (x0, y0), (x1, y1) = legs[i], legs[(i + 1) % 4]
        A0 = (WX + (x0 - WX) * fa, WY + (y0 - WY) * fa, za); B1 = (WX + (x1 - WX) * fb, WY + (y1 - WY) * fb, zb)
        A1 = (WX + (x1 - WX) * fa, WY + (y1 - WY) * fa, za); B0 = (WX + (x0 - WX) * fb, WY + (y0 - WY) * fb, zb)
        beam('wt_brace', A0, B1, .05, M['steel'], 6); beam('wt_brace', A1, B0, .05, M['steel'], 6); beam('wt_strut', B0, B1, .08, M['steel'], 6)
cyl('wt_riser', .45, WZ, WX, WY, 0, M['steel'], 14)
cyl('wt_balcony', 5.4, .12, WX, WY, WZ, M['steel'], 32)
for a in range(32):
    t = a / 32 * 2 * math.pi; beam('wt_rail_post', (WX + 5.3 * math.cos(t), WY + 5.3 * math.sin(t), WZ + .1), (WX + 5.3 * math.cos(t), WY + 5.3 * math.sin(t), WZ + 1.1), .025, M['steel'], 4)
tube('wt_rail', [Vector((WX + 5.3 * math.cos(a / 40 * 2 * math.pi), WY + 5.3 * math.sin(a / 40 * 2 * math.pi), WZ + 1.1)) for a in range(41)], .035, M['steel'], 6)
tank = cyl('wt_tank', 4.9, 6.0, WX, WY, WZ + .1, M['steel'], 48)
cyl('wt_band', 4.93, 1.5, WX, WY, WZ + 2.4, mat('tower_band', png='tower_band', rough=.35), 48)
cyl('wt_roof', 5.1, 2.6, WX, WY, WZ + 6.1, M['steel'], 48, r2=.3); cyl('wt_finial', .35, .7, WX, WY, WZ + 8.7, M['steel'], 12, r2=.05)
for z in range(1, int(WZ)): box('wt_ladder_rung', .5, .05, .05, WX + 4.2, WY - 4.2, z, M['steel'], .5, 45)
anchor('water_tower', WX, WY, WZ + 3.0)
# a cylindrical UV for the band: wrap the name around the tank once (the planar UV would smear it)
ob = bpy.data.objects[[o.name for o in TOWN.objects if o.name.startswith('wt_band')][-1]]
me = ob.data; uvl = me.uv_layers.active.data
for p in me.polygons:
    for li in p.loop_indices:
        v = me.vertices[me.loops[li].vertex_index].co; a = (math.atan2(v.y - WY, v.x - WX) / (2 * math.pi) + .5 + .12) % 1.0
        uvl[li].uv = (a * 2.0, (v.z - WZ - 2.4) / 1.5)
# hills: low rolling ring, far (the background painter's sky goes behind them)
for i in range(14):
    a = i / 14 * 2 * math.pi + .2; r_ = 230 + 40 * math.sin(i * 1.7); hx, hy = r_ * math.cos(a), r_ * math.sin(a)
    bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=24, v_segments=10, radius=1.)
    for v in bm.verts: v.co = Vector((hx + v.co.x * 90, hy + v.co.y * 60, max(0, v.co.z) * (28 + 14 * math.sin(i * 2.3)) - 2))
    bm.normal_update(); obj_from_bm(bm, 'hill', M['hill'], 25., smooth=True)
for i in range(60):                                                     # tree clumps on the hills (scaled bushes read as woods at 200 m)
    a = rnd.uniform(0, 6.283); r_ = rnd.uniform(150, 215); put('bush', r_ * math.cos(a), r_ * math.sin(a), 0, rnd.uniform(0, 360), rnd.uniform(5, 9))

# ================================================================== merge the coded parts by material (fewer draw calls in the kit, the same look)
groups = {}
for o in list(TOWN.objects):
    if o.get('merge') and o.type == 'MESH' and not o.name.startswith(('shop_window_glass',)): groups.setdefault(o.data.materials[0].name, []).append(o)
for mname, objs in groups.items():
    if len(objs) < 2: continue
    with bpy.context.temp_override(active_object=objs[0], selected_editable_objects=objs, selected_objects=objs): bpy.ops.object.join()
    objs[0].name = 'town_' + mname
print('MERGED', len(groups), 'material groups; objects now', len(TOWN.objects))

# ================================================================== lights, world, trucks, save, export
TA.build_lights(SC, ANCH)
TA.link_trucks(SC, os.path.join(AP, 'out', 'truck.blend'), ANCH)
TA.set_light(SC, 'am')
meta = dict(anchors=ANCH, frame='metres, X east, Y north, Z up (plan frame)', light=TA.KIT_LIGHT)
tot = sum(sum(len(p.vertices) - 2 for p in o.data.polygons) for o in TOWN.objects if o.type == 'MESH')
print('TOWN_TRIS_BLEND', tot, 'OBJECTS', len(TOWN.objects))
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, 'town.blend'), relative_remap=True)
# GLB: the same objects; heavy templates (the 1 M-triangle tree) swapped for a decimated copy for the kit only
swap = {}
for nm, t in TPLS.items():
    if t.get('heavy'):
        lo = bpy.data.objects.new('lo_' + nm, t.data.copy()); SC.collection.objects.link(lo); md = lo.modifiers.new('dec', 'DECIMATE'); md.ratio = t['heavy'] if t['heavy'] < 1 else .06
        dg = bpy.context.evaluated_depsgraph_get(); dg.update(); me_lo = bpy.data.meshes.new_from_object(lo.evaluated_get(dg)); swap[t.data.name] = me_lo
        print('DECIMATE', nm, len(t.data.polygons), '->', len(me_lo.polygons)); bpy.data.objects.remove(lo)
for o in TOWN.objects:
    if o.type == 'MESH' and o.data.name in swap: o.data = swap[o.data.name]
for o in bpy.context.scene.objects: o.select_set(False)
for o in TOWN.objects: o.select_set(True)
bpy.ops.export_scene.gltf(filepath=os.path.join(OUT, 'town.glb'), export_format='GLB', use_selection=True, export_apply=True, export_lights=False, export_cameras=False,
                          export_extras=True, export_image_format='JPEG', export_image_quality=82)
gt = sum(sum(len(p.vertices) - 2 for p in o.data.polygons) for o in TOWN.objects if o.type == 'MESH')
uq = {o.data.name: sum(len(p.vertices) - 2 for p in o.data.polygons) for o in TOWN.objects if o.type == 'MESH'}; print('GLB_UNIQUE_TRIS', sum(uq.values()), sorted(uq.items(), key=lambda kv: -kv[1])[:8])
meta['glb_tris'] = gt; meta['blend_tris'] = tot
json.dump(meta, open(os.path.join(OUT, 'town_meta.json'), 'w'), indent=1)
print('GLB_TRIS', gt, 'GLB_MB %.1f' % (os.path.getsize(os.path.join(OUT, 'town.glb')) / 1e6))
print('TOWN_DONE')
