# S4 v2: the film_plan.py camera gates measured on the stretch window only (film 1290-1683), so the static 0-1277 lead-in does not skew them.
# Run from s4/: python board/cam_window.py [film.json] [f0] [f1]   (prints the camera lines + the fastest frames)
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', '..', '..', 'tools'))
import film_plan as FP
path = sys.argv[1] if len(sys.argv) > 1 else 'film.json'; A = int(sys.argv[2]) if len(sys.argv) > 2 else 1290; B = int(sys.argv[3]) if len(sys.argv) > 3 else 1683
F = FP.load(path); cam, _ = FP.bake_camera(F); sp = FP.screen_speed(cam)
idx = list(range(A, min(B + 1, len(cam)))); fps = F['fps']; dur = len(idx) / fps
live = [i for i in idx if not cam[i]['cut']]; settled = {i: sp[i] < FP.SETTLED for i in idx}
def runs(pred):
    out, cur = [], None
    for i in idx:
        if pred(i) and not (cam[i]['cut'] and cur): cur = cur or [i, 0]; cur[1] += 1
        else:
            if cur: out.append(tuple(cur))
            cur = [i, 1] if pred(i) else None
    if cur: out.append(tuple(cur))
    return out
holds = [r for r in runs(lambda i: settled[i]) if r[1] >= 6]; travels = runs(lambda i: not settled[i])
v = sorted(sp[i] for i in live); pc = lambda q: v[min(len(v) - 1, int(q / 100.0 * len(v)))]
tl = sorted(l / fps for a, l in travels if l >= 3)
print('window %d-%d (%.1f s), cuts %d (%s)' % (A, B, dur, sum(cam[i]['cut'] for i in idx), [i for i in idx if cam[i]['cut']]))
print('  rests per 10 s      %.2f   (target 2.2-3.8, aim 3)  rests: %s' % (10 * len(holds) / dur, ['%d+%d' % h for h in holds]))
print('  rest median s       %.2f   (>= 0.8 brief)' % (sorted(l / fps for a, l in holds)[len(holds) // 2] if holds else 0))
print('  at rest %%           %.1f' % (100.0 * sum(settled[i] for i in live) / len(live)))
print('  travels s           %s  p90 %.2f (>= 2.1)  longest %.2f' % (['%.1f' % t for t in tl], tl[int(.9 * (len(tl) - 1))] if tl else 0, max(tl) if tl else 0))
print('  speed median px/f   %.2f   (about 4)   p90 %.1f   peak %.1f (<= 40, 60 power)' % (pc(50), pc(90), max(v)))
print('  dead still %%        %.1f   (<= 21)' % (100.0 * sum(1 for i in live if sp[i] < .7) / len(live)))
print('  fastest frames      %s' % sorted(((round(sp[i], 1), i) for i in live), reverse=True)[:8])
