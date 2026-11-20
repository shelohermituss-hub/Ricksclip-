import sys,glob
from PIL import Image
d,step,off,out=sys.argv[1],int(sys.argv[2]),int(sys.argv[3]),sys.argv[4]
fs=sorted(glob.glob(f'fr/{d}/*.png'))[off::step][:24]
w,h=270,480
sh=Image.new('RGB',(w*8,h*3),'white')
for i,f in enumerate(fs):
    im=Image.open(f).convert('RGB').resize((w,h))
    sh.paste(im,((i%8)*w,(i//8)*h))
sh.save(out,quality=88)
print(len(fs))
