# STATE: astro-flush-study (lead handover, 2026-11-22, session stopped for the user's weekly limit)

PRIVATE EXERCISE (user 2026-11-22): reproduce the first 40 s (f0-1199, 30 fps) of Rick's "Why Astronauts Can't Flush in Space" shot for shot,
to learn his picture, camera, timing and motion until we reach his level. Never published. User asked: helpers on a cheaper model
(Opus) because the top model eats the limit; the lead only briefs, looks at the pictures and reports.

## How to resume in a NEW session (in this order)
1. Work on branch `ccr-59b91efc-ag5h4r` (all of today's work is there; the default branch does not have it).
2. `python tools/install.py --check`, `bash tools/install_blender.sh` (Blender is not in the image).
3. ASK THE USER TO SEND THE VIDEO AGAIN, then `bash episodes/astro-flush-study/refs/restore_refs.sh <video.mp4>`: the reference frames,
   sound and all side-by-sides live in `references/look_match/astro_flush/` which is git-ignored and gone with the old container.
4. Rebuild the sets (outputs are git-ignored): `bash episodes/astro-flush-study/sets/<toilet|ship|mc|cabin>/build_<place>.sh` (ship: about 80 s
   for the Earth and star maps, `NOEARTH=1` skips them once made).
5. Read: this file, `README.md` (shots), `refs/SHOT_BOARD.md`, `refs/LOOK_INVENTORY.md`, `sets/SET_BRIEF.md`, `STRETCH_BRIEF.md` (with MOTION RULES
   and ACTING IN THE KIT at its end), then each `sets/<place>/STATE.md` and `shots/<place>/STATE.md`. LECONS_TECHNIQUES.md entries of 2026-11-22.
6. Drafts are re-made by `shots/<place>/render_all.sh` then `post.sh` (mp4s, side-by-sides, fluidity rows; they need step 3).

## Method that worked today (keep it)
- One Blender script per place, palette table first, flat colours, no texture, no outline on props, every moving thing a named object;
  the kit only loads the GLB (no geometry in the kit). Cameras FITTED by least squares on points measured in his frames; where the
  residual stays high the model proportion is wrong, fix the model.
- Narrow fresh helpers for one problem (Earth and stars, camera fit, motion pops, kit acting) cost less and fix more than long rounds
  with one helper whose context has grown. At most 3 at once; the 4 CPU cores are shared: one kit render and one Blender at a time each.
- Every helper report is checked by the lead on a sheet of the side-by-side BEFORE it is believed (one report said the sleepers showed;
  the video showed bags without heads).
- Kit tools added today: `tools/motion_objects/check_objects.mjs`, `tools/collide/check_collide.mjs`; film_plan `"pin": true` stations and
  act `"ease": "inout"`; film.json `"move_face": true`; cast/act `"upright"`; render stops (exit 4) on a missing or broken move file.

## Where each part stands (worst first inside each line; nothing is at Rick's level yet)
| part | state | next |
|---|---|---|
| cast (`cast/`) | 7 characters, first pass | no true eye roll, no sleep mask, no "smug with one sweat drop" face: needs the user's OK to add face parts (locked package) |
| set toilet | round 2, kit runs | day still light, no halo/floor strip at night, tube dark, opening behind the WASTE LINE hatch + tube entry for one continuous move, bowl swirl, ribbon pivot (`sets/toilet/STATE.md`, requests in `shots/toilet/STATE.md`) |
| set mc | round 2, layout fitted, kit runs | blacks not deep enough, red-violet mood too coloured; Blender `mc_api.frame_state` lacks the new `motion` fades |
| set cabin + sleep bay | round 3, kit runs | night cams f460/f490 fit 15-18 px, end wall too wide, day colours a little dull |
| set ship | Earth/stars round 2, nose rebuilt, close cams fitted (f600 11 px, f790 18, f880 6.5; f680 by eye) | a helper was STOPPED mid-work on: kit light kinds warm/map/radio, glitter as many small sparkles, cockpit slats tone, `newguy_s11` anchor, f990 cam on the porthole side, flame ignition without a scale pop, f680 (list in its brief = end of `shots/ship/STATE.md`); check `sets/ship/` for half-done edits before rebuilding |
| staging mc (shots 3, 10) | round 3 (motion fix): pops .32 / jerk .18 (his .29 / .15); mc10 pops .06 (his 0) | add `"move_face": True` and drop face-only acts; 3 controller head JUMPs at f132; ceiling glow pop f131; controllers cut by the left edge; lunge still stands out |
| staging cabin (shots 4, 5) | round 2 rendered; a helper was STOPPED mid-fix | sleepers not visible f411-447 in the draft; cards dim at night (his stay bright); heads 15-20% too big at f330/f390; remove the 37-54% scale trick at f300-318; new guy's face at "rolls his eyes"; then `move_face` + cast `upright` instead of the wrapper |
| staging toilet (shots 1, 6, 12, 13) | round 1; round 2 STOPPED mid-work | faces/poses on his frames with `move_face`; s6 new guy at x 50%; s12 figures scale 1.0, camera pinned; exploded parts eased; pan + dive as one eased move; no white-out at f1170 |
| staging ship (shots 2, 7, 8, 9, 11) | films written; only s11 drafted (jerk .108, his .040); renders of s7/s2/s8/s9 were killed | finish renders at scale 0.5, then the worst-first list in `shots/ship/STATE.md` |
| joins between shots | NOT STARTED | picture-in-picture planes fed with the neighbour shot's frames: `mc_space_panel` (shot 2 keeps playing), `cabin_monitor_pic` (mc room from `cam_monitor`), the toilet room behind `porthole_a` at f35-41, `newguy` behind `porthole_b`; dissolves f411-422, 495-499, 531-537, 706-712, 763-770, 998-1006; hard cuts 802/803, 866/867 |
| whole 40 s draft, side by side with his | NOT STARTED | assemble, `fluidity_clean.py` per shot against his, the two check tools on every film |
| Blender film (key frames, RunPod) | NOT STARTED | compare draft vs Blender over the WHOLE film at 2 fps before any paid render (REGLES_METHODE 2); RunPod needs the user's OK and cost cap |

## Open questions for the user
1. Look level per film: "video game" style (coded objects, flat colours, as this video) or "clean realistic" (downloaded nature and vehicles, as
   the car scene)? Proposed: choose per film before building. It changes the 2026-11-20 rule "ready-made assets first": not written in CB_RULES without his OK.
2. At the end of the exercise, test ONE shot three ways (kit final, Blender final, Rick) to decide where this style should be rendered.
3. Fluidity gate: Rick's own 40 s fail our film-level gate on pops (.089 > .08) because of his fast joins: compare per shot against his numbers instead.
