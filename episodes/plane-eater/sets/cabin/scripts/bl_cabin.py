# bl_cabin.py: PLACE C, the airliner cabin row (rows 35-38), set-builder 2026-11-21.
# blender -b --factory-startup --python bl_cabin.py -- <tex dir> <out dir>  -> out/cabin.blend, out/cabin_lite.glb, out/cabin_meta.json. Prints CABIN_DONE.
# Frame: Blender metres, Z up, the nose is +X. Floor z 0. Window side y +1.7 (Michel's window seat A at y 1.2, the owner's seat B at y .68); aisle y -.05..0.4.
# States: tray_table (whole) / tray_table_bitten (hidden): swap at "FOOD" 33.38; meal_foil_on / meal_foil_lifted (hidden); pea_runaway rolls off (row 36).
import bpy, sys, os, math, random
from mathutils import Vector
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.append(os.path.join(HERE, '..', '..'))
import pe_bl as B
a = sys.argv[sys.argv.index('--') + 1:]; TEX, OUT = os.path.abspath(a[0]), os.path.abspath(a[1]); os.makedirs(OUT, exist_ok=True)
sc = B.reset(); R = random.Random(35); T = lambda f: os.path.join(TEX, f)
CB = B.coll('cabin'); OUTS = B.coll('outside'); B.use(CB)
M = dict(
  fabric=B.pmat('seat_fabric_blue', '#ffffff', .8, img=T('fabric.png'), bump=.3), cover=B.pmat('headrest_cover_white', '#f6f6f2', .85, bump=.25),
  shell=B.pmat('seat_shell_grey', '#c9ccd3', .35, coat=.4), frame=B.pmat('seat_frame_alu', '#a9aeb6', .3, metal=.9), arm=B.pmat('armrest_pad_grey', '#5b6170', .5),
  chrome=B.pmat('chrome', '#e9ecef', .08, metal=1.), belt=B.pmat('belt_webbing', '#3c4252', .7, bump=.2), tray=B.pmat('tray_table_plastic', '#d9d6cc', .4, coat=.3),
  meal=B.pmat('meal_tray_greybeige', '#b9b3a3', .55), foil=B.pmat('meal_foil', '#c8cbcf', .25, metal=.85, bump=.6), stew=B.pmat('meal_stew_grey', '#8f8a7c', .6, bump=.5),
  pea=B.pmat('meal_pea_olive', '#9a9e7e', .5), roll=B.pmat('meal_roll_pale', '#d8c9a4', .7, bump=.4), cup=B.pmat('cup_clear', '#e8eef2', .1, alpha=.45), napkin=B.pmat('napkin_white', '#eeeeea', .9),
  carpet=B.pmat('carpet_blue', '#ffffff', .95, img=T('carpet.png'), bump=.5), wall=B.pmat('sidewall_cream', '#ecebe4', .45, coat=.2), bezel=B.pmat('window_bezel', '#f3f2ec', .35, coat=.3),
  shade=B.pmat('window_shade', '#f5f4ef', .4), bin=B.pmat('bin_door_cream', '#efeee7', .4, coat=.3), seam=B.pmat('seam_grey', '#9a9a98', .5), cove=B.pmat('cove_light', '#ffffff', .5, emit='#fff6e8', es=5.),
  psu=B.pmat('psu_grey', '#dad9d3', .4), lamp=B.pmat('reading_lamp', '#ffffff', .2, emit='#fff3dc', es=2.), sign=B.pmat('sign_lit_amber', '#ffe7a8', .3, emit='#ffd98a', es=2.5),
  ink=B.pmat('ink_dark', '#24242a', .5), glass=B.pmat('window_glass', '#e0f0ff', .03, alpha=.1), card=B.pmat('safety_card', '#ffffff', .6, img=T('card.png')),
  wing=B.pmat('wing_paint_white', '#e6e9ee', .3, metal=.35, coat=.6), wing_dark=B.pmat('wing_walkway_grey', '#9aa2ad', .5, metal=.3), alu=B.pmat('bite_alu_cut', '#c8ccd0', .28, metal=1.),
  navlight=B.pmat('nav_light_green', '#3cf08a', .2, emit='#3cf08a', es=6.), cloud=B.pmat('cloud_white', '#ffffff', .9, emit='#ffffff', es=.25), sky=B.pmat('sky_above_clouds', '#ffffff', 1., emit='#ffffff', es=1., img=T('sky.png')),
  ceiling=B.pmat('ceiling_panel', '#f4f3ee', .5), engine=B.pmat('nacelle_white', '#eef0f3', .25, metal=.4, coat=.6), intake=B.pmat('intake_chrome', '#d0d5da', .15, metal=1.),
)
X0, X1, PITCH = -2.4, 3.2, .8
ROWS = [-1.6, -.8, 0., .8, 1.6]                 # Michel's row is x 0 (row 14)
SEAT_Y_L = [1.2, .68]                         # A window (Michel), B aisle (the owner)
SEAT_Y_R = [-.45, -.97, -1.49]                # across the aisle: D E F
def wall_y(z):  # the curved sidewall profile: y of the wall at height z (left side)
    return 1.62 + .14 * math.sin(math.pi * min(max((z - .1) / 1.55, 0), 1))
