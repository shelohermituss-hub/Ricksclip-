#!/usr/bin/env bash
# fix2_rerun.sh: FIX 2 round b (apron pale grey): rebuild into out_tmp/ + swap, then only the s5/s7 Blender and kit stills again. Ends FIX2B_END.
set -uo pipefail
T="$(cd "$(dirname "$0")" && pwd)"; EP="$(cd "$T/../.." && pwd)"; cd "$T"
python3 /home/user/Ricksclip-/tools/check_midline_comments.py scripts > /dev/null || { echo MIDLINE_FAIL; exit 1; }
uptime > logs/fix2b_load.txt
blender -b --factory-startup --python scripts/bl_dallas.py -- "$EP/assets/ph_dallas" build/tex "$EP/assets_prod" out_tmp > logs/dallas_fix2b.log 2>&1
grep -q DALLAS_DONE logs/dallas_fix2b.log && ! grep -q Traceback logs/dallas_fix2b.log || { echo "BUILD_FAIL"; grep -A12 Traceback logs/dallas_fix2b.log | head -30; exit 1; }
for f in dallas.blend dallas.glb dallas_lite.glb dallas_meta.json; do mv -f out_tmp/$f out/$f; done; echo SWAPPED
uptime >> logs/fix2b_load.txt
blender -b out/dallas.blend --python scripts/bl_dallas_proof.py -- proof/fix2/bl 540 960 ${CAMS_BL:-s5,s7} > logs/proof_fix2b_bl.log 2>&1; grep "^PROOF\|Traceback" logs/proof_fix2b_bl.log
uptime >> logs/fix2b_load.txt
W=540 H=960 ONLY="${ONLY_KIT:-s5 s7 boards}" bash scripts/run_kit.sh > logs/kit_fix2b.log 2>&1; grep KIT_TIME logs/kit_fix2b.log
uptime >> logs/fix2b_load.txt; echo FIX2B_END
