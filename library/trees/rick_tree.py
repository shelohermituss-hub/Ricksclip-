"""rick_tree.py - parametric "Rick way" tree for Blender 5.3 (CB_RULES section 3, point 1b, 2026-11-21).

TREE = realistic trunk + main branches (Poly Haven bark_brown_02, CC0) + a crown of 10-40 rounded lumpy leaf CLUMPS
(leaf-cell surface, lit tops yellow-green, dark undersides) + a scatter of BIG leaf cards on the clump edges, pointing
outward, that break the silhouette. Never thousands of tiny leaves.

Use (inside Blender):
    import sys; sys.path.insert(0, "<repo>/library/trees"); import rick_tree
    root = rick_tree.make_tree("oak1", height=8, crown_width=9, n_clumps=26, seed=3, lod="near")
    root.location = (x, y, 0)          # the root is an Empty at the trunk foot; children: _trunk, _crown, _leaves
    rick_tree.tri_count(root)          # triangles of the whole tree (evaluated)

Everything is real mesh (no particle systems, no modifiers): it exports to GLB for the three.js staging as is.
Shading data baked into the mesh: point attribute "shade" (0 = deep inside the crown, 1 = outer lit shell) and
face attribute "rnd" (per leaf / per clump random), so a three.js or EEVEE material can rebuild the same look.
"""
import math
import os
import random

import bmesh
import bpy
from mathutils import Matrix, Vector, noise

HERE = os.path.dirname(os.path.abspath(__file__))
TEX = os.path.join(HERE, "tex")

COLOURS = {
    "lit": "#a5cf3a",       # sunlit tops of clumps (yellow-green)
    "mid": "#4c8622",       # body of the crown
    "dark": "#163212",      # undersides and inside
    "card_lit": "#b2d24a",  # big leaf cards, light end
    "card_dark": "#4d7d22", # big leaf cards, dark end
    "bark": "#5a4a3c",      # bark tint (multiplied with the bark photo)
}

LOD = {  # clump icosphere level (bmesh: 3 = 320, 4 = 1280, 5 = 5120 faces), cards per clump, branch detail, secondary branches
    "near": dict(ico=None, cards=70, res_u=8, bev=4, sec=True, roots=5, tri_budget=105000),
    "mid": dict(ico=3, cards=22, res_u=4, bev=2, sec=True, roots=3, tri_budget=30000),
    "far": dict(ico=3, cards=0, res_u=2, bev=1, sec=False, roots=0, tri_budget=3200),
}


def lin(h):
    h = h.lstrip("#")
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((x + .055) / 1.055) ** 2.4 if x > .04045 else x / 12.92 for x in c) + (1.0,)


# ---------------------------------------------------------------- materials
def _nodes(m):
    m.use_nodes = True
    N, L = m.node_tree.nodes, m.node_tree.links
    return N, L, N["Principled BSDF"]


