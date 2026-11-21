# Helpers for the style-test props (props-hero 2026-11-21). Importable inside any Blender 5.3 scene:
#   import sys; sys.path.insert(0, "<episode>/props"); import hose_tool as HT
#   hose, nozzle_parts = HT.make_hose([[x,y,z], ...], radii=None, coll=my_collection)   # route the hose to the kid's hands
#   HT.make_water(start, end, apex_z, coll=water_collection)                            # nozzle tip -> splash point
# make_hose returns a BEZIER curve object (bevel 11 mm, live: move its points in Blender or pass new ones);
# the brass nozzle is built at the last point, pointing along the last segment, its grip hanging down.
import bpy, bmesh, math, random
from mathutils import Vector, Matrix

def _lin(c):
    return tuple(((x + 0.055) / 1.055) ** 2.4 if x > 0.04045 else x / 12.92 for x in c)

def mat(name, color, metallic=0.0, rough=0.4, coat=0.0, coat_rough=0.03, transmission=0.0, ior=1.45,
        alpha=1.0, sss=0.0, flakes=False, noise=0.0, weave=False, pores=False, grain=False):
    """Clean Principled material; colour given in sRGB 0-1. Small texture only (recipe: simplified props)."""
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    nt = m.node_tree if m.node_tree else None
    if nt is None:
        m.use_nodes = True; nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new('ShaderNodeOutputMaterial'); b = nt.nodes.new('ShaderNodeBsdfPrincipled')
    nt.links.new(b.outputs[0], out.inputs[0])
    b.inputs['Base Color'].default_value = (*_lin(color), 1)
    b.inputs['Metallic'].default_value = metallic
    b.inputs['Roughness'].default_value = rough
    b.inputs['IOR'].default_value = ior
    b.inputs['Coat Weight'].default_value = coat
    b.inputs['Coat Roughness'].default_value = coat_rough
    b.inputs['Transmission Weight'].default_value = transmission
    b.inputs['Subsurface Weight'].default_value = sss
    if alpha < 1.0:
        b.inputs['Alpha'].default_value = alpha
    tc = nt.nodes.new('ShaderNodeTexCoord')
    bump = None
    if flakes:   # metallic flake: fine voronoi in the normal under the clearcoat
        v = nt.nodes.new('ShaderNodeTexVoronoi'); v.inputs['Scale'].default_value = 4000
        nt.links.new(tc.outputs['Object'], v.inputs['Vector'])
        bump = nt.nodes.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = 0.08
        nt.links.new(v.outputs['Distance'], bump.inputs['Height'])
    if noise or grain or weave or pores:
        if weave:
            t = nt.nodes.new('ShaderNodeTexWave'); t.inputs['Scale'].default_value = 300; t.wave_type = 'BANDS'
            st = 0.15
        elif grain:
            t = nt.nodes.new('ShaderNodeTexWave'); t.inputs['Scale'].default_value = 6; t.inputs['Distortion'].default_value = 6
            t.bands_direction = 'Z'; st = 0.12
        elif pores:
            t = nt.nodes.new('ShaderNodeTexVoronoi'); t.inputs['Scale'].default_value = 140; st = 0.6
        else:
            t = nt.nodes.new('ShaderNodeTexNoise'); t.inputs['Scale'].default_value = 60; st = noise
        nt.links.new(tc.outputs['Object'], t.inputs['Vector'])
        bump = bump or nt.nodes.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = st
        out_sock = t.outputs['Distance'] if pores else t.outputs[0]
        nt.links.new(out_sock, bump.inputs['Height'])
    if bump:
        nt.links.new(bump.outputs['Normal'], b.inputs['Normal'])
    return m

