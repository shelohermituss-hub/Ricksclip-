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

## Checks (draft render, 2026-11-22)
- camsafe validate: exit 1, 4646 checks, 4580 PASS, 66 FAIL = ownerBeardXL f877-942 VIEW_MISMATCH (camera asks front, m:ow_stare draws 3/4).
  Fix: let ow_stare draw the view camsafe asks for (or add look_full on his act at 876). No waiver.
- frame_checks: 5 FAIL / 19 WARN / 90 PASS: owner XL cut by the left edge f904-912 (body + head), Michel cut by the left edge f774-781 (the crane
  start frames the tower, Michel half out), Michel feet float 25 cm at f942 (seated legs3d), WARN beard L/XL overlap at the swap frame 693 (two
  puppets on one frame), owner foot slide f874-903 (the walk-in of the XL owner to the cradle), table_top 1-4 % in his torso (seated).
- film_plan check --window 660-942: 10 FAIL / 10 WARN of 44. Window gate: camera speed p90 31.7 px/f (target <= 22): the beat-to-beat
  stations (travel 0.6-1.0 s, "travel under 1 s" WARN x5). The other FAILs (rest length, dead still 74 %, framing medians, frozen 23 s, moods/min)
  are measured over frames 0-660 too (the camera and the cast rest before the window): not the stretch's own.
- film_A (clinic 638-672) not checked separately (time).
- Seen on KEYFRAMES.jpg: at f822-838 the crane rises INTO the near tree crown (a dark leaf mass covers the top third at 838): move the crane
  stations north of the tree (7.0, -4.9) or hide the crown for that lens. Coffin on the tower top not readable at 838.

## Numbers
- Pass A 35 frames 1.9 s/f, pass B 283 frames 2.8 s/f (another builder rendering), all 305 frames + blend in 924 s. Checks: about 13 min frame_checks + camsafe.
- draft.mp4 10.17 s with voice (21.27-31.43 s), KEYFRAMES.jpg (13 keys), strip_4fps.jpg. Test stills key/t1..t6.

## FIX ROUND 1 (FIX_LIST_v1 S4 line, 2026-11-22, cap 60 min, took about 45 min)
Done: camera = 6 passes joined by dissolves (A 638-672, B1 wide time-lapse 660-712, B2 close 705-745, B3 trolley+tower 738-847, B4 catch+cloche 840-891,
B5 certificate 884-942; blend.py, render_s4.sh, rerender_b345.sh); window camera p90 31.7 -> 6.0 px/f. The crane stays clear of the tree crown (cameras
moved north). The deck chair moved to (5.8, -3.7) in front of the wide: the owner and his beard read, one beard puppet at a time (hidden act at 0).
Michel's legs follow the table (all looks at the table, legs r .034): seated, no spikes toward the lens. His near hand lifts the cloche (held3d
buildCloche 860-880); the caught plate + coffin go down on the far left of the cloth so the certificate bite (far hand, angle -75) is seen.
Owner at the cradle (1.4, -0.1) drawn camera-safe (ep_s4b: front export draws 'front', default draws 'side').
Checks: camsafe 1221 checks 0 FAIL (2 WARN); frame_checks 0 FAIL / 2 WARN (table top 1 % in his torso) - NOTE: only 34 checks on the cut film.json
(114 on the one-take v1), the cut version samples fewer frames; film_plan window gates PASS (8 FAIL are pre-window frames 0-659 as before).
NOT done: the coffin on the TOWER TOP still does not read at f838 (B3 framing at 838 is low; the coffin pops at 832 but is not seen). The coffin on his
plate reads at 850 as an upright brown box (small). The owner at the cradle stands behind Michel's head in B4/B5 (overlap). Tree crown still in the
top-left of the time-lapse wide (not a camera rise). film_A not checked on its own.

## FIX ROUND 2 (lead: coffin + owner, 30 min cap)
Done: makeCoffin() in sets/s4_apron.js = classic six-sided coffin, warm varnished wood, raised lid, brass cross + 6 brass handles; 1.25 m on the tower
top (sits on the TV tier; the glb box was inside the TV cabinet), shrinks to 0.62 m in the fall onto his plate (same model on the plate and on the cloth).
B3 end station re-aimed at the tower top (f838 shows the coffin). The owner at the cradle moved to (1.6, -1.3) and B4/B5 aims shifted left: he stands
left of Michel, never behind his head. Re-rendered B3-B5 only. Weak: the coffin on the held plate stands upright (plate orientation in the hand).

## FIX ROUND 3 (lead: tree blob + legs, 20 min cap)
Done: film_B1 sets places.apron.hide_near_tree (s4_apron.js hides the 3 near-tree meshes within 4.5 m of tree_table, above 2.2 m) for the time-lapse
wide; film_B2 (f705-745) plays moves/ep_s4n.mjs = the same seated move with invisible 3D legs (seated card only). Re-rendered B1 + B2 only, blend, mp4.
film.json (the checks' cut version) still uses ep_s4 with legs for B2's frames.
