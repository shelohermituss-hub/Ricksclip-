"""bl_cessna.py: builds the plane-eater HERO, the Cessna 150 "F-MIAM", and its story states from the downloaded asset.
Run (props/build_props.sh does it):  blender -b --factory-startup --python bl_cessna.py -- <asset.glb> <out dir>
Source: "FREE Cessna 172SP" by NLM-Group, Sketchfab c9cadc2f026946da8cf9715a683739e9, CC BY 4.0 (props/ASSETS.md).
Adapted to a 1970s Cessna 150: scaled to the 150's span (10.17 m), rear bench removed (2 seats), tie-down ropes / blocks / tags
removed, missing right wing strut mirrored from the left one, glass-cockpit screens switched off, grime + navy livery + the
baked registration replaced by clean white (#f3f4f1) and the film's one red (#d62828), new registration F-MIAM on both fin sides.
Axes: nose -Y, up +Z, span X; pilot's LEFT wing = +X (suffix _L). Ground z = 0 under the tyres. Units metres.
Writes: cessna150.{blend,glb} (intact, parts split L/R), cessna150_wingoff.{blend,glb} (left wing sawn off at the root in square
bites, outer panel on the ground), cessna150_sliced.{blend,glb} (whole plane in 9 even slices like a loaf, gaps 0.22 m, sawhorses
under the slices that do not stand on a wheel; nodes slice_0 nose .. slice_8 tail, eaten stages = hide slices from the tail),
cessna_meta.json (part names, tris, sizes, slice table). Ends with the line CESSNA_DONE."""
import bpy, bmesh, sys, os, json, math
import numpy as np
from mathutils import Vector, Matrix

A = sys.argv[sys.argv.index('--') + 1:]
GLB, OUT = A[0], A[1]
os.makedirs(OUT, exist_ok=True)
WHITE, RED, REG = '#f3f4f1', '#d62828', 'F-MIAM'
SPAN_150 = 10.17
N_SLICES, GAP = 9, 0.22
DROP = ['Object_72', 'Object_76', 'Object_78', 'Object_79', 'Object_114', 'Object_116', 'Object_74',   # ropes, tags, blocks, chains
        'Object_62', 'Object_64', 'Object_68', 'Object_70']                                            # rear bench (150 = 2 seats)
NAMES = {'Object_10': 'wing', 'Object_46': 'aileron', 'Object_44': 'flap', 'Object_48': 'wing_root_fairing', 'Object_112': 'strut',
         'Object_54': 'fuselage', 'Object_56': 'cabin_lining', 'Object_37': 'glass_cabin', 'Object_39': 'prop', 'Object_40': 'prop_tips',
         'Object_30': 'spinner', 'Object_15': 'gear_legs', 'Object_17': 'wheel_spats', 'Object_19': 'tyres_main', 'Object_20': 'hubs_main',
         'Object_109': 'tyre_nose', 'Object_110': 'hub_nose', 'Object_22': 'nose_gear', 'Object_24': 'nose_fork', 'Object_26': 'stabiliser',
         'Object_28': 'elevator', 'Object_4': 'fin', 'Object_8': 'rudder', 'Object_6': 'fin_cap', 'Object_12': 'cowl_nose',
         'Object_13': 'cowl_inlet', 'Object_32': 'door_L', 'Object_33': 'door_handle_L', 'Object_34': 'door_glass_L',
         'Object_35': 'door_lining_L', 'Object_120': 'door_R', 'Object_121': 'door_handle_R', 'Object_122': 'door_lining_R',
         'Object_123': 'door_glass_R', 'Object_42': 'roof_vent', 'Object_50': 'glareshield', 'Object_96': 'seat_cushions',
         'Object_98': 'seat_backs', 'Object_102': 'seat_rails', 'Object_100': 'yokes', 'Object_118': 'tail_tiedown'}


def lin(h):
    h = h.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return [x / 12.92 if x <= .04045 else ((x + .055) / 1.055) ** 2.4 for x in c] + [1.0]


def srgb(h):
    h = h.lstrip('#'); return np.array([int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)], np.float32)


# ------------------------------------------------------------------ import, flatten, scale
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=GLB)
bpy.context.view_layer.update()
for o in list(bpy.data.objects):
    if o.animation_data: o.animation_data_clear()
meshes = [o for o in bpy.data.objects if o.type == 'MESH']
mw = {o.name: o.matrix_world.copy() for o in meshes}
span = max((mw[o.name] @ Vector(c)).x for o in meshes for c in o.bound_box) * 2
K = SPAN_150 / span
for o in meshes:
    if o.data.users > 1: o.data = o.data.copy()
    o.parent = None
    o.data.transform(Matrix.Scale(K, 4) @ mw[o.name]); o.matrix_world = Matrix.Identity(4)
