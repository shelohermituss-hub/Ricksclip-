# build_scene.py: the style-test still in THE RICK RECIPE (CB_RULES section 3), look-finisher part: assembly, camera, light, water shading,
# outline id pass, cast mask. Round 1 = BLOCKOUT: grey/tinted stand-ins at the planned sizes so the composition is fixed before the
# departments deliver (props/, set/, cast/). Writes ../LAYOUT.json (metres, Z up, origin on the ground) for them to place to.
#   blender -b --factory-startup --python look/build_scene.py -- <info|preview> [out_png]      env SPP, PCT, EXPO
# info: screen positions + visibility of every planned object (numbers, no render). preview: 540x960 Cycles CPU, OIDN, Standard view.
import bpy, sys, os, json, math, time
from mathutils import Vector, Matrix
HERE = os.path.dirname(os.path.abspath(__file__)); EP = os.path.normpath(os.path.join(HERE, '..')); ROOT = os.path.normpath(os.path.join(EP, '..', '..'))
args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else ['info']
MODE = args[0]; OUT_PNG = args[1] if len(args) > 1 else os.path.join(HERE, 'prev', 'blockout_raw.png')
RL = json.load(open(os.path.join(ROOT, 'templates', 'blender_look', 'rick_light.json')))['day']

def lin(h):
    h = h.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple([(x / 12.92 if x <= .04045 else ((x + .055) / 1.055) ** 2.4) for x in c] + [1.0])

# ---------------- LAYOUT (metres). Camera looks along +Y. The car points to camera-left (yaw), the drive and house share its axis.
YAW = 26.0
f = Vector((-math.sin(math.radians(YAW)), -math.cos(math.radians(YAW)), 0))
left = Vector((-f.y, f.x, 0))
CAR_C = Vector((0.9, 10.6, 0))
CAM = Vector((0.35, 2.6, 1.0))
def at(c, a_f, a_l): return c + f * a_f + left * a_l
GAR_C = at(CAR_C, -9.6, 0.0)
LAYOUT = {
 '_about': 'Style test LAYOUT (look-finisher, round 1). Metres, Z up, origin on the ground, camera looks along +Y. yaw_deg: the object front turns '
           'from -Y toward -X by this angle (car, drive, house, garage share it). Departments place their pieces to these points and sizes; '
           'deliver a .blend whose root empty is named as the key, origin on the ground at the point, front along -Y before the yaw.',
 'camera': {'loc': list(CAM), 'look_dir_deg': {'heading_from_+Y': 2.0, 'pitch_up': 1.5}, 'lens_mm': 26, 'sensor_fit': 'VERTICAL', 'sensor_mm': 36,
            'res': [1080, 1920]},
 'sun': {'to_sun_xy': [0.5, -0.87], 'elevation_deg': 45, 'strength': RL['sun'], 'colour': RL['sun_col'], 'angle_deg': RL['sun_angle_deg']},
 'car': {'pos': list(CAR_C), 'yaw_deg': YAW, 'blender_rot_z_deg': -YAW, 'size_lwh': [4.8, 1.95, 1.5], 'note': 'car in the right half (kid needs the left half); near side = the car LEFT side (faces camera-right)'},
 'grandpa': {'pos': list(at(CAR_C, 1.55, 1.3)), 'height': 1.72, 'faces': 'screen left (the hood, the spray)', 'note': 'beside the front fender, bent over the hood'},
 'kid': {'pos': [-0.62, 5.85, 0.0], 'height': 1.25, 'faces': 'screen right (grandpa)', 'note': 'in front of and left of the car front, 3.3 m from the lens (25-30 % of frame height), in full view (a 0.9 m lens hides everything below 1.05 m behind the hood, so the kid cannot stand straight behind the car)'},
 'bucket': {'pos': list(at(CAR_C, 1.75, 1.6)), 'size': 0.32},
 'hose_reel': {'pos': list(CAM.xy.to_3d() + Vector((0.75, 2.4, 0))), 'size': 0.6, 'note': 'lower right foreground, on the lawn'},
 'mailbox': {'pos': list(CAM.xy.to_3d() + Vector((-1.35, 2.6, 0))), 'height': 1.1, 'note': 'left edge, by the drive'},
 'bike': {'pos': list(CAM.xy.to_3d() + Vector((1.75, 3.6, 0))), 'yaw_deg': -70, 'note': 'lying on the lawn, right edge'},
 'drive': {'from': list(at(CAR_C, 6.0, 0.0)), 'to': list(GAR_C), 'width': 3.4},
 'garage': {'pos': list(GAR_C), 'yaw_deg': YAW, 'blender_rot_z_deg': -YAW, 'size_whd': [3.6, 6.0, 2.9], 'note': 'door faces the car'},
 'house': {'pos': list(GAR_C - left * 7.2 + (-f) * 1.0), 'yaw_deg': YAW, 'blender_rot_z_deg': -YAW, 'size_whd': [10.0, 8.0, 3.0], 'roof_ridge': 5.6, 'note': 'pastel clapboard, porch toward the camera side'},
 'tree': {'pos': [5.6, 13.5, 0.0], 'height': 9.5, 'crown_radius': 3.8, 'note': 'screen right, crown into the top right corner; its dapple falls on the drive behind the car'},
 'lawn': {'note': 'everywhere outside the drive; dense blades near the camera (y < 4)'},
}

