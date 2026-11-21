# CASTING: The Man Who Ate An Airplane (character-artist, 2026-11-21, NOT locked by CB)

Built only from the locked cast package (three-size bible bodies, outfit_lib parts, hair_lib, head_wear, face_gear). The package is not edited:
recipes, small parts, two face pieces, the beard prop and three new faces live in `cast/sheets/plane_eater.mjs` (registered at load).
Puppets: `cast:plane_eater/<name>`; heights and keys in `cast/CAST_KEYS.json`. Proof: `cast/CAST_SHEET.jpg`, line-up `cast/sheets/LINEUP.jpg`.
LOOK_BIBLE.md does not exist yet: colours come from PICTURE_PLAN v2 "Fixed for the whole film" and props/PROPS.md. The lead should copy the people palette below into LOOK_BIBLE.

## People palette (scene colour each comes from)
| colour | hex | on | comes from |
|---|---|---|---|
| tomato red | #D8342A | Michel ONLY: bow tie, napkin checks | lead's hero colour (PICTURE_PLAN v2); far from the cyan X-ray light |
| navy | #26325e | Michel's shirt stripes ONLY | the Cessna's navy stripe (man and meal rhyme) |
| white | #f4f3ee / #f2f3f1 | Michel's shirt, Doctor's coat | Cessna white #f3f4f1 |
| black | #2c2a33 | Michel's trousers, braces | hangar shadow / tyre rubber |
| grey knit | #8b8d93 | Doctor's waistcoat | X-ray room steel box, hangar concrete |
| dark green | #2f5a3e | Doctor's tie | hospital green of the X-ray room walls (cool, sits in cyan light) |
| olive | #6f7542 | Owner's coverall | apron grass edge, aero-club workwear |
| cap grey | #8d9096 | Owner's cap | hangar door metal |
| rag yellow | #f0c43a | Owner's rag ONLY | his running gag; matches the amber oil #f0a81c family |

## MICHEL "Monsieur Mangetout" (hero) = `michel`
- Role / trait line: polite stage gourmet who eats the impossible; THIN body, 1.80 m, slick black hair, waxed moustache.
- Costume idea: a French showman dressed for a fine dinner: the marinière says France, the napkin says dinner, the bow tie says stage.
- Signature piece (black fill test): handlebar tips up + napkin triangle. ONE fixed signature detail: each moustache tip SPLITS INTO TWO FORK TINES.
- Five details: 1 navy-on-white Breton stripes with boat neck; 2 red-and-white gingham napkin tucked into the collar, stitched hem, two tuck folds, corners tied at the nape (back); 3 tomato-red bow tie; 4 black braces with white buttons on a high waistband with a stitched edge; 5 waxed fork-tine moustache with wax shine + one oiled curl on the brow.
- Props (3D, props department): fork in the RIGHT fist, knife in the LEFT (same hand in every view), salt shaker, wine glass of oil.

## THE DOCTOR = `doctor` (+ `doctorSlid`: glasses slid to the nose tip, row 23)
- Role / trait line: careful old hospital doctor, the sceptic who becomes the witness; FAT body, 1.64 m, white horseshoe hair.
- Signature piece: half-moon reading glasses LOW on the nose (eyes peek over). Fixed signature detail: ONE ODD BUTTON (lowest coat button brown, cross-stitched).
- Five details: 1 short white coat worn open (lapels, hem band, three pockets); 2 grey knitted waistcoat with rib lines and two buttons inside the V; 3 dark green tie; 4 blue + black pens with silver clips in the breast pocket, name tag, stethoscope; 5 designed back: half-belt with two buttons + centre vent.
- Props: X-ray film (both hands), pen, official stamp (props department).

## THE OWNER / mechanic = `owner` (+ `ownerBeardS/M/L/XL`)
- Role / trait line: proud, jokey aero-club mechanic who owns the Cessna and loses it bite by bite; STANDARD body, 1.74 m, curly brown hair, stubble.
- Signature piece: the YELLOW polishing rag in his right hip pocket (front, 3/4, side, back). Fixed signature detail: the little silver WING BADGE on his grey cap.
- Five details: 1 olive coverall with collar, silver zip, flap pocket + name tag; 2 aero-club wing patch on the chest and a big one on the back; 3 belt with a square steel buckle; 4 oil smudges and finger-wipe streaks at the right hip; 5 pencil behind the right ear + grey cap with the wing badge.
- Beard prop for the two-year time-lapse (row 25) and to the end: S upper chest (140), M belly (220), L hem (300), XL knees (410) in head units; swap the puppet per beat. Never wider than the head; hidden from the back.
- Props: spanner, the rag in hand (props department).

## New faces (episode presets, `k:<name>` in film.json; locked package untouched)
| face | parts | where |
|---|---|---|
| `peChew` | happy eyes, closed mouth pushed aside + chin dimple, CHEEK BULGE past the head line on the facing side (front: lit left cheek) | rows 14-17, 26, 34, 37-38 |
| `peChewHard` | squeezed eyes + tear drops, same chew + bulge | row 17 (the tire) |
| `peDisgust` | half lid + squint, one brow down one up, lopsided frown with the lip pushed out, nose-bridge wrinkles | row 36 (airline meal) |
| `peJawDrop` | shock eyes, brows high, tall open mouth with top teeth, muted mauve tongue (no red); with the beard the jaw falls into it | row 26 (owner), 23 option |
Nothing needed a package change.

## Allowed variations / forbidden deviations (preset rule)
- Allowed: pose, face (kit set + the four above), mouth for chewing, camera view, beard size (owner), glasses position (doctor).
- Forbidden: red on anyone but Michel; navy stripes on anyone but Michel; changing body size, hair, outfit colours, the signature details; any texture or line finish on the cast.
