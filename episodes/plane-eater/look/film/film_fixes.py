# film_fixes.py: per-stretch fixes in Blender of what the kit could not draw (stretches.json "fix"). Called by film_lock.py after the lock is built.
import bpy, random, math
from mathutils import Vector

def salt_grains(sc, cfg, K, n=55, f0=0, f1=60):
    """a falling stream of salt from the shaker cap down to the wing top on f0-f1 (kit: additive sprites, not in the lock): small glinting
    cubes keyed per frame, each falling 0.0-0.3 m below the cap on its own phase; hidden outside the pour."""
    e = K['PROPS'].get(('michel', 'salt_shaker'))
    if not e: return
    e = e[0]; gm = bpy.data.materials.new('salt_grain_film'); gm.use_nodes = True; b = gm.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (1, 1, 1, 1); b.inputs['Roughness'].default_value = .15; b.inputs['Emission Color'].default_value = (1, 1, 1, 1); b.inputs['Emission Strength'].default_value = 1.2
    rnd = random.Random(4); G = []
    for i in range(n):
        bpy.ops.mesh.primitive_cube_add(size=.009, location=(0, 0, 0)); g = bpy.context.object; g.name = 'salt_fall_%02d' % i; g.data.materials.append(gm); g.visible_shadow = False
        G.append((g, rnd.random(), rnd.gauss(0, 1), rnd.gauss(0, 1)))
    for f in range(f0, f1 + 2):
        sc.frame_set(min(f, f1)); cap = e.matrix_world @ Vector((0, 0, .075))
        for g, ph, gx, gy in G:
            t = ((f / 9.0) + ph) % 1.0; fall = t * max(cap.z - 2.0, .12)
            g.location = (cap.x + gx * (.006 + .02 * t), cap.y + gy * (.006 + .02 * t), cap.z - fall); g.hide_render = f > f1
            g.keyframe_insert('location', frame=f); g.keyframe_insert('hide_render', frame=f)
    sc['salt_grains'] = n

def apply(sc, cfg, K):
    for name in cfg.get('fix', []):
        fn = globals().get(name)
        if fn: fn(sc, cfg, K); print('FIX', name)

# ---------------- S1 frame 0-72: the salting fist over the wing tip (the kit clamps it at his chin from this high lens)
SALT = dict(f0=0, f_hold=54, f1=72, P=(4.86, -1.2, 2.14))   # over the wing-tip top (tip end x 5.09, chord y -1.68..-0.61, top z 1.99)

def _ray_plane(cam, scr, z, sc):
    """world point where the lens ray through screen (x right, y down, 0-1) meets the plane Z = z"""
    from bpy_extras.object_utils import world_to_camera_view  # noqa
    fr = cam.data.view_frame(scene=sc); m = cam.matrix_world
    tl, tr, br, bl = [m @ v for v in (fr[1], fr[0], fr[3], fr[2])]   # view_frame: tr, br, bl, tl
    top = tl.lerp(tr, scr[0]); bot = bl.lerp(br, scr[0]); p = top.lerp(bot, scr[1]); o = m.translation; d = (p - o).normalized()
    t = (z - o.z) / d.z; return o + d * t

def _card_px(card, p, cam, idx):
    """lock card px (2x rig) of the point where the lens ray to p crosses the card plane"""
    from mathutils.geometry import intersect_line_plane
    mw = card.matrix_world; n = (mw.to_3x3() @ Vector((0, 1, 0))).normalized(); q = intersect_line_plane(cam.matrix_world.translation, p, mw.translation, n)
    l = mw.inverted() @ q; k = idx['metres_per_px']; return [l.x / k + idx['centre_px'], idx['ground_px'] - l.z / k]

def hats(sc, cfg, K, out):
    cam = sc.camera; card = K['CARDS']['michel']['object']; idx = K['CARDS']['michel']['index']; held = {}
    import json, os
    for r in json.load(open(os.path.join(K['LOCK'], 'held_all.json'))):
        if r['who'] == 'michel': held.setdefault(r['obj'], {})[r['f']] = r
    rows = {}
    for f in range(SALT['f0'], SALT['f1'] + 1):
        sc.frame_set(f); S = Vector(SALT['P']); kit = Vector(held['salt_shaker'][f]['fists'][0]['at'])
        w = 0 if f <= SALT['f_hold'] else min(1, (f - SALT['f_hold']) / (SALT['f1'] - SALT['f_hold'])); w = w * w * (3 - 2 * w); P = S.lerp(kit, w)
        R = _card_px(card, P, cam, idx); L = _card_px(card, Vector(held['fork'][f]['fists'][0]['at']), cam, idx)
        from bpy_extras.object_utils import world_to_camera_view as w2c; v = w2c(sc, cam, P)
        rows[f] = dict(P=list(P), R=[R[0] / 2, R[1] / 2], L=[L[0] / 2, L[1] / 2], scr=[round(v.x, 3), round(1 - v.y, 3)])
    json.dump(rows, open(out, 'w'), indent=0); print('HATS', out, rows[0], rows[SALT['f1']])

