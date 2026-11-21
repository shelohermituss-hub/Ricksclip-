"""Client for the RunPod GPU job server (tools/runpod/pod_server.py). The pod address and token live in tools/runpod/.pod.json
(git-ignored, written by the lead): {"url": "https://<pod>-8000.proxy.runpod.net", "token": "...", "pod_id": "..."}.
  python tools/runpod/pod.py health
  python tools/runpod/pod.py push <local_dir> <job>          # uploads every file of the folder (big ones in 50 MB parts) to /work/<job>/
  python tools/runpod/pod.py run <job>                       # starts bash render.sh in that job folder on the pod
  python tools/runpod/pod.py wait <job> [max_minutes]        # polls every 15 s until DONE: (or the job stops), prints the log tail
  python tools/runpod/pod.py get <job>/<path> <local_file>   # downloads one file
  python tools/runpod/pod.py pull <job> <local_dir> [subdir] # downloads every file the job lists in <job>/out/MANIFEST.txt (one path per line)
Before a LONG render on the pod: render one frame at 1 % first and require "DEVICE OPTIX" or "DEVICE CUDA" in the log (LECONS 2026-11-21).
"""
import json, os, sys, time, urllib.request

CFG = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".pod.json")))
URL, TOK = CFG["url"].rstrip("/"), CFG["token"]
PART = 50 * 1024 * 1024

def req(method, path, data=None, timeout=600):
    r = urllib.request.Request(URL + path, data=data, method=method, headers={"X-Token": TOK, "User-Agent": "ricksclips-pod-client/1.0"})
    with urllib.request.urlopen(r, timeout=timeout) as f:
        return f.read()

def push(local, job):
    n = 0
    for root, _, files in os.walk(local):
        for fn in files:
            p = os.path.join(root, fn); rel = os.path.relpath(p, local).replace(os.sep, "/"); size = os.path.getsize(p)
            if size <= PART:
                req("PUT", "/put/%s/%s" % (job, rel), open(p, "rb").read())
            else:
                with open(p, "rb") as f:
                    i = 0
                    while True:
                        b = f.read(PART)
                        if not b: break
                        req("PUT", "/put/%s/%s?part=%d" % (job, rel, i), b); i += 1
                req("POST", "/join/%s/%s?parts=%d" % (job, rel, i))
            n += 1; print("up", rel, size)
    print("pushed", n, "files to", job)

def wait(job, max_min=120):
    t0 = time.time()
    while time.time() - t0 < max_min * 60:
        d = json.loads(req("GET", "/status/" + job))
        if not d["running"]:
            print(d["tail"][-2500:]); print("RC", d["rc"], "DONE" if d["done"] else "NOT DONE"); return 0 if d["done"] else 1
        time.sleep(15)
    print("TIMEOUT"); return 2

if __name__ == "__main__":
    a = sys.argv[1:]
    if a[0] == "health": print(req("GET", "/health").decode())
    elif a[0] == "push": push(a[1], a[2])
    elif a[0] == "run": print(req("POST", "/run/" + a[1]).decode())
    elif a[0] == "wait": sys.exit(wait(a[1], float(a[2]) if len(a) > 2 else 120))
    elif a[0] == "get":
        os.makedirs(os.path.dirname(os.path.abspath(a[2])), exist_ok=True); open(a[2], "wb").write(req("GET", "/get/" + a[1])); print("got", a[2])
    elif a[0] == "pull":
        man = req("GET", "/get/%s/out/MANIFEST.txt" % a[1]).decode().split()
        for rel in man:
            dst = os.path.join(a[2], rel); os.makedirs(os.path.dirname(dst), exist_ok=True)
            open(dst, "wb").write(req("GET", "/get/%s/%s" % (a[1], rel))); print("got", rel)
