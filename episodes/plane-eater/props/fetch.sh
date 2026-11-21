#!/usr/bin/env bash
# fetch.sh: downloads the plane-eater prop sources (git-ignored) into episodes/plane-eater/assets/. Re-runnable; skips files present.
set -euo pipefail
P="$(cd "$(dirname "$0")" && pwd)"; A="$(dirname "$P")/assets"
fetch_sketchfab() {   # $1 uid  $2 target file (copied from YFT/assets_prod/build_assets.sh)
  [ -s "$2" ] && return 0; mkdir -p "$(dirname "$2")"; url=""
  for try in 1 2 3 4 5 6 7 8; do
    url=$(curl -s "https://api.sketchfab.com/v3/models/$1/download" | python3 -I -c "import sys,json; print(json.load(sys.stdin)['glb']['url'])" 2>/dev/null) && [ -n "$url" ] && break
    echo "sketchfab $1: no url yet (429?), waiting 60 s"; sleep 60
  done
  [ -n "$url" ] || { echo "FETCH FAILED $1"; exit 1; }
  tmp=$(mktemp -d); curl -sfL "$url" -o "$tmp/m.zip"
  if file -b "$tmp/m.zip" | grep -qi "zip archive"; then (cd "$tmp" && unzip -oq m.zip && cp "$(find . -name '*.glb' | head -1)" "$2"); else cp "$tmp/m.zip" "$2"; fi; rm -rf "$tmp"
}
fetch_sketchfab c9cadc2f026946da8cf9715a683739e9 "$A/cessna/cessna172sp.glb"
echo FETCH_END
