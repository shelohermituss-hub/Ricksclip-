#!/usr/bin/env bash
# S3 board key frames: ONE frame per process, up to 5 tries each, each after waiting for 3.8 GB of free memory (the shared memory limit kills chrome when other helpers' Blender runs peak).
# usage: bash render_keys.sh <film json> <frame> [<frame> ...]   log: logs/keys.log, end line KEYS_END
cd "$(dirname "$0")"; FJ=$1; shift
for f in "$@"; do for try in 1 2 3 4 5; do
  for w in $(seq 60); do [ $(awk '/MemAvailable/{print int($2/1024)}' /proc/meminfo) -gt 3800 ] && break; sleep 3; done   # wait (max 3 min) for 3.8 GB free
  [ -f key/f_$(printf %05d $f).png ] && break
  node tools/render_s3.mjs $FJ --frames $f --scale 1 --no-captions --stills-dir "$PWD/key" > logs/k_$f.log 2>&1
  echo "f$f try $try: $(grep -h 'stills:\|crashed\|Timeout' logs/k_$f.log | head -1 | cut -c1-90)" >> logs/keys.log
done; done; echo KEYS_END >> logs/keys.log
