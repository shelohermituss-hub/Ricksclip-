# assemble.py: the style-test still, ASSEMBLY round (look-finisher). Appends the departments' files at LAYOUT.json and adds the look:
#   set/set.blend (3d-designer), props/props.blend (props-hero, minus sponge/water/hose which are re-made here for the final cards),
#   cast/*.png + cards.json (character-artist) as self-lit upright cards + a fist overlay card in front of the 3D nozzle,
#   the hose re-routed to the kid's fists (props/hose_tool.py), the water arc from the nozzle tip over the hood to grandpa,
#   water / wet film / foam shading, one hard sun + Rick day sky (rick_light.json), shadow cards, contact patches, outline id pass, cast mask.
#   blender -b --factory-startup --python look/assemble.py -- <info|preview|final> [out_png]      env SPP, PCT, EXPO, FILL, THREADS
import bpy, sys, os, json, math, time, random
from mathutils import Vector, Matrix
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); EP = os.path.normpath(os.path.join(HERE, '..')); ROOT = os.path.normpath(os.path.join(EP, '..', '..'))
args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else ['info']
MODE = args[0]; OUT_PNG = args[1] if len(args) > 1 else os.path.join(HERE, 'prev', 'asm_raw.png')
RL = json.load(open(os.path.join(ROOT, 'templates', 'blender_look', 'rick_light.json')))['day']
LAY = json.load(open(os.path.join(EP, 'LAYOUT.json'))); CJ = json.load(open(os.path.join(EP, 'cast', 'cards.json')))
sys.path.insert(0, os.path.join(EP, 'props')); import hose_tool as HT
sys.path.append(os.path.join(ROOT, 'templates', 'blender_look', 'rick_outline')); import lines_key as LK

def lin(h):
    h = h.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple([(x / 12.92 if x <= .04045 else ((x + .055) / 1.055) ** 2.4) for x in c] + [1.0])

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene

# ---------------- append the departments' collections (no links: one self-contained scene.blend)
def append(path, names):
    with bpy.data.libraries.load(path, link=False) as (src, dst): dst.collections = [n for n in src.collections if n in names]
    for c in dst.collections:
        if c is not None: sc.collection.children.link(c)
    return dst.collections
append(os.path.join(EP, 'set', 'set.blend'), ['SET_style_test'])
with bpy.data.libraries.load(os.path.join(EP, 'set', 'set.blend'), link=False) as (src, dst): dst.collections = ['Line'] if 'Line' in src.collections else []
_lc = bpy.data.collections.get('Line')
if _lc:
    import re
    SET_LINE_NAMES = {re.sub(r'\.\d{3}$', '', o.name) for o in _lc.all_objects}
    for o in list(_lc.all_objects):
        if o.name not in sc.objects: bpy.data.objects.remove(o)
    bpy.data.collections.remove(_lc)
else: SET_LINE_NAMES = set()
PROPS = append(os.path.join(EP, 'props', 'props.blend'), ['mailbox', 'kids_bike', 'hose_reel', 'chamois', 'car', 'bucket'])
for lib in list(bpy.data.libraries): bpy.data.libraries.remove(lib)
bpy.context.view_layer.update()
SET_LINE = {n for n in SET_LINE_NAMES if n in sc.objects}
print('SET_LINE objects', len(SET_LINE))
print('TREE_MATS', [m.name for m in bpy.data.materials if 'tree' in m.name.lower() or 'leaf' in m.name.lower()])

# mailbox: onto the right lawn near the lens, right edge, clear of grandpa (the LAYOUT point lands on the drive); set local (2.5, -4.0) -> world
SM = json.load(open(os.path.join(EP, 'set', 'set_meta.json'))); RW = Matrix(SM['root_matrix_world'])
mb = bpy.data.objects.get('mailbox')
if mb: mb.location = (RW @ Vector((2.5, -4.0, 0))).to_3d(); mb.location.z = 0; mb.rotation_euler.z = math.radians(180 - 26)

# ---------------- camera (LAYOUT)
C = LAY['camera']; cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); sc.collection.objects.link(cam); sc.camera = cam
cam.location = C['loc']; cam.rotation_euler = (math.radians(90 + C['look_dir_deg']['pitch_up']), 0, math.radians(C['look_dir_deg']['heading_from_+Y']))
cam.data.lens = C['lens_mm']; cam.data.sensor_fit = 'VERTICAL'; cam.data.sensor_height = C['sensor_mm']; cam.data.clip_start = .05; cam.data.clip_end = 1500
r = sc.render; r.resolution_x, r.resolution_y = C['res']
CAMP = Vector(C['loc'])

# ---------------- LIBRARY nature (CB_RULES section 3 point 1b + THE ASSET LIBRARY): rick_tree + rick_grass replace the set's trees and lawn
sys.path.insert(0, os.path.join(ROOT, 'library', 'trees')); sys.path.insert(0, os.path.join(ROOT, 'library', 'grass'))
import rick_tree as RT_, rick_grass as G
OLD_TREES = []
for o in list(sc.objects):
    if o.name.startswith(('far_tree_', 'hero_tree')):
        if not o.name.endswith('_fill'): OLD_TREES.append((o.name, o.matrix_world.translation.copy(), o.dimensions.z))
        bpy.data.objects.remove(o)
