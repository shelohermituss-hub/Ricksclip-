"""Download a stretch's frames from the pod (8 at once), resumable: python tools/runpod/pull_frames.py <job> <first> <last> <local_out_dir>
Per frame: f_####_raw.png, f_####_/pass_mask.png, f_####_lines_id.png. Prints the count of missing files at the end (0 = complete)."""
import json, os, sys, urllib.request
from concurrent.futures import ThreadPoolExecutor
C = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".pod.json")))
job, f0, f1, out = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4]
def get(rel):
    dst = os.path.join(out, rel)
    if os.path.exists(dst) and os.path.getsize(dst) > 0: return 0
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    for _ in range(4):
        try:
            r = urllib.request.Request(C["url"] + "/get/%s/out/%s" % (job, rel), headers={"X-Token": C["token"], "User-Agent": "ricksclips-pod-client/1.0"})
            b = urllib.request.urlopen(r, timeout=120).read()
            if b: open(dst + ".part", "wb").write(b); os.replace(dst + ".part", dst); return 0
        except Exception as e: err = e
    print("FAILED", rel, err); return 1
rels = [p % f for f in range(f0, f1 + 1) for p in ("f_%04d_raw.png", "f_%04d_/pass_mask.png", "f_%04d_lines_id.png")]
with ThreadPoolExecutor(8) as ex: bad = sum(ex.map(get, rels))
print("pulled", job, len(rels) - bad, "of", len(rels), "missing", bad)
