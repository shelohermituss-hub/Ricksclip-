// PITCH 3 hook stand-in cast (2026-11-16): "The Room Filled With Smoke and Nobody Moved", Latane and Darley, Columbia University, 1968.
// Library bodies and parts, recoloured. Period check 1968 (hat, neckwear, facial hair):
//   student  (THE HERO) mustard crew-neck lambswool sweater over a white oxford button-down (collar points out), late-60s MOP-TOP, clean-shaven, no hat
//            indoors. The only warm saturated colour in the room, so he reads first.
//   calmA    (actor 1) grey herringbone tweed sport coat, white shirt, NARROW dark knit tie (1960s), short side part, a briar PIPE (pipes were common on
//            1960s campuses), clean-shaven. Muted.
//   calmB    (actor 2) navy blazer with brass buttons, pale blue shirt, narrow maroon tie, FLAT-TOP crew cut (1950s-60s), square black-frame glasses. Muted.
import { wear } from '../head_wear.mjs';
import { O, WHITE } from '../outfit_lib.mjs';
import { withFace } from '../face_gear.mjs';

const MUST = '#e2a21c', MUSTD = '#b77a10', TWEED = '#7b7f86', TWEEDD = '#5d6168', NAVY = '#26315a', BRASS = '#d9a93a', PALE = '#cfe0f4';
O('student1968', 'College student: mustard crew-neck sweater over a white oxford button-down (1968)', '1960-1980', 'm', [MUST, WHITE, MUSTD],
  [['knit', MUSTD], ['shirtCollar', WHITE], ['crew', 'c'], ['hem', MUSTD, .1]]);
O('tweed1968', 'Calm man: grey tweed sport coat, narrow knit tie (1968)', '1960-1980', 'm', [TWEED, WHITE, '#2a2a34'],
  [['pin', TWEEDD, 9, .35], ['lapels', TWEEDD, WHITE, 'tie', '#2a2a34'], ['buttons', 2, '#3a3a40', .64, .82], ['pocket', .5, .44, { c: TWEEDD, hankie: WHITE }]]);
O('blazer1968', 'Calm man: navy blazer, brass buttons, pale blue shirt, narrow maroon tie (1968)', '1960-1980', 'm', [NAVY, PALE, '#7a1e2e'],
  [['lapels', '#2f3b6a', PALE, 'tie', '#7a1e2e'], ['buttons', 2, BRASS, .64, .82], ['pocket', .5, .44, { c: '#2f3b6a', hankie: WHITE }], ['pocket', -.56, .72, { c: '#2f3b6a', flap: 1 }]]);

const base = spec => ({ form: 'standard', face: 'standard', views: true, sideFarArm: true, ...spec });
export const TITLE = 'Pitch 3 stand-ins: the student and the two calm men (Columbia 1968)';
export const CAST = [
  wear(base({ name: 'student', label: 'The Student', size: 'standard', outfit: 'student1968', outfitPal: { a: MUST, b: WHITE, c: MUSTD } }), 'moptop', { col: '#6a3e1e' }),
  wear(withFace(base({ name: 'calmA', label: 'Calm man with the pipe', size: 'standard', outfit: 'tweed1968' }), { acc: ['pipe'], col: '#2e2420' }), 'sidePart', { col: '#2e2420' }),
  wear(withFace(base({ name: 'calmB', label: 'Calm man in the blazer', size: 'standard', outfit: 'blazer1968' }), { acc: ['squareGlasses'], col: '#3a2a1e' }), 'flattop', { col: '#3a2a1e' }),
];
