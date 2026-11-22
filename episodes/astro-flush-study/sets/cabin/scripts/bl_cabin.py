"""bl_cabin.py: builds the WHOLE cabin place of astro-flush-study (LOOK_INVENTORY D ship cabin day + E sleep bay night). blender -b -P bl_cabin.py
-> ../out/cabin.blend, cabin_lite.glb, cabin_meta.json. Blender metres, Z up.
D and E are TWO ROOMS (the frames show different walls: grey panels + teal rail + quilt in D; dark blue panels, slanted roof with skylights,
portholes and a blue end wall in E), built side by side in one blend: the day cabin around x 0 (back wall y 1.5), the sleep bay around
x BX = -12 (bag wall y 1.2, end wall x BX + 2.5 with the door to the toilet room beyond). State `mode` day / night switches the lights and world.
Every material is one flat colour from params_cabin.json; detail is geometry. Movers have their origin at their pivot (meta "movers").
Helpers copied from sets/toilet/scripts/bl_toilet.py (after library row yft_town_helpers): every object keeps its own origin."""
import bpy, bmesh, math, json, os, sys, random
from mathutils import Vector, Matrix, Euler
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(HERE, '..'); OUT = os.path.join(ROOT, 'out'); TEX = os.path.join(ROOT, 'tex')
os.makedirs(OUT, exist_ok=True); sys.path.insert(0, HERE)
PRM = json.load(open(os.path.join(ROOT, 'params_cabin.json'))); PAL = PRM['palette']
bpy.ops.wm.read_factory_settings(use_empty=True); SC = bpy.context.scene; rnd = random.Random(5)
def coll(name):
    c = bpy.data.collections.new(name); SC.collection.children.link(c); return c
SET, STAND, LIGHTS = coll('cabin_set'), coll('standins'), coll('lights')
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
def asph(bm, r, M=None, u=16, v=10, sx=1., sy=1., sz=1.):
    t = bmesh.new(); bmesh.ops.create_uvsphere(t, u_segments=u, v_segments=v, radius=r)
    for q in t.verts: q.co = Vector((q.co.x * sx, q.co.y * sy, q.co.z * sz))
    if M: bmesh.ops.transform(t, matrix=M, verts=t.verts[:])
    me = bpy.data.meshes.new('_s'); t.to_mesh(me); t.free(); bm.from_mesh(me); bpy.data.meshes.remove(me)
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
def arrplate(bm, w, h, r, d, M=None):
    """solid rounded-rectangle plate in local XY, thickness d along Z."""
    M = M or Matrix(); P = rr_pts(w, h, r); a = [bm.verts.new(M @ Vector((p[0], p[1], -d / 2))) for p in P]; b = [bm.verts.new(M @ Vector((p[0], p[1], d / 2))) for p in P]; n = len(P)
    for k in range(n): bm.faces.new((a[k], a[(k + 1) % n], b[(k + 1) % n], b[k]))
    bm.faces.new(a[::-1]); bm.faces.new(b)
def aquad(bm, w, h, M=None):
    M = M or Matrix(); vs = [bm.verts.new(M @ Vector(p)) for p in ((-w / 2, -h / 2, 0), (w / 2, -h / 2, 0), (w / 2, h / 2, 0), (-w / 2, h / 2, 0))]
    f = bm.faces.new(vs); uv = bm.loops.layers.uv.verify()
    for lp, c in zip(f.loops, ((0, 0), (1, 0), (1, 1), (0, 1))): lp[uv].uv = c
def atube(bm, pts, r, seg=10):
    pts = [Vector(p) for p in pts]; rings = []; a = None
    for i, p in enumerate(pts):
        t = (pts[min(i + 1, len(pts) - 1)] - pts[max(i - 1, 0)]).normalized()
        a = t.orthogonal().normalized() if a is None else (a - t * a.dot(t)).normalized(); b = t.cross(a)
        rings.append([bm.verts.new(p + (a * math.cos(k * 2 * math.pi / seg) + b * math.sin(k * 2 * math.pi / seg)) * r) for k in range(seg)])
    for i in range(len(rings) - 1):
        for k in range(seg): bm.faces.new((rings[i][k], rings[i][(k + 1) % seg], rings[i + 1][(k + 1) % seg], rings[i + 1][k]))
    bm.faces.new(rings[0][::-1]); bm.faces.new(rings[-1])
MOVERS, ANCH = {}, {}
def _finish(bm, smooth):
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    if smooth:
        sharp = [e for e in bm.edges if len(e.link_faces) == 2 and e.calc_face_angle(0) > .6]
        if sharp: bmesh.ops.split_edges(bm, edges=sharp)
        for f in bm.faces: f.smooth = True
def obj(name, bm, m, loc=(0, 0, 0), rot=(0, 0, 0), c=None, smooth=False, mover=None):
    """mesh object with its origin at loc (the mesh is local to it). mover = dict of extra meta -> listed in meta movers."""
    return multi(name, [(bm, m)], loc, rot, c, smooth, mover)
def multi(name, parts, loc=(0, 0, 0), rot=(0, 0, 0), c=None, smooth=False, mover=None):
    """one object from several (bmesh, material) parts: one material slot per part."""
    out = bmesh.new(); ms = []
    for i, (bm, m) in enumerate(parts):
        _finish(bm, smooth); me = bpy.data.meshes.new('_p'); bm.to_mesh(me); bm.free()
        for p in me.polygons: p.material_index = i
        out.from_mesh(me); bpy.data.meshes.remove(me); ms.append(m if not isinstance(m, str) else mat(m))
    me = bpy.data.meshes.new(name); out.to_mesh(me); out.free(); o = bpy.data.objects.new(name, me)
    for m in ms: me.materials.append(m)
    o.location = loc; o.rotation_euler = [math.radians(a) for a in rot]; (c or SET).objects.link(o)
    if mover is not None: MOVERS[name] = dict(loc=[round(v, 4) for v in loc], rot=list(rot), **mover)
    return o
def B(): return bmesh.new()
def box(name, size, loc, m, bev=.008, rot=(0, 0, 0), **kw):
    bm = B(); abox(bm, *size, bev=bev); return obj(name, bm, m, loc, rot, **kw)
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
    return [r for r in out if r[1] - r[0] > .03 and r[3] - r[2] > .03]
def subs(rects, holes):
    for h in holes: rects = rect_sub(rects, h)
    return rects
