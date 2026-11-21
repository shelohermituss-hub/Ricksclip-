# bl_apron.py: builds THE AIRFIELD APRON of AERODROME DE VILLEBRUNE (plane-eater, set-builder 2026-11-21). No hand edits: everything from here.
# blender -b --factory-startup --python bl_apron.py -- <build/tex> <out dir>
#   -> out/apron.blend (full detail, Rick day light, no plane: apron_api.link_cessna appends it), out/apron_lite.glb (kit), out/apron_meta.json (anchors, tris)
# Frame: metres, X east, Y north, Z up. Cessna spot = origin, nose -Y (south, to the grass strip). Hangar mouth faces south at y 9.
# Rick recipe (CB_RULES 3, 1 + 1b): nature realistic (rick_tree, rick_grass), buildings and props SIMPLIFIED: clean shapes, bevelled edges, flat
# saturated paint, moderate texture, nothing dirty. Detail falls with distance: near full, mid simplified, far flat shapes + blob trees.
import bpy, bmesh, math, os, sys, json, random
from mathutils import Vector, Matrix
A = sys.argv[sys.argv.index('--') + 1:]; TEX, OUT = [os.path.abspath(p) for p in A[:2]]
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..', '..'))
sys.path[:0] = [HERE, os.path.join(ROOT, 'library', 'grass'), os.path.join(ROOT, 'library', 'trees')]
import rick_grass as G, rick_tree as T, apron_api as AA
os.makedirs(OUT, exist_ok=True); rnd = random.Random(1978)
bpy.ops.wm.read_factory_settings(use_empty=True); SC = bpy.context.scene
def coll(n):
    c = bpy.data.collections.new(n); SC.collection.children.link(c); return c
NEAR, MID, FAR, GRASS, AIR = coll('APRON_NEAR'), coll('APRON_MID'), coll('APRON_FAR'), coll('GRASS'), coll('AIR')
CUR = [NEAR]
lin = AA.lin

# ------------------------------------------------------------------ materials (Principled only: the GLB carries the same look)
MATS = {}
def mat(name, col='#ffffff', rough=.6, metal=0., png=None, emit=None, coat=0., alpha=None, trans=0.):
    if name in MATS: return MATS[name]
    m = bpy.data.materials.new(name); m.use_nodes = True; N, L = m.node_tree.nodes, m.node_tree.links; b = N['Principled BSDF']
    b.inputs['Base Color'].default_value = lin(col); b.inputs['Roughness'].default_value = rough; b.inputs['Metallic'].default_value = metal
    if coat: b.inputs['Coat Weight'].default_value = coat
    if trans: b.inputs['Transmission Weight'].default_value = trans
    if alpha is not None: b.inputs['Alpha'].default_value = alpha; m.surface_render_method = 'BLENDED'
    if png:
        t = N.new('ShaderNodeTexImage'); t.image = bpy.data.images.load(os.path.join(TEX, png + '.png'), check_existing=True); L.new(t.outputs[0], b.inputs['Base Color'])
    if emit: b.inputs['Emission Color'].default_value = lin(emit)
    b.inputs['Emission Strength'].default_value = 0.
    MATS[name] = m; return m
M = dict(
    sage=mat('hangar_sage', '#c9dcc0', .55), trim=mat('trim_white', '#f4f4ee', .4), door=mat('door_greyblue', '#8ea4b8', .45, coat=.3),
    roof=mat('roof_metal', '#b4bcc2', .35, .6), steel=mat('steel_grey', '#8e959c', .35, .8), dark=mat('rubber_dark', '#2e3034', .7),
    glass=mat('glass_win', '#9fc0dc', .05, .2, alpha=.55), conc=mat('concrete', '#ffffff', .85, png='concrete'), conc_in=mat('concrete_in', '#b4b2ac', .92)   # FIX 2: matte (glossy floor gave noisy white blotches in V4),
    cloth=mat('tablecloth', '#ffffff', .8, png='cloth'), wood=mat('wood_honey', '#ffffff', .5, png='wood'), bent=mat('wood_bentwood', '#6b4a2f', .4, coat=.4),
    china=mat('china_white', '#f7f7f4', .15, coat=.6), crystal=mat('glass_crystal', '#ffffff', .02, alpha=.25), oil=mat('oil_amber', '#f0a81c', .05, emit='#f0a81c', coat=.8),
    water=mat('water_clear', '#d8ecf6', .02, alpha=.35), chrome=mat('chrome', '#e8eaee', .08, 1.), canvas=mat('canvas_stripe', '#ffffff', .75, png='canvas'),
    sign=mat('sign_board', '#ffffff', .5, png='sign'), plaque=mat('sign_plaque', '#ffffff', .35, png='plaque', coat=.4), poster=mat('sign_poster', '#ffffff', .7, png='poster'),
    pump=mat('sign_pump', '#ffffff', .4, png='pump'), sock=mat('windsock_cloth', '#ffffff', .8, png='sock'), fields=mat('far_fields', '#ffffff', .9, png='fields'),
    yellow=mat('paint_yellow', '#efc53a', .5), white=mat('paint_white', '#f2f2ec', .5), drum_g=mat('drum_sage', '#7fa37e', .35, .3, coat=.5),
    drum_b=mat('drum_blue', '#5d84a8', .35, .3, coat=.5), drum_w=mat('drum_cream', '#ece4cc', .35, .3, coat=.5), tyre=mat('tyre_rubber', '#2a2b2e', .8),
    box=mat('cardboard', '#c7a274', .8), pot=mat('planter_mint', '#a9d6c4', .5), petal=mat('flower_white', '#fbfaf2', .6), petal_y=mat('flower_yellow', '#f6d23a', .6),
    hill=mat('far_hill', '#7fa86e', .95), hill2=mat('far_hill_blue', '#8eaac0', .95), mown=mat('lawn_mown', '#7ab33a', .9), mown2=mat('lawn_mown2', '#6ca632', .9),
    olive=mat('olive_tin', '#6f7a3a', .45, .3), rag=mat('rag_yellow', '#f2c230', .85), bench=mat('bench_sage', '#5f7f62', .5), lamp=mat('lamp_enamel', '#f2f2ec', .3, coat=.5),
    bulb=mat('bulb_work', '#fff4d6', .2, emit='#ffe8b8'), fluor=mat('lamp_fluor', '#ffffff', .2, emit='#f4f8ff'), peg=mat('pegboard', '#d8c39a', .8),
    rope=mat('rope_hemp', '#cdb88a', .9), radio=mat('radio_teal', '#3f8f8c', .4, coat=.5), thermos=mat('thermos_green', '#4f8a5a', .3, .4),
)
M['fluor'].node_tree.nodes['Principled BSDF'].inputs['Emission Strength'].default_value = 3.

# ------------------------------------------------------------------ mesh builders (world verts, world-planar UVs so a texture keeps its size)
TRIS = {}
def from_bm(bm, name, m, tile=None, smooth=False, bev=0., c=None):
    if tile:
        uvl = bm.loops.layers.uv.verify()
        for f in bm.faces:
            n = f.normal; ax = max(range(3), key=lambda i: abs(n[i]))
            for lp in f.loops:
                p = lp.vert.co; u, v = ((p.y, p.z) if ax == 0 else (p.x, p.z) if ax == 1 else (p.x, p.y)); lp[uvl].uv = (u / tile, v / tile)
    if smooth:
        for f in bm.faces: f.smooth = True
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free(); o = bpy.data.objects.new(name, me); me.materials.append(m); (c or CUR[0]).objects.link(o)
    if bev:
        b = o.modifiers.new('bev', 'BEVEL'); b.width = bev; b.segments = 2; b.limit_method = 'ANGLE'; b.harden_normals = False
    return o
def box(name, sx, sy, sz, x, y, z, m, rot=0., tile=1., bev=0., c=None, rx=0., ry=0.):
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.)
    R = Matrix.Rotation(math.radians(rot), 3, 'Z') @ Matrix.Rotation(math.radians(ry), 3, 'Y') @ Matrix.Rotation(math.radians(rx), 3, 'X')
    for v in bm.verts: v.co = R @ Vector((v.co.x * sx, v.co.y * sy, (v.co.z + .5) * sz)) + Vector((x, y, z))
    bm.normal_update(); return from_bm(bm, name, m, tile, bev=bev, c=c)
def cyl(name, r, h, x, y, z, m, seg=16, r2=None, rx=0., ry=0., rz=0., c=None, tile=None):
    bm = bmesh.new(); bmesh.ops.create_cone(bm, cap_ends=True, segments=seg, radius1=r, radius2=r if r2 is None else r2, depth=h)
    R = Matrix.Rotation(math.radians(rz), 3, 'Z') @ Matrix.Rotation(math.radians(ry), 3, 'Y') @ Matrix.Rotation(math.radians(rx), 3, 'X')
    for v in bm.verts: v.co = R @ (v.co + Vector((0, 0, h / 2))) + Vector((x, y, z))
    bm.normal_update(); o = from_bm(bm, name, m, tile, c=c)
    for p in o.data.polygons: p.use_smooth = len(p.vertices) == 4
    return o
