# Build every prop of the style-test still into props/props.blend (props-hero, 2026-11-21).
# Run:  blender -b --python episodes/_style_test/props/build_props.py
# Metres, Z up, each prop in its own collection, origin on the ground at the footprint centre.
# Hose and water routes come from hose_points.json / water_points.json (edit them, re-run), or call
# make_hose(points) / make_water(p0, p1, apex_z) from props/hose_tool.py inside the assembler's scene.
import bpy, bmesh, math, random, json, os, sys
from mathutils import Vector, Matrix
from mathutils.bvhtree import BVHTree

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import hose_tool as HT   # shared helpers: materials, make_hose, make_water

EP = os.path.dirname(HERE)
CAR_GLB = os.path.join(EP, "assets", "buick54", "buick54.glb")
R = random.Random(21)

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.unit_settings.system = 'METRIC'
M = HT.mat

def coll(name):
    c = bpy.data.collections.new(name); sc.collection.children.link(c); return c

def link(o, c):
    for u in list(o.users_collection): u.objects.unlink(o)
    c.objects.link(o); return o

def bevel(o, w=0.004, seg=3):
    m = o.modifiers.new("bevel", 'BEVEL'); m.width = w; m.segments = seg; m.limit_method = 'ANGLE'
    m.harden_normals = False
    return o

def smooth(o):
    for p in o.data.polygons: p.use_smooth = True
    return o

def prim(kind, c, mat, loc=(0, 0, 0), rot=(0, 0, 0), scale=(1, 1, 1), name=None, **kw):
    getattr(bpy.ops.mesh, "primitive_%s_add" % kind)(location=loc, rotation=rot, **kw)
    o = bpy.context.active_object; o.scale = scale
    if name: o.name = name
    if mat: o.data.materials.append(mat)
    return link(o, c)

def tube(points, r, c, mat, name="tube", res=10, closed=False):
    """Poly curve with round bevel through world points (frame tubes, wire handle, spokes)."""
    cu = bpy.data.curves.new(name, 'CURVE'); cu.dimensions = '3D'
    cu.bevel_depth = r; cu.bevel_resolution = 3; cu.use_fill_caps = True
    sp = cu.splines.new('POLY'); sp.points.add(len(points) - 1)
    for p, q in zip(sp.points, points): p.co = (*q, 1)
    sp.use_cyclic_u = closed
    o = bpy.data.objects.new(name, cu); c.objects.link(o)
    cu.materials.append(mat); return o

def bezier_tube(points, r, c, mat, name="btube", res=12):
    cu = bpy.data.curves.new(name, 'CURVE'); cu.dimensions = '3D'
    cu.bevel_depth = r; cu.bevel_resolution = 3; cu.use_fill_caps = True; cu.resolution_u = res
    sp = cu.splines.new('BEZIER'); sp.bezier_points.add(len(points) - 1)
    for b, q in zip(sp.bezier_points, points):
        b.co = q; b.handle_left_type = b.handle_right_type = 'AUTO'
    o = bpy.data.objects.new(name, cu); c.objects.link(o); cu.materials.append(mat); return o

def lathe(profile, c, mat, name, seg=48):
    """profile: list of (radius, z). Returns a smooth revolved mesh."""
    bm = bmesh.new(); rings = []
    for (r, z) in profile:
        ring = [bm.verts.new((r * math.cos(2 * math.pi * i / seg), r * math.sin(2 * math.pi * i / seg), z)) for i in range(seg)]
        rings.append(ring)
    for a, b in zip(rings, rings[1:]):
        for i in range(seg):
            bm.faces.new((a[i], a[(i + 1) % seg], b[(i + 1) % seg], b[i]))
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new(name, me); c.objects.link(o); me.materials.append(mat); return smooth(o)

# ------------------------------------------------------------------ materials (recipe: clean, saturated)
PAINT_TURQ = M("car_paint_candy_turquoise", (0.0, 0.62, 0.62), metallic=0.55, rough=0.22, coat=1.0, coat_rough=0.02, flakes=True)
PAINT_CREAM = M("car_paint_cream", (0.93, 0.88, 0.76), metallic=0.25, rough=0.2, coat=1.0, coat_rough=0.02)
CHROME = M("chrome", (0.92, 0.92, 0.94), metallic=1.0, rough=0.04)
GLASS = M("car_glass", (0.85, 0.93, 0.95), rough=0.0, transmission=1.0, ior=1.5)
PLATE = M("plate_blank", (0.95, 0.86, 0.35), rough=0.35, coat=0.6)
FOAM = M("soap_foam", (0.97, 0.98, 1.0), rough=0.35, sss=0.25)
WET = M("wet_film", (0.9, 0.95, 1.0), rough=0.02, transmission=1.0, ior=1.33, alpha=0.55)
WET_CONC = M("wet_concrete_dark", (0.12, 0.13, 0.15), rough=0.05, alpha=0.45)
GALV = M("galvanised_steel", (0.78, 0.8, 0.82), metallic=1.0, rough=0.28, noise=0.06)
WIRE = M("handle_wire_steel", (0.7, 0.7, 0.72), metallic=1.0, rough=0.2)
WOOD_GRIP = M("handle_grip_red", (0.8, 0.07, 0.05), rough=0.3, coat=0.5)
CHAMOIS = M("chamois_leather", (0.86, 0.66, 0.36), rough=0.6, sss=0.1, weave=True)
SPONGE = M("sponge_yellow", (1.0, 0.78, 0.08), rough=0.7, pores=True)
SPONGE_G = M("sponge_scour_green", (0.1, 0.6, 0.2), rough=0.8, pores=True)
HOSE_G = HT.hose_material()
BRASS = M("brass", (0.95, 0.68, 0.3), metallic=1.0, rough=0.18)
BLACK_RUB = M("black_rubber", (0.03, 0.03, 0.035), rough=0.6)
REEL_RED = M("reel_paint_red", (0.82, 0.07, 0.04), rough=0.3, coat=0.7)
REEL_YEL = M("reel_hub_yellow", (1.0, 0.75, 0.05), rough=0.35, coat=0.5)
MBOX = M("mailbox_paint_blue", (0.05, 0.25, 0.8), metallic=0.2, rough=0.25, coat=0.8)
FLAG = M("mailbox_flag_red", (0.9, 0.05, 0.03), rough=0.3, coat=0.6)
WHITE = M("paint_white", (0.95, 0.95, 0.93), rough=0.3)
POST = M("post_wood_white", (0.93, 0.92, 0.88), rough=0.45, grain=True)
STEM = M("flower_stem_green", (0.15, 0.55, 0.12), rough=0.5)
PETAL_Y = M("petal_yellow", (1.0, 0.8, 0.05), rough=0.45, sss=0.2)
PETAL_P = M("petal_pink", (1.0, 0.35, 0.6), rough=0.45, sss=0.2)
PETAL_W = M("petal_white", (1.0, 1.0, 0.97), rough=0.45, sss=0.2)
CENTRE = M("flower_centre", (0.9, 0.45, 0.02), rough=0.6)
BIKE_RED = M("bike_paint_cherry", (0.85, 0.04, 0.1), metallic=0.3, rough=0.2, coat=1.0, coat_rough=0.03)
GRIP_W = M("grip_white", (0.97, 0.97, 0.95), rough=0.5)
SADDLE = M("saddle_vinyl_white", (0.98, 0.96, 0.9), rough=0.3, coat=0.4)
STREAM_A = M("streamer_pink", (1.0, 0.3, 0.7), rough=0.4)
STREAM_B = M("streamer_blue", (0.1, 0.6, 1.0), rough=0.4)
REFL = M("reflector_orange", (1.0, 0.35, 0.0), rough=0.1, coat=1.0)
WATER = M("water_placeholder", (0.85, 0.95, 1.0), rough=0.0, transmission=1.0, ior=1.33)

