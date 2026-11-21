// FILM CAST (character-artist, 2026-11-20, phase A, NOT locked by CB): "Why Fire Trucks Turned Yellow", a small US town + Dallas, 1970s.
// Built ONLY from the locked package (bodies in the three sizes + the kid form, outfit_lib parts, hair_lib, head_wear, head_gear.fire, face_gear).
// The package is NOT edited: this film's recipes and the two small parts (bolo, visitor tag) are registered here at load, like fake-surgery's sheet.
// The kit's fire helmet is drawn red with a gold shield; it is RECOLOURED here at draw time (shape untouched): black shells for the firemen, the
// Chief's shell white, shields silver-white / black / navy (LOOK_BIBLE: no red and no yellow on any person, so no gold or brass anywhere).
// PERIOD CHECK, 1970s US: traditional fire helmet (high crown, comb, long rear brim, leather front with the company number), black turnout coats
// with clasp closures (frogs) and silver-white reflective bands, bunker trousers on braces; roll-neck turtleneck (70s); open short white clinic coat;
// short-sleeve navy chief's shirt with black tie; white dairy jacket + bow tie + peaked cap; striped tee + denim shorts kid; western shirt + bolo +
// cowboy hat (Dallas); white bib overalls + white cotton painter's caps. Moustaches: walrus, horseshoe, pencil, chevron; sideburns, hair over the ears.
import { wear, HATS2 } from '../head_wear.mjs';
import { HELMETS } from '../head_gear.mjs';
import { withFace, STACHES } from '../face_gear.mjs';
import { O, PART, WHITE } from '../outfit_lib.mjs';

const INK = '#2a1a1f', f = v => (+v).toFixed(1);
// ---------- LOOK_BIBLE people colours ----------
const TEAL = '#12A5A0', TEALD = '#0c7a76';                                  // HERO ONLY
const BLK = '#2e2d34', BLKL = '#45444c', BLKD = '#1f1e24', SILW = '#e6e9ee', SILV = '#c4c8d0';   // turnout black, silver-white bands, chrome clasps
const NAVY = '#1f2a54', NAVYL = '#2e3c6e', NAVYD = '#161d3c';
const CREAM = '#efe6cf', OFFW = '#e6e2d8', TAN = '#c8a46a', TAND = '#9a7a48', BROWN = '#6a4a32', BROWND = '#4a3222';
const DENIM = '#4a6a96', DENIMD = '#36507a', SPECK = ['#a9acb3', '#c4c6cc', '#8f939b'];
// hair
const H_HERO = '#6b4423', H_CHIEF = '#a6a6ae', H_OLD = '#b8b8c0', H_ROOK = '#c2ad86', H_SCEP = '#3a2a22', H_MILK = '#2e2420', H_KID = '#7a5030', H_CLERK = '#8c8680', H_P1 = '#4a3424', H_P2 = '#2a2228';

// ---------- two small parts (registered here; the library files are unchanged) ----------
// bolo tie: two dark cords from the collar, a silver oval slide with a dark stone, silver tips (no teal stone: teal is the hero's)
PART.bolo = (A, c = BROWND) => A.back ? [] : [
  `<path d="M${f(A.X(-.07))},${f(A.Y(.13))} Q${f(A.X(-.05))},${f(A.Y(.4))} ${f(A.X(-.05))},${f(A.Y(.56))} M${f(A.X(.07))},${f(A.Y(.13))} Q${f(A.X(.05))},${f(A.Y(.4))} ${f(A.X(.05))},${f(A.Y(.56))}" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round"/>`,
  `<ellipse cx="${f(A.cx)}" cy="${f(A.Y(.24))}" rx="${f(13 * A.k)}" ry="${f(16 * A.k)}" fill="${SILV}" stroke="${INK}" stroke-width="3"/><ellipse cx="${f(A.cx)}" cy="${f(A.Y(.24))}" rx="${f(6 * A.k)}" ry="${f(8 * A.k)}" fill="#3a3142"/>`,
  ...[-.05, .05].map(u => `<rect x="${f(A.X(u) - 3)}" y="${f(A.Y(.56))}" width="6" height="${f(14 * A.k)}" rx="2" fill="${SILV}" stroke="${INK}" stroke-width="2"/>`)];
