# body_rig (2026-11-17)

Contact-driven full-body pose for seated, driving and lying characters. Every joint is solved from the set contacts, and the set is built from the rider's real size.

- body3d.mjs: skeleton(S, H) from the puppet's own numbers; ik2 two-bone IK with joint limits;
  solveSit(sk, fx) (seat, back rest, pedal/floor feet, wheel/desk hands, head under roof); solveLie(sk, fx) (hips on mattress, shoulders + head on pillow, knees flat or up);
  cabin.car / bus / chair / bed (sk, opt) build the set around the rider; setFit compares a real-size set; scaleCheck flags a shrunk rider.
  Each solve returns report lines: OK / FLOAT / SUNK / STRETCH / CRAMP / HEAD_CLIP with the gap in cm.
- sheet.mjs: the before/after proof sheet (node sheet.mjs out.png --bed-before bed_before_%d.png [--three dir]).
- Arms and legs are 3D ink tubes with an ink fist; the card draws body and head only (locked v12 look unchanged).

## In a film
cast entry: "body": { "rig": "car" | "bus" | "chair" | "bed", "opt": { ... }, "set": { "seatToRoof": m, "seatH": m } }
Check: node tools/frame_checks/body_check.mjs <film.json>  (exit 1 on any FAIL; also FAILs "in_vehicle": true without a body rig, and a driver drawn under 88 % of cast height).

## Findings
- A full-height standard character needs seat-to-roof about 1.14 m; a real hatchback (0.95) is too small. Build cars about 1.1-1.2x real size around the rider; never shrink the rider.
- A real 0.45 m chair is too high for the approved legs; the chair seat is built at the rider's knee height (about 0.27 m).

NOT yet wired into film.js (needs CB's OK). No rule files changed.
