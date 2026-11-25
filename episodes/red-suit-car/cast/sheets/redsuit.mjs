// FILM CAST, red-suit-car (2026-11-25): ONE character, the man in the red suit and the gold hat.
// Library body (three sizes), hair_lib, head_wear, face_gear and an outfit_lib recipe registered here (library files NOT edited).
// SIGNATURE DETAIL (CB_RULES 4): the thin pencil moustache + the gold pocket hankie. RED is his alone (the car is his hero object).
import { wear } from '../head_wear.mjs';
import { O } from '../outfit_lib.mjs';
import { withFace } from '../face_gear.mjs';

const RED = '#c81624', REDD = '#9a1220', REDL = '#dd3a3e', SHIRT = '#f6eedc', GOLD = '#f2c23a', GOLDD = '#a87a18';
// red two-button suit: darker red lapels, cream shirt, GOLD tie, gold buttons, gold hankie, gold lapel pin, flap pocket
O('redSuitBoss', 'Red two-button suit, cream shirt, gold tie, gold hankie and pin (today)', '1950-today', 'm', [RED, SHIRT, GOLD],
  [['lapels', REDD, SHIRT, 'tie', 'c'], ['buttons', 2, GOLD, .68, .82], ['pocket', .5, .44, { c: REDL, hankie: GOLD }],
   ['pocket', -.56, .7, { c: REDL, flap: 1, btn: GOLD }], ['pin', GOLD, 11, .14]], {});

const base = spec => ({ form: 'standard', face: 'standard', views: true, sideFarArm: true, ...spec });
export const TITLE = 'red-suit-car: cast';
export const CAST = [
  wear(withFace(base({ name: 'boss', label: 'The man in the red suit', size: 'standard', outfit: 'redSuitBoss', outfitPal: { a: RED, b: SHIRT, c: GOLD } }),
    { stache: 'pencil', col: '#2a1a14' }), 'slickBack', { col: '#2a1a14', hat: 'fedora', hatCol: GOLD, bandCol: REDD }),
];
