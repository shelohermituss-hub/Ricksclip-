# town_api.py: the controls of the PINE HOLLOW set INSIDE Blender (final render), twins of sets/town.js in three.js.
#   import sys; sys.path.append('<sets/town/scripts>'); import town_api as TA
#   TA.set_light(bpy.context.scene, 'am' | 'du')       the two LOOK_BIBLE lights on the same set (sun, sky, lamps, lit windows, truck paint drain)
#   TA.set_trucks(scene, hero=dict(paint='half', edge=.3, masking=True, letters='under'), chief=dict(paint='red'))   (truck_api.set_paint keys)
#   TA.hero_root(), TA.chief_root()                     the two truck roots (truck_api controls: set_wheels, set_door, set_bell, set_beacon)
# The town.blend saved by bl_town.py holds a text block 'TOWN_LIGHT' = the light kind it was saved with; scene['phfd_light'] = the same.
import bpy, math, os, sys
from mathutils import Vector
HERE = os.path.dirname(os.path.abspath(__file__))
AP_SCRIPTS = os.path.normpath(os.path.join(HERE, '..', '..', '..', 'assets_prod', 'scripts'))
if AP_SCRIPTS not in sys.path: sys.path.append(AP_SCRIPTS)

def lin(h):
    h = h.lstrip('#'); v = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return [(c / 12.92 if c <= .04045 else ((c + .055) / 1.055) ** 2.4) for c in v] + [1.]

# LOOK_BIBLE: AM low cream sun from screen left (west-south-west in the yard wide looking north), lavender fill, cornflower sky.
#             DU plum over an apricot band, the sun set behind the north-west houses, sodium street lamp, lit windows, station wall lamp.
LIGHTS = {
    'am': dict(sun_col='#ffd896', sun_e=4.6, sun_az=205., sun_el=17., sky_top='#5c8fea', sky_hor='#d6e2f3', ground='#8a8f86', world=1.0, lamps=0., windows=0.),
    'du': dict(sun_col='#f3a86a', sun_e=1.6, sun_az=150., sun_el=4., sky_top='#5b3f92', sky_hor='#f3a86a', ground='#4a3a5c', world=1.9, lamps=1., windows=3.2),
}
# the same two lights for the three.js kit: film.json places.<name>.light_over (kit dir is three space, Y up: B2T(x, y, z) = (x, z, -y))
def _kit_dir(az, el, d=10.):
    a, e = math.radians(az), math.radians(el); x, y, z = math.cos(e) * math.cos(a) * d, math.cos(e) * math.sin(a) * d, math.sin(e) * d
    return [round(x, 2), round(z, 2), round(-y, 2)]
KIT_LIGHT = {
    'am': dict(top='#5c8fea', hor='#d6e2f3', sun='#ffd896', si=3.0, amb='#a2a8e6', ai=1.25, dir=_kit_dir(205., 17.), tint='#fff6ea', card_gain=1.0),
    'du': dict(top='#5b3f92', hor='#f3a86a', sun='#f3a86a', si=1.9, amb='#b8a2e0', ai=2.6, dir=_kit_dir(150., 8.), tint='#f4dcd4', card_gain=1.0),
}

def _world(sc):
    w = sc.world or bpy.data.worlds.new('TOWN_SKY'); sc.world = w; w.use_nodes = True; nt = w.node_tree; N, L = nt.nodes, nt.links
    if 'town_ramp' in N: return N
    for n in list(N): N.remove(n)
    tc = N.new('ShaderNodeTexCoord'); sp = N.new('ShaderNodeSeparateXYZ'); L.new(tc.outputs['Generated'], sp.inputs[0])
    mr = N.new('ShaderNodeMapRange'); mr.inputs[1].default_value = -.05; mr.inputs[2].default_value = .6; L.new(sp.outputs[2], mr.inputs[0])
    rp = N.new('ShaderNodeValToRGB'); rp.name = 'town_ramp'; L.new(mr.outputs[0], rp.inputs[0])
    els = rp.color_ramp.elements; els[0].position = 0.; els[1].position = 1.; e2 = els.new(.09); e2.position = .09; e3 = els.new(.3); e3.position = .3
    bg = N.new('ShaderNodeBackground'); bg.name = 'town_bg'; L.new(rp.outputs[0], bg.inputs[0]); out = N.new('ShaderNodeOutputWorld'); L.new(bg.outputs[0], out.inputs[0])
    return N

