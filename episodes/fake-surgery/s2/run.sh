#!/usr/bin/env bash
# S2 rough board, ONE command: film.json (re-reads sets/PLACE_KEYS.json), bake, motion gate, GPU key frames (shared fair queue), sheets + numbers, frame checks.
# Run from this folder: bash run.sh     SCALE=0.5 for a staging pass; STAGE=post = sheets + checks only.
set -e
cd "$(dirname "$0")"
S=${STAGE:-all}
python build_film.py
python ../../../tools/film_plan.py bake film.json | tail -1
node moves/tools/check_motion_ep.mjs > board/motion_gate.txt 2>&1; grep -E "^\S" board/motion_gate.txt | cut -c1-120
KF=$(python board/make_sheets.py --list)
if [ "$S" = all ]; then rm -rf out/.puppet_cache; bash ../tools/gpu_render.sh film.json --frames $KF --scale ${SCALE:-1} --stills-dir board/all 2>&1 | grep -E "^stills"; fi
python board/make_sheets.py | tail -1
timeout 420 node ../../../tools/frame_checks/check.mjs film.json > board/checks.txt 2>&1 || true; tail -6 board/checks.txt