for n in ('grass_near_blades', 'lawn_hair'):
    if bpy.data.objects.get(n): bpy.data.objects.remove(bpy.data.objects[n])
LAWN_M = G.lawn_material()
soil = bpy.data.objects.get('lawn_soil')
if soil: soil.data.materials.clear(); soil.data.materials.append(LAWN_M)
NATURE = []
for name, pos, hgt in OLD_TREES:
    if name.startswith('hero_tree'):
        h = 9.5; t_ = RT_.make_tree('yard_tree', height=h, crown_width=7.8 * h / 8, n_clumps=28, seed=3, lod='near', crown_height=h * .64)
        t_.location = (pos.x, pos.y, 0); HERO_TREE = t_
    else:
        dist = (pos.xy - CAMP.xy).length; lod = 'mid' if dist < 30 else 'far'
        seed = sum(map(ord, name)); shp = [(7.8, 28, .64), (6.2, 18, .72), (7.4, 22, .74)][seed % 3]
        t_ = RT_.make_tree(name.replace('far_tree', 'lib_tree'), height=hgt, crown_width=shp[0] * hgt / 8, n_clumps=shp[1], seed=seed, lod=lod, crown_height=hgt * shp[2])
        t_.location = (pos.x, pos.y, 0); t_.rotation_euler.z = (seed % 628) / 100
    NATURE.append(t_)
bpy.context.view_layer.update()
SMi = Matrix(json.load(open(os.path.join(EP, 'set', 'set_meta.json')))['root_matrix_world']); SMinv = SMi.inverted()
def on_lawn(p):
    l = SMinv @ Vector((p[0], p[1], 0))
    if abs(l.x) < 1.85 and -11.8 < l.y < 9.2: return False
    if 1.7 < l.x < 2.5 and -2.6 < l.y < 2.9: return False
    return l.y > -9.0
# a band of tall tufts in front of the lens (lawn only, never on the drive)
fwd = Vector((-math.sin(math.radians(C['look_dir_deg']['heading_from_+Y'])), math.cos(math.radians(C['look_dir_deg']['heading_from_+Y'])), 0)); side = Vector((fwd.y, -fwd.x, 0))
rnd_ = random.Random(7); band = []
for _ in range(900):
    d = 1.0 + 1.5 * rnd_.random(); q = CAMP.xy.to_3d() + fwd * d + side * ((rnd_.random() * 2 - 1) * d * .45); q.z = 0
    if on_lawn(q): band.append((q.x, q.y, 0.0))
TUFTS = [G.tufts(band, height=.26, lod='near', seed=7, name='tufts_lens')]
# both drive edges, on the lawn side
L0 = [tuple(SMi @ Vector((-1.75, y, 0)))[:2] for y in (-8.8, 9.0)]; R0 = [tuple(SMi @ Vector((1.75, y, 0)))[:2] for y in (-8.8, 9.0)]
TUFTS.append(G.tufts([p for p in G.scatter_band(L0, width=.7, density=7, offset=.45, seed=3) if on_lawn(p)], height=.4, seed=3, name='tufts_drive_l'))
TUFTS.append(G.tufts([p for p in G.scatter_band(R0, width=.7, density=7, offset=-.45, seed=4) if on_lawn(p)], height=.4, seed=4, name='tufts_drive_r'))
TUFTS.append(G.tufts_around(HERO_TREE, r_in=.05, r_out=1.3, density=9, seed=5, name='tufts_trunk'))
fence = bpy.data.objects.get('picket_fence')
if fence:
    fl = [fence.matrix_world @ v.co for v in fence.data.vertices if (fence.matrix_world @ v.co).z < .05]
    rnd_.shuffle(fl); TUFTS.append(G.tufts([(v.x + rnd_.uniform(-.12, .12), v.y + rnd_.uniform(-.12, .12), 0) for v in fl[:260]], height=.35, seed=9, name='tufts_fence'))
def lawn_bounce(m):
    # what the lawn and blades give as bounce light is greyed (camera rays keep the full green): shadows stay blue-violet
    if not m or not m.use_nodes or m.node_tree.nodes.get('st_bounce'): return
    nt = m.node_tree; bs = [n for n in nt.nodes if n.type == 'BSDF_PRINCIPLED' or n.type == 'BSDF_DIFFUSE']
    for b in bs:
        ci = b.inputs['Base Color'] if 'Base Color' in b.inputs else b.inputs['Color']
        if not ci.links: continue
        src = ci.links[0].from_socket; hs = nt.nodes.new('ShaderNodeHueSaturation'); hs.name = 'st_bounce'
        lp_ = nt.nodes.new('ShaderNodeLightPath'); mm = nt.nodes.new('ShaderNodeMapRange'); mm.inputs[3].default_value = .2; mm.inputs[4].default_value = 1.0
        nt.links.new(lp_.outputs['Is Camera Ray'], mm.inputs[0]); nt.links.new(mm.outputs[0], hs.inputs['Saturation'])
        nt.links.new(src, hs.inputs['Color']); nt.links.new(hs.outputs['Color'], ci)
