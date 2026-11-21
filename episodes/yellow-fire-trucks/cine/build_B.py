# build_B.py: KEY FRAME B (S6 frame 1293, "red FIRST.") rebuilt in Blender from THE LAMP ROOM set, from the kit's own frame-1293 state.
#   cd ../sets/lamproom && blender -b out/lamproom.blend --python ../../cine/build_B.py -- <preview|package> [out_png]
#   (run from sets/lamproom: the window pictures are stored 'out/window_*.png' relative to the working folder; this script makes them absolute and packs them)
# Inputs (cine/): dump_B.json (kit camera at f1293; no cast card in the room: the hero is inside the grey window picture).
# State at f1293 from kitB/film.json places.eye.lamproom keys: wave 4 (all red groups off, red levers down), iris .62 (f1289) -> 1.0 (f1300) = .758, dim .6, grey 1.
# preview: 540x960, Cycles CPU 16 spp + OIDN. package: 1080x1920, GPU (render.sh picks OptiX > CUDA > CPU) 512 spp adaptive + OIDN, all packed -> runpod/B/scene.blend.
# Passes for the grade (grade_key.py --preset B): //out/pass_depth (16-bit, 0-200 m), //out/pass_mask (16-bit, cast = 1: empty here).
import bpy, sys, os, json, math, time
from mathutils import Matrix, Vector
HERE = os.path.dirname(os.path.abspath(__file__)); EP = os.path.normpath(os.path.join(HERE, '..')); SET = os.path.join(EP, 'sets', 'lamproom')
sys.path.append(os.path.join(SET, 'scripts'))
import lamproom_api as API
args = sys.argv[sys.argv.index('--') + 1:]; MODE = args[0]; OUT_PNG = args[1] if len(args) > 1 else os.path.join(HERE, 'prev', 'prev_B.png')
D = json.load(open(os.path.join(HERE, 'dump_B.json')))
sc = bpy.context.scene
C4 = Matrix(((1, 0, 0, 0), (0, 0, -1, 0), (0, 1, 0, 0), (0, 0, 0, 1)))   # three.js (Y up) -> Blender (Z up): (x, y, z) -> (x, -z, y)
def M3(el): return Matrix([el[0:4], el[4:8], el[8:12], el[12:16]]).transposed()
def lin(h):
    h = h.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(x / 12.92 if x <= .04045 else ((x + .055) / 1.055) ** 2.4 for x in c) + (1.0,)

# ---- window pictures: absolute path, then packed (LECON: stored relative to the working folder)
for im in bpy.data.images:
    if im.name.startswith('window_'):
        im.filepath = os.path.join(SET, 'out', im.name); im.reload(); im.pack(); print('WINDOW_PACKED', im.name, im.size[:])

# ---- state at f1293
IRIS = .62 + (1.0 - .62) * (1293 - 1289) / (1300 - 1289)
API.set_state(sc, wave=4, iris=IRIS, dim=.6, grey=1.0, flick=.5)
print('STATE', dict(sc['lamproom_state']))
# a red lamp that is OFF keeps its bright red glass in the set (only the emission goes to 0), so lit by the other lamps it still reads ON.
# Off = the set's own dead-bulb glass (colour x .18), like the kit's dark red rings. (set-builder: worth moving into lamproom_api.set_state)
for g in range(1, 5):
    for st in ('on', 'flick'):
        m = bpy.data.materials.get('bulb_red_%s_g%d' % (st, g))
        if m: b = m.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = [x * .18 for x in b.inputs['Base Color'].default_value[:3]] + [1]

# ---- camera: the exact kit matrix and vertical field of view
cd = D['cam']; co = bpy.data.objects.new('cineCam', bpy.data.cameras.new('cineCam')); sc.collection.objects.link(co)
co.matrix_world = C4 @ M3(cd['m']); co.data.sensor_fit = 'VERTICAL'; co.data.sensor_height = 36.; co.data.angle_y = math.radians(cd['fov'])
co.data.clip_start = .05; co.data.clip_end = 500; sc.camera = co
print('CAM', [round(x, 3) for x in co.location], 'lens', round(co.data.lens, 2))

# ---- ULTRA light for this framing. The lamps are the light: lemon-green and blue stay lit, red is off (set_state put the red fills to 0).
# The pupil window's dusk becomes a soft COOL source once the picture is grey (the set's window_light was warm #f0a878 for the red state).
wl = bpy.data.objects['window_light']; wl.data.color = lin('#b4b6e0')[:3]; wl.data.energy = wl.data.energy * 1.15
# a wide soft cool spill from the pupil down onto the deck and the relay box (the window is the only daylight in the room)
ld = bpy.data.lights.new('cine_window_spill', 'AREA'); ld.shape = 'DISK'; ld.size = 3.2; ld.energy = 30.; ld.color = lin('#9ea6dc')[:3]
o = bpy.data.objects.new('cine_window_spill', ld); sc.collection.objects.link(o); o.location = (0, 4.6, .4)
o.rotation_euler = (Vector((0, -1.5, -3.4)) - o.location).to_track_quat('-Z', 'Y').to_euler()
# warm lemon kicker low on the left (the lit lemon rows behind the relay box): the box lid and the levers get a warm edge
ld = bpy.data.lights.new('cine_lemon_kick', 'AREA'); ld.size = 1.2; ld.energy = 0.; ld.color = lin('#e8e070')[:3]
o = bpy.data.objects.new('cine_lemon_kick', ld); sc.collection.objects.link(o); o.location = (-2.6, .6, -1.9)
o.rotation_euler = (Vector((-.62, -.45, -2.5)) - o.location).to_track_quat('-Z', 'Y').to_euler()
# the set's coloured fills lit the dome between the lamps a flat grey-blue (kit: deep navy): halve them, so the bulbs carry the light
for o in bpy.data.objects:
    if o.type == 'LIGHT' and o.name.startswith(('fill_green', 'fill_blue', 'fill_back')): o.data.energy *= .5
