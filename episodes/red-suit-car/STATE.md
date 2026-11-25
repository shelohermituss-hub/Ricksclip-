# red-suit-car: STATE (2026-11-25)

A 5 s test short asked by the user: "a guy in a red suit and a gold hat going out of a red sport car". No narration, so no script or
voice gate. The user named no tier, so it was built at Standard. One place, one take, one character.

## What is built
- `cast/sheets/redsuit.mjs`: `boss`, standard body, outfit recipe `redSuitBoss` (red two-button suit, cream shirt, gold tie, gold
  hankie and pin), slick-back hair, pencil moustache (signature detail), gold fedora with a dark red band. Library files untouched.
- `sets/casino_front.js`: golden hour casino front ("PALACE" marquee with bulbs, "CASINO" sign, teal facade, cream columns with gold
  capitals, lit windows, cypress planters, brass rope posts, valet podium, street lamps, brick blocks down the street, gold-capped
  bollard near the lens, puddle, dust motes, clear-day clouds). HERO OBJECT: the red roadster (clearcoat body with arches, hinged
  driver door, mirror, handle, chrome windscreen, cream bucket seats with gold stitching, humps, roll hoops, wheel, dash gauges,
  five-spoke chrome wheels with discs and gold calipers, headlights, grille, gold badge, gold pinstripe, vents, exhausts, plate BOSS 1).
  Door, slam rock and the hat flash are timed in DOOR / GLINT at the top of the file.
- `s1/moves/ep_car.mjs`: one episode move `out` (seated, pushes the door, swings out, rises, touches the hat brim, backhand shuts the door).
- `s1/film.json`: 150 frames, camera v2, camsafe, kit3d, 4 stations (low wide hook, flight in, push on the hat, pull back to land).
- `sound/mix.sh` -> `sound/mix.wav`: Kevin MacLeod "Dances and Dames" under, 10 library effects on their frames, -15.9 LUFS, peak -1.3 dB.

## Commands
- Plan: `python tools/film_plan.py check episodes/red-suit-car/s1/film.json`
- Frames: `node templates/threejs_film/render_gpu.mjs episodes/red-suit-car/s1/film.json --frames 0-149 --scale 1 --stills-dir <dir>`
  (software WebGL here: about 5-15 s per full-size frame)
- Sound: `bash episodes/red-suit-car/sound/mix.sh`

## Plan gates still failing (written for 60-75 s narrated films)
- camera speed median / p90 and dead-still share: a 5 s clip with 4 stations moves less than Rick's long films.
- effects per 10 s and mood changes per minute: the hat flash and the slam are built in the set, not declared as film.json fx/moods.

## Known weak
- The asphalt reads warm under the golden light, not neutral grey.
- The door has no window and no inner detail beyond the trim and the armrest.
- No street ambience sample in the library (music and effects only).
