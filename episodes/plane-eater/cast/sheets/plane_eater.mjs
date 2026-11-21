// FILM CAST (character-artist, 2026-11-21, NOT locked by CB): "The Man Who Ate An Airplane", a French airfield, 1978-1980.
// Built ONLY from the locked package (three-size bodies, outfit_lib parts, hair_lib, head_wear, face_gear). The package is NOT edited:
// this film's recipes, small parts, two face pieces (fork-tine moustache, half-moon glasses), the beard prop in 4 sizes and the three
// new faces are registered HERE at load (same method as yellow-fire-trucks/cast/sheets/firetrucks.mjs and _style_test/cast/sheets/styletest.mjs).
// This file is copied next to the package (TMP/sheets/ or the film's .puppet_cache/sheets/), so imports are '../<module>.mjs'.
// COLOUR RULE (lead, PICTURE_PLAN v2): TOMATO RED #D8342A only on Michel (bow tie + napkin checks). Navy = plane stripe + Michel's shirt stripes only.
// PERIOD CHECK, France 1978-80: Breton marinière with boat neck, high-waisted trousers on braces, waxed stage moustache; short white hospital
// coat over a knitted waistcoat and tie, half-moon reading glasses; aero-club mechanic's olive coverall, grey cap with a wing badge.
import { wear, HATS2 } from '../head_wear.mjs';
import { withFace } from '../face_gear.mjs';
import { O, PART } from '../outfit_lib.mjs';
import { EXT, FACES, brush, shade } from '../char2d.mjs';

const INK = '#2a1a1f', f = v => (+v).toFixed(1);
let NID = 0; const nid = p => 'pe' + p + (NID++);
// ---------- people palette (LOOK_BIBLE not written yet: taken from PICTURE_PLAN v2 + props/PROPS.md scene colours) ----------
const TOMATO = '#D8342A', TOMATOD = '#a8241d';                                   // MICHEL ONLY
const WHITE = '#f4f3ee', NAVY = '#26325e', BLACK = '#2c2a33', BLACKL = '#45434d';  // Breton white = the Cessna white family, navy = the plane stripe
const COAT = '#f2f3f1', COATD = '#dfe3e6', GREYV = '#8b8d93', GREYVD = '#6d6f76', GREEN = '#2f5a3e', BROWNB = '#6a4a32';
const OLIVE = '#6f7542', OLIVEL = '#848a54', OLIVED = '#555a31', SILV = '#c4c8d0', CREAM = '#ece3c8', RAG = '#f0c43a', RAGD = '#c99a1e', OIL = '#2b2a24';
const H_MICHEL = '#27232b', H_DOC = '#ecebe6', H_OWNER = '#5b4636', CAPG = '#8d9096';

