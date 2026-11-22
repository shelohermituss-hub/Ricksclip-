"""tex_mc.py: PIL pictures for mission control (LOOK_INVENTORY C3, word for word). python3 tex_mc.py -> ../tex/*.png
Wall screen 1920x1080 (16:9), clock strip 2560x192, side monitors, desk labels, button label, space-panel placeholder."""
import os, math, random, json
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops
T = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tex'); os.makedirs(T, exist_ok=True)
SS = 2                      # supersample
W, H = 1920, 1080
FI = '/usr/share/fonts/opentype/inter/'
def font(sz, style='BoldItalic'):
    for p in (FI + 'Inter-%s.otf' % style, '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'):
        if os.path.exists(p): return ImageFont.truetype(p, int(sz))
    return ImageFont.load_default()
def rgb(h): h = h.lstrip('#'); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
def canvas(col, w=W, h=H): return Image.new('RGB', (w * SS, h * SS), col)
def done(im, name, w=W, h=H):
    im = im.resize((w, h), Image.LANCZOS); im.save(os.path.join(T, name)); return im
def add_glow(im, layer, blur, gain=1.0):
    """layer: RGB on black. Adds a blurred copy (glow) then the crisp layer on top (screen blend)."""
    g = layer.filter(ImageFilter.GaussianBlur(blur * SS))
    if gain != 1.0: g = g.point(lambda v: min(255, int(v * gain)))
    return ImageChops.screen(ImageChops.screen(im, g), layer)
def over(im, layer_rgba): im.paste(layer_rgba, (0, 0), layer_rgba); return im

# ---- stroke font: squared, rounded joins, italic shear (the "GO / OFF COURSE / NO FLUSHING" face). Grid 4 wide, 6 tall, y up.
G = {
 'O': [[(0, 0), (4, 0), (4, 6), (0, 6), (0, 0)]], 'G': [[(4, 6), (0, 6), (0, 0), (4, 0), (4, 2.8), (2, 2.8)]],
 'N': [[(0, 0), (0, 6), (4, 0), (4, 6)]], 'F': [[(4, 6), (0, 6), (0, 0)], [(0, 3), (3.2, 3)]],
 'L': [[(0, 6), (0, 0), (4, 0)]], 'U': [[(0, 6), (0, 0), (4, 0), (4, 6)]],
 'S': [[(4, 6), (0, 6), (0, 3), (4, 3), (4, 0), (0, 0)]], 'H': [[(0, 0), (0, 6)], [(4, 0), (4, 6)], [(0, 3), (4, 3)]],
 'I': [[(0, 0), (0, 6)]], 'T': [[(0, 6), (4, 6)], [(2, 6), (2, 0)]], 'C': [[(4, 6), (0, 6), (0, 0), (4, 0)]],
 'R': [[(0, 0), (0, 6), (4, 6), (4, 3), (0, 3)], [(2, 3), (4, 0)]], 'E': [[(4, 6), (0, 6), (0, 0), (4, 0)], [(0, 3), (3.2, 3)]],
 '1': [[(0.2, 4.8), (1.8, 6), (1.8, 0)]], '2': [[(0, 6), (4, 6), (4, 3), (0, 3), (0, 0), (4, 0)]],
 '3': [[(0, 6), (4, 6), (4, 0), (0, 0)], [(1.2, 3), (4, 3)]], ' ': [],
}
GW = {'I': 0, '1': 1.8, ' ': 1.6}
def stroke_width(txt, u, gap): return sum(GW.get(c, 4) * u + gap for c in txt) - gap
def stroke_text(d, txt, cx, cy, hpx, col, wt, shear=.2, gap=None, outline=None):
    """centre (cx, cy), cap height hpx, stroke weight wt (px); all in final px (scaled by SS here)."""
    u = hpx / 6.0; gap = wt * 1.9 if gap is None else gap
    x = cx - stroke_width(txt, u, gap) / 2
    def P(px, py): return ((x + px * u + shear * (py - 3) * u) * SS, (cy + (3 - py) * u) * SS)
    for c in txt:
        for line in G[c]:
            pts = [P(*p) for p in line]
            if outline:     # outline letters: fat stroke in col, then a thinner stroke in the fill colour inside
                pass
            d.line(pts, fill=col, width=int(wt * SS), joint='curve')
            r = wt * SS / 2
            for p in (pts[0], pts[-1]) + tuple(pts): d.ellipse((p[0] - r, p[1] - r, p[0] + r, p[1] + r), fill=col)
        x += GW.get(c, 4) * u + gap
