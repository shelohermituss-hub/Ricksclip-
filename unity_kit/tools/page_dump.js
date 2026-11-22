// page_dump.js: runs INSIDE the kit film page (render_gpu.mjs --eval). Steps frames F0..F1 without drawing and records, in three.js world
// axes (= glTF: metres, Y up, right-handed): the camera (pos, quaternion, vertical fov), every named node whose world matrix, visibility
// or glitter uniforms change, the character cards (world TRS of the card plane, visible), lights (colour, intensity, direction).
(async () => {
  const C = window.__UD, R = window.__R(); R.renderer.render = function () {};
  const THREE = await import('/kit/vendor/three.module.js'); const P = new THREE.Vector3(), Q = new THREE.Quaternion(), S = new THREE.Vector3();
  const r5 = x => Math.round(x * 1e5) / 1e5, trs = o => { o.updateWorldMatrix(true, false); o.matrixWorld.decompose(P, Q, S); return [r5(P.x), r5(P.y), r5(P.z), +Q.x.toFixed(6), +Q.y.toFixed(6), +Q.z.toFixed(6), +Q.w.toFixed(6), r5(S.x), r5(S.y), r5(S.z)]; };
  const visW = o => { for (let p = o; p; p = p.parent) if (!p.visible) return 0; return 1; };
  const out = { axes: 'three.js world = glTF: metres, Y up, right-handed, camera looks down its local -Z', fps: R.fps, f0: C.f0, f1: C.f1, camera: [], nodes: {}, cards: {}, glitter: [], lights: {} };
  const last = new Map();
  for (let f = C.f0; f <= C.f1; f++) {
    await window.renderFrame(f); const sc = R.placeNow.scene, cam = R.camera; sc.updateMatrixWorld(true); cam.updateMatrixWorld(true);
    out.camera.push([f, ...trs(cam), +cam.fov.toFixed(4)]);
    for (const [who, cd] of Object.entries(R.cards)) { const m = cd.mesh; if (!m) continue; (out.cards[who] ||= []).push([f, ...trs(m), visW(m)]); }
    let g = [f];
    sc.traverse(o => {
      if (o.isLight) { const d = new THREE.Vector3(); if (o.target) { o.target.updateMatrixWorld(); d.subVectors(o.target.getWorldPosition(new THREE.Vector3()), o.getWorldPosition(new THREE.Vector3())).normalize(); }
        const key = (o.name || o.type + '_' + o.id); const row = [f, o.type, '#' + o.color.getHexString(), +o.intensity.toFixed(4), ...trs(o).slice(0, 3), r5(d.x), r5(d.y), r5(d.z), visW(o)];
        const s = JSON.stringify(row.slice(1)); if (last.get('L' + key) !== s) { (out.lights[key] ||= []).push(row); last.set('L' + key, s); } return; }
      if (!o.name || o.isCamera) return;
      if ((o.name === 'glitter_trail_0' || o.name === 'glitter_cockpit_0') && o.material && o.material.uniforms) g.push(o.name === 'glitter_trail_0' ? 'trail' : 'cockpit', +o.material.uniforms.state.value.toFixed(4), +o.material.uniforms.twinkle.value.toFixed(4));
      const row = [...trs(o), visW(o)], s = JSON.stringify(row), k = o.name + '#' + o.id;
      if (last.get(k) !== s) { (out.nodes[o.name] ||= []).push([f, ...row]); last.set(k, s); } });
    out.glitter.push(g);
  }
  // keep only nodes that change after the first frame, or are named in C.keep (the first frame row is kept for each)
  const keep = new RegExp(C.keep); for (const [n, rows] of Object.entries(out.nodes)) if (rows.length < 2 && !keep.test(n)) delete out.nodes[n];
  return out;
})()