// =========================== SMALL PARTS (registered here; library files unchanged) ===========================
// MICHEL: the red-and-white GINGHAM napkin tucked into his collar (a triangle on the chest; tied at the nape in the back view)
PART.napkin = (A, c = TOMATO, v0 = .13, v1 = .64, half = .5) => {
  if (A.back) { const x = A.cx, y = A.Y(.16), k = A.k;   // the two tied corners at the nape
    return [`<path d="M${f(x)},${f(y)} L${f(x - 30 * k)},${f(y + 26 * k)} L${f(x - 8 * k)},${f(y + 30 * k)} Z" fill="${c}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`,
      `<path d="M${f(x)},${f(y)} L${f(x + 26 * k)},${f(y + 30 * k)} L${f(x + 6 * k)},${f(y + 32 * k)} Z" fill="#f6f4ef" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`,
      `<ellipse cx="${f(x)}" cy="${f(y + 2)}" rx="${f(11 * k)}" ry="${f(8 * k)}" fill="${TOMATOD}" stroke="${INK}" stroke-width="3"/>`]; }
  const hw = (A.side ? half * .62 : half) * A.w, x = A.side ? A.cx + A.dir * A.w * .32 : A.cx, y0 = A.Y(v0), y1 = A.Y(v1), id = nid('n');
  const d = `M${f(x - hw)},${f(y0)} Q${f(x)},${f(y0 + 14)} ${f(x + hw)},${f(y0)} L${f(x + hw * .1)},${f(y1 - 8)} Q${f(x)},${f(y1 + 6)} ${f(x - hw * .1)},${f(y1 - 8)} Z`;
  A.defs.push(`<clipPath id="${id}"><path d="${d}"/></clipPath>`);
  const s = 15 * A.k; let chk = '';
  for (let xx = x - hw - s * .3; xx < x + hw; xx += s * 2) chk += `<rect x="${f(xx)}" y="${f(y0 - 10)}" width="${f(s)}" height="${f(y1 - y0 + 30)}" fill="${c}" opacity=".62"/>`;
  for (let yy = y0 + s * .2; yy < y1 + 10; yy += s * 2) chk += `<rect x="${f(x - hw - 10)}" y="${f(yy)}" width="${f(2 * hw + 20)}" height="${f(s)}" fill="${c}" opacity=".62"/>`;
  return [`<path d="${d}" fill="#f8f6f1"/>`, `<g clip-path="url(#${id})">${chk}<path d="${d}" fill="none" stroke="${TOMATOD}" stroke-width="5" stroke-dasharray="6 5" opacity=".55" transform="translate(0 2)"/></g>`,
    `<path d="${d}" fill="none" stroke="${INK}" stroke-width="3.4" stroke-linejoin="round"/>`,
    `<path d="M${f(x - hw * .55)},${f(y0 + 9)} q${f(hw * .2)},${f(18 * A.k)} ${f(hw * .14)},${f(40 * A.k)} M${f(x + hw * .5)},${f(y0 + 9)} q${f(-hw * .16)},${f(16 * A.k)} ${f(-hw * .1)},${f(36 * A.k)}" fill="none" stroke="${INK}" stroke-width="2.2" opacity=".55" stroke-linecap="round"/>`];   // two tuck folds
};
// MICHEL: brace buttons (small white buttons where the black braces meet the high waistband)
PART.braceBtns = (A, v = .62) => { const us = A.back ? [-.16, .16] : A.side ? [A.dir * .3] : [-.5, .5];
  return us.map(u => `<circle cx="${f(A.X(u))}" cy="${f(A.Y(v) - 6)}" r="${f(6 * A.k)}" fill="#f3f1ea" stroke="${INK}" stroke-width="2.4"/>`); };
// MICHEL: a crisp pressed crease down the high-waisted trousers + a pinstripe waistband edge
PART.waistband = (A, v = .6, c = BLACKL) => [`<path d="M${f(A.x0)},${f(A.Y(v) + 6)} Q${f(A.cx)},${f(A.Y(v) + 16)} ${f(A.x1)},${f(A.Y(v) + 6)}" fill="none" stroke="${c}" stroke-width="2.4" stroke-dasharray="6 5"/>`];
// DOCTOR: knitted rib of the grey waistcoat inside the open coat V (short rib lines), two waistcoat buttons
PART.knitV = (A, c = GREYVD) => A.back || A.side ? [] : [[-.26, .22], [-.18, .34], [.18, .34], [.26, .22]].map(([u, v]) => `<path d="M${f(A.X(u))},${f(A.Y(.1))} L${f(A.X(u * .85))},${f(A.Y(v + .1))}" stroke="${c}" stroke-width="2.4" stroke-linecap="round" opacity=".8"/>`)
  .concat([.4, .48].map(v => `<circle cx="${f(A.X(-.07))}" cy="${f(A.Y(v))}" r="${f(4.5 * A.k)}" fill="${GREYVD}" stroke="${INK}" stroke-width="2"/>`));
// DOCTOR: two pens clipped in the breast pocket (blue + black: red stays Michel's), silver clips
PART.pens = (A, u = .5, v = .38) => A.back ? [] : [['#2f5fa8', -.07], ['#2c2a33', .06]].map(([c, du]) => { const x = A.X(u + du), y = A.Y(v);
  return `<rect x="${f(x - 5 * A.k)}" y="${f(y - 26 * A.k)}" width="${f(10 * A.k)}" height="${f(34 * A.k)}" rx="${f(4 * A.k)}" fill="${c}" stroke="${INK}" stroke-width="2.4"/><path d="M${f(x + 3 * A.k)},${f(y - 22 * A.k)} l0,${f(20 * A.k)}" stroke="${SILV}" stroke-width="2.4" stroke-linecap="round"/>`; });
