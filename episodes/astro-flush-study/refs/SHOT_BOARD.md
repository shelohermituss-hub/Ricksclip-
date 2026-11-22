# SHOT_BOARD: astro-flush-study (PRIVATE, never published)

Source: `references/look_match/astro_flush/ref/all/f_%04d.jpg` (frame N = file N+1), 30 fps, frames 0-1199.
Made by looking at contact sheets (in `references/look_match/astro_flush/work/`: `ov*.jpg` overview, `t*.jpg` every
transition frame by frame, `a*.jpg` acting) and by measuring (`work/measure.py` -> `work/motion.json`, `work/stats.py`,
`work/win.py`). No reference frame is stored outside `references/look_match/`.

How exact each number is:
- Shot joints (cut, dissolve start/end, hull crossing): looked at every single frame. Exact.
- Screen events flagged by the frame-difference spike (f75, 192, 203, 224, 264, 507-508, 772): exact.
- Acting pose/expression frames: read from sheets with a step of 2 to 4 frames (step 6 in shot 7 and 8), so +/-2
  frames (+/-3 in shots 7, 8). Marked "~".
- Subject size in % of frame height: read off the sheets, +/-3 points.
- Camera numbers per 0.5 s: sparse optical flow + RANSAC similarity fit on the whole picture (characters and captions
  are not masked, so small values under acting are +/-0.5 px). `z` = picture scale over the 15 frames (z<1 pull back,
  z>1 push in); `x`,`y` = picture shift in % of frame width/height (x+ = content moves right = camera pans/tracks left;
  y- = content moves up = camera goes down); `r` = picture roll in degrees over the 15 frames.

## 1. Shot list, corrected (13 shots; the lead's joints fixed)

| # | frames (clean picture) | sec | place | join to the NEXT shot |
|---|---|---|---|---|
| 1 | 0-34 | 0.00-1.13 | toilet room, day | MATCH MOVE out through the porthole, f30-36 (no whip pan, no cut) |
| 2 | 36-119 | 1.20-3.97 | space, ship over Earth | MATCH MOVE: picture becomes a panel on the wall screen, from f120 |
| 3 | 120-283 | 4.00-9.43 | mission control | MATCH MOVE: pull back out of a monitor on the ship wall, from f284 |
| 4 | 284-410 | 9.47-13.67 | ship cabin, day | DISSOLVE 12 frames, f411-422 |
| 5 | 423-494 | 14.10-16.47 | sleep bay, night | DISSOLVE 5 frames, f495-499 |
| 6 | 500-530 | 16.67-17.67 | toilet room, night, close | DISSOLVE 7 frames, f531-537 |
| 7 | 538-705 | 17.93-23.50 | cockpit from outside | DISSOLVE 7 frames, f706-712 |
| 8 | 713-762 | 23.77-25.40 | star map on the glass | DISSOLVE 8 frames, f763-770 |
| 9 | 771-802 | 25.70-26.73 | radio console | HARD CUT 802/803 |
| 10 | 803-866 | 26.77-28.87 | mission control | HARD CUT 866/867 |
| 11 | 867-997 | 28.90-33.23 | hull, then whole ship | DISSOLVE 9 frames, f998-1006 |
| 12 | 1007-1113 | 33.57-37.10 | toilet room, wide | MATCH MOVE: fast pan left along the hose and dive through the WASTE LINE hatch, f1114-1141 |
| 13 | 1142-1199 | 38.07-39.97 | under the floor, then inside the tube | (clip ends inside the tube) |

Totals in 40 s: 2 hard cuts, 6 dissolves (5-12 frames), 4 match moves. The lead's list was wrong on: shot 1 exit (a
pull-back through the porthole, not a whip), shot 4/5, 5/6, 6/7, 7/8, 8/9, 11/12 (all dissolves, not cuts), 12/13 (one
continuous camera move, not a cut), and shot 12 starts at 33.6 s, shot 13 at 38.1 s.