# ---------------- scene from empty
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene

def mat(name, hexc, rough=.5, metal=0., coat=0., emit=0.):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = lin(hexc); b.inputs['Roughness'].default_value = rough; b.inputs['Metallic'].default_value = metal
    b.inputs['Coat Weight'].default_value = coat; b.inputs['Coat Roughness'].default_value = .03
    if emit: b.inputs['Emission Color'].default_value = lin(hexc); b.inputs['Emission Strength'].default_value = emit
    return m

def box(name, c, size, rot_z=0., m=None, bevel=.06, coll=None):
    bpy.ops.mesh.primitive_cube_add(size=1); o = bpy.context.object; o.name = name
    o.scale = size; o.location = Vector(c) + Vector((0, 0, size[2] / 2)); o.rotation_euler = (0, 0, math.radians(rot_z))
    bpy.ops.object.transform_apply(scale=True)
    if bevel: md = o.modifiers.new('bev', 'BEVEL'); md.width = bevel; md.segments = 3
    if m: o.data.materials.append(m)
    return o

PAINT = mat('bo_paint', '#14b5b0', rough=.22, metal=.55, coat=1.)
CHROME = mat('bo_chrome', '#e8e8ec', rough=.08, metal=1.)
TYRE = mat('bo_tyre', '#1b1b1e', rough=.7)
GLASS = bpy.data.materials.new('bo_glass'); GLASS.use_nodes = True; gb = GLASS.node_tree.nodes['Principled BSDF']
gb.inputs['Base Color'].default_value = lin('#20262e'); gb.inputs['Roughness'].default_value = .02; gb.inputs['Coat Weight'].default_value = 1.
WALL = mat('bo_wall', '#f2b6c4', rough=.8)
TRIM = mat('bo_trim', '#f6f4ef', rough=.6)
ROOF = mat('bo_roof', '#5a5f6e', rough=.85)
CONC = mat('bo_concrete', '#a7a6a3', rough=.9)
LAWN = mat('bo_lawn', '#4f8f2a', rough=.95)
LEAF = mat('bo_leaf', '#4a8a2a', rough=.8)
BARK = mat('bo_bark', '#5a4232', rough=.9)
GREY = mat('bo_grey', '#9b9b9b', rough=.6)