// DOCTOR: ONE ODD BUTTON (signature detail): the lowest coat button is a mismatched brown one sewn on with dark thread
PART.oddButton = (A, v = .9) => A.back ? [] : [`<circle cx="${f(A.cx + (A.side ? A.dir * A.w * .55 : 0))}" cy="${f(A.Y(v))}" r="${f(7 * A.k)}" fill="${BROWNB}" stroke="${INK}" stroke-width="2.6"/>`,
  `<path d="M${f(A.cx + (A.side ? A.dir * A.w * .55 : 0) - 3)},${f(A.Y(v) - 3)} l6,6 M${f(A.cx + (A.side ? A.dir * A.w * .55 : 0) + 3)},${f(A.Y(v) - 3)} l-6,6" stroke="${INK}" stroke-width="1.8"/>`];
// DOCTOR: the coat back = centre vent + half-belt with two buttons (a designed back)
PART.coatBack = (A, c = COATD) => !A.back ? [] : [`<rect x="${f(A.X(-.56))}" y="${f(A.Y(.6))}" width="${f(A.w * 1.12)}" height="${f(A.H * .07)}" rx="4" fill="${c}" stroke="${INK}" stroke-width="2.8"/>`,
  ...[-.44, .44].map(u => `<circle cx="${f(A.X(u))}" cy="${f(A.Y(.635))}" r="${f(5.5 * A.k)}" fill="#f6f6f3" stroke="${INK}" stroke-width="2.2"/>`),
  `<path d="M${f(A.cx)},${f(A.Y(.82))} L${f(A.cx)},${f(A.b + 20)}" stroke="${INK}" stroke-width="2.6"/>`];
// OWNER: aero-club wing patch (cream wings + a little propeller hub on an olive-dark oval, stitched edge); on the back a big one between the shoulders
const wing = (x, y, r, c, hub = OLIVED) => `<path d="M${f(x)},${f(y)} Q${f(x - r * .7)},${f(y - r * .55)} ${f(x - r * 1.5)},${f(y - r * .35)} Q${f(x - r * 1.1)},${f(y - r * .05)} ${f(x - r * 1.35)},${f(y + r * .05)} Q${f(x - r * .9)},${f(y + r * .25)} ${f(x)},${f(y + r * .2)} Q${f(x + r * .9)},${f(y + r * .25)} ${f(x + r * 1.35)},${f(y + r * .05)} Q${f(x + r * 1.1)},${f(y - r * .05)} ${f(x + r * 1.5)},${f(y - r * .35)} Q${f(x + r * .7)},${f(y - r * .55)} ${f(x)},${f(y)} Z" fill="${c}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(r * .28)}" fill="${SILV}" stroke="${INK}" stroke-width="2"/><path d="M${f(x)},${f(y - r * .55)} L${f(x)},${f(y + r * .55)}" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`;
PART.wingPatch = (A, u = -.5, v = .32) => { if (A.side) return []; if (A.back) { const x = A.cx, y = A.Y(.24), r = 30 * A.k;
    return [`<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(r * 1.8)}" ry="${f(r * .95)}" fill="${OLIVED}" stroke="${INK}" stroke-width="3"/>`, `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(r * 1.65)}" ry="${f(r * .8)}" fill="none" stroke="${CREAM}" stroke-width="2" stroke-dasharray="5 4"/>`, wing(x, y + 3, r, CREAM)]; }
  const x = A.X(u), y = A.Y(v), r = 16 * A.k;
  return [`<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(r * 1.8)}" ry="${f(r * 1.05)}" fill="${OLIVED}" stroke="${INK}" stroke-width="2.6"/>`, `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(r * 1.6)}" ry="${f(r * .85)}" fill="none" stroke="${CREAM}" stroke-width="1.6" stroke-dasharray="4 3"/>`, wing(x, y + 2, r, CREAM)]; };
// OWNER: oil smudges and finger-wipe streaks where his hands touch the cloth (soft, low opacity: wear, not a texture)
PART.oil = (A) => { const pts = A.back ? [[.35, .7, 22], [-.5, .9, 16]] : [[-.3, .66, 20], [.42, .82, 15], [.62, .5, 11]];
  return [...pts.map(([u, v, r]) => `<ellipse cx="${f(A.X(u))}" cy="${f(A.Y(v))}" rx="${f(r * A.k)}" ry="${f(r * .7 * A.k)}" fill="${OIL}" opacity=".2" transform="rotate(-15 ${f(A.X(u))} ${f(A.Y(v))})"/>`),
    ...(A.back ? [] : [0, 1, 2].map(i => `<path d="M${f(A.X(.66) + i * 9 * A.k)},${f(A.Y(.7))} q${f(3 * A.k)},${f(26 * A.k)} ${f(-2 * A.k)},${f(44 * A.k)}" stroke="${OIL}" stroke-width="${f(5 * A.k)}" stroke-linecap="round" opacity=".22" fill="none"/>`))]; };
