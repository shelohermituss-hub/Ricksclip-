#!/usr/bin/env bash
# S2 BOARD key frames (one background command): film.json -> bake -> 6 key frames full size, no captions -> log logs/key.log, end KEY_END
cd "$(dirname "$0")"; ROOT=../../..
python make_film.py; python $ROOT/tools/film_plan.py bake film.json | tail -1
timeout 1500 node $ROOT/templates/threejs_film/render_gpu.mjs film.json --frames ${FR:-292,344,386,418,440,458} --scale 1 --no-captions --grab canvas --stills-dir "$PWD/key" > logs/key.log 2>&1
echo KEY_END >> logs/key.log