def build_lights(sc, anchors):
    """the sun + the practical lamps (street lamp, station wall lamp, shop amber lamp, the two bays' tubes). They exist in both kinds; set_light switches."""
    def add(name, kind, pos, energy, col, **kw):
        ld = bpy.data.lights.new(name, kind); ld.energy = energy; ld.color = lin(col)[:3]
        for k, v in kw.items(): setattr(ld, k, v)
        o = bpy.data.objects.new(name, ld); o.location = pos; sc.collection.objects.link(o); o['lamp_energy'] = energy; return o
    sun = add('town_sun', 'SUN', (0, 0, 50), 4., '#ffffff', angle=math.radians(.8)); sun['lamp_energy'] = 0
    sl = anchors['street_lamp']; o = add('lamp_street', 'SPOT', (sl[0], sl[1], sl[2] - .15), 12000., '#ffa040', spot_size=math.radians(90), spot_blend=.4, shadow_soft_size=.25)   # FIX 1: a warm sodium pool on road, stop bar and kerb
    o.rotation_euler = (0, 0, 0)
    wl = anchors['wall_lamp']; o = add('lamp_wall', 'SPOT', (wl[0], wl[1] - .1, wl[2] - .1), 900., '#ffd49a', spot_size=math.radians(110), spot_blend=.7, shadow_soft_size=.1); o.rotation_euler = (math.radians(25), 0, 0)
    sp = anchors['shop_lamp']; add('lamp_shop', 'POINT', sp, 120., '#ffb85c', shadow_soft_size=.08)
    add('lamp_shop_fill', 'AREA', (-1.0, -12.3, 3.9), 500., '#ffe0b0', size=6.)
    for bx in (-4.2, 4.2): add('lamp_bay', 'AREA', (bx, 27, 4.4), 900., '#f2f4ea', size=4.)
    add('lamp_porch', 'POINT', (anchors['station_door'][0] + 1.9, anchors['station_door'][1], 2.4), 60., '#ffd49a', shadow_soft_size=.1)
    # FIX 1: the last low sun patch on the park lawn at dusk (row 42 "the last sun patch lies on the lawn"; lifts the dusk park to brightness >= .31)
    tgt = Vector((41.0, -25.0, 0.)); src = tgt + Vector((-.87, .5, 0.)).normalized() * 25. + Vector((0, 0, 4.6))
    o = add('lamp_sunpatch', 'SPOT', src, 45000., '#ffb06a', spot_size=math.radians(38), spot_blend=.5, shadow_soft_size=.6)
    o.rotation_euler = (tgt - src).to_track_quat('-Z', 'Y').to_euler()
    sc['phfd_anchors'] = str(anchors)

def _sun_dir(az, el):
    a, e = math.radians(az), math.radians(el); return -Vector((math.cos(e) * math.cos(a), math.cos(e) * math.sin(a), math.sin(e)))

