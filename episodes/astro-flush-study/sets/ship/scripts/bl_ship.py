"""bl_ship.py: builds the WHOLE ship place of astro-flush-study (LOOK_INVENTORY sections B + F + G). blender -b -P bl_ship.py
-> ../out/ship.blend, ship_lite.glb, ship_meta.json. Blender metres, Z up, inventory sizes x1.55.
Ship axis X, nose +X: fuselage body x 0..21.5 (house/hexagon section 4.66 x 4.66), nose cockpit x 21.5..26.4 (glass canopy, real interior:
back wall slats, 2 hanging lamp pairs, 2 pilot seats, navigator chair, side consoles, radio station on the +Y wall), aft: gold collar, truss with
2 gold tanks, 2 round solar fans, 2 rectangular arrays, engine drum + bell, flame. Porthole side +Y: 10 windows per side, 2 of them real openings
(porthole_a = aft-most, shot 2; porthole_b = 6th from the nose, shot 11) with a small lit room behind for a character card.
Every ship object is parented to the empty ship_root (the ship is a mover). Earth, rim and sky dome are world objects.
Helpers copied from sets/toilet/scripts/bl_toilet.py (after library row yft_town_helpers), plus alpha/emission pictures and a bar beam."""
import bpy, bmesh, math, json, os, sys, random
from mathutils import Vector, Matrix, Euler
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(HERE, '..'); OUT = os.path.join(ROOT, 'out'); TEX = os.path.join(ROOT, 'tex')
os.makedirs(OUT, exist_ok=True); sys.path.insert(0, HERE)
PRM = json.load(open(os.path.join(ROOT, 'params_ship.json'))); PAL = PRM['palette']
bpy.ops.wm.read_factory_settings(use_empty=True); SC = bpy.context.scene; rnd = random.Random(5)
def coll(name):
    c = bpy.data.collections.new(name); SC.collection.children.link(c); return c
SET, WORLD, STAND, LIGHTS = coll('ship_set'), coll('ship_world'), coll('standins'), coll('lights')
def lin(h):
    h = h.lstrip('#'); v = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return [(c / 12.92 if c <= .04045 else ((c + .055) / 1.055) ** 2.4) for c in v] + [1.]
MATS = {}
def mat(name, col=None, rough=None, metal=None, emit=None, es=None, alpha=None, png=None, emit_png=False, alpha_png=False):
    """one flat principled colour from the palette (rough/metal/emit/alpha from params unless given). png = picture as base or emission."""
    if name in MATS: return MATS[name]
    P = PAL.get(name, {}); m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = lin(col or P.get('hex', '#ff00ff'))
    b.inputs['Roughness'].default_value = P.get('rough', .85) if rough is None else rough
    b.inputs['Metallic'].default_value = P.get('metal', 0.) if metal is None else metal
    b.inputs['Specular IOR Level'].default_value = P.get('spec', .5 if b.inputs['Roughness'].default_value < .6 else .2)
    es = P.get('emit', 0.) if es is None else es
    ec = emit or P.get('ehex') or col or P.get('hex')
    if es and ec: b.inputs['Emission Color'].default_value = lin(ec)
    if es: b.inputs['Emission Strength'].default_value = es
    a = P.get('alpha') if alpha is None else alpha
    if a is not None: b.inputs['Alpha'].default_value = a
    if png:
        t = nt.nodes.new('ShaderNodeTexImage'); t.image = bpy.data.images.load(os.path.join(TEX, png)); t.extension = 'EXTEND'
        nt.links.new(t.outputs[0], b.inputs['Emission Color' if emit_png else 'Base Color'])
        if emit_png: b.inputs['Base Color'].default_value = (0, 0, 0, 1); b.inputs['Emission Strength'].default_value = es or 1.
        if alpha_png: nt.links.new(t.outputs[1], b.inputs['Alpha'])
    MATS[name] = m; return m
# ------------------------------------------------------------------ mesh pieces added to a bmesh (local coords, optional matrix)
def MT(loc=(0, 0, 0), rot=(0, 0, 0)): return Matrix.Translation(loc) @ Euler([math.radians(a) for a in rot]).to_matrix().to_4x4()
def MF(o, X, Y, Z):
    m = Matrix((X, Y, Z)).transposed().to_4x4(); m.translation = Vector(o); return m
def abox(bm, sx, sy, sz, M=None, bev=.008):
    t = bmesh.new(); bmesh.ops.create_cube(t, size=1.)
    for v in t.verts: v.co = Vector((v.co.x * sx, v.co.y * sy, v.co.z * sz))
    if bev and min(sx, sy, sz) > bev * 2.2: bmesh.ops.bevel(t, geom=t.edges[:], offset=bev, segments=2, affect='EDGES', profile=.5)
    if M: bmesh.ops.transform(t, matrix=M, verts=t.verts[:])
    me = bpy.data.meshes.new('_t'); t.to_mesh(me); t.free(); bm.from_mesh(me); bpy.data.meshes.remove(me)
def alathe(bm, prof, seg=24, M=None, close=False, caps=True, ey=1., jit=0.):
    """rings around local Z. prof rows: (radius_x, z[, x offset[, radius_y]]). jit = random radial jitter (crinkled foil)."""
    M = M or Matrix(); rings = []
    for p in prof:
        ry = (p[3] if len(p) > 3 else p[0]) * ey; xo = p[2] if len(p) > 2 else 0.
        rings.append([bm.verts.new(M @ Vector((math.cos(k * 2 * math.pi / seg) * p[0] * (1 + jit * (rnd.random() - .5)) + xo,
                                                 math.sin(k * 2 * math.pi / seg) * ry * (1 + jit * (rnd.random() - .5)), p[1]))) for k in range(seg)])
    n = len(rings)
    for i in range(n if close else n - 1):
        a, b = rings[i], rings[(i + 1) % n]
        for k in range(seg): bm.faces.new((a[k], a[(k + 1) % seg], b[(k + 1) % seg], b[k]))
    if caps and not close: bm.faces.new(rings[0][::-1]); bm.faces.new(rings[-1])
def acyl(bm, r, h, M=None, seg=16, r2=None): alathe(bm, [(r, -h / 2), (r if r2 is None else r2, h / 2)], seg, M)
def rr_pts(w, h, r, n=6):
    pts = []
    for cx, cy, a0 in ((w / 2 - r, h / 2 - r, 0), (-w / 2 + r, h / 2 - r, 90), (-w / 2 + r, -h / 2 + r, 180), (w / 2 - r, -h / 2 + r, 270)):
        for k in range(n + 1):
            a = math.radians(a0 + 90 * k / n); pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return pts
def arring(bm, w, h, r, t, d, M=None, lip=.05):
    """rounded-rectangle ring frame in local XY: opening w x h (corner radius r), frame width t, depth d along Z, a deep inner bevel (lip) on both faces."""
    M = M or Matrix(); O, I, I2 = rr_pts(w + 2 * t, h + 2 * t, r + t), rr_pts(w, h, r), rr_pts(w + 2 * lip, h + 2 * lip, r + lip); n = len(O)
    loops = [[(p[0], p[1], z) for p in pts] for pts, z in ((I, -d / 2 + lip), (I2, -d / 2), (O, -d / 2), (O, d / 2), (I2, d / 2), (I, d / 2 - lip))]
    vs = [[bm.verts.new(M @ Vector(p)) for p in lp] for lp in loops]
    for i in range(len(vs)):
        a, b = vs[i], vs[(i + 1) % len(vs)]
        for k in range(n): bm.faces.new((a[k], a[(k + 1) % n], b[(k + 1) % n], b[k]))
