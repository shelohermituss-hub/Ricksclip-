#!/usr/bin/env bash
# build_assets.sh: rebuilds the PRODUCTION asset pack of "Why Fire Trucks Turned Yellow" from the downloads (re-runnable; RunPod or a new session).
#   bash build_assets.sh            -> out/truck.{glb,blend}, out/gun.{glb,blend}, out/compressor.{glb,blend}, out/*_meta.json, out/wear.png, out/newspaper.png
#   bash build_assets.sh --proof    -> + the single-frame proof tiles (Blender Cycles + three.js kit), props/ASSET_PACK.jpg and (round 2) props/PROPS_R2.jpg
#   round 2 adds: out/truck_light.{glb,blend}, out/milk_van, hubcap, milk_bottle, milk_crate, lunch_box, lemon, paint_tin_{lemon,lime,red}, mug, ribbon_set, plaster .{glb,blend}
# Needs: blender on PATH (bash tools/install_blender.sh), python3 with PIL + numpy + scipy (tools/cloud_setup.sh), node (kit tiles only).
# Downloads (git-ignored) are fetched again if missing: Sketchfab GET /v3/models/<uid>/download (through the proxy, no key) -> glb.url; Poly Haven files API.
# Log lines go to logs/*.log; the run ends with the line BUILD_ASSETS_END (and PROOF_END with --proof). No date or time goes into any image.
set -euo pipefail
AP="$(cd "$(dirname "$0")" && pwd)"; EP="$(dirname "$AP")"; A="$EP/assets"; cd "$AP"; mkdir -p logs build/tex_src build/tex out
fetch_sketchfab() {   # $1 uid  $2 target file
  [ -s "$2" ] && return 0; mkdir -p "$(dirname "$2")"; url=""
  for try in 1 2 3 4 5 6 7 8; do
    url=$(curl -s "https://api.sketchfab.com/v3/models/$1/download" | python3 -c "import sys,json; print(json.load(sys.stdin)['glb']['url'])" 2>/dev/null) && [ -n "$url" ] && break
    echo "sketchfab $1: no url yet (429?), waiting 60 s"; sleep 60
  done
  tmp=$(mktemp -d); curl -sfL "$url" -o "$tmp/m.zip"
  if file -b "$tmp/m.zip" | grep -qi "zip archive"; then (cd "$tmp" && unzip -oq m.zip && cp "$(find . -name '*.glb' | head -1)" "$2"); else cp "$tmp/m.zip" "$2"; fi; rm -rf "$tmp"
}
fetch_ph() {          # $1 url  $2 target
  [ -s "$2" ] && return 0; mkdir -p "$(dirname "$2")"; curl -sfL "$1" -o "$2"
}
fetch_sketchfab 9548e406e29e49e18a7ea39a4de1111d "$A/alf_1940s/alf_1940s.glb"
fetch_sketchfab bbeebeb544e44045aa721f652ba2033a "$A/spray_gun/spray_gun.glb"
fetch_sketchfab e0401b9109d9480dabedcefba5d7c1f2 "$A/air_compressor/air_compressor.glb"
# round 2 (props-hero): the API answers 429 "Too many requests" after ~4 downloads in a row: fetch_sketchfab waits and retries
for t in 45c4e2166c8a4cbc88f04ae404fa9a02:step_van 03c0408215684e1fb2395a49ed8a1e90:lunch_box 4d41836da54b4595bf228481306622dc:lemon b9f7df7222034d52b496e4e3a7c21dbb:paint_can \
         2318ed5e22a2420a9ddaa914333f8fbf:scissors c89fa8b5390145488a28c41ec54ccc8d:mug 79847abac75a4211a4f072c45516fbea:stool 5e8d71045e2040ba8f6619d86d204cf5:milk_bottle \
         489a6f095dc44bb1b279ed58e5bb3571:milk_crate; do fetch_sketchfab "${t%%:*}" "$A/${t#*:}/${t#*:}.glb"; done
