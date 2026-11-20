"""Per-frame look metrics (texture, grain, ink, light, palette) on 1080x1920 frames.
Caption band (rows 0.64-0.76 H) masked everywhere. Usage: look.py <framedir> <out.json> [step]"""
import sys,glob,json,numpy as np,cv2
d,out=sys.argv[1],sys.argv[2]; step=int(sys.argv[3]) if len(sys.argv)>3 else 1
def lin2(x): return x
res=[]
for f in sorted(glob.glob(d+'/*.png'))[::step]:
    im=cv2.imread(f)
    if im is None: continue
    im=cv2.resize(im,(1080,1920),interpolation=cv2.INTER_AREA)
    H,W=im.shape[:2]
    m=np.ones((H,W),bool); m[int(.64*H):int(.76*H)]=False
    rgb=im[...,::-1].astype(np.float32)/255
    Y=(0.299*rgb[...,0]+0.587*rgb[...,1]+0.114*rgb[...,2])
    hsv=cv2.cvtColor(im,cv2.COLOR_BGR2HSV).astype(np.float32)
    S_=hsv[...,1]/255; Hh=hsv[...,0]*2
    lab=cv2.cvtColor(im,cv2.COLOR_BGR2LAB).astype(np.float32)
    L=lab[...,0]*100/255; a=lab[...,1]-128; b=lab[...,2]-128; C=np.hypot(a,b)
    y=Y[m]
    r={'f':f.split('/')[-1]}
    r['Yp']=[float(np.percentile(y,p)) for p in (1,5,50,95,99)]
    r['Ymean']=float(y.mean()); r['Smean']=float(S_[m].mean())
    lit=m&(L>50); r['litC50']=float(np.median(C[lit])) if lit.sum()>100 else None
    dk=m&(Y<0.30)&(Y>0.06); r['shad_ab']=[float(np.median(a[dk])),float(np.median(b[dk]))] if dk.sum()>500 else None
    # black point: mean colour of darkest 1%
    t=np.percentile(y,1); sel=m&(Y<=t); r['black']=[float(v) for v in (rgb[sel].mean(0)*255)]
    # vignette
    c=Y[int(.35*H):int(.65*H),int(.3*W):int(.7*W)].mean()
    k=int(.12*W); corners=np.concatenate([Y[:k,:k].ravel(),Y[:k,-k:].ravel(),Y[-k:,:k].ravel(),Y[-k:,-k:].ravel()])
    r['vig']=float(corners.mean()/max(c,1e-3))
    # ink: thin dark strokes via black-hat
    Y8=(Y*255).astype(np.uint8)
    bh=cv2.morphologyEx(Y8,cv2.MORPH_BLACKHAT,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(15,15)))
    ink=(bh>40)&(Y<0.28)&m
    r['ink']=float(ink.sum()/m.sum())
    ed=cv2.Canny(cv2.GaussianBlur(Y8,(5,5),0),60,150)>0
    ed&=m
    near=cv2.dilate(ink.astype(np.uint8),np.ones((7,7),np.uint8))>0
    r['edge_ink']=float((ed&near).sum()/max(ed.sum(),1)); r['edge_dens']=float(ed.sum()/m.sum())
    # texture: block stats at full res, 16px blocks
    g=Y.copy()
    hp=g-cv2.GaussianBlur(g,(0,0),3)  # fine detail <~3px
    bs=16; hb,wb=H//bs,W//bs
    def blocks(x): return x[:hb*bs,:wb*bs].reshape(hb,bs,wb,bs).transpose(0,2,1,3).reshape(hb,wb,-1)
    mb=blocks(m.astype(np.float32)).min(-1)>0
    sd=blocks(hp).std(-1)[mb]
    r['hf_med']=float(np.median(sd)); r['hf_p75']=float(np.percentile(sd,75))
    r['flat_share']=float((sd<0.004).mean())   # flat colour fields
    r['textured_share']=float((sd>0.015).mean())
    # grain: in smooth blocks (low gradient at sigma 3), residual std at sigma 1
    lo=cv2.GaussianBlur(g,(0,0),6); gx=cv2.Sobel(lo,cv2.CV_32F,1,0); gy=cv2.Sobel(lo,cv2.CV_32F,0,1)
    gm=blocks(np.hypot(gx,gy)).mean(-1)
    n1=blocks(g-cv2.GaussianBlur(g,(0,0),1.0)).std(-1)
    smooth=mb&(gm<np.percentile(gm[mb],20))
    r['grain']=float(np.median(n1[smooth]))*255
    # chroma noise in smooth blocks
    ach=blocks(a-cv2.GaussianBlur(a,(0,0),1.0)).std(-1)
    r['chroma_grain']=float(np.median(ach[smooth]))
    # highlights / bloom
    r['clip']=float((y>0.97).mean()); r['bright']=float((y>0.90).mean())
    # specular-ish: small bright spots (white-hat)
    th=cv2.morphologyEx(Y8,cv2.MORPH_TOPHAT,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(9,9)))
    r['spec']=float(((th>50)&m).sum()/m.sum())
    # hue shares of saturated pixels
    sat=m&(S_>0.25)&(Y>0.12)
    hh=Hh[sat]; n=max(len(hh),1)
    r['hue']={'red_pink':float(((hh<20)|(hh>=320)).sum()/n),'orange_yel':float(((hh>=20)&(hh<70)).sum()/n),
      'green':float(((hh>=70)&(hh<165)).sum()/n),'cyan_blue':float(((hh>=165)&(hh<255)).sum()/n),'violet':float(((hh>=255)&(hh<320)).sum()/n)}
    r['sat_share']=float(sat.sum()/m.sum())
    # sharpness top third vs middle (DOF proxy)
    lap=np.abs(cv2.Laplacian(cv2.GaussianBlur(g,(0,0),0.8),cv2.CV_32F))
    r['sharp_top']=float(lap[:H//4].mean()); r['sharp_mid']=float(lap[int(.35*H):int(.6*H)].mean())
    res.append(r)
json.dump(res,open(out,'w'))
print(out,len(res))
