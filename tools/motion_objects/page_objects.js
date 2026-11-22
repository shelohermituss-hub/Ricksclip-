// page_objects.js: runs INSIDE the film page (render_gpu.mjs --eval). check_objects.mjs puts "window.__MO = {...};" in front of it.
// Steps every frame of the window WITHOUT drawing (the renderer's draw call is switched off) and records, per frame:
// the camera, every character card (feet, head, both hands) and every named scene object whose own matrix, visibility or opacity changes.
(async () => {
  const THREE = await import('/kit/vendor/three.module.js'); const { CARD } = await import('/kit/puppets.mjs');
  const C = window.__MO, R = window.__R(), rd = R.renderer; rd.render = function () {};
  const F = []; for (let f = C.f0; f <= Math.min(C.f1, R.end - 1); f += C.step) F.push(f);
  const r5 = x => Math.round(x * 1e5) / 1e5, arr = v => [r5(v.x), r5(v.y), r5(v.z)], B2T = p => [r5(p[0]), r5(p[2]), r5(-p[1])];
  const out = { frames: F, fps: R.fps, plan: [], cam: [], cards: {}, objects: [], notes: [] };
  const cardSet = new Set(); for (const cd of Object.values(R.cards)) for (const o of [cd.mesh, cd.blob, cd.legs3d]) if (o) cardSet.add(o);
  for (const who of Object.keys(R.cards)) out.cards[who] = [];
  const visW = o => { for (let p = o; p; p = p.parent) if (!p.visible) return 0; return 1; };
  const opac = o => { const m = Array.isArray(o.material) ? o.material[0] : o.material; return m ? (m.transparent ? (m.opacity ?? 1) : 1) * (m.visible === false ? 0 : 1) : 1; };
  const nameOf = o => { const a = []; for (let p = o; p && !p.isScene; p = p.parent) if (p.name) a.push(p.name); return a.slice(0, 3).reverse().join('/'); };
  const recs = new Map(), P = new THREE.Vector3(), Q = new THREE.Quaternion(), S = new THREE.Vector3(), M = new THREE.Matrix4();
  const diff = (a, b) => { for (let i = 0; i < 16; i++) if (Math.abs(a[i] - b[i]) > 1e-6) return true; return false; };
  const row = (els, v, op) => { M.fromArray(els).decompose(P, Q, S); return [r5(P.x), r5(P.y), r5(P.z), +Q.x.toFixed(6), +Q.y.toFixed(6), +Q.z.toFixed(6), +Q.w.toFixed(6), r5(S.x), r5(S.y), r5(S.z), v, +op.toFixed(3)]; };
  const hv = new THREE.Vector3(), t0 = performance.now();
  for (let i = 0; i < F.length; i++) {
    const f = F[i]; await window.renderFrame(f); const sc = R.placeNow.scene, cam = R.camera, pc = R.cam[f] || {}; sc.updateMatrixWorld(true); cam.updateMatrixWorld(true);
    cam.matrixWorld.decompose(P, Q, S);
    out.cam.push([r5(P.x), r5(P.y), r5(P.z), +Q.x.toFixed(6), +Q.y.toFixed(6), +Q.z.toFixed(6), +Q.w.toFixed(6), +cam.fov.toFixed(4), +cam.aspect.toFixed(4)]);
    out.plan.push([pc.take ?? null, pc.place ?? null, pc.cut ? 1 : 0, pc.state ?? null, pc.kick ? 1 : 0]);
    for (const [who, cd] of Object.entries(R.cards)) {
      const m = cd.mesh, vis = m.visible && m.parent === sc ? 1 : 0; if (!vis) { out.cards[who].push(null); continue; }
      const root = arr(hv.set(0, 0, 0).applyMatrix4(m.matrixWorld)), head = arr(hv.set(0, (CARD.GY - cd.m.hy) / CARD.H, 0).applyMatrix4(m.matrixWorld));
      let hands = null, pose = null; try { const h = window.handWorld ? window.handWorld(who, f) : null; if (h) { pose = h.pose ?? null; if (h.hands && h.hands[0] && h.hands[1]) hands = [B2T(h.hands[0]), B2T(h.hands[1])]; } } catch (e) { if (!out.notes.length) out.notes.push('handWorld failed: ' + e.message); }
      out.cards[who].push({ root, head, hands, pose, tex: m.material && m.material.map ? m.material.map.uuid.slice(0, 8) : null, sy: r5(m.scale.y) });
    }
    sc.traverse(o => {
      if (o.isLight || o.isCamera) return; for (let p = o; p; p = p.parent) if (cardSet.has(p)) return;
      const w = o.matrixWorld.elements, l = o.matrix.elements, v = visW(o), op = o.isMesh || o.isSprite || o.isPoints || o.isLine ? opac(o) : 1; let r = recs.get(o.uuid);
      if (!r) { recs.set(o.uuid, r = { o, w0: Float32Array.from(w), pw: Float32Array.from(w), pl: Float32Array.from(l), v0: v, pv: v, own0: o.visible, op0: op, pop: op, seen: [], rows: null, own: false, chW: false }); r.seen.push(i); return; }
      const dW = diff(w, r.pw), dL = diff(l, r.pl), dV = v !== r.pv, dO = Math.abs(op - r.pop) > 1e-4;
      if (dL || o.visible !== r.own0 || dO) r.own = true; if (dW) r.chW = true;
      if ((dW || dV || dO) && !r.rows) { r.rows = new Array(F.length).fill(null); const first = row(r.w0, r.v0, r.op0); for (const k of r.seen) r.rows[k] = first; }
      if (r.rows) r.rows[i] = row(w, v, op); else r.seen.push(i);
      if (dW) r.pw.set(w); if (dL) r.pl.set(l); r.pv = v; r.pop = op;
    });
  }
  // keep: named objects that change. A child that only inherits its parent's motion is dropped (one representative when the moving parent has no name).
  const ownAnc = o => { for (let p = o.parent; p; p = p.parent) { const r = recs.get(p.uuid); if (r && r.own && r.rows) return p; } return null; };
  const names = new Map(), rep = new Map(); let total = 0, inherited = 0, unnamed = 0;
  for (const r of recs.values()) { total++; if (!r.rows) continue; const nm = nameOf(r.o); if (!nm) { unnamed++; continue; }
    if (!r.own) { const a = ownAnc(r.o); if (a && nameOf(a)) { inherited++; continue; } if (a) { if (rep.has(a.uuid)) { rep.get(a.uuid).more++; inherited++; continue; } } const t = { name: nm, type: r.o.type, rows: r.rows, more: 0 }; if (a) rep.set(a.uuid, t); out.objects.push(t); continue; }
    out.objects.push({ name: nm, type: r.o.type, rows: r.rows, more: 0 }); }
  for (const t of out.objects) { const n = (names.get(t.name) || 0) + 1; names.set(t.name, n); if (n > 1) t.name += '#' + n; if (t.more) t.name += ` (+${t.more} moving with it)`; }
  out.stats = { objects_seen: total, tracked: out.objects.length, dropped_inherit_only: inherited, changing_without_name: unnamed, scan_ms: Math.round(performance.now() - t0), ms_per_frame: +((performance.now() - t0) / Math.max(1, F.length)).toFixed(1) };
  return out;
})()
