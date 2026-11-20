// FILM CAST (character-artist, 2026-11-16, phase A): "The Surgery Where the Surgeon Did Nothing", ONE Houston hospital, mid-1990s (2004 rows 45-47).
// Library bodies (three sizes / kid form), hair_lib, head_wear, face_gear and outfit_lib recipes, recoloured from LOOK_BIBLE.md. Recipes for this
// film are registered here at load (library files NOT edited); move them into the library when CB locks the cast.
// COSTUME PERIOD CHECK, mid-1990s Houston (hat, neckwear, facial hair, cut):
//   surgeon   OR green scrubs (v-neck, chest pocket + pen, drawstring) = standard US OR wear since the 1970s; tie-back cloth scrub cap (1970s-today);
//             pleated paper mask with ties (1980s-today); rectangular black frames (late 1980s-1990s). Clean-shaven. No badge photo, no logo.
//   nurse     ceil-blue scrubs (1990s scrub nurse); printed bouffant cap (cartoon/confetti prints spread in the early 1990s); paper mask under the chin;
//             glasses on a beaded chain (classic); hair in a low bun under the cap; white clogs = the kit's feet (no shoes rule).
//   patient   VETERAN, early fifties (Vietnam generation in 1995): plain navy baseball cap with NO logo (the library cap's letter removed), grey
//             chevron moustache (1970s-90s dad/cop/veteran), grey side-part; hospital gown pale blue with a small navy diamond print, snap shoulders,
//             back ties; later a mustard pique polo + khaki shorts + brown belt (1990s Texas summer). Wooden cane = held 3D prop.
//   boy       about 6: striped crew-neck tee (teal / cream, no red), navy shorts, cowlick. 1990s kid. The pink-brown knee scuff is on the hero knee prop.
//   grandkid  about 5: yellow tee + denim dungarees (1990s), pigtails.
//   climbers  three step-climbers (row 35) in 1990s casual: fat man in a striped polo, standard woman in a teal/purple 1990s track top, thin elder in
//             a grandad shirt; wristbands = held 3D rings (steel-blue / aqua / purple), limbs stay one colour.
//   g1..g5    gurney patients (row 14) in gowns of five different hospital prints; g1s..g5s the same five people in 1990s street clothes for the row-50
//             stream (cowboy hat, baseball cap, perm, flattop, bucket hat): never clones.
import { wear, HATS2 } from '../head_wear.mjs';
import { O, WHITE, PART } from '../outfit_lib.mjs';
// pocket with a BLUE and a BLACK pen (the library pocket's second pen is red; the film has ONE red = pain): registered here, library unchanged
PART.penPocket = (A, u, v, o) => [...(A.back ? [] : [[u - .1, -.07, .09, '#2f6fd0'], [u + .02, -.06, .08, '#2a2a34']].map(([uu, dv, hh, c]) => `<rect x="${f(A.X(uu))}" y="${f(A.Y(v + dv))}" width="6" height="${f(A.H * hh)}" rx="2" fill="${c}" stroke="${INK}" stroke-width="2"/>`)), ...PART.pocket(A, u, v, { ...o, pens: 0 })];
import { withFace } from '../face_gear.mjs';

const INK = '#2a1a1f', f = v => (+v).toFixed(1);
// LOOK_BIBLE colours
const GREEN = '#2f7d55', GREEND = '#215c3e', GREENL = '#3f9468', CEIL = '#8fb7e0', CEILD = '#5f8fc4', MASK = '#bfe0ee', MASKD = '#8fbfd6';
const NAVY = '#1e2a5a', GOWN = '#b9d3ec', GOWND = '#86a8cc', MUSTARD = '#d9a53a', MUSTD = '#a87a22', KHAKI = '#c2ad7a', KHAKID = '#8f7c50', BELT = '#6a4428';
const TEAL = '#2aa0a0', ORANGE = '#f09a2a', CREAM = '#f2e6c8', AQUA = '#3fc2c8', STEELB = '#5a7a9a', PURPLE = '#7a4aa8', SEA = '#4fa59a', BUTTER = '#f3e2a6', WOOD = '#8a5a32', OLIVE = '#6a7a4a';
const P = (d, fill, sw = 7) => `<path d="${d}" fill="${fill}" stroke="${INK}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"/>`;
const L = (d, sw = 3.4, col = INK) => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;

