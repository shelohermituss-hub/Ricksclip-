# bl_truck.py: the production truck from the downloaded 1940s American LaFrance (robinmikart, CC-BY 4.0).
# blender -b --factory-startup --python bl_truck.py -- <alf_1940s.glb> <tex dir (tex_make.py)> <out dir>
# Writes <out>/truck.glb (three.js staging; simple glTF materials, extras carry the part roles) and <out>/truck.blend (final render; the
# PHFD_paint node group, masking paper, everything packed). Same meshes, same names, same pivots in both. No date/time in any file content.
import bpy, sys, os, math, json, bmesh, mathutils
from mathutils import Vector, Matrix
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.append(HERE)
import paint_nodes, truck_api as T

GLB, TEX, OUT = sys.argv[sys.argv.index('--') + 1:][:3]
os.makedirs(OUT, exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene; sc.unit_settings.system = 'METRIC'
bpy.ops.import_scene.gltf(filepath=GLB)

# ---------------------------------------------------------------- 1. bake every transform: front -X, driver side -Y, wheels on z=0, centred
ROT = Matrix.Rotation(math.radians(-90), 4, 'Z')        # the asset's front is -Y, its driver (left, the gauges' side) +X
meshes = [o for o in sc.objects if o.type == 'MESH']
origp = {o.name: (o.parent.name if o.parent else '') for o in meshes}
for o in meshes:
    mw = o.matrix_world.copy()
    if o.data.users > 1: o.data = o.data.copy()
    o.parent = None; o.data.transform(ROT @ mw); o.matrix_world = Matrix.Identity(4)
for o in [o for o in sc.objects if o.type != 'MESH']: bpy.data.objects.remove(o)
def bbox(objs):
    mn = Vector((1e9,) * 3); mx = -mn
    for o in objs:
        for v in o.data.vertices: mn = Vector(map(min, mn, v.co)); mx = Vector(map(max, mx, v.co))
    return mn, mx
mn, mx = bbox(meshes); shift = Vector((-(mn.x + mx.x) / 2, -(mn.y + mx.y) / 2, -mn.z))
for o in meshes: o.data.transform(Matrix.Translation(shift))
mn, mx = bbox(meshes); SIZE = mx - mn
print('TRUCK size m', [round(v, 2) for v in SIZE])
for o in meshes: o['orig_parent'] = origp[o.name]
def bb(o):
    vs = [v.co for v in o.data.vertices]; a = Vector(map(min, *zip(*vs))) if False else Vector((min(v.x for v in vs), min(v.y for v in vs), min(v.z for v in vs)))
    b = Vector((max(v.x for v in vs), max(v.y for v in vs), max(v.z for v in vs))); return a, b
def mats(o): return [m.name for m in o.data.materials if m]

root = bpy.data.objects.new('TRUCK', None); root.empty_display_size = 1
col = bpy.data.collections.new('TRUCK'); sc.collection.children.link(col); col.objects.link(root)
for o in meshes:
    for c in o.users_collection: c.objects.unlink(o)
    col.objects.link(o); o.parent = root
def empty(name, loc, parent=root, part=None):
    e = bpy.data.objects.new(name, None); e.location = loc; e.empty_display_size = .2; col.objects.link(e); e.parent = parent
    if part: e['phfd_part'] = part
    return e
def adopt(child, piv):   # move the mesh's origin to the pivot and hang it there (no parent-inverse: clean glTF nodes)
    # piv hangs on root (identity): use piv.location, matrix_world is stale until a depsgraph update
    child.data.transform(Matrix.Translation(-piv.location)); child.parent = piv; child.location = (0, 0, 0)

# ---------------------------------------------------------------- 2. moving parts: wheels, driver's door, beacon
WHEEL_PARENTS = ('Cylinder.158', 'Cylinder.164', 'Cylinder.159', 'Cylinder.172')
wheels = {}
for wp in WHEEL_PARENTS:
    grp = [o for o in meshes if o['orig_parent'].startswith(wp + '_') or o['orig_parent'] == wp]
    tyre = next(o for o in grp if 'tyre_black' in mats(o)); a, b = bb(tyre); c = (a + b) / 2; r = (b.z - a.z) / 2
    nm = 'wheel_' + ('F' if c.x < 0 else 'R') + ('L' if c.y < 0 else 'R')
    piv = empty(nm, c, part='wheel'); piv['radius'] = r; piv.rotation_mode = 'XYZ'
    for o in grp: adopt(o, piv)
    wheels[nm] = (piv, c, r)
for o in meshes:   # hub drums (CHASSIS cylinders) turn with the nearest wheel
    if o.parent is root and 'CHASSIS' in mats(o) and o['orig_parent'].startswith('Cylinder.16'):
        a, b = bb(o); c = (a + b) / 2
        nm, (piv, wc, r) = min(wheels.items(), key=lambda kv: (kv[1][1] - c).length)
        if (wc - c).length < 0.6: adopt(o, piv)
print('WHEELS', {k: [round(x, 2) for x in v[1]] + [round(v[2], 3)] for k, v in wheels.items()})

door = [o for o in meshes if o['orig_parent'].startswith('Cube.001_')]
a = Vector((min(bb(o)[0].x for o in door), min(bb(o)[0].y for o in door), min(bb(o)[0].z for o in door)))
b = Vector((max(bb(o)[1].x for o in door), max(bb(o)[1].y for o in door), max(bb(o)[1].z for o in door)))
dpiv = empty('door_driver', Vector((a.x + 0.02, (a.y + b.y) / 2, (a.z + b.z) / 2)), part='door_driver')   # hinge on the door's front edge
for o in door: adopt(o, dpiv)
print('DOOR', [round(v, 2) for v in a], [round(v, 2) for v in b], 'side', 'driver -Y' if b.y < 0 else 'WRONG +Y')

bea = [o for o in meshes if o['orig_parent'].split('_')[0] in ('Cylinder', 'Cylinder.001', 'Cube', 'Cylinder.002')]
ba = Vector((min(bb(o)[0].x for o in bea), min(bb(o)[0].y for o in bea), min(bb(o)[0].z for o in bea)))
bbx = Vector((max(bb(o)[1].x for o in bea), max(bb(o)[1].y for o in bea), max(bb(o)[1].z for o in bea)))
bpiv = empty('beacon', Vector(((ba.x + bbx.x) / 2, (ba.y + bbx.y) / 2, ba.z)), part='beacon')
for o in bea:
    adopt(o, bpiv)
    if 'tail_light' in mats(o): o['phfd_part'] = 'beacon_dome'
print('BEACON', [round(v, 2) for v in ba], [round(v, 2) for v in bbx], len(bea), 'meshes')

# ---------------------------------------------------------------- 3. materials: rename, lettering texture, glass, dome
M = bpy.data.materials
def bsdf(m): return next(n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
body = M['van_paint_2']; body.name = 'body_paint'; body['phfd_role'] = 'paint'
B = bsdf(body); B.inputs['Base Color'].default_value = T.lin(T.RED); B.inputs['Metallic'].default_value = 0.0
for l in list(B.inputs['Roughness'].links) + list(B.inputs['Metallic'].links): body.node_tree.links.remove(l)
B.inputs['Roughness'].default_value = 0.3; B.inputs['Coat Weight'].default_value = 1.0; B.inputs['Coat Roughness'].default_value = 0.05
for o in meshes:   # the asset's yellow tool box (taxi_paint) would put lemon on a red truck: it takes the body paint
    for i, m in enumerate(o.data.materials):
        if m and m.name == 'taxi_paint': o.data.materials[i] = body
let = M['firetruck_writing']; let.name = 'letters_gold'; let['phfd_role'] = 'letters'
L = bsdf(let); img = next(n for n in let.node_tree.nodes if n.type == 'TEX_IMAGE')
img.image = bpy.data.images.load(os.path.join(TEX, 'truck_letters.png')); img.image.name = 'truck_letters'
if not L.inputs['Alpha'].links: let.node_tree.links.new(img.outputs['Alpha'], L.inputs['Alpha'])
L.inputs['Metallic'].default_value = 0.75; L.inputs['Roughness'].default_value = 0.28
try: let.surface_render_method = 'BLENDED'
except Exception: pass
gl = M['Glass']; G = bsdf(gl); G.inputs['Base Color'].default_value = (0.02, 0.025, 0.03, 1); G.inputs['Roughness'].default_value = 0.03
G.inputs['Metallic'].default_value = 0.0; G.inputs['Alpha'].default_value = 0.35
dome = M['tail_light'].copy(); dome.name = 'beacon_dome'
for o in bea:
    if o.get('phfd_part') == 'beacon_dome': o.data.materials[0] = dome
D = bsdf(dome); D.inputs['Base Color'].default_value = (0.8, 0.02, 0.02, 1); D.inputs['Emission Color'].default_value = (1, 0.05, 0.03, 1)
D.inputs['Emission Strength'].default_value = 0.0; D.inputs['Roughness'].default_value = 0.1; D.inputs['Alpha'].default_value = 0.6

def new_mat(name, col, metal=0.0, rough=0.4, coat=0.0, role=None):
    m = M.new(name); m.use_nodes = True; p = bsdf(m)
    p.inputs['Base Color'].default_value = T.lin(col) if isinstance(col, str) else col
    p.inputs['Metallic'].default_value = metal; p.inputs['Roughness'].default_value = rough; p.inputs['Coat Weight'].default_value = coat
    if role: m['phfd_role'] = role
    return m
BRASS = new_mat('brass_polished', '#d9a441', 1.0, 0.18)
CHROME = M['Metallic']
RIB = new_mat('ribbon_satin', '#f6f3ea', 0.0, 0.42); bsdf(RIB).inputs['Sheen Weight'].default_value = 0.6
IRON = new_mat('iron_dark', '#2a2a2c', 0.8, 0.45)

# ---------------------------------------------------------------- 4. the brass bell on a chrome yoke (front bumper, driver side; mirror of the siren)
def lathe(name, prof, mat, steps=40):
    bm = bmesh.new(); ring = []
    for k in range(steps):
        a = 2 * math.pi * k / steps; ring.append([bm.verts.new((r * math.cos(a), r * math.sin(a), z)) for r, z in prof])
    for k in range(steps):
        r0, r1 = ring[k], ring[(k + 1) % steps]
        for i in range(len(prof) - 1): bm.faces.new((r0[i], r1[i], r1[i + 1], r0[i + 1]))
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    for p in me.polygons: p.use_smooth = True
    o = bpy.data.objects.new(name, me); me.materials.append(mat); col.objects.link(o); return o
def cyl(name, r, h, mat, loc, rot=(0, 0, 0), parent=None, verts=16):
    bm = bmesh.new(); bmesh.ops.create_cone(bm, cap_ends=True, segments=verts, radius1=r, radius2=r, depth=h)
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free(); o = bpy.data.objects.new(name, me); me.materials.append(mat)
    col.objects.link(o); o.parent = parent; o.location = loc; o.rotation_euler = rot; return o
siren = [o for o in meshes if o['orig_parent'].startswith('Cylinder.183')]
sa, sb_ = bb(siren[0]); sc_ = (sa + sb_) / 2
bell_base = Vector((sc_.x, -sc_.y, sa.z))          # the free fender top on the driver side
bell_root = empty('bell', bell_base, part='bell'); AX = 0.36                 # axle height above the base
for s in (-1, 1): cyl('bell_yoke_post', 0.012, AX + 0.02, CHROME, (0, s * 0.16, AX / 2), parent=bell_root)
cyl('bell_yoke_base', 0.05, 0.02, CHROME, (0, 0, 0.01), parent=bell_root, verts=24)
cyl('bell_yoke_foot', 0.012, 0.06, CHROME, (0, 0, 0.04), parent=bell_root)
cyl('bell_axle', 0.009, 0.34, CHROME, (0, 0, AX), rot=(math.pi / 2, 0, 0), parent=bell_root)
for s in (-1, 1): cyl('bell_axle_nut', 0.016, 0.012, BRASS, (0, s * 0.172, AX), rot=(math.pi / 2, 0, 0), parent=bell_root, verts=6)
swing = empty('bell_swing', (0, 0, AX), parent=bell_root, part='bell_swing')
prof = [(0.135, -0.27), (0.128, -0.255), (0.108, -0.22), (0.092, -0.17), (0.084, -0.11), (0.078, -0.07), (0.062, -0.045), (0.03, -0.036), (0.0, -0.035)]
inner = [(0.0, -0.045), (0.026, -0.046), (0.054, -0.056), (0.07, -0.08), (0.075, -0.12), (0.083, -0.17), (0.098, -0.22), (0.118, -0.255), (0.126, -0.27)]
bell = lathe('bell_body', prof + inner, BRASS, 48); bell.parent = swing; bell['phfd_part'] = 'bell_body'
cyl('bell_crown', 0.02, 0.035, BRASS, (0, 0, -0.02), parent=swing)
cyl('bell_clapper_rod', 0.005, 0.17, IRON, (0, 0, -0.12), parent=swing, verts=8)
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.022, segments=16, ring_count=10); cl = bpy.context.object; cl.name = 'bell_clapper'
for c in cl.users_collection: c.objects.unlink(cl)
col.objects.link(cl); cl.parent = swing; cl.location = (0, 0, -0.215); cl.data.materials.append(IRON)
# pull cord to the cab
cyl('bell_pull_ring', 0.018, 0.006, BRASS, (0.04, 0, -0.03), rot=(0, math.pi / 2, 0), parent=swing)

# ---------------------------------------------------------------- 5. the mayor's white ribbon round the body + a bow on the nose (plan row 4)
RZ, RH = 0.86, 0.12
pts = []
for o in meshes:
    if 'body_paint' not in mats(o): continue
    for v in o.data.vertices:
        w = o.matrix_world @ v.co
        if abs(w.z - RZ) < 0.06: pts.append((w.x, w.y))
def hull(P):
    P = sorted(set((round(x, 3), round(y, 3)) for x, y in P))
    def cr(o, a, b): return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
    lo, up = [], []
    for p in P:
        while len(lo) >= 2 and cr(lo[-2], lo[-1], p) <= 0: lo.pop()
        lo.append(p)
    for p in reversed(P):
        while len(up) >= 2 and cr(up[-2], up[-1], p) <= 0: up.pop()
        up.append(p)
    return lo[:-1] + up[:-1]
H = hull(pts); cx = sum(p[0] for p in H) / len(H); cy = sum(p[1] for p in H) / len(H)
ring = []
for i in range(len(H)):   # resample + push out 2 cm along the averaged edge normals
    p0, p1 = Vector(H[i]), Vector(H[(i + 1) % len(H)]); n = int(max(1, (p1 - p0).length / 0.08))
    for k in range(n): ring.append(p0.lerp(p1, k / n))
out = []
for i, p in enumerate(ring):
    t = (ring[(i + 1) % len(ring)] - ring[i - 1]).normalized(); nrm = Vector((t.y, -t.x))
    if nrm.dot(p - Vector((cx, cy))) < 0: nrm = -nrm
    out.append(p + nrm * 0.02)
bm = bmesh.new(); vs = [(bm.verts.new((p.x, p.y, RZ - RH / 2)), bm.verts.new((p.x, p.y, RZ + RH / 2))) for p in out]
for i in range(len(vs)):
    a_, b_ = vs[i], vs[(i + 1) % len(vs)]; bm.faces.new((a_[0], b_[0], b_[1], a_[1]))
me = bpy.data.meshes.new('ribbon_band'); bm.to_mesh(me); bm.free(); rb = bpy.data.objects.new('ribbon_band', me); me.materials.append(RIB)
col.objects.link(rb); rb.parent = root; rb['phfd_part'] = 'ribbon'
sol = rb.modifiers.new('thick', 'SOLIDIFY'); sol.thickness = 0.003
front_x = min(p.x for p in out)
def strip(name, path, width, normal_axis):   # a flat ribbon strip along a 3D polyline, its width across normal_axis x tangent
    bm = bmesh.new(); prev = None
    for i, p in enumerate(path):
        t = (path[min(i + 1, len(path) - 1)] - path[max(i - 1, 0)]).normalized(); s = t.cross(normal_axis).normalized() * width / 2
        pair = (bm.verts.new(p - s), bm.verts.new(p + s))
        if prev: bm.faces.new((prev[0], pair[0], pair[1], prev[1]))
        prev = pair
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free(); o = bpy.data.objects.new(name, me); me.materials.append(RIB)
    col.objects.link(o); o.parent = root; o['phfd_part'] = 'ribbon'; o.modifiers.new('thick', 'SOLIDIFY').thickness = 0.003
    for p in o.data.polygons: p.use_smooth = True
    return o
bx = front_x - 0.035; X = Vector((1, 0, 0))
for s in (-1, 1):   # two loops, each a closed flat band seen face-on from the front, a little crumpled
    loop = []
    for k in range(41):
        a = 2 * math.pi * k / 40
        loop.append(Vector((bx - 0.03 * math.sin(a) ** 2, s * (0.19 + 0.17 * math.cos(a)), RZ + 0.02 + 0.085 * math.sin(a) + 0.04 * s * math.cos(a) * 0.3)))
    strip('ribbon_bow_loop', loop, 0.11, X)
for s in (-1, 1):   # two tails falling from the knot, swallow-tailed
    tail = [Vector((bx + 0.004 * k, s * (0.03 + 0.012 * k), RZ - 0.018 * k * 1.9)) for k in range(0, 22)]
    o = strip('ribbon_bow_tail', tail, 0.1, X)
    vz = min(v.co.z for v in o.data.vertices)
    for v in o.data.vertices:
        if v.co.z < vz + 0.02 and abs(v.co.y - tail[-1].y) < 0.02: v.co.z += 0.05   # the V cut in the tail end
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.045, segments=16, ring_count=10); kn = bpy.context.object; kn.name = 'ribbon_bow_knot'
for c in kn.users_collection: c.objects.unlink(kn)
col.objects.link(kn); kn.parent = root; kn.location = (bx - 0.01, 0, RZ + 0.01); kn.scale = (0.6, 1.0, 1.0); kn.data.materials.append(RIB); kn['phfd_part'] = 'ribbon'

