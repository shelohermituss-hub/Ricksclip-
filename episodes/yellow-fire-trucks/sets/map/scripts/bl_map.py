# bl_map.py: builds PLACE C, THE MAP (S4, line 7) in Blender: out/map.blend (final) + out/map_meta.json. Re-runnable.
# blender -b --factory-startup --python bl_map.py -- <assets/map> <build/tex> <assets_prod> <out>
# Frame: metres, Z up, map centre (0,0), north +Y. Geography: map_geo.py. Controls: map_api.py. Prints MAP_DONE.
import bpy, bmesh, sys, os, json, math, random
from mathutils import Vector
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE); import map_geo as G, map_api as MA
a = sys.argv[sys.argv.index('--') + 1:]; AM, TEX, AP, OUT = [os.path.abspath(x) for x in a[:4]]; os.makedirs(OUT, exist_ok=True)
sys.path.append(os.path.join(AP, 'scripts')); import truck_api as T
bpy.ops.wm.read_factory_settings(use_empty=True); sc = bpy.context.scene; TM = json.load(open(os.path.join(TEX, 'tex_meta.json')))
def lin(h): return T.lin(h)
def col(name):
    c = bpy.data.collections.get(name) or bpy.data.collections.new(name)
    if c.name not in sc.collection.children: sc.collection.children.link(c)
    return c
def img(p, non_color=False):
    i = bpy.data.images.load(p, check_existing=True)
    if non_color: i.colorspace_settings.name = 'Non-Color'
    return i
def mat(name, color='#ffffff', rough=.7, metal=0., image=None, nor=None, nor_scale=1., uv_scale=(1, 1), alpha_img=False, emit=0.):
    m = bpy.data.materials.new(name); m.use_nodes = True; N, L = m.node_tree.nodes, m.node_tree.links; b = N['Principled BSDF']
    b.inputs['Base Color'].default_value = lin(color); b.inputs['Roughness'].default_value = rough; b.inputs['Metallic'].default_value = metal
    uv = None
    if image or nor:
        tc = N.new('ShaderNodeTexCoord'); mp = N.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value = (uv_scale[0], uv_scale[1], 1); L.new(tc.outputs['UV'], mp.inputs[0]); uv = mp
    if image:
        t = N.new('ShaderNodeTexImage'); t.image = img(image); L.new(N['Mapping'].outputs[0] if uv_scale == (1, 1) else uv.outputs[0], t.inputs[0])
        if color.lower() != '#ffffff':
            mx = N.new('ShaderNodeMix'); mx.data_type = 'RGBA'; mx.blend_type = 'MULTIPLY'; mx.inputs['Factor'].default_value = 1.; L.new(t.outputs[0], mx.inputs['A']); mx.inputs['B'].default_value = lin(color); L.new(mx.outputs['Result'], b.inputs['Base Color'])
        else: L.new(t.outputs[0], b.inputs['Base Color'])
        if alpha_img: L.new(t.outputs['Alpha'], b.inputs['Alpha'])
    if nor:
        tn = N.new('ShaderNodeTexImage'); tn.image = img(nor, True); mp2 = N.new('ShaderNodeMapping'); mp2.inputs['Scale'].default_value = (nor_scale, nor_scale * .625, 1)
        L.new(N['Texture Coordinate'].outputs['UV'], mp2.inputs[0]); L.new(mp2.outputs[0], tn.inputs[0]); nm = N.new('ShaderNodeNormalMap'); L.new(tn.outputs[0], nm.inputs['Color']); nm.inputs['Strength'].default_value = .6; L.new(nm.outputs[0], b.inputs['Normal'])
    if emit: b.inputs['Emission Color'].default_value = lin(color); b.inputs['Emission Strength'].default_value = emit
    return m
def obj(name, me, c, m=None):
    o = bpy.data.objects.new(name, me); c.objects.link(o)
    if m and not me.materials: me.materials.append(m)
    return o
