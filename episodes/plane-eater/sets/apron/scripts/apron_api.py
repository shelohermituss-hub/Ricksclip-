# apron_api.py: the controls of the AIRFIELD APRON set inside Blender (final render). Twin of sets/apron.js in the kit.
#   import sys; sys.path.append('<sets/apron/scripts>'); import apron_api as AA
#   AA.set_light(bpy.context.scene, 'day' | 'dusk' | 'winter')   Rick recipe light (templates/blender_look/rick_light.json); dusk = hangar work lamps on
#   AA.link_cessna(scene, '<props/out>/cessna150.blend')        appends the hero plane (props-hero's file) onto the Cessna spot (anchor cessna_spot)
# Sun azimuth: from the south-south-east (toward-sun x .55, y -.83) so the hangar front, the plane's left flank and the table side are in full sun,
# the wing's shade falls on the table, and the near tree (south-east of the table) throws its leaf dapple onto the cloth edge and the concrete.
import bpy, json, math, os
from mathutils import Vector
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..', '..'))
RL = json.load(open(os.path.join(ROOT, 'templates', 'blender_look', 'rick_light.json')))
SUN_AZ = {'day': (.55, -.83), 'dusk': (-.9, -.42), 'winter': (.55, -.83)}

def lin(h):
    h = h.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return [x / 12.92 if x <= .04045 else ((x + .055) / 1.055) ** 2.4 for x in c] + [1.0]

def _world(sc):
    w = bpy.data.worlds.get('apron_sky') or bpy.data.worlds.new('apron_sky'); sc.world = w; w.use_nodes = True; N, L = w.node_tree.nodes, w.node_tree.links
    if 'sky_ramp' in N: return N
    for n in list(N): N.remove(n)
    bg_lit = N.new('ShaderNodeBackground'); bg_lit.name = 'sky_fill'; bg_cam = N.new('ShaderNodeBackground'); bg_cam.name = 'sky_cam'
    lp = N.new('ShaderNodeLightPath'); mix = N.new('ShaderNodeMixShader'); out = N.new('ShaderNodeOutputWorld')
    tc = N.new('ShaderNodeTexCoord'); sep = N.new('ShaderNodeSeparateXYZ'); L.new(tc.outputs['Generated'], sep.inputs[0])
    mr = N.new('ShaderNodeMapRange'); mr.inputs['From Max'].default_value = .35; L.new(sep.outputs['Z'], mr.inputs['Value'])
    rp = N.new('ShaderNodeValToRGB'); rp.name = 'sky_ramp'; L.new(mr.outputs[0], rp.inputs[0]); L.new(rp.outputs[0], bg_cam.inputs['Color'])
    L.new(lp.outputs['Is Camera Ray'], mix.inputs[0]); L.new(bg_lit.outputs[0], mix.inputs[1]); L.new(bg_cam.outputs[0], mix.inputs[2]); L.new(mix.outputs[0], out.inputs[0])
    return N

def set_light(sc, kind='day'):
    P = RL['dusk' if kind == 'dusk' else 'day']; N = _world(sc); el = N['sky_ramp'].color_ramp.elements
    el[0].color = lin(P['sky_low']); el[1].color = lin(P['sky_top'])
    N['sky_fill'].inputs['Color'].default_value = lin(P['fill_col']); N['sky_fill'].inputs['Strength'].default_value = P['fill']
    sun = bpy.data.objects.get('apron_sun')
    if sun is None:
        sd = bpy.data.lights.new('apron_sun', 'SUN'); sun = bpy.data.objects.new('apron_sun', sd); sc.collection.objects.link(sun)
    sun.data.energy = P['sun']; sun.data.angle = math.radians(P['sun_angle_deg']); sun.data.color = lin(P['sun_col'])[:3]
    ax, ay = SUN_AZ[kind]; e = math.radians(P['sun_el']); d = Vector((ax * math.cos(e), ay * math.cos(e), math.sin(e)))
    sun.rotation_euler = d.to_track_quat('Z', 'Y').to_euler()
    on = 1. if kind == 'dusk' else 0.
    for o in bpy.data.objects:
        if o.name.startswith('lamp_work') and o.type == 'LIGHT': o.data.energy = o['lamp_energy'] * on
    for m in bpy.data.materials:
        if m.name.startswith('bulb_work'): m.node_tree.nodes['Principled BSDF'].inputs['Emission Strength'].default_value = 6. * on
    sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'None'; sc.view_settings.exposure = P['exposure']
    sc['apron_light'] = kind

def link_cessna(sc, blend, state_coll=None):
    with bpy.data.libraries.load(blend, link=False) as (src, dst): dst.objects = list(src.objects)
    c = bpy.data.collections.get('CESSNA') or bpy.data.collections.new('CESSNA')
    if c.name not in sc.collection.children: sc.collection.children.link(c)
    for o in dst.objects:
        if o is None or o.type in ('CAMERA', 'LIGHT'): continue
        c.objects.link(o)
    return c