def panels(name, O, U, V, ulen, vlen, holes=(), pw=.85, ph=.62, cols=('wall_upper', 'wall_upper'), split=None, thick=.2, rivets='rivet', seam='wall_seam', g=.012, pd=.03):
    """a wall of bevelled plates on a dark seam backing (with openings) + 4 rivets per plate. Local (u along U, v along V); U x V must point OUT of the room."""
    U, V = Vector(U), Vector(V); M0 = MF(O, U, V, U.cross(V)); bb = B()
    for u0, u1, v0, v1 in subs([(0, ulen, 0, vlen)], holes): abox(bb, u1 - u0, v1 - v0, thick, M0 @ Matrix.Translation(((u0 + u1) / 2, (v0 + v1) / 2, thick / 2)), bev=0)
    obj(name + '_backing', bb, seam)
    bu, bl, br = B(), B(), B()
    for j in range(int(math.ceil(vlen / ph - 1e-6))):
        for i in range(int(math.ceil(ulen / pw - 1e-6))):
            for u0, u1, v0, v1 in subs([(i * pw + g, min(ulen, (i + 1) * pw) - g, j * ph + g, min(vlen, (j + 1) * ph) - g)], [(a - .02, b + .02, c - .02, d + .02) for a, b, c, d in holes]):
                low = split is not None and (v0 + v1) / 2 < split
                abox(bl if low else bu, u1 - u0, v1 - v0, pd, M0 @ Matrix.Translation(((u0 + u1) / 2, (v0 + v1) / 2, -pd / 2 + .001)), bev=.006)
                if rivets and u1 - u0 > .2 and v1 - v0 > .2:
                    for ru, rv in ((u0 + .05, v0 + .05), (u1 - .05, v0 + .05), (u0 + .05, v1 - .05), (u1 - .05, v1 - .05)):
                        alathe(br, [(.013, 0), (.011, -.008), (.005, -.012)], 8, M0 @ Matrix.Translation((ru, rv, -pd)))
    obj(name + '_panels', bu, cols[0])
    if split is not None: obj(name + '_panels_low', bl, cols[1])
    if rivets: obj(name + '_rivets', br, rivets, smooth=True)
def dots(name, x0, x1, y0, y1, z, pitch, r, h, m):
    bm = B(); nx, ny = int((x1 - x0) / pitch), int((y1 - y0) / pitch)
    for i in range(nx):
        for j in range(ny):
            cx, cy = x0 + (i + .5) * pitch, y0 + (j + .5) * pitch; a = [bm.verts.new((cx + r * math.cos(k * math.pi / 3), cy + r * math.sin(k * math.pi / 3), z)) for k in range(6)]
            t = [bm.verts.new((cx + r * .8 * math.cos(k * math.pi / 3), cy + r * .8 * math.sin(k * math.pi / 3), z + h)) for k in range(6)]
            for k in range(6): bm.faces.new((a[k], a[(k + 1) % 6], t[(k + 1) % 6], t[k]))
            bm.faces.new(t)
    return obj(name, bm, m)

# ================================================================== D. SHIP CABIN, DAY (back wall y WY, floor z 0, camera on -y)
WY, CX0, CX1, CTOP = 1.5, -3.2, 3.2, 5.9
RAIL_Z, QUILT_TOP = 1.47, 1.44          # teal rail band 1.27-1.41 (inventory 1.0 m x 1.55; frame f330: 1.54 m above the floor at the wall, rail centre)
MON = dict(x=0., z=3.60, w=1.40, h=2.50)       # monitor outer frame (f330: 190 px of 540 wide, y 35-365 of 960 with the camera at 6.1 m)
PICW, PICH = 1.26, 2.24                          # cabin_monitor_pic = 9:16 portrait
HATCH = dict(x=1.95, z=1.68, w=.92, h=2.30, r=.42, t=.16)   # rounded-top hatch at the right edge of the back wall (f330 x 430-540 px)
UP0 = RAIL_Z + .15
panels('cabin_wall_upper', (CX1, WY, UP0), (-1, 0, 0), (0, 0, 1), CX1 - CX0, CTOP - UP0, [], pw=.85, ph=.62, g=.02)
# quilted lower wall: diagonal diamond grid, each diamond padded (light centre, dark groove), a small button at the crossings
QS = .19; bq, bbut = B(), B()
qrows = int(QUILT_TOP / (QS / 2)) + 2; qcols = int((CX1 - CX0) / QS) + 2
for j in range(qrows):
    for i in range(qcols):
        cx, cz = CX0 + i * QS + (j % 2) * QS / 2, j * QS / 2
        if cz > QUILT_TOP - QS * .25: continue
        h = QS / 2; o = Vector((cx, WY, cz)); ring = []
        outer = [o + Vector(p) for p in ((-h, 0, 0), (0, 0, -h), (h, 0, 0), (0, 0, h))]
        mid = [o + Vector((p[0] * .62, -.022, p[2] * .62)) for p in ((-h, 0, 0), (0, 0, -h), (h, 0, 0), (0, 0, h))]
        top = bq.verts.new(o + Vector((0, -.03, 0)))
        vo = [bq.verts.new(p) for p in outer]; vm = [bq.verts.new(p) for p in mid]
        for k in range(4):
            k2 = (k + 1) % 4; bq.faces.new((vo[k], vo[k2], vm[k2], vm[k])); bq.faces.new((vm[k], vm[k2], top))
        alathe(bbut, [(.011, -.002), (.009, -.012), (.004, -.016)], 6, MF(o + Vector((-h, 0, 0)), (1, 0, 0), (0, 0, 1), (0, 1, 0)))
for f in bq.faces: f.normal_update()
obj('cabin_quilt', bq, mat('quilt', rough=.95), smooth=True); obj('cabin_quilt_buttons', bbut, mat('quilt_button'), smooth=True)
box('cabin_quilt_backing', (CX1 - CX0, .1, QUILT_TOP + .1), ((CX0 + CX1) / 2, WY + .05, QUILT_TOP / 2), mat('quilt_button'), bev=0)
box('cabin_rail_teal', (CX1 - CX0, .07, .14), ((CX0 + CX1) / 2, WY - .035, RAIL_Z + .04), mat('rail_teal', rough=.5), bev=.012)
box('cabin_rail_orange', (CX1 - CX0, .03, .022), ((CX0 + CX1) / 2, WY - .015, RAIL_Z + .135), mat('rail_orange', rough=.6), bev=0)
# floor: light grey-beige rubber + regular dot grid (inventory 2 cm dots at 5 cm pitch, x 1.55)
box('cabin_floor', (CX1 - CX0 + 1, WY + 7, .1), ((CX0 + CX1) / 2, WY - (WY + 7) / 2 + .0, -.05), mat('floor_rubber'), bev=0)
dots('cabin_floor_dots', -3.0, 3.0, -2.6, WY, 0., .11, .03, .01, mat('floor_dot', rough=.7))
# ceiling slopes at the top corners (A-shape seen at the top of f330) + 2 roof brace tubes from the upper corners toward the centre top
bm = B()
for s in (1, -1): abox(bm, 2.6, 7.5, .12, MT((s * 2.55, WY - 3.7, CTOP + .6), (0, s * 38, 0)), bev=0)
abox(bm, 2.4, 7.5, .12, MT((0, WY - 3.7, CTOP + 1.38)), bev=0); obj('cabin_ceiling', bm, mat('ceiling'))
bm = B()
for s in (1, -1):
    atube(bm, [(s * 2.75, WY - .12, 4.55), (s * .7, WY - .12, 6.6)], .045, 12)
    for p in ((s * 2.75, WY - .06, 4.55),): abox(bm, .14, .1, .14, MT(p), bev=.015)
