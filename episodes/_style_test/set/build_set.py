"""_style_test SET: sunny suburban front yard (house + garage, driveway, lawn, beds, fence, big tree, far street) in THE RICK RECIPE.
  blender -b --factory-startup --python build_set.py -- build <set dir>            -> set.blend + set_meta.json (no lights, no camera)
  blender -b --factory-startup --python build_set.py -- sheet <set dir> <out dir>  -> key_540x960.png + overview.png (preview light only)
Units metres, Z up, origin on the ground at the car spot (driveway centre). The driveway runs along Y: garage door at +Y (y 9),
street at -Y (kerb y -11.6). Camera side = -Y. Houses SIMPLIFIED and CLEAN (real clapboard boards, bevelled trims, flat saturated paint,
no grime, no photo wood); nature REALISTIC (Poly Haven CC0 tree, hair lawn + modelled near blades, Poly Haven flowers/shrubs).
Objects that get the thin outline are also linked into the 'Line' collection (templates/blender_look/rick_outline).
"""
import bpy, bmesh, sys, os, json, math, random, time
from mathutils import Vector, Matrix
argv = sys.argv[sys.argv.index("--") + 1:]
MODE, SETDIR = argv[0], os.path.abspath(argv[1])
EP = os.path.dirname(SETDIR)
ASSETS = os.path.join(EP, "assets", "ph_set")
ROOT = os.path.normpath(os.path.join(EP, "..", ".."))
t0 = time.time()

# ------------------------------------------------------------------ layout numbers (one place)
# LOCAL build frame: driveway along local +Y, garage door front at local y 9. The root empty "set_root" maps it onto LAYOUT.json:
# world = T(garage point) @ Rz(-yaw) @ T(0, -9) @ local  (LAYOUT: car, drive, house and garage share yaw 26 deg).
_lay = os.path.join(EP, "LAYOUT.json")
LAY = json.load(open(_lay)) if os.path.exists(_lay) else {}
YAW = math.radians(LAY.get("garage", {}).get("yaw_deg", 26.0))
GW = Vector(LAY.get("garage", {}).get("pos", [5.108, 19.228, 0.0]))
ROOTM = Matrix.Translation(GW) @ Matrix.Rotation(-YAW, 4, "Z") @ Matrix.Translation(Vector((0, -9.0, 0)))
ROOTI = ROOTM.inverted()


def to_local(p):
    return ROOTI @ Vector((p[0], p[1], p[2] if len(p) > 2 else 0.0))


_cw = LAY.get("camera", {})
if _cw:
    _h = math.radians(_cw["look_dir_deg"]["heading_from_+Y"])
    _p = math.radians(_cw["look_dir_deg"]["pitch_up"])
    _loc = Vector(_cw["loc"])
    _tw = _loc + Vector((math.sin(_h) * math.cos(_p), math.cos(_h) * math.cos(_p), math.sin(_p))) * 10
    CAM_W = {"loc": tuple(_loc), "target": tuple(_tw), "lens": _cw.get("lens_mm", 26)}
else:
    CAM_W = {"loc": tuple(ROOTM @ Vector((4.2, -7.5, .9))), "target": tuple(ROOTM @ Vector((-.3, 1.0, 1.15))), "lens": 26.0}
CAM = {"loc": tuple(to_local(CAM_W["loc"])), "target": tuple(to_local(CAM_W["target"])), "lens": CAM_W["lens"]}
_tr = LAY.get("tree", {})
_tl = to_local(_tr["pos"]) if _tr else Vector((2.95, 4.07, 0))
DRIVE = (-1.7, 1.7, -11.6, 9.0)             # x0 x1 y0 y1 (LAYOUT drive width 3.4)
HOUSE = {"x0": -12.2, "x1": -2.2, "y": 10.0, "d": 8.0, "eave": 3.0, "ridge": 5.6}   # LAYOUT house 10 x 8, front 1 m behind the garage
GAR = {"x0": -1.8, "x1": 1.8, "y": 9.0, "d": 6.0, "eave": 2.9, "ridge": 4.5, "dw": 2.6, "dh": 2.15}
PORCH = {"x0": -7.1, "x1": -4.5, "y0": 8.6, "h": .54}
DOOR_X = -5.8
TREE = {"x": round(_tl.x, 3), "y": round(_tl.y, 3), "h": _tr.get("height", 9.5), "rot": 200.0}
LOT = {"left": -13.6, "right": 12.4, "front": -9.0}
WALK = (-10.4, -9.0)                          # public sidewalk y0 y1
KERB_Y = -11.6
SIDE = {"walk": (-15.1, -13.7), "kerb": -16.45, "far_kerb": -23.5}
GNOME = (-2.6, 6.6)
SPRINKLER = (6.6, -.8)
C = {
    "wall": "#f4d877", "wall_shade": "#d9b65a", "trim": "#f8f5ec", "roof": "#56607a", "roof2": "#4b546c",
    "door": "#2f8f9d", "shutter": "#3f9a9c", "glass": "#1c2c45", "curtain": "#f2efe6", "brass": "#d2a64a",
    "gar_door": "#f6f3ea", "conc": "#c8c3b9", "conc2": "#bdb6aa", "crack": "#5d6064", "joint": "#7c7a76",
    "walk": "#cdc7bc", "kerb": "#e4e0d8", "asph": "#6e6b77", "asph2": "#7d7a86", "lawn": "#3f6d1d",
    "lawn_far": "#467a22", "mulch": "#6d3923", "mulch2": "#87482b", "edge": "#c9c4bb", "stone": "#bdb19c",
    "stone2": "#a99c88", "fence": "#f7f5ee", "brick": "#c4624a", "mortar": "#e6dccd", "mat": "#b98c55",
    "mat_rim": "#5a3a24", "bird": "#d9452e", "bird_roof": "#f3efe4", "grass_root": "#2c5612", "grass_tip": "#86c63a",
    "grass_var": "#b2cf4c", "leaf_lit": "#9ccc4a", "leaf_dark": "#22401a", "lamp": "#26272d", "sign": "#1f7a43",
}
NEIGH = [  # name, cx, cy, width, depth, eave, ridge, facing (outward normal), wall, shade, roof
    ("n_side_a", -30.5, 2.5, 9.0, 8.0, 2.9, 5.4, (1, 0, 0), "#a6e4c8", "#7fbfa4", "#5b5f78"),
    ("n_side_b", -30.5, 17.0, 8.0, 8.5, 3.0, 5.8, (1, 0, 0), "#f6b8c6", "#d1909e", "#6a5068"),
    ("n_right", 19.5, 10.5, 9.0, 8.0, 3.0, 5.6, (0, -1, 0), "#a3d7ec", "#7aaec4", "#55617c"),
    ("n_back_a", -10.0, 30.0, 10.0, 8.0, 3.0, 6.0, (0, -1, 0), "#cdb9ec", "#a693c6", "#5a5674"),
    ("n_back_b", 5.5, 31.0, 9.0, 8.0, 2.9, 5.6, (0, -1, 0), "#f3e3a6", "#cdbb7e", "#6a5a52"),
    ("n_front", -4.0, -27.0, 10.0, 8.0, 3.0, 5.8, (0, 1, 0), "#f2c39a", "#cc9a72", "#5b5f78"),
]
FAR_TREES = [(-15.9, 1.5, 8.0, 10), (-15.9, 19.0, 9.5, 70), (-15.9, 36.0, 8.5, 140), (-22.0, 27.0, 11.0, 200), (-3.0, 24.0, 12.0, 250),
             (9.0, 22.0, 10.5, 300), (16.0, 26.0, 11.5, 40), (-36.0, 10.0, 10.0, 120), (-18.0, 42.0, 12.5, 160), (24.0, 2.0, 9.0, 220),
             (-8.0, -11.1, 8.0, 330), (8.5, -11.1, 8.5, 20), (14.0, 16.0, 9.0, 280)]


# ------------------------------------------------------------------ helpers
def lin(h, a=1.0):
    h = h.lstrip("#")
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((x + .055) / 1.055) ** 2.4 if x > .04045 else x / 12.92 for x in c) + (a,)


def coll(name, parent=None):
    c = bpy.data.collections.get(name) or bpy.data.collections.new(name)
    if c.name not in [x.name for x in (parent or bpy.context.scene.collection).children]:
        (parent or bpy.context.scene.collection).children.link(c)
    return c


def nodes(m):
    return m.node_tree.nodes, m.node_tree.links, m.node_tree.nodes["Principled BSDF"]


def rvar(m, lo, hi, scale=3.0, src="Object"):
    """roughness varies across the surface (noise into lo..hi), never one value"""
    N, L, b = nodes(m)
    tc = N.new("ShaderNodeTexCoord")
    n = N.new("ShaderNodeTexNoise")
    n.inputs["Scale"].default_value = scale
    n.inputs["Detail"].default_value = 4
    L.new(tc.outputs[src], n.inputs["Vector"])
    mr = N.new("ShaderNodeMapRange")
    mr.inputs["From Min"].default_value = .3
    mr.inputs["From Max"].default_value = .7
    mr.inputs["To Min"].default_value = lo
    mr.inputs["To Max"].default_value = hi
    L.new(n.outputs["Fac"], mr.inputs["Value"])
    L.new(mr.outputs[0], b.inputs["Roughness"])
    return m


def bump_add(m, height_socket, strength, dist=.01):
    N, L, b = nodes(m)
    bp = N.new("ShaderNodeBump")
    bp.inputs["Strength"].default_value = strength
    bp.inputs["Distance"].default_value = dist
    L.new(height_socket, bp.inputs["Height"])
    if b.inputs["Normal"].links:
        L.new(b.inputs["Normal"].links[0].from_socket, bp.inputs["Normal"])
    L.new(bp.outputs["Normal"], b.inputs["Normal"])
    return bp


def mat(name, col, rough=(.4, .6), metal=0.0, spec=.4, coat=0.0, coat_r=.05, rscale=3.0):
    m = bpy.data.materials.get(name)
    if m:
        return m
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    N, L, b = nodes(m)
    b.inputs["Base Color"].default_value = lin(col)
    b.inputs["Metallic"].default_value = metal
    b.inputs["Specular IOR Level"].default_value = spec
    if coat:
        b.inputs["Coat Weight"].default_value = coat
        b.inputs["Coat Roughness"].default_value = coat_r
    m.diffuse_color = lin(col)
    rvar(m, rough[0], rough[1], rscale)
    # fine surface tooth so close-ups never look like plastic (stylised, very small)
    N2 = N.new("ShaderNodeTexNoise")
    N2.inputs["Scale"].default_value = 160
    tc = N.new("ShaderNodeTexCoord")
    L.new(tc.outputs["Object"], N2.inputs["Vector"])
    bump_add(m, N2.outputs["Fac"], .025)
    return m


def wood_grain(m, along="Y", strength=.06, scale=9.0):
    """painted wood: grain bands along the board length (UV metres), bump + 3 % colour, never photo wood"""
    N, L, b = nodes(m)
    uv = N.new("ShaderNodeUVMap")
    w = N.new("ShaderNodeTexWave")
    w.wave_type = "BANDS"
    w.bands_direction = "X" if along == "Y" else "Y"
    w.inputs["Scale"].default_value = scale
    w.inputs["Distortion"].default_value = 6.0
    w.inputs["Detail"].default_value = 3
    w.inputs["Detail Scale"].default_value = 2.0
    L.new(uv.outputs["UV"], w.inputs["Vector"])
    bump_add(m, w.outputs["Fac"], strength, .004)
    col = b.inputs["Base Color"].default_value[:]
    mx = N.new("ShaderNodeMix")
    mx.data_type = "RGBA"
    mx.blend_type = "MULTIPLY"
    mx.inputs["A"].default_value = col
    mr = N.new("ShaderNodeMapRange")
    mr.inputs["To Min"].default_value = 1.0
    mr.inputs["To Max"].default_value = .965
    L.new(w.outputs["Fac"], mr.inputs["Value"])
    cc = N.new("ShaderNodeCombineColor")
    for k in ("Red", "Green", "Blue"):
        L.new(mr.outputs[0], cc.inputs[k])
    mx.inputs["Factor"].default_value = 1.0
    L.new(cc.outputs[0], mx.inputs["B"])
    L.new(mx.outputs["Result"], b.inputs["Base Color"])
    return m


def tex_normal(m, img, tile, strength, mapping="Position"):
    """CC0 scan used for its normal only (clean realism), world-XY mapped; colour stays ours"""
    if not os.path.exists(img):
        return m
    N, L, b = nodes(m)
    geo = N.new("ShaderNodeNewGeometry")
    mp = N.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = (1 / tile, 1 / tile, 1)
    L.new(geo.outputs[mapping], mp.inputs[0])
    t = N.new("ShaderNodeTexImage")
    t.image = bpy.data.images.load(img, check_existing=True)
    t.image.colorspace_settings.name = "Non-Color"
    L.new(mp.outputs[0], t.inputs[0])
    nm = N.new("ShaderNodeNormalMap")
    nm.inputs["Strength"].default_value = strength
    L.new(t.outputs["Color"], nm.inputs["Color"])
    if b.inputs["Normal"].links:
        old = b.inputs["Normal"].links[0].from_node
        if old.bl_idname == "ShaderNodeBump":
            L.new(nm.outputs["Normal"], old.inputs["Normal"])
            return m
    L.new(nm.outputs["Normal"], b.inputs["Normal"])
    return m


