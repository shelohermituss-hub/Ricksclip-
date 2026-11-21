# build_A2.py: KEY FRAME A (S1 frame 0, the hook poster) in THE RICK RECIPE (CB_RULES section 3, LOOK_BIBLE v2). Same staging as build_A.py
#   (kit camera, cast cards, props, hose, fist, mist from dump_A.json), only the LOOK changes: one hard bright sun (rick_light.json 'day'), deep flat
#   blue camera sky with cumulus, blue-violet sky fill, metallic clear-coat truck paint with low wear, bare front tyres + red rims as in the kit,
#   the thin-outline id pass (rick_outline/lines_key.py). Grade + lines: finish_key.py (grade_rick DAY, cast mask kept).
#   blender -b ../sets/town/out/town.blend --python build_A2.py -- <info|preview|package> [out_png]      env SUN_AZ, SUN_EL, PCT, SPP
# preview: 540x960 Cycles CPU 16 spp + OIDN -> out_png + <dir>/A2_mask*.png + <dir>/A2_lines_id.png. package: 1080x1920 GPU 512 spp, packed -> runpod/A2/scene.blend.
import bpy, sys, os, json, math, time
from mathutils import Matrix, Vector
HERE = os.path.dirname(os.path.abspath(__file__)); EP = os.path.normpath(os.path.join(HERE, '..'))
sys.path.append(os.path.join(EP, 'sets', 'town', 'scripts')); sys.path.append(os.path.join(EP, 'assets_prod', 'scripts'))
import town_api as TA, truck_api as T, props_api as PA
args = sys.argv[sys.argv.index('--') + 1:]; MODE = args[0]; OUT_PNG = args[1] if len(args) > 1 else os.path.join(HERE, 'prev', 'A2_raw.png')
D = json.load(open(os.path.join(HERE, 'dump_A.json'))); FIST = json.load(open(os.path.join(HERE, 'dump_A_fist.json')))
sc = bpy.context.scene
C4 = Matrix(((1, 0, 0, 0), (0, 0, -1, 0), (0, 1, 0, 0), (0, 0, 0, 1)))   # three.js (Y up) -> plan / Blender (Z up): (x, y, z) -> (x, -z, y)
def M3(el): return Matrix([el[0:4], el[4:8], el[8:12], el[12:16]]).transposed()   # three.js column-major
def P(v): return Vector((v[0], -v[2], v[1]))
def lin(h): return TA.lin(h)

# ---- base: the town's AM state (day lamps, air motes), hero truck in its frame-0 state (kit EDGE(0) = -1.55); the light is replaced below
TA.set_light(sc, 'am')
TA.set_trucks(sc, hero=dict(paint='half', edge=-1.55, masking=True, letters='under', wear=.05, ribbon=False))
hero_t = TA.hero_root(); T.set_extras(hero_t, sirens=4, beacon_row=True, price_card=True)
kit_hero = [v for k, v in D['meshes'].items() if k.startswith('phfd_truck')]
for v in kit_hero:
    m = C4 @ M3(v['m']) @ C4.inverted(); print('KIT_TRUCK', [round(x, 3) for x in m.translation], 'BL hero', [round(x, 3) for x in hero_t.matrix_world.translation])

# ---- camera (exact kit matrix and vertical field of view)
cd = D['cam']; co = bpy.data.objects.get('cineCam') or bpy.data.objects.new('cineCam', bpy.data.cameras.new('cineCam'))
if co.name not in sc.collection.objects: sc.collection.objects.link(co)
co.matrix_world = C4 @ M3(cd['m']); co.data.sensor_fit = 'VERTICAL'; co.data.sensor_height = 36.; co.data.angle_y = math.radians(cd['fov'])
co.data.clip_start = .05; co.data.clip_end = 3000; sc.camera = co
print('CAM', [round(x, 3) for x in co.location], 'lens', round(co.data.lens, 2))