obj('cabin_roof_braces', bm, mat('roof_brace', rough=.6), smooth=True)
bm = B(); abox(bm, 8.4, 10.5, .2, MT((0, WY - 4.6, CTOP + 1.6)), bev=0)
for s in (1, -1): abox(bm, .2, 10.5, CTOP + 1.8, MT((s * 3.45, WY - 4.6, (CTOP + 1.8) / 2)), bev=0)
abox(bm, 8.4, .2, CTOP + 1.8, MT((0, WY - 9.8, (CTOP + 1.8) / 2)), bev=0); abox(bm, 8.4, .2, CTOP + 1.8, MT((0, WY + .35, (CTOP + 1.8) / 2)), bev=0); obj('cabin_shell', bm, mat('ceiling'))
# wall monitor: dark frame, small camera on top centre, label plate under it, green LED bottom right, the picture plane fed by the stretch builder
MY = WY - .045
box('cabin_monitor_frame', (MON['w'], .09, MON['h']), (MON['x'], MY, MON['z']), mat('screen_frame', rough=.45), bev=.02)
bm = B(); abox(bm, .16, .1, .08, MT((0, 0, 0)), bev=.012); acyl(bm, .025, .03, MT((0, -.06, 0), (90, 0, 0)), 12); obj('cabin_monitor_cam', bm, mat('screen_frame'), (MON['x'], MY - .01, MON['z'] + MON['h'] / 2 + .05), smooth=False)
PIC_Y = MY - .046
pic('cabin_monitor_pic', PICW, PICH, (MON['x'], PIC_Y, MON['z'] + .02), (90, 0, 0), 'monitor_placeholder.png', emit=True, mover={})
box('cabin_monitor_label_plate', (.95, .03, .13), (MON['x'] - .1, MY - .06, MON['z'] - MON['h'] / 2 - .03), mat('label_plate'), bev=.008)
pic('cabin_monitor_label', .92, .11, (MON['x'] - .1, MY - .076, MON['z'] - MON['h'] / 2 - .03), (90, 0, 0), 'label_link.png')
bm = B(); acyl(bm, .014, .01, MT((0, 0, 0), (90, 0, 0)), 10); obj('cabin_monitor_led', bm, mat('led_green', emit=PAL['led_green'], es=4.), (MON['x'] + MON['w'] / 2 - .07, PIC_Y - .002, MON['z'] - MON['h'] / 2 + .045))
# HEAD sign right of the monitor, above the hatch
box('cabin_head_sign_back', (.52, .025, .68), (1.58, WY - .045, 3.35), mat('head_gold', rough=.5), bev=.006)
pic('cabin_head_sign', .48, .64, (1.58, WY - .059, 3.35), (90, 0, 0), 'sign_head.png')
# hatch door (right): thick dark frame, teal leaf with a cyan sheen, round porthole with a bolted ring, long brown lever
MH = MF((HATCH['x'], WY - .1, HATCH['z']), (1, 0, 0), (0, 0, 1), (0, -1, 0))
bm = B(); arring(bm, HATCH['w'], HATCH['h'], HATCH['r'], HATCH['t'], .2, MH, lip=.04); obj('cabin_hatch_frame', bm, mat('hatch_frame', rough=.4), smooth=True)
bm = B(); arrplate(bm, HATCH['w'] + .02, HATCH['h'] + .02, HATCH['r'], .05, MF((HATCH['x'], WY - .08, HATCH['z']), (1, 0, 0), (0, 0, 1), (0, -1, 0)))
obj('cabin_hatch_leaf', bm, mat('hatch_teal', rough=.25, coat=.5, emit=PAL['hatch_sheen'], es=.25))
bm = B(); arring(bm, .34, .34, .17, .06, .07, MF((HATCH['x'], WY - .11, HATCH['z'] + .5), (1, 0, 0), (0, 0, 1), (0, -1, 0)), lip=.015); obj('cabin_hatch_port_ring', bm, mat('chrome', rough=.3, metal=.8), smooth=True)
bm = B(); acyl(bm, .17, .01, MT((0, 0, 0), (90, 0, 0)), 24); obj('cabin_hatch_port_glass', bm, mat('hatch_glass', rough=.1, emit=PAL['hatch_glass'], es=.6), (HATCH['x'], WY - .1, HATCH['z'] + .5))
bm = B(); acyl(bm, .022, .7, None, 10); abox(bm, .07, .06, .1, MT((0, .03, -.33)), bev=.01); obj('cabin_hatch_lever', bm, mat('lever_brown', rough=.5), (HATCH['x'] - .3, WY - .15, HATCH['z'] - .05), (0, 0, 0), smooth=True)
# stowage bags strapped to the upper wall (soft duffels, 2 grey straps, white label patch)
def duffel(name, col, loc, L=.70, R=.23):
    body = B(); alathe(body, [(R * .55, -L / 2), (R * .92, -L / 2 + .05), (R, -L / 2 + .14), (R, L / 2 - .14), (R * .92, L / 2 - .05), (R * .55, L / 2)], 20, MT((0, 0, 0), (0, 90, 0)), ey=.85)
    st = B()
    for s in (-1, 1): alathe(st, [(R + .012, s * L * .28 - .025), (R + .012, s * L * .28 + .025)], 20, MT((0, 0, 0), (0, 90, 0)), ey=.86)
    lb = B(); aquad(lb, .17, .11, MT((0, -R * .86 - .006, .03), (90, 0, 0)))
    o = multi(name, [(body, mat(col, rough=.9)), (st, mat('strap_grey'))], loc, smooth=True)
    pic(name + '_label', .17, .11, (loc[0], loc[1] - R * .86 - .008, loc[2] + .03), (90, 0, 0), 'bag_label.png')
    return o