# ================================================================== CAR (ready-made, Sketchfab CC-BY 4.0)
car = coll("car")
before = set(bpy.data.objects)
bpy.ops.import_scene.gltf(filepath=CAR_GLB)
imported = [o for o in bpy.data.objects if o not in before]
for o in imported:
    link(o, car)
# remove the author's credits card (watermark plane far to the side) and empties after applying transforms
for o in list(imported):
    if o.type == 'MESH' and o.data.materials and o.data.materials[0] and o.data.materials[0].name.startswith("credits"):
        bpy.data.objects.remove(o); imported.remove(o)
meshes = [o for o in imported if o.type == 'MESH']
bpy.ops.object.select_all(action='DESELECT')
for o in meshes: o.select_set(True)
bpy.context.view_layer.objects.active = meshes[0]
bpy.ops.object.parent_clear(type='CLEAR_KEEP_TRANSFORM')
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
for o in [o for o in imported if o.type != 'MESH']: bpy.data.objects.remove(o)
# Asset front points -Y (kept: LAYOUT convention 'front along -Y before the yaw'); uniform scale to the LAYOUT height
# (1.50 m; gives 1.83 m wide, about 5.4 m long), footprint centre to origin, tyres on z=0
def bounds(objs):
    lo = Vector((1e9,) * 3); hi = -lo
    for o in objs:
        for v in o.data.vertices:
            w = o.matrix_world @ v.co
            lo = Vector(map(min, lo, w)); hi = Vector(map(max, hi, w))
    return lo, hi
lo, hi = bounds(meshes)
LAY = json.load(open(os.path.join(EP, 'LAYOUT.json'))) if os.path.exists(os.path.join(EP, 'LAYOUT.json')) else {}
CAR_H = LAY.get('car', {}).get('size_lwh', [0, 0, 1.5])[2]
s = CAR_H / (hi.z - lo.z)
ctr = Vector(((lo.x + hi.x) / 2, (lo.y + hi.y) / 2, lo.z))
T = Matrix.Scale(s, 4) @ Matrix.Translation(-ctr)
for o in meshes:
    o.data.transform(T); o.data.update()
lo, hi = bounds(meshes)
CAR_SIZE = hi - lo
# repaint: body candy turquoise metallic clearcoat, roof/insert cream, steel wheels cream, chrome, glass, blank plate
swap = {"blue_metallic": PAINT_TURQ, "paint_whitee": PAINT_CREAM, "paint_red_dark": PAINT_CREAM,
        "Metallic": CHROME, "Glass": GLASS, "car_logo_diffuse": CHROME, "number_plate_diffuse": PLATE,
        "mirror": CHROME, "material": PAINT_CREAM}
for o in meshes:
    for i, m in enumerate(o.data.materials):
        if m and m.name in swap: o.data.materials[i] = swap[m.name]
for o in meshes:
    smooth(o) if len(o.data.polygons) > 200 else None
    o.name = "car_" + (o.data.materials[0].name if o.data.materials and o.data.materials[0] else o.name)

# ---- blank the brand lettering: chrome letter islands "BUICK" on the hood lip and the small script under the trunk badge
def blank_islands(o, test):
    bm_ = bmesh.new(); bm_.from_mesh(o.data); bm_.verts.ensure_lookup_table(); seen = set(); kill = []
    for v in bm_.verts:
        if v.index in seen: continue
        st = [v]; comp = []; seen.add(v.index)
        while st:
            a = st.pop(); comp.append(a)
            for e in a.link_edges:
                b_ = e.other_vert(a)
                if b_.index not in seen: seen.add(b_.index); st.append(b_)
        cs = [q.co for q in comp]; lo_ = Vector(map(min, *cs)) if len(cs) > 1 else cs[0]; hi_ = Vector(map(max, *cs)) if len(cs) > 1 else cs[0]
        if test((lo_ + hi_) / 2, max(hi_ - lo_)): kill += comp
    bmesh.ops.delete(bm_, geom=kill, context='VERTS'); bm_.to_mesh(o.data); bm_.free(); return len(kill)
BLANKED = 0
for o in meshes:
    if o.data.materials and o.data.materials[0] == CHROME:
        BLANKED += blank_islands(o, lambda c, sz: sz < 0.05 and abs(c.x) < 0.12 and abs(c.y - (lo.y + 0.284)) < 0.06 and 0.79 < c.z < 0.89)
        BLANKED += blank_islands(o, lambda c, sz: sz < 0.1 and abs(c.x) < 0.15 and c.y > hi.y - 0.6 and 0.66 < c.z < 0.77)
print("BLANKED letter verts", BLANKED)
# ---- soap foam + wet streaks on the hood: ray-cast onto the painted body from above
body = [o for o in meshes if o.data.materials and o.data.materials[0] == PAINT_TURQ]
bm = bmesh.new()
for o in body:
    t = bmesh.new(); t.from_mesh(o.data); t.transform(o.matrix_world)
    me = bpy.data.meshes.new("tmp"); t.to_mesh(me); bm.from_mesh(me); bpy.data.meshes.remove(me); t.free()
bvh = BVHTree.FromBMesh(bm)
def hit(x, y):
    r = bvh.ray_cast(Vector((x, y, 4.0)), Vector((0, 0, -1)))
    return r if r[0] is not None else None
# the hood: front third of the car, top surface below 1.15 m
hy0, hy1 = lo.y + 0.3, lo.y + 1.6   # front = -Y: the hood runs from the grille back to the windscreen
FOAM_PATCHES = [(-0.25, hy0 + 0.45, 0.16), (0.18, hy0 + 0.75, 0.12), (0.42, hy0 + 0.35, 0.09), (-0.05, hy0 + 1.05, 0.07)]
fi = 0
for (fx, fy, fr) in FOAM_PATCHES:
    for k in range(int(220 * fr / 0.16) + 30):
        a = R.uniform(0, 2 * math.pi); d = fr * math.sqrt(R.random()) * R.uniform(0.7, 1.15)
        h = hit(fx + d * math.cos(a), fy + d * math.sin(a) * 1.3)
        if not h or h[1].z < 0.6: continue
        rr = R.uniform(0.006, 0.022) * (1.0 - 0.6 * d / fr)
        p = h[0] + h[1] * rr * 0.4
        o = prim("ico_sphere", car, FOAM, loc=p, subdivisions=2, radius=rr, name="car_foam_%03d" % fi)
        o.scale = (1, 1, R.uniform(0.55, 0.9)); smooth(o); fi += 1
