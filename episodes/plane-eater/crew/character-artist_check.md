# character-artist check: plane-eater cast (2026-11-21)

Side by side: `crew/character-artist_vs_rick.jpg` (ours left, Rick right: striped-shirt passenger with a bow tie and the hospital doctor,
"He Survived Falling Out Of A Plane", private reference, never published). No `refs/` board exists yet, so the frames were picked by me.

## Gate numbers
- `node tools/check_views.mjs`: same result as before the build: FAIL on the known 24 "no approved picture" tiles only, nothing new (output diff = none).
- `node tools/check_views.mjs --add cast:michel|doctor|owner --sheet episodes/plane-eater/cast/sheets/plane_eater.mjs`: six views drawn for each, checked by eye
  (cast/out/check_views_add_<name>.png): view rules held (side hair = side, back = head covered by hair, feet by view, near leg over body, far arm behind).
- `cast/tools/render_cast.mjs`: 64 tiles, feet on the ground 1440 in every standing tile, red only on Michel (michel_front 2002 px; 0 on every Doctor/Owner tile),
  rag present on every Owner tile (front 1086 px), faces: coloured share 0 on all fronts, grey share <= 0.071 (template crescent only).
  1 flag left: owner_front_laugh GREY PATCH 0.128 = the KIT 'laugh' face (tears + stubble), not this cast's faces.
- Phone 360 (`cast/sheets/LINEUP_phone360.jpg`): the three read apart (thin + red napkin / fat white coat / cap + olive + rag); black fill reads the role
  (moustache tips, tufts, cap dome; the XL beard silhouette reads as a long beard).

## Five details per main character
- Michel: Breton boat-neck stripes; gingham napkin (stitched hem, tuck folds, nape knot on the back); tomato bow tie; black braces with white buttons on a high stitched waistband; fork-tine waxed moustache with wax shine + brow curl.
- Doctor: open short white coat (lapels, hem band, 3 pockets); grey knit waistcoat with ribs + 2 buttons; dark green tie; blue + black pens, name tag, stethoscope; back half-belt + vent (+ the odd brown button).
- Owner: olive coverall with collar, zip, flap pocket, name tag; chest + back wing patches; steel-buckle belt; oil smudges + wipe streaks; yellow rag in the hip pocket, pencil behind the ear, wing-badge cap.

## Versus Rick (same kind of character)
- Costume detail: ours equal or richer (Rick's doctor: coat, tie, pens, tag; ours adds waistcoat, glasses, odd button, designed back).
- Doctor hair: our template baldTufts reads as white puffs, Rick's doctor has a flatter grey rim. Kept (locked hair library).
- Not judged here: light and scene colour on the cast (no set frame yet); needs the first look frame with the lighting director.

## Still below Rick / open (exact)
1. Cutlery, X-ray film, spanner and the rag in hand are 3D props (props department); the cards show empty fists. Michel's conductor pose (fork R, knife L) is not proven until the props exist.
2. Doctor's "bushy white brows": brows are ink in the locked face style, so they stay dark.
3. Coverall "sleeves rolled": the template arms are ink lines, no sleeves to roll.
4. The props department's HERO_SHEET still shows the v1 RED Cessna stripes; v2 says navy. Michel's red is only special if the plane is navy.
RESULT: PASS for the cast build (CB has not locked it); items 1 and 4 are for other departments.
