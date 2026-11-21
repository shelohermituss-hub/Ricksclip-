// make_acts.mjs (animator 2026-11-21): writes moves/shared_walks_acts.json = the film.json act lines for every USES entry of moves/shared_walks.mjs
// (the pose act, one card-position act per frame the card moves, the hand-back act) and prints the numbers per use.
//   node moves/tools/make_acts.mjs        (from episodes/yellow-fire-trucks)
// A position act at frame `at` puts the card on its target at at+2 (film_plan: the move key is at+1, a 1-frame move lands one frame later).
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const MV = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'), M = await import(path.join(MV, 'shared_walks.mjs'));
const out = {}, rep = [];
for (const [k, U] of Object.entries(M.USES)) {
  const T = M.tables(k), card = T.card, pose = 'm:../../shared_walks/' + k, dir = U.climb ? -1 : M.axes(U).dir, acts = [];
  acts.push({ who: U.who, at: U.A, pose, dir, note: 'shared_walks ' + k + ': locked-feet move starts (no face key in this act: the body would start one frame late)' });
  let moves = 0, maxA = 0, maxD = 0;
  for (let g = 1; g <= U.G; g++) { const a = card[g], b = card[g - 1]; if (a.every((v, i) => v === b[i])) continue;
    acts.push({ who: U.who, at: U.A + g - 2, pos: a, move_s: 0.0334, linear: true }); moves++;
    if (!U.climb) { const AX = M.axes(U), dx = a[0] - b[0], dy = a[1] - b[1], ac = Math.abs(dx * AX.r[0] + dy * AX.r[1]); maxA = Math.max(maxA, ac); maxD = Math.max(maxD, Math.hypot(dx - (dx * AX.r[0] + dy * AX.r[1]) * AX.r[0], dy - (dx * AX.r[0] + dy * AX.r[1]) * AX.r[1])); } }
  if (U.back) acts.push({ who: U.who, at: U.back.at, pose: U.back.pose, note: 'back to the stretch move, its clock offset so it plays its own film frames' });
  out[k] = acts;
  const AX = U.climb ? null : M.axes(U);
  rep.push(`${k.padEnd(13)} ${U.who.padEnd(12)} f${U.A}-${U.A + U.G}  start ${JSON.stringify(card[0])} end ${JSON.stringify(card[U.G])}  card moves on ${moves} frames` +
    (AX ? `  path ${AX.path.toFixed(2)} m (across ${AX.across.toFixed(2)}, depth ${Math.hypot(...AX.depth.slice(0, 2)).toFixed(2)}), dir ${AX.dir}, max card step across ${(maxA * 100).toFixed(1)} / depth ${(maxD * 100).toFixed(1)} cm per frame` : `  top tread +${(card[U.G][2] - card[0][2]).toFixed(2)} m`));
}
fs.writeFileSync(path.join(MV, 'shared_walks_acts.json'), JSON.stringify(out, null, 1));
console.log(rep.join('\n'));