def text(d, xy, s, sz, col, anchor='la', style='BoldItalic', spacing=0):
    f = font(sz * SS, style); x, y = xy[0] * SS, xy[1] * SS
    if not spacing: d.text((x, y), s, font=f, fill=col, anchor=anchor); return
    if anchor[0] == 'r': x -= sum(f.getlength(c) + spacing * SS for c in s)
    if anchor[0] == 'm': x -= sum(f.getlength(c) + spacing * SS for c in s) / 2
    for c in s: d.text((x, y), c, font=f, fill=col, anchor='l' + anchor[1]); x += f.getlength(c) + spacing * SS
def dashed(d, p0, p1, col, wd, dash, gap):
    L = math.dist(p0, p1); n = int(L / (dash + gap)) + 1; ux, uy = (p1[0] - p0[0]) / L, (p1[1] - p0[1]) / L
    for i in range(n):
        a = i * (dash + gap); b = min(L, a + dash)
        if a >= L: break
        d.line(((p0[0] + ux * a) * SS, (p0[1] + uy * a) * SS, (p0[0] + ux * b) * SS, (p0[1] + uy * b) * SS), fill=col, width=int(wd * SS))
def dash_text_block(d, x, y, w, rows, col, seed, rh=13, wd=3):
    r = random.Random(seed)
    for i in range(rows):
        xx = x
        while xx < x + w - 20:
            ln = r.choice((14, 22, 30, 44, 60)); ln = min(ln, x + w - xx)
            if r.random() > .12: d.line((xx * SS, (y + i * rh) * SS, (xx + ln) * SS, (y + i * rh) * SS), fill=col, width=wd * SS)
            xx += ln + r.choice((8, 10, 16))
def corner_dashes(d, col='#c9d4f2'):
    dashed(d, (28, 26), (560, 26), col, 3, 26, 12); dashed(d, (1360, 26), (1892, 26), col, 3, 26, 12)
def black(w=W, h=H): return Image.new('RGB', (w * SS, h * SS), (0, 0, 0))

