"""ship_api.py: states of the built ship place (sets/ship/out/ship.blend). Never rebuild for a still: load the blend, call set_state, set a camera, render.
set_state(scene, light='space'|'warm'|'map'|'radio', sun_dir=[x,y,z] (toward the sun, world), flame=0..1, preglow=0..1, glitter=0..1 (trail from the tail,
          4 steps, + collar puff from .5), glitter_ck=0..1 (cloud around the canopy, 3 steps), comm=0|1 (COMM INCOMING lamp, red MFD window, red wash),
          digits=0..3 (radio display picture), starmap=0..1 (sheet on the glass), shot=2|7|9|11 (stand-in cards), ship=[x,y,z,rx,ry,rz] (ship_root, degrees),
          earth=[x,y,z,R], earth_emit=0..1 (1 = evenly lit day side as shot 2, low = dark crescent as shot 11), fan=deg (solar fans about their boom),
          earth_rot=[x, y, z] degrees (round 5: turns the painted globe per shot), earth_term=[dx, dy, k] (dark side away from screen direction dx, dy; k 0 = evenly lit),
          fans=0|1 (round solar fans, spokes and booms; shot 2 has none), earth_glare=[sx, sy, r, k] (round 4: soft white sun spot on the Earth at screen place sx, sy in half-frame units, radius r in half-frame heights, k 0..1))
set_light(scene, kind) is called by set_state(light=...). The same names and numbers are in ship_meta.json for the kit (sets/ship.js)."""
import bpy, json, os, math
from mathutils import Vector
_HERE = os.path.dirname(os.path.abspath(__file__)); _M = {}
def meta():
    if not _M: _M.update(json.load(open(os.path.join(_HERE, '..', 'out', 'ship_meta.json'))))
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
DEFAULT = {'light': 'space', 'sun_dir': None, 'flame': 0, 'preglow': 0, 'glitter': 0, 'glitter_ck': 0, 'comm': 0, 'digits': 0, 'starmap': 0, 'shot': 0,
           'ship': [0, 0, 0, 0, 0, 0], 'earth': [0, -3000, -2600, 1500], 'earth_emit': 1., 'fan': 0, 'sun_k': 1., 'sky_rot': 0, 'wash': 0,
           'earth_glare': [.5, -.7, .3, 0.], 'earth_rot': [75, 0, 30], 'earth_term': [-.6, .6, 0.], 'fans': 1}
LIGHTS = {  # sun (to-light direction, colour, strength), interior lamps W each, cockpit fill W, room lights W, world colour
    'space': {'sun': ((.2, .5, .85), (1., 1., 1.), 3.0), 'fill': .25, 'lamps': 60, 'ck_fill': 20, 'rooms': 120},
    'warm':  {'sun': ((.45, -.6, .65), (1., .78, .6), 3.2), 'fill': .2, 'lamps': 110, 'ck_fill': 60, 'rooms': 120},
    'map':   {'sun': ((.45, -.6, .65), (1., .78, .6), .6), 'fill': .05, 'lamps': 8, 'ck_fill': 0, 'rooms': 0},
    'radio': {'sun': ((.45, -.6, .65), (1., .78, .6), 0.), 'fill': 0., 'lamps': 3, 'ck_fill': 14, 'rooms': 0},
}
def set_light(scene, kind, sun_dir=None, sun_k=1.):
    L = LIGHTS[kind]; d, col, e = L['sun']; s = _o('sun_key'); e = e * sun_k
    s.rotation_euler = Vector(sun_dir or d).normalized().to_track_quat('Z', 'Y').to_euler(); s.data.color = col; s.data.energy = e; s.hide_render = e <= 0
    f = _o('sun_fill'); f.data.energy = L['fill']; f.rotation_euler = (-Vector(sun_dir or d)).normalized().to_track_quat('Z', 'Y').to_euler()
    for n in ('lamp_light_0', 'lamp_light_1'): _o(n).data.energy = L['lamps']
    _o('ck_fill').data.energy = L['ck_fill']
    for n in ('room_light_a', 'room_light_b'): _o(n).data.energy = L['rooms']
    lamp_es = {'space': 1., 'warm': .3, 'map': .35, 'radio': .25}[kind]
    _emit('lamp_tube', 6. * lamp_es); _emit('lamp_tip', 9. * lamp_es)