def bark_material(col=None):
    """bark photo (box-projected on object coords, 1 tile = 1.6 m, fissures vertical) x tint, its roughness and normal map"""
    col = col or COLOURS["bark"]
    name = "rt_bark_" + col.lstrip("#")
    m = bpy.data.materials.get(name)
    if m:
        return m
    m = bpy.data.materials.new(name)
    N, L, b = _nodes(m)
    tc = N.new("ShaderNodeTexCoord")
    mp = N.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = (1 / 1.6, 1 / 1.6, 1 / 1.6)
    L.new(tc.outputs["Object"], mp.inputs["Vector"])
    files = {k: os.path.join(TEX, "bark_brown_02_%s_1k.jpg" % k) for k in ("diff", "rough", "nor_gl")}
    if all(os.path.exists(f) for f in files.values()):
        im = {}
        for k, f in files.items():
            t = N.new("ShaderNodeTexImage")
            t.image = bpy.data.images.load(f, check_existing=True)
            if k != "diff":
                t.image.colorspace_settings.name = "Non-Color"
            t.projection = "BOX"
            t.projection_blend = .35
            L.new(mp.outputs["Vector"], t.inputs["Vector"])
            im[k] = t
        mx = N.new("ShaderNodeMix")
        mx.data_type = "RGBA"
        mx.blend_type = "MULTIPLY"
        mx.inputs["Factor"].default_value = 1.0
        mx.inputs["B"].default_value = tuple(c / max(lin(col)[:3]) * 1.1 for c in lin(col)[:3]) + (1,)  # hue of the tint, photo keeps its own light/dark
        L.new(im["diff"].outputs["Color"], mx.inputs["A"])
        L.new(mx.outputs["Result"], b.inputs["Base Color"])
        rr = N.new("ShaderNodeMapRange")
        rr.inputs["To Min"].default_value = .62
        rr.inputs["To Max"].default_value = .95
        L.new(im["rough"].outputs["Color"], rr.inputs["Value"])
        L.new(rr.outputs[0], b.inputs["Roughness"])
        nm = N.new("ShaderNodeNormalMap")
        nm.inputs["Strength"].default_value = 1.2
        L.new(im["nor_gl"].outputs["Color"], nm.inputs["Color"])
        L.new(nm.outputs["Normal"], b.inputs["Normal"])
    else:  # fallback without the download: stretched noise fissures
        print("rick_tree: bark texture missing, run library/trees/fetch_tex.sh; using the procedural fallback")
        mp.inputs["Scale"].default_value = (6, 6, 1.2)
        nz = N.new("ShaderNodeTexNoise")
        nz.inputs["Scale"].default_value = 3.0
        nz.inputs["Detail"].default_value = 8
        L.new(mp.outputs["Vector"], nz.inputs["Vector"])
        ramp = N.new("ShaderNodeValToRGB")
        ramp.color_ramp.elements[0].position = .35
        ramp.color_ramp.elements[0].color = tuple(c * .35 for c in lin(col)[:3]) + (1,)
        ramp.color_ramp.elements[1].color = lin(col)
        L.new(nz.outputs["Fac"], ramp.inputs[0])
        L.new(ramp.outputs[0], b.inputs["Base Color"])
        bp = N.new("ShaderNodeBump")
        bp.inputs["Strength"].default_value = .6
        L.new(nz.outputs["Fac"], bp.inputs["Height"])
        L.new(bp.outputs["Normal"], b.inputs["Normal"])
        b.inputs["Roughness"].default_value = .85
    b.inputs["Specular IOR Level"].default_value = .3
    return m


def _shade_factor(N, L, rnd_amount):
    """factor 0..1 = world normal up (lit tops) x baked "shade" (inside of the crown dark) + per-face random"""
    geo = N.new("ShaderNodeNewGeometry")
    sep = N.new("ShaderNodeSeparateXYZ")
    L.new(geo.outputs["Normal"], sep.inputs[0])
    up = N.new("ShaderNodeMapRange")
    up.inputs["From Min"].default_value = -.8
    up.inputs["From Max"].default_value = .55
    L.new(sep.outputs["Z"], up.inputs["Value"])
    sh = N.new("ShaderNodeAttribute")
    sh.attribute_name = "shade"
    mul = N.new("ShaderNodeMath")
    mul.operation = "MULTIPLY"
    L.new(up.outputs[0], mul.inputs[0])
    L.new(sh.outputs["Fac"], mul.inputs[1])
    rn = N.new("ShaderNodeAttribute")
    rn.attribute_name = "rnd"
    rs = N.new("ShaderNodeMath")
    rs.operation = "MULTIPLY_ADD"
    rs.inputs[1].default_value = rnd_amount
    rs.inputs[2].default_value = -rnd_amount / 2
    L.new(rn.outputs["Fac"], rs.inputs[0])
    add = N.new("ShaderNodeMath")
    add.operation = "ADD"
    add.use_clamp = True
    L.new(mul.outputs[0], add.inputs[0])
    L.new(rs.outputs[0], add.inputs[1])
    return add


