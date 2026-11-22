#!/usr/bin/env bash
# export_late.sh <stretch> <place> <base root> <frame...>: kit pieces visible at those frames -> <s>/out/lock/sets/<place>_late_f####.glb
R="$(cd "$(dirname "$0")/../../../.." && pwd)"; EP="$R/episodes/plane-eater"; S=$1; P=$2; B=$3; shift 3
for F in "$@"; do T=$(mktemp -d); sed "s/__F__/$F/; s/__BASE__/$B/" "$EP/look/film/export_late.js" > "$T/e.js"
  node "$R/templates/threejs_film/render_gpu.mjs" "$EP/$S/film.json" --frames "$F" --stills-dir "$T" --eval "$T/e.js" > "$T/log.txt" 2>&1
  python3 - "$T/log.txt" "$EP/$S/out/lock/sets/${P}_late_f$(printf %04d $F).glb" <<'PY'
import sys, json, base64
for l in open(sys.argv[1]):
    if l.startswith('eval '):
        d = json.loads(l[5:]); open(sys.argv[2], 'wb').write(base64.b64decode(d['b64'])); print('LATE', sys.argv[2], d['n'], 'roots'); break
else: print('NO EVAL LINE'); print(open(sys.argv[1]).read()[-1200:])
PY
  rm -rf "$T"; done