def tube(name, pts, r, m, seg=6, c=None, closed=False):
    pts = [Vector(p) for p in pts]; bm = bmesh.new(); rings = []; n = len(pts)
    for i, p in enumerate(pts):
        d = ((pts[(i + 1) % n] - pts[i - 1]) if closed else (pts[min(i + 1, n - 1)] - pts[max(i - 1, 0)])).normalized()
        a = d.orthogonal().normalized(); b = d.cross(a)
        rings.append([bm.verts.new(p + (a * math.cos(k * 2 * math.pi / seg) + b * math.sin(k * 2 * math.pi / seg)) * r) for k in range(seg)])
    for i in range(n if closed else n - 1):
        r0, r1 = rings[i], rings[(i + 1) % n]
        for k in range(seg): bm.faces.new((r0[k], r0[(k + 1) % seg], r1[(k + 1) % seg], r1[k]))
    bm.normal_update(); return from_bm(bm, name, m, None, smooth=True, c=c)
def beam(name, p0, p1, r, m, seg=6, c=None): return tube(name, [p0, p1], r, m, seg, c)
def ring(name, cx, cy, cz, R_, r, m, seg=24, axis='z', c=None):
    pts = []
    for k in range(seg):
        a = k * 2 * math.pi / seg; u, v = math.cos(a) * R_, math.sin(a) * R_
        pts.append((cx + u, cy + v, cz) if axis == 'z' else (cx + u, cy, cz + v) if axis == 'y' else (cx, cy + u, cz + v))
    return tube(name, pts, r, m, 6, c, closed=True)
def lathe(name, prof, x, y, z, m, seg=24, c=None):
    """turned object: prof = [(r, z), ...] bottom to top (r 0 = closed)"""
    bm = bmesh.new(); rings = []
    for r, h in prof: rings.append([bm.verts.new((x + math.cos(k * 2 * math.pi / seg) * r, y + math.sin(k * 2 * math.pi / seg) * r, z + h)) for k in range(seg)])
    for i in range(len(rings) - 1):
        for k in range(seg): bm.faces.new((rings[i][k], rings[i][(k + 1) % seg], rings[i + 1][(k + 1) % seg], rings[i + 1][k]))
    bm.faces.new(list(reversed(rings[0])))
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5); bm.normal_update(); return from_bm(bm, name, m, None, smooth=True, c=c)
def quad(name, w, h, cx, cy, cz, yaw, m, c=None, flat=False):
    """picture plane, UV 0..1; yaw = the way its face looks (0 = -Y south, 90 = +X east, 180 = north). flat = on the ground (w along x)."""
    bm = bmesh.new(); a = math.radians(yaw)
    if flat: cs = [Vector(v) for v in ((-w / 2, -h / 2, 0), (w / 2, -h / 2, 0), (w / 2, h / 2, 0), (-w / 2, h / 2, 0))]
    else:
        ex = Vector((math.cos(a), math.sin(a), 0)); cs = [ex * (-w / 2) + Vector((0, 0, -h / 2)), ex * (w / 2) + Vector((0, 0, -h / 2)), ex * (w / 2) + Vector((0, 0, h / 2)), ex * (-w / 2) + Vector((0, 0, h / 2))]
    vs = [bm.verts.new(Vector((cx, cy, cz)) + q) for q in cs]; f = bm.faces.new(vs); uvl = bm.loops.layers.uv.verify()
    for lp, uv in zip(f.loops, ((0, 0), (1, 0), (1, 1), (0, 1))): lp[uvl].uv = uv
    bm.normal_update(); return from_bm(bm, name, m, None, c=c)
def corr(name, p0, p1, z0, z1, m, out, pitch=.16, amp=.022, zt=None):
    """corrugated cladding sheet in a vertical plane from p0 to p1 (x, y), ribs vertical, waves toward `out` (unit 2D normal).
    zt(s) (optional) = top height at the fraction s along the wall (gable)."""
    p0, p1, nrm = Vector((*p0, 0)), Vector((*p1, 0)), Vector((*out, 0)); L = (p1 - p0).length; n = max(2, int(L / pitch * 4))
    bm = bmesh.new(); col = []
    for i in range(n + 1):
        s = i / n; p = p0.lerp(p1, s) + nrm * (amp * (1 + math.sin(s * L / pitch * 2 * math.pi)) / 2); top = zt(s) if zt else z1
        col.append((bm.verts.new((p.x, p.y, z0)), bm.verts.new((p.x, p.y, top))))
    for i in range(n): bm.faces.new((col[i][0], col[i + 1][0], col[i + 1][1], col[i][1]))
    bm.normal_update()
    bm.faces.ensure_lookup_table()
    if bm.faces[0].normal.dot(nrm) < 0: bmesh.ops.reverse_faces(bm, faces=bm.faces[:])
    return from_bm(bm, name, m, 2., smooth=True)

ANCH = {}
def anchor(n, x, y, z=0.): ANCH[n] = [round(x, 3), round(y, 3), round(z, 3)]

# ================================================================== 1. GROUND: lawn, concrete apron in slabs, grass strip, taxi line
lawn = G.flat_lawn(size=(1400, 1400), location=(0, 0, 0)); SC.collection.objects.unlink(lawn); NEAR.objects.link(lawn)
SLAB = 4.
for ix in range(-3, 3):                     # outside apron x -12..12, y -4..9 ; hangar floor inside x -10..10, y 9..25 (smooth trowelled, lighter)
    for iy in range(-1, 7):
        x0, y0 = ix * SLAB, -4 + iy * SLAB
        if y0 >= 25: continue
        inside = y0 >= 9
        if inside and (x0 < -10 or x0 + SLAB > 10.01): continue
        sx = SLAB if not inside else SLAB; o = box('apron_slab_%d_%d' % (ix, iy), sx - .025, SLAB - .025, .14, x0 + sx / 2, y0 + SLAB / 2, -.11, M['conc_in'] if inside else M['conc'], tile=2.)
for ix in (-3, 2):                           # the two edge slabs inside the hangar (x -10..-8, 8..10)
    pass
for x0 in (-10., 8.):
    for iy in range(4): box('hangar_floor_edge_%d_%d' % (x0, iy), 1.975, SLAB - .025, .14, x0 + 1, 9 + iy * SLAB + SLAB / 2, -.11, M['conc_in'])
anchor('cessna_spot', 0, 0, .03); anchor('apron_centre', 0, 2, .03)
for i, (a, b) in enumerate((((0, -4.2), (0, -1.5)), ((0, 5.0), (0, 24.0)))):   # yellow taxi line: the nose-wheel line into the hangar (painted, 12 cm)
    L = abs(b[1] - a[1]); box('taxi_line_%d' % i, .12, L, .004, 0, (a[1] + b[1]) / 2, .03, M['yellow'])
for k in range(6): box('tie_ring_%d' % k, .12, .12, .02, (-4.6, 4.6, -4.6, 4.6, 0, 0)[k], (-1.0, -1.0, 3.6, 3.6, 3.7, -5)[k] if k < 5 else -5, .03, M['steel'])
# grass strip (the runway): mown 22 m wide band east-west at y -26..-48 in two greens (mowing stripes 6 m), white edge markers every 25 m
CUR[0] = MID
for k in range(-30, 30):
    quad('runway_mow_%d' % k, 6., 22., k * 6 + 3, -37, .006, 0, M['mown'] if k % 2 else M['mown2'], c=MID, flat=True)
for k in range(-7, 8):
    for yy in (-25.6, -48.4):
        box('runway_marker_%d_%d' % (k, yy), 1.4, .35, .22, k * 25, yy, 0, M['white'], bev=.03, c=MID)
        box('runway_marker_cap_%d_%d' % (k, yy), 1.42, .37, .04, k * 25, yy, .2, M['yellow'], c=MID)
CUR[0] = NEAR
# a mown taxi track from the apron to the strip, in the plane's wheel ruts (two worn lines in the grass: the plane comes and goes)
for k, x in enumerate((-1.15, 1.15)): quad('taxi_rut_%d' % k, .35, 21.6, x, -15.0, .004, 0, M['mown2'], flat=True)

# ================================================================== 2. THE HANGAR: pale sage corrugated cladding, white trim, grey-blue sliding doors
HX, HY0, HY1, EAVE, RIDGE, DOOR_W, DOOR_H = 10., 9., 25., 6.0, 8.2, 7.5, 4.6
def gable_top(xa, xb):
    return lambda s: EAVE + (RIDGE - EAVE) * (1 - abs((xa + (xb - xa) * s)) / HX)
# structure shell (inner face, plain sage lighter) + corrugated skin outside
for nm, sx, sy, x, y in (('wall_w', .15, HY1 - HY0, -HX + .075, (HY0 + HY1) / 2), ('wall_e', .15, HY1 - HY0, HX - .075, (HY0 + HY1) / 2), ('wall_back', 2 * HX, .15, 0, HY1 - .075)):
    box('hangar_' + nm, sx, sy, EAVE, x, y, 0, M['sage'], tile=2.)
