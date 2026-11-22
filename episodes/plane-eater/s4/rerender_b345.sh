#!/usr/bin/env bash
# fix round 1, last step: re-render passes B3-B5 (owner drawn camera-safe, caught plate moved off the certificate), blend, mp4, sheets
cd "$(dirname "$0")"; ROOT=../../..; K=$ROOT/templates/threejs_film/render_gpu.mjs; t0=$(date +%s)
for x in "B3 738-847" "B4 840-891" "B5 884-942"; do set -- $x; rm -rf passes/$1; mkdir -p passes/$1
  python $ROOT/tools/film_plan.py bake film_$1.json > /dev/null 2>&1; node $K film_$1.json --frames $2 --scale 0.5 --grab fast --stills-dir "$PWD/passes/$1" > logs/r$1.log 2>&1; echo "$1 $(tail -n 1 logs/r$1.log | cut -c1-70)"; done
python blend.py; echo "render $(( $(date +%s) - t0 )) s"
ffmpeg -v error -y -framerate 30 -start_number 638 -i frames/f_%05d.png -ss 21.2667 -t 10.1667 -i voice/voice.wav -map 0:v -map 1:a -c:v libx264 -crf 20 -pix_fmt yuv420p -c:a aac -b:a 160k -shortest draft.mp4 && echo "mp4 ok"
python sheets.py . 638 942 645,668,690,700,716,746,772,822,838,850,866,900,920
python $ROOT/tools/film_plan.py bake film.json > /dev/null 2>&1; echo S4_RERENDER_END
