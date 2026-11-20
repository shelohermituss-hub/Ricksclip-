import json,numpy as np
sets=['old','coaster','drivers','pink']
D={s:json.load(open(f'data/look_{s}.json')) for s in sets}
D['new']=D['coaster']+D['drivers']+D['pink']
def med(rs,k,i=None):
    v=[(r[k] if i is None else r[k][i]) for r in rs if r.get(k) is not None]
    return np.median(v),np.percentile(v,25),np.percentile(v,75)
keys=['Ymean','Smean','litC50','vig','ink','edge_ink','edge_dens','hf_med','flat_share','textured_share','grain','chroma_grain','clip','bright','spec','sat_share']
out={}
print('%-15s'%'metric'+''.join('%22s'%s for s in sets+['new']))
for k in keys:
    row=[];
    for s in sets+['new']:
        m,a,b=med(D[s],k); row.append('%7.4f (%6.4f-%6.4f)'%(m,a,b)); out.setdefault(k,{})[s]=[m,a,b]
    print('%-15s'%k+''.join('%22s'%x for x in row))
for i,p in enumerate([1,5,50,95,99]):
    print('%-15s'%f'Yp{p}'+''.join('%22.3f'%med(D[s],'Yp',i)[0] for s in sets+['new']))
for i,n in enumerate(['a','b']):
    print('%-15s'%f'shadow_{n}'+''.join('%22.2f'%med(D[s],'shad_ab',i)[0] for s in sets+['new']))
for i,n in enumerate('RGB'):
    print('%-15s'%f'black_{n}'+''.join('%22.1f'%med(D[s],'black',i)[0] for s in sets+['new']))
for h in ['red_pink','orange_yel','green','cyan_blue','violet']:
    print('%-15s'%h+''.join('%22.3f'%np.mean([r['hue'][h] for r in D[s]]) for s in sets+['new']))
print('%-15s'%'sharp top/mid'+''.join('%22.3f'%np.median([r['sharp_top']/max(r['sharp_mid'],1e-4) for r in D[s]]) for s in sets+['new']))
json.dump(out,open('data/look_summary.json','w'),default=float)
