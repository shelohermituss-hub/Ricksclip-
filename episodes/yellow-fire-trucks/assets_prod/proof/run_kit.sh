#!/usr/bin/env bash
# PROOF ONLY: the kit tiles of props/ASSET_PACK.jpg. Per tile: bake, frame 0 alone, then frames 0,1: seconds per frame = (time 0,1) - (time 0).
cd "$(dirname "$0")/kit"; R=../../../../..
python3 build_kit.py
for t in kit_truck_half_f34 kit_gun_fist; do
  python3 $R/tools/film_plan.py bake film_$t.json | tail -1
  a=$(date +%s.%N); node $R/templates/threejs_film/render.mjs film_$t.json --frames 0 --scale 1 --no-captions --stills-dir stills/$t 2>&1 | grep -E "PHFD|still|rror"; b=$(date +%s.%N)
  node $R/templates/threejs_film/render.mjs film_$t.json --frames 0,1 --scale 1 --no-captions --stills-dir stills/${t}_2 2>&1 | grep -cE "^still"; c=$(date +%s.%N)
  python3 -c "a,b,c=$a,$b,$c; print('KIT_TIME $t one_frame_run %.1f s, second_frame %.1f s' % (b-a, (c-b)-(b-a)))"
done
echo KIT_END