### The joints, frame by frame
| joint | what is seen |
|---|---|
| 1->2 | f29 pull-back starts (scale per frame 0.94, 0.88, 0.82, 0.76, 0.72 at f31-35: it accelerates). f32-34 room gets small, side walls enter. f35 the round-cornered porthole frame with bolts is around the room, dark hull fills the rest. f36 hull outside, porthole 25% of H with the tiny new guy and toilet still inside, Earth below. f37-41 keeps pulling back and sliding (content moves right), ship name on the hull at f40. The new guy stays visible in the porthole until about f41. |
| 2->3 | f119 full-frame space with the flame. f120 a thin light-blue border appears at the frame edges. f122 border is clearly a panel frame, map graphics outside it. f126 clock digits enter at the top. f128-134 panel shrinks to about 30% of H, upper left of an orbit map. f134-138 controller heads rise in from the bottom. f142 three controllers and console in frame. The space picture keeps playing inside the panel. |
| 3->4 | f281 pull-back starts. f284 a monitor bezel is at the frame edges, an orange bag enters top right. f286-288 label "LINK - HOUSTON FLIGHT" under the monitor. f289 camera starts down (content moves up, peak 82 px/frame of 1920 = 4.3% of H per frame at f298). f296 the new guy's hair enters at the bottom, f298 his face, f300-304 commander (left) and navigator (right). f312-317 the move eases out, f318 settled. Mission control keeps playing in the monitor for the whole of shot 4. |
| 4->5 | f410 last clean. f411 first ghost of the sleeping bags. f416 about half/half. f422 last trace of the cabin. f423 clean. The incoming shot is already panning during the dissolve. |
| 5->6 | f494 last clean. f495 big ghost head of the close shot. f497 half. f499 last trace of the bay. f500 clean. |
| 6->7 | f530 last clean. f531 faint cockpit roof. f534 half. f537 last trace of the new guy. f538 clean. The incoming camera is already craning down. |
| 7->8 | f705 last clean. f706 faint map frame. f709 half. f712 last trace of the cockpit. f713 clean. |
| 8->9 | f762 last clean. f763 faint console. f766 half. f770 last trace of the map. f771 clean. |
| 9->10, 10->11 | one-frame cuts, both ON the first word of the new sentence ("You're" f807 is 4 frames after the cut; "And" f857 is 10 frames before the cut, "every" f868 right after). |
| 11->12 | f997 last clean. f998 faint checker floor. f1002 half. f1006 last trace of the ship. f1007 clean. The outgoing camera is at rest (f992-1001), the incoming is already pushing in. |
| 12->13 | f1114 camera starts panning left (content moves right, peak 78 px/frame of 1080 = 7% of W per frame, held f1121-1129). f1120 the new guy leaves the frame right, door centre. f1124-1130 glowing hose on the floor leads left to the wall, the "WASTE LINE" floor label, a window with gold foil behind. f1132-1138 the hatch panel swings open and the camera dives (scale x2 per 0.5 s). f1140-1142 under the floor. No cut, strong motion blur. |

## 2. Camera, a row every 0.5 s

Lens feel: W = wide (strong perspective), N = normal, T = tele (flat). "size" = main subject in % of frame height.

### Shot 1 (f0-34) toilet room, day
| f | fills the frame | size | lens, height, tilt, roll | measured |
|---|---|---|---|---|
| 0 | new guy left of centre (x 25%), toilet centre-right, big window with Earth on top third, checker floor bottom 30% | new guy 46%, head 12% | N, chest height, level, no roll | z1.06 (slow push in) |
| 15 | same, a little closer | 47% | same | z1.02 |
| 30 | pull back through the porthole (see joint) | 46% -> 6% at f36 | W by f34 | z0.27 over f30-44 |
Never rests (97% of frames moving).

### Shot 2 (f36-119) space
| f | fills the frame | size | lens, height, tilt, roll | measured |
|---|---|---|---|---|
| 36 | hull + porthole, Earth below | porthole 25% | N, level with the hull | z0.27 (f30-44), x+17 |
| 45 | whole ship lying across the upper third over a big Earth (Earth = bottom 60%) | ship 75% of W at f46, 30% of W at f58 | T, ship at eye level, level | z1.01, x+32 y-4 |
| 60 | REST f60-74 (15 frames; only the caption changes) | ship 30% of W, 6% of H | T | z0.99, 0 |
| 75 | f75 the ship kicks off: it yaws, nose away to upper left, tail to us | shrinking | camera follows, starts to roll | x+13 y+11 r-1.4 |
| 90 | ship small centre, Earth slides out lower left | ship 8% of H | tilt up, roll | z1.29 x+25 y+10 r-3.6 |
| 105 | ship tiny upper centre with a big flame, Earth only a corner | ship 3%, flame 25% of W | roll | z1.16 x+30 y+10 r-5.1 |
One rest of 15 frames, then never again.

