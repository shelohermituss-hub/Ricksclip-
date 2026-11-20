#!/usr/bin/env bash
# build_town.sh: rebuilds PLACE A, the town of PINE HOLLOW (set-builder 2026-11-20), from the downloads. Re-runnable (RunPod or a new session).
#   bash build_town.sh           -> out/town.blend (Blender final: both lights via town_api.set_light, trucks from assets_prod), out/town.glb + out/town_meta.json (kit: sets/town.js)
#   bash build_town.sh --proof   -> + the detail-gate stills: Blender Cycles (proof/bl) and three.js kit (proof/kit/stills), numbers, TOWN_SHEET.jpg
# Needs: blender (bash tools/install_blender.sh), python3 + PIL + numpy, node (kit only), assets_prod/out/truck.blend + truck.glb (assets_prod/build_assets.sh).
# Downloads (git-ignored, CC0 Poly Haven) are fetched again if missing. Ends TOWN_BUILD_END (and TOWN_PROOF_END). No date or time goes into any image.
set -euo pipefail
T="$(cd "$(dirname "$0")" && pwd)"; EP="$(cd "$T/../.." && pwd)"; cd "$T"; mkdir -p logs out build/tex proof/bl
[ -s "$EP/assets_prod/out/truck.blend" ] || { echo "assets_prod/out/truck.blend missing: run assets_prod/build_assets.sh first"; exit 1; }
python3 scripts/fetch_town.py "$EP/assets" > logs/fetch.log 2>&1; grep -c " ok" logs/fetch.log; ! grep FAIL logs/fetch.log
python3 scripts/tex_town.py "$EP/assets/ph_town/tex" build/tex > logs/tex.log 2>&1; grep -q TEX_END logs/tex.log
blender -b --factory-startup --python scripts/bl_town.py -- "$EP/assets/ph_town" build/tex "$EP/assets_prod" out > logs/town.log 2>&1
grep -q TOWN_DONE logs/town.log && ! grep -q Traceback logs/town.log || { echo "town FAILED (logs/town.log)"; exit 1; }
grep -E "^MERGED|^TOWN_TRIS|^GLB_" logs/town.log | cut -c1-160
echo TOWN_BUILD_END
if [ "${1:-}" = "--proof" ]; then
  W=${W:-540}; H=${H:-960}
  for k in am du; do blender -b out/town.blend --python scripts/bl_town_proof.py -- proof/bl $k $W $H > logs/proof_bl_$k.log 2>&1; grep "^PROOF" logs/proof_bl_$k.log || true; done
  W=$W H=$H TIME2=1 bash proof/run_kit.sh > logs/kit.log 2>&1; grep KIT_TIME logs/kit.log || true
  python3 scripts/numbers_sheet.py . "$T/TOWN_SHEET.jpg" > logs/sheet.log 2>&1; tail -20 logs/sheet.log
  echo TOWN_PROOF_END
fi