for o in list(bpy.data.objects):
    if o.type != 'MESH' or o.name in DROP: bpy.data.objects.remove(o, do_unlink=True)
for a in list(bpy.data.actions): bpy.data.actions.remove(a)
for o in bpy.data.objects:
    o.name = NAMES.get(o.name, o.name.replace('Object_', 'part_'))
    o.data.name = o.name
# the asset has only the LEFT strut (+X): mirror it for the right side
sl = bpy.data.objects['strut']; sr = sl.copy(); sr.data = sl.data.copy(); bpy.context.scene.collection.objects.link(sr)
sr.data.transform(Matrix.Scale(-1, 4, (1, 0, 0)))
bm = bmesh.new(); bm.from_mesh(sr.data); bmesh.ops.reverse_faces(bm, faces=bm.faces[:]); bm.to_mesh(sr.data); bm.free()
sl.name, sr.name = 'strut_L', 'strut_R'

# ------------------------------------------------------------------ materials
def P(m): return m.node_tree.nodes.get('Principled BSDF')


body = bpy.data.materials['Body']; b = P(body); nt = body.node_tree
img = [n for n in nt.nodes if n.type == 'TEX_IMAGE' and n.outputs[0].links and n.outputs[0].links[0].to_socket.name == 'Base Color'][0].image
w, h = img.size; px = np.array(img.pixels[:], np.float32).reshape(h, w, 4)
navy = np.clip(((px[..., 2] - px[..., 0]) - .07) / .12, 0, 1)[..., None]     # the navy livery = blue minus red; grime + old letters are grey -> white
new = px.copy(); new[..., :3] = srgb(WHITE) * (1 - navy) + srgb(RED) * navy
paint = bpy.data.images.new('cessna_paint', w, h); paint.pixels[:] = new.ravel(); paint.pack()
paint_px_red = float((navy > .5).mean())
for n in list(nt.nodes):
    if n.type == 'TEX_IMAGE' and n.image == img: n.image = paint
for n in list(nt.nodes):   # constant gloss: drop the grimy roughness / metal map, keep the normal map (panel seams, rivets)
    if n.type == 'SEPARATE_COLOR': nt.nodes.remove(n)
b.inputs['Roughness'].default_value = .2; b.inputs['Metallic'].default_value = 0
b.inputs['Coat Weight'].default_value = 1.0; b.inputs['Coat Roughness'].default_value = .04


def set_p(name, col=None, metal=None, rough=None, kill_tex=False, alpha=None, emis_off=True):
    m = bpy.data.materials.get(name)
    if not m: return
    p = P(m); t = m.node_tree
    if kill_tex:
        for n in list(t.nodes):
            if n.type in ('TEX_IMAGE', 'SEPARATE_COLOR', 'MIX', 'MIX_RGB'): t.nodes.remove(n)
    if emis_off and 'Emission Strength' in p.inputs: p.inputs['Emission Strength'].default_value = 0
    if col: p.inputs['Base Color'].default_value = lin(col)
    if metal is not None:
        for l in list(p.inputs['Metallic'].links): t.links.remove(l)
        p.inputs['Metallic'].default_value = metal
    if rough is not None:
        for l in list(p.inputs['Roughness'].links): t.links.remove(l)
        p.inputs['Roughness'].default_value = rough
    if alpha is not None:
        p.inputs['Alpha'].default_value = alpha; m.surface_render_method = 'BLENDED' if hasattr(m, 'surface_render_method') else None


set_p('Metal', '#d9dbde', 1.0, .12, kill_tex=True)                 # spinner, door handles, wing root fittings: polished chrome
set_p('Disk', '#c9ccd0', 1.0, .22)                                 # wheel hubs: bright cast aluminium
set_p('Window', '#1d2c33', 0.0, .03, kill_tex=True, alpha=.22)     # clear glass, weak reflection (recipe)
set_p('Tyre', None, 0.0, .62)
set_p('Screw', '#8d9196', 1.0, .3)                                 # propeller blades: brushed aluminium
set_p('Material.002', '#f3f4f1', 0.0, .3)                          # prop tip bands
for nm in ('Material.007', 'Material.009'):                        # G1000 photo / sim-panel sheet with a credit: off, dark grey panel
    set_p(nm, '#26282b', 0.0, .55, kill_tex=True)
