"""sheets.py <stretch dir> <f0> <f1> <key frames comma list>: strip_4fps.jpg (every 8th frame) and KEYFRAMES.jpg (the key frames, half size) from frames/."""
import sys, os
from PIL import Image, ImageDraw
H, f0, f1, keys = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), [int(x) for x in sys.argv[4].split(',')]
fr = lambda f: Image.open(os.path.join(H, 'frames/f_%05d.png' % f)).convert('RGB')
fs = list(range(f0, f1 + 1, 8)); w, h, cols = 135, 240, 10; S = Image.new('RGB', (w * cols, (h + 14) * ((len(fs) + cols - 1) // cols)), 'white'); d = ImageDraw.Draw(S)
for i, f in enumerate(fs): x, y = (i % cols) * w, (i // cols) * (h + 14); S.paste(fr(f).resize((w, h)), (x, y + 14)); d.text((x + 3, y + 1), 'f%d %.2fs' % (f, f / 30), fill='black')
S.save(os.path.join(H, 'strip_4fps.jpg'), quality=85)
w, h = 270, 480; K = Image.new('RGB', (w * len(keys), h + 16), 'white'); d = ImageDraw.Draw(K)
for i, f in enumerate(keys): K.paste(fr(f).resize((w, h)), (i * w, 16)); d.text((i * w + 4, 2), 'f%d  %.2f s' % (f, f / 30), fill='black')
K.save(os.path.join(H, 'KEYFRAMES.jpg'), quality=88); print('sheets:', len(fs), 'strip frames,', len(keys), 'key frames')
