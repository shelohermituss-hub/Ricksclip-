"""rick_grass.py - "Rick way" grass for Blender 5.3 (CB_RULES section 3, point 1b, 2026-11-21).

GRASS = one flat bright yellow-green ground (soft colour variation, NO blades) + full tufts of tall blades ONLY where
asked: road and drive edges, around trunks, posts and props, a band in front of the lens.
Blade colours start from grass() in our own car_science set (root dark -> tip light, a random per blade), but the
blades here are real mesh (no hair particles): they export to GLB for the three.js staging and never render as sheen.

Use (inside Blender):
    import sys; sys.path.insert(0, "<repo>/library/grass"); import rick_grass as G
    lawn = G.flat_lawn(size=(60, 60))
    G.tufts_along([(x0, y0), (x1, y1), ...], width=1.2, density=6)      # a road edge (list of points or a curve object)
    G.tufts_around(tree_root, r_in=.2, r_out=1.4, density=9)           # around a trunk, post or prop
    G.tufts_lens_band(camera, d0=.4, d1=2.5, density=14, height=.5)    # a band in front of the lens
    G.tufts(points, height=.45, ...)                                    # any points you pick (x, y[, z])
"""
import math
import random

import bmesh
import bpy
from mathutils import Vector

COLOURS = {
    "lawn": "#5e9a28",      # flat lawn, bright yellow-green
    "lawn_var": "#4e8820",  # soft darker patches
    "lawn_hi": "#6faa2e",   # soft lighter patches
    "root": "#2f5a14",      # blade root
    "tip": "#94c63a",       # blade tip
    "var": "#6a9e28",       # per-blade random mix
}


def lin(h):
    h = h.lstrip("#")
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((x + .055) / 1.055) ** 2.4 if x > .04045 else x / 12.92 for x in c) + (1.0,)


def _nodes(m):
    m.use_nodes = True
    N, L = m.node_tree.nodes, m.node_tree.links
    return N, L, N["Principled BSDF"]


def lawn_material(colours=None, patch=9.0):
    """flat lawn: base colour + large soft darker/lighter patches (noise, `patch` m wide) + a faint fine mottling;
    roughness varies 0.78-0.95; no blades, no sheen"""
    cols = dict(COLOURS, **(colours or {}))
    name = "rg_lawn_" + cols["lawn"].lstrip("#")
    m = bpy.data.materials.get(name)
    if m:
        return m
    m = bpy.data.materials.new(name)
    N, L, b = _nodes(m)
    tc = N.new("ShaderNodeTexCoord")
    big = N.new("ShaderNodeTexNoise")
    big.inputs["Scale"].default_value = 1 / patch
    big.inputs["Detail"].default_value = 2
    L.new(tc.outputs["Object"], big.inputs["Vector"])
    fine = N.new("ShaderNodeTexNoise")
    fine.inputs["Scale"].default_value = 3.0
    fine.inputs["Detail"].default_value = 4
    L.new(tc.outputs["Object"], fine.inputs["Vector"])
    ramp = N.new("ShaderNodeValToRGB")
    cr = ramp.color_ramp
    cr.elements[0].position, cr.elements[0].color = .32, lin(cols["lawn_var"])
    cr.elements[1].position, cr.elements[1].color = .68, lin(cols["lawn_hi"])
    e = cr.elements.new(.5)
    e.color = lin(cols["lawn"])
    L.new(big.outputs["Fac"], ramp.inputs[0])
    fm = N.new("ShaderNodeMapRange")
    fm.inputs["To Min"].default_value = .93
    fm.inputs["To Max"].default_value = 1.05
    L.new(fine.outputs["Fac"], fm.inputs["Value"])
    mx = N.new("ShaderNodeMix")
    mx.data_type = "RGBA"
    mx.blend_type = "MULTIPLY"
    mx.inputs["Factor"].default_value = 1.0
    L.new(ramp.outputs[0], mx.inputs["A"])
    L.new(fm.outputs[0], mx.inputs["B"])
    L.new(mx.outputs["Result"], b.inputs["Base Color"])
    rr = N.new("ShaderNodeMapRange")
    rr.inputs["To Min"].default_value = .78
    rr.inputs["To Max"].default_value = .95
    L.new(fine.outputs["Fac"], rr.inputs["Value"])
    L.new(rr.outputs[0], b.inputs["Roughness"])
    b.inputs["Specular IOR Level"].default_value = .25
    b.inputs["Sheen Weight"].default_value = 0.0
    return m


def flat_lawn(material=None, size=(80, 80), location=(0, 0, 0), name="lawn", colours=None):
    """one flat plane (2 triangles) with the lawn material"""
    material = material or lawn_material(colours)
    me = bpy.data.meshes.new(name)
    sx, sy = size[0] / 2, size[1] / 2
    me.from_pydata([(-sx, -sy, 0), (sx, -sy, 0), (sx, sy, 0), (-sx, sy, 0)], [], [(0, 1, 2, 3)])
    me.uv_layers.new(name="UVMap")
    me.materials.append(material)
    o = bpy.data.objects.new(name, me)
    o.location = location
    bpy.context.scene.collection.objects.link(o)
    return o