def box(bm, x0, y0, z0, x1, y1, z1, mi=0):
    vs = [bm.verts.new(v) for v in [(x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0), (x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1)]]
    for f in [(0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)]:
        fa = bm.faces.new([vs[i] for i in f]); fa.material_index = mi
def cyl(bm, x, y, z0, r, h, n=10, mi=0, cone=False):
    ret = bmesh.ops.create_cone(bm, cap_ends=True, segments=n, radius1=r, radius2=0 if cone else r, depth=h)
    for v in ret['verts']: v.co += Vector((x, y, z0 + h / 2))
    for f in {f for v in ret['verts'] for f in v.link_faces}: f.material_index = mi
def grid(name, x0, y0, x1, y1, nx, ny, lift, c, m, win=None):
    bm = bmesh.new(); uvl = bm.loops.layers.uv.new('UVMap'); V = {}
    for j in range(ny + 1):
        for i in range(nx + 1):
            x = x0 + (x1 - x0) * i / nx; y = y0 + (y1 - y0) * j / ny; V[i, j] = bm.verts.new((x, y, G.fold_z(x, y) + lift))
    W = win or (-16, -10, 16, 10)
    for j in range(ny):
        for i in range(nx):
            f = bm.faces.new([V[i, j], V[i + 1, j], V[i + 1, j + 1], V[i, j + 1]]); f.smooth = True
            for l in f.loops: l[uvl].uv = ((l.vert.co.x - W[0]) / (W[2] - W[0]), (l.vert.co.y - W[1]) / (W[3] - W[1]))
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free(); return obj(name, me, c, m)
CM = col('MAP'); CS = col('STATIONS'); CP = col('PROPS')
# --- table (Poly Haven wood_table_worn, CC0) and the paper map (ambientCG Paper001 grain, CC0, under the painted print)
tw = mat('table_wood', '#ffffff', .55, image=os.path.join(AM, 'tex', 'wood_table_worn_diff_1k.jpg'), uv_scale=(5, 3.5), nor=os.path.join(AM, 'tex', 'wood_table_worn_nor_gl_1k.jpg'), nor_scale=5)
bm = bmesh.new(); bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=50); uvl = bm.loops.layers.uv.verify()
for f in bm.faces:
    for l in f.loops: l[uvl].uv = (l.vert.co.x / 100 + .5, l.vert.co.y / 100 + .5)
for v in bm.verts: v.co.y *= .7; v.co.z = -.02
me = bpy.data.meshes.new('table'); bm.to_mesh(me); bm.free(); obj('table', me, CM, tw)
paper_nor = os.path.join(AM, 'acg', 'Paper001', 'Paper001_2K-JPG_NormalGL.jpg')
mp = mat('map_paper', '#ffffff', .82, image=os.path.join(TEX, 'map_print.jpg'), nor=paper_nor, nor_scale=16)
grid('MAP_PAPER', -16, -10, 16, 10, 320, 200, 0, CM, mp)
for k, w in TM['insets'].items():
    mi = mat('inset_' + k, '#ffffff', .82, image=os.path.join(TEX, 'inset_%s.jpg' % k), nor=paper_nor, nor_scale=1.6)
    grid('inset_' + k, w[0], w[1], w[2], w[3], 64, 64, .004, CM, mi, w)
