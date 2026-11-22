# collide: does anything pass through anything? (user rule 2026-11-22, "nothing collides")

Guards the rule on the MOVING film: no character through a table, seat or wall, no held prop through another body, no character through another, no resting prop sunk in or floating over its support. **A version with a FAIL is not sent to the user.**

## Run

```
node tools/collide/check_collide.mjs <film.json> [--window a-b] [--step 2] [--box-fail] [--all] [--puppets dir,dir] [--out dir]
```

- Needs the baked plan beside the film (`out/plan/camera_baked.json`).
- One `render_gpu.mjs` page session (`page_collide.js`), no drawing. Measured here: the 460-frame example every 2nd frame in 3 s.
- Writes `out/collide.json` beside the film (`summary` with the numbers used and which set meshes were not tested and why, `rows`). Exit 1 on any FAIL, 0 otherwise, 2 when it could not run.

## The optional block in film.json

```
"collide": { "ignore": ["curtain*", "rug"], "floor": ["platform_slab", "ground*"], "resting": { "cup": "table_top", "clock_foot": "platform_slab" } }
```

- `ignore`, `floor`: name patterns (`*` = anything) of set parts that are never tested against a body (the name of the mesh or of a parent).
- `resting`: prop name -> support name (object names in the scene, or the `obj` of a `held3d` entry). Without it FLOATING / SUNK is not tested, and the run says so.

## The volumes

- A character = a box on its card: from the sole to the top of the drawing, as wide as the body (median left and right edge of the drawn rows between 30 % and 85 % of the height, so an arm held out does not widen it), 16 cm thick (`--depth`). Against the set the lowest 6 % is left out (the floor is the business of `frame_checks` feet).
- A set part = the oriented box of every visible named mesh. Not tested: see-through and effect materials, names with sky, fog, glow, smoke ... (`--skip`), `collide.ignore` / `collide.floor`, held props, instanced copies, skinned meshes, and any box that also contains the camera (a room). The run prints the count of each.
- For `BODY_IN_BODY` and `PROP_IN_BODY` the character is a STANDING volume: same feet, width and height, but upright (the card leans to the lens, several cm at head height; a body does not) and 30 cm thick (`--pair-depth`).
- A held prop = the box of each `held3d` group (the kit's `R.h3o`).

## The rules and the numbers

| rule | level | when |
|---|---|---|
| `BODY_IN_OBJECT` | FAIL | the body box is over 5 cm into the part's box on every axis (`--pen`) AND 10 % or more of the drawn body points are inside the mesh (`--in-fail`; two rays per point along the card's normal, an odd number of walls each way, 1 cm deep: the `frame_checks` body_in_mesh test). 3 to 10 % = WARN. |
| `BODY_IN_BOX` | WARN | the boxes overlap over 5 cm but no body point is inside the mesh (an open or hollow part: legs under a table top, an arch). `--box-fail` makes it a FAIL. |
| `SEAT` | not shown | the part's name has seat, stool, bench, saddle, sofa, couch (`--seat`): sitting in it is not a fault (`--all` shows the rows). |
| `BODY_IN_BODY` | FAIL | two characters whose volumes (body width, 30 cm thick, `--pair-depth`) are over 5 cm into each other in the world AND whose boxes overlap 25 % of the smaller one on screen (`--pair-overlap`). |
| `PROP_IN_BODY` | FAIL | the centre of a held prop's box is inside the volume (30 cm thick) of a character who is not holding it. |
| `FLOATING` / `SUNK` | FAIL | a `resting` prop's lowest point is over 2 cm (`--rest-tol`) above / below the support's surface under the prop's centre (a ray straight down; the support's box top when the ray misses). |

One row per rule, pair and run of checked frames in a row (`f60-80`), worst frame's number in the text. The `resting` line above the table gives the smallest and largest gap measured, also when it passes.

## Known blind spots (said plainly)

- A character is a flat card that turns and tilts to the lens: its volume is a thin box, not a body. Limbs held out (an arm through a wall, a foot in a box) are outside the body width and are not tested. A prop through its OWN holder is not tested.
- `BODY_IN_OBJECT` needs a closed mesh (the ray count). A part built from open planes, two solids that overlap, or a part inside a group box gives `BODY_IN_BOX` (WARN) at most. Instanced copies and skinned meshes are not tested at all.
- A part whose box contains the camera is skipped whole, even when a character is inside its wall. Parts with no name are skipped.
- Seats are known by name only: a standing character inside a part named `..._seat` passes; a chair named otherwise under a seated card fails (add it to `collide.ignore` or `--seat`).
- `PROP_IN_BODY` tests one point (the box centre) of generic `held3d` props only. A long prop whose tip is in a body while its centre is outside passes. Props drawn on the card (2D, `held_by`) and set props carried by script are not held props here. Held prop against the set is not tested.
- `BODY_IN_BODY` is deliberate contact too (a hug, a carry): such a pair fails until the staging is changed or the check is run with a wider judgment by the lead.
- `FLOATING` / `SUNK` only for pairs written in `collide.resting`. It uses the lowest point of the prop's world box: a tilted prop or one with a part hanging below its base reads as sunk. Something above the support at that spot (a lamp over the table) is taken as the surface.
- `--step 2` checks every 2nd frame: a pass-through of one frame can be missed (`--step 1` takes twice the time).
- The three.js stage only: a Blender pass that moves something is not seen.

## Proof (2026-11-22)

- `templates/film_example/film.json`, every 2nd frame of 460, 3 s: 235 meshes tested, 0 FAIL, 0 WARN. A copy with `"resting": {"clock_foot": "platform_slab"}`: gap 0 to 0 cm, PASS.
- A broken copy (clock lifted 30 cm, kid put in the engine f60-80, master put on the kid f100-110, lady put on the master's held stick f112-120): `FLOATING clock_foot / platform_slab f0-120 30.0 cm`, `BODY_IN_OBJECT kid / engine_body f60-80 100 %`, `BODY_IN_BODY master / kid f100-110`, `PROP_IN_BODY stick (held by master) / lady f112-120`. Exit 1.
