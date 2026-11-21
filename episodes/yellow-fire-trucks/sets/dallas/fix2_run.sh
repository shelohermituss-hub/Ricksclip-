#!/usr/bin/env bash
# fix2_run.sh (FIX 2, set-builder 2026-11-21): rebuild Dallas into out_tmp/, swap the files into out/ (stretch builders read out/), then the FIX 2 proofs only.
set -uo pipefail
T="$(cd "$(dirname "$0")" && pwd)"; EP="$(cd "$T/../.." && pwd)"; cd "$T"; mkdir -p logs out_tmp proof/fix2/bl
uptime > logs/fix2_load.txt
python3 scripts/tex_dallas.py "$EP/assets/ph_dallas/tex" build/tex > logs/tex.log 2>&1; grep -q TEX_END logs/tex.log || { echo TEX_FAIL; exit 1; }
python3 - "$T/scripts" <<'PY'
import sys; p = sys.argv[1] + '/'
src = open(p + 'bl_dallas.py').read(); hdr = src.split('A = sys.argv', 1)[0]
open(p + 'bl_dallas.py', 'w').write(hdr.rsplit('import bpy', 1)[0] + open(p + '_head.py').read() + open(p + '_body.py').read() + open(p + '_tail.py').read())
PY
python3 /home/user/Ricksclip-/tools/check_midline_comments.py scripts > /dev/null || { echo MIDLINE_FAIL; exit 1; }
blender -b --factory-startup --python scripts/bl_dallas.py -- "$EP/assets/ph_dallas" build/tex "$EP/assets_prod" out_tmp > logs/dallas_fix2.log 2>&1
grep -q DALLAS_DONE logs/dallas_fix2.log && ! grep -q Traceback logs/dallas_fix2.log || { echo "BUILD_FAIL"; grep -A12 Traceback logs/dallas_fix2.log | head -30; exit 1; }
for f in dallas.blend dallas.glb dallas_lite.glb dallas_meta.json; do mv -f out_tmp/$f out/$f; done
echo SWAPPED; uptime >> logs/fix2_load.txt
blender -b out/dallas.blend --python scripts/bl_dallas_proof.py -- proof/fix2/bl 540 960 s5,s7,boards > logs/proof_fix2_bl.log 2>&1; grep "^PROOF\|Traceback" logs/proof_fix2_bl.log
uptime >> logs/fix2_load.txt
W=540 H=960 ONLY="s5 s7 boards" bash scripts/run_kit.sh > logs/kit_fix2.log 2>&1; grep KIT_TIME logs/kit_fix2.log
uptime >> logs/fix2_load.txt
echo FIX2_END
