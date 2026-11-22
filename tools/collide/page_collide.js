// page_collide.js: runs INSIDE the film page (render_gpu.mjs --eval). check_collide.mjs puts "window.__CO = {...};" in front of it.
// Every `step` frames, without drawing: body volume of every character card, box of every held prop, boxes of the set meshes; then the four tests.
(async () => {
  const THREE = await import('/kit/vendor/three.module.js'); const { CARD } = await import('/kit/puppets.mjs');
  const C = window.__CO, R = window.__R(), rd = R.renderer; rd.render = function () {};
  const F = []; for (let f = C.f0; f <= Math.min(C.f1, R.end - 1); f += C.step) F.push(f);
  const glob = g => new RegExp('^' + String(g).replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.') + '$', 'i'), globs = l => (l || []).map(glob);
  const IGN = globs(C.ignore), FLOOR = globs(C.floor), SKIP = new RegExp(C.skipName, 'i'), SEAT = new RegExp(C.seatName, 'i');
  const nameOf = o => { const a = []; for (let p = o; p && !p.isScene; p = p.parent) if (p.name) a.push(p.name); return a.slice(0, 3).reverse().join('/'); };
  const anyName = (o, res) => { for (let p = o; p && !p.isScene; p = p.parent) if (p.name && res.some(r => r.test(p.name))) return true; return false; };
  const visW = o => { for (let p = o; p; p = p.parent) if (!p.visible) return false; return true; };
  const seeThru = m => !m || m.visible === false || m.colorWrite === false || m.depthWrite === false || m.blending === THREE.AdditiveBlending || (m.transparent && m.opacity < .5);
  const out = { frames: F, hits: [], notes: [], skipped: {}, resting: [], held: [] }, r3 = x => Math.round(x * 1000) / 1000;
  // ---------- the drawing on a card: its box (head top to sole, body width) and a grid of drawn points ----------
  const GW = 160, GH = Math.round(GW * CARD.H / CARD.W), CS = CARD.W / GW, cv = document.createElement('canvas'); cv.width = GW; cv.height = GH; const cg = cv.getContext('2d', { willReadFrequently: true }), artCache = new Map();
  const art = tex => { if (artCache.has(tex.uuid)) return artCache.get(tex.uuid); let o = { ok: false };
    try { cg.clearRect(0, 0, GW, GH); cg.drawImage(tex.image, 0, 0, GW, GH); const d = cg.getImageData(0, 0, GW, GH).data, rows = []; let y0 = GH, y1 = -1;
      for (let y = 0; y < GH; y++) { let l = -1, r = -1; for (let x = 0; x < GW; x++) if (d[(y * GW + x) * 4 + 3] > 60) { if (l < 0) l = x; r = x; } if (l >= 0) { rows.push([y, l, r]); y0 = Math.min(y0, y); y1 = y; } }
      if (y1 >= 0) { const h = y1 - y0 + 1, mid = rows.filter(r => r[0] >= y0 + .3 * h && r[0] <= y0 + .85 * h), md = v => { const s = [...v].sort((a, b) => a - b); return s[s.length >> 1]; }, src = mid.length ? mid : rows;
        const x0 = md(src.map(r => r[1])), x1 = md(src.map(r => r[2])), pts = [];
        for (let y = Math.ceil(y0 + .12 * h); y <= y1 - C.lowSkip * h; y += 5) for (let x = 2; x < GW; x += 5) if (d[(y * GW + x) * 4 + 3] > 60 && x >= x0 && x <= x1) pts.push([(x + .5) * CS, (y + .5) * CS]);
        o = { ok: true, x0: x0 * CS, x1: (x1 + 1) * CS, y0: y0 * CS, y1: (y1 + 1) * CS, pts }; } } catch (e) { out.notes.push('card drawing not readable: ' + e.message); }
    artCache.set(tex.uuid, o); return o; };
  const L = (qx, qy, z = 0) => new THREE.Vector3((qx - CARD.CX) / CARD.W, (CARD.GY - qy) / CARD.H, z);
  // an oriented box: centre c, unit axes u[3], half sizes h[3]
  const obbOf = (m, min, max) => { const e = m.elements, ax = [0, 1, 2].map(i => new THREE.Vector3(e[i * 4], e[i * 4 + 1], e[i * 4 + 2])), ln = ax.map(a => a.length() || 1e-9);
    return { c: new THREE.Vector3((min.x + max.x) / 2, (min.y + max.y) / 2, (min.z + max.z) / 2).applyMatrix4(m), u: ax.map((a, i) => a.clone().divideScalar(ln[i])), h: [(max.x - min.x) / 2 * ln[0], (max.y - min.y) / 2 * ln[1], (max.z - min.z) / 2 * ln[2]] }; };
  const proj = (b, a) => b.h[0] * Math.abs(b.u[0].dot(a)) + b.h[1] * Math.abs(b.u[1].dot(a)) + b.h[2] * Math.abs(b.u[2].dot(a));
  const tv = new THREE.Vector3(), cr = new THREE.Vector3();
  const pen = (A, B) => { tv.subVectors(B.c, A.c); let best = Infinity; const test = a => { const l = a.length(); if (l < 1e-6) return true; const n = a.divideScalar(l), o = proj(A, n) + proj(B, n) - Math.abs(tv.dot(n)); if (o <= 0) return false; if (o < best) best = o; return true; };
    for (const a of A.u) if (!test(cr.copy(a))) return 0; for (const a of B.u) if (!test(cr.copy(a))) return 0; for (const a of A.u) for (const b of B.u) if (!test(cr.crossVectors(a, b))) return 0; return best; };
  const inObb = (B, p, grow = 0) => { tv.subVectors(p, B.c); return Math.abs(tv.dot(B.u[0])) <= B.h[0] + grow && Math.abs(tv.dot(B.u[1])) <= B.h[1] + grow && Math.abs(tv.dot(B.u[2])) <= B.h[2] + grow; };
  const aabb = B => { const r = [0, 1, 2].map(i => B.h[0] * Math.abs(B.u[0].getComponent(i)) + B.h[1] * Math.abs(B.u[1].getComponent(i)) + B.h[2] * Math.abs(B.u[2].getComponent(i))); return new THREE.Box3(new THREE.Vector3(B.c.x - r[0], B.c.y - r[1], B.c.z - r[2]), new THREE.Vector3(B.c.x + r[0], B.c.y + r[1], B.c.z + r[2])); };
  // ---------- set meshes of a place (once per place) ----------
  const cardSet = new Set(); for (const cd of Object.values(R.cards)) for (const o of [cd.mesh, cd.blob, cd.legs3d]) if (o) cardSet.add(o);
  const held = []; for (const E of R.h3o || []) for (const k of ['main', 'flip']) if (E[k] && E[k].g) held.push({ E, g: E[k].g });
  const heldRoots = new Set(held.map(h => h.g)), placeCache = new Map();
  const solids = pl => { if (placeCache.has(pl)) return placeCache.get(pl); const list = [], why = {}, skip = k => { why[k] = (why[k] || 0) + 1; };
    pl.scene.traverse(o => { if (!o.isMesh) return; for (let p = o; p; p = p.parent) { if (cardSet.has(p)) return; if (heldRoots.has(p) || (p.userData && (p.userData.inHand || p.userData.held))) return skip('held prop'); }
      if (o.isSkinnedMesh) return skip('skinned'); if (o.isInstancedMesh) return skip('instanced copies (not tested)');
      const m0 = Array.isArray(o.material) ? o.material[0] : o.material; if (seeThru(m0)) return skip('see-through'); if (/ShaderMaterial/.test(m0.type) && m0.transparent) return skip('effect shader');
      const nm = nameOf(o); if (!nm) return skip('no name'); if (SKIP.test(nm)) return skip('effect / sky name'); if (anyName(o, IGN)) return skip('collide.ignore'); if (anyName(o, FLOOR)) return skip('collide.floor');
      if (!o.geometry.boundingBox) o.geometry.computeBoundingBox(); if (!o.geometry.boundingSphere) o.geometry.computeBoundingSphere(); list.push({ o, nm, seat: SEAT.test(nm) }); });
    out.skipped[Object.keys(R.places).find(k => R.places[k] === pl) || '?'] = { tested: list.length, ...why }; placeCache.set(pl, list); return list; };
  // inside a closed mesh: an odd number of its walls along +n AND along -n (the frame_checks body_in_mesh test)
  const ray = new THREE.Raycaster(); const walls = (o, w, n) => { ray.set(w, n); ray.near = 0; ray.far = 60; const hs = ray.intersectObject(o, false); let c = 0, last = -1; for (const h of hs) if (h.distance - last > 1e-4) { c++; last = h.distance; } return [c, hs.length ? hs[0].distance : 0]; };
  const cam = R.camera, sv = new THREE.Vector3(), screen = w => { sv.copy(w).applyMatrix4(cam.matrixWorldInverse); const z = -sv.z; sv.applyMatrix4(cam.projectionMatrix); return [(sv.x + 1) / 2, (1 - sv.y) / 2, z]; };
  const hit = (f, rule, level, a, b, value, text) => out.hits.push({ f, rule, level, a, b, value: r3(value), text });
  const findObj = (sc, name) => { const re = glob(name); let best = null; sc.traverse(o => { if (!best && o.name && re.test(o.name)) best = o; }); if (!best) for (const h of held) if (re.test(h.E.hd.obj) && h.g.visible) best = h.g; return best; };
  const t0 = performance.now(), bx = new THREE.Box3(), nrm = new THREE.Vector3(), nb = new THREE.Vector3();
  for (const f of F) {
    await window.renderFrame(f); const pl = R.placeNow, sc = pl.scene; sc.updateMatrixWorld(true); cam.updateMatrixWorld(true); const S = solids(pl), camP = cam.position;
    // ---- bodies
    const bodies = [];
    for (const [who, cd] of Object.entries(R.cards)) { const m = cd.mesh; if (!m.visible || m.parent !== sc || !m.material || !m.material.map) continue; if (cd.entry && (cd.entry.reflection || cd.entry.in_vehicle)) continue;
      const A = art(m.material.map); if (!A.ok) continue; const hgt = A.y1 - A.y0;
      const full = obbOf(m.matrixWorld, L(A.x0, A.y1, -C.depth / 2), L(A.x1, A.y0, C.depth / 2)), up = obbOf(m.matrixWorld, L(A.x0, A.y1 - C.lowSkip * hgt, -C.depth / 2), L(A.x1, A.y0, C.depth / 2));
      const cs = [[A.x0, A.y0], [A.x1, A.y0], [A.x0, A.y1], [A.x1, A.y1]].map(([x, y]) => screen(L(x, y).applyMatrix4(m.matrixWorld))), ctr = screen(full.c);
      bodies.push({ who, cd, m, A, full, up, box: aabb(up), rect: cs.every(c => c[2] > .05) ? [Math.min(...cs.map(c => c[0])), Math.min(...cs.map(c => c[1])), Math.max(...cs.map(c => c[0])), Math.max(...cs.map(c => c[1]))] : null, z: ctr[2] }); }
    // ---- BODY_IN_OBJECT
    for (const B of bodies) { nrm.set(0, 0, 1).transformDirection(B.m.matrixWorld); nb.copy(nrm).negate();
      for (const s of S) { const o = s.o; if (!visW(o)) continue; bx.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld); if (!bx.intersectsBox(B.box)) continue;
        const ob = obbOf(o.matrixWorld, o.geometry.boundingBox.min, o.geometry.boundingBox.max); if (inObb(ob, camP)) continue;   // a room, a shell: the camera is inside it too
        const p = pen(B.up, ob); if (p <= C.pen) continue;
        if (s.seat) { hit(f, 'SEAT', 'INFO', B.who, s.nm, p, 'sits on / in a seat (not counted)'); continue; }
        // exact test: drawn body points inside the closed mesh
        const mats = [].concat(o.material), sides = mats.map(m => m.side); for (const m of mats) m.side = THREE.DoubleSide; let n = 0; const P = B.A.pts;
        for (const q of P) { const w = L(q[0], q[1]).applyMatrix4(B.m.matrixWorld); if (!inObb(ob, w)) continue; const [a, da] = walls(o, w, nrm); if (!(a % 2) || da < .01) continue; const [b, db] = walls(o, w, nb); if (!(b % 2) || db < .01) continue; n++; }
        mats.forEach((m, i) => { m.side = sides[i]; }); const share = P.length ? n / P.length : 0;
        if (share >= C.inFail) hit(f, 'BODY_IN_OBJECT', 'FAIL', B.who, s.nm, share * 100, `${Math.round(share * 100)} % of the body is inside it (boxes overlap ${Math.round(p * 100)} cm)`);
        else if (share >= C.inWarn) hit(f, 'BODY_IN_OBJECT', 'WARN', B.who, s.nm, share * 100, `${Math.round(share * 100)} % of the body is inside it (boxes overlap ${Math.round(p * 100)} cm)`);
        else hit(f, 'BODY_IN_BOX', C.boxFail ? 'FAIL' : 'WARN', B.who, s.nm, p * 100, `the body box is ${Math.round(p * 100)} cm into its box, but no drawn body point is inside the mesh (open or hollow part, or only the box corner)`); } }
    // ---- BODY_IN_BODY: close in depth AND overlapping on screen
    for (let i = 0; i < bodies.length; i++) for (let j = i + 1; j < bodies.length; j++) { const a = bodies[i], b = bodies[j]; if (!a.rect || !b.rect) continue; const dz = Math.abs(a.z - b.z); if (dz > C.pairDepth) continue;
      const w = Math.min(a.rect[2], b.rect[2]) - Math.max(a.rect[0], b.rect[0]), h = Math.min(a.rect[3], b.rect[3]) - Math.max(a.rect[1], b.rect[1]); if (w <= 0 || h <= 0) continue;
      const ar = r => (r[2] - r[0]) * (r[3] - r[1]), ov = w * h / Math.max(1e-9, Math.min(ar(a.rect), ar(b.rect))); if (ov >= C.pairOverlap) hit(f, 'BODY_IN_BODY', 'FAIL', a.who, b.who, ov * 100, `body boxes overlap ${Math.round(ov * 100)} % of the smaller one on screen and are ${Math.round(dz * 100)} cm apart in depth`); }
    // ---- PROP_IN_BODY: the centre of a held prop's box inside another character's volume
    for (const hd of held) { if (!visW(hd.g) || hd.g.parent == null) continue; bx.setFromObject(hd.g); if (bx.isEmpty()) continue; const c = bx.getCenter(new THREE.Vector3()), own = [hd.E.hd.who, hd.E.hd.with];
      if (!out.held.includes(hd.E.hd.obj)) out.held.push(hd.E.hd.obj);
      for (const B of bodies) if (!own.includes(B.who) && inObb(B.full, c)) hit(f, 'PROP_IN_BODY', 'FAIL', hd.E.hd.obj + ' (held by ' + own.filter(Boolean).join('+') + ')', B.who, 0, `the centre of the prop's box is inside the body volume of ${B.who}`); }
    // ---- FLOATING / SUNK: declared resting props
    for (const [pn, sn] of Object.entries(C.resting || {})) { const po = findObj(sc, pn), so = findObj(sc, sn); if (!po || !so) { const k = `${pn} on ${sn}: ${!po ? 'prop' : 'support'} not found in place ${Object.keys(R.places).find(k => R.places[k] === pl)}`; if (!out.notes.includes(k)) out.notes.push(k); continue; }
      if (!visW(po) || !visW(so)) continue; const pb = new THREE.Box3().setFromObject(po), sb = new THREE.Box3().setFromObject(so); if (pb.isEmpty() || sb.isEmpty()) continue;
      const c = pb.getCenter(new THREE.Vector3()); let top = sb.max.y, how = 'box top'; const ms = []; so.traverse(o => { if (o.isMesh) ms.push(o); }); const mats = [...new Set(ms.flatMap(o => [].concat(o.material)))], sides = mats.map(m => m.side); for (const m of mats) m.side = THREE.DoubleSide;
      ray.set(new THREE.Vector3(c.x, sb.max.y + .01, c.z), new THREE.Vector3(0, -1, 0)); ray.near = 0; ray.far = 100; const hs = ray.intersectObjects(ms, false); mats.forEach((m, i) => { m.side = sides[i]; }); if (hs.length) { top = hs[0].point.y; how = 'surface under its centre'; }
      const gap = pb.min.y - top; out.resting.push({ f, prop: pn, support: sn, gap_cm: r3(gap * 100), how });
      if (gap > C.restTol) hit(f, 'FLOATING', 'FAIL', pn, sn, gap * 100, `bottom is ${(gap * 100).toFixed(1)} cm ABOVE the support (${how})`); else if (gap < -C.restTol) hit(f, 'SUNK', 'FAIL', pn, sn, gap * 100, `bottom is ${(-gap * 100).toFixed(1)} cm INSIDE the support (${how})`); }
  }
  out.cast = Object.keys(R.cards); out.scan_ms = Math.round(performance.now() - t0); return out;
})()
