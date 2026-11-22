# film_fixes.py: per-stretch fixes in Blender of what the kit could not draw (stretches.json "fix"). Called by film_lock.py after the lock is built.
import bpy, random, math
from mathutils import Vector

def salt_grains(sc, cfg, K, n=140, f0=0, f1=72):
    """a falling stream of salt from the shaker cap down to the wing top on f0-f1 (kit: additive sprites, not in the lock): small glinting
    cubes keyed per frame, each falling 0.0-0.3 m below the cap on its own phase; hidden outside the pour."""
    e = K['PROPS'].get(('michel', 'salt_shaker'))
    if not e: return
    e = e[0]; gm = bpy.data.materials.new('salt_grain_film'); gm.use_nodes = True; b = gm.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (1, 1, 1, 1); b.inputs['Roughness'].default_value = .15; b.inputs['Emission Color'].default_value = (1, 1, 1, 1); b.inputs['Emission Strength'].default_value = 1.2
    rnd = random.Random(4); G = []
    for i in range(n):
        bpy.ops.mesh.primitive_cube_add(size=.007, location=(0, 0, 0)); g = bpy.context.object; g.name = 'salt_fall_%02d' % i; g.data.materials.append(gm); g.visible_shadow = True
        G.append((g, rnd.random(), rnd.gauss(0, 1), rnd.gauss(0, 1)))
    for f in range(f0, f1 + 2):
        sc.frame_set(min(f, f1)); cap = e.matrix_world @ Vector((0, 0, .075))
        for g, ph, gx, gy in G:
            t = ((f / 9.0) + ph) % 1.0; fall = t * .13
            g.location = (cap.x + gx * (.004 + .02 * t), cap.y + gy * (.004 + .02 * t), cap.z - fall); g.hide_render = f > f1
            g.keyframe_insert('location', frame=f); g.keyframe_insert('hide_render', frame=f)
    sc['salt_grains'] = n

def apply(sc, cfg, K):
    for name in cfg.get('fix', []):
        fn = globals().get(name)
        if fn: fn(sc, cfg, K); print('FIX', name)

