# CUE SHEET: The Surgery Where the Surgeon Did Nothing (sound)

Timed on voice/words.json (frame = s x 30, film 2229 frames = 74.30 s, loop at 2229 -> 0). Absolute frames from s1..s5 STATE.md / film.json where the stretch has them; **R** = word onset for now, retime when the build-out lands (edit `frame` in cues.json, rerun `python mix.py v1`).
Every clip is a CB library sample (clip sources in mix_report.md). Synthesized: none. Levels, pans and the full table: mix_report.md.

## Power hits (anime impact: whoosh-in over the hold, music + beds drop -24 dB, slam +3 dB on the frame, ring-out)
- row 5, frame 156, hold 8 f: three PLASTERS: s1 STATE impact f156
- row 18, frame 650, hold 10 f: all in their HEADS: s2 STATE impact f650
- row 37, frame 1560, hold 8 f: the SAME HEIGHT: s4 STATE impact f1560
- row 40, frame 1717, hold 6 f: being sure you're FIXED: word onset, no impact frame in s5 yet **R**
- row 50, frame 2194, hold 8 f: never MISSED it: s5 film.json impact f2194

## Ambience per place (0.45 s blends; frame 0 bed led in under the last 0.5 s for the loop)
- f0 A OR 3 morning: air-handling hum, monitor beep once a second, room tone: amb_hum -36 dB, amb_monitor -47 dB, amb_room -44 dB
- f375 B corridor morning-noon: fluorescent buzz, distant PA murmur, the freeway through the window: amb_fluor -42 dB, amb_pa -45 dB, amb_traffic -44 dB
- f540 C office night: wall clock tick, quiet room (no rain): amb_clock -38 dB, amb_room -42 dB
- f927 B pre-op bay morning (hard cut 1): room tone, far PA, fluorescent: amb_room -38 dB, amb_pa -47 dB, amb_fluor -48 dB
- f1087 A OR 3 morning: hum + monitor: amb_hum -36 dB, amb_monitor -47 dB, amb_room -44 dB
- f1226 A OR 3 flooded: hum, water lapping, monitor: amb_hum -38 dB, wave -42 dB, amb_monitor -48 dB
- f1290 D stairwell afternoon (hard cut 2): hollow stair air, room tone: amb_echo -36 dB, amb_room -44 dB
- f1490 C office striped afternoon: clock tick, room tone: amb_clock -42 dB, amb_room -40 dB
- f1683 A OR replay: hum + monitor: amb_hum -37 dB, amb_monitor -48 dB, amb_room -44 dB
- f1766 E waiting room: fish-tank bubbles, people, room: amb_bubbles -38 dB, amb_people -46 dB, amb_room -44 dB
- f1926 C office 2004 grey evening: printer / PC hum, room: amb_printer -44 dB, amb_room -40 dB
- f2063 A OR 3 evening, lamp off: hum, room (monitor off): amb_hum -40 dB, amb_room -42 dB
- f2156 D stairwell evening: stair air, the climbing crowd: amb_echo -36 dB, amb_people -42 dB

## Music: ONE theme, Curious Thoughts (BACKGROUND MUSIC)
- statement 0 -> "and the real surgery groups" (the twist, 47.5 s); low (opening bars slowed 0.8, dark, -6 dB) through the three level charts; swell on "You see" (52.80) and the warm return so the track's last chord (104.0 s in the track) lands on "missed" (73.14 = f2194)
- Ducked: music 18 dB under the voice RMS while speaking, 8 dB duck depth into the gaps; pocket -7 dB under the nurse whisper (9.30-12.18 s).

