# lamproom_api.py: Blender controls of THE LAMP ROOM (set-builder 2026-11-21). Same parameters as sets/lamproom.js (kit).
#   set_state(sc, wave=0..4, iris=0..1, dim=0..1, grey=None|0..1, flick=0..1)
#   wave: red lamp groups 1..wave are off (4 posed steps, row 38); iris: pupil radius PUP0 -> PUP1 (shape key 'open'); dim: the window light (1 = full dusk);
#   grey: window picture red (0) -> grey truck (1), default = 1 once wave >= 2 (the truck greys in the same half second); flick: the flickering lamps' level.
import bpy, math
L = dict(R=6.0, YI=5.58, IR_OUT=2.25, PUP0=1.15, PUP1=1.9, DECK_Z=-3.4, BULK_Y=-5.2, RING_R=0.9, WIN_Y=11.58)
E_ON, E_FLICK = 9.0, 3.0
def _emit(mname, s):
    m = bpy.data.materials.get(mname)
    if m: m.node_tree.nodes['Principled BSDF'].inputs['Emission Strength'].default_value = s
def set_state(sc, wave=0, iris=0.0, dim=1.0, grey=None, flick=0.5):
    wave = max(0, min(4, int(round(wave)))); grey = (1.0 if wave >= 2 else 0.0) if grey is None else grey
    for g in (1, 2, 3, 4):
        off = g <= wave
        _emit('bulb_red_on_g%d' % g, 0.0 if off else E_ON); _emit('bulb_red_flick_g%d' % g, 0.0 if off else E_FLICK * flick * 2)
        _emit('ind_red_g%d' % g, 0.0 if off else 6.0)
        l = bpy.data.objects.get('fill_red_g%d' % g)
        if l: l.data.energy = 0.0 if off else l['e']
    for k in ('green', 'blue'): _emit('bulb_%s_flick' % k, E_FLICK * flick * 2)
    for o in bpy.data.objects:                       # relay box: the red row's levers drop with their group
        if o.get('lever_group'): o.rotation_euler.x = math.radians(35 if o['lever_group'] <= wave else -35)   # off = lever down
    ir = bpy.data.objects.get('IRIS')
    if ir and ir.data.shape_keys: ir.data.shape_keys.key_blocks['open'].value = iris
    pr = L['PUP0'] + (L['PUP1'] - L['PUP0']) * iris
    w = bpy.data.objects.get('window_light')
    if w: w.data.energy = w['e'] * dim * (pr / L['PUP0']) ** 2; w.data.size = 2 * pr
    m = bpy.data.materials.get('window_view')
    if m: m.node_tree.nodes['grey_mix'].inputs['Factor'].default_value = grey; m.node_tree.nodes['win_emit'].inputs['Strength'].default_value = 1.0 * (0.35 + 0.65 * dim)
    sc['lamproom_state'] = dict(wave=wave, iris=iris, dim=dim, grey=grey, flick=flick)
def use_cam(sc, name):
    sc.camera = bpy.data.objects[name]
