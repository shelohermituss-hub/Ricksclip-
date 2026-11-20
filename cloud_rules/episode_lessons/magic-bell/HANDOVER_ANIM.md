# Magic bell animation handover (from the "apply new rules" thread, 2026-11-12 05:00 Bangkok)

## Where things are (project files episodes/magic-bell/)
- look_build/hall/: every builder and tool. build_hall.py, build_night.py, build_kitchen.py (all exec hall_head.py), r_hall.py / r_night.py / r_kitchen.py (render + grade + post6b), post6b.py (Rick 6b colour pass, 'ink' mode keeps the black bell black), one.sh (proj check + one still), anim_hook.py + anim_chunk.sh (animation), fx_slap.py (2D hit overlay), cards_gen.mjs (cards from the motion library), rig_cast.mjs (v13 limbs; goes in /home/user/skill/templates/motion_styles/), tune_*.json, jobs_*.json.
- look_build/cards/: all card PNGs + meta.json (v13 template), incl. the slap sequence sl_00..sl_29 and guard_grip (curtain held in the fist).
- look/v13_full_set.jpg: the 14 approved-direction stills; tunes: hP1c, hR2, hB3, hT2b, hT3b, hT4b, hH2, hL2, hV2, hJ, hW2, kA2, kB2, nT2.
- anim/slap_test_v1.mp4 + slap_test_v1_frames.png: first animated shot.

## Setup in a fresh container
apt-get install -y libegl1 libegl-mesa0 ; copy look_build/hall to the work dir (paths in scripts assume /home/user/work/bell), cards to ./cards, rig_cast.mjs into /home/user/skill/templates/motion_styles/. Run one render per foreground call (container restarts kill background jobs).

## Animation method (slap test)
1. Character frames: cards_gen.mjs with one job per frame (jobs_sl.json). Hand path as wx/wy targets; slap override fx none|smear|hit and burst scale; face changes on the hit (sus -> k:smirk).
2. Tune gets "anim": {name, card (the card in "cast" to swap), seq "sl_%02d", frames, hit, push, swing, from, to}. anim_hook.py: camera push over the whole shot + 4-frame shake on the hit, bell pendulum from its hang point (hang_z 3.4), lanterns sway out of phase + kick on the hit, card image swapped per frame.
3. ./anim_chunk.sh tune_aSlap.json <from> <to>  (res 30, samples 6, ~60 s/frame on cloud EEVEE; 8 frames per call fits the 10 min limit).
4. grade_day.py per frame, then fx overlay (fx_slap.py: rings, flash, dust; hit point is a screen coordinate, set per shot), ffmpeg at 12 fps on twos -> 24 fps.
Known gaps: no sound yet, wind-up could be bigger, grade darker than Rick (no cast mask in anim, so post6b is not used; add a mask pass per frame or a global lift).

## Rules
The PC rule files are written only by the crew thread. New CB rules applied here: light on characters, micro motion, air life/weather, studio motion, satisfying VFX, physics + body angle by camera, traits + cartoon power VFX, foot contact shadows, no motion blur (smears), quick blends between shots (6b).
