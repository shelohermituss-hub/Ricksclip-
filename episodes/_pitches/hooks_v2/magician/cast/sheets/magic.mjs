// hooks_v2 pitch 1 stand-in cast (2026-11-16): "The Box the Strongest Man Couldn't Lift", Robert-Houdin in French Algeria, 1856.
// PERIOD CHECK 1856 (hat, neckwear, facial hair, per character):
//  - magician (Robert-Houdin): black evening tailcoat with tails, WHITE waistcoat, white shirt front and a white bow tie (1850s evening dress),
//    a tall STOVEPIPE top hat (the 1830s-1860s shape, not the later short opera hat), clean-shaven with dark side hair (his portraits).
//  - strongman (the town's champion): a striped wool gandoura robe to the knee, a wide saffron cloth sash, a white wrapped turban (cheche), a full black moustache.
//  - crowd: an old man in a brown burnous with a white turban and a grey beard; a young man in a red chechia (the soft North African fez) with a moustache;
//    a French officer in a blue tunic and a red-and-blue kepi (French army 1850s) with an imperial moustache; a boy in a red chechia; a fat merchant
//    in a yellow turban and green robe with a short beard; a woman in a white headscarf. No modern pieces (no buttons-down shirts, no caps with peaks except the kepi).
import { wear } from '../head_wear.mjs';
import { O, SK, skPat } from '../outfit_lib.mjs';
import { withFace } from '../face_gear.mjs';
import { INK, shade, tint, brush } from '../char2d.mjs';
const f = v => (+v).toFixed(1);
const P = (d, fill, sw = 6) => `<path d="${d}" fill="${fill}" stroke="${INK}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"/>`;
const L = (d, sw = 3.2, col = INK) => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;

// THE WRAPPED TURBAN (cheche / amama): the library turban shape, but in any colour (PP.wearCol), with a tail end tucked at the side and a lit edge.
const turbanW = Object.assign(PP => { const y = PP.brimY + 10, w = PP.widthAt(y) + 18, top = PP.crownY - 70, c = PP.wearCol || '#f4eee0', d = shade(c, .74);
  const dome = P(`M${f(-w)},${f(y)} C${f(-w - 10)},${f(top - 12)} ${f(w + 10)},${f(top - 12)} ${f(w)},${f(y)} Q0,${f(y + 14)} ${f(-w)},${f(y)} Z`, c, 7.5);
  const folds = PP.view === 'back' ? [1, 2, 3].map(k => L(`M${f(-w + 6)},${f(y - k * 18)} Q0,${f(y - k * 18 + 10)} ${f(w - 6)},${f(y - k * 18)}`, 3.2, d))
    : PP.view === 'side' ? [1, 2, 3].map(k => L(`M${f(-w + 6)},${f(y - k * 20 + 8)} Q10,${f(y - k * 24)} ${f(w - 4)},${f(y - k * 12 - 10)}`, 3.2, d))
    : [1, 2, 3].map(k => L(`M${f(-w + 6)},${f(y - k * 17 + 2)} Q${f(-w * .2)},${f(y - k * 17 - 18)} ${f(w - 6)},${f(y - k * 17 - 10)}`, 3.2, d));
  const tail = PP.view === 'back' ? [] : [P(`M${f(-w + 4)},${f(y - 30)} C${f(-w - 26)},${f(y - 10)} ${f(-w - 30)},${f(y + 40)} ${f(-w - 14)},${f(y + 70)} L${f(-w + 2)},${f(y + 64)} C${f(-w - 6)},${f(y + 30)} ${f(-w - 4)},${f(y)} ${f(-w + 14)},${f(y - 14)} Z`, c, 5.5)];
  return [...tail, dome, ...folds, brush(-w * .62, y - 26, -w * .6, y - 56, -w * .3, y - 80, 6, { col: tint(c, .45) })]; }, { label: 'Wrapped turban (cheche), any colour', wraps: true });