// visitor tag (Dallas, line 13): a white card clipped on the chest pocket, lettered VISITOR in navy (text on the costume, never on the face)
PART.visitorTag = (A, u = -.48, v = .3) => A.back ? [] : [`<rect x="${f(A.X(u) - 30 * A.k)}" y="${f(A.Y(v))}" width="${f(60 * A.k)}" height="${f(30 * A.k)}" rx="3" fill="#f6f5f1" stroke="${INK}" stroke-width="3"/>`,
  `<rect x="${f(A.X(u) - 30 * A.k)}" y="${f(A.Y(v))}" width="${f(60 * A.k)}" height="${f(9 * A.k)}" fill="${NAVYL}"/>`, `<rect x="${f(A.X(u) - 5)}" y="${f(A.Y(v) - 8)}" width="10" height="12" rx="2" fill="${SILV}" stroke="${INK}" stroke-width="2"/>`,
  `<text x="${f(A.X(u))}" y="${f(A.Y(v) + 24 * A.k)}" font-family="Arial Black,Arial" font-weight="900" font-size="${f(11 * A.k)}" text-anchor="middle" fill="${NAVY}">VISITOR</text>`];
// overall bib with its stitching in grey (the library bib stitches in gold; no yellow on any person)
PART.bibGrey = (A, c, btn) => PART.bib(A, c, btn).map(x => recolour(x, null, '#9aa0aa'));
// collar pins (silver, the Chief's rank): two small bars on the collar points
PART.collarPins = (A, c = SILV) => A.back ? [] : [-1, 1].map(s => `<rect x="${f(A.X(s * .3) - 7)}" y="${f(A.Y(.17))}" width="14" height="7" rx="2" fill="${c}" stroke="${INK}" stroke-width="2"/>`);

// ---------- recipes (outfit_lib parts only + the three above) ----------
// THE HERO, yard: teal roll-neck tucked into black bunker trousers on black braces; silver-white reflective band round the trouser legs
O('ytHeroYard', 'Hero (yard): teal turtleneck, black braces, black bunker trousers with a reflective band (1970s)', '1970s', 'u', [TEAL, BLK, BLK],
  [['pin', TEALD, 9, .35], ['turtle', TEALD], ['low', 'c', .64], ['borders', SILW, [.92], .05], ['suspenders', 'b'], ['seams']]);
// THE HERO, eye shop: the same turtleneck under a short white clinic coat worn open, three pockets, black trousers
O('ytHeroShop', 'Hero (eye shop): short white clinic coat worn open over the teal turtleneck (1970s)', '1970s', 'u', [WHITE, TEAL, BLK],
  [['trimV', 'b', 0, .5], ['pin', TEALD, 9, .2], ['turtle', TEALD], ['pocket', -.62, .34, { c: '#f7f6f2', st: '#9aa0aa' }], ['pocket', -.62, .7, { c: '#f7f6f2', st: '#9aa0aa' }], ['pocket', .62, .7, { c: '#f7f6f2', st: '#9aa0aa' }], ['hem', '#dcdfe4', .05], ['seams']]);
// THE CHIEF: navy short-sleeve uniform shirt, black tie, flap pockets, silver chest badge + collar pins, epaulettes, black belt, big silver buckle, navy trousers
O('ytChief', 'Fire chief: navy uniform shirt, black tie, badge, belt with big buckle (1970s)', '1970s', 'u', [NAVY, BLKD, NAVYD],
  [['low', 'c', .7], ['shirtCollar', NAVYL], ['collarPins'], ['tie', 'b'], ['pocket', -.5, .34, { c: NAVYL, flap: 1, btn: SILV }], ['pocket', .5, .34, { c: NAVYL, flap: 1, btn: SILV }], ['badge', 'cross', SILV, -.5, .26, 13], ['epaulettes', NAVYL], ['belt', 'b', 'big', .62, SILV], ['seams']]);
O('ytChiefVisitor', 'Fire chief with a VISITOR tag (Dallas, line 13)', '1970s', 'u', [NAVY, BLKD, NAVYD],
  [['low', 'c', .7], ['shirtCollar', NAVYL], ['collarPins'], ['tie', 'b'], ['pocket', -.5, .34, { c: NAVYL, flap: 1, btn: SILV }], ['pocket', .5, .34, { c: NAVYL, flap: 1, btn: SILV }], ['badge', 'cross', SILV, .5, .26, 13], ['visitorTag', -.5, .3], ['epaulettes', NAVYL], ['belt', 'b', 'big', .62, SILV], ['seams']]);
