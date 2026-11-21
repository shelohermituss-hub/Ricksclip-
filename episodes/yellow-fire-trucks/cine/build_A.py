# build_A.py: KEY FRAME A (S1 frame 0, the hook poster) rebuilt in Blender from the FULL town set, from the kit's own frame-0 state.
#   blender -b ../sets/town/out/town.blend --python build_A.py -- <preview|package> [out_png]
# Inputs (all in cine/): dump_A.json (kit camera, cast cards, prop matrices, hose, mist; dump_scene.js), dump_A_fist.json (the 3D fist),
#   A_cards/<who>.png (prep_cards.py: the kit's drawn cards with the pale inner rim on the sun side).
# preview: 540x960, Cycles CPU 16 spp + OIDN, renders to out_png. package: 1080x1920, GPU (OptiX, CPU fallback) 512 spp + OIDN,
#   everything packed, saved to runpod/A/scene.blend (no render here).
# Passes for the grade (grade_key.py): //out/pass_depth (16-bit, 0-200 m), //out/pass_mask (16-bit, cast cards = 1).
import bpy, sys, os, json, math, time
from mathutils import Matrix, Vector
HERE = os.path.dirname(os.path.abspath(__file__)); EP = os.path.normpath(os.path.join(HERE, '..'))
sys.path.append(os.path.join(EP, 'sets', 'town', 'scripts')); sys.path.append(os.path.join(EP, 'assets_prod', 'scripts'))
import town_api as TA, truck_api as T, props_api as PA
args = sys.argv[sys.argv.index('--') + 1:]; MODE = args[0]; OUT_PNG = args[1] if len(args) > 1 else os.path.join(HERE, 'prev_A.png')
D = json.load(open(os.path.join(HERE, 'dump_A.json'))); FIST = json.load(open(os.path.join(HERE, 'dump_A_fist.json')))
sc = bpy.context.scene
C4 = Matrix(((1, 0, 0, 0), (0, 0, -1, 0), (0, 1, 0, 0), (0, 0, 0, 1)))   # three.js (Y up) -> plan / Blender (Z up): (x, y, z) -> (x, -z, y)
def M3(el): return Matrix([el[0:4], el[4:8], el[8:12], el[12:16]]).transposed()   # three.js column-major
def P(v): return Vector((v[0], -v[2], v[1]))
def lin(h): return TA.lin(h)

# ---- light: the town's AM look (low cream sun from screen left, lavender sky fill), hero truck in its frame-0 state (kit EDGE(0) = -1.55)
TA.set_light(sc, 'am')
TA.set_trucks(sc, hero=dict(paint='half', edge=-1.55, masking=True, letters='under', wear=.25, ribbon=False))
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

# ---- ULTRA light pass for this framing
sun = bpy.data.objects['town_sun']; sun.data.energy = 3.4; sun.data.angle = math.radians(1.2)
# key angle chosen for THIS framing: low morning sun from screen left and behind the lens (az 255, el 28) so it reaches the hero, the wet lemon flank
# and the yard over the truck, throwing the long diagonal figure shadows back toward the frozen firemen (the town's az 205 put him in the truck's shade)
sun.rotation_euler = TA._sun_dir(255., 28.).to_track_quat('-Z', 'Y').to_euler()
# sky: full strength for the lens, 0.55 as light (the bright horizon flattened the yard)
wn = sc.world.node_tree; lp = wn.nodes.new('ShaderNodeLightPath'); mth = wn.nodes.new('ShaderNodeMath'); mth.operation = 'MULTIPLY_ADD'
mth.inputs[1].default_value = .45; mth.inputs[2].default_value = .55; wn.links.new(lp.outputs['Is Camera Ray'], mth.inputs[0]); wn.links.new(mth.outputs[0], wn.nodes['town_bg'].inputs[1])
bpy.context.view_layer.update()
# ---- SHADOW PASS (rule 6b): a hidden copy of each card turned about the vertical axis at its feet to FACE THE SUN casts the full-figure shadow;
# the lens-facing card itself casts none (its edge-on shadow would be a sliver)
sdir = bpy.data.objects['town_sun'].matrix_world.to_quaternion() @ Vector((0, 0, -1)); sh = Vector((-sdir.x, -sdir.y, 0)).normalized()
for o in CARD_OBJS:
    me = o.data; v = [x.co.copy() for x in me.vertices]; n = (v[1] - v[0]).cross(v[2] - v[0]); n.z = 0; n.normalize()
    ang = math.atan2(sh.y, sh.x) - math.atan2(n.y, n.x); feet = P(D['cards'][o.name[5:]]['pos']); R = Matrix.Rotation(ang, 4, 'Z')
    cp = o.copy(); cp.data = me.copy(); cp.name = 'SHADOWCARD_' + o.name[5:]; sc.collection.objects.link(cp)
    for x in cp.data.vertices: x.co = feet + R @ (x.co - feet)
    cp.visible_camera = False; cp.visible_glossy = False; cp.visible_diffuse = False; cp.visible_transmission = False; cp.visible_volume_scatter = False; cp.visible_shadow = True
    o.visible_shadow = False

hero_pos = P(D['cards']['hero']['pos'])
def area(name, loc, target, energy, col, size):
    ld = bpy.data.lights.new(name, 'AREA'); ld.energy = energy; ld.color = lin(col)[:3]; ld.size = size
    o = bpy.data.objects.new(name, ld); sc.collection.objects.link(o); o.location = loc
    o.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler(); return o