def flat_mat(name, hexc, emit=1.0, rough=None):
    m = bpy.data.materials.new(name); m.use_nodes = True; N, L = m.node_tree.nodes, m.node_tree.links; b = N['Principled BSDF']
    b.inputs['Base Color'].default_value = lin(hexc); b.inputs['Roughness'].default_value = rough if rough is not None else .55
    if emit: b.inputs['Emission Color'].default_value = lin(hexc); b.inputs['Emission Strength'].default_value = emit
    return m

# ---- cast cards: the kit's corners in world space, its UVs, its drawn picture (tint #fff6ea like MeshBasicMaterial), self-lit, cast shadows
CARD_OBJS = []
for who, c in D['cards'].items():
    img = bpy.data.images.load(os.path.join(HERE, 'A_cards', who + '.png')); img.pack(); img.alpha_mode = 'STRAIGHT'
    me = bpy.data.meshes.new('card_' + who); verts = [P(v) for v in c['corners']]
    idx = c['idx'] or [0, 2, 1, 2, 3, 1]; faces = [idx[i:i + 3] for i in range(0, len(idx), 3)]
    me.from_pydata(verts, [], faces); uvl = me.uv_layers.new(name='UVMap')
    for poly in me.polygons:
        for li in poly.loop_indices: uvl.data[li].uv = c['uvs'][me.loops[li].vertex_index]
    m = bpy.data.materials.new('cardmat_' + who); m.use_nodes = True; N, L = m.node_tree.nodes, m.node_tree.links
    for n in list(N): N.remove(n)
    tx = N.new('ShaderNodeTexImage'); tx.image = img; tx.interpolation = 'Cubic'
    mul = N.new('ShaderNodeMix'); mul.data_type = 'RGBA'; mul.blend_type = 'MULTIPLY'; mul.inputs['Factor'].default_value = 1
    L.new(tx.outputs['Color'], mul.inputs['A']); mul.inputs['B'].default_value = lin('#' + c['color'])
    em = N.new('ShaderNodeEmission'); L.new(mul.outputs['Result'], em.inputs['Color']); em.inputs['Strength'].default_value = 1.0
    tr = N.new('ShaderNodeBsdfTransparent'); mx = N.new('ShaderNodeMixShader'); L.new(tx.outputs['Alpha'], mx.inputs['Fac']); L.new(tr.outputs[0], mx.inputs[1]); L.new(em.outputs[0], mx.inputs[2])
    out = N.new('ShaderNodeOutputMaterial'); L.new(mx.outputs[0], out.inputs['Surface'])
    m.blend_method = 'HASHED' if hasattr(m, 'blend_method') else None
    me.materials.append(m); o = bpy.data.objects.new('CARD_' + who, me); sc.collection.objects.link(o)
    o.pass_index = 1; o.visible_diffuse = False; o.visible_glossy = True; o.visible_shadow = True
    CARD_OBJS.append(o)
    # contact patch at the feet: a soft dark ellipse on the concrete (lighting rule: small dark patch under every sole)
    feet = P(c['pos']); hgt = (verts[0] - verts[2]).length if len(verts) > 2 else 1.7
    bpy.ops.mesh.primitive_plane_add(size=1, location=(feet.x, feet.y, feet.z + .006)); cp = bpy.context.object; cp.name = 'CONTACT_' + who
    cp.scale = (.62, .34, 1) if who == 'hero' else (.5, .3, 1)
    mm = bpy.data.materials.new('contact_' + who); mm.use_nodes = True; N, L = mm.node_tree.nodes, mm.node_tree.links
    for n in list(N): N.remove(n)
    tc = N.new('ShaderNodeTexCoord'); g = N.new('ShaderNodeTexGradient'); g.gradient_type = 'SPHERICAL'
    mp = N.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value = (2, 2, 1); mp.inputs['Location'].default_value = (0, 0, 0)
    L.new(tc.outputs['Object'], mp.inputs['Vector']); L.new(mp.outputs['Vector'], g.inputs['Vector'])
    pw = N.new('ShaderNodeMath'); pw.operation = 'POWER'; pw.inputs[1].default_value = 1.6; L.new(g.outputs['Fac'], pw.inputs[0])
    sc2 = N.new('ShaderNodeMath'); sc2.operation = 'MULTIPLY'; sc2.inputs[1].default_value = .72; L.new(pw.outputs[0], sc2.inputs[0])
    df = N.new('ShaderNodeBsdfDiffuse'); df.inputs['Color'].default_value = lin('#2a2236'); tr = N.new('ShaderNodeBsdfTransparent'); mx = N.new('ShaderNodeMixShader')
    L.new(sc2.outputs[0], mx.inputs['Fac']); L.new(tr.outputs[0], mx.inputs[1]); L.new(df.outputs[0], mx.inputs[2])
    out = N.new('ShaderNodeOutputMaterial'); L.new(mx.outputs[0], out.inputs['Surface']); cp.data.materials.append(mm); cp.visible_shadow = False

