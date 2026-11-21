# STATE: yellow-fire-trucks / cast (character-artist, 2026-11-20, phase A, NOT locked by CB)

## Built
- sheets/firetrucks.mjs: 18 puppets cast:firetrucks/<name> (hero, heroShop, heroBare, chief, chiefVisitor, chiefDown, oldTimer, rookie,
  rookieDown, sceptic, crew1-3, milkman, kid, clerk, painterThin, painterFat). Package untouched; yt* recipes + parts registered at load.
- Kit fire helmet recoloured at draw time (black shells, Chief white, fronts silver-white / black / navy CHIEF); gold trims -> silver.
- CAST_KEYS.json (puppet_pkg, cast with height + heads_tall, faces_ep PROPOSED, costume_shade, card_shade 0, mouth note).
- CASTING.md (ID, size, outfit key + colours, signature, five details, face table).
- tools/render_cast.mjs: one command -> sheets/CAST_SHEET.jpg (1600x2542, six views each), CAST_FACES.jpg, LINEUP.jpg,
  LINEUP_phone360.jpg, out/numbers.json, views/<name>_<view>.png (right-facing views only; left = mirror).

## Numbers (render_cast, 123 tiles)
- Costume gates on all 108 standard tiles: red 0, yellow 0, gold 0, teal off-hero 0, feet 1440 on every tile.
- Face zone (front): coloured share 0 except chiefDown .23 (helmet over the face, intended) and clerk .059 (pencil at the ear edge);
  grey share <= .12 except chief .09 OK; chiefShout .16 = moustache/teeth, not skin shade.
- Red only on kit tongue / open mouths: aim 31 px, glanceCam 169, concentrate 199, sleepy 357 (#c94a5f mouth inside).
- check_views: FAIL as shipped (24 "no approved picture" for stationmaster/inspector/lady/dad + 7 SKIP of absent films);
  nothing ours is in rows.json; --add cast:hero drew our hero through the official tool (out/check_views_add_hero.png).

## Weak / open
- No Rick refs in the repo (no refs/, no references/video): no side-by-side was possible.
- Kid's knee plaster is drawn at the standing knee (spec.over): it does not follow a bent/running leg (no knee hook in the rig).
  Mirrored left views put it on the right knee (kit mirrors the card). Same for LEFT-fist props in left views.
- Chief walrus lifted/shrunk 8 % so mouth shapes show; open lip-sync mouths carry the pink inside (lead to rule on mouth interiors).
- Sceptic arms-crossed and the hero's mug/lunch box/bottle are poses/props, not on the sheet.
- Hero glasses are the kit roundGlasses (r 25): pupils clear in front, 3/4, aim, glanceCam; at phone size they read only in close shots.
- Chief "gold shield / pins / brass buckle" from the hints made SILVER (no yellow on a person): lead to confirm.
- Sleeves pushed up (Sceptic), short sleeves (Chief), sneakers/socks (Kid), pink cheeks (Chief) not drawable on the locked template.

## FIX 1 (2026-11-21, cast fix round: badge, mirror down, seated drivers, kid plaster)
- Badge: sheets/firetrucks.mjs fireHelmet counter-flips the front text when PP.dir < 0 (hair_lib mirrors head layers for left views). Every helmeted
  puppet (chief, chiefVisitor, chiefDown, oldTimer, rookie, rookieDown, sceptic, crew1-3) reads "3" / "CHIEF" in front, 3/4 R, 3/4 L (side views have no text).
- render_cast.mjs now draws LEFT views with svgFor dir -1 (film.js's way) instead of a canvas mirror; CAST_BEFORE=<old sheet> writes out/before/*.png.
- heroShopEye (new puppet): band in the hair layer + knuckle, stalk and ~9 cm disc in faceTop over the RIGHT eye, centre hole on the eye; left lens clear.
- Kid plaster: with the dir -1 drawing it lands on the LEFT knee in 3/4 L and side L (no code change); side R keeps it on the near leg (left knee is hidden).
- Seated drivers scepticDriver / rookieDriver / milkmanDriver: same spec + kit customCard (spec.card) = kit svgFor of the base puppet, clipped 14 px under
  the hip line; pose 'drive' (side = push, else grip_box fists with the box at scale .001). CAST_KEYS: in_vehicle true, hip_up_m, seated_head_m, cut_px.
  The sheet imports the live kit module (../../kit/puppets.mjs in the film, ../puppets.mjs in render_cast); if neither loads, the driver is the plain puppet.
- DRIVER_NOTE.md = placement for the stretch builders (keys, pos z = seat_z - hip_up_m, truck/van seat anchors, views).
- Proof: sheets/CAST_FIX.jpg (tools/cast_fix_sheet.py) + cast/cabtest/ (film.json, sets/cabtest.js, real truck_light.glb + milk_van.glb, 9 stills, 2 min).
## Numbers (FIX 1)
- render_cast: 142 tiles; flags 9 = the known kit tongue/mouth reds on k: faces (aim, glanceCam, concentrate, sleepy) + hero aim grey .127 + chiefShout grey .158.
- Driver tiles: costume red 0 / yellow 0; cut at card y 1107 (sceptic) / 1072 (rookie, milkman). hip_up_m .683 / .670 / .662; seated head 1.197 / .970 / .958 m.
- check_views: FAIL as shipped only (24 "no approved picture" stationmaster/inspector/lady/dad + 7 SKIP of absent films); nothing new.
## Weak / open (FIX 1)
- Truck cab too small for the locked heads: face in the window puts the helmet comb at the roof (tip may show); set-builder 1.15x cab or bareheaded drivers.
- Through the truck windscreen the glass darkens the face (set glass material); the A-pillar mirror can cover the face from a front 3/4 lens (camera choice).
- frame_checks: in_vehicle exempts body_in_mesh, but body_check FAILs "in_vehicle without a body rig" and scale_check needs vehicles.js driverSeat (kit owner).
- Mirror-down disc reads as a big lens at phone size in wide shots; it reads in M/C shots. No CB look yet. No Rick refs in the repo (no side-by-side).
## Lessons (LECONS format)
- 2026-11-21 Helmet number read backwards in left views. Cause: hair_lib wraps the head layers (hat included) in scale(-1,1) for dir < 0, and the sheet
  renderer mirrored the right card, so neither showed the film's real drawing. Fix: counter-flip the <text> about x 0 when PP.dir < 0; render left views
  with svgFor dir -1. Guard: CAST_FIX.jpg badge row. Proof: chief 34L "ƎIHC" -> "CHIEF". FERMÉ
- 2026-11-21 Pieces drawn over the eye vanish. Cause: hair_lib pieces live in the hair layer, which the rig draws UNDER the face. Fix: anything on the face
  goes in spec.faceTop (face layer coords, slid by the rig in 3/4 / side: eye x -40 front, 51 side). Proof: heroShopEye tiles. FERMÉ
- 2026-11-21 Drivers stood through cab bodies. Cause: no seated driver card in the kit (body_rig not wired). Fix: kit customCard hook wrapping the kit's own
  svgFor + a clip under the hips; same puppet, same moves. Guard: cabtest stills. Proof: CAST_FIX.jpg row FIX 3. OUVERT (cab scale, frame_checks rig rows)
