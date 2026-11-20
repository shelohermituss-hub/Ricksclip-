# TEST ONLY (asset test 2026-11-20). One Blender still of a downloaded asset.
# blender -b --factory-startup --python bl_render.py -- KEY=VAL ...
#   asset=afe|alf|ward|gun   paint=orig|red|lemon|half   light=sun|dusk   engine=cycles|eevee
#   w=1080 h=1920 samples=32 cam=front34|side|rear34|gun   out=/path.png   yaw=deg (truck turn)
# Prints IMPORT_SECONDS, RENDER_SECONDS, TRIS. No date or time is written into the image (REGLES 4).
import bpy, sys, math, time, mathutils
A = dict(a.split('=', 1) for a in sys.argv[sys.argv.index('--') + 1:])
ROOT = '/home/user/Ricksclip-/episodes/yellow-fire-trucks/assets/'
ASSETS = {  # file, target length (m), yaw so the front points to +X, cab roof z / cab rear x (after fit, for the white roof)
    'afe':  dict(f='american_fire_engine/american_fire_engine.glb', L=8.2, yaw=float(A.get('yaw', 270)), roofz=float(A.get('roofz', 2.05)), cabx=float(A.get('cabx', 1.5))),
    'alf':  dict(f='alf_1940s/alf_1940s.glb', L=8.0, yaw=float(A.get('yaw', 90)), roofz=2.2, cabx=1.0),
    'ward': dict(f='ward_lafrance_m1000/ward_lafrance_m1000.glb', L=8.0, yaw=float(A.get('yaw', 0)), roofz=2.6, cabx=1.6),
    'gun':  dict(f='spray_gun/spray_gun.glb', L=0.30, yaw=float(A.get('yaw', 0)), roofz=99, cabx=99),
    'comp': dict(f='air_compressor/air_compressor.glb', L=0.75, yaw=float(A.get('yaw', 0)), roofz=99, cabx=99),
}
asset = A.get('asset', 'afe'); spec = ASSETS[asset]
paint = A.get('paint', 'orig'); light = A.get('light', 'sun'); engine = A.get('engine', 'cycles')
W, H = int(A.get('w', 540)), int(A.get('h', 960))

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
t0 = time.time()
bpy.ops.import_scene.gltf(filepath=ROOT + spec['f'])
imp_s = time.time() - t0
objs = [o for o in sc.objects]
root = bpy.data.objects.new('ASSET', None); sc.collection.objects.link(root)
for o in objs:
    if o.parent is None: o.parent = root
root.rotation_euler.z = math.radians(spec['yaw'])
bpy.context.view_layer.update()
def bbox():
    mn = mathutils.Vector((1e9,) * 3); mx = -mn
    for o in sc.objects:
        if o.type != 'MESH': continue
        for c in o.bound_box:
            w = o.matrix_world @ mathutils.Vector(c)
            mn = mathutils.Vector(map(min, mn, w)); mx = mathutils.Vector(map(max, mx, w))
    return mn, mx
mn, mx = bbox(); s = spec['L'] / max(mx.x - mn.x, mx.y - mn.y)
root.scale = (s, s, s); bpy.context.view_layer.update()
mn, mx = bbox(); c = (mn + mx) / 2
root.location -= mathutils.Vector((c.x, c.y, mn.z)); bpy.context.view_layer.update()
mn, mx = bbox()
tris = 0
for o in sc.objects:
    if o.type == 'MESH': o.data.calc_loop_triangles(); tris += len(o.data.loop_triangles)
print('FIT size', [round(v, 2) for v in (mx - mn)], 'scale', round(s, 4), 'TRIS', tris)

def srgb(h):
    h = h.lstrip('#'); v = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return [(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4) for x in v] + [1]
RED, LEMON, WHITE = srgb('#D3141C'), srgb('#E3EA22'), srgb('#F2F0EA')