def concrete_mat(name, col, col2, crack, seed=0.0, cracks=True, tile_img=None):
    """clean concrete: faint large mottling, fine grain bump, a FEW thin dark hairline cracks (noise contour masked to small patches)"""
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    N, L, b = nodes(m)
    b.inputs["Specular IOR Level"].default_value = .3
    tc = N.new("ShaderNodeTexCoord")
    n1 = N.new("ShaderNodeTexNoise")
    n1.inputs["Scale"].default_value = .35
    n1.inputs["Detail"].default_value = 3
    n1.noise_dimensions = "4D"
    n1.inputs["W"].default_value = seed
    L.new(tc.outputs["Object"], n1.inputs["Vector"])
    mix = N.new("ShaderNodeMix")
    mix.data_type = "RGBA"
    mix.inputs["A"].default_value = lin(col)
    mix.inputs["B"].default_value = lin(col2)
    mr = N.new("ShaderNodeMapRange")
    mr.inputs["From Min"].default_value = .35
    mr.inputs["From Max"].default_value = .7
    L.new(n1.outputs["Fac"], mr.inputs["Value"])
    L.new(mr.outputs[0], mix.inputs["Factor"])
    out = mix.outputs["Result"]
    if cracks:
        n2 = N.new("ShaderNodeTexNoise")
        n2.inputs["Scale"].default_value = .9
        n2.inputs["Detail"].default_value = 6
        n2.inputs["Roughness"].default_value = .62
        n2.noise_dimensions = "4D"
        n2.inputs["W"].default_value = seed + 3
        L.new(tc.outputs["Object"], n2.inputs["Vector"])
        sub = N.new("ShaderNodeMath")
        sub.operation = "SUBTRACT"
        sub.inputs[1].default_value = .5
        L.new(n2.outputs["Fac"], sub.inputs[0])
        ab = N.new("ShaderNodeMath")
        ab.operation = "ABSOLUTE"
        L.new(sub.outputs[0], ab.inputs[0])
        ln = N.new("ShaderNodeMapRange")
        ln.inputs["From Min"].default_value = .0035
        ln.inputs["From Max"].default_value = .0
        L.new(ab.outputs[0], ln.inputs["Value"])
        n3 = N.new("ShaderNodeTexNoise")
        n3.inputs["Scale"].default_value = .16
        n3.noise_dimensions = "4D"
        n3.inputs["W"].default_value = seed + 7
        L.new(tc.outputs["Object"], n3.inputs["Vector"])
        msk = N.new("ShaderNodeMapRange")
        msk.inputs["From Min"].default_value = .56
        msk.inputs["From Max"].default_value = .62
        L.new(n3.outputs["Fac"], msk.inputs["Value"])
        mul = N.new("ShaderNodeMath")
        mul.operation = "MULTIPLY"
        L.new(ln.outputs[0], mul.inputs[0])
        L.new(msk.outputs[0], mul.inputs[1])
        mx2 = N.new("ShaderNodeMix")
        mx2.data_type = "RGBA"
        mx2.inputs["B"].default_value = lin(crack)
        L.new(mul.outputs[0], mx2.inputs["Factor"])
        L.new(out, mx2.inputs["A"])
        out = mx2.outputs["Result"]
        bump_add(m, mul.outputs[0], -.25, .004)
    L.new(out, b.inputs["Base Color"])
    g = N.new("ShaderNodeTexNoise")
    g.inputs["Scale"].default_value = 70
    g.inputs["Detail"].default_value = 2
    L.new(tc.outputs["Object"], g.inputs["Vector"])
    bump_add(m, g.outputs["Fac"], .07)
    rvar(m, .72, .9, 1.5)
    if tile_img:
        tex_normal(m, tile_img, 2.0, .25)
    m.diffuse_color = lin(col)
    return m


def brick_mat(name, col, mortar, w, h, rough=(.7, .9), mortar_size=.012, bump=.25, col2=None, offset=.5):
    """brick texture on UV metres: shingles tabs (roof), chimney bricks, scalloped edging; clean colour, real seams"""
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    N, L, b = nodes(m)
    uv = N.new("ShaderNodeUVMap")
    br = N.new("ShaderNodeTexBrick")
    br.offset = offset
    br.inputs["Color1"].default_value = lin(col)
    br.inputs["Color2"].default_value = lin(col2 or col)
    br.inputs["Mortar"].default_value = lin(mortar)
    br.inputs["Scale"].default_value = 1.0
    br.inputs["Mortar Size"].default_value = mortar_size
    br.inputs["Mortar Smooth"].default_value = .2
    br.inputs["Bias"].default_value = 0
    br.inputs["Brick Width"].default_value = w
    br.inputs["Row Height"].default_value = h
    L.new(uv.outputs["UV"], br.inputs["Vector"])
    L.new(br.outputs["Color"], b.inputs["Base Color"])
    b.inputs["Specular IOR Level"].default_value = .3
    rvar(m, rough[0], rough[1], 2.0)
    inv = N.new("ShaderNodeMath")
    inv.operation = "SUBTRACT"
    inv.inputs[0].default_value = 1.0
    L.new(br.outputs["Fac"], inv.inputs[1])
    bump_add(m, inv.outputs[0], bump, .006)
    m.diffuse_color = lin(col)
    return m


def glass_mat():
    m = bpy.data.materials.new("window_glass")
    m.use_nodes = True
    N, L, b = nodes(m)
    b.inputs["Base Color"].default_value = lin(C["glass"])
    b.inputs["Roughness"].default_value = .03
    b.inputs["Specular IOR Level"].default_value = .75
    b.inputs["IOR"].default_value = 1.52
    b.inputs["Coat Weight"].default_value = .6
    b.inputs["Coat Roughness"].default_value = .02
    m.diffuse_color = lin(C["glass"])
    rvar(m, .02, .06, 1.0)
    return m


M = {}


def make_materials():
    pave_n = os.path.join(ASSETS, "tex", "concrete_pavement_nor_gl_1k.jpg")
    M["wall"] = wood_grain(mat("house_clapboard_butter", C["wall"], (.45, .62)), "Y", .05)
    M["trim"] = wood_grain(mat("trim_white_satin", C["trim"], (.3, .45), spec=.5), "Y", .035)
    M["door"] = mat("front_door_teal_gloss", C["door"], (.18, .3), spec=.5, coat=.5)
    M["shutter"] = wood_grain(mat("shutter_teal", C["shutter"], (.35, .5)), "Y", .04)
    M["glass"] = glass_mat()
    M["curtain"] = mat("curtain_sheer", C["curtain"], (.8, .95), spec=.2)
    M["dark"] = mat("interior_dark", "#2a2f3a", (.8, .9), spec=.1)
    M["brass"] = mat("brass_polished", C["brass"], (.16, .32), metal=1.0, spec=.5)
    M["gdoor"] = mat("garage_door_white", C["gar_door"], (.3, .45), spec=.45)
    M["rubber"] = mat("rubber_seal", "#2b2b30", (.75, .85), spec=.2)
    M["roof"] = brick_mat("roof_shingle_tabs", C["roof"], "#30364a", .34, .2, (.75, .92), .008, .35, C["roof2"])
    M["roof_edge"] = mat("roof_slab_edge", C["roof2"], (.7, .85))
    M["brick"] = brick_mat("chimney_brick", C["brick"], C["mortar"], .21, .07, (.75, .9), .01, .4, "#b85a43")
    M["conc"] = concrete_mat("drive_concrete", C["conc"], C["conc2"], C["crack"], 1.0, True, pave_n)
    M["walk"] = concrete_mat("walk_concrete", C["walk"], C["conc2"], C["crack"], 5.0, False, pave_n)
    M["step"] = concrete_mat("step_concrete", "#e2ddd3", "#d6d0c4", C["crack"], 8.0, False, pave_n)
    M["joint"] = mat("joint_dark", C["joint"], (.85, .95), spec=.2)
    M["kerb"] = concrete_mat("kerb_concrete", C["kerb"], "#d6d1c7", C["crack"], 11.0, False, pave_n)
    M["asph"] = concrete_mat("asphalt", C["asph"], C["asph2"], "#4a4852", 9.0, True)
    M["lawn"] = lawn_ground()
    M["mulch"] = mulch_mat()
    M["edge"] = mat("edging_concrete", C["edge"], (.75, .9), spec=.25)
    M["stone"] = stone_mat()
    M["fence"] = wood_grain(mat("picket_white_paint", C["fence"], (.35, .55), spec=.45), "Y", .06)
    M["mat"] = coir_mat()
    M["mat_rim"] = mat("mat_rubber_rim", C["mat_rim"], (.7, .85), spec=.2)
    M["bird"] = wood_grain(mat("birdhouse_red", C["bird"], (.35, .5)), "Y", .05)
    M["bird_roof"] = wood_grain(mat("birdhouse_roof_cream", C["bird_roof"], (.35, .5)), "Y", .05)
    M["lamp"] = mat("lamp_black_metal", C["lamp"], (.25, .4), metal=.6, spec=.5)
    M["lamp_glass"] = mat("lamp_glass_warm", "#fff2cf", (.05, .1), spec=.6)
    M["gutter"] = mat("gutter_white_alu", "#f4f2ec", (.22, .35), metal=.3, spec=.55)
    M["sign"] = mat("street_sign_green", C["sign"], (.25, .35), spec=.5, coat=.4)
    M["sign_txt"] = mat("street_sign_white", "#f7f7f2", (.3, .4))
    M["pole"] = mat("galvanised_pole", "#b8bcc2", (.3, .45), metal=1.0, spec=.5)
    M["terracotta"] = mat("pot_terracotta", "#c86a3e", (.6, .8), spec=.3)
    M["soil"] = mat("pot_soil", "#3a2618", (.9, 1.0), spec=.1)
    M["rope"] = mat("swing_rope", "#cdb98e", (.8, .9), spec=.2)


def lawn_ground():
    """ground under the hair: green soil with soft mowing stripes (far lawns have no hair, so the stripes carry them)"""
    m = bpy.data.materials.new("lawn_ground")
    m.use_nodes = True
    N, L, b = nodes(m)
    geo = N.new("ShaderNodeNewGeometry")
    w = N.new("ShaderNodeTexWave")
    w.wave_type = "BANDS"
    w.bands_direction = "Y"
    w.wave_profile = "SAW"
    w.inputs["Scale"].default_value = .07
    w.inputs["Distortion"].default_value = .3
    L.new(geo.outputs["Position"], w.inputs["Vector"])
    st = N.new("ShaderNodeMath")
    st.operation = "GREATER_THAN"
    st.inputs[1].default_value = .5
    L.new(w.outputs["Fac"], st.inputs[0])
    n = N.new("ShaderNodeTexNoise")
    n.inputs["Scale"].default_value = .6
    L.new(geo.outputs["Position"], n.inputs["Vector"])
    mx = N.new("ShaderNodeMix")
    mx.data_type = "RGBA"
    mx.inputs["A"].default_value = lin(C["lawn"])
    mx.inputs["B"].default_value = lin(C["lawn_far"])
    ad = N.new("ShaderNodeMath")
    ad.operation = "MULTIPLY_ADD"
    ad.inputs[1].default_value = .22
    L.new(st.outputs[0], ad.inputs[0])
    L.new(n.outputs["Fac"], ad.inputs[2])
    L.new(ad.outputs[0], mx.inputs["Factor"])
    L.new(mx.outputs["Result"], b.inputs["Base Color"])
    b.inputs["Specular IOR Level"].default_value = .2
    rvar(m, .8, .95, 1.0)
    g = N.new("ShaderNodeTexVoronoi")
    g.inputs["Scale"].default_value = 90
    L.new(geo.outputs["Position"], g.inputs["Vector"])
    bump_add(m, g.outputs["Distance"], .5, .01)
    m.diffuse_color = lin(C["lawn"])
    return m


def mulch_mat():
    m = bpy.data.materials.new("bark_mulch")
    m.use_nodes = True
    N, L, b = nodes(m)
    tc = N.new("ShaderNodeTexCoord")
    v = N.new("ShaderNodeTexVoronoi")
    v.inputs["Scale"].default_value = 28
    v.inputs["Randomness"].default_value = 1.0
    L.new(tc.outputs["Object"], v.inputs["Vector"])
    ramp = N.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].color = lin("#3e2014")
    ramp.color_ramp.elements[1].color = lin(C["mulch2"])
    e = ramp.color_ramp.elements.new(.5)
    e.color = lin(C["mulch"])
    L.new(v.outputs["Color"], ramp.inputs[0])
    L.new(ramp.outputs[0], b.inputs["Base Color"])
    bump_add(m, v.outputs["Distance"], .6, .015)
    rvar(m, .85, .98, 4.0)
    b.inputs["Specular IOR Level"].default_value = .2
    m.diffuse_color = lin(C["mulch"])
    return m


def stone_mat():
    m = bpy.data.materials.new("flagstone")
    m.use_nodes = True
    N, L, b = nodes(m)
    tc = N.new("ShaderNodeTexCoord")
    n = N.new("ShaderNodeTexNoise")
    n.inputs["Scale"].default_value = 3.0
    n.inputs["Detail"].default_value = 6
    L.new(tc.outputs["Object"], n.inputs["Vector"])
    mx = N.new("ShaderNodeMix")
    mx.data_type = "RGBA"
    mx.inputs["A"].default_value = lin(C["stone"])
    mx.inputs["B"].default_value = lin(C["stone2"])
    L.new(n.outputs["Fac"], mx.inputs["Factor"])
    L.new(mx.outputs["Result"], b.inputs["Base Color"])
    n2 = N.new("ShaderNodeTexNoise")
    n2.inputs["Scale"].default_value = 25
    n2.inputs["Detail"].default_value = 8
    L.new(tc.outputs["Object"], n2.inputs["Vector"])
    bump_add(m, n2.outputs["Fac"], .3, .01)
    rvar(m, .7, .9, 2.0)
    m.diffuse_color = lin(C["stone"])
    return m


def coir_mat():
    """door mat: coir weave (two crossed wave textures) on UV metres"""
    m = bpy.data.materials.new("doormat_coir")
    m.use_nodes = True
    N, L, b = nodes(m)
    uv = N.new("ShaderNodeUVMap")
    w1 = N.new("ShaderNodeTexWave")
    w1.inputs["Scale"].default_value = 60
    w1.bands_direction = "X"
    w2 = N.new("ShaderNodeTexWave")
    w2.inputs["Scale"].default_value = 60
    w2.bands_direction = "Y"
    for w in (w1, w2):
        L.new(uv.outputs["UV"], w.inputs["Vector"])
    mu = N.new("ShaderNodeMath")
    mu.operation = "MULTIPLY"
    L.new(w1.outputs["Fac"], mu.inputs[0])
    L.new(w2.outputs["Fac"], mu.inputs[1])
    ramp = N.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].color = lin("#8a6238")
    ramp.color_ramp.elements[1].color = lin("#d0a56a")
    L.new(mu.outputs[0], ramp.inputs[0])
    L.new(ramp.outputs[0], b.inputs["Base Color"])
    bump_add(m, mu.outputs[0], .5, .01)
    rvar(m, .85, .95, 6.0)
    m.diffuse_color = lin(C["mat"])
    return m


# ------------------------------------------------------------------ geometry builder: one object per part, many boxes, real UVs in metres
FACES = [((0, 3, 2, 1), (0, 1)), ((4, 5, 6, 7), (0, 1)), ((0, 1, 5, 4), (0, 2)), ((3, 7, 6, 2), (0, 2)), ((0, 4, 7, 3), (2, 1)), ((1, 2, 6, 5), (2, 1))]
CUBE = [(0, 0, 0), (1, 0, 0), (1, 1, 0), (0, 1, 0), (0, 0, 1), (1, 0, 1), (1, 1, 1), (0, 1, 1)]
LINE = None
ALLPARTS = []


