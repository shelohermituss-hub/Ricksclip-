#!/usr/bin/env bash
# Install Blender (Linux x64 tarball from download.blender.org) for cloud sessions. Re-runnable (idempotent).
# Usage: bash tools/install_blender.sh [version]      e.g. 5.3.0 ; default = newest blender-X.Y.Z-linux-x64 in /release
# Installs under /opt/blender if /opt is writable, else under $BLENDER_HOME or ~/.local/blender.
# Puts a `blender` link in /usr/local/bin (or ~/.local/bin). Prints the version at the end.
# Blender is PARKED by the rules (rules/parked/BLENDER_PARKED.md): this is for tests the user asked for.
set -euo pipefail
REL=https://download.blender.org/release
VER="${1:-}"
if [ -z "$VER" ]; then
  SER=$(curl -fsS "$REL/" | grep -o 'Blender[0-9]*\.[0-9]*/' | sort -uV | tail -1 | tr -d /)
  VER=$(curl -fsS "$REL/$SER/" | grep -o 'blender-[0-9.]*-linux-x64\.tar\.xz' | sort -uV | tail -1 \
        | sed 's/blender-\(.*\)-linux-x64.tar.xz/\1/')
fi
SER="Blender${VER%.*}"
if [ -w /opt ] || [ -w /opt/blender ] 2>/dev/null; then ROOT=/opt/blender; BIN=/usr/local/bin
else ROOT="${BLENDER_HOME:-$HOME/.local/blender}"; BIN="$HOME/.local/bin"; fi
DIR="$ROOT/blender-$VER-linux-x64"
mkdir -p "$ROOT" "$BIN"
if [ ! -x "$DIR/blender" ]; then
  T0=$(date +%s)
  TAR="$ROOT/blender-$VER-linux-x64.tar.xz"
  echo "Downloading $REL/$SER/blender-$VER-linux-x64.tar.xz"
  curl -fL --retry 3 -o "$TAR.part" "$REL/$SER/blender-$VER-linux-x64.tar.xz"
  mv "$TAR.part" "$TAR"
  tar -xJf "$TAR" -C "$ROOT"
  rm -f "$TAR"
  echo "Installed in $(( $(date +%s) - T0 )) s; disk: $(du -sh "$DIR" | cut -f1)"
else
  echo "Already installed: $DIR"
fi
# Blender needs a few X/GL libraries even in background mode
if ! "$DIR/blender" -b --version >/dev/null 2>&1 || ! ldconfig -p | grep -q "libEGL.so.1"; then   # EEVEE needs libEGL even with no GPU
  if command -v apt-get >/dev/null; then
    (apt-get update -qq && apt-get install -y -qq libxi6 libxxf86vm1 libxfixes3 libxrender1 libxkbcommon0 libsm6 libgl1 libegl1 libgl1-mesa-dri) >/dev/null 2>&1 || true   # EEVEE needs libEGL (software GL, Mesa)
  fi
fi
ln -sf "$DIR/blender" "$BIN/blender"
"$BIN/blender" -b --version 2>/dev/null | head -1
