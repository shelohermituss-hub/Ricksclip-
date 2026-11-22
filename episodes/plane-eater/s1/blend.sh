#!/usr/bin/env bash
# the soft 8-frame blend (f200-207) from the saw close (take s1) into the row-8 wide (take s1b): renders the missing side of each frame with a
# variant film (s1 held to f207 / s1b from f200), then mixes frames/ f200-207 linearly (eased) into frames_blend/ and swaps them in. Run after render_s1.sh.
cd "$(dirname "$0")"; ROOT=../../..; K=$ROOT/templates/threejs_film/render_gpu.mjs; mkdir -p frames_a frames_b
cp film.json film_main.json
python3 -c "import json;F=json.load(open('film.json'));F['takes']=F['takes'][:1];json.dump(F,open('film.json','w'))"
python3 $ROOT/tools/film_plan.py bake film.json > /dev/null; node $K film.json --frames 204-207 --scale 0.5 --grab fast --stills-dir "$PWD/frames_a" > logs/blend_a.log 2>&1
python3 -c "import json;F=json.load(open('film_main.json'));F['takes'][1]['stations'][0]['at']=200;json.dump(F,open('film.json','w'))"
python3 $ROOT/tools/film_plan.py bake film.json > /dev/null; node $K film.json --frames 200-203 --scale 0.5 --grab fast --stills-dir "$PWD/frames_b" > logs/blend_b.log 2>&1
cp film_main.json film.json; rm film_main.json; python3 $ROOT/tools/film_plan.py bake film.json > /dev/null
python3 - <<'PY'
from PIL import Image
import os
for i, f in enumerate(range(200, 208)):
    u = (i + 1) / 9; u = u * u * (3 - 2 * u)
    A = Image.open('frames/f_%05d.png' % f if f < 204 else 'frames_a/f_%05d.png' % f).convert('RGB')
    B = Image.open('frames_b/f_%05d.png' % f if f < 204 else 'frames/f_%05d.png' % f).convert('RGB')
    os.makedirs('frames_blend', exist_ok=True); Image.blend(A, B, u).save('frames_blend/f_%05d.png' % f)
print('blend 200-207 done')
PY
cp frames_blend/*.png frames/
ffmpeg -v error -y -framerate 30 -i frames/f_%05d.png -i voice/voice.wav -t 8.567 -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k draft.mp4 && echo "mp4 ok"
python3 sheets.py; python3 keyframes.py; echo BLEND_END
