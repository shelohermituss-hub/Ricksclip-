"""Proof sheet for rick_tree + rick_grass: 3 tree shapes near (one panel each) + a road panel with the same shapes at
mid and far LOD, on the flat lawn with tufts, Rick day light (templates/blender_look/rick_light.json), Cycles 16 spp.
Run: library/trees/tree_sheet.sh   (blender -b -P this file -- <outdir>; then the sheet is put together with PIL)."""
import json
import math
import os
import sys
import time

import bpy
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(ROOT, "library", "grass"))
import rick_grass as G  # noqa: E402
import rick_tree as T  # noqa: E402

OUT = sys.argv[sys.argv.index("--") + 1] if "--" in sys.argv else os.path.join(HERE, "out")
os.makedirs(OUT, exist_ok=True)
LT = json.load(open(os.path.join(ROOT, "templates", "blender_look", "rick_light.json")))["day"]
lin = T.lin

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene

# ---------------------------------------------------------------- light (same recipe as our car_science set)
w = bpy.data.worlds.new("sky")
sc.world = w
w.use_nodes = True
N, L = w.node_tree.nodes, w.node_tree.links
bg_lit = N["Background"]
bg_cam = N.new("ShaderNodeBackground")
lp = N.new("ShaderNodeLightPath")
mix = N.new("ShaderNodeMixShader")
tc = N.new("ShaderNodeTexCoord")
sep = N.new("ShaderNodeSeparateXYZ")
L.new(tc.outputs["Generated"], sep.inputs[0])
mr = N.new("ShaderNodeMapRange")
mr.inputs["From Max"].default_value = .35
L.new(sep.outputs["Z"], mr.inputs["Value"])
ramp = N.new("ShaderNodeValToRGB")
ramp.color_ramp.elements[0].color = lin(LT["sky_low"])
ramp.color_ramp.elements[1].color = lin(LT["sky_top"])
L.new(mr.outputs[0], ramp.inputs[0])
L.new(ramp.outputs[0], bg_cam.inputs["Color"])
bg_lit.inputs["Color"].default_value = lin(LT["fill_col"])
bg_lit.inputs["Strength"].default_value = LT["fill"]
L.new(lp.outputs["Is Camera Ray"], mix.inputs[0])
L.new(bg_lit.outputs[0], mix.inputs[1])
L.new(bg_cam.outputs[0], mix.inputs[2])
L.new(mix.outputs[0], N["World Output"].inputs[0])
sd = bpy.data.lights.new("sun", "SUN")
sd.energy = LT["sun"]
sd.angle = math.radians(LT["sun_angle_deg"])
sd.color = lin(LT["sun_col"])[:3]
sun = bpy.data.objects.new("sun", sd)
sc.collection.objects.link(sun)
el, az = math.radians(LT["sun_el"]), math.radians(LT.get("sun_az", 215))
d = Vector((math.sin(az) * math.cos(el), -math.cos(az) * math.cos(el), math.sin(el)))
sun.rotation_euler = d.to_track_quat("Z", "Y").to_euler()

# ---------------------------------------------------------------- set
G.flat_lawn(size=(520, 420), location=(110, 150, 0))
road_m = bpy.data.materials.new("road")
road_m.use_nodes = True
rb = road_m.node_tree.nodes["Principled BSDF"]
rb.inputs["Base Color"].default_value = lin("#55585c")
rb.inputs["Roughness"].default_value = .8
me = bpy.data.meshes.new("road")
me.from_pydata([(196.5, -20, .01), (203.5, -20, .01), (203.5, 360, .01), (196.5, 360, .01)], [], [(0, 1, 2, 3)])
me.materials.append(road_m)
sc.collection.objects.link(bpy.data.objects.new("road", me))

SHAPES = {  # name: (height, crown_width, n_clumps, seed, crown_height ratio)
    "spread": (8.0, 7.8, 28, 3, .64),
    "round": (7.0, 6.2, 18, 11, .72),
    "tall": (10.0, 7.4, 22, 21, .74),
}
stats = {}


