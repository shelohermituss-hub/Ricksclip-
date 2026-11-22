#!/usr/bin/env bash
# Whole-film draft: stretch drafts end to end (s3 and s4 start on the last frame of the previous stretch: drop that duplicate),
# + the mix (sound/mix.wav) if present, else the voice. Half size, marked DRAFT.
cd "$(dirname "$0")/.."
A=voice/voice.wav; [ -f sound/mix.wav ] && A=sound/mix.wav
ffmpeg -v error -y -i s1/draft.mp4 -i s2/draft.mp4 -i s3/draft.mp4 -i s4/draft.mp4 -i s5/draft.mp4 -i $A -filter_complex \
"[0:v]setpts=PTS-STARTPTS[a];[1:v]setpts=PTS-STARTPTS[b];[2:v]trim=start_frame=1,setpts=PTS-STARTPTS[c];[3:v]trim=start_frame=1,setpts=PTS-STARTPTS[d];[4:v]setpts=PTS-STARTPTS[e];\
[a][b][c][d][e]concat=n=5:v=1:a=0,tpad=stop_mode=clone:stop=2,drawtext=text='BROUILLON - non final':x=12:y=12:fontsize=18:fontcolor=white@0.8:box=1:boxcolor=black@0.4[v]" \
  -map "[v]" -map 5:a -c:v libx264 -crf 20 -pix_fmt yuv420p -c:a aac -b:a 192k -t 34.067 draft/FILM_DRAFT_v2.mp4
ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -show_entries format=duration -of csv=p=0 draft/FILM_DRAFT_v2.mp4
ffmpeg -v error -y -i draft/FILM_DRAFT_v2.mp4 -vf "fps=2,scale=135:-1,tile=17x4" -frames:v 1 draft/strip_2fps.jpg
