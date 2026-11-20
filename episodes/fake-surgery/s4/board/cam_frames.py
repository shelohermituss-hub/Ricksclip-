# S4 v2 r2: plan screen speed per frame (film_plan instrument) for a window, to compare with the measured preview. python board/cam_frames.py [film.json] [f0] [f1] [step]
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', '..', '..', 'tools'))
import film_plan as FP
p = sys.argv[1] if len(sys.argv) > 1 else 'film.json'; a = int(sys.argv[2]) if len(sys.argv) > 2 else 1278; b = int(sys.argv[3]) if len(sys.argv) > 3 else 1695
F = FP.load(p); cam, _ = FP.bake_camera(F); sp = FP.screen_speed(cam)
row = ['%d:%.0f%s' % (i, sp[i], 'C' if cam[i]['cut'] else '') for i in range(a, min(b + 1, len(cam)))]
for j in range(0, len(row), 12): print(' '.join(row[j:j + 12]))