# wet streaks: thin sheets following the hood surface, running from the foam toward the fender edges
def surface_strip(pts, width, name):
    vs = []
    for i, (x, y) in enumerate(pts):
        t = i / (len(pts) - 1)
        w = width * (1.0 - 0.7 * t)
        for sgn in (-1, 1):
            h = hit(x + sgn * w / 2, y)
            if not h: return None
            vs.append(h[0] + h[1] * 0.0015)
    me = bpy.data.meshes.new(name); faces = [(2 * i, 2 * i + 1, 2 * i + 3, 2 * i + 2) for i in range(len(pts) - 1)]
    me.from_pydata(vs, [], faces); o = bpy.data.objects.new(name, me); car.objects.link(o); me.materials.append(WET); return smooth(o)
streaks = 0
for (fx, fy, fr) in FOAM_PATCHES[:3]:
    for k in range(4):
        x0 = fx + R.uniform(-fr, fr); dirx = (0.5 if x0 > 0 else -0.5) * R.uniform(0.6, 1.4)
        pts = [(x0 + dirx * j * 0.03 + 0.01 * math.sin(j), fy + R.uniform(-0.05, 0.05) - j * 0.02) for j in range(14)]
        if surface_strip(pts, R.uniform(0.025, 0.05), "car_wet_streak_%02d" % streaks): streaks += 1
# a broad wet sheen patch around the foam
for i, (fx, fy, fr) in enumerate(FOAM_PATCHES[:2]):
    n = 10; vs = []; faces = []
    grid = [[hit(fx + (u / n - 0.5) * fr * 3.2, fy + (v / n - 0.5) * fr * 3.2) for u in range(n + 1)] for v in range(n + 1)]
    if all(all(g) for g in grid):
        for v in range(n + 1):
            for u in range(n + 1): vs.append(grid[v][u][0] + grid[v][u][1] * 0.001)
        for v in range(n):
            for u in range(n): faces.append((v * (n + 1) + u, v * (n + 1) + u + 1, (v + 1) * (n + 1) + u + 1, (v + 1) * (n + 1) + u))
        me = bpy.data.meshes.new("car_wet_sheen_%d" % i); me.from_pydata(vs, [], faces)
        o = bpy.data.objects.new(me.name, me); car.objects.link(o); me.materials.append(WET); smooth(o)
bm.free()
CAR_FOAM_BLOBS = fi; CAR_STREAKS = streaks

# ================================================================== BUCKET (galvanised, ribs, wire handle, suds)
bucket = coll("bucket")
H, RB, RT = 0.30, 0.125, 0.155
prof = [(0.0, 0.004), (RB - 0.01, 0.0), (RB, 0.006)]
for i in range(1, 30):
    z = H * i / 30; r = RB + (RT - RB) * z / H
    for zr in (0.08, 0.15, 0.22):   # three pressed ribs
        r += 0.006 * math.exp(-((z - zr) / 0.008) ** 2)
    prof.append((r, z))
prof += [(RT + 0.004, H + 0.006), (RT - 0.002, H + 0.010), (RT - 0.006, H)]
for i in range(29, 0, -1):
    z = H * i / 30; prof.append((RB + (RT - RB) * z / H - 0.0025, z))
prof += [(RB - 0.0025, 0.006), (0.0, 0.006)]
lathe(prof, bucket, GALV, "bucket_body", seg=64)
tor = prim("torus", bucket, GALV, loc=(0, 0, H + 0.004), major_radius=RT + 0.001, minor_radius=0.005, major_segments=64, minor_segments=10, name="bucket_rolled_rim")
smooth(tor)
for sx in (-1, 1):   # handle ears riveted on
    e = prim("cube", bucket, GALV, loc=(sx * (RT - 0.004), 0, H - 0.03), scale=(0.004, 0.022, 0.025), name="bucket_ear")
    e.rotation_euler.y = sx * math.atan((RT - RB) / H); bevel(e, 0.003)
    for dz in (-0.012, 0.012):
        prim("uv_sphere", bucket, GALV, loc=(sx * (RT + 0.001), 0, H - 0.03 + dz), radius=0.004, segments=10, ring_count=6, name="bucket_rivet")
hp = [(-(RT + 0.004), 0, H - 0.03), (-(RT + 0.01), 0, H + 0.02)]
for i in range(1, 16):
    a = math.pi * i / 16
    hp.append((-(RT + 0.01) * math.cos(a), 0.06 * math.sin(a) * 0.0 + 0, H + 0.02 + 0.16 * math.sin(a)))
hp += [((RT + 0.01), 0, H + 0.02), ((RT + 0.004), 0, H - 0.03)]
hw = bezier_tube(hp, 0.0028, bucket, WIRE, "bucket_wire_handle")
hw.rotation_euler.x = math.radians(-55)   # handle dropped to one side
hw.location.z = 0; hw.matrix_world = Matrix.Translation((0, 0, H - 0.03)) @ Matrix.Rotation(math.radians(-60), 4, 'X') @ Matrix.Translation((0, 0, -(H - 0.03)))
g = prim("cylinder", bucket, WOOD_GRIP, loc=(0, 0, 0), vertices=16, radius=0.011, depth=0.11, name="bucket_handle_grip")
g.rotation_euler = (0, math.pi / 2, 0)
g.matrix_world = Matrix.Translation((0, 0, H - 0.03)) @ Matrix.Rotation(math.radians(-60), 4, 'X') @ Matrix.Translation((0, 0, 0.21)) @ Matrix.Rotation(math.pi / 2, 4, 'Y')
bevel(smooth(g), 0.004)
# suds: a heaped dome of bubbles overflowing the rim
for i in range(420):
    a = R.uniform(0, 2 * math.pi); d = RT * math.sqrt(R.random()) * 1.08
    z = H - 0.01 + 0.075 * max(0, 1 - (d / (RT * 1.08)) ** 2) + R.uniform(-0.01, 0.015)
    r = R.uniform(0.008, 0.03) * (1.1 - 0.5 * d / RT)
    o = prim("ico_sphere", bucket, FOAM, loc=(d * math.cos(a), d * math.sin(a), z), subdivisions=2, radius=r, name="bucket_suds")
    smooth(o)
# suds running over the lip and down the outside (one side)
for i in range(40):
    a = R.uniform(-0.6, 0.6); t = R.random()
    z = H - t * 0.12; r = RT * (1 - 0.15 * t) + 0.012
    o = prim("ico_sphere", bucket, FOAM, loc=(r * math.cos(a), r * math.sin(a), z), subdivisions=2, radius=R.uniform(0.006, 0.016) * (1 - 0.5 * t), name="bucket_suds_run")
    smooth(o)