class Part:
    def __init__(self, name, col, line=False):
        self.name, self.col, self.line = name, col, line
        self.bm = bmesh.new()
        self.uv = self.bm.loops.layers.uv.new("UVMap")
        self.mats = []

    def mi(self, m):
        if m not in self.mats:
            self.mats.append(m)
        return self.mats.index(m)

    def hexa(self, m, W, Lc):
        """8 world points W (CUBE order) with local metre coords Lc for the UVs"""
        vs = [self.bm.verts.new(p) for p in W]
        k = self.mi(m)
        for f, (a, b) in FACES:
            try:
                face = self.bm.faces.new([vs[i] for i in f])
            except ValueError:
                continue
            face.material_index = k
            face.smooth = True
            for lp, i in zip(face.loops, f):
                lp[self.uv].uv = (Lc[i][a], Lc[i][b])

    def box(self, m, c, X, Y, size):
        """box centred at c, local axes X, Y (Z = X x Y), full sizes"""
        X, Y = Vector(X).normalized(), Vector(Y).normalized()
        Z = X.cross(Y)
        c = Vector(c)
        Lc = [((i - .5) * size[0], (j - .5) * size[1], (k - .5) * size[2]) for i, j, k in CUBE]
        W = [c + X * a + Y * b + Z * d for a, b, d in Lc]
        Lc = [(a + c.dot(X), b + c.dot(Y), d + c.dot(Z)) for a, b, d in Lc]
        self.hexa(m, W, Lc)

    def abox(self, m, x0, x1, y0, y1, z0, z1):
        self.box(m, ((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2), (1, 0, 0), (0, 1, 0), (x1 - x0, y1 - y0, z1 - z0))

    def poly(self, m, verts, faces, uvax=(0, 2)):
        vs = [self.bm.verts.new(Vector(p)) for p in verts]
        k = self.mi(m)
        for f in faces:
            try:
                face = self.bm.faces.new([vs[i] for i in f])
            except ValueError:
                continue
            face.material_index = k
            face.smooth = True
            for lp, i in zip(face.loops, f):
                lp[self.uv].uv = (verts[i][uvax[0]], verts[i][uvax[1]])

    def cyl(self, m, base, axis, r, h, n=16, r2=None, caps=True):
        axis = Vector(axis).normalized()
        a = axis.orthogonal().normalized()
        b = axis.cross(a)
        r2 = r if r2 is None else r2
        vs = []
        for k in range(n):
            t = 2 * math.pi * k / n
            d = a * math.cos(t) + b * math.sin(t)
            vs.append(Vector(base) + d * r)
            vs.append(Vector(base) + d * r2 + axis * h)
        faces = [(2 * k, 2 * ((k + 1) % n), 2 * ((k + 1) % n) + 1, 2 * k + 1) for k in range(n)]
        if caps:
            faces.append(tuple(2 * k for k in reversed(range(n))))
            faces.append(tuple(2 * k + 1 for k in range(n)))
        self.poly(m, [tuple(v) for v in vs], faces, (0, 2))

    def sphere(self, m, c, r, sx=1, sy=1, sz=1, seg=12):
        tb = bmesh.new()
        bmesh.ops.create_uvsphere(tb, u_segments=seg, v_segments=max(6, seg // 2), radius=r)
        vs = [tuple(Vector((v.co.x * sx, v.co.y * sy, v.co.z * sz)) + Vector(c)) for v in tb.verts]
        fs = [tuple(v.index for v in f.verts) for f in tb.faces]
        tb.free()
        self.poly(m, vs, fs, (0, 2))

    def done(self, bev=0.0, seg=2, coll_=None):
        if not self.bm.faces:
            self.bm.free()
            return None
        me = bpy.data.meshes.new(self.name)
        self.bm.normal_update()
        self.bm.to_mesh(me)
        self.bm.free()
        for m in self.mats:
            me.materials.append(m)
        o = bpy.data.objects.new(self.name, me)
        (coll_ or self.col).objects.link(o)
        if self.line:
            LINE.objects.link(o)
        if bev:
            b = o.modifiers.new("bevel", "BEVEL")
            b.width = bev
            b.segments = seg
            b.limit_method = "ANGLE"
            b.angle_limit = math.radians(40)
            b.harden_normals = True
            b.use_clamp_overlap = True
        ALLPARTS.append(o)
        return o


class Frame:
    """a wall frame: origin O on the ground at the wall face, outward normal F (horizontal); u right (seen from outside), z up, w outward"""
    def __init__(self, O, F):
        self.O, self.F = Vector(O), Vector(F).normalized()
        self.Z = Vector((0, 0, 1))
        self.U = self.Z.cross(self.F)

    def p(self, u, z, w=0.0):
        return self.O + self.U * u + self.Z * z + self.F * w

    def box(self, part, m, u0, u1, z0, z1, w0, w1):
        part.box(m, self.p((u0 + u1) / 2, (z0 + z1) / 2, (w0 + w1) / 2), self.U, self.Z, (u1 - u0, z1 - z0, w1 - w0))

    def boards(self, part, m, u0, u1, z0, z1, exp=.17, butt=.024, top=.008, gable=None, holes=()):
        """REAL clapboard: each board a tilted strip (thick butt at its lower edge) so a true shadow line sits under every board.
        gable=(z_eave, z_ridge, u_centre, half_width): boards above the eave are trimmed to the roof slope (the rake board hides the steps).
        holes: (u0,u1,z0,z1) openings (doors) where no board is laid."""
        z = z0
        while z < z1 - .01:
            za, zb = z, min(z + exp + .02, z1)
            ua, ub = u0, u1
            if gable and zb > gable[0]:
                ez, rz, uc, hw = gable
                k = max(0.0, 1 - (min(zb, rz) - ez) / (rz - ez))
                ua, ub = uc - hw * k - .02, uc + hw * k + .02
                if ub - ua < .05:
                    break
            spans = [(ua, ub)]
            for (h0, h1, hz0, hz1) in holes:
                if za < hz1 and zb > hz0:
                    ns = []
                    for (s0, s1) in spans:
                        if h1 <= s0 or h0 >= s1:
                            ns.append((s0, s1))
                            continue
                        if h0 > s0:
                            ns.append((s0, h0))
                        if h1 < s1:
                            ns.append((h1, s1))
                    spans = ns
            for (s0, s1) in spans:
                Lc = []
                W = []
                for i, j, k in CUBE:
                    uu = s0 if i == 0 else s1
                    zz = za if j == 0 else zb
                    ww = 0.0 if k == 0 else (butt if j == 0 else top)
                    W.append(self.p(uu, zz, ww))
                    Lc.append((uu, zz, ww))
                part.hexa(m, W, Lc)
            z += exp


# ------------------------------------------------------------------ windows, doors, lamps
def window(part_trim, part_glass, fr, u, z, w, h, cols=2, rows=2, shutters=None, box_flowers=None):
    """window with REAL depth: casing proud 9 cm, sill with apron, head with drip cap, sash frames, muntins, glass set back, sheer curtains"""
    t = .09
    T = M["trim"]
    fr.box(part_trim, T, u - w / 2 - t, u - w / 2, z - h / 2, z + h / 2, 0, .09)
    fr.box(part_trim, T, u + w / 2, u + w / 2 + t, z - h / 2, z + h / 2, 0, .09)
    fr.box(part_trim, T, u - w / 2 - t - .03, u + w / 2 + t + .03, z + h / 2, z + h / 2 + .13, 0, .1)
    fr.box(part_trim, T, u - w / 2 - t - .06, u + w / 2 + t + .06, z + h / 2 + .13, z + h / 2 + .16, 0, .13)   # drip cap
    fr.box(part_trim, T, u - w / 2 - t - .05, u + w / 2 + t + .05, z - h / 2 - .05, z - h / 2, -.0, .16)   # sill
    fr.box(part_trim, T, u - w / 2 - t + .02, u + w / 2 + t - .02, z - h / 2 - .16, z - h / 2 - .05, 0, .06)  # apron
    # sash frames: an upper and a lower sash, each with its own frame (double-hung)
    for (za, zb) in ((z - h / 2, z - .01), (z + .01, z + h / 2)):
        s = .045
        fr.box(part_trim, T, u - w / 2, u + w / 2, za, za + s, .02, .07)
        fr.box(part_trim, T, u - w / 2, u + w / 2, zb - s, zb, .02, .07)
        fr.box(part_trim, T, u - w / 2, u - w / 2 + s, za, zb, .02, .07)
        fr.box(part_trim, T, u + w / 2 - s, u + w / 2, za, zb, .02, .07)
        for i in range(1, cols):
            uu = u - w / 2 + w * i / cols
            fr.box(part_trim, T, uu - .012, uu + .012, za, zb, .03, .06)
        if rows > 2:
            zz = (za + zb) / 2
            fr.box(part_trim, T, u - w / 2, u + w / 2, zz - .012, zz + .012, .03, .06)
    fr.box(part_glass, M["glass"], u - w / 2, u + w / 2, z - h / 2, z + h / 2, .025, .035)
    # interior: dark room and sheer curtains tied back at both sides (seen through the reflective glass where the angle allows)
    fr.box(part_glass, M["curtain"], u - w / 2, u - w / 2 + w * .22, z - h / 2 + .05, z + h / 2, .012, .02)
    fr.box(part_glass, M["curtain"], u + w / 2 - w * .22, u + w / 2, z - h / 2 + .05, z + h / 2, .012, .02)
    if shutters:
        for side in (-1, 1):
            uc = u + side * (w / 2 + t + .25)
            fr.box(shutters, M["shutter"], uc - .22, uc + .22, z - h / 2 - .02, z + h / 2 + .02, .0, .035)
            n = int(h / .075)
            for k in range(n):
                zz = z - h / 2 + .06 + k * (h - .12) / max(1, n - 1)
                fr.box(shutters, M["shutter"], uc - .17, uc + .17, zz - .016, zz + .016, .035, .05)
    if box_flowers is not None:
        fr.box(part_trim, T, u - w / 2 - .05, u + w / 2 + .05, z - h / 2 - .45, z - h / 2 - .2, .02, .3)
        box_flowers.append((fr.p(u, z - h / 2 - .2, .16), w))


def coach_lamp(part, fr, u, z):
    """wall lantern: black frame, warm glass, brass cap finial"""
    fr.box(part, M["lamp"], u - .08, u + .08, z - .2, z + .2, 0, .03)
    fr.box(part, M["lamp"], u - .02, u + .02, z - .05, z + .05, .03, .14)
    fr.box(part, M["lamp_glass"], u - .085, u + .085, z - .12, z + .14, .1, .27)
    for du in (-.09, .09):
        for dw in (.09, .28):
            fr.box(part, M["lamp"], u + du - .012, u + du + .012, z - .14, z + .16, dw - .012, dw + .012)
    fr.box(part, M["lamp"], u - .11, u + .11, z + .14, z + .19, .08, .29)
    fr.box(part, M["lamp"], u - .1, u + .1, z - .17, z - .12, .08, .29)
    part.sphere(M["brass"], fr.p(u, z + .23, .185), .03)


# ------------------------------------------------------------------ the house and garage
def gable_roof_side(part, x0, x1, yf, yb, eave, ridge, over=.45, th=.12, rows=True):
    """side-gabled roof (ridge along X): two slabs with thickness + shingle rows (real strips, tab seams from the brick texture)"""
    d = yb - yf
    pitch = math.atan2(ridge - eave, d / 2)
    sl = math.hypot(d / 2, ridge - eave) + over / math.cos(pitch)
    for side in (-1, 1):
        # side -1 = front slope (faces -Y), +1 = back slope
        ymid = (yf + yb) / 2
        U = Vector((1, 0, 0))
        down = Vector((0, side * math.cos(pitch), -math.sin(pitch)))       # from ridge down the slope
        N = U.cross(down) * -1 if side == -1 else U.cross(down) * -1
        N = Vector((0, side * math.sin(pitch), math.cos(pitch)))
        top = Vector(((x0 + x1) / 2, ymid, ridge + th))
        c = top + down * (sl / 2) - N * (th / 2)
        part.box(M["roof_edge"], c, U, down, (x1 - x0 + 2 * over, sl, th))
        if rows:
            n = int(sl / .2)
            for k in range(n):
                s0 = sl - (k + 1) * .2
                Lc, W = [], []
                for i, j, kk in CUBE:
                    uu = (x0 - over) if i == 0 else (x1 + over)
                    ss = s0 + (.2 + .02 if j == 0 else 0)
                    ss = s0 if j == 1 else s0 + .22
                    ww = 0 if kk == 0 else (.022 if j == 0 else .006)
                    # j=0 is the lower (butt) edge
                    sv = s0 + .22 if j == 0 else s0
                    p = top + U * (uu - (x0 + x1) / 2) + down * sv + N * ww
                    W.append(p)
                    Lc.append((uu, -sv, ww))
                # CUBE j axis runs down-slope here: flip winding by swapping order so normals stay outward
                W2 = [W[i] for i in (3, 2, 1, 0, 7, 6, 5, 4)]
                L2 = [Lc[i] for i in (3, 2, 1, 0, 7, 6, 5, 4)]
                part.hexa(M["roof"], W2, L2)
    return pitch


def gable_roof_front(part, x0, x1, yf, yb, eave, ridge, over=.4, th=.12):
    """front-gabled roof (ridge along Y, gable to the street) with shingle rows"""
    cx, hw = (x0 + x1) / 2, (x1 - x0) / 2
    pitch = math.atan2(ridge - eave, hw)
    sl = math.hypot(hw, ridge - eave) + over / math.cos(pitch)
    Y = Vector((0, 1, 0))
    for side in (-1, 1):
        down = Vector((side * math.cos(pitch), 0, -math.sin(pitch)))
        N = Vector((side * math.sin(pitch), 0, math.cos(pitch)))
        top = Vector((cx, (yf + yb) / 2, ridge + th))
        c = top + down * (sl / 2) - N * (th / 2)
        part.box(M["roof_edge"], c, down, Y, (sl, yb - yf + 2 * over, th))
        n = int(sl / .2)
        for k in range(n):
            s0 = sl - (k + 1) * .2
            W, Lc = [], []
            for i, j, kk in CUBE:
                yy = (yf - over) if j == 0 else (yb + over)
                sv = s0 + .22 if i == 0 else s0
                ww = 0 if kk == 0 else (.022 if i == 0 else .006)
                W.append(top + Y * (yy - (yf + yb) / 2) + down * sv + N * ww)
                Lc.append((-sv, yy, ww))
            if side == -1:
                W = [W[i] for i in (1, 0, 3, 2, 5, 4, 7, 6)]
                Lc = [Lc[i] for i in (1, 0, 3, 2, 5, 4, 7, 6)]
            part.hexa(M["roof"], W, [(l[1], l[0], l[2]) for l in Lc])
    return pitch


def build_house(CH):
    H = HOUSE
    x0, x1, yf, e, r = H["x0"], H["x1"], H["y"], H["eave"], H["ridge"]
    yb = yf + H["d"]
    core = Part("house_core", CH)
    core.abox(M["wall"], x0 + .02, x1, yf + .02, yb, 0, e)
    core.poly(M["wall"], [(x0 + .02, yf + .02, e), (x0 + .02, yb, e), (x0 + .02, (yf + yb) / 2, r)], [(0, 2, 1)], (1, 2))
    core.done()
    walls = Part("house_clapboard", CH)
    trim = Part("house_trim", CH, line=True)
    glass = Part("house_glass", CH)
    shut = Part("house_shutters", CH, line=True)
    fF = Frame(((x0 + x1) / 2, yf, 0), (0, -1, 0))
    hw = (x1 - x0) / 2
    du = DOOR_X - (x0 + x1) / 2
    fF.boards(walls, M["wall"], -hw, hw, .25, e, holes=[(du - .62, du + .62, 0, 2.35)])
    fL = Frame((x0, (yf + yb) / 2, 0), (-1, 0, 0))
    fL.boards(walls, M["wall"], -H["d"] / 2, H["d"] / 2, .25, r, gable=(e, r, 0.0, H["d"] / 2))
    walls.done(bev=.004, seg=1)
    # foundation strip (painted concrete), corner boards, frieze under the eave, fascia
    found = Part("house_foundation", CH)
    fF.box(found, M["step"], -hw - .05, hw, 0, .25, -.02, .03)
    fL.box(found, M["step"], -H["d"] / 2, H["d"] / 2 + .05, 0, .25, -.02, .03)
    found.done(bev=.01)
    fF.box(trim, M["trim"], -hw - .02, -hw + .14, .25, e, 0, .05)
    fF.box(trim, M["trim"], hw - .14, hw, .25, e, 0, .05)
    fF.box(trim, M["trim"], -hw - .02, hw, e - .22, e, 0, .05)
    fL.box(trim, M["trim"], H["d"] / 2 - .14, H["d"] / 2 + .02, .25, e, 0, .05)
    fL.box(trim, M["trim"], -H["d"] / 2 - .02, H["d"] / 2 + .02, e - .22, e, 0, .05)
    # windows: picture window left of the porch, a pair at the far left, a small one near the garage, one on the side
    flowers = []
    window(trim, glass, fF, -9.0 - (x0 + x1) / 2, 1.62, 1.9, 1.35, cols=3, rows=3, shutters=shut, box_flowers=flowers)
    window(trim, glass, fF, -11.3 - (x0 + x1) / 2, 1.62, .85, 1.35, cols=2, rows=3, shutters=None)
    window(trim, glass, fF, -3.4 - (x0 + x1) / 2, 1.7, .7, 1.1, cols=2, rows=2, shutters=None)
    window(trim, glass, fL, 0.0, 1.62, 1.0, 1.3, cols=2, rows=3, shutters=shut)
    # front door: teal gloss slab with 6 raised panels, brass knob + deadbolt + kick plate + knocker, casing with pediment
    door = Part("front_door", CH, line=True)
    dw, dh = .95, 2.1
    fF.box(door, M["dark"], du - dw / 2, du + dw / 2, .54, .54 + dh, -.06, -.04)
    fF.box(door, M["door"], du - dw / 2, du + dw / 2, .54, .54 + dh, -.04, .0)
    for (pu, pz, pw, ph) in [(-.21, .54 + 1.62, .32, .5), (.21, .54 + 1.62, .32, .5), (-.21, .54 + 1.0, .32, .55), (.21, .54 + 1.0, .32, .55),
                             (-.21, .54 + .36, .32, .5), (.21, .54 + .36, .32, .5)]:
        fF.box(door, M["door"], du + pu - pw / 2, du + pu + pw / 2, pz - ph / 2, pz + ph / 2, .0, .018)
        fF.box(door, M["door"], du + pu - pw / 2 + .04, du + pu + pw / 2 - .04, pz - ph / 2 + .04, pz + ph / 2 - .04, .018, .03)
    door.done(bev=.006)
    hw_ = Part("door_hardware", CH, line=True)
    hw_.sphere(M["brass"], fF.p(du + .37, .54 + 1.0, .065), .033)
    hw_.cyl(M["brass"], fF.p(du + .37, .54 + 1.0, 0), (0, -1, 0), .03, .04, 16)
    hw_.cyl(M["brass"], fF.p(du + .37, .54 + 1.18, 0), (0, -1, 0), .028, .02, 16)
    fF.box(hw_, M["brass"], du - dw / 2 + .04, du + dw / 2 - .04, .56, .76, .0, .006)      # kick plate
    fF.box(hw_, M["brass"], du - .05, du + .05, .54 + 1.55, .54 + 1.62, .0, .02)           # knocker plate
    hw_.cyl(M["brass"], fF.p(du, .54 + 1.6, .03), (1, 0, 0), .006, .0001, 8)
    hw_.done()
    fF.box(trim, M["trim"], du - dw / 2 - .12, du - dw / 2, .54, .54 + dh, 0, .07)
    fF.box(trim, M["trim"], du + dw / 2, du + dw / 2 + .12, .54, .54 + dh, 0, .07)
    fF.box(trim, M["trim"], du - dw / 2 - .18, du + dw / 2 + .18, .54 + dh, .54 + dh + .18, 0, .08)
    trim.poly(M["trim"], [tuple(fF.p(du - dw / 2 - .22, .54 + dh + .18, .1)), tuple(fF.p(du + dw / 2 + .22, .54 + dh + .18, .1)),
                          tuple(fF.p(du, .54 + dh + .45, .1)), tuple(fF.p(du - dw / 2 - .22, .54 + dh + .18, 0)),
                          tuple(fF.p(du + dw / 2 + .22, .54 + dh + .18, 0)), tuple(fF.p(du, .54 + dh + .45, 0))],
              [(0, 1, 2), (5, 4, 3), (0, 3, 4, 1), (1, 4, 5, 2), (2, 5, 3, 0)], (0, 2))
    wreath(CH, fF.p(du, .54 + 1.55, .07))
    lamps = Part("house_lamps", CH, line=True)
    coach_lamp(lamps, fF, du - .9, .54 + 1.6)
    lamps.done(bev=.003)
    # house number in brass beside the door
    txt(CH, "27", fF.p(du + .82, .54 + 1.75, .03), fF, .16, M["brass"])
    trim.done(bev=.008)
    glass.done()
    shut.done(bev=.004)
    # roof: shingles, fascia, rake boards, gutter + downpipe, chimney
    roof = Part("house_roof", CH)
    gable_roof_side(roof, x0, x1, yf, yb, e, r)
    roof.done(bev=.006)
    rt = Part("house_roof_trim", CH, line=True)
    pitch = math.atan2(r - e, H["d"] / 2)
    rt.box(M["trim"], ((x0 + x1) / 2, yf - .43, e - .2 * math.sin(pitch) + .0), (1, 0, 0), (0, 0, 1), (x1 - x0 + .6, .2, .05))
    for side in (-1, 1):
        L_ = math.hypot(H["d"] / 2, r - e) + .5
        down = Vector((0, side * math.cos(pitch), -math.sin(pitch)))
        c = Vector((x0 - .45, (yf + yb) / 2, r + .06)) + down * (L_ / 2)
        rt.box(M["trim"], c, (0, 0, 0) if False else down, (-1, 0, 0) if side == -1 else (1, 0, 0), (L_, .05, .22))
    rt.done(bev=.008)
    gutter(CH, x0 - .45, x1 + .3, yf - .5, e - .3, (x0 - .3, yf - .52))
    ch = Part("chimney", CH, line=True)
    ch.abox(M["brick"], -10.6, -9.9, 13.6, 14.4, 3.5, r + 1.1)
    ch.abox(M["step"], -10.68, -9.82, 13.52, 14.48, r + 1.1, r + 1.2)
    ch.abox(M["lamp"], -10.4, -10.1, 13.85, 14.15, r + 1.2, r + 1.42)
    ch.done(bev=.01)
    return flowers


def gutter(CH, xa, xb, y, z, pipe_xy):
    """K-style gutter with hanger straps, end caps, downpipe with elbows, kick-out and a concrete splash block"""
    g = Part("gutter_" + str(int(xa)), CH, line=True)
    g.abox(M["gutter"], xa, xb, y - .07, y + .07, z - .12, z)
    g.abox(M["gutter"], xa, xb, y - .085, y - .065, z - .02, z + .015)
    for k in range(int((xb - xa) / .8) + 1):
        xx = xa + .1 + k * .8
        if xx < xb:
            g.abox(M["gutter"], xx - .015, xx + .015, y - .07, y + .1, z - .005, z + .012)
    px, py = pipe_xy
    g.abox(M["gutter"], px - .045, px + .045, py - .035 + .07, py + .035 + .07, .32, z - .12)
    g.box(M["gutter"], (px, py + .07, .22), (1, 0, 0), (0, -math.sin(.8), math.cos(.8)), (.09, .07, .3))
    g.abox(M["gutter"], px - .045, px + .045, py - .25, py - .06, .06, .12)
    for zz in (.9, 2.0):
        g.abox(M["gutter"], px - .06, px + .06, py + .03, py + .11, zz, zz + .03)
    g.done(bev=.008)
    sb = Part("splash_block", CH)
    sb.abox(M["step"], px - .16, px + .16, py - .75, py - .1, -.01, .04)
    sb.done(bev=.012)


def wreath(CH, c):
    """evergreen wreath: torus core + ~140 leaf blades + red berries + red bow"""
    c = Vector(c)
    w = Part("door_wreath", CH, line=False)
    green = mat("wreath_green", "#2e6a2c", (.4, .6), spec=.4)
    dg = mat("wreath_dark", "#1f4a22", (.4, .6), spec=.4)
    red = mat("wreath_red_gloss", "#d42a2a", (.15, .3), spec=.6, coat=.3)
    rnd = random.Random(4)
    R = .2
    for k in range(150):
        t = 2 * math.pi * k / 150 + rnd.uniform(-.02, .02)
        rr = R + rnd.uniform(-.05, .05)
        p = c + Vector((math.cos(t) * rr, -rnd.uniform(0, .05), math.sin(t) * rr))
        d = Vector((-math.sin(t), rnd.uniform(-.3, .3), math.cos(t))).normalized()
        w.box(green if k % 3 else dg, p, d, Vector((0, 1, 0)).cross(d), (.09, .022, .006))
    for k in range(14):
        t = rnd.uniform(0, 2 * math.pi)
        w.sphere(red, c + Vector((math.cos(t) * R, -.05, math.sin(t) * R)), .012, seg=8)
    bow = c + Vector((0, -.06, -R))
    for s in (-1, 1):
        w.box(red, bow + Vector((s * .05, 0, .01)), (s, 0, .35), (0, 1, 0), (.09, .015, .05))
        w.box(red, bow + Vector((s * .035, 0, -.07)), (s * .3, 0, -1), (0, 1, 0), (.12, .012, .03))
    w.sphere(red, bow, .022, 1, .8, 1, 10)
    w.done()


def txt(CH, s, loc, fr, size, m, extrude=.006):
    cu = bpy.data.curves.new("txt_" + s, "FONT")
    cu.body = s
    cu.size = size
    cu.extrude = extrude
    cu.align_x = "CENTER"
    cu.align_y = "CENTER"
    cu.bevel_depth = .001
    o = bpy.data.objects.new("txt_" + s.replace(" ", "_"), cu)
    o.data.materials.append(m)
    rot = Matrix((fr.U, fr.Z, fr.F)).transposed().to_4x4()
    o.matrix_world = Matrix.Translation(loc) @ rot
    CH.objects.link(o)
    LINE.objects.link(o)
    return o


def build_garage(CH):
    G = GAR
    x0, x1, yf, e, r = G["x0"], G["x1"], G["y"], G["eave"], G["ridge"]
    yb = yf + G["d"]
    cx = (x0 + x1) / 2
    hw = (x1 - x0) / 2
    core = Part("garage_core", CH)
    core.abox(M["wall"], x0, x1 - .02, yf + .02, yb, 0, e)
    core.poly(M["wall"], [(x0, yf + .02, e), (x1 - .02, yf + .02, e), (cx, yf + .02, r)], [(0, 1, 2)], (0, 2))
    core.done()
    fF = Frame((cx, yf, 0), (0, -1, 0))
    fR = Frame((x1, (yf + yb) / 2, 0), (1, 0, 0))
    walls = Part("garage_clapboard", CH)
    dw, dh = G["dw"], G["dh"]
    fF.boards(walls, M["wall"], -hw, hw, .2, r, gable=(e, r, 0.0, hw), holes=[(-dw / 2 - .1, dw / 2 + .1, 0, dh + .05)])
    fR.boards(walls, M["wall"], -G["d"] / 2, G["d"] / 2, .2, e)
    walls.done(bev=.004, seg=1)
    trim = Part("garage_trim", CH, line=True)
    fF.box(trim, M["trim"], -hw - .02, -hw + .14, .2, e, 0, .05)
    fF.box(trim, M["trim"], hw - .14, hw + .02, .2, e, 0, .05)
    fF.box(trim, M["trim"], -dw / 2 - .17, -dw / 2, 0, dh + .05, 0, .08)
    fF.box(trim, M["trim"], dw / 2, dw / 2 + .17, 0, dh + .05, 0, .08)
    fF.box(trim, M["trim"], -dw / 2 - .22, dw / 2 + .22, dh + .05, dh + .27, 0, .09)
    fF.box(trim, M["trim"], -dw / 2 - .26, dw / 2 + .26, dh + .27, dh + .3, 0, .12)
    fF.box(trim, M["trim"], -hw - .02, hw + .02, e - .2, e, 0, .05)       # frieze across the gable base
    # gable: half-round sunburst vent with louvres
    vz = e + .55
    for k in range(9):
        a = math.pi * (k + .5) / 9
        d = Vector((math.cos(a), 0, math.sin(a)))
        p = fF.p(0, vz, .04) + Vector((d.x, 0, d.z)) * .26
        trim.box(M["trim"], p, Vector((d.x, 0, d.z)), Vector((0, -1, 0)), (.46, .04, .035))
    fF.box(trim, M["trim"], -.6, .6, vz - .05, vz, 0, .07)
    fR.box(trim, M["trim"], G["d"] / 2 - .14, G["d"] / 2 + .02, .2, e, 0, .05)
    trim.done(bev=.007)
    # sectional door: 4 sections; bottom 3 with 4 raised panels each, top with a row of 4 windows; handle, seal
    gd = Part("garage_door", CH, line=True)
    sh = dh / 4
    fF.box(gd, M["dark"], -dw / 2, dw / 2, 0, dh, -.08, -.06)
    gl = Part("garage_door_glass", CH)
    for i in range(4):
        z0 = i * sh
        fF.box(gd, M["gdoor"], -dw / 2 + .005, dw / 2 - .005, z0 + .006, z0 + sh - .006, -.06, -.02)
        pw = (dw - .25) / 4
        for k in range(4):
            u0 = -dw / 2 + .125 + k * pw + .03
            u1 = u0 + pw - .06
            if i < 3:
                fF.box(gd, M["gdoor"], u0, u1, z0 + .08, z0 + sh - .08, -.02, -.005)
                fF.box(gd, M["gdoor"], u0 + .04, u1 - .04, z0 + .12, z0 + sh - .12, -.005, .002)
            else:
                fF.box(gl, M["glass"], u0, u1, z0 + .1, z0 + sh - .1, -.03, -.025)
                fF.box(gd, M["gdoor"], u0 - .025, u1 + .025, z0 + .07, z0 + .1, -.025, -.008)
                fF.box(gd, M["gdoor"], u0 - .025, u1 + .025, z0 + sh - .1, z0 + sh - .07, -.025, -.008)
                fF.box(gd, M["gdoor"], u0 - .025, u0, z0 + .1, z0 + sh - .1, -.025, -.008)
                fF.box(gd, M["gdoor"], u1, u1 + .025, z0 + .1, z0 + sh - .1, -.025, -.008)
    fF.box(gd, M["rubber"], -dw / 2, dw / 2, 0, .03, -.07, -.015)
    gd.done(bev=.006)
    gl.done()
    h = Part("garage_handle", CH, line=True)
    fF.box(h, M["pole"], -.18, .18, .55, .6, -.02, .01)
    fF.box(h, M["pole"], -.16, .16, .56, .59, .01, .035)
    h.done(bev=.004)
    lamps = Part("garage_lamps", CH, line=True)
    coach_lamp(lamps, fF, 0, dh + .62)
    lamps.done(bev=.003)
    # link wall between the garage and the house (0.4 m, set 1 m back) and boards on the garage's house-side wall
    fLk = Frame(((HOUSE["x1"] + x0) / 2, HOUSE["y"], 0), (0, -1, 0))
    lw = Part("link_wall", CH)
    lw.abox(M["wall"], HOUSE["x1"] - .01, x0 + .01, HOUSE["y"] + .02, HOUSE["y"] + 1.5, 0, e)
    fLk.boards(lw, M["wall"], -(x0 - HOUSE["x1"]) / 2, (x0 - HOUSE["x1"]) / 2, .2, e)
    fGL = Frame((x0, (yf + HOUSE["y"]) / 2, 0), (-1, 0, 0))
    fGL.boards(lw, M["wall"], -(HOUSE["y"] - yf) / 2, (HOUSE["y"] - yf) / 2, .2, e)
    lw.done(bev=.004, seg=1)
    roof = Part("garage_roof", CH)
    gable_roof_front(roof, x0, x1, yf, yb, e, r)
    roof.done(bev=.006)
    rk = Part("garage_rake", CH, line=True)
    pitch = math.atan2(r - e, hw)
    Ls = math.hypot(hw, r - e) + .45
    for side in (-1, 1):
        down = Vector((side * math.cos(pitch), 0, -math.sin(pitch)))
        c = Vector((cx, yf - .38, r + .05)) + down * (Ls / 2)
        rk.box(M["trim"], c, down, Vector((0, side, 0)) if side == 1 else Vector((0, 1, 0)), (Ls, .06, .22))
    rk.done(bev=.008)
    for side in (-1, 1):
        xx = cx + side * (hw + .38)
        g = Part("garage_gutter%d" % side, CH, line=True)
        g.abox(M["gutter"], xx - .07, xx + .07, yf - .4, (yb + .4) if side == 1 else (HOUSE["y"] - .05), e - .42, e - .3)
        g.done(bev=.008)
    gutter(CH, x1 + .3, x1 + .31, yf - .02, e - .3, (x1 + .3, yf + .02))
    txt(CH, "27", fF.p(.9, dh + .62, .1), fF, .2, M["brass"])


def build_porch(CH, flowers):
    P_ = PORCH
    x0, x1, y0, h = P_["x0"], P_["x1"], P_["y0"], P_["h"]
    p = Part("porch_steps", CH, line=True)
    p.abox(M["step"], x0, x1, y0, HOUSE["y"] + .02, 0, h)
    p.abox(M["step"], x0 - .03, x1 + .03, y0 - .04, HOUSE["y"], h - .05, h)        # nosing
    for k, (ya, z) in enumerate(((y0 - .3, h - .18), (y0 - .6, h - .36))):
        p.abox(M["step"], x0 + .3, x1 - .3, ya, y0 if k == 0 else y0 - .3, 0, z)
        p.abox(M["step"], x0 + .27, x1 - .27, ya - .03, ya + .3, z - .04, z)
    p.done(bev=.012)
    # posts and a shed porch roof, two handrails
    pr = Part("porch_frame", CH, line=True)
    for xx in (x0 + .1, x1 - .1):
        pr.abox(M["trim"], xx - .07, xx + .07, y0 + .03, y0 + .17, h, 2.85)
        pr.abox(M["trim"], xx - .1, xx + .1, y0, y0 + .2, h, h + .12)
        pr.abox(M["trim"], xx - .1, xx + .1, y0, y0 + .2, 2.7, 2.85)
    pr.abox(M["trim"], x0 - .05, x1 + .05, y0 - .02, y0 + .2, 2.85, 3.0)
    for xx in (x0 + .3, x1 - .3):
        for k in range(4):
            yy = y0 - .6 + k * .2
            pr.abox(M["trim"], xx - .02, xx + .02, yy - .02, yy + .02, (h - .36) * max(0, 1 - k / 3.0) * 0 + .0, .95 + h * min(1, k / 3.0) * .55)
        pr.box(M["trim"], (xx, y0 - .25, .95 + .26), (0, math.cos(-.62), -math.sin(-.62) * -1), (1, 0, 0), (.78, .05, .045))
    pr.done(bev=.008)
    rf = Part("porch_roof", CH)
    pitch = .3
    L_ = HOUSE["y"] - y0 + .3
    rf.box(M["roof_edge"], ((x0 + x1) / 2, (y0 + HOUSE["y"]) / 2 - .12, 3.0 + math.sin(pitch) * L_ / 2), (1, 0, 0),
           (0, math.cos(pitch), math.sin(pitch)), (x1 - x0 + .4, L_, .08))
    rf.done(bev=.006)
    # door mat (coir with a dark rubber rim) and two terracotta pots beside the steps
    m = Part("door_mat", CH, line=True)
    m.abox(M["mat_rim"], DOOR_X - .45, DOOR_X + .45, HOUSE["y"] - .65, HOUSE["y"] - .1, h, h + .012)
    m.abox(M["mat"], DOOR_X - .41, DOOR_X + .41, HOUSE["y"] - .61, HOUSE["y"] - .14, h + .012, h + .02)
    m.done(bev=.004)
    pots = []
    for xx in (x0 + .25, x1 - .25):
        pt = Part("pot", CH, line=True)
        pt.cyl(M["terracotta"], (xx, y0 + .35, h), (0, 0, 1), .14, .3, 20, .19)
        pt.cyl(M["terracotta"], (xx, y0 + .35, h + .27), (0, 0, 1), .205, .05, 20)
        pt.cyl(M["soil"], (xx, y0 + .35, h + .26), (0, 0, 1), .18, .05, 20)
        pt.done(bev=.006)
        pots.append((xx, y0 + .35, h + .3))
    return pots


# ------------------------------------------------------------------ ground: drive slabs with control joints, walks, kerbs, streets, lawn soil
def build_ground(CG):
    x0, x1, y0, y1 = DRIVE
    d = Part("drive_slabs", CG)
    y = y1
    while y > y0 + .01:
        ya = max(y - 3.0, y0)
        for (xa, xb) in ((x0, 0.0), (0.0, x1)):
            if not (WALK[0] < (ya + y) / 2 < WALK[1]):
                d.abox(M["conc"], xa + .008, xb - .008, ya + .008, y - .008, -.12, 0)
        y = ya
    d.done(bev=.006)
    j = Part("drive_joints", CG)
    j.abox(M["joint"], x0, x1, y0, y1, -.13, -.012)
    j.done()
    w = Part("walks", CG)
    xx = LOT["left"]
    while xx < LOT["right"] + .2:
        x2 = xx + 1.5
        w.abox(M["walk"], xx + .007, x2 - .007, WALK[0], WALK[1], -.12, 0)
        xx = x2
    # side-street sidewalk (left), apron through the verge, front kerb with a cut at the drive
    yy = WALK[0]
    while yy < 45:
        w.abox(M["walk"], SIDE["walk"][0], SIDE["walk"][1], yy + .007, yy + 1.5 - .007, -.12, 0)
        yy += 1.5
    w.abox(M["walk"], x0 - .6, x1 + .6, KERB_Y, WALK[0], -.12, 0)
    w.done(bev=.005)
    k = Part("kerbs", CG)
    k.abox(M["kerb"], SIDE["kerb"] - 40, x0 - .6, KERB_Y - .15, KERB_Y, -.1, .12)
    k.abox(M["kerb"], x1 + .6, 60, KERB_Y - .15, KERB_Y, -.1, .12)
    k.abox(M["kerb"], x0 - .6, x1 + .6, KERB_Y - .15, KERB_Y, -.1, .02)
    k.abox(M["kerb"], SIDE["kerb"], SIDE["kerb"] + .15, KERB_Y - .15, 60, -.1, .12)
    k.abox(M["kerb"], SIDE["far_kerb"] - .15, SIDE["far_kerb"], -60, 60, -.1, .12)
    k.abox(M["kerb"], -60, SIDE["far_kerb"] - .15, KERB_Y - 7.6, KERB_Y - 7.45, -.1, .12)
    k.abox(M["kerb"], SIDE["kerb"], 60, KERB_Y - 7.6, KERB_Y - 7.45, -.1, .12)
    k.done(bev=.03)
    a = Part("asphalt", CG)
    a.abox(M["asph"], -80, 80, KERB_Y - 7.45, KERB_Y - .15, -.08, -.01)
    a.abox(M["asph"], SIDE["far_kerb"], SIDE["kerb"], KERB_Y - .15, 80, -.08, -.01)
    a.done()
    g = Part("lawn_soil", CG)
    g.abox(M["lawn"], -150, 150, -150, 150, -.06, -.02)
    g.done()
    # a storm drain grate in the gutter by the corner (detail on the street)
    sd = Part("storm_drain", CG, line=True)
    sd.abox(M["lamp"], -10.2, -9.4, KERB_Y - .55, KERB_Y - .15, -.045, -.035)
    for kk in range(7):
        sd.abox(M["joint"], -10.15 + kk * .11, -10.1 + kk * .11, KERB_Y - .52, KERB_Y - .18, -.036, -.03)
    sd.done()


def build_stones(CY):
    """stepping stones from the drive to the porch steps: irregular flagstones, bevelled, a little above the lawn"""
    rnd = random.Random(21)
    pts = []
    a, b = Vector((DRIVE[0] - .45, 3.8)), Vector((PORCH["x0"] + 1.3, PORCH["y0"] - .9))
    n = 6
    for i in range(n):
        t = i / (n - 1)
        p = a.lerp(b, t) + Vector((math.sin(t * math.pi) * -.45, math.sin(t * math.pi) * .25))
        pts.append(p)
    s = Part("stepping_stones", CY, line=True)
    for i, p in enumerate(pts):
        r = rnd.uniform(.26, .32)
        nv = 11
        vs = []
        for k in range(nv):
            t = 2 * math.pi * k / nv
            rr = r * rnd.uniform(.82, 1.12)
            vs.append((p.x + math.cos(t) * rr * 1.15, p.y + math.sin(t) * rr, .035))
        vs += [(v[0], v[1], -.02) for v in vs]
        faces = [tuple(range(nv)), tuple(reversed(range(nv, 2 * nv)))] + [(k, k + nv, (k + 1) % nv + nv, (k + 1) % nv) for k in range(nv)]
        faces[1] = tuple(reversed(range(nv, 2 * nv)))
        faces[0] = tuple(range(nv))
        s.poly(M["stone"], vs, [faces[0], faces[1]] + [(k, (k + 1) % nv, (k + 1) % nv + nv, k + nv) for k in range(nv)], (0, 1))
    s.done(bev=.015, seg=3)
    return pts


def build_beds(CY):
    """flower beds with bark mulch and scalloped concrete edging: house front (both sides of the porch), drive edge, tree ring"""
    beds = [(-11.25, PORCH["x0"] - .05, PORCH["y0"] - .05, HOUSE["y"]),
            (PORCH["x1"] + .05, HOUSE["x1"] - .1, PORCH["y0"] - .05, HOUSE["y"]),
            (DRIVE[1] + .05, DRIVE[1] + .75, -2.5, 2.8)]
    mu = Part("mulch", CY)
    ed = Part("bed_edging", CY, line=True)
    rnd = random.Random(8)
    for (xa, xb, ya, yb) in beds:
        nx, ny = max(2, int((xb - xa) / .1)), max(2, int((yb - ya) / .1))
        vs = [(xa + (xb - xa) * i / nx, ya + (yb - ya) * j / ny, .035 + rnd.uniform(-.012, .012)) for j in range(ny + 1) for i in range(nx + 1)]
        fs = [(j * (nx + 1) + i, j * (nx + 1) + i + 1, (j + 1) * (nx + 1) + i + 1, (j + 1) * (nx + 1) + i) for j in range(ny) for i in range(nx)]
        mu.poly(M["mulch"], vs, fs, (0, 1))
        # edging along the lawn-facing sides: scalloped blocks (box + rounded top)
        sides = []
        if ya < PORCH["y0"]:
            sides.append(((xa, ya), (xb, ya)))
        if xa > DRIVE[1]:
            sides = [((xb, ya), (xb, yb)), ((xa, ya), (xb, ya)), ((xa, yb), (xb, yb))]
        for (p0, p1) in sides:
            p0, p1 = Vector(p0), Vector(p1)
            L_ = (p1 - p0).length
            dirv = (p1 - p0).normalized()
            n = max(1, int(L_ / .3))
            for k in range(n):
                c = p0 + dirv * ((k + .5) * L_ / n)
                ed.box(M["edge"], (c.x, c.y, .04), (dirv.x, dirv.y, 0), (0, 0, 1), (L_ / n - .012, .16, .06))
                nn = Vector((-dirv.y, dirv.x, 0))
                ed.cyl(M["edge"], Vector((c.x, c.y, -.03)) - nn * .075, nn, L_ / n / 2 - .01, .15, 18)
    # tree ring
    tx, ty = TREE["x"], TREE["y"]
    R = 1.0
    nv = 28
    vs = [(tx, ty, .04)] + [(tx + math.cos(2 * math.pi * k / nv) * R, ty + math.sin(2 * math.pi * k / nv) * R, .03 + rnd.uniform(-.01, .01)) for k in range(nv)]
    mu.poly(M["mulch"], vs, [(0, k + 1, (k + 1) % nv + 1) for k in range(nv)], (0, 1))
    for k in range(18):
        t = 2 * math.pi * k / 18
        ed.box(M["edge"], (tx + math.cos(t) * (R + .06), ty + math.sin(t) * (R + .06), .05), (-math.sin(t), math.cos(t), 0), (0, 0, 1),
               (2 * math.pi * (R + .06) / 18 - .015, .12, .1))
    mu.done()
    ed.done(bev=.012)
    return beds


# ------------------------------------------------------------------ picket fence
def picket_run(part, p0, p1, h=1.0, pw=.085, gap=.055, posts=2.4):
    p0, p1 = Vector((p0[0], p0[1], 0)), Vector((p1[0], p1[1], 0))
    L_ = (p1 - p0).length
    d = (p1 - p0).normalized()
    n2 = Vector((-d.y, d.x, 0))
    n = int(L_ / (pw + gap))
    for k in range(n):
        c = p0 + d * ((k + .5) * L_ / n)
        a, b = c - d * pw / 2, c + d * pw / 2
        th = .022
        top = h + rnd_f.uniform(-.004, .004)
        vs = []
        for o in (0, th):
            off = n2 * (o + .03)
            vs += [tuple(a + off), tuple(b + off), tuple(b + off + Vector((0, 0, top - .07))), tuple(c + off + Vector((0, 0, top))),
                   tuple(a + off + Vector((0, 0, top - .07)))]
        for i in range(5):
            vs[i] = (vs[i][0], vs[i][1], vs[i][2] + .04 if i < 2 else vs[i][2])
            vs[i + 5] = (vs[i + 5][0], vs[i + 5][1], vs[i + 5][2] + .04 if i < 2 else vs[i + 5][2])
        f = [(4, 3, 2, 1, 0), (5, 6, 7, 8, 9)] + [(i, (i + 1) % 5, (i + 1) % 5 + 5, i + 5) for i in range(5)]
        part.poly(M["fence"], vs, f, (2, 2))
    for k in range(int(L_ / posts) + 1):
        c = p0 + d * min(L_, k * posts)
        part.box(M["fence"], (c.x - n2.x * .05, c.y - n2.y * .05, (h + .1) / 2), (d.x, d.y, 0), (0, 0, 1), (.1, h + .1, .1))
        part.poly(M["fence"], [tuple(c - n2 * .05 + Vector(v)) for v in
                               ((-.065, -.065, h + .1), (.065, -.065, h + .1), (.065, .065, h + .1), (-.065, .065, h + .1), (0, 0, h + .2))],
                  [(0, 1, 4), (1, 2, 4), (2, 3, 4), (3, 0, 4), (3, 2, 1, 0)], (0, 2))
        part.box(M["fence"], (c.x - n2.x * .05, c.y - n2.y * .05, h + .12), (d.x, d.y, 0), (0, 0, 1), (.14, .03, .14))
    for z in (.25, h - .22):
        cc = (p0 + p1) / 2 - n2 * .0
        part.box(M["fence"], (cc.x, cc.y, z), (d.x, d.y, 0), (0, 0, 1), (L_, .07, .035))


rnd_f = random.Random(3)


def build_fence(CY):
    f = Part("picket_fence", CY, line=True)
    L, R, Fr = LOT["left"], LOT["right"], LOT["front"]
    picket_run(f, (L, Fr), (L, HOUSE["y"] + 2.0))
    picket_run(f, (L, HOUSE["y"] + 2.0), (HOUSE["x0"], HOUSE["y"] + 2.0))
    picket_run(f, (L, Fr), (DRIVE[0] - .4, Fr))
    picket_run(f, (DRIVE[1] + .4, Fr), (R, Fr))
    picket_run(f, (R, Fr), (R, GAR["y"] + 3.0))
    picket_run(f, (GAR["x1"], GAR["y"] + 3.0), (R, GAR["y"] + 3.0))
    f.done(bev=.006)


# ------------------------------------------------------------------ grass: hair on the lawns + modelled big blades near the lens
EXCL = []


def excluded(x, y):
    for e in EXCL:
        if e[0] == "r" and e[1] <= x <= e[2] and e[3] <= y <= e[4]:
            return True
        if e[0] == "c" and (x - e[1]) ** 2 + (y - e[2]) ** 2 <= e[3] ** 2:
            return True
    return False


def grass_mat(name, root, tip, var, translucent=.25):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    N, L, b = nodes(m)
    b.inputs["Specular IOR Level"].default_value = .3
    b.inputs["Roughness"].default_value = .5
    return m


def blade_material():
    """near blades: root dark -> tip lit yellow-green along UV v, per-blade random tint (UV 'rnd'), soft mowing-stripe tone, translucency"""
    m = bpy.data.materials.new("grass_blades_near")
    m.use_nodes = True
    N, L, b = nodes(m)
    b.inputs["Specular IOR Level"].default_value = .32
    rvar(m, .42, .6, 8.0)
    uv = N.new("ShaderNodeUVMap")
    uv.uv_map = "UVMap"
    sp = N.new("ShaderNodeSeparateXYZ")
    L.new(uv.outputs["UV"], sp.inputs[0])
    ramp = N.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].color = lin(C["grass_root"])
    ramp.color_ramp.elements[1].color = lin(C["grass_tip"])
    ramp.color_ramp.elements[1].position = .85
    L.new(sp.outputs["Y"], ramp.inputs[0])
    ur = N.new("ShaderNodeUVMap")
    ur.uv_map = "rnd"
    sr = N.new("ShaderNodeSeparateXYZ")
    L.new(ur.outputs["UV"], sr.inputs[0])
    mx = N.new("ShaderNodeMix")
    mx.data_type = "RGBA"
    mx.inputs["B"].default_value = lin(C["grass_var"])
    mu = N.new("ShaderNodeMath")
    mu.operation = "MULTIPLY"
    mu.inputs[1].default_value = .45
    L.new(sr.outputs["X"], mu.inputs[0])
    L.new(mu.outputs[0], mx.inputs["Factor"])
    L.new(ramp.outputs[0], mx.inputs["A"])
    dk = N.new("ShaderNodeMix")
    dk.data_type = "RGBA"
    dk.blend_type = "MULTIPLY"
    dk.inputs["B"].default_value = lin("#7a9a6a")
    mu2 = N.new("ShaderNodeMath")
    mu2.operation = "MULTIPLY"
    mu2.inputs[1].default_value = .5
    L.new(sr.outputs["Y"], mu2.inputs[0])
    L.new(mu2.outputs[0], dk.inputs["Factor"])
    L.new(mx.outputs["Result"], dk.inputs["A"])
    L.new(dk.outputs["Result"], b.inputs["Base Color"])
    tr = N.new("ShaderNodeBsdfTranslucent")
    L.new(dk.outputs["Result"], tr.inputs["Color"])
    ms = N.new("ShaderNodeMixShader")
    ms.inputs[0].default_value = .22
    out = N["Material Output"]
    L.new(b.outputs[0], ms.inputs[1])
    L.new(tr.outputs[0], ms.inputs[2])
    L.new(ms.outputs[0], out.inputs["Surface"])
    m.diffuse_color = lin(C["grass_tip"])
    return m


def near_blades(CG):
    """modelled soft grass blades in the lens's near ground (dense at the lens, thinning with distance): tapered, bent, twisted strips"""
    cam = Vector(CAM["loc"])
    tgt = Vector(CAM["target"])
    fwd = (tgt - cam)
    fwd.z = 0
    fwd.normalize()
    rnd = random.Random(77)
    verts, faces, uvs, rnds = [], [], [], []
    segs = 5
    count = 0
    tries = 0
    MAXB = 70000
    while count < MAXB and tries < MAXB * 6:
        tries += 1
        r = 7.5 * math.sqrt(rnd.random())
        a = math.radians(rnd.uniform(-32, 32))
        d = Vector((fwd.x * math.cos(a) - fwd.y * math.sin(a), fwd.x * math.sin(a) + fwd.y * math.cos(a), 0))
        p = cam + d * (r + .3)
        if excluded(p.x, p.y) or not on_lawn(p.x, p.y):
            continue
        dens = max(.12, min(1.0, (8.0 - r) / 6.0))
        if rnd.random() > dens:
            continue
        near = max(0.0, 1 - r / 6.0)
        h = rnd.uniform(.07, .14) * (1 + .5 * near)
        w = rnd.uniform(.005, .009) * (1 + .35 * near)
        yaw = rnd.uniform(0, 2 * math.pi)
        lean = math.radians(rnd.uniform(4, 40))
        dl = Vector((math.cos(yaw), math.sin(yaw), 0))
        side = Vector((-dl.y, dl.x, 0))
        tw = rnd.uniform(-.6, .6)
        base = len(verts)
        rr = rnd.random()
        rr2 = rnd.random()
        for s in range(segs + 1):
            t = s / segs
            ang = lean * t * 1.3
            c = Vector((p.x, p.y, -.01)) + dl * (h * t * math.sin(ang)) + Vector((0, 0, h * t * math.cos(ang)))
            sd = side * math.cos(tw * t) + Vector((0, 0, 1)).cross(side) * math.sin(tw * t) * .3
            ww = w * (1 - t) ** .8 if s < segs else 0.0
            if s < segs:
                verts += [tuple(c - sd * ww / 2), tuple(c + sd * ww / 2)]
                uvs += [(0, t), (1, t)]
            else:
                verts.append(tuple(c))
                uvs.append((.5, 1))
            rnds += [(rr, rr2)] * (2 if s < segs else 1)
        for s in range(segs - 1):
            i = base + 2 * s
            faces.append((i, i + 1, i + 3, i + 2))
        i = base + 2 * (segs - 1)
        faces.append((i, i + 1, base + 2 * segs))
        count += 1
    me = bpy.data.meshes.new("grass_near_blades")
    me.from_pydata(verts, [], faces)
    uvl = me.uv_layers.new(name="UVMap")
    uvr = me.uv_layers.new(name="rnd")
    for poly in me.polygons:
        poly.use_smooth = True
        for li in poly.loop_indices:
            vi = me.loops[li].vertex_index
            uvl.data[li].uv = uvs[vi]
            uvr.data[li].uv = rnds[vi]
    me.materials.append(blade_material())
    o = bpy.data.objects.new("grass_near_blades", me)
    CG.objects.link(o)
    return count


def on_lawn(x, y):
    if LOT["left"] < x < DRIVE[0] - .02 and LOT["front"] < y < HOUSE["y"]:
        return True
    if DRIVE[1] + .02 < x < LOT["right"] and LOT["front"] < y < GAR["y"] + 3:
        return True
    if (KERB_Y < y < WALK[0]) and (x < DRIVE[0] - .6 or x > DRIVE[1] + .6) and x > SIDE["walk"][1] - 1.5:
        return True
    return False


def hair_lawn(CG):
    """the lawns as a grid with a density vertex group (0 under beds, stones, drive), hair grass 7-10 cm, dense near the lens"""
    cam = Vector(CAM["loc"])
    step = .25
    xs = [LOT["left"] + .1 + step * i for i in range(int((LOT["right"] - LOT["left"] - .2) / step) + 1)]
    ys = [KERB_Y + .05 + step * j for j in range(int((GAR["y"] + 3 - KERB_Y) / step) + 1)]
    nx = len(xs)
    vs = [(x, y, -.015) for y in ys for x in xs]
    fs = []
    for j in range(len(ys) - 1):
        for i in range(nx - 1):
            cx_, cy_ = xs[i] + step / 2, ys[j] + step / 2
            if on_lawn(cx_, cy_):
                fs.append((j * nx + i, j * nx + i + 1, (j + 1) * nx + i + 1, (j + 1) * nx + i))
    me = bpy.data.meshes.new("lawn_hair_emitter")
    me.from_pydata(vs, [], fs)
    o = bpy.data.objects.new("lawn_hair", me)
    CG.objects.link(o)
    me.materials.append(M["lawn"])
    vg = o.vertex_groups.new(name="dens")
    for v in me.vertices:
        x, y = v.co.x, v.co.y
        if excluded(x, y) or not on_lawn(x, y):
            continue
        dist = (Vector((x, y, 0)) - Vector((cam.x, cam.y, 0))).length
        vg.add([v.index], max(.35, min(1.0, 1.3 - dist / 30)), "REPLACE")
    area = len(fs) * step * step
    ps = o.modifiers.new("grass", "PARTICLE_SYSTEM").particle_system
    s = ps.settings
    s.type = "HAIR"
    s.count = int(area * 230)
    s.use_advanced_hair = True
    s.child_type = "INTERPOLATED"
    s.child_percent = 8
    s.rendered_child_count = 8
    s.child_length = 1.0
    s.child_length_threshold = .45
    s.clump_factor = .0
    s.roughness_1 = .025
    s.roughness_endpoint = .05
    s.root_radius = 1.0
    s.tip_radius = 0.0
    s.radius_scale = .007
    s.display_step = 2
    s.render_step = 3
    s.use_emit_random = True
    ps.vertex_group_density = "dens"
    ps.seed = 5
    hm = bpy.data.materials.new("lawn_hair_grass")
    hm.use_nodes = True
    N, L, b = nodes(hm)
    b.inputs["Roughness"].default_value = .55
    b.inputs["Specular IOR Level"].default_value = .28
    hi = N.new("ShaderNodeHairInfo")
    ramp = N.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].color = lin(C["grass_root"])
    ramp.color_ramp.elements[1].color = lin(C["grass_tip"])
    L.new(hi.outputs["Intercept"], ramp.inputs[0])
    rn = N.new("ShaderNodeMix")
    rn.data_type = "RGBA"
    rn.inputs["B"].default_value = lin(C["grass_var"])
    nz = N.new("ShaderNodeMath")
    nz.operation = "MULTIPLY"
    nz.inputs[1].default_value = .55
    L.new(hi.outputs["Random"], nz.inputs[0])
    L.new(nz.outputs[0], rn.inputs["Factor"])
    L.new(ramp.outputs[0], rn.inputs["A"])
    # mowing stripes: alternate 1.4 m bands a touch lighter / darker (world X)
    geo = N.new("ShaderNodeNewGeometry")
    wv = N.new("ShaderNodeTexWave")
    wv.bands_direction = "X"
    wv.wave_profile = "SAW"
    wv.inputs["Scale"].default_value = .07
    L.new(geo.outputs["Position"], wv.inputs["Vector"])
    gt = N.new("ShaderNodeMath")
    gt.operation = "GREATER_THAN"
    gt.inputs[1].default_value = .5
    L.new(wv.outputs["Fac"], gt.inputs[0])
    st = N.new("ShaderNodeMix")
    st.data_type = "RGBA"
    st.blend_type = "MULTIPLY"
    st.inputs["B"].default_value = lin("#d8e6c8")
    sm = N.new("ShaderNodeMath")
    sm.operation = "MULTIPLY"
    sm.inputs[1].default_value = .5
    L.new(gt.outputs[0], sm.inputs[0])
    L.new(sm.outputs[0], st.inputs["Factor"])
    L.new(rn.outputs["Result"], st.inputs["A"])
    L.new(st.outputs["Result"], b.inputs["Base Color"])
    me.materials.append(hm)
    s.material = 2
    s.hair_length = .085          # set LAST (lesson 2026-11-21: setting other factors after it rescales the length)
    return s.count * (1 + 8)


# ------------------------------------------------------------------ assets (Poly Haven CC0): tree, flowers, shrubs, gnome, sprinkler
SRC = {}


def load_asset(key, keep_mat_tweak=None):
    if key in SRC:
        return SRC[key]
    f = os.path.join(ASSETS, "models", key, key + ".gltf")
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=f)
    new = [o for o in bpy.data.objects if o not in before]
    srcc = coll("_SRC_assets")
    srcc.hide_render = True
    meshes = []
    for o in new:
        for c in list(o.users_collection):
            c.objects.unlink(o)
        if o.type == "MESH":
            mw = o.matrix_world.copy()
            o.parent = None
            o.matrix_world = mw
            srcc.objects.link(o)
            o.hide_render = True
            meshes.append(o)
        else:
            bpy.data.objects.remove(o)
    for o in meshes:
        for m in o.data.materials:
            if keep_mat_tweak and m and not m.get("tweaked"):
                keep_mat_tweak(m)
                m["tweaked"] = 1
    SRC[key] = meshes
    return meshes


