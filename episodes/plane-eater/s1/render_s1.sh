#!/usr/bin/env bash
# S1 draft cycle (one command, in the background): film.json -> plan check -> HALF-SIZE frames (one process, --grab fast) -> frame checks -> camsafe -> motion gate
# -> draft.mp4 with the voice -> strip sheet. Log logs/render_s1.log, last line S1_RENDER_END.
cd "$(dirname "$0")"; ROOT=../../..; K=$ROOT/templates/threejs_film/render_gpu.mjs
python3 make_film.py; python3 $ROOT/tools/film_plan.py check film.json --window 0-256 > plan_check.txt 2>&1; grep RESULT plan_check.txt
mkdir -p frames; t0=$(date +%s)
node $K film.json --frames 0-256 --scale 0.5 --grab fast --stills-dir "$PWD/frames" > logs/r_all.log 2>&1
echo "render: $(ls frames | wc -l) frames in $(( $(date +%s) - t0 )) s"; tail -1 logs/r_all.log
for try in 1 2; do for f in $(python3 -c "import os;print(' '.join(str(f) for f in range(257) if not os.path.exists('frames/f_%05d.png'%f)))"); do
  node $K film.json --frames $f --scale 0.5 --grab fast --stills-dir "$PWD/frames" > logs/r_one.log 2>&1 || echo "retry f$f"; done; done
ffmpeg -v error -y -framerate 30 -i frames/f_%05d.png -i voice/voice.wav -t 8.567 -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k draft.mp4 && echo "mp4 ok $(ffprobe -v error -show_entries format=duration -of csv=p=0 draft.mp4) s"
python3 sheets.py
timeout 900 node $ROOT/tools/frame_checks/check.mjs film.json > checks.txt 2>&1; echo "frame_checks exit $?"; tail -5 checks.txt
timeout 900 node $ROOT/tools/camsafe/validate.mjs film.json > camsafe.txt 2>&1; echo "camsafe exit $?"; grep -E "FAIL|WARN|PASS" camsafe.txt | tail -6
GATE_SHEET=plane_eater.mjs GATE_MOVES=ep_s1.mjs node moves/tools/check_motion_ep.mjs > motion_gate.txt 2>&1; grep "^[a-z]" motion_gate.txt | cut -c1-90
echo S1_RENDER_END
