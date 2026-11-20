"""Tighten long gaps in a take (SKILL UPGRADES 4): every gap over MAXG is shortened to KEEP by cutting
only its quietest stretch (breaths, sighs and laughs survive). No time-stretch.
Usage: python tighten.py take.mp3 words_take.json out.wav
"""
import json, subprocess, sys
import numpy as np

SR, MAXG, KEEP, XF = 44100, 0.40, 0.28, 0.012
src, wjson, out = sys.argv[1:4]
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                     capture_output=True, check=True).stdout
a = np.frombuffer(raw, dtype=np.float32).copy()
words = json.load(open(wjson))
win = int(0.01 * SR)
env = np.sqrt(np.convolve(a * a, np.ones(win) / win, mode='same'))
cuts = []
for w0, w1 in zip(words, words[1:]):
    g = w1['s'] - w0['e']
    if g <= MAXG:
        continue
    cut = g - KEEP
    s0, s1 = int(w0['e'] * SR), int(w1['s'] * SR)
    n = int(cut * SR)
    if s1 - s0 <= n:
        continue
    # quietest window of length n inside the gap
    c = np.cumsum(np.concatenate([[0], env[s0:s1]]))
    sums = c[n:] - c[:-n]
    k = s0 + int(np.argmin(sums))
    cuts.append((k, k + n))
segs, pos, x = [], 0, int(XF * SR)
for k0, k1 in cuts:
    segs.append(a[pos:k0]); pos = k1
segs.append(a[pos:])
outa = segs[0]
for s in segs[1:]:
    if len(outa) > x and len(s) > x:
        r = np.linspace(0, 1, x, dtype=np.float32)
        outa = np.concatenate([outa[:-x], outa[-x:] * (1 - r) + s[:x] * r, s[x:]])
    else:
        outa = np.concatenate([outa, s])
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', out],
               input=outa.astype(np.float32).tobytes(), check=True)
print(json.dumps({'cuts': len(cuts), 'cut_total_s': round(sum(b - a_ for a_, b in cuts) / SR, 2),
                  'before_s': round(len(a) / SR, 2), 'after_s': round(len(outa) / SR, 2)}))
