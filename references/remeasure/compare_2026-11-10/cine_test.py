import subprocess, json, os, sys
R = r"<skill folder>"; PY = sys.executable; C = os.path.join(R, r"references\remeasure\compare_2026-11-10"); S = os.path.join(C, "cine_test_status.json"); st = {}
jobs = [("ours", [os.path.join(R, r"episodes\baboon-signalman\out\final\v1\baboon_signalman_v1.mp4")]), ("railroads", [os.path.join(C, "frames", "railroads")]), ("pink", [os.path.join(C, "frames", "pink"), "--interior"])]
for n, a in jobs:
    st[n] = "running"; json.dump(st, open(S, "w"))
    p = subprocess.run([PY, os.path.join(R, "tools", "measure", "cine_look.py")] + a + ["--out", os.path.join(C, "cine_look_" + n)], capture_output=True, text=True)
    st[n] = dict(code=p.returncode, out=(p.stdout + p.stderr)[-3500:]); json.dump(st, open(S, "w"))
st["done"] = True; json.dump(st, open(S, "w"))