// OWNER: the YELLOW POLISHING RAG (signature piece) stuffed in his right hip pocket, hanging down the hip: front, 3/4, side and back
PART.yellowRag = (A, u = -.7) => { const x = A.side ? A.cx - A.dir * A.w * .62 : A.back ? A.X(.5) : A.X(u), y = A.Y(A.back ? .7 : .66), k = A.k;   // back view: out of the right back pocket (screen right)
  return [`<path d="M${f(x - 22 * k)},${f(y)} L${f(x + 22 * k)},${f(y - 4)} L${f(x + 30 * k)},${f(y + 78 * k)} Q${f(x + 14 * k)},${f(y + 92 * k)} ${f(x + 6 * k)},${f(y + 72 * k)} Q${f(x - 6 * k)},${f(y + 96 * k)} ${f(x - 26 * k)},${f(y + 76 * k)} Z" fill="${RAG}" stroke="${INK}" stroke-width="3.4" stroke-linejoin="round"/>`,
    `<path d="M${f(x - 10 * k)},${f(y + 14 * k)} l3,${f(52 * k)} M${f(x + 12 * k)},${f(y + 10 * k)} l5,${f(54 * k)}" stroke="${RAGD}" stroke-width="2.4" fill="none"/>`,
    `<path d="M${f(x - 14 * k)},${f(y + 30 * k)} q8,4 14,0" stroke="${OIL}" stroke-width="3" opacity=".35" fill="none" stroke-linecap="round"/>`,
    `<path d="M${f(x - 26 * k)},${f(y + 2)} L${f(x + 26 * k)},${f(y - 2)}" stroke="${OLIVED}" stroke-width="6" stroke-linecap="round"/>`]; };

// =========================== RECIPES (outfit_lib parts + the parts above) ===========================
// MICHEL: Breton marinière (navy on white, boat neck), black high-waisted trousers on black braces with white buttons, red bow tie, red gingham napkin
O('peMichel', 'Michel: Breton stripe shirt, black high-waisted trousers on braces, tomato-red bow tie + gingham napkin (France 1978)', '1970s', 'm', [WHITE, NAVY, BLACK],
  [['stripesH', 'b', 7, .4, .04, .6], ['crew', 'a'], ['low', 'c', .6], ['waistband', .6], ['suspenders', BLACK], ['braceBtns', .62], ['napkin', TOMATO], ['bow', TOMATO, .14, .3], ['seams']]);
// DOCTOR: short white hospital coat worn open over a grey knitted waistcoat and a dark green tie; pens in the breast pocket, stethoscope, name tag,
// two hip pockets, one odd brown button, a designed back (half-belt + vent)
O('peDoctor', 'Doctor: short white coat open over a grey knitted waistcoat and dark green tie (France 1978)', '1970s', 'm', [COAT, GREYV, GREEN],
  [['lapels', '#e7eaed', GREYV, 'tie', GREEN], ['knitV'], ['pocket', .5, .38, { c: '#f6f7f8', st: '#9aa0aa' }], ['pens', .5, .38], ['nameTag', -.5, .4, '#ffffff'], ['stetho'],
   ['buttons', 3, '#f6f6f3', .62, .82], ['oddButton', .94], ['pocket', -.6, .72, { c: '#f6f7f8', st: '#9aa0aa' }], ['pocket', .6, .72, { c: '#f6f7f8', st: '#9aa0aa' }], ['hem', COATD, .05], ['coatBack'], ['seams']]);
// OWNER: aero-club mechanic's olive coverall: collar, silver zip, name tag over a flap pocket, wing patch, belt, oil wear, yellow rag in the hip pocket, big wing on the back
O('peOwner', 'Owner / mechanic: olive coverall, zip, wing patch, belt, oil wear, yellow rag in the hip pocket (France 1978)', '1970s', 'm', [OLIVE, OLIVED, SILV],
  [['shirtCollar', OLIVEL], ['zip', SILV, .12], ['wingPatch', -.5, .32], ['nameTag', .5, .26, '#efeee8'], ['pocket', .5, .38, { c: OLIVEL, flap: 1, btn: SILV }], ['belt', OLIVED, 'sq', .64, SILV], ['oil'], ['yellowRag', -.9], ['seams']]);

