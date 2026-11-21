"""Tiny job server that runs ON a RunPod GPU machine (port 8000, reached through https://<pod>-8000.proxy.runpod.net).
Why HTTP and chunks: this cloud session can only speak HTTPS through its proxy (no SSH, no croc), and the RunPod proxy refuses
request bodies over about 100 MB, so big .blend files go up in pieces and are joined on the pod.
Every request must carry the header X-Token: $POD_TOKEN (set when the pod is created; the pod URL itself is public).
  GET  /health                         -> "ok blender=<version or missing>"
  PUT  /put/<path>?part=<n>            -> body saved to /work/<path>.part<n>  (no ?part = the whole file)
  POST /join/<path>?parts=<n>          -> /work/<path> = concat of the parts (then the parts are removed); prints size
  POST /run/<job>                      -> starts `bash /work/<job>/render.sh` in the background, log /work/<job>/run.log
  GET  /status/<job>                   -> JSON {running, done, tail}
  GET  /get/<path>                     -> the file
"""
import http.server, json, os, subprocess, threading, urllib.parse, shutil

ROOT = os.environ.get("POD_ROOT", "/work"); TOKEN = os.environ.get("POD_TOKEN", ""); JOBS = {}

def safe(p):
    full = os.path.realpath(os.path.join(ROOT, p.lstrip("/")))
    if not full.startswith(ROOT + "/") and full != ROOT: raise ValueError("bad path")
    return full

class H(http.server.BaseHTTPRequestHandler):
    def _ok(self, code=200, body=b"", ctype="text/plain"):
        self.send_response(code); self.send_header("Content-Type", ctype); self.send_header("Content-Length", str(len(body))); self.end_headers(); self.wfile.write(body)
    def _auth(self):
        if not TOKEN or self.headers.get("X-Token") != TOKEN: self._ok(403, b"no"); return False
        return True
    def _split(self):
        u = urllib.parse.urlparse(self.path); return u.path, dict(urllib.parse.parse_qsl(u.query))
    def do_GET(self):
        if not self._auth(): return
        path, q = self._split()
        if path == "/health":
            v = subprocess.run("blender -b --version 2>/dev/null | head -1", shell=True, capture_output=True, text=True).stdout.strip() or "missing"
            return self._ok(body=("ok blender=" + v).encode())
        if path.startswith("/status/"):
            job = path[8:]; log = safe(job + "/run.log"); t = open(log, errors="replace").read()[-3000:] if os.path.exists(log) else ""
            p = JOBS.get(job); return self._ok(body=json.dumps({"running": bool(p and p.poll() is None), "done": "DONE:" in t, "rc": p.poll() if p else None, "tail": t}).encode(), ctype="application/json")
        if path.startswith("/get/"):
            f = safe(path[5:])
            if not os.path.isfile(f): return self._ok(404, b"missing")
            return self._ok(body=open(f, "rb").read(), ctype="application/octet-stream")
        self._ok(404, b"?")
    def do_PUT(self):
        if not self._auth(): return
        path, q = self._split()
        if not path.startswith("/put/"): return self._ok(404, b"?")
        f = safe(path[5:]) + (".part%s" % q["part"] if "part" in q else ""); os.makedirs(os.path.dirname(f), exist_ok=True)
        n = int(self.headers.get("Content-Length", "0")); left = n
        with open(f, "wb") as out:
            while left > 0:
                b = self.rfile.read(min(left, 1 << 20))
                if not b: break
                out.write(b); left -= len(b)
        self._ok(body=("saved %d" % (n - left)).encode())
    def do_POST(self):
        if not self._auth(): return
        path, q = self._split()
        if path.startswith("/join/"):
            f = safe(path[6:]); n = int(q["parts"])
            with open(f, "wb") as out:
                for i in range(n):
                    with open(f + ".part%d" % i, "rb") as src: shutil.copyfileobj(src, out)
            for i in range(n): os.remove(f + ".part%d" % i)
            return self._ok(body=("joined %d" % os.path.getsize(f)).encode())
        if path.startswith("/run/"):
            job = path[5:]; d = safe(job); log = open(os.path.join(d, "run.log"), "w")
            JOBS[job] = subprocess.Popen(["bash", "render.sh"], cwd=d, stdout=log, stderr=subprocess.STDOUT)
            return self._ok(body=b"started")
        self._ok(404, b"?")
    def log_message(self, *a): pass

if __name__ == "__main__":
    os.makedirs(ROOT, exist_ok=True)
    http.server.ThreadingHTTPServer(("0.0.0.0", 8000), H).serve_forever()
