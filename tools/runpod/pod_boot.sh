#!/usr/bin/env bash
# Boot script for a RunPod GPU pod (passed base64 in BOOT_B64, the server in SERVER_B64). Logs to $WORK/boot.log. Re-runnable.
# With a persistent volume at /workspace (a pod that is STOPPED, not terminated, keeps it and keeps its id, so its proxy address stays the same):
#   Blender is installed once into /workspace/blender, the job files live in /workspace/work (POD_ROOT). Without a volume both go to /opt and /work.
VOL=/workspace; [ -d "$VOL" ] && [ -w "$VOL" ] || VOL=""
export POD_ROOT="${VOL:+$VOL/work}"; POD_ROOT="${POD_ROOT:-/work}"; mkdir -p "$POD_ROOT"
exec > >(tee -a "$POD_ROOT/boot.log") 2>&1
echo "$SERVER_B64" | base64 -d > /tmp/pod_server.py
python3 /tmp/pod_server.py &            # answers /health at once; blender=missing until the install below ends
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq && apt-get install -y -qq libxi6 libxxf86vm1 libxfixes3 libxrender1 libxkbcommon0 libsm6 libgl1 libegl1 libglu1-mesa xz-utils curl ffmpeg >/dev/null
pip install -q numpy pillow scipy opencv-python-headless
VER="${BLENDER_VER:-5.3.0}"; SER="${VER%.*}"; BDIR="${VOL:-/opt}/blender-$VER"
if [ ! -x "$BDIR/blender" ]; then
  curl -fsSL --retry 3 -o /tmp/b.tar.xz "https://download.blender.org/release/Blender$SER/blender-$VER-linux-x64.tar.xz"
  mkdir -p "$BDIR" && tar -xJf /tmp/b.tar.xz -C "$BDIR" --strip-components=1 && rm -f /tmp/b.tar.xz
fi
ln -sf "$BDIR/blender" /usr/local/bin/blender
blender -b --version | head -1; echo BOOT_DONE
wait
