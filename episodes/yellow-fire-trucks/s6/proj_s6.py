"""proj_s6.py: where named points land on screen (fractions, 0,0 top-left) on given frames, from the baked camera of ONE place copy.
usage: python proj_s6.py <place> <frame> [<frame> ...]   (bakes film_<place>.json into out/plan first: run only when no render is running)"""
import json, sys, os, subprocess
sys.path.insert(0, '/home/user/Ricksclip-/tools'); import film_plan as FP
H = os.path.dirname(os.path.abspath(__file__)); pl = sys.argv[1]
subprocess.run([sys.executable, '/home/user/Ricksclip-/tools/film_plan.py', 'check', os.path.join(H, 'film_%s.json' % pl)], capture_output=True, cwd=H)
cam = json.load(open(os.path.join(H, 'out/plan/camera_baked.json')))['frames']; perf = json.load(open(os.path.join(H, 'out/plan/performance_baked.json')))
F = json.load(open(os.path.join(H, 'film_%s.json' % pl)))
P = {'ball': [35.75, -10.6, .11], 'wagon': [34.5, -12.4, .2], 'kite': [37.5, -11.3, .05], 'boot': [34.9, -12.6, .1], 'can': [36.9, -13.0, .15], 'tri': [35.9, -14.2, .3]}
for f in [int(x) for x in sys.argv[2:]]:
    out = []
    for who, runs in perf.items():
        st = FP.perf_at(runs, f)
        if not st.get('visible'): continue
        p = st['pos']; h = F['cast'][who]['height']; e = FP.project(cam[f], [p[0], p[1], p[2] + h * .86]); ft = FP.project(cam[f], p)
        out.append('%s eyes %s feet %s' % (who, e and [round(x, 2) for x in e[:2]], ft and [round(x, 2) for x in ft[:2]]))
    if pl == 'park': out += ['%s %s' % (k, (lambda e: e and [round(x, 2) for x in e[:2]])(FP.project(cam[f], v))) for k, v in P.items()]
    print(f, cam[f]['state'], cam[f]['station'], [round(v, 2) for v in cam[f]['pos']], out)
