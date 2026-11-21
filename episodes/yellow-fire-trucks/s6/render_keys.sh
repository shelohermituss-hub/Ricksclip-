#!/usr/bin/env bash
# S6 board key frames (copy of s3/render_keys.sh): ONE frame per process, full size 1080x1920, up to 3 tries, each after waiting (max 2 min) for 3.8 GB free
# memory (the shared memory limit kills chrome). Each frame names its one-place film copy (make_film.py writes film_<place>.json): one place loaded per process.
# usage: bash render_keys.sh <place>:<frame> [<place>:<frame> ...]   log: logs/keys.log (one line per try), end line KEYS_END
cd "$(dirname "$0")"
mem() { awk '/MemAvailable/{print int($2/1024)}' /proc/meminfo; }
last=""
for pf in "$@"; do pl=${pf%%:*}; f=${pf##*:}; P=$(printf %05d $f)
  # the render reads out/plan/camera_baked.json: bake THIS place's film copy first (one bake at a time in this folder, never two films at once)
  if [ "$pl" != "$last" ] && [ ! -f key/f_$P.png ]; then python3 ../../../tools/film_plan.py check film_$pl.json > logs/bake_$pl.txt 2>&1; echo "bake $pl: $(grep -c FAIL logs/bake_$pl.txt) FAIL lines" >> logs/keys.log; last=$pl; fi
  for try in 1 2 3; do [ -f key/f_$P.png ] && break
    for w in $(seq 40); do [ $(mem) -gt 3800 ] && break; sleep 3; done
    node tools/render_s6.mjs film_$pl.json --frames $f --scale 1 --no-captions --stills-dir "$PWD/key" > logs/k_$f.log 2>&1
    echo "f$f $pl full try $try (free $(mem) MB): $(grep -h 'stills:\|crashed\|Timeout\|Error' logs/k_$f.log | head -1 | cut -c1-100)" >> logs/keys.log; done
done; echo KEYS_END >> logs/keys.log
