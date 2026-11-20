// page_scale.js: runs INSIDE the film page (render_gpu.mjs --eval), scale_check.mjs puts "window.__SC = {...};" in front. Reads the live scene; nothing is changed.
(async () => {
  const THREE = await import('/kit/vendor/three.module.js');
  const { CARD } = await import('/kit/puppets.mjs');
  const C = window.__SC, R = window.__R(), rd = R.renderer, cam = R.camera, W = R.W, H = R.H;
  const realRender = rd.render; rd.render = function () {};
  // the drawing on the card: rows, head circle (kit metrics), hat/hair top, soles
  const GW = 160, GH = 300, CS = CARD.W / GW, sc = document.createElement('canvas'); sc.width = GW; sc.height = GH; const sg = sc.getContext('2d', { willReadFrequently: true }); const cache = new Map();
  const art = (card, tex) => { if (cache.has(tex.uuid)) return cache.get(tex.uuid); sg.clearRect(0, 0, GW, GH); sg.drawImage(tex.image, 0, 0, GW, GH); const d = sg.getImageData(0, 0, GW, GH).data, a = new Uint8Array(GW * GH);
    let y0 = GH, y1 = -1; for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) if (d[(y * GW + x) * 4 + 3] > 60) { a[y * GW + x] = 1; y0 = Math.min(y0, y); y1 = y; }
    const r = card.m.headPx / 2 / CS, cov = (cx, cy) => { let n = 0, t = 0; for (let y = Math.round(cy - r); y <= cy + r; y += 2) for (let x = Math.round(cx - r); x <= cx + r; x += 2) { if ((x - cx) ** 2 + (y - cy) ** 2 > r * r) continue; t++; if (x >= 0 && x < GW && y >= 0 && y < GH && a[y * GW + x]) n++; } return t ? n / t : 0; };
    let hx = CARD.CX / CS, hy = card.m.hy / CS, best = cov(hx, hy);
    if (best < .9) for (let dy = -1.6; dy <= 1.6; dy += .2) for (let dx = -1.6; dx <= 1.6; dx += .2) { const v = cov(CARD.CX / CS + dx * r, card.m.hy / CS + dy * r) - .04 * Math.hypot(dx, dy); if (v > best) { best = v; hx = CARD.CX / CS + dx * r; hy = card.m.hy / CS + dy * r; } }
    let top = hy - r; for (let y = Math.max(0, Math.round(hy - 1.95 * r)); y < hy; y++) { let hit = false; for (let x = Math.max(0, Math.round(hx - r)); x <= Math.min(GW - 1, hx + r); x++) if (a[y * GW + x]) { hit = true; break; } if (hit) { top = y; break; } }
    const o = { ok: y1 >= 0, head: { x: hx * CS, y: hy * CS, r: r * CS }, top: top * CS, sole: (y1 + 1) * CS, y0: y0 * CS }; cache.set(tex.uuid, o); return o; };
  const toWorld = (mesh, qx, qy) => new THREE.Vector3((qx - CARD.CX) / CARD.W, (CARD.GY - qy) / CARD.H, 0).applyMatrix4(mesh.matrixWorld);
  const v3 = new THREE.Vector3(), toScreen = w => { v3.copy(w).applyMatrix4(cam.matrixWorldInverse); const z = -v3.z; v3.applyMatrix4(cam.projectionMatrix); return [(v3.x + 1) / 2 * W, (1 - v3.y) / 2 * H, z]; };
  const P2T = p => new THREE.Vector3(p[0], p[2], -p[1]);   // plan metres [x, y north, z up] -> three
  const mPerPx = z => 2 * z * Math.tan(cam.fov * Math.PI / 360) / H;
  const refs = {}, recs = [], boxes = {};
  const put = (who, role, check, f, status, value, unit, target, detail) => recs.push({ who, role, check, f, status, value, unit, target, detail });
  const lvl = { PASS: 0, WARN: 1, FAIL: 2 };
  for (const f of C.frames) {
    await window.renderFrame(f, { captions: false }); const pl = R.placeNow; pl.scene.updateMatrixWorld(true); cam.updateMatrixWorld(true); cam.matrixWorldInverse.copy(cam.matrixWorld).invert();
    // set references in this frame
    const veh = [], tyres = [], doors = []; pl.scene.traverse(o => { if (o.userData && o.userData.driverSeat && o.userData.driverSeat.window) veh.push(o); if (o.isMesh && /_tyre$/.test(o.name) && !/^(car|bus)_/.test(o.name)) tyres.push(o); if (o.isMesh && /bus_door_leaf_glass/.test(o.name)) doors.push(o); });
    const bb = new THREE.Box3(); let wheelD = null, doorH = null;
    for (const t of tyres) { let vis = true; for (let p = t; p; p = p.parent) if (!p.visible) vis = false; if (!vis) continue; bb.setFromObject(t); const s = bb.getSize(new THREE.Vector3()); wheelD = Math.max(wheelD || 0, s.y); }
    if (doors.length) { bb.makeEmpty(); for (const d of doors) bb.expandByObject(d); doorH = bb.max.y - bb.min.y; }
    if (wheelD) refs.bike_wheel_d = +wheelD.toFixed(3); if (doorH) refs.bus_door_h = +doorH.toFixed(3);
    for (const [who, card] of Object.entries(R.cards)) {
      if (card.entry && card.entry.reflection) continue;
      const mesh = card.mesh; if (!mesh.visible || mesh.parent !== pl.scene || !mesh.material.map) continue; const Aa = art(card, mesh.material.map); if (!Aa.ok) continue;
      const wTop = toWorld(mesh, Aa.head.x, Aa.top), wHc = toWorld(mesh, Aa.head.x, Aa.head.y), wChin = toWorld(mesh, Aa.head.x, Aa.head.y + Aa.head.r), wSole = toWorld(mesh, CARD.CX, Aa.sole);
      const sT = toScreen(wTop), sS = toScreen(wSole); if (sT[2] <= .05) continue;
      const inShot = Math.max(sT[1], sS[1]) > 0 && Math.min(sT[1], sS[1]) < H && sT[0] > -W * .2 && sT[0] < W * 1.2; if (!inShot) continue;
      const headD = wHc.distanceTo(wChin) * 2, box = [Math.min(sT[0], sS[0]) - 60, Math.min(sT[1], sS[1]) - 20, Math.max(sT[0], sS[0]) + 60, Math.max(sT[1], sS[1]) + 20]; boxes[who + f] = box;
      if (card.entry.in_vehicle) {
        // the vehicle it sits in: the one whose driverSeat is nearest the card
        let best = null, bd = 1e9; for (const v of veh) { const ds = v.userData.driverSeat, sp = v.localToWorld(new THREE.Vector3(...(ds.pos || ds))); const d = Math.hypot(sp.x - mesh.position.x, sp.z - mesh.position.z); if (d < bd) { bd = d; best = { v, ds, sp }; } }
        if (!best || bd > 1.5) continue;
        const { v, ds, sp } = best, bus = /bus/i.test(v.name) || ds.headTopZ > 1.6, role = bus ? 'bus' : 'car';
        const y0 = v.getWorldPosition(new THREE.Vector3()).y, seatZ = sp.y - y0, sill = ds.window[0], roof = ds.window[1], top = wTop.y - y0, chin = wChin.y - y0, sole = wSole.y - y0, shoulder = chin - .05 * headD;
        refs[role] = { seat: +seatZ.toFixed(3), sill, roof, headTopZ: ds.headTopZ };
        // seated: soles below the seat (legs down to the floor)
        const below = seatZ - sole; put(who, role, 'seated', f, below < .10 ? 'FAIL' : 'PASS', +(below * 100).toFixed(1), 'cm soles under seat', '>= 10 cm', below < .10 ? `soles ${(below * 100).toFixed(0)} cm under the seat top: the card STANDS on the seat (not a seated pose)` : '');
        if (bus) { const sh = (top - sill) / (roof - sill); put(who, role, 'head_roof', f, sh < .3 || sh > .8 ? 'FAIL' : sh < .35 || sh > .75 ? 'WARN' : 'PASS', +sh.toFixed(2), 'of windscreen', '0.35-0.75', `head top ${top.toFixed(2)} m in the window ${sill}-${roof} m`); }
        else { const gap = roof - top; put(who, role, 'head_roof', f, gap < -.02 || gap > .20 ? 'FAIL' : gap > .14 ? 'WARN' : 'PASS', +(gap * 100).toFixed(1), 'cm under roof', '0-14 cm', gap > .2 ? `head top ${(gap * 100).toFixed(0)} cm under the roof line: sits low, reads small` : gap < -.02 ? 'head through the roof' : ''); }
        { const d = shoulder - sill, bad = bus ? (d < 0 ? 'FAIL' : 'PASS') : (d < -.08 ? 'FAIL' : d < 0 ? 'WARN' : 'PASS'); put(who, role, 'shoulder', f, bad, +(d * 100).toFixed(1), 'cm over sill', '>= 0 cm', bad !== 'PASS' ? `shoulder line ${shoulder.toFixed(2)} m vs sill ${sill} m` : ''); }
        { const real = bus ? .90 : .90 * Math.min(1, (roof - seatZ) / .95), sh = top - seatZ, e = sh / real - 1, st = Math.abs(e) > .25 ? 'FAIL' : Math.abs(e) > .15 ? 'WARN' : 'PASS';
          put(who, role, 'seated_h', f, st, +sh.toFixed(2), 'm seat->head top', real.toFixed(2) + ' m +-15 %', `${(e * 100).toFixed(0)} % vs a real seated adult${bus ? '' : ' scaled to this car'} (head ${headD.toFixed(2)} m)`); }
        // hands on the wheel rim (screen metres at the wheel depth); the hand that waves on the act's wave frames is exempt
        let wh = null; v.traverse(o => { if (o.isMesh && /steering_wheel/.test(o.name)) wh = o; });
        const hw = window.handWorld ? window.handWorld(who, f) : null;
        if (wh && hw && hw.hands) { const wc = wh.getWorldPosition(new THREE.Vector3()), sw = toScreen(wc), mp = mPerPx(sw[2]), rr = wh.geometry.parameters ? wh.geometry.parameters.radius || .2 : .2;
          const waving = (C.waves[who] || []).some(a => f >= a && f <= a + C.waveSpan);
          const dd = hw.hands.filter(Boolean).map(h => { const s = toScreen(P2T(h)); return [Math.abs(Math.hypot(s[0] - sw[0], s[1] - sw[1]) * mp - rr), ((s[0] - sw[0]) * mp * 100).toFixed(0), ((s[1] - sw[1]) * mp * 100).toFixed(0)]; }).sort((p, q) => p[0] - q[0]), ds2 = dd.map(q => q[0]), off = dd.map(q => `(${q[1]},${q[2]})`).join(' ');
          const d = waving ? ds2[0] : ds2[ds2.length - 1]; if (d != null) put(who, role, 'hands_wheel', f, d > .08 ? 'FAIL' : d > .05 ? 'WARN' : 'PASS', +(d * 100).toFixed(1), 'cm hand-rim', '<= 5 cm', (waving ? 'waving: the other hand; ' : 'farther hand; ') + `hands from wheel centre cm (x right, y down) ${off}, rim r ${(rr*100).toFixed(0)}`); }
      } else {
        const hgt = card.entry.height || 1.7;
        if (doorH) { const q = hgt / doorH; put(who, 'person', 'h_vs_door', f, q < .65 || q > 1 ? 'FAIL' : q < .7 || q > .95 ? 'WARN' : 'PASS', +q.toFixed(2), 'x door', '0.70-0.95', `height ${hgt} m / bus door ${doorH.toFixed(2)} m`); }
        if (wheelD && /lady|cycl|rider/i.test(who)) { const q = hgt / wheelD; put(who, 'rider', 'h_vs_wheel', f, q < 1.9 || q > 3.1 ? 'FAIL' : q < 2.1 || q > 2.9 ? 'WARN' : 'PASS', +q.toFixed(2), 'x wheel', '2.1-2.9', `height ${hgt} m / bike wheel ${wheelD.toFixed(2)} m`); }
      }
    }
  }
  // one row per character + check: the worst frame
  const agg = new Map(); for (const r of recs) { const k = r.who + '|' + r.check; let a = agg.get(k); if (!a) agg.set(k, a = { ...r, n: 0, bad: 0, frame: r.f, lv: -1 }); a.n++; if (r.status === 'FAIL') a.bad++; const l = lvl[r.status]; if (l > a.lv) Object.assign(a, { status: r.status, value: r.value, detail: r.detail, frame: r.f, lv: l }); }
  const rows = [...agg.values()].map(a => ({ who: a.who, role: a.role, check: a.check, status: a.status === 'FAIL' && a.bad < 3 && a.n >= 3 ? 'WARN' : a.status, value: a.value, unit: a.unit, target: a.target, frame: a.frame, bad: a.bad, n: a.n, detail: a.detail }));
  rd.render = realRender; const crops = [];
  const st = document.getElementById('stage'), o = document.createElement('canvas'), g = o.getContext('2d');
  for (const r of rows.filter(q => q.status === 'FAIL').slice(0, C.crops)) { await window.renderFrame(r.frame, { captions: false }); const cs = [...st.querySelectorAll('canvas')]; const b = boxes[r.who + r.frame] || [0, 0, W, H];
    const cx = (b[0] + b[2]) / 2, cy = (b[1] + b[3]) / 2, half = Math.max(.22 * W, (b[2] - b[0]) * .8, (b[3] - b[1]) * .8), z = Math.min(4, 400 / (2 * half)), out = Math.round(2 * half * z);
    o.width = out; o.height = out; g.fillStyle = '#202020'; g.fillRect(0, 0, out, out); for (const c of cs) g.drawImage(c, 0, 0, c.width, c.height, -(cx - half) * z, -(cy - half) * z, W * z, H * z);
    g.fillStyle = 'rgba(0,0,0,.6)'; g.fillRect(0, 0, out, 26); g.fillStyle = '#ff5050'; g.font = 'bold 15px Arial'; g.fillText(`FAIL ${r.check} ${r.who} f${r.frame}: ${r.value} ${r.unit}`, 6, 18);
    crops.push({ who: r.who, check: r.check, frame: r.frame, jpg: o.toDataURL('image/jpeg', .85).split(',')[1] }); }
  return { rows, crops, refs };
})()
