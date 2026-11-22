"""blend.py: composes frames/ from the three passes with two eased DISSOLVES ON THE MOVE: 568-577 A (push into the film) -> B (X-ray world),
628-637 B -> C (back out to the Doctor's double take). The camera keeps moving in both passes, so it reads as a fly-through, not a cut."""
import os, shutil
from PIL import Image
H = os.path.dirname(os.path.abspath(__file__)); P = lambda k, f: os.path.join(H, 'passes', k, 'f_%05d.png' % f); O = lambda f: os.path.join(H, 'frames', 'f_%05d.png' % f)
ease = lambda u: u * u * (3 - 2 * u)
for f in range(519, 639):
    if f < 568: shutil.copy(P('A', f), O(f))
    elif f <= 577: Image.blend(Image.open(P('A', f)).convert('RGB'), Image.open(P('B', f)).convert('RGB'), ease((f - 567) / 11)).save(O(f))
    elif f < 628: shutil.copy(P('B', f), O(f))
    elif f <= 637: Image.blend(Image.open(P('B', f)).convert('RGB'), Image.open(P('C', f)).convert('RGB'), ease((f - 627) / 11)).save(O(f))
    else: shutil.copy(P('C', f), O(f))
print('blend: frames 519-638 composed (dissolves 568-577, 628-637)')
