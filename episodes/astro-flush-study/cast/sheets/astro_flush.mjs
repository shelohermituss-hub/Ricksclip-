// STUDY CAST (character-artist, 2026-11-22, PRIVATE EXERCISE, never published): the seven people of the astro-flush study, matched to the
// reference by role and costume colour. Built ONLY from the locked package (three-size bodies, outfit_lib parts, hair_lib, head_wear, face_gear).
// The package is NOT edited: this file registers its own small parts, recipes, head pieces and three faces at load (same method as
// episodes/plane-eater/cast/sheets/plane_eater.mjs). It is copied next to the package (TMP/sheets/ or .puppet_cache/sheets/): imports are '../<module>.mjs'.
import { wear, HATS2 } from '../head_wear.mjs';
import { withFace } from '../face_gear.mjs';
import { O, PART } from '../outfit_lib.mjs';
import { FACES } from '../char2d.mjs';

const INK = '#2a1a1f', f = v => (+v).toFixed(1);
// ---------- colours measured on the reference frames (median of a patch on the lit side) ----------
const YEL = '#f8d136', YELD = '#d9ae1f', RED = '#d63231', REDD = '#a82424', PUR = '#8e5bdc', PURD = '#6c3fb8';
const NAVY = '#354173', NAVYD = '#262f58', GOLD = '#e8b93a', WHITE = '#f4f3ef', SHIRTD = '#dcdde0', TIE = '#2b2c3a';
const GREEN = '#2ab29a', BLUE = '#487ede', SLATE = '#4b4f5e', HEADSET = '#3a3f4a', TAN = '#b98a5a', TAND = '#8f6a44';
const H_NEW = '#ba864c', H_CMD = '#3a3440', H_NAV = '#8a5630', H_DIR = '#342f2b', H_BOB = '#3d3042', H_ORA = '#c47346', H_DRK = '#342f2b';

// =========================== SMALL PARTS ===========================
// hand-lettered stroke letters (not a typed font): each glyph is a path in a 0..1 box
const GLY = { N: 'M0,1 L0,0 L1,1 L1,0', E: 'M1,0 L0,0 L0,1 L1,1 M0,.5 L.7,.5', W: 'M0,0 L.25,1 L.5,.35 L.75,1 L1,0', G: 'M1,.2 Q.5,-.15 .1,.3 Q-.1,.7 .3,.95 Q.7,1.1 1,.8 L1,.55 L.55,.55', U: 'M0,0 L0,.7 Q.5,1.3 1,.7 L1,0', Y: 'M0,0 L.5,.5 L1,0 M.5,.5 L.5,1' };
const letters = (txt, x, y, h, sw) => { const w = h * .62, gap = h * .22; let cx = x - (txt.length * (w + gap) - gap) / 2, o = '';
  for (const ch of txt) { if (GLY[ch]) o += `<path d="${GLY[ch]}" transform="translate(${f(cx)} ${f(y - h / 2)}) scale(${f(w)} ${f(h)})" fill="none" stroke="${INK}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`; cx += w + gap; } return o; };
// NAME PATCH: white sewn rectangle, a little crooked, two words of hand lettering ("NEW GUY"); on the wearer's left chest (screen right in front)
PART.namePatch = (A, t1 = 'NEW', t2 = 'GUY', u = .36, v = .3) => { if (A.back) return []; const k = A.k, x = A.side ? A.cx + A.dir * A.w * .34 : A.X(u), y = A.Y(v), hw = (A.side ? 28 : 46) * k, hh = 16 * k, sx = A.side ? .6 : 1;
  return [`<g transform="rotate(-7 ${f(x)} ${f(y)})"><rect x="${f(x - hw)}" y="${f(y - hh)}" width="${f(2 * hw)}" height="${f(2 * hh)}" rx="3" fill="#fbfaf6" stroke="${INK}" stroke-width="3"/>` +
    `<g transform="translate(${f(x)} 0) scale(${sx} 1) translate(${f(-x)} 0)">${letters(t1 + ' ' + t2, x, y, 13 * k, 2.2)}</g></g>`]; };
// FLAG PATCH: small striped flag with a blue canton, on the wearer's right chest (screen left)
PART.flagPatch = (A, u = -.46, v = .26) => { if (A.back || A.side) return []; const k = A.k, x = A.X(u), y = A.Y(v), w = 40 * k, h = 26 * k; let s = '';
  for (let i = 0; i < 5; i++) s += `<rect x="${f(x - w / 2)}" y="${f(y - h / 2 + i * h / 5)}" width="${f(w)}" height="${f(h / 5 + .4)}" fill="${i % 2 ? '#fbfaf6' : '#d0473f'}"/>`;
  return [s + `<rect x="${f(x - w / 2)}" y="${f(y - h / 2)}" width="${f(w * .44)}" height="${f(h * .6)}" fill="#34478f"/><rect x="${f(x - w / 2)}" y="${f(y - h / 2)}" width="${f(w)}" height="${f(h)}" fill="none" stroke="${INK}" stroke-width="2.6"/>`]; };
