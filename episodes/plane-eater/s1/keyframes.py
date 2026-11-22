"""keyframes.py: KEYFRAMES.jpg, 3 key frames per script line of S1 from frames/ (half-size draft, captions burned in)."""
import os
from PIL import Image, ImageDraw
H = os.path.dirname(os.path.abspath(__file__))
K = [(0, 'L1 row 1 FRAME 0 "In 1978": salts the wing tip'), (82, 'L1 row 3 "airplane": the whole Cessna'), (138, 'L1 row 5 "Lunch!": grin to the lens'),
     (178, 'L2 rows 6-7 "cut": the saw, MONSIEUR MANGETOUT'), (205, 'L2 row 8 "whole Cessna": the cut, the owner'), (245, 'L2 row 9 "bites": the plate')]
w = 360; ims = [Image.open(os.path.join(H, 'frames/f_%05d.png' % f)).convert('RGB') for f, _ in K]; h = int(ims[0].height * w / ims[0].width)
S = Image.new('RGB', (w * 3, (h + 30) * 2), 'white'); D = ImageDraw.Draw(S)
for i, ((f, t), im) in enumerate(zip(K, ims)): x, y = (i % 3) * w, (i // 3) * (h + 30); S.paste(im.resize((w, h)), (x, y + 30)); D.text((x + 4, y + 2), 'f%d %.2fs' % (f, f / 30), fill='black'); D.text((x + 4, y + 15), t, fill='black')
S.save(os.path.join(H, 'KEYFRAMES.jpg'), quality=88); print('KEYFRAMES.jpg', S.size)
