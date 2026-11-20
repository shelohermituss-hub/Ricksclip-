# CAST STATE: lightning-spear (character-artist, 2026-11-15, build round 1; NOT locked by CB)

## Built
- `cast/sheets/spear.mjs`: 13 puppets. `cast:spear/mason|priest|rival|ringer|baker|olive|marketwoman|picker|oldman|girl|boy|eggwoman|hen`.
- `cast/CAST_KEYS.json`: puppet_pkg, cast entries (heights), costume_shade (.45/.35/.15, smooth 40), card_shade (rim_amount 0, hat_shadow 0, lights []; no `far`).
- `cast/tools/render_cast.mjs`: ONE command = views + sheet + face zoom + numbers. `node episodes/lightning-spear/cast/tools/render_cast.mjs`
- `cast/out/cast_sheet.png` (1600 wide), `cast/out/cast_faces.png`, `cast/out/numbers.json`, `cast/views/<name>_<view>.png` (clean cards 600x1125, all 4 views of all 12 people, 8 hen drawings).

## Who (body · outfit recipe · head · SIGNATURE)
- mason: standard · mason1765s (teal buttoned waistcoat, cream linen shirt, open collar) · madder berretto without pompom, curlyCrop brown · mustard neckerchief knotted on HIS LEFT + white chalk handprint on his right hip.
- priest: fat · priest1765 (soft-black cassock to the ankle = the one long cloth, white collarino, violet-black sash, 9 buttons) · round low clergy hat (library sunHat in black), white side tufts · big wooden rosary at the sash on HIS RIGHT (all 4 views).
- rival: thin · rival1765 (ivory skirted coat, gold waistcoat front, lace jabot, gold buttons, flap pockets) · black tricorne with gold edge over powderWig · gold-knob cane in his RIGHT fist = HELD PROP, not on the card.
- ringer: thin · ringer1765 (collarless shirt, short patched brown waistcoat, rope belt) · big grey knitted stocking cap (library nightcap) · white wool tuft in each ear.
- market: baker (fat, bald + dark tufts, terracotta check shirt, floury apron) · olive (standard, olive smock, straw hat) · marketwoman (fat, yellow laced bodice, dusty blue headscarf) · picker (thin, terracotta bodice, braids) · oldman (thin, dusty blue waistcoat, felt hat) · girl (kid, pigtails) · boy (kid, yellow cap) · eggwoman (standard, blue dress, cream shawl, grey bun).
- hen: own card (spec.card). pose `stand` | `stare` | `puff`; views side (dir flips), front, back. One black tail feather in every drawing.
- Period check 1765 per character (hat, neckwear, facial hair): written in the header comment of spear.mjs. Everyone clean-shaven.

## Numbers (render_cast.mjs, film costume shade on)
- Face zone (front, eyes to chin): coloured share 0 for 11 of 12; olive seller 0.035 (straw brim edge). Grey share 0.012-0.019 (the template's own crescent). No hat or hair shade on a face.
- Hair and hat streak jumps with smooth 40: 0-46 pixels per view (below 1 %); with smooth 0: 41-2000. Worst = the ringer's cap (3/4: 131).
- Feet on the ground line 1440 for all; hen 1443.
- `node tools/check_views.mjs`: PASS, 11 characters x 4 views (the locked library is unchanged; my recipes register at load in the sheet only).

## Weak / open
- NOT done in the 45 min cap: side-by-side with a Rick frame, phone 360 px check, CASTING.md, PRESETS.md, crew check file, a line-up still in a place, acting faces per character. Next round.
- Looked at the sheet twice; the last state (hen scale, ear wool, ivory rival) was seen once. Faces zoom seen once, before the last patch.
- Mason differs from CAST_PERSONALITY (no leather apron, no hair tail, red cap): lead's brief wins (stand-in CB corrected). The chalk hand therefore sits on the waistcoat. Writer should update CAST_PERSONALITY.
- Rival "coat with cuffs": cuffs cannot show (arms are ink lines). His cane must be built as a held prop (props dept, grips.mjs pole). Rival is THIN body (personality); "taller hat" = the tricorne is the tallest hat, his card is the tallest (1.88 m).
- Priest: hat is the library sun hat recoloured; a true cappello romano (flatter crown, cords) would be a library add. Cassock colour is #3a3540, not pure black, so the costume shade can work on it (pure black counts as ink).
- Signature pieces (neck knot + chalk hand, rosary, ear wool), the 7 recipes, the pompom-less cap, the recoloured headscarf and the hen card live in spear.mjs, not in the library. Move into the library (with backup + of_check) when CB locks the cast.
- Rosary and knot are drawn in body space: check them in the first library move (kneel, trot).
- Hen: three poses only, no blink, no walk; in 3/4 the side drawing is used. Kit needs to pass `pose` through to a custom card (film_plan bake not tested).
- Town row has pink flower-free outfits, but the baker's check is the library's sky blue; the market woman's bodice lacing is terracotta, near the "one red": watch in the grade.
- Kids use the kit `kid` form (not a bible size).

## LOCKED
CB 2026-11-15: "confirm cast" on cast/out/cast_sheet.png (round 1, all 13 puppets). The cast is LOCKED: no change to silhouette, outfit, colours, hair or hats without CB. Open for the build phase: move the 7 outfit recipes, 3 signature pieces, the headscarf recolour and the hen from sheets/spear.mjs into the library; the rival cane is a held 3D prop.

## LONG CLOTH LEGS fix (2026-11-15, CB "legs need to be under the long cloth")
- Cause: the 2026-11-15 near-leg-over-body rule (side / 3/4 moves, and any ft.over) drew legs on top of S.skirt. Fix: overBody = !S.skirt && (...) in templates/threejs_film/puppets.mjs line 190 and templates/motion_styles/rig.mjs line 137 (backups *.bak_longcloth_20261115).
- Proof: out/long_cloth_before_after.jpg (tools/render_longcloth.mjs; 24 of 84 cells change = side moves of priest, marketwoman, girl, eggwoman; front/3-4/stand unchanged) + S1 f110 re-render out/longcloth_f110/f_00110.png (mother + girl legs now only below the hem). check_views PASS.
- Open: S1 take B, S2 Priest trot, S4 long-cloth frames need re-render to carry the fix.