# ---------------------------------------------------------------- floor, carpet, aisle strip, seat tracks
B.box('floor_carpet', (X1 - X0, 3.6, .03), ((X0 + X1) / 2, 0, -.015), M['carpet'], bev=0)['uv_size'] = .5
B.box('aisle_runner', (X1 - X0, .5, .006), ((X0 + X1) / 2, .17, .003), B.pmat('aisle_runner_grey', '#6a7896', .95, bump=.4), bev=0)
for y in (1.4, .45, -.25, -1.7):
    B.box('seat_track_%d' % int(y * 100), (X1 - X0, .03, .008), ((X0 + X1) / 2, y, .004), M['frame'], bev=.002)
# ---------------------------------------------------------------- sidewalls with windows (both sides), bezels, shades, glass
NX, NZ = 140, 34; WIN_W, WIN_H, WIN_Z = .27, .38, 1.02
def win_x(r): return r + .18
def build_wall(side):
    s = 1 if side == 'L' else -1; vs, fs = [], []
    for i in range(NX + 1):
        x = X0 + (X1 - X0) * i / NX
        for j in range(NZ + 1):
            z = .1 + 1.6 * j / NZ; vs.append((x, s * wall_y(z), z))
    def in_win(x, z):
        for r in ROWS:
            dx, dz = (x - win_x(r)) / (WIN_W / 2), (z - WIN_Z) / (WIN_H / 2)
            if abs(dx) ** 4 + abs(dz) ** 4 < 1: return True
        return False
    for i in range(NX):
        for j in range(NZ):
            x = X0 + (X1 - X0) * (i + .5) / NX; z = .1 + 1.6 * (j + .5) / NZ
            if in_win(x, z): continue
            a_ = i * (NZ + 1) + j; f = (a_, a_ + NZ + 1, a_ + NZ + 2, a_ + 1); fs.append(f if s > 0 else f[::-1])
    w = B.mesh('sidewall_' + side, vs, fs, M['wall'])
    for r in ROWS:   # bezel (superellipse ring), shade half down, glass, panel seam
        pts = []
        for k in range(48):
            t = 2 * math.pi * k / 48; c, sn = math.cos(t), math.sin(t)
            pts.append((win_x(r) + WIN_W / 2 * 1.04 * math.copysign(abs(c) ** .5, c), WIN_Z + WIN_H / 2 * 1.04 * math.copysign(abs(sn) ** .5, sn)))
        P = [(x, s * (wall_y(z) - .012), z) for x, z in pts] + [(x, s * (wall_y(z) - .04), z) for x, z in [(win_x(r) + (px - win_x(r)) * 1.22, WIN_Z + (pz - WIN_Z) * 1.16) for px, pz in pts]]
        F = [(k, (k + 1) % 48, 48 + (k + 1) % 48, 48 + k) for k in range(48)]
        if s < 0: F = [f[::-1] for f in F]
        B.mesh('window_bezel_%s_%d' % (side, int(r * 10)), P, F, M['bezel'])
        tube_pts = [(x, s * (wall_y(z) + .03), z) for x, z in pts] + [(x, s * (wall_y(z) - .012), z) for x, z in pts]
        F2 = [(k, (k + 1) % 48, 48 + (k + 1) % 48, 48 + k) for k in range(48)]
        B.mesh('window_reveal_%s_%d' % (side, int(r * 10)), tube_pts, F2 if s < 0 else [f[::-1] for f in F2], M['bezel'])
        g = B.plane('window_glass_%s_%d' % (side, int(r * 10)), WIN_W, WIN_H, (win_x(r), s * (wall_y(WIN_Z) + .02), WIN_Z), M['glass'], rot=(0, 0, 0 if s < 0 else math.pi)); g.visible_shadow = False
        sh_down = .35 if (r == 0 and side == 'L') else R.choice([.0, .3, .55, .8])
        B.box('window_shade_%s_%d' % (side, int(r * 10)), (WIN_W * .9, .006, WIN_H * .5), (win_x(r), s * (wall_y(WIN_Z + .2) - .002), WIN_Z + WIN_H * .5 - WIN_H * sh_down * .5 + WIN_H * .25 - .02), M['shade'], bev=.002)
        B.box('panel_seam_%s_%d' % (side, int(r * 10)), (.006, .02, 1.3), (r - .22, s * (wall_y(.9) - .005), .85), M['seam'], bev=0)
        B.box('vent_grille_%s_%d' % (side, int(r * 10)), (.3, .02, .05), (r, s * (wall_y(.22) - .01), .22), M['seam'], bev=.004)
