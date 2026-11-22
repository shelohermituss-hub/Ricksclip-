# pe_look.py: shared look-finisher helpers for the plane-eater LOOK CARD (runs inside Blender). Method of episodes/_style_test/look/assemble.py
# (the library model): cast cards as self-lit upright cards turned about Z only, a sun-facing shadow card per card, soft contact patches,
# held 3D props at the fists with a fist overlay card in front, the outline id pass (rick_outline/lines_key.py) and the cast mask pass (Object Index 1).
import bpy, os, sys, json, math, time
from mathutils import Vector, Matrix
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); EP = os.path.normpath(os.path.join(HERE, '..')); ROOT = os.path.normpath(os.path.join(EP, '..', '..'))
sys.path.append(os.path.join(ROOT, 'templates', 'blender_look', 'rick_outline')); import lines_key as LK
CJ = json.load(open(os.path.join(HERE, 'cards', 'cards.json')))
PROPS2 = os.path.join(EP, 'props', 'out', 'props2.blend')
CAST, SHADOWS, HIDE = [], [], []


def lin(h):
    h = h.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple([(x / 12.92 if x <= .04045 else ((x + .055) / 1.055) ** 2.4) for x in c] + [1.0])


def camera(sc, pos, aim, lens, sensor=36.0, roll=0.0):
    cd = bpy.data.cameras.new('look_cam'); cd.lens = lens; cd.sensor_width = sensor; cd.sensor_fit = 'AUTO'; cd.clip_start = .03; cd.clip_end = 3000
    co = bpy.data.objects.new('look_cam', cd); sc.collection.objects.link(co); co.location = pos
    q = (Vector(aim) - Vector(pos)).to_track_quat('-Z', 'Y'); co.rotation_euler = q.to_euler()
    if roll: co.rotation_euler.rotate_axis('Z', math.radians(roll))
    sc.camera = co; return co


def card_mat(name, img, strength):
    m = bpy.data.materials.new(name); m.use_nodes = True; N, L = m.node_tree.nodes, m.node_tree.links
    for n in list(N): N.remove(n)
    tx = N.new('ShaderNodeTexImage'); tx.image = img; tx.interpolation = 'Cubic'
    em = N.new('ShaderNodeEmission'); L.new(tx.outputs['Color'], em.inputs['Color']); em.inputs['Strength'].default_value = strength
    tr = N.new('ShaderNodeBsdfTransparent'); mx = N.new('ShaderNodeMixShader'); L.new(tx.outputs['Alpha'], mx.inputs['Fac']); L.new(tr.outputs[0], mx.inputs[1]); L.new(em.outputs[0], mx.inputs[2])
    out = N.new('ShaderNodeOutputMaterial'); L.new(mx.outputs[0], out.inputs['Surface']); return m


def card_mesh(name, c, mpp):
    W, H = c['size_px']; fx, fy = c['foot_point_px']
    me = bpy.data.meshes.new(name); x0, x1, z0, z1 = -fx * mpp, (W - fx) * mpp, (fy - H) * mpp, fy * mpp
    me.from_pydata([(x0, 0, z0), (x1, 0, z0), (x1, 0, z1), (x0, 0, z1)], [], [(0, 1, 2, 3)])
    uv = me.uv_layers.new(name='UVMap')
    for li, (u, v) in enumerate([(0, 0), (1, 0), (1, 1), (0, 1)]): uv.data[li].uv = (u, v)
    return me


def yaw_to(o_loc, cam_loc):
    tc = Vector(cam_loc) - Vector(o_loc); tc.z = 0; return math.atan2(tc.y, tc.x) + math.pi / 2


def add_card(sc, cid, loc, cam_loc, to_sun_xy, strength=1.0, shadow=True, img_override=None, name=None):
    c = CJ[cid]; mpp = c['m_per_px']; img = img_override or bpy.data.images.load(os.path.join(HERE, 'cards', c['file'])); img.alpha_mode = 'STRAIGHT'
    nm = name or cid; me = card_mesh('card_' + nm, c, mpp); me.materials.append(card_mat('cardmat_' + nm, img, strength))
    o = bpy.data.objects.new('CARD_' + nm, me); sc.collection.objects.link(o); o.location = loc; o.rotation_euler = (0, 0, yaw_to(loc, cam_loc))
    o.pass_index = 1; o.visible_diffuse = False; o.visible_shadow = False; o.visible_glossy = False; CAST.append(o)
    if shadow:
        sh = o.copy(); sh.name = 'SHADOWCARD_' + nm; sc.collection.objects.link(sh); sh.rotation_euler = (0, 0, math.atan2(to_sun_xy[1], to_sun_xy[0]) + math.pi / 2)
        sh.visible_camera = False; sh.visible_glossy = False; sh.visible_diffuse = False; sh.visible_transmission = False; sh.visible_shadow = True; SHADOWS.append(sh)
    bpy.context.view_layer.update(); return o