def hsv_tweak(sat, val, mult=None, fac=.0):
    def f(m):
        N, L, b = nodes(m)
        if not b.inputs["Base Color"].links:
            return
        sock = b.inputs["Base Color"].links[0].from_socket
        hs = N.new("ShaderNodeHueSaturation")
        hs.inputs["Saturation"].default_value = sat
        hs.inputs["Value"].default_value = val
        L.new(sock, hs.inputs["Color"])
        out = hs.outputs[0]
        if mult:
            mx = N.new("ShaderNodeMix")
            mx.data_type = "RGBA"
            mx.blend_type = "MULTIPLY"
            mx.inputs["Factor"].default_value = fac
            mx.inputs["B"].default_value = lin(mult)
            L.new(out, mx.inputs["A"])
            out = mx.outputs["Result"]
        L.new(out, b.inputs["Base Color"])
        if "Sheen Weight" in b.inputs:
            b.inputs["Sheen Weight"].default_value = 0.0
    return f


def leaf_tweak(m):
    """leaves: lush saturated, lit tops yellow-green, very dark undersides (object-Z gradient), no sheen; bark untouched"""
    if "leaves" not in m.name:
        if "branches" not in m.name:
            return
        hsv_tweak(1.2, 1.0, C["leaf_lit"], .25)(m)
        return
    N, L, b = nodes(m)
    if not b.inputs["Base Color"].links:
        return
    sock = b.inputs["Base Color"].links[0].from_socket
    hs = N.new("ShaderNodeHueSaturation")
    hs.inputs["Saturation"].default_value = 1.4
    hs.inputs["Value"].default_value = 1.15
    hs.inputs["Hue"].default_value = .51
    L.new(sock, hs.inputs["Color"])
    mx = N.new("ShaderNodeMix")
    mx.data_type = "RGBA"
    mx.blend_type = "MULTIPLY"
    mx.inputs["Factor"].default_value = .35
    mx.inputs["B"].default_value = lin(C["leaf_lit"])
    L.new(hs.outputs[0], mx.inputs["A"])
    tc = N.new("ShaderNodeTexCoord")
    sp = N.new("ShaderNodeSeparateXYZ")
    L.new(tc.outputs["Object"], sp.inputs[0])
    mr = N.new("ShaderNodeMapRange")
    mr.inputs["From Min"].default_value = 1.2
    mr.inputs["From Max"].default_value = 2.9
    L.new(sp.outputs["Z"], mr.inputs["Value"])
    ramp = N.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].color = lin("#5a7a4a")
    ramp.color_ramp.elements[1].color = (1, 1, 1, 1)
    L.new(mr.outputs[0], ramp.inputs[0])
    dk = N.new("ShaderNodeMix")
    dk.data_type = "RGBA"
    dk.blend_type = "MULTIPLY"
    dk.inputs["Factor"].default_value = 1.0
    L.new(mx.outputs["Result"], dk.inputs["A"])
    L.new(ramp.outputs[0], dk.inputs["B"])
    L.new(dk.outputs["Result"], b.inputs["Base Color"])
    if "Sheen Weight" in b.inputs:
        b.inputs["Sheen Weight"].default_value = 0.0