# loose bubbles on the ground + a glossy drip trail running off toward the car
for i in range(26):
    a = R.uniform(0, 2 * math.pi); d = R.uniform(RB + 0.03, 0.45); r = R.uniform(0.004, 0.018)
    o = prim("uv_sphere", bucket, FOAM, loc=(d * math.cos(a), d * math.sin(a), r * 0.6), radius=r, segments=16, ring_count=8, name="ground_bubble")
    smooth(o)
for i in range(9):
    x = -(RT + 0.04 + i * 0.07 + R.uniform(-0.01, 0.01)); y = 0.02 * math.sin(i * 0.9)   # toward the car (-X)
    o = prim("uv_sphere", bucket, WET, loc=(x, y, 0.001), radius=R.uniform(0.018, 0.035), segments=20, ring_count=8, name="drip_trail")
    o.scale = (R.uniform(1.1, 1.8), 1.0, 0.08); smooth(o)

# ================================================================== CHAMOIS (draped over the bucket rim, shares the bucket origin)
cham = coll("chamois")
n_u, n_v = 22, 30
vs = []; faces = []
ang0 = math.radians(-125); W = 0.20; L = 0.30   # draped at angle 150 deg on the rim
for j in range(n_v + 1):
    s_ = (j / n_v - 0.45) * L      # arc length across the rim; negative = inside the bucket
    for i in range(n_u + 1):
        u = (i / n_u - 0.5) * W
        a = ang0 + u / RT * 0.85
        rr = RT + 0.006
        if s_ <= 0:   # hangs inside, lying on the suds
            p = Vector(((rr + s_ * 0.6) * math.cos(a), (rr + s_ * 0.6) * math.sin(a), H + 0.03 + s_ * 0.15))
        else:         # over the lip and down the outside wall
            k = min(s_, 0.02); dn = s_ - k
            p = Vector(((rr + k + 0.004 + dn * 0.18) * math.cos(a), (rr + k + 0.004 + dn * 0.18) * math.sin(a), H + 0.012 - dn * 0.95))
        wave = (0.014 * math.sin(u * 45 + s_ * 6) + 0.006 * math.sin(u * 90)) * min(1, abs(s_) * 10)   # hanging folds
        p += Vector((math.cos(a), math.sin(a), 0)) * wave
        vs.append(p)
for j in range(n_v):
    for i in range(n_u):
        a = j * (n_u + 1) + i; faces.append((a, a + 1, a + n_u + 2, a + n_u + 1))
me = bpy.data.meshes.new("chamois_cloth"); me.from_pydata(vs, [], faces)
co = bpy.data.objects.new("chamois_cloth", me); cham.objects.link(co); me.materials.append(CHAMOIS); smooth(co)
so = co.modifiers.new("thick", 'SOLIDIFY'); so.thickness = 0.003
co.modifiers.new("sub", 'SUBSURF').levels = 1

# ================================================================== SPONGE (held by grandpa, origin at its base centre)
sponge = coll("sponge")
sp1 = prim("cube", sponge, SPONGE, loc=(0, 0, 0.032), scale=(0.1, 0.065, 0.032), name="sponge_body")
bevel(sp1, 0.018, 4); sp1.modifiers.new("sub", 'SUBSURF').levels = 1
sp1.modifiers.new("pores", 'DISPLACE')
tx = bpy.data.textures.new("sponge_pores", 'VORONOI'); tx.noise_scale = 0.006
sp1.modifiers["pores"].texture = tx; sp1.modifiers["pores"].strength = -0.004
sp1.modifiers.move(2, 1)
sp1.modifiers["sub"].levels = 2
sp2 = prim("cube", sponge, SPONGE_G, loc=(0, 0, 0.073), scale=(0.1, 0.065, 0.009), name="sponge_scour_layer")
bevel(sp2, 0.006, 3)
smooth(sp1); smooth(sp2)
for i in range(40):
    x = R.uniform(-0.09, 0.09); y = R.uniform(-0.055, 0.055)
    o = prim("ico_sphere", sponge, FOAM, loc=(x, y, R.choice([0.083, 0.004 + R.uniform(0, 0.06)])), subdivisions=2, radius=R.uniform(0.004, 0.014), name="sponge_suds")
    smooth(o)

# ================================================================== HOSE REEL (on the lawn, with crank)
reel = coll("hose_reel")
DR, DW, AX = 0.16, 0.30, 0.36     # drum radius, drum width, axle height
for sx in (-1, 1):
    x = sx * (DW / 2 + 0.03)
    # A-frame side: two legs + top hub plate, red tube
    tube([(x, -0.2, 0.02), (x, 0, AX), (x, 0.2, 0.02)], 0.012, reel, REEL_RED, "reel_side_frame")
    tube([(x, -0.13, 0.14), (x, 0.13, 0.14)], 0.009, reel, REEL_RED, "reel_side_brace")
    f = prim("cylinder", reel, REEL_YEL, loc=(sx * (DW / 2 + 0.008), 0, AX), rot=(0, math.pi / 2, 0), vertices=48, radius=DR + 0.05, depth=0.012, name="reel_flange")
    bevel(smooth(f), 0.004)
    for k in range(6):   # flange spokes cut-outs read as bolts
        a = k * math.pi / 3
        prim("cylinder", reel, CHROME, loc=(sx * (DW / 2 + 0.016), (DR - 0.04) * math.cos(a), AX + (DR - 0.04) * math.sin(a)), rot=(0, math.pi / 2, 0), vertices=6, radius=0.009, depth=0.006, name="reel_bolt")
# base runners + small wheels
for y in (-0.2, 0.2):
    tube([(-(DW / 2 + 0.06), y, 0.02), ((DW / 2 + 0.06), y, 0.02)], 0.012, reel, REEL_RED, "reel_runner")
for sx in (-1, 1):
    w = prim("cylinder", reel, BLACK_RUB, loc=(sx * (DW / 2 + 0.08), 0.2, 0.05), rot=(0, math.pi / 2, 0), vertices=32, radius=0.05, depth=0.03, name="reel_wheel")
    bevel(smooth(w), 0.008)
    prim("cylinder", reel, REEL_YEL, loc=(sx * (DW / 2 + 0.097), 0.2, 0.05), rot=(0, math.pi / 2, 0), vertices=24, radius=0.025, depth=0.006, name="reel_wheel_hub")
d = prim("cylinder", reel, REEL_YEL, loc=(0, 0, AX), rot=(0, math.pi / 2, 0), vertices=40, radius=DR * 0.55, depth=DW, name="reel_drum_core")
ax = prim("cylinder", reel, CHROME, loc=(0, 0, AX), rot=(0, math.pi / 2, 0), vertices=16, radius=0.012, depth=DW + 0.16, name="reel_axle")
# wound hose: helical coils on the drum
coil = []
turns, layers = 9, 3
for L_ in range(layers):
    r = DR * 0.55 + 0.016 + L_ * 0.028
    for i in range(turns * 24 + 1):
        t = i / 24; a = 2 * math.pi * t
        x = -DW / 2 + 0.018 + (DW - 0.036) * (t / turns if L_ % 2 == 0 else 1 - t / turns)
        coil.append((x, r * math.cos(a), AX + r * math.sin(a)))
