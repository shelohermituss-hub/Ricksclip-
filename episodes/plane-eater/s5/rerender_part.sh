#!/usr/bin/env bash
# fix list round: re-render only the changed cabin frames (984-1012: the owner's rag on the glass, the wider station on FOOD), re-blend, checks, mp4, sheets
cd "$(dirname "$0")"; ROOT=../../..; K=$ROOT/templates/threejs_film/render_gpu.mjs
python make_film.py
python $ROOT/tools/film_plan.py bake film_A.json > /dev/null; node $K film_A.json --frames 984-1012 --scale 0.5 --grab fast --stills-dir "$PWD/passes/A" > logs/rA2.log 2>&1
python blend.py; python $ROOT/tools/film_plan.py bake film.json | tail -1
python $ROOT/tools/film_plan.py check film.json --window 943-1021 > plan_check.txt 2>&1; grep RESULT plan_check.txt
timeout 900 node $ROOT/tools/frame_checks/check.mjs film.json > checks.txt 2>&1; tail -2 checks.txt
timeout 900 node $ROOT/tools/camsafe/validate.mjs film.json > camsafe.txt 2>&1; grep CAMERA-SAFE camsafe.txt
ffmpeg -v error -y -framerate 30 -start_number 943 -i frames/f_%05d.png -ss 31.44 -t 2.6 -i voice/voice.wav -c:v libx264 -crf 20 -pix_fmt yuv420p -c:a aac -b:a 160k -shortest draft.mp4 && echo mp4ok
python sheets.py . 943 1021 945,960,975,992,1003,1008,1014,1021
echo PART_END
