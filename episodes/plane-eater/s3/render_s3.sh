#!/usr/bin/env bash
# S3 DRAFT cycle (fix round): film*.json -> bake -> three half-size passes (A clinic push into the film 519-577, B X-ray world 568-637, C back out to the
# Doctor 628-638) -> two DISSOLVES ON THE MOVE (568-577 A->B, 628-637 B->C) into frames/ -> checks on film.json -> draft.mp4 (log logs/render.log, end S3_RENDER_END)
cd "$(dirname "$0")"; ROOT=../../..; K=$ROOT/templates/threejs_film/render_gpu.mjs
python make_film.py; for x in film film_A film_B film_C; do python $ROOT/tools/film_plan.py bake $x.json | tail -1; done
rm -rf frames passes; mkdir -p frames passes/A passes/B passes/C; t0=$(date +%s)
python $ROOT/tools/film_plan.py bake film_A.json > /dev/null; node $K film_A.json --frames 519-577 --scale 0.5 --grab fast --stills-dir "$PWD/passes/A" > logs/rA.log 2>&1
python $ROOT/tools/film_plan.py bake film_B.json > /dev/null; node $K film_B.json --frames 568-637 --scale 0.5 --grab fast --stills-dir "$PWD/passes/B" > logs/rB.log 2>&1
python $ROOT/tools/film_plan.py bake film_C.json > /dev/null; node $K film_C.json --frames 628-638 --scale 0.5 --grab fast --stills-dir "$PWD/passes/C" > logs/rC.log 2>&1
python blend.py
echo "render: $(ls frames | wc -l) frames in $(( $(date +%s) - t0 )) s"
python $ROOT/tools/film_plan.py bake film.json | tail -1
python $ROOT/tools/film_plan.py check film.json --window 519-638 > plan_check.txt 2>&1; grep RESULT plan_check.txt
timeout 900 node $ROOT/tools/frame_checks/check.mjs film.json > checks.txt 2>&1; tail -4 checks.txt
timeout 900 node $ROOT/tools/camsafe/validate.mjs film.json > camsafe.txt 2>&1; echo "camsafe exit $?"; grep CAMERA-SAFE camsafe.txt
ffmpeg -v error -y -framerate 30 -start_number 519 -i frames/f_%05d.png -ss 17.30 -t 4.0 -i voice/voice.wav -c:v libx264 -crf 20 -pix_fmt yuv420p -c:a aac -b:a 160k -shortest draft.mp4 && echo "mp4 ok $(ffprobe -v error -show_entries format=duration -of csv=p=0 draft.mp4) s"
python sheets.py . 519 638 519,545,560,572,592,610,628,634,638
echo S3_RENDER_END
