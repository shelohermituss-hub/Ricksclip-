# bl_lamproom.py: builds THE LAMP ROOM BEHIND THE EYE (PLACE D, the signature, rows 36-39) in Blender 5 (set-builder 2026-11-21).
# blender -b --factory-startup --python bl_lamproom.py -- <assets/ph_lamproom> <window png dir> <out dir>
#   -> out/lamproom.blend (final), out/lamproom_lite.glb (kit: shell, iris with morph 'open', relay box, cables; NO lamps: the kit instances them),
#      out/lamproom_meta.json (anchors, cameras, lamp list for the kit, screen circles). Story: ../lamproom_STORY.md. Credits: assets/ASSETS.md.
# Frame: Blender metres, Z up, the eye axis is +Y (the pupil looks toward +Y, out at the dusk crossing). Prints LAMPROOM_DONE.
import bpy, bmesh, sys, os, json, math, random
import numpy as np
from mathutils import Vector, Matrix
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.append(HERE); import lamproom_api as API
a = sys.argv[sys.argv.index('--') + 1:]; PH, WIN, OUT = a[0], a[1], a[2]; os.makedirs(OUT, exist_ok=True)
L = API.L; R, YI, IR_OUT, PUP0, PUP1, DECK_Z, BULK_Y, RING_R, WIN_Y = (L[k] for k in ('R', 'YI', 'IR_OUT', 'PUP0', 'PUP1', 'DECK_Z', 'BULK_Y', 'RING_R', 'WIN_Y'))
bpy.ops.wm.read_factory_settings(use_empty=True); sc = bpy.context.scene; COL = sc.collection
rnd = random.Random(1970)
def lin(h):
    h = h.lstrip('#'); v = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return [(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4) for x in v] + [1.0]
RED, LEMON, BLUE = '#D3141C', '#E3EA22', '#3C6CFF'
KIND_HEX = dict(red=RED, green=LEMON, blue=BLUE)
# ---------------------------------------------------------------- materials
def pmat(name, col, rough=.5, metal=0., emit=None, es=0., alpha=None):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = lin(col) if isinstance(col, str) else col
    b.inputs['Roughness'].default_value = rough; b.inputs['Metallic'].default_value = metal
    if emit: b.inputs['Emission Color'].default_value = lin(emit); b.inputs['Emission Strength'].default_value = es
    m.use_fake_user = True; return m
def texmat(name, tex, tint, scale=1., rough_mul=1., metal=0., nstr=.6, coord='UV'):
    """a Poly Haven texture set tinted to our palette (diffuse luminance x tint), normal map, roughness map."""
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; N = nt.nodes; Lk = nt.links; b = N['Principled BSDF']
    tc = N.new('ShaderNodeTexCoord'); mp = N.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value = (scale, scale, scale)
    Lk.new(tc.outputs[coord], mp.inputs['Vector'])
    def img(kind, non_color):
        t = N.new('ShaderNodeTexImage'); t.image = bpy.data.images.load(os.path.join(PH, 'tex', '%s_%s_1k.jpg' % (tex, kind)))
        if non_color: t.image.colorspace_settings.name = 'Non-Color'
        if coord == 'Generated': t.projection = 'BOX'; t.projection_blend = .2
        Lk.new(mp.outputs[0], t.inputs['Vector']); return t
    d = img('diff', False); r = img('rough', True); n = img('nor_gl', True)
    mix = N.new('ShaderNodeMix'); mix.data_type = 'RGBA'; mix.blend_type = 'MULTIPLY'; mix.inputs['Factor'].default_value = 1.0
    ins = [i for i in mix.inputs if i.type == 'RGBA']; Lk.new(d.outputs[0], ins[0]); ins[1].default_value = lin(tint)
    outs = [o for o in mix.outputs if o.type == 'RGBA']; Lk.new(outs[0], b.inputs['Base Color'])
    mr = N.new('ShaderNodeMath'); mr.operation = 'MULTIPLY'; mr.inputs[1].default_value = rough_mul; Lk.new(r.outputs[0], mr.inputs[0]); Lk.new(mr.outputs[0], b.inputs['Roughness'])
    nm = N.new('ShaderNodeNormalMap'); nm.inputs['Strength'].default_value = nstr; Lk.new(n.outputs[0], nm.inputs['Color']); Lk.new(nm.outputs[0], b.inputs['Normal'])
    b.inputs['Metallic'].default_value = metal; m.use_fake_user = True; return m