# the kit's warm amber ring on the iris lip (LIGHT IS KEPT FROM THE CODE): the iris rake lights warm amber instead of blue/green
for o in bpy.data.objects:
    if o.type == 'LIGHT' and o.name.startswith('iris_rake'): o.data.color = lin('#ffa858')[:3]; o.data.energy = 30.
# rim on any cast card from the warm lamps: there is NO cast card in this frame (the hero is drawn inside the window picture), so no rim light.

# ---- render settings + passes
r = sc.render; r.engine = 'CYCLES'; r.image_settings.file_format = 'PNG'; r.image_settings.color_mode = 'RGB'; r.image_settings.color_depth = '16'
sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'None'; sc.view_settings.exposure = 0; sc.view_settings.gamma = 1
sc.cycles.use_denoising = True; sc.cycles.denoiser = 'OPENIMAGEDENOISE'; sc.cycles.use_adaptive_sampling = True
sc.cycles.max_bounces = 6; sc.cycles.transparent_max_bounces = 16; sc.cycles.volume_bounces = 1; sc.cycles.caustics_reflective = False; sc.cycles.caustics_refractive = False
sc.cycles.blur_glossy = .5; r.film_transparent = False; r.use_motion_blur = False
vl = sc.view_layers[0]; vl.use_pass_z = True; vl.use_pass_object_index = True
tree = bpy.data.node_groups.new('cine_comp_B', 'CompositorNodeTree'); sc.compositing_node_group = tree; N, L = tree.nodes, tree.links
rl = N.new('CompositorNodeRLayers'); fo = N.new('CompositorNodeOutputFile'); fo.file_name = 'pass_'
fo.format.media_type = 'IMAGE'; fo.format.file_format = 'PNG'; fo.format.color_depth = '16'; fo.format.color_mode = 'BW'; fo.save_as_render = False
fo.file_output_items.new('FLOAT', 'depth'); fo.file_output_items.new('FLOAT', 'mask')
mr = N.new('ShaderNodeMapRange'); L.new(rl.outputs['Depth'], mr.inputs[0]); mr.inputs[1].default_value = 0.; mr.inputs[2].default_value = 200.; mr.inputs[3].default_value = 0.; mr.inputs[4].default_value = 1.
L.new(mr.outputs[0], fo.inputs['depth'])
idm = N.new('CompositorNodeIDMask'); idm.inputs['Index'].default_value = 1; idm.inputs['Anti-Alias'].default_value = True
L.new(rl.outputs['Object Index'], idm.inputs[0]); L.new(idm.outputs[0], fo.inputs['mask'])
go = N.new('NodeGroupOutput'); tree.interface.new_socket('Image', in_out='OUTPUT', socket_type='NodeSocketColor'); L.new(rl.outputs['Image'], go.inputs[0])

if MODE == 'preview':
    r.resolution_x, r.resolution_y, r.resolution_percentage = 540, 960, int(os.environ.get('PCT', '100')); sc.cycles.device = 'CPU'; sc.cycles.samples = int(os.environ.get('SPP', '16'))
    od = os.path.dirname(os.path.abspath(OUT_PNG)); fo.directory = od + '/prevB_'
    r.filepath = OUT_PNG; t0 = time.time(); bpy.ops.render.render(write_still=True); print('RENDER_SECONDS %.1f' % (time.time() - t0)); print('PREVIEW_DONE', OUT_PNG)
else:
    r.resolution_x, r.resolution_y, r.resolution_percentage = 1080, 1920, 100; sc.cycles.samples = 512; sc.cycles.adaptive_threshold = .01
    sc.cycles.device = 'GPU'
    prefs = bpy.context.preferences.addons['cycles'].preferences
    try: prefs.compute_device_type = 'OPTIX'
    except Exception as e: print('OPTIX not set here (set at render time by render.sh):', e)
    fo.directory = '//out/'; r.filepath = '//out/B_raw_'
    pk = os.path.join(HERE, 'runpod', 'B'); os.makedirs(os.path.join(pk, 'out'), exist_ok=True)
    for im in bpy.data.images:
        if im.source == 'FILE' and not im.packed_file:
            try: im.pack()
            except Exception as e: print('PACK_FAIL', im.name, im.filepath, e)
    bpy.ops.file.pack_all()
    for im in bpy.data.images:
        if im.source == 'FILE' and not im.packed_file: print('NOT_PACKED', im.name, im.filepath)
    for lib in bpy.data.libraries: print('LIBRARY (must be none)', lib.filepath)
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(pk, 'scene.blend'), compress=True, relative_remap=True)
    print('PACKAGE_SAVED', os.path.join(pk, 'scene.blend'))