tube(coil, 0.0135, reel, HOSE_G, "reel_wound_hose")
# crank: arm + wooden handle on the right side
cx = DW / 2 + 0.06
tube([(cx - 0.03, 0, AX), (cx, 0, AX), (cx, 0.0, AX + 0.13)], 0.01, reel, CHROME, "reel_crank_arm")
hd = prim("cylinder", reel, REEL_YEL, loc=(cx + 0.05, 0, AX + 0.13), rot=(0, math.pi / 2, 0), vertices=20, radius=0.014, depth=0.09, name="reel_crank_handle")
bevel(smooth(hd), 0.006)
# pull handle on top
tube([(-(DW / 2 + 0.03), 0, AX + 0.02), (-(DW / 2 + 0.03), -0.03, AX + DR + 0.18), ((DW / 2 + 0.03), -0.03, AX + DR + 0.18), ((DW / 2 + 0.03), 0, AX + 0.02)], 0.011, reel, REEL_RED, "reel_pull_handle")
for o in reel.objects:
    if o.type == 'MESH': smooth(o)
REEL_OUTLET = Vector((-0.02, -(DR * 0.55 + 0.07), AX - 0.08))  # where the hose leaves the drum (bottom front)

# ================================================================== HOSE (editable curve + brass nozzle with trigger)
hose = coll("hose")
pts_file = os.path.join(HERE, "hose_points.json")
if os.path.exists(pts_file):
    HP = json.load(open(pts_file))
else:
    # default route in WORLD metres (LAYOUT round 1): off the reel drum at hose_reel.pos, a kink near the reel, in front of
    # the mailbox, across the drive, up the lawn to the kid's hands (LAYOUT kid hands_world_local_xz, about 0.48 m high);
    # the last segment points the nozzle toward grandpa / the car roof (screen right).
    rp = Vector(LAY.get("hose_reel", {}).get("pos", [0, 0, 0])); kp = Vector(LAY.get("kid", {}).get("pos", [-3.35, 4.9, 0]))
    hx = sum(h[0] for h in LAY.get("kid", {}).get("hands_world_local_xz", [[-0.17, 0.48]])) / max(1, len(LAY.get("kid", {}).get("hands_world_local_xz", [1])))
    hz = sum(h[1] for h in LAY.get("kid", {}).get("hands_world_local_xz", [[-0.17, 0.48]])) / max(1, len(LAY.get("kid", {}).get("hands_world_local_xz", [1])))
    hand = kp + Vector((hx, 0, hz))
    rel = [(-0.02, -0.16, 0.28), (-0.02, -0.3, 0.06), (0.0, -0.42, 0.011), (0.12, -0.55, 0.011), (0.16, -0.6, 0.011), (0.1, -0.68, 0.011), (-0.3, -0.4, 0.011)]  # z 0.011 = the hose radius: lying on the ground
    pts = [rp + Vector(q) for q in rel]
    pts += [Vector((-1.5, 4.55, 0.011)), Vector((-2.35, 5.1, 0.011)), Vector((-2.85, 6.5, 0.011)), Vector((-3.05, 8.3, 0.011)),
            Vector((-3.05, 9.45, 0.011)), hand + Vector((-0.3, 0.05, -0.36)), hand + Vector((-0.2, 0.04, -0.1)), hand + Vector((-0.12, 0.03, -0.02)), hand + Vector((-0.03, 0.0, 0.0))]
    HP = {"points": [[round(c, 3) for c in p_] for p_ in pts], "radius": [1, 1, 1, 0.7, 0.45, 0.7] + [1] * (len(pts) - 6),
          "note": "WORLD metres. Edit and re-run build_props.py, or call hose_tool.make_hose(points). Point 5 (index 4) is the kink near the reel (radius 0.45 = flattened). The last point is the nozzle coupling at the kid's hands; the nozzle points along the last segment."}
    json.dump(HP, open(pts_file, "w"), indent=1)
hose_obj, nozzle_objs = HT.make_hose(HP["points"], radii=HP.get("radius"), coll=hose, hose_mat=HOSE_G, brass=BRASS, rubber=BLACK_RUB)
# wet dark trail on the concrete under the hose (decal, a few mm above ground, along the flat part)
flat = [Vector(p) for p in HP["points"] if p[2] < 0.05]
for i, (a, b) in enumerate(zip(flat, flat[1:])):
    m_ = (a + b) / 2; dv = b - a
    o = prim("plane", hose, WET_CONC, loc=(m_.x, m_.y, 0.002), size=1, name="hose_wet_trail_%d" % i)
    o.scale = (dv.length * 1.1, 0.07 + 0.03 * math.sin(i), 1); o.rotation_euler.z = math.atan2(dv.y, dv.x)
    o.modifiers.new("sub", 'SUBSURF').levels = 2

# ================================================================== MAILBOX (rural box on a white post, flag up, number 27)
mb = coll("mailbox")
POST_H = 1.02
post = prim("cube", mb, POST, loc=(0, 0, POST_H / 2), scale=(0.045, 0.045, POST_H / 2), name="mailbox_post")
bevel(post, 0.006, 3)
cap = prim("cube", mb, POST, loc=(0, 0.0, POST_H + 0.012), scale=(0.11, 0.3, 0.012), name="mailbox_mount_board")
bevel(cap, 0.004, 2)
for y in (-0.06, 0.06):   # angle braces
    br = prim("cube", mb, POST, loc=(0, y * 2.2, POST_H - 0.07), scale=(0.02, 0.012, 0.09), name="mailbox_brace")
    br.rotation_euler.x = math.copysign(math.radians(40), -y); bevel(br, 0.003)
# box: tunnel profile extruded along Y (length 0.48), rounded top radius 0.085
BW, BL, BH = 0.17, 0.48, 0.15
bm2 = bmesh.new(); prof = []
for i in range(17):
    a = math.pi * i / 16
    prof.append((BW / 2 * math.cos(a), BH - BW / 2 + BW / 2 * math.sin(a)))
prof = [(BW / 2, 0)] + prof + [(-BW / 2, 0)]
z0 = POST_H + 0.024
rings = [[bm2.verts.new((x, y, z0 + z)) for (x, z) in prof] for y in (-BL / 2, BL / 2)]
for i in range(len(prof) - 1):
    bm2.faces.new((rings[0][i], rings[0][i + 1], rings[1][i + 1], rings[1][i]))
bm2.faces.new((rings[1][0], rings[1][-1], rings[0][-1], rings[0][0]))
bm2.faces.new(list(reversed(rings[0]))); bm2.faces.new(rings[1])
me = bpy.data.meshes.new("mailbox_box"); bm2.to_mesh(me); bm2.free()
box = bpy.data.objects.new("mailbox_box", me); mb.objects.link(box); me.materials.append(MBOX)
bevel(box, 0.006, 3); smooth(box)
sub = box.modifiers.new("sub", 'SUBSURF'); sub.levels = 0
# dent: push in a soft spot on the left side
box.modifiers.remove(sub)
me = box.data; bm3 = bmesh.new(); bm3.from_mesh(me)
bmesh.ops.subdivide_edges(bm3, edges=[e for e in bm3.edges if abs(e.verts[0].co.y - e.verts[1].co.y) > 0.3], cuts=24, use_grid_fill=True)
dent_c = Vector((-BW / 2, 0.06, z0 + 0.09))
for v in bm3.verts:
    d_ = (v.co - dent_c).length
    if v.co.x < 0 and d_ < 0.06: v.co.x += 0.012 * (1 - d_ / 0.06) ** 2   # dent on -X = camera side after the turn