// TURNOUT COATS (short, mid-thigh): black, two silver-white bands, high collar, chrome clasps; each fireman wears it his own way
const turn = (key, label, extra) => O(key, label, '1970s', 'u', [BLK, SILW, BLKL], [['hiVis', 'b'], ...extra, ['hem', BLKD, .06], ['seams']]);
turn('ytCoatOpen', 'Turnout coat worn OPEN over a white undershirt (Old-Timer)', [['trimV', WHITE, 0, .46], ['crew', OFFW], ['pocket', -.62, .6, { c: BLKL, flap: 1 }], ['pocket', .62, .6, { c: BLKL, flap: 1 }], ['backNum', '3', SILW]]);
turn('ytCoatButtoned', 'Turnout coat clasped to the chin, collar up (Rookie)', [['turtle', BLKL], ['frogs', SILV, 4, .3, .78], ['pocket', -.6, .6, { c: BLKL, flap: 1 }], ['pocket', .6, .6, { c: BLKL, flap: 1 }], ['backNum', '3', SILW]]);
turn('ytCoatStd', 'Turnout coat, three clasps, name tag (Sceptic)', [['mandarin', BLKL], ['frogs', SILV, 3, .42, .74], ['nameTag', -.5, .3, SILW], ['pocket', .6, .6, { c: BLKL, flap: 1 }], ['backNum', '3', SILW]]);
turn('ytCoatCrewA', 'Turnout coat, open collar, two clasps (crowd)', [['mandarin', BLKL], ['frogs', SILV, 2, .5, .72], ['pocket', -.6, .6, { c: BLKL, flap: 1 }]]);
turn('ytCoatCrewB', 'Turnout coat, radio strap across the chest (crowd)', [['mandarin', BLKL], ['frogs', SILV, 3, .4, .74], ['sash', BLKD, SILW]]);
turn('ytCoatCrewC', 'Turnout coat, collar up, side pocket (crowd)', [['turtle', BLKL], ['frogs', SILV, 3, .4, .74], ['pocket', .6, .6, { c: BLKL, flap: 1 }]]);
// THE MILKMAN: white dairy jacket with navy piping, black bow tie, chrome buttons, breast pocket with a cream tag, white trousers
O('ytMilkman', 'Milkman: white dairy jacket, navy piping, black bow tie, white trousers (1970s)', '1970s', 'u', [WHITE, BLKD, OFFW],
  [['low', 'c', .7], ['shirtCollar', WHITE], ['bow', 'b'], ['buttons', 4, SILV, .32, .62], ['pocket', .5, .34, { c: '#f7f6f2', st: '#9aa0aa' }], ['nameTag', -.48, .34, CREAM], ['belt', '#5a5a62', 'sq', .64, SILV], ['hem', NAVY, .03], ['seams']]);
// THE KID: white tee with two wide navy bands, navy crew neck, denim shorts with a seam and turn-ups
O('ytKid', 'Kid: white tee with two navy bands, denim shorts (1970s)', '1970s', 'u', [WHITE, NAVY, DENIM],
  [['stripesH', 'b', 2, .5, .18, .58], ['crew', 'b'], ['low', 'c', .72], ['hem', DENIMD, .07], ['seams']]);
// THE DALLAS CLERK: white short-sleeve western shirt (yoke, pearl buttons), bolo tie, pocket, brown trousers, belt with a big silver western buckle, chalk dust
O('ytClerk', 'Dallas clerk: white western shirt, bolo tie, brown trousers, big buckle (1970s)', '1970s', 'u', [WHITE, BROWND, BROWN],
  [['low', 'c', .68], ['yoke', '#e9e5dc', .3], ['shirtCollar', WHITE], ['buttons', 4, '#efece4', .36, .6], ['bolo', 'b'], ['pocket', .5, .36, { c: '#f3f1ec', st: '#9aa0aa' }], ['belt', BROWND, 'big', .64, SILV], ['splat', ['#f1efe9', '#e4e1da', '#f1efe9']], ['seams']]);
// THE PAINTERS: white bib overalls over a work shirt, grey and white speckles from old jobs, hammer loop pocket
O('ytPainter', 'Painter: white bib overalls, grey speckles (1970s)', '1970s', 'u', [CREAM, WHITE, SILV],
  [['crew', 'a'], ['low', 'b', .56], ['bibGrey', 'b', SILV], ['splat', SPECK], ['pocket', .56, .8, { c: '#ececec', st: '#8a8f9a' }], ['pocket', -.3, .42, { c: '#f2f1ee', st: '#8a8f9a' }]]);
O('ytPainterB', 'Painter: white bib overalls, grey speckles, darker shirt (1970s)', '1970s', 'u', ['#b8bcc4', WHITE, SILV],
  [['crew', 'a'], ['low', 'b', .56], ['bibGrey', 'b', SILV], ['splat', SPECK], ['pocket', -.56, .8, { c: '#ececec', st: '#8a8f9a' }]]);