# ================= 1. MAP (f130-180) =================
SPACE_RECT = (0.022, 0.035, 0.149, 0.435)        # u0, v0, u1, v1 on the screen (v down): the small space-view panel
LAND = {
 'na': [(-165, 65), (-140, 70), (-95, 72), (-80, 62), (-60, 52), (-75, 40), (-82, 28), (-97, 25), (-105, 20), (-88, 15), (-80, 9), (-100, 18), (-118, 33), (-125, 48), (-150, 60)],
 'sa': [(-80, 9), (-62, 10), (-50, 0), (-35, -7), (-40, -22), (-55, -35), (-68, -54), (-74, -45), (-70, -18), (-81, -5)],
 'gr': [(-55, 82), (-22, 80), (-25, 70), (-43, 60), (-52, 68)],
 'af': [(-17, 15), (-10, 32), (10, 37), (32, 31), (43, 12), (51, 11), (40, -15), (32, -28), (20, -35), (13, -15), (9, 4), (-8, 5)],
 'eu': [(-10, 37), (-5, 48), (5, 60), (25, 71), (70, 75), (105, 78), (140, 73), (180, 68), (165, 60), (142, 52), (130, 42), (122, 30), (108, 20), (105, 10), (98, 8), (92, 22), (80, 8), (72, 20), (60, 25), (50, 28), (36, 36), (27, 37), (15, 40), (0, 38)],
 'au': [(114, -5), (130, 5), (143, 6), (153, -10), (146, -22), (130, -16), (116, -17)],      # placed higher, as on his map (v .5-.63)
}
def ll(lon, lat): return ((lon + 180) / 380 * W, (88 - lat) / 152 * H)       # lon -180..200, lat 88..-64 (his land: x .04-.95, y .1-.9)
def track_y(u): return (0.445 - 0.285 * math.cos(2 * math.pi * (u - 0.27) / 0.48)) * H   # his f165: crest u.27 v.16, trough u.51 v.73
def make_map():
    im = canvas('#2b3c78'); d = ImageDraw.Draw(im)
    for i in range(1, 10): d.line((i * W / 10 * SS, 0, i * W / 10 * SS, H * SS), fill='#41559a', width=2 * SS)
    for j in range(1, 6): d.line((0, j * H / 6 * SS, W * SS, j * H / 6 * SS), fill='#41559a', width=2 * SS)
    for k, poly in LAND.items():
        pts = [tuple(c * SS for c in ll(*p)) for p in poly]
        d.polygon(pts, fill='#608c99'); d.line(pts + [pts[0]], fill='#86b0b8', width=3 * SS, joint='curve')
    for i in range(1, 10):      # grid shows faintly over the land too
        d.line((i * W / 10 * SS, 0, i * W / 10 * SS, H * SS), fill='#6b97a3', width=1 * SS)
    for j in range(1, 6): d.line((0, j * H / 6 * SS, W * SS, j * H / 6 * SS), fill='#6b97a3', width=1 * SS)
    for k, poly in LAND.items():
        pts = [tuple(c * SS for c in ll(*p)) for p in poly]; d.line(pts + [pts[0]], fill='#86b0b8', width=3 * SS, joint='curve')
    SHIP = 0.62
    pts = [(u * W * SS, track_y(u) * SS) for u in [i / 400 * SHIP for i in range(401)]]
    lay = black(); dl = ImageDraw.Draw(lay); dl.line(pts, fill='#f5e27f', width=6 * SS, joint='curve')
    im = add_glow(im, lay, 3, .25); d = ImageDraw.Draw(im)
    u = SHIP
    while u < 0.965:            # predicted part: thin white dashed
        a = (u * W, track_y(u)); b = ((u + .004) * W, track_y(u + .004)); d.line((a[0] * SS, a[1] * SS, b[0] * SS, b[1] * SS), fill='#e8eefc', width=2 * SS); u += .008
    x, y = SHIP * W * SS, track_y(SHIP) * SS; d.ellipse((x - 13 * SS, y - 13 * SS, x + 13 * SS, y + 13 * SS), fill='#fdfdf4')
    dash_text_block(d, 24, 790, 380, 12, '#aebbe6', 3); corner_dashes(d)
    bx0, by0, bx1, by1 = .79 * W, .70 * H, .985 * W, .90 * H     # bottom-right wave inset (his f165): dark box, dashed header, cyan + green sine waves
    d.rectangle((bx0 * SS, by0 * SS, bx1 * SS, by1 * SS), fill='#1d2b63', outline='#3c55a0', width=2 * SS); dashed(d, (bx0 + 10, by0 - 10), (bx1 - 10, by0 - 10), '#c9d4f2', 3, 22, 10)
    for col, ph, am in (('#5fe0f0', 0., .32), ('#62e0a0', 1.9, .22)):
        wp = [((bx0 + (bx1 - bx0) * k / 120) * SS, ((by0 + by1) / 2 + (by1 - by0) * am * math.sin(ph + k / 120 * 4 * math.pi)) * SS) for k in range(121)]
        d.line(wp, fill=col, width=3 * SS, joint='curve')
    u0, v0, u1, v1 = SPACE_RECT   # the blue 3 px frame of the inset is part of the map; the picture itself is the plane mc_space_panel
    d.rectangle(((u0 * W - 5) * SS, (v0 * H - 5) * SS, (u1 * W + 5) * SS, (v1 * H + 5) * SS), fill='#060a1e', outline='#3f7fe0', width=4 * SS)
    done(im, 'mc_screen_map.png')
def make_space_placeholder():
    w, h = 540, 960; im = Image.new('RGB', (w, h), '#04061a'); d = ImageDraw.Draw(im); r = random.Random(5)
    for _ in range(260):
        x, y, s = r.random() * w, r.random() * h, r.choice((1, 1, 1, 2)); v = r.randint(120, 240); d.ellipse((x - s, y - s, x + s, y + s), fill=(v, v, v))
    g = Image.new('RGB', (w, h), (0, 0, 0)); dg = ImageDraw.Draw(g); dg.ellipse((230, 400, 330, 470), fill='#b9a8ff'); dg.ellipse((215, 418, 262, 448), fill='#ffffff')
    im = ImageChops.screen(im, g.filter(ImageFilter.GaussianBlur(14))); im = ImageChops.screen(im, g.filter(ImageFilter.GaussianBlur(3)))
    d = ImageDraw.Draw(im); d.text((w / 2, h - 60), 'PLACEHOLDER: shot 2 picture', font=ImageFont.truetype(FI + 'Inter-Bold.otf', 22), fill='#5a6aa8', anchor='mm')
    im.save(os.path.join(T, 'mc_space_panel.png'))

