// character-artist, STYLE TEST cast (2026-11-21): GRANDPA (car-proud weekend washer) and the KID (hose ambusher).
// Built ONLY from the locked package: body sizes / kid form, outfit_lib parts (O recipes registered here, library files untouched), hair_lib,
// head_wear hats (recoloured, plus small view-aware add-ons on top), face_gear. Same method as episodes/yellow-fire-trucks/cast/sheets/firetrucks.mjs.
// This file is copied next to the package (TMP/sheets/) by cast/tools/make_cards.mjs, so imports are '../<module>.mjs'.
import { wear, HATS2 } from '../head_wear.mjs';
import { withFace } from '../face_gear.mjs';
import { O, PART } from '../outfit_lib.mjs';

const INK = '#2a1a1f', f = v => (+v).toFixed(1);
// ---------- scene palette (SHOT.md + props/build_props.py): car candy turquoise + cream, cherry-red bike and reel, blue mailbox, green lawn, blue sky ----------
const TURQ = '#14a3a0', TURQD = '#0d7c7a', CREAM = '#f1e6c8', CREAMD = '#d9caa3', CORAL = '#f0705a', LEAFG = '#4f9a48';
const KHAKI = '#b49a6a', KHAKID = '#8e774c', LEATHER = '#7a4a2a', BRASS = '#c9a24a', CHERRY = '#d42a35', CHERRYD = '#a51d28';
const WHITE = '#f6f4ef', DENIM = '#4f72a8', DENIMD = '#3a5684', ORANGE = '#f08a2a', SHARK = '#7d8fa3';
const H_GRAMPS = '#e9e7e2', H_KID = '#7a4a26';

// ---------- small parts (registered at load, like the fire-truck sheet) ----------
// wet patches: darker, soft-edged splashes where the hose hit him (the story on the shirt)
PART.wetPatch = (A, pts = [[.35, .3, 34], [.6, .52, 26], [-.15, .2, 22]]) => A.back ? [] : pts.map(([u, v, r], i) =>
  `<path d="M${f(A.X(u) - r * A.k)},${f(A.Y(v))} q${f(r * .4 * A.k)},${f(-r * .9 * A.k)} ${f(r * A.k)},${f(-r * .7 * A.k)} q${f(r * .9 * A.k)},${f(r * .1 * A.k)} ${f(r * .8 * A.k)},${f(r * .8 * A.k)} q${f(-r * .1 * A.k)},${f(r * .9 * A.k)} ${f(-r * .9 * A.k)},${f(r * .7 * A.k)} q${f(-r * .8 * A.k)},${f(-r * .1 * A.k)} ${f(-r * .9 * A.k)},${f(-r * .8 * A.k)} Z" fill="#1d2a44" opacity=".16"/>`
  + `<circle cx="${f(A.X(u) + r * .9 * A.k)}" cy="${f(A.Y(v) + r * 1.1 * A.k)}" r="${f(5 * A.k)}" fill="#1d2a44" opacity=".16"/>` + (i === 0 ? `<path d="M${f(A.X(u) - r * .4 * A.k)},${f(A.Y(v) - r * .5 * A.k)} q${f(8 * A.k)},-6 ${f(16 * A.k)},-2" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>` : ''));
// hibiscus: five round petals, a darker heart, a stamen line (the library flower is a daisy; an aloha shirt wants hibiscus)
const hibiscus = (x, y, r, c, heart) => { const pet = [...Array(5)].map((_, i) => { const a = (i * 72 - 90) * Math.PI / 180; return `<circle cx="${f(x + Math.cos(a) * r * .55)}" cy="${f(y + Math.sin(a) * r * .55)}" r="${f(r * .52)}" fill="${c}" stroke="${INK}" stroke-width="2.4"/>`; }).join('');
  return `<g>${pet}<circle cx="${f(x)}" cy="${f(y)}" r="${f(r * .3)}" fill="${heart}"/><path d="M${f(x)},${f(y)} l${f(r * .5)},${f(-r * .55)}" stroke="${heart}" stroke-width="2.6" stroke-linecap="round"/><circle cx="${f(x + r * .55)}" cy="${f(y - r * .6)}" r="2.6" fill="#f6d35a"/></g>`; };
