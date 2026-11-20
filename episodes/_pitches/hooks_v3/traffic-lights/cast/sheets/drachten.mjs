// PITCH 1 board stand-in cast (2026-11-16): "The Town That Tore Down Its Traffic Lights", Drachten (Friesland, NL), about 2003. Library bodies and parts.
// Period check 2003 (hat, neckwear, facial hair):
//   worker     Dutch road-crew ORANGE overall with silver reflective bands (standard on Dutch roads by the 1990s), yellow hard hat, blond Frisian
//              chin beard + moustache. No tie. THE HERO: the only orange-and-yellow figure in the film.
//   drogist    shop coat in pale blue with a name tag and pens (a Dutch drugstore keeper), no hat, grey side-part, rimless glasses (2000s).
//   oldman     grandpa cardigan (brown) over a shirt, grey comb-over, bushy grey moustache: the loudest doubter.
//   lady       teal zip fleece (2000s), short grey-blonde perm: the second doubter.
//   cyclist1   denim jacket, messy fair hair (teen, 2003). cyclist2 red puffer jacket, ponytail.
import { O } from '../outfit_lib.mjs';
import { wear } from '../head_wear.mjs';
import { withFace } from '../face_gear.mjs';
import { withGear } from '../head_gear.mjs';

const BLUE = '#a8c8e8', BLUED = '#6e94c0', WHITE = '#f6f4f0';
O('drogist2003', 'Drugstore keeper: pale blue shop coat, name tag, pens (2000s)', '1990-today', 'u', [BLUE, WHITE, BLUED],
  [['shirtCollar', WHITE], ['buttons', 3, BLUED, .5, .9], ['pocket', .5, .4, { c: BLUED, pens: 1 }], ['nameTag', -.48, .36, '#ffffff'], ['pocket', -.5, .78, { c: BLUED }]]);

const base = spec => ({ form: 'standard', face: 'standard', views: true, sideFarArm: true, ...spec });
export const TITLE = 'Pitch 1 stand-ins: the road worker, the drugstore keeper and the doubters (Drachten 2003)';
export const CAST = [
  withGear(withFace(base({ name: 'worker', label: 'The Road Worker', size: 'standard', outfit: 'roadWorker' }), { beard: 'short', stache: 'walrus', col: '#e8c060' }), 'buzz', { col: '#e8c060', helmet: 'hardhat' }),
  wear(withFace(base({ name: 'drogist', label: 'The Drugstore Keeper', size: 'fat', outfit: 'drogist2003' }), { acc: ['squareGlasses'], col: '#9a9aa0' }), 'sidePart', { col: '#9a9aa0' }),
  wear(withFace(base({ name: 'oldman', label: 'Doubter, cardigan', size: 'thin', outfit: 'grandpa' }), { stache: 'bushy', col: '#d4d0d8' }), 'combOver', { col: '#d4d0d8' }),
  wear(base({ name: 'lady', label: 'Doubter, fleece', size: 'standard', outfit: 'fleece', outfitPal: { a: '#1f8f86', b: '#1a4f4a', c: '#f2d23a' } }), 'perm', { col: '#d8c8a0' }),
  wear(base({ name: 'cyclist1', label: 'Cyclist, denim', size: 'thin', outfit: 'denimJacket' }), 'moptop', { col: '#d8b060' }),
  wear(base({ name: 'cyclist2', label: 'Cyclist, red puffer', size: 'standard', outfit: 'puffer', outfitPal: { a: '#d8322a', b: '#2a2a30', c: '#c8ced6' } }), 'ponytail', { col: '#5a3a24' }),
];
