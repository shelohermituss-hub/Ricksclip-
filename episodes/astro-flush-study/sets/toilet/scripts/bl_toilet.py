"""bl_toilet.py: builds the WHOLE toilet place of astro-flush-study (LOOK_INVENTORY sections A + H). blender -b -P bl_toilet.py
-> ../out/toilet.blend, toilet_lite.glb, toilet_meta.json. Blender metres, Z up. Room x -2..2, y -1.7..3.9 (back wall with the door at y 3.9,
right wall x 2 = big window + shelf + toilet, left wall x -2 = porthole + hose port + hatch), floor z 0, under-floor bay z -1.7..-0.12,
nozzle outside the right hull at (2.25, 1.5, -0.9), inside of the tube = its own piece at (0, -34.5..-26.5, 0) (the camera cuts in at the nozzle).
Every material is one flat colour from params_toilet.json; detail is geometry. Movers have their origin at their pivot (meta "movers").
Helpers after library row yft_town_helpers (lin, flat principled mat, box/cyl builders), rewritten so every object keeps its own origin."""
import bpy, bmesh, math, json, os, sys, random
from mathutils import Vector, Matrix, Euler
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(HERE, '..'); OUT = os.path.join(ROOT, 'out'); TEX = os.path.join(ROOT, 'tex')
os.makedirs(OUT, exist_ok=True); sys.path.insert(0, HERE)
PRM = json.load(open(os.path.join(ROOT, 'params_toilet.json'))); PAL = PRM['palette']
bpy.ops.wm.read_factory_settings(use_empty=True); SC = bpy.context.scene; rnd = random.Random(5)
def coll(name):
    c = bpy.data.collections.new(name); SC.collection.children.link(c); return c
SET, STAND, LIGHTS = coll('toilet_set'), coll('standins'), coll('lights')
def lin(h):
    h = h.lstrip('#'); v = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return [(c / 12.92 if c <= .04045 else ((c + .055) / 1.055) ** 2.4) for c in v] + [1.]
MATS = {}
def mat(name, rough=.85, metal=0., emit=None, es=0., png=None, emit_png=False, coat=0., col=None):
    if name in MATS: return MATS[name]
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = lin(col or PAL.get(name, '#ff00ff')); b.inputs['Roughness'].default_value = rough; b.inputs['Metallic'].default_value = metal
    b.inputs['Specular IOR Level'].default_value = .5 if rough < .6 else .15
    if coat: b.inputs['Coat Weight'].default_value = coat; b.inputs['Coat Roughness'].default_value = .08
    if png:
        t = nt.nodes.new('ShaderNodeTexImage'); t.image = bpy.data.images.load(os.path.join(TEX, png)); t.extension = 'EXTEND'
        nt.links.new(t.outputs[0], b.inputs['Emission Color' if emit_png else 'Base Color'])
        if emit_png: b.inputs['Base Color'].default_value = (0, 0, 0, 1); b.inputs['Emission Strength'].default_value = 1.
    if emit: b.inputs['Emission Color'].default_value = lin(emit); b.inputs['Emission Strength'].default_value = es
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
def alathe(bm, prof, seg=24, M=None, close=False, caps=True, ey=1.):
    """rings around local Z. prof rows: (radius_x, z[, x offset[, radius_y]])."""
    M = M or Matrix(); rings = []
    for p in prof:
        ry = (p[3] if len(p) > 3 else p[0]) * ey; xo = p[2] if len(p) > 2 else 0.
        rings.append([bm.verts.new(M @ Vector((math.cos(k * 2 * math.pi / seg) * p[0] + xo, math.sin(k * 2 * math.pi / seg) * ry, p[1]))) for k in range(seg)])
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
def crom(pts, per=10):
    P = [Vector(p) for p in pts]; P = [P[0]] + P + [P[-1]]; out = []
    for i in range(1, len(P) - 2):
        for k in range(per):
            t = k / per; p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
            out.append(.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t ** 3))
    out.append(P[-2]); return out
def resample(pts, step):
    out = [pts[0]]; acc = 0.
    for a, b in zip(pts, pts[1:]):
        L = (b - a).length; pos = step - acc
        while pos <= L: out.append(a.lerp(b, pos / L)); pos += step
        acc = (acc + L) % step
    return out
def atube(bm, pts, r, seg=10):
    rings = []; a = None
    for i, p in enumerate(pts):
        t = (pts[min(i + 1, len(pts) - 1)] - pts[max(i - 1, 0)]).normalized()
        a = t.orthogonal().normalized() if a is None else (a - t * a.dot(t)).normalized(); b = t.cross(a)
        rings.append([bm.verts.new(p + (a * math.cos(k * 2 * math.pi / seg) + b * math.sin(k * 2 * math.pi / seg)) * r) for k in range(seg)])
    for i in range(len(rings) - 1):
        for k in range(seg): bm.faces.new((rings[i][k], rings[i][(k + 1) % seg], rings[i + 1][(k + 1) % seg], rings[i + 1][k]))
    bm.faces.new(rings[0][::-1]); bm.faces.new(rings[-1])
MOVERS, ANCH = {}, {}
def obj(name, bm, m, loc=(0, 0, 0), rot=(0, 0, 0), c=None, smooth=False, mover=None):
    """mesh object with its origin at loc (the mesh is local to it). mover = dict of extra meta (exploded/open transforms) -> listed in meta movers."""
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
def pic(name, w, h, loc, rot, png, emit=False, **kw):
    bm = B(); aquad(bm, w, h); return obj(name, bm, mat(os.path.splitext(png)[0], png=png, emit_png=emit, rough=.9), loc, rot, **kw)
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
def panel_wall(name, P0, U, N, ulen, zh, holes=(), split=None, thick=.25, pw=.70, ph=.4333, cols=('wall_upper', 'wall_lower'), rivets=True):
    """a wall of plates: black backing slab (with the openings) + bevelled plates (dark seams between) + 4 small light rivets per plate. u runs along U from P0, v = z."""
    U, N = Vector(U), Vector(N); Zv = Vector((0, 0, 1)); M0 = MF(P0, U, Zv, U.cross(Zv))   # local (u, v, n) with n = -N (outward)
    bb = B()
    for u0, u1, v0, v1 in [r for r in __sub([(0, ulen, 0, zh)], holes)]:
        abox(bb, u1 - u0, v1 - v0, thick, M0 @ Matrix.Translation(((u0 + u1) / 2, (v0 + v1) / 2, thick / 2)), bev=0)
    obj(name + '_backing', bb, 'seam')
    bu, bl, br = B(), B(), B(); g = .012
    for j in range(int(math.ceil(zh / ph))):
        for i in range(int(math.ceil(ulen / pw))):
            for u0, u1, v0, v1 in __sub([(i * pw + g, min(ulen, (i + 1) * pw) - g, j * ph + g, min(zh, (j + 1) * ph) - g)], [(a - .02, b + .02, c - .02, d + .02) for a, b, c, d in holes]):
                low = split is not None and (v0 + v1) / 2 < split
                abox(bl if low else bu, u1 - u0, v1 - v0, .03, M0 @ Matrix.Translation(((u0 + u1) / 2, (v0 + v1) / 2, -.014)), bev=.006)
                if rivets and u1 - u0 > .2 and v1 - v0 > .2:
                    for ru, rv in ((u0 + .045, v0 + .045), (u1 - .045, v0 + .045), (u0 + .045, v1 - .045), (u1 - .045, v1 - .045)):
                        acyl(br, .011, .012, M0 @ Matrix.Translation((ru, rv, -.033)), seg=6)
    obj(name + '_panels', bu, cols[0])
    if split is not None: obj(name + '_panels_low', bl, cols[1])
    if rivets: obj(name + '_rivets', br, 'rivet')
