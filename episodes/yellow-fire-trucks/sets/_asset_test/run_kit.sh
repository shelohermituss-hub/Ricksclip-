#!/usr/bin/env bash
# TEST ONLY: the downloaded GLBs in the three.js kit. Per tile: bake, render frame 0 alone, then frames 0,1 (static camera):
# seconds per frame = (time 0,1) - (time 0). Full size (1200x900; portrait 1080x1920). Log out/kit.log, end marker KIT_END.
cd "$(dirname "$0")"; ROOT=../../../..
python3 build.py
for t in kit_afe_red kit_afe_half kit_alf_orig kit_gun_fist kit_afe_red_portrait; do
  python3 $ROOT/tools/film_plan.py bake film_$t.json | tail -1
  a=$(date +%s.%N); node $ROOT/templates/threejs_film/render.mjs film_$t.json --frames 0 --scale 1 --no-captions --stills-dir stills_kit/$t 2>&1 | grep -E "ASSET|still|rror"; b=$(date +%s.%N)
  node $ROOT/templates/threejs_film/render.mjs film_$t.json --frames 0,1 --scale 1 --no-captions --stills-dir stills_kit/${t}_2 2>&1 | grep -cE "^still"; c=$(date +%s.%N)
  python3 -c "a,b,c=$a,$b,$c; print('KIT_TIME $t one_frame_run %.1f s, second_frame %.1f s' % (b-a, (c-b)-(b-a)))"
done
echo KIT_END