duffel('cabin_bag_blue', 'bag_blue', (-1.43, WY - .22, 4.32)); duffel('cabin_bag_orange', 'bag_orange', (.88, WY - .24, 4.32)); duffel('cabin_bag_red', 'bag_red', (-2.35, WY - .22, 4.0))
# galley table (left edge): black round top on one pole and disc foot, red bottle, yellow block, tray; grey box on a shelf; drawer block with 4 labels
GX, GY = -1.75, .55; GT = 1.15
bm = B(); acyl(bm, .45, .05, MT((0, 0, GT)), 32); acyl(bm, .035, GT - .04, MT((0, 0, GT / 2)), 12); acyl(bm, .26, .03, MT((0, 0, .015)), 24); obj('cabin_table', bm, mat('table_black', rough=.4), (GX, GY, 0), smooth=True)
bm = B(); alathe(bm, [(.04, 0), (.045, .02), (.045, .16), (.02, .2), (.012, .25)], 12); obj('cabin_bottle', bm, mat('bottle_red', rough=.35), (GX + .25, GY - .12, GT + .025), smooth=True)
box('cabin_block', (.1, .08, .07), (GX + .05, GY - .2, GT + .06), mat('block_yellow'), bev=.01)
box('cabin_tray', (.3, .2, .02), (GX - .1, GY + .05, GT + .035), mat('table_brown'), bev=.006)
box('cabin_shelf', (.8, .45, .05), (GX - .45, WY - .23, 1.6), mat('table_brown'), bev=.01)
box('cabin_oven', (.55, .4, .35), (GX - .5, WY - .23, 1.8), mat('oven_grey', rough=.5), bev=.02)
box('cabin_oven_door', (.36, .02, .22), (GX - .54, WY - .44, 1.8), mat('table_black', rough=.3), bev=.006)
box('cabin_drawers', (.6, .4, .75), (GX - .45, WY - .25, .9), mat('table_black', rough=.5), bev=.015)
for k, nm in enumerate(('drawer_mac', 'drawer_beef', 'drawer_coffee', 'drawer_beans')):
    pic('cabin_' + nm, .12, .08, (GX - .67 + k * .145, WY - .452, 1.15 - (k % 2) * .12), (90, 0, 0), nm + '.png')
# hand props (movers): magazine MEGA SIP with a black straw (new guy), drink ball + straw (commander), clipboard + pencil (navigator)
mg, mp, ms = B(), B(), B(); abox(mg, .26, .014, .34, bev=.004); aquad(mp, .25, .325, MT((0, -.0075, 0), (90, 0, 0))); atube(ms, [(.06, -.01, .16), (.07, -.02, .32), (-.04, -.15, .55)], .006, 8)
multi('magazine', [(mg, mat('magazine', rough=.6)), (mp, mat('magazine_cover', png='magazine_cover.png', rough=.6)), (ms, mat('straw_black'))], (.08, .55, 1.28), (0, 0, -8), mover={})
dr, dw, dsr = B(), B(), B(); asph(dr, .075, u=18, v=12, sz=1.); asph(dw, .0755, MT((0, 0, -.002)), u=18, v=12, sz=.35)
atube(dsr, [(0, 0, .07), (.02, -.02, .2), (.08, -.06, .26)], .007, 8)
multi('drink_ball', [(dr, mat('drink_red', rough=.35)), (dw, mat('drink_white', rough=.35)), (dsr, mat('drink_white'))], (-.82, .5, 1.92), smooth=True, mover={})
cb, cp, cc = B(), B(), B(); abox(cb, .24, .012, .32, bev=.004); aquad(cp, .2, .26, MT((0, -.0065, -.015), (90, 0, 0))); abox(cc, .09, .02, .03, MT((0, -.01, .15)), bev=.004)
multi('clipboard', [(cb, mat('clipboard', rough=.6)), (cp, mat('clipboard_grid', png='clipboard_grid.png', rough=.9)), (cc, mat('chrome', rough=.3, metal=.8))], (1.32, .52, 1.4), (0, 0, 12), mover={})
pn, pt = B(), B(); acyl(pn, .006, .17, MT((0, 0, 0), (0, 90, 0)), 6); alathe(pt, [(.006, .085), (.0, .11)], 6, MT((0, 0, 0), (0, 90, 0)))
multi('pencil', [(pn, mat('pencil', rough=.6)), (pt, mat('table_brown'))], (1.12, .52, 2.03), (0, 0, 5), mover={})

# ================================================================== E. SLEEP BAY, NIGHT (bag wall y BY facing -y, end wall x EX facing -x, door to the toilet room)
BX, BY, VH = -12., 1.2, 3.3                    # VH: the side wall goes straight up to 2.5 m, then leans in (slanted roof with 2 skylights)
XL, EX = BX - 3.1, BX + 2.15                    # the bag wall runs x XL..EX, and EX is the corner with the end wall
BAGS = {'bag_navigator': (BX - 1.65, 'bag_teal'), 'bag_commander': (BX + .05, 'bag_blue_sleep'), 'bag_new_guy': (BX + 1.45, 'bag_green')}
PORTS = [BX - .85, BX + .85]; PW_, PH_, PZ = .70, 1.08, 1.55
SKY = [BX - .85, BX + .75]; SKW, SKH, SKV = .78, 1.24, 1.25
SL = Vector((0, -math.sqrt(.5), math.sqrt(.5))); SLEN = 2.4
def hole_x(xc, w, zc, h): return (EX - xc - w / 2, EX - xc + w / 2, zc - h / 2, zc + h / 2)
panels('bay_wall', (EX, BY, 0), (-1, 0, 0), (0, 0, 1), EX - XL, VH, [hole_x(x, PW_ + .2, PZ, PH_ + .2) for x in PORTS], pw=.93, ph=.70, cols=('bay_wall', 'bay_lower'), split=.62,
       rivets=mat('bay_rivet', rough=.35, metal=.5), seam='bay_seam')
SO = Vector((EX, BY, VH))
panels('bay_slant', SO, (-1, 0, 0), SL, EX - XL, SLEN, [hole_x(x, SKW + .16, SKV, SKH + .16) for x in SKY], pw=.93, ph=.70, cols=('bay_wall', 'bay_wall'), rivets='bay_rivet', seam='bay_seam')
TOPZ = VH + SLEN * SL.z; TOPY = BY + SLEN * SL.y
box('bay_ceiling', (EX - XL + .4, 5., .12), ((EX + XL) / 2, TOPY - 2.5, TOPZ + .06), mat('bay_seam'), bev=0)
# skylights: rounded-rectangle frames on the slant, 4 panes each (cross mullion), the night sky glowing behind
for k, x in enumerate(SKY):
    c = SO + Vector((0, 0, 0)) + SL * SKV; c = Vector((x, c.y, c.z)); N = Vector((0, 1, 1)).normalized()
    M = MF(c, (1, 0, 0), SL, N)
    bm = B(); arring(bm, SKW, SKH, .14, .07, .16, M @ Matrix.Translation((0, 0, .02)), lip=.025)
    abox(bm, .035, SKH, .05, M @ Matrix.Translation((0, 0, .06)), bev=0); abox(bm, SKW, .035, .05, M @ Matrix.Translation((0, 0, .06)), bev=0)
    obj('bay_skylight_frame_%d' % (k + 1), bm, mat('porthole_frame', rough=.5), smooth=True)
    bm = B(); aquad(bm, SKW + .1, SKH + .1, M @ Matrix.Translation((0, 0, .14)) @ Matrix.Rotation(math.pi, 4, 'X'))
    obj('bay_skylight_glow_%d' % (k + 1), bm, mat('skylight', emit=PAL['skylight'], es=.75))