def __sub(rects, holes):
    for h in holes: rects = rect_sub(rects, h)
    return rects
def ring_frame(name, w, h, r, t, d, M, m, bolts=14, bolt_m='rivet', bolt_r=.022):
    bm = B(); arring(bm, w, h, r, t, d, M); obj(name, bm, m, smooth=True)
    if bolts:
        bb = B(); mid = rr_pts(w + t * 1.15, h + t * 1.15, r + t * .55, 12); n = len(mid)
        for s in (1, -1):
            for k in range(bolts): p = mid[int((k + .5) * n / bolts) % n]; alathe(bb, [(bolt_r, 0), (bolt_r * .8, .012), (bolt_r * .4, .02)], 8, M @ Matrix.Translation((p[0], p[1], s * d / 2)) @ Matrix.Scale(s, 4, (0, 0, 1)))
        obj(name + '_bolts', bb, bolt_m, smooth=True)

# ================================================================== A. THE ROOM
X0, X1, Y0, Y1, WH, CH = -2., 2., -1.7, 3.9, 3.3, 4.0; TILE = .4
WIN = dict(y=2.85, z=2.38, w=1.6, h=1.55, r=.30, t=.19)        # big window, right wall (f5: centre x 45%, toilet right of its centre; round 1 moved y 2.5 -> 2.85)
PORT = dict(y=2.85, z=1.25, w=1.1, h=1.0, r=.30, t=.14)        # porthole, left wall (shot 1 pulls back out through it, f30-41)
DOOR = dict(x=-.65, z=1.01, w=.88, h=1.86, r=.30, t=.11)       # door, back wall
SHELF_Z = 1.30
def hole(c, h, w, z, off): return (c - w / 2 - off, c + w / 2 - off, z - h / 2, z + h / 2)
panel_wall('wall_right', (X1, Y0, 0), (0, 1, 0), (-1, 0, 0), Y1 - Y0, WH, [hole(WIN['y'], WIN['h'], WIN['w'], WIN['z'], Y0)], split=SHELF_Z)
SHAFT = (X0 - .15, X0 + .4, 1.21, 1.89)   # round 3: the hatch mouth goes through the wall foot and down into the bay (0.55 x 0.68 m, staging request 1a)
panel_wall('wall_left', (X0, Y1, 0), (0, -1, 0), (1, 0, 0), Y1 - Y0, WH, [hole(Y1 - PORT['y'], PORT['h'], PORT['w'], PORT['z'], 0), (Y1 - SHAFT[3], Y1 - SHAFT[2], 0, .46)])
panel_wall('wall_back', (X1, Y1, 0), (-1, 0, 0), (0, -1, 0), X1 - X0, CH, [hole(X1 - DOOR['x'], DOOR['h'], DOOR['w'], DOOR['z'], 0)])
panel_wall('wall_front', (X0, Y0, 0), (1, 0, 0), (0, 1, 0), X1 - X0, CH)
# window, porthole and door frames (matte metal rings with bolts, deep inner bevel)
ring_frame('window_frame', WIN['w'], WIN['h'], WIN['r'], WIN['t'], .40, MF((X1 + .1, WIN['y'], WIN['z']), (0, 1, 0), (0, 0, 1), (1, 0, 0)), mat('window_frame', rough=.6, metal=.3), 14)
ring_frame('porthole_frame', PORT['w'], PORT['h'], PORT['r'], PORT['t'], .40, MF((X0 - .1, PORT['y'], PORT['z']), (0, 1, 0), (0, 0, 1), (1, 0, 0)), mat('window_frame'), 12)
ring_frame('door_frame', DOOR['w'], DOOR['h'], DOOR['r'], DOOR['t'], .36, MF((DOOR['x'], Y1 + .1, DOOR['z']), (1, 0, 0), (0, 0, 1), (0, -1, 0)), mat('door_frame', rough=.55, metal=.3), 0)
for nm, x, yc, w, h, zc in (('window_glass', X1 + .2, WIN['y'], WIN['w'], WIN['h'], WIN['z']), ('porthole_glass', X0 - .2, PORT['y'], PORT['w'], PORT['h'], PORT['z'])):
    pass   # no glass pane: a pane only adds reflections the reference does not show (the kit and Blender both read the view card directly)
# the view outside the big window: emissive picture cards just outside the hull (Earth by day and in the wide, stars only at night)
pic('window_view_day', 4.3, 3.225, (X1 + .62, WIN['y'], 2.9), (90, 0, -90), 'earth_day.png', emit=True)
pic('window_view_night', 4.3, 3.225, (X1 + .63, WIN['y'], 2.9), (90, 0, -90), 'space_stars.png', emit=True)
# ceiling: flat top + two 45 degree slopes (the back wall reads as a gable), 2 thick roof beams, light rim strip following the gable on the back wall
box('ceiling_flat', (2.7, Y1 - Y0 + .5, .15), (0, (Y0 + Y1) / 2, CH + .075), mat('ceiling'), bev=0)
for s in (1, -1): box('ceiling_slope_%s' % ('r' if s > 0 else 'l'), (1.15, Y1 - Y0 + .5, .12), (s * 1.69, (Y0 + Y1) / 2, 3.69), mat('ceiling'), bev=0, rot=(0, s * 45, 0))
bm = B()
for y in (.55, 2.35):
    abox(bm, 2.5, .24, .3, MT((0, y, CH - .15)), bev=.02)
    for s in (1, -1): abox(bm, 1.05, .24, .3, MT((s * 1.6, y, 3.6), (0, s * 45, 0)), bev=.02)
obj('roof_beams', bm, 'roof_beam')
bm = B()
for s in (1, -1):
    abox(bm, .1, .05, 2.5, MT((s * 1.86, Y1 - .05, 1.7)), bev=.01); abox(bm, .1, .05, .95, MT((s * 1.53, Y1 - .05, 3.28), (0, s * 45, 0)), bev=.01)
    abox(bm, .1, .05, .5, MT((s * 1.69, Y1 - .05, .28), (0, -s * 45, 0)), bev=.01)