build_wall('L'); build_wall('R')
for s in (1, -1):    # dado panel bottom
    B.box('dado_%d' % s, (X1 - X0, .03, .12), ((X0 + X1) / 2, s * 1.58, .06), M['seam'], bev=.006)
# ---------------------------------------------------------------- overhead bins, PSU strip, cove light, ceiling
for s in (1, -1):
    for k, x in enumerate(ROWS + [2.4]):
        cx = x + .0; bw = PITCH - .012
        B.box('bin_%d_%d' % (s, k), (bw, .62, .4), (cx, s * 1.32, 1.95), M['bin'], bev=.05, seg=4, rot=(s * math.radians(-12), 0, 0))
        B.box('bin_latch_%d_%d' % (s, k), (.12, .02, .035), (cx, s * 1.01, 1.88), M['seam'], bev=.008)
        B.box('psu_%d_%d' % (s, k), (bw, .3, .03), (cx, s * 1.05, 1.7), M['psu'], bev=.008)
        for q in range(3):
            ly = s * (1.12 - q * .08)
            B.lathe('gasper_%d_%d_%d' % (s, k, q), [(0, 0), (.022, 0), (.018, -.02), (.008, -.03), (0, -.03)], (cx - .15, ly, 1.685), M['chrome'], seg=16)
            B.cyl('reading_lamp_%d_%d_%d' % (s, k, q), .016, .006, (cx + .05, ly, 1.683), M['lamp'] if (k == 2 and q < 1 and s > 0) else M['psu'], seg=16)
        B.box('sign_belt_%d_%d' % (s, k), (.09, .05, .006), (cx + .25, s * 1.06, 1.683), M['sign'], bev=.002)
        rown = 12 + k
        B.text('row_num_%d_%d' % (s, k), '%d %s' % (rown, 'A B' if s > 0 else 'D E F'), (cx - .22, s * .99, 1.79), .045, M['ink'], rot=(math.pi / 2, 0, -math.pi / 2 if s > 0 else math.pi / 2))
    B.box('cove_light_%d' % s, (X1 - X0, .03, .03), ((X0 + X1) / 2, s * 1.0, 2.18), M['cove'], bev=0)
