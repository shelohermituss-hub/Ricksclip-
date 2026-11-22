#!/usr/bin/env bash
# One plane-eater stretch on a RunPod GPU (OptiX, then CUDA; no GPU = stop, exit 3). Needs blender 5.x on PATH, python3 (numpy + pillow installed if missing).
# usage: bash render.sh [first last]        (default: the stretch window in frames.json)
# test here without a GPU: ALLOW_CPU=1 PCT=10 SPP=8 bash render.sh <f> <f>
# out/: f_####_raw.png (1080x1920, Cycles 64 spp adaptive + OIDN, Standard view), f_####_/pass_mask.png, f_####_lines_id.png,
#       final/f_####.png (grade_rick toward the Rick target + thin #2a1830 lines under the cards), times_*.json, blender.log
set -e; cd "$(dirname "$0")"; mkdir -p out/final
python3 -c "import numpy, PIL" 2>/dev/null || pip install -q numpy pillow
read F0 F1 KIND STR < <(python3 -c "import json;d=json.load(open('frames.json'));print(d['frames'][0],d['frames'][1],d['grade'][0],d['grade'][1])")
F0=${1:-$F0}; F1=${2:-$F1}; T0=$(date +%s)
blender -b scene.blend --python job_film.py -- "$F0" "$F1" >> out/blender.log 2>&1 || { echo "BLENDER FAILED (see out/blender.log):"; grep -E "NO_GPU|Error|Traceback" out/blender.log | tail -5; exit 3; }
grep -E "^DEVICE|JOB_DONE|not found" out/blender.log | tail -3 || true
for f in $(seq "$F0" "$F1"); do n=$(printf "%04d" "$f"); [ -f "out/final/f_$n.png" ] && continue
  python3 finish_key.py "out/f_${n}_raw.png" "out/f_${n}_/pass_mask.png" "out/f_${n}_lines_id.png" "out/final/f_$n.png" --kind "$KIND" --strength "$STR" --targets rick_targets.json > /dev/null &
  [ $(jobs -r | wc -l) -ge 8 ] && wait -n; done; wait
echo "DONE $F0-$F1: $(( $(date +%s) - T0 )) s; finals in out/final/"