// ---------- recipes (outfit_lib parts only) ----------
O('scrubsOR1995', 'Surgeon: OR green scrubs, v-neck, chest pocket with a pen, drawstring (1990s)', '1970-today', 'u', [GREEN, WHITE, GREEND],
  [['vneck', '#f4f4f0', .3], ['penPocket', .5, .34, { c: GREENL }], ['nameTag', -.46, .34, '#f3ead6'], ['rope', 'c', .84], ['hem', 'c', .05], ['seams']]);
O('scrubsNurse1995', 'Scrub nurse: ceil-blue scrubs, v-neck, three pockets, badge (1990s)', '1980-today', 'u', [CEIL, WHITE, CEILD],
  [['vneck', '#f4f4f0', .32], ['penPocket', .46, .36, { c: '#a3c6ea' }], ['pocket', -.5, .7, { c: '#a3c6ea' }], ['pocket', .5, .7, { c: '#a3c6ea' }], ['nameTag', -.46, .38], ['hem', 'c', .04]]);
// hospital gown: pale blue cotton, a small navy diamond print (lattice + dots), white bias-bound crew neck, snap shoulders, darker hem band
O('gownPatient1995', 'Patient: hospital gown, small diamond print, bias-bound neck, snap shoulders (1990s)', '1960-today', 'u', [GOWN, NAVY, GOWND],
  [['diamonds', GOWND, 40], ['dots', 'b', 3.2, 40], ['crew', WHITE], ['scatter', 'circle', WHITE, 5, [[-.7, .1], [-.56, .1], [.56, .1], [.7, .1]]], ['hem', 'c', .06]]);
// the patient's Texas-summer outfit (rows 31-50): mustard pique polo, khaki shorts with a brown belt, a breast pocket
O('poloShorts1995', 'Mustard polo, khaki shorts, brown belt (1990s Texas summer)', '1980-today', 'm', [MUSTARD, KHAKI, BELT],
  [['polo', MUSTD, CREAM], ['pocket', -.46, .36, { c: '#e3b450', st: MUSTD }], ['low', 'b', .76], ['belt', 'c', 'sq', .72, '#c9b28a'], ['hem', KHAKID, .05]]);
O('kidStripe1995', 'Kid: striped crew tee + navy shorts (1990s)', '1980-today', 'u', [CREAM, TEAL, NAVY],
  [['stripesH', 'b', 5, .42, .1, .7], ['crew', 'b'], ['low', 'c', .74], ['hem', '#18224a', .05]]);
O('kidDungaree1995', 'Kid: yellow tee + denim dungarees (1990s)', '1980-today', 'u', ['#f2c84a', '#4f78b0', TEAL],
  [['stripesH', WHITE, 7, .35, 0, .58], ['bib', 'b', 'c'], ['emblem', 'star', 'c', .46, 11]]);
// gown prints for the five gurney patients (all hospital gowns, five different prints so the queue is never clones)
const gownVar = (k, a, b, c, print) => O(k, 'Hospital gown print ' + k, '1960-today', 'u', [a, b, c], [...print, ['crew', WHITE], ['hem', 'c', .06]]);
gownVar('gownG1', '#c8e0c4', '#3f7a4a', '#9cc096', [['dots', 'b', 3, 34]]);
gownVar('gownG2', '#efe2b0', '#7a5a2a', '#cdbb7a', [['diamonds', '#c2a868', 46]]);
gownVar('gownG3', '#d8d0ec', '#4a3a8a', '#aaa0d0', [['stripesV', '#b8acdc', 7, .25]]);
gownVar('gownG4', '#bfe4e0', '#1f6a66', '#8cc4be', [['dots', 'b', 2.6, 28], ['diamonds', '#9ccac4', 56]]);
gownVar('gownG5', '#e8d6c8', '#6a4a3a', '#c8ac98', [['stripesH', '#d2bca8', 6, .3]]);

