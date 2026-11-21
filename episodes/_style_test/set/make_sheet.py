# compose SET_SHEET.jpg: key (540x960) left, overview (1000x562) right top, labels; width <= 1600
import sys, os
from PIL import Image, ImageDraw
d = sys.argv[1]
k = Image.open(os.path.join(d, "key.png")).convert("RGB")
o = Image.open(os.path.join(d, "overview.png")).convert("RGB")
W = k.width + 20 + o.width
im = Image.new("RGB", (W, max(k.height, o.height) + 40), (30, 30, 34))
im.paste(k, (0, 40)); im.paste(o, (k.width + 20, 40))
dr = ImageDraw.Draw(im)
dr.text((8, 12), "SET _style_test: LAYOUT camera (0.35, 2.6, 1.0), 26 mm, Cycles 16 spp, preview sun only (no props/cast)", fill=(240, 240, 240))
dr.text((k.width + 28, o.height + 50), "overview from the street corner, 24 mm", fill=(240, 240, 240))
im.save(os.path.join(os.path.dirname(d.rstrip('/')), "SET_SHEET.jpg"), quality=90)
print("SHEET", im.size)