for side in (-1, 1):
    box('hangar_pier_%d' % side, HX - DOOR_W, .2, EAVE, side * (HX + DOOR_W) / 2, HY0 + .1, 0, M['sage'])
box('hangar_header', 2 * DOOR_W, .2, EAVE - DOOR_H, 0, HY0 + .1, DOOR_H, M['sage'])
corr('clad_e', (HX, HY0), (HX, HY1), .15, EAVE, M['sage'], (1, 0)); corr('clad_w', (-HX, HY1), (-HX, HY0), .15, EAVE, M['sage'], (-1, 0))
corr('clad_back', (HX, HY1), (-HX, HY1), .15, EAVE, M['sage'], (0, 1), zt=lambda s: EAVE + (RIDGE - EAVE) * (1 - abs(HX - 2 * HX * s) / HX))
for side in (-1, 1):
    xa, xb = side * HX, side * DOOR_W
    corr('clad_pier_%d' % side, (xa, HY0 - .005), (xb, HY0 - .005), .15, EAVE, M['sage'], (0, -1))
corr('clad_header', (-DOOR_W, HY0 - .005), (DOOR_W, HY0 - .005), DOOR_H + .25, EAVE, M['sage'], (0, -1))
corr('clad_gable', (-HX, HY0 - .005), (HX, HY0 - .005), EAVE, RIDGE, M['sage'], (0, -1), zt=lambda s: EAVE + (RIDGE - EAVE) * (1 - abs(-HX + 2 * HX * s) / HX))
for y in (HY0, HY1):   # gable infill behind the skin (no see-through at the triangle)
    bm = bmesh.new(); vs = [bm.verts.new(v) for v in ((-HX, y + .1, EAVE), (HX, y + .1, EAVE), (0, y + .1, RIDGE))]; bm.faces.new(vs); bm.normal_update(); from_bm(bm, 'gable_infill_%d' % y, M['sage'])
# roof: two pitched sheets (standing-seam ribs every .6 m), ridge cap, overhang .45 m, white fascia boards, gutters + downpipes
OV = .45; slope = math.atan2(RIDGE - EAVE, HX)
for side in (-1, 1):
    bm = bmesh.new(); ex, ez = side * (HX + OV), EAVE - OV * math.tan(slope)
    P = [(0, HY0 - OV, RIDGE + .06), (ex, HY0 - OV, ez + .06), (ex, HY1 + OV, ez + .06), (0, HY1 + OV, RIDGE + .06)]
    vs = [bm.verts.new(p) for p in P]; f = bm.faces.new(vs if side < 0 else list(reversed(vs))); bmesh.ops.solidify(bm, geom=bm.faces[:], thickness=.08)
    bm.normal_update(); from_bm(bm, 'roof_%d' % side, M['roof'], 2.)
    yy = HY0 - OV
    while yy <= HY1 + OV:
        beam('roof_rib_%d_%.1f' % (side, yy), (0, yy, RIDGE + .1), (ex, yy, ez + .1), .025, M['roof'], 4); yy += .6
    box('fascia_eave_%d' % side, .06, HY1 - HY0 + 2 * OV, .22, ex, (HY0 + HY1) / 2, ez - .1, M['trim'])
    tube('gutter_%d' % side, [(ex + side * .1, HY0 - OV, ez - .05), (ex + side * .1, HY1 + OV, ez - .05)], .07, M['trim'], 8)
    for yy in (HY0 - OV + .15, HY1 + OV - .15):
        tube('downpipe_%d_%.0f' % (side, yy), [(ex + side * .1, yy, ez - .05), (ex + side * .1, yy, ez - .4), (side * (HX + .12), yy, ez - .7), (side * (HX + .12), yy, .25), (side * (HX + .32), yy - .0, .08)], .045, M['trim'], 8)
    for yf in (HY0 - OV, HY1 + OV):   # barge boards (white trim along the gable)
        beam('barge_%d_%.0f' % (side, yf), (0, yf - .03 * (1 if yf < 12 else -1), RIDGE + .02), (ex, yf - .03 * (1 if yf < 12 else -1), ez - .02), .07, M['trim'], 4)
box('ridge_cap', .5, HY1 - HY0 + 2 * OV, .14, 0, (HY0 + HY1) / 2, RIDGE + .05, M['roof'], bev=.03)
# white trim: corner boards, door frame (jambs + head), base board
for x in (-HX, HX):
    for y in (HY0, HY1): box('corner_trim_%d_%d' % (x, y), .24, .24, EAVE, x, y, 0, M['trim'], bev=.02)
for x in (-DOOR_W, DOOR_W): box('door_jamb_%d' % x, .26, .3, DOOR_H + .2, x, HY0 - .02, 0, M['trim'], bev=.02)
box('door_head_trim', 2 * DOOR_W + .26, .3, .26, 0, HY0 - .02, DOOR_H, M['trim'], bev=.02)
for side in (-1, 1): box('base_board_%d' % side, HX - DOOR_W, .06, .25, side * (HX + DOOR_W) / 2, HY0 - .05, 0, M['trim'])
# sliding doors: 4 grey-blue panels on a top track, HALF OPEN (two stacked each side, 7.4 m open in the middle); each: frame, 4 rails, a window row, handle, rollers
box('door_track', 2 * DOOR_W + 1.2, .16, .14, 0, HY0 - .3, DOOR_H + .06, M['steel'])
for x in range(-7, 8, 2): box('track_bracket_%d' % x, .08, .3, .3, x, HY0 - .17, DOOR_H, M['steel'])
box('door_guide_rail', 2 * DOOR_W, .08, .05, 0, HY0 - .3, 0, M['steel'])
PW, PH = 3.85, DOOR_H - .05
for k, (cx, cy) in enumerate(((-5.62, HY0 - .38), (-5.5, HY0 - .24), (5.5, HY0 - .24), (5.62, HY0 - .38))):
    box('door_panel_%d' % k, PW, .06, PH, cx, cy, .04, M['door'], bev=.01)
    for z in (.05, PH - .1): box('door_rail_%d_%.1f' % (k, z), PW, .09, .12, cx, cy - .02, z, M['door'], bev=.015)
    for z in (1.2, 2.4): box('door_rail_%d_%.1f' % (k, z), PW, .085, .09, cx, cy - .02, z, M['door'], bev=.015)
    for dx in (-PW / 2 + .06, PW / 2 - .06, 0): box('door_stile_%d_%.1f' % (k, dx), .12, .09, PH - .1, cx + dx, cy - .02, .05, M['door'], bev=.015)
    for w in range(3):   # the window row (frame + glass)
        wx = cx - PW / 2 + .5 + w * 1.42
        box('door_winframe_%d_%d' % (k, w), .9, .1, .62, wx + .2, cy - .025, 3.4, M['trim'], bev=.01)
        quad('door_glass_%d_%d' % (k, w), .76, .48, wx + .2, cy - .08, 3.71, 0, M['glass'])
    box('door_handle_%d' % k, .05, .1, .7, cx + (PW / 2 - .25) * (1 if cx < 0 else -1), cy - .08, 1.0, M['chrome'], bev=.01)
    for dx in (-1.4, 1.4):
        cyl('door_roller_%d_%.0f' % (k, dx), .08, .06, cx + dx, cy, DOOR_H + .02, M['steel'], seg=12, rx=90)
anchor('hangar_door_gap', 0, HY0, 0); anchor('hangar_mouth', 0, HY0 + 1.5, .03)
# hangar sign (gable header band) AERODROME DE VILLEBRUNE on a white board with a trim frame
box('sign_backer', 8.0, .08, 1.4, 0, HY0 - .09, 4.9, M['trim'], bev=.02)
quad('sign_villebrune', 7.8, 1.3, 0, HY0 - .14, 5.6, 0, M['sign'])   # texture aspect 6.02
anchor('hangar_sign', 0, HY0 - .14, 5.6)
# four gooseneck work lamps above the sign (row 27: they snap on at dusk); enamel shade, bulb, arm, wall plate; a light each (off by day)
for k, x in enumerate((-6.6, -2.2, 2.2, 6.6)):
    box('lamp_plate_%d' % k, .2, .04, .3, x, HY0 - .02, 6.25, M['lamp'])
    tube('lamp_arm_%d' % k, [(x, HY0 - .03, 6.4), (x, HY0 - .35, 6.62), (x, HY0 - .7, 6.55)], .025, M['lamp'], 6)
    lathe('lamp_shade_%d' % k, [(0, .0), (.06, .02), (.07, -.03), (.26, -.22), (.27, -.24)], x, HY0 - .72, 6.55, M['lamp'], seg=20)
    s = cyl('bulb_work_%d' % k, .06, .1, x, HY0 - .72, 6.3, mat('bulb_work', '#fff4d6'), seg=10)
    ld = bpy.data.lights.new('lamp_work_%d' % k, 'SPOT'); ld.spot_size = math.radians(80); ld.spot_blend = .5; ld.color = lin('#ffd49a')[:3]; ld.energy = 0
    lo = bpy.data.objects.new('lamp_work_%d' % k, ld); lo.location = (x, HY0 - .72, 6.25); lo['lamp_energy'] = 600.; lo.rotation_euler = (math.radians(20), 0, 0); NEAR.objects.link(lo)
