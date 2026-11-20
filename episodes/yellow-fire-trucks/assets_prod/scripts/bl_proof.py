# bl_proof.py: ONE still per tile of the production assets in Blender Cycles (CPU: 32 samples + OIDN, Standard view, Poly Haven HDRI + a sun lamp
# for hard shadows, the Poly Haven concrete yard). Single frames only (CB 2026-11-20: key frames, never a clip, in the cloud).
# blender -b --factory-startup --python bl_proof.py -- <mode truck|props> <assets_prod dir> <out png dir> [w h]
# Prints one line per tile: PROOF <name> RENDER_SECONDS <s>. No date or time is written into any image (REGLES 4).
import bpy, sys, os, math, time, json
from mathutils import Vector
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.append(HERE)
import truck_api as T, props_api as PA

mode, AP, OUTD = sys.argv[sys.argv.index('--') + 1:][:3]
rest = sys.argv[sys.argv.index('--') + 4:]; W, H = (int(rest[0]), int(rest[1])) if len(rest) >= 2 else (800, 600)
PH = os.path.join(AP, '..', 'assets', 'polyhaven') + '/'
os.makedirs(OUTD, exist_ok=True)


def yard(size, tile):
    gm = bpy.data.materials.new('concrete_yard'); gm.use_nodes = True; nt = gm.node_tree; N = nt.nodes; L = nt.links; b = N['Principled BSDF']
    tc = N.new('ShaderNodeTexCoord'); mp = N.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value = (size / tile, size / tile, 1); L.new(tc.outputs['UV'], mp.inputs[0])
    def tex(f, cs):
        t = N.new('ShaderNodeTexImage'); t.image = bpy.data.images.load(PH + 'concrete_floor_worn_001_' + f); t.image.colorspace_settings.name = cs; L.new(mp.outputs[0], t.inputs[0]); return t
    L.new(tex('diff_2k.jpg', 'sRGB').outputs[0], b.inputs['Base Color']); L.new(tex('rough_2k.jpg', 'Non-Color').outputs[0], b.inputs['Roughness'])
    nm = N.new('ShaderNodeNormalMap'); L.new(tex('nor_gl_2k.jpg', 'Non-Color').outputs[0], nm.inputs['Color']); L.new(nm.outputs[0], b.inputs['Normal'])
    bpy.ops.mesh.primitive_plane_add(size=size); g = bpy.context.object; g.name = 'yard'; g.data.materials.append(gm); return g


def light(kind):
    sc = bpy.context.scene; wd = sc.world or bpy.data.worlds.new('W'); sc.world = wd; wd.use_nodes = True; wn = wd.node_tree
    env = wn.nodes.get('env') or wn.nodes.new('ShaderNodeTexEnvironment'); env.name = 'env'; bg = wn.nodes['Background']
    env.image = bpy.data.images.load(PH + ('kloofendal_43d_clear_puresky.hdr' if kind == 'am' else 'industrial_sunset_02.hdr'), check_existing=True)
    wn.links.new(env.outputs[0], bg.inputs[0]); bg.inputs[1].default_value = 0.75 if kind == 'am' else 0.9
    so = bpy.data.objects.get('sun')
    if not so:
        so = bpy.data.objects.new('sun', bpy.data.lights.new('sun', 'SUN')); sc.collection.objects.link(so)
    sun = so.data; sun.angle = math.radians(0.8)
    if kind == 'am':   # LOOK_BIBLE AM: low sun from screen left, cream #ffd896, hard long shadows
        sun.energy = 4.2; sun.color = PA.lin('#ffd896')[:3]; d = Vector((0.55, 0.75, -0.42))
    else:              # dusk: apricot sun almost on the horizon behind the houses
        sun.energy = 1.6; sun.color = PA.lin('#f3a86a')[:3]; d = Vector((0.85, 0.3, -0.12))
    so.rotation_euler = d.normalized().to_track_quat('-Z', 'Y').to_euler()


def camera(pos, tgt, lens):
    sc = bpy.context.scene; co = bpy.data.objects.get('cam')
    if not co:
        co = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); sc.collection.objects.link(co)
    co.data.sensor_fit = 'HORIZONTAL'; co.data.sensor_width = 36; co.data.lens = lens; co.data.clip_start = 0.01
    co.location = pos; co.rotation_euler = (Vector(tgt) - Vector(pos)).to_track_quat('-Z', 'Y').to_euler(); sc.camera = co