// ---------- head pieces ----------
// the surgeon's tie-back scrub cap: snug dome down to the brow, a turned cuff, centre seam, the two tails knotted at the back
const scrubCap = Object.assign(PP => { const v = PP.view, c = PP.wearCol || GREEN, y = PP.brimY + 4, w = PP.widthAt(y) + 5, top = PP.crownY - 14;
  const dome = P(`M${f(-w)},${f(y)} C${f(-w * 1.08)},${f(top + 30)} ${f(-w * .5)},${f(top)} 0,${f(top)} C${f(w * .5)},${f(top)} ${f(w * 1.08)},${f(top + 30)} ${f(w)},${f(y)} Q0,${f(y + 12)} ${f(-w)},${f(y)} Z`, c, 7);
  const cuff = P(`M${f(-w)},${f(y - 20)} Q0,${f(y - 10)} ${f(w)},${f(y - 20)} L${f(w)},${f(y)} Q0,${f(y + 12)} ${f(-w)},${f(y)} Z`, GREENL, 6);
  const seam = L(`M0,${f(top + 6)} L0,${f(y - 22)}`, 3, GREEND);
  const tails = v === 'side' ? [P(`M${f(-w + 4)},${f(y - 14)} q-30,-4 -46,14 q22,0 40,-2 Z`, c, 5), P(`M${f(-w + 4)},${f(y - 10)} q-26,16 -30,44 q14,-14 32,-34 Z`, c, 5), `<circle cx="${f(-w + 2)}" cy="${f(y - 12)}" r="9" fill="${c}" stroke="${INK}" stroke-width="5"/>`]
    : v === 'back' ? [P(`M-6,${f(y - 14)} q-26,10 -30,46 q16,-12 30,-36 Z M6,${f(y - 14)} q26,10 30,46 q-16,-12 -30,-36 Z`, c, 5), `<circle cx="0" cy="${f(y - 14)}" r="10" fill="${c}" stroke="${INK}" stroke-width="5"/>`] : [];
  return [dome, cuff, seam, ...tails]; }, { label: 'Tie-back surgical scrub cap (green)', era: '1970s-today' });

// the nurse's printed bouffant cap: puffy, gathered edge, a confetti print of LILAC hearts (pink turned red under the EV coral light, lead 2026-11-16), sky dots and yellow stars (no red: hue kept > 25 deg from #e01e2a)
const bouffant = Object.assign(PP => { const v = PP.view, c = PP.wearCol || '#f6dcea', y = PP.brimY + 2, w = PP.widthAt(y) + 10, top = PP.crownY - 40;
  const puff = P(`M${f(-w)},${f(y)} C${f(-w * 1.3)},${f(top + 50)} ${f(-w * .6)},${f(top)} 0,${f(top)} C${f(w * .6)},${f(top)} ${f(w * 1.3)},${f(top + 50)} ${f(w)},${f(y)} Q0,${f(y + 14)} ${f(-w)},${f(y)} Z`, c, 7);
  const gath = L(Array.from({ length: 9 }, (_, i) => { const x = -w + 8 + i * (2 * w - 16) / 8; return `M${f(x)},${f(y - 2)} l${i % 2 ? 4 : -4},-14`; }).join(' '), 3, '#b07a9a');
  const print = []; for (let i = 0; i < 12; i++) { const x = -w * .75 + (i % 4) * w * .5 + (Math.floor(i / 4) % 2 ? 14 : -4), yy = top + 22 + Math.floor(i / 4) * 24, k = i % 3;
    print.push(k === 0 ? `<path d="M${f(x)},${f(yy + 4)} l-7,-7 a4,4 0 0 1 7,-3 a4,4 0 0 1 7,3 Z" fill="#b98ae0"/>` : k === 1 ? `<circle cx="${f(x)}" cy="${f(yy)}" r="4.5" fill="#4aa8e0"/>` : `<path d="M${f(x)},${f(yy - 6)} l2,4 4,1 -3,3 1,4 -4,-2 -4,2 1,-4 -3,-3 4,-1 Z" fill="#f2c040"/>`); }
  return v === 'back' ? [puff, gath, ...print.slice(0, 6)] : [puff, gath, ...print]; }, { label: 'Printed bouffant scrub cap (confetti print, no red)', era: '1990s-today' });

