# Install (about 15 minutes, once)

You do not need to code. You install a few free programs, run four lines, and then you talk to Claude.

## 1. What you need
| Thing | Why |
|---|---|
| A Windows PC (Mac and Linux work for most steps) | Everything runs on your own machine |
| A graphics card (any recent one; 8 GB is comfortable) | The film kit renders the final frames on it |
| Claude Code with a paid Claude plan (Max recommended for full films) | Claude does the work |
| A voice: Fish Audio, another text-to-speech tool, or your own microphone | The narration |
| About 10-20 GB free disk space per film while it is being made | Frames; Claude deletes them after the final |

## 2. Install the programs (default options)
1. **Claude Code**: the Claude desktop app (Code tab) or the `claude` command line.
2. **Python 3.10 or newer** (python.org). On Windows tick **"Add python.exe to PATH"**.
3. **Node.js LTS 18 or newer** (nodejs.org).
4. **ffmpeg**: Windows `winget install Gyan.FFmpeg`, Mac `brew install ffmpeg`. Close and reopen the terminal afterwards.

## 3. Unzip
Unzip `RicksClips_Animation_Skill_V1.2.zip` to a folder with lots of free space, for example `C:\Users\<you>\Documents\RicksClips_Animation_Skill_V1.2`. Not inside OneDrive or another synced folder: a film writes thousands of files.

Coming from V1.1? Unzip into a NEW folder and copy your `episodes/` folder across. Keep V1.1 until your V1.1 films are finished.

## 4. Install the parts (in a terminal opened in the skill folder)
Windows: open the folder, click the address bar, type `cmd`, press Enter. Then run, one line at a time:
```
pip install numpy pillow scipy soundfile opencv-python faster-whisper
cd templates\threejs_film && npm install && npx playwright install chromium && cd ..\..
python tools\install.py
```
The last line installs the skill and its 17 helpers into your `.claude` folder, makes the rule slices, and checks the PC. It ends with **"All needed parts are there."** A line marked `MISS` tells you what to install; do it and run `python tools\install.py` again. Lines marked `opt` are optional.

## 5. Test
```
python tools\film_plan.py check templates\film_example\film.json
node templates\threejs_film\render.mjs templates\film_example\film.json --storyboard
```
The first line ends with a RESULT line and 0 FAIL. The second writes a storyboard page in `templates\film_example\out\`. Open it in your browser.

## 6. Sound library (optional, 5 minutes)
Copy `templates\sound_kit\sound_config.example.json` to `sound_config.json`, write your own sound-effect and music folders in it, then:
```
python templates\sound_kit\index_library.py --dur
```
Details: `SOUND_AND_MUSIC.md`.

## 7. Your first film
Open Claude Code in the skill folder and paste `START_FILM_PROMPT.md` (filled in). Claude starts with "Skill checked, up to date", then shows you the prop list and the look card to OK, then the hook moving, then the whole rough film.

## Common problems
| What you see | What to do |
|---|---|
| `python` or `node` "is not recognized" | Close and reopen the terminal. If it stays, reinstall and tick "Add to PATH" |
| `Cannot find module 'playwright'` | Run `npm install` inside `templates\threejs_film`, then `npx playwright install chromium` |
| `Executable doesn't exist` (Chromium) | `npx playwright install chromium` inside `templates\threejs_film` |
| Claude does not know the skill | Run `python tools\install.py` again and restart Claude Code. Start with "Use the cartoon-3d-short skill" |
| You moved the skill folder | Run `python tools\install.py` again |
| The plan check shows FAIL lines | Normal while a film is planned: every FAIL prints its fix and Claude repairs them |
| `ffmpeg` not found | Install ffmpeg (step 2) and reopen the terminal |
