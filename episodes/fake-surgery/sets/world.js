// fake-surgery WORLD constants (lead, 2026-11-16). Plan metres, Z up. Each place is its own set with its own origin, far apart so lights never leak.
// Places join by camera flights in the build-out (PICTURE_PLAN "ONE FLYING TAKE"), not by one connected mesh.
export const ORIGIN = {
  or:        [0, 0, 0],    // A OR 3 (sets/or_room.js; hook board coordinates kept)
  corridor:  [60, 0, 0],   // B corridor + pre-op bay (sets/corridor.js)
  office:    [120, 0, 0],  // C doctors' office / lounge, three dressings: night 1994, striped afternoon, 2004 (sets/office.js)
  stairwell: [180, 0, 0],  // D stairwell, afternoon + evening (sets/stairwell.js)
  waiting:   [240, 0, 0],  // E waiting room (sets/waiting.js)
};
export const FLOOR_Z = 0;
export const STOREY = 3.2;      // hospital storey height (stairwell: one flight = half a storey, 10 risers of 0.16 m)
export const DADO_Z = 1.2;      // the sea-green tile dado height in corridor + stairwell (the loop colour)
export const TILE_SEA = '#4fa59a';