def setup_render():
    sc = bpy.context.scene; r = sc.render; r.resolution_x, r.resolution_y, r.resolution_percentage = W, H, 100
    r.image_settings.file_format = 'PNG'; sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'None'
    r.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = 32; sc.cycles.use_denoising = True; sc.cycles.denoiser = 'OPENIMAGEDENOISE'
    sc.cycles.use_adaptive_sampling = True; sc.cycles.max_bounces = 6; sc.cycles.transparent_max_bounces = 8; r.film_transparent = False


def shot(name):
    sc = bpy.context.scene; sc.render.filepath = os.path.join(OUTD, name + '.png'); t0 = time.time()
    bpy.ops.render.render(write_still=True); s = time.time() - t0
    print('PROOF %s RENDER_SECONDS %.1f SIZE %dx%d' % (name, s, W, H)); return s


times = {}
if mode == 'truck':
    bpy.ops.wm.open_mainfile(filepath=os.path.join(AP, 'out', 'truck.blend'))
    setup_render(); yard(80, 4.0)
    root = bpy.data.objects['TRUCK']; meta = json.load(open(os.path.join(AP, 'out', 'truck_meta.json')))
    CAM = {'f34': ((-9.0, -7.6, 2.6), (-0.5, 0, 1.15), 35), 'side': ((0.2, -12.0, 1.9), (0.2, 0, 1.2), 35)}
    STATES = [('red', dict(paint='red', masking=False, letters='over', ribbon=False), 'am'),
              ('half', dict(paint='half', edge=0.3, masking=True, letters='under', ribbon=True), 'am'),
              ('lemon', dict(paint='lemon', masking=False, letters='over', ribbon=False), 'am'),
              ('dusk', dict(paint='half', edge=0.3, drain=1.0, masking=False, letters='under', ribbon=False), 'dusk')]
    only = os.environ.get('ONLY', '')
    for st, kw, lk in STATES:
        T.set_paint(root, **kw); T.set_beacon(root, on=(lk == 'dusk'), angle_deg=30); light(lk)
        for cn, (p, t, l) in CAM.items():
            nm = 'bl_truck_%s_%s' % (st, cn)
            if only and only not in nm: continue
            camera(p, t, l); times[nm] = shot(nm)
    # the door lettering close-up (red, AM)
    if not only or 'letters' in only:
        T.set_paint(root, paint='red', masking=False, letters='over', ribbon=False); T.set_beacon(root, on=False); light('am')
        a = Vector(meta['anchors']['anchor_cab_door']); camera(a + Vector((0.35, -1.75, 0.12)), a + Vector((0.05, 0, 0.02)), 50); times['bl_letters'] = shot('bl_letters')
else:
    bpy.ops.wm.open_mainfile(filepath=os.path.join(AP, 'out', 'gun.blend'))
    setup_render(); yard(12, 2.0); light('am')
    gun = bpy.data.objects['SPRAY_GUN']; gun.location = (0, 0, 0.16); gun.rotation_euler = (0, 0, math.radians(-25))
    camera((0.32, -0.42, 0.25), (0.03, 0, 0.165), 50); times['bl_gun'] = shot('bl_gun')
    comp = PA.append(os.path.join(AP, 'out', 'compressor.blend'), 'COMPRESSOR'); comp.location = (0, 0, 0)
    gun.location = (1.15, -0.55, 0.035); gun.rotation_euler = (math.radians(90), 0, math.radians(150))   # lying on its side on the concrete
    bpy.context.view_layer.update()
    A = bpy.data.objects['anchor_outlet'].matrix_world.translation.copy(); B = bpy.data.objects['anchor_air_inlet'].matrix_world.translation.copy()
    PA.air_hose(A, B)
    camera((1.2, -2.3, 1.05), (0.45, -0.2, 0.25), 32); times['bl_comp_hose'] = shot('bl_comp_hose')
json.dump(times, open(os.path.join(OUTD, 'times_%s.json' % mode), 'w'), indent=1)
print('PROOF_END', mode)
