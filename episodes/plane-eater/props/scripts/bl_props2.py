"""bl_props2.py: the plane-eater SMALL PROPS (round 2), built in code in the Rick recipe for props: simplified, clean, rounded bevels,
flat saturated paint, no grime, no red (red is only Michel's napkin). Library reused: helpers prim/tube/bezier_tube/lathe/bevel copied
from episodes/_style_test/props/build_props.py (st_prop_helpers), materials from its hose_tool.mat(); the dessert bike follows its
kids_bike_16 build (wheel with tyre, rim, hub, laced spokes, chainring, bell), simplified.
Run: blender -b --factory-startup --python bl_props2.py -- <out dir>
Each prop is one collection, exported to <out>/<name>.glb (+ props2.blend). Origin: HELD props at the GRIP point (the fist centre),
long axis +X (business end +X), up +Z; standing props on the ground/table at the footprint centre. Metres.
Writes props2_meta.json (size, grip, parts, tris per prop). Ends with PROPS2_DONE."""
import bpy, bmesh, sys, os, json, math, random
from mathutils import Vector, Matrix

OUT = sys.argv[sys.argv.index('--') + 1]
os.makedirs(OUT, exist_ok=True)
ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', '..'))
sys.path.insert(0, os.path.join(ROOT, 'episodes', '_style_test', 'props'))
import hose_tool as HT  # noqa: E402  (library: st materials)
R = random.Random(7)
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
FONT_R = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene


def hx(h):
    h = h.lstrip('#'); return tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))


M = lambda name, h, **k: HT.mat(name, hx(h), **k)
# ------------------------------------------------------------------ palette (CREATIVE + lead: white, navy, amber, cyan; NO red)
WHITE = M('p2_porcelain', '#f3f4f1', rough=.12, coat=1)
NAVY = M('p2_navy_paint', '#1d3461', rough=.25, coat=1)
ALU = M('p2_alu_cut', '#c7cbd0', metallic=1, rough=.28)
CHROME = M('p2_chrome', '#e6e8ec', metallic=1, rough=.06)
STEEL = M('p2_steel_brushed', '#b8bcc2', metallic=1, rough=.25)
SILVER = M('p2_silver_plate', '#eef0f2', metallic=1, rough=.1)
GOLD = M('p2_gold', '#e2b13c', metallic=1, rough=.18)
BRASS = M('p2_brass', '#c99a3e', metallic=1, rough=.22)
WOOD = M('p2_wood_warm', '#9a5a2c', rough=.35, coat=.6, grain=True)
WOOD_L = M('p2_wood_light', '#c8935a', rough=.45, grain=True)
GLASS = M('p2_glass', '#f4fbff', rough=.0, transmission=1, ior=1.5)
OIL = M('p2_oil_amber', '#f0a81c', rough=.05, transmission=.85, ior=1.47)
WATER = M('p2_water', '#d8f1ff', rough=.0, transmission=1, ior=1.33)
SALT = M('p2_salt', '#fbfbf8', rough=.7, noise=.4)
BLACK = M('p2_black', '#1b1c20', rough=.4)
CREAM = M('p2_cream_enamel', '#f2e6c8', rough=.2, coat=.8)
DIAL = M('p2_dial_white', '#fbfaf5', rough=.4)
ICING = M('p2_icing', '#fff6e6', rough=.35, sss=.2)
CAKE_BLUE = M('p2_icing_blue', '#bfe6f5', rough=.35)
BLUE = M('p2_blue_paint', '#2a62c9', rough=.22, coat=1)
TEAL = M('p2_teal_paint', '#1aa39a', rough=.22, coat=1)
RUBBER = M('p2_rubber', '#232326', rough=.6)
PAPER = M('p2_paper_ivory', '#fbf6e8', rough=.6)
INK = M('p2_ink_navy', '#1d3461', rough=.5)
YELLOW = M('p2_rag_yellow', '#f2c230', rough=.8, weave=True)
TRAY = M('p2_tray_greige', '#b9b3a3', rough=.45)
MEAL = M('p2_meal_greige', '#a9a294', rough=.6, noise=.3)
FOIL = M('p2_foil', '#d9dce0', metallic=1, rough=.32, noise=.5)
BREAD = M('p2_bread', '#d9a560', rough=.6, noise=.3)
SCREEN = M('p2_tv_screen', '#3c4a52', rough=.08, coat=1)
CLOTH_W = M('p2_cloth_white', '#f6f6f2', rough=.8, weave=True)
SEAT_BLUE = M('p2_cabin_blue', '#1f4fa0', rough=.6, weave=True)
CART_BLUE = M('p2_cart_handle_blue', '#2f7fd6', rough=.3, coat=.6)
TV_SILVER = M('p2_tv_trim', '#c9ccd1', metallic=1, rough=.2)

META = {}
CUR = {'c': None}


def coll(name):
    c = bpy.data.collections.new(name); sc.collection.children.link(c); CUR['c'] = c; return c


def link(o, c=None):
    c = c or CUR['c']
    for u in list(o.users_collection): u.objects.unlink(o)
    c.objects.link(o); return o


def smooth(o):
    if o.type == 'MESH':
        for p in o.data.polygons: p.use_smooth = True
    return o


def bevel(o, w=.003, seg=3):
    m = o.modifiers.new('bevel', 'BEVEL'); m.width = w; m.segments = seg; m.limit_method = 'ANGLE'; return o


def prim(kind, mat, loc=(0, 0, 0), rot=(0, 0, 0), scale=(1, 1, 1), name=None, bev=None, sm=True, **kw):
    getattr(bpy.ops.mesh, 'primitive_%s_add' % kind)(location=loc, rotation=rot, **kw)
    o = bpy.context.active_object; o.scale = scale
    if name: o.name = name
    if mat: o.data.materials.append(mat)
    link(o)
    if bev: bevel(o, bev)
    return smooth(o) if sm else o


