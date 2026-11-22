#!/usr/bin/env bash
# fix-list round: re-render only the changed frames (salting f0-75, saw f148-207 raw for the blend), then blend, checks, mp4, sheets
cd "$(dirname "$0")"; ROOT=../../..; K=$ROOT/templates/threejs_film/render_gpu.mjs
python3 make_film.py; python3 $ROOT/tools/film_plan.py check film.json --window 0-256 > plan_check.txt 2>&1; grep RESULT plan_check.txt
node $K film.json --frames 0-75 --scale 0.5 --grab fast --stills-dir "$PWD/frames" > logs/fx_a.log 2>&1; tail -1 logs/fx_a.log
node $K film.json --frames 148-207 --scale 0.5 --grab fast --stills-dir "$PWD/frames" > logs/fx_b.log 2>&1; tail -1 logs/fx_b.log
rm -rf frames_a frames_b frames_blend; bash blend.sh > logs/blend.log 2>&1; tail -2 logs/blend.log
timeout 900 node $ROOT/tools/frame_checks/check.mjs film.json > checks.txt 2>&1; tail -1 checks.txt
timeout 900 node $ROOT/tools/camsafe/validate.mjs film.json > camsafe.txt 2>&1; grep CAMERA-SAFE camsafe.txt
echo FIX_END
