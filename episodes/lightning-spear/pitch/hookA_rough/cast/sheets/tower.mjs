// hookA stand-in cast (rough pitch frame, 2026-11-15): THE YOUNG MASON, north Italy about 1765. Bible body (standard form, standard size) dressed from the
// outfit library parts. Period check: linen shirt with an open collar (no stock, no cravat, no tie: a workman), a buttoned waistcoat (worn all through
// the 1700s), brown breeches colour, a knitted wool cap in madder red (the Italian workman's berretto; library hat 'beanie' shape recoloured). No brimmed 1800s hat.
import { wear, HATS2 } from '../head_wear.mjs';
import { O } from '../outfit_lib.mjs';
import { HAIR_STYLES } from '../hair_lib.mjs';
// CB 2026-11-15 on the hook frame: "remove the lines at his hair": plain short hair, no curl arcs, no strand lines, no streaks
HAIR_STYLES.masonPlain = { label: 'Plain short hair (mason)', era: '1760s workman', col: '#5a3320', top: 12, side: 6, fr: [-56, -62, -64, -62, -56], sideIn: 86, lines: 0, noShine: true };
O('mason1765', 'Mason: linen shirt, buttoned waistcoat, breeches (1760s workman)', 'Europe history', 'm', ['#f3ead6', '#12907c', '#e2a93b'],
  [['vest', 'b', .05, .4], ['shirtCollar', 'a'], ['buttons', 5, 'c', .4, .9], ['low', '#7a4a2c', .9], ['seams']]);
// the knitted workman's cap: the library beanie WITHOUT its pompom (a pompom is a modern thing; period check 1765)
const berretto = Object.assign(PP => HATS2.beanie(PP).slice(0, -1), HATS2.beanie, { label: 'Knitted wool cap (berretto), no pompom' });
export const TITLE = 'Pitch 1 stand-in: the young mason (1765)';
export const CAST = [
  wear({ form: 'standard', size: 'standard', face: 'standard', views: true, sideFarArm: true, name: 'mason', label: 'The Young Mason', outfit: 'mason1765', outfitPal: { a: '#f3ead6', b: '#12907c', c: '#e2a93b' } },
    'curlyCrop', { col: '#5a3320', hat: berretto, hatCol: '#cf3a2c' }),
];
