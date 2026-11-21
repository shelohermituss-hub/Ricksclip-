"""check_shifted.py: runs film_plan.py check on a COPY of s3/film.json shifted so frame 474 = 0 (words shifted by 15.80 s too).
Why: film_plan's film-wide gates (first face, faces in the first 5/15 s, rests per 10 s, effects and moods per minute, longest stretch without a face)
count from frame 0, and S3 has nothing before 474 (it uses the episode's absolute frames). The shifted copy measures the stretch alone.
The copy lives in s3/out/check_shift/ (film.json + words.json); the real film.json is untouched. Usage: python check_shifted.py"""
import json, os, subprocess, sys
H = os.path.dirname(os.path.abspath(__file__)); OFF = 474; S = OFF / 30.0
F = json.load(open(os.path.join(H, 'film.json')))
W = json.load(open(os.path.join(H, 'voice', 'words.json')))
d = os.path.join(H, 'out', 'check_shift'); os.makedirs(d, exist_ok=True)
w0 = next(i for i, w in enumerate(W) if w['s'] >= S - 1e-6)
W2 = [dict(w, s=round(w['s'] - S, 3), e=round(w['e'] - S, 3)) for w in W[w0:] if w['s'] < (F['end'] / 30.0)]
json.dump(W2, open(os.path.join(d, 'words.json'), 'w'))
sh = lambda x: x - OFF if isinstance(x, (int, float)) else x
for a in F['acts']:
    a['at'] = sh(a['at'])
    if 'say' in a: a['say'] = [i - w0 for i in a['say']]
for k in ('kicks', 'fx', 'moods'):
    for e in F.get(k, []): e['at'] = sh(e['at'])
for tk in F['takes']:
    for s in tk['stations']: s['at'] = sh(s['at'])
F['words'] = 'words.json'; F['end'] = F['end'] - OFF; F.pop('start', None); F['puppet_pkg'] = [os.path.join(H, p) for p in F['puppet_pkg']]
json.dump(F, open(os.path.join(d, 'film.json'), 'w'), indent=1)
r = subprocess.run([sys.executable, os.path.join(H, '../../../tools/film_plan.py'), 'check', os.path.join(d, 'film.json'), '--window', '0-%d' % (F['end'] - 1)], capture_output=True, text=True)
open(os.path.join(H, 'plan_check_shifted.txt'), 'w').write(r.stdout + r.stderr)
print('\n'.join(l for l in r.stdout.splitlines() if ' FAIL ' in l or ' WARN ' in l or 'RESULT' in l))