def crown_material(cols, leaf_size=.14):
    """clump surface: a mosaic of leaf cells (voronoi), each cell its own green, dark gaps between them, leaf bump;
    dark -> mid -> lit by normal and depth in the crown"""
    name = "rt_crown_%s_%s_%.2f" % (cols["lit"].lstrip("#"), cols["dark"].lstrip("#"), leaf_size)
    m = bpy.data.materials.get(name)
    if m:
        return m
    m = bpy.data.materials.new(name)
    N, L, b = _nodes(m)
    tc = N.new("ShaderNodeTexCoord")
    v1 = N.new("ShaderNodeTexVoronoi")
    v1.inputs["Scale"].default_value = 1 / leaf_size
    v1.inputs["Randomness"].default_value = .9
    L.new(tc.outputs["Object"], v1.inputs["Vector"])
    v2 = N.new("ShaderNodeTexVoronoi")
    v2.feature = "DISTANCE_TO_EDGE"
    v2.inputs["Scale"].default_value = 1 / leaf_size
    v2.inputs["Randomness"].default_value = .9
    L.new(tc.outputs["Object"], v2.inputs["Vector"])
    cell = N.new("ShaderNodeSeparateColor")
    L.new(v1.outputs["Color"], cell.inputs[0])
    f = _shade_factor(N, L, .12)
    # each leaf cell pushes the factor up or down a little (the spotted lit look)
    cj = N.new("ShaderNodeMath")
    cj.operation = "MULTIPLY_ADD"
    cj.inputs[1].default_value = .55
    cj.inputs[2].default_value = -.25
    L.new(cell.outputs["Red"], cj.inputs[0])
    fac = N.new("ShaderNodeMath")
    fac.operation = "ADD"
    fac.use_clamp = True
    L.new(f.outputs[0], fac.inputs[0])
    L.new(cj.outputs[0], fac.inputs[1])
    ramp = N.new("ShaderNodeValToRGB")
    cr = ramp.color_ramp
    cr.elements[0].position, cr.elements[0].color = .08, lin(cols["dark"])
    cr.elements[1].position, cr.elements[1].color = .8, lin(cols["lit"])
    e = cr.elements.new(.42)
    e.color = lin(cols["mid"])
    L.new(fac.outputs[0], ramp.inputs[0])
    # dark gaps between the leaf cells
    gap = N.new("ShaderNodeMapRange")
    gap.inputs["From Min"].default_value = 0.0
    gap.inputs["From Max"].default_value = .09
    gap.inputs["To Min"].default_value = .35
    L.new(v2.outputs["Distance"], gap.inputs["Value"])
    mx = N.new("ShaderNodeMix")
    mx.data_type = "RGBA"
    mx.blend_type = "MULTIPLY"
    mx.inputs["Factor"].default_value = 1.0
    L.new(ramp.outputs[0], mx.inputs["A"])
    L.new(gap.outputs[0], mx.inputs["B"])
    L.new(mx.outputs["Result"], b.inputs["Base Color"])
    bp = N.new("ShaderNodeBump")
    bp.inputs["Strength"].default_value = .7
    bp.inputs["Distance"].default_value = .05
    L.new(v2.outputs["Distance"], bp.inputs["Height"])
    L.new(bp.outputs["Normal"], b.inputs["Normal"])
    rv = N.new("ShaderNodeMapRange")
    rv.inputs["To Min"].default_value = .45
    rv.inputs["To Max"].default_value = .75
    L.new(cell.outputs["Green"], rv.inputs["Value"])
    L.new(rv.outputs[0], b.inputs["Roughness"])
    b.inputs["Specular IOR Level"].default_value = .35
    b.inputs["Sheen Weight"].default_value = 0.0
    return m