dx, dy = G.ll(*G.CITIES['DALLAS'])
ms = mat('sand_blend', '#ffffff', .95, image=os.path.join(TEX, 'sand_dallas.png'), alpha_img=True)
N, L = ms.node_tree.nodes, ms.node_tree.links; v = N.new('ShaderNodeValue'); v.name = 'SAND'; v.outputs[0].default_value = 0.; mm = N.new('ShaderNodeMath'); mm.operation = 'MULTIPLY'
L.new(N['Image Texture'].outputs['Alpha'], mm.inputs[0]); L.new(v.outputs[0], mm.inputs[1]); L.new(mm.outputs[0], N['Principled BSDF'].inputs['Alpha'])
sb = grid('sand_blend', dx - 3, dy - 3.2, dx + 3, dy + 2.8, 48, 48, .008, CM, ms, (dx - 3, dy - 3.2, dx + 3, dy + 2.8)); sb.hide_render = True
# --- the pop-up station model (one mesh shared by all; signs, doors and trucks per station)
m_wall = mat('st_wall', '#ffffff', .8, image=os.path.join(TEX, 'wall.png'), uv_scale=(1, 1)); m_navy = mat('st_navy', '#27365A', .5)
m_roof = mat('st_roof', '#ffffff', .9, image=os.path.join(TEX, 'roof.png')); m_in = mat('st_inside', '#5b5650', .9); m_card = mat('st_card', '#efe6cf', .85)
m_win = mat('st_window', '#3c4a66', .15, .2); m_conc = mat('st_apron', '#b9b2a2', .9); m_brass = mat('st_brass', '#c9a24a', .3, 1.)
m_door = mat('st_door', '#ffffff', .6, image=os.path.join(TEX, 'door.png')); m_sign = mat('st_sign', '#ffffff', .6, image=os.path.join(TEX, 'signs.png'))
SW, SD, SH = .8, .78, .40; hx, hy = SW / 2, SD / 2
bm = bmesh.new()
box(bm, -hx - .06, -hy - .17, 0, hx + .06, hy + .04, .006, 4)            # card base tab and printed apron
box(bm, -hx + .02, -hy - .16, .006, hx - .02, -hy, .010, 6)                 # concrete apron
for x0, x1 in ((-hx, -hx + .05), (-.03, .03), (hx - .05, hx)): box(bm, x0, -hy, 0, x1, -hy + .02, SH, 0)   # front piers
box(bm, -hx, -hy, .30, hx, -hy + .02, SH, 0)                                # lintel
for s in (-1, 1): box(bm, s * hx - (.012 if s > 0 else 0), -hy, 0, s * hx + (.012 if s < 0 else 0), hy, SH, 0)  # side walls
box(bm, -hx, hy - .012, 0, hx, hy, SH, 0)                                   # back wall
box(bm, -hx + .012, -hy + .02, .006, hx - .012, hy - .012, .008, 3)         # bay floor
box(bm, -hx + .012, hy - .03, .008, hx - .012, hy - .012, SH - .01, 3)      # inside back
box(bm, -hx - .012, -hy - .012, SH, hx + .012, hy + .012, SH + .014, 1)     # navy cornice band
box(bm, -hx - .006, -hy - .006, SH + .014, hx + .006, hy + .006, SH + .05, 0)  # parapet
box(bm, -hx + .01, -hy + .01, SH + .02, hx - .01, hy - .01, SH + .03, 2)    # roof
for x in (-.355, -.025, .025, .355): box(bm, x - .006 if x > 0 else x - .006, -hy - .008, 0, x + .006, -hy, .30, 1)   # navy door frames
box(bm, -.36, -hy - .008, .296, .36, -hy, .306, 1)
for i in range(3): box(bm, hx, -.25 + i * .22, .17, hx + .004, -.13 + i * .22, .27, 5)   # east side windows
box(bm, -hx - .17, hy - .3, 0, -hx, hy - .14, .80, 0)                         # hose tower (west, like the town)
for z in (.38, .55, .68): box(bm, -hx - .13, hy - .304, z, -hx - .04, hy - .3, z + .07, 5)
box(bm, -hx - .18, hy - .31, .80, -hx + .01, hy - .13, .82, 1); cyl(bm, -hx - .085, hy - .22, .82, .13, .12, 4, 2, cone=True)
cyl(bm, 0, -hy - .03, .335 + .0, .012, .015, 8, 7); cyl(bm, 0, -hy - .03, .35, .02, .025, 10, 1, cone=True)    # wall lamp
cyl(bm, .22, -.05, SH + .03, .035, .045, 10, 7); cyl(bm, -.15, .15, SH + .03, .02, .05, 8, 1); cyl(bm, .1, .2, SH + .03, .02, .05, 8, 1)   # bell + vents
cyl(bm, hx + .03, -hy - .08, 0, .006, .62, 6, 7); cyl(bm, hx + .03, -hy - .08, .62, .012, .012, 8, 7)        # flag pole (no flag), brass ball
for x in (-hx - .06, hx + .06):                                             # folded paper tabs, the pop-up glue flaps
    box(bm, x - .03, -hy, 0, x + .03, hy, .004, 4)