for o in [soil] + TUFTS:
    if o:
        for m in o.data.materials: lawn_bounce(m)
print('LIBRARY', 'trees', len(NATURE), 'hero tris', HERO_TREE['tris'], 'tufts', [(t.name, len(t.data.polygons)) for t in TUFTS])

# ---------------- sun
S = LAY['sun']; sxy = Vector((S['to_sun_xy'][0], S['to_sun_xy'][1], 0)).normalized(); el = math.radians(S['elevation_deg'])
to_sun = Vector((sxy.x * math.cos(el), sxy.y * math.cos(el), math.sin(el)))
sun = bpy.data.objects.new('sun', bpy.data.lights.new('sun', 'SUN')); sc.collection.objects.link(sun)
sun.data.energy = RL['sun']; sun.data.color = lin(RL['sun_col'])[:3]; sun.data.angle = math.radians(RL['sun_angle_deg'])
sun.rotation_euler = (-to_sun).to_track_quat('-Z', 'Y').to_euler()

# ---------------- cast cards: final PNGs, origin at foot_point, upright, turned about Z to the lens
EXPO = float(os.environ.get('EXPO', '-0.7'))
def card_mat(name, img, strength):
    m = bpy.data.materials.new(name); m.use_nodes = True; N, L = m.node_tree.nodes, m.node_tree.links
    for n in list(N): N.remove(n)
    tx = N.new('ShaderNodeTexImage'); tx.image = img; tx.interpolation = 'Cubic'
    em = N.new('ShaderNodeEmission'); L.new(tx.outputs['Color'], em.inputs['Color']); em.inputs['Strength'].default_value = strength
    tr = N.new('ShaderNodeBsdfTransparent'); mx = N.new('ShaderNodeMixShader'); L.new(tx.outputs['Alpha'], mx.inputs['Fac']); L.new(tr.outputs[0], mx.inputs[1]); L.new(em.outputs[0], mx.inputs[2])
    out = N.new('ShaderNodeOutputMaterial'); L.new(mx.outputs[0], out.inputs['Surface']); return m

def card_mesh(name, c, mpp, row_top=0, row_bot=None):
    W, H = c['size_px']; fx, fy = c['foot_point_px']; row_bot = H if row_bot is None else row_bot
    me = bpy.data.meshes.new(name); x0, x1 = -fx * mpp, (W - fx) * mpp; z0, z1 = (fy - row_bot) * mpp, (fy - row_top) * mpp
    me.from_pydata([(x0, 0, z0), (x1, 0, z0), (x1, 0, z1), (x0, 0, z1)], [], [(0, 1, 2, 3)])
    uv = me.uv_layers.new(name='UVMap'); v0, v1 = 1 - row_bot / H, 1 - row_top / H
    for li, (u, v) in enumerate([(0, v0), (1, v0), (1, v1), (0, v1)]): uv.data[li].uv = (u, v)
    return me

CARDS, SHADOWS, HIDE_EXTRA = [], [], []
CARD = {}
for who in ('grandpa', 'kid'):
    c = CJ[who]; mpp = c['m_per_px']; img = bpy.data.images.load(os.path.join(EP, 'cast', c['file'])); img.alpha_mode = 'STRAIGHT'
    me = card_mesh('card_' + who, c, mpp); me.materials.append(card_mat('cardmat_' + who, img, 2 ** (-EXPO)))
    o = bpy.data.objects.new('CARD_' + who, me); sc.collection.objects.link(o); o.location = LAY[who]['pos']
    tc = CAMP - o.location; tc.z = 0; o.rotation_euler = (0, 0, math.atan2(tc.y, tc.x) + math.pi / 2)
    o.pass_index = 1; o.visible_diffuse = False; o.visible_shadow = False; CARDS.append(o)
    sh = o.copy(); sh.name = 'SHADOWCARD_' + who; sc.collection.objects.link(sh); sh.rotation_euler = (0, 0, math.atan2(sxy.y, sxy.x) + math.pi / 2)
    sh.visible_camera = False; sh.visible_glossy = False; sh.visible_diffuse = False; sh.visible_transmission = False; sh.visible_shadow = True; SHADOWS.append(sh)
    bpy.context.view_layer.update()
    CARD[who] = dict(obj=o, mpp=mpp, c=c, img=img)
    if who == 'kid':
        # the kid's UPPER card (above the knees) is pushed back along the lens rays (same picture on screen) so the water leaving the nozzle
        # and the nozzle itself sit in front of his body; the legs stay on the ground plane (feet keep their contact)
        SPLIT = int(os.environ.get('KID_SPLIT', '1080')); PUSH = float(os.environ.get('KID_PUSH', '0.9'))
        o.data = card_mesh('card_kid_legs', c, mpp, SPLIT, None); o.data.materials.append(me.materials[0])
        up = bpy.data.objects.new('CARD_kid_upper', card_mesh('card_kid_upper', c, mpp, 0, SPLIT + 2)); up.data.materials.append(me.materials[0])
        sc.collection.objects.link(up); up.matrix_world = o.matrix_world.copy(); d0 = (o.location - CAMP).xy.length; k_ = (d0 + PUSH) / d0
        up.location = CAMP + (o.location - CAMP) * k_; up.scale = (k_, k_, k_)
        up.pass_index = 1; up.visible_diffuse = False; up.visible_shadow = False; CARDS.append(up)