def paint_nodes(mat, keep_rough=False):
    """Swap the base colour of one body material for our paint (red / lemon / half + white roof)."""
    mat.use_nodes = True; nt = mat.node_tree; N = nt.nodes; L = nt.links
    b = next(n for n in N if n.type == 'BSDF_PRINCIPLED')
    for l in list(b.inputs['Base Color'].links): L.remove(l)
    b.inputs['Metallic'].default_value = 0.0
    if not keep_rough:
        for l in list(b.inputs['Roughness'].links): L.remove(l)
        b.inputs['Roughness'].default_value = 0.32
    b.inputs['Coat Weight'].default_value = 1.0; b.inputs['Coat Roughness'].default_value = 0.06
    geo = N.new('ShaderNodeNewGeometry'); sep = N.new('ShaderNodeSeparateXYZ'); L.new(geo.outputs['Position'], sep.inputs[0])
    if paint == 'lemon':
        b.inputs['Base Color'].default_value = LEMON; return
    # front colour: red, white roof over the cab
    roof = N.new('ShaderNodeMath'); roof.operation = 'GREATER_THAN'; roof.inputs[1].default_value = spec['roofz']
    L.new(sep.outputs['Z'], roof.inputs[0])
    cab = N.new('ShaderNodeMath'); cab.operation = 'GREATER_THAN'; cab.inputs[1].default_value = spec['cabx']
    L.new(sep.outputs['X'], cab.inputs[0])
    rm = N.new('ShaderNodeMath'); rm.operation = 'MULTIPLY'; L.new(roof.outputs[0], rm.inputs[0]); L.new(cab.outputs[0], rm.inputs[1])
    front = N.new('ShaderNodeMix'); front.data_type = 'RGBA'
    front.inputs['A'].default_value = RED; front.inputs['B'].default_value = WHITE
    L.new(rm.outputs[0], front.inputs['Factor'])
    if paint == 'red':
        L.new(front.outputs['Result'], b.inputs['Base Color']); return
    # half: rear lemon, front red; soft over-sprayed edge 0.7 m wide, broken by noise
    nz = N.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 1.6; nz.inputs['Detail'].default_value = 6
    L.new(geo.outputs['Position'], nz.inputs['Vector'])
    nm = N.new('ShaderNodeMath'); nm.operation = 'MULTIPLY_ADD'; nm.inputs[1].default_value = 0.9; nm.inputs[2].default_value = -0.45
    L.new(nz.outputs['Fac'], nm.inputs[0])
    xs = N.new('ShaderNodeMath'); xs.operation = 'ADD'; L.new(sep.outputs['X'], xs.inputs[0]); L.new(nm.outputs[0], xs.inputs[1])
    mr = N.new('ShaderNodeMapRange'); mr.interpolation_type = 'SMOOTHERSTEP'
    edge = float(A.get('edge', 0.4)); mr.inputs['From Min'].default_value = edge - 0.35; mr.inputs['From Max'].default_value = edge + 0.35
    L.new(xs.outputs[0], mr.inputs['Value'])
    half = N.new('ShaderNodeMix'); half.data_type = 'RGBA'
    half.inputs['A'].default_value = LEMON; L.new(front.outputs['Result'], half.inputs['B'])
    L.new(mr.outputs['Result'], half.inputs['Factor'])
    L.new(half.outputs['Result'], b.inputs['Base Color'])

