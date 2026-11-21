#!/usr/bin/env bash
# build_props.sh: plane-eater prop pipeline (re-runnable). bash build_props.sh [--proof | --proof2]  (--proof2 = only the round-2 props sheet)
#   fetch.sh (Sketchfab download, git-ignored) -> scripts/bl_cessna.py (out/cessna150*.{blend,glb}, out/cessna_meta.json)
#   --proof: scripts/bl_proof.py (Cycles 540x960 16 spp tiles + outline id) -> scripts/make_sheets.py (HERO_SHEET.jpg, STATES_SHEET.jpg)
set -euo pipefail
P="$(cd "$(dirname "$0")" && pwd)"; cd "$P"; mkdir -p out logs tiles
bash fetch.sh
blender -b --factory-startup --python scripts/bl_cessna.py -- ../assets/cessna/cessna172sp.glb out > logs/cessna.log 2>&1
grep -q CESSNA_DONE logs/cessna.log && ! grep -q Traceback logs/cessna.log || { echo "cessna FAILED (logs/cessna.log)"; exit 1; }
grep -E "^(INTACT|WINGOFF|FILL_FAIL)" logs/cessna.log || true
blender -b --factory-startup --python scripts/bl_props2.py -- out > logs/props2.log 2>&1   # round 2: small props
grep -q PROPS2_DONE logs/props2.log && ! grep -q Traceback logs/props2.log || { echo "props2 FAILED (logs/props2.log)"; exit 1; }
if [ "${1:-}" = "--proof" ]; then
  blender -b --factory-startup --python scripts/bl_proof.py -- out tiles > logs/proof.log 2>&1
  grep -q PROOF_DONE logs/proof.log || { echo "proof FAILED (logs/proof.log)"; exit 1; }
  python3 -I scripts/make_sheets.py "$P/tiles" "$P" | tee logs/sheets.log
fi
if [ "${1:-}" = "--proof" ] || [ "${1:-}" = "--proof2" ]; then
  blender -b --factory-startup --python scripts/bl_proof2.py -- out tiles > logs/proof2.log 2>&1
  grep -q PROOF2_DONE logs/proof2.log || { echo "proof2 FAILED (logs/proof2.log)"; exit 1; }
  python3 -I scripts/make_sheets2.py "$P/tiles" "$P" | tee logs/sheets2.log
fi
echo BUILD_PROPS_END
