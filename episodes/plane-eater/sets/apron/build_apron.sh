#!/usr/bin/env bash
# build_apron.sh: rebuilds THE AIRFIELD APRON (AERODROME DE VILLEBRUNE, plane-eater; set-builder 2026-11-21) from code only. Re-runnable (RunPod or a new session).
#   bash build_apron.sh           -> out/apron.blend (Blender final, Rick day light, apron_api.set_light day|dusk|winter), out/apron_lite.glb + out/apron_meta.json (kit: sets/apron.js)
#   bash build_apron.sh --proof   -> + proof/<cam>.png (4 plan stations, Cessna linked from props/out), outline, numbers, APRON_SHEET.jpg
# Needs: blender (bash tools/install_blender.sh), python3 + PIL + numpy + scipy; props/out/cessna150.blend (props/build_props.sh) for the proof only.
# No downloads: textures are painted by scripts/tex_apron.py; trees + grass = library/trees/rick_tree.py, library/grass/rick_grass.py. Ends APRON_BUILD_END (APRON_PROOF_END).
set -euo pipefail
T="$(cd "$(dirname "$0")" && pwd)"; EP="$(cd "$T/../.." && pwd)"; cd "$T"; mkdir -p logs out build/tex proof
python3 scripts/tex_apron.py build/tex > logs/tex.log 2>&1; grep -q TEX_END logs/tex.log
blender -b --factory-startup --python scripts/bl_apron.py -- build/tex out > logs/apron.log 2>&1
grep -q APRON_DONE logs/apron.log && ! grep -q Traceback logs/apron.log || { echo "apron FAILED (logs/apron.log)"; exit 1; }
grep -E "^APRON_TRIS|^ANCHORS" logs/apron.log
echo APRON_BUILD_END
if [ "${1:-}" = "--proof" ]; then
  W=${W:-540}; H=${H:-960}; SPP=${SPP:-16}
  blender -b out/apron.blend --python scripts/bl_apron_proof.py -- proof "$EP/props/out/cessna150.blend" $W $H $SPP > logs/proof.log 2>&1
  grep -q PROOF_DONE logs/proof.log || { echo "proof FAILED (logs/proof.log)"; exit 1; }; grep "^TILE" logs/proof.log
  python3 scripts/apron_sheet.py proof "$T/APRON_SHEET.jpg" > logs/sheet.log 2>&1; tail -2 logs/sheet.log
  echo APRON_PROOF_END
fi