# ground: lawn + drive + street
bpy.ops.mesh.primitive_plane_add(size=200); g = bpy.context.object; g.name = 'bo_lawn'; g.data.materials.append(LAWN)
d0, d1 = Vector(LAYOUT['drive']['from']), Vector(LAYOUT['drive']['to']); dl = (d1 - d0).length
dr = box('bo_drive', (d0 + d1) / 2, (LAYOUT['drive']['width'], dl, .02), rot_z=-YAW, m=CONC, bevel=0)
dr.location.z = .001
st = box('bo_street', (0, -6, 0), (200, 8, .01), m=mat('bo_asphalt', '#55565c', rough=.9), bevel=0)

# car stand-in: body, cabin, glass band, wheels, chrome bumpers
car = bpy.data.objects.new('car', None); sc.collection.objects.link(car); car.location = CAR_C; car.rotation_euler = (0, 0, math.radians(-YAW))
def child(o):
    mw = o.matrix_world.copy(); o.parent = car; o.matrix_world = car.matrix_world @ mw; return o
child(box('bo_car_body', (0, 0, .32), (1.95, 4.8, .72), m=PAINT, bevel=.18))
child(box('bo_car_cabin', (0, .35, 1.04), (1.7, 2.3, .46), m=PAINT, bevel=.16))
child(box('bo_car_glass', (0, .35, 1.08), (1.74, 2.2, .34), m=GLASS, bevel=.1))
for y_ in (-2.42, 2.42): child(box('bo_car_bumper', (0, y_, .34), (2.0, .14, .16), m=CHROME, bevel=.06))
LAMP = mat('bo_headlamp', '#fff6d8', rough=.05, emit=.5)
child(box('bo_car_grille', (0, -2.43, .5), (1.1, .06, .26), m=CHROME, bevel=.03))
for sx in (-.68, .68):
    bpy.ops.mesh.primitive_cylinder_add(radius=.12, depth=.06, location=(sx, -2.42, .74), rotation=(math.radians(90), 0, 0)); hl_ = bpy.context.object
    hl_.name = 'bo_car_headlamp'; hl_.data.materials.append(LAMP); child(hl_)
for sx in (-.88, .88):
    for sy in (-1.5, 1.45):
        bpy.ops.mesh.primitive_cylinder_add(radius=.37, depth=.26, location=(sx, sy, .37), rotation=(0, math.radians(90), 0)); w = bpy.context.object
        w.name = 'bo_car_wheel'; w.data.materials.append(TYRE); child(w)
car.matrix_world = car.matrix_world
bpy.context.view_layer.update()

# garage + house + roofs
G = LAYOUT['garage']; gw, gd, gh = G['size_whd']
box('bo_garage', G['pos'], (gw, gd, gh), rot_z=-YAW, m=WALL, bevel=.04)
box('bo_garage_door', Vector(G['pos']) + f * (gd / 2 + .01), (2.8, .05, 2.2), rot_z=-YAW, m=TRIM, bevel=.02)
H = LAYOUT['house']; hw, hd, hh = H['size_whd']
box('bo_house', H['pos'], (hw, hd, hh), rot_z=-YAW, m=WALL, bevel=.04)
bpy.ops.mesh.primitive_cone_add(vertices=4, radius1=1, depth=1); r_ = bpy.context.object; r_.name = 'bo_roof'
r_.scale = (hw * .78, hd * .78, H['roof_ridge'] - hh); r_.rotation_euler = (0, 0, math.radians(45 - YAW)); r_.location = Vector(H['pos']) + Vector((0, 0, hh + (H['roof_ridge'] - hh) / 2))
r_.data.materials.append(ROOF)
box('bo_door', Vector(H['pos']) + f * (hd / 2 + .02) + left * 1.5, (1.0, .06, 2.1), rot_z=-YAW, m=TRIM, bevel=.02)
for k in (-3.2, -1.2 + 4.4):
    box('bo_window', Vector(H['pos']) + f * (hd / 2 + .02) + left * k + Vector((0, 0, .9)), (1.3, .06, 1.2), rot_z=-YAW, m=GLASS, bevel=.02)

