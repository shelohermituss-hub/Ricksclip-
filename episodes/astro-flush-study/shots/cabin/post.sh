#!/bin/bash
# draft mp4s (ours with his sound, his, side by side), fluidity rows on the same ranges, 4 fps strips
cd /home/user/Ricksclip-; S=episodes/astro-flush-study/shots/cabin; R=references/look_match/astro_flush; O=$R/work/drafts/cabin; mkdir -p $O
for spec in "cab4 284 422 284 410" "bay5 411 499 423 494"; do set -- $spec; n=$1; a=$2; b=$3; ca=$4; cb=$5; N=$((b-a+1))
  ffmpeg -v error -y -framerate 30 -start_number $a -i $S/$n/out/stills/f_%05d.png -ss $(python3 -c "print($a/30)") -t $(python3 -c "print($N/30)") -i $R/ref/ref40.wav -map 0:v -map 1:a -c:v libx264 -pix_fmt yuv420p -crf 18 -c:a aac -shortest $O/${n}_ours.mp4
  ffmpeg -v error -y -framerate 30 -start_number $((a+1)) -i $R/ref/all/f_%04d.jpg -frames:v $N -ss $(python3 -c "print($a/30)") -t $(python3 -c "print($N/30)") -i $R/ref/ref40.wav -map 0:v -map 1:a -c:v libx264 -pix_fmt yuv420p -crf 18 -c:a aac -shortest $O/${n}_his.mp4
  ffmpeg -v error -y -i $O/${n}_ours.mp4 -i $O/${n}_his.mp4 -filter_complex "[0:v]scale=540:960[a];[1:v]scale=540:960[b];[a][b]hstack" -map 1:a -c:v libx264 -pix_fmt yuv420p -crf 20 -c:a aac $O/${n}_sbs.mp4
  # clean shot range only (no dissolve frames) for the fluidity rows
  ss=$(python3 -c "print(($ca-$a)/30)"); tt=$(python3 -c "print(($cb-$ca+1)/30)")
  echo "$n f$ca-$cb ours: $(python3 tools/measure/fluidity_clean.py $O/${n}_ours.mp4 "trim=start=$ss:duration=$tt,setpts=PTS-STARTPTS")"
  echo "$n f$ca-$cb his : $(python3 tools/measure/fluidity_clean.py $O/${n}_his.mp4 "trim=start=$ss:duration=$tt,setpts=PTS-STARTPTS")"
  ffmpeg -v error -y -i $O/${n}_sbs.mp4 -vf "fps=4,scale=270:240,tile=8x$(( (N/30*4+7)/8 ))" -frames:v 1 $O/${n}_strip.jpg
done
