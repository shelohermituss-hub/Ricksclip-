"""Pitch/pace of each quote vs the narration just before and after. Usage: python quote_dist.py audio words.json"""
import sys, json, re, liveliness as L
a = L.load(sys.argv[1]); w = json.load(open(sys.argv[2])); t, f0, rms = L.track(a)
n = [re.sub(r"[^a-z']", "", x['w'].lower()) for x in w]
def find(seq):
    s = seq.split()
    for i in range(len(n)):
        if n[i:i+len(s)] == s: return i, i+len(s)-1
def st(i0, i1):
    d = L.stats(t, f0, rms, w[i0]['s'], w[i1]['e']); d['wps'] = round((i1-i0+1)/(w[i1]['e']-w[i0]['s']), 2); return d
for name, q in [('nurse', "doctor you forgot the operation")]:
    i0, i1 = find(q)
    print(name, 'quote', st(i0, i1), '| before', st(max(0, i0-7), i0-1), '| after', st(i1+1, min(len(w)-1, i1+7)))
d = L.stats(t, f0, rms, 0, len(a)/L.SR); print('all', d)