# tree: trunk + crown clumps
T = LAYOUT['tree']; tp = Vector(T['pos'])
bpy.ops.mesh.primitive_cylinder_add(radius=.28, depth=5.5, location=tp + Vector((0, 0, 2.75))); bpy.context.object.data.materials.append(BARK); bpy.context.object.name = 'bo_trunk'
import random; random.seed(3)
for i in range(14):
    a = random.uniform(0, 6.283); r = random.uniform(.5, T['crown_radius'] * .85)
    c = tp + Vector((math.cos(a) * r, math.sin(a) * r * .8, T['height'] - T['crown_radius'] + random.uniform(-1.6, 1.2)))
    bpy.ops.mesh.primitive_ico_sphere_add(radius=random.uniform(1.2, 2.0), subdivisions=3, location=c); o = bpy.context.object; o.name = 'bo_crown'; o.data.materials.append(LEAF)

# small things
box('bo_bucket', LAYOUT['bucket']['pos'], (.3, .3, .32), m=mat('bo_galv', '#b8bcc4', rough=.3, metal=1.), bevel=.08)
bpy.ops.mesh.primitive_cylinder_add(radius=.3, depth=.22, location=Vector(LAYOUT['hose_reel']['pos']) + Vector((0, 0, .4)), rotation=(0, math.radians(90), math.radians(20)))
bpy.context.object.name = 'bo_hose_reel'; bpy.context.object.data.materials.append(mat('bo_hose', '#3f9a3a', rough=.4))
box('bo_mailbox_post', LAYOUT['mailbox']['pos'], (.1, .1, .9), m=mat('bo_wood', '#a87a4e', rough=.8), bevel=.01)
box('bo_mailbox', Vector(LAYOUT['mailbox']['pos']) + Vector((0, 0, .9)), (.24, .5, .26), m=mat('bo_mailbox_m', '#2f5fae', rough=.3, metal=.4, coat=.6), bevel=.1)
box('bo_bike', LAYOUT['bike']['pos'], (1.6, .5, .25), rot_z=LAYOUT['bike']['yaw_deg'], m=mat('bo_bike_m', '#e23a3a', rough=.3, metal=.3, coat=1.), bevel=.05)

# ---------------- camera
cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); sc.collection.objects.link(cam); sc.camera = cam
C = LAYOUT['camera']; cam.location = C['loc']; cam.rotation_euler = (math.radians(90 + C['look_dir_deg']['pitch_up']), 0, math.radians(C['look_dir_deg']['heading_from_+Y']))
cam.data.lens = C['lens_mm']; cam.data.sensor_fit = 'VERTICAL'; cam.data.sensor_height = C['sensor_mm']; cam.data.clip_start = .05; cam.data.clip_end = 1000
r = sc.render; r.resolution_x, r.resolution_y = C['res']

