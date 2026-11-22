# S4 STATE: TWO YEARS / DESSERT / RECORD (plane-eater rows 23-34, film 21.28-31.44 s = frames 638-942). DRAFT round, S4 stretch builder 2026-11-22. Half size.

## NOT DONE / below Rick (fix round starts here)
- Michel's seated 3D legs (legs3d, copied from S2) draw as dark spiky "4" shapes under the table in every table shot: ugly. Fix: point the legs3d
  under the table for this lens side, or drop legs3d and draw the seated legs in 2D.
- Row 26: the spinner is cherry-size and hard to read; the napkin dab is a hand gesture only (no napkin prop in his hand).
- Row 27: the bell is small in his hand; the trolley roll-in (742-766) is seen from the side, not "rolling out of the hangar doors" as a reveal.
- Rows 28-31: the tower is x2.4 (about 4.1 m) with 4 bikes, 3 carts, 4 TVs; it reads as a big cake, but the bike / cart tiers are still thin next
  to the cake, the coffin on top is small and hard to see in the wobble; the fall (841-850) is a set-side path to a fixed CATCH point, not measured
  from his hand per frame; the coffin on his plate (held copy from 850) is small and low in frame (862). No cream swirl on the bikes.
- Row 32: the cloche lifts by itself (no hand on it), then flies off; the book is small on the table; no press in the doorway (only glints).
- Row 33-34: the certificate reads at 900 (upright, in the far hand) but is small ("STRANGEST DIET EVER" only just legible at half size); during
  the bite (912-940) it goes behind his head; the bitten corner (cert_bitten_*) swap at 913 is not visible.
- Row 25: the owner and his beard are tiny in the wide (about 9 m from the lens): the beard clock does not read on a phone. The near tree crown
  hangs in the top-left corner and the lower third is grass.
- Row 23: the Doctor holds the jaw drop from S3; glasses at the nose tip come from S3's move (no new glasses slide here). Michel is cut by the left
  edge on the first frames.
- Camera: fast beat-to-beat stretch; v2 warns "travel under 1 s" on 5 stations (see plan_check.txt). No sound effects.
- Light: the dusk is a draft of rick_light dusk (violet sky #604bde, pink key); the env map stays the noon one (silver reads a bit flat).

## Built (files)
- make_film.py -> film_A.json (clinic pass 638-672, sets/xray, Doctor m:../../ep_s3/dr_lean + Michel m:../../ep_s4b/mi_clinic) and film_B.json = film.json
  (apron pass 660-942, sets/s4_apron.js). blend.py: DISSOLVE ON THE MOVE A -> B 662-672 (row 24). render_s4.sh = the whole cycle.
- sets/s4_apron.js: apron.js + sliced Cessna eaten tail first 672-706 (sawhorses stay = empty cradle), SEASONS per frame (sun swings 2.5 turns + soft
  day/night strobe, autumn orange tree 682, snow #cfe0f5 + falling flakes 690-698, spring 705, dusk 738: sky sphere, fog, hemi, sun, lawn, leaves,
  card tint), the deck chair moved to (-1.6, -4.2) so the wide sees it, work lamps + pink key snap on at 740, the dessert trolley x2.4 with clones
  round each tier, tiers pop in on Bikes 768 / carts 796 / TVs 818 (screens flick to test stripes) / coffin 832, coffin wobble 834-841 + fall to the
  plate 841-850, cloche lifts 855-871 off the BOOK OF RECORDS + certificate. Held builders: buildSpinner, buildBell, buildPlate (+ coffin), buildCert.
- moves/ep_s4.mjs (m:mi_s4, seated, legs3d), ep_s4o.mjs (m:ow_deck, owner in the deck chair), ep_s4b.mjs (m:mi_clinic, m:ow_stare).
- Owner beard swap: owner 660, ownerBeardS 679 "two", M 686 "years", L 694, XL 701 "finish"; jaw drop 713; XL stands at the empty cradle from 876.
- Links: cast, props, voice -> ../; sets/{apron,apron.js,vendor,xray,xray.js,pe_props.js} -> ../../sets/. No change to shared sets.
- LECONS_TECHNIQUES.md: first-station creep from frame 0, the shared out/plan between passes, "travel" stations, hidden-vs-removed meshes in a held builder.
