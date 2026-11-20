# STATE: sound (fake-surgery), v1 built 2026-11-16
ONE command: `cd episodes/fake-surgery/sound && python mix.py v1` (about 30 s CPU; cuts missing clips, mixes, masters, measures, writes mix_report.md).

## Files
- mix_v1.wav: 74.30 s = 2229 frames, 48 kHz stereo 24-bit, over voice/voice.wav untouched (no re-time, no trim, resample only).
- cues.json: THE table (174 cues, 13 beds, 5 power entries, 1 pocket, music, plan rows). Retime here, not in mix.py.
- make_cues.py: one-time generator of cues.json; DO NOT rerun (it overwrites hand edits: row 50 `len` caps were added to cues.json after).
- clipdefs.py: 83 clip keys, all from ALL SOUND EFFECTS via library_index.csv (copied from monopoly-escape). New option `pad` (monitor beep loop).
- mix.py: copy of the monopoly-escape mix with this film's words.json, frame-anchored beds, plan check from cues.json, loop duck match.
- cue_sheet.md (events by row, beds, power, music), mix_report.md (gates + full cue table + clip sources), out/stems, out/mix_v1_preview.mp3, clips/ (cache).

## Numbers (mix_report.md)
- -14.0 LUFS integrated, TP -1.90 dBTP, LRA 1.2 LU.
- Voice -16.7 dBFS RMS while speaking; music -32.8 (voice +16.1), sfx -34.4 (+17.7), beds -37.1. Music duck depth 8 dB (18 under speech, 10 under in gaps).
- 0.5 s windows: 3 of 128 under 6 dB (5.5 s 3.8 dB plaster-3 impact under "plasters."; 73.0 s 4.8 dB final chord + hit under "missed it"; 66.0 s 6.0 dB stamp).
- Loop: step 0.00008 against 0.00216 usual = click-free (music duck gain matched across the loop; frame 0 bed led in under the last 0.5 s).
- 50 of 50 plan rows have a cue within 2 frames of a plan word.
- Power hits: f156, f650, f1560, f1717 (R), f2194. Big gags: SPLOOSH f1226, stamp f1977.

## Frames taken from the stretches (not retime)
s1 slaps f133/f147, impact f156, pat f166, push f125 · s2 porthole f375, clock join f538/540, impact f650, overflow f652 · s3 hard cut f927, porthole f1085, CRT in f1121 / out f1195, SPLOOSH f1226 · s4 hard cut f1290, match dissolve f1490, impact f1560, lid shut f1643 · s5 joins f1683/1766/1926/2063, stamp f1977, impact f2194.

## RETIME (word onset used; replace `frame` in cues.json when the stretch build-out lands)
- POWER row 40 (power entry frame 1717 + cues cymbal_harp/sparkle/tympani at "fixed" 57.22, slap at "sure" 56.70): s5 has no aura/impact frame yet.
- Row 43 signature slap + stamp at "plasters" 61.42 (f1843): take the s5 slap frame.
- Row 10 lean at "Doctor," 10.34 (whisper puts it late), row 13 shaver at "surgeons" 15.24 (shared time with "scrape"), row 19 tower creak at "180" 22.70, row 21 tap at "60" 26.42 (number words timed early).
- Any s1..s5 frame above that moves in a later build-out round.

## Weak / open
- Loudness target conflict: lead brief -14 LUFS / TP -1.5; CB_RULES section 6 (feature-film finish) says about -16 LUFS / TP below -1. Built to the brief; to switch, set TARGET_I = -16.0 in mix.py and rerun. Lead decides.
- Power hits f156 and f650 sit under spoken words ("plasters.", "heads,") so the voice key holds them 7 dB under the voice: the hit lifts the mix little there (f1560 +4.9 dB, f2194 +2.0 dB, f156/f650 masked by the voice).
- No real sip, envelope-slide, VCR-button or fluorescent sample in the library: closest stand-ins (paper flip, metallic click, re-pitched servo hum). No anime-style "whoosh hit" pack; power = reverse whoosh + boom + stab.
- Measured only; not heard side by side with a Rick film by a human. crew/ check file not written (this brief limited writes to sound/).
- Glasses-chain swing, pinky squeeze, monitor flicker are sounded although s1 STATE says they are not built in picture yet: drop or keep when s1 builds them.