def card_material(cols):
    """big leaf cards: per-leaf green (rnd), lit by normal, darker midrib and rim (from the leaf UV), a little translucency"""
    name = "rt_card_%s_%s" % (cols["card_lit"].lstrip("#"), cols["card_dark"].lstrip("#"))
    m = bpy.data.materials.get(name)
    if m:
        return m
    m = bpy.data.materials.new(name)
    N, L, b = _nodes(m)
    f = _shade_factor(N, L, .55)
    ramp = N.new("ShaderNodeValToRGB")
    cr = ramp.color_ramp
    cr.elements[0].position, cr.elements[0].color = .1, lin(cols["dark"])
    e = cr.elements.new(.45)
    e.color = lin(cols["card_dark"])
    cr.elements[1].position, cr.elements[1].color = .78, lin(cols["card_lit"])
    L.new(f.outputs[0], ramp.inputs[0])
    uv = N.new("ShaderNodeUVMap")
    sp = N.new("ShaderNodeSeparateXYZ")
    L.new(uv.outputs["UV"], sp.inputs[0])
    rib = N.new("ShaderNodeMath")  # |u - .5|
    rib.operation = "SUBTRACT"
    rib.inputs[1].default_value = .5
    L.new(sp.outputs["X"], rib.inputs[0])
    ab = N.new("ShaderNodeMath")
    ab.operation = "ABSOLUTE"
    L.new(rib.outputs[0], ab.inputs[0])
    rr = N.new("ShaderNodeMapRange")
    rr.inputs["From Min"].default_value = 0.0
    rr.inputs["From Max"].default_value = .05
    rr.inputs["To Min"].default_value = .7
    L.new(ab.outputs[0], rr.inputs["Value"])
    mx = N.new("ShaderNodeMix")
    mx.data_type = "RGBA"
    mx.blend_type = "MULTIPLY"
    mx.inputs["Factor"].default_value = 1.0
    L.new(ramp.outputs[0], mx.inputs["A"])
    L.new(rr.outputs[0], mx.inputs["B"])
    L.new(mx.outputs["Result"], b.inputs["Base Color"])
    b.inputs["Roughness"].default_value = .8
    b.inputs["Specular IOR Level"].default_value = .1
    tl = N.new("ShaderNodeBsdfTranslucent")
    tl.inputs["Color"].default_value = lin(cols["card_lit"])
    ms = N.new("ShaderNodeMixShader")
    ms.inputs[0].default_value = .22
    L.new(b.outputs[0], ms.inputs[1])
    L.new(tl.outputs[0], ms.inputs[2])
    L.new(ms.outputs[0], N["Material Output"].inputs["Surface"])
    return m


# ---------------------------------------------------------------- geometry helpers
def _mesh_object(name, bm, mat, parent):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    me.materials.append(mat)
    o = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(o)
    o.parent = parent
    return o


def _crown_frame(height, crown_width, crown_height):
    c = Vector((0, 0, height - crown_height / 2))
    ax = Vector((crown_width / 2, crown_width / 2, crown_height / 2))
    return c, ax


def _ell(p, c, ax):
    d = p - c
    return Vector((d.x / ax.x, d.y / ax.y, d.z / ax.z))


def _clump_centres(rnd, n, c, ax):
    """n clump centres on the crown shell (flatter underside), spread by a min distance; one dark core blob first"""
    pts = []
    tries = 0
    while len(pts) < n and tries < n * 200:
        tries += 1
        a = rnd.uniform(0, 2 * math.pi)
        e = math.asin(rnd.uniform(-.55, 1.0))
        r = rnd.uniform(.55, .88)
        q = Vector((math.cos(a) * math.cos(e) * r, math.sin(a) * math.cos(e) * r, math.sin(e) * r))
        mind = 1.25 / max(n, 1) ** (1 / 3)
        if all((q - o).length > mind for o in pts):
            pts.append(q)
    return [Vector((c.x + q.x * ax.x, c.y + q.y * ax.y, c.z + q.z * ax.z)) for q in pts]


