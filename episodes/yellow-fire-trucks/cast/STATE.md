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
