# map_api.py: the controls of PLACE C, THE MAP inside Blender (final render); twins of sets/map.js (kit). import sys; sys.path.append(<scripts>); import map_api as MA
#   MA.set_doors(scene, t, wave=2.4, dur=.5)   door wave west -> east: station i opens over [t0_i, t0_i + dur], t0_i = wave * (x_i - xmin) / (xmax - xmin); t<0 shut, big t open
#   MA.set_paint(scene, t=None, lime=True)      truck noses: all lime/red, or per station by the same wave timing (lime once its door has opened)
#   MA.set_sand(scene, v)                      0..1 the paper around DALLAS turns to sand (S4 -> S5 join)
#   MA.add_field(scene, path=None, n=None)      FIX 2: the dense pop-up field (out/map_field.json, make_field.py): small stations with doors and lime trucks;
#                                              they carry map_station = 'FIELD', so set_doors / set_paint drive them with the same wave. Returns the count.
#   MA.LIGHT / MA.KIT_LIGHT                     bleached map day (Blender sun/sky) and the same for the kit (places.<name>.light_over)
import bpy, math
STUCK = 'DENVER'          # PROPS.md: "one door stuck half up"
def _st(): return [o for o in bpy.data.objects if o.get('map_station')]
def _wave(o, t, wave, dur, xs):
    x0, x1 = min(xs), max(xs); t0 = wave * (o.location.x - x0) / max(1e-6, x1 - x0); return max(0., min(1., (t - t0) / dur))
def set_doors(sc, t=99., wave=2.4, dur=.5):
    st = _st(); xs = [o.location.x for o in st]
    for o in st:
        k = _wave(o, t, wave, dur, xs)
        for i, d in enumerate(c for c in o.children if c.get('map_door') is not None):
            kk = min(k, .5) if (o['map_station'] == STUCK and i == 1) else k; d.scale.z = max(.03, 1 - kk); o['open'] = k
def set_paint(sc, t=None, lime=True, wave=2.4, dur=.5):
    st = _st(); xs = [o.location.x for o in st]; L, R = bpy.data.collections['LIME'], bpy.data.collections['RED']
    for o in st:
        on = lime if t is None else (_wave(o, t, wave, dur, xs) >= 1)
        for c in o.children:
            if c.get('map_truck') is not None: c.instance_collection = L if on else R
def add_field(sc, path=None, n=None):
    """FIX 2: linked copies of st_00 (no sign) at the field points; idempotent (a second call returns the existing count)."""
    import json, os
    old = bpy.data.collections.get('FIELD')
    if old: return len([o for o in old.objects if o.get('map_station') == 'FIELD'])
    path = path or os.path.join(os.path.dirname(bpy.data.filepath), 'map_field.json'); F = json.load(open(path))['field'][:n]
    st0 = bpy.data.objects['st_00']; col = bpy.data.collections.new('FIELD'); sc.collection.children.link(col)
    doors0 = [c for c in st0.children if c.get('map_door') is not None]; trucks0 = [c for c in st0.children if c.get('map_truck') is not None]
    for i, (x, y, z, s) in enumerate(F):
        r = bpy.data.objects.new('fs_%03d' % i, st0.data); col.objects.link(r); r.location = (x, y, z); r.scale = (s, s, s); r['map_station'] = 'FIELD'
        for d0 in doors0:
            d = bpy.data.objects.new('%s_door%d' % (r.name, d0['map_door']), d0.data); col.objects.link(d); d.parent = r
            d.location = d0.location; d.scale = d0.scale; d['map_door'] = d0['map_door']
        for t0 in trucks0:
            e = bpy.data.objects.new('%s_truck%d' % (r.name, t0['map_truck']), None); col.objects.link(e); e.instance_type = 'COLLECTION'
            e.instance_collection = t0.instance_collection; e.parent = r; e.location = t0.location; e.rotation_euler = t0.rotation_euler; e.scale = t0.scale; e['map_truck'] = t0['map_truck']
    return len(F)
def set_sand(sc, v):
    o = bpy.data.objects.get('sand_blend'); m = bpy.data.materials['sand_blend']; m.node_tree.nodes['SAND'].outputs[0].default_value = v
    if o: o.hide_render = v <= 0
LIGHT = dict(sun='#fff4e2', sun_e=2.6, sun_az=232., sun_el=52., sky_top='#8fb3ef', sky_hor='#e9eef4', world=.55)
KIT_LIGHT = dict(top='#8fb3ef', hor='#e9eef4', sun='#fff4e2', si=2.4, amb='#c9d3ee', ai=1.0, tint='#fffaf0', card_gain=1.0,
                 dir=[round(10 * math.cos(math.radians(52)) * math.cos(math.radians(232)), 2), round(10 * math.sin(math.radians(52)), 2), round(-10 * math.cos(math.radians(52)) * math.sin(math.radians(232)), 2)])
