# cams.py: resolves map_cams.json (relative stations) into absolute pos/aim with map_meta.json; shared by the Blender proof and the kit films.
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
def cams(meta):
    C = json.load(open(os.path.join(HERE, 'map_cams.json'))); st = {s['city']: s['pos'] for s in meta['stations']}; out = {}
    for k, c in C.items():
        if 'city' in c:
            b = st.get(c['city']) or meta['anchors']['cities'][c['city']]
            if c['city'] == 'DALLAS': b = meta['anchors']['dallas_label']
            out[k] = dict(pos=[b[i] + c['rel_pos'][i] for i in range(3)], aim=[b[i] + c['rel_aim'][i] for i in range(3)], lens=c['lens'], doors_t=c.get('doors_t'))
        else: out[k] = dict(pos=c['pos'], aim=c['aim'], lens=c['lens'], doors_t=c.get('doors_t'))
    return out
