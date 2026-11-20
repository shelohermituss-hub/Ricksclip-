// HOOK v2 pitch 3 stand-in cast: "The Widow Who Drilled Her Kitchen Table" (Reims, Champagne, 1816). Hook builder 2026-11-16.
// Built ONLY from the locked kit (bible bodies, hair_lib, head_wear, outfit_lib parts); recipes and two small pieces registered here at load.
// PERIOD CHECK 1816 France (hat / neckwear / facial hair):
//  widow    white frilled widow's cap (bonnet), black mourning ribbon round it (Regency widows wore a white cap indoors) / white frilled
//           chemisette collar (ruff) over a high-waisted black mourning gown (Empire line 1800-1820) / - . SIG: ring of iron cellar keys at the waist.
//  cellar   knitted wool cap, no pompom (French workman's bonnet) / shirt + knotted neckerchief, no stock / clean-shaven (1810s workmen: no moustache).
//           Long BLUE work apron (the Champagne cellar worker's tablier bleu). SIG: silver tastevin (tasting cup) on a cord round the neck.
import { wear, HATS2 } from '../head_wear.mjs';
import { O, SK, skPat, WHITE } from '../outfit_lib.mjs';
import { INK, shade, tint } from '../char2d.mjs';
export const TITLE = 'Champagne hook stand-ins: the widow and the cellar master (1816)';

const f = n => (+n).toFixed(1);
const MOURN = '#3a3346', MOURN_D = '#2a2532', CAPW = '#fbf6ea', FRILL = '#efe6d6', BLUE = '#2f62b0', WAIST = '#7a5236', CREAM = '#efe4c8';

O('widow1816', 'Widow: high-waisted black mourning gown, white ruff collar (1810s)', 'Europe history', 'f', [MOURN, WHITE, '#c9a14a'],
  [['ruff', WHITE], ['chestBand', MOURN_D, .3, .07], ['buttons', 3, '#8e84a0', .42, .62], ['seams']],
  { skirt: P => SK('ankle', P.a, { pat: skPat.pleats('#5a5068'), hem: MOURN_D, flare: 1.22, folds: 5 }) });
O('cellar1816', 'Cellar master: shirt, brown waistcoat, neckerchief, long blue apron (1810s)', 'Europe history', 'm', [CREAM, WAIST, BLUE],
  [['vest', 'b', .05, .4], ['shirtCollar', 'a'], ['kerchief', '#c8823c'], ['buttons', 4, '#d8b060', .4, .62], ['apron', BLUE, true], ['seams']]);

// ---------- signature pieces (body space, move with the torso) ----------
const geo = ctx => { const { cx, bodyTop: t, bodyBot: b, wB: w, side } = ctx, H = b - t, k = Math.max(.75, Math.min(1.35, w / (side ? 83 : 104))); return { X: u => cx + u * w, Y: v => t + v * H, H, k, side }; };
const addSig = (front, back) => S => { const d = S.details, bd = S.backDetails; if (front) S.details = ctx => [...(d ? d(ctx) : []), ...front(ctx, geo(ctx))]; if (back) S.backDetails = ctx => [...(bd ? bd(ctx) : []), ...back(ctx, geo(ctx))]; };
// WIDOW: a ring of three iron cellar keys hanging from the high waist band on the near side
const keys = (ctx, G) => { const k = G.k, x = G.X(G.side ? .2 : -.45), y = G.Y(.4), o = [];
  o.push(`<path d="M${f(x)},${f(y)} L${f(x)},${f(y + 26 * k)}" stroke="${INK}" stroke-width="4" fill="none"/>`, `<circle cx="${f(x)}" cy="${f(y + 38 * k)}" r="${f(12 * k)}" fill="none" stroke="${INK}" stroke-width="7"/><circle cx="${f(x)}" cy="${f(y + 38 * k)}" r="${f(12 * k)}" fill="none" stroke="#8a8f9e" stroke-width="3.5"/>`);
  [[-16, 1.0], [0, 1.25], [16, .95]].forEach(([dx, s]) => { const kx = x + dx * k, ky = y + 48 * k, L = 56 * k * s;
    o.push(`<path d="M${f(kx)},${f(ky)} L${f(kx + dx * .3 * k)},${f(ky + L)}" stroke="${INK}" stroke-width="${f(10 * k)}" stroke-linecap="round"/><path d="M${f(kx)},${f(ky)} L${f(kx + dx * .3 * k)},${f(ky + L)}" stroke="#7c8292" stroke-width="${f(5 * k)}" stroke-linecap="round"/>`,
      `<rect x="${f(kx + dx * .3 * k - 2)}" y="${f(ky + L - 14 * k)}" width="${f(12 * k)}" height="${f(9 * k)}" fill="#7c8292" stroke="${INK}" stroke-width="3"/>`); });
  return o; };