B.box('ceiling', (X1 - X0, 2.2, .04), ((X0 + X1) / 2, 0, 2.28), M['ceiling'], bev=0)
for x in ROWS: B.box('ceiling_seam_%d' % int(x * 10), (.008, 2.0, .01), (x - .4, 0, 2.255), M['seam'], bev=0)
# ---------------------------------------------------------------- the airliner seat (library row pe_airliner_seat): built per position
def seat(tag, x, y, facing=1, tray_down=False):
    g = []
    g.append(B.box(tag + '_pan', (.48, .44, .12), (x + .02, y, .46), M['fabric'], bev=.045, seg=4))
    g.append(B.box(tag + '_back', (.13, .44, .66), (x - .25, y, .84), M['fabric'], bev=.05, seg=4, rot=(0, math.radians(-12), 0)))
    g.append(B.box(tag + '_headrest', (.13, .40, .22), (x - .32, y, 1.24), M['fabric'], bev=.05, seg=4, rot=(0, math.radians(-12), 0)))
    g.append(B.box(tag + '_cover', (.02, .38, .2), (x - .245, y, 1.24), M['cover'], bev=.008, rot=(0, math.radians(-12), 0)))      # white headrest cover (front)
    g.append(B.box(tag + '_cover_top', (.15, .38, .02), (x - .31, y, 1.35), M['cover'], bev=.008, rot=(0, math.radians(-12), 0)))
    g.append(B.box(tag + '_shell', (.05, .46, .8), (x - .33, y, .78), M['shell'], bev=.02, rot=(0, math.radians(-12), 0)))           # rear plastic shell
    g.append(B.box(tag + '_pocket', (.025, .36, .2), (x - .37, y, .45), M['shell'], bev=.01, rot=(0, math.radians(-12), 0)))
    g.append(B.plane(tag + '_safety_card', .13, .19, (x - .385, y + .08, .53), M['card'], rot=(0, math.radians(-12), math.radians(-90))))
    g.append(B.cyl(tag + '_tray_latch', .012, .02, (x - .4, y, 1.05), M['seam'], rot=(0, math.pi / 2, 0)))
    for s in (-1, 1):
        g.append(B.box(tag + '_belt_%d' % s, (.32, .045, .006), (x + .04, y + s * .1, .525), M['belt'], bev=0, rot=(0, 0, s * math.radians(8))))
    g.append(B.box(tag + '_buckle', (.07, .05, .012), (x + .15, y, .532), M['chrome'], bev=.004))
    for s in (-1, 1):   # legs + spreader
        g.append(B.tube(tag + '_leg_%d' % s, [(x + .14, y + s * .17, .4), (x + .2, y + s * .17, .0)], .016, M['frame']))
        g.append(B.tube(tag + '_legb_%d' % s, [(x - .18, y + s * .17, .4), (x - .22, y + s * .17, .0)], .016, M['frame']))
    g.append(B.tube(tag + '_spreader', [(x, y - .2, .25), (x, y + .2, .25)], .012, M['frame']))
    return g
def armrest(tag, x, y):
    B.box(tag + '_pad', (.42, .05, .05), (x + .0, y, .68), M['arm'], bev=.02)
    B.box(tag + '_post', (.05, .04, .26), (x - .2, y, .55), M['frame'], bev=.01)
    B.cyl(tag + '_ashtray_lid', .012, .006, (x + .12, y, .708), M['chrome'], seg=12)
SEATS = {}
for r in ROWS:
    for k, y in enumerate(SEAT_Y_L): SEATS['L%d%s' % (int(r * 10), 'AB'[k])] = seat('seat_%s%s' % (int(r * 10), 'AB'[k]), r, y)
    for k, y in enumerate(SEAT_Y_R): seat('seat_%s%s' % (int(r * 10), 'DEF'[k]), r, y)
    for y in (1.46, .94, .42): armrest('arm_%d_%d' % (int(r * 10), int(y * 100)), r, y)
    for y in (-.19, -.71, -1.23, -1.75 + .02): armrest('arm_%d_%d' % (int(r * 10), int(y * 100)), r, y)
