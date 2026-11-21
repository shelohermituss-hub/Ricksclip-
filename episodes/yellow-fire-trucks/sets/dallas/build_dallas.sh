#!/usr/bin/env bash
# build_dallas.sh: rebuilds PLACE B, the DALLAS FIRE DEPT. STATION 14 yard at hot noon (set-builder 2026-11-21), from the downloads. Re-runnable (RunPod or a new session).
#   bash build_dallas.sh          -> out/dallas.blend (Blender final: noon light, trucks from assets_prod, story switches via dallas_api.set_boards),
#                                    out/dallas.glb + out/dallas_lite.glb + out/dallas_meta.json (kit: sets/dallas.js)
#   bash build_dallas.sh --proof  -> + the detail-gate stills (Blender Cycles 16 spp + OIDN and the three.js kit, single frames), numbers, DALLAS_SHEET.jpg
#   bash build_dallas.sh --proof-only   the stills, numbers and sheet from the saved build
# Needs: blender, python3 + PIL + numpy, node (kit only), assets_prod/out/truck.blend + truck.glb + paint_tin_*.glb (assets_prod/build_assets.sh).
# Downloads (git-ignored, CC0 Poly Haven) are fetched again if missing. Ends DALLAS_BUILD_END (and DALLAS_PROOF_END). No date or time goes into any image.
set -euo pipefail
T="$(cd "$(dirname "$0")" && pwd)"; EP="$(cd "$T/../.." && pwd)"; cd "$T"; mkdir -p logs out build/tex proof/bl proof/kit
[ -s "$EP/assets_prod/out/truck.blend" ] || { echo "assets_prod/out/truck.blend missing: run assets_prod/build_assets.sh first"; exit 1; }
if [ "${1:-}" != "--proof-only" ]; then
python3 scripts/fetch_dallas.py "$EP/assets" > logs/fetch.log 2>&1; grep -c " ok" logs/fetch.log; ! grep FAIL logs/fetch.log
python3 scripts/tex_dallas.py "$EP/assets/ph_dallas/tex" build/tex > logs/tex.log 2>&1; grep -q TEX_END logs/tex.log
python3 - "$T/scripts" <<'PY'
import sys; p = sys.argv[1] + '/'
src = open(p + 'bl_dallas.py').read(); hdr = src.split('A = sys.argv', 1)[0]   # keep the file's own header comment; rebuild the code from the three parts
open(p + 'bl_dallas.py', 'w').write(hdr.rsplit('import bpy', 1)[0] + open(p + '_head.py').read() + open(p + '_body.py').read() + open(p + '_tail.py').read())
PY
blender -b --factory-startup --python scripts/bl_dallas.py -- "$EP/assets/ph_dallas" build/tex "$EP/assets_prod" out > logs/dallas.log 2>&1 || true
grep -q DALLAS_DONE logs/dallas.log && ! grep -q Traceback logs/dallas.log || { echo "dallas FAILED (logs/dallas.log)"; grep -A12 Traceback logs/dallas.log | head -30; exit 1; }
grep -E "^MERGED|^DALLAS_TRIS|^GLB |LETTERS_FAIL|EXTRAS_FAIL" logs/dallas.log | cut -c1-160 || true
echo DALLAS_BUILD_END
fi
if [ "${1:-}" = "--proof" ] || [ "${1:-}" = "--proof-only" ]; then
  W=${W:-540}; H=${H:-960}
  blender -b out/dallas.blend --python scripts/bl_dallas_proof.py -- proof/bl $W $H ${CAMS_BL:-} > logs/proof_bl.log 2>&1 || true; grep "^PROOF" logs/proof_bl.log || true
  W=$W H=$H bash scripts/run_kit.sh > logs/kit.log 2>&1 || true; grep KIT_TIME logs/kit.log || true
  python3 scripts/numbers_sheet.py . "$T/DALLAS_SHEET.jpg" > logs/sheet.log 2>&1; tail -14 logs/sheet.log
  echo DALLAS_PROOF_END
fi
