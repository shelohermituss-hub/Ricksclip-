(async () => {
  // dump_nodes.js (look-finisher): run by render_gpu.mjs --frames F0 --eval (code with __F0__ / __F1__ / __BASE__ replaced by dump_nodes.sh).
  // For every frame of the stretch window: world visibility + matrixWorld (three.js, Y up) of every lock_id node OUTSIDE the base set root
  // (the stretch's own script-driven pieces: table copies, slices, bites ...). Only nodes that change are kept. lock ids = window.lockIds order.
  const R = window.__R(), F0 = __F0__, F1 = __F1__, BASE = '__BASE__', out = { f0: F0, f1: F1, nodes: {} }, rows = {};
  for (const name of Object.keys(R.places)) window.lockIds(name);
  const vis = o => { for (let p = o; p; p = p.parent) if (!p.visible) return 0; return 1; };
  const under = o => { for (let p = o; p; p = p.parent) if (p.name === BASE) return true; return false; };
  for (let f = F0; f <= F1; f++) {
    await window.renderFrame(f); const sc = R.placeNow.scene; sc.updateMatrixWorld(true);
    sc.traverse(o => { const id = o.userData.lock_id; if (!id || under(o)) return;
      const r = rows[id] || (rows[id] = { name: o.name, v: [], m: [] }); r.v.push(vis(o)); r.m.push(Array.from(o.matrixWorld.elements).map(x => +x.toFixed(4))); });
  }
  for (const [id, r] of Object.entries(rows)) {
    const ch = r.v.some(x => x !== r.v[0]) || r.m.some(m => m.some((x, i) => Math.abs(x - r.m[0][i]) > 1e-4));
    if (ch || r.v.every(x => !x)) out.nodes[id] = r;
  }
  return out;
})()