def aquad(bm, w, h, M=None):
    M = M or Matrix(); vs = [bm.verts.new(M @ Vector(p)) for p in ((-w / 2, -h / 2, 0), (w / 2, -h / 2, 0), (w / 2, h / 2, 0), (-w / 2, h / 2, 0))]
    f = bm.faces.new(vs); uv = bm.loops.layers.uv.verify()
    for lp, c in zip(f.loops, ((0, 0), (1, 0), (1, 1), (0, 1))): lp[uv].uv = c
def apoly(bm, pts, thick=0.):
    vs = [bm.verts.new(Vector(p)) for p in pts]; f = bm.faces.new(vs)
    if thick: r = bmesh.ops.solidify(bm, geom=[f], thickness=thick)
def abeam(bm, p, q, r=.05, seg=4):
    p, q = Vector(p), Vector(q); d = q - p; L = d.length
    if L < 1e-4: return
    z = d.normalized(); x = z.orthogonal().normalized(); y = z.cross(x)
    alathe(bm, [(r, 0), (r, L)], seg, MF(p, x, y, z))
def rect_sub(rects, hole):
    out = []; hu0, hu1, hv0, hv1 = hole
    for u0, u1, v0, v1 in rects:
        if u1 <= hu0 or u0 >= hu1 or v1 <= hv0 or v0 >= hv1: out.append((u0, u1, v0, v1)); continue
        if u0 < hu0: out.append((u0, hu0, v0, v1))
        if u1 > hu1: out.append((hu1, u1, v0, v1))
        a, b = max(u0, hu0), min(u1, hu1)
        if v0 < hv0: out.append((a, b, v0, hv0))
        if v1 > hv1: out.append((a, b, hv1, v1))
    return [r for r in out if r[1] - r[0] > .05 and r[3] - r[2] > .05]
def subs(rects, holes):
    for h in holes: rects = rect_sub(rects, h)
    return rects
MOVERS, ANCH = {}, {}
def obj(name, bm, m, loc=(0, 0, 0), rot=(0, 0, 0), c=None, smooth=False, mover=None):
    """mesh object with its origin at loc (the mesh is local to it). mover = dict of extra meta -> listed in meta movers."""
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    if smooth:
        sharp = [e for e in bm.edges if len(e.link_faces) == 2 and e.calc_face_angle(0) > .6]
        if sharp: bmesh.ops.split_edges(bm, edges=sharp)
        for f in bm.faces: f.smooth = True
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free(); o = bpy.data.objects.new(name, me); me.materials.append(m if not isinstance(m, str) else mat(m))
    o.location = loc; o.rotation_euler = [math.radians(a) for a in rot]; (c or SET).objects.link(o)
    if mover is not None: MOVERS[name] = dict(loc=[round(v, 4) for v in loc], rot=list(rot), **mover)
    return o
def B(): return bmesh.new()
def box(name, size, loc, m, bev=.008, rot=(0, 0, 0), **kw):
    bm = B(); abox(bm, *size, bev=bev); return obj(name, bm, m, loc, rot, **kw)
def cyl(name, r, h, loc, m, rot=(0, 0, 0), seg=16, r2=None, **kw):
    bm = B(); acyl(bm, r, h, seg=seg, r2=r2); return obj(name, bm, m, loc, rot, smooth=True, **kw)
def pic(name, w, h, M, png, es=1., alpha=True, mname=None, **kw):
    """emissive picture card (PIL png from tex/), alpha from the png. M = placement matrix (local XY = picture, +Z = its front)."""
    bm = B(); aquad(bm, w, h, M); return obj(name, bm, mat(mname or 'pic_' + os.path.splitext(png)[0], png=png, emit_png=True, alpha_png=alpha, es=es, rough=.9), **kw)

# ================================================================== A. FUSELAGE BODY (x 0..XB) and NOSE (XB..XN)
HW = 2.33; XB, XN = 21.5, 26.4; FS, FZ = .56, .25                   # front of the nose = body section x FS, raised FZ
PROF = [(-HW, -HW), (HW, -HW), (HW, -1.0), (HW, .93), (.93, HW), (-.93, HW), (-HW, .93), (-HW, -1.0)]
FRONT = [(y * FS, z * FS + FZ) for y, z in PROF]
EDGE = {'belly': 0, 'side_lo_p': 1, 'side_up_p': 2, 'shoulder_p': 3, 'top': 4, 'shoulder_n': 5, 'side_up_n': 6, 'side_lo_n': 7}
def frame(i, x0=0.):
    a, b = Vector(PROF[i]), Vector(PROF[(i + 1) % 8]); d = b - a; L = d.length; v = d / L
    return Vector((x0, a.x, a.y)), Vector((1, 0, 0)), Vector((0, v.x, v.y)), Vector((0, v.y, -v.x)), L
WIN_X = [1.4 + 2.3 * k for k in range(9)]; WIN_Z = -.15; WW, WH_, WR, WT = .55, .85, .2, .26
PORTS = {'porthole_a': 0, 'porthole_b': 3}                           # window index (from aft) of the real openings
def win_v(i, z):
    o, U, V, N, L = frame(i); return (z - o.z) / V.z
def hull_face(i, mname, pw=2.0, ph=1.4, holes=(), extra_hole_pad=0.):
    o, U, V, N, L = frame(i); nrow = max(1, round(L / ph)); ph = L / nrow; g = .045; t = .06
    bk, bp, br, bs = B(), B(), B(), B()
    for u0, u1, v0, v1 in subs([(0, XB, 0, L)], holes):
        abox(bk, u1 - u0, v1 - v0, .03, MF(o + U * ((u0 + u1) / 2) + V * ((v0 + v1) / 2) + N * (-.015), U, V, N), bev=0)
    for r in range(nrow):
        sh = pw * rnd.uniform(.2, .8); u = -sh; step = pw
        while u < XB:
            for u0, u1, v0, v1 in subs([(max(u, 0) + g, min(u + step, XB) - g, r * ph + g, (r + 1) * ph - g)], holes):
                abox(bp, u1 - u0, v1 - v0, t, MF(o + U * ((u0 + u1) / 2) + V * ((v0 + v1) / 2) + N * (t / 2), U, V, N), bev=.018)
                k = 0; ru = u0 + .12
                while ru < u1 - .1 and v1 - v0 > .3:
                    acyl(br, .022, .02, MF(o + U * ru + V * (v1 - .07) + N * (t + .005), U, V, N), seg=6); ru += .32
                if (u1 - u0) > .6 and (v1 - v0) > .5 and rnd.random() < .6:
                    su, sv = u0 + rnd.uniform(.15, u1 - u0 - .45), v0 + rnd.uniform(.12, v1 - v0 - .12)
                    abox(bs, rnd.uniform(.12, .3), .025, .006, MF(o + U * (su + .15) + V * sv + N * (t + .002), U, V, N), bev=0)
            u += step; step = pw * rnd.choice((.5, .75, 1., 1., 1.25, 1.5))
    nm = 'hull_' + [k for k, v in EDGE.items() if v == i][0]
    obj(nm + '_backing', bk, 'hull_core'); obj(nm + '_panels', bp, mname); obj(nm + '_rivets', br, 'rivet', smooth=True); obj(nm + '_scuffs', bs, 'scuff')
for side in (1, -1):
    iu = EDGE['side_up_p' if side > 0 else 'side_up_n']; vc = win_v(iu, WIN_Z)
    holes = [(x - WW / 2, x + WW / 2, vc - WH_ / 2, vc + WH_ / 2) for x in WIN_X]
    hull_face(iu, 'hull_side', holes=holes); hull_face(EDGE['side_lo_p' if side > 0 else 'side_lo_n'], 'hull_side')
