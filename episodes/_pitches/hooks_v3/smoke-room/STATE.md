# smoke-room STATE (pitch 3 "The Room Filled With Smoke and Nobody Moved", first 5 s board) 2026-11-16

## Files
- out/p1.png, p2.png, p3.png (1080x1920, frames 0 / 60 / 120), out/board.jpg (3 x 540 px + words + title), out/frame_checks.md, out/plan/ (baked)
- OPENING.md: "Smoke is pouring into the room, and he just keeps writing. So do the two men beside him." (18 words, about 5 s)
- Rebuild: film_plan.py bake film.json, then gpu_render.sh film.json --frames 0,60,120 --scale 1 --no-captions --stills-dir out
- film.json: place `room`, 3 cast, 5 acts (3 episode moves, 0 plain kit poses), 3 held3d pencils, 3 stations (f0 lens 22 medium on the student;
  f60 low from his left; f120 pull-back low-left wide), end 150
- sets/waiting_room.js: vinyl tile floor, teal dado + mint wall, oak chair rail, acoustic ceiling; THE VENT (louvres, 4 screws, dark duct, soot smear);
  THE SMOKE (460 sprite puffs out of the vent, rise, spread under the ceiling, sink; 14 layer sprites; thickness grows f0 -> f150; fog closes in);
  one-way mirror with the faint observer + clipboard; school clock at 2:47; cork board (SUBJECTS NEEDED $2 PER HOUR, SPRING 1968, NO SMOKING);
  door ROOM 418 PSYCHOLOGY frosted glass; window with venetian blinds + radiator; coat rack with trench coat + umbrella; 3 walnut/chrome tables with
  the COLUMBIA questionnaires, Greek-key coffee cup, glass ashtray + butt, two textbooks, pipe pouch, matchbook, SPECTATOR newspaper; shell chairs;
  green enamel pendant lamp = the ONE key (SpotLight with shadows, additive cone that brightens with the smoke, floor pool); foreground chrome
  pedestal ashtray + wastebasket with crumpled forms
- sets/props.js: buildPencil (yellow hex No. 2, band, ribbed ferrule, eraser, shaved cone, graphite)
- cast/sheets/smoke.mjs: student (mustard crew-neck over white button-down, mop-top), calmA (grey tweed, narrow tie, side part, pipe), calmB (navy
  blazer, maroon tie, flat-top, square glasses). Period 1968 checked in the header.
- moves/ep_smoke.mjs: st_write (word strokes + carriage return), ca_pipe (slow writing + shrug f100), cb_write (page turn f70); front seated at a table

## Numbers
- frame_checks: 0 FAIL, 0 WARN, 50 PASS. Saturation p1 0.342 / p2 0.347 / p3 0.441 (target >= 0.30), brightness 0.57, near-black 0 %
- student about 50 % of frame height in P1 (head 0.43, soles 0.92), faces 0.30-0.38 of height (above the lower third)

## Weak against Rick
- The smoke reads as a ceiling cloud more than as smoke POURING from the vent: the plume out of the grille is faint (more and denser young puffs at the
  vent mouth, a darker wall behind it).
- P2 is too close to P1 (same front card, a little lower); the pencil is hidden behind the cup. Better: a true push-in on pencil + form with the vent
  over his shoulder, cup moved left.
- Cards face the lens, so cameras must stay within about 25 deg of the front axis (wider angles put the body into the table / chair).
