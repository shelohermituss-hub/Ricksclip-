#!/usr/bin/env bash
# ONE command: film.json, bake, single frames (SCALE default .5 = 600x450; FRAMES default all tiles), sheet + numbers. bash run.sh   |   SCALE=1 FRAMES=0,20 bash run.sh
set -e
cd "$(dirname "$0")"; ROOT=../../../..
python build.py
python $ROOT/tools/film_plan.py bake film.json | tail -1
N=$(python -c "import json;print(len(json.load(open('tiles.json'))))")
FR=${FRAMES:-$(python -c "print(','.join(str(i*2) for i in range($N)))")}
rm -rf out/.puppet_cache
node $ROOT/templates/threejs_film/render.mjs film.json --frames $FR --scale ${SCALE:-0.5} --no-captions --stills-dir stills 2>&1 | grep -v "^$" | tail -25
python sheet.py
