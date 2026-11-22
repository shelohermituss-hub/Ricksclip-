#!/usr/bin/env bash
# One plane-eater stretch on a RunPod GPU (OptiX, then CUDA; no GPU = stop, exit 3). Needs blender 5.x on PATH, python3 (numpy + pillow installed if missing).
# usage: bash render.sh [first last]        (default: the stretch window in frames.json). Beauty + mask + lines only (the pod's job);
#   FINISH=1 also grades here (otherwise look/film/post_film.py does grade, fx, overlay and the mix after the download)
# test here without a GPU: ALLOW_CPU=1 PCT=10 SPP=8 bash render.sh <f> <f>
# out/: f_####_raw.png (720x1280 Cycles adaptive .1 / 48 spp + OIDN, Standard view, upscaled to 1080x1920 before the finish), f_####_/pass_mask.png, f_####_lines_id.png,
#       final/f_####.png (grade_rick toward the Rick target + thin #2a1830 lines under the cards), times_*.json, blender.log
set -e; cd "$(dirname "$0")"; mkdir -p out/final
python3 -c "import numpy, PIL" 2>/dev/null || pip install -q numpy pillow
read F0 F1 KIND STR < <(python3 -c "import json;d=json.load(open('frames.json'));print(d['frames'][0],d['frames'][1],d['grade'][0],d['grade'][1])")
KMAX=$(python3 -c "import json;print(json.load(open('frames.json')).get('sat_kmax',2.4))"); F0=${1:-$F0}; F1=${2:-$F1}; T0=$(date +%s)
blender -b scene.blend --python job_film.py -- "$F0" "$F1" >> out/blender.log 2>&1 || { echo "BLENDER FAILED (see out/blender.log):"; grep -E "NO_GPU|Error|Traceback" out/blender.log | tail -5; exit 3; }
grep -E "^DEVICE|JOB_DONE|not found" out/blender.log | tail -3 || true
[ "${FINISH:-0}" = 1 ] || { echo "DONE $F0-$F1 beauty only: $(( $(date +%s) - T0 )) s (finish + overlay + mix: look/film/post_film.py after the download)"; exit 0; }
for f in $(seq "$F0" "$F1"); do n=$(printf "%04d" "$f"); [ -f "out/final/f_$n.png" ] && continue
  read KIND STR < <(python3 -c "import json;d=json.load(open('frames.json'));k=[r for r in d.get('grade_ranges',[]) if r[0]<=$f<=r[1]];print(*(k[0][2:] if k else d['grade']))")
  python3 -c "from PIL import Image;import sys;[Image.open(p).resize((1080,1920),Image.LANCZOS).save(p) for p in sys.argv[1:] if Image.open(p).size!=(1080,1920)]" "out/f_${n}_raw.png" "out/f_${n}_/pass_mask.png"
  python3 finish_key.py "out/f_${n}_raw.png" "out/f_${n}_/pass_mask.png" "out/f_${n}_lines_id.png" "out/final/f_$n.png" --kind "$KIND" --strength "$STR" --targets rick_targets.json > /dev/null && python3 sat_fit.py "out/final/f_$n.png" "out/f_${n}_/pass_mask.png" "$KIND" rick_targets.json "$KMAX" > /dev/null && python3 -c "import fx_layer as F;F.apply('out/final/f_$n.png','out/f_${n}_/pass_mask.png','fx.json',$f)" &
  [ $(jobs -r | wc -l) -ge 8 ] && wait -n; done; wait
echo "DONE $F0-$F1: $(( $(date +%s) - T0 )) s; finals in out/final/"