def card_pt(o, cid, px, toward=None, d=0.0):
    c = CJ[cid]; fx, fy = c['foot_point_px']; mpp = c['m_per_px']
    p = o.matrix_world @ Vector(((px[0] - fx) * mpp, 0, (fy - px[1]) * mpp))
    if toward is not None: p = p + (Vector(toward) - p).normalized() * d
    return p


def place_card_hand(cid, hand, target, cam_loc):
    """foot location so that the card's fist `hand` lands on the 3D point target (card turned to the lens about Z)."""
    c = CJ[cid]; fx, fy = c['foot_point_px']; mpp = c['m_per_px']; hx, hy = c['hands_px'][hand]
    loc = Vector(target).copy()
    for _ in range(6):
        yaw = yaw_to(loc, cam_loc); R = Matrix.Rotation(yaw, 3, 'Z'); off = R @ Vector(((hx - fx) * mpp, 0, (fy - hy) * mpp))
        loc = Vector(target) - off
    return loc


def fist_overlay(sc, card_obj, cid, hands, cam_loc, d=0.06):
    """the card's fists cut from its own picture, a hair nearer the lens (same size on screen): fists close over the 3D props."""
    c = CJ[cid]; img = card_obj.data.materials[0].node_tree.nodes['Image Texture'].image; W, H = img.size
    px = np.array(img.pixels[:], dtype=np.float32).reshape(H, W, 4); yy, xx = np.mgrid[0:H, 0:W]; keep = np.zeros((H, W), bool); fr = c['fist_radius_px'] + 3
    for h in hands:
        hx, hy = c['hands_px'][h]; keep |= (xx - hx) ** 2 + ((H - 1 - yy) - hy) ** 2 <= fr * fr
    fp = px.copy(); fp[..., 3] *= keep; fimg = bpy.data.images.new('fists_' + cid, W, H, alpha=True); fimg.pixels[:] = fp.ravel(); fimg.alpha_mode = 'STRAIGHT'; fimg.pack()
    me = card_mesh('card_fists_' + cid, c, c['m_per_px']); me.materials.append(card_mat('cardmat_fists_' + cid, fimg, card_obj.data.materials[0].node_tree.nodes['Emission'].inputs['Strength'].default_value))
    fo = bpy.data.objects.new('CARD_fists_' + cid, me); sc.collection.objects.link(fo); fo.matrix_world = card_obj.matrix_world.copy()
    C = Vector(cam_loc); s = ((card_obj.location - C).length - d) / (card_obj.location - C).length
    fo.location = C + (card_obj.location - C) * s; fo.scale = (s, s, s)
    fo.pass_index = 1; fo.visible_diffuse = False; fo.visible_shadow = False; fo.visible_glossy = False; CAST.append(fo); return fo


def contact(sc, loc, rad, dark, sq=.5, name='c'):
    bpy.ops.mesh.primitive_circle_add(vertices=48, radius=rad, fill_type='TRIFAN', location=Vector(loc) + Vector((0, 0, .006)))
    cp = bpy.context.object; cp.name = 'CONTACT_' + name; cp.scale.y = sq
    pm = bpy.data.materials.new('contact_' + name); pm.use_nodes = True; N, L = pm.node_tree.nodes, pm.node_tree.links
    for n in list(N): N.remove(n)
    gc = N.new('ShaderNodeTexGradient'); gc.gradient_type = 'SPHERICAL'; tc_ = N.new('ShaderNodeTexCoord'); mp = N.new('ShaderNodeMapping')
    mp.inputs['Scale'].default_value = (1 / rad, 1 / rad, 1); L.new(tc_.outputs['Object'], mp.inputs['Vector']); L.new(mp.outputs['Vector'], gc.inputs['Vector'])
    pw = N.new('ShaderNodeMath'); pw.operation = 'POWER'; pw.inputs[1].default_value = 1.8; L.new(gc.outputs['Fac'], pw.inputs[0])
    mul = N.new('ShaderNodeMath'); mul.operation = 'MULTIPLY'; mul.inputs[1].default_value = dark; L.new(pw.outputs[0], mul.inputs[0])
    dk = N.new('ShaderNodeBsdfDiffuse'); dk.inputs['Color'].default_value = (0.015, 0.016, 0.03, 1); trn = N.new('ShaderNodeBsdfTransparent')
    mx2 = N.new('ShaderNodeMixShader'); L.new(mul.outputs[0], mx2.inputs['Fac']); L.new(trn.outputs[0], mx2.inputs[1]); L.new(dk.outputs[0], mx2.inputs[2])
    o2 = N.new('ShaderNodeOutputMaterial'); L.new(mx2.outputs[0], o2.inputs['Surface']); cp.data.materials.append(pm); cp.visible_shadow = False
    HIDE.append(cp); return cp