### Shot 3 (f120-283) mission control
| f | fills the frame | size | lens, height, tilt, roll | measured |
|---|---|---|---|---|
| 120 | space picture shrinks into a wall panel | panel 100% -> 30% | N | z0.29 x-9 y-11 r-2.5 |
| 135 | orbit map wall (yellow sine track, world map), clocks on top, controllers rise from the bottom | controllers heads 8% | W, camera drops to head height, looks slightly up | z0.52 x-47 y-18 r+4.3 |
| 150 | 3 controllers left behind the console, director walks in from the right | director 25% | W, head height, roll settles | z0.96 x-16 r+7.5 |
| 165 | same, director arrives right of centre | director 28% | N | z0.96 x-4 r+2.1 |
| 180 | settled framing: screen top half, director centre-right, controllers left, button desk right | director 33% | N, chest height, level | z0.99 |
| 195 | slow push in (near rest f193-199, the only one) | 34% | same | z1.02 |
| 210 | slow push in | 35% | same | z1.03 |
| 225 | slow push in | 36% | same | z1.02 |
| 240 | slow push in | 37% | same | z1.03 |
| 255 | slow push in (button press) | 38% | same | z1.04 |
| 270 | push stops f270-280, pull back starts f281 | 37% | same | z0.96 |

### Shot 4 (f284-410) ship cabin, day
| f | fills the frame | size | lens, height, tilt, roll | measured |
|---|---|---|---|---|
| 285 | monitor on a grey padded wall, pulling back and going down | monitor 95% -> 60% | N | z0.69 y-30 |
| 300 | heads of the three rise from the bottom; monitor ends top centre | monitor 60% -> 30% | N, lands at head height, level | z0.52 y-26 |
| 315 | settled: monitor top centre, HEAD sign right, commander left, new guy centre, navigator right, floor bottom 35% with their soft shadows on the wall | figures 25%, heads 10% | N, chest height, level, no roll | z0.99 |
| 330 | slow push in | 26% | same | z1.07 |
| 345 | slow push in | 27% | same | z1.04 |
| 360 | REST f360-373 (14 frames; "toilet.") | 27% | same | z1.00 |
| 375 | creep in | 27% | same | z1.01 |
| 390 | creep in | 28% | same | z1.02 |
| 405 | creep in, dissolve from f411 | 28% | same | z1.01 |

### Shot 5 (f411-499) sleep bay, night
| f | fills the frame | size | lens, height, tilt, roll | measured |
|---|---|---|---|---|
| 420 | three sleeping bags upright on the wall (navigator teal left, commander blue centre, new guy green right), dark blue room, window slits on top | bags 20% | N, level | x-39 (pan right) r+1.5 |
| 435 | pan right and push in to commander + new guy | bags 35% | N | z1.47 x-28 r+2.8 |
| 450 | near rest on the two ("asleep."), slow drift | new guy 35% | N, eye level | z1.00 x-5 |
| 465 | new guy rises out of the bag; camera pans right with him and pulls back | 33% | N | z0.84 x-25 y-7 |
| 480 | new guy floats to the door on the right edge; lit checker floor of the toilet room seen through the door | 28% | N | z0.89 x-22 y-6 |
Never rests (98%).

### Shot 6 (f500-531) toilet room, night, close
| f | fills the frame | size | lens, height, tilt, roll | measured |
|---|---|---|---|---|
| 500 | new guy left-centre from the hips up, glowing toilet lower right, dark window with stars on top | figure 60% (cut at the knees), head 22% | N, chest height, slightly from below, no roll | z1.06 |
| 515 | same, slow push in | head 23% | same | z1.02 |
| 525 | dissolve; next camera already moving | | | y-10 |
Always moving (100%), but slowly (0.25 px/frame at 540 px width).

