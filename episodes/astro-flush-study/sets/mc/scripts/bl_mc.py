"""bl_mc.py: builds the WHOLE mission control room of astro-flush-study (LOOK_INVENTORY section C). blender -b -P bl_mc.py
-> ../out/mc.blend, mc_lite.glb, mc_meta.json. Blender metres, Z up. Front wall y=0 (wall screen, clocks, bulkhead with the cyan cove),
room toward -y, x right. Controller desk left (x -4.7..-0.5), director between the GO and NO GO pedestals (x 0..2), side counter right.
Every material is one flat colour from params_mc.json; screens, clocks and labels are PIL pictures (tex_mc.py) on emissive planes.
Screen states = one named plane per picture (mc_screen_<state>), the api shows one. Movers have their origin at their pivot (meta "movers").
Helpers after library row yft_town_helpers (as rewritten in sets/toilet/scripts/bl_toilet.py: every object keeps its own origin)."""
import bpy, bmesh, math, json, os, sys, random
from mathutils import Vector, Matrix, Euler
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(HERE, '..'); OUT = os.path.join(ROOT, 'out'); TEX = os.path.join(ROOT, 'tex')
os.makedirs(OUT, exist_ok=True); sys.path.insert(0, HERE)
PRM = json.load(open(os.path.join(ROOT, 'params_mc.json'))); PAL = PRM['palette']; TJ = json.load(open(os.path.join(TEX, 'mc_tex.json')))
bpy.ops.wm.read_factory_settings(use_empty=True); SC = bpy.context.scene; rnd = random.Random(7)
def coll(name):
    c = bpy.data.collections.new(name); SC.collection.children.link(c); return c
SET, STAND, LIGHTS = coll('mc_set'), coll('standins'), coll('lights')
def lin(h):
    h = h.lstrip('#'); v = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return [(c / 12.92 if c <= .04045 else ((c + .055) / 1.055) ** 2.4) for c in v] + [1.]
MATS = {}
def mat(name, rough=.85, metal=0., emit=None, es=0., png=None, col=None, coat=0.):
    """flat principled colour; png = an emissive picture (screens, clocks, labels) shown at its own sRGB values (strength 1, Standard view)."""
    if name in MATS: return MATS[name]
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = lin(col or PAL.get(name, '#ff00ff')); b.inputs['Roughness'].default_value = rough; b.inputs['Metallic'].default_value = metal
    b.inputs['Specular IOR Level'].default_value = .5 if rough < .6 else .15
    if coat: b.inputs['Coat Weight'].default_value = coat; b.inputs['Coat Roughness'].default_value = .08
    if png:
        t = nt.nodes.new('ShaderNodeTexImage'); t.name = 'pic'; t.image = bpy.data.images.load(os.path.join(TEX, png)); t.extension = 'EXTEND'
        nt.links.new(t.outputs[0], b.inputs['Emission Color']); b.inputs['Base Color'].default_value = (0, 0, 0, 1); b.inputs['Emission Strength'].default_value = 1.
        b.inputs['Specular IOR Level'].default_value = 0.
    if emit: b.inputs['Emission Color'].default_value = lin(emit); b.inputs['Emission Strength'].default_value = es
    MATS[name] = m; return m
def MT(loc=(0, 0, 0), rot=(0, 0, 0)): return Matrix.Translation(loc) @ Euler([math.radians(a) for a in rot]).to_matrix().to_4x4()
def abox(bm, sx, sy, sz, M=None, bev=.008):
    t = bmesh.new(); bmesh.ops.create_cube(t, size=1.)
    for v in t.verts: v.co = Vector((v.co.x * sx, v.co.y * sy, v.co.z * sz))
    if bev and min(sx, sy, sz) > bev * 2.2: bmesh.ops.bevel(t, geom=t.edges[:], offset=bev, segments=2, affect='EDGES', profile=.5)
    if M: bmesh.ops.transform(t, matrix=M, verts=t.verts[:])
    me = bpy.data.meshes.new('_t'); t.to_mesh(me); t.free(); bm.from_mesh(me); bpy.data.meshes.remove(me)
