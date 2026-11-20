#!/usr/bin/env bash
# cloud_setup.sh: make a fresh cloud container ready for the skill. Safe to run again at any time.
#   bash tools/cloud_setup.sh
# The cloud environment's setup script calls it when a session starts; run it by hand if `python tools/install.py --check` shows MISS.
set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"; cd "$ROOT"
# 1. Python parts (numpy and pillow are already in the image). opencv headless: there is no screen in the cloud.
python3 -c "import scipy, soundfile, cv2, faster_whisper" 2>/dev/null || pip install -q --root-user-action=ignore scipy soundfile opencv-python-headless faster-whisper || echo "cloud_setup: pip install failed"
# 2. Playwright: the image ships Chromium with a matching Playwright. Link that one in (a second copy from npm would not find the browser).
G="$(npm root -g 2>/dev/null)/playwright"
if [ -d "$G" ]; then
  for d in "$ROOT" "$ROOT/templates/threejs_film"; do mkdir -p "$d/node_modules"; [ -e "$d/node_modules/playwright" ] || ln -s "$G" "$d/node_modules/playwright"; done
else
  (cd templates/threejs_film && npm install --no-audit --no-fund && npx playwright install chromium) || echo "cloud_setup: npm install failed"
fi
# 3. Sound library index (the free sound pack in sound_pack/). The index holds absolute paths, so it is rebuilt here, never committed.
[ -f templates/sound_kit/library_index.csv ] || python3 templates/sound_kit/index_library.py --dur | tail -1
echo "cloud_setup done"