def hose_material():
    """Glossy green garden hose with a darker spiral stripe and a shallow spiral ridge (curve UV: U along, V around)."""
    m = mat("hose_green_spiral", (0.1, 0.62, 0.12), rough=0.28, coat=0.6)
    nt = m.node_tree; b = [n for n in nt.nodes if n.type == 'BSDF_PRINCIPLED'][0]
    tc = [n for n in nt.nodes if n.type == 'TEX_COORD'][0]
    sep = nt.nodes.new('ShaderNodeSeparateXYZ'); nt.links.new(tc.outputs['UV'], sep.inputs[0])
    mu = nt.nodes.new('ShaderNodeMath'); mu.operation = 'MULTIPLY'; mu.inputs[1].default_value = 260.0   # turns along the hose
    nt.links.new(sep.outputs[0], mu.inputs[0])
    ad = nt.nodes.new('ShaderNodeMath'); ad.operation = 'ADD'
    nt.links.new(mu.outputs[0], ad.inputs[0]); nt.links.new(sep.outputs[1], ad.inputs[1])
    fr = nt.nodes.new('ShaderNodeMath'); fr.operation = 'FRACT'; nt.links.new(ad.outputs[0], fr.inputs[0])
    sm = nt.nodes.new('ShaderNodeMapRange'); sm.inputs[1].default_value = 0.0; sm.inputs[2].default_value = 0.12
    nt.links.new(fr.outputs[0], sm.inputs[0])
    mix = nt.nodes.new('ShaderNodeMix'); mix.data_type = 'RGBA'
    mix.inputs[6].default_value = (*_lin((0.04, 0.32, 0.06)), 1); mix.inputs[7].default_value = (*_lin((0.1, 0.62, 0.12)), 1)
    nt.links.new(sm.outputs[0], mix.inputs[0]); nt.links.new(mix.outputs[2], b.inputs['Base Color'])
    bump = nt.nodes.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = 0.25
    sn = nt.nodes.new('ShaderNodeMath'); sn.operation = 'SINE'
    m2 = nt.nodes.new('ShaderNodeMath'); m2.operation = 'MULTIPLY'; m2.inputs[1].default_value = 2 * math.pi
    nt.links.new(ad.outputs[0], m2.inputs[0]); nt.links.new(m2.outputs[0], sn.inputs[0])
    nt.links.new(sn.outputs[0], bump.inputs['Height']); nt.links.new(bump.outputs['Normal'], b.inputs['Normal'])
    return m

def _link(o, coll):
    for u in list(o.users_collection): u.objects.unlink(o)
    (coll or bpy.context.scene.collection).objects.link(o); return o

def _frame(tangent, up=Vector((0, 0, 1))):
    x = tangent.normalized()
    y = up.cross(x)
    if y.length < 1e-4: y = Vector((0, 1, 0))
    y.normalize(); z = x.cross(y)
    return Matrix((x, y, z)).transposed().to_4x4()

def make_hose(points, radii=None, coll=None, hose_mat=None, brass=None, rubber=None, radius=0.011, name="hose"):
    pts = [Vector(p) for p in points]
    cu = bpy.data.curves.new(name, 'CURVE'); cu.dimensions = '3D'
    cu.bevel_depth = radius; cu.bevel_resolution = 4; cu.resolution_u = 24; cu.use_fill_caps = True
    sp = cu.splines.new('BEZIER'); sp.bezier_points.add(len(pts) - 1)
    n = len(pts)
    for i, (bp, p) in enumerate(zip(sp.bezier_points, pts)):
        # Catmull-Rom handles, clamped so a hose lying on the ground never dips below it
        tg = (pts[min(n - 1, i + 1)] - pts[max(0, i - 1)]) / 6.0
        rs = radii[i] if radii else 1.0
        bp.handle_left_type = bp.handle_right_type = 'FREE'
        bp.co = p; bp.radius = rs
        hl, hr = p - tg, p + tg
        floor = radius * rs
        hl.z = max(hl.z, floor); hr.z = max(hr.z, floor)
        bp.handle_left = hl; bp.handle_right = hr
    o = bpy.data.objects.new(name, cu); _link(o, coll)
    cu.materials.append(hose_mat or hose_material())
    brass = brass or mat("brass", (0.95, 0.68, 0.3), metallic=1.0, rough=0.18)
    rubber = rubber or mat("black_rubber", (0.03, 0.03, 0.035), rough=0.6)
    parts = _nozzle(pts[-1], pts[-1] - pts[-2], coll, brass, rubber)
    return o, parts

