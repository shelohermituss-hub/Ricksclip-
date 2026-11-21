#!/usr/bin/env bash
# Rick-recipe key frame on a RunPod GPU (OptiX, then CUDA; no GPU = stop). Needs blender 5.x on PATH, python3 (numpy + pillow are installed if missing).
# usage: bash render.sh            test without a GPU: ALLOW_CPU=1 PCT=10 SPP=8 bash render.sh
# out/: <NAME>_raw.png (1080x1920, Cycles 512 spp adaptive .01 + OIDN, Standard view), <NAME>_/pass_mask.png (cast = 1), <NAME>_lines_id.png (900x1600),
#       <NAME>_final.png (grade_rick toward the Rick target + thin #2a1830 lines under the cards), numbers.json, render_seconds.txt, blender.log
set -e; cd "$(dirname "$0")"; mkdir -p out; source ./job.env
python3 -c "import numpy, PIL" 2>/dev/null || pip install -q numpy pillow
T0=$(date +%s)
blender -b scene.blend --python job.py -- "$NAME" > out/blender.log 2>&1 || { echo "BLENDER FAILED (see out/blender.log):"; grep -E "NO_GPU|Error|Traceback" out/blender.log | head; exit 3; }
grep -E "^DEVICE|RENDER_SECONDS|LINES_ID|JOB_DONE|not found|NOT_PACKED" out/blender.log || true
echo $(( $(date +%s) - T0 )) > out/render_seconds.txt
python3 finish_key.py "out/${NAME}_raw.png" "out/${NAME}_/pass_mask.png" "out/${NAME}_lines_id.png" "out/${NAME}_final.png" \
  --kind "$KIND" --strength "$STRENGTH" $EXTRA --json out/numbers.json --targets rick_targets.json
echo "DONE: out/${NAME}_final.png ($(cat out/render_seconds.txt) s incl. scene load)"