hull_face(EDGE['belly'], 'hull_belly', pw=1.3, ph=1.2); hull_face(EDGE['top'], 'hull_top', pw=2.2, ph=.95)
hull_face(EDGE['shoulder_p'], 'hull_top', pw=2.2, ph=1.0); hull_face(EDGE['shoulder_n'], 'hull_top', pw=2.2, ph=1.0)
# belt stripe + sill on both sides (z -1.39..-1.0 stripe, sill under it), roof dashes, LODESTAR on both shoulders
bst, bsl, bd = B(), B(), B()
for side in (1, -1):
    abox(bst, XB - .1, .1, .39, MT((XB / 2, side * (HW + .07), -1.195)), bev=.02); abox(bsl, XB - .1, .08, .2, MT((XB / 2, side * (HW + .06), -1.5)), bev=.02)
    o, U, V, N, L = frame(EDGE['shoulder_p' if side > 0 else 'shoulder_n'])
    for x in [1.0 + 1.5 * k for k in range(14)]: abox(bd, .62, .12, .05, MF(o + U * x + V * (L * .82) + N * .085, U, V, N), bev=.01)
for y in (.55, -.55):
    for x in [1.75 + 1.5 * k for k in range(13)]: abox(bd, .62, .12, .05, MT((x, y, HW + .085)), bev=.01)
obj('belt_stripe', bst, 'stripe'); obj('belt_sill', bsl, 'sill'); obj('roof_dashes', bd, 'roof_dash')
for side in (1, -1):
    o, U, V, N, L = frame(EDGE['shoulder_p' if side > 0 else 'shoulder_n'])
    Uw = U * (-side); c = o + U * 11.0 + V * (L / 2) + N * .075
    pic('lodestar_letters_%s' % ('p' if side > 0 else 'n'), 7.75, .85, MF(c, Uw, V if side > 0 else -V, N if side > 0 else N), 'lodestar.png', es=PAL['win_glow'].get('emit', 1.6) * 3, mname='lodestar_letters')
# windows: ring (6 white hex bolts), inner blue-grey bevel, amber glow card (or the real opening + a lit room for the portholes)
br_, bb_, bi_, bg_, bf_ = B(), B(), B(), B(), B()
for side in (1, -1):
    for k, x in enumerate(WIN_X):
        Mw = MF((x, side * (HW + .07), WIN_Z), (side, 0, 0), (0, 0, 1), (0, side, 0))
        arring(br_, WW, WH_, WR, WT, .16, Mw, lip=.04)
        arring(bi_, WW - .08, WH_ - .08, WR - .04, .06, .34, Mw @ Matrix.Translation((0, 0, -.2)), lip=.015)
        for bu, bv in ((-1, -1), (1, -1), (-1, 1), (1, 1), (0, -1.1), (0, 1.1)):
            px = bu * (WW / 2 + WT * .45) * (.9 if bv in (1, -1) and bu else 1); pz = bv * (WH_ / 2 + WT * .45) * (1 if bu else .97)
            alathe(bb_, [(.04, 0), (.04, .035)], 6, Mw @ Matrix.Translation((px, pz, .08)))
        name = [n for n, i in PORTS.items() if i == k and side > 0]
        if not name:
            abox(bg_, .8, .06, 1.05, MT((x, side * (HW - .42), WIN_Z)), bev=0)
            abox(bf_, .4, .02, .6, MT((x, side * (HW - .385), WIN_Z + .05)), bev=0)
obj('window_rings', br_, 'port_ring', smooth=True); obj('window_bevels', bi_, 'port_bevel', smooth=True); obj('window_bolts', bb_, 'bolt_white', smooth=True)
obj('window_glow', bg_, 'win_glow'); obj('window_glow_inner', bf_, mat('win_glow_inner', col='#d9a865', es=1.1, emit='#d9a865'))
def stub_room(name, x):
    """the lit room behind a porthole (seen through the real opening): cream walls, a red rail, a small inner porthole on the back wall."""
    bw, bf = B(), B(); y0, y1, z0, z1 = HW - .1, -.5, -1.25, 1.75
    abox(bw, 2.8, .1, z1 - z0, MT((x, y1, (z0 + z1) / 2)), bev=0)
    for s in (1, -1): abox(bw, .1, y0 - y1, z1 - z0, MT((x + s * 1.4, (y0 + y1) / 2, (z0 + z1) / 2)), bev=0)
    abox(bw, 2.8, y0 - y1, .1, MT((x, (y0 + y1) / 2, z1)), bev=0); abox(bf, 2.8, y0 - y1, .1, MT((x, (y0 + y1) / 2, z0)), bev=0)
    obj(name + '_room_walls', bw, 'stub_wall'); obj(name + '_room_floor', bf, 'stub_floor')
    box(name + '_room_rail', (2.7, .08, .1), (x, y1 + .1, -.95), 'stub_rail', bev=.02)
    bm = B(); arring(bm, .55, .8, .2, .1, .08, MF((x + .15, y1 + .07, -.1), (1, 0, 0), (0, 0, 1), (0, 1, 0))); obj(name + '_room_port', bm, 'port_ring', smooth=True)
    bm = B(); aquad(bm, .58, .83, MF((x + .15, y1 + .06, -.1), (1, 0, 0), (0, 0, 1), (0, 1, 0))); obj(name + '_room_port_glass', bm, 'stub_window')
    ANCH[name] = [x, HW + .15, WIN_Z]; ANCH[name + '_card'] = [x - .1, HW - .7, z0 + .05]
for n, k in PORTS.items(): stub_room(n, WIN_X[k])
# hazard box (the waste vent from outside) on the stripe under porthole_b, a loose wrench drifting by the stripe (mover)
xh = WIN_X[PORTS['porthole_b']]; box('hazard_box', (.46, .12, .46), (xh + .55, HW + .17, -1.2), 'hazard_y', bev=.02)
box('hazard_box_core', (.34, .03, .34), (xh + .55, HW + .235, -1.2), 'black', bev=.01); cyl('hazard_lens', .09, .04, (xh + .55, HW + .26, -1.2), mat('hazard_lens', col='#3a6070', rough=.2), rot=(90, 0, 0))
bm = B(); abox(bm, .5, .05, .08, MT((0, 0, 0)), bev=.01); alathe(bm, [(.08, -.025), (.08, .025)], 6, MT((.27, 0, 0), (90, 0, 0))); alathe(bm, [(.06, -.025), (.06, .025)], 6, MT((-.26, 0, 0), (90, 0, 0)))
obj('wrench', bm, 'wrench', (12.4, HW + 1.1, -1.75), (20, 10, 35), mover={'drift': [.15, .05, .03, 25]})
# ------------------------------------------------------------------ nose: opaque lower skin + top brow, glass above the floor line, navy bars
def ring(x, P): return [Vector((x, y, z)) for y, z in P]
RA, RF = ring(XB, PROF), ring(XN, FRONT)
GLASS_E = (2, 3, 5, 6); bo, bgl, bbar = B(), B(), B()
for i in range(8):
    j = (i + 1) % 8; quad = [RA[i], RA[j], RF[j], RF[i]]
    if i in GLASS_E:
        apoly(bgl, quad)
        for t in (1 / 3, 2 / 3): abeam(bbar, RA[i].lerp(RF[i], t), RA[j].lerp(RF[j], t), .045)
    else: apoly(bo, quad, .07)
    abeam(bbar, RA[i], RF[i], .06)
for i in range(8): abeam(bbar, RA[i], RA[(i + 1) % 8], .07); abeam(bbar, RF[i], RF[(i + 1) % 8], .06)
apoly(bgl, [RF[0], RF[1], RF[2], RF[7]][::-1]); apoly(bgl, [RF[2], RF[3], RF[4], RF[5], RF[6], RF[7]][::-1])
obj('nose_skin', bo, 'hull_side'); obj('canopy_glass', bgl, 'glass'); obj('canopy_bars', bbar, 'canopy_bar', smooth=True)
bm = B()
for t in (.25, .5, .75): abeam(bm, RA[4].lerp(RF[4], t) + Vector((0, 0, .075)), RA[5].lerp(RF[5], t) + Vector((0, 0, .075)), .02)
obj('nose_brow_seams', bm, 'hull_core')
bm = B()                                                           # 2 white streak reflections on the glass (thin emissive slivers just outside it)
for (i, t0, t1) in ((2, .25, .55), (6, .45, .8)):
    p0 = RA[i].lerp(RF[i], t0); p1 = RA[(i + 1) % 8].lerp(RF[(i + 1) % 8], t1); n = Vector((0, 1 if i == 2 else -1, 0)) * .03
    abeam(bm, p0 + n, p1 + n, .012)