# portholes between the bags: thick frame, stars behind, a small latch plate in the middle of the glass
for k, x in enumerate(PORTS):
    M = MF((x, BY - .02, PZ), (1, 0, 0), (0, 0, 1), (0, 1, 0))
    bm = B(); arring(bm, PW_, PH_, .2, .1, .22, M, lip=.035); obj('bay_porthole_frame_%d' % (k + 1), bm, mat('porthole_frame', rough=.45), smooth=True)
    pic('bay_porthole_stars_%d' % (k + 1), PW_ + .1, PH_ + .1, (x, BY + .14, PZ), (90, 0, 0), 'porthole_stars.png', emit=True)
    box('bay_porthole_latch_%d' % (k + 1), (.1, .02, .06), (x, BY + .03, PZ), mat('headrest', rough=.4), bev=.006)
# bag rail (chrome) with standoffs, 2 hooks per bag
RZ = 2.42
bm = B(); acyl(bm, .018, EX - XL - .6, MT(((EX + XL) / 2, BY - .09, RZ), (0, 90, 0)), 10)
for x in (XL + .5, (EX + XL) / 2, EX - .5): abox(bm, .04, .09, .04, MT((x, BY - .045, RZ)), bev=.008)
obj('bay_rail', bm, mat('chrome', rough=.2, metal=1.), smooth=True)
# sleeping bags: each one object hung from its hooks (origin = the hook point, so a sway turns it about the rail); colour body, lighter collar,
# headrest pad with a black strap, black zip line down the middle. bag_new_guy (full) and bag_new_guy_open (empty, flap open) swap by state.
BAGW, BAGLEN = .78, 1.45
HOOK_Y, HOOK_Z = BY - .06, RZ + .02             # bag origin = the hook point on the rail
CARD_Y, COLLAR_Z, HEAD_Z = 1.0, 2.05, 2.32       # stager's fit: sleepers' head centres z 2.24-2.40 on the plane y 1.0; the collar opening sits just under the head
T, YC = COLLAR_Z - HOOK_Z, CARD_Y - HOOK_Y       # collar height and card plane, local to the hook
def ahalf(bm, prof, seg, M, ey, a0, a1):
    """part of a lathe (open strip) between angles a0..a1 (radians) round local Z, rows (radius, z)."""
    rings = [[bm.verts.new(M @ Vector((math.cos(a0 + (a1 - a0) * k / seg) * p[0], math.sin(a0 + (a1 - a0) * k / seg) * p[0] * ey, p[1]))) for k in range(seg + 1)] for p in prof]
    for a, b in zip(rings, rings[1:]):
        for k in range(seg): bm.faces.new((a[k], a[k + 1], b[k + 1], b[k]))
def folds(bm):
    for v in bm.verts:      # broad soft folds: a slow wave round the bag that drifts with height (no texture, geometry only)
        k = 1 + .07 * math.sin(3 * math.atan2(v.co.x, v.co.y - YC) + 3.5 * v.co.z) + .04 * math.sin(5.5 * v.co.z); v.co.x *= k; v.co.y = YC + (v.co.y - YC) * k
R = BAGW / 2; EY = .42
PROF = [(R * .62, T - BAGLEN), (R * .9, T - BAGLEN + .12), (R, T - BAGLEN + .4), (R * .98, T - .35), (R * .92, T)]
MB = MT((0, YC, 0))
def pad_parts():
    head, strap = B(), B()
    abox(head, .5, .08, .4, MT((0, YC + R * EY - .02, T + .2)), bev=.035)                  # headrest pad behind the head (between the card plane and the wall)
    abox(strap, .52, .09, .045, MT((0, YC + R * EY - .02, T + .26)), bev=.005)
    for s in (1, -1): acyl(strap, .014, abs(T + .4) + .04, MT((s * .2, YC + R * EY - .02, (T + .4) / 2)), 8)   # hook straps up to the rail
    return head, strap
for n, (x, col) in BAGS.items():
    body, collar, opening, zipl = B(), B(), B(), B()
    alathe(body, PROF, 24, MB, ey=EY, caps=False); folds(body)
    alathe(collar, [(R * .86, T - .05), (R * .97, T - .02), (R * .97, T + .03), (R * .84, T + .04)], 24, MB, ey=EY + .02)
    alathe(opening, [(R * .84, T - .01), (R * .84, T)], 24, MB, ey=EY - .03)                 # the collar opening round the head: dark ellipse
    abox(zipl, .012, .02, BAGLEN - .45, MT((0, YC - R * EY - .006, T - BAGLEN / 2 - .1)), bev=0)
    hd, st = pad_parts()
    multi(n, [(body, mat(col, rough=.75, emit=PAL['bag_green_rim'], es=.12) if col == 'bag_green' else mat(col, rough=.75)), (collar, mat(col + '_collar', col=PAL['bag_green_lining'] if col == 'bag_green' else PAL['headrest'], rough=.8)),
              (hd, mat('headrest', rough=.8)), (st, mat('strap_black')), (opening, mat('strap_black')), (zipl, mat('strap_black'))], (x, HOOK_Y, HOOK_Z), smooth=True,
          mover={'sway_deg': 2.5, 'head': [x, CARD_Y, HEAD_Z], 'card_y': CARD_Y, 'collar_z': COLLAR_Z})
