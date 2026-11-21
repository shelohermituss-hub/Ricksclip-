# bl_xray.py: PLACE X, the 1970s clinic corner with the X-ray light box (row 19) + THE X-RAY WORLD inside the stomach (rows 20-22). Set-builder 2026-11-21.
# blender -b --factory-startup --python bl_xray.py -- <tex dir> <out dir>  -> out/xray.blend, out/xray_lite.glb, out/xray_meta.json. Prints XRAY_DONE.
# Frame: Blender metres, Z up. Clinic: floor z 0, back wall (light box) inner face y 2.2, window wall x -2.2. X-ray world centred at X0 = (30, 0, 0).
# States: lining shape key 'puff' 0 (thin wrinkled lining) -> 1 (quilted mattress, runway dashes up); mini Cessna parked at path[0]; slide path in meta.
import bpy, bmesh, sys, os, math, random
from mathutils import Vector
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.append(os.path.join(HERE, '..', '..'))
import pe_bl as B
a = sys.argv[sys.argv.index('--') + 1:]; TEX, OUT = os.path.abspath(a[0]), os.path.abspath(a[1]); os.makedirs(OUT, exist_ok=True)
sc = B.reset(); R = random.Random(19); T = lambda f: os.path.join(TEX, f)
CL = B.coll('clinic'); XW = B.coll('xray_world')
# ---------------------------------------------------------------- materials (palette: LOOK_BIBLE; no red anywhere)
M = dict(
  wall=B.pmat('wall_warmwhite', '#f2f0e6', .8, bump=.15), wains=B.pmat('wainscot_paleteal', '#a9d3c8', .55, coat=.3), trim=B.pmat('trim_white_gloss', '#fbfbf6', .25, coat=.5),
  skirt=B.pmat('skirting_teal', '#5d8a83', .4, coat=.3), lino=B.pmat('lino_tiles', '#ffffff', .35, img=T('lino.png'), coat=.4),
  ceil=B.pmat('ceiling_tile', '#f4f3ee', .9, bump=.4), tbar=B.pmat('tbar_white', '#e2e2dc', .4, metal=.3),
  enamel=B.pmat('enamel_cream', '#efece0', .3, coat=.6), chrome=B.pmat('chrome', '#e9ecef', .08, metal=1.), steel=B.pmat('steel_brushed', '#b9bec4', .3, metal=1.),
  rubber=B.pmat('rubber_black', '#26262b', .7), vinyl=B.pmat('vinyl_mint', '#8fc9b4', .35, coat=.4, bump=.1), paper=B.pmat('exam_paper', '#fbfbf7', .9, bump=.25),
  diff=B.pmat('lightbox_diffuser', '#e8fbff', .4, emit='#d8f8ff', es=1.6), film=B.pmat('film_hero', '#ffffff', .25, emit='#ffffff', es=1.0, img=T('film_hero.png'), emit_only=True),
  film2=B.pmat('film_before', '#ffffff', .25, emit='#ffffff', es=.85, img=T('film_before.png'), emit_only=True), chart=B.pmat('eye_chart', '#ffffff', .6, img=T('eye_chart.png')),
  wood=B.pmat('wood_desk_teak', '#9a6a3f', .45, coat=.3, bump=.2), manila=B.pmat('manila_envelope', '#d8b874', .8, bump=.2), amber=B.pmat('lamp_amber', '#ffb43a', .3, emit='#ffb43a', es=3.),
  navy_sign=B.pmat('sign_green_enamel', '#2f6b57', .3, coat=.5), letter=B.pmat('letter_white', '#fbfbf2', .4), ink=B.pmat('ink_dark', '#24242a', .5),
  glass=B.pmat('glass_clear', '#d8ecf2', .05, alpha=.25), sky=B.pmat('window_sky_PLACEHOLDER', '#9cc8f4', 1., emit='#bfe0ff', es=1.6),
  blind=B.pmat('blind_slat_cream', '#ede6d2', .4, metal=.2), plant=B.pmat('leaf_green', '#4f9a4a', .5), pot=B.pmat('pot_terracotta_tan', '#c78a55', .6),
  apron=B.pmat('lead_apron_greyblue', '#6f8296', .55, bump=.3), beige=B.pmat('phone_beige', '#d9cdb0', .3, coat=.4), mug=B.pmat('mug_green', '#4d9b74', .25, coat=.6),
  bulb=B.pmat('lamp_bulb_warm', '#fff2d0', .2, emit='#ffe3b0', es=8.), lamp_green=B.pmat('desk_lamp_green', '#3f7f62', .3, coat=.6, metal=.4),
  metalbite=B.pmat('bite_paint_white', '#f3f4f1', .25, coat=.5), metalnavy=B.pmat('bite_paint_navy', '#1d3461', .25, coat=.5), alu=B.pmat('bite_alu_cut', '#c8ccd0', .28, metal=1.),
)
B.use(CL)
W0, W1, D0, D1, H = -2.2, 2.2, -2.6, 2.2, 2.7
# ---------------------------------------------------------------- shell: floor, walls (window hole in the left wall, door in the right), 4th wall, ceiling
fl = B.box('floor_lino', (W1 - W0 + .4, D1 - D0 + .4, .04), (0, (D0 + D1) / 2, -.02), M['lino'], bev=0); fl['uv_size'] = .6
def wall_x(name, x, y0, y1, holes=(), side=1):
    """wall at x from y0..y1 with rectangular holes (ya, yb, za, zb): built from boxes; wainscot to 1.0 m, chair rail, skirting."""
    th = .12; xs = x - side * th / 2; segs = [(y0, y1, 0, H)]
    for ya, yb, za, zb in holes:
        out = []
        for s in segs:
            if s[1] <= ya or s[0] >= yb: out.append(s); continue
            if s[0] < ya: out.append((s[0], ya, s[2], s[3]))
            if s[1] > yb: out.append((yb, s[1], s[2], s[3]))
            out.append((max(s[0], ya), min(s[1], yb), s[2], za)); out.append((max(s[0], ya), min(s[1], yb), zb, s[3]))
        segs = out
    for k, (a_, b_, za, zb) in enumerate(segs):
        if zb - za < .01: continue
        B.box('%s_%d' % (name, k), (th, b_ - a_, zb - za), (xs, (a_ + b_) / 2, (za + zb) / 2), M['wall'], bev=0)
        if za < 1.0:
            z1 = min(zb, 1.0); B.box('%s_wains_%d' % (name, k), (.012, b_ - a_, z1 - za), (x + side * .006, (a_ + b_) / 2, (za + z1) / 2), M['wains'], bev=0)
    B.box(name + '_rail', (.035, y1 - y0, .05), (x + side * .018, (y0 + y1) / 2, 1.0), M['trim'], bev=.008)
    B.box(name + '_skirt', (.025, y1 - y0, .12), (x + side * .013, (y0 + y1) / 2, .06), M['skirt'], bev=.006)
