"""mc_api.py: states of the built mission control (sets/mc/out/mc.blend). Never rebuild for a still: load the blend, call set_state, set a camera, render.
set_state(scene, screen='map'|'ring'|'3'|'2'|'1'|'go'|'alarm'|'noflush'|'offcourse', mood='blue'|'teal'|'red-violet'|'pink',
          clock=index into meta clock.seq (0-5 shot 3, 6-8 shot 10), off=index into meta offcourse_seq (0-8, the DEV count + growing red line),
          shot=3|10 (stand-in cards), director=0|1, bin=0|1, nogo_box=0..1 (pops up f176-180), cover=0..1 (yellow cover flips up), press=0..1 (red dome down))
set_light(scene, mood) is called by set_state(mood=...). The same names and numbers are in mc_meta.json for the kit (sets/mc.js)."""
import bpy, json, os, math
_HERE = os.path.dirname(os.path.abspath(__file__)); _M = {}
def meta():
    if not _M: _M.update(json.load(open(os.path.join(_HERE, '..', 'out', 'mc_meta.json'))))
    return _M
def _o(n): return bpy.data.objects.get(n)
def _vis(n, on):
    o = _o(n)
    if o: o.hide_render = o.hide_viewport = not on
def _lin(h):
    h = h.lstrip('#'); v = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return [(c / 12.92 if c <= .04045 else ((c + .055) / 1.055) ** 2.4) for c in v]
def _lerp(a, b, u): return [x + (y - x) * u for x, y in zip(a, b)]
def _pic(obj_name, png):
    """swap the picture on an emissive plane (clock strip, OFF COURSE sequence)."""
    o = _o(obj_name)
    if not o: return
    n = o.active_material.node_tree.nodes['pic']; p = os.path.join(_HERE, '..', 'tex', png)
    im = bpy.data.images.get(png) or bpy.data.images.load(p); n.image = im
def set_light(scene, mood):
    L = meta()['moods'][mood]
    for n, col, w in (('fill_ceiling', L['fill'], L['fill_w']), ('fill_front', L['fill'], L['fill_w'] * .27), ('screen_spill', L['spill'], L['spill_w'])):
        o = _o(n)
        if o: o.data.color = _lin(col); o.data.energy = w
    bg = scene.world.node_tree.nodes['Background']; bg.inputs[0].default_value = (*_lin(L['world']), 1); bg.inputs[1].default_value = L['world_s']
def set_state(scene, **kw):
    M = meta(); S = json.loads(scene.get('mc_state', '{}')) or dict(M['state_default']); S.update(kw); scene['mc_state'] = json.dumps(S)
    set_light(scene, S['mood'])
    for st, n in M['screen_planes'].items(): _vis(n, st == S['screen'])
    _vis('mc_space_panel', S['screen'] == 'map')
    if S['screen'] == 'offcourse': _pic('mc_screen_offcourse', M['offcourse_seq'][int(S.get('off', 8))]['png'])
    _pic('mc_clock', M['clock']['seq'][int(S.get('clock', 0))]['png'])
    for n in ('mc_bin', 'mc_bin_paper'): _vis(n, bool(int(S.get('bin', 0))))
    mv = M['movers']; u = max(0., min(1., float(S.get('nogo_box', 1))))
    b = _o('mc_nogo_box'); b.scale = _lerp(mv['mc_nogo_box']['scale0'], [1, 1, 1], u)
    for n in ('mc_nogo_button', 'mc_nogo_cover', 'mc_label_nogo'): _vis(n, u > .95)
    for n, key, val in (('mc_nogo_button', 'pressed', S.get('press', 0)), ('mc_nogo_cover', 'open', S.get('cover', 0))):
        m = mv[n]; o = _o(n); v = float(val)
        o.location = _lerp(m['loc'], m[key]['loc'], v); o.rotation_euler = [math.radians(a) for a in _lerp(m['rot'], m[key]['rot'], v)]
    shot = int(S.get('shot', 3))
    for n, shots in M['standins'].items(): _vis(n, shot in shots and not (n == 'standin_director' and not int(S.get('director', 1))))
    return S
def frame_state(f):
    """the reference timing of shot 3 / 10 as a state dict (what the stretch builders key per frame)."""
    M = meta(); S = {}
    for st, d in M['screens'].items():
        if d['f'][0] <= f <= d['f'][1]: S['screen'] = st
    S['mood'] = 'pink' if f >= 803 else 'red-violet' if f >= 264 else 'teal' if f >= 224 else 'blue'
    seq = M['clock']['seq']; S['clock'] = max([i for i, c in enumerate(seq) if c['f'] <= f and (f >= 803) == (c['f'] >= 803)] or [0])
    S['off'] = max([i for i, c in enumerate(M['offcourse_seq']) if c['f'] <= f] or [0]); S['shot'] = 10 if f >= 803 else 3
    S['bin'] = int(f < 150); S['director'] = int(f >= 150); S['nogo_box'] = max(0., min(1., (f - 176) / 4)); S['cover'] = max(0., min(1., (f - 258) / 3))
    S['press'] = 1. if 263 <= f <= 268 else max(0., min(1., (f - 261) / 2)) if f < 263 else max(0., 1 - (f - 268) / 4) if f < 803 else 0.
    return S
