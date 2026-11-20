#!/usr/bin/env bash
# fake-surgery: render through the SHARED fair GPU queue of the Monopoly film (two GPU jobs at a time across both films, first come first served).
# Same arguments as templates/threejs_film/render_gpu.mjs. Never call render_gpu.mjs directly.
exec bash "$(cd "$(dirname "$0")/../../monopoly-escape/tools" && pwd)/gpu_render.sh" "$@"