def _nozzle(tip_from, direction, coll, brass, rubber):
    """Pistol-grip brass nozzle. Local +X = spray direction, origin at the hose coupling."""
    M = Matrix.Translation(tip_from) @ _frame(Vector(direction))
    made = []
    def add(kind, mtl, loc, rot=(0, 0, 0), scale=(1, 1, 1), name="nozzle", **kw):
        getattr(bpy.ops.mesh, "primitive_%s_add" % kind)(location=(0, 0, 0), **kw)
        p = bpy.context.active_object; p.name = name
        p.matrix_world = M @ Matrix.Translation(loc) @ Matrix.Rotation(rot[0], 4, 'X') @ Matrix.Rotation(rot[1], 4, 'Y') @ Matrix.Rotation(rot[2], 4, 'Z') @ Matrix.Diagonal((*scale, 1))
        p.data.materials.append(mtl)
        for f in p.data.polygons: f.use_smooth = True
        bv = p.modifiers.new("bevel", 'BEVEL'); bv.width = 0.0015; bv.segments = 2; bv.limit_method = 'ANGLE'
        made.append(_link(p, coll)); return p
    Y = (0, math.pi / 2, 0)
    add("cylinder", brass, (0.012, 0, 0), Y, vertices=6, radius=0.017, depth=0.024, name="nozzle_hex_coupling")
    add("cylinder", brass, (0.075, 0, 0), Y, vertices=32, radius=0.0135, depth=0.105, name="nozzle_barrel")
    add("torus", brass, (0.05, 0, 0), Y, major_radius=0.0138, minor_radius=0.0025, major_segments=32, minor_segments=8, name="nozzle_knurl_ring")
    add("torus", brass, (0.06, 0, 0), Y, major_radius=0.0138, minor_radius=0.0025, major_segments=32, minor_segments=8, name="nozzle_knurl_ring")
    add("cone", brass, (0.142, 0, 0), Y, vertices=32, radius1=0.016, radius2=0.009, depth=0.03, name="nozzle_spray_head")
    add("cylinder", rubber, (0.16, 0, 0), Y, vertices=24, radius=0.0065, depth=0.008, name="nozzle_tip_orifice")
    # grip: angled back and down from the rear of the barrel, black rubber sleeve
    add("cylinder", brass, (0.03, 0, -0.05), (0, math.radians(-15), 0), vertices=20, radius=0.012, depth=0.11, name="nozzle_grip_core")
    add("cylinder", rubber, (0.027, 0, -0.06), (0, math.radians(-15), 0), vertices=20, radius=0.0145, depth=0.08, name="nozzle_grip_rubber")
    # trigger lever in front of the grip, pivot pin at the barrel, return spring loop
    add("cube", brass, (0.07, 0, -0.045), (0, math.radians(-8), 0), (0.006, 0.006, 0.042), name="nozzle_trigger")
    add("cylinder", brass, (0.075, 0, -0.008), (math.pi / 2, 0, 0), vertices=12, radius=0.0035, depth=0.03, name="nozzle_trigger_pivot")
    add("torus", brass, (0.05, 0, -0.085), (math.pi / 2, 0, 0), major_radius=0.02, minor_radius=0.0022, major_segments=24, minor_segments=6, name="nozzle_trigger_guard_lock")
    return made

