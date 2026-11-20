from PIL import Image
import numpy as np, sys
d=sys.argv[1]
ims=[Image.open(d+'/f_%05d.png'%f).convert('RGB').resize((360,640)) for f in (0,69,114)]
s=Image.new('RGB',(1080,640));[s.paste(im,(i*360,0)) for i,im in enumerate(ims)];s.save(d+'/sheet.jpg',quality=85)
for f in (0,69,114):
  a=np.asarray(Image.open(d+'/f_%05d.png'%f).convert('HSV')).astype(float)/255; print(f,'sat %.3f val %.3f'%(a[...,1].mean(),a[...,2].mean()))
