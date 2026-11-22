# look-finisher check: LOOK CARD (2026-11-21), NOT DONE AS FINAL: light previews only
Sheet ours left / Rick right: crew/look-finisher_vs_rick.jpg (private, git-ignored): A vs SH1_P00 (plane skin), B vs SH5_K46 (screen in set), C vs SH10_P01 (cabin).
Card: LOOK_CARD.jpg. Frames: look/A_apron_row1.png, look/B_xray_row20.png, look/C_cabin_row36.png (540x960, 24 spp + OIDN, CPU 20-40 s each).

## Five details per main object
- Michel (A): standing ON the bistro chair (arms too short to reach the 2.0 m wing top), glass shaker with chrome cap tipped in the picture plane,
  45 falling + 30 lying salt grains, steel fork tines up in the other fist, red bow tie + gingham napkin the only red.
- Cessna (A): wing underside fills the upper left in blue-violet shade, F-MIAM letters at the right edge, nose + prop with the owner, strut, wheel spat.
- Owner (A): back to us, olive coverall, grey cap, rag fist on the upper blade, contact patch on the concrete; small far (5.5 deg down-angle).
- Doctor (B): white coat from behind with half-belt, grey curls, fist on the hero film edge, film shows the bite-Cessna + F-MIAM in the belly, "X-RAY" sign.
- Michel + meal (C): DISGUST face, tray with grey stew + 14 peas + roll + cup + foil lifted, AIR VILLEBRUNE headrest, bright window with cumulus and wing.

## Gates (numbers; targets rick_targets.json)
| frame | kind | mean | p1 | p50 | p99 | sat | contrast | down-angle |
|---|---|---|---|---|---|---|---|---|
| A | DAY .48/.061/.467/.966/.381/.208 | .442 | .106 | .442 | .971 | .539 | .166 | Michel -40 (lens low, looks up), owner 6 |
| B | INTERIOR .429/.082/.438/.94/.308/.22 | .505 | .083 | .474 | .992 | .247 | .258 | Doctor 5.2 |
| C | INTERIOR | .521 | .089 | .563 | .997 | .190 | .299 | Michel -3.4 |
Lens inside geometry: 0 (cam_inside check; C uses a wild-wall row 8, hidden from the lens only). Outline 1.2-1.9 % of pixels.
check_episode.py / cine_look.py: NOT run (no film frames yet; these are key stills).

## Below Rick (exact)
1. A: plane skin seen only from below in shade: no glossy metal reflection / hard sky streak like SH1_P00; sat .54 (sky area) vs .38; p1 .106 (blacks lifted).
   Grade at full strength drags the sky to #3283cc, so strength .5 is used. Dapple reads only as tree shade, not a hard leaf pattern (C20).
2. B: wall upper half plain pale cream, fewer story props than K46; mean .505 > .43 (clinic kept light on purpose); film subject small at phone size.
3. C: Michel's big head cut at the left edge; meal small; cabin cool/white vs Rick's warm saturated cabin; sat .19 vs .31.
4. Cards are posed for the look card by look/cards/make_look_cards.mjs (kit pose pe_hat), not the animator's lock.
