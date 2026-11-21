#!/usr/bin/env bash
# PROOF ONLY: the three.js kit stills of the Dallas detail gate (proof/kit/stills/<cam>/f_00000.png) + seconds per frame (frames 0,1 minus frame 0 alone).
# One render process at a time (shared CPU). Ends KIT_END.
cd "$(dirname "$0")/../proof/kit"; R=../../../../../..
W=${W:-540}; H=${H:-960}
names=$(python3 ../../scripts/kit_films.py $W $H)
for t in ${ONLY:-$names}; do
  python3 $R/tools/film_plan.py bake film_$t.json | tail -1
  a=$(date +%s.%N); node $R/templates/threejs_film/render.mjs film_$t.json --frames 0 --scale 1 --no-captions --stills-dir stills/$t 2>&1 | grep -E "PHFD|rror" | head -5; b=$(date +%s.%N)
  node $R/templates/threejs_film/render.mjs film_$t.json --frames 0,1 --scale 1 --no-captions --stills-dir stills/${t}_2 > /dev/null 2>&1; c=$(date +%s.%N)
  python3 -c "a,b,c=$a,$b,$c; print('KIT_TIME $t one_frame_run %.1f s, second_frame %.1f s' % (b-a, (c-b)-(b-a)))"
done
echo KIT_END
