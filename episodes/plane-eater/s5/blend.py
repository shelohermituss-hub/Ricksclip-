"""blend.py: frames/ 943-1021 from pass A (the cabin, 943-1012) and pass W (the close window shot, 1005-1021) with an eased DISSOLVE ON THE MOVE 1005-1012."""
import os, shutil
from PIL import Image
H = os.path.dirname(os.path.abspath(__file__)); P = lambda k, f: os.path.join(H, 'passes', k, 'f_%05d.png' % f); O = lambda f: os.path.join(H, 'frames', 'f_%05d.png' % f)
ease = lambda u: u * u * (3 - 2 * u)
for f in range(943, 1022):
    if f < 1005: shutil.copy(P('A', f), O(f))
    elif f <= 1012: Image.blend(Image.open(P('A', f)).convert('RGB'), Image.open(P('W', f)).convert('RGB'), ease((f - 1004) / 9)).save(O(f))
    else: shutil.copy(P('W', f), O(f))
print('blend: 943-1021 (dissolve 1005-1012)')