uvl = bm.loops.layers.uv.verify()
for f in bm.faces:
    n = f.normal
    for l in f.loops:
        c = l.vert.co; l[uvl].uv = ((c.x + c.y) * 1.6, c.z * 1.6) if abs(n.z) < .5 else (c.x * 1.6, c.y * 1.6)
me_st = bpy.data.meshes.new('station'); bm.to_mesh(me_st); bm.free()
for m in (m_wall, m_navy, m_roof, m_in, m_card, m_win, m_conc, m_brass): me_st.materials.append(m)
bm = bmesh.new(); box(bm, -.16, -.004, -.30, .16, .004, 0, 0); uvl = bm.loops.layers.uv.verify()
for f in bm.faces:
    for l in f.loops: l[uvl].uv = ((l.vert.co.x + .16) / .32, (l.vert.co.z + .30) / .30)
me_door = bpy.data.meshes.new('door'); bm.to_mesh(me_door); bm.free(); me_door.materials.append(m_door)
# trucks: truck_light (assets_prod) appended twice, painted lime #E3EA22 and red; instanced in every bay (Cycles instances are free)
lime = T.append_truck(os.path.join(AP, 'out', 'truck_light.blend'), 'LIME'); red = T.append_truck(os.path.join(AP, 'out', 'truck_light.blend'), 'RED')
for r_, p in ((lime, 'lemon'), (red, 'red')):
    try: T.set_extras(r_, 0, False, False)
    except Exception as e: print('EXTRAS', e)
    T.set_paint(r_, paint=p, masking=None, letters='over', wear=.3, ribbon=False)
for n in ('LIME', 'RED'): bpy.context.view_layer.layer_collection.children[n].exclude = True
TS = .088
stations = []
for idx, (c, x, y) in enumerate(G.stations()):
    sx, sy = x, y + G.STATION_OFF; z = max(G.fold_z(sx + u, sy + v) for u in (-.45, 0, .45) for v in (-.55, 0, .45)) - .004
    root = obj('st_%02d' % idx, me_st, CS); root.location = (sx, sy, z); root['map_station'] = c
    me_s = bpy.data.meshes.new('sign_%02d' % idx); bm = bmesh.new(); uvl = bm.loops.layers.uv.verify(); cell = TM['cells'][c]
    vs = [bm.verts.new(v) for v in [(-.3, -hy - .009, .312), (.3, -hy - .009, .312), (.3, -hy - .009, .388), (-.3, -hy - .009, .388)]]; f = bm.faces.new(vs)
    for l, uv in zip(f.loops, [(cell[0], cell[1]), (cell[2], cell[1]), (cell[2], cell[3]), (cell[0], cell[3])]): l[uvl].uv = uv
    bm.to_mesh(me_s); bm.free(); me_s.materials.append(m_sign); so = obj('sign_%02d' % idx, me_s, CS); so.parent = root
    doors = []
    for i, cx in enumerate((-.19, .19)):
        d = obj('door_%02d_%d' % (idx, i), me_door, CS); d.parent = root; d.location = (cx, -hy + .004, .30); d['map_door'] = i; doors.append([round(sx + cx, 3), round(sy - hy, 3), round(z + .15, 3)])
        e = bpy.data.objects.new('truck_%02d_%d' % (idx, i), None); CS.objects.link(e); e.instance_type = 'COLLECTION'; e.instance_collection = bpy.data.collections['LIME']
        e.parent = root; e.location = (cx, -.02, .008); e.rotation_euler.z = math.pi / 2; e.scale = (TS, TS, TS); e['map_truck'] = i
    stations.append(dict(city=c, pos=[round(sx, 3), round(sy, 3), round(z, 3)], doors=doors))
