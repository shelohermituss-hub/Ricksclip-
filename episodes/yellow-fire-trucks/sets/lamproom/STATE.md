# STATE: PLACE D, THE LAMP ROOM BEHIND THE EYE (set-builder, signature round 1, 2026-11-21). Sheet: LAMPROOM_SHEET.jpg (8 tiles, looked at).
## NOT done / still weak (seen in the sheet)
- (round 1 items fixed in FIX 2 removed: caption band, cabinet tint, window size.)
- No Rick frame in the repo (no refs/ for this film): no side-by-side, no close-up 90 % detail pair. Numbers only.
- Window = a flat picture (town.blend rendered from the kerb, 640 px) 6 m behind the iris: parallax only from the iris/camera move; the exit flight needs the
  camera-director to blend into the real town park after exit_point. The toy in the hero's fist does not go grey (card art, cast dept).
- Not checked in a moving clip: the wave timing (4 posed steps), the flicker, the iris ease. Single frames only.
- Kit: no environment map, so chrome/brass are softened (metalness cap); the kit room is darker and warmer than Blender; bulbs are coded spheres.
- Air life not built (no dust motes, no mist pass); no sparks/clack on the lever drop (vfx, sound).
- Blender preview time is high on this shared CPU: 35-142 s per 540x960 tile (load average 8-20 from other helpers).
## Built (files)
- `build_lamproom.sh` (one re-runnable script; `--proof` = Blender + kit stills, numbers, sheet; ends LAMPROOM_BUILD_END / LAMPROOM_PROOF_END; SKIP_WINDOW=1 reuses the window pictures).
- `scripts/fetch_lamproom.py` (5 Poly Haven models + 4 textures, CC0, in assets/ph_lamproom; logged in assets/ASSETS.md), `bl_window.py` (the pupil pictures from
  sets/town/out/town.blend: dusk, red pumper on the crossing nose to us at [24.6,-6.2], beacon, hero card at the kerb; drain .3 = red, 1.0 = grey),
  `bl_lamproom.py` (the room), `lamproom_api.py` (set_state(wave 0-4, iris 0-1, dim, grey, flick), use_cam), `bl_lamproom_proof.py`, `kit_films.py`, `sheet.py`, `proof/run_kit.sh`.
- `out/lamproom.blend` (cameras CAM_ROOM, CAM_ENTRY, CAM_EXIT; 4,376 lamps as Geometry Nodes instances of lightbulb_01 + socket on a riveted plate, 47.7 M
  instanced tris; shell 92 k tris; fog-glow compositor), `out/lamproom_lite.glb` (113 k tris, 20 MB, iris morph 'open', no lamps), `out/lamproom_meta.json`
  (layout, anchors, cams, screen circles, the lamp list x y z kind state group), `out/window_red.png`, `out/window_grey.png`, `window_meta.json`.
- `../lamproom.js` (kit: GLB + 4,376 instanced lamps in 18 groups, two window planes, lamp-driven point lights; `places.<name>.lamproom` = {wave, iris, dim, grey, keys}).
- `../lamproom_STORY.md` (before the build), `../lamproom_DRESSING.md`.
## Layout (Blender metres, Z up, eye axis +Y)
Sphere R 6; iris plane y 5.58, outer r 2.25, pupil r 1.15 closed / 1.90 open; catwalk z -3.4; bulkhead y -5.2 with the chrome entry ring r 0.95; reflector bowl
to y -8.6 (r 2.6); window picture y 11.58, 9 m. Exit point [0, 6.38, 0]. Relay box at [-0.62, -0.45], top z -2.42.
Wave groups: red lamps by angle round the axis from top-left, clockwise as seen from the room: g1 top, g2 right, g3 bottom, g4 left.
Headlamp match: pumper headlamp glass (truck frame) centre x -3.50, y +-0.52, z 1.31, r 0.109 m. At CAM_ENTRY the entry ring fills 89 % of the frame width
(r 0.445 of width, centred); the pupil there is r 0.103 of width. At CAM_ROOM the pupil centre is at 40 % from the top, r 0.164 (closed) / 0.271 (open) of width.
## Numbers (proof/numbers.json; 540x960; Blender Cycles CPU 16 spp + OIDN, Standard; kit second frame)
- Round 1 numbers: proof/numbers.json and LAMPROOM_SHEET.jpg (Blender 35-142 s/tile at load 8-20); FIX 2 numbers below and proof/fix2/numbers.json.
## LECONS (LECONS format; the lead copies into LECONS_TECHNIQUES.md)
- 2026-11-21 A sed appended a '#' comment in the middle of the iris line and ate `iris.data.materials.append(chrome)`. Cause: REGLES 4 trap again. Fix: comment on its
  own line. Guard: `grep -n "; *#" scripts/*.py` before every render (it caught this one). Proof: the chrome lip shows in bl_irisopen.png. FERMÉ