# side windows on the east wall (seen from the table views): 3 windows, white frames + sills + mullions
for k, y in enumerate((12.5, 16.5, 20.5)):
    box('win_frame_e_%d' % k, .12, 1.8, 1.3, HX + .06, y, 2.1, M['trim'], bev=.02)
    quad('win_glass_e_%d' % k, 1.6, 1.1, HX + .125, y, 2.75, 90, M['glass'])
    box('win_mullion_e_%d' % k, .05, .05, 1.1, HX + .13, y, 2.2, M['trim']); box('win_sill_e_%d' % k, .22, 2.0, .06, HX + .1, y, 2.05, M['trim'])
    box('flower_box_e_%d' % k, .3, 1.5, .25, HX + .27, y, 1.78, M['pot'], bev=.02)
    for f in range(12):
        fy = y - .65 + f * .118; cyl('flower_e_%d_%d' % (k, f), .05, .05, HX + .27 + rnd.uniform(-.06, .06), fy, 2.05 + rnd.uniform(0, .06), M['petal'] if f % 3 else M['petal_y'], seg=8)
# front wall: the hazard plaque by the table spot (east pier) and the 1978 poster (west pier); a bench under the poster
box('plaque_backer', 1.08, .05, .78, 8.75, HY0 - .03, 1.42, M['steel'], bev=.01)
quad('plaque_dont_try', 1.0, .7, 8.75, HY0 - .065, 1.81, 0, M['plaque']); anchor('hazard_plaque', 8.75, HY0 - .065, 1.81)
box('poster_frame', .7, .04, .98, -8.75, HY0 - .03, 1.42, M['trim'])
quad('poster_meeting_1978', .6, .86, -8.75, HY0 - .055, 1.91, 0, M['poster']); anchor('poster_1978', -8.75, HY0 - .055, 1.91)
box('bench_seat', 1.8, .4, .05, -8.75, HY0 - .45, .45, M['bench'], bev=.01)
for dx in (-.8, .8):
    box('bench_leg_%d' % dx, .06, .36, .45, -8.75 + dx, HY0 - .45, 0, M['steel'])
box('bench_back', 1.8, .04, .3, -8.75, HY0 - .25, .6, M['bench'], bev=.01)
# planters at the door jambs: mint pots, white and yellow daisies, a tuft each
for k, x in enumerate((-7.95, 7.95)):
    lathe('planter_%d' % k, [(0, 0), (.22, 0), (.3, .42), (.33, .45), (0, .45)], x, HY0 - .55, 0, M['pot'], 20)
    for f in range(9): cyl('daisy_%d_%d' % (k, f), .05, .04, x + rnd.uniform(-.2, .2), HY0 - .55 + rnd.uniform(-.2, .2), .62 + rnd.uniform(0, .15), M['petal'] if f % 2 else M['petal_y'], seg=8)
# ---- the inside, seen through the open doors: lattice roof trusses with cross braces, fluorescent lamps, workbench, pegboard + tools, spare propeller,
#      parts shelf, drums, step ladder, the spare tyre (nothing dark: pale walls and lit tubes keep the mouth bright)
for k, y in enumerate((11., 15., 19., 23.)):
    bc = EAVE - .6
    beam('truss_bottom_%d' % k, (-HX + .1, y, bc), (HX - .1, y, bc), .06, M['steel'], 4)
    for s in (-1, 1): beam('truss_top_%d_%d' % (k, s), (s * (HX - .1), y, EAVE - .1), (0, y, RIDGE - .2), .06, M['steel'], 4)
    for j in range(1, 10):
        x = j * HX / 10
        for s in (-1, 1):
            zt = EAVE - .1 + (RIDGE - .2 - EAVE + .1) * (1 - x / HX)
            beam('truss_v_%d_%d_%d' % (k, j, s), (s * x, y, bc), (s * x, y, zt), .025, M['steel'], 4)
            x2 = (j - 1) * HX / 10; zt2 = EAVE - .1 + (RIDGE - .2 - EAVE + .1) * (1 - x2 / HX)
            beam('truss_d_%d_%d_%d' % (k, j, s), (s * x, y, bc), (s * x2, y, zt2 if j > 1 else zt2), .02, M['steel'], 4)
    for x in (-5, 5):
        box('fluor_tube_%d_%d' % (k, x), .14, 1.5, .08, x, y, bc - .7, M['fluor']); box('fluor_hood_%d_%d' % (k, x), .26, 1.56, .06, x, y, bc - .63, M['lamp'])
        for dy in (-.6, .6): beam('fluor_chain_%d_%d_%.0f' % (k, x, dy), (x, y + dy, bc - .57), (x, y + dy, bc), .008, M['steel'], 4)
for y in (13., 21.):
    ld = bpy.data.lights.new('hangar_fill', 'AREA'); ld.size = 6.; ld.energy = 900.; ld.color = lin('#f4f6ff')[:3]
    lo = bpy.data.objects.new('hangar_fill_%d' % y, ld); lo.location = (0, y, EAVE - 1.4); NEAR.objects.link(lo)
box('workbench_top', 3.2, .8, .08, -4, HY1 - .55, .9, M['wood'], bev=.01)
for dx in (-1.5, 1.5):
    for dy in (-.35, .35): box('workbench_leg_%d_%d' % (dx, dy * 10), .08, .08, .9, -4 + dx, HY1 - .55 + dy, 0, M['steel'])
box('workbench_shelf', 3.1, .75, .04, -4, HY1 - .55, .25, M['wood'])
box('pegboard', 3.4, .03, 1.4, -4, HY1 - .17, 1.15, M['peg'])
for t in range(14):   # tool silhouettes on the board: spanners, hammer, saws, clamps (simple shapes, real sizes)
    tx = -5.5 + t * .22; h = .25 + (t % 4) * .08
    box('tool_%d' % t, .04 + (t % 3) * .02, .03, h, tx, HY1 - .2, 1.55 - h / 2, M['steel'] if t % 3 else M['olive'])
box('vice', .2, .25, .18, -2.7, HY1 - .55, .98, M['bench'], bev=.01)
box('toolbox_bench', .5, .25, .22, -5.0, HY1 - .55, .98, M['drum_b'], bev=.02)
for s in (-1, 1):   # the spare wooden propeller on the back wall (two twisted blades + hub), a 1970s aero-club relic
    box('spare_prop_blade_%d' % s, .9, .04, .13, 3.6 + s * .48, HY1 - .2, 3.0, M['wood'], ry=s * 4, bev=.03)
cyl('spare_prop_hub', .09, .1, 3.6, HY1 - .2, 3.0, M['chrome'], seg=14, rx=90)
for j in range(4):   # parts shelf + cardboard boxes
    box('shelf_board_%d' % j, 2.4, .5, .03, 7.6, HY1 - .4, .3 + j * .55, M['steel'])
    for b in range(3): box('shelf_box_%d_%d' % (j, b), .5 + (b % 2) * .15, .4, .3 + (b * j % 3) * .06, 6.8 + b * .75, HY1 - .4, .33 + j * .55, M['box'], bev=.01)
for s in (-1, 1):
    for z in (0, 2.2): pass
    box('shelf_post_%d' % s, .04, .04, 2.0, 7.6 + s * 1.2, HY1 - .4, 0, M['steel'])
for k, (x, y, mm) in enumerate(((8.6, 22.0, 'drum_g'), (8.6, 21.3, 'drum_w'))):
    cyl('drum_in_%d' % k, .29, .88, x, y, 0, M[mm], seg=20)
for z in (.12, .44, .76): ring('drum_in_hoop_%d' % z, 8.6, 22.0, z, .295, .012, M[mm], 24)
for k in range(6): beam('ladder_rung_%d' % k, (-8.8, 18.6, .3 + k * .35), (-8.8, 19.1, .3 + k * .35), .02, M['steel'], 4)
for dy in (18.6, 19.1): beam('ladder_rail_%.1f' % dy, (-8.9, dy, 0), (-8.6, dy, 2.2), .025, M['steel'], 4)
ring('spare_tyre', -6.5, 22.5, .17, .3, .12, M['tyre'], 20, axis='z')

