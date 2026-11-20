# S5 STATE (BUILD-OUT, 2026-11-16): rows 40-50, film 1684-2229 (render 1672-2229), script lines 13-16. Board rounds 1-4: scratchpad copy STATE_s5_before_buildout.md (summary below).
## The ONE command (from s5/)
`python build_film.py && HANDLE=1 python build_film.py && HANDLE=2 python build_film.py && python ../../../tools/film_plan.py bake film.json && rm -rf out/.puppet_cache && python final/render_final.py && python final/make_final.py`
then `timeout 420 node ../../../tools/frame_checks/check.mjs film.json > board/checks.txt` and `python ../../../tools/frame_checks/flicker.py final/frames`.
- render_final.py: main (film.json 1672-2204 -> final/raw), h1/h2 (film_h1/h2.json, 12 frames per join -> final/handles; each job bakes its own json into out/plan, film.json is baked back at the end).
- make_final.py: raw -> final/frames + 4 join dissolves + the FREEZE 2205-2229 (frame 2204 held, digital push 1.00 -> 1.06 toward the surgeon's face) + numbers.txt, strip_2fps.jpg, preview.mp4 (720 w + voice).
## Takes (film frames)
orrp 1672-1765 (rows 40-41, OR; 1672-1694 opens from BLACK = S4's lid, waiting.js `fade`) | wait 1766-1925 (42-44, AF) | off 1926-2062 (45-47, GR 2004) | ore 2063-2155 (48-49, EV_or) | st 2156-2229 (50, EV).
## Joins (inside S5, all dissolves on motion; no hard cut in S5)
- 1766-1777 r41->42, 1926-1937 r44->45, 2063-2074 r47->48, 2156-2167 r49->50: the out-take keeps moving 12 frames (handle render, its people kept 12 f) and blends into the moving in-take (smoothstep).
- Start: 1672-1694 black -> OR replay (veil keyed 1 until 1678, 0 at 1694). End: FREEZE 2205-2229; the editor blends 2218-2229 into frame 0 for the loop.
## Impact / power hit frames (for sound + join)
- ROW 40 POWER "fixed": kick 1709 (shake), aura on twos 1709-1765, field 1717-1740, sparkle 1717-1765.
- ROW 43 SIGNATURE slap: fist lands 1844 (plaster on the scuff 1844, stamp-thump sound 1844), lifts by 1853.
- ROW 46 EXTREME stamp SLAM: impact frames 1977 (white) + 1978 (gold), kick 1977 amp 1.2, desk sag 1977-1993, paper blizzard 1978-2016, pens 1978.
- ROW 50 POWER "missed": impact frames 2194-2195 (warm two-tone, multiply), kick 2194 amp .5, ray burst from the window 2194, sparkle on the grin 2194+, FREEZE + push 2205-2229.
## BUILD-OUT changes
- OR knee = S1 round 5 (one look for the film): orrp keys knee_v3 (same at/hip/foot/face/win), leg_drape #5f8fd0, knee_win thin, lie_body, knee_tone, knee_tapes strips, steps;
  patient on S1's PT [-.6,.78,.9]; surgeon on S1's SG stool [-.08,1.08,.36] behind the table (no more r41 edge cut); aura pts from the knee window to his head.
  Cameras = the frame-0 side view (rhyme): 1672 [-.4,-1.6,1.35]->[-.44,.9,1.3] 26 mm, push 1712 24 mm, 1745 face close 28 mm.
- waiting.js NEW keys: `fade` [[f, op]...] keyed black veil; `recolor` [{match, color}] (r50: nosing_abrasive -> #3a3634).
- Row 50 runs to 2229 (spans, held tray, sparkle, end 2230); last-frame staging untouched (surgeon big + calm in front, vet + grandkid nearest climber, 9 climbers, nurse + tray).
## Numbers: final/numbers.txt (per second). Motion gate 0/0/0/0 (board/motion_gate.txt).
## Weak / open
1. r50 red px (landing edge upper left, x 0-100 y ~700): nosing recolor cut it from ~80 to ~36 px (half-scale test 9); the strip is another mesh (landing slab edge), not found yet.
2. r43 child knee still the round-3 pull-back (knee ~25-30 % width, shoe, one plaster); the sleeve is still a tapered tube (soft_arm not built).
3. The FREEZE is a post-process hold (no engine freeze key): the ray burst stops with it (reads as a freeze frame).
4. Waivers: pt_r body_in_mesh drape (reclined under the drape), kid feet (on the vet's shoulders).
## Render status (16:25, builder cap reached)
- RUNNING in the background: `python final/render_final.py main` (log final/render_main.log), 4 chunks 1766-1915, 1916-2065, 2066-2204, 1672-1765, each queued behind ~15 jobs in the shared queue.
- STILL TO DO after it ends (from s5/, in this order; nothing else may bake s5 meanwhile): `python final/render_final.py h1 h2` (bakes h1/h2, renders 48 handle frames, re-bakes film.json),
  then `python final/make_final.py`, then flicker.py on final/frames, then the strip_2fps self-review against board/sheet_360.jpg.
- Frame checks (build-out film.json, 3D to 2229): 4 FAIL / 10 WARN / 316 PASS = kid feet x2 (WAIVER) + nr_s left-edge cut 2195-2229 (checked before nr_s moved x 179.18 -> 179.3; frames 2205-2229 are the post freeze, push focus at x .26).
- OR test stills (scale .5): out/t2 (patient face + surgeon above the light-blue leg tent, aura); out/t1/f_02208 (last frame kept as approved).
## ROUND 2 (2026-11-16, S5 build-out r2)
- OR knee: build_film.py orrp now = S1's knee_v3 values + knee_crisp=dict(back='#24488a') (backup build_film_pre_r2.py.bak). Re-rendered 1672-1765 + h1 handle 1766-1777.
- FLICKER cause (1826-27, 1888-91, 1910-11): the AF ceiling lens lamps (role 'lamp' + name 'lens') get an engine halo (film.js:344) that pops the whole frame's brightness whenever the camera sweeps the ceiling in/out. waiting.js NEW key `troffer_flat '#hex'` (lens as plain toon, role plastic); wait place uses '#fff4dc'. Tested: 1886-1892 score 5.0 -> 0.24. Backup sets/waiting_before_s5r2.js.bak.
- 2017 + 2063: office `dim` switched on at 2017 and off at 2062 (pop at the 2063 dissolve start). waiting.js dim key `ramp` (fade-in frames); dim now f0 2011 ramp 9, f1 2090 (runs through the h1 handle). blizzard key `fade` 7: papers shrink away over the last 7 f before 2016 (no one-frame vanish). 2010 is the fast station-2018 camera move (pop 5, shim 20): borderline, not touched.
- Row 50 red: the maroon strip = steel tread_nosing/nosing_lip lit by the dusk; recolor key now also lists those (#b89a74): red px 158 -> 128; the rest (hue 347, x 612-631 y 753-772) is a pink hair bobble on a card (cast art), not a set mesh.
- Re-rendered: raw 1672-1765, 1766-1925, 2000-2062, 2185-2204; handles 1766-1777, 2063-2074, 1926-1937.
- R2 RESULT (17:5x): make_final + flicker.py done: FAIL frames 17 -> 7 [1977-79 planned stamp, 2194/2193/2196 impact + kick (planned "missed"), 2010 fast station-2018 move, score 1.07]; the 12-f dissolves pass; 1826-27/1888-91/1910-11/2017/2063 gone. Frame checks 2 FAIL (kid feet x2, WAIVER) / 10 WARN / 318 PASS. Motion gate unchanged 0 (no move edits). red px max 128 (pink hair bobble on a card, not a set mesh). strip_2fps.jpg not eyeballed.
## v2 FIX (2026-11-16, FIX_BRIEF_v2, S5 builder) — backups: build_film_pre_v2.py.bak, moves/ep_s5_pre_v2.mjs.bak, sets/waiting_before_s5v2.js.bak
- CAMERA re-planned: 15 stations -> 10 (orrp 2, wait 2, off 3, ore 2, st 2 unchanged). One flowing take per place; each take opens already moving out of its dissolve; eased travels 2.0-2.4 s that follow the action.
  Before (plan, frames 1672-2229): 9 rests / 18.6 s, peak 94.9 px/f (orrp push), travels 0.3-0.6 s. After: 6 rests = 3.2 per 10 s [1672 .5, 1729 2.1, 1833 3.4, 1964 1.2, 2029 2.5, 2141 3.0 s],
  measured travels 1.0-1.4 s (ease tails under 2 px/f), peak 22.5 px/f (2018, down onto the letter), 0 frames over 40 px/f, 0 teleports. film_plan.py check (whole 0-2229 json) camera:
  speed median/p90 FAIL + rests WARN are artifacts of the empty 0-1671 range (same before: 1.41/2.7); speed peak PASS (was FAIL 94.9); orbit gate PASS (wide moved, boy 46 -> 30 deg).
- No black veil: orrp `fade` removed (S4 joins with a bright dissolve). Gold aura / field / sparkle removed (rule 5).
- Patient = KNOCKED-OUT meme: moves/memes3.mjs (served first from puppet_pkg 'moves'; kit hub + koSleep/koMelt/koBliss). koSleep 1672 (spiral + X eyes, tongue, birdies, zZ bubble, no head bump), koMelt 1745 "knee", koBliss 1750 (happy shut eyes, smile, blush, hearts, happy zZ).
- waiting.js NEW keys: `thought` {f0,f1,at,h} drawn thought bubble (line knee + cream plaster, green tick, smiling sun; pops with overshoot on "fixed" 1717); `stickers` [{kind scuff|plaster, at, f0, f1, w, rot, pop, lift}] drawn marks on a card leg.
- ROW 43: 3D knee leg, 3D fist + sleeve and shoes REMOVED. The nurse's card (own round fist, move nr_kneel: deeper kneel, lower slap) kneels beside the boy's card; the boy (boy_sit) raises his near leg from 1816 to show the knee; scuff sticker 1766+, plaster sticker pops 1844.
- NO SLIDING: boy_r run-off removed (he freezes on "stops", grins on "hurting" 1906, tear + sob bubble pop); sgoff_e linear walk to the door removed (he shrugs and pushes in place, the camera follows).
- v2 STATUS at the 100-min cap: build_film.py + film.json/h1/h2 written and baked; NOT rendered (final/raw + frames are still v1). Test stills (scale .5) out/v2t + earlier sheets.
  GOOD on stills: ko patient + zZ (1700), thought bubble whole + readable (1722/1756), bliss face (1756), patient head whole, row 42 wide, row 44 freeze face + sob bubble.
  STILL WRONG, ROW 43 (fix before rendering 1766-1937): nurse now behind the boy (NK [238.98,.32,0], dir -1) but (a) the boy's raised leg (boy_sit s>0 knee-up from 1816) is hidden behind his shirt,
  (b) the nurse's fist lands behind the boy's card (not seen), (c) KNEE_AT [238.6,-.2,.47] puts both stickers on his shirt, (d) camera 1838 frames the boy on the left edge.
  Suggested: raise the leg sideways out of the body silhouette (knee x hw+40, y ~hipY-.3legL) or use a side-view boy; place KNEE_AT on that knee from a still; put the nurse at the boy's side
  (not behind) at a depth just behind him so her fist shows; re-aim 1838 at x ~238.8. Then the ONE command (render_final main, h1 h2, make_final, flicker, frame checks, check_film).
## v2 ROUND 2 (2026-11-16, S5 v2 r2) — backups: moves/ep_s5_pre_v2r2.mjs.bak, build_film_pre_v2r2.py.bak, sets/waiting_before_s5v2r2.js.bak
- ROW 43 re-staged SIDE-ON: boy_sit = SIDE view facing right (hips ON the chair seat .45 m, drop -.34 legL, feet dangle); from 1816 the NEAR leg (drawn over the body) bends KNEE UP forward of the shirt (BOY_KNEE rig [130,650]);
  far fist at his eye, near fist grips the seat behind (nothing crosses the knee). nr_kneel = SIDE view, act dir -1 (faces left), one knee down; her near round fist goes HIGH 1826-1840, slaps 1841-1844 onto
  the knee via film.json hand_at (nr_k 1826-1925 at KNEE_W [238.845,.32,.68]), pat ring 1844, lifts off 1847-1857. Boy [238.6,.32] (seat front edge), nurse NK [239.38,.02] (in front of the row, nearer the lens: her fist draws over his knee).
- waiting.js NEW sticker key: `card: '<who>', px: [x,y]` = pinned on that card's own plane at canvas px (KNEE_PX = BOY_KNEE + [400,430]), lift .012 m to the lens, hidden with the card. Scuff from 1826, plaster pops 1844.
- Camera 1838 -> [239.0,-2.05,.9] aim [239.0,.3,.66] 24 mm: both cards whole, knee above the caption band. Tear/bubble drops raised to the new head (z 1.03/.95).
- Proof stills (half size): out/v2r2/f_01838, f_01850, f_01900 (+ sheet.jpg); final frames sheet out/v2r2/final_sheet.jpg.
- RENDERED: full main 1672-2204 + all handles (v2), then wait 1766-1925 + h2 1926-1937 again (seat fix); make_final done (558 frames, preview.mp4). Motion gate 0/0/0/0 (boy_sit, nr_kneel side, no over-reach).
- flicker.py: FAIL 8 [1977-79 planned stamp, 2193/94/96 planned "missed", 2003-04 office blizzard/camera (not touched this round)].
- frame checks: 4 FAIL / 3 WARN / 250 PASS = kid feet x2 (WAIVER) + boy body_in_mesh 21-23 % (his legs below the seat lip pass into chair_shell_orange: a seated card on the shell; y .285 still 19 %; reads as sitting, not waived by CB yet). Seat-hover FAIL fixed.
- film_plan.py check (whole 0-2229 json): rests 1.35 WARN, speed median 1.02 / p90 2.2 FAIL, dead still 31 % FAIL (artifacts of the empty 0-1671 range, as before); speed peak 22.5 PASS, cuts 0.54 PASS, longest travel 6.37 PASS.
- check_film.py final/preview.mp4: rests per 10 s 4.31 WARN (target 2.2-3.8), travel p90 1.23 s FAIL (>= 2.1), speed median 1.68 WARN, cuts 2.15 FAIL (= the 4 planned place-join dissolves in 18.6 s).
- STILL WEAK: (1) camera gates on the picture: travels too short / too many rests — each take is short (orrp 3.1 s, off 4.6 s, ore 3.1 s), so travels need merging across stations (one travel per take, 3+ s) = a full re-render; (2) the boy's lower legs hidden by the orange seat lip (only the raised knee shows; small at full frame); (3) 2003-04 flicker.
## v2 ROUND 3 (2026-11-16, S5 v2 r3) — backups: build_film_pre_v2r3.py.bak, moves/ep_s5_pre_v2r3.mjs.bak, sets/waiting_before_s5v2r3.js.bak
- CAMERA: film.json now `camera: {v2: true}` (picture-speed eases: the move runs at an even picture speed with 8-20 f ramps, so the detector reads nearly the whole travel). ONE travel per take:
  orrp 1675->1765 (3.0 s arc knee -> ko face + bubble) | wait 1767->1856 (2.97 s wide -> ROW 43) | off rest+rising drift 1926-1977 (stamp, SLAM), then 1977->2060 (2.77 s down through the papers onto the letter) | ore 2066->2153 (2.9 s nurse tray -> surgeon) | st 2157->2195 (1.27 s glide INTO the approved last frame; 2195-2229 camera + freeze push unchanged, frame 2204 pos identical).
  Plan (my span check on the baked plan, 1672-2204): travels 71/73/73/32/8 f, rests 105/135/18/14 f, travel p90 2.43 s, peak 9.2 px/f. film_plan.py check camera lines: board/plan_check_v2r3.txt (speed median/p90 + rest-length FAIL = the empty 0-1671 range, as before; peak 9.2 PASS, cuts .54 PASS, orbit gate PASS after keeping the orrp arc at the old 45 deg-safe span).
- ROW 43 re-staged: camera from the boy's front-left, level-low (1856: [238.17,-1.85,1.05] -> [238.95,.12,.83] 28 mm, down-angle to his chest ~9 deg); boy card on the seat FRONT y .32 -> .12 (in front of the orange shell: legs + raised knee clear, no shell overlap); nurse NK [239.3,-.1] (right of the knee, not between lens and knee);
  KNEE_W y .12; nr_kneel fist lifts clear after the slap (rest = tgt + [50,-190]) so the plaster reads 1857-1925. Ceiling ~20 % of frame. Stills: out/v2r3e (1820/1858/1900, sheet.jpg).
- waiting.js NEW blizzard keys: ramp_in (papers grow in over n f; used 5), near (m: a paper nearer the lens shrinks away smoothly; used .9); fade 7 -> 6.
- RENDERED (full main 1672-2204 + all 4 handles, raw deleted first; render_final resumes by existing file, so old frames MUST be removed before a camera change). make_final done (preview.mp4).
- check_film.py final/preview.mp4 (final/check_film_v2r3.txt): travel p90 2.5 s PASS (was 1.23), rests 3.77/10 s PASS (was 4.31), speed median 3.05 PASS, p90 13.2 PASS, whips 0 PASS, dead still 2.6 % PASS; cuts 2.15 FAIL = the 4 planned place dissolves; rest length median 0.5 WARN.
- frame checks: 1 FAIL (kid feet, WAIVER) / 2 WARN (pt_r drape 4 %, sg_o stamp covers face 2 f) / 152 PASS. Boy seat + body_in_mesh now PASS (shell overlap gone).
- flicker.py: FAIL 9 [1977-79 planned stamp, 2193/94/96 planned "missed", 2003-04 GONE; NEW 2007-08 (score 6.8, pop 6.8) in the office travel through the papers, 2165 (1.37, inside the r49->50 dissolve)]. 2007-08 not looked at yet (cap reached): likely a paper crossing the near band — try blizzard near 1.2 or ramp.
- NOT eyeballed: strip_2fps.jpg / the rendered ROW 43 frames (stills out/v2r3e match the plan).
## v3 FIX (2026-11-17, FIX_BRIEF_v3 + ISSUES_v2, S5 builder) - backups: build_film_pre_v3.py.bak, moves/memes3_pre_v3.mjs.bak, sets/waiting_before_s5v3.js.bak, final/make_final_pre_v3.py.bak
- ONE command now = `bash run_v3.sh` (build + handles + bake, DELETES final/raw, handles, frames, renders, make_final, flicker, check_film, frame checks; logs final/*_v3.*).
- A7: `env_v3: True` on every S5 place (place() sets it; waiting wrap passes it to or_room / office / stairwell).
- A3: memes3 koSleep/koMelt/koBliss carry NO zZ any more (spiral/X eyes, tongue, hearts kept); waiting.js NEW key `zzz: {head, f0, f1, ...}` = sets/zzz_fx.js addZzz (head passed through ctx.B2T); orrp zzz head [-.95,.6,1.8] f1640-1766 side -1 (drifts left, away from the bubble).
  LESSON: a PowerShell Replace left a `//` comment before the closing `,` in memes3 -> module failed -> EVERY card drew grey without costume. Edit .mjs with Python, never PS 5.1 Set-Content (also adds a BOM + mangles non-ASCII).
- C8: thought bubble TH_AT [-.8,.8,1.47] (was z 1.72), h .8 (was .55); orrp cameras shifted .12-.15 m left + end lens 24 mm (patient head whole, bubble whole).
- C1 SIGNATURE: nurse NK [239.35,.45] BEHIND the boy (was in front of him); camera 1856 from the KNEE side front-right low [239.6,-1.15,.8] -> [238.92,.2,.8] 25 mm: knee + plaster centre frame, nothing between knee and lens; stickers bigger (scuff .13, plaster .16); hand_at fist target +.05 m on top of the knee.
- D3: office blizzard h 1.6 / spread 1.1 / ceil 2.3 (papers stay near the desk, no snow dots on the window); the window is not in the 1:07.5 frame any more.
- B10: sg_o visible to 2062 (no vanish mid-move), the letter travel 1.8 s (starts ~2006: surgeon whole at 1:07), letter close from [119.95,.62,1.3] (him out of frame).
- B11: nurse nr_e [.75,.6] (left of the surgeon, was [1.0,.7] in front of him); ore cameras aim x 1.1 / end [.75,-.9,1.5] -> [1.45,2.5,1.4].
- D4: the ore end station no longer runs to [.2,-.3] past the orange OR lamp at the lens.
- D6/B12: vet [180.72,-2.0] + kid [180.7,-2.05,1.68] nearer the lens beside the surgeon, own fill light [180.6,-2.9,2.1]; nurse nr_s x 179.55 (off the left edge).
- D2: make_final dissolves 8 frames (was 12; handles still render 12).
- Test stills (half): out/v3a (grey cards = the memes3 bug), out/v3b, out/v3c (+ sheet.jpg each).
- film_plan.py check: board/plan_check_v3.txt (camera FAILs = the empty 0-1671 range as before; peak 16.4 PASS, cuts .54 PASS). Motion gate 0.
- RENDER (100-min cap): main 1672-2204 DONE in final/raw (533) + h1 handles done; `bash run_v3.sh` STILL RUNNING in the background at hand-back (h2 handles, then make_final -> final/frames + preview + strip_2fps, flicker -> final/flicker_v3.txt, check_film -> final/check_film_v3.txt, frame checks -> board/checks_v3.txt; final/run_v3.out ends with V3_DONE). Do not start a second copy.
- Self-look on full-size raw frames (out/v3chk, out/v3chk2 sheets): C1 knee + plaster centre frame, nothing in front, nurse's arm on the knee 1844; C8 bubble whole + lower; Zs float above the cap; B10 surgeon whole 2010/2025 (a blizzard paper crosses his face at 2010); D3 no window in 1:07.5; B11 nurse beside the surgeon 2090-2110; D6 vet + grandkid big at right in 2204, B12 nurse off the edge (mostly hidden behind the surgeon).
- STILL WEAK: 2140-2155 the nurse's cap touches the LEFT edge (ore end station; aim x 1.45 -> ~1.3 would fix); a static orange ball at the left edge 2090-2110 (not sweeping any more); 2045 the surgeon's green shoulder at the top-left of the letter close; strip_2fps + gate numbers not read yet; DRESS-WHAT-YOUR-CAMERA-SEES done only through env_v3 (no extra per-shot props).
- v3 CHAIN FINISHED after hand-back (V3_DONE; final/frames 558, preview.mp4, strip_2fps.jpg).
  check_film: 12/13 PASS; FAIL cuts 2.15 per 10 s = the 4 planned dissolves (as v2).
  flicker: 9 FAIL = 1977-79 stamp + 2193/94/96 "missed" (planned), 2165 (in the r49->50 dissolve), NEW 2022-23 (blizzard paper near the lens during the faster 1.8 s letter travel).
  frame checks 7 FAIL / 5 WARN / 152 PASS:
  - nr_k HEAD CUT by the right edge 1856-1925 (72 %): this breaks C1's "heads whole". Fix: camera 1856 aim x 238.92 -> ~239.05 or 23 mm, or NK x 239.35 -> 239.2, then re-render 1766-1925 + the h2 handle.
  - nr_k inside the teal chair shell (6-7 %); nr_e inside table_frame 17 % (2006-2194, the B11 move to x .75; try y .45).
  - boy head cut left 3 frames at 1925 (WARN); sg_o face behind a blizzard paper 1980-2005; kid feet = WAIVER.
## v3 ROUND 2 (2026-11-17, S5 v3 r2) - backup build_film_pre_v3r2.py.bak; logs final/*_v3r2.*, board/checks_v3r2.txt
- Changes: NK x 239.35 -> 239.22; cam 1856 aim x 238.92 -> 239.04; nr_e y .6 -> .3; ore end aim x 1.45 -> 1.3; blizzard at x 119.95 -> 120.4, spread 1.1 -> .9. Re-rendered main 1766-1925, 1978-2016, 2063-2155 + handles 1766-77, 2063-74, 1926-37; make_final, flicker, check_film (12/13, only planned cuts FAIL), frame checks done.
- RESULT: nr_k head now whole (head_cut / body_side FAIL gone) BUT the boy is now cut by the LEFT edge 1856-1925 (head 80 %, body 71 %): aim 239.04 is too far right; try aim ~238.97 + NK x 239.2 (or 24 mm).
- STILL FAIL: nr_k in teal chair shell 8 % (1675-1925; NK y .45 -> try .55-.6 or x further from 239.2), nr_e in table_frame 17 % (y change did nothing: the table is in x; try x .75 -> .45 or 1.0 with y .6), sg_o face behind paper 1980-2005 (3 rays, 15/26 f; papers still cross: shorten blizzard n or delay the near ramp). flicker 10 FAIL (same planned + 2022-23 + 2070). kid feet = WAIVER.
## v3 ROUND 3 (2026-11-17) - backup build_film_pre_v3r3.py.bak; logs final/*_v3r3.*, board/checks_v3r3.txt, out/v3r3_sheet.jpg
- Changes: NK [239.2,.6]; cam 1856 aim x 238.97 + 23 mm; nr_e x .75 -> .45; blizzard at x 120.75, n 12, spread .8, near 1.3. Re-rendered raw 1766-1925, 1978-2016, 2063-2155 + handles 1926-37, 2156-67; make_final, flicker, check_film (12/13, only planned cuts FAIL), frame checks.
- RESULT: row 43 looks right (boy + nurse whole, knee + plaster nearest lens). Frame checks 6 FAIL / 4 WARN / 154 PASS: boy head_cut left only 6 f (1920-25, 97%; was all 70 f).
  WORSE: nr_k in teal shell 11-15 % (y .6 went deeper into the teal chair: go back to y .45 or move x, NOT y up); nr_e in table_frame 52 % at x .45 (and her cap/body at the LEFT edge in 2100): try x 1.0 (y .3).
  sg_o face behind paper 2 rays 7/26 f (was 15/26). Flicker 10 FAIL: planned 1977-79, 2193/94/96 + 2165 dissolve + 2022-23 + 2070 NOT fixed. kid feet = WAIVER.
## v4 FIX (2026-11-17, FIX_BRIEF_v4, S5 builder) - backups build_film_pre_v4.py.bak, sets/waiting_before_s5v4.js.bak; logs final/*_v4.*, board/checks_v4_plan.txt (plan), board/checks_v4.txt (final)
- waiting.js NEW keys: gang_drop {a:[k]} (front gang a without seat k, split into separate frames, no beam through the gap), gang_y {a: y}, blizzard.clear {at, r} (papers near the lens-to-face line shrink away).
- wait: gang_drop a [1] (the teal seat the nurse knelt in is gone, she kneels on open floor), gang_y a .58 (orange shell lip behind the boy's card: he sits ON it, seat check PASS); cam 1856 23 -> 22 mm, aim x 238.97 -> 238.95 (boy head 100 % to 1925). Row 43 staging kept.
- off: stamp path rises at his side first (1950 -> 1955 [120.3,1.05,1.6] -> 1960), so the mount never crosses his face; blizzard clear at his face [119.9,1.42,1.35] r .4.
- ore: round 1 nr_e [1.08,.08] passed the check but HID the surgeon 2104-2155 (eye check); round 2 [.75,-.35] too near the lens. FINAL: nr_e [.88,.22] + ore hide_pre ['table_frame','drape_hang_foot','stockinette_foot'] (prop first: the steel under-frame + foot drape of the empty evening table hidden); surgeon whole beside her (out/v4/ore_sheet3.jpg).
- Plan checks before: 6 FAIL / 4 WARN; after: 1 FAIL (kid feet, allowed) / 1 WARN (pt_r 4 % drape, allowed) / 162 PASS.
- Re-rendered raw 1766-1925, 1950-1960, 1978-2016, 2063-2155 (twice) + h2 handles 1926-1937, 2156-2167 (final/run_v4.sh; logs *_v4 then *_v4b). Flicker v4 = same 10 FAIL as v3r3 (planned 1977-79/2193-96 + 2022-23, 2070, 2165, not in this brief).
## v4b STRICT CHECK FIX (2026-11-17, S5 v4b builder) - backup build_film_pre_v4b.py.bak; logs final/*_v4b2.*, board/checks_strict_v4b.txt (plan), board/checks_strict_v4b2.txt + checks_v4b2.txt (final); stills out/v4b, out/v4b2
- Camera only (no prop/people moves): off letter close 2060 [119.95,.62,1.3]->[119.95,.93,.77] 28 mm => [119.95,.2,1.45]->[119.93,1.1,1.05] 22 mm (surgeon whole above the stamped letter the whole travel); ore end 2153 aim x 1.55 -> 1.62, 24 -> 21 mm (sgoff_e + nurse whole); st start 2156 [179.7,-4.95,1.42] -> [179.8,-4.45,1.42] (inside the room, off wall_front_block_4th). 2195+ (approved last frame) and row 43 untouched.
- Strict check 1672-2229 before 18 FAIL; after (plan) 2 FAIL = kid feet (waiver) + boy seat 25.8 % at 1820 (row 43, was already there, not a cut/cover line).
- Re-rendered raw 2000-2194 + handles h1 2063-2074, h2 2156-2167 (final/run_v4b2.sh).
- v4b RESULT (final): strict check 2 FAIL (kid feet waiver, boy seat 1820 row 43) / 104 PASS, 0 head_cut / body_side / face_covered; rest check 1 FAIL kid feet / 1 WARN pt_r drape / 162 PASS. make_final 558 frames + preview.
  flicker 9 FAIL: planned 1977-79, 2193/94/96 + 2070; 2022-23 and 2165 GONE; NEW 2032-33 (whole office frame darkens one step during the new letter travel, score 5.5; cause not found yet, not a cut line).
