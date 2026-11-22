"""blend.py: frames/ from the six passes with eased DISSOLVES (fix round 1: soft blends between beats instead of fast camera moves):
A clinic 638-672 | B1 wide time-lapse 660-712 | B2 Michel close 705-745 | B3 trolley + tower 738-847 | B4 catch + cloche 840-891 | B5 certificate 884-942.
Dissolves: A->B1 662-672, B1->B2 705-712, B2->B3 738-745, B3->B4 840-847, B4->B5 884-891."""
import os, shutil
from PIL import Image
H = os.path.dirname(os.path.abspath(__file__)); P = lambda k, f: os.path.join(H, 'passes', k, 'f_%05d.png' % f); O = lambda f: os.path.join(H, 'frames', 'f_%05d.png' % f)
ease = lambda u: u * u * (3 - 2 * u)
SEQ = [('A', 638), ('B1', 662), ('B2', 705), ('B3', 738), ('B4', 840), ('B5', 884)]   # pass, frame its dissolve-in starts
DIS = {'B1': 11, 'B2': 8, 'B3': 8, 'B4': 8, 'B5': 8}
os.makedirs(os.path.join(H, 'frames'), exist_ok=True)
for f in range(638, 943):
    cur = [k for k, a in SEQ if a <= f][-1]; i = [k for k, _ in SEQ].index(cur); a = SEQ[i][1]
    if i and f < a + DIS[cur]:
        prev = SEQ[i - 1][0]; Image.blend(Image.open(P(prev, f)).convert('RGB'), Image.open(P(cur, f)).convert('RGB'), ease((f - a + 1) / (DIS[cur] + 1))).save(O(f))
    else: shutil.copy(P(cur, f), O(f))
print('blend: frames 638-942 composed from', len(SEQ), 'passes')