def wall_y(name, y, x0, x1, holes=(), side=-1):
    th = .12; segs = [(x0, x1, 0, H)]
    for xa, xb, za, zb in holes:
        out = []
        for s in segs:
            if s[1] <= xa or s[0] >= xb: out.append(s); continue
            if s[0] < xa: out.append((s[0], xa, s[2], s[3]))
            if s[1] > xb: out.append((xb, s[1], s[2], s[3]))
            out.append((max(s[0], xa), min(s[1], xb), zb, s[3]))
        segs = out
    for k, (a_, b_, za, zb) in enumerate(segs):
        B.box('%s_%d' % (name, k), (b_ - a_, th, zb - za), ((a_ + b_) / 2, y - side * th / 2, (za + zb) / 2), M['wall'], bev=0)
        if za < 1.0:
            z1 = min(zb, 1.0); B.box('%s_wains_%d' % (name, k), (b_ - a_, .012, z1 - za), ((a_ + b_) / 2, y + side * .006, (za + z1) / 2), M['wains'], bev=0)
    B.box(name + '_rail', (x1 - x0, .035, .05), ((x0 + x1) / 2, y + side * .018, 1.0), M['trim'], bev=.008)
    B.box(name + '_skirt', (x1 - x0, .025, .12), ((x0 + x1) / 2, y + side * .013, .06), M['skirt'], bev=.006)
WIN = (.35, 1.75, .95, 2.15)            # window hole in the left wall: y from .35 to 1.75, z .95 to 2.15
wall_x('wall_left', W0, D0, D1, [WIN], side=1)
wall_y('wall_back', D1, W0, W1, side=-1)
wall_x('wall_right', W1, D0, D1, [(-1.9, -1.0, 0, 2.1)], side=-1)
wall_y('wall_fourth', D0, W0, W1, side=1)
B.box('ceiling', (W1 - W0, D1 - D0, .03), (0, (D0 + D1) / 2, H + .015), M['ceil'], bev=0)
for i in range(8):                       # T-bar grid 0.6 m
    x = W0 + .2 + i * .6; B.box('tbar_x%d' % i, (.025, D1 - D0, .015), (x, (D0 + D1) / 2, H - .005), M['tbar'], bev=0)
for j in range(9):
    y = D0 + .1 + j * .6; B.box('tbar_y%d' % j, (W1 - W0, .025, .015), (0, y, H - .005), M['tbar'], bev=0)
# fluorescent troffer: housing, prismatic lens, two tube glows
B.box('troffer_housing', (1.2, .6, .06), (-.1, .9, H - .03), M['enamel'], bev=.01)
B.box('troffer_lens', (1.12, .52, .01), (-.1, .9, H - .065), B.pmat('troffer_lens_glow', '#ffffff', .5, emit='#f4fbff', es=2.5), bev=0)
# ---------------------------------------------------------------- window: frame, mullions, sill, venetian blind half down, radiator, plant, sky backdrop
ya, yb, za, zb = WIN; xw = W0
for nm, s, p in [('win_frame_bot', (.16, yb - ya + .1, .06), (xw, (ya + yb) / 2, za - .03)), ('win_frame_top', (.16, yb - ya + .1, .06), (xw, (ya + yb) / 2, zb + .03)),
                 ('win_frame_l', (.16, .06, zb - za), (xw, ya - .02, (za + zb) / 2)), ('win_frame_r', (.16, .06, zb - za), (xw, yb + .02, (za + zb) / 2)),
                 ('win_mullion', (.08, .04, zb - za), (xw - .02, (ya + yb) / 2, (za + zb) / 2)), ('win_transom', (.08, yb - ya, .04), (xw - .02, (ya + yb) / 2, za + .78))]:
    B.box(nm, s, p, M['trim'], bev=.008)