# ---- props from assets_prod at the kit's own matrices (kit group matrix M: Blender = C M C^-1 over the asset root)
PROPS = {'phfd_compressor': ('compressor', 'COMPRESSOR'), 'phfd_paint_tin_lemon': ('paint_tin_lemon', 'PAINT_TIN_LEMON'), 'phfd_ribbon_set': ('ribbon_set', 'RIBBON_SET'),
         'phfd_lunch_box': ('lunch_box', 'LUNCH_BOX'), 'phfd_lemon': ('lemon', 'LEMON'), 'phfd_spray_gun': ('gun', 'GUN')}
for key, v in D['meshes'].items():
    nm = key.split('#')[0]
    if nm not in PROPS or not v['visible']: continue
    f, col = PROPS[nm]; root = PA.append(os.path.join(EP, 'assets_prod', 'out', f + '.blend'), col)
    par = bpy.data.objects.new('KIT_' + nm, None); sc.collection.objects.link(par); par.matrix_world = C4 @ M3(v['m']) @ C4.inverted()
    loc = root.matrix_world.copy(); root.parent = par; root.matrix_parent_inverse = Matrix.Identity(4); root.matrix_basis = loc
    print('PROP', nm, [round(x, 3) for x in par.matrix_world.translation])

# ---- the air hose (kit tube, exact) and the 3D fist on the gun
def mesh_from(name, flat, idx, mat):
    vs = [P(flat[i:i + 3]) for i in range(0, len(flat), 3)]; fs = [idx[i:i + 3] for i in range(0, len(idx), 3)]
    me = bpy.data.meshes.new(name); me.from_pydata(vs, [], fs); me.polygons.foreach_set('use_smooth', [True] * len(me.polygons))
    me.materials.append(mat); o = bpy.data.objects.new(name, me); sc.collection.objects.link(o); return o
if 'hose' in D:
    hm = flat_mat('hose_rubber_cine', '#26262a', emit=0, rough=.5); mesh_from('HOSE', D['hose']['pos'], D['hose']['idx'], hm)
for k, fm in enumerate(FIST):
    mt = flat_mat('fist_%d' % k, '#' + fm['color'], emit=1.0, rough=.6)
    o = mesh_from('FIST_%s_%d' % (fm['name'], k), fm['v'], fm['idx'], mt); o.pass_index = 1   # part of the character: kept clean like the cards

# ---- paint mist: the kit's lemon sprites as small lit volumes (sun scatters in them; lemon glow)
vm = bpy.data.materials.new('mist_lemon'); vm.use_nodes = True; N, L = vm.node_tree.nodes, vm.node_tree.links
for n in list(N): N.remove(n)
pv = N.new('ShaderNodeVolumePrincipled'); pv.inputs['Color'].default_value = lin('#e3ea22'); pv.inputs['Density'].default_value = 3.0
pv.inputs['Emission Color'].default_value = lin('#e3ea22'); pv.inputs['Emission Strength'].default_value = .18
tc = N.new('ShaderNodeTexCoord'); gr = N.new('ShaderNodeTexGradient'); gr.gradient_type = 'SPHERICAL'; L.new(tc.outputs['Object'], gr.inputs['Vector'])
ml = N.new('ShaderNodeMath'); ml.operation = 'MULTIPLY'; ml.inputs[1].default_value = 3.0; L.new(gr.outputs['Fac'], ml.inputs[0]); L.new(ml.outputs[0], pv.inputs['Density'])
out = N.new('ShaderNodeOutputMaterial'); L.new(pv.outputs[0], out.inputs['Volume'])
for i, s in enumerate(D['sprites']):
    if s['c'] != 'e3ea22': continue
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=1.0, location=P(s['p'])); o = bpy.context.object; o.name = 'MIST_%d' % i
    o.data.materials.append(vm); o['op'] = s['o']; o.scale = (s['s'] * .5,) * 3