// ---------- the fire helmet, recoloured (shape = head_gear.mjs fire, unchanged) ----------
const hex2hsl = h => { const r = parseInt(h.slice(1, 3), 16) / 255, g = parseInt(h.slice(3, 5), 16) / 255, b = parseInt(h.slice(5, 7), 16) / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  if (!d) return [0, 0, l]; const s = d / (1 - Math.abs(2 * l - 1)); let hh = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; hh *= 60; if (hh < 0) hh += 360; return [hh, s, l]; };
const hsl2hex = (h, s, l) => { const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2; const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return '#' + [r, g, b].map(v => Math.round(Math.min(1, Math.max(0, v + m)) * 255).toString(16).padStart(2, '0')).join(''); };
const L_RED = hex2hsl('#d43a2f')[2], L_GOLD = hex2hsl('#f2c230')[2];
const remap = (hex, target, lb) => { const [, , lx] = hex2hsl(hex), [th, ts, tl] = hex2hsl(target); return hsl2hex(th, ts, Math.min(.97, Math.max(.07, tl + (lx - lb) * .8))); };
const recolour = (s, shell, shield, gsat = .3) => s.replace(/#[0-9a-fA-F]{6}\b/g, m => { const [h, sat, l] = hex2hsl(m); if (sat < .3 || l < .12) return m;
  if (shell && (h <= 22 || h >= 338)) return remap(m, shell, L_RED); if (h >= 28 && h <= 62 && sat >= gsat) return remap(m, shield, L_GOLD); return m; });
// fireHelmet({ shell, shield, num, numCol, size }): num '' = plain shield
const fireHelmet = ({ shell, shield, num = '', numCol = INK, size = 30, label }) => Object.assign(PP => HELMETS.fire(PP).map(s => {
  let t = recolour(s, shell, shield); if (/<text/.test(t)) t = num ? t.replace(/>7<\/text>/, `>${num}</text>`).replace(/fill="#2a1a1f"/, `fill="${numCol}"`).replace(/font-size="30"/, `font-size="${size}"`) : t.replace(/<text[\s\S]*?<\/text>/, '');
  if (/<text/.test(t) && (PP.dir || 1) < 0) t = `<g transform="scale(-1,1)">${t}</g>`;   // FIX 1 (2026-11-21): hair_lib mirrors the head layers for dir < 0 (left views), so the front number read backwards: counter-flip it about the shield centre (x 0)
  return t; }),
  { label: label || 'Traditional US fire helmet (kit shape, recoloured)', era: '1900s-1980s' });
const HELM_HERO = fireHelmet({ shell: '#34333a', shield: '#3e3d45', label: 'Black fire helmet, plain black front' });
const HELM_CO3 = fireHelmet({ shell: '#34333a', shield: '#e9ecf0', num: '3', label: 'Black fire helmet, silver-white front, company 3' });
const HELM_CHIEF = fireHelmet({ shell: '#f1efe9', shield: NAVYL, num: 'CHIEF', numCol: '#f1efe9', size: 13, label: 'WHITE chief helmet, navy front lettered CHIEF' });