B.box('win_sill', (.26, yb - ya + .2, .04), (xw + .07, (ya + yb) / 2, za - .06), M['trim'], bev=.01)
B.box('win_latch', (.03, .05, .025), (xw + .03, (ya + yb) / 2, za + .79), M['chrome'], bev=.006)
B.box('blind_headrail', (.06, yb - ya - .04, .05), (xw + .07, (ya + yb) / 2, zb - .04), M['blind'], bev=.01)
for k in range(14):                      # slats down to about 55 % of the window, tilted open
    B.box('blind_slat_%02d' % k, (.05, yb - ya - .08, .004), (xw + .08, (ya + yb) / 2, zb - .1 - k * .045), M['blind'], bev=0, rot=(0, math.radians(35), 0))
B.box('blind_bottomrail', (.05, yb - ya - .06, .015), (xw + .08, (ya + yb) / 2, zb - .1 - 14 * .045), M['blind'], bev=.005)
for y in ((ya + .2), (yb - .2)): B.tube('blind_cord_%d' % int(y * 10), [(xw + .11, y, zb - .06), (xw + .11, y, za + .25)], .003, M['letter'])
B.cyl('blind_wand', .006, .6, (xw + .12, ya + .1, zb - .4), M['letter'])
B.plane('window_backdrop_PLACEHOLDER', 6, 4, (xw - 2.5, (ya + yb) / 2, 1.6), M['sky'], rot=(0, 0, math.radians(-90)))['glb'] = False
for k in range(9):                       # radiator fins under the window
    B.box('radiator_fin_%d' % k, (.08, .05, .5), (W0 + .1, ya + .25 + k * .1, .45), M['enamel'], bev=.015)
B.tube('radiator_pipe', [(W0 + .1, ya + .2, .17), (W0 + .1, ya + 1.15, .17)], .014, M['enamel'])
B.lathe('plant_pot', [(.0, 0), (.07, 0), (.09, .16), (.095, .17), (0, .17)], (W0 + .1, yb - .2, za - .04), M['pot'])
for k in range(9):                       # snake plant: tall bevelled leaf blades
    ang = k * 2.4; h = .28 + R.random() * .18
    lf = B.box('plant_leaf_%d' % k, (.035, .008, h), (W0 + .1 + math.cos(ang) * .03, yb - .2 + math.sin(ang) * .03, za + .13 + h / 2), M['plant'], bev=.003, rot=(math.radians(R.uniform(-12, 12)), math.radians(R.uniform(-12, 12)), ang))
# ---------------------------------------------------------------- THE LIGHT BOX (hero of row 19): double viewer, films clipped on
LB = Vector((.35, D1, 1.5)); lw, lh = 1.02, .62
B.box('lightbox_housing', (lw, .1, lh), (LB.x, D1 - .05, LB.z), M['enamel'], bev=.02)
B.box('lightbox_trim', (lw + .02, .015, lh + .02), (LB.x, D1 - .1, LB.z), M['chrome'], bev=.006)
PAN = []
for k, dx in enumerate((-.24, .24)):
    p = Vector((LB.x + dx, D1 - .107, LB.z - .02)); PAN.append(p)
    B.box('lightbox_diffuser_%d' % k, (.45, .008, .52), tuple(p), M['diff'], bev=0)
    B.box('lightbox_clipbar_%d' % k, (.45, .02, .03), (p.x, p.y - .012, p.z + .275), M['chrome'], bev=.006)
    for c in (-.12, .12):
        B.box('lightbox_clip_%d_%d' % (k, int(c * 100)), (.04, .02, .045), (p.x + c, p.y - .026, p.z + .255), M['steel'], bev=.005)
    B.cyl('lightbox_switch_%d' % k, .012, .02, (p.x, D1 - .105, LB.z - lh / 2 + .02), M['rubber'], rot=(math.pi / 2, 0, 0))
for sx in (-1, 1):
    for sz in (-1, 1): B.cyl('lightbox_screw_%d_%d' % (sx, sz), .007, .006, (LB.x + sx * (lw / 2 - .025), D1 - .102, LB.z + sz * (lh / 2 - .025)), M['chrome'], rot=(math.pi / 2, 0, 0), seg=10)
fh = B.plane('xray_film_hero', .40, .50, (PAN[0].x, PAN[0].y - .008, PAN[0].z - .01), M['film'])
fb = B.plane('xray_film_before', .40, .50, (PAN[1].x, PAN[1].y - .008, PAN[1].z - .03), M['film2'], rot=(0, math.radians(2.5), 0))
B.box('lightbox_label', (.16, .006, .035), (LB.x, D1 - .105, LB.z + lh / 2 - .02), M['ink'], bev=0)
B.text('lightbox_label_txt', 'VIEWER', (LB.x, D1 - .11, LB.z + lh / 2 - .021), .022, M['letter'])
B.tube('lightbox_cable', [(LB.x + lw / 2 - .05, D1 - .03, LB.z - lh / 2), (LB.x + lw / 2 + .02, D1 - .02, 1.0), (LB.x + lw / 2 + .1, D1 - .02, .35), (LB.x + lw / 2 + .12, D1 - .02, .3)], .005, M['ink'])
B.box('wall_socket', (.08, .015, .08), (LB.x + lw / 2 + .12, D1 - .008, .3), M['enamel'], bev=.008)
# "X-RAY" sign plate with the amber IN USE lamp above the viewer (story lettering, no red: red is Michel's)
B.box('sign_xray_plate', (.5, .02, .16), (LB.x, D1 - .012, 2.2), M['navy_sign'], bev=.012)
B.text('sign_xray_txt', 'X-RAY', (LB.x - .04, D1 - .024, 2.2), .1, M['letter'])
B.lathe('sign_inuse_lamp', [(0, 0), (.045, 0), (.05, .03), (.04, .06), (0, .065)], (LB.x + .2, D1 - .02, 2.2), M['amber'], rot=(-math.pi / 2, 0, 0))
# ---------------------------------------------------------------- desk to the right of the viewer: lamp (the one warm pool), phone, mug, envelopes, the dish of bites
DX, DY = 1.55, D1 - .35
B.box('desk_top', (1.1, .62, .04), (DX, DY, .74), M['wood'], bev=.008)
for sx in (-1, 1):
    B.box('desk_side_%d' % sx, (.04, .58, .72), (DX + sx * .52, DY, .36), M['wood'], bev=.006)