def card_pt(who, px, toward_cam=0.0):
    k = CARD[who]; o = k['obj']; fx, fy = k['c']['foot_point_px']
    p = o.matrix_world @ Vector(((px[0] - fx) * k['mpp'], 0, (fy - px[1]) * k['mpp']))
    return p + (CAMP - p).normalized() * toward_cam

# fist overlay: the kid's two fists cut from his own card, a hair in front of the 3D nozzle (fists in front of the held prop)
kc = CJ['kid']; kimg = CARD['kid']['img']; W, H = kimg.size
px = np.array(kimg.pixels[:], dtype=np.float32).reshape(H, W, 4)
yy, xx = np.mgrid[0:H, 0:W]; keep = np.zeros((H, W), bool); fr = kc['fist_radius_px'] + 3
for hx, hy in (kc['nozzle']['grip_back_px'], kc['nozzle']['grip_front_px']):
    keep |= (xx - hx) ** 2 + ((H - 1 - yy) - hy) ** 2 <= fr * fr
fp = px.copy(); fp[..., 3] *= keep; fimg = bpy.data.images.new('kid_fists', W, H, alpha=True); fimg.pixels[:] = fp.ravel(); fimg.alpha_mode = 'STRAIGHT'; fimg.pack()
fme = card_mesh('card_kid_fists', kc, kc['m_per_px']); fme.materials.append(card_mat('cardmat_kid_fists', fimg, 2 ** (-EXPO)))
fo_ = bpy.data.objects.new('CARD_kid_fists', fme); sc.collection.objects.link(fo_); fo_.matrix_world = CARD['kid']['obj'].matrix_world.copy()
d_ = (CAMP - fo_.location); d_.z = 0; fo_.location += d_.normalized() * 0.09
s_ = (fo_.location - CAMP).length / (CARD['kid']['obj'].location - CAMP).length; fo_.scale = (s_, s_, s_)
fo_.location = CAMP + (CARD['kid']['obj'].location - CAMP) * s_
fo_.pass_index = 1; fo_.visible_diffuse = False; fo_.visible_shadow = False; fo_.visible_glossy = False; CARDS.append(fo_)

# contact patches (soft dark ellipses; grandpa is mid-jump: wider and fainter)
def contact(who, rad, dark):
    bpy.ops.mesh.primitive_circle_add(vertices=48, radius=rad, fill_type='TRIFAN', location=Vector(LAY[who]['pos']) + Vector((0, 0, .006)))
    cp = bpy.context.object; cp.name = 'CONTACT_' + who; cp.scale.y = .5
    pm = bpy.data.materials.new('contact_' + who); pm.use_nodes = True; N, L = pm.node_tree.nodes, pm.node_tree.links
    for n in list(N): N.remove(n)
    gc = N.new('ShaderNodeTexGradient'); gc.gradient_type = 'SPHERICAL'; tc_ = N.new('ShaderNodeTexCoord'); mp = N.new('ShaderNodeMapping')
    mp.inputs['Scale'].default_value = (1 / rad, 1 / rad, 1); L.new(tc_.outputs['Object'], mp.inputs['Vector']); L.new(mp.outputs['Vector'], gc.inputs['Vector'])
    pw = N.new('ShaderNodeMath'); pw.operation = 'POWER'; pw.inputs[1].default_value = 1.8; L.new(gc.outputs['Fac'], pw.inputs[0])
    mul = N.new('ShaderNodeMath'); mul.operation = 'MULTIPLY'; mul.inputs[1].default_value = dark; L.new(pw.outputs[0], mul.inputs[0])
    dk = N.new('ShaderNodeBsdfDiffuse'); dk.inputs['Color'].default_value = (0.015, 0.016, 0.03, 1); trn = N.new('ShaderNodeBsdfTransparent')
    mx2 = N.new('ShaderNodeMixShader'); L.new(mul.outputs[0], mx2.inputs['Fac']); L.new(trn.outputs[0], mx2.inputs[1]); L.new(dk.outputs[0], mx2.inputs[2])
    o2 = N.new('ShaderNodeOutputMaterial'); L.new(mx2.outputs[0], o2.inputs['Surface']); cp.data.materials.append(pm); cp.visible_shadow = False
    HIDE_EXTRA.append(cp)
contact('kid', .32, .85); contact('grandpa', .42, .8)