- 2026-11-21 The socket asset joined to an empty list (IndexError). Cause: the filter `'chain' in name` also matched the asset's own name pull_chain_light_socket.
  Fix: `name.endswith('_chain')`. Guard: join() fails loudly on an empty list. Proof: SRC_housing built, LAMPS line in logs/build.log. FERMÉ
- 2026-11-21 ReferenceError after bpy.ops.object.join. Cause: the joined objects are deleted; the loop then read their names. Fix: list the non-mesh objects before
  the join. Guard: in join(). Proof: logs/build.log LAMPROOM_DONE. FERMÉ
- 2026-11-21 Lamps at emission 9 clipped in the Standard view: red read salmon, lemon read white. Fix: E_ON 3.0 in lamproom_api. Guard: the constant's comment.
  Proof: bl_allon.png round 2, red reads red. FERMÉ
- 2026-11-21 Mirror chrome reads black where nothing bright is in front (Blender reflector bowl; every kit chrome without an env map). Fix: brushed reflector (rough .2)
  + a dim violet fill (160 W blew it white, 9 W kept); kit caps metalness .55. Proof: bl_entry.png / kit entry, round 3. FERMÉ
- Seen, not mine: sets/town/scripts/bl_town_proof.py line `sc.cycles.samples = 16;   # ... sc.cycles.use_denoising = True; ...` has the denoise settings inside a comment.
## Open for other departments
- Camera-director: entry = push into the headlamp until its glass is 89 % of frame width, blend to CAM_ENTRY, fly forward through the ring to CAM_ROOM, exit
  forward past exit_point and blend to the park. Lead: OK that the match is headlamp rim -> entry ring (the pupil is small inside it at that moment).
- VFX/sound: spark + relay clack per wave step. Cast: grey state of the toy in the hero card. Background-painter: nothing (no sky in this set).
## FIX 2 (2026-11-21) - sheet FIX2_SHEET.jpg (8 tiles, cyan = caption line 71.5 %), numbers proof/fix2/numbers.json; runs fix2_run.sh (+ round c by hand, same steps)
- NOT done: the caption band is plain and darker but not BLACK (Blender band mean .184, std .047; kit .081 / .031); the meter left the lid and now stands small
  on the deck east of the box (reads as a dark box); red-off tile is round b (deck not yet matte). Window picture is a flat plane still (no parallax).
  Not checked in a moving clip: the S6 travel CAM_ROOM -> (0, 6.6, .15) frame by frame (CAM_EXIT at y 3.0 = the worst point by the maths: no edge).
- Done, seen: 1 caption band: relay box legs .26 -> .02 (lid line ~75 %), meter moved to the deck, deck tint #1d1a24 matte (rough x1.8, metal 0; metal .6
  mirrored the lamps), cabinet scale 2.2 -> 1.8 and nearer (top below the line). Band 68-75 %: mean .250 -> .184, std .198 -> .047 (Blender).
  2 window plane 9 -> 15 m; bl_window lens 28 -> 16.8 (= 28 x 9/15) at 1068 px, so the middle 9 m is the same view: CAM_EXIT shows no edge (tile 5, 8).
  3 cabinet tint now takes (log CABINET_TINT linked power_box_01): the BSDF is found by type. Anchors and cams unchanged; relay_box anchor z follows the box.
## FIX 2 LECONS (LECONS format, short)
- 2026-11-21 Cabinet tint never took: nodes.get('Principled BSDF') was None on the glTF material. Fix: find by type, log CABINET_TINT. Guard: the log line. Proof: tile 4. FERME
- 2026-11-21 Darker deck tint changed nothing: metal .6 mirrored the lamps. Fix: metal 0, rough x1.8. Guard: check metal first. Proof: band std .198 -> .047. FERME
- 2026-11-21 Window images are stored 'out/window_*.png' relative to the CWD: Blender must run from sets/lamproom. Guard: IMGPATHS print. OUVERT (pack for RunPod).
