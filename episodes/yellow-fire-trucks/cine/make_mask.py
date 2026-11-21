"""make_mask.py: the CAST mask of a key frame, drawn exactly from the kit dump (each card's picture alpha warped to its screen corners).
Replaces the Object Index pass, which turned noisy where the lemon mist volume sits in front of a card's clear area.
usage: python make_mask.py dump.json cards_dir W H out.png"""
import json, sys, os
import numpy as np, cv2
from PIL import Image
d = json.load(open(sys.argv[1])); cdir = sys.argv[2]; W, H = int(sys.argv[3]), int(sys.argv[4])
M = np.array(d['cam']['m'], np.float64).reshape(4, 4).T; V = np.linalg.inv(M); t = np.tan(np.radians(d['cam']['fov']) / 2); asp = W / H
def proj(p):
    q = V @ np.array([p[0], p[1], p[2], 1.]); x = q[0] / -q[2] / (t * asp); y = q[1] / -q[2] / t
    return [(x + 1) / 2 * W, (1 - y) / 2 * H]
mask = np.zeros((H, W), np.float32)
for who, c in d['cards'].items():
    a = np.asarray(Image.open(os.path.join(cdir, who + '.png')).convert('RGBA'))[..., 3].astype(np.float32) / 255; h, w = a.shape
    src = np.float32([[u * w, (1 - v) * h] for u, v in c['uvs'][:4]]); dst = np.float32([proj(p) for p in c['corners'][:4]])
    T = cv2.getPerspectiveTransform(src, dst); m = cv2.warpPerspective(a, T, (W, H), flags=cv2.INTER_AREA if w > W else cv2.INTER_LINEAR)
    mask = np.maximum(mask, m)
Image.fromarray((np.clip(mask, 0, 1) * 65535).astype(np.uint16)).save(sys.argv[5]); print('MASK', sys.argv[5], W, H, 'cover %.3f' % (mask > .5).mean())
