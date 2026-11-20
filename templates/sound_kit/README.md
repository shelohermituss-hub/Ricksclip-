# Sound kit: music bed, sound effects, mix

The full guide is `SOUND_AND_MUSIC.md` in the skill root. Short version:

| File | What it does |
|---|---|
| `sound_config.example.json` | Copy to `sound_config.json`; your SFX and music folders and the loudness target |
| `index_library.py` | Walks your folders, writes `library_index.csv` (run again after adding sounds) |
| `find_sound.py` | Search the index: `find_sound.py door slam`, `find_sound.py --music comedy` |
| `start_cues.py` | Writes a film's first `sound/cues.json` from `out/plan/sound_events.json` |
| `mix.py` | The mix: voice + one music theme in sections + SFX + ambience beds + power hits; masters, measures, writes a report; exit 1 if a gate fails |
| `soundlib.py` | Shared helpers (decode, find, cut a clip with cache) |

`cues.json` is the one table of a film's sound: `fps`, `frames`, `clips` (key -> file-name fragment + options), `cues` (frame, clip, db, pan, bus, why), `beds` (frame, place, layers), `music` (theme, sections, end fade, lifts), `power` (frame, hold), optional `shift` per stretch. Retime there and run `mix.py` again.

Needs Python with numpy, scipy and soundfile, and ffmpeg on the PATH. Made from the mix scripts of the delivered films (traffic lights, braking lines), with every personal path taken out.
