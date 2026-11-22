#!/usr/bin/env bash
# GUARD for the kit fix 2026-11-22 (held3d on a seated camsafe legs3d card; templates/threejs_film film.js h3Frame + puppets.mjs camsafeView):
# film_heldtest.json = S2 Michel seated, front-ish camera, oil glass in "R", tumbler in "L", f300 (the move raises its authored near hand R to his nose).
# PASS when (1) the R prop is CLOSER to the lens than the card's seat point (in front of the drawn body, not hidden behind it) and (2) R is the RAISED fist.
cd "$(dirname "$0")"; ROOT=../../..
python $ROOT/tools/film_plan.py check film_heldtest.json > /dev/null 2>&1
node $ROOT/templates/threejs_film/render_gpu.mjs film_heldtest.json --held 300 --held-out out/held_guard.json > logs/held_guard.log 2>&1
python3 - <<'P'
import json, math
rows = {r['obj']: r for r in json.load(open('out/held_guard.json'))}
cam = json.load(open('out/plan/camera_baked.json'))['frames'][300]['pos']; film = json.load(open('film_heldtest.json'))
pos = [a for a in film['acts'] if a['who'] == 'michel' and a.get('pos')][-1]['pos']; seat = [pos[0], pos[1], 0.485]
R, L = rows['oil_glass'], rows['tumbler']; d = lambda p: math.dist(p, cam)
ok1 = d(R['grip']) < d(seat); ok2 = R['fists'][0]['px'][1] < L['fists'][0]['px'][1]
print('held3d seated guard: R prop in front of the card', 'PASS' if ok1 else 'FAIL', round(d(R['grip']), 3), '<', round(d(seat), 3),
      '| R is the raised fist', 'PASS' if ok2 else 'FAIL', R['fists'][0]['px'], L['fists'][0]['px'])
raise SystemExit(0 if ok1 and ok2 else 1)
P
