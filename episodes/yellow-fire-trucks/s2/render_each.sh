#!/usr/bin/env bash
# one frame per render process (several frames in one process crashed the page: "Target crashed", memory with ~7 helpers on the machine)
cd "$(dirname "$0")"; for f in ${FR:-292 344 386 418 440 458}; do FR=$f bash render_key.sh > logs/render_key.out 2>&1; grep -v "Failed to load" logs/key.log | grep -i "stills\|crash" | cut -c1-60; done; echo EACH_END
