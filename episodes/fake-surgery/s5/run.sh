#!/usr/bin/env bash
# S5 board, ONE command: film.json, bake, motion gate, GPU stills (shared fair queue), sheets + numbers, frame checks. Run from s5/: bash run.sh [scale] [frames]
set -e
python build_film.py
python ../../../tools/film_plan.py bake film.json | tail -1
node moves/tools/check_motion_ep.mjs > board/motion_gate.txt 2>&1; grep -cE "no_settle [1-9]|twos [1-9]|linear [1-9]|creep [1-9]" board/motion_gate.txt || true
rm -rf out/.puppet_cache
bash ../tools/gpu_render.sh film.json --frames "${2:-$(python board/make_sheets.py --list)}" --scale ${1:-1} --stills-dir board/all 2>&1 | tail -3
python board/make_sheets.py | tail -32
timeout 420 node ../../../tools/frame_checks/check.mjs film.json > board/checks.txt 2>&1 || true; tail -8 board/checks.txt
