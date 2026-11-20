# STATE: sound, lightning-spear (sound-designer, round 1, 2026-11-15)

## Built
- `mix.py` (one command: `python mix.py v1`): cuts clips from CB's library, places 119 cues on their words from `../voice/words.json`, 16 ambience beds, the one theme, masters, measures, writes `CUE_SHEET.md` + `out/`. Cue table = `Q` and `BEDS` at the top of mix.py (anchor word + frame offset), so a moved picture is a one-line change.
- `clipdefs.py`: 83 clip keys -> library file + treatment (rate, filters, trims), cached in `clips/` (47 MB, rebuildable with `python clipdefs.py -f`).
- `library_index.csv`: NEW index of both libraries (3135 sfx, 165 music). The old `rick-shorts/audio/library_index.csv` no longer exists on this PC (searched Downloads, Documents, Desktop).
- `out/mix_v1.wav` (69.500 s = 2085 frames, 48 kHz 24-bit stereo), `out/mix_v1_preview.mp3`, `out/stems/` (voice, sfx, amb, music), `out/measure.json`.

## Measured (ffmpeg ebur128, out/mix_v1.wav)
- Integrated -14.0 LUFS, true peak -1.7 dBTP, LRA 1.1 LU, master gain +3.0 dB, brick limiter never touched (0.0 dB).
- While speaking (RMS dBFS): voice -16.9, music -31.2, sfx -31.1, beds -32.6 -> voice 14.3 dB over music, 14.2 over sfx.
- 0.5 s speaking windows, voice vs everything else: 8 of 134 under 6 dB, worst 2.8 dB at 25.5 s ("hill." tail with the theme's loud bar before the turn), 4.6 at 61.5 s, 4.8 at 6.0 s.
- Keyed limiter on sfx + beds (voice key, max 12 dB): the big hits sit 5-8 dB under their set level while words run (split -7.3, one -6.9, bolt -5.5, smashed -7.7).
- Loop: end-to-start step 0.0034 against 0.0287 usual step: click-free. Everything that runs past the end (rumble, swing whoosh) wraps into frame 0.
- PICTURE_PLAN rows with a cue on the landing word (2 frames; 6 for camera rows): 36 of 36.
- Library vs synthesized: 83 library clips + 1 library music track; synthesized 0 (only treatment: re-pitch, filters, a noise-burst stone-room reverb on church/bell-chamber beds).

## Music
- ONE theme: `BACKGROUND MUSIC/Pizzicato Comedy.mp3` (E minor, ~108 bpm). Statement frame 0 -> "storms" 26.3 s; CHANGE over the countdown 25.9-51.9 s = the same opening bars at 0.8 speed (~4 st lower), low-passed, -3 dB, cut 0.12 s before "bolt"; music silent through the bolt, steam and hen; RETURN from "found" 58.7 s = the closing bars; the written 1.4 s pause sits under "he owned, even the chicken"; the button chord lands at the END of "coop" (68.23 s), rings out, fades into frame 0.
- I chose this by numbers (key, tempo, envelope: it has a clean pause + button chord ending at 99.35 s), not by ear. Not heard by a person yet.

## Weak / open
- Nobody has LISTENED. Check by ear: the slowed theme (does 0.8x sound dark or just wrong?), the crowd laugh (3 single laughs layered, no real crowd-laugh sample in the library), the swallows (wing flap + one chirp, no swallow sample), candle sounds (torch whoosh, quiet), the tree split (axe + thunder crack; no wood-split sample), the bell (one 3.4 s church bell sample re-pitched to 0.62 for all great-bell cues).
- Only 2 thunder samples in the library: all thunder is those two, re-pitched and filtered.
- The 2 under-6 dB windows at 25.5 s and 61.5 s: lower the theme bar before the turn or the fire_big cue if they bite.
- Not timed to picture: everything is on words.json + PICTURE_PLAN. When the cut exists, run with the picture and move offsets in `Q` (frames).
- No Rick side-by-side listen done (no Rick film of the same kind opened this round; out of scope of the brief). No `crew/` check file written (brief said work only in sound/).
- LRA 1.1 LU is tight (armor was 1.8); fine for phone, could open up the hits a little.

## Round 2: v2 loop-hold + camera flight ending (2026-11-15)
- Film is now 2115 frames = 70.500 s (`FRAMES` in mix.py). `python mix.py v2` -> `out/mix_v2.wav`, `out/mix_v2_preview.mp3`, stems, measure.json, CUE_SHEET.md regenerated.
- Music: button chord still lands as "coop" ends (68.23 s) and now rings out under the hold with a 1.5 s fade (was 0.25 s), gone before the loop.
- Hold accent: the existing `cluck` cue (library ChickenClucks, -22 dB, 68.40 s) is the one soft funny accent on his smug look; no second sting added.
- New bed `P9b` from film f2070 (69.0 s): amb_wind -30 + amb_rain -42, rising 9 dB to the end with the camera flight; the first bed (frame 0 dusk wind + street + swallows) leads in under the last 0.5 s as before.
- `thunder_far` moved from +26 to +54 frames after "coop" end = f2100 (70.0 s), -24 dB; it runs past 70.5 s and wraps into frame 0 (cut by the loop).
- Measured v2 (ffmpeg ebur128): -14.0 LUFS integrated, true peak -1.7 dBTP, LRA 1.1 LU; loop end-to-start step 0.0032 vs 0.0288 usual: click-free. Everything else unchanged. Not listened to by a person.

## Round 3: v3 landing ending (2026-11-15)
- Film is now 2140 frames = 71.333 s (`FRAMES` = 2140; 3424000 samples at 48 kHz). `python mix.py v3` -> `out/mix_v3.wav`, `out/mix_v3_preview.mp3`, stems, measure.json, CUE_SHEET.md.
- Unchanged to f2070. Flight bed P9b (wind + rain) now rises 9 dB over f2070-2108 only, then holds calm to the loop. Music chord and its 1.5 s fade still end at 70.5 s (as v2).
- New: landing ting at f2108 (`glint`, library tubular bell ping, -22 dB, on the spear tip); `thunder_far` moved to f2112 (-24 dB), runs past the end and wraps into frame 0.
- Measured (ebur128): -14.0 LUFS integrated, true peak -1.7 dBTP, LRA 1.2 LU; loop end-to-start step 0.0032 vs 0.0287 usual: click-free. Not listened to by a person.
