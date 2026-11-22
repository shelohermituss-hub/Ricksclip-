"""sheet.py <dir> [out]: contact sheet of the PNG stills in <dir> (half of half size), labelled with the frame number."""
import sys, glob, os
from PIL import Image, ImageDraw
d = sys.argv[1]; out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(d, 'sheet.jpg')
fs = sorted(glob.glob(os.path.join(d, 'f_*.png'))); ims = [Image.open(f).convert('RGB') for f in fs]; w, h = ims[0].size; W, H = w // 2, h // 2; cols = min(7, len(ims))
S = Image.new('RGB', (W * cols, (H + 16) * ((len(ims) + cols - 1) // cols)), 'white'); dr = ImageDraw.Draw(S)
for i, (im, f) in enumerate(zip(ims, fs)): x, y = (i % cols) * W, (i // cols) * (H + 16); S.paste(im.resize((W, H)), (x, y + 16)); dr.text((x + 3, y + 2), os.path.basename(f)[2:-4], fill='black')
S.save(out, quality=85); print(out)