// MISSION PATCH: round navy patch, gold ring, gold star with an orbit swoosh
const star = (x, y, r) => { let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; d += `${i ? 'L' : 'M'}${f(x + Math.cos(a) * rr)},${f(y + Math.sin(a) * rr)} `; } return d + 'Z'; };
PART.missionPatch = (A, u = .45, v = .34, r0 = 19) => { if (A.back) return []; const k = A.k, x = A.side ? A.cx + A.dir * A.w * .36 : A.X(u), y = A.Y(v), r = r0 * k, sx = A.side ? .6 : 1;
  return [`<g transform="translate(${f(x)} 0) scale(${sx} 1) translate(${f(-x)} 0)"><circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${NAVYD}" stroke="${INK}" stroke-width="3"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(r * .8)}" fill="none" stroke="${GOLD}" stroke-width="2"/>` +
    `<path d="${star(x, y - r * .08, r * .46)}" fill="${GOLD}"/><path d="M${f(x - r * .62)},${f(y + r * .3)} Q${f(x)},${f(y + r * .75)} ${f(x + r * .62)},${f(y + r * .12)}" fill="none" stroke="#f4f3ef" stroke-width="2" stroke-linecap="round"/></g>`]; };
// shirt-front button strip with a stitched placket (flight director)
PART.placketBtns = (A, n = 4, v0 = .5, v1 = .92) => A.back || A.side ? [] : [`<path d="M${f(A.cx - 9 * A.k)},${f(A.Y(v0 - .06))} L${f(A.cx - 9 * A.k)},${f(A.b + 16)} M${f(A.cx + 9 * A.k)},${f(A.Y(v0 - .06))} L${f(A.cx + 9 * A.k)},${f(A.b + 16)}" stroke="${INK}" stroke-width="2" opacity=".55" fill="none"/>`,
  ...[...Array(n)].map((_, i) => `<circle cx="${f(A.cx)}" cy="${f(A.Y(v0 + (v1 - v0) * i / (n - 1)))}" r="${f(5 * A.k)}" fill="#fbfaf6" stroke="${INK}" stroke-width="2.4"/>`)];

// =========================== RECIPES ===========================
const jumpsuit = (key, label, pal, extra) => O(key, label, 'astro study', 'u', pal, [['shirtCollar', 'b'], ['zip', '#c9ccd6', .14], ...extra, ['belt', 'b', 'sq', .7, '#c9ccd6'], ['pocket', -.5, .8, { c: pal[1], flap: 1, btn: '#c9ccd6' }], ['pocket', .5, .8, { c: pal[1], flap: 1, btn: '#c9ccd6' }], ['seams']]);
jumpsuit('afNewGuy', 'New guy: yellow flight jumpsuit, NEW GUY name patch, flag patch', [YEL, YELD, WHITE], [['flagPatch', -.46, .3], ['namePatch', 'NEW', 'GUY', .36, .37]]);
jumpsuit('afCommander', 'Commander: red flight jumpsuit, flag patch, round mission patch', [RED, REDD, GOLD], [['flagPatch', -.46, .3], ['missionPatch', .46, .36, 21], ['epaulettes', GOLD]]);
jumpsuit('afNavigator', 'Navigator: purple flight jumpsuit, round mission patch, flag patch', [PUR, PURD, GOLD], [['flagPatch', -.46, .3], ['missionPatch', .46, .36, 21]]);
O('afDirector', 'Flight director: white shirt, dark tie, button strip, breast pocket, ID tag on the pocket', 'astro study', 'm', [WHITE, SHIRTD, TIE],
  [['shirtCollar', '#ffffff'], ['tie', 'c'], ['placketBtns', 3, .62, .92], ['pocket', .5, .36, { c: '#ffffff', st: '#9aa0aa' }], ['nameTag', -.5, .4, '#e9edf4'], ['seams']]);
const top = (key, label, pal, extra = []) => O(key, label, 'astro study', 'u', pal, [['shirtCollar', 'b'], ['polo', 'b', '#f4f3ef'], ...extra, ['low', 'c', .78], ['seams']]);
top('afCtlGreen', 'Controller (FAO): teal-green polo', [GREEN, '#1f9480', '#2b3140']);
top('afCtlBlue', 'Controller (CAPCOM): blue polo, ID tag', [BLUE, '#3566c0', '#2b3140'], [['nameTag', -.5, .4, '#e9edf4']]);
top('afCtlDark', 'Controller (GUIDO): slate polo, mission patch', [SLATE, '#3a3e4b', '#2b3140'], [['missionPatch', .46, .4, 17]]);