// =========================== FACE PIECES ===========================
const PF = (d, fill, sw = 5.5) => `<path d="${d}" fill="${fill}" stroke="${INK}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"/>`;
const LN = (d, sw, col = INK, op = 1) => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"${op < 1 ? ` stroke-opacity="${op}"` : ''}/>`;
// MICHEL's waxed handlebar whose tips curl UP and SPLIT INTO TWO FORK TINES each side (signature detail); a wax shine on the body. Mouth at y 34 stays free.
const forkStache = Object.assign(({ col }) => [
  ...[-1, 1].map(s => LN(`M${s * 44},18 Q${s * 68},20 ${s * 66},-6`, 9.5) + LN(`M${s * 44},18 Q${s * 68},20 ${s * 66},-6`, 4.6, col)),
  ...[-1, 1].map(s => LN(`M${s * 66},-4 L${s * 72},-24 M${s * 66},-4 L${s * 59},-23`, 7.5) + LN(`M${s * 66},-4 L${s * 72},-24 M${s * 66},-4 L${s * 59},-23`, 3.2, col)),
  PF('M0,12 Q-18,3 -34,11 Q-46,17 -50,12 Q-52,26 -34,29 Q-16,31 0,23 Q16,31 34,29 Q52,26 50,12 Q46,17 34,11 Q18,3 0,12 Z', col),
  LN('M-36,15 Q-22,10 -8,15 M10,15 Q22,11 32,14', 2.4, '#ffffff', .75), LN(`M-66,-2 l-1,-8 M66,-2 l1,-8`, 1.8, '#ffffff', .6)], { label: 'Waxed fork-tine handlebar (Michel)', era: '1970s stage' });
// MICHEL's one oiled curl falling on the brow (fixed on the head; turns with the view)
const browCurl = Object.assign(({ view, col }) => ({ fixed: view === 'back' ? [] : [view === 'side'
  ? PF('M60,-82 Q38,-74 44,-56 Q50,-48 57,-53 Q50,-58 52,-65 Q55,-76 60,-82 Z', col, 4.2)
  : PF('M-4,-98 Q-30,-86 -22,-66 Q-14,-57 -7,-65 Q-15,-70 -13,-79 Q-9,-90 -4,-98 Z', col, 4.2)] }), { label: 'Oiled curl on the brow' });
// DOCTOR's HALF-MOON reading glasses LOW on the nose (eyes peek over the flat top); 'slid' = pushed down to the nose tip (shock habit)
const halfMoon = (dy = 0) => Object.assign(({ view }) => { const y = -8 + dy;
  return [...(view === 'side' ? [] : [LN(`M-62,${y + 2} L-100,${y - 18} M62,${y + 2} L100,${y - 18}`, 4.5)]),
    ...[-1, 1].map(s => `<path d="M${s * 38 - 24},${y} L${s * 38 + 24},${y} A24,20 0 0,1 ${s * 38 - 24},${y} Z" fill="#dff1fa" fill-opacity=".14" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`),
    LN(`M-14,${y + 1} Q0,${y - 6} 14,${y + 1}`, 5.2), LN(`M-52,${y + 6} q6,6 14,6 M24,${y + 6} q6,6 14,6`, 2.4, '#ffffff', .8)]; }, { label: 'Half-moon reading glasses' });