abox(bm, 2.5, .05, .1, MT((0, Y1 - .05, 3.61)), bev=.01); obj('rim_strip', bm, mat('rim_strip', rough=.6))
# floor: black / white checker (one quad per tile), slab under it, the opening at the left wall foot (hose port plate + hatch)
HOLE = (X0, X0 + TILE, .7, 1.9)
bw, bk = B(), B()
for i in range(10):
    for j in range(14):
        x, y = X0 + i * TILE, Y0 + j * TILE
        if x < HOLE[1] - .01 and HOLE[2] - .01 < y < HOLE[3] - .01: continue
        abox(bw if (i + j) % 2 else bk, TILE, TILE, .02, MT((x + TILE / 2, y + TILE / 2, -.01)), bev=0)
obj('floor_tiles_white', bw, mat('tile_white', rough=.45)); obj('floor_tiles_black', bk, mat('tile_black', rough=.45))
bm = B()
for u0, u1, v0, v1 in __sub([(X0 - .25, X1 + .25, Y0 - .25, Y1 + .25)], [HOLE, (X0 - .3, SHAFT[1], SHAFT[2], SHAFT[3])]): abox(bm, u1 - u0, v1 - v0, .1, MT(((u0 + u1) / 2, (v0 + v1) / 2, -.07)), bev=0)
obj('floor_slab', bm, 'bay_dark')
# shelf along the right wall, cabinet under it toward the camera of the wide, towel, things on the shelf (variants by light)
box('shelf', (.34, Y1 - Y0, .09), (X1 - .17, (Y0 + Y1) / 2, SHELF_Z - .045), mat('shelf_top'), bev=.012)
box('shelf_front', (.02, Y1 - Y0, .075), (X1 - .345, (Y0 + Y1) / 2, SHELF_Z - .05), mat('shelf_front'), bev=.004)
box('cabinet', (.5, 3.3, SHELF_Z - .1), (X1 - .25, Y0 + 1.65, (SHELF_Z - .1) / 2), mat('cabinet'), bev=.015)
bm = B()
for y in (-.6, .5): abox(bm, .012, .012, SHELF_Z - .2, MT((X1 - .503, y, (SHELF_Z - .1) / 2)), bev=0)
obj('cabinet_seams', bm, 'seam')
bm = B(); acyl(bm, .012, .6, MT((X1 - .56, 1.2, 1.02), (90, 0, 0)), 10)
for y in (.92, 1.48): acyl(bm, .012, .06, MT((X1 - .53, y, 1.02), (0, 90, 0)), 8)
obj('towel_rail', bm, mat('chrome', rough=.2, metal=1.), smooth=True)
box('towel', (.03, .46, .62), (X1 - .575, 1.2, .72), mat('towel_orange'), bev=.012)
bm = B()
for z in (.62, .82): abox(bm, .034, .462, .06, MT((X1 - .575, 1.2, z)), bev=0)
obj('towel_stripes', bm, 'towel_white')
bm = B(); alathe(bm, [(.05, 0), (.065, .11), (.055, .11), (.045, .02)], 14); obj('plant_pot', bm, mat('pot'), (X1 - .17, 1.95, SHELF_Z), smooth=True)
bm = B()
for k in range(7): abox(bm, .025, .008, .2, MT((math.cos(k * .9) * .02, math.sin(k * .9) * .02, .2), (rnd.uniform(-22, 22), rnd.uniform(-22, 22), k * 50)), bev=0)
obj('plant_leaves', bm, mat('leaf'), (X1 - .17, 1.95, SHELF_Z))
bm = B(); alathe(bm, [(.05, 0), (.06, .15), (.052, .15), (.045, .02)], 16); obj('cup', bm, mat('cup_blue'), (X1 - .17, 1.8, SHELF_Z), smooth=True, mover={})
bm = B(); acyl(bm, .008, .3, MT((0, 0, .15)), 8); alathe(bm, [(.02, .3), (.02, .33)], 8); obj('toothbrush', bm, mat('straw_red'), (X1 - .17, 1.8, SHELF_Z + .04), (0, -12, 0), smooth=True, mover={})
box('kid_drawing_frame', (.03, .26, .31), (X1 - .1, 1.45, SHELF_Z + .16), mat('leaf'), bev=.008, rot=(0, -8, 0))
pic('kid_drawing', .21, .26, (X1 - .118, 1.45, SHELF_Z + .16), (90, 0, -90), 'kid_drawing.png')
bm = B(); alathe(bm, [(.035, -.08), (.095, -.08), (.095, .08), (.035, .08)], 18, close=True); obj('shelf_roll', bm, mat('paper'), (X1 - .17, 2.15, SHELF_Z + .08), smooth=True)
box('paper_dispenser', (.1, .34, .22), (X1 - .09, 3.3, .78), mat('paper'), bev=.02)
box('speaker', (.16, .19, .3), (X1 - .11, 1.55, 2.45), mat('speaker', rough=.5), bev=.02)
def handle(name, loc, n, h=1.4):
    bm = B(); acyl(bm, .024, h, MT((n[0] * .09, n[1] * .09, 0)), 10); obj(name, bm, mat('handle_orange'), loc, smooth=True)
    bm = B()
    for s in (1, -1): abox(bm, .1 if n[0] else .05, .1 if n[1] else .05, .05, MT((n[0] * .05, n[1] * .05, s * (h / 2 - .08))), bev=.008)
    obj(name + '_standoffs', bm, 'peg_black', loc)
handle('handle_window', (X1 - .03, 1.85, 2.3), (-1, 0, 0)); handle('handle_corner', (X1 - .03, 3.72, 2.3), (-1, 0, 0)); handle('handle_left_wall', (X0 + .03, .85, 2.2), (1, 0, 0), 1.1)
bm = B()
for y in (1.95, 3.45): abox(bm, .16, .12, .1, MT((X1 - .1, y, .04), (0, 25, 0)), bev=.01)
obj('floor_wedges', bm, mat('wedge', rough=.6))
pic('poster_flush', .31, .39, (-1.42, Y1 - .035, 1.62), (90, 0, 0), 'poster_flush.png')
# door: sliding leaf (mover, slides left behind the wall), the corridor behind with the blue panel wall
box('door_leaf', (1.05, .05, 2.05), (DOOR['x'], Y1 + .31, DOOR['z']), mat('door_leaf', rough=.6), bev=.01, mover={'open': {'loc': [DOOR['x'] - 1.12, Y1 + .31, DOOR['z']], 'rot': [0, 0, 0]}})
panel_wall('corridor_wall', (.4, 5.0, 0), (-1, 0, 0), (0, -1, 0), 2.1, 2.3, pw=.42, ph=.46, cols=('corridor_wall', 'corridor_wall'), rivets=False)
bm = B(); abox(bm, 2.1, .75, .1, MT((-.65, 4.62, -.05)), bev=0); abox(bm, 2.1, .75, .1, MT((-.65, 4.62, 2.35)), bev=0)
for s in (1, -1): abox(bm, .1, .75, 2.4, MT((-.65 + s * 1.05, 4.62, 1.15)), bev=0)
obj('corridor_shell', bm, 'corridor_seam'); bpy.data.materials['seam'].node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value = .9

