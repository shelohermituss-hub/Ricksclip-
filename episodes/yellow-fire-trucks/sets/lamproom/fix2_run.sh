#!/usr/bin/env bash
# fix2_run.sh (FIX 2, set-builder 2026-11-21): wider window pictures (from town.blend) -> out/ by rename, the room built into out_tmp/ then renamed into out/,
# then only the FIX 2 proofs (Blender allon, irisopen, exit; kit allon, exit). Ends FIX2_END.
set -uo pipefail
T="$(cd "$(dirname "$0")" && pwd)"; EP="$(cd "$T/../.." && pwd)"; cd "$T"; mkdir -p logs out_tmp proof/fix2/bl
python3 /home/user/Ricksclip-/tools/check_midline_comments.py scripts > /dev/null || { echo MIDLINE_FAIL; exit 1; }
uptime > logs/fix2_load.txt
if [ -z "${SKIP_WINDOW:-}" ]; then
  blender -b "$EP/sets/town/out/town.blend" --python scripts/bl_window.py -- out_tmp 1068 12 > logs/fix2_window.log 2>&1
  grep -q WINDOW_END logs/fix2_window.log && ! grep -q Traceback logs/fix2_window.log || { echo WINDOW_FAIL; exit 1; }
  for f in window_red.png window_grey.png window_meta.json; do mv -f out_tmp/$f out/$f; done; echo WINDOW_SWAPPED
fi
uptime >> logs/fix2_load.txt
blender -b --factory-startup --python scripts/bl_lamproom.py -- "$EP/assets/ph_lamproom" out out_tmp > logs/fix2_build.log 2>&1
grep -q LAMPROOM_DONE logs/fix2_build.log && ! grep -q Traceback logs/fix2_build.log || { echo BUILD_FAIL; grep -A10 Traceback logs/fix2_build.log | head -20; exit 1; }
grep CABINET_TINT logs/fix2_build.log | head -4
for f in lamproom.blend lamproom_lite.glb lamproom_meta.json; do mv -f out_tmp/$f out/$f; done; echo SWAPPED
blender -b out/lamproom.blend --python-expr "import bpy; print('IMGPATHS', [(i.name, i.filepath) for i in bpy.data.images if 'window' in i.name])" 2>/dev/null | grep IMGPATHS
uptime >> logs/fix2_load.txt
blender -b out/lamproom.blend --python scripts/bl_lamproom_proof.py -- proof/fix2/bl allon:CAM_ROOM:0:0,irisopen:CAM_ROOM:4:1,exit:CAM_EXIT:4:1 > logs/fix2_bl.log 2>&1; grep "^PROOF\|Traceback" logs/fix2_bl.log
uptime >> logs/fix2_load.txt
W=540 H=960 ONLY="allon exit" bash proof/run_kit.sh > logs/fix2_kit.log 2>&1; grep KIT_TIME logs/fix2_kit.log
uptime >> logs/fix2_load.txt; echo FIX2_END