# --- ready-made table props (Poly Haven CC0): brass compass, magnifying glass, measuring tape, model pines round the home station
def gltf(p, name, size, loc, rotz=0., c=CP, axis=None):
    before = set(bpy.data.objects); bpy.ops.import_scene.gltf(filepath=p); new = [o for o in bpy.data.objects if o not in before]
    for o in new:
        for cc in list(o.users_collection): cc.objects.unlink(o)
        c.objects.link(o)
    tops = [o for o in new if o.parent is None]; e = bpy.data.objects.new(name, None); c.objects.link(e)
    for o in tops: o.parent = e
    bpy.context.view_layer.update(); pts = [o.matrix_world @ Vector(b) for o in new if o.type == 'MESH' for b in o.bound_box]
    lo = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts))); hi = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    s = size / max((hi - lo)[i] for i in range(3)) if axis is None else size / (hi - lo)[axis]
    e.scale = (s, s, s); e.rotation_euler.z = rotz; bpy.context.view_layer.update()
    pts = [o.matrix_world @ Vector(b) for o in new if o.type == 'MESH' for b in o.bound_box]; mz = min(p.z for p in pts)
    e.location = (loc[0], loc[1], loc[2] - mz); return e, new
PH = os.path.join(AM, 'ph')
gltf(os.path.join(PH, 'seadogs_compass', 'seadogs_compass.gltf'), 'compass', 2.4, (12.9, -4.3, G.fold_z(12.9, -4.3)), .5)
gltf(os.path.join(PH, 'magnifying_glass_01', 'magnifying_glass_01.gltf'), 'magnifier', 7.5, (-14.8, -12.6, 0.0), 2.4)
gltf(os.path.join(PH, 'measuring_tape_01', 'measuring_tape_01.gltf'), 'tape_measure', 2.0, (17.6, 6.0, -.02), .9)
px, py = G.ll(*G.CITIES['PINE HOLLOW']); pine, pnew = gltf(os.path.join(PH, 'pine_sapling_small', 'pine_sapling_small.gltf'), 'pine_proto', .34, (px - .75, py + .9, G.fold_z(px - .75, py + .9)), 0, axis=2)
rr = random.Random(4)
for k, (u, v) in enumerate([(-.7, .3), (-.78, .62), (.62, .95), (.75, .55), (-.55, 1.05), (.25, 1.12), (.9, .2), (-.95, .0), (.95, -.4)]):
    e = pine.copy(); CP.objects.link(e); s = rr.uniform(.8, 1.25); e.scale = tuple(pine.scale[i] * s for i in range(3)); e.rotation_euler.z = rr.uniform(0, 6.3)
    e.location = (px + u, py + v, pine.location.z - G.fold_z(px - .75, py + .9) + G.fold_z(px + u, py + v)); e.name = 'pine_%d' % k
    for ch in pine.children:
        d = ch.copy(); d.parent = e; CP.objects.link(d)
# pushpins (navy and cream heads) at four cities on the home route; a pencil (natural wood, brass ferrule, grey eraser) on the margin
m_pin = [mat('pin_navy', '#27365A', .25), mat('pin_cream', '#efe6cf', .3)]; m_steel = mat('pin_steel', '#c8c8cc', .2, 1.)
for k, cty in enumerate(['LITTLE ROCK', 'TEXARKANA', 'MEMPHIS', 'KANSAS CITY']):
    x, y = G.ll(*G.CITIES[cty]); x += .25; y -= .5; bm = bmesh.new(); cyl(bm, 0, 0, 0, .012, .25, 8, 1); cyl(bm, 0, 0, .25, .09, .05, 16, 0); cyl(bm, 0, 0, .3, .055, .12, 16, 0)
    me = bpy.data.meshes.new('pin'); bm.to_mesh(me); bm.free(); me.materials.append(m_pin[k % 2]); me.materials.append(m_steel); o = obj('pin_%d' % k, me, CP); o.location = (x, y, G.fold_z(x, y) - .05)
