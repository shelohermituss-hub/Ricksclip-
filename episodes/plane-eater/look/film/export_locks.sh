#!/usr/bin/env bash
# export_locks.sh <s1 s2 ...>: kit lock (cameras, cards per frame, moving nodes, set glb) + held 3D props on EVERY frame (grip/tip, plan metres)
# for each stretch, from the approved film.json. One node process at a time.
R="$(cd "$(dirname "$0")/../../../.." && pwd)"; EP="$R/episodes/plane-eater"
for s in "$@"; do
  F="$EP/$s/film.json"; N=$(python3 -c "import json;print(json.load(open('$EP/$s/out/plan/camera_baked.json'))['frames'][-1]['f'])" 2>/dev/null)
  [ -d "$EP/$s/out/lock" ] && [ "${FORCE:-0}" != 1 ] || node "$R/templates/threejs_film/render.mjs" "$F" --export-lock
  N=$(python3 -c "import json;fr=json.load(open('$EP/$s/out/plan/camera_baked.json'))['frames'];print(','.join(str(c['f']) for c in fr))")
  node "$R/templates/threejs_film/render.mjs" "$F" --held "$N" --held-out "$EP/$s/out/lock/held_all.json"
  echo "EXPORT_DONE $s"
done
