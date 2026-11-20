// PITCH 4 stand-in cast (2026-11-16): "The Surgery Where the Surgeon Did Nothing", a Houston operating room, 2002. Library bodies and parts, recoloured.
// Period check 2002 (hat, neckwear, facial hair):
//   surgeon  SURGICAL GREEN scrubs (v-neck top, chest pocket with two pens, name badge, drawstring waist), a tie-back green SCRUB CAP (skull cap,
//            the tails knotted at the back), a pleated paper SURGICAL MASK with ties, rectangular wire glasses (late 1990s-2000s). Clean-shaven.
//   nurse    CEIL-BLUE scrubs (2000s scrub nurse), a printed bouffant cap (cartoon prints were everywhere by 2002), her paper mask PULLED DOWN
//            under the chin (so her mouth shows the stare). Hair in a low bun under the cap.
import { wear } from '../head_wear.mjs';
import { O, WHITE } from '../outfit_lib.mjs';
import { withFace } from '../face_gear.mjs';

const INK = '#2a1a1f', f = v => (+v).toFixed(1);
const GREEN = '#3d9a72', GREEND = '#2a7656', CEIL = '#79aee0', CEILD = '#4f86c0', MASK = '#bfe0ee', MASKD = '#8fbfd6';
const P = (d, fill, sw = 7) => `<path d="${d}" fill="${fill}" stroke="${INK}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"/>`;
const L = (d, sw = 3.4, col = INK) => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;

O('scrubsOR2002', 'Surgeon: surgical green scrubs, v-neck, chest pocket with pens, badge, drawstring (2002)', '1980-today', 'u', [GREEN, WHITE, GREEND],
  [['vneck', '#f4f4f0', .3], ['pocket', .5, .34, { c: '#48a87e', pens: 1 }], ['nameTag', -.46, .34, '#f3ead6'], ['rope', 'c', .84], ['hem', 'c', .05], ['seams']]);
O('scrubsNurse2002', 'Scrub nurse: ceil-blue scrubs, v-neck, three pockets, badge (2002)', '1980-today', 'u', [CEIL, WHITE, CEILD],
  [['vneck', '#f4f4f0', .32], ['pocket', .46, .36, { c: '#8bbbe8', pens: 1 }], ['pocket', -.5, .7, { c: '#8bbbe8' }], ['pocket', .5, .7, { c: '#8bbbe8' }], ['nameTag', -.46, .38], ['hem', 'c', .04]]);

// the surgeon's tie-back scrub cap: a snug dome over the whole head down to the brow, a turned cuff, the two tails knotted at the back of the head
const scrubCap = Object.assign(PP => { const v = PP.view, c = PP.wearCol || GREEN, y = PP.brimY + 4, w = PP.widthAt(y) + 5, top = PP.crownY - 14;
  const dome = P(`M${f(-w)},${f(y)} C${f(-w * 1.08)},${f(top + 30)} ${f(-w * .5)},${f(top)} 0,${f(top)} C${f(w * .5)},${f(top)} ${f(w * 1.08)},${f(top + 30)} ${f(w)},${f(y)} Q0,${f(y + 12)} ${f(-w)},${f(y)} Z`, c, 7);
  const cuff = P(`M${f(-w)},${f(y - 20)} Q0,${f(y - 10)} ${f(w)},${f(y - 20)} L${f(w)},${f(y)} Q0,${f(y + 12)} ${f(-w)},${f(y)} Z`, '#54b088', 6);
  const seam = L(`M0,${f(top + 6)} L0,${f(y - 22)}`, 3, '#246448');
  const tails = v === 'side' ? [P(`M${f(-w + 4)},${f(y - 14)} q-30,-4 -46,14 q22,0 40,-2 Z`, c, 5), P(`M${f(-w + 4)},${f(y - 10)} q-26,16 -30,44 q14,-14 32,-34 Z`, c, 5), `<circle cx="${f(-w + 2)}" cy="${f(y - 12)}" r="9" fill="${c}" stroke="${INK}" stroke-width="5"/>`]
    : v === 'back' ? [P(`M-6,${f(y - 14)} q-26,10 -30,46 q16,-12 30,-36 Z M6,${f(y - 14)} q26,10 30,46 q-16,-12 -30,-36 Z`, c, 5), `<circle cx="0" cy="${f(y - 14)}" r="10" fill="${c}" stroke="${INK}" stroke-width="5"/>`] : [];
  return [dome, cuff, seam, ...tails]; }, { label: 'Tie-back surgical scrub cap (green)', era: '1970s-today' });

