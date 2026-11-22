# plane-eater: MIX NOTES (sound v1, 2026-11-22)

One command: `python episodes/plane-eater/sound/build_mix.py v1` (about 1 min CPU). It writes the synth clips, `cues.json`, `mix.wav`,
`mix_report.md`, `out/measure.json`, `out/coverage.json`, `out/stems/` and `draft/FILM_DRAFT_sound.mp4`.

## Measured (ffmpeg ebur128, from out/measure.json)
| gate | target | measured | |
|---|---|---|---|
| integrated loudness | about -16 LUFS | -16.0 LUFS | PASS |
| true peak | below -1 dBTP | -3.6 dBTP | PASS |
| loudness range | report | 1.4 LU | |
| voice over music while speaking | at least 12 dB | 13.5 dB | PASS |
| voice over sfx / beds while speaking | at least 8 dB | 17.6 / 12.7 dB | PASS |
| 0.5 s windows with voice under 6 dB over the rest | at most 8 % | 2 of 56 | PASS |
| loop, last sample into the first | click-free | step 0.0014 vs 0.0107 usual | PASS |
| picture events (fx, kicks, prop pick-ups in s1..s5/film.json) with a cue within 2 frames | all | 41 of 41 | PASS |

Length: `mix.wav` is 1022 frames = 34.067 s (48 kHz stereo 24-bit). The locked voice is 34.038 s; 1021 frames (34.033 s) would cut its last
4 ms, so the film is 1022 frames, the same length as FILM_DRAFT_v1.mp4. Voice untouched (no trim, no re-time; resample and a 70 Hz high-pass only).

Side by side with Rick (internal, not for publishing): his films measure -13.9 to -14.2 LUFS, LRA 2.2-3.9; a rough high-band onset count gives
3.0-3.5 per second for him and 3.8 for ours (voice included). Ours is mastered 2 dB quieter on purpose (CB_RULES section 6: about -16 LUFS).
His beds sit 5-10 dB under the voice (STYLE_BIBLE); ours 12.7 dB (beds) and 13.5 dB (music): the voice-on-top gate (12 dB over music) stops us going closer.

## Music
Kevin MacLeod, "Fluffing a Duck" (incompetech.com), CC BY 4.0: one melody in three sections: statement from bar 1 (0-16.98 s), the low
in the X-ray room (16.98-22.30 s, same theme slowed 0.8, low-passed, -4 dB), the return from 22.30 s cut so the track's final BUM lands on
FOOD (33.38 s, the tray-table chomp). The pack has NO accordion or French music: this is the closest light playful track. For a real
musette flavour the lead must add an accordion track to the library (or OK a composed one); then change `music.theme` and the source times.

## Licences used
- SFX: Kenney audio packs (Casino, Digital, Impact, Interface, RPG, Sci-fi, UI), CC0 1.0, no credit needed. Files listed in mix_report.md "Clip sources".
- Music: CREDIT REQUIRED in the YouTube description, exactly:
  "Fluffing a Duck" Kevin MacLeod (incompetech.com) Licensed under Creative Commons: By Attribution 4.0 License http://creativecommons.org/licenses/by/4.0/
- SYNTH (made in code in build_mix.py, no licence): airfield wind, distant Cessna circuit, dusk crickets, clinic room tone, light-box buzz,
  airliner cabin roar, jug glug, spring boing (seat, cheeks), scale-needle twang, belly putt-putt, sniff, time-lapse riser, rag squeak on glass.
  Reason: the Sound Pack V1.2 has no ambience, no liquid, no spring, no aircraft and no breath sounds.

## Stand-ins from the pack (closest real sample, named)
hacksaw = drawKnife / knifeSlice re-pitched up; salt shaker = dice shake, high-passed; camera flashbulb = UI switch click + glass tap + digital
"highUp" whine; tire stretch = wooden creak slowed; X-ray-world drone = sci-fi engine low-passed; cabin jet layer = sci-fi large engine low-passed;
foil = card pack opening; bites = tin / metal impacts + sci-fi "explosionCrunch" re-pitched and cut short.

## Retiming when the picture moves
Every event is keyed in sound_events.json to a film frame of sN/film.json or to a word. Note: draft/FILM_DRAFT_v1.mp4 repeats frame 519 and 638
at the stretch joins, so its picture runs 1-2 frames late from s3 on; FILM_DRAFT_sound.mp4 drops those two frames so picture and voice line up.
