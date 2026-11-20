// Pitch 2 stand-in cast (hook frame, 2026-11-16): "Why Hot Milk Froze First", a boarding-school kitchen in Tanganyika, 1963.
// Built only from the locked kit: body forms (kid, standard), outfit library parts (dress through spec.dress), hair (hair_lib), face gear (withFace).
// PERIOD CHECK 1963, East African secondary school: boys in khaki drill short-sleeve shirts and khaki shorts (the colonial-era school uniform kept after
// independence), short cropped hair, no caps indoors, no ties for pupils; the master in a white short-sleeve shirt, a narrow dark tie (1960s), brown
// trousers, horn-rimmed spectacles, a pencil moustache (1950s-60s), close-cropped hair. Faces stay clean white (Rick, CB rule), no coloured rim.
import { OUTFITS, dress } from '../outfit_lib.mjs';
import { wear } from '../head_wear.mjs';
import { withFace } from '../face_gear.mjs';
import { shade } from '../castkit.mjs';

const KHAKI = '#c9a058', KHAKID = '#a07a3e', KHAKIL = '#dcbc7c', BROWN = '#6a4026', BRASS = '#d9a93a', NAVY = '#24376e', WHITE = '#f6f3ea', TIE = '#7a1f2a', TROUSER = '#6b5640';
const R = (base, parts, extra = {}) => ({ ...OUTFITS[base], key: base + '_milk', parts, ...extra });
// the school uniform: khaki drill shirt, two flap pockets with brown buttons, brown leather belt with a brass buckle, khaki shorts (scoutKid parts, no kerchief, no sash)
const UNIFORM = (sh = KHAKI, pk = 1) => R('scoutKid', [['low', KHAKID, .82], ['shirtCollar', 'a'], ['buttons', 3, BROWN, .3, .7], ['pocket', .46, .4, { c: shade(sh, .9), st: BROWN, flap: 1, btn: BROWN }],
  ...(pk ? [['pocket', -.46, .4, { c: shade(sh, .9), st: BROWN, flap: 1, btn: BROWN }]] : []), ['belt', BROWN, 'sq', .8, BRASS]]);
// the hero's mark: a school badge on his left pocket (yellow torch on a green shield shape: library badge circle + bolt), so he reads apart from the laughers
const HERO = R('scoutKid', [['low', KHAKID, .82], ['shirtCollar', 'a'], ['buttons', 3, BROWN, .3, .7], ['pocket', .46, .4, { c: shade(KHAKI, .9), st: BROWN, flap: 1, btn: BROWN }],
  ['pocket', -.46, .4, { c: shade(KHAKI, .9), st: BROWN, flap: 1, btn: BROWN }], ['badge', 'circle', '#2f8a4a', .46, .3, 15], ['badge', 'bolt', '#f2c230', .46, .3, 11], ['belt', BROWN, 'sq', .8, BRASS]]);
// a classmate in the school's navy V-neck pullover over the khaki shirt (Usambara highlands: cool afternoons)
const SWEATER = R('scoutKid', [['knit', shade(NAVY, .8)], ['low', KHAKID, .86], ['vneck', KHAKIL, .32], ['shirtCollar', KHAKIL], ['hem', shade(NAVY, .8), .08]]);
// the master: white short-sleeve shirt, narrow dark tie, pen in the pocket, brown belt, brown trousers
const MASTER = R('teacher', [['low', TROUSER, .74], ['shirtCollar', WHITE], ['tie', TIE], ['pocket', .5, .36, { c: shade(WHITE, .93), st: '#9a9a9a', pens: 1 }], ['buttons', 4, '#d8d4c8', .3, .7], ['belt', BROWN, 'sq', .72, BRASS]]);

const base = ({ outfit, outfitPal, ...spec }) => ({ face: 'standard', views: true, sideFarArm: true, ...spec, dress: S => dress(S, outfit, outfitPal || {}) });
const S = (spec, hair, h = {}, face) => { const s = wear(base(spec), hair, h); return face ? withFace(s, face) : s; };
const HAIR = '#1c1416';

export const TITLE = 'Pitch 2 stand-in cast: the schoolboy, three classmates, the master (Tanganyika 1963)';
export const CAST = [
  S({ name: 'boy', label: 'The Schoolboy (Erasto stand-in)', form: 'kid', outfit: HERO, outfitPal: { a: KHAKI, b: KHAKID, c: BROWN } }, 'buzz', { col: HAIR }),
  S({ name: 'kid1', label: 'Classmate 1 (pointing)', form: 'kid', outfit: UNIFORM(KHAKI), outfitPal: { a: KHAKI, b: KHAKID, c: BROWN } }, 'fade', { col: HAIR }),
  S({ name: 'kid2', label: 'Classmate 2 (sweater)', form: 'kid', outfit: SWEATER, outfitPal: { a: NAVY, b: KHAKID, c: KHAKIL } }, 'buzz', { col: HAIR }, { acc: ['freckles'], col: '#7a5a40' }),
  S({ name: 'kid3', label: 'Classmate 3 (tall, laughing)', form: 'kid', outfit: UNIFORM(KHAKIL, 0), outfitPal: { a: KHAKIL, b: KHAKID, c: BROWN } }, 'curlyCrop', { col: HAIR }),
  S({ name: 'master', label: 'The Master (glasses, arms folded)', form: 'standard', size: 'standard', outfit: MASTER, outfitPal: { a: WHITE, b: TROUSER, c: TIE } }, 'sidePart', { col: HAIR }, { stache: 'pencil', acc: ['squareGlasses'], col: HAIR }),
];
