#!/usr/bin/env bash
# run_stretch.sh: ONE command per stretch cycle (LEAN DEFAULT, CB 2026-11-17, CB_RULES 11a step 0 and 11b T4). From the lean test (episodes/_tests/lean_2026-11-17/r2/run_lean.sh).
#   bash tools/run_stretch.sh <film.json> <a-b> [--force]      (run it in the background and end the turn; read <stretch>/run_stretch.log when it is done)
# Steps, one log: (optional make_film.py beside the film) -> bake -> plan check with the WINDOW speed check -> GPU render of a-b (resumable; --force re-renders)
#   -> frame checks on every frame of a-b (with the driver/body rows: body_check + scale_check) -> 11i detail gate on 4 frames -> cam_track numbers (p90 <= 22 px/f).
set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"; T="$ROOT/tools"; KIT="$ROOT/templates/threejs_film/render_gpu.mjs"
FILM="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"; WIN="$2"; A="${WIN%-*}"; B="${WIN#*-}"; DIR="$(dirname "$FILM")"; cd "$DIR"
[ -f make_film.py ] && python make_film.py
python "$T/film_plan.py" bake "$FILM" | tail -1
python "$T/film_plan.py" check "$FILM" --window "$WIN" > plan_check.txt 2>&1; grep -E "WINDOW|teleport|whip" plan_check.txt | head -8
mkdir -p frames; [ "${3:-}" = "--force" ] && rm -f frames/f_*.png
MISS=$(python -c "import os;print(','.join(str(f) for f in range($A,$B+1) if not os.path.exists('frames/f_%05d.png'%f)))")
if [ -n "$MISS" ]; then node "$KIT" "$FILM" --frames "$A-$B" --scale 1 --no-captions --stills-dir "$DIR/frames" 2>&1 | tail -1; fi
echo "frames: $(ls frames | wc -l)"
timeout 1200 node "$T/frame_checks/check.mjs" "$FILM" --frames "$WIN" --all-frames --out out/fc > checks.txt 2>&1; echo "frame checks exit $?"; grep -E "FAIL|WARN" checks.txt | head -20
Q=$(python -c "a,b=$A,$B;print(' '.join('frames/f_%05d.png'%round(a+(b-a)*k/5) for k in (1,2,3,4)))")
python "$T/measure/density_check.py" --style 3d --day $Q --json density.json > density.txt 2>&1; grep -o "f_[0-9]*.png [0-9]/7 [A-Z]* G1_edge ([0-9.]*" density.txt
ffmpeg -v error -y -framerate 30 -start_number "$A" -i frames/f_%05d.png -frames:v $((B-A+1)) -c:v libx264 -crf 18 -pix_fmt yuv420p _raw.mp4 && python "$T/measure/cam_track.py" _raw.mp4 --json cam_raw.json > /dev/null 2>&1
python -c "import json;d=list(json.load(open('cam_raw.json')).values())[0];p=d['speed_p90'];print('cam_track: p90',p,'(<= 22:', 'PASS' if p<=22 else 'FAIL', ') peak median',d['move_peak_median'],'cuts',d['cut_frames'])"
echo RUN_STRETCH_DONE
