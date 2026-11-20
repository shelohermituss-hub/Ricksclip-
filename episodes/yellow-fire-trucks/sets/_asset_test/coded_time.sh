#!/usr/bin/env bash
# TEST ONLY: seconds per frame of the CODED truck (sets/_hero_test film, unchanged) at 1200x900: run frame 0, then 0,1; difference = one frame. Writes coded_time.json. Stills go to scratch-like stills_coded/ here.
cd "$(dirname "$0")"; ROOT=../../../..; F=../_hero_test/film.json
a=$(date +%s.%N); node $ROOT/templates/threejs_film/render.mjs $F --frames 0 --scale 1 --no-captions --stills-dir stills_coded/a 2>&1 | grep -c "^still"; b=$(date +%s.%N)
node $ROOT/templates/threejs_film/render.mjs $F --frames 0,1 --scale 1 --no-captions --stills-dir stills_coded/b 2>&1 | grep -c "^still"; c=$(date +%s.%N)
python3 -c "import json; a,b,c=$a,$b,$c; s=round((c-b)-(b-a),1); print('CODED one_frame_run %.1f s, second_frame %.1f s @1200x900' % (b-a, s)); json.dump(dict(red=str(s)+' @1200x900*', half=str(s)+' @1200x900*', gun=str(s)+' @1200x900*', one_run=round(b-a,1)), open('coded_time.json','w'))"
echo CODED_END
