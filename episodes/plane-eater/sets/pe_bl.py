# pe_bl.py: shared Blender 5 helpers for the plane-eater sets (set-builder 2026-11-21). Used by xray/scripts/bl_xray.py and cabin/scripts/bl_cabin.py.
# Simplified clean props (Rick recipe point 1): rounded bevels on every prop edge, flat saturated paint, moderate texture; world-size box UVs so the
# PIL textures export to the kit GLB at the same density as in Blender. Library row: pe_set_helpers (library/LIBRARY.md).
import bpy, bmesh, math, os, json
from mathutils import Vector, Matrix

def lin(h):
    h = h.lstrip('#'); v = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return [(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4) for x in v] + [1.0]

def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True); return bpy.context.scene

def coll(name, parent=None):
    c = bpy.data.collections.new(name); (parent or bpy.context.scene.collection).children.link(c); return c

CUR = {'c': None}
def use(c): CUR['c'] = c

def link(o):
    (CUR['c'] or bpy.context.scene.collection).objects.link(o); return o

def pmat(name, col, rough=.5, metal=0., emit=None, es=0., alpha=None, coat=0., img=None, bump=0., noise=0.):
    """Principled material; img = PNG path (base colour from it, multiplied by col if col given); bump = Cycles-only noise bump strength."""
    if name in bpy.data.materials: return bpy.data.materials[name]
    m = bpy.data.materials.new(name); m.use_nodes = True; N = m.node_tree.nodes; Lk = m.node_tree.links; b = N['Principled BSDF']
    b.inputs['Base Color'].default_value = lin(col) if isinstance(col, str) else col
    b.inputs['Roughness'].default_value = rough; b.inputs['Metallic'].default_value = metal
    if coat: b.inputs['Coat Weight'].default_value = coat
    if emit: b.inputs['Emission Color'].default_value = lin(emit); b.inputs['Emission Strength'].default_value = es
    if img:
        t = N.new('ShaderNodeTexImage'); t.image = bpy.data.images.load(img); t.interpolation = 'Linear'
        Lk.new(t.outputs[0], b.inputs['Base Color'])
        if emit: Lk.new(t.outputs[0], b.inputs['Emission Color'])
    if alpha is not None:
        b.inputs['Alpha'].default_value = alpha
    if bump:
        nz = N.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 60.; nz.inputs['Detail'].default_value = 6.
        bp = N.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = bump; bp.inputs['Distance'].default_value = .002
        Lk.new(nz.outputs['Fac'], bp.inputs['Height']); Lk.new(bp.outputs['Normal'], b.inputs['Normal'])
    return m

def finish(o, mat=None, bev=0., seg=3, smooth=True, glb=True):
    if mat: o.data.materials.clear(); o.data.materials.append(mat)
    if bev > 0:
        md = o.modifiers.new('bevel', 'BEVEL'); md.width = bev; md.segments = seg; md.limit_method = 'ANGLE'; md.angle_limit = math.radians(40); md.harden_normals = False
    if smooth and o.type == 'MESH':
        for p in o.data.polygons: p.use_smooth = True
        try: o.data.set_sharp_from_angle(angle=math.radians(35))
        except Exception: pass
    o['glb'] = glb; return o

def _new(name, me):
    o = bpy.data.objects.new(name, me); link(o); return o

def box(name, size, loc, mat=None, bev=.01, rot=(0, 0, 0), seg=3):
    me = bpy.data.meshes.new(name); bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.scale(bm, vec=Vector(size), verts=bm.verts); bm.to_mesh(me); bm.free()
    o = _new(name, me); o.location = loc; o.rotation_euler = rot; return finish(o, mat, min(bev, min(size) * .45) if bev else 0, seg, smooth=bool(bev))

def cyl(name, r, h, loc, mat=None, rot=(0, 0, 0), seg=24, bev=0., r2=None):
    me = bpy.data.meshes.new(name); bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=seg, radius1=r, radius2=r if r2 is None else r2, depth=h)
    bm.to_mesh(me); bm.free(); o = _new(name, me); o.location = loc; o.rotation_euler = rot; return finish(o, mat, bev)

def sphere(name, r, loc, mat=None, scale=(1, 1, 1), seg=24, rings=12):
    me = bpy.data.meshes.new(name); bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=seg, v_segments=rings, radius=r)
    bm.to_mesh(me); bm.free(); o = _new(name, me); o.location = loc; o.scale = scale; return finish(o, mat)