bm3.to_mesh(me); bm3.free()
# door at the front (+Y) with a pull tab, hinge at the bottom
door = prim("cube", mb, MBOX, loc=(0, BL / 2 + 0.004, z0 + BH / 2 - 0.005), scale=(BW / 2 + 0.006, 0.004, BH / 2 + 0.004), name="mailbox_door")
bevel(door, 0.004)
tab = prim("cube", mb, CHROME, loc=(0, BL / 2 + 0.014, z0 + BH - 0.03), scale=(0.018, 0.008, 0.012), name="mailbox_door_latch")
bevel(tab, 0.003)
prim("cylinder", mb, CHROME, loc=(0, BL / 2 + 0.006, z0 + 0.004), rot=(0, math.pi / 2, 0), vertices=12, radius=0.005, depth=BW, name="mailbox_door_hinge")
# flag on the right side, pivot + arm, raised
pv = Vector((-(BW / 2 + 0.008), -0.05, z0 + 0.06))   # flag on -X: after the 180 deg turn it faces the camera
prim("cylinder", mb, CHROME, loc=pv, rot=(0, math.pi / 2, 0), vertices=16, radius=0.012, depth=0.008, name="mailbox_flag_pivot")
arm = prim("cube", mb, FLAG, loc=(pv.x - 0.006, pv.y, pv.z + 0.12), scale=(0.003, 0.011, 0.13), name="mailbox_flag_arm")
fl = prim("cube", mb, FLAG, loc=(pv.x - 0.006, pv.y + 0.05, pv.z + 0.22), scale=(0.003, 0.055, 0.035), name="mailbox_flag")
bevel(arm, 0.002); bevel(fl, 0.002)
# house number 27 on both sides, white raised letters
for sx in (-1, 1):
    bpy.ops.object.text_add(location=(sx * (BW / 2 + 0.002), 0.11 * -sx, z0 + 0.035))
    t = bpy.context.active_object; t.data.body = "27"; t.data.size = 0.07; t.data.extrude = 0.0015
    t.data.align_x = 'CENTER'; t.rotation_euler = (math.pi / 2, 0, sx * math.pi / 2)
    t.data.materials.append(WHITE); t.name = "mailbox_number_27"; link(t, mb)
# flowers at the foot of the post
for i in range(26):
    a = R.uniform(0, 2 * math.pi); d = R.uniform(0.07, 0.26)
    base = Vector((d * math.cos(a), d * math.sin(a), 0)); hgt = R.uniform(0.16, 0.38)
    top = base + Vector((R.uniform(-0.04, 0.04), R.uniform(-0.04, 0.04), hgt))
    bezier_tube([base, base.lerp(top, 0.5) + Vector((0.01, 0, 0)), top], 0.0025, mb, STEM, "flower_stem")
    pm = [PETAL_Y, PETAL_P, PETAL_W][i % 3]
    for k in range(6):
        aa = k * math.pi / 3 + R.random() * 0.3
        p = prim("uv_sphere", mb, pm, loc=top + Vector((0.017 * math.cos(aa), 0.017 * math.sin(aa), 0)), radius=0.013, segments=10, ring_count=6, name="petal")
        p.scale = (1.4, 0.7, 0.25); p.rotation_euler.z = aa; smooth(p)
    smooth(prim("uv_sphere", mb, CENTRE, loc=top + Vector((0, 0, 0.004)), radius=0.009, segments=12, ring_count=6, name="flower_centre"))
    for k in range(2):   # leaves
        lf = prim("uv_sphere", mb, STEM, loc=base.lerp(top, 0.3 + 0.2 * k) + Vector((0.02, 0, 0)), radius=0.03, segments=10, ring_count=6, name="leaf")
        lf.scale = (1.0, 0.35, 0.08); lf.rotation_euler = (0.4, -0.6, R.uniform(0, 6.28)); smooth(lf)

# ================================================================== KID'S BIKE (16 inch, on its kickstand on the lawn)
bike = coll("kids_bike")
WR = 0.2; WB = 0.72          # wheel radius (with tyre), wheelbase; bike runs along X
rear = Vector((-WB / 2, 0, WR)); front = Vector((WB / 2, 0, WR))
bb = Vector((-0.06, 0, 0.17)); st_top = Vector((-0.17, 0, 0.55)); head_t = Vector((0.27, 0, 0.56)); head_b = Vector((0.3, 0, 0.44))
def wheel(c0, nm):
    t = prim("torus", bike, BLACK_RUB, loc=c0, rot=(math.pi / 2, 0, 0), major_radius=WR - 0.022, minor_radius=0.022, major_segments=64, minor_segments=14, name=nm + "_tyre")
    smooth(t)
    # tread blocks
    for k in range(48):
        a = 2 * math.pi * k / 48
        b_ = prim("cube", bike, BLACK_RUB, loc=c0 + Vector((WR * math.cos(a), 0, WR * math.sin(a))), scale=(0.006, 0.014, 0.004), name=nm + "_tread")
        b_.rotation_euler.y = -a + math.pi / 2
    wall = prim("torus", bike, GRIP_W, loc=c0 + Vector((0, 0, 0)), rot=(math.pi / 2, 0, 0), major_radius=WR - 0.03, minor_radius=0.0155, major_segments=64, minor_segments=10, name=nm + "_whitewall")
    smooth(wall)
    rim = prim("torus", bike, CHROME, loc=c0, rot=(math.pi / 2, 0, 0), major_radius=WR - 0.046, minor_radius=0.008, major_segments=64, minor_segments=8, name=nm + "_rim")
    smooth(rim)
    hub = prim("cylinder", bike, CHROME, loc=c0, rot=(math.pi / 2, 0, 0), vertices=20, radius=0.018, depth=0.07, name=nm + "_hub")
    smooth(hub)
    for k in range(28):   # laced spokes, alternating sides
        a = 2 * math.pi * k / 28; side = 0.028 if k % 2 else -0.028
        p0 = c0 + Vector((0.016 * math.cos(a + 0.6), side, 0.016 * math.sin(a + 0.6)))
        p1 = c0 + Vector(((WR - 0.05) * math.cos(a), 0, (WR - 0.05) * math.sin(a)))
        tube([p0, p1], 0.0012, bike, CHROME, nm + "_spoke")
    reflector = prim("cube", bike, REFL, loc=c0 + Vector((0.1, -0.003, 0.03)), scale=(0.02, 0.004, 0.008), name=nm + "_spoke_reflector")
    bevel(reflector, 0.003)