// THE CHECHIA: soft red North African felt cap with a dark tassel (1850s Algeria), lower and rounder than an Ottoman fez.
const chechia = Object.assign(PP => { const y = PP.brimY + 4, w = PP.widthAt(y) * .9, top = PP.crownY - 40, c = PP.wearCol || '#c23a2e';
  return [P(`M${f(-w)},${f(y)} C${f(-w)},${f(top)} ${f(w)},${f(top)} ${f(w)},${f(y)} Q0,${f(y + 10)} ${f(-w)},${f(y)} Z`, c, 6.5), L(`M${f(-w * .8)},${f(y - 12)} Q0,${f(y - 2)} ${f(w * .8)},${f(y - 12)}`, 3, shade(c, .7)),
    L(`M0,${f(top + 14)} Q${f(w * .5)},${f(top + 10)} ${f(w * .62)},${f(y - 30)}`, 6, '#2a1c30'), brush(-w * .6, y - 20, -w * .5, top + 30, -w * .1, top + 18, 5, { col: tint(c, .35) })]; }, { label: 'Chechia (red felt cap, tassel)' });

// ---- outfits ----
// strongman: sand wool gandoura with indigo stripes to the knee, a wide saffron sash, a round neck opening with a braided edge
O('gandoura1856', 'Striped wool gandoura, saffron sash (Algeria 1850s)', 'Africa history', 'm', ['#efd9a8', '#33468f', '#e7a51f'],
  [['stripesV', 'b', 7, .26], ['wrap', 'b', '#efd9a8'], ['obi', 'c', '#b8321e', .6], ['seams']], { skirt: P => SK('knee', P.a, { pat: skPat.vstripes(P.b, 11, 13), flare: 1.22, folds: 3, hem: P.b, hemW: 14 }) });
// magician: black evening tailcoat, white waistcoat, white shirt front and bow tie; the TAILS hang behind the legs
const tails = col => ({ cx, bodyBot: b, view, side, dir }) => { const c = col, d = shade(col, .6);
  if (view === 'back') return [P(`M${cx - 70},${b - 90} L${cx - 6},${b - 90} L${cx - 10},${b + 250} L${cx - 58},${b + 230} Z`, c), P(`M${cx + 70},${b - 90} L${cx + 6},${b - 90} L${cx + 10},${b + 250} L${cx + 58},${b + 230} Z`, c)];
  if (side) { const s = -dir; return [P(`M${cx + s * 10},${b - 110} Q${cx + s * 90},${b + 40} ${cx + s * 96},${b + 250} L${cx + s * 40},${b + 236} Q${cx + s * 30},${b + 40} ${cx - s * 30},${b - 60} Z`, c), L(`M${cx + s * 40},${b - 40} Q${cx + s * 70},${b + 80} ${cx + s * 70},${b + 220}`, 3, d)]; }
  return [-1, 1].map(s => P(`M${cx + s * 40},${b - 100} Q${cx + s * 100},${b + 30} ${cx + s * 92},${b + 240} L${cx + s * 52},${b + 226} Q${cx + s * 48},${b + 60} ${cx + s * 10},${b - 40} Z`, c)); };
O('tailcoat1856', 'Evening tailcoat, white waistcoat, white tie (1850s stage magician)', 'Europe history', 'm', ['#24222c', '#f4f1ea', '#ffffff'],
  [['vest', 'b', .02, .3], ['lapels', '#36343f', '#ffffff', 'bow', '#ffffff'], ['buttons', 2, '#d8b45a', .64, .8], ['pocket', .52, .38, { c: '#24222c', st: '#55525e', hankie: '#ffffff' }], ['seams']], { behind: P => tails(P.a) });
