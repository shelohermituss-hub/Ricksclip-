# STATE: plane-eater sound (sound designer, v1, 2026-11-22)
ONE command: `python episodes/plane-eater/sound/build_mix.py v1` (about 1 min; `--no-video` skips the preview, `--recut` re-cuts clips, `--resynth` remakes synth).

## Built
- sound_events.json: THE table. 81 events -> 186 cues, 7 beds, 4 power moments, music sections. Anchors = film frames of sN/film.json or words.
- build_mix.py: synth clips (sound/synth/), cues.json, runs templates/sound_kit/mix.py in-process, coverage check, preview video.
- cues.md (cue sheet by row), MIX_NOTES.md (loudness, licences, stand-ins), mix_report.md (gates + every cue + clip sources).
- mix.wav: 1022 frames = 34.067 s, 48 kHz stereo 24-bit. draft/FILM_DRAFT_sound.mp4: the s1..s5 drafts on the voice timeline + mix.
- crew/sound-designer_check.md, crew/sound-designer_vs_rick.jpg.

## Numbers
- -16.0 LUFS, TP -3.6 dBTP, LRA 1.4. Voice over music 13.5 dB, over sfx 17.6, over beds 12.7. Windows 2/56 under 6 dB. Loop click-free.
- Coverage: 41/41 fx, kicks and prop pick-ups have a cue within 2 frames.

## Weak
- Kenney-only pack: 14 sounds synthesized (beds, glug, boing, needle, putt, sniff, riser, squeak). No accordion music.
- Rubber snap (f489) and the hacksaw sit under spoken words: the voice key holds them down (by design).
- Not heard by a human.

## Open
- Picture still moving (fix list v1): when a stretch is re-rendered, re-read its film.json fx/acts and update the `f:` anchors, run again.
- The draft v1 repeats frames 519 and 638; the preview drops them. If draft v2 fixes the joins, remove the two `trim=start_frame=1` in build_mix.py.
- Regenerable, keep out of git (lead's FILE_GUIDE / .gitignore): sound/clips/, sound/synth/, sound/out/stems/, mix_v1_preview.mp3.
