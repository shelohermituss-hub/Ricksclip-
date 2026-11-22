"""toilet_api.py: states of the built toilet place (sets/toilet/out/toilet.blend). Never rebuild for a still: load the blend, call set_state, set a camera, render.
set_state(scene, light='day'|'night'|'wide', glow=0..1, exploded=0..1, door='open'|'closed' or 0..1, hatch=0..1, pulse=0..1 (place of the glow on the hose path),
          shot=1|6|12|13 (which stand-in cards show), commander=0|1, paper=0|1 (floating roll -> ribbon into the bowl))
set_light(scene, kind) is called by set_state(light=...). The same names and numbers are in toilet_meta.json for the kit (sets/toilet.js)."""
import bpy, json, os, math
from mathutils import Vector
_HERE = os.path.dirname(os.path.abspath(__file__)); _M = {}
def meta():
    if not _M: _M.update(json.load(open(os.path.join(_HERE, '..', 'out', 'toilet_meta.json'))))
    return _M
def _o(n): return bpy.data.objects.get(n)
def _vis(n, on):
    o = _o(n)
    if o: o.hide_render = o.hide_viewport = not on
def _emit(mat, strength, col=None):
    m = bpy.data.materials.get(mat)
    if not m: return
    b = m.node_tree.nodes['Principled BSDF']; b.inputs['Emission Strength'].default_value = strength
    if col: b.inputs['Emission Color'].default_value = col
def _lerp(a, b, u): return [x + (y - x) * u for x, y in zip(a, b)]
LIGHTS = {  # watts per light and the world (colour, strength) for each kind
    'day':   {'key_day': 750, 'warm_top': 60, 'fill_day': 70, 'world': ((.03, .04, .16), .2), 'floor_rough': .45, 'earth': 1.25},
    'night': {'night_fill': 90, 'world': ((.004, .004, .12), .45), 'floor_rough': .3, 'earth': 1.0},
    'wide':  {'key_wide': 1200, 'fill_wide': 50, 'door_light': 70, 'world': ((.04, .045, .09), .15), 'floor_rough': .1, 'earth': 1.2},
}
ALL = ('key_day', 'warm_top', 'fill_day', 'night_fill', 'key_wide', 'fill_wide', 'door_light')
def set_light(scene, kind):
    L = LIGHTS[kind]
    for n in ALL:
        o = _o(n)
        if o: o.data.energy = L.get(n, 0); o.hide_render = o.hide_viewport = n not in L
    bg = scene.world.node_tree.nodes['Background']; bg.inputs[0].default_value = (*L['world'][0], 1); bg.inputs[1].default_value = L['world'][1]
    for mn in ('tile_white', 'tile_black'):
        m = bpy.data.materials.get(mn)
        if m: m.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value = L['floor_rough']
    _emit('earth_day', L['earth']); _emit('space_stars', L['earth'])
    _vis('window_view_day', kind != 'night'); _vis('window_view_night', kind == 'night')
    for n, kinds in meta()['variants'].items(): _vis(n, kind in kinds)
def set_state(scene, **kw):
    S = json.loads(scene.get('toilet_state', '{}')) or dict(meta()['state_default']); S.update(kw); scene['toilet_state'] = json.dumps(S); M = meta()
    set_light(scene, S['light'])
    g, e = float(S['glow']), float(S['exploded']); night = S['light'] == 'night'
    d = S['door']; d = {'open': 1., 'closed': 0.}.get(d, d); h = float(S.get('hatch', 0))
    # glow: porcelain emission + the halo source lamp at the toilet + the hose ribs + the travelling pulse
    _emit('porcelain', g * (.55 if night else 1.2)); _emit('hose_rib', g * .5); _emit('glow_ring', 6. * g)
    o = _o('toilet_glow_light'); o.data.energy = g * (110 if night else 120); o.hide_render = g <= 0
    P = M['hose_path']; u = max(0., min(1., float(S.get('pulse', 0)))) * (len(P) - 1); i = min(int(u), len(P) - 2); p = _lerp(P[i], P[i + 1], u - i)
    for n in ('hose_pulse', 'pulse_light'):
        o = _o(n); o.location = p if n == 'hose_pulse' else (p[0], p[1], p[2] + .12); o.hide_render = o.hide_viewport = g <= 0
    _o('pulse_light').data.energy = 110 * g
    # movers: exploded parts (rest <-> exploded), door leaf and hatch panel (rest <-> open)
    for n, mv in M['movers'].items():
        o = _o(n)
        if not o: continue
        for key, u in (('exploded', e), ('open', d if n == 'door_leaf' else h)):
            if key in mv:
                o.location = _lerp(mv['loc'], mv[key]['loc'], u); o.rotation_euler = [math.radians(a) for a in _lerp(mv['rot'], mv[key]['rot'], u)]
                o.scale = _lerp(mv.get('scale', [1, 1, 1]), mv[key].get('scale', mv.get('scale', [1, 1, 1])), u)
    # stand-in cards per shot, paper roll -> ribbon
    shot = int(S.get('shot', 0))
    for n, shots in M['standins'].items(): _vis(n, shot in shots and not (n.startswith('standin_commander') and not int(S.get('commander', 1))))
    pp = float(S.get('paper', 0)); _vis('paper_roll_float', S['light'] == 'day' and pp < .5); _vis('paper_ribbon', S['light'] == 'day' and pp >= .5)
    return S