# ---------------- S1 frame 0-72: the salting fist over the wing tip (the kit clamps it at his chin from this high lens)
SALT = dict(f0=0, f_hold=54, f1=72, P=(4.86, -1.2, 2.14), z_shaker=2.24)   # over the wing-tip top (tip end x 5.09, chord y -1.68..-0.61, top z 1.99)

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
            sc.frame_set(f); hx, hy = D[f]['R']; P = base.matrix_world @ Vector(((hx - idx['centre_px']) * kpx, 0, (idx['ground_px'] - hy) * kpx))
            C = sc.camera.matrix_world.translation.copy(); dd = (P - C).length; Pp = C + (P - C) * ((dd - cfg.get('salt_push', 0.5)) / dd)   # fist on the pulled card
            t = (SALT['z_shaker'] - C.z) / (P.z - C.z) if abs(P.z - C.z) > 1e-3 else 1.0
            if f <= SALT['f_hold'] and 0.2 < t < 3: P = C + (P - C) * t       # on the same lens ray, at a height above the wing top: the stream falls in front of it
            shs = 2.2 * (P - C).length / (Pp - C).length; H[f]['P'] = list(P); ang = math.radians(150 if (f // 3) % 2 else 132)
            e.location = P; e.keyframe_insert('location', frame=f)
            # cap toward the wing (down, a little screen-left), shaken every 3 frames like the kit
            cam = sc.camera; sc.frame_set(f); right = (cam.matrix_world.to_3x3() @ Vector((1, 0, 0))).normalized()
            down = Vector((0, 0, -1)); tipdir = (down * math.cos(math.pi - ang) + (-right) * math.sin(math.pi - ang)).normalized()
            e.rotation_quaternion = Vector((0, 0, 1)).rotation_difference(tipdir); e.keyframe_insert('rotation_quaternion', frame=f)
            e.scale = (shs, shs, shs); e.keyframe_insert('scale', frame=f)
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

def cabin_window(sc, cfg, K):
    """the set's fuselage_skin_outer has no window holes (LECONS 2026-11-21): the outer skin, window glass and shades are hidden from the
    lens only (they still light and shadow; the shades stay), so every window shows the set's sky, cumulus deck and wing."""
    n = 0
    for o in sc.objects:
        if o.name.startswith(('fuselage_skin_outer', 'window_glass')): o.visible_camera = False; n += 1
    print('CABIN_WINDOW hidden from lens', n)

# ---------------- S4: the seasons time-lapse and the dusk (s4_apron.js KEYS, driven per frame in the kit; the lock has one light only)
S4_KEYS = [(0, 'DAY'), (674, 'DAY'),
    (682, dict(top='#3d7fd0', hor='#ffd9a8', sun='#ffc98a', si=3.6, amb='#d9c9b8', ai=1.7, lawn='#a79a52', leaf='#d9822b', snow=0)),
    (690, dict(top='#7d97b8', hor='#e8eef6', sun='#eef4ff', si=3.0, amb='#dfe8f5', ai=2.2, lawn='#cfe0f5', leaf='#e9f0fa', snow=1)),
    (698, dict(top='#7d97b8', hor='#e8eef6', sun='#eef4ff', si=3.0, amb='#dfe8f5', ai=2.2, lawn='#cfe0f5', leaf='#e9f0fa', snow=1)),
    (705, dict(top='#2f8ae8', hor='#d8f0d0', sun='#fff8e0', si=4.2, amb='#e3eedf', ai=1.9, lawn='#7fbf4a', leaf='#8fd14f', snow=0)),
    (716, dict(top='#2f8ae8', hor='#d8f0d0', sun='#fff8e0', si=4.2, amb='#e3eedf', ai=1.9, lawn='#7fbf4a', leaf='#8fd14f', snow=0)),
    (738, 'DUSK'), (9999, 'DUSK')]

def _hx(h):
    h = h.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]; return [x / 12.92 if x <= .04045 else ((x + .055) / 1.055) ** 2.4 for x in c]

def seasons(sc, cfg, K):
    """per frame: sky (camera) colours, sun colour/strength (with the 5-day strobe of the time-lapse), sky fill, exposure day -> dusk (cards follow),
    lawn and leaves tinted toward the season, a snow skin over the apron, the hangar work lamps and the pink table key from 'dessert?' (740)."""
    import json, os
    RL = json.load(open(os.path.join(os.path.dirname(os.path.dirname(K['EP'])), 'templates', 'blender_look', 'rick_light.json')))
    D, U = RL['day'], RL['dusk']
    def look(name):
        if name == 'DAY': return dict(top=D['sky_top'], hor=D['sky_low'], sun=D['sun_col'], sk=1.0, amb=D['fill_col'], ak=1.0, lawn=None, leaf=None, snow=0, ex=cfg.get('expo', -.1), dusk=0)
        if name == 'DUSK': return dict(top=U['sky_top'], hor=U['sky_low'], sun=U['sun_col'], sk=U['sun'] / D['sun'], amb=U['fill_col'], ak=U['fill'] / D['fill'], lawn='#6e7a52', leaf='#5d6e48', snow=0, ex=U['exposure'], dusk=1)
        return dict(top=name['top'], hor=name['hor'], sun=name['sun'], sk=name['si'] / 4.6, amb=name['amb'], ak=name['ai'] / 2.0, lawn=name['lawn'], leaf=name['leaf'], snow=name['snow'], ex=cfg.get('expo', -.1), dusk=0)
    KS = [(f, look(n)) for f, n in S4_KEYS]
    def at(f):
        for (fa, A), (fb, B) in zip(KS, KS[1:]):
            if fa <= f <= fb:
                u = 0 if fb == fa else (f - fa) / (fb - fa); u = u * u * (3 - 2 * u); L = lambda k: [a + (b - a) * u for a, b in zip(_hx(A[k]), _hx(B[k]))]
                lawnK = (1 if A['lawn'] and B['lawn'] else 1 - u if A['lawn'] else u if B['lawn'] else 0)
                return dict(top=L('top'), hor=L('hor'), sun=L('sun'), sk=A['sk'] + (B['sk'] - A['sk']) * u, amb=L('amb'), ak=A['ak'] + (B['ak'] - A['ak']) * u,
                            lawn=_hx(B['lawn'] or A['lawn']) if (A['lawn'] or B['lawn']) else None, lawnK=lawnK, leaf=_hx(B['leaf'] or A['leaf']) if (A['leaf'] or B['leaf']) else None,
                            snow=A['snow'] + (B['snow'] - A['snow']) * u, ex=A['ex'] + (B['ex'] - A['ex']) * u, dusk=A['dusk'] + (B['dusk'] - A['dusk']) * u)
    w = sc.world; N = w.node_tree.nodes; rp = N['sky_ramp']; sun = bpy.data.objects['apron_sun']; E0 = sun.data.energy; F0 = N['sky_fill'].inputs['Strength'].default_value
    def tint_hook(m, tag):
        if not m or not m.use_nodes or m.node_tree.nodes.get('season_' + tag): return None
        b = next((n for n in m.node_tree.nodes if n.type in ('BSDF_PRINCIPLED', 'BSDF_DIFFUSE')), None)
        if b is None: return None
        ci = b.inputs['Base Color'] if 'Base Color' in b.inputs else b.inputs['Color']; mx = m.node_tree.nodes.new('ShaderNodeMix'); mx.data_type = 'RGBA'; mx.name = 'season_' + tag
        if ci.links: m.node_tree.links.new(ci.links[0].from_socket, mx.inputs['A'])
        else: mx.inputs['A'].default_value = ci.default_value
        m.node_tree.links.new(mx.outputs['Result'], ci); return mx
    lawnM, leafM = [], []
    for o in sc.objects:
        if o.type != 'MESH': continue
        for m in o.data.materials:
            if not m: continue
            if o.name.startswith(('lawn', 'tufts', 'grass', 'runway_mow', 'fields_')) and m not in [x[0] for x in lawnM]:
                h = tint_hook(m, 'lawn'); h and lawnM.append((m, h))
            elif ('leaf' in m.name.lower() or 'leaves' in m.name.lower() or 'crown' in m.name.lower()) and m not in [x[0] for x in leafM]:
                h = tint_hook(m, 'leaf'); h and leafM.append((m, h))
    # the snow skin
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 0, .045)); sn = bpy.context.object; sn.name = 'season_snow'; sn.scale = (60, 40, 1)
    sm = bpy.data.materials.new('season_snow'); sm.use_nodes = True; nt = sm.node_tree; b = nt.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = tuple(_hx('#eef4fb')) + (1,); b.inputs['Roughness'].default_value = .9
    sn.data.materials.append(sm)
    lamps = [o for o in bpy.data.objects if o.name.startswith('lamp_work') and o.type == 'LIGHT']
    kd = bpy.data.lights.new('dusk_table_key', 'POINT'); kd.color = tuple(_hx('#ffb48a')); kd.shadow_soft_size = .4; ko = bpy.data.objects.new('dusk_table_key', kd); sc.collection.objects.link(ko); ko.location = (4.6, -0.2, 2.6)
    cards = [k['material'] for k in K['CARDS'].values()] + [m for m in bpy.data.materials if m.name.startswith('Card_')]
    f0, f1 = cfg['window']
    for f in range(f0, f1 + 1):
        S = at(f); tl = (f - 672) / (712 - 672) if 672 <= f <= 712 else 0; flick = .78 + .22 * math.cos(tl * math.pi * 2 * 5) if tl else 1
        rp.color_ramp.elements[0].color = S['hor'] + [1]; rp.color_ramp.elements[1].color = S['top'] + [1]
        for e in rp.color_ramp.elements: e.keyframe_insert('color', frame=f)
        sun.data.color = S['sun']; sun.data.energy = E0 * S['sk'] * flick; sun.data.keyframe_insert('color', frame=f); sun.data.keyframe_insert('energy', frame=f)
        N['sky_fill'].inputs['Color'].default_value = S['amb'] + [1]; N['sky_fill'].inputs['Strength'].default_value = F0 * S['ak']
        N['sky_fill'].inputs['Color'].keyframe_insert('default_value', frame=f); N['sky_fill'].inputs['Strength'].keyframe_insert('default_value', frame=f)
        sc.view_settings.exposure = S['ex']; sc.view_settings.keyframe_insert('exposure', frame=f)
        N['sky_cam'].inputs[1].default_value = 2 ** (-S['ex']) * flick; N['sky_cam'].inputs[1].keyframe_insert('default_value', frame=f)
        for m in cards:
            e_ = m.node_tree.nodes.get('self')
            if e_ is not None: e_.inputs[1].default_value = 2 ** (-S['ex']); e_.inputs[1].keyframe_insert('default_value', frame=f)
        for m, h in lawnM:
            h.inputs['Factor'].default_value = (S['lawnK'] * .85) if S['lawn'] else 0; h.inputs['B'].default_value = (S['lawn'] or [0, 0, 0]) + [1]
            h.inputs['Factor'].keyframe_insert('default_value', frame=f); h.inputs['B'].keyframe_insert('default_value', frame=f)
        for m, h in leafM:
            h.inputs['Factor'].default_value = (S['lawnK'] * .9) if S['leaf'] else 0; h.inputs['B'].default_value = (S['leaf'] or [0, 0, 0]) + [1]
            h.inputs['Factor'].keyframe_insert('default_value', frame=f); h.inputs['B'].keyframe_insert('default_value', frame=f)
        sn.hide_render = S['snow'] < .02; sn.keyframe_insert('hide_render', frame=f); b.inputs['Alpha'].default_value = .92 * S['snow']; b.inputs['Alpha'].keyframe_insert('default_value', frame=f)
        on = 0 if f < 740 else 1 - math.exp(-(f - 740) / 1.5)
        for l in lamps: l.data.energy = l.get('lamp_energy', 300) * on; l.data.keyframe_insert('energy', frame=f)
        kd.energy = 150 * on; kd.keyframe_insert('energy', frame=f)
    # falling snowflakes while it snows (kit: flakes drifting down, .09 m a frame) in a box in front of the lens, and the sun swinging round
    # 2.5 turns through the time-lapse, then sinking toward dusk (kit sun0 rotated about the vertical axis)
    fm = bpy.data.materials.new('season_flake'); fm.use_nodes = True; fb = fm.node_tree.nodes['Principled BSDF']; fb.inputs['Base Color'].default_value = (1, 1, 1, 1)
    fb.inputs['Emission Color'].default_value = (1, 1, 1, 1); fb.inputs['Emission Strength'].default_value = .5
    rnd = random.Random(9); FL_ = []
    for i in range(int(cfg.get('flakes', 260))):
        bpy.ops.mesh.primitive_ico_sphere_add(radius=rnd.uniform(.012, .025), subdivisions=1); o = bpy.context.object; o.name = 'season_flake_%03d' % i; o.data.materials.append(fm); o.visible_shadow = False
        FL_.append((o, rnd.random(), rnd.random(), rnd.random()))
    sun.rotation_mode = 'QUATERNION'; q0 = sun.rotation_quaternion.copy() if sun.rotation_mode == 'QUATERNION' else sun.matrix_world.to_quaternion()
    from mathutils import Quaternion
    for f in range(f0, f1 + 1):
        S = at(f); tl = (f - 672) / (712 + 4 - 672) if 672 <= f <= 716 else 0
        a = tl * math.pi * 2 * 2.5 + (math.pi * 5 + .9 * min(1, (f - 716) / 26) if f > 716 else 0)
        sun.rotation_quaternion = Quaternion((0, 0, 1), a) @ q0; sun.keyframe_insert('rotation_quaternion', frame=f)
        sc.frame_set(f); cam = sc.camera.matrix_world; fwd = (cam.to_3x3() @ Vector((0, 0, -1))).normalized(); rt = (cam.to_3x3() @ Vector((1, 0, 0))).normalized(); C = cam.translation
        snow_on = S['snow'] > .05
        for o, u, v, w in FL_:
            d = 1.0 + u * 7.0; z = ((w * 5 - f * .09) % 5); p = C + fwd * d + rt * ((v - .5) * d * 1.1); o.location = (p.x + .2 * math.sin(f * .2 + u * 9), p.y, z)
            o.hide_render = not snow_on; o.keyframe_insert('location', frame=f); o.keyframe_insert('hide_render', frame=f)
    print('SEASONS', f0, f1, 'lawn mats', len(lawnM), 'leaf mats', len(leafM), 'lamps', len(lamps))