# ================= 2. FLUSH WINDOW: ring / 3 / 2 / 1 / go / alarm =================
RC = (0.5 * W, 0.40 * H); RR = 0.235 * H
def header_flush(d, tick='#f3e06a', txt='#f4f6ff', rule='#3fb6c8'):
    d.rectangle((54 * SS, 44 * SS, 62 * SS, 92 * SS), fill=tick); text(d, (80, 68), 'FLUSH WINDOW', 44, txt, 'lm', spacing=3)
    d.line((54 * SS, 108 * SS, 1866 * SS, 108 * SS), fill=rule, width=2 * SS); dashed(d, (1420, 30), (1866, 30), '#c9d4f2', 3, 26, 12)
def ring(dl, col, wd, a0=0, a1=360, r=RR):
    dl.arc(((RC[0] - r) * SS, (RC[1] - r) * SS, (RC[0] + r) * SS, (RC[1] + r) * SS), a0 - 90, a1 - 90, fill=col, width=int(wd * SS))
def make_count(name, digit, sweep):
    im = canvas('#252d4c'); d = ImageDraw.Draw(im)
    vg = black(); dv = ImageDraw.Draw(vg); dv.ellipse((W * .15 * SS, -H * .2 * SS, W * .85 * SS, H * 1.0 * SS), fill='#101426'); im = ImageChops.screen(im, vg.filter(ImageFilter.GaussianBlur(160 * SS)))
    d = ImageDraw.Draw(im); header_flush(d)
    lay = black(); dl = ImageDraw.Draw(lay); ring(dl, '#b0763c' if digit is None else '#5c4526', 9)
    if digit is not None:
        ring(dl, '#f6c64e', 12, 0, sweep); stroke_text(dl, digit, RC[0], RC[1], RR * 1.02, '#fff3cf', 46, shear=.16)
    im = add_glow(im, lay, 16, .75); done(im, name)
def make_go():
    im = canvas('#1f2c3e'); gl = black(); dg = ImageDraw.Draw(gl)
    dg.ellipse(((RC[0] - 380) * SS, (RC[1] - 360) * SS, (RC[0] + 380) * SS, (RC[1] + 400) * SS), fill='#0b2e24'); im = ImageChops.screen(im, gl.filter(ImageFilter.GaussianBlur(120 * SS)))
    d = ImageDraw.Draw(im); header_flush(d, tick='#62fdbd')
    lay = black(); dl = ImageDraw.Draw(lay); ring(dl, '#62fdbd', 30); stroke_text(dl, 'GO', RC[0] - 4, RC[1] - 18, RR * .78, '#62fdbd', 52, shear=.2, gap=58)
    text(dl, (RC[0], RC[1] + RR * .60), 'AUTHORIZED', 30, '#62fdbd', 'mm', style='Bold', spacing=4)
    im = add_glow(im, lay, 16, .7); done(im, 'mc_screen_go.png')
def make_alarm():
    im = canvas('#8e0f1e'); gl = black(); dg = ImageDraw.Draw(gl)
    dg.ellipse(((RC[0] - 700) * SS, (RC[1] - 500) * SS, (RC[0] + 700) * SS, (RC[1] + 560) * SS), fill='#3a0508'); im = ImageChops.screen(im, gl.filter(ImageFilter.GaussianBlur(170 * SS)))
    d = ImageDraw.Draw(im); header_flush(d, tick='#ff8d8d', txt='#ffd9dc', rule='#e0596a')
    lay = black(); dl = ImageDraw.Draw(lay); ring(dl, '#c8202c', 14)
    stroke_text(dl, 'NO GO', RC[0], RC[1] - 10, RR * .80, '#ff3a3a', 54, shear=.2, gap=58)
    stroke_text(dl, 'NO GO', RC[0], RC[1] - 10, RR * .80, '#6e0812', 30, shear=.2, gap=58)      # hollow = outline letters
    text(dl, (RC[0], RC[1] + RR * .60), 'INHIBITED', 30, '#ff4a4a', 'mm', style='Bold', spacing=4)
    im = add_glow(im, lay, 18, .9); done(im, 'mc_screen_alarm.png')