B.box('desk_drawer', (.4, .02, .14), (DX + .25, DY - .31, .62), M['wood'], bev=.006); B.box('desk_drawer_pull', (.1, .02, .015), (DX + .25, DY - .325, .62), M['chrome'], bev=.004)
B.cyl('desklamp_base', .07, .025, (DX + .35, DY + .15, .773), M['lamp_green'], bev=.006)
B.tube('desklamp_arm', [(DX + .35, DY + .15, .78), (DX + .33, DY + .12, 1.05), (DX + .2, DY, 1.12)], .009, M['chrome'])
B.lathe('desklamp_shade', [(.02, .1), (.04, .09), (.1, 0), (.095, -.005), (.03, .085), (0, .095)], (DX + .2, DY, 1.02), M['lamp_green'], rot=(math.radians(25), 0, 0))
B.sphere('desklamp_bulb', .028, (DX + .2, DY - .01, 1.04), M['bulb'])
B.box('phone_body', (.2, .22, .08), (DX - .3, DY + .1, .8), M['beige'], bev=.03); B.cyl('phone_dial', .06, .012, (DX - .3, DY + .06, .845), M['beige'], bev=.004, rot=(math.radians(-20), 0, 0))
B.box('phone_handset', (.22, .05, .05), (DX - .3, DY + .17, .86), M['beige'], bev=.022)
B.lathe('mug', [(0, 0), (.04, 0), (.042, .1), (.038, .1), (.036, .01), (0, .01)], (DX + .05, DY - .15, .76), M['mug']); B.torus('mug_handle', .025, .006, (DX + .095, DY - .15, .81), M['mug'], rot=(math.pi / 2, 0, 0))
for k in range(4):
    B.box('film_envelope_%d' % k, (.36, .45, .006), (DX - .05 + R.uniform(-.02, .02), DY + .02, .765 + k * .007), M['manila'], bev=0, rot=(0, 0, math.radians(R.uniform(-8, 8))))
B.text('film_envelope_txt', 'LOTITO', (DX - .05, DY - .04, .795), .045, M['ink'], rot=(0, 0, 0))
B.lathe('kidney_dish_bites', [(0, 0), (.08, 0), (.1, .025), (.098, .028), (0, .004)], (DX - .38, DY - .17, .76), M['steel'])
for k in range(5):                       # three-centimetre square metal bites (the samples Michel brought in): white paint, navy stripe, bare cut edges
    mt = M['metalnavy'] if k == 1 else M['metalbite']
    B.box('sample_bite_%d' % k, (.032, .032, .003), (DX - .38 + R.uniform(-.05, .05), DY - .17 + R.uniform(-.04, .04), .768 + k * .002), mt, bev=.001, rot=(0, 0, R.uniform(0, 3)))
# ---------------------------------------------------------------- examination bench along the window wall + step stool
BX, BY = W0 + .55, .15
B.box('bench_top_vinyl', (.62, 1.8, .12), (BX, BY, .72), M['vinyl'], bev=.04, seg=4)
for i in range(3):
    for j in range(6): B.sphere('bench_button_%d_%d' % (i, j), .012, (BX - .2 + i * .2, BY - .75 + j * .3, .78), M['vinyl'], scale=(1, 1, .5), seg=10, rings=6)
B.box('bench_headrest', (.6, .5, .1), (BX, BY + 1.05, .86), M['vinyl'], bev=.04, seg=4, rot=(math.radians(22), 0, 0))
B.box('bench_paper_sheet', (.46, 1.9, .004), (BX, BY + .1, .783), M['paper'], bev=0)
B.cyl('bench_paper_roll', .06, .5, (BX, BY + 1.33, .93), M['paper'], rot=(0, math.pi / 2, 0)); B.cyl('bench_roll_rod', .008, .6, (BX, BY + 1.33, .93), M['chrome'], rot=(0, math.pi / 2, 0))
B.box('bench_frame', (.58, 1.7, .04), (BX, BY, .64), M['steel'], bev=.01)
for sx in (-1, 1):
    for sy in (-1, 1):
        B.tube('bench_leg_%d_%d' % (sx, sy), [(BX + sx * .26, BY + sy * .78, .62), (BX + sx * .26, BY + sy * .78, .03)], .018, M['chrome'])
        B.cyl('bench_foot_%d_%d' % (sx, sy), .025, .03, (BX + sx * .26, BY + sy * .78, .015), M['rubber'], bev=.006)
B.tube('bench_stretcher', [(BX - .26, BY - .78, .2), (BX - .26, BY + .78, .2)], .01, M['chrome']); B.tube('bench_stretcher2', [(BX + .26, BY - .78, .2), (BX + .26, BY + .78, .2)], .01, M['chrome'])
SX, SY = BX + .55, BY - .3
B.box('stool_tread', (.42, .3, .03), (SX, SY, .24), M['rubber'], bev=.01); B.box('stool_tread_rim', (.44, .32, .02), (SX, SY, .222), M['chrome'], bev=.006)
for sx in (-1, 1):
    for sy in (-1, 1): B.tube('stool_leg_%d_%d' % (sx, sy), [(SX + sx * .19, SY + sy * .13, .22), (SX + sx * .22, SY + sy * .15, .0)], .011, M['chrome'])