const palmLeaf = (x, y, r, rot, c) => `<g transform="rotate(${rot} ${f(x)} ${f(y)})"><path d="M${f(x)},${f(y)} q${f(r * .5)},${f(-r * .5)} ${f(r * 1.5)},0 q${f(-r)},${f(r * .5)} ${f(-r * 1.5)},0 Z" fill="${c}" stroke="${INK}" stroke-width="2.2"/><path d="M${f(x + 3)},${f(y)} L${f(x + r * 1.35)},${f(y)}" stroke="${INK}" stroke-width="1.6" opacity=".5"/></g>`;
PART.aloha = (A, c1, c2, leaf, heart) => { const P = [[-.62, .26, 1], [.48, .2, 0], [.02, .44, 1], [-.5, .66, 0], [.62, .58, 1], [-.08, .82, 0], [.4, .9, 1], [.75, .32, 0], [-.85, .48, 1]];
  return P.flatMap(([u, v, k], i) => [palmLeaf(A.X(u) + 8, A.Y(v) + 4, 22 * A.k, i * 47 - 30, leaf), hibiscus(A.X(u), A.Y(v), (k ? 22 : 17) * A.k, k ? c1 : c2, heart)]); };
// a chest pocket holding folded sunglasses hooked over its edge (grandpa) and a stitched pocket edge
PART.shadesPocket = (A, u = -.48, v = .3) => A.back ? [] : [
  `<rect x="${f(A.X(u) - 30 * A.k)}" y="${f(A.Y(v))}" width="${f(60 * A.k)}" height="${f(54 * A.k)}" rx="5" fill="${CREAM}" stroke="${INK}" stroke-width="3"/>`,
  `<path d="M${f(A.X(u) - 24 * A.k)},${f(A.Y(v) + 7)} L${f(A.X(u) + 24 * A.k)},${f(A.Y(v) + 7)}" stroke="${KHAKID}" stroke-width="2" stroke-dasharray="5 4"/>`,
  `<g transform="rotate(-8 ${f(A.X(u))} ${f(A.Y(v))})"><rect x="${f(A.X(u) - 26 * A.k)}" y="${f(A.Y(v) - 16 * A.k)}" width="${f(22 * A.k)}" height="${f(16 * A.k)}" rx="6" fill="#26303a" stroke="${INK}" stroke-width="3"/><rect x="${f(A.X(u) + 2 * A.k)}" y="${f(A.Y(v) - 16 * A.k)}" width="${f(22 * A.k)}" height="${f(16 * A.k)}" rx="6" fill="#26303a" stroke="${INK}" stroke-width="3"/><path d="M${f(A.X(u) - 4 * A.k)},${f(A.Y(v) - 10 * A.k)} L${f(A.X(u) + 2 * A.k)},${f(A.Y(v) - 10 * A.k)}" stroke="${INK}" stroke-width="3"/><path d="M${f(A.X(u) - 20 * A.k)},${f(A.Y(v) - 12 * A.k)} l6,-2" stroke="#9fd6e8" stroke-width="2.4" stroke-linecap="round"/></g>`,
  `<rect x="${f(A.X(u) + 14 * A.k)}" y="${f(A.Y(v) - 20 * A.k)}" width="${f(6 * A.k)}" height="${f(30 * A.k)}" rx="2" fill="${CHERRY}" stroke="${INK}" stroke-width="2"/>`];   // a red pencil next to the shades (he keeps the car's log)
// chamois cloth tucked in the waistband, hanging down the hip (the car-washer's tool; shows front, 3/4, side and back)
PART.chamois = (A, u = .62) => { const s = A.back ? -1 : 1, x = A.X(u * s), y = A.Y(.74);
  return [`<path d="M${f(x - 20 * A.k)},${f(y)} L${f(x + 22 * A.k)},${f(y - 4)} L${f(x + 30 * A.k)},${f(y + 70 * A.k)} Q${f(x + 12 * A.k)},${f(y + 84 * A.k)} ${f(x + 4 * A.k)},${f(y + 66 * A.k)} Q${f(x - 8 * A.k)},${f(y + 88 * A.k)} ${f(x - 24 * A.k)},${f(y + 70 * A.k)} Z" fill="#e3b873" stroke="${INK}" stroke-width="3.4" stroke-linejoin="round"/>`,
    `<path d="M${f(x - 10 * A.k)},${f(y + 12 * A.k)} l3,${f(48 * A.k)} M${f(x + 12 * A.k)},${f(y + 10 * A.k)} l5,${f(50 * A.k)}" stroke="#b98a48" stroke-width="2.4" fill="none"/>`,
    `<path d="M${f(x - 16 * A.k)},${f(y + 2)} L${f(x + 24 * A.k)},${f(y - 2)}" stroke="${KHAKID}" stroke-width="5"/>`]; };