def torus(name, R, r, loc, mat=None, rot=(0, 0, 0), seg=32, mseg=10, arc=2 * math.pi, a0=0.):
    """torus or an arc of one (arc < 2 pi): a bent tube in the XY plane."""
    vs, fs = [], []; closed = arc >= 2 * math.pi - 1e-6; n = seg if closed else seg + 1
    for i in range(n):
        a = a0 + arc * i / seg; c = Vector((math.cos(a) * R, math.sin(a) * R, 0)); d = Vector((math.cos(a), math.sin(a), 0))
        for j in range(mseg):
            b = 2 * math.pi * j / mseg; vs.append(c + d * math.cos(b) * r + Vector((0, 0, math.sin(b) * r)))
    for i in range(seg if closed else seg):
        i2 = (i + 1) % n
        for j in range(mseg): fs.append((i * mseg + j, i2 * mseg + j, i2 * mseg + (j + 1) % mseg, i * mseg + (j + 1) % mseg))
    if not closed:
        fs.append(tuple(range(mseg))[::-1]); fs.append(tuple((n - 1) * mseg + j for j in range(mseg)))
    o = mesh(name, vs, fs, mat); o.location = loc; o.rotation_euler = rot; return o

def tube(name, pts, r, mat=None, mseg=8):
    """a round tube along a polyline (pts world coords)."""
    P = [Vector(p) for p in pts]; vs, fs = [], []
    for i, p in enumerate(P):
        t = (P[min(i + 1, len(P) - 1)] - P[max(i - 1, 0)]).normalized()
        u = t.cross(Vector((0, 0, 1))); u = u.normalized() if u.length > 1e-4 else t.cross(Vector((1, 0, 0))).normalized(); w = t.cross(u)
        for j in range(mseg):
            b = 2 * math.pi * j / mseg; vs.append(p + u * math.cos(b) * r + w * math.sin(b) * r)
    for i in range(len(P) - 1):
        for j in range(mseg): fs.append((i * mseg + j, (i + 1) * mseg + j, (i + 1) * mseg + (j + 1) % mseg, i * mseg + (j + 1) % mseg))
    fs.append(tuple(range(mseg))[::-1]); fs.append(tuple((len(P) - 1) * mseg + j for j in range(mseg)))
    return mesh(name, vs, fs, mat)

def lathe(name, prof, loc, mat=None, seg=32, rot=(0, 0, 0)):
    """turned object: prof = [(radius, z), ...] bottom to top."""
    vs, fs = [], []; n = len(prof)
    for i in range(seg):
        a = 2 * math.pi * i / seg
        for r, z in prof: vs.append((math.cos(a) * r, math.sin(a) * r, z))
    for i in range(seg):
        i2 = (i + 1) % seg
        for k in range(n - 1): fs.append((i * n + k, i2 * n + k, i2 * n + k + 1, i * n + k + 1))
    o = mesh(name, vs, fs, mat); o.location = loc; o.rotation_euler = rot; return o

def mesh(name, vs, fs, mat=None, smooth=True):
    me = bpy.data.meshes.new(name); me.from_pydata([tuple(v) for v in vs], [], [tuple(f) for f in fs]); me.validate(); me.update()
    o = _new(name, me); return finish(o, mat, smooth=smooth)

def plane(name, w, h, loc, mat=None, rot=(0, 0, 0)):
    """a w x h quad in its local XZ plane (facing -Y), UV 0..1."""
    o = mesh(name, [(-w / 2, 0, -h / 2), (w / 2, 0, -h / 2), (w / 2, 0, h / 2), (-w / 2, 0, h / 2)], [(0, 1, 2, 3)], mat, smooth=False)
    ul = o.data.uv_layers.new(name='UVMap')
    for li, uv in zip(range(4), [(0, 0), (1, 0), (1, 1), (0, 1)]): ul.data[li].uv = uv
    o['fixed_uv'] = True; o.location = loc; o.rotation_euler = rot; return o