// OWNER beard PROP in four sizes (the two-year time-lapse clock). Same drawing grammar as face_gear beards (one inked shape from the jaw, ragged
// lower edge, short dark ticks), never wider than the head; the length is the prop's job. back view: hidden behind the body.
const beardProp = (len, w, seed) => Object.assign(({ view, col }) => {
  if (view === 'back') return []; let r0 = seed * 9301 + 49297; const rnd = () => (r0 = (r0 * 9301 + 49297) % 233280) / 233280;
  const top = 84, y0 = 40, dk = shade(col, .58), xe = y => Math.sqrt(Math.max(0, 100 * 100 - y * y)) - 3, o = [];
  const rag = (x0, x1) => { let s = ''; for (let k = 0; k <= 12; k++) { const t = k / 12; s += `L${f(x0 + (x1 - x0) * t)},${f(len * .9 + Math.sin(t * Math.PI) * len * .06 + (k % 2 ? 10 + rnd() * 12 : 0))} `; } return s; };
  if (view === 'side') { const xf = xe(y0 + 26) - 2;
    o.push(PF(`M${f(xf)},${f(y0 + 26)} Q${f(xf + 14)},${f(len * .45)} ${f(w * .5 + 34)},${f(len * .88)} ${rag(w * .5 + 34, -4)}Q${f(-26)},${f(len * .5)} ${f(-14)},${f(y0 - 12)} L${f(8)},${f(y0 - 14)} Q${f(22)},${f(top + 6)} 56,${f(top + 4)} Q${f(xf - 14)},${f(top + 2)} ${f(xf)},${f(y0 + 26)} Z`, col, 7.5)); }
  else { const xs = xe(y0);
    o.push(PF(`M${f(-xs)},${f(y0)} Q${f(-xs + 6)},${f(len * .4)} ${f(-w)},${f(len * .86)} ${rag(-w, w)}Q${f(xs - 6)},${f(len * .4)} ${f(xs)},${f(y0)} Q70,${f(top + 2)} 0,${f(top)} Q-70,${f(top + 2)} ${f(-xs)},${f(y0)} Z`, col, 7.5)); }
  const n = Math.round(8 + len / 22), x0 = view === 'side' ? 4 : -w * .8, xw = view === 'side' ? 70 : w * 1.6;
  for (let k = 0; k < n; k++) { const x = x0 + rnd() * xw, y = top + 18 + rnd() * (len * .8 - top - 20); o.push(LN(rnd() < .55 ? `M${f(x)},${f(y)} l4,12 l4,-12` : `M${f(x)},${f(y)} l${f(-3 + rnd() * 6)},${f(10 + rnd() * 8)}`, 2.8, dk, .9)); }
  o.push(LN(`M${f(view === 'side' ? 20 : -w * .4)},${f(top + 30)} Q${f(view === 'side' ? 26 : -w * .3)},${f(len * .5)} ${f(view === 'side' ? 22 : -w * .45)},${f(len * .8)}`, 3, '#ffffff', .35));   // one soft shine strand on the lit side
  return o; }, { label: `Beard prop ${len}`, era: 'time-lapse' });
// sizes in head units (head radius 100; standard body): S chin, M chest, L belly, XL knees (the plan's "beard to his knees")
export const BEARD_SIZES = { S: 140, M: 220, L: 300, XL: 410 };   // measured on the standard card: S upper chest, M belly, L hem, XL knees
const BEARD = { S: beardProp(BEARD_SIZES.S, 62, 3), M: beardProp(BEARD_SIZES.M, 60, 5), L: beardProp(BEARD_SIZES.L, 56, 7), XL: beardProp(BEARD_SIZES.XL, 54, 9) };

