# STATE: plane-eater cast (character-artist, 2026-11-21, round 1, NOT locked by CB)

## Built
- `sheets/plane_eater.mjs`: 8 puppets from the locked package (no package edit):
  michel (thin, 1.80), doctor + doctorSlid (fat, 1.64), owner + ownerBeardS/M/L/XL (standard, 1.74).
  Own parts: napkin, braceBtns, waistband, knitV, pens, oddButton, coatBack, wingPatch, oil, yellowRag; face pieces forkStache, browCurl,
  halfMoon(dy); beardProp(len, w, seed) with BEARD_SIZES S 140 / M 220 / L 300 / XL 410 head units (chest, belly, hem, knees); ownerCap.
  Back designs go through `backOver` (outfit_lib's BACKOK set is private): helper bA(B, hw), hw 96 / 150 / 122.
  New faces registered into char2d EXT + FACES at load: peChew, peChewHard, peDisgust, peJawDrop (film.json face 'k:<name>').
- `tools/render_cast.mjs` (from the fire-truck tool): one command -> `CAST_SHEET.jpg`, `sheets/CAST_FACES.jpg`, `sheets/LINEUP.jpg` + `LINEUP_phone360.jpg`,
  `views/<name>_<view>.png` (8 x 6 views + 16 face tiles), `out/numbers.json`, heads_tall into CAST_KEYS.json.
  Gates in it: RED (hue 4 +-12) only on michel and present on his front/side tiles; rag yellow only on owner* and present on every owner tile; face colour/grey; feet 1440.
- `CAST_KEYS.json` (puppet names cast:plane_eater/<name>, heights, heads_tall, card_shade 0, costume_shade, face_shadow true), `CASTING.md`,
  `out/check_views_add_<name>.png`, `../crew/character-artist_check.md`, `../crew/character-artist_vs_rick.jpg`.
- library/LIBRARY.md "## Characters": rows pe_cast, pe_faces_chew_disgust_jaw.

## Numbers
- render_cast: 64 tiles, 1 flag (owner_front_laugh grey 0.128 = kit laugh face). michel_front red 2002 px, doctor/owner red 0, owner rag 1086 px (front).
- check_views: unchanged, the known 24 "no approved picture" FAILs only.

## Weak / open
- Cutlery (fork R, knife L), X-ray film, spanner, rag in hand = 3D props, not on the cards; conductor pose unproven.
- Doctor brows are ink (template); coverall sleeves cannot roll (arms are lines).
- Left views mirror the right card (rag and pencil follow the mirror, as in the films).
- Rag in 3/4 R sits on the far, shaded side (darker yellow); reads, but less than in 3/4 L / front.
- props/HERO_SHEET.jpg still shows red Cessna stripes (v1); v2 = navy. LOOK_BIBLE.md missing: palette proposal in CASTING.md.
- Not seen yet in a lit set frame (scene light on costumes); first look frame needed with the lighting director.
- Not shown to CB; not committed.

## Re-run
node episodes/plane-eater/cast/tools/render_cast.mjs   (about 1 min)
node tools/check_views.mjs --add cast:michel --sheet episodes/plane-eater/cast/sheets/plane_eater.mjs   (writes views_golden/_added_sheet.png: copy to cast/out, then delete it there)