// crowd robes (burnous, djellaba), the French officer's tunic
O('burnous1856', 'Brown wool burnous (Algeria 1850s)', 'Africa history', 'm', ['#8a5a36', '#e9d6b0', '#5a3a22'], [['wrap', 'b', '#e9d6b0'], ['seams'], ['stripesV', 'c', 3, .1]], { skirt: P => SK('ankle', P.a, { pat: skPat.band(P.b, 200, 10), flare: 1.25, folds: 4 }) });
O('djellabaG', 'Green djellaba, embroidered neck (Algeria 1850s)', 'Africa history', 'm', ['#3f8a5a', '#f2c94c', '#2a5a3c'], [['wrap', 'b', '#f4ead0'], ['buttons', 5, 'b', .2, .7], ['seams']], { skirt: P => SK('ankle', P.a, { pat: skPat.band(P.b, 214, 8), flare: 1.2, folds: 3 }) });
O('tunicW', 'White cotton tunic, blue trim (Algeria 1850s)', 'Africa history', 'u', ['#f4efe2', '#3a7fc4', '#c23a2e'], [['wrap', 'b', '#f4efe2'], ['seams']], { skirt: P => SK('knee', P.a, { pat: skPat.band(P.b, 100, 8), folds: 2 }) });
O('officer1856', 'French army officer: blue tunic, gold buttons (1850s)', 'Europe history', 'm', ['#2a3a7a', '#d8b45a', '#c23a2e'], [['buttons', 6, 'b', .12, .8], ['belt', '#1c1a1e', 'sq', .78, '#d8b45a'], ['epaulettes', 'b'], ['low', '#c23a2e', .9]]);
O('robeRose', 'Rose dress, white apron cloth (Algeria 1850s)', 'Africa history', 'f', ['#d0607a', '#f4efe2', '#7a3a5a'], [['wrap', 'b', '#f4efe2'], ['seams']], { skirt: P => SK('ankle', P.a, { pat: skPat.band(P.b, 180, 12), flare: 1.3, folds: 4 }) });

export const TITLE = 'Hook stand-ins: the magician, the strongman and the laughing crowd (Algeria 1856)';
const W = (spec, hair, opts, face) => face ? withFace(wear(spec, hair, opts), face) : wear(spec, hair, opts);
export const CAST = [
  W({ form: 'standard', size: 'fat', face: 'standard', views: true, sideFarArm: true, name: 'strongman', label: 'The Strongman', outfit: 'gandoura1856' }, 'buzz', { col: '#1c1418', hat: turbanW, hatCol: '#f6f0e2' }, { stache: 'bushy', col: '#1c1418' }),
  W({ form: 'standard', size: 'thin', face: 'standard', views: true, sideFarArm: true, name: 'magician', label: 'Robert-Houdin', outfit: 'tailcoat1856' }, 'slickBack', { col: '#2a1c18', hat: 'stovepipe', hatCol: '#1e1c24', bandCol: '#3a3442' }),
  W({ form: 'standard', size: 'thin', face: 'standard', views: true, name: 'oldman', label: 'Old man', outfit: 'burnous1856' }, 'buzz', { col: '#d8d4cc', hat: turbanW, hatCol: '#f2ece0' }, { beard: 'full', col: '#d8d4cc' }),
  W({ form: 'standard', size: 'standard', face: 'standard', views: true, name: 'youngman', label: 'Young man', outfit: 'tunicW' }, 'buzz', { col: '#2a1c18', hat: chechia, hatCol: '#c23a2e' }, { stache: 'chevron', col: '#2a1c18' }),
  W({ form: 'standard', size: 'standard', face: 'standard', views: true, name: 'officer', label: 'French officer', outfit: 'officer1856' }, 'sidePart', { col: '#5a3a22', hat: 'kepi', hatCol: '#c23a2e' }, { stache: 'imperial', col: '#5a3a22' }),
  W({ form: 'kid', face: 'standard', views: true, name: 'boy', label: 'Boy', outfit: 'tunicW' }, 'buzz', { col: '#2a1c18', hat: chechia, hatCol: '#d84a2e' }),
  W({ form: 'standard', size: 'fat', face: 'standard', views: true, name: 'merchant', label: 'Fat merchant', outfit: 'djellabaG' }, 'buzz', { col: '#2a1c18', hat: turbanW, hatCol: '#f2c23c' }, { beard: 'short', col: '#2a1c18' }),
  W({ form: 'lady', face: 'standard', views: true, name: 'woman', label: 'Woman', outfit: 'robeRose' }, 'lowBun', { col: '#2a1c18', hat: 'headscarf', hatCol: '#f4efe2' }),
];