for nm in ('Material.006', 'material', 'material_19', 'material_20', 'Cockpit'):
    set_p(nm)                                                      # labels stay, no glow
cut = bpy.data.materials.new('alu_cut'); cut.use_nodes = True; cp = P(cut)
cp.inputs['Base Color'].default_value = lin('#c7cbd0'); cp.inputs['Metallic'].default_value = 1; cp.inputs['Roughness'].default_value = .28
red = bpy.data.materials.new('paint_red'); red.use_nodes = True; rp = P(red)
rp.inputs['Base Color'].default_value = lin(RED); rp.inputs['Roughness'].default_value = .22; rp.inputs['Coat Weight'].default_value = 1
wood = bpy.data.materials.new('sawhorse_wood'); wood.use_nodes = True; wp = P(wood)
wp.inputs['Base Color'].default_value = lin('#b88a55'); wp.inputs['Roughness'].default_value = .6

# ------------------------------------------------------------------ registration F-MIAM on both fin sides (red, painted on)
fin = bpy.data.objects['fin']
sc = bpy.context.scene
bpy.context.view_layer.update()
dg = bpy.context.evaluated_depsgraph_get()


def fin_hit(y, z, side):
    ok, loc, nrm, idx, ob, _ = sc.ray_cast(dg, Vector((side * 3, y, z)), Vector((-side, 0, 0)))
    return loc if ok and ob is not None and ob.name in ('fin', 'rudder') else None


fb = [Vector(c) for c in fin.bound_box]
fz0, fz1 = min(v.z for v in fb), max(v.z for v in fb)
zc = fz0 + .42 * (fz1 - fz0)
ys = [y for y in np.linspace(min(v.y for v in fb), max(v.y for v in fb), 200) if fin_hit(y, zc, 1)]
y0, y1 = min(ys), max(ys)
LH = min(.30, (fz1 - fz0) * .16)
reg_objs = []
for side in (1, -1):
    cu = bpy.data.curves.new('reg', 'FONT'); cu.body = REG; cu.size = LH * 1.38; cu.extrude = .0015
    cu.align_x = 'CENTER'; cu.align_y = 'CENTER'; cu.space_character = 1.05
    t = bpy.data.objects.new('reg_' + ('L' if side > 0 else 'R'), cu); sc.collection.objects.link(t)
    bpy.context.view_layer.update()
    me = bpy.data.meshes.new_from_object(t.evaluated_get(bpy.context.evaluated_depsgraph_get()))
    bpy.data.objects.remove(t); t = bpy.data.objects.new('reg_' + ('L' if side > 0 else 'R'), me); sc.collection.objects.link(t)
    yc = (y0 + y1) / 2 + .04 * (y1 - y0)
    R = Matrix(((0, 0, 1), (1, 0, 0), (0, 1, 0))) if side > 0 else Matrix(((0, 0, -1), (-1, 0, 0), (0, 1, 0)))
    me.transform(Matrix.Translation((side * .2, yc, zc)) @ R.to_4x4())
    me.materials.append(red)
    sw = t.modifiers.new('wrap', 'SHRINKWRAP'); sw.target = fin; sw.wrap_method = 'PROJECT'; sw.use_project_x = True
    sw.use_negative_direction = True; sw.use_positive_direction = True; sw.offset = .0025; sw.wrap_mode = 'OUTSIDE_SURFACE'
    bpy.context.view_layer.objects.active = t; t.select_set(True)
    bpy.ops.object.modifier_apply(modifier='wrap'); t.select_set(False)
    reg_objs.append(t)
reg_len = (y1 - y0)

# ------------------------------------------------------------------ helpers: bisect with a filled cut face
def bisect(ob, co, no, keep_pos, fill=True):
    """keep the side the normal points to (keep_pos) or the other; fill the new boundary with bare aluminium."""
    me = ob.data
    if fill and 'alu_cut' not in [m.name for m in me.materials if m]: me.materials.append(cut)
    ci = [m.name if m else '' for m in me.materials].index('alu_cut') if fill else 0
    bm = bmesh.new(); bm.from_mesh(me)
    r = bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:], plane_co=co, plane_no=no,
                               clear_inner=keep_pos, clear_outer=not keep_pos)
    if fill:
        ed = [e for e in r['geom_cut'] if isinstance(e, bmesh.types.BMEdge) and e.is_valid and e.is_boundary]
        if len(ed) >= 3:
            out = -Vector(no) if keep_pos else Vector(no)
            try:
                f = bmesh.ops.triangle_fill(bm, use_beauty=True, use_dissolve=False, edges=ed, normal=out)
                for fa in f['geom']:
                    if isinstance(fa, bmesh.types.BMFace):
                        fa.material_index = ci
                        if fa.normal.dot(out) < 0: fa.normal_flip()
            except Exception as ex: print('FILL_FAIL', ob.name, ex)
    bm.to_mesh(me); bm.free(); me.update()
    return len(me.polygons)