// plain navy baseball cap: the library cap with its front letter and white disc REMOVED (no logo), plus a SIGNATURE: one small brass pin on the
// crown's left side (an old service pin, no insignia readable) in front, 3/4 and side views
const baseCap = HATS2.baseball;
const capOf = pin => Object.assign(PP => { const parts = baseCap(PP), out = []; for (let i = 0; i < parts.length; i++) { const s = parts[i];
    if (/<text/.test(s)) { if (out.length && /circle/.test(out[out.length - 1]) && /#f/i.test(out[out.length - 1])) out.pop(); continue; } out.push(s); }
  const v = PP.view, y = PP.brimY + 2, w = PP.widthAt(y), top = PP.crownY - 38;
  if (pin && v !== 'back') { const px = v === 'side' ? -w * .25 : -w * .5, py = (y + top) / 2 + 8;
    out.push(`<circle cx="${f(px)}" cy="${f(py)}" r="9" fill="#d9b050" stroke="${INK}" stroke-width="4"/><circle cx="${f(px - 2.5)}" cy="${f(py - 2.5)}" r="2.6" fill="#fff6d0"/>`); }
  return out; }, { label: 'Plain baseball cap, no logo' + (pin ? ', brass pin' : ''), era: '1980s-1990s' });
const plainCap = capOf(true), plainCapNoPin = capOf(false);

// pleated paper surgical mask over nose and mouth (face coords: head radius 100, eyes y -19, mouth y 34), ties to the back of the head
const maskUp = Object.assign(({ view }) => view === 'side'
  ? [P('M-8,-2 L74,-6 Q92,26 78,60 Q40,78 -8,66 Z', MASK, 6), L('M2,16 L80,12 M0,32 L84,30 M2,48 L80,48', 2.6, MASKD), L('M-8,4 Q-50,-16 -92,-14 M-8,58 Q-50,52 -90,40', 3.6, '#e8f4f8')]
  : [P('M-60,-4 Q0,-12 60,-4 Q68,34 52,62 Q0,84 -52,62 Q-68,34 -60,-4 Z', MASK, 6), L('M-56,14 Q0,8 56,14 M-58,32 Q0,26 58,32 M-52,50 Q0,46 52,50', 2.6, MASKD),
     L('M-8,-9 Q0,-14 8,-9', 4, '#e8f4f8'), L('M-60,0 L-96,-14 M-56,58 L-94,40 M60,0 L96,-14 M56,58 L94,40', 3.4, '#e8f4f8')], { label: 'Pleated surgical mask (worn)' });
// the same mask pulled down under the chin, its ties still over the ears
const maskDown = Object.assign(({ view }) => view === 'side'
  ? [P('M0,74 L64,70 Q74,92 60,110 Q30,120 0,110 Z', MASK, 6), L('M6,88 L66,86 M6,100 L60,100', 2.4, MASKD)]
  : [P('M-50,74 Q0,68 50,74 Q56,98 42,114 Q0,126 -42,114 Q-56,98 -50,74 Z', MASK, 6), L('M-46,88 Q0,84 46,88 M-44,102 Q0,98 44,102', 2.4, MASKD), L('M-50,78 L-94,22 M50,78 L94,22', 3.2, '#e8f4f8')], { label: 'Surgical mask pulled down under the chin' });
// the surgeon's mask folded right down: a narrow pleated band at the neck under the jaw (mouth and smile free), ties up to the ears
const maskChin = Object.assign(({ view }) => view === 'side'
  ? [P('M4,98 L54,94 Q58,104 52,112 Q28,118 4,112 Z', MASK, 5), L('M8,105 L52,103', 2.2, MASKD), L('M4,100 Q-30,60 -44,8', 3, '#e8f4f8')]
  : [P('M-44,100 Q0,108 44,100 Q47,110 40,120 Q0,128 -40,120 Q-47,110 -44,100 Z', MASK, 5), L('M-40,111 Q0,117 40,111', 2.2, MASKD), L('M-44,102 L-94,6 M44,102 L94,6', 3, '#e8f4f8')], { label: 'Surgical mask folded down to a band at the neck' });
// the nurse's glasses on a beaded chain: thin ink rings + a gold bead chain looping down under the jaw to the ears
const chainGlasses = Object.assign(({ view }) => view === 'side'
  ? [`<circle cx="44" cy="-19" r="19" fill="none" stroke="${INK}" stroke-width="4"/>`, L('M26,-22 L-46,-28', 3.4), L('M-46,-26 Q-40,40 -10,70', 2.4, '#c9a040'), ...[0, 1, 2, 3, 4].map(i => `<circle cx="${f(-44 + i * 8)}" cy="${f(-8 + i * 18)}" r="2.6" fill="#e0b850"/>`)]
  : [`<circle cx="-36" cy="-19" r="21" fill="none" stroke="${INK}" stroke-width="4"/>`, `<circle cx="36" cy="-19" r="21" fill="none" stroke="${INK}" stroke-width="4"/>`, L('M-15,-21 Q0,-27 15,-21', 3.4),
     L('M-57,-18 Q-70,70 0,96 Q70,70 57,-18', 2.4, '#c9a040'), ...[-.8, -.5, -.2, .2, .5, .8].map(u => `<circle cx="${f(u * 60)}" cy="${f(60 + (1 - Math.abs(u)) * 34)}" r="2.8" fill="#e0b850"/>`)], { label: 'Glasses on a beaded chain' });

// gown back: centre opening with three small cloth ties (bows), drawn on the back view only (castkit backOver)
const gownBack = col => B => { const cx = B.cx, t = B.top, b = B.bot, H = b - t; const bows = [.2, .45, .7].map(v => { const y = t + H * v;
    return `<path d="M${f(cx)},${f(y)} q-22,-12 -26,2 q4,12 26,-2 Z M${f(cx)},${f(y)} q22,-12 26,2 q-4,12 -26,-2 Z" fill="${col}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><path d="M${f(cx - 3)},${f(y + 2)} l-10,22 M${f(cx + 3)},${f(y + 2)} l12,20" stroke="${col}" stroke-width="5" stroke-linecap="round"/><circle cx="${f(cx)}" cy="${f(y)}" r="5" fill="${col}" stroke="${INK}" stroke-width="3"/>`; });
  return [L(`M${f(cx)},${f(t + 20)} L${f(cx)},${f(b - 8)}`, 3.2), ...bows]; };

const base = spec => ({ form: 'standard', face: 'standard', views: true, sideFarArm: true, ...spec });
const GREY = '#9a9aa2', GREYD = '#7d7d86';
const patientHead = (spec) => wear(withFace(spec, { stache: 'chevron', col: GREY }), 'sidePart', { col: GREY, hat: plainCap, hatCol: NAVY });
const extra = (name, size, outfit, pal, hair, hairCol, opts = {}) => { const s = base({ name, label: name, ...(size ? { size } : {}), outfit, outfitPal: pal, ...(opts.spec || {}) });
  const fs = opts.face ? withFace(s, { ...opts.face, col: opts.face.col || hairCol }) : s; return wear(fs, hair, { col: hairCol, ...(opts.hat ? { hat: HATS2[opts.hat] || opts.hat, hatCol: opts.hatCol } : {}) }); };

export const TITLE = 'The Surgery Where the Surgeon Did Nothing: cast (Houston hospital, mid-1990s)';
export const CAST = [
  // HERO
  wear(withFace(base({ name: 'surgeon', label: 'The Surgeon', size: 'fat', outfit: 'scrubsOR1995', outfitPal: { a: GREEN, b: WHITE, c: GREEND } }), { acc: [maskUp, 'squareGlasses'], col: '#5a4030' }),
    'buzz', { col: '#5a4030', hat: scrubCap, hatCol: GREEN }),
  wear(withFace(base({ name: 'surgeonOff', label: 'The Surgeon (mask down: office, end)', size: 'fat', outfit: 'scrubsOR1995', outfitPal: { a: GREEN, b: WHITE, c: GREEND } }), { acc: [maskChin, 'squareGlasses'], col: '#5a4030' }),
    'buzz', { col: '#5a4030', hat: scrubCap, hatCol: GREEN }),
  // MOCKER
  wear(withFace(base({ name: 'nurse', label: 'The Scrub Nurse', size: 'standard', outfit: 'scrubsNurse1995', outfitPal: { a: CEIL, b: WHITE, c: CEILD } }), { acc: [maskDown, chainGlasses], col: '#3a2418' }),
    'lowBun', { col: '#3a2418', hat: bouffant, hatCol: '#f6dcea' }),
  // THE PATIENT (full character): gown (OR, pre-op) and polo + shorts (rows 31-50)
  patientHead(base({ name: 'patient', label: 'The Patient (gown)', size: 'thin', outfit: 'gownPatient1995', outfitPal: { a: GOWN, b: NAVY, c: GOWND }, backOver: gownBack(WHITE) })),
  patientHead(base({ name: 'patientShorts', label: 'The Patient (polo + shorts)', size: 'thin', outfit: 'poloShorts1995', outfitPal: { a: MUSTARD, b: KHAKI, c: BELT } })),
  // KIDS
  extra('boy', null, 'kidStripe1995', { a: CREAM, b: TEAL, c: NAVY }, 'cowlick', '#6a4426', { spec: { form: 'kid' } }),
  extra('grandkid', null, 'kidDungaree1995', { a: '#f2c84a', b: '#4f78b0', c: TEAL }, 'pigtails', '#7a5030', { spec: { form: 'kid' } }),
  // STEP-CLIMBERS (row 35): wristbands are held 3D rings (CAST_KEYS held_props)
  extra('climber1', 'fat', 'poloStripe', { a: STEELB, b: CREAM, c: NAVY }, 'combOver', '#4a3424', { face: { stache: 'bushy' } }),
  extra('climber2', 'standard', 'trackTop', { a: TEAL, b: WHITE, c: PURPLE }, 'perm', '#5a3a26'),
  extra('climber3', 'thin', 'grandad', { a: CREAM, b: '#3a4a7a', c: '#6a4a3a' }, 'elderGrey', '#b4b4bc'),
  // GURNEY PATIENTS (row 14), gowns; the same five people in street clothes for the row-50 stream (g*s)
  extra('g1', 'fat', 'gownG1', {}, 'baldTufts', '#8a8a90', { face: { stache: 'walrus' } }),
  extra('g2', 'standard', 'gownG2', {}, 'perm', '#3a2a22'),
  extra('g3', 'thin', 'gownG3', {}, 'flattop', '#2a2228'),
  extra('g4', 'standard', 'gownG4', {}, 'grannyBun', '#c4c4cc'),
  extra('g5', 'fat', 'gownG5', {}, 'mullet', '#7a5434', { face: { stache: 'horseshoe' } }),
  extra('g1s', 'fat', 'rancher', { a: '#6a8ab0', b: KHAKI, c: '#2a6a6a' }, 'baldTufts', '#8a8a90', { face: { stache: 'walrus' }, hat: 'cowboy', hatCol: '#c8a46a' }),
  extra('g2s', 'standard', 'blouseBow', { a: '#f2e0c0', b: TEAL, c: '#c9a040' }, 'perm', '#3a2a22'),
  extra('g3s', 'thin', 'teePocket', { a: SEA, b: CREAM, c: WOOD }, 'flattop', '#2a2228', { hat: plainCapNoPin, hatCol: ORANGE }),
  extra('g4s', 'standard', 'cardigan', { a: '#b08ac8', b: CREAM, c: '#6a4a8a' }, 'grannyBun', '#c4c4cc'),
  extra('g5s', 'fat', 'denimJacket', { a: '#4f6f9a', b: '#c9a040', c: WHITE }, 'mullet', '#7a5434', { face: { stache: 'horseshoe' }, hat: 'bucket', hatCol: OLIVE }),
];
