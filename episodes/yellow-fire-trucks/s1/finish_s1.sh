#!/usr/bin/env bash
# finish: render the frames missing in frames/, then the same checks, mp4 and sheets as render_s1.sh (log logs/finish_s1.log, end S1_FINISH_END)
cd "$(dirname "$0")"; ROOT=../../..; K=$ROOT/templates/threejs_film/render_gpu.mjs
MISS=$(python -c "import os;m=[f for f in range(289) if not os.path.exists('frames/f_%05d.png'%f)];print('%d-%d'%(m[0],m[-1]) if m else '')")
[ -n "$MISS" ] && node $K film.json --frames $MISS --scale 1 --stills-dir "$PWD/frames" 2>&1 | tail -1
echo "frames $(ls frames | wc -l)"
bash $ROOT/tools/run_stretch.sh film.json 0-288
ffmpeg -v error -y -framerate 30 -i frames/f_%05d.png -i voice/voice.wav -t 9.633 -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k S1_hook.mp4 && echo "mp4 ok $(ffprobe -v error -show_entries format=duration -of csv=p=0 S1_hook.mp4) s"
python sheets.py
echo S1_FINISH_END