obj('canopy_streaks', bm, mat('glass_streak', col='#ffffff', es=1.2, alpha=.5))
# nose details outside: small dark block with 2 short cylinders under the canopy (+Y side), antenna mast + pale disc on the brow
box('nose_block', (.7, .35, .4), (24.0, 2.02, -1.55), 'engine', bev=.03)
for dx in (-.15, .15): cyl('nose_block_cyl_%d' % (dx > 0), .09, .25, (24.0 + dx, 2.25, -1.55), 'black', rot=(90, 0, 0))
# ================================================================== B. AFT: collar, truss, tanks, fans, arrays, engine, flame
bm = B(); alathe(bm, [(2.25, 0), (2.25, -.3), (2.1, -1.0), (1.6, -1.7), (.85, -2.1), (.6, -2.2)], 11, MF((0, 0, 0), (0, 1, 0), (0, 0, 1), (1, 0, 0)), jit=.07)
obj('gold_collar', bm, 'gold')
cyl('antenna_mast', .04, 2.4, (-1.0, 0, 2.6), 'truss'); bm = B(); alathe(bm, [(.03, 0), (.45, .12), (.5, .16)], 16, MT((-1.0, 0, 3.8), (0, -30, 0))); obj('antenna_dish', bm, 'truss', smooth=True)
TX0, TX1, TS = -2.2, -11.5, .7
bm = B(); cs = [(TS, TS), (-TS, TS), (-TS, -TS), (TS, -TS)]
for y, z in cs: abeam(bm, (TX0, y, z), (TX1, y, z), .07, 6)
n = 8
for k in range(n + 1):
    x = TX0 + (TX1 - TX0) * k / n
    for a in range(4): abeam(bm, (x, *cs[a]), (x, *cs[(a + 1) % 4]), .045)
    if k < n:
        x2 = TX0 + (TX1 - TX0) * (k + 1) / n
        for a in range(4): abeam(bm, (x, *cs[a]), (x2, *cs[(a + 1) % 4]), .035)
obj('truss', bm, 'truss', smooth=True)
for tx in (-4.6, -8.8):
    bm = B(); alathe(bm, [(.0, -1.4), (.35, -1.35), (.55, -1.1), (.58, 0), (.55, 1.1), (.35, 1.35), (.0, 1.4)], 12, MF((0, 0, 0), (0, 1, 0), (0, 0, 1), (1, 0, 0)), caps=False, jit=.06)
    obj('gold_tank_%d' % (tx < -6), bm, 'gold', (tx, 0, 0))
for s in (1, -1):                                                  # round solar fans on booms (movers: they can turn about the boom)
    nm = 'solar_fan_' + ('p' if s > 0 else 'n'); cy = s * 9.4
    cyl('solar_boom_' + ('p' if s > 0 else 'n'), .06, 6.0, (-1.4, s * 4.4, 0), 'truss', rot=(90, 0, 0))
    bf, bsp = B(), B(); R = 2.7; nseg = 12
    for k in range(nseg):
        a0, a1 = k * 2 * math.pi / nseg, (k + 1) * 2 * math.pi / nseg; vs = [(0, 0, 0)] + [(R * math.cos(a0 + (a1 - a0) * q / 4), R * math.sin(a0 + (a1 - a0) * q / 4), 0) for q in range(5)]
        apoly(bf, vs, .03); abeam(bsp, (0, 0, .03), (R * math.cos(a0), R * math.sin(a0), .03), .03)
        for rr in (1.0, 1.8): abeam(bsp, (rr * math.cos(a0), rr * math.sin(a0), .035), (rr * math.cos(a1), rr * math.sin(a1), .035), .008)
    for k in range(48): a = k * 2 * math.pi / 48; abeam(bsp, (R * math.cos(a), R * math.sin(a), .02), (R * math.cos(a + math.pi / 24), R * math.sin(a + math.pi / 24), .02), .04)
    acyl(bsp, .3, .2, MT((0, 0, .05)))
    obj(nm, bf, 'solar_fan', (-1.4, cy, 0), (0, 0, 0), mover={'axis': 'boom_y'}); obj(nm + '_spokes', bsp, 'solar_spoke', (-1.4, cy, 0), mover={'follows': nm})
for s in (1, -1):                                                  # rectangular arrays with the V notch at the outer edge, fine vertical lines
    bp, bl_ = B(), B(); x0, x1, y0, y1 = -9.9, -3.7, s * 1.0, s * 4.9; yn = y1 - s * .9
    apoly(bp, [(x0, y0, 0), (x1, y0, 0), (x1, y1, 0), ((x0 + x1) / 2, yn, 0), (x0, y1, 0)], .05)
    for k in range(1, 40):
        x = x0 + (x1 - x0) * k / 40; ye = y1 - s * .9 * (1 - abs(x - (x0 + x1) / 2) / ((x1 - x0) / 2))
        abeam(bl_, (x, y0 + s * .08, .055), (x, ye - s * .08, .055), .007)
    for a, b in (((x0, y0), (x1, y0)), ((x1, y0), (x1, y1)), ((x1, y1), ((x0 + x1) / 2, yn)), (((x0 + x1) / 2, yn), (x0, y1)), ((x0, y1), (x0, y0))): abeam(bl_, (*a, .03), (*b, .03), .04)
    obj('solar_array_' + ('p' if s > 0 else 'n'), bp, 'solar_rect'); obj('solar_array_lines_' + ('p' if s > 0 else 'n'), bl_, 'solar_line')
M_ENG = MF((0, 0, 0), (0, 1, 0), (0, 0, 1), (-1, 0, 0))
bm = B(); alathe(bm, [(1.55, 0), (1.65, .2), (1.65, 3.7), (1.5, 3.9)], 8, M_ENG); obj('engine_drum', bm, 'engine', (TX1, 0, 0))
bm = B()
for z0 in (.8, 2.7): alathe(bm, [(1.7, z0), (1.72, z0 + .35)], 8, M_ENG, jit=.05)
obj('engine_bands', bm, 'gold', (TX1, 0, 0))
NZX = TX1 - 3.9; bm = B(); alathe(bm, [(.7, 0), (.75, .4), (1.05, 1.2), (1.45, 1.9), (1.4, 1.9), (1.0, 1.2), (.65, .4)], 24, M_ENG, caps=False); obj('engine_bell', bm, 'engine', (NZX, 0, 0), smooth=True)
bm = B(); alathe(bm, [(.0, .5), (1.0, 1.2), (1.38, 1.85)], 24, M_ENG, caps=False); obj('nozzle_glow', bm, 'nozzle_glow', (NZX, 0, 0), smooth=True, mover={'state': 'preglow 0-1'})
FLX = NZX - 1.9; ANCH['flame_origin'] = [FLX, 0, 0]; ANCH['nozzle'] = [NZX, 0, 0]
for nm, prof, mn in (('flame_core', [(1.0, 0), (1.25, 2), (1.1, 10), (.6, 19), (.05, 24)], ('flame_core', PRM['flame']['core'], 14., None)),
                     ('flame_mid', [(1.3, 0), (2.1, 3), (2.1, 13), (1.4, 24), (.1, 31)], ('flame_mid', PRM['flame']['mid'], 2.5, .35)),
                     ('flame_outer', [(1.5, 0), (3.0, 4), (3.1, 16), (2.2, 28), (.2, 37)], ('flame_outer', PRM['flame']['outer'], 1.6, .2)),
                     ('flame_halo', [(1.7, -.3), (4.4, 5), (4.6, 18), (3.3, 32), (.3, 43)], ('flame_halo', PRM['flame']['halo'], 1.4, .12)),
                     ('flame_glow', [(2.0, -.6), (5.8, 6), (6.2, 20), (4.6, 36), (.4, 48)], ('flame_glow', '#6d51b8', 1.0, .06))):
    bm = B(); alathe(bm, prof, 28, M_ENG); obj(nm, bm, mat(mn[0], col='#000000', emit=mn[1], es=mn[2], alpha=mn[3], rough=1.), (FLX, 0, 0), smooth=True, mover={'state': 'flame 0-1 scales x (length) and y,z (width)'})