# ------------------------------------------------------------------ the toilet: every part its own mover (rest + exploded transforms)
TX, TY = 1.38, 2.6; PORC = mat('porcelain', rough=.12, coat=.6, emit=PAL['toilet_glow'], es=0.); CHROME = mat('chrome')
def part(name, bm, m, loc, rot=(0, 0, 0), ex=None, exrot=None, smooth=True, scale=None):
    mv = {'exploded': {'loc': [round(v, 4) for v in (ex or loc)], 'rot': list(exrot or rot)}}
    if scale: mv['scale'] = [scale[0]] * 3; mv['exploded']['scale'] = [scale[1]] * 3
    o = obj(name, bm, m, loc, rot, smooth=smooth, mover=mv)
    if scale: o.scale = [scale[0]] * 3
    return o
EXX = TX - .35     # exploded parts line up over a point in front of the bowl (round 2: off the window wall)
bm = B(); alathe(bm, [(.20, -.15, 0, .15), (.20, -.10, 0, .15), (.15, .05, .02, .115), (.17, .15, 0, .14)], 28)
part('toilet_base', bm, PORC, (TX, TY, .15), ex=(EXX, TY, .50))
bm = B(); alathe(bm, [(.17, -.14, 0, .14), (.25, -.03, -.02, .21), (.285, .07, -.02, .245), (.29, .13, -.02, .25), (.235, .13, -.02, .195), (.19, .0, -.02, .15), (.08, -.08, -.02, .07)], 32)
abox(bm, .22, .44, .12, MT((.3, 0, .07)), bev=.03)
part('toilet_bowl', bm, PORC, (TX, TY, .44), ex=(EXX, TY, 1.25), exrot=(0, -8, 0))
bm = B(); alathe(bm, [(.30, 0, 0, .26), (.30, .028, 0, .26), (.215, .028, 0, .175), (.215, 0, 0, .175)], 32, close=True)
part('toilet_seat', bm, PORC, (TX - .02, TY, .575), ex=(EXX, TY, 1.72), exrot=(0, -10, 0))
bm = B(); alathe(bm, [(.29, 0, -.29, .25), (.30, .012, -.29, .26), (.29, .03, -.29, .25)], 32)
part('toilet_lid', bm, PORC, (TX + .27, TY, .61), (0, 97, 0), ex=(EXX + .2, TY, 2.05), exrot=(0, 8, 0))
bm = B(); abox(bm, .26, .56, .42, bev=.035); part('toilet_tank', bm, PORC, (TX + .45, TY, .72), ex=(EXX + .22, TY, 2.45), exrot=(0, -14, 0), smooth=False)
bm = B(); abox(bm, .30, .60, .06, bev=.02); part('toilet_tank_lid', bm, PORC, (TX + .45, TY, .96), ex=(EXX + .18, TY, 2.78), exrot=(0, -20, 0), smooth=False)
bm = B(); acyl(bm, .013, .26, MT((0, .13, 0), (90, 0, 0)), 10); alathe(bm, [(.022, 0), (.022, .03)], 10, MT((0, .0, 0), (-90, 0, 0)))
part('toilet_flush_lever', bm, CHROME, (TX + .34, TY + .28, .86), (0, 0, -12), ex=(EXX + .05, TY + .5, 2.5), exrot=(0, 0, -30))
bm = B(); alathe(bm, [(.045, 0), (.045, .012), (.03, .02)], 16); part('toilet_flush_button', bm, CHROME, (TX + .45, TY, .99), ex=(EXX + .16, TY, 2.98))
for s in (1, -1):
    bm = B(); acyl(bm, .02, .04, None, 10); part('toilet_hinge_peg_%s' % ('l' if s > 0 else 'r'), bm, mat('peg_black'), (TX + .25, TY + s * .1, .6), ex=(EXX + .26, TY + s * .1, 1.9))
bm = B(); alathe(bm, [(.19, 0), (.19, .02), (.09, .02), (.09, 0)], 24, close=True); part('toilet_flange', bm, mat('flange', rough=.5), (TX, TY, -.035), ex=(EXX, TY, .12))
bm = B(); alathe(bm, [(.15, 0), (.15, .025), (.10, .025), (.10, 0)], 24, close=True); part('toilet_gasket', bm, mat('paper'), (TX, TY, -.03), ex=(EXX, TY, .27))
for k, (dx, dy, ex) in enumerate(((0, .17, (EXX - .45, TY + .4, .22)), (0, -.17, (EXX - .5, TY - .35, .3)), (.4, .18, (EXX + .5, TY + .45, .45)), (.4, -.18, (EXX + .55, TY - .4, .2)))):
    bm = B(); acyl(bm, .012, .07, None, 8); alathe(bm, [(.024, .035), (.024, .05)], 6)
    part('toilet_bolt_%d' % (k + 1), bm, CHROME, (TX + dx, TY + dy, .03 if k < 2 else .5), ex=ex, exrot=(40 + k * 30, 25 * k, 0))
for k, z in enumerate((.8, 1.5, 1.9, 2.3)):      # the white rings between the exploded parts: scale 0 at rest, 1 exploded
    bm = B(); alathe(bm, [(.30, -.008), (.30, .008), (.27, .008), (.27, -.008)], 32, close=True, ey=.85)
    part('explode_ring_%d' % (k + 1), bm, mat('glow_ring', emit=PAL['glow_ring'], es=0.), (EXX, TY, .4), ex=(EXX, TY, z), scale=(.01, 1.))
# floating paper roll (shot 1) + the ribbon that arcs into the bowl (f14-22) + the hose cuff at the toilet foot
bm = B(); alathe(bm, [(.04, -.085), (.10, -.085), (.10, .085), (.04, .085)], 20, close=True); abox(bm, .004, .2, .168, MT((.1, .1, 0), (0, 0, 14)), bev=0)
obj('paper_roll_float', bm, mat('paper'), (1.3, 2.28, 1.0), (72, 12, 20), smooth=True, mover={})
bm = B(); acyl(bm, .042, .172, None, 14); o = obj('paper_roll_core', bm, mat('roll_core'), smooth=True); o.parent = bpy.data.objects['paper_roll_float']
RIBP = Vector((1.3, 2.28, 1.03))   # round 3: the ribbon has its own pivot at the roll (scale 0 -> 1 grows it out of the roll into the bowl)
rib = crom([(1.3, 2.28, 1.03), (1.22, 2.3, 1.3), (1.2, 2.38, 1.15), (1.28, 2.55, .75), (1.3, 2.6, .5)], 8); bm = B()
for a, b in zip(rib, rib[1:]):
    vs = [bm.verts.new(p - RIBP + Vector((s * .08, 0, 0))) for p, s in ((a, -1), (a, 1), (b, 1), (b, -1))]; bm.faces.new(vs)
