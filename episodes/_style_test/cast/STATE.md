# STATE: style test / cast (character-artist, 2026-11-21, round 1, NOT seen by CB)
## Built
- sheets/styletest.mjs: grandpa (fat, baldTufts, Panama hat lifted 120 / tilt -16), grandpaHat (hat on, rest), kid (kid form, capBack34, knee plaster).
- tools/make_cards.mjs (SCALE=2): kit svgFor + 2 run-time poses -> out/*.png raw, view_* rest views, raw_meta.json. tools/finish_cards.py: shade, crop
  (bottom = ground), 1400 px high -> grandpa.png, kid.png, *_flat.png, kid_nozzle2d.png, cards.json, CAST_SHEET.jpg, out/numbers.json, out/phone_check.png.
- CAST.md (roles, colours, five details, check), character-artist_vs_rick.jpg (PRIVATE).
## Numbers
- grandpa 898x1400, 529.9 px/m, card 1.70x2.64 m, jump clearance 0.34 m; kid 948x1400, 938.7 px/m, card 1.01x1.49 m.
- fists on ink: all 4 true; mean shade t .32 / .33; sponge prop 27.5k px (raw, scale 2) kept unshaded.
- check_views: FAIL as shipped only (24 no approved picture + SKIPs); templates untouched (git status: only episodes/_style_test/ new).
## Weak / open
- No footwear (locked "no shoes"); lead/CB to decide if boots are wanted (must cover the whole foot).
- Kid at 12 % of frame height (LAYOUT) is too small for his grin and shark to read on a phone: layout / camera question for the lead.
- Grandpa near thigh line crosses the trouser bottom in the jump (kit leg drawing); arms use the kit 'cheer' elbow (angular but kit-approved).
- Kid nozzle not on the card: needs props-hero's 3D nozzle placed between the fists (cards.json kid.nozzle), fists drawn in front of it.
- Wet patches on grandpa's shirt are subtle (opacity .16) at phone size.
- out/ holds 13 MB of raw renders (scale 2): regenerate with the two commands, do not commit.
