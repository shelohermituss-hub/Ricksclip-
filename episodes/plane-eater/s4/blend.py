"""blend.py: frames/ from the two passes: A (clinic, row 23) 638-661, DISSOLVE ON THE MOVE A -> B 662-672 (row 24 "It TOOK him", the camera keeps
backing out of the clinic while the apron flies in), B (apron) 673-942."""
import os, shutil
from PIL import Image
H = os.path.dirname(os.path.abspath(__file__)); P = lambda k, f: os.path.join(H, 'passes', k, 'f_%05d.png' % f); O = lambda f: os.path.join(H, 'frames', 'f_%05d.png' % f)
ease = lambda u: u * u * (3 - 2 * u)
os.makedirs(os.path.join(H, 'frames'), exist_ok=True)
for f in range(638, 943):
    if f < 662: shutil.copy(P('A', f), O(f))
    elif f <= 672: Image.blend(Image.open(P('A', f)).convert('RGB'), Image.open(P('B', f)).convert('RGB'), ease((f - 661) / 12)).save(O(f))
    else: shutil.copy(P('B', f), O(f))
print('blend: frames 638-942 composed (dissolve 662-672)')
