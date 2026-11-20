from PIL import Image
import colorsys, glob, sys
for fn in sorted(glob.glob(sys.argv[1])):
    im=Image.open(fn).convert('RGB'); W,H=im.size; px=im.load(); xs=[];ys=[];vs=[]
    for y in range(0,H,2):
        for x in range(0,W,2):
            r,g,b=px[x,y]; h,s,v=colorsys.rgb_to_hsv(r/255,g/255,b/255)
            if 0.04<h<0.1 and s>0.5 and v>0.35: xs.append(x);ys.append(y);vs.append(v)
    if len(xs)>20:
        xs.sort(); ys.sort(); n=len(xs); x0,x1=xs[int(n*.02)],xs[int(n*.98)]; y0,y1=ys[int(n*.02)],ys[int(n*.98)]
        print(fn[-11:], 'patch w %.1f%% x %.0f-%.0f y %.0f-%.0f%%'%((x1-x0)/W*100,x0/W*100,x1/W*100,y0/H*100,y1/H*100),'V mean %.2f'%(sum(vs)/n))
    else: print(fn,'no patch')