def dup(ob, name):
    c = ob.copy(); c.data = ob.data.copy(); c.name = name; c.data.name = name; sc.collection.objects.link(c); return c


def bbox(ob):
    v = [ob.matrix_world @ Vector(c) for c in ob.bound_box]
    return Vector([min(p[i] for p in v) for i in range(3)]), Vector([max(p[i] for p in v) for i in range(3)])


def tris(objs):
    n = 0
    for o in objs:
        o.data.calc_loop_triangles(); n += len(o.data.loop_triangles)
    return n


# ------------------------------------------------------------------ split every part that spans both sides into _L (+X) and _R
for o in [o for o in sc.objects if o.type == 'MESH']:
    lo, hi = bbox(o)
    if lo.x < -.6 and hi.x > .6:
        r_ = dup(o, o.name + '_R'); o.name = o.name + '_L'; o.data.name = o.name
        bisect(o, (0, 0, 0), (1, 0, 0), True, fill=False); bisect(r_, (0, 0, 0), (1, 0, 0), False, fill=False)
base = [o for o in sc.objects if o.type == 'MESH']
lo_all, hi_all = Vector((1e9,) * 3), Vector((-1e9,) * 3)
for o in base:
    lo, hi = bbox(o); lo_all = Vector(map(min, lo_all, lo)); hi_all = Vector(map(max, hi_all, hi))
meta = dict(source='Sketchfab c9cadc2f026946da8cf9715a683739e9 (NLM-Group, CC BY 4.0)', scale_k=round(K, 4),
            size_m=dict(span=round(hi_all.x - lo_all.x, 2), length=round(hi_all.y - lo_all.y, 2), height=round(hi_all.z, 2)),
            axes='nose -Y, up +Z, pilot left wing +X (_L)', registration=REG, colours=dict(white=WHITE, red=RED),
            red_share_of_paint_texture=round(paint_px_red, 4), reg_letter_h_m=round(LH, 3), fin_chord_at_letters_m=round(reg_len, 2))


def save(name, objs):
    for o in sc.objects: o.select_set(False)
    for o in objs: o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=os.path.join(OUT, name + '.glb'), use_selection=True, export_format='GLB',
                              export_apply=True, export_yup=True)
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, name + '.blend'), compress=True)


intact = [o for o in sc.objects if o.type == 'MESH']
meta['intact'] = dict(objects=len(intact), tris=tris(intact), parts=sorted(o.name for o in intact))
save('cessna150', intact)
print('INTACT', meta['intact']['objects'], 'objects', meta['intact']['tris'], 'tris', meta['size_m'])

# ------------------------------------------------------------------ state WINGOFF: left wing sawn off at the root in square bites
wing_L = bpy.data.objects['wing_L']; wlo, whi = bbox(wing_L)
root_x = .30 * K / 1.0                    # 0.30 asset units from the centre = just outside the cabin
chord_y = np.linspace(wlo.y - .01, whi.y + .01, 6)
steps = [.06, .19, .11, .23, .14]          # each chord strip is cut at its own length: the stepped edge of bitten squares
stub = []
for i in range(5):
    s = dup(wing_L, f'wing_L_stub_{i}')
    bisect(s, (0, chord_y[i], 0), (0, 1, 0), True); bisect(s, (0, chord_y[i + 1], 0), (0, 1, 0), False)
    bisect(s, (root_x + steps[i], 0, 0), (1, 0, 0), False)
    stub.append(s)
panel = dup(wing_L, 'wing_L_panel_ground')        # the outer panel he cut off, lying flat on the grass beside the plane
bisect(panel, (root_x + 1.0, 0, 0), (1, 0, 0), True); bisect(panel, (root_x + 3.2, 0, 0), (1, 0, 0), False)
plo, phi = bbox(panel)
panel.data.transform(Matrix.Translation((-(plo.x + phi.x) / 2, -(plo.y + phi.y) / 2, -plo.z)))
panel.location = (hi_all.x * .62, -1.2, 0); panel.rotation_euler = (0, 0, math.radians(-24))
gone = {'wing_L', 'aileron_L', 'flap_L', 'strut_L', 'wing_root_fairing_L', 'wheel_spats_L'}
wingoff = [o for o in sc.objects if o.type == 'MESH' and o.name in {x.name for x in intact} and o.name not in gone] + stub + [panel]
for o in sc.objects: o.hide_render = o.hide_viewport = o not in wingoff
meta['wingoff'] = dict(removed=sorted(gone), added=[o.name for o in stub + [panel]], tris=tris(wingoff), stub_steps_m=steps)
save('cessna150_wingoff', wingoff)
for o in stub + [panel]: bpy.data.objects.remove(o, do_unlink=True)
for o in sc.objects: o.hide_render = o.hide_viewport = False
print('WINGOFF', meta['wingoff']['tris'], 'tris')