# ================================================================== 3. THE LEAN-TO OFFICE (west side): door, window, club notice board slot, bicycle
OX0 = -HX - 3.2
box('office_wall_s', 3.2, .15, 3.0, OX0 + 1.6, 12.0, 0, M['sage']); box('office_wall_w', .15, 6.0, 3.0, OX0 + .075, 15.0, 0, M['sage']); box('office_wall_n', 3.2, .15, 3.0, OX0 + 1.6, 18.0, 0, M['sage'])
corr('office_clad_s', (OX0, 11.99), (-HX, 11.99), .1, 3.0, M['sage'], (0, -1)); corr('office_clad_w', (OX0 - .005, 18), (OX0 - .005, 12), .1, 3.0, M['sage'], (-1, 0))
bm = bmesh.new(); vs = [bm.verts.new(v) for v in ((OX0 - .3, 11.7, 3.0), (-HX, 11.7, 3.7), (-HX, 18.3, 3.7), (OX0 - .3, 18.3, 3.0))]; bm.faces.new(vs); bmesh.ops.solidify(bm, geom=bm.faces[:], thickness=.08); bm.normal_update(); from_bm(bm, 'office_roof', M['roof'], 2.)
box('office_door', .9, .06, 2.05, OX0 + 1.0, 11.95, 0, M['door'], bev=.01); box('office_door_trim', 1.1, .08, 2.15, OX0 + 1.0, 11.97, 0, M['trim'])
cyl('office_knob', .03, .05, OX0 + 1.35, 11.9, 1.0, M['chrome'], seg=10, rx=90)
box('office_win_frame', .1, 1.4, 1.1, OX0 - .02, 15.0, 1.1, M['trim']); quad('office_win_glass', 1.2, .9, OX0 - .075, 15.0, 1.65, 270, M['glass'])
box('office_step', 1.2, .5, .15, OX0 + 1.0, 11.65, 0, M['conc_in'], bev=.02)
# the bicycle against the office wall (1970s step-through, sage): two spoked wheels, frame tubes, saddle, bars, basket
bx, by = OX0 - .45, 14.0
for k, dy in enumerate((-.52, .52)):
    ring('bike_tyre_%d' % k, bx, by + dy, .34, .33, .022, M['tyre'], 28, axis='x'); ring('bike_rim_%d' % k, bx, by + dy, .34, .3, .01, M['chrome'], 28, axis='x')
    for s in range(12): a = s * math.pi / 6; beam('bike_spoke_%d_%d' % (k, s), (bx, by + dy, .34), (bx, by + dy + math.cos(a) * .3, .34 + math.sin(a) * .3), .003, M['chrome'], 3)
for nm, a, b in (('down', (bx, by + .38, .85), (bx, by - .05, .36)), ('seat', (bx, by - .05, .36), (bx, by - .22, .82)), ('chain', (bx, by - .05, .36), (bx, by - .52, .34)),
                 ('stay', (bx, by - .22, .8), (bx, by - .52, .34)), ('fork', (bx, by + .38, .85), (bx, by + .52, .34))):
    beam('bike_' + nm, a, b, .018, M['bench'], 6)
box('bike_saddle', .1, .24, .06, bx, by - .24, .84, M['dark'], bev=.02); beam('bike_bars', (bx - .25, by + .36, .98), (bx + .25, by + .36, .98), .012, M['chrome'], 6)
box('bike_basket', .3, .28, .22, bx, by + .62, .78, M['box'], bev=.01)

# ================================================================== 4. APRON PROPS: fuel pump island, drums, chocks, tow bar, tool chest, tyre stack, cones
CUR[0] = NEAR
px, py = -11.0, 2.0   # AVGAS pump (1970s cabinet pump) on a raised island, two bollards, hose on its hook
box('pump_island', 1.6, 1.0, .15, px, py, 0, M['conc_in'], bev=.04)
box('pump_body', .62, .42, 1.55, px, py, .15, M['trim'], bev=.04); quad('pump_face', .5, .5, px, py - .215, 1.2, 0, M['pump'])
box('pump_top', .66, .46, .18, px, py, 1.7, M['bench'], bev=.04); lathe('pump_globe', [(0, 0), (.14, .02), (.17, .14), (.14, .27), (0, .3)], px, py, 1.88, M['lamp'], 18)
box('pump_holster', .12, .1, .2, px + .33, py, 1.0, M['steel'])
tube('pump_hose', [(px + .33, py, 1.0), (px + .55, py - .1, .6), (px + .62, py - .3, .2), (px + .45, py - .55, .18), (px + .3, py - .45, .5), (px + .36, py - .05, .95)], .022, M['dark'], 8)
for dx in (-.65, .65):
    cyl('bollard_%d' % (dx * 10), .08, .9, px + dx, py - .62, 0, M['yellow'], seg=14); cyl('bollard_cap_%d' % (dx * 10), .085, .05, px + dx, py - .62, .9, M['white'], seg=14)
# drums by the east hangar corner (oil, kerosene, water), hoops, bungs; one with a drum pump
for k, (x, y, mm) in enumerate(((11.0, 8.2, 'drum_b'), (11.65, 8.45, 'drum_g'), (11.3, 7.55, 'drum_w'))):
    cyl('drum_%d' % k, .29, .88, x, y, 0, M[mm], seg=22)
    for z in (.14, .44, .74): ring('drum_hoop_%d_%d' % (k, z * 100), x, y, z, .296, .014, M[mm], 24)
    cyl('drum_bung_%d' % k, .04, .025, x + .15, y, .88, M['steel'], seg=10); lathe('drum_rim_%d' % k, [(.27, 0), (.3, 0), (.3, .03), (.27, .03)], x, y, .87, M['steel'], 24)
beam('drum_pump', (11.0, 8.2, .88), (11.0, 8.2, 1.4), .022, M['steel'], 8); beam('drum_pump_handle', (11.0, 8.2, 1.38), (11.3, 8.2, 1.45), .015, M['steel'], 6)
# tyre stack + a coiled rope (tie-downs)
for k in range(3): ring('tyre_stack_%d' % k, 12.4, 6.2, .1 + k * .2, .27, .09, M['tyre'], 22)
ring('rope_coil_a', 10.6, 6.5, .03, .22, .02, M['rope'], 18); ring('rope_coil_b', 10.6, 6.5, .06, .19, .02, M['rope'], 18)
# wheel chocks (yellow-painted wood pairs joined by rope) at both mains, the nose-wheel tow bar on the concrete
for s in (-1, 1):
    for dy in (-.3, .3):
        box('chock_%d_%d' % (s, dy * 10), .3, .16, .12, s * 1.165, -1.155 + dy, .03, M['yellow'], bev=.02)
    beam('chock_rope_%d' % s, (s * 1.165 + .1, -1.45, .1), (s * 1.165 + .1, -.86, .1), .01, M['rope'], 4)
beam('towbar_shaft', (.0, -3.2, .06), (.35, -4.6, .06), .02, M['steel'], 6); beam('towbar_T', (.1, -4.68, .06), (.6, -4.52, .06), .018, M['steel'], 6)
for s in (-1, 1): cyl('towbar_grip_%d' % s, .028, .14, .35 + s * .25, -4.6 + s * .08, .06, M['dark'], seg=10, rz=-72, ry=90)
# the owner's rolling tool chest by the nose (he polishes the propeller here every morning): drawers, handles, casters, a polish tin + folded yellow rags on top
tx, ty = -1.8, -3.6
box('toolchest', .7, .45, .85, tx, ty, .12, M['drum_b'], bev=.02)
for d in range(5):
    box('toolchest_drawer_%d' % d, .64, .02, .13, tx, ty - .235, .2 + d * .15, M['drum_b'], bev=.01); box('toolchest_pull_%d' % d, .3, .03, .02, tx, ty - .25, .28 + d * .15, M['chrome'])
for dx in (-.28, .28):
    for dy in (-.17, .17): cyl('caster_%d_%d' % (dx * 10, dy * 10), .05, .04, tx + dx, ty + dy, .03, M['dark'], seg=10, rx=90)
cyl('polish_tin', .07, .07, tx - .15, ty, .97, M['olive'], seg=16); cyl('polish_lid', .072, .015, tx - .15, ty, 1.04, M['steel'], seg=16)
for k in range(3): box('rag_folded_%d' % k, .22, .18, .03, tx + .14, ty + .02, .97 + k * .03, M['rag'], rot=k * 7, bev=.008)
# two traffic cones at the apron corners (orange-white bands), and the step ladder the owner uses on the wing
for k, (x, y) in enumerate(((-12.3, -4.5), (12.3, -4.5))):
    cyl('cone_%d' % k, .17, .55, x, y, .04, mat('cone_orange', '#f07a1a', .5), seg=18, r2=.03); box('cone_base_%d' % k, .4, .4, .04, x, y, 0, mat('cone_orange', '#f07a1a'), bev=.01)
    cyl('cone_band_%d' % k, .12, .1, x, y, .28, M['white'], seg=18, r2=.09)
for s in (-1, 1):
    beam('stepl_front_%d' % s, (-4.6 + s * .22, 1.6, 0), (-4.6 + s * .16, 1.95, 1.2), .022, M['steel'], 4); beam('stepl_back_%d' % s, (-4.6 + s * .22, 2.4, 0), (-4.6 + s * .16, 2.0, 1.2), .022, M['steel'], 4)
for k in range(3): box('stepl_tread_%d' % k, .4, .14, .03, -4.6, 1.65 + k * .1, .3 + k * .32, M['steel'])
box('stepl_top', .4, .22, .04, -4.6, 1.97, 1.2, M['bench'])
anchor('owner_polish_spot', -.9, -4.4, .03)