TREE_INFO = {}


def tree_source():
    if TREE_INFO:
        return TREE_INFO
    src = load_asset("island_tree_02", leaf_tweak)[0]
    me = src.data
    bark = [i for i, m in enumerate(me.materials) if m and m.name.startswith("island_tree_02") and "leaves" not in m.name and "branches" not in m.name]
    mw = src.matrix_world
    pts = [mw @ v.co for v in me.vertices if v.co.z < 1e9]
    zmin = min(p.z for p in pts)
    zmax = max(p.z for p in pts)
    low = []
    bidx = set(bark)
    for poly in me.polygons:
        if poly.material_index in bidx:
            c = mw @ poly.center
            if c.z - zmin < .35:
                low.append(c)
    if low:
        cx = sum(p.x for p in low) / len(low)
        cy = sum(p.y for p in low) / len(low)
        rad = sum(math.hypot(p.x - cx, p.y - cy) for p in low) / len(low)
    else:
        cx, cy, rad = 0, 0, .15
    TREE_INFO.update({"src": src, "zmin": zmin, "h": zmax - zmin, "cx": cx, "cy": cy, "r": rad})
    return TREE_INFO


def place_tree(name, x, y, h, rot, col_):
    T = tree_source()
    k = h / T["h"]
    o = T["src"].copy()
    o.hide_render = False
    o.name = name
    R = Matrix.Rotation(math.radians(rot), 4, "Z")
    off = R @ Vector((T["cx"] * k, T["cy"] * k, 0))
    o.matrix_world = Matrix.Translation(Vector((x, y, -T["zmin"] * k)) - Vector((off.x, off.y, 0))) @ R @ Matrix.Scale(k, 4) @ T["src"].matrix_world
    col_.objects.link(o)
    # fuller crown (Rick: full leafy clumps): a second instance of the same mesh, turned 137 deg, 0.93 size, same trunk point
    o2 = T["src"].copy()
    o2.hide_render = False
    o2.name = name + "_fill"
    k2 = k * .93
    R2 = Matrix.Rotation(math.radians(rot + 137), 4, "Z")
    off2 = R2 @ Vector((T["cx"] * k2, T["cy"] * k2, 0))
    o2.matrix_world = Matrix.Translation(Vector((x, y, -T["zmin"] * k2 + .15)) - Vector((off2.x, off2.y, 0))) @ R2 @ Matrix.Scale(k2, 4) @ T["src"].matrix_world
    col_.objects.link(o2)
    return o, T["r"] * k