def salt_fix(sc, cfg, K):
    """Card_michel_fix (same mesh, my re-posed drawings fix_s1/m_####.png) visible f0-72 instead of the kit card; the shaker follows the new fist."""
    import os, json
    d = os.path.join(K['LOOK'], 'film', 'fix_s1'); hj = os.path.join(d, 'hats.json')
    if not os.path.exists(os.path.join(d, 'm_0001.png')): print('SALT_FIX skipped: no drawings'); return
    H = {int(k): v for k, v in json.load(open(hj)).items()}; base = K['CARDS']['michel']['object']; f0, f1 = min(H), max(H)
    m = K['CARDS']['michel']['material'].copy(); m.name = 'Card_michel_fix'; it = m.node_tree.nodes['seq']
    img = bpy.data.images.load(os.path.join(d, 'm_0001.png')); img.source = 'SEQUENCE'; it.image = img
    if m.node_tree.animation_data: m.node_tree.animation_data_clear()
    it.image_user.frame_offset = 1 - 1; it.image_user.frame_start = f0 + 1 - 1 + 1 - 1; it.image_user.frame_start = 1 + f0 - 0; it.image_user.frame_offset = 0
    it.image_user.frame_start = 0; it.image_user.frame_duration = 100000   # scene frame f -> m_(f+1)
    fx = bpy.data.objects.new('Card_michel_fix', base.data.copy()); fx.data.materials.clear(); fx.data.materials.append(m); sc.collection.objects.link(fx)
    # the re-posed arm reaches over the wing tip, whose chord crosses the card plane: the whole fix card is pulled toward the lens along the
    # lens rays (scaled, so the picture on screen is the same) until it stands in front of the wing's leading edge
    PUSH = cfg.get('salt_push', 0.5); fx.rotation_mode = base.rotation_mode
    for f in range(f0, f1 + 1):
        sc.frame_set(f); cam = sc.camera.matrix_world.translation; mw = base.matrix_world.copy(); loc = mw.translation; dd = (loc - cam).length; k = (dd - PUSH) / dd
        fx.location = cam + (loc - cam) * k; fx.rotation_euler = mw.to_euler(); fx.scale = (k, k, k)
        for p_ in ('location', 'rotation_euler', 'scale'): fx.keyframe_insert(p_, frame=f)
    fx.pass_index = 1; fx.visible_diffuse = False; fx.visible_shadow = False; fx.visible_glossy = False
    for f, hid in ((f0 - 1, True), (f0, False), (f1, False), (f1 + 1, True)):
        if f < 0: continue
        fx.hide_render = hid; fx.keyframe_insert('hide_render', frame=f)
    # the kit card hides while the fix shows: add keys on top of its own hide curve
    base.hide_render = True; base.keyframe_insert('hide_render', frame=f0)
    base.hide_render = False; base.keyframe_insert('hide_render', frame=f1 + 1)
    for ob in (fx, base):
        for fc in __import__('blender_look.from_lock', fromlist=['_fcurves'])._fcurves(ob.animation_data.action):
            if fc.data_path == 'hide_render':
                for kp in fc.keyframe_points: kp.interpolation = 'CONSTANT'
                for kp in list(fc.keyframe_points):
                    if f0 < kp.co[0] <= f1 and fc.id_data is not None and ob is base: kp.co[1] = 1.0
    sys_ = K['PROPS'].get(('michel', 'salt_shaker'))
    if sys_:
        e, coll, fist = sys_
        D = {int(k): v for k, v in json.load(open(os.path.join(d, 'hands_drawn.json'))).items()}; idx = K['CARDS']['michel']['index']; kpx = idx['metres_per_px']
        for f in range(f0, f1 + 1):
            sc.frame_set(f); hx, hy = D[f]['R']; P = base.matrix_world @ Vector(((hx - idx['centre_px']) * kpx, 0, (idx['ground_px'] - hy) * kpx)); H[f]['P'] = list(P); ang = math.radians(150 if (f // 3) % 2 else 132)
            e.location = P; e.keyframe_insert('location', frame=f)
            # cap toward the wing (down, a little screen-left), shaken every 3 frames like the kit
            cam = sc.camera; sc.frame_set(f); right = (cam.matrix_world.to_3x3() @ Vector((1, 0, 0))).normalized()
            down = Vector((0, 0, -1)); tipdir = (down * math.cos(math.pi - ang) + (-right) * math.sin(math.pi - ang)).normalized()
            e.rotation_quaternion = Vector((0, 0, 1)).rotation_difference(tipdir); e.keyframe_insert('rotation_quaternion', frame=f)
            s = 2.2; e.scale = (s, s, s); e.keyframe_insert('scale', frame=f)
            camp = cam.matrix_world.translation; fist.location = P + (camp - P).normalized() * .02; fist.keyframe_insert('location', frame=f)
    print('SALT_FIX', f0, f1)

def kit_paint(sc, cfg, K):
    """kit-coded pieces lose their canvas textures in the lock glb (the exporter writes colour only): paint them again (stretches.json 'paint':
    name prefix -> {col | tex | metal}). S1: the showman trunk (navy body, wood slats, MONSIEUR MANGETOUT front)."""
    import os
    for pre, spec in cfg.get('paint', {}).items():
        m = bpy.data.materials.new('kitpaint_' + pre); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']
        b.inputs['Roughness'].default_value = spec.get('rough', .55); b.inputs['Metallic'].default_value = spec.get('metal', 0.)
        if spec.get('tex'):
            it = nt.nodes.new('ShaderNodeTexImage'); it.image = bpy.data.images.load(os.path.join(K['LOOK'], 'film', spec['tex'])); nt.links.new(it.outputs[0], b.inputs['Base Color'])
        else:
            h = spec['col'].lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]; b.inputs['Base Color'].default_value = tuple(x / 12.92 if x <= .04045 else ((x + .055) / 1.055) ** 2.4 for x in c) + (1,)
        n = 0
        for o in sc.objects:
            if o.type == 'MESH' and o.name in K.get('KEPT', ()) and o.name.split('.')[0].startswith(pre): o.data.materials.clear(); o.data.materials.append(m); n += 1
        print('PAINT', pre, n)