def text(name, s, loc, size, mat, rot=(math.pi / 2, 0, 0), depth=.004, align='CENTER', bold=True):
    cu = bpy.data.curves.new(name, 'FONT'); cu.body = s; cu.size = size; cu.extrude = depth; cu.align_x = align; cu.align_y = 'CENTER'
    for f in ('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'):
        if bold and os.path.exists(f): cu.font = bpy.data.fonts.load(f); break
    o = bpy.data.objects.new(name + '_c', cu); link(o); o.location = loc; o.rotation_euler = rot
    dg = bpy.context.evaluated_depsgraph_get(); me = bpy.data.meshes.new_from_object(o.evaluated_get(dg))
    m2 = bpy.data.objects.new(name, me); link(m2); m2.matrix_world = o.matrix_world.copy(); bpy.data.objects.remove(o)
    me.materials.clear(); me.materials.append(mat); m2['glb'] = True; return m2

def bite(target, centre, radius, axis='Z', teeth=5, depth=.5):
    """cut a neat crescent BITE out of target: a big disc + small scallop discs along its rim (teeth marks). axis = disc axis. Applies at once."""
    rot = dict(X=(0, math.pi / 2, 0), Y=(math.pi / 2, 0, 0), Z=(0, 0, 0))[axis]
    cutters = [cyl('_bite', radius, depth, centre, rot=rot, seg=40)]
    c = Vector(centre)
    for i in range(teeth):
        a = math.pi * (.15 + .7 * i / max(teeth - 1, 1)) + math.pi       # scallops on the inner arc, facing into the part
        off = {'Z': Vector((math.cos(a), math.sin(a), 0)), 'Y': Vector((math.cos(a), 0, math.sin(a))), 'X': Vector((0, math.cos(a), math.sin(a)))}[axis] * radius
        cutters.append(cyl('_tooth', radius * .22, depth, tuple(c + off * .98), rot=rot, seg=16))
    bpy.context.view_layer.update()
    for k in cutters:
        md = target.modifiers.new('bite', 'BOOLEAN'); md.operation = 'DIFFERENCE'; md.solver = 'EXACT'; md.object = k
        bpy.context.view_layer.objects.active = target
        apply_mods(target, only='bite')
        bpy.data.objects.remove(k)
    return target

def apply_mods(o, only=None):
    dg = bpy.context.evaluated_depsgraph_get()
    if only:
        keep = [(m.name) for m in o.modifiers if not m.name.startswith(only)]
        # disable others, evaluate, restore
        st = {m.name: m.show_viewport for m in o.modifiers}
        for m in o.modifiers: m.show_viewport = m.name.startswith(only)
        dg = bpy.context.evaluated_depsgraph_get(); dg.update()
        me = bpy.data.meshes.new_from_object(o.evaluated_get(dg)); old = o.data; o.data = me
        for m in list(o.modifiers):
            if m.name.startswith(only): o.modifiers.remove(m)
            else: m.show_viewport = st[m.name]
        bpy.data.meshes.remove(old); return o
    if not o.modifiers or (o.data.shape_keys): return o
    me = bpy.data.meshes.new_from_object(o.evaluated_get(dg)); old = o.data; o.data = me; o.modifiers.clear()
    if old.users == 0: bpy.data.meshes.remove(old)
    return o

def box_uv(o, size=.25):
    """world-size box projection UVs (1 UV unit = size metres), kept for fixed-UV planes."""
    if o.type != 'MESH' or o.get('fixed_uv'): return
    size = o.get('uv_size', size); me = o.data; bm = bmesh.new(); bm.from_mesh(me); ul = bm.loops.layers.uv.verify(); mw = o.matrix_world
    for f in bm.faces:
        n = (mw.to_3x3() @ f.normal); ax = max(range(3), key=lambda i: abs(n[i]))
        for l in f.loops:
            p = mw @ l.vert.co; a, b = [p[i] for i in range(3) if i != ax]; l[ul].uv = (a / size, b / size)
    bm.to_mesh(me); bm.free()

def tri_count(o):
    return sum(len(p.vertices) - 2 for p in o.data.polygons) if o.type == 'MESH' else 0

def bake_all(scene):
    """apply every modifier (bevels) so the blend and the GLB hold the same mesh; box UVs on all."""
    for o in list(scene.objects):
        if o.type == 'MESH':
            apply_mods(o); box_uv(o)

def cam(name, pos, aim, lens=24, sensor=36):
    cd = bpy.data.cameras.new(name); cd.lens = lens; cd.sensor_width = sensor; cd.sensor_fit = 'HORIZONTAL'; cd.clip_start = .02; cd.clip_end = 200
    o = bpy.data.objects.new(name, cd); bpy.context.scene.collection.objects.link(o); o.location = pos
    d = Vector(aim) - Vector(pos); o.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler(); return o