# ================================================================== GLITTER (movers: trail from the tail, puff at the collar, cloud around the cockpit)
def sparkle(bm, p, s, big=False):
    if not big:
        tips = [Vector(p) + Vector(d) * s for d in ((1, 0, 0), (-1, 0, 0), (0, 1, 0), (0, -1, 0), (0, 0, 1), (0, 0, -1))]
        vs = [bm.verts.new(t) for t in tips]
        for a in (0, 1):
            for b in (2, 3):
                for c in (4, 5): bm.faces.new((vs[a], vs[b], vs[c]))
        return
    T = [Vector(d) for d in ((1, 0, 0), (-1, 0, 0), (0, 1, 0), (0, -1, 0), (0, 0, 1), (0, 0, -1))]; vt = [bm.verts.new(Vector(p) + t * s * 2.6) for t in T]
    for sx in (1, -1):
        for sy in (1, -1):
            for sz in (1, -1):
                vi = bm.verts.new(Vector(p) + Vector((sx, sy, sz)) * s * .3); a, b, c = vt[0 if sx > 0 else 1], vt[2 if sy > 0 else 3], vt[4 if sz > 0 else 5]
                bm.faces.new((a, vi, b)); bm.faces.new((b, vi, c)); bm.faces.new((c, vi, a))
def cloud(name, n, sampler, s0, s1, loc, seed, parent_ship=True, c=None):
    r = random.Random(seed); bm = B()
    for k in range(n): sparkle(bm, sampler(r), r.uniform(s0, s1) * (2.2 if r.random() < .1 else 1), big=r.random() < .1)
    return obj(name, bm, 'glitter', loc, c=c, mover={'state': 'glitter 0-1'})
def trail(r, k, L=46.):
    t = (k + r.random()) / 4; w = .6 + t * 13; return (-t * L, r.gauss(0, w * .5), r.gauss(0, w * .5) + t * 4)
for k in range(4):
    cloud('glitter_trail_%d' % k, 110, lambda r, k=k: trail(r, k), .1, .22, (FLX - 2, 0, 0), 20 + k)
cloud('glitter_collar', 160, lambda r: (r.gauss(0, 1.2), r.gauss(0, 1.8), r.gauss(0, 1.5) + 2.5), .04, .09, (-1.5, 0, 0), 31)
for k in range(3):                                                 # around the canopy for shot 7 (on in 3 steps: 'glitter_ck')
    cloud('glitter_cockpit_%d' % k, 420, lambda r: (r.uniform(-3, 9), r.uniform(-7, 7), r.uniform(-4, 6)), .008, .02, (XN, 0, 0), 40 + k)
# ================================================================== F. COCKPIT INTERIOR (inside the nose, real geometry)
def inner_y(x, z):
    t = (x - XB) / (XN - XB); hw = HW * (1 - t) + HW * FS * t; return hw if z < .93 else hw - (z - .93)
FLZ = -1.25; bm = B(); apoly(bm, [(XB + .05, -HW + .1, FLZ), (XB + .05, HW - .1, FLZ), (XN - .5, inner_y(XN - .5, -1) - .05, FLZ + .3 * (1 - FS)), (XN - .5, -inner_y(XN - .5, -1) + .05, FLZ + .3 * (1 - FS))], .05)
obj('ck_floor', bm, 'ck_floor')
bm = B(); apoly(bm, [(XB + .05, -.9, HW - .1), (XB + .05, .9, HW - .1), (XN - .1, .9 * FS, HW * FS + FZ - .1), (XN - .1, -.9 * FS, HW * FS + FZ - .1)], .04); obj('ck_roof_liner', bm, 'ck_roof')
bm = B(); apoly(bm, [(XB + .03, y * .985, z * .985) for y, z in PROF][::-1], .05); obj('ck_back_wall', bm, 'ck_wall')
bm = B(); z = FLZ + .25
while z < HW - .25:
    hw = inner_y(XB, z) - .2
    for s in (1, -1): abeam(bm, (XB + .12, 0, z), (XB + .12, s * hw, z - .35), .07, 4)
    z += .26
obj('ck_slats', bm, 'ck_slat')
for k, y in enumerate((-1.05, 1.05)):                              # 2 pairs of black rods with an orange glowing tube + round tip
    for dy in (-.07, .07):
        cyl('lamp_rod_%d_%d' % (k, dy > 0), .025, 1.15, (22.9, y + dy, HW - .1 - .58), 'lamp_rod', seg=8)
    cyl('lamp_tube_%d' % k, .07, .42, (22.9, y, HW - 1.45), 'lamp_tube', seg=12)
    bm = B(); bmesh.ops.create_uvsphere(bm, u_segments=12, v_segments=8, radius=.09); obj('lamp_tip_%d' % k, bm, 'lamp_tip', (22.9, y, HW - 1.72), smooth=True)
ANCH['lamps'] = [[22.9, -1.05, HW - 1.6], [22.9, 1.05, HW - 1.6]]
bm = B(); abeam(bm, (22.9, -1.05, HW - 1.75), (22.9, -1.05, HW - 2.3), .005); obj('toy_string', bm, 'lamp_rod')
bm = B(); bmesh.ops.create_uvsphere(bm, u_segments=10, v_segments=6, radius=.07, matrix=Matrix.Translation((0, 0, .06))); abox(bm, .1, .07, .12, MT((0, 0, -.06)), bev=.02)
obj('hanging_toy', bm, 'toy_white', (22.9, -1.05, HW - 2.4), mover={'swing': 'about the string top'})
for k, s in enumerate((-1, 1)):                                     # pilot seats near the front, facing +X
    x, y = 24.75, s * .78
    box('seat_pan_%d' % k, (.75, .78, .16), (x, y, FLZ + .62), 'seat', bev=.04); box('seat_back_%d' % k, (.2, .78, 1.45), (x - .42, y, FLZ + 1.35), 'seat', bev=.06, rot=(0, -8, 0))
    box('seat_base_%d' % k, (.3, .3, .55), (x, y, FLZ + .28), 'ck_floor', bev=.02)
    bm = B()
    for dy in (-.18, .18): abox(bm, .03, .09, 1.2, MT((x - .3, y + dy, FLZ + 1.37), (0, -8, 0)), bev=.005)
    abox(bm, .02, .09, .5, MT((x + .02, y - .12, FLZ + .71), (35, 0, 0)), bev=0); abox(bm, .02, .09, .5, MT((x + .02, y + .12, FLZ + .71), (-35, 0, 0)), bev=0)
    obj('seat_stripes_%d' % k, bm, 'seat_stripe')
