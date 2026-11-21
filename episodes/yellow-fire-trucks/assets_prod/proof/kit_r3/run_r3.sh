#!/usr/bin/env bash
# PROOF ONLY: the four round-3 kit tiles, one frame each, sequential (one render process at a time).
cd "$(dirname "$0")"; R=../../../../..
for t in hero rear light lawn; do
  python3 $R/tools/film_plan.py bake film_r3_$t.json | tail -1
  a=$(date +%s.%N); node $R/templates/threejs_film/render.mjs film_r3_$t.json --frames 0 --scale 1 --no-captions --stills-dir stills/$t 2>&1 | grep -E "PHFD|still|rror"; b=$(date +%s.%N)
  python3 -c "print('KIT_TIME $t %.1f s (one run, load included)' % ($b - $a))"
done
echo KIT_R3_END