// a darned patch on the trouser seat / thigh (old trousers kept for washing the car): square, cross stitches round it
PART.darn = (A, u = -.52, v = .9, c = '#c9b285') => { const x = A.X(A.back ? -u : u), y = A.Y(v), w = 30 * A.k;
  return [`<rect x="${f(x - w / 2)}" y="${f(y - w / 2)}" width="${f(w)}" height="${f(w * .9)}" rx="3" fill="${c}" stroke="${INK}" stroke-width="2.6" transform="rotate(-6 ${f(x)} ${f(y)})"/>`,
    `<rect x="${f(x - w / 2 + 4)}" y="${f(y - w / 2 + 4)}" width="${f(w - 8)}" height="${f(w * .9 - 8)}" rx="2" fill="none" stroke="${KHAKID}" stroke-width="1.8" stroke-dasharray="4 3" transform="rotate(-6 ${f(x)} ${f(y)})"/>`]; };
// braces clips: brass clips at the waistband ends of the library suspenders
PART.braceClips = (A) => { const s = A.back ? -1 : 1, us = A.back ? [-.18, .18] : [-.5, .5];
  return us.map(u => `<rect x="${f(A.X(u * s) - 8 * A.k)}" y="${f(A.Y(.71))}" width="${f(16 * A.k)}" height="${f(14 * A.k)}" rx="3" fill="${BRASS}" stroke="${INK}" stroke-width="2.6"/>`); };
// KID: the shark print (big open grin, a fin, three "splash" ticks), a star iron-on patch, grass stain, frayed shorts hem with orange contrast stitches
PART.sharkPrint = (A, v = .46) => { if (A.back) return []; const x = A.cx + (A.view === '34' ? 6 : 0), y = A.Y(v), k = A.k * 1.05;
  return [`<path d="M${f(x - 56 * k)},${f(y)} Q${f(x - 20 * k)},${f(y - 40 * k)} ${f(x + 34 * k)},${f(y - 16 * k)} L${f(x + 58 * k)},${f(y - 32 * k)} L${f(x + 52 * k)},${f(y + 2 * k)} L${f(x + 60 * k)},${f(y + 30 * k)} L${f(x + 34 * k)},${f(y + 14 * k)} Q${f(x - 20 * k)},${f(y + 34 * k)} ${f(x - 56 * k)},${f(y)} Z" fill="${SHARK}" stroke="${INK}" stroke-width="3.4" stroke-linejoin="round"/>`,
    `<path d="M${f(x - 8 * k)},${f(y - 26 * k)} L${f(x + 2 * k)},${f(y - 52 * k)} L${f(x + 16 * k)},${f(y - 22 * k)} Z" fill="${SHARK}" stroke="${INK}" stroke-width="3.2" stroke-linejoin="round"/>`,
    `<path d="M${f(x - 50 * k)},${f(y + 4 * k)} Q${f(x - 34 * k)},${f(y + 18 * k)} ${f(x - 16 * k)},${f(y + 6 * k)} Z" fill="${WHITE}" stroke="${INK}" stroke-width="2.6"/>`,
    `<path d="M${f(x - 46 * k)},${f(y + 6 * k)} l3,5 l3,-5 l3,6 l3,-6 l3,6 l3,-5 l3,5" fill="none" stroke="${INK}" stroke-width="1.8"/>`,
    `<path d="M${f(x - 56 * k)},${f(y + 14 * k)} Q${f(x - 20 * k)},${f(y + 30 * k)} ${f(x + 30 * k)},${f(y + 14 * k)}" fill="none" stroke="#e8eef4" stroke-width="3" opacity=".8"/>`,
    `<circle cx="${f(x - 38 * k)}" cy="${f(y - 8 * k)}" r="${f(4.5 * k)}" fill="${INK}"/><circle cx="${f(x - 39.5 * k)}" cy="${f(y - 9.5 * k)}" r="${f(1.5 * k)}" fill="#fff"/>`,
    ...[[-70, -26, -28], [-74, -6, -10], [-70, 16, 14]].map(([dx, dy, a]) => `<path d="M${f(x + dx * k)},${f(y + dy * k)} l${f(-12 * k)},${f(a * .3 * k)}" stroke="${TURQ}" stroke-width="4" stroke-linecap="round"/>`)]; };
