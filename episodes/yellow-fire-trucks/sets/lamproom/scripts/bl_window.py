# bl_window.py: the PUPIL WINDOW pictures of the lamp room (set-builder 2026-11-21). Renders the REAL dusk crossing of town.blend (not a painting) from
# "your eye" standing at the kerb: the red pumper coming down the street, beacon on, the hero card small at the kerb. Two states: red (drain .3) and grey (drain 1).
# blender -b sets/town/out/town.blend --python bl_window.py -- <outdir> <size> [samples]   -> window_red.png, window_grey.png, window_meta.json (+ HEADLAMP line)
import bpy, sys, os, json, math, time
from mathutils import Vector
HERE = os.path.dirname(os.path.abspath(__file__)); EP = os.path.normpath(os.path.join(HERE, '..', '..', '..'))
sys.path.append(os.path.join(EP, 'sets', 'town', 'scripts')); sys.path.append(os.path.join(EP, 'assets_prod', 'scripts'))
import town_api as TA, truck_api as T
a = sys.argv[sys.argv.index('--') + 1:]; OUT = a[0]; S = int(a[1]); SPP = int(a[2]) if len(a) > 2 else 16
os.makedirs(OUT, exist_ok=True); sc = bpy.context.scene
TA.set_light(sc, 'du')
# FIX 2: lens 28 -> 16.8 (= 28 x 9 / 15): the same view in the middle 9 m of the now 15 m window plane, more town round it (size 640 -> 1068)
CAM = dict(pos=[29.3, -13.5, 1.75], aim=[23.6, -5.6, 1.45], lens=16.8)     # the viewer's eye at the park kerb, looking up the street (crossing cam, a little lower)
TRUCK_AT = [24.6, -6.2]                                                 # the pumper on the crossing, nose to the viewer
chief = TA.chief_root(); hero = TA.hero_root()
# headlamp circle of the pumper (for the pupil match): bbox of the headlight_glass parts, truck frame
hl = []
for o in chief.children_recursive:
    if o.type == 'MESH' and any(s.material and s.material.name.startswith('headlight_glass') for s in o.material_slots):
        bb = [o.matrix_world @ Vector(c) for c in o.bound_box]; hl.append(bb)
mw = chief.matrix_world.inverted()
for bb in hl:
    loc = [mw @ v for v in bb]; mn = [min(v[i] for v in loc) for i in range(3)]; mx = [max(v[i] for v in loc) for i in range(3)]
    print('HEADLAMP truck-frame min', [round(x, 3) for x in mn], 'max', [round(x, 3) for x in mx], flush=True)
d = Vector(CAM['pos'][:2]) - Vector(TRUCK_AT); th = math.atan2(-d.y, -d.x)    # truck front is local -X
chief.location = (TRUCK_AT[0], TRUCK_AT[1], 0.0); chief.rotation_euler = (0, 0, th)
if hero: hero.hide_render = True
for o in (hero.children_recursive if hero else []): o.hide_render = True
try: T.set_beacon(chief, True, 35.0)
except Exception as e: print('beacon', e)
# hero card small at the kerb, holding his toy (cast view, the same card method as bl_town_proof)
png = os.path.join(EP, 'cast', 'views', 'hero_front_aim.png')
im = bpy.data.images.load(png); w, h = im.size; s = 1.78 / (h * .723)
m = bpy.data.materials.new('card'); m.use_nodes = True; N = m.node_tree.nodes; b = N['Principled BSDF']; t = N.new('ShaderNodeTexImage'); t.image = im
m.node_tree.links.new(t.outputs[0], b.inputs['Base Color']); m.node_tree.links.new(t.outputs[1], b.inputs['Alpha']); b.inputs['Roughness'].default_value = 1.
m.node_tree.links.new(t.outputs[0], b.inputs['Emission Color']); b.inputs['Emission Strength'].default_value = .35
bpy.ops.mesh.primitive_plane_add(size=1); c = bpy.context.object; c.name = 'CAST_CARD'; c.data.materials.append(m)
pos = [27.9, -8.6, 0.14]; c.scale = (w * s, h * s, 1); c.rotation_euler = (math.radians(90), 0, 0)
dd = Vector(CAM['pos']) - Vector(pos); c.rotation_euler.z = math.atan2(dd.y, dd.x) - math.pi / 2
c.location = (pos[0], pos[1], pos[2] + h * s / 2 - (h - 1082) * s)
co = bpy.data.objects.new('wcam', bpy.data.cameras.new('wcam')); sc.collection.objects.link(co)
co.data.sensor_fit = 'VERTICAL'; co.data.sensor_height = 36; co.data.lens = CAM['lens']; co.data.clip_start = .05; co.data.clip_end = 2000
co.location = CAM['pos']; co.rotation_euler = (Vector(CAM['aim']) - Vector(CAM['pos'])).to_track_quat('-Z', 'Y').to_euler(); sc.camera = co
r = sc.render; r.resolution_x = r.resolution_y = S; r.resolution_percentage = 100; r.image_settings.file_format = 'PNG'
sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'None'; r.engine = 'CYCLES'; sc.cycles.device = 'CPU'
sc.cycles.samples = SPP
sc.cycles.use_denoising = True
sc.cycles.denoiser = 'OPENIMAGEDENOISE'
sc.cycles.max_bounces = 5
times = {}
for name, drain in (('red', .3), ('grey', 1.0)):
    TA.set_trucks(sc, chief=dict(drain=drain))
    r.filepath = os.path.join(OUT, 'window_%s.png' % name); t0 = time.time(); bpy.ops.render.render(write_still=True)
    times[name] = round(time.time() - t0, 1); print('WINDOW', name, 'RENDER_SECONDS', times[name], flush=True)
json.dump(dict(cam=CAM, truck_at=TRUCK_AT, truck_yaw_deg=round(math.degrees(th), 2), size=S, spp=SPP, seconds=times, fov_deg=round(2 * math.degrees(math.atan(18 / CAM['lens'])), 2)), open(os.path.join(OUT, 'window_meta.json'), 'w'), indent=1)
print('WINDOW_END')
