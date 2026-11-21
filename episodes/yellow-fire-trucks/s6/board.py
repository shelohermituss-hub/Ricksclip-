"""board.py: s6/BOARD.jpg, the S6 key frames (full-size kit stills in key/) with the LINE CHECK: each tile labelled with its frame, the word spoken on
that frame (voice/words.json) and the exact narration words of its plan row (landing word in CAPS). Copy of s3/board.py with S6's rows."""
import json, os
from PIL import Image, ImageDraw, ImageFont
H = os.path.dirname(os.path.abspath(__file__))
W = json.load(open(os.path.join(H, 'voice', 'words.json')))
ROWS = {1233: (36, 10, '"YOU see," (push lands: headlamp rim 89 %)'), 1236: (36, 10, '"YOU see," MATCH: entry ring 89 %'),
        1284: (38, 10, 'your eyes lose RED  (wave step 2 of 4)'), 1293: (38, 10, 'lose RED FIRST. (red off, truck grey)'),
        1303: (39, 10, '"FIRST." out through the open pupil'), 1333: (40, 11, 'A bright RED truck'), 1368: (41, 11, 'turns dark GRAY,'),
        1401: (42, 11, 'like a red BALL'), 1415: (43, 11, 'that VANISHES'), 1452: (44, 11, 'in the evening GRASS. (EXTREME)'),
        1484: (45, 12, 'But yellow GREEN?'), 1524: (46, 12, "That's the COLOR your eyes"), 1565: (48, 12, 'the LONGEST. (POWER 4)')}
def word_at(f):
    t = f / 30.0
    for w in W:
        if w['s'] <= t < w['e']: return w['w']
    return '(pause)'
try: FT = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 19); FS = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 17)
except Exception: FT = FS = ImageFont.load_default()
fs = sorted(f for f in ROWS if os.path.exists(os.path.join(H, 'key', 'f_%05d.png' % f)))
cols, tw = 5, 400; th = int(tw * 1920 / 1080); lab = 62
B = Image.new('RGB', (cols * tw + (cols + 1) * 2, ((len(fs) + cols - 1) // cols) * (th + lab + 2) + 2), '#111')
d = ImageDraw.Draw(B)
for i, f in enumerate(fs):
    x, y = 2 + (i % cols) * (tw + 2), 2 + (i // cols) * (th + lab + 2)
    B.paste(Image.open(os.path.join(H, 'key', 'f_%05d.png' % f)).convert('RGB').resize((tw, th), Image.LANCZOS), (x, y + lab))
    r, ln, words = ROWS[f]
    d.text((x + 6, y + 4), 'f%d  %.2f s  line %d, row %d' % (f, f / 30, ln, r), fill='#ffd27a', font=FT)
    d.text((x + 6, y + 32), '%s [now: "%s"]' % (words, word_at(f)), fill='white', font=FS)
B.save(os.path.join(H, 'BOARD.jpg'), quality=86); print('BOARD.jpg', B.size, len(fs), 'tiles')