// CELLAR MASTER: the silver tastevin on a cord round the neck
const tastevin = (ctx, G) => { const k = G.k, x = G.X(G.side ? .3 : 0), y = G.Y(.36), o = [];
  o.push(`<path d="M${f(G.X(G.side ? .1 : -.3))},${f(G.Y(.06))} Q${f(x - 10)},${f(y - 30 * k)} ${f(x)},${f(y - 18 * k)} Q${f(x + 10)},${f(y - 30 * k)} ${f(G.X(G.side ? .45 : .3))},${f(G.Y(.06))}" stroke="${INK}" stroke-width="3" fill="none"/>`,
    `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(26 * k)}" ry="${f(19 * k)}" fill="#c9ced8" stroke="${INK}" stroke-width="5"/><ellipse cx="${f(x - 2)}" cy="${f(y - 1)}" rx="${f(15 * k)}" ry="${f(10 * k)}" fill="#e9edf4" stroke="#8a90a0" stroke-width="2.5"/>`,
    `<path d="M${f(x - 12 * k)},${f(y - 8 * k)} q8,-6 16,-3" stroke="#ffffff" stroke-width="3" fill="none" stroke-linecap="round"/>`);
  return o; };

// ---------- the WIDOW'S CAP: white frilled cap wrapping the whole head, black mourning ribbon, frill framing the face ----------
const Pth = (d, fill, sw = 7) => `<path d="${d}" fill="${fill}" stroke="${INK}" stroke-width="${f(sw * 1.25)}" stroke-linejoin="round" stroke-linecap="round"/>`;
const scallops = (pts, r, col) => pts.map(([x, y]) => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${col}" stroke="${INK}" stroke-width="4.5"/>`).join('') + pts.map(([x, y]) => `<circle cx="${f(x - r * .25)}" cy="${f(y - r * .25)}" r="${f(r * .45)}" fill="#ffffff" opacity=".7"/>`).join('');
const quad = (A, C, B, n) => [...Array(n)].map((_, i) => { const t = i / (n - 1), u = 1 - t; return [u * u * A[0] + 2 * u * t * C[0] + t * t * B[0], u * u * A[1] + 2 * u * t * C[1] + t * t * B[1]]; });
const widowCap = Object.assign(PP => { const v = PP.view, y = PP.brimY, w = PP.widthAt(y) + 10, top = PP.crownY - 46, rib = MOURN_D;
  if (v === 'back') return [Pth(`M${f(-w - 14)},${f(y + 60)} C${f(-w - 26)},${f(top - 10)} ${f(w + 26)},${f(top - 10)} ${f(w + 14)},${f(y + 60)} Q0,${f(y + 84)} ${f(-w - 14)},${f(y + 60)} Z`, CAPW),
    `<path d="M${f(-w * .8)},${f(top + 50)} Q0,${f(top + 30)} ${f(w * .8)},${f(top + 50)}" stroke="${shade(CAPW, .82)}" stroke-width="3" fill="none"/>`,
    Pth(`M${f(-w - 8)},${f(y + 14)} Q0,${f(y - 6)} ${f(w + 8)},${f(y + 14)} L${f(w + 8)},${f(y + 32)} Q0,${f(y + 12)} ${f(-w - 8)},${f(y + 32)} Z`, rib, 5),
    Pth(`M0,${f(y + 20)} L-40,${f(y - 6)} L-44,${f(y + 44)} Z M0,${f(y + 20)} L40,${f(y - 6)} L44,${f(y + 44)} Z`, rib, 5), Pth(`M-8,${f(y + 26)} L-26,${f(y + 96)} L-6,${f(y + 88)} Z M8,${f(y + 26)} L26,${f(y + 96)} L6,${f(y + 88)} Z`, rib, 4.5)];
  if (v === 'side') { const fx = w * .42;
    return [Pth(`M${f(fx)},${f(y + 34)} C${f(fx + 6)},${f(top - 4)} ${f(-w - 40)},${f(top - 16)} ${f(-w - 30)},${f(y + 44)} Q${f(-w * .5)},${f(y + 92)} ${f(-w * .05)},${f(y + 66)} Q${f(fx * .6)},${f(y + 50)} ${f(fx)},${f(y + 34)} Z`, CAPW),
      `<path d="M${f(-w * .2)},${f(top + 20)} Q${f(-w * .7)},${f(top + 50)} ${f(-w * .9)},${f(y + 30)}" stroke="${shade(CAPW, .82)}" stroke-width="3" fill="none"/>`,
      Pth(`M${f(fx - 30)},${f(top + 30)} Q${f(-w * .4)},${f(top + 6)} ${f(-w - 28)},${f(y - 6)} L${f(-w - 26)},${f(y + 12)} Q${f(-w * .4)},${f(top + 26)} ${f(fx - 34)},${f(top + 48)} Z`, rib, 5),
      Pth(`M${f(-w - 24)},${f(y + 4)} L${f(-w - 62)},${f(y + 66)} L${f(-w - 40)},${f(y + 74)} Z`, rib, 4.5),
      scallops(quad([fx - 4, y - 4], [fx + 16, top + 20], [-w * .15, top - 8], 8), 13, FRILL)];
  }
  const A = [-w - 10, y + 52], B = [w + 10, y + 52], C = [0, y - 58];
  return [Pth(`M${f(-w - 16)},${f(y + 56)} C${f(-w - 30)},${f(top - 14)} ${f(w + 30)},${f(top - 14)} ${f(w + 16)},${f(y + 56)} Q${f(w * .7)},${f(y + 4)} 0,${f(y - 6)} Q${f(-w * .7)},${f(y + 4)} ${f(-w - 16)},${f(y + 56)} Z`, CAPW),
    `<path d="M${f(-w * .6)},${f(top + 34)} Q0,${f(top + 14)} ${f(w * .6)},${f(top + 34)}" stroke="${shade(CAPW, .82)}" stroke-width="3" fill="none"/>`,
    Pth(`M${f(-w - 16)},${f(y - 18)} Q0,${f(top - 6)} ${f(w + 16)},${f(y - 18)} L${f(w + 16)},${f(y)} Q0,${f(top + 14)} ${f(-w - 16)},${f(y)} Z`, rib, 5),
    Pth(`M${f(w + 10)},${f(y - 8)} L${f(w + 42)},${f(y - 34)} L${f(w + 46)},${f(y + 16)} Z`, rib, 4.5),
    scallops(quad(A, C, B, 13), 14, FRILL)];
}, { label: "Widow's frilled white cap with black mourning ribbon (1810s)", era: '1800-1830 widow, housekeeper' });
const knitCap = Object.assign(PP => HATS2.beanie(PP).slice(0, -1), HATS2.beanie, { label: 'Knitted wool cap, no pompom (workman 1700s-1800s)' });

const base = spec => ({ form: 'standard', face: 'standard', views: true, sideFarArm: true, ...spec });
export const CAST = [
  wear(base({ name: 'widow', label: 'The Widow (Barbe-Nicole, 1816)', size: 'standard', outfit: 'widow1816', dress: addSig(keys) }), 'lowBun', { col: '#4a3024', hat: widowCap }),
  wear(base({ name: 'cellar', label: 'The Cellar Master (1816)', size: 'fat', outfit: 'cellar1816', dress: addSig(tastevin) }), 'elderGrey', { col: '#cfcbd6', hat: knitCap, hatCol: '#a8452e' }),
];