wheel(rear, "bike_rear"); wheel(front, "bike_front")
FT = 0.016
for a, b_ in [(bb, st_top), (bb, head_b), (st_top + Vector((0.02, 0, -0.04)), head_t + Vector((0, 0, -0.03))),
              (bb, rear + Vector((0, 0.04, 0))), (bb, rear + Vector((0, -0.04, 0))),
              (st_top + Vector((0, 0.01, -0.02)), rear + Vector((0, 0.04, 0))), (st_top + Vector((0, -0.01, -0.02)), rear + Vector((0, -0.04, 0)))]:
    tube([a, b_], FT if a == bb and b_ in (st_top, head_b) else 0.009, bike, BIKE_RED, "bike_frame_tube")
tube([head_b + Vector((0, 0, -0.02)), head_t + Vector((-0.004, 0, 0.03))], 0.02, bike, BIKE_RED, "bike_head_tube")
for sy in (0.035, -0.035):   # fork blades
    bezier_tube([head_b + Vector((0, sy * 0.6, -0.02)), head_b.lerp(front, 0.6) + Vector((0.02, sy, 0)), front + Vector((0.012, sy, 0))], 0.009, bike, BIKE_RED, "bike_fork")
# handlebar: stem, high-rise bar, white grips, streamers, bell
stem_top = head_t + Vector((-0.02, 0, 0.1))
tube([head_t + Vector((0, 0, 0.02)), stem_top], 0.012, bike, CHROME, "bike_stem")
bar = [stem_top + Vector((0.0, -0.26, 0.1)), stem_top + Vector((0.02, -0.2, 0.0)), stem_top + Vector((0.03, 0, 0)), stem_top + Vector((0.02, 0.2, 0.0)), stem_top + Vector((0.0, 0.26, 0.1))]
bezier_tube(bar, 0.0095, bike, CHROME, "bike_handlebar")
for sy in (-1, 1):
    g = prim("cylinder", bike, GRIP_W, loc=stem_top + Vector((-0.01, sy * 0.28, 0.13)), rot=(math.radians(-sy * 25), 0, 0), vertices=16, radius=0.016, depth=0.1, name="bike_grip")
    bevel(smooth(g), 0.006)
    for k in range(7):
        sm = [STREAM_A, STREAM_B][k % 2]
        st = prim("plane", bike, sm, loc=stem_top + Vector((-0.04 - 0.05, sy * (0.3 + 0.003 * k), 0.12 - 0.005 * k)), size=1, name="bike_streamer")
        st.scale = (0.1, 0.004, 1); st.rotation_euler = (math.pi / 2, R.uniform(-0.3, 0.1), R.uniform(-0.25, 0.25))
bl = prim("cylinder", bike, CHROME, loc=stem_top + Vector((0.02, 0.14, 0.03)), vertices=24, radius=0.022, depth=0.018, name="bike_bell")
smooth(bl)
smooth(prim("uv_sphere", bike, CHROME, loc=stem_top + Vector((0.02, 0.14, 0.045)), radius=0.022, segments=24, ring_count=8, name="bike_bell_dome"))
# saddle (banana-ish, white) on a chrome seat post
tube([st_top, st_top + Vector((-0.02, 0, 0.09))], 0.011, bike, CHROME, "bike_seatpost")
sd = prim("uv_sphere", bike, SADDLE, loc=st_top + Vector((-0.04, 0, 0.12)), radius=0.1, segments=24, ring_count=12, name="bike_saddle")
sd.scale = (1.3, 0.5, 0.25); smooth(sd)
# drivetrain: chainring with teeth, cranks, pedals, chain loop, rear cog, chain guard
bm4 = bmesh.new(); teeth = 32
for k in range(teeth * 2):
    a = 2 * math.pi * k / (teeth * 2); r = 0.075 if k % 2 else 0.069
    bm4.verts.new((r * math.cos(a), 0, r * math.sin(a)))
bm4.faces.new(bm4.verts); bmesh.ops.solidify(bm4, geom=bm4.faces[:], thickness=0.004)
me = bpy.data.meshes.new("bike_chainring"); bm4.to_mesh(me); bm4.free()
cr = bpy.data.objects.new("bike_chainring", me); bike.objects.link(cr); me.materials.append(CHROME); cr.location = bb + Vector((0, 0.045, 0))
cog = prim("cylinder", bike, CHROME, loc=rear + Vector((0, 0.045, 0)), rot=(math.pi / 2, 0, 0), vertices=32, radius=0.032, depth=0.004, name="bike_rear_cog")
ch = []
for k in range(41):
    t = k / 40
    if t < 0.5:
        a = math.pi / 2 + 2 * math.pi * t
        ch.append(bb + Vector((0.074 * math.cos(a), 0.047, 0.074 * math.sin(a))) if t < 0.25 else rear + Vector((0.034 * math.cos(a + math.pi / 2), 0.047, 0.034 * math.sin(a + math.pi / 2))))
ch = [bb + Vector((0, 0.047, 0.074)), rear + Vector((0, 0.047, 0.034)), rear + Vector((-0.034, 0.047, 0)), rear + Vector((0, 0.047, -0.034)),
      bb + Vector((0, 0.047, -0.074)), bb + Vector((0.074, 0.047, 0)), bb + Vector((0, 0.047, 0.074))]
tube(ch, 0.0035, bike, BLACK_RUB, "bike_chain")
guard = prim("cube", bike, CHROME, loc=bb.lerp(rear, 0.45) + Vector((0, 0.06, 0.03)), scale=(0.2, 0.003, 0.05), name="bike_chain_guard")
guard.rotation_euler.y = math.atan2(rear.z - bb.z, -(rear.x - bb.x)) * -1; bevel(guard, 0.012, 4)
for sy, ang in ((1, 0.5), (-1, 0.5 + math.pi)):
    cend = bb + Vector((0.09 * math.cos(ang), sy * 0.06, 0.09 * math.sin(ang)))
    tube([bb + Vector((0, sy * 0.05, 0)), cend], 0.008, bike, CHROME, "bike_crank")
    pd = prim("cube", bike, BLACK_RUB, loc=cend + Vector((0, sy * 0.05, 0)), scale=(0.035, 0.04, 0.01), name="bike_pedal")
    bevel(pd, 0.004)
    for dx in (-0.033, 0.033):
        prim("cube", bike, REFL, loc=cend + Vector((dx, sy * 0.05, 0)), scale=(0.003, 0.025, 0.007), name="bike_pedal_reflector")
# fenders, kickstand, rear reflector
for c0, a0, a1 in ((rear, 0.1, 2.6), (front, 0.6, 2.4)):
    fp = [c0 + Vector(((WR + 0.025) * math.cos(a), 0, (WR + 0.025) * math.sin(a))) for a in [a0 + (a1 - a0) * k / 14 for k in range(15)]]
    for sy in (-0.022, 0.022):
        tube([p + Vector((0, sy, 0)) for p in fp], 0.004, bike, CHROME, "bike_fender_edge")
    tube(fp, 0.017, bike, CHROME, "bike_fender")