def is_red(m):
    if not m.use_nodes: return False
    b = next((n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'), None)
    if not b: return False
    r, g, bl = b.inputs['Base Color'].default_value[:3]
    return r > 0.5 and g < 0.15 and bl < 0.15
repainted = []
if paint != 'orig':
    for m in [m for m in bpy.data.materials if m.users]:
        if (asset == 'afe' and is_red(m)) or (asset == 'alf' and m.name in ('van_paint_2',)):
            paint_nodes(m, keep_rough=False); repainted.append(m.name)
print('REPAINTED', len(repainted), repainted[:12])

# ground: Poly Haven concrete, 4 m tile
gm = bpy.data.materials.new('concrete'); gm.use_nodes = True; nt = gm.node_tree; N = nt.nodes; Ln = nt.links
b = N['Principled BSDF']; tc = N.new('ShaderNodeTexCoord'); mp = N.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value = (12, 12, 1)
Ln.new(tc.outputs['UV'], mp.inputs[0]); P = ROOT + 'polyhaven/concrete_floor_worn_001_'
def tex(f, cs):
    t = N.new('ShaderNodeTexImage'); t.image = bpy.data.images.load(P + f); t.image.colorspace_settings.name = cs; Ln.new(mp.outputs[0], t.inputs[0]); return t
Ln.new(tex('diff_2k.jpg', 'sRGB').outputs[0], b.inputs['Base Color'])
Ln.new(tex('rough_2k.jpg', 'Non-Color').outputs[0], b.inputs['Roughness'])
nmap = N.new('ShaderNodeNormalMap'); Ln.new(tex('nor_gl_2k.jpg', 'Non-Color').outputs[0], nmap.inputs['Color']); Ln.new(nmap.outputs[0], b.inputs['Normal'])
bpy.ops.mesh.primitive_plane_add(size=48 if asset not in ('gun', 'comp') else 4); g = bpy.context.object; g.data.materials.append(gm)

# light
wd = bpy.data.worlds.new('W'); sc.world = wd; wd.use_nodes = True; wn = wd.node_tree
env = wn.nodes.new('ShaderNodeTexEnvironment'); bg = wn.nodes['Background']
env.image = bpy.data.images.load(ROOT + 'polyhaven/' + ('kloofendal_43d_clear_puresky.hdr' if light == 'sun' else 'industrial_sunset_02.hdr'))
wmap = wn.nodes.new('ShaderNodeMapping'); wtc = wn.nodes.new('ShaderNodeTexCoord'); wn.links.new(wtc.outputs['Generated'], wmap.inputs[0]); wn.links.new(wmap.outputs[0], env.inputs[0])
wmap.inputs['Rotation'].default_value = (0, 0, math.radians(float(A.get('hdrrot', 0))))
wn.links.new(env.outputs[0], bg.inputs[0]); bg.inputs[1].default_value = 0.8 if light == 'sun' else 1.0
sun = bpy.data.lights.new('sun', 'SUN'); so = bpy.data.objects.new('sun', sun); sc.collection.objects.link(so)
sun.angle = math.radians(0.6)
if light == 'sun':
    sun.energy = 4.5; sun.color = (1.0, 0.95, 0.86); el, az = 32, float(A.get('sunaz', 40))
else:
    sun.energy = 2.2; sun.color = (1.0, 0.55, 0.28); el, az = 6, float(A.get('sunaz', 150))
so.rotation_euler = (math.radians(90 - el), 0, math.radians(az + 90))

# camera
cd = bpy.data.cameras.new('cam'); co = bpy.data.objects.new('cam', cd); sc.collection.objects.link(co); sc.camera = co
cd.sensor_fit = 'HORIZONTAL'; cd.sensor_width = 36
cam = A.get('cam', 'front34'); size = mx - mn
if asset in ('gun', 'comp'):
    tgt = mathutils.Vector((0, 0, size.z * 0.5)); d = max(size) * 2.2; cd.lens = 70
    pos = tgt + mathutils.Vector((d * 0.75, d * 0.62, d * 0.25))
elif cam in ('hero34', 'heroside'):   # the SAME cameras as sets/_hero_test (kit plan: front -x, driver -y; here front +x, driver +y), kit lens rule: 36 mm on the vertical side
    cd.sensor_fit = 'VERTICAL'; cd.sensor_height = 36
    P, T, cd.lens = {'hero34': ((9.6, 8.4, 2.3), (0.4, 0, 1.3), 72), 'heroside': ((0, 13.5, 1.7), (0, 0, 1.4), 66)}[cam]
    pos, tgt = mathutils.Vector(P), mathutils.Vector(T)
else:
    cd.lens = float(A.get('lens', 24)); tgt = mathutils.Vector((float(A.get('tx', 0.6)), 0, 1.25))
    dirs = {'front34': (0.78, 0.62, 0.11), 'side': (0.0, 1.0, 0.1), 'rear34': (-0.75, -0.65, 0.12), 'frontr34': (0.78, -0.62, 0.11)}
    v = mathutils.Vector(dirs[cam]).normalized(); pos = tgt + v * float(A.get('dist', 13.5))
co.location = pos; co.rotation_euler = (tgt - pos).to_track_quat('-Z', 'Y').to_euler()

r = sc.render; r.resolution_x, r.resolution_y, r.resolution_percentage = W, H, 100
r.image_settings.file_format = 'PNG'; r.filepath = A['out']
sc.view_settings.view_transform = A.get('view', 'Standard')   # Standard keeps the brand hexes (AgX greyed the lemon in batch 1)
if engine == 'cycles':
    r.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = int(A.get('samples', 32))
    sc.cycles.use_denoising = True; sc.cycles.denoiser = 'OPENIMAGEDENOISE'; sc.cycles.use_adaptive_sampling = True
    sc.cycles.max_bounces = 6; r.threads_mode = 'AUTO'
else:
    for e in ('BLENDER_EEVEE', 'BLENDER_EEVEE_NEXT'):
        try: r.engine = e; break
        except TypeError: pass
    print('EEVEE engine id', r.engine)
    try: sc.eevee.taa_render_samples = int(A.get('samples', 32))
    except Exception as ex: print('eevee samples', ex)
t0 = time.time()
bpy.ops.render.render(write_still=True)
print('IMPORT_SECONDS %.1f RENDER_SECONDS %.1f ENGINE %s SIZE %dx%d TRIS %d' % (imp_s, time.time() - t0, r.engine, W, H, tris))
