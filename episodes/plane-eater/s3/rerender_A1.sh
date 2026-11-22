#!/usr/bin/env bash
# fix list round: re-render only pass A1 (519-565: the Doctor's fist on the film), re-blend, checks, mp4, sheets
cd "$(dirname "$0")"; ROOT=../../..; K=$ROOT/templates/threejs_film/render_gpu.mjs
python make_film.py; rm -rf passes/A1; mkdir -p passes/A1
python $ROOT/tools/film_plan.py bake film_A1.json > /dev/null; node $K film_A1.json --frames 519-565 --scale 0.5 --grab fast --stills-dir "$PWD/passes/A1" > logs/rA1.log 2>&1
python blend.py; python $ROOT/tools/film_plan.py bake film.json | tail -1
python $ROOT/tools/film_plan.py check film.json --window 519-638 > plan_check.txt 2>&1; grep RESULT plan_check.txt
timeout 900 node $ROOT/tools/frame_checks/check.mjs film.json > checks.txt 2>&1; tail -2 checks.txt
timeout 900 node $ROOT/tools/camsafe/validate.mjs film.json > camsafe.txt 2>&1; grep CAMERA-SAFE camsafe.txt
ffmpeg -v error -y -framerate 30 -start_number 519 -i frames/f_%05d.png -ss 17.30 -t 4.0 -i voice/voice.wav -c:v libx264 -crf 20 -pix_fmt yuv420p -c:a aac -b:a 160k -shortest draft.mp4 && echo mp4ok
python sheets.py . 519 638 519,530,545,560,572,594,612,628,638
echo A1_END