# ---------------- cast cards (draft cards from look/cast_draft until cast/ delivers): self-lit, upright, turned about Z to the camera,
# a hidden sun-facing copy casts the shadow, a soft contact patch under the feet
import numpy as np
S = LAYOUT['sun']; sxy = Vector((S['to_sun_xy'][0], S['to_sun_xy'][1], 0)).normalized(); el = math.radians(S['elevation_deg'])
to_sun = Vector((sxy.x * math.cos(el), sxy.y * math.cos(el), math.sin(el)))
CAST_DIR = os.path.join(EP, 'cast') if os.path.exists(os.path.join(EP, 'cast', 'cards.json')) else os.path.join(HERE, 'cast_draft')
CJ = json.load(open(os.path.join(CAST_DIR, 'cards.json')))
CARDS, SHADOWS = [], []
for who in ('grandpa', 'kid'):
    c = CJ[who]; img = bpy.data.images.load(os.path.join(CAST_DIR, c['png'])); img.alpha_mode = 'STRAIGHT'
    px = np.array(img.pixels[:], dtype=np.float32).reshape(img.size[1], img.size[0], 4)[::-1]
    rows = np.where(px[..., 3].max(1) > .05)[0]; cols_ = np.where(px[..., 3].max(0) > .05)[0]
    top_px = rows.min(); feet = c['feet_row']; hpx = feet - top_px; mpp = LAYOUT[who]['height'] / hpx
    W, Hh = img.size[0] * mpp, img.size[1] * mpp; x0 = -c['cx'] * mpp; z0 = -(img.size[1] - feet) * mpp
    me = bpy.data.meshes.new('card_' + who)
    me.from_pydata([(x0, 0, z0), (x0 + W, 0, z0), (x0 + W, 0, z0 + Hh), (x0, 0, z0 + Hh)], [], [(0, 1, 2, 3)])
    uv = me.uv_layers.new(name='UVMap')
    for li, (u, v) in enumerate([(0, 0), (1, 0), (1, 1), (0, 1)]): uv.data[li].uv = (u, v)
    m = bpy.data.materials.new('cardmat_' + who); m.use_nodes = True; N, L = m.node_tree.nodes, m.node_tree.links
    for n in list(N): N.remove(n)
    tx = N.new('ShaderNodeTexImage'); tx.image = img; tx.interpolation = 'Cubic'
    em = N.new('ShaderNodeEmission'); L.new(tx.outputs['Color'], em.inputs['Color']); em.inputs['Strength'].default_value = 1.0
    tr = N.new('ShaderNodeBsdfTransparent'); mx = N.new('ShaderNodeMixShader'); L.new(tx.outputs['Alpha'], mx.inputs['Fac']); L.new(tr.outputs[0], mx.inputs[1]); L.new(em.outputs[0], mx.inputs[2])
    out = N.new('ShaderNodeOutputMaterial'); L.new(mx.outputs[0], out.inputs['Surface']); me.materials.append(m)
    o = bpy.data.objects.new('CARD_' + who, me); sc.collection.objects.link(o); o.location = LAYOUT[who]['pos']
    to_cam = Vector(C['loc']) - o.location; to_cam.z = 0; o.rotation_euler = (0, 0, math.atan2(to_cam.y, to_cam.x) + math.pi / 2)
    o.pass_index = 1; o.visible_diffuse = False; o.visible_shadow = False; CARDS.append(o)
    sh = o.copy(); sh.data = me; sh.name = 'SHADOWCARD_' + who; sc.collection.objects.link(sh)
    sh.rotation_euler = (0, 0, math.atan2(sxy.y, sxy.x) + math.pi / 2)
    sh.visible_camera = False; sh.visible_glossy = False; sh.visible_diffuse = False; sh.visible_transmission = False; sh.visible_shadow = True; SHADOWS.append(sh)
    LAYOUT[who]['card_m'] = [round(W, 3), round(Hh, 3)]; LAYOUT[who]['m_per_px'] = round(mpp, 5); LAYOUT[who]['hands_world_local_xz'] = [[round(x0 + hx * mpp, 3), round(z0 + (img.size[1] - hy) * mpp, 3)] for hx, hy in c['hands']]
    # contact patch: a soft dark disc on the ground under the feet (multiply via transparent mix)
    bpy.ops.mesh.primitive_circle_add(vertices=48, radius=.42 if who == 'grandpa' else .3, fill_type='TRIFAN', location=Vector(LAYOUT[who]['pos']) + Vector((0, 0, .004)))
    cp = bpy.context.object; cp.name = 'CONTACT_' + who; cp.scale.y = .55
    pm = bpy.data.materials.new('contact_' + who); pm.use_nodes = True; N, L = pm.node_tree.nodes, pm.node_tree.links
    for n in list(N): N.remove(n)
    gc = N.new('ShaderNodeTexGradient'); gc.gradient_type = 'SPHERICAL'; tc = N.new('ShaderNodeTexCoord'); mp = N.new('ShaderNodeMapping')
    rr = .42 if who == 'grandpa' else .3
    mp.inputs['Scale'].default_value = (1 / rr, 1 / rr, 1)
    L.new(tc.outputs['Object'], mp.inputs['Vector']); L.new(mp.outputs['Vector'], gc.inputs['Vector'])
    pw = N.new('ShaderNodeMath'); pw.operation = 'POWER'; pw.inputs[1].default_value = 1.6; L.new(gc.outputs['Fac'], pw.inputs[0])
    mul = N.new('ShaderNodeMath'); mul.operation = 'MULTIPLY'; mul.inputs[1].default_value = .8; L.new(pw.outputs[0], mul.inputs[0])
    dk = N.new('ShaderNodeBsdfDiffuse'); dk.inputs['Color'].default_value = (0.02, 0.02, 0.03, 1); trn = N.new('ShaderNodeBsdfTransparent')
    mx2 = N.new('ShaderNodeMixShader'); L.new(mul.outputs[0], mx2.inputs['Fac']); L.new(trn.outputs[0], mx2.inputs[1]); L.new(dk.outputs[0], mx2.inputs[2])
    o2 = N.new('ShaderNodeOutputMaterial'); L.new(mx2.outputs[0], o2.inputs['Surface']); cp.data.materials.append(pm)
    cp.visible_shadow = False