### Shot 7 (f532-712) cockpit from outside
| f | fills the frame | size | lens, height, tilt, roll | measured |
|---|---|---|---|---|
| 540 | camera comes down over the cockpit roof (antenna ball, blue dish), navigator at the bottom edge behind the glass | navigator 20% | N, above her, tilting down | z1.18 y-37 r+0.8 |
| 555 | navigator centre behind the glass, seats in front, two orange-lit struts above her | 30% | N, her eye level, frontal | z1.04 y-5 |
| 570 | slow push in | 33% | same | z1.06 |
| 585 | slow push in; first sparkles | 35% | same | z1.06 r-0.5 |
| 600 | pull back starts, with roll | 33% | N | z0.81 r+1.8 |
| 615 | pulling back and rising to her upper left; glass canopy frame enters | 22% | W | z0.66 r+1.9 |
| 630 | whole canopy, seen from above and the side, tilted about 25 degrees | 14% | W, high 3/4 view | z0.76 r+2.4 |
| 645 | same, slower; glitter cloud across the glass | 11% | W | z0.89 r+3.3 |
| 660 | easing out | 10% | W | z0.95 r+2.4 |
| 675 | easing out | 9% | W | z0.95 r+1.7 |
| 690 | almost still (never fully) | 9% | W | z0.97 r+0.5 |
Total pull back about z0.27, total roll about +14 degrees, eased over 3 s. Never rests (97%).

### Shot 8 (f713-770) star map
| f | fills the frame | size | lens, height, tilt, roll | measured |
|---|---|---|---|---|
| 720 | paper map taped on the glass (two tape strips), centred a little above the middle, stars behind, a window post at the left edge | map 24% of H, 40% of W | T, frontal, slight roll | z1.03 |
| 735 | same, creep in | 25% | same | z1.01 |
| 750 | drift: picture slides right and rolls | 22% | same | x+12 r-5.5 |

### Shot 9 (f771-802) radio
| f | fills the frame | size | lens, height, tilt, roll | measured |
|---|---|---|---|---|
| 771 | radio box lower left (amber digits 121.50, red lamp, VOL and FREQ knobs), overhead panel with the lamp sign top | radio 30% of H, sign 6% | W, from above 3/4, rolled about 15 degrees | z1.05 |
| 780 | steady push in | | same | z1.05 r-0.4 |
| 795 | steady push in | | same | z1.02 |
Never rests; slow steady push (0.33% zoom per frame).

### Shot 10 (f803-866) mission control
| f | fills the frame | size | lens, height, tilt, roll | measured |
|---|---|---|---|---|
| 803 | director centre, OFF COURSE screen behind his head, controllers small on the left, button desk right | director 45% (cut at the knees), head 12% | N, chest height, slightly from below | z1.05 (f810) |
| 825 | push in | 55%, head 15% | same | z1.07 |
| 840 | he lunges to the lens + fist up; picture bumps 3% down (f840-845) | 70%, head 21% | W feel (he is near the lens) | y+3 |
| 855 | hold, slow creep | 75%, head 22% | same | z1.01 |
Always moving (100%).

### Shot 11 (f867-1006) hull to whole ship
| f | fills the frame | size | lens, height, tilt, roll | measured |
|---|---|---|---|---|
| 867 | porthole frontal, dark hull panels, orange stripe at the bottom | porthole 30%, head 13% | T, level | near rest f867-875 |
| 870 | pull back starts f876 | porthole 28% | T | z0.93 r+3.9 |
| 885 | pull back fast; LODESTAR letters enter on top | porthole 12% | N | z0.60 x+10 r+3.1 |
| 900 | track along the hull: row of lit windows, name above, stripe below | hull 45% | N, from below the ship | z0.84 x+27 y-8 r+2.2 |
| 915 | hull recedes in perspective to the upper left | hull 35% | W | x+26 y-10 r+3.2 |
| 930 | tail with gold collar and blue round solar discs enters | ship 60% of W | W | x+20 y-8 r+3.4 |
| 945 | whole ship on a diagonal, nose lower right; Earth small upper right | ship 45% of H diagonal, Earth 5% | W, in front of and below the nose | x+15 y-6 r+2.6 |
| 960 | easing out; glitter trail behind the tail | same | W | x+8 r+1.8 |
| 975 | easing out | same | W | x+3 r+1.3 |
| 990 | REST f992-1001 (10 frames, under "But how do you") | same | W | 0 |
Total roll about +22 degrees, eased over 3.5 s.