M = {}
M['dome'] = texmat('dome_plates', 'metal_plate', '#4a3a86', scale=1., rough_mul=.9, metal=.35, nstr=.8)     # plum-indigo painted riveted plates (LOOK LR: deep violet dome)
M['bulk'] = texmat('bulkhead_plates', 'metal_plate_02', '#3e3274', scale=1., metal=.4, nstr=.8)
M['iris'] = texmat('iris_pleats', 'painted_metal_shutter', '#3a3aa8', scale=1., rough_mul=.55, metal=.3, nstr=.7)   # the back of the iris: indigo shutter cloth-metal, never flesh
# FIX 2: the deck darker (it is the plain band behind the captions in the room views)
M['deck'] = texmat('deck_grate', 'metal_grate_rusty', '#1d1a24', scale=1., metal=.25, nstr=1.)
M['chrome'] = pmat('chrome', '#e8e8ee', rough=.07, metal=1.)
M['chrome_refl'] = pmat('chrome_reflector', '#dcdce6', rough=.2, metal=1.)   # the headlamp's reflector bowl: a mirror read black in the entry tile, brushed reads as a silver funnel
M['brass'] = pmat('brass', '#c9a24a', rough=.28, metal=1.)
M['brass_dark'] = pmat('brass_dark', '#7d6330', rough=.45, metal=1.)
M['steel'] = pmat('steel_black', '#2a2733', rough=.4, metal=.8)
M['plate'] = pmat('housing_plate', '#2e2648', rough=.45, metal=.6)
M['rivet'] = pmat('rivet', '#9a8fb8', rough=.3, metal=1.)
M['cable'] = pmat('cable_cloth', '#1f1a2a', rough=.8)
M['cable_b'] = pmat('cable_cloth_plum', '#4a2f5e', rough=.75)
M['bakelite'] = pmat('bakelite', '#1a1418', rough=.3)
def bulbmat(kind, state, g=None):
    nm = 'bulb_%s_%s' % (kind, state) + ('_g%d' % g if g else ''); c = KIND_HEX[kind]
    if state == 'dead': return pmat(nm, [x * .18 for x in lin(c)[:3]] + [1], rough=.15)
    return pmat(nm, c, rough=.15, emit=c, es=API.E_ON if state == 'on' else API.E_FLICK)
# ---------------------------------------------------------------- mesh helpers
def mesh_obj(name, verts, faces, mat=None, uv=None, glb=True, smooth=True):
    me = bpy.data.meshes.new(name); me.from_pydata([tuple(v) for v in verts], [], [tuple(f) for f in faces]); me.update()
    if uv is not None:
        ul = me.uv_layers.new(name='UVMap'); idx = np.zeros(len(me.loops), dtype=np.int32); me.loops.foreach_get('vertex_index', idx)
        ul.data.foreach_set('uv', np.asarray(uv, dtype=np.float32)[idx].ravel())
    if smooth: me.shade_smooth()
    o = bpy.data.objects.new(name, me); COL.objects.link(o)
    if mat: me.materials.append(mat)
    o['glb'] = glb; return o
def revolve(name, prof, nseg, mat, glb=True, uvscale=1.):
    """surface of revolution about the Y axis; prof = [(r, y), ...]; normals face the axis side if prof runs front -> back."""
    V, F, UV = [], [], []
    for i, (r, y) in enumerate(prof):
        for j in range(nseg + 1):
            p = 2 * math.pi * j / nseg; V.append((r * math.cos(p), y, r * math.sin(p))); UV.append((p * max(r, .3) / uvscale, i * .1))
    W = nseg + 1
    for i in range(len(prof) - 1):
        for j in range(nseg): F.append((i * W + j, i * W + j + 1, (i + 1) * W + j + 1, (i + 1) * W + j))
    return mesh_obj(name, V, F, mat, UV, glb)
def prim(kind, mat, name, glb=True, **kw):
    getattr(bpy.ops.mesh, 'primitive_%s_add' % kind)(**kw); o = bpy.context.object; o.name = name
    o.data.materials.clear(); o.data.materials.append(mat); o['glb'] = glb; return o
def tri_count(o):
    o.data.calc_loop_triangles(); return len(o.data.loop_triangles)
# ---------------------------------------------------------------- 1 the dome (inside of the eye), cut at the iris and at the bulkhead
th0, th1 = math.acos(YI / R), math.acos(BULK_Y / R); NT, NP = 72, 160
V, F, UV = [], [], []
for i in range(NT + 1):
    th = th0 + (th1 - th0) * i / NT
    for j in range(NP + 1):
        p = 2 * math.pi * j / NP; V.append((R * math.sin(th) * math.cos(p), R * math.cos(th), R * math.sin(th) * math.sin(p))); UV.append((p * R / 2.2, th * R / 2.2))
for i in range(NT):
    for j in range(NP): F.append((i * (NP + 1) + j, (i + 1) * (NP + 1) + j, (i + 1) * (NP + 1) + j + 1, i * (NP + 1) + j + 1))
dome = mesh_obj('DOME', V, F, M['dome'], UV)
# bulkhead with the entry porthole, and the chrome reflector behind it (the inside of the headlamp: the camera comes in through it)
bulk = revolve('BULKHEAD', [(R * math.sin(th1) + .05, BULK_Y), (2.2, BULK_Y - .0), (1.25, BULK_Y), (RING_R + .02, BULK_Y)], 96, M['bulk'], uvscale=1.6)
refl = revolve('REFLECTOR', [(RING_R + 1.7 * k / 12, BULK_Y - .01 - 3.4 * (k / 12) ** 2) for k in range(13)], 96, M['chrome_refl'])
ring = prim('torus', M['chrome'], 'ENTRY_RING', major_radius=RING_R + .05, minor_radius=.075, major_segments=96, minor_segments=16, location=(0, BULK_Y + .03, 0), rotation=(math.pi / 2, 0, 0))
bez = revolve('ENTRY_BEZEL', [(RING_R + .12, BULK_Y + .045), (RING_R + .3, BULK_Y + .03), (RING_R + .34, BULK_Y + .0)], 96, M['chrome'])
for k in range(24):                                       # the headlamp's bezel ribs and three screws (the same rim as the pumper's headlamp)
    p = 2 * math.pi * k / 24; o = prim('cube', M['chrome'], 'bezel_rib_%d' % k, size=1, location=((RING_R + .22) * math.cos(p), BULK_Y + .05, (RING_R + .22) * math.sin(p)))
    o.scale = (.16, .02, .025); o.rotation_euler = (0, -p, 0)