bmesh.ops.remove_doubles(bm, verts=bm.verts[:], dist=.0005); obj('paper_ribbon', bm, mat('paper'), tuple(RIBP), smooth=True, mover={'pivot': 'roll', 'grow': 'scale 0 -> 1 from the roll'})
# bowl water + swirl (his f24-28): water disc (static) and a 3-arm spiral (mover, origin at the bowl centre, spins about z)
SWC = (TX - .04, TY, .43)
bm = B(); alathe(bm, [(.0, 0), (.16, 0)], 28, ey=.8, caps=False); obj('bowl_water', bm, mat('water', rough=.15), SWC, smooth=True)
bm = B()
for arm in range(3):
    pts = []
    for k in range(17):
        t = k / 16; a = arm * 2 * math.pi / 3 + t * 2.6; r = .015 + .13 * t; w = .006 + .018 * t
        pts.append(((r - w) * math.cos(a), (r - w) * math.sin(a) * .8, (r + w) * math.cos(a + .25), (r + w) * math.sin(a + .25) * .8))
    for p0, p1 in zip(pts, pts[1:]):
        bm.faces.new([bm.verts.new((x, y, .003)) for x, y in ((p0[0], p0[1]), (p0[2], p0[3]), (p1[2], p1[3]), (p1[0], p1[1]))])
obj('bowl_swirl', bm, mat('swirl', rough=.3), SWC, mover={'spin': {'axis': 'z', 'deg_per_frame': -30, 'frames': [24, 28]}})

# ================================================================== H. HOSE, PORT, HATCH, UNDER-FLOOR BAY, FLANGE, NOZZLE, TUBE
HP = [(TX - .2, TY - .32, .042), (.75, 2.05, .042), (.1, 1.55, .042), (-.8, 1.15, .042), (-1.4, .98, .045), (-1.72, .95, .13), (-1.9, .95, -.2), (-1.75, .95, -.85),
      (-1.2, 1.0, -1.25), (-.6, 1.0, -1.27), (.1, 1.3, -1.25), (.9, 1.5, -1.1), (1.4, 1.5, -.92), (1.66, 1.5, -.9)]
path = resample(crom(HP, 14), .03)
bm = B(); atube(bm, path, .033); obj('hose', bm, mat('hose_core', rough=.6), smooth=True)
bm = B()
for i in range(1, len(path) - 1):
    t = (path[i + 1] - path[i - 1]).normalized(); a = t.orthogonal().normalized()
    alathe(bm, [(.034, -.008), (.042, -.004), (.042, .004), (.034, .008)], 10, MF(path[i], a, t.cross(a), t), caps=False)
obj('hose_ribs', bm, mat('hose_rib', rough=.5, emit=PAL['hose_glow'], es=0.), smooth=True)
bm = B(); bmesh.ops.create_uvsphere(bm, u_segments=16, v_segments=10, radius=.075); obj('hose_pulse', bm, mat('hose_glow', emit=PAL['hose_glow'], es=14.), tuple(path[0]), smooth=True, mover={})
bm = B(); alathe(bm, [(.06, 0), (.06, .09), (.04, .09), (.04, 0)], 14, close=True); obj('hose_cuff', bm, CHROME, (TX - .2, TY - .3, .0), smooth=True)
# sloped plates at the left wall foot: the fixed port plate (dark collar, hose through it) and the hatch panel (mover, hinged at its top edge on the wall)
SL = math.degrees(math.atan2(.42, .37)); Lp = .56
def slope_plate(name, y0, y1, m, mover=None):
    bm = B(); abox(bm, Lp, y1 - y0 - .01, .03, MT((Lp / 2, 0, 0)), bev=.008)
    return obj(name, bm, m, (X0 + .03, (y0 + y1) / 2, .42), (0, SL, 0), mover=mover)
slope_plate('port_plate', .7, 1.2, mat('port_plate', rough=.6)); slope_plate('hatch_panel', 1.2, 1.9, mat('port_plate'), mover={'open': {'loc': [X0 + .05, 1.55, .42], 'rot': [0, -86, 0]}})   # round 3: opens up flat against the wall (was SL - 80: it covered the shaft mouth)
bm = B(); alathe(bm, [(.075, -.03), (.075, .03), (.045, .03), (.045, -.03)], 16, close=True); obj('port_collar', bm, mat('collar', rough=.5), (-1.74, .95, .15), (0, SL - 90, 0), smooth=True)
bm = B(); abox(bm, .04, .012, .44, MT((X0 + .02, 1.2, .21), (0, 0, 0)), bev=0); obj('hatch_jamb', bm, 'seam')
bm = B(); abox(bm, .05, SHAFT[3] - SHAFT[2] + .04, .6, MT((SHAFT[0] - .025, (SHAFT[2] + SHAFT[3]) / 2, .16)), bev=0)
abox(bm, SHAFT[1] - SHAFT[0] - .37, SHAFT[3] - SHAFT[2] + .04, .04, MT((SHAFT[0] + (SHAFT[1] - SHAFT[0] - .37) / 2, (SHAFT[2] + SHAFT[3]) / 2, .48)), bev=0)
for yy in (SHAFT[2] - .01, SHAFT[3] + .01): abox(bm, .2, .02, .6, MT((SHAFT[0] + .1, yy, .16)), bev=0)
obj('hatch_shaft_lining', bm, mat('bay_beam'))
pic('sign_waste_line', .40, .112, (X0 + .036, .98, .56), (90, 0, 90), 'sign_waste_line.png')
pic('sign_waste_vent_wall', .30, .225, (X0 + .036, .3, 1.15), (90, 0, 90), 'sign_waste_vent.png')
# the bay under the floor: hull shell, crinkled gold foil lining, heavy rounded frames, rail, pipes
BZ = -1.7
bm = B()
abox(bm, .25, Y1 - Y0 + .5, -BZ, MT((SHAFT[0] - .125, (Y0 + Y1) / 2, BZ / 2)), bev=0); abox(bm, .25, Y1 - Y0 + .5, -BZ, MT((X1 + .125, (Y0 + Y1) / 2, BZ / 2)), bev=0)
abox(bm, 4, .25, -BZ, MT((0, Y0 - .125, BZ / 2)), bev=0); abox(bm, 4, .25, -BZ, MT((0, Y1 + .125, BZ / 2)), bev=0); abox(bm, 4.5, Y1 - Y0 + .5, .1, MT((0, (Y0 + Y1) / 2, BZ - .05)), bev=0)
abox(bm, .25, Y1 - Y0, -BZ - .12, MT((X1 - .125, (Y0 + Y1) / 2, BZ / 2 - .06)), bev=.02); obj('bay_shell', bm, mat('bay_dark', rough=.6))
bm = B(); nx, ny, c = 23, 32, .18; G = [[bm.verts.new((X0 + i * (4 / (nx - 1)), Y0 + j * (5.6 / (ny - 1)), BZ + .08 + rnd.uniform(-.045, .045))) for j in range(ny)] for i in range(nx)]
for i in range(nx - 1):
    for j in range(ny - 1): bm.faces.new((G[i][j], G[i + 1][j], G[i + 1][j + 1])); bm.faces.new((G[i][j], G[i + 1][j + 1], G[i][j + 1]))