PART.starPatch = (A, u = .62, v = .26) => { if (A.back) return []; const x = A.X(u), y = A.Y(v), r = 15 * A.k, pts = [...Array(10)].map((_, i) => { const a = (i * 36 - 90) * Math.PI / 180, rr = i % 2 ? r * .45 : r; return `${f(x + Math.cos(a) * rr)},${f(y + Math.sin(a) * rr)}`; }).join(' ');
  return [`<circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 1.25)}" fill="${TURQ}" stroke="${INK}" stroke-width="2.6"/>`, `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 1.05)}" fill="none" stroke="${WHITE}" stroke-width="1.6" stroke-dasharray="3 3"/>`, `<polygon points="${pts}" fill="#f6d35a" stroke="${INK}" stroke-width="2"/>`]; };
PART.grassStain = (A, u = -.55, v = .62) => A.back ? [] : [`<ellipse cx="${f(A.X(u))}" cy="${f(A.Y(v))}" rx="${f(16 * A.k)}" ry="${f(8 * A.k)}" fill="#7fae4a" opacity=".45" transform="rotate(-20 ${f(A.X(u))} ${f(A.Y(v))})"/>`, `<ellipse cx="${f(A.X(u) + 10)}" cy="${f(A.Y(v) + 9)}" rx="${f(7 * A.k)}" ry="${f(4 * A.k)}" fill="#7fae4a" opacity=".4"/>`];
PART.fray = (A, v = 1.0, c = ORANGE) => { const y = A.Y(v); let d = ''; for (let x = A.x0 + 10; x < A.x1 - 10; x += 9) d += `M${f(x)},${f(y + 2)} l${(x % 2) ? 2 : -2},9 `;
  return [`<path d="${d}" stroke="#c7d4e8" stroke-width="2.4" stroke-linecap="round"/>`, `<path d="M${f(A.x0)},${f(y - 12)} Q${f(A.cx)},${f(y - 2)} ${f(A.x1)},${f(y - 12)}" fill="none" stroke="${c}" stroke-width="2.2" stroke-dasharray="6 5"/>`]; };
PART.shortsPocket = (A) => A.back ? [-1, 1].flatMap(s => [`<path d="M${f(A.X(s * .55) - 22 * A.k)},${f(A.Y(.86))} l${f(44 * A.k)},0 l-4,${f(30 * A.k)} l${f(-36 * A.k)},0 Z" fill="${DENIMD}" stroke="${INK}" stroke-width="2.6"/>`, `<path d="M${f(A.X(s * .55) - 16 * A.k)},${f(A.Y(.86) + 6)} l${f(32 * A.k)},0" stroke="${ORANGE}" stroke-width="2" stroke-dasharray="4 4"/>`])
  : [-1, 1].map(s => `<path d="M${f(A.X(s * .78))},${f(A.Y(.79))} Q${f(A.X(s * .55))},${f(A.Y(.84))} ${f(A.X(s * .5))},${f(A.Y(.95))}" fill="none" stroke="${ORANGE}" stroke-width="2.4" stroke-dasharray="5 4"/>`);

// ---------- recipes ----------
// GRANDPA: cream aloha shirt (hibiscus in his car's turquoise + a coral bloom), camp collar, shell buttons, chest pocket with folded shades and a pencil,
// khaki trousers on leather braces with brass clips, a darned patch on the thigh, a chamois cloth tucked in his waistband, fresh wet patches from the hose.
O('stGrandpaAloha', 'Style test grandpa: cream aloha shirt with turquoise hibiscus, khaki trousers on braces, chamois in the waistband (1990s-today, suburban US)', 'today', 'm', [CREAM, KHAKI, TURQ],
  [['aloha', TURQ, CORAL, LEAFG, TURQD], ['shirtCollar', 'a'], ['vneck', '#ffffff', .26], ['buttons', 4, '#f4efe2', .32, .62], ['shadesPocket', .5, .3], ['wetPatch'],
   ['low', 'b', .7], ['hem', KHAKID, .05], ['suspenders', LEATHER], ['braceClips'], ['darn', -.5, .9], ['chamois', -.62], ['seams']]);