# the empty green bag, peeled open: back half shows the light lining, lower front stays, the upper front flap hangs down folded over it
back, low, flap, collar = B(), B(), B(), B()
ahalf(back, PROF, 14, MB, EY, 0, math.pi); folds(back)
MID = T - BAGLEN * .5
ahalf(low, [p for p in PROF if p[1] <= MID] + [(R, MID)], 14, MB, EY, math.pi, 2 * math.pi); folds(low)
FL = [(R, MID), (R * .98, T - .35), (R * .92, T)]
HINGE = Vector((0, YC - R * EY, MID))
ahalf(flap, FL, 14, Matrix.Translation(HINGE) @ Matrix.Rotation(math.radians(-165), 4, 'X') @ Matrix.Translation(-HINGE) @ MB, EY, math.pi, 2 * math.pi)
ahalf(collar, [(R * .86, T - .05), (R * .97, T - .02), (R * .97, T + .03), (R * .84, T + .04)], 14, MB, EY + .02, 0, math.pi)
hd, st = pad_parts()
multi('bag_new_guy_open', [(back, mat('bag_green_lining', rough=.8)), (low, mat('bag_green')), (flap, mat('bag_green')), (collar, mat('bag_green_collar')), (hd, mat('headrest')), (st, mat('strap_black'))],
      (BAGS['bag_new_guy'][0], HOOK_Y, HOOK_Z), smooth=True, mover={'sway_deg': 2.5, 'head': [BAGS['bag_new_guy'][0], CARD_Y, HEAD_Z], 'card_y': CARD_Y, 'collar_z': COLLAR_Z})
# kid drawing "MY DAD" taped above the commander's bag
pic('bay_kid_drawing', .39, .31, (BX + .55, BY - .045, RZ - .1), (90, 0, 3), 'kid_drawing_dad.png')
bm = B()
for dx, dz in ((-.17, .13), (.17, .13)): abox(bm, .08, .004, .03, MT((dx, -.002, dz), (0, 30 if dx < 0 else -30, 0)), bev=0)
obj('bay_kid_drawing_tape', bm, mat('paper', rough=.9), (BX + .55, BY - .05, RZ - .1))
# end wall (smooth blue, vertical panel lines) with the rounded doorway, chrome grab bar left of it, chrome rail + black sign plate above
DOOR = dict(y=-1.15, z=1.2, w=1.08, h=2.3, r=.32, t=.13)
panels('bay_end', (EX, -3.6, 0), (0, 1, 0), (0, 0, 1), BY + 3.6, TOPZ + .1, [(DOOR['y'] + 3.6 - DOOR['w'] / 2 - .02, DOOR['y'] + 3.6 + DOOR['w'] / 2 + .02, DOOR['z'] - DOOR['h'] / 2, DOOR['z'] + DOOR['h'] / 2)],
       pw=.62, ph=TOPZ + .2, cols=('end_wall', 'end_wall'), rivets=None, seam='door_frame_dark', thick=.3, g=.008, pd=.02)
for m in ('end_wall',): bpy.data.materials[m].node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value = .35
MD = MF((EX - .02, DOOR['y'], DOOR['z']), (0, 1, 0), (0, 0, 1), (1, 0, 0))
bm = B(); arring(bm, DOOR['w'], DOOR['h'], DOOR['r'], DOOR['t'], .36, MD, lip=.04); obj('bay_door_frame', bm, mat('door_frame_dark', rough=.35), smooth=True)
bm = B(); arrplate(bm, DOOR['w'] + .04, DOOR['h'] + .04, DOOR['r'], .04, MF((0, 0, 0), (0, 1, 0), (0, 0, 1), (1, 0, 0)))
obj('bay_door', bm, mat('end_wall'), (EX + .12, DOOR['y'], DOOR['z']), mover={'open': {'loc': [EX + .12, DOOR['y'] - 1.25, DOOR['z']], 'rot': [0, 0, 0]}})
bm = B(); acyl(bm, .02, 1.9, MT((0, 0, 0)), 10)
for s in (1, -1): abox(bm, .1, .04, .04, MT((.05, 0, s * .9)), bev=.008)
obj('bay_grab_bar', bm, mat('chrome'), (EX - .1, DOOR['y'] + DOOR['w'] / 2 + .17, 1.2), smooth=True)
bm = B(); acyl(bm, .016, .8, MT((0, 0, 0), (90, 0, 0)), 10)
for s in (1, -1): abox(bm, .1, .04, .04, MT((.05, s * .34, 0)), bev=.008)
obj('bay_door_rail', bm, mat('chrome'), (EX - .1, DOOR['y'] + .2, DOOR['z'] + DOOR['h'] / 2 + .28), smooth=True)
box('bay_door_sign', (.03, .5, .13), (EX - .02, DOOR['y'] - .05, DOOR['z'] + DOOR['h'] / 2 + .45), mat('sign_black', rough=.4), bev=.006)
pic('bay_door_sign_text', .48, .12, (EX - .037, DOOR['y'] - .05, DOOR['z'] + DOOR['h'] / 2 + .45), (90, 0, -90), 'sign_bay_door.png')
box('bay_corner_post', (.16, .16, TOPZ), (EX - .06, BY - .06, TOPZ / 2), mat('door_frame_dark', rough=.4), bev=.03)
# floor: dark perforated grate + one flush round floor light near the door
box('bay_floor', (EX - XL + 1, 6, .1), ((EX + XL) / 2, BY - 3, -.05), mat('bay_floor', rough=.5), bev=0)
dots('bay_floor_holes', XL + 1.2, EX, -3.4, BY, .0, .085, .012, .002, mat('grate_hole'))
bm = B(); alathe(bm, [(.13, 0), (.13, .01), (.1, .012)], 24); obj('bay_floor_light_ring', bm, mat('chrome'), (EX - .55, DOOR['y'] + .1, 0), smooth=True)
bm = B(); acyl(bm, .1, .014, None, 24); obj('bay_floor_light', bm, mat('floor_light', emit=PAL['floor_light'], es=12.), (EX - .55, DOOR['y'] + .1, .005))
# the toilet room beyond the door: checker floor, dark room walls, a pale toilet lit by its own lamp
TT = .4; bw, bk = B(), B()
for i in range(7):
    for j in range(8):
        abox(bw if (i + j) % 2 else bk, TT, TT, .02, MT((EX + .05 + i * TT + TT / 2, DOOR['y'] - 1.6 + j * TT + TT / 2, -.01)), bev=0)
