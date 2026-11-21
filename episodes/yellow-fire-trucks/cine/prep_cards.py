"""prep_cards.py: writes each visible cast card of a kit dump as a PNG for Blender, with the pale inner rim on the lit edge.
usage: python prep_cards.py dump_A.json A_cards left|right [rim_px]
The rim is a pale warm line along the silhouette on the sun side; face and hand pixels (near white) never get it (no coloured rim on faces)."""
import json, sys, os, base64, io
import numpy as np
from PIL import Image
from scipy import ndimage

d = json.load(open(sys.argv[1])); od = sys.argv[2]; side = sys.argv[3]; rim_px = int(sys.argv[4]) if len(sys.argv) > 4 else 0
os.makedirs(od, exist_ok=True); RIM = np.array([255, 241, 214], np.float32)
for who, c in d['cards'].items():
    im = Image.open(io.BytesIO(base64.b64decode(c['png'].split(',')[1]))).convert('RGBA'); a = np.asarray(im).astype(np.float32)
    k = rim_px or max(2, im.width // 260)
    A = a[..., 3] / 255
    sh = np.zeros_like(A)
    if side == 'left': sh[:, k:] = A[:, :-k]
    else: sh[:, :-k] = A[:, k:]
    rim = np.clip(A - sh, 0, 1)
    rim = ndimage.gaussian_filter(rim, k * .35)
    rgb = a[..., :3]; mx, mn = rgb.max(-1), rgb.min(-1)
    face = (mn > 200) & (mx - mn < 40)
    face = ndimage.binary_dilation(face, iterations=k + 1)
    w = rim * (~face) * .55
    a[..., :3] = rgb * (1 - w[..., None]) + RIM * w[..., None]
    Image.fromarray(a.clip(0, 255).astype(np.uint8)).save(os.path.join(od, who + '.png'))
    print('CARD', who, im.size, 'rim px', k, 'rim pixels', int((w > .05).sum()))