def alathe(bm, prof, seg=24, M=None, caps=True):
    """rings around local Z. prof rows: (radius, z)."""
    M = M or Matrix(); rings = [[bm.verts.new(M @ Vector((math.cos(k * 2 * math.pi / seg) * p[0], math.sin(k * 2 * math.pi / seg) * p[0], p[1]))) for k in range(seg)] for p in prof]
    for a, b in zip(rings, rings[1:]):
        for k in range(seg): bm.faces.new((a[k], a[(k + 1) % seg], b[(k + 1) % seg], b[k]))
    if caps: bm.faces.new(rings[0][::-1]); bm.faces.new(rings[-1])
def aquad(bm, w, h, M=None):
    M = M or Matrix(); vs = [bm.verts.new(M @ Vector(p)) for p in ((-w / 2, -h / 2, 0), (w / 2, -h / 2, 0), (w / 2, h / 2, 0), (-w / 2, h / 2, 0))]
    f = bm.faces.new(vs); uv = bm.loops.layers.uv.verify()
    for lp, c in zip(f.loops, ((0, 0), (1, 0), (1, 1), (0, 1))): lp[uv].uv = c
MOVERS, ANCH = {}, {}
def obj(name, bm, m, loc=(0, 0, 0), rot=(0, 0, 0), c=None, smooth=False, mover=None):
    """mesh object with its origin at loc (mesh local to it). mover = dict of extra meta (pressed/open transforms, frames) -> meta movers."""
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    if smooth:
        sharp = [e for e in bm.edges if len(e.link_faces) == 2 and e.calc_face_angle(0) > .6]
        if sharp: bmesh.ops.split_edges(bm, edges=sharp)
        for f in bm.faces: f.smooth = True
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free(); o = bpy.data.objects.new(name, me); me.materials.append(m if not isinstance(m, str) else mat(m))
    o.location = loc; o.rotation_euler = [math.radians(a) for a in rot]; (c or SET).objects.link(o)
    if mover is not None: MOVERS[name] = dict(loc=[round(v, 4) for v in loc], rot=list(rot), **mover)
    return o
def B(): return bmesh.new()
def box(name, size, loc, m, bev=.01, rot=(0, 0, 0), **kw):
    bm = B(); abox(bm, *size, bev=bev); return obj(name, bm, m, loc, rot, **kw)
def cyl(name, r, h, loc, m, rot=(0, 0, 0), seg=24, r2=None, **kw):
    bm = B(); alathe(bm, [(r, -h / 2), (r if r2 is None else r2, h / 2)], seg); return obj(name, bm, m, loc, rot, smooth=True, **kw)
def pic(name, w, h, loc, rot, png, **kw):
    """emissive picture plane; local XY = picture, +Z = its face. rot (90,0,0) faces -y (into the room)."""
    bm = B(); aquad(bm, w, h); return obj(name, bm, mat(os.path.splitext(png)[0], png=png), loc, rot, **kw)

# ================================================================== room shell
WX, YB, ZC = 10., -24., 7.2         # deep room: his f180 puts the screen about 2.3x farther from the lens than the director           # half width, back of the room (behind the camera), ceiling height
box('front_wall', (2 * WX, .3, ZC), (0, .15, ZC / 2), 'side_wall', bev=0)
for s in (-1, 1): box('side_wall_%s' % ('l' if s < 0 else 'r'), (.3, -YB, ZC), (s * (WX + .15), YB / 2, ZC / 2), 'side_wall', bev=0)
box('back_wall', (2 * WX, .3, ZC), (0, YB - .15, ZC / 2), 'side_wall', bev=0)
box('carpet', (2 * WX, -YB, .1), (0, YB / 2, -.05), mat('carpet', rough=1.), bev=0)
bm = B()                               # carpet speckles: small lighter squares (pixel confetti), geometry
for i in range(5200):
    x, y, s = rnd.uniform(-WX + .2, WX - .2), rnd.uniform(YB + .3, -.2), rnd.choice((.025, .035, .045))
    abox(bm, s, s, .004, Matrix.Translation((x, y, .002)), bev=0)