box('centre_console', (.6, .4, .75), (24.95, 0, FLZ + .38), 'console', bev=.03)
bm = B()
for k in range(5): abox(bm, .05, .05, .03, MT((25.25, -.12 + k * .06, FLZ + .76)), bev=0)
obj('centre_console_lights', bm, 'lt_red'); cyl('centre_lever', .02, .35, (25.0, .1, FLZ + .9), 'lamp_rod', seg=8); cyl('centre_lever_cap', .05, .07, (25.0, .1, FLZ + 1.08), 'lever_cap', seg=10)
bm = B(); alathe(bm, [(.55, 0), (.55, 1.6), (.45, 1.85), (.2, 1.97), (0, 2.0)], 20, Matrix.Scale(1, 4) @ Matrix.Diagonal((.32, 1, 1, 1)))
obj('nav_chair', bm, 'nav_chair', (22.45, 0, FLZ), smooth=True)
pic('nav_chair_emblem', .55, .55, MF((22.45 + .19, 0, FLZ + 1.45), (0, 1, 0), (0, 0, 1), (1, 0, 0)), 'emblem.png', es=1.5)
for s in (1, -1):                                                  # side console on the -Y wall (the +Y wall has the radio station)
    if s > 0: continue
    box('side_console_n', (1.8, .5, 1.1), (22.9, s * 1.85, FLZ + .55), 'console', bev=.03)
    bm = {c: B() for c in ('lt_cyan', 'lt_amber', 'lt_white', 'lt_pink')}; cl = list(bm)
    for row in range(3):
        for k in range(9): abox(bm[cl[(row * 9 + k * 7) % 4]], .1, .02, .07, MT((22.15 + k * .17, s * 1.59, FLZ + .7 + row * .13)), bev=0)
    for c in cl: obj('side_console_n_' + c, bm[c], c)
bm = B(); alathe(bm, [(.0, 0), (.6, 0), (.6, .05), (.55, .25), (.4, .45), (.0, .55)], 16, Matrix.Diagonal((1, .55, 1, 1))); obj('red_half_round', bm, 'red_half', (22.4, -1.2, FLZ), smooth=True)
box('red_half_block', (.3, .25, .2), (22.4, -1.2, FLZ + .6), 'black', bev=.02)
box('blue_box_table', (.6, .6, .7), (22.0, 1.5, FLZ + .35), 'console', bev=.02); box('blue_box', (.42, .42, .42), (22.0, 1.5, FLZ + .91), 'blue_box', bev=.03)
pic('wall_badge', .36, .36, MF((22.2, inner_y(22.2, .5) - .12, .5), (1, 0, 0), (0, 0, 1), (0, -1, 0)), 'badge.png', es=1.2)
# floating things (movers): the navigator's brown cup, a book, a pencil, a juice box
for nm, size, loc, rot, mc in (('float_cup', (.12, .12, .16), (23.55, .35, .1), (10, 20, 0), mat('cup_brown', col='#7a4a2a', rough=.7)),
                               ('float_book', (.3, .22, .05), (23.8, -1.1, .9), (30, 15, 40), mat('book_blue', col='#2a4fb0', rough=.8)),
                               ('float_pencil', (.24, .02, .02), (24.1, 1.0, 1.2), (0, 30, 60), mat('pencil_yellow', col='#f1c81e', rough=.6)),
                               ('float_juice', (.1, .07, .16), (23.3, -.7, 1.5), (20, -15, 10), 'juice')):
    box(nm, size, loc, mc, bev=.012, rot=rot, mover={'drift': 'kit floats it'})
# star map sheet taped on the inside of the front glass (shot 8): picture + 2 tape strips
sx = XN - .1; scz = (FRONT[2][1] + FRONT[3][1]) / 2 + .15; ANCH['star_map'] = [sx, 0, scz]
pic('star_map_sheet', .93, 1.16, MF((sx, 0, scz), (0, -1, 0), (0, 0, 1), (-1, 0, 0)), 'starmap.png', es=2.5, mover={'state': 'starmap 0-1'})
bm = B()
for s in (1, -1): abox(bm, .01, .22, .07, MT((sx - .005, s * .44, scz + .56), (s * 40, 0, 0)), bev=0)
obj('star_map_tape', bm, 'tape', mover={'follows': 'star_map_sheet'})
# ================================================================== G. RADIO STATION on the +Y wall (desk, lower panel, sloped upper panel, radio)
# radio frame, local: a along +X, b toward the wall (+Y), z up, origin at the desk top front centre
RX, RY = 23.4, .8; RM = MF((RX, RY, -.3), (1, 0, 0), (0, 1, 0), (0, 0, 1))
def R(a, b, z): return RM @ Vector((a, b, z))
box('radio_desk', (1.7, .62, .08), tuple(R(0, .31, -.04)), 'desk', bev=.015); box('radio_desk_front', (1.7, .06, .9), tuple(R(0, .0, -.5)), 'panel_low', bev=.015)
box('radio_lower_panel', (1.7, .06, .5), tuple(R(0, .6, .25)), 'panel_low', bev=.01)
bm = B()
for a in (-.7, -.35, 0, .35, .7):
    for z in (.08, .42): acyl(bm, .014, .02, MT(tuple(R(a, .565, z)), (90, 0, 0)), seg=8)
obj('radio_lower_rivets', bm, 'rivet_pale', smooth=True)
UPM = MF(R(0, .873, .826), (1, 0, 0), (0, .6428, .766), (0, -.766, .6428))   # sloped upper panel, 50 deg back: local X along, Y up the slope, Z out
def U(a, v, n=0.): return UPM @ Vector((a, v, n))
bm = B(); abox(bm, 1.75, .85, .06, UPM, bev=.015); obj('radio_upper_panel', bm, 'panel_up')
def upic(name, w, h, a, v, png, es=1.):
    return pic(name, w, h, UPM @ Matrix.Translation((a, v, .045)), png, es=es, alpha=False)
mfo = upic('mfd_on', .46, .34, -.02, .1, 'mfd_on.png', 1.4); mff = upic('mfd_off', .46, .34, -.02, .1, 'mfd_off.png', 1.4)
MOVERS['mfd_on'] = {'state': 'comm on'}; MOVERS['mfd_off'] = {'state': 'comm off'}
bm = B(); arring(bm, .46, .34, .02, .05, .04, UPM @ Matrix.Translation((-.02, .1, .03)), lip=.01); obj('mfd_bezel', bm, 'bezel')
bm = B()
for s in (1, -1):
    for k in range(5): abox(bm, .045, .045, .03, UPM @ Matrix.Translation((-.02 + s * .29, .1 - .14 + k * .07, .04)), bev=.005)
obj('mfd_keys', bm, 'bezel'); upic('sband_display', .3, .25, .58, .12, 'sband.png', 1.3)
bd, bm_ = B(), B()
for a in (-.72, -.45, .38, .82):
    alathe(bd, [(.11, 0), (.11, .03), (.09, .05), (0, .05)], 20, UPM @ Matrix.Translation((a, .2 if abs(a) > .6 else .05, .03)))
    abox(bm_, .012, .085, .01, UPM @ Matrix.Translation((a, (.2 if abs(a) > .6 else .05) + .04, .085)) @ Matrix.Rotation(rnd.uniform(-.8, .8), 4, 'Z'), bev=0)
obj('radio_dials', bd, 'knob', smooth=True); obj('radio_dial_marks', bm_, 'dial_mark')
bt, bgd, bl_ = B(), B(), B()
for k in range(9):
    a = -.68 + k * .17; abox(bt, .07, .07, .03, UPM @ Matrix.Translation((a, -.26, .04)), bev=.005); acyl(bt, .008, .07, UPM @ Matrix.Translation((a, -.26, .08)), seg=6)
    if k in (5, 7): abox(bgd, .08, .09, .06, UPM @ Matrix.Translation((a, -.25, .08)) @ Matrix.Rotation(.5, 4, 'X'), bev=.008)
    abox(bl_, .08, .012, .004, UPM @ Matrix.Translation((a, -.35, .032)), bev=0)
