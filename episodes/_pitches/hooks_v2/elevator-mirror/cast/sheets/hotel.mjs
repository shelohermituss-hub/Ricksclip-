// PITCH 5 hook stand-in cast (2026-11-16): "The Mirror That Fixed a Slow Elevator", a grand hotel lobby, about 1955. Library bodies and parts, recoloured.
// Period check 1950s (hat, neckwear, facial hair):
//   janitor  grey cotton coveralls with a bib and brass buttons, work shirt collar, leather tool belt; soft grey service cap (library police cap, NO badge);
//            grey bushy moustache (any era). No tie (a workman).
//   owner    navy double-breasted PINSTRIPE suit, white shirt, gold tie, white pocket square, gold watch chain; no hat indoors (his own hotel);
//            oiled slicked-back hair (1920s-50s) and a pencil moustache (1930s-50s). FAT body = the boss at first sight.
//   watchman (guest 1) camel suit, brown tie, brown FEDORA (1930s-50s). Clean-shaven.
//   lady     (guest 2) teal shirtwaist dress with a white Peter Pan collar and a belt, knee skirt (1950s); victory-roll hair (1940s-early 50s). No hat.
//   sailor   (guest 3) navy sailor's whites and the white sailor cap (1900-1960 library outfit), on shore leave. Clean-shaven.
import { wear, HATS2 } from '../head_wear.mjs';
import { O, SK, skPat, WHITE } from '../outfit_lib.mjs';
import { withFace } from '../face_gear.mjs';

const GREY = '#8d939d', GREYD = '#646b77', BRASS = '#d9a93a', NAVY = '#26315a', GOLD = '#e2b13c', CAMEL = '#c69a5e', TEAL = '#1f8f86', LEATHER = '#6e4527';
O('janitor1955', 'Hotel janitor: grey coveralls with bib, brass buttons, tool belt (1950s)', '1900-1960', 'm', [GREY, GREYD, BRASS],
  [['shirtCollar', '#a3a9b3'], ['bib', 'b', 'c'], ['pocket', .5, .3, { c: '#7c838e', pens: 1 }], ['nameTag', -.48, .32, '#f3ead6'], ['toolBelt', LEATHER, .78], ['seams']]);
O('owner1955', 'Hotel owner: navy pinstripe double-breasted suit, gold tie, watch chain (1950s)', '1900-1960', 'm', [NAVY, WHITE, GOLD],
  [['pin', '#d8dcf0', 11, .5], ['lapels', '#2f3b6a', WHITE, 'tie', 'c'], ['buttons', 2, '#1a1e33', .62, .8, .32], ['pocket', .5, .42, { c: '#2f3b6a', hankie: WHITE }], ['chain', GOLD, .66, .5]]);
O('guest1955', 'Hotel guest: camel suit, brown tie (1950s)', '1900-1960', 'm', [CAMEL, '#f3ead6', '#6e3a1e'],
  [['lapels', '#b88a50', '#f3ead6', 'tie', 'c'], ['buttons', 2, '#5a3a1e', .64, .82], ['pocket', .5, .44, { c: '#b88a50', hankie: '#f3ead6' }], ['pocket', -.56, .7, { c: '#b88a50', flap: 1 }]]);
O('lady1955', 'Hotel guest: teal shirtwaist dress, white Peter Pan collar, belt (1950s)', '1900-1960', 'f', [TEAL, WHITE, '#1a4f4a'],
  [['peterPan', 'b'], ['buttons', 4, 'b', .26, .62], ['belt', 'c', 'round', .66, GOLD]],
  { skirt: P => SK('knee', P.a, { pat: skPat.pleats(), flare: 1.5, folds: 3, hem: '#1a4f4a' }) });

// the soft service cap: the library police cap recoloured grey, its gold badge taken off (a janitor, not a policeman)
const workCap = Object.assign(PP => { const a = HATS2.police(PP); if (PP.view !== 'back' && a.length > 3) a.splice(2, 1); return a; }, HATS2.police, { label: 'Soft grey service cap (no badge)' });
const base = spec => ({ form: 'standard', face: 'standard', views: true, sideFarArm: true, ...spec });

export const TITLE = 'Pitch 5 stand-ins: the janitor, the owner and the queue (1955)';
export const CAST = [
  wear(withFace(base({ name: 'janitor', label: 'The Janitor', size: 'standard', outfit: 'janitor1955', outfitPal: { a: GREY, b: GREYD, c: BRASS } }), { stache: 'bushy', col: '#d4d0d8' }),
    'baldTufts', { col: '#d4d0d8', hat: workCap, hatCol: '#7a808b' }),
  wear(withFace(base({ name: 'owner', label: 'The Hotel Owner', size: 'fat', outfit: 'owner1955', outfitPal: { a: NAVY, b: WHITE, c: GOLD } }), { stache: 'pencil', col: '#221a20' }),
    'slickBack', { col: '#221a20' }),
  wear(base({ name: 'watchman', label: 'Guest with the watch', size: 'thin', outfit: 'guest1955' }), 'sidePart', { col: '#4a3222', hat: 'fedora', hatCol: '#7a5434', bandCol: '#3a2418' }),
  wear(base({ name: 'lady', label: 'Guest, arms crossed', size: 'standard', outfit: 'lady1955' }), 'victoryRolls', { col: '#9a4a24' }),
  wear(base({ name: 'sailor', label: 'Sailor on leave', size: 'standard', outfit: 'sailor' }), 'sidePart', { col: '#3a2a20', hat: 'sailor' }),
];