# ================= 3. banners =================
def hazard(d, x0, y0, x1, y1, n=5):
    d.rectangle((x0 * SS, y0 * SS, x1 * SS, y1 * SS), fill='#f7d21e'); w = (x1 - x0) / n; hh = y1 - y0
    for i in range(-1, n + 1):
        xa = x0 + i * w; d.polygon([((xa) * SS, y1 * SS), ((xa + w * .5) * SS, y1 * SS), ((xa + w * .5 + hh * .7) * SS, y0 * SS), ((xa + hh * .7) * SS, y0 * SS)], fill='#17131a')
def make_noflush():
    im = canvas('#2a2746'); d = ImageDraw.Draw(im); header_flush(d, tick='#8f7fb0', txt='#55507a', rule='#4a4670')
    d.rectangle((0, 0, W * SS, 130 * SS), fill='#2a2746')
    x0, x1 = .12 * W, .90 * W
    d.rectangle((x0 * SS, 62 * SS, x1 * SS, 128 * SS), fill='#ab082c'); hazard(d, x0 + 12, 74, x0 + 150, 116)
    d.rectangle((x0 * SS, 62 * SS, (x0 + 12) * SS, 128 * SS), fill='#ab082c')
    text(d, (x0 + 172, 95), 'C&W  FLT DIR  WCS INHIBIT', 38, '#fef6f8', 'lm', spacing=2); text(d, (x1 - 24, 95), 'MSG 0417', 38, '#fef6f8', 'rm', spacing=2)
    lay = black(); dl = ImageDraw.Draw(lay); dl.rectangle((x0 * SS, 140 * SS, x1 * SS, 590 * SS), fill='#5a0818'); im = add_glow(im, lay, 22, .8); d = ImageDraw.Draw(im)
    d.rectangle((x0 * SS, 140 * SS, x1 * SS, 590 * SS), fill='#e4163d')
    d.rectangle(((x0 + 14) * SS, 154 * SS, (x1 - 14) * SS, 576 * SS), outline='#fef6f8', width=5 * SS)
    cx = (x0 + x1) / 2
    stroke_text(d, 'NO FLUSHING', cx, 272, 150, '#fef6f8', 34, shear=.2, gap=38); stroke_text(d, 'TONIGHT', cx, 466, 150, '#fef6f8', 34, shear=.2, gap=38)
    done(im, 'mc_screen_noflush.png')
def graph_pts():
    """plan-vs-actual, screen fractions (his f806 / f860): the red line follows the plan to K, then leaves it and bends down to the arrow head."""
    P0, K, P1 = (0.07, 0.76), (0.43, 0.61), (0.86, 0.36)
    red = [P0, K, (0.55, 0.625), (0.67, 0.66), (0.79, 0.71), (0.905, 0.78)]
    return P0, K, P1, red
