"""cabin_api.py: states of the built cabin place (sets/cabin/out/cabin.blend). Never rebuild for a still: load the blend, call set_state, set a camera, render.
set_state(scene, mode='day'|'night', bag_new_guy='full'|'empty', door=0..1 or 'open'|'closed' (bay door to the toilet room), shot='4'|'4a'|'5a'|'5b'|'5c'
          (which stand-in cards show), sway=-1..1 (all sleeping bags turn sway * sway_deg about their hooks), monitor=<png path> (a picture on cabin_monitor_pic))
set_light(scene, kind) is called by set_state(mode=...). The same names and numbers are in cabin_meta.json for the kit (sets/cabin.js)."""
import bpy, json, os, math
_HERE = os.path.dirname(os.path.abspath(__file__)); _M = {}
def meta():
    if not _M: _M.update(json.load(open(os.path.join(_HERE, '..', 'out', 'cabin_meta.json'))))
    return _M
def _o(n): return bpy.data.objects.get(n)
def _vis(n, on):
    o = _o(n)
    if o: o.hide_render = o.hide_viewport = not on
def _lerp(a, b, u): return [x + (y - x) * u for x, y in zip(a, b)]
LIGHTS = {  # watts per light (sun: W/m2) and the world (colour, strength) for each kind
    'day':   {'key_day': 4.6, 'fill_day': 25, 'world': ((.09, .05, .03), .03), 'bounces': 0, 'head_glow': 0},
    'night': {'pool_1': 1000, 'pool_2': 1000, 'pool_3': 1000, 'pool_4': 1000, 'pool_5': 1000, 'pool_6': 1000, 'sky_glow_1': 25, 'sky_glow_2': 25, 'bag_fill': 130, 'end_wash': 140,
              'floor_light_glow': 6, 'toilet_room_lamp': 120, 'world': ((.005, .008, .16), .8), 'bounces': 4, 'head_glow': .9},
}
def set_light(scene, kind):
    L = LIGHTS[kind]
    for o in bpy.data.objects:
        if o.type != 'LIGHT': continue
        o.data.energy = L.get(o.name, 0); o.hide_render = o.hide_viewport = o.name not in L; o.visible_glossy = False
    scene.cycles.diffuse_bounces = L['bounces']   # day: 1 bounce keeps the hard shadows near black (shadow/lit 0.13 on the quilt, LOOK_INVENTORY D2)
    m = bpy.data.materials.get('standin_head')     # night: the faces stay full-bright as his (a small self-light on the stand-in heads)
    if m: b = m.node_tree.nodes['Principled BSDF']; b.inputs['Emission Color'].default_value = (1, 1, 1, 1); b.inputs['Emission Strength'].default_value = L['head_glow']
    bg = scene.world.node_tree.nodes['Background']; bg.inputs[0].default_value = (*L['world'][0], 1); bg.inputs[1].default_value = L['world'][1]
def set_monitor(png):
    m = bpy.data.materials.get('monitor_placeholder')
    t = [n for n in m.node_tree.nodes if n.type == 'TEX_IMAGE'][0]; t.image = bpy.data.images.load(png, check_existing=True)
def set_state(scene, **kw):
    S = json.loads(scene.get('cabin_state', '{}')) or dict(meta()['state_default']); S.update(kw); scene['cabin_state'] = json.dumps(S); M = meta()
    set_light(scene, S['mode'])
    for n, states in M['variants'].items(): _vis(n, S['bag_new_guy'] in states)
    d = S.get('door', 1); d = {'open': 1., 'closed': 0.}.get(d, d)
    for n, mv in M['movers'].items():
        o = _o(n)
        if not o: continue
        if 'open' in mv:
            o.location = _lerp(mv['loc'], mv['open']['loc'], float(d)); o.rotation_euler = [math.radians(a) for a in _lerp(mv['rot'], mv['open']['rot'], float(d))]
        if 'sway_deg' in mv: o.rotation_euler = [math.radians(mv['rot'][0] + float(S.get('sway', 0)) * mv['sway_deg']), 0, math.radians(mv['rot'][2])]
    shot = str(S.get('shot', ''))
    for n, shots in M['standins'].items(): _vis(n, shot in shots)
    if S.get('monitor'): set_monitor(S['monitor'])
    return S
