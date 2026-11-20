# props_api.py: helpers for the gun / compressor / hose INSIDE Blender (twins of buildSprayGun / buildCompressor / buildAirHose in sets/assets.js).
#   append(blend, 'SPRAY_GUN' | 'COMPRESSOR') -> root empty      air_hose(A, B, name) -> curve object between two world points
# hose_points() is the SAME rule as assets.js hosePoints(): one lazy loop, lying on the ground, lifting only at its two ends.
import bpy, math
from mathutils import Vector


def lin(hexs):
    h = hexs.lstrip('#'); v = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return [(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4) for c in v] + [1.0]


def bbox(objs):
    mn = Vector((1e9,) * 3); mx = -mn
    for o in objs:
        for v in o.data.vertices:
            w = o.matrix_world @ v.co; mn = Vector(map(min, mn, w)); mx = Vector(map(max, mx, w))
    return mn, mx


def append(blend, name):
    with bpy.data.libraries.load(blend, link=False) as (src, dst):
        dst.collections = [name]
    col = dst.collections[0]; bpy.context.scene.collection.children.link(col)
    return next(o for o in col.objects if o.parent is None and o.type == 'EMPTY')


R_HOSE = 0.0085


def hose_points(A, B, loops=True):
    """A, B: Vector (z up). Plan points of the hose, as assets.js hosePoints (y there = z here)."""
    A, B = Vector(A), Vector(B); d = B - A; d.z = 0
    side = Vector((-d.y, d.x, 0)).normalized(); r = R_HOSE
    def P(t, off, z): p = A + (B - A) * t + side * off; p.z = z; return p
    pts = [A.copy(), P(.04, .02, max(r, A.z * .5)), P(.1, .12, r), P(.3, .32, r), P(.45, .1, r)]
    if loops: pts += [P(.52, -.22, r), P(.42, -.34, r), P(.38, -.12, r * 3), P(.55, .05, r)]
    pts += [P(.72, -.2, r), P(.9, -.06, r), P(.97, 0, max(r, B.z * .5)), B.copy()]
    return pts


def air_hose(A, B, name='air_hose', loops=True):
    pts = hose_points(A, B, loops)
    cu = bpy.data.curves.new(name, 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = R_HOSE; cu.bevel_resolution = 3; cu.use_fill_caps = True
    sp = cu.splines.new('NURBS'); sp.points.add(len(pts) - 1); sp.use_endpoint_u = True; sp.order_u = 3
    for p, q in zip(sp.points, pts): p.co = (q.x, q.y, q.z, 1)
    o = bpy.data.objects.new(name, cu); bpy.context.scene.collection.objects.link(o)
    m = bpy.data.materials.get('hose_rubber') or bpy.data.materials.new('hose_rubber'); m.use_nodes = True
    b = next(n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'); b.inputs['Base Color'].default_value = lin('#26262a'); b.inputs['Roughness'].default_value = 0.6
    cu.materials.append(m)
    br = bpy.data.materials.get('brass_coupler') or bpy.data.materials.new('brass_coupler'); br.use_nodes = True
    b = next(n for n in br.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'); b.inputs['Base Color'].default_value = lin('#dcae52'); b.inputs['Metallic'].default_value = 1; b.inputs['Roughness'].default_value = .25
    for k, p in enumerate((pts[0], pts[-1])):
        bpy.ops.mesh.primitive_cylinder_add(radius=0.013, depth=0.05, location=p); c = bpy.context.object; c.name = name + '_coupler'
        t = (pts[1] - pts[0]) if k == 0 else (pts[-1] - pts[-2]); c.rotation_euler = t.to_track_quat('Z', 'Y').to_euler(); c.data.materials.append(br)
    return o
