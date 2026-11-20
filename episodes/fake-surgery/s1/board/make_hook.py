# THE HOOK MOVING: film frames 0-329 (0.00-11.00 s: rows 1-9 with the owner's quote, and the hard cut to morning on "The story") from board/all (GPU,
# full size, kit captions) + voice/voice.wav cut to the same span (0.12 s fade at the end). Also the 4 fps strip (max 1600 px wide). Pattern: monopoly-escape/s1/board/make_hook.py
import subprocess, os
from PIL import Image, ImageDraw
B = 'board'; N = 375
assert all(os.path.exists(os.path.join(B, 'all', 'f_%05d.png' % f)) for f in range(N)), 'frames missing'
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-framerate', '30', '-start_number', '0', '-i', os.path.join(B, 'all', 'f_%05d.png'), '-i', 'voice/voice.wav', '-map', '0:v:0', '-map', '1:a:0', '-frames:v', str(N),
  '-c:a', 'aac', '-af', 'apad,afade=t=out:st=%.2f:d=0.12' % (N / 30 - .12), '-shortest', '-vf', 'scale=1080:1920:flags=lanczos', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-r', '30', os.path.join(B, 'hook_moving.mp4')], check=True)
fs = list(range(0, N, 8)); cw, chh = 100, 178; cols = 16; rows = (len(fs) + cols - 1) // cols
S = Image.new('RGB', (cols * cw, rows * (chh + 14)), (14, 14, 20)); d = ImageDraw.Draw(S)
for i, f in enumerate(fs): S.paste(Image.open(os.path.join(B, 'all', 'f_%05d.png' % f)).resize((cw, chh)), ((i % cols) * cw, (i // cols) * (chh + 14))); d.text(((i % cols) * cw + 2, (i // cols) * (chh + 14) + chh), 'f%d %.2fs' % (f, f / 30), fill=(255, 224, 110))
S.save(os.path.join(B, 'hook_strip.jpg'), quality=85); print('hook_moving.mp4 + hook_strip.jpg', S.size)