# ==================================================================== THE RICK RECIPE (CB_RULES section 3, LOOK_BIBLE v2): look only, staging untouched
RL = json.load(open(os.path.join(EP, '..', '..', 'templates', 'blender_look', 'rick_light.json')))['day']
SUN_AZ = float(os.environ.get('SUN_AZ', '265')); SUN_EL = float(os.environ.get('SUN_EL', '45'))   # 'info' sun scan: hero 1.00, truck front .88 in sun (STATE.md)

# ---- materials. Trucks: high-gloss METALLIC paint under a clear coat (reflects the blue sky and the station), wear at the low end;
# front tyres: the kit shows them bare (dark rubber, red rim), so the kraft masking on the tyres goes (body masking paper stays: story)
def clearcoat(m, metal=.55, rough=.24):
    b = m.node_tree.nodes.get('Principled BSDF')
    if b is None: return
    if not b.inputs['Metallic'].is_linked: b.inputs['Metallic'].default_value = metal
    if not b.inputs['Roughness'].is_linked: b.inputs['Roughness'].default_value = rough
    b.inputs['Coat Weight'].default_value = 1.0; b.inputs['Coat Roughness'].default_value = .03; b.inputs['Coat IOR'].default_value = 1.5
    print('PAINT', m.name, 'metal linked' if b.inputs['Metallic'].is_linked else metal, 'rough linked' if b.inputs['Roughness'].is_linked else rough)
for r_ in (TA.hero_root(), TA.chief_root()):
    if r_ is None: continue
    for o in T._objs(r_):
        if o.type == 'MESH' and o.get('mask') == 2 and o.get('mask_orig'):
            for sl in o.material_slots: sl.material = bpy.data.materials[o['mask_orig']]
    for m, n in T._paint_groups(r_): n.inputs['wear'].default_value = .05
done_m = set()
for r_ in (TA.hero_root(), TA.chief_root()):
    for o in (T._objs(r_) if r_ else []):
        for sl in getattr(o, 'material_slots', []):
            m = sl.material
            if m and m.get('phfd_role') == 'paint' and m.name not in done_m: clearcoat(m); done_m.add(m.name)
rim = flat_mat('cine_rim_red', '#D3141C', emit=0, rough=.22); rb = rim.node_tree.nodes['Principled BSDF']
rb.inputs['Metallic'].default_value = .45; rb.inputs['Coat Weight'].default_value = 1.0; rb.inputs['Coat Roughness'].default_value = .03
for o in bpy.data.objects:
    if o.type == 'MESH':
        for sl in o.material_slots:
            if sl.material and sl.material.name.split('.')[0] == 'redwheel': sl.material = rim
tb = bpy.data.materials.get('tyre_black')
if tb: print('TYRE', [n.type for n in tb.node_tree.nodes])