ks = bb.lerp(rear, 0.25)
tube([ks + Vector((0, -0.04, 0)), Vector((ks.x - 0.06, -0.14, 0.004))], 0.007, bike, CHROME, "bike_kickstand")
rr_ = prim("cube", bike, REFL, loc=rear + Vector((-0.06, 0, WR + 0.03)), scale=(0.006, 0.02, 0.015), name="bike_rear_reflector")
bevel(rr_, 0.004)
for o in bike.objects:
    if o.type == 'MESH': smooth(o)
# LAYOUT: 'lying on the lawn'. Turn front to -Y, lay it on its right side (chain side up) at 82 deg so the
# handlebar end and the pedal prop it, then drop it onto the ground and centre the footprint.
bpy.context.view_layer.update()
lay = Matrix.Rotation(math.radians(-82), 4, 'Y') @ Matrix.Rotation(math.radians(-90), 4, 'Z')
for o in bike.objects:
    o.matrix_world = lay @ o.matrix_world
bpy.context.view_layer.update()
dg = bpy.context.evaluated_depsgraph_get(); blo = Vector((1e9,) * 3); bhi = -blo
for o in bike.objects:
    ev = o.evaluated_get(dg); me_ = ev.to_mesh()
    for v in me_.vertices:
        w = o.matrix_world @ v.co; blo = Vector(map(min, blo, w)); bhi = Vector(map(max, bhi, w))
    ev.to_mesh_clear()
shift = Matrix.Translation((-(blo.x + bhi.x) / 2, -(blo.y + bhi.y) / 2, -blo.z))
for o in bike.objects:
    o.matrix_world = shift @ o.matrix_world

# ================================================================== WATER (arc tube that breaks into drops, drops, splash crown)
water = coll("water")
wf = os.path.join(HERE, "water_points.json")
if os.path.exists(wf):
    WP = json.load(open(wf))
else:
    hp_ = [Vector(p_) for p_ in HP["points"]]; dvec = (hp_[-1] - hp_[-2]).normalized()
    tip = hp_[-1] + dvec * 0.166
    # splash point: the car roof above the driver-side front of the roof, found by a ray on the car (car-local -> world)
    cp = Vector(LAY.get("car", {}).get("pos", [0, 0, 0])); crot = math.radians(LAY.get("car", {}).get("blender_rot_z_deg", 0))
    CW = Matrix.Translation(cp) @ Matrix.Rotation(crot, 4, 'Z')
    bmc = bmesh.new()
    for o in meshes:
        me_ = o.data.copy(); me_.transform(o.matrix_world); bmc.from_mesh(me_); bpy.data.meshes.remove(me_)
    cbvh = BVHTree.FromBMesh(bmc); bmc.free()
    local = Vector((-0.35, -0.35, 4.0))      # roof, near (screen-left) side, just behind the windscreen header
    h_ = cbvh.ray_cast(local, Vector((0, 0, -1)))
    endp = CW @ (h_[0] if h_[0] is not None else Vector((local.x, local.y, 1.45)))
    WP = {"start": [round(c, 3) for c in tip], "end": [round(c, 3) for c in endp], "apex_z": round(max(tip.z, endp.z) + 0.55, 3), "drops": 64, "seed": 7,
          "note": "WORLD metres. start = nozzle tip, end = splash point on the car roof. Re-run or call hose_tool.make_water(start, end, apex_z)."}
    json.dump(WP, open(wf, "w"), indent=1)
WATER_STATS = HT.make_water(WP["start"], WP["end"], WP["apex_z"], coll=water, mat=WATER, n_drops=WP["drops"], seed=WP["seed"])

# ================================================================== place to LAYOUT.json (root empty named as the layout key)
def root(c, key, pos, rotz_deg):
    e = bpy.data.objects.new(key, None); e.empty_display_type = 'ARROWS'; e.empty_display_size = 0.3
    c.objects.link(e); e.location = pos; e.rotation_euler.z = math.radians(rotz_deg)
    for o in c.objects:
        if o is not e and o.parent is None:
            o.parent = e; o.matrix_parent_inverse = Matrix.Identity(4)
    return e
L_ = lambda k, d=(0, 0, 0): Vector(LAY.get(k, {}).get("pos", d))
gp = L_("grandpa"); gh = LAY.get("grandpa", {}).get("hands_world_local_xz", [[0, 1.1]])[0]
PLACED = {
    "car": (car, "car", L_("car"), LAY.get("car", {}).get("blender_rot_z_deg", 0)),
    "bucket": (bucket, "bucket", L_("bucket"), 0),
    "chamois": (cham, "chamois", L_("bucket"), 0),
    "sponge": (sponge, "sponge", gp + Vector((gh[0], 0, gh[1] - 0.06)), LAY.get("car", {}).get("blender_rot_z_deg", 0)),
    "hose_reel": (reel, "hose_reel", L_("hose_reel"), 0),
    "hose": (hose, "hose", Vector((0, 0, 0)), 0),
    "mailbox": (mb, "mailbox", L_("mailbox"), 180),
    "kids_bike": (bike, "bike", L_("bike"), -LAY.get("bike", {}).get("yaw_deg", 0)),
    "water": (water, "water", Vector((0, 0, 0)), 0),
}
for k, (c, key, pos, rz) in PLACED.items():
    root(c, key, pos, rz)
bpy.context.view_layer.update()

# ================================================================== finish: stats, ground origin check, save
stats = {}
for c in bpy.data.collections:
    objs = [o for o in c.all_objects]
    dg = bpy.context.evaluated_depsgraph_get(); tri = 0; lo = Vector((1e9,) * 3); hi = -lo
    for o in objs:
        if o.type not in ('MESH', 'CURVE', 'FONT'): continue
        ev = o.evaluated_get(dg)
        try: me = ev.to_mesh()
        except Exception: continue
        if me is None: continue
        me.calc_loop_triangles(); tri += len(me.loop_triangles)
        for v in me.vertices:
            w = o.matrix_world @ v.co; lo = Vector(map(min, lo, w)); hi = Vector(map(max, hi, w))
        ev.to_mesh_clear()
    stats[c.name] = {"objects": len(objs), "triangles": tri, "size_m": [round(hi.x - lo.x, 3), round(hi.y - lo.y, 3), round(hi.z - lo.z, 3)],
                     "min_z": round(lo.z, 4), "centre_xy": [round((lo.x + hi.x) / 2, 3), round((lo.y + hi.y) / 2, 3)]}
stats["_placed"] = {k: [round(x, 3) for x in v[2]] + [v[3]] for k, v in PLACED.items()}
stats["_car_extras"] = {"foam_blobs": CAR_FOAM_BLOBS, "wet_streaks": CAR_STREAKS}
stats["_water"] = WATER_STATS
json.dump(stats, open(os.path.join(HERE, "props_stats.json"), "w"), indent=1)
for k, v in stats.items(): print("STAT", k, v)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(HERE, "props.blend"), compress=True)
print("SAVED props.blend")
