"""Whole-film DRAFT (the one gate, rough): the S1 hook clip + every stretch's board key frames held until the next one,
with the approved voice and Rick-style captions, at 540x960. Not a render: a picture of where the film stands.
python episodes/yellow-fire-trucks/draft/make_draft.py [out.mp4]"""
import json, glob, os, re, subprocess, sys
from PIL import Image, ImageDraw, ImageFont

EP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W, H, FPS, N = 540, 960, 30, 1898
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(EP, "draft", "FILM_DRAFT_v1.mp4")
HAS_CAPTIONS = {"S8"}   # stretches whose key frames were rendered with captions
STRETCH = [("S1", 0, 288), ("S2", 288, 474), ("S3", 474, 770), ("S4", 770, 969), ("S5", 969, 1202),
           ("S6", 1202, 1576), ("S7", 1576, 1754), ("S8", 1754, 1898)]
FONT = ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf", round(H * 0.039))
SMALL = ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf", 16)

# key frames per stretch
keys = {}
for name, a, b in STRETCH[1:]:
    fs = sorted(int(re.search(r"f_(\d+)", p).group(1)) for p in glob.glob(os.path.join(EP, name.lower(), "key", "f_*.png")))
    keys[name] = [f for f in fs if a - 30 <= f <= b + 30]
cache = {}
def still(name, f):
    k = (name, f)
    if k not in cache:
        cache.clear() if len(cache) > 6 else None
        cache[k] = Image.open(os.path.join(EP, name.lower(), "key", "f_%05d.png" % f)).convert("RGB").resize((W, H), Image.LANCZOS)
    return cache[k]

# S1 frames from the hook clip (already captioned)
s1 = subprocess.run(["ffmpeg", "-v", "error", "-i", os.path.join(EP, "s1", "S1_hook.mp4"), "-vf", f"scale={W}:{H}",
                     "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True, check=True).stdout
s1n = len(s1) // (W * H * 3)

# captions: one word, or two when the first has 3 letters or fewer (CB_RULES 9)
words = json.load(open(os.path.join(EP, "voice", "words.json")))
groups, i = [], 0
while i < len(words):
    w = words[i]; txt = w["w"].lower(); e = w["e"]; j = i + 1
    if len(re.sub(r"[^a-z]", "", txt)) <= 3 and j < len(words): txt += " " + words[j]["w"].lower(); e = words[j]["e"]; j += 1
    groups.append((w["s"], e, txt)); i = j
def caption_at(t):
    for s, e, txt in groups:
        if s <= t < e + 0.08: return txt
    return None

def stretch_of(f):
    for name, a, b in STRETCH:
        if a <= f < b: return name
    return "S8"

ff = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                       "-i", os.path.join(EP, "voice", "voice.wav"), "-c:v", "libx264", "-crf", "20", "-pix_fmt", "yuv420p",
                       "-c:a", "aac", "-b:a", "160k", "-shortest", OUT], stdin=subprocess.PIPE)
for f in range(N):
    name = stretch_of(f)
    if name == "S1" and f < s1n:
        img = Image.frombytes("RGB", (W, H), s1[f * W * H * 3:(f + 1) * W * H * 3]); cap = None
    else:
        ks = keys.get(name) or []
        if not ks: img = Image.new("RGB", (W, H), (40, 30, 60))
        else:
            k = max([x for x in ks if x <= f] or [ks[0]])
            img = still(name, k).copy()
        cap = None if name in HAS_CAPTIONS else caption_at(f / FPS)
    d = ImageDraw.Draw(img)
    if cap:
        d.text((W / 2, H * 0.715), cap, font=FONT, fill="white", anchor="ms", stroke_width=2, stroke_fill="black")
    d.text((10, 10), f"BROUILLON  {name}" + ("  (images clés)" if name != "S1" else "  (clip)"), font=SMALL, fill="white", stroke_width=2, stroke_fill="black")
    ff.stdin.write(img.tobytes())
ff.stdin.close(); ff.wait()
print("wrote", OUT, "frames", N, "key frames", {k: len(v) for k, v in keys.items()})