# ---------------- water (look-finisher shading; the geometry here is a stand-in until props-hero delivers the arc and drops)
WATER = bpy.data.materials.new('water'); WATER.use_nodes = True; wb = WATER.node_tree.nodes['Principled BSDF']
wb.inputs['Base Color'].default_value = (0.92, 0.97, 1.0, 1); wb.inputs['Roughness'].default_value = .0; wb.inputs['IOR'].default_value = 1.333
wb.inputs['Transmission Weight'].default_value = 1.0
noz = Vector(LAYOUT['kid']['pos']) + Vector((.55, -.1, .95)); tgt = Vector(LAYOUT['grandpa']['pos']) + Vector((-.15, .05, 1.35))
cu = bpy.data.curves.new('water_arc', 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = .022; cu.bevel_resolution = 3; sp = cu.splines.new('POLY')
NPT = 24; sp.points.add(NPT - 1)
for i in range(NPT):
    t = i / (NPT - 1); p = noz.lerp(tgt, t) + Vector((0, 0, 1.3 * 4 * t * (1 - t))); sp.points[i].co = (p.x, p.y, p.z, 1); sp.points[i].radius = 1.0 - .55 * t
wa = bpy.data.objects.new('water_arc', cu); sc.collection.objects.link(wa); wa.data.materials.append(WATER)
random.seed(7)
for i in range(16):
    t = random.uniform(.75, 1.05); p = noz.lerp(tgt, t) + Vector((0, 0, 1.3 * 4 * t * (1 - t))) + Vector((random.uniform(-.25, .25), random.uniform(-.15, .15), random.uniform(-.2, .25)))
    bpy.ops.mesh.primitive_uv_sphere_add(radius=random.uniform(.012, .03), segments=12, ring_count=8, location=p); d = bpy.context.object; d.name = 'water_drop'; d.data.materials.append(WATER)

# ---------------- light: ONE hard bright sun (preset day) + the sky: lens/glossy see the deep flat blue with cumulus, other rays see the blue-violet fill
sun = bpy.data.objects.new('sun', bpy.data.lights.new('sun', 'SUN')); sc.collection.objects.link(sun)
sun.data.energy = S['strength']; sun.data.color = lin(S['colour'])[:3]; sun.data.angle = math.radians(S['angle_deg'])
sun.rotation_euler = (-to_sun).to_track_quat('-Z', 'Y').to_euler()
w = bpy.data.worlds.new('rick_day'); sc.world = w; w.use_nodes = True; nt = w.node_tree; N, L = nt.nodes, nt.links
for n in list(N): N.remove(n)
tc = N.new('ShaderNodeTexCoord'); nz = N.new('ShaderNodeVectorMath'); nz.operation = 'NORMALIZE'; L.new(tc.outputs['Generated'], nz.inputs[0])
sp_ = N.new('ShaderNodeSeparateXYZ'); L.new(nz.outputs[0], sp_.inputs[0])
mr = N.new('ShaderNodeMapRange'); mr.inputs[1].default_value = 0.; mr.inputs[2].default_value = .7; L.new(sp_.outputs[2], mr.inputs[0])
ramp = N.new('ShaderNodeValToRGB'); L.new(mr.outputs[0], ramp.inputs[0]); e = ramp.color_ramp.elements
e[0].position = 0.; e[0].color = lin(RL['sky_low']); e[1].position = 1.; e[1].color = lin(RL['sky_top'])
# cumulus: 2D noise on the dome (direction / height), in a band el ~12-45 deg so they show in the top third above the roof
dv = N.new('ShaderNodeVectorMath'); dv.operation = 'DIVIDE'; L.new(nz.outputs[0], dv.inputs[0])
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
bg_cam = N.new('ShaderNodeBackground'); L.new(sky.outputs['Result'], bg_cam.inputs[0]); bg_cam.inputs[1].default_value = 1.0
bg_fill = N.new('ShaderNodeBackground'); bg_fill.inputs[0].default_value = lin(RL['fill_col']); bg_fill.inputs[1].default_value = float(os.environ.get('FILL', RL['fill']))
lp = N.new('ShaderNodeLightPath'); orr = N.new('ShaderNodeMath'); orr.operation = 'MAXIMUM'; L.new(lp.outputs['Is Camera Ray'], orr.inputs[0]); L.new(lp.outputs['Is Glossy Ray'], orr.inputs[1])
ms = N.new('ShaderNodeMixShader'); L.new(orr.outputs[0], ms.inputs[0]); L.new(bg_fill.outputs[0], ms.inputs[1]); L.new(bg_cam.outputs[0], ms.inputs[2])
wo = N.new('ShaderNodeOutputWorld'); L.new(ms.outputs[0], wo.inputs['Surface'])
bpy.context.view_layer.update()

# ---------------- outline id pass (objects only; never ground, walls, roofs, glass, trees, grass, cast, water)
sys.path.append(os.path.join(ROOT, 'templates', 'blender_look', 'rick_outline')); import lines_key as LK
NOLINE = ('bo_lawn', 'bo_drive', 'bo_street', 'bo_house', 'bo_garage', 'bo_roof', 'bo_window', 'bo_car_glass', 'bo_crown', 'bo_trunk', 'water')
LINE_OBJS = [o for o in sc.objects if o.type == 'MESH' and not o.name.startswith(NOLINE + ('CARD_', 'SHADOWCARD_', 'CONTACT_'))]
HIDE_OBJS = CARDS + SHADOWS + [o for o in sc.objects if o.name.startswith(('CONTACT_', 'water'))]
print('LINE_SETUP', LK.setup(sc, LINE_OBJS, HIDE_OBJS))

# ---------------- render settings + cast mask pass (Standard view, never AgX)
r.engine = 'CYCLES'; r.image_settings.file_format = 'PNG'; r.image_settings.color_mode = 'RGB'; r.image_settings.color_depth = '16'
sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'None'; sc.view_settings.exposure = float(os.environ.get('EXPO', '-0.7'))
sc.cycles.use_denoising = True; sc.cycles.denoiser = 'OPENIMAGEDENOISE'; sc.cycles.use_adaptive_sampling = True
sc.cycles.max_bounces = 8; sc.cycles.transmission_bounces = 8; sc.cycles.transparent_max_bounces = 16; sc.cycles.caustics_reflective = False; sc.cycles.caustics_refractive = False
sc.cycles.blur_glossy = .5; r.film_transparent = False; r.use_motion_blur = False
vl = sc.view_layers[0]; vl.use_pass_object_index = True
tree = bpy.data.node_groups.new('st_comp', 'CompositorNodeTree'); sc.compositing_node_group = tree; N, L = tree.nodes, tree.links
rl = N.new('CompositorNodeRLayers'); fo = N.new('CompositorNodeOutputFile'); fo.file_name = 'pass_'
fo.format.media_type = 'IMAGE'; fo.format.file_format = 'PNG'; fo.format.color_depth = '16'; fo.format.color_mode = 'BW'; fo.save_as_render = False
fo.file_output_items.new('FLOAT', 'mask')
idm = N.new('CompositorNodeIDMask'); idm.inputs['Index'].default_value = 1; idm.inputs['Anti-Alias'].default_value = True
L.new(rl.outputs['Object Index'], idm.inputs[0]); L.new(idm.outputs[0], fo.inputs['mask'])
go = N.new('NodeGroupOutput'); tree.interface.new_socket('Image', in_out='OUTPUT', socket_type='NodeSocketColor'); L.new(rl.outputs['Image'], go.inputs[0])

# ---------------- numbers: where each planned piece lands on screen, how much of each card the lens sees, the down-angle to each chest
from bpy_extras.object_utils import world_to_camera_view as w2c
def scr(p): v = w2c(sc, cam, Vector(p)); return [round(v.x, 3), round(1 - v.y, 3), round(v.z, 2)]
dg = bpy.context.evaluated_depsgraph_get(); NUM = {}
for k in ('car', 'grandpa', 'kid', 'bucket', 'hose_reel', 'mailbox', 'bike', 'tree', 'garage', 'house'):
    NUM[k] = {'base_xy_from_top_left': scr(LAYOUT[k]['pos'])}
for c_ in (Vector(LAYOUT['car']['pos']) + f * 2.4 + left * .95, Vector(LAYOUT['car']['pos']) - f * 2.4 + left * .95, Vector(LAYOUT['car']['pos']) + f * 2.4 - left * .95):
    NUM.setdefault('car_corners', []).append(scr(c_))
for o in CARDS:
    who = o.name[5:]; seen = tot = 0
    for zz in np.linspace(.1, LAYOUT[who]['height'] - .05, 12):
        for xx in np.linspace(-.18, .18, 4):
            p = o.matrix_world @ Vector((xx, 0, zz)); d = p - cam.location; tot += 1
            ok, loc, nrm, i, ob, mm = sc.ray_cast(dg, cam.location, d.normalized(), distance=d.length - .02)
            if not ok or ob.name.startswith(('water', 'SHADOW', 'CONTACT')): seen += 1
    chest = Vector(LAYOUT[who]['pos']) + Vector((0, 0, LAYOUT[who]['height'] * .7)); dd = chest - cam.location
    NUM[who].update(visible_share=round(seen / tot, 2), down_angle_deg=round(math.degrees(math.atan2(cam.location.z - chest.z, dd.xy.length)), 1),
                    top_xy=scr(Vector(LAYOUT[who]['pos']) + Vector((0, 0, LAYOUT[who]['height'])))
                    )
LAYOUT['_screen_numbers'] = NUM
json.dump(LAYOUT, open(os.path.join(EP, 'LAYOUT.json'), 'w'), indent=1, default=lambda v: list(v))
print('NUMBERS', json.dumps(NUM))

if MODE == 'preview':
    r.resolution_percentage = int(os.environ.get('PCT', '50')); sc.cycles.device = 'CPU'; sc.cycles.samples = int(os.environ.get('SPP', '16'))
    od = os.path.dirname(os.path.abspath(OUT_PNG)); fo.directory = od + '/' + os.path.splitext(os.path.basename(OUT_PNG))[0] + '_'
    r.filepath = OUT_PNG; t0 = time.time(); bpy.ops.render.render(write_still=True); print('RENDER_SECONDS %.1f' % (time.time() - t0))
    t0 = time.time(); LK.render(sc, os.path.splitext(OUT_PNG)[0] + '_lines_id.png'); print('LINES_SECONDS %.1f' % (time.time() - t0))
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(EP, 'scene.blend'))
    print('PREVIEW_DONE', OUT_PNG)
