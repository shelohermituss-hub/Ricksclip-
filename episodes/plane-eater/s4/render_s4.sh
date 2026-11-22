#!/usr/bin/env bash
# S4 DRAFT cycle: make_film.py -> pass A (clinic 638-672) and pass B (apron 660-942) at half size, each baked right before its render (they share
# out/plan) -> blend.py (dissolve 662-672) -> checks -> draft.mp4 with the voice (21.2667-31.4333 s) -> sheets. Log: logs/render.log, ends S4_RENDER_END.
cd "$(dirname "$0")"; ROOT=../../..; K=$ROOT/templates/threejs_film/render_gpu.mjs
python make_film.py; rm -rf frames passes; mkdir -p frames passes/A passes/B; t0=$(date +%s)
python $ROOT/tools/film_plan.py bake film_A.json > /dev/null; node $K film_A.json --frames 638-672 --scale 0.5 --grab fast --stills-dir "$PWD/passes/A" > logs/rA.log 2>&1; tail -n 1 logs/rA.log
python $ROOT/tools/film_plan.py bake film_B.json > /dev/null; node $K film_B.json --frames 660-942 --scale 0.5 --grab fast --stills-dir "$PWD/passes/B" > logs/rB.log 2>&1; tail -n 1 logs/rB.log
python blend.py; echo "render: $(ls frames | wc -l) frames in $(( $(date +%s) - t0 )) s"
ffmpeg -v error -y -framerate 30 -start_number 638 -i frames/f_%05d.png -ss 21.2667 -t 10.1667 -i voice/voice.wav -map 0:v -map 1:a -c:v libx264 -crf 20 -pix_fmt yuv420p -c:a aac -b:a 160k -shortest draft.mp4 && echo "mp4 ok $(ffprobe -v error -show_entries format=duration -of csv=p=0 draft.mp4) s"
python sheets.py . 638 942 645,668,690,700,716,746,772,822,838,852,862,900,920
echo S4_RENDER_END