def make_offcourse(name, dev=4.7, grow=1.0):
    """his f806/f825 layout: magenta-red screen with a faint map, a red box (header strip + band) on the middle 60 %, OFF COURSE white letters
    wider than the band (75 % of the screen), the sub line under it, a dark plot box with a thin red frame on the lower 60 %."""
    im = canvas('#6e1f45'); d = ImageDraw.Draw(im)
    for k, poly in LAND.items():          # faint map behind (his alert screen keeps the orbit map, tinted)
        pts = [tuple(c * SS for c in ll(*p)) for p in poly]; d.line(pts + [pts[0]], fill='#8a3a60', width=3 * SS, joint='curve')
    gx0, gy0, gx1, gy1 = .04 * W, .30 * H, .93 * W, .89 * H
    d.rectangle((gx0 * SS, gy0 * SS, gx1 * SS, gy1 * SS), fill='#2a1927', outline='#c8304a', width=3 * SS)
    for i in range(1, 8): d.line(((gx0 + i * (gx1 - gx0) / 8) * SS, gy0 * SS, (gx0 + i * (gx1 - gx0) / 8) * SS, gy1 * SS), fill='#3a2333', width=2 * SS)
    for j in range(1, 4): d.line((gx0 * SS, (gy0 + j * (gy1 - gy0) / 4) * SS, gx1 * SS, (gy0 + j * (gy1 - gy0) / 4) * SS), fill='#3a2333', width=2 * SS)
    x0, x1 = .23 * W, .825 * W
    lay = black(); dl = ImageDraw.Draw(lay); dl.rectangle((x0 * SS, .025 * H * SS, x1 * SS, .245 * H * SS), fill='#5a0414'); im = add_glow(im, lay, 18, .7); d = ImageDraw.Draw(im)
    d.rectangle((x0 * SS, .025 * H * SS, x1 * SS, .085 * H * SS), fill='#a6001e'); d.rectangle((x0 * SS, .085 * H * SS, x1 * SS, .245 * H * SS), fill='#d6072b')
    hazard(d, x0 + 10, .033 * H, x0 + 120, .077 * H, 4)
    text(d, (x0 + 140, .055 * H), 'C&W  FIDO  TRAJ DEVIATION', 30, '#fef6f8', 'lm', style='Bold', spacing=2); text(d, (x1 - 20, .055 * H), 'MSG 0418', 30, '#fef6f8', 'rm', style='Bold', spacing=2)
    sh = Image.new('RGBA', im.size, (0, 0, 0, 0)); ds = ImageDraw.Draw(sh); stroke_text(ds, 'OFF COURSE', .525 * W + 6, .168 * H + 6, 160, (50, 0, 12, 160), 31, shear=.2, gap=34)
    im = over(im, sh.filter(ImageFilter.GaussianBlur(4 * SS))); d = ImageDraw.Draw(im)
    stroke_text(d, 'OFF COURSE', .525 * W, .168 * H, 160, '#ffffff', 31, shear=.2, gap=34)        # wider than its red band, on purpose (his layout)
    text(d, (.05 * W, .272 * H), 'FIDO  TRAJ  PLAN VS ACTUAL', 26, '#fbe9ec', 'lm', style='Bold', spacing=2); text(d, (.90 * W, .272 * H), 'DEV  %.1f DEG' % dev, 26, '#fbe9ec', 'rm', style='Bold', spacing=2)
    P0, K, P1, red = graph_pts(); S = lambda p: (p[0] * W, p[1] * H)
    dashed(d, S(K), S(P1), '#ffffff', 8, 30, 20); text(d, (0.055 * W, 0.715 * H), 'PLANNED', 24, '#fbe9ec', 'lm', style='Bold', spacing=2)
    seg = [red[0], red[1]]; rest = red[1:]; tot = sum(math.dist(rest[i], rest[i + 1]) for i in range(len(rest) - 1)); need = tot * grow; last = (red[0], red[1])
    for i in range(len(rest) - 1):
        L = math.dist(rest[i], rest[i + 1])
        if need <= 1e-6: break
        t = min(1, need / L); p = (rest[i][0] + (rest[i + 1][0] - rest[i][0]) * t, rest[i][1] + (rest[i + 1][1] - rest[i][1]) * t); seg.append(p); last = (rest[i], p); need -= L
    lay = black(); dl = ImageDraw.Draw(lay); dl.line([tuple(c * SS for c in S(p)) for p in seg], fill='#ff2a40', width=9 * SS, joint='curve')
    a, b = S(last[0]), S(last[1]); ang = math.atan2(b[1] - a[1], b[0] - a[0]); L = 46
    tip = (b[0] + math.cos(ang) * 26, b[1] + math.sin(ang) * 26)
    dl.polygon([tuple(c * SS for c in q) for q in (tip, (tip[0] - L * math.cos(ang - .45), tip[1] - L * math.sin(ang - .45)), (tip[0] - L * math.cos(ang + .45), tip[1] - L * math.sin(ang + .45)))], fill='#ff2a40')
    im = add_glow(im, lay, 7, .55); d = ImageDraw.Draw(im)
    d.rectangle((0, 0, im.size[0] - 1, im.size[1] - 1), outline='#7a214c', width=16 * SS)
    done(im, name)

