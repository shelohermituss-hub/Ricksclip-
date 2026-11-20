# bl_props.py: the production spray gun (Oleksii.Rozumnyi, CC-BY 4.0) and air compressor (TheAlex, CC-BY 4.0).
# blender -b --factory-startup --python bl_props.py -- <spray_gun.glb> <air_compressor.glb> <tex dir> <out dir>
# Writes out/gun.glb + out/gun.blend, out/compressor.glb + out/compressor.blend, props_meta.json.
# Gun frame: metres, nozzle +X, Z up, ORIGIN = the grip point (middle of the handle; the cast's round fist closes there).
# Compressor frame: metres, long side along X, Z up, origin on the ground under its middle.
import bpy, sys, os, math, json, random, bmesh
from mathutils import Vector, Matrix
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.append(HERE)
import props_api as PA

GUN, COMP, TEX, OUT = sys.argv[sys.argv.index('--') + 1:][:4]
LEMON = PA.lin('#E3EA22')
meta = {}


def fresh():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    s = bpy.context.scene; s.unit_settings.system = 'METRIC'; s.render.engine = 'CYCLES'; s.view_settings.view_transform = 'Standard'; return s


def bake_in(sc, rot, length):
    """Bake rotation + scale (longest side = length) into the meshes; returns the meshes and their bbox."""
    ms = [o for o in sc.objects if o.type == 'MESH']
    for o in ms:
        mw = o.matrix_world.copy()
        if o.data.users > 1: o.data = o.data.copy()
        o.parent = None; o.data.transform(rot @ mw); o.matrix_world = Matrix.Identity(4)
    for o in [o for o in sc.objects if o.type != 'MESH']: bpy.data.objects.remove(o)
    mn, mx = PA.bbox(ms); k = length / max(mx - mn)
    for o in ms: o.data.transform(Matrix.Scale(k, 4))
    return ms, PA.bbox(ms)


def bsdf(m): return next(n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')


def lemon_mat():
    m = bpy.data.materials.get('lemon_wet') or bpy.data.materials.new('lemon_wet'); m.use_nodes = True; p = bsdf(m)
    p.inputs['Base Color'].default_value = LEMON; p.inputs['Roughness'].default_value = 0.12; p.inputs['Coat Weight'].default_value = 1.0; return m


def flecks(name, objs, n, seed, rmin, rmax, want):
    """n tiny flattened lemon drops scattered on the faces that want(face_center, normal) accepts, area-weighted. One mesh."""
    rnd = random.Random(seed); faces = []
    for o in objs:
        for p in o.data.polygons:
            c = o.matrix_world @ p.center; nrm = (o.matrix_world.to_3x3() @ p.normal).normalized()
            if want(c, nrm): faces.append((p.area, c, nrm))
    tot = sum(f[0] for f in faces); bm = bmesh.new()
    for _ in range(n):
        x = rnd.uniform(0, tot); acc = 0
        for a, c, nrm in faces:
            acc += a
            if acc >= x: break
        r = rnd.uniform(rmin, rmax); q = nrm.to_track_quat('Z', 'Y')
        g = bmesh.ops.create_icosphere(bm, subdivisions=1, radius=1.0)
        M = Matrix.Translation(c + nrm * r * 0.15) @ q.to_matrix().to_4x4() @ Matrix.Diagonal((r * rnd.uniform(.8, 1.4), r, r * 0.25, 1))
        bmesh.ops.transform(bm, matrix=M, verts=g['verts'])
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free(); o = bpy.data.objects.new(name, me); me.materials.append(lemon_mat())
    for p in me.polygons: p.use_smooth = True
    bpy.context.scene.collection.objects.link(o); return o


def export(sc, root, name):
    col = bpy.data.collections.new(name.upper()); sc.collection.children.link(col)
    for o in [root] + list(root.children_recursive):
        for c in o.users_collection: c.objects.unlink(o)
        col.objects.link(o)
    bpy.ops.object.select_all(action='DESELECT')
    for o in col.objects: o.select_set(True)
    tris = sum(len(o.data.loop_triangles) for o in col.objects if o.type == 'MESH' and (o.data.calc_loop_triangles() or True))
    bpy.ops.export_scene.gltf(filepath=os.path.join(OUT, name + '.glb'), export_format='GLB', use_selection=True, export_extras=True, export_yup=True, export_apply=True)
    bpy.ops.file.pack_all(); bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, name + '.blend'), compress=True)
    return tris


# ================================================================ THE SPRAY GUN
sc = fresh(); bpy.ops.import_scene.gltf(filepath=GUN)
ms, (mn, mx) = bake_in(sc, Matrix.Rotation(math.pi, 4, 'Z'), 0.24)      # as shipped the nozzle points -X: turn it to +X; 24 cm high/long
H = mx.z - mn.z
hv = [o.matrix_world @ v.co for o in ms for v in o.data.vertices if mn.z + .18 * H < (o.matrix_world @ v.co).z < mn.z + .5 * H]
grip = sum(hv, Vector()) / len(hv); grip.z = mn.z + .36 * H
for o in ms: o.data.transform(Matrix.Translation(-grip))
mn, mx = PA.bbox(ms)
M = bpy.data.materials
alu = M['Plastic_Red']; alu.name = 'gun_aluminium'; p = bsdf(alu)          # the film's ONE red stays on the trucks: the body becomes polished aluminium
for inp in ('Base Color', 'Metallic', 'Roughness'):
    for l in list(p.inputs[inp].links): alu.node_tree.links.remove(l)