m_wood = mat('pencil_wood', '#d9b88a', .6); m_lead = mat('pencil_lead', '#3a3a3e', .4); m_fer = mat('pencil_ferrule', '#c9a24a', .25, 1.); m_er = mat('pencil_eraser', '#9a958f', .9); m_pp = mat('pencil_paint', '#5f7a52', .45)
bm = bmesh.new(); cyl(bm, 0, 0, 0, .12, 5.6, 6, 0); cyl(bm, 0, 0, 5.6, .12, .55, 6, 1, cone=True); cyl(bm, 0, 0, -.35, .125, .35, 16, 2); cyl(bm, 0, 0, -.7, .12, .35, 16, 3)
me = bpy.data.meshes.new('pencil'); bm.to_mesh(me); bm.free()
for m in (m_pp, m_wood, m_fer, m_er): me.materials.append(m)
pc = obj('pencil', me, CP); pc.rotation_euler = (0, math.pi / 2, .18); pc.location = (-6.5, -9.0, .13)
# --- light: bleached map day (map_api.LIGHT), Cycles, Standard view
L_ = MA.LIGHT; sun = bpy.data.lights.new('sun', 'SUN'); sun.energy = L_['sun_e']; sun.color = lin(L_['sun'])[:3]; sun.angle = math.radians(1.2)
so = bpy.data.objects.new('sun', sun); sc.collection.objects.link(so); az, el = math.radians(L_['sun_az']), math.radians(L_['sun_el'])
so.rotation_euler = (Vector((math.cos(el) * math.cos(az), math.cos(el) * math.sin(az), math.sin(el)))).to_track_quat('Z', 'Y').to_euler()
w = bpy.data.worlds.new('MAP_SKY'); sc.world = w; w.use_nodes = True; bg = w.node_tree.nodes['Background']; bg.inputs[0].default_value = lin('#c4d6f2'); bg.inputs[1].default_value = L_['world']
sc.view_settings.view_transform = 'Standard'; sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = 16; sc.cycles.use_denoising = True
MA.set_doors(sc, 99.); MA.set_paint(sc, lime=True)
anch = dict(map_centre=[0, 0, 0], pine_hollow_station=next(s['pos'] for s in stations if s['city'] == 'PINE HOLLOW'),
            dallas_label=[round(dx, 3), round(dy - .2 - .3 * .45, 3), round(G.fold_z(dx, dy - .335), 3)], dallas_station=next(s['pos'] for s in stations if s['city'] == 'DALLAS'),
            door_row=sorted([d + [s['city']] for s in stations for d in s['doors']], key=lambda d: d[0]),
            highway_path=[[round(x, 3), round(y, 3), round(G.fold_z(x, y) + .01, 3)] for x, y in G.wiggle([G.ll(*G.CITIES[c]) for c in G.HOME_ROUTE], 10, .03, 5)],
            title_block=[-12.0, -7.6, .05], compass=[12.9, -4.3, .1], cities={c: [x, y, round(G.fold_z(x, y), 3)] for c, (x, y) in TM['cities'].items()})
json.dump(dict(anchors=anch, stations=stations, light=dict(map=MA.KIT_LIGHT), truck_scale=TS, insets=TM['insets']), open(os.path.join(OUT, 'map_meta.json'), 'w'), indent=1)
tri = 0
for o in bpy.data.objects:
    if o.type == 'MESH': o.data.calc_loop_triangles(); tri += len(o.data.loop_triangles)
print('MAP_TRIS', tri, 'STATIONS', len(stations))
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, 'map.blend'), compress=True)
print('MAP_DONE')
