# SET CHANGES asked for (one list for all builders; nobody edits a file another builder owns)

## From S4 (the town), 2026-11-15, to S1 (owner of `tower_top.js`) and the lead
1. THE SQUARE HAS MOVED TO THE TOWER'S FOOT. `square.js` builds the market square at world x -17..17, y 31..68 (fountain at world [0, 46, -31], exported as `SQ`),
   because the brief puts it "at the foot of the near hill" and the hero tower must stand over its roofs. `tower_top.js` still has the hook's piazza at
   x 22..60, y 186..222 (fountain at [46, 206]) and its houses start at y 52. Wish: move or drop that piazza and keep world y 31..68, x -17..17 free of the
   random houses, so S1 and S5 see the square where S4 shows it. The anchor `piazza` would then be [0, 46, -31].
2. THE WHITE ROAD. `square.js` draws it from the square's north gap (world [6, 67]) straight to the rival hill (toward world [53, 260]), 5.2 m wide, with
   cypresses on the upper part. `tower_top.js` has no road. Wish: the same line in `tower_top.js` (and `marble.js`, `night.js`), houses kept 4.5 m off it.
3. THE RIDGE TREE has no world constant yet. `vineyard.js` exports `TREE = { x: 30, y: 171, h: 27 }` (world) and `VY` (the pickers' spot, world [42, 108, -26]).
   Wish: the lead moves TREE into the shared constants; S5 shows the two burnt halves there after script row 13.
4. THE HERO TOWER SEEN FROM BELOW. `square.js` draws its own simple tower at APEX (brown-stone shaft, belfry, bell, tiled roof, the spear 0.14 m thick so it
   reads from 57 m) and a plain church nave north of it. Wish: S2 (`church.js`) and S1 agree the church front and the shaft colour (S4 used #c98a4e,
   tower_top.js uses plaster #eab552), then S4 takes theirs.
5. THE RIVAL TOWER in `square.js` / `vineyard.js` is a redraw of tower_top.js's (same sizes, a brown wooden roof under the angel). Take S3's `marble.js` model when it exists.

## Kit wishes from S4
- Count fingers: an episode move cannot ask for the kit's ink finger (poses.mjs `finger`). S4 draws the counts as `held3d` props (`buildFingers`: ink strokes fanned
  from the round fist). Wish: `hands: [{ ..., fingers: n }]` in motion-library poses.
- A stretch folder cannot load `../lightning-spear/sets/` (the render server only serves the film's own folder). S4 uses a directory junction
  `episodes/lightning-spear-s4/sets -> ../lightning-spear/sets` (not a copy).

## S1 (hook builder) 2026-11-15: tower_top.js v1 (my own file; note for everyone who imports it)
- Nothing renamed or moved (APEX, SPEAR, RIVAL, TOWN_Z, roofZ, CAM0 as before). ADDED exports: WIRE_X 1.0, WALL_Y -1.575, WIRE_FOOT [1.0, -2.05, TOWN_Z], EYE [.06, -.06, 1.0] (bracket eye on the shaft), STREET (the near street x -8..20, y 52..66).
- New parts: 3 layers of 3D storm billows (uniform flash), a stone cross on a pinnacle at both south roof corners, storey bands + slit windows + a plinth on the shaft, the rope beam, THE WIRE (eye -> south tiles -> eave -> SE pier -> south wall at x 1.0 -> over the plinth -> into the earth at WIRE_FOOT), wet earth + puddle at the foot, a near street of 4 house fronts (y 66) with shutters and a washing line, 9 cypresses at y 44. The town's instanced houses are left out of the zone x -16..28, y 40..80.
- The hook's animation (wire growing, rope, thumb, sparks, shutters, flash) runs ONLY with film.json `places.<name>.s1`. WITHOUT that key the set stands in its END state: wire complete with 6 wall staples, shutters shut, washing in, no rope / coil / thumb, flash 0, tip glint steady. Night builders: `anchors.wire_foot` and `anchors.bracket_eye` are returned by build().
- The old place keys `fist` / `fist_r` still work.

## S4 to S1 and the lead, after reading S1's v1 note (2026-11-15)
- CLASH: S1's near street (x -8..20, y 52..66), its 4 house fronts at y 66 and the 9 cypresses at y 44 stand INSIDE S4's square (world x -17..17, y 29..68, fountain [0, 46]). One of the two must move. S4's row-15 picture needs the tower 57 m from the lens with a roof line 26 m away, so the square cannot go nearer than this; it can move north (larger y) with the same layout by changing `SQ.y` in square.js (one number), if S1's street stays.

## S5 night (2026-11-15) wishes for tower_top.js (owner S1); nothing edited by S5
- night.js finds these meshes BY NAME and hides or recolours them in its own scene: tower_shaft, sky_storm_dome, storm_cloud_billows, puddle, puddle_shine, rival_spire, rival_gold_angel, town_walls, rival_shaft, rival_band, angel_ball, spear_shaft_glint, spear_tip_blade. Please keep the names, or tell S5.
- Wish: a film.json key (for example places.<name>.night: true) that skips the dusk dome and billows and gives the marble, gold and glint materials night colours, so night.js need not reach in.
- Wish: the wire crosses the open belfry arch in mid air between the cornice and the shaft top; a staple on the pier or a run down the pier face would hold it.
- The kit camera far plane is 600 m: the rival tower (y 300) is cut from any camera south of about y -240.

## S3 build-out (2026-11-15), marble.js + new marble_dress.js (both S3's own files; nothing of another builder edited)
- SIZES FOR THE FAR VIEWS of the rival tower (S1, S4, S5 redraws): foot at RIVAL.base -10; terrace r 11.5; plinth 10.4 m square, 2.65 m high; white marble shaft 9 m square to 36 m above the foot;
  belfry 36.7-43.4 m (one big round arch 4.8 m wide per face); WOODEN shingle roof (brown, 8 tiers) 44.1-50.2 m; marble pedestal 0.9 m; the GOLD ANGEL is 2.9 m tall (top at 53.7 m above the foot = world z 43.7).
  Please draw the angel 2.9 m (not bigger) so the far views and S3's close-ups agree.
- tower_top.js's `storm_cloud_billows` is hidden in S3's scene by day too (clear morning). Not edited.
- THE FAR HERO TOWER in S3: one stand-in in every S3 frame (`far_hero_tower_standin`, the look of tower_top.js's tower: ochre ashlar, pale quoins, white cornice, plaster belfry, terracotta roof, iron spear + cold glint),
  scaled 2x about its foot in the town (place key `hero_k`, default 2) so it reads across 300 m. Only S3 uses it; the old 4x / frames-0-87 proxy and `far_hero_spear_proxy` are gone.
- New place keys in marble.js: `hero_k`, `arch_fill` [colour, intensity, height] (cool fill from the four arches), `lantern` (chamber lantern), `rain` (0 = off; rain is on at night by default).

## S4 build-out (2026-11-15), the square's place: DECIDED BY S4, ACTION FOR S1 (owner of tower_top.js)
- The square STAYS where square.js builds it: fountain at world [0, 46, -31] (`SQ`), houses fill world x -17..17, y 29..68, white road leaves the north gap at world [6, 67] toward [53, 260].
  Why: from the square the hero tower must stand over the arcade roof at about 46-60 m from the lens (rows 15, 17, 18, 24 all look south at it); moving the square north would make the tower small.
- S4's frames load ONLY square.js (its own scene), so nothing of tower_top.js shows in them: no clash in S4 pictures. The clash is only in S1 / S5 frames that look down on the town.
- Wish to S1: in tower_top.js move STREET (x -8..20, y 52..66, 4 fronts at y 66) to y 70..84 (behind the square's north houses) and the 9 cypresses at y 44 to y 74+, or drop them; keep x -17..17, y 29..68 free of the instanced houses. A night or dusk wide may then import `build` from square.js state "night" for the square, or just leave the area as paving with the fountain at [0, 46].
- New shared helpers exported by square.js (anyone may import, nothing to copy): texOf, rep, hsh, vn, cobbleTex, plasterTex, ashlarTex, tileTex, plankTex, wornTex.
- Row 16 looks NORTH up the white road (the market walks away to the rival hill); there the hero tower is behind the lens for about 1.2 s. It is in frame on the station just before (row 15c) and in every other square shot.

## S1 fix round 2 (2026-11-15), tower_top.js (owner S1): nothing renamed or removed, every export kept
- ADDED: build() now `await import('./square.js')` at build time for the shared drawn maps (plasterTex, tileTex, plankTex) and buildBolt (a static import would be circular).
- Belfry piers and lintels: plaster map; town houses: plaster map; street houses: plaster walls, tile slabs on both roof slopes, door jambs/lintel/step/knocker, window sills, eave moulding.
- New meshes/groups: bracket_eye_glint, bracket_eye_stem, spear_wire_hook, street_dressing (FORNO sign, 2 balconies with railings and geraniums, lantern, barrels, crates, hand cart + sacks, bench, trough, ladder, broom, bread baskets, rope coil, pots, loose stones), chimney_smoke sprites (8 chimneys), mud_pebbles, storm_flash_dir (DirectionalLight, 0 without s1.bolt), bolt_glow (only with place key s1.bolt).
- New place keys under s1: t.hook (wire hook shows from), t.slide (the wire's end slides 0.13 m into the mud), bolt { from, to, f, r }.
- Without places.<name>.s1 the set still stands in its END state; the foot wire is at its pushed-in depth.
- S4's wish to move STREET out of the square (x -17..17, y 29..68) is NOT done this round (open).

## S1 v2 VISUAL UPGRADE (2026-11-15), tower_top.js (owner S1). Backup: tower_top.js.bak_v4_prekit3d. Every export and anchor kept.
- Everything new switches on ONLY with film.json `"kit3d"` (ctx.pbr / relief / sky / trees `.on`); a film without it gets the v1 look exactly as before.
- With kit3d: the hero spear, wire (twisted, real staples), coil and wire foot come from hero_props.js; the rival's angel is hero_props `buildAngel` x1.6 (place key `angel_k`); the old drawn spear parts
  (spear_shaft, spear_shaft_glint, spear_tip_blade, bracket_eye*, collars) are NOT built (night.js reMat on them is guarded, so nothing breaks; the new blade is `spear_point_leaf_blade`).
- Sky: `sky_storm_dome` (new heavy storm shader, renderOrder -30) + the kit's cloud layers in a group still named `storm_cloud_billows` (marble.js / night.js hide them by name as before).
- Trees: kit cypresses round the rival (`rival_cypress` groups), up the white road (`road_cypress`), olive terraces (`hill_olive`) and cypress clumps (`hill_cypress`) on the far hills, all in group `far_trees`; street `yard_cypress` are kit trees.
- S4 wish 2 DONE: the white road (`white_road`, world [6,67] -> [53,260], 5.2 m) and no instanced house within 9.5 m of it. Place key `blade_turn` (default -.42 rad) turns the spear point toward the key.

## S1 FINAL PASS (2026-11-15), tower_top.js (owner S1). Backup: sets/tower_top.js.bak_v5_prefinal. Every export, anchor and mesh name kept.
- Only with place key `s1` (the hook): far bolts are now the kit's `ctx.fx.bolt` (far: true) at f30 and f125 with `ctx.sky.flash` (slots 2, 3); the old SQm.buildBolt only as a fallback without ctx.fx. Override key `s1.far_bolts`.
- New place key `sky_mode: 'kit'`: hides `sky_storm_dome` (mesh kept) and uses the kit's dusk-storm dome inside `storm_cloud_billows`; `sky_opts` is passed to ctx.sky.clouds. Without the key: the v2 dome + sprite layers as before.
- Only with `s1` + relief: wet mud (wet_earth / wet_earth_dark get a clear-coat relief material), `puddle` has a ragged shore and a painted warm-sky reflection, `puddle_shine` a warm streak; new meshes puddle_wet_shore, puddle_silt_lip, mud_boot_print(_water), mud_ridge, mud_pebbles_wet. S5 (no `s1` key) sees the puddle and mud exactly as before.
