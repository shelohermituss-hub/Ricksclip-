#!/usr/bin/env bash
# run_all.sh: per-frame node dumps (if missing) then the key frames of the given stretches, then KEYS_FILM.jpg
D="$(cd "$(dirname "$0")" && pwd)"; EP="$(cd "$D/../.." && pwd)"
for s in "$@"; do W=$(python3 -c "import json;w=json.load(open('$D/stretches.json'))['$s']['window'];print(w[0],w[1])")
  [ -f "$EP/$s/out/lock/nodes_dump.json" ] || bash "$D/dump_nodes.sh" "$s" $W; done
bash "$D/render_keys.sh" "$@"