# ---------------------------------------------------------------- 6. masking roles (half state: paper + tape on glass, lamps, chrome nose, tyres)
mask_n = 0
for o in [o for o in col.objects if o.type == 'MESH']:
    ms = mats(o)
    if o.get('phfd_part') == 'beacon_dome' or o.name.startswith(('bell', 'ribbon')): continue
    if any(m in ('Glass', 'headlight_glass', 'orange_light', 'tail_light', 'tyre_black') for m in ms) or (o['orig_parent'].split('_')[0] in ('Cube.268', 'Cube.290') and 'Metallic' in ms):
        o['mask'] = 1; mask_n += 1
print('MASKED parts', mask_n)

# ---------------------------------------------------------------- 7. anchors (named empties, read by assets.js and the final scene)
def ctr(objs):
    a = Vector((min(bb(o)[0].x for o in objs), min(bb(o)[0].y for o in objs), min(bb(o)[0].z for o in objs)))
    b = Vector((max(bb(o)[1].x for o in objs), max(bb(o)[1].y for o in objs), max(bb(o)[1].z for o in objs))); return a, b
pump = [o for o in meshes if o['orig_parent'].startswith('Cube.270_') and 'Metallic' in mats(o)]
pa, pb = ctr(pump)
AN = {'anchor_cab_door': (dpiv.location.x + 0.45, dpiv.location.y - 0.05, 1.15),
      'anchor_door_handle': (dpiv.location.x + 0.62, dpiv.location.y - 0.06, 1.42),
      'anchor_pump_panel': ((pa.x + pb.x) / 2, pa.y - 0.02, 1.2),
      'anchor_rear_step': (mx.x - 0.15, 0.0, 0.5),
      'anchor_bell': tuple(bell_base + Vector((0, 0, AX - 0.15))),
      'anchor_beacon': tuple(bpiv.location + Vector((0, 0, 0.12))),
      'anchor_nose': (mn.x, 0.0, 1.0),
      'anchor_ribbon_bow': (bx - 0.05, 0.0, RZ)}