// =========================== HEAD WEAR ===========================
// OWNER: grey cotton cap = the library baseball cap with its letter disc removed, a little silver WING BADGE on the front (signature), stitched peak
const ownerCap = Object.assign(PP => { const out = []; for (const s of HATS2.baseball({ ...PP, wearCol: CAPG })) { if (/<text/.test(s)) { if (out.length && /circle/.test(out[out.length - 1]) && /#f/i.test(out[out.length - 1])) out.pop(); continue; } out.push(s); }
  if (PP.view === 'back') return out; const y = PP.brimY - 30, x = PP.view === 'side' ? 40 : PP.v34 ? 22 : 0, r = PP.view === 'side' ? 11 : 14;
  return [...out, `<g transform="translate(${x},${f(y)}) scale(${PP.view === 'side' ? .6 : 1},1)">${wing(0, 0, r, '#e9ecf0', '#8d9096')}</g>`]; }, { label: 'Grey cotton cap with a silver wing badge', era: '1950s-1980s' });

// =========================== THE THREE NEW FACES (episode presets, built on the locked face style) ===========================
// They use the template's eyes and brows; three new MOUTH drawings and two new FX are registered here into char2d's EXT (the package file is untouched).
// Face units: faceKit space (eyes at fx +-dx, mouth at my = ey + 41); the rig scales it x1.3 round the face centre. F.side: -1 = screen left (default
// in front, the lit cheek), turned views = the facing side.
const c0 = F => F.side || -1;
EXT.mouth.peChew = ({ mx, my, sq, F }) => { const c = c0(F), m = mx - c * 5;    // closed, pushed away from the full cheek, lips pressed on the bite
  return [brush(m - 13 * sq, my + 2, m - c * 2, my - 3, m + 11 * sq, my + 1, 5.2, { tip: .4 }), `<path d="M${f(m - c * 13 * sq)},${f(my - 2)} q${f(-c * 3)},4 0,8" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`,
    brush(m - 6 * sq, my + 13, m, my + 16, m + 6 * sq, my + 13, 3, { tip: .4 })]; };   // a little chin dimple from the working jaw
EXT.fx.peCheek = ({ fx, ey, dx, F }) => { const c = c0(F), bx = fx + c * (dx + 29), by = ey + 40, r = 18;   // the cheek BULGE: the food ball pushes the cheek past the head line
  return [`<ellipse cx="${f(bx)}" cy="${f(by)}" rx="${r + 1}" ry="${r + 2}" fill="#ffffff"/>`,
    `<path d="M${f(bx - c * 4)},${f(by - r - 1)} A${r},${r + 1} 0 0,${c > 0 ? 1 : 0} ${f(bx - c * 4)},${f(by + r + 1)}" fill="none" stroke="${INK}" stroke-width="4.4" stroke-linecap="round"/>`,
    `<path d="M${f(bx - c * r * .62)},${f(by - r * .5)} Q${f(bx - c * r * .95)},${f(by)} ${f(bx - c * r * .62)},${f(by + r * .5)}" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round" opacity=".8"/>`,
    `<path d="M${f(bx + c * 3)},${f(by - r * .55)} q${f(c * 6)},4 ${f(c * 7)},11" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>`]; };
EXT.mouth.peYuck = ({ mx, my, sq }) => [brush(mx - 17 * sq, my + 7, mx - 5 * sq, my - 5, mx + 5 * sq, my + 1, 5.2, { tip: .4 }), brush(mx + 5 * sq, my + 1, mx + 12 * sq, my + 3, mx + 18 * sq, my + 11, 4.6, { tip: .35 }),
  `<path d="M${f(mx - 8 * sq)},${f(my + 9)} Q${f(mx - 1)},${f(my + 15)} ${f(mx + 7 * sq)},${f(my + 9)}" fill="none" stroke="${INK}" stroke-width="2.8" stroke-linecap="round"/>`];   // lip pushed out under a lopsided frown
EXT.fx.peWrinkle = ({ fx, ey }) => [0, 1, 2].map(i => `<path d="M${f(fx - 8 + i)},${f(ey + 5 + i * 5)} q${f(8 - i)},${-3 + i * .5} ${f(16 - 2 * i)},0" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round" opacity=".75"/>`);
EXT.mouth.peJaw = ({ mx, my, sq }) => [`<path d="M${f(mx - 20 * sq)},${f(my - 8)} Q${f(mx)},${f(my - 14)} ${f(mx + 20 * sq)},${f(my - 8)} Q${f(mx + 25 * sq)},${f(my + 28)} ${f(mx)},${f(my + 46)} Q${f(mx - 25 * sq)},${f(my + 28)} ${f(mx - 20 * sq)},${f(my - 8)} Z" fill="${INK}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`,
  `<path d="M${f(mx - 15 * sq)},${f(my - 7)} Q${f(mx)},${f(my - 12)} ${f(mx + 15 * sq)},${f(my - 7)} L${f(mx + 14 * sq)},${f(my - 2)} Q${f(mx)},${f(my - 6)} ${f(mx - 14 * sq)},${f(my - 2)} Z" fill="#ffffff"/>`,
  `<ellipse cx="${f(mx + 2)}" cy="${f(my + 34)}" rx="${f(11 * sq)}" ry="6.5" fill="#9a6874"/>`];   // tongue a muted mauve (red stays Michel's)
Object.assign(FACES, {
  peChew:      { eyes: 'happy', brows: [[6, -2, 5], [9, -3, 6]], mouth: 'peChew', fx: ['peCheek'] },                       // content chewing, the bite in one cheek
  peChewHard:  { eyes: 'squeeze', brows: [[-2, 8, 0, 1.1], [-2, 8, 0, 1.1]], mouth: 'peChew', fx: ['peCheek', 'joyTears'] }, // the tire: chewing hard, eyes watering
  peDisgust:   { eyes: ['lidHalf', 'squint'], brows: [[-4, 8, 0, 1.1], [12, -2, 5, 1.1]], mouth: 'peYuck', fx: ['peWrinkle'] },   // polite disgust (airline meal)
  peJawDrop:   { eyes: 'shock', brows: [[24, -1, 9, 1.1], [26, -1, 9, 1.1]], mouth: 'peJaw' },                             // the owner's jaw drop
});
export const FACES_EP = ['peChew', 'peChewHard', 'peDisgust', 'peJawDrop'];

// =========================== DESIGNED BACKS ===========================
// outfit_lib draws only its own BACKOK parts on the back (the set is private to the package), so this film's back designs go through the castkit
// backOver hook (back view only, over the body) with a body context rebuilt from B; hw = body half width in card px per size (measured on the cards).
const bA = (B, hw) => { const t = B.top, H = B.bot - B.top; return { cx: B.cx, t, b: B.bot, H, w: hw, k: Math.max(.75, Math.min(1.35, hw / 104)), back: true, side: false, dir: B.dir || 1, view: 'back', defs: B.defs,
  X: u => B.cx + u * hw, Y: v => t + H * (.11 + .89 * v), x0: B.cx - hw, x1: B.cx + hw, grad: c => c }; };
const BACK = {
  michel: B => { const A = bA(B, 96); return [...PART.napkin(A), ...PART.braceBtns(A, .62)]; },                       // napkin corners tied at the nape, brace buttons
  doctor: B => PART.coatBack(bA(B, 150)),                                                                               // half-belt with two buttons + vent
  owner: B => { const A = bA(B, 122); return [...PART.wingPatch(A), ...PART.oil(A), ...PART.yellowRag(A)]; },           // big aero-club wing, oil wear, the rag out of the back pocket
};

// =========================== PEOPLE ===========================
const base = spec => ({ form: 'standard', face: 'standard', views: true, sideFarArm: true, ...spec });
const person = (spec, hair, hairCol, o = {}) => { let s = base(spec); if (o.face) s = withFace(s, { col: hairCol, ...o.face });
  return wear(s, hair, { col: hairCol, ...(o.hat ? { hat: o.hat, hatCol: o.hatCol, hatScale: o.hatScale, hatDrop: o.hatDrop } : {}), ...(o.pieces ? { pieces: o.pieces, pieceCol: o.pieceCol, pieceAccent: o.pieceAccent } : {}) }); };
const MICHEL = { outfit: 'peMichel', outfitPal: { a: WHITE, b: NAVY, c: BLACK }, backOver: BACK.michel }, DOC = { outfit: 'peDoctor', outfitPal: { a: COAT, b: GREYV, c: GREEN }, backOver: BACK.doctor }, OWN = { outfit: 'peOwner', outfitPal: { a: OLIVE, b: OLIVED, c: SILV }, backOver: BACK.owner };
const ownerHead = beard => ({ face: { beard }, hat: ownerCap, hatDrop: -6, pieces: ['earPencil'] });

export const TITLE = 'The Man Who Ate An Airplane: cast (French airfield, 1978-1980)';
export const CAST = [
  person({ name: 'michel', label: 'MICHEL "Monsieur Mangetout" (thin): Breton stripes, red bow tie + gingham napkin, fork-tine moustache', size: 'thin', ...MICHEL }, 'slickBack', H_MICHEL, { face: { stache: forkStache, acc: [browCurl] } }),
  person({ name: 'doctor', label: 'THE DOCTOR (fat): short white coat, grey knit waistcoat, green tie, half-moon glasses', size: 'fat', ...DOC }, 'baldTufts', H_DOC, { face: { acc: [halfMoon(0)] } }),
  person({ name: 'doctorSlid', label: 'THE DOCTOR, glasses slid to the nose tip (row 23 double take)', size: 'fat', ...DOC }, 'baldTufts', H_DOC, { face: { acc: [halfMoon(16)] } }),
  person({ name: 'owner', label: 'THE OWNER / mechanic (standard): olive coverall, grey wing cap, yellow rag, stubble', size: 'standard', ...OWN }, 'curlyCrop', H_OWNER, ownerHead('stubble')),
  person({ name: 'ownerBeardS', label: 'Owner, beard prop S (time-lapse step 1)', size: 'standard', ...OWN }, 'curlyCrop', H_OWNER, ownerHead(BEARD.S)),
  person({ name: 'ownerBeardM', label: 'Owner, beard prop M (step 2)', size: 'standard', ...OWN }, 'curlyCrop', H_OWNER, ownerHead(BEARD.M)),
  person({ name: 'ownerBeardL', label: 'Owner, beard prop L (step 3)', size: 'standard', ...OWN }, 'curlyCrop', H_OWNER, ownerHead(BEARD.L)),
  person({ name: 'ownerBeardXL', label: 'Owner, beard prop XL to the knees (step 4, to the end)', size: 'standard', ...OWN }, 'curlyCrop', H_OWNER, ownerHead(BEARD.XL)),
];
