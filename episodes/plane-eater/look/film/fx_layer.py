"""fx_layer.py (system python, PIL): 2D effect layers of the kit that the Blender frame lacks, drawn UNDER the cast cards (cast mask kept on top).
  apply(final_rgb_path, mask_path, fxjson, frame) -> rewrites final. Kinds: 'focus' = POWER impact frame (napkin-red #d62828 field, white focus lines;
  two_tone swaps the colours), the world replaced, the cards kept."""
import json, math, random, os
import numpy as np
from PIL import Image, ImageDraw

def draw_focus(W, H, c, two_tone, seed):
    bg, fg = ((255, 255, 255), (214, 40, 40)) if two_tone else ((214, 40, 40), (255, 255, 255))
    im = Image.new('RGB', (W, H), bg); dr = ImageDraw.Draw(im); cx, cy = c[0] * W, c[1] * H; rnd = random.Random(seed); k = W / 1080
    for i in range(56):
        a = i / 56 * 2 * math.pi + rnd.uniform(-.03, .03); r0 = rnd.uniform(260, 420) * k; w = rnd.uniform(.012, .03)
        dr.polygon([(cx + math.cos(a - w) * r0, cy + math.sin(a - w) * r0), (cx + math.cos(a) * 3000 * k, cy + math.sin(a) * 3000 * k), (cx + math.cos(a + w) * r0, cy + math.sin(a + w) * r0)], fill=fg)
    return im

def apply(final, mask, fxjson, f):
    if not os.path.exists(fxjson): return False
    fx = json.load(open(fxjson)).get(str(f))
    if not fx: return False
    im = Image.open(final).convert('RGB'); W, H = im.size
    m = np.asarray(Image.open(mask).convert('L').resize((W, H), Image.BILINEAR), dtype=np.float32)[..., None] / 255.
    bg = np.asarray(draw_focus(W, H, fx['c'], fx.get('two_tone'), f), dtype=np.float32)
    out = np.asarray(im, dtype=np.float32) * m + bg * (1 - m); Image.fromarray(out.clip(0, 255).astype(np.uint8)).save(final); return True