# ================================================================== 5. THE TABLE UNDER THE WING (rows 10-17) + Michel's chair
TX_, TY_ = 3.4, -.32   # FIX 2: under the left wing; ray-cast to the sun (apron_api SUN_AZ day): the whole cloth top is in the wing's shade
TW, TD, TH = 1.25, .8, .76
for dx in (-1, 1):
    for dy in (-1, 1): lathe('table_leg_%d_%d' % (dx, dy), [(0, 0), (.025, 0), (.03, .1), (.024, .5), (.03, TH - .05), (.0, TH - .05)], TX_ + dx * (TW / 2 - .08), TY_ + dy * (TD / 2 - .08), .03, M['wood'], 12)
box('table_top', TW, TD, .04, TX_, TY_, .03 + TH - .05, M['wood'], bev=.01)
CT = .03 + TH - .01   # the white cloth: top, four drapes (.3 m, flared, hem band), soft folds at the corners
quad('cloth_top', TW + .06, TD + .06, TX_, TY_, CT + .002, 0, M['cloth'], flat=True)
for k, (ax, ay, L) in enumerate(((0, -1, TW), (0, 1, TW), (-1, 0, TD), (1, 0, TD))):
    bm = bmesh.new(); n = 24; cols_ = []
    for i in range(n + 1):
        s = i / n - .5; fold = .012 * math.sin(i * 1.7) ; ex = Vector((-ay, ax, 0)) * (s * (L + .06))
        base = Vector((TX_ + ax * (TW / 2 + .03), TY_ + ay * (TD / 2 + .03), CT)) + ex
        out = Vector((ax, ay, 0)) * (.03 + fold + .02); cols_.append((bm.verts.new(base), bm.verts.new(base + out + Vector((0, 0, -.3)))))
    for i in range(n): bm.faces.new((cols_[i][0], cols_[i][1], cols_[i + 1][1], cols_[i + 1][0]))
    uvl = bm.loops.layers.uv.verify()
    for f in bm.faces:
        for lp in f.loops: lp[uvl].uv = (.5 + (lp.vert.co - Vector((TX_, TY_, 0))).dot(Vector((-ay, ax, 0))) / 2.4, .02 + (CT - lp.vert.co.z) * .1)
    bm.normal_update(); o = from_bm(bm, 'cloth_drape_%d' % k, M['cloth'], smooth=True)
anchor('table_centre', TX_, TY_, CT); anchor('table_seat', TX_, TY_ - .75, .03)
# the place setting: big plate + side plate (rims), knife, fork, the oil WINE GLASS (amber), the big water JUG + tumbler, the KITCHEN SCALE spot (cork mat)
lathe('plate_main', [(0, 0), (.08, 0), (.1, .012), (.14, .016), (.15, .024), (.145, .027), (0, .014)], TX_, TY_ - .14, CT, M['china'], 32)
ring('plate_main_rim', TX_, TY_ - .14, CT + .025, .147, .004, mat('china_band', '#b9cfb0', .2), 32)
lathe('plate_side', [(0, 0), (.06, 0), (.08, .01), (.095, .016), (0, .01)], TX_ - .36, TY_ + .05, CT, M['china'], 28)
box('knife', .022, .23, .006, TX_ + .19, TY_ - .14, CT + .003, M['chrome'], bev=.002); box('fork_shaft', .02, .15, .006, TX_ - .19, TY_ - .18, CT + .003, M['chrome'], bev=.002)
for t in range(4): box('fork_tine_%d' % t, .004, .06, .006, TX_ - .2 + t * .007, TY_ - .07, CT + .003, M['chrome'])
GX, GY = TX_ + .3, TY_ + .12
lathe('oil_glass', [(0, 0), (.035, 0), (.036, .006), (.006, .012), (.005, .09), (.03, .11), (.045, .16), (.042, .2), (.04, .2), (.043, .16), (.028, .112), (0, .1)], GX, GY, CT, M['crystal'], 24)
lathe('oil_in_glass', [(0, .105), (.03, .113), (.041, .15), (.04, .155), (0, .155)], GX, GY, CT, M['oil'], 20); anchor('oil_glass', GX, GY, CT)
JX, JY = TX_ - .12, TY_ + .24
lathe('water_jug', [(0, 0), (.07, 0), (.08, .02), (.085, .12), (.07, .22), (.05, .26), (.055, .28), (.07, .29), (.068, .295), (.05, .285), (.045, .26), (.065, .22), (.078, .12), (.072, .02), (0, .015)], JX, JY, CT, M['crystal'], 28)
lathe('jug_water', [(0, .016), (.07, .02), (.076, .12), (.064, .19), (0, .19)], JX, JY, CT, M['water'], 24)
tube('jug_handle', [(JX - .07, JY, CT + .24), (JX - .13, JY, CT + .22), (JX - .14, JY, CT + .12), (JX - .075, JY, CT + .07)], .009, M['crystal'], 8); anchor('water_jug', JX, JY, CT)
lathe('tumbler', [(0, 0), (.032, 0), (.036, .1), (.034, .1), (.03, .006), (0, .006)], JX + .17, JY - .05, CT, M['crystal'], 20)
cyl('scale_mat', .11, .006, TX_ + .38, TY_ - .2, CT, mat('cork', '#c99a63', .9), seg=24); anchor('scale_spot', TX_ + .38, TY_ - .2, CT + .006)
anchor('salt_spot', TX_ - .3, TY_ - .25, CT)
# Michel's bentwood bistro chair (seat, 4 splayed legs, leg ring, double back hoop), tucked in at the south side
CX, CY = TX_, TY_ - .68
cyl('chair_seat', .21, .035, CX, CY, .45, M['bent'], seg=24); ring('chair_seat_rim', CX, CY, .45, .205, .015, M['bent'], 24)
for k in range(4):
    a = math.pi / 4 + k * math.pi / 2; beam('chair_leg_%d' % k, (CX + math.cos(a) * .17, CY + math.sin(a) * .17, .45), (CX + math.cos(a) * .23, CY + math.sin(a) * .23, .03), .015, M['bent'], 6)
ring('chair_leg_ring', CX, CY, .2, .2, .009, M['bent'], 24)
for k, rr in enumerate((.17, .12)):
    pts = [(CX + math.cos(a) * rr, CY - .17 - .02 * k, .47 + math.sin(a) * .1 + .2 + (.32 if a > 0 else 0)) for a in []]
    pts = [(CX - rr, CY - .18, .47), (CX - rr, CY - .2, .75), (CX - rr * .6, CY - .21, .9 + k * -.05), (CX, CY - .21, .93 - k * .06), (CX + rr * .6, CY - .21, .9 - k * .05), (CX + rr, CY - .2, .75), (CX + rr, CY - .18, .47)]
    tube('chair_back_hoop_%d' % k, pts, .012, M['bent'], 6)
anchor('chair', CX, CY, .03)

# ================================================================== 6. THE OWNER'S DECK CHAIR by the hangar mouth (row 25) + his crate table, thermos, radio
DX, DY, YAW = -6.4, 5.4, -35.   # faces south-east: he watches his plane (and the table)
R = Matrix.Rotation(math.radians(YAW), 3, 'Z'); P0 = Vector((DX, DY, 0))
def L_(x, y, z): return tuple(P0 + R @ Vector((x, y, z)))
for s in (-1, 1):
    beam('dchair_rail_%d' % s, L_(s * .3, -.55, .02), L_(s * .3, .35, .95), .02, M['wood'], 4)
    beam('dchair_leg_%d' % s, L_(s * .33, .3, .02), L_(s * .33, -.2, .55), .02, M['wood'], 4)
    beam('dchair_arm_%d' % s, L_(s * .34, -.45, .55), L_(s * .34, .1, .58), .02, M['wood'], 4)
for y_, z_ in ((-.55, .03), (.35, .95), (-.2, .55)): beam('dchair_bar_%.1f' % y_, L_(-.32, y_, z_), L_(.32, y_, z_), .018, M['wood'], 6)
bm = bmesh.new(); n = 16; rows = []
for i in range(n + 1):   # the yellow-white striped canvas sling, sagging between the bars
    t = i / n; y = -.5 + .82 * t; z = .08 + .82 * t - .22 * math.sin(t * math.pi); rows.append([bm.verts.new(L_(x, y, z)) for x in (-.28, .28)])
for i in range(n): bm.faces.new((rows[i][0], rows[i][1], rows[i + 1][1], rows[i + 1][0]))
uvl = bm.loops.layers.uv.verify()
for f in bm.faces:
    for lp in f.loops: lp[uvl].uv = (.5 + (R.inverted() @ (lp.vert.co - P0)).x * 1.7, (R.inverted() @ (lp.vert.co - P0)).y)