def make_water(start, end, apex_z, coll=None, mat=None, n_drops=64, seed=7):
    """Parabolic arc from the nozzle tip to the splash point: a tapering tube that beads and breaks into drops,
    loose drops along the broken end, and a splash crown at the end point."""
    R = random.Random(seed)
    p0, p1 = Vector(start), Vector(end)
    h = max(apex_z, p0.z + 0.05, p1.z + 0.05)
    sk = math.sqrt(h - p0.z) + math.sqrt(h - p1.z); k = sk * sk; tp = math.sqrt(h - p0.z) / sk
    def P(t):
        q = p0.lerp(p1, t); q.z = h - k * (t - tp) ** 2; return q
    def Tn(t):
        return (P(min(1, t + 1e-3)) - P(max(0, t - 1e-3))).normalized()
    made = 0
    # tube: 0 -> 0.7, beaded toward the end, closed to a point
    seg, rings = 16, 120; T_END = 0.7
    bm = bmesh.new(); ring_v = []
    for i in range(rings + 1):
        t = T_END * i / rings
        r = 0.007 + 0.011 * t
        r *= 1 + 0.45 * (t / T_END) ** 2 * math.sin(t * 160)
        if t > T_END * 0.92: r *= max(0.05, (T_END - t) / (T_END * 0.08))
        F = _frame(Tn(t))
        c = P(t)
        ring_v.append([bm.verts.new(c + (F @ Vector((0, r * math.cos(2 * math.pi * j / seg), r * math.sin(2 * math.pi * j / seg)))) ) for j in range(seg)])
    for a, b in zip(ring_v, ring_v[1:]):
        for j in range(seg): bm.faces.new((a[j], a[(j + 1) % seg], b[(j + 1) % seg], b[j]))
    bm.faces.new(list(reversed(ring_v[0]))); bm.faces.new(ring_v[-1])
    me = bpy.data.meshes.new("water_arc"); bm.to_mesh(me); bm.free()
    arc = bpy.data.objects.new("water_arc", me); _link(arc, coll); made += 1
    for f in me.polygons: f.use_smooth = True
    if mat: me.materials.append(mat)
    def drop(c, r, along, stretch, name):
        bpy.ops.mesh.primitive_uv_sphere_add(radius=1, segments=16, ring_count=10, location=(0, 0, 0))
        d = bpy.context.active_object; d.name = name
        d.matrix_world = Matrix.Translation(c) @ _frame(along) @ Matrix.Diagonal((r * stretch, r, r, 1))
        for f in d.data.polygons: f.use_smooth = True
        if mat: d.data.materials.append(mat)
        _link(d, coll)
    n_main = int(n_drops * 0.7)
    for i in range(n_main):   # drops along the broken end, denser and wider toward the splash
        t = 0.62 + 0.38 * (R.random() ** 0.8)
        spread = 0.02 + 0.16 * (t - 0.62) / 0.38
        F = _frame(Tn(t))
        c = P(t) + (F @ Vector((0, R.gauss(0, spread), R.gauss(0, spread))))
        drop(c, R.uniform(0.004, 0.013), Tn(t), R.uniform(1.2, 2.6), "water_drop_%02d" % i); made += 1
    for i in range(n_drops - n_main):   # strays falling off the underside of the arc
        t = R.uniform(0.25, 0.85); c = P(t) - Vector((0, 0, R.uniform(0.05, 0.4)))
        drop(c, R.uniform(0.003, 0.008), Vector((0.2, 0, -1)), R.uniform(1.0, 1.8), "water_stray_%02d" % i); made += 1
    # splash crown at the end: a thin flared sheet + 18 spikes with a bead on each tip + flung drops
    sheet_seg = 48; bm = bmesh.new(); prof = [(0.03, 0.0), (0.07, 0.01), (0.1, 0.035), (0.115, 0.06)]
    rr = []
    for (r, z) in prof:
        ring = []
        for j in range(sheet_seg):
            a = 2 * math.pi * j / sheet_seg; wob = 1 + 0.12 * math.sin(a * 9)
            ring.append(bm.verts.new(p1 + Vector((r * wob * math.cos(a), r * wob * math.sin(a), z * wob))))
        rr.append(ring)
    for a, b in zip(rr, rr[1:]):
        for j in range(sheet_seg): bm.faces.new((a[j], a[(j + 1) % sheet_seg], b[(j + 1) % sheet_seg], b[j]))
    me = bpy.data.meshes.new("water_splash_sheet"); bm.to_mesh(me); bm.free()
    sh = bpy.data.objects.new("water_splash_sheet", me); _link(sh, coll)
    sh.modifiers.new("thick", 'SOLIDIFY').thickness = 0.003
    for f in me.polygons: f.use_smooth = True
    if mat: me.materials.append(mat)
    for j in range(18):
        a = 2 * math.pi * j / 18 + R.uniform(-0.08, 0.08); L = R.uniform(0.04, 0.1)
        base = p1 + Vector((0.11 * math.cos(a), 0.11 * math.sin(a), 0.055))
        dirv = Vector((math.cos(a) * 0.6, math.sin(a) * 0.6, 1.0)).normalized()
        bpy.ops.mesh.primitive_cone_add(vertices=10, radius1=0.006, radius2=0.002, depth=L, location=(0, 0, 0))
        s = bpy.context.active_object; s.name = "water_crown_spike_%02d" % j
        s.matrix_world = Matrix.Translation(base + dirv * L / 2) @ dirv.to_track_quat('Z', 'Y').to_matrix().to_4x4()
        if mat: s.data.materials.append(mat)
        _link(s, coll)
        drop(base + dirv * (L + 0.008), R.uniform(0.005, 0.008), dirv, 1.0, "water_crown_bead_%02d" % j)
        made += 2
    for j in range(14):
        a = R.uniform(0, 2 * math.pi); d_ = R.uniform(0.15, 0.4)
        c = p1 + Vector((d_ * math.cos(a), d_ * math.sin(a), R.uniform(0.05, 0.3)))
        drop(c, R.uniform(0.004, 0.01), Vector((math.cos(a), math.sin(a), 0.5)), 1.5, "water_fling_%02d" % j); made += 1
    return {"objects": made + 1, "drops_total": n_drops + 18 + 14, "arc_length_m": round(sum((P((i + 1) / 50) - P(i / 50)).length for i in range(50)), 2)}