def scatter_asset(key, col_, pts, scale=(1, 1), tweak=None, name=None, pieces=None):
    srcs = load_asset(key, tweak)
    if pieces:
        srcs = [s for s in srcs if any(p in s.name for p in pieces)] or srcs
    rnd = random.Random(hash(key) % 1000)
    out = []
    for i, (x, y, z) in enumerate(pts):
        s = srcs[i % len(srcs)] if len(srcs) < 3 else rnd.choice(srcs)
        o = s.copy()
        o.hide_render = False
        o.name = (name or key) + "_%d" % i
        loc = s.matrix_world.to_translation()
        sc_ = rnd.uniform(*scale)
        o.matrix_world = Matrix.Translation(Vector((x, y, z))) @ Matrix.Rotation(rnd.uniform(0, 6.283), 4, "Z") @ Matrix.Scale(sc_, 4) @ \
            Matrix.Translation(-Vector((loc.x, loc.y, 0))) @ s.matrix_world
        col_.objects.link(o)
        out.append(o)
    return out


def build_plants(CY, beds, pots, flowers_boxes):
    rnd = random.Random(31)
    fl_tweak = hsv_tweak(1.3, 1.05)
    gaz, urs, per = [], [], []
    for bi, (xa, xb, ya, yb) in enumerate(beds):
        n = int((xb - xa) * (yb - ya) * 22)
        for k in range(n):
            x, y = rnd.uniform(xa + .1, xb - .1), rnd.uniform(ya + .08, yb - .1)
            if bi < 2 and y > yb - .55:
                continue
            (gaz, urs, per)[k % 3].append((x, y, .03))
    scatter_asset("flower_gazania", CY, gaz, (1.5, 2.0), fl_tweak, "flowers_gazania")
    scatter_asset("flower_ursinia", CY, urs, (1.3, 1.7), fl_tweak, "flowers_ursinia")
    scatter_asset("periwinkle_plant", CY, per, (1.2, 1.6), fl_tweak, "flowers_periwinkle")
    # foundation shrubs behind the flowers (house front), rounded, dark green
    sh = []
    for (xa, xb, ya, yb) in beds[:2]:
        x = xa + .45
        while x < xb - .3:
            sh.append((x, yb - .35, .0))
            x += 1.15
    scatter_asset("shrub_02", CY, sh, (.42, .5), hsv_tweak(1.25, 1.05, C["leaf_lit"], .15), "foundation_shrub")
    # tree-ring flowers and pot plants
    ring = []
    for k in range(16):
        t = 2 * math.pi * k / 16
        ring.append((TREE["x"] + math.cos(t) * .7, TREE["y"] + math.sin(t) * .7, .03))
    scatter_asset("periwinkle_plant", CY, ring, (1.3, 1.6), fl_tweak, "ring_periwinkle")
    scatter_asset("shrub_03", CY, pots, (1.3, 1.5), hsv_tweak(1.3, 1.05), "pot_plant")
    fb = []
    for (p, w) in flowers_boxes:
        for k in range(int(w / .18)):
            fb.append((p.x - w / 2 + .1 + k * .18, p.y, p.z))
    scatter_asset("flower_gazania", CY, fb, (1.3, 1.6), fl_tweak, "windowbox_flowers")