def _clumps(name, rnd, centres, c, ax, ico, parent, mat, seed):
    """lumpy blobs: icosphere + low noise (shape) + cell knobs (leaf masses), joined in one mesh; "shade" baked per vertex"""
    bm = bmesh.new()
    sh_layer = bm.verts.layers.float.new("shade")
    rnd_layer = bm.faces.layers.float.new("rnd")
    base_r = min(ax.x, ax.z) * 1.02 / max(len(centres), 1) ** (1 / 3)
    off = Vector((seed * 7.31, seed * 3.17, seed * 1.93))
    blobs = [(c - Vector((0, 0, ax.z * .1)), min(ax.x, ax.z) * .5, True)] + [(p, base_r * rnd.uniform(.85, 1.25), False) for p in centres]
    for p, rr, core in blobs:
        tmp = bmesh.new()
        bmesh.ops.create_icosphere(tmp, subdivisions=ico, radius=rr)
        fr = rnd.random()
        for v in tmp.verts:
            d = v.co.normalized()
            w = p + v.co
            lump = noise.noise(w * (1.1 / rr) + off) * .22
            cell = noise.voronoi(w * (2.4 / rr) + off)[0][0]
            knob = (.35 - min(cell, .35)) * .55
            k = 1 + lump + knob
            if d.z < 0:
                k *= 1 + d.z * .18  # flatter underside
            v.co = d * rr * k
            v.co.z *= .86
        tmp.verts.ensure_lookup_table()
        nv = []
        for v in tmp.verts:
            nv.append(bm.verts.new(v.co + p))
        for f in tmp.faces:
            nf = bm.faces.new([nv[v.index] for v in f.verts])
            nf.smooth = True
            nf[rnd_layer] = fr
        for v in nv:
            e = _ell(v.co, c, ax).length
            v[sh_layer] = .2 if core else max(.25, min(1.0, (e - .35) / .6))
        tmp.free()
    bm.normal_update()
    return _mesh_object(name + "_crown", bm, mat, parent)


LEAF_OUTLINE = [(0, 0), (.22, .12), (.37, .35), (.36, .6), (.22, .82), (0, 1.05), (-.22, .82), (-.36, .6), (-.37, .35), (-.22, .12)]


def _cards(name, rnd, crown, c, ax, count, size, parent, mat):
    """big leaf cards on the outer clump surface, base just inside, blade pointing outward, face turned up/out"""
    me = crown.data
    polys = [(p.center.copy(), p.normal.copy(), p.area) for p in me.polygons]
    keep = []
    for cen, nrm, area in polys:
        q = _ell(cen, c, ax)
        if q.length < .78:
            continue
        out = Vector((q.x / ax.x, q.y / ax.y, q.z / ax.z)).normalized()
        if nrm.dot(out) < .15 or nrm.z < -.75:
            continue
        keep.append((cen, nrm, area))
    if not keep:
        return None
    tot = sum(k[2] for k in keep)
    bm = bmesh.new()
    uvl = bm.loops.layers.uv.new("UVMap")
    rl = bm.faces.layers.float.new("rnd")
    sl = bm.verts.layers.float.new("shade")
    weights = [k[2] / tot for k in keep]
    picks = rnd.choices(keep, weights=weights, k=count)
    up = Vector((0, 0, 1))
    for cen, nrm, area in picks:
        s = size * rnd.uniform(.7, 1.35)
        t = Vector((rnd.uniform(-1, 1), rnd.uniform(-1, 1), rnd.uniform(-1, 1)))
        dirv = (nrm * 1.0 + t * .75 + up * .15).normalized()          # along the leaf, outward
        side = dirv.cross(up if abs(dirv.z) < .95 else Vector((1, 0, 0))).normalized()
        roll = rnd.uniform(-.9, .9)
        side = (Matrix.Rotation(roll, 3, dirv) @ side).normalized()
        face = side.cross(dirv).normalized()
        if face.z < 0:
            face = -face
        base = cen + nrm * rnd.uniform(-.08, .12)
        fr = rnd.random()
        cup = rnd.uniform(.04, .12)
        vs = []
        for (x, y) in LEAF_OUTLINE:
            bend = -(y ** 2) * .18 + abs(x) * cup  # tip droops, edges curl up a little
            vs.append(bm.verts.new(base + side * (x * s) + dirv * (y * s) + face * (bend * s)))
        ctr = bm.verts.new(base + dirv * (.45 * s) + face * (-.02 * s))
        sh = max(.3, min(1.0, (_ell(base, c, ax).length - .35) / .6))
        for v in vs + [ctr]:
            v[sl] = sh
        nvert = len(vs)
        for i in range(nvert):
            f = bm.faces.new((ctr, vs[i], vs[(i + 1) % nvert]))
            f[rl] = fr
            for lp in f.loops:
                if lp.vert is ctr:
                    lp[uvl].uv = (.5, .45)
                else:
                    j = vs.index(lp.vert)
                    lp[uvl].uv = (LEAF_OUTLINE[j][0] / .74 + .5, LEAF_OUTLINE[j][1])
    bm.normal_update()
    return _mesh_object(name + "_leaves", bm, mat, parent)


