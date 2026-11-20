# paint_nodes.py: the truck paint as ONE Blender node group "PHFD_paint" (imported by bl_truck.py and truck_api.py).
# The SAME rules are written in GLSL in sets/assets.js (paintChunk); keep the two in step (constants named alike).
# Coordinates = the truck root's space (Texture Coordinate "Object" pointed at the TRUCK empty): metres, front -X, driver side -Y, Z up, ground z=0.
# Inputs: colA (front coat), colB (rear / new coat), edge (x of the sprayed edge), drain (0..1 dusk), drainA / drainB (1 = that coat is red and drains),
#         wear (0..1), roofOn (white cab roof), P (vector).   Outputs: Color, Rough, CoverB (how much of coat B covers here: hides the gold "under").
import bpy

DUSK = (0.0685, 0.0612, 0.0865, 1)   # #4B4753 linear
SOOT = (0.024, 0.019, 0.016, 1)       # #2b2521 linear
PRIMER = (0.20, 0.19, 0.175, 1)       # #7d7a74 linear
ROOF = (0.888, 0.863, 0.761, 1)       # #F3EFE2 linear
ROOF_Z, CAB_X = 2.12, -0.80           # white roof: above ROOF_Z and in front of CAB_X (the cab's rear wall)
EDGE_W, RUN_COLS = 0.38, 28.0


class NB:
    def __init__(s, nt): s.nt, s.N, s.L = nt, nt.nodes, nt.links
    def link(s, a, b): s.L.new(a, b)
    def _in(s, sock, v):
        if hasattr(v, 'is_output'): s.link(v, sock)
        else: sock.default_value = v
    def m(s, op, a, b=0.0, c=None, clamp=False):
        n = s.N.new('ShaderNodeMath'); n.operation = op; n.use_clamp = clamp
        s._in(n.inputs[0], a); s._in(n.inputs[1], b)
        if c is not None: s._in(n.inputs[2], c)
        return n.outputs[0]
    def sstep(s, e0, e1, x):
        n = s.N.new('ShaderNodeMapRange'); n.interpolation_type = 'SMOOTHSTEP'
        s._in(n.inputs['Value'], x); n.inputs['From Min'].default_value = e0; n.inputs['From Max'].default_value = e1
        return n.outputs['Result']
    def mix(s, a, b, f):
        n = s.N.new('ShaderNodeMix'); n.data_type = 'RGBA'; n.clamp_factor = True
        s._in(n.inputs['Factor'], f); s._in(n.inputs[6], a); s._in(n.inputs[7], b)
        return n.outputs[2]
    def sep(s, v):
        n = s.N.new('ShaderNodeSeparateXYZ'); s.link(v, n.inputs[0]); return n.outputs
    def vec(s, x, y, z):
        n = s.N.new('ShaderNodeCombineXYZ'); s._in(n.inputs[0], x); s._in(n.inputs[1], y); s._in(n.inputs[2], z); return n.outputs[0]


