// s7_dallas.js: S7 THE FALSE WIN (frames 1576-1754, plan rows 49-53, script line 13), the DALLAS yard at hot noon (NO light), BOARD round.
// S7 stretch builder 2026-11-21. Builds the shared set (sets/dallas.js, unchanged, LITE) and adds ONLY this stretch's story motion:
//   - the REPAINT: the lime truck's own paint goes red from the nose back (assets.js setPaint paint 'half': A red ahead of the edge, B lemon behind):
//     edge sweeps on "back" (f1629-1648) to the last yellow patch at the rear, held while the fat painter pats it (f1650-1658), then covered (f1658-1664)
//   - STILLNESS f1730-1745: nothing in the world moves (the trucks and boards are static; no mist built in this round)
//   - the set ladder is switched off (boards.ladder false: in the set as built it covers UP TO 3x); the three-board tally stands (n 3)
import { build as dallasBuild } from './dallas.js';
const sm = x => x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x);
export const S7 = { E0: 1629, E1: 1648, PAT: 1650, E2: 1658, E3: 1664, EDGE0: -4.4, EDGE1: 2.9, EDGE2: 4.6 };
export const edgeAt = f => f < S7.E0 ? S7.EDGE0 : f < S7.E1 ? S7.EDGE0 + (S7.EDGE1 - S7.EDGE0) * sm((f - S7.E0) / (S7.E1 - S7.E0))
  : f < S7.E2 ? S7.EDGE1 : S7.EDGE1 + (S7.EDGE2 - S7.EDGE1) * sm((f - S7.E2) / (S7.E3 - S7.E2));
export async function build(THREE, scene, film, ctx) {
  const D = await dallasBuild(THREE, scene, film, ctx);
  const red = D.red, lime = D.lime;
  function update(f) {
    // the paint frame workaround (assets.js not edited; LECONS_TECHNIQUES.md 2026-11-20): uInvRoot every frame for both trucks
    for (const T of [red, lime]) { if (!T) continue; const m0 = T.group.getObjectByProperty('isMesh', true); if (m0 && m0.onBeforeRender) m0.onBeforeRender(null, scene); }
    if (lime) lime.setPaint({ paint: 'half', edge: edgeAt(f), a: '#D3141C', b: '#E3EA22' });
  }
  return { anchors: D.anchors, update };
}
