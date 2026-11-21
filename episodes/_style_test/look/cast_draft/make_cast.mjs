// make_cast.mjs: the two cast cards of the style test, drawn by the locked vector cast renderer (castkit buildChar + char2d drawCharacter).
// grandpa = bible 'farmer' (elder, straw sun hat, gramps hair), pose and props changed for this still; kid = bible 'soccer' (kid form), pose changed.
// usage (skill root): node episodes/_style_test/look/cast_draft/make_cast.mjs [faceGrandpa] [faceKid] -> look/cast_draft/<who>.png + cards.json (draft only; the cast is character-artist's, cast/) (feet row, hands, px size)
import { buildChar } from '../../../../templates/vector2d_characters/code/castkit.mjs';
import { drawCharacter, INK } from '../../../../templates/vector2d_characters/code/char2d.mjs';
import { bibleChar } from '../../../../templates/vector2d_characters/code/bible_sizes.mjs';
import { createRequire } from 'module'; import path from 'path'; import fs from 'fs'; import { fileURLToPath } from 'url';
const require = createRequire(import.meta.url); const { chromium } = require('/opt/node-tools/node_modules/playwright');
const HERE = path.dirname(fileURLToPath(import.meta.url)); const fG = process.argv[2] || 'jawdrop', fK = process.argv[3] || 'evil';
const f1 = v => (+v).toFixed(1);
const arm = (B, side, hx, hy, qx, qy) => { const [sx, sy] = side < 0 ? B.shL : B.shR; return { d: `M${sx},${sy} Q${f1(qx)},${f1(qy)} ${f1(hx)},${f1(hy)}`, hand: [hx, hy] }; };
const HANDS = {};
const farmer = await bibleChar('farmer'), soccer = await bibleChar('soccer');
const face = k => k.includes(',') ? k.split(',') : k;
// grandpa: both arms flung up in surprise, the yellow sponge squeezed in the raised right hand (screen right, toward the spray); no pitchfork, no hen
const grandpa = { ...farmer, face: face(fG), over: undefined,
  arms: B => { HANDS.grandpa = [[B.cx - 150, B.top - 120], [B.cx + 170, B.top - 150]];
    return { front: [arm(B, -1, B.cx - 150, B.top - 120, B.cx - 210, B.top + 10), arm(B, 1, B.cx + 170, B.top - 150, B.cx + 230, B.top)] }; },
  props: ({ cx, top }) => { const x = cx + 170, y = top - 150;
    return [`<rect x="${x - 34}" y="${y - 62}" width="68" height="50" rx="16" fill="#f6cf2e" stroke="${INK}" stroke-width="5" transform="rotate(-14 ${x} ${y - 37})"/>`,
      ...[[-16, -48], [4, -42], [18, -30], [-8, -28], [-20, -36], [10, -54]].map(([dx, dy]) => `<circle cx="${x + dx}" cy="${y + dy}" r="3.6" fill="#c99a12"/>`),
      `<circle cx="${x}" cy="${y}" r="15" fill="${INK}"/>`, `<circle cx="${cx - 150}" cy="${top - 120}" r="15" fill="${INK}"/>`]; } };
// kid: both hands forward and up to screen left (faces left, dir -1), a brass and green hose nozzle in the fists; the hose itself is 3D in Blender
const kid = { ...soccer, face: face(fK),
  arms: B => { HANDS.kid = [[B.cx - 150, B.top + 40], [B.cx - 70, B.top + 70]];
    return { front: [arm(B, -1, B.cx - 150, B.top + 40, B.cx - 120, B.top + 110), arm(B, 1, B.cx - 70, B.top + 70, B.cx + 20, B.top + 150)] }; },
  props: ({ cx, top }) => { const x = cx - 150, y = top + 40;
    return [`<g transform="rotate(-18 ${x} ${y})"><rect x="${x - 70}" y="${y - 13}" width="120" height="26" rx="10" fill="#3f9a3a" stroke="${INK}" stroke-width="5"/>`,
      `<rect x="${x - 96}" y="${y - 10}" width="30" height="20" rx="6" fill="#d9a63a" stroke="${INK}" stroke-width="4.5"/>`,
      `<path d="M${x + 40},${y + 10} q10,40 -6,64" fill="none" stroke="${INK}" stroke-width="6"/></g>`,
      `<circle cx="${x}" cy="${y}" r="14" fill="${INK}"/>`, `<circle cx="${cx - 70}" cy="${top + 70}" r="14" fill="${INK}"/>`]; } };
const CAST = { grandpa: [grandpa, 1], kid: [kid, -1] };
const b = await chromium.launch(); const out = {};
for (const [who, [spec, dir]] of Object.entries(CAST)) {
  const S = buildChar(spec, 500); S.view = '34'; S.dir = dir; const r = drawCharacter(S);
  const X0 = 0, Y0 = -260, W = 1000, H = 1300;   // feet line at y 1010 -> row 1270
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="${X0} ${Y0} ${W} ${H}"><defs>${r.defs}</defs>${r.body}</svg>`;
  const p = await b.newPage({ viewport: { width: W, height: H } });
  await p.setContent(`<html><body style="margin:0;background:transparent">${svg}</body></html>`);
  const f = path.join(HERE, who + '.png'); await p.screenshot({ path: f, omitBackground: true }); await p.close();
  out[who] = { png: who + '.png', W, H, feet_row: 1010 - Y0, cx: 500 - X0, dir, hands: (HANDS[who] || []).map(([x, y]) => [x - X0, y - Y0]), face: who === 'grandpa' ? fG : fK };
}
await b.close(); fs.writeFileSync(path.join(HERE, 'cards.json'), JSON.stringify(out, null, 1)); console.log('CAST', JSON.stringify(out));