# ---------------------------------------------------------------- Michel's tray table (on the back of seat 8A in front): whole + bitten
TX, TY, TZ = .8 - .48, 1.2, .74
def tray_table(name):
    t = B.box(name, (.30, .42, .025), (TX, TY, TZ), M['tray'], bev=.01, seg=3)
    B.box(name + '_recess', (.22, .32, .002), (TX, TY, TZ + .0125), B.pmat('tray_recess', '#cfccc1', .5), bev=0).parent = None
    return t
tt = tray_table('tray_table')
tb = B.box('tray_table_bitten', (.30, .42, .025), (TX, TY, TZ), M['tray'], bev=.0, seg=3)
B.apply_mods(tb); B.bite(tb, (TX - .16, TY - .05, TZ), .07, axis='Z', teeth=5, depth=.2)
B.finish(tb, None, bev=.006, seg=2); tb.hide_render = True; tb.hide_set(True)
for s in (-1, 1):
    B.box('tray_arm_%d' % s, (.34, .02, .03), (TX + .17, TY + s * .2, TZ - .01), M['frame'], bev=.008)
# ---------------------------------------------------------------- THE GREY MEAL (the one dull colour, on purpose)
MX, MY, MZ = TX - .01, TY + .02, TZ + .0125
B.box('meal_tray', (.24, .34, .02), (MX, MY, MZ + .01), M['meal'], bev=.008)
B.box('meal_dish_main', (.13, .17, .035), (MX + .03, MY + .07, MZ + .035), M['foil'], bev=.012)
B.box('meal_stew', (.115, .155, .01), (MX + .03, MY + .07, MZ + .05), M['stew'], bev=.004)
for k in range(14):
    B.sphere('meal_pea_%d' % k, .0055, (MX + .03 + R.uniform(-.045, .045), MY + .07 + R.uniform(-.06, .06), MZ + .057), M['pea'], seg=10, rings=6)
B.sphere('pea_runaway', .0055, (MX - .1, MY + .15, MZ + .028), M['pea'], seg=10, rings=6)
fo = B.box('meal_foil_on', (.135, .175, .01), (MX + .03, MY + .07, MZ + .057), M['foil'], bev=.004)
fl = B.box('meal_foil_lifted', (.135, .175, .004), (MX - .04, MY + .07, MZ + .12), M['foil'], bev=.002, rot=(0, math.radians(-55), 0)); fl.hide_render = True; fl.hide_set(True)
B.box('meal_side_dish', (.08, .08, .03), (MX - .06, MY + .1, MZ + .032), M['meal'], bev=.01)
B.sphere('meal_roll', .03, (MX - .06, MY - .05, MZ + .045), M['roll'], scale=(1.3, 1, .75))
B.box('meal_butter', (.03, .02, .01), (MX - .06, MY + .005, MZ + .028), B.pmat('butter_pale', '#efe3a8', .4), bev=.003)
B.lathe('meal_cup', [(0, 0), (.026, 0), (.032, .085), (.029, .085), (.024, .004), (0, .004)], (MX + .07, MY - .1, MZ + .02), M['cup'])
B.box('meal_cutlery_pack', (.03, .17, .012), (MX + .085, MY - .02, MZ + .026), B.pmat('cutlery_bag', '#e6e8ea', .2, alpha=.7), bev=.004)
B.box('meal_napkin', (.09, .09, .006), (MX - .07, MY - .12, MZ + .024), M['napkin'], bev=.002)
# the owner's closed tray table + the sick bag + a magazine in pockets (story evidence: an ordinary flight for everyone else)
B.box('tray_table_B_stowed', (.03, .4, .3), (.8 - .4, .68, .98), M['tray'], bev=.01, rot=(0, math.radians(-12), 0))
B.box('magazine_B', (.02, .2, .26), (.8 - .395, .6, .5), B.pmat('magazine_cover', '#3aa6c9', .4), bev=.003, rot=(0, math.radians(-12), 0))
# ---------------------------------------------------------------- OUTSIDE: the airliner wing with one neat bite, engine, clouds, sky
B.use(OUTS)
RX_LE, RX_TE, ROOT_Y, TIP_Y, SWEEP, DIH, Z_ROOT = 3.6, -.9, 1.9, 15., math.radians(25), math.radians(5), .35
def wing_pt(y, f, top):
    """f 0 = leading edge .. 1 = trailing edge, at span y; top/bottom surface."""
    t = (y - ROOT_Y) / (TIP_Y - ROOT_Y); le = RX_LE - (y - ROOT_Y) * math.tan(SWEEP); ch = (RX_LE - RX_TE) * (1 - .62 * t)
    th = ch * .11 * (1 - .4 * t) * (math.sin(math.pi * min(1, f * 1.4 + .02)) ** .7) * (1 - f * .5); z = Z_ROOT + (y - ROOT_Y) * math.tan(DIH)
    return (le - f * ch, y, z + (th * .65 if top else -th * .35))