# ------------------------------------------------------------------ state SLICED: the whole plane cut like a loaf
fus = bpy.data.objects['fuselage']; flo, fhi = bbox(fus)
y_nose, y_tail = lo_all.y - .01, hi_all.y + .01
cuts = list(np.linspace(y_nose, y_tail, N_SLICES + 1))
sliced, table = [], []
for i in range(N_SLICES):
    objs = []
    for o in intact:
        lo, hi = bbox(o)
        if hi.y < cuts[i] or lo.y > cuts[i + 1]: continue
        fill = not o.name.startswith(('glass', 'door_glass', 'reg_', 'cabin', 'seat', 'yokes', 'part_', 'door_lining'))
        s = dup(o, f's{i}_{o.name}')
        if lo.y < cuts[i]: bisect(s, (0, cuts[i], 0), (0, 1, 0), True, fill)
        if hi.y > cuts[i + 1]: bisect(s, (0, cuts[i + 1], 0), (0, 1, 0), False, fill)
        if len(s.data.polygons) == 0: bpy.data.objects.remove(s, do_unlink=True); continue
        objs.append(s)
    root = bpy.data.objects.new(f'slice_{i}', None); sc.collection.objects.link(root)
    root.location = (0, i * GAP, 0)
    for s in objs: s.parent = root
    zmin = min(bbox(s)[0].z for s in objs)
    row = dict(slice=i, y0=round(cuts[i] + i * GAP, 3), y1=round(cuts[i + 1] + i * GAP, 3), parts=len(objs), tris=tris(objs),
               stands_on='wheel' if zmin < .03 else 'sawhorse')
    if zmin >= .03:   # no wheel under it: a wooden sawhorse under the fuselage keel of this slice
        ym = (cuts[i] + cuts[i + 1]) / 2
        ok, loc, *_ = sc.ray_cast(bpy.context.evaluated_depsgraph_get(), Vector((0, ym, -1)), Vector((0, 0, 1)))
        hz = (loc.z if ok else zmin) - .005
        bm = bmesh.new()
        def box(c, sz, rz=0.0, rx=0.0):
            g = bmesh.ops.create_cube(bm, size=1)['verts']
            bmesh.ops.scale(bm, vec=sz, verts=g); bmesh.ops.rotate(bm, cent=(0, 0, 0), matrix=Matrix.Rotation(rx, 3, 'X') @ Matrix.Rotation(rz, 3, 'Y'), verts=g)
            bmesh.ops.translate(bm, vec=c, verts=g)
        box((0, ym, hz - .045), (.9, .09, .09))                          # top beam, 9 x 9 cm
        for sx in (-1, 1):
            for sy in (-1, 1):
                ang = math.radians(12)
                box((sx * .36, ym + sy * (hz - .09) / 2 * math.tan(ang), (hz - .09) / 2), (.05, .07, hz - .07), rx=-sy * ang)
        box((0, ym, .03), (.75, .05, .04))                               # low stretcher
        me = bpy.data.meshes.new(f'sawhorse_{i}'); bm.to_mesh(me); bm.free(); me.materials.append(wood)
        sh = bpy.data.objects.new(f'sawhorse_{i}', me); sc.collection.objects.link(sh); sh.parent = root; objs.append(sh)
        row['sawhorse_top_z'] = round(hz, 3)
    table.append(row); sliced += objs + [root]
for o in sc.objects: o.hide_render = o.hide_viewport = o not in sliced
meta['sliced'] = dict(n=N_SLICES, gap_m=GAP, slices=table, tris=tris([o for o in sliced if o.type == 'MESH']),
                      stages='eaten stage k = hide slice_{8..9-k} (tail first); last piece = s0_spinner')
save('cessna150_sliced', sliced)
print('SLICED', json.dumps(table))
json.dump(meta, open(os.path.join(OUT, 'cessna_meta.json'), 'w'), indent=1)
print('CESSNA_DONE')
