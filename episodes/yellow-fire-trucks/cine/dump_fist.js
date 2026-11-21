(async () => {
  // cine/dump_fist.js: the held3d fist (3D, not on the card): every mesh with its world-space vertices, faces and colour (three.js space).
  const R = window.__R(), out = []; const sc = R.placeNow.scene;
  sc.traverse(o => { if (o.name !== 'held3d_fist') return; o.updateMatrixWorld(true);
    o.traverse(m => { if (!m.isMesh || !m.visible) return; const g = m.geometry, p = g.attributes.position, v = [];
      for (let i = 0; i < p.count; i++) { const w = new (R.camera.position.constructor)(p.getX(i), p.getY(i), p.getZ(i)).applyMatrix4(m.matrixWorld); v.push(+w.x.toFixed(5), +w.y.toFixed(5), +w.z.toFixed(5)); }
      const mt = Array.isArray(m.material) ? m.material[0] : m.material;
      out.push({ name: m.name, v, idx: g.index ? Array.from(g.index.array) : null, color: mt.color ? mt.color.getHexString() : 'ffffff', type: mt.type, rough: mt.roughness ?? null }); }); });
  return out;
})()