NS, NC = 40, 24; vs, fs = [], []
for i in range(NS + 1):
    y = ROOT_Y + (TIP_Y - ROOT_Y) * i / NS
    for top in (1, 0):
        for k in range(NC + 1): vs.append(wing_pt(y, k / NC if top else 1 - k / NC, top))
rowlen = 2 * (NC + 1)
for i in range(NS):
    for k in range(rowlen - 1): a_ = i * rowlen + k; fs.append((a_, a_ + 1, a_ + rowlen + 1, a_ + rowlen))
fs.append(tuple(range(rowlen))); fs.append(tuple(NS * rowlen + k for k in range(rowlen))[::-1])
wing = B.mesh('wing_left', vs, fs, M['wing'])
BITE_Y = 6.4; ble = RX_LE - (BITE_Y - ROOT_Y) * math.tan(SWEEP)
B.bite(wing, (ble + .25, BITE_Y, Z_ROOT + (BITE_Y - ROOT_Y) * math.tan(DIH)), .75, axis='Z', teeth=6, depth=1.2)
for k, y in enumerate((3.2, 5.0, 7.8, 10.5, 13.0)):     # flap-track fairings (canoes) under the trailing edge
    p = wing_pt(y, .85, 0); B.box('flap_canoe_%d' % k, (1.0, .14, .16), (p[0] - .25, y, p[2] - .07), M['wing'], bev=.06, seg=3)
for k in range(7):                                    # flap / aileron seam lines and walkway on top
    y0 = 2.2 + k * 1.8; p0 = wing_pt(y0, .72, 1); p1 = wing_pt(y0 + 1.6, .72, 1)
    B.tube('flap_seam_%d' % k, [(p0[0], p0[1], p0[2] + .004), (p1[0], p1[1], p1[2] + .004)], .008, M['wing_dark'])
pa, pb = wing_pt(2.0, .45, 1), wing_pt(4.6, .45, 1); B.tube('walkway_line', [(pa[0], pa[1], pa[2] + .006), (pb[0], pb[1], pb[2] + .006)], .012, M['wing_dark'])
tip = wing_pt(TIP_Y, 0, 1); B.box('winglet', (1.2, .12, 1.3), (tip[0] - .6, TIP_Y + .05, tip[2] + .6), M['wing'], bev=.05, rot=(math.radians(-15), math.radians(-25), 0))
B.sphere('nav_light', .07, (tip[0] - .1, TIP_Y + .08, tip[2] + .02), M['navlight'])
ep = wing_pt(5.4, .1, 0)
B.lathe('engine_nacelle', [(.0, -1.6), (.55, -1.5), (.78, -1.0), (.8, .3), (.72, 1.0), (.68, 1.1), (0, 1.1)], (ep[0] + .6, 5.4, ep[2] - 1.0), M['engine'], rot=(0, math.pi / 2, 0))
B.torus('engine_intake_lip', .7, .08, (ep[0] + 1.7, 5.4, ep[2] - 1.0), M['intake'], rot=(0, math.pi / 2, 0))
B.box('engine_pylon', (2.0, .2, .8), (ep[0] - .2, 5.4, ep[2] - .45), M['engine'], bev=.08)
B.box('fuselage_skin_outer', (8., .1, 3.), (.4, 1.98, .9), M['wing'], bev=0)['glb'] = False   # behind the sidewall, catches no camera
sky = B.sphere('sky_dome', 400., (0, 0, 0), M['sky'], seg=32, rings=16); sky.data.flip_normals(); sky['fixed_uv'] = True; sky.visible_shadow = False
ul = sky.data.uv_layers.new(name='UVMap')
for poly in sky.data.polygons:
    for li in poly.loop_indices:
        v = sky.data.vertices[sky.data.loops[li].vertex_index].co; ul.data[li].uv = (.5, 1 - (v.z / 400 * .5 + .5))