# ---------------------------------------------------------------- the chart, lead apron, clock, sink corner
B.plane('eye_chart', .45, .75, (-.8, D1 - .003, 1.55), M['chart'])
B.box('eye_chart_backing', (.48, .008, .78), (-.8, D1 - .001, 1.55), M['trim'], bev=.003)
B.cyl('chart_pointer', .006, .7, (-.5, D1 - .02, 1.28), M['wood'], rot=(0, math.radians(8), 0))
B.cyl('apron_hook', .01, .06, (-1.62, D1 - .03, 1.75), M['chrome'], rot=(math.pi / 2, 0, 0))
ap = B.box('lead_apron', (.48, .04, .85), (-1.62, D1 - .05, 1.3), M['apron'], bev=.03, seg=4)
B.box('lead_apron_collar', (.22, .045, .08), (-1.62, D1 - .055, 1.71), M['apron'], bev=.02)
B.cyl('clock_body', .15, .04, (-1.6, D1 - .03, 2.3), M['enamel'], rot=(math.pi / 2, 0, 0), bev=.01, seg=32); B.torus('clock_rim', .15, .012, (-1.6, D1 - .05, 2.3), M['chrome'], rot=(math.pi / 2, 0, 0))
for k in range(12):
    a_ = 2 * math.pi * k / 12; B.box('clock_tick_%d' % k, (.008, .004, .025), (-1.6 + math.sin(a_) * .125, D1 - .052, 2.3 + math.cos(a_) * .125), M['ink'], bev=0, rot=(0, -a_, 0))
B.box('clock_hand_h', (.008, .004, .08), (-1.6 + .02, D1 - .056, 2.3 + .03), M['ink'], bev=0, rot=(0, math.radians(-40), 0)); B.box('clock_hand_m', (.006, .004, .11), (-1.6 - .03, D1 - .058, 2.3 + .04), M['ink'], bev=0, rot=(0, math.radians(35), 0))
B.box('sink_basin', (.5, .4, .18), (W1 - .35, 1.2, .82), M['enamel'], bev=.05); B.cyl('sink_pedestal', .09, .72, (W1 - .35, 1.25, .36), M['enamel'], r2=.07)
B.tube('sink_tap', [(W1 - .15, 1.2, .9), (W1 - .15, 1.2, 1.02), (W1 - .27, 1.2, 1.04)], .012, M['chrome'])
for s in (-1, 1): B.cyl('sink_tap_knob_%d' % s, .02, .03, (W1 - .15, 1.2 + s * .1, .93), M['chrome'], bev=.005)
B.box('towel_dispenser', (.08, .28, .32), (W1 - .05, 1.2, 1.45), M['enamel'], bev=.02); B.box('towel_tongue', (.004, .2, .08), (W1 - .095, 1.2, 1.27), M['paper'], bev=0)
B.box('door_panel', (.05, .86, 2.08), (W1 - .03, -1.45, 1.04), M['wood'], bev=.01); B.sphere('door_knob', .03, (W1 - .07, -1.12, 1.0), M['chrome'])
B.box('door_window', (.02, .3, .4), (W1 - .06, -1.45, 1.55), M['glass'], bev=.004)
B.box('coat_hooks_board', (.6, .03, .08), (-.2, D0 + .02, 1.7), M['wood'], bev=.008)
for k in range(3): B.tube('coat_hook_%d' % k, [(-.4 + k * .2, D0 + .03, 1.7), (-.4 + k * .2, D0 + .09, 1.66), (-.4 + k * .2, D0 + .09, 1.72)], .006, M['chrome'])

# ---------------------------------------------------------------- more equipment: column scale, doctor's stool on castors, pedal bin, folding screen
CSx, CSy = 1.75, .45
B.box('scale_platform', (.36, .42, .07), (CSx, CSy, .035), M['enamel'], bev=.02); B.box('scale_mat', (.3, .32, .006), (CSx, CSy - .02, .073), M['rubber'], bev=.002)
B.tube('scale_column', [(CSx, CSy + .18, .07), (CSx, CSy + .18, 1.45)], .025, M['enamel'])
B.box('scale_beam', (.42, .04, .05), (CSx, CSy + .16, 1.35), M['chrome'], bev=.008)
for k in range(2): B.box('scale_poise_%d' % k, (.035, .05, .045), (CSx - .1 + k * .15, CSy + .14, 1.35 - k * .0), M['steel'], bev=.006)
B.tube('height_rod', [(CSx, CSy + .2, 1.45), (CSx, CSy + .2, 1.95), (CSx, CSy + .05, 1.95)], .008, M['chrome'])
STx, STy = -.15, 1.25
B.cyl('stool_seat', .19, .08, (STx, STy, .55), M['vinyl'], bev=.03); B.cyl('stool_post', .025, .4, (STx, STy, .32), M['chrome'])
for k in range(5):
    a_ = 2 * math.pi * k / 5; B.tube('stool_foot_%d' % k, [(STx, STy, .1), (STx + math.cos(a_) * .25, STy + math.sin(a_) * .25, .05)], .014, M['chrome'])
    B.sphere('stool_castor_%d' % k, .025, (STx + math.cos(a_) * .25, STy + math.sin(a_) * .25, .025), M['rubber'])
