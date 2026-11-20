# ONE shared sets folder for fake-surgery (CB_RULES 11a.3). Never copy it into a stretch folder; each stretch folder links `sN/sets -> ../sets`.
OWNERS (only the owner edits; everyone else imports and asks in `../SET_CHANGES.md`, one line: who, file, what, which row):
| file | owner | what |
|---|---|---|
| `world.js` | lead | place origins, storey, dado, tile colour |
| `look_pack.js`, `PLACE_KEYS.json` | look helper (phase A), then lead | hospital surfaces in real metres (kit3d) + the 6 light kinds of LOOK_BIBLE.md |
| `or_room.js`, `or_props.js` | look helper (port of the hook board OR), then the S1 builder | place set "or_room" |
| `hero_props.js` | props helper | every hero/held prop of LOOK_BIBLE "Hero props" |
| `corridor.js`, `office.js` | set helper B1, then S2 builder | places "corridor" (+ pre-op bay), "office" (dress: night / stripes / y2004) |
| `stairwell.js`, `waiting.js` | set helper B2, then S4 / S5 builder | places "stairwell" (light: afternoon / evening), "waiting" |
| `s3_wrap.js` | S3 builder | wraps office/corridor/or_room for S3 extras under place key `s3`; edits none of them |
| `s4_office.js` | S4 builder | wraps office.js for S4 beats under place key `s4o` |
| `soft_arm.js` | copied from monopoly-escape, read-only | set-drawn arms, one slight curve |
| `power/` | copy of templates/pieces/fx/power (weak defaults: shockwave_ring flat, crack_veins gold roots, aura blob: restyle per scene) | |
| `hook_board_film.json.ref` | reference only | the hook board's film.json |
| `lp_testroom.js` | look helper; TEST ONLY, never in the film | |
A change to a set file is switched on by a NEW film.json place key so other stretches do not change. Each set file documents its keys at its top.
