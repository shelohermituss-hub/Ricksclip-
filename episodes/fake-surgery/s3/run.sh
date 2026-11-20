#!/usr/bin/env bash
# S3 board, ONE command: film.json, bake, motion gate, GPU key frames (shared fair queue), sheets + numbers, frame checks. Run from this folder: bash run.sh
set -e
python build_film.py
python ../../../tools/film_plan.py bake film.json | tail -1
node moves/tools/check_motion_ep.mjs > board/motion_gate.txt 2>&1; grep -v "^   " board/motion_gate.txt | cut -c1-90
rm -rf out/.puppet_cache
bash ../tools/gpu_render.sh film.json --frames ${FRAMES:-$(python board/make_sheets.py --list)} --scale ${SCALE:-1} --stills-dir board/all 2>&1 | grep -E "stills:|rror|warn" | grep -v 404 | cut -c1-300 | head -12
python board/make_sheets.py | tail -3
timeout 420 node ../../../tools/frame_checks/check.mjs film.json --frames 777-1281 --skip "sky|dome|cone|beam|haze|fog|dust|glow|halo|smoke|spark|cloud|backdrop|mote|rain|snow|patient_torso_drape|patient_thigh_drape|table_back_pad|drape_chest_round|pillow|sploosh" > board/checks.txt 2>&1 || true; tail -6 board/checks.txt