obj('bay_toilet_tiles_light', bw, mat('tile_white', rough=.3)); obj('bay_toilet_tiles_dark', bk, mat('tile_black', rough=.3))
bm = B(); abox(bm, .2, 3.4, 3., MT((EX + 2.95, DOOR['y'], 1.5)), bev=0); abox(bm, 2.9, .2, 3., MT((EX + 1.5, DOOR['y'] - 1.7, 1.5)), bev=0); abox(bm, 2.9, .2, 3., MT((EX + 1.5, DOOR['y'] + 1.7, 1.5)), bev=0)
abox(bm, 2.9, 3.4, .2, MT((EX + 1.5, DOOR['y'], 3.0)), bev=0); obj('bay_toilet_room', bm, mat('toilet_room', rough=.7))
bm = B(); alathe(bm, [(.17, 0), (.2, .25), (.27, .42), (.26, .46)], 20, ey=.85); abox(bm, .22, .5, .4, MT((.3, 0, .62)), bev=.03)
obj('bay_toilet', bm, mat('porcelain', rough=.15, coat=.5), (EX + 1.9, DOOR['y'] - .55, 0), (0, 0, 0), smooth=True)
# floating things (movers): rolled white tube with a red end, a small red book, a red crisp bag, a white-red striped strip, a blue pen
bm, br_ = B(), B(); acyl(bm, .035, .22, None, 12); acyl(br_, .037, .04, MT((0, 0, .12)), 12)
multi('float_tube', [(bm, mat('tube_white', rough=.6)), (br_, mat('tube_red', rough=.6))], (BX - 1.0, BY - .7, 3.35), (35, 20, 60), smooth=True, mover={})
bk_, bp = B(), B(); abox(bk_, .17, .03, .23, bev=.006); abox(bp, .155, .024, .215, MT((.01, 0, 0)), bev=0)
multi('float_book', [(bk_, mat('book_red', rough=.6)), (bp, mat('paper'))], (BX + .45, BY - .9, 3.2), (20, 15, 30), mover={})
cr = B(); alathe(cr, [(.0, -.13), (.09, -.12), (.1, .0), (.09, .12), (.0, .13)], 12, ey=.3); cf = B(); aquad(cf, .17, .2, MT((0, -.031, 0), (90, 0, 0)))
multi('float_crisps', [(cr, mat('crisp_red', rough=.4)), (cf, mat('crisp_bag', png='crisp_bag.png', rough=.4))], (BX + 1.05, BY - .35, 1.2), (0, 0, -15), smooth=True, mover={})
sw, sr_ = B(), B()
for k in range(6): abox(sw if k % 2 == 0 else sr_, .04, .005, .05, MT((k * .04 - .1, 0, 0)), bev=0)
multi('float_strip', [(sw, mat('strip_white')), (sr_, mat('tube_red'))], (BX + .85, BY - .4, .85), (10, 0, 25), mover={})
pe = B(); acyl(pe, .007, .15, MT((0, 0, 0), (0, 90, 0)), 8); obj('float_pen', pe, mat('pen_blue', rough=.4), (BX - 1.2, BY - .6, 1.0), (0, 30, 10), smooth=True, mover={})

# ================================================================== STAND-IN CARDS (excluded from the GLB) and LIGHTS
def standin(name, col, h, loc, rz=0):
    bm = B(); abox(bm, .5, .012, .74, MT((0, 0, h - .62 - .30)), bev=0); acyl(bm, .31, .012, MT((0, -.01, h - .31), (90, 0, 0)), 24)
    for s in (1, -1): abox(bm, .03, .012, h - 1.25, MT((s * .1, 0, (h - 1.25) / 2)), bev=0)
    o = obj(name, bm, mat('si_' + name, col=col, rough=1.), loc, (0, 0, rz), c=STAND)
    o.data.materials.append(mat('standin_head', rough=1.))
    for f in o.data.polygons:
        if f.center.z > h - .63: f.material_index = 1
    return o
SI = [('standin_commander_4', 'standin_commander', 1.76, (-1.05, .7, .75), ['4', '4a']), ('standin_newguy_4', 'standin_newguy', 1.70, (0., .7, .5), ['4']),
      ('standin_navigator_4', 'standin_navigator', 1.66, (1.22, .7, .85), ['4', '4a']), ('standin_newguy_4a', 'standin_newguy', 1.70, (0., .55, .3), ['4a']),
      ('standin_navigator_5', 'standin_navigator', 1.66, (BAGS['bag_navigator'][0], CARD_Y, HEAD_Z + .31 - 1.66), ['5a', '5b', '5c']),
      ('standin_commander_5', 'standin_commander', 1.76, (BAGS['bag_commander'][0], CARD_Y, HEAD_Z + .31 - 1.76), ['5a', '5b', '5c']),
      ('standin_newguy_5bag', 'standin_newguy', 1.70, (BAGS['bag_new_guy'][0], CARD_Y, HEAD_Z + .31 - 1.70), ['5a']),
      ('standin_newguy_5out', 'standin_newguy', 1.70, (BAGS['bag_new_guy'][0] + .45, BY - .65, 1.05), ['5b']),
      ('standin_newguy_5door', 'standin_newguy', 1.70, (EX - 1.0, -.35, .55), ['5c'])]