obj('carpet_specks', bm, mat('carpet_speck', rough=1.))
# bulkhead over the screen wall: vertical dark face, the cyan cove strip on its lower front edge, dark underside (seen from below)
BY, BZ = -1.25, 6.55
box('bulkhead_face', (2 * WX, .12, ZC - BZ), (0, BY, (ZC + BZ) / 2), 'bulkhead', bev=.01)
box('bulkhead_under', (2 * WX, -BY, .1), (0, BY / 2, BZ - .05), 'soffit', bev=0)
box('cove_strip', (2 * WX, .1, .11), (0, BY - .04, BZ + .03), mat('cove_strip', emit=PAL['cove_strip'], es=4.), bev=.02)
# ceiling with a light grid (tiles 0.93 m) and round downlights
box('ceiling', (2 * WX, -(YB - BY), .1), (0, (YB + BY) / 2, ZC + .05), mat('ceiling', rough=.9), bev=0)
bm = B(); T = .93
for k in range(int(2 * WX / T) + 1): abox(bm, .035, -(YB - BY), .02, Matrix.Translation((-WX + k * T, (YB + BY) / 2, ZC - .01)), bev=0)
for k in range(int((BY - YB) / T) + 1): abox(bm, 2 * WX, .035, .02, Matrix.Translation((0, BY - k * T, ZC - .01)), bev=0)
obj('ceiling_grid', bm, mat('ceiling_grid', rough=.8))
bm = B()
for x, y in ((-3.5, -4.0), (3.5, -4.0), (-3.5, -9.5), (3.5, -9.5), (-3.5, -15.0), (3.5, -15.0), (0, -20.0)): alathe(bm, [(.32, ZC - .03), (.32, ZC - .01)], 24, Matrix.Translation((x, y, 0)))
obj('downlights', bm, mat('downlight', emit=PAL['downlight'], es=6.))

# ================================================================== wall screen, clock strip, side monitors
SW, SH, SZ0 = 7.0, 7.0 * 1080 / 1920, 1.40          # wall screen 16:9, bottom edge at 1.4 m
SZC, SY = SZ0 + SH / 2, -.19
box('screen_bezel', (SW + .3, .2, SH + .3), (0, -.08, SZC), 'bezel', bev=.03)
SCREENS = {}
for st, d in PRM['screens'].items():
    if st.startswith('_'): continue
    pic('mc_screen_' + st, SW, SH, (0, SY, SZC), (90, 0, 0), d['png'], mover=dict(kind='screen_state', state=st, f=d['f']))
    SCREENS[st] = 'mc_screen_' + st
u0, v0, u1, v1 = TJ['space_rect_uv']           # the small space-view panel: the previous shot plays here (placeholder picture)
pw, ph = (u1 - u0) * SW, (v1 - v0) * SH; pcx, pcz = -SW / 2 + (u0 + u1) / 2 * SW, SZ0 + SH - (v0 + v1) / 2 * SH
pic('mc_space_panel', pw, ph, (pcx, SY - .006, pcz), (90, 0, 0), 'mc_space_panel.png', mover=dict(kind='picture', show_with='map', f=[120, 186]))
SPACE = dict(uv=TJ['space_rect_uv'], centre=[round(pcx, 4), SY - .006, round(pcz, 4)], size=[round(pw, 4), round(ph, 4)], facing='-y',
             px_of_screen=[round(u0 * 1920), round(v0 * 1080), round(u1 * 1920), round(v1 * 1080)])
CLW, CLH, CLZ = SW, SW * 192 / 2560, SZ0 + SH + .42
box('clock_housing', (SW + .3, .26, CLH + .16), (0, -.1, CLZ), 'clock_housing', bev=.02)
pic('mc_clock', CLW, CLH, (0, -.235, CLZ), (90, 0, 0), 'mc_clock_s3_0.png', mover=dict(kind='picture_seq', seq=TJ['clock_seq']))
for s, x in ((1, 4.75), (-1, -4.75)):          # side monitors, portrait, turned a little toward the room centre
    nm = 'side_monitor_%s' % ('r' if s > 0 else 'l'); rz = -12 * s
    box(nm + '_frame', (1.0, .12, 1.48), (x, -.35, 3.15), 'side_monitor_frame', rot=(0, 0, rz), bev=.02)
    pic('mc_' + nm, .93, 1.395, (x + .07 * math.sin(math.radians(rz)), -.42, 3.15), (90, 0, rz), 'mc_side_a.png' if s > 0 else 'mc_side_b.png')