# ---- light: ONE hard bright sun (preset day: strength 7, #ffe2c0, angle 1.2), elevation SUN_EL so the hero and the truck front are in full sun
sun = bpy.data.objects['town_sun']; sun.data.energy = RL['sun']; sun.data.color = lin(RL['sun_col'])[:3]; sun.data.angle = math.radians(RL['sun_angle_deg'])
sun.rotation_euler = TA._sun_dir(SUN_AZ, SUN_EL).to_track_quat('-Z', 'Y').to_euler()
# ---- sky: what the LENS (and the glossy paint) sees = deep flat blue #1a86f2 low -> #0f79e8 zenith with white cumulus low behind the subject;
# what LIGHTS the world = a strong blue-violet fill #b4c3f0 x .85 (lifted, cool shadows). Light Path 'Is Camera Ray' / 'Is Glossy Ray' mix.
w = sc.world; nt = w.node_tree; N, L = nt.nodes, nt.links
for n in list(N): N.remove(n)
tc = N.new('ShaderNodeTexCoord'); nz = N.new('ShaderNodeVectorMath'); nz.operation = 'NORMALIZE'; L.new(tc.outputs['Generated'], nz.inputs[0])
sp = N.new('ShaderNodeSeparateXYZ'); L.new(nz.outputs[0], sp.inputs[0])
mr = N.new('ShaderNodeMapRange'); mr.inputs[1].default_value = 0.; mr.inputs[2].default_value = .7; L.new(sp.outputs[2], mr.inputs[0])
ramp = N.new('ShaderNodeValToRGB'); L.new(mr.outputs[0], ramp.inputs[0]); e = ramp.color_ramp.elements
e[0].position = 0.; e[0].color = lin(RL['sky_low']); e[1].position = 1.; e[1].color = lin(RL['sky_top'])
# cumulus: a 2D noise on the dome (direction / height), sharpened, only in a low band (el ~3-28 deg), white tops, light-blue shade underneath
dv = N.new('ShaderNodeVectorMath'); dv.operation = 'DIVIDE'; L.new(nz.outputs[0], dv.inputs[0])
cz = N.new('ShaderNodeCombineXYZ'); L.new(sp.outputs[2], cz.inputs[0]); L.new(sp.outputs[2], cz.inputs[1]); cz.inputs[2].default_value = 1.
mx_ = N.new('ShaderNodeVectorMath'); mx_.operation = 'MAXIMUM'; L.new(cz.outputs[0], mx_.inputs[0]); mx_.inputs[1].default_value = (.12, .12, 1.)
L.new(mx_.outputs[0], dv.inputs[1])
nb = N.new('ShaderNodeTexNoise'); nb.noise_dimensions = '2D'; nb.inputs['Scale'].default_value = 1.6; nb.inputs['Detail'].default_value = 6.; nb.inputs['Roughness'].default_value = .55
L.new(dv.outputs[0], nb.inputs['Vector'])
cr = N.new('ShaderNodeMapRange'); cr.inputs[1].default_value = .56; cr.inputs[2].default_value = .66; L.new(nb.outputs['Fac'], cr.inputs[0])
band = N.new('ShaderNodeMapRange'); band.interpolation_type = 'SMOOTHSTEP'; L.new(sp.outputs[2], band.inputs[0])
band.inputs[1].default_value = .03; band.inputs[2].default_value = .10; band.inputs[3].default_value = 0.; band.inputs[4].default_value = 1.
band2 = N.new('ShaderNodeMapRange'); band2.interpolation_type = 'SMOOTHSTEP'; L.new(sp.outputs[2], band2.inputs[0])
band2.inputs[1].default_value = .30; band2.inputs[2].default_value = .47; band2.inputs[3].default_value = 1.; band2.inputs[4].default_value = 0.
cm = N.new('ShaderNodeMath'); cm.operation = 'MULTIPLY'; L.new(band.outputs[0], cm.inputs[0]); L.new(band2.outputs[0], cm.inputs[1])
cm2 = N.new('ShaderNodeMath'); cm2.operation = 'MULTIPLY'; cm2.use_clamp = True; L.new(cr.outputs[0], cm2.inputs[0]); L.new(cm.outputs[0], cm2.inputs[1])
shd = N.new('ShaderNodeMapRange'); shd.inputs[1].default_value = .58; shd.inputs[2].default_value = .78; L.new(nb.outputs['Fac'], shd.inputs[0])
cc = N.new('ShaderNodeMix'); cc.data_type = 'RGBA'; L.new(shd.outputs[0], cc.inputs['Factor']); cc.inputs['A'].default_value = lin('#bcd6f6'); cc.inputs['B'].default_value = lin('#ffffff')
sky = N.new('ShaderNodeMix'); sky.data_type = 'RGBA'; L.new(cm2.outputs[0], sky.inputs['Factor']); L.new(ramp.outputs[0], sky.inputs['A']); L.new(cc.outputs['Result'], sky.inputs['B'])
bg_cam = N.new('ShaderNodeBackground'); L.new(sky.outputs['Result'], bg_cam.inputs[0]); bg_cam.inputs[1].default_value = 1.0
bg_fill = N.new('ShaderNodeBackground'); bg_fill.inputs[0].default_value = lin(RL['fill_col']); bg_fill.inputs[1].default_value = float(os.environ.get('FILL', RL['fill'] * 1.6))   # x1.6: the station hides half the sky from the yard
lp = N.new('ShaderNodeLightPath'); orr = N.new('ShaderNodeMath'); orr.operation = 'MAXIMUM'; L.new(lp.outputs['Is Camera Ray'], orr.inputs[0]); L.new(lp.outputs['Is Glossy Ray'], orr.inputs[1])
ms = N.new('ShaderNodeMixShader'); L.new(orr.outputs[0], ms.inputs[0]); L.new(bg_fill.outputs[0], ms.inputs[1]); L.new(bg_cam.outputs[0], ms.inputs[2])
wo = N.new('ShaderNodeOutputWorld'); L.new(ms.outputs[0], wo.inputs['Surface'])
bpy.context.view_layer.update()

