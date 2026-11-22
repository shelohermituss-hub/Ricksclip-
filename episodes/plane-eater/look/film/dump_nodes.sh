#!/usr/bin/env bash
# dump_nodes.sh <stretch> <f0> <f1> [base root to skip, default villebrune_apron; __none__ = dump the base set too]: per-frame visibility + matrices of the stretch's script-driven pieces from the kit page -> <s>/out/lock/nodes_dump.json
R="$(cd "$(dirname "$0")/../../../.." && pwd)"; EP="$R/episodes/plane-eater"; S=$1; T=$(mktemp -d)
sed "s/__F0__/$2/; s/__F1__/$3/; s/__BASE__/${4:-villebrune_apron}/" "$EP/look/film/dump_nodes.js" > "$T/d.js"
node "$R/templates/threejs_film/render_gpu.mjs" "$EP/$S/film.json" --frames "$2" --stills-dir "$T" --eval "$T/d.js" > "$T/log.txt" 2>&1
python3 - "$T/log.txt" "$EP/$S/out/lock/nodes_dump.json" <<'PY'
import sys, json
for l in open(sys.argv[1]):
    if l.startswith('eval '): d = json.loads(json.loads(l[5:]) if l[5:].lstrip().startswith('"') else l[5:]); json.dump(d, open(sys.argv[2], 'w')); print('DUMP', sys.argv[2], len(d['nodes']), 'changing nodes'); break
else: print('NO EVAL LINE'); print(open(sys.argv[1]).read()[-1500:])
PY
rm -rf "$T"
