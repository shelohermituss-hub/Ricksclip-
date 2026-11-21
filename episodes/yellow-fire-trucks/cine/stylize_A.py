"""Stylized test of key frame A (CB 2026-11-21: Rick's films look "realistic but rendered like a cartoon", richer colour; ours read as
dirty photo-real). Run inside Blender on cine/runpod/A/scene.blend:
  blender -b cine/runpod/A/scene.blend --python cine/stylize_A.py -- <out.png> <res_x> <res_y> <samples> [save.blend]
What it changes (nothing in the source sets or assets; this file only):
  1 paint wear 0 on every truck paint group (no soot, stains or chips);
  2 every scanned diffuse texture ("_diff" in the name: Poly Haven scans, clapboard, asphalt, floor) is smoothed (grain removed, big shapes
    kept) and pushed toward clean, saturated colour; lettering, decals, labels and cast cards are NOT touched;
  3 normal maps down to 25 % (soft plank lines, no gritty relief);
  4 light like Rick's daylight: a brighter sky that fills the shadows, a whiter sun, the lavender fill and the lemon bounce turned down,
    a lighter rim; the paint mist thinned (it read as a yellow ball).
"""
import bpy, sys, numpy as np

argv = sys.argv[sys.argv.index("--") + 1:]
OUT, RX, RY, SPP = argv[0], int(argv[1]), int(argv[2]), int(argv[3])
SAVE = argv[4] if len(argv) > 4 else None

def box(a, r):
    """separable box blur on an HxWxC float array (wraps at the edges: textures tile)"""
    for ax in (0, 1):
        c = np.cumsum(np.concatenate([a.take(range(-r - 1, 0), axis=ax), a, a.take(range(0, r), axis=ax)], axis=ax), axis=ax)
        n = a.shape[ax]
        hi = c.take(range(2 * r + 1, 2 * r + 1 + n), axis=ax); lo = c.take(range(0, n), axis=ax)
        a = (hi - lo) / (2 * r + 1)
    return a

def stylize_image(img, r=5, keep=.25, sat=1.35):
    w, h = img.size
    if w * h == 0: return
    px = np.array(img.pixels[:], np.float32).reshape(h, w, 4)
    rgb = px[..., :3]
    sm = box(box(rgb, r), r)
    out = sm * (1 - keep) + rgb * keep
    lum = (out @ np.array([.2126, .7152, .0722], np.float32))[..., None]
    out = np.clip(lum + (out - lum) * sat, 0, 1)
    px[..., :3] = out
    img.pixels[:] = px.ravel()
    img.pack()

n_img = 0
for img in bpy.data.images:
    nm = img.name.lower()
    if "_diff" in nm and not any(k in nm for k in ("alpha", "opacity", "artwork")):
        stylize_image(img); n_img += 1
n_nor = n_wear = 0
for m in bpy.data.materials:
    if not m.node_tree: continue
    for n in m.node_tree.nodes:
        if n.type == "NORMAL_MAP": n.inputs["Strength"].default_value *= .25; n_nor += 1
        if n.type == "GROUP" and "wear" in n.inputs: n.inputs["wear"].default_value = 0.0; n_wear += 1
for g in bpy.data.node_groups:
    for n in g.nodes:
        if n.type == "GROUP" and "wear" in n.inputs: n.inputs["wear"].default_value = 0.0; n_wear += 1

L = bpy.data.objects
def light(name, energy=None, color=None):
    o = L.get(name)
    if not o: return
    if energy is not None: o.data.energy = energy
    if color is not None: o.data.color = color
light("town_sun", 4.2, (1.0, 0.93, 0.84))
light("cine_fill", 25.0, (0.75, 0.82, 1.0))
light("cine_lemon_bounce", 5.0)
light("cine_rim", 160.0, (1.0, 0.92, 0.8))
for n in bpy.context.scene.world.node_tree.nodes:
    if n.type == "BACKGROUND": n.inputs["Strength"].default_value *= 1.8
    if n.type == "MATH" and n.operation in ("MULTIPLY", "ADD") and abs(n.inputs[1].default_value - .55) < 1e-3: n.inputs[1].default_value = 1.0
n_mist = 0
for o in L:
    if o.name.startswith("MIST_") or o.name.startswith("air_du_"):
        for ms in o.data.materials:
            if ms and ms.node_tree:
                for nd in ms.node_tree.nodes:
                    if nd.type in ("PRINCIPLED_VOLUME", "VOLUME_SCATTER") and "Density" in nd.inputs: nd.inputs["Density"].default_value *= .35; n_mist += 1

sc = bpy.context.scene
sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = RX, RY, 100
sc.cycles.samples = SPP; sc.cycles.use_denoising = True
sc.view_settings.view_transform = "Standard"; sc.view_settings.look = "None"
sc.render.filepath = OUT; sc.render.image_settings.file_format = "PNG"; sc.render.image_settings.color_depth = "16"
print("STYLIZE images", n_img, "normal maps", n_nor, "wear groups", n_wear, "mist mats", n_mist)
if SAVE: bpy.ops.wm.save_as_mainfile(filepath=SAVE, compress=True)
bpy.ops.render.render(write_still=True)
print("STYLIZE_DONE", OUT)
