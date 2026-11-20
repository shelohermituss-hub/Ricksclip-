import json,glob,numpy as np
res={}
for f in sorted(glob.glob('data/cam_*.json')):
    n=f[9:-5]; o=json.load(open(f))
    v=[x for x in o if x]; cuts=sum(1 for x in o if x is None)
    t=np.array([x['t'] for x in v]); z=np.array([x['z'] for x in v])
    sp=t+np.abs(z)*734
    # smooth 5f median like a settled estimator
    sps=np.array([np.median(sp[max(0,i-2):i+3]) for i in range(len(sp))])
    hold=(sps<0.3).mean(); drift=((sps>=0.3)&(sps<2)).mean(); move=(sps>=2).mean()
    # moves per 10s: rising crossings of 2 px/f
    m=sps>=2; starts=np.sum(m[1:]&~m[:-1])
    dur=len(o)/30
    # shot count: runs of None separated
    za=np.abs(z)>=0.0005
    res[n]=dict(frames=len(o),untracked=cuts,hold=hold*100,drift=drift*100,move=move*100,med=float(np.median(sps)),p90=float(np.percentile(sps,90)),
        trans_p90=float(np.percentile(t,90)),moves10=float(starts/dur*10),zoom_active=float(za.mean()*100),
        push_share=float((z[za]>0).mean()*100),zoom_med=float(np.median(np.abs(z[za]))*100))
    print(n,{k:round(v,2) for k,v in res[n].items()})
json.dump(res,open('data/cam_summary.json','w'))