// KID: white tee with cherry-red raglan sleeves-and-collar and a big grinning shark, a star iron-on patch, a grass stain, denim shorts with orange
// contrast stitching, back pockets and a frayed hem.
O('stKidShark', 'Style test kid: white raglan tee with a grinning shark print, denim shorts with orange stitching (today, suburban US)', 'today', 'u', [WHITE, CHERRY, DENIM],
  [['raglan', 'b'], ['crew', 'b'], ['sharkPrint', .44], ['starPatch', -.6, .3], ['grassStain', .5, .64], ['low', 'c', .74], ['shortsPocket'], ['fray', 1.0], ['seams']]);

// ---------- head wear ----------
// grandpa's straw hat = the library FEDORA shape in Panama straw (pinched crown, wide brim): band overdrawn in HIS CAR'S TURQUOISE, the library's red
// feather left out, a tiny cream car-badge pin on the band (signature), weave lines on the crown; lifted off the head by the surprise (lift / tilt)
const STRAW = '#e8cf86', STRAWD = '#b89a4e';
const strawLift = (lift, tilt) => Object.assign(PP => { const hat = HATS2.fedora({ ...PP, wearCol: STRAW }).filter(x => !/l6,-30 l12,4/.test(x)); const y = PP.brimY, W = (PP.widthAt(y) - 2) * .9, h = 18, top = PP.crownY - 52;
  const bandP = `<path d="M${f(-W)},${f(y - h)} Q0,${f(y - h + 9)} ${f(W)},${f(y - h)} L${f(W)},${f(y)} Q0,${f(y + 10)} ${f(-W)},${f(y)} Z" fill="${TURQ}" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/>` +
    `<path d="M${f(-W + 8)},${f(y - h / 2)} Q0,${f(y - h / 2 + 9.5)} ${f(W - 8)},${f(y - h / 2)}" fill="none" stroke="#8fe0dc" stroke-width="2.2" stroke-dasharray="6 6" stroke-linecap="round" opacity=".85"/>`;
  const weave = PP.view === 'back' ? '' : [0, 1, 2].map(k => `<path d="M${f(-W * .8)},${f(y - h - 10 - k * 13)} Q0,${f(y - h - 2 - k * 13)} ${f(W * .8)},${f(y - h - 10 - k * 13)}" fill="none" stroke="${STRAWD}" stroke-width="2.2" stroke-dasharray="9 5" opacity=".8"/>`).join('');
  const pin = PP.view === 'back' ? '' : `<g transform="translate(${PP.view === 'side' ? 26 : -30},${f(y - h / 2)})"><rect x="-11" y="-7" width="22" height="11" rx="5" fill="${CREAM}" stroke="${INK}" stroke-width="2.4"/><rect x="-5" y="-11" width="10" height="6" rx="3" fill="${CREAM}" stroke="${INK}" stroke-width="2"/><circle cx="-6" cy="5" r="3.2" fill="${INK}"/><circle cx="6" cy="5" r="3.2" fill="${INK}"/></g>`;   // signature: a tiny cream car-badge pin on the band
  return [`<g transform="translate(0,${-lift}) rotate(${tilt} 0 ${f(y)})">`, ...hat, weave, bandP, pin, '</g>']; }, { label: 'Panama straw hat, turquoise band, car pin (can lift)', era: 'today' });