for k, v in AN.items(): empty(k, Vector(v), part='anchor')

# ---------------------------------------------------------------- 8. apply modifiers, export the GLB (simple materials), then the Blender-only shading
dg = bpy.context.evaluated_depsgraph_get()
for o in [o for o in col.objects if o.type == 'MESH' and o.modifiers]:
    me = bpy.data.meshes.new_from_object(o.evaluated_get(dg)); o.modifiers.clear(); o.data = me
tris = 0
for o in col.objects:
    if o.type == 'MESH': o.data.calc_loop_triangles(); tris += len(o.data.loop_triangles)
sc.render.engine = 'CYCLES'; sc.view_settings.view_transform = 'Standard'
bpy.ops.object.select_all(action='DESELECT')
for o in col.objects: o.select_set(True)
glb = os.path.join(OUT, 'truck.glb')
bpy.ops.export_scene.gltf(filepath=glb, export_format='GLB', use_selection=True, export_extras=True, export_yup=True, export_apply=True,
                          export_image_format='AUTO', export_cameras=False, export_lights=False)
print('GLB', glb, round(os.path.getsize(glb) / 1e6, 1), 'MB', 'TRIS', tris)

# Blender-only: the paint group on body + letters, the masking paper
wear = bpy.data.images.load(os.path.join(TEX, 'wear.png')); wear.name = 'phfd_wear'
grp = paint_nodes.build_group(wear)
def hook(m, role):
    nt = m.node_tree; p = bsdf(m)
    tc = nt.nodes.new('ShaderNodeTexCoord'); tc.object = root
    g = nt.nodes.new('ShaderNodeGroup'); g.node_tree = grp; nt.links.new(tc.outputs['Object'], g.inputs['P'])
    if role == 'paint':
        nt.links.new(g.outputs['Color'], p.inputs['Base Color']); nt.links.new(g.outputs['Rough'], p.inputs['Roughness'])
    else:   # letters: alpha x (1 - under x CoverB)
        a_src = p.inputs['Alpha'].links[0].from_socket
        u = nt.nodes.new('ShaderNodeMath'); u.operation = 'MULTIPLY'; u.name = 'under'; u.inputs[1].default_value = 0.0
        nt.links.new(g.outputs['CoverB'], u.inputs[0])
        inv = nt.nodes.new('ShaderNodeMath'); inv.operation = 'SUBTRACT'; inv.inputs[0].default_value = 1.0; nt.links.new(u.outputs[0], inv.inputs[1])
        mul = nt.nodes.new('ShaderNodeMath'); mul.operation = 'MULTIPLY'; nt.links.new(a_src, mul.inputs[0]); nt.links.new(inv.outputs[0], mul.inputs[1])
        nt.links.new(mul.outputs[0], p.inputs['Alpha'])