# rim / back light from behind-left over the bay: cream edge on the gun, the fist, the truck's lemon flank and chrome (the hero card's rim is drawn in prep_cards)
area('cine_rim', hero_pos + Vector((-1.2, 4.2, 3.0)), hero_pos + Vector((0, 0, 1.1)), 450., '#ffd096', 1.5)
# the film's signature: the lemon truck's own bounce, a soft yellow-green spill on the concrete and the compressor near it
area('cine_lemon_bounce', Vector((-2.75, 16.6, .9)), Vector((-1.4, 15.6, 0.0)), 30., '#e3ea22', 1.2)
# lifted lavender fill from the lens side (the armor recipe #a2a8e6), soft and large, so the shade side of the truck never goes black
area('cine_fill', co.location + Vector((1.5, -1.0, 1.5)), hero_pos + Vector((-1.0, 1.5, 1.0)), 110., '#a2a8e6', 5.0)

# ---- render settings + passes
r = sc.render; r.engine = 'CYCLES'; r.image_settings.file_format = 'PNG'; r.image_settings.color_mode = 'RGB'; r.image_settings.color_depth = '16'
sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'None'; sc.view_settings.exposure = 0; sc.view_settings.gamma = 1
sc.cycles.use_denoising = True; sc.cycles.denoiser = 'OPENIMAGEDENOISE'; sc.cycles.use_adaptive_sampling = True
sc.cycles.max_bounces = 6; sc.cycles.transparent_max_bounces = 16; sc.cycles.volume_bounces = 1; sc.cycles.caustics_reflective = False; sc.cycles.caustics_refractive = False
sc.cycles.blur_glossy = .5; r.film_transparent = False; r.use_motion_blur = False
vl = sc.view_layers[0]; vl.use_pass_z = True; vl.use_pass_object_index = True
tree = bpy.data.node_groups.new('cine_comp', 'CompositorNodeTree'); sc.compositing_node_group = tree; N, L = tree.nodes, tree.links
rl = N.new('CompositorNodeRLayers'); fo = N.new('CompositorNodeOutputFile'); fo.file_name = 'pass_'
fo.format.media_type = 'IMAGE'; fo.format.file_format = 'PNG'; fo.format.color_depth = '16'; fo.format.color_mode = 'BW'; fo.save_as_render = False
fo.file_output_items.new('FLOAT', 'depth'); fo.file_output_items.new('FLOAT', 'mask')
mr = N.new('ShaderNodeMapRange'); L.new(rl.outputs['Depth'], mr.inputs[0]); mr.inputs[1].default_value = 0.; mr.inputs[2].default_value = 200.; mr.inputs[3].default_value = 0.; mr.inputs[4].default_value = 1.
L.new(mr.outputs[0], fo.inputs['depth'])
idm = N.new('CompositorNodeIDMask'); idm.inputs['Index'].default_value = 1; idm.inputs['Anti-Alias'].default_value = True
L.new(rl.outputs['Object Index'], idm.inputs[0]); L.new(idm.outputs[0], fo.inputs['mask'])
go = N.new('NodeGroupOutput'); tree.interface.new_socket('Image', in_out='OUTPUT', socket_type='NodeSocketColor'); L.new(rl.outputs['Image'], go.inputs[0])

if MODE == 'info':
    print('SUNDIR', [round(x, 3) for x in sdir], 'energy', bpy.data.objects['town_sun'].data.energy, 'hide', bpy.data.objects['town_sun'].hide_render)
    dg = bpy.context.evaluated_depsgraph_get(); ft = P(D['cards']['hero']['pos'])
    for L_ in (.5, 1., 2., 3., 4.):
        g = ft + Vector((-sdir.x, -sdir.y, 0)).normalized() * -L_ + Vector((0, 0, .03)) * 0; g.z = .15
        ok, loc, n, i, ob, mm = sc.ray_cast(dg, g, -sdir, distance=200); print('SHRAY', L_, [round(x, 2) for x in g], ob.name if ok else '-')
    for o in sc.objects:
        if o.name.startswith(('SHADOWCARD', 'CARD_')): bb = [o.matrix_world @ v.co for v in o.data.vertices]; print('OBJ', o.name, [[round(c, 2) for c in b] for b in bb], o.visible_shadow, o.visible_camera)
elif MODE == 'preview':
    r.resolution_x, r.resolution_y, r.resolution_percentage = 540, 960, int(os.environ.get('PCT', '100')); sc.cycles.device = 'CPU'; sc.cycles.samples = int(os.environ.get('SPP', '16'))
    od = os.path.dirname(os.path.abspath(OUT_PNG)); fo.directory = od + '/prev_'
    r.filepath = OUT_PNG; t0 = time.time(); bpy.ops.render.render(write_still=True); print('RENDER_SECONDS %.1f' % (time.time() - t0)); print('PREVIEW_DONE', OUT_PNG)
else:
    r.resolution_x, r.resolution_y, r.resolution_percentage = 1080, 1920, 100; sc.cycles.samples = 512; sc.cycles.adaptive_threshold = .01
    sc.cycles.device = 'GPU'
    prefs = bpy.context.preferences.addons['cycles'].preferences
    try: prefs.compute_device_type = 'OPTIX'
    except Exception as e: print('OPTIX not set here (set at render time by render.sh):', e)
    fo.directory = '//out/'; r.filepath = '//out/A_raw_'
    pk = os.path.join(HERE, 'runpod', 'A'); os.makedirs(os.path.join(pk, 'out'), exist_ok=True)
    for im in bpy.data.images:
        if im.source == 'FILE' and not im.packed_file:
            try: im.pack()
            except Exception as e: print('PACK_FAIL', im.name, im.filepath, e)
    bpy.ops.file.pack_all()
    for lib in bpy.data.libraries: print('LIBRARY (must be none)', lib.filepath)
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(pk, 'scene.blend'), compress=True, relative_remap=True)
    print('PACKAGE_SAVED', os.path.join(pk, 'scene.blend'))