def tree(shape, lod, x, y, rot=0.0):
    h, wd, n, seed, chr_ = SHAPES[shape]
    t0 = time.time()
    r = T.make_tree("%s_%s_%d" % (shape, lod, int(y)), height=h, crown_width=wd, n_clumps=n, seed=seed, lod=lod, crown_height=h * chr_)
    r.location = (x, y, 0)
    r.rotation_euler.z = rot
    stats.setdefault("%s_%s" % (shape, lod), dict(tris=r["tris"], build_s=round(time.time() - t0, 2)))
    return r


near = {}
for i, s in enumerate(SHAPES):
    near[s] = tree(s, "near", i * 40.0, 0.0)
    bpy.context.view_layer.update()
    G.tufts_around(near[s], r_in=.05, r_out=1.6, density=10, seed=i + 1)
# road panel: one near tree, then mid, then far
tree("round", "near", 193.0, 14.0)
for k, (s, x, y) in enumerate([("spread", 191.0, 42.0), ("tall", 210.0, 55.0), ("round", 213.5, 34.0)]):
    tree(s, "mid", x, y, k)
for k, (s, x, y) in enumerate([("round", 189.0, 110.0), ("tall", 212.0, 135.0), ("spread", 188.0, 170.0), ("round", 214.0, 210.0), ("spread", 184.0, 240.0)]):
    tree(s, "far", x, y, k)
bpy.context.view_layer.update()
tn = 0
for side in (-1, 1):
    x = 200 + side * 4.3
    o = G.tufts_along([(x, -4), (x, 30)], width=1.1, density=9, seed=10 + side, name="edge_near_%d" % side)
    tn += len(o.data.polygons)
    G.tufts_along([(x, 30), (x, 80)], width=1.1, density=6, lod="mid", seed=20 + side, name="edge_mid_%d" % side)


# ---------------------------------------------------------------- cameras and render
def cam(name, loc, look, lens=22):
    cd = bpy.data.cameras.new(name)
    cd.lens = lens
    cd.sensor_width = 36
    cd.clip_end = 800
    o = bpy.data.objects.new(name, cd)
    sc.collection.objects.link(o)
    o.location = loc
    o.rotation_euler = (Vector(look) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
    return o


shots = [
    ("A_spread_near", cam("camA", (-2.5, -10.5, 0.8), (0.5, 0, 4.6)), True),
    ("B_round_near", cam("camB", (41.5, -8.5, 1.4), (40, 0, 3.9)), False),
    ("C_tall_near", cam("camC", (79, -11, 1.4), (80, 0, 6.0)), False),
    ("D_road_mid_far", cam("camD", (198.2, -6, 1.7), (200.5, 60, 3.2), 24), False),
]
for nm, c, band in shots:
    if band:
        G.tufts_lens_band(c, d0=.4, d1=3.0, density=12, height=.55, name="lens_" + nm)

sc.render.engine = "CYCLES"
sc.cycles.device = "CPU"
sc.cycles.samples = 16
sc.cycles.use_denoising = True
sc.cycles.max_bounces = 4
sc.render.resolution_x, sc.render.resolution_y = 540, 960
sc.render.resolution_percentage = 100
sc.view_settings.view_transform = "Standard"
sc.view_settings.look = "None"
sc.view_settings.exposure = LT["exposure"]
sc.render.image_settings.file_format = "PNG"
times = {}
for nm, c, band in shots:
    sc.camera = c
    sc.render.filepath = os.path.join(OUT, nm + ".png")
    t0 = time.time()
    bpy.ops.render.render(write_still=True)
    times[nm] = round(time.time() - t0, 1)
scene_tris = 0
for o in sc.objects:
    if o.type == "MESH":
        o.data.calc_loop_triangles()
        scene_tris += len(o.data.loop_triangles)
json.dump(dict(trees=stats, render_s=times, scene_tris=scene_tris, samples=16, res="540x960"), open(os.path.join(OUT, "stats.json"), "w"), indent=1)
if "--save" in sys.argv:
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, "tree_sheet.blend"))
print("STATS", json.dumps(dict(trees=stats, render_s=times, scene_tris=scene_tris)))
