#!/usr/bin/env bash
# S1 board + hook, ONE command: film.json (re-reads sets/PLACE_KEYS.json), bake, motion gate, GPU frames 0-374 at scale 1 (r3: full size) (the hook, board/all)
# + the key frames at scale 1 (board/key), sheets + numbers, hook mp4 + strip, frame checks. Run from this folder: bash run.sh
# STAGE=hook (frames 0-374) / key (key frames) / post (sheets, hook, checks only) / plan (build + gate only)
set -e
S=${STAGE:-all}
python build_film.py
python ../../../tools/film_plan.py bake film.json | tail -1
node moves/tools/check_motion_ep.mjs > board/motion_gate.txt 2>&1; grep -E "^\S" board/motion_gate.txt | cut -c1-120
rm -rf out/.puppet_cache
KEY=$(python board/make_sheets.py --list)
if [ "$S" = all ] || [ "$S" = hook ]; then bash ../tools/gpu_render.sh film.json --frames 0-374 --scale 1 --stills-dir board/all 2>&1 | grep -E "^stills" ; fi
if [ "$S" = all ] || [ "$S" = key ]; then bash ../tools/gpu_render.sh film.json --frames $KEY --scale 1 --stills-dir board/key 2>&1 | grep -E "^stills" ; fi
if [ "$S" = all ] || [ "$S" = key ] || [ "$S" = post ]; then
  python board/make_sheets.py | tail -1
  python board/make_hook.py
  timeout 420 node ../../../tools/frame_checks/check.mjs film.json > board/checks.txt 2>&1 || true; tail -6 board/checks.txt
fi