// kid's cap backwards: library capBack in cherry red; in 3/4 (PP.v34: the rig passes view 'front' + v34) the peak sticks out at the BACK of the head,
// the adjuster strap arch shows over the forehead; messy fringe tufts poke out under it
const capBack34 = Object.assign(PP => { const v34 = PP.v34 && PP.view !== 'side' && PP.view !== 'back', o = HATS2.capBack({ ...PP, wearCol: CHERRY, view: v34 ? '34' : PP.view }); if (PP.view === 'side' || PP.view === 'back') return o;
  const y = PP.brimY + 2, w = PP.widthAt(y), back = -w + 4;
  const peak = v34 ? `<path d="M${f(back + 22)},${f(y - 20)} L${f(back - 62)},${f(y - 6)} Q${f(back - 72)},${f(y + 8)} ${f(back - 56)},${f(y + 10)} L${f(back + 22)},${f(y + 4)} Z" fill="${CHERRYD}" stroke="${INK}" stroke-width="5.5" stroke-linejoin="round"/>` +
    `<path d="M${f(back - 4)},${f(y - 9)} L${f(back - 52)},${f(y - 1)}" stroke="#e8606a" stroke-width="3" stroke-linecap="round" stroke-dasharray="6 5"/>` : '';
  const sx = v34 ? w * .32 : 0, strap = `<path d="M${f(sx - 26)},${f(y + 1)} Q${f(sx)},${f(y - 34)} ${f(sx + 26)},${f(y + 1)} Z" fill="${WHITE}" stroke="${INK}" stroke-width="4"/><rect x="${f(sx - 22)}" y="${f(y - 5)}" width="44" height="7" rx="3" fill="${CHERRYD}" stroke="${INK}" stroke-width="2.4"/>`;
  const tufts = `<path d="M${f(sx - 22)},${f(y + 2)} l6,16 l7,-12 l8,16 l6,-15 l9,12 l2,-17" fill="${H_KID}" stroke="${INK}" stroke-width="3.4" stroke-linejoin="round"/>`;
  return [peak, ...o, tufts, strap]; }, { label: 'Cherry cap worn backwards (peak behind in 3/4), strap arch, messy fringe', era: 'today' });

// the kid's knee plaster (LEFT knee: front = screen right leg; 3/4 facing right = near leg), a criss-cross plaster with the pad (fire-truck kid's, bigger)
// 2026-11-21 style test: on the NEAR knee in 3/4 facing right (his RIGHT knee = screen-left leg), knee height = half way between hips and feet
const kneePlaster = B => { const v = B.view, d = B.dir || 1; if (B.form !== 'kid') return [];
  const y = Math.round(B.bot + (B.ground - B.bot) * .5) - 6, x = v === 'side' ? B.cx + 6 * d : v === 'back' ? B.cx + 22 : B.cx - 24 * (v === 'front' ? 1 : d);
  return [`<g transform="rotate(${v === 'side' ? -8 * d : -14} ${f(x)} ${y})"><rect x="${f(x - 19)}" y="${y - 9}" width="38" height="18" rx="8" fill="#f0c9a0" stroke="${INK}" stroke-width="3.5"/><rect x="${f(x - 7)}" y="${y - 6}" width="14" height="12" rx="2" fill="#f8e3c8"/><path d="M${f(x - 15)},${y - 3} l4,0 M${f(x + 11)},${y - 3} l4,0 M${f(x - 15)},${y + 3} l4,0 M${f(x + 11)},${y + 3} l4,0" stroke="#d6a77a" stroke-width="1.6"/></g>`]; };

const base = spec => ({ form: 'standard', face: 'standard', views: true, sideFarArm: true, ...spec });
const person = (spec, hair, hairCol, o = {}) => { let s = base(spec); if (o.face) s = withFace(s, { col: hairCol, ...o.face });
  return wear(s, hair, { col: hairCol, ...(o.hat ? { hat: o.hat, hatScale: o.hatScale, hatDrop: o.hatDrop } : {}) }); };

export const TITLE = 'Style test cast: grandpa washing his car, the kid with the hose (suburban US, today)';
export const CAST = [
  person({ name: 'grandpa', label: 'GRANDPA: proud of his turquoise car; straw hat lifting in the surprise', size: 'fat', outfit: 'stGrandpaAloha', outfitPal: { a: CREAM, b: KHAKI, c: TURQ } }, 'baldTufts', H_GRAMPS,
    { face: { stache: 'chevron', acc: ['roundGlasses'] }, hat: strawLift(120, -16) }),
  person({ name: 'grandpaHat', label: 'GRANDPA, hat on (rest)', size: 'fat', outfit: 'stGrandpaAloha', outfitPal: { a: CREAM, b: KHAKI, c: TURQ } }, 'baldTufts', H_GRAMPS,
    { face: { stache: 'chevron', acc: ['roundGlasses'] }, hat: strawLift(0, 0) }),
  person({ name: 'kid', label: 'THE KID: hose ambusher, cap backwards, shark tee', form: 'kid', outfit: 'stKidShark', outfitPal: { a: WHITE, b: CHERRY, c: DENIM }, over: kneePlaster }, 'spiky', H_KID,
    { face: { acc: ['freckles'] }, hat: capBack34, hatDrop: -16 }),
];