def birdhouse(CY, tree_obj, r_trunk):
    """red birdhouse with a cream gabled roof, round hole, perch, mounted on the trunk on the lens side at 2.3 m"""
    cam = Vector(CAM["loc"])
    tx, ty = TREE["x"], TREE["y"]
    d = Vector((cam.x - tx, cam.y - ty, 0)).normalized()
    z = 2.3
    origin = Vector((tx, ty, z)) + d * 3.0
    bpy.context.view_layer.update()
    dg = bpy.context.evaluated_depsgraph_get()
    hit, loc, nrm, idx, ob, mtx = bpy.context.scene.ray_cast(dg, origin, -d, distance=6.0)
    if hit and ob == tree_obj and (loc - Vector((tx, ty, z))).length < 1.2:
        base = loc + d * .01
    else:
        base = Vector((tx, ty, z)) + d * (r_trunk + .02)
    side = Vector((-d.y, d.x, 0))
    b = Part("birdhouse", CY, line=True)
    c = base + d * .13
    b.box(M["bird_roof"], base + d * .015 + Vector((0, 0, -.05)), side, (0, 0, 1), (.08, .5, .03))
    b.box(M["bird"], c, side, (0, 0, 1), (.2, .24, .2))
    for s in (-1, 1):
        rc = c + Vector((0, 0, .155)) + side * s * .065
        b.box(M["bird_roof"], rc, side * s * math.cos(.7) + Vector((0, 0, -math.sin(.7))), d, (.2, .26, .02))
    b.cyl(M["dark"], c + d * .101 + Vector((0, 0, .03)), d, .03, .005, 20)
    b.cyl(M["bird_roof"], c + d * .1 + Vector((0, 0, -.04)), d, .008, .07, 10)
    b.poly(M["bird"], [tuple(c + d * .1 + side * -.1 + Vector((0, 0, .12))), tuple(c + d * .1 + side * .1 + Vector((0, 0, .12))),
                       tuple(c + d * .1 + Vector((0, 0, .2))), tuple(c - d * .1 + side * -.1 + Vector((0, 0, .12))),
                       tuple(c - d * .1 + side * .1 + Vector((0, 0, .12))), tuple(c - d * .1 + Vector((0, 0, .2)))],
           [(0, 1, 2), (5, 4, 3)], (0, 2))
    b.done(bev=.006)
    return [round(v, 3) for v in c]


def build_far(CF):
    for (name, cx, cy, w, d, e, r, F, wall, shade, roof) in NEIGH:
        simple_house(CF, name, cx, cy, w, d, e, r, F, wall, roof)
    # corner street sign (invented names) + a fire-safe white hydrant-free corner: pole, two green blades with white letters
    s = Part("street_sign", CF, line=True)
    px, py = SIDE["walk"][0] - .5, KERB_Y + .4
    s.cyl(M["pole"], (px, py, 0), (0, 0, 1), .035, 2.9, 12)
    s.abox(M["sign"], px - .45, px + .45, py - .015, py + .015, 2.6, 2.8)
    s.abox(M["sign"], px - .015, px + .015, py - .45, py + .45, 2.83, 3.03)
    s.done(bev=.004)
    fA = Frame((px, py - .02, 0), (0, -1, 0))
    txt(CF, "LINDEN ST", fA.p(0, 2.7, .0), fA, .12, M["sign_txt"], .002)
    fB = Frame((px + .02, py, 0), (1, 0, 0))
    txt(CF, "MAPLE AVE", fB.p(0, 2.93, .0), fB, .12, M["sign_txt"], .002)


