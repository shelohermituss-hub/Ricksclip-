#!/usr/bin/env bash
# fetch_r3.sh: round-3 downloads (props-hero 2026-11-21): the five lost things of S6. Credits in assets/ASSETS.md. Re-runnable (skips files present).
# Poly Haven (CC0): rubber_boots, watering_can_metal_01 (glTF 1k + textures). Sketchfab (CC-BY 4.0): wagon, kite, tricycle (GLB via the download API).
set -uo pipefail
A="$(cd "$(dirname "$0")/../../assets" && pwd)"
ph() {   # $1 asset id: gltf 1k with its include files
  local d="$A/$1"; [ -s "$d/$1_1k.gltf" ] && return 0; mkdir -p "$d"
  curl -s "https://api.polyhaven.com/files/$1" | python3 -c "
import sys, json; g = json.load(sys.stdin)['gltf']['1k']['gltf']; print(g['url'])
for k, v in g.get('include', {}).items(): print(v['url'] + ' ' + k)" | while read -r u k; do
    if [ -z "${k:-}" ]; then curl -sfL "$u" -o "$d/$1_1k.gltf"; else mkdir -p "$d/$(dirname "$k")"; curl -sfL "$u" -o "$d/$k"; fi; done
}
sf() {   # $1 uid  $2 target
  [ -s "$2" ] && return 0; mkdir -p "$(dirname "$2")"; url=""
  for try in 1 2 3 4 5 6 7 8; do
    url=$(curl -s "https://api.sketchfab.com/v3/models/$1/download" | python3 -c "import sys,json; print(json.load(sys.stdin)['glb']['url'])" 2>/dev/null) && [ -n "$url" ] && break
    echo "sketchfab $1: no url yet (429?), waiting 60 s"; sleep 60
  done
  tmp=$(mktemp -d); curl -sfL "$url" -o "$tmp/m.zip"
  if file -b "$tmp/m.zip" | grep -qi "zip archive"; then (cd "$tmp" && unzip -oq m.zip && cp "$(find . -name '*.glb' | head -1)" "$2"); else cp "$tmp/m.zip" "$2"; fi; rm -rf "$tmp"
}
ph rubber_boots; ph watering_can_metal_01
sf 35d5166f87ac409b957b3209c406709f "$A/wagon/wagon.glb"
sf 881a6736d0eb4f53b38d75c5b03dc7fe "$A/kite/kite.glb"
sf d30c207f4c0246588f766b0dd49b459c "$A/tricycle/tricycle.glb"
ls -la "$A/rubber_boots" "$A/watering_can_metal_01" "$A/wagon" "$A/kite" "$A/tricycle"
echo FETCH_R3_END