### Shot 12 (f1007-1113) toilet room, wide
| f | fills the frame | size | lens, height, tilt, roll | measured |
|---|---|---|---|---|
| 1005 | dark panelled room, commander in the blue doorway (x 30%), new guy (x 43%), toilet (x 62%), checker floor = bottom 40% with strong perspective | figures 20% | W, low (knee height), looking slightly up | z1.03 |
| 1020 | push in | 21% | same | z1.04 |
| 1035 | push in, faster | 22% | same | z1.06 |
| 1050 | push in, faster, slight pan right | 24% | same | z1.09 x-3 |
| 1065 | push in; commander slides out of frame left by f1074 | 27% | same | z1.12 x-5 |
| 1080 | new guy alone centre-left, toilet right; pull back starts | 27% | same | z0.96 r-0.7 |
| 1095 | pull back to make room for the exploded toilet above | 25% | same | z0.93 |
| 1110 | pan left starts f1114 (joint) | | | x+61 |
Always moving (100%); the push accelerates smoothly for 2.5 s, then reverses without a stop.

### Shot 13 (f1114-1199) hatch, underfloor, tube
| f | fills the frame | size | lens, height, tilt, roll | measured |
|---|---|---|---|---|
| 1125 | fast pan left across the floor, hose on the floor, hatch | | W, low | z2.00 x+65 r+4.4 |
| 1140 | under the floor: gold crinkled foil, grey ribs, a glowing ribbed hose running away from us | hose 8% thick | W, rolled 20-30 degrees | z2.05 x-16 y+14 |
| 1155 | constant-speed flight along the hose to a flange under the yellow WASTE VENT sign | flange 10% -> 30% | W | z1.85 y+15 r+4.6 |
| 1170 | accelerates into the nozzle (f1164-1175, up to 18% zoom per frame) | nozzle 100% at f1176 | W | z2.99 r-9.8 |
| 1185 | inside the tube: dark concentric rings, bright blue-white core at centre | core 10% | W, spinning | z1.36 r-5.2 |

## 3. Characters and acting

Pose changes SNAP in 2-3 frames and are then held 10-40 frames with only a small float. Nobody walks with weight: bodies
hang, legs dangle and swing a little, sleeping bags sway. No big squash and stretch seen; the life comes from the
snap + hold, the eyes, and the moving camera.