obj('bay_foil', bm, mat('foil', rough=.3, metal=.7))
bm = B()
for k in range(26): acyl(bm, .014, .02, MT((X0 + .15 + k * .145, 1.95, BZ + .135)), 6)
obj('bay_foil_rivets', bm, 'foil_rivet')
bm = B()
for x in (-1.0, .1, 1.0):
    for yc in (-.767, 1.1, 2.967): arring(bm, 1.45, 1.16, .30, .21, .18, MF((x, yc, -.91), (0, 1, 0), (0, 0, 1), (1, 0, 0)), lip=.03)
obj('bay_frames', bm, mat('bay_beam', rough=.45, metal=.4), smooth=True)
bm = B(); acyl(bm, .022, 5.6, MT((.55, (Y0 + Y1) / 2, -.62), (90, 0, 0)), 10); obj('bay_rail', bm, CHROME, smooth=True)
box('bay_rail_clip', (.08, .06, .1), (.55, 1.9, -.62), mat('pipe_black', rough=.5), bev=.01)
bm = B(); acyl(bm, .028, 3.7, MT((-.1, 2.3, BZ + .2), (0, 90, 0)), 10); obj('bay_pipe_yellow', bm, mat('pipe_yellow', rough=.5), smooth=True)
bm = B(); acyl(bm, .028, 3.7, MT((-.1, 2.4, BZ + .2), (0, 90, 0)), 10); obj('bay_pipe_black', bm, mat('pipe_black'), smooth=True)
# flange on the beam face under the window, brass coupling, WASTE VENT plate above it
FL = (X1 - .255, 1.5, -.9)
bm = B()   # round 3: open plate (square hole 0.25) + a dark lip ring (bore 0.25) = the tube entry (staging request 1b)
for sy, sz, w, h in ((0, 1, .34, .045), (0, -1, .34, .045), (1, 0, .045, .25), (-1, 0, .045, .25)): abox(bm, .04, w, h, MT((0, sy * .1475, sz * .1475)), bev=.008)
obj('flange_plate', bm, mat('flange'), FL)
bm = B(); alathe(bm, [(.125, 0), (.17, 0), (.165, .035), (.125, .05)], 32, MF((-.02, 0, 0), (0, 1, 0), (0, 0, 1), (1, 0, 0)) @ Matrix.Scale(-1, 4, (0, 0, 1)), close=True)
obj('flange_lip', bm, mat('tube_b'), FL, smooth=True)
bm = B()
for k in range(8):
    a = k * math.pi / 4 + math.pi / 8; alathe(bm, [(.016, 0), (.016, .012), (.008, .02)], 8, MF((-.02, math.cos(a) * .14, math.sin(a) * .14), (0, 1, 0), (0, 0, 1), (1, 0, 0)) @ Matrix.Scale(-1, 4, (0, 0, 1)))
obj('flange_bolts', bm, mat('bolt_white', rough=.4), FL, smooth=True)
bm = B(); alathe(bm, [(.052, 0), (.052, .1), (.04, .1), (.04, 0)], 6, MF((-.19, 0, 0), (0, 1, 0), (0, 0, 1), (1, 0, 0)), close=True); obj('flange_coupling', bm, mat('brass', rough=.25, metal=1.), FL)
pic('sign_waste_vent', .40, .30, (X1 - .262, 1.5, -.42), (90, 0, -90), 'sign_waste_vent.png')
# nozzle on the outer hull under the window (seen head-on from outside at f1176): brushed plate, 4 dome bolts, egg housing, recessed cyan lens
NZ = (X1 + .25, 1.5, -.9); MN = MF((0, 0, 0), (0, 1, 0), (0, 0, 1), (1, 0, 0))
bm = B(); abox(bm, .03, .62, .62, MT((.015, 0, 0)), bev=.01); obj('nozzle_plate', bm, mat('nozzle_plate', rough=.4, metal=.6), NZ)
bm = B()
for sy in (1, -1):
    for sz in (1, -1): alathe(bm, [(.028, 0), (.026, .014), (.014, .026)], 10, MN @ Matrix.Translation((sy * .25, sz * .25, .03)))
obj('nozzle_bolts', bm, mat('nozzle_bolt', rough=.4, metal=.5), NZ, smooth=True)
bm = B(); alathe(bm, [(.24, .03), (.235, .08), (.20, .14), (.14, .175), (.115, .18), (.105, .13), (.02, .13)], 28, MN, ey=.86); obj('nozzle_housing', bm, mat('nozzle_cone', rough=.3), NZ, smooth=True)
bm = B(); alathe(bm, [(.10, .13), (.10, .14), (.062, .14), (.062, .13)], 24, MN, close=True); obj('nozzle_lens_ring', bm, mat('nozzle_ring', rough=.3, emit=PAL['nozzle_ring'], es=.6), NZ, smooth=True)
bm = B(); alathe(bm, [(.062, .132), (.062, .136)], 20, MN); obj('nozzle_lens_inner', bm, mat('nozzle_inner', rough=.3), NZ, smooth=True)
# inside of the tube, round 3: ON the flange axis (+x): throat (bore 0.25) through the hull, flare, then the tube (dark smooth rings, thin light rings,
# the glowing core at the far end). State tube=1 shows it and hides the outside nozzle (they overlap); tube=0 = nozzle seen from outside.
TB0, TB1, TR = 2.75, 10.75, .5; MTB = MF((0, FL[1], FL[2]), (0, 1, 0), (0, 0, 1), (1, 0, 0)); ba, bb_, blt = B(), B(), B(); k = 0; y = TB0
x = FL[0] - .02
while x < 2.45 - .01:
    alathe(ba if k % 2 == 0 else bb_, [(.125, x), (.125, min(2.45, x + .12))], 28, MTB, caps=False); x += .12; k += 1
alathe(bb_, [(.125, 2.45), (TR, TB0)], 40, MTB, caps=False); k = 0
bm = B(); alathe(bm, [(.124, 1.98), (.09, 2.0), (.09, 2.03), (.124, 2.05)], 28, MTB, caps=False); obj('tube_throat_ring', bm, mat('tube_throat_ring', rough=.3, col=PAL['nozzle_ring'], emit=PAL['nozzle_ring'], es=3.), smooth=True)   # the light ring seen in the bore (his f1176)
while y < TB1 - .01:
    L = .55 if k % 2 == 0 else .35; alathe(ba if k % 2 == 0 else bb_, [(TR, y), (TR, min(TB1, y + L))], 40, MTB, caps=False)
    if k % 4 == 0: alathe(blt, [(TR - .004, y - .012), (TR - .02, y), (TR - .004, y + .012)], 40, MTB, caps=False)
    y += L; k += 1