# v3 (2026-11-16, FINAL JOIN v2): sound matched to the v2 picture. `python mix.py v3` -> mix_v3.wav (74.333 s = 2230 frames), -14.0 LUFS, TP -1.9 dBTP, LRA 1.2; loop step click-free. Backup of the table: cues_v2_before.json.bak. clipdefs.py: new clips `snore` (sleeping_mimimimimi) and `ding` (BellDing_AP1.1065).
## Removed (not shown any more)
- S1 6 s: bag_crinkle 213 and the pull-back whoosh 228 (no bag view; the camera pulls back to the tray at f188-263: the slide whoosh is kept, retimed to f190, -34 dB).
- S2: the clock whoosh_sweep 515 (the clock join is a 12 f dissolve 534-545: no whoosh); the colleague's fingertip taps 566/571 (no hand).
- S3: inside-CRT whoosh 1143 + scanline static 1143 + fly-out whoosh 1185; the porthole door at 1085 (doors now swing open 1066-1080).
- S4: POV glasses glint 1584 + rims whoosh 1584, pull-out whoosh 1629.
- S5: gold aura cymbal_harp / sparkle / tympani at 1717 and the POWER entry 1709 (no aura: the music no longer dives and slams there); the boy's run-off boots 1906/1911/1916.
## Added / retimed
- Splash crowns: sploosh f89 (-27) and f103 (-26) in S1; S3 r29 sploosh raised -17 -> -15 at f1226 plus a second slosh (rate .8, -21) at f1228.
- S2 f560 speech-bubble pop (white bubble with red ?). S3 doors: door 1066, hinge 1069, door 1078 (leaves reach the stops), no whoosh.
- Snore / zZ (soft, -42 to -43 dB, left, ducked by the voice key): S1 f18 98 178 262 338; S3 f1103 1160 1210 (until the dream smile 1252); S5 f1694 1731 (koSleep until the melt 1745).
- S5 thought bubble: pop f1716 (-22) + happy ding f1717 (-24), where the bubble first shows (1718).
- Retimed: clock_cartoon 499 -> 505, clock_spin 509 -> 515 (the clock is in view from f495); S1->S2 flight whoosh 375 -> 372 (-32, inside the 18 f dissolve 366-383); lid_thunk 1629 -> 1643, dust_puff 1629 -> 1645 (lid shuts f1643), twinkle 1601 -> 1636.
## Kept on their frames
Impact hits (hit bus): 156 (slap, stamp, thud), 650 (boom, stab), 1226 (sploosh + boom), 1560 (clack, boom, stab), 1844 (slap, stamp), 1977 (stamp, thud), 2194 (boot, boom, cymbal_harp). POWER holds (music + beds drop, slam on the frame): 156, 650, 1560, 2194.
## Plan rows without a cue within 2 frames (mix_report): 7, 24, 38 (7 and 38: their cue is gone with the picture element; 24 was already off by the retimed hard cut 927).

# v4 (2026-11-17, FINAL JOIN v3): sound matched to the v3 picture. `python mix.py v4` -> mix_v4.wav (74.333 s = 2230 frames), -14.0 LUFS, TP -1.9 dBTP, LRA 1.2, loop click-free (step 0.00008). Edit script: edit_v4.py (one-time, from cues_v3_before.json.bak; clipdefs backup clipdefs_v3_before.py.bak). cues.json now 186 cues, 15 beds.
New clips (all CB library): water_spray, drip1, drip2 (DropSingleDrip), water_pour, water_move (WaterMovement), gurgle, vcr_whirr (ServoMotorShort, re-pitched stand-in: no real VCR whirr in the library), wheel_roll (slower scrape).
## S1
- bulb_splash water f85-115: squeeze f83; spray f85 + f97 (water_spray), fan + crown f89, crown 2 f103 (sploosh -30/-29, quieter than v2 -27/-26: the water is see-through spray, no thick blob), drip patter f96 100 106 110 114 on the drape.
- Nurse two-shot 300-345: voice untouched; closer room tone = new OR bed at f296 (amb_room -37 instead of -44, hum -38, monitor -50) back to the normal OR bed at f347; her lean cloth f302 + sleeve settle f322; the music pocket under her quote stays (whispers -> operation).
- zzz: the 5 repeating snores (f18 98 178 262 338) removed; one soft snore in a voice gap, len-capped to the gap: f171 (gap f170-184). S3 f1153 (gap 1153-1165) and f1273 (gap 1272-1290); S5 f1685 (gap 1673-1695). All at least 3 s apart, -44 dB, left.
## S2
- Speech bubble pop f560 -> f562 (bubble 562-612). Porthole shaver f456 / jug f476, queue wheels, clock cues unchanged (v3 pan keeps the portholes in view on "scrape and rinse" and the queue before the dissolve 534-545).
## S3
- Gurney through the OR doors (rolls 1040-1122, doors swing 1060-1082): wheel_roll f1040 / 1066 / 1092 (-27..-29, the last cut at 1.0 s), wheel squeaks f1050 1074 1098, door f1060, hinge f1063, door at the stops f1081. v2 door 1066/1069/1078 removed; the 'For' wheels cue (1075) removed.
- CRT/VCR shot 1110-1150: VCR clunk f1115 (tape in), PLAY f1122, vcr_whirr f1123 + f1137 (-33/-35).
- jug_flood 1215-1260: water pour f1210 (len 1.6 s), SPLOOSH f1226 -15 kept, soft splash body f1226 (hit_boom -29, was -25 on the hit bus: no thunk), crown collapse sploosh f1228 (-23, rate .8), floor waves water_move f1231 and f1241, gurgle f1250, drips f1236 1244. REMOVED: the lamp-rattle chain f1230, the 'wave' ocean cue f1229, the old pour.
- OR bed starts at f1100 (centre of the baked J2 dissolve 1094-1105), was 1087.
## S4 / S5 (checked against the v3 STATE impact lists, no change except the dissolve)
- Kept on their frames: 156, 650, 1226, 1560, 1844, 1977, 2194 (hits and POWER holds 156 650 1560 2194), 1290 cane, lid thunk 1643 (checked on the s4 frames: the lid is shut by f1644), dust 1645, twinkle 1636, 1717 ding / 1716 pop (bubble), 1766/1926/2063/2156 whooshes (place dissolves now 8 f at B..B+7).
- S4 stair -> chart whoosh f1490 -> f1486 (the baked 8 f dissolve 1486-1493).
## Open
- Plan rows without a cue within 2 frames (mix_report): 7, 24, 38 (as v3).
- Not heard by a human; measured only.
