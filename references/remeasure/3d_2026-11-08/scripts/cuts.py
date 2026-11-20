"""Hard cuts: HSV histogram correlation between consecutive 30fps frames (caption band masked) < 0.5 and a local spike."""
import sys,cv2,numpy as np,json
cap=cv2.VideoCapture(sys.argv[1]); prev=None; c=[]; i=0
while True:
    ok,f=cap.read()
    if not ok: break
    g=cv2.resize(f,(180,320)); g[205:243]=0
    h=cv2.calcHist([cv2.cvtColor(g,cv2.COLOR_BGR2HSV)],[0,1],None,[32,16],[0,180,0,256]); cv2.normalize(h,h)
    if prev is not None: c.append(cv2.compareHist(prev,h,cv2.HISTCMP_CORREL))
    prev=h; i+=1
c=np.array(c); cuts=[j for j in range(len(c)) if c[j]<0.6 and c[j]<np.median(c[max(0,j-5):j+6])-0.25]
dur=i/30; sl=np.diff([0]+cuts+[i])/30
print(json.dumps(dict(name=sys.argv[2],dur=round(dur,1),cuts=len(cuts),shots=len(cuts)+1,med_shot_s=round(float(np.median(sl)),2),cuts_per_10s=round(len(cuts)/dur*10,2))))