bm.normal_update(); from_bm(bm, 'dchair_canvas', M['canvas'], smooth=True); anchor('owner_deckchair', DX, DY, .03)
cx_, cy_ = L_(.7, -.1, 0)[:2]
box('crate_table', .5, .4, .4, cx_, cy_, 0, M['wood'], rot=YAW, bev=.015)
for z in (.12, .28): box('crate_slat_gap_%d' % (z * 100), .51, .41, .015, cx_, cy_, z, M['bent'], rot=YAW)
cyl('thermos', .045, .3, cx_ - .1, cy_ + .05, .4, M['thermos'], seg=16); cyl('thermos_cup', .05, .07, cx_ - .1, cy_ + .05, .7, M['steel'], seg=16)
box('radio_1978', .26, .09, .15, cx_ + .08, cy_ - .05, .4, M['radio'], rot=YAW, bev=.012); beam('radio_aerial', (cx_ + .16, cy_ - .05, .55), (cx_ + .3, cy_ - .02, .95), .003, M['chrome'], 3)
for k in range(2): box('rag_spare_%d' % k, .2, .16, .025, cx_ + .1, cy_ + .1, .4 + .025 * k, M['rag'], rot=YAW + 10 * k)

# ================================================================== 7. WINDSOCK (south-west apron corner): tapered mast, swivel, ring frame, 5-band sock, 3 guy wires
WX, WY = -15.5, -7.0
cyl('wsock_base', .35, .12, WX, WY, 0, M['conc_in'], seg=16); cyl('wsock_mast', .07, 6.0, WX, WY, .12, M['white'], seg=14, r2=.045)
for k in range(5): ring('wsock_band_%d' % k, WX, WY, .5 + k * 1.1, .07 - k * .005, .006, mat('cone_orange', '#f07a1a'), 14)
cyl('wsock_swivel', .07, .16, WX, WY, 6.1, M['steel'], seg=12)
WD = Vector((.8, .6, 0)).normalized(); mouth = Vector((WX, WY, 5.98)) + WD * .35   # a light breeze from the south-west: the sock points north-east, droops 12 deg
ring('wsock_ring', mouth.x, mouth.y, mouth.z, .3, .015, M['steel'], 20, axis='z'); SC_ = SC
o = SC.objects
bm = bmesh.new(); n, seg = 10, 18; rings = []
for i in range(n + 1):
    t = i / n; r = .3 - .17 * t; c = mouth + WD * (2.4 * t) + Vector((0, 0, -.5 * t * t)); ax = (WD + Vector((0, 0, -.2 * t))).normalized(); a = ax.orthogonal().normalized(); b = ax.cross(a)
    rings.append([bm.verts.new(c + (a * math.cos(k * 2 * math.pi / seg) + b * math.sin(k * 2 * math.pi / seg)) * r) for k in range(seg + 1)])
for i in range(n):
    for k in range(seg): bm.faces.new((rings[i][k], rings[i][k + 1], rings[i + 1][k + 1], rings[i + 1][k]))
uvl = bm.loops.layers.uv.verify()
for i, f in enumerate(bm.faces):
    ii, kk = divmod(i, seg)
    for lp, (du, dv) in zip(f.loops, ((0, 0), (0, 1), (1, 1), (1, 0))): lp[uvl].uv = ((ii + du) / n, (kk + dv) / seg)
bm.normal_update(); ws = from_bm(bm, 'windsock', M['sock'], smooth=True)
beam('wsock_arm', (WX, WY, 6.15), (mouth.x, mouth.y, 6.15), .015, M['steel'], 4)
for k in range(3):
    a = math.radians(30 + k * 120); ax_, ay_ = WX + math.cos(a) * 3.6, WY + math.sin(a) * 3.6
    beam('wsock_guy_%d' % k, (WX, WY, 4.2), (ax_, ay_, .1), .005, M['steel'], 3); box('wsock_anchor_%d' % k, .25, .25, .12, ax_, ay_, 0, M['conc_in'], bev=.02)
anchor('windsock', WX, WY, 6.0)

# ================================================================== 8. FENCE LINE (white post-and-rail, south of the strip and east side, with a field gate)
CUR[0] = MID; posts = []
def fence(p0, p1, gap=None):
    p0, p1 = Vector(p0), Vector(p1); L = (p1 - p0).length; n = int(L / 2.5); d = (p1 - p0) / L
    for i in range(n + 1):
        p = p0 + d * (i * L / n); posts.append(p)
        box('fence_post', .12, .12, 1.15, p.x, p.y, 0, M['white'], rot=math.degrees(math.atan2(d.y, d.x)), bev=.015)
        box('fence_cap', .16, .16, .04, p.x, p.y, 1.15, M['white'], rot=math.degrees(math.atan2(d.y, d.x)))
    yaw = math.degrees(math.atan2(d.y, d.x))
    for z in (.45, .95): box('fence_rail', L, .045, .11, (p0.x + p1.x) / 2, (p0.y + p1.y) / 2, z, M['white'], rot=yaw)
fence((-70, -56), (34, -56)); fence((34, -56), (34, -8)); fence((34, -4), (34, 30))
for z in (.3, .7, 1.05): box('gate_bar_%d' % (z * 10), .05, 4.0, .07, 34.05, -6, z, M['wood'])
beam('gate_brace', (34.05, -7.9, .3), (34.05, -4.1, 1.05), .03, M['wood'], 4)
anchor('fence_gate', 34, -6, 0)
CUR[0] = NEAR

# ================================================================== 9. TREES (rick_tree): the near one SE of the table (dapple), mid ones round the hangar, far hedgerow blobs
def tree(name, x, y, h, w, n, seed, lod, c, rz=0.):
    r = T.make_tree(name, height=h, crown_width=w, n_clumps=n, seed=seed, lod=lod, clump_var=(.5, 1.7) if c is FAR else (.6, 1.5), crown_height=h * .8 if c is FAR else None)
    r.location = (x, y, 0); r.rotation_euler = (0, 0, math.radians(rz))
    for o in [r] + list(r.children_recursive):
        for cc in list(o.users_collection): cc.objects.unlink(o)
        c.objects.link(o)
    return r
TREES = [tree('tree_table', 7.0, -4.9, 8.5, 7.5, 26, 3, 'near', NEAR, 40), tree('tree_hangar_e', 15.5, 17.0, 10.5, 8.5, 24, 5, 'mid', MID),
         tree('tree_office', -17.5, 20.0, 9.0, 7.0, 20, 9, 'mid', MID), tree('tree_fence_e', 38.0, -30.0, 9.5, 8.0, 18, 12, 'mid', MID)]
anchor('tree_table', 7.0, -4.9, 0)
for k in range(26):   # far hedgerow blob trees along the field edges (south, east, north)
    if k < 12: x, y = -110 + k * 20 + rnd.uniform(-5, 5), -95 + rnd.uniform(-6, 6)
    elif k < 19: x, y = 75 + rnd.uniform(-5, 5), -70 + (k - 12) * 22
    else: x, y = -90 + (k - 19) * 28 + rnd.uniform(-6, 6), 75 + rnd.uniform(-6, 6)
    h_ = rnd.uniform(8, 13); tree('tree_far_%d' % k, x, y, h_, h_ * rnd.uniform(.8, 1.1), 8, 100 + k, 'mid', FAR)   # FIX 2: lod mid, irregular clumps (no lollipops)
for k in range(9):   # a row of tall poplars along the far lane, north-east (a French airfield landmark seen from the table views)
    tree('poplar_%d' % k, 50 + k * 9, 48 + k * 1.5, 16, 4.6, 6, 200 + k, 'mid', FAR)

# ================================================================== 10. FAR: field patchwork beyond the fence, low hills in two hazes (slight blue haze only on the far)
CUR[0] = FAR
for nm, w, h, x, y in (('fields_s', 1400, 500, 0, -307), ('fields_e', 600, 700, 334, 0), ('fields_n', 1400, 560, 0, 380), ('fields_w', 560, 700, -360, 0)):
    o = quad(nm, w, h, x, y, .012, 0, M['fields'], c=FAR, flat=True)
    for lp in o.data.uv_layers.active.data: lp.uv = (lp.uv[0] * w / 200, lp.uv[1] * h / 200)
for k in range(14):
    a = math.radians(k * 360 / 14 + rnd.uniform(-8, 8)); d = rnd.uniform(520, 760); s = rnd.uniform(140, 260)
    bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=24, v_segments=10, radius=1.)
    for v in bm.verts:
        if v.co.z < 0: v.co.z = 0
        v.co = Vector((v.co.x * s * 1.5, v.co.y * s * .9, v.co.z * rnd.uniform(14, 30)))   # FIX 2: softer, lower, wider
    for v in bm.verts: v.co += Vector((math.cos(a) * d, math.sin(a) * d, -2))
    bm.normal_update(); from_bm(bm, 'hill_%d' % k, M['hill2'] if d > 640 else M['hill'], smooth=True, c=FAR)
CUR[0] = NEAR

