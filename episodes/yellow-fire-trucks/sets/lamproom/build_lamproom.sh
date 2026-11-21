#!/usr/bin/env bash
# build_lamproom.sh: rebuilds PLACE D, THE LAMP ROOM BEHIND THE EYE (set-builder 2026-11-21), from the downloads. Re-runnable (RunPod or a new session).
#   bash build_lamproom.sh            -> out/window_{red,grey}.png (the real dusk crossing from town.blend), out/lamproom.blend, out/lamproom_lite.glb, out/lamproom_meta.json
#   bash build_lamproom.sh --proof    -> + Blender stills (proof/bl), kit stills (proof/kit/stills), proof/numbers.json, LAMPROOM_SHEET.jpg
#   SKIP_WINDOW=1 skips the town render (2 frames from town.blend, about 2 min) when out/window_*.png exist.
# Needs: blender 5 (bash tools/install_blender.sh), python3 + PIL + numpy + scipy, node (kit only), sets/town/out/town.blend (sets/town/build_town.sh).
# One render process at a time (shared CPU). No date or time goes into any image. Ends LAMPROOM_BUILD_END (and LAMPROOM_PROOF_END).
set -euo pipefail
T="$(cd "$(dirname "$0")" && pwd)"; EP="$(cd "$T/../.." && pwd)"; cd "$T"; mkdir -p logs out proof/bl proof/kit/stills
python3 scripts/fetch_lamproom.py "$EP/assets" > logs/fetch.log 2>&1; ! grep FAIL logs/fetch.log; grep -c " ok" logs/fetch.log
if [ -z "${SKIP_WINDOW:-}" ] || [ ! -s out/window_grey.png ]; then
  [ -s "$EP/sets/town/out/town.blend" ] || { echo "sets/town/out/town.blend missing: run sets/town/build_town.sh first"; exit 1; }
  blender -b "$EP/sets/town/out/town.blend" --python scripts/bl_window.py -- out 640 12 > logs/window.log 2>&1
  grep -q WINDOW_END logs/window.log && ! grep -q Traceback logs/window.log || { echo "window FAILED (logs/window.log)"; exit 1; }; grep -E "^WINDOW|^HEADLAMP" logs/window.log || true
fi
blender -b --factory-startup --python scripts/bl_lamproom.py -- "$EP/assets/ph_lamproom" out out > logs/build.log 2>&1
grep -q LAMPROOM_DONE logs/build.log && ! grep -q Traceback logs/build.log || { echo "lamproom FAILED (logs/build.log)"; exit 1; }
grep -E "^LAMPS|^GLOW|^BLEND|^GLB_|^SCREEN" logs/build.log || true
echo LAMPROOM_BUILD_END
if [ "${1:-}" = "--proof" ]; then
  rm -f proof/bl/bl_times.json
  blender -b out/lamproom.blend --python scripts/bl_lamproom_proof.py -- proof/bl allon:CAM_ROOM:0:0,wave2:CAM_ROOM:2:0,redoff:CAM_ROOM:4:0,irisopen:CAM_ROOM:4:1,entry:CAM_ENTRY:0:0 > logs/proof_bl.log 2>&1
  grep "^PROOF" logs/proof_bl.log || true
  bash proof/run_kit.sh > logs/kit.log 2>&1; grep -E "KIT_TIME|PHFD" logs/kit.log || true
  python3 scripts/sheet.py . > logs/sheet.log 2>&1; cat logs/sheet.log
  echo LAMPROOM_PROOF_END
fi