B.lathe('pedal_bin', [(0, 0), (.13, 0), (.14, .38), (.145, .4), (0, .41)], (1.0, 1.55, 0), M['enamel']); B.box('pedal_bin_pedal', (.08, .06, .015), (1.0, 1.39, .03), M['chrome'], bev=.004)
for k in range(3):
    px = -1.95 + k * .02; py = -1.4 + k * .5
    B.box('screen_frame_%d' % k, (.03, .5, 1.6), (px, py, .9), M['chrome'], bev=.008, rot=(0, 0, math.radians(15 * (k - 1))))
    B.box('screen_cloth_%d' % k, (.012, .44, 1.3), (px, py, .95), M['vinyl'], bev=0, rot=(0, 0, math.radians(15 * (k - 1))))

# ================================================================= THE X-RAY WORLD (rows 20-22): cyan bands on mid-blue, never black
B.use(XW); X0 = Vector((30, 0, 0))
band = B.pmat('xw_band_cyan', '#7fe9ff', .3, emit='#7fe9ff', es=3.2); band_soft = B.pmat('xw_band_soft', '#5fc6ee', .4, emit='#5fc6ee', es=1.4)
bgm = B.pmat('xw_backdrop', '#2f6fb3', 1., emit='#ffffff', es=1.0, img=T('xworld_bg.png'))
bd = B.sphere('xw_backdrop', 16, tuple(X0), bgm, seg=48, rings=24)
for p in bd.data.polygons: p.use_smooth = True
bd.data.flip_normals(); bd['fixed_uv'] = True
ul = bd.data.uv_layers.new(name='UVMap')
for poly in bd.data.polygons:
    for li in poly.loop_indices:
        v = bd.data.vertices[bd.data.loops[li].vertex_index].co; ul.data[li].uv = ((math.atan2(v.y, v.x) / (2 * math.pi)) % 1, .5 + v.z / 32)
for k in range(14):                      # the spine column behind, rounded vertebrae with side wings
    z = -5 + k * .95; B.box('xw_vertebra_%02d' % k, (.9, .7, .6), (X0.x, X0.y + 4.2, X0.z + z), band, bev=.22, seg=3)
    B.box('xw_vertebra_wing_%02d' % k, (1.8, .25, .2), (X0.x, X0.y + 4.0, X0.z + z + .1), band_soft, bev=.08)
for k in range(8):                       # ribs: open at the front, tilted down toward it
    z = .6 + k * .95; Rr = 4.6 - abs(k - 3) * .18
    B.torus('xw_rib_L%d' % k, Rr, .13, (X0.x, X0.y + .3, X0.z + z), band, rot=(math.radians(-8), 0, 0), seg=40, mseg=10, arc=math.radians(150), a0=math.radians(92))
    B.torus('xw_rib_R%d' % k, Rr, .13, (X0.x, X0.y + .3, X0.z + z), band, rot=(math.radians(-8), 0, 0), seg=40, mseg=10, arc=math.radians(150), a0=math.radians(-62))
for s in (-1, 1): B.torus('xw_pelvis_%d' % s, 2.2, .16, (X0.x + s * 1.9, X0.y + 1.5, X0.z - 5.2), band, rot=(math.radians(70), 0, s * math.radians(20)), arc=math.radians(200), a0=math.radians(-10))
# the bean stomach: an ellipsoid with a bean dent, glass-like wall with a cyan rim (Cycles: fresnel mix; kit: alpha)
SC = Vector((X0.x + .4, X0.y - .2, X0.z - 1.4)); SA = Vector((2.9, 1.9, 1.6))
bean = B.sphere('xw_stomach_wall', 1., tuple(SC), None, seg=64, rings=32)
for v in bean.data.vertices:
    p = v.co.copy(); dent = .22 * max(0., p.y) ** 2 * max(0., 1 - abs(p.x) * 1.3)   # dent on the +y (spine) side
    v.co = Vector((p.x * SA.x, (p.y - dent) * SA.y, p.z * SA.z + .25 * p.x * p.x * (p.z > 0)))
sw = bpy.data.materials.new('xw_stomach_glass'); sw.use_nodes = True; N = sw.node_tree.nodes; Lk = sw.node_tree.links
bsdf = N['Principled BSDF']; bsdf.inputs['Base Color'].default_value = B.lin('#7fe9ff'); bsdf.inputs['Alpha'].default_value = .28; bsdf.inputs['Emission Color'].default_value = B.lin('#7fe9ff'); bsdf.inputs['Emission Strength'].default_value = 1.
lw_ = N.new('ShaderNodeLayerWeight'); lw_.inputs['Blend'].default_value = .35; tr = N.new('ShaderNodeBsdfTransparent'); em = N.new('ShaderNodeEmission'); em.inputs['Color'].default_value = B.lin('#7fe9ff'); em.inputs['Strength'].default_value = 2.2
mx = N.new('ShaderNodeMixShader'); Lk.new(lw_.outputs['Facing'], mx.inputs[0]); Lk.new(tr.outputs[0], mx.inputs[1]); Lk.new(em.outputs[0], mx.inputs[2])
mo = N['Material Output']; mo.target = 'CYCLES'; Lk.new(mx.outputs[0], mo.inputs['Surface'])
mo2 = N.new('ShaderNodeOutputMaterial'); mo2.target = 'EEVEE'; Lk.new(bsdf.outputs[0], mo2.inputs['Surface'])
bean.data.materials.append(sw); bean.visible_shadow = False
# the LINING / MATTRESS: one grid with a shape key 'puff' (quilted pillows + button dimples), runway dashes as a second mesh sharing the key
NU, NV, LU, LV = 90, 36, 4.4, 1.7
def floor_z(x, y):
    """the stomach floor under (x, y) in stomach-local units, lifted 6 cm; slopes down from -x (the parked end) to +x."""
    q = 1 - (x / SA.x) ** 2 - (y / SA.y) ** 2
    return -SA.z * math.sqrt(max(q, .02)) + .06