# ================= 4. clock strip (7-segment amber) =================
SEG = {'0': 'abcdef', '1': 'bc', '2': 'abdeg', '3': 'abcdg', '4': 'bcfg', '5': 'acdfg', '6': 'acdefg', '7': 'abc', '8': 'abcdefg', '9': 'abcdfg', ' ': ''}
def seg7(d, x, y, w, h, ch, col, t, sh=.12):
    def P(px, py): return ((x + px + sh * (h - py)) * SS, (y + py) * SS)
    m = h / 2; segs = {'a': ((t, 0), (w - t, 0)), 'b': ((w, t * .6), (w, m - t * .6)), 'c': ((w, m + t * .6), (w, h - t * .6)), 'd': ((t, h), (w - t, h)), 'e': ((0, m + t * .6), (0, h - t * .6)), 'f': ((0, t * .6), (0, m - t * .6)), 'g': ((t, m), (w - t, m))}
    for k in SEG.get(ch, ''):
        a, b = segs[k]; d.line((P(*a), P(*b)), fill=col, width=int(t * SS))
CW, CH = 2560, 192
CLOCK_BOX = [(0.000, 0.300, 'GMT'), (0.300, 0.620, 'MET'), (0.620, 0.840, 'CST'), (0.840, 1.000, 'LOS')]
def make_clock(name, gmt, met, cst, los):
    im = canvas('#0a0c1c', CW, CH); d = ImageDraw.Draw(im); lit = black(CW, CH); dl = ImageDraw.Draw(lit)
    for (u0, u1, lab), val in zip(CLOCK_BOX, (gmt, met, cst, los)):
        x0, x1 = u0 * CW + 8, u1 * CW - 8; d.rounded_rectangle((x0 * SS, 10 * SS, x1 * SS, (CH - 10) * SS), radius=8 * SS, fill='#161928', outline='#262b44', width=2 * SS)
        text(d, (x0 + 16, 34), lab, 26, '#f2f4ff', 'lm', style='Bold', spacing=1)
        dw, dh, gap, t = 44, 84, 20, 10; n = len(val); tw = sum((dw + gap) if c not in ': ' else (26 if c == ':' else 36) for c in val)
        x = x1 - 30 - tw; y = 78
        for c in val:
            if c == ':':
                for yy in (y + dh * .3, y + dh * .7): dl.ellipse(((x + 8) * SS, (yy - 5) * SS, (x + 18) * SS, (yy + 5) * SS), fill='#f5c84a')
                x += 26; continue
            if c == ' ': x += 36; continue
            seg7(d, x, y, dw, dh, '8', '#3a2414', t); seg7(dl, x, y, dw, dh, c, '#f7cf55', t); x += dw + gap
    im = add_glow(im, lit, 7, .7); done(im, name, CW, CH)
