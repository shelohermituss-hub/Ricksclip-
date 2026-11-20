# hookA: numbers of a frame. python measure.py <png> : mean HSV saturation, mean brightness (0-1), share of near-black pixels, per-third saturation.
import sys, numpy as np
from PIL import Image
im = Image.open(sys.argv[1]).convert('RGB'); a = np.asarray(im).astype(np.float32) / 255
mx, mn = a.max(2), a.min(2); sat = np.where(mx > 1e-4, (mx - mn) / np.maximum(mx, 1e-4), 0); lum = (a * [0.2126, 0.7152, 0.0722]).sum(2)
h = a.shape[0]
print('size', im.size, 'saturation %.3f' % sat.mean(), 'brightness %.3f' % lum.mean(), 'black<0.03 %.2f%%' % (100 * (mx < .03).mean()),
      'sat top/mid/low %.2f %.2f %.2f' % (sat[:h // 3].mean(), sat[h // 3:2 * h // 3].mean(), sat[2 * h // 3:].mean()))
