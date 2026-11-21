"""plan_window.py: the whole-stretch film_plan gates on the S6 WINDOW only (frames 1202-1576). S6 builder (copy of s2/plan_window.py) 2026-11-21.
Why: film_plan.py check counts every gate from frame 0, so a stretch that starts at f288 carries 288 parked lead-in frames with no cast (first face,
face share, speed median... FAIL for that reason alone; fake-surgery s4 STATE.md notes the same). This writes _win/film.json: the same film with every
frame number and the words shifted by -288, runs the check there and also the real file with --window. film.json (the render file) is not touched."""
import json, os, subprocess, sys
H = os.path.dirname(os.path.abspath(__file__)); OFF = 1202
F = json.load(open(os.path.join(H, 'film.json'))); W = json.load(open(os.path.join(H, 'voice', 'words.json')))
os.makedirs(os.path.join(H, '_win', 'voice'), exist_ok=True)
json.dump([dict(w, s=round(w['s'] - OFF / 30, 3), e=round(w['e'] - OFF / 30, 3)) for w in W if w['s'] >= OFF / 30 - .01], open(os.path.join(H, '_win', 'voice', 'words.json'), 'w'))
sh = lambda x: x - OFF if isinstance(x, (int, float)) else x
F['start'], F['end'] = 0, F['end'] - OFF
for a in F['acts']: a['at'] = sh(a['at'])
for h in F.get('held3d', []):
    for k in ('f0', 'f1'):
        if k in h: h[k] = sh(h[k])
for k in ('fx', 'moods', 'kicks'):
    for x in F.get(k, []): x['at'] = sh(x['at'])
for t in F['takes']:
    for s in t['stations']: s['at'] = sh(s['at'])
for k in ('puppet_pkg',): F[k] = ['../' + p if not p.startswith('/') else p for p in F[k]]
json.dump(F, open(os.path.join(H, '_win', 'film.json'), 'w'), indent=1)
FP = os.path.join(H, '..', '..', '..', 'tools', 'film_plan.py')
r = subprocess.run([sys.executable, FP, 'check', os.path.join(H, '_win', 'film.json')], capture_output=True, text=True)
open(os.path.join(H, 'plan_check_window.txt'), 'w').write(r.stdout + r.stderr)
print('\n'.join(l for l in (r.stdout + r.stderr).splitlines() if 'FAIL' in l or 'RESULT' in l))
