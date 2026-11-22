#!/usr/bin/env bash
# Rebuild the private reference folder from the user's video (it is git-ignored and lost with the container).
# Usage: bash episodes/astro-flush-study/refs/restore_refs.sh "<path to Why_Astronauts_Can_t_Flush_in_Space.mp4>"
set -e; R="$(cd "$(dirname "$0")/../../.." && pwd)"; D="$R/references/look_match/astro_flush/ref"; mkdir -p "$D/all" "$D/full2" "$D/f2"
cp "$1" "$D/ref_full.mp4"
ffmpeg -v error -y -i "$D/ref_full.mp4" -t 40 -c copy "$D/ref40.mp4"
ffmpeg -v error -y -i "$D/ref40.mp4" -vf "scale=540:960" -q:v 4 "$D/all/f_%04d.jpg"      # file number = frame + 1
ffmpeg -v error -y -i "$D/ref40.mp4" -vf "fps=2" -q:v 2 "$D/full2/t_%03d.jpg"             # one per 0.5 s, 1080x1920
ffmpeg -v error -y -i "$D/ref40.mp4" -ac 1 -ar 16000 "$D/ref40.wav"
cp "$R/episodes/astro-flush-study/refs/words_ref.json" "$D/words.json"
echo "reference restored: $(ls "$D/all" | wc -l) frames in $D/all"