def blade_material(colours=None):
    """blade: root dark -> tip light along the blade (UV v), each blade mixed toward `var` by its random, a little translucency"""
    cols = dict(COLOURS, **(colours or {}))
    name = "rg_blade_%s_%s" % (cols["root"].lstrip("#"), cols["tip"].lstrip("#"))
    m = bpy.data.materials.get(name)
    if m:
        return m
    m = bpy.data.materials.new(name)
    N, L, b = _nodes(m)
    uv = N.new("ShaderNodeUVMap")
    sp = N.new("ShaderNodeSeparateXYZ")
    L.new(uv.outputs["UV"], sp.inputs[0])
    ramp = N.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].color = lin(cols["root"])
    ramp.color_ramp.elements[1].position = .85
    ramp.color_ramp.elements[1].color = lin(cols["tip"])
    L.new(sp.outputs["Y"], ramp.inputs[0])
    rn = N.new("ShaderNodeAttribute")
    rn.attribute_name = "rnd"
    k = N.new("ShaderNodeMath")
    k.operation = "MULTIPLY"
    k.inputs[1].default_value = .6
    L.new(rn.outputs["Fac"], k.inputs[0])
    mx = N.new("ShaderNodeMix")
    mx.data_type = "RGBA"
    mx.inputs["B"].default_value = lin(cols["var"])
    L.new(k.outputs[0], mx.inputs["Factor"])
    L.new(ramp.outputs[0], mx.inputs["A"])
    L.new(mx.outputs["Result"], b.inputs["Base Color"])
    b.inputs["Roughness"].default_value = .55
    b.inputs["Specular IOR Level"].default_value = .3
    b.inputs["Sheen Weight"].default_value = 0.0
    tl = N.new("ShaderNodeBsdfTranslucent")
    tl.inputs["Color"].default_value = lin(cols["tip"])
    ms = N.new("ShaderNodeMixShader")
    ms.inputs[0].default_value = .18
    L.new(mx.outputs["Result"], tl.inputs["Color"])
    L.new(b.outputs[0], ms.inputs[1])
    L.new(tl.outputs[0], ms.inputs[2])
    L.new(ms.outputs[0], N["Material Output"].inputs["Surface"])
    return m