# ================================================================== controller desk (FAO, CAPCOM, GUIDO)
DX0, DX1, DY, DD, DH = -1.5, .37, -12.25, .8, .95      # round 2: solved from his f180 (heads .62 m apart, GUIDO end just left of the GO pedestal)
DXC, DL, FY = (DX0 + DX1) / 2, DX1 - DX0, DY - DD / 2
box('desk_body', (DL, DD, DH - .09), (DXC, DY, (DH - .09) / 2), 'desk_front', bev=.015)
box('desk_top', (DL + .12, DD + .1, .09), (DXC, DY - .03, DH - .045), 'desk_top', bev=.02)
box('desk_band', (DL, .02, .16), (DXC, FY - .011, DH - .16), 'desk_band', bev=0)
STN = [DX0 + DL * (k + .5) / 3 for k in range(3)]
for k, (lab, x) in enumerate(zip(('fao', 'capcom', 'guido'), STN)):
    pic('mc_label_' + lab, .11 * 512 / 96, .11, (x, FY - .023, DH - .16), (90, 0, 0), 'mc_label_%s.png' % lab)
    box('desk_panel_frame_%d' % k, (DL / 3 - .08, .02, DH - .4), (x, FY - .01, (DH - .4) / 2 + .07), 'desk_panel_frame', bev=.005)
    box('desk_panel_%d' % k, (DL / 3 - .13, .03, DH - .46), (x, FY - .012, (DH - .4) / 2 + .07), 'desk_panel', bev=.005)
    box('keyboard_%d' % k, (.42, .2, .05), (x - .03, DY - .17, DH + .025), 'keyboard', rot=(-6, 0, 0), bev=.01)
    box('monitor_base_%d' % k, (.5, .28, .1), (x, DY + .14, DH + .05), 'monitor_base', bev=.015)
    box('monitor_line_%d' % k, (.46, .01, .015), (x, DY - .005, DH + .085), mat('cyan_line', emit=PAL['cyan_line'], es=3.), bev=0)
cyl('mug', .055, .13, (STN[0] + .22, DY - .22, DH + .065), 'mug', seg=16)
cyl('mug_band', .057, .035, (STN[0] + .22, DY - .22, DH + .08), 'mug_band', seg=16)
ANCH['desk'] = [DXC, DY, DH]
for lab, x in zip(('fao', 'capcom', 'guido'), STN): ANCH['ctl_' + lab] = [round(x, 3), DY + .65, 0]
# bin with paper balls, right of the desk (gone after f150 when the director walks in)
bm = B(); alathe(bm, [(.24, 0), (.27, .55)], 24); alathe(bm, [(.25, .53), (.255, .555)], 24)
for i in range(5): abox(bm, .1, .1, .1, Matrix.Translation((rnd.uniform(-.1, .1), rnd.uniform(-.1, .1), .52 + rnd.uniform(0, .08))), bev=.03)
o = obj('mc_bin', bm, 'bin', (.8, -11.95, 0), smooth=True, mover=dict(kind='visible', f_off=150))
bm = B()
for i in range(4): alathe(bm, [(.0, -.07), (.07, -.035), (.075, .03), (0, .07)], 10, Matrix.Translation((rnd.uniform(-.12, .12), rnd.uniform(-.12, .12), .58)))
obj('mc_bin_paper', bm, 'paper', (.8, -11.95, 0), smooth=True, mover=dict(kind='visible', f_off=150))

# ================================================================== flight director: GO and NO GO pedestals with floor rings
def pedestal(tag, x, y, top=True):
    disc = B(); alathe(disc, [(.39, 0), (.39, .025)], 40); obj('floor_disc_' + tag, disc, 'floor_ring_disc', (x, y, 0), smooth=True)
    bm = B(); n = 48
    for k in range(n):                     # flat yellow annulus (r .31-.36), emissive
        a0, a1 = 2 * math.pi * k / n, 2 * math.pi * (k + 1) / n
        vs = [bm.verts.new((r * math.cos(a), r * math.sin(a), .028)) for r, a in ((.31, a0), (.36, a0), (.36, a1), (.31, a1))]; bm.faces.new(vs)
    obj('floor_ring_' + tag, bm, mat('floor_ring', emit=PAL['floor_ring'], es=1.6), (x, y, 0))
    cyl('pedestal_pole_' + tag, .035, PT - .2, (x, y, (PT - .2) / 2 + .02), 'pedestal_pole', seg=12)
    if top: box('button_box_' + tag, (.36, .3, .22), (x, y, PT - .11), 'button_box', bev=.025)
    ANCH['pedestal_' + tag] = [x, y, PT]
