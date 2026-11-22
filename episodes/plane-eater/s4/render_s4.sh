#!/usr/bin/env bash
# S4 cycle (fix round 1): make_film.py -> six half-size passes, each baked right before its render (they share out/plan) -> blend.py dissolves ->
# draft.mp4 with the voice -> sheets -> checks on film.json (the cut version: five apron takes). Log logs/render.log, ends S4_RENDER_END.
cd "$(dirname "$0")"; ROOT=../../..; K=$ROOT/templates/threejs_film/render_gpu.mjs
python make_film.py; rm -rf frames passes; mkdir -p frames; t0=$(date +%s)
for x in "A 638-672" "B1 660-712" "B2 705-745" "B3 738-847" "B4 840-891" "B5 884-942"; do set -- $x; mkdir -p passes/$1
  python $ROOT/tools/film_plan.py bake film_$1.json > /dev/null 2>&1; node $K film_$1.json --frames $2 --scale 0.5 --grab fast --stills-dir "$PWD/passes/$1" > logs/r$1.log 2>&1; echo "$1 $(tail -n 1 logs/r$1.log | cut -c1-70)"; done
python blend.py; echo "render: $(ls frames | wc -l) frames in $(( $(date +%s) - t0 )) s"
ffmpeg -v error -y -framerate 30 -start_number 638 -i frames/f_%05d.png -ss 21.2667 -t 10.1667 -i voice/voice.wav -map 0:v -map 1:a -c:v libx264 -crf 20 -pix_fmt yuv420p -c:a aac -b:a 160k -shortest draft.mp4 && echo "mp4 ok $(ffprobe -v error -show_entries format=duration -of csv=p=0 draft.mp4) s"
python sheets.py . 638 942 645,668,690,700,716,746,772,822,838,850,866,900,920
echo S4_RENDER_END
