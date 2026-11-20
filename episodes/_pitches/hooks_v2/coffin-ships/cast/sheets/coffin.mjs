// Pitch 4 hook stand-in cast: "Why Ship Owners Wanted Their Ships to Sink" (coffin ships, an English harbour, about 1872).
// Built ONLY from the locked kit: the three bible body sizes, the outfit library parts (O, registered here, this folder only), library hats and face gear.
// PERIOD CHECK 1870s England:
//  - ship owner: tall silk top hat (the library stovepipe; top hats were still the gentleman's hat in the 1870s), mutton-chop whiskers (THE 1870s whisker),
//    a fur-collared overcoat over a waistcoat with a gold watch chain, a cream silk cravat. No bowler (1890s+ in the library), no moustache-only face.
//  - merchant seamen: dark wool pea jacket or a knitted guernsey, a knitted wool cap WITHOUT a pompom, full beards; no navy uniform collar (that is Navy, not merchant).
//  - dock worker: waistcoat over a collarless shirt, a neckerchief, knitted cap, stubble.
import { wear, HATS2 } from '../head_wear.mjs';
import { O } from '../outfit_lib.mjs';
import { K } from '../outfit_cols.mjs';
import { withFace } from '../face_gear.mjs';

const PLUM = '#6a2c5c', FUR = '#8a5a34', GOLDV = '#d9a63a', CREAM = '#f1e6cc';
// the owner's coat: plum wool overcoat, brown fur collar, gold silk waistcoat, cream cravat, gold watch chain, flapped pockets, knee-length skirts
O('owner1872', 'Ship owner: fur-collared overcoat, gold waistcoat, watch chain, cravat (1870s)', 'Europe history', 'm', [PLUM, GOLDV, CREAM],
  [['lapels', 'a', 'b', 'cravat', 'c'], ['furCollar', FUR, false], ['buttons', 3, '#3a1830', .5, .78, .3], ['chain', '#ffd25a', .62, .5],
   ['pocket', -.58, .74, { flap: 1, btn: '#3a1830' }], ['pocket', .58, .74, { flap: 1, btn: '#3a1830' }], ['seams']],
  { skirt: K('knee', 'a', P => ({ hem: FUR, hemW: 18, folds: 3 })) });
// merchant seaman: navy pea jacket with horn buttons over a cream frock shirt, mustard neckerchief, duck trousers
O('seaman1872', 'Merchant seaman: pea jacket, frock shirt, neckerchief (1870s)', 'Europe history', 'm', ['#26385e', '#e6dfcc', '#d8a12a'],
  [['lapels', 'a', 'b', 'cravat', 'c'], ['buttons', 4, '#c89a50', .54, .9, .3], ['pocket', -.55, .68, { c: 'rgba(20,16,24,.25)' }], ['low', '#d8cfb8', .9], ['seams']]);
// knitted guernsey (the fisherman's and seaman's jersey), teal-blue wool, rolled collar
O('guernsey1872', 'Knitted guernsey jersey (1870s seaman)', 'Europe history', 'm', ['#2c6f86', '#24586c', '#e6dfcc'], [['knit', 'b'], ['crew', 'b'], ['low', '#d8cfb8', .9], ['seams']]);
// dock worker: rust-brown waistcoat over a collarless cream shirt, red-brown neckerchief, rolled sleeves read by the shirt colour
O('docker1872', 'Dock labourer: waistcoat, collarless shirt, neckerchief (1870s)', 'Europe history', 'm', ['#e9dfc6', '#8a4a2a', '#2f6a6a'],
  [['vest', 'b', .05, .4], ['kerchief', 'c'], ['buttons', 4, '#3a2418', .5, .86], ['low', '#5a5048', .9], ['seams']]);

// knitted wool cap with no pompom (the pompom is not of the period here)
const knitCap = Object.assign(PP => HATS2.beanie(PP).slice(0, -1), HATS2.beanie, { label: 'Knitted wool cap, no pompom' });
const base = (spec) => ({ form: 'standard', face: 'standard', views: true, sideFarArm: true, ...spec });

export const TITLE = 'Pitch 4 stand-in cast: the coffin ship (England 1872)';
export const CAST = [
  // THE SHIP OWNER (hero, FAT): the only plum-and-gold man on a grey wet quay; silk top hat, grey-ginger mutton chops
  withFace(wear(base({ name: 'owner', label: 'The Ship Owner', size: 'fat', outfit: 'owner1872', outfitPal: { a: PLUM, b: GOLDV, c: CREAM } }),
    'slickBack', { col: '#8a6a52', hat: HATS2.stovepipe, hatCol: '#221e26', bandCol: '#4a1e3e' }), { beard: 'muttonChops', col: '#a8744a' }),
  // the old seaman with the lifebuoy: navy pea jacket, red-brown knit cap, big dark beard
  withFace(wear(base({ name: 'sailor', label: 'Old seaman (lifebuoy)', size: 'standard', outfit: 'seaman1872', outfitPal: { a: '#26385e', b: '#e6dfcc', c: '#d8a12a' } }),
    'curlyCrop', { col: '#3a2a20', hat: knitCap, hatCol: '#a5482c' }), { beard: 'full', col: '#3a2a20' }),
  // the young deckhand: teal guernsey, bare ginger curls, short beard
  withFace(wear(base({ name: 'deckhand', label: 'Young deckhand', size: 'thin', outfit: 'guernsey1872', outfitPal: { a: '#2c6f86', b: '#24586c', c: '#e6dfcc' } }),
    'curlyCrop', { col: '#c4642c' }), { beard: 'short', col: '#c4642c' }),
  // the dock worker on the tag rope: knit cap, stubble
  withFace(wear(base({ name: 'docker', label: 'Dock labourer', size: 'standard', outfit: 'docker1872', outfitPal: { a: '#e9dfc6', b: '#8a4a2a', c: '#2f6a6a' } }),
    'curlyCrop', { col: '#2e2420', hat: knitCap, hatCol: '#4f5a6e' }), { beard: 'stubble', col: '#2e2420' }),
];
