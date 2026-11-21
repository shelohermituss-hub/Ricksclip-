#!/usr/bin/env bash
# Boot script for a RunPod GPU pod (passed base64 in the env var BOOT_B64 with the server in SERVER_B64): install what Blender needs, Blender itself,
# the grade's Python parts, then start tools/runpod/pod_server.py on port 8000. Logs to /work/boot.log. Re-runnable.
mkdir -p /work; exec > >(tee -a /work/boot.log) 2>&1
echo "$SERVER_B64" | base64 -d > /work/pod_server.py
python3 /work/pod_server.py &            # the server answers /health at once; blender=missing until the install below ends
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq && apt-get install -y -qq libxi6 libxxf86vm1 libxfixes3 libxrender1 libxkbcommon0 libsm6 libgl1 libegl1 libglu1-mesa xz-utils curl >/dev/null
pip install -q numpy pillow scipy
VER="${BLENDER_VER:-5.3.0}"; SER="${VER%.*}"
curl -fsSL --retry 3 -o /tmp/b.tar.xz "https://download.blender.org/release/Blender$SER/blender-$VER-linux-x64.tar.xz"
mkdir -p /opt/blender && tar -xJf /tmp/b.tar.xz -C /opt/blender --strip-components=1 && ln -sf /opt/blender/blender /usr/local/bin/blender
blender -b --version | head -1; echo BOOT_DONE
wait
