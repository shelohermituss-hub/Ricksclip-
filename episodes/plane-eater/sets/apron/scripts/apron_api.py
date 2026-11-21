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

EXPO_DAY = -0.3   # FIX 2 (lead): exposure down for the day; the camera sky is lifted by 2**0.3 so its colour stays #0f79e8

def _world(sc):
    """camera + glossy rays see the deep flat blue with white cumulus LOW over the horizon (style-test recipe, episodes/_style_test/look/assemble.py);
    all other rays get the blue-violet fill (Light Path mix)."""
    w = bpy.data.worlds.get('apron_sky') or bpy.data.worlds.new('apron_sky'); sc.world = w; w.use_nodes = True; N, L = w.node_tree.nodes, w.node_tree.links
    if 'sky_ramp' in N: return N
    for n in list(N): N.remove(n)
    tc = N.new('ShaderNodeTexCoord'); nzv = N.new('ShaderNodeVectorMath'); nzv.operation = 'NORMALIZE'; L.new(tc.outputs['Generated'], nzv.inputs[0])
    sp_ = N.new('ShaderNodeSeparateXYZ'); L.new(nzv.outputs[0], sp_.inputs[0])
    mr = N.new('ShaderNodeMapRange'); mr.inputs[1].default_value = 0.; mr.inputs[2].default_value = .7; L.new(sp_.outputs[2], mr.inputs[0])
    rp = N.new('ShaderNodeValToRGB'); rp.name = 'sky_ramp'; L.new(mr.outputs[0], rp.inputs[0])
    dv = N.new('ShaderNodeVectorMath'); dv.operation = 'DIVIDE'; L.new(nzv.outputs[0], dv.inputs[0])
    cz = N.new('ShaderNodeCombineXYZ'); L.new(sp_.outputs[2], cz.inputs[0]); L.new(sp_.outputs[2], cz.inputs[1]); cz.inputs[2].default_value = 1.
    mx_ = N.new('ShaderNodeVectorMath'); mx_.operation = 'MAXIMUM'; L.new(cz.outputs[0], mx_.inputs[0]); mx_.inputs[1].default_value = (.12, .12, 1.); L.new(mx_.outputs[0], dv.inputs[1])
    nb = N.new('ShaderNodeTexNoise'); nb.noise_dimensions = '2D'; nb.inputs['Scale'].default_value = 1.3; nb.inputs['Detail'].default_value = 7.; nb.inputs['Roughness'].default_value = .55
    L.new(dv.outputs[0], nb.inputs['Vector'])
    cr = N.new('ShaderNodeMapRange'); cr.inputs[1].default_value = .52; cr.inputs[2].default_value = .62; L.new(nb.outputs['Fac'], cr.inputs[0])
    b1 = N.new('ShaderNodeMapRange'); b1.interpolation_type = 'SMOOTHSTEP'; L.new(sp_.outputs[2], b1.inputs[0]); b1.inputs[1].default_value = .1; b1.inputs[2].default_value = .16
    b2 = N.new('ShaderNodeMapRange'); b2.interpolation_type = 'SMOOTHSTEP'; L.new(sp_.outputs[2], b2.inputs[0]); b2.inputs[1].default_value = .36; b2.inputs[2].default_value = .52
    b2.inputs[3].default_value = 1.; b2.inputs[4].default_value = 0.
    cm = N.new('ShaderNodeMath'); cm.operation = 'MULTIPLY'; L.new(b1.outputs[0], cm.inputs[0]); L.new(b2.outputs[0], cm.inputs[1])
    cm2 = N.new('ShaderNodeMath'); cm2.operation = 'MULTIPLY'; cm2.use_clamp = True; L.new(cr.outputs[0], cm2.inputs[0]); L.new(cm.outputs[0], cm2.inputs[1])
    shd = N.new('ShaderNodeMapRange'); shd.inputs[1].default_value = .55; shd.inputs[2].default_value = .74; L.new(nb.outputs['Fac'], shd.inputs[0])
    cc = N.new('ShaderNodeMix'); cc.data_type = 'RGBA'; L.new(shd.outputs[0], cc.inputs['Factor']); cc.inputs['A'].default_value = lin('#b5cbf3'); cc.inputs['B'].default_value = lin('#ffffff')
    sky = N.new('ShaderNodeMix'); sky.data_type = 'RGBA'; L.new(cm2.outputs[0], sky.inputs['Factor']); L.new(rp.outputs[0], sky.inputs['A']); L.new(cc.outputs['Result'], sky.inputs['B'])
    bg_cam = N.new('ShaderNodeBackground'); bg_cam.name = 'sky_cam'; L.new(sky.outputs['Result'], bg_cam.inputs[0])
    bg_lit = N.new('ShaderNodeBackground'); bg_lit.name = 'sky_fill'
    lp = N.new('ShaderNodeLightPath'); orr = N.new('ShaderNodeMath'); orr.operation = 'MAXIMUM'; L.new(lp.outputs['Is Camera Ray'], orr.inputs[0]); L.new(lp.outputs['Is Glossy Ray'], orr.inputs[1])
    mix = N.new('ShaderNodeMixShader'); L.new(orr.outputs[0], mix.inputs[0]); L.new(bg_lit.outputs[0], mix.inputs[1]); L.new(bg_cam.outputs[0], mix.inputs[2])
    out = N.new('ShaderNodeOutputWorld'); L.new(mix.outputs[0], out.inputs[0])
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
    sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'None'; ex = P['exposure'] + (EXPO_DAY if kind != 'dusk' else 0.); sc.view_settings.exposure = ex; N['sky_cam'].inputs[1].default_value = 2 ** (-ex)
    sc['apron_light'] = kind

def link_cessna(sc, blend, state_coll=None):
    with bpy.data.libraries.load(blend, link=False) as (src, dst): dst.objects = list(src.objects)
    c = bpy.data.collections.get('CESSNA') or bpy.data.collections.new('CESSNA')
    if c.name not in sc.collection.children: sc.collection.children.link(c)
    for o in dst.objects:
        if o is None or o.type in ('CAMERA', 'LIGHT'): continue
        c.objects.link(o)
    return c