def render_setup(sc, spp=16):
    r = sc.render; r.resolution_x, r.resolution_y, r.resolution_percentage = 540, 960, 100; r.engine = 'CYCLES'; sc.cycles.device = 'CPU'
    sc.cycles.samples = spp; sc.cycles.use_denoising = True; sc.cycles.denoiser = 'OPENIMAGEDENOISE'; sc.cycles.max_bounces = 4
    sc.cycles.caustics_reflective = False; sc.cycles.caustics_refractive = False; sc.cycles.use_adaptive_sampling = True
    sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'None'

def world(sc, cam_col, light_col, light_str=1.):
    """sky the camera sees (cam_col) separate from the light it gives (light_col): Rick recipe point 3."""
    w = bpy.data.worlds.new('world'); sc.world = w; w.use_nodes = True; N = w.node_tree.nodes; Lk = w.node_tree.links
    bg = N['Background']; bg.inputs['Color'].default_value = lin(light_col); bg.inputs['Strength'].default_value = light_str
    b2 = N.new('ShaderNodeBackground'); b2.inputs['Color'].default_value = lin(cam_col); b2.inputs['Strength'].default_value = 1.
    lp = N.new('ShaderNodeLightPath'); mx = N.new('ShaderNodeMixShader'); out = N['World Output']
    Lk.new(lp.outputs['Is Camera Ray'], mx.inputs[0]); Lk.new(bg.outputs[0], mx.inputs[1]); Lk.new(b2.outputs[0], mx.inputs[2]); Lk.new(mx.outputs[0], out.inputs[0])

def light(name, kind, loc, col, energy, rot=(0, 0, 0), size=.5, size_y=None, angle=None):
    ld = bpy.data.lights.new(name, kind); ld.color = lin(col)[:3]; ld.energy = energy
    if kind == 'AREA':
        ld.shape = 'RECTANGLE'; ld.size = size; ld.size_y = size_y or size
    elif kind == 'SUN' and angle is not None: ld.angle = math.radians(angle)
    elif kind in ('POINT', 'SPOT'): ld.shadow_soft_size = size
    o = bpy.data.objects.new(name, ld); bpy.context.scene.collection.objects.link(o); o.location = loc; o.rotation_euler = rot; return o

def aim_rot(pos, aim):
    return (Vector(aim) - Vector(pos)).to_track_quat('-Z', 'Y').to_euler()

def export(sc, out_dir, stem, meta):
    """save .blend, then the lite GLB of every object tagged glb (shape keys as morphs). Writes meta with tri counts."""
    tris = {}
    for o in sc.objects:
        if o.type == 'MESH':
            k = o.users_collection[0].name; tris[k] = tris.get(k, 0) + tri_count(o)
    meta['tris_by_collection'] = tris; meta['tris_total'] = sum(tris.values())
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out_dir, stem + '.blend'))
    for o in bpy.data.objects: o.select_set(False)
    hidden = []
    for o in sc.objects:
        if o.type == 'MESH' and o.get('glb', True):
            if o.hide_render or o.hide_get(): hidden.append(o.name); o.hide_set(False)
            o.select_set(True)
    for m in bpy.data.materials:                     # glTF drops emission strength 0 (LECONS 2026-11-20): export at >= 1, the kit sets the level
        if m.use_nodes and 'Principled BSDF' in m.node_tree.nodes:
            b = m.node_tree.nodes['Principled BSDF']
            if 0 < b.inputs['Emission Strength'].default_value < 1: b.inputs['Emission Strength'].default_value = 1
    bpy.ops.export_scene.gltf(filepath=os.path.join(out_dir, stem + '_lite.glb'), use_selection=True, export_format='GLB', export_morph=True,
                              export_apply=False, export_yup=True, export_image_format='JPEG', export_extras=True)
    meta['glb_hidden_by_default'] = hidden
    meta['glb_mb'] = round(os.path.getsize(os.path.join(out_dir, stem + '_lite.glb')) / 1e6, 2)
    json.dump(meta, open(os.path.join(out_dir, stem + '_meta.json'), 'w'), indent=1)
    print('TRIS', json.dumps(tris), 'TOTAL', meta['tris_total'], 'GLB_MB', meta['glb_mb'], flush=True)