def box(mat, loc, size, name='box', bev=.004, rot=(0, 0, 0)):
    return prim('cube', mat, loc=loc, rot=rot, scale=(size[0] / 2, size[1] / 2, size[2] / 2), name=name, bev=bev, sm=False)


def cyl(mat, loc, r, d, name='cyl', rot=(0, 0, 0), v=32, bev=None):
    return prim('cylinder', mat, loc=loc, rot=rot, vertices=v, radius=r, depth=d, name=name, bev=bev)


def tube(points, r, mat, name='tube', closed=False):
    cu = bpy.data.curves.new(name, 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = r; cu.bevel_resolution = 3; cu.use_fill_caps = True
    sp = cu.splines.new('POLY'); sp.points.add(len(points) - 1)
    for p, q in zip(sp.points, points): p.co = (*q, 1)
    sp.use_cyclic_u = closed
    o = bpy.data.objects.new(name, cu); CUR['c'].objects.link(o); cu.materials.append(mat); return o


def btube(points, r, mat, name='btube', res=12, closed=False):
    cu = bpy.data.curves.new(name, 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = r; cu.bevel_resolution = 3
    cu.use_fill_caps = True; cu.resolution_u = res
    sp = cu.splines.new('BEZIER'); sp.bezier_points.add(len(points) - 1)
    for b, q in zip(sp.bezier_points, points):
        b.co = q; b.handle_left_type = b.handle_right_type = 'AUTO'
    sp.use_cyclic_u = closed
    o = bpy.data.objects.new(name, cu); CUR['c'].objects.link(o); cu.materials.append(mat); return o


def lathe(profile, mat, name, seg=48, cap=True):
    """profile: (radius, z) list from the axis outward/inward; closed ends get a centre fan when radius 0."""
    bm = bmesh.new(); rings = []
    for (r, z) in profile:
        if r <= 1e-6:
            rings.append([bm.verts.new((0, 0, z))])
        else:
            rings.append([bm.verts.new((r * math.cos(2 * math.pi * i / seg), r * math.sin(2 * math.pi * i / seg), z)) for i in range(seg)])
    for a, b in zip(rings, rings[1:]):
        if len(a) == 1 and len(b) > 1:
            for i in range(seg): bm.faces.new((a[0], b[i], b[(i + 1) % seg]))
        elif len(b) == 1 and len(a) > 1:
            for i in range(seg): bm.faces.new((a[i], b[0], a[(i + 1) % seg]))
        elif len(a) > 1:
            for i in range(seg): bm.faces.new((a[i], a[(i + 1) % seg], b[(i + 1) % seg], b[i]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new(name, me); CUR['c'].objects.link(o); me.materials.append(mat); return smooth(o)


def text(body, mat, loc, size, rot=(0, 0, 0), name='text', font=FONT, extrude=.0004, align='CENTER'):
    cu = bpy.data.curves.new(name, 'FONT'); cu.body = body; cu.font = bpy.data.fonts.load(font, check_existing=True); cu.size = size
    cu.extrude = extrude; cu.align_x = align; cu.align_y = 'CENTER'
    o = bpy.data.objects.new(name, cu); CUR['c'].objects.link(o); o.location = loc; o.rotation_euler = rot; cu.materials.append(mat); return o


def poly_slab(pts, th, top_mat, side_mat, name, loc=(0, 0, 0)):
    """flat slab from a 2D outline (a bite, a tray pocket floor): top face top_mat, sides + bottom side_mat."""
    bm = bmesh.new(); vs = [bm.verts.new((x, y, 0)) for x, y in pts]; f = bm.faces.new(vs)
    ext = bmesh.ops.extrude_face_region(bm, geom=[f]); top = [g for g in ext['geom'] if isinstance(g, bmesh.types.BMVert)]
    bmesh.ops.translate(bm, vec=(0, 0, th), verts=top); bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    for fa in bm.faces: fa.material_index = 0 if fa.normal.z > .9 else 1
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free(); me.materials.append(top_mat); me.materials.append(side_mat)
    o = bpy.data.objects.new(name, me); CUR['c'].objects.link(o); o.location = loc; return o


def finish(name, grip=None, note=''):
    """convert curves/text to mesh, apply modifiers, record meta."""
    c = bpy.data.collections[name]
    for o in list(c.objects):
        if o.type in ('CURVE', 'FONT'):
            for s in sc.objects: s.select_set(False)
            o.select_set(True); bpy.context.view_layer.objects.active = o; bpy.ops.object.convert(target='MESH')
    bpy.context.view_layer.update(); dg = bpy.context.evaluated_depsgraph_get()
    lo, hi, n = Vector((1e9,) * 3), Vector((-1e9,) * 3), 0
    for o in c.objects:
        if o.type != 'MESH': continue
        ev = o.evaluated_get(dg); me = ev.to_mesh(); me.calc_loop_triangles(); n += len(me.loop_triangles)
        for v in me.vertices:
            w = o.matrix_world @ v.co; lo = Vector(map(min, lo, w)); hi = Vector(map(max, hi, w))
        ev.to_mesh_clear()
    META[name] = dict(size_m=[round(hi[i] - lo[i], 3) for i in range(3)], grip=grip or 'ground centre (origin)', parts=len(c.objects),
                      tris=n, note=note)


# ================================================================== FORK (held RIGHT hand; grip = origin, tines +X, concave up)
coll('fork')
box(STEEL, (0, 0, 0), (.11, .016, .006), 'fork_handle', bev=.0028)
box(STEEL, (.07, 0, .002), (.04, .009, .004), 'fork_neck', bev=.0015)
box(STEEL, (.105, 0, .006), (.035, .026, .003), 'fork_head', bev=.001, rot=(0, math.radians(-12), 0))
for k in range(4):
    box(STEEL, (.14, -.0099 + k * .0066, .010), (.04, .0036, .0025), 'fork_tine', bev=.0009, rot=(0, math.radians(-8), 0))
finish('fork', 'origin = fist centre on the handle; tines +X, 0.20 m long', 'brushed bistro steel, 4 tines with gaps, bevelled handle')

# ================================================================== KNIFE (held LEFT hand; grip = origin, blade +X, edge -Y)
coll('knife')
box(WOOD, (0, 0, 0), (.105, .019, .013), 'knife_handle', bev=.005)
for x in (-.032, 0, .032):
    cyl(BRASS, (x, 0, 0), .0028, .0145, 'knife_rivet', rot=(0, 0, 0), v=16)
box(STEEL, (.06, 0, 0), (.016, .02, .014), 'knife_bolster', bev=.003)
bm = bmesh.new()   # blade outline with a rounded tip and serrated edge
out = [(.068, .009), (.17, .009), (.205, .0)]
for k in range(12):
    x = .205 - k * .0115; out.append((x, -.008 - (.0016 if k % 2 else 0)))
out.append((.068, -.009))
poly_slab(out, .0022, STEEL, STEEL, 'knife_blade', loc=(0, 0, -.0011))
finish('knife', 'origin = fist centre on the handle; blade +X, edge -Y, 0.27 m', 'wood handle with 3 brass rivets, steel bolster, serrated blade')

# ================================================================== SALT SHAKER (held RIGHT hand, upside down when salting; grip = origin)
coll('salt_shaker')
g = lathe([(0, -.05), (.031, -.05), (.034, -.045), (.034, .03), (.031, .035), (.0, .035)], GLASS, 'shaker_glass', seg=8)   # faceted glass (8 sides)
g.modifiers.new('wall', 'SOLIDIFY').thickness = -.003
lathe([(0, -.047), (.03, -.047), (.03, .012), (0, .016)], SALT, 'shaker_salt', seg=24)
lathe([(.0315, .033), (.033, .036), (.033, .05), (.03, .058), (.02, .064), (0, .066)], CHROME, 'shaker_cap', seg=48)
for k in range(7):
    a = 2 * math.pi * k / 7; r = .012 if k else 0
    cyl(BLACK, (r * math.cos(a), r * math.sin(a), .0655), .0018, .002, 'shaker_hole', v=10)
finish('salt_shaker', 'origin = fist centre at 40 % height; cap +Z (turn it over to salt)', '8-facet glass, salt inside, chrome cap with 7 holes; 12 cm')

# ================================================================== HACKSAW (held RIGHT hand; grip = origin; blade forward +X)
coll('hacksaw')
fr = [(.05, 0, .07), (.05, 0, .11), (.40, 0, .11), (.42, 0, .09), (.42, 0, .02)]
tube(fr, .006, BLUE, 'hacksaw_frame')
tube([(.05, 0, .07), (.05, 0, .02)], .006, BLUE, 'hacksaw_frame_back')
bm = bmesh.new(); pts = [(.04, .006)]
for k in range(70):
    x = .04 + k * .0055; pts.append((x, -.006 if k % 2 else -.003))
pts += [(.43, -.003), (.43, .006)]
bl = poly_slab(pts, .0008, STEEL, STEEL, 'hacksaw_blade'); bl.rotation_euler = (math.pi / 2, 0, 0); bl.location = (0, .0004, .02)
for x in (.045, .425):
    cyl(STEEL, (x, 0, .02), .005, .02, 'hacksaw_pin', rot=(math.pi / 2, 0, 0), v=16)
cyl(STEEL, (.44, 0, .045), .004, .05, 'hacksaw_tension_screw', rot=(0, math.pi / 2, 0), v=16)
box(STEEL, (.47, 0, .045), (.008, .045, .012), 'hacksaw_wing_nut', bev=.004)
h = box(WOOD_L, (0, 0, 0), (.035, .03, .12), 'hacksaw_grip', bev=.012, rot=(0, math.radians(18), 0))
finish('hacksaw', 'origin = fist centre on the pistol grip; blade teeth down, cuts toward +X; 0.50 m', 'blue tube frame, 70-tooth blade on pins, wing-nut tension screw, wood grip')

# ================================================================== SUGAR TONGS (held RIGHT hand, little finger up; grip = origin at the bow)
coll('sugar_tongs')
for sy in (-1, 1):
    btube([(-.01, 0, 0), (.02, sy * .006, 0), (.06, sy * .009, 0), (.095, sy * .006, 0)], .0022, SILVER, 'tongs_arm')
    for k in range(3):
        box(SILVER, (.1, sy * .0045, -.004 + k * .004), (.008, .002, .0028), 'tongs_claw', bev=.0008, rot=(0, 0, sy * .3))
btube([(-.01, .0, 0), (-.02, 0, 0)], .004, SILVER, 'tongs_bow')
tube([(.02, -.007, .0024), (.05, -.0095, .0024)], .0007, GOLD, 'tongs_engraving')
finish('sugar_tongs', 'origin = fist centre at the spring bow; claws +X; 11 cm', 'silver-plate arms, spring bow, 3-claw ends, gilt engraving line')

# ================================================================== METAL BITES (6 shapes; painted face white or navy, aluminium edges)
coll('metal_bites')
shapes = [[(0, 0), (.035, 0), (.035, .033), (0, .034)], [(0, 0), (.04, .004), (.037, .03), (.003, .028)],
          [(0, 0), (.03, 0), (.034, .02), (.02, .036), (0, .03)], [(0, 0), (.042, 0), (.04, .022), (0, .024)],
          [(0, 0), (.028, .002), (.03, .03), (.0, .028)], [(0, 0), (.036, -.002), (.038, .036), (.002, .036)]]
for i, s in enumerate(shapes):
    face = NAVY if i in (1, 4) else WHITE
    b = poly_slab(s, .0015, face, ALU, f'bite_{i}', loc=((i % 3) * .06 - .06, (i // 3) * .06 - .03, 0))
    b.rotation_euler.z = R.uniform(-.4, .4)
    if i in (0, 3, 5):
        for k in range(2):
            prim('uv_sphere', ALU, loc=(b.location.x + .008 + k * .016, b.location.y + .008, .0015), radius=.0022, segments=12, ring_count=6,
                 name=f'bite_{i}_rivet', scale=(1, 1, .5))
    if i == 2:   # one bite carries a navy stripe across a white face
        box(NAVY, (b.location.x + .016, b.location.y + .016, .0016), (.03, .006, .0004), 'bite_2_stripe', bev=None)
finish('metal_bites', 'pick one by name bite_0..5 (sugar tongs, fork tines); each 3-4 cm, 1.5 mm sheet', 'white or navy painted face, aluminium cut edges, rivet heads on 3, a navy stripe on 1')

# ================================================================== PLATE (table; origin = plate centre on the table)
coll('plate')
lathe([(0, .004), (.085, .004), (.09, .0), (.095, .0), (.1, .006), (.128, .019), (.135, .021), (.136, .024), (.13, .023), (.1, .012),
       (.092, .009), (.0, .009)], WHITE, 'plate_body', seg=96)
lathe([(.131, .0236), (.1335, .0238), (.1335, .0242), (.131, .024)], SILVER, 'plate_rim_line', seg=96)
finish('plate', 'ground = table top; 27 cm', 'porcelain white like the Cessna skin, raised rim, silver rim line, foot ring')

# ================================================================== OIL WINE GLASS (held RIGHT hand by the stem; origin = stem grip)
coll('oil_glass')
gl = lathe([(0, -.075), (.036, -.075), (.038, -.072), (.006, -.068), (.004, -.02), (.006, .0), (.03, .02), (.042, .06), (.038, .105),
            (.036, .11)], GLASS, 'glass_body', seg=64)
gl.modifiers.new('wall', 'SOLIDIFY').thickness = .0015
lathe([(0, .004), (.03, .022), (.04, .05), (.0399, .052), (0, .052)], OIL, 'glass_oil', seg=64)
finish('oil_glass', 'origin = fist centre on the stem; bowl +Z; 18.5 cm', 'clear glass, amber mineral oil #f0a81c, thin stem, round foot, rim highlight')

# ================================================================== WATER JUG + TUMBLER (both hands on the jug: handle + under the spout)
coll('water_jug')
jg = lathe([(0, 0), (.07, 0), (.075, .01), (.078, .12), (.066, .2), (.06, .25), (.066, .28), (.0, .28)], GLASS, 'jug_body', seg=64)
jg.modifiers.new('wall', 'SOLIDIFY').thickness = .003
lathe([(0, .006), (.071, .006), (.074, .12), (.07, .17), (0, .17)], WATER, 'jug_water', seg=64)
btube([(-.07, 0, .23), (-.12, 0, .22), (-.125, 0, .12), (-.076, 0, .06)], .009, GLASS, 'jug_handle')
box(GLASS, (.07, 0, .272), (.03, .03, .012), 'jug_spout', bev=.005, rot=(0, math.radians(-20), 0))
for k in range(9):   # bubbles
    prim('uv_sphere', GLASS, loc=(R.uniform(-.05, .05), R.uniform(-.05, .05), R.uniform(.02, .16)), radius=R.uniform(.002, .004), segments=10,
         ring_count=6, name='jug_bubble')
tb = lathe([(0, 0), (.035, 0), (.038, .1), (0, .1)], GLASS, 'tumbler_body', seg=48); tb.location.x = .22
tb.modifiers.new('wall', 'SOLIDIFY').thickness = .003
tw = lathe([(0, .012), (.033, .012), (.035, .07), (0, .07)], WATER, 'tumbler_water', seg=48); tw.location.x = .22
finish('water_jug', 'origin = jug foot centre; grips: right hand on jug_handle (x -0.12, z 0.17), left under the spout; tumbler at +0.22 m',
       'jug 28 cm with handle + spout + bubbles; tumbler 10 cm, water lines')

# ================================================================== KITCHEN SCALE "2 lb / 900 g" (table; dial faces -Y)
coll('kitchen_scale')
box(CREAM, (0, 0, .1), (.2, .16, .2), 'scale_body', bev=.03)
box(CREAM, (0, 0, .005), (.22, .18, .01), 'scale_foot', bev=.004)
cyl(CHROME, (0, -.081, .11), .078, .008, 'scale_bezel', rot=(math.pi / 2, 0, 0), v=64)
cyl(DIAL, (0, -.085, .11), .071, .004, 'scale_dial', rot=(math.pi / 2, 0, 0), v=64)
for k in range(17):   # 0..4 lb over 300 deg, a long tick per pound
    a = math.radians(240 - k * 300 / 16); L = .014 if k % 4 == 0 else .007
    c = Vector((0, -.0875, .11)); p = c + Vector((math.cos(a) * (.064 - L / 2), 0, math.sin(a) * (.064 - L / 2)))
    box(BLACK, tuple(p), (L, .001, .0018), 'scale_tick', bev=None, rot=(0, -a, 0))
for lb in range(5):
    a = math.radians(240 - lb * 75); p = Vector((math.cos(a) * .045, -.0875, .11 + math.sin(a) * .045))
    text(str(lb), BLACK, tuple(p), .011, rot=(math.pi / 2, 0, 0), name='scale_num')
text('lb', BLACK, (0, -.0875, .13), .009, rot=(math.pi / 2, 0, 0), name='scale_unit')
text('2 lb / 900 g', INK, (0, -.0875, .082), .0105, rot=(math.pi / 2, 0, 0), name='scale_mark')
a2 = math.radians(240 - 2 * 75)   # needle exactly on 2 lb (straight up)
nd = box(BLACK, (math.cos(a2) * .028, -.0895, .11 + math.sin(a2) * .028), (.056, .001, .003), 'scale_needle', bev=None, rot=(0, -a2, 0))
cyl(CHROME, (0, -.0905, .11), .006, .004, 'scale_needle_hub', rot=(math.pi / 2, 0, 0), v=24)
cyl(CHROME, (0, 0, .205), .01, .012, 'scale_post', v=24)
lathe([(0, .212), (.1, .212), (.12, .23), (.125, .245), (.118, .244), (.1, .225), (0, .222)], CHROME, 'scale_pan', seg=64)
finish('kitchen_scale', 'ground = table top; dial faces -Y; needle node scale_needle (pivot = scale_needle_hub, 0..4 lb over 300 deg)',
       'cream enamel 1970s body, chrome bezel + pan, lb ticks 0-4, printed mark "2 lb / 900 g", black needle on 2 lb')

# ================================================================== DESSERT TROLLEY + CAKE TOWER (bike, cart, TV, coffin; no red)
coll('dessert_trolley')
TW, TD, TH = 1.0, .6, .8
for z in (.25, .72):
    box(WOOD_L, (0, 0, z), (TW, TD, .025), 'trolley_shelf', bev=.006)
    tube([(-TW / 2, -TD / 2, z + .02), (TW / 2, -TD / 2, z + .02), (TW / 2, TD / 2, z + .02), (-TW / 2, TD / 2, z + .02)], .007, CHROME,
         'trolley_gallery', closed=True)
for sx in (-1, 1):
    for sy in (-1, 1):
        tube([(sx * TW / 2, sy * TD / 2, .07), (sx * TW / 2, sy * TD / 2, TH)], .012, CHROME, 'trolley_leg')
        cyl(RUBBER, (sx * TW / 2, sy * TD / 2, .035), .035, .025, 'trolley_castor', rot=(math.pi / 2, 0, 0), v=24)
        box(CHROME, (sx * TW / 2, sy * TD / 2, .065), (.03, .03, .012), 'trolley_castor_fork', bev=.004)
btube([(-TW / 2, -TD / 2, TH), (-TW / 2 - .12, -TD / 2, TH + .1), (-TW / 2 - .12, TD / 2, TH + .1), (-TW / 2, TD / 2, TH)], .013, CHROME, 'trolley_push_bar')
# cake: three tiers (cream, pale blue piping), each with its dessert on top
z0 = .735
tiers = [(.46, .16), (.36, .16), (.26, .16)]
for i, (r, hgt) in enumerate(tiers):
    lathe([(0, z0), (r, z0), (r + .006, z0 + .01), (r + .006, z0 + hgt - .01), (r, z0 + hgt), (0, z0 + hgt)], ICING, f'cake_tier_{i}', seg=64)
    for zz in (z0 + .012, z0 + hgt - .006):
        tor = prim('torus', CAKE_BLUE, loc=(0, 0, zz), major_radius=r + .004, minor_radius=.012, major_segments=64, minor_segments=10, name='cake_piping')
    for k in range(10):   # cream swirls on the edge
        a = 2 * math.pi * k / 10; prim('uv_sphere', ICING, loc=(r * .85 * math.cos(a), r * .85 * math.sin(a), z0 + hgt + .012), radius=.025,
                                       segments=14, ring_count=8, scale=(1, 1, .7), name='cake_swirl')
    z0 += hgt
TOPS = [.735 + .16, .735 + .32, .735 + .48]


def mini_bike(cx, cz, s=.42):
    """after library kids_bike_16, simplified: 2 wheels (tyre, rim, hub, 16 spokes), frame, fork, bars, saddle, chainring, bell"""
    WR = .2 * s / .42 * .9
    for x in (-.36 * s / .42, .36 * s / .42):
        c = Vector((cx + x, 0, cz + WR))
        prim('torus', RUBBER, loc=c, rot=(math.pi / 2, 0, 0), major_radius=WR - .012, minor_radius=.012, major_segments=48, minor_segments=10, name='bike_tyre')
        prim('torus', CHROME, loc=c, rot=(math.pi / 2, 0, 0), major_radius=WR - .026, minor_radius=.004, major_segments=48, minor_segments=8, name='bike_rim')
        cyl(CHROME, tuple(c), .012, .04, 'bike_hub', rot=(math.pi / 2, 0, 0), v=16)
        for k in range(16):
            a = 2 * math.pi * k / 16; sy = .012 if k % 2 else -.012
            tube([c + Vector((.01 * math.cos(a), sy, .01 * math.sin(a))), c + Vector(((WR - .028) * math.cos(a), 0, (WR - .028) * math.sin(a)))], .0008, CHROME, 'bike_spoke')
    rear = Vector((cx - .36 * s / .42, 0, cz + WR)); front = Vector((cx + .36 * s / .42, 0, cz + WR))
    bb = Vector((cx - .03, 0, cz + WR * .9)); st = Vector((cx - .1, 0, cz + WR * 2.5)); ht = Vector((cx + .15, 0, cz + WR * 2.5)); hb = Vector((cx + .17, 0, cz + WR * 2))
    for a, b in ((bb, st), (bb, hb), (st, ht), (bb, rear), (st, rear), (hb, ht)):
        tube([a, b], .009, TEAL, 'bike_frame')
    tube([hb, front], .007, TEAL, 'bike_fork')
    tube([ht, ht + Vector((-.02, 0, .06))], .006, CHROME, 'bike_stem')
    btube([ht + Vector((-.05, -.13, .07)), ht + Vector((-.02, 0, .06)), ht + Vector((-.05, .13, .07))], .006, CHROME, 'bike_bar')
    prim('uv_sphere', BLACK, loc=st + Vector((-.01, 0, .04)), radius=.06, segments=16, ring_count=8, scale=(1.3, .5, .3), name='bike_saddle')
    cyl(CHROME, tuple(bb + Vector((0, .03, 0))), .04, .004, 'bike_chainring', rot=(math.pi / 2, 0, 0), v=32)
    prim('uv_sphere', CHROME, loc=ht + Vector((-.03, .07, .075)), radius=.014, segments=14, ring_count=7, name='bike_bell')


def mini_cart(cx, cz, s=.5):
    """shopping cart: wire basket (rods), child-seat flap, 4 castors, blue handle"""
    L, W, H, base = .55 * s / .5, .34 * s / .5, .22 * s / .5, cz + .17 * s / .5
    for k in range(12):
        x = cx - L / 2 + k * L / 11
        tube([(x, -W / 2, base), (x, -W / 2, base + H)], .0025, CHROME, 'cart_rod'); tube([(x, W / 2, base), (x, W / 2, base + H)], .0025, CHROME, 'cart_rod')
    for k in range(7):
        y = -W / 2 + k * W / 6; tube([(cx - L / 2, y, base), (cx + L / 2, y, base)], .0025, CHROME, 'cart_rod')
    for z in (base, base + H / 2, base + H):
        tube([(cx - L / 2, -W / 2, z), (cx + L / 2, -W / 2, z), (cx + L / 2, W / 2, z), (cx - L / 2, W / 2, z)], .004, CHROME, 'cart_rail', closed=True)
    box(CHROME, (cx - L / 2 + .01, 0, base + H * .65), (.006, W * .9, H * .6), 'cart_seat_flap', bev=.002)
    for sx in (-1, 1):
        for sy in (-1, 1):
            tube([(cx + sx * L * .42, sy * W * .4, base), (cx + sx * L * .42, sy * W * .4, cz + .04)], .006, CHROME, 'cart_leg')
            cyl(RUBBER, (cx + sx * L * .42, sy * W * .4, cz + .022), .022, .016, 'cart_castor', rot=(math.pi / 2, 0, 0), v=20)
    tube([(cx - L / 2, -W / 2, base + H), (cx - L / 2 - .07, -W / 2, base + H + .07)], .005, CHROME, 'cart_handle_arm')
    tube([(cx - L / 2, W / 2, base + H), (cx - L / 2 - .07, W / 2, base + H + .07)], .005, CHROME, 'cart_handle_arm')
    cyl(CART_BLUE, (cx - L / 2 - .07, 0, base + H + .07), .014, W + .02, 'cart_handle', rot=(math.pi / 2, 0, 0), v=20)


def mini_tv(cx, cz):
    """1970s TV: wood cabinet, curved screen, silver trim, 2 knobs, speaker grille, rabbit-ear antenna"""
    box(WOOD, (cx, 0, cz + .14), (.34, .26, .28), 'tv_cabinet', bev=.02)
    sc_ = prim('uv_sphere', SCREEN, loc=(cx - .03, -.1, cz + .15), radius=.2, segments=32, ring_count=16, scale=(.52, .14, .45), name='tv_screen')
    box(TV_SILVER, (cx - .03, -.128, cz + .15), (.235, .006, .2), 'tv_bezel', bev=.006)
    box(TV_SILVER, (cx + .13, -.131, cz + .15), (.05, .004, .2), 'tv_panel', bev=.003)
    for z in (.2, .14):
        cyl(BLACK, (cx + .13, -.136, cz + z), .014, .014, 'tv_knob', rot=(math.pi / 2, 0, 0), v=20, bev=.002)
    for k in range(4):
        box(BLACK, (cx + .13, -.134, cz + .06 + k * .012), (.035, .002, .004), 'tv_grille', bev=None)
    for sx in (-1, 1):
        tube([(cx, 0, cz + .28), (cx + sx * .12, .03, cz + .5)], .0025, CHROME, 'tv_antenna')
        prim('uv_sphere', CHROME, loc=(cx + sx * .12, .03, cz + .5), radius=.006, segments=10, ring_count=6, name='tv_antenna_tip')
    cyl(CHROME, (cx, 0, cz + .285), .02, .012, 'tv_antenna_base', v=20)
    for sx in (-1, 1):
        box(WOOD, (cx + sx * .14, 0, cz + .0), (.03, .03, .02), 'tv_foot', bev=.005)


def coffin(cx, cz, s=.42):
    """kid-safe cake topper: six-sided polished wooden box, lid seam, 3 brass handles per side, no cross"""
    L = s; Wm = .13 * s / .42; Wh = .1 * s / .42; We = .075 * s / .42
    out_ = [(-L / 2, -We / 2), (-L / 2 + L * .27, -Wm / 2), (L / 2, -Wh / 2), (L / 2, Wh / 2), (-L / 2 + L * .27, Wm / 2), (-L / 2, We / 2)]
    b = poly_slab(out_, .075 * s / .42, WOOD, WOOD, 'coffin_box', loc=(cx, 0, cz)); bevel(b, .004)
    l_ = poly_slab([(x * 1.04, y * 1.08) for x, y in out_], .02 * s / .42, WOOD, WOOD, 'coffin_lid', loc=(cx, 0, cz + .078 * s / .42)); bevel(l_, .005)
    for sy in (-1, 1):
        for k in range(3):
            x = cx - L * .3 + k * L * .28
            btube([(x - .02, sy * (Wm / 2 - .002), cz + .045), (x, sy * (Wm / 2 + .012), cz + .042), (x + .02, sy * (Wm / 2 - .002), cz + .045)], .0028, BRASS, 'coffin_handle')


mini_bike(.0, TOPS[0], .42)
mini_cart(.0, TOPS[1], .42)
mini_tv(.0, TOPS[2])
coffin(.0, TOPS[2] + .29, .42)
finish('dessert_trolley', 'ground = trolley castors; push bar at -X (Michel pushes/rings from there); tiers bottom->top: bike, cart, TV, coffin topper (node coffin_*)',
       'two-shelf chrome/maple trolley with gallery rails + castors; 3-tier cream cake with blue piping + swirls; teal bike, wire cart, wood 1970s TV, polished coffin')

# ================================================================== SILVER CLOCHE + SILVER BELL (held RIGHT hand by the knob)
coll('cloche_bell')
lathe([(0, .16), (.04, .158), (.09, .14), (.13, .1), (.15, .05), (.158, .012), (.165, .004), (.165, 0), (.155, 0), (.148, .04), (.12, .1),
       (.08, .135), (0, .148)], SILVER, 'cloche_dome', seg=96)
cyl(SILVER, (0, 0, .17), .018, .02, 'cloche_knob_stem', v=24)
prim('uv_sphere', SILVER, loc=(0, 0, .19), radius=.022, segments=24, ring_count=12, scale=(1, 1, .7), name='cloche_knob')
lathe([(0, 0), (.04, 0), (.045, .02), (.05, .05), (.04, .06), (.02, .065), (0, .066)], SILVER, 'bell_body', seg=48).location.x = .3
cyl(BLACK, (.3, 0, .085), .006, .04, 'bell_handle_stem', v=16).location.x = .3
prim('uv_sphere', WOOD, loc=(.3, 0, .11), radius=.012, segments=16, ring_count=8, name='bell_handle_knob')
finish('cloche_bell', 'cloche origin = plate centre (lift by cloche_knob); bell at +0.30 m, grip = bell_handle_knob',
       'cloche 33 cm polished silver with rolled rim + knob; table bell with wood knob')

# ================================================================== BOOK OF RECORDS + CERTIFICATE "STRANGEST DIET EVER" (no Guinness logo)
coll('record_book')
box(NAVY, (0, 0, .025), (.24, .31, .05), 'book_cover', bev=.004)
box(PAPER, (.006, 0, .025), (.235, .3, .042), 'book_pages', bev=.001)
box(NAVY, (-.118, 0, .025), (.012, .312, .052), 'book_spine', bev=.005)
text('BOOK OF', GOLD, (0, .07, .0505), .026, name='book_title_1')
text('RECORDS', GOLD, (0, .035, .0505), .03, name='book_title_2')
box(GOLD, (0, -.01, .0503), (.17, .004, .0006), 'book_rule', bev=None)
cyl(GOLD, (0, -.07, .0503), .03, .001, 'book_medal', v=48)
finish('record_book', 'both hands on the long edges; cover up +Z; 24 x 31 cm', 'navy cloth cover, gilt BOOK OF / RECORDS + rule + medal, ivory page block, round spine')

coll('certificate')
CW, CH = .40, .30
for nm, keep_corner in (('cert', True), ('cert_bitten', False)):
    ox = 0 if keep_corner else .5
    fr_ = [((-CW / 2, 0, -CH / 2), (CW / 2, 0, -CH / 2)), ((CW / 2, 0, -CH / 2), (CW / 2, 0, CH / 2)),
           ((CW / 2, 0, CH / 2), (-CW / 2, 0, CH / 2)), ((-CW / 2, 0, CH / 2), (-CW / 2, 0, -CH / 2))]
    for a, b in fr_:
        o = tube([Vector(a) + Vector((ox, 0, 0)), Vector(b) + Vector((ox, 0, 0))], .012, STEEL, nm + '_frame')
    box(PAPER, (ox, .004, 0), (CW - .02, .002, CH - .02), nm + '_paper', bev=None)
    text('STRANGEST DIET EVER', INK, (ox, -.0005, .075), .026, rot=(math.pi / 2, 0, 0), name=nm + '_title')
    text('awarded to', INK, (ox, -.0005, .03), .013, rot=(math.pi / 2, 0, 0), name=nm + '_line', font=FONT_R)
    text('MONSIEUR MANGETOUT', INK, (ox, -.0005, .0), .02, rot=(math.pi / 2, 0, 0), name=nm + '_name')
    text('1 Cessna 150, 1978 - 1980', INK, (ox, -.0005, -.035), .012, rot=(math.pi / 2, 0, 0), name=nm + '_detail', font=FONT_R)
    cyl(GOLD, (ox + .13, -.001, -.09), .03, .003, nm + '_seal', rot=(math.pi / 2, 0, 0), v=40)
    for k in range(2):
        box(NAVY, (ox + .12 + k * .02, -.001, -.13), (.012, .002, .05), nm + '_seal_ribbon', bev=None, rot=(0, (k - .5) * .4, 0))
    tube([(ox - .12, .015, .12), (ox, .02, .19), (ox + .12, .015, .12)], .0012, STEEL, nm + '_hanging_wire')
bpy.context.view_layer.update()
# bitten version: a round bite out of the upper-right corner of the frame (boolean, the cut shows bare steel)
cutter = prim('uv_sphere', None, loc=(.5 + CW / 2 - .005, 0, CH / 2 - .005), radius=.045, segments=24, ring_count=12, name='bite_cutter')
for o in list(bpy.data.collections['certificate'].objects):
    if o.name.startswith('cert_bitten') and o.type == 'CURVE':
        for s in sc.objects: s.select_set(False)
        o.select_set(True); bpy.context.view_layer.objects.active = o; bpy.ops.object.convert(target='MESH')
for o in list(bpy.data.collections['certificate'].objects):
    if o.name.startswith(('cert_bitten_frame', 'cert_bitten_paper')) and o.type == 'MESH':
        bo = o.modifiers.new('bite', 'BOOLEAN'); bo.object = cutter; bo.operation = 'DIFFERENCE'; bo.solver = 'EXACT'
cutter.hide_render = True; cutter.hide_viewport = True
finish('certificate', 'both hands on the sides; faces -Y; two versions: cert_* (whole) at x 0, cert_bitten_* (corner bitten, DIET 30.4) at x +0.5',
       'brushed steel frame, ivory paper, navy STRANGEST DIET EVER / MONSIEUR MANGETOUT, gold seal + navy ribbons, hanging wire; no Guinness logo')

# ================================================================== OWNER: YELLOW RAG + SPANNER
coll('owner_rag_spanner')
bpy.ops.mesh.primitive_grid_add(x_subdivisions=24, y_subdivisions=24, size=.36, location=(0, 0, 0))
rag = bpy.context.active_object; rag.name = 'rag'; link(rag); rag.data.materials.append(YELLOW)
for v in rag.data.vertices:   # folds: a crumpled hand-held rag hanging from the grip point
    x, y = v.co.x, v.co.y
    v.co.z = -.5 * (x * x + y * y) * 4 + .012 * math.sin(x * 40 + y * 13) + .008 * math.sin(y * 55)
    v.co.x *= 1 - .25 * abs(y) / .18
rag.modifiers.new('thick', 'SOLIDIFY').thickness = .002; smooth(rag)
sp_x = .35
tube([(sp_x - .08, 0, 0), (sp_x + .08, 0, 0)], .006, CHROME, 'spanner_shaft')
prim('torus', CHROME, loc=(sp_x + .095, 0, 0), major_radius=.015, minor_radius=.0055, major_segments=12, minor_segments=8, name='spanner_ring')
for sy in (-1, 1):
    box(CHROME, (sp_x - .1, sy * .014, 0), (.03, .008, .008), 'spanner_jaw', bev=.002, rot=(0, 0, sy * .25))
finish('owner_rag_spanner', 'rag origin = pinch point (owner\'s hand, polishing); spanner at +0.35 m, grip = shaft centre',
       '36 cm yellow cotton rag with folds + weave; chrome combination spanner (ring + open jaw)')

# ================================================================== AIRLINER MEAL TRAY (grey-beige #b9b3a3, the dull joke) + foil + roll
coll('airline_tray')
box(TRAY, (0, 0, .006), (.34, .25, .012), 'tray_base', bev=.004)
for (x, y, w_, d_) in ((-.06, .04, .2, .14), (.1, .04, .1, .14), (-.06, -.08, .2, .08), (.1, -.08, .1, .08)):
    tube([(x - w_ / 2, y - d_ / 2, .016), (x + w_ / 2, y - d_ / 2, .016), (x + w_ / 2, y + d_ / 2, .016), (x - w_ / 2, y + d_ / 2, .016)], .004, TRAY,
         'tray_divider', closed=True)
b_ = prim('uv_sphere', MEAL, loc=(-.06, .04, .02), radius=.07, segments=24, ring_count=12, scale=(1.2, .8, .22), name='meal_main')
for k in range(5):
    prim('uv_sphere', MEAL, loc=(-.1 + k * .02, -.08, .018), radius=.012, segments=10, ring_count=6, name='meal_peas')
bpy.ops.mesh.primitive_grid_add(x_subdivisions=14, y_subdivisions=10, size=.2, location=(-.06, .04, .05))
fo = bpy.context.active_object; fo.name = 'meal_foil_lid'; link(fo); fo.data.materials.append(FOIL); fo.scale = (1.05, .75, 1)
for v in fo.data.vertices: v.co.z += R.uniform(-.004, .004)
fo.rotation_euler = (math.radians(-35), 0, 0); fo.location = (-.06, .12, .07)
prim('uv_sphere', BREAD, loc=(.1, .04, .04), radius=.035, segments=20, ring_count=10, scale=(1.2, 1, .75), name='bread_roll')
box(GLASS, (.1, -.08, .03), (.09, .035, .012), 'cutlery_pack', bev=.004)
box(TRAY, (.1, -.08, .025), (.075, .02, .004), 'cutlery_plastic', bev=.001)
finish('airline_tray', 'ground = tray table; foil lid node meal_foil_lid (lift on 31.44); 34 x 25 cm',
       'grey-beige compartment tray, grey meal + peas, crinkled foil lid, bread roll, plastic cutlery pack')

# ------------------------------------------------------------------ export each prop
for cname in META:
    c = bpy.data.collections[cname]
    for s in sc.objects: s.select_set(False)
    for o in c.objects:
        if not o.hide_render: o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=os.path.join(OUT, cname + '.glb'), use_selection=True, export_format='GLB', export_apply=True, export_yup=True)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, 'props2.blend'), compress=True)
json.dump(META, open(os.path.join(OUT, 'props2_meta.json'), 'w'), indent=1)
for k, v in META.items(): print('PROP', k, v['size_m'], v['parts'], 'parts', v['tris'], 'tris')
print('PROPS2_DONE')