for k in range(3):
    p = 2 * math.pi * k / 3 + .5; prim('cylinder', M['brass'], 'bezel_screw_%d' % k, vertices=12, radius=.035, depth=.03, location=((RING_R + .3) * math.cos(p), BULK_Y + .06, (RING_R + .3) * math.sin(p)), rotation=(math.pi / 2, 0, 0))
# ---------------------------------------------------------------- 2 the iris seen from the back: pleated ring with a chrome lip, shape key 'open'
NB = 48; NS = NB * 2; LIP = [(.075, -.07), (.03, -.085), (-.005, -.05), (0., .0), (.035, .03)]; KR = 9
def iris_verts(rin, amp):
    V = []
    for (dr, dy) in LIP:
        for j in range(NS + 1): p = 2 * math.pi * j / NS; V.append(((rin + dr) * math.cos(p), YI + dy, (rin + dr) * math.sin(p)))
    for k in range(KR + 1):
        f = k / KR; r = rin + .09 + f * (IR_OUT - rin - .09)
        for j in range(NS + 1):
            p = 2 * math.pi * j / NS; dy = (-amp if j % 2 == 0 else amp * .6) * math.sin(math.pi * min(1, f * 1.4 + .15)); V.append((r * math.cos(p), YI + dy, r * math.sin(p)))
    return V
V0 = iris_verts(PUP0, .15); V1 = iris_verts(PUP1, .22); W = NS + 1; F, UV = [], []
rows = len(LIP) + KR + 1
for i in range(rows - 1):
    for j in range(NS): F.append((i * W + j, i * W + j + 1, (i + 1) * W + j + 1, (i + 1) * W + j))
for i in range(rows):
    for j in range(W): UV.append((j / NS * 18, i / rows * 2.2))
# flat shading: the pleats read as folds (smooth made a vinyl-record sheen, tile 1)
iris = mesh_obj('IRIS', V0, F, M['iris'], UV, smooth=False); iris.data.materials.append(M['chrome'])
nlip = (len(LIP) - 1) * NS
for pi_, poly in enumerate(iris.data.polygons): poly.material_index = 1 if pi_ < nlip else 0
iris.shape_key_add(name='Basis'); kb = iris.shape_key_add(name='open'); kb.data.foreach_set('co', np.asarray(V1, dtype=np.float32).ravel())
irisbez = prim('torus', M['brass_dark'], 'IRIS_TRACK', major_radius=IR_OUT + .06, minor_radius=.09, major_segments=128, minor_segments=12, location=(0, YI - .03, 0), rotation=(math.pi / 2, 0, 0))
for k in range(32):
    p = 2 * math.pi * k / 32; prim('cylinder', M['rivet'], 'iris_bolt_%d' % k, vertices=8, radius=.035, depth=.05, location=((IR_OUT + .06) * math.cos(p), YI - .12, (IR_OUT + .06) * math.sin(p)), rotation=(math.pi / 2, 0, 0))