# ---------------- S1 HOOK camera f0-72 (lead 2026-11-22: the wing tip big in frame, the salt stream readable; LOOK CARD A, lower lens)
HOOK = dict(pos0=(4.05, -3.55, 1.15), pos1=(4.25, -3.2, 1.2), aim0=(5.0, -1.25, 1.85), aim1=(5.05, -1.25, 1.85), lens=20.0, f_push=58, f_blend=72)

def hook_cam(sc, cfg, K):
    """f0-58 a slow push from a low lens south-west of the trunk (wing tip upper left, Michel centre right, the shaker over the tip), f58-72 an
    eased move into the kit's own camera of f72 (no cut). Keys replace the lock camera's keys on those frames."""
    import os
    H = dict(HOOK); H.update(cfg.get('hook', {}))
    for k in ('pos0', 'pos1', 'aim0', 'aim1'):
        if os.environ.get('HOOK_' + k.upper()): H[k] = tuple(float(x) for x in os.environ['HOOK_' + k.upper()].split(','))
    cam = sc.camera; d = cam.data; f_end = H['f_blend']
    sc.frame_set(f_end); P1, Q1, L1 = cam.matrix_world.translation.copy(), cam.matrix_world.to_quaternion(), d.lens
    for f in range(0, f_end + 1):
        u = min(1, f / H['f_push']); p = Vector(H['pos0']).lerp(Vector(H['pos1']), u); a = Vector(H['aim0']).lerp(Vector(H['aim1']), u)
        q = (a - p).to_track_quat('-Z', 'Y'); lens = H['lens']
        if f > H['f_push']:
            w = (f - H['f_push']) / (f_end - H['f_push']); w = w * w * (3 - 2 * w); p = p.lerp(P1, w); q = q.slerp(Q1, w); lens = lens + (L1 - lens) * w
        cam.location = p; cam.rotation_quaternion = q; d.lens = lens
        cam.keyframe_insert('location', frame=f); cam.keyframe_insert('rotation_quaternion', frame=f); d.keyframe_insert('lens', frame=f)
    print('HOOK_CAM', H)

