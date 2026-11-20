# window mask = dark-blue tape frame (#1c3466-ish) as a connected component near the iodine; dots = dark-brown blobs inside it; patch V = iodine pixels inside
import sys, numpy as np
from PIL import Image
from scipy import ndimage
for fn in sys.argv[1:]:
    a=np.asarray(Image.open(fn).convert('RGB')).astype(float)/255; H,W,_=a.shape
    r,g,b=a[...,0],a[...,1],a[...,2]; mx=a.max(-1); mn=a.min(-1); s=(mx-mn)/(mx+1e-6)
    io=(r>g)&(g>b)&(s>.45)&(mx>.3)&(r-b>.25)          # iodine orange
    lab,nl=ndimage.label(io); 
    if nl==0: print(fn[-12:],'no iodine'); continue
    sizes=ndimage.sum(io,lab,range(1,nl+1)); k=int(np.argmax(sizes))+1; ys,xs=np.where(lab==k)
    cy,cx=int(ys.mean()),int(xs.mean())
    blue=(b>.55)&(b<.83)&(b>r+.3)&(g<b*.66)&(g>b*.5)
    lb,nb=ndimage.label(blue); best=None
    for j in range(1,nb+1):
        yy,xx=np.where(lb==j)
        if len(yy)<200: continue
        if xx.min()<=cx<=xx.max() and yy.min()<=cy<=yy.max() and (xx.max()-xx.min())<W*.6:
            if best is None or len(yy)<best[0]: best=(len(yy),xx.min(),xx.max(),yy.min(),yy.max())
    pv=a.max(-1)[lab==k].mean()
    inside=np.zeros_like(io)
    if best: _,x0,x1,y0,y1=best; inside[y0:y1,x0:x1]=True
    dk=(mx<.38)&(r>b)&inside&(r-b>.05)
    ld,nd=ndimage.label(dk); dsz=ndimage.sum(dk,ld,range(1,nd+1)) if nd else []
    dots=sum(1 for z in dsz if z>(W/1080)**2*60)
    if best: print(fn[-12:],'window w %.1f%% x %.0f-%.0f y %.1f-%.1f%%'%((x1-x0)/W*100,x0/W*100,x1/W*100,y0/H*100,y1/H*100),'iodine V %.2f'%pv,'dark blobs %d'%dots)
    else: print(fn[-12:],'no window frame found; iodine at',cx/W,cy/H,'V %.2f'%pv)