p.inputs['Base Color'].default_value = (0.80, 0.81, 0.83, 1); p.inputs['Metallic'].default_value = 1.0; p.inputs['Roughness'].default_value = 0.16
blk = M['Plastic_black']; blk.name = 'gun_grip_black'
tipv = [o.matrix_world @ v.co for o in ms for v in o.data.vertices if (o.matrix_world @ v.co).x > mx.x - 0.004]
tip = sum(tipv, Vector()) / len(tipv)
brass = next(o for o in ms if 'Metal_Brass' in [m.name for m in o.data.materials])
inlet = min((v.co for v in brass.data.vertices), key=lambda v: v.z).copy()
root = bpy.data.objects.new('SPRAY_GUN', None); sc.collection.objects.link(root)
for o in ms: o.parent = root
fl = flecks('lemon_flecks', ms, 140, 3, 0.0007, 0.0022, lambda c, n: c.x > -0.02 and (n.z > 0.2 or n.x > 0.3)); fl.parent = root
# the drip: a run down the nozzle's underside ending in a hanging drop
bm = bmesh.new()
for k in range(9):
    g = bmesh.ops.create_uvsphere(bm, u_segments=12, v_segments=8, radius=1.0)
    r = 0.0018 + 0.0004 * k; c = tip + Vector((-0.004 - 0.0016 * k, 0, -0.006 - 0.0011 * k))
    bmesh.ops.transform(bm, matrix=Matrix.Translation(c) @ Matrix.Diagonal((r * 1.3, r, r, 1)), verts=g['verts'])
g = bmesh.ops.create_uvsphere(bm, u_segments=16, v_segments=10, radius=1.0)
drop = tip + Vector((-0.017, 0, -0.022)); bmesh.ops.transform(bm, matrix=Matrix.Translation(drop) @ Matrix.Diagonal((0.0042, 0.0042, 0.0062, 1)), verts=g['verts'])
me = bpy.data.meshes.new('lemon_drip'); bm.to_mesh(me); bm.free(); dr = bpy.data.objects.new('lemon_drip', me); me.materials.append(lemon_mat()); sc.collection.objects.link(dr); dr.parent = root
for pp in me.polygons: pp.use_smooth = True
for k, v in {'anchor_grip': Vector(), 'anchor_tip': tip, 'anchor_air_inlet': inlet, 'anchor_drip': drop}.items():
    e = bpy.data.objects.new(k, None); e.location = v; e.empty_display_size = 0.02; sc.collection.objects.link(e); e.parent = root; e['phfd_part'] = 'anchor'
tris = export(sc, root, 'gun')
meta['gun'] = dict(size=[round(x, 3) for x in (mx - mn)], tris=tris, grip_from_bottom=round(-mn.z, 3), tip=[round(x, 4) for x in tip], air_inlet=[round(x, 4) for x in inlet], drip=[round(x, 4) for x in drop])
print('GUN', meta['gun'])

# ================================================================ THE COMPRESSOR
sc = fresh(); bpy.ops.import_scene.gltf(filepath=COMP)
ms, (mn, mx) = bake_in(sc, Matrix.Rotation(math.pi / 2, 4, 'Z'), 0.70)  # long side (asset Y) to X
c = (mn + mx) / 2
for o in ms: o.data.transform(Matrix.Translation(Vector((-c.x, -c.y, -mn.z))))
mn, mx = PA.bbox(ms)
lab = bpy.data.materials['02_-_LABEL']; lab.name = 'comp_label_stencil'
ti = next(n for n in lab.node_tree.nodes if n.type == 'TEX_IMAGE'); ti.image = bpy.data.images.load(os.path.join(TEX, 'comp_label.png')); ti.image.name = 'comp_label'
root = bpy.data.objects.new('COMPRESSOR', None); sc.collection.objects.link(root)
for o in ms: o.parent = root
fl = flecks('lemon_overspray', ms, 320, 5, 0.0012, 0.0035, lambda c, n: n.z > 0.55 and c.z > mx.z * 0.55); fl.parent = root
# outlet: the highest point on the +X end face (the hose couples there)
end = [o.matrix_world @ v.co for o in ms for v in o.data.vertices if (o.matrix_world @ v.co).x > mx.x - 0.03]
outlet = max(end, key=lambda v: v.z * 0.3 - abs(v.y) * 1.0).copy()
for k, v in {'anchor_outlet': outlet, 'anchor_top': Vector((0, 0, mx.z))}.items():
    e = bpy.data.objects.new(k, None); e.location = v; e.empty_display_size = 0.03; sc.collection.objects.link(e); e.parent = root; e['phfd_part'] = 'anchor'
tris = export(sc, root, 'compressor')
meta['compressor'] = dict(size=[round(x, 3) for x in (mx - mn)], tris=tris, outlet=[round(x, 3) for x in outlet])
print('COMP', meta['compressor'])
json.dump(meta, open(os.path.join(OUT, 'props_meta.json'), 'w'), indent=1)
print('PROPS_DONE')
