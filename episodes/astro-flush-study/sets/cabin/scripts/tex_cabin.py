"""tex_cabin.py: PIL pictures for the cabin place (lettering word for word from LOOK_INVENTORY D3/E3). python3 tex_cabin.py -> ../tex/*.png"""
import os, random
from PIL import Image, ImageDraw, ImageFont
T = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tex'); os.makedirs(T, exist_ok=True)
def font(sz, cond=False):
    for p in (('/usr/share/fonts/truetype/dejavu/DejaVuSansCondensed-Bold.ttf',) if cond else ()) + ('/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'):
        if os.path.exists(p): return ImageFont.truetype(p, sz)
    return ImageFont.load_default()
# ---- HEAD sign: green plate, gold border, cream "HEAD", white toilet pictogram, "AFT" + down triangle
W, H = 600, 800; S = Image.new('RGB', (W, H), '#344e46'); d = ImageDraw.Draw(S)
d.rectangle((14, 14, W - 15, H - 15), outline='#ebd58a', width=14)
d.text((W / 2, 150), 'HEAD', font=font(190, True), fill='#fcfce9', anchor='mm')
c = '#fcfce9'; d.rounded_rectangle((235, 300, 365, 380), 14, fill=c); d.ellipse((190, 400, 410, 500), fill=c); d.polygon((215, 450, 385, 450, 340, 620, 260, 620), fill=c)
d.rectangle((250, 620, 350, 660), fill=c)
d.text((W / 2 - 40, 722), 'AFT', font=font(70, True), fill='#fcfce9', anchor='mm'); d.polygon((W / 2 + 40, 700, W / 2 + 110, 700, W / 2 + 75, 750), fill='#fcfce9')
S.save(os.path.join(T, 'sign_head.png'))
# ---- monitor label plate "LINK • HOUSTON FLIGHT"
L = Image.new('RGB', (1000, 120), '#24232a'); d = ImageDraw.Draw(L); d.text((500, 60), 'LINK • HOUSTON FLIGHT', font=font(78, True), fill='#f3f2f8', anchor='mm'); L.save(os.path.join(T, 'label_link.png'))
# ---- monitor placeholder (the stretch builder feeds the mission control picture): dark grey with a grid and the word PLACEHOLDER
M = Image.new('RGB', (540, 960), '#1b1d2e'); d = ImageDraw.Draw(M)
for x in range(0, 540, 60): d.line((x, 0, x, 960), fill='#2b2f48', width=2)
for y in range(0, 960, 60): d.line((0, y, 540, y), fill='#2b2f48', width=2)
d.rectangle((50, 300, 490, 460), fill='#d8202a'); d.text((270, 380), 'MONITOR', font=font(72, True), fill='#ffffff', anchor='mm')
d.text((270, 560), 'cabin_monitor_pic', font=font(34), fill='#9aa0c8', anchor='mm'); M.save(os.path.join(T, 'monitor_placeholder.png'))
# ---- magazine cover "MEGA SIP": cyan, yellow label with orange-red letters
G = Image.new('RGB', (400, 520), '#54ecf3'); d = ImageDraw.Draw(G); d.rectangle((0, 0, 400, 520), outline='#93fdfa', width=18)
d.rounded_rectangle((30, 60, 370, 260), 18, fill='#f6e23a'); d.text((200, 115), 'MEGA', font=font(110, True), fill='#e8461c', anchor='mm'); d.text((200, 212), 'SIP', font=font(110, True), fill='#e8461c', anchor='mm')
for k in range(4): d.rectangle((40, 300 + k * 50, 360 - k * 40, 324 + k * 50), fill='#2aa9c0')
G.save(os.path.join(T, 'magazine_cover.png'))
# ---- navigator clipboard paper: crossword-like grid
P = Image.new('RGB', (300, 400), '#f4f2ea'); d = ImageDraw.Draw(P); r = random.Random(3)
for i in range(6):
    for j in range(8):
        x, y = 40 + i * 37, 60 + j * 37; d.rectangle((x, y, x + 37, y + 37), outline='#222222', width=3, fill='#111111' if r.random() < .22 else None)
