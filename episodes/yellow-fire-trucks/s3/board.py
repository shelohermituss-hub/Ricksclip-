"""board.py: s3/BOARD.jpg, the S3 key frames (full-size kit stills in key/) with the LINE CHECK: each tile labelled with its frame, the word spoken on
that frame (voice/words.json) and the exact narration words of its plan row (landing word in CAPS). About 1600 px wide."""
import json, os
from PIL import Image, ImageDraw, ImageFont
H = os.path.dirname(os.path.abspath(__file__))
W = json.load(open(os.path.join(H, 'voice', 'words.json')))
ROWS = {511: (14, 5, 'Every evening at DUSK,'), 530: (15, 5, 'RED firetrucks kept getting'), 569: (16, 5, 'HIT at crossings,  (POWER 2)'),
        584: (16, 5, 'hit at CROSSINGS,'), 613: (17, 5, 'sirens SCREAMING,'), 643: (18, 5, 'lights FLASHING.'),
        694: (19, 6, 'The drivers all SAID the same thing,'), 734: (20, 6, '"I NEVER saw it."'), 758: (21, 6, '"saw IT."')}
def word_at(f):
    t = f / 30.0
    for w in W:
        if w['s'] <= t < w['e']: return w['w']
    return '(pause)'
try: FT = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 19); FS = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 17)
except Exception: FT = FS = ImageFont.load_default()
fs = sorted(f for f in ROWS if os.path.exists(os.path.join(H, 'key', 'f_%05d.png' % f)))
cols, tw = 3, 532; th = int(tw * 1920 / 1080); lab = 62
B = Image.new('RGB', (cols * tw + (cols + 1) * 2, ((len(fs) + cols - 1) // cols) * (th + lab + 2) + 2), '#111')
d = ImageDraw.Draw(B)
for i, f in enumerate(fs):
    x, y = 2 + (i % cols) * (tw + 2), 2 + (i // cols) * (th + lab + 2)
    B.paste(Image.open(os.path.join(H, 'key', 'f_%05d.png' % f)).convert('RGB').resize((tw, th), Image.LANCZOS), (x, y + lab))
    r, ln, words = ROWS[f]
    d.text((x + 6, y + 4), 'f%d  %.2f s   line %d, row %d' % (f, f / 30, ln, r), fill='#ffd27a', font=FT)
    d.text((x + 6, y + 32), '%s   [now: "%s"]' % (words, word_at(f)), fill='white', font=FS)
B.save(os.path.join(H, 'BOARD.jpg'), quality=86); print('BOARD.jpg', B.size, len(fs), 'tiles')
