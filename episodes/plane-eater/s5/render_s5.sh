#!/usr/bin/env bash
# S5 DRAFT cycle: film.json -> bake -> half-size frames (one process, --grab fast) -> checks -> draft.mp4 with the voice (log logs/render.log, end S5_RENDER_END)
cd "$(dirname "$0")"; ROOT=../../..; K=$ROOT/templates/threejs_film/render_gpu.mjs
python make_film.py; python $ROOT/tools/film_plan.py bake film.json | tail -1
rm -rf frames; mkdir -p frames; t0=$(date +%s)
rm -rf passes; mkdir -p passes/A passes/W
python $ROOT/tools/film_plan.py bake film_A.json > /dev/null; node $K film_A.json --frames 943-1012 --scale 0.5 --grab fast --stills-dir "$PWD/passes/A" > logs/rA.log 2>&1
python $ROOT/tools/film_plan.py bake film_W.json > /dev/null; node $K film_W.json --frames 1005-1021 --scale 0.5 --grab fast --stills-dir "$PWD/passes/W" > logs/rW.log 2>&1
python blend.py; python $ROOT/tools/film_plan.py bake film.json > /dev/null
echo "render: $(ls frames | wc -l) frames in $(( $(date +%s) - t0 )) s"; tail -1 logs/r.log
python $ROOT/tools/film_plan.py check film.json --window 943-1021 > plan_check.txt 2>&1; grep RESULT plan_check.txt
timeout 900 node $ROOT/tools/frame_checks/check.mjs film.json > checks.txt 2>&1; tail -4 checks.txt
timeout 900 node $ROOT/tools/camsafe/validate.mjs film.json > camsafe.txt 2>&1; echo "camsafe exit $?"; tail -3 camsafe.txt
ffmpeg -v error -y -framerate 30 -start_number 943 -i frames/f_%05d.png -ss 31.44 -t 2.6 -i voice/voice.wav -c:v libx264 -crf 20 -pix_fmt yuv420p -c:a aac -b:a 160k -shortest draft.mp4 && echo "mp4 ok $(ffprobe -v error -show_entries format=duration -of csv=p=0 draft.mp4) s"
echo S5_RENDER_END
