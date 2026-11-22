"""sheet.py <dir> <out.jpg> [w]: frames in <dir> side by side with their frame numbers (key-frame sheets)."""
import sys, os
from PIL import Image, ImageDraw
d, out = sys.argv[1], sys.argv[2]; w = int(sys.argv[3]) if len(sys.argv) > 3 else 260
fs = sorted(f for f in os.listdir(d) if f.endswith('.png')); ims = [Image.open(os.path.join(d, f)).convert('RGB') for f in fs]
h = int(ims[0].height * w / ims[0].width); S = Image.new('RGB', (w * len(ims), h + 16), 'white'); D = ImageDraw.Draw(S)
for i, (f, im) in enumerate(zip(fs, ims)): S.paste(im.resize((w, h)), (i * w, 16)); D.text((i * w + 3, 2), f[2:7] + '  %.2fs' % (int(f[2:7]) / 30), fill='black')
S.save(out, quality=88); print(out, S.size)