def tufts(points, height=.45, blades=(14, 26), spread=.09, width=.028, lod="near", colours=None, seed=1, name="tufts", material=None):
    """a full tuft of tall blades at every point (x, y[, z]); blades lean outward and bend, heights vary 0.55-1.25x.
    lod near: 4 segments per blade; mid: 2 segments, half the blades, wider; far: returns None (the lawn is enough)."""
    if lod == "far" or not points:
        return None
    rnd = random.Random(seed)
    seg = 4 if lod == "near" else 2
    nb = blades if lod == "near" else (max(4, blades[0] // 2), max(6, blades[1] // 2))
    wd = width if lod == "near" else width * 1.6
    bm = bmesh.new()
    uvl = bm.loops.layers.uv.new("UVMap")
    rl = bm.faces.layers.float.new("rnd")
    for p in points:
        base = Vector((p[0], p[1], p[2] if len(p) > 2 else 0.0))
        th = height * rnd.uniform(.7, 1.15)
        for i in range(rnd.randint(*nb)):
            a = rnd.uniform(0, 2 * math.pi)
            rr = spread * math.sqrt(rnd.random())
            out = Vector((math.cos(a), math.sin(a), 0))
            root = base + out * rr
            h = th * rnd.uniform(.55, 1.25)
            lean = rnd.uniform(.08, .5) * (.4 + rr / spread)
            bend = rnd.uniform(.1, .45)
            turn = rnd.uniform(-.6, .6)
            d = Vector((math.cos(a + turn), math.sin(a + turn), 0))
            side = Vector((-d.y, d.x, 0))
            w = wd * rnd.uniform(.7, 1.3)
            fr = rnd.random()
            left, right = [], []
            for s in range(seg + 1):
                t = s / seg
                pos = root + d * (h * (lean * t + bend * t * t)) + Vector((0, 0, h * t * (1 - .35 * bend * t)))
                ww = w * (1 - t) ** .8 * .5 if s < seg else 0.0
                left.append(bm.verts.new(pos - side * ww))
                right.append(bm.verts.new(pos + side * ww) if s < seg else None)
            for s in range(seg):
                t0, t1 = s / seg, (s + 1) / seg
                if s < seg - 1:
                    f = bm.faces.new((left[s], right[s], right[s + 1], left[s + 1]))
                    uvs = [(0, t0), (1, t0), (1, t1), (0, t1)]
                else:
                    f = bm.faces.new((left[s], right[s], left[s + 1]))
                    uvs = [(0, t0), (1, t0), (.5, 1)]
                f[rl] = fr
                f.smooth = True
                for lp, uv in zip(f.loops, uvs):
                    lp[uvl].uv = uv
    bm.normal_update()
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    me.materials.append(material or blade_material(colours))
    o = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(o)
    return o


def _poly(path):
    """a list of points, or a curve object (its splines in world space)"""
    if isinstance(path, bpy.types.Object) and path.type == "CURVE":
        pts = []
        for sp in path.data.splines:
            src = sp.bezier_points if sp.type == "BEZIER" else sp.points
            for q in src:
                v = path.matrix_world @ Vector(q.co[:3])
                pts.append((v.x, v.y, v.z))
        return pts
    return [tuple(p) for p in path]


def scatter_band(path, width=1.0, density=6.0, offset=0.0, seed=1):
    """points in a band along a polyline: `width` m wide, centre shifted `offset` m to the left of the travel direction,
    `density` tufts per m2 (clumped: points pull toward a few random clusters so the band is not a hedge)"""
    rnd = random.Random(seed)
    P = [Vector((p[0], p[1], p[2] if len(p) > 2 else 0.0)) for p in _poly(path)]
    out = []
    for a, b in zip(P, P[1:]):
        seg = b - a
        ln = seg.length
        if ln < 1e-6:
            continue
        d = seg / ln
        nrm = Vector((-d.y, d.x, 0))
        n = int(ln * width * density + rnd.random())
        for _ in range(n):
            t = rnd.random()
            o = offset + (rnd.random() - .5) * width * (.6 + .4 * rnd.random())
            q = a + seg * t + nrm * o
            out.append((q.x, q.y, q.z))
    return out


def tufts_along(path, width=1.2, density=6.0, offset=0.0, height=.45, lod="near", colours=None, seed=1, name="tufts_edge"):
    """tufts on a road / drive / fence edge: path = list of (x, y[, z]) or a curve object"""
    return tufts(scatter_band(path, width, density, offset, seed), height=height, lod=lod, colours=colours, seed=seed, name=name)


def tufts_around(obj, r_in=.15, r_out=1.2, density=8.0, height=.45, lod="near", colours=None, seed=1, name=None):
    """a ring of tufts around an object's foot (trunk, post, prop): r_in/r_out measured from its footprint edge;
    denser close to the object"""
    rnd = random.Random(seed)
    bpy.context.view_layer.update()
    objs = [obj] + [c for c in obj.children_recursive if c.type == "MESH"]
    xs, ys = [], []
    for o in objs:
        if o.type != "MESH":
            continue
        for v in o.data.vertices:
            w = o.matrix_world @ v.co
            if w.z < .3 + o.matrix_world.translation.z:
                xs.append(w.x)
                ys.append(w.y)
    if xs:
        cx, cy = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2
        foot = max(max(xs) - min(xs), max(ys) - min(ys)) / 2
    else:
        cx, cy, foot = obj.matrix_world.translation.x, obj.matrix_world.translation.y, .1
    area = math.pi * ((foot + r_out) ** 2 - (foot + r_in) ** 2)
    pts = []
    for _ in range(int(area * density)):
        a = rnd.uniform(0, 2 * math.pi)
        r = foot + r_in + (r_out - r_in) * rnd.random() ** 1.6
        pts.append((cx + math.cos(a) * r, cy + math.sin(a) * r, 0.0))
    return tufts(pts, height=height, lod=lod, colours=colours, seed=seed, name=name or (obj.name + "_tufts"))


def tufts_lens_band(cam, d0=.4, d1=2.5, density=14.0, height=.5, lod="near", colours=None, seed=7, name="tufts_lens"):
    """a band of tufts on the ground in front of the camera, from d0 to d1 m ahead, as wide as the view there"""
    rnd = random.Random(seed)
    bpy.context.view_layer.update()  # a camera placed in the same run has a stale matrix_world otherwise
    m = cam.matrix_world
    fwd = (m.to_3x3() @ Vector((0, 0, -1)))
    fwd.z = 0
    fwd.normalize()
    side = Vector((fwd.y, -fwd.x, 0))
    o = m.translation
    half = math.tan(cam.data.angle / 2) * 1.15
    pts = []
    for _ in range(int((d1 - d0) * (d1 * half * 2) * density)):
        d = d0 + (d1 - d0) * rnd.random()
        s = (rnd.random() * 2 - 1) * d * half
        q = Vector((o.x, o.y, 0)) + fwd * d + side * s
        pts.append((q.x, q.y, 0.0))
    return tufts(pts, height=height, lod=lod, colours=colours, seed=seed, name=name)
