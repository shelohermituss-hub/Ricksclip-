"""board.py: <stretch>/BOARD.jpg, the key frames with the LINE CHECK (frame number, line, the exact narration words of the line from voice/words.json,
the word being spoken on that frame in CAPS; "(between words)" when none is). S5/S7 builder 2026-11-21 (pattern s2/board.py). Same file in s5/ and s7/."""
import json, os, sys, textwrap
from PIL import Image, ImageDraw, ImageFont
H = os.path.dirname(os.path.abspath(__file__)); NAME = os.path.basename(H)
W = json.load(open(os.path.join(H, 'voice', 'words.json')))
CFG = {
 's5': ('S5 THE COUNT, BOARD (real key frames, 1080x1920 kit, no captions, no polish): lines 8-9, f969-1202, Dallas noon', {8: (92, 106), 9: (107, 117)}, [
   (984, 8, 'row 28 "Dallas": the station front, both trucks in the bays, the Clerk at the boards'),
   (1040, 8, 'rows 30-31 "side by side / four": nose level, YEAR leaves drop, plasters pop'),
   (1086, 8, 'row 32 "counted": the tick on the red board, plastered red fender behind'),
   (1150, 9, 'row 33 "hit": board 2 nailed on, the ladder up, stool'),
   (1168, 9, 'row 34 "three/times": UP TO 3x at the top of board 3'),
   (1200, 9, 'row 35 "often" + join: down onto the red truck headlamp')]),
 's7': ('S7 THE FALSE WIN, BOARD (real key frames, 1080x1920 kit, no captions, no polish): line 13, f1576-1754, Dallas noon', {13: (160, 175)}, [
   (1600, 13, 'row 49 "Dallas?": pull back from the lemon door; thin painter shrugs at REPAINT: RED'),
   (1640, 13, 'row 50 "back to red": red sweeps over the lime from the nose'),
   (1655, 13, 'row 50 "anyway": the fat painter pats the last yellow patch'),
   (1690, 13, 'row 51 "firetruck": the Chief (VISITOR) plants himself at the wet red door'),
   (1712, 13, 'row 52 "has": eyes-shut salute, rocks back on his heels'),
   (1742, 13, 'row 53 STILLNESS 1730-1754: frozen tableau, the false win')]),
}
TITLE, LINES, KEYS = CFG[NAME]
def words(line, f):
    a, b = LINES[line]; t = f / 30.0; out = []; hit = False
    for w in W[a:b + 1]:
        on = w['s'] - .02 <= t <= w['e'] + .02; hit |= on; out.append(w['w'].upper() if on else w['w'])
    return ' '.join(out) + ('' if hit else '   (between words)')
try: font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 17); bold = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 19)
except Exception: font = bold = ImageFont.load_default()
tw, th, lab, cols = 528, 939, 118, 3
rows = (len(KEYS) + cols - 1) // cols
S = Image.new('RGB', (cols * tw + (cols + 1) * 8, rows * (th + lab) + (rows + 1) * 8 + 46), '#f4f1ea'); d = ImageDraw.Draw(S)
d.text((10, 10), 'Why Fire Trucks Turned Yellow  ' + TITLE, font=bold, fill='#1f2a54')
for i, (f, line, what) in enumerate(KEYS):
    x, y = 8 + (i % cols) * (tw + 8), 46 + (i // cols) * (th + lab + 8)
    p = os.path.join(H, 'key', 'f_%05d.png' % f)
    im = Image.open(p).convert('RGB').resize((tw, th)) if os.path.exists(p) else Image.new('RGB', (tw, th), '#888')
    S.paste(im, (x, y)); d.rectangle([x, y + th, x + tw, y + th + lab], fill='white')
    d.text((x + 6, y + th + 4), 'f%d  %.2f s  line %d' % (f, f / 30, line) + ('' if os.path.exists(p) else '  NOT RENDERED'), font=bold, fill='#1f2a54')
    for k, row in enumerate(textwrap.wrap('"' + words(line, f) + '"', 54)[:2]): d.text((x + 6, y + th + 28 + k * 20), row, font=font, fill='black')
    for k, row in enumerate(textwrap.wrap(what, 58)[:2]): d.text((x + 6, y + th + 72 + k * 20), row, font=font, fill='#555')
S.save(os.path.join(H, 'BOARD.jpg'), quality=86); print('BOARD.jpg', S.size)
