(async () => {
  // export_late.js (look-finisher): run by render_gpu.mjs --frames F --eval (code with __F__ / __BASE__ replaced by export_late.sh).
  // The kit pieces that are HIDDEN when the lock is exported (cake tower, coffin, trolley ...) as a glb of the scene AT FRAME F: lock ids assigned
  // at load exactly as dump_nodes.js does, then the frame drawn (no reset to frame 0 as window.exportSet does), every visible node outside the
  // base set root cloned with its userData (lock_id -> glTF extras) and exported with its own materials (canvas textures included).
  const R = window.__R(), F = __F__, BASE = '__BASE__';
  for (const name of Object.keys(R.places)) window.lockIds(name);
  await window.renderFrame(F); const sc = R.placeNow.scene; sc.updateMatrixWorld(true);
  const { GLTFExporter } = await import('./vendor/GLTFExporter.js'), root = new sc.constructor(); root.name = 'late_' + F;
  for (const ch of sc.children) if (!ch.isLight && !ch.isCamera && ch.name !== BASE && ch.visible) root.add(ch.clone(true));
  const buf = await new GLTFExporter().parseAsync(root, { binary: true, onlyVisible: true, trs: true }), u8 = new Uint8Array(buf); let bin = '';
  for (let i = 0; i < u8.length; i += 32768) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 32768));
  return { b64: btoa(bin), n: root.children.length };
})()