GX, GY, NX, NY, PT = .49, -13.0, 1.44, -13.3, .98      # PT = top of the button boxes
pedestal('go', GX, GY); pedestal('nogo', NX, NY, top=False)
bm = B(); alathe(bm, [(.09, 0), (.09, .02), (.075, .06), (.04, .085), (0, .09)], 20); obj('mc_go_button', bm, mat('go_dome', emit=PAL['go_dome'], es=1.5, rough=.3), (GX, GY - .02, PT), smooth=True, mover=dict(kind='press', pressed=dict(loc=[GX, GY - .02, PT - .025], rot=[0, 0, 0]), f=[224, 227]))
# NO GO: the whole box pops up onto the pedestal at f176-180 (scale 0 -> 1 from its base), cover flips up (f260), red dome presses (f263-264)
NB = (NX, NY, PT - .22)
bm = B(); abox(bm, .36, .3, .22, MT((0, 0, .11)), bev=.025); obj('mc_nogo_box', bm, 'button_box', NB, mover=dict(kind='pop', f=[176, 180], scale0=[1, 1, 0.01]))
pic('mc_label_nogo', .2, .05, (NX, NY - .152, PT - .16), (90, 0, 0), 'mc_label_nogo.png')
bm = B(); alathe(bm, [(.1, 0), (.1, .02), (.085, .06), (.05, .085), (0, .09)], 20)
obj('mc_nogo_button', bm, mat('nogo_dome', emit=PAL['nogo_dome'], es=.9, rough=.3), (NX, NY - .02, PT), smooth=True,
    mover=dict(kind='press', pressed=dict(loc=[NX, NY - .02, PT - .035], rot=[0, 0, 0]), f=[262, 264]))
bm = B(); abox(bm, .3, .26, .025, MT((0, -.13, .0125)), bev=.008); abox(bm, .3, .02, .1, MT((0, -.25, -.04)), bev=.006); abox(bm, .02, .26, .1, MT((.14, -.13, -.04)), bev=.006); abox(bm, .02, .26, .1, MT((-.14, -.13, -.04)), bev=.006)
obj('mc_nogo_cover', bm, mat('nogo_cover', emit=PAL['nogo_cover'], es=.6, rough=.4), (NX, NY + .13, PT + .1),
    mover=dict(kind='hinge', open=dict(loc=[NX, NY + .13, PT + .1], rot=[-105, 0, 0]), f=[258, 261], axis='x, hinge at the back edge'))
ANCH['director'] = [.9, -13.21, 0]; ANCH['nogo_button'] = [NX, NY - .02, PT]; ANCH['go_button'] = [GX, GY - .02, PT]

# ================================================================== side counter with books (right)
CX0, CX1, CY = 1.75, 3.6, -10.7
box('counter_body', (CX1 - CX0, 1.0, .91), ((CX0 + CX1) / 2, CY, .455), 'desk_front', bev=.015)
box('counter_top', (CX1 - CX0 + .1, 1.1, .09), ((CX0 + CX1) / 2, CY - .02, .955), 'desk_top', bev=.02)
for k in range(4):
    x = CX0 + (k + .5) * (CX1 - CX0) / 4; box('counter_door_%d' % k, (.02, .012, .72), (x + (CX1 - CX0) / 8 - .01, CY - .506, .43), 'desk_panel_frame', bev=0)
for k, (c, hgt) in enumerate((('book_white', .36), ('book_red', .34), ('book_yellow', .37), ('book_blue', .35))):
    box('book_%d' % k, (.07, .26, hgt), (2.15 + k * .085, CY - .1, 1.0 + hgt / 2), c, bev=.008)
box('book_white_2', (.07, .26, .36), (2.15 - .085, CY - .1, 1.18), 'book_white', bev=.008)

