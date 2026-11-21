#!/usr/bin/env bash
# Re-download the bark texture used by rick_tree.py (Poly Haven bark_brown_02, CC0, 1k). The tex/ folder is git-ignored.
set -e
cd "$(dirname "$0")"
mkdir -p tex
for m in diff_1k.jpg rough_1k.jpg nor_gl_1k.jpg; do
  [ -f tex/bark_brown_02_$m ] || curl -sfL -o tex/bark_brown_02_$m https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/bark_brown_02/bark_brown_02_$m
done
ls tex
