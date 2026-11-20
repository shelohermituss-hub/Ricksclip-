#!/usr/bin/env bash
# S1 full cycle (one command, run in the background): film.json -> bake -> full-size frames WITH captions in two parallel chunks -> run_stretch.sh
# (plan check, frame checks, 11i detail, cam_track) -> camsafe validate -> motion gate -> S1_hook.mp4 with the voice. Log logs/render_s1.log, end S1_RENDER_END.
cd "$(dirname "$0")"; ROOT=../../..; K=$ROOT/templates/threejs_film/render_gpu.mjs
python make_film.py; python $ROOT/tools/film_plan.py bake film.json | tail -1
mkdir -p frames; t0=$(date +%s)
node $K film.json --frames 0-144 --scale 1 --stills-dir "$PWD/frames" > logs/r_a.log 2>&1 &
node $K film.json --frames 145-288 --scale 1 --stills-dir "$PWD/frames" > logs/r_b.log 2>&1 &
wait; echo "render: $(ls frames | wc -l) frames in $(( $(date +%s) - t0 )) s"; tail -1 logs/r_a.log logs/r_b.log
bash $ROOT/tools/run_stretch.sh film.json 0-288
timeout 900 node $ROOT/tools/camsafe/validate.mjs film.json > camsafe.txt 2>&1; echo "camsafe exit $?"; grep -E "FAIL|WARN|PASS" camsafe.txt | tail -8
GATE_SHEET=firetrucks.mjs GATE_MOVES=ep_s1.mjs node moves/tools/check_motion_ep.mjs > motion_gate.txt 2>&1; grep "^[a-z]" motion_gate.txt | cut -c1-80
ffmpeg -v error -y -framerate 30 -i frames/f_%05d.png -i voice/voice.wav -t 9.633 -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k S1_hook.mp4 && echo "mp4 ok $(ffprobe -v error -show_entries format=duration -of csv=p=0 S1_hook.mp4) s"
echo S1_RENDER_END
