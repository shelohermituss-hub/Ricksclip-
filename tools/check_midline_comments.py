"""Find comments that swallow code: a '#' (Python) or '//' (JS) comment whose text still holds statements.

Why (LECONS_TECHNIQUES.md, 2026-11-20 and 2026-11-21): four times a sed or an edit put a comment in the middle of a
multi-statement line and silently dropped what came after it (pivots, an anchor pair, the denoiser, a chrome material).
Usage: python tools/check_midline_comments.py <file or folder> [...]   exits 1 if a suspect line is found.
"""
import re, sys, pathlib

# code-like text inside a comment: "; name = ...", "; name.attr(", "; name(" etc.
CODE_AFTER = re.compile(r";\s*[A-Za-z_][\w.\[\]'\"]*\s*(=(?!=)|\()")
CODE_AFTER_JS = re.compile(r";\s*[A-Za-z_][\w.\[\]]*\s*(=(?!=)[^;]*;|\([^;]*\)\s*;)")   # JS: the swallowed statement must end in ";"

def comment_part(line, ext):
    s, q = line, None
    for i, ch in enumerate(s):
        if q:
            if ch == q and s[i - 1] != "\\": q = None
            continue
        if ch in "'\"`": q = ch; continue
        if ext == ".py" and ch == "#": return s[:i], s[i + 1:]
        if ext in (".js", ".mjs") and s.startswith("//", i): return s[:i], s[i + 2:]
    return s, None

def scan(path):
    bad = []
    for n, line in enumerate(path.read_text(encoding="utf-8", errors="replace").splitlines(), 1):
        code, com = comment_part(line, path.suffix)
        if com is None or not code.strip(): continue          # no comment, or a comment-only line
        if (CODE_AFTER_JS if path.suffix != ".py" else CODE_AFTER).search(com): bad.append((n, line.strip()[:160]))
    return bad

def main(args):
    files = []
    for a in args or ["."]:
        p = pathlib.Path(a)
        files += [p] if p.is_file() else [f for f in p.rglob("*") if f.suffix in (".py", ".js", ".mjs") and not ({"node_modules", "vendor", ".puppet_cache", "out", "build"} & set(f.parts))]
    hits = 0
    for f in files:
        for n, l in scan(f):
            print(f"{f}:{n}: comment holds code: {l}"); hits += 1
    print(f"MIDLINE_COMMENTS {hits} suspect line(s) in {len(files)} file(s)")
    return 1 if hits else 0

if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
