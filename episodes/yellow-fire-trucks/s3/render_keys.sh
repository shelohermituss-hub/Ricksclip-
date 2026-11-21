#!/usr/bin/env bash
# S3 board key frames: ONE frame per process. Full size (1080x1920) up to 3 tries, each after waiting (max 2 min) for 3.8 GB of free memory: the shared memory
# limit kills chrome when other helpers' Blender runs peak. If all 3 fail, the frame is rendered at --scale 0.5 into key/half/ and the log says so.
# usage: bash render_keys.sh <film json> <frame> [<frame> ...]   log: logs/keys.log (one line per try), end line KEYS_END
cd "$(dirname "$0")"; FJ=$1; shift
mem() { awk '/MemAvailable/{print int($2/1024)}' /proc/meminfo; }
for f in "$@"; do P=$(printf %05d $f)
  for try in 1 2 3; do [ -f key/f_$P.png ] && break
    for w in $(seq 40); do [ $(mem) -gt 3800 ] && break; sleep 3; done
    node tools/render_s3.mjs $FJ --frames $f --scale 1 --no-captions --stills-dir "$PWD/key" > logs/k_$f.log 2>&1
    echo "f$f full try $try (free $(mem) MB): $(grep -h 'stills:\|crashed\|Timeout' logs/k_$f.log | head -1 | cut -c1-80)" >> logs/keys.log; done
  if [ ! -f key/f_$P.png ]; then for try in 1 2; do [ -f key/half/f_$P.png ] && break
    node tools/render_s3.mjs $FJ --frames $f --scale 0.5 --no-captions --stills-dir "$PWD/key/half" > logs/k_$f.log 2>&1
    echo "f$f HALF try $try: $(grep -h 'stills:\|crashed\|Timeout' logs/k_$f.log | head -1 | cut -c1-80)" >> logs/keys.log; done; fi
done; echo KEYS_END >> logs/keys.log
