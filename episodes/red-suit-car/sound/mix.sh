#!/usr/bin/env bash
# red-suit-car S1 sound: library samples only (sound_pack, licences in sound_pack/LICENSES.md), every action has a sound on its frame.
# Output: sound/mix.wav, 5.0 s, about -16 LUFS. Run from the repo root: bash episodes/red-suit-car/sound/mix.sh
set -e
S=sound_pack/sfx; M="sound_pack/music/tension/Kevin MacLeod - Dances and Dames.mp3"; O=episodes/red-suit-car/sound
# cue: file | start seconds (film frame / 30) | volume
CUES=(
"$S/impact/kenney-impact-sounds__impactMetal_light_000.ogg|0.10|0.7"      # f3 door latch
"$S/whoosh_swish/kenney-rpg-audio__clothBelt.ogg|0.14|0.45"               # door swings open
"$S/whoosh_swish/kenney-rpg-audio__cloth1.ogg|1.02|0.6"                    # f31 swings his legs out
"$S/footsteps/kenney-impact-sounds__footstep_concrete_000.ogg|1.45|0.85"   # f44 step 1
"$S/footsteps/kenney-impact-sounds__footstep_concrete_001.ogg|1.85|0.85"   # f56 step 2
"$S/footsteps/kenney-impact-sounds__footstep_concrete_003.ogg|2.25|0.55"   # f68 plants, chest out
"$S/whoosh_swish/kenney-rpg-audio__cloth2.ogg|2.70|0.4"                    # f81 hand up to the hat
"$S/impact/kenney-impact-sounds__impactGlass_light_002.ogg|2.93|0.8"       # f88 the gold hat flashes
"$S/whoosh_swish/kenney-rpg-audio__cloth3.ogg|3.30|0.5"                    # f99 backhand to the door
"$S/impact/kenney-impact-sounds__impactMetal_heavy_001.ogg|3.76|1.0"       # f113 door slam
"$S/impact/kenney-impact-sounds__impactPlate_heavy_000.ogg|3.77|0.45"      # slam body
)
IN=(-i "$M"); F="[0:a]atrim=0:5,volume=0.32,afade=t=in:d=0.25,afade=t=out:st=4.5:d=0.5[m];"; L="[m]"
for i in "${!CUES[@]}"; do IFS='|' read -r f s v <<< "${CUES[$i]}"; IN+=(-i "$f"); k=$((i+1)); ms=$(python3 -c "print(int($s*1000))")
  F+="[$k:a]aresample=48000,volume=$v,adelay=${ms}|${ms}[c$k];"; L+="[c$k]"; done
F+="${L}amix=inputs=$(( ${#CUES[@]} + 1 )):normalize=0,atrim=0:5,volume=3.2,alimiter=limit=0.84:level=false[out]"
ffmpeg -y -loglevel error "${IN[@]}" -filter_complex "$F" -map "[out]" -ar 48000 -ac 2 "$O/mix.wav"
ffmpeg -hide_banner -nostats -i "$O/mix.wav" -af ebur128=peak=true -f null - 2>&1 | grep -E "I:|Peak:" | tail -2