hook(body, 'paint'); hook(let, 'letters')
paper = new_mat('mask_paper', (1, 1, 1, 1), 0.0, 0.85, role='mask'); nt = paper.node_tree; p = bsdf(paper)
tc = nt.nodes.new('ShaderNodeTexCoord'); tc.object = root
mp = nt.nodes.new('ShaderNodeVectorMath'); mp.operation = 'SCALE'; mp.inputs['Scale'].default_value = 1 / 0.8; nt.links.new(tc.outputs['Object'], mp.inputs[0])
ti = nt.nodes.new('ShaderNodeTexImage'); ti.image = bpy.data.images.load(os.path.join(TEX, 'newspaper.png')); ti.projection = 'BOX'; ti.projection_blend = 0.2
nt.links.new(mp.outputs[0], ti.inputs['Vector']); nt.links.new(ti.outputs['Color'], p.inputs['Base Color'])
T.set_paint(root, 'red')
bpy.ops.file.pack_all()
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, 'truck.blend'), compress=True)
json.dump(dict(size=[round(v, 3) for v in SIZE], tris=tris, wheels={k: dict(c=[round(x, 3) for x in v[1]], r=round(v[2], 3)) for k, v in wheels.items()},
               door_hinge=[round(x, 3) for x in dpiv.location], beacon=[round(x, 3) for x in bpiv.location], bell=[round(x, 3) for x in bell_base],
               anchors={k: [round(x, 3) for x in v] for k, v in AN.items()}, masked=mask_n, ribbon_z=RZ, roof_z=paint_nodes.ROOF_Z, cab_x=paint_nodes.CAB_X),
          open(os.path.join(OUT, 'truck_meta.json'), 'w'), indent=1)
print('TRUCK_DONE')
