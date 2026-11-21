#!/usr/bin/env bash
# ONE frame per process into frames/ (WITH captions, the clip's own frames), each after waiting (max 2 min) for 3.8 GB free memory, up to 4 tries
# (s3/render_keys.sh method: other helpers' Blender peaks kill chrome). usage: bash render_frames.sh <a-b | f f f ...>  log logs/frames.log, end FRAMES_END
cd "$(dirname "$0")"; K=../../../templates/threejs_film/render_gpu.mjs
mem() { awk '/MemAvailable/{print int($2/1024)}' /proc/meminfo; }
L=(); for x in "$@"; do if [[ $x == *-* ]]; then L+=($(seq ${x%-*} ${x#*-})); else L+=($x); fi; done
for f in "${L[@]}"; do P=$(printf %05d $f)
  for try in 1 2 3 4; do [ -f frames/f_$P.png ] && break
    for w in $(seq 40); do [ $(mem) -gt 3800 ] && break; sleep 3; done
    node $K film.json --frames $f --scale 0.5 --grab fast --grab-timeout 180 --stills-dir "$PWD/frames" > logs/f_one.log 2>&1
    [ -f frames/f_$P.png ] || echo "f$f try $try failed (free $(mem) MB): $(grep -h 'crashed\|Timeout' logs/f_one.log | head -1 | cut -c1-60)" >> logs/frames.log; done
  [ -f frames/f_$P.png ] || echo "f$f MISSING" >> logs/frames.log
done; echo FRAMES_END >> logs/frames.log
