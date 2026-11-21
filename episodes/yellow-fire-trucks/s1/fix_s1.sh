#!/usr/bin/env bash
# S1 fix round cycle: changed frames only (render_frames.sh, one process), then checks, mp4, sheets. Log logs/fix_s1.log, end S1_FIX_END.
cd "$(dirname "$0")"; ROOT=../../..; t0=$(date +%s)
: > logs/frames.log; bash render_frames.sh 0-288; grep -c failed logs/frames.log; grep MISSING logs/frames.log
echo "render $(( $(date +%s) - t0 )) s, frames $(ls frames | wc -l)"
bash $ROOT/tools/run_stretch.sh film.json 0-288
timeout 900 node $ROOT/tools/camsafe/validate.mjs film.json > camsafe.txt 2>&1; grep -E "CAMERA-SAFE" camsafe.txt
GATE_SHEET=firetrucks.mjs GATE_MOVES=ep_s1.mjs node moves/tools/check_motion_ep.mjs > motion_gate.txt 2>&1; grep "^[a-z]" motion_gate.txt | cut -c1-80
ffmpeg -v error -y -framerate 30 -i frames/f_%05d.png -i voice/voice.wav -t 9.633 -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k S1_hook.mp4 && echo "mp4 ok $(ffprobe -v error -show_entries format=duration -of csv=p=0 S1_hook.mp4) s"
python sheets.py
echo S1_FIX_END
