# Film check: v2r2test.mp4

13 gates: 8 pass, 1 warn, 4 fail. 13.9 s.

| | Gate | Value | Target | Fix |
|-|-|-|-|-|
| FAIL | camera: camera at rest (< 2 px/f), % of frames | 11.49 | >= 30 (Rick median 32) [Rick 5.65-58.02] | longer or more station holds |
| WARN | camera: rests per 10 s | 2.16 | 2.2-3.8, aim 3 (Rick median 3.1; Railroads 2.5, Roller Coasters 2.7) [Rick 0.87-4.74] | too few: break long travels with a resting station; too many: station hopping, merge stations and let one move flow through them |
| FAIL | camera: rest length median, s | 0.33 | >= 0.6 (Rick 0.62) [Rick 0.37-1.28] | raise hold on short stations |
| PASS | camera: travel length p90, s | 2.19 | 2.1-6.3 (Rick median 3.0; Railroads and Roller Coasters 4.7). CB 2026-11-10: the scene decides, but some moves must flow [Rick 1.73-9.52] |  |
| FAIL | camera: speed median, px/f | 10.24 | about 4 (Rick 4.1) [Rick 1.55-14.11] | too high: slow down, rest more; too low: add creep to the rests |
| PASS | camera: speed p90, px/f | 22.92 | <= 25 (Rick 23) [Rick 9.80-33.84] |  |
| FAIL | camera: cuts per 10 s | 2.16 | <= 0.9, aim 0.4 [Rick 0.00-2.50] | merge takes; cut only on place or time jumps |
| PASS | camera: roll rate p99, deg/f | 0.34 | <= 1.1 (Rick 1.08) [Rick 0.26-3.02] |  |
| PASS | camera: whips per minute | 0.0 | <= 10 (Rick 5.8) [Rick 0.00-11.77] |  |
| PASS | camera: camera dead still (< 0.3 px/f), % of frames | 0.73 | <= 21, aim 9 (Rick 9.3) [Rick 1.16-28.76] |  |
| PASS | scan: frozen spans (camera and picture still 12+ f) | 0 | 0: every long hold has a creep or something moving |  |
| PASS | scan: travels longer than 7 s | 0 | 0 (a flowing move of 3-7 s is wanted since 2026-11-10; Rick's long travels reach 4.8-9.5 s) |  |
| PASS | scan: one-frame flashes or A-B-A flickers | 0 | 0 unplanned (planned flashes and washes are fine: confirm each) |  |

Manual, every draft: sound-off test (does each face tell the story muted?); three-point shot check (face changes on its word, key event and its sound land on their word, nothing blocks the face); judge agent score 8.5+ per storyboard panel.
