// PITCH 2 board cast (2026-11-16): "The Lines That Made Drivers Brake", Lake Shore Drive S-curve, Chicago, 2006. Library bodies and parts, recoloured.
// Period check 2006 (hat, neckwear, facial hair):
//   painter  city road crew: yellow HARD HAT (head_gear hardhat), safety-orange hi-vis vest with silver reflective bands (ANSI class 2, 2000s) over a
//            navy long-sleeve work shirt, jeans, tool belt; white paint splatters on the vest (his job). Short brown side part, stubble (night shift). No tie.
//   trucker  red buffalo plaid flannel shirt + quilted denim vest (2000s long-haul look), mesh BASEBALL cap, horseshoe moustache (any era since the 70s),
//            grey mullet under the cap. FAT body. The mocker: small and behind in frame 0.
import { wear } from '../head_wear.mjs';
import { withGear } from '../head_gear.mjs';
import { O } from '../outfit_lib.mjs';
import { withFace } from '../face_gear.mjs';

const ORANGE = '#ff6a14', ORD = '#d9520a', SILVER = '#e8ecf2', NAVY = '#24305c', DENIM = '#3d5f93', PAINT = '#fbfbf6', LEATHER = '#6e4527', RED = '#c23a2a', BLK = '#22202a';
O('striper2006', 'City road painter: safety-orange hi-vis vest with silver bands over a navy work shirt, white paint splatters, tool belt (2006)', '1990-2020', 'm',
  [NAVY, ORANGE, SILVER],
  [['shirtCollar', NAVY], ['vest', ORANGE, .06, .42], ['hiVis', SILVER], ['zip', '#c9ccd6', .16], ['pocket', .5, .3, { c: ORD, st: SILVER, pens: 1 }],
   ['nameTag', -.48, .26, '#f3ead6'], ['splat', [PAINT, PAINT, '#e9e9e2']], ['toolBelt', LEATHER, .84], ['low', DENIM, .93]]);
O('hauler2006', 'Long-haul trucker: red buffalo plaid flannel, quilted denim vest, big buckle (2000s)', '1990-2020', 'm', [RED, BLK, DENIM],
  [['plaid', BLK, BLK, 3], ['shirtCollar', RED], ['vest', DENIM, .3, .5], ['pocket', -.5, .5, { c: '#2f4c78', flap: 1, btn: SILVER }], ['belt', LEATHER, 'big', .86, SILVER]]);

const base = spec => ({ form: 'standard', face: 'standard', views: true, sideFarArm: true, ...spec });
export const TITLE = 'Pitch 2 cast: the road painter and the trucker (Chicago, 2006)';
export const CAST = [
  withFace(withGear(base({ name: 'painter', label: 'The Road Painter', size: 'standard', outfit: 'striper2006', outfitPal: { a: NAVY, b: ORANGE, c: SILVER } }), 'sidePart',
    { col: '#5a3a24', helmet: 'hardhat' }), { beard: 'stubble', col: '#5a3a24' }),
  withFace(wear(base({ name: 'trucker', label: 'The Trucker', size: 'fat', outfit: 'hauler2006', outfitPal: { a: RED, b: BLK, c: DENIM } }), 'mullet',
    { col: '#8a8078', hat: 'baseball', hatCol: '#2a5aa8' }), { stache: 'horseshoe', col: '#8a8078' }),
];
