# Fake surgery v3: fix EVERY item of ISSUES_v2.md (CB 2026-11-17: "Yes, fix all")

The list with causes is in `ISSUES_v2.md`. All the rules of `FIX_BRIEF_v2.md` still apply (flowing camera, no human body parts, no sliding, no half heads, effects that read in 1 s, bright comedy). The v2 frames were deleted after approval: every stretch re-renders its WHOLE range from its ONE command (delete `final/raw`, `final/handles` and `final/frames` first if they exist; the render skips files already on disk).

## Shared pieces (phase A, built before the stretches render; import them, never rebuild)
- `sets/water_fx.js` (FX helper):
  - CARTOON WATER that reads as water: see-through cyan to white, white foam crests, white highlight streaks, fat drops flying in arcs with gravity, a splash crown that rises and collapses, ripple rings, a wet sheen where it lands;
  - animated per frame;
  - two presets: `bulb_splash` (S1 rows 4, f85-115) and `jug_flood` (S3 row 29, f1215-1260, plus the shin-deep floor water).
  - It replaces the opaque blue shapes (A1, A2).
- `sets/zzz_fx.js` (FX helper): FLOATING Zs:
  - letters rise from above the sleeper's head, drift sideways, grow and fade, about 3 at a time, one born every 0.5-0.7 s, looping;
  - anchored to a head position per frame, never on the face (A3).
  - The static zZ in the ko faces (S1 `koZ`, S3's ko, S5 `koSleep`/`memes3.mjs`) is removed; the face keeps the spiral/X eyes and tongue.
- ENVIRONMENT v3 (two set helpers): each set gets a new key `env_v3: true` (default off; every stretch switches it on) that makes it richer at phone size (A7):
  - no big flat wall left empty: wainscot/dado, door frames, notice boards with papers, framed posters, signage, wall lamps, handrails, fire extinguisher, outlets, plants, clutter on surfaces;
  - wall colour bands and light pools instead of one flat colour;
  - foreground objects for depth;
  - a second light colour per place (bounce or window).
  - Same 1990s Houston hospital, kit3d, ONE red = pain only.
  - Corridor + office: helper E1. OR + stairwell + waiting room: helper E2.
  - Each proves before/after stills of the same camera (saturation, edge density, red px).

## Per stretch (phase B; your items, most important first)
- **S1 (0-386)**
  - A1: water_fx `bulb_splash`.
  - A3: zzz_fx on the patient.
  - A4: at 10.0-12.2 s ("Doctor, you forgot the operation") the camera moves to the NURSE: a medium two-shot of her whispering at the surgeon's ear, her face big, mouth moving; back to the surgeon's smiling eyes on "operation".
  - B1: frame 0 and the splash shots without the patient's head cut by the left edge (whole head in, or out of frame).
  - B2: the knee close-up without the surgeon's head cut at the top (frame his whole head or keep him out).
  - B3: 0:11.5 the empty wall with a half figure: the flight to the door passes the team, not a wall.
  - env_v3 on.
- **S2 (363-789)**
  - C2: the colleague's question must SHOW at 18-19.5 s (the speech bubble with the "?" and the sticky note in frame, with the surgeon).
  - C3: wincing patients on the gurneys (cards lying or sitting, faces readable, never clones).
  - C4: porthole silhouettes bigger, readable shaver and jug.
  - B4: surgeon whole at 19.5-20.5.
  - B5: surgeon whole at 22.5-23.5 with the tower.
  - D1 (24-26): no lamp glare on the trays, labels readable.
  - env_v3 on.
  - Keep your last office station for S3, or write the new one in STATE.md first thing.
- **S3 (765-1301)**
  - D1: tray labels "60" readable (no glare).
  - B6: surgeon whole at 28-29.5.
  - D7 (31-32): no twin surgeons (the second green figure becomes a patient or another colour).
  - A5 (33-35): both heads whole, no overlap, window not blown white.
  - A6 (35-36.5): the gurney through the OR doors slower (about 2 s), a dissolve on the motion into the OR, no jump.
  - C5 (36-38): the CRT smaller in frame with the VCR and its "REAL ONE" tape label readable and the surgeon/patient beside it; not a pink blob filling the frame.
  - A2: water_fx `jug_flood`.
  - A3: zzz_fx.
  - D2: dissolves without long double images (shorter, on matching motion).
  - env_v3 on.
- **S4 (1278-1695)**
  - B7 + C7: NO waist-down crop: the patient WHOLE (head to feet) on the stairs, a low camera, his three cartoon plasters on the knee big enough to read, then the three springy strides readable.
  - B8: climbers' heads whole.
  - B9: surgeon whole at the chart.
  - C6 (53-55.5): the surgeon IN frame: he looks from the scope case to the bars, the lid shuts beside him, his face shows the turn.
  - D5: no lamp globe sweeping across the lens.
  - D2: the stair-to-chart dissolve without a long ghost.
  - env_v3 on.
- **S5 (1672-2229)**
  - C1 SIGNATURE: the boy's knee and the plaster CLEARLY seen: the knee in front, nearest the lens, the nurse's fist landing on it, nothing between knee and lens.
  - C8: the thought bubble bigger and lower (fully inside the frame, beside his head).
  - A3: zzz_fx.
  - D3: the 2004 office window overcast grey-lilac evening, no snow-like dots (blizzard papers only near the desk).
  - B10: surgeon whole at 1:07.
  - B11: surgeon not hidden behind the nurse at 1:09.5-1:10.5.
  - D4: no orange blob crossing the foreground at 1:11.
  - D6: the veteran with the grandkid on his shoulders stands out in the last frame (nearer, bigger, lit, a clear gap around him).
  - B12: the nurse not touching the edge.
  - D2: dissolves short.
  - env_v3 on.

## Every stretch, before reporting
- film_plan.py check (camera) before rendering.
- After rendering: make_final, flicker.py, frame checks (`timeout 420`, 0 FAIL except the named waivers: reclined patient under the drape, grandkid on the shoulders, the planned splash), motion gate, check_film.py on the preview.
- A self-look at strip_2fps.jpg against your ISSUES items.
- STATE.md "v3" section; report in at most 15 lines naming each of your ISSUES items as fixed / not fixed.

## ADDED (lead, after the env_v3 tests): DRESS WHAT YOUR CAMERA SEES
The set-wide env_v3 pass gives only a moderate gain because the test cameras face back walls. Every stretch builder therefore dresses its OWN shots (in its wrap/place keys or build_film props):
- no empty wall or ceiling over about 30 % of any rest frame;
- at least 3 readable story-world objects behind or around the actors in every rest (posters, a cart, a plant, a notice board, equipment, chairs with coats, a window view with trees and cars);
- one foreground object for depth on wide shots;
- use the env_v3 pieces first (sets/STATE_env.md, STATE_env2.md list them), add new small props in your own wrap file.
- Check red-gate px on every new prop (the stairwell poster heart already adds 12 px: recolour it to orange or purple).