def lunch_lines(sc, cfg, K):
    """POWER 1 'Lunch!' impact frame f121-123 (kit: napkin-red / white two-tone field with focus lines behind Michel). The centre on screen per
    frame goes to look/film/fx/<s>_fx.json; fx_layer.py draws the field + lines UNDER the cards at finish time (keys and pod the same)."""
    import os, json
    from bpy_extras.object_utils import world_to_camera_view as w2c
    od = os.path.join(K['LOOK'], 'film', 'fx'); os.makedirs(od, exist_ok=True); out = {}
    for f in (121, 122, 123):
        sc.frame_set(f); c = w2c(sc, sc.camera, K['CARDS']['michel']['object'].matrix_world @ Vector((0, 0, 1.2))); out[f] = dict(kind='focus', c=[c.x, 1 - c.y], two_tone=f == 122)
    json.dump(out, open(os.path.join(od, 's1_fx.json'), 'w')); print('LUNCH_LINES', out)

def tint_mats(sc, cfg, K):
    """stretches.json 'tint': object-name prefix -> [hex, factor]: the base colour of those objects' materials multiplied toward a tint (S1: the
    apron concrete a little warmer and the hangar floor with it, so the day frame carries colour at the source instead of a grade boost)."""
    done = set()
    for pre, (hx, fac) in cfg.get('tint', {}).items():
        n = 0
        for o in sc.objects:
            if o.type != 'MESH' or not o.name.startswith(pre): continue
            for m in o.data.materials:
                if not m or not m.use_nodes or m.name in done: continue
                b = next((x for x in m.node_tree.nodes if x.type == 'BSDF_PRINCIPLED'), None)
                if b is None: continue
                ci = b.inputs['Base Color']; mx = m.node_tree.nodes.new('ShaderNodeMix'); mx.data_type = 'RGBA'; mx.blend_type = 'MULTIPLY'; mx.inputs['Factor'].default_value = fac
                if ci.links: m.node_tree.links.new(ci.links[0].from_socket, mx.inputs['A'])
                else: mx.inputs['A'].default_value = ci.default_value
                mx.inputs['B'].default_value = tuple(_hx(hx)) + (1,); m.node_tree.links.new(mx.outputs['Result'], ci); done.add(m.name); n += 1
        print('TINT', pre, hx, fac, n)
