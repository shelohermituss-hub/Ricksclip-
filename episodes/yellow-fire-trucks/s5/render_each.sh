#!/usr/bin/env bash
# BOARD key frames: ONE frame per render process (CPU shared by ~5 helpers), --grab canvas; log logs/key.log, end EACH_END
cd "$(dirname "$0")"; ROOT=../../..
for f in ${FR}; do timeout 900 node $ROOT/templates/threejs_film/render_gpu.mjs film.json --frames $f --scale 1 --no-captions --grab canvas --stills-dir "$PWD/key" > logs/key_$f.log 2>&1; echo "f$f exit $?" >> logs/key.log; done; echo EACH_END >> logs/key.log