for a in (-.72, -.45, .38, .82): abox(bl_, .1, .012, .004, UPM @ Matrix.Translation((a, -.06 if abs(a) > .6 else -.1, .032)), bev=0)
obj('radio_toggles', bt, 'black'); obj('radio_toggle_guards', bgd, 'toggle_guard'); obj('radio_dash_labels', bl_, 'dash_label')
bm = B(); abox(bm, .3, .06, .06, UPM @ Matrix.Translation((.84, .43, .03)), bev=.01); obj('juice_box_brow_base', bm, 'panel_up')
bm = B(); abox(bm, .1, .07, .16, Matrix.Translation(U(.84, .43, .12)), bev=.008); obj('juice_box', bm, 'juice'); bm = B(); abeam(bm, U(.86, .43, .2), U(.88, .43, .3), .006); obj('juice_straw', bm, 'juice_red')
bm = B(); abeam(bm, R(.82, .1, .02), R(.86, .5, .35), .02, 8); obj('glow_rod', bm, 'glow_rod')
# the radio set: wedge box, sloped face toward the cockpit (-Y) and up; face picture, display digits (one plane per state), lamp, grille, 2 knobs
RD = R(-.25, .3, 0); RSM = Matrix.Translation(RD)
bm = B(); vs = [(-.24, -.2, 0), (.24, -.2, 0), (.24, .2, 0), (-.24, .2, 0), (-.24, -.12, .2), (.24, -.12, .2), (.24, .2, .3), (-.24, .2, .3)]
V_ = [bm.verts.new(RSM @ Vector(v)) for v in vs]
for f in ((0, 1, 2, 3), (4, 7, 6, 5), (0, 4, 5, 1), (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)): bm.faces.new([V_[i] for i in f])
bmesh.ops.bevel(bm, geom=bm.edges[:], offset=.01, segments=2, affect='EDGES'); obj('radio_body', bm, 'radio_body')
FA = Vector((0, -.12 - (-.2), .2)).normalized()                     # slope direction (up the face)
FN = Vector((1, 0, 0)).cross(FA)
FC = RD + Vector((0, -.16, .1))
FM_ = MF(FC + FN * .012, (1, 0, 0), FA, FN)
bm = B(); arring(bm, .44, .2, .01, .012, .01, FM_, lip=.003); obj('radio_face_edge', bm, 'radio_edge')
pic('radio_face', .46, .2, FM_ @ Matrix.Translation((0, .01, .003)), 'radio_face.png', es=1.0)
for k in range(4):
    pic('radio_digits_%d' % k, .2, .077, FM_ @ Matrix.Translation((-.03, .028, .006 + .0005 * k)), 'radio_digits_%d.png' % k, es=2.2, alpha=False, mover={'state': 'digits %d' % k})
bm = B()
for k in range(7): abox(bm, .11, .006, .004, FM_ @ Matrix.Translation((0, -.02 - k * .011, .004)), bev=0)
obj('radio_grille', bm, 'black')
for nm, a, v in (('radio_knob_vol', -.15, -.05), ('radio_knob_freq', .15, -.05)):
    bm = B(); alathe(bm, [(.045, 0), (.045, .03), (.035, .045), (0, .045)], 18, FM_ @ Matrix.Translation((a, v, 0))); obj(nm, bm, 'knob', smooth=True)
for nm, mn in (('comm_lamp_on', 'comm_lamp_on'), ('comm_lamp_off', 'comm_lamp_off')):
    bm = B(); bmesh.ops.create_uvsphere(bm, u_segments=12, v_segments=8, radius=.024, matrix=FM_ @ Matrix.Translation((.18, .065, .008))); obj(nm, bm, mn, smooth=True, mover={'state': 'comm'})
ANCH['comm_lamp'] = list(FM_ @ Vector((.18, .065, .05))); ANCH['radio'] = list(RD)
for k, a in enumerate((-.08, .06)):                                 # twin T levers on a grey block behind the radio
    box('lever_block_%d' % k, (.12, .1, .08), tuple(R(-.25 + a, .52, .04)), 'lever_block', bev=.01)
    cyl('lever_stem_%d' % k, .012, .2, tuple(R(-.25 + a, .52, .18)), 'lever_stem', seg=8)
    cyl('lever_grip_%d' % k, .025, .12, tuple(R(-.25 + a, .52, .29)), 'black', rot=(90, 0, 0), seg=10)
    for s in (1, -1): cyl('lever_cap_%d_%d' % (k, s > 0), .028, .02, tuple(R(-.25 + a, .52 + s * .07, .29)), 'lever_cap', rot=(90, 0, 0), seg=10)
cyl('mic_stand', .04, .08, tuple(R(.2, .25, .04)), 'mic'); box('mic', (.07, .05, .14), tuple(R(.2, .25, .15)), 'mic', bev=.02)
# ================================================================== WORLD: Earth (painted map + bright rim), sky dome (stars), all world objects
def earth_mats():
    m = bpy.data.materials.new('earth'); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']
    t = nt.nodes.new('ShaderNodeTexImage'); t.image = bpy.data.images.load(os.path.join(TEX, 'earth.png'))
    hs = nt.nodes.new('ShaderNodeHueSaturation'); hs.inputs['Saturation'].default_value = 1.25; hs.inputs['Value'].default_value = .62   # tames the clouds under the hard sun
    nt.links.new(t.outputs[0], hs.inputs['Color']); nt.links.new(hs.outputs[0], b.inputs['Base Color']); nt.links.new(t.outputs[0], b.inputs['Emission Color']); b.inputs['Emission Strength'].default_value = .12
    b.inputs['Roughness'].default_value = .3; b.inputs['Specular IOR Level'].default_value = .9; MATS['earth'] = m
    r = bpy.data.materials.new('earth_rim'); r.use_nodes = True; nt = r.node_tree; nt.nodes.clear(); o = nt.nodes.new('ShaderNodeOutputMaterial')
    lw = nt.nodes.new('ShaderNodeLayerWeight'); lw.inputs[0].default_value = .5; pw = nt.nodes.new('ShaderNodeMath'); pw.operation = 'POWER'; pw.inputs[1].default_value = 6.
    em = nt.nodes.new('ShaderNodeEmission'); em.inputs[0].default_value = lin('#bfeaff'); em.inputs[1].default_value = 4.
    tr = nt.nodes.new('ShaderNodeBsdfTransparent'); mx = nt.nodes.new('ShaderNodeMixShader')
    nt.links.new(lw.outputs['Facing'], pw.inputs[0]); nt.links.new(pw.outputs[0], mx.inputs[0]); nt.links.new(tr.outputs[0], mx.inputs[1]); nt.links.new(em.outputs[0], mx.inputs[2]); nt.links.new(mx.outputs[0], o.inputs[0])
    MATS['earth_rim'] = r
earth_mats()
bm = B(); bm.loops.layers.uv.verify(); bmesh.ops.create_uvsphere(bm, u_segments=96, v_segments=48, radius=1., calc_uvs=True); eo = obj('earth', bm, 'earth', (0, -3000, -2600), (0, 0, 0), c=WORLD, smooth=True, mover={'state': 'earth [x,y,z,R] per shot'})
eo.scale = (1500,) * 3; MOVERS['earth']['scale'] = 1500
bm = B(); bmesh.ops.create_uvsphere(bm, u_segments=96, v_segments=48, radius=1.035); ro = obj('earth_rim', bm, 'earth_rim', c=WORLD, smooth=True); ro.parent = eo
bm = B(); bm.loops.layers.uv.verify(); bmesh.ops.create_uvsphere(bm, u_segments=96, v_segments=48, radius=20000., calc_uvs=True); bmesh.ops.reverse_faces(bm, faces=bm.faces[:])
sky = bpy.data.objects.new('sky_dome', bpy.data.meshes.new('sky_dome')); bm.to_mesh(sky.data); bm.free(); WORLD.objects.link(sky)
sm = mat('sky_stars', png='stars.png', emit_png=True, es=1., rough=1.); sm.node_tree.nodes['Image Texture'].extension = 'REPEAT'; sky.data.materials.append(sm)
sky.visible_diffuse = sky.visible_glossy = sky.visible_shadow = False
for p in sky.data.polygons: p.use_smooth = True
# ================================================================== STAND-IN CARDS (excluded from the GLB), LIGHTS, ship_root
def standin(name, col, h, loc, rz, hm='sd_head'):
    bm = B(); abox(bm, .5, .012, .74, MT((0, 0, h - .62 - .30)), bev=0); acyl(bm, .31, .012, MT((0, -.01, h - .31), (90, 0, 0)), 24)
    for s in (1, -1): abox(bm, .03, .012, h - 1.25, MT((s * .1, 0, (h - 1.25) / 2)), bev=0)
    o = obj(name, bm, mat(name, col=col, rough=1., es=.35, emit=col), loc, (0, 0, rz), c=STAND); o.data.materials.append(mat(hm))
    for f in o.data.polygons:
        if f.center.z > h - .63: f.material_index = 1
    return o