// ---------- caps and head pieces ----------
// plain cap = the library baseball cap with its letter and disc removed (fake-surgery's method); worn white by the painters, with grey speckles
const baseCap = HATS2.baseball;
const plainCap = speck => Object.assign(PP => { const parts = baseCap(PP), out = []; for (const s of parts) { if (/<text/.test(s)) { if (out.length && /circle/.test(out[out.length - 1]) && /#f/i.test(out[out.length - 1])) out.pop(); continue; } out.push(s); }
  if (speck && PP.view !== 'back') { const y = PP.brimY - 20; out.push(...[[-40, -10, 4], [-12, -26, 3], [22, -14, 3.6], [44, -30, 2.6], [-60, -34, 2.8]].map(([x, dy, r], i) => `<circle cx="${f(x)}" cy="${f(y + dy)}" r="${r}" fill="${SPECK[i % 3]}"/>`)); }
  return out; }, { label: 'White cotton painter cap (plain, speckled)', era: '1950s-1980s' });
const PAINTER_CAP = plainCap(true);
// the hero's head mirror on a black band (eye shop, lines 3-4): steel disc with the centre hole, worn UP on the forehead
const headMirror = Object.assign(PP => { const v = PP.view, y = PP.brimY + 6, w = PP.widthAt(y) + 2, band = `<path d="M${f(-w)},${f(y)} Q0,${f(y - 16)} ${f(w)},${f(y)}" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M${f(-w)},${f(y)} Q0,${f(y - 16)} ${f(w)},${f(y)}" fill="none" stroke="#3a3940" stroke-width="9" stroke-linecap="round"/>`;
  if (v === 'back') return [band];
  const disc = (x, rx) => `<ellipse cx="${f(x)}" cy="${f(y - 34)}" rx="${f(rx)}" ry="30" fill="#d9dde4" stroke="${INK}" stroke-width="5"/><ellipse cx="${f(x - rx * .25)}" cy="${f(y - 42)}" rx="${f(rx * .35)}" ry="9" fill="#ffffff" opacity=".8"/><ellipse cx="${f(x)}" cy="${f(y - 34)}" rx="${f(rx * .2)}" ry="6" fill="${INK}"/><rect x="${f(x - 5)}" y="${f(y - 8)}" width="10" height="10" fill="#8a8f9a" stroke="${INK}" stroke-width="3"/>`;
  return v === 'side' ? [band, disc(w * .55, 12)] : [band, disc(PP.v34 ? 18 : 0, 30)]; }, { label: 'Head mirror on a band (ENT / eye doctor)', era: '1900s-1980s' });
// FIX 2 (2026-11-21, S2 row 11 "eye"): the same head mirror swung DOWN on its knuckle over his RIGHT eye (screen left in front): a short steel stalk from the
// band to the disc, the disc tipped (narrower than wide) so its centre hole sits on the eye; the LEFT lens of the round glasses stays fully clear (signature).
// Head space: eyes at about x +-40, y -19 (char2d front; 3/4 slides them by +18 toward the turn); side: the near eye at about x 52.
const headMirrorDown = Object.assign(PP => { const v = PP.view, y = PP.brimY + 6, w = PP.widthAt(y) + 2, band = `<path d="M${f(-w)},${f(y)} Q0,${f(y - 16)} ${f(w)},${f(y)}" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M${f(-w)},${f(y)} Q0,${f(y - 16)} ${f(w)},${f(y)}" fill="none" stroke="#3a3940" stroke-width="9" stroke-linecap="round"/>`;
  if (v === 'back') return [band];
  const [ex, ey, rx, ry] = v === 'side' ? [56, -22, 13, 33] : PP.v34 ? [-40 * .9 + 18, -20, 30, 36] : [-40, -20, 34, 36], kx = v === 'side' ? 6 : ex * .55;
  const stalk = `<path d="M${f(kx)},${f(y - 4)} L${f(ex + (v === 'side' ? -2 : 6))},${f(ey - ry + 6)}" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="M${f(kx)},${f(y - 4)} L${f(ex + (v === 'side' ? -2 : 6))},${f(ey - ry + 6)}" stroke="#8a8f9a" stroke-width="6" stroke-linecap="round"/><circle cx="${f(kx)}" cy="${f(y - 4)}" r="9" fill="#8a8f9a" stroke="${INK}" stroke-width="4"/>`;
  const disc = `<ellipse cx="${f(ex)}" cy="${f(ey)}" rx="${f(rx)}" ry="${f(ry)}" fill="#d9dde4" stroke="${INK}" stroke-width="5"/><ellipse cx="${f(ex - rx * .3)}" cy="${f(ey - ry * .4)}" rx="${f(rx * .34)}" ry="${f(ry * .22)}" fill="#ffffff" opacity=".85"/><ellipse cx="${f(ex + rx * .12)}" cy="${f(ey + 2)}" rx="${f(Math.max(4, rx * .2))}" ry="7" fill="${INK}"/>`;
  return [band, stalk, disc]; }, { label: 'Head mirror on a band, swung DOWN over the right eye', era: '1900s-1980s' });
// the THIN painter's brush behind the ear = the kit's ear pencil piece in brush colours (wood handle, grey bristle tip)
const BRUSH_EAR = 'earPencil';
// library hats with their gold badge / star turned silver (no yellow on any person); shape and main colour untouched
const silverTrim = (hat, label) => Object.assign(PP => hat(PP).map(x => recolour(x, null, SILV, .6)), { label });
const MILK_CAP = silverTrim(HATS2.police, 'White peaked dairy cap (library peaked cap, silver badge)');
const COWBOY = silverTrim(HATS2.cowboy, 'Tan cowboy hat (library, silver hatband star)');

// the kid's plaster on the LEFT knee (front: the leg on screen right; back: screen left; side/3-4 facing right: the near leg)
const kneePlaster = B => { const v = B.view, d = B.dir || 1; if (B.form !== 'kid') return [];
  const y = 948, x = v === 'side' ? B.cx + 24 * d : v === 'back' ? B.cx - 34 : v === '34' ? B.cx + 40 + 6 * d : B.cx + 34;
  return [`<g transform="rotate(${v === 'side' ? -8 * d : -14} ${f(x)} ${y})"><rect x="${f(x - 17)}" y="${y - 8}" width="34" height="16" rx="7" fill="#f0c9a0" stroke="${INK}" stroke-width="3.5"/><rect x="${f(x - 6)}" y="${y - 5}" width="12" height="10" rx="2" fill="#f8e3c8"/></g>`]; };
// the FAT painter's rag hanging out of his back pocket (back and side views)
const ragBack = B => { const x = B.cx + 46, y = B.bot - 70; return [`<path d="M${x - 24},${y} L${x + 24},${y} L${x + 30},${y + 58} Q${x + 10},${y + 70} ${x + 2},${y + 52} Q${x - 10},${y + 74} ${x - 26},${y + 56} Z" fill="#d9d6cf" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`, `<path d="M${x - 14},${y + 14} l6,30 M${x + 10},${y + 10} l4,34" stroke="#a9acb3" stroke-width="3" fill="none"/>`]; };
const ragSide = B => B.view !== 'side' ? [] : (() => { const d = B.dir || 1, x = B.cx - d * 150, y = B.bot - 80; return [`<path d="M${x},${y} L${x - d * 22},${y + 6} L${x - d * 26},${y + 66} Q${x - d * 10},${y + 74} ${x - d * 2},${y + 58} Z" fill="#d9d6cf" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`]; })();

// ---------- bent walrus moustache (after the Chief hits his own truck, line 14): the kit walrus, one wing pushed up ----------
const bentWalrus = o => [`<g transform="rotate(-9 0 34) translate(0 18) scale(.92) translate(0 -30)">${[].concat(STACHES.walrus(o)).join('')}</g>`];

const base = spec => ({ form: 'standard', face: 'standard', views: true, sideFarArm: true, ...spec });
const person = (spec, hair, hairCol, o = {}) => { let s = base(spec); if (o.face) s = withFace(s, { col: hairCol, ...o.face });
  return wear(s, hair, { col: hairCol, ...(o.hat ? { hat: o.hat, hatCol: o.hatCol, hatScale: o.hatScale, hatDrop: o.hatDrop } : {}), ...(o.pieces ? { pieces: o.pieces, pieceCol: o.pieceCol, pieceAccent: o.pieceAccent } : {}) }); };

export const TITLE = 'Why Fire Trucks Turned Yellow: cast (small US town + Dallas, 1970s)';
const HERO_FACE = { acc: ['roundGlasses'] };
// the Chief SPEAKS (line 2): the kit walrus lifted 10 px and 8 % smaller so the mouth shapes show under it (shape unchanged)
const chiefWalrus = o => [`<g transform="translate(0 18) scale(.92) translate(0 -30)">${[].concat(STACHES.walrus(o)).join('')}</g>`];
const CHIEF_FACE = { stache: chiefWalrus };
export const CAST = [
  // THE HERO (thin, tall): big round wire glasses = fixed signature; teal turtleneck = the film's signature colour
  person({ name: 'hero', label: 'The Fireman-Eye-Doctor (yard)', size: 'thin', outfit: 'ytHeroYard', outfitPal: { a: TEAL, b: BLK, c: BLK } }, 'sidePart', H_HERO, { face: HERO_FACE, hat: HELM_HERO, hatDrop: -14 }),
  person({ name: 'heroShop', label: 'The Fireman-Eye-Doctor (eye shop)', size: 'thin', outfit: 'ytHeroShop', outfitPal: { a: WHITE, b: TEAL, c: BLK } }, 'sidePart', H_HERO, { face: HERO_FACE, pieces: [headMirror] }),
  person({ name: 'heroShopEye', label: 'The Fireman-Eye-Doctor (eye shop, head mirror DOWN over the right eye: S2 row 11)', size: 'thin', outfit: 'ytHeroShop', outfitPal: { a: WHITE, b: TEAL, c: BLK } }, 'sidePart', H_HERO, { face: HERO_FACE, pieces: [headMirrorDown] }),
  person({ name: 'heroBare', label: 'The Fireman-Eye-Doctor (no helmet, last picture option)', size: 'thin', outfit: 'ytHeroYard', outfitPal: { a: TEAL, b: BLK, c: BLK } }, 'sidePart', H_HERO, { face: HERO_FACE }),
  // THE CHIEF (fat, short): white helmet + grey walrus moustache
  person({ name: 'chief', label: 'The Chief', size: 'fat', outfit: 'ytChief', outfitPal: { a: NAVY, b: BLKD, c: NAVYD } }, 'buzz', H_CHIEF, { face: CHIEF_FACE, hat: HELM_CHIEF, hatDrop: -10 }),
  person({ name: 'chiefVisitor', label: 'The Chief in Dallas (VISITOR tag)', size: 'fat', outfit: 'ytChiefVisitor', outfitPal: { a: NAVY, b: BLKD, c: NAVYD } }, 'buzz', H_CHIEF, { face: CHIEF_FACE, hat: HELM_CHIEF, hatDrop: -10 }),
  person({ name: 'chiefDown', label: 'The Chief, helmet knocked over the eyes (line 14)', size: 'fat', outfit: 'ytChief', outfitPal: { a: NAVY, b: BLKD, c: NAVYD } }, 'buzz', H_CHIEF, { face: { stache: bentWalrus }, hat: HELM_CHIEF, hatDrop: 64 }),
  // THE THREE FIREMEN
  person({ name: 'oldTimer', label: 'The Old-Timer', size: 'standard', outfit: 'ytCoatOpen', outfitPal: { a: BLK, b: SILW, c: BLKL } }, 'elderGrey', H_OLD, { face: { beard: 'sideWhiskers' }, hat: HELM_CO3, hatDrop: 12 }),
  person({ name: 'rookie', label: 'The Rookie', size: 'thin', outfit: 'ytCoatButtoned', outfitPal: { a: BLK, b: SILW, c: BLKL } }, 'moptop', H_ROOK, { face: { acc: ['freckles'] }, hat: HELM_CO3, hatScale: 1.16, hatDrop: -2 }),
  person({ name: 'rookieDown', label: 'The Rookie, helmet dropped over his eyes', size: 'thin', outfit: 'ytCoatButtoned', outfitPal: { a: BLK, b: SILW, c: BLKL } }, 'moptop', H_ROOK, { face: { acc: ['freckles'] }, hat: HELM_CO3, hatScale: 1.16, hatDrop: 58 }),
  person({ name: 'sceptic', label: 'The Sceptic', size: 'standard', outfit: 'ytCoatStd', outfitPal: { a: BLK, b: SILW, c: BLKL } }, 'feathered', H_SCEP, { face: { stache: 'chevron' }, hat: HELM_CO3, hatDrop: 0 }),
  // CROWD FIREMEN (line 7 "plenty of firemen"): never clones (size, hair, moustache, coat detail differ)
  person({ name: 'crew1', label: 'Crowd fireman 1', size: 'fat', outfit: 'ytCoatCrewA', outfitPal: { a: BLK, b: SILW, c: BLKL } }, 'curlyCrop', '#5a3a26', { face: { stache: 'handlebar' }, hat: HELM_CO3 }),
  person({ name: 'crew2', label: 'Crowd fireman 2', size: 'standard', outfit: 'ytCoatCrewB', outfitPal: { a: BLK, b: SILW, c: BLKL } }, 'mullet', '#6a4a30', { face: { stache: 'bushy' }, hat: HELM_CO3 }),
  person({ name: 'crew3', label: 'Crowd fireman 3', size: 'thin', outfit: 'ytCoatCrewC', outfitPal: { a: BLK, b: SILW, c: BLKL } }, 'afro', '#2a2024', { face: { beard: 'muttonChops' }, hat: HELM_CO3 }),
  // THE MILKMAN (thin, short)
  person({ name: 'milkman', label: 'The Milkman', size: 'thin', outfit: 'ytMilkman', outfitPal: { a: WHITE, b: BLKD, c: OFFW } }, 'slickBack', H_MILK, { face: { stache: 'pencil' }, hat: MILK_CAP, hatCol: '#f4f3ef', hatScale: .86 }),
  // THE KID (child body form)
  person({ name: 'kid', label: 'The Kid with the red ball', form: 'kid', outfit: 'ytKid', outfitPal: { a: WHITE, b: NAVY, c: DENIM }, over: kneePlaster }, 'bowlCut', H_KID),
  // THE DALLAS CLERK (standard)
  person({ name: 'clerk', label: 'The Dallas Clerk', size: 'standard', outfit: 'ytClerk', outfitPal: { a: WHITE, b: BROWND, c: BROWN } }, 'sidePart', H_CLERK, { hat: COWBOY, hatCol: TAN, pieces: ['earPencil'] }),
  // THE PAINTERS (thin + fat)
  person({ name: 'painterThin', label: 'Painter (thin, brush behind the ear)', size: 'thin', outfit: 'ytPainter', outfitPal: { a: CREAM, b: WHITE, c: SILV } }, 'buzz', H_P1, { hat: PAINTER_CAP, hatCol: '#f4f3ef', hatDrop: -12, pieces: [BRUSH_EAR], pieceCol: '#9b6b3e', pieceAccent: '#d6d7db' }),
  person({ name: 'painterFat', label: 'Painter (fat, rag in the back pocket)', size: 'fat', outfit: 'ytPainterB', outfitPal: { a: '#b8bcc4', b: WHITE, c: SILV }, backOver: ragBack, behind: ragSide }, 'curlyCrop', H_P2, { face: { stache: 'chevron' }, hat: PAINTER_CAP, hatCol: '#f4f3ef', hatDrop: -12 }),
];

// ---------- FIX 3 (2026-11-21): SEATED DRIVERS (S3, S6: standing cards stood through the cab and van bodies, 73-100 % body_in_mesh) ----------
// The kit has no seated driver card (templates/body_rig solveSit is NOT wired into film.js; frame_checks only knows cast "in_vehicle": true, which hands
// the driver to body_check / scale_check). So each driver is the SAME puppet (same spec: body, costume, hair, face, moves, held3d hands) drawn through the
// kit's own svgFor and CUT at the seat line just under the hips (kit_patch customCard: spec.card = { svg(st, CARD), metrics }): no legs and no lower body
// on the card, so nothing of him can poke under the cab floor or out through a door. Metrics = the standing puppet's, so cast height scales him exactly.
// Place him with his HIPS ON THE SEAT: card pos z = seat_z - hip_up_m (hip_up_m = DRIVER_HIP below, metres, for the cast height); hands on the wheel rim
// = pose 'drive' (both fists on the rim, every view) or the stretch's own cab move (feet are cut off, so the move's legs never show). Note: DRIVER_NOTE.md.
import { buildChar } from '../castkit.mjs';
let PUP = null;   // the kit's live puppets module (the same instance film.js initialised): /kit/puppets.mjs in the film, ../puppets.mjs in render_cast
for (const u of ['../../kit/puppets.mjs', '../puppets.mjs']) { try { const m = await import(new URL(u, import.meta.url).href); if (m && m.svgFor && m.metrics) { PUP = m; break; } } catch (e) { /* not this layout */ } }
const CUT_PAD = 14;   // rig px below the hip line: the coat hem lying on the lap
const hipUpPx = spec => { const S = buildChar({ ...spec, face: 'standard' }, 400); return (S.ground ?? 900) - (S.bodyBot ?? 640) + 30; };   // = puppets.mjs chOf hipY (bodyBot - 30), measured up from the feet
const cutSvg = (svg, y, id) => svg.includes('</defs>') ? svg.replace('</defs>', `<clipPath id="${id}"><rect x="-400" y="-400" width="1600" height="${f(y + 400)}"/></clipPath></defs><g clip-path="url(#${id})">`).replace(/<\/svg>\s*$/, '</g></svg>')
  : svg.replace(/(<svg[^>]*>)/, `$1<defs><clipPath id="${id}"><rect x="-400" y="-400" width="1600" height="${f(y + 400)}"/></clipPath></defs><g clip-path="url(#${id})">`).replace(/<\/svg>\s*$/, '</g></svg>');
// pose 'drive' (this sheet only): both fists ON the wheel rim. side = kit 'push' (fists forward at chest height); front / 3/4 / back = kit 'grip_box' fists
// (each fist at a torso edge, mid chest, drawn IN FRONT of the body) with its box shrunk to nothing, so the 3D wheel of the cab is what they hold.
const driveSt = st => st.pose !== 'drive' ? st : (st.view || 'front') === 'side' ? { ...st, pose: 'push' } : { ...st, pose: 'grip_box', grip: { obj: 'box', two: 1, scale: .001 } };
const driver = (name, base, label) => { const src = CAST.find(c => c.name === base), ref = { puppet: 'cast:firetrucks/' + base }, up = hipUpPx(src);
  const spec = { ...src, name, label, driverOf: base, hipUpPx: up };
  if (PUP) spec.card = { svg: (st, CARD) => cutSvg(PUP.svgFor(ref, driveSt(st)), CARD.GY - up + CUT_PAD, 'drvcut_' + name), get metrics() { return PUP.metrics(ref); } };
  return spec; };
CAST.push(driver('scepticDriver', 'sceptic', 'The Sceptic at the wheel (seated: cut at the seat, S3 red truck cab, S6 pumper)'),
  driver('rookieDriver', 'rookie', 'The Rookie at the wheel (seated: cut at the seat, S6 lemon truck cab)'),
  driver('milkmanDriver', 'milkman', 'The Milkman at the wheel (seated: cut at the seat, S3/S6 milk van)'));
export const DRIVER_HIP = Object.fromEntries(CAST.filter(c => c.driverOf).map(c => [c.name, c.hipUpPx]));   // rig px; metres = px * height / metrics.px
