# tex_cabin.py: PIL textures for the airliner cabin (set-builder 2026-11-21). python3 tex_cabin.py <out tex dir>
#   carpet.png (grey-blue with a small diamond pattern, 0.5 m), fabric.png (deep blue #1f4fa0 weave with a fine dot pattern, 0.25 m),
#   sky.png (deep blue above the clouds: zenith #0f79e8 -> low #1a86f2 -> pale at the horizon), card.png (the SAFETY card in the seat pocket)
import sys, os, random
from PIL import Image, ImageDraw, ImageFilter, ImageFont
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True); R = random.Random(35)
def font(sz):
    try: return ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', sz)
    except Exception: return ImageFont.load_default()
im = Image.new('RGB', (512, 512), (78, 92, 122)); d = ImageDraw.Draw(im)
for k in range(9000):
    x, y = R.randint(0, 511), R.randint(0, 511); c = R.randint(-14, 14); d.point((x, y), fill=(78 + c, 92 + c, 122 + c))
for i in range(8):
    for j in range(8):
        cx, cy = i * 64 + 32, j * 64 + 32; d.polygon([(cx, cy - 9), (cx + 9, cy), (cx, cy + 9), (cx - 9, cy)], fill=(150, 160, 190) if (i + j) % 2 else (60, 70, 100))
im.filter(ImageFilter.GaussianBlur(.7)).save(os.path.join(OUT, 'carpet.png'))
im = Image.new('RGB', (256, 256), (31, 79, 160)); d = ImageDraw.Draw(im)
for y in range(0, 256, 2): d.line([(0, y), (256, y)], fill=(27, 70, 146))
for x in range(0, 256, 4): d.line([(x, 0), (x, 256)], fill=(36, 88, 172))
for i in range(8):
    for j in range(8): d.ellipse([i * 32 + 14, j * 32 + 14, i * 32 + 18, j * 32 + 18], fill=(70, 120, 200))
im.save(os.path.join(OUT, 'fabric.png'))
im = Image.new('RGB', (64, 512)); d = ImageDraw.Draw(im)
def mix(a, b, t): return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))
for y in range(512):
    t = y / 511
    c = mix((15, 121, 232), (26, 134, 242), min(1, t / .45)) if t < .45 else mix((26, 134, 242), (120, 175, 235), min(1, (t - .45) / .1)) if t < .55 else (110, 160, 220)
    d.line([(0, y), (64, y)], fill=c)
im.save(os.path.join(OUT, 'sky.png'))
im = Image.new('RGB', (300, 440), (245, 243, 232)); d = ImageDraw.Draw(im)
d.rectangle([0, 0, 300, 70], fill=(31, 79, 160)); d.text((40, 16), 'SAFETY', font=font(40), fill=(255, 255, 255))
for k in range(6):
    x, y = 20 + (k % 2) * 140, 90 + (k // 2) * 115; d.rectangle([x, y, x + 120, y + 100], outline=(80, 80, 90), width=3)
    d.ellipse([x + 40, y + 15, x + 80, y + 55], outline=(80, 80, 90), width=3); d.line([(x + 60, y + 55), (x + 60, y + 90)], fill=(80, 80, 90), width=3)
im.save(os.path.join(OUT, 'card.png')); print('TEX_CABIN ok')
