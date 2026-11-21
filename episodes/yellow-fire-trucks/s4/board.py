"""board.py: s4/BOARD.jpg, the S4 key frames with the LINE CHECK (frame, plan row, the exact narration words of line 7 from voice/words.json, the word
spoken on that frame in CAPS). S4 builder 2026-11-21 (from s2/board.py). Run after render_key.sh."""
import json, os, textwrap
from PIL import Image, ImageDraw, ImageFont
H = os.path.dirname(os.path.abspath(__file__))
W = json.load(open(os.path.join(H, 'voice', 'words.json')))
KEYS = [(775, 'row 22: the printed plan of PINE HOLLOW and the home station (S3 town cross-fades in here)'),
        (840, 'row 23: the rise over the Midwest, the door wave rolls west to east, red noses in the bays'),
        (860, 'row 24: the Painters at ST. LOUIS, the gun sweeps the red nose, lime mist'),
        (884, 'row 25: every nose lime, the sweep runs on through the country'),
        (936, 'row 26: home door up on the lime truck; Sceptic turns away, fist over his eyes'),
        (956, 'row 27: the Rookie peeks over his sunk fist; Old-Timer pulls his helmet down')]
A, B = 76, 91
def words(f):
    t = f / 30.0
    return ' '.join(w['w'].upper() if w['s'] - .05 <= t <= w['e'] + .05 else w['w'] for w in W[A:B + 1])
font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 15); bold = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 17)
cols, tw = 3, 520; th = int(tw * 16 / 9); lab = 112
S = Image.new('RGB', (cols * tw + (cols + 1) * 8, 2 * (th + lab) + 3 * 8 + 44), '#f4f1ea'); d = ImageDraw.Draw(S)
d.text((10, 10), 'S4 THE IDEA SPREADS, BOARD (1080x1920 kit key frames, no captions, no polish, NOT a moving clip): line 7, f770-969. No Rick frames in the repo.', font=bold, fill='#1f2a54')
for i, (f, what) in enumerate(KEYS):
    x, y = 8 + (i % cols) * (tw + 8), 44 + (i // cols) * (th + lab + 8)
    p = os.path.join(H, 'key', 'f_%05d.png' % f)
    im = Image.open(p).convert('RGB').resize((tw, th)) if os.path.exists(p) else Image.new('RGB', (tw, th), '#888')
    S.paste(im, (x, y)); d.rectangle([x, y + th, x + tw, y + th + lab], fill='white')
    d.text((x + 6, y + th + 4), 'f%d  %.2f s  line 7  %s' % (f, f / 30, what.split(':')[0]), font=bold, fill='#1f2a54')
    for k, row in enumerate(textwrap.wrap('"' + words(f) + '"', 60)[:2]): d.text((x + 6, y + th + 28 + k * 19), row, font=font, fill='black')
    for k, row in enumerate(textwrap.wrap(what.split(': ', 1)[1], 64)[:2]): d.text((x + 6, y + th + 68 + k * 19), row, font=font, fill='#555')
S.save(os.path.join(H, 'BOARD.jpg'), quality=88); print('BOARD.jpg', S.size)
