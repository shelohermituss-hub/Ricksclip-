"""Instrument check for heads.py: synthetic heads with KNOWN outline width, ink and eye spacing,
drawn at 4x and downsampled (anti-aliased like a real encode), then measured by heads_in()."""
import sys, os, json, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from PIL import Image, ImageDraw, ImageFilter
import heads
out = {}
os.makedirs("out/calib", exist_ok=True)
for W in (90, 160, 300):
    for ow in (0.04, 0.05, 0.07):
        S = 4; img = Image.new("RGB", (720 * S, 1280 * S), (90, 140, 200)); d = ImageDraw.Draw(img)
        cx, cy = 360 * S, 400 * S; a = W * S / 2; b = 0.93 * a; o = ow * W * S
        d.ellipse([cx - a - o, cy - b - o, cx + a + o, cy + b + o], fill=(35, 20, 38))
        d.ellipse([cx - a, cy - b, cx + a, cy + b], fill=(250, 245, 240))
        for ex in (-0.13, 0.13):
            r = 0.05 * W * S; d.ellipse([cx + ex * W * S - r, cy - 0.05 * W * S - r, cx + ex * W * S + r, cy - 0.05 * W * S + r], fill=(35, 20, 38))
        img = img.resize((720, 1280), Image.LANCZOS).filter(ImageFilter.GaussianBlur(0.5))
        p = f"out/calib/W{W}_o{ow}.png"; img.save(p)
        h = heads.heads_in(p)
        r = h[0] if h else {}
        out[f"W{W} outline {ow}"] = {k: r.get(k) for k in ("H_over_W", "outline_w_over_W", "ink_rgb", "eye_spacing_over_W", "thickest_angle_deg")}
        print(f"W{W} true outline {ow} H/W 0.93 eyes 0.26 ->", out[f"W{W} outline {ow}"])
json.dump(out, open("data/heads_calibrate.json", "w"), indent=1)
