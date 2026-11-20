# STATE env helper E1 (2026-11-17): corridor.js + office.js, place key `env_v3: true` (default OFF; S2-S5 unchanged until a stretch switches it on)
Test: `sets/_env_test/` (run.sh = make_film.py + bake + 16 stills via ../../tools/gpu_render.sh + measure.py). Sheet `_env_test/env_v3_before_after.jpg`
(top row before, bottom row after, same cameras), numbers `_env_test/numbers.txt`. Backups of the files before this round: `_env_test/*_before_env_v3.js.bak`.
Cameras: corridor A = S2 station 414 (door/portholes wall), B = corridor.js STATIONS.wide; office A = S2 station 616 (desk + lockers), B = S3 station 765 (trays).
Place blocks: CO = S2 `co` block (static keys), NI = S2 `of` block (static), AF = PLACE_KEYS AF + dress stripes, GR = PLACE_KEYS GR + dress y2004.

## What env_v3 adds
CORRIDOR (envV3Corridor, end of corridor.js): ochre low band z 1.2-1.5 + oak chair rail, teal/navy stencil frieze z 2.42-2.52, light cream band to the
ceiling + picture rail on every wall run; oak handrails on brackets z 1.02; outlets z .3; doors 208 STAFF LOUNGE (right y -2.7) + 212 RECOVERY (right y 6.5)
with wired-glass vision panels, number plates, levers, kick/push plates; framed posters WASH YOUR HANDS (left y -1.0), QUIET PLEASE (left y 1.55),
THE KNEE JOINT chart (right y .9), HEALTH FAIR 1994 (right y 7.9); 2nd cork notice board, 8 papers + pins + polaroid (right y -1.1); recessed fire
extinguisher cabinet with a stainless water can (right y 4.55, no red); flag signs SURGERY (left y 3.3) + RADIOLOGY -> (right y 7.5); 4 warm sconces with
wall pools (2 point lights); 2nd light colour: troffer lights cool #eef4ff, warm window spill #ffb45a (spot + floor/wall pools); foreground dracaena (left y -.2)
+ supply cart (right y -1.6); S2's red "HOUSTON TX" calendar lettering repainted navy (was 153 red-gate px). Micro motion: plant leaves sway (air-con).
OFFICE (envV3Office, end of office.js, all dresses): wallpaper border z 2.36-2.50 + crown moulding on 4 walls; high shelf back wall (binders, books,
FILMS 1993 box, trophy, trailing pothos, vines sway); 2 diplomas (no names); bulletin board above the lockers (3 knee X-rays, call rota, notes, Galveston
postcard); tall filing cabinet + folder stacks + calendar 1994/2004 (right wall y 1.95); coat rack + white coat + stethoscope + navy windbreaker (corner);
mini fridge + magnets + menu + microwave + cups (x .78); dusty-blue lattice rug; desk clutter (stapler, tape, folders, photo frame, sticky pad).
Light: D1 lamp spot capped 8 (night) / 6, warm points x .45, penumbra .75; NI cool fill (2 points) + moon floor patch + X-ray halo; AF faint sun wall glow;
GR (D3) blinds tilted open + light slats + grey-lilac window glow + cool window key + dust cut to 30.

## Numbers (0.5 scale, ungraded; before -> after)
| still | sat | bright | red px | edge | colours | mid-band clip % |
|---|---|---|---|---|---|---|
| CO A | .509 -> .467 | .480 -> .468 | 153 -> 0 | .200 -> .218 | 428 -> 436 | .7 -> .8 |
| CO B | .672 -> .570 | .431 -> .430 | 0 -> 0 | .252 -> .277 | 325 -> 399 | 3.2 -> 4.0 |
| NI A | .643 -> .592 | .275 -> .284 | 0 -> 0 | .097 -> .155 | 427 -> 519 | 5.6 -> .9 |
| NI B | .613 -> .571 | .365 -> .321 | 0 -> 0 | .116 -> .167 | 427 -> 579 | 23.1 -> 6.7 |
| AF A | .788 -> .777 | .274 -> .265 | 1 -> 0 | .101 -> .154 | 308 -> 345 | .9 -> 1.1 |
| AF B | .763 -> .729 | .282 -> .279 | 3 -> 2 | .126 -> .159 | 372 -> 401 | 6.6 -> 6.1 |
| GR A | .564 -> .538 | .288 -> .308 | 0 -> 0 | .104 -> .151 | 334 -> 379 | 5.9 -> 5.4 |
| GR B | .512 -> .509 | .335 -> .334 | 0 -> 0 | .116 -> .141 | 373 -> 414 | 13.7 -> 11.1 |

## Weak / open
- Office edge .14-.17 is still under the 0.18 gate median (corridor .22-.28 passes). Next: more parts on the lockers' faces and the desk front.
- NI A brightness .284 < .31 (it was .275 before); the stretch grade or more NI fill (ai) has to lift it.
- GR B mid-band clip 11 %: the 2004 CRT screen + white keyboard. The lamp is not the cause any more.
- AF B 2 red px are not from env_v3 (they were 3 before).
- D3 window: not in either test camera (the window is on the left wall). The fix is built (open blinds, glow) but not seen in a still yet; S5 must check its 1:07.5 frame.
- The corridor CO B ceiling troffer over the lens reads whiter after the cool shift; troff_nohalo is on; look at it in S2's flight.
- Dust motes (office, 220) still sparkle in the NI foreground (not env_v3; key `dust`).
- Stand-ins -> BlenderKit: posters/boards stay canvas; extinguisher cabinet, sconce, coat rack, mini fridge, microwave, filing cabinet, dracaena, pothos are coded stand-ins.