| shot | who, where, facing | beat by beat (frame ~, word) |
|---|---|---|
| 1 | new guy, left of centre, faces camera; his right hand on the hip, left arm out to the flush lever on the tank | f0-7 smug: half-closed lids, raised brow, smirk ("If you"). f8-10 snap (2-3 frames) to closed happy-arc eyes and open laughing mouth ("flush" f11). Held to f34, tiny bob. |
| 3 | 3 controllers (green, blue, grey shirts, headsets) behind the console, left; faces to camera | f134-142 rise into frame with the camera move, heads bob out of step with each other. ~f244-268 eyes go big and round, they look at the director. |
| 3 | flight director (white shirt, headset), enters right | f150 enters the right edge, bouncy walk to the left, arrives ~f178 ("tells astronauts" f151-160). f184-190 faces front. f192-220 head turned up and back to the screen, 3/4 from behind, during 3-2-1 ("exactly when they're allowed"). f224 snaps to front with closed smug eyes on GO ("flush." f224). f236-248 both arms out, shrug ("So" f240). f252-256 looks at the button. f256-262 arm goes out to the right (6 frames, eased). f263 finger on the red button; f264 screen flips ("order" f265). f268-283 arm back, flat stare, head a little down ("is no flushing"). |
| 4 | commander (red, navy cap) left, sits/hangs, 3/4 to the right; new guy (yellow) centre, holds a teal magazine; navigator (purple, brown cap-bun, clipboard) right, 3/4 to the left | New guy: f316 reads. ~f320-328 big round eyes up ("rolls" f317). ~f332-344 eyes rolled away/closed, head tilts ("his eyes." f328-334). ~f348 smirk at camera ("It's a" f350). ~f356-372 mouth open, talking, magazine lowered ("toilet." f360). ~f376-384 leans to the commander ("What's it" f380). ~f388-392 big laughing mouth, arms out ("gonna do?" f387-391). ~f396-408 magazine gone, hands on hips, smug, legs dangle. Commander: frown all through, ~f340-352 eyes shut in annoyance, ~f396 turns his head to the new guy. Navigator: side look to the new guy, small head turns only. |
| 5 | navigator, commander, new guy in bags on the wall, faces to camera | f423-450 all asleep: closed eyes, commander mouth open, heads loll slowly. ~f452-456 new guy opens one eye ("asleep." f447). ~f460-472 he slides up out of the green bag (about 12 frames, eased, body straight) ("He floats" f464-467). ~f472-476 side look back at the commander, sweat drop on his forehead. ~f480-494 drifts right to the door, body 3/4 away, arms tucked, tiptoe pose, looks over his shoulder ("to the back" f476-487). |
| 6 | new guy, left-centre, faces camera, toilet at his left hand | f500-506 eyes squeezed shut, wince, arm goes to the lever ("and flushes." f494-503). f507-508 SNAP in 2 frames: round wide eyes, small "o" mouth, the flush goes off. ~f510 recoil, eyes shut. ~f512-530 relaxed smug smile, brows up, one arm up holding the wall rail; sweat drop on the forehead the whole shot. |
| 7 | navigator behind the glass, centre, faces camera, holds a brown cup at the chest | ~f540-560 neutral, hangs in front of the seat. ~f564-576 eyes closed, sips ("looks out" f565-571). ~f582 half-open eyes. ~f588 SNAP: round wide eyes, open mouth ("the window," f581). ~f594 gasp, eyes shut. ~f600-606 wide eyes again, the cup leaves her hand and drifts off to the right, turning ("there are" f598). ~f612 blink, ~f618 wide. From f624 small in frame: arms out, slow turn of the body. |
| 10 | director, centre, faces camera; controllers behind left | f803-805 round shocked eyes. f806 "o" mouth. ~f812 angry brows. ~f815-818 gritted teeth ("drifting" f811). ~f821 wide open mouth ("off" f818). ~f827 teeth, ~f830-833 open ("course." f826). ~f836 teeth. f839-842 lunges to the lens (head 15% -> 21% in about 4 frames). f842-845 fist shoots up on his left in 3 frames ("Who" f842, "flushed?" f845). ~f848-857 shouting mouth, a new mouth shape every 3 frames. ~f860 teeth. f863-866 mouth shut, glare, fist stays up. Controllers: round eyes; from ~f845 one ducks. |
| 11 | new guy in the porthole, faces out | f867-875 nervous smile, sweat drop on the forehead. ~f876-884 slides sideways out of the window (8 frames), window empty from ~f886 ("every hour" f868-882). |
| 12 | commander in the doorway (arms crossed), new guy next to him, both face camera | Commander: f1007-1058 glare, arms crossed; ~f1062-1070 leans to the new guy, then leaves the frame with the camera move. New guy: f1007-1034 stiff, round scared eyes, arms down ("get lost from one" f1008-1030). ~f1038-1050 snaps to a wide innocent smile ("flush?" f1040). ~f1054-1066 hand on hip, explaining ("Well," f1061). ~f1074-1094 slides to centre, smug half-lids ("a spaceship toilet"). ~f1098 head turns in profile to the toilet coming apart ("doesn't" f1099). ~f1102-1113 back to camera, shrug smile ("have pipes." f1112-1117). |

## 4. Moving objects and effects

