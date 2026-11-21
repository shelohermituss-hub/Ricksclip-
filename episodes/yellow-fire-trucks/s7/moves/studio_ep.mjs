// STUDIO MOTION curves for the moonrakers episode moves (animator 2026-11-14).
// The master templates/motion_styles/studio.mjs named in cloud_rules/motion/STUDIO_MOTION.md is NOT on this PC (checked again today), so the episode
// carries its own copy of the numbers. Same table as episodes/armor-pins-test/cast/ep_pins.mjs (the proven build method, CB_RULES 10).
// All times are FRAMES at 30 fps from the start of a move. Nothing here is linear; every value change is a snap or a step.

// Rick's measured body snap (button press, STUDIO_MOTION 1): share of the move done after 0, 1, 2 ... 12 frames (66 % on f5), then still.
export const SN = [0, .05, .16, .31, .48, .66, .79, .88, .93, .96, .98, .99, 1];
// snap(f, n): the same curve stretched over n frames (n = 12 is Rick's own timing: 66 % on frame 5 of the move, settled by f12)
export const snap = (f, n = 12) => { if (f <= 0) return 0; const u = f * 12 / n; if (u >= 12) return 1; const i = Math.floor(u); return SN[i] + (SN[i + 1] - SN[i]) * (u - i); };
// tr(keys, f): keys [[f0, value, n]]; the first key is the start value; from frame f0 the value SNAPS to `value` over n frames, then holds DEAD STILL.
// Values may be numbers or arrays. A later key starts from wherever the earlier ones have got to (a move can be cut into by the next one).
export function tr(keys, f) { let v = keys[0][1]; for (let i = 1; i < keys.length; i++) { const [f0, to, n = 12] = keys[i]; if (f <= f0) break; const u = snap(f - f0, n); v = Array.isArray(to) ? v.map((a, j) => a + (to[j] - a) * u) : v + (to - v) * u; } return v; }
// IMPACT dip: the body sinks amp px and comes back in n frames (STUDIO_MOTION 3: 6-10 px, 3-4 f)
export const dip = (f, f0, amp = 8, n = 4) => f > f0 && f < f0 + n ? amp * Math.sin(Math.PI * (f - f0) / n) : 0;
// SETTLE ring: a part (head, hand, held prop, cloth) rebounds and comes to rest; amp is the first swing, gone within n frames (8-12 f)
export const ring = (f, f0, amp, n = 10) => f > f0 && f < f0 + n ? amp * Math.exp(-(f - f0) / 3) * Math.sin((f - f0) * 2.1) * (1 - (f - f0) / n) : 0;
// step(keys, f): faces, states: [[f0, value], ...] -> the value of the last key at or before f, zero in-betweens
export function step(keys, f) { let v = keys[0][1]; for (const [f0, x] of keys) if (f >= f0) v = x; return v; }
// Rick's 4-frame blink: half, shut, shut, half
export const blink4 = (f, f0) => { const d = Math.floor(f - f0); return d === 0 || d === 3 ? 'half' : d === 1 || d === 2 ? 'closed' : null; };
export const F30 = t => Math.round(t * 30 * 1000) / 1000;          // seconds -> frames (kept fractional so "ones" stays exact)
export const rad = d => d * Math.PI / 180;
