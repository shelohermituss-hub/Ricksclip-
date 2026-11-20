# LEAD QUEUE: decisions and notes per stretch (lead, 2026-11-16). Every builder reads its part.
## Decisions
- PLACE_KEYS.json values (look helper, 2026-11-16) APPROVED as start values. Measured on the test box: NI brightness 0.273 (< 0.31) and AF/EV distance 17.9 (< 18) still fail; they are re-measured on the REAL sets.
- NI fix = the office set itself: a real desk-lamp pool, lighter wall panels and ceiling (S2 owns office.js; target NI mean >= 0.31 without washing out the blue window).
- EV: push the coral sun more orange (hue 24-30) wherever it lands on pink terrazzo; 0 red-gate px outside rows 34 and 36-38. EV_or (OR evening, 0.247) needs a warm corridor glow through the door + a lit porthole (S5). AF/EV re-measured by S4/S5 on the stairwell.
- GR sat 0.293 accepted (about 0.30 by design).
- Mouth interiors are exempt from the red gate (LOOK_BIBLE).
- Skies: the look pack's four skies stay for the board; no background-painter before the gate.
- `sets/lp_testroom.js` is a TEST box only, never used in the film.
## S1
- The knee patch is only 10 % of frame width at the hook camera: frame 0 needs >= 22 % (knee nearest the lens, front-low third).
- The near drape hangs as one flat blue slab and the torso drape is a stiff tube: give the drape folds (or_room.js, you own it) or hide the slab with the camera.
- Lower `lamp_i` or narrow the cone: a hot patch spills on the floor bottom-left.
- Patient puppet on `anchors.patient_card` (cast/STATE.md: pt_recline etc.); render ONE three.js still of the reclined patient early and check it.
- Coral sky (look_pack.js line 190) pink band moved: stops now lilac -> '#d8a8c8' (low sat) -> '#f4b07a' (hue about 26) -> '#ffb070'. Re-check red px in EV stills (S5).
- Stairwell/waiting sets read `light_kind` (PLACE_KEYS uses `light: 'day'` + `light_kind`) and re-aim the kit sun at their own origins (PLACE_KEYS `dir` ignored there). Fine.
## S4 / S5 (stairwell)
- Last frame station `last_low`: the storey-2 slab fills the upper left and flight 2 is hidden; use the `hide` key or move the camera so the climber stream reads up BOTH flights to the window.
- Stairwell fails fine detail (plain block walls): add notice-board, fire-plan, scuffs in frame where cheap. Waiting room: ceiling grid takes the top third of the wide; lower the aim.
## S2 (owns corridor.js + office.js from now; FIX FIRST, the others depend on it; set helper B1 report in sets/STATE_b1.md)
1. office.js `dress: 'stripes'`: NO blind stripes show on desk or wall (the sun's shadow through the slats does not come through). Fix FIRST: S4 rows 36-39 need it (POWER r37 uses the stripes). Tell the lead in your report when done.
2. office night (NI) mean brightness .286 < .31 and 4 red-gate px (amber lamp turns tray cards pink): lighter panels/ceiling, a bigger lamp pool; card colour away from pink.
3. Corridor saturation .18-.27 (< .30 by day), walls flat yellow: stronger butter-cream + sea-green dado contrast, coloured details (calendar, signs, curtain, chairs), less white-out.
4. Row 15 EXTREME does not read: the freeway is a grey slab, gurneys outside tiny, blind/frame bars clutter: a camera at the window with fewer bars, the gurney line big near and receding to the horizon, the pickup honking near.
5. Pre-op sparse and the curtain is outside the station frame.
Corridor fog: the set's own haze (key fog_out) wins over PLACE_KEYS' [10, 40].
- S2: stripes fixed: office dress "stripes" now has a blind GOBO spot (map = slats, window wall casts) + kit sun x.38; gold stripes across the back wall + light box: lit p90 0.58 vs gap p10 0.22 luminance in the wall patch left of the light box, frame mean 0.428 (sets/_b1_test/out_stripes/f_00000.png, 0.5 scale); keys stripes_i 6, stripes_n 13, stripes_aim, shade_k.
## ALL STRETCHES (props fix round 2, 2026-11-16): HELD PROPS
- On a library move in 3/4 view the kit reads held3d `"hand": "R"` as hands[0] and `"L"` as hands[1]; our moves keep the working near fist in hands[1] -> use `"hand": "L"` (PROPS_README.md "HAND KEY ON A LIBRARY MOVE"). tip_at does NOT move the drawn fist: the move must bring the fist to the target (sg_slap, raised sg_write in sets/_props_test/moves/ep_props.mjs).
- Pen: angle -110, scale 1.4. Plaster: "toward" 0.42-0.55 so it sits in front of the knee. Card tower: animate setSway with a sine; frame it tall from 3 m or closer.
- OR knee (seen in S3 r28b): the knee reads as an orange BALL with plasters stuck on, not a bent knee under a drape window: S1 (or_room.js owner) fixes the knee shape with the bloom.
- Join r35->36 is a plain cut at the gate (3rd hard cut); the build-out makes it the dial->chart match dissolve.
- CB 2026-11-16 on frame 0 (r1/r2/r5 frames): "this looks weired. check better lay on bed in 3d space position with knee more up." -> the patient lies along the table in 3D, the operated knee bent HIGH (foot flat on the table, knee pointing up, upside-down V), frame 0 from the side. Applies to EVERY OR knee row (S1 rows 1-10, S3 27-30, S5 40-41) and the knee closes 5/32/43 keep the window square-on.

## BUILD-OUT (CB 2026-11-16: "Yes, build out"). Each stretch: its full moving take (BUILDOUT_BRIEF.md) + these notes, most important first.
### THE OR KNEE, ONE LOOK FOR THE WHOLE FILM (CB: "lay on bed in 3d space position with knee more up")
- S1 owns it. S1 round 5 = the reference: or_room keys `lie_body`, `leg_drape` (lighter blue #5f8fd0 leg), `knee_win: 'thin'`, `knee_scale`, `steps`, and the bent-leg pose in s1/build_film.py (hip/knee/foot points, thigh + shin about 57 deg up, foot flat). S3 rows 27-30 and S5 rows 40-41 COPY those keys and the leg pose exactly (read s1/build_film.py + s1/STATE.md Round 5), so the patient lies the same way in every OR row.
### S1 (rows 1-10)
1. Frame 0 knee still a soft mound, small: make the raised-knee V crisp (a hard lamp edge along the thigh and shin tops, a darker table drape behind it, fold lines), knee peak bigger in frame (V >= 35 % of width), the 3 dots readable at 360 px; keep the faces above it.
2. The patient pops in at f61: bring him in by the camera move (he is already in frame 0 now; check continuity across rows 1-4).
3. Join S1 -> S2: the camera ends (f362-386) flying toward the OR door porthole, the porthole glass filling the frame at f386; S2 starts out of the porthole glass into the corridor.
### S2 (rows 11-20)
1. Start (f363-387): pull back out of the OR 3 door porthole glass into the corridor (match S1's end).
2. r13 porthole silhouettes readable (shaver, jug pour), corridor saturation >= .30 in rows 12-14, r19 both fists on the tower sides, the "180 KNEES" tab readable.
3. End (f765-789) on the three trays in the night office from the camera S3 starts with (S3 copies your last station: write it in STATE.md early: lens, position, aim).
### S3 (rows 21-30)
1. Start = S2's last office station (read s2/STATE.md; if not there yet, use S2's r20 station from s2/build_film.py).
2. OR rows 27-30: the patient LIES as in S1 round 5 (above); r28 knee pumped like a pump handle with the three plasters readable.
3. r29 EXTREME: the jug pour from high up and the nurse wiping her splashed glasses deadpan IN frame; r21-22 the surgeon's fist on the labels, he stays in frame; r27_b the pink tape fill only a short flash.
4. Hard cut 1 at about 30.9 (new day). Your range ends at 1289; the hard cut 2 at 1290 is the S4 start (render handles to 1301 anyway).
### S4 (rows 31-39)
1. r37 ruler: the surgeon's near fist ON the ruler end (a longer-reaching sg_ruler arm or a set-drawn soft_arm as S1's hand3d does).
2. r39 dust puff reads as beige balls: a soft grey-brown dust cloud (sprite puffs, fading) as the lid shuts; the scope visible until the lid closes.
3. r35 -> r36 match dissolve on motion: the dial needle sweep into the light-box chart (inside your take).
4. End (f1671-1695): the scope case lid shuts onto the lens (dark) for the S5 join.
### S5 (rows 40-50)
1. Start (f1672-1696): open from dark (the lid) onto the OR replay from the patient's side; rows 40-41 the patient lies as in S1 round 5 (above).
2. r43 SIGNATURE: the boy's knee in the row 5 framing: a small bent child's knee in shorts (not a tube), the nurse's round fist with a short soft_arm sleeve (not a pipe) landing one cream plaster on the scuff; the stamp thump on the slap.
3. r40 surgeon edge cut f1745-1765 (move the camera, not him: moving him put him in the leg drape); r50 the thin red strip on the landing edge under the coral light (recolour that edge in your stairwell wrap key).
4. Joins inside: r41->42 dissolve on a glide, r44->45 the boy runs out and the glide dissolves into the 2004 desk, r47->48 follow the tower rolling into OR 3 evening, r49->50 through the OR door with the surgeon; r50 FREEZE + slow push to f2229.

## SOUND (lead 2026-11-16)
- mix v1 at -14.0 LUFS KEPT (the approved Monopoly final shipped at -14.0; CB_RULES 6 "about -16" is older). Retime the "retime" cues in sound/cues.json from the build-out STATE.md files (r40 aura, r43 slap, r10/13/19/21 word fixes), then `python mix.py v2`.
- RULE (S2 round 3): templates film.js adds a 6 m additive halo sprite to every mesh named *lens*/*globe*; ceiling light panels named so veil the frame and pop when the camera passes. Name set lamps otherwise (corridor.js troff_nohalo).
- S4 luma steps 1387-1389, 1420-1422, 1505, 1523 (+-15 mean, deterministic, camera-pose tied, cause not found in 2 rounds): fixed in the JOIN by a deflicker (per-frame mean matched to a 15-f rolling median over listed ranges, planned pops excluded).
- v2 JOIN NOTES (lead): S3 keep in-take dissolves 974->986 and 1056->1076, add 991->997 (pops 977-978, 993-994, 1058-1075); planned: 926-927 hard cut, 1087, 1226-1228. S4 v2r3 accepted (p90 24.5, whips 0). S2 joins: B=375 len 18 (S2 starts 1 m off the glass), clock join = dissolve (frames from s2/STATE.md v2 round 3).
- v2 JOIN: deflicker s5 2000-2015 (luma step 2007-08); keep earlier deflicker ranges only where frames were not re-rendered (s4 ranges no longer needed: camera changed).