| shot | f | what, how it moves |
|---|---|---|
| 1 | 0-14 | paper roll floats right of the tank (x 78%, y 50%), slow turn, drifts a few px per frame |
| 1 | ~14-22 | the roll is pulled to the bowl and unrolls into a white ribbon that arcs into the bowl (fast, about 8 frames) |
| 1 | ~24-28 | ribbon gone, small swirl in the bowl; clean by f30 |
| 2 | 75 | ship starts to turn and move (one-frame start, then eased) |
| 2 | ~88-94 | nozzle glows red |
| 2 | ~96-100 | flame ignites; ~f100-118 plume grows to 25% of frame width, purple-white, soft, flickers |
| 3 | ~176-180 | yellow button box pops up onto the desk at the right (about 4 frames) |
| 3 | ~186-188 | wall screen switches from the orbit map to "FLUSH WINDOW" (dark, empty ring) |
| 3 | 192 / 203 / ~213 / 224 | countdown 3 / 2 / 1 / GO: each digit appears in ONE frame, a ring sweeps round it; about 10-11 frames per digit; GO is green with "AUTHORIZED", the room light turns teal |
| 3 | 263-264 | red button pressed; screen flips to red "NO GO" in ONE frame (f264), room turns red, then purple by ~f268 |
| 3 | ~272-276 | NO GO fades out, red banner "NO FLUSHING TONIGHT" comes on (about 4 frames); small clocks on top keep counting all shot |
| 4 | all | mission control keeps playing in the wall monitor; soft drop shadows of the three on the wall sway with them |
| 5 | all | bags sway slowly; red floating object by the window (~f450-480) drifts |
| 6 | 500-530 | toilet glows white-blue, glow strip lights along the floor; f507-508 a flash with the flush |
| 6, 11 | all | sweat drop on the new guy's forehead (upper left of the face), sits there, does not fall |
| 7 | ~585-600 | first sparkles outside the glass, upper left |
| 7 | ~600-660 | glitter multiplies ("hundreds" f611) into a dense cloud that drifts across the canopy; each sparkle twinkles on and off in 3-6 frames |
| 7 | ~690-704 | one big four-point star flare at the lower left, grows and peaks at ~f702 |
| 7 | ~588-612 | the navigator's cup floats away to the right, turning |
| 8 | all | map lines and a red ring at the centre; the real stars behind do not match; slow drift only |
| 9 | 772 | sign flips from green bars to red "COMM INCOMING" in ONE frame (one frame after the shot is clean); red lamp on the radio and a red wash on the desk pulse (not timed) |
| 10 | 803-866 | red deviation line on the graph grows down to the right; the "DEV" number counts up (0.0 to 4.7 DEG) |
| 11 | ~950-998 | glitter trail from the tail, a growing cloud upper left |
| 12 | ~1086-1090 | toilet starts to glow blue-white ("toilet" f1087) |
| 12 | ~1097-1104 | toilet comes apart upward (about 7 frames, eased out): tank on top, lid, seat ring, bowl, base, each with a white ring between; small bolts float near the floor; then the parts hang and drift slowly to f1113 |
| 12-13 | ~1100-1170 | a bright teal-white glow travels along the hose on the floor, through the wall and under the floor, at about the camera's speed |
| 13 | 1176-1199 | inside the tube: rings rush past, the core at the centre pulses (bright at ~f1178, ~f1188, sparkles at ~f1194-1198) |

## 5. Captions

- Look: heavy rounded sans (Montserrat/Poppins ExtraBold kind), pure white, black outline about 3 px at 1080 width
  plus a soft dark shadow. Lower case as spoken, sentence capitals and punctuation kept ("spaceship,", "Earth.").
  No colour word, no box, no pop or bounce: a hard swap from one caption to the next.
- Size (measured): a one-line caption is 27 px high at 960 (2.8% of frame height, with descenders); letter x-height
  about 2%. Width: "spaceship," = 36% of frame width.
- Place (measured): centred; the text band is 69.0%-72.0% of frame height (centre 70.5%). It never moves.
- Words: 1 to 3 per caption, mostly 1 ("flush", "toilet", "never"); short words are joined ("If you", "on a",
  "it back", "the new guy", "how do you", "when tonight's"). About 95 captions in 40 s (133 words).
- Timing: the caption changes 0-4 frames BEFORE the measured word start (e.g. swap f317 "rolls" 317, f328 "his" 328,
  f346 "It's a" 350, f356 "toilet." 360, f376 "What's" 380).

## 6. Motion numbers (measured with code)

`work/stats.py` on `work/motion.json`. A frame counts as "camera moving" when the fitted picture shift is over 0.35 px
(at 540 px width) or the zoom over 0.05% or the roll over 0.03 degrees in that frame. Speeds per frame.