# FIX 2: a far tree line in front of the hills' feet (south, east, west, north arcs at 160-230 m), lod far blobs packed so they read as one hedgerow mass
for k in range(40):
    a = math.radians(k * 9 + rnd.uniform(-3, 3)); d = rnd.uniform(160, 230); h_ = rnd.uniform(9, 14)
    tree('treeline_%d' % k, math.cos(a) * d, math.sin(a) * d, h_, h_ * 1.1, 7, 300 + k, 'far', FAR)
# FIX 2: the joint bed under the slabs (the lawn showed green in the joints) + contact shadows (soft dark discs, no shadow cast) under legs, wheels, drums
box('joint_bed', 24.2, 13.2, .02, 0, 2.5, -.01, mat('joint_dark', '#6f6e6a', .9)); box('joint_bed_in', 20, 16, .02, 0, 17, -.01, mat('joint_dark', '#6f6e6a'))
def contact(name, x, y, rx, ry, dark=.85, z=.032):
    m = bpy.data.materials.get('contact_dark')
    if m is None:
        m = bpy.data.materials.new('contact_dark'); m.use_nodes = True; N, L = m.node_tree.nodes, m.node_tree.links
        for n in list(N): N.remove(n)
        gc = N.new('ShaderNodeTexGradient'); gc.gradient_type = 'SPHERICAL'; tc_ = N.new('ShaderNodeTexCoord'); L.new(tc_.outputs['Generated'], gc.inputs['Vector'])
        mp = N.new('ShaderNodeMapping'); mp.inputs['Location'].default_value = (-1, -1, 0); mp.inputs['Scale'].default_value = (2, 2, 1); L.new(tc_.outputs['UV'], mp.inputs['Vector']); L.new(mp.outputs[0], gc.inputs['Vector'])
        pw = N.new('ShaderNodeMath'); pw.operation = 'POWER'; pw.inputs[1].default_value = 1.8; L.new(gc.outputs['Fac'], pw.inputs[0])
        mul = N.new('ShaderNodeMath'); mul.operation = 'MULTIPLY'; mul.inputs[1].default_value = dark; L.new(pw.outputs[0], mul.inputs[0])
        dk = N.new('ShaderNodeBsdfDiffuse'); dk.inputs['Color'].default_value = (0.015, 0.016, 0.03, 1); trn = N.new('ShaderNodeBsdfTransparent')
        mx2 = N.new('ShaderNodeMixShader'); L.new(mul.outputs[0], mx2.inputs['Fac']); L.new(trn.outputs[0], mx2.inputs[1]); L.new(dk.outputs[0], mx2.inputs[2])
        o2 = N.new('ShaderNodeOutputMaterial'); L.new(mx2.outputs[0], o2.inputs['Surface'])
    o = quad('contact_' + name, 2 * rx, 2 * ry, x, y, z, 0, m, flat=True); o.visible_shadow = False; return o
for dx in (-1, 1):
    for dy in (-1, 1): contact('table_leg_%d_%d' % (dx, dy), TX_ + dx * (TW / 2 - .08), TY_ + dy * (TD / 2 - .08), .12, .12)
contact('table', TX_, TY_, .75, .5, .45, .031)
for k in range(4):
    a = math.pi / 4 + k * math.pi / 2; contact('chair_leg_%d' % k, CX + math.cos(a) * .23, CY + math.sin(a) * .23, .07, .07)
contact('chair', CX, CY, .3, .3, .4, .031)
for nm, x, y, r in (('wheel_L', 1.165, -1.155, .3), ('wheel_R', -1.165, -1.155, .3), ('wheel_nose', 0, -2.76, .26), ('drum_0', 11.0, 8.2, .42), ('drum_1', 11.65, 8.45, .42),
                    ('drum_2', 11.3, 7.55, .42), ('tyres', 12.4, 6.2, .45), ('toolchest', tx, ty, .5), ('pump', px, py, .55), ('crate', cx_, cy_, .38), ('deckchair', DX, DY, .5)):
    contact(nm, x, y, r, r)
anchor('table_seat', TX_, TY_ - .75, .03)

# ================================================================== 11. GRASS TUFTS only where chosen: apron edge, fence posts, hangar + office feet, trunk, windsock, markers, runway edges
def into(o, c):
    for cc in list(o.users_collection): cc.objects.unlink(o)
    c.objects.link(o); return o
into(G.tufts_along([(-12.1, -4.15), (12.1, -4.15)], width=.9, density=5, offset=-.45, seed=2, name='tufts_apron_s'), GRASS)
into(G.tufts_along([(-12.1, -4.2), (-12.1, 9.0)], width=.8, density=4, offset=-.4, seed=3, name='tufts_apron_w'), GRASS)
into(G.tufts_along([(12.1, -4.2), (12.1, 9.0)], width=.8, density=4, offset=.4, seed=4, name='tufts_apron_e'), GRASS)
into(G.tufts_along([(10.2, 9.0), (10.2, 25.2)], width=.7, density=4, offset=.35, seed=5, name='tufts_hangar_e'), GRASS)
into(G.tufts_along([(-13.5, 18.2), (-13.5, 25.2), (10, 25.3)], width=.7, density=3, offset=.35, seed=6, lod='mid', name='tufts_hangar_back'), GRASS)
into(G.tufts([(p.x + rnd.uniform(-.25, .25), p.y + rnd.uniform(-.25, .25)) for p in posts for _ in range(3)], height=.5, lod='mid', seed=8, name='tufts_fence'), GRASS)
for r in TREES[:1]: into(G.tufts_around(r, r_in=.1, r_out=1.4, density=7, seed=9, name='tufts_tree_table'), GRASS)
into(G.tufts([(WX + rnd.uniform(-.7, .7), WY + rnd.uniform(-.7, .7)) for _ in range(20)], seed=10, name='tufts_windsock'), GRASS)
into(G.tufts([(k * 25 + rnd.uniform(-1, 1), yy + rnd.uniform(-.4, .4)) for k in range(-3, 4) for yy in (-25.6, -48.4) for _ in range(3)], lod='mid', seed=11, name='tufts_markers'), GRASS)
anchor('lens_band_hook', 6.6, -5.2, 0)   # row 1 low camera in the grass edge: the stretch builder adds G.tufts_lens_band(cam) for its own camera

# ================================================================== 12. AIR LIFE: dust motes in the sun over the table + the hangar mouth (kit drifts them; Blender: tiny self-lit specks)
dm = mat('air_mote', '#fff6dc', .5, emit='#fff6dc'); dm.node_tree.nodes['Principled BSDF'].inputs['Emission Strength'].default_value = 1.2
for k in range(90):
    zone = (TX_, TY_ + .3, 1.2, 1.6) if k < 45 else (0, HY0 + .5, 2.2, 3.5)
    x, y, z = zone[0] + rnd.uniform(-zone[3], zone[3]), zone[1] + rnd.uniform(-1, 1), rnd.uniform(.6, zone[2] + .8)
    o = cyl('air_mote_%d' % k, .004, .006, x, y, z, dm, seg=5, c=AIR); o.visible_shadow = False

# ================================================================== light, save, LITE GLB, meta
AA.set_light(SC, 'day')
SC.render.engine = 'CYCLES'; SC.cycles.device = 'CPU'
def tri(o):
    dg = bpy.context.evaluated_depsgraph_get(); e = o.evaluated_get(dg); me = e.to_mesh(); n = sum(len(p.vertices) - 2 for p in me.polygons); e.to_mesh_clear(); return n
for c in (NEAR, MID, FAR, GRASS, AIR):
    TRIS[c.name] = sum(tri(o) for o in c.all_objects if o.type == 'MESH')
TRIS['total'] = sum(TRIS.values()); print('APRON_TRIS', TRIS)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, 'apron_tmp.blend')); os.replace(os.path.join(OUT, 'apron_tmp.blend'), os.path.join(OUT, 'apron.blend'))
# LITE: same world; the kit gets everything but the lights (it builds its own); far trees are already blobs
for o in bpy.data.objects: o.select_set(o.type == 'MESH')
bpy.ops.export_scene.gltf(filepath=os.path.join(OUT, 'apron_lite_tmp.glb'), export_format='GLB', use_selection=True, export_apply=True, export_yup=True)
os.replace(os.path.join(OUT, 'apron_lite_tmp.glb'), os.path.join(OUT, 'apron_lite.glb'))
SUN = AA.SUN_AZ['day']; e = math.radians(AA.RL['day']['sun_el'])
light = {'day': dict(top=AA.RL['day']['sky_top'], hor=AA.RL['day']['sky_low'], sun=AA.RL['day']['sun_col'], si=3.2, amb=AA.RL['day']['fill_col'], ai=1.3,
                     dir=[round(SUN[0] * math.cos(e) * 10, 2), round(math.sin(e) * 10, 2), round(-SUN[1] * math.cos(e) * 10, 2)])}
json.dump(dict(anchors=ANCH, tris=TRIS, light=light, frame='metres, X east, Y north, Z up; kit B2T(x,y,z)=(x,z,-y)'), open(os.path.join(OUT, 'apron_meta.json'), 'w'), indent=1)
print('ANCHORS', len(ANCH)); print('APRON_DONE')
