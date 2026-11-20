"""Camera speed per frame, motion.md definition A approx: 720x1280, 30 fps, speed=|translation|+|scale-1|*734 px/f.
Global similarity fit (RANSAC) on LK-tracked corners, caption band (0.64-0.76 H) masked. Cuts = frames where
<30% of points track or mean abs diff jump; excluded. Usage: cam.py video out.json [--synth]"""
import sys,json,numpy as np,cv2
def fit(prev,cur,mask):
    p=cv2.goodFeaturesToTrack(prev,600,0.01,8,mask=mask)
    if p is None or len(p)<20: return None
    q,st,err=cv2.calcOpticalFlowPyrLK(prev,cur,p,None,winSize=(21,21),maxLevel=3)
    ok=st.ravel()==1
    if ok.sum()<20 or ok.mean()<0.3: return None
    M,inl=cv2.estimateAffinePartial2D(p[ok],q[ok],method=cv2.RANSAC,ransacReprojThreshold=1.5)
    if M is None or inl.mean()<0.3: return None
    s=np.hypot(M[0,0],M[1,0]); 
    # translation of frame centre
    c=np.array([360,640,1.0]); tc=M@c-c[:2]
    return float(np.hypot(*tc)),float(s-1)
def run(frames):
    mask=np.full((1280,720),255,np.uint8); mask[int(.64*1280):int(.76*1280)]=0
    out=[];prev=None
    for fr in frames:
        g=cv2.cvtColor(cv2.resize(fr,(720,1280),interpolation=cv2.INTER_AREA),cv2.COLOR_BGR2GRAY)
        if prev is not None:
            d=float(np.abs(g.astype(np.int16)-prev).mean())
            r=fit(prev,g,mask)
            out.append(None if (r is None or d>40) else {'t':r[0],'z':r[1],'d':d})
        prev=g
    return out
if __name__=='__main__':
    if sys.argv[1]=='--synth':
        rng=np.random.default_rng(0); base=(rng.random((1600,1000,3))*255).astype(np.uint8); base=cv2.GaussianBlur(base,(0,0),2)
        for name,dx,zr in [('static',0,0),('pan1',1.5,0),('pan4',6,0),('zoom0.2%',0,0.002)]:
            fr=[]
            for i in range(10):
                M=np.float32([[1+zr*i,0,0],[0,1+zr*i,0]]); M[:,2]=[(1-(1+zr*i))*540+dx*i,(1-(1+zr*i))*960]
                w=cv2.warpAffine(base,M,(1000,1600))[160:1600-160+0,0:1000]
                fr.append(cv2.resize(w[:1280*1080//720 if False else 1440,  :810],(1080,1920)))
            o=[x for x in run(fr) if x]
            print(name,'t=%.3f z=%.5f speed=%.3f'%(np.median([x['t'] for x in o]),np.median([x['z'] for x in o]),np.median([x['t']+abs(x['z'])*734 for x in o])))
        sys.exit()
    cap=cv2.VideoCapture(sys.argv[1]); fr=[]
    def gen():
        while True:
            ok,f=cap.read()
            if not ok: break
            yield f
    o=run(gen()); json.dump(o,open(sys.argv[2],'w')); print(len(o))