| shot | frames | camera moving | rests of 6+ frames | median shift (% of W per frame) | 90th pct shift | median zoom per frame | 90th pct zoom | median picture change (mean abs diff, 0-255) |
|---|---|---|---|---|---|---|---|---|
| 1 | 0-35 | 97% | none | 0.04 | 0.28 | 0.35% | 4.6% | 4.5 |
| 2 | 36-119 | 87% | f63-69 (visually f60-74) | 2.0 | 2.9 | 0.57% | 2.0% | 9.0 |
| 3 | 120-283 | 95% | f193-199 | 0.06 | 2.1 | 0.19% | 6.1% | 4.7 |
| 4 | 284-410 | 88% | f360-373 | 0.06 | 3.8 | 0.21% | 3.9% | 6.0 |
| 5 | 411-499 | 98% | none | 1.6 | 2.6 | 1.03% | 2.6% | 9.4 |
| 6 | 500-531 | 100% | none | 0.05 | 0.11 | 0.16% | 0.53% | 5.7 |
| 7 | 532-712 | 97% | none | 0.14 | 1.9 | 0.44% | 2.3% | 7.8 |
| 8 | 713-770 | 91% | none | 0.06 | 1.0 | 0.13% | 0.19% | 3.2 |
| 9 | 771-802 | 91% | none | 0.01 | 0.03 | 0.33% | 0.42% | 4.1 |
| 10 | 803-866 | 100% | none | 0.16 | 0.36 | 0.34% | 0.60% | 8.6 |
| 11 | 867-1006 | 93% | f992-1001 | 0.86 | 2.4 | 0.14% | 3.6% | 7.9 |
| 12 | 1007-1113 | 100% | none | 0.24 | 0.36 | 0.38% | 0.78% | 6.6 |
| 13 | 1114-1199 | 95% | none | 2.3 | 7.1 | 2.5% | 13% | 31.7 |

Whole clip: the camera is at rest in about 55 of 1200 frames (under 5%), in four places only.
Limits: characters and captions are inside the fit, so in shots 6, 9, 10, 12 part of the small "shift" is acting; the
zoom column is the trustworthy one there (a steady 0.15-0.4% per frame = 2-6% per 0.5 s, visible on the sheets).

## 7. What Rick does that makes it fluid (with the numbers)

1. The camera is never parked. 87-100% of frames move in every shot; a rest is 7-15 frames and happens four times in
   40 s. Under every acting hold there is a push of 0.15-0.4% per frame (2-7% per 0.5 s).
2. Almost no cuts. 12 joints: 2 hard cuts, 6 dissolves, 4 match moves through a porthole, a screen, a screen, a hatch.
3. Dissolves are short (5-12 frames) and the incoming camera is already moving on its first visible frame.
4. Match moves are ONE eased move across two places: the pull-back out of the porthole accelerates (scale per frame
   0.94, 0.88, 0.82, 0.76, 0.72), the pull-back out of the monitor peaks at 4.3% of frame height per frame in the
   middle and settles over the last 6 frames. The inner picture keeps playing.
5. Every big move eases in over 4-6 frames and out over 6-10 (frame difference f29-33: 6, 16, 33, 56, 59; f311-318:
   31, 29, 25, 23, 18, 14, 11, 4). No move starts or stops in one frame.
6. A move reverses without stopping (shot 12: push in 3%, 4%, 6%, 9%, 12% per 0.5 s, then pull back 4%, 7%).
7. Roll is used outside the ship: 2-4 degrees per 0.5 s, 14 degrees total in shot 7, 22 in shot 11, always eased.
8. Acting is snap and hold: a pose change takes 2-3 frames (f8-10, f507-508, f842-845), the hold is 10-40 frames with
   float only. In the shouting shot the mouth shape changes every 3 frames.
9. Screen and lamp events take ONE frame and sit on the word (3/2/1/GO at f192/203/213/224, NO GO f264 on "order"
   f265, COMM INCOMING f772).
10. Something drifts in every shot besides the camera: paper, flame, clocks, sparkles, cup, sleeping bags, hose glow.