def lining_pts(puff, lift=0.):
    pts = []
    for i in range(NU + 1):
        for j in range(NV + 1):
            u, v = i / NU, j / NV; x = (u - .5) * LU; y = (v - .5) * LV; z = floor_z(x, y) + lift
            if puff:
                cu, cv = (u * LU / .34) % 1, (v * LV / .34) % 1
                pillow = (math.sin(math.pi * cu) * math.sin(math.pi * cv)) ** .6
                edge = min(1, min(u, 1 - u) * 14, min(v, 1 - v) * 10)
                z += (.05 + .17 * pillow) * edge
            else:
                z += .012 * math.sin(x * 9 + y * 3) + .008 * math.sin(y * 13)          # thin wrinkled lining
            pts.append(Vector((SC.x + x, SC.y + y, SC.z + z)))
    return pts
def grid(name, mat, lift=0., sel=None):
    vs = lining_pts(False, lift); fs = []; mi = []
    for i in range(NU):
        for j in range(NV):
            a_ = i * (NV + 1) + j; f = (a_, a_ + NV + 1, a_ + NV + 2, a_ + 1)
            if sel is None or sel(i, j): fs.append(f)
    o = B.mesh(name, vs, fs, mat); o['fixed_uv'] = True
    ul = o.data.uv_layers.new(name='UVMap')
    for poly in o.data.polygons:
        for li in poly.loop_indices:
            vi = o.data.loops[li].vertex_index; ul.data[li].uv = ((vi // (NV + 1)) / NU * 6, (vi % (NV + 1)) / NV * 2)
    o.shape_key_add(name='Basis'); k = o.shape_key_add(name='puff'); P = lining_pts(True, lift)
    for vi, p in enumerate(P): k.data[vi].co = p
    if lift < 0:                          # dashes: hidden under the thin lining at 0, riding 8 mm over the mattress at 1
        P2 = lining_pts(True, .008)
        for vi, p in enumerate(P2): k.data[vi].co = p
    k.value = 0.; return o
lin_mat = B.pmat('xw_lining', '#9fdcf2', .35, emit='#7fe9ff', es=.45, coat=.5)
lining = grid('xw_lining_mattress', lin_mat)
dash_mat = B.pmat('xw_runway_dash', '#f4ffff', .3, emit='#e8ffff', es=3.)
mid = NV // 2
dashes = grid('xw_runway_dashes', dash_mat, lift=-.03, sel=lambda i, j: (mid - 1 <= j <= mid) and (i % 8) < 4 and 4 <= i <= NU - 4)
edge = grid('xw_runway_edges', band_soft, lift=-.03, sel=lambda i, j: (j in (3, NV - 4)) and 4 <= i <= NU - 4)
# slide path: down the runway centre line in the puffed state, then out through the far end (exits frame)
PATH = []
for k in range(13):
    u = .06 + k * .075; x = (u - .5) * LU; PATH.append([round(SC.x + x, 3), round(SC.y, 3), round(SC.z + floor_z(x, 0) + .22 + .09, 3)])
PATH_FLAT = [[p[0], p[1], round(p[2] - .2, 3)] for p in PATH]
PATH.append([round(SC.x + LU / 2 + .9, 3), round(SC.y, 3), round(SC.z - 1.0, 3)])
# THE MINI BITE-CESSNA (0.5 m): voxels of 3.5 cm square bites, white paint, navy stripe, bare aluminium cut edges, propeller
cell = .035; vox = {}
def put(i, j, k, m): vox[(i, j, k)] = m
for i in range(15):                      # fuselage: nose i=0, tail i=14; cabin tall over i 2..6
    hw = 1 if i < 9 else 0; top = 3 if 2 <= i <= 6 else (2 if i < 9 else 1)
    for j in range(-hw, hw + 1):
        for k in range(0, top + 1): put(i, j, k, 'navy' if k == 1 else 'white')
for j in range(-10, 11):                 # high wing
    for i in range(3, 6): put(i, j, 4, 'white')
for k in range(2, 6): put(14, 0, k, 'white'); put(13, 0, k, 'white') if k < 5 else None    # fin
put(14, 0, 6, 'navy')
for j in range(-3, 4): put(13, j, 1, 'white')                                           # tail plane
for s in (-1, 1): put(4, s * 2, -1, 'alu'); put(4, s * 2, -2, 'tyre')                   # main gear + wheels
put(1, 0, -1, 'alu'); put(1, 0, -2, 'tyre')
bm = bmesh.new(); MI = {'white': 0, 'navy': 1, 'alu': 2, 'tyre': 3}
for (i, j, k), m in vox.items():
    r_ = bmesh.ops.create_cube(bm, size=cell * .94); vv = r_['verts']
    bmesh.ops.translate(bm, vec=Vector((i * cell, j * cell, k * cell)), verts=vv)
    for f in {f for v in vv for f in v.link_faces}: f.material_index = MI[m]
me = bpy.data.meshes.new('xw_mini_cessna'); bm.to_mesh(me); bm.free()
mc = bpy.data.objects.new('xw_mini_cessna', me); B.link(mc)
for m in (M['metalbite'], M['metalnavy'], M['alu'], M['rubber']): me.materials.append(m)
B.finish(mc, None, bev=.004, seg=1)
pr = B.box('xw_mini_cessna_prop', (.006, .012, .2), (-.03, 0, 1.5 * cell), M['alu'], bev=.002); pr.parent = mc
B.cyl('xw_mini_cessna_spinner', .018, .03, (-.012, 0, 1.5 * cell), M['chrome'], rot=(0, math.pi / 2, 0), r2=.004).parent = mc
p0, p1 = Vector(PATH[0]), Vector(PATH[1]); d = (p1 - p0).normalized()
mc.location = p0; mc.rotation_euler = (0, math.atan2(d.z, d.x), math.pi)
# ---------------------------------------------------------------- lights, cameras
B.world(sc, '#9cc8f4', '#c8d4ec', .3)
B.light('sun_window', 'SUN', (-5, .9, 4), '#f2f6ff', 2.2, rot=B.aim_rot((-5, .9, 4), (0, 1.0, 0)), angle=1.5)
B.light('troffer_area', 'AREA', (-.1, .9, H - .09), '#f4fbff', 35, size=1.1, size_y=.5)
B.light('lightbox_glow', 'AREA', (LB.x, D1 - .2, LB.z), '#bff4ff', 10, rot=(math.pi / 2, 0, 0), size=.9, size_y=.55)
B.light('desklamp_pool', 'SPOT', (DX + .2, DY, 1.0), '#ffd9a0', 18, rot=(math.radians(10), 0, 0), size=.03).data.spot_size = math.radians(80)
B.light('xw_key', 'AREA', (X0.x - 1.5, X0.y - 2.5, X0.z + 2.2), '#d8fbff', 160, rot=B.aim_rot((X0.x - 1.5, X0.y - 2.5, X0.z + 2.2), tuple(SC)), size=2.)
B.light('xw_fill', 'POINT', (X0.x + 2., X0.y + 1., X0.z - .2), '#7fe9ff', 60, size=.6)
CAMS = {
 'CAM_SHOULDER': dict(pos=(-.42, .85, 1.58), aim=(PAN[0].x + .02, D1, PAN[0].z - .02), lens=32),
 'CAM_WIDE': dict(pos=(1.6, -1.2, 2.05), aim=(-.5, 1.4, .9), lens=18),
 'CAM_FILM': dict(pos=(PAN[0].x, D1 - .5, PAN[0].z - .01), aim=(PAN[0].x, D1, PAN[0].z - .01), lens=26),
 'CAM_INSIDE': dict(pos=(X0.x - 2.6, X0.y - 4.6, X0.z + 2.4), aim=tuple(SC + Vector((.3, 0, -.6))), lens=20),
 'CAM_LINING': dict(pos=(SC.x - .2, SC.y - 1.05, SC.z - .75), aim=(SC.x + .5, SC.y + .1, SC.z - 1.45), lens=22),
 'CAM_RIDE': dict(pos=(PATH[1][0] - .7, PATH[1][1] - .35, PATH[1][2] + .25), aim=(PATH[4][0], PATH[4][1], PATH[4][2] - .1), lens=20),
}
for k, v in CAMS.items(): B.cam(k, v['pos'], v['aim'], v['lens'])
B.render_setup(sc)
try:
    ng = bpy.data.node_groups.new('xray_comp', 'CompositorNodeTree'); ng.interface.new_socket('Image', in_out='OUTPUT', socket_type='NodeSocketColor')
    rl = ng.nodes.new('CompositorNodeRLayers'); gl = ng.nodes.new('CompositorNodeGlare'); go = ng.nodes.new('NodeGroupOutput')
    gl.inputs['Type'].default_value = 'Fog Glow'; gl.inputs['Threshold'].default_value = 1.0; gl.inputs['Size'].default_value = .5; gl.inputs['Strength'].default_value = .5; gl.inputs['Quality'].default_value = 'Medium'
    ng.links.new(rl.outputs['Image'], gl.inputs['Image']); ng.links.new(gl.outputs['Image'], go.inputs[0]); sc.compositing_node_group = ng; print('GLOW ok')
except Exception as e: print('GLOW FAIL', repr(e))
B.bake_all(sc)
meta = dict(frame='Blender metres, Z up; kit: B2T', place='xray', X0=list(X0), cams={k: dict(pos=list(v['pos']), aim=list(v['aim']), lens=v['lens']) for k, v in CAMS.items()},
            anchors=dict(film_hero=dict(c=[round(c, 3) for c in fh.location], w=.40, h=.50), film_before=list(fb.location), lightbox=list(LB), bench_top=[BX, BY, .78], step_stool=[SX, SY, .255],
                         desk_top=[DX, DY, .76], doctor_stand=[-.25, .55, 0], stomach_centre=list(SC), stomach_axes=list(SA)),
            states=dict(puff='shape key "puff" on xw_lining_mattress, xw_runway_dashes, xw_runway_edges: drive all three with one value 0..1'),
            slide_path=PATH, slide_path_flat=PATH_FLAT, mini_cessna=dict(node='xw_mini_cessna', length_m=round(15 * cell, 3), parked_at=PATH[0], prop='xw_mini_cessna_prop (spin about local X)'))
B.export(sc, OUT, 'xray', meta)
print('XRAY_DONE')
