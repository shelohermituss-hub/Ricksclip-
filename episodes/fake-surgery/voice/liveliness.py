"""Liveliness per sentence group: pitch median, pitch range (5-95 pct, semitones), loudness range (5-95 pct, dB).
Usage: python liveliness.py audio words.json  -> prints json"""
import json, subprocess, sys, re
import numpy as np
SR = 16000
def load(p):
    raw = subprocess.run(['ffmpeg','-v','error','-i',p,'-ac','1','-ar',str(SR),'-f','f32le','-'],capture_output=True,check=True).stdout
    return np.frombuffer(raw,dtype=np.float32)
def track(a):
    fl, hop = int(0.040*SR), int(0.010*SR)
    lo, hi = int(SR/400), int(SR/70)
    f0, rms, t = [], [], []
    for i in range(0, len(a)-fl, hop):
        x = a[i:i+fl]; x = x - x.mean()
        e = np.sqrt((x*x).mean()); rms.append(e); t.append(i/SR)
        if e < 0.01: f0.append(np.nan); continue
        n = 1<<(2*fl-1).bit_length()
        X = np.fft.rfft(x*np.hanning(fl), n); r = np.fft.irfft(X*np.conj(X))[:hi+1]
        r = r/(r[0]+1e-9)
        k = lo+int(np.argmax(r[lo:hi]))
        f0.append(SR/k if r[k] > 0.55 else np.nan)
    return np.array(t), np.array(f0), np.array(rms)
STARTS = ["He hugged","The guard who","This is","The guards rip","So the games","But this guy","And on this","That night","Folded inside","You see","Next morning"]
def norm(w): return re.sub(r"[^a-z']","",w.lower())
def find_starts(words):
    ws=[norm(w['w']) for w in words]; idx=[]; pos=0
    for s in STARTS:
        sw=[norm(x) for x in s.split()]
        for i in range(pos,len(ws)-len(sw)):
            if ws[i:i+len(sw)]==sw: idx.append(i); pos=i+1; break
        else: raise SystemExit('missing '+s)
    return idx
def find_seq(words,seq,after=0):
    ws=[norm(w['w']) for w in words]; sw=[norm(x) for x in seq.split()]
    for i in range(after,len(ws)):
        if ws[i:i+len(sw)]==sw: return i,i+len(sw)-1
def stats(t,f0,rms,s,e):
    m=(t>=s)&(t<=e); f=f0[m]; f=f[~np.isnan(f)]; r=rms[m]; r=r[r>0.01]
    if len(f)<5: return None
    st=12*np.log2(f/100)
    return dict(med=round(float(np.median(st)),2), rng=round(float(np.percentile(st,95)-np.percentile(st,5)),2),
                loud=round(float(np.percentile(20*np.log10(r),95)-np.percentile(20*np.log10(r),5)),1), dur=round(e-s,2), wps=None)
def analyse(audio, wj):
    a=load(audio); words=json.load(open(wj)); t,f0,rms=track(a); st=find_starts(words)
    out={}
    for g in range(len(st)):
        i0=st[g]; i1=(st[g+1] if g<len(st)-1 else len(words))-1
        d=stats(t,f0,rms,words[i0]['s'],words[i1]['e']); d['wps']=round((i1-i0+1)/(words[i1]['e']-words[i0]['s']),2); out[f'g{g+1}']=d
    d=stats(t,f0,rms,0,len(a)/SR); out['all']=d
    # quotes and neighbours (words)
    def seg(name,seq,after=0):
        i0,i1=find_seq(words,seq,after); d=stats(t,f0,rms,words[i0]['s'],words[i1]['e']); d['wps']=round((i1-i0+1)/(words[i1]['e']-words[i0]['s']),2); out[name]=d; return i0,i1
    seg('quote1',"it's a game for children")
    seg('narr_before_q1',"the guard who handed it over just stares")
    seg('narr_after_q1',"this is a german prison camp")
    seg('quote2',"the british are losing a war and buying hotels")
    seg('narr_before_q2',"so the games go in and up in the tower they laugh")
    seg('narr_after_q2',"but this guy never plays")
    return out
if __name__=='__main__':
    print(json.dumps(analyse(sys.argv[1],sys.argv[2]),indent=0))