obj('tube_wall_a', ba, mat('tube_a', rough=.65), smooth=True); obj('tube_wall_b', bb_, mat('tube_b', rough=.65), smooth=True)
obj('tube_rings_light', blt, mat('tube_light', rough=.4, emit=PAL['tube_light'], es=.6), smooth=True)
bm = B(); alathe(bm, [(TR, TB1), (.36, TB1 + .25), (.2, TB1 + .3)], 40, MTB, caps=False); obj('tube_end_cone', bm, mat('tube_b'), smooth=True)
bm = B(); alathe(bm, [(.23, TB1 + .26), (.23, TB1 + .22), (.16, TB1 + .22), (.16, TB1 + .3)], 32, MTB, close=True); obj('tube_core_ring', bm, mat('tube_core_ring', rough=.3, emit=PAL['tube_core_ring'], es=1.2), smooth=True)
bm = B(); alathe(bm, [(.16, TB1 + .29), (.16, TB1 + .3)], 32, MTB); obj('tube_core_halo', bm, mat('tube_core_halo', rough=.5, emit=PAL['tube_core_halo'], es=1.5), smooth=True)
bm = B(); bmesh.ops.create_uvsphere(bm, u_segments=20, v_segments=12, radius=.09); obj('tube_core', bm, mat('tube_core', emit=PAL['tube_core'], es=2.), (TB1 + .26, FL[1], FL[2]), smooth=True, mover={})
TUBE_PARTS = ['tube_throat_ring', 'tube_wall_a', 'tube_wall_b', 'tube_rings_light', 'tube_end_cone', 'tube_core_ring', 'tube_core_halo', 'tube_core']
NOZZLE_PARTS = ['nozzle_plate', 'nozzle_bolts', 'nozzle_housing', 'nozzle_lens_ring', 'nozzle_lens_inner']

# shot 6 night (his f500-530): glowing floor strip along the wall foot (emission set by the api: glow x night) and a halo shell around the toilet
bm = B(); abox(bm, .05, Y1 - 1.6, .012, MT((X1 - .04, (1.6 + Y1) / 2, .006)), bev=0); abox(bm, .05, 1.6 - Y0, .012, MT((X1 - .53, (Y0 + 1.6) / 2, .006)), bev=0)
abox(bm, .5, .05, .012, MT((X1 - .28, 1.6, .006)), bev=0); obj('floor_glow_strip', bm, mat('floor_glow', rough=.5, emit=PAL['floor_glow'], es=0.))
FX = coll('fx_blender_only')   # NOT in the GLB: the kit makes the halo with its bloom
hm = bpy.data.materials.new('toilet_halo'); hm.use_nodes = True; nt = hm.node_tree; nt.nodes.clear()
o_ = nt.nodes.new('ShaderNodeOutputMaterial'); ad = nt.nodes.new('ShaderNodeAddShader'); tr = nt.nodes.new('ShaderNodeBsdfTransparent'); em = nt.nodes.new('ShaderNodeEmission')
lw = nt.nodes.new('ShaderNodeLayerWeight'); lw.inputs[0].default_value = .5; inv = nt.nodes.new('ShaderNodeMath'); inv.operation = 'POWER'; inv.inputs[1].default_value = 3.
one = nt.nodes.new('ShaderNodeMath'); one.operation = 'SUBTRACT'; one.inputs[0].default_value = 1.; nt.links.new(lw.outputs['Facing'], one.inputs[1]); nt.links.new(one.outputs[0], inv.inputs[0])
mul = nt.nodes.new('ShaderNodeMath'); mul.operation = 'MULTIPLY'; mul.name = 'halo_strength'; mul.inputs[1].default_value = 0.; nt.links.new(inv.outputs[0], mul.inputs[0]); nt.links.new(mul.outputs[0], em.inputs['Strength'])
em.inputs['Color'].default_value = lin(PAL['toilet_glow']); nt.links.new(tr.outputs[0], ad.inputs[0]); nt.links.new(em.outputs[0], ad.inputs[1]); nt.links.new(ad.outputs[0], o_.inputs['Surface'])
bm = B(); bmesh.ops.create_uvsphere(bm, u_segments=24, v_segments=16, radius=1.); bmesh.ops.scale(bm, vec=(.62, .58, .78), verts=bm.verts[:])
o = obj('toilet_halo', bm, hm, (TX + .12, TY, .55), c=FX, smooth=True); o.visible_shadow = False; o.visible_diffuse = False; o.visible_glossy = False

# ================================================================== STAND-IN CARDS (excluded from the GLB) and LIGHTS
def standin(name, col, h, loc, rz):
    bm = B(); abox(bm, .5, .012, .74, MT((0, 0, h - .62 - .30)), bev=0); acyl(bm, .31, .012, MT((0, -.01, h - .31), (90, 0, 0)), 24)
    for s in (1, -1): abox(bm, .03, .012, h - 1.25, MT((s * .1, 0, (h - 1.25) / 2)), bev=0)
    o = obj(name, bm, mat('si_' + name, col=col, rough=1.), loc, (0, 0, rz), c=STAND)
    hm = mat('standin_head', rough=1.); o.data.materials.append(hm)
    for f in o.data.polygons:
        if f.center.z > h - .63: f.material_index = 1
    return o
STANDINS = {'standin_newguy_s1': [1], 'standin_newguy_s6': [6], 'standin_newguy_s12': [12], 'standin_commander_s12': [12]}
standin('standin_newguy_s1', PAL['standin_newguy'], 1.70, (1.15, 3.25, 0), -90); standin('standin_newguy_s6', PAL['standin_newguy'], 1.70, (1.45, 3.15, 0), -90)
standin('standin_newguy_s12', PAL['standin_newguy'], 1.70, (.3, 3.2, 0), 0); standin('standin_commander_s12', PAL['standin_commander'], 1.76, (DOOR['x'], Y1 - .05, .08), 0)
def light(name, loc, col, watts, radius=.1, kind='POINT'):
    d = bpy.data.lights.new(name, kind); d.color = col; d.energy = watts; d.shadow_soft_size = radius; o = bpy.data.objects.new(name, d); o.location = loc; LIGHTS.objects.link(o); return o