PH=https://dl.polyhaven.org/file/ph-assets
fetch_ph $PH/HDRIs/hdr/2k/kloofendal_43d_clear_puresky_2k.hdr "$A/polyhaven/kloofendal_43d_clear_puresky.hdr"
fetch_ph $PH/HDRIs/hdr/2k/industrial_sunset_02_2k.hdr "$A/polyhaven/industrial_sunset_02.hdr"
for m in diff:jpg nor_gl:jpg rough:jpg; do k=${m%%:*}; fetch_ph "$PH/Textures/jpg/2k/concrete_floor_worn_001/concrete_floor_worn_001_${k}_2k.jpg" "$A/polyhaven/concrete_floor_worn_001_${k}_2k.jpg"; done

B="blender -b --factory-startup --python"
for t in alf:alf_1940s/alf_1940s.glb gun:spray_gun/spray_gun.glb comp:air_compressor/air_compressor.glb; do
  $B scripts/bl_extract.py -- "$A/${t#*:}" build/tex_src "${t%%:*}" > "logs/extract_${t%%:*}.log" 2>&1
  grep -q EXTRACT_DONE "logs/extract_${t%%:*}.log" || { echo "extract ${t%%:*} FAILED"; exit 1; }
done
python3 scripts/tex_make.py build/tex_src build/tex | tee logs/tex.log
for f in wear newspaper kraft price_card truck_letters truck_letters_e2 truck_letters_dal14 truck_letters_dal22 van_decal can_lemon can_lime can_red; do cp build/tex/$f.png out/; done
$B scripts/bl_truck.py -- "$A/alf_1940s/alf_1940s.glb" build/tex out > logs/truck.log 2>&1
grep -q TRUCK_DONE logs/truck.log && ! grep -q Traceback logs/truck.log || { echo "truck FAILED (logs/truck.log)"; exit 1; }
$B scripts/bl_props.py -- "$A/spray_gun/spray_gun.glb" "$A/air_compressor/air_compressor.glb" build/tex out > logs/props.log 2>&1
grep -q PROPS_DONE logs/props.log && ! grep -q Traceback logs/props.log || { echo "props FAILED (logs/props.log)"; exit 1; }
$B scripts/bl_light.py -- out 35000 > logs/light.log 2>&1
grep -q LIGHT_DONE logs/light.log && ! grep -q Traceback logs/light.log || { echo "light truck FAILED (logs/light.log)"; exit 1; }
$B scripts/bl_props2.py -- "$A" build/tex out > logs/props2.log 2>&1
grep -q PROPS2_DONE logs/props2.log && ! grep -q Traceback logs/props2.log || { echo "props2 FAILED (logs/props2.log)"; exit 1; }
grep -E "^TRUCK|^GLB|^WHEELS|^DOOR|^BEACON|^MASKED|^R2" logs/truck.log; grep -E "^GUN|^COMP" logs/props.log; grep -E "^LIGHT" logs/light.log; grep -E "^PROP2" logs/props2.log
echo BUILD_ASSETS_END
if [ "${1:-}" = "--proof" ]; then
  mkdir -p proof/tiles
  $B scripts/bl_proof.py -- truck . proof/tiles 800 600 > logs/proof_truck.log 2>&1
  $B scripts/bl_proof.py -- props . proof/tiles 800 600 > logs/proof_props.log 2>&1
  grep -h "^PROOF " logs/proof_truck.log logs/proof_props.log
  bash proof/run_kit.sh > logs/kit.log 2>&1; grep KIT_TIME logs/kit.log
  python3 scripts/sheet.py . "$EP/props/ASSET_PACK.jpg" > logs/sheet.log 2>&1; tail -16 logs/sheet.log
  mkdir -p proof/tiles_r2
  for g in hero fleet props; do $B scripts/bl_proof2.py -- $g . proof/tiles_r2 > logs/proof2_$g.log 2>&1; grep -h "^PROOF " logs/proof2_$g.log; done
  python3 scripts/sheet2.py . "$EP/props/PROPS_R2.jpg" > logs/sheet2.log 2>&1; tail -20 logs/sheet2.log
  echo PROOF_END
fi