def set_light(sc, kind):
    P = LIGHTS[kind]; N = _world(sc); rp = N['town_ramp'].color_ramp.elements
    cols = [P['ground'], P['sky_hor'], P['sky_hor'], P['sky_top']]
    for e, c in zip(sorted(rp, key=lambda e: e.position), cols): e.color = lin(c)
    N['town_bg'].inputs[1].default_value = P['world']
    s = bpy.data.objects['town_sun']; s.data.energy = P['sun_e']; s.data.color = lin(P['sun_col'])[:3]
    s.rotation_euler = _sun_dir(P['sun_az'], P['sun_el']).to_track_quat('-Z', 'Y').to_euler()
    for o in sc.objects:
        if o.type == 'LIGHT' and o.name.startswith('lamp_'):            # shop lamp and bay tubes burn by day too (rows 9-12: the amber cone); street, wall, porch lamps at dusk only
            on = 1. if o.name.startswith(('lamp_shop', 'lamp_bay')) else P['lamps']; o.data.energy = o['lamp_energy'] * on; o.hide_render = on == 0
    for m in bpy.data.materials:                                   # lit windows and lamp lenses: emission only at dusk
        b = m.node_tree.nodes.get('Principled BSDF') if m.use_nodes and m.node_tree else None
        if not b: continue
        if m.name.startswith('win_lit'): b.inputs['Emission Strength'].default_value = P['windows']
        if m.name in ('lamp_sodium', 'lamp_warm'): b.inputs['Emission Strength'].default_value = 12. * P['lamps']
        if m.name == 'lamp_fluor': b.inputs['Emission Strength'].default_value = 3. + 4. * P['lamps']
        if m.name.startswith('sign_blade'): b.inputs['Emission Strength'].default_value = .35 * P['lamps']   # FIX 1: retro-reflective blade letters read at dusk
    air = bpy.data.collections.get('AIR')                           # FIX 1: air life of this kind only (air_am_* dust motes, air_du_* moths + lamp mist)
    for o in (air.objects if air else []):
        off = not o.name.startswith('air_' + kind + '_'); o.hide_render = off; o.hide_viewport = off
    for r in (hero_root(), chief_root()):
        if r is not None:
            import truck_api as T
            st = r['town_state'].to_dict() if 'town_state' in r else {}
            st['drain'] = 1.0 if kind == 'du' else 0.0; _paint(r, st)
    sc['phfd_light'] = kind
    t = bpy.data.texts.get('TOWN_LIGHT') or bpy.data.texts.new('TOWN_LIGHT'); t.clear(); t.write(kind)

def _paint(root, st):
    import truck_api as T
    keys = ('paint', 'edge', 'drain', 'masking', 'letters', 'wear', 'ribbon', 'a', 'b'); T.set_paint(root, **{k: st[k] for k in keys if k in st})
    root['town_state'] = st

def hero_root(): return bpy.data.objects.get('HERO_TRUCK')
def chief_root(): return bpy.data.objects.get('CHIEF_TRUCK')

def link_trucks(sc, truck_blend, anchors):
    """the hero truck (bay 1, nose out on the apron) and the Chief's older red pumper (bay 2, nose at the bay door), both from assets_prod/out/truck.blend,
    as independent copies (truck_api.append_truck: own paint materials, so one can be lemon and the other red; drained at dusk)."""
    import truck_api as T
    with bpy.data.libraries.load(truck_blend, link=False) as (src, dst):
        dst.materials = [m for m in src.materials if m in ('mask_paper', 'mask_kraft')]
    for m in bpy.data.materials:
        if m.name in ('mask_paper', 'mask_kraft'): m.use_fake_user = True
    for name, an, st in (('HERO_TRUCK', 'bay1_truck', dict(paint='half', edge=.3, masking=True, letters='under', wear=.25)), ('CHIEF_TRUCK', 'bay2_truck', dict(paint='red', masking=False, letters='over', wear=.9, ribbon=False))):
        root = T.append_truck(truck_blend, name=name + '_COL'); root.name = name
        p = anchors[an]; root.location = (p[0], p[1], p[2]); root.rotation_euler = (0, 0, math.radians(90))   # front (-X) turned to face south (-Y), the street
        _paint(root, st)
    for m in bpy.data.materials: m.use_fake_user = True   # masking swaps the truck's own materials out: unused ones must survive the save (KeyError headlight_glass, 2026-11-20)

def set_trucks(sc, hero=None, chief=None):
    for r, st in ((hero_root(), hero), (chief_root(), chief)):
        if r is not None and st: s = r['town_state'].to_dict() if 'town_state' in r else {}; s.update(st); _paint(r, s)