STANDINS = {}
for n, c, h, p, tags in SI: standin(n, PAL[c], h, p, -40 if n.endswith('door') else 0); STANDINS[n] = tags
def light(name, loc, col, watts, radius=.1, kind='POINT', aim=None, spot=None):
    d = bpy.data.lights.new(name, kind); d.color = col; d.energy = watts
    if kind == 'SUN': d.angle = math.radians(radius)
    else: d.shadow_soft_size = radius
    if kind == 'AREA': d.size = radius
    o = bpy.data.objects.new(name, d); o.location = loc; LIGHTS.objects.link(o)
    if aim: o.rotation_euler = (Vector(aim) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler()
    if spot: d.spot_size = math.radians(spot); d.spot_blend = .6
    return o
# day: one hard key from the front, high, slightly right of the camera (shadows down-left on the quilt and the floor); a faint warm bounce
light('key_day', (6.0, -6.0, 8.0), (1., .97, .92), 4.2, .6, 'SUN', aim=(0, 1.5, 0))
light('fill_day', (3.0, -3.0, 4.5), (1., .85, .7), 0, 2., 'AREA', aim=(0, 1.5, 1.2))
light('key_floor', (1.45, 1.3, 5.0), (1., .97, .92), 0, .05, 'SPOT', aim=(-.9, -1.2, 0), spot=150)
# night: warm reading-light pools on the wall panels (one per panel column), cool glow under the skylights, front fill on the bags, end wall wash, floor light, toilet room lamp
for k in range(6):
    x = XL + .5 + k * .93; light('pool_%d' % (k + 1), (x, BY - .5, 3.7), (1., .45, .15), 0, .05, 'SPOT', aim=(x, BY, 2.95), spot=40)
for k, x in enumerate(SKY): light('sky_glow_%d' % (k + 1), (x, BY - 1.3, 4.2), (.25, .35, 1.), 0, 1., 'AREA', aim=(x, BY - 1.3, 0))
light('bag_fill', (BX - .2, -3.0, 1.9), (.45, .55, 1.), 0, 2.5, 'AREA', aim=(BX - .2, BY, 1.5))
light('end_wash', (EX - 2.6, -2.6, 2.6), (.2, .3, 1.), 0, 2., 'AREA', aim=(EX, -.6, 1.6))
light('floor_light_glow', (EX - .55, DOOR['y'] + .1, .12), (1., .98, .85), 0, .06)
light('toilet_room_lamp', (EX + 1.4, DOOR['y'] - .2, 2.6), (.7, .85, 1.), 0, .3)
w = bpy.data.worlds.new('cabin_world'); w.use_nodes = True; SC.world = w

# ================================================================== META, RENDER SETTINGS, SAVE, GLB
ANCH.update({'cabin_wall_centre': [0, WY, 0], 'monitor': [MON['x'], PIC_Y, MON['z'] + .02], 'head_sign': [1.58, WY, 3.35], 'hatch': [HATCH['x'], WY - .1, HATCH['z']],
             'galley_table': [GX, GY, GT], 'commander_s4': [-1.05, .7, .75], 'newguy_s4': [0, .7, .5], 'navigator_s4': [1.22, .7, .85], 'newguy_s4_f300': [0, .55, .3],
             'bay_wall_centre': [BX, BY, 0], 'bag_navigator': [BAGS['bag_navigator'][0], BY - .06, RZ + .02], 'bag_commander': [BAGS['bag_commander'][0], BY - .06, RZ + .02],
             'bag_new_guy': [BAGS['bag_new_guy'][0], BY - .06, RZ + .02], 'bay_door': [EX, DOOR['y'], 0], 'bay_floor_light': [EX - .55, DOOR['y'] + .1, 0],
             'newguy_s5_bag': [BAGS['bag_new_guy'][0], CARD_Y, HEAD_Z + .31 - 1.70], 'newguy_s5_door': [EX - 1.0, -.35, .55], 'toilet_room_beyond': [EX + 1.5, DOOR['y'], 0]})
ANCH = {k: [round(v, 4) for v in p] for k, p in ANCH.items()}
cz = MON['z'] + .02; MONPIC = {'object': 'cabin_monitor_pic', 'placeholder': 'tex/monitor_placeholder.png', 'w': PICW, 'h': PICH, 'aspect': '9:16 portrait',
     'centre': [MON['x'], round(PIC_Y, 4), cz], 'normal': [0, -1, 0], 'corners_bl_br_tr_tl': [[MON['x'] - PICW / 2, round(PIC_Y, 4), round(cz - PICH / 2, 4)], [MON['x'] + PICW / 2, round(PIC_Y, 4), round(cz - PICH / 2, 4)],
     [MON['x'] + PICW / 2, round(PIC_Y, 4), round(cz + PICH / 2, 4)], [MON['x'] - PICW / 2, round(PIC_Y, 4), round(cz + PICH / 2, 4)]], 'uv': 'u 0-1 left to right, v 0-1 bottom to top (whole quad)',
     'emission_blender': 1.0, 'shows': 'mission control live for the whole of shot 4 (f284-410); the pull-back starts at f281 from the mc place'}
VARIANTS = {'bag_new_guy': ['full'], 'bag_new_guy_open': ['empty']}
import cabin_api as api
LT = {}
for k, o in LIGHTS.objects.items():
    d = o.data; e = {'kind': d.type, 'loc': [round(v, 3) for v in o.location], 'color': [round(v, 3) for v in d.color]}
    if d.type in ('SUN', 'SPOT', 'AREA'): e['dir'] = [round(v, 4) for v in (o.matrix_world.to_3x3() @ Vector((0, 0, -1))).normalized()]
    if d.type == 'SPOT': e['spot_deg'] = round(math.degrees(d.spot_size), 1)
    if d.type == 'AREA': e['size'] = d.size
    LT[k] = e
META = {'place': 'cabin', 'units': 'Blender metres, Z up', 'rooms': {'D_cabin_day': {'x': [CX0, CX1], 'back_wall_y': WY, 'rail_z': RAIL_Z, 'top': CTOP},
        'E_sleep_bay_night': {'x': [XL, EX], 'bag_wall_y': BY, 'end_wall_x': EX, 'wall_up_to': VH, 'slant_top_z': round(TOPZ, 3), 'door': DOOR}},
        'two_rooms_note': 'D and E are two rooms (different walls in the frames). mode day = the cabin lights + warm world; night = the bay lights + deep blue world.',
        'anchors': ANCH, 'cams': PRM['cams'], 'proofs': PRM['proofs'], 'movers': MOVERS, 'variants': VARIANTS, 'standins': STANDINS, 'monitor_pic': MONPIC,
        'state_default': {'mode': 'day', 'bag_new_guy': 'full', 'door': 1, 'shot': '4', 'sway': 0},
        'lights': LT, 'light_kinds': api.LIGHTS,
        'frames': {'shot4': [284, 410], 'pull_back_from_monitor': [281, 318], 'monitor_live': [284, 410], 'magazine_toss': [392, 400], 'dissolve_4_5': [411, 422], 'shot5': [423, 494],
                   'new_guy_leaves_bag': [460, 472], 'float_to_door': [480, 494], 'red_float_drifts': [450, 480], 'dissolve_5_6': [495, 499]}, 'palette': PAL}
json.dump(META, open(os.path.join(OUT, 'cabin_meta.json'), 'w'), indent=1)
SC.render.engine = 'CYCLES'; SC.cycles.samples = 16; SC.cycles.use_denoising = True; SC.view_settings.view_transform = 'Standard'; SC.view_settings.look = 'None'
SC.render.resolution_x, SC.render.resolution_y = 540, 960; SC.cycles.max_bounces = 6
for n in ('cabin_ceiling', 'cabin_shell'): bpy.data.objects[n].visible_shadow = False
for n, st in (('key_day', 'EXCLUDE'), ('key_floor', 'INCLUDE')):      # light linking: key_day lights all but the floor, key_floor lights only the floor
    LLF = bpy.data.collections.new('ll_' + n)
    for m in ('cabin_floor', 'cabin_floor_dots'): LLF.objects.link(bpy.data.objects[m])
    bpy.data.objects[n].light_linking.receiver_collection = LLF
    for c in LLF.collection_objects: c.light_linking.link_state = st
tris = sum(len(o.data.polygons) for o in SET.objects if o.type == 'MESH')
for o in bpy.data.objects: o.select_set(False)
for o in SET.objects: o.select_set(True)
bpy.ops.export_scene.gltf(filepath=os.path.join(OUT, 'cabin_lite.glb'), use_selection=True, export_apply=True, export_yup=True, export_image_format='JPEG')
api._M.clear(); api.set_state(SC)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, 'cabin.blend'))
print('BUILT cabin: %d set objects, %d faces, %d movers' % (len(SET.objects), tris, len(MOVERS)))
