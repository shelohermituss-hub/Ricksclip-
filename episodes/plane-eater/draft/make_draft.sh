#!/usr/bin/env bash
# Whole-film draft: the 5 stretch drafts (video only) end to end + the locked voice once. Half size, marked DRAFT.
cd "$(dirname "$0")/.."
L=draft/list.txt; : > $L
for s in s1 s2 s3 s4 s5; do echo "file '../$s/draft.mp4'" >> $L; done
ffmpeg -v error -y -f concat -safe 0 -i $L -i voice/voice.wav -map 0:v -map 1:a \
  -vf "drawtext=text='BROUILLON - non final':x=12:y=12:fontsize=18:fontcolor=white@0.8:box=1:boxcolor=black@0.4" \
  -c:v libx264 -crf 20 -pix_fmt yuv420p -c:a aac -b:a 160k -shortest draft/FILM_DRAFT_v1.mp4
ffprobe -v error -show_entries format=duration -of csv=p=0 draft/FILM_DRAFT_v1.mp4
ffmpeg -v error -y -i draft/FILM_DRAFT_v1.mp4 -vf "fps=2,scale=135:-1,tile=17x4" -frames:v 1 draft/strip_2fps.jpg
