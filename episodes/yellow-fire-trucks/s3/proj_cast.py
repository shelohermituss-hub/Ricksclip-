"""proj_cast.py: where each cast member's eyes and feet land on screen (fractions, 0,0 top-left) on given ABSOLUTE frames, from the shifted plan bake (run check_shifted.py first). usage: python proj_cast.py 511 643"""
import json,sys,os
sys.path.insert(0,'/home/user/Ricksclip-/tools'); import film_plan as FP
d='out/check_shift/out/plan'; cam=json.load(open(d+'/camera_baked.json'))['frames']; perf=json.load(open(d+'/performance_baked.json'))
F=json.load(open('film.json'))
for f in [int(x)-474 for x in sys.argv[1:]]:
    out=[]
    for who,runs in perf.items():
        st=FP.perf_at(runs,f)
        if not st.get('visible'): continue
        P=st['pos'];h=F['cast'][who]['height']
        e=FP.project(cam[f],[P[0],P[1],P[2]+h*.86]); ft=FP.project(cam[f],[P[0],P[1],P[2]])
        out.append('%s pos %s eyes %s feet %s'%(who,[round(x,2) for x in P],e and [round(x,2) for x in e[:2]],ft and [round(x,2) for x in ft[:2]]))
    print(f+474,cam[f].get('state'),out)