def clock_values(sec, shot10=False):
    """sec = whole seconds since the shot's first clock value."""
    if not shot10: g, m, los = 57 + sec, 33 + sec, 12 * 60 + 4 - max(1, sec); gm, cm = 41, 41   # his: LOS 12:03 at f135 and f165, 12:02 f180, 12:00 f240, 11:59 f275
    else: g, m, los = 19 + sec, 55 + sec, 11 * 60 + 42 - sec; gm, cm = 42, 42      # his f806: 17:55, 16:42:19, 11:42
    if g >= 60: g -= 60; gm += 1; cm += 1
    return '325:21:%02d:%02d' % (gm, g), '0 12:04:17:%02d' % m, '16:%02d:%02d' % (cm, g), '%d:%02d' % (los // 60, los % 60)

# ================= 5. side monitor, desk labels, button label =================
def make_side(name, seed, alarm=False):
    w, h = 600, 900; im = canvas('#14204a', w, h); d = ImageDraw.Draw(im); r = random.Random(seed)
    d.rectangle((14 * SS, 14 * SS, (w - 14) * SS, (h - 14) * SS), outline='#f2d84a' if alarm else '#2f4078', width=(8 if alarm else 3) * SS)
    d.rectangle((40 * SS, 60 * SS, (w - 40) * SS, 420 * SS), fill='#1b2a5a')
    for j in range(1, 5): d.line((40 * SS, (60 + j * 72) * SS, (w - 40) * SS, (60 + j * 72) * SS), fill='#2a3b72', width=2 * SS)
    for col, base, amp in (('#f1e3b0', 200, 60), ('#5fe0f0', 320, 46)):
        y = base; pts = []
        for i in range(53): y += r.uniform(-amp * .22, amp * .22) - (y - (base - i * 1.6)) * .08; pts.append(((40 + i * 10) * SS, y * SS))
        d.line(pts, fill=col, width=4 * SS, joint='curve')
    dash_text_block(d, 44, 470, w - 88, 24, '#d8e8fa', seed + 1, rh=16, wd=3)
    done(im, name, w, h)
def make_label(name, s, w, h, sz, bg, fg='#ffffff', style='ExtraBold', sp=6):
    im = canvas(bg, w, h); d = ImageDraw.Draw(im); text(d, (w / 2, h / 2), s, sz, fg, 'mm', style=style, spacing=sp); done(im, name, w, h)

if __name__ == '__main__':
    make_map(); make_space_placeholder()
    make_count('mc_screen_ring.png', None, 0); make_count('mc_screen_3.png', '3', 95); make_count('mc_screen_2.png', '2', 185); make_count('mc_screen_1.png', '1', 200)
    make_go(); make_alarm(); make_noflush()
    make_offcourse('mc_screen_offcourse.png', 4.7, 1.0)
    OFFSEQ = []          # shot 10: the DEV number counts 0.0 -> 4.7 from f804 to f825, the red line grows to the right all shot
    for i, (f, dev, grow) in enumerate([(803, 0.0, 0.), (807, 0.9, .12), (811, 1.8, .25), (815, 2.7, .38), (819, 3.6, .50), (823, 4.4, .62), (826, 4.7, .70), (846, 4.7, .88), (860, 4.7, 1.0)]):
        n = 'mc_offcourse_%02d.png' % i; make_offcourse(n, dev, grow); OFFSEQ.append({'f': f, 'png': n, 'dev': dev, 'grow': grow})
    CLK = []
    for s in range(6): n = 'mc_clock_s3_%d.png' % s; make_clock(n, *clock_values(s)); CLK.append({'f': 120 + 30 * s, 'png': n, 'values': clock_values(s)})       # ticks f150 180 210 240 270 (his MET 17:34 f165, 17:35 f180, 17:38 f275)
    for s in range(3): n = 'mc_clock_s10_%d.png' % s; make_clock(n, *clock_values(s, True)); CLK.append({'f': (803, 815, 845)[s], 'png': n, 'values': clock_values(s, True)})   # his 17:55 f806, 17:56 f825
    make_side('mc_side_a.png', 3); make_side('mc_side_b.png', 9); make_side('mc_side_alarm.png', 3, True)
    for s in ('FAO', 'CAPCOM', 'GUIDO'): make_label('mc_label_%s.png' % s.lower(), s, 512, 96, 54, '#383645')
    make_label('mc_label_nogo.png', 'NO GO', 256, 64, 34, '#fffdff', fg='#c9a59d', style='Bold', sp=4)
    json.dump({'space_rect_uv': SPACE_RECT, 'offcourse_seq': OFFSEQ, 'clock_seq': CLK, 'clock_boxes': CLOCK_BOX, 'screen_px': [W, H], 'clock_px': [CW, CH]}, open(os.path.join(T, 'mc_tex.json'), 'w'), indent=1)
    # contact sheet of the nine screens (own pictures only)
    names = ['map', 'ring', '3', '2', '1', 'go', 'alarm', 'noflush', 'offcourse']; sh = Image.new('RGB', (3 * 640, 3 * 360 + 60), '#000')
    for i, n in enumerate(names): sh.paste(Image.open(os.path.join(T, 'mc_screen_%s.png' % n)).resize((640, 360), Image.LANCZOS), ((i % 3) * 640, (i // 3) * 360))
    sh.paste(Image.open(os.path.join(T, 'mc_clock_s3_0.png')).resize((800, 60), Image.LANCZOS), (0, 1080)); sh.paste(Image.open(os.path.join(T, 'mc_clock_s10_0.png')).resize((800, 60), Image.LANCZOS), (820, 1080))
    sh.save(os.path.join(T, '..', 'out', 'mc_screens_sheet.jpg'), quality=90)
    print('tex ok')
