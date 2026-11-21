(async () => {
  // cine/dump_scene.js: run by render_gpu.mjs --eval after the still of ONE frame. Returns the camera, every visible cast card (its drawn
  // texture as PNG, its 4 corners in world space, tint), the held props, the hose tube, the visible sprites and the top-level set nodes.
  // three.js space (Y up); the Blender side converts with (x, y, z) -> (x, -z, y).
  const R = window.__R(), out = { cam: {}, cards: {}, nodes: [], sprites: [], meshes: {} };
  const cam = R.camera; cam.updateMatrixWorld(true);
  out.cam = { m: Array.from(cam.matrixWorld.elements), fov: cam.fov, aspect: cam.aspect, near: cam.near, view: cam.view || null, zoom: cam.zoom, frame: R.frame };
  const png = img => { const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; c.getContext('2d').drawImage(img, 0, 0); return c.toDataURL('image/png'); };
  for (const [who, card] of Object.entries(R.cards)) {
    if (!card.mesh.visible) continue;
    card.mesh.updateMatrixWorld(true); const p = card.mesh.geometry.attributes.position, uv = card.mesh.geometry.attributes.uv, corners = [], uvs = [];
    for (let i = 0; i < p.count; i++) { const v = new (cam.position.constructor)(p.getX(i), p.getY(i), p.getZ(i)).applyMatrix4(card.mesh.matrixWorld); corners.push([v.x, v.y, v.z]); uvs.push([uv.getX(i), uv.getY(i)]); }
    const idx = card.mesh.geometry.index ? Array.from(card.mesh.geometry.index.array) : null;
    const map = card.mesh.material.map;
    out.cards[who] = { corners, uvs, idx, png: png(map.image), flipY: map.flipY, color: card.mesh.material.color.getHexString(), type: card.mesh.material.type,
      blob: card.blob.visible ? Array.from(card.blob.matrixWorld.elements) : null, legs3d: !!(card.legs3d && card.legs3d.visible), pos: [card.mesh.position.x, card.mesh.position.y, card.mesh.position.z] };
  }
  const sc = R.placeNow.scene;
  for (const ch of sc.children) { ch.updateMatrixWorld(true); out.nodes.push({ name: ch.name, type: ch.type, visible: ch.visible, m: Array.from(ch.matrixWorld.elements), kids: ch.children.slice(0, 6).map(k => k.name) }); }
  sc.traverse(o => {
    if (o.isSprite && o.visible && o.material.opacity > 0.01) out.sprites.push({ p: [o.position.x, o.position.y, o.position.z], s: o.scale.x, o: o.material.opacity, c: o.material.color.getHexString() });
    if (o.name && /^phfd_|^s1_air_hose$/.test(o.name)) { o.updateMatrixWorld(true); out.meshes[o.name + '#' + Object.keys(out.meshes).length] = { m: Array.from(o.matrixWorld.elements), visible: o.visible, parent: o.parent ? o.parent.name : null };
      if (o.name === 's1_air_hose') { const g = o.geometry; out.hose = { pos: Array.from(g.attributes.position.array).map(v => +v.toFixed(4)), idx: Array.from(g.index.array) }; } }
  });
  return out;
})()