# ---- SHADOW PASS (rule 6b): hidden copies of the cards, turned about the vertical axis at the feet to face the sun, cast the full-figure shadows
sdir = sun.matrix_world.to_quaternion() @ Vector((0, 0, -1)); sh = Vector((-sdir.x, -sdir.y, 0)).normalized()
SHADOW_OBJS = []
for o in CARD_OBJS:
    me = o.data; v = [x.co.copy() for x in me.vertices]; n = (v[1] - v[0]).cross(v[2] - v[0]); n.z = 0; n.normalize()
    ang = math.atan2(sh.y, sh.x) - math.atan2(n.y, n.x); feet = P(D['cards'][o.name[5:]]['pos']); R = Matrix.Rotation(ang, 4, 'Z')
    cp = o.copy(); cp.data = me.copy(); cp.name = 'SHADOWCARD_' + o.name[5:]; sc.collection.objects.link(cp)
    for x in cp.data.vertices: x.co = feet + R @ (x.co - feet)
    cp.visible_camera = False; cp.visible_glossy = False; cp.visible_diffuse = False; cp.visible_transmission = False; cp.visible_volume_scatter = False; cp.visible_shadow = True
    o.visible_shadow = False; SHADOW_OBJS.append(cp)
# the film's signature light stays (LOOK_BIBLE: the lemon truck's own bounce); the old lavender fill and cream rim area lights are gone (one sun + sky)
area_ = bpy.data.lights.new('cine_lemon_bounce', 'AREA'); area_.energy = 30.; area_.color = lin('#e3ea22')[:3]; area_.size = 1.2
ob_ = bpy.data.objects.new('cine_lemon_bounce', area_); sc.collection.objects.link(ob_); ob_.location = (-2.75, 16.6, .9)
ob_.rotation_euler = (Vector((-1.4, 15.6, 0.0)) - ob_.location).to_track_quat('-Z', 'Y').to_euler()

# ---- LINE OBJECTS (thin outline, objects only): trucks, props, hose, small town props and the station's trim/sign/doors/windows; never ground,
# walls, roofs, sky, trees/grass or the cast (cards, shadow cards, fist), never mist or air motes
NATURE = ('grass_patch', 'island_tree_02', 'bush', 'shrub_03', 'weed_plant_02', 'dandelion', 'grass_clump')
# the town is merged per material (town_<mat>): ground, walls, roofs, floors, decals, glass panes and thin wires carry no line
NOLINE_TOWN = ('asphalt', 'bay_floor', 'block_', 'clap_', 'decal_', 'floor_', 'ground_', 'hill_', 'kerb', 'roof_', 'walk', 'yard', 'win_', 'glass',
               'wire', 'swing_rope', 'lamp_fluor')
