"""Give a voice take room to breathe (CB 2026-11-16: "you trim too much. somewords are get cut out to quick. no space for pause").
Never removes audio. At every sentence end (word ending . ! ?) whose gap is shorter than MIN_SENT seconds, and every comma gap
shorter than MIN_COMMA, it INSERTS digital silence at the quietest 10 ms point inside the gap (only if that point is really quiet),
so word tails and breaths are never touched.
Usage: python tools/voice_breathe.py in.wav words.json out.wav [MIN_SENT=0.45] [MIN_COMMA=0.22]"""
import sys, json, subprocess, numpy as np
SR = 44100
src, wj, out = sys.argv[1:4]
MIN_SENT = float(sys.argv[4]) if len(sys.argv) > 4 else 0.45
MIN_COMMA = float(sys.argv[5]) if len(sys.argv) > 5 else 0.22
a = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                                 capture_output=True, check=True).stdout, dtype=np.float32)
w = json.load(open(wj)); win = int(0.01 * SR)
env = np.sqrt(np.convolve(a * a, np.ones(win) / win, mode='same'))
quiet = np.percentile(env, 20)
ins = []
for x, y in zip(w, w[1:]):
    t = x['w'].strip()
    need = MIN_SENT if t.endswith(('.', '!', '?', '."', '!"', '?"')) else MIN_COMMA if t.endswith((',', ',"', ':', ';')) else 0
    g = y['s'] - x['e']
    if need == 0 or g >= need: continue
    # search a bit wider than whisper's gap (its word ends are often early)
    s0, s1 = int((x['e'] - 0.05) * SR), int((y['s'] + 0.05) * SR)
    if s1 - s0 < win: continue
    k = s0 + int(np.argmin(env[s0:s1]))
    if env[k] > quiet * 1.5: continue          # no truly quiet point: leave it alone
    ins.append((k, need - max(g, 0)))
pieces, pos, added = [], 0, 0.0
for k, d in sorted(ins):
    pieces += [a[pos:k], np.zeros(int(d * SR), np.float32)]; pos = k; added += d
pieces.append(a[pos:]); y = np.concatenate(pieces)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', out], input=y.tobytes(), check=True)
print(json.dumps({'inserted': len(ins), 'added_s': round(added, 2), 'before_s': round(len(a) / SR, 2), 'after_s': round(len(y) / SR, 2)}))