def prop(sc, coll_name, loc, rot=(0, 0, 0), scale=1.0, blend=PROPS2):
    """append one props-hero collection (objects at the grip origin), parent them to an empty, place the empty."""
    with bpy.data.libraries.load(blend, link=False) as (src, dst): dst.collections = [coll_name]
    c = dst.collections[0]; sc.collection.children.link(c)
    e = bpy.data.objects.new('PROP_' + coll_name, None); sc.collection.objects.link(e)
    for o in c.all_objects:
        if o.parent is None: o.parent = e
    e.location = loc; e.rotation_euler = rot; e.scale = (scale, scale, scale); bpy.context.view_layer.update(); return e, c


def dapple(sc, centre, size, to_sun, height=7.0, seed=3, density=.5, scale=2.2):
    """a hidden leaf canopy that only casts shadows (a soft leaf dapple on the ground from 'the nearest tree'), never seen by the lens."""
    c = Vector(centre) + Vector(to_sun).normalized() * (height / max(Vector(to_sun).normalized().z, .2))
    bpy.ops.mesh.primitive_plane_add(size=size, location=c); p = bpy.context.object; p.name = 'DAPPLE_canopy'
    m = bpy.data.materials.new('dapple'); m.use_nodes = True; N, L = m.node_tree.nodes, m.node_tree.links
    for n in list(N): N.remove(n)
    nz = N.new('ShaderNodeTexVoronoi'); nz.inputs['Scale'].default_value = scale; nz.feature = 'F1'
    nz2 = N.new('ShaderNodeTexNoise'); nz2.inputs['Scale'].default_value = 1.2; nz2.inputs['Detail'].default_value = 3
    mr = N.new('ShaderNodeMapRange'); mr.inputs[1].default_value = density - .08; mr.inputs[2].default_value = density + .08
    ad = N.new('ShaderNodeMath'); ad.operation = 'ADD'; L.new(nz.outputs['Distance'], ad.inputs[0]); mu = N.new('ShaderNodeMath'); mu.operation = 'MULTIPLY'; mu.inputs[1].default_value = .35
    L.new(nz2.outputs['Fac'], mu.inputs[0]); L.new(mu.outputs[0], ad.inputs[1]); L.new(ad.outputs[0], mr.inputs[0])
    tr = N.new('ShaderNodeBsdfTransparent'); df = N.new('ShaderNodeBsdfDiffuse'); df.inputs['Color'].default_value = (.05, .08, .03, 1)
    mx = N.new('ShaderNodeMixShader'); L.new(mr.outputs[0], mx.inputs['Fac']); L.new(df.outputs[0], mx.inputs[1]); L.new(tr.outputs[0], mx.inputs[2])
    o = N.new('ShaderNodeOutputMaterial'); L.new(mx.outputs[0], o.inputs['Surface']); p.data.materials.append(m)
    p.visible_camera = False; p.visible_diffuse = False; p.visible_glossy = False; p.visible_transmission = False; HIDE.append(p); return p