def set_state(scene, **kw):
    S = json.loads(scene.get('ship_state', '{}')) or dict(DEFAULT); S.update(kw); scene['ship_state'] = json.dumps(S); M = meta()
    set_light(scene, S['light'], S.get('sun_dir'), float(S.get('sun_k', 1.)))
    _o('sky_dome').rotation_euler = (0, 0, math.radians(float(S.get('sky_rot', 0))))
    w = _o('wall_wash'); w.data.energy = float(S.get('wash', 0)) or {'warm': 450., 'space': 200.}.get(S['light'], 0.)
    sh = S['ship']; r = _o('ship_root'); r.location = sh[:3]; r.rotation_euler = [math.radians(a) for a in sh[3:6]]
    e = S['earth']; eo = _o('earth'); eo.location = e[:3]; eo.scale = (e[3],) * 3; eo.rotation_euler = [math.radians(a) for a in (S.get('earth_rot') or DEFAULT['earth_rot'])]   # round 5: per shot
    ee = float(S.get('earth_emit', 1.)); _emit('earth', ee)   # round 4: the map is the emission (unlit look); a dim lit base shows when earth_emit is low
    em = bpy.data.materials.get('earth'); _vis('earth_clouds', False)   # clouds are in the map now
    if em:
        nn = em.node_tree.nodes; nn['earth_base'].inputs['Value'].default_value = .12 + .5 * (1 - ee)
        gx, gy, gr, gk = (list(S.get('earth_glare') or DEFAULT['earth_glare']) + [0, 0, 0, 0])[:4]; cam = scene.camera
        tv = 18. / cam.data.lens if cam else .4; th = tv * scene.render.resolution_x / max(1, scene.render.resolution_y)
        R3 = cam.matrix_world.to_3x3() if cam else Vector((0, 0, 1)).to_track_quat('Z', 'Y').to_matrix()   # round 5: screen numbers -> world directions
        g = (R3 @ Vector((gx * th, gy * tv, -1.))).normalized(); nn['glare_dir'].inputs[0].default_value, nn['glare_dir'].inputs[1].default_value, nn['glare_dir'].inputs[2].default_value = g
        nn['glare_r'].outputs[0].default_value = max(gr, .01) * tv; nn['glare_k'].outputs[0].default_value = gk
        tx, ty, tk = (list(S.get('earth_term') or DEFAULT['earth_term']) + [0, 0, 0])[:3]; td = (R3 @ Vector((tx, ty, .5))).normalized()
        for i in range(3): nn['term_dir'].inputs[i].default_value = td[i]
        nn['term_k'].outputs[0].default_value = tk
    f = float(S['flame'])
    for n in ('flame_core', 'flame_mid', 'flame_outer', 'flame_halo', 'flame_glow'):
        o = _o(n); o.scale = (max(f, .001), .45 + .55 * f, .45 + .55 * f); o.hide_render = o.hide_viewport = f <= .001
    _o('flame_light').data.energy = 60000 * f
    pg = max(float(S['preglow']), 1. if f > 0 else 0.); _emit('nozzle_glow', 8. * pg)
    g = float(S['glitter'])
    for k in range(4): _vis('glitter_trail_%d' % k, g > k / 4)
    _vis('glitter_collar', g >= .5)
    gc = float(S['glitter_ck'])
    for k in range(3): _vis('glitter_cockpit_%d' % k, gc > k / 3)
    c = int(S['comm']); _vis('comm_lamp_on', c); _vis('comm_lamp_off', not c); _vis('mfd_on', c); _vis('mfd_off', not c)
    _o('comm_light').data.energy = (9. if S['light'] == 'radio' else 25.) * c if S['light'] in ('radio', 'map', 'warm') else 0.
    _o('mfd_light').data.energy = (6. if c else 1.5) if S['light'] == 'radio' else 0.
    for k in range(4): _vis('radio_digits_%d' % k, int(S['digits']) == k)
    sm = float(S['starmap']); _vis('star_map_sheet', sm > 0); _vis('star_map_tape', sm > 0); _emit('pic_starmap', 2.5 * sm)
    for n in ('solar_fan_p', 'solar_fan_n'):
        for o in (_o(n), _o(n + '_spokes')): o.rotation_euler = (0, math.radians(float(S.get('fan', 0))), 0)
    for n in ('solar_fan_p', 'solar_fan_n', 'solar_fan_p_spokes', 'solar_fan_n_spokes', 'solar_boom_p', 'solar_boom_n'): _vis(n, int(S.get('fans', 1)))
    shot = int(S.get('shot', 0))
    for n, shots in M['standins'].items(): _vis(n, shot in shots)
    return S