P.save(os.path.join(T, 'clipboard_grid.png'))
# ---- galley drawer labels (tiny, 2 lines, white on colour)
for nm, col, a, b in (('drawer_mac', '#e8771f', 'MAC &', 'CHEESE'), ('drawer_beef', '#cf2a22', 'BEEF', 'FAJITA'), ('drawer_coffee', '#6d1a24', 'COFFEE', 'BLACK'), ('drawer_beans', '#2f8a3a', 'GREEN', 'BEANS')):
    D = Image.new('RGB', (240, 160), col); d = ImageDraw.Draw(D); d.text((120, 52), a, font=font(46, True), fill='#ffffff', anchor='mm'); d.text((120, 112), b, font=font(46, True), fill='#ffffff', anchor='mm'); D.save(os.path.join(T, nm + '.png'))
# ---- bag label patch (white with grey lines)
B = Image.new('RGB', (200, 130), '#f3f2f8'); d = ImageDraw.Draw(B)
for k in range(3): d.rectangle((24, 30 + k * 30, 176 - k * 30, 42 + k * 30), fill='#b9b8c4')
B.save(os.path.join(T, 'bag_label.png'))
# ---- porthole star field (sleep bay)
def stars(w, h, n, seed, bg):
    im = Image.new('RGB', (w, h), bg); d = ImageDraw.Draw(im); r = random.Random(seed)
    for _ in range(n):
        x, y, s = r.random() * w, r.random() * h, r.choice((1, 1, 1, 2, 2, 3)); v = r.randint(150, 255); d.ellipse((x - s, y - s, x + s, y + s), fill=(v, v, min(255, v + 10)))
    return im
stars(600, 900, 260, 11, '#01001b').save(os.path.join(T, 'porthole_stars.png'))
# ---- kid drawing "MY DAD": orange crayon letters, red house/tent outline, 2 stick figures, yellow sun, green grass strip
K = Image.new('RGB', (500, 400), '#f6f3e8'); d = ImageDraw.Draw(K); d.rectangle((0, 330, 500, 400), fill='#58b947'); d.ellipse((390, 30, 470, 110), fill='#f6c62d')
d.text((40, 30), 'MY DAD', font=font(64, True), fill='#f08a24'); d.line((60, 330, 150, 170, 240, 330), fill='#d62a22', width=9); d.line((60, 330, 240, 330), fill='#d62a22', width=9)
for x0 in (300, 380):
    d.ellipse((x0 - 22, 180, x0 + 22, 224), outline='#222', width=6); d.line((x0, 224, x0, 290), fill='#222', width=6); d.line((x0 - 30, 245, x0 + 30, 245), fill='#222', width=6)
    d.line((x0, 290, x0 - 22, 330), fill='#222', width=6); d.line((x0, 290, x0 + 22, 330), fill='#222', width=6)
K.save(os.path.join(T, 'kid_drawing_dad.png'))
# ---- crisp bag front: red with yellow letters
C = Image.new('RGB', (200, 260), '#e2231a'); d = ImageDraw.Draw(C); d.text((100, 90), 'MEGA', font=font(54, True), fill='#f7d21e', anchor='mm'); d.ellipse((50, 140, 150, 230), fill='#f7a21e'); C.save(os.path.join(T, 'crisp_bag.png'))
# ---- black sign plate above the bay door (unreadable at this size: two grey lines)
Z = Image.new('RGB', (400, 100), '#050508'); d = ImageDraw.Draw(Z); d.rectangle((30, 30, 300, 44), fill='#3a3a50'); d.rectangle((30, 58, 220, 70), fill='#3a3a50'); Z.save(os.path.join(T, 'sign_bay_door.png'))
print('tex ok')