## Events by plan row (frame clip: what)
- **1** f6 `cloth_soft` frame 0: the surgeon's sleeve moves as the scalpel tip rests on the knee
- **2** f25 `tik` tik 1: the scalpel tip makes dot 1 · f25 `tik_spark` tiny spark on dot 1 · f37 `tik` tik 2: dot 2 · f37 `tik_spark` spark 2 · f46 `tik` tik 3: dot 3 · f46 `tik_spark` spark 3
- **3** f64 `cloth_soft` the patient shifts on the raised table, moustache twitch
- **4** f88 `squeeze` pinky-out squeeze of the grey-blue rubber bulb · f92 `water_fan` the fan of water over the knee · f104 `drips` drops sparkle and patter on the drape
- **5** f125 `whoosh_short` push-in to the knee close · f133 `slap` plaster 1 slaps on like a stamp (s1 STATE f133) · f135 `tape` plaster 1 sticks · f147 `slap` plaster 2 (s1 STATE f147) · f149 `tape` plaster 2 sticks · f151 `glint` glint across his glasses in the hold · f156 `whoosh_rev` POWER hold: hand hangs high f148-155, the air sucks in to the impact · f156 `slap` POWER IMPACT f156: plaster 3 · f156 `stamp` the rubber-stamp thump on plaster 3 · f156 `thud_deep` anime impact body, with the 5-7 f camera kick · f166 `pat` the small pat on the last plaster (s1 STATE f166)
- **6** f184 `whoosh_soft` slide off the knee along the scope cable into the sealed bag · f187 `static` monitor snaps to NO SIGNAL snow on "never" · f213 `bag_crinkle` the sterile bag crinkles over the lens (impossible view)
- **7** f228 `whoosh_short` pull back out of the bag: knee + clean tray
- **8** f250 `cloth_soft` the nurse stops dead with the clean tray · f256 `chain` her glasses chain swings from the stop
- **9** f279 `cloth_soft` her hand cups at her mouth
- **10** f310 **R** `cloth_soft` she leans to his ear (word time late, see plan; check) · f338 `cloth_soft` the patient's slow thumbs-up under the drape · f353 `pat` he pats the third plaster on "operation" · f359 `ting` her eyebrow "ting" + glasses glint
- **11** f375 `whoosh_sweep` the camera flies out through the OR door porthole into the corridor (join S1 -> S2, f375) · f385 `door` the porthole door swings behind us
- **12** f427 `shimmer` heat shimmer over the freeway in the window
- **13** f457 **R** `shaver` porthole 1: the gowned silhouette's small shaver (word time shared with "scrape", check) · f476 `pour` porthole 2: the jug pouring, same rhythm
- **14** f483 `wheels` the gurney queue rolls up · f492 `squeak` a gurney wheel squeaks
- **15** f499 `wheels` the next gurney is already there · f499 `clock_cartoon` EXTREME: the wall clock's hands spin into a blur · f509 `clock_spin` clock jumps 8, 11, 2 · f515 `honk` EXTREME: the pickup driver honks at the queue on the freeway · f538 `whoosh_sweep` fly into the spinning clock face (f537 -> office clock f540)
- **16** f544 `cloth_soft` the surgeon, mask down, lifts the cup to sip · f566 `tap` the colleague's fingertip taps the sticky note, tap 1 · f571 `tap` tap 2
- **17** f586 `whoosh_short` push-in to the note · f595 `note_snap` the note flutters on the locker door
- **18** f634 `coffee_pour` POWER hold: coffee rising in the cup at his lips · f650 `whoosh_rev` the hold sucks in to the impact (s2 STATE f650) · f650 `hit_boom` POWER IMPACT f650: inverted flash, the "?" field drops in · f650 `stab` anime stab on the focus lines · f652 `glint` glasses glint + sweat drop · f652 `coffee_pour` the coffee overflows the rim (s2 STATE f652-669) · f664 `drips` overflow splashes the desk
- **19** f674 `paper_rustle` he lifts the stack of 180 file cards · f681 **R** `creak` EXTREME: the card tower, taller than him, sways and creaks (number word times early, check) · f695 `whoosh_short` the desk lamp ducks · f716 `creak` the tower sways back
- **20** f733 `riffle` card riffle like a dealer · f743 `card_flip` deal to tray 1 · f751 `card_flip2` deal to tray 2 · f757 `card_flip` deal to tray 3 · f764 `card_slap` the card stuck on his thumb flicks into tray 3
- **21** f793 **R** `tap` tray 1 lights (number word time early, check) · f812 `pop` tray 1 label pops: scraper icon
- **22** f853 `pop` tray 2 label pops: water drop
- **23** f891 `peel` he peels the "?" note off his locker · f902 `pop` tray 3 label: the note sticks on (label pop 3) · f910 `glint` the wink at the lens
- **24** f932 `paper_rustle` HARD CUT 1 (f927) to the pre-op bay: clipboards · f941 `pen_write` the patient signs the form
- **25** f965 `whoosh_soft` POV: tilt down over his shoulder onto the clipboard · f996 `pen_squeak` the pen squeaks a tick in MAY BE PRETEND SURGERY
- **26** f1030 `envelope` the sealed envelope slides into the surgeon's pocket · f1046 `cloth_soft` the patient leans to peek · f1053 `note_snap` the surgeon slides the envelope higher
- **27** f1075 `wheels` follow the patient's gurney to the OR doors · f1085 `door` through the OR door portholes (s3 STATE f1084/1087) · f1121 `whoosh_soft` fly into the CRT (s3 STATE f1119 -> inside f1124) · f1123 `vcr_clunk` VCR clunk, the tape REAL ONE goes in · f1128 `play_click` PLAY · f1143 `static` the curved glass hums with scanlines from inside
- **28** f1169 `squeak` pump-handle creak 1: the knee bends · f1180 `squeak2` creak 2 · f1185 `squeak` creak 3 · f1195 `whoosh_soft` fly back out through the glass (s3 STATE f1192-1199)
- **29** f1201 `pour` he pours the jug from high up into the steel bowl · f1226 `sploosh` EXTREME: SPLOOSH (s3 STATE impact f1226) · f1226 `hit_boom` the splash body; the floor floods · f1229 `wave` the tidal wave runs shin-deep over the floor · f1230 `chain` the SPLOOSH ring rattles the lamp
- **30** f1252 `plop` the kick bucket and the nurse's clog bob · f1261 `cloth_soft` the dry patient smiles at the sound · f1269 `plop` a second bob
- **31** f1290 `cane_creak` HARD CUT 2 (f1290): the old cane on the newel post creaks in its cobweb · f1301 `creak` EXTREME: the hammock cobweb sways
- **32** f1322 `whoosh_short` push-in to the knee in shorts (row 5 framing) · f1338 `shimmer` three faint pale squares where the plasters were
- **33** f1353 `boing` EXTREME: springy stride 1 · f1353 `boot` foot 1 on the step · f1362 `boing` stride 2 · f1362 `boot` foot 2 · f1373 `boing` stride 3, top step · f1373 `boot` foot 3 · f1377 `sign_spin` the USE HANDRAIL sign spins like a propeller
- **34** f1391 `needle` the pain dial needle swings red -> green · f1406 `boing2` the needle wobbles once in green
- **35** f1432 `boot` four feet lift and land at once (visual rhyme) · f1432 `crowd_walk` the three climbers behind him · f1450 `boot` step 2, in unison · f1462 `boot` step 3, in unison
- **36** f1490 `whoosh_soft` match dissolve: the needle sweep becomes the light-box chart (f1490) · f1508 `pop` pain chart 1 pops on the light box · f1516 `pop` chart 2 · f1525 `pop` chart 3
- **37** f1560 `whoosh_rev` POWER hold: the ruler hovers (s4 STATE impact f1560) · f1560 `clack` POWER IMPACT f1560: the ruler lands on the three bars · f1560 `hit_boom` impact body, two-tone frame · f1561 `stab` the three bar tops lock at once · f1562 `shimmer` the light band races along the ruler edge
- **38** f1584 `glint` POV: fly into the glint of his glasses · f1584 `whoosh_soft` the view through the rims · f1601 `twinkle` the shiny scope in its open case
- **39** f1629 `whoosh_short` pull back out of the lens · f1643 `lid_thunk` the case lid drops shut (s4 STATE shut f1643) · f1643 `dust_puff` dust puff off the lid · f1663 `cloth_soft` the surgeon lowers his head, humble
- **40** f1683 `whoosh_soft` the lid opens on the OR from the patient's side (join f1683) · f1701 **R** `slap` the third plaster lands past his chin (replay) · f1717 **R** `cymbal_harp` POWER: the warm gold aura flickers out over his body · f1717 **R** `sparkle` the warm sparkle field on "fixed" · f1717 **R** `tympani` soft power hit under the aura
- **41** f1745 `cloth_soft` his frown starts to melt · f1756 `twinkle` the smile
- **42** f1766 `whoosh_sweep` lateral glide dissolve to the waiting room (f1766) · f1783 `wail` the boy wails over his scuffed knee · f1796 `bubble` a fish in the tank turns to stare
- **43** f1836 `wail` the wail goes on · f1840 `whoosh_short` push-in, row 5 framing · f1843 **R** `slap` SIGNATURE: one plaster slaps on (the row 5 slap) · f1843 **R** `stamp` the same stamp thump as row 5 · f1877 `pat` the nurse pats it down
- **44** f1896 `bubble_pop` his last sob bubble pops, the wail stops · f1906 `boot` he runs off, step 1 · f1911 `boot` step 2 · f1916 `boot` step 3
- **45** f1931 `whoosh_soft` the glide dissolves into the 2004 desk · f1970 `envelope` the plain letter slides across the desk
- **46** f1977 `whoosh_rev` the giant stamp comes down (s5 film.json impact f1977) · f1977 `stamp` EXTREME: THUMP, NOT PAID · f1977 `thud_deep` the desk sags in the middle · f1979 `creak` the desk creaks under it · f1980 `pens` the pens jump out of their cup · f1981 `money_flutter` the papers blizzard to the ceiling · f1991 `paper_rustle` papers flutter down
- **47** f2024 `hinge` through the door the tower rolls away: squeaky wheel like a sad sigh · f2047 `squeak2` the last squeak, further off
- **48** f2063 `whoosh_soft` follow the tower down the corridor into OR 3 evening (f2063) · f2085 `ting` she holds up the clean, unused tray: tray "ting" · f2097 `ting` eyebrow "ting" + glasses glint
- **49** f2125 `cloth_soft` the surgeon pulls his mask down, shrugs · f2140 `door` he pushes the OR door open · f2146 `whoosh_sweep` the camera goes with him through the door (join f2156)
- **50** f2170 `crowd_walk` EXTREME: the stairwell full of former patients climbing to the window · f2170 `boot` the stream lifts the same foot at once · f2181 `kids_cheer` the grandkid on his shoulders, arms up like on a ride · f2194 `whoosh_rev` hold on the calm face (s5 film.json impact f2194) · f2194 `boot` the veteran's foot hits the top step · f2194 `hit_boom` POWER IMPACT f2194: the burst of evening rays · f2194 `cymbal_harp` the rays open out · f2197 `sparkle` sparkle on the grin; freeze + slow push
