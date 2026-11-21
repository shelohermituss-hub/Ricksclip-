# ================================================================== ANCHORS (plan metres; the kit reads them from out/dallas_meta.json)
anchor('truck_red', -3.2, 12.0, .12); anchor('truck_lime', 3.2, 12.0, .12)
anchor('clerk_spot', 0.0, NOSE - .75, .12); anchor('board_red_foot', BRX, BY - .3, .12); anchor('board_lime_foot', BLX, BY - .3, .12)
anchor('board_red_top_1', BRX, BY - .03, BZ + BH_); anchor('board_red_top_2', BRX, BY - .03, z2 + BH_); anchor('board_red_top_3', BRX, BY - .03, z3 + BH_)
anchor('up_to_3x', BRX, BY - .03, z3 + BH_ - .55); anchor('board_lime_top', BLX, BY - .03, BZ + BH_); anchor('calendar', 0, BY - .03, 2.0)
anchor('ladder_foot', LF[0], LF[1], .12); anchor('ladder_top', BRX, BY - .12, LZ); anchor('stool', BRX - .1, NOSE - .55, .12); anchor('chalk_table', 2.1, NOSE - .6, .66)
anchor('station_door', DX, SY - .6, .12); anchor('bay_red', BAYS[0], SY, .12); anchor('bay_lime', BAYS[1], SY, .12); anchor('sign_front', 0, SY - .05, BH + 1.17)
anchor('station_plate', DX + 1.95, SY - .05, 3.15); anchor('cooler', GX, GY, .93); anchor('yard_centre', 0, 6.0, .12)
# ================================================================== merge the coded parts by (material, story group): fewer draw calls, switches kept as nodes
groups = {}
for o in list(TOWN.objects):
    if o.get('merge') and o.type == 'MESH': groups.setdefault((o.data.materials[0].name, o.get('grp', '')), []).append(o)
for (mname, g), objs in groups.items():
    if len(objs) >= 2:
        with bpy.context.temp_override(active_object=objs[0], selected_editable_objects=objs, selected_objects=objs): bpy.ops.object.join()
    objs[0].name = 'dal_%s%s' % (('%s__' % g) if g else '', mname); objs[0]['grp'] = g
print('MERGED', len(groups), 'groups; objects now', len(TOWN.objects))
# ================================================================== lights, world, trucks, save, export (full GLB and LITE GLB from the same objects)
TA.build_lights(SC, ANCH)
spots = TA.link_trucks(SC, os.path.join(AP, 'out', 'truck.blend'), ANCH, NOSE - .02)
for k, v in spots.items(): ANCH[k] = v
TA.set_light(SC); TA.set_boards(SC, n=3, ladder=True, stool=False, painters=True, leaves=0)
meta = dict(anchors=ANCH, frame='metres, X east, Y north, Z up (plan frame)', light=TA.KIT_LIGHT,
            groups=dict(stack2='red board 2', stack3='red board 3 + UP TO 3x', ladder='sectioned ladder', stool='step stool', painters="painters' gear (line 13)", cal1='YEAR 1 leaf', cal2='YEAR 2', cal3='YEAR 3', cal4='YEAR 4'))
tot = sum(sum(len(p.vertices) - 2 for p in o.data.polygons) for o in TOWN.objects if o.type == 'MESH')
print('DALLAS_TRIS_BLEND', tot, 'OBJECTS', len(TOWN.objects))
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, 'dallas.blend'), relative_remap=True)
for m in bpy.data.materials:
    b_ = m.node_tree.nodes.get('Principled BSDF') if m.node_tree else None
    if b_ and m.name.startswith('lamp_'): b_.inputs['Emission Strength'].default_value = 1.   # glTF drops emission 0 (LECONS 2026-11-20)
def export(fname, f):
    """heavy templates swapped for a decimated copy (ratio heavy * f); every other mesh as built. Instanced meshes count once per copy in the kit."""
    keep = {o.name: o.data for o in TOWN.objects if o.type == 'MESH'}; swap = {}
    for nm, t in TPLS.items():
        r = t.get('heavy') or (.3 if len(t.data.polygons) > 20000 else None)
        if not r: continue
        lo = bpy.data.objects.new('lo_' + nm, t.data.copy()); SC.collection.objects.link(lo); md = lo.modifiers.new('dec', 'DECIMATE'); md.ratio = max(.02, r * f)
        dg = bpy.context.evaluated_depsgraph_get(); dg.update(); me = bpy.data.meshes.new_from_object(lo.evaluated_get(dg)); swap[t.data.name] = me
        print('DECIMATE', fname, nm, len(t.data.polygons), '->', len(me.polygons)); bpy.data.objects.remove(lo)
    for o in TOWN.objects:
        if o.type == 'MESH' and o.data.name in swap: o.data = swap[o.data.name]
    for o in bpy.context.scene.objects: o.select_set(False)
    for o in TOWN.objects: o.select_set(o.type == 'MESH' or o.type == 'EMPTY')
    bpy.ops.export_scene.gltf(filepath=os.path.join(OUT, fname), export_format='GLB', use_selection=True, export_apply=True, export_lights=False, export_cameras=False,
                              export_extras=True, export_image_format='JPEG', export_image_quality=82)
    gt = sum(sum(len(p.vertices) - 2 for p in o.data.polygons) for o in TOWN.objects if o.type == 'MESH')
    for o in TOWN.objects:
        if o.name in keep: o.data = keep[o.name]
    print('GLB', fname, 'TRIS_PER_INSTANCE', gt, 'MB %.1f' % (os.path.getsize(os.path.join(OUT, fname)) / 1e6)); return gt
meta['glb_tris'] = export('dallas.glb', 1.0); meta['lite_tris'] = export('dallas_lite.glb', .3); meta['blend_tris'] = tot
json.dump(meta, open(os.path.join(OUT, 'dallas_meta.json'), 'w'), indent=1)
print('DALLAS_DONE')
