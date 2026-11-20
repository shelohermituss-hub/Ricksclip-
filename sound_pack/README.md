# Ricks Clips Sound Pack V1.2 (free starter pack)

A starter library of sound effects and music for cartoon true-story Shorts. Every file has a licence that lets you use it in your videos, including monetised ones. See `LICENSES.md`.

## What is inside

| Folder | Files | What it is |
|---|---|---|
| `sfx/impact` | 117 | wood, metal, glass, plate, punch, soft and bell hits, sci-fi metal hits and crunch explosions |
| `sfx/footsteps` | 35 | concrete, wood, grass, snow, carpet and leather steps |
| `sfx/whoosh_swish` | 43 | card slides, cloth swishes, UI minimise/maximise swooshes (short swishes; there are no long air whooshes) |
| `sfx/ui_click` | 129 | clicks, switches, toggles, ticks, errors, confirm pops |
| `sfx/coins_cards` | 43 | coins, casino chips, dice, card shuffles |
| `sfx/foley_rpg` | 34 | doors, creaks, books, knives, pots, latches |
| `sfx/digital` | 63 | power-ups, zaps, lasers, retro tones |
| `sfx/scifi` | 61 | engines, thrusters, force fields, lasers, computer noise, slime |
| `sfx/jingles_stingers` | 86 | short pizzicato, sax, steel drum, 8-bit and hit stingers for reveals and endings |
| `music/comedy_pizzicato` | 3 | Fluffing a Duck, Monkeys Spinning Monkeys, Sneaky Snitch |
| `music/mystery` | 3 | Investigations, Sneaky Adventure, Marty Gots a Plan |
| `music/tension` | 2 | Dances and Dames, Danger Storm |
| `music/suspense` | 2 | Hidden Agenda, Scheming Weasel (slower version) |
| `music/circus_quirky` | 2 | Spazzmatica Polka, Comic Plodding |
| `music/warm_ending` | 2 | Carefree, Easy Lemon |

Sound effects are Kenney's original `.ogg` files. Each name is `kenney-<pack>__<original name>.ogg`. Music is Kevin MacLeod's `.mp3`, named `Kevin MacLeod - <title>.mp3`.

## Use it with the kit

1. Unzip this folder somewhere that will stay put, for example `C:/Users/<you>/Music/RicksClips_SoundPack_V1.2`.
2. In the skill folder, copy `templates/sound_kit/sound_config.example.json` to `templates/sound_kit/sound_config.json`.
3. Open `sound_config.json` and put the pack's two folders in it (forward slashes work on Windows):

   ```json
   {
     "sfx_dirs": ["C:/Users/<you>/Music/RicksClips_SoundPack_V1.2/sfx"],
     "music_dirs": ["C:/Users/<you>/Music/RicksClips_SoundPack_V1.2/music"],
     "target_lufs": -16.0,
     "true_peak_max": -1.0
   }
   ```

   If you already have your own folders in there, add the pack folders to the lists. Don't replace yours.
4. Build the index (run it again whenever you add sounds):

   ```
   python templates/sound_kit/index_library.py --dur
   ```

5. Search it:

   ```
   python templates/sound_kit/find_sound.py impact wood
   python templates/sound_kit/find_sound.py whoosh
   python templates/sound_kit/find_sound.py --music mystery
   ```

   Folder names are searchable words, so `impact`, `whoosh`, `click`, `coins`, `mystery`, `tension` and `warm` all work.

## Credit the music (required)

The music is CC BY 4.0. When a track is in your video, paste its line from `CREDITS.txt` into the YouTube description, for example:

```
"Fluffing a Duck" Kevin MacLeod (incompetech.com) Licensed under Creative Commons: By Attribution 4.0 License http://creativecommons.org/licenses/by/4.0/
```

The sound effects are CC0, so no credit is needed for them. A thank-you to Kenney (www.kenney.nl) is welcome.

## Sources

- Sound effects: Kenney, https://kenney.nl/assets (Audio category), CC0
- Music: Kevin MacLeod, https://incompetech.com, CC BY 4.0
