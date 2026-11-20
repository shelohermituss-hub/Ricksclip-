import sys, os, glob
from PIL import Image, ImageDraw
d = sys.argv[1]; out = sys.argv[2]; fs = sorted(glob.glob(os.path.join(d, 'f_*.png'))); w, h = 216, 384; cols = 7
S = Image.new('RGB', (w * cols, (h + 14) * ((len(fs) + cols - 1) // cols)), (14, 14, 20)); D = ImageDraw.Draw(S)
for i, p in enumerate(fs):
    x, y = (i % cols) * w, (i // cols) * (h + 14); S.paste(Image.open(p).convert('RGB').resize((w, h)), (x, y)); D.text((x + 3, y + h + 1), os.path.basename(p), fill=(255, 224, 110))
S.save(out, quality=82)