# ---------------- water material (clear, glassy) + mist; wet film + foam re-shaded
def water_mat():
    m = bpy.data.materials.new('st_water'); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (0.82, 0.93, 1.0, 1); b.inputs['Roughness'].default_value = 0.0; b.inputs['IOR'].default_value = 1.333
    b.inputs['Transmission Weight'].default_value = 0.6; b.inputs['Specular IOR Level'].default_value = 0.8
    b.inputs['Coat Weight'].default_value = 1.0; b.inputs['Coat Roughness'].default_value = 0.0; b.inputs['Subsurface Weight'].default_value = 0.25
    b.inputs['Subsurface Radius'].default_value = (0.01, 0.015, 0.02)
    return m
WATER = water_mat()
wf = bpy.data.materials.get('wet_film')
if wf:
    b = wf.node_tree.nodes.get('Principled BSDF') or [n for n in wf.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'][0]
    b.inputs['Roughness'].default_value = 0.0; b.inputs['Transmission Weight'].default_value = 1.0; b.inputs['IOR'].default_value = 1.333
    b.inputs['Alpha'].default_value = 0.6; b.inputs['Coat Weight'].default_value = 0.0
foam = bpy.data.materials.get('soap_foam')
if foam:
    b = [n for n in foam.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'][0]
    b.inputs['Base Color'].default_value = (0.95, 0.96, 0.98, 1); b.inputs['Roughness'].default_value = 0.3
    b.inputs['Subsurface Weight'].default_value = 0.15; b.inputs['Subsurface Radius'].default_value = (0.01, 0.01, 0.012)
    b.inputs['Transmission Weight'].default_value = 0.0; b.inputs['Coat Weight'].default_value = 0.6
# foam: the lens (1.0 m) sees the hood nearly edge-on, so the suds are heaped up: bubbles bigger and overlapping (one mass, not loose balls)
for o in list(bpy.data.objects):
    if o.name.startswith('car_foam_'): o.scale = (o.scale.x * 1.9, o.scale.y * 1.9, o.scale.z * 1.7)

# ---------------- hose + nozzle re-made for the final kid card: coupling at his back fist (pistol grip), barrel through his front fist
WCOLL = bpy.data.collections.new('water'); sc.collection.children.link(WCOLL)
HCOLL = bpy.data.collections.new('hose'); sc.collection.children.link(HCOLL)
nz = kc['nozzle']; gb_ = card_pt('kid', nz['grip_back_px'], 0.05); gf_ray = card_pt('kid', nz['grip_front_px'], 0.05)
G_TGT = card_pt('grandpa', (330, 600), 0.10)
# front point on the lens ray through the front fist, chosen so the barrel heads (in plan) toward grandpa
best = None
for s in np.linspace(1.0, 1.8, 161):
    pf = CAMP + (gf_ray - CAMP) * s; D = pf - gb_; a = abs(math.atan2(D.y, D.x) - math.atan2(G_TGT.y - gb_.y, G_TGT.x - gb_.x))
    if best is None or a < best[0]: best = (a, s, pf)
D = (best[2] - gb_).normalized(); NSC = 1.35
F = HT._frame(D); O = gb_ - (F @ Vector((0.03, 0, -0.06))) * NSC
NSC = max(NSC, ((best[2] - O).dot(D) + 0.06) / 0.165); O = gb_ - (F @ Vector((0.03, 0, -0.06))) * NSC
KP = Vector(LAY['kid']['pos']); BK = (KP - CAMP); BK.z = 0; BK.normalize(); RT = Vector((BK.y, -BK.x, 0))
gb0 = card_pt('kid', nz['grip_back_px'], 0.0)
pts = [[1.08, 4.84, 0.28], [1.08, 4.7, 0.06], [1.1, 4.58, 0.011], [1.22, 4.45, 0.011], [1.26, 4.4, 0.011], [1.2, 4.32, 0.011], [0.75, 4.75, 0.011],
       list(KP + BK * 0.35 + RT * 0.55 + Vector((0, 0, .011))), list(KP + BK * 0.3 + RT * 0.05 + Vector((0, 0, .011))),
       list(KP + BK * 1.05 + Vector((0, 0, .36)))]
RAY = lambda k: list(CAMP + (O - CAMP) * k)
pts += [RAY(1.32), RAY(1.16), RAY(1.06), list(O)]
rad = [1, 1, 1, .7, .45, .7] + [1] * (len(pts) - 6)
hose, nparts = HT.make_hose(pts, radii=rad, coll=HCOLL)
for p in nparts: bpy.data.objects.remove(p)
nparts = HT._nozzle(O, D, HCOLL, HT.mat("brass", (0.95, 0.68, 0.3), metallic=1.0, rough=0.18), HT.mat("black_rubber", (0.03, 0.03, 0.035), rough=0.6))
for p in nparts: p.matrix_world = Matrix.Translation(O) @ Matrix.Scale(NSC, 4) @ Matrix.Translation(-O) @ p.matrix_world
TIP = O + D * 0.15 * NSC
# arc: parabola from TIP to grandpa whose start slope equals the barrel's (bisection on the apex height)
L_ = (G_TGT.xy - TIP.xy).length; want = D.z / max(1e-4, D.xy.length)
def slope(h):
    a0, a1 = math.sqrt(max(h - TIP.z, 0)), math.sqrt(max(h - G_TGT.z, 0)); return 2 * (a0 + a1) * a0 / L_
lo, hi = max(TIP.z, G_TGT.z) + .01, max(TIP.z, G_TGT.z) + 6
for _ in range(60):
    mid = (lo + hi) / 2
    if slope(mid) < want: lo = mid
    else: hi = mid
APEX = max((lo + hi) / 2, max(TIP.z, G_TGT.z) + .35)
WS = HT.make_water(list(TIP), list(G_TGT), APEX, coll=WCOLL, mat=WATER, n_drops=90, seed=11)
arc_o = bpy.data.objects.get('water_arc')
if arc_o: dm = arc_o.modifiers.new('thicker', 'DISPLACE'); dm.mid_level = 0.0; dm.strength = 0.012
CORE = bpy.data.materials.new('st_water_core'); CORE.use_nodes = True; cb = CORE.node_tree.nodes['Principled BSDF']
cb.inputs['Base Color'].default_value = (0.42, 0.68, 1.0, 1); cb.inputs['Roughness'].default_value = 0.04; cb.inputs['Transmission Weight'].default_value = 0.2
cb.inputs['Subsurface Weight'].default_value = 0.5; cb.inputs['Subsurface Radius'].default_value = (0.01, 0.015, 0.02); cb.inputs['Coat Weight'].default_value = 1.0
cb.inputs['IOR'].default_value = 1.333
h_ = APEX; a0_, a1_ = math.sqrt(max(h_ - TIP.z, 0)), math.sqrt(max(h_ - G_TGT.z, 0)); sk_ = a0_ + a1_; tp_ = a0_ / max(sk_, 1e-6)
def PAR(t): q = TIP.lerp(G_TGT, t); q.z = h_ - sk_ * sk_ * (t - tp_) ** 2; return q
t_end = 0.42 / max(WS['arc_length_m'], .5)
ccu = bpy.data.curves.new('water_core', 'CURVE'); ccu.dimensions = '3D'; ccu.bevel_depth = 0.016; ccu.bevel_resolution = 4; ccu.use_fill_caps = True
csp = ccu.splines.new('POLY'); csp.points.add(15)
for i in range(16):
    q = PAR(t_end * i / 15); csp.points[i].co = (q.x, q.y, q.z, 1); csp.points[i].radius = 1.0 - .45 * (i / 15) ** 1.5
core_o = bpy.data.objects.new('water_core', ccu); ccu.materials.append(CORE); HT._link(core_o, WCOLL)
# spray mist at the splash: fine droplets that catch the sun
random.seed(5)
for i in range(160):
    q = G_TGT + Vector((random.gauss(0, .22), random.gauss(0, .12), random.gauss(.05, .22)))
    bpy.ops.mesh.primitive_ico_sphere_add(radius=random.uniform(.0015, .004), subdivisions=1, location=q); m_ = bpy.context.object; m_.name = 'water_mist_%03d' % i
    m_.data.materials.append(WATER); HT._link(m_, WCOLL)
print('WATER', WS, 'tip', [round(x, 3) for x in TIP], 'target', [round(x, 3) for x in G_TGT], 'apex', round(APEX, 2), 'barrel s', round(best[1], 3))

# ---------------- tree: lit tops toward Rick's yellow-green (hue/value on the leaf colour, darker undersides stay from the light)
LEAF_HSV = os.environ.get('LEAF', '1')
for m in bpy.data.materials:
    nm = m.name.lower()
    if m.use_nodes and 'island_tree' in nm and 'leaves' in nm:
        nt = m.node_tree; b = [n for n in nt.nodes if n.type == 'BSDF_PRINCIPLED']
        if not b or nt.nodes.get('st_leaf_hsv'): continue
        b = b[0]; src = b.inputs['Base Color'].links[0].from_socket if b.inputs['Base Color'].links else None
        if src is None: continue
        hsv = nt.nodes.new('ShaderNodeHueSaturation'); hsv.name = 'st_leaf_hsv'
        hsv.inputs['Hue'].default_value = 0.46; hsv.inputs['Saturation'].default_value = 1.3; hsv.inputs['Value'].default_value = float(os.environ.get('LEAFV', '1.7'))
        nt.links.new(src, hsv.inputs['Color']); nt.links.new(hsv.outputs['Color'], b.inputs['Base Color'])
        print('LEAF_TINT', m.name)

# ---------------- world: lens/glossy see deep flat blue + cumulus; other rays the blue-violet fill (Light Path mix)
w = bpy.data.worlds.new('rick_day'); sc.world = w; w.use_nodes = True; nt = w.node_tree; N, L = nt.nodes, nt.links
for n in list(N): N.remove(n)
tc = N.new('ShaderNodeTexCoord'); nzv = N.new('ShaderNodeVectorMath'); nzv.operation = 'NORMALIZE'; L.new(tc.outputs['Generated'], nzv.inputs[0])
sp_ = N.new('ShaderNodeSeparateXYZ'); L.new(nzv.outputs[0], sp_.inputs[0])
mr = N.new('ShaderNodeMapRange'); mr.inputs[1].default_value = 0.; mr.inputs[2].default_value = .7; L.new(sp_.outputs[2], mr.inputs[0])
ramp = N.new('ShaderNodeValToRGB'); L.new(mr.outputs[0], ramp.inputs[0]); e = ramp.color_ramp.elements
e[0].position = 0.; e[0].color = lin(RL['sky_low']); e[1].position = 1.; e[1].color = lin(RL['sky_top'])
dv = N.new('ShaderNodeVectorMath'); dv.operation = 'DIVIDE'; L.new(nzv.outputs[0], dv.inputs[0])
cz = N.new('ShaderNodeCombineXYZ'); L.new(sp_.outputs[2], cz.inputs[0]); L.new(sp_.outputs[2], cz.inputs[1]); cz.inputs[2].default_value = 1.
mx_ = N.new('ShaderNodeVectorMath'); mx_.operation = 'MAXIMUM'; L.new(cz.outputs[0], mx_.inputs[0]); mx_.inputs[1].default_value = (.12, .12, 1.)
L.new(mx_.outputs[0], dv.inputs[1])
nb = N.new('ShaderNodeTexNoise'); nb.noise_dimensions = '2D'; nb.inputs['Scale'].default_value = 1.3; nb.inputs['Detail'].default_value = 7.; nb.inputs['Roughness'].default_value = .55
L.new(dv.outputs[0], nb.inputs['Vector'])
cr = N.new('ShaderNodeMapRange'); cr.inputs[1].default_value = .55; cr.inputs[2].default_value = .64; L.new(nb.outputs['Fac'], cr.inputs[0])
b1 = N.new('ShaderNodeMapRange'); b1.interpolation_type = 'SMOOTHSTEP'; L.new(sp_.outputs[2], b1.inputs[0]); b1.inputs[1].default_value = .18; b1.inputs[2].default_value = .28
b2 = N.new('ShaderNodeMapRange'); b2.interpolation_type = 'SMOOTHSTEP'; L.new(sp_.outputs[2], b2.inputs[0]); b2.inputs[1].default_value = .62; b2.inputs[2].default_value = .78
b2.inputs[3].default_value = 1.; b2.inputs[4].default_value = 0.
cm = N.new('ShaderNodeMath'); cm.operation = 'MULTIPLY'; L.new(b1.outputs[0], cm.inputs[0]); L.new(b2.outputs[0], cm.inputs[1])
cm2 = N.new('ShaderNodeMath'); cm2.operation = 'MULTIPLY'; cm2.use_clamp = True; L.new(cr.outputs[0], cm2.inputs[0]); L.new(cm.outputs[0], cm2.inputs[1])
shd = N.new('ShaderNodeMapRange'); shd.inputs[1].default_value = .57; shd.inputs[2].default_value = .76; L.new(nb.outputs['Fac'], shd.inputs[0])
cc = N.new('ShaderNodeMix'); cc.data_type = 'RGBA'; L.new(shd.outputs[0], cc.inputs['Factor']); cc.inputs['A'].default_value = lin('#bcd6f6'); cc.inputs['B'].default_value = lin('#ffffff')
sky = N.new('ShaderNodeMix'); sky.data_type = 'RGBA'; L.new(cm2.outputs[0], sky.inputs['Factor']); L.new(ramp.outputs[0], sky.inputs['A']); L.new(cc.outputs['Result'], sky.inputs['B'])
bg_cam = N.new('ShaderNodeBackground'); L.new(sky.outputs['Result'], bg_cam.inputs[0]); bg_cam.inputs[1].default_value = 2 ** (-EXPO)
bg_fill = N.new('ShaderNodeBackground'); bg_fill.inputs[0].default_value = lin(os.environ.get('FILLCOL', '#a6b6f2')); bg_fill.inputs[1].default_value = float(os.environ.get('FILL', RL['fill']))
lp = N.new('ShaderNodeLightPath'); orr = N.new('ShaderNodeMath'); orr.operation = 'MAXIMUM'; L.new(lp.outputs['Is Camera Ray'], orr.inputs[0]); L.new(lp.outputs['Is Glossy Ray'], orr.inputs[1])
ms = N.new('ShaderNodeMixShader'); L.new(orr.outputs[0], ms.inputs[0]); L.new(bg_fill.outputs[0], ms.inputs[1]); L.new(bg_cam.outputs[0], ms.inputs[2])
wo = N.new('ShaderNodeOutputWorld'); L.new(ms.outputs[0], wo.inputs['Surface'])
bpy.context.view_layer.update()

# ---------------- outline objects: the set's Line collection + props (never water, foam, wet film, glass, cards)
NOLINE = ('water', 'car_foam', 'car_wet', 'wet_', 'CARD_', 'SHADOWCARD_', 'CONTACT_', 'bucket_suds', 'suds', 'bubble')
PROP_OBJS = set()
for c in PROPS:
    if c: PROP_OBJS |= {o.name for o in c.all_objects}
PROP_OBJS |= {o.name for o in HCOLL.all_objects}
def is_line(o):
    if o.type not in ('MESH', 'CURVE') or o.hide_render or o.name.startswith(NOLINE): return False
    if any(m and m.name in ('st_water', 'wet_film', 'soap_foam') for m in getattr(o.data, 'materials', [])): return False
    if o.name in SET_LINE: return True
    if o.name in PROP_OBJS: return not any(m and 'glass' in m.name.lower() for m in getattr(o.data, 'materials', []))
    return False
LINE_OBJS = [o for o in sc.objects if is_line(o)]
HIDE_OBJS = CARDS + SHADOWS + HIDE_EXTRA + list(WCOLL.all_objects)
print('LINE_SETUP', LK.setup(sc, LINE_OBJS, HIDE_OBJS))

# ---------------- render settings + cast mask pass (Standard, never AgX)
r.engine = 'CYCLES'; r.image_settings.file_format = 'PNG'; r.image_settings.color_mode = 'RGB'; r.image_settings.color_depth = '16'
sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'None'; sc.view_settings.exposure = EXPO
sc.cycles.use_denoising = True; sc.cycles.denoiser = 'OPENIMAGEDENOISE'; sc.cycles.use_adaptive_sampling = True
sc.cycles.max_bounces = 8; sc.cycles.transmission_bounces = 8; sc.cycles.transparent_max_bounces = 24; sc.cycles.caustics_reflective = False; sc.cycles.caustics_refractive = False
sc.cycles.blur_glossy = .5; r.film_transparent = False; r.use_motion_blur = False
if os.environ.get('THREADS'): r.threads_mode = 'FIXED'; r.threads = int(os.environ['THREADS'])
vl = sc.view_layers[0]; vl.use_pass_object_index = True
tree = bpy.data.node_groups.new('st_comp', 'CompositorNodeTree'); sc.compositing_node_group = tree; N, L = tree.nodes, tree.links
rl = N.new('CompositorNodeRLayers'); fo = N.new('CompositorNodeOutputFile'); fo.file_name = 'pass_'
fo.format.media_type = 'IMAGE'; fo.format.file_format = 'PNG'; fo.format.color_depth = '16'; fo.format.color_mode = 'BW'; fo.save_as_render = False
fo.file_output_items.new('FLOAT', 'mask')
idm = N.new('CompositorNodeIDMask'); idm.inputs['Index'].default_value = 1; idm.inputs['Anti-Alias'].default_value = True
L.new(rl.outputs['Object Index'], idm.inputs[0]); L.new(idm.outputs[0], fo.inputs['mask'])
go = N.new('NodeGroupOutput'); tree.interface.new_socket('Image', in_out='OUTPUT', socket_type='NodeSocketColor'); L.new(rl.outputs['Image'], go.inputs[0])

# ---------------- numbers
from bpy_extras.object_utils import world_to_camera_view as w2c
def scr(p): v = w2c(sc, cam, Vector(p)); return [round(v.x, 3), round(1 - v.y, 3), round(v.z, 2)]
dgc = bpy.context.evaluated_depsgraph_get(); TRI = {}; tot = 0
for inst in dgc.object_instances:
    ob = inst.object
    if ob.type != 'MESH' or not ob.visible_camera: continue
    k = ob.data.name
    if k not in TRI:
        me_ = ob.data; me_.calc_loop_triangles(); TRI[k] = len(me_.loop_triangles)
    tot += TRI[k]
print('TRIS_RENDERED', tot)
print('SCREEN', json.dumps({'tip': scr(TIP), 'target': scr(G_TGT), 'grip_back': scr(gb_), 'grip_front': scr(card_pt('kid', nz['grip_front_px'])),
                            'mailbox': scr(mb.location) if mb else None, 'nozzle_O': scr(O)}))

if MODE in ('preview', 'final'):
    if MODE == 'preview': r.resolution_percentage = int(os.environ.get('PCT', '50')); sc.cycles.samples = int(os.environ.get('SPP', '16'))
    else: r.resolution_percentage = 100; sc.cycles.samples = int(os.environ.get('SPP', '64'))
    sc.cycles.device = 'CPU'
    od = os.path.dirname(os.path.abspath(OUT_PNG)); fo.directory = od + '/' + os.path.splitext(os.path.basename(OUT_PNG))[0] + '_'
    r.filepath = OUT_PNG; t0 = time.time(); bpy.ops.render.render(write_still=True); print('RENDER_SECONDS %.1f' % (time.time() - t0))
    t0 = time.time(); LK.render(sc, os.path.splitext(OUT_PNG)[0] + '_lines_id.png'); print('LINES_SECONDS %.1f' % (time.time() - t0))
    if MODE == 'preview': bpy.ops.wm.save_as_mainfile(filepath=os.path.join(EP, 'scene.blend'), compress=True)
    print('DONE', OUT_PNG)