def build_group(wear_img):
    if 'PHFD_paint' in bpy.data.node_groups: return bpy.data.node_groups['PHFD_paint']
    g = bpy.data.node_groups.new('PHFD_paint', 'ShaderNodeTree')
    I = g.interface
    for nm, t, d in (('colA', 'NodeSocketColor', (0.65, 0.007, 0.011, 1)), ('colB', 'NodeSocketColor', (0.65, 0.007, 0.011, 1)), ('edge', 'NodeSocketFloat', 0.3),
                     ('drain', 'NodeSocketFloat', 0.0), ('drainA', 'NodeSocketFloat', 1.0), ('drainB', 'NodeSocketFloat', 1.0), ('wear', 'NodeSocketFloat', 0.6),
                     ('roofOn', 'NodeSocketFloat', 1.0), ('P', 'NodeSocketVector', (0, 0, 0))):
        s = I.new_socket(nm, in_out='INPUT', socket_type=t)
        if t != 'NodeSocketVector': s.default_value = d
    for nm, t in (('Color', 'NodeSocketColor'), ('Rough', 'NodeSocketFloat'), ('CoverB', 'NodeSocketFloat')):
        I.new_socket(nm, in_out='OUTPUT', socket_type=t)
    b = NB(g); gi = g.nodes.new('NodeGroupInput'); go = g.nodes.new('NodeGroupOutput')
    P = gi.outputs['P']; x, y, z = b.sep(P)
    # --- the sprayed edge: ks = (x-edge)/W + sin(y*2.6 - z*1.3)*.22 + (noise-.5)*.5
    nz = g.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 1.6; nz.inputs['Detail'].default_value = 6; b.link(P, nz.inputs['Vector'])
    ks = b.m('ADD', b.m('DIVIDE', b.m('SUBTRACT', x, gi.outputs['edge']), EDGE_W),
             b.m('ADD', b.m('MULTIPLY', b.m('SINE', b.m('SUBTRACT', b.m('MULTIPLY', y, 2.6), b.m('MULTIPLY', z, 1.3))), 0.22),
                 b.m('MULTIPLY', b.m('SUBTRACT', nz.outputs['Fac'], 0.5), 0.5)))
    t = b.sstep(-1.0, 1.0, ks)
    # --- overspray speckle ahead of the edge (coat B dots on coat A, thinning out over 2.2 edge widths)
    vo = g.nodes.new('ShaderNodeTexVoronoi'); vo.inputs['Scale'].default_value = 110.0; b.link(P, vo.inputs['Vector'])
    band = b.m('SUBTRACT', 1.0, b.m('DIVIDE', b.m('MAXIMUM', b.m('MULTIPLY', ks, -1.0), 0.0), 2.2), clamp=True)
    dots = b.m('LESS_THAN', vo.outputs['Distance'], b.m('MULTIPLY', band, 0.34))
    # --- runs: thin vertical drips of coat B on coat A within 0.45 m in front of the edge, each column its own start and length, a bead at the foot
    colx = b.m('FLOOR', b.m('MULTIPLY', x, RUN_COLS)); side = b.m('SIGN', y)
    wn = g.nodes.new('ShaderNodeTexWhiteNoise'); wn.noise_dimensions = '3D'; b.link(b.vec(colx, side, 0.0), wn.inputs['Vector'])
    h = b.sep(wn.outputs['Color'])
    on = b.m('GREATER_THAN', wn.outputs['Value'], 0.78)
    fx = b.m('ABSOLUTE', b.m('SUBTRACT', b.m('FRACT', b.m('MULTIPLY', x, RUN_COLS)), 0.5))
    zs = b.m('ADD', 0.75, b.m('MULTIPLY', h[0], 1.05)); ln = b.m('ADD', 0.12, b.m('MULTIPLY', h[1], 0.38)); ze = b.m('SUBTRACT', zs, ln)
    bead = b.m('SUBTRACT', 1.0, b.m('DIVIDE', b.m('ABSOLUTE', b.m('SUBTRACT', z, ze)), 0.03), clamp=True)
    width = b.m('ADD', 0.10, b.m('MULTIPLY', bead, 0.16))
    near = b.m('MULTIPLY', b.m('LESS_THAN', x, gi.outputs['edge']), b.m('GREATER_THAN', x, b.m('SUBTRACT', gi.outputs['edge'], 0.45)))
    inz = b.m('MULTIPLY', b.m('LESS_THAN', z, zs), b.m('GREATER_THAN', z, b.m('SUBTRACT', ze, 0.02)))
    run = b.m('MULTIPLY', b.m('MULTIPLY', on, b.m('LESS_THAN', fx, width)), b.m('MULTIPLY', near, inz))
    cover = b.m('MAXIMUM', t, b.m('MAXIMUM', dots, run))
    # --- colours: each coat drains to the dusk grey-plum only if it is red (drainA / drainB)
    A = b.mix(gi.outputs['colA'], DUSK, b.m('MULTIPLY', gi.outputs['drain'], gi.outputs['drainA']))
    B = b.mix(gi.outputs['colB'], DUSK, b.m('MULTIPLY', gi.outputs['drain'], gi.outputs['drainB']))
    c = b.mix(A, B, cover)
    roof = b.m('MULTIPLY', b.m('MULTIPLY', b.m('GREATER_THAN', z, ROOF_Z), b.m('LESS_THAN', x, CAB_X)), gi.outputs['roofOn'])
    c = b.mix(c, ROOF, roof)
    # --- wear (wear.png, box projection, tile 2 m): R soot low on the body, G water stains, B stone chips below 0.9 m
    tc = b.m  # noqa
    sc = g.nodes.new('ShaderNodeVectorMath'); sc.operation = 'SCALE'; b.link(P, sc.inputs[0]); sc.inputs['Scale'].default_value = 0.5
    im = g.nodes.new('ShaderNodeTexImage'); im.image = wear_img; im.projection = 'BOX'; im.projection_blend = 0.3; im.image.colorspace_settings.name = 'Non-Color'
    b.link(sc.outputs[0], im.inputs['Vector']); R, G, Bc = b.sep(im.outputs['Color'])
    wear = gi.outputs['wear']
    soot = b.m('MULTIPLY', b.m('MULTIPLY', R, b.m('SUBTRACT', 1.0, b.sstep(0.25, 1.0, z))), b.m('MULTIPLY', wear, 0.7))
    stain = b.m('MULTIPLY', b.m('MULTIPLY', G, b.m('LESS_THAN', z, 1.9)), b.m('MULTIPLY', wear, 0.55))
    chips = b.m('MULTIPLY', b.m('MULTIPLY', b.m('GREATER_THAN', Bc, 0.5), b.m('LESS_THAN', z, 0.9)), b.m('MULTIPLY', wear, 0.8))
    lighter = g.nodes.new('ShaderNodeMix'); lighter.data_type = 'RGBA'; lighter.blend_type = 'SCREEN'; lighter.inputs['Factor'].default_value = 0.35
    b.link(c, lighter.inputs[6]); lighter.inputs[7].default_value = (0.55, 0.53, 0.5, 1)
    c = b.mix(c, lighter.outputs[2], stain)
    c = b.mix(c, SOOT, soot)
    c = b.mix(c, PRIMER, chips)
    rough = b.m('ADD', 0.26, b.m('ADD', b.m('MULTIPLY', stain, 0.3), b.m('MULTIPLY', soot, 0.45)))
    b.link(c, go.inputs['Color']); b.link(rough, go.inputs['Rough']); b.link(cover, go.inputs['CoverB'])
    return g