def render_setup(sc, W=540, H=960, spp=24, expo=None, bounces=6):
    r = sc.render; r.engine = 'CYCLES'; sc.cycles.device = 'CPU'; r.resolution_x, r.resolution_y, r.resolution_percentage = W, H, 100
    r.image_settings.file_format = 'PNG'; r.image_settings.color_mode = 'RGB'; r.image_settings.color_depth = '16'
    sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'None'
    if expo is not None: sc.view_settings.exposure = expo
    sc.cycles.samples = spp; sc.cycles.use_denoising = True; sc.cycles.denoiser = 'OPENIMAGEDENOISE'; sc.cycles.use_adaptive_sampling = True
    sc.cycles.max_bounces = bounces; sc.cycles.transparent_max_bounces = 24; sc.cycles.caustics_reflective = False; sc.cycles.caustics_refractive = False
    sc.cycles.blur_glossy = .5; r.film_transparent = False; r.use_motion_blur = False
    if os.environ.get('THREADS'): r.threads_mode = 'FIXED'; r.threads = int(os.environ['THREADS'])
    vl = bpy.context.view_layer; vl.use_pass_object_index = True
    tree = bpy.data.node_groups.new('pe_comp', 'CompositorNodeTree'); sc.compositing_node_group = tree; N, L = tree.nodes, tree.links
    rl = N.new('CompositorNodeRLayers'); fo = N.new('CompositorNodeOutputFile'); fo.file_name = 'pass_'
    fo.format.media_type = 'IMAGE'; fo.format.file_format = 'PNG'; fo.format.color_depth = '16'; fo.format.color_mode = 'BW'; fo.save_as_render = False
    fo.file_output_items.new('FLOAT', 'mask')
    idm = N.new('CompositorNodeIDMask'); idm.inputs['Index'].default_value = 1; idm.inputs['Anti-Alias'].default_value = True
    L.new(rl.outputs['Object Index'], idm.inputs[0]); L.new(idm.outputs[0], fo.inputs['mask'])
    go = N.new('NodeGroupOutput'); tree.interface.new_socket('Image', in_out='OUTPUT', socket_type='NodeSocketColor'); L.new(rl.outputs['Image'], go.inputs[0])
    return fo


def screen(sc, p):
    from bpy_extras.object_utils import world_to_camera_view as w2c
    v = w2c(sc, sc.camera, Vector(p)); return [round(v.x, 3), round(1 - v.y, 3), round(v.z, 2)]


def down_angle(sc, card):
    """degrees the lens looks DOWN at the card's chest (CB 2026-11-12 rule: at most 10)."""
    c = CJ[[k for k in CJ if 'CARD_' + k == card.name][0]] if any('CARD_' + k == card.name for k in CJ) else None
    chest = card.location + Vector((0, 0, (c['height_m'] if c else 1.6) * .72)); d = chest - sc.camera.location
    return round(math.degrees(math.atan2(-d.z, d.xy.length)), 1)


def go(sc, out_png, fo, line_objs):
    LK.setup(sc, line_objs, CAST + SHADOWS + HIDE)
    od = os.path.dirname(os.path.abspath(out_png)); base = os.path.splitext(os.path.basename(out_png))[0]
    fo.directory = od + '/' + base + '_'
    sc.render.filepath = out_png; t0 = time.time(); bpy.ops.render.render(write_still=True); print('RENDER_SECONDS %.1f' % (time.time() - t0), flush=True)
    LK.render(sc, os.path.join(od, base + '_lines_id.png')); print('DONE', out_png, flush=True)


def bounce_grey(m, sat=.2):
    """what a surface gives as bounce light is greyed (camera rays keep the full colour): shadows on white stay blue-violet, not lawn-green
    (from _style_test/look/assemble.py lawn_bounce)."""
    if not m or not m.use_nodes or m.node_tree.nodes.get('pe_bounce'): return
    nt = m.node_tree
    for b in [n for n in nt.nodes if n.type in ('BSDF_PRINCIPLED', 'BSDF_DIFFUSE')]:
        ci = b.inputs['Base Color'] if 'Base Color' in b.inputs else b.inputs['Color']
        hs = nt.nodes.new('ShaderNodeHueSaturation'); hs.name = 'pe_bounce'
        lp_ = nt.nodes.new('ShaderNodeLightPath'); mm = nt.nodes.new('ShaderNodeMapRange'); mm.inputs[3].default_value = sat; mm.inputs[4].default_value = 1.0
        nt.links.new(lp_.outputs['Is Camera Ray'], mm.inputs[0]); nt.links.new(mm.outputs[0], hs.inputs['Saturation'])
        if ci.links: nt.links.new(ci.links[0].from_socket, hs.inputs['Color'])
        else: hs.inputs['Color'].default_value = ci.default_value
        nt.links.new(hs.outputs['Color'], ci)


def cam_inside(sc, cam_loc, pad=0.0):
    """names of meshes whose world bounding box holds the lens point (CB_RULES section 8: camera never inside geometry)."""
    hit = []
    for o in sc.objects:
        if o.type != 'MESH' or o.hide_render or not o.visible_camera: continue
        bb = [o.matrix_world @ Vector(c) for c in o.bound_box]
        lo = Vector((min(v.x for v in bb), min(v.y for v in bb), min(v.z for v in bb))); hi = Vector((max(v.x for v in bb), max(v.y for v in bb), max(v.z for v in bb)))
        if all(lo[i] - pad <= cam_loc[i] <= hi[i] + pad for i in range(3)) and (hi - lo).length < 30: hit.append(o.name)
    return hit