// the nurse's printed bouffant cap: a puffy elastic cap with a gathered edge and a small print of hearts and stars
const bouffant = Object.assign(PP => { const v = PP.view, c = PP.wearCol || '#f6d8e6', y = PP.brimY + 2, w = PP.widthAt(y) + 10, top = PP.crownY - 40;
  const puff = P(`M${f(-w)},${f(y)} C${f(-w * 1.3)},${f(top + 50)} ${f(-w * .6)},${f(top)} 0,${f(top)} C${f(w * .6)},${f(top)} ${f(w * 1.3)},${f(top + 50)} ${f(w)},${f(y)} Q0,${f(y + 14)} ${f(-w)},${f(y)} Z`, c, 7);
  const gath = L(Array.from({ length: 9 }, (_, i) => { const x = -w + 8 + i * (2 * w - 16) / 8; return `M${f(x)},${f(y - 2)} l${i % 2 ? 4 : -4},-14`; }).join(' '), 3, '#b06a8a');
  const print = []; for (let i = 0; i < 9; i++) { const x = -w * .7 + (i % 3) * w * .7 + (i % 2 ? 10 : -6), yy = top + 26 + Math.floor(i / 3) * 26;
    print.push(i % 2 ? `<path d="M${f(x)},${f(yy + 4)} l-7,-7 a4,4 0 0 1 7,-3 a4,4 0 0 1 7,3 Z" fill="#e2446c"/>` : `<circle cx="${f(x)}" cy="${f(yy)}" r="4.5" fill="#3aa0d8"/>`); }
  return v === 'back' ? [puff, gath] : [puff, gath, ...print]; }, { label: 'Printed bouffant scrub cap', era: '1990s-today' });

// pleated paper surgical mask over nose and mouth (face coordinates: head radius 100, eyes y -19, mouth y 34), ties to the back of the head
const maskUp = Object.assign(({ view }) => view === 'side'
  ? [P('M-8,-2 L74,-6 Q92,26 78,60 Q40,78 -8,66 Z', MASK, 6), L('M2,16 L80,12 M0,32 L84,30 M2,48 L80,48', 2.6, MASKD), L('M-8,4 Q-50,-16 -92,-14 M-8,58 Q-50,52 -90,40', 3.6, '#e8f4f8')]
  : [P('M-60,-4 Q0,-12 60,-4 Q68,34 52,62 Q0,84 -52,62 Q-68,34 -60,-4 Z', MASK, 6), L('M-56,14 Q0,8 56,14 M-58,32 Q0,26 58,32 M-52,50 Q0,46 52,50', 2.6, MASKD),
     L('M-8,-9 Q0,-14 8,-9', 4, '#e8f4f8'), L('M-60,0 L-96,-14 M-56,58 L-94,40 M60,0 L96,-14 M56,58 L94,40', 3.4, '#e8f4f8')], { label: 'Pleated surgical mask (worn)' });
// the same mask pulled down under the chin, its ties still over the ears
const maskDown = Object.assign(({ view }) => view === 'side'
  ? [P('M0,74 L64,70 Q74,92 60,110 Q30,120 0,110 Z', MASK, 6), L('M6,88 L66,86 M6,100 L60,100', 2.4, MASKD)]
  : [P('M-50,74 Q0,68 50,74 Q56,98 42,114 Q0,126 -42,114 Q-56,98 -50,74 Z', MASK, 6), L('M-46,88 Q0,84 46,88 M-44,102 Q0,98 44,102', 2.4, MASKD), L('M-50,78 L-94,22 M50,78 L94,22', 3.2, '#e8f4f8')], { label: 'Surgical mask pulled down under the chin' });

const base = spec => ({ form: 'standard', face: 'standard', views: true, sideFarArm: true, ...spec });
export const TITLE = 'Pitch 4 stand-ins: the surgeon and the scrub nurse (Houston, 2002)';
export const CAST = [
  wear(withFace(base({ name: 'surgeon', label: 'The Surgeon', size: 'fat', outfit: 'scrubsOR2002', outfitPal: { a: GREEN, b: WHITE, c: GREEND } }), { acc: [maskUp, 'squareGlasses'], col: '#5a4030' }),
    'buzz', { col: '#5a4030', hat: scrubCap, hatCol: GREEN }),
  wear(withFace(base({ name: 'nurse', label: 'The Scrub Nurse', size: 'standard', outfit: 'scrubsNurse2002', outfitPal: { a: CEIL, b: WHITE, c: CEILD } }), { acc: [maskDown], col: '#3a2418' }),
    'lowBun', { col: '#3a2418', hat: bouffant, hatCol: '#f6d8e6' }),
];