def _bez(cu, pts, radii, res_u):
    sp = cu.splines.new("BEZIER")
    sp.bezier_points.add(len(pts) - 1)
    sp.resolution_u = res_u
    for bp, p, r in zip(sp.bezier_points, pts, radii):
        bp.co = p
        bp.handle_left_type = bp.handle_right_type = "AUTO"
        bp.radius = r
    return sp


def _lerp_path(pts, t):
    n = len(pts) - 1
    i = min(int(t * n), n - 1)
    u = t * n - i
    return pts[i].lerp(pts[i + 1], u)


def _branches(name, rnd, height, fork_h, r0, centres, c, ax, cfg, parent, mat):
    """trunk (leaning, slightly wavy) + root flare + main limbs to clump groups + one limb per clump; curves -> mesh"""
    cu = bpy.data.curves.new(name + "_wood", "CURVE")
    cu.dimensions = "3D"
    cu.bevel_mode = "ROUND"
    cu.bevel_depth = 1.0
    cu.bevel_resolution = cfg["bev"]
    cu.use_fill_caps = True
    lean = Vector((rnd.uniform(-1, 1), rnd.uniform(-1, 1), 0)) * height * .015
    trunk = [Vector((0, 0, -.15)), Vector((0, 0, fork_h * .35)) + lean * .3 + Vector((rnd.uniform(-1, 1), rnd.uniform(-1, 1), 0)) * r0 * .3,
             Vector((0, 0, fork_h * .75)) + lean * .7, Vector((0, 0, fork_h)) + lean]
    _bez(cu, trunk, [r0 * 1.25, r0 * 1.0, r0 * .92, r0 * .82], cfg["res_u"])
    for i in range(cfg["roots"]):
        a = 2 * math.pi * i / cfg["roots"] + rnd.uniform(-.3, .3)
        d = Vector((math.cos(a), math.sin(a), 0))
        _bez(cu, [Vector((0, 0, r0 * 1.6)), d * r0 * 1.1 + Vector((0, 0, r0 * .35)), d * r0 * 2.4 + Vector((0, 0, -.04))],
             [r0 * .55, r0 * .45, r0 * .12], cfg["res_u"])
    top = trunk[-1]
    if not cfg["sec"]:  # far: the trunk goes on into the crown, nothing else
        _bez(cu, [top, c], [r0 * .82, r0 * .3], cfg["res_u"])
    else:
        nm = 3 + (len(centres) > 18) + (rnd.random() > .5)
        base_a = rnd.uniform(0, 2 * math.pi)
        mains = []
        for k in range(nm):
            a = base_a + 2 * math.pi * k / nm + rnd.uniform(-.25, .25)
            mains.append(a)
        groups = {k: [] for k in range(nm)}
        for p in centres:
            ang = math.atan2(p.y - c.y, p.x - c.x)
            k = min(range(nm), key=lambda j: abs(math.atan2(math.sin(ang - mains[j]), math.cos(ang - mains[j]))))
            groups[k].append(p)
        for k, a in enumerate(mains):
            g = groups[k]
            if g:
                tgt = sum(g, Vector()) / len(g)
            else:
                tgt = c + Vector((math.cos(a) * ax.x * .5, math.sin(a) * ax.y * .5, 0))
            tgt = top.lerp(tgt, .78)
            mid = top.lerp(tgt, .45) + Vector((0, 0, (tgt.z - top.z) * -.12)) + Vector((rnd.uniform(-1, 1), rnd.uniform(-1, 1), 0)) * r0
            path = [top - Vector((0, 0, r0 * .8)), mid, tgt]
            _bez(cu, path, [r0 * .62, r0 * .45, r0 * .26], cfg["res_u"])
            for p in g:
                s = _lerp_path(path, rnd.uniform(.45, .95))
                end = s.lerp(p, .8)
                m2 = s.lerp(end, .5) + Vector((0, 0, rnd.uniform(-.15, .25))) * (end - s).length * .4
                _bez(cu, [s, m2, end], [r0 * .26, r0 * .17, r0 * .07], max(3, cfg["res_u"] // 2))
                if rnd.random() < .45:  # a twig poking between the clumps
                    t2 = end + (end - s).normalized() * (end - s).length * .3 + Vector((rnd.uniform(-1, 1), rnd.uniform(-1, 1), rnd.uniform(0, 1))) * .4
                    _bez(cu, [m2, t2], [r0 * .1, r0 * .03], 3)
    tmp = bpy.data.objects.new(name + "_wood_tmp", cu)
    bpy.context.scene.collection.objects.link(tmp)
    dg = bpy.context.evaluated_depsgraph_get()
    me = bpy.data.meshes.new_from_object(tmp.evaluated_get(dg))
    bpy.data.objects.remove(tmp)
    bpy.data.curves.remove(cu)
    me.name = name + "_trunk"
    for p in me.polygons:
        p.use_smooth = True
    me.materials.clear()
    me.materials.append(mat)
    o = bpy.data.objects.new(name + "_trunk", me)
    bpy.context.scene.collection.objects.link(o)
    o.parent = parent
    return o


# ---------------------------------------------------------------- public
def make_tree(name, height=8.0, crown_width=8.0, n_clumps=24, seed=0, lod="near", colours=None,
              crown_height=None, trunk_radius=None, leaf_card_size=None, leaf_cell=.14):
    """Build a tree at the origin (trunk foot at z=0), return its root Empty.
    height: total metres; crown_width: crown diameter; n_clumps: 10-40 (far keeps at most 7);
    lod: near (full) | mid (simpler clumps, 1/3 of the cards) | far (few blobs, trunk only, no cards);
    colours: dict overriding COLOURS (lit, mid, dark, card_lit, card_dark, bark);
    crown_height: default 0.62*height; trunk_radius: default 0.034*height; leaf_card_size: default 0.045*height (big);
    leaf_cell: size of a leaf cell in the clump surface pattern (m)."""
    cols = dict(COLOURS, **(colours or {}))
    cfg = LOD[lod]
    rnd = random.Random(seed)
    ch = crown_height or height * .62
    r0 = trunk_radius or height * .034
    card = leaf_card_size or height * .045
    c, ax = _crown_frame(height, crown_width, ch)
    n = max(4, min(int(n_clumps), 7)) if lod == "far" else max(6, int(n_clumps))
    centres = _clump_centres(rnd, n, c, ax)
    ico = cfg["ico"]
    if ico is None:  # near: the finest icosphere that keeps the crown inside the triangle budget
        ico = 5 if (len(centres) + 1) * 5120 <= cfg["tri_budget"] else 4  # bmesh levels: 4 = 1280, 5 = 5120 faces per blob
    root = bpy.data.objects.new(name, None)
    root.empty_display_type = "PLAIN_AXES"
    bpy.context.scene.collection.objects.link(root)
    fork_h = height - ch * .92
    _branches(name, rnd, height, fork_h, r0, centres, c, ax, cfg, root, bark_material(cols["bark"]))
    crown = _clumps(name, rnd, centres, c, ax, ico, root, crown_material(cols, leaf_cell), seed)
    if cfg["cards"]:
        _cards(name, rnd, crown, c, ax, cfg["cards"] * len(centres), card, root, card_material(cols))
    root["rick_tree"] = dict(height=height, crown_width=crown_width, n_clumps=n, seed=seed, lod=lod)
    root["tris"] = tri_count(root)
    return root


def tri_count(root):
    t = 0
    for o in [root] + list(root.children_recursive):
        if o.type == "MESH":
            o.data.calc_loop_triangles()
            t += len(o.data.loop_triangles)
    return t
