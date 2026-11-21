#!/usr/bin/env bash
# fix2_run.sh (FIX 2, set-builder 2026-11-21): stronger print tints -> map built into out_tmp/ (+ its lite copy) then renamed into out/, then the FIX 2
# proofs: Blender wide, station_open, dallas, pine_sink (saturation >= .30) and kit wide, dallas (brass env map). Ends FIX2_END.
set -uo pipefail
T="$(cd "$(dirname "$0")" && pwd)"; EP="$(cd "$T/../.." && pwd)"; cd "$T"; mkdir -p logs out_tmp proof/fix2/bl
python3 /home/user/Ricksclip-/tools/check_midline_comments.py scripts > /dev/null || { echo MIDLINE_FAIL; exit 1; }
uptime > logs/fix2_load.txt
python3 scripts/tex_map.py "$EP/assets/map" build/tex > logs/fix2_tex.log 2>&1; grep -q TEX_END logs/fix2_tex.log || { echo TEX_FAIL; exit 1; }
blender -b --factory-startup --python scripts/bl_map.py -- "$EP/assets/map" build/tex "$EP/assets_prod" out_tmp > logs/fix2_map.log 2>&1
grep -q MAP_DONE logs/fix2_map.log && ! grep -q Traceback logs/fix2_map.log || { echo BUILD_FAIL; grep -A10 Traceback logs/fix2_map.log | head; exit 1; }
blender -b out_tmp/map.blend --python scripts/bl_map_lite.py -- out_tmp "$EP/assets_prod" > logs/fix2_lite.log 2>&1
grep -q LITE_DONE logs/fix2_lite.log && ! grep -q Traceback logs/fix2_lite.log || { echo LITE_FAIL; exit 1; }
for f in out_tmp/*; do mv -f "$f" out/; done; echo SWAPPED; ls out
uptime >> logs/fix2_load.txt
blender -b out/map.blend --python scripts/bl_map_proof.py -- proof/fix2/bl 540 960 wide,station_open,dallas,pine_sink,cities_field > logs/fix2_bl.log 2>&1; grep "^PROOF\|Traceback" logs/fix2_bl.log
uptime >> logs/fix2_load.txt
W=540 H=960 ONLY="wide dallas cities_field" bash proof/run_kit.sh > logs/fix2_kit.log 2>&1; grep KIT_TIME logs/fix2_kit.log
uptime >> logs/fix2_load.txt; echo FIX2_END
