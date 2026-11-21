"""board.py: s2/BOARD.jpg, the S2 key frames with the LINE CHECK (frame number, plan row, the exact narration words of the line from voice/words.json,
the word being spoken on that frame in CAPS). S2 builder 2026-11-21. Run after render_key.sh."""
import json, os
from PIL import Image, ImageDraw, ImageFont
H = os.path.dirname(os.path.abspath(__file__))
W = json.load(open(os.path.join(H, 'voice', 'words.json')))
KEYS = [(292, 3, 'row 9: the station, the finished lemon truck, he crosses to his shop'), (344, 3, 'row 10: inside, white coat tug, helmet on the stand, truck through the window'),
        (386, 3, 'row 11: knuckle flicks the head mirror, chart behind'), (418, 4, 'row 12: the toy up to the lamp, head tilt'),
        (440, 4, 'row 12: the toy out of the cone, dulled'), (458, 4, 'row 13: eyes to the lens, half smile')]
LINES = {3: (29, 42), 4: (43, 49)}
def words(line, f):
    a, b = LINES[line]; t = f / 30.0; out = []
    for w in W[a:b + 1]: out.append(w['w'].upper() if w['s'] - .05 <= t <= w['e'] + .05 else w['w'])
    return ' '.join(out)
try: font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 17); bold = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 20)
except Exception: font = bold = ImageFont.load_default()
tw, th, lab, cols = 528, 939, 118, 3
S = Image.new('RGB', (cols * tw + (cols + 1) * 8, 2 * (th + lab) + 3 * 8 + 46), '#f4f1ea'); d = ImageDraw.Draw(S)
d.text((10, 10), 'S2 THE SECRET, BOARD (key frames, 1080x1920 kit, no captions, no polish): Why Fire Trucks Turned Yellow, lines 3-4, f288-474', font=bold, fill='#1f2a54')
for i, (f, line, what) in enumerate(KEYS):
    x, y = 8 + (i % cols) * (tw + 8), 46 + (i // cols) * (th + lab + 8)
    p = os.path.join(H, 'key', 'f_%05d.png' % f)
    im = Image.open(p).convert('RGB').resize((tw, th)) if os.path.exists(p) else Image.new('RGB', (tw, th), '#888')
    S.paste(im, (x, y)); d.rectangle([x, y + th, x + tw, y + th + lab], fill='white')
    d.text((x + 6, y + th + 4), 'f%d  %.2f s  line %d  %s' % (f, f / 30, line, what.split(':')[0]), font=bold, fill='#1f2a54')
    import textwrap
    for k, row in enumerate(textwrap.wrap('"' + words(line, f) + '"', 52)[:2]): d.text((x + 6, y + th + 30 + k * 21), row, font=font, fill='black')
    d.text((x + 6, y + th + 75), what.split(': ', 1)[1][:60], font=font, fill='#555')
S.save(os.path.join(H, 'BOARD.jpg'), quality=88); print('BOARD.jpg', S.size)
