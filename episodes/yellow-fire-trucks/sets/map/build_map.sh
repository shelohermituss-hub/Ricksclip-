#!/usr/bin/env bash
# build_map.sh: rebuilds PLACE C, THE MAP (S4, line 7; set-builder 2026-11-21) from the downloads. Re-runnable (RunPod or a new session).
#   bash build_map.sh           -> out/map.blend (Blender final; controls scripts/map_api.py), out/map_meta.json, out/map_lite.glb + out/map_truck_tiny.glb (kit: sets/map.js)
#   bash build_map.sh --lite    -> only the kit copy from the saved out/map.blend
#   bash build_map.sh --proof   -> + detail-gate stills: Blender Cycles 16 spp (proof/bl) and kit (proof/kit/stills), proof/numbers.json, MAP_SHEET.jpg
# Needs: blender, python3 + PIL + numpy, node (kit only), assets_prod/out/truck_light.blend (assets_prod/build_assets.sh). Downloads (git-ignored; Poly Haven CC0,
# ambientCG CC0, us-atlas ISC, @fontsource OFL) are fetched again if missing. Ends MAP_BUILD_END (and MAP_PROOF_END). No date or time goes into any image.
set -euo pipefail
T="$(cd "$(dirname "$0")" && pwd)"; EP="$(cd "$T/../.." && pwd)"; cd "$T"; mkdir -p logs out build/tex proof/bl
[ -s "$EP/assets_prod/out/truck_light.blend" ] || { echo "assets_prod/out/truck_light.blend missing: run assets_prod/build_assets.sh first"; exit 1; }
if [ "${1:-}" != "--lite" ]; then
  python3 scripts/fetch_map.py "$EP/assets" > logs/fetch.log 2>&1; ! grep FAIL logs/fetch.log; grep -q FETCH_END logs/fetch.log
  python3 scripts/tex_map.py "$EP/assets/map" build/tex > logs/tex.log 2>&1; grep -q TEX_END logs/tex.log || { echo "tex FAILED (logs/tex.log)"; exit 1; }
  blender -b --factory-startup --python scripts/bl_map.py -- "$EP/assets/map" build/tex "$EP/assets_prod" out > logs/map.log 2>&1
  grep -q MAP_DONE logs/map.log && ! grep -q Traceback logs/map.log || { echo "map FAILED (logs/map.log)"; exit 1; }; grep -E "^MAP_TRIS" logs/map.log
fi
blender -b out/map.blend --python scripts/bl_map_lite.py -- out "$EP/assets_prod" > logs/lite.log 2>&1
grep -q LITE_DONE logs/lite.log && ! grep -q Traceback logs/lite.log || { echo "lite FAILED (logs/lite.log)"; exit 1; }; grep -E "^LITE_TRIS|^TINY_TRIS" logs/lite.log
echo MAP_BUILD_END
if [ "${1:-}" = "--proof" ]; then
  blender -b out/map.blend --python scripts/bl_map_proof.py -- proof/bl ${W:-540} ${H:-960} > logs/proof_bl.log 2>&1; grep "^PROOF" logs/proof_bl.log || true
  bash proof/run_kit.sh > logs/kit.log 2>&1; grep -E "KIT_TIME|PHFD" logs/kit.log || true
  python3 scripts/numbers_sheet.py . "$T/MAP_SHEET.jpg" > logs/sheet.log 2>&1; tail -12 logs/sheet.log
  echo MAP_PROOF_END
fi
