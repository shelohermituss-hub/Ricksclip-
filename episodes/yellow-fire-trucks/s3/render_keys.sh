#!/usr/bin/env bash
# S3 board key frames (fix round, HALF SIZE): ONE render process, the kit's own --grab fast + --grab-timeout + one retry per frame.
# usage: bash render_keys.sh <out dir> <frame,frame,...>   log: logs/keys.log, end line KEYS_END
cd "$(dirname "$0")"; mkdir -p "$1"
node ../../../templates/threejs_film/render_gpu.mjs film.json --frames "$2" --scale 0.5 --grab fast --grab-timeout 120 --no-captions --stills-dir "$PWD/$1" > logs/keys.log 2>&1
echo KEYS_END >> logs/keys.log
