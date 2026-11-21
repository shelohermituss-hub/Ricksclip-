# Proof sheet for the props: blender -b props/props.blend --python props/render_sheet.py
# 12 tiles (Cycles 16 spp, 400x400, plain ground, LAYOUT sun + flat blue sky) -> props/PROPS_SHEET.jpg (1600x1200).
# Nothing is saved back into props.blend.
import bpy, math, os, json, sys
from mathutils import Vector, Matrix
HERE = os.path.dirname(bpy.data.filepath); EP = os.path.dirname(HERE)
LAY = json.load(open(os.path.join(EP, "LAYOUT.json")))
OUT = os.path.join(HERE, "_sheet_tiles"); os.makedirs(OUT, exist_ok=True)
sc = bpy.context.scene
sc.render.engine = 'CYCLES'; sc.cycles.samples = 16; sc.cycles.use_denoising = True; sc.cycles.device = 'CPU'
sc.render.resolution_x = sc.render.resolution_y = 400; sc.render.resolution_percentage = 100
sc.view_settings.view_transform = 'Standard'
sc.cycles.max_bounces = 6; sc.cycles.transmission_bounces = 6
# ground + sky + sun
bpy.ops.mesh.primitive_plane_add(size=80, location=(0, 8, 0)); g = bpy.context.active_object
gm = bpy.data.materials.new("sheet_ground"); gm.use_nodes = True
gm.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = (0.32, 0.33, 0.35, 1)
gm.node_tree.nodes["Principled BSDF"].inputs["Roughness"].default_value = 0.8
g.data.materials.append(gm)
w = bpy.data.worlds.new("sheet_sky"); sc.world = w; w.use_nodes = True
bg = w.node_tree.nodes["Background"]; bg.inputs[0].default_value = (0.006, 0.19, 0.8, 1); bg.inputs[1].default_value = 1.3
s = LAY["sun"]; el = math.radians(s["elevation_deg"]); tx, ty = s["to_sun_xy"]; n = math.hypot(tx, ty)
to_sun = Vector((tx / n * math.cos(el), ty / n * math.cos(el), math.sin(el)))
sd = bpy.data.lights.new("sun", 'SUN'); sd.energy = s["strength"]; sd.angle = math.radians(s["angle_deg"])
hexc = s["colour"].lstrip("#"); sd.color = tuple(int(hexc[i:i + 2], 16) / 255 for i in (0, 2, 4))
so = bpy.data.objects.new("sun", sd); sc.collection.objects.link(so)
so.rotation_euler = to_sun.to_track_quat('Z', 'Y').to_euler()
cd = bpy.data.cameras.new("cam"); cam = bpy.data.objects.new("cam", cd); sc.collection.objects.link(cam); sc.camera = cam
def R(key): return bpy.data.objects[key]
def world(key, local): return R(key).matrix_world @ Vector(local)
def shoot(name, eye, target, lens=35, ortho=None):
    cam.location = eye; cam.rotation_euler = (Vector(target) - Vector(eye)).to_track_quat('-Z', 'Y').to_euler()
    cd.type = 'ORTHO' if ortho else 'PERSP'; cd.lens = lens
    if ortho: cd.ortho_scale = ortho
    cd.sensor_fit = 'AUTO'; cd.sensor_width = 36; cd.clip_end = 200
    sc.render.filepath = os.path.join(OUT, name + ".png"); bpy.ops.render.render(write_still=True); print("TILE", name)
hose = R("hose").children[0] if False else [o for o in bpy.data.collections["hose"].objects if o.type == 'CURVE'][0]
last = hose.matrix_world @ hose.data.splines[0].bezier_points[-1].co
kink = hose.matrix_world @ hose.data.splines[0].bezier_points[4].co
c = LAY["camera"]; hd = math.radians(c["look_dir_deg"]["heading_from_+Y"]); pu = math.radians(c["look_dir_deg"]["pitch_up"])
ce = Vector(c["loc"]); look = ce + Vector((math.sin(hd), math.cos(hd), math.tan(pu))) * 10
tiles = [
    ("01_layout_camera", ce, look, 14),
    ("02_car_front34", world("car", (-3.6, -5.4, 1.5)), world("car", (0, -0.6, 0.7)), 40),
    ("03_car_hood_foam", world("car", (-1.1, -3.3, 1.75)), world("car", (0, -1.7, 0.9)), 45),
    ("04_car_rear34", world("car", (3.8, 5.2, 1.6)), world("car", (0, 0.4, 0.7)), 40),
    ("05_bucket_chamois", world("bucket", (-0.35, -0.95, 0.75)), world("bucket", (0, 0, 0.22)), 40),
    ("06_sponge", world("sponge", (-0.18, -0.4, 0.3)), world("sponge", (0, 0, 0.05)), 50),
    ("07_reel_kink", world("hose_reel", (-0.6, -1.9, 1.0)), world("hose_reel", (-0.05, -0.4, 0.25)), 35),
    ("08_nozzle", last + Vector((0.12, -0.45, 0.12)), last + Vector((0.08, 0, -0.03)), 50),
    ("09_mailbox", world("mailbox", (1.4, -1.6, 1.2)), world("mailbox", (0, 0, 0.75)), 35),
    ("10_bike", world("bike", (0.9, -1.4, 1.4)), world("bike", (0, 0, 0.2)), 35),
    ("11_water", Vector((-0.5, 2.0, 1.6)), Vector((-1.0, 8.6, 1.4)), 30),
    ("12_top_view", Vector((0.0, 7.5, 30)), Vector((0.0, 7.5, 0)), 35, 13.0),
]
only = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
for t in tiles:
    if only and t[0] not in only: continue
    shoot(*t)