// =========================== HEAD WEAR / PIECES ===========================
// COMMANDER: the library baseball cap in navy, letter disc removed, a ROUND gold badge with a navy star on the front (signature)
const cmdCap = Object.assign(PP => { const out = []; for (const x of HATS2.baseball({ ...PP, wearCol: NAVY })) { if (/<text/.test(x)) { if (out.length && /circle/.test(out[out.length - 1]) && /#f/i.test(out[out.length - 1])) out.pop(); continue; } out.push(x); }
  if (PP.view === 'back') return out; const y = PP.brimY - 34, x = PP.view === 'side' ? 44 : PP.v34 ? 22 : 0, r = 18;
  return [...out, `<g transform="translate(${x},${f(y)}) scale(${PP.view === 'side' ? .6 : 1},1)"><circle cx="0" cy="0" r="${r}" fill="${GOLD}" stroke="${INK}" stroke-width="4"/><path d="${star(0, 0, 11)}" fill="${NAVYD}"/></g>`]; }, { label: 'Navy cap with a round gold star badge' });
// HEADSET BAND: the dark band over the hair that joins the two ear cups of the library headset (face_gear A.headset draws cups + mic boom)
const headsetBand = Object.assign(Pp => { if (Pp.view === 'back') { const pts = []; for (let k = 0; k <= 20; k++) pts.push(Pp.onHair(200 + 140 * k / 20, 6)); const d = 'M' + pts.map(p => `${f(p[0])},${f(p[1])}`).join(' L'); return [`<path d="${d}" fill="none" stroke="${INK}" stroke-width="15" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${HEADSET}" stroke-width="8" stroke-linecap="round"/>`]; }
  const a0 = Pp.view === 'side' ? -78 : 200, a1 = Pp.view === 'side' ? -102 : 340, pts = []; for (let k = 0; k <= 20; k++) pts.push(Pp.onHair(a0 + (a1 - a0) * k / 20, 6));
  if (Pp.view === 'side') { const [x, y] = Pp.onHair(-90, 6); const d = `M${f(x)},${f(y)} Q${f(x - 6)},${f(y / 2)} -2,-14`; return [`<path d="${d}" fill="none" stroke="${INK}" stroke-width="15" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${HEADSET}" stroke-width="8" stroke-linecap="round"/>`]; }
  const d = 'M' + pts.map(p => `${f(p[0])},${f(p[1])}`).join(' L'); return [`<path d="${d}" fill="none" stroke="${INK}" stroke-width="15" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${HEADSET}" stroke-width="8" stroke-linecap="round"/>`]; }, { label: 'Headset band over the hair' });
// NAVIGATOR: tan sun-visor (band round the head + short brim) with a small gold clip; the bun stays free above it
const navVisor = Object.assign(Pp => { const v = Pp.view, y = Pp.brimY + 2, w = Pp.widthAt(y) + 5, o = [];
  o.push(`<path d="M${f(-w)},${f(y - 26)} Q0,${f(y - 6)} ${f(w)},${f(y - 26)} L${f(w)},${f(y - 6)} Q0,${f(y + 16)} ${f(-w)},${f(y)} Z" fill="${TAN}" stroke="${INK}" stroke-width="5.5" stroke-linejoin="round"/>`);
  if (v === 'back') return o;
  if (v === 'side') o.push(`<path d="M${f(w - 14)},${f(y - 14)} L${f(w + 40)},${f(y - 2)} Q${f(w + 44)},${f(y + 8)} ${f(w + 34)},${f(y + 10)} L${f(w - 14)},${f(y + 4)} Z" fill="${TAND}" stroke="${INK}" stroke-width="5.5" stroke-linejoin="round"/>`);
  else o.push(`<path d="M${f(-w + 4)},${f(y - 8)} Q0,${f(y + 44)} ${f(w - 4)},${f(y - 8)} Q0,${f(y + 14)} ${f(-w + 4)},${f(y - 4)} Z" fill="${TAND}" stroke="${INK}" stroke-width="5.5" stroke-linejoin="round"/>`);
  o.push(`<rect x="${v === 'side' ? 30 : -14}" y="${f(y - 36)}" width="28" height="20" rx="3" fill="${GOLD}" stroke="${INK}" stroke-width="3.5" transform="rotate(-12 ${v === 'side' ? 44 : 0} ${f(y - 26)})"/>`); return o; }, { label: 'Tan sun visor with a gold clip' });
// NAVIGATOR: yellow pencil pushed THROUGH the bun (bun centre from hair_lib messyBun: front (0,-130), side (-60,-104), back (0,-110)); point up-right
const bunPencil = Object.assign(Pp => { const v = Pp.view, [x, y] = v === 'side' ? [-62, -106] : v === 'back' ? [0, -112] : [0, -132], s = v === 'back' ? -1 : 1;
  return [`<g transform="translate(${x} ${y}) scale(${s} 1) rotate(-24) scale(1.5)"><path d="M-52,-6 L40,-6 L40,6 L-52,6 Z" fill="#f2c230" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><path d="M40,-6 L58,0 L40,6 Z" fill="#f3dfc0" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M52,-2 L58,0 L52,2 Z" fill="${INK}"/><rect x="-60" y="-6" width="10" height="12" rx="2" fill="#e58a8a" stroke="${INK}" stroke-width="3"/></g>`]; }, { label: 'Pencil through the bun' });

// =========================== FACES (kit parts only; film.json face 'k:<name>') ===========================
Object.assign(FACES, {
  afEyeRoll: { eyes: 'lidHalf', brows: [[-4, 4, 0, 1.1], [-4, 4, 0, 1.1]], mouth: 'flatXL' },                  // the deadpan half-lid look (nearest to the reference eye roll; no pupils-up eyes in the kit)
  afSweat:   { eyes: 'bigOval', brows: [[12, -10, 3, 1.1], [12, -10, 3, 1.1]], mouth: 'gasp', fx: ['sweat'] }, // one sweat drop, small round mouth
  afGrit:    { eyes: 'lidHalf', brows: [[-8, 14, -2, 1.3], [-8, 14, -2, 1.3]], mouth: 'teeth', teethW: 34, teethH: 12, fx: ['vein'] },   // the director's clenched-teeth shout
});
export const FACES_EP = ['afEyeRoll', 'afSweat', 'afGrit'];

// =========================== PEOPLE ===========================
const base = spec => ({ form: 'standard', face: 'standard', views: true, sideFarArm: true, ...spec });
const person = (spec, hair, hairCol, o = {}) => { let s = base(spec); if (o.face) s = withFace(s, { col: hairCol, ...o.face });
  return wear(s, hair, { col: hairCol, ...(o.hat ? { hat: o.hat, hatCol: o.hatCol, hatScale: o.hatScale, hatDrop: o.hatDrop } : {}), ...(o.pieces ? { pieces: o.pieces } : {}) }); };
const HS = { face: { acc: ['headset'] }, pieces: [headsetBand] };
export const TITLE = 'astro-flush study cast (private exercise)';
export const CAST = [
  person({ name: 'newguy', label: 'NEW GUY (standard): yellow jumpsuit, NEW GUY patch, flag patch, tousled brown hair', size: 'standard', outfit: 'afNewGuy', outfitPal: { a: YEL, b: YELD, c: WHITE } }, 'texturedCrop', H_NEW),
  person({ name: 'commander', label: 'COMMANDER (standard): red jumpsuit, navy peaked cap with a round gold badge', size: 'standard', outfit: 'afCommander', outfitPal: { a: RED, b: REDD, c: GOLD } }, 'buzz', H_CMD, { hat: cmdCap, hatCol: NAVY }),
  person({ name: 'navigator', label: 'NAVIGATOR (standard): purple jumpsuit, bun with a pencil, tan visor', size: 'standard', outfit: 'afNavigator', outfitPal: { a: PUR, b: PURD, c: GOLD } }, 'messyBun', H_NAV, { pieces: [navVisor, bunPencil] }),
  person({ name: 'director', label: 'FLIGHT DIRECTOR (thin, tall): white shirt, dark tie, headset', size: 'thin', outfit: 'afDirector', outfitPal: { a: WHITE, b: SHIRTD, c: TIE } }, 'sidePart', H_DIR, HS),
  person({ name: 'ctlGreen', label: 'CONTROLLER FAO: green top, dark bob, round glasses, headset', size: 'thin', outfit: 'afCtlGreen', outfitPal: { a: GREEN, b: '#1f9480', c: '#2b3140' } }, 'sleekBob', H_BOB, { face: { acc: ['roundGlasses', 'headset'] }, pieces: [headsetBand] }),
  person({ name: 'ctlBlue', label: 'CONTROLLER CAPCOM: blue top, orange hair, headset', size: 'thin', outfit: 'afCtlBlue', outfitPal: { a: BLUE, b: '#3566c0', c: '#2b3140' } }, 'curtains90', H_ORA, HS),
  person({ name: 'ctlDark', label: 'CONTROLLER GUIDO: slate top, dark hair, headset', size: 'thin', outfit: 'afCtlDark', outfitPal: { a: SLATE, b: '#3a3e4b', c: '#2b3140' } }, 'twoBlock', H_DRK, HS),
];
