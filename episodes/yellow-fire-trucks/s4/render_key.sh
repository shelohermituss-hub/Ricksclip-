#!/usr/bin/env bash
# S4 BOARD key frames: film.json -> bake -> ONE frame per render process (CPU shared: one render process at a time), full size, no captions, --grab canvas
cd "$(dirname "$0")"; ROOT=../../..
python3 make_film.py; python3 $ROOT/tools/film_plan.py bake film.json | tail -1
for f in ${FR:-956 775 840 860 884 936}; do
  timeout 600 node $ROOT/templates/threejs_film/render_gpu.mjs film.json --frames $f --scale 1 --no-captions --grab canvas --stills-dir "$PWD/key" > logs/key_$f.log 2>&1
  echo "f$f exit $? $(grep -c -i 'error' logs/key_$f.log) error-lines"
done
echo KEY_END