light('key_day', (-1.3, 3.2, 3.1), (1., .97, .92), 2600, .35); light('fill_day', (-1.2, .2, 1.6), (.55, .62, 1.), 500, .8); light('warm_top', (1.5, 2.5, 3.2), (1., .78, .62), 90, .1)
light('night_fill', (-.6, 2.6, 2.6), (.12, .16, 1.), 420, .8)
light('key_wide', (1.85, 3.75, 1.55), (1., .98, .95), 3800, .03, 'SPOT'); _k = bpy.data.objects['key_wide']; _k.rotation_euler = (Vector((-1.2, .2, 0)) - _k.location).to_track_quat('-Z', 'Y').to_euler(); _k.data.spot_size = math.radians(120); _k.data.spot_blend = .25; light('fill_wide', (-1.2, -.8, 2.2), (.6, .68, 1.), 380, .8); light('door_light', (DOOR['x'], 4.6, 1.9), (.8, .88, 1.), 160, .2)
light('toilet_glow_light', (TX - .65, TY - .1, .95), (.55, .75, 1.), 0, .25); light('floor_glow_light', (X1 - .3, 2.3, .12), (.7, .82, 1.), 0, .4); light('pulse_light', tuple(path[0]), (.85, 1., 1.), 0, .05)
light('bay_fill', (.6, 1.2, -.6), (1., .85, .55), 30, .5); light('tube_core_light', (TB1 - .25, FL[1], FL[2]), (.3, .8, 1.), 6, .1)
light('flange_fill', (1.3, 1.3, -.55), (.75, .9, 1.), 12, .3); light('shaft_fill', ((SHAFT[0] + SHAFT[1]) / 2, (SHAFT[2] + SHAFT[3]) / 2, -.45), (1., .88, .6), 25, .2)
w = bpy.data.worlds.new('toilet_world'); w.use_nodes = True; SC.world = w

# ================================================================== META, RENDER SETTINGS, SAVE, GLB
for n, p in (('toilet', (TX, TY, 0)), ('toilet_bowl_centre', (TX - .02, TY, .57)), ('flush_lever', (TX + .34, TY + .5, .86)), ('window', (X1, WIN['y'], WIN['z'])), ('porthole', (X0, PORT['y'], PORT['z'])),
             ('door', (DOOR['x'], Y1, .08)), ('poster', (-1.42, Y1, 1.62)), ('hose_port', (-1.74, .95, .15)), ('hatch', (X0 + .2, 1.55, .2)), ('flange', FL), ('sign_waste_vent', (X1 - .262, 1.5, -.42)),
             ('nozzle', (NZ[0] + .14, NZ[1], NZ[2])), ('tube_in', (FL[0] - .02, FL[1], FL[2])), ('tube_throat_end', (2.45, FL[1], FL[2])), ('tube_full', (TB0, FL[1], FL[2])), ('tube_core', (TB1 + .26, FL[1], FL[2])),
             ('hatch_shaft_top', ((SHAFT[0] + SHAFT[1]) / 2, (SHAFT[2] + SHAFT[3]) / 2, .3)), ('hatch_shaft_bottom', ((SHAFT[0] + SHAFT[1]) / 2, (SHAFT[2] + SHAFT[3]) / 2, -.3)), ('newguy_s1', (1.15, 3.25, 0)), ('newguy_s6', (1.45, 3.15, 0)), ('newguy_s12', (.3, 3.2, 0)),
             ('commander_s12', (DOOR['x'], Y1 - .05, .08)), ('paper_roll', (1.3, 2.28, 1.0)), ('shelf_top', (X1 - .17, 2.0, SHELF_Z))): ANCH[n] = [round(v, 4) for v in p]
VARIANTS = {'plant_pot': ['day'], 'plant_leaves': ['day'], 'cup': ['night', 'wide'], 'toothbrush': ['night', 'wide'], 'kid_drawing_frame': ['wide'], 'kid_drawing': ['wide'], 'shelf_roll': ['wide'],
            'towel': ['wide'], 'towel_stripes': ['wide'], 'towel_rail': ['wide'], 'paper_dispenser': ['night', 'wide'], 'poster_flush': ['wide'], 'hose': ['wide'], 'hose_ribs': ['wide'], 'hose_cuff': ['wide']}
import toilet_api as api
META = {'place': 'toilet', 'units': 'Blender metres, Z up', 'room': {'x': [X0, X1], 'y': [Y0, Y1], 'wall_h': WH, 'ceiling': CH, 'tile': TILE, 'bay_z': BZ}, 'anchors': ANCH, 'cams': PRM['cams'], 'proofs': PRM['proofs'],
        'movers': MOVERS, 'variants': VARIANTS, 'standins': STANDINS, 'hose_path': [[round(v, 4) for v in p] for p in path[::4]] + [[round(v, 4) for v in path[-1]]],
        'state_default': {'light': 'day', 'glow': 0, 'exploded': 0, 'door': 'closed', 'hatch': 0, 'pulse': 0, 'shot': 0, 'paper': 0, 'commander': 1, 'tube': 1, 'swirl': 0},
        'tube_parts': TUBE_PARTS, 'nozzle_parts': NOZZLE_PARTS, 'one_move_hatch_to_tube': {'path': ['hatch', 'hatch_shaft_top', 'hatch_shaft_bottom', 'flange', 'tube_in', 'tube_throat_end', 'tube_full', 'tube_core'],
            'note': 'f1132-1199 one camera: down the hatch shaft into the bay, along the hose to the flange, through the bore (0.25 m) into the tube. The hose end + brass coupling sit on the axis at x 1.40-1.66: pass beside them (|offset| >= .07) or through in 1-2 frames.'},
        'lights': {k: {'loc': [round(v, 3) for v in o.location], 'color': [round(v, 3) for v in o.data.color], 'radius': o.data.shadow_soft_size} for k, o in LIGHTS.objects.items()}, 'light_kinds': api.LIGHTS,
        'frames': {'shot1': [0, 34], 'paper_ribbon': [14, 28], 'pull_out_porthole': [29, 41], 'shot6': [500, 530], 'shot12': [1007, 1113], 'commander_gone': 1074, 'glow_on': [1086, 1090],
                   'explode': [1097, 1104], 'pan_hose': [1114, 1131], 'hatch_opens': [1132, 1138], 'under_floor': [1140, 1175], 'nozzle_outside': 1176, 'inside_tube': [1176, 1199]}, 'palette': PAL}
json.dump(META, open(os.path.join(OUT, 'toilet_meta.json'), 'w'), indent=1)
SC.render.engine = 'CYCLES'; SC.cycles.samples = 16; SC.cycles.use_denoising = True; SC.view_settings.view_transform = 'Standard'; SC.view_settings.look = 'None'
SC.render.resolution_x, SC.render.resolution_y = 540, 960; SC.cycles.max_bounces = 6
tris = sum(len(o.data.polygons) for o in SET.objects if o.type == 'MESH')
for o in bpy.data.objects: o.select_set(False)
for o in SET.objects: o.select_set(True)
bpy.ops.export_scene.gltf(filepath=os.path.join(OUT, 'toilet_lite.glb'), use_selection=True, export_apply=True, export_yup=True)
api._M.clear(); api.set_state(SC)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, 'toilet.blend'))
print('BUILT toilet: %d set objects, %d faces, %d movers' % (len(SET.objects), tris, len(MOVERS)))