# ---------------------------------------------------------------- 3 the pupil window: the real crossing (town.blend render), red -> grey truck, dimmable
wm = bpy.data.materials.new('window_view'); wm.use_nodes = True; nt = wm.node_tree; N = nt.nodes; Lk = nt.links
for n in list(N): N.remove(n)
oo = N.new('ShaderNodeOutputMaterial'); em = N.new('ShaderNodeEmission'); em.name = 'win_emit'
ti = [N.new('ShaderNodeTexImage') for _ in range(2)]
for t, nm in zip(ti, ('window_red.png', 'window_grey.png')): t.image = bpy.data.images.load(os.path.join(WIN, nm)); t.extension = 'EXTEND'
mx = N.new('ShaderNodeMix'); mx.name = 'grey_mix'; mx.data_type = 'RGBA'; ins = [i for i in mx.inputs if i.type == 'RGBA']
Lk.new(ti[0].outputs[0], ins[0]); Lk.new(ti[1].outputs[0], ins[1]); Lk.new([o for o in mx.outputs if o.type == 'RGBA'][0], em.inputs['Color']); Lk.new(em.outputs[0], oo.inputs['Surface'])
wm.use_fake_user = True
# FIX 2: 9 -> 15 m (the exit flight through the open pupil saw the picture's top edge); bl_window renders a wider view to match (lens 28 x 9/15)
WIN_SIZE = 15.0; WIN_Z = 0.25
win = prim('plane', wm, 'WINDOW_VIEW', glb=False, size=WIN_SIZE, location=(0, WIN_Y, WIN_Z), rotation=(math.pi / 2, 0, 0))
win.visible_shadow = False
# ---------------------------------------------------------------- 4 the lamps: concentric rows round the eye axis, three kinds, three states, red in 4 wave groups
SP = .26; lamps = []
th = math.asin((IR_OUT + .12) / R)
while th < th1 - .02:
    n = int(2 * math.pi * R * math.sin(th) / SP); off = rnd.random() * 2 * math.pi
    for j in range(n):
        p = off + 2 * math.pi * j / n; pos = Vector((R * math.sin(th) * math.cos(p), R * math.cos(th), R * math.sin(th) * math.sin(p)))
        if pos.z < DECK_Z + .2: continue
        u = rnd.random(); kind = 'red' if u < .42 else ('green' if u < .80 else 'blue')
        s = rnd.random(); state = 'dead' if s < .05 else ('flick' if s < .11 else 'on')
        ph = (math.degrees(p) % 360); g = 1 + int(((135 - ph) % 360) // 90) if kind == 'red' else 0
        lamps.append(dict(p=pos, n=-pos.normalized(), kind=kind, state=state, g=g))
    th += SP / R
print('LAMPS', len(lamps), {k: sum(1 for l in lamps if l['kind'] == k) for k in ('red', 'green', 'blue')}, flush=True)
# source parts (hidden): housing = coded relay plate with 4 rivets + the Poly Haven socket; bulb = Poly Haven lightbulb_01
SRC = bpy.data.collections.new('SOURCES'); sc.collection.children.link(SRC)
def import_gltf(mid):
    before = set(bpy.data.objects); bpy.ops.import_scene.gltf(filepath=os.path.join(PH, 'models', mid, mid + '.gltf'))
    return [o for o in bpy.data.objects if o not in before]
def join(objs, name):
    for o in bpy.data.objects: o.select_set(False)
    ms = [o for o in objs if o.type == 'MESH']; others = [o for o in objs if o.type != 'MESH']
    for o in ms: o.select_set(True)
    bpy.context.view_layer.objects.active = ms[0]; bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    if len(ms) > 1: bpy.ops.object.join()
    o = bpy.context.object; o.name = name
    for x in others: bpy.data.objects.remove(x)
    return o
def bbox(o):
    bb = [o.matrix_world @ Vector(c) for c in o.bound_box]; return Vector([min(v[i] for v in bb) for i in range(3)]), Vector([max(v[i] for v in bb) for i in range(3)])
sock = import_gltf('pull_chain_light_socket')
keep = [o for o in sock if not o.name.endswith('_chain')]
for o in [o for o in sock if o.name.endswith('_chain')]: bpy.data.objects.remove(o)
sock = keep
sock = join(sock, 'SRC_socket'); sock.rotation_euler.x = math.pi; sock.scale = (1.3,) * 3; bpy.ops.object.transform_apply(rotation=True, scale=True)
mn, mx_ = bbox(sock); sock.location = (-(mn.x + mx_.x) / 2, -(mn.y + mx_.y) / 2, .022 - mn.z); bpy.ops.object.transform_apply(location=True)
SOCK_TOP = bbox(sock)[1].z
plate = prim('cube', M['plate'], 'SRC_plate', glb=False, size=1, location=(0, 0, .011)); plate.scale = (.215, .215, .022)
bv = plate.modifiers.new('bv', 'BEVEL'); bv.width = .004; bv.segments = 2
bpy.context.view_layer.objects.active = plate; bpy.ops.object.modifier_apply(modifier='bv')
parts = [plate, sock]
for sx in (-1, 1):
    for sy in (-1, 1): parts.append(prim('uv_sphere', M['rivet'], 'SRC_rv', glb=False, segments=8, ring_count=4, radius=.011, location=(sx * .085, sy * .085, .022)))
housing = join(parts, 'SRC_housing')
bulb0 = import_gltf('lightbulb_01'); bulb0 = join(bulb0, 'SRC_bulb'); mn, mx_ = bbox(bulb0); s = .095 / (mx_.x - mn.x); bulb0.scale = (s,) * 3; bpy.ops.object.transform_apply(scale=True)
mn, mx_ = bbox(bulb0); bulb0.location = (-(mn.x + mx_.x) / 2, -(mn.y + mx_.y) / 2, SOCK_TOP - .03 - mn.z); bpy.ops.object.transform_apply(location=True)
BULB_TIP = bbox(bulb0)[1].z
glass_slot = [i for i, s_ in enumerate(bulb0.material_slots) if 'glass' in s_.material.name][0]
for o in (housing, bulb0):
    for c in o.users_collection: c.objects.unlink(o)
    SRC.objects.link(o); o.hide_render = True; o.hide_viewport = True; o['glb'] = False
def instancer(name, pts, src):
    me = bpy.data.meshes.new(name + '_pts'); me.from_pydata([tuple(l['p']) for l in pts], [], []); me.update()
    at = me.attributes.new('nrm', 'FLOAT_VECTOR', 'POINT'); at.data.foreach_set('vector', np.asarray([tuple(l['n']) for l in pts], dtype=np.float32).ravel())
    o = bpy.data.objects.new(name, me); COL.objects.link(o); o['glb'] = False
    ng = bpy.data.node_groups.new(name + '_gn', 'GeometryNodeTree')
    ng.interface.new_socket('Geometry', in_out='INPUT', socket_type='NodeSocketGeometry'); ng.interface.new_socket('Geometry', in_out='OUTPUT', socket_type='NodeSocketGeometry')
    gi = ng.nodes.new('NodeGroupInput'); go = ng.nodes.new('NodeGroupOutput'); ip = ng.nodes.new('GeometryNodeInstanceOnPoints')
    oi = ng.nodes.new('GeometryNodeObjectInfo'); oi.inputs['Object'].default_value = src
    na = ng.nodes.new('GeometryNodeInputNamedAttribute'); na.data_type = 'FLOAT_VECTOR'; na.inputs['Name'].default_value = 'nrm'
    al = ng.nodes.new('FunctionNodeAlignRotationToVector'); al.axis = 'Z'
    ng.links.new(gi.outputs[0], ip.inputs['Points']); ng.links.new(oi.outputs['Geometry'], ip.inputs['Instance'])
    ng.links.new(na.outputs['Attribute'], al.inputs['Vector']); ng.links.new(al.outputs['Rotation'], ip.inputs['Rotation']); ng.links.new(ip.outputs[0], go.inputs[0])
    md = o.modifiers.new('inst', 'NODES'); md.node_group = ng; return o
instancer('LAMP_HOUSINGS', lamps, housing)
GROUPS = [('red', 'on', g) for g in (1, 2, 3, 4)] + [('red', 'flick', g) for g in (1, 2, 3, 4)] + [('red', 'dead', None)] + [(k, s_, None) for k in ('green', 'blue') for s_ in ('on', 'flick', 'dead')]
for kind, state, g in GROUPS:
    pts = [l for l in lamps if l['kind'] == kind and l['state'] == state and (g is None or l['g'] == g)]
    if not pts: continue
    src = bulb0.copy(); src.data = bulb0.data.copy(); src.name = 'SRC_bulb_%s_%s%s' % (kind, state, '_g%d' % g if g else ''); SRC.objects.link(src)
    src.material_slots[glass_slot].link = 'DATA'; src.data.materials[glass_slot] = bulbmat(kind, state, g)
    instancer('LAMPS_%s_%s%s' % (kind, state, '_g%d' % g if g else ''), pts, src)
# ---------------------------------------------------------------- 5 floor: the lamp man's grated catwalk, kick ring, ladder rail with brackets
rd = math.sqrt(R * R - DECK_Z * DECK_Z) - .02
deck = revolve('DECK', [(.0, 0), (rd, 0)], 128, M['deck'], uvscale=1.)
for v in deck.data.vertices: v.co = Vector((v.co.x, v.co.z, DECK_Z))
deck.data.uv_layers[0].data.foreach_set('uv', np.asarray([(deck.data.vertices[l.vertex_index].co.x / 1.2, deck.data.vertices[l.vertex_index].co.y / 1.2) for l in deck.data.loops], dtype=np.float32).ravel())
kick = mesh_obj('DECK_KICK', [(rd * math.cos(2 * math.pi * j / 128), rd * math.sin(2 * math.pi * j / 128), DECK_Z + h) for h in (0, .14) for j in range(129)], [(j, j + 1, 129 + j + 1, 129 + j) for j in range(128)], M['steel'])
RZ = DECK_Z + .55; rr = math.sqrt(R * R - RZ * RZ) - .22
prim('torus', M['brass_dark'], 'LADDER_RAIL', major_radius=rr, minor_radius=.03, major_segments=160, minor_segments=8, location=(0, 0, RZ))
for k in range(36):
    p = 2 * math.pi * k / 36; o = prim('cube', M['steel'], 'rail_bracket_%d' % k, size=1, location=((rr + .1) * math.cos(p), (rr + .1) * math.sin(p), RZ)); o.scale = (.22, .03, .05); o.rotation_euler.z = p
# ---------------------------------------------------------------- 6 the brass relay box (row 37 near thing): three switch rows, the red row drops with the wave
# FIX 2: legs .26 -> .02 (the box sits on a low skid): the lid line drops from 71.8 % to about 80 % of the CAM_ROOM frame, below the caption line (71.5 %)
BX, BY, BW, BD, BH, LEG = -0.62, -0.45, 1.1, .5, .72, .02; z0 = DECK_Z + LEG
box = prim('cube', M['brass'], 'RELAY_BOX', size=1, location=(BX, BY, z0 + BH / 2)); box.scale = (BW, BD, BH)
bv = box.modifiers.new('bv', 'BEVEL'); bv.width = .02; bv.segments = 3; bpy.context.view_layer.objects.active = box; bpy.ops.object.modifier_apply(modifier='bv')
lid = prim('cube', M['brass_dark'], 'RELAY_LID', size=1, location=(BX, BY, z0 + BH + .02)); lid.scale = (BW + .06, BD + .06, .04)
for sx in (-1, 1):
    for sy in (-1, 1): prim('cylinder', M['steel'], 'relay_leg', vertices=10, radius=.025, depth=LEG, location=(BX + sx * (BW / 2 - .06), BY + sy * (BD / 2 - .06), DECK_Z + LEG / 2))
FY = BY - BD / 2 - .004
pan = prim('cube', M['bakelite'], 'RELAY_PANEL', size=1, location=(BX, FY, z0 + BH * .52)); pan.scale = (BW - .12, .01, BH - .2)
for k in range(15):                                           # rivets round the front frame
    for zz in (z0 + .04, z0 + BH - .04): prim('uv_sphere', M['rivet'], 'relay_rivet', segments=8, ring_count=5, radius=.011, location=(BX - BW / 2 + .05 + k * (BW - .1) / 14, FY - .004, zz))
for sx in (-1, 1): o = prim('cube', M['brass_dark'], 'relay_hinge', size=1, location=(BX + sx * (BW / 2 + .005), FY + .05, z0 + BH / 2)); o.scale = (.02, .06, BH - .1)
IND = {}
def indmat(nm, c, es=6.):
    if nm not in IND: IND[nm] = pmat(nm, c, rough=.2, emit=c, es=es)
    return IND[nm]
rows_def = [('red', z0 + BH * .76), ('green', z0 + BH * .5), ('blue', z0 + BH * .26)]
for kind, zr in rows_def:
    for i in range(8):
        x = BX - BW / 2 + .14 + i * (BW - .28) / 7
        prim('cylinder', M['chrome'], 'switch_plate', vertices=16, radius=.032, depth=.012, location=(x, FY - .008, zr), rotation=(math.pi / 2, 0, 0))
        lv = prim('cylinder', M['chrome'], 'switch_lever_%s_%d' % (kind, i), vertices=10, radius=.009, depth=.075, location=(0, -.0375, 0), rotation=(math.pi / 2, 0, 0))
        bpy.ops.object.transform_apply(location=True, rotation=True); lv.location = (x, FY - .012, zr); lv.rotation_euler.x = math.radians(-35)
        knob = prim('uv_sphere', M['bakelite'], 'switch_knob', segments=10, ring_count=6, radius=.016, location=(0, -.075, 0)); bpy.ops.object.transform_apply(location=True); knob.parent = lv; knob.location = (0, 0, 0)
        if kind == 'red': lv['lever_group'] = 1 + i // 2
        mname = 'ind_red_g%d' % (1 + i // 2) if kind == 'red' else 'ind_%s' % kind
        prim('uv_sphere', indmat(mname, KIND_HEX[kind]), 'indicator', segments=12, ring_count=8, radius=.017, location=(x, FY - .01, zr + .075))
# Poly Haven parts on the catwalk: the meter on the relay box, the power cabinet on the right
for o in import_gltf('retro_multimeter'): o['glb'] = True
met = [o for o in bpy.data.objects if o.name.startswith('retro_multimeter') and o.type == 'MESH']
mr = bpy.data.objects.new('METER', None); COL.objects.link(mr)
for o in met:
    if o.parent is None: o.parent = mr
# FIX 2: the meter stood on the lid and crossed the caption line: it now sits on the deck at the box's west side, turned to the lens
mr.scale = (1.7,) * 3; mr.location = (BX - BW / 2 - .32, BY - .1, DECK_Z + .01); mr.rotation_euler.z = math.radians(-20)
pb = import_gltf('power_box_01'); pr_ = bpy.data.objects.new('POWER_CABINET', None); COL.objects.link(pr_)
for o in pb:
    o['glb'] = True
    if o.parent is None: o.parent = pr_
for o in pb:                                                  # repaint the cabinet to the room: its texture x a plum-steel tint
    for sl in getattr(o, 'material_slots', []):
        m = sl.material
        if not m or m.get('tinted'): continue
        # FIX 2: find the BSDF by type (the glTF import names it differently, so the tint never took) and tint a plain colour too
        nt = m.node_tree; b = next((n for n in nt.nodes if n.type == 'BSDF_PRINCIPLED'), None); lk = b.inputs['Base Color'].links if b else []
        if b and not lk:
            c0 = b.inputs['Base Color'].default_value; t_ = lin('#7a6aa0'); b.inputs['Base Color'].default_value = (c0[0] * t_[0], c0[1] * t_[1], c0[2] * t_[2], 1.)
            print('CABINET_TINT plain', m.name)
        if lk:
            print('CABINET_TINT linked', m.name)
            mx2 = nt.nodes.new('ShaderNodeMix'); mx2.data_type = 'RGBA'; mx2.blend_type = 'MULTIPLY'; mx2.inputs['Factor'].default_value = 1.
            i2 = [i for i in mx2.inputs if i.type == 'RGBA']; nt.links.new(lk[0].from_socket, i2[0]); i2[1].default_value = lin('#7a6aa0')
            nt.links.new([q for q in mx2.outputs if q.type == 'RGBA'][0], b.inputs['Base Color'])
        m['tinted'] = True
# FIX 2: the cabinet smaller and nearer so its top line also falls below the caption band
pr_.scale = (1.8,) * 3; pr_.location = (1.4, 0.15, DECK_Z); pr_.rotation_euler.z = math.radians(-30)
# ---------------------------------------------------------------- 7 cables: bundles up the meridians to junction boxes, a loom from the relay box
def cable(name, pts, r, mat):
    cu = bpy.data.curves.new(name, 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = r; cu.bevel_resolution = 2; sp = cu.splines.new('BEZIER'); sp.bezier_points.add(len(pts) - 1)
    for bp, p in zip(sp.bezier_points, pts): bp.co = p; bp.handle_left_type = bp.handle_right_type = 'AUTO'
    o = bpy.data.objects.new(name, cu); COL.objects.link(o); o.data.materials.append(mat); o['glb'] = True; o['curve'] = True; return o
cbox = [o for o in import_gltf('modular_electric_cables') if o.name.startswith('cable_box_4way')]
for o in [o for o in bpy.data.objects if o.name.startswith('cable_') and o.type == 'MESH' and o not in cbox and not o.name.startswith('cable_box_4way')]: bpy.data.objects.remove(o)
for o in [o for o in bpy.data.objects if o.type == 'EMPTY' and not o.children and o.name not in ('METER', 'POWER_CABINET')]: bpy.data.objects.remove(o)
cb = cbox[0]; cb.parent = None; cb.scale = (3.,) * 3
for k, phd in enumerate((205, 232, 308, 335, 250, 290)):
    p = math.radians(phd); thT = math.radians(34 + (k % 3) * 9); pts = []
    # walk along the meridian from the deck up toward the iris, keeping just in front of the lamp plates
    for i in range(14):
        t = i / 13; thx = math.radians(118) + (thT - math.radians(118)) * t; rr_ = R - .06
        pts.append(Vector((rr_ * math.sin(thx) * math.cos(p), rr_ * math.cos(thx), rr_ * math.sin(thx) * math.sin(p))))
    pts = [q for q in pts if q.z > DECK_Z + .05] or pts[-3:]
    for b_, dx in enumerate((-.035, 0, .035)):
        side = Vector((-math.sin(p), 0, math.cos(p))) * dx
        cable('cable_%d_%d' % (k, b_), [q + side for q in pts], .016, M['cable'] if b_ != 1 else M['cable_b'])
    j = cb.copy(); j.data = cb.data; COL.objects.link(j); j.location = pts[-1] * .985; j.rotation_euler = (-pts[-1]).to_track_quat('Y', 'Z').to_euler(); j['glb'] = True
bpy.data.objects.remove(cb)
for b_ in range(4):                                           # loom from the back of the relay box over the deck to the wall
    dx = -.15 + b_ * .1; cable('loom_%d' % b_, [Vector((BX + dx, BY + BD / 2, z0 + .3)), Vector((BX + dx, BY + BD / 2 + .3, DECK_Z + .03)), Vector((BX + dx - .6, 2.0, DECK_Z + .03)), Vector((BX + dx - 1.4, 3.6, DECK_Z + .05)), Vector((-2.1 + dx, 4.0, DECK_Z + .7))], .02, M['cable'] if b_ % 2 else M['cable_b'])
# ---------------------------------------------------------------- 8 light: the lamps light the room (fill points follow the wave), the pupil window's dusk
W_ = sc.world or bpy.data.worlds.new('w'); sc.world = W_; W_.use_nodes = True; W_.node_tree.nodes['Background'].inputs[0].default_value = lin('#120c24'); W_.node_tree.nodes['Background'].inputs[1].default_value = .3
def plight(name, pos, col, e, r=.4):
    ld = bpy.data.lights.new(name, 'POINT'); ld.color = lin(col)[:3]; ld.energy = e; ld.shadow_soft_size = r; o = bpy.data.objects.new(name, ld); COL.objects.link(o); o.location = pos; o['e'] = e; return o
for g in (1, 2, 3, 4):
    pc = math.radians(135 - 45 - 90 * (g - 1)); rrr = 3.6
    plight('fill_red_g%d' % g, (rrr * math.cos(pc), 1.2, rrr * math.sin(pc)), RED, 260)
    plight('fill_green_%d' % g, (rrr * math.cos(pc + .6), 0.0, rrr * math.sin(pc + .6)), LEMON, 170)
plight('fill_blue_top', (0, 2.0, 3.5), BLUE, 220); plight('fill_blue_low', (2.4, -1.0, -2.2), BLUE, 140); plight('fill_back', (0, -3.8, 1.0), '#8a6ad8', 120, 1.)
for k in range(8):                                            # raking light across the iris pleats (lamps on the iris track)
    p = 2 * math.pi * (k + .5) / 8; plight('iris_rake_%d' % k, ((IR_OUT + .05) * math.cos(p), YI - .45, (IR_OUT + .05) * math.sin(p)), LEMON if k % 2 else BLUE, 18, .08)
rf = bpy.data.lights.new('reflector_fill', 'AREA'); rf.shape = 'DISK'; rf.size = 4.4; rf.color = lin('#8a72c8')[:3]; rf.energy = 9
rfo = bpy.data.objects.new('reflector_fill', rf); COL.objects.link(rfo); rfo.location = (0, BULK_Y - 3.35, 0); rfo.rotation_euler = (math.radians(90), 0, 0); rfo['e'] = 9   # 160 blew the entry tile white (brightness .75)
ld = bpy.data.lights.new('window_light', 'AREA'); ld.shape = 'DISK'; ld.size = 2 * PUP0; ld.color = lin('#f0a878')[:3]; ld.energy = 420
wl = bpy.data.objects.new('window_light', ld); COL.objects.link(wl); wl.location = (0, YI - .35, 0); wl.rotation_euler = (math.radians(-90), 0, 0); wl['e'] = 420
# ---------------------------------------------------------------- 9 cameras (LOOK_BIBLE lens 24 mm on a 36 mm tall frame)
CAMS = dict(CAM_ROOM=dict(pos=[0, -2.6, -1.9], aim=[0, YI, -1.25]), CAM_ENTRY=dict(pos=[0, BULK_Y - 2.5, 0], aim=[0, YI, 0]),
            CAM_EXIT=dict(pos=[0, 3.0, -0.35], aim=[0, WIN_Y, 0.2]))
for n_, c in CAMS.items():
    cd = bpy.data.cameras.new(n_); cd.sensor_fit = 'VERTICAL'; cd.sensor_height = 36; cd.lens = 24; cd.clip_start = .02; cd.clip_end = 200
    o = bpy.data.objects.new(n_, cd); COL.objects.link(o); o.location = c['pos']; o.rotation_euler = (Vector(c['aim']) - Vector(c['pos'])).to_track_quat('-Z', 'Y').to_euler()
sc.camera = bpy.data.objects['CAM_ROOM']
r = sc.render; r.resolution_x, r.resolution_y, r.resolution_percentage = 540, 960, 100; r.engine = 'CYCLES'; sc.cycles.device = 'CPU'
sc.cycles.samples = 16
sc.cycles.use_denoising = True
sc.cycles.denoiser = 'OPENIMAGEDENOISE'
sc.cycles.max_bounces = 3
sc.cycles.caustics_reflective = False
sc.cycles.caustics_refractive = False
sc.cycles.use_adaptive_sampling = True
sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'None'
# lamp glow: compositor fog glow (Blender 5: compositing_node_group with a group output; glare settings are inputs)
try:
    ng = bpy.data.node_groups.new('lamproom_comp', 'CompositorNodeTree'); ng.interface.new_socket('Image', in_out='OUTPUT', socket_type='NodeSocketColor')
    rl = ng.nodes.new('CompositorNodeRLayers'); gl = ng.nodes.new('CompositorNodeGlare'); go = ng.nodes.new('NodeGroupOutput')
    gl.inputs['Type'].default_value = 'Fog Glow'; gl.inputs['Threshold'].default_value = 1.0; gl.inputs['Size'].default_value = .55; gl.inputs['Strength'].default_value = .7; gl.inputs['Quality'].default_value = 'Medium'
    ng.links.new(rl.outputs['Image'], gl.inputs['Image']); ng.links.new(gl.outputs['Image'], go.inputs[0]); sc.compositing_node_group = ng; print('GLOW ok')
except Exception as e: print('GLOW FAIL', repr(e))
API.set_state(sc, wave=0, iris=0, dim=1)
# ---------------------------------------------------------------- 10 meta for the kit + screen circles of the pupil / entry ring (for the headlamp match)
from bpy_extras.object_utils import world_to_camera_view
def circle_on(camname, c, rad, axis=Vector((0, 1, 0))):
    cam = bpy.data.objects[camname]; bpy.context.view_layer.update(); p0 = world_to_camera_view(sc, cam, Vector(c)); p1 = world_to_camera_view(sc, cam, Vector(c) + Vector((rad, 0, 0)))
    return dict(cx=round(p0.x, 4), cy_from_top=round(1 - p0.y, 4), r_frac_width=round(abs(p1.x - p0.x), 4))
meta = dict(frame='Blender metres, Z up, eye axis +Y; kit: B2T', layout=L,
    anchors=dict(entry_ring=dict(c=[0, BULK_Y + .03, 0], r=RING_R + .05), reflector_mouth=dict(c=[0, BULK_Y - 3.41, 0], r=RING_R + 1.7), room_centre=[0, -0.5, -1.2],
                 pupil=dict(c=[0, YI, 0], r_closed=PUP0, r_open=PUP1), exit_point=[0, YI + .8, 0], relay_box=[BX, BY, z0 + BH], window_view=dict(c=[0, WIN_Y, WIN_Z], size=WIN_SIZE), deck_z=DECK_Z),
    cams={k: dict(v, lens=24) for k, v in CAMS.items()},
    screen=dict(room_pupil_closed=circle_on('CAM_ROOM', (0, YI, 0), PUP0), room_pupil_open=circle_on('CAM_ROOM', (0, YI, 0), PUP1),
                entry_ring=circle_on('CAM_ENTRY', (0, BULK_Y + .03, 0), RING_R + .05), entry_pupil=circle_on('CAM_ENTRY', (0, YI, 0), PUP0)),
    headlamp=dict(note='pumper headlamp glass (truck frame, assets_prod truck.blend headlight_glass): centre x -3.50, y +-0.52, z 1.31, radius 0.109 m; chrome rim = ENTRY_RING profile'),
    housing_tip=round(BULB_TIP, 3), lamp_spacing=SP,
    lamps=[[round(l['p'].x, 3), round(l['p'].y, 3), round(l['p'].z, 3), ('red', 'green', 'blue').index(l['kind']), ('on', 'flick', 'dead').index(l['state']), l['g']] for l in lamps],
    lamp_columns='x y z kind(0 red 1 green 2 blue) state(0 on 1 flick 2 dead) wave_group(1-4 red, 0 others)')
# ---------------------------------------------------------------- 11 save the blend, then the lite GLB (curves to mesh on a copy, lamps excluded)
tris = 0
for o in sc.objects:
    if o.type == 'MESH' and o.get('glb'): tris += tri_count(o)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, 'lamproom.blend'))
print('BLEND saved, shell tris', tris, 'lamps', len(lamps), 'lamp tris (instanced)', len(lamps) * (tri_count(housing) + tri_count(bulb0)), flush=True)
for o in list(sc.objects):
    if o.get('curve'):
        for x in bpy.data.objects: x.select_set(False)
        o.select_set(True); bpy.context.view_layer.objects.active = o; bpy.ops.object.convert(target='MESH'); o['glb'] = True
for x in bpy.data.objects: x.select_set(False)
for o in sc.objects:
    if o.get('glb') or (o.type == 'EMPTY' and o.name in ('METER', 'POWER_CABINET')): o.select_set(True)
for m in bpy.data.materials:                                         # glTF drops emission strength 0 (LECONS 2026-11-20): export at 1, the kit sets the level
    if m.use_nodes and 'Principled BSDF' in m.node_tree.nodes:
        b = m.node_tree.nodes['Principled BSDF']
        if b.inputs['Emission Strength'].default_value == 0 and m.name.startswith('ind_'): b.inputs['Emission Strength'].default_value = 1
bpy.ops.export_scene.gltf(filepath=os.path.join(OUT, 'lamproom_lite.glb'), use_selection=True, export_format='GLB', export_morph=True, export_apply=False, export_yup=True)
gt = sum(tri_count(o) for o in sc.objects if o.select_get() and o.type == 'MESH')
meta['glb_tris'] = gt; json.dump(meta, open(os.path.join(OUT, 'lamproom_meta.json'), 'w'))
print('GLB_TRIS', gt, 'GLB_MB', round(os.path.getsize(os.path.join(OUT, 'lamproom_lite.glb')) / 1e6, 1))
print('SCREEN', json.dumps(meta['screen']))
print('LAMPROOM_DONE')