NOLINE = ('lawn', 'puddle', 'keep_clear', 'stop_bar', 'yard_line', 'tracks_', 'shop_ceiling', 'lemon_spray', 'tpl_', 'photo_truck', 'shop_window_glass')
def is_line(o):
    if o.type != 'MESH' or o.hide_render: return False
    if o.pass_index == 1 or o.name.startswith(('CARD_', 'SHADOWCARD_', 'FIST_', 'MIST_', 'air_', 'CONTACT_')): return False
    root = o
    while root.parent: root = root.parent
    if root.name in ('HERO_TRUCK', 'CHIEF_TRUCK') or root.name.startswith('KIT_') or o.name == 'HOSE': return True
    a = o.get('asset') or (o.parent.get('asset') if o.parent else None)
    if a: return a not in NATURE
    if o.name.startswith('town_'): return not any(k in o.name[5:] for k in NOLINE_TOWN)
    return not o.name.startswith(NOLINE)
LINE_OBJS = [o for o in sc.objects if is_line(o)]
HIDE_OBJS = CARD_OBJS + SHADOW_OBJS + [o for o in sc.objects if o.name.startswith(('FIST_', 'MIST_', 'air_', 'CONTACT_'))]
sys.path.append(os.path.join(EP, '..', '..', 'templates', 'blender_look', 'rick_outline')); import lines_key as LK
print('LINE_SETUP', LK.setup(sc, LINE_OBJS, HIDE_OBJS))

# ---- render settings + passes (Standard view, never AgX)
r = sc.render; r.engine = 'CYCLES'; r.image_settings.file_format = 'PNG'; r.image_settings.color_mode = 'RGB'; r.image_settings.color_depth = '16'
sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'None'; sc.view_settings.exposure = float(os.environ.get('EXPO', RL['exposure'] - .7));   # -0.7 EV: sunlit whites near p99 .97, no clipped reds (A2 v1 raw p99 1.0, rims orange)
sc.view_settings.gamma = 1
sc.cycles.use_denoising = True; sc.cycles.denoiser = 'OPENIMAGEDENOISE'; sc.cycles.use_adaptive_sampling = True
sc.cycles.max_bounces = 6; sc.cycles.transparent_max_bounces = 16; sc.cycles.volume_bounces = 1; sc.cycles.caustics_reflective = False; sc.cycles.caustics_refractive = False
sc.cycles.blur_glossy = .5; r.film_transparent = False; r.use_motion_blur = False
vl = sc.view_layers[0]; vl.use_pass_z = True; vl.use_pass_object_index = True
tree = bpy.data.node_groups.new('cine_comp_A2', 'CompositorNodeTree'); sc.compositing_node_group = tree; N, L = tree.nodes, tree.links
rl = N.new('CompositorNodeRLayers'); fo = N.new('CompositorNodeOutputFile'); fo.file_name = 'pass_'
fo.format.media_type = 'IMAGE'; fo.format.file_format = 'PNG'; fo.format.color_depth = '16'; fo.format.color_mode = 'BW'; fo.save_as_render = False
fo.file_output_items.new('FLOAT', 'mask')
idm = N.new('CompositorNodeIDMask'); idm.inputs['Index'].default_value = 1; idm.inputs['Anti-Alias'].default_value = True
L.new(rl.outputs['Object Index'], idm.inputs[0]); L.new(idm.outputs[0], fo.inputs['mask'])
go = N.new('NodeGroupOutput'); tree.interface.new_socket('Image', in_out='OUTPUT', socket_type='NodeSocketColor'); L.new(rl.outputs['Image'], go.inputs[0])

def cast_until(o_, d_, skip=('CARD_', 'SHADOWCARD_', 'MIST_', 'air_', 'CONTACT_')):
    dg = bpy.context.evaluated_depsgraph_get(); p = o_.copy()
    for _ in range(8):
        ok, loc, nrm, i, ob, mm = sc.ray_cast(dg, p + d_ * .02, d_, distance=300)
        if not ok: return None
        if not ob.name.startswith(skip): return ob
        p = loc
    return None

