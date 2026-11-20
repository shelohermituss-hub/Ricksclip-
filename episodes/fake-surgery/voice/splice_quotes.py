"""Replace each quote in voice2.wav with a fix take (character voice). Cuts sit mid-gap before/after the quote;
the fix is trimmed to its speech (+60 ms) and loudness-matched to the replaced speech; 12 ms crossfades.
Usage: python splice_quotes.py base.wav words.json out.wav "first word idx:last word idx:fix.mp3:fix_s0:fix_s1" ..."""
import sys, json, subprocess, numpy as np
SR = 44100; XF = int(0.012*SR)
def load(p): return np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',p,'-ac','1','-ar',str(SR),'-f','f32le','-'],capture_output=True,check=True).stdout,dtype=np.float32).copy()
base, wj, out = sys.argv[1:4]; a = load(base); w = json.load(open(wj))
reps = []
for spec in sys.argv[4:]:
    i0, i1, fx, f0, f1 = spec.split(':'); i0, i1, f0, f1 = int(i0), int(i1), float(f0), float(f1)
    c0 = (w[i0-1]['e'] + w[i0]['s'])/2; c1 = (w[i1]['e'] + w[i1+1]['s'])/2
    fa = load(fx)[max(0,int((f0-0.06)*SR)):int((f1+0.06)*SR)]
    old = a[int(w[i0]['s']*SR):int(w[i1]['e']*SR)]
    g = np.sqrt(np.mean(old**2))/np.sqrt(np.mean(fa**2)); fa = fa*g
    pad0 = np.zeros(int((w[i0]['s']-c0)*SR*0.8), np.float32); pad1 = np.zeros(int((c1-w[i1]['e'])*SR*0.8), np.float32)
    reps.append((int(c0*SR), int(c1*SR), np.concatenate([pad0, fa, pad1]), round(float(g),2), spec))
reps.sort(); pieces = []; pos = 0
for s, e, ins, g, spec in reps:
    pieces.append(a[pos:s]); r = np.linspace(0,1,XF,dtype=np.float32); ins = ins.copy(); ins[:XF] *= r; ins[-XF:] *= r[::-1]
    pieces.append(ins); pos = e; print('spliced', spec, 'gain', g, 'old', round((e-s)/SR,2), 'new', round(len(ins)/SR,2))
pieces.append(a[pos:]); y = np.concatenate(pieces)
subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','1','-i','-',out],input=y.tobytes(),check=True)
print('wrote', out, round(len(y)/SR,2), 's')
