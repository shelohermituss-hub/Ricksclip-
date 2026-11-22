#!/usr/bin/env bash
# S2 finish after the draft frames exist: draft.mp4 with the film's voice (8.56-17.33 s), checks, KEYFRAMES.jpg, strip.
cd "$(dirname "$0")"; ROOT=../../..
ffmpeg -v error -y -framerate 30 -start_number 257 -i frames/f_%05d.png -ss 8.5667 -t 8.7667 -i voice/voice.wav -map 0:v -map 1:a -c:v libx264 -crf 20 -pix_fmt yuv420p -c:a aac -b:a 160k -shortest draft.mp4 && echo "mp4 $(ffprobe -v error -show_entries format=duration -of csv=p=0 draft.mp4) s"
python3 - <<'E'
from PIL import Image, ImageDraw
keys = [(259, 'R10 standing at the chair'), (304, 'R11 glass: oil at his nose'), (330, 'R12 jug: the glug'), (375, 'R13 pounds: needle on 2 lb'),
        (400, 'R14 wings: held up'), (422, 'R15 wheels: held up'), (445, 'R16 seats: held up'), (485, 'R17 tires: gum stretch'), (515, 'R18 doctors: belly pat')]
ims = [Image.open('frames/f_%05d.png' % f).convert('RGB') for f, _ in keys]; w, h = ims[0].size; s = 0.5; W, H = int(w * s), int(h * s)
sheet = Image.new('RGB', (W * 3, (H + 24) * 3), 'white'); d = ImageDraw.Draw(sheet)
for i, (im, (f, t)) in enumerate(zip(ims, keys)): x, y = (i % 3) * W, (i // 3) * (H + 24); sheet.paste(im.resize((W, H)), (x, y + 24)); d.text((x + 4, y + 6), 'f%d %s' % (f, t), fill='black')
sheet.save('KEYFRAMES.jpg', quality=88)
fr = list(range(257, 520, 8)); ims = [Image.open('frames/f_%05d.png' % f).convert('RGB').resize((W // 2, H // 2)) for f in fr]
cols = 11; st = Image.new('RGB', (cols * (W // 2), ((len(ims) + cols - 1) // cols) * (H // 2 + 14)), 'white'); d = ImageDraw.Draw(st)
for i, (im, f) in enumerate(zip(ims, fr)): x, y = (i % cols) * (W // 2), (i // cols) * (H // 2 + 14); st.paste(im, (x, y + 14)); d.text((x + 2, y + 1), str(f), fill='black')
st.save('S2_strip_4fps.jpg', quality=85); print('sheets ok')
E