if MODE == 'info':
    # SUN SCAN: camera rays on a 54 x 96 grid; per (az, el) the share of the hero card's pixels and of the hero truck's visible FRONT half in direct sun
    W_, H_ = 54, 96; cam = sc.camera; fr = cam.data.view_frame(scene=sc); m_ = cam.matrix_world; c0 = m_.translation
    tl, bl_, br, tr_ = [m_ @ v for v in (fr[3], fr[2], fr[1], fr[0])]
    dg = bpy.context.evaluated_depsgraph_get(); hits = []; count = {}
    for j in range(H_):
        for i in range(W_):
            u, v = (i + .5) / W_, (j + .5) / H_; p = tl + (tr_ - tl) * u + (bl_ - tl) * v; d = (p - c0).normalized()
            ok, loc, nrm, k, ob, mm = sc.ray_cast(dg, c0, d, distance=500)
            if not ok: count['SKY'] = count.get('SKY', 0) + 1; continue
            count[ob.name] = count.get(ob.name, 0) + 1
            root = ob
            while root.parent: root = root.parent
            if ob.name == 'CARD_hero': hits.append(('hero', loc))
            elif root.name == 'HERO_TRUCK': hits.append(('truck', loc + nrm * .01))
    print('VIEW', sorted(count.items(), key=lambda kv: -kv[1])[:60])
    print('LINE_IN_VIEW', [n for n, c in sorted(count.items(), key=lambda kv: -kv[1]) if bpy.data.objects.get(n) in LINE_OBJS][:60])
    hx = TA.hero_root().matrix_world; front = [h for h in hits if h[0] == 'truck' and (hx.inverted() @ h[1]).x < 0]
    for az in (225, 240, 250, 255, 265, 280):
        for el in (35, 40, 42, 45, 50):
            sd = TA._sun_dir(az, el); up = -sd
            hs = [cast_until(h[1], up) is None for h in hits if h[0] == 'hero']; ts = [cast_until(h[1], up) is None for h in front]
            print('SUNSCAN az %d el %d hero %.2f truckfront %.2f (n %d/%d)' % (az, el, sum(hs) / max(len(hs), 1), sum(ts) / max(len(ts), 1), len(hs), len(ts)))
elif MODE == 'preview':
    r.resolution_x, r.resolution_y, r.resolution_percentage = 540, 960, int(os.environ.get('PCT', '100')); sc.cycles.device = 'CPU'; sc.cycles.samples = int(os.environ.get('SPP', '16'))
    od = os.path.dirname(os.path.abspath(OUT_PNG)); fo.directory = od + '/A2_'
    r.filepath = OUT_PNG; t0 = time.time(); bpy.ops.render.render(write_still=True); print('RENDER_SECONDS %.1f' % (time.time() - t0)); print('PREVIEW_DONE', OUT_PNG)
    ex = bpy.data.images['Render Result']; isf = sc.render.image_settings
    isf.file_format = 'OPEN_EXR'; isf.color_depth = '32'; ex.save_render(os.path.splitext(OUT_PNG)[0] + '_lin.exr'); isf.file_format = 'PNG'; isf.color_depth = '16'
    t0 = time.time(); LK.render(sc, os.path.join(od, 'A2_lines_id.png')); print('LINES_SECONDS %.1f' % (time.time() - t0))
else:
    r.resolution_x, r.resolution_y, r.resolution_percentage = 1080, 1920, 100; sc.cycles.samples = 512; sc.cycles.adaptive_threshold = .01
    sc.cycles.device = 'GPU'; fo.directory = '//out/A2_'; r.filepath = '//out/A2_raw_'
    pk = os.path.join(HERE, 'runpod', 'A2'); os.makedirs(os.path.join(pk, 'out'), exist_ok=True)
    for im in bpy.data.images:
        if im.source == 'FILE' and not im.packed_file:
            try: im.pack()
            except Exception as e_: print('PACK_FAIL', im.name, im.filepath, e_)
    bpy.ops.file.pack_all()
    for im in bpy.data.images:
        if im.source == 'FILE' and not im.packed_file: print('NOT_PACKED', im.name, im.filepath)
    for lib in bpy.data.libraries: print('LIBRARY (must be none)', lib.filepath)
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(pk, 'scene.blend'), compress=True, relative_remap=True)
    print('PACKAGE_SAVED', os.path.join(pk, 'scene.blend'))