# ================================================================== stand-in cards (excluded from the GLB)
CK = {'director': ('#f4f3ef', 1.82), 'ctl_fao': ('#2ab29a', 1.62), 'ctl_capcom': ('#487ede', 1.66), 'ctl_guido': ('#4b4f5e', 1.68)}
STANDINS = {}
def standin(name, col, h, loc, shots):
    bm = B(); w = .62
    vs = [bm.verts.new(p) for p in ((-w / 2, 0, 0), (w / 2, 0, 0), (w / 2, 0, h - w), (-w / 2, 0, h - w))]; bm.faces.new(vs)
    alathe(bm, [(w / 2, -.0), (w / 2, .0001)], 32, MT((0, 0, h - w / 2), (90, 0, 0)))
    m = bpy.data.materials.new('standin_' + name); m.use_nodes = True; m.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = lin(col)
    m.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value = 1.
    obj('standin_' + name, bm, m, loc, (0, 0, 0), c=STAND); STANDINS['standin_' + name] = shots
standin('director', *CK['director'], ANCH['director'], [3, 10])
for lab in ('fao', 'capcom', 'guido'): standin('ctl_' + lab, *CK['ctl_' + lab], ANCH['ctl_' + lab], [3, 10])

# ================================================================== lights (the api sets colours and watts per mood)
def light(name, loc, rot, kind='AREA', size=1., watts=100.):
    d = bpy.data.lights.new(name, kind); d.energy = watts
    if kind == 'AREA': d.shape = 'RECTANGLE'; d.size, d.size_y = size if isinstance(size, (int, float)) else size[0], size if isinstance(size, (int, float)) else size[1]
    o = bpy.data.objects.new(name, d); o.location = loc; o.rotation_euler = [math.radians(a) for a in rot]; LIGHTS.objects.link(o); return o
light('fill_ceiling', (0, -12, ZC - .3), (0, 0, 0), size=(16, 16), watts=2200)
light('fill_front', (1, -23.6, 4.5), (80, 0, 0), size=(10, 3), watts=600)
light('screen_spill', (0, -.6, SZC), (-90, 0, 0), size=(SW, SH), watts=900)
SC.world = bpy.data.worlds.new('mc_world'); SC.world.use_nodes = True

# ================================================================== meta, render settings, save, GLB
CAMS = {}
for k, c in PRM['cams'].items(): CAMS[k] = c
META = dict(place='mc', doc='mission control (LOOK_INVENTORY C); shots 3 (f120-283) and 10 (f803-866). Blender metres Z up; kit converts with ctx.B2T.',
            anchors=ANCH, cams=CAMS, cam_monitor=dict(PRM['cams'][PRM['cam_monitor']], note='framing at f283: the room as seen inside the ship wall monitor (shot 4, f284-410)'),
            movers=MOVERS, screens={k: v for k, v in PRM['screens'].items() if not k.startswith('_')}, screen_planes=SCREENS, space_panel=SPACE,
            screen=dict(size=[SW, round(SH, 4)], centre=[0, SY, round(SZC, 4)], px=[1920, 1080]), clock=dict(size=[CLW, round(CLH, 4)], z=round(CLZ, 4), seq=TJ['clock_seq']),
            offcourse_seq=TJ['offcourse_seq'], moods={k: v for k, v in PRM['moods'].items() if not k.startswith('_')}, palette=PAL, standins=STANDINS,
            state_default=dict(screen='map', mood='blue', clock=0, off=8, shot=3, director=1, bin=0, nogo_box=1, press=0, cover=0))
json.dump(META, open(os.path.join(OUT, 'mc_meta.json'), 'w'), indent=1)
sys.path.insert(0, HERE); import mc_api
mc_api._M.clear(); mc_api._M.update(META); mc_api.set_state(SC, **META['state_default'])
SC.render.engine = 'CYCLES'; SC.cycles.samples = 16; SC.cycles.use_denoising = True; SC.view_settings.view_transform = 'Standard'; SC.view_settings.look = 'None'
SC.render.resolution_x, SC.render.resolution_y = 540, 960; SC.cycles.max_bounces = 6
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, 'mc.blend'))
bpy.ops.object.select_all(action='DESELECT')
for o in SET.objects: o.hide_render = o.hide_viewport = False; o.hide_set(False); o.select_set(True)
bpy.ops.export_scene.gltf(filepath=os.path.join(OUT, 'mc_lite.glb'), use_selection=True, export_apply=True, export_yup=True, export_image_format='JPEG')
print('BUILT mc', len(SET.objects), 'objects', len(MOVERS), 'movers')
