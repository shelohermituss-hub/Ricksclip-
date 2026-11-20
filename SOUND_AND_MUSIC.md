# Background music and sound effects (V1.2)

Every film gets a full sound track: your voice on top, ONE music theme under it, a sound effect on every action, an ambience bed per place, and a hit on every power moment. It is mixed and measured by one command. This page is the whole method.

## Where to get free music and sound effects

The kit ships no sound or music files: you add your own library (step 1 below). Good free sources, with their licence in one line each:

- **Pixabay Music and Sound Effects** (pixabay.com/music, pixabay.com/sound-effects): Pixabay Content License, free to use, no credit needed.
- **Freesound.org** with the **CC0** licence filter: CC0, no credit needed. Files under CC-BY need a credit line with the author's name.
- **YouTube Audio Library** (YouTube Studio > Audio Library): free for YouTube videos; some tracks need a credit line, shown next to the track.
- **Kevin MacLeod / incompetech.com**: CC-BY 4.0, put the credit he asks for in your video description.

Check the licence of each file before you use it, keep a `credits.txt` in each film's folder (file, source, licence, credit line), and never use music ripped from other videos.

## 1. One-time setup (5 minutes)

1. Put your sound effects in one folder and your music in another. Use only files you have a licence for (your own purchases, a subscription library, or free libraries whose licence allows YouTube use). The kit ships **no** sound or music files.
2. Copy `templates/sound_kit/sound_config.example.json` to `templates/sound_kit/sound_config.json` and write your two folders in it:
   ```json
   { "sfx_dirs": ["D:/Sounds/SFX"], "music_dirs": ["D:/Sounds/MUSIC"], "target_lufs": -16.0, "true_peak_max": -1.0 }
   ```
   You can list several folders. Forward slashes work on Windows.
3. Build the index (once, and again when you add sounds):
   ```
   python templates/sound_kit/index_library.py --dur
   ```
4. Try a search:
   ```
   python templates/sound_kit/find_sound.py glass break
   python templates/sound_kit/find_sound.py --music comedy piano
   ```

No library? The kit can still make sound in code (`templates/audio/`: synthesized effects and a composed theme). The rules say: library first, a synthesized sound only when the library has nothing, and it is named "synthesized" in the cue sheet.

## 2. What Claude does for each film (step 12 of the order of work)

The `sound-designer` agent runs these steps after the picture is locked. You do not have to type them; they are here so you know what happens and can check it.

| Step | What happens | Command |
|---|---|---|
| 1. Events from the plan | The plan check bakes `out/plan/sound_events.json`: every action, hit and effect with its second, tied to the words. | `python tools/film_plan.py check episodes/<name>/film.json` |
| 2. First cue list | One cue per event, plus one ambience bed and the three music sections, written to `episodes/<name>/sound/cues.json`. | `python templates/sound_kit/start_cues.py episodes/<name>` |
| 3. Pick the clips | For every cue key, the designer searches the index and writes a unique part of the file name into `cues.json` "clips" (with options: start, dur, rate, lp, hp, fade, sync). | `find_sound.py <words>` |
| 4. Pick the ONE theme | One melody per film: stated under the hook, changed at the low point (darker, slower or filtered), back in full at the end with its last chord on the payoff word (CB_RULES section 6). Sections are set in `cues.json` "music": `film_s` (where it plays in the film) and `src_s` (where it starts in the track). | `find_sound.py --music <mood>` |
| 5. Power moments | Each power moment in the plan gets a "power" entry (impact frame, hold): music and beds drop out over the hold and slam back on the impact frame, with a riser before and a hit on the `hit` bus. | edit `cues.json` |
| 6. Mix and measure | Voice ride, music ducked under speech and lifted in the gaps, keyed limiter so effects never cover words, beds cross-faded per place, master to the target, true-peak limit, loop check. | `python templates/sound_kit/mix.py episodes/<name> v1` |
| 7. Retime, not rebuild | After a picture change, move the cue's `frame` in `cues.json` (or a whole stretch with `"shift": {"s3": 6}`) and run the mix again. Clips are cached in `sound/clips/`. | `mix.py ... v2` |

What you get in `episodes/<name>/sound/`: `mix_v1.wav` (the film's exact length, 48 kHz stereo), `mix_v1_preview.mp3` (to listen on your phone), `mix_report.md` (every gate, every cue and its source file), `out/stems/` (voice, music, sfx, ambience separately) and `out/measure.json`.

## 3. The gates (the mix fails if one fails)

| Gate | Target |
|---|---|
| Integrated loudness | the target in sound_config.json (the rules say about -16 LUFS; Rick's films measure about -14) |
| True peak | at most -1 dBTP |
| Voice on top | voice at least 12 dB over the music and 8 dB over effects and beds while speaking |
| No buried words | at most 8 % of the half-second speech windows have the voice under 6 dB above everything else |
| Loop | the last frame flows into frame 0 without a click (sound too) |

Also checked by the sound designer: every picture-plan row with an action has a cue within 2 frames of its word; every power moment has its hit on the impact frame; the voice is never trimmed or re-timed.

## 4. Rules that apply (from CB_RULES)

- A sound on EVERY action and every visual effect; footsteps on walks, contact sounds when hands press or things land.
- Ambience fits the place and the weather (wind, rain, crowd, birds, night insects).
- ONE memorable melody per film, following the story (stated, changed at the low point, returned at the end).
- The story must still read with the sound off; the sound makes it feel better, it never explains.
- Camera shakes only on a hit, and every shake has its sound on the same frame.
- Sound comes before the grade; the grade is the last picture step.

## 5. Common problems

| What you see | What to do |
|---|---|
| `No sound_config.json yet` | Step 1.2 above. |
| `not in the sfx library: 'xyz'` | The file-name fragment in "clips" matches nothing: search again with `find_sound.py` and copy a unique part of the name. |
| `NO MUSIC` in the log | Set `music.theme` in cues.json to part of a music file name. |
| Voice-on-top FAIL | Lower the loud cues (their `db`) or raise `music_under_db` (more negative) in cues.json. |
| Loudness FAIL by a lot | A cue far too loud is pushing the limiter: look at the worst windows in mix_report.md. |
| `ffmpeg` not found | Install ffmpeg (INSTALL.md) and reopen the terminal. |
