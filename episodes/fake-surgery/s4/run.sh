#!/usr/bin/env bash
# S4 board, ONE command: film.json, bake, motion gate, GPU stills (shared fair queue), sheets + numbers, frame checks. Run from this folder: bash run.sh [scale]
set -e
SCALE="${1:-1}"
python build_film.py
python ../../../tools/film_plan.py bake film.json | tail -1
node moves/tools/check_motion_ep.mjs > board/motion_gate.txt 2>&1; grep -E "^\w+ \[" board/motion_gate.txt | cut -c1-110
rm -rf out/.puppet_cache
bash ../tools/gpu_render.sh film.json --frames "${FRAMES:-$(python board/make_sheets.py --list)}" --scale "$SCALE" --stills-dir board/frames 2>&1 | tail -3
python board/make_sheets.py | tail -30
timeout 420 node ../../../tools/frame_checks/check.mjs film.json --skip 'sky|dome|cone|beam|haze|fog|dust|glow|halo|smoke|spark|cloud|backdrop|mote|shaft|s4_' > board/checks.txt 2>&1 || true; tail -8 board/checks.txt