def simple_house(CF, name, cx, cy, w, d, e, r, F, wall, roof):
    """neighbour house: real clapboard on the street face, trims, windows with casings, door, shingle roof; lighter detail (far)"""
    F = Vector(F)
    fr = Frame(Vector((cx, cy, 0)) + F * (d / 2), F)
    wm = wood_grain(mat("wall_" + name, wall, (.45, .6)), "Y", .04)
    core = Part(name + "_core", CF)
    a = fr.U * (w / 2)
    dd = F * d
    O = fr.O
    core.box(wm, O - dd / 2 + Vector((0, 0, e / 2)), fr.U, (0, 0, 1), (w, e, d))
    gv = [tuple(O + a + Vector((0, 0, e)) - F * .0), tuple(O - a + Vector((0, 0, e))), tuple(O - a + Vector((0, 0, e)) - dd),
          tuple(O + a + Vector((0, 0, e)) - dd), tuple(O + Vector((0, 0, r)) - F * 0 + a * 0), tuple(O + Vector((0, 0, r)) - dd)]
    core.done()
    bo = Part(name + "_boards", CF)
    fr.boards(bo, wm, -w / 2, w / 2, .25, e, exp=.19, holes=[(-.5, .5, 0, 2.2)])
    bo.done()
    t = Part(name + "_trim", CF, line=True)
    gl = Part(name + "_glass", CF)
    for u in (-w / 2 + 1.3, -w / 2 + 2.9, w / 2 - 2.9, w / 2 - 1.3):
        window(t, gl, fr, u, 1.6, .95, 1.3, 2, 3)
    fr.box(t, M["trim"], -.6, -.5, 0, 2.25, 0, .07)
    fr.box(t, M["trim"], .5, .6, 0, 2.25, 0, .07)
    fr.box(t, M["trim"], -.65, .65, 2.2, 2.35, 0, .08)
    fr.box(t, M["trim"], -w / 2, -w / 2 + .14, .25, e, 0, .05)
    fr.box(t, M["trim"], w / 2 - .14, w / 2, .25, e, 0, .05)
    fr.box(t, M["trim"], -w / 2, w / 2, e - .2, e, 0, .05)
    fr.box(t, M["step"], -w / 2, w / 2, 0, .25, -.02, .03)
    fr.box(t, M["step"], -.8, .8, 0, .36, 0, .9)
    t.done(bev=.008)
    gl.done()
    dm = mat("door_" + name, "#ffffff" if wall < "#c" else "#3a6fb0", (.2, .3), spec=.5, coat=.4)
    dp = Part(name + "_door", CF, line=True)
    fr.box(dp, dm, -.5, .5, .36, 2.2, -.03, .01)
    dp.done(bev=.005)
    rm = brick_mat("roof_" + name, roof, "#2e3244", .34, .2, (.75, .92), .008, .35)
    ro = Part(name + "_roof", CF)
    # side-gabled roof along the facade (ridge parallel to U)
    pitch = math.atan2(r - e, d / 2)
    sl = math.hypot(d / 2, r - e) + .45
    for s in (-1, 1):
        down = (F * (-s) * -1) * math.cos(pitch) + Vector((0, 0, -math.sin(pitch)))
        down = (F if s == 1 else -F) * math.cos(pitch) + Vector((0, 0, -math.sin(pitch)))
        top = O - dd / 2 + Vector((0, 0, r + .08))
        ro.box(rm, top + down * (sl / 2), fr.U, down, (w + .7, sl, .12))
    ro.done(bev=.006)
    gab = Part(name + "_gables", CF)
    for sgn in (-1, 1):
        base = O - dd / 2 + a * sgn
        gab.poly(wm, [tuple(base + F * (d / 2) + Vector((0, 0, e))), tuple(base - F * (d / 2) + Vector((0, 0, e))), tuple(base + Vector((0, 0, r)))],
                 [(0, 1, 2) if sgn > 0 else (2, 1, 0)], (0, 2))
    gab.done()


# ------------------------------------------------------------------ build
def build():
    global LINE
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.unit_settings.system = "METRIC"
    root = coll("SET_style_test")
    LINE = coll("Line")
    CH, CG, CY, CT, CF = (coll(n, root) for n in ("SET_house", "SET_ground", "SET_yard", "SET_tree", "SET_far"))
    make_materials()
    flowers = build_house(CH)
    build_garage(CH)
    pots = build_porch(CH, flowers)
    build_ground(CG)
    stones = build_stones(CY)
    beds = build_beds(CY)
    build_fence(CY)
    # exclusions for grass: beds, stones, tree ring, porch, house fronts
    for (xa, xb, ya, yb) in beds:
        EXCL.append(("r", xa - .1, xb + .1, ya - .12, yb + .1))
    for p in stones:
        EXCL.append(("c", p.x, p.y, .36))
    EXCL.append(("c", TREE["x"], TREE["y"], 1.2))
    EXCL.append(("r", PORCH["x0"], PORCH["x1"], PORCH["y0"] - .7, HOUSE["y"] + 1))
    EXCL.append(("r", HOUSE["x0"] - .1, HOUSE["x1"], HOUSE["y"] - .05, 40))
    EXCL.append(("r", GAR["x0"], GAR["x1"] + .5, GAR["y"] - .1, 40))
    n_blades = near_blades(CG)
    n_hair = hair_lawn(CG)
    tree, rt = place_tree("hero_tree", TREE["x"], TREE["y"], TREE["h"], TREE["rot"], CT)
    bh = birdhouse(CY, tree, rt)
    for i, (x, y, h, rot) in enumerate(FAR_TREES):
        place_tree("far_tree_%02d" % i, x, y, h, rot, CF)
    build_plants(CY, beds, pots, flowers)
    gn = scatter_asset("garden_gnome", CY, [(GNOME[0], GNOME[1], .0)], (1.0, 1.0), hsv_tweak(1.35, 1.1), "garden_gnome")
    gn[0].rotation_euler.z = math.radians(-35)
    sp = scatter_asset("garden_sprinkler_01", CY, [(SPRINKLER[0], SPRINKLER[1], .0)], (1.2, 1.2), hsv_tweak(1.2, 1.05), "garden_sprinkler")
    for o in gn + sp:
        LINE.objects.link(o)
    build_far(CF)
    # hedge behind the right fence and along the side street lots (real shrubs, far)
    hedge = [(LOT["right"] + .9, y, 0) for y in [-8 + 1.3 * k for k in range(14)]]
    scatter_asset("shrub_02", CF, hedge, (.55, .7), hsv_tweak(1.2, 1.0, C["leaf_lit"], .15), "hedge_right")
    # root transform onto LAYOUT.json + marker empties at the LAYOUT keys (world points)
    rootc = bpy.context.scene.collection.children["SET_style_test"]
    root = bpy.data.objects.new("set_root", None)
    rootc.objects.link(root)
    root.matrix_world = ROOTM
    for o in list(bpy.context.scene.objects):
        if o is root or o.parent is not None:
            continue
        mw = o.matrix_world.copy()
        o.parent = root
        o.matrix_parent_inverse = Matrix.Identity(4)
        o.matrix_basis = mw
    marks = {"house": (( HOUSE["x0"] + HOUSE["x1"]) / 2, HOUSE["y"]), "garage": (0, GAR["y"]), "tree": (TREE["x"], TREE["y"]),
             "drive": (0, -6.6), "car_spot": (0, -.6)}
    for k, (x, y) in marks.items():
        e = bpy.data.objects.new("mark_" + k, None)
        rootc.objects.link(e)
        e.parent = root
        e.location = (x, y, 0)
        e.rotation_euler.z = 0
    # numbers
    bpy.context.view_layer.update()
    dg = bpy.context.evaluated_depsgraph_get()
    uniq, inst = 0, 0
    seen = set()
    per = {}
    for o in bpy.context.scene.objects:
        if o.type != "MESH" or o.hide_render or any(c.name == "_SRC_assets" for c in o.users_collection):
            continue
        ev = o.evaluated_get(dg)
        n = sum(len(p.vertices) - 2 for p in ev.data.polygons)
        inst += n
        key = o.data.name if not o.modifiers else o.name
        if key not in seen:
            seen.add(key)
            uniq += n
        top = [c.name for c in o.users_collection if c.name.startswith("SET_")]
        per[top[0] if top else "other"] = per.get(top[0] if top else "other", 0) + n
    meta = {
        "units": "metres, Z up, origin = car spot on the driveway centre",
        "camera_world": CAM_W, "camera_local": CAM, "root_matrix_world": [list(r) for r in ROOTM],
        "anchors_frame": "LOCAL (driveway along +Y); world = root_matrix_world @ local",
        "anchors_world": {k: [round(v, 3) for v in (ROOTM @ Vector((x, y, 0)))] for k, (x, y) in marks.items()},
        "anchors": {"car_spot": [0, -.6, 0], "drive": DRIVE, "garage_door_centre": [0, GAR["y"], GAR["dh"] / 2],
                    "front_door": [DOOR_X, HOUSE["y"], .54 + 1.05], "porch_top": [DOOR_X, HOUSE["y"] - .4, PORCH["h"]],
                    "tree_trunk": [TREE["x"], TREE["y"], 0], "tree_height": TREE["h"], "birdhouse": bh,
                    "gnome": list(GNOME), "sprinkler": list(SPRINKLER), "kerb_y": KERB_Y, "lawn_right": [DRIVE[1], LOT["right"]],
                    "lawn_left": [LOT["left"], DRIVE[0]], "lot_front_fence_y": LOT["front"]},
        "triangles_rendered_incl_instances": inst, "triangles_unique": uniq, "tris_per_collection": per,
        "near_blades": n_blades, "hair_strands_incl_children": n_hair, "objects": len(bpy.context.scene.objects),
        "build_s": round(time.time() - t0, 1),
    }
    json.dump(meta, open(os.path.join(SETDIR, "set_meta.json"), "w"), indent=1)
    try:
        bpy.ops.file.make_paths_relative()
    except Exception:
        pass
    tmp = os.path.join(SETDIR, "set.tmp.blend")
    bpy.ops.wm.save_as_mainfile(filepath=tmp, compress=True)
    os.replace(tmp, os.path.join(SETDIR, "set.blend"))
    print("SET_BUILT", json.dumps({k: meta[k] for k in ("triangles_rendered_incl_instances", "triangles_unique", "near_blades",
                                                        "hair_strands_incl_children", "objects", "build_s")}))


# ------------------------------------------------------------------ preview light + cameras for the proof sheet only (never saved into set.blend)
def sheet(outdir):
    bpy.ops.wm.open_mainfile(filepath=os.path.join(SETDIR, "set.blend"))
    sc = bpy.context.scene
    LT = json.load(open(os.path.join(ROOT, "templates", "blender_look", "rick_light.json")))["day"]
    w = bpy.data.worlds.new("preview_sky")
    sc.world = w
    w.use_nodes = True
    N, L = w.node_tree.nodes, w.node_tree.links
    bg_lit = N["Background"]
    bg_cam = N.new("ShaderNodeBackground")
    lp = N.new("ShaderNodeLightPath")
    mix = N.new("ShaderNodeMixShader")
    tc = N.new("ShaderNodeTexCoord")
    sp = N.new("ShaderNodeSeparateXYZ")
    L.new(tc.outputs["Generated"], sp.inputs[0])
    mr = N.new("ShaderNodeMapRange")
    mr.inputs["From Max"].default_value = .35
    L.new(sp.outputs["Z"], mr.inputs["Value"])
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
    sd = bpy.data.lights.new("preview_sun", "SUN")
    sd.energy = LT["sun"]
    sd.angle = math.radians(LT["sun_angle_deg"])
    sd.color = lin(LT["sun_col"])[:3]
    so = bpy.data.objects.new("preview_sun", sd)
    sc.collection.objects.link(so)
    el = math.radians(LT["sun_el"])
    sl = LAY.get("sun", {})
    if sl:
        el = math.radians(sl.get("elevation_deg", 45))
    hd = Vector(tuple(sl.get("to_sun_xy", (.5, -.87))) + (0,)).normalized()
    to_sun = Vector((hd.x * math.cos(el), hd.y * math.cos(el), math.sin(el)))
    so.rotation_euler = (-to_sun).to_track_quat("-Z", "Y").to_euler()
    sc.render.engine = "CYCLES"
    sc.cycles.device = "CPU"
    sc.cycles.samples = int(os.environ.get("SPP", "16"))
    sc.cycles.use_denoising = True
    sc.cycles.max_bounces = 6
    sc.view_settings.view_transform = "Standard"
    sc.view_settings.look = "None"
    sc.render.film_transparent = False
    sc.render.threads_mode = "FIXED"
    sc.render.threads = int(os.environ.get("THREADS", "3"))

    def cam(name, loc, tgt, lens, rx, ry):
        cd = bpy.data.cameras.new(name)
        cd.lens = lens
        cd.sensor_width = 36
        cd.sensor_fit = "VERTICAL" if ry > rx else "HORIZONTAL"
        cd.clip_start = .05
        cd.clip_end = 600
        co = bpy.data.objects.new(name, cd)
        sc.collection.objects.link(co)
        co.location = loc
        co.rotation_euler = (Vector(tgt) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
        sc.camera = co
        sc.render.resolution_x, sc.render.resolution_y = rx, ry
        sc.render.resolution_percentage = 100
    shots = [("key", CAM_W["loc"], CAM_W["target"], CAM_W["lens"], 540, 960),
             ("overview", tuple(ROOTM @ Vector((19.0, -24.0, 14.0))), tuple(ROOTM @ Vector((-4.0, 4.0, 1.5))), 24.0, 1000, 562)]
    want = os.environ.get("SHOTS", "key,overview").split(",")
    for (n, loc, tgt, lens, rx, ry) in shots:
        if n not in want:
            continue
        cam(n, loc, tgt, lens, rx, ry)
        sc.render.filepath = os.path.join(outdir, n + ".png")
        t1 = time.time()
        bpy.ops.render.render(write_still=True)
        print("SET_RENDERED", n, round(time.time() - t1, 1), "s")


if MODE == "build":
    build()
elif MODE == "sheet":
    os.makedirs(argv[2], exist_ok=True)
    sheet(os.path.abspath(argv[2]))