NG = PAL['sd_newguy']['hex']; NV = PAL['sd_navigator']['hex']
STANDINS = {'standin_newguy_s2': [2], 'standin_newguy_s11': [11], 'standin_navigator_s7': [7]}
pa, pb = ANCH['porthole_a_card'], ANCH['porthole_b_card']
standin('standin_newguy_s2', NG, 1.70, (pa[0] + .05, pa[1] + .2, -1.2), 0); standin('standin_newguy_s11', NG, 1.70, (pb[0] - .25, pb[1] + .2, -1.2), 0)
standin('standin_navigator_s7', NV, 1.66, (23.25, 0, FLZ + .35), 90)
ANCH['navigator_s7'] = [23.25, 0, FLZ + .35]; ANCH['newguy_s2'] = [pa[0] + .05, pa[1] + .2, -1.2]; ANCH['newguy_s11'] = [pb[0] - .25, pb[1] + .2, -1.2]
def light(name, loc, col, watts, radius=.1, kind='POINT', rot=None):
    d = bpy.data.lights.new(name, kind); d.color = col
    if kind == 'SUN': d.energy = watts; d.angle = math.radians(radius)
    else: d.energy = watts; d.shadow_soft_size = radius
    o = bpy.data.objects.new(name, d); o.location = loc; LIGHTS.objects.link(o)
    if rot: o.rotation_euler = [math.radians(a) for a in rot]
    return o
light('sun_key', (0, 0, 50), (1, 1, 1), 4.5, 1.0, 'SUN'); light('sun_fill', (0, 0, 40), (.35, .45, 1.), .25, 10., 'SUN')
for k, p in enumerate(ANCH['lamps']): light('lamp_light_%d' % k, (p[0], p[1], .45), (1., .72, .4), 60, .08)
light('ck_fill', (23.6, 0, .6), (.5, .55, 1.), 25, .6); light('comm_light', tuple(Vector(ANCH['comm_lamp']) + Vector((0, -.1, .08))), (1., .12, .08), 0, .05)
light('mfd_light', tuple(U(-.02, .1, .35)), (1., .2, .2), 0, .1); light('room_light_a', (WIN_X[0], .3, 1.4), (1., .95, .88), 120, .4); light('room_light_b', (WIN_X[4], .3, 1.4), (1., .95, .88), 120, .4)
light('flame_light', (FLX - 3, 0, 0), (.7, .55, 1.), 0, 2.)
ww = light('wall_wash', (XB + 1.3, 0, HW - .35), (1., .74, .45), 0, .15, 'SPOT', rot=(0, -62, 0)); ww.data.spot_size = math.radians(95); ww.data.spot_blend = .6
root = bpy.data.objects.new('ship_root', None); SET.objects.link(root); MOVERS['ship_root'] = {'loc': [0, 0, 0], 'rot': [0, 0, 0], 'state': 'ship [x,y,z,rx,ry,rz]'}
for o in list(SET.objects) + list(STAND.objects) + list(LIGHTS.objects):
    if o is not root and o.parent is None and not o.name.startswith('sun_'): o.parent = root
w = bpy.data.worlds.new('ship_world'); w.use_nodes = True; SC.world = w; w.node_tree.nodes['Background'].inputs[0].default_value = (0, 0, .004, 1)
# ================================================================== META, RENDER SETTINGS, SAVE, GLB
ANCH.update({'cockpit_centre': [23.6, 0, 0], 'collar': [-1.2, 0, 0], 'lodestar': [11., 1.63, 1.63], 'bow_tip': [XN, 0, FZ], 'tail_end': [NZX, 0, 0],
             'porthole_a': [WIN_X[0], HW + .15, WIN_Z], 'porthole_b': [WIN_X[4], HW + .15, WIN_Z]})
ANCH = {k: [round(float(c), 4) for c in v] if not isinstance(v[0], list) else [[round(c, 4) for c in p] for p in v] for k, v in ANCH.items()}
import ship_api as api
META = {'place': 'ship', 'units': 'Blender metres, Z up; ship axis X, nose +X, porthole side +Y; everything ship = child of ship_root',
        'hull': {'body_x': [0, XB], 'nose_x': [XB, XN], 'half_width': HW, 'windows_x': WIN_X, 'window_z': WIN_Z, 'portholes': {k: WIN_X[v] for k, v in PORTS.items()}},
        'anchors': ANCH, 'cams': PRM.get('cams', {}), 'ship_poses': PRM.get('ship_poses', {}), 'kit_pictures': {'earth': 'earth_kit.jpg', 'sky_dome': 'stars_kit.jpg'}, 'proofs': PRM.get('proofs', {}), 'movers': MOVERS, 'standins': STANDINS,
        'state_default': api.DEFAULT, 'light_kinds': api.LIGHTS,
        'frames': {'shot2': [36, 119], 'ship_turns': 75, 'preglow': [84, 94], 'flame_on': [96, 100], 'flame_full': [100, 118], 'shot7': [538, 705],
                   'glitter_ck_on': [585, 660], 'lens_star': [690, 704], 'shot8': [713, 762], 'starmap_in': 709, 'shot9': [771, 802], 'comm_incoming': 772,
                   'digits_scramble': [769, 800], 'shot11': [867, 997], 'newguy_leaves_porthole': [876, 884], 'glitter_trail': [950, 998]}, 'palette': PAL}
json.dump(META, open(os.path.join(OUT, 'ship_meta.json'), 'w'), indent=1)
SC.render.engine = 'CYCLES'; SC.cycles.samples = 16; SC.cycles.use_denoising = True; SC.view_settings.view_transform = 'Standard'; SC.view_settings.look = 'None'
SC.render.resolution_x, SC.render.resolution_y = 540, 960; SC.cycles.max_bounces = 6; SC.cycles.transparent_max_bounces = 24
tris = sum(len(o.data.polygons) for o in list(SET.objects) + list(WORLD.objects) if o.type == 'MESH')
for o in bpy.data.objects: o.select_set(False)
for o in list(SET.objects) + list(WORLD.objects): o.select_set(True)
# the kit loads earth_kit.jpg / stars_kit.jpg (written by make_tex.py) beside the GLB: the GLB carries tiny stand-in pictures only
BIG = {n: MATS[n].node_tree.nodes['Image Texture'].image for n in ('earth', 'sky_stars')}; tiny = bpy.data.images.new('kit_stub', 8, 4)
for n in BIG: MATS[n].node_tree.nodes['Image Texture'].image = tiny
bpy.ops.export_scene.gltf(filepath=os.path.join(OUT, 'ship_lite.glb'), use_selection=True, export_apply=True, export_yup=True, export_lights=False, export_cameras=False)
for n, im in BIG.items(): MATS[n].node_tree.nodes['Image Texture'].image = im
api._M.clear(); api.set_state(SC)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, 'ship.blend'))
print('BUILT ship: %d set objects, %d world, %d faces, %d movers' % (len(SET.objects), len(WORLD.objects), tris, len(MOVERS)))
