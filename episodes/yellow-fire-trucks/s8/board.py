"""board.py: s8/BOARD.jpg from key/f_*.png: each key frame labelled with its frame number and the exact narration words on it (the LINE CHECK)."""
import json, os
from PIL import Image, ImageDraw, ImageFont
H = os.path.dirname(os.path.abspath(__file__)); W = json.load(open(os.path.join(H, 'voice/words.json')))
ROWS = {1762: 'row 54 red door panel', 1776: 'row 54 drained grey', 1808: 'row 55 the march (wide)', 1826: 'row 56 fist out (wide, not POV)', 1846: 'row 57 POV (via a CUT)', 1890: 'row 58 LAST FRAME'}
def words(f, span=8):
    t = f / 30; on = [w['w'] for w in W if w['s'] - span / 30 <= t <= w['e'] + span / 30]; return ' '.join(on) or '(silence)'
fs = [f for f in sorted(ROWS) if os.path.exists(os.path.join(H, 'key/f_%05d.png' % f))]
tw, th, cols = 400, 711, 4; rows = (len(fs) + cols - 1) // cols; S = Image.new('RGB', (tw * cols, (th + 56) * rows), 'white'); d = ImageDraw.Draw(S)
try: fn = ImageFont.truetype('DejaVuSans.ttf', 15)
except Exception: fn = ImageFont.load_default()
for i, f in enumerate(fs):
    x, y = (i % cols) * tw, (i // cols) * (th + 56); S.paste(Image.open(os.path.join(H, 'key/f_%05d.png' % f)).convert('RGB').resize((tw, th)), (x, y + 56))
    d.text((x + 4, y + 2), 'f%d  %.2fs  %s' % (f, f / 30, ROWS[f]), fill='black', font=fn); d.text((x + 4, y + 22), '"%s"' % words(f), fill=(150, 20, 20), font=fn)
S.save(os.path.join(H, 'BOARD.jpg'), quality=86); print('BOARD.jpg', S.size, len(fs), 'frames')