for k in range(70):                                   # the cloud deck below: stylised cumulus heaps (icosphere clusters)
    cx, cy = R.uniform(-160, 160), R.uniform(10, 200); n = R.randint(3, 6)
    for q in range(n):
        r = R.uniform(5, 14); c = B.sphere('cloud_%d_%d' % (k, q), r, (cx + R.uniform(-12, 12), cy + R.uniform(-8, 8), -45 + R.uniform(0, r * .5)), M['cloud'], seg=12, rings=8, scale=(1.4, 1, .7))
        c.visible_shadow = False
# ---------------------------------------------------------------- light: hard white sun above the clouds, sky fill, cove fill inside
B.world(sc, '#1a86f2', '#cfe0ff', .9)
B.light('sun', 'SUN', (0, 10, 10), '#fff6e8', 5.5, rot=B.aim_rot((-3, 10, 7), (0, 0, 0)), angle=1.2)
for s in (1, -1): B.light('cove_fill_%d' % s, 'AREA', ((X0 + X1) / 2, s * .8, 2.15), '#fff6ec', 140, size=5., size_y=.4)
B.light('window_fill', 'AREA', (win_x(0), 1.6, WIN_Z), '#f2f7ff', 25, rot=(math.radians(90), 0, math.radians(180)), size=.5, size_y=.6)
CAMS = {
 'CAM_TWO': dict(pos=(.55, -.6, 1.22), aim=(-.05, 1.3, .92), lens=18),
 'CAM_TRAY': dict(pos=(.05, .62, 1.18), aim=(MX + .02, MY + .02, MZ), lens=24),
 'CAM_WINDOW': dict(pos=(-.15, .3, 1.08), aim=(win_x(0) + .15, 1.9, .86), lens=20),
}
for k, v in CAMS.items(): B.cam(k, v['pos'], v['aim'], v['lens'])
B.render_setup(sc)
B.bake_all(sc)
meta = dict(frame='Blender metres, Z up, nose +X; kit: B2T', place='cabin', cams={k: dict(pos=list(v['pos']), aim=list(v['aim']), lens=v['lens']) for k, v in CAMS.items()},
            anchors=dict(michel_seat=[0, 1.2, .52], owner_seat=[0, .68, .52], tray_table=[TX, TY, TZ + .0125], meal_tray=[MX, MY, MZ + .02], foil_lid=[MX + .03, MY + .07, MZ + .06],
                         pea_runaway=[MX - .1, MY + .15, MZ + .028], window=[win_x(0), wall_y(WIN_Z), WIN_Z], wing_bite=[ble + .25, BITE_Y, Z_ROOT + (BITE_Y - ROOT_Y) * math.tan(DIH)],
                         aisle_y=.17, rows_x=ROWS),
            states=dict(tray='tray_table (shown) / tray_table_bitten (hidden): swap at FOOD 33.38', foil='meal_foil_on (shown) / meal_foil_lifted (hidden)', pea='pea_runaway rolls off the tray edge (row 36)'))
B.export(sc, OUT, 'cabin', meta)
print('CABIN_DONE')
